#!/usr/bin/env python3
"""Summarize an evaluation run or compare it with a previous baseline."""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


def read_object(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def mean(values: list[float]) -> float | None:
    return round(sum(values) / len(values), 2) if values else None


def summarize(run_dir: Path) -> dict[str, Any]:
    run_dir = run_dir.resolve()
    record = read_object(run_dir / "run.json")
    cases = record.get("cases")
    if not isinstance(cases, list) or not cases:
        raise ValueError(f"{run_dir}/run.json has no cases")

    scores: dict[str, float] = {}
    verdicts: Counter[str] = Counter()
    categories: defaultdict[str, list[float]] = defaultdict(list)
    dimensions: defaultdict[str, list[float]] = defaultdict(list)
    case_dimension_scores: dict[str, dict[str, float]] = {}
    missing: list[str] = []
    fatal_count = 0
    defect_tags: Counter[str] = Counter()
    reviewer_ids: set[str] = set()

    for case in cases:
        case_id = case.get("id")
        if not isinstance(case_id, str):
            raise ValueError(f"{run_dir}/run.json contains a case without an ID")
        relative = case.get("scorecard", f"scorecards/{case_id}.json")
        scorecard_path = run_dir / relative
        if not scorecard_path.is_file():
            missing.append(case_id)
            continue
        card = read_object(scorecard_path)
        if card.get("case_id") != case_id:
            raise ValueError(f"Scorecard case mismatch: {scorecard_path}")
        review = card.get("human_review")
        if not isinstance(review, dict):
            raise ValueError(f"Scorecard has no human_review: {scorecard_path}")
        total = review.get("weighted_total")
        if not isinstance(total, (int, float)) or not 0 <= total <= 100:
            raise ValueError(f"Invalid weighted_total: {scorecard_path}")
        total = float(total)
        scores[case_id] = total
        verdicts[str(review.get("verdict", "unknown"))] += 1
        categories[str(case.get("category", "uncategorized"))].append(total)
        fatals = review.get("fatal_errors", [])
        if not isinstance(fatals, list):
            raise ValueError(f"fatal_errors must be an array: {scorecard_path}")
        fatal_count += len(fatals)
        tags = review.get("defect_tags", [])
        if not isinstance(tags, list):
            raise ValueError(f"defect_tags must be an array: {scorecard_path}")
        defect_tags.update(str(tag) for tag in tags)
        reviewer = review.get("reviewer")
        if isinstance(reviewer, dict) and reviewer.get("id"):
            reviewer_ids.add(str(reviewer["id"]))
        dimension_scores = review.get("scores")
        if not isinstance(dimension_scores, dict):
            raise ValueError(f"human_review.scores must be an object: {scorecard_path}")
        case_dimension_scores[case_id] = {}
        for dimension_id, dimension_review in dimension_scores.items():
            if not isinstance(dimension_review, dict):
                raise ValueError(f"Invalid review for {dimension_id}: {scorecard_path}")
            value = dimension_review.get("score")
            if not isinstance(value, (int, float)) or not 0 <= value <= 5:
                raise ValueError(f"Invalid {dimension_id} score: {scorecard_path}")
            numeric_value = float(value)
            dimensions[dimension_id].append(numeric_value)
            case_dimension_scores[case_id][dimension_id] = numeric_value

    return {
        "run_id": record.get("run_id"),
        "suite": record.get("suite"),
        "agent_version": record.get("agent_version"),
        "model": record.get("model"),
        "hypothesis": record.get("hypothesis"),
        "case_count": len(cases),
        "completed_count": len(scores),
        "missing_cases": missing,
        "overall": mean(list(scores.values())),
        "case_scores": dict(sorted(scores.items())),
        "category_scores": {
            category: mean(values) for category, values in sorted(categories.items())
        },
        "dimension_scores": {
            dimension: mean(values) for dimension, values in sorted(dimensions.items())
        },
        "case_dimension_scores": case_dimension_scores,
        "verdicts": dict(sorted(verdicts.items())),
        "fatal_error_count": fatal_count,
        "defect_tags": dict(defect_tags.most_common()),
        "reviewer_ids": sorted(reviewer_ids),
    }


def delta(current: float | None, baseline: float | None) -> float | None:
    if current is None or baseline is None:
        return None
    return round(current - baseline, 2)


def compare(current: dict[str, Any], baseline: dict[str, Any]) -> dict[str, Any]:
    shared_cases = sorted(set(current["case_scores"]) & set(baseline["case_scores"]))
    missing_from_baseline = sorted(
        set(current["case_scores"]) - set(baseline["case_scores"])
    )
    case_deltas = {
        case_id: delta(
            current["case_scores"][case_id], baseline["case_scores"][case_id]
        )
        for case_id in shared_cases
    }
    shared_dimensions = sorted(
        set.intersection(
            *(
                set(current["case_dimension_scores"][case_id])
                & set(baseline["case_dimension_scores"][case_id])
                for case_id in shared_cases
            )
        )
        if shared_cases
        else set()
    )
    dimension_deltas = {}
    for dimension_id in shared_dimensions:
        current_values = [
            current["case_dimension_scores"][case_id][dimension_id]
            for case_id in shared_cases
        ]
        baseline_values = [
            baseline["case_dimension_scores"][case_id][dimension_id]
            for case_id in shared_cases
        ]
        dimension_deltas[dimension_id] = delta(
            mean(current_values), mean(baseline_values)
        )
    current_scope_overall = mean(
        [current["case_scores"][case_id] for case_id in shared_cases]
    )
    baseline_scope_overall = mean(
        [baseline["case_scores"][case_id] for case_id in shared_cases]
    )
    overall_delta = delta(current_scope_overall, baseline_scope_overall)
    fatal_delta = current["fatal_error_count"] - baseline["fatal_error_count"]
    regression_reasons = []
    if overall_delta is not None and overall_delta < -1:
        regression_reasons.append(f"overall score decreased by {abs(overall_delta):.2f}")
    for dimension_id, value in dimension_deltas.items():
        if value is not None and value <= -0.25:
            regression_reasons.append(
                f"{dimension_id} decreased by {abs(value):.2f} on the 0–5 scale"
            )
    if fatal_delta > 0:
        regression_reasons.append(f"fatal errors increased by {fatal_delta}")
    if current["missing_cases"]:
        regression_reasons.append("current run has missing scorecards")
    if missing_from_baseline:
        regression_reasons.append(
            "baseline is missing current case(s): " + ", ".join(missing_from_baseline)
        )
    return {
        "baseline_run_id": baseline["run_id"],
        "comparison_case_count": len(shared_cases),
        "current_scope_overall": current_scope_overall,
        "baseline_scope_overall": baseline_scope_overall,
        "overall_delta": overall_delta,
        "fatal_error_delta": fatal_delta,
        "case_deltas": case_deltas,
        "dimension_deltas": dimension_deltas,
        "regression": bool(regression_reasons),
        "regression_reasons": regression_reasons,
    }


def fmt(value: Any) -> str:
    if value is None:
        return "—"
    if isinstance(value, float):
        return f"{value:.2f}"
    return str(value)


def markdown_report(
    current: dict[str, Any], comparison: dict[str, Any] | None
) -> str:
    lines = [
        f"# Evaluation run: {current['run_id']}",
        "",
        f"- Agent version: {current['agent_version']}",
        f"- Model: {current['model']}",
        f"- Completed: {current['completed_count']}/{current['case_count']}",
        f"- Overall score: {fmt(current['overall'])}/100",
        f"- Fatal errors: {current['fatal_error_count']}",
        f"- Hypothesis: {current['hypothesis']}",
    ]
    if current["missing_cases"]:
        lines.append(f"- Missing scorecards: {', '.join(current['missing_cases'])}")

    if comparison:
        lines.extend(
            [
                "",
                "## Comparison",
                "",
                f"- Baseline: {comparison['baseline_run_id']}",
                f"- Compared cases: {comparison['comparison_case_count']}",
                f"- Baseline score on compared cases: {fmt(comparison['baseline_scope_overall'])}",
                f"- Current score on compared cases: {fmt(comparison['current_scope_overall'])}",
                f"- Overall delta: {fmt(comparison['overall_delta'])}",
                f"- Fatal-error delta: {comparison['fatal_error_delta']:+d}",
                f"- Regression: {'yes' if comparison['regression'] else 'no'}",
            ]
        )
        for reason in comparison["regression_reasons"]:
            lines.append(f"- Regression reason: {reason}")

    lines.extend(["", "## Dimensions", "", "| Dimension | Score | Delta |", "|---|---:|---:|"])
    dimension_deltas = comparison["dimension_deltas"] if comparison else {}
    for dimension, score in current["dimension_scores"].items():
        lines.append(
            f"| {dimension} | {fmt(score)} | {fmt(dimension_deltas.get(dimension))} |"
        )

    lines.extend(["", "## Cases", "", "| Case | Score | Delta |", "|---|---:|---:|"])
    case_deltas = comparison["case_deltas"] if comparison else {}
    for case_id, score in current["case_scores"].items():
        lines.append(
            f"| {case_id} | {fmt(score)} | {fmt(case_deltas.get(case_id))} |"
        )

    lines.extend(["", "## Categories", "", "| Category | Score |", "|---|---:|"])
    for category, score in current["category_scores"].items():
        lines.append(f"| {category} | {fmt(score)} |")
    lines.extend(["", "## Defect tags", "", "| Tag | Cases |", "|---|---:|"])
    if current["defect_tags"]:
        for tag, count in current["defect_tags"].items():
            lines.append(f"| {tag} | {count} |")
    else:
        lines.append("| None | 0 |")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("current_run", type=Path)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    parser.add_argument("--output", type=Path)
    parser.add_argument("--fail-on-regression", action="store_true")
    args = parser.parse_args()

    try:
        current = summarize(args.current_run)
        baseline = summarize(args.baseline) if args.baseline else None
        comparison = compare(current, baseline) if baseline else None
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    payload = {"current": current, "comparison": comparison}
    rendered = (
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
        if args.format == "json"
        else markdown_report(current, comparison)
    )
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
        print(f"Report written to {args.output}")
    else:
        print(rendered, end="")
    if args.fail_on_regression and comparison and comparison["regression"]:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

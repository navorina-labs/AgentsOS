#!/usr/bin/env python3
"""Create or finalize a human-review scorecard for one evaluation response."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

VAGUE = re.compile(
    r"\b(clean|modern|intuitive|beautiful|user-friendly|pixel-perfect|"
    r"чист(?:ый|ая|ое)|современн\w*|интуитивн\w*|красив\w*)\b",
    re.IGNORECASE,
)


def load_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def find_case(manifest: dict[str, Any], case_id: str) -> dict[str, Any]:
    for case in manifest.get("cases", []):
        if case.get("id") == case_id:
            return case
    raise ValueError(f"Unknown case id: {case_id}")


def finalize_scores(
    card: dict[str, Any], scores_path: Path, dimensions: list[dict[str, Any]]
) -> None:
    submitted = load_json(scores_path)
    submitted_scores = submitted.get("scores")
    if not isinstance(submitted_scores, dict):
        raise ValueError("reviewer scores file must contain a 'scores' object")
    fatal_errors = submitted.get("fatal_errors", [])
    if not isinstance(fatal_errors, list):
        raise ValueError("fatal_errors must be an array")
    if not all(isinstance(item, str) and item.strip() for item in fatal_errors):
        raise ValueError("fatal_errors must contain non-empty strings")
    reviewer = submitted.get("reviewer")
    if not isinstance(reviewer, dict) or not reviewer.get("id") or not reviewer.get("role"):
        raise ValueError("reviewer must contain non-empty id and role")
    defect_tags = submitted.get("defect_tags", [])
    if not isinstance(defect_tags, list) or not all(
        isinstance(item, str) and item.strip() for item in defect_tags
    ):
        raise ValueError("defect_tags must be an array of non-empty strings")
    notes = submitted.get("notes")
    if notes is not None and (not isinstance(notes, str) or not notes.strip()):
        raise ValueError("notes must be a non-empty string when provided")

    weighted_total = 0.0
    reviews: dict[str, Any] = {}
    for dimension in dimensions:
        dimension_id = dimension["id"]
        review = submitted_scores.get(dimension_id)
        if not isinstance(review, dict):
            raise ValueError(f"Missing review object for dimension: {dimension_id}")
        score = review.get("score")
        evidence = review.get("evidence")
        justification = review.get("justification")
        if not isinstance(score, (int, float)) or not 0 <= score <= 5:
            raise ValueError(f"Score for {dimension_id} must be between 0 and 5")
        if not isinstance(evidence, str) or not evidence.strip():
            raise ValueError(f"Evidence is required for dimension: {dimension_id}")
        if not isinstance(justification, str) or not justification.strip():
            raise ValueError(f"Justification is required for dimension: {dimension_id}")
        if evidence.casefold().startswith("replace with"):
            raise ValueError(f"Replace placeholder evidence for dimension: {dimension_id}")
        if justification.casefold().startswith("replace with"):
            raise ValueError(
                f"Replace placeholder justification for dimension: {dimension_id}"
            )
        weighted_total += score / 5 * dimension["weight"]
        reviews[dimension_id] = {
            "score": score,
            "evidence": evidence.strip(),
            "justification": justification.strip(),
        }

    weighted_total = round(weighted_total, 2)
    if fatal_errors or weighted_total < 60:
        verdict = "fails baseline" if weighted_total < 60 else "needs revision"
    elif weighted_total < 70:
        verdict = "needs revision"
    elif weighted_total < 80:
        verdict = "competent"
    elif weighted_total < 90:
        verdict = "strong"
    else:
        verdict = "exceptional"
    card["human_review"] = {
        "reviewer": reviewer,
        "scores": reviews,
        "fatal_errors": fatal_errors,
        "defect_tags": defect_tags,
        "notes": notes,
        "weighted_total": weighted_total,
        "verdict": verdict,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("case_id")
    parser.add_argument("response", type=Path)
    parser.add_argument("--scores", type=Path, help="Optional completed human scores JSON")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    try:
        manifest = load_json(args.manifest)
        case = find_case(manifest, args.case_id)
        response = args.response.read_text(encoding="utf-8")
        if not response.strip():
            raise ValueError("Response file is empty")
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    lowered = response.casefold()
    coverage = []
    for terms in case["must_cover"]:
        matches = [term for term in terms if term.casefold() in lowered]
        coverage.append(
            {
                "concept_terms": terms,
                "matched_terms": matches,
                "observed": bool(matches),
            }
        )
    vague = sorted({match.group(0) for match in VAGUE.finditer(response)})
    missing = sum(not item["observed"] for item in coverage)
    rubric = manifest["rubric"]
    dimensions = rubric["dimensions"]
    card: dict[str, Any] = {
        "suite": manifest.get("suite"),
        "case_id": args.case_id,
        "response_file": str(args.response.resolve()),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "automated_checks": {
            "character_count": len(response),
            "coverage": coverage,
            "missing_concept_groups": missing,
            "vague_terms": vague,
            "note": (
                "These checks are reviewer prompts, not a quality score. "
                "Inspect meaning and task fit manually."
            ),
        },
        "review_template": {
            "scale": rubric["scale"],
            "dimensions": [
                {
                    **dimension,
                    "score": None,
                    "evidence": None,
                    "justification": None,
                }
                for dimension in dimensions
            ],
            "fatal_error_candidates": (
                rubric["global_fatal_errors"] + case["case_fatal_errors"]
            ),
        },
    }

    if args.scores:
        try:
            finalize_scores(card, args.scores, dimensions)
        except (OSError, json.JSONDecodeError, ValueError) as exc:
            print(f"[ERROR] {exc}")
            return 1

    rendered = json.dumps(card, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
        print(f"Scorecard written to {args.output}")
    else:
        print(rendered, end="")
    print(
        f"Automated coverage prompt: {len(coverage) - missing}/{len(coverage)} "
        f"concept group(s) observed; human review required."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

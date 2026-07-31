#!/usr/bin/env python3
"""Validate frozen prompts and artifacts for an evaluation run stage."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

STAGES = {"created": 0, "responses": 1, "scorecards": 2, "reviewed": 3}


def read_object(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("run_dir", type=Path)
    parser.add_argument(
        "--stage",
        choices=tuple(STAGES),
        default="scorecards",
        help="Minimum artifact stage that every case must reach",
    )
    args = parser.parse_args()
    required = STAGES[args.stage]
    run_dir = args.run_dir.resolve()
    errors: list[str] = []
    rows: list[tuple[str, str, str]] = []

    try:
        record = read_object(run_dir / "run.json")
        cases = record.get("cases")
        if not isinstance(cases, list) or not cases:
            raise ValueError("run.json cases must be a non-empty array")
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    ids = [case.get("id") for case in cases if isinstance(case, dict)]
    if len(ids) != len(cases) or len(set(ids)) != len(ids) or None in ids:
        errors.append("run contains invalid or duplicate case IDs")

    for case in cases:
        if not isinstance(case, dict) or not isinstance(case.get("id"), str):
            continue
        case_id = case["id"]
        coverage_label = "—"
        try:
            prompt = run_dir / case["prompt_snapshot"]
            if not prompt.is_file():
                raise ValueError("frozen prompt is missing")
            actual_hash = hashlib.sha256(prompt.read_bytes()).hexdigest()
            if actual_hash != case.get("prompt_sha256"):
                raise ValueError("frozen prompt hash changed")
            for asset in case.get("assets", []):
                asset_path = run_dir / asset["snapshot"]
                if not asset_path.is_file():
                    raise ValueError(f"asset is missing: {asset.get('snapshot')}")
                asset_hash = hashlib.sha256(asset_path.read_bytes()).hexdigest()
                if asset_hash != asset.get("sha256"):
                    raise ValueError(f"asset hash changed: {asset.get('snapshot')}")

            if required >= STAGES["responses"]:
                response = run_dir / case["response"]
                log = run_dir / case.get("log", f"logs/{case_id}.jsonl")
                if case.get("status") != "response-captured":
                    raise ValueError("status is not response-captured")
                if not response.is_file() or len(response.read_text(encoding="utf-8").strip()) < 100:
                    raise ValueError("response is missing or too short")
                if not log.is_file() or not log.read_text(encoding="utf-8").strip():
                    raise ValueError("execution log is missing or empty")
                execution = case.get("execution")
                if not isinstance(execution, dict) or not execution.get("model"):
                    raise ValueError("execution metadata is missing")
                expected_artifacts = case.get("collect_artifacts", [])
                captured_artifacts = case.get("captured_artifacts", [])
                if expected_artifacts:
                    if len(captured_artifacts) != len(expected_artifacts):
                        raise ValueError("collected artifact count does not match")
                    for artifact in captured_artifacts:
                        artifact_path = run_dir / artifact["path"]
                        if not artifact_path.is_file():
                            raise ValueError(f"collected artifact is missing: {artifact['path']}")
                        artifact_hash = hashlib.sha256(artifact_path.read_bytes()).hexdigest()
                        if artifact_hash != artifact.get("sha256"):
                            raise ValueError(f"collected artifact changed: {artifact['path']}")

            if required >= STAGES["scorecards"]:
                scorecard = run_dir / case["scorecard"]
                if not scorecard.is_file():
                    raise ValueError("scorecard is missing")
                card = read_object(scorecard)
                if card.get("case_id") != case_id:
                    raise ValueError("scorecard case ID does not match")
                checks = card.get("automated_checks")
                if not isinstance(checks, dict):
                    raise ValueError("automated checks are missing")
                coverage = checks.get("coverage")
                if not isinstance(coverage, list) or not coverage:
                    raise ValueError("coverage checks are missing")
                observed = sum(
                    isinstance(item, dict) and item.get("observed") is True
                    for item in coverage
                )
                coverage_label = f"{observed}/{len(coverage)}"

            if required >= STAGES["reviewed"]:
                review = card.get("human_review")
                if not isinstance(review, dict):
                    raise ValueError("human review is missing")
                total = review.get("weighted_total")
                if not isinstance(total, (int, float)) or not 0 <= total <= 100:
                    raise ValueError("human-review weighted total is invalid")
        except (OSError, json.JSONDecodeError, KeyError, ValueError) as exc:
            errors.append(f"{case_id}: {exc}")
            rows.append((case_id, coverage_label, "error"))
        else:
            rows.append((case_id, coverage_label, "ok"))

    print("case\tcoverage\tintegrity")
    for case_id, coverage, status in rows:
        print(f"{case_id}\t{coverage}\t{status}")
    if errors:
        for error in errors:
            print(f"[ERROR] {error}")
        print(f"Run failed {args.stage} validation with {len(errors)} error(s).")
        return 1
    print(f"Run passed {args.stage} validation: {len(rows)}/{len(cases)} case(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

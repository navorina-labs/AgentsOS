#!/usr/bin/env python3
"""Validate the structure and isolation of a design-agent evaluation suite."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

REQUIRED_DIMENSION_KEYS = {"id", "label", "weight", "review"}
REQUIRED_CASE_KEYS = {
    "id",
    "category",
    "prompt",
    "must_cover",
    "case_fatal_errors",
}


def fail(message: str, errors: list[str]) -> None:
    errors.append(message)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    args = parser.parse_args()
    manifest_path = args.manifest.resolve()
    errors: list[str] = []

    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"[ERROR] Cannot read manifest: {exc}")
        return 1

    if data.get("version") != 1:
        fail("version must be 1", errors)
    rubric = data.get("rubric")
    if not isinstance(rubric, dict):
        fail("rubric must be an object", errors)
        rubric = {}

    dimensions = rubric.get("dimensions", [])
    if not isinstance(dimensions, list) or not dimensions:
        fail("rubric.dimensions must be a non-empty array", errors)
        dimensions = []
    dimension_ids: set[str] = set()
    total_weight = 0
    for index, dimension in enumerate(dimensions):
        if not isinstance(dimension, dict):
            fail(f"dimension {index} must be an object", errors)
            continue
        missing = REQUIRED_DIMENSION_KEYS - dimension.keys()
        if missing:
            fail(f"dimension {index} missing: {', '.join(sorted(missing))}", errors)
        dimension_id = dimension.get("id")
        if not isinstance(dimension_id, str) or not dimension_id:
            fail(f"dimension {index} has invalid id", errors)
        elif dimension_id in dimension_ids:
            fail(f"duplicate dimension id: {dimension_id}", errors)
        else:
            dimension_ids.add(dimension_id)
        weight = dimension.get("weight")
        if not isinstance(weight, int) or weight <= 0:
            fail(f"dimension {dimension_id or index} has invalid weight", errors)
        else:
            total_weight += weight
    if total_weight != 100:
        fail(f"dimension weights must total 100, got {total_weight}", errors)

    scale = rubric.get("scale")
    if not isinstance(scale, dict) or set(scale) != set("012345"):
        fail("rubric.scale must define string keys 0 through 5", errors)
    global_fatal = rubric.get("global_fatal_errors")
    if not isinstance(global_fatal, list) or not global_fatal:
        fail("rubric.global_fatal_errors must be a non-empty array", errors)

    cases = data.get("cases")
    if not isinstance(cases, list) or not cases:
        fail("cases must be a non-empty array", errors)
        cases = []
    case_ids: set[str] = set()
    cases_root = manifest_path.parent / "cases"
    assets_root = manifest_path.parent / "assets"
    for index, case in enumerate(cases):
        if not isinstance(case, dict):
            fail(f"case {index} must be an object", errors)
            continue
        missing = REQUIRED_CASE_KEYS - case.keys()
        if missing:
            fail(f"case {index} missing: {', '.join(sorted(missing))}", errors)
        case_id = case.get("id")
        if not isinstance(case_id, str) or not case_id:
            fail(f"case {index} has invalid id", errors)
        elif case_id in case_ids:
            fail(f"duplicate case id: {case_id}", errors)
        else:
            case_ids.add(case_id)
        prompt_value = case.get("prompt")
        if not isinstance(prompt_value, str):
            fail(f"case {case_id or index} has invalid prompt path", errors)
        else:
            prompt_path = (manifest_path.parent / prompt_value).resolve()
            try:
                prompt_path.relative_to(cases_root.resolve())
            except ValueError:
                fail(f"case {case_id or index} prompt must stay inside evals/cases", errors)
            if not prompt_path.is_file():
                fail(f"case {case_id or index} prompt does not exist: {prompt_value}", errors)
            elif len(prompt_path.read_text(encoding="utf-8").strip()) < 120:
                fail(f"case {case_id or index} prompt is too short", errors)
        must_cover = case.get("must_cover")
        if not isinstance(must_cover, list) or not must_cover:
            fail(f"case {case_id or index} must_cover must be non-empty", errors)
        else:
            for group_index, group in enumerate(must_cover):
                if (
                    not isinstance(group, list)
                    or not group
                    or not all(isinstance(term, str) and term for term in group)
                ):
                    fail(
                        f"case {case_id or index} must_cover group {group_index} is invalid",
                        errors,
                    )
        case_fatal = case.get("case_fatal_errors")
        if not isinstance(case_fatal, list):
            fail(f"case {case_id or index} case_fatal_errors must be an array", errors)
        assets = case.get("assets", [])
        if not isinstance(assets, list):
            fail(f"case {case_id or index} assets must be an array", errors)
            assets = []
        seen_assets: set[str] = set()
        for asset_index, asset in enumerate(assets):
            if not isinstance(asset, dict):
                fail(f"case {case_id or index} asset {asset_index} must be an object", errors)
                continue
            asset_value = asset.get("path")
            role = asset.get("role")
            if not isinstance(asset_value, str) or not asset_value:
                fail(f"case {case_id or index} asset {asset_index} has invalid path", errors)
                continue
            if role not in {"screenshot", "source", "reference"}:
                fail(f"case {case_id or index} asset {asset_index} has invalid role", errors)
            asset_path = (manifest_path.parent / asset_value).resolve()
            try:
                asset_path.relative_to(assets_root.resolve())
            except ValueError:
                fail(f"case {case_id or index} assets must stay inside evals/assets", errors)
            if not asset_path.is_file():
                fail(f"case {case_id or index} asset does not exist: {asset_value}", errors)
            if asset_value in seen_assets:
                fail(f"case {case_id or index} has duplicate asset: {asset_value}", errors)
            seen_assets.add(asset_value)

    if errors:
        for error in errors:
            print(f"[ERROR] {error}")
        print(f"Evaluation suite failed validation with {len(errors)} error(s).")
        return 1
    print(
        f"Evaluation suite is valid: {len(cases)} case(s), "
        f"{len(dimensions)} dimension(s), weights total {total_weight}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

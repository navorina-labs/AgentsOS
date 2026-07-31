#!/usr/bin/env python3
"""Create an immutable evaluation-run workspace with frozen prompt snapshots."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

RUN_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$")


def read_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output_root", type=Path)
    parser.add_argument("--run-id")
    parser.add_argument("--agent-version", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--hypothesis", required=True)
    parser.add_argument("--settings", type=Path, help="Optional JSON object")
    parser.add_argument(
        "--case",
        action="append",
        dest="selected_cases",
        help="Run only this case ID; repeat for multiple cases",
    )
    args = parser.parse_args()

    created_at = datetime.now(timezone.utc)
    run_id = args.run_id or created_at.strftime("%Y%m%dT%H%M%SZ")
    if not RUN_ID.fullmatch(run_id):
        print("[ERROR] run-id must contain only letters, digits, dot, dash, or underscore")
        return 1

    try:
        manifest_path = args.manifest.resolve()
        manifest_bytes = manifest_path.read_bytes()
        manifest = json.loads(manifest_bytes)
        if not isinstance(manifest, dict):
            raise ValueError("manifest must contain a JSON object")
        cases = manifest.get("cases")
        if not isinstance(cases, list) or not cases:
            raise ValueError("manifest cases must be a non-empty array")
        settings = read_json(args.settings) if args.settings else {}
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    by_id = {case.get("id"): case for case in cases if isinstance(case, dict)}
    if len(by_id) != len(cases) or None in by_id:
        print("[ERROR] manifest contains invalid or duplicate case IDs")
        return 1
    if args.selected_cases:
        unknown = sorted(set(args.selected_cases) - set(by_id))
        if unknown:
            print(f"[ERROR] Unknown case ID(s): {', '.join(unknown)}")
            return 1
        selected = [by_id[case_id] for case_id in args.selected_cases]
    else:
        selected = cases

    prompt_data: list[
        tuple[dict[str, Any], Path, bytes, list[tuple[dict[str, Any], Path, bytes]]]
    ] = []
    for case in selected:
        prompt_value = case.get("prompt")
        if not isinstance(prompt_value, str):
            print(f"[ERROR] Invalid prompt path for case {case.get('id')}")
            return 1
        prompt_path = (manifest_path.parent / prompt_value).resolve()
        try:
            content = prompt_path.read_bytes()
        except OSError as exc:
            print(f"[ERROR] Cannot read prompt for {case['id']}: {exc}")
            return 1
        asset_data = []
        for asset in case.get("assets", []):
            if not isinstance(asset, dict) or not isinstance(asset.get("path"), str):
                print(f"[ERROR] Invalid asset for case {case['id']}")
                return 1
            asset_path = (manifest_path.parent / asset["path"]).resolve()
            try:
                asset_content = asset_path.read_bytes()
            except OSError as exc:
                print(f"[ERROR] Cannot read asset for {case['id']}: {exc}")
                return 1
            asset_data.append((asset, asset_path, asset_content))
        prompt_data.append((case, prompt_path, content, asset_data))

    target = (args.output_root.resolve() / run_id)
    if target.exists():
        print(f"[ERROR] Run already exists; refusing to overwrite: {target}")
        return 1

    try:
        for directory in (
            "prompts",
            "responses",
            "reviews",
            "scorecards",
            "logs",
            "assets",
            "outputs",
        ):
            (target / directory).mkdir(parents=True, exist_ok=False)
        run_cases = []
        for case, prompt_path, content, asset_data in prompt_data:
            snapshot = target / "prompts" / f"{case['id']}.md"
            shutil.copyfile(prompt_path, snapshot)
            run_assets = []
            for asset, asset_path, asset_content in asset_data:
                asset_target = target / "assets" / case["id"] / asset_path.name
                asset_target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(asset_path, asset_target)
                run_assets.append(
                    {
                        "role": asset["role"],
                        "snapshot": str(asset_target.relative_to(target)),
                        "sha256": digest(asset_content),
                    }
                )
            run_cases.append(
                {
                    "id": case["id"],
                    "category": case.get("category"),
                    "prompt_snapshot": str(snapshot.relative_to(target)),
                    "prompt_sha256": digest(content),
                    "response": f"responses/{case['id']}.md",
                    "review": f"reviews/{case['id']}.json",
                    "scorecard": f"scorecards/{case['id']}.json",
                    "log": f"logs/{case['id']}.jsonl",
                    "assets": run_assets,
                    "workspace_write": case.get("workspace_write", False),
                    "collect_artifacts": case.get("collect_artifacts", []),
                    "status": "pending",
                }
            )
        run_record = {
            "schema_version": 1,
            "run_id": run_id,
            "suite": manifest.get("suite"),
            "created_at": created_at.isoformat(),
            "agent_version": args.agent_version,
            "model": args.model,
            "settings": settings,
            "hypothesis": args.hypothesis,
            "manifest_path": str(manifest_path),
            "manifest_sha256": digest(manifest_bytes),
            "cases": run_cases,
        }
        (target / "run.json").write_text(
            json.dumps(run_record, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except OSError as exc:
        print(f"[ERROR] Could not create run: {exc}")
        return 1

    print(f"Created evaluation run: {target}")
    print(f"Cases: {len(selected)}")
    print("Give only files from prompts/ to the tested agent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

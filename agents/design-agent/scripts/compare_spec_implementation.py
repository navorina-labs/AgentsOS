#!/usr/bin/env python3
"""Validate and compare a structured UI specification with implementation evidence."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

try:
    import jsonschema
except ImportError:  # pragma: no cover
    jsonschema = None

from check_spec import DEFAULT_SCHEMA, validate_structured

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_EVIDENCE_SCHEMA = ROOT / "references" / "implementation-evidence-schema.json"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_object(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def resolve_bound_path(manifest: Path, value: str) -> Path:
    path = Path(value)
    return path.resolve() if path.is_absolute() else (manifest.parent / path).resolve()


def add_issue(issues: list[dict[str, str]], code: str, path: str, message: str) -> None:
    issues.append({"code": code, "path": path, "message": message})


def compare(
    spec_path: Path,
    evidence_path: Path,
    spec_schema: dict[str, Any],
    evidence_schema: dict[str, Any],
) -> dict[str, Any]:
    spec = load_object(spec_path)
    evidence = load_object(evidence_path)
    issues: list[dict[str, str]] = []

    spec_issues = validate_structured(spec, spec_schema)
    for item in spec_issues:
        if item["severity"] == "high":
            add_issue(issues, "invalid-specification", item["path"], item["message"])

    if jsonschema is None:
        add_issue(issues, "missing-dependency", "$", "jsonschema is required")
    else:
        validator = jsonschema.Draft202012Validator(evidence_schema)
        for error in sorted(validator.iter_errors(evidence), key=lambda item: list(item.path)):
            path = "$" + "".join(
                f"[{part}]" if isinstance(part, int) else f".{part}"
                for part in error.absolute_path
            )
            add_issue(issues, "evidence-schema", path, error.message)

    bound_spec = evidence.get("specification", {})
    if bound_spec.get("sha256") != digest(spec_path):
        add_issue(
            issues,
            "stale-specification-hash",
            "$.specification.sha256",
            "Evidence is not bound to the supplied specification bytes",
        )
    bound_spec_path = bound_spec.get("path")
    if isinstance(bound_spec_path, str):
        resolved = resolve_bound_path(evidence_path, bound_spec_path)
        if resolved != spec_path.resolve():
            add_issue(
                issues,
                "specification-path-mismatch",
                "$.specification.path",
                "Evidence specification path resolves to a different file",
            )

    implementation = evidence.get("implementation", {})
    implementation_path = implementation.get("path")
    if isinstance(implementation_path, str):
        resolved_implementation = resolve_bound_path(evidence_path, implementation_path)
        if not resolved_implementation.is_file():
            add_issue(
                issues,
                "missing-implementation",
                "$.implementation.path",
                "Bound implementation file does not exist",
            )
        elif implementation.get("sha256") != digest(resolved_implementation):
            add_issue(
                issues,
                "stale-implementation-hash",
                "$.implementation.sha256",
                "Evidence is not bound to the current implementation bytes",
            )

    contracts = {
        item["id"]: item
        for item in spec.get("contracts", [])
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    ready_ids = {
        contract_id
        for contract_id, contract in contracts.items()
        if contract.get("status") != "requires_decision"
    }
    unresolved_ids = sorted(set(contracts) - ready_ids)
    results: dict[str, dict[str, Any]] = {}

    for index, item in enumerate(evidence.get("contract_results", [])):
        contract_id = item.get("contract_id")
        if contract_id in results:
            add_issue(
                issues,
                "duplicate-contract-result",
                f"$.contract_results[{index}].contract_id",
                f"Duplicate result for {contract_id}",
            )
            continue
        if contract_id not in contracts:
            add_issue(
                issues,
                "unknown-contract",
                f"$.contract_results[{index}].contract_id",
                f"Unknown contract ID: {contract_id}",
            )
            continue
        if contract_id in unresolved_ids:
            add_issue(
                issues,
                "unresolved-contract-scored",
                f"$.contract_results[{index}].contract_id",
                f"{contract_id} requires a decision and must not be scored",
            )
            continue
        results[contract_id] = item

        assertions = item.get("assertions", [])
        values = [assertion.get("passed") for assertion in assertions]
        status = item.get("status")
        if status == "pass" and (not assertions or any(value is not True for value in values)):
            add_issue(
                issues,
                "invalid-pass",
                f"$.contract_results[{index}]",
                "pass requires one or more assertions and every assertion must pass",
            )
        elif status == "fail" and not any(value is False for value in values):
            add_issue(
                issues,
                "invalid-fail",
                f"$.contract_results[{index}]",
                "fail requires at least one false assertion",
            )
        elif status == "unverified" and any(value is False for value in values):
            add_issue(
                issues,
                "hidden-failure",
                f"$.contract_results[{index}]",
                "unverified must not hide a false assertion",
            )

    missing_ids = sorted(ready_ids - set(results))
    counts = {"pass": 0, "fail": 0, "unverified": len(missing_ids)}
    rows = []
    for contract_id in sorted(ready_ids):
        item = results.get(contract_id)
        status = item.get("status") if item else "unverified"
        counts[status] += 1 if item else 0
        rows.append(
            {
                "contract_id": contract_id,
                "requirement": contracts[contract_id].get("requirement"),
                "status": status,
                "assertion_count": len(item.get("assertions", [])) if item else 0,
                "notes": item.get("notes", "") if item else "No evidence result supplied",
            }
        )

    if issues:
        verdict = "invalid"
    elif counts["fail"]:
        verdict = "does_not_conform"
    elif counts["unverified"]:
        verdict = "inconclusive"
    else:
        verdict = "conforms"

    return {
        "valid": not issues,
        "verdict": verdict,
        "counts": counts,
        "implementation_ready_contracts": len(ready_ids),
        "unresolved_dependencies": unresolved_ids,
        "missing_evidence": missing_ids,
        "rows": rows,
        "issues": issues,
        "evidence_boundaries": evidence.get("evidence_boundaries", []),
    }


def print_text(result: dict[str, Any]) -> None:
    print(f"Verdict: {result['verdict']}")
    counts = result["counts"]
    print(
        f"Contracts: {counts['pass']} pass, {counts['fail']} fail, "
        f"{counts['unverified']} unverified; "
        f"{len(result['unresolved_dependencies'])} unresolved"
    )
    for row in result["rows"]:
        print(f"- {row['contract_id']}: {row['status']} ({row['assertion_count']} assertion(s))")
    for issue in result["issues"]:
        print(f"[HIGH] {issue['code']} {issue['path']}: {issue['message']}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("specification", type=Path)
    parser.add_argument("evidence", type=Path)
    parser.add_argument("--spec-schema", type=Path, default=DEFAULT_SCHEMA)
    parser.add_argument("--evidence-schema", type=Path, default=DEFAULT_EVIDENCE_SCHEMA)
    parser.add_argument("--format", choices=("text", "json"), default="text")
    args = parser.parse_args()
    try:
        result = compare(
            args.specification.resolve(),
            args.evidence.resolve(),
            load_object(args.spec_schema.resolve()),
            load_object(args.evidence_schema.resolve()),
        )
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"[HIGH] input $: {exc}", file=sys.stderr)
        return 1
    if args.format == "json":
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print_text(result)
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Validate Markdown coverage or a structured Design Agent UI specification."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

try:
    import jsonschema
except ImportError:  # pragma: no cover - environment-dependent
    jsonschema = None


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SCHEMA = ROOT / "references" / "ui-spec-schema.json"

MARKDOWN_CHECKS = {
    "goal and user": (r"\b(goal|purpose|user|job|цель|пользовател)", "high"),
    "flow or information architecture": (
        r"\b(flow|journey|information architecture|поток|сценари|архитектур)",
        "high",
    ),
    "layout and hierarchy": (
        r"\b(layout|grid|hierarchy|композиц|сетк|иерарх)",
        "high",
    ),
    "components": (r"\b(component|control|компонент|контрол)", "medium"),
    "interaction states": (
        r"\b(hover|focus|pressed|loading|empty|error|disabled|состояни|ошибк|загрузк)",
        "high",
    ),
    "responsive behavior": (
        r"\b(responsive|adaptive|breakpoint|viewport|адаптив|брейкпоинт)",
        "high",
    ),
    "accessibility": (
        r"\b(accessibility|wcag|keyboard|screen reader|доступност|клавиатур)",
        "high",
    ),
    "content and edge cases": (
        r"\b(content|localization|overflow|edge case|контент|локализац|краев)",
        "medium",
    ),
    "acceptance criteria": (
        r"\b(acceptance|given|when|then|критери|дано|когда|тогда)",
        "high",
    ),
    "evidence or decisions": (
        r"\b(evidence|source|confidence|trade-off|источник|уверенност|компромисс)",
        "medium",
    ),
}

VAGUE = re.compile(
    r"\b(clean|modern|intuitive|beautiful|user-friendly|pixel-perfect|"
    r"чист(?:ый|ая|ое)|современн\w*|интуитивн\w*|красив\w*)\b",
    re.IGNORECASE,
)

REQUIRED_ACCEPTANCE_COVERAGE = {
    "core_task",
    "state",
    "responsive",
    "accessibility",
    "content_stress",
    "recovery",
}

INTERACTIVE_STATES = {
    "default",
    "focus_visible",
    "disabled",
    "loading",
    "error",
    "success",
}


def pointer(path: list[Any]) -> str:
    if not path:
        return "$"
    return "$." + ".".join(str(part) for part in path)


def add_issue(
    issues: list[dict[str, str]],
    severity: str,
    code: str,
    path: str,
    message: str,
) -> None:
    issues.append(
        {
            "severity": severity,
            "code": code,
            "path": path,
            "message": message,
        }
    )


def validate_markdown(path: Path) -> list[dict[str, str]]:
    text = path.read_text(encoding="utf-8")
    issues: list[dict[str, str]] = []
    for label, (pattern, severity) in MARKDOWN_CHECKS.items():
        if not re.search(pattern, text, re.IGNORECASE):
            add_issue(
                issues,
                severity,
                "missing-coverage",
                "$",
                f"Missing coverage: {label}",
            )
    vague = sorted(set(match.group(0) for match in VAGUE.finditer(text)))
    if vague:
        add_issue(
            issues,
            "medium",
            "vague-language",
            "$",
            "Replace vague adjectives with observable requirements: "
            + ", ".join(vague),
        )
    return issues


def collect_ids(
    data: dict[str, Any], issues: list[dict[str, str]]
) -> tuple[dict[str, set[str]], dict[str, str]]:
    collections = [
        "evidence",
        "decisions",
        "contracts",
        "flows",
        "views",
        "components",
        "acceptance_criteria",
        "open_questions",
    ]
    ids: dict[str, set[str]] = {}
    global_owner: dict[str, str] = {}
    for collection in collections:
        ids[collection] = set()
        for index, item in enumerate(data.get(collection, [])):
            item_id = item.get("id")
            if not isinstance(item_id, str):
                continue
            if item_id in ids[collection]:
                add_issue(
                    issues,
                    "high",
                    "duplicate-id",
                    f"$.{collection}[{index}].id",
                    f"Duplicate id in {collection}: {item_id}",
                )
            ids[collection].add(item_id)
            if item_id in global_owner:
                add_issue(
                    issues,
                    "high",
                    "duplicate-global-id",
                    f"$.{collection}[{index}].id",
                    f"ID {item_id} is already used in {global_owner[item_id]}",
                )
            else:
                global_owner[item_id] = collection
    return ids, global_owner


def check_refs(
    items: list[dict[str, Any]],
    field: str,
    valid: set[str],
    base: str,
    issues: list[dict[str, str]],
) -> None:
    for index, item in enumerate(items):
        refs = item.get(field, [])
        if isinstance(refs, str):
            refs = [refs]
        for ref in refs:
            if ref not in valid:
                add_issue(
                    issues,
                    "high",
                    "broken-reference",
                    f"$.{base}[{index}].{field}",
                    f"Unknown reference: {ref}",
                )


def validate_structured(
    data: dict[str, Any], schema: dict[str, Any]
) -> list[dict[str, str]]:
    issues: list[dict[str, str]] = []
    if jsonschema is None:
        add_issue(
            issues,
            "high",
            "missing-dependency",
            "$",
            "Python package jsonschema is required for structured validation",
        )
        return issues

    validator = jsonschema.Draft202012Validator(schema)
    for error in sorted(validator.iter_errors(data), key=lambda item: list(item.path)):
        add_issue(
            issues,
            "high",
            "schema",
            pointer(list(error.absolute_path)),
            error.message,
        )

    ids, _ = collect_ids(data, issues)
    evidence_ids = ids.get("evidence", set())
    decision_ids = ids.get("decisions", set())
    contract_ids = ids.get("contracts", set())
    component_ids = ids.get("components", set())
    question_ids = ids.get("open_questions", set())

    decisions = data.get("decisions", [])
    contracts = data.get("contracts", [])
    views = data.get("views", [])
    components = data.get("components", [])
    criteria = data.get("acceptance_criteria", [])

    check_refs(decisions, "evidence_ids", evidence_ids, "decisions", issues)
    check_refs(contracts, "evidence_ids", evidence_ids, "contracts", issues)
    check_refs(contracts, "decision_id", decision_ids, "contracts", issues)
    check_refs(contracts, "open_question_id", question_ids, "contracts", issues)
    check_refs(views, "component_ids", component_ids, "views", issues)
    check_refs(views, "contract_ids", contract_ids, "views", issues)
    check_refs(components, "contract_ids", contract_ids, "components", issues)
    check_refs(
        criteria,
        "verifies_contract_ids",
        contract_ids,
        "acceptance_criteria",
        issues,
    )

    for index, decision in enumerate(decisions):
        status = decision.get("status")
        if status == "confirmed" and not decision.get("evidence_ids"):
            add_issue(
                issues,
                "high",
                "unsupported-confirmed-decision",
                f"$.decisions[{index}]",
                "Confirmed decisions require at least one evidence id",
            )
        if status == "requires_decision":
            question = decision.get("open_question_id")
            if not question:
                add_issue(
                    issues,
                    "high",
                    "missing-open-question",
                    f"$.decisions[{index}]",
                    "requires_decision must reference an open question",
                )
            elif question not in question_ids:
                add_issue(
                    issues,
                    "high",
                    "broken-reference",
                    f"$.decisions[{index}].open_question_id",
                    f"Unknown open question: {question}",
                )

    for index, contract in enumerate(contracts):
        status = contract.get("status")
        if status == "confirmed" and not contract.get("evidence_ids"):
            add_issue(
                issues,
                "high",
                "unsupported-confirmed-contract",
                f"$.contracts[{index}]",
                "Confirmed contracts require at least one evidence id",
            )
        if status == "proposed_default_validate" and not contract.get(
            "decision_id"
        ):
            add_issue(
                issues,
                "high",
                "untracked-proposed-default",
                f"$.contracts[{index}]",
                "Proposed defaults must reference the decision that labels the trade-off",
            )
        if status == "requires_decision" and not contract.get("open_question_id"):
            add_issue(
                issues,
                "high",
                "missing-open-question",
                f"$.contracts[{index}]",
                "requires_decision contracts must reference an open question",
            )

    covered_contracts = {
        contract_id
        for criterion in criteria
        for contract_id in criterion.get("verifies_contract_ids", [])
    }
    for index, contract in enumerate(contracts):
        if (
            contract.get("status") != "requires_decision"
            and contract.get("id") not in covered_contracts
        ):
            add_issue(
                issues,
                "high",
                "unverified-contract",
                f"$.contracts[{index}].id",
                f"Contract {contract.get('id')} has no acceptance criterion",
            )

    observed_coverage = {
        area
        for criterion in criteria
        for area in criterion.get("covers", [])
    }
    for area in sorted(REQUIRED_ACCEPTANCE_COVERAGE - observed_coverage):
        add_issue(
            issues,
            "high",
            "missing-acceptance-coverage",
            "$.acceptance_criteria",
            f"No acceptance criterion covers {area}",
        )

    for index, component in enumerate(components):
        if not component.get("interactive"):
            continue
        states = set(component.get("states", []))
        not_applicable = set(component.get("not_applicable_states", {}))
        for state in sorted(INTERACTIVE_STATES - states - not_applicable):
            add_issue(
                issues,
                "high",
                "missing-component-state",
                f"$.components[{index}]",
                f"Interactive component must specify or mark not applicable: {state}",
            )

    serialized = json.dumps(data, ensure_ascii=False)
    vague = sorted(set(match.group(0) for match in VAGUE.finditer(serialized)))
    if vague:
        add_issue(
            issues,
            "medium",
            "vague-language",
            "$",
            "Replace vague adjectives with observable requirements: "
            + ", ".join(vague),
        )
    return issues


def print_text(issues: list[dict[str, str]], kind: str) -> None:
    if not issues:
        print(f"{kind} specification validation passed.")
        return
    for issue in issues:
        print(
            f"[{issue['severity'].upper()}] {issue['code']} "
            f"{issue['path']}: {issue['message']}"
        )
    high = sum(issue["severity"] == "high" for issue in issues)
    medium = sum(issue["severity"] == "medium" for issue in issues)
    print(f"Summary: {len(issues)} issue(s), {high} high, {medium} medium.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("spec", type=Path)
    parser.add_argument(
        "--schema",
        type=Path,
        default=DEFAULT_SCHEMA,
        help="JSON Schema used for structured .json specifications",
    )
    parser.add_argument(
        "--kind",
        choices=("auto", "markdown", "structured"),
        default="auto",
        help="Validation mode; auto detects a raw JSON object even in a .md eval response",
    )
    parser.add_argument("--format", choices=("text", "json"), default="text")
    args = parser.parse_args()

    spec = args.spec.expanduser().resolve()
    raw = spec.read_text(encoding="utf-8")
    stripped = raw.lstrip()
    structured = args.kind == "structured" or (
        args.kind == "auto"
        and (spec.suffix.casefold() == ".json" or stripped.startswith("{"))
    )
    if structured:
        data = json.loads(raw)
        schema = json.loads(args.schema.read_text(encoding="utf-8"))
        issues = validate_structured(data, schema)
        kind = "Structured"
    else:
        issues = validate_markdown(spec)
        kind = "Markdown"

    result = {
        "spec": str(spec),
        "kind": kind.casefold(),
        "valid": not any(issue["severity"] == "high" for issue in issues),
        "issues": issues,
        "summary": {
            "total": len(issues),
            "high": sum(issue["severity"] == "high" for issue in issues),
            "medium": sum(issue["severity"] == "medium" for issue in issues),
        },
    }
    if args.format == "json":
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print_text(issues, kind)
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, json.JSONDecodeError) as exc:
        print(f"[HIGH] input $: {exc}", file=sys.stderr)
        raise SystemExit(1)

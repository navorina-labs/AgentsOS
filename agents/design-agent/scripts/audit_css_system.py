#!/usr/bin/env python3
"""Inventory CSS tokens, repeated literals, foundations, and selector evidence."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import tinycss2


STYLE_BLOCK = re.compile(r"<style(?:\s[^>]*)?>(.*?)</style>", re.IGNORECASE | re.DOTALL)
VAR_REF = re.compile(r"var\(\s*(--[A-Za-z0-9_-]+)")
COLOR_LITERAL = re.compile(
    r"#[0-9A-Fa-f]{3,8}\b|"
    r"(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^)]*\)",
    re.IGNORECASE,
)
LENGTH_LITERAL = re.compile(
    r"(?<![A-Za-z0-9_.-])-?(?:\d*\.)?\d+(?:px|rem|em|ch|vw|vh|vmin|vmax|%)\b",
    re.IGNORECASE,
)
TIME_LITERAL = re.compile(r"(?<![A-Za-z0-9_.-])(?:\d*\.)?\d+(?:ms|s)\b", re.IGNORECASE)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def serialize(tokens: list[Any]) -> str:
    return tinycss2.serialize(tokens).strip()


def line_number(css_start_line: int, relative_line: int | None) -> int | None:
    if relative_line is None:
        return None
    return css_start_line + relative_line - 1


def category_for(property_name: str) -> list[str]:
    name = property_name.casefold()
    categories = []
    if (
        name == "color"
        or "color" in name
        or name in {"background", "background-color", "fill", "stroke", "accent-color"}
    ):
        categories.append("color")
    if name in {"box-shadow", "text-shadow"}:
        categories.append("shadow")
    if "radius" in name:
        categories.append("radius")
    if (
        name.startswith(("margin", "padding", "inset"))
        or name in {"gap", "row-gap", "column-gap"}
    ):
        categories.append("spacing")
    if name in {
        "font",
        "font-family",
        "font-size",
        "font-weight",
        "line-height",
        "letter-spacing",
        "text-transform",
    }:
        categories.append("typography")
    if name.startswith(("transition", "animation")) or name in {
        "transform",
        "will-change",
    }:
        categories.append("motion")
    if name in {
        "width",
        "height",
        "min-width",
        "min-height",
        "max-width",
        "max-height",
    }:
        categories.append("sizing")
    return categories


def parse_rule_list(
    rules: list[Any],
    css_start_line: int,
    at_context: list[str],
    declarations: list[dict[str, Any]],
    custom_properties: list[dict[str, Any]],
) -> None:
    for rule in rules:
        if rule.type == "qualified-rule":
            selector = serialize(rule.prelude)
            parsed = tinycss2.parse_declaration_list(
                rule.content, skip_comments=True, skip_whitespace=True
            )
            for item in parsed:
                if item.type != "declaration":
                    continue
                name = item.lower_name
                value = serialize(item.value)
                record = {
                    "selector": selector,
                    "at_context": list(at_context),
                    "property": name,
                    "value": value,
                    "important": bool(item.important),
                    "line": line_number(css_start_line, item.source_line),
                    "categories": category_for(name),
                    "token_refs": VAR_REF.findall(value),
                    "color_literals": COLOR_LITERAL.findall(value),
                    "length_literals": LENGTH_LITERAL.findall(value),
                    "time_literals": TIME_LITERAL.findall(value),
                }
                declarations.append(record)
                if name.startswith("--"):
                    custom_properties.append(record)
        elif rule.type == "at-rule" and rule.content is not None:
            prelude = serialize(rule.prelude)
            context_label = f"@{rule.lower_at_keyword} {prelude}".strip()
            nested = tinycss2.parse_rule_list(
                rule.content, skip_comments=True, skip_whitespace=True
            )
            parse_rule_list(
                nested,
                css_start_line,
                [*at_context, context_label],
                declarations,
                custom_properties,
            )


def group_literal_usage(
    declarations: list[dict[str, Any]], key: str
) -> list[dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for declaration in declarations:
        if declaration["property"].startswith("--"):
            continue
        for literal in declaration[key]:
            grouped[literal.casefold()].append(
                {
                    "selector": declaration["selector"],
                    "property": declaration["property"],
                    "line": declaration["line"],
                    "at_context": declaration["at_context"],
                }
            )
    return [
        {"value": value, "count": len(uses), "uses": uses}
        for value, uses in sorted(
            grouped.items(), key=lambda item: (-len(item[1]), item[0])
        )
    ]


def grouped_property_values(
    declarations: list[dict[str, Any]], category: str
) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for declaration in declarations:
        if declaration["property"].startswith("--"):
            continue
        if category not in declaration["categories"]:
            continue
        key = (declaration["property"], declaration["value"])
        grouped[key].append(
            {
                "selector": declaration["selector"],
                "line": declaration["line"],
                "at_context": declaration["at_context"],
            }
        )
    return [
        {
            "property": property_name,
            "value": value,
            "count": len(uses),
            "uses": uses,
        }
        for (property_name, value), uses in sorted(
            grouped.items(), key=lambda item: (-len(item[1]), item[0])
        )
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    try:
        html = args.html.expanduser().resolve(strict=True)
        source = html.read_text(encoding="utf-8")
        matches = list(STYLE_BLOCK.finditer(source))
        if not matches:
            raise ValueError("No <style> block found")
    except (OSError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    output = args.output.expanduser().resolve()
    if output.exists() and not args.force:
        print(f"[ERROR] Refusing to overwrite existing audit: {output}")
        return 1
    output.parent.mkdir(parents=True, exist_ok=True)

    declarations: list[dict[str, Any]] = []
    custom_properties: list[dict[str, Any]] = []
    media_queries: list[str] = []
    for match in matches:
        css = match.group(1)
        css_start_line = source.count("\n", 0, match.start(1)) + 1
        rules = tinycss2.parse_stylesheet(
            css, skip_comments=True, skip_whitespace=True
        )
        parse_rule_list(rules, css_start_line, [], declarations, custom_properties)
        for rule in rules:
            if rule.type == "at-rule":
                media_queries.append(
                    f"@{rule.lower_at_keyword} {serialize(rule.prelude)}".strip()
                )

    definitions_by_name: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for definition in custom_properties:
        definitions_by_name[definition["property"]].append(
            {
                "value": definition["value"],
                "selector": definition["selector"],
                "line": definition["line"],
                "at_context": definition["at_context"],
            }
        )

    refs: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for declaration in declarations:
        for token in declaration["token_refs"]:
            refs[token].append(
                {
                    "selector": declaration["selector"],
                    "property": declaration["property"],
                    "line": declaration["line"],
                    "at_context": declaration["at_context"],
                }
            )

    token_inventory = []
    for name in sorted(set(definitions_by_name) | set(refs)):
        token_inventory.append(
            {
                "name": name,
                "definitions": definitions_by_name.get(name, []),
                "usage_count": len(refs.get(name, [])),
                "uses": refs.get(name, []),
                "defined": name in definitions_by_name,
            }
        )

    category_counts = Counter()
    for declaration in declarations:
        category_counts.update(declaration["categories"])

    property_counts = Counter(
        declaration["property"]
        for declaration in declarations
        if not declaration["property"].startswith("--")
    )
    selector_counts = Counter(declaration["selector"] for declaration in declarations)

    color_literals = group_literal_usage(declarations, "color_literals")
    length_literals = group_literal_usage(declarations, "length_literals")
    time_literals = group_literal_usage(declarations, "time_literals")

    audit = {
        "schema_version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source": {"file": html.name, "sha256": sha256(html)},
        "scope": {
            "style_blocks": len(matches),
            "declarations": len(declarations),
            "selectors": len(selector_counts),
            "media_queries": sorted(set(media_queries)),
            "boundary": (
                "This inventory describes only the supplied HTML style blocks. It does "
                "not prove a product-wide design system, runtime theme coverage, rendered "
                "contrast, component ownership, adoption, or cross-repository usage."
            ),
        },
        "summary": {
            "custom_property_count": len(definitions_by_name),
            "custom_property_reference_count": sum(len(items) for items in refs.values()),
            "undefined_token_refs": sorted(set(refs) - set(definitions_by_name)),
            "unused_defined_tokens": sorted(set(definitions_by_name) - set(refs)),
            "category_declaration_counts": dict(sorted(category_counts.items())),
            "top_properties": [
                {"property": name, "count": count}
                for name, count in property_counts.most_common(20)
            ],
            "top_selectors": [
                {"selector": name, "declaration_count": count}
                for name, count in selector_counts.most_common(20)
            ],
        },
        "tokens": token_inventory,
        "literal_inventories": {
            "colors": color_literals,
            "lengths": length_literals,
            "times": time_literals,
        },
        "repeated_raw_candidates": {
            "colors": [item for item in color_literals if item["count"] >= 2],
            "lengths": [item for item in length_literals if item["count"] >= 3],
            "times": [item for item in time_literals if item["count"] >= 2],
            "boundary": (
                "Frequency is migration evidence, not proof that every repeated value "
                "deserves a token. Consolidate only values with shared semantic intent."
            ),
        },
        "foundation_property_values": {
            category: grouped_property_values(declarations, category)
            for category in (
                "color",
                "spacing",
                "radius",
                "shadow",
                "typography",
                "motion",
                "sizing",
            )
        },
        "evidence_boundaries": {
            "literal": (
                "A raw literal is source-confirmed. It is not automatically a defect or "
                "a new semantic-token candidate."
            ),
            "token_name": (
                "A custom-property name suggests intent but does not prove role-correct "
                "usage, theming, governance, documentation, or adoption."
            ),
            "contrast": (
                "Color values alone do not prove rendered foreground/background pairs or "
                "contrast. Measure exact rendered pairs in each state and appearance."
            ),
            "component": (
                "Selectors and repeated declarations suggest component boundaries but do "
                "not prove a reusable component API or shared implementation."
            ),
            "visual": (
                "Source inventory cannot establish optical quality, state distinction, "
                "interaction behavior, or cross-viewport appearance without renders."
            ),
        },
    }
    output.write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"CSS system audit written: {output}")
    print(
        f"Declarations: {len(declarations)}; tokens: {len(definitions_by_name)}; "
        f"repeated raw colors: {len(audit['repeated_raw_candidates']['colors'])}; "
        f"repeated raw lengths: {len(audit['repeated_raw_candidates']['lengths'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

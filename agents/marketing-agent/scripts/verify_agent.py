#!/usr/bin/env python3
"""Verify the distributable Marketing & SEO Agent without external packages."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/marketing-system.md",
    "references/seo-system.md",
    "references/measurement.md",
    "references/source-policy.md",
    "scripts/audit_page.py",
    "evals/manifest.json",
]


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    for relative in REQUIRED:
        if not (ROOT / relative).is_file():
            fail(f"missing required file: {relative}")

    skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    frontmatter = re.match(r"^---\n(.*?)\n---\n", skill, re.DOTALL)
    if not frontmatter:
        fail("SKILL.md must start with YAML frontmatter")
    header = frontmatter.group(1)
    if not re.search(r"^name:\s+marketing-agent$", header, re.MULTILINE):
        fail("skill name must be marketing-agent")
    description = re.search(r"^description:\s+(.+)$", header, re.MULTILINE)
    if not description or len(description.group(1)) < 80:
        fail("skill description must explain capabilities and triggers")
    if "TODO" in skill:
        fail("SKILL.md contains TODO placeholders")

    manifest = json.loads((ROOT / "evals" / "manifest.json").read_text(encoding="utf-8"))
    cases = manifest.get("cases", [])
    if len(cases) < 5:
        fail("eval manifest must include at least five cases")
    ids = [case.get("id") for case in cases]
    if len(ids) != len(set(ids)) or any(not case_id for case_id in ids):
        fail("eval case ids must be present and unique")
    for case in cases:
        case_path = ROOT / "evals" / case.get("path", "")
        if not case_path.is_file():
            fail(f"missing eval case: {case_path.relative_to(ROOT)}")

    print(f"Marketing Agent verified: {len(REQUIRED)} required files, {len(cases)} eval cases")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

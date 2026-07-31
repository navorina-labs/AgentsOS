import json
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "audit_page.py"
FIXTURES = Path(__file__).resolve().parent / "fixtures"

sys.path.insert(0, str(ROOT))
from scripts.audit_page import audit_html, render_markdown  # noqa: E402


class AuditPageTests(unittest.TestCase):
    def test_healthy_page_passes_baseline(self) -> None:
        html = (FIXTURES / "healthy.html").read_text(encoding="utf-8")
        report = audit_html(html, "https://example.com/marketing-agent")

        self.assertEqual(100, report["readiness_score"])
        self.assertEqual(0, report["summary"]["failed"])
        self.assertIn("not a ranking", report["score_note"])

    def test_broken_page_reports_actionable_failures(self) -> None:
        html = (FIXTURES / "broken.html").read_text(encoding="utf-8")
        report = audit_html(html, "https://example.com/broken")
        failed_ids = {finding["id"] for finding in report["findings"] if not finding["passed"]}

        self.assertLess(report["readiness_score"], 50)
        self.assertTrue({"indexing", "title", "description", "h1", "image-alt", "json-ld"}.issubset(failed_ids))

    def test_intentionally_non_indexable_page_can_pass_indexing_check(self) -> None:
        html = '<html lang="en"><head><meta name="robots" content="noindex"></head></html>'
        report = audit_html(html, "https://example.com/private", expected_indexable=False)
        indexing = next(finding for finding in report["findings"] if finding["id"] == "indexing")

        self.assertTrue(indexing["passed"])

    def test_none_directive_and_relative_canonical_are_not_misreported(self) -> None:
        html = '<html><head><meta name="robots" content="none"><link rel="canonical" href="/relative"></head></html>'
        report = audit_html(html, "https://example.com/page")
        findings = {finding["id"]: finding for finding in report["findings"]}

        self.assertFalse(findings["indexing"]["passed"])
        self.assertFalse(findings["canonical"]["passed"])

    def test_markdown_contains_limits_and_actions(self) -> None:
        html = (FIXTURES / "broken.html").read_text(encoding="utf-8")
        markdown = render_markdown(audit_html(html, "https://example.com/broken"))

        self.assertIn("## Prioritized actions", markdown)
        self.assertIn("## Not measured", markdown)
        self.assertIn("CRITICAL", markdown)

    def test_cli_emits_valid_json(self) -> None:
        result = subprocess.run(
            [sys.executable, str(SCRIPT), str(FIXTURES / "healthy.html"), "--format", "json"],
            check=True,
            capture_output=True,
            text=True,
        )

        report = json.loads(result.stdout)
        self.assertEqual(100, report["readiness_score"])


if __name__ == "__main__":
    unittest.main()

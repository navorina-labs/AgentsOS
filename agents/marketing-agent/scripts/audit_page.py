#!/usr/bin/env python3
"""Audit observable SEO and sharing readiness for one HTML page."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import urlparse
from urllib.error import HTTPError
from urllib.request import Request, urlopen


MAX_BYTES = 2_000_000
GENERIC_LINK_TEXT = {"click here", "here", "learn more", "more", "read more"}


@dataclass
class Finding:
    id: str
    category: str
    severity: str
    passed: bool
    evidence: str
    recommendation: str
    weight: int


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = ""
        self.title_parts: list[str] = []
        self.headings: list[dict[str, str]] = []
        self.metas: list[dict[str, str]] = []
        self.links: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.canonicals: list[str] = []
        self.json_ld_blocks: list[str] = []
        self._capture: str | None = None
        self._buffer: list[str] = []
        self._active_link: dict[str, str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_map = {key.lower(): value or "" for key, value in attrs}
        tag = tag.lower()

        if tag == "html":
            self.lang = attrs_map.get("lang", "").strip()
        elif tag == "meta":
            self.metas.append(attrs_map)
        elif tag == "link" and "canonical" in attrs_map.get("rel", "").lower().split():
            self.canonicals.append(attrs_map.get("href", "").strip())
        elif tag == "img":
            self.images.append(attrs_map)
        elif tag == "a":
            self._active_link = {"href": attrs_map.get("href", "").strip(), "text": ""}
            self._capture = "a"
            self._buffer = []
        elif tag == "title" or tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._capture = tag
            self._buffer = []
        elif tag == "script" and attrs_map.get("type", "").lower() == "application/ld+json":
            self._capture = "json-ld"
            self._buffer = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if self._capture == "a" and tag == "a":
            if self._active_link is not None:
                self._active_link["text"] = normalized_text(self._buffer)
                self.links.append(self._active_link)
            self._active_link = None
            self._capture = None
            self._buffer = []
        elif self._capture == "title" and tag == "title":
            self.title_parts.append(normalized_text(self._buffer))
            self._capture = None
            self._buffer = []
        elif self._capture in {"h1", "h2", "h3", "h4", "h5", "h6"} and tag == self._capture:
            self.headings.append({"level": tag, "text": normalized_text(self._buffer)})
            self._capture = None
            self._buffer = []
        elif self._capture == "json-ld" and tag == "script":
            self.json_ld_blocks.append("".join(self._buffer).strip())
            self._capture = None
            self._buffer = []

    def handle_data(self, data: str) -> None:
        if self._capture is not None:
            self._buffer.append(data)


def normalized_text(parts: list[str]) -> str:
    return " ".join("".join(parts).split())


def meta_content(metas: list[dict[str, str]], *, name: str = "", prop: str = "") -> str:
    for meta in metas:
        if name and meta.get("name", "").lower() == name.lower():
            return meta.get("content", "").strip()
        if prop and meta.get("property", "").lower() == prop.lower():
            return meta.get("content", "").strip()
    return ""


def load_source(source: str) -> tuple[str, str, int | None, str]:
    parsed = urlparse(source)
    if parsed.scheme in {"http", "https"}:
        request = Request(
            source,
            headers={"User-Agent": "AgentsOS-Marketing-Agent/0.1 (+https://github.com/navorina-labs/AgentsOS)"},
        )
        try:
            response_context = urlopen(request, timeout=15)
        except HTTPError as error:
            response_context = error
        with response_context as response:
            payload = response.read(MAX_BYTES + 1)
            if len(payload) > MAX_BYTES:
                raise ValueError(f"page exceeds {MAX_BYTES} byte audit limit")
            charset = response.headers.get_content_charset() or "utf-8"
            html = payload.decode(charset, errors="replace")
            return html, response.geturl(), response.status, response.headers.get("Content-Type", "")

    if parsed.scheme:
        raise ValueError("source must be an http(s) URL or a local HTML file")

    path = Path(source).expanduser().resolve()
    if not path.is_file():
        raise ValueError(f"file not found: {path}")
    if path.stat().st_size > MAX_BYTES:
        raise ValueError(f"file exceeds {MAX_BYTES} byte audit limit")
    return path.read_text(encoding="utf-8"), path.as_uri(), None, "text/html"


def audit_html(
    html: str,
    source: str,
    *,
    status: int | None = None,
    content_type: str = "text/html",
    expected_indexable: bool = True,
) -> dict[str, Any]:
    parser = PageParser()
    parser.feed(html)

    title = normalized_text(parser.title_parts)
    description = meta_content(parser.metas, name="description")
    robots_values = [
        meta_content(parser.metas, name="robots").lower(),
        meta_content(parser.metas, name="googlebot").lower(),
    ]
    robots = ", ".join(value for value in robots_values if value)
    viewport = meta_content(parser.metas, name="viewport")
    og_title = meta_content(parser.metas, prop="og:title")
    og_description = meta_content(parser.metas, prop="og:description")
    canonical = parser.canonicals[0] if parser.canonicals else ""
    h1s = [heading["text"] for heading in parser.headings if heading["level"] == "h1"]
    missing_alt = [image.get("src", "") or "<inline image>" for image in parser.images if "alt" not in image]
    generic_links = [link for link in parser.links if link["text"].strip().lower() in GENERIC_LINK_TEXT]
    empty_links = [link for link in parser.links if link["href"] and not link["text"]]
    crawlable_links = [link for link in parser.links if link["href"] and not link["href"].startswith(("#", "javascript:"))]
    json_ld_errors: list[str] = []
    for index, block in enumerate(parser.json_ld_blocks, start=1):
        try:
            json.loads(block)
        except json.JSONDecodeError as error:
            json_ld_errors.append(f"block {index}: {error.msg}")

    robots_directives = {part.strip() for part in robots.replace(";", ",").split(",")}
    noindex = "noindex" in robots_directives or "none" in robots_directives
    canonical_absolute = bool(canonical and urlparse(canonical).scheme in {"http", "https"})
    response_ok = status is None or 200 <= status < 300

    findings = [
        Finding("response", "eligibility", "critical", response_ok, f"HTTP status: {status or 'local file'}", "Return a stable 2xx response for the intended canonical page.", 15),
        Finding("content-type", "eligibility", "high", "html" in content_type.lower(), f"Content-Type: {content_type or 'not reported'}", "Serve the page with an HTML content type.", 8),
        Finding("indexing", "eligibility", "critical", noindex != expected_indexable, f"robots meta: {robots or 'not set'}; expected indexable: {expected_indexable}", "Align robots directives with the page's intended search eligibility.", 15),
        Finding("title", "meaning", "high", bool(title), f"title: {title or 'missing'}", "Add a concise, descriptive, page-specific title.", 10),
        Finding("description", "meaning", "medium", bool(description), f"meta description: {description or 'missing'}", "Add a useful page-specific description for search snippets and sharing fallbacks.", 6),
        Finding("h1", "meaning", "medium", bool(h1s), f"H1 count: {len(h1s)}; values: {h1s or 'none'}", "Provide a visible main heading that describes the page's primary purpose.", 7),
        Finding("canonical", "eligibility", "medium", canonical_absolute, f"canonical: {canonical or 'missing'}", "Declare the preferred absolute canonical URL when this page is intended for search.", 6),
        Finding("language", "meaning", "low", bool(parser.lang), f"html lang: {parser.lang or 'missing'}", "Declare the document language on the html element.", 3),
        Finding("viewport", "experience", "medium", bool(viewport), f"viewport: {viewport or 'missing'}", "Add a responsive viewport declaration and verify mobile usability.", 5),
        Finding("image-alt", "meaning", "medium", not missing_alt, f"images: {len(parser.images)}; missing alt attribute: {len(missing_alt)}", "Give meaningful images concise alternatives and decorative images an empty alt attribute.", 6),
        Finding("link-text", "architecture", "low", not generic_links and not empty_links, f"generic links: {len(generic_links)}; empty links: {len(empty_links)}", "Use link text that communicates the destination or action out of context.", 4),
        Finding("crawlable-links", "architecture", "info", bool(crawlable_links), f"crawlable links found: {len(crawlable_links)}", "Connect important pages with ordinary crawlable links where applicable.", 0),
        Finding("json-ld", "meaning", "medium", not json_ld_errors, f"JSON-LD blocks: {len(parser.json_ld_blocks)}; parse errors: {json_ld_errors or 'none'}", "Fix invalid JSON-LD and verify that markup matches visible content and an eligible search feature.", 5),
        Finding("social-preview", "distribution", "low", bool(og_title and og_description), f"og:title: {'present' if og_title else 'missing'}; og:description: {'present' if og_description else 'missing'}", "Add accurate Open Graph title and description for shared-link previews.", 4),
    ]

    weighted = [finding for finding in findings if finding.weight]
    total_weight = sum(finding.weight for finding in weighted)
    passed_weight = sum(finding.weight for finding in weighted if finding.passed)
    score = round((passed_weight / total_weight) * 100) if total_weight else 0

    return {
        "agent": "AgentsOS Marketing & SEO Agent",
        "audit_version": "0.1.0",
        "audited_at": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "readiness_score": score,
        "score_note": "Observable implementation coverage; not a ranking, traffic, or revenue prediction.",
        "summary": {
            "passed": sum(1 for finding in weighted if finding.passed),
            "failed": sum(1 for finding in weighted if not finding.passed),
            "informational": sum(1 for finding in findings if not finding.weight),
        },
        "page": {
            "title": title,
            "meta_description": description,
            "canonical": canonical,
            "language": parser.lang,
            "headings": parser.headings,
            "links": len(parser.links),
            "images": len(parser.images),
            "json_ld_blocks": len(parser.json_ld_blocks),
        },
        "findings": [asdict(finding) for finding in findings],
        "not_measured": [
            "index coverage and rankings",
            "search demand and intent fit",
            "rendered JavaScript parity",
            "robots.txt and XML sitemap",
            "field Core Web Vitals",
            "backlinks and brand mentions",
            "organic conversions and revenue",
            "content originality, accuracy, and customer value",
        ],
    }


def render_markdown(report: dict[str, Any]) -> str:
    lines = [
        f"# SEO readiness audit: {report['source']}",
        "",
        f"**Readiness score:** {report['readiness_score']}/100",
        "",
        f"> {report['score_note']}",
        "",
        "## Findings",
        "",
        "| Status | Severity | Category | Finding | Evidence |",
        "| --- | --- | --- | --- | --- |",
    ]
    for finding in report["findings"]:
        status = "PASS" if finding["passed"] else "FAIL"
        evidence = finding["evidence"].replace("|", "\\|").replace("\n", " ")
        lines.append(f"| {status} | {finding['severity']} | {finding['category']} | {finding['id']} | {evidence} |")

    failed = [finding for finding in report["findings"] if not finding["passed"] and finding["weight"]]
    lines.extend(["", "## Prioritized actions", ""])
    if failed:
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}
        failed.sort(key=lambda finding: (severity_order[finding["severity"]], -finding["weight"]))
        for finding in failed:
            lines.append(f"- **{finding['severity'].upper()} — {finding['id']}:** {finding['recommendation']}")
    else:
        lines.append("- No failed baseline checks. Continue with the non-observable review below.")

    lines.extend(["", "## Not measured", ""])
    lines.extend(f"- {item}" for item in report["not_measured"])
    lines.append("")
    return "\n".join(lines)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", help="http(s) URL or local HTML file")
    parser.add_argument("--format", choices=("json", "markdown"), default="markdown")
    parser.add_argument("--output", help="write the report to this file instead of stdout")
    parser.add_argument("--indexable", choices=("yes", "no"), default="yes", help="whether the page is intended for search")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        html, source, status, content_type = load_source(args.source)
        report = audit_html(
            html,
            source,
            status=status,
            content_type=content_type,
            expected_indexable=args.indexable == "yes",
        )
    except (OSError, ValueError) as error:
        print(f"audit failed: {error}", file=sys.stderr)
        return 2

    output = json.dumps(report, ensure_ascii=False, indent=2) + "\n" if args.format == "json" else render_markdown(report)
    if args.output:
        Path(args.output).expanduser().write_text(output, encoding="utf-8")
    else:
        print(output, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

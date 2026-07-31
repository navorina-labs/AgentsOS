#!/usr/bin/env python3
"""Create a provenance-preserving JSONL knowledge index from owned source files."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SUPPORTED = {".md", ".markdown", ".txt", ".pdf"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Chunk Markdown, text, or PDF sources into a searchable JSONL index."
    )
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--title")
    parser.add_argument("--author")
    parser.add_argument("--edition")
    parser.add_argument("--license", dest="license_name")
    parser.add_argument("--chunk-words", type=int, default=320)
    parser.add_argument("--overlap-words", type=int, default=60)
    return parser.parse_args()


def source_files(path: Path) -> list[Path]:
    if path.is_file():
        return [path]
    if not path.is_dir():
        raise ValueError(f"Source does not exist: {path}")
    return sorted(p for p in path.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED)


def extract_pdf(path: Path) -> list[tuple[str, str]]:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise RuntimeError("PDF ingestion requires `python3 -m pip install pypdf`.") from exc
    reader = PdfReader(str(path))
    return [
        (f"page {number}", page.extract_text() or "")
        for number, page in enumerate(reader.pages, start=1)
    ]


def extract_text(path: Path) -> list[tuple[str, str]]:
    if path.suffix.lower() == ".pdf":
        return extract_pdf(path)
    text = path.read_text(encoding="utf-8")
    sections: list[tuple[str, str]] = []
    heading = "document"
    buffer: list[str] = []
    for line in text.splitlines():
        if path.suffix.lower() in {".md", ".markdown"} and re.match(r"^#{1,6}\s+\S", line):
            if buffer:
                sections.append((heading, "\n".join(buffer)))
            heading = re.sub(r"^#{1,6}\s+", "", line).strip()
            buffer = []
        else:
            buffer.append(line)
    if buffer:
        sections.append((heading, "\n".join(buffer)))
    return sections or [("document", text)]


def chunks(text: str, size: int, overlap: int) -> list[str]:
    words = re.findall(r"\S+", text)
    if not words:
        return []
    if size <= 0 or overlap < 0 or overlap >= size:
        raise ValueError("Use chunk-words > 0 and 0 <= overlap-words < chunk-words.")
    step = size - overlap
    return [" ".join(words[start : start + size]) for start in range(0, len(words), step)]


def main() -> int:
    args = parse_args()
    try:
        files = source_files(args.source)
        if not files:
            raise ValueError(f"No supported files found under {args.source}")
        args.output.parent.mkdir(parents=True, exist_ok=True)
        ingested_at = datetime.now(timezone.utc).isoformat()
        records = 0
        with args.output.open("w", encoding="utf-8") as output:
            for file in files:
                digest = hashlib.sha256(file.read_bytes()).hexdigest()
                title = args.title if len(files) == 1 and args.title else file.stem
                for locator, section_text in extract_text(file):
                    for index, content in enumerate(
                        chunks(section_text, args.chunk_words, args.overlap_words), start=1
                    ):
                        record = {
                            "id": hashlib.sha256(
                                f"{digest}:{locator}:{index}:{content}".encode()
                            ).hexdigest()[:20],
                            "text": content,
                            "title": title,
                            "author": args.author,
                            "edition": args.edition,
                            "license": args.license_name,
                            "source_path": str(file.resolve()),
                            "source_sha256": digest,
                            "locator": locator,
                            "chunk": index,
                            "ingested_at": ingested_at,
                        }
                        output.write(json.dumps(record, ensure_ascii=False) + "\n")
                        records += 1
        print(f"Wrote {records} chunks from {len(files)} file(s) to {args.output}")
        return 0
    except (OSError, ValueError, RuntimeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

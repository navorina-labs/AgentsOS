#!/usr/bin/env python3
"""Search a JSONL knowledge index with a small dependency-free BM25 scorer."""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from collections import Counter
from pathlib import Path


def tokens(text: str) -> list[str]:
    return re.findall(r"[\w-]{2,}", text.casefold(), flags=re.UNICODE)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Rank indexed passages for a design question.")
    parser.add_argument("index", type=Path)
    parser.add_argument("query")
    parser.add_argument("--top", type=int, default=8)
    parser.add_argument("--json", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        records = [
            json.loads(line)
            for line in args.index.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
        if not records:
            raise ValueError("Index is empty.")
        query = Counter(tokens(args.query))
        if not query:
            raise ValueError("Query contains no searchable terms.")
        documents = [tokens(record.get("text", "")) for record in records]
        document_frequency = Counter(
            term for document in documents for term in set(document) if term in query
        )
        average_length = sum(map(len, documents)) / len(documents)
        scored = []
        for record, document in zip(records, documents):
            frequencies = Counter(document)
            score = 0.0
            for term, query_frequency in query.items():
                frequency = frequencies[term]
                if not frequency:
                    continue
                inverse_frequency = math.log(
                    1 + (len(documents) - document_frequency[term] + 0.5)
                    / (document_frequency[term] + 0.5)
                )
                denominator = frequency + 1.5 * (
                    1 - 0.75 + 0.75 * len(document) / max(average_length, 1)
                )
                score += inverse_frequency * (frequency * 2.5 / denominator) * query_frequency
            if score:
                scored.append((score, record))
        results = sorted(scored, key=lambda item: item[0], reverse=True)[: max(args.top, 0)]
        if args.json:
            print(json.dumps(
                [{"score": round(score, 4), **record} for score, record in results],
                ensure_ascii=False,
                indent=2,
            ))
        else:
            for rank, (score, record) in enumerate(results, start=1):
                locator = record.get("locator") or "unknown locator"
                print(f"{rank}. {record.get('title', 'Untitled')} — {locator} — score {score:.3f}")
                print(f"   {record.get('text', '')}")
        return 0
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

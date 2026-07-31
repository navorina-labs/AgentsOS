#!/usr/bin/env bash
# Build arXiv preprint PDF from paper-draft.md (LaTeX + arxiv.sty + Tectonic)
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v tectonic >/dev/null 2>&1; then
  echo "error: tectonic not found. Install: brew install tectonic" >&2
  exit 1
fi

pandoc paper-draft.md \
  -o arxiv-paper.tex \
  --template=arxiv-pandoc.latex \
  --syntax-highlighting=none

pandoc paper-draft.md \
  -s \
  -o arxiv-paper.html \
  --css=arxiv-academic.css \
  --syntax-highlighting=none

pandoc paper-draft.md \
  -o arxiv-paper.pdf \
  --template=arxiv-pandoc.latex \
  --pdf-engine=tectonic \
  --syntax-highlighting=none

echo "Built: arxiv-paper.tex, arxiv-paper.html, arxiv-paper.pdf ($(wc -c < arxiv-paper.pdf | tr -d ' ') bytes)"

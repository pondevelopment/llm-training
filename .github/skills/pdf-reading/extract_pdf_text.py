#!/usr/bin/env python3
"""Extract text from a PDF into a UTF-8 .txt file.

This script is intentionally dependency-light:
- If `pypdf` is available, it will use it.
- Else, if `pdftotext` is available on PATH (Poppler), it will use that.

Outputs are written with `\n` newlines.

Examples:
    python3 .github/skills/pdf-reading/extract_pdf_text.py path/to/paper.pdf
    python3 .github/skills/pdf-reading/extract_pdf_text.py path/to/paper.pdf --out tmp/paper.txt
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


def _normalize_newlines(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


def _extract_with_pypdf(pdf_path: Path) -> str:
    try:
        from pypdf import PdfReader  # type: ignore
    except Exception as exc:  # pragma: no cover
        raise RuntimeError("pypdf not available") from exc

    reader = PdfReader(str(pdf_path))
    parts: list[str] = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text:
            parts.append(page_text)
    return "\n\n".join(parts)


def _extract_with_pdftotext(pdf_path: Path) -> str:
    if not shutil.which("pdftotext"):
        raise RuntimeError("pdftotext not available")

    # Use stdout to avoid encoding surprises in intermediate files.
    # -layout keeps columns somewhat readable for tables.
    proc = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if proc.returncode != 0:
        stderr = (proc.stderr or "").strip()
        raise RuntimeError(f"pdftotext failed (exit {proc.returncode}): {stderr}")
    return proc.stdout or ""


def extract_text(pdf_path: Path) -> tuple[str, str]:
    """Return (text, backend_name)."""
    errors: list[str] = []

    try:
        return _extract_with_pypdf(pdf_path), "pypdf"
    except Exception as exc:
        errors.append(f"pypdf: {exc}")

    try:
        return _extract_with_pdftotext(pdf_path), "pdftotext"
    except Exception as exc:
        errors.append(f"pdftotext: {exc}")

    raise RuntimeError(
        "No PDF text extraction backend succeeded.\n"
        "Tried:\n- " + "\n- ".join(errors) + "\n\n"
        "Install one of:\n"
        "- Python package `pypdf` (pip install pypdf)\n"
        "- Poppler `pdftotext` (ensure `pdftotext` is on PATH)\n"
    )


def _default_out_path(pdf_path: Path) -> Path:
    repo_root = Path(__file__).resolve().parents[3]
    out_dir = repo_root / "tmp"
    out_dir.mkdir(parents=True, exist_ok=True)
    return out_dir / (pdf_path.stem + ".txt")


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Extract PDF text into a .txt file")
    parser.add_argument("pdf", help="Path to a PDF file")
    parser.add_argument("--out", help="Output .txt path (defaults to tmp/<pdf>.txt)")
    args = parser.parse_args(argv)

    pdf_path = Path(args.pdf).expanduser().resolve()
    if not pdf_path.exists() or not pdf_path.is_file():
        print(f"ERROR: PDF not found: {pdf_path}", file=sys.stderr)
        return 2
    if pdf_path.suffix.lower() != ".pdf":
        print(f"ERROR: Not a .pdf file: {pdf_path}", file=sys.stderr)
        return 2

    out_path = Path(args.out).expanduser().resolve() if args.out else _default_out_path(pdf_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        text, backend = extract_text(pdf_path)
    except Exception as exc:
        print(str(exc).rstrip(), file=sys.stderr)
        return 3

    text = _normalize_newlines(text)

    # Write as UTF-8 with \n line endings regardless of platform.
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)

    size = out_path.stat().st_size
    print(f"Wrote {out_path} ({size} bytes) using {backend}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

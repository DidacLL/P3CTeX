#!/usr/bin/env python3
"""Build the versioned P3CTeX user distribution (Python standard library only)."""

from __future__ import annotations

import hashlib
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
VERSION = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", VERSION):
    sys.exit("VERSION must be MAJOR.MINOR.PATCH")

PACKAGE_NAME = f"P3CTeX-v{VERSION}"
ZIP_PATH = DIST / f"{PACKAGE_NAME}.zip"
CHECKSUM_PATH = DIST / f"{PACKAGE_NAME}.sha256"
IMAGE_TYPES = {".png", ".jpg", ".jpeg", ".svg", ".eps"}
EXAMPLE_TYPES = IMAGE_TYPES | {".tex", ".bib", ".pdf", ".md"}
DOCUMENT_TYPES = IMAGE_TYPES | {".tex", ".pdf", ".md"}


def included(path: Path) -> bool:
    """Allow only installed sources/resources, manuals and user examples."""
    if re.search(r"\.px(?:src|mem)-.*\.tex$", path.name):
        return False
    rel = path.relative_to(ROOT)
    parts = rel.parts
    if "tests" in parts or "test" in parts:
        return False
    if len(parts) == 1:
        return rel.name in {"README.md", "LICENSE", "VERSION"}
    if parts[:2] == ("tex", "latex"):
        return path.suffix in {".cls", ".sty"}
    if parts[:2] == ("tex", "code"):
        return path.name.endswith(".code.tex") or path.suffix.lower() in IMAGE_TYPES
    if parts[:2] == ("tex", "doc"):
        return path.suffix.lower() in DOCUMENT_TYPES
    if parts[0] == "examples":
        return path.suffix.lower() in EXAMPLE_TYPES
    return False


def source_files() -> list[Path]:
    paths: set[Path] = set()
    for item in ("README.md", "LICENSE", "VERSION"):
        paths.add(ROOT / item)
    for directory in ("tex/latex", "tex/code", "tex/doc", "examples"):
        base = ROOT / directory
        if not base.is_dir():
            sys.exit(f"Missing distribution directory: {directory}")
        paths.update(path for path in base.rglob("*") if path.is_file() and included(path))
    if any(path.is_symlink() for path in paths):
        sys.exit("Refusing to package symlinks")
    required = {"tex/latex/P3CTeX.cls", "tex/code/P3CTeX.code.tex", "tex/code/pxGDX.code.tex", "tex/latex/pxTFG.sty", "tex/latex/pxMEM.sty"}
    actual = {path.relative_to(ROOT).as_posix() for path in paths}
    if not required <= actual:
        sys.exit(f"Missing required package files: {sorted(required - actual)}")
    if not any(path.startswith("tex/doc/") for path in actual):
        sys.exit("No documentation files selected")
    if not any(path.startswith("examples/") for path in actual):
        sys.exit("No examples selected")
    return sorted(paths, key=lambda path: path.relative_to(ROOT).as_posix())


def build() -> None:
    DIST.mkdir(exist_ok=True)
    paths = source_files()
    # Fixed timestamps, permissions and entry order produce reproducible ZIP bytes.
    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in paths:
            name = f"{PACKAGE_NAME}/{path.relative_to(ROOT).as_posix()}"
            entry = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o644 << 16
            archive.writestr(entry, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)

    expected = {f"{PACKAGE_NAME}/{path.relative_to(ROOT).as_posix()}" for path in paths}
    with zipfile.ZipFile(ZIP_PATH) as archive:
        entries = set(archive.namelist())
        if entries != expected or archive.testzip() is not None:
            sys.exit("Release ZIP validation failed")
        if any("/tests/" in entry or "/.github/" in entry or "/workflow/" in entry for entry in entries):
            sys.exit("Development files found in release ZIP")

    digest = hashlib.sha256(ZIP_PATH.read_bytes()).hexdigest()
    CHECKSUM_PATH.write_text(f"{digest}  {ZIP_PATH.name}\n", encoding="ascii")
    print(f"Packaged {len(paths)} files: {ZIP_PATH.relative_to(ROOT)}")
    print(f"SHA256: {digest}")


if __name__ == "__main__":
    build()

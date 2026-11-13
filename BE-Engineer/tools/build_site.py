#!/usr/bin/env python3
"""Gom BE-Engineer/notes/*.md thành một trang HTML để đọc (Markdown vẫn là nguồn chuẩn).

Chạy:  python3 BE-Engineer/tools/build_site.py
Ra:    BE-Engineer/site/notes.html   (mở thẳng bằng trình duyệt, chạy offline)

Chỉ dùng thư viện chuẩn. Markdown được render trên trình duyệt bằng marked (GFM),
nhúng sẵn từ tools/vendor/ cùng highlight.js, nên không cần mạng (chỉ font Google là cần mạng,
không có thì dùng font hệ thống),
nên bảng, <details>, anchor tiếng Việt kiểu GitHub giữ nguyên như khi xem trên GitHub.
Thư mục con của notes/ (vd capstone có nội dung nội bộ) KHÔNG được đưa vào, trừ khi
thêm vào INCLUDE_SUBDIRS.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # BE-Engineer/
NOTES = ROOT / "notes"
TEMPLATE = Path(__file__).resolve().parent / "site_template.html"
VENDOR = Path(__file__).resolve().parent / "vendor"
OUT_DIR = ROOT / "site"
INCLUDE_SUBDIRS: list[str] = []                         # vd ["capstone-oop-solid-erp"]
REPO_BASE = "https://github.com/cuongvu12a/CTDL_GT/blob/master/BE-Engineer/"


def title_of(md: str, fallback: str) -> str:
    m = re.search(r"^#\s+(.+)$", md, re.M)
    t = m.group(1).strip() if m else fallback
    t = re.sub(r"^D\d+\s*[:·.-]\s*", "", t)               # "D8: Coupling…" -> "Coupling…"
    return re.sub(r"\s*\(tổng hợp\)\s*$", "", t)


def tag_of(stem: str) -> str:
    m = re.match(r"d(\d+)", stem)
    return f"D{int(m.group(1))}" if m else "Phụ lục"


def sort_key(p: Path) -> tuple[int, int, str]:
    m = re.match(r"d(\d+)", p.stem)
    return (0, int(m.group(1)), p.name) if m else (1, 0, p.name)


def last_modified(p: Path) -> str:
    """Ngày sửa cuối: lấy từ git nếu file đã commit và không đổi, không thì lấy mtime."""
    try:
        dirty = subprocess.run(["git", "status", "--porcelain", "--", str(p)], cwd=ROOT,
                               capture_output=True, text=True, timeout=5).stdout.strip()
        if not dirty:
            out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", str(p)], cwd=ROOT,
                                 capture_output=True, text=True, timeout=5).stdout.strip()
            if out:
                y, m, d = out.split("-")
                return f"{d}/{m}/{y}"
    except (OSError, subprocess.SubprocessError):
        pass
    return datetime.fromtimestamp(p.stat().st_mtime).strftime("%d/%m/%Y")


def collect() -> list[dict[str, object]]:
    files = sorted(NOTES.glob("*.md"), key=sort_key)
    for sub in INCLUDE_SUBDIRS:
        files += sorted((NOTES / sub).glob("*.md"))
    docs = []
    for p in files:
        md = p.read_text(encoding="utf-8")
        rel = p.relative_to(NOTES).as_posix()
        docs.append({
            "id": re.sub(r"[^a-z0-9-]+", "-", rel.removesuffix(".md").lower()).strip("-"),
            "file": rel,
            "tag": tag_of(p.stem),
            "title": title_of(md, p.stem),
            "words": len(re.findall(r"\w+", md)),
            "modified": last_modified(p),
            "md": md,
        })
    return docs


def main() -> int:
    docs = collect()
    if not docs:
        print("Không có file .md nào trong", NOTES, file=sys.stderr)
        return 1
    data = {
        "built": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "notesDir": "notes",
        "repoBase": REPO_BASE,
        "docs": docs,
    }
    # "</" phải escape để chuỗi "</script>" trong note không đóng thẻ <script> sớm
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    page = TEMPLATE.read_text(encoding="utf-8")
    for marker, lib in (("/*__MARKED__*/", "marked-12.0.2.min.js"), ("/*__HLJS__*/", "highlight-11.9.0.min.js")):
        page = page.replace(marker, (VENDOR / lib).read_text(encoding="utf-8").replace("</script", "<\\/script"), 1)
    page = page.replace("/*__DATA__*/", payload, 1)

    OUT_DIR.mkdir(exist_ok=True)
    out = OUT_DIR / "notes.html"
    html = ('<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + page.replace('<div class="topbar">', '</head>\n<body>\n<div class="topbar">', 1)
            + "\n</body>\n</html>\n")
    out.write_text(html, encoding="utf-8")
    for stale in ("index.html", "local.html"):
        (OUT_DIR / stale).unlink(missing_ok=True)

    print(f"{len(docs)} bài → {out} ({out.stat().st_size / 1024:.0f} KB)")
    for d in docs:
        print(f"  {d['tag']:>7}  {d['file']}  ({d['words']} từ)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""PostToolUse hook (Write|Edit): khi một file BE-Engineer/notes/*.md vừa được ghi,
build lại BE-Engineer/site/notes.html. Thành công thì im lặng, lỗi thì báo cho Claude.

Đọc JSON của hook từ stdin. File không thuộc notes/ thì thoát im lặng.
"""
import json
import subprocess
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
ROOT = TOOLS.parent                     # BE-Engineer/
NOTES = ROOT / "notes"


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except ValueError:
        return 0
    inp = payload.get("tool_input") or {}
    resp = payload.get("tool_response") or {}
    raw = inp.get("file_path") or resp.get("filePath") or ""
    if not raw.endswith(".md"):
        return 0
    path = Path(raw).resolve()
    if NOTES not in path.parents:
        return 0
    if INCLUDE_ONLY_TOP and path.parent != NOTES:
        return 0

    res = subprocess.run([sys.executable, str(TOOLS / "build_site.py")],
                         capture_output=True, text=True, timeout=60)
    if res.returncode == 0:
        return 0
    msg = f"build_site.py lỗi khi build lại notes.html:\n{res.stderr.strip()[-1500:]}"
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": msg}},
                     ensure_ascii=False))
    return 0


INCLUDE_ONLY_TOP = True   # thư mục con (vd capstone) không có trong trang, khỏi build

if __name__ == "__main__":
    sys.exit(main())

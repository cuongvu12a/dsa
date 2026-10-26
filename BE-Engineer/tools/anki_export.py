"""Xuất thẻ Anki ra file TSV để import vào Anki. Hướng dẫn đầy đủ: BE-Engineer/anki/README.md

Chạy:  python3 BE-Engineer/tools/anki_export.py
Ra:
- BE-Engineer/anki/be-concepts.tsv      từ mục "Thẻ Anki" của notes/dNN-*.md
                                        (note type "BE Concept", deck "BE::Concepts")
- BE-Engineer/anki/be-dsa-patterns.tsv  từ bảng trong anki/dsa-patterns.md
                                        (note type "BE DSA Pattern", deck "BE::DSA-Pattern")

GUID: thẻ lý thuyết = "be-dNN-<thứ tự trong mục>", thẻ DSA = "be-dsa-<số bài>". Import lại sau
khi sửa thì Anki cập nhật thẻ cũ (giữ lịch ôn), không tạo bản trùng. Vì vậy thẻ lý thuyết chỉ
THÊM vào cuối mục, đừng chèn giữa.
"""

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTES = ROOT / "notes"
ANKI = ROOT / "anki"
OUT = ANKI / "be-concepts.tsv"
DSA_SRC = ANKI / "dsa-patterns.md"
DSA_OUT = ANKI / "be-dsa-patterns.tsv"

# Tuần / chủ đề của từng ngày. Thêm dòng khi có note mới.
DAYS = {
    1: ("w01", "big-o"),
    2: ("w01", "oop"),
    3: ("w01", "composition"),
    4: ("w01", "solid"),
    5: ("w01", "solid"),
}

CARD_START = [
    re.compile(r"^\d+\.\s+\*\*(?P<q>.+)\*\*\s*$"),          # 1. **Câu hỏi**
    re.compile(r"^\*\*Thẻ \d+\.\*\*\s+\*(?P<q>.+)\*\s*$"),  # **Thẻ 1.** *Câu hỏi*
    re.compile(r"^-\s+\*\*(?P<q>.+)\*\*\s*$"),               # - **Câu hỏi**
]


def md_inline_to_html(text: str) -> str:
    parts = re.split(r"(`[^`]+`)", text)
    out = []
    for p in parts:
        if p.startswith("`") and p.endswith("`") and len(p) > 1:
            out.append(f"<code>{html.escape(p[1:-1], quote=False)}</code>")
            continue
        p = html.escape(p, quote=False)
        p = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", p)
        p = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<i>\1</i>", p)
        out.append(p)
    return "".join(out)


def tier_of(line: str, current: str) -> str:
    if "🔴" in line:
        return "t1"
    if "🟡" in line:
        return "t2"
    if "🟦" in line:
        return "ts"
    return current


def extract(path: Path, day: int) -> list[list[str]]:
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next(i for i, l in enumerate(lines) if re.match(r"^## \d+\. Thẻ Anki", l))
    end = next((i for i in range(start + 1, len(lines)) if re.match(r"^## \d+\.", lines[i])), len(lines))
    week, topic = DAYS[day]
    tier = "t1"
    cards: list[list[str]] = []
    q: str | None = None
    answer: list[str] = []

    def flush() -> None:
        if q is not None:
            n = len(cards) + 1
            a = "<br>".join(md_inline_to_html(x.strip()) for x in answer if x.strip())
            src = f"{path.name} · mục Thẻ Anki"
            tags = f"be::{week}::d{day:02d} be::topic::{topic} be::tier::{tier}"
            cards.append([f"be-d{day:02d}-{n}", md_inline_to_html(q), a, src, tags])

    for line in lines[start + 1:end]:
        if line.strip() == "---":
            continue
        m = next((r.match(line) for r in CARD_START if r.match(line)), None)
        if m:
            flush()
            q, answer = m.group("q"), []
            continue
        if q is None or (not line.startswith((" ", "\t")) and line.startswith(("**🔴", "**🟡", "**🟦", ">"))):
            flush() if q is not None else None
            q, answer = None, []
            tier = tier_of(line, tier)
            continue
        answer.append(line)
    flush()
    return cards


def extract_dsa(path: Path) -> list[list[str]]:
    """Mỗi dòng bảng: | Ngày | Bài | Signal | Pattern | Idea | Complexity |"""
    rows: list[list[str]] = []
    seen: dict[str, int] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != 6 or not re.fullmatch(r"[dD]\d+", cells[0]):
            continue                                    # bỏ header, dòng kẻ, chú thích
        day_s, problem, signal, pattern, idea, complexity = cells
        day = int(day_s[1:])
        num = re.match(r"\d+", problem)
        key = num.group(0) if num else re.sub(r"\W+", "-", problem.lower()).strip("-")
        seen[key] = seen.get(key, 0) + 1
        guid = f"be-dsa-{key}" + (f"-{seen[key]}" if seen[key] > 1 else "")
        topics = " ".join(
            f"be::pattern::{re.sub(r'[^a-z0-9]+', '-', p.lower()).strip('-')}"
            for p in re.split(r"[/,+]", pattern) if p.strip()
        )
        tags = f"be::w{(day - 1) // 7 + 1:02d}::d{day:02d} {topics}"
        rows.append([guid] + [md_inline_to_html(c) for c in (signal, pattern, idea, complexity, problem)] + [tags])
    return rows


def write_tsv(path: Path, notetype: str, deck: str, columns: list[str], rows: list[list[str]]) -> None:
    header = [
        "#separator:tab",
        "#html:true",
        f"#notetype:{notetype}",
        f"#deck:{deck}",
        "#columns:" + "\t".join(columns),
        "#guid column:1",
        f"#tags column:{len(columns)}",
    ]
    body = ["\t".join(c.replace("\t", " ") for c in r) for r in rows]
    path.write_text("\n".join(header + body) + "\n", encoding="utf-8")
    print(f"{len(rows)} thẻ → {path.relative_to(ROOT.parent)}")


def main() -> None:
    rows: list[list[str]] = []
    for day in sorted(DAYS):
        path = next(NOTES.glob(f"d{day:02d}-*.md"))
        rows += extract(path, day)
    ANKI.mkdir(exist_ok=True)
    write_tsv(OUT, "BE Concept", "BE::Concepts",
              ["GUID", "Question", "Answer", "Source", "Tags"], rows)
    write_tsv(DSA_OUT, "BE DSA Pattern", "BE::DSA-Pattern",
              ["GUID", "Signal", "Pattern", "Idea", "Complexity", "Problem", "Tags"], extract_dsa(DSA_SRC))


if __name__ == "__main__":
    main()

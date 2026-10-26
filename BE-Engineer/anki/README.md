# Anki cho lộ trình BE-Engineer

← [Lộ trình 100 ngày](../Roadmap_100_ngay.md)

Thư mục này chứa thẻ Anki sinh ra từ ghi chú, để import vào Anki và ôn theo lịch.

| File | Là gì | Ai sửa |
|---|---|---|
| `be-concepts.tsv` | Thẻ lý thuyết, sinh từ mục "Thẻ Anki" của `notes/dNN-*.md` | **Script sinh ra**, không sửa tay |
| `dsa-patterns.md` | Bảng thẻ DSA-Pattern, mỗi bài DSA một dòng | **Bạn tự viết** sau mỗi bài |
| `be-dsa-patterns.tsv` | Thẻ DSA, sinh từ `dsa-patterns.md` | **Script sinh ra**, không sửa tay |
| [`../tools/anki_export.py`](../tools/anki_export.py) | Script xuất cả 2 file `.tsv` | Thêm ngày mới vào `DAYS` |

---

## 1. Cài đặt một lần

> Làm **trên một máy duy nhất**, xong bấm **Sync**. Máy còn lại và điện thoại chỉ cần đăng nhập AnkiWeb rồi Sync. Tạo note type ở cả 2 máy sẽ làm đổi cấu trúc collection: lúc sync, Anki bắt chọn giữ bản của một máy và bỏ bản kia.

### 1.1. Tài khoản và deck

1. Cài Anki desktop, tạo tài khoản **AnkiWeb** (để đồng bộ 2 máy + điện thoại: AnkiDroid / AnkiMobile).
2. Tạo deck (**Create Deck**): `BE::Concepts` và `BE::DSA-Pattern`. Dấu `::` tạo deck con, Anki tự sinh deck cha `BE`.

Chỉ dùng 2 deck. **Không tạo deck theo ngày**: deck dùng để cài lịch ôn, còn lọc theo ngày/chủ đề thì dùng **tag** (mục 4). Chia deck theo ngày làm bạn ôn từng cụm bài liền nhau (nhớ kém hơn trộn chủ đề) và phải chỉnh cài đặt cho hàng chục deck.

### 1.2. Note type "BE Concept" (thẻ lý thuyết)

**Tools → Manage Note Types → Add → "Add: Basic"**, đặt tên đúng `BE Concept`.

- **Fields**: đổi tên và giữ đúng thứ tự `Question`, `Answer`, `Source`.
- **Cards** → Front Template:

```html
<div class="q">{{Question}}</div>
```

- Back Template:

```html
{{FrontSide}}
<hr id=answer>
<div class="a">{{Answer}}</div>
<div class="src">{{Source}}</div>
```

- Styling:

```css
.card { font-family: -apple-system, "Segoe UI", sans-serif; font-size: 18px; text-align: left; line-height: 1.5; }
.q { font-weight: 600; }
code { background: rgba(127,127,127,.15); padding: 1px 4px; border-radius: 4px; font-size: 90%; }
.src { margin-top: 14px; font-size: 12px; opacity: .6; }
```

### 1.3. Note type "BE DSA Pattern"

Làm tương tự, tên đúng `BE DSA Pattern`, fields theo thứ tự `Signal`, `Pattern`, `Idea`, `Complexity`, `Problem`.

- Front Template:

```html
<div class="q">Dấu hiệu: {{Signal}}</div>
<div class="hint">→ Pattern nào? Ý tưởng? Độ phức tạp?</div>
```

- Back Template:

```html
{{FrontSide}}
<hr id=answer>
<b>{{Pattern}}</b><br>
{{Idea}}<br>
<i>{{Complexity}}</i>
<div class="src">{{Problem}}</div>
```

- Styling: chép CSS của `BE Concept`, thêm `.hint { opacity: .6; margin-top: 6px; }`.

> ⚠️ **Phải tạo 2 note type này TRƯỚC khi import.** Nếu thiếu, Anki rơi về note type `Basic` và báo `[no deck]`, các cột map sai (đã thử).

### 1.4. Giới hạn mỗi ngày

Bấm ⚙️ cạnh deck `BE` → **Options**. Dùng chung một preset cho cả `BE`, `BE::Concepts`, `BE::DSA-Pattern`. Chỉ chỉnh phần **Daily Limits**, các phần khác để mặc định:

| Mục | Giá trị | Vì sao |
|---|---|---|
| New cards/day | **10** | Mỗi thẻ mới kéo theo vài lần ôn trong những ngày sau. 20 (mặc định) dễ bị dồn |
| Maximum reviews/day | **200** (mặc định) | Đừng hạ. Hạ xuống thì thẻ đến hạn dồn lại, càng khó theo kịp |

---

## 2. Xuất và import thẻ lý thuyết

1. Chạy script (từ thư mục gốc repo):

   ```bash
   python3 BE-Engineer/tools/anki_export.py
   # 29 thẻ → BE-Engineer/anki/be-concepts.tsv
   # 0 thẻ → BE-Engineer/anki/be-dsa-patterns.tsv
   ```

2. Anki: **File → Import**, chọn `be-concepts.tsv`. Màn hình import phải hiện sẵn:
   - Notetype `BE Concept`, Deck `BE::Concepts`
   - Cột map đúng `Question / Answer / Source / Tags`
   - Existing notes: **Update**
3. Bấm **Import**. Lần đầu: toàn bộ là *new*.

Phần đầu file `.tsv` báo Anki cách đọc, không phải chọn tay:

```
#separator:tab              ← tab, vì câu trả lời có nhiều dấu phẩy
#html:true                  ← **đậm** thành <b>, `code` thành <code>
#notetype:BE Concept
#deck:BE::Concepts
#columns:GUID	Question	Answer	Source	Tags
#guid column:1              ← mã định danh thẻ, ví dụ be-d05-4 = ngày 5, thẻ 4
#tags column:5
```

### Sửa hoặc thêm thẻ rồi import lại

Sửa mục "Thẻ Anki" trong note → chạy lại script → import đè. Anki nhận ra thẻ cũ nhờ GUID nên **cập nhật nội dung, giữ nguyên lịch ôn** (đã thử: sửa 1 thẻ → *0 new, 1 updated*, tổng không đổi).

> ⚠️ GUID thẻ lý thuyết theo **thứ tự trong mục**. Thẻ mới chỉ **thêm vào cuối** mục "Thẻ Anki", đừng chèn giữa: chèn giữa làm lệch số thứ tự, Anki sẽ ghi nội dung thẻ này sang thẻ khác.

### Khi có note của ngày mới

Mở `tools/anki_export.py`, thêm 1 dòng vào `DAYS` (tuần, chủ đề), ví dụ:

```python
DAYS = {
    ...
    8: ("w02", "coupling"),
}
```

Script nhận 3 kiểu viết thẻ trong mục `## N. Thẻ Anki ...`: `1. **Câu hỏi**`, `**Thẻ 1.** *Câu hỏi*`, `- **Câu hỏi**`; câu trả lời là các dòng ngay bên dưới. Dòng có 🔴 / 🟡 / 🟦 đổi tier cho các thẻ sau nó.

---

## 3. Thêm thẻ DSA-Pattern

1. Làm xong bài DSA, **tự viết** 1 dòng vào bảng trong [`dsa-patterns.md`](dsa-patterns.md), không chép lời giải:

   | Cột | Viết gì | Ví dụ (bài 217) |
   |---|---|---|
   | Ngày | `dNN` theo lộ trình | `d01` |
   | Bài | số + tên | `217 Contains Duplicate` |
   | Signal | dấu hiệu trong đề giúp nhận ra pattern (mặt trước thẻ) | có phần tử lặp lại không? |
   | Pattern | tên pattern; 2 cách thì `A / B` | Hashing |
   | Idea | ý chính 1 dòng | `seen = set()`, gặp lại thì `True` |
   | Complexity | thời gian / bộ nhớ | O(n) / O(n) |

2. Chạy `python3 BE-Engineer/tools/anki_export.py`.
3. Anki: **File → Import** → `be-dsa-patterns.tsv` (tự chọn `BE DSA Pattern`, `BE::DSA-Pattern`) → **Import**.

GUID thẻ DSA = `be-dsa-<số bài>`, nên thứ tự dòng trong bảng **không quan trọng**, sửa dòng nào import lại là cập nhật dòng đó. Không dùng ký tự `|` trong ô.

---

## 4. Tag và lọc

Script tự gắn tag phân cấp:

| Tag | Ý nghĩa | Có ở |
|---|---|---|
| `be::w01::d05` | tuần 1, ngày 5 | cả 2 loại thẻ |
| `be::topic::solid` | chủ đề lý thuyết | thẻ lý thuyết |
| `be::tier::t1` / `t2` / `ts` | tier; `ts` = thẻ bổ sung TypeScript | thẻ lý thuyết |
| `be::pattern::bucket` | pattern DSA (`Bucket / Heap` → 2 tag) | thẻ DSA |

Câu search (gõ trong **Browse**, hoặc làm Search của filtered deck):

| Search | Lấy |
|---|---|
| `tag:be::w01` | cả tuần 1 (tự gồm tag con) |
| `tag:be::w01::d05` | riêng ngày 5 |
| `tag:be::topic::solid` | mọi thẻ SOLID |
| `tag:be::pattern::heap` | mọi bài dùng Heap |
| `deck:BE::Concepts tag:be::tier::t1` | chỉ thẻ T1 |

---

## 5. Ôn hằng ngày

- **Mỗi ngày bấm vào deck `BE` → Study Now.** Không cần lọc gì. Anki tự trộn thẻ của 2 deck con.
- 3 con số cạnh deck:

  | Màu | Loại | Nghĩa |
  |---|---|---|
  | 🔵 New | thẻ mới | lần đầu gặp, tối đa 10/ngày |
  | 🔴 Learn | đang học | vừa sai / vừa học, quay lại sau vài phút |
  | 🟢 Due | **đến hạn ôn** | thẻ cũ sắp quên. **Ôn đúng lúc này mới tạo trí nhớ dài hạn** |

- **10–15' mỗi ngày**, trong giờ làm (theo lộ trình). Đừng dồn cuối tuần.
- Chấm thật: không nói được ý chính → **Again**. Không cần thuộc từng chữ.
- Bỏ ôn vài ngày: cứ Study Now, ôn hết 🟢 trước; có thể tạm đặt New cards/day = 0 cho tới khi số thẻ đến hạn về bình thường.
- Thẻ bị gắn **leech** (sai nhiều lần): quay lại note, tách thành 2–3 thẻ nhỏ hơn, xuất lại.

**Filtered deck chỉ dùng khi cần ôn dồn** (trước buổi chốt tuần, trước phỏng vấn): **Tools → Create Filtered Deck**, Search = `tag:be::w01` hoặc `tag:be::topic::solid`. Ôn xong xoá filtered deck, thẻ tự về deck gốc, không mất lịch.

---

## 6. Dùng 2 máy

- **Lịch ôn** đồng bộ qua **AnkiWeb** (bấm Sync trước và sau khi ôn).
- **Nội dung thẻ** (`notes/`, `dsa-patterns.md`, script, `.tsv`) đồng bộ qua **git**. Máy nào cũng chạy lại script được.
- Import trên máy nào cũng được, xong bấm Sync. Đừng import cùng một file trên 2 máy trước khi Sync.

---

## 7. Gặp lỗi

| Hiện tượng | Nguyên nhân / cách xử lý |
|---|---|
| Màn hình import hiện note type `Basic`, deck `[no deck]` | Chưa tạo note type đúng tên (`BE Concept` / `BE DSA Pattern`), hoặc gõ sai tên. Tạo xong import lại |
| Cột map lệch (Answer nằm ở Source…) | Thứ tự field trong note type khác `Question, Answer, Source` |
| Import ra thẻ trùng | Existing notes không để **Update**, hoặc đã sửa GUID / chèn thẻ lý thuyết vào giữa mục |
| Script báo ít thẻ hơn mong đợi | Thẻ trong note không theo 3 kiểu viết ở mục 2, hoặc dòng bảng DSA không đủ 6 cột / ô Ngày không dạng `dNN` |
| Khi sync bị hỏi giữ bản trên máy hay trên AnkiWeb | Đã đổi note type / deck trên 2 máy. Chọn bản của máy vừa import |

# Tuần 6 (02/11 – 08/11): Tree, Heap, tối ưu Query (EXPLAIN)

← [Tuần 5](tuan-05.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 7 →](tuan-07.md)

**Mục tiêu tuần:** Đọc được execution plan và có quy trình xử lý khi gặp "API chậm". Có sẵn một câu chuyện tối ưu hiệu năng để kể khi phỏng vấn. Về DSA: nắm Heap (insert/pop O(log n)) và pattern Top-K.

> **Cách học theo Tier:** 🔴 T1 → hiểu tại sao + thẻ Anki, 🟡 T2 → điền bảng so sánh vào `notes/tradeoff-cheatsheet.md`, 🟢 T3 → chỉ lưu link/snippet vào `notes/snippets.md`. Xem lại bảng đầy đủ ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Research theo cột *Từ khoá research*, học tới mức ghi ở cột *Cần nắm tới mức nào* thì dừng.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| BFS theo tầng / DFS ưu tiên nhánh phải, inorder của BST cho dãy tăng dần, cấu trúc Heap (mảng, sift up/down, insert/pop O(log n), build O(n)), pattern Top-K bằng heap kích thước k, **đọc execution plan** (cây node, thứ tự đọc, cost vs actual, rows ước tính vs thực tế, loops), `EXPLAIN ANALYZE` chạy thật câu lệnh, cơ chế Seq / Index / Index Only / Bitmap Scan, điều kiện Index Only Scan, cơ chế Nested Loop / Hash / Merge Join, dấu hiệu join chậm trong plan, nhận diện và phát hiện N+1, vì sao OFFSET sâu chậm + nguyên lý keyset pagination, quy trình 5 bước xử lý "API chậm" | Các kiểu scan: planner chọn khi nào, Nested Loop vs Hash vs Merge Join, Eager JOIN vs batch `IN (...)`, Tối ưu query/index vs thêm cache, Heap vs Sort vs Quickselect cho Top-K | Cú pháp và tuỳ chọn của `EXPLAIN` (`BUFFERS`, `FORMAT JSON`, `SETTINGS`), các tham số cost (`random_page_cost`, `seq_page_cost`), `work_mem`, `enable_*`, `CREATE STATISTICS`, `join_collapse_limit`, cách bật `pg_stat_statements` / `auto_explain` / `log_min_duration_statement`, API eager loading của ORM cụ thể, cờ lệnh của công cụ load test, code chi tiết từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D36 (T2) – EXPLAIN | 57' | 80' | 2h17' |
| D37 (T3) – Các kiểu scan | 52' | 85' | 2h17' |
| D38 (T4) – Thuật toán join | 47' | 82' | 2h09' |
| D39 (T5) – N+1, keyset | 42' | 77' | 1h59' |
| D40 (T6) – Checklist "API chậm" | 77' | 82' | 2h39' |
| D41 (T7) – Lab tối ưu API | — | 4h00' | 4h00' |
| D42 (CN) – Chốt tuần 6 | — | 2h35' | 2h35' |

**Tổng tuần: 17h56'**

Ngày nặng nhất là **D41 (Lab 4h00', chạm trần Thứ Bảy)**; để D40 không vượt 90' buổi tối, bài tập `pg_stat_statements` trên DB công ty chuyển vào giờ làm D40, bảng T2 *Heap vs Sort vs Quickselect* dời sang phần DSA của D41, và bản nháp STAR của lab dời sang D42.

---

## D36 (T2, 02/11): EXPLAIN / EXPLAIN ANALYZE

**⏱ Ước tính:** Giờ làm 57' (DSA 45' + Anki 12') · Tối 80' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h17'**

### 🧩 DSA: [199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)

- **Pattern (🔴 T1):** *BFS theo tầng* (khung của bài 102, Tuần 5). Node cuối cùng của mỗi tầng chính là node nhìn thấy từ bên phải.
- **Các cách:**
  1. BFS theo tầng, lấy phần tử cuối của mỗi tầng → O(n) thời gian, O(w) bộ nhớ.
  2. DFS đi **phải trước, trái sau**, truyền `depth`; lần đầu tiên chạm tới một độ sâu mới thì node đó là node nhìn thấy → O(n), O(h).
- **Bẫy:** "chỉ đi theo nhánh phải" là **sai**. Nếu nhánh phải ngắn hơn nhánh trái, các tầng dưới sẽ nhìn thấy node của nhánh trái.
- **Mục tiêu:** viết được cả hai cách. Cách 2 là mẹo "lần đầu gặp độ sâu d" dùng lại ở nhiều bài khác.

### 📘 Bài học buổi tối: Đọc EXPLAIN và EXPLAIN ANALYZE

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Plan là một **cây node**: node lá đọc dữ liệu (scan), node cha kết hợp (join, sort, aggregate, limit) | 🔴 T1 | Vẽ lại được cây của một plan 4–5 node | `postgres explain plan tree nodes` |
| 2 | Thứ tự đọc: từ node thụt vào sâu nhất đi ra ngoài; dữ liệu chảy từ lá lên gốc; cost của node cha **đã bao gồm** cost của node con | 🔴 T1 | Chỉ ra được node nào chạy trước trong một plan bất kỳ | `how to read postgres explain` |
| 3 | `EXPLAIN` chỉ ước tính; `EXPLAIN ANALYZE` **chạy thật** câu lệnh | 🔴 T1 | Biết phải bọc `BEGIN … ROLLBACK` khi ANALYZE một câu INSERT/UPDATE/DELETE | `explain analyze executes query` |
| 4 | `cost=startup..total`: đơn vị tương đối (không phải ms), startup là chi phí trước khi trả dòng đầu tiên | 🔴 T1 | Giải thích được vì sao node Sort có startup cost gần bằng total cost | `postgres explain cost startup total` |
| 5 | `rows` (ước tính) vs `actual … rows` (thực tế), `width` | 🔴 T1 | Biết lệch ≥ 10 lần là dấu hiệu planner đang đoán sai | `explain estimated rows vs actual rows` |
| 6 | `actual time` tính bằng ms và là **mỗi lần lặp**; `loops` là số lần node chạy → thời gian thật ≈ `actual time × loops` | 🔴 T1 | Tính được tổng thời gian của node bên trong Nested Loop có `loops=5000` | `explain analyze loops actual time` |
| 7 | Các dòng quan trọng: `Rows Removed by Filter`, `Buffers: shared hit/read`, `Sort Method: external merge Disk`, `Planning Time` / `Execution Time` | 🔴 T1 | Mỗi dòng nói được nó báo hiệu vấn đề gì (xem chi tiết) | `explain analyze buffers shared hit read` |
| 8 | Sửa ước tính sai: chạy `ANALYZE`; dữ liệu các cột tương quan với nhau thì dùng extended statistics | 🔴 T1 phần "chạy ANALYZE", 🟢 T3 phần extended statistics | Biết `ANALYZE` cập nhật thống kê (autovacuum cũng tự chạy analyze khi bảng thay đổi đủ nhiều, nhưng có thể trễ sau một đợt nạp lớn). **Đừng nhầm:** lệnh `ANALYZE` *thu thập thống kê*, còn `EXPLAIN ANALYZE` *chạy query để đo*, không cập nhật thống kê. `CREATE STATISTICS` chỉ cần biết tồn tại | `postgres analyze statistics`, `create statistics dependencies` |
| 9 | Cú pháp `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON, SETTINGS)`, công cụ trực quan hoá (explain.depesz.com, explain.dalibo.com) | 🟢 T3 | Tra khi cần | PostgreSQL docs – *EXPLAIN* |

**Chi tiết cần hiểu**

- **Đọc một plan mẫu (lấy từ Q1 của lab Tuần 5):**

  ```
  Limit  (cost=0.43..58.70 rows=15 width=24) (actual time=0.035..0.071 rows=15 loops=1)
    Buffers: shared hit=19
    ->  Index Scan Backward using idx_orders_user_created on orders  (cost=0.43..58.70 rows=15 width=24) (actual time=0.033..0.066 rows=15 loops=1)
          Index Cond: (user_id = 12345)
          Buffers: shared hit=19
  Planning Time: 0.150 ms
  Execution Time: 0.092 ms
  ```

  - Node trong cùng (`Index Scan Backward`) chạy trước, đẩy dòng lên cho `Limit`.
  - `Index Cond` là điều kiện dùng để seek trong index (access predicate). `Filter` là điều kiện lọc sau khi đã đọc dòng.
  - `Backward`: index sort tăng dần nhưng query cần giảm dần, nên đọc ngược. Không tốn thêm chi phí.
  - `shared hit=19`: 19 page lấy từ cache của Postgres, không phải đọc đĩa. `read=…` là số page phải đọc từ đĩa (hoặc từ cache của hệ điều hành).
- **Checklist khi đọc plan (mục 7):**
  1. Node nào chiếm nhiều thời gian nhất? (Lấy `actual time × loops` của node đó trừ đi phần của node con.)
  2. Ở đâu `rows` ước tính lệch xa `actual rows`? Chỗ lệch **sâu nhất** thường là gốc của plan tồi.
  3. `Seq Scan` trên bảng lớn kèm `Rows Removed by Filter` rất lớn → thiếu index hoặc index không dùng được.
  4. `Sort Method: external merge Disk` → sort tràn ra đĩa (liên quan `work_mem`, T3), hoặc thiếu index phục vụ ORDER BY.
  5. Nested Loop có `loops` rất lớn ở node bên trong → xem D38.
- **Planning Time vs Execution Time:** query đơn giản mà Planning Time lớn là hiếm; thông thường hãy tập trung vào Execution Time.
- **`EXPLAIN ANALYZE` với câu lệnh ghi:**

  ```sql
  BEGIN;
  EXPLAIN ANALYZE UPDATE orders SET status = 'paid' WHERE id = 42;
  ROLLBACK;
  ```

**🔴 Thẻ Anki (T1)**

1. Đọc execution plan theo thứ tự nào? Cost của node cha có bao gồm node con không?
2. `cost` khác `actual time` thế nào? Đơn vị của mỗi cái?
3. Node có `actual time=0.02..0.05 rows=1 loops=10000` thực sự tốn bao nhiêu thời gian?
4. `rows` ước tính là 1 nhưng thực tế là 50.000: nguyên nhân thường gặp và cách xử lý?
5. Vì sao phải cẩn thận khi chạy `EXPLAIN ANALYZE` với câu UPDATE?
6. `Rows Removed by Filter` rất lớn nói lên điều gì?

**🟢 Tra cứu (T3):** PostgreSQL docs, câu lệnh *EXPLAIN* (danh sách tuỳ chọn); explain.depesz.com hoặc explain.dalibo.com để dán plan và xem trực quan.

**Tài liệu:**
- PostgreSQL docs: chương *Performance Tips* → *Using EXPLAIN* (đọc kỹ phần *EXPLAIN Basics* và *EXPLAIN ANALYZE*)
- use-the-index-luke.com: phần *Appendix → Execution Plans → PostgreSQL* (đọc lướt)

**❓ Câu hỏi cuối bài**

1. `cost` (ước tính) khác `actual time` (thực tế) thế nào?
2. Số `rows` ước tính lệch xa số thực tế thì nghĩa là gì? Xử lý ra sao (`ANALYZE`)?
3. Đọc plan theo thứ tự nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Trong plan có node con của Nested Loop: `Index Scan ... (actual time=0.040..0.060 rows=1 loops=40000)`. Node này thực sự tốn bao nhiêu thời gian? Có đáng lo không, và bạn sẽ nhìn tiếp vào đâu?
5. Bạn cần xem plan thật của `DELETE FROM orders WHERE status = 'cancelled' AND created_at < '2025-01-01'` trên staging. Làm thế nào để không xoá dữ liệu thật? Đồng nghiệp bảo "chạy `EXPLAIN ANALYZE` rồi thì thống kê đã được cập nhật" — đúng không?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- `cost=startup..total`: **ước tính**, đơn vị tương đối (không phải ms), do planner tính từ thống kê.
- `actual time`: **đo thật** bằng ms, chỉ có khi `EXPLAIN ANALYZE`, và là **mỗi lần lặp**.
- Hai cái không so trực tiếp được; dùng cost để hiểu vì sao planner chọn plan, dùng actual để tìm chỗ chậm.

**Câu 2.**
- Planner **đoán sai** số dòng → có thể chọn sai kiểu scan/join (ví dụ đoán 1 dòng nên chọn Nested Loop, thực tế 50.000).
- Lệch ≥ 10 lần là dấu hiệu; tìm chỗ lệch **sâu nhất** trong cây.
- Nguyên nhân hay gặp: thống kê cũ → chạy `ANALYZE`; cột tương quan → extended statistics (T3); điều kiện viết khó ước lượng (hàm trên cột).

**Câu 3.**
- Plan là cây: đọc từ node **thụt sâu nhất** ra ngoài; dữ liệu chảy từ lá lên gốc.
- Với node join: con thứ nhất là **outer**, con thứ hai là **inner** (Nested Loop chạy inner một lần cho mỗi dòng outer → nhìn `loops`).
- Cost/time của node cha **đã bao gồm** node con → muốn biết node tự tốn bao nhiêu thì trừ phần con.

**Câu 4.**
- Tổng ≈ 0,06 ms × 40.000 ≈ **2,4 giây** dù mỗi lần rất nhanh.
- Vấn đề không nằm ở node trong mà ở **số vòng lặp**: xem node ngoài, `rows` ước tính vs thực tế (có phải planner đoán ít dòng nên chọn Nested Loop?).
- Hướng sửa: `ANALYZE` để planner chọn Hash Join, hoặc giảm số dòng ngoài bằng điều kiện/index tốt hơn.

**Câu 5.**
- `EXPLAIN ANALYZE` **chạy thật** câu lệnh → bọc trong `BEGIN; EXPLAIN ANALYZE DELETE ...; ROLLBACK;` (hoặc chỉ `EXPLAIN` nếu không cần số thật).
- Sai: `EXPLAIN ANALYZE` chỉ đo; cập nhật thống kê là lệnh `ANALYZE` riêng (hoặc autovacuum).
- Vẫn cẩn thận: DELETE lớn trong transaction giữ lock và sinh WAL dù có rollback.

</details>

---

## D37 (T3, 03/11): Seq Scan / Index Scan / Index Only Scan / Bitmap Scan

**⏱ Ước tính:** Giờ làm 52' (DSA 40' + Anki 12') · Tối 85' (Học 45' + Bảng T2 15' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h17'**

### 🧩 DSA: [230. Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

- **Pattern (🔴 T1):** *Inorder của BST cho ra dãy tăng dần*. Phần tử thứ k khi duyệt inorder chính là đáp án.
- **Các cách:**
  1. Inorder toàn bộ vào một mảng rồi lấy phần tử `k-1` → O(n) thời gian, O(n) bộ nhớ.
  2. Inorder bằng **stack** và dừng ngay khi đếm đủ k → O(h + k) thời gian, O(h) bộ nhớ.
- **Câu hỏi mở rộng hay gặp:** cây bị thêm/xoá liên tục và phải hỏi kth nhiều lần thì sao? (Lưu thêm kích thước cây con ở mỗi node → mỗi lần hỏi chỉ O(h).)
- **Liên hệ:** "đi dọc các lá đã sort và dừng khi đủ k" chính là cách B-Tree phục vụ `ORDER BY … LIMIT k`.

### 📘 Bài học buổi tối: Các kiểu scan

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Seq Scan**: đọc toàn bộ page của bảng theo thứ tự vật lý (đọc tuần tự, rẻ trên mỗi page) | 🔴 T1 | Nói được vì sao nó không tệ khi cần phần lớn bảng | `postgres seq scan` |
| 2 | **Index Scan**: đi index, với mỗi entry khớp thì đọc dòng trong bảng (đọc ngẫu nhiên); kết quả có **thứ tự của index** | 🔴 T1 | Biết chi phí tăng theo số dòng khớp | `postgres index scan random io` |
| 3 | **Index Only Scan**: lấy dữ liệu chỉ từ index, không đọc bảng | 🔴 T1 | Kể đủ 3 điều kiện (xem chi tiết) | `postgres index only scan conditions` |
| 4 | **Bitmap Index Scan + Bitmap Heap Scan**: gom vị trí các dòng khớp vào bitmap, sort theo vị trí vật lý, rồi đọc từng page của bảng **đúng một lần** | 🔴 T1 | Giải thích được vì sao nó hợp với số dòng khớp "vừa phải" và vì sao kết quả **mất thứ tự** của index | `postgres bitmap heap scan explained` |
| 5 | `BitmapAnd` / `BitmapOr`: kết hợp nhiều index cho một query | 🔴 T1 | Biết đây là cách Postgres dùng 2 index đơn cột cho `a = ? AND b = ?` | `postgres combining multiple indexes bitmap` |
| 6 | `Recheck Cond`, `Heap Blocks: exact / lossy` | 🟢 T3 | Chỉ cần biết: khi bitmap quá lớn so với `work_mem`, nó lưu theo page thay vì theo dòng ("lossy") và phải kiểm tra lại điều kiện | `bitmap heap scan lossy recheck` |
| 7 | **Chọn kiểu scan theo selectivity** | 🟡 T2 | Điền bảng so sánh bên dưới | `postgres seq scan vs index scan vs bitmap scan` |
| 8 | Vì sao planner chọn Seq Scan dù có index | 🔴 T1 | Kể ≥ 4 lý do (xem chi tiết) | `why postgres chooses seq scan over index` |
| 9 | Parallel Seq Scan | 🟢 T3 | Biết tồn tại: Postgres có thể chia bảng cho nhiều worker cùng quét | `postgres parallel seq scan` |
| 10 | `SET enable_seqscan = off` (chỉ để thí nghiệm), `random_page_cost` (mặc định 4, SSD thường chỉnh thấp hơn) | 🟢 T3 | Không dùng trên production | PostgreSQL docs – *Planner Method Configuration* |

**Chi tiết cần hiểu**

- **Hình dung theo số dòng khớp:**

  ```
  Số dòng khớp:   rất ít ─────────────── vừa phải ─────────────── phần lớn bảng
  Plan thường gặp: Index Scan / Index Only    Bitmap Heap Scan              Seq Scan
  ```

  Không có ngưỡng phần trăm cố định. Planner so sánh cost ước tính, phụ thuộc số dòng, kích thước bảng, thống kê và tham số cost.
- **Vì sao Bitmap tốt ở vùng giữa (mục 4):** Index Scan có thể đọc cùng một page của bảng nhiều lần theo thứ tự ngẫu nhiên. Bitmap sort các vị trí theo thứ tự vật lý nên mỗi page chỉ đọc một lần và gần như tuần tự. Cái giá: kết quả không còn theo thứ tự của index, nên nếu có ORDER BY thì phải thêm node Sort.
- **3 điều kiện của Index Only Scan (mục 3):**
  1. Loại index hỗ trợ (B-Tree có; GIN không).
  2. **Mọi cột** mà query dùng (SELECT, WHERE, ORDER BY) đều nằm trong index (cột khoá hoặc cột `INCLUDE`).
  3. Page chứa dòng đó được đánh dấu *all-visible* trong visibility map. Nếu không, Postgres vẫn phải vào bảng kiểm tra → `Heap Fetches` tăng. VACUUM cập nhật visibility map.
- **Vì sao chọn Seq Scan dù có index (mục 8):**
  1. Điều kiện khớp phần lớn bảng (selectivity thấp).
  2. Bảng nhỏ, chỉ vài page.
  3. Thống kê cũ khiến ước tính sai.
  4. Dữ liệu khớp nằm rải rác khắp bảng (độ tương quan giữa thứ tự index và thứ tự vật lý thấp) → Index Scan phải đọc ngẫu nhiên quá nhiều.
  5. Query viết theo cách không dùng được index (hàm trên cột, ép kiểu, thiếu cột đầu của composite index — xem lại D33 Tuần 5).
- **Thí nghiệm nhanh (T3):** trong một session thử nghiệm, `SET enable_seqscan = off;` để ép planner dùng index, so sánh Execution Time với plan Seq Scan. Thường bạn sẽ thấy planner đã đúng.

**🟡 Bảng so sánh T2: Seq Scan vs Index Scan vs Bitmap Scan vs Index Only Scan**

Nhóm: *phương thức truy cập dữ liệu*. Trục chính của cuộc so sánh: **số dòng cần lấy (selectivity)** vs **kiểu I/O trên bảng (tuần tự hay ngẫu nhiên)**.

| Tiêu chí | Seq Scan | Index Scan | Bitmap Heap Scan | Index Only Scan |
|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | |
| Core: Trade-off chính | | | | |
| Core: Khi nào KHÔNG phù hợp | | | | |
| Ext: Kiểu I/O trên bảng (tuần tự / ngẫu nhiên / không đọc) | | | | |
| Ext: Kết quả có giữ thứ tự của index không? | | | | |
| Ext: Điều kiện cần (index, cột, visibility map) | | | | |

**🔴 Thẻ Anki (T1)**

1. Index Scan khác Bitmap Heap Scan ở cách đọc bảng như thế nào?
2. Vì sao Bitmap Heap Scan thường đi kèm node Sort khi có ORDER BY?
3. Index Only Scan cần 3 điều kiện gì?
4. Kể 4 lý do planner chọn Seq Scan dù có index.
5. Postgres dùng 2 index đơn cột cho `WHERE a = ? AND b = ?` bằng cách nào?

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Indexes* → *Combining Multiple Indexes*, *Index-Only Scans and Covering Indexes*; *Server Configuration* → *Query Planning* (các cờ `enable_*`, `random_page_cost`).

**Tài liệu:**
- PostgreSQL docs: *Using EXPLAIN* (các ví dụ Bitmap Heap Scan và Index Scan)
- use-the-index-luke.com, chương 5 *Clustering Data* (phần *Index-Only Scan*)

**❓ Câu hỏi cuối bài**

1. Vì sao planner đôi khi chọn Seq Scan dù đã có index?
2. Bitmap scan được dùng khi nào?
3. Index Only Scan cần điều kiện gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Bảng `orders` có hai index đơn `(status)` và `(user_id)`. Query `WHERE status = 'pending' AND user_id = 42 ORDER BY created_at DESC LIMIT 20` chạy chậm dần khi user có nhiều đơn. Plan có thể trông thế nào? Vì sao nó cần node Sort? Bạn đổi index ra sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Điều kiện khớp **phần lớn bảng**: đọc tuần tự rẻ hơn đọc ngẫu nhiên từng dòng qua index.
- Bảng nhỏ (vài page); thống kê cũ khiến ước tính sai.
- Dữ liệu khớp rải rác (tương quan thấp với thứ tự vật lý); query viết không dùng được index (hàm trên cột, ép kiểu, thiếu cột đầu).

**Câu 2.**
- Số dòng khớp **vừa phải**: quá nhiều cho Index Scan (đọc ngẫu nhiên lặp page), quá ít cho Seq Scan.
- Gom vị trí dòng vào bitmap, sort theo vị trí vật lý → mỗi page đọc **một lần**, gần tuần tự.
- Kết hợp nhiều index bằng `BitmapAnd`/`BitmapOr`; cái giá: mất thứ tự của index → cần Sort nếu có ORDER BY.

**Câu 3.**
- Loại index hỗ trợ (B-Tree có, GIN không).
- **Mọi cột** query dùng (SELECT, WHERE, ORDER BY) đều nằm trong index (khoá hoặc `INCLUDE`).
- Page *all-visible* trong visibility map (VACUUM cập nhật), nếu không `Heap Fetches` tăng.

**Câu 4.**
- Plan kiểu: `Bitmap Index Scan (status)` + `Bitmap Index Scan (user_id)` → `BitmapAnd` → `Bitmap Heap Scan` → `Sort` → `Limit`.
- Bitmap mất thứ tự, và không index nào chứa `created_at` → phải đọc **hết** đơn khớp rồi sort mới lấy 20.
- Composite `(user_id, status, created_at DESC)`: hai cột `=` trước, cột sort sau → seek một lần, đọc đúng 20 entry, không Sort.

</details>

---

## D38 (T4, 04/11): Nested Loop / Hash Join / Merge Join

**⏱ Ước tính:** Giờ làm 47' (DSA 35' + Anki 12') · Tối 82' (Học 45' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h09'**

### 🧩 DSA: [703. Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

- **Pattern (🔴 T1):** *Min-heap kích thước k để giữ Top-K lớn nhất*. Đỉnh heap (phần tử nhỏ nhất trong k phần tử lớn nhất) chính là phần tử lớn thứ k.
- **Ôn nhanh Heap (🔴 T1), cần thuộc:**
  - Là cây nhị phân **đầy đủ**, lưu trong mảng: con của `i` ở `2i+1`, `2i+2`; cha ở `(i-1)/2`.
  - Min-heap: cha ≤ con. **Chỉ** đảm bảo đỉnh là nhỏ nhất, không phải mảng đã sort.
  - `peek` O(1); `push` = thêm cuối rồi *sift up* → O(log n); `pop` = đưa phần tử cuối lên đỉnh rồi *sift down* → O(log n). Vì cây đầy đủ nên chiều cao là log n.
  - Build heap từ mảng có sẵn (heapify) là O(n), không phải O(n log n).
- **Các cách:**
  1. Sort lại sau mỗi lần `add` → O(n log n) mỗi lần.
  2. Min-heap giữ đúng k phần tử: `add` là push, nếu kích thước > k thì pop → O(log k) mỗi lần, O(k) bộ nhớ.
- **Lưu ý:** mảng khởi tạo có thể dài hơn k (phải pop bớt) hoặc ngắn hơn k.

### 📘 Bài học buổi tối: Thuật toán join

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Nested Loop Join**: với mỗi dòng bảng ngoài, tìm dòng khớp ở bảng trong | 🔴 T1 | Biết không có index ở bảng trong là O(N·M), có index là khoảng O(N·log M) | `nested loop join explained` |
| 2 | **Hash Join**: build bảng băm từ input nhỏ hơn, rồi dùng input lớn hơn để probe | 🔴 T1 | Biết chỉ dùng cho điều kiện `=`, O(N+M), tốn bộ nhớ, tràn ra đĩa khi quá `work_mem` (`Batches > 1`) | `hash join build probe` |
| 3 | **Merge Join**: hai input đã sort theo khoá join, đi song song như merge hai mảng đã sort | 🔴 T1 | Biết input có thể đã sort sẵn nhờ index, hoặc phải thêm node Sort. Ở Postgres, Merge Join (giống Hash Join) chỉ dùng cho điều kiện **`=`**; chỉ Nested Loop xử lý được điều kiện bất kỳ (`<`, `BETWEEN`, `LIKE`…) | `merge join sorted inputs` |
| 4 | Liên hệ DSA: Nested Loop ≈ 2 vòng lặp lồng nhau; Hash Join ≈ Two Sum bằng HashMap; Merge Join ≈ merge hai mảng đã sort (bài 21) | 🔴 T1 | Tự nói được 3 phép so sánh này | — |
| 5 | **Chọn thuật toán join** | 🟡 T2 | Điền bảng so sánh bên dưới | `nested loop vs hash join vs merge join` |
| 6 | Index trên cột join: cho phép Nested Loop với Index Scan ở bảng trong; cột FK ở Postgres không có index sẵn | 🔴 T1 | Giải thích được vì sao thiếu index ở `order_items.order_id` làm join chậm | `index foreign key join performance` |
| 7 | Dấu hiệu join chậm trong plan | 🔴 T1 | Nhận ra được 3 dấu hiệu (xem chi tiết) | `slow join explain analyze` |
| 8 | Semi join / Anti join (plan của `EXISTS` / `NOT EXISTS`) | 🟢 T3 | Biết tên node `Hash Semi Join`, `Hash Anti Join` khi đọc plan | `postgres anti join not exists` |
| 9 | Thứ tự join và `join_collapse_limit`, `hash_mem_multiplier` | 🟢 T3 | Biết tồn tại | PostgreSQL docs – *Controlling the Planner with Explicit JOIN Clauses* |

**Chi tiết cần hiểu**

- **Khi nào planner hay chọn thuật toán nào:**
  - *Nested Loop:* bảng ngoài ít dòng (sau khi lọc) và bảng trong có index trên cột join. Trả được dòng đầu tiên rất nhanh (startup cost thấp), nên hợp với `LIMIT`. Đây là join điển hình của API "lấy đơn của một user kèm item".
  - *Hash Join:* hai bảng đều lớn, điều kiện `=`, không có index phù hợp hoặc cần gần hết dữ liệu. Phải build xong bảng băm rồi mới trả dòng đầu tiên. Điển hình trong báo cáo.
  - *Merge Join:* hai input lớn đã có sẵn thứ tự theo khoá join (nhờ index), hoặc kết quả cũng cần sort theo khoá đó.
- **Dấu hiệu join chậm (mục 7):**
  1. Ước tính sai ở đầu vào của join: planner đoán bảng ngoài có 1 dòng nên chọn Nested Loop, thực tế có 50.000 dòng → node bên trong chạy `loops=50000`.
  2. Node bên trong của Nested Loop là `Seq Scan` với `loops` lớn → thiếu index trên cột join. Đây là trường hợp tệ nhất: O(N·M).
  3. Hash Join có `Batches: 8` (lớn hơn 1) → bảng băm không vừa bộ nhớ, phải ghi ra đĩa.
  4. Node `Sort` với `external merge Disk` ngay trước Merge Join.
- **Ví dụ để tự chạy trên dữ liệu lab** *(bảng `order_items` chỉ được tạo ở Bước 1 của Lab D41; tối nay hãy chạy thử trên DB của *Mini Order Service* nếu đã có dữ liệu, hoặc đánh dấu để chạy lại sau Lab D41)*:

  ```sql
  -- Có index trên order_items(order_id) và lọc một user → thường là Nested Loop
  EXPLAIN ANALYZE
  SELECT o.id, i.product_id, i.quantity
  FROM orders o JOIN order_items i ON i.order_id = o.id
  WHERE o.user_id = 12345;

  -- Tổng hợp toàn bảng → thường là Hash Join
  EXPLAIN ANALYZE
  SELECT o.status, sum(i.quantity)
  FROM orders o JOIN order_items i ON i.order_id = o.id
  GROUP BY o.status;
  ```

**🟡 Bảng so sánh T2: Nested Loop vs Hash Join vs Merge Join**

Nhóm: *thuật toán join*. Trục chính của cuộc so sánh: **kích thước input và việc có index / đã sort hay chưa** vs **bộ nhớ cần dùng**.

| Tiêu chí | Nested Loop | Hash Join | Merge Join |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG phù hợp | | | |
| Ext: Loại điều kiện join hỗ trợ (`=`, `<`, `>`…) | | | |
| Ext: Độ phức tạp và bộ nhớ cần | | | |
| Ext: Startup cost (trả dòng đầu tiên nhanh không, hợp với `LIMIT` không?) | | | |

**🔴 Thẻ Anki (T1)**

1. Mô tả Nested Loop, Hash Join, Merge Join, mỗi cái một câu, kèm bài DSA tương tự.
2. Vì sao Hash Join chỉ dùng được cho điều kiện `=`?
3. Vì sao Nested Loop hợp với query có `LIMIT`?
4. Nested Loop có node bên trong là Seq Scan với `loops=20000` nói lên điều gì?
5. Heap: vì sao push và pop là O(log n)? Build heap là bao nhiêu?

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Performance Tips* → *Controlling the Planner with Explicit JOIN Clauses*; *Server Configuration* → `work_mem`, `hash_mem_multiplier`.

**Tài liệu:**
- use-the-index-luke.com, chương 4 *The Join Operation* (3 phần: *Nested Loops*, *Hash Join*, *Sort Merge*)
- NeetCode: video giải bài 703 và phần *Heap / Priority Queue* trong NeetCode 150

**❓ Câu hỏi cuối bài**

1. Mỗi thuật toán join (Nested Loop, Hash, Merge) phù hợp với tình huống nào?
2. Có index trên cột join thì ảnh hưởng gì?
3. Nhận ra một join chậm trong plan bằng cách nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Query tính giá khuyến mãi: `SELECT ... FROM orders o JOIN promotions p ON o.created_at BETWEEN p.starts_at AND p.ends_at`. Planner có dùng được Hash Join hay Merge Join không? Nó sẽ dùng gì, và index nào giúp được?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Nested Loop: bảng ngoài ít dòng + bảng trong có index trên cột join; startup thấp, hợp `LIMIT` (API "đơn của một user kèm item").
- Hash Join: hai input lớn, điều kiện `=`, không có index phù hợp / cần gần hết dữ liệu (báo cáo); tốn bộ nhớ, build xong mới trả dòng.
- Merge Join: hai input lớn đã sort sẵn theo khoá join (nhờ index) hoặc kết quả cũng cần sort theo khoá đó.

**Câu 2.**
- Cho phép Nested Loop với **Index Scan** ở bảng trong: O(N·log M) thay vì O(N·M).
- Input đã sort theo index → Merge Join không cần node Sort.
- Postgres không tự tạo index cho cột FK → `order_items.order_id` phải tự tạo.

**Câu 3.**
- Nested Loop có node trong là **Seq Scan** với `loops` lớn → thiếu index cột join.
- `rows` ước tính của input join lệch xa thực tế (đoán 1, thực tế 50.000) → chọn sai thuật toán.
- Hash Join `Batches > 1` (tràn đĩa); `Sort Method: external merge Disk` trước Merge Join.

**Câu 4.**
- Không: Hash Join và Merge Join ở Postgres chỉ hỗ trợ điều kiện `=`.
- Planner buộc dùng **Nested Loop**: với mỗi promotion (bảng nhỏ), tìm các đơn trong khoảng.
- Index `orders (created_at)` biến vòng trong thành range scan; bảng khuyến mãi nhỏ thì đặt nó ở vòng ngoài.

</details>

---

## D39 (T5, 05/11): N+1 trong ORM, slow query log, keyset pagination

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 77' (Học 40' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 1h59'**

> Bảng *Eager JOIN vs Batch `IN (...)`* hôm nay cũng thay cho bảng *JOIN vs batch `IN`* (tuỳ chọn) của D26 Tuần 4: chỉ điền một lần.

### 🧩 DSA: [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/)

- **Pattern (🔴 T1):** *Max-heap mô phỏng*. Mỗi bước lấy 2 phần tử lớn nhất, xử lý, đẩy kết quả lại.
- **Các cách:**
  1. Sort lại mảng sau mỗi bước → O(n² log n).
  2. Max-heap → O(n log n) thời gian, O(n) bộ nhớ.
- **Lưu ý:** nhiều ngôn ngữ chỉ có sẵn min-heap (ví dụ `heapq` của Python). Mẹo: lưu **số đối** (`-x`) để biến min-heap thành max-heap. Nhớ trường hợp heap còn 0 phần tử.

### 📘 Bài học buổi tối: N+1 thực tế, slow query log, keyset pagination

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | N+1: 1 query lấy danh sách + N query lấy dữ liệu liên quan cho từng phần tử, do **lazy loading** của ORM | 🔴 T1 | Chỉ ra được dòng code gây N+1 trong một vòng lặp (ôn lại D26 Tuần 4) | `n+1 query problem orm lazy loading` |
| 2 | Cách phát hiện: bật log SQL của ORM, đếm số query mỗi request, viết test khẳng định số query, xem trace của APM | 🔴 T1 | Làm được với ORM của bạn trong lab | `detect n+1 queries <tên ORM của bạn>` |
| 3 | Dấu hiệu N+1 trong thống kê DB: một query rất nhanh nhưng số lần gọi (`calls`) cực lớn | 🔴 T1 | Nhận ra được trong kết quả `pg_stat_statements` | `pg_stat_statements find n+1` |
| 4 | **Eager JOIN vs batch `IN (...)`** | 🟡 T2 | Điền bảng so sánh bên dưới | `eager loading join vs separate query in clause` |
| 5 | Slow query log: `log_min_duration_statement` (Postgres), `slow_query_log` + `long_query_time` (MySQL), extension `auto_explain` | 🟢 T3 | Biết có công cụ này để bật khi cần; cú pháp tra docs | `postgres log_min_duration_statement`, `auto_explain` |
| 6 | Vì sao `OFFSET 100000` chậm: DB vẫn phải tạo ra và bỏ đi 100.000 dòng | 🔴 T1 | Nói được chi phí là O(offset + limit) | `offset pagination performance` |
| 7 | **Keyset pagination** (seek method): `WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT 20` + index khớp | 🔴 T1 | Viết được query và index; biết vì sao cần cột `id` để phá thế hoà | `keyset pagination seek method`, `use the index luke fetch next page` |
| 8 | Nhược điểm của keyset: không nhảy thẳng tới trang N, khó đếm tổng số trang | 🔴 T1 | Nêu được và biết khi nào vẫn dùng offset (trang admin ít dữ liệu) | `keyset pagination limitations` |
| 9 | API eager loading của ORM cụ thể (`include`, `preload`, `JOIN FETCH`, `select_related`/`prefetch_related`…) | 🟢 T3 | Tra docs ORM của bạn | Docs ORM bạn dùng |

**Chi tiết cần hiểu**

- **N+1 trong code (mục 1):**

  ```
  orders = orderRepo.findByUser(userId, limit=20)     // 1 query
  for order in orders:
      order.items                                      // +20 query (lazy load)
      for item in order.items:
          item.product.name                            // +60 query nữa nếu mỗi đơn 3 item
  ```

  Tổng cộng 81 query cho một request. Mỗi query chỉ 1 ms nhưng cộng thêm độ trễ mạng tới DB thì request dễ mất cả trăm ms.
- **Hai cách sửa (mục 4):**
  - *Eager JOIN:* một query `orders JOIN order_items JOIN products`. Dữ liệu của đơn bị lặp lại ở mỗi dòng item. Nếu JOIN hai quan hệ 1–N cùng lúc (items và payments) thì số dòng nhân lên (cartesian explosion). Và `LIMIT 20` áp lên **dòng sau khi join**, không phải lên 20 đơn.
  - *Batch `IN`:* query 1 lấy 20 đơn; query 2 `SELECT … FROM order_items WHERE order_id = ANY($1)` (hoặc `IN (...)`); query 3 lấy products theo danh sách `product_id`. Luôn là số query cố định, không phụ thuộc N.
- **Keyset pagination (mục 7):**

  ```sql
  CREATE INDEX idx_orders_user_created_id ON orders (user_id, created_at DESC, id DESC);

  -- Trang đầu
  SELECT id, created_at, total_amount FROM orders
  WHERE user_id = $1
  ORDER BY created_at DESC, id DESC
  LIMIT 20;

  -- Trang tiếp: client gửi lại (created_at, id) của dòng cuối trang trước, thường mã hoá thành một cursor
  SELECT id, created_at, total_amount FROM orders
  WHERE user_id = $1 AND (created_at, id) < ($2, $3)
  ORDER BY created_at DESC, id DESC
  LIMIT 20;
  ```

  - Postgres hỗ trợ so sánh bộ giá trị `(a, b) < (x, y)` và dùng được index cho nó, **với điều kiện các cột sort cùng chiều** (cùng `DESC` như ở đây). Sort trộn chiều thì phải viết dạng `OR` tách. Với DB không tối ưu cú pháp này, viết lại thành `created_at < $2 OR (created_at = $2 AND id < $3)`.
  - Chi phí mỗi trang ≈ O(log n + 20), không phụ thuộc trang sâu tới đâu. Đây là cursor pagination bạn đã làm ở Tuần 4, giờ bạn hiểu vì sao nó nhanh ở tầng index.

**🟡 Bảng so sánh T2: Eager JOIN vs Batch `IN (...)`**

Nhóm: *chiến lược tải dữ liệu liên quan (data loading)*. Trục chính của cuộc so sánh: **số round-trip tới DB** vs **lượng dữ liệu trùng lặp và độ đúng khi phân trang**.

| Tiêu chí | Eager JOIN (1 query) | Batch `IN (...)` (1 query / quan hệ) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Số round-trip tới DB | | |
| Ext: Dữ liệu trùng lặp / cartesian explosion khi có nhiều quan hệ 1–N | | |
| Ext: Kết hợp với `LIMIT` / phân trang có đúng không? | | |

**🔴 Thẻ Anki (T1)**

1. N+1 là gì? Vì sao lazy loading gây ra nó?
2. Kể 3 cách phát hiện N+1 trong project.
3. Trong `pg_stat_statements`, N+1 trông như thế nào?
4. Vì sao `OFFSET 100000 LIMIT 20` chậm?
5. Viết query keyset pagination cho danh sách đơn sort theo `created_at DESC`. Vì sao cần thêm `id`?
6. Keyset pagination có nhược điểm gì?

**🟢 Tra cứu (T3):** PostgreSQL docs, *Server Configuration* → *Error Reporting and Logging* (`log_min_duration_statement`); *Additional Supplied Modules* → `auto_explain`, `pg_stat_statements`; docs ORM của bạn (phần eager loading).

**Tài liệu:**
- use-the-index-luke.com, chương 7 *Partial Results*: phần *Paging Through Results* (seek method)
- Docs ORM bạn dùng: phần eager loading / query logging

**❓ Câu hỏi cuối bài**

1. Làm sao phát hiện N+1 trong project (bật log query)?
2. Eager loading bằng JOIN khác batch bằng `IN (...)` ở điểm nào?
3. Tối ưu `OFFSET 100000` bằng keyset pagination thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Trong `pg_stat_statements`, câu `SELECT * FROM order_items WHERE order_id = $1` có `mean_exec_time = 0.3 ms` nhưng `calls = 12.000.000` mỗi ngày, đứng đầu bảng theo `total_exec_time`. Bạn đọc ra điều gì? Hướng xử lý?
5. PM muốn trang danh sách đơn có nút "nhảy tới trang 57" và dòng "tổng 1.234 trang", dữ liệu vài triệu đơn. Keyset có đáp ứng được không? Bạn đề xuất thế nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Bật log SQL của ORM ở dev, đếm số query cho **một** request; thấy cùng một câu `SELECT ... WHERE x_id = ?` lặp N lần.
- Viết test khẳng định số query của endpoint; xem trace APM (nhiều span DB ngắn liên tiếp).
- Ở DB: `pg_stat_statements` có query rất nhanh nhưng `calls` cực lớn.

**Câu 2.**
- Eager JOIN: 1 round-trip, nhưng dữ liệu cha lặp ở mỗi dòng con; nhiều quan hệ 1–N cùng lúc → cartesian explosion; `LIMIT` áp lên dòng **sau khi join**, không phải lên số đơn.
- Batch `IN`/`= ANY($1)`: 1 query cho danh sách + 1 query mỗi quan hệ → số query cố định, không trùng dữ liệu, phân trang đúng; thêm vài round-trip.
- Quan hệ nhiều–một nhỏ → JOIN; quan hệ 1–N hoặc có phân trang → batch.

**Câu 3.**
- `OFFSET` vẫn phải tạo ra rồi bỏ đi 100.000 dòng → O(offset + limit).
- Keyset: `WHERE (created_at, id) < ($c, $id) ORDER BY created_at DESC, id DESC LIMIT 20`, cursor mã hoá giá trị dòng cuối trang trước.
- Index khớp: `(created_at DESC, id DESC)` (hoặc có cột lọc `=` đứng trước) → mỗi trang O(log n + 20); cần `id` để phá thế hoà.

**Câu 4.**
- Dấu hiệu điển hình của **N+1**: mỗi lần rất nhanh nhưng gọi quá nhiều → tổng thời gian lớn nhất (thêm cả độ trễ mạng mà DB không đo).
- Tìm endpoint gọi nó (log/APM), đổi sang batch `order_id = ANY($1)` hoặc eager loading.
- Tối ưu query này (index) gần như vô ích; phải **giảm số lần gọi**.

**Câu 5.**
- Keyset không nhảy thẳng tới trang N và không cho tổng số trang; `COUNT(*)` trên vài triệu dòng tốn.
- Đề xuất: UI "Xem thêm"/trang tiếp theo + bộ lọc (ngày, trạng thái) để thu hẹp thay cho nhảy trang; số tổng hiện **ước lượng** hoặc cache.
- Nếu bắt buộc nhảy trang: chỉ cho offset với tập đã lọc nhỏ (trang admin), giới hạn độ sâu tối đa.

</details>

---

## D40 (T6, 06/11): Checklist "API chậm"

**⏱ Ước tính:** Giờ làm 77' (DSA 45' + Anki 12' + Bài tập `pg_stat_statements` ở công ty 20') · Tối 82' (Học 45' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h39'**

> **Cân lại thời gian:** bài tập "Tìm query chậm trong code công ty" cần quyền truy cập DB/APM công ty nên làm **trong giờ làm** (sau DSA). Bảng T2 *Heap vs Sort vs Quickselect* ở phần DSA bên dưới **dời sang D41 (T7)**, điền trước khi giải bài 215. Buổi tối chỉ điền bảng *Tối ưu query/index vs Thêm cache*.

### 🧩 DSA: [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)

- **Pattern (🔴 T1):** *Top-K nhỏ nhất → max-heap kích thước k*. Ngược với bài 703: muốn giữ k phần tử **nhỏ nhất** thì dùng **max-heap**, để phần tử "tệ nhất" trong nhóm luôn ở đỉnh và bị loại đầu tiên.
- **Các cách:**
  1. Sort theo khoảng cách → O(n log n).
  2. Max-heap kích thước k → O(n log k) thời gian, O(k) bộ nhớ.
  3. Quickselect → O(n) trung bình, O(n²) xấu nhất.
- **Lưu ý:** so sánh bằng `x² + y²`, không cần căn bậc hai (vừa chậm vừa sai số số thực).
- **🟡 Bảng so sánh T2: Heap vs Sort vs Quickselect cho Top-K** *(điền ở D41 – T7, trước khi giải bài 215)*. Nhóm: *thuật toán chọn Top-K*. Trục chính: **tốc độ** vs **bộ nhớ và khả năng xử lý stream**.

  | Tiêu chí | Sort | Heap kích thước k | Quickselect |
  |---|---|---|---|
  | Core: Use-case lý tưởng | | | |
  | Core: Trade-off chính | | | |
  | Core: Khi nào KHÔNG dùng | | | |
  | Ext: Độ phức tạp thời gian (trung bình / xấu nhất) | | | |
  | Ext: Dùng được cho dữ liệu dạng stream không? | | | |
  | Ext: Kết quả k phần tử có được sort sẵn không? | | | |

### 📘 Bài học buổi tối: Quy trình xử lý "API chậm"

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Quy trình 5 bước: **Đo → Khoanh vùng → Phân tích → Sửa từ rẻ tới đắt → Đo lại & phòng tái phát** | 🔴 T1 | Nói trơn tru trong 1 phút, mỗi bước có ví dụ công cụ | `how to debug slow api endpoint` |
| 2 | Đo bằng percentile (p50, p95, p99), không đo bằng trung bình | 🔴 T1 | Giải thích được vì sao trung bình che mất các request chậm | `p95 p99 latency explained` |
| 3 | Khoanh vùng: thời gian nằm ở DB, gọi service ngoài, CPU của app, hay chờ connection pool / lock? | 🔴 T1 | Kể được 4 nơi thời gian có thể "biến mất" | `latency breakdown tracing` |
| 4 | Thứ tự sửa từ rẻ tới đắt: N+1 → index → viết lại query / chỉ SELECT cột cần → phân trang → cache → xử lý bất đồng bộ → phi chuẩn hoá / materialized view | 🔴 T1 | Giải thích được vì sao cache không phải bước đầu tiên | `database performance optimization checklist` |
| 5 | **Tối ưu query/index vs thêm cache** | 🟡 T2 | Điền bảng so sánh bên dưới | `when to use cache vs optimize query` |
| 6 | Tìm query chậm: `pg_stat_statements` sort theo `total_exec_time` | 🔴 T1 phần tư duy "sort theo **tổng** thời gian, không chỉ theo thời gian mỗi lần", 🟢 T3 phần cú pháp | Biết vì sao query 5 ms gọi 1 triệu lần quan trọng hơn query 2 giây gọi 3 lần | `pg_stat_statements top queries total_exec_time` |
| 7 | Chờ lock và cạn connection pool cũng làm API chậm dù query không chậm | 🔴 T1 | Biết nhìn `pg_stat_activity` (cột `wait_event`, `state`) khi nghi ngờ | `pg_stat_activity wait_event` |
| 8 | Cú pháp bật `pg_stat_statements`, công cụ APM cụ thể | 🟢 T3 | Tra khi cần | PostgreSQL docs – *pg_stat_statements* |

**Chi tiết cần hiểu**

- **Quy trình 5 bước (mục 1):**
  1. **Đo:** endpoint nào, p95 bao nhiêu, từ khi nào (sau lần deploy nào?), tái hiện được không, với tham số nào.
  2. **Khoanh vùng:** dùng trace/APM hoặc log thời gian từng đoạn. Bao nhiêu phần trăm thời gian nằm ở DB? Bao nhiêu query mỗi request?
  3. **Phân tích:** nếu ở DB → lấy query chậm nhất, chạy `EXPLAIN (ANALYZE, BUFFERS)` với **tham số thật** trên dữ liệu có kích thước thật.
  4. **Sửa từ rẻ tới đắt** (mục 4). Mỗi lần chỉ đổi một thứ để biết thứ nào có tác dụng.
  5. **Đo lại & phòng tái phát:** so sánh p95 trước/sau, thêm alert về latency, thêm test đếm số query.
- **Vì sao cache không phải bước đầu tiên (mục 4–5):** cache che triệu chứng chứ không chữa bệnh. Cache miss vẫn chậm, dữ liệu có thể cũ, và bạn phải lo invalidation (Tuần 8). Cache đúng chỗ khi query **đã tối ưu** nhưng vẫn đắt về bản chất (tổng hợp nhiều dữ liệu), dữ liệu đọc nhiều ghi ít, và chấp nhận được việc dữ liệu cũ vài giây.
- **Tìm query chậm trong code công ty (bài tập làm trong giờ làm hôm nay, 20'):**

  ```sql
  SELECT query, calls, round(total_exec_time) AS total_ms, round(mean_exec_time::numeric, 2) AS mean_ms, rows
  FROM pg_stat_statements
  ORDER BY total_exec_time DESC
  LIMIT 10;
  ```

  - Chỉ chạy trên môi trường được phép (staging hoặc read replica), và hỏi người phụ trách trước. Không `EXPLAIN ANALYZE` câu lệnh ghi trên production.
  - Nếu không có `pg_stat_statements`, dùng log truy vấn chậm hoặc APM công ty đang có.
  - Ghi vào `notes/slow-query-company.md`: query, số lần gọi, thời gian, plan, giả thuyết nguyên nhân, cách sửa đề xuất. Không copy dữ liệu nhạy cảm của công ty ra ngoài.
- **Top-K bằng heap là O(n log k) (câu hỏi 3):** heap không bao giờ vượt quá k phần tử, nên mỗi push/pop chỉ tốn O(log k). Có n phần tử đi qua heap → O(n log k). Khi k nhỏ hơn n rất nhiều, cách này nhanh hơn sort O(n log n) và chỉ tốn O(k) bộ nhớ.

**🟡 Bảng so sánh T2: Tối ưu query/index vs Thêm cache**

Nhóm: *chiến lược tăng hiệu năng đọc*. Trục chính của cuộc so sánh: **sửa tận gốc, dữ liệu luôn đúng** vs **nhanh hơn nữa nhưng thêm độ phức tạp và dữ liệu có thể cũ**.

| Tiêu chí | Tối ưu query / index | Thêm cache (Redis) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Độ tươi của dữ liệu | | |
| Ext: Độ phức tạp thêm vào hệ thống (invalidation, thành phần mới) | | |
| Ext: Hiệu quả khi truy vấn đa dạng (nhiều tổ hợp tham số) vs vài key nóng | | |

**🔴 Thẻ Anki (T1)**

1. Kể 5 bước xử lý ticket "API chậm".
2. Vì sao đo latency bằng p95/p99 chứ không bằng trung bình?
3. Kể 4 nơi thời gian của một request có thể bị tiêu tốn.
4. Vì sao sort `pg_stat_statements` theo `total_exec_time` chứ không theo `mean_exec_time`?
5. Vì sao cache không phải bước tối ưu đầu tiên?
6. Top-K bằng heap vì sao là O(n log k)? Muốn k phần tử nhỏ nhất thì dùng min-heap hay max-heap?

**🟢 Tra cứu (T3):** PostgreSQL docs, *Additional Supplied Modules* → *pg_stat_statements*; *Monitoring Database Activity* → *The Cumulative Statistics System* (`pg_stat_activity`).

**Tài liệu:**
- Hussein Nasser: tìm các video về chủ đề database performance / slow queries trên kênh YouTube
- roadmap.sh/backend: phần *Scaling Databases* / *Database Indexes* (đọc lướt)

**❓ Câu hỏi cuối bài**

1. Quy trình 5 bước khi nhận ticket "API chậm" là gì?
2. Khi nào nên dùng cache thay vì tối ưu query?
3. Bài top-K dùng heap vì sao là O(n log k)?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Dashboard báo latency trung bình của `GET /orders` là 120 ms, p50 là 80 ms, nhưng khách vẫn phàn nàn "thỉnh thoảng rất chậm". Bạn nhìn chỉ số nào? Vì sao trung bình không đủ?
5. Endpoint mất 2 giây, nhưng `EXPLAIN ANALYZE` câu query chính chỉ 5 ms. Thời gian có thể đang nằm ở đâu? Bạn kiểm tra từng giả thuyết bằng gì?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- **Đo**: endpoint nào, p95/p99 bao nhiêu, từ khi nào (deploy nào), tái hiện với tham số nào.
- **Khoanh vùng**: trace/APM hoặc log thời gian từng đoạn → DB, service ngoài, CPU app, hay chờ pool/lock; số query mỗi request.
- **Phân tích**: `EXPLAIN (ANALYZE, BUFFERS)` với tham số thật, dữ liệu kích thước thật.
- **Sửa từ rẻ tới đắt**, mỗi lần một thứ (N+1 → index → viết lại query → phân trang → cache → async → phi chuẩn hoá); **đo lại & phòng tái phát** (alert, test đếm query).

**Câu 2.**
- Khi query **đã tối ưu** nhưng vẫn đắt về bản chất (tổng hợp nhiều dữ liệu), đọc nhiều ghi ít, chấp nhận dữ liệu cũ vài giây, có vài key nóng.
- Không dùng cache để che N+1 hoặc thiếu index: cache miss vẫn chậm, thêm invalidation, dữ liệu cũ.
- Cache là bước sau, không phải bước đầu.

**Câu 3.**
- Heap không bao giờ quá k phần tử → mỗi push/pop O(log k).
- n phần tử đi qua heap → O(n log k); bộ nhớ O(k).
- k nhỏ hơn n nhiều → nhanh hơn sort O(n log n), và dùng được cho stream. Top-K lớn nhất dùng min-heap, nhỏ nhất dùng max-heap.

**Câu 4.**
- Nhìn **p95/p99** (và max) theo thời gian, không nhìn trung bình/p50.
- Trung bình bị số đông request nhanh kéo xuống, che mất đuôi chậm; 1% request chậm = hàng nghìn người dùng mỗi ngày.
- Mỗi trang gọi nhiều API → xác suất gặp ít nhất một request ở đuôi chậm rất cao.

**Câu 5.**
- **N+1**: từng query nhanh nhưng có hàng trăm query → đếm query mỗi request (log/APM).
- **Chờ connection pool / lock**: `pg_stat_activity` (`state`, `wait_event`), metric pool (thời gian chờ lấy connection).
- **Gọi service ngoài / CPU của app** (serialize JSON lớn, vòng lặp nặng): trace từng span, profiler; và query "5 ms" có thể chỉ nhanh với tham số bạn thử, không phải tham số thật.

</details>

---

## D41 (T7, 07/11): Lab

**⏱ Ước tính:** DSA 50' (bảng T2 Top-K 10' + bài 215 40') · Lab bắt buộc 2h40' · Ôn ⚠️ 30' · **Tổng 4h00'**

### 🧩 DSA: [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

- **Pattern (🔴 T1):** *Top-K*: **điền bảng T2 Heap vs Sort vs Quickselect ở D40 trước (10')**, rồi dùng nó để chọn cách giải.
- **Các cách:**
  1. Sort → O(n log n).
  2. Min-heap kích thước k → O(n log k).
  3. Quickselect với pivot ngẫu nhiên → O(n) trung bình, O(n²) xấu nhất (vì vậy phải chọn pivot ngẫu nhiên).
  4. Counting sort nếu miền giá trị nhỏ (đề cho -10⁴ ≤ x ≤ 10⁴) → O(n + miền giá trị).
- **Mục tiêu:** code được cách 2 trong ≤ 15', nói được ý tưởng cách 3 (phân hoạch như Quicksort nhưng chỉ đệ quy vào **một** phía).
- Sau đó làm lại 1 bài sai trong tuần (nếu có).

### 🛠 Lab – Dự án (bắt buộc 2h40' + mở rộng 15'): Tối ưu API danh sách đơn

> **Chia phần để không vượt 4h:**
> - **Bắt buộc (2h40'):** Bước 1 (20', chạy lệnh sinh 9 triệu `order_items` rồi làm Bước 2 trong lúc chờ) → Bước 2 (40') → Bước 3 (25') → Bước 4a–4e (55') → Bước 5 phần **bảng số liệu + plan trước/sau** (20').
> - **Mở rộng (làm nếu còn giờ):** Bước 4f – chỉ SELECT cột cần (15').
> - **Bản nháp STAR của Bước 5 dời sang D42 (CN, 20')**, vì câu 3 chốt tuần dùng đúng bản nháp này.
> - Bước 6 (ôn ⚠️, 30') là bắt buộc.

Làm trên *Mini Order Service*, ngôn ngữ và framework của bạn, Postgres chạy bằng Docker. Dùng dữ liệu lớn từ lab Tuần 5 (import sang DB của dự án, hoặc trỏ dự án sang database `order_lab`).

**Bước 1: Bổ sung dữ liệu liên quan (20')**

```sql
CREATE TABLE products (
  id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  text   NOT NULL,
  price bigint NOT NULL
);
INSERT INTO products (name, price)
SELECT 'Product ' || g, (random() * 1000000)::bigint FROM generate_series(1, 10000) g;

CREATE TABLE order_items (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id   bigint NOT NULL REFERENCES orders(id),
  product_id bigint NOT NULL REFERENCES products(id),
  quantity   int    NOT NULL,
  unit_price bigint NOT NULL
);
-- 3 item mỗi đơn. Máy yếu thì giới hạn WHERE o.id <= 1000000
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT o.id, (random() * 9999)::bigint + 1, (random() * 4)::int + 1, (random() * 1000000)::bigint
FROM orders o CROSS JOIN generate_series(1, 3);

ANALYZE;
-- Chú ý: KHÔNG tạo index cho order_items.order_id lúc này. Đó là một trong các lỗi bạn sẽ tìm ra.
```

**Bước 2: Viết API "ngây thơ" (40')**

- `GET /orders?user_id=&status=&from=&to=&page=&page_size=20`, sort `created_at DESC`, trả về mỗi đơn kèm danh sách item và tên sản phẩm.
- Viết theo cách tự nhiên nhất với ORM (lazy loading), phân trang bằng `OFFSET`. Mục đích là tạo ra N+1 thật.
- Thêm một endpoint admin `GET /admin/orders?status=delivered&page=5000` (không lọc `user_id`) để thử phân trang sâu.

**Bước 3: Đo baseline (30')**

- Bật log SQL của ORM, đếm số query của **một** request. Ghi lại.
- Đo latency bằng một công cụ load test (ví dụ `hey`, `k6`, `wrk` hoặc `ab`), chạy khoảng 200–500 request với 10 request đồng thời. Ghi p50 và p95.
- Chụp lại plan của query chính:

  ```sql
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM orders
  WHERE user_id = 12345 AND status = 'delivered'
  ORDER BY created_at DESC OFFSET 0 LIMIT 20;

  EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM order_items WHERE order_id = 987654;   -- query lặp lại N lần

  EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM orders WHERE status = 'delivered'
  ORDER BY created_at DESC OFFSET 100000 LIMIT 20;      -- trang admin sâu
  ```

**Bước 4: Sửa từng thứ một, đo lại sau mỗi bước (1h)**

| Bước | Thay đổi | Đo lại |
|---|---|---|
| 4a | Sửa N+1: eager loading hoặc batch `IN (...)` / `= ANY($1)`. Số query mỗi request phải là hằng số (≤ 3) | Số query, p95 |
| 4b | `CREATE INDEX ON order_items (order_id);` (index cho cột FK) | Plan của query item, p95 |
| 4c | Index cho danh sách đơn của user: `(user_id, created_at DESC, id DESC)`. Tự quyết định có đưa `status` vào index không, ghi lý do (gợi ý: mỗi user có bao nhiêu đơn? `status` có luôn được truyền không?) | Plan query chính |
| 4d | Index cho trang admin: `(status, created_at DESC, id DESC)` | Plan trang sâu |
| 4e | Đổi `OFFSET` sang keyset pagination (cursor chứa `created_at` + `id`) | Thời gian trang 1 so với trang "sâu" |
| 4f | Chỉ SELECT các cột API thực sự trả về | Plan, `width`, p95 |

**Bước 5: Viết `notes/query-optimization-lab.md` (30')**

| Bước | Số query / request | p50 | p95 | Plan chính (loại scan / join) | Ghi chú |
|---|---|---|---|---|---|
| Baseline | | | | | |
| Sau 4a (N+1) | | | | | |
| Sau 4b (index FK) | | | | | |
| Sau 4c/4d (index list) | | | | | |
| Sau 4e (keyset) | | | | | |

- Dán plan **trước** và **sau** của query chính (dạng text).
- *(Làm ở D42 – CN)* Viết bản nháp câu chuyện **STAR** (Situation – Task – Action – Result) "Tôi đã tối ưu một API chậm", nói trong ≤ 2 phút, có số liệu cụ thể lấy từ bảng trên.

**Tiêu chí đạt:**
- [ ] Số query mỗi request giảm từ 1 + N (+ M) xuống hằng số.
- [ ] p95 giảm, có số liệu trước/sau.
- [ ] Có plan trước/sau và giải thích được từng node thay đổi thế nào.
- [ ] Trang sâu dùng keyset có thời gian gần bằng trang đầu; trang sâu dùng OFFSET thì chậm hơn rõ rệt.
- [ ] Có bản nháp STAR (hoàn thành ở D42).

**Bước 6 (30'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D42 (CN, 08/11): Chốt tuần 6

**⏱ Ước tính:** DSA 45' · Bản nháp STAR (dời từ D41) 20' · Chốt tuần 60' · Anki/cheat sheet 30' · **Tổng 2h35'**

> Viết bản nháp STAR **trước** khi làm câu hỏi chốt tuần, vì câu 3 yêu cầu kể lại nó.

### 🧩 DSA: [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/)

- **Pattern (🔴 T1):** *Greedy theo tần suất*, có thể mô phỏng bằng *max-heap + hàng đợi cooldown*.
- **Các cách:**
  1. Max-heap theo số lần còn lại + queue chứa task đang chờ hết cooldown. Mỗi đơn vị thời gian: lấy task nhiều nhất ra chạy, đưa vào queue; task hết cooldown thì trả lại heap → O(tổng thời gian · log 26).
  2. Công thức: gọi `maxFreq` là tần suất lớn nhất, `countMax` là số task có tần suất đó → đáp án = `max(len(tasks), (maxFreq − 1) · (n + 1) + countMax)` → O(len(tasks)).
- **Mục tiêu:** giải thích được công thức bằng hình "khung" `maxFreq − 1` nhóm, mỗi nhóm dài `n + 1`. Và vì sao phải lấy `max` với `len(tasks)` (khi có quá nhiều loại task thì không cần thời gian nghỉ).
- **Liên hệ backend:** giống bài toán lập lịch job có giới hạn tần suất gọi (rate limit theo từng loại).

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. In một plan từ lab ra và giải thích từng node.
2. Kể 3 nguyên nhân phổ biến khiến query chậm và cách xử lý từng cái.
3. **Kể chuyện theo STAR:** "Tôi đã tối ưu một API chậm" trong 2 phút, có số liệu.
4. Heap: thao tác insert và pop có độ phức tạp bao nhiêu? Vì sao?
5. Top-K: dùng heap hay sort? Khi nào chọn cái nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Đọc từ node sâu nhất ra ngoài; mỗi node nêu được: loại (scan/join/sort/limit), `Index Cond` vs `Filter`, `rows` ước tính vs `actual rows`.
- Tính thời gian thật = `actual time × loops`, chỉ ra node tốn nhất.
- Giải thích `Buffers: shared hit/read` và vì sao planner chọn plan này (selectivity, index có sẵn).

**Câu 2.**
- **N+1** → eager/batch loading, test đếm query.
- **Thiếu index / index không dùng được** (FK không có index, sai thứ tự cột, hàm trên cột) → tạo index đúng, viết lại điều kiện thành sargable.
- **Ước tính sai do thống kê cũ** → `ANALYZE`; **OFFSET sâu** → keyset pagination; SELECT thừa cột → chỉ lấy cột cần.

**Câu 3.**
- S: API danh sách đơn, dữ liệu vài triệu dòng, p95 bao nhiêu. T: mục tiêu p95 < X ms.
- A: đo baseline → phát hiện N+1 (số query), thiếu index FK, OFFSET sâu → sửa từng bước, đo sau mỗi bước.
- R: số query 1+N → ≤ 3, p95 trước/sau, trang sâu keyset ≈ trang đầu; bài học (thêm test đếm query/alert).

**Câu 4.**
- Heap là cây nhị phân **đầy đủ** lưu trong mảng → chiều cao log n.
- Insert: thêm cuối rồi sift up ≤ log n bước; pop: đưa phần tử cuối lên đỉnh rồi sift down ≤ log n bước → O(log n). Peek O(1).
- Build heap từ mảng có sẵn là O(n).

**Câu 5.**
- Sort O(n log n): đơn giản, khi cần toàn bộ dãy có thứ tự hoặc k gần n.
- Heap kích thước k O(n log k), bộ nhớ O(k): khi k ≪ n hoặc dữ liệu là **stream**.
- Quickselect O(n) trung bình (O(n²) xấu nhất, cần pivot ngẫu nhiên): khi chỉ cần phần tử thứ k trên mảng có sẵn, không cần kết quả sort.

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] File `notes/query-optimization-lab.md` có bảng trước/sau + plan + bản nháp STAR
- [ ] API danh sách đơn đã tối ưu (hết N+1, có index, keyset pagination)
- [ ] File `notes/slow-query-company.md` có ít nhất 1 query chậm thật đã phân tích
- [ ] Tự giải lại 199, 230, 703, 1046, 973, 215 không xem lời giải
- [ ] Anki: đã nhập đủ thẻ T1 của D36–D40 + thẻ pattern Heap / Top-K / BFS theo tầng / Inorder BST
- [ ] Cheat sheet: đã điền 5 bảng T2 (các kiểu scan, 3 thuật toán join, Eager JOIN vs batch IN, Tối ưu query vs cache, Heap vs Sort vs Quickselect)

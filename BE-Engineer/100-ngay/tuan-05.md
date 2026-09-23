# Tuần 5 (26/10 – 01/11): Tree, SQL, Index

← [Tuần 4](tuan-04.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 6 →](tuan-06.md)

**Mục tiêu tuần:** Giải thích được B-Tree index. Thiết kế composite index đúng thứ tự cột. Biết khi nào index **không** được dùng. Về DSA: thành thạo DFS/BFS trên cây nhị phân và tận dụng tính chất của BST.

> **Cách học theo Tier:** 🔴 T1 → hiểu tại sao + thẻ Anki, 🟡 T2 → điền bảng so sánh vào `notes/tradeoff-cheatsheet.md`, 🟢 T3 → chỉ lưu link/snippet vào `notes/snippets.md`. Xem lại bảng đầy đủ ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Research theo cột *Từ khoá research*, học tới mức ghi ở cột *Cần nắm tới mức nào* thì dừng.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Pattern DFS/BFS trên cây, pattern BST (so sánh để đi trái/phải, cận trên/cận dưới), NULL và logic 3 giá trị (`= NULL` vs `IS NULL`), ngữ nghĩa INNER vs LEFT JOIN, thứ tự thực thi logic của SQL, WHERE vs HAVING, window function vs GROUP BY, 3 loại anomaly và 1NF–3NF, constraint là "hàng rào cuối" bảo vệ invariant, cấu trúc B-Tree và vì sao O(log n) + range query tốt, chi phí ghi của index, composite index + leftmost prefix, "bằng trước, khoảng sau", covering index / index-only scan (nguyên lý), cardinality & selectivity, các lý do planner bỏ qua index, partial / expression index (nguyên lý), GIN/GiST ở mức khái niệm | EXISTS/IN vs JOIN, Chuẩn hoá vs Phi chuẩn hoá, UUID vs auto-increment, B-Tree vs Hash index, Một composite index vs nhiều index đơn cột, Partial index vs index đầy đủ | Cú pháp window frame (`ROWS BETWEEN`), cú pháp CTE, BCNF/4NF, cú pháp `ON DELETE CASCADE/RESTRICT`, cú pháp `CREATE INDEX` (`INCLUDE`, `CONCURRENTLY`, `DESC`), operator class (`text_pattern_ops`), cấu trúc trang B-Tree bên trong Postgres, HOT update, tham số cost của planner, BRIN, B-Tree skip scan (Postgres 18), cú pháp `generate_series`, code chi tiết từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D29 (T2) – Ôn SQL | 42' | 85' | 2h07' |
| D30 (T3) – Chuẩn hoá & constraint | 42' | 82' | 2h04' |
| D31 (T4) – Index & B-Tree | 42' | 85' | 2h07' |
| D32 (T5) – Composite index | 42' | 85' | 2h07' |
| D33 (T6) – Cardinality, partial/expression index | 52' | 85' | 2h17' |
| D34 (T7) – Lab index | — | 3h45' | 3h45' |
| D35 (CN) – Chốt tuần 5 | — | 2h30' | 2h30' |

**Tổng tuần: 16h57'**

Ngày nặng nhất là **D34 (Lab 3h45', thêm tới 4h00' nếu làm phần mở rộng)**; bảng T2 *Chuẩn hoá vs Phi chuẩn hoá* của D30 đã dời sang D35 để buổi tối D30 không vượt 90'.

---

## D29 (T2, 26/10): Ôn SQL

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 85' (Học 50' + Bảng T2 10' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h07'**

### 🧩 DSA: [226. Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)

- **Pattern (🔴 T1):** *DFS đệ quy trên cây*. Mọi bài cây đều bắt đầu bằng câu hỏi: "Nếu hai cây con đã được xử lý xong, mình làm gì ở node hiện tại?" Ở đây: đổi chỗ `left` và `right`, rồi đệ quy xuống hai con.
- **Các cách:**
  1. DFS đệ quy → O(n) thời gian, O(h) bộ nhớ (stack đệ quy, h là chiều cao cây; cây lệch thì h = n).
  2. DFS bằng stack tự quản lý → O(n), O(h).
  3. BFS bằng queue: lấy từng node ra, đổi chỗ hai con, đẩy hai con vào queue → O(n), O(w) với w là độ rộng lớn nhất của cây.
- **Lưu ý:** phải lưu tạm một con trước khi gán, nếu không sẽ mất tham chiếu. Nhớ trường hợp cơ sở `root == null`.
- **Mục tiêu:** viết được cả bản đệ quy và bản vòng lặp. Tuần này bạn sẽ gặp lại khung này ở mọi bài.

### 📘 Bài học buổi tối: JOIN, GROUP BY/HAVING, subquery, window function

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | INNER JOIN vs LEFT JOIN, khi nào LEFT JOIN trả về NULL | 🔴 T1 | Vẽ được kết quả của 2 bảng nhỏ (3–4 dòng) với từng loại JOIN | `inner join vs left join visual` |
| 2 | Bẫy "điều kiện của bảng bên phải đặt trong WHERE biến LEFT JOIN thành INNER JOIN" | 🔴 T1 | Giải thích được vì sao, biết chuyển điều kiện vào `ON` (xem chi tiết) | `left join where clause vs on clause` |
| 3 | RIGHT / FULL OUTER / CROSS JOIN, self join | 🟢 T3 | Biết tồn tại; self join dùng cho quan hệ cha–con trong cùng bảng | `self join example` |
| 4 | Thứ tự thực thi logic của một câu SELECT | 🔴 T1 | Thuộc thứ tự FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT, và dùng nó giải thích được lỗi "không dùng alias trong WHERE" | `sql logical query processing order` |
| 5 | GROUP BY, hàm tổng hợp, WHERE vs HAVING | 🔴 T1 | WHERE lọc **dòng** trước khi gom nhóm, HAVING lọc **nhóm** sau khi gom | `where vs having sql` |
| 6 | `COUNT(*)` vs `COUNT(col)` | 🔴 T1 | `COUNT(col)` bỏ qua NULL. Liên quan trực tiếp tới LEFT JOIN: đếm số đơn của mỗi user phải dùng `COUNT(o.id)` | `count star vs count column null` |
| 7 | Subquery (scalar, `IN`, `EXISTS`, correlated) | 🔴 T1 | Đọc hiểu được; biết correlated subquery chạy "theo từng dòng" về mặt logic | `correlated subquery vs join` |
| 8 | **EXISTS/IN vs JOIN** | 🟡 T2 | Điền bảng so sánh bên dưới | `exists vs in vs join performance postgres` |
| 9 | Bẫy `NOT IN` khi subquery có NULL | 🔴 T1 | Biết kết quả là rỗng và dùng `NOT EXISTS` thay thế | `not in null trap sql` |
| 10 | Window function: `OVER (PARTITION BY … ORDER BY …)` khác GROUP BY ở chỗ không gộp dòng | 🔴 T1 | Viết được "top N mỗi nhóm" bằng `ROW_NUMBER()` | `window function vs group by`, `top n per group row_number` |
| 11 | `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`, `LAG/LEAD`, `SUM() OVER` (running total) | 🔴 T1 | Nói được khác biệt khi có giá trị bằng nhau (tie) | `row_number rank dense_rank difference` |
| 12 | Window frame (`ROWS BETWEEN …`), CTE (`WITH`), `WITH RECURSIVE` | 🟢 T3 | Tra khi cần | PostgreSQL docs – *Window Functions*, *WITH Queries* |
| 13 | **NULL = "không biết"** → logic 3 giá trị (TRUE / FALSE / UNKNOWN): `col = NULL` luôn UNKNOWN nên phải dùng `IS NULL`; WHERE chỉ giữ dòng TRUE; hàm tổng hợp (`SUM`, `AVG`, `COUNT(col)`) bỏ qua NULL; `COALESCE` để thay giá trị mặc định | 🔴 T1 | Dự đoán đúng kết quả của `WHERE x = NULL`, `WHERE x <> 'a'` khi `x` là NULL, `AVG` trên cột có NULL. Đây là gốc của bẫy LEFT JOIN (mục 2) và `NOT IN` (mục 9) | `sql null three valued logic`, `is null vs = null` |

**Chi tiết cần hiểu**

- **Thứ tự thực thi logic (mục 4):** `FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT (tính window function ở đây) → DISTINCT → ORDER BY → LIMIT/OFFSET`. Hệ quả:
  - Không dùng được alias của SELECT trong WHERE (WHERE chạy trước SELECT).
  - Không lọc trực tiếp kết quả window function trong WHERE → phải bọc thành subquery hoặc CTE rồi lọc ở ngoài.
  - Đây là thứ tự **logic**. Planner được phép thực thi theo thứ tự vật lý khác, miễn kết quả giống nhau (Tuần 6 sẽ thấy trong EXPLAIN).
- **Bẫy LEFT JOIN (mục 2):**

  ```sql
  -- Sai: user không có đơn 'paid' bị loại mất, vì o.status là NULL và NULL = 'paid' không đúng
  SELECT u.id, COUNT(o.id) FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  WHERE o.status = 'paid'
  GROUP BY u.id;

  -- Đúng: điều kiện của bảng bên phải đặt trong ON
  SELECT u.id, COUNT(o.id) FROM users u
  LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
  GROUP BY u.id;
  ```

- **`NOT IN` với NULL (mục 9):** `WHERE id NOT IN (1, 2, NULL)` không bao giờ đúng, vì `id <> NULL` cho ra UNKNOWN. Kết quả: query trả về rỗng mà không báo lỗi. `NOT EXISTS` không bị lỗi này.
- **Window function (mục 10–11):** với 3 đơn có cùng `total = 100`: `ROW_NUMBER` cho 1, 2, 3; `RANK` cho 1, 1, 1 rồi nhảy lên 4; `DENSE_RANK` cho 1, 1, 1 rồi tới 2. Top-N mỗi nhóm cần đúng N dòng thì dùng `ROW_NUMBER`.
- **Gợi ý khung "top N mỗi nhóm":** subquery bên trong đánh số `ROW_NUMBER() OVER (PARTITION BY <nhóm> ORDER BY <tiêu chí> DESC)`, query bên ngoài lọc `WHERE rn <= N`. Tự viết cho câu hỏi 3 bên dưới.

**🟡 Bảng so sánh T2: EXISTS/IN (subquery) vs JOIN**

Nhóm: *cách diễn đạt truy vấn*. Trục chính của cuộc so sánh: **đúng ngữ nghĩa (không nhân bản dòng, xử lý NULL)** vs **khả năng lấy thêm cột từ bảng kia**.

| Tiêu chí | `EXISTS` / `IN` (subquery) | `JOIN` |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Có làm nhân bản dòng khi quan hệ 1–N không? | | |
| Ext: Cách xử lý NULL (`NOT IN` vs `NOT EXISTS` vs `LEFT JOIN … IS NULL`) | | |
| Ext: Lấy được cột của bảng kia không? | | |

**🔴 Thẻ Anki (T1)**

1. Thứ tự thực thi logic của một câu SELECT là gì? Vì sao không dùng alias của SELECT trong WHERE được?
2. Vì sao đặt `o.status = 'paid'` trong WHERE của một LEFT JOIN lại biến nó thành INNER JOIN?
3. WHERE khác HAVING ở đâu?
4. Window function khác GROUP BY ở điểm nào?
5. `NOT IN (subquery)` gặp NULL thì trả về gì? Dùng gì thay thế?
6. Khi có tie: `ROW_NUMBER`, `RANK`, `DENSE_RANK` khác nhau thế nào?
7. `WHERE x = NULL` trả về gì? `AVG(col)` xử lý NULL thế nào?

**🟢 Tra cứu (T3):** PostgreSQL docs, phần tutorial *Advanced Features → Window Functions*, chương *Queries → WITH Queries (Common Table Expressions)*.

**Tài liệu:**
- postgresqltutorial.com: các bài *Joins*, *GROUP BY*, *HAVING*, *Subquery*, *Window Functions*
- PostgreSQL docs: *Window Functions* (tutorial)

**❓ Câu hỏi cuối bài**

1. INNER JOIN khác LEFT JOIN thế nào? Khi nào LEFT JOIN trả về NULL?
2. WHERE khác HAVING ở đâu?
3. Viết query lấy 3 đơn gần nhất của mỗi user bằng `ROW_NUMBER()`.

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Yêu cầu: "đếm số đơn `paid` của **mọi** user, kể cả user chưa có đơn nào (hiện 0)". Đồng nghiệp viết `SELECT u.id, COUNT(*) FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.status = 'paid' GROUP BY u.id`. Chỉ ra 2 lỗi và sửa.
5. `SELECT * FROM users WHERE deleted_at = NULL` và `SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM blacklist)` (bảng `blacklist` có một dòng `user_id` là NULL) trả về gì? Vì sao? Sửa thế nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- INNER JOIN chỉ giữ cặp dòng khớp ở cả hai bảng; LEFT JOIN giữ **mọi** dòng bảng trái.
- Dòng trái không có dòng phải khớp → các cột của bảng phải là NULL.
- Điều kiện lọc bảng phải đặt trong `ON`, không đặt trong `WHERE` (nếu không LEFT thành INNER).

**Câu 2.**
- Thứ tự logic: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.
- WHERE lọc **dòng** trước khi gom nhóm (không dùng được hàm tổng hợp); HAVING lọc **nhóm** sau khi gom (`HAVING COUNT(*) > 5`).
- Điều kiện không cần hàm tổng hợp nên đặt ở WHERE để giảm dữ liệu sớm.

**Câu 3.**
- Subquery/CTE: `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn`.
- Query ngoài: `WHERE rn <= 3` (không lọc window function trực tiếp trong WHERE được vì WHERE chạy trước SELECT).
- Dùng `ROW_NUMBER` chứ không `RANK` để luôn đúng 3 dòng khi trùng thời gian.

**Câu 4.**
- Lỗi 1: `WHERE o.status = 'paid'` loại mất user không có đơn (NULL = 'paid' là UNKNOWN) → LEFT JOIN thành INNER. Chuyển vào `ON ... AND o.status = 'paid'`.
- Lỗi 2: `COUNT(*)` đếm cả dòng NULL do LEFT JOIN sinh ra → user 0 đơn hiện 1. Dùng `COUNT(o.id)`.

**Câu 5.**
- `deleted_at = NULL` luôn UNKNOWN → trả về **rỗng**; phải viết `deleted_at IS NULL`.
- `NOT IN (..., NULL)` → `id <> NULL` là UNKNOWN cho mọi dòng → **rỗng**, không báo lỗi.
- Sửa: `NOT EXISTS (SELECT 1 FROM blacklist b WHERE b.user_id = u.id)` hoặc lọc `WHERE user_id IS NOT NULL` trong subquery.

</details>

---

## D30 (T3, 27/10): Chuẩn hoá, phi chuẩn hoá, khoá & constraint

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 82' (Học 45' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h04'**

> Tối nay chỉ điền bảng *UUID vs Auto-increment*. Bảng *Chuẩn hoá vs Phi chuẩn hoá* **dời sang D35 (CN)**; phần "Chi tiết cần hiểu" bên dưới đã đủ để trả lời câu 2.

### 🧩 DSA: [104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

- **Pattern (🔴 T1):** *DFS bottom-up*: kết quả của node = hàm của kết quả hai cây con. Ở đây: `1 + max(depth(left), depth(right))`.
- **Các cách:**
  1. DFS đệ quy bottom-up → O(n) thời gian, O(h) bộ nhớ.
  2. DFS top-down: truyền `depth` hiện tại xuống, cập nhật biến max toàn cục khi tới lá.
  3. BFS đếm số tầng (level) → O(n) thời gian, O(w) bộ nhớ.
- **Mục tiêu:** phân biệt được **bottom-up** (trả kết quả lên) và **top-down** (truyền trạng thái xuống). Hai kiểu này lặp lại ở rất nhiều bài cây.
- **Câu hỏi mở rộng hay gặp:** cây có 10⁵ node và bị lệch (giống linked list) thì bản đệ quy có vấn đề gì? (Tràn stack → dùng BFS hoặc stack tự quản lý.)

### 📘 Bài học buổi tối: 1NF–3NF, khi nào phi chuẩn hoá, PK/FK/constraint

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Mục đích của chuẩn hoá: mỗi sự thật chỉ lưu ở **một** chỗ | 🔴 T1 | Nói được bằng một câu | `database normalization why` |
| 2 | 3 loại anomaly: update, insert, delete | 🔴 T1 | Cho được ví dụ từng loại với bảng `orders` chứa thông tin khách hàng | `update insert delete anomaly example` |
| 3 | Functional dependency (A xác định B) | 🔴 T1 | Hiểu ở mức trực giác, không cần ký hiệu hình thức | `functional dependency simple explanation` |
| 4 | 1NF, 2NF, 3NF | 🔴 T1 | Nhận ra vi phạm của từng dạng qua ví dụ (xem chi tiết) | `1nf 2nf 3nf examples` |
| 5 | BCNF, 4NF, 5NF | 🟢 T3 | Biết tồn tại | — |
| 6 | **Chuẩn hoá vs Phi chuẩn hoá** | 🟡 T2 | Điền bảng so sánh bên dưới | `when to denormalize database` |
| 7 | "Snapshot" dữ liệu lịch sử (giá lúc mua, địa chỉ giao hàng) **không phải** phi chuẩn hoá | 🔴 T1 | Giải thích được vì sao `order_items.unit_price` phải copy từ `products.price` | `order item price snapshot database design` |
| 8 | PK, FK, UNIQUE, NOT NULL, CHECK | 🔴 T1 | Biết mỗi loại bảo vệ invariant nào; constraint là hàng rào cuối, vì validate ở tầng app có thể bị race condition | `database constraints data integrity` |
| 9 | Postgres **không** tự tạo index cho cột FK | 🔴 T1 | Biết hậu quả: JOIN chậm, xoá bản ghi cha chậm | `postgres foreign key index not automatic` |
| 10 | **UUID vs auto-increment** làm khoá chính | 🟡 T2 | Điền bảng so sánh bên dưới | `uuid vs auto increment primary key`, `uuidv7 b-tree` |
| 11 | Natural key vs surrogate key | 🔴 T1 | Biết vì sao thường dùng surrogate key (email có thể đổi) | `natural key vs surrogate key` |
| 12 | Cú pháp `ON DELETE CASCADE / RESTRICT / SET NULL`, `DEFERRABLE` | 🟢 T3 | Tra khi cần | PostgreSQL docs – *Constraints* |

**Chi tiết cần hiểu**

- **Ví dụ vi phạm (mục 4):**

  | Dạng | Vi phạm | Ví dụ | Sửa |
  |---|---|---|---|
  | 1NF | Giá trị không nguyên tử, nhóm lặp | `orders.product_ids = '3,7,9'` | Tách bảng `order_items` |
  | 2NF | Cột phụ thuộc vào **một phần** của khoá ghép | `order_items(order_id, product_id, product_name, qty)` với PK `(order_id, product_id)`: `product_name` chỉ phụ thuộc `product_id` | Chuyển `product_name` về `products` |
  | 3NF | Phụ thuộc bắc cầu (khoá → A → B) | `orders(id, customer_id, customer_email)`: `customer_email` phụ thuộc `customer_id`, không phụ thuộc `id` | Chuyển về bảng `customers` |

- **Anomaly (mục 2):** bảng `orders` chứa luôn `customer_name`, `customer_address`:
  - *Update anomaly:* khách đổi địa chỉ, phải sửa hàng trăm dòng; sót một dòng là dữ liệu mâu thuẫn.
  - *Insert anomaly:* không lưu được khách hàng chưa có đơn nào.
  - *Delete anomaly:* xoá đơn cuối cùng thì mất luôn thông tin khách.
- **Snapshot khác phi chuẩn hoá (mục 7):** `products.price` là "giá hiện tại", `order_items.unit_price` là "giá tại thời điểm mua". Đây là **hai sự thật khác nhau**, nên copy giá vào `order_items` là đúng chuẩn, không phải dư thừa. Địa chỉ giao hàng của đơn cũng vậy.
- **Phi chuẩn hoá có chủ đích:** cột đếm `products.review_count`, cột `orders.total_amount` (tổng các item), materialized view cho báo cáo. Cái giá phải trả: phải đồng bộ khi ghi (trong cùng transaction, bằng trigger, hoặc bằng event), và có nguy cơ lệch dữ liệu.
- **PK và UNIQUE (mục 8):** PK = `UNIQUE` + `NOT NULL`, mỗi bảng một PK, và DB **tự tạo index** cho PK và mọi cột `UNIQUE` (khác với FK, mục 9). `UNIQUE` cho phép **nhiều dòng NULL** (vì NULL ≠ NULL); Postgres 15+ có `UNIQUE NULLS NOT DISTINCT` nếu muốn chặn.
- **Constraint và race condition (mục 8):** code kiểm tra "email đã tồn tại chưa" rồi mới INSERT sẽ lọt khi hai request chạy đồng thời. Chỉ `UNIQUE` constraint ở DB mới chặn được chắc chắn. Tương tự `CHECK (stock >= 0)` là lưới an toàn cho bài toán tồn kho ở Tuần 7.
- **UUID và B-Tree (mục 10):** UUIDv4 ngẫu nhiên nên mỗi lần INSERT rơi vào một vị trí bất kỳ trong index → nhiều page split, cache kém. Auto-increment và UUIDv7 (có tiền tố thời gian) luôn chèn vào cuối index. Postgres 13+ có sẵn `gen_random_uuid()` (v4), Postgres 18 có thêm `uuidv7()`. Câu này sẽ được hỏi lại ở Tuần 10 (Unique ID Generator).

**🟡 Bảng so sánh T2: Chuẩn hoá vs Phi chuẩn hoá** *(điền ở D35 – CN)*

Nhóm: *data storage/model*. Trục chính của cuộc so sánh: **toàn vẹn dữ liệu và chi phí ghi** vs **tốc độ đọc**.

| Tiêu chí | Chuẩn hoá (3NF) | Phi chuẩn hoá |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Nguy cơ mâu thuẫn dữ liệu | | |
| Ext: Chi phí đọc (số JOIN) và chi phí ghi | | |
| Ext: Cách giữ đồng bộ (transaction, trigger, event, materialized view) | | |

**🟡 Bảng so sánh T2: UUID vs Auto-increment (khoá chính)**

Nhóm: *data storage/model: định danh bản ghi*. Trục chính của cuộc so sánh: **sinh ID phân tán, không lộ thông tin** vs **hiệu năng index và kích thước**.

| Tiêu chí | Auto-increment (`bigint identity`) | UUID (v4 / v7) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Ảnh hưởng tới B-Tree index khi INSERT | | |
| Ext: Kích thước (8 byte vs 16 byte) và chi phí JOIN | | |
| Ext: Sinh ở đâu được (chỉ DB, hay client/nhiều node)? Có lộ số lượng bản ghi không? | | |

**🔴 Thẻ Anki (T1)**

1. Kể 3 loại anomaly khi bảng `orders` chứa luôn thông tin khách hàng.
2. Vi phạm 2NF và 3NF khác nhau ở đâu? Cho mỗi loại một ví dụ.
3. Vì sao copy `unit_price` vào `order_items` không phải là phi chuẩn hoá?
4. Vì sao kiểm tra trùng email ở tầng app là chưa đủ?
5. Postgres có tự tạo index cho cột khoá ngoại không? Hậu quả là gì?
6. Vì sao UUIDv4 làm chậm INSERT trên B-Tree index hơn auto-increment?

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Data Definition → Constraints*; cú pháp `GENERATED ALWAYS AS IDENTITY`.

**Tài liệu:**
- Bài viết tìm theo từ khoá `database normalization 1NF 2NF 3NF with examples`
- PostgreSQL docs: *Constraints*

**❓ Câu hỏi cuối bài**

1. Bảng `orders` chứa luôn tên và địa chỉ khách hàng thì gặp vấn đề gì?
2. Khi nào phi chuẩn hoá (denormalize) mang lại lợi ích?
3. Khoá chính dùng UUID hay auto-increment? Trade-off là gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Sản phẩm tăng giá từ 100k lên 120k. Nếu `order_items` **không** lưu `unit_price` mà luôn JOIN sang `products.price`, báo cáo doanh thu tháng trước sai thế nào? Vì sao lưu `unit_price` không bị coi là phi chuẩn hoá?
5. Code đã `SELECT ... WHERE email = ?` trước khi INSERT, nhưng DB vẫn có 2 user trùng email. Vì sao? Sửa thế nào? Sau đó bạn thêm FK `orders.user_id → users.id` và thấy `DELETE FROM users WHERE id = ?` rất chậm trên bảng `orders` 5 triệu dòng: vì sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Vi phạm 3NF: thông tin khách phụ thuộc `customer_id`, không phụ thuộc `order_id` → cùng một sự thật lưu ở nhiều chỗ.
- Update anomaly: đổi địa chỉ phải sửa hàng trăm dòng, sót là mâu thuẫn. Insert anomaly: không lưu được khách chưa có đơn. Delete anomaly: xoá đơn cuối mất luôn khách.
- Ngoại lệ: **địa chỉ giao hàng của đơn** là snapshot hợp lệ.

**Câu 2.**
- Khi đọc nhiều hơn ghi rất nhiều và JOIN/tổng hợp là nút thắt: cột đếm (`review_count`), `orders.total_amount`, materialized view báo cáo, read model.
- Cái giá: phải đồng bộ khi ghi (cùng transaction, trigger, event), rủi ro lệch dữ liệu.
- Chỉ làm sau khi đã đo và index/query không đủ.

**Câu 3.**
- Auto-increment (`bigint identity`): 8 byte, chèn cuối B-Tree (ít page split), dễ đọc; nhưng chỉ DB sinh được, lộ số lượng/đoán được id.
- UUIDv4: sinh ở client/nhiều node, không đoán được; nhưng 16 byte và **ngẫu nhiên** → chèn rải rác, page split, cache kém.
- UUIDv7 (tiền tố thời gian) lấy được phần lớn ưu điểm của cả hai.

**Câu 4.**
- Báo cáo quá khứ bị tính lại theo giá **hiện tại** (120k) → doanh thu sai; hoá đơn cũ thay đổi.
- `products.price` = giá hiện tại, `order_items.unit_price` = giá tại lúc mua → **hai sự thật khác nhau**, nên không dư thừa.

**Câu 5.**
- Race condition: hai request cùng `SELECT` thấy "chưa có" rồi cùng INSERT. Chỉ `UNIQUE` constraint ở DB chặn chắc chắn; app bắt lỗi trùng khoá → `409`.
- Postgres **không tự tạo index cho cột FK**: xoá một user phải quét `orders` để kiểm tra dòng tham chiếu → Seq Scan 5 triệu dòng.
- Sửa: `CREATE INDEX ON orders (user_id)` (cũng giúp JOIN).

</details>

---

## D31 (T4, 28/10): Index là gì, B-Tree hoạt động ra sao

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 85' (Học 50' + Bảng T2 10' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h07'**

### 🧩 DSA: [100. Same Tree](https://leetcode.com/problems/same-tree/)

- **Pattern (🔴 T1):** *DFS song song trên hai cây*. Duyệt hai cây cùng lúc, so sánh từng cặp node tương ứng.
- **Trường hợp cơ sở (thứ tự quan trọng):**
  1. Cả hai đều null → `true`.
  2. Chỉ một bên null → `false`.
  3. Giá trị khác nhau → `false`.
  4. Còn lại: `same(p.left, q.left) && same(p.right, q.right)`.
- **Độ phức tạp:** O(n) thời gian, O(h) bộ nhớ. Có thể làm bằng BFS với queue chứa **cặp** node.
- **Mục tiêu:** bài này là "hàm con" cho bài 572 ngày mai. Viết gọn và chắc.

### 📘 Bài học buổi tối: Index và B-Tree

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Không có index → phải đọc cả bảng (Seq Scan), O(n) | 🔴 T1 | Nói được bằng một câu | `full table scan vs index` |
| 2 | Index là cấu trúc dữ liệu **riêng**, đã sort, mỗi phần tử gồm (giá trị khoá, con trỏ tới dòng trong bảng) | 🔴 T1 | Vẽ được hình: index → con trỏ → bảng | `how database index works` |
| 3 | Postgres: bảng là *heap* không có thứ tự, mọi index đều trỏ tới vị trí vật lý (`ctid`). InnoDB: bảng chính là *clustered index* theo PK, secondary index lưu giá trị PK | 🔴 T1 | Nói được hệ quả: ở InnoDB, tra qua secondary index phải đi 2 cây | `postgres heap vs innodb clustered index` |
| 4 | Cấu trúc B-Tree: cân bằng, mỗi node là một page (8KB ở Postgres), **fan-out** hàng trăm, lá nối với nhau thành danh sách có thứ tự | 🔴 T1 | Giải thích được vì sao chỉ cần 3–4 tầng cho hàng chục triệu dòng | `b-tree index structure fan-out`, `use the index luke anatomy` |
| 5 | Tra cứu = đi từ gốc xuống lá (O(log n)) → đi dọc các lá → đọc bảng | 🔴 T1 | Nói được 3 bước, và biết bước "đọc bảng" (random I/O) mới là phần tốn kém | `use the index luke slow indexes` |
| 6 | Vì sao B-Tree hỗ trợ tốt range query và ORDER BY | 🔴 T1 | Tìm điểm bắt đầu rồi đi dọc lá; lá đã sort sẵn nên không cần sort lại | `b-tree range scan leaf nodes` |
| 7 | Vì sao dùng B-Tree chứ không dùng cây nhị phân | 🔴 T1 | Số lần đọc page từ đĩa: log₂(10⁷) ≈ 23 so với 3–4 | `why b-tree for disk` |
| 8 | Chi phí của index: INSERT/UPDATE/DELETE chậm hơn, tốn dung lượng, sinh thêm WAL | 🔴 T1 | Kể được ≥ 3 chi phí và giải thích vì sao | `index write overhead` |
| 9 | **B-Tree vs Hash index** | 🟡 T2 | Điền bảng so sánh bên dưới | `postgres hash index vs btree` |
| 10 | GIN (inverted index cho array, `jsonb`, full-text), GiST (dữ liệu hình học, khoảng, "gần nhất") | 🔴 T1 | Mỗi loại **một câu**: dùng cho kiểu dữ liệu/truy vấn nào. Không đào sâu cách cài đặt | `postgres gin index explained`, `gist index use cases` |
| 11 | BRIN, B+Tree vs B-Tree, cấu trúc page bên trong, HOT update | 🟢 T3 | Biết tên là đủ | PostgreSQL docs – *Index Types* |

**Chi tiết cần hiểu**

- **Hình dung B-Tree (mục 4–5):**

  ```
                      [ 40 | 80 ]                    ← gốc
            /             |              \
     [10 | 25]        [50 | 65]        [90 | 120]     ← node nhánh
      /  |  \          /  |  \           /  |  \
    lá ↔ lá ↔ lá  ↔  lá ↔ lá ↔ lá  ↔   lá ↔ lá ↔ lá   ← lá đã sort, nối với nhau
                                                      mỗi entry: (khoá, ctid → dòng trong heap)
  ```

  - Mỗi node chứa hàng trăm khoá (fan-out lớn), nên cây rất thấp: fan-out ~300 thì 3 tầng đã chứa ~27 triệu khoá.
  - Cây luôn **cân bằng**: mọi lá có cùng độ sâu, nên mọi lần tra cứu đều O(log n).
- **Range query (mục 6):** `WHERE created_at BETWEEN a AND b` → đi xuống lá chứa `a` một lần, sau đó đi dọc các lá cho tới khi vượt `b`. Hash index không làm được việc này vì hash phá vỡ thứ tự.
- **"Slow index" (mục 5):** index nhanh ở bước tìm, nhưng nếu khớp 100.000 dòng nằm rải rác ở 100.000 page khác nhau thì phải đọc bảng 100.000 lần ngẫu nhiên. Đây là lý do planner đôi khi bỏ qua index (D33, Tuần 6).
- **Chi phí ghi (mục 8):**
  - Mỗi INSERT phải chèn thêm một entry vào **mỗi** index của bảng. Bảng có 6 index nghĩa là 1 lần ghi bảng + 6 lần ghi index.
  - UPDATE một cột có index: ở Postgres, UPDATE tạo ra một phiên bản dòng mới (MVCC, Tuần 7), nên thường phải thêm entry mới vào các index.
  - Page đầy thì phải tách đôi (page split).
  - Tốn dung lượng đĩa và RAM (cache), sinh thêm WAL, tăng việc cho VACUUM.
  - Tạo index trên bảng lớn mặc định sẽ chặn ghi; dùng `CREATE INDEX CONCURRENTLY` (T3).
- **GIN (mục 10):** giống mục lục cuối sách, ánh xạ "từ" → danh sách dòng chứa từ đó. Dùng cho `tags @> ARRAY['sale']`, `data @> '{"color":"red"}'` trên `jsonb`, full-text search.

**🟡 Bảng so sánh T2: B-Tree vs Hash index**

Nhóm: *cấu trúc index*. Trục chính của cuộc so sánh: **loại truy vấn hỗ trợ** vs **chi phí cho truy vấn bằng**.

| Tiêu chí | B-Tree | Hash |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Hỗ trợ range, ORDER BY, `LIKE 'abc%'`? | | |
| Ext: Dùng làm UNIQUE / composite index được không (ở Postgres)? | | |
| Ext: Độ phức tạp tra cứu và kích thước | | |

**🔴 Thẻ Anki (T1)**

1. Tra cứu bằng B-Tree index gồm những bước nào? Bước nào tốn kém nhất?
2. Vì sao B-Tree chỉ cần 3–4 tầng cho hàng chục triệu dòng?
3. Vì sao B-Tree hỗ trợ range query còn Hash index thì không?
4. Kể 3 chi phí của việc thêm index.
5. Postgres heap table khác InnoDB clustered index ở điểm nào?
6. GIN index dùng cho loại truy vấn nào?

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Indexes → Index Types*.

**Tài liệu:**
- use-the-index-luke.com, chương 1 *Anatomy of an SQL Index* (3 phần: *The Index Leaf Nodes*, *The Search Tree (B-Tree)*, *Slow Indexes, Part I*)
- DDIA chương 3 *Storage and Retrieval*, phần B-Trees (đọc thêm, không bắt buộc)

**❓ Câu hỏi cuối bài**

1. Vì sao B-Tree tra cứu được O(log n) và hỗ trợ tốt truy vấn khoảng (range query)?
2. Index làm chậm những thao tác nào? Vì sao?
3. Hash index khác B-Tree ở đâu?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Vì sao DB dùng B-Tree có fan-out hàng trăm thay vì cây nhị phân cân bằng (AVL, đỏ-đen)? Ước lượng số lần đọc page để tìm một dòng trong bảng 10 triệu dòng với mỗi loại cây.
5. Cùng query `SELECT * FROM orders WHERE email = ?` có secondary index trên `email`: ở Postgres (heap) và MySQL InnoDB (clustered theo PK), đường đi tới dòng dữ liệu khác nhau thế nào? Vì sao ở InnoDB, chọn PK là UUIDv4 còn tệ hơn ở Postgres?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Cây **cân bằng**, fan-out lớn → chiều cao ~log_fanout(n), 3–4 tầng cho hàng chục triệu dòng → O(log n) lần đọc page.
- Lá **đã sort** và nối với nhau: range query = seek tới điểm đầu một lần rồi đi dọc lá tới khi vượt cận.
- Lá đã sort nên phục vụ luôn `ORDER BY` mà không cần sort lại.

**Câu 2.**
- Mọi INSERT/DELETE phải cập nhật **mọi** index của bảng; UPDATE cột có index (ở Postgres còn tạo phiên bản dòng mới) phải thêm entry index.
- Page đầy → page split; sinh thêm WAL; tốn đĩa và RAM cache; thêm việc cho VACUUM.
- Nên chỉ tạo index phục vụ query thật sự cần.

**Câu 3.**
- Hash: chỉ hỗ trợ `=`, O(1) trung bình; không range, không `ORDER BY`, không `LIKE 'abc%'`.
- B-Tree: `=`, range, sort, prefix; là mặc định; ở Postgres hash index không dùng cho UNIQUE/composite.
- Thực tế B-Tree gần như luôn đủ tốt.

**Câu 4.**
- Chi phí chính là **số lần đọc page** (I/O), không phải số phép so sánh.
- Cây nhị phân: log₂(10⁷) ≈ 23 tầng → ~23 lần đọc page. B-Tree fan-out ~300: 3–4 tầng, tầng trên nằm sẵn trong cache.
- Mỗi node B-Tree = một page, tận dụng trọn một lần đọc.

**Câu 5.**
- Postgres: index `email` → `ctid` → đọc thẳng dòng trong heap (1 cây + 1 lần đọc heap).
- InnoDB: secondary index lưu **giá trị PK** → phải đi tiếp cây clustered theo PK (2 cây).
- InnoDB lưu **chính dữ liệu dòng** theo thứ tự PK → PK ngẫu nhiên làm page split ngay trên bảng, và PK 16 byte bị lặp trong **mọi** secondary index.

</details>

---

## D32 (T5, 29/10): Composite index, thứ tự cột, covering index

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 85' (Học 50' + Bảng T2 10' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h07'**

### 🧩 DSA: [572. Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/)

- **Pattern (🔴 T1):** *Duyệt cây + gọi hàm con so sánh*. Với mỗi node của `root`, kiểm tra `isSameTree(node, subRoot)` (dùng lại bài 100).
- **Các cách:**
  1. Duyệt từng node rồi gọi Same Tree → O(m · n) thời gian, O(h) bộ nhớ. Đủ để qua bài.
  2. Serialize cả hai cây thành chuỗi (có đánh dấu null) rồi tìm chuỗi con (KMP) → O(m + n).
  3. Hash cây con (giống Merkle tree) → O(m + n) trung bình.
- **Lưu ý:** khi serialize phải có **ký tự phân cách** và **đánh dấu null**. Nếu không, `2` sẽ khớp nhầm với một phần của `12`, và hai cây khác hình có thể cho cùng chuỗi.
- **Mục tiêu:** nói được cách 1 và phân tích độ phức tạp. Cách 2, 3 chỉ cần biết ý tưởng để trả lời "còn cách nào khác không?".

### 📘 Bài học buổi tối: Composite index & thứ tự cột

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Composite index `(a, b)` sort theo `a` trước, trong cùng `a` mới sort theo `b` (giống danh bạ: họ, rồi tên) | 🔴 T1 | Vẽ được thứ tự các entry của index `(user_id, created_at)` | `concatenated index use the index luke` |
| 2 | **Leftmost prefix**: index `(a, b, c)` phục vụ được `a`, `a,b`, `a,b,c`; không phục vụ tốt `b` hay `c` một mình | 🔴 T1 | Trả lời đúng các ví dụ ở phần chi tiết không cần suy nghĩ lâu | `leftmost prefix rule composite index` |
| 3 | **Bằng trước, khoảng sau**: cột so sánh `=` đặt trước cột so sánh khoảng (`>`, `<`, `BETWEEN`) | 🔴 T1 | Giải thích được bằng hình các lá của index (xem chi tiết) | `composite index equality before range` |
| 4 | Access predicate vs filter predicate | 🔴 T1 | Biết điều kiện nào dùng để "thu hẹp vùng quét" và điều kiện nào chỉ để "lọc bớt" sau khi quét | `access predicate filter predicate index` |
| 5 | Index phục vụ ORDER BY (tránh bước sort) và `ORDER BY … LIMIT` (top-N) | 🔴 T1 | Biết `WHERE user_id = ? ORDER BY created_at DESC LIMIT 20` chỉ đọc đúng 20 entry | `index order by limit top n` |
| 6 | Covering index và Index Only Scan | 🔴 T1 | Giải thích được: mọi cột query cần đều có trong index → không phải đọc bảng | `covering index index only scan postgres` |
| 7 | Điều kiện của Index Only Scan ở Postgres: page phải được đánh dấu "all-visible" trong *visibility map* (VACUUM cập nhật) | 🔴 T1 | Biết vì sao sau khi ghi nhiều, plan vẫn có `Heap Fetches` lớn | `postgres visibility map index only scan heap fetches` |
| 8 | **Một composite index vs nhiều index đơn cột** | 🟡 T2 | Điền bảng so sánh bên dưới | `composite index vs multiple single column indexes`, `bitmap and postgres` |
| 9 | Cú pháp `INCLUDE (...)`, index có `DESC`, thứ tự ASC/DESC trộn lẫn | 🟢 T3 | Tra khi cần | PostgreSQL docs – *Index-Only Scans and Covering Indexes*, *Indexes and ORDER BY* |
| 10 | B-Tree skip scan (Postgres 18, MySQL 8.0.13+) | 🟢 T3 | Biết là một số phiên bản mới có thể dùng index khi thiếu cột đầu **nếu** cột đầu ít giá trị. Không dựa vào nó khi thiết kế | `postgres 18 skip scan` |

**Chi tiết cần hiểu**

- **Ví dụ leftmost prefix với index `(user_id, created_at)` (mục 2):**

  | Query | Dùng được index? | Vì sao |
  |---|---|---|
  | `WHERE user_id = 5` | ✅ | Tiền tố trái nhất |
  | `WHERE user_id = 5 AND created_at > '2026-10-01'` | ✅ tốt nhất | Seek tới `(5, '2026-10-01')` rồi đi dọc lá |
  | `WHERE user_id = 5 ORDER BY created_at DESC LIMIT 20` | ✅, không cần sort | Trong cùng `user_id = 5`, `created_at` đã có thứ tự sẵn (đọc ngược cũng được) |
  | `WHERE created_at > '2026-10-01'` | ❌ (thường là không) | `created_at` chỉ có thứ tự **bên trong** từng `user_id`, không có thứ tự toàn cục |
  | `WHERE user_id IN (1, 2, 3)` | ✅ | Seek 3 lần |
  | `ORDER BY created_at` (không có WHERE) | ❌ | Lý do như trên |

- **Bằng trước, khoảng sau (mục 3):** query `WHERE status = 'pending' AND created_at > now() - interval '7 days'`.
  - Index `(status, created_at)`: tất cả entry `pending` của 7 ngày gần đây nằm **liền nhau** → seek một lần, quét đúng vùng cần. Cả hai điều kiện đều là access predicate.
  - Index `(created_at, status)`: phải quét mọi entry của 7 ngày (của **mọi** status), rồi lọc `status` từng entry. `status` chỉ còn là filter predicate.
  - Quy tắc: sau cột đầu tiên có điều kiện khoảng, các cột phía sau không còn thu hẹp được vùng quét nữa.
- **Thiết kế index theo query, không theo bảng:** liệt kê các query quan trọng trước, rồi mới chọn index sao cho một index phục vụ được nhiều query nhất nhờ tiền tố chung. Quy tắc "cột selectivity cao nhất đứng đầu" là quy tắc phụ; quy tắc chính là "cột dùng `=` đứng trước" và "query nào cần tiền tố nào".
- **Covering index (mục 6–7):**

  ```sql
  -- Query danh sách đơn của user chỉ cần created_at, total_amount
  CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC) INCLUDE (total_amount);
  ```

  - Plan sẽ là `Index Only Scan`. Dòng `Heap Fetches: N` cho biết bao nhiêu dòng vẫn phải kiểm tra trong bảng vì page chưa "all-visible".
  - Lý do: index của Postgres không lưu thông tin phiên bản (MVCC), nên chỉ bỏ qua bảng được khi visibility map xác nhận cả page đều thấy được với mọi transaction. Chạy `VACUUM` sẽ cập nhật visibility map và `Heap Fetches` giảm về gần 0 (bạn sẽ đo ở Lab D34).

**🟡 Bảng so sánh T2: Một composite index vs nhiều index đơn cột**

Nhóm: *chiến lược index*. Trục chính của cuộc so sánh: **tốc độ cho một nhóm query cụ thể** vs **tính linh hoạt và chi phí ghi**.

| Tiêu chí | Một composite index `(a, b)` | Hai index đơn `(a)` và `(b)` (planner kết hợp bằng BitmapAnd) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Phục vụ ORDER BY / `LIMIT` không cần sort? | | |
| Ext: Phục vụ query chỉ lọc theo `b`? | | |
| Ext: Chi phí ghi và dung lượng | | |

**🔴 Thẻ Anki (T1)**

1. Index `(a, b, c)` phục vụ được những tổ hợp điều kiện nào?
2. Vì sao cột so sánh `=` nên đứng trước cột so sánh khoảng? Giải thích bằng hình các lá.
3. Access predicate khác filter predicate thế nào?
4. Vì sao index `(user_id, created_at)` giúp `WHERE user_id = ? ORDER BY created_at DESC LIMIT 20` không cần sort?
5. Covering index là gì? Index Only Scan ở Postgres cần thêm điều kiện gì?
6. Vì sao nên thiết kế index xuất phát từ danh sách query chứ không phải từ danh sách cột?

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Indexes* → *Multicolumn Indexes*, *Indexes and ORDER BY*, *Index-Only Scans and Covering Indexes*.

**Tài liệu:**
- use-the-index-luke.com, chương 2 *The Where Clause*: các phần *Concatenated Keys*, *Slow Indexes, Part II*, *Searching for Ranges*
- use-the-index-luke.com, chương 5 *Clustering Data*: phần *Index-Only Scan* (đọc thêm)

**❓ Câu hỏi cuối bài**

1. Có index `(user_id, created_at)`. Query `WHERE user_id = ?` có dùng được không? `WHERE created_at > ?` thì sao? Còn `WHERE user_id = ? ORDER BY created_at`?
2. Vì sao nên đặt cột so sánh bằng (`=`) trước cột so sánh khoảng?
3. Covering index / index-only scan là gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Bạn đã tạo `(user_id, created_at DESC) INCLUDE (total_amount)`, plan hiện `Index Only Scan` nhưng kèm `Heap Fetches: 48000` và vẫn chậm. Vì sao? Làm gì để sửa? Nếu thêm `status` vào `SELECT` thì plan đổi thế nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- `WHERE user_id = ?`: ✅ tiền tố trái nhất.
- `WHERE created_at > ?`: ❌ thường không, vì `created_at` chỉ có thứ tự **bên trong** từng `user_id`.
- `WHERE user_id = ? ORDER BY created_at`: ✅ và **không cần Sort**; thêm `LIMIT 20` thì chỉ đọc đúng 20 entry.

**Câu 2.**
- Với cột đầu là `=`, mọi entry khớp nằm **liền nhau** và trong đó cột sau đã sort → seek một lần, quét đúng vùng cần.
- Nếu cột khoảng đứng trước, phải quét cả khoảng (mọi giá trị của cột sau) rồi lọc → cột sau chỉ còn là **filter predicate**.
- Sau cột khoảng đầu tiên, các cột phía sau không thu hẹp vùng quét nữa.

**Câu 3.**
- Covering index: index chứa **mọi cột** query cần (cột khoá hoặc `INCLUDE`) → không phải đọc bảng.
- Plan: `Index Only Scan`; ở Postgres còn cần page *all-visible* trong visibility map.
- Lợi: tránh random I/O vào heap; giá: index to hơn, ghi chậm hơn.

**Câu 4.**
- Index của Postgres không lưu thông tin MVCC → page chưa *all-visible* thì vẫn phải vào heap kiểm tra (Heap Fetches).
- Sau nhiều ghi, visibility map chưa cập nhật → chạy `VACUUM` (hoặc chỉnh autovacuum) → Heap Fetches về gần 0.
- Thêm `status` (không có trong index) → không còn covering → thành `Index Scan` (đọc heap cho mọi dòng).

</details>

---

## D33 (T6, 30/10): Cardinality, selectivity, khi nào index bị bỏ qua

**⏱ Ước tính:** Giờ làm 52' (DSA 40' + Anki 12') · Tối 85' (Học 50' + Bảng T2 10' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h17'**

### 🧩 DSA: [235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

- **Pattern (🔴 T1):** *Tận dụng tính chất BST* (trái < node < phải) để chỉ đi **một nhánh**, giống binary search.
- **Ý tưởng:** bắt đầu từ gốc:
  - `p` và `q` đều nhỏ hơn node → đi sang trái.
  - Cả hai đều lớn hơn → đi sang phải.
  - Còn lại (tách về hai phía, hoặc một trong hai chính là node) → node hiện tại là LCA.
- **Độ phức tạp:** O(h) thời gian. Bản vòng lặp chỉ tốn O(1) bộ nhớ, bản đệ quy tốn O(h).
- **Lưu ý:** bài này **khác** bài 236 (LCA của cây nhị phân thường, Tuần 13). Nếu không dùng tính chất BST thì bạn đang giải bài 236 với độ phức tạp O(n).

### 📘 Bài học buổi tối: Cardinality, selectivity, partial index, expression index

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Cardinality** (số giá trị khác nhau của cột) vs **selectivity** (tỉ lệ dòng khớp điều kiện trên tổng số dòng) | 🔴 T1 | Tính được selectivity cho ví dụ `status` bên dưới | `cardinality vs selectivity database` |
| 2 | Planner ước lượng số dòng dựa trên **thống kê** (số giá trị khác nhau, giá trị phổ biến và tần suất, histogram); `ANALYZE` cập nhật thống kê | 🔴 T1 | Biết thống kê cũ → ước lượng sai → chọn plan sai | `postgres planner statistics analyze` |
| 3 | Vì sao query trả về phần lớn bảng thì Seq Scan rẻ hơn Index Scan | 🔴 T1 | Giải thích bằng đọc tuần tự vs đọc ngẫu nhiên. Không cần thuộc ngưỡng phần trăm cụ thể | `why postgres not using index` |
| 4 | Dữ liệu lệch (skew): index trên `status` vô dụng với giá trị phổ biến nhưng rất có ích với giá trị hiếm | 🔴 T1 | Giải thích được ví dụ bên dưới | `index low cardinality column skewed data` |
| 5 | Các lý do planner bỏ qua index | 🔴 T1 | Kể được ≥ 6 lý do trong danh sách bên dưới | `sargable query`, `reasons index not used` |
| 6 | **Partial index** (`… WHERE status = 'pending'`) | 🔴 T1 | Biết nó nhỏ, rẻ khi ghi, và query phải chứa điều kiện khớp với điều kiện của index | `postgres partial index` |
| 7 | **Expression index** (`ON users (LOWER(email))`) | 🔴 T1 | Biết query phải dùng **đúng** biểu thức đó | `postgres expression index lower` |
| 8 | Partial unique index (ví dụ: mỗi user chỉ có một địa chỉ mặc định) | 🔴 T1 | Viết được ý tưởng bằng một câu | `partial unique index postgres` |
| 9 | **Partial index vs index đầy đủ** | 🟡 T2 | Điền bảng so sánh bên dưới | `partial index vs full index` |
| 10 | Tên các view thống kê (`pg_stats`), `random_page_cost`, `default_statistics_target`, `text_pattern_ops`, `pg_trgm`, kiểu `citext` | 🟢 T3 | Tra khi cần | PostgreSQL docs – *Statistics Used by the Planner* |

**Chi tiết cần hiểu**

- **Ví dụ selectivity (mục 1, 4):** bảng `orders` có 5 triệu dòng, cột `status` có 5 giá trị (cardinality = 5):

  | status | Tỉ lệ | Index có ích? |
  |---|---|---|
  | `delivered` | 75% | ❌ Seq Scan rẻ hơn |
  | `cancelled` | 13% | Thường không |
  | `shipped` | 8% | Tuỳ |
  | `paid` | 3% | Có thể |
  | `pending` | 1% (50.000 dòng) | ✅ Rất có ích |

  → Nếu query nóng chỉ hỏi `status = 'pending'`, dùng **partial index** `ON orders (created_at) WHERE status = 'pending'`: chỉ chứa 1% số dòng, nhỏ và rẻ khi ghi.
- **Các lý do planner bỏ qua index (mục 5):**
  1. Điều kiện khớp phần lớn bảng (selectivity thấp).
  2. Bọc cột trong hàm hoặc phép tính: `LOWER(email) = ?`, `DATE(created_at) = ?`, `price * 1.1 > ?`. Sửa: expression index, hoặc viết lại thành khoảng `created_at >= '2026-10-30' AND created_at < '2026-10-31'`.
  3. Ép kiểu ngầm, kiểu dữ liệu so sánh không khớp với kiểu của cột (ví dụ `WHERE id::text = '123'`).
  4. `LIKE '%abc'` (wildcard ở đầu). `LIKE 'abc%'` dùng được B-Tree nhưng ở Postgres cần collation `C` hoặc operator class `text_pattern_ops` (T3).
  5. Không có cột đầu tiên của composite index (vi phạm leftmost prefix).
  6. Thống kê cũ, chưa `ANALYZE` sau khi nạp nhiều dữ liệu.
  7. Bảng quá nhỏ: đọc cả bảng (vài page) rẻ hơn đi qua index.
  8. `OR` giữa các cột khác nhau mà không phải cột nào cũng có index (nếu cả hai đều có, planner có thể dùng `BitmapOr`).
- **Vì sao `LOWER(email)` không dùng được index thường (mục 7):** index lưu giá trị `email` gốc đã sort. `LOWER(email)` là giá trị khác, không có thứ tự trong index đó, nên planner không thể seek. Expression index lưu sẵn kết quả `LOWER(email)` đã sort.
- **Partial index có điều kiện (mục 6):** planner phải **chứng minh** được điều kiện của query suy ra điều kiện của index. Query viết `status = 'pending'` thì khớp. Query truyền tham số `status = $1` qua prepared statement thì có thể không khớp khi dùng generic plan (T3, chỉ cần biết có hiện tượng này).
- **Partial unique index (mục 8):** `CREATE UNIQUE INDEX ON addresses (user_id) WHERE is_default` → DB đảm bảo mỗi user tối đa một địa chỉ mặc định, kể cả khi có request đồng thời.

**🟡 Bảng so sánh T2: Partial index vs Index đầy đủ**

Nhóm: *chiến lược index*. Trục chính của cuộc so sánh: **kích thước và chi phí ghi** vs **số lượng query phục vụ được**.

| Tiêu chí | Partial index | Index đầy đủ |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Kích thước và chi phí ghi | | |
| Ext: Điều kiện để planner chọn (query phải viết thế nào) | | |
| Ext: Dùng để ép ràng buộc duy nhất có điều kiện được không? | | |

**🔴 Thẻ Anki (T1)**

1. Cardinality khác selectivity thế nào?
2. Vì sao query trả về 70% bảng thì Seq Scan nhanh hơn Index Scan?
3. Index trên cột `status` (5 giá trị) khi nào có ích, khi nào vô dụng?
4. `WHERE DATE(created_at) = '2026-10-30'` vì sao không dùng index? Viết lại thế nào?
5. Kể 6 lý do planner bỏ qua index.
6. Partial index là gì? Cho một ví dụ dùng partial unique index.

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Indexes* → *Partial Indexes*, *Indexes on Expressions*, *Operator Classes and Operator Families*; chương *Performance Tips* → *Statistics Used by the Planner*.

**Tài liệu:**
- use-the-index-luke.com, chương 2 *The Where Clause*: các phần *Functions*, *Indexing LIKE Filters*, *Partial Indexes*, *Obfuscated Conditions*
- use-the-index-luke.com, chương 3 *Performance and Scalability* (đọc lướt)

**❓ Câu hỏi cuối bài**

1. Index trên cột `status` chỉ có 3 giá trị có hữu ích không? Partial index giúp gì ở đây?
2. `WHERE LOWER(email) = ?` vì sao không dùng được index? Sửa thế nào?
3. Kể 4 lý do khiến planner bỏ qua index.

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Tối qua team import 2 triệu đơn mới. Sáng nay một query trước đây chạy Index Scan 5 ms giờ chạy Seq Scan 3 giây, dù không ai đổi code hay index. Bạn nghi ngờ gì đầu tiên, kiểm tra bằng gì, sửa thế nào?
5. Yêu cầu: mỗi user có tối đa **một** địa chỉ mặc định, kể cả khi hai request "đặt làm mặc định" đến cùng lúc. Vì sao kiểm tra ở tầng app không đủ? Làm ở DB bằng cách nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Cardinality thấp nhưng dữ liệu **lệch**: vô dụng với giá trị phổ biến (khớp phần lớn bảng → Seq Scan rẻ hơn), rất có ích với giá trị hiếm.
- Tính theo **selectivity** của giá trị cụ thể, không theo số giá trị khác nhau.
- Partial index `ON orders (created_at) WHERE status = 'pending'`: chỉ chứa dòng hiếm, nhỏ, rẻ khi ghi; query phải có điều kiện khớp.

**Câu 2.**
- Index lưu giá trị `email` gốc đã sort; `LOWER(email)` là giá trị khác, không có thứ tự trong index đó → không seek được.
- Sửa: expression index `ON users (LOWER(email))` và query dùng **đúng** biểu thức đó (hoặc kiểu `citext`, T3).
- Nên chuẩn hoá email về chữ thường khi ghi.

**Câu 3.**
- Selectivity thấp (khớp phần lớn bảng); bảng quá nhỏ.
- Bọc cột trong hàm/phép tính, ép kiểu không khớp; `LIKE '%abc'`.
- Thiếu cột đầu của composite index; thống kê cũ; `OR` giữa các cột không cùng có index.

**Câu 4.**
- **Thống kê cũ**: planner vẫn ước lượng theo số liệu trước khi import → chọn plan sai.
- Kiểm tra: `EXPLAIN ANALYZE` so `rows` ước tính với `actual rows`; xem thời điểm analyze cuối (`pg_stat_user_tables.last_autoanalyze`).
- Sửa: chạy `ANALYZE orders`; sau các đợt nạp dữ liệu lớn luôn chạy `ANALYZE`.

**Câu 5.**
- Hai request cùng đọc "chưa có mặc định" rồi cùng ghi → race condition.
- Partial unique index: `CREATE UNIQUE INDEX ON addresses (user_id) WHERE is_default` → DB từ chối dòng thứ hai.
- Đổi mặc định: trong một transaction, bỏ cờ của địa chỉ cũ rồi mới đặt cờ cho địa chỉ mới.

</details>

---

## D34 (T7, 31/10): Lab

**⏱ Ước tính:** DSA 40' · Lab bắt buộc 2h35' · Ôn ⚠️ 30' · **Tổng 3h45'**

### 🧩 DSA: [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

- **Pattern (🔴 T1):** *BFS theo tầng*. Dùng queue; ở đầu mỗi vòng, lưu `size = queue.length`, rồi lấy ra đúng `size` node. Đó chính là một tầng.
- **Độ phức tạp:** O(n) thời gian, O(w) bộ nhớ (w là độ rộng lớn nhất, có thể tới n/2).
- **Khung này dùng lại cho:** 199 Right Side View (Tuần 6), 994 Rotting Oranges (Tuần 7), mọi bài "khoảng cách ngắn nhất trên đồ thị không trọng số".
- Sau đó làm lại 1 bài sai trong tuần (nếu có).

### 🛠 Lab (bắt buộc 2h35' + mở rộng 15'): Đo tác dụng của index trên vài triệu dòng

> **Chia phần để không vượt 4h:** **bắt buộc** là Bước 1–6 (~2h35' khi đã gộp thời gian chờ sinh dữ liệu vào việc đọc trước Bước 3). **Mở rộng (làm nếu còn giờ, nếu không thì làm ở D35):** Bước 7 đo chi phí ghi (15') và làm lại bài DSA sai trong tuần. Bước 8 (ôn ⚠️, 30') là bắt buộc.

Dùng Postgres chạy bằng Docker từ dự án *Mini Order Service* (Tuần 4). Nếu schema của bạn khác, đổi tên cột cho khớp. Nên dùng một database riêng, ví dụ `order_lab`, để không làm bẩn dữ liệu dev.

**Bước 1: Chuẩn bị (20')**

```bash
docker exec -it <tên-container-postgres> psql -U postgres
```

```sql
CREATE DATABASE order_lab;
\c order_lab
\timing on
SELECT version();   -- ghi lại phiên bản vào notes, vì Postgres 18 có skip scan có thể làm kết quả Bước 4 khác đi
```

**Bước 2: Sinh dữ liệu (30')**

```sql
CREATE TABLE users (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL,
  created_at timestamptz NOT NULL
);

CREATE TABLE orders (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      bigint NOT NULL REFERENCES users(id),
  status       text   NOT NULL,
  total_amount bigint NOT NULL,
  created_at   timestamptz NOT NULL
);

-- 200.000 user, email có cả chữ hoa để thử LOWER()
INSERT INTO users (email, created_at)
SELECT 'User' || g || '@Example.com', now() - random() * interval '730 days'
FROM generate_series(1, 200000) AS g;

-- 3.000.000 đơn, status bị lệch có chủ đích: pending ~1%, paid ~3%, shipped ~8%, delivered ~75%, cancelled ~13%
INSERT INTO orders (user_id, status, total_amount, created_at)
SELECT
  (random() * 199999)::bigint + 1,
  CASE
    WHEN r < 0.01 THEN 'pending'
    WHEN r < 0.04 THEN 'paid'
    WHEN r < 0.12 THEN 'shipped'
    WHEN r < 0.87 THEN 'delivered'
    ELSE 'cancelled'
  END,
  (random() * 5000000)::bigint,
  now() - random() * interval '365 days'
FROM (SELECT random() AS r FROM generate_series(1, 3000000)) AS s;

ANALYZE;   -- cập nhật thống kê sau khi nạp dữ liệu
SELECT pg_size_pretty(pg_total_relation_size('orders'));
```

**Bước 3: Đo baseline khi chưa có index (30')**

Chạy mỗi query 3–5 lần, lấy giá trị ở giữa (lần đầu thường chậm hơn vì cache còn lạnh). Dùng `EXPLAIN (ANALYZE, BUFFERS)` để xem plan và thời gian thực (Tuần 6 sẽ học đọc kỹ; hôm nay chỉ cần ghi lại **loại scan** và **Execution Time**).

```sql
-- Q1: 20 đơn mới nhất của một user
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, created_at, total_amount FROM orders
WHERE user_id = 12345 ORDER BY created_at DESC LIMIT 20;

-- Q2: đơn pending trong 7 ngày gần đây
EXPLAIN (ANALYZE, BUFFERS)
SELECT id FROM orders
WHERE status = 'pending' AND created_at >= now() - interval '7 days';

-- Q3: tìm user theo email, không phân biệt hoa thường
EXPLAIN (ANALYZE, BUFFERS)
SELECT id FROM users WHERE LOWER(email) = 'user777@example.com';

-- Q4: đơn delivered (khớp ~75% bảng)
EXPLAIN (ANALYZE, BUFFERS)
SELECT count(*) FROM orders WHERE status = 'delivered';
```

**Bước 4: Composite index đúng thứ tự vs sai thứ tự (45')**

```sql
-- Sai thứ tự cho Q1
CREATE INDEX idx_orders_created_user ON orders (created_at, user_id);
ANALYZE orders;
-- chạy lại Q1, ghi kết quả
DROP INDEX idx_orders_created_user;

-- Đúng thứ tự cho Q1
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);
ANALYZE orders;
-- chạy lại Q1, ghi kết quả. Thử thêm: bỏ "WHERE user_id" chỉ để "WHERE created_at > ..." → index còn dùng được không?
```

**Bước 5: Partial index, expression index, index vô dụng (30')**

```sql
-- Q2: so sánh index đầy đủ và partial index
CREATE INDEX idx_orders_status_created ON orders (status, created_at);
-- chạy Q2, ghi kết quả và kích thước index
CREATE INDEX idx_orders_pending_created ON orders (created_at) WHERE status = 'pending';
-- chạy Q2 lại (planner sẽ chọn index nào?)

SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes WHERE relname = 'orders';

-- Q3: expression index
CREATE INDEX idx_users_lower_email ON users (LOWER(email));
-- chạy Q3 lại

-- Q4: có index trên status vẫn Seq Scan? Ghi lại plan và giải thích bằng selectivity
```

> **Lưu ý khi đọc Q4:** vì `count(*)` không cần cột nào ngoài `status`, planner **có thể** chọn `Index Only Scan` trên `idx_orders_status_created` (nếu visibility map đã *all-visible*, ví dụ autovacuum vừa chạy) hoặc `Parallel Seq Scan`. Cả hai đều hợp lý. Điều cần giải thích: **không** có plan nào dùng index để *seek rồi đọc heap* (Index Scan thường) cho 75% bảng, vì đọc ngẫu nhiên 2,25 triệu dòng đắt hơn đọc tuần tự.

**Bước 6: Covering index và Index Only Scan (20')**

```sql
DROP INDEX idx_orders_user_created;
CREATE INDEX idx_orders_user_created_cov ON orders (user_id, created_at DESC) INCLUDE (total_amount);
-- chạy Q1: plan có "Index Only Scan" không? Ghi "Heap Fetches"
VACUUM orders;
-- chạy Q1 lại: Heap Fetches thay đổi thế nào? Vì sao? (visibility map)
```

**Bước 7: Đo chi phí ghi (15') – mở rộng, làm ở D35 nếu hết giờ**

```sql
-- Bảng orders lúc này có nhiều index. Đo thời gian chèn 100.000 dòng:
INSERT INTO orders (user_id, status, total_amount, created_at)
SELECT (random() * 199999)::bigint + 1, 'pending', 1000, now()
FROM generate_series(1, 100000);
-- So sánh với bảng không có index nào (LIKE không copy index và khoá ngoại; INCLUDING IDENTITY để cột id vẫn tự sinh):
CREATE TABLE orders_noidx (LIKE orders INCLUDING IDENTITY);
-- chèn cùng 100.000 dòng vào orders_noidx, so sánh thời gian
```

**Sản phẩm: `notes/index-lab.md`**, gồm:

| Query | Index | Loại scan | Execution Time | Ghi chú |
|---|---|---|---|---|
| Q1 | không có | | | |
| Q1 | `(created_at, user_id)` | | | |
| Q1 | `(user_id, created_at)` | | | |
| Q1 | covering, trước/sau VACUUM | | | Heap Fetches: … |
| Q2 | `(status, created_at)` vs partial | | | Kích thước 2 index: … |
| Q3 | không có vs expression index | | | |
| Q4 | có index trên `status` | | | Vì sao vẫn Seq Scan? |
| INSERT 100k | nhiều index vs không index | — | | |

**Tiêu chí đạt:**
- [ ] Có ≥ 2 triệu dòng trong `orders`, đã chạy `ANALYZE`.
- [ ] Q1 nhanh hơn ít nhất 10 lần khi có index đúng thứ tự so với không có index.
- [ ] Giải thích được bằng lời vì sao `(created_at, user_id)` kém hơn `(user_id, created_at)` cho Q1.
- [ ] Có số liệu kích thước của partial index so với index đầy đủ.
- [ ] Có một câu kết luận về chi phí ghi của index.

**Bước 8 (30'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D35 (CN, 01/11): Chốt tuần 5

**⏱ Ước tính:** DSA 45' · Chốt tuần 60' · Bảng T2 dời từ D30 15' · Anki/cheat sheet 30' · **Tổng 2h30'**

> **Việc dời sang hôm nay:** bảng *Chuẩn hoá vs Phi chuẩn hoá* (D30). Nếu D34 chưa làm Bước 7 (đo chi phí ghi, 15') thì làm hôm nay → tổng 2h45'.

### 🧩 DSA: [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

- **Pattern (🔴 T1):** *DFS truyền cận (low, high) xuống*. Mỗi node phải nằm trong khoảng `(low, high)` do các tổ tiên quy định, không chỉ so với con trực tiếp.
- **Các cách:**
  1. DFS với cận: đi sang trái thì `high = node.val`, đi sang phải thì `low = node.val` → O(n), O(h).
  2. Duyệt inorder: dãy thu được phải **tăng nghiêm ngặt**; chỉ cần nhớ giá trị trước đó → O(n), O(h).
- **Bẫy kinh điển:** chỉ kiểm tra `left.val < node.val < right.val` là **sai**. Ví dụ: gốc 5, con phải 6, con trái của 6 là 3 → mỗi cặp cha–con đều đúng nhưng 3 < 5 nằm ở cây con phải.
- **Lưu ý:** giá trị node có thể bằng giới hạn của kiểu int; dùng `null` hoặc kiểu số lớn hơn làm cận ban đầu.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. DFS và BFS trên cây: khi nào dùng cái nào? Viết bằng đệ quy và bằng vòng lặp khác nhau ra sao?
2. Giải thích B-Tree index cho một người mới trong 2 phút.
3. Cho 3 query (tự đặt), thiết kế **số index ít nhất** phục vụ được cả 3.
   - *Gợi ý tự đặt đề: các query có chung tiền tố `user_id`, một query có ORDER BY, một query có điều kiện khoảng.*
4. Vì sao không đánh index cho mọi cột?
5. Trình bày số liệu lab: thời gian query trước/sau khi có index.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- DFS (đệ quy/stack): bài cần thông tin từ cây con (chiều cao, so sánh cây, validate BST), bộ nhớ O(h). BFS (queue): bài theo **tầng** hoặc khoảng cách ngắn nhất, bộ nhớ O(w).
- Đệ quy gọn nhưng có thể tràn stack với cây lệch sâu; vòng lặp tự quản lý stack/queue, an toàn hơn.
- Phân biệt bottom-up (trả kết quả lên) và top-down (truyền trạng thái/cận xuống).

**Câu 2.**
- Không index → đọc cả bảng. Index là cấu trúc **riêng, đã sort**, entry = (khoá, con trỏ tới dòng).
- B-Tree cân bằng, mỗi node là một page chứa hàng trăm khoá → 3–4 tầng cho hàng chục triệu dòng.
- Tra cứu: gốc → lá (O(log n)) → đi dọc lá (range) → đọc bảng (bước tốn nhất). Cái giá: ghi chậm hơn.

**Câu 3.**
- Ví dụ: Q-a `WHERE user_id = ?`, Q-b `WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`, Q-c `WHERE user_id = ? AND created_at > ?` → **một** index `(user_id, created_at)` phục vụ cả ba.
- Lý do: tiền tố chung `user_id` (leftmost prefix), `=` trước khoảng, index đã có thứ tự cho ORDER BY.
- Nếu thêm query không có `user_id` thì mới cần index thứ hai.

**Câu 4.**
- Mỗi index làm chậm INSERT/UPDATE/DELETE, tốn đĩa + RAM cache, sinh thêm WAL, thêm việc cho VACUUM.
- Index trên cột selectivity thấp hoặc không có query nào dùng thì planner bỏ qua → chỉ tốn chi phí.
- Thiết kế index **theo query**, không theo cột.

**Câu 5.**
- Nêu kích thước dữ liệu (số dòng), query, loại scan và Execution Time trước/sau.
- Có ít nhất: Q1 đúng thứ tự vs sai thứ tự, partial vs index đầy đủ (kích thước), Q4 vẫn không dùng Index Scan và vì sao.
- Một câu kết luận về chi phí ghi.

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] File `notes/index-lab.md` có đủ số liệu đo (kể cả Bước 7 chi phí ghi)
- [ ] Tự giải lại 226, 104, 572, 235, 102, 98 không xem lời giải (bài Easy ≤ 20')
- [ ] Anki: đã nhập đủ thẻ T1 của D29–D33 + thẻ pattern DFS bottom-up / top-down, BFS theo tầng, BST (đi một nhánh, truyền cận)
- [ ] Cheat sheet: đã điền 6 bảng T2 (EXISTS/IN vs JOIN, Chuẩn hoá vs Phi chuẩn hoá, UUID vs auto-increment, B-Tree vs Hash, Composite vs nhiều index đơn, Partial vs đầy đủ)

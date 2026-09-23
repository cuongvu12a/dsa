# Tuần 7 (09/11 – 15/11): Graph, Transaction, Isolation, Locking

← [Tuần 6](tuan-06.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 8 →](tuan-08.md)

**Mục tiêu tuần:** Hiểu ACID, isolation level, MVCC. Giải được bài toán **bán quá tồn kho** (overselling), một câu hỏi rất hay gặp khi phỏng vấn. Về DSA: DFS/BFS trên lưới và đồ thị, BFS nhiều nguồn, topological sort.

> **Cách học theo Tier:** 🔴 T1 → hiểu tại sao + thẻ Anki, 🟡 T2 → điền bảng so sánh vào `notes/tradeoff-cheatsheet.md`, 🟢 T3 → chỉ lưu link/snippet vào `notes/snippets.md`. Xem lại bảng đầy đủ ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Research theo cột *Từ khoá research*, học tới mức ghi ở cột *Cần nắm tới mức nào* thì dừng.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| DFS/BFS flood fill trên lưới, clone đồ thị bằng HashMap (map kiêm luôn visited), BFS nhiều nguồn, tìm ngược từ biên, topological sort + phát hiện chu trình, 4 tính chất ACID, "C" trong ACID khác "C" trong CAP, phạm vi transaction và tác dụng phụ ngoài DB không được rollback, 6 lỗi đọc/ghi (dirty read/write, non-repeatable read, phantom, lost update, write skew), mỗi isolation level chặn lỗi nào, mức mặc định của Postgres (Read Committed) và MySQL InnoDB (Repeatable Read), cùng tên Repeatable Read nhưng Postgres báo lỗi lost update còn InnoDB thì không (InnoDB chặn phantom của locking read bằng next-key/gap lock), lỗi serialization failure → app phải retry, nguyên lý **MVCC** và **WAL**, pessimistic vs optimistic ở mức nguyên lý, `FOR UPDATE` chỉ có tác dụng bên trong transaction, UPDATE có điều kiện nguyên tử, deadlock: nguyên nhân, phát hiện, khoá theo thứ tự cố định | Chọn isolation level (Read Committed vs Repeatable Read vs Serializable), Optimistic vs Pessimistic lock, 3 cách chống overselling, DFS vs BFS trên lưới, Kahn vs DFS cho topological sort | VACUUM / autovacuum / bloat, transaction ID wraparound, cú pháp `SET TRANSACTION ISOLATION LEVEL`, 4 chế độ khoá dòng (`FOR UPDATE`, `FOR NO KEY UPDATE`, `FOR SHARE`, `FOR KEY SHARE`), các mức khoá bảng, cú pháp `NOWAIT` / `SKIP LOCKED`, `deadlock_timeout` / `lock_timeout`, truy vấn `pg_locks`, `synchronous_commit` / `fsync` / `full_page_writes`, cấu hình checkpoint, undo log và chi tiết các loại khoá của InnoDB (record / gap / next-key / insert intention), chi tiết cài đặt SSI, advisory lock, savepoint, code chi tiết từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D43 (T2) | 70' | 80' | 2h30' |
| D44 (T3) | 60' | 80' | 2h20' |
| D45 (T4) | 45' | 85' | 2h10' |
| D46 (T5) | 60' | 85' | 2h25' |
| D47 (T6) | 65' | 80' | 2h25' |
| D48 (T7) | — | 3h55' | 3h55' |
| D49 (CN) | — | 2h35' | 2h35' |

**Tổng tuần: 18h20'** (chưa tính 1h tiếng Anh mỗi ngày)

Ngày nặng nhất là **D48 (Lab overselling)**: phần Lab đã được chia *bắt buộc* / *mở rộng* để giữ ≤ 4h; các bảng T2 của D45, D47, D48 được dời sang D49 để buổi tối trong tuần không vượt 90'.

---

## D43 (T2, 09/11): ACID qua ví dụ chuyển tiền

**⏱ Ước tính:** Giờ làm 70' (DSA 45' + Bảng T2 DFS/BFS 10' + Anki 15') · Tối 80' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h30'**

### 🧩 DSA: [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)

- **Pattern (🔴 T1):** *Flood fill trên lưới*. Duyệt từng ô; gặp ô `'1'` chưa thăm thì tăng bộ đếm, rồi DFS/BFS "loang" đánh dấu cả hòn đảo là đã thăm.
- **Các cách:**
  1. DFS đệ quy, đánh dấu bằng cách ghi đè ô thành `'0'` → O(m·n) thời gian, O(m·n) bộ nhớ stack trong trường hợp xấu nhất.
  2. BFS bằng queue → O(m·n) thời gian, O(min(m, n)) bộ nhớ cho queue (xấp xỉ).
  3. Union-Find → O(m·n · α) (chỉ cần biết ý tưởng).
- **Lưu ý:** đánh dấu đã thăm **ngay khi đưa vào queue**, không phải khi lấy ra, nếu không một ô bị đưa vào nhiều lần. Hỏi người phỏng vấn có được sửa input không; nếu không thì dùng mảng `visited`.
- **🟡 Bảng so sánh T2: DFS vs BFS trên lưới.** Nhóm: *thuật toán duyệt đồ thị*. Trục chính: **đơn giản khi code** vs **bộ nhớ và khả năng tìm đường ngắn nhất**.

  | Tiêu chí | DFS (đệ quy) | BFS (queue) |
  |---|---|---|
  | Core: Use-case lý tưởng | | |
  | Core: Trade-off chính | | |
  | Core: Khi nào KHÔNG dùng | | |
  | Ext: Rủi ro tràn stack với lưới 1000×1000 | | |
  | Ext: Cho ra khoảng cách ngắn nhất (đồ thị không trọng số) không? | | |

### 📘 Bài học buổi tối: ACID

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Transaction là gì: một nhóm thao tác được đối xử như **một đơn vị** (`BEGIN … COMMIT / ROLLBACK`) | 🔴 T1 | Nói được bằng một câu, và biết ORM của bạn mở/đóng transaction ở đâu | `database transaction explained` |
| 2 | **Atomicity**: tất cả hoặc không gì cả; lỗi giữa chừng thì rollback toàn bộ | 🔴 T1 | Giải thích bằng ví dụ chuyển tiền; biết Atomicity **không** nói về đồng thời | `atomicity database example` |
| 3 | **Consistency**: transaction đưa DB từ trạng thái hợp lệ sang trạng thái hợp lệ (invariant: tổng tiền không đổi, số dư ≥ 0) | 🔴 T1 | Biết phần lớn là trách nhiệm của app, DB hỗ trợ qua constraint | `consistency in acid vs cap` |
| 4 | **Isolation**: các transaction chạy đồng thời không "giẫm chân" nhau, ở mức do isolation level quy định | 🔴 T1 | Nói được một câu; chi tiết học ở D44–D45 | `isolation acid` |
| 5 | **Durability**: đã COMMIT thì không mất dù server sập, nhờ WAL được ghi xuống đĩa trước khi báo thành công | 🔴 T1 | Nói được cơ chế ở mức một câu; chi tiết học ở D46 | `durability write ahead log` |
| 6 | "C" trong ACID khác "C" trong CAP (Tuần 11) | 🔴 T1 | ACID-C: dữ liệu thoả invariant. CAP-C: mọi node thấy cùng dữ liệu mới nhất | `acid consistency vs cap consistency` |
| 7 | Tác dụng phụ ngoài DB (gửi email, gọi API thanh toán, đẩy message) **không** được rollback theo transaction | 🔴 T1 | Giải thích được vì sao không gọi HTTP bên ngoài bên trong transaction (sẽ nối tiếp ở Outbox pattern, Tuần 12) | `side effects inside database transaction` |
| 8 | Giữ transaction ngắn: transaction dài giữ lock lâu hơn và cản dọn dẹp phiên bản cũ (D46) | 🔴 T1 | Nói được 3 tác hại: giữ lock làm request khác chờ, cản VACUUM (bảng phình to), chiếm một connection của pool suốt thời gian đó. Nhận ra trạng thái `idle in transaction` (mở transaction rồi quên COMMIT) | `long running transaction problems postgres`, `idle in transaction` |
| 9 | Autocommit: mỗi câu lệnh đơn lẻ là một transaction nếu không mở `BEGIN` | 🔴 T1 | Biết hai câu UPDATE rời nhau **không** nguyên tử với nhau | `autocommit mode` |
| 10 | Savepoint, `ROLLBACK TO SAVEPOINT` | 🟢 T3 | Biết tồn tại: rollback **một phần** transaction; "nested transaction" của nhiều ORM thực chất được cài bằng savepoint | PostgreSQL docs – *SAVEPOINT* |

**Chi tiết cần hiểu**

- **Ví dụ chuyển tiền:**

  ```sql
  BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
  UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
  COMMIT;
  ```

  | Tính chất | Câu hỏi nó trả lời | Trong ví dụ |
  |---|---|---|
  | Atomicity | Lỗi giữa chừng thì sao? | Server sập sau câu UPDATE đầu → A không bị trừ tiền "oan" |
  | Consistency | Dữ liệu có còn hợp lệ không? | Tổng A + B không đổi; `CHECK (balance >= 0)` chặn số dư âm |
  | Isolation | Hai giao dịch cùng lúc có "giẫm chân" nhau không? | Hai lần chuyển tiền đồng thời từ A không cùng đọc số dư cũ rồi trừ |
  | Durability | Đã báo thành công rồi mất điện thì sao? | COMMIT xong thì khởi động lại vẫn còn |

- **Server sập giữa chừng (câu hỏi 3):** transaction chưa COMMIT coi như chưa từng xảy ra, phần thay đổi dở dang không bao giờ được nhìn thấy. Transaction đã COMMIT được khôi phục lại từ WAL khi khởi động. Ở Postgres, nhờ MVCC, phiên bản dòng do transaction bị huỷ tạo ra đơn giản là "không nhìn thấy" và sau này được VACUUM dọn đi.
- **Bẫy tác dụng phụ (mục 7):**

  ```
  BEGIN
    INSERT order
    paymentGateway.charge(card)      // gọi HTTP bên ngoài, mất 2 giây, giữ transaction + lock suốt thời gian đó
    UPDATE stock ...                 // lỗi ở đây → ROLLBACK, nhưng tiền ĐÃ bị trừ
  COMMIT
  ```

  DB rollback được `INSERT order` nhưng không rollback được việc đã trừ tiền. Cần thiết kế riêng: idempotency key (Tuần 4), trạng thái trung gian, Saga / Outbox (Tuần 12).

**🔴 Thẻ Anki (T1)**

1. Nêu 4 tính chất ACID, mỗi cái bằng một câu và một ví dụ chuyển tiền.
2. Atomicity khác Consistency thế nào?
3. "C" trong ACID khác "C" trong CAP thế nào?
4. Vì sao không nên gọi API thanh toán bên trong một DB transaction?
5. Hai câu UPDATE chạy ở chế độ autocommit có nguyên tử với nhau không?
6. Server sập giữa một transaction chưa COMMIT thì dữ liệu ra sao?

**Tài liệu:**
- DDIA chương 7 *Transactions*, phần đầu *The Slippery Concept of a Transaction* (mục *The Meaning of ACID*)
- Hussein Nasser: tìm video về ACID trên kênh YouTube (từ khoá `Hussein Nasser ACID`)

**❓ Câu hỏi cuối bài**

1. Atomicity khác Consistency thế nào?
2. Durability đạt được nhờ cơ chế gì?
3. Server sập giữa chừng một transaction thì dữ liệu ra sao?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Trong một transaction bạn `INSERT order` → gọi API thanh toán (mất 2 giây) → `UPDATE stock` thì lỗi và ROLLBACK. Sau đó DB và thẻ của khách ở trạng thái nào? Bạn sắp xếp lại luồng này thế nào?
5. Một job mở transaction rồi xử lý 10.000 bản ghi trong 20 phút mới COMMIT. Nêu 3 tác hại. Nếu thay bằng autocommit từng câu thì mất đi đảm bảo gì?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Atomicity: lỗi giữa chừng → rollback toàn bộ, không có trạng thái "làm dở".
- Consistency: sau transaction dữ liệu vẫn thoả invariant (tổng tiền không đổi, số dư ≥ 0); chủ yếu do app đảm bảo, DB hỗ trợ bằng constraint.
- Atomic nhưng code sai (chỉ trừ A, quên cộng B) vẫn phá Consistency → hai khái niệm độc lập.

**2.**
- WAL: bản ghi thay đổi được flush (fsync) xuống đĩa **trước** khi báo COMMIT thành công.
- Trang dữ liệu ghi sau; sập thì redo từ WAL.

**3.**
- Chưa COMMIT → coi như chưa từng xảy ra, không ai nhìn thấy phần dở dang.
- Đã COMMIT → khôi phục lại từ WAL khi khởi động.
- Postgres: phiên bản dòng của transaction bị huỷ chỉ là "không nhìn thấy", VACUUM dọn sau.

**4.**
- DB rollback `INSERT order`, nhưng tiền **đã bị trừ**: tác dụng phụ ngoài DB không rollback được.
- Suốt 2 giây gọi API, transaction giữ lock và chiếm connection.
- Sửa: tách khỏi transaction (tạo đơn trạng thái `PENDING` → gọi thanh toán kèm idempotency key → cập nhật trạng thái), hoặc Outbox/Saga (Tuần 12).

**5.**
- Giữ lock lâu → request khác chờ / timeout.
- Cản VACUUM → dead tuple tích tụ, bảng phình to; chiếm một connection của pool.
- Autocommit từng câu: mất tính nguyên tử, job chết giữa chừng để lại dữ liệu làm dở. Cách hợp lý: chia batch (ví dụ 500 dòng/transaction) + đánh dấu tiến độ để chạy lại được.

</details>

---

## D44 (T3, 10/11): Các lỗi đọc/ghi khi chạy đồng thời

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 80' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h20'**

### 🧩 DSA: [133. Clone Graph](https://leetcode.com/problems/clone-graph/)

- **Pattern (🔴 T1):** *Duyệt đồ thị + HashMap `node cũ → node mới`*. Map vừa để tìm bản sao, vừa đóng vai trò tập `visited` để không lặp vô hạn khi đồ thị có chu trình.
- **Các cách:** DFS đệ quy hoặc BFS → O(V + E) thời gian, O(V) bộ nhớ.
- **Bẫy:** phải **tạo bản sao và đưa vào map trước**, rồi mới đệ quy sang hàng xóm. Làm ngược lại thì chu trình `1 ↔ 2` sẽ đệ quy mãi.
- **Câu hỏi mở rộng:** cùng kỹ thuật dùng cho *Copy List with Random Pointer* (bài 138).

### 📘 Bài học buổi tối: Dirty read, non-repeatable read, phantom, lost update, write skew

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Dirty read**: đọc dữ liệu transaction khác chưa COMMIT | 🔴 T1 | Cho ví dụ với bảng tồn kho | `dirty read example` |
| 2 | **Dirty write**: ghi đè dữ liệu transaction khác chưa COMMIT | 🔴 T1 | Biết mọi isolation level trong thực tế đều chặn lỗi này | `dirty write` |
| 3 | **Non-repeatable read** (read skew): cùng một dòng, đọc hai lần trong một transaction ra hai giá trị | 🔴 T1 | Cho ví dụ | `non-repeatable read example` |
| 4 | **Phantom read**: cùng một điều kiện WHERE, chạy hai lần ra **tập dòng** khác nhau do có dòng mới được thêm/xoá | 🔴 T1 | Phân biệt với non-repeatable read: phantom liên quan tới dòng **mới xuất hiện**, không phải dòng cũ bị sửa | `phantom read vs non-repeatable read` |
| 5 | **Lost update**: hai transaction cùng đọc → sửa → ghi (read-modify-write), cái ghi sau đè mất cái ghi trước | 🔴 T1 | Vẽ được timeline hai người mua sản phẩm cuối cùng | `lost update problem database` |
| 6 | **Write skew**: hai transaction đọc cùng một điều kiện, mỗi bên ghi vào **dòng khác nhau**, cả hai đều hợp lệ riêng lẻ nhưng cộng lại phá vỡ invariant | 🔴 T1 | Giải thích được ví dụ hai bác sĩ và vì sao `FOR UPDATE` trên các dòng đã có không phải lúc nào cũng đủ | `write skew doctors on call example` |
| 7 | Chuẩn SQL định nghĩa isolation level chỉ qua 3 lỗi (dirty, non-repeatable, phantom); lost update và write skew được DDIA và các bài báo sau này bổ sung | 🟢 T3 | Biết để không bối rối khi tài liệu dùng từ khác nhau | `a critique of ansi sql isolation levels` |

**Chi tiết cần hiểu**

- **Ví dụ với bảng `products(id, stock)`, sản phẩm id = 1:**

  | Lỗi | Timeline |
  |---|---|
  | Dirty read | T1: `UPDATE stock = 0` (chưa COMMIT) → T2 đọc `stock = 0`, báo "hết hàng" → T1 ROLLBACK. T2 đã dựa vào dữ liệu không bao giờ tồn tại |
  | Non-repeatable read | T1 đọc `stock = 5` → T2 `UPDATE stock = 3`, COMMIT → T1 đọc lại được `3` trong cùng transaction |
  | Phantom | T1: `SELECT count(*) FROM products WHERE stock < 5` → 2 → T2 INSERT sản phẩm mới có `stock = 1`, COMMIT → T1 chạy lại → 3 |
  | Lost update | T1 đọc `stock = 1` → T2 đọc `stock = 1` → T1 ghi `stock = 0`, tạo đơn → T2 ghi `stock = 0`, tạo đơn. Kết quả: **2 đơn** cho **1** sản phẩm, và DB không báo lỗi gì |
  | Write skew | Quy định: "đợt đặt trước chỉ nhận tối đa 10 đơn". T1 đếm được 9 → T2 đếm được 9 → T1 INSERT đơn → T2 INSERT đơn. Kết quả: 11 đơn. Hai transaction ghi vào **hai dòng mới khác nhau**, không đụng nhau |

- **Hai bác sĩ trực (câu hỏi 3):** quy định "ca trực phải có ít nhất 1 bác sĩ". Alice và Bob cùng đang trực. Cả hai cùng bấm xin nghỉ: mỗi transaction đếm thấy "còn 2 người" → mỗi bên cập nhật **dòng của chính mình** thành "nghỉ". Không ai ghi đè ai, nhưng ca trực còn 0 người.
- **Vì sao write skew khó (mục 6):** lost update có thể chặn bằng cách khoá **đúng dòng** bị ghi. Write skew thì các transaction ghi vào dòng khác nhau, và ở dạng "đếm rồi INSERT" thì dòng cần khoá **chưa tồn tại** (phantom), nên `SELECT … FOR UPDATE` không khoá được gì. Cách xử lý: Serializable, hoặc "vật chất hoá xung đột" (khoá một dòng đại diện, ví dụ dòng `campaigns` chứa bộ đếm), hoặc dùng constraint của DB.

**🔴 Thẻ Anki (T1)**

1. Phân biệt non-repeatable read và phantom read.
2. Vẽ timeline lost update khi hai người cùng mua sản phẩm cuối cùng.
3. Write skew khác lost update ở điểm nào?
4. Vì sao `SELECT … FOR UPDATE` không chặn được write skew dạng "đếm rồi INSERT"?
5. Kể 2 cách chặn write skew.

**Tài liệu:**
- DDIA chương 7 *Transactions*: phần *Weak Isolation Levels* (các mục *Read Committed*, *Snapshot Isolation and Repeatable Read*, *Preventing Lost Updates*, *Write Skew and Phantoms*)
- Hussein Nasser: tìm video về *read phenomena* trên kênh YouTube

**❓ Câu hỏi cuối bài**

1. Cho ví dụ từng loại lỗi với một bảng tồn kho.
2. Lost update xảy ra thế nào khi hai người cùng mua sản phẩm cuối cùng?
3. Write skew là gì? (ví dụ: hai bác sĩ cùng xin nghỉ ca trực)

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Luồng "đợt đặt trước tối đa 10 đơn" đếm số đơn rồi INSERT. Bạn đã thêm `SELECT … FOR UPDATE` vào câu đếm mà vẫn ra 11 đơn. Vì sao? Sửa bằng 2 cách.
5. Một báo cáo chạy cùng một câu SELECT hai lần trong một transaction và ra kết quả khác nhau. Làm sao biết đó là non-repeatable read hay phantom? Vì sao việc phân biệt này quan trọng?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Dirty read: đọc `stock = 0` chưa COMMIT, sau đó bị ROLLBACK.
- Non-repeatable read: đọc lại cùng dòng ra giá trị khác. Phantom: cùng WHERE ra tập dòng khác (có dòng mới được INSERT).
- Lost update: hai bên read-modify-write, bên ghi sau đè bên ghi trước. Write skew: hai bên ghi vào hai dòng khác nhau, cộng lại phá invariant.

**2.**
- T1 và T2 cùng đọc `stock = 1` → cùng ghi `stock = 0` → **2 đơn cho 1 sản phẩm**.
- DB không báo lỗi gì vì mỗi câu lệnh đều hợp lệ; lỗi nằm ở chỗ ghi đè bằng giá trị tính từ dữ liệu cũ.

**3.**
- Hai transaction đọc cùng một điều kiện, mỗi bên ghi vào **dòng của mình**, không ai đè ai.
- Riêng lẻ thì hợp lệ, cộng lại thì ca trực còn 0 bác sĩ.
- Khác lost update: không có dòng chung nào để khoá.

**4.**
- Dòng cần khoá là đơn **thứ 11, chưa tồn tại** (phantom) → `FOR UPDATE` trên các dòng đã có không chặn được INSERT mới.
- Cách 1: vật chất hoá xung đột: khoá một dòng đại diện (dòng `campaigns` chứa bộ đếm) bằng `FOR UPDATE` hoặc `UPDATE … SET count = count + 1 WHERE count < 10`.
- Cách 2: chạy ở Serializable và retry khi lỗi `40001`; hoặc dùng constraint của DB nếu biểu diễn được.

**5.**
- Cùng dòng nhưng giá trị bị sửa → non-repeatable read. Tập dòng thay đổi (dòng mới xuất hiện / biến mất) → phantom.
- Quan trọng vì isolation level cần dùng khác nhau: Repeatable Read chặn non-repeatable read; phantom thì chuẩn SQL chỉ đảm bảo chặn ở Serializable (Postgres RR cũng chặn nhờ snapshot).

</details>

---

## D45 (T4, 11/11): Isolation levels

**⏱ Ước tính:** Giờ làm 45' (DSA 25' + Anki 20') · Tối 85' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h10'**

> ⏱ Bảng T2 *Read Committed vs Repeatable Read vs Serializable* (15') dời sang **D49**; phần thực hành hai cửa sổ `psql` là *(tuỳ chọn)*, đã có ở Lab D48 Bước 4.

### 🧩 DSA: [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/)

- **Pattern (🔴 T1):** *Flood fill có trả về giá trị*. Biến thể của bài 200: hàm DFS trả về diện tích = `1 + dfs(4 hướng)`, cập nhật max ở vòng ngoài.
- **Độ phức tạp:** O(m·n) thời gian, O(m·n) bộ nhớ xấu nhất.
- **Lưu ý:** đánh dấu ô đã thăm **trước** khi gọi đệ quy sang hàng xóm, nếu không sẽ đếm một ô hai lần.
- **Mục tiêu:** ≤ 20', vì chỉ khác bài 200 ở chỗ DFS trả về số thay vì không trả gì.

### 📘 Bài học buổi tối: 4 isolation level và hành vi thực tế của Postgres / MySQL

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | 4 mức theo chuẩn SQL và lỗi mà mỗi mức chặn | 🔴 T1 | Tự vẽ lại được bảng bên dưới không nhìn tài liệu | `sql isolation levels table anomalies` |
| 2 | Mức mặc định: **Postgres = Read Committed**, **MySQL InnoDB = Repeatable Read** | 🔴 T1 | Thuộc lòng. Đây là nền để suy luận hành vi mặc định của hệ thống bạn đang chạy | `postgres default isolation level`, `innodb default isolation level` |
| 3 | Read Committed ở Postgres: **mỗi câu lệnh** thấy snapshot mới; UPDATE gặp dòng đang bị sửa thì **chờ**, rồi kiểm tra lại WHERE trên phiên bản mới | 🔴 T1 | Giải thích được vì sao `UPDATE … SET stock = stock - 1 WHERE id = ? AND stock > 0` an toàn ngay ở Read Committed | `postgres read committed update re-evaluate where` |
| 4 | Repeatable Read ở Postgres là **Snapshot Isolation**: cả transaction dùng một snapshot; không có phantom; ghi đè dòng đã bị transaction khác sửa → lỗi `could not serialize access due to concurrent update` | 🔴 T1 | Biết nó chặn lost update bằng cách **báo lỗi**, nhưng **vẫn để lọt write skew** | `postgres repeatable read snapshot isolation` |
| 5 | Serializable ở Postgres (SSI): theo dõi phụ thuộc đọc–ghi, huỷ một transaction khi phát hiện nguy cơ | 🔴 T1 phần "có thể bị huỷ, app phải retry", 🟢 T3 phần thuật toán | Biết lỗi SQLSTATE `40001` (serialization_failure) và app phải retry toàn bộ transaction | `postgres serializable snapshot isolation retry 40001` |
| 6 | Repeatable Read ở InnoDB: SELECT thường đọc snapshot, nhưng UPDATE / `SELECT … FOR UPDATE` đọc bản **mới nhất** (current read) và dùng next-key lock (khoá dòng + khoá "khe" giữa các dòng) | 🔴 T1 phần "InnoDB RR **không** tự báo lỗi lost update như Postgres" và "locking read khoá cả khe nên chặn được INSERT phantom, đổi lại dễ chặn INSERT của người khác và dễ deadlock hơn", 🟢 T3 phần chi tiết từng loại khoá | Biết cùng tên "Repeatable Read" nhưng hai DB cư xử khác nhau: Postgres dựa vào snapshot + báo lỗi, InnoDB dựa vào khoá | `innodb repeatable read lost update`, `innodb next-key lock gap lock phantom` |
| 7 | **Chọn isolation level** | 🟡 T2 | Điền bảng so sánh bên dưới (dời sang D49) | `choosing transaction isolation level` |
| 8 | Vì sao không phải lúc nào cũng dùng Serializable | 🔴 T1 | Kể được 3 lý do (xem chi tiết) | `serializable isolation performance cost` |
| 9 | Cú pháp `BEGIN ISOLATION LEVEL …`, `SET TRANSACTION`, `default_transaction_isolation`, cách đặt trong ORM | 🟢 T3 | Tra khi cần | PostgreSQL docs – *SET TRANSACTION* |

**Chi tiết cần hiểu**

- **Bảng theo chuẩn SQL (mục 1), cột cuối là Postgres:**

  | Mức | Dirty read | Non-repeatable read | Phantom | Lost update | Write skew |
  |---|---|---|---|---|---|
  | Read Uncommitted | Có thể (Postgres: **không**, vì chạy như Read Committed) | Có thể | Có thể | Có thể | Có thể |
  | Read Committed | Không | Có thể | Có thể | Có thể (với read-modify-write ở tầng app) | Có thể |
  | Repeatable Read | Không | Không | Chuẩn cho phép (Postgres: **không**. InnoDB: SELECT thường không thấy nhờ snapshot, locking read chặn bằng next-key lock) | Postgres: báo lỗi, app retry. InnoDB: **có thể** | Có thể |
  | Serializable | Không | Không | Không | Không | Không |

- **Read Committed và UPDATE nguyên tử (mục 3):** hai transaction cùng chạy `UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0`. Transaction thứ hai phải chờ khoá dòng. Khi transaction thứ nhất COMMIT, Postgres đọc lại phiên bản mới nhất của dòng và **kiểm tra lại** `stock > 0` trước khi cập nhật. Vì vậy nó không bao giờ trừ xuống âm. Còn nếu app `SELECT stock` rồi tự tính `stock - 1` rồi `UPDATE SET stock = <số đã tính>` thì vẫn bị lost update.
- **Vì sao không luôn dùng Serializable (mục 8):**
  1. Khi tranh chấp cao, nhiều transaction bị huỷ và phải chạy lại → tốn công, giảm throughput.
  2. App **bắt buộc** phải có logic retry cho **mọi** transaction (bắt lỗi `40001`, chạy lại từ đầu). Quên retry thì người dùng thấy lỗi.
  3. Có chi phí theo dõi phụ thuộc; với DB dùng khoá (như InnoDB Serializable), SELECT thường cũng bị khoá chia sẻ, dễ chặn nhau và deadlock.
  4. Phần lớn bài toán đã giải quyết được ở Read Committed bằng UPDATE nguyên tử, `FOR UPDATE` hoặc constraint.
- **(Tuỳ chọn) Thực hành nhanh bằng hai cửa sổ `psql`:** mở session A và B, thử lại timeline non-repeatable read ở Read Committed, rồi thử lại ở Repeatable Read để thấy lần đọc thứ hai không đổi. Sau đó thử cùng UPDATE một dòng ở Repeatable Read để nhìn thấy lỗi serialization.

**🟡 Bảng so sánh T2: Read Committed vs Repeatable Read vs Serializable (Postgres)** *(⏱ điền ở D49)*

Nhóm: *mô hình kiểm soát đồng thời (concurrency control)*. Trục chính của cuộc so sánh: **mức đúng đắn** vs **throughput và độ phức tạp ở tầng app**.

| Tiêu chí | Read Committed | Repeatable Read | Serializable |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Lỗi còn có thể xảy ra | | | |
| Ext: Khi xung đột thì sao (chờ, hay huỷ và retry)? | | | |
| Ext: App phải làm thêm gì (retry, khoá thủ công)? | | | |

**🔴 Thẻ Anki (T1)**

1. Vẽ bảng 4 isolation level × các lỗi đọc/ghi.
2. Postgres và MySQL InnoDB mặc định dùng mức nào?
3. Vì sao `UPDATE … WHERE stock > 0` an toàn ngay ở Read Committed của Postgres?
4. Repeatable Read của Postgres xử lý lost update thế nào? Còn để lọt lỗi gì?
5. Dùng Serializable thì app phải làm thêm gì?
6. Kể 3 lý do không phải lúc nào cũng dùng Serializable.

**🟢 Tra cứu (T3):** PostgreSQL docs, câu lệnh *SET TRANSACTION*; phụ lục *PostgreSQL Error Codes* (`40001`, `40P01`); MySQL docs, *Transaction Isolation Levels* (phần InnoDB).

**Tài liệu:**
- PostgreSQL docs: chương *Concurrency Control* → *Transaction Isolation* (đọc kỹ bảng *Transaction Isolation Levels* và 3 phần *Read Committed*, *Repeatable Read*, *Serializable*)
- DDIA chương 7: phần *Serializability* (đọc lướt mục *Serializable Snapshot Isolation*)

**❓ Câu hỏi cuối bài**

1. Mỗi mức isolation trong 4 mức chặn được lỗi nào?
2. Postgres mặc định dùng mức nào? MySQL InnoDB mặc định mức nào?
3. Vì sao không phải lúc nào cũng dùng Serializable?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Cùng một đoạn code read-modify-write (SELECT stock → app tính `stock - 1` → UPDATE bằng số đã tính) chạy ở Repeatable Read. Trên Postgres và trên MySQL InnoDB, hai request đồng thời cho kết quả khác nhau thế nào? App phải xử lý gì trên mỗi DB?
5. Vì sao `UPDATE products SET stock = stock - 1 WHERE id = 1 AND stock > 0` không bao giờ bán âm, ngay cả ở Read Committed của Postgres?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Read Uncommitted: chặn dirty write (Postgres chạy như Read Committed nên không có dirty read).
- Read Committed: chặn dirty read. Repeatable Read: thêm non-repeatable read (Postgres chặn luôn phantom).
- Serializable: chặn mọi lỗi kể cả lost update và write skew.

**2.**
- Postgres: Read Committed. MySQL InnoDB: Repeatable Read.
- Hệ quả: cùng một đoạn code, hành vi mặc định trên hai DB khác nhau → phải biết hệ thống mình đang chạy mức nào.

**3.**
- Tranh chấp cao → nhiều transaction bị huỷ và chạy lại → giảm throughput.
- App bắt buộc có logic retry cho mọi transaction (lỗi `40001`).
- Chi phí theo dõi phụ thuộc / khoá chia sẻ (InnoDB); phần lớn bài toán đã giải được ở Read Committed bằng UPDATE nguyên tử, `FOR UPDATE`, constraint.

**4.**
- Postgres RR: request thứ hai bị lỗi `could not serialize access due to concurrent update` → app phải bắt lỗi và **retry cả transaction**.
- InnoDB RR: UPDATE đọc bản mới nhất nhưng ghi đè bằng số app đã tính từ snapshot cũ → **lost update âm thầm**, không có lỗi.
- InnoDB phải dùng `SELECT … FOR UPDATE` hoặc UPDATE nguyên tử (`stock = stock - 1`).

**5.**
- Request thứ hai chờ khoá dòng; khi request đầu COMMIT, Postgres đọc lại **phiên bản mới nhất** và **kiểm tra lại** `stock > 0`.
- Việc đọc, kiểm tra và ghi nằm trong **một** câu lệnh → không có khe hở giữa "đọc" và "ghi" ở tầng app.
- Kiểm tra số dòng bị ảnh hưởng: 0 → hết hàng.

</details>

---

## D46 (T5, 12/11): MVCC và WAL

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 85' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h25'**

### 🧩 DSA: [994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)

- **Pattern (🔴 T1):** *BFS nhiều nguồn (multi-source BFS)*. Đưa **tất cả** quả cam thối vào queue ngay từ đầu, rồi BFS theo tầng; mỗi tầng là một phút.
- **Các bước:**
  1. Duyệt lưới: đưa mọi ô `2` vào queue, đếm số ô `1` (cam tươi).
  2. BFS theo tầng; mỗi lần làm thối một quả tươi thì giảm bộ đếm.
  3. Hết BFS mà còn cam tươi → `-1`; ngược lại trả về số phút.
- **Độ phức tạp:** O(m·n) thời gian và bộ nhớ.
- **Bẫy:** đếm lệch 1 phút (tầng cuối cùng không làm thối thêm quả nào nhưng vẫn bị cộng); trường hợp không có cam tươi ngay từ đầu phải trả về `0`.
- **Vì sao không BFS từng nguồn riêng lẻ:** chạy BFS từ mỗi quả thối rồi lấy min sẽ là O((m·n)²). BFS nhiều nguồn tương đương thêm một "nguồn ảo" nối tới mọi quả thối.

### 📘 Bài học buổi tối: Nguyên lý MVCC và WAL

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | MVCC: mỗi dòng có **nhiều phiên bản**; UPDATE không sửa tại chỗ mà tạo phiên bản mới | 🔴 T1 | Giải thích được bằng ví dụ bên dưới | `mvcc explained`, `postgres mvcc xmin xmax` |
| 2 | Mỗi phiên bản dòng ở Postgres ghi `xmin` (transaction tạo ra nó) và `xmax` (transaction xoá/thay thế nó) | 🔴 T1 | Biết hai trường này ở mức khái niệm, không cần thuộc định dạng header | `postgres tuple xmin xmax visibility` |
| 3 | **Snapshot**: tập các transaction đã COMMIT mà một câu lệnh/transaction được phép nhìn thấy | 🔴 T1 | Nối được với D45: Read Committed lấy snapshot mỗi câu lệnh, Repeatable Read lấy một lần cho cả transaction | `postgres snapshot read committed repeatable read` |
| 4 | Hệ quả: **đọc không chặn ghi, ghi không chặn đọc**; nhưng hai transaction cùng **ghi một dòng** thì vẫn chặn nhau | 🔴 T1 | Nói được vế sau, vì đây là điểm hay bị trả lời sai | `mvcc readers don't block writers` |
| 5 | Phiên bản cũ thành "dead tuple", VACUUM dọn dẹp; transaction chạy lâu (hoặc `idle in transaction`) làm VACUUM không dọn được → bảng phình to (bloat) | 🔴 T1 phần "có VACUUM và transaction dài cản nó", 🟢 T3 phần cấu hình autovacuum | Chỉ cần biết như vậy | `postgres dead tuples vacuum long running transaction` |
| 6 | Postgres lưu phiên bản cũ ngay trong bảng; InnoDB lưu trong undo log | 🟢 T3 | Biết khác nhau là đủ | `postgres mvcc vs innodb undo log` |
| 7 | **WAL** (Write-Ahead Log): mọi thay đổi được ghi vào log **trước**, trang dữ liệu ghi xuống đĩa sau | 🔴 T1 | Nói được thứ tự: sửa trang trong RAM → ghi bản ghi WAL → COMMIT = flush WAL xuống đĩa → trang dữ liệu được ghi sau | `write ahead logging explained` |
| 8 | Vì sao ghi log trước: ghi WAL là **ghi nối tiếp** (nhanh), ghi trang dữ liệu là **ghi ngẫu nhiên** (chậm); khi sập thì *redo* từ WAL | 🔴 T1 | Giải thích được vì sao COMMIT nhanh mà vẫn bền vững | `why wal sequential write crash recovery` |
| 9 | Checkpoint: thời điểm các trang bẩn đã được ghi xuống đĩa, nên khôi phục chỉ cần đọc WAL từ checkpoint gần nhất | 🔴 T1 ở mức một câu | Chỉ cần một câu | `postgres checkpoint` |
| 10 | WAL còn là nền tảng của replication và khôi phục theo thời điểm (PITR) | 🔴 T1 ở mức một câu | Sẽ học tiếp ở Tuần 8 (Replication) | `postgres streaming replication wal` |
| 11 | `synchronous_commit`, `fsync`, `full_page_writes`, cấu hình checkpoint, transaction ID wraparound | 🟢 T3 | Biết tên | PostgreSQL docs – *Reliability and the Write-Ahead Log* |

**Chi tiết cần hiểu**

- **MVCC bằng ví dụ (mục 1–3):**

  ```
  T100 INSERT sản phẩm 1, stock = 10        → phiên bản v1: xmin=100, xmax=—
  T200 UPDATE stock = 9 (chưa COMMIT)        → v1: xmax=200;  phiên bản v2: xmin=200, stock=9

  T150 (snapshot lấy trước khi T200 COMMIT) đọc sản phẩm 1:
      v1: T100 đã commit, xmax=200 chưa commit trong snapshot → THẤY v1 (stock = 10)
      v2: xmin=200 chưa commit trong snapshot                → KHÔNG thấy
  → T150 không cần chờ T200, và không đọc dữ liệu bẩn.
  ```

  - T200 COMMIT xong, các snapshot **mới** sẽ thấy v2.
  - Khi không còn transaction nào có thể cần v1, v1 thành dead tuple và VACUUM dọn đi.
- **"Đọc không chặn ghi" không có nghĩa là "không có lock" (mục 4):** T300 muốn UPDATE sản phẩm 1 trong khi T200 chưa COMMIT → T300 **phải chờ**. Đây chính là nền tảng của `SELECT … FOR UPDATE` ngày mai.
- **WAL bằng hình (mục 7–8):**

  ```
  UPDATE → sửa trang trong shared buffers (RAM, trang "bẩn")
         → ghi bản ghi WAL vào WAL buffer
  COMMIT → flush WAL xuống đĩa (fsync, ghi nối tiếp)  → báo thành công cho client
  Sau đó → checkpointer / background writer ghi các trang bẩn xuống file dữ liệu (ghi ngẫu nhiên, gom lại)

  Sập nguồn → khởi động lại → đọc WAL từ checkpoint gần nhất → "redo" các thay đổi đã COMMIT
  ```

  - Nếu không có WAL, mỗi COMMIT phải ghi ngay mọi trang dữ liệu bị sửa (nhiều vị trí ngẫu nhiên trên đĩa) → rất chậm, và sập giữa chừng thì trang có thể ghi dở.
  - `synchronous_commit = off` (T3): báo thành công trước khi flush WAL → nhanh hơn, có thể mất vài transaction cuối khi sập, nhưng không làm hỏng dữ liệu.

**🔴 Thẻ Anki (T1)**

1. MVCC giúp đọc không chặn ghi như thế nào? Hai transaction cùng ghi một dòng thì sao?
2. `xmin` và `xmax` của một phiên bản dòng là gì?
3. Read Committed và Repeatable Read khác nhau ở thời điểm lấy snapshot thế nào?
4. Phiên bản cũ của dòng đi đâu? Vì sao transaction chạy lâu gây hại?
5. Vì sao phải ghi WAL trước rồi mới ghi dữ liệu?
6. Khi server sập, Postgres khôi phục các transaction đã COMMIT bằng cách nào?

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Routine Database Maintenance Tasks* → *Routine Vacuuming*; chương *Reliability and the Write-Ahead Log* → *WAL Configuration*.

**Tài liệu:**
- PostgreSQL docs: chương *Concurrency Control* → *Introduction*; chương *Reliability and the Write-Ahead Log* → *Write-Ahead Logging (WAL)*
- Hussein Nasser: tìm video về MVCC và WAL trên kênh YouTube

**❓ Câu hỏi cuối bài**

1. MVCC giúp việc đọc không chặn việc ghi như thế nào?
2. Các phiên bản cũ của row đi đâu? (chỉ cần biết có VACUUM)
3. WAL: vì sao phải ghi log trước rồi mới ghi dữ liệu?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Đã có MVCC ("đọc không chặn ghi"), vì sao request UPDATE thứ hai vào cùng một dòng vẫn bị treo cho tới khi request thứ nhất COMMIT? Điều này liên quan gì tới `SELECT … FOR UPDATE`?
5. Một transaction báo cáo chạy hai câu SELECT cách nhau 1 phút; ở giữa có người COMMIT một thay đổi. Ở Read Committed và Repeatable Read, câu SELECT thứ hai thấy gì? Giải thích bằng khái niệm snapshot.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- UPDATE tạo **phiên bản mới** thay vì sửa tại chỗ; người đọc dùng snapshot để chọn phiên bản đã COMMIT phù hợp (`xmin`/`xmax`).
- Người đọc không phải chờ người ghi, và không đọc dữ liệu bẩn.

**2.**
- Phiên bản cũ thành dead tuple khi không còn snapshot nào cần; VACUUM / autovacuum dọn.
- Transaction chạy lâu hoặc `idle in transaction` giữ snapshot cũ → VACUUM không dọn được → bloat.

**3.**
- Ghi WAL là ghi **nối tiếp** (nhanh); ghi trang dữ liệu là ghi **ngẫu nhiên** (chậm) → COMMIT chỉ cần flush WAL.
- Sập giữa chừng: redo từ WAL kể từ checkpoint gần nhất → không mất transaction đã COMMIT, không có trang ghi dở.
- WAL còn là nền của replication và PITR.

**4.**
- MVCC chỉ giải quyết đọc–ghi. Hai lệnh **ghi cùng một dòng** vẫn cần khoá dòng: người ghi sau phải chờ người ghi trước COMMIT/ROLLBACK.
- `SELECT … FOR UPDATE` chủ động lấy chính khoá dòng này sớm, ngay lúc đọc.

**5.**
- Read Committed: mỗi câu lệnh lấy snapshot mới → câu thứ hai **thấy** thay đổi.
- Repeatable Read: một snapshot cho cả transaction → câu thứ hai **không** thấy, báo cáo nhất quán.

</details>

---

## D47 (T6, 13/11): Locking: pessimistic vs optimistic, deadlock

**⏱ Ước tính:** Giờ làm 65' (DSA 50' + Anki 15') · Tối 80' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h25'**

> ⏱ Bảng T2 *Optimistic vs Pessimistic* (15') dời sang **D49**, điền bằng số liệu retry thật từ Lab D48.

### 🧩 DSA: [417. Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)

- **Pattern (🔴 T1):** *Tìm ngược từ đích (reverse search)*. Thay vì hỏi "từ ô này nước chảy ra được biển nào?" cho từng ô, hãy BFS/DFS **từ biên của mỗi đại dương đi ngược lên dốc** (sang ô có độ cao ≥ ô hiện tại).
- **Các bước:** chạy một lần từ biên Thái Bình Dương (hàng trên + cột trái) → tập `P`; một lần từ biên Đại Tây Dương (hàng dưới + cột phải) → tập `A`; đáp án là `P ∩ A`.
- **Độ phức tạp:** O(m·n). Cách ngây thơ (DFS từ mỗi ô) là O((m·n)²).
- **Bẫy:** điều kiện khi đi ngược là `heights[kề] >= heights[hiện tại]`, dễ viết nhầm chiều.
- **Liên hệ:** cùng ý tưởng BFS nhiều nguồn của bài 994.

### 📘 Bài học buổi tối: Locking và bài toán overselling

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Pessimistic lock**: khoá trước rồi mới làm (`SELECT … FOR UPDATE` trong transaction), transaction khác phải chờ | 🔴 T1 | Viết được luồng đặt hàng dùng `FOR UPDATE`. Biết `FOR UPDATE` chạy ngoài transaction (autocommit) thì khoá được nhả ngay sau câu lệnh → vô dụng, một lỗi rất hay gặp khi ORM không mở transaction | `select for update postgres example`, `select for update autocommit` |
| 2 | **Optimistic lock**: không khoá; khi ghi thì kiểm tra `version` còn như lúc đọc không; không khớp → 0 dòng bị ảnh hưởng → retry hoặc báo lỗi | 🔴 T1 | Viết được câu UPDATE có `WHERE version = ?` và xử lý khi 0 dòng | `optimistic locking version column` |
| 3 | **UPDATE có điều kiện nguyên tử**: `UPDATE … SET stock = stock - ? WHERE id = ? AND stock >= ?`, kiểm tra số dòng bị ảnh hưởng | 🔴 T1 | Giải thích được vì sao an toàn (ôn lại D45 mục 3) | `atomic update prevent overselling` |
| 4 | **3 cách chống overselling** | 🟡 T2 | Điền bảng so sánh ở Lab D48 | `prevent overselling inventory database` |
| 5 | **Optimistic vs Pessimistic** | 🟡 T2 | Điền bảng so sánh bên dưới (dời sang D49) | `optimistic vs pessimistic locking when to use` |
| 6 | `CHECK (stock >= 0)` làm lưới an toàn cuối cùng | 🔴 T1 | Biết vì sao vẫn nên có dù đã khoá đúng ở tầng app | `check constraint stock non negative` |
| 7 | **Deadlock**: hai transaction chờ khoá của nhau theo vòng tròn | 🔴 T1 | Vẽ được timeline 2 transaction, 2 sản phẩm | `database deadlock example` |
| 8 | Postgres phát hiện deadlock: sau `deadlock_timeout` (mặc định 1 giây) kiểm tra đồ thị chờ, huỷ một transaction với lỗi `40P01 deadlock_detected` | 🔴 T1 phần "DB tự phát hiện và huỷ một bên", 🟢 T3 phần tham số | Liên hệ được với bài phát hiện chu trình trong đồ thị (Course Schedule ngày mai) | `postgres deadlock detection` |
| 9 | Phòng tránh deadlock: khoá theo **thứ tự cố định** (ví dụ sort `product_id` tăng dần), giữ transaction ngắn, đặt `lock_timeout`, retry khi gặp lỗi | 🔴 T1 | Kể được 3 cách | `how to prevent deadlocks` |
| 10 | 4 chế độ khoá dòng, khoá bảng (ví dụ `ALTER TABLE` lấy khoá mạnh nhất), `NOWAIT`, `SKIP LOCKED` (dùng làm hàng đợi job), advisory lock, `pg_locks` / `pg_blocking_pids()` | 🟢 T3 | Biết tên và công dụng một câu | PostgreSQL docs – *Explicit Locking* |

**Chi tiết cần hiểu**

- **3 cách chống overselling (câu hỏi 1):**

  ```sql
  -- Cách 1: UPDATE có điều kiện nguyên tử (một câu, không cần SELECT trước)
  BEGIN;
  UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock >= 1;
  -- số dòng bị ảnh hưởng = 0 → hết hàng → ROLLBACK, trả 409
  INSERT INTO orders (product_id, quantity) VALUES ($1, 1);
  COMMIT;

  -- Cách 2: Pessimistic, SELECT ... FOR UPDATE
  BEGIN;
  SELECT stock FROM products WHERE id = $1 FOR UPDATE;   -- request khác chờ ở đây
  -- app kiểm tra stock >= 1 (có thể kèm logic phức tạp: giới hạn mỗi user, khuyến mãi…)
  UPDATE products SET stock = stock - 1 WHERE id = $1;
  INSERT INTO orders ...;
  COMMIT;

  -- Cách 3: Optimistic, cột version
  SELECT stock, version FROM products WHERE id = $1;      -- không khoá
  -- app kiểm tra stock >= 1
  UPDATE products SET stock = stock - 1, version = version + 1
  WHERE id = $1 AND version = $2;
  -- 0 dòng → có người khác vừa sửa → đọc lại và thử lại (tối đa N lần) hoặc trả 409
  ```

- **Chọn cách nào:**
  - Chỉ cần trừ một con số → cách 1 là đơn giản và nhanh nhất.
  - Cần đọc rồi chạy logic nghiệp vụ phức tạp trước khi ghi, tranh chấp cao → cách 2.
  - Tranh chấp thấp, hoặc người dùng mất nhiều thời gian giữa lúc đọc và lúc ghi (mở form sửa sản phẩm rồi 5 phút sau mới bấm lưu, qua **hai** request HTTP khác nhau, không thể giữ khoá DB suốt 5 phút) → cách 3.
- **Deadlock (mục 7–9):** đơn A mua sản phẩm 1 và 2, đơn B mua sản phẩm 2 và 1:

  ```
  T1: UPDATE products ... WHERE id = 1;   -- T1 giữ khoá dòng 1
  T2: UPDATE products ... WHERE id = 2;   -- T2 giữ khoá dòng 2
  T1: UPDATE products ... WHERE id = 2;   -- chờ T2
  T2: UPDATE products ... WHERE id = 1;   -- chờ T1 → vòng tròn → sau ~1s Postgres huỷ một bên (40P01)
  ```

  Sửa: luôn khoá/cập nhật các sản phẩm theo thứ tự `id` tăng dần. Khi đó T2 sẽ phải chờ ở dòng 1 trước khi kịp khoá dòng 2, không tạo được vòng tròn.
- **Phát hiện deadlock trong thực tế (Chốt tuần câu 5):** log của Postgres ghi `ERROR: deadlock detected` kèm chi tiết hai câu lệnh; app nhận lỗi `40P01`; theo dõi số deadlock trong thống kê của database; khi đang bị chặn thì xem `pg_stat_activity` và `pg_blocking_pids()` (T3).

**🟡 Bảng so sánh T2: Optimistic vs Pessimistic lock** *(⏱ điền ở D49)*

Nhóm: *mô hình kiểm soát đồng thời (concurrency control)*. Trục chính của cuộc so sánh: **mức độ tranh chấp (tần suất xung đột)** vs **throughput / độ trễ**.

| Tiêu chí | Pessimistic (`SELECT … FOR UPDATE`) | Optimistic (cột `version`) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Hành vi khi xung đột (chờ, hay thất bại rồi retry) | | |
| Ext: Dùng được khi khoảng thời gian đọc → ghi kéo dài qua nhiều request không? | | |
| Ext: Rủi ro deadlock và công việc bị lãng phí | | |

**🔴 Thẻ Anki (T1)**

1. Viết luồng đặt hàng chống overselling bằng `SELECT … FOR UPDATE`.
2. Optimistic lock phát hiện xung đột bằng cách nào? Khi phát hiện thì làm gì?
3. Vì sao `UPDATE … WHERE stock >= 1` một câu là đủ an toàn mà không cần `FOR UPDATE`?
4. Khi nào optimistic lock tốt hơn pessimistic lock?
5. Vẽ timeline deadlock với 2 transaction và 2 sản phẩm. Sửa thế nào?
6. Postgres làm gì khi phát hiện deadlock?

**🟢 Tra cứu (T3):** PostgreSQL docs, chương *Concurrency Control* → *Explicit Locking* (các bảng *Table-Level Locks*, *Row-Level Locks*, phần *Deadlocks*, *Advisory Locks*); câu lệnh *SELECT* → phần *The Locking Clause* (`NOWAIT`, `SKIP LOCKED`).

**Tài liệu:**
- PostgreSQL docs: *Explicit Locking* (đọc kỹ phần *Row-Level Locks* và *Deadlocks*)
- DDIA chương 7: mục *Preventing Lost Updates* (các ý *Atomic write operations*, *Explicit locking*, *Compare-and-set*)

**❓ Câu hỏi cuối bài**

1. Kể 3 cách chống bán quá tồn kho: `UPDATE … WHERE stock > 0`, `FOR UPDATE`, optimistic version.
2. Deadlock xảy ra thế nào? Phòng tránh ra sao?
3. Khi nào optimistic lock tốt hơn pessimistic lock?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Đã dùng `UPDATE … WHERE stock >= 1` đúng cách rồi, vì sao vẫn nên thêm `CHECK (stock >= 0)`? Constraint này chặn được lỗi nào và **không** chặn được lỗi nào?
5. Lúc tải cao, log app xuất hiện lỗi `40P01` rải rác ở luồng đặt hàng nhiều sản phẩm. Chuyện gì đã xảy ra trong DB? App nên phản ứng ngay thế nào, và sửa gốc ra sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- UPDATE có điều kiện nguyên tử: một câu, kiểm tra số dòng bị ảnh hưởng; đơn giản và nhanh nhất khi chỉ trừ một con số.
- `SELECT … FOR UPDATE` trong transaction: khoá dòng, request khác chờ; hợp khi cần logic nghiệp vụ phức tạp giữa đọc và ghi.
- Optimistic `version`: không khoá, `WHERE version = ?`, 0 dòng → đọc lại và retry / 409.
- Cả ba: trừ kho + tạo đơn trong **cùng một** transaction.

**2.**
- Hai transaction giữ khoá mà bên kia cần, chờ nhau theo vòng tròn (T1 giữ dòng 1 chờ dòng 2, T2 giữ dòng 2 chờ dòng 1).
- Phòng tránh: khoá theo **thứ tự cố định** (sort `product_id`), giữ transaction ngắn, `lock_timeout`, retry khi bị huỷ.

**3.**
- Tranh chấp thấp (ít khi hai người sửa cùng lúc) → không tốn chi phí khoá.
- Khoảng đọc → ghi kéo dài qua nhiều request HTTP (form sửa sản phẩm) → không thể giữ khoá DB.
- Tranh chấp cao (50 request tranh 1 sản phẩm) → retry rất nhiều, pessimistic hoặc UPDATE nguyên tử tốt hơn.

**4.**
- Là lưới an toàn cuối: chặn mọi đường ghi quên kiểm tra (`SET stock = stock - 1` không điều kiện, script tay, service khác).
- Không chặn lost update: giá trị cũ bị ghi đè vẫn ≥ 0 nên constraint không thấy gì sai.

**5.**
- Deadlock: hai đơn khoá các sản phẩm theo thứ tự khác nhau; sau `deadlock_timeout` Postgres phát hiện chu trình trong đồ thị chờ và huỷ một bên.
- Ngay lập tức: bắt `40P01` và **retry cả transaction** (có giới hạn, backoff).
- Sửa gốc: sort `product_id` trước khi khoá/cập nhật, giữ transaction ngắn.

</details>

---

## D48 (T7, 14/11): Lab

**⏱ Ước tính:** DSA 45' · Lab bắt buộc 2h40' · Ôn ⚠️ 30' · **Tổng 3h55'**

> ⏱ Bảng T2 *Kahn vs DFS* (10') dời sang **D49**. Phần Lab *mở rộng* (Bước 4, làm cả hai cách ở Bước 5, thử deadlock ở Bước 7, khoảng 50') chỉ làm nếu còn giờ.

### 🧩 DSA: [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

- **Pattern (🔴 T1):** *Topological sort / phát hiện chu trình trên đồ thị có hướng*. Học được hết các môn ⇔ đồ thị phụ thuộc **không có chu trình**.
- **Các cách:**
  1. **Kahn (BFS theo bậc vào):** đưa các node có bậc vào = 0 vào queue; lấy ra thì giảm bậc vào của hàng xóm. Số node lấy ra được = `n` thì không có chu trình → O(V + E).
  2. **DFS 3 màu:** trắng (chưa thăm), xám (đang nằm trên đường đệ quy), đen (xong). Gặp lại node **xám** → có chu trình → O(V + E).
- **Bẫy:** `[a, b]` nghĩa là muốn học `a` phải học `b` trước → cạnh `b → a`. Dùng một tập `visited` thông thường (2 màu) cho DFS sẽ báo chu trình sai.
- **Liên hệ backend:** chạy migration / job có phụ thuộc, thứ tự build module, và phát hiện deadlock (chu trình trong đồ thị "ai chờ ai").
- **🟡 Bảng so sánh T2: Kahn vs DFS** *(⏱ điền ở D49)*. Nhóm: *thuật toán topological sort*. Trục chính: **dễ hiểu, không đệ quy** vs **gọn khi code**.

  | Tiêu chí | Kahn (BFS) | DFS 3 màu |
  |---|---|---|
  | Core: Use-case lý tưởng | | |
  | Core: Trade-off chính | | |
  | Core: Khi nào KHÔNG dùng | | |
  | Ext: Cách phát hiện chu trình | | |
  | Ext: Rủi ro tràn stack với đồ thị sâu | | |

### 🛠 Lab – Dự án (3h): Chứng minh và sửa lỗi overselling

Làm trên *Mini Order Service*, ngôn ngữ và framework của bạn, Postgres chạy bằng Docker.

> ⏱ **Chia phần để giữ Thứ Bảy ≤ 4h.** *Bắt buộc (2h40')*: Bước 1, 2, 3, 5 (chọn một cách), 6, phần CHECK của Bước 7, viết `notes/overselling-lab.md` + bảng 3 cách (15'). *Mở rộng (làm nếu còn giờ, ~50')*: Bước 4, làm cả hai cách ở Bước 5, thử deadlock ở Bước 7.

**Bước 1: Chuẩn bị dữ liệu (15')**

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock   int NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS version int NOT NULL DEFAULT 0;

-- Script reset, chạy trước MỖI lần test
UPDATE products SET stock = 10, version = 0 WHERE id = 1;
DELETE FROM orders WHERE product_id = 1;   -- đổi theo schema của bạn (có thể là order_items)
```

**Bước 2: Viết endpoint "ngây thơ" (30')**

`POST /orders` với body `{ "product_id": 1, "quantity": 1 }`:

```
BEGIN
  stock = SELECT stock FROM products WHERE id = :id
  if stock < quantity → ROLLBACK, trả 409
  sleep(50ms)                                   // tạm thời, để nới rộng "cửa sổ race" cho dễ tái hiện
  UPDATE products SET stock = :stock_da_doc - :quantity WHERE id = :id
  INSERT INTO orders ...
COMMIT
```

**Bước 3: Viết script bắn 50 request đồng thời (30')**

- Đặt ở `project/scripts/concurrency-test.<ext>`. Dùng cơ chế đồng thời của ngôn ngữ bạn (`Promise.all`, goroutine + `WaitGroup`, `asyncio.gather`, `ExecutorService` + `CountDownLatch`…). Cho cả 50 request **xuất phát cùng lúc** (dùng barrier/latch nếu có).
- **Bẫy từ Tuần 4:** `POST /orders` có `Idempotency-Key`. Mỗi request phải có key **khác nhau**, nếu không cơ chế idempotency sẽ gộp chúng lại và bạn không thấy lỗi.
- Script in ra: số request thành công (2xx), số bị từ chối (409), số lỗi khác (5xx), tổng thời gian.
- Sau khi chạy, kiểm tra trong DB:

  ```sql
  SELECT stock FROM products WHERE id = 1;
  SELECT count(*) FROM orders WHERE product_id = 1;
  -- Bất biến phải đúng: số đơn <= 10, stock >= 0, và số đơn + stock = 10
  ```

- Chạy 3 lần. Ghi lại bằng chứng lỗi: ví dụ 50 request thành công nhưng stock chỉ còn 7 (lost update), hoặc nhiều hơn 10 đơn được tạo. Ghi cả kích thước connection pool của app vào notes.

**Bước 4 (mở rộng): Quan sát khoá bằng hai cửa sổ `psql` (20')**

```sql
-- Session A
BEGIN;
SELECT stock FROM products WHERE id = 1 FOR UPDATE;

-- Session B (sẽ bị treo, chờ A)
BEGIN;
SELECT stock FROM products WHERE id = 1 FOR UPDATE;

-- Session A
UPDATE products SET stock = stock - 1 WHERE id = 1;
COMMIT;          -- lúc này Session B mới chạy tiếp, và thấy stock mới
```

Lặp lại với optimistic: hai session cùng đọc `version = 0`, cùng `UPDATE … WHERE version = 0`. Session thứ hai chờ, rồi nhận `UPDATE 0` (0 dòng bị ảnh hưởng).

**Bước 5: Sửa cách 1: UPDATE có điều kiện nguyên tử hoặc `SELECT … FOR UPDATE` (30')**

- Chọn một trong hai (khuyến khích làm cả hai nếu còn giờ). Giữ nguyên `sleep(50ms)` để chứng minh bản sửa vẫn đúng khi cửa sổ race rộng.
- Trừ tồn kho và INSERT đơn **trong cùng một transaction**.
- Chạy script 5 lần liên tiếp.

**Bước 6: Sửa cách 2: optimistic lock với cột `version` (30')**

- `UPDATE … SET stock = stock - :q, version = version + 1 WHERE id = :id AND version = :v`.
- 0 dòng bị ảnh hưởng → đọc lại và thử lại tối đa 3 lần (nghỉ ngắn, ngẫu nhiên giữa các lần), hết lượt thì trả 409.
- Chạy script 5 lần liên tiếp. Ghi lại tổng số lần retry: với 50 request tranh nhau **một** sản phẩm, bạn sẽ thấy optimistic phải retry rất nhiều. Đây chính là số liệu để trả lời "khi nào optimistic **không** phù hợp".

**Bước 7: Lưới an toàn + thử deadlock (15')**

- Thêm `ALTER TABLE products ADD CONSTRAINT stock_non_negative CHECK (stock >= 0);`. Chạy lại bản "ngây thơ": constraint có chặn được lỗi không? Giải thích vì sao nó không chặn được lost update (stock bị ghi đè bằng số cũ nhưng chưa xuống âm), và vì sao nó vẫn chặn được kiểu lỗi `SET stock = stock - 1` không kiểm tra điều kiện.
- Tuỳ chọn: bằng hai session `psql`, cập nhật sản phẩm 1 rồi 2 ở session A, 2 rồi 1 ở session B. Chụp lại thông báo `deadlock detected`.

**Sản phẩm: `notes/overselling-lab.md`**, gồm:

| Cách | Thành công | Bị từ chối (409) | Lỗi 5xx | Stock cuối | Số đơn | Số lần retry | Tổng thời gian |
|---|---|---|---|---|---|---|---|
| Ngây thơ (lần 1–3) | | | | | | — | |
| Cách 1: UPDATE nguyên tử / FOR UPDATE | | | | | | — | |
| Cách 2: Optimistic version | | | | | | | |

Kèm theo:
- Giải thích bằng lời vì sao bản ngây thơ sai (vẽ timeline lost update) và vì sao mỗi bản sửa đúng.
- **🟡 Bảng so sánh T2: 3 cách chống overselling.** Nhóm: *concurrency control*. Trục chính: **độ đơn giản và độ đúng** vs **throughput khi tranh chấp cao**.

  | Tiêu chí | UPDATE có điều kiện nguyên tử | `SELECT … FOR UPDATE` | Optimistic `version` |
  |---|---|---|---|
  | Core: Use-case lý tưởng | | | |
  | Core: Trade-off chính | | | |
  | Core: Khi nào KHÔNG dùng | | | |
  | Ext: Hỗ trợ logic nghiệp vụ phức tạp giữa đọc và ghi? | | | |
  | Ext: Hành vi khi 50 request tranh một sản phẩm (số liệu từ lab) | | | |
  | Ext: Rủi ro deadlock khi một đơn có nhiều sản phẩm | | | |

**Tiêu chí đạt:**
- [ ] Bản ngây thơ tái hiện được lỗi (lost update hoặc bán quá 10) trong ít nhất 1/3 lần chạy.
- [ ] Mỗi bản sửa, qua 5 lần chạy liên tiếp: đúng **10** request thành công, **40** bị từ chối bằng 409, stock cuối = 0, số đơn = 10, không có lỗi 5xx.
- [ ] Trừ tồn kho và tạo đơn nằm trong cùng một transaction.
- [ ] Script test được commit vào `project/scripts/`, chạy được bằng một lệnh.
- [ ] Bảng T2 "3 cách chống overselling" có số liệu thật từ lab.

**Bước 8 (30'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D49 (CN, 15/11): Chốt tuần 7

**⏱ Ước tính:** DSA 25' · Chốt tuần 60' · Bảng T2 dời từ trong tuần 40' (Isolation levels 15' + Optimistic vs Pessimistic 15' + Kahn vs DFS 10') · Anki/cheat sheet 30' · **Tổng 2h35'**

### 🧩 DSA: [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

- **Pattern (🔴 T1):** *Topological sort trả về thứ tự*. Mở rộng trực tiếp của bài 207.
- **Các cách:**
  1. Kahn: thứ tự các node được lấy ra khỏi queue chính là đáp án; nếu số node < `n` → có chu trình → trả `[]`.
  2. DFS 3 màu: thêm node vào danh sách khi nó chuyển sang **đen** (post-order), cuối cùng **đảo ngược** danh sách.
- **Độ phức tạp:** O(V + E) thời gian và bộ nhớ.
- **Mục tiêu:** ≤ 20', vì chỉ thêm một mảng kết quả vào bài 207.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Giải thích ACID và 4 isolation level mà không nhìn tài liệu.
2. Trình bày bài toán overselling: các giải pháp và trade-off của từng cái.
3. Giải thích MVCC trong 2 phút.
4. BFS nhiều nguồn (Rotting Oranges) và topological sort dùng khi nào? Liên hệ với backend: thứ tự chạy job phụ thuộc nhau, thứ tự build.
5. Làm sao phát hiện deadlock và làm sao tránh nó?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- A/C/I/D mỗi cái một câu + ví dụ chuyển tiền; Durability nhờ WAL; tác dụng phụ ngoài DB không rollback được.
- 4 mức × lỗi chặn được; mặc định Postgres = Read Committed, InnoDB = Repeatable Read.
- Serializable có thể huỷ transaction (`40001`) → app phải retry.

**2.**
- Nguyên nhân: read-modify-write ở tầng app → lost update.
- 3 cách: UPDATE có điều kiện nguyên tử / `FOR UPDATE` / optimistic `version`, kèm trade-off (đơn giản, logic phức tạp, tranh chấp cao → retry nhiều).
- `CHECK (stock >= 0)` làm lưới an toàn; dẫn số liệu thật từ lab (số retry, số đơn).

**3.**
- Nhiều phiên bản dòng, `xmin`/`xmax`, snapshot quyết định thấy phiên bản nào.
- Đọc không chặn ghi, nhưng hai lệnh ghi cùng dòng vẫn chặn nhau.
- RC lấy snapshot mỗi câu lệnh, RR một lần cho cả transaction; phiên bản cũ do VACUUM dọn.

**4.**
- BFS nhiều nguồn: nhiều điểm xuất phát lan cùng lúc, cần "khoảng cách tới nguồn gần nhất" (thời gian lan, khoảng cách tới kho gần nhất).
- Topological sort: thứ tự thực hiện các việc có phụ thuộc (migration, job, build module); có chu trình → không có thứ tự hợp lệ.

**5.**
- Phát hiện: DB tự tìm chu trình trong đồ thị chờ và huỷ một bên (`40P01`), log `deadlock detected`, `pg_stat_activity` / `pg_blocking_pids()`.
- Tránh: khoá theo thứ tự cố định, transaction ngắn, `lock_timeout`, retry khi bị huỷ.

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] Script test đồng thời + 2 cách sửa, có kết quả chạy trong `notes/overselling-lab.md`
- [ ] Tự giải lại 200, 133, 695, 994, 417, 207, 210 không xem lời giải
- [ ] Anki: đã nhập đủ thẻ T1 của D43–D47 + thẻ pattern Flood fill / BFS nhiều nguồn / Tìm ngược từ biên / Topological sort
- [ ] Cheat sheet: đã điền 5 bảng T2 (DFS vs BFS trên lưới, Isolation levels, Optimistic vs Pessimistic, 3 cách chống overselling, Kahn vs DFS)

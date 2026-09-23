# Tuần 14 (28/12 – 03/01) + D99–D100 (04/01 – 05/01/2027): Tổng ôn, Mock, Sẵn sàng

← [Tuần 13](tuan-13.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md)

**Mục tiêu tuần:** Không học thêm nội dung mới. Chỉ ôn lại, sửa điểm yếu và phỏng vấn thử. Kết thúc D100 với CV đã nộp vào các công ty ưu tiên.

> Cách học theo Tier: xem lại [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Tuần này **chỉ ôn**: 🔴 T1 qua Anki + trả lời lại câu chốt tuần, 🟡 T2 qua đọc lại cheat sheet, 🟢 T3 **không ôn** (cú pháp tra được, quên là bình thường).

## Tổng kết Tier của tuần

| 🔴 T1 (ôn qua Anki + chốt tuần) | 🟡 T2 (đọc lại cheat sheet) | 🟢 T3 (không ôn) |
|---|---|---|
| Toàn bộ deck `T1` và `DSA-Pattern`. Ưu tiên thẻ hay bấm *Again/Hard*. Khung SD 5 bước, khung STAR, khung giới thiệu bản thân | Toàn bộ `notes/tradeoff-cheatsheet.md`. Tự che cột, nói lại "khi nào chọn A thay vì B" cho từng bảng | `notes/snippets.md`, cú pháp EXPLAIN / Dockerfile / YAML, code chi tiết của lời giải. Chỉ mở khi cần |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D92 (T2) Ôn chốt tuần 1–4 | 70' | 90' | 2h40' |
| D93 (T3) Ôn chốt tuần 5–8 | 70' | 90' | 2h40' |
| D94 (T4) Ôn chốt tuần 9–12 | 70' | 90' | 2h40' |
| D95 (T5) Mock SD e-commerce | 65' | 80' | 2h25' |
| D96 (T6, 01/01, nghỉ lễ) Mock đầy đủ | — | 2h45' | 2h45' |
| D97 (T7) Xem video mock + sửa | — | 4h00' | 4h00' |
| D98 (CN) Ôn nhẹ + câu hỏi ngược | — | 2h10' | 2h10' |
| **Tổng tuần 14** | | | **19h20'** |
| D99 (T2) Mock lần cuối | 65' | 65' | 2h10' |
| D100 (T3) Nộp CV | 20' | 90' | 1h50' |
| **Tổng D99–D100** | | | **4h00'** |

**Tổng tuần: 19h20'** (D92–D98) + **4h00'** (D99–D100) = **23h20'**, chưa tính 1h tiếng Anh mỗi ngày.

Ngày nặng nhất là **D97 (4h00')**, chạm trần Thứ Bảy. Ba buổi tối ôn D92–D94 đều chạm trần 90' nên đã cân đối lại (xem "⚖️ Ngân sách thời gian" ngay bên dưới).

## Cách chấm điểm khi ôn chốt tuần (D92–D94)

- **Điều kiện làm bài:** nói to hoặc viết ra, **không nhìn tài liệu**, bấm giờ. Mở file tuần tương ứng **sau** khi đã trả lời xong để đối chiếu.
- **Thang điểm mỗi câu:**

  | Điểm | Nghĩa |
  |---|---|
  | 2 | Đúng đủ ý chính, nói trôi chảy, có ví dụ hoặc trade-off |
  | 1 | Đúng ý chính nhưng ngập ngừng, thiếu ý, hoặc phải đoán |
  | 0 | Sai, không nhớ, hoặc chỉ nói được định nghĩa suông |

- **Mỗi tuần 5 câu, tối đa 10 điểm. Đạt ≥ 8/10** (tương đương quy tắc ≥ 4/5 của lộ trình).
- **Câu dài (mock, SD, trình bày 20–45'):** tối ôn không đủ giờ để làm trọn. Làm **bản rút gọn 10'**: nói khung các bước + vẽ sơ đồ chính + 2 trade-off. Chấm theo cùng thang 0–2.
- **Câu dính sản phẩm/lab:** mở lại repo, chạy thử (`docker compose up`), kiểm tra số liệu trong `notes/` vẫn đúng. Không chạy được thì sửa ngay, vì phỏng vấn có thể yêu cầu demo.
- **Xử lý câu 0–1 điểm:**
  1. Ghi vào `notes/weak-spots.md` theo mẫu: `| Ngày | Tuần | Câu | Điểm | Thiếu ý gì | Đã ôn lại chưa |`.
  2. Mở file tuần tương ứng, đọc lại đúng mục đó **tối đa 15'**. Không đọc lan sang mục khác.
  3. Sửa hoặc viết lại thẻ Anki của mục đó (thẻ cũ nhiều khả năng quá dài hoặc hỏi sai trọng tâm).
  4. Trả lời lại vào **cuối buổi hôm đó** và lần nữa vào **D98**. Vẫn 0–1 thì đưa vào danh sách ôn buổi sáng D99.
- **Tổng tuần < 8/10:** không dừng lịch. Dùng khung giờ DSA của D93/D94 để ôn thêm thay vì làm Error List.

### ⚖️ Ngân sách thời gian cho mỗi buổi tối D92–D94 (trần 90')

Mỗi tối có 4 tuần × 5 câu = **20 câu**. Nếu mỗi câu điểm thấp lại đọc lại 15' thì một buổi dễ vượt 2 tiếng. Vì vậy:

| Phần | Thời lượng | Cách làm |
|---|---|---|
| **Vòng 1: trả lời + chấm** (Tự kiểm tra) | 65' | Câu ngắn ≤ 3'/câu, chấm 0–2 ngay khi trả lời xong. Câu ⏱ làm bản rút gọn theo bảng của ngày |
| **Ghi weak-spots + sửa thẻ Anki** (Ghi chú/Anki) | 15' | Mỗi câu 0–1 điểm ghi **một dòng** vào `notes/weak-spots.md` |
| **Đọc lại** (Học) | 10' | Chỉ đọc lại **2 câu điểm thấp nhất** (~5'/câu), rồi trả lời lại ngay |

- **Thứ tự làm:** mở `notes/weak-spots.md` và danh sách ⚠️ trước. Làm **trước** các câu từng có ⚠️ hoặc từng chưa đạt ở chốt tuần gốc, sau đó mới tới các câu khác. Hết 65' mà còn câu chưa làm → câu nào ở chốt tuần gốc đã đạt 2 điểm và thẻ Anki đang ổn thì chỉ nói **một câu tóm tắt** (30 giây) rồi chấm.
- Câu 0–1 điểm còn lại (ngoài 2 câu đã đọc lại): bước 2 "đọc lại tối đa 15'" dời sang **phần giờ làm còn dư** của hôm sau (sau bài DSA) hoặc Bước 4 của D97. Lần trả lời lại thứ hai vẫn ở D98.

---

## D92 (T2, 28/12): Ôn Giai đoạn 1 – chốt tuần 1–4

**⏱ Ước tính:** Giờ làm 70' (DSA 50' + Anki 20') · Tối 90' (Học 10' + Ghi chú/Anki 15' + Tự kiểm tra 65') · **Tổng 2h40'**

### 🧩 DSA: Làm lại bài hay sai nhất trong Error List

- Mở `notes/error-list.md`, sắp xếp theo **số lần sai** (hoặc theo bài vẫn chưa qua lần làm lại thứ 2).
- Làm lại **2 bài** đứng đầu, bấm giờ **≤ 25'/bài**, không xem lời giải.
- Qua → đánh dấu ✅ trong Error List. Không qua → xem lời giải, ghi lại **đúng một câu** "bước nào mình không nghĩ ra", làm lại vào D97.

### 📘 Buổi tối: trả lời lại chốt tuần 1–4

Thời lượng gợi ý: theo bảng "⚖️ Ngân sách thời gian" ở đầu file (65' trả lời + 15' weak-spots + 10' đọc lại). Câu có dấu ⏱ làm bản rút gọn. Câu vẽ sơ đồ / mở code thật (tuần 1 câu 3, tuần 2 câu 5, tuần 3 câu 4) giới hạn 5'/câu.

- **Tuần 4 câu 5 (tự mock 1 bài Medium):** tính bằng kết quả 2 bài Error List trong giờ làm hôm nay (cùng điều kiện ≤ 25', không xem lời giải). Buổi tối **không** code lại, chỉ tự chấm theo thang 0–2.

| Tuần | File | Chủ đề | Câu hỏi chốt tuần (tóm tắt, đầy đủ trong file) | Sản phẩm cần kiểm tra |
|---|---|---|---|---|
| 1 | [tuan-01.md](tuan-01.md) | Big-O, OOP, SOLID | (1) 4 tính chất OOP trong 2' · (2) khi nào vẫn nên kế thừa · (3) chỉ ra 2 vi phạm SOLID trong code thật · (4) HashMap bên trong, vì sao O(1) tb / O(n) xấu nhất · (5) Big-O bài Group Anagrams | `notes/solid-refactor.md` |
| 2 | [tuan-02.md](tuan-02.md) | Two Pointers, Sliding Window, Coupling/Cohesion, Creational Patterns | (1) dấu hiệu Two Pointers vs Sliding Window · (2) cửa sổ cố định vs thay đổi + khung code · (3) Factory vs Builder · (4) giải thích DI cho người không biết lập trình · (5) sơ đồ phụ thuộc module, chỗ coupling cao nhất | Module Notification có test xanh |
| 3 | [tuan-03.md](tuan-03.md) | Stack, Binary Search, Behavioral/Structural Patterns, Repository | (1) 7 pattern, mỗi cái một câu · (2) monotonic stack dùng cho dạng nào · (3) binary search trên không gian đáp án · (4) luồng request controller → DB có gắn pattern · (5) "Bạn đã dùng design pattern nào?" trong 2' | Module phí ship + Decorator |
| 4 | [tuan-04.md](tuan-04.md) | Linked List, HTTP, REST API Design, Auth | (1) trọn vẹn `POST /orders` từ HTTP tới response · (2) thiết kế API giỏ hàng · (3) LRU = HashMap + doubly linked list vì sao · (4) fast/slow pointer dùng cho bài nào · (5) ⏱ tự mock 30' một bài Medium mới → rút gọn: dùng kết quả 2 bài Error List buổi sáng | Dự án chạy được, ≥ 5 endpoint |

**Kết quả hôm nay** (ghi vào `notes/weak-spots.md`)

| Tuần | Điểm /10 | Câu 0–1 điểm | Hành động |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

---

## D93 (T3, 29/12): Ôn Giai đoạn 2 – chốt tuần 5–8

**⏱ Ước tính:** Giờ làm 70' (DSA 50' + Anki 20') · Tối 90' (Học 10' + Ghi chú/Anki 15' + Tự kiểm tra 65') · **Tổng 2h40'**

### 🧩 DSA: Error List

- Làm tiếp 2 bài trong Error List (ưu tiên nhóm Tree, Heap, Graph, Backtracking của Giai đoạn 2), ≤ 25'/bài.

### 📘 Buổi tối: trả lời lại chốt tuần 5–8

Thời lượng: theo bảng "⚖️ Ngân sách thời gian" ở đầu file. Tuần 6 câu 1 (giải thích plan) giới hạn 5', tuần 5 câu 5 và tuần 6 câu 3 chỉ cần mở `notes/` kiểm tra số liệu rồi nói 2'.

| Tuần | File | Chủ đề | Câu hỏi chốt tuần (tóm tắt, đầy đủ trong file) | Sản phẩm cần kiểm tra |
|---|---|---|---|---|
| 5 | [tuan-05.md](tuan-05.md) | Tree, SQL, Index | (1) DFS vs BFS trên cây, đệ quy vs vòng lặp · (2) B-Tree index trong 2' · (3) 3 query → số index ít nhất · (4) vì sao không index mọi cột · (5) số liệu lab trước/sau index | `notes/index-lab.md` |
| 6 | [tuan-06.md](tuan-06.md) | Tree, Heap, EXPLAIN | (1) giải thích từng node của một plan · (2) 3 nguyên nhân query chậm + cách xử lý · (3) STAR "tôi đã tối ưu một API chậm" 2' · (4) Big-O insert/pop của heap · (5) Top-K: heap hay sort | API danh sách đơn + ghi chú trước/sau |
| 7 | [tuan-07.md](tuan-07.md) | Graph, Transaction, Isolation, Locking | (1) ACID + 4 isolation level · (2) overselling: giải pháp + trade-off · (3) MVCC trong 2' · (4) BFS nhiều nguồn, topological sort, liên hệ backend · (5) phát hiện và tránh deadlock | Script test đồng thời + 2 cách sửa |
| 8 | [tuan-08.md](tuan-08.md) | Backtracking, Cache, Replication, Sharding, NoSQL | (1) các bước scale DB theo thứ tự · (2) chọn DB cho 4 use-case · (3) cache-aside + nhất quán dữ liệu · (4) khung backtracking + Big-O Subsets · (5) ⏱ tự mock 45' (2 câu DB + 1 bài Medium) → rút gọn: 2 câu DB nói miệng 5', bỏ phần DSA vì đã làm buổi sáng | Cache có số liệu + bảng SQL vs NoSQL |

**Kết quả hôm nay**

| Tuần | Điểm /10 | Câu 0–1 điểm | Hành động |
|---|---|---|---|
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |

---

## D94 (T4, 30/12): Ôn Giai đoạn 3 – chốt tuần 9–12

**⏱ Ước tính:** Giờ làm 70' (DSA 50' + Anki 20') · Tối 90' (Học 10' + Ghi chú/Anki 15' + Tự kiểm tra 65') · **Tổng 2h40'**

### 🧩 DSA: Error List

- Làm tiếp 2 bài trong Error List (ưu tiên Intervals/Greedy, DP, Trie), ≤ 25'/bài.

### 📘 Buổi tối: trả lời lại chốt tuần 9–12

Giai đoạn này có nhiều câu SD dài. Đừng làm trọn bài nào; bài SD trọn vẹn sẽ làm ở D95 và D96.

- **Cân đối giờ (trần 90'):** 4 câu ⏱ nếu làm hết bản rút gọn 10' đã tốn ~35', cộng 16 câu ngắn là vượt trần. Vì vậy: tuần 9 câu 1 giữ 5'; tuần 10 câu 1 giữ 10'; tuần 11 câu 4 rút còn **5'** (chỉ nói khung + sơ đồ); tuần 12 câu 1 (flash sale) **tính bằng mock D95**, vì đề e-commerce đi sâu đúng các ý khoá tồn kho, queue, idempotency. Tối nay chỉ nói 1' "4 điểm đi sâu của flash sale là gì" rồi chấm.

| Tuần | File | Chủ đề | Câu hỏi chốt tuần (tóm tắt, đầy đủ trong file) | Sản phẩm cần kiểm tra |
|---|---|---|---|---|
| 9 | [tuan-09.md](tuan-09.md) | Intervals/Greedy, OS/Network, Scaling cơ bản | (1) ⏱ "gõ URL" trong 5' (giữ nguyên 5') · (2) vẽ consistent hashing · (3) vì sao phải stateless mới scale ngang · (4) intervals sort theo điểm đầu, greedy đúng khi nào · (5) một race condition trong dự án | 2 instance sau Nginx |
| 10 | [tuan-10.md](tuan-10.md) | DP 1D, khung SD, case study đầu | (1) ⏱ Rate Limiter 20' đủ 5 bước → rút gọn 10' · (2) ước lượng QPS + dung lượng · (3) state / công thức / cơ sở của Coin Change · (4) memoization vs tabulation · (5) Snowflake vs UUID | Rate limiter + bản vẽ URL Shortener |
| 11 | [tuan-11.md](tuan-11.md) | DP 2D, Trie, Message Queue, CAP | (1) vì sao exactly-once khó, thực tế giải thế nào · (2) Kafka hay RabbitMQ cho 2 tình huống · (3) CAP trong 2' · (4) ⏱ Notification System 25' → rút gọn 5' (khung + sơ đồ) · (5) Big-O tìm theo tiền tố trên Trie | Luồng event có consumer idempotent + DLQ |
| 12 | [tuan-12.md](tuan-12.md) | Microservices, Resilience, Observability | (1) ⏱ SD flash sale 45' → tối nay chỉ nói 1' 4 điểm đi sâu (khoá tồn kho, queue, rate limit, idempotency); bản đầy đủ tính bằng mock D95 · (2) Saga + Outbox · (3) Circuit Breaker · (4) SLI / SLO / SLA · (5) trade-off microservices | — |

- **Chốt tuần 13:** tối nay **không** làm (đã chạm trần 90'). Câu 1–3 và câu 5 (commit → production, Pod/Deployment/Service, Canary vs Blue-Green, trình bày dự án 5') dời sang D98 (tuỳ chọn, 10'). Câu 4 (STAR) được luyện trong phần behavioral của mock D96.

**Kết quả hôm nay**

| Tuần | Điểm /10 | Câu 0–1 điểm | Hành động |
|---|---|---|---|
| 9 | | | |
| 10 | | | |
| 11 | | | |
| 12 | | | |

---

## D95 (T5, 31/12): Mock System Design – thương mại điện tử

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 80' (Học 20' + Ghi chú/Anki 15' + Tự kiểm tra 45') · **Tổng 2h25'**

> Tự kiểm tra 45' = mock SD; Ghi chú 15' = tự chấm rubric; Học 20' = đọc tài liệu sau khi chấm + ghi 3 điều thiếu. Bản mock này cũng được tính cho câu 1 chốt tuần 12 (flash sale) ở D94.

### 🧩 DSA: 1 bài Medium mới, 45'

- Chọn một bài chưa làm từ kho đề ở [D90 Tuần 13](tuan-13.md) (không trùng bài đã dùng ở D83, D90). Làm như phỏng vấn thật: nói to, bấm giờ 45'.

### 📘 Buổi tối: Mock SD 45'

**Đề:** *"Thiết kế hệ thống thương mại điện tử: sản phẩm – giỏ hàng – đặt hàng – thanh toán"*.

**Luật chơi:** làm trên giấy hoặc Excalidraw (excalidraw.com), bấm giờ, **nói to** như đang có người phỏng vấn, ghi âm hoặc quay màn hình. Không mở sách, không mở notes trong 45'.

**Khung 45' (5 bước, đã học ở Tuần 10)**

| Bước | Thời gian | Việc cần làm | Gợi ý riêng cho đề này |
|---|---|---|---|
| **1. Làm rõ yêu cầu** | 0–7' | Yêu cầu chức năng, phi chức năng, phạm vi **không** làm | Chức năng: xem/tìm sản phẩm, giỏ hàng, đặt hàng, thanh toán qua cổng bên thứ ba, xem trạng thái đơn. Phi chức năng: catalog **đọc rất nhiều**, tồn kho và thanh toán cần **nhất quán mạnh**, không bán quá tồn kho, không trừ tiền 2 lần, chịu được đỉnh flash sale. Ngoài phạm vi: gợi ý sản phẩm, review, quản lý kho vật lý |
| **2. Ước lượng** | 7–12' | QPS trung bình + đỉnh, dung lượng, tỷ lệ đọc/ghi | Tự đặt giả định và nói ra (ví dụ: X triệu DAU, mỗi người Y lượt xem sản phẩm, Z% đặt hàng). Kết luận quan trọng: đọc catalog ≫ ghi đơn hàng → catalog cần cache/CDN, còn đơn hàng thì QPS nhỏ hơn nhiều nhưng phải đúng tuyệt đối |
| **3. Thiết kế tổng quan** | 12–25' | API chính, mô hình dữ liệu, sơ đồ thành phần | API: `GET /products`, `POST /cart/items`, `POST /orders` (có **idempotency key**), `POST /payments/webhook`. Thành phần: CDN, LB/API Gateway, Product service (+ cache, + search), Cart service, Order service, Inventory, Payment service ↔ cổng thanh toán, message queue, Notification. Dữ liệu: `products`, `inventory`, `carts`, `orders`, `order_items`, `payments` |
| **4. Đi sâu** | 25–40' | Chọn **2–3** điểm khó nhất, đi sâu có trade-off | (a) **Chống bán quá tồn kho** (Tuần 7): giữ hàng (reserve) lúc nào, có TTL không, khoá bi quan hay cập nhật có điều kiện. (b) **Thanh toán đúng một lần**: idempotency key, trạng thái đơn (`PENDING → PAID / FAILED / EXPIRED`), webhook có thể tới trùng hoặc trễ, đối soát (reconciliation). (c) **Nhất quán giữa các service**: Saga + Outbox (Tuần 12) cho Order → Payment → Inventory, bước bù trừ khi thanh toán lỗi. (d) **Catalog đọc nhiều**: cache-aside + invalidation (Tuần 8), search index riêng |
| **5. Trade-off + tổng kết** | 40–45' | Nút cổ chai, điểm lỗi đơn lẻ, sẽ làm gì khi scale ×10 | Trade-off nên nói: giữ hàng khi thêm vào giỏ vs khi checkout; giỏ hàng lưu Redis/KV vs SQL; thanh toán đồng bộ vs bất đồng bộ; monolith có module vs microservices cho team nhỏ. Kết thúc bằng tóm tắt 30 giây |

**Tự chấm ngay sau khi làm** (dùng phần SD của rubric ở D96, thang 1–4)

| Tiêu chí | Điểm /4 | Ghi chú: thiếu gì? |
|---|---|---|
| Requirements | | |
| Estimation | | |
| High-level design | | |
| Deep-dive | | |
| Trade-offs | | |

- **Đạt:** ≥ 14/20 và không tiêu chí nào 1 điểm.
- **Sau khi chấm mới đọc tài liệu:** tìm trên ByteByteGo các bài về thiết kế e-commerce / payment system; nếu có *System Design Interview – Tập 2* của Alex Xu thì đọc chương *Payment System*. Ghi 3 điều mình thiếu vào `notes/weak-spots.md`.

---

## D96 (T6, 01/01): Mock đầy đủ – 45' coding + 45' SD + 15' behavioral

**⏱ Ước tính:** Chuẩn bị 15' · Mock + feedback 2h10' · Anki 20' · **Tổng 2h45'**

> Hôm nay là ngày nghỉ Tết Dương lịch, tận dụng để làm một buổi liền mạch ~2 tiếng. Nếu hôm nay không nhờ được ai, làm D96 và D97 đổi chỗ cho nhau không sao, miễn làm đủ.

### Chuẩn bị (trước giờ mock)

- [ ] **Người phỏng vấn:** nhờ một bạn làm backend (tốt nhất là người từng phỏng vấn người khác). Không có thì **tự quay video** (camera + quay màn hình), đọc đề từ phong bì đã chuẩn bị từ trước để không biết đề trước.
- [ ] **Đề coding:** người phỏng vấn chọn 1 bài Medium bạn chưa làm (có thể lấy từ kho đề D90 Tuần 13). Chuẩn bị sẵn 1 câu hỏi mở rộng (follow-up).
- [ ] **Đề SD:** người phỏng vấn chọn 1 đề bạn **chưa làm** trong lộ trình, ví dụ: *Search Autocomplete*, *Web Crawler*, *Key-Value Store* (đều có trong Alex Xu Tập 1, bạn chưa đọc các chương này), hoặc *Hệ thống đặt vé xem phim*.
- [ ] **Behavioral:** người phỏng vấn chọn 3 câu từ [danh sách câu hỏi D88 Tuần 13](tuan-13.md), có ít nhất 1 câu bạn chưa luyện.
- [ ] Công cụ: editor không có gợi ý AI/autocomplete mạnh, Excalidraw hoặc giấy, đồng hồ bấm giờ.
- [ ] In hoặc gửi trước **rubric bên dưới** cho người phỏng vấn.

### Kịch bản và thời gian

| Thời điểm | Phần | Diễn biến |
|---|---|---|
| 0:00 – 0:03 | Mở đầu | Người phỏng vấn: *"Giới thiệu ngắn về bản thân."* → bạn dùng bài 2 phút ở D89 |
| 0:03 – 0:48 | **Coding 45'** | Đọc đề + hỏi làm rõ (≤ 5') → nêu brute force + Big-O → tối ưu (người phỏng vấn được gợi ý **1 lần** nếu bạn bí > 5') → code → tự chạy tay ví dụ + edge case → follow-up. Bạn phải **nói liên tục**, im lặng > 30 giây là lỗi |
| 0:48 – 0:53 | Nghỉ | Uống nước. Không xem lại bài |
| 0:53 – 1:38 | **SD 45'** | Theo khung 5 bước (như D95). Người phỏng vấn nên cắt ngang 1–2 lần để hỏi đào sâu: *"Nếu DB chính sập thì sao?"*, *"Traffic tăng 10 lần thì cái gì vỡ trước?"* |
| 1:38 – 1:53 | **Behavioral 15'** | 3 câu × ~4' (2' kể + 2' hỏi đào sâu) |
| 1:53 – 1:58 | Hỏi ngược | Bạn hỏi người phỏng vấn 1–2 câu (chuẩn bị ở D98, hôm nay dùng bản nháp) |
| 1:58 – 2:10 | Feedback | Người phỏng vấn chấm rubric, nói 2 điểm tốt + 3 điểm cần sửa. **Bạn chỉ nghe và ghi, không tranh luận** |

### Rubric chấm điểm (thang 1–4 mỗi tiêu chí)

1 = không đạt · 2 = yếu, cần nhiều gợi ý · 3 = đạt mức Mid · 4 = tốt, tự chủ hoàn toàn.

**Coding (tối đa 16)**

| Tiêu chí | Nhìn vào đâu | Điểm |
|---|---|---|
| Correctness | Code chạy đúng các ví dụ và edge case (rỗng, 1 phần tử, trùng, số âm); ít bug; tự tìm được bug của mình | |
| Complexity | Nêu được brute force; tìm được cách tối ưu; nói đúng Big-O thời gian + bộ nhớ; giải thích được vì sao không thể tốt hơn (nếu có) | |
| Communication | Hỏi làm rõ trước khi code; nói suy nghĩ liên tục; nhận gợi ý và dùng được gợi ý | |
| Testing | Tự chạy tay ít nhất 1 ví dụ; tự đưa ra edge case; code dễ đọc (tên biến, tách hàm) | |

**System Design (tối đa 20)**

| Tiêu chí | Nhìn vào đâu | Điểm |
|---|---|---|
| Requirements | Có hỏi làm rõ; tách chức năng / phi chức năng; nói rõ phạm vi không làm | |
| Estimation | Đặt giả định rõ ràng; tính QPS/dung lượng hợp lý; **rút ra được kết luận** từ con số (không tính cho có) | |
| Design | Sơ đồ đủ thành phần chính, luồng dữ liệu rõ; API + mô hình dữ liệu hợp lý | |
| Deep-dive | Tự chọn đúng điểm khó nhất; đi sâu có cơ chế cụ thể (không chỉ gọi tên công nghệ) | |
| Trade-offs | Mỗi quyết định nêu được phương án thay thế và cái giá; nhận ra nút cổ chai / điểm lỗi đơn lẻ | |

**Behavioral (tối đa 12)**

| Tiêu chí | Nhìn vào đâu | Điểm |
|---|---|---|
| Cấu trúc + trả lời đúng câu hỏi | STAR rõ ràng, chọn đúng chuyện cho câu hỏi | |
| Ownership + số liệu | Rõ "tôi" đã làm gì; kết quả có số | |
| Reflection + thái độ | Có bài học cụ thể; không đổ lỗi; trả lời được câu hỏi đào sâu | |

**Ngưỡng tham khảo:** Coding ≥ 12/16, SD ≥ 14/20, Behavioral ≥ 9/12, và **không tiêu chí nào 1 điểm**. Tiêu chí nào 1–2 điểm → đưa vào danh sách điểm yếu ở D97.

---

## D97 (T7, 02/01): Xem lại video mock, sửa 3 điểm yếu

**⏱ Ước tính:** DSA 45' · Xem video + chọn điểm yếu 1h15' · Sửa 1h30' · Ôn ⚠️ 15' · Anki 15' · **Tổng 4h00'**

> ⚖️ Nếu làm đủ mọi thứ như viết (DSA 2–3 bài + buổi 3–4h) thì hôm nay lên gần 5h. Đã cân đối: DSA giới hạn 45' (bài mock ≤ 25' + 1 bài cùng pattern ~20'); bài chưa qua ở D92 dời sang D98 hoặc giai đoạn duy trì sau D100; Bước 3 giữ mức thấp 1,5h; Anki chỉ ôn thẻ đến hạn.

### 🧩 DSA: Làm lại bài sai trong buổi mock

- Làm lại bài coding của buổi mock từ đầu, ≤ 25', không nhìn code cũ. Làm thêm 1 bài cùng pattern trong kho đề.
- Làm lại các bài chưa qua ở D92 (nếu có) → nếu hôm nay hết giờ, dời sang D98.

### 📘 Buổi tối (3–4h): Xem lại video, liệt kê 3 điểm yếu và sửa

**Bước 1: Xem lại video (60')**, video coding + SD + behavioral dài ~105', nên xem tốc độ 1,5–1,75× và bỏ qua phần nghỉ/feedback (1,25× sẽ mất ~85'), ghi lại **mốc thời gian** mỗi khi gặp các dấu hiệu sau:

- [ ] Im lặng > 30 giây
- [ ] Nhảy vào code/vẽ kiến trúc khi chưa hỏi làm rõ
- [ ] Nói sai Big-O hoặc nói Big-O mà không giải thích
- [ ] Gọi tên công nghệ mà không nói cơ chế ("dùng Kafka" nhưng không nói vì sao)
- [ ] Bị hỏi đào sâu thì lúng túng hoặc nói vòng vo
- [ ] Từ đệm lặp lại nhiều ("ờ", "kiểu là", "thì là")
- [ ] Nói "chúng tôi" suốt trong phần behavioral
- [ ] Hết giờ mà chưa tới bước trade-off / chưa test code

**Bước 2: Chọn 3 điểm yếu quan trọng nhất (15')**, ưu tiên thứ ảnh hưởng tới kết quả (sai thuật toán, thiếu deep-dive) hơn thứ về hình thức (từ đệm). Điền vào `notes/mock-review.md`:

| # | Điểm yếu | Bằng chứng (mốc thời gian / điểm rubric) | Nguyên nhân gốc | Hành động sửa cụ thể | Kiểm lại vào |
|---|---|---|---|---|---|
| 1 | | | | | D99 |
| 2 | | | | | D99 |
| 3 | | | | | D100 |

- Ví dụ một dòng: *"SD không đi sâu được phần thanh toán"* · *mốc 1:21:30, Deep-dive 2/4* · *chưa nắm luồng webhook + idempotency* · *đọc lại mục Outbox Tuần 12 + tự vẽ lại luồng thanh toán 3 lần, mỗi lần 10'* · *D99*.
- "Hành động sửa" phải **làm được và kiểm tra được**. "Ôn thêm SD" là không đạt; "tự trình bày lại phần deep-dive thanh toán trong 10', ghi âm, nghe lại" là đạt.

**Bước 3: Sửa (1,5h; ~30' cho mỗi điểm yếu)**

- Mỗi điểm yếu: làm hành động sửa, rồi **thử lại ngay** một lần (ghi âm).
- Cập nhật thẻ Anki / cheat sheet / `notes/stories.md` nếu điểm yếu nằm ở đó.

**Bước 4 (15'):** Ôn các câu ⚠️ và các câu 0–1 điểm trong `notes/weak-spots.md` từ D92–D94.

---

## D98 (CN, 03/01): Ôn nhẹ + chuẩn bị câu hỏi hỏi ngược nhà tuyển dụng

**⏱ Ước tính:** DSA 20' · Ôn nhẹ 45' · Câu hỏi hỏi ngược 45' · Chốt tuần 13 (tuỳ chọn) 10' · Checklist 10' · **Tổng 2h10'**

**DSA:** Nghỉ, hoặc làm lại 1 bài dễ để giữ nhịp. Không làm bài mới. Nếu D97 còn bài chưa qua ở D92, làm bài đó ở đây thay cho bài dễ (≤ 20').

**Chốt tuần 13 (tuỳ chọn, 10'):** trả lời nhanh [chốt tuần 13](tuan-13.md) câu 1–3 và câu 5 (dời từ D94).

**Ôn nhẹ (45'):**
- Anki: chỉ ôn thẻ đến hạn. Không thêm thẻ mới.
- Trả lời lại lần 2 các câu 0–1 điểm trong `notes/weak-spots.md` (theo quy trình ở đầu file).
- Đọc lại một lượt `notes/tradeoff-cheatsheet.md`, `notes/stories.md` và bài giới thiệu bản thân.

**Chuẩn bị 3–5 câu hỏi để hỏi ngược nhà tuyển dụng (45')**

- **Nguyên tắc:** câu hỏi cho thấy bạn quan tâm tới **công việc thật** và **cách team làm việc**. Chọn theo người phỏng vấn: kỹ sư thì hỏi về kỹ thuật/quy trình, quản lý thì hỏi về kỳ vọng/phát triển, HR thì hỏi về quy trình tuyển và chế độ.
- **Ví dụ câu hỏi tốt** (chọn và sửa thành 3–5 câu của riêng bạn, viết vào `notes/questions-to-ask.md`):

  | Nhóm | Câu hỏi |
  |---|---|
  | Công việc | Một ngày/tuần điển hình của một Backend Developer trong team như thế nào? |
  | Công việc | Trong 3–6 tháng đầu, người ở vị trí này được kỳ vọng làm được gì thì được coi là thành công? |
  | Kỹ thuật | Hệ thống hiện tại đang gặp thách thức kỹ thuật lớn nhất là gì (scale, nợ kỹ thuật, độ ổn định)? |
  | Kỹ thuật | Code đi từ lúc commit tới production mất bao lâu, qua những bước nào? Team deploy bao lâu một lần? |
  | Kỹ thuật | Khi có sự cố production, team xử lý và rút kinh nghiệm như thế nào? Có làm post-mortem không? |
  | Quy trình | Code review ở team diễn ra thế nào? Ai quyết định thiết kế cho một tính năng lớn? |
  | Phát triển | Người mới được onboard thế nào? Có mentor hoặc buddy không? |
  | Phát triển | Kỹ sư trong team được lên level dựa trên tiêu chí gì? |
  | Sản phẩm | Sản phẩm/đội đang ưu tiên điều gì trong năm nay? |
  | Người phỏng vấn | Anh/chị thích điều gì nhất khi làm ở đây? Điều gì anh/chị muốn thay đổi? |
  | Kết thúc | Anh/chị có băn khoăn gì về hồ sơ của em mà em có thể giải thích thêm không? Các bước tiếp theo của quy trình là gì? |

- **Nên tránh:**
  - Câu mà trang web hoặc JD đã trả lời rõ (cho thấy bạn không tìm hiểu).
  - Hỏi lương, thưởng, số ngày nghỉ ngay ở vòng kỹ thuật (để dành cho vòng HR/offer).
  - Câu chỉ có "có/không".
  - Không hỏi gì ("Dạ em không có câu hỏi ạ").
- **Tài liệu:** Tech Interview Handbook (techinterviewhandbook.org), phần *Questions to ask* ở cuối buổi phỏng vấn.

**Checklist cuối tuần 14**

- [ ] Đã trả lời lại chốt tuần 1–12, mỗi tuần ≥ 8/10 (hoặc đã có kế hoạch ôn cho tuần chưa đạt)
- [ ] `notes/weak-spots.md` đã được ôn lại lần 2
- [ ] Mock SD e-commerce đã làm và tự chấm
- [ ] Mock đầy đủ đã làm, có điểm rubric
- [ ] `notes/mock-review.md` có 3 điểm yếu + hành động sửa đã làm ít nhất 1 lần
- [ ] `notes/questions-to-ask.md` có 3–5 câu hỏi
- [ ] Error List: mọi bài đã được làm lại ít nhất 1 lần

---

## D99 – D100 (T2 04/01 – T3 05/01/2027): Sẵn sàng

**Việc theo lộ trình tổng:** Mock lần cuối (1 coding + 1 SD) và nộp CV vào các công ty ưu tiên.

### D99 (T2, 04/01): Mock lần cuối

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 65' (Mock SD 45' + So điểm/ghi chú 20') · **Tổng 2h10'**

- **Giờ làm – Coding (45'):** 1 bài Medium mới, tự quay video hoặc có người phỏng vấn. Chấm bằng phần *Coding* của rubric D96.
- **Buổi tối – SD (45'):** 1 đề mới (chọn đề còn lại trong danh sách ở D96). Chấm bằng phần *System Design* của rubric D96.
- **Sau mock (20'):**
  - So điểm với D96. Ghi vào `notes/mock-review.md`: tiêu chí nào tăng, tiêu chí nào chưa.
  - Kiểm lại điểm yếu #1 và #2 của D97: đã sửa được chưa?
- **Nếu điểm vẫn dưới ngưỡng:** vẫn nộp CV theo kế hoạch. Phỏng vấn thật ở các công ty ít ưu tiên chính là buổi luyện tốt nhất; tiếp tục luyện song song trong lúc chờ lịch.

### D100 (T3, 05/01): Nộp CV vào các công ty ưu tiên

**⏱ Ước tính:** Giờ làm 20' (Anki 20') · Tối 90' (Checklist CV/GitHub/LinkedIn 45' + Nộp CV + nhắn referral 30' + Bảng theo dõi ứng tuyển 15') · **Tổng 1h50'**

**Checklist trước khi nộp**

- [ ] **CV:** bản PDF, 1 trang (tối đa 2), mọi bullet có động từ hành động + kết quả đo được (D89), không lỗi chính tả, tên file rõ ràng (ví dụ `HoTen_Backend_CV.pdf`). Có cả bản tiếng Anh nếu nộp công ty dùng tiếng Anh
- [ ] **GitHub:** repo Mini Order Service public, README đủ checklist D90, CI xanh, không commit secret/`.env`
- [ ] **LinkedIn / hồ sơ tuyển dụng:** cập nhật vị trí, kỹ năng, link GitHub, khớp với CV
- [ ] **Câu chuyện:** 5 câu chuyện STAR + bài giới thiệu 2 phút đã luyện lần cuối
- [ ] **Danh sách công ty ưu tiên:** 5–10 công ty, mỗi công ty đã đọc JD và chuẩn bị 1 câu "vì sao chọn công ty này" (🟢 T3, chuẩn bị riêng)
- [ ] **Referral:** nhắn tin cho người quen ở các công ty trong danh sách (referral thường qua vòng hồ sơ dễ hơn nộp thẳng)
- [ ] **Thứ tự nộp:** nếu chưa nộp từ tuần 12, nộp trước 2–3 công ty ít ưu tiên để lấy lịch phỏng vấn sớm, sau đó mới tới công ty ưu tiên nhất

**Bảng theo dõi ứng tuyển** (`notes/applications.md`)

| Công ty | Vị trí | Nguồn (tự nộp / referral / headhunt) | Ngày nộp | Trạng thái | Vòng tiếp theo + ngày | Ghi chú sau phỏng vấn |
|---|---|---|---|---|---|---|
| | | | | | | |

**Sau mỗi buổi phỏng vấn thật (15', làm ngay trong ngày)**

- Ghi lại mọi câu hỏi đã gặp vào `notes/interview-log.md`, đánh dấu câu trả lời chưa tốt.
- Câu nào trả lời chưa tốt → thêm thẻ Anki + đưa vào `notes/weak-spots.md`.
- Gửi email/tin nhắn cảm ơn ngắn nếu phù hợp với văn hoá công ty.

**Duy trì trong giai đoạn chờ phỏng vấn**

- Anki mỗi ngày 10–15' (không bỏ, đây là phần giữ T1 lâu dài).
- 1 bài DSA/ngày: xen kẽ bài mới và bài trong Error List.
- Mỗi tuần 1 buổi mock (coding hoặc SD).
- Sau khi có việc mới: học tiếp các phần cố ý bỏ qua trong [Phụ lục B của lộ trình tổng](../Roadmap_100_ngay.md) theo [Roadmap.md](../Roadmap.md).

**Checklist hoàn thành**

- [ ] Đã mock lần cuối (1 coding + 1 SD) và so điểm với D96
- [ ] Đã nộp CV vào các công ty ưu tiên
- [ ] Bảng theo dõi ứng tuyển đã tạo
- [ ] Hoàn thành lộ trình 100 ngày

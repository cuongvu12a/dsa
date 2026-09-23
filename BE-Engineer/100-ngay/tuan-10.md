# Tuần 10 (30/11 – 06/12): DP 1D, khung System Design, các case study đầu tiên

[← Tuần 9](tuan-09.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 11 →](tuan-11.md)

**Mục tiêu tuần:** Thuộc khung System Design 5 bước. Ước lượng được QPS và dung lượng lưu trữ. Tự giải được bài URL Shortener và Rate Limiter. Về DSA: với mọi bài DP 1D, nói được **state – công thức chuyển – trường hợp cơ sở** trước khi code.

> **Cách học theo Tier** (🔴 T1 → Anki, 🟡 T2 → bảng so sánh trong `notes/tradeoff-cheatsheet.md`, 🟢 T3 → chỉ lưu link/snippet): xem lại bảng ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Học đến đâu thì dừng theo cột *Cần nắm tới mức nào*.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Khung phỏng vấn SD 5 bước, yêu cầu chức năng vs phi chức năng, cách soát bottleneck / SPOF, kỹ thuật ước lượng nhanh (QPS, storage, bandwidth), **bậc độ lớn** của các con số latency, lũy thừa của 2, cách lập luận của từng case study (URL Shortener, Rate Limiter, ID Generator), cơ chế token bucket, race condition "đọc rồi ghi" và cách làm nguyên tử, vì sao auto-increment không đủ khi phân tán, cấu trúc Snowflake (timestamp + máy + sequence), UUID ngẫu nhiên và B-Tree, các pattern DP 1D: Fibonacci-style / chọn-hoặc-bỏ / Unbounded knapsack / LIS / DP trên chuỗi, memoization vs tabulation | Hash vs base62 counter (URL Shortener), 301 vs 302, token bucket / leaking bucket / fixed window / sliding window log / sliding window counter, vị trí đặt rate limiter, UUID vs Snowflake vs ticket server | Số latency chính xác tới từng ns, số liệu cụ thể của từng case trong sách (100 triệu URL/ngày, 365 TB…), số bit chính xác của Snowflake (41/5/5/12), cú pháp Lua/`EVAL` của Redis, tên header `X-RateLimit-*`, thuật toán LIS O(n log n) chi tiết, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

Không tính 1h tiếng Anh mỗi ngày (giữ riêng). Anki tuần này ~20'/ngày vì số thẻ tích luỹ đã lớn.

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D64 (T2) | 50' | 75' | 2h05' |
| D65 (T3) | 50' | 80' | 2h10' |
| D66 (T4) | 65' | 90' | 2h35' |
| D67 (T5) | 65' | 90' | 2h35' |
| D68 (T6) | 75' | 90' | 2h45' |
| D69 (T7) | — | 3h55' | 3h55' |
| D70 (CN) | — | 2h45' | 2h45' |

**Tổng tuần: 18h50'**

Ngày nặng nhất trong tuần làm việc là **D68** (Coin Change là bài DP 55' + bảng T2 4 cột), còn D66–D68 đều chạm trần 90' buổi tối. Vì vậy bảng *vị trí đặt rate limiter* của D67 đã được dời sang Lab D69.

---

## D64 (T2, 30/11): Khung phỏng vấn System Design 5 bước

**⏱ Ước tính:** Giờ làm 50' (DSA 30' + Anki 20') · Tối 75' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h05'**

### 🧩 DSA: [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)

- **Pattern (🔴 T1):** *DP 1D kiểu Fibonacci*. Kết quả tại bước i chỉ phụ thuộc vào vài bước ngay trước nó.
- **Khung 3 câu hỏi của mọi bài DP** (tập trả lời trước khi code):
  1. **State:** `dp[i]` = số cách để lên tới bậc i.
  2. **Công thức chuyển:** bước cuối cùng là 1 bậc hoặc 2 bậc → `dp[i] = dp[i-1] + dp[i-2]`.
  3. **Base case:** `dp[0] = 1` (đứng yên cũng là 1 cách), `dp[1] = 1`.
- **Các cách:**
  1. Đệ quy thuần → O(2ⁿ), vì cây đệ quy tính lại cùng một bài con nhiều lần.
  2. Đệ quy + memo (top-down) → O(n) thời gian, O(n) bộ nhớ (memo + call stack).
  3. Tabulation (bottom-up) → O(n) thời gian, O(n) bộ nhớ.
  4. Chỉ giữ 2 biến → O(n) thời gian, O(1) bộ nhớ.
- **Key insight:** DP = đệ quy **có bài con chồng lấn** (overlapping subproblems) + **cấu trúc con tối ưu** (optimal substructure). Thiếu điều kiện thứ nhất thì chỉ là chia để trị, không cần DP.

### 📘 Bài học buổi tối: Khung phỏng vấn SD 5 bước, yêu cầu chức năng vs phi chức năng

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Khung 5 bước: Requirements → Estimation → High-level design → Deep dive → Trade-off/bottleneck | 🔴 T1 | Nói được tên 5 bước, mục đích từng bước và thời lượng (xem bảng bên dưới) mà không nhìn | `system design interview framework`, `alex xu 4 step framework` |
| 2 | Yêu cầu chức năng (functional): hệ thống **làm gì** | 🔴 T1 | Viết được 3–5 use case dạng "User có thể…" cho một đề bất kỳ | `functional vs non functional requirements system design` |
| 3 | Yêu cầu phi chức năng (non-functional): hệ thống làm **tốt tới mức nào** | 🔴 T1 | Kể được 5–7 loại và biến mỗi loại thành con số đo được | `non functional requirements scalability availability latency` |
| 4 | Câu hỏi làm rõ phạm vi (scope) | 🔴 T1 | Có sẵn một danh sách câu hỏi mở màn dùng cho mọi đề (xem bên dưới) | `system design clarifying questions` |
| 5 | Những lỗi hay gặp: nhảy vào vẽ ngay, im lặng suy nghĩ quá lâu, over-engineering, không nói trade-off | 🔴 T1 | Tự nhận ra được khi mình đang mắc lỗi | `system design interview common mistakes` |
| 6 | Các khối xây dựng (building block): LB, cache, DB, queue, CDN, object storage | 🔴 T1 | Đã học ở Tuần 8–9. Chỉ cần biết khối nào giải quyết vấn đề gì | `system design building blocks` |
| 7 | Cách vẽ sơ đồ trên bảng: hộp + mũi tên + hướng luồng dữ liệu | 🟢 T3 | Không cần công cụ. Tập vẽ tay cho nhanh | — |
| 8 | Soát **bottleneck & SPOF** ở bước 5: đi qua từng hộp trong sơ đồ và hỏi "hộp này chết thì sao?", "traffic ×10 thì hộp nào vỡ trước?" | 🔴 T1 | Với sơ đồ Client → LB → App → Cache → DB, chỉ ra được SPOF và cách khắc phục từng cái | `system design identify bottlenecks single point of failure` |

**Chi tiết cần hiểu**

- **Khung 5 bước và cách chia 45 phút** (sách Alex Xu dùng 4 bước; lộ trình này tách "Estimation" ra riêng cho dễ luyện):

  | Bước | Thời lượng | Việc làm | Đầu ra |
  |---|---|---|---|
  | 1. Requirements | 5–8' | Hỏi làm rõ; chốt 3–5 functional + 3–5 non-functional; nói rõ cái gì **không** làm | Danh sách yêu cầu viết lên góc bảng |
  | 2. Estimation | 3–5' | DAU → QPS (trung bình + cao điểm), storage, bandwidth, tỷ lệ đọc/ghi | 3–4 con số làm tròn |
  | 3. High-level design | 10–15' | API chính, data model, sơ đồ khối. **Xin người phỏng vấn đồng ý** trước khi đi sâu | Sơ đồ end-to-end chạy được |
  | 4. Deep dive | 10–15' | Đào 1–2 thành phần khó nhất (thường người phỏng vấn gợi ý) | Thiết kế chi tiết + lựa chọn có lý do |
  | 5. Trade-off / bottleneck | 3–5' | Điểm nghẽn, single point of failure, nếu traffic ×10 thì sửa gì, monitoring | Danh sách "nếu có thêm thời gian" |

- **Yêu cầu phi chức năng hay gặp (mục 3)** và cách biến thành số:
  - **Scalability:** chịu được bao nhiêu DAU / QPS lúc cao điểm.
  - **Availability:** 99,9% hay 99,99%? (sẽ tính ra phút ở Tuần 12).
  - **Latency:** p99 < 200 ms cho thao tác đọc.
  - **Consistency:** dữ liệu cần mới ngay (strong) hay chấp nhận trễ vài giây (eventual)?
  - **Durability:** mất dữ liệu có chấp nhận được không (log click thì được, đơn hàng thì không).
  - Ngoài ra: security, cost, khả năng vận hành (maintainability).
- **Danh sách câu hỏi mở màn (mục 4), dùng được cho mọi đề:**
  1. Người dùng là ai? Bao nhiêu DAU? Có tăng trưởng đột biến không?
  2. Tính năng cốt lõi nào **bắt buộc** phải có? Tính năng nào để sau?
  3. Tỷ lệ đọc/ghi thế nào?
  4. Web, mobile hay cả hai? Có cần toàn cầu (multi-region) không?
  5. Ưu tiên consistency hay availability?
  6. Dữ liệu giữ bao lâu?
- **Vì sao không nhảy vào vẽ ngay:** đề SD cố tình mơ hồ. Người phỏng vấn chấm cả **cách bạn thu hẹp bài toán**. Vẽ ngay thì dễ giải sai bài (ví dụ thiết kế cho 1 tỷ user khi đề chỉ cần 100 nghìn), và mọi lựa chọn phía sau không có căn cứ.
- **Bước 3 luôn mở đầu bằng API + data model:** viết 2–3 endpoint chính (method, path, tham số, response) và 1–2 bảng chính (khoá chính, cột dùng để truy vấn) **trước** khi vẽ hộp. Tỷ lệ đọc/ghi ở bước 2 quyết định bạn tối ưu đường nào (đọc nhiều → cache, replica; ghi nhiều → queue, sharding).
- **Soát bottleneck/SPOF (mục 8):** LB một bản → chạy cặp active-passive; app server → stateless + nhiều bản; cache → cluster/replica, và nói rõ cache chết thì DB có chịu nổi không; DB → replica + failover, quá tải ghi thì sharding. Nói được "nếu có thêm thời gian, tôi sẽ thêm monitoring cho X" là điểm cộng.

**🔴 Thẻ Anki (T1)**

1. Kể 5 bước của khung SD và thời lượng mỗi bước trong 45 phút.
2. Functional khác non-functional requirement thế nào? Mỗi loại cho 2 ví dụ.
3. Kể 5 yêu cầu phi chức năng và cách biến mỗi cái thành con số đo được.
4. Nêu 4 câu hỏi mở màn dùng cho mọi đề SD.
5. (DSA-Pattern) Dấu hiệu nào cho thấy một bài nên dùng DP? → bài con chồng lấn + cấu trúc con tối ưu; đề hỏi "số cách", "min/max", "có thể hay không".

**🟢 Tra cứu (T3):** mẫu template SD trên trang ByteByteGo (bytebytego.com), các cheat sheet building block.

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 3** (*A Framework for System Design Interviews*)
- ByteByteGo (YouTube): video về cách tiếp cận một buổi phỏng vấn System Design
- NeetCode: video giải *Climbing Stairs* (mở đầu mục 1-D Dynamic Programming)

**❓ Câu hỏi cuối bài**

1. Kể 5 bước và cách chia thời gian trong 45 phút.
2. Kể 5 yêu cầu phi chức năng hay gặp.
3. Vì sao không nên nhảy vào vẽ kiến trúc ngay từ đầu?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Đề "Thiết kế Instagram": nêu 4 câu hỏi làm rõ đầu tiên và cho biết câu trả lời của mỗi câu **thay đổi thiết kế** thế nào. Viết 2 yêu cầu chức năng và 2 yêu cầu phi chức năng có con số.
5. Sơ đồ Client → LB → App server → Redis → PostgreSQL: SPOF nằm ở đâu? Traffic tăng ×10 thì thành phần nào vỡ trước và bạn sửa gì?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Requirements (5–8') → Estimation (3–5') → High-level design (10–15') → Deep dive (10–15') → Trade-off/bottleneck (3–5').
- Mỗi bước có đầu ra: danh sách yêu cầu, 3–4 con số, sơ đồ + API + data model, thiết kế chi tiết 1–2 thành phần, danh sách điểm nghẽn.
- Xin người phỏng vấn đồng ý sơ đồ tổng trước khi đi sâu.

**Câu 2.**
- Scalability (QPS cao điểm), availability (99,9%), latency (p99 < 200 ms), consistency (strong/eventual), durability (được mất dữ liệu không).
- Mỗi yêu cầu phải biến thành **con số đo được**, không nói chung chung "hệ thống phải nhanh".

**Câu 3.**
- Đề cố tình mơ hồ; người phỏng vấn chấm cả cách thu hẹp phạm vi.
- Vẽ ngay dễ giải sai quy mô (over-engineering hoặc thiếu), các lựa chọn phía sau không có căn cứ.
- Mất cơ hội thống nhất "cái gì không làm".

**Câu 4.**
- Ví dụ câu hỏi: DAU bao nhiêu? Tính năng cốt lõi (đăng ảnh, feed, follow) hay cả story/chat? Tỷ lệ đọc/ghi? Toàn cầu hay một region?
- Ảnh hưởng: DAU → số server, có cần sharding; đọc ≫ ghi → cache + CDN; toàn cầu → multi-region, CDN.
- Functional dạng "User có thể đăng ảnh / xem feed"; non-functional dạng "feed p99 < 300 ms", "ảnh không bao giờ mất".

**Câu 5.**
- SPOF: LB đơn, Redis đơn, PostgreSQL primary đơn.
- ×10: thường DB vỡ trước (ghi hoặc kết nối) → cache nhiều hơn, read replica, connection pool, sau cùng mới sharding; app server stateless thì chỉ cần thêm bản.
- Redis chết → toàn bộ tải đổ xuống DB (cache stampede) → Redis có replica/cluster.

</details>

---

## D65 (T3, 01/12): Ước lượng nhanh (back-of-the-envelope)

**⏱ Ước tính:** Giờ làm 50' (DSA 30' + Anki 20') · Tối 80' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h10'**

### 🧩 DSA: [746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)

- **Pattern (🔴 T1):** *DP 1D kiểu Fibonacci, dạng tối ưu (min)*. Giống bài 70 nhưng thay "cộng số cách" bằng "lấy min chi phí".
- **Gợi ý DP:**
  - **State:** `dp[i]` = chi phí nhỏ nhất để **đứng ở** bậc i (đỉnh cầu thang là bậc `n`, nằm ngoài mảng).
  - **Công thức chuyển:** `dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])`.
  - **Base case:** `dp[0] = dp[1] = 0` (được chọn xuất phát ở bậc 0 hoặc 1 miễn phí).
  - Đáp án: `dp[n]`.
- **Độ phức tạp:** O(n) thời gian; O(1) bộ nhớ nếu chỉ giữ 2 biến.
- **Lỗi hay gặp:** hiểu sai "đỉnh" là bậc `n-1`. Viết ví dụ nhỏ `cost = [10, 15, 20]` ra giấy (đáp án 15) trước khi code.

### 📘 Bài học buổi tối: Ước lượng QPS, dung lượng, băng thông, các con số latency

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Công thức DAU → QPS trung bình → QPS cao điểm | 🔴 T1 | Tính nhẩm được trong 1 phút (xem bên dưới) | `back of the envelope estimation QPS` |
| 2 | Mẹo làm tròn: 1 ngày ≈ 86.400 s ≈ 10⁵ s | 🔴 T1 | Dùng được mà không cần máy tính | `seconds in a day estimation trick` |
| 3 | Ước lượng dung lượng: số bản ghi × kích thước × thời gian giữ (× số bản sao) | 🔴 T1 | Tính được storage cho 1 năm và 5 năm | `storage estimation system design` |
| 4 | Ước lượng băng thông: QPS × kích thước response | 🔴 T1 | Phân biệt được băng thông vào (ghi) và ra (đọc) | `bandwidth estimation system design` |
| 5 | Lũy thừa của 2: KB, MB, GB, TB, PB | 🔴 T1 | Thuộc bảng bên dưới | `power of two table system design` |
| 6 | **Bậc độ lớn** của các con số latency | 🔴 T1 | Thuộc thứ tự và bậc (ns / µs / ms), không cần số chính xác | `latency numbers every programmer should know` |
| 7 | Số latency chính xác từng loại phần cứng | 🟢 T3 | Bỏ qua. Số thay đổi theo đời phần cứng | — |
| 8 | Bảng availability (99% / 99,9% / 99,99%) | 🔴 T1 | Học kỹ ở D81. Hôm nay chỉ cần biết mỗi "số 9" giảm downtime 10 lần | `availability nines table` |

**Chi tiết cần hiểu**

- **Công thức QPS (mục 1):**
  - QPS trung bình = (DAU × số request mỗi người mỗi ngày) / 86.400.
  - QPS cao điểm ≈ 2–3 × QPS trung bình (sách Alex Xu dùng hệ số 2; hệ thống có giờ cao điểm rõ rệt như đặt đồ ăn có thể dùng 5–10).
  - Ví dụ: 10 triệu DAU × 10 request = 10⁸ request/ngày; 10⁸ / 10⁵ ≈ **1.000 QPS** (tính chính xác ≈ 1.157). Cao điểm ≈ **2.000–3.500 QPS**.
- **Dung lượng (mục 3):** 1 tỷ URL × 500 byte = 5 × 10¹¹ byte = **500 GB**. Nếu có 3 bản sao (replication) thì ≈ 1,5 TB. Luôn nói rõ bạn có tính replication/index hay không.
- **Lũy thừa của 2 (mục 5):**

  | Lũy thừa | Giá trị xấp xỉ | Tên |
  |---|---|---|
  | 2¹⁰ | 1 nghìn (10³) | 1 KB |
  | 2²⁰ | 1 triệu (10⁶) | 1 MB |
  | 2³⁰ | 1 tỷ (10⁹) | 1 GB |
  | 2⁴⁰ | 1 nghìn tỷ (10¹²) | 1 TB |
  | 2⁵⁰ | 10¹⁵ | 1 PB |

  Kích thước hay dùng: 1 ký tự ASCII = 1 byte; `BIGINT` / timestamp = 8 byte; UUID = 16 byte; một bản ghi "bình thường" vài trăm byte; ảnh vài trăm KB; video vài MB đến vài trăm MB.

- **Bảng latency (mục 6), chỉ cần nhớ bậc độ lớn** (số gốc từ bảng kinh điển của Jeff Dean / Peter Norvig; phần cứng hiện nay nhanh hơn, nhưng thứ tự không đổi):

  | Thao tác | Bậc độ lớn | Ghi nhớ |
  |---|---|---|
  | Truy cập L1 cache | ~1 ns | |
  | Truy cập L2 cache | ~5–10 ns | |
  | Khoá/mở mutex | ~25–100 ns | |
  | Đọc RAM (main memory) | ~100 ns | mốc 1 |
  | Nén 1 KB (thuật toán nhanh) | ~vài µs | |
  | Gửi 1 KB qua mạng 1 Gbps | ~10 µs | |
  | Đọc ngẫu nhiên 4 KB từ SSD | ~100 µs | mốc 2: chậm hơn RAM ~1.000 lần |
  | Round-trip trong cùng datacenter | ~500 µs (0,5 ms) | mốc 3 |
  | Đọc tuần tự 1 MB từ SSD | ~1 ms | |
  | Seek đĩa cứng (HDD) | ~10 ms | |
  | Đọc tuần tự 1 MB từ HDD | ~20 ms | |
  | Gói tin đi vòng liên lục địa (ví dụ Mỹ ↔ châu Âu ↔ Mỹ) | ~150 ms | mốc 4 |

  **Kết luận cần rút ra:** RAM nhanh hơn SSD khoảng 3 bậc (10³). Mạng nội bộ datacenter chậm hơn RAM khoảng 3–4 bậc nhưng vẫn nhanh hơn seek HDD. Gọi liên lục địa đắt nhất → đây là lý do có CDN và multi-region. Đọc tuần tự nhanh hơn đọc ngẫu nhiên rất nhiều (lý do Kafka, WAL ghi tuần tự).

**🔴 Thẻ Anki (T1)**

1. Công thức tính QPS trung bình và QPS cao điểm từ DAU?
2. Một ngày có khoảng bao nhiêu giây? Làm tròn thế nào cho dễ tính nhẩm?
3. 2¹⁰, 2²⁰, 2³⁰, 2⁴⁰ xấp xỉ bằng bao nhiêu?
4. Đọc RAM, đọc SSD ngẫu nhiên, round-trip trong datacenter, round-trip liên lục địa: mỗi cái ở bậc nào?
5. Vì sao ghi tuần tự (append-only log) lại nhanh?
6. (DSA-Pattern) Bài "chi phí nhỏ nhất để đi tới cuối, mỗi bước đi 1 hoặc 2" → DP 1D kiểu Fibonacci, lấy min.

**🟢 Tra cứu (T3):** bảng *Latency Numbers Every Programmer Should Know* (bản gốc của Jeff Dean, có nhiều bản cập nhật theo năm), bảng availability "nines".

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 2** (*Back-of-the-envelope Estimation*)
- ByteByteGo (YouTube): video về latency numbers và back-of-the-envelope estimation

**❓ Câu hỏi cuối bài**

1. 10 triệu người dùng/ngày, mỗi người 10 request/ngày. QPS trung bình và QPS lúc cao điểm là bao nhiêu?
2. Lưu 1 tỷ URL, mỗi URL 500 byte thì cần bao nhiêu dung lượng?
3. Đọc từ RAM, SSD và qua mạng nội bộ datacenter chênh nhau bao nhiêu bậc?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. QPS đọc lúc cao điểm là 3.000, mỗi response trung bình 50 KB. Băng thông ra cần khoảng bao nhiêu? Vì sao nên tính riêng băng thông vào và ra?
5. Dựa vào bảng latency, giải thích vì sao Kafka/WAL ghi tuần tự lại nhanh và vì sao hệ thống toàn cầu cần CDN/multi-region.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- 10⁷ × 10 = 10⁸ request/ngày; chia 10⁵ s → **~1.000 QPS** (chính xác ~1.157).
- Cao điểm ×2–3 → **~2.000–3.500 QPS**; nói rõ hệ số chọn và lý do.

**Câu 2.**
- 10⁹ × 500 B = 5 × 10¹¹ B = **500 GB**.
- Nêu giả định: ×3 bản sao → ~1,5 TB; chưa tính index.

**Câu 3.**
- RAM ~100 ns, SSD đọc ngẫu nhiên ~100 µs (chậm hơn ~10³), round-trip datacenter ~500 µs.
- Kết luận: RAM ≫ SSD ≈ mạng nội bộ; cache trong RAM đáng giá.

**Câu 4.**
- 3.000 × 50 KB = 150 MB/s ≈ **1,2 Gbps**.
- Vào (ghi) và ra (đọc) thường chênh nhau rất nhiều theo tỷ lệ đọc/ghi; chi phí băng thông ra (egress) và CDN phụ thuộc vào con số ra.

**Câu 5.**
- Đọc/ghi tuần tự nhanh hơn ngẫu nhiên nhiều bậc (HDD tránh seek ~10 ms; SSD cũng thích truy cập tuần tự) → append-only log.
- Round-trip liên lục địa ~150 ms, đắt nhất bảng → đưa dữ liệu lại gần người dùng (CDN, multi-region).

</details>

---

## D66 (T4, 02/12): Case study URL Shortener

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 90' (Học 40' + Bảng T2 20' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h35'**

> *Khung tự giải 45'* bên dưới **không** làm tối nay: đó là Bước 1 của Lab D69. Tối nay chỉ đọc chương 8 + điền 2 bảng T2 (mỗi bảng ~10').

### 🧩 DSA: [198. House Robber](https://leetcode.com/problems/house-robber/)

- **Pattern (🔴 T1):** *DP 1D "chọn hoặc bỏ" (take / skip)*. Tại mỗi phần tử có hai lựa chọn, và lựa chọn này ràng buộc phần tử kề bên.
- **Gợi ý DP:**
  - **State:** `dp[i]` = số tiền lớn nhất khi chỉ xét các nhà `0..i`.
  - **Công thức chuyển:** bỏ nhà i → `dp[i-1]`; lấy nhà i → `dp[i-2] + nums[i]`. Vậy `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.
  - **Base case:** `dp[0] = nums[0]`, `dp[1] = max(nums[0], nums[1])`.
- **Độ phức tạp:** O(n) thời gian, O(1) bộ nhớ với 2 biến `prev2`, `prev1`.
- **Key insight:** mọi bài "không được chọn hai phần tử kề nhau" đều là khung này. Nhận ra khung "take/skip" quan trọng hơn nhớ code.

### 📘 Bài học buổi tối: Case URL Shortener

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Áp khung 5 bước vào một đề cụ thể | 🔴 T1 | Tự đi hết 5 bước trong 45' (xem *Khung tự giải* bên dưới) | `design url shortener system design interview` |
| 2 | API: `POST /api/v1/data/shorten` và `GET /{shortCode}` | 🔴 T1 | Viết được 2 endpoint, request/response | `url shortener api design` |
| 3 | Độ dài mã ngắn: 62ⁿ ≥ số URL cần lưu | 🔴 T1 | Tự tính được vì sao 7 ký tự base62 là đủ (62⁷ ≈ 3,5 nghìn tỷ) | `base62 short url length calculation` |
| 4 | **Hash + xử lý va chạm** vs **base62 của bộ đếm/ID duy nhất** | 🟡 T2 | Điền bảng so sánh bên dưới | `url shortener hash vs base62`, `hash collision bloom filter url shortener` |
| 5 | **301 vs 302** redirect | 🟡 T2 | Điền bảng so sánh bên dưới | `301 vs 302 redirect url shortener analytics` |
| 6 | Scale phần đọc: cache mapping nóng, đọc nhiều hơn ghi rất nhiều | 🔴 T1 | Giải thích được luồng đọc: cache → DB → ghi lại cache (cache-aside, Tuần 8) | `url shortener read heavy cache` |
| 7 | Bloom filter để kiểm tra "mã đã tồn tại chưa" | 🔴 T1 | Biết nó trả lời "chắc chắn không có" hoặc "có thể có" (có false positive, không có false negative) | `bloom filter explained` |
| 8 | Số liệu cụ thể của ví dụ trong sách (100 triệu URL/ngày, 10 năm, 365 TB) | 🟢 T3 | Không học thuộc. Tự tính lại theo giả định của mình | — |

**Chi tiết cần hiểu**

- **Hai hướng sinh mã (mục 4):**
  - **Hash:** băm URL dài (CRC32, MD5, SHA-1), lấy 7 ký tự đầu. Bị va chạm thì nối thêm một chuỗi rồi băm lại cho tới khi không trùng. Kiểm tra trùng mỗi lần phải query DB → dùng Bloom filter cho nhanh. Cùng một URL dài luôn cho cùng mã (nếu không có va chạm).
  - **Base62 của ID duy nhất:** lấy một ID tăng dần (từ bộ sinh ID phân tán, xem D68), đổi sang hệ 62 (`0-9a-zA-Z`). Không bao giờ va chạm. Nhược điểm: phụ thuộc vào bộ sinh ID; mã dễ đoán được (có thể liệt kê tuần tự); độ dài mã tăng dần theo ID.
- **Redirect (mục 5):** 301 = chuyển hướng vĩnh viễn, trình duyệt cache lại nên lần sau không gọi server nữa → giảm tải nhưng mất số liệu click. 302 = tạm thời, mọi lần click đều đi qua server → đếm được analytics nhưng tải cao hơn.
- **Data model tối thiểu:** bảng `url(id, short_code UNIQUE, long_url, created_at, expire_at?)`. Tỷ lệ đọc/ghi thường ~10:1 hoặc cao hơn → thiết kế ưu tiên đường đọc.

**🟡 Bảng so sánh T2: Hash + collision vs Base62 counter**

Nhóm: *sinh định danh (ID generation)*. Nhóm này không có sẵn trong bảng tra của `Prompt_Phan_Loai_Tier.md`; trục chính tự xác định: **tính duy nhất & không phụ thuộc hệ thống khác** vs **tính khó đoán & độ dài cố định**.

| Tiêu chí | Hash + xử lý va chạm | Base62 của ID duy nhất |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Khả năng va chạm & chi phí kiểm tra | | |
| Ext: Có đoán/liệt kê được mã không? | | |
| Ext: Phụ thuộc thành phần nào khác? | | |

**🟡 Bảng so sánh T2: 301 vs 302**

Nhóm: *protocol/API design*. Trục chính: **giảm tải (caching behavior)** vs **thu thập dữ liệu (analytics)**.

| Tiêu chí | 301 Moved Permanently | 302 Found |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Caching behavior của trình duyệt | | |
| Ext: Đếm click được không? | | |

**📝 Khung tự giải 45': URL Shortener**

- [ ] **1. Requirements (5–8')**
  - Chức năng: rút gọn URL dài; redirect từ mã ngắn; có cho tự đặt alias (custom alias) không? Có hết hạn không? Có cần thống kê click không?
  - Phi chức năng: redirect latency thấp (p99 bao nhiêu?); availability cao (link hỏng thì mọi chỗ đã dán link đều hỏng); mã ngắn không được trùng; có cần khó đoán không?
  - Hỏi: bao nhiêu URL mới mỗi ngày? Tỷ lệ đọc/ghi? Giữ dữ liệu bao lâu?
- [ ] **2. Estimation (3–5')**
  - QPS ghi = số URL mới/ngày / 10⁵; QPS đọc = QPS ghi × tỷ lệ đọc/ghi.
  - Tổng số bản ghi = URL/ngày × 365 × số năm → suy ra độ dài mã (62ⁿ).
  - Storage = tổng bản ghi × kích thước một bản ghi.
- [ ] **3. High-level design (10–15')**
  - 2 API: shorten, redirect.
  - Sơ đồ: Client → LB → Web server (stateless) → Cache → DB.
  - Data model bảng `url`.
- [ ] **4. Deep dive (10–15')**
  - Chọn hash hay base62, lý do. Xử lý va chạm hoặc nguồn ID ở đâu.
  - Chọn 301 hay 302, lý do.
  - Luồng đọc có cache; tỷ lệ cache hit kỳ vọng.
- [ ] **5. Trade-off / bottleneck (3–5')**
  - DB là điểm nghẽn? → read replica, sharding theo `short_code`.
  - Chống lạm dụng: rate limit API shorten (nối sang D67).
  - Analytics tách ra luồng bất đồng bộ (queue) để không làm chậm redirect.

**🔴 Thẻ Anki (T1)**

1. Vì sao 7 ký tự base62 là đủ cho hàng trăm tỷ URL?
2. Bloom filter trả lời được câu hỏi gì? Có loại sai nào?
3. Luồng đọc của URL Shortener đi qua những thành phần nào?
4. (T2) Khi nào chọn base62 của counter thay vì hash?
5. (T2) Khi nào chọn 302 thay vì 301?
6. (DSA-Pattern) Bài "không được chọn hai phần tử kề nhau, tối đa hoá tổng" → DP take/skip: `dp[i] = max(dp[i-1], dp[i-2] + x)`.

**🟢 Tra cứu (T3):** bảng ký tự base62, danh sách mã HTTP 3xx (MDN).

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 8** (*Design a URL Shortener*)
- ByteByteGo (YouTube): video về thiết kế URL shortener

**❓ Câu hỏi cuối bài**

1. Sinh mã ngắn bằng hash hay bằng base62 của một bộ đếm? Trade-off là gì?
2. Redirect bằng 301 hay 302? Khác nhau thế nào?
3. Scale phần đọc bằng cách nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Vì sao 7 ký tự base62 là đủ? Nếu chỉ dùng 6 ký tự với 100 triệu URL mới mỗi ngày thì dùng được khoảng bao lâu?
5. Bloom filter báo "có thể có" cho một mã vừa sinh: bạn làm gì tiếp? Nếu nó báo "không có" thì có cần hỏi DB nữa không? Vì sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Hash: không cần bộ sinh ID, cùng URL cho cùng mã; nhưng có va chạm → kiểm tra DB/Bloom filter, băm lại.
- Base62 của ID: không va chạm, đơn giản; nhưng phụ thuộc bộ sinh ID phân tán, mã đoán/liệt kê được, độ dài tăng dần.
- Chọn theo yêu cầu: cần khó đoán → hash (hoặc ID + xáo trộn); cần đơn giản, không trùng → base62.

**Câu 2.**
- 301 vĩnh viễn → trình duyệt cache, giảm tải server, mất analytics.
- 302 tạm thời → mọi click đi qua server, đếm được click, tải cao hơn.
- Cần thống kê click → 302.

**Câu 3.**
- Đọc ≫ ghi: cache-aside (Redis) cho mapping nóng, đường đọc cache → DB → ghi lại cache.
- Web server stateless sau LB; read replica cho DB; shard theo `short_code` khi lớn.
- Tách analytics sang queue để không làm chậm redirect.

**Câu 4.**
- 62⁷ ≈ 3,5 × 10¹² > vài trăm tỷ URL (100 triệu/ngày × 10 năm ≈ 3,65 × 10¹¹).
- 62⁶ ≈ 5,7 × 10¹⁰ → chia 10⁸/ngày ≈ **570 ngày (~1,5 năm)** → không đủ cho 10 năm.

**Câu 5.**
- "Có thể có" (có thể false positive) → hỏi DB để chắc chắn; trùng thật thì sinh mã khác.
- "Không có" là **chắc chắn** không có (không có false negative) → bỏ qua bước hỏi DB, tiết kiệm phần lớn truy vấn.

</details>

---

## D67 (T5, 03/12): Case study Rate Limiter

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 90' (Học 45' + Bảng T2 15' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h35'**

> Tối nay chỉ điền bảng *5 thuật toán rate limiting*. Bảng *vị trí đặt rate limiter* **dời sang Lab D69** (10'), lúc bạn đang tự đặt middleware nên điền sẽ dễ hơn. *Khung tự giải 45'* dùng để luyện cho câu 1 Chốt tuần (D70).

### 🧩 DSA: [213. House Robber II](https://leetcode.com/problems/house-robber-ii/)

- **Pattern (🔴 T1):** *DP take/skip + phá vòng tròn*. Nhà đầu và nhà cuối kề nhau → không thể lấy cả hai.
- **Gợi ý:** chạy lại hàm của bài 198 **hai lần**: một lần trên `nums[0..n-2]` (bỏ nhà cuối), một lần trên `nums[1..n-1]` (bỏ nhà đầu). Đáp án là max của hai kết quả.
- **Edge case:** `n = 1` → trả về `nums[0]` (nếu không xử lý riêng, cả hai đoạn đều rỗng).
- **Độ phức tạp:** O(n) thời gian, O(1) bộ nhớ.
- **Key insight:** kỹ thuật "tách bài vòng tròn thành hai bài đường thẳng" dùng lại được ở nhiều bài khác.

### 📘 Bài học buổi tối: Case Rate Limiter

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Rate limiter để làm gì: chống DoS/lạm dụng, bảo vệ tài nguyên, giảm chi phí gọi API bên thứ ba | 🔴 T1 | Kể được 3 lý do | `why rate limiting` |
| 2 | Cơ chế **token bucket**: dung lượng bucket (burst) + tốc độ nạp (refill rate) | 🔴 T1 | Mô phỏng được bằng tay: bucket 4 token, nạp 2 token/giây, 6 request đến cùng lúc thì bao nhiêu request qua? | `token bucket algorithm explained` |
| 3 | Các thuật toán còn lại: leaking bucket, fixed window counter, sliding window log, sliding window counter | 🟡 T2 | Điền bảng so sánh bên dưới | `rate limiting algorithms comparison`, `sliding window counter rate limiter` |
| 4 | Vấn đề biên cửa sổ (boundary burst) của fixed window | 🔴 T1 | Giải thích được vì sao limit 5 req/phút có thể cho qua 10 request trong 1 phút | `fixed window rate limiter boundary problem` |
| 5 | Đặt rate limiter ở đâu: client, middleware trong server, API gateway | 🟡 T2 | Nêu được ưu/nhược mỗi vị trí và vì sao không tin client | `where to put rate limiter api gateway` |
| 6 | Khoá (key) để giới hạn: user ID, API key, IP | 🔴 T1 | Biết giới hạn theo IP gặp vấn đề với NAT (nhiều người chung IP) | `rate limit by ip vs user` |
| 7 | Rate limit phân tán: bộ đếm dùng chung trong Redis; **race condition "đọc rồi ghi"** | 🔴 T1 | Giải thích được vì sao phải làm nguyên tử và 2 cách làm (xem bên dưới) | `distributed rate limiter redis race condition` |
| 8 | Phản hồi khi bị chặn: HTTP 429, header báo còn bao nhiêu lượt | 🟢 T3 | Biết mã 429 và header `Retry-After`; tên header `X-RateLimit-*` thì tra khi cần | `http 429 retry-after` |
| 9 | Hard vs soft limit, fail-open vs fail-closed khi Redis chết | 🔴 T1 | Trả lời được: Redis sập thì cho qua hết hay chặn hết? Tuỳ API | `rate limiter fail open` |

**Chi tiết cần hiểu**

- **Token bucket (mục 2):** mỗi key có một bucket chứa tối đa `capacity` token. Token được nạp thêm đều đặn `rate` token/giây, không vượt quá `capacity`. Mỗi request lấy 1 token; hết token thì bị từ chối. `capacity` quyết định **burst** tối đa, `rate` quyết định **tốc độ trung bình**. Không cần timer nạp token: chỉ cần lưu `tokens` và `last_refill_ts`, lúc có request thì tính `tokens = min(capacity, tokens + (now - last_ts) × rate)`.
- **Sliding window counter (mục 3):** ước lượng số request trong cửa sổ trượt = `số request cửa sổ hiện tại + số request cửa sổ trước × tỷ lệ phần cửa sổ trước còn nằm trong cửa sổ trượt`. Tiết kiệm bộ nhớ hơn sliding window log, chính xác xấp xỉ.
- **Race condition (mục 7):** hai server cùng đọc `counter = 4` (limit 5), cùng thấy "còn lượt", cùng ghi `5` → thực tế cho qua 6 request. Nguyên nhân: *đọc – quyết định – ghi* không nguyên tử. Cách xử lý:
  1. **Lua script** trong Redis: Redis chạy cả script như một lệnh duy nhất, không lệnh nào chen vào giữa. Đây là cách phổ biến nhất.
  2. Lệnh nguyên tử sẵn có như `INCR` (đủ cho fixed window: `INCR` rồi so sánh kết quả trả về).
  3. `WATCH` + `MULTI/EXEC` (optimistic locking). Lưu ý: `MULTI/EXEC` **một mình** chỉ gom các lệnh chạy liền nhau; bạn không đọc được giá trị giữa transaction để ra quyết định, nên logic "đọc rồi quyết định" vẫn cần `WATCH` hoặc Lua.
- **Bộ đếm phân tán khi Redis thành nút nghẽn (mục 7):** mọi request đều gọi Redis thêm ~1 round-trip. Khi tải rất lớn:
  - Shard bộ đếm theo key (Redis Cluster): mỗi user rơi vào một node, không cần phối hợp giữa các node.
  - Đếm **cục bộ** trong memory của từng instance rồi đồng bộ định kỳ lên Redis (vài trăm ms): nhanh, nhưng chấp nhận vượt limit một chút. Dùng cho limit "mềm", không dùng cho limit liên quan tới tiền.
  - Multi-region: mỗi region đếm riêng (limit chia theo region) hoặc đồng bộ bất đồng bộ, chấp nhận sai số.

**🟡 Bảng so sánh T2: các thuật toán rate limiting**

Nhóm: *thuật toán kiểm soát lưu lượng (traffic shaping)*, nhóm khác, không có trong bảng tra. Trục chính tự xác định: **độ chính xác** vs **bộ nhớ/độ đơn giản**, và **có cho burst hay không**.

| Tiêu chí | Token bucket | Leaking bucket | Fixed window counter | Sliding window log | Sliding window counter |
|---|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | | |
| Core: Trade-off chính | | | | | |
| Core: Khi nào KHÔNG dùng | | | | | |
| Ext: Cho phép burst? | | | | | |
| Ext: Độ chính xác tại biên cửa sổ | | | | | |
| Ext: Bộ nhớ mỗi key | | | | | |

**🟡 Bảng so sánh T2: vị trí đặt rate limiter** *(điền ở Lab D69, Bước 3)*

Nhóm: *deployment/infra strategy*. Trục chính: **mức độ kiểm soát** vs **độ phức tạp vận hành**.

| Tiêu chí | Phía client | Middleware trong service | API Gateway |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Tin cậy được không (client có thể giả mạo)? | | | |
| Ext: Linh hoạt theo logic nghiệp vụ | | | |

**📝 Khung tự giải 45': Rate Limiter**

- [ ] **1. Requirements (5–8')**
  - Giới hạn phía server hay client? Theo user ID, IP hay API key? Có nhiều luật (rule) khác nhau cho từng API không?
  - Hệ thống phân tán nhiều server? Bị chặn thì có báo cho người dùng không (429)?
  - Phi chức năng: thêm latency rất nhỏ (vài ms); rate limiter sập không được kéo sập cả API; dùng ít bộ nhớ.
- [ ] **2. Estimation (3–5')**
  - Số key đang hoạt động × kích thước state mỗi key (token bucket: ~2 số) → Redis cần bao nhiêu RAM?
  - QPS lúc cao điểm mà rate limiter phải chịu = QPS của toàn bộ API.
- [ ] **3. High-level design (10–15')**
  - Client → API Gateway / middleware rate limiter → Redis (bộ đếm) → API servers.
  - Luật lưu ở file cấu hình/DB, cache trong memory của rate limiter.
  - Bị chặn → 429 + `Retry-After`; tuỳ chọn đẩy request vào queue để xử lý sau.
- [ ] **4. Deep dive (10–15')**
  - Chọn thuật toán nào, vì sao (nối với bảng T2).
  - Race condition khi nhiều instance dùng chung Redis → Lua script.
  - Đồng bộ giữa nhiều rate limiter: dùng Redis tập trung thay vì sticky session.
- [ ] **5. Trade-off / bottleneck (3–5')**
  - Redis là SPOF → replica/cluster; quyết định fail-open hay fail-closed.
  - Multi-region: bộ đếm theo region, chấp nhận sai số (eventual).
  - Monitoring: tỷ lệ request bị chặn, luật có quá chặt/quá lỏng không.

**🔴 Thẻ Anki (T1)**

1. Token bucket: hai tham số là gì và mỗi tham số quyết định điều gì?
2. Vì sao fixed window có thể cho qua gấp đôi limit ở biên cửa sổ?
3. Race condition "đọc rồi ghi" xảy ra thế nào khi nhiều server dùng chung Redis? Hai cách xử lý?
4. Vì sao `MULTI/EXEC` một mình không đủ cho logic "đọc rồi quyết định"?
5. Redis của rate limiter sập: fail-open hay fail-closed? Cho ví dụ API nên chọn mỗi kiểu.
6. (T2) Khi nào chọn sliding window counter thay vì token bucket?
7. (DSA-Pattern) Bài DP trên mảng vòng tròn → tách thành hai bài đường thẳng (bỏ đầu / bỏ cuối).

**🟢 Tra cứu (T3):** tài liệu Redis về `EVAL` / Lua scripting và `INCR` (redis.io), mã 429 và header `Retry-After` trên MDN.

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 4** (*Design a Rate Limiter*)
- ByteByteGo (YouTube): video về các thuật toán rate limiting

**❓ Câu hỏi cuối bài**

1. So sánh token bucket, fixed window, sliding window.
2. Đặt rate limiter ở đâu trong hệ thống?
3. Rate limit trên nhiều server dùng chung Redis: race condition xảy ra ở đâu, xử lý thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Token bucket `capacity = 4`, nạp 2 token/giây, bucket đang đầy. 6 request đến cùng lúc: bao nhiêu request qua? Đúng 1 giây sau có thêm 3 request thì sao?
5. Redis của rate limiter sập: API gửi OTP qua SMS (tốn tiền) và API xem sản phẩm nên fail-open hay fail-closed? Vì sao chỉ giới hạn theo IP là không đủ?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Token bucket: cho burst tới `capacity`, tốc độ trung bình = `rate`, 2 số mỗi key.
- Fixed window: đơn giản, 1 bộ đếm, nhưng biên cửa sổ cho qua tới 2× limit.
- Sliding window log: chính xác nhất, tốn bộ nhớ (lưu mọi timestamp); sliding window counter: xấp xỉ, ít bộ nhớ, khắc phục biên.

**Câu 2.**
- Không đặt ở client (có thể giả mạo/bỏ qua).
- Middleware trong service: linh hoạt theo logic nghiệp vụ, nhưng mỗi service tự làm.
- API gateway: tập trung, chặn sớm trước khi tốn tài nguyên backend; thường là lựa chọn mặc định nếu đã có gateway.

**Câu 3.**
- Hai instance cùng đọc `counter = 4`, cùng thấy còn lượt, cùng ghi → vượt limit; lỗi ở chuỗi đọc – quyết định – ghi không nguyên tử.
- Lua script (cả khối chạy nguyên tử), hoặc `INCR` rồi so sánh (fixed window), hoặc `WATCH` + `MULTI/EXEC` + retry.
- `MULTI/EXEC` một mình không đủ vì không đọc được giá trị giữa chừng.

**Câu 4.**
- Lần đầu: 4 qua, 2 bị 429 (bucket còn 0).
- 1 giây sau nạp 2 token → 2 qua, 1 bị 429.
- `capacity` quyết định burst, `rate` quyết định tốc độ trung bình.

**Câu 5.**
- OTP SMS: **fail-closed** (lạm dụng gây tốn tiền, spam); xem sản phẩm: **fail-open** (thà chịu tải hơn là sập cả trang).
- IP: nhiều người sau NAT/công ty chung một IP bị chặn oan; kẻ tấn công đổi IP dễ → kết hợp user ID / API key.

</details>

---

## D68 (T6, 04/12): Case study Unique ID Generator

**⏱ Ước tính:** Giờ làm 75' (DSA 55' + Anki 20') · Tối 90' (Học 45' + Bảng T2 15' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h45'**

> Ngày nặng nhất tuần. Nếu hết giờ, *Khung tự giải 45'* bên dưới để dành cho Chủ Nhật; không cắt phần tự kiểm tra.

### 🧩 DSA: [322. Coin Change](https://leetcode.com/problems/coin-change/)

- **Pattern (🔴 T1):** *Unbounded knapsack (mỗi đồng xu dùng không giới hạn), dạng min*.
- **Gợi ý DP:**
  - **State:** `dp[a]` = số đồng xu ít nhất để tạo ra tổng `a`.
  - **Công thức chuyển:** đồng xu cuối cùng là `c` → `dp[a] = min(dp[a], dp[a - c] + 1)` với mọi `c ≤ a`.
  - **Base case:** `dp[0] = 0`; mọi `dp[a]` khác khởi tạo bằng "vô cực" (ví dụ `amount + 1`).
  - Đáp án: `dp[amount]`, nếu vẫn là "vô cực" thì trả về `-1`.
- **Các cách:** Greedy (lấy đồng lớn nhất trước) **sai** với `coins = [1, 3, 4], amount = 6` (greedy cho 4+1+1 = 3 đồng, đúng là 3+3 = 2 đồng). Top-down memo hoặc bottom-up → O(amount × số loại xu) thời gian, O(amount) bộ nhớ. BFS theo tổng cũng giải được (mỗi tầng = thêm 1 đồng).
- **Key insight:** tự tìm được phản ví dụ cho greedy là kỹ năng phỏng vấn quan trọng. Bài này sẽ được hỏi ở Chốt tuần.

### 📘 Bài học buổi tối: Case Unique ID Generator (Snowflake)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Yêu cầu của ID: duy nhất, (gần) tăng theo thời gian, 64-bit, sinh được hàng nghìn ID/giây/máy | 🔴 T1 | Nêu được vì sao cần từng yêu cầu | `distributed unique id generator requirements` |
| 2 | Vì sao auto-increment của một DB không đủ khi phân tán | 🔴 T1 | Nêu được 3 lý do: SPOF, nghẽn ghi, nhiều shard sinh trùng | `auto increment distributed system problem` |
| 3 | Bốn cách: multi-master (bước nhảy k), UUID, ticket server, Snowflake | 🟡 T2 | Điền bảng so sánh bên dưới | `unique id generation approaches snowflake uuid ticket server` |
| 4 | Cấu trúc Snowflake: bit dấu + timestamp + datacenter ID + machine ID + sequence | 🔴 T1 | Vẽ được các phần và giải thích vì sao timestamp đặt ở đầu (để ID sắp xếp được theo thời gian) | `twitter snowflake id structure` |
| 5 | Số bit chính xác (1/41/5/5/12) và các giới hạn suy ra (~69 năm, 4096 ID/ms/máy) | 🟢 T3 | Biết cách suy ra, không cần thuộc | — |
| 6 | Vấn đề đồng hồ: lệch giờ giữa các máy, đồng hồ chạy lùi (NTP chỉnh) | 🔴 T1 | Biết Snowflake phụ thuộc đồng hồ, và cách xử lý khi đồng hồ lùi (chờ, hoặc báo lỗi) | `snowflake clock backwards NTP` |
| 7 | UUID ngẫu nhiên (v4) và B-Tree index: chèn ngẫu nhiên → page split, cache kém, index to | 🔴 T1 | Giải thích được bằng kiến thức B-Tree ở Tuần 5 | `uuid primary key b-tree performance` |
| 8 | UUIDv7 / ULID: ID sắp xếp được theo thời gian | 🟢 T3 | Biết tồn tại như một cách khắc phục nhược điểm của UUIDv4 | `uuidv7 vs uuidv4` |

**Chi tiết cần hiểu**

- **Vì sao auto-increment không đủ (mục 2):**
  - Một DB duy nhất sinh ID → là single point of failure và là điểm nghẽn ghi.
  - Nhiều shard, mỗi shard tự tăng → trùng ID giữa các shard.
  - Multi-master với bước nhảy k (server 1 sinh 1, 3, 5…; server 2 sinh 2, 4, 6…) → khó thêm/bớt server, ID không tăng theo thời gian giữa các server.
- **Snowflake (mục 4):** 64 bit = 1 bit dấu (luôn 0) + 41 bit timestamp (ms tính từ một mốc tự chọn) + 5 bit datacenter + 5 bit máy + 12 bit sequence (đếm lại từ 0 mỗi ms). Mỗi máy tự sinh ID, **không cần phối hợp** với máy khác → nhanh, không SPOF. ID vừa `BIGINT`, sắp xếp được gần đúng theo thời gian.
- **UUID v4 và B-Tree (mục 7):** UUID v4 ngẫu nhiên nên mỗi lần chèn rơi vào một vị trí bất kỳ trong index → phải nạp nhiều page khác nhau vào bộ nhớ, page bị tách (split) liên tục, index phân mảnh. ID tăng dần luôn chèn vào page cuối → page đó nằm sẵn trong cache. Thêm nữa UUID 16 byte, gấp đôi `BIGINT` 8 byte, và mọi secondary index đều phải lưu kèm khoá chính (trong MySQL InnoDB).

**🟡 Bảng so sánh T2: UUID vs Snowflake vs Ticket server (vs Multi-master)**

Nhóm: *sinh định danh phân tán*, nhóm khác. Trục chính tự xác định: **phối hợp tập trung** vs **tự sinh độc lập**, và **có sắp xếp được theo thời gian không**.

| Tiêu chí | Multi-master (bước nhảy k) | UUID v4 | Ticket server | Snowflake |
|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | |
| Core: Trade-off chính | | | | |
| Core: Khi nào KHÔNG dùng | | | | |
| Ext: Kích thước (bit) & vừa kiểu `BIGINT`? | | | | |
| Ext: Sắp xếp được theo thời gian? | | | | |
| Ext: Cần phối hợp giữa các máy / có SPOF? | | | | |

**📝 Khung tự giải 45': Unique ID Generator**

- [ ] **1. Requirements (5–8')**
  - ID phải là số hay chuỗi? Độ dài tối đa (64-bit)? Có cần tăng theo thời gian không?
  - Cần sinh bao nhiêu ID/giây? Chạy trên bao nhiêu datacenter/máy?
- [ ] **2. Estimation (3–5')**
  - Số ID/giây/máy cần → đủ bao nhiêu bit sequence?
  - Hệ thống cần sống bao nhiêu năm → đủ bao nhiêu bit timestamp? (2⁴¹ ms ≈ 69 năm.)
- [ ] **3. High-level design (10–15')**
  - Liệt kê 4 cách, loại dần từng cách theo yêu cầu, chọn Snowflake.
  - Vẽ bố cục 64 bit.
- [ ] **4. Deep dive (10–15')**
  - Datacenter ID/machine ID lấy từ đâu (config, hoặc đăng ký với ZooKeeper/etcd khi khởi động).
  - Sequence hết trong 1 ms → chờ sang ms kế tiếp.
  - Đồng hồ chạy lùi → từ chối sinh/chờ cho tới khi vượt timestamp cuối.
- [ ] **5. Trade-off / bottleneck (3–5')**
  - Phụ thuộc NTP; ID chỉ "gần" tăng dần giữa các máy.
  - Có thể chỉnh lại số bit tuỳ nhu cầu (ít datacenter, nhiều máy hơn).

**🔴 Thẻ Anki (T1)**

1. Nêu 3 lý do auto-increment không đủ trong hệ phân tán.
2. Snowflake gồm những phần nào? Vì sao timestamp đặt ở các bit cao?
3. Vì sao mỗi máy sinh Snowflake ID mà không cần hỏi máy khác vẫn không trùng?
4. Đồng hồ máy chạy lùi thì Snowflake gặp vấn đề gì?
5. Vì sao UUID v4 làm khoá chính gây hại cho B-Tree index?
6. (T2) Khi nào UUID vẫn là lựa chọn tốt hơn Snowflake?
7. (DSA-Pattern) "Số phần tử ít nhất để tạo tổng, mỗi loại dùng không giới hạn" → unbounded knapsack: `dp[a] = min(dp[a - c] + 1)`.

**🟢 Tra cứu (T3):** bố cục bit chính xác của Snowflake, RFC 9562 (UUID, gồm UUIDv7), spec ULID.

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 7** (*Design a Unique ID Generator in Distributed Systems*)
- ByteByteGo (YouTube/blog): bài về cách sinh ID phân tán
- NeetCode: video giải *Coin Change*

**❓ Câu hỏi cuối bài**

1. Vì sao auto-increment không đủ trong hệ phân tán?
2. Cấu trúc một Snowflake ID gồm những phần nào?
3. UUID ngẫu nhiên có nhược điểm gì với B-Tree index?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Máy sinh Snowflake bị NTP chỉnh đồng hồ **lùi** 5 ms. Chuyện gì có thể xảy ra nếu không xử lý? Còn khi 4096 sequence của một ms đã dùng hết thì sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Một DB sinh ID → SPOF và nghẽn ghi.
- Nhiều shard tự tăng → trùng ID giữa shard.
- Multi-master bước nhảy k → khó thêm/bớt server, không tăng theo thời gian giữa các server.

**Câu 2.**
- 64 bit = 1 bit dấu + 41 bit timestamp (ms từ epoch tự chọn, ~69 năm) + 10 bit máy (5 datacenter + 5 machine) + 12 bit sequence (4096 ID/ms/máy).
- Timestamp ở bit cao → ID sắp xếp gần đúng theo thời gian.
- Mỗi máy có machine ID riêng → tự sinh không cần phối hợp, không SPOF.

**Câu 3.**
- Chèn ngẫu nhiên khắp index → page split, phân mảnh, nhiều page phải nạp vào RAM (cache hit thấp).
- 16 byte so với 8 byte của `BIGINT`; InnoDB: mọi secondary index lưu kèm khoá chính → index to hơn.
- Khắc phục: UUIDv7/ULID (sắp theo thời gian) hoặc Snowflake.

**Câu 4.**
- Đồng hồ lùi → có thể sinh lại timestamp đã dùng → **trùng ID** (cùng timestamp + machine + sequence).
- Xử lý: lưu timestamp cuối; nếu `now < last` thì chờ tới khi vượt `last` (lệch nhỏ) hoặc báo lỗi/ngừng sinh (lệch lớn).
- Hết sequence trong 1 ms → chờ sang ms kế tiếp rồi reset sequence về 0.

</details>

---

## D69 (T7, 05/12): Lab

**⏱ Ước tính:** DSA 45' · Lab bắt buộc 2h30' (Bước 1 60' + Bước 2 bắt buộc 1h30') · Bảng T2 dời từ D67 10' · Ôn ⚠️ 30' · **Tổng 3h55'** (+ mở rộng 30' nếu còn giờ)

### 🧩 DSA: [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

- **Pattern (🔴 T1):** *DP LIS: "kết thúc tại i"*. Khi đề hỏi về dãy con (không liền nhau), state thường là "tốt nhất **kết thúc tại** phần tử i".
- **Gợi ý DP:**
  - **State:** `dp[i]` = độ dài LIS **kết thúc tại** `nums[i]`.
  - **Công thức chuyển:** `dp[i] = 1 + max(dp[j])` với mọi `j < i` mà `nums[j] < nums[i]` (không có j nào thì `dp[i] = 1`).
  - **Base case:** mọi `dp[i] = 1`.
  - Đáp án: `max(dp)`, **không phải** `dp[n-1]`.
- **Các cách:** DP O(n²) thời gian, O(n) bộ nhớ (phải tự làm được). Cách O(n log n) dùng mảng `tails` + binary search: 🟢 T3, biết tồn tại và nói được ý tưởng một câu là đủ.
- Sau đó làm lại 1 bài sai trong tuần (nếu có). *(Thuộc phần mở rộng: chỉ làm nếu còn giờ sau Bước 3.)*

### 🛠 Lab (3–4h)

**Bước 1: Tự giải URL Shortener trên giấy (60')**
- Đặt đồng hồ **45'**, không mở sách. Đi theo *Khung tự giải 45'* ở D66, viết/vẽ lên giấy A4.
- Sau 45': mở Alex Xu chương 8, so sánh từng bước. Ghi vào `notes/sd-url-shortener.md` 3 mục: **Mình làm được → Mình thiếu → Sách làm khác và vì sao**.
- Chụp ảnh bản vẽ lưu vào `notes/img/`.

**Bước 2: Rate limiter token bucket bằng Redis cho Mini Order Service (bắt buộc 1h30' + mở rộng 30')**

Làm bằng ngôn ngữ/framework bạn đang dùng. Redis đã có sẵn trong `docker compose` từ Tuần 8–9.

- **Bắt buộc (1h30'):** mục 1–6 dưới đây, chỉ với luật của `POST /orders`, dùng `now` truyền từ app, chỉ cần header `Retry-After`.
- **Mở rộng (làm nếu còn giờ, 30'):** luật riêng cho các API đọc; thử biến thể `redis.call('TIME')` và ghi so sánh; thêm header báo số lượt còn lại; làm lại bài DSA sai trong tuần.

1. **Thiết kế luật:** `POST /orders` giới hạn theo **user ID** (lấy từ JWT, Tuần 4): `capacity = 5`, `refill_rate = 1 token/giây`. Các API đọc giới hạn lỏng hơn (ví dụ `capacity = 20`, `rate = 10/giây`). Luật để trong file config.
2. **Lưu state:** mỗi key `ratelimit:{route}:{userId}` là một Redis hash gồm `tokens` và `ts` (thời điểm nạp gần nhất, ms).
3. **Làm nguyên tử bằng Lua script** (đây là phần quan trọng nhất, 🔴 T1 về nguyên lý, 🟢 T3 về cú pháp; lưu snippet vào `notes/snippets.md`):

   ```lua
   -- KEYS[1] = key của bucket
   -- ARGV[1] = capacity, ARGV[2] = refill_rate (token/giây),
   -- ARGV[3] = now (ms), ARGV[4] = số token cần (thường là 1)
   local capacity  = tonumber(ARGV[1])
   local rate      = tonumber(ARGV[2])
   local now       = tonumber(ARGV[3])
   local requested = tonumber(ARGV[4])

   local data   = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
   local tokens = tonumber(data[1]) or capacity
   local ts     = tonumber(data[2]) or now

   local elapsed = math.max(0, now - ts)
   tokens = math.min(capacity, tokens + elapsed * rate / 1000)

   local allowed = 0
   if tokens >= requested then
     tokens = tokens - requested
     allowed = 1
   end

   redis.call('HSET', KEYS[1], 'tokens', tokens, 'ts', now)
   -- key tự hết hạn sau khoảng thời gian đủ để bucket đầy lại (x2 cho an toàn)
   redis.call('PEXPIRE', KEYS[1], math.ceil(capacity / rate * 1000) * 2)
   return { allowed, math.floor(tokens) }
   ```

   - Nạp script một lần bằng `SCRIPT LOAD`, gọi bằng `EVALSHA` (hoặc dùng hàm tương đương trong thư viện Redis của bạn).
   - Lưu ý: `now` truyền từ app server → các server lệch giờ thì kết quả lệch. Cách khác: gọi `redis.call('TIME')` ngay trong script để mọi instance dùng chung đồng hồ của Redis (Redis ≥ 5 mặc định replicate theo *effects* nên gọi `TIME` trước lệnh ghi là hợp lệ; bản cũ hơn sẽ báo lỗi). Ghi lại lựa chọn của bạn và lý do.
   - Kiểm tra logic script: bucket mới (chưa có key) bắt đầu **đầy** (`tokens = capacity`); token nạp theo thời gian trôi qua, bị chặn trần `capacity`; chỉ trừ khi đủ token; `ts` luôn cập nhật về `now` sau khi đã cộng phần nạp, nên không bị cộng trùng. Giá trị trả về từ Lua bị Redis cắt thành số nguyên, vì thế script `floor` trước khi trả.
   - Vì sao không dùng `GET` rồi `SET` từ app: hai instance có thể cùng đọc một giá trị (race condition ở D67). `MULTI/EXEC` không giúp được vì không đọc được giá trị giữa chừng; nếu muốn tránh Lua thì phải dùng `WATCH` + `MULTI/EXEC` và retry khi xung đột.
4. **Middleware:** chạy trước handler. Bị chặn → trả **429** + header `Retry-After` (số giây tới khi có token) + header báo số lượt còn lại.
5. **Fail-open/fail-closed:** Redis không kết nối được thì làm gì? Chọn một cách cho `POST /orders`, ghi lý do vào README.
6. **Test:**
   - Unit/integration test: gửi 6 request liên tiếp → 5 request 2xx, request thứ 6 nhận 429; chờ 1 giây → được thêm 1 request.
   - Test đồng thời: bắn 50 request **song song** vào **cả 2 instance** sau Nginx (Tuần 9) bằng một công cụ load test (ví dụ `hey`, `k6`, `ab` hoặc script tự viết) → số request thành công **đúng bằng capacity** (5), không hơn. Điều này chỉ đúng khi cả loạt chạy xong trong < 1 giây; nếu loạt kéo dài t giây thì được phép thêm tối đa ⌊t × rate⌋ request do token nạp lại. Dùng key/user mới cho mỗi lần chạy để bucket bắt đầu đầy.

**Sản phẩm bàn giao**
- `notes/sd-url-shortener.md` + ảnh bản vẽ.
- Code middleware rate limiter + Lua script + test trong `project/`.
- Mục "Rate limiting" trong README của dự án: luật, thuật toán, vì sao dùng Lua, quyết định fail-open/fail-closed.

**Tiêu chí đạt**
- [ ] Test tuần tự: request thứ 6 trong cùng 1 giây bị 429, có `Retry-After`.
- [ ] Test song song trên 2 instance: số request thành công không vượt capacity.
- [ ] Key trong Redis có TTL (kiểm tra bằng `TTL`/`PTTL`), không tồn tại key "mồ côi" không hết hạn.
- [ ] Giải thích được bằng lời vì sao cách `GET` rồi `SET` từ app bị sai.

**Bước 3 (40'):** Điền bảng T2 *vị trí đặt rate limiter* (dời từ D67, 10'), rồi ôn các câu đánh dấu ⚠️ trong tuần (30').

---

## D70 (CN, 06/12): Chốt tuần 10

**⏱ Ước tính:** DSA 45' · Làm lại 198 + 322 30' (70 tuỳ chọn) · Chốt tuần 60' · Anki/cheat sheet 30' · **Tổng 2h45'**

### 🧩 DSA: [139. Word Break](https://leetcode.com/problems/word-break/)

- **Pattern (🔴 T1):** *DP trên tiền tố của chuỗi (prefix DP)*.
- **Gợi ý DP:**
  - **State:** `dp[i]` = `true` nếu tiền tố `s[0..i)` (i ký tự đầu) tách được thành các từ trong từ điển.
  - **Công thức chuyển:** `dp[i] = true` nếu tồn tại `j < i` sao cho `dp[j] = true` và `s[j..i)` nằm trong từ điển.
  - **Base case:** `dp[0] = true` (chuỗi rỗng).
  - Đáp án: `dp[n]`.
- **Độ phức tạp:** O(n² · L) nếu so sánh substring (L là chi phí cắt/hash chuỗi); tối ưu bằng cách chỉ thử `j` sao cho độ dài `i - j` ≤ độ dài từ dài nhất. Bỏ từ điển vào HashSet.
- **Lỗi hay gặp:** đệ quy không memo → O(2ⁿ) với input như `"aaaa…ab"`.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Trình bày bài Rate Limiter trong 20 phút, đủ 5 bước.
2. Ước lượng QPS và dung lượng lưu trữ cho một hệ thống tự chọn.
3. DP: xác định state, công thức chuyển trạng thái, trường hợp cơ sở cho bài Coin Change.
4. Memoization khác tabulation thế nào?
   - *Mục này là kiến thức 🔴 T1 của tuần. Cần nói được: memo = top-down, đệ quy + cache, chỉ tính các state thực sự cần, tốn call stack (có thể tràn stack); tabulation = bottom-up, vòng lặp theo thứ tự phụ thuộc, không có chi phí đệ quy, dễ tối ưu bộ nhớ (chỉ giữ vài hàng/biến). Từ khoá research: `memoization vs tabulation`.*
5. So sánh Snowflake và UUID.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1 (case Rate Limiter, phải nhắc tới):**
- Requirements: phía server, key (user ID / API key / IP), nhiều luật theo API, phân tán nhiều instance, trả 429 + `Retry-After`.
- Estimation: số key hoạt động × ~2 số mỗi key → RAM Redis; QPS rate limiter = QPS toàn API.
- Thiết kế: gateway/middleware → Redis dùng chung; luật trong config, cache trong memory.
- Deep dive: chọn token bucket (hoặc sliding window counter) có lý do; race condition → Lua script.
- Trade-off: Redis là SPOF → replica/cluster + quyết định fail-open/closed; multi-region chấp nhận sai số; monitoring tỷ lệ bị chặn.

**Câu 2.**
- Nêu giả định DAU và request/người → QPS trung bình (/10⁵) → cao điểm ×2–3.
- Storage = bản ghi/ngày × kích thước × 365 × số năm (× bản sao).
- Nói rõ đã/không tính replication, index; làm tròn theo lũy thừa 10.

**Câu 3.**
- State `dp[a]` = số đồng ít nhất để tạo tổng `a`.
- Chuyển `dp[a] = min(dp[a - c] + 1)` với mọi `c ≤ a`; base `dp[0] = 0`, còn lại "vô cực"; không tạo được → −1.
- Phản ví dụ greedy: `[1, 3, 4]`, `amount = 6` (greedy 3 đồng, đúng 2 đồng). O(amount × số loại xu).

**Câu 4.**
- Memo: top-down, đệ quy + cache, chỉ tính state cần, tốn call stack (có thể tràn).
- Tabulation: bottom-up, vòng lặp theo thứ tự phụ thuộc, không chi phí đệ quy, dễ nén bộ nhớ.
- Cùng độ phức tạp thời gian trong đa số bài.

**Câu 5.**
- Snowflake: 64-bit, vừa `BIGINT`, sắp theo thời gian, thân thiện B-Tree; cần machine ID và phụ thuộc đồng hồ.
- UUID v4: 128-bit, sinh ở đâu cũng được, không cần phối hợp; ngẫu nhiên → hại B-Tree, to gấp đôi.
- UUID hợp lý khi: sinh ở client/offline, không cần sắp xếp, không muốn lộ thứ tự/số lượng (hoặc dùng UUIDv7 để có cả hai).

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] Rate limiter token bucket trên Redis chạy được, qua test song song trên 2 instance
- [ ] Bản vẽ URL Shortener + `notes/sd-url-shortener.md` (so sánh với sách)
- [ ] Tự giải lại 198, 322 (70 tuỳ chọn) không xem lời giải; nói được state/transition/base case của cả 7 bài DP trong tuần
- [ ] Anki: đã nhập thẻ T1 của D64–D68 + thẻ pattern DP: Fibonacci-style / take-skip / unbounded knapsack / LIS / prefix DP
- [ ] Cheat sheet: đã điền bảng Hash vs Base62, 301 vs 302, 5 thuật toán rate limiting, vị trí đặt rate limiter, 4 cách sinh ID

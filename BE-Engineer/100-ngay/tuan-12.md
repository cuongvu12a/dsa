# Tuần 12 (14/12 – 20/12): Microservices, Resilience, Observability, case study

[← Tuần 11](tuan-11.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 13 →](tuan-13.md)

**Mục tiêu tuần:** Nắm trade-off của microservices, Saga + Outbox, Circuit Breaker, SLO. Tự giải một bài SD tổng hợp. Chủ Nhật là **chốt Giai đoạn 3**.

**DSA tuần này:** làm lại các bài cũ có bấm giờ (**≤ 25'/bài**) để luyện tốc độ. Mỗi bài: nói to hướng giải trong 3' đầu, code, tự test với 2–3 case biên, nói độ phức tạp. Quá 25' hoặc sai → ghi lại vào Error List.

> **Cách học theo Tier** (🔴 T1 → Anki, 🟡 T2 → bảng so sánh trong `notes/tradeoff-cheatsheet.md`, 🟢 T3 → chỉ lưu link/snippet): xem lại bảng ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Học đến đâu thì dừng theo cột *Cần nắm tới mức nào*.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Lợi ích và cái giá của microservices, **database-per-service** (shared DB là anti-pattern), distributed monolith, chia service theo năng lực nghiệp vụ / bounded context (ý tưởng), **timeout / retry + exponential backoff + jitter / circuit breaker / bulkhead**, retry chỉ cho thao tác idempotent, retry storm, deadline propagation, **nguyên lý Saga** (chuỗi transaction cục bộ + compensating transaction), Saga thiếu isolation, bài toán dual write + **Outbox pattern**, **3 trụ cột observability** (log / metric / trace), structured logging, correlation ID / trace context propagation, percentile vs trung bình, four golden signals, alert theo triệu chứng, **SLI / SLO / SLA + error budget**, cách lập luận của case News Feed và Chat (cache nhiều tầng, cursor pagination, heartbeat presence, stateful connection), khung giải bài SD tổng hợp | **Monolith vs Microservices**, **2PC vs Saga**, **choreography vs orchestration**, **fan-out on write vs fan-out on read**, **WebSocket vs long polling** (vs polling), lưu tin nhắn ở KV/wide-column vs RDBMS | Vai trò của API gateway và service discovery (khái niệm, nói được 1 câu), DDD chuyên sâu, config Prometheus / Grafana / Jaeger / OpenTelemetry SDK, tên header `traceparent` (W3C Trace Context), thư viện circuit breaker (Resilience4j, Polly…) và tham số của chúng, Debezium/CDC setup, số liệu cụ thể trong từng case của sách, code chi tiết của lời giải LeetCode |

## ⏱ Thời lượng tuần

Không tính 1h tiếng Anh mỗi ngày (giữ riêng). DSA tuần này là làm lại có bấm giờ (≤ 25'), Anki ~20'/ngày.

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D78 (T2) | 45' | 85' | 2h10' |
| D79 (T3) | 45' | 80' | 2h05' |
| D80 (T4) | 45' | 90' | 2h15' |
| D81 (T5) | 45' | 85' | 2h10' |
| D82 (T6) | 45' | 85' | 2h10' |
| D83 (T7) | — | 3h35' | 3h35' |
| D84 (CN) | — | 2h35' | 2h35' |

**Tổng tuần: 17h00'**

Buổi tối nặng nhất là **D80** (Saga + Outbox, bản gốc có 2 bảng T2 ≈ 105'), nên bảng *Choreography vs Orchestration* đã dời sang Chủ Nhật D84. Thứ Bảy D83 (mock coding + case Chat) là buổi dài nhất tuần.

---

## D78 (T2, 14/12): Monolith vs Microservices, database-per-service

**⏱ Ước tính:** Giờ làm 45' (DSA 25' + Anki 20') · Tối 85' (Học 45' + Bảng T2 10' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h10'**

### 🧩 DSA (bấm giờ ≤ 25'): Làm lại [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)

- **Pattern (🔴 T1):** *Prefix / Suffix* (Tuần 1).
- **Mục tiêu bấm giờ:** ≤ 25'. Bài này bạn đã làm từ D6 nên mục tiêu thật là ≤ 15'.
- **Kiểm tra:**
  - [ ] Không dùng phép chia.
  - [ ] O(n) thời gian, O(1) bộ nhớ phụ (dùng chính mảng output cho prefix, một biến chạy cho suffix).
  - [ ] Test với mảng có **một** số 0 và có **hai** số 0.
  - [ ] Nói được vì sao cách "tính tích toàn bộ rồi chia" hỏng khi có số 0.

### 📘 Bài học buổi tối: Monolith vs Microservices, database-per-service

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Lợi ích của microservices: deploy độc lập, scale độc lập từng phần, cô lập lỗi, team tự chủ, chọn công nghệ riêng | 🔴 T1 | Kể 3 lợi ích, mỗi cái gắn với một vấn đề cụ thể của monolith lớn | `microservices benefits` |
| 2 | Cái giá: gọi qua mạng (latency, lỗi một phần), transaction phân tán, eventual consistency, vận hành/observability phức tạp, test tích hợp khó | 🔴 T1 | Kể 3 cái giá, biết rằng mỗi cái giá sẽ được học cách xử lý ở D79–D81 | `microservices drawbacks distributed systems` |
| 3 | **Monolith vs Microservices** (+ modular monolith ở giữa) | 🟡 T2 | Điền bảng bên dưới | `monolith vs microservices when to use`, `modular monolith` |
| 4 | **Database-per-service**; shared database là anti-pattern | 🔴 T1 | Giải thích được 3 hậu quả của shared DB (xem bên dưới) | `database per service pattern`, `shared database anti pattern` |
| 5 | Lấy dữ liệu của service khác: gọi API, hoặc giữ bản sao cục bộ cập nhật qua event | 🔴 T1 | Biết đây là cái giá của database-per-service; join giữa service không còn là SQL join | `microservices data replication events` |
| 6 | Distributed monolith: tách service nhưng vẫn phải deploy cùng nhau, gọi nhau đồng bộ dày đặc | 🔴 T1 | Nhận ra được dấu hiệu | `distributed monolith anti pattern` |
| 7 | Conway's law: kiến trúc hệ thống phản chiếu cấu trúc tổ chức | 🔴 T1 | Dùng được để trả lời câu "team 5 người" | `conway's law microservices` |
| 8 | Chia service theo **năng lực nghiệp vụ / bounded context** (Order, Payment, Inventory), không chia theo tầng kỹ thuật (service "DB", service "validation") | 🔴 T1 (ý tưởng) / 🟢 T3 (DDD chuyên sâu) | Nói được 1 câu vì sao chia theo tầng kỹ thuật dẫn tới distributed monolith. Theo Roadmap.md, DDD là T1, nhưng trong 100 ngày chỉ cần ý tưởng này; Aggregate, context map… để sau | `bounded context microservices`, `decompose by business capability` |
| 9 | Vai trò của **API gateway** (một cửa vào: routing, auth, rate limit, gom response) và **service discovery** (service tìm địa chỉ của nhau khi instance thay đổi liên tục) | 🟢 T3 | Theo Roadmap.md là khái niệm T3. Chỉ cần nói được mỗi thứ giải quyết vấn đề gì trong 1 câu; công cụ cụ thể (Kong, Consul, K8s Service) tra khi cần | `api gateway pattern`, `service discovery client side server side` |

**Chi tiết cần hiểu**

- **3 hậu quả của shared DB (mục 4):**
  - Service A đổi schema (đổi tên cột) làm vỡ service B → mất khả năng deploy độc lập, tức là mất lợi ích chính của microservices.
  - Một service chạy query nặng làm chậm tất cả service khác (coupling lúc chạy).
  - Không biết ai "sở hữu" dữ liệu, ai được phép ghi → invariant nghiệp vụ bị phá (nhớ Encapsulation ở Tuần 1, đây là encapsulation ở mức service).
- **Câu "team 5 người làm sản phẩm mới":** chọn **monolith (modular)**. Lý do: chưa biết ranh giới domain ổn định ở đâu (chia sai thì rất tốn chi phí sửa); 5 người không đủ để vận hành nhiều service, pipeline, monitoring; Conway's law: một team → một khối deploy là tự nhiên. Chia module rõ ràng bên trong để sau này tách ra được.
- **Dấu hiệu nên tách service:** một phần cần scale rất khác phần còn lại; nhiều team giẫm chân nhau khi deploy; một phần có yêu cầu uptime/bảo mật khác hẳn.

**🟡 Bảng so sánh T2: Monolith vs Microservices**

Nhóm: *kiến trúc hệ thống (architecture style)*, nhóm khác, gần với deployment/infra strategy. Trục chính tự xác định: **độc lập (deploy, scale, team)** vs **chi phí của hệ phân tán**.

| Tiêu chí | Monolith (modular) | Microservices |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Độ phức tạp vận hành (deploy, monitoring, debug) | | |
| Ext: Khả năng scale/deploy độc lập | | |
| Ext: Transaction và consistency dữ liệu | | |

**🔴 Thẻ Anki (T1)**

1. Kể 3 lợi ích và 3 cái giá của microservices.
2. Vì sao shared database là anti-pattern? Nêu 3 hậu quả.
3. Database-per-service thì lấy dữ liệu của service khác bằng cách nào?
4. Distributed monolith là gì? Dấu hiệu nhận biết?
5. Conway's law nói gì?
6. (T2) Khi nào monolith là lựa chọn đúng hơn microservices?

**🟢 Tra cứu (T3):** microservices.io, các trang *Pattern: Microservice Architecture*, *Pattern: Monolithic Architecture*, *Pattern: Database per service*, *Pattern: Shared database*.

**Tài liệu:**
- ByteByteGo (YouTube): video về microservices và monolith vs microservices
- microservices.io: trang *Database per service*

**❓ Câu hỏi cuối bài**

1. Kể 3 lợi ích và 3 cái giá phải trả của microservices.
2. Vì sao dùng chung một database cho nhiều service là anti-pattern?
3. Team 5 người làm sản phẩm mới nên chọn kiến trúc nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Order service cần tên và email của user (dữ liệu thuộc User service) để hiển thị danh sách đơn. Có những cách nào để lấy? Trade-off của mỗi cách?
5. Team bạn tách hệ thống thành 6 service, nhưng lần release nào cũng phải deploy cả 6 cùng lúc và một service chết là cả hệ thống chết. Đây là hiện tượng gì? Nguyên nhân thường gặp?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Lợi ích: deploy độc lập, scale độc lập từng phần, cô lập lỗi, team tự chủ (và chọn công nghệ riêng).
- Cái giá: gọi qua mạng (latency, lỗi một phần), transaction phân tán / eventual consistency, vận hành + observability + test tích hợp phức tạp.
- Mỗi cái giá có cách xử lý riêng: resilience (D79), Saga/Outbox (D80), observability (D81).

**Câu 2.**
- Đổi schema của một service làm vỡ service khác → mất deploy độc lập.
- Query nặng của một service làm chậm tất cả (coupling lúc chạy).
- Không rõ ai sở hữu/được ghi dữ liệu → invariant nghiệp vụ bị phá.

**Câu 3.**
- Modular monolith: chưa rõ ranh giới domain, 5 người không đủ vận hành nhiều service.
- Conway's law: một team → một khối deploy là tự nhiên.
- Chia module rõ bên trong để sau này tách được khi có dấu hiệu (scale khác nhau, nhiều team giẫm chân).

**Câu 4.**
- Gọi API User service lúc đọc: luôn mới nhất, nhưng thêm latency + phụ thuộc lúc chạy (User chết thì trang đơn lỗi → cần timeout/fallback), N+1 → gọi theo lô.
- Giữ bản sao cục bộ (`user_id, name, email`) cập nhật qua event `UserUpdated`: nhanh, không phụ thuộc lúc chạy, nhưng eventual consistency và phải xử lý event.
- Không được join thẳng vào DB của User service.

**Câu 5.**
- **Distributed monolith**: có cái giá của microservices mà không có lợi ích.
- Nguyên nhân: chia theo tầng kỹ thuật thay vì bounded context, dùng chung DB/thư viện model, gọi đồng bộ dày đặc thành chuỗi dài, thay đổi API không tương thích ngược.

</details>

---

## D79 (T3, 15/12): Resilience

**⏱ Ước tính:** Giờ làm 45' (DSA 25' + Anki 20') · Tối 80' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h05'**

### 🧩 DSA (bấm giờ ≤ 25'): Làm lại [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

- **Pattern (🔴 T1):** *Sliding window biến đổi kích thước* (Tuần 2).
- **Mục tiêu bấm giờ:** ≤ 25', nhắm ≤ 15'.
- **Kiểm tra:**
  - [ ] O(n) thời gian: con trỏ trái **không bao giờ lùi**.
  - [ ] Dùng HashMap `ký tự → vị trí gần nhất` và nhảy `left = max(left, last[c] + 1)`. Nói được vì sao phải có `max` (ví dụ `"abba"`).
  - [ ] Test: chuỗi rỗng, `"bbbbb"`, `"pwwkew"`, chuỗi có dấu cách.
  - [ ] Nói được bộ nhớ O(min(n, kích thước bảng chữ cái)).

### 📘 Bài học buổi tối: Timeout, retry + backoff + jitter, circuit breaker, bulkhead

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Timeout**: mọi lời gọi qua mạng phải có timeout | 🔴 T1 | Giải thích được: không có timeout → thread/connection bị giữ mãi → cạn pool → service của mình sập theo (cascading failure) | `timeout cascading failure microservices` |
| 2 | **Retry** chỉ cho lỗi tạm thời và thao tác **idempotent** | 🔴 T1 | Biết retry `POST /payments` không có idempotency key là nguy hiểm (nối Tuần 4) | `retry idempotent operations` |
| 3 | **Exponential backoff + jitter** | 🔴 T1 | Viết được công thức (xem bên dưới) và giải thích vì sao cần jitter | `exponential backoff and jitter` |
| 4 | **Retry storm** và retry khuếch đại qua nhiều tầng | 🔴 T1 | Tính được: 3 tầng, mỗi tầng retry 3 lần (tổng 4 lần gọi) → tầng cuối nhận tới 4³ = 64 lần | `retry storm`, `retry amplification` |
| 5 | **Circuit breaker**: Closed → Open → Half-open | 🔴 T1 | Vẽ được sơ đồ trạng thái với điều kiện chuyển (xem bên dưới) | `circuit breaker pattern states` |
| 6 | **Bulkhead**: tách tài nguyên (thread pool, connection pool, queue) theo từng phụ thuộc | 🔴 T1 | Cho ví dụ: pool riêng cho gọi Payment và cho gọi Recommendation | `bulkhead pattern` |
| 7 | Fallback / graceful degradation | 🔴 T1 | Cho 2 ví dụ: trả dữ liệu cache cũ, ẩn khối "gợi ý sản phẩm" | `graceful degradation fallback` |
| 8 | Timeout theo chuỗi gọi, **deadline propagation** | 🔴 T1 | Trả lời được câu A → B → C (xem bên dưới) | `deadline propagation grpc`, `timeout budget microservices` |
| 9 | Thư viện cụ thể (Resilience4j, Polly, gobreaker, opossum…) và tham số cấu hình | 🟢 T3 | Tra docs của ngôn ngữ bạn dùng | — |

**Chi tiết cần hiểu**

- **Backoff + jitter (mục 3):** `delay = random(0, min(cap, base × 2^attempt))` (kiểu "full jitter"). Chỉ có exponential backoff mà không có jitter thì nghìn client bị lỗi cùng lúc sẽ retry **cùng lúc** ở giây 1, 2, 4… → dồn tải thành từng đợt. Jitter rải các lần retry ra.
- **Circuit breaker (mục 5):**
  - **Closed:** gọi bình thường, đếm lỗi trong một cửa sổ (theo số request hoặc theo thời gian).
  - Tỷ lệ lỗi/timeout vượt ngưỡng → **Open:** từ chối ngay (fail fast), không gọi service đang hỏng, trả fallback. Service hỏng có thời gian hồi phục.
  - Hết thời gian chờ → **Half-open:** cho một số ít request thử đi qua. Thành công → quay về Closed. Thất bại → Open lại.
- **Retry an toàn qua nhiều service (mục 2):** client gửi `Idempotency-Key` cho `POST /orders`; Order service retry sang Payment phải dùng **cùng** key đó (hoặc key dẫn xuất cố định như `order_id + "payment"`), không sinh key mới mỗi lần retry. Như vậy retry ở bất kỳ tầng nào cũng không trừ tiền hai lần. Timeout **không** có nghĩa là thất bại: bên kia có thể đã làm xong, nên chỉ retry khi thao tác idempotent.
- **Retry và circuit breaker kết hợp:** retry ở **một** tầng (thường là gần phía gọi nhất hoặc ở tầng client của phụ thuộc), có giới hạn tổng (retry budget), và breaker nằm ngoài retry để khi service chết hẳn thì không retry nữa.
- **Timeout cho A → B → C (mục 8):** timeout mà A đặt khi gọi B phải **lớn hơn** tổng thời gian B có thể tốn khi gọi C (kể cả retry của B) cộng thời gian B tự xử lý; nếu không, A đã bỏ cuộc trong khi B vẫn đang làm việc vô ích. Tốt hơn nữa: A truyền **deadline** (hạn chót tuyệt đối) xuống B và C; mỗi tầng chỉ dùng phần thời gian còn lại, hết thì dừng ngay.

**🔴 Thẻ Anki (T1)**

1. Vì sao gọi service khác mà không đặt timeout có thể làm sập chính service của mình?
2. Chỉ nên retry những lỗi và thao tác nào?
3. Viết công thức exponential backoff + full jitter. Jitter giải quyết vấn đề gì?
4. Retry storm là gì? Vì sao retry ở nhiều tầng làm tải tăng theo cấp số nhân?
5. Circuit breaker có 3 trạng thái nào? Điều kiện chuyển giữa chúng?
6. Bulkhead là gì? Cho một ví dụ.
7. Chuỗi A → B → C: timeout ở mỗi chặng nên đặt thế nào? Deadline propagation là gì?

**🟢 Tra cứu (T3):** docs thư viện resilience của ngôn ngữ bạn dùng; microservices.io trang *Pattern: Circuit Breaker*.

**Tài liệu:**
- ByteByteGo (YouTube): video về circuit breaker / resilience patterns
- Bài *Exponential Backoff And Jitter* trên AWS Architecture Blog (tìm theo tên bài)
- microservices.io: trang *Circuit Breaker*

**❓ Câu hỏi cuối bài**

1. Retry mà không có backoff thì gây ra chuyện gì (retry storm)?
2. Circuit breaker có 3 trạng thái nào? Chuyển trạng thái khi nào?
3. Chuỗi gọi A → B → C thì đặt timeout ở mỗi chặng thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Checkout service gọi Payment (quan trọng) và Recommendation (phụ) chung một thread pool 50 thread. Recommendation bỗng chậm 10 giây mỗi request. Chuyện gì xảy ra? Bulkhead và fallback thay đổi kết cục thế nào?
5. Gọi `POST /payments` bị timeout: có được retry không? Cần điều kiện gì? Vì sao exponential backoff vẫn cần thêm jitter?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Lỗi xảy ra cùng lúc cho nhiều client → tất cả retry ngay → tải dồn gấp nhiều lần lên service đang yếu → nó không thể hồi phục.
- Retry ở nhiều tầng nhân lên: 3 tầng × 4 lần gọi → 4³ = 64 lần ở tầng cuối.
- Khắc phục: backoff + jitter, giới hạn số lần/retry budget, retry ở **một** tầng, circuit breaker.

**Câu 2.**
- Closed: gọi bình thường, đếm lỗi trong cửa sổ.
- Tỷ lệ lỗi/timeout vượt ngưỡng → Open: fail fast, trả fallback, không gọi service hỏng.
- Hết thời gian chờ → Half-open: cho vài request thử; thành công → Closed, thất bại → Open lại.

**Câu 3.**
- Timeout của A khi gọi B > thời gian B tự xử lý + tổng thời gian B gọi C (kể cả retry của B).
- Tầng càng sâu timeout càng nhỏ; nếu không, A bỏ cuộc mà B/C vẫn làm việc vô ích.
- Tốt hơn: truyền **deadline** tuyệt đối xuống; mỗi tầng dùng phần còn lại, hết thì dừng.

**Câu 4.**
- Không bulkhead: 50 thread lần lượt bị Recommendation giữ 10 s → cạn pool → Payment cũng không gọi được → checkout sập (cascading failure).
- Bulkhead: pool riêng (ví dụ 40 cho Payment, 10 cho Recommendation) → chỉ phần gợi ý bị ảnh hưởng.
- Fallback + timeout ngắn: ẩn khối gợi ý hoặc trả gợi ý cache cũ; checkout vẫn chạy.

**Câu 5.**
- Timeout không có nghĩa thất bại: tiền có thể đã bị trừ → chỉ retry khi có **idempotency key** (cùng key cho mọi lần retry, truyền xuyên suốt các service).
- Không có key → kiểm tra trạng thái giao dịch trước khi thử lại.
- Không jitter: mọi client retry đúng cùng mốc 1 s, 2 s, 4 s → tải dồn thành từng đợt; jitter rải chúng ra (`random(0, min(cap, base × 2^attempt))`).

</details>

---

## D80 (T4, 16/12): 2PC vs Saga, Outbox pattern

**⏱ Ước tính:** Giờ làm 45' (DSA 25' + Anki 20') · Tối 90' (Học 45' + Bảng T2 15' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h15'**

> Tối nay chỉ điền bảng *2PC vs Saga*. Bảng *Choreography vs Orchestration* **dời sang Chủ Nhật D84** (10'); tối nay chỉ cần hiểu hai cách qua phần *Chi tiết cần hiểu* để trả lời câu 2.

### 🧩 DSA (bấm giờ ≤ 25'): Làm lại [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

- **Pattern (🔴 T1):** *Binary search biến thể: một nửa luôn được sắp xếp* (Tuần 3).
- **Mục tiêu bấm giờ:** ≤ 25'.
- **Kiểm tra:**
  - [ ] O(log n), một lần binary search (không cần tìm điểm xoay riêng).
  - [ ] Xác định nửa nào đã sort bằng `nums[lo] <= nums[mid]`; nói được vì sao cần dấu `=` (khi `lo == mid`).
  - [ ] Điều kiện `target` nằm trong nửa đã sort viết đúng biên (`<=` và `<`).
  - [ ] Test: mảng 1 phần tử, 2 phần tử, mảng không xoay, target không tồn tại.

### 📘 Bài học buổi tối: 2PC vs Saga (choreography / orchestration), Outbox pattern

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Vấn đề: một nghiệp vụ trải qua nhiều service, mỗi service một DB → không còn một transaction ACID chung | 🔴 T1 | Nêu được bằng ví dụ đặt hàng: Order, Payment, Inventory | `distributed transaction problem microservices` |
| 2 | **2PC** (two-phase commit): coordinator, pha prepare, pha commit | 🔴 T1 (cơ chế) | Mô tả 2 pha và điểm yếu: blocking khi coordinator chết sau prepare, giữ lock lâu, cần mọi bên hỗ trợ (XA) | `two phase commit explained blocking` |
| 3 | **Nguyên lý Saga**: chuỗi transaction cục bộ, mỗi bước có **compensating transaction** (bù trừ) | 🔴 T1 | Tự thiết kế được Saga 3 bước có bù trừ (xem bên dưới) | `saga pattern compensating transaction` |
| 4 | Saga không có isolation (chỉ có ACD): người khác thấy trạng thái trung gian | 🔴 T1 | Biết cách giảm thiểu: trạng thái `PENDING` (semantic lock), thứ tự bước hợp lý | `saga isolation anomalies semantic lock` |
| 5 | **2PC vs Saga** | 🟡 T2 | Điền bảng so sánh bên dưới | `2pc vs saga` |
| 6 | **Choreography vs Orchestration** | 🟡 T2 | Điền bảng so sánh bên dưới | `saga choreography vs orchestration` |
| 7 | Bài toán **dual write**: ghi DB và publish event là hai hệ thống, không có transaction chung | 🔴 T1 | Kể được 2 kịch bản lỗi (ghi DB xong, publish lỗi; publish xong, DB rollback) | `dual write problem` |
| 8 | **Transactional Outbox**: ghi bản ghi nghiệp vụ + bản ghi `outbox` trong **cùng một transaction cục bộ**; một tiến trình relay đọc outbox và publish | 🔴 T1 | Vẽ được luồng; biết relay cho at-least-once → consumer phải idempotent (Tuần 11) | `transactional outbox pattern` |
| 9 | Hai cách relay: polling publisher vs transaction log tailing (CDC) | 🟢 T3 | Biết tên 2 cách; CDC dùng công cụ như Debezium, setup tra khi cần | `outbox polling publisher vs CDC debezium` |

**Chi tiết cần hiểu**

- **Saga đặt hàng (mục 3), dạng orchestration:**

  | Bước | Service | Transaction cục bộ | Compensating transaction |
  |---|---|---|---|
  | 1 | Order | Tạo đơn trạng thái `PENDING` | Đổi đơn sang `CANCELLED` |
  | 2 | Inventory | Giữ hàng (reserve) | Nhả hàng đã giữ (release) |
  | 3 | Payment | Trừ tiền | *(bước cuối, nếu thất bại thì không cần bù chính nó)* |
  | 4 | Order | Đổi đơn sang `CONFIRMED` | — |

  - Payment thất bại → chạy bù ngược: nhả hàng ở Inventory → huỷ đơn ở Order.
  - Đặt bước **khó hoàn tác nhất** (trừ tiền; hoàn tiền là một nghiệp vụ riêng, tốn phí, người dùng thấy) ở **cuối**, sau khi các bước dễ thất bại đã qua.
  - Compensating transaction cũng phải **idempotent và retry được**, vì nó cũng có thể bị gọi lại nhiều lần.
  - Bù trừ là **hoàn tác về mặt nghiệp vụ** (semantic undo), không phải rollback DB: tiền đã trừ thì phải hoàn lại bằng giao dịch mới.
- **Choreography vs orchestration (mục 6):**
  - *Choreography:* không có trung tâm; mỗi service nghe event và tự quyết bước tiếp theo (`OrderCreated` → Inventory giữ hàng → `InventoryReserved` → Payment trừ tiền…). Đơn giản khi ít bước; khó nhìn thấy toàn luồng, dễ phụ thuộc vòng.
  - *Orchestration:* một orchestrator (thường nằm trong Order service) gửi lệnh cho từng service và theo dõi trạng thái Saga. Dễ hiểu, dễ debug, dễ thêm bước; orchestrator có thể thành nơi tập trung quá nhiều logic.
- **Outbox (mục 8):**
  1. Trong một transaction: `INSERT INTO orders ...` và `INSERT INTO outbox(id, aggregate_id, event_type, payload, created_at, published_at NULL)`.
  2. Relay đọc các dòng `published_at IS NULL` theo thứ tự, publish lên broker, nhận confirm, rồi đánh dấu đã publish.
  3. Relay chết sau khi publish nhưng trước khi đánh dấu → publish lại lần nữa → **trùng** → consumer idempotent theo `outbox.id` (chính là `event_id` ở Tuần 11).
  - Kết quả: không bao giờ có "đơn đã tạo mà event mất" hay "event đã gửi mà đơn không tồn tại".

**🟡 Bảng so sánh T2: 2PC vs Saga**

Nhóm: *distributed transaction pattern*. Trục chính: **tính đúng đắn (atomicity) vs khả năng chịu lỗi/hiệu năng**. Extension theo bảng tra: Correctness guarantee · Latency overhead · Độ phức tạp rollback.

| Tiêu chí | 2PC | Saga |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Correctness guarantee (atomicity, isolation) | | |
| Ext: Latency overhead (lock, số lượt round-trip) | | |
| Ext: Độ phức tạp rollback | | |

**🟡 Bảng so sánh T2: Choreography vs Orchestration** *(điền ở Chủ Nhật D84)*

Nhóm: *distributed transaction pattern (cách điều phối)*. Trục chính: **mức coupling** vs **khả năng quan sát/kiểm soát luồng**.

| Tiêu chí | Choreography | Orchestration |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Coupling giữa các service | | |
| Ext: Dễ quan sát/debug toàn luồng? | | |
| Ext: Độ phức tạp rollback khi thêm bước mới | | |

**🔴 Thẻ Anki (T1)**

1. 2PC gồm 2 pha nào? Điểm yếu lớn nhất của 2PC là gì?
2. Saga là gì? Compensating transaction là gì?
3. Vì sao Saga không có isolation? Giảm thiểu bằng cách nào?
4. Trong Saga đặt hàng, vì sao nên đặt bước trừ tiền ở cuối?
5. Dual write problem là gì? Cho 2 kịch bản lỗi.
6. Outbox pattern hoạt động thế nào? Vì sao consumer vẫn phải idempotent?
7. (T2) Khi nào chọn 2PC thay vì Saga?
8. (T2) Khi nào chọn orchestration thay vì choreography?

**🟢 Tra cứu (T3):** microservices.io các trang *Pattern: Saga*, *Pattern: Transactional outbox*, *Pattern: Polling publisher*, *Pattern: Transaction log tailing*; docs Debezium (debezium.io) phần outbox.

**Tài liệu:**
- microservices.io: trang *Saga* và *Transactional outbox* (đọc kỹ ví dụ đặt hàng)
- ByteByteGo (YouTube): video về distributed transactions / Saga

**❓ Câu hỏi cuối bài**

1. Thiết kế Saga cho luồng đặt hàng qua 3 service (Order, Payment, Inventory), có bước bù trừ (compensating).
2. Choreography khác orchestration thế nào?
3. Outbox giải quyết tình huống "ghi DB thành công nhưng publish event thất bại" ra sao?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Trong 2PC, coordinator chết ngay sau khi mọi participant đã trả lời "prepare OK". Các participant rơi vào tình trạng gì? Vì sao microservices hiếm khi dùng 2PC?
5. Saga đặt hàng đang chạy giữa chừng (đã giữ hàng, chưa trừ tiền). Người dùng khác xem đơn và tồn kho thì thấy gì? Làm sao giảm thiểu dị thường do Saga không có isolation?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Order tạo `PENDING` (bù: `CANCELLED`) → Inventory giữ hàng (bù: nhả hàng) → Payment trừ tiền (bước cuối) → Order `CONFIRMED`.
- Payment lỗi → bù ngược: nhả hàng → huỷ đơn.
- Bước khó hoàn tác nhất (trừ tiền) đặt cuối; bù trừ là semantic undo, phải idempotent và retry được.

**Câu 2.**
- Choreography: không trung tâm, service nghe event và tự làm bước tiếp; ít coupling, đơn giản khi ít bước, khó nhìn toàn luồng, dễ phụ thuộc vòng.
- Orchestration: orchestrator ra lệnh và giữ trạng thái Saga; dễ hiểu/debug/thêm bước, nhưng logic dồn về một chỗ.

**Câu 3.**
- Ghi bản ghi nghiệp vụ + dòng `outbox` trong **cùng một transaction cục bộ** → cả hai cùng thành công hoặc cùng thất bại.
- Relay (polling hoặc CDC) đọc outbox, publish, nhận confirm rồi đánh dấu đã gửi.
- Relay chết giữa chừng → publish lại → at-least-once → consumer idempotent theo `outbox.id`.

**Câu 4.**
- Participant đã prepare phải **giữ lock và chờ** quyết định, không tự commit hay abort được (blocking) → tài nguyên bị khoá tới khi coordinator hồi phục.
- Microservices: giữ lock qua nhiều service làm giảm availability và throughput; nhiều DB/broker không hỗ trợ XA; coordinator là SPOF.

**Câu 5.**
- Thấy trạng thái trung gian: đơn `PENDING`, tồn kho đã giảm dù đơn có thể bị huỷ (Saga chỉ có ACD, không có I).
- Giảm thiểu: semantic lock (trạng thái `PENDING`, UI hiện "đang xử lý"), sắp thứ tự bước hợp lý (giữ hàng có hạn, trừ tiền cuối), đọc lại giá trị trước khi ghi (kiểm tra version).

</details>

---

## D81 (T5, 17/12): Observability, SLI / SLO / SLA

**⏱ Ước tính:** Giờ làm 45' (DSA 25' + Anki 20') · Tối 85' (Học 55' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h10'**

> Buổi có nhiều thẻ Anki nhất tuần (10 thẻ). Chương 6 sách SRE là **(tuỳ chọn)**.

### 🧩 DSA (bấm giờ ≤ 25'): Làm lại [146. LRU Cache](https://leetcode.com/problems/lru-cache/)

- **Pattern (🔴 T1):** *HashMap + doubly linked list* (Tuần 4).
- **Mục tiêu bấm giờ:** ≤ 25'. Đây là bài hay bị hỏi lại nhất trong phỏng vấn backend.
- **Kiểm tra:**
  - [ ] `get` và `put` đều O(1).
  - [ ] Dùng node giả (dummy) `head`/`tail` để không phải xử lý trường hợp danh sách rỗng.
  - [ ] `put` một key **đã tồn tại** thì cập nhật giá trị **và** đưa lên đầu.
  - [ ] Khi đầy, xoá node ở đuôi **và** xoá key tương ứng khỏi HashMap (node phải lưu cả key).
  - [ ] Test `capacity = 1`.

### 📘 Bài học buổi tối: Log / metric / trace, correlation ID, SLI / SLO / SLA

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **3 trụ cột**: log (chuyện gì đã xảy ra, chi tiết), metric (bao nhiêu, bao thường xuyên, tổng hợp theo thời gian), trace (thời gian đi đâu qua nhiều service) | 🔴 T1 | Với 3 câu hỏi sự cố cụ thể, chọn đúng công cụ (xem bên dưới) | `three pillars of observability logs metrics traces` |
| 2 | Structured logging (JSON), mỗi dòng log có `trace_id` | 🔴 T1 | Biết vì sao log dạng text tự do khó tìm kiếm khi có nhiều service | `structured logging json correlation id` |
| 3 | **Correlation ID / trace context propagation** | 🔴 T1 | Mô tả được: sinh ở cửa vào (gateway), truyền qua header HTTP và qua header của message trong queue, mỗi service ghi vào log | `trace context propagation http headers message queue` |
| 4 | Trace, span, parent span | 🔴 T1 | Vẽ được trace của một request đi qua 3 service | `distributed tracing span trace` |
| 5 | Loại metric: counter, gauge, histogram; percentile (p50/p95/p99) thay vì trung bình | 🔴 T1 | Giải thích được vì sao latency trung bình che giấu vấn đề | `p99 latency vs average` |
| 6 | Four golden signals: latency, traffic, errors, saturation (và RED/USE) | 🔴 T1 | Kể được 4 tín hiệu, biết RED dùng cho service, USE dùng cho tài nguyên | `four golden signals`, `RED method USE method` |
| 7 | **SLI / SLO / SLA** | 🔴 T1 | Phân biệt bằng một ví dụ (xem bên dưới) | `SLI SLO SLA difference` |
| 8 | **Error budget** = 1 − SLO | 🔴 T1 | Tính được downtime cho phép và biết đội dùng nó để quyết định dừng release | `error budget SRE` |
| 9 | Tên header `traceparent` (W3C Trace Context), config Prometheus/Grafana/Jaeger/OpenTelemetry SDK | 🟢 T3 | Tra docs khi triển khai | — |
| 10 | Label có cardinality cao (user_id trong metric) làm nổ bộ nhớ hệ thống metric | 🔴 T1 | Biết quy tắc: ID chi tiết để vào log/trace, không để vào label của metric | `high cardinality metrics labels` |
| 11 | **Alert theo triệu chứng** (người dùng bị ảnh hưởng: tỷ lệ lỗi, p99, SLO burn rate) thay vì theo nguyên nhân (CPU 80%); mỗi alert phải có việc cần làm ngay | 🔴 T1 | Cho được 1 ví dụ alert tốt và 1 alert gây "mệt mỏi vì alert" (alert fatigue) | `symptom based alerting`, `SLO burn rate alert` |

**Chi tiết cần hiểu**

- **Chọn trụ cột nào (mục 1):**
  - "Tỷ lệ lỗi 5xx của API tạo đơn có đang tăng không?" → **metric** (và alert dựa trên metric).
  - "Request này chậm 3 giây, chậm ở service nào?" → **trace**.
  - "Vì sao đơn #123 bị lỗi, message lỗi là gì?" → **log** (tìm theo `trace_id`/`order_id`).
- **Propagation (mục 3):** gateway sinh trace ID (hoặc nhận từ client) → gửi sang service B trong header HTTP (chuẩn W3C Trace Context dùng header `traceparent`) → B tạo span con, truyền tiếp sang C → khi publish message lên queue, nhét trace ID vào **header của message** để consumer tiếp tục cùng trace. Thư viện OpenTelemetry làm tự động phần lớn việc này.
- **SLI / SLO / SLA (mục 7):**
  - **SLI** (indicator): con số đo được. Ví dụ: tỷ lệ request `GET /orders` trả về thành công trong < 300 ms.
  - **SLO** (objective): mục tiêu nội bộ cho SLI. Ví dụ: 99,9% trong 30 ngày.
  - **SLA** (agreement): cam kết với khách hàng, **có hậu quả** (hoàn tiền) nếu vi phạm. SLA thường lỏng hơn SLO (ví dụ SLA 99,5%) để có vùng an toàn.
- **Tính downtime cho phép (SLO 99,9% / tháng 30 ngày):**
  - Một tháng = 30 × 24 × 60 = **43.200 phút**.
  - Phần được phép lỗi = 1 − 99,9% = 0,1% = 0,001.
  - Downtime cho phép = 43.200 × 0,001 = **43,2 phút/tháng**. Đây chính là **error budget** của tháng.

  | Availability | Downtime/tháng (30 ngày) | Downtime/năm |
  |---|---|---|
  | 99% | 7,2 giờ | ~3,65 ngày |
  | 99,9% | ~43,2 phút | ~8,76 giờ |
  | 99,95% | ~21,6 phút | ~4,38 giờ |
  | 99,99% | ~4,32 phút | ~52,6 phút |

  - Mỗi "số 9" thêm vào giảm downtime cho phép 10 lần, và chi phí tăng rất nhiều. Nhiều service nối tiếp nhau thì availability **nhân** với nhau: 3 service 99,9% nối tiếp ≈ 99,7%.
- **Structured logging (mục 2):** mỗi dòng log là một object JSON có trường cố định (`timestamp`, `level`, `service`, `trace_id`, `order_id`, `message`) thay vì chuỗi tự do. Nhờ vậy hệ thống log (ELK, Loki…) lọc được `trace_id = X` trên mọi service, đếm lỗi theo `service`, không phải viết regex.
- **Alert theo triệu chứng (mục 11):**
  - Tốt: "5% request `POST /orders` lỗi trong 5 phút" hoặc "tốc độ tiêu error budget gấp 10 lần bình thường" → người dùng đang bị ảnh hưởng, cần xử lý ngay.
  - Kém: "CPU 80%", "một pod restart" → có thể không ai bị ảnh hưởng; nhiều alert kiểu này làm đội quen bỏ qua alert (alert fatigue). Các chỉ số nguyên nhân để trên **dashboard** dùng khi điều tra, không đánh thức người trực.
- **Error budget dùng để làm gì:** còn budget → được release tính năng mới, chấp nhận rủi ro. Hết budget → đóng băng release, dồn sức sửa độ tin cậy. Đây là cách SRE biến "độ tin cậy" thành con số để thương lượng giữa dev và vận hành.

**🔴 Thẻ Anki (T1)**

1. Log, metric, trace: mỗi loại trả lời câu hỏi gì? Mỗi loại một ví dụ.
2. Trace ID được truyền qua HTTP và qua message queue thế nào?
3. Trace và span khác nhau thế nào?
4. Vì sao theo dõi latency bằng p99 tốt hơn bằng trung bình?
5. Kể four golden signals.
6. Phân biệt SLI, SLO, SLA bằng một ví dụ.
7. SLO 99,9% cho phép bao nhiêu phút downtime mỗi tháng? Tính thế nào?
8. Error budget là gì? Hết error budget thì đội làm gì?
9. Vì sao không đưa `user_id` vào label của metric?
10. Vì sao nên alert theo triệu chứng (tỷ lệ lỗi, p99, burn rate) thay vì theo nguyên nhân (CPU)?

**🟢 Tra cứu (T3):** opentelemetry.io (docs SDK theo ngôn ngữ), prometheus.io (các loại metric, PromQL), spec W3C Trace Context.

**Tài liệu:**
- Google *Site Reliability Engineering* book (miễn phí tại sre.google), **chương 4** *Service Level Objectives* (đọc lướt); chương 6 *Monitoring Distributed Systems* nếu còn giờ (phần four golden signals)
- ByteByteGo (YouTube): video về logging / metrics / tracing

**❓ Câu hỏi cuối bài**

1. Log, metric, trace: mỗi loại trả lời câu hỏi gì?
2. Trace ID được truyền qua các service bằng cách nào?
3. SLO 99,9% cho phép hệ thống ngừng hoạt động tối đa bao nhiêu phút mỗi tháng?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Latency trung bình của API là 120 ms nhưng người dùng vẫn than chậm. Vì sao con số trung bình đánh lừa? Bạn sẽ đo gì và đặt alert theo cái gì?
5. SLO 99,9%/30 ngày, mới giữa tháng đã mất 40 phút downtime. Đội nên làm gì với lịch release? SLA với khách hàng nên đặt cao hơn hay thấp hơn SLO? Vì sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Metric: bao nhiêu/bao thường xuyên, xu hướng, dùng để alert ("tỷ lệ 5xx có tăng không?").
- Trace: thời gian đi đâu qua nhiều service ("chậm ở service nào?").
- Log: chi tiết một sự kiện ("vì sao đơn #123 lỗi?"), structured JSON có `trace_id`.

**Câu 2.**
- Sinh trace ID ở cửa vào (gateway) hoặc nhận từ client.
- Truyền qua header HTTP (`traceparent`) và **header của message** trong queue; mỗi service tạo span con.
- Mọi dòng log ghi `trace_id` → tìm được toàn bộ log của một request; OpenTelemetry làm tự động phần lớn.

**Câu 3.**
- 30 × 24 × 60 = 43.200 phút; × 0,1% = **43,2 phút/tháng** (= error budget).
- Mỗi số 9 thêm vào giảm 10 lần (99,99% ≈ 4,3 phút).

**Câu 4.**
- Trung bình che đuôi: 95% request 50 ms + 5% request 3 s vẫn cho trung bình thấp, nhưng 5% người dùng chịu 3 s (và một trang gọi nhiều API thì gần như ai cũng dính đuôi).
- Đo histogram → p95/p99; theo dõi four golden signals (latency, traffic, errors, saturation).
- Alert theo triệu chứng: p99 vượt ngưỡng, tỷ lệ lỗi, burn rate của SLO; CPU để trên dashboard.

**Câu 5.**
- 40/43,2 phút → gần hết error budget → đóng băng release tính năng, ưu tiên sửa độ tin cậy tới hết kỳ.
- SLA **thấp hơn** (lỏng hơn) SLO, ví dụ 99,5%: SLA có phạt tiền, cần vùng an toàn để vi phạm SLO nội bộ chưa thành vi phạm hợp đồng.

</details>

---

## D82 (T6, 18/12): Case study News Feed

**⏱ Ước tính:** Giờ làm 45' (DSA 25' + Anki 20') · Tối 85' (Học 45' + Bảng T2 10' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h10'**

> Tối nay đọc chương 11 và điền bảng T2. *Khung tự giải 45'* bên dưới dùng khi ôn ở Tuần 14 (D94); không làm tối nay.

### 🧩 DSA (bấm giờ ≤ 25'): Làm lại [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

- **Pattern (🔴 T1):** *Topological sort / phát hiện chu trình trên đồ thị có hướng* (Tuần 7).
- **Mục tiêu bấm giờ:** ≤ 25'.
- **Kiểm tra:**
  - [ ] Làm được **một** trong hai cách trong giờ, và nói được cách còn lại: Kahn (BFS theo in-degree, đếm số node lấy ra == n) hoặc DFS 3 màu (đang thăm / đã xong).
  - [ ] Nói được chiều cạnh: `[a, b]` nghĩa là `b → a`.
  - [ ] O(V + E) thời gian và bộ nhớ.
  - [ ] Test: không có điều kiện tiên quyết; chu trình tự thân `[0, 0]`; đồ thị nhiều thành phần rời nhau.

### 📘 Bài học buổi tối: Case News Feed

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Hai luồng: **publish** bài viết và **xây feed** khi người dùng mở app | 🔴 T1 | Vẽ được hai luồng riêng | `news feed system design` |
| 2 | **Fan-out on write (push) vs fan-out on read (pull)** | 🟡 T2 | Điền bảng bên dưới | `fanout on write vs fanout on read` |
| 3 | Mô hình **hybrid**: push cho đa số, pull cho tài khoản có rất nhiều follower (celebrity) | 🔴 T1 | Giải thích được vì sao push cho celebrity là thảm hoạ (1 bài → hàng triệu lượt ghi) | `news feed celebrity problem hybrid fanout` |
| 4 | Feed cache chỉ lưu **ID bài viết** (và ID tác giả), nội dung lấy từ cache khác | 🔴 T1 | Giải thích được vì sao không lưu cả nội dung vào feed của từng người | `news feed cache post ids` |
| 5 | Các tầng cache: feed, nội dung bài, social graph, hành động (like), bộ đếm | 🔴 T1 | Kể được và nói mỗi tầng giúp gì | `news feed cache layers` |
| 6 | Phân trang feed bằng **cursor** (Tuần 4), không dùng offset | 🔴 T1 | Giải thích được vì sao offset bị lặp/sót bài khi có bài mới chen vào đầu | `cursor pagination feed` |
| 7 | Xếp hạng feed (ranking, ML) | 🟢 T3 | Chỉ nói "ngoài phạm vi" hoặc "sắp theo thời gian trước" | — |

**Chi tiết cần hiểu**

- **Push vs pull (mục 2):** *push* = lúc đăng bài, ghi ID bài vào feed cache của **mọi follower** → đọc feed rất nhanh (đã tính sẵn), nhưng ghi tốn kém và phí công cho follower không hoạt động. *Pull* = lúc mở feed, lấy bài mới của **mọi người mình theo dõi** rồi gộp → ghi rẻ, nhưng đọc chậm (phải gộp nhiều nguồn khi mở app).
- **Hybrid (mục 3):** đa số tài khoản dùng push; tài khoản có hàng triệu follower thì **không** fan-out; khi follower mở feed, hệ thống pull riêng bài của các celebrity mà họ theo dõi rồi trộn vào feed đã push sẵn.
- **Fan-out đi qua queue:** đăng bài → ghi DB → đẩy job fan-out vào queue → worker lấy danh sách follower (graph DB/cache) và ghi vào feed cache. Người đăng không phải chờ.
- **Feed cache:** mỗi user một danh sách có giới hạn (ví dụ vài trăm ID mới nhất) trong Redis; cuộn quá giới hạn thì quay về DB/pull.

**🟡 Bảng so sánh T2: Fan-out on write vs Fan-out on read**

Nhóm: *phân phối dữ liệu (đọc vs ghi)*, nhóm khác. Trục chính tự xác định: **chi phí ghi vs chi phí đọc**.

| Tiêu chí | Fan-out on write (push) | Fan-out on read (pull) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Write amplification | | |
| Ext: Latency khi đọc feed | | |
| Ext: Xử lý tài khoản celebrity / user không hoạt động | | |

**📝 Khung tự giải 45': News Feed**

- [ ] **1. Requirements (5–8')**
  - Mobile hay web? Feed gồm bài của bạn bè hay cả trang được theo dõi? Có ảnh/video không?
  - Sắp xếp theo thời gian hay theo ranking? Một người theo dõi tối đa bao nhiêu người?
  - Độ trễ chấp nhận được từ lúc đăng tới lúc bạn bè thấy?
  - Quy mô: DAU, số bài đăng mỗi ngày, số lần mở feed mỗi ngày.
- [ ] **2. Estimation (3–5')**
  - QPS đăng bài vs QPS đọc feed (đọc lớn hơn nhiều).
  - Số lượt ghi fan-out = số bài/ngày × số follower trung bình → thấy ngay vì sao celebrity là vấn đề.
  - Bộ nhớ feed cache = DAU × số ID giữ mỗi feed × 8–16 byte.
- [ ] **3. High-level design (10–15')**
  - API: `POST /v1/me/feed` (đăng bài), `GET /v1/me/feed?cursor=...` (đọc feed).
  - Luồng đăng: LB → post service → DB + cache nội dung → queue fan-out → worker → feed cache.
  - Luồng đọc: LB → feed service → feed cache (ID) → cache nội dung + cache user → gộp và trả về.
- [ ] **4. Deep dive (10–15')**
  - Push/pull/hybrid và ngưỡng coi là celebrity.
  - Các tầng cache và cái gì được lưu ở từng tầng.
  - Cursor pagination theo `post_id` (Snowflake, sắp theo thời gian, nối D68).
- [ ] **5. Trade-off / bottleneck (3–5')**
  - Worker fan-out tụt hậu khi có bài viral → theo dõi độ dài queue, scale worker.
  - Media để ở object storage + CDN.
  - Rate limit đăng bài; nhất quán kiểu eventual (bạn bè thấy bài sau vài giây là chấp nhận được).

**🔴 Thẻ Anki (T1)**

1. Vẽ 2 luồng của News Feed: đăng bài và đọc feed.
2. Vì sao fan-out on write cho tài khoản có hàng triệu follower là vấn đề? Hybrid giải quyết thế nào?
3. Vì sao feed cache chỉ lưu ID bài viết?
4. Kể các tầng cache của News Feed.
5. Vì sao feed dùng cursor pagination thay vì offset?
6. (T2) Khi nào chọn fan-out on read thay vì on write?

**🟢 Tra cứu (T3):** số liệu cụ thể trong ví dụ của sách; cấu trúc Redis sorted set/list cho feed (redis.io).

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 11** (*Design a News Feed System*)
- ByteByteGo (YouTube): video về thiết kế news feed

**❓ Câu hỏi cuối bài**

1. Fan-out khi ghi và fan-out khi đọc: trade-off là gì? Xử lý tài khoản có hàng triệu follower thế nào?
2. Nên cache những gì?
3. Phân trang feed ra sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Push (on write): ghi ID bài vào feed cache của mọi follower → đọc rất nhanh, ghi tốn, phí công cho user không hoạt động.
- Pull (on read): mở feed mới gộp bài của người mình theo dõi → ghi rẻ, đọc chậm.
- Hybrid: push cho đa số; celebrity không fan-out, follower pull riêng bài celebrity lúc đọc rồi trộn vào. Fan-out chạy bất đồng bộ qua queue.

**Câu 2.**
- Feed cache chỉ lưu **ID bài** (+ ID tác giả), giới hạn vài trăm ID/user → tiết kiệm bộ nhớ, nội dung sửa một chỗ.
- Các tầng khác: nội dung bài (bài nóng), user/social graph, hành động (đã like chưa), bộ đếm (like, comment).
- Media ở object storage + CDN.

**Câu 3.**
- Cursor theo `post_id`/thời gian (`?cursor=<id cuối>` → lấy bài có ID nhỏ hơn), không dùng offset.
- Offset bị lặp/sót bài khi có bài mới chen vào đầu; cursor ổn định và dùng được index.
- Post ID kiểu Snowflake sắp theo thời gian nên dùng thẳng làm cursor.

</details>

---

## D83 (T7, 19/12): Mock coding + Case Chat System

**⏱ Ước tính:** Mock coding 70' (60' + tự chấm 10') · Chat bắt buộc 1h55' (tự giải 45' + đọc ch.12 40' + ghi `sd-chat.md` 15' + bảng WebSocket vs Long polling 15') · Ôn ⚠️ 30' · **Tổng 3h35'** (+ mở rộng 10': bảng KV vs RDBMS, dời sang CN nếu chưa kịp)

### 🧩 DSA: Mock coding, 2 bài mới trong 60'

- **Luật chơi:** chưa xem đề trước. Đặt đồng hồ 60' cho cả 2 bài. Nói to suy nghĩ như đang có người phỏng vấn (hoặc quay màn hình). Không xem lời giải trong 60'.
- **Bộ đề gợi ý** (chưa có trong lộ trình; chọn một bộ, nếu đã làm rồi thì chọn bộ kia):
  - Bộ A: [36. Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) + [91. Decode Ways](https://leetcode.com/problems/decode-ways/)
  - Bộ B: [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) + [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)
- **Sau 60', tự chấm theo 4 tiêu chí** và ghi vào `notes/mock-log.md`:
  1. Có hỏi lại đề / nêu giả định và case biên trước khi code không?
  2. Có nói brute force trước rồi mới tối ưu không?
  3. Code chạy đúng mấy bài? Mất bao lâu mỗi bài?
  4. Có tự test bằng tay và nói độ phức tạp không?
- Bài nào không xong → Error List, làm lại sau 3 ngày và 7 ngày.

### 📘 Bài học buổi tối: Case Chat System (tự làm 45' trước, sau đó mới đọc Alex Xu ch.12)

**Quy trình:** đặt đồng hồ 45', đi theo *Khung tự giải* bên dưới, vẽ ra giấy. **Sau đó** mới đọc chương 12 và so sánh, ghi vào `notes/sd-chat.md` theo 3 mục như Lab tuần 10: **Mình làm được → Mình thiếu → Sách làm khác và vì sao**.

**Mục kiến thức cần học** (đọc sau khi đã tự làm)

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Server muốn **chủ động đẩy** tin cho client: polling, long polling, WebSocket | 🔴 T1 | Giải thích được vì sao HTTP request/response thường không đủ cho chat | `polling vs long polling vs websocket` |
| 2 | **WebSocket vs long polling** (vs polling) | 🟡 T2 | Điền bảng bên dưới | `websocket vs long polling` |
| 3 | Service **stateless** (đăng nhập, profile, danh sách nhóm: sau LB bình thường) vs **stateful** (chat server giữ kết nối WebSocket) | 🔴 T1 | Giải thích được vì sao chat server là stateful và hệ quả khi scale | `chat system stateful websocket servers` |
| 4 | Service discovery: chọn chat server cho client khi kết nối | 🔴 T1 | Biết client hỏi một service để lấy địa chỉ chat server phù hợp (sách dùng ZooKeeper) | `service discovery chat server zookeeper` |
| 5 | Luồng gửi tin 1–1: người gửi → chat server 1 → sinh message ID → queue/lưu trữ → chat server 2 của người nhận (nếu online) hoặc push notification (nếu offline) | 🔴 T1 | Vẽ được | `one on one chat message flow` |
| 6 | Lưu tin nhắn: **KV / wide-column** (HBase, Cassandra) vs RDBMS | 🟡 T2 | Nêu được đặc điểm tải: ghi rất nhiều, đọc chủ yếu tin gần đây, truy cập theo `channel_id` + thời gian | `chat message storage cassandra hbase` |
| 7 | Message ID sắp xếp được trong phạm vi một cuộc trò chuyện (Snowflake hoặc sequence theo channel) | 🔴 T1 | Nối được với D68 | `chat message id ordering` |
| 8 | **Presence** (online/offline) bằng **heartbeat**: client gửi nhịp định kỳ; quá X giây không có nhịp → offline | 🔴 T1 | Giải thích được vì sao không đổi offline ngay khi mất kết nối (mạng chập chờn làm trạng thái nhấp nháy) | `online presence heartbeat chat` |
| 9 | Đồng bộ nhiều thiết bị bằng `cur_max_message_id` của từng thiết bị | 🟢 T3 | Chỉ cần biết ý tưởng | — |

**🟡 Bảng so sánh T2: WebSocket vs Long polling (vs Polling)**

Nhóm: *protocol/API design*. Trục chính: **độ trễ đẩy tin** vs **chi phí tài nguyên và độ tương thích hạ tầng**.

| Tiêu chí | Polling | Long polling | WebSocket |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Latency khi có tin mới | | | |
| Ext: Tài nguyên server (kết nối, request rỗng) | | | |
| Ext: Tương thích proxy/LB, cách scale | | | |

**🟡 Bảng so sánh T2: Lưu tin nhắn ở KV/wide-column vs RDBMS** *(mở rộng: làm nếu còn giờ, nếu không thì điền ở CN D84)*

Nhóm: *data storage/model*. Extension theo bảng tra: Consistency model · Schema flexibility · Query capability.

| Tiêu chí | KV / wide-column (Cassandra, HBase) | RDBMS (PostgreSQL, MySQL) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Scale ghi theo chiều ngang | | |
| Ext: Query capability (join, truy vấn phức tạp) | | |

**📝 Khung tự giải 45': Chat System**

- [ ] **1. Requirements (5–8')**
  - Chat 1–1, nhóm (tối đa bao nhiêu người?), hay cả hai?
  - Mobile, web, hay cả hai? Một tài khoản đăng nhập nhiều thiết bị cùng lúc?
  - Có cần online/offline, đã xem (read receipt), gửi file không? Tin nhắn giữ bao lâu?
  - Quy mô: DAU, số tin nhắn mỗi người mỗi ngày, độ dài tin trung bình.
- [ ] **2. Estimation (3–5')**
  - QPS gửi tin trung bình/cao điểm.
  - Số kết nối WebSocket đồng thời (≈ số người online) → cần bao nhiêu chat server.
  - Dung lượng tin nhắn mỗi ngày/năm.
- [ ] **3. High-level design (10–15')**
  - Phần stateless (auth, user, group) sau LB; phần stateful (chat server + WebSocket); presence server; push notification (nối D75).
  - Service discovery để phân client vào chat server.
  - Kho tin nhắn KV + kho dữ liệu người dùng quan hệ.
- [ ] **4. Deep dive (10–15')**
  - Luồng gửi tin 1–1 và nhóm (nhóm nhỏ: mỗi thành viên một "hộp thư" riêng).
  - Message ID và thứ tự trong một cuộc trò chuyện.
  - Presence bằng heartbeat; phát trạng thái cho bạn bè qua pub/sub.
- [ ] **5. Trade-off / bottleneck (3–5')**
  - Chat server chết → client kết nối lại server khác; tin chưa giao nằm trong kho, không mất.
  - Nhóm rất lớn → chuyển cách phát tin; presence cho nhóm lớn chỉ lấy khi cần.
  - Mã hoá đầu cuối, lưu media ở object storage + CDN (chỉ nêu, không đi sâu).

**🔴 Thẻ Anki (T1)**

1. Vì sao chat cần server chủ động đẩy tin? Kể 3 cách.
2. Vì sao chat server là stateful? Hệ quả khi scale và khi server chết?
3. Vẽ luồng gửi tin 1–1 khi người nhận online và khi offline.
4. Message ID trong chat cần tính chất gì?
5. Presence dựa trên heartbeat hoạt động thế nào? Vì sao không đổi offline ngay khi mất kết nối?
6. (T2) Khi nào long polling vẫn là lựa chọn hợp lý thay vì WebSocket?
7. (T2) Vì sao tin nhắn chat hay được lưu ở KV/wide-column thay vì RDBMS?

**🟢 Tra cứu (T3):** RFC 6455 (WebSocket), docs WebSocket trên MDN, cấu hình proxy WebSocket của Nginx (khi cần).

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 12** (*Design a Chat System*), **chỉ đọc sau khi đã tự làm 45'**
- ByteByteGo (YouTube): video về WebSocket / thiết kế chat

**❓ Câu hỏi cuối bài**

1. WebSocket khác long polling thế nào?
2. Tin nhắn nên lưu vào đâu? Vì sao?
3. Hiển thị trạng thái online/offline bằng cách nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Một chat server đang giữ 50.000 kết nối WebSocket bị chết. Client và các tin nhắn đang gửi dở bị ảnh hưởng thế nào? Service discovery giúp gì khi client kết nối lại?
5. Người nhận đang offline: tin nhắn 1–1 đi qua những bước nào? Vì sao message ID phải sắp xếp được trong phạm vi một cuộc trò chuyện?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Long polling: client gửi request, server giữ tới khi có tin hoặc hết thời gian, rồi client gửi lại; vẫn là HTTP một chiều, tốn request, header lặp lại.
- WebSocket: một kết nối TCP lâu dài, hai chiều, sau bước upgrade từ HTTP; latency thấp, ít overhead.
- Cái giá của WebSocket: server stateful, cần LB/proxy hỗ trợ, scale khó hơn.

**Câu 2.**
- KV / wide-column (Cassandra, HBase): ghi cực nhiều, đọc chủ yếu tin gần đây theo `channel_id` + thời gian, scale ngang dễ.
- Khoá: partition theo `channel_id`, sắp theo `message_id`.
- RDBMS vẫn dùng cho dữ liệu người dùng/nhóm (quan hệ, ít ghi).

**Câu 3.**
- Client gửi heartbeat định kỳ (ví dụ 5 s) tới presence server; quá X giây (ví dụ 30 s) không có → offline.
- Không đổi offline ngay khi mất kết nối: mạng chập chờn sẽ làm trạng thái nhấp nháy.
- Thay đổi trạng thái phát cho bạn bè qua pub/sub; nhóm lớn chỉ lấy khi cần.

**Câu 4.**
- Client mất kết nối → kết nối lại (backoff + jitter để tránh 50.000 client ập vào cùng lúc) tới server khác.
- Tin đã được ghi vào kho trước khi báo "đã gửi" thì không mất; client gửi lại tin chưa được xác nhận (kèm ID để khử trùng).
- Service discovery (ZooKeeper, v.v.) trả về chat server còn sống, phù hợp (vị trí, tải) cho client.

**Câu 5.**
- Người gửi → chat server → sinh message ID → lưu kho KV → người nhận offline → push notification (qua Notification System D75); khi online lại, client kéo tin mới hơn `cur_max_message_id`.
- ID sắp xếp được → hiển thị đúng thứ tự, biết tin nào chưa đồng bộ; dùng Snowflake hoặc sequence theo channel.

</details>

**Sau đó (30'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D84 (CN, 20/12): Chốt tuần 12 + Chốt Giai đoạn 3

**⏱ Ước tính:** DSA 25' · Chốt tuần 70' (Flash Sale 45' + câu 2–5 25') · Tổng kết GĐ3 30' (bảng tự chấm + rút 10 thẻ) · Anki/cheat sheet 30' (gồm bảng Choreography vs Orchestration dời từ D80, bảng KV vs RDBMS nếu D83 chưa làm) · **Tổng 2h35'**

### 🧩 DSA (bấm giờ ≤ 25'): Làm lại [322. Coin Change](https://leetcode.com/problems/coin-change/)

- **Pattern (🔴 T1):** *Unbounded knapsack, dạng min* (Tuần 10).
- **Kiểm tra:**
  - [ ] Nói state / công thức chuyển / base case **trước** khi code.
  - [ ] Đưa ra được phản ví dụ cho greedy (`[1, 3, 4]`, `amount = 6`).
  - [ ] Xử lý `amount = 0` (trả 0) và trường hợp không tạo được (trả −1).
  - [ ] So sánh nhanh với 518: đổi `min` thành `+=` và đổi base case thì ra bài đếm số cách.

### ✅ Câu hỏi chốt tuần 12 — Tổng kết Giai đoạn 3

Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. **SD 45', đề mới:** *"Thiết kế hệ thống đặt hàng cho đợt flash sale"*. Đề này tổng hợp mọi thứ đã học: cache, queue, khoá tồn kho, rate limit, idempotency. (Làm theo khung bên dưới.)
2. Giải thích Saga + Outbox.
3. Giải thích Circuit Breaker.
4. Phân biệt SLI, SLO, SLA.
5. Trade-off của microservices.

**📝 Khung tự giải 45': Flash Sale** (làm trên giấy trước, **không** xem gợi ý trong ngoặc cho tới khi xong 45')

- [ ] **1. Requirements (5–8')**
  - Bao nhiêu sản phẩm, mỗi sản phẩm bao nhiêu suất? Mỗi người mua tối đa mấy suất?
  - Mở bán đúng một thời điểm? Giữ hàng bao lâu nếu chưa thanh toán?
  - Phi chức năng: **không bán quá tồn kho** (bắt buộc), chịu được đột biến tải, không trừ tiền trùng, chấp nhận người dùng chờ vài giây.
- [ ] **2. Estimation (3–5')**
  - Ví dụ 1 triệu người bấm trong 1 phút đầu → trung bình ~17.000 QPS, đỉnh trong vài giây đầu còn cao hơn nhiều.
  - Số đơn thành công **rất nhỏ** so với số request (chỉ bằng số suất) → phần lớn request cần bị loại **sớm và rẻ**.
- [ ] **3. High-level design (10–15')**
  - Trang sản phẩm tĩnh qua CDN; nút "Mua" chỉ bật đúng giờ.
  - Rate limit theo user/IP ở gateway (Tuần 10); có thể thêm hàng chờ ảo (waiting room).
  - Trừ tồn kho nguyên tử trên Redis (Lua / `DECR`, kiểm tra ≥ 0) để lọc nhanh (Tuần 10–11).
  - Request "giữ được suất" → đẩy vào queue → worker tạo đơn trong DB (Tuần 11).
  - DB là nguồn sự thật: `UPDATE inventory SET stock = stock - 1 WHERE product_id = ? AND stock > 0` (Tuần 7).
- [ ] **4. Deep dive (10–15')**
  - Idempotency key cho request đặt hàng: bấm nhiều lần không tạo nhiều đơn (Tuần 4).
  - Saga: giữ hàng → thanh toán → xác nhận; hết hạn thanh toán thì bù trừ: nhả hàng (D80).
  - Outbox để event "đơn đã tạo" không bị mất (D80); consumer idempotent (Tuần 11).
  - Circuit breaker + timeout khi gọi cổng thanh toán (D79).
- [ ] **5. Trade-off / bottleneck (3–5')**
  - Redis và DB lệch nhau (Redis trừ xong nhưng tạo đơn lỗi) → nhả suất khi lỗi + job đối soát định kỳ.
  - Hot key: một sản phẩm → một key Redis chịu toàn bộ tải → chia tồn kho thành nhiều key con (bucket).
  - Chống bot; monitoring (tỷ lệ 429, độ dài queue, số đơn/giây, p99) và SLO cho đợt sale (D81).

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1 (Flash Sale, phải nhắc tới):**
- Yêu cầu cứng: **không bán quá tồn kho**, không trừ tiền trùng; ước lượng thấy số request ≫ số suất → loại request **sớm và rẻ**.
- Thành phần: CDN cho trang tĩnh; rate limit + waiting room ở gateway; trừ tồn kho nguyên tử trên Redis (Lua/`DECR`); queue đệm → worker tạo đơn; DB là nguồn sự thật với `UPDATE ... WHERE stock > 0`.
- Đúng đắn: idempotency key cho request đặt hàng; Saga giữ hàng → thanh toán → xác nhận, hết hạn thì nhả hàng; Outbox + consumer idempotent; circuit breaker + timeout với cổng thanh toán.
- Trade-off: Redis lệch DB → nhả suất + job đối soát; hot key → chia tồn kho thành nhiều key con; SPOF Redis; monitoring + SLO riêng cho đợt sale.

**Câu 2.**
- Saga: chuỗi transaction cục bộ, mỗi bước có compensating transaction (semantic undo); không có isolation → trạng thái `PENDING`.
- Outbox: ghi nghiệp vụ + outbox cùng transaction; relay publish → at-least-once → consumer idempotent.
- Kết hợp: mỗi bước Saga phát event qua Outbox để không bao giờ "đổi trạng thái mà mất event".

**Câu 3.**
- Closed → (lỗi vượt ngưỡng) Open: fail fast + fallback → (hết thời gian chờ) Half-open: thử vài request → Closed hoặc Open lại.
- Mục đích: không đổ tải vào service đang hỏng, không giữ thread chờ vô ích, cho nó thời gian hồi phục.
- Đi cùng timeout, retry có giới hạn (breaker bọc ngoài retry), bulkhead.

**Câu 4.**
- SLI: con số đo được (tỷ lệ request thành công < 300 ms).
- SLO: mục tiêu nội bộ cho SLI (99,9%/30 ngày → error budget 43,2 phút).
- SLA: cam kết với khách hàng có hậu quả (hoàn tiền), lỏng hơn SLO.

**Câu 5.**
- Lợi ích: deploy/scale độc lập, cô lập lỗi, team tự chủ.
- Cái giá: gọi qua mạng, transaction phân tán, eventual consistency, vận hành/observability/test khó hơn.
- Database-per-service; tránh distributed monolith; team nhỏ/sản phẩm mới → modular monolith trước.

</details>

### 📊 Tổng kết Giai đoạn 3 (Tuần 9–12)

**Tự chấm các case study đã làm** (mỗi bài nói lại được trong ≤ 25', đủ 5 bước):

| Case | Tuần | Tự làm trên giấy? | Nói lại được trong 25'? | Điểm còn yếu |
|---|---|---|---|---|
| "Gõ URL vào trình duyệt" | 9 | | | |
| URL Shortener | 10 | | | |
| Rate Limiter | 10 | | | |
| Unique ID Generator | 10 | | | |
| Notification System | 11 | | | |
| News Feed | 12 | | | |
| Chat System | 12 | | | |
| Flash Sale (chốt GĐ3) | 12 | | | |

**Các T1 cốt lõi của Giai đoạn 3 phải nói trôi chảy** (rút 10 thẻ ngẫu nhiên trong Anki deck `T1` của Tuần 9–12, cần trả lời đúng ≥ 8):

- Process vs thread, race condition; TCP vs UDP; "gõ URL" (Tuần 9)
- Stateless + load balancer; consistent hashing (Tuần 9)
- Khung SD 5 bước; ước lượng QPS/storage; bậc latency (Tuần 10)
- Token bucket + atomic trên Redis; Snowflake; UUID và B-Tree (Tuần 10)
- Delivery guarantees + consumer idempotent; partition/consumer group; CAP + mô hình nhất quán (Tuần 11)
- Database-per-service; timeout/retry/backoff/jitter/circuit breaker/bulkhead; Saga + Outbox; 3 trụ cột observability; SLI/SLO/SLA + error budget (Tuần 12)

**Các bảng T2 phải có trong cheat sheet:** Load balancing algorithms (Tuần 9), Hash vs Base62, 301 vs 302, thuật toán rate limiting, UUID vs Snowflake (Tuần 10), Kafka vs RabbitMQ vs SQS, CP vs AP (Tuần 11), Monolith vs Microservices, 2PC vs Saga, Choreography vs Orchestration, Fan-out write vs read, WebSocket vs Long polling (Tuần 12).

**Checklist cuối tuần + cuối Giai đoạn 3**

- [ ] Đạt ≥ 4/5 câu chốt tuần 12 (câu 1 phải làm đủ 45' trên giấy)
- [ ] `notes/sd-chat.md` và bản vẽ Flash Sale đã lưu vào `notes/`
- [ ] Làm lại đủ 6 bài bấm giờ (238, 3, 33, 146, 207, 322); bài nào quá 25' đã vào Error List
- [ ] `notes/mock-log.md` có kết quả mock coding D83
- [ ] Anki: đã nhập thẻ T1 của D78–D83; rút thẻ ngẫu nhiên Tuần 9–12 đạt ≥ 8/10
- [ ] Cheat sheet: đã điền bảng Monolith vs Microservices, 2PC vs Saga, Choreography vs Orchestration, Fan-out write vs read, WebSocket vs Long polling, KV vs RDBMS cho chat
- [ ] Bảng tự chấm case study ở trên đã điền, mọi ô "Điểm còn yếu" có kế hoạch ôn trong Tuần 14 (D94)
- [ ] Mini Order Service: rate limiter (Tuần 10) + luồng event idempotent có DLQ (Tuần 11) vẫn chạy được; README ghi rõ nếu áp dụng Outbox thì sửa luồng publish ở chỗ nào
- [ ] Đạt chốt Giai đoạn 3

> 💡 **Từ tuần 12, nên bắt đầu nộp CV** vào 2–3 công ty bạn *ít ưu tiên* để lấy kinh nghiệm phỏng vấn thật.

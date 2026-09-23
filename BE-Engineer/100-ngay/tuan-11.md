# Tuần 11 (07/12 – 13/12): DP 2D, Trie, Message Queue, CAP

[← Tuần 10](tuan-10.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 12 →](tuan-12.md)

**Mục tiêu tuần:** Hiểu xử lý bất đồng bộ, delivery guarantee, consumer idempotent và định lý CAP. Làm được bài Notification System. Về DSA: dựng được bảng DP 2D (lưới, hai chuỗi) và cài được Trie từ đầu.

> **Cách học theo Tier** (🔴 T1 → Anki, 🟡 T2 → bảng so sánh trong `notes/tradeoff-cheatsheet.md`, 🟢 T3 → chỉ lưu link/snippet): xem lại bảng ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Học đến đâu thì dừng theo cột *Cần nắm tới mức nào*.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Vì sao cần message queue (decoupling, bất đồng bộ, đệm tải), producer/consumer, ack, retry + backoff, DLQ, poison message, consumer lag + backpressure, point-to-point vs pub/sub (mô hình), **delivery guarantees** (at-most / at-least / exactly-once), consumer idempotent, log phân vùng (partition, offset, consumer group, thứ tự trong partition), xung đột giữa thứ tự và retry, **CAP** (và các ngộ nhận hay gặp), các mô hình nhất quán (strong / eventual / read-your-writes / monotonic reads / causal), cách lập luận của case Notification System, pattern DSA: DP lưới / DP hai chuỗi / Trie / expand-around-center / unbounded knapsack đếm tổ hợp | **Kafka vs RabbitMQ vs SQS**, đồng bộ vs bất đồng bộ cho một tác vụ cụ thể, SQS Standard vs FIFO, chọn AP hay CP cho một tính năng, push vs pull consumer | Cú pháp khai báo exchange/queue/DLX của RabbitMQ, config Kafka (`acks`, `enable.idempotence`, `isolation.level`), giới hạn throughput cụ thể của SQS FIFO, PACELC (biết tên), tên nhà cung cấp APNs/FCM/Twilio/SendGrid, thuật toán Manacher, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

Không tính 1h tiếng Anh mỗi ngày (giữ riêng). Anki tuần này ~20'/ngày.

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D71 (T2) | 65' | 85' | 2h30' |
| D72 (T3) | 75' | 80' | 2h35' |
| D73 (T4) | 65' | 90' | 2h35' |
| D74 (T5) | 65' | 85' | 2h30' |
| D75 (T6) | 65' | 75' | 2h20' |
| D76 (T7) | — | 3h55' | 3h55' |
| D77 (CN) | — | 2h55' | 2h55' |

**Tổng tuần: 19h20'**

Ngày nặng nhất là **Lab D76**: bản gốc cần ~4h35', nên đã tách thành phần *bắt buộc* (3h55') và *mở rộng* (20', dời sang CN D77 nếu chưa kịp). D72 và D73 là hai buổi tối dày nhất (DP hai chuỗi 55' và bảng Kafka/RabbitMQ/SQS 3 cột).

---

## D71 (T2, 07/12): Message Queue

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 85' (Học 45' + Bảng T2 10' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h30'**

### 🧩 DSA: [62. Unique Paths](https://leetcode.com/problems/unique-paths/)

- **Pattern (🔴 T1):** *DP 2D trên lưới*. Ô `(r, c)` chỉ đến được từ ô trên hoặc ô bên trái.
- **Gợi ý DP:**
  - **State:** `dp[r][c]` = số đường đi từ `(0, 0)` tới `(r, c)`.
  - **Công thức chuyển:** `dp[r][c] = dp[r-1][c] + dp[r][c-1]`.
  - **Base case:** hàng đầu và cột đầu đều bằng 1 (chỉ có một đường đi thẳng).
- **Các cách:**
  1. Bảng 2D → O(m·n) thời gian, O(m·n) bộ nhớ.
  2. Nén còn 1 hàng: `row[c] += row[c-1]` → O(n) bộ nhớ.
  3. Tổ hợp: chọn (m−1) lần đi xuống trong tổng (m+n−2) bước → C(m+n−2, m−1). O(min(m, n)) thời gian.
- **Key insight:** "ô hiện tại chỉ phụ thuộc hàng trên và ô bên trái" → luôn nén được bộ nhớ DP lưới xuống một hàng. Người phỏng vấn hay hỏi câu này.

### 📘 Bài học buổi tối: Message Queue (vì sao cần, producer/consumer, ack, retry, DLQ)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Vì sao cần MQ: decoupling, xử lý bất đồng bộ, đệm tải (load leveling), fan-out cho nhiều consumer | 🔴 T1 | Kể được 3 lợi ích, mỗi lợi ích một ví dụ trong hệ thống đặt hàng | `why use message queue benefits` |
| 2 | Producer, consumer, broker, queue/topic | 🔴 T1 | Vẽ được sơ đồ và nói vai trò mỗi thành phần | `message queue producer consumer broker` |
| 3 | Mô hình point-to-point (mỗi message một consumer) vs pub/sub (mỗi subscriber nhận một bản) | 🔴 T1 | Cho ví dụ mỗi mô hình | `point to point vs publish subscribe` |
| 4 | Đồng bộ vs bất đồng bộ cho một tác vụ | 🟡 T2 | Có tiêu chí chọn (xem bên dưới) | `synchronous vs asynchronous processing when to use` |
| 5 | **Ack**: consumer báo "đã xử lý xong" → broker mới xoá message; không ack thì message được giao lại | 🔴 T1 | Phân biệt ack trước khi xử lý và ack sau khi xử lý (nối sang D72) | `message acknowledgement manual ack` |
| 6 | Prefetch / visibility timeout: giới hạn số message một consumer đang giữ; hết thời gian mà chưa ack thì message hiện lại | 🔴 T1 | Hiểu được vì sao consumer chậm hoặc chết không làm mất message | `rabbitmq prefetch`, `sqs visibility timeout` |
| 7 | **Retry** với backoff, số lần tối đa | 🔴 T1 | Biết vì sao không retry ngay lập tức vô hạn | `message retry exponential backoff` |
| 8 | **DLQ** (dead letter queue) và *poison message* | 🔴 T1 | Biết khi nào đẩy vào DLQ và phải làm gì với DLQ (alert, xem lỗi, replay) | `dead letter queue poison message` |
| 9 | Cú pháp khai báo exchange/queue/DLX của RabbitMQ | 🟢 T3 | Tra docs khi làm lab D76 | `rabbitmq dead letter exchange` |
| 10 | **Consumer lag** (số message chưa xử lý) và **backpressure** (bên nhận quá tải thì làm bên gửi chậm lại) | 🔴 T1 | Biết lag tăng liên tục nghĩa là gì và kể được 3 cách xử lý (xem bên dưới) | `kafka consumer lag monitoring`, `backpressure message queue` |

**Chi tiết cần hiểu**

- **Ba lợi ích (mục 1) bằng ví dụ đặt hàng:**
  - *Decoupling:* Order service chỉ publish `OrderCreated`; không cần biết có Email, Analytics hay Loyalty service nào đang nghe. Thêm consumer mới không phải sửa Order service.
  - *Bất đồng bộ → giảm latency:* API tạo đơn trả về ngay, không chờ gửi email (có thể mất vài giây).
  - *Đệm tải:* flash sale có 10.000 đơn/giây nhưng dịch vụ email chỉ xử lý 500/giây → queue giữ phần dư, consumer xử lý dần. Dịch vụ email sập thì message vẫn nằm chờ trong queue, không mất.
- **Khi nào nên đồng bộ (mục 4):** khi người gọi **cần kết quả ngay** để trả lời người dùng (kiểm tra tồn kho, trừ tiền). Khi nào bất đồng bộ: tác vụ phụ, chậm, được phép trễ vài giây, hoặc gọi hệ thống bên ngoài không ổn định (email, SMS, push, cập nhật search index).
- **Retry và DLQ (mục 7, 8):**
  - Lỗi **tạm thời** (timeout, bên thứ ba 503) → retry với khoảng chờ tăng dần (1s, 2s, 4s…).
  - Lỗi **vĩnh viễn** (dữ liệu sai định dạng, bug) → retry bao nhiêu lần cũng hỏng; đây là *poison message*. Nếu cứ requeue ngay, nó chặn cả queue và đốt CPU.
  - Sau N lần (ví dụ 3–5) vẫn lỗi → chuyển sang DLQ, bắn alert. Sửa xong nguyên nhân thì replay từ DLQ.
- **Consumer lag và backpressure (mục 10):**
  - *Lag* = độ dài queue (RabbitMQ/SQS) hoặc `offset mới nhất − offset đã commit` (Kafka). Lag dao động rồi về 0 là bình thường (queue đang làm đúng việc đệm tải). Lag **tăng mãi** nghĩa là consumer xử lý chậm hơn tốc độ producer đẩy vào; queue chỉ trì hoãn vấn đề chứ không giải quyết nó.
  - Xử lý: (1) scale thêm consumer (Kafka: tối đa bằng số partition); (2) tìm chỗ chậm trong consumer (DB, API ngoài), xử lý theo lô; (3) **backpressure**: giới hạn prefetch, giới hạn độ dài queue (`x-max-length`) hoặc cho producer nhận lỗi/429 để chậm lại, thay vì để queue phình tới hết đĩa/RAM.
  - Luôn **alert theo lag** (hoặc tuổi của message cũ nhất), không chỉ theo tỷ lệ lỗi: consumer "sống" nhưng quá chậm vẫn là sự cố.
- **Cái giá của MQ:** thêm một thành phần phải vận hành; eventual consistency; debug khó hơn (cần trace ID, Tuần 12); phải xử lý message trùng (D72).

**🟡 Bảng so sánh T2: Đồng bộ vs Bất đồng bộ (qua queue)**

Nhóm: *messaging/streaming*. Trục chính: **tính tức thời của kết quả** vs **độ bền và khả năng chịu tải**.

| Tiêu chí | Gọi đồng bộ (HTTP/gRPC) | Bất đồng bộ qua queue |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Delivery guarantee khi bên nhận đang sập | | |
| Ext: Latency người dùng cảm nhận | | |

**🔴 Thẻ Anki (T1)**

1. Kể 3 lợi ích của message queue, mỗi cái một ví dụ.
2. Point-to-point khác pub/sub thế nào?
3. Ack là gì? Consumer chết trước khi ack thì chuyện gì xảy ra?
4. Poison message là gì? Vì sao không requeue nó ngay lập tức mãi?
5. Khi nào đẩy message vào DLQ? Sau đó phải làm gì với DLQ?
6. (T2) Khi nào một tác vụ nên xử lý đồng bộ thay vì qua queue?
7. (DSA-Pattern) Đếm đường đi trên lưới chỉ đi phải/xuống → DP lưới, nén được còn một hàng.

**🟢 Tra cứu (T3):** RabbitMQ docs (rabbitmq.com) phần *Dead Letter Exchanges*, *Consumer Acknowledgements and Publisher Confirms*; AWS SQS docs phần *visibility timeout* và *dead-letter queues*.

**Tài liệu:**
- ByteByteGo (YouTube/blog): các video/bài về message queue và event-driven architecture
- NeetCode: video giải *Unique Paths* (mục 2-D Dynamic Programming)

**❓ Câu hỏi cuối bài**

1. Kể 3 lợi ích của message queue.
2. Gửi email xác nhận sau khi đặt hàng nên làm đồng bộ hay bất đồng bộ? Vì sao?
3. Consumer xử lý lỗi thì sao: retry như thế nào, khi nào đẩy vào DLQ?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Consumer lấy một message, xử lý được nửa chừng thì chết. Với manual ack (RabbitMQ) hoặc visibility timeout (SQS), message đó đi đâu? Nếu consumer ack ngay khi nhận thì sao?
5. Consumer lag của queue `email` tăng đều suốt 30 phút, không có lỗi nào. Nguyên nhân có thể là gì? Bạn xử lý thế nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Decoupling: Order chỉ publish `OrderCreated`, thêm consumer mới không sửa producer.
- Bất đồng bộ: API trả về ngay, việc chậm (email) làm sau → giảm latency.
- Đệm tải: flash sale dồn message vào queue, consumer xử lý dần; consumer sập thì message vẫn chờ.

**Câu 2.**
- Bất đồng bộ: người dùng không cần chờ email để biết đặt hàng thành công; email chậm, phụ thuộc bên thứ ba.
- Nhà cung cấp email lỗi không được làm hỏng việc đặt hàng; queue giữ message để retry.
- Chấp nhận trễ vài giây, nhưng phải không mất (queue bền) và không trùng (idempotent).

**Câu 3.**
- Lỗi tạm thời → retry có exponential backoff, giới hạn số lần (3–5).
- Lỗi vĩnh viễn (poison message) → không requeue ngay mãi (chặn queue, đốt CPU).
- Quá N lần → DLQ + alert; sửa nguyên nhân rồi replay.

**Câu 4.**
- Chưa ack → khi kết nối/channel đóng (RabbitMQ) hoặc hết visibility timeout (SQS), message được giao lại cho consumer khác → không mất, nhưng có thể xử lý trùng.
- Ack ngay khi nhận → broker xoá message, consumer chết thì message **mất** (at-most-once).
- Prefetch giới hạn số message một consumer giữ chưa ack.

**Câu 5.**
- Không lỗi mà lag tăng → consumer chậm hơn producer: nhà cung cấp email chậm, DB chậm, quá ít consumer, hoặc lượng message tăng đột biến (chiến dịch marketing).
- Xử lý: scale consumer, xử lý theo lô, tìm điểm chậm; backpressure (giới hạn queue, producer chậm lại).
- Alert theo lag / tuổi message cũ nhất.

</details>

---

## D72 (T3, 08/12): Delivery guarantees + consumer idempotent

**⏱ Ước tính:** Giờ làm 75' (DSA 55' + Anki 20') · Tối 80' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h35'**

### 🧩 DSA: [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

- **Pattern (🔴 T1):** *DP hai chuỗi*. State là cặp tiền tố `(i, j)` của hai chuỗi.
- **Gợi ý DP:**
  - **State:** `dp[i][j]` = độ dài LCS của `text1[0..i)` và `text2[0..j)`.
  - **Công thức chuyển:** nếu `text1[i-1] == text2[j-1]` thì `dp[i][j] = dp[i-1][j-1] + 1`; ngược lại `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.
  - **Base case:** hàng 0 và cột 0 bằng 0 (một chuỗi rỗng).
- **Độ phức tạp:** O(m·n) thời gian; O(m·n) bộ nhớ, nén được còn O(min(m, n)) bằng 2 hàng.
- **Key insight:** dùng bảng kích thước `(m+1) × (n+1)` với hàng/cột 0 là chuỗi rỗng giúp bỏ hẳn các `if` biên. Khung này dùng lại cho Edit Distance, diff của Git.

### 📘 Bài học buổi tối: Delivery guarantees + consumer idempotent

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **At-most-once**: có thể mất, không bao giờ trùng | 🔴 T1 | Chỉ ra được thời điểm ack/commit offset gây ra nó (ack **trước** khi xử lý) | `at most once at least once exactly once` |
| 2 | **At-least-once**: không mất, có thể trùng | 🔴 T1 | Chỉ ra được vì sao bị trùng (xử lý xong, chết trước khi ack) | `at least once delivery duplicate` |
| 3 | **Exactly-once**: vì sao khó; "exactly-once processing" = at-least-once + idempotent | 🔴 T1 | Giải thích được vì sao mạng không tin cậy khiến bên gửi không phân biệt được "mất message" và "mất ack" | `exactly once semantics impossible`, `two generals problem` |
| 4 | **Idempotency**: làm N lần cho kết quả như làm 1 lần | 🔴 T1 | Đã gặp ở Tuần 4 (idempotency key cho API). Nhận ra đây cùng một nguyên lý | `idempotent consumer pattern` |
| 5 | Các cách làm consumer idempotent: bảng chống trùng theo message ID, unique key nghiệp vụ, upsert, kiểm tra trạng thái/version | 🔴 T1 | Thiết kế được một consumer cụ thể (xem bên dưới) | `idempotent consumer deduplication table`, `upsert idempotency` |
| 6 | Phía producer cũng gây trùng: retry publish khi không nhận được xác nhận | 🔴 T1 | Biết publisher confirm (RabbitMQ) / `acks` (Kafka) là để producer biết broker đã nhận | `publisher confirms`, `kafka producer acks` |
| 7 | Kafka "exactly-once" (idempotent producer + transaction) | 🟢 T3 | Chỉ cần biết: nó đúng trong phạm vi **đọc từ Kafka – ghi vào Kafka**; side effect ra ngoài (gửi email, ghi DB khác) vẫn cần idempotent | `kafka exactly once semantics idempotent producer transactions` |

**Chi tiết cần hiểu**

- **Thời điểm ack quyết định guarantee:**
  - Ack/commit offset **trước** rồi mới xử lý → chết giữa chừng thì message mất → at-most-once.
  - Xử lý **xong** rồi mới ack → chết sau khi xử lý nhưng trước khi ack → message được giao lại → at-least-once, bị trùng.
- **Vì sao chọn at-least-once + idempotent:** mất đơn hàng/mất thông báo thanh toán thường không chấp nhận được, còn trùng thì **tự chặn được** ở consumer. Exactly-once end-to-end cần phối hợp giữa broker và mọi hệ thống bên ngoài, đắt và nhiều giới hạn.
- **Thiết kế consumer idempotent (mục 5), cách phổ biến nhất:**
  - Mỗi message có một `event_id` duy nhất do producer sinh (UUID/Snowflake), **không** dùng ID nội bộ của broker.
  - Bảng `processed_events(event_id PRIMARY KEY, processed_at)`.
  - Trong **cùng một transaction DB**: `INSERT INTO processed_events` + thay đổi nghiệp vụ. Bị lỗi trùng khoá → message đã xử lý → bỏ qua và ack.
  - Hoặc dùng unique key nghiệp vụ: ví dụ `UNIQUE(order_id, notification_type)` trên bảng thông báo đã gửi.
  - Khi side effect nằm **ngoài** DB (gọi API gửi email) thì không gói chung transaction được → truyền idempotency key sang bên thứ ba nếu họ hỗ trợ, hoặc ghi trạng thái "đang gửi/đã gửi" và chấp nhận xác suất trùng rất nhỏ.
- **Thao tác vốn đã idempotent:** `SET status = 'PAID'`, upsert theo khoá. **Không idempotent:** `balance = balance + 100`, `INSERT` không có unique key, gửi email.

**🔴 Thẻ Anki (T1)**

1. Ack trước khi xử lý cho ra guarantee nào? Ack sau khi xử lý thì sao?
2. Vì sao at-least-once gây trùng? Cho một kịch bản cụ thể.
3. Vì sao exactly-once end-to-end khó đạt?
4. Idempotent nghĩa là gì? Cho 2 thao tác idempotent và 2 thao tác không idempotent.
5. Mô tả consumer idempotent dùng bảng `processed_events`. Vì sao phải cùng một transaction với thay đổi nghiệp vụ?
6. Producer có thể gây trùng message ở đâu?
7. (DSA-Pattern) Bài so sánh hai chuỗi (LCS, edit distance) → DP 2D `dp[i][j]` trên hai tiền tố.

**🟢 Tra cứu (T3):** Kafka docs (kafka.apache.org) phần *delivery semantics*; RabbitMQ docs phần *Consumer Acknowledgements and Publisher Confirms*.

**Tài liệu:**
- ByteByteGo (YouTube/blog): bài về delivery semantics (at-most-once / at-least-once / exactly-once)
- microservices.io: trang *Idempotent Consumer*

**❓ Câu hỏi cuối bài**

1. Phân biệt at-most-once, at-least-once, exactly-once.
2. Vì sao thực tế thường chọn at-least-once kết hợp consumer idempotent?
3. Thiết kế một consumer idempotent (bảng chống trùng, unique key).

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Producer publish một message, chờ confirm thì bị timeout nên publish lại. Consumer có thể thấy gì? Vì sao producer không thể biết chắc lần đầu đã tới broker hay chưa?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- At-most-once: ack/commit **trước** khi xử lý → có thể mất, không trùng.
- At-least-once: xử lý xong mới ack → chết trước ack thì giao lại → không mất, có thể trùng.
- Exactly-once: mỗi message có hiệu lực đúng một lần; end-to-end rất khó, thực tế là at-least-once + idempotent.

**Câu 2.**
- Mất dữ liệu (đơn, thanh toán) thường không chấp nhận được; trùng thì consumer tự chặn được.
- Mạng không tin cậy: bên gửi không phân biệt "mất message" với "mất ack" → buộc phải gửi lại → trùng là không tránh khỏi.
- Exactly-once end-to-end cần mọi hệ thống bên ngoài phối hợp → đắt, nhiều giới hạn.

**Câu 3.**
- `event_id` duy nhất do producer sinh (không dùng ID nội bộ của broker).
- `processed_events(event_id PK)` + thay đổi nghiệp vụ trong **cùng một transaction**; trùng khoá → bỏ qua và ack.
- Hoặc unique key nghiệp vụ / upsert / kiểm tra trạng thái; side effect bên ngoài → idempotency key của nhà cung cấp.

**Câu 4.**
- Có thể có **2 bản** của cùng message (lần 1 đã tới, chỉ confirm bị mất).
- Producer chỉ thấy "không có phản hồi", không biết mất ở chiều đi hay chiều về (two generals).
- Vì vậy dùng cùng một `event_id` cho lần gửi lại để consumer khử trùng; Kafka có idempotent producer để khử trùng phía broker.

</details>

---

## D73 (T4, 09/12): Kafka vs RabbitMQ vs SQS

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 90' (Học 45' + Bảng T2 15' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h35'**

> Mục 5 (SQS Standard vs FIFO) và mục 7 (push vs pull) không có bảng riêng: chỉ ghi 1–2 dòng vào cheat sheet. Nếu hết giờ, hai mục này là **(tuỳ chọn)**, ôn lại ở Chủ Nhật.

### 🧩 DSA: [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)

- **Pattern (🔴 T1):** *Trie*: cây mà mỗi cạnh là một ký tự, đường đi từ gốc là một tiền tố.
- **Cấu trúc node:** `children` (HashMap ký tự → node, hoặc mảng 26 phần tử) + cờ `isEnd` (có từ kết thúc tại đây).
- **Các thao tác:** `insert`, `search`, `startsWith` đều đi từ gốc theo từng ký tự → **O(L)** với L là độ dài từ, không phụ thuộc số từ trong Trie.
- **Khác biệt duy nhất** giữa `search` và `startsWith`: `search` cần node cuối có `isEnd = true`.
- **So sánh:** HashSet tra cả từ cũng O(L), nhưng **không** trả lời được "có từ nào bắt đầu bằng `ab` không" mà không duyệt hết. Đó là lý do Trie tồn tại.
- **Bộ nhớ:** O(tổng số ký tự của mọi từ) trong trường hợp xấu nhất; mảng 26 nhanh hơn nhưng tốn bộ nhớ hơn HashMap khi Trie thưa.

### 📘 Bài học buổi tối: Kafka vs RabbitMQ vs SQS

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Mô hình **log phân vùng** (Kafka): topic → partition → offset; message được **giữ lại** theo retention, không xoá khi đọc | 🔴 T1 | Vẽ được topic 3 partition, 2 consumer group | `kafka topic partition offset explained` |
| 2 | Thứ tự trong Kafka: chỉ đảm bảo **trong một partition**; cùng key → cùng partition | 🔴 T1 | Biết chọn key (ví dụ `order_id`) để các event của cùng một đơn đi theo thứ tự | `kafka ordering guarantee partition key` |
| 3 | **Consumer group**: mỗi partition chỉ được một consumer trong group đọc; số consumer hữu ích ≤ số partition | 🔴 T1 | Trả lời được: topic 4 partition, group có 6 consumer thì 2 consumer làm gì? (ngồi không) | `kafka consumer group rebalance` |
| 4 | Mô hình **smart broker** (RabbitMQ): exchange (direct/topic/fanout) định tuyến vào queue, ack từng message, message xoá sau khi ack | 🔴 T1 | Vẽ được exchange → binding → queue | `rabbitmq exchange types direct topic fanout` |
| 5 | SQS: queue được quản lý hoàn toàn (managed), pull + visibility timeout; Standard vs FIFO | 🟡 T2 | Biết Standard = at-least-once, thứ tự best-effort; FIFO = đúng thứ tự trong message group, có khử trùng | `sqs standard vs fifo` |
| 6 | **Kafka vs RabbitMQ vs SQS** | 🟡 T2 | Điền bảng so sánh bên dưới + tạo 1 thẻ Anki "khi nào chọn cái nào" | `kafka vs rabbitmq vs sqs` |
| 7 | Push (RabbitMQ đẩy tới consumer) vs pull (Kafka/SQS consumer tự kéo) | 🟡 T2 | Nêu được một ưu điểm của mỗi kiểu (push: latency thấp; pull: consumer tự điều tốc) | `push vs pull message broker` |
| 8 | Giới hạn throughput cụ thể, số partition tối đa, config broker | 🟢 T3 | Tra docs khi cần | — |
| 9 | **Thứ tự + retry**: đẩy message lỗi sang retry queue/topic thì các message sau của cùng key sẽ "vượt lên" | 🔴 T1 | Nêu được 3 cách xử lý và trade-off (xem bên dưới) | `kafka retry topic ordering`, `message ordering retries` |

**Chi tiết cần hiểu**

- **Khác biệt cốt lõi:** Kafka là **log** (lưu lại, nhiều group đọc độc lập, đọc lại/replay được, throughput rất cao nhờ ghi tuần tự). RabbitMQ là **hàng đợi tác vụ** thông minh (định tuyến linh hoạt, ack/retry từng message, ưu tiên, TTL, DLX sẵn có). SQS là **hàng đợi managed**: không phải vận hành server, tính tiền theo request, tích hợp AWS.
- **Scale xử lý bằng consumer group (mục 3):** muốn xử lý nhanh gấp đôi → thêm consumer vào group; Kafka chia lại partition (rebalance). Nhưng trần song song = số partition, nên phải chọn số partition dư ra từ đầu. Nhiều group khác nhau (Email, Analytics) đọc **cùng** topic mà không ảnh hưởng nhau, mỗi group có offset riêng.
- **Thứ tự trong RabbitMQ:** một queue giữ thứ tự FIFO, nhưng khi có nhiều consumer cùng queue, hoặc message bị requeue, thì thứ tự xử lý không còn được đảm bảo.
- **Thứ tự và retry đánh nhau (mục 9):** `OrderPaid` của đơn #1 lỗi và bị đẩy sang retry topic; consumer đọc tiếp `OrderShipped` của cùng đơn và xử lý trước → sai thứ tự. Ba cách:
  1. **Retry tại chỗ (blocking):** không đọc message kế tiếp của partition cho tới khi message hiện tại xong. Giữ thứ tự, nhưng một message hỏng chặn cả partition → vẫn cần giới hạn số lần rồi chuyển DLQ.
  2. **Retry topic (non-blocking):** không chặn, nhưng mất thứ tự → consumer phải chịu được sai thứ tự: kiểm tra `version`/trạng thái hiện tại và bỏ qua event cũ hơn (nối với idempotent D72).
  3. Khi một key đang có message nằm trong retry, đẩy luôn các message sau của **cùng key** vào retry theo (giữ thứ tự theo key, phức tạp hơn).
  - Phía producer Kafka: retry gửi lại có thể đảo thứ tự nếu cho nhiều request đang bay cùng lúc mà không bật idempotent producer (🟢 T3: `enable.idempotence`, `max.in.flight.requests.per.connection`).
- **Gợi ý chọn nhanh:**
  - Luồng sự kiện rất lớn, nhiều bên cùng đọc, cần replay (log, clickstream, CDC) → Kafka.
  - Hàng đợi tác vụ, định tuyến phức tạp, retry/DLQ theo từng message (gửi email, xử lý ảnh) → RabbitMQ.
  - Đang ở AWS, không muốn vận hành broker, tải vừa phải → SQS.

**🟡 Bảng so sánh T2: Kafka vs RabbitMQ vs SQS**

Nhóm: *messaging/streaming*. Trục chính: **guarantee vs throughput**. Extension theo bảng tra: Delivery guarantee · Ordering guarantee · Throughput ceiling.

| Tiêu chí | Kafka | RabbitMQ | SQS |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Delivery guarantee | | | |
| Ext: Ordering guarantee (phạm vi nào?) | | | |
| Ext: Throughput ceiling | | | |

> Khi điền xong, thêm một dòng ghi chú bên dưới bảng: *"Có giữ lại message để replay không?"*. Đây là câu người phỏng vấn hay hỏi thêm.

**🔴 Thẻ Anki (T1)**

1. Topic, partition, offset trong Kafka là gì?
2. Kafka đảm bảo thứ tự ở phạm vi nào? Làm sao để mọi event của một đơn hàng đi theo thứ tự?
3. Topic 4 partition, consumer group có 6 consumer: chuyện gì xảy ra?
4. Hai consumer group khác nhau đọc cùng một topic có ảnh hưởng nhau không? Vì sao?
5. RabbitMQ: exchange, binding, queue quan hệ với nhau thế nào?
6. (T2) Khi nào chọn RabbitMQ thay vì Kafka? Khi nào chọn SQS?
7. (DSA-Pattern) Đề hỏi về tiền tố / autocomplete / nhiều từ chung tiền tố → Trie, thao tác O(L).

**🟢 Tra cứu (T3):** Kafka docs (kafka.apache.org) phần *Introduction* và *Design*; RabbitMQ tutorials (rabbitmq.com); AWS SQS Developer Guide phần *FIFO queues* (giới hạn throughput, message group ID, deduplication ID).

**Tài liệu:**
- ByteByteGo (YouTube): video so sánh Kafka / RabbitMQ / message queue và video *Why is Kafka fast*
- NeetCode: video giải *Implement Trie*

**❓ Câu hỏi cuối bài**

1. Lập bảng so sánh ba hệ thống.
2. Kafka đảm bảo thứ tự message ở phạm vi nào?
3. Consumer group giúp scale việc xử lý thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Consumer Kafka xử lý `OrderPaid` của đơn #1 bị lỗi, bạn đẩy nó sang retry topic rồi đọc tiếp `OrderShipped` của cùng đơn. Có vấn đề gì? Nêu 2 cách xử lý và trade-off.
5. Event `OrderCreated` cần tới cả Email service và Analytics service, mỗi service chạy 3 consumer. Thiết kế exchange/queue trên RabbitMQ thế nào? Trên Kafka làm tương đương ra sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Kafka: log phân vùng, giữ message theo retention, replay được, throughput rất cao, thứ tự trong partition; không hợp cho định tuyến phức tạp/retry từng message.
- RabbitMQ: smart broker, exchange định tuyến, ack/retry/DLX từng message, xoá sau ack; không giữ để replay, throughput thấp hơn.
- SQS: managed, không vận hành, Standard (at-least-once, best-effort order) / FIFO (thứ tự theo message group, khử trùng); gắn với AWS.

**Câu 2.**
- Chỉ trong **một partition**; giữa các partition không có thứ tự.
- Cùng key (ví dụ `order_id`) → cùng partition → event của một đơn đúng thứ tự.
- Retry/requeue có thể phá thứ tự nếu không cẩn thận.

**Câu 3.**
- Mỗi partition chỉ do một consumer trong group đọc → thêm consumer thì chia partition (rebalance).
- Trần song song = số partition; consumer dư thì ngồi không.
- Nhiều group đọc cùng topic độc lập, mỗi group có offset riêng.

**Câu 4.**
- `OrderShipped` được xử lý trước `OrderPaid` → sai trạng thái đơn.
- Retry tại chỗ (blocking): giữ thứ tự nhưng message hỏng chặn cả partition.
- Retry topic: không chặn nhưng consumer phải kiểm tra version/trạng thái, bỏ event cũ; hoặc đẩy cả các message sau của cùng key vào retry.

**Câu 5.**
- RabbitMQ: exchange `fanout`/`topic` → 2 queue riêng (`email.*`, `analytics.*`); 3 consumer **cùng một queue** cạnh tranh nhau (point-to-point trong service, pub/sub giữa service).
- Kafka: 1 topic, 2 consumer group (`email`, `analytics`), mỗi group 3 consumer; topic cần ≥ 3 partition.

</details>

---

## D74 (T5, 10/12): CAP và các mô hình nhất quán

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 85' (Học 45' + Bảng T2 10' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h30'**

> Mục 9 (đọc lướt DDIA ch.9) là **(tuỳ chọn)**, chỉ làm khi còn giờ.

### 🧩 DSA: [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)

- **Pattern (🔴 T1):** *Trie + DFS/backtracking*. Giống bài 208, nhưng ký tự `.` khớp với mọi ký tự.
- **Gợi ý:** `search(word, i, node)`:
  - Nếu `i == len(word)` → trả về `node.isEnd`.
  - Ký tự thường → đi xuống đúng một con (không có thì `false`).
  - Ký tự `.` → thử **mọi** con, chỉ cần một nhánh trả `true`.
- **Độ phức tạp:** `addWord` O(L). `search` không có `.` là O(L); có `.` thì xấu nhất phải duyệt nhiều nhánh (tới O(26^k) với k dấu chấm, bị chặn bởi tổng số node của Trie).
- **Key insight:** Trie + DFS là nền của bài 212 *Word Search II* (khó hơn, chỉ cần biết tồn tại).

### 📘 Bài học buổi tối: CAP, các mô hình nhất quán

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **CAP** phát biểu đúng: khi có **network partition**, hệ thống phân tán phải chọn giữa Consistency (linearizable) và Availability | 🔴 T1 | Nói được vì sao "chọn 2 trong 3" là cách hiểu sai (P không phải lựa chọn; mạng **sẽ** bị chia cắt) | `CAP theorem explained correctly`, `CAP theorem misconceptions` |
| 2 | Định nghĩa C và A **trong CAP** (khác chữ C trong ACID) | 🔴 T1 | C = mọi lần đọc thấy lần ghi mới nhất; A = mọi node còn sống đều trả lời (không lỗi) | `CAP consistency vs ACID consistency` |
| 3 | Ví dụ hệ CP và AP | 🔴 T1 | CP: ZooKeeper, etcd, HBase, cụm DB đòi quorum để ghi. AP: Cassandra/DynamoDB (cấu hình mặc định), DNS, giỏ hàng của Amazon Dynamo | `CP vs AP database examples` |
| 4 | Chọn AP hay CP cho **một tính năng cụ thể** | 🟡 T2 | Điền bảng bên dưới cho 3 tính năng: số dư ví, số lượt like, tồn kho flash sale | `when to choose AP vs CP` |
| 5 | Mô hình nhất quán: strong (linearizable), eventual, read-your-writes, monotonic reads, causal | 🔴 T1 | Mỗi mô hình một câu định nghĩa + một ví dụ lỗi người dùng thấy khi thiếu nó | `consistency models read your writes monotonic reads causal` |
| 6 | Kỹ thuật đạt read-your-writes: đọc từ leader ngay sau khi ghi, sticky session, đọc từ replica đã theo kịp version | 🔴 T1 | Liên hệ replication lag ở Tuần 8 | `read your writes replication lag` |
| 7 | Quorum `R + W > N` | 🔴 T1 | Giải thích được vì sao tập đọc và tập ghi phải giao nhau | `quorum read write R W N` |
| 8 | PACELC (khi không có partition: chọn Latency hay Consistency) | 🟢 T3 | Chỉ cần biết tồn tại, là phần mở rộng của CAP | `PACELC theorem` |
| 9 | Linearizability, consensus (Raft/Paxos) chi tiết | 🟢 T3 | Đọc lướt DDIA ch.9 cho có khái niệm; Raft/Paxos để sau 100 ngày | — |

**Chi tiết cần hiểu**

- **Vì sao phải chọn khi partition:** hai node mất kết nối với nhau. Client ghi vào node 1. Client khác đọc từ node 2. Node 2 chỉ có hai lựa chọn: trả dữ liệu cũ (giữ **A**, mất **C**) hoặc từ chối/đợi (giữ **C**, mất **A**). Không có lựa chọn thứ ba.
- **Khi mạng bình thường** thì hệ thống có thể vừa C vừa A; lúc đó trade-off thực sự là **latency vs consistency** (đây là ý của PACELC).
- **Các ngộ nhận hay gặp về CAP** (người phỏng vấn hay "gài"):
  1. *"Chọn 2 trong 3", có hệ "CA"*: trong hệ phân tán không bỏ được P. Một DB chạy một node thì không phải bài toán CAP.
  2. *C của CAP = C của ACID*: sai. CAP-C là linearizability (đọc thấy lần ghi mới nhất); ACID-C là giữ ràng buộc/invariant của dữ liệu.
  3. *Một hệ thống "là" CP hoặc AP cho mọi thứ*: thực tế tuỳ cấu hình **từng thao tác** (Cassandra chọn consistency level mỗi query; DynamoDB có tuỳ chọn strongly consistent read).
  4. *AP nghĩa là dữ liệu lộn xộn mãi*: AP vẫn hội tụ (eventual); chỉ là trong lúc partition có thể đọc thấy dữ liệu cũ.
  5. *CAP nói về latency/hiệu năng*: không, CAP chỉ nói về lúc có partition. Latency là phần "ELC" của PACELC.
- **Mô hình nhất quán (mục 5), ví dụ lỗi khi thiếu:**
  - *Read-your-writes:* sửa tên xong, F5 lại thấy tên cũ (đọc trúng replica chưa kịp cập nhật).
  - *Monotonic reads:* F5 lần 1 thấy comment mới, F5 lần 2 comment biến mất (lần 2 đọc trúng replica chậm hơn).
  - *Causal:* thấy câu trả lời trước khi thấy câu hỏi.
  - *Eventual:* chỉ hứa "nếu ngừng ghi, cuối cùng mọi replica sẽ giống nhau", không hứa khi nào.
- **Giao diện xử lý eventual consistency:** optimistic UI (hiển thị ngay kết quả phía client), hiện trạng thái "đang xử lý", đọc lại từ leader cho chính người vừa ghi, không hứa con số chính xác theo thời gian thực (lượt like hiển thị "1,2K").

**🟡 Bảng so sánh T2: Chọn CP vs AP cho một tính năng**

Nhóm: *data storage/model*. Trục chính: **consistency vs availability khi có sự cố mạng**.

| Tiêu chí | Ưu tiên CP | Ưu tiên AP |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Consistency model người dùng thấy | | |
| Ext: Hành vi khi partition (lỗi hay dữ liệu cũ?) | | |
| Ext: Ví dụ tính năng (ví, like, tồn kho) | | |

**🔴 Thẻ Anki (T1)**

1. Phát biểu CAP cho đúng. Vì sao "chọn 2 trong 3" là cách hiểu sai?
2. Chữ C trong CAP khác chữ C trong ACID thế nào?
3. Kể 2 hệ thống CP và 2 hệ thống AP.
4. Read-your-writes là gì? Kể 2 cách đạt được.
5. Monotonic reads bảo vệ người dùng khỏi hiện tượng gì?
6. Vì sao quorum cần `R + W > N`?
7. (T2) Tính năng tồn kho flash sale nên ưu tiên C hay A? Còn số lượt like?
8. (DSA-Pattern) Tìm kiếm có ký tự đại diện trên tập từ → Trie + DFS thử mọi nhánh tại ký tự đại diện.

**🟢 Tra cứu (T3):** tài liệu Jepsen (jepsen.io) về các mô hình nhất quán nếu muốn đọc thêm; PACELC.

**Tài liệu:**
- ByteByteGo (YouTube): video về CAP theorem
- DDIA, **chương 9** (*Consistency and Consensus*): đọc lướt phần linearizability và phần so sánh với CAP
- DDIA chương 5 (đã đọc thêm ở Tuần 8): mục *Problems with Replication Lag* là nơi định nghĩa read-your-writes, monotonic reads

**❓ Câu hỏi cuối bài**

1. Phát biểu CAP cho đúng: khi mạng bị chia cắt (partition) thì phải chọn C hoặc A.
2. Cho ví dụ một hệ thống chọn AP và một hệ thống chọn CP.
3. Eventual consistency ảnh hưởng tới trải nghiệm người dùng ra sao? Giao diện nên xử lý thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. User đổi avatar xong, F5 lại vẫn thấy ảnh cũ. Gọi tên mô hình nhất quán bị thiếu, giải thích nguyên nhân và nêu 2 cách sửa.
5. Cụm có `N = 3`, cấu hình `W = 2`, `R = 1`. Có đảm bảo đọc thấy bản ghi mới nhất không? Vì sao? Nên đổi thành gì?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Khi có network partition, hệ phân tán phải chọn: trả lời (có thể dữ liệu cũ, giữ A) hoặc từ chối/đợi (giữ C).
- P không phải lựa chọn: mạng **sẽ** bị chia cắt; "chọn 2 trong 3" là cách hiểu sai.
- C = linearizable (khác C của ACID); A = mọi node còn sống đều trả lời.

**Câu 2.**
- CP: ZooKeeper, etcd, cụm DB cần quorum để ghi → partition thì từ chối ghi.
- AP: Cassandra/DynamoDB (mặc định), DNS, giỏ hàng Amazon Dynamo → vẫn trả lời, dữ liệu có thể cũ.
- Gắn với tính năng: số dư ví/tồn kho → CP; lượt like → AP.

**Câu 3.**
- Người dùng có thể thấy dữ liệu cũ, dữ liệu "nhảy" giữa các lần tải, thấy trả lời trước câu hỏi.
- UI: optimistic UI, trạng thái "đang xử lý", đọc từ leader cho chính người vừa ghi, hiển thị số xấp xỉ ("1,2K").

**Câu 4.**
- Thiếu **read-your-writes**: ghi vào leader, đọc trúng replica chưa kịp cập nhật (replication lag).
- Sửa: đọc từ leader trong một khoảng ngắn sau khi ghi; sticky session; đọc từ replica đã theo kịp version/timestamp của lần ghi.

**Câu 5.**
- `R + W = 3`, không lớn hơn `N` → tập đọc và tập ghi có thể không giao nhau → có thể đọc trúng node chưa có bản mới.
- Cần `R + W > N`: ví dụ `W = 2, R = 2` (hoặc `W = 3, R = 1`).
- Đổi lại: đọc/ghi chậm hơn, ít chịu lỗi node hơn.

</details>

---

## D75 (T6, 11/12): Case study Notification System

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 75' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h20'**

> Tối nay chỉ đọc chương 10 và trả lời câu hỏi. *Khung tự giải 45'* bên dưới dùng để luyện cho câu 4 Chốt tuần (D77).

### 🧩 DSA: [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/)

- **Pattern (🔴 T1):** *Expand around center* (mở rộng từ tâm). Mỗi palindrome có một tâm: một ký tự (độ dài lẻ) hoặc giữa hai ký tự (độ dài chẵn).
- **Các cách:**
  1. Brute force: xét mọi substring và kiểm tra → O(n³).
  2. DP: `dp[i][j] = (s[i] == s[j]) && (j - i < 2 || dp[i+1][j-1])`, điền theo độ dài tăng dần → O(n²) thời gian, O(n²) bộ nhớ.
  3. Mở rộng từ 2n−1 tâm → O(n²) thời gian, **O(1)** bộ nhớ. Đây là cách nên code khi phỏng vấn.
  4. Manacher O(n): 🟢 T3, chỉ cần biết tồn tại.
- **Lỗi hay gặp:** quên tâm chẵn (`"abba"`).

### 📘 Bài học buổi tối: Case Notification System

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Các loại thông báo và nhà cung cấp: push iOS/Android, SMS, email | 🔴 T1 (ý tưởng) / 🟢 T3 (tên nhà cung cấp) | Biết hệ thống của mình **không tự gửi** mà gọi nhà cung cấp bên thứ ba (APNs, FCM, dịch vụ SMS/email) | `notification system design APNs FCM` |
| 2 | Thu thập thông tin liên lạc: device token, số điện thoại, email lưu lúc đăng ký/cài app | 🔴 T1 | Vẽ được bảng `user` + `device` (một user nhiều thiết bị) | `device token storage notification` |
| 3 | Kiến trúc: service gọi → notification server (validate, template, settings) → **queue riêng cho từng kênh** → worker → nhà cung cấp | 🔴 T1 | Vẽ được và giải thích vì sao tách queue theo kênh | `notification system per channel queue` |
| 4 | Chống gửi trùng: event ID + bảng/Redis đã gửi | 🔴 T1 | Nối được với consumer idempotent D72 | `notification deduplication` |
| 5 | Retry và rate limit khi gọi bên thứ ba | 🔴 T1 | Retry có backoff, tôn trọng quota của nhà cung cấp, DLQ | `third party api rate limit retry backoff` |
| 6 | User settings (opt-out từng kênh), template, notification log, tracking (sent/delivered/opened) | 🔴 T1 | Kể được và nói mỗi thứ nằm ở bước nào của luồng | `notification template user preference` |
| 7 | Soft real-time: chấp nhận trễ vài giây, nhưng không được mất | 🔴 T1 | Biết đây là lý do chọn at-least-once + queue | — |
| 8 | Chi tiết API của APNs/FCM, định dạng payload | 🟢 T3 | Tra docs khi làm thật | — |

**Chi tiết cần hiểu**

- **Vì sao queue riêng cho từng kênh (mục 3):** nhà cung cấp SMS sập hoặc bị giới hạn thì chỉ queue SMS ùn lại, push và email vẫn chạy bình thường (đây là ý tưởng *bulkhead*, sẽ học ở Tuần 12). Mỗi kênh có tốc độ, quota và chính sách retry khác nhau; mỗi queue scale số worker độc lập.
- **Chống trùng (mục 4):** mỗi yêu cầu thông báo mang `notification_id`/`event_id`. Worker kiểm tra trong DB/Redis trước khi gửi; gửi xong đánh dấu. Vì queue là at-least-once, **không thể** bỏ bước này.
- **Rate limit (mục 5):**
  - Phía nhà cung cấp: worker giới hạn tốc độ gọi theo quota (token bucket, D67), nhận 429 thì lùi lại.
  - Phía người dùng: không gửi quá N thông báo/ngày cho một user (tránh bị gỡ app).
- **Luồng đầy đủ:** service → notification server (kiểm tra settings, dựng template, ghi log) → queue theo kênh → worker (dedup, rate limit, gọi nhà cung cấp) → lỗi thì retry có backoff → quá N lần thì DLQ + alert → tracking sự kiện delivered/clicked về analytics.

**📝 Khung tự giải 45': Notification System**

- [ ] **1. Requirements (5–8')**
  - Những kênh nào: push, SMS, email? Cả iOS và Android?
  - Real-time tới mức nào (vài giây có được không)? Có cần gửi theo lịch không?
  - Người dùng có tắt được từng kênh không? Có cần thống kê mở/click không?
  - Quy mô: bao nhiêu thông báo mỗi ngày cho mỗi kênh?
- [ ] **2. Estimation (3–5')**
  - QPS gửi trung bình và cao điểm theo từng kênh (ví dụ chiến dịch marketing gửi hàng triệu email cùng lúc).
  - Dung lượng notification log mỗi ngày.
- [ ] **3. High-level design (10–15')**
  - Nguồn phát → notification server → queue theo kênh → worker → APNs/FCM/SMS/email.
  - Bảng `user`, `device`, `notification_setting`, `notification_log`, `template`.
- [ ] **4. Deep dive (10–15')**
  - Không mất: queue bền + at-least-once. Không trùng: dedup theo ID.
  - Retry/backoff/DLQ; rate limit theo quota nhà cung cấp và theo user.
  - Template + đa ngôn ngữ; kiểm tra opt-out trước khi đưa vào queue.
- [ ] **5. Trade-off / bottleneck (3–5')**
  - Notification server stateless → scale ngang; cache settings/template.
  - Một nhà cung cấp sập → chuyển sang nhà cung cấp dự phòng (failover).
  - Monitoring: độ dài queue, tỷ lệ lỗi theo nhà cung cấp, độ trễ từ lúc tạo tới lúc gửi.

**🔴 Thẻ Anki (T1)**

1. Vẽ luồng Notification System từ service nguồn tới nhà cung cấp.
2. Vì sao tách queue riêng cho từng kênh gửi?
3. Queue at-least-once thì chống gửi trùng thông báo bằng cách nào?
4. Gọi nhà cung cấp bên thứ ba bị 429 hoặc timeout thì worker làm gì?
5. Kiểm tra opt-out của người dùng nên đặt ở bước nào? Vì sao?
6. (DSA-Pattern) Tìm palindrome dài nhất trong chuỗi → expand around center, 2n−1 tâm, O(n²) thời gian O(1) bộ nhớ.

**🟢 Tra cứu (T3):** docs của Apple Push Notification service và Firebase Cloud Messaging; docs nhà cung cấp SMS/email bạn định dùng.

**Tài liệu:**
- Alex Xu, *System Design Interview* Tập 1, **chương 10** (*Design a Notification System*)
- ByteByteGo (YouTube): video về thiết kế notification system

**❓ Câu hỏi cuối bài**

1. Vẽ kiến trúc có queue riêng cho từng kênh gửi.
2. Chống gửi trùng thông báo bằng cách nào?
3. Xử lý retry và rate limit khi gọi nhà cung cấp bên thứ ba ra sao?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Kiểm tra opt-out của người dùng và dựng template nên đặt ở notification server hay ở worker? Một user có 3 thiết bị thì lưu thông tin liên lạc thế nào và gửi push ra sao?
5. Vì sao Notification System chọn "queue bền + at-least-once" thay vì để service nguồn gọi thẳng nhà cung cấp đồng bộ?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Service nguồn → notification server (validate, settings, template, log) → queue riêng cho push/SMS/email → worker từng kênh → APNs/FCM/SMS/email.
- Tách queue theo kênh: một nhà cung cấp sập chỉ kênh đó ùn (bulkhead); mỗi kênh có quota/retry riêng; scale worker độc lập.

**Câu 2.**
- Mỗi yêu cầu mang `notification_id`/`event_id`; worker kiểm tra DB/Redis đã gửi chưa, gửi xong đánh dấu.
- Hoặc unique key `(event_id, channel, user_id)`; bắt buộc vì queue là at-least-once.

**Câu 3.**
- Lỗi tạm thời/timeout/429 → retry có exponential backoff (+ jitter), giới hạn số lần → DLQ + alert.
- Worker tự giới hạn tốc độ theo quota nhà cung cấp (token bucket); giới hạn số thông báo/user/ngày.
- Nhà cung cấp sập → failover sang nhà cung cấp dự phòng.

**Câu 4.**
- Opt-out + template ở **notification server, trước khi vào queue** → không tốn chỗ queue/worker cho thông báo sẽ bị bỏ, và luôn đọc settings mới nhất (có cache).
- Bảng `device(user_id, device_token, platform, ...)`: một user nhiều dòng; push gửi tới từng token, token hết hạn thì xoá.

**Câu 5.**
- Soft real-time: được trễ vài giây, nhưng **không được mất**.
- Gọi thẳng: nhà cung cấp chậm/sập làm chậm/hỏng service nguồn, không có chỗ giữ để retry, không đệm được đợt gửi lớn.
- Queue bền giữ message, at-least-once đảm bảo không mất, dedup lo phần trùng.

</details>

---

## D76 (T7, 12/12): Lab

**⏱ Ước tính:** DSA 40' · Lab bắt buộc 2h55' (Bước 1 15' + Bước 2 40' + Bước 3 60' + Bước 4 40' + Bước 5a 20') · Ôn ⚠️ 20' · **Tổng 3h55'** (+ mở rộng 20': Bước 5b, dời sang CN nếu chưa kịp)

> Bản gốc của lab cần ~4h35'. Để giữ Thứ Bảy ≤ 4h: phần ôn ⚠️ rút còn 20' (Chủ Nhật đã có Error List), "làm lại bài sai" chuyển thành tuỳ chọn, và Bước 5 tách thành *bắt buộc* (5a) và *mở rộng* (5b).

### 🧩 DSA: [518. Coin Change II](https://leetcode.com/problems/coin-change-ii/)

- **Pattern (🔴 T1):** *Unbounded knapsack, dạng đếm **tổ hợp***. So sánh trực tiếp với bài 322 (Tuần 10).
- **Gợi ý DP:**
  - **State:** `dp[a]` = số cách tạo ra tổng `a` (không phân biệt thứ tự đồng xu).
  - **Công thức chuyển:** với mỗi đồng `c`, với `a` từ `c` tới `amount`: `dp[a] += dp[a - c]`.
  - **Base case:** `dp[0] = 1` (một cách: không lấy đồng nào).
- **Key insight quan trọng nhất:** vòng ngoài là **đồng xu**, vòng trong là **tổng** → đếm tổ hợp (`1+2` và `2+1` là một). Đảo hai vòng → đếm **hoán vị** (đó là bài 377 *Combination Sum IV*). Tự chạy tay với `coins = [1, 2], amount = 3` theo hai thứ tự để thấy 2 cách vs 3 cách.
- **Độ phức tạp:** O(amount × số loại xu) thời gian, O(amount) bộ nhớ.
- Sau đó làm lại 1 bài sai trong tuần (nếu có). *(Tuỳ chọn: chỉ làm nếu còn giờ, nếu không thì để Error List của Chủ Nhật.)*

### 🛠 Lab (3–4h): Luồng event cho Mini Order Service

**Mục tiêu:** tạo đơn → publish `OrderCreated` lên RabbitMQ → consumer gửi "email" giả. Consumer phải **idempotent**, có **retry** và **DLQ**. Làm bằng ngôn ngữ/framework bạn đang dùng.

**Bước 1: Hạ tầng (15')**
- Thêm RabbitMQ vào `docker compose` (image có management plugin để mở UI ở cổng 15672).
- Khai báo topology bằng code khi app khởi động (🟢 T3, cú pháp tra docs và lưu vào `notes/snippets.md`):

  | Thành phần | Tên gợi ý | Ghi chú |
  |---|---|---|
  | Exchange chính | `orders` (type `topic`, durable) | |
  | Queue chính | `notification.order-created` (durable) | bind với routing key `order.created`; khai báo argument `x-dead-letter-exchange` trỏ tới exchange DLX |
  | Queue retry | `notification.order-created.retry` | không có consumer; argument `x-message-ttl` (ví dụ 5000 ms) + `x-dead-letter-exchange = orders` + `x-dead-letter-routing-key = order.created` → hết TTL thì message tự quay lại queue chính. Thiếu `x-dead-letter-routing-key` thì message giữ routing key cũ (tên queue retry) và **không** khớp binding nào |
  | Exchange DLX + DLQ | `orders.dlx` (type `fanout`) → `notification.order-created.dlq` | nơi chứa message hỏng hẳn |

**Bước 2: Producer (40')**
- Sau khi transaction tạo đơn **commit thành công**, publish message **persistent**:
  `{ "event_id": "<UUID>", "event_type": "OrderCreated", "order_id": ..., "user_id": ..., "total": ..., "occurred_at": ... }`
- Bật **publisher confirms**; không nhận được confirm thì log lỗi + retry có giới hạn.
- **Ghi vào README như một hạn chế đã biết:** nếu DB commit xong mà publish thất bại (app chết đúng lúc đó) thì event bị mất. Đây là bài toán *dual write*; Tuần 12 (D80) sẽ giải bằng **Outbox pattern**. Tuần này chưa cần làm.

**Bước 3: Consumer idempotent (60')**
- Manual ack, `prefetch` khoảng 10.
- Bảng `processed_events(event_id PRIMARY KEY, processed_at)` và bảng `sent_emails(id, order_id, to_email, subject, created_at)` (đây là "email giả": ghi một dòng thay vì gửi thật).
- Xử lý một message trong **một transaction DB**:
  1. `INSERT INTO processed_events(event_id)`. Nếu lỗi trùng khoá → message đã xử lý → commit/rollback rồi **ack** và bỏ qua.
  2. `INSERT INTO sent_emails(...)`.
  3. Commit → **ack**.
- Vì "email" nằm trong cùng DB nên đây là idempotent thật sự. Ghi chú trong README: nếu gửi email thật qua API bên ngoài thì không gói chung transaction được, phải dùng idempotency key của nhà cung cấp hoặc chấp nhận rủi ro trùng rất nhỏ.

**Bước 4: Retry + DLQ (40')**
- Giả lập lỗi bằng biến môi trường hoặc dữ liệu đặc biệt, ví dụ:
  - Email chứa `transient` → lỗi ở 2 lần đầu, lần 3 thành công.
  - Email chứa `poison` → luôn lỗi.
- Khi xử lý lỗi: đọc header đếm số lần thử (tự đặt header, ví dụ `x-retry-count`, hoặc đọc header `x-death` do RabbitMQ gắn).
  - Còn dưới 3 lần → publish bản sao vào queue retry (qua default exchange, routing key = tên queue retry) với `x-retry-count + 1`, rồi ack message gốc.
  - Đủ 3 lần → chuyển vào DLQ (publish sang `orders.dlx` hoặc `nack` với `requeue=false` để RabbitMQ tự dead-letter), log lỗi mức ERROR.
- **Không** dùng `nack` với `requeue=true` cho mọi lỗi: poison message sẽ quay vòng vô hạn.

**Bước 5: Kiểm chứng (40' = 5a bắt buộc 20' + 5b mở rộng 20')**

*5a. Bắt buộc:*
- Test trùng: publish **cùng một** `event_id` hai lần (bằng tay qua management UI hoặc script) → `sent_emails` chỉ có 1 dòng.
- Test crash: đặt breakpoint/`sleep` sau khi commit nhưng trước khi ack, kill consumer → khởi động lại → message được giao lại nhưng không sinh email thứ hai.
- Test DLQ: đơn có email `poison` → sau 3 lần nằm trong DLQ, không có email nào.

*5b. Mở rộng (làm nếu còn giờ, nếu không thì dời sang Chủ Nhật D77):*
- Test retry: đơn có email `transient` → cuối cùng có đúng 1 email, log thấy 2 lần retry.
- Chạy 2 instance consumer cùng lúc → mỗi message chỉ được một instance xử lý thành công.

**Sản phẩm bàn giao**
- Code producer + consumer + khai báo topology trong `project/`.
- Mục "Event flow" trong README: sơ đồ `API → DB → RabbitMQ → consumer → sent_emails`, delivery guarantee đã chọn (at-least-once + idempotent), chính sách retry, cách xem và replay DLQ, hạn chế dual write.

**Tiêu chí đạt**
- [ ] Tạo đơn thì trong ≤ vài giây có đúng 1 dòng `sent_emails`.
- [ ] Publish trùng `event_id` và kill consumer trước ack đều **không** sinh email trùng.
- [ ] Message `transient` thành công sau retry; message `poison` vào DLQ sau đúng 3 lần.
- [ ] Giải thích được bằng lời: consumer của bạn đang là at-least-once hay exactly-once? Vì sao?

**Bước 6 (20'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D77 (CN, 13/12): Chốt tuần 11

**⏱ Ước tính:** DSA 65' (Error List 15' + làm lại 1143 và 518 50') · Chốt tuần 60' · Anki/cheat sheet 30' · Lab mở rộng dời từ D76 20' · **Tổng 2h55'**

**DSA:** Làm lại bài trong Error List (ưu tiên các bài có "ngày làm lại" rơi vào hôm nay; giới hạn 15', bài đến hạn còn lại chuyển sang ngày làm lại kế tiếp). Sau đó tự giải lại 1143 và 518 trong ≤ 25' mỗi bài, không xem lời giải. Với 518, nói to vì sao thứ tự hai vòng lặp quan trọng.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Vì sao exactly-once khó đạt được? Thực tế người ta giải quyết thế nào?
2. Chọn Kafka hay RabbitMQ cho: (a) luồng log sự kiện rất lớn, (b) hàng đợi tác vụ gửi email?
3. Giải thích CAP trong 2 phút, có ví dụ.
4. Trình bày Notification System trong 25 phút.
5. Trie dùng cho autocomplete: độ phức tạp của thao tác tìm theo tiền tố?
   - *Gợi ý tự kiểm tra: đi tới node của tiền tố mất O(L); liệt kê các từ bên dưới mất thêm thời gian tỷ lệ với kích thước cây con. Hệ thống autocomplete thật thường lưu sẵn top-k gợi ý tại mỗi node để trả lời O(L). Từ khoá research: `trie autocomplete top k`.*

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Mạng không tin cậy: không phân biệt "mất message" với "mất ack" → bên gửi phải gửi lại → trùng.
- Side effect ra ngoài (email, DB khác) không nằm trong transaction của broker; Kafka EOS chỉ đúng trong phạm vi Kafka → Kafka.
- Thực tế: at-least-once + consumer idempotent (`processed_events` cùng transaction, unique key, upsert); producer dùng `event_id` cố định + publisher confirm.

**Câu 2.**
- (a) Log sự kiện rất lớn → **Kafka**: ghi tuần tự throughput cao, giữ lại để replay, nhiều consumer group đọc độc lập.
- (b) Tác vụ gửi email → **RabbitMQ** (hoặc SQS): ack/retry/DLX từng message, định tuyến linh hoạt, không cần replay.

**Câu 3.**
- Partition xảy ra → chọn C (từ chối/đợi) hoặc A (trả lời, có thể dữ liệu cũ); P không bỏ được.
- Ví dụ: số dư ví → CP; lượt like → AP.
- Nhắc được ít nhất một ngộ nhận: C của CAP ≠ C của ACID, hoặc "chọn 2 trong 3" sai; mạng bình thường thì trade-off là latency vs consistency (PACELC).

**Câu 4 (case Notification System, phải nhắc tới):**
- Requirements: các kênh, soft real-time, opt-out, thống kê; Estimation theo kênh + đợt gửi hàng loạt.
- Luồng: nguồn → notification server (settings, template, log) → queue theo kênh → worker → nhà cung cấp.
- Không mất: queue bền + at-least-once; không trùng: dedup theo `event_id`.
- Retry + backoff + DLQ; rate limit theo quota nhà cung cấp và theo user; failover nhà cung cấp.
- Bottleneck/monitoring: độ dài queue (lag), tỷ lệ lỗi từng nhà cung cấp, độ trễ tạo → gửi.

**Câu 5.**
- Tìm theo tiền tố: đi xuống node của tiền tố O(L), không phụ thuộc số từ.
- Liệt kê gợi ý: thêm chi phí duyệt cây con.
- Thực tế: lưu sẵn top-k tại mỗi node → trả lời O(L), đổi lại tốn bộ nhớ và phải cập nhật khi tần suất đổi.

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] Luồng event chạy được: consumer idempotent, có retry, có DLQ, qua đủ 5 bài test ở Bước 5
- [ ] README có mục "Event flow" + ghi rõ hạn chế dual write
- [ ] Tự giải lại 62, 1143, 208 không xem lời giải; nói được state/transition/base case của 62, 1143, 518
- [ ] Anki: đã nhập thẻ T1 của D71–D75 + thẻ pattern DP lưới / DP hai chuỗi / Trie / expand-around-center / đếm tổ hợp vs hoán vị
- [ ] Cheat sheet: đã điền bảng Đồng bộ vs Bất đồng bộ, Kafka vs RabbitMQ vs SQS, CP vs AP

# Lộ trình 100 ngày chuẩn bị phỏng vấn Backend

> **Xuất phát:** Junior/Mid, code nhiều nhưng chưa nắm chắc nền tảng và chưa có cái nhìn tổng quan về hệ thống.
> **Mục tiêu thực tế:** Qua vòng phỏng vấn **Mid Backend** một cách chắc chắn, có đủ System Design cơ bản để không bị hỏng ở vòng thiết kế. Senior nằm trong tầm với chỉ khi công ty đánh giá thoáng.
> **Phạm vi:** Lấy Tier 1 và Tier 2 của Phase 1–3 trong [Roadmap.md](Roadmap.md), Phase 4 chỉ học ở mức khái niệm, **bỏ Phase 5**. Có bổ sung **HTTP/Auth, OS/Network cơ bản**. Roadmap gốc không có hai phần này nhưng phỏng vấn Junior/Mid gần như luôn hỏi.
>
> **Lịch:** Ngày 1 = Thứ Hai 28/09/2026 → Ngày 100 = Thứ Ba 05/01/2027. Nếu bạn bắt đầu vào ngày khác, chỉ cần dịch toàn bộ lịch theo.

---

## 0. Cách dùng lộ trình này

### Phân loại Tier trong lộ trình này

File này chọn nội dung theo tiêu chí **"phỏng vấn có hay hỏi không"**, **không lọc theo Tier**. Vì vậy bên trong có cả ba loại:

| Tier | Tỷ lệ (ước tính) | Ví dụ trong lộ trình | Cách học |
|---|---|---|---|
| 🔴 **T1** | ~60% | Big-O, SOLID, Design Pattern, pattern DSA, B-Tree/composite index, MVCC, CAP, delivery guarantee, Circuit Breaker, khung System Design, SLO | Anki Active Recall + tự giải thích lại (Feynman) |
| 🟡 **T2** | ~30% | REST vs gRPC vs GraphQL, isolation level nên chọn, các chiến lược cache, sharding, SQL vs NoSQL, Kafka vs RabbitMQ, 2PC vs Saga, Blue-Green/Canary | Bảng so sánh trong `notes/tradeoff-cheatsheet.md` + **1 thẻ Anki "Khi nào chọn A thay vì B?"**. Phỏng vấn hỏi các so sánh này rất nhiều nên cần nói trôi chảy |
| 🟢 **T3** | ~10% (chỉ để làm lab) | Cú pháp EXPLAIN, Dockerfile, config Nginx, YAML K8s, code chi tiết của lời giải LeetCode | Lưu snippet, **không học thuộc** |

Mỗi mục kiến thức đã được gắn Tier trong các file tuần. Phân loại bám theo [Roadmap.md](Roadmap.md). Các mục bổ sung (HTTP, Auth, OS/Network) được phân loại bằng khung 3 câu hỏi trong [Prompt_Phan_Loai_Tier.md](Prompt_Phan_Loai_Tier.md).

### File chi tiết theo tuần

| Giai đoạn | Tuần |
|---|---|
| 1. Nền tảng code & API | [Tuần 1](100-ngay/tuan-01.md) · [Tuần 2](100-ngay/tuan-02.md) · [Tuần 3](100-ngay/tuan-03.md) · [Tuần 4](100-ngay/tuan-04.md) |
| 2. Database | [Tuần 5](100-ngay/tuan-05.md) · [Tuần 6](100-ngay/tuan-06.md) · [Tuần 7](100-ngay/tuan-07.md) · [Tuần 8](100-ngay/tuan-08.md) |
| 3. Hệ thống & System Design | [Tuần 9](100-ngay/tuan-09.md) · [Tuần 10](100-ngay/tuan-10.md) · [Tuần 11](100-ngay/tuan-11.md) · [Tuần 12](100-ngay/tuan-12.md) |
| 4. DevOps, Behavioral, Mock | [Tuần 13](100-ngay/tuan-13.md) · [Tuần 14 + D99–100](100-ngay/tuan-14.md) |

File này là **bản tổng quan**. Hằng ngày, bạn mở file tuần tương ứng để học.

### ⏱ Thời lượng ước tính

Mỗi ngày trong file tuần có một dòng **⏱ Ước tính** ngay dưới tiêu đề ngày, chia rõ **Giờ làm** và **Tối** (hoặc tổng buổi vào cuối tuần). Mỗi tối, bạn mở file tuần xem dòng này của ngày mai để biết cần dành ra bao nhiêu thời gian.

| Tuần | Tổng tuần | Trung bình/ngày |
|---|---|---|
| Tuần 1 | 16h25' | 2h21' |
| Tuần 2 | 18h15' | 2h36' |
| Tuần 3 | 17h46' | 2h32' |
| Tuần 4 | 17h49' | 2h33' |
| Tuần 5 | 16h57' | 2h25' |
| Tuần 6 | 17h56' | 2h34' |
| Tuần 7 | 18h20' | 2h37' |
| Tuần 8 | 19h10' | 2h44' |
| Tuần 9 | 18h20' | 2h37' |
| Tuần 10 | 18h50' | 2h41' |
| Tuần 11 | 19h20' | 2h46' |
| Tuần 12 | 17h00' | 2h26' |
| Tuần 13 | 19h15' | 2h45' |
| Tuần 14 | 19h20' | 2h46' |
| D99–D100 | 4h00' | — |
| **Cả lộ trình** | **258h43'** | **~2h35'** |

Các ước tính đều tuân theo 3 giới hạn:
- tối ngày thường tối đa 90',
- Thứ Bảy tối đa 4h,
- Chủ Nhật tối đa 3h.

Ngày nào vượt thì phần T2 hoặc phần "(tuỳ chọn)" đã được dời sang cuối tuần, và có ghi chú ⚖️ ở cả hai nơi.

> ⚠️ **Lịch đang sát trần quỹ thời gian** (17–19h/tuần, gần như không có ngày dự phòng). Khi có tuần bận hoặc OT, bỏ theo thứ tự: mục **(tuỳ chọn)** → phần **mở rộng** của lab → bảng T2 (chỉ đọc lướt, chưa cần điền). **Không bỏ** câu hỏi cuối bài và bài DSA.

### Cách tự kiểm tra trong file tuần

Mỗi ngày có:
- **Câu hỏi cuối bài:** 3 câu gốc giống file tổng này, cộng thêm **câu bổ sung** (4, 5) cho các ý Tier 1 mà 3 câu gốc chưa hỏi tới.
- **Ý chính cần có trong câu trả lời:** khối thu gọn bên dưới các câu hỏi. Bạn **tự trả lời trước, sau đó mới mở ra** để chấm điểm.
- Phần **Chốt tuần** cũng có khối đáp án tương tự.

### Khung một ngày

Đi xe máy không học được, tiếng Anh giữ tối thiểu 1 tiếng mỗi ngày.

| Khung giờ | Thời lượng | Việc làm |
|---|---|---|
| **Trong giờ làm** | 60–90' | **DSA: 1 bài (≤ 45')** + ôn Anki 10–15' + nếu còn giờ thì đọc trước bài tối |
| **Buổi tối – Lập trình** | 60–75' | **Bài học lý thuyết của ngày**: đọc/xem (40') → ghi chú bằng lời của mình (10') → **trả lời câu hỏi cuối bài** (15') |
| **Buổi tối – Tiếng Anh** | ≥ 60' | Giữ nguyên. Gợi ý: thỉnh thoảng dùng tài liệu kỹ thuật tiếng Anh (NeetCode, ByteByteGo) làm bài nghe/đọc để tận dụng hai lần. Không bắt buộc |
| **Thứ Bảy** | 3–4h | 1 bài DSA mới + **Lab thực hành** (dự án xuyên suốt) + ôn lại các câu đánh dấu ⚠️ |
| **Chủ Nhật** | 2–3h | 1 bài DSA hoặc làm lại bài cũ + **Chốt tuần** (tự kiểm tra) + tạo thẻ Anki |

**Khi quá tải**, ưu tiên theo thứ tự: câu hỏi cuối bài → bài DSA → đọc thêm. Nên bỏ phần đọc thêm trước, **không bỏ phần tự kiểm tra**.

### Quy tắc qua bài

| Loại | Điều kiện "ĐẠT" để sang bài sau | Nếu chưa đạt |
|---|---|---|
| **Câu hỏi cuối bài** | Nói to hoặc viết ra, **không nhìn tài liệu**, trả lời đúng ý chính **≥ 2/3 câu** | Đánh dấu ⚠️, ôn lại vào Thứ Bảy. Vẫn đi tiếp bài sau, không dừng lịch |
| **Bài DSA** | Tự code chạy đúng trong ≤ 45' (bài Easy ≤ 20'), nói được độ phức tạp thời gian và bộ nhớ | Sau 40' vẫn bí thì xem lời giải, hiểu, rồi ghi vào **Error List**. Làm lại sau **3 ngày** và sau **7 ngày** |
| **Chốt tuần** | Đạt **≥ 4/5 câu** + hoàn thành **sản phẩm thực hành** | Dùng phần còn lại của Chủ Nhật để bù. Tuần sau cắt phần đọc thêm để dành giờ ôn. **Không lùi lịch quá 2 ngày** |

> **Mẹo tự kiểm tra:** Giả vờ đang giải thích cho một bạn Junior hoặc cho người phỏng vấn. Chỗ nào bạn phải ngập ngừng, đó chính là chỗ chưa hiểu.

### Công cụ cần chuẩn bị (Ngày 1)

- Repo cá nhân `interview-prep/` gồm 3 thư mục: `dsa/`, `notes/`, `project/`
- File `error-list.md` theo mẫu: `| Ngày | Bài | Sai ở đâu | Pattern | Ngày làm lại 1 | Ngày làm lại 2 |`
- Anki: mỗi câu hỏi cuối bài là một thẻ
- Docker để chạy PostgreSQL, Redis, RabbitMQ cho phần lab

### Tài liệu chính (chỉ dùng từng này)

| Chủ đề | Tài liệu |
|---|---|
| DSA | **neetcode.io**: danh sách NeetCode 150 + video giải |
| OOP / Design Pattern | **refactoring.guru/design-patterns** |
| Index / Query | **use-the-index-luke.com** (miễn phí) + tài liệu PostgreSQL (chương *Indexes*, *Transaction Isolation*) |
| Nền tảng Backend | YouTube **Hussein Nasser** + **roadmap.sh/backend** |
| System Design | **System Design Interview – Alex Xu (Tập 1)** + YouTube **ByteByteGo** |
| Đọc thêm (khi dư giờ) | *Designing Data-Intensive Applications* (DDIA) chương 3, 5, 7 |

### Dự án xuyên suốt: *Mini Order Service*

Mỗi tuần thêm một phần vào cùng một dự án. Đến lúc phỏng vấn, bạn có **một dự án thật để kể**, kèm số liệu trước/sau.

| Tuần | Thêm vào dự án |
|---|---|
| 4 | REST API, JWT, cursor pagination, idempotency key, kiến trúc phân lớp |
| 5–6 | Dữ liệu lớn (vài triệu dòng), index, xử lý N+1, EXPLAIN |
| 7 | Chống bán quá tồn kho khi có request đồng thời |
| 8 | Redis cache-aside |
| 9 | 2 instance đứng sau Nginx load balancer |
| 10 | Rate limiter (token bucket trên Redis) |
| 11 | Message queue + consumer idempotent + DLQ |
| 13 | Docker hoá + GitHub Actions CI + README có sơ đồ kiến trúc |

Dùng ngôn ngữ và framework bạn đang làm hằng ngày.

---

# GIAI ĐOẠN 1 — NỀN TẢNG CODE & API (Tuần 1–4)

## Tuần 1 (28/09 – 04/10): Big-O, OOP, SOLID

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-01.md](100-ngay/tuan-01.md)

⏱ **Tổng tuần: 16h25'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Giải thích được 4 tính chất OOP, Composition vs Inheritance và SOLID bằng ví dụ lấy từ chính code của bạn.

| Ngày | DSA (giờ làm) | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D1 (T2) | 217 Contains Duplicate | Big-O: time/space, các bậc O(1) → O(n²), cách phân tích vòng lặp | NeetCode Big-O, bigocheatsheet.com | 2h05' |
| D2 (T3) | 242 Valid Anagram | OOP: Encapsulation, Abstraction, Inheritance, Polymorphism | refactoring.guru (phần OOP basics) | 1h55' |
| D3 (T4) | 1 Two Sum | Composition vs Inheritance | refactoring.guru, *Head First Design Patterns* ch.1 (ví dụ Duck) | 1h35' |
| D4 (T5) | 49 Group Anagrams | SOLID: **S**, **O** | refactoring.guru, tự tìm ví dụ trong code công ty | 2h05' |
| D5 (T6) | 347 Top K Frequent Elements | SOLID: **L**, **I**, **D** | như trên | 2h20' |
| D6 (T7) | 238 Product of Array Except Self | **Lab:** tạo repo, Anki deck, Error List. Refactor một đoạn code vi phạm SOLID, viết bản trước/sau | — | 3h45' |
| D7 (CN) | Làm lại 1 bài sai trong tuần | **Chốt tuần 1** | — | 2h40' |

**Câu hỏi cuối bài**

- **D1 – Big-O**
  1. Vì sao dùng HashSet cho bài 217 là O(n), còn hai vòng lặp lồng nhau là O(n²)? Đổi lại bạn tốn thêm gì?
  2. Binary search trên mảng 1 triệu phần tử cần tối đa khoảng bao nhiêu bước? Vì sao?
  3. Cách "sort rồi so sánh hai phần tử kề nhau" có độ phức tạp bao nhiêu? Khi nào nó tốt hơn HashSet?
- **D2 – OOP**
  1. Encapsulation khác Abstraction ở đâu? Cho ví dụ trong code bạn đang làm.
  2. Polymorphism lúc chạy (overriding) khác lúc biên dịch (overloading) thế nào?
  3. Vì sao để field `public` rồi ai cũng gán giá trị tuỳ ý là phá vỡ encapsulation?
- **D3 – Composition vs Inheritance**
  1. Phân biệt "is-a" và "has-a".
  2. Nêu một tình huống kế thừa gây rắc rối (lớp cha thay đổi làm vỡ lớp con, hoặc số class bùng nổ).
  3. Viết lại ví dụ `Duck` (vịt biết bay / vịt gỗ không bay) bằng composition.
- **D4 – S, O**
  1. Chỉ ra một class trong project thật đang vi phạm SRP. Bạn sẽ tách nó thế nào?
  2. Cần thêm một phương thức thanh toán mới mà **không sửa code cũ**. Bạn thiết kế thế nào?
  3. SRP có nghĩa là "mỗi class chỉ có một method" không?
- **D5 – L, I, D**
  1. Ví dụ Rectangle–Square vi phạm LSP ở chỗ nào?
  2. DIP (nguyên lý) khác Dependency Injection (kỹ thuật) thế nào?
  3. Một interface quá lớn (fat interface) gây hại gì cho các class implement nó?

**✅ Chốt tuần 1**

1. Giải thích 4 tính chất OOP trong 2 phút, mỗi tính chất một ví dụ.
2. Khi nào **vẫn nên** dùng kế thừa?
3. Mở một file code thật và chỉ ra 2 chỗ vi phạm SOLID.
4. HashMap hoạt động bên trong thế nào (hash, bucket, collision)? Vì sao tra cứu trung bình O(1) nhưng xấu nhất O(n)?
5. Big-O của cách bạn giải Group Anagrams là bao nhiêu? Có cách nào tốt hơn không?

**Sản phẩm:** Bản refactor trước/sau + tự giải lại 5 bài DSA của tuần mà không xem lời giải.
- [ ] Đạt chốt tuần 1

---

## Tuần 2 (05/10 – 11/10): Two Pointers, Sliding Window, Coupling/Cohesion, Creational Patterns

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-02.md](100-ngay/tuan-02.md)

⏱ **Tổng tuần: 18h15'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Nhận ra dạng bài Two Pointers và Sliding Window từ đề bài. Hiểu Singleton, Factory, Builder và DI.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D8 (T2) | 125 Valid Palindrome | Coupling & Cohesion | roadmap.sh, bài viết "coupling and cohesion" | 1h47' |
| D9 (T3) | 167 Two Sum II | Tổng quan Design Pattern (3 nhóm) + **Singleton** | refactoring.guru | 2h29' |
| D10 (T4) | 15 3Sum | **Factory Method** | refactoring.guru | 2h30' |
| D11 (T5) | 11 Container With Most Water | **Builder** | refactoring.guru | 2h25' |
| D12 (T6) | 121 Best Time to Buy and Sell Stock | Dependency Injection & IoC container trong framework của bạn | Docs framework bạn dùng | 2h04' |
| D13 (T7) | 3 Longest Substring Without Repeating | **Lab:** module `Notification` (email/SMS/push) dùng Factory + DI, có unit test mock sender | — | 4h00' |
| D14 (CN) | 424 Longest Repeating Character Replacement | **Chốt tuần 2** | — | 3h00' |

**Câu hỏi cuối bài**

- **D8 – Coupling & Cohesion**
  1. "High cohesion, low coupling" nghĩa là gì, nói bằng lời của bạn?
  2. Kể 3 dấu hiệu cho thấy code đang bị coupling chặt.
  3. Biến global và Singleton làm tăng coupling như thế nào?
- **D9 – Singleton**
  1. Vì sao Singleton thường bị coi là anti-pattern?
  2. Muốn Singleton an toàn khi chạy nhiều thread thì phải làm gì?
  3. Trong project của bạn, thứ gì đang được dùng như singleton (connection pool, config, logger)?
- **D10 – Factory**
  1. Factory giải quyết vấn đề gì so với việc gọi `new` trực tiếp?
  2. Factory liên quan đến nguyên lý OCP ra sao?
  3. Phác thảo factory tạo `NotificationSender` theo kênh gửi.
- **D11 – Builder**
  1. Constructor có quá nhiều tham số thì gây vấn đề gì?
  2. Builder khác truyền object hoặc named params ở điểm nào?
  3. Tìm một ví dụ Builder trong thư viện bạn đang dùng (query builder, HTTP client).
- **D12 – DI**
  1. DI giúp viết unit test dễ hơn như thế nào?
  2. Constructor injection khác setter injection ra sao? Nên ưu tiên cái nào?
  3. Framework của bạn inject dependency theo cách nào?

**✅ Chốt tuần 2**

1. Khi nào dùng Two Pointers, khi nào dùng Sliding Window? Dấu hiệu nhận biết từ đề bài là gì?
2. Sliding window kích thước cố định khác kích thước thay đổi thế nào? Viết khung code chung.
3. So sánh Factory và Builder.
4. Giải thích DI cho một người không biết lập trình.
5. Vẽ sơ đồ phụ thuộc giữa các module trong project hiện tại. Chỗ nào coupling cao nhất?

**Sản phẩm:** Module Notification có test chạy xanh.
- [ ] Đạt chốt tuần 2

---

## Tuần 3 (12/10 – 18/10): Stack, Binary Search, Behavioral/Structural Patterns, Repository

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-03.md](100-ngay/tuan-03.md)

⏱ **Tổng tuần: 17h46'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Nắm Strategy, Observer, Adapter, Decorator, Repository và kiến trúc phân lớp. Monotonic stack. Binary search trên không gian đáp án.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D15 (T2) | 20 Valid Parentheses | **Strategy** | refactoring.guru | 1h42' |
| D16 (T3) | 155 Min Stack | **Observer** / Pub-Sub | refactoring.guru | 2h17' |
| D17 (T4) | 739 Daily Temperatures | **Adapter** & **Decorator** (+ middleware) | refactoring.guru | 2h27' |
| D18 (T5) | 704 Binary Search | **Repository** & **Unit of Work** | Martin Fowler – P of EAA (bài online) | 1h59' |
| D19 (T6) | 74 Search a 2D Matrix | Kiến trúc phân lớp (Controller – Service – Repository) + CQRS cơ bản | roadmap.sh | 2h21' |
| D20 (T7) | 875 Koko Eating Bananas | **Lab:** module tính phí ship nhiều hãng bằng Strategy, thêm Decorator cho logging/cache | — | 4h00' |
| D21 (CN) | 33 Search in Rotated Sorted Array | **Chốt tuần 3** | — | 3h00' |

**Câu hỏi cuối bài**

- **D15 – Strategy**
  1. Strategy thay thế chuỗi `if/else/switch` như thế nào?
  2. Strategy khác Factory ở đâu? (một bên *tạo đối tượng*, một bên *chọn hành vi*)
  3. Thiết kế tính phí ship cho GHN / GHTK / ViettelPost bằng Strategy.
- **D16 – Observer**
  1. Observer khác Pub/Sub (có broker ở giữa) thế nào?
  2. Nêu nhược điểm của Observer (khó trace luồng, rò rỉ bộ nhớ nếu quên unsubscribe).
  3. EventEmitter hoặc cơ chế event trong framework của bạn thuộc pattern nào?
- **D17 – Adapter & Decorator**
  1. Khi tích hợp SDK bên thứ ba, Adapter giúp gì?
  2. Thêm logging hoặc cache bằng Decorator khác bằng kế thừa ở điểm nào?
  3. Middleware trong web framework giống pattern nào?
- **D18 – Repository & UoW**
  1. Repository tách business logic khỏi DB như thế nào?
  2. Unit of Work giải quyết vấn đề gì khi một nghiệp vụ ghi vào nhiều repository?
  3. ORM bạn đang dùng đã có sẵn UoW chưa (session, transaction)?
- **D19 – Phân lớp & CQRS**
  1. Business logic nên nằm ở lớp nào? Vì sao không để trong controller?
  2. CQRS cơ bản: tách luồng đọc và ghi thì được lợi gì?
  3. Khi nào dùng CQRS là thừa (over-engineering)?

**✅ Chốt tuần 3**

1. Kể 7 pattern đã học, mỗi pattern một câu "nó giải quyết vấn đề gì".
2. Monotonic stack dùng cho dạng bài nào?
3. "Binary search trên không gian đáp án" (bài Koko) là gì? Khi nào nghĩ tới nó?
4. Vẽ luồng một request từ controller xuống DB trong project thật, gắn tên pattern nếu có.
5. Người phỏng vấn hỏi: *"Bạn đã dùng design pattern nào trong dự án thật?"* Trả lời trong 2 phút.

**Sản phẩm:** Module phí ship + Decorator.
- [ ] Đạt chốt tuần 3

---

## Tuần 4 (19/10 – 25/10): Linked List, HTTP, REST API Design, Auth

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-04.md](100-ngay/tuan-04.md)

⏱ **Tổng tuần: 17h49'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Thiết kế được một REST API đúng chuẩn. Hiểu HTTP, xác thực và phân quyền. Bắt đầu dự án xuyên suốt.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D22 (T2) | 206 Reverse Linked List | **HTTP:** method, status code, header, stateless, HTTP/1.1 vs HTTP/2 | MDN HTTP, Hussein Nasser | 2h07' |
| D23 (T3) | 21 Merge Two Sorted Lists | **Thiết kế REST:** đặt tên resource, filter/sort, **pagination offset vs cursor** | Microsoft REST API Guidelines | 1h57' |
| D24 (T4) | 141 Linked List Cycle | **Idempotency** & **versioning** | Stripe docs – Idempotent requests | 2h04' |
| D25 (T5) | 19 Remove Nth Node From End | **Auth:** session vs JWT, OAuth2 tổng quan, hash mật khẩu (bcrypt) | Hussein Nasser, OWASP cheat sheet | 2h24' |
| D26 (T6) | 143 Reorder List | **REST vs gRPC vs GraphQL** (bảng so sánh Tier 2) + **N+1 problem** | ByteByteGo | 2h27' |
| D27 (T7) | 146 LRU Cache | **Lab – Dự án:** CRUD product/order, JWT, cursor pagination, Idempotency-Key cho `POST /orders`, kiến trúc phân lớp, Postgres chạy bằng Docker | — | 4h00' |
| D28 (CN) | Làm lại bài trong Error List | **Chốt tuần 4 + Chốt Giai đoạn 1** | — | 2h50' |

**Câu hỏi cuối bài**

- **D22 – HTTP**
  1. PUT, PATCH, POST khác nhau thế nào?
  2. Phân biệt 401 và 403, 400 và 422, 502 / 503 / 504.
  3. HTTP là stateless. Vậy làm sao server "nhớ" là bạn đã đăng nhập?
- **D23 – REST & Pagination**
  1. Vì sao phân trang bằng offset chậm dần ở các trang sâu? Cursor giải quyết thế nào?
  2. Thiết kế endpoint lấy đơn hàng của một user, lọc theo trạng thái, sắp xếp theo ngày.
  3. Khi dữ liệu mới được thêm liên tục, phân trang offset bị lỗi gì (trùng hoặc sót bản ghi)?
- **D24 – Idempotency & Versioning**
  1. Những method nào là idempotent theo chuẩn HTTP?
  2. Mạng chậm, người dùng bấm "Thanh toán" hai lần. Thiết kế `Idempotency-Key` thế nào để không trừ tiền hai lần?
  3. Versioning qua URL (`/v1/`) và qua header khác nhau thế nào về trade-off?
- **D25 – Auth**
  1. Session và JWT: ưu, nhược, và cách thu hồi (revoke) một JWT?
  2. Vì sao không được lưu mật khẩu bằng MD5 hoặc SHA-256 thuần?
  3. Authentication khác Authorization ở đâu?
- **D26 – REST/gRPC/GraphQL & N+1**
  1. Lập bảng so sánh ba loại theo: định dạng dữ liệu, hiệu năng, use-case, độ phức tạp.
  2. N+1 là gì? Nó xuất hiện trong ORM thế nào? Sửa bằng cách nào (eager loading, batch, DataLoader)?
  3. Microservice nội bộ gọi nhau nên dùng gì? Public API cho mobile nên dùng gì?

**✅ Chốt tuần 4 — Tổng kết Giai đoạn 1**

1. Kể trọn vẹn chuyện gì xảy ra khi client gọi `POST /orders`: HTTP → middleware xác thực → controller → service → repository → transaction → response.
2. Thiết kế API cho tính năng "giỏ hàng": endpoint, status code, cách phân trang.
3. LRU Cache: vì sao cần kết hợp HashMap với doubly linked list?
4. Kỹ thuật con trỏ nhanh/chậm (fast/slow pointer) dùng cho những bài nào?
5. **Tự mock 30':** giải một bài Medium chưa gặp thuộc nhóm Array / Two Pointers / Stack.

**Sản phẩm:** Dự án chạy được, có ít nhất 5 endpoint.
- [ ] Đạt chốt Giai đoạn 1

---

# GIAI ĐOẠN 2 — DATABASE (Tuần 5–8)

## Tuần 5 (26/10 – 01/11): Tree, SQL, Index

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-05.md](100-ngay/tuan-05.md)

⏱ **Tổng tuần: 16h57'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Giải thích được B-Tree index. Thiết kế composite index đúng thứ tự cột. Biết khi nào index **không** được dùng.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D29 (T2) | 226 Invert Binary Tree | Ôn SQL: các loại JOIN, GROUP BY/HAVING, subquery, window function | PostgreSQL tutorial | 2h07' |
| D30 (T3) | 104 Maximum Depth of Binary Tree | Chuẩn hoá (1NF–3NF), khi nào nên phi chuẩn hoá, khoá chính/khoá ngoại/constraint | — | 2h04' |
| D31 (T4) | 100 Same Tree | **Index là gì, B-Tree hoạt động ra sao** | use-the-index-luke ch.1 | 2h07' |
| D32 (T5) | 572 Subtree of Another Tree | **Composite index & thứ tự cột** (leftmost prefix), covering index | use-the-index-luke ch.2 | 2h07' |
| D33 (T6) | 235 LCA of a BST | **Cardinality, selectivity**, các trường hợp index bị bỏ qua, partial index, expression index | use-the-index-luke ch.2–3 | 2h17' |
| D34 (T7) | 102 Binary Tree Level Order Traversal | **Lab:** sinh 2–5 triệu dòng `orders` bằng `generate_series`, đo query trước/sau khi thêm index, so sánh composite index đúng và sai thứ tự | — | 3h45' |
| D35 (CN) | 98 Validate BST | **Chốt tuần 5** | — | 2h30' |

**Câu hỏi cuối bài**

- **D29 – SQL**
  1. INNER JOIN khác LEFT JOIN thế nào? Khi nào LEFT JOIN trả về NULL?
  2. WHERE khác HAVING ở đâu?
  3. Viết query lấy 3 đơn gần nhất của mỗi user bằng `ROW_NUMBER()`.
- **D30 – Chuẩn hoá**
  1. Bảng `orders` chứa luôn tên và địa chỉ khách hàng thì gặp vấn đề gì?
  2. Khi nào phi chuẩn hoá (denormalize) mang lại lợi ích?
  3. Khoá chính dùng UUID hay auto-increment? Trade-off là gì?
- **D31 – B-Tree**
  1. Vì sao B-Tree tra cứu được O(log n) và hỗ trợ tốt truy vấn khoảng (range query)?
  2. Index làm chậm những thao tác nào? Vì sao?
  3. Hash index khác B-Tree ở đâu?
- **D32 – Composite index**
  1. Có index `(user_id, created_at)`. Query `WHERE user_id = ?` có dùng được không? `WHERE created_at > ?` thì sao? Còn `WHERE user_id = ? ORDER BY created_at`?
  2. Vì sao nên đặt cột so sánh bằng (`=`) trước cột so sánh khoảng?
  3. Covering index / index-only scan là gì?
- **D33 – Selectivity**
  1. Index trên cột `status` chỉ có 3 giá trị có hữu ích không? Partial index giúp gì ở đây?
  2. `WHERE LOWER(email) = ?` vì sao không dùng được index? Sửa thế nào?
  3. Kể 4 lý do khiến planner bỏ qua index.

**✅ Chốt tuần 5**

1. DFS và BFS trên cây: khi nào dùng cái nào? Viết bằng đệ quy và bằng vòng lặp khác nhau ra sao?
2. Giải thích B-Tree index cho một người mới trong 2 phút.
3. Cho 3 query (tự đặt), thiết kế **số index ít nhất** phục vụ được cả 3.
4. Vì sao không đánh index cho mọi cột?
5. Trình bày số liệu lab: thời gian query trước/sau khi có index.

**Sản phẩm:** File `notes/index-lab.md` có số liệu đo.
- [ ] Đạt chốt tuần 5

---

## Tuần 6 (02/11 – 08/11): Tree, Heap, tối ưu Query (EXPLAIN)

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-06.md](100-ngay/tuan-06.md)

⏱ **Tổng tuần: 17h56'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Đọc được execution plan và có quy trình xử lý khi gặp "API chậm". Có sẵn một câu chuyện tối ưu hiệu năng để kể khi phỏng vấn.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D36 (T2) | 199 Binary Tree Right Side View | `EXPLAIN` / `EXPLAIN ANALYZE`: cost, rows, actual time | PostgreSQL docs – *Using EXPLAIN* | 2h17' |
| D37 (T3) | 230 Kth Smallest Element in a BST | Seq Scan / Index Scan / Index Only Scan / Bitmap Scan | như trên | 2h17' |
| D38 (T4) | 703 Kth Largest Element in a Stream | Thuật toán join: Nested Loop / Hash Join / Merge Join | use-the-index-luke ch.4 | 2h09' |
| D39 (T5) | 1046 Last Stone Weight | N+1 trong ORM thực tế, slow query log, keyset pagination | Docs ORM bạn dùng | 1h59' |
| D40 (T6) | 973 K Closest Points to Origin | Checklist "API chậm" + tìm một query chậm trong code công ty | — | 2h39' |
| D41 (T7) | 215 Kth Largest Element in an Array | **Lab – Dự án:** API danh sách đơn có filter + sort; EXPLAIN ANALYZE → sửa N+1 → thêm index; ghi lại trước/sau | — | 4h00' |
| D42 (CN) | 621 Task Scheduler | **Chốt tuần 6** | — | 2h35' |

**Câu hỏi cuối bài**

- **D36 – EXPLAIN**
  1. `cost` (ước tính) khác `actual time` (thực tế) thế nào?
  2. Số `rows` ước tính lệch xa số thực tế thì nghĩa là gì? Xử lý ra sao (`ANALYZE`)?
  3. Đọc plan theo thứ tự nào?
- **D37 – Các kiểu scan**
  1. Vì sao planner đôi khi chọn Seq Scan dù đã có index?
  2. Bitmap scan được dùng khi nào?
  3. Index Only Scan cần điều kiện gì?
- **D38 – Join**
  1. Mỗi thuật toán join (Nested Loop, Hash, Merge) phù hợp với tình huống nào?
  2. Có index trên cột join thì ảnh hưởng gì?
  3. Nhận ra một join chậm trong plan bằng cách nào?
- **D39 – N+1 & phân trang**
  1. Làm sao phát hiện N+1 trong project (bật log query)?
  2. Eager loading bằng JOIN khác batch bằng `IN (...)` ở điểm nào?
  3. Tối ưu `OFFSET 100000` bằng keyset pagination thế nào?
- **D40 – Checklist**
  1. Quy trình 5 bước khi nhận ticket "API chậm" là gì?
  2. Khi nào nên dùng cache thay vì tối ưu query?
  3. Bài top-K dùng heap vì sao là O(n log k)?

**✅ Chốt tuần 6**

1. In một plan từ lab ra và giải thích từng node.
2. Kể 3 nguyên nhân phổ biến khiến query chậm và cách xử lý từng cái.
3. **Kể chuyện theo STAR:** "Tôi đã tối ưu một API chậm" trong 2 phút, có số liệu.
4. Heap: thao tác insert và pop có độ phức tạp bao nhiêu? Vì sao?
5. Top-K: dùng heap hay sort? Khi nào chọn cái nào?

**Sản phẩm:** API danh sách đơn đã tối ưu + ghi chú trước/sau.
- [ ] Đạt chốt tuần 6

---

## Tuần 7 (09/11 – 15/11): Graph, Transaction, Isolation, Locking

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-07.md](100-ngay/tuan-07.md)

⏱ **Tổng tuần: 18h20'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Hiểu ACID, isolation level, MVCC. Giải được bài toán **bán quá tồn kho** (overselling), một câu hỏi rất hay gặp khi phỏng vấn.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D43 (T2) | 200 Number of Islands | **ACID** qua ví dụ chuyển tiền | DDIA ch.7 (phần đầu), Hussein Nasser | 2h30' |
| D44 (T3) | 133 Clone Graph | Các lỗi đọc/ghi: dirty read, non-repeatable read, phantom read, lost update, write skew | DDIA ch.7 | 2h20' |
| D45 (T4) | 695 Max Area of Island | **Isolation levels** + mức mặc định của Postgres và MySQL | PostgreSQL docs – *Transaction Isolation* | 2h10' |
| D46 (T5) | 994 Rotting Oranges | Nguyên lý **MVCC** và **WAL** | Hussein Nasser, PostgreSQL docs | 2h25' |
| D47 (T6) | 417 Pacific Atlantic Water Flow | **Locking:** pessimistic (`SELECT … FOR UPDATE`) vs optimistic (version), deadlock | — | 2h25' |
| D48 (T7) | 207 Course Schedule | **Lab – Dự án:** API đặt hàng trừ tồn kho. Viết script bắn 50 request đồng thời vào sản phẩm còn 10 cái → chứng minh lỗi overselling → sửa bằng 2 cách | — | 3h55' |
| D49 (CN) | 210 Course Schedule II | **Chốt tuần 7** | — | 2h35' |

**Câu hỏi cuối bài**

- **D43 – ACID**
  1. Atomicity khác Consistency thế nào?
  2. Durability đạt được nhờ cơ chế gì?
  3. Server sập giữa chừng một transaction thì dữ liệu ra sao?
- **D44 – Các lỗi đọc/ghi**
  1. Cho ví dụ từng loại lỗi với một bảng tồn kho.
  2. Lost update xảy ra thế nào khi hai người cùng mua sản phẩm cuối cùng?
  3. Write skew là gì? (ví dụ: hai bác sĩ cùng xin nghỉ ca trực)
- **D45 – Isolation**
  1. Mỗi mức isolation trong 4 mức chặn được lỗi nào?
  2. Postgres mặc định dùng mức nào? MySQL InnoDB mặc định mức nào?
  3. Vì sao không phải lúc nào cũng dùng Serializable?
- **D46 – MVCC & WAL**
  1. MVCC giúp việc đọc không chặn việc ghi như thế nào?
  2. Các phiên bản cũ của row đi đâu? (chỉ cần biết có VACUUM)
  3. WAL: vì sao phải ghi log trước rồi mới ghi dữ liệu?
- **D47 – Locking**
  1. Kể 3 cách chống bán quá tồn kho: `UPDATE … WHERE stock > 0`, `FOR UPDATE`, optimistic version.
  2. Deadlock xảy ra thế nào? Phòng tránh ra sao?
  3. Khi nào optimistic lock tốt hơn pessimistic lock?

**✅ Chốt tuần 7**

1. Giải thích ACID và 4 isolation level mà không nhìn tài liệu.
2. Trình bày bài toán overselling: các giải pháp và trade-off của từng cái.
3. Giải thích MVCC trong 2 phút.
4. BFS nhiều nguồn (Rotting Oranges) và topological sort dùng khi nào? Liên hệ với backend: thứ tự chạy job phụ thuộc nhau, thứ tự build.
5. Làm sao phát hiện deadlock và làm sao tránh nó?

**Sản phẩm:** Script test đồng thời + 2 cách sửa, có kết quả chạy.
- [ ] Đạt chốt tuần 7

---

## Tuần 8 (16/11 – 22/11): Backtracking, Cache, Replication, Sharding, NoSQL

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-08.md](100-ngay/tuan-08.md)

⏱ **Tổng tuần: 19h10'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Biết các bước scale database theo thứ tự hợp lý. Nắm chiến lược cache và các sự cố cache hay gặp. Chọn được SQL hay NoSQL theo từng use-case.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D50 (T2) | 78 Subsets | Redis & cache cơ bản: TTL, eviction (LRU/LFU) | Redis docs | 2h25' |
| D51 (T3) | 39 Combination Sum | **Chiến lược cache:** cache-aside / write-through / write-behind, invalidation | ByteByteGo | 2h25' |
| D52 (T4) | 46 Permutations | Sự cố cache: stampede, penetration, avalanche + kiểu dữ liệu Redis dùng vào việc gì | ByteByteGo | 2h30' |
| D53 (T5) | 90 Subsets II | **Replication:** primary–replica, sync vs async, replication lag | DDIA ch.5 (đọc lướt) | 2h25' |
| D54 (T6) | 79 Word Search | **Sharding** (range/hash/directory) + connection pooling | ByteByteGo, DDIA ch.6 (đọc lướt) | 2h30' |
| D55 (T7) | 17 Letter Combinations of a Phone Number | **Lab – Dự án:** Redis cache-aside cho `GET /products/:id`, đo latency trước/sau, invalidate khi update. Làm **bảng so sánh SQL vs NoSQL** (Document/KV/Wide-column/Graph) | — | 4h00' |
| D56 (CN) | Làm lại bài trong Error List | **Chốt tuần 8 + Chốt Giai đoạn 2** | — | 2h55' |

**Câu hỏi cuối bài**

- **D50 – Cache cơ bản**
  1. Dữ liệu nào nên cache, dữ liệu nào không nên?
  2. Chọn TTL dựa trên tiêu chí gì?
  3. LRU khác LFU thế nào?
- **D51 – Chiến lược cache**
  1. Mô tả luồng đọc và luồng ghi của cache-aside.
  2. Khi update DB, nên **xoá** cache hay **cập nhật** cache? Vì sao xoá thường an toàn hơn?
  3. Write-behind có rủi ro gì?
- **D52 – Sự cố cache**
  1. Cache stampede là gì? Chống bằng cách nào (lock, TTL lệch nhau)?
  2. Cache penetration (liên tục hỏi key không tồn tại) chống bằng gì?
  3. Sorted set của Redis dùng cho bài toán nào?
- **D53 – Replication**
  1. Vừa ghi xong đọc từ replica có thể thấy dữ liệu cũ. Xử lý thế nào (read-your-writes)?
  2. Replication đồng bộ và bất đồng bộ: trade-off là gì?
  3. Primary chết thì failover diễn ra thế nào?
- **D54 – Sharding & pooling**
  1. So sánh 3 chiến lược sharding.
  2. Hot partition là gì?
  3. Vì sao cần connection pool? Đặt pool quá lớn thì bị gì?

**✅ Chốt tuần 8 — Tổng kết Giai đoạn 2**

1. Hệ thống đọc nhiều ghi ít, DB quá tải. Trình bày các bước scale **theo thứ tự**: index → cache → read replica → sharding.
2. Chọn loại DB cho: giỏ hàng, log sự kiện, quan hệ bạn bè trên mạng xã hội, đơn hàng thanh toán.
3. Cache-aside và các vấn đề về tính nhất quán dữ liệu.
4. Khung code backtracking (chọn → đệ quy → bỏ chọn). Độ phức tạp của bài Subsets?
5. **Tự mock 45':** 2 câu hỏi về DB + 1 bài DSA Medium.

**Sản phẩm:** Cache có số liệu đo + bảng SQL vs NoSQL.
- [ ] Đạt chốt Giai đoạn 2

---

# GIAI ĐOẠN 3 — HỆ THỐNG & SYSTEM DESIGN (Tuần 9–12)

## Tuần 9 (23/11 – 29/11): Intervals/Greedy, OS/Network, Scaling cơ bản

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-09.md](100-ngay/tuan-09.md)

⏱ **Tổng tuần: 18h20'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Trả lời trọn vẹn câu *"Chuyện gì xảy ra khi gõ URL vào trình duyệt?"*. Hiểu stateless, load balancer, consistent hashing.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D57 (T2) | 56 Merge Intervals | Process vs Thread, concurrency vs parallelism, race condition, mutex, mô hình concurrency của ngôn ngữ bạn dùng | Hussein Nasser | 2h20' |
| D58 (T3) | 57 Insert Interval | TCP vs UDP, bắt tay 3 bước, DNS, TLS/HTTPS | Hussein Nasser, ByteByteGo | 2h20' |
| D59 (T4) | 435 Non-overlapping Intervals | **"Gõ URL vào trình duyệt"**: tự viết câu trả lời đầy đủ | github.com/alex/what-happens-when | 2h20' |
| D60 (T5) | 53 Maximum Subarray | Scale dọc vs scale ngang, service stateless, **Load balancer** (L4/L7, các thuật toán) | Alex Xu ch.1 | 2h20' |
| D61 (T6) | 55 Jump Game | **Consistent hashing**, CDN, reverse proxy, API Gateway | Alex Xu ch.5 | 2h20' |
| D62 (T7) | 45 Jump Game II | **Lab – Dự án:** `docker compose` chạy 2 instance sau Nginx, đưa session/state ra Redis | — | 4h00' |
| D63 (CN) | 134 Gas Station | **Chốt tuần 9** | — | 2h40' |

**Câu hỏi cuối bài**

- **D57 – Concurrency**
  1. Process khác Thread ở đâu?
  2. Cho một ví dụ race condition và cách tránh.
  3. Ngôn ngữ bạn dùng xử lý nhiều request cùng lúc thế nào (event loop, thread pool, goroutine…)?
- **D58 – Network**
  1. TCP và UDP khác nhau thế nào? Mỗi loại dùng cho việc gì?
  2. Bắt tay 3 bước diễn ra thế nào?
  3. HTTPS bảo vệ được những gì?
- **D59 – Gõ URL**
  - Tự nói trong 5 phút và kiểm tra đã đủ các ý: DNS → TCP → TLS → HTTP request → LB → server → DB → response → trình duyệt render.
- **D60 – Scaling & LB**
  1. Vì sao scale ngang đòi hỏi service phải stateless? Session khi đó lưu ở đâu?
  2. Load balancer L4 khác L7 thế nào?
  3. Round-robin khác least connections ra sao?
- **D61 – Consistent hashing**
  1. Chia server bằng `hash mod N` gặp vấn đề gì khi thêm hoặc bớt server? Consistent hashing giải quyết thế nào? Virtual node để làm gì?
  2. CDN cache những gì?
  3. API Gateway đảm nhận những việc gì?

**✅ Chốt tuần 9**

1. Trả lời "gõ URL" trọn vẹn trong 5 phút.
2. Vẽ consistent hashing ra giấy và giải thích.
3. Vì sao service phải stateless thì mới scale ngang được?
4. Bài intervals: vì sao thường sort theo điểm bắt đầu trước? Greedy đúng khi nào?
5. Một race condition bạn từng gặp, hoặc có thể xảy ra, trong dự án.

**Sản phẩm:** 2 instance chạy sau Nginx.
- [ ] Đạt chốt tuần 9

---

## Tuần 10 (30/11 – 06/12): DP 1D, khung System Design, các case study đầu tiên

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-10.md](100-ngay/tuan-10.md)

⏱ **Tổng tuần: 18h50'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Thuộc khung System Design 5 bước. Ước lượng được QPS và dung lượng lưu trữ. Tự giải được bài URL Shortener và Rate Limiter.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D64 (T2) | 70 Climbing Stairs | **Khung phỏng vấn SD 5 bước**, yêu cầu chức năng vs phi chức năng | Alex Xu ch.3 | 2h05' |
| D65 (T3) | 746 Min Cost Climbing Stairs | **Ước lượng nhanh:** QPS, dung lượng, băng thông, các con số latency cần nhớ | Alex Xu ch.2 | 2h10' |
| D66 (T4) | 198 House Robber | **Case: URL Shortener** | Alex Xu ch.8 | 2h35' |
| D67 (T5) | 213 House Robber II | **Case: Rate Limiter** | Alex Xu ch.4 | 2h35' |
| D68 (T6) | 322 Coin Change | **Case: Unique ID Generator** (Snowflake) | Alex Xu ch.7 | 2h45' |
| D69 (T7) | 300 Longest Increasing Subsequence | **Lab:** tự giải URL Shortener trên giấy trong 45' (không nhìn sách) rồi so với sách. **Dự án:** rate limiter token bucket bằng Redis | — | 3h55' |
| D70 (CN) | 139 Word Break | **Chốt tuần 10** | — | 2h45' |

**Câu hỏi cuối bài**

- **D64 – Khung SD**
  1. Kể 5 bước và cách chia thời gian trong 45 phút.
  2. Kể 5 yêu cầu phi chức năng hay gặp.
  3. Vì sao không nên nhảy vào vẽ kiến trúc ngay từ đầu?
- **D65 – Ước lượng**
  1. 10 triệu người dùng/ngày, mỗi người 10 request/ngày. QPS trung bình và QPS lúc cao điểm là bao nhiêu?
  2. Lưu 1 tỷ URL, mỗi URL 500 byte thì cần bao nhiêu dung lượng?
  3. Đọc từ RAM, SSD và qua mạng nội bộ datacenter chênh nhau bao nhiêu bậc?
- **D66 – URL Shortener**
  1. Sinh mã ngắn bằng hash hay bằng base62 của một bộ đếm? Trade-off là gì?
  2. Redirect bằng 301 hay 302? Khác nhau thế nào?
  3. Scale phần đọc bằng cách nào?
- **D67 – Rate Limiter**
  1. So sánh token bucket, fixed window, sliding window.
  2. Đặt rate limiter ở đâu trong hệ thống?
  3. Rate limit trên nhiều server dùng chung Redis: race condition xảy ra ở đâu, xử lý thế nào?
- **D68 – ID Generator**
  1. Vì sao auto-increment không đủ trong hệ phân tán?
  2. Cấu trúc một Snowflake ID gồm những phần nào?
  3. UUID ngẫu nhiên có nhược điểm gì với B-Tree index?

**✅ Chốt tuần 10**

1. Trình bày bài Rate Limiter trong 20 phút, đủ 5 bước.
2. Ước lượng QPS và dung lượng lưu trữ cho một hệ thống tự chọn.
3. DP: xác định state, công thức chuyển trạng thái, trường hợp cơ sở cho bài Coin Change.
4. Memoization khác tabulation thế nào?
5. So sánh Snowflake và UUID.

**Sản phẩm:** Rate limiter chạy được + bản vẽ URL Shortener.
- [ ] Đạt chốt tuần 10

---

## Tuần 11 (07/12 – 13/12): DP 2D, Trie, Message Queue, CAP

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-11.md](100-ngay/tuan-11.md)

⏱ **Tổng tuần: 19h20'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Hiểu xử lý bất đồng bộ, delivery guarantee, consumer idempotent và định lý CAP. Làm được bài Notification System.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D71 (T2) | 62 Unique Paths | **Message Queue:** vì sao cần, producer/consumer, ack, retry, DLQ | ByteByteGo | 2h30' |
| D72 (T3) | 1143 Longest Common Subsequence | **Delivery guarantees** + consumer idempotent | ByteByteGo | 2h35' |
| D73 (T4) | 208 Implement Trie | **Kafka vs RabbitMQ vs SQS** (bảng Tier 2): thứ tự, partition, consumer group | ByteByteGo | 2h35' |
| D74 (T5) | 211 Design Add and Search Words | **CAP**, các mô hình nhất quán (strong / eventual / read-your-writes) | ByteByteGo, DDIA ch.9 (đọc lướt) | 2h30' |
| D75 (T6) | 5 Longest Palindromic Substring | **Case: Notification System** | Alex Xu ch.10 | 2h20' |
| D76 (T7) | 518 Coin Change II | **Lab – Dự án:** tạo đơn → publish event (RabbitMQ) → consumer gửi "email" giả; consumer idempotent + retry + DLQ | — | 3h55' |
| D77 (CN) | Làm lại bài trong Error List | **Chốt tuần 11** | — | 2h55' |

**Câu hỏi cuối bài**

- **D71 – Message Queue**
  1. Kể 3 lợi ích của message queue.
  2. Gửi email xác nhận sau khi đặt hàng nên làm đồng bộ hay bất đồng bộ? Vì sao?
  3. Consumer xử lý lỗi thì sao: retry như thế nào, khi nào đẩy vào DLQ?
- **D72 – Delivery guarantees**
  1. Phân biệt at-most-once, at-least-once, exactly-once.
  2. Vì sao thực tế thường chọn at-least-once kết hợp consumer idempotent?
  3. Thiết kế một consumer idempotent (bảng chống trùng, unique key).
- **D73 – Kafka / RabbitMQ / SQS**
  1. Lập bảng so sánh ba hệ thống.
  2. Kafka đảm bảo thứ tự message ở phạm vi nào?
  3. Consumer group giúp scale việc xử lý thế nào?
- **D74 – CAP**
  1. Phát biểu CAP cho đúng: khi mạng bị chia cắt (partition) thì phải chọn C hoặc A.
  2. Cho ví dụ một hệ thống chọn AP và một hệ thống chọn CP.
  3. Eventual consistency ảnh hưởng tới trải nghiệm người dùng ra sao? Giao diện nên xử lý thế nào?
- **D75 – Notification System**
  1. Vẽ kiến trúc có queue riêng cho từng kênh gửi.
  2. Chống gửi trùng thông báo bằng cách nào?
  3. Xử lý retry và rate limit khi gọi nhà cung cấp bên thứ ba ra sao?

**✅ Chốt tuần 11**

1. Vì sao exactly-once khó đạt được? Thực tế người ta giải quyết thế nào?
2. Chọn Kafka hay RabbitMQ cho: (a) luồng log sự kiện rất lớn, (b) hàng đợi tác vụ gửi email?
3. Giải thích CAP trong 2 phút, có ví dụ.
4. Trình bày Notification System trong 25 phút.
5. Trie dùng cho autocomplete: độ phức tạp của thao tác tìm theo tiền tố?

**Sản phẩm:** Luồng event có consumer idempotent, có DLQ.
- [ ] Đạt chốt tuần 11

---

## Tuần 12 (14/12 – 20/12): Microservices, Resilience, Observability, case study

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-12.md](100-ngay/tuan-12.md)

⏱ **Tổng tuần: 17h00'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Nắm trade-off của microservices, Saga + Outbox, Circuit Breaker, SLO. Tự giải một bài SD tổng hợp.
**DSA tuần này:** làm lại các bài cũ có bấm giờ (≤ 25'/bài) để luyện tốc độ.

| Ngày | DSA (bấm giờ) | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D78 (T2) | Làm lại 238 | Monolith vs Microservices, database-per-service | ByteByteGo | 2h10' |
| D79 (T3) | Làm lại 3 | **Resilience:** timeout, retry với exponential backoff + jitter, circuit breaker, bulkhead | ByteByteGo | 2h05' |
| D80 (T4) | Làm lại 33 | **2PC vs Saga** (choreography / orchestration), **Outbox pattern** | microservices.io | 2h15' |
| D81 (T5) | Làm lại 146 | **Observability:** log / metric / trace, correlation ID, SLI / SLO / SLA | Google SRE book ch.4 (đọc lướt) | 2h10' |
| D82 (T6) | Làm lại 207 | **Case: News Feed** | Alex Xu ch.11 | 2h10' |
| D83 (T7) | **Mock coding:** 2 bài mới trong 60' | **Case: Chat System**: tự làm 45' trên giấy trước, sau đó mới đọc Alex Xu ch.12 | — | 3h35' |
| D84 (CN) | Làm lại 322 | **Chốt tuần 12 + Chốt Giai đoạn 3** | — | 2h35' |

**Câu hỏi cuối bài**

- **D78 – Microservices**
  1. Kể 3 lợi ích và 3 cái giá phải trả của microservices.
  2. Vì sao dùng chung một database cho nhiều service là anti-pattern?
  3. Team 5 người làm sản phẩm mới nên chọn kiến trúc nào?
- **D79 – Resilience**
  1. Retry mà không có backoff thì gây ra chuyện gì (retry storm)?
  2. Circuit breaker có 3 trạng thái nào? Chuyển trạng thái khi nào?
  3. Chuỗi gọi A → B → C thì đặt timeout ở mỗi chặng thế nào?
- **D80 – Saga & Outbox**
  1. Thiết kế Saga cho luồng đặt hàng qua 3 service (Order, Payment, Inventory), có bước bù trừ (compensating).
  2. Choreography khác orchestration thế nào?
  3. Outbox giải quyết tình huống "ghi DB thành công nhưng publish event thất bại" ra sao?
- **D81 – Observability**
  1. Log, metric, trace: mỗi loại trả lời câu hỏi gì?
  2. Trace ID được truyền qua các service bằng cách nào?
  3. SLO 99,9% cho phép hệ thống ngừng hoạt động tối đa bao nhiêu phút mỗi tháng?
- **D82 – News Feed**
  1. Fan-out khi ghi và fan-out khi đọc: trade-off là gì? Xử lý tài khoản có hàng triệu follower thế nào?
  2. Nên cache những gì?
  3. Phân trang feed ra sao?
- **D83 – Chat**
  1. WebSocket khác long polling thế nào?
  2. Tin nhắn nên lưu vào đâu? Vì sao?
  3. Hiển thị trạng thái online/offline bằng cách nào?

**✅ Chốt tuần 12 — Tổng kết Giai đoạn 3**

1. **SD 45', đề mới:** *"Thiết kế hệ thống đặt hàng cho đợt flash sale"*. Đề này tổng hợp mọi thứ đã học: cache, queue, khoá tồn kho, rate limit, idempotency.
2. Giải thích Saga + Outbox.
3. Giải thích Circuit Breaker.
4. Phân biệt SLI, SLO, SLA.
5. Trade-off của microservices.

- [ ] Đạt chốt Giai đoạn 3

> 💡 **Từ tuần 12, nên bắt đầu nộp CV** vào 2–3 công ty bạn *ít ưu tiên* để lấy kinh nghiệm phỏng vấn thật.

---

# GIAI ĐOẠN 4 — DEVOPS CƠ BẢN, BEHAVIORAL, TỔNG DUỢT (Tuần 13–14 + D99–100)

## Tuần 13 (21/12 – 27/12): Docker/K8s/CI-CD ở mức khái niệm + câu chuyện cá nhân

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-13.md](100-ngay/tuan-13.md)

⏱ **Tổng tuần: 19h15'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Giải thích được luồng từ lúc commit đến lúc lên production. Có 5 câu chuyện STAR và phần giới thiệu bản thân trơn tru.

| Ngày | DSA | Bài học buổi tối | Tài liệu | ⏱ Tổng |
|---|---|---|---|---|
| D85 (T2) | 128 Longest Consecutive Sequence | **Docker:** container vs VM, image, layer, multi-stage build (hiểu, không cần thuộc) | Docker docs | 2h20' |
| D86 (T3) | 567 Permutation in String | **K8s khái niệm:** Pod, Deployment, Service, Ingress, ConfigMap/Secret, HPA, probe | kubernetes.io – *Concepts* | 2h30' |
| D87 (T4) | 150 Evaluate Reverse Polish Notation | **CI/CD** + Blue-Green / Canary / Rolling + migration DB không downtime (expand–contract) | ByteByteGo | 2h35' |
| D88 (T5) | 236 LCA of a Binary Tree | **Behavioral – STAR:** viết 5 câu chuyện | — | 2h35' |
| D89 (T6) | 131 Palindrome Partitioning | **Giới thiệu bản thân 2 phút** + trình bày dự án xuyên suốt + viết lại CV có số liệu | — | 2h35' |
| D90 (T7) | **Mock coding:** 2 bài trong 60' | **Lab – Dự án:** Dockerfile, GitHub Actions (lint, test, build), README có sơ đồ kiến trúc | — | 4h00' |
| D91 (CN) | Làm lại bài trong Error List | **Chốt tuần 13** | — | 2h40' |

**Câu hỏi cuối bài**

- **D85 – Docker**
  1. Container khác VM ở đâu?
  2. Image layer và cache khi build: vì sao nên COPY file khai báo dependency trước rồi mới COPY source?
  3. Vì sao image nhỏ thì tốt hơn?
- **D86 – K8s**
  1. Pod, Deployment, Service liên quan với nhau thế nào?
  2. Readiness probe khác liveness probe ra sao?
  3. HPA dựa vào đâu để scale?
- **D87 – CI/CD**
  1. Một pipeline chuẩn gồm những bước nào?
  2. So sánh Blue-Green, Canary, Rolling theo rủi ro, tốc độ rollback và chi phí.
  3. Đổi tên một cột trong DB mà không gây downtime thì làm thế nào?
- **D88 – 5 câu chuyện STAR**
  - Dự án bạn tự hào nhất / bug khó nhất / bất đồng với đồng nghiệp / một sai lầm và bài học / tối ưu hiệu năng (dùng lab tuần 6).
  - Tự kiểm tra: mỗi chuyện ≤ 2 phút, có số liệu, nói rõ **"tôi"** đã làm gì chứ không chỉ "team".
- **D89 – Dự án**
  1. Vì sao bạn chọn Postgres, Redis, RabbitMQ?
  2. Nếu traffic tăng 100 lần, bạn sửa gì đầu tiên?
  3. Nếu làm lại từ đầu, bạn sẽ làm khác điều gì?

**✅ Chốt tuần 13**

1. Kể luồng code đi từ lúc commit đến production.
2. Giải thích Pod / Deployment / Service.
3. So sánh Canary và Blue-Green.
4. Kể 2 câu chuyện STAR trơn tru, không vấp.
5. Trình bày dự án trong 5 phút: kiến trúc + 3 quyết định kỹ thuật + trade-off.

**Sản phẩm:** Dự án có README, sơ đồ, CI chạy xanh.
- [ ] Đạt chốt tuần 13

---

## Tuần 14 (28/12 – 03/01): Tổng ôn & Mock

📄 **Chi tiết từng ngày (mục kiến thức, Tier, từ khoá research, thẻ Anki):** [100-ngay/tuan-14.md](100-ngay/tuan-14.md)

⏱ **Tổng tuần: 19h20'** (chưa tính 1h tiếng Anh mỗi ngày)

**Mục tiêu:** Không học thêm nội dung mới. Chỉ ôn lại, sửa điểm yếu và phỏng vấn thử.

| Ngày | DSA | Buổi tối | ⏱ Tổng |
|---|---|---|---|
| D92 (T2) | Làm lại bài hay sai nhất trong Error List | **Ôn Giai đoạn 1:** trả lời lại chốt tuần 1–4 | 2h40' |
| D93 (T3) | Error List | **Ôn Giai đoạn 2:** trả lời lại chốt tuần 5–8 | 2h40' |
| D94 (T4) | Error List | **Ôn Giai đoạn 3:** trả lời lại chốt tuần 9–12 | 2h40' |
| D95 (T5) | 1 bài Medium mới, 45' | **Mock SD 45':** *"Thiết kế hệ thống thương mại điện tử: sản phẩm – giỏ hàng – đặt hàng – thanh toán"* | 2h25' |
| D96 (T6 – 01/01) | — | **Mock đầy đủ:** 45' coding + 45' SD + 15' behavioral. Nhờ bạn bè hoặc tự quay video | 2h45' |
| D97 (T7) | Làm lại bài sai trong buổi mock | Xem lại video mock, liệt kê 3 điểm yếu và sửa | 4h00' |
| D98 (CN) | — | Ôn nhẹ Anki. Chuẩn bị 3–5 câu hỏi để hỏi ngược nhà tuyển dụng | 2h10' |

## D99 – D100 (04/01 – 05/01/2027): Sẵn sàng

📄 Chi tiết: [100-ngay/tuan-14.md](100-ngay/tuan-14.md)

- Mock lần cuối (1 coding + 1 SD) và nộp CV vào các công ty ưu tiên.
- [ ] Hoàn thành lộ trình 100 ngày

---

## Phụ lục A — Tổng hợp nội dung

| Hạng mục | Số lượng |
|---|---|
| Bài DSA mới | ~85 bài, bao phủ 14 pattern |
| Bài học lý thuyết | ~60 bài |
| Case study System Design | 7 bài (URL Shortener, Rate Limiter, ID Generator, Notification, News Feed, Chat, Flash Sale) + 1 bài mock E-commerce |
| Dự án xuyên suốt | 1 dự án có ~8 tính năng kỹ thuật để kể khi phỏng vấn |
| Câu chuyện STAR | 5 câu chuyện |

## Phụ lục B — Những phần trong Roadmap gốc cố ý bỏ qua trong 100 ngày

Để dành sau khi đã có việc mới, học tiếp theo [Roadmap.md](Roadmap.md):

- **Phase 2:** Vacuum/bloat, config PgBouncer, GIN/GiST chi tiết
- **Phase 3:** Raft/Paxos, DDD chuyên sâu (Bounded Context, Aggregate), Event Sourcing, Strangler Fig, Service Mesh
- **Phase 4:** Terraform, IaC thực hành, VPC/Subnet/IAM, GitOps, tối ưu chi phí cloud
- **Phase 5:** Toàn bộ (TOGAF, Zero Trust, Build vs Buy, TCO, viết RFC)

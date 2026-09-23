# Tuần 3 (12/10 – 18/10): Stack, Binary Search, Behavioral/Structural Patterns, Repository

[← Tuần 2](tuan-02.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 4 →](tuan-04.md)

**Mục tiêu tuần:** Nắm Strategy, Observer, Adapter, Decorator, Repository và kiến trúc phân lớp. Monotonic stack. Binary search trên không gian đáp án. Cuối tuần kể được "tôi đã dùng pattern X trong dự án thật để giải quyết Y".

> Cách học theo Tier (T1 → Anki, T2 → bảng so sánh, T3 → chỉ tra cứu): xem lại bảng [Cách học theo Tier ở Tuần 1](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Học đến đâu thì dừng theo cột *Cần nắm tới mức nào*.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Ý đồ và cấu trúc của Strategy / Observer / Adapter / Decorator, Strategy khác Factory, nhược điểm của Observer, phát event trước hay sau commit, Repository & Unit of Work, kiến trúc phân lớp (Controller – Service – Repository), vị trí của business logic và transaction boundary, CQRS cơ bản, các pattern DSA: Stack, Monotonic Stack, Binary Search (trên index và trên không gian đáp án) | Observer vs Pub/Sub, Adapter vs Decorator vs Proxy vs Facade, Active Record vs Repository (Data Mapper), Layered vs Hexagonal/Clean, CQRS vs một model chung | Chain of Responsibility chi tiết, Anti-Corruption Layer, Event Sourcing, cú pháp EventEmitter / `@EventListener`, API session/transaction của ORM, cách tính `mid` tránh tràn số theo từng ngôn ngữ, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D15 (T2) | 39' | 63' | 1h42' |
| D16 (T3) | 54' | 83' | 2h17' |
| D17 (T4) | 59' | 88' | 2h27' |
| D18 (T5) | 39' | 80' | 1h59' |
| D19 (T6) | 54' | 87' | 2h21' |
| D20 (T7) | — | 4h00' | 4h00' |
| D21 (CN) | — | 3h00' | 3h00' |

**Tổng tuần: 17h46'** (chưa tính 1h tiếng Anh mỗi ngày)

Ngày nặng nhất là D20 (4h00'), vì lab đã được rút xuống 3h05'. Bảng *Layered vs Hexagonal* chuyển thành tuỳ chọn để tối D19 không vượt 90'.

---

## D15 (T2, 12/10): Strategy

**⏱ Ước tính:** Giờ làm 39' (DSA 25' + Anki 14') · Tối 63' (Học 35' + Ghi chú/Anki 10' + Tự kiểm tra 18') · **Tổng 1h42'**

### 🧩 DSA: [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

- **Pattern (🔴 T1):** *Stack cho cấu trúc lồng nhau*. Dấu hiệu: "mở – đóng", "gần nhất chưa được xử lý", "khớp theo cặp" → nghĩ ngay tới stack (LIFO).
- **Cách giải:** gặp dấu mở thì push; gặp dấu đóng thì stack phải không rỗng và đỉnh phải là dấu mở tương ứng, rồi pop. Cuối cùng stack phải rỗng. → O(n) thời gian, O(n) bộ nhớ.
- **Mẹo gọn code:** map `dấu đóng → dấu mở`: `{')': '(', ']': '[', '}': '{'}`.
- **Lỗi hay gặp:**
  - Pop khi stack đang rỗng (input `"]"`).
  - Quên kiểm tra stack rỗng ở cuối (input `"(("`).
  - Có thể trả `false` sớm nếu độ dài chuỗi lẻ.

### 📘 Bài học buổi tối: Strategy

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Strategy**: đóng gói một họ thuật toán, mỗi thuật toán một class cùng interface, có thể hoán đổi lúc chạy | 🔴 T1 | Vẽ được Context → Strategy interface ← ConcreteStrategy A/B/C | `strategy pattern refactoring guru` |
| 2 | Thay `if/else/switch` theo loại bằng Strategy | 🔴 T1 | Refactor được một `switch` 3 nhánh; biết việc *chọn* strategy vẫn cần một map/factory ở một chỗ | `replace conditional with strategy` |
| 3 | **Strategy khác Factory**: Factory *tạo đối tượng* (creational), Strategy *đóng gói hành vi* (behavioral). Hai pattern thường đi cùng nhau | 🔴 T1 | Nói được bằng một câu, và chỉ ra được trong một thiết kế đâu là factory, đâu là strategy | `strategy vs factory pattern` |
| 4 | Strategy dạng hàm (truyền function/lambda) trong ngôn ngữ có first-class function | 🔴 T1 | Biết khi nào một hàm là đủ, khi nào cần class (strategy có state hoặc có nhiều method) | `strategy pattern with functions lambda` |
| 5 | Strategy vs State | 🟢 T3 | Chỉ cần biết: cấu trúc giống nhau; State thì chính object tự chuyển trạng thái, Strategy thì client chọn | `strategy vs state pattern` |

**Chi tiết cần hiểu**

- **Trước và sau (mục 2):**
  - Trước: `if carrier == "GHN": fee = ... elif carrier == "GHTK": fee = ... elif ...`. Mỗi hãng mới là một lần sửa hàm này, và hàm này bị cả team cùng sửa.
  - Sau: interface `ShippingFeeStrategy.calculate(parcel) → fee`. Mỗi hãng một class. Map `carrier → strategy` nằm ở composition root.
  - Việc "chọn" không biến mất, chỉ **được gom về một chỗ** và thành tra map thay vì rẽ nhánh. Hãy nói rõ điều này khi phỏng vấn, người phỏng vấn đánh giá cao sự trung thực.
- **Strategy + Factory đi cùng nhau:** factory (hoặc registry) trả về strategy phù hợp theo input; context dùng strategy đó. Một cái lo việc *lấy đúng object*, cái kia lo việc *làm theo cách nào*.
- **Liên hệ Tuần 1:** Strategy chính là composition ở ví dụ Duck (`flyBehavior`), và là cách hiện thực OCP.
- **Khi nào không cần Strategy:** chỉ có 2 nhánh và gần như không bao giờ thêm nhánh mới. Khi đó `if/else` rõ ràng hơn (YAGNI).

**🔴 Thẻ Anki (T1)**

1. Strategy pattern gồm những thành phần nào?
2. Strategy thay thế chuỗi `if/else` như thế nào? Việc "chọn" strategy nằm ở đâu?
3. Strategy khác Factory ở đâu? Chúng phối hợp với nhau thế nào?
4. Khi nào một function/lambda là đủ thay cho class Strategy?
5. *(DSA-Pattern)* Đề có cặp "mở – đóng" lồng nhau → cấu trúc dữ liệu gì?

**Tài liệu:**
- refactoring.guru: *Strategy*
- refactoring.guru: *Replace Conditional with Polymorphism* (mục Refactoring techniques)

**❓ Câu hỏi cuối bài**

1. Strategy thay thế chuỗi `if/else/switch` như thế nào?
2. Strategy khác Factory ở đâu? (một bên *tạo đối tượng*, một bên *chọn hành vi*)
3. Thiết kế tính phí ship cho GHN / GHTK / ViettelPost bằng Strategy.

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Trong ngôn ngữ bạn dùng, khi nào chỉ cần truyền một hàm `fee_fn(parcel) -> int` thay vì tạo interface + class Strategy? Nếu strategy của GHN cần giữ API token, cache bảng giá và có thêm method `estimate_days()` thì lựa chọn đổi thế nào? Còn nếu chỉ có đúng 2 hãng và không bao giờ thêm thì sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Mỗi nhánh thành một class cùng interface. Context gọi qua interface. Việc **chọn** strategy không biến mất mà gom về một chỗ (map/registry/factory ở composition root). Thêm loại mới = thêm class + đăng ký, không sửa context (OCP).
- **Câu 2:** Factory là creational: lấy/tạo **đúng object**. Strategy là behavioral: object đó **làm việc theo cách nào**. Thường đi cùng nhau: factory/registry trả về strategy, context dùng strategy đó.
- **Câu 3:** Interface `ShippingFeeStrategy.calculate(parcel) → fee`; 3 class GHN/GHTK/ViettelPost; registry `carrier → strategy`; `ShippingService` chỉ gọi interface; nêu cách test từng strategy riêng.
- **Câu 4:** Hàm là đủ khi strategy không có state và chỉ có một thao tác. Cần class khi có state/dependency (token, cache) hoặc nhiều method liên quan. Chỉ 2 nhánh cố định thì `if/else` rõ hơn (YAGNI).

</details>

---

## D16 (T3, 13/10): Observer / Pub-Sub

**⏱ Ước tính:** Giờ làm 54' (DSA 40' + Anki 14') · Tối 83' (Học 40' + Bảng T2 15' + Ghi chú/Anki 10' + Tự kiểm tra 18') · **Tổng 2h17'**

### 🧩 DSA: [155. Min Stack](https://leetcode.com/problems/min-stack/)

- **Pattern (🔴 T1):** *Stack lưu kèm trạng thái phụ*. Mỗi phần tử trong stack nhớ luôn "min tính tới thời điểm push".
- **Các cách:**
  1. Stack các cặp `(value, currentMin)` → mọi thao tác O(1), bộ nhớ O(n).
  2. Hai stack: stack chính + stack min (chỉ push vào stack min khi giá trị mới `≤` min hiện tại) → O(1), tiết kiệm bộ nhớ hơn khi ít thay đổi min.
- **Lỗi hay gặp ở cách 2:** dùng `<` thay vì `≤`. Khi có giá trị min trùng nhau, pop một lần sẽ làm mất min dù vẫn còn một bản sao trong stack chính.
- **Key insight:** vì sao không cần "cập nhật lại min" khi pop? Vì stack là LIFO: trạng thái bên dưới không đổi, nên min đã lưu ở mỗi tầng vẫn đúng.

### 📘 Bài học buổi tối: Observer / Pub-Sub

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Observer**: subject giữ danh sách observer, khi có sự kiện thì thông báo cho tất cả | 🔴 T1 | Vẽ được `subscribe / unsubscribe / notify` | `observer pattern refactoring guru` |
| 2 | Push model vs pull model (subject gửi dữ liệu đi, hay observer tự hỏi lại) | 🟢 T3 | Biết có hai kiểu | `observer push vs pull model` |
| 3 | **Observer vs Pub/Sub** | 🟡 T2 | Điền bảng; nói được điểm khác cốt lõi: Pub/Sub có broker/event bus ở giữa, hai bên không biết nhau | `observer vs pub sub difference` |
| 4 | Nhược điểm của Observer | 🔴 T1 | Kể được ≥ 4 nhược điểm (xem chi tiết) | `observer pattern disadvantages`, `lapsed listener problem` |
| 5 | Observer mặc định chạy **đồng bộ, cùng process** | 🔴 T1 | Biết hệ quả: observer chậm làm chậm subject; observer ném lỗi có thể chặn các observer sau | `synchronous event listener` |
| 6 | Cơ chế event trong framework (Node `EventEmitter`, Spring `ApplicationEventPublisher` / `@EventListener`, Django signals, domain event) | 🟢 T3 | Biết framework mình có gì; cú pháp tra docs | docs framework |
| 7 | Phát sự kiện **trước hay sau commit** transaction | 🔴 T1 | Nói được hậu quả: listener gửi email trước commit, sau đó transaction rollback → khách nhận email cho đơn không tồn tại. Biết framework có cơ chế "chạy sau commit". Giải pháp đầy đủ (Outbox) để Tuần 11 | `transactional event listener after commit`, `send email before transaction commit problem` |

**Chi tiết cần hiểu**

- **Ví dụ trong backend:** khi đơn hàng được đặt (`OrderPlaced`), cần gửi email, cộng điểm thưởng, ghi analytics. Thay vì `OrderService` gọi thẳng ba service, nó phát sự kiện; ba observer tự đăng ký. `OrderService` không cần biết ai đang nghe → giảm coupling.
- **Nhược điểm (mục 4):**
  - **Khó trace luồng:** đọc code `OrderService` không thấy ai được gọi; phải tìm mọi nơi subscribe.
  - **Rò rỉ bộ nhớ (lapsed listener):** observer đã hết dùng nhưng quên `unsubscribe`, subject vẫn giữ tham chiếu nên không được giải phóng.
  - **Thứ tự thông báo không được đảm bảo**, đừng viết logic dựa vào thứ tự.
  - **Chạy đồng bộ:** một observer chậm (gọi API ngoài) làm chậm cả request; một observer ném exception có thể làm hỏng các observer sau hoặc làm fail luôn nghiệp vụ chính.
  - **Chuỗi cập nhật dây chuyền:** observer A phát sự kiện kích hoạt B, B lại kích hoạt A.
- **Observer vs Pub/Sub (mục 3):**
  - Observer: subject giữ trực tiếp danh sách observer, thường cùng process, thường đồng bộ.
  - Pub/Sub: publisher gửi message vào một **topic/channel** trên broker (Redis Pub/Sub, RabbitMQ, Kafka); subscriber nhận từ broker. Hai bên không biết nhau, thường bất đồng bộ, có thể khác process/máy.
  - Hệ quả: Pub/Sub decouple mạnh hơn và scale được, nhưng thêm độ trễ, thêm hạ tầng, và phải nghĩ tới việc mất hoặc trùng message (sẽ học ở Tuần 11).
- **Node `EventEmitter`** là Observer: `emit()` gọi các listener **đồng bộ** theo thứ tự đăng ký, cùng process.
- **Trước hay sau commit (mục 7):** nếu `OrderService` phát `OrderPlaced` **bên trong** transaction, listener gửi email sẽ chạy ngay. Nếu sau đó bước trừ tồn kho lỗi và transaction rollback, email đã gửi thì không thu hồi được. Cách tối thiểu là chỉ chạy listener có tác dụng bên ngoài **sau khi commit thành công** (Spring `@TransactionalEventListener(phase = AFTER_COMMIT)`, hoặc hook after-commit của ORM). Nhưng khi đó, nếu process chết ngay sau commit thì sự kiện bị mất. Đó là lý do cần *Transactional Outbox* (Tuần 11).

**🟡 Bảng so sánh T2: Observer vs Pub/Sub**

Nhóm: *messaging/eventing*. Trục chính: **đơn giản, tức thời** vs **decouple mạnh, scale được**.

| Tiêu chí | Observer (in-process) | Pub/Sub (qua broker) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Publisher có biết subscriber không? | | |
| Ext: Đồng bộ/bất đồng bộ, cùng process hay khác process | | |
| Ext: Chuyện gì xảy ra với sự kiện khi subscriber đang chết? | | |

**🔴 Thẻ Anki (T1)**

1. Observer pattern gồm những thành phần và thao tác nào?
2. Observer khác Pub/Sub ở điểm cốt lõi nào?
3. Kể 4 nhược điểm của Observer.
4. Lapsed listener là gì?
5. Vì sao một observer chậm có thể làm chậm cả request?
6. Vì sao không nên gửi email trong listener chạy **trước** khi transaction commit?
7. *(DSA-Pattern)* Min Stack: làm sao lấy min trong O(1) mà pop vẫn đúng?

**Tài liệu:**
- refactoring.guru: *Observer*
- Docs event của framework bạn dùng (ví dụ Node.js docs mục *Events*)

**❓ Câu hỏi cuối bài**

1. Observer khác Pub/Sub (có broker ở giữa) thế nào?
2. Nêu nhược điểm của Observer (khó trace luồng, rò rỉ bộ nhớ nếu quên unsubscribe).
3. EventEmitter hoặc cơ chế event trong framework của bạn thuộc pattern nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. `OrderPlaced` có 3 listener đồng bộ, cùng process: gửi email (gọi SMTP mất 3 giây), cộng điểm thưởng, ghi analytics. Listener email ném exception. Request đặt đơn và 2 listener còn lại bị ảnh hưởng thế nào? Nếu các listener chạy **bên trong** transaction đặt đơn thì còn rủi ro gì? Đề xuất 2 hướng xử lý.

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Observer: subject giữ trực tiếp danh sách observer, cùng process, thường đồng bộ. Pub/Sub: có broker/topic ở giữa, hai bên không biết nhau, thường bất đồng bộ, khác process. Pub/Sub decouple mạnh và scale được, nhưng thêm độ trễ, thêm hạ tầng, phải lo mất/trùng message.
- **Câu 2:** Khó trace luồng; lapsed listener (quên unsubscribe → rò bộ nhớ); thứ tự không đảm bảo; đồng bộ nên observer chậm/lỗi ảnh hưởng subject; cập nhật dây chuyền/vòng lặp.
- **Câu 3:** Nêu cơ chế cụ thể (Node `EventEmitter`, Spring events, Django signals...) → là Observer in-process. Nói được nó chạy đồng bộ hay bất đồng bộ, và lỗi của listener có lan ra không.
- **Câu 4:** Request chậm thêm ≥ 3 giây. Exception có thể chặn các listener sau và làm fail cả request đặt đơn. Nếu chạy trong transaction: rollback sau khi email đã gửi, hoặc lỗi email làm rollback luôn đơn hàng. Hướng xử lý: bắt lỗi riêng từng listener; chạy sau commit; đẩy việc chậm (email) sang queue/bất đồng bộ (Outbox, Tuần 11).

</details>

---

## D17 (T4, 14/10): Adapter & Decorator (+ middleware)

**⏱ Ước tính:** Giờ làm 59' (DSA 45' + Anki 14') · Tối 88' (Học 40' + Bảng T2 20' + Ghi chú/Anki 10' + Tự kiểm tra 18') · **Tổng 2h27'**

### 🧩 DSA: [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)

- **Pattern (🔴 T1):** *Monotonic Stack*. Dấu hiệu: "với mỗi phần tử, tìm phần tử **lớn hơn / nhỏ hơn gần nhất** về bên phải (hoặc bên trái)".
- **Các cách:**
  1. Với mỗi ngày, quét về phía sau tìm ngày ấm hơn → O(n²).
  2. Stack chứa **index** của những ngày chưa tìm được ngày ấm hơn; nhiệt độ theo stack giảm dần từ đáy lên đỉnh. Gặp ngày `i` ấm hơn đỉnh stack thì pop và gán `answer[idx] = i − idx` → O(n) thời gian, O(n) bộ nhớ.
- **Key insight:** vì sao là O(n) dù có vòng `while` bên trong? Mỗi index được push đúng một lần và pop tối đa một lần → tổng số thao tác ≤ 2n (phân tích amortized ở Tuần 1).
- **Lưu ý:** lưu **index** chứ không lưu nhiệt độ, vì cần tính khoảng cách ngày.

### 📘 Bài học buổi tối: Adapter & Decorator (+ middleware)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Adapter**: chuyển interface của một class thành interface mà code của bạn mong đợi | 🔴 T1 | Vẽ được Client → Target interface ← Adapter → Adaptee (SDK bên thứ ba) | `adapter pattern refactoring guru` |
| 2 | Bọc SDK bên thứ ba sau interface của mình | 🔴 T1 | Kể được 3 lợi ích: dễ đổi nhà cung cấp, dễ fake khi test, cô lập thay đổi của SDK | `wrap third party library adapter` |
| 3 | **Decorator**: bọc object bằng một object khác **cùng interface**, thêm hành vi trước/sau khi uỷ quyền | 🔴 T1 | Tự viết được `LoggingRepo(CachingRepo(DbRepo))` | `decorator pattern refactoring guru` |
| 4 | Decorator vs kế thừa để thêm tính năng | 🔴 T1 | Nói được: tránh bùng nổ subclass, ghép lúc chạy, xếp chồng nhiều lớp; thứ tự bọc ảnh hưởng kết quả | `decorator vs inheritance` |
| 5 | Middleware trong web framework: pipeline bọc quanh handler (mô hình "củ hành") | 🔴 T1 | Nói được middleware gần với **Chain of Responsibility** (có thể dừng chuỗi, ví dụ trả 401) và mang tinh thần Decorator (bọc trước/sau handler) | `middleware chain of responsibility`, `onion middleware model` |
| 6 | **Adapter vs Decorator vs Proxy vs Facade** | 🟡 T2 | Điền bảng; câu phân biệt chính: có đổi interface không, mục đích là gì | `adapter vs decorator vs proxy vs facade` |
| 7 | Anti-Corruption Layer (DDD) | 🟢 T3 | Biết đây là "Adapter ở mức hệ thống" | `anti corruption layer` |
| 8 | Decorator của ngôn ngữ (`@decorator` Python, TS decorators) | 🟢 T3 | Biết là cơ chế ngôn ngữ, liên quan nhưng không đồng nhất với pattern | docs ngôn ngữ |

**Chi tiết cần hiểu**

- **Adapter (mục 2):** code nghiệp vụ gọi `SmsProvider.send(phone, text)`. `TwilioAdapter` và `EsmsAdapter` chuyển lời gọi đó sang API riêng của từng SDK (tên method khác, đơn vị khác, mã lỗi khác). Khi SDK nâng version hoặc đổi nhà cung cấp, chỉ adapter phải sửa. Interface `SmsProvider` do **code của bạn** định nghĩa (DIP, Tuần 1).
- **Decorator (mục 3–4):**
  - Muốn thêm log, cache, retry, đo thời gian cho `ShippingFeeCalculator` mà không sửa class gốc.
  - Dùng kế thừa: `LoggingGhnCalculator`, `CachingGhnCalculator`, `LoggingCachingGhnCalculator`... nhân với 3 hãng → bùng nổ.
  - Dùng decorator: mỗi tính năng một class, bọc được quanh **bất kỳ** calculator nào.
  - **Thứ tự quan trọng:** `Logging(Caching(real))` → log cả lần cache hit. `Caching(Logging(real))` → cache hit thì không log.
- **Middleware (mục 5):** request đi qua `auth → rateLimit → logging → handler`. Mỗi middleware làm việc của mình rồi gọi `next()`, hoặc dừng luôn (trả 401). Code chạy sau `next()` là phần "sau" của lớp bọc, giống decorator.

**🟡 Bảng so sánh T2: Adapter vs Decorator vs Proxy vs Facade**

Nhóm: *structural pattern (các kiểu "bọc" object)*. Trục chính: **có đổi interface không** và **mục đích của lớp bọc**.

| Tiêu chí | Adapter | Decorator | Proxy | Facade |
|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | |
| Core: Trade-off chính | | | | |
| Core: Khi nào KHÔNG dùng | | | | |
| Ext: Interface sau khi bọc (đổi / giữ nguyên / đơn giản hoá) | | | | |
| Ext: Xếp chồng nhiều lớp có ý nghĩa không? | | | | |

**🔴 Thẻ Anki (T1)**

1. Adapter giải quyết vấn đề gì? Ai định nghĩa interface mục tiêu?
2. Kể 3 lợi ích của việc bọc SDK bên thứ ba sau interface của mình.
3. Decorator khác kế thừa ở điểm nào khi thêm tính năng?
4. `Logging(Caching(real))` và `Caching(Logging(real))` khác nhau thế nào?
5. Middleware giống pattern nào? Vì sao?
6. *(DSA-Pattern)* "Phần tử lớn hơn gần nhất bên phải" → pattern gì? Vì sao là O(n)?

**Tài liệu:**
- refactoring.guru: *Adapter*, *Decorator* (đọc thêm *Proxy*, *Facade* để điền bảng T2)
- Docs middleware của framework bạn dùng (Express, NestJS, ASP.NET Core, Gin...)

**❓ Câu hỏi cuối bài**

1. Khi tích hợp SDK bên thứ ba, Adapter giúp gì?
2. Thêm logging hoặc cache bằng Decorator khác bằng kế thừa ở điểm nào?
3. Middleware trong web framework giống pattern nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Bạn bọc `Caching(Logging(realCalculator))`. Team vận hành phàn nàn rằng log không phản ánh số lần người dùng thật sự hỏi giá. Vì sao? Đổi thứ tự thì log thay đổi thế nào? Nếu thêm `Retry`, bạn đặt nó bên trong hay bên ngoài `Caching`? Vì sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Adapter chuyển interface của SDK sang interface **do code của bạn định nghĩa** (DIP). Lợi ích: đổi nhà cung cấp chỉ sửa adapter; fake được khi test; cô lập thay đổi version, đơn vị, mã lỗi của SDK.
- **Câu 2:** Decorator giữ nguyên interface, bọc **lúc chạy**, xếp chồng được và bọc được quanh bất kỳ implementation nào. Kế thừa gắn cố định lúc biên dịch và gây bùng nổ subclass (Logging × Caching × số hãng). Thứ tự bọc ảnh hưởng kết quả.
- **Câu 3:** Chain of Responsibility (mỗi middleware xử lý rồi gọi `next()` hoặc dừng chuỗi, ví dụ trả 401) + tinh thần Decorator (code trước/sau `next()` bọc quanh handler, mô hình củ hành).
- **Câu 4:** `Caching` ở ngoài: cache hit thì trả luôn, không đi tới `Logging` → chỉ log các lần cache miss. Đổi thành `Logging(Caching(real))` thì log mọi lần gọi. `Retry` đặt **bên trong** `Caching` (sát lời gọi thật), để chỉ retry khi thực sự gọi ra ngoài và không lưu kết quả lỗi vào cache.

</details>

---

## D18 (T5, 15/10): Repository & Unit of Work

**⏱ Ước tính:** Giờ làm 39' (DSA 25' + Anki 14') · Tối 80' (Học 40' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 18') · **Tổng 1h59'**

### 🧩 DSA: [704. Binary Search](https://leetcode.com/problems/binary-search/)

- **Pattern (🔴 T1):** *Binary Search trên mảng đã sort*. Mỗi bước loại một nửa → O(log n).
- **Khung chuẩn (tự viết lại được, không xem):** `l = 0, r = n − 1; while l <= r: mid = l + (r − l) / 2; ...`.
- **Điều cần hiểu, không chỉ thuộc:**
  - **Bất biến (invariant):** nếu target tồn tại thì nó luôn nằm trong `[l, r]`. Mọi thao tác `l = mid + 1` / `r = mid − 1` phải giữ bất biến này.
  - `l <= r` đi với `r = n − 1` (đoạn đóng). Có một biến thể khác là `l < r` đi với `r = n` (nửa mở). Chọn **một** khung và dùng mãi.
  - `mid = l + (r − l) / 2` tránh tràn số ở ngôn ngữ có số nguyên cố định (Java, C++, Go) — 🟢 T3.
- **Biến thể nên biết:** tìm vị trí đầu tiên `≥ target` (lower bound). Sẽ dùng cho bài 875 và 33.

### 📘 Bài học buổi tối: Repository & Unit of Work

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Repository** (Fowler, PoEAA): interface giống một "collection" các đối tượng domain, giấu chi tiết truy vấn DB | 🔴 T1 | Viết được interface `OrderRepository` với method đặt tên theo nghiệp vụ | `repository pattern martin fowler` |
| 2 | Interface repository thuộc tầng nghiệp vụ, implementation thuộc tầng hạ tầng (DIP) | 🔴 T1 | Vẽ được mũi tên phụ thuộc | `repository pattern dependency inversion` |
| 3 | Sai lầm hay gặp với Repository | 🔴 T1 | Kể được 3 sai lầm (xem chi tiết) | `generic repository anti pattern`, `leaky repository abstraction` |
| 4 | **Unit of Work**: theo dõi các thay đổi trong một nghiệp vụ, ghi tất cả xuống DB trong một lần, hoặc không ghi gì | 🔴 T1 | Giải thích được với ví dụ "đặt đơn = tạo order + trừ tồn kho + ghi lịch sử" | `unit of work pattern martin fowler` |
| 5 | UoW có sẵn trong ORM (Hibernate/JPA persistence context, EF Core `DbContext`, SQLAlchemy `Session`, TypeORM `EntityManager` trong transaction) | 🔴 T1 | Biết ORM của bạn: object nào là UoW, commit ở đâu | `<tên ORM> unit of work`, `<tên ORM> transaction` |
| 6 | **Active Record vs Repository (Data Mapper)** | 🟡 T2 | Điền bảng; biết ORM của bạn thuộc kiểu nào (Django ORM, Rails, Eloquent là Active Record) | `active record vs data mapper` |
| 7 | API chi tiết của session/transaction trong ORM | 🟢 T3 | Tra docs khi viết code | docs ORM |

**Chi tiết cần hiểu**

- **Repository tách business logic khỏi DB thế nào:** service gọi `orderRepo.findPendingOlderThan(30 phút)`. Service không biết đó là SQL, Mongo hay gọi API. Khi test, thay bằng `InMemoryOrderRepository` chứa một list.
- **Sai lầm hay gặp (mục 3):**
  - Repository chỉ là lớp bọc mỏng quanh ORM với `getAll/getById/save` chung chung cho mọi bảng (*generic repository*), không thêm giá trị nào.
  - **Rò rỉ abstraction:** trả về query builder hoặc đối tượng đặc thù ORM (`IQueryable`, `QuerySet`) để service tự nối thêm điều kiện → service lại phụ thuộc vào ORM.
  - Đặt business rule vào repository (ví dụ tính giảm giá trong `save`).
- **Unit of Work (mục 4):** đặt đơn cần ghi vào `orders`, `order_items`, `inventory`, `order_history`. Nếu mỗi repository tự commit, lỗi ở bước 3 để lại dữ liệu nửa vời. UoW gom mọi thay đổi và commit **một lần** trong một transaction. Vì vậy các repository trong cùng một nghiệp vụ phải dùng **chung một** UoW/session. Đây là lý do DB session có lifetime *scoped* (Tuần 2, D12).
- **Ranh giới transaction nằm ở tầng service (use-case)**, không nằm ở repository và không nằm ở controller. Sẽ gặp lại ở D19 và Tuần 7.

**🟡 Bảng so sánh T2: Active Record vs Repository (Data Mapper)**

Nhóm: *data access pattern*. Trục chính: **đơn giản, nhanh làm** vs **tách biệt domain khỏi persistence**.

| Tiêu chí | Active Record | Repository + Data Mapper |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Object domain có biết về DB không? | | |
| Ext: Unit test business logic không cần DB được không? | | |
| Ext: Ví dụ ORM thuộc kiểu này | | |

**🔴 Thẻ Anki (T1)**

1. Repository là gì? Interface của nó nên đặt ở tầng nào? Vì sao?
2. Kể 3 sai lầm hay gặp khi dùng Repository.
3. Unit of Work giải quyết vấn đề gì? Cho ví dụ.
4. Vì sao các repository trong cùng một nghiệp vụ phải dùng chung một session/UoW?
5. Ranh giới transaction nên nằm ở tầng nào?
6. *(DSA-Pattern)* Bất biến của binary search là gì?

**Tài liệu:**
- martinfowler.com/eaaCatalog: *Repository*, *Unit of Work*, *Active Record*, *Data Mapper* (mỗi trang rất ngắn)
- Docs ORM bạn dùng: mục *Session* / *Transactions*

**❓ Câu hỏi cuối bài**

1. Repository tách business logic khỏi DB như thế nào?
2. Unit of Work giải quyết vấn đề gì khi một nghiệp vụ ghi vào nhiều repository?
3. ORM bạn đang dùng đã có sẵn UoW chưa (session, transaction)?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Đồng nghiệp viết `OrderRepository.findAll()` trả về `QuerySet`/`IQueryable` để service tự `.filter()`, và mỗi repository tự gọi `commit()` trong `save()`. Chỉ ra 2 vấn đề. Khi đặt đơn bị lỗi ở bước trừ tồn kho, dữ liệu trong DB sẽ ở trạng thái nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Service gọi method mang tên nghiệp vụ (`findPendingOlderThan`) trên **interface** do tầng nghiệp vụ sở hữu. Implementation SQL/Mongo nằm ở hạ tầng (DIP). Service không biết truy vấn thế nào; khi test thay bằng `InMemoryRepository`.
- **Câu 2:** Một nghiệp vụ ghi vào nhiều bảng/repository phải thành công hết hoặc không ghi gì. UoW theo dõi các thay đổi và commit **một lần** trong một transaction. Vì vậy các repository phải dùng chung một session/UoW (lifetime scoped).
- **Câu 3:** Chỉ ra object đóng vai UoW trong ORM của bạn (`Session`, `DbContext`, persistence context, `EntityManager`...), commit/transaction mở ở đâu trong code hiện tại, và đó có phải tầng service không.
- **Câu 4:** (1) Rò rỉ abstraction: service phụ thuộc vào API của ORM, không fake được, query rải rác khắp service. (2) Commit riêng lẻ phá ranh giới transaction. Khi lỗi ở bước trừ tồn kho: order và order_items đã được commit, tồn kho chưa trừ → dữ liệu nửa vời. Sửa: repository không commit; service mở transaction/UoW và commit một lần.

</details>

---

## D19 (T6, 16/10): Kiến trúc phân lớp + CQRS cơ bản

**⏱ Ước tính:** Giờ làm 54' (DSA 40' + Anki 14') · Tối 87' (Học 45' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 2h21'**

> ⚖️ **Cân tải:** nếu điền cả hai bảng T2, tối nay sẽ khoảng 100', vượt trần 90'. Vì vậy **bảng *Layered vs Hexagonal / Clean* chuyển thành (tuỳ chọn)**, điền khi còn giờ ở tuần 4 hoặc tuần 12. Tối nay chỉ đọc mục 5 ở mức "Hexagonal là DIP áp dụng cho cả kiến trúc" (≈ 5') và điền bảng *CQRS vs một model chung*.

### 🧩 DSA: [74. Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)

- **Pattern (🔴 T1):** *Binary Search trên không gian index ảo*. Ma trận m × n thoả điều kiện "mỗi hàng đã sort, phần tử đầu hàng sau > phần tử cuối hàng trước", nên có thể coi là một mảng 1 chiều đã sort có `m · n` phần tử.
- **Các cách:**
  1. Duyệt hết → O(m · n).
  2. Binary search chọn hàng, rồi binary search trong hàng → O(log m + log n).
  3. Binary search một lần trên index `0 .. m·n − 1`, đổi index về toạ độ: `row = idx / n`, `col = idx % n` → O(log(m · n)), bằng cách 2.
- **Lưu ý:** đừng nhầm với bài 240 *Search a 2D Matrix II* (chỉ sort theo hàng và theo cột, không nối tiếp nhau). Bài đó dùng cách "đi bậc thang" từ góc trên phải, O(m + n).

### 📘 Bài học buổi tối: Kiến trúc phân lớp (Controller – Service – Repository) + CQRS cơ bản

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Trách nhiệm của từng lớp: Controller / Service / Repository | 🔴 T1 | Liệt kê được việc **của** và việc **không phải của** từng lớp (xem bảng) | `controller service repository layers responsibilities` |
| 2 | Quy tắc phụ thuộc: chỉ gọi xuống lớp dưới, không gọi ngược, không nhảy lớp | 🔴 T1 | Giải thích được vì sao controller không nên gọi thẳng repository | `layered architecture dependency rule` |
| 3 | Vì sao business logic không nằm trong controller | 🔴 T1 | Nêu được ≥ 3 lý do (xem chi tiết) | `fat controller anti pattern`, `thin controller` |
| 4 | DTO vs entity: không trả thẳng entity ra API | 🔴 T1 | Nêu được 2 rủi ro: lộ field nhạy cảm (`password_hash`), API bị gắn chặt vào schema DB | `dto vs entity api` |
| 5 | **Layered vs Hexagonal (Ports & Adapters) / Clean Architecture** | 🟡 T2 | Điền bảng ở mức khái niệm, biết Hexagonal là "DIP áp dụng cho cả kiến trúc" | `layered vs hexagonal architecture` |
| 6 | **CQS** (Bertrand Meyer, mức method) vs **CQRS** (mức model/kiến trúc) | 🔴 T1 | Phân biệt được bằng một câu | `CQS vs CQRS` |
| 7 | **CQRS cơ bản**: tách model ghi (command, kiểm tra invariant) và model đọc (query, trả DTO tối ưu cho màn hình) | 🔴 T1 | Mô tả được 3 mức độ (xem chi tiết) | `CQRS pattern martin fowler`, `CQRS explained` |
| 8 | **CQRS vs một model chung (CRUD)** | 🟡 T2 | Điền bảng; nói được khi nào CQRS là over-engineering | `when not to use CQRS` |
| 9 | Event Sourcing | 🟢 T3 | Biết hay đi cùng CQRS nhưng **không bắt buộc**. Để dành sau 100 ngày | `event sourcing vs CQRS` |

**Chi tiết cần hiểu**

- **Trách nhiệm từng lớp (mục 1):**

  | Lớp | Làm | Không làm |
  |---|---|---|
  | Controller | Nhận HTTP, parse/validate *định dạng* input, lấy user từ context xác thực, gọi service, chọn status code, map sang response DTO | Business rule, SQL, mở transaction |
  | Service (use-case) | Business rule, điều phối nhiều repository, **ranh giới transaction**, gọi dịch vụ ngoài qua interface | Biết HTTP (request/response object, status code), viết SQL |
  | Repository | Đọc/ghi dữ liệu, map giữa row và object | Business rule, commit riêng lẻ khi đang ở trong một use-case |

- **Vì sao không để business logic trong controller (mục 3):**
  - **Tái sử dụng:** cùng nghiệp vụ "huỷ đơn" được gọi từ HTTP API, từ consumer đọc queue, từ cron job. Nếu nằm trong controller thì phải copy.
  - **Test:** test service không cần dựng HTTP server.
  - **SRP:** controller thay đổi khi *giao thức* thay đổi; service thay đổi khi *nghiệp vụ* thay đổi. Đây là hai "actor" khác nhau.
- **CQRS có 3 mức độ (mục 7):**
  1. Cùng DB, **tách code**: command handler dùng domain model + repository; query handler viết SQL trả thẳng DTO, không cần load entity.
  2. Model đọc chạy trên **read replica** hoặc bảng/view phi chuẩn hoá riêng.
  3. Model đọc là **projection riêng**, cập nhật bất đồng bộ qua event → chấp nhận *eventual consistency* (đọc có thể trễ vài giây so với ghi).
  - Lợi ích: tối ưu đọc và ghi độc lập, model ghi gọn hơn vì không phải phục vụ mọi màn hình, scale phần đọc riêng.
  - Mức 1 gần như luôn hợp lý và rẻ. Mức 3 mới là thứ người ta hay cảnh báo "over-engineering".
- **Khi nào CQRS là thừa:** CRUD đơn giản, đọc và ghi gần như cùng hình dạng dữ liệu, team nhỏ, hoặc nghiệp vụ không chấp nhận đọc dữ liệu cũ ngay sau khi ghi.

**🟡 Bảng so sánh T2: Layered vs Hexagonal / Clean** *(tuỳ chọn, xem phần ⚖️ Cân tải ở đầu ngày)*

Nhóm: *kiến trúc ứng dụng*. Trục chính: **đơn giản, quen thuộc** vs **cô lập domain khỏi hạ tầng**.

| Tiêu chí | Layered (Controller – Service – Repository) | Hexagonal / Clean |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Hướng phụ thuộc (domain phụ thuộc DB hay ngược lại?) | | |
| Ext: Chi phí khởi đầu (số file/interface) | | |

**🟡 Bảng so sánh T2: CQRS vs một model chung (CRUD)**

Nhóm: *kiến trúc truy cập dữ liệu*. Trục chính: **tối ưu riêng đọc/ghi** vs **độ phức tạp và tính nhất quán**.

| Tiêu chí | Một model chung | CQRS |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Consistency giữa đọc và ghi | | |
| Ext: Scale đọc độc lập với ghi | | |

**🔴 Thẻ Anki (T1)**

1. Controller, Service, Repository mỗi lớp làm gì và **không** làm gì?
2. Nêu 3 lý do business logic không nên nằm trong controller.
3. Vì sao không trả thẳng entity ra API?
4. CQS khác CQRS thế nào?
5. Kể 3 mức độ áp dụng CQRS. Mức nào sinh ra eventual consistency?
6. Khi nào CQRS là over-engineering?

**Tài liệu:**
- roadmap.sh/backend (phần *Architectural Patterns*)
- martinfowler.com/bliki: *CQRS*
- Tìm đọc về *Hexagonal Architecture (Alistair Cockburn)* ở mức tổng quan, 15'

**❓ Câu hỏi cuối bài**

1. Business logic nên nằm ở lớp nào? Vì sao không để trong controller?
2. CQRS cơ bản: tách luồng đọc và ghi thì được lợi gì?
3. Khi nào dùng CQRS là thừa (over-engineering)?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. API `GET /users/{id}` đang trả thẳng entity `User` (ORM model). Nêu 2 rủi ro. Kể một tình huống đổi schema DB (tách bảng, đổi tên cột) làm vỡ client mobile.
5. Bạn áp dụng CQRS mức 3: model đọc là projection cập nhật qua event. User vừa đổi địa chỉ giao hàng xong, reload trang thì vẫn thấy địa chỉ cũ. Vì sao? Nêu 2 cách giảm ảnh hưởng cho user.

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Ở tầng service (use-case). Lý do không để trong controller: tái sử dụng từ HTTP/queue consumer/cron; test không cần HTTP server; SRP (controller đổi theo giao thức, service đổi theo nghiệp vụ); service là ranh giới transaction.
- **Câu 2:** Tối ưu đọc và ghi độc lập (query trả thẳng DTO, không load entity); model ghi gọn, tập trung vào invariant; scale phần đọc riêng (replica/projection). Nói được 3 mức và mức 1 (chỉ tách code) rất rẻ.
- **Câu 3:** CRUD đơn giản, dữ liệu đọc và ghi gần như cùng hình dạng, team nhỏ, hoặc nghiệp vụ không chấp nhận đọc dữ liệu cũ. Nói rõ: thứ hay bị gọi là over-engineering là mức 3 (projection + eventual consistency).
- **Câu 4:** Lộ field nhạy cảm (`password_hash`, field nội bộ); API gắn chặt vào schema DB, đổi tên cột/tách bảng là client vỡ; có thể dính lazy-loading/N+1 khi serialize. Sửa: map sang response DTO ở controller.
- **Câu 5:** Eventual consistency: projection chưa kịp nhận event. Cách giảm: đọc từ model ghi ngay sau khi chính user đó vừa ghi (read-your-writes); trả dữ liệu mới trong response của lệnh ghi và cập nhật UI tại chỗ; hoặc hiển thị trạng thái "đang cập nhật".

</details>

---

## D20 (T7, 17/10): Lab

**⏱ Ước tính:** DSA 45' · Lab 3h05' · Ôn ⚠️ 10' · **Tổng 4h00'**

> ⚖️ **Cân tải:** lab đã rút xuống 3h05' (Bước 3 còn 35', Bước 6 còn 25', Bước 7 còn 25') để cả ngày nằm trong 4h. Ôn ⚠️ hôm nay chỉ 10'. Bảng **Layered vs Hexagonal / Clean** chuyển thành **(tuỳ chọn)**, điền khi còn giờ ở tuần 4 hoặc tuần 12 (khi học microservices). Phỏng vấn Mid hiếm khi hỏi sâu phần này.

### 🧩 DSA: [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)

- **Pattern (🔴 T1):** *Binary Search trên không gian đáp án*. Không tìm trong mảng, mà tìm **giá trị nhỏ nhất của k** thoả điều kiện. Dấu hiệu: "tìm giá trị nhỏ nhất/lớn nhất sao cho ...", và hàm kiểm tra `feasible(k)` **đơn điệu** (k đủ thì mọi k lớn hơn cũng đủ).
- **Cách giải:**
  - Không gian đáp án: `k ∈ [1, max(piles)]`.
  - `feasible(k)`: tổng `ceil(p / k)` trên mọi đống `≤ h`.
  - Binary search tìm k nhỏ nhất mà `feasible(k)` đúng → O(n · log(max(piles))).
- **Lỗi hay gặp:**
  - `ceil` bằng số thực dễ sai; dùng `(p + k − 1) / k` với số nguyên.
  - Chọn cận trên sai (ví dụ `sum(piles)` vẫn đúng nhưng chậm hơn; `max(piles)` là đủ vì khi đó mỗi đống mất đúng 1 giờ).
- Sau đó làm lại 1 bài sai trong tuần (nếu có).

### 🛠 Lab (3h05'): module tính phí ship nhiều hãng bằng Strategy + Adapter + Decorator

> Các công thức tính phí dưới đây là **giả định để luyện thiết kế**, không phải bảng giá thật của các hãng.

**Bước 1: Chuẩn bị (15')**
- Tạo `project/shipping/`. Nhập thẻ Anki D15–D19.

**Bước 2: Model và interface (20')**
- `Parcel`: `weightGrams`, `lengthCm`, `widthCm`, `heightCm`, `fromProvince`, `toProvince`, `codAmount`.
- `Quote`: `carrier`, `fee` (số nguyên, đơn vị VND), `estimatedDays`.
- Interface `ShippingFeeStrategy.quote(parcel) → Quote`.

**Bước 3: 3 Strategy (35')**. Công thức giả định, mỗi hãng khác nhau một chút:
- Khối lượng tính phí = `max(cân nặng thật, D × R × C / 6000 kg)`.
- `GhnStrategy`: phí cơ bản cho 500g đầu + phí mỗi 500g tiếp theo; khác tỉnh cộng phụ phí.
- `GhtkStrategy`: bảng bậc theo khối lượng; COD > 0 thì cộng phí thu hộ theo %.
- `ViettelPostStrategy`: **gọi qua Adapter** (bước 4).

**Bước 4: Adapter (25')**
- Viết một "SDK giả" `FakeViettelPostClient` có interface **khác hẳn**: ví dụ `getPrice(request)` nhận khối lượng theo **kg** (số thực), trả `{ total_vnd, service_code, days }`, và ném lỗi riêng của SDK.
- `ViettelPostAdapter` implement `ShippingFeeStrategy`: đổi gram → kg, map kết quả sang `Quote`, đổi lỗi SDK thành lỗi của hệ thống bạn (`CarrierUnavailable`).

**Bước 5: Chọn strategy + so sánh giá (20')**
- Registry `carrier → strategy` ở composition root.
- `ShippingService.quote(carrier, parcel)` và `ShippingService.cheapest(parcel)`: hỏi mọi hãng, bỏ qua hãng lỗi, trả hãng rẻ nhất.

**Bước 6: Decorator (25')**
- `LoggingFeeStrategy`: log input, output, thời gian chạy.
- `CachingFeeStrategy`: cache trong bộ nhớ theo key từ các field của `Parcel`, có TTL.
- Bọc: `Logging(Caching(GhnStrategy))`. Ghi vào notes: đổi thứ tự bọc thì log khác gì.

**Bước 7: Unit test (25')**. Tối thiểu 6 test:
1. Mỗi strategy tính đúng một ca có sẵn (tự tính tay trước).
2. Khối lượng quy đổi lớn hơn cân nặng thật → dùng khối lượng quy đổi.
3. Adapter đổi đúng đơn vị và map đúng lỗi.
4. `cheapest()` bỏ qua hãng đang lỗi.
5. `CachingFeeStrategy`: gọi 2 lần cùng input → strategy bên trong chỉ bị gọi **1 lần** (dùng spy).
6. Thêm hãng thứ 4 (`JntStrategy`) mà **không sửa** `ShippingService`; test vẫn xanh.

**Bước 8: Ghi chú (20')**
- Viết `notes/patterns-in-practice.md`: với mỗi pattern (Strategy, Adapter, Decorator, Factory/registry), ghi 3 dòng **Vấn đề → Pattern → Kết quả**. Thêm một đoạn liên hệ với code thật ở công ty (nếu có). File này là nguyên liệu cho câu 5 của Chốt tuần.

**Deliverable:** `project/shipping/` có test chạy xanh + `notes/patterns-in-practice.md`.

---

## D21 (CN, 18/10): Chốt tuần 3

**⏱ Ước tính:** DSA 50' · Làm lại 739, 875 40' · Chốt tuần 60' · Anki/cheat sheet 30' · **Tổng 3h00'**

### 🧩 DSA: [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

- **Pattern (🔴 T1):** *Binary Search với "một nửa luôn đã sort"*. Ở mỗi bước, ít nhất một trong hai nửa `[l, mid]` hoặc `[mid, r]` là đoạn tăng dần.
- **Cách giải:**
  - Nếu `nums[l] <= nums[mid]`: nửa trái đã sort. Target nằm trong `[nums[l], nums[mid])` thì đi trái, ngược lại đi phải.
  - Ngược lại: nửa phải đã sort, xét tương tự với `(nums[mid], nums[r]]`.
  - → O(log n).
- **Lỗi hay gặp:** dùng `<` thay vì `<=` ở `nums[l] <= nums[mid]`, sai khi `l == mid` (đoạn còn 2 phần tử).
- **Cách khác:** tìm điểm xoay (phần tử nhỏ nhất, bài 153) trước, rồi binary search trên nửa phù hợp. Cũng O(log n) nhưng hai lần tìm.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Kể 7 pattern đã học, mỗi pattern một câu "nó giải quyết vấn đề gì".
   - *7 pattern: Singleton, Factory Method, Builder, Strategy, Observer, Adapter, Decorator (Repository/UoW là pattern của Fowler, kể thêm nếu muốn).*
2. Monotonic stack dùng cho dạng bài nào?
3. "Binary search trên không gian đáp án" (bài Koko) là gì? Khi nào nghĩ tới nó?
4. Vẽ luồng một request từ controller xuống DB trong project thật, gắn tên pattern nếu có.
5. Người phỏng vấn hỏi: *"Bạn đã dùng design pattern nào trong dự án thật?"* Trả lời trong 2 phút.
   - *Gợi ý cấu trúc: bối cảnh (1 câu) → vấn đề (code cũ khó mở rộng/khó test thế nào) → pattern đã dùng → kết quả đo được (thêm hãng mới mất bao lâu, số test tăng...).*

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Singleton: một instance + truy cập toàn cục (nên để DI container quản). Factory Method: tách việc tạo object khỏi code dùng. Builder: lắp object phức tạp từng bước, validate trong `build()`. Strategy: hoán đổi thuật toán thay cho `if/else` theo loại. Observer: thông báo nhiều bên mà subject không phụ thuộc vào họ. Adapter: khớp interface của SDK ngoài với interface của mình. Decorator: thêm hành vi (log, cache, retry) mà không sửa class gốc.
- **Câu 2:** "Phần tử lớn hơn/nhỏ hơn gần nhất bên trái/phải" (Daily Temperatures, next greater element, stock span, histogram). Stack giữ index theo thứ tự đơn điệu. O(n) vì mỗi index được push một lần và pop tối đa một lần.
- **Câu 3:** Tìm giá trị nhỏ nhất/lớn nhất trong một **khoảng đáp án** `[lo, hi]` sao cho `feasible(x)` đúng, với `feasible` **đơn điệu**. Độ phức tạp O(chi phí kiểm tra × log(khoảng)). Dấu hiệu: "tốc độ/sức chứa/thời gian nhỏ nhất để...".
- **Câu 4:** Middleware (CoR/Decorator: auth, log) → controller (validate định dạng, DTO) → service (business rule, transaction/UoW, strategy/factory) → repository (interface, ORM session) → DB → map entity sang response DTO. Có chỉ ra ranh giới transaction.
- **Câu 5:** Theo cấu trúc bối cảnh → vấn đề → pattern → kết quả có số liệu. Nói được trade-off hoặc điều sẽ làm khác nếu làm lại. Ví dụ phải có thật (dùng lab nếu project thật không có), không kể thuộc lòng định nghĩa.

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] Module `project/shipping/` có test chạy xanh + `notes/patterns-in-practice.md`
- [ ] Tự giải lại 739, 875, 33 không xem lời giải (mỗi bài ≤ 25')
- [ ] Anki: đã nhập đủ thẻ T1 của D15–D19 + thẻ pattern Stack / Monotonic Stack / Binary Search (index và không gian đáp án)
- [ ] Cheat sheet: đã điền các bảng Observer vs Pub/Sub, Adapter vs Decorator vs Proxy vs Facade, Active Record vs Repository, Layered vs Hexagonal, CQRS vs một model chung
- [ ] Error List: đã làm lại các bài đến hạn (bài sai từ Tuần 2)

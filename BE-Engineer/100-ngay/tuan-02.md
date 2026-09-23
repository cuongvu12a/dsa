# Tuần 2 (05/10 – 11/10): Two Pointers, Sliding Window, Coupling/Cohesion, Creational Patterns

[← Tuần 1](tuan-01.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 3 →](tuan-03.md)

**Mục tiêu tuần:** Nhận ra dạng bài Two Pointers và Sliding Window từ đề bài. Hiểu Singleton, Factory, Builder và DI. Đánh giá được một thiết kế theo hai tiêu chí coupling và cohesion.

> Cách học theo Tier (T1 → Anki, T2 → bảng so sánh, T3 → chỉ tra cứu): xem lại bảng [Cách học theo Tier ở Tuần 1](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Học đến đâu thì dừng theo cột *Cần nắm tới mức nào*.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Coupling & Cohesion, Law of Demeter, vì sao global/Singleton làm tăng coupling, 3 nhóm Design Pattern, ý đồ (intent) của Singleton / Factory Method / Builder, race condition khi khởi tạo lazy, DI và vòng đời (singleton / scoped / transient) trong IoC container, các pattern DSA: Two Pointers (hai đầu), Sliding Window (cố định / thay đổi) | HashMap vs Two Pointers (Two Sum), Singleton pattern vs singleton scope của DI container, Simple Factory vs Factory Method vs Abstract Factory, Factory vs Builder, Builder vs named params / options object, Constructor vs Setter injection | Bảng phân loại đầy đủ các kiểu coupling/cohesion, metric Ca/Ce, cú pháp double-checked locking / `volatile`, annotation DI của framework (`@Autowired`, `@Injectable`, `AddScoped`...), Lombok `@Builder`, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D8 (T2) | 37' | 70' | 1h47' |
| D9 (T3) | 67' | 82' | 2h29' |
| D10 (T4) | 67' | 83' | 2h30' |
| D11 (T5) | 57' | 88' | 2h25' |
| D12 (T6) | 37' | 87' | 2h04' |
| D13 (T7) | — | 4h00' | 4h00' |
| D14 (CN) | — | 3h00' | 3h00' |

**Tổng tuần: 18h15'** (chưa tính 1h tiếng Anh mỗi ngày)

Ngày nặng nhất là D13 (4h00'), vì lab đã được rút xuống 3h05' để nằm trong khung 4h. Trong tuần, D9 là buổi tối duy nhất sẽ vượt 90' nếu điền cả hai bảng T2, nên bảng HashMap vs Two Pointers được dời lên giờ làm, ngay sau khi giải bài 167.

---

## D8 (T2, 05/10): Coupling & Cohesion

**⏱ Ước tính:** Giờ làm 37' (DSA 25' + Anki 12') · Tối 70' (Học 40' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 1h47'**

### 🧩 DSA: [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

- **Pattern (🔴 T1):** *Two Pointers từ hai đầu*. Một con trỏ ở đầu, một ở cuối, cùng tiến vào giữa. Dấu hiệu: cần so sánh đối xứng, hoặc mảng/chuỗi đã sort và cần tìm cặp.
- **Các cách:**
  1. Lọc chuỗi (chỉ giữ chữ và số, về chữ thường) rồi so với chuỗi đảo ngược → O(n) thời gian, O(n) bộ nhớ.
  2. Two Pointers trên chuỗi gốc, bỏ qua ký tự không phải chữ/số ngay trong lúc duyệt → O(n) thời gian, O(1) bộ nhớ.
- **Lỗi hay gặp:** vòng `while` bên trong dùng để bỏ qua ký tự rác phải kiểm tra lại `l < r`, nếu không sẽ chạy vượt biên với chuỗi toàn dấu câu như `".,"`.

### 📘 Bài học buổi tối: Coupling & Cohesion

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Coupling**: mức độ một module phụ thuộc vào module khác | 🔴 T1 | Định nghĩa bằng một câu, nêu được hậu quả: sửa A kéo theo sửa B | `coupling in software engineering` |
| 2 | **Cohesion**: mức độ các phần bên trong một module cùng phục vụ một mục đích | 🔴 T1 | Phân biệt được class "cùng lý do tồn tại" với class kiểu `Utils` gom đủ thứ | `cohesion in software engineering` |
| 3 | "High cohesion, low coupling" và liên hệ với SOLID | 🔴 T1 | Nói được SRP phục vụ cohesion, DIP/ISP phục vụ giảm coupling | `high cohesion low coupling SOLID` |
| 4 | Dấu hiệu coupling chặt (code smell) | 🔴 T1 | Kể được ≥ 3 dấu hiệu, mỗi dấu hiệu một ví dụ (xem chi tiết) | `shotgun surgery code smell`, `feature envy`, `inappropriate intimacy` |
| 5 | **Law of Demeter** ("chỉ nói chuyện với bạn trực tiếp") | 🔴 T1 | Nhận ra chuỗi `a.getB().getC().doX()` và sửa được | `law of demeter example` |
| 6 | Vì sao biến global / Singleton làm tăng coupling | 🔴 T1 | Giải thích được "phụ thuộc ẩn" và "state dùng chung" (xem chi tiết) | `global state hidden dependency`, `singleton hidden coupling` |
| 7 | Bảng phân loại coupling (content, common, control, stamp, data) và cohesion (coincidental → functional) | 🟢 T3 | Chỉ cần nhớ hai đầu mút: *data coupling* tốt nhất, *content/common* tệ nhất; *functional cohesion* tốt nhất, *coincidental* tệ nhất | `types of coupling and cohesion` |
| 8 | Metric afferent/efferent coupling (Ca/Ce), connascence | 🟢 T3 | Biết tên là đủ | `afferent efferent coupling`, `connascence` |

**Chi tiết cần hiểu**

- **Coupling không thể bằng 0.** Mục tiêu là phụ thuộc vào thứ **ổn định** (interface, kiểu dữ liệu đơn giản) thay vì thứ **hay đổi** (class cụ thể, chi tiết bên trong của module khác).
- **Dấu hiệu coupling chặt (mục 4):**
  - *Shotgun surgery:* sửa một yêu cầu nhỏ phải đụng vào 5–6 file ở nhiều module.
  - Muốn unit test một class thì phải dựng DB thật, gọi API thật, vì class tự `new` các dependency bên trong.
  - Class A biết cấu trúc bên trong của B (đọc thẳng field, gọi method nội bộ). Refactoring.guru gọi là *Inappropriate Intimacy*.
  - *Flag argument* điều khiển luồng của hàm khác: `process(order, isAdmin=True, skipEmail=False)` là *control coupling*.
  - Phụ thuộc vòng: module A import B, B lại import A.
  - Truyền nguyên object lớn trong khi chỉ cần 1–2 field (*stamp coupling*).
- **Global / Singleton làm tăng coupling (mục 6):**
  - **Phụ thuộc ẩn:** chữ ký hàm `placeOrder(items)` không cho thấy nó dùng `Config.getInstance()` hay `Db.global`. Đọc chữ ký không biết hàm phụ thuộc vào gì.
  - **State dùng chung có thể bị sửa:** mọi nơi dùng chung một biến, một nơi đổi thì các nơi khác bị ảnh hưởng. Test chạy riêng thì xanh, chạy chung thì đỏ vì phụ thuộc thứ tự.
  - **Khó thay thế khi test:** không truyền fake vào được, vì code tự lấy instance toàn cục.
- **Cohesion thấp trông như thế nào:** `OrderUtils` chứa `formatPrice`, `sendEmail`, `validatePhone`. Ba hàm không liên quan, chỉ ở chung vì "không biết để đâu".
- **Law of Demeter (mục 5):** `order.getCustomer().getAddress().getCity()` khiến code gọi phụ thuộc vào cấu trúc của cả ba class. Nên hỏi thẳng `order.shippingCity()`. Đây cũng là tinh thần *Tell, Don't Ask* ở Tuần 1.

**🔴 Thẻ Anki (T1)**

1. Coupling và cohesion là gì? Vì sao muốn cohesion cao, coupling thấp?
2. SRP liên quan đến cohesion thế nào? DIP liên quan đến coupling thế nào?
3. Kể 3 dấu hiệu code đang bị coupling chặt.
4. Law of Demeter là gì? Cho ví dụ vi phạm và cách sửa.
5. Vì sao Singleton / biến global tạo ra "phụ thuộc ẩn"?

**🟢 Tra cứu (T3):** mục *Code Smells* trên refactoring.guru (nhóm *Couplers*: Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man).

**Tài liệu:**
- roadmap.sh/backend (phần *Design and Development Principles*)
- refactoring.guru: *Refactoring → Code Smells → Couplers*
- Tìm đọc một bài "coupling and cohesion explained" bất kỳ, chỉ cần 15'

**❓ Câu hỏi cuối bài**

1. "High cohesion, low coupling" nghĩa là gì, nói bằng lời của bạn?
2. Kể 3 dấu hiệu cho thấy code đang bị coupling chặt.
3. Biến global và Singleton làm tăng coupling như thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. `InvoicePrinter` có dòng `invoice.getOrder().getCustomer().getAddress().getCity()`. Team đổi `Address` thành danh sách nhiều địa chỉ giao hàng. Những class nào phải sửa? Vì sao? Bạn sửa dòng này thế nào? Còn `query.where(...).orderBy(...).limit(10)` có vi phạm Law of Demeter không?
5. Bạn tách `OrderUtils` (chứa `formatPrice`, `sendEmail`, `validatePhone`) thành 3 class riêng. Cohesion và coupling thay đổi ra sao? Việc này ứng với nguyên lý SOLID nào? Nếu sau khi tách, `OrderService` phải `new` cả 3 class cụ thể thì bạn cải thiện tiếp thế nào?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Cohesion cao: mọi thứ trong module phục vụ một mục đích, cùng lý do thay đổi. Coupling thấp: module phụ thuộc ít, và phụ thuộc vào thứ ổn định (interface). Hệ quả: sửa một chỗ không lan ra nhiều chỗ, test riêng được.
- **Câu 2:** Chọn 3 trong số: shotgun surgery; phải dựng DB/API thật để unit test vì class tự `new`; biết nội bộ class khác (inappropriate intimacy); flag argument (control coupling); phụ thuộc vòng; truyền cả object lớn khi chỉ cần 1–2 field. Mỗi dấu hiệu kèm ví dụ.
- **Câu 3:** Phụ thuộc ẩn (chữ ký hàm không cho thấy); state dùng chung bị sửa ở nơi khác → test phụ thuộc thứ tự; không thay bằng fake được khi test.
- **Câu 4:** Vi phạm Law of Demeter: `InvoicePrinter` phụ thuộc cấu trúc của Order, Customer, Address → đổi Address thì nó cũng phải sửa. Sửa: hỏi thẳng `invoice.shippingCity()`, để `Order` tự lấy. Fluent builder/query không vi phạm vì mỗi lời gọi trả về **cùng một** object (hoặc cùng kiểu), không đi sâu vào cấu trúc object khác.
- **Câu 5:** Cohesion mỗi class tăng (SRP). Coupling không tự giảm: nếu `OrderService` `new` class cụ thể thì vẫn coupling chặt. Cải thiện: phụ thuộc vào interface (`Notifier`...) và inject vào (DIP/DI, học ở D12).

</details>

---

## D9 (T3, 06/10): Tổng quan Design Pattern + Singleton

**⏱ Ước tính:** Giờ làm 67' (DSA 45' + Bảng T2 DSA 10' + Anki 12') · Tối 82' (Học 40' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 2h29'**

> ⚖️ **Cân tải:** bảng *HashMap vs Two Pointers* được điền **trong giờ làm, ngay sau khi giải 167**, lúc lời giải còn nhớ rõ. Nếu để cả hai bảng T2 vào buổi tối thì tối nay sẽ khoảng 95', vượt trần 90'.

### 🧩 DSA: [167. Two Sum II – Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

- **Pattern (🔴 T1):** *Two Pointers trên mảng đã sort*. Tổng nhỏ hơn target → tăng `l` để tổng lớn lên; tổng lớn hơn → giảm `r`.
- **Các cách:**
  1. HashMap như bài 1 → O(n) thời gian, O(n) bộ nhớ. Không tận dụng được việc mảng đã sort.
  2. Với mỗi phần tử, binary search tìm phần bù → O(n log n), O(1) bộ nhớ.
  3. Two Pointers → O(n) thời gian, O(1) bộ nhớ. Đề yêu cầu bộ nhớ phụ hằng số, nên đây là đáp án.
- **Key insight:** vì sao không bỏ sót cặp nào? Khi `nums[l] + nums[r] < target`, mọi cặp `(l, r')` với `r' < r` còn nhỏ hơn nữa, nên có thể loại `l` một cách an toàn. Hãy tự nói được lập luận "loại trừ" này.
- **Lưu ý:** đề trả về index bắt đầu từ 1.

**🟡 Bảng so sánh T2: HashMap vs Two Pointers cho bài Two Sum** *(điền trong giờ làm, ngay sau khi giải bài; xem phần ⚖️ Cân tải ở đầu ngày)*

Nhóm: *chiến lược giải thuật (DSA)*. Trục chính: **bộ nhớ** vs **điều kiện về input**.

| Tiêu chí | HashMap | Two Pointers |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Yêu cầu input đã sort? | | |
| Ext: Bộ nhớ phụ | | |
| Ext: Trả về được index gốc không nếu phải tự sort? | | |

### 📘 Bài học buổi tối: Tổng quan Design Pattern (3 nhóm) + Singleton

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Design Pattern là gì: giải pháp đã được đặt tên cho vấn đề thiết kế lặp lại; "từ vựng chung" của kỹ sư | 🔴 T1 | Nói được vì sao biết tên pattern giúp giao tiếp và review code nhanh hơn | `what is a design pattern` |
| 2 | **3 nhóm GoF**: Creational (tạo đối tượng), Structural (lắp ghép đối tượng), Behavioral (phân chia trách nhiệm, giao tiếp) | 🔴 T1 | Xếp đúng nhóm cho 7 pattern của Tuần 2–3: Singleton, Factory Method, Builder, Strategy, Observer, Adapter, Decorator | `creational structural behavioral patterns` |
| 3 | **Singleton**: đảm bảo một class chỉ có một instance + điểm truy cập toàn cục | 🔴 T1 | Nói được cấu trúc: constructor private + method static trả instance | `singleton pattern refactoring guru` |
| 4 | Vì sao Singleton hay bị coi là anti-pattern | 🔴 T1 | Kể được ≥ 3 lý do (xem chi tiết) | `singleton anti pattern why` |
| 5 | Race condition khi khởi tạo lazy trong môi trường nhiều thread | 🔴 T1 | Mô tả được kịch bản 2 thread cùng thấy `instance == null` và cùng tạo mới | `singleton thread safety race condition` |
| 6 | Các cách làm Singleton thread-safe: khởi tạo sớm (eager), khoá (lock), double-checked locking, cơ chế sẵn có của ngôn ngữ | 🟢 T3 | Biết tên các cách; cú pháp tra docs ngôn ngữ của bạn | `double checked locking volatile`, `python module singleton`, `node module caching singleton` |
| 7 | **Singleton pattern vs singleton scope của DI container** | 🟡 T2 | Điền bảng so sánh bên dưới | `singleton pattern vs dependency injection singleton scope` |
| 8 | Singleton chỉ "duy nhất" **trong một process** | 🔴 T1 | Biết rằng chạy 3 instance/pod thì có 3 singleton; Singleton không phải cơ chế khoá phân tán | `singleton multiple instances distributed` |

**Chi tiết cần hiểu**

- **Ví dụ theo nhóm (mục 2):**

  | Nhóm | Câu hỏi nó trả lời | Pattern sẽ học |
  |---|---|---|
  | Creational | "Tạo object thế nào để code gọi không phụ thuộc vào class cụ thể?" | Singleton, Factory Method, Builder |
  | Structural | "Ghép các object/class lại thế nào cho khớp và linh hoạt?" | Adapter, Decorator |
  | Behavioral | "Chia việc và cho các object nói chuyện với nhau thế nào?" | Strategy, Observer |

- **Vì sao Singleton bị coi là anti-pattern (mục 4):**
  - Nó là **biến global đội lốt**: có phụ thuộc ẩn và state dùng chung (nối lại bài D8).
  - **Khó test:** code gọi `Logger.getInstance()` trực tiếp nên không thay bằng fake được; state còn sót từ test trước sang test sau.
  - **Vi phạm SRP:** class vừa làm nghiệp vụ, vừa tự quản lý vòng đời của chính mình.
  - Cần xử lý **đồng thời** (mục 5) nếu khởi tạo lazy.
- **Khi nào "một instance" là hợp lý:** connection pool, config đã load, logger, HTTP client dùng chung. Nhưng cách tốt là **để DI container tạo một instance rồi inject vào**, không phải để class tự ép mình thành Singleton. Như vậy vẫn có "một instance" mà không có "truy cập toàn cục".
- **Race condition (mục 5):** thread A kiểm tra `instance == null` → đúng. Trước khi A kịp gán, thread B cũng kiểm tra → cũng đúng. Kết quả: hai instance. Cách an toàn nhất và đơn giản nhất là khởi tạo sớm (eager) hoặc dùng cơ chế ngôn ngữ đảm bảo sẵn (module của Python/Node chỉ được load một lần mỗi process, `enum` hoặc static holder của Java).

**🟡 Bảng so sánh T2: Singleton pattern vs singleton scope của DI container**

Nhóm: *quản lý vòng đời đối tượng*. Trục chính: **tiện truy cập** vs **khả năng test và kiểm soát phụ thuộc**.

| Tiêu chí | Singleton pattern (class tự quản) | Singleton scope (container quản) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Phụ thuộc có hiện trên chữ ký/constructor không? | | |
| Ext: Thay bằng fake khi test dễ hay khó? | | |

**🔴 Thẻ Anki (T1)**

1. Ba nhóm Design Pattern là gì? Mỗi nhóm trả lời câu hỏi gì?
2. Singleton đảm bảo hai điều gì? Cấu trúc tối thiểu gồm những gì?
3. Kể 3 lý do Singleton bị coi là anti-pattern.
4. Mô tả race condition khi khởi tạo Singleton lazy với 2 thread.
5. Chạy app trên 3 pod thì có mấy "singleton"? Hệ quả là gì?
6. *(DSA-Pattern)* Mảng đã sort + tìm cặp có tổng bằng target → pattern gì? Vì sao di chuyển con trỏ không bỏ sót đáp án?

**🟢 Tra cứu (T3):** mục *Singleton* trên refactoring.guru có code mẫu cho nhiều ngôn ngữ (cả bản thread-safe).

**Tài liệu:**
- refactoring.guru/design-patterns (trang tổng quan *Catalog* + *Singleton*)

**❓ Câu hỏi cuối bài**

1. Vì sao Singleton thường bị coi là anti-pattern?
2. Muốn Singleton an toàn khi chạy nhiều thread thì phải làm gì?
3. Trong project của bạn, thứ gì đang được dùng như singleton (connection pool, config, logger)?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. App chạy 3 pod sau load balancer. Một đồng nghiệp dùng Singleton `RequestCounter` (đếm trong bộ nhớ) để giới hạn mỗi user 100 request/phút. Chuyện gì xảy ra? Nên sửa theo hướng nào?
5. Xếp 7 pattern sau vào 3 nhóm GoF: Singleton, Factory Method, Builder, Strategy, Observer, Adapter, Decorator. Vì sao Adapter và Decorator cùng nhóm dù mục đích khác nhau?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Là biến global đội lốt (phụ thuộc ẩn, state dùng chung); khó test (không thay bằng fake được, state rò giữa các test); vi phạm SRP (vừa làm nghiệp vụ vừa tự quản vòng đời); phải xử lý đồng thời nếu khởi tạo lazy.
- **Câu 2:** Mô tả được race condition 2 thread cùng thấy `null`. Cách: khởi tạo sớm (eager), lock, double-checked locking (+ `volatile` ở Java), hoặc dùng cơ chế ngôn ngữ (module chỉ load một lần, static holder, `enum`). Tốt nhất: để DI container tạo một instance.
- **Câu 3:** Chỉ ra thứ cụ thể trong project; nó được tạo thế nào (class tự quản hay container quản); nó có state có thể bị sửa không, có thread-safe không.
- **Câu 4:** Mỗi pod có một singleton riêng → mỗi pod đếm riêng, user thực tế được ~300 req/phút, còn tuỳ LB phân phối. Singleton chỉ duy nhất trong một process. Sửa: đếm ở kho dùng chung (Redis `INCR` + TTL), sẽ học ở Tuần 10.
- **Câu 5:** Creational: Singleton, Factory Method, Builder. Structural: Adapter, Decorator. Behavioral: Strategy, Observer. Adapter và Decorator đều trả lời câu hỏi "ghép/bọc object thế nào"; khác nhau ở chỗ Adapter đổi interface, Decorator giữ interface và thêm hành vi.

</details>

---

## D10 (T4, 07/10): Factory Method

**⏱ Ước tính:** Giờ làm 67' (DSA 55' + Anki 12') · Tối 83' (Học 40' + Bảng T2 15' + Ghi chú/Anki 10' + Tự kiểm tra 18') · **Tổng 2h30'**

### 🧩 DSA: [15. 3Sum](https://leetcode.com/problems/3sum/)

- **Pattern (🔴 T1):** *Sort + cố định một phần tử + Two Pointers cho phần còn lại*. Biến bài 3 số thành n lần bài Two Sum II.
- **Các cách:**
  1. Brute force 3 vòng lặp → O(n³).
  2. Cố định `i`, dùng HashSet tìm cặp còn lại → O(n²), nhưng loại bỏ bộ ba trùng lặp rất rối.
  3. Sort rồi cố định `i`, Two Pointers trên `[i+1, n-1]` → O(n²) thời gian, O(1) bộ nhớ phụ (không tính output và bộ nhớ của thuật toán sort).
- **Key insight (bỏ trùng):**
  - Bỏ qua `i` nếu `nums[i] == nums[i-1]`.
  - Sau khi tìm được một bộ ba, tăng `l` cho tới khi `nums[l]` khác giá trị vừa dùng.
  - Có thể dừng sớm khi `nums[i] > 0`, vì mảng đã sort nên ba số dương không thể có tổng bằng 0.
- **Câu hỏi mở rộng:** vì sao không thể làm tốt hơn O(n²) một cách đơn giản? (Chỉ cần biết đây là giới hạn thực tế của bài.)

### 📘 Bài học buổi tối: Factory Method

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Vấn đề của `new ConcreteClass()` rải rác trong code: code gọi bị gắn chặt với class cụ thể | 🔴 T1 | Nối được với DIP và coupling của D8 | `problem with new keyword coupling` |
| 2 | **Factory Method** (GoF): lớp cha khai báo method tạo object, lớp con quyết định tạo class cụ thể nào | 🔴 T1 | Vẽ được sơ đồ Creator → `createProduct()` → Product interface | `factory method pattern refactoring guru` |
| 3 | **Simple Factory** (hàm/class có `switch` trả về đúng loại): không nằm trong 23 pattern GoF nhưng dùng nhiều nhất | 🔴 T1 | Viết được `SenderFactory.create(channel)` | `simple factory vs factory method` |
| 4 | **Abstract Factory**: tạo *một họ* object liên quan (ví dụ bộ UI Windows vs Mac) | 🔴 T1 | Chỉ cần nói được ý đồ và phân biệt với Factory Method | `abstract factory vs factory method` |
| 5 | **Simple Factory vs Factory Method vs Abstract Factory** | 🟡 T2 | Điền bảng so sánh bên dưới | `factory patterns comparison` |
| 6 | Factory và OCP: factory dạng **registry** (map `kênh → hàm tạo`) để thêm loại mới mà không sửa `switch` | 🔴 T1 | Giải thích được: `switch` gom việc sửa về *một chỗ*; registry thì chỉ cần *đăng ký thêm* | `factory registry pattern open closed` |

**Chi tiết cần hiểu**

- **Factory giải quyết gì so với `new` (mục 1):**
  - Code gọi chỉ biết interface `NotificationSender`, không biết `SmsSender` hay `EmailSender`.
  - Logic "chọn class nào + khởi tạo với tham số gì" nằm ở **một chỗ**, không lặp lại ở 10 nơi.
  - Dễ thay bằng fake khi test: inject một factory trả về fake sender.
- **Nói cho trung thực về OCP (mục 6):** Simple Factory có `switch` vẫn phải **sửa** khi thêm loại mới. Nhưng việc sửa chỉ nằm ở một chỗ, và mọi code gọi *không* phải sửa. Muốn "đóng hoàn toàn", dùng registry:
  - `registry = { "email": EmailSender, "sms": SmsSender }`
  - Thêm Zalo = thêm một class + một dòng đăng ký (thường đặt ở composition root).
- **Factory Method thực sự (mục 2)** hay gặp trong framework: framework định nghĩa khung xử lý, bạn override method `createXxx()` để cắm class của mình vào. Trong code nghiệp vụ hằng ngày, Simple Factory và registry phổ biến hơn nhiều.
- **Dấu hiệu nên dùng factory:** cùng một đoạn `if type == ...: new A() elif ...: new B()` xuất hiện ở từ 2 nơi trở lên, hoặc việc khởi tạo cần nhiều bước (đọc config, tạo client, gắn retry).

**🟡 Bảng so sánh T2: Simple Factory vs Factory Method vs Abstract Factory**

Nhóm: *creational pattern*. Trục chính: **độ linh hoạt khi mở rộng** vs **độ phức tạp (số class)**.

| Tiêu chí | Simple Factory | Factory Method | Abstract Factory |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Tạo một loại hay một họ sản phẩm? | | | |
| Ext: Cơ chế mở rộng (sửa `switch` / thêm subclass / thêm factory mới) | | | |

**🔴 Thẻ Anki (T1)**

1. Gọi `new ConcreteClass()` trực tiếp trong business code gây ra vấn đề gì?
2. Factory Method khác Simple Factory ở đâu?
3. Abstract Factory dùng khi nào? Cho một ví dụ "họ sản phẩm".
4. Simple Factory có `switch` có thật sự tuân thủ OCP không? Làm sao để "đóng" hoàn toàn?
5. *(DSA-Pattern)* Bài 3Sum: làm sao loại bộ ba trùng mà không dùng Set?

**Tài liệu:**
- refactoring.guru: *Factory Method*, *Abstract Factory* (đọc phần *Problem*, *Solution*, *Applicability*, bỏ qua code nếu vội)

**❓ Câu hỏi cuối bài**

1. Factory giải quyết vấn đề gì so với việc gọi `new` trực tiếp?
2. Factory liên quan đến nguyên lý OCP ra sao?
3. Phác thảo factory tạo `NotificationSender` theo kênh gửi.

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Hệ thống chạy ở hai môi trường *sandbox* và *production*. Mỗi môi trường cần **một bộ** client đi cùng nhau: `PaymentClient`, `SmsClient`, `EmailClient`, và tuyệt đối không được trộn (payment production + SMS sandbox). Bạn chọn Simple Factory, Factory Method hay Abstract Factory? Vì sao hai loại còn lại kém phù hợp hơn?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Code gọi chỉ biết interface, không gắn với class cụ thể (giảm coupling, DIP); logic "chọn class + khởi tạo với tham số gì" gom về một chỗ, không lặp lại; dễ thay bằng fake khi test.
- **Câu 2:** Thêm loại mới không phải sửa code gọi. Simple Factory có `switch` vẫn phải sửa một chỗ; registry (`map kênh → hàm tạo`) thì chỉ cần đăng ký thêm ở composition root → gần như "đóng" hoàn toàn.
- **Câu 3:** Interface `NotificationSender.send()`; các class Email/Sms/Push; `SenderFactory.create(channel)` hoặc registry; kênh không hỗ trợ → lỗi rõ ràng; phần đăng ký nằm ngoài business code.
- **Câu 4:** Abstract Factory: một interface `ClientFactory` với `createPayment/createSms/createEmail`, mỗi môi trường một factory cụ thể → cả bộ luôn nhất quán. Simple Factory/Factory Method chỉ tạo **một loại** sản phẩm mỗi lần nên không đảm bảo "cùng họ". Chọn factory một lần ở composition root theo config.

</details>

---

## D11 (T5, 08/10): Builder

**⏱ Ước tính:** Giờ làm 57' (DSA 45' + Anki 12') · Tối 88' (Học 35' + Bảng T2 25' + Ghi chú/Anki 10' + Tự kiểm tra 18') · **Tổng 2h25'**

### 🧩 DSA: [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

- **Pattern (🔴 T1):** *Two Pointers từ hai đầu + tham lam (greedy) di chuyển phía thấp hơn*.
- **Các cách:**
  1. Thử mọi cặp → O(n²).
  2. Two Pointers: diện tích = `min(h[l], h[r]) × (r − l)`. Mỗi bước di chuyển con trỏ ở **cột thấp hơn** → O(n) thời gian, O(1) bộ nhớ.
- **Key insight (phải nói được khi phỏng vấn):** chiều rộng luôn giảm khi con trỏ di chuyển. Nếu di chuyển cột **cao** hơn, chiều cao của hình vẫn bị chặn bởi cột thấp, nên diện tích chắc chắn không tăng. Chỉ di chuyển cột thấp mới có cơ hội tìm được hình lớn hơn.
- **Lưu ý:** đừng nhầm với bài 42 *Trapping Rain Water*: bài đó tính tổng nước giữa nhiều cột, không phải chọn hai cột.

### 📘 Bài học buổi tối: Builder

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Vấn đề **telescoping constructor**: constructor 8–10 tham số, nhiều tham số tuỳ chọn | 🔴 T1 | Kể được 3 vấn đề (xem chi tiết) | `telescoping constructor problem` |
| 2 | **Builder**: tạo object phức tạp theo từng bước; `build()` kiểm tra hợp lệ rồi mới trả object | 🔴 T1 | Tự viết được `Message.builder().to(...).body(...).build()` | `builder pattern refactoring guru` |
| 3 | Builder + object bất biến (immutable) + kiểm tra invariant trong `build()` | 🔴 T1 | Giải thích được vì sao object tạo ra không bao giờ ở trạng thái "nửa vời" | `builder pattern immutable object validation` |
| 4 | Director (trong GoF) | 🟢 T3 | Biết tồn tại; thực tế ít dùng | `builder director role` |
| 5 | **Builder vs named params / options object** | 🟡 T2 | Điền bảng; biết rằng ở Python/Kotlin/TS nhiều khi không cần Builder | `builder pattern vs named arguments`, `options object pattern` |
| 6 | **Factory vs Builder** | 🟡 T2 | Điền bảng (đây là câu 3 của Chốt tuần) | `factory vs builder pattern` |
| 7 | Builder trong thư viện thật: query builder, HTTP request builder | 🔴 T1 | Chỉ ra được 1 ví dụ trong stack của bạn | `query builder pattern`, `http request builder` |
| 8 | Sinh code builder tự động (Lombok `@Builder`...) | 🟢 T3 | Tra khi cần | docs thư viện |

**Chi tiết cần hiểu**

- **Telescoping constructor gây hại gì (mục 1):**
  - Gọi `new Order(a, b, null, null, true, false, 0, null)`: không ai đọc được tham số thứ 5 là gì.
  - Hai tham số cùng kiểu dễ bị đảo chỗ mà compiler không báo (`width, height`).
  - Phải tạo nhiều overload constructor cho từng tổ hợp tham số tuỳ chọn.
  - Nếu chuyển sang "constructor rỗng + setter" thì object có thể tồn tại ở trạng thái chưa hợp lệ, và không còn bất biến.
- **Điểm mạnh thật sự của Builder (mục 2–3):**
  - Đặt tên cho từng bước → dễ đọc.
  - Có thể build **có điều kiện** (`if user.isVip: builder.discount(10)`), truyền builder qua nhiều hàm.
  - `build()` là **một chỗ duy nhất** kiểm tra ràng buộc liên trường (ví dụ: kênh email thì bắt buộc có `subject`).
- **Khi nào Builder là thừa:** ngôn ngữ có named/default argument hoặc object literal (Python kwargs, Kotlin, TypeScript `{...}`) và object không có ràng buộc liên trường. Khi đó một constructor có named params, hoặc một options object + hàm validate, là đủ.
- **Ví dụ trong thư viện (mục 7):** query builder (Knex, SQLAlchemy Core, jOOQ, Squirrel của Go), `HttpRequest.newBuilder()` của Java, `Request.Builder` của OkHttp. Chú ý: query builder vừa là Builder (lắp từng mệnh đề), vừa thường là *fluent interface*.

**🟡 Bảng so sánh T2: Factory vs Builder**

Nhóm: *creational pattern*. Trục chính: **chọn loại object nào** vs **lắp một object phức tạp thế nào**.

| Tiêu chí | Factory | Builder |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Câu hỏi chính nó trả lời ("tạo *cái gì*?" hay "tạo *thế nào*?") | | |
| Ext: Số bước tạo (một lần gọi hay nhiều bước) | | |

**🟡 Bảng so sánh T2: Builder vs named params / options object**

Nhóm: *API khởi tạo đối tượng*. Trục chính: **khả năng kiểm soát/validate** vs **độ gọn**.

| Tiêu chí | Builder | Named params / options object |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Build có điều kiện / qua nhiều bước | | |
| Ext: Lượng code phải viết thêm | | |

**🔴 Thẻ Anki (T1)**

1. Telescoping constructor là gì? Nêu 3 vấn đề của nó.
2. Vì sao nên validate trong `build()` thay vì trong từng setter?
3. Builder giúp tạo object bất biến như thế nào?
4. *(DSA-Pattern)* Container With Most Water: vì sao luôn di chuyển con trỏ ở cột thấp hơn?

**Tài liệu:**
- refactoring.guru: *Builder*
- *Effective Java*, Item 2 "Consider a builder when faced with many constructor parameters" (nếu có sách)

**❓ Câu hỏi cuối bài**

1. Constructor có quá nhiều tham số thì gây vấn đề gì?
2. Builder khác truyền object hoặc named params ở điểm nào?
3. Tìm một ví dụ Builder trong thư viện bạn đang dùng (query builder, HTTP client).

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Đồng nghiệp đề xuất bỏ `Message.builder()`, thay bằng constructor rỗng + setter cho từng field "cho gọn". Với quy tắc "kênh email bắt buộc có `subject`", điều gì có thể hỏng? Trong trường hợp nào đề xuất này chấp nhận được?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Khó đọc (`new Order(a, b, null, null, true, ...)`); dễ đảo chỗ hai tham số cùng kiểu mà compiler không báo; phải viết nhiều overload; chuyển sang setter thì object có thể ở trạng thái nửa vời.
- **Câu 2:** Builder: đặt tên từng bước, build có điều kiện/qua nhiều hàm, `build()` là một chỗ duy nhất kiểm tra ràng buộc liên trường và trả object bất biến. Named params/options object: gọn hơn, đủ dùng khi ngôn ngữ hỗ trợ và không có ràng buộc liên trường.
- **Câu 3:** Chỉ ra ví dụ cụ thể (Knex/SQLAlchemy/jOOQ, `HttpRequest.newBuilder()`, OkHttp `Request.Builder`); chỉ ra đâu là các bước, đâu là `build()`/`execute()`.
- **Câu 4:** Object có thể tồn tại ở trạng thái chưa hợp lệ (email thiếu subject) và bị gửi đi; ràng buộc phải kiểm tra rải rác ở nơi dùng; object không còn bất biến, có thể bị sửa sau khi tạo. Chấp nhận được khi không có ràng buộc liên trường và ngôn ngữ có named/default params (dùng constructor + validate trong constructor).

</details>

---

## D12 (T6, 09/10): Dependency Injection & IoC container

**⏱ Ước tính:** Giờ làm 37' (DSA 25' + Anki 12') · Tối 87' (Học 45' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 2h04'**

### 🧩 DSA: [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

- **Pattern (🔴 T1):** *Theo dõi giá trị tốt nhất phía trước (running min)*, có thể nhìn như *Sliding Window / Two Pointers*: `l` là ngày mua, `r` là ngày bán. Gặp giá thấp hơn giá mua thì dời `l` tới đó.
- **Các cách:**
  1. Thử mọi cặp (mua, bán) → O(n²).
  2. Một lần duyệt, giữ `minPrice` từ đầu tới hiện tại, lợi nhuận = `price − minPrice` → O(n) thời gian, O(1) bộ nhớ.
- **Lỗi hay gặp:** lấy `max − min` của cả mảng. Sai vì ngày bán phải **sau** ngày mua.
- **Liên hệ:** đây là bài đầu tiên của dạng "duyệt một lần, giữ trạng thái tốt nhất", sẽ gặp lại ở Kadane (Maximum Subarray) và DP.

### 📘 Bài học buổi tối: Dependency Injection & IoC container trong framework của bạn

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Nhắc lại DIP / DI / IoC (Tuần 1, D5) | 🔴 T1 | Nói lại được mỗi khái niệm một câu | `DIP vs DI vs IoC` |
| 2 | 3 kiểu DI: constructor, setter/property, method (parameter) injection | 🔴 T1 | Cho được ví dụ từng kiểu | `types of dependency injection` |
| 3 | **Constructor vs Setter injection** | 🟡 T2 | Điền bảng; kết luận mặc định dùng constructor | `constructor vs setter injection` |
| 4 | **IoC container** làm gì: đăng ký (binding) interface → implementation, tự dựng cây phụ thuộc, quản lý vòng đời | 🔴 T1 | Giải thích được luồng "đăng ký → resolve → inject" | `how ioc container works` |
| 5 | **Vòng đời (lifetime)**: singleton / scoped (mỗi request) / transient (mỗi lần resolve) | 🔴 T1 | Chọn đúng lifetime cho: DB connection pool, DB session/transaction, validator không có state | `singleton scoped transient lifetime` |
| 6 | *Captive dependency*: service singleton giữ một dependency scoped → dùng chung session DB giữa các request | 🔴 T1 | Mô tả được lỗi và hậu quả | `captive dependency` |
| 7 | Service Locator (anti-pattern): gọi `container.get(X)` bên trong business code | 🔴 T1 | Giải thích được vì sao nó tái tạo "phụ thuộc ẩn" | `service locator anti pattern` |
| 8 | Composition root: nơi duy nhất nối các dependency lại với nhau (thường là `main` / file khởi động app) | 🔴 T1 | Chỉ ra được composition root trong project của bạn | `composition root dependency injection` |
| 9 | Cú pháp DI của framework (`@Autowired`, `@Injectable` + `providers`, `AddScoped`, `Depends`, Google Wire...) | 🟢 T3 | Tra docs framework bạn dùng | docs framework |

**Chi tiết cần hiểu**

- **DI giúp test dễ hơn như thế nào:** `OrderService(repo, paymentGateway, clock)`. Trong test, truyền `FakeRepo`, `FakePaymentGateway` và một `FixedClock`. Test chạy trong mili giây, không cần DB thật, không cần mạng, và kết quả luôn giống nhau.
- **Vì sao mặc định dùng constructor injection:**
  - Dependency **bắt buộc** hiện rõ trên chữ ký. Nhìn constructor có 9 tham số là thấy ngay class đang vi phạm SRP.
  - Object luôn đầy đủ dependency ngay sau khi tạo, không có trạng thái "quên set".
  - Field có thể là `final` / `readonly`.
  - Setter injection chỉ hợp lý cho dependency **tuỳ chọn** có giá trị mặc định. Nếu bạn phải dùng setter để phá phụ thuộc vòng (A cần B, B cần A), đó là dấu hiệu thiết kế sai.
- **Chọn lifetime (mục 5):**

  | Thành phần | Lifetime hợp lý | Vì sao |
  |---|---|---|
  | Connection pool, HTTP client, config | Singleton | Tốn kém khi tạo, dùng chung an toàn |
  | DB session / transaction / unit of work, thông tin user hiện tại | Scoped (per request) | Mỗi request cần một phiên riêng |
  | Object nhẹ, không có state | Transient hoặc Singleton đều được | Không có state thì không có gì để chia sẻ sai |

- **Service singleton được mọi request đồng thời dùng chung.** Vì vậy nó **không được** giữ dữ liệu theo request trong field (user hiện tại, giỏ hàng, bộ đếm tạm). Nếu làm vậy, request này sẽ đọc nhầm dữ liệu của request khác. Đây là lỗi race condition hay gặp ở Spring/NestJS, và người phỏng vấn hay hỏi.

- **DI không bắt buộc phải có container.** "Pure DI" là tự `new` rồi truyền vào trong `main`. Với project nhỏ, cách này rõ ràng và đủ dùng. Container có ích khi cây phụ thuộc lớn và cần quản lý lifetime.

**🟡 Bảng so sánh T2: Constructor vs Setter injection**

Nhóm: *kỹ thuật truyền phụ thuộc*. Trục chính: **tính bắt buộc/rõ ràng** vs **tính linh hoạt**.

| Tiêu chí | Constructor injection | Setter injection |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Object có thể ở trạng thái thiếu dependency không? | | |
| Ext: Hỗ trợ field bất biến (`final`/`readonly`)? | | |

**🔴 Thẻ Anki (T1)**

1. DI giúp viết unit test dễ hơn như thế nào? Cho ví dụ với `Clock`.
2. IoC container làm 3 việc gì?
3. Singleton / Scoped / Transient khác nhau thế nào? DB session nên dùng lifetime nào?
4. Captive dependency là gì? Hậu quả?
5. Vì sao Service Locator bị coi là anti-pattern?
6. Composition root là gì?

**🟢 Tra cứu (T3, tuỳ chọn tối nay; nếu thiếu giờ làm vào Lab D13 Bước 1):** trang *Dependency Injection* trong docs chính thức của framework bạn dùng (Spring *Dependency Injection*, NestJS *Providers* + *Injection scopes*, ASP.NET Core *Dependency injection*, FastAPI *Dependencies*...). Ghi snippet đăng ký một service vào `notes/snippets.md`.

**Tài liệu:**
- Docs framework bạn dùng (như trên)
- martinfowler.com: *Inversion of Control Containers and the Dependency Injection pattern*

**❓ Câu hỏi cuối bài**

1. DI giúp viết unit test dễ hơn như thế nào?
2. Constructor injection khác setter injection ra sao? Nên ưu tiên cái nào?
3. Framework của bạn inject dependency theo cách nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. `OrderService` được đăng ký **singleton**, và constructor của nó nhận `DbSession` được đăng ký **scoped** (mỗi request một session). Chuyện gì xảy ra khi 2 request chạy đồng thời? Lỗi này tên là gì, và sửa thế nào?
5. Đồng nghiệp viết `container.get(PaymentGateway)` ngay trong `OrderService.checkout()` cho tiện. Vì sao đây là Service Locator? Unit test sẽ khó hơn ở điểm nào? Việc nối dependency nên đặt ở đâu?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Dependency truyền từ ngoài vào nên trong test truyền fake/stub (`FakeRepo`, `FakePaymentGateway`, `FixedClock`) → test nhanh, không cần DB/mạng, kết quả ổn định (không phụ thuộc giờ hệ thống).
- **Câu 2:** Constructor: dependency bắt buộc hiện rõ trên chữ ký, object luôn đầy đủ, field `final/readonly` được, constructor quá dài lộ ra vi phạm SRP. Setter: chỉ cho dependency tuỳ chọn có giá trị mặc định. Mặc định ưu tiên constructor.
- **Câu 3:** Nêu cơ chế thật của framework (annotation/decorator, module providers, `Depends`...), lifetime mặc định là gì, composition root nằm ở đâu.
- **Câu 4:** *Captive dependency*: singleton được tạo một lần nên giữ luôn session của request đầu tiên → mọi request dùng chung một session/transaction (dữ liệu lẫn lộn, lỗi đồng thời, session bị đóng). Sửa: cho `OrderService` là scoped, hoặc inject factory/provider để lấy session theo request.
- **Câu 5:** Phụ thuộc bị giấu trong thân hàm, không hiện trên constructor (phụ thuộc ẩn). Test phải dựng và cấu hình container thay vì truyền fake. Nối dependency ở composition root (`main`/file khởi động), business code chỉ nhận qua constructor.

</details>

---

## D13 (T7, 10/10): Lab

**⏱ Ước tính:** DSA 45' · Lab 3h05' · Ôn ⚠️ 10' · **Tổng 4h00'**

> ⚖️ **Cân tải:** lab đã rút xuống 3h05' (Bước 2 còn 35', Bước 6 còn 30' với 6 test bắt buộc; test thêm là mở rộng) để cả ngày nằm trong 4h. Ôn ⚠️ hôm nay chỉ 10' cho câu quan trọng nhất. Các câu ⚠️ còn lại ôn vào D14, trong phần "Làm lại".

### 🧩 DSA: [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

- **Pattern (🔴 T1):** *Sliding Window kích thước thay đổi*. Mở rộng `r` từng bước; khi cửa sổ vi phạm điều kiện (có ký tự lặp), thu hẹp `l` tới khi hợp lệ lại.
- **Các cách:**
  1. Brute force xét mọi substring → O(n³) hoặc O(n²).
  2. Sliding window + HashSet: khi gặp ký tự lặp, xoá `s[l]` và tăng `l` cho tới khi hết lặp → O(n), vì mỗi ký tự vào và ra khỏi set tối đa một lần.
  3. Sliding window + HashMap `ký tự → vị trí gần nhất`: nhảy thẳng `l = max(l, last[c] + 1)` → O(n).
- **Lỗi hay gặp ở cách 3:** quên `max`. Vị trí cũ của ký tự có thể nằm **ngoài** cửa sổ hiện tại; nếu gán thẳng, `l` bị lùi lại. Ví dụ: `"abba"`.
- Sau đó làm lại 1 bài sai trong tuần (nếu có).

### 🛠 Lab (3h05'): module `Notification` dùng Factory + DI + Builder

**Bước 1: Chuẩn bị (15')**
- Tạo `project/notification/` trong repo `interview-prep/`. Dùng ngôn ngữ và test framework bạn đang dùng hằng ngày.
- Nhập thẻ Anki D8–D12 (T1 + thẻ DSA-Pattern Two Pointers / Sliding Window).

**Bước 2: Interface và các implementation (35')**
- Interface `NotificationSender` với một method: `send(message) → SendResult`.
- 3 implementation: `EmailSender`, `SmsSender`, `PushSender`. **Không gọi nhà cung cấp thật.** Mỗi sender nhận một "client" qua constructor (ví dụ `SmtpClient`, `SmsGatewayClient`), bản thật chỉ cần in log ra console.
- `SendResult` gồm: `success`, `providerMessageId` (hoặc `error`).

**Bước 3: Builder cho `Message` (30')**
- Các trường: `channel`, `recipient`, `subject` (tuỳ chọn), `body`, `metadata` (tuỳ chọn).
- `build()` kiểm tra: thiếu `recipient` hoặc `body` → lỗi; `channel = email` mà thiếu `subject` → lỗi; `channel = sms` mà `body` dài hơn 160 ký tự → lỗi.
- Object `Message` sau khi build là bất biến.

**Bước 4: Factory dạng registry (25')**
- `SenderFactory` nhận một map `channel → sender` qua constructor; method `get(channel)` trả sender, kênh không tồn tại → lỗi rõ ràng (`UnsupportedChannel`).
- Việc đăng ký 3 sender thực hiện ở **composition root** (`main` hoặc file cấu hình DI), không nằm trong factory.

**Bước 5: `NotificationService` + DI (30')**
- `NotificationService(factory, logger)` inject qua constructor.
- Method `notify(message)`: lấy sender từ factory, gửi, ghi log kết quả.
- **Yêu cầu thêm:** nếu gửi `push` thất bại thì tự động gửi lại qua `email` (fallback), với điều kiện `message.metadata` có email dự phòng.

**Bước 6: Unit test (30')**. Tối thiểu 6 test, tất cả chạy xanh, không đụng mạng:
1. `build()` báo lỗi khi email thiếu `subject`.
2. `build()` báo lỗi khi SMS dài quá 160 ký tự.
3. Factory trả đúng sender theo kênh; kênh lạ thì báo lỗi.
4. `notify()` gọi đúng sender **đúng một lần** với đúng message (dùng mock/spy).
5. Push thất bại → email sender được gọi (fallback).
6. Push thành công → email sender **không** được gọi.

**Bước 7: Ghi chú (20')**
- Viết `notes/notification-design.md` gồm:
  - Sơ đồ phụ thuộc (mũi tên từ `NotificationService` → `SenderFactory` → `NotificationSender` ← các implementation).
  - Mỗi pattern dùng ở đâu, giải quyết vấn đề gì.
  - Trả lời: *"Thêm kênh Zalo thì phải sửa/thêm những file nào?"* Kết quả mong đợi: thêm 1 class + 1 dòng đăng ký, không sửa `NotificationService`.

**Bước 8 (còn lại):** Ôn các câu đánh dấu ⚠️ trong tuần.

**Deliverable:** `project/notification/` có test chạy xanh + `notes/notification-design.md`.

---

## D14 (CN, 11/10): Chốt tuần 2

**⏱ Ước tính:** DSA 50' · Làm lại 15, 3 + ôn ⚠️ còn lại 40' · Chốt tuần 60' · Anki/cheat sheet 30' · **Tổng 3h00'**

### 🧩 DSA: [424. Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/)

- **Pattern (🔴 T1):** *Sliding Window kích thước thay đổi với điều kiện đếm*. Cửa sổ hợp lệ khi `độ dài cửa sổ − số lần xuất hiện của ký tự nhiều nhất ≤ k` (số ký tự cần thay ≤ k).
- **Các cách:**
  1. Với mỗi cửa sổ, đếm lại từ đầu → O(n²) hoặc tệ hơn.
  2. Sliding window + mảng đếm 26 ký tự, mỗi bước tính `max(count)` → O(26 · n) = O(n).
  3. Giữ biến `maxFreq` và **không giảm** nó khi thu hẹp cửa sổ → O(n).
- **Key insight của cách 3 (khó, phỏng vấn hay hỏi):** đáp án chỉ tăng khi tìm được `maxFreq` lớn hơn. Một `maxFreq` "cũ" (lớn hơn thực tế) chỉ khiến cửa sổ không bị thu hẹp thêm, chứ không làm đáp án sai. Nếu chưa hiểu, nộp cách 2 là đủ.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Khi nào dùng Two Pointers, khi nào dùng Sliding Window? Dấu hiệu nhận biết từ đề bài là gì?
   - *Gợi ý tự kiểm tra: Two Pointers hai đầu → mảng đã sort / so sánh đối xứng / tìm cặp. Sliding Window → "substring/subarray liên tiếp dài nhất/ngắn nhất/có tổng thoả điều kiện".*
2. Sliding window kích thước cố định khác kích thước thay đổi thế nào? Viết khung code chung.
   - *Khung thay đổi: `for r in range(n): thêm s[r]; while (cửa sổ không hợp lệ): bỏ s[l], l += 1; cập nhật đáp án`.*
3. So sánh Factory và Builder.
4. Giải thích DI cho một người không biết lập trình.
5. Vẽ sơ đồ phụ thuộc giữa các module trong project hiện tại. Chỗ nào coupling cao nhất?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Two Pointers: mảng đã sort hoặc so sánh đối xứng, tìm cặp/bộ; mỗi bước **loại trừ** được một phía một cách an toàn. Sliding Window: đoạn con **liên tiếp** (substring/subarray) dài nhất/ngắn nhất/thoả điều kiện; hai con trỏ cùng chạy một chiều.
- **Câu 2:** Cố định: cửa sổ luôn dài k, thêm `s[r]` thì bỏ `s[r−k]`. Thay đổi: mở rộng `r`, `while` không hợp lệ thì thu `l`. Cả hai O(n) vì mỗi phần tử vào/ra cửa sổ tối đa một lần. Viết được khung code.
- **Câu 3:** Factory trả lời "tạo **cái gì**" (chọn class cụ thể, một lần gọi, giấu kiểu thật). Builder trả lời "tạo **thế nào**" (lắp một object phức tạp nhiều bước, validate trong `build()`, object bất biến). Có thể dùng chung: factory trả về builder đã cấu hình sẵn.
- **Câu 4:** Dùng ví dụ đời thường: đầu bếp không tự trồng rau mà nhà cung cấp mang tới. Đổi nhà cung cấp không phải đào tạo lại đầu bếp, và khi thử món có thể dùng nguyên liệu giả. Phải nêu được ý "đồ cần dùng được đưa từ ngoài vào, không tự tạo".
- **Câu 5:** Sơ đồ có mũi tên đúng chiều. Chỉ ra module có nhiều phụ thuộc vào/ra nhất, phụ thuộc vòng hoặc state global. Đề xuất một cách giảm coupling cụ thể (interface + DI, event, tách module).

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] Module `project/notification/` có test chạy xanh + `notes/notification-design.md`
- [ ] Tự giải lại 15, 3 không xem lời giải (mỗi bài ≤ 20'). Bài 125 là Easy, làm lại ở giờ làm tuần sau nếu cần
- [ ] Anki: đã nhập đủ thẻ T1 của D8–D12 + thẻ pattern Two Pointers / Sliding Window (cố định và thay đổi)
- [ ] Cheat sheet: đã điền các bảng HashMap vs Two Pointers, Singleton pattern vs DI singleton scope, 3 loại Factory, Factory vs Builder, Builder vs named params, Constructor vs Setter injection
- [ ] Error List: đã ghi các bài sai trong tuần và lên lịch làm lại (sau 3 ngày và 7 ngày)

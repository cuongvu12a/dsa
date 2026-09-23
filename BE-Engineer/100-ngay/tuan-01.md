# Tuần 1 (28/09 – 04/10): Big-O, OOP, SOLID

← [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 2 →](tuan-02.md)

**Mục tiêu tuần:** Giải thích được 4 tính chất OOP, Composition vs Inheritance và SOLID bằng ví dụ lấy từ chính code của bạn. Phân tích được độ phức tạp của mọi đoạn code mình viết.

## Cách học theo Tier (áp dụng cho mọi bài)

| Tier | Nhận diện | Cách học | Lưu ở đâu |
|---|---|---|---|
| 🔴 **T1** | Nguyên lý, mental model, dùng liên tục để suy luận | Hiểu **tại sao** → tự giải thích lại bằng lời (Feynman) → **thẻ Anki Active Recall** → ôn lại theo lịch | Anki deck `T1` |
| 🟡 **T2** | So sánh "A vs B", phụ thuộc tình huống | Điền **bảng so sánh**: 3 tiêu chí core (Use-case lý tưởng · Trade-off chính · Khi nào KHÔNG dùng) + 2–3 tiêu chí extension. Tạo **1 thẻ Anki** dạng "Khi nào chọn A thay vì B?" vì phỏng vấn hỏi nhiều | `notes/tradeoff-cheatsheet.md` |
| 🟢 **T3** | Cú pháp, config, chi tiết triển khai | **Không học thuộc.** Chỉ lưu link docs hoặc snippet | `notes/snippets.md` |

> Mỗi bài dưới đây có bảng **"Mục kiến thức cần học"** đã gắn Tier. Hãy research theo cột *Từ khoá research*. Học đến đâu thì dừng theo cột *Cần nắm tới mức nào*, đừng đào sâu hơn.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Big-O và các quy tắc phân tích, độ phức tạp của cấu trúc dữ liệu cơ bản, HashMap hoạt động bên trong (hash, bucket, collision, resize), 4 tính chất OOP, Composition vs Inheritance, SOLID, các pattern DSA: Hashing / Counting / Prefix-Suffix / Bucket | Interface vs Abstract class, Heap vs Bucket sort (Top K) | Ký hiệu toán học hình thức, Master theorem, cú pháp access modifier, cơ chế OOP riêng của từng ngôn ngữ, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D1 (T2) | 40' | 85' | 2h05' |
| D2 (T3) | 35' | 80' | 1h55' |
| D3 (T4) | 35' | 60' | 1h35' |
| D4 (T5) | 55' | 70' | 2h05' |
| D5 (T6) | 60' | 80' | 2h20' |
| D6 (T7) | — | 3h45' | 3h45' |
| D7 (CN) | — | 2h40' | 2h40' |

**Tổng tuần: 16h25'** (chưa tính 1h tiếng Anh mỗi ngày)

Ngày nặng nhất trong tuần là D5 (LSP/ISP/DIP + Top K bằng Heap/Bucket, 2h20'). Không buổi tối nào vượt 90', nên tuần này không phải dời việc sang Thứ Bảy.

---

## D1 (T2, 28/09): Big-O

**⏱ Ước tính:** Giờ làm 40' (DSA 30' + Anki 10') · Tối 85' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h05'**

### 🧩 DSA: [217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)

- **Pattern (🔴 T1):** *Hashing: "đã thấy phần tử này chưa?"*. Cần tra cứu nhanh xem một phần tử đã xuất hiện chưa → nghĩ ngay tới HashSet hoặc HashMap.
- **Hãy tự nghĩ ra cả 3 cách** trước khi xem lời giải:
  1. Brute force: hai vòng lặp → O(n²) thời gian, O(1) bộ nhớ.
  2. Sort rồi so sánh hai phần tử kề nhau → O(n log n) thời gian. Bộ nhớ tuỳ thuật toán sort: heapsort O(1), quicksort O(log n) cho stack đệ quy, merge sort/Timsort (sort mặc định của Python, Java cho object) O(n).
  3. HashSet → O(n) thời gian, O(n) bộ nhớ.
- **Mục tiêu:** nói được trade-off thời gian ↔ bộ nhớ giữa cách 2 và cách 3. Đây là thói quen phải có ở **mọi** bài: người phỏng vấn luôn hỏi "còn cách nào khác không?".

### 📘 Bài học buổi tối: Big-O và phân tích độ phức tạp

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Big-O là gì: tốc độ tăng theo n, bỏ hằng số và bậc thấp | 🔴 T1 | Giải thích được vì sao O(2n + 5) = O(n) | `Big O notation explained` |
| 2 | Best / Average / Worst case | 🔴 T1 | Cho được ví dụ: HashMap trung bình O(1), xấu nhất O(n); Quicksort trung bình O(n log n), xấu nhất O(n²) | `best average worst case complexity` |
| 3 | Big-O vs Big-Θ vs Big-Ω | 🟢 T3 | Chỉ cần biết tồn tại. Khi phỏng vấn, "Big-O" thường được hiểu là cận chặt | `big o vs big theta` |
| 4 | Các bậc phổ biến và ví dụ đại diện | 🔴 T1 | Mỗi bậc nêu được 1 thuật toán hoặc thao tác tiêu biểu (xem bảng bên dưới) | `common time complexities examples` |
| 5 | Quy tắc phân tích vòng lặp | 🔴 T1 | Tự phân tích được đoạn code bất kỳ (xem chi tiết) | `time complexity nested loops`, `loop halving log n` |
| 6 | Chi phí ẩn của hàm thư viện | 🔴 T1 | Biết `in` trên list là O(n), slice/copy là O(k), nối chuỗi trong vòng lặp có thể thành O(n²) | `hidden time complexity string concatenation` |
| 7 | Độ phức tạp bộ nhớ (space) | 🔴 T1 | Phân biệt bộ nhớ của input và bộ nhớ phụ. Biết stack của đệ quy cũng tốn bộ nhớ | `space complexity recursion call stack` |
| 8 | Phân tích hàm đệ quy bằng cây đệ quy | 🔴 T1 | Fibonacci đệ quy là O(2ⁿ), có memo thì còn O(n); merge sort là O(n log n) | `recursion tree time complexity` |
| 9 | Amortized (khấu hao) | 🔴 T1 | Giải thích được vì sao thêm phần tử vào dynamic array là O(1) amortized | `amortized analysis dynamic array` |
| 10 | Độ phức tạp thao tác của các cấu trúc dữ liệu cơ bản | 🔴 T1 | Thuộc bảng bên dưới | `data structure operations complexity cheat sheet` |
| 11 | Suy ra độ phức tạp cần đạt từ giới hạn input của đề | 🔴 T1 | n ≤ 10³ → O(n²) chấp nhận được; n ≤ 10⁵ → cần O(n log n); ~10⁸ phép tính ≈ 1 giây | `leetcode constraints time complexity` |
| 12 | Chứng minh hình thức (hằng số c, n₀), Master theorem | 🟢 T3 | Bỏ qua | — |
| 13 | **HashMap hoạt động bên trong**: hash(key) → bucket, xử lý collision (chaining / open addressing), load factor → resize + rehash | 🔴 T1 | Giải thích được vì sao trung bình O(1) nhưng xấu nhất O(n), và vì sao resize vẫn là O(1) amortized. Câu 4 Chốt tuần hỏi mục này | `how hashmap works internally`, `hash collision chaining open addressing`, `load factor rehashing` |

**Chi tiết cần hiểu**

- **Bảng các bậc (mục 4):**

  | Bậc | Ví dụ |
  |---|---|
  | O(1) | Truy cập `arr[i]`, tra HashMap |
  | O(log n) | Binary search, thao tác trên cây cân bằng |
  | O(n) | Duyệt mảng một lần |
  | O(n log n) | Sort (merge sort, timsort) |
  | O(n²) | Hai vòng lặp lồng nhau |
  | O(2ⁿ) | Sinh mọi tập con, Fibonacci đệ quy không memo |
  | O(n!) | Sinh mọi hoán vị |

- **Quy tắc phân tích (mục 5):**
  - Các đoạn chạy **nối tiếp nhau** thì **cộng**: O(n) + O(n) = O(n).
  - Các vòng **lồng nhau** thì **nhân**: O(n) · O(n) = O(n²).
  - Vòng lặp mà `i` nhân đôi hoặc chia đôi mỗi bước → O(log n).
  - Hai input khác nhau thì giữ **hai biến**: O(n + m) khác O(n · m). Đừng gộp thành n.
  - Vòng lặp trong có biên phụ thuộc vòng ngoài (`j` chạy từ `i` tới `n`) vẫn là O(n²), vì tổng là n(n−1)/2.
- **Bảng độ phức tạp thao tác (mục 10), cần thuộc:**

  | Cấu trúc | Truy cập | Tìm kiếm | Thêm | Xoá | Ghi chú |
  |---|---|---|---|---|---|
  | Array / Dynamic array | O(1) | O(n) | O(1)* ở cuối, O(n) ở giữa | O(1) ở cuối, O(n) ở giữa | *amortized |
  | Linked list | O(n) | O(n) | O(1) nếu đã có con trỏ | O(1) nếu đã có con trỏ | |
  | HashMap / HashSet | — | O(1) tb | O(1) tb | O(1) tb | xấu nhất O(n) |
  | Stack / Queue | — | — | O(1) | O(1) | |
  | Heap | O(1) xem min/max | O(n) | O(log n) | O(log n) pop | build heap O(n) |
  | BST cân bằng | — | O(log n) | O(log n) | O(log n) | giữ thứ tự |
  | Sorted array | O(1) | O(log n) | O(n) | O(n) | |

- **Space (mục 7):** Hàm DFS đệ quy sâu `h` tầng tốn O(h) bộ nhớ cho stack, dù bạn không tạo thêm biến nào. "In-place" nghĩa là bộ nhớ phụ O(1).
- **HashMap bên trong (mục 13):**
  - `index = hash(key) % số_bucket`. Tra cứu = tính hash O(1) + tìm trong bucket đó.
  - Hai key rơi vào cùng bucket là *collision*. *Chaining*: mỗi bucket là một danh sách. *Open addressing*: tìm ô trống kế tiếp.
  - Khi số phần tử / số bucket (*load factor*) vượt ngưỡng (Java 0.75), bảng tăng gấp đôi và rehash toàn bộ → một lần O(n), nhưng O(1) amortized (cùng lập luận với dynamic array).
  - Xấu nhất O(n): hàm hash kém hoặc bị tấn công khiến mọi key vào một bucket. Java 8+ đổi bucket dài thành cây đỏ-đen nên xấu nhất còn O(log n) (chỉ cần biết).
  - Key phải có hash **không đổi** trong lúc nằm trong map: đó là lý do key phải bất biến (sẽ gặp lại ở bài 49, D4).

**🔴 Thẻ Anki (T1)**

1. Vì sao O(2n + 100) được viết là O(n)?
2. Vòng lặp `while n > 1: n = n // 2` có độ phức tạp bao nhiêu? Vì sao?
3. HashMap tra cứu là O(1). Khi nào nó thành O(n)?
4. Vì sao `append` vào dynamic array là O(1) amortized?
5. Đề cho n ≤ 10⁵ thì thuật toán O(n²) có chạy kịp không?
6. Một hàm DFS đệ quy trên cây cao h tốn bao nhiêu bộ nhớ phụ?
7. HashMap xử lý collision thế nào? Load factor và resize ảnh hưởng gì tới độ phức tạp?

**🟢 Tra cứu (T3):** [bigocheatsheet.com](https://www.bigocheatsheet.com/), trang *TimeComplexity* trong docs của ngôn ngữ bạn dùng (ví dụ Python có `wiki.python.org/moin/TimeComplexity`).

**Tài liệu:**
- NeetCode: *Big-O Notation* (video trong khoá miễn phí *Algorithms & Data Structures for Beginners*)
- Chương "Big O" trong *Cracking the Coding Interview* (nếu có sách)

**❓ Câu hỏi cuối bài**

1. Vì sao dùng HashSet cho bài 217 là O(n), còn hai vòng lặp lồng nhau là O(n²)? Đổi lại bạn tốn thêm gì?
2. Binary search trên mảng 1 triệu phần tử cần tối đa khoảng bao nhiêu bước? Vì sao? (gợi ý: 2²⁰ ≈ 1 triệu)
3. Cách "sort rồi so sánh hai phần tử kề nhau" có độ phức tạp bao nhiêu? Khi nào nó tốt hơn HashSet? (gợi ý: khi bộ nhớ bị giới hạn)

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Đoạn code sau chạy với n = 10⁵. Nó có xong trong khoảng 1 giây không? Vì sao? Sửa thế nào?
   ```python
   seen = []
   for x in arr:
       if x not in seen:
           seen.append(x)
   ```
5. Vì sao `append` vào dynamic array là O(1) amortized dù thỉnh thoảng phải copy cả mảng? Nếu mỗi lần đầy chỉ tăng thêm 10 ô thay vì gấp đôi thì độ phức tạp thành bao nhiêu?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** HashSet tra/thêm O(1) trung bình × n phần tử = O(n); hai vòng lồng nhau so mọi cặp ≈ n²/2 = O(n²). Đổi lại tốn O(n) bộ nhớ phụ cho set. Xấu nhất (collision nhiều) HashSet vẫn có thể suy biến.
- **Câu 2:** Mỗi bước loại một nửa → số bước ≈ log₂(10⁶) ≈ 20, vì 2²⁰ ≈ 1 triệu.
- **Câu 3:** O(n log n) thời gian, bộ nhớ phụ O(1)–O(log n) nếu sort tại chỗ. Tốt hơn khi bộ nhớ hạn chế, hoặc mảng đã sort sẵn, hoặc sau đó còn cần dữ liệu có thứ tự. Nhược điểm: làm thay đổi input.
- **Câu 4:** `x not in seen` trên **list** là O(n) → tổng O(n²) ≈ 10¹⁰ phép tính, vượt xa ~10⁸/giây → không kịp. Sửa: dùng set cho `seen` → O(n). Đây là "chi phí ẩn của hàm thư viện".
- **Câu 5:** Gấp đôi thì tổng chi phí copy sau n lần append ≈ 1 + 2 + 4 + … + n < 2n → trung bình O(1) mỗi lần. Tăng cố định +10 thì phải copy n/10 lần, mỗi lần O(n) → tổng O(n²), trung bình O(n) mỗi lần append.

</details>

---

## D2 (T3, 29/09): 4 tính chất OOP

**⏱ Ước tính:** Giờ làm 35' (DSA 25' + Anki 10') · Tối 80' (Học 35' + Bảng T2 15' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 1h55'**

### 🧩 DSA: [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/)

- **Pattern (🔴 T1):** *Đếm tần suất (Counting)*. Hai chuỗi là anagram khi số lần xuất hiện của từng ký tự giống nhau. Dùng HashMap, hoặc mảng 26 phần tử nếu chỉ có chữ thường a–z.
- **Các cách:**
  - Sort cả hai chuỗi rồi so sánh → O(n log n).
  - Đếm tần suất → O(n) thời gian, O(1) bộ nhớ (vì chỉ có 26 ký tự).
- **Câu hỏi mở rộng hay gặp:** nếu input chứa ký tự Unicode thì sao? (Dùng HashMap thay mảng 26.)

### 📘 Bài học buổi tối: OOP (Encapsulation, Abstraction, Inheritance, Polymorphism)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Class vs Object, state vs behavior | 🔴 T1 | Nói được bằng một câu | `class vs object` |
| 2 | **Encapsulation**: ẩn state, chỉ cho sửa qua method có kiểm soát, bảo vệ *invariant* | 🔴 T1 | Giải thích được "invariant" qua ví dụ số dư tài khoản không được âm | `encapsulation invariant example` |
| 3 | **Abstraction**: chỉ đưa ra "làm gì", giấu "làm thế nào" | 🔴 T1 | Phân biệt được với Encapsulation (xem bên dưới) | `abstraction vs encapsulation` |
| 4 | **Inheritance**: is-a, override, gọi `super` | 🔴 T1 | Biết mục đích và rủi ro (rủi ro sẽ học kỹ ở D3) | `inheritance override super` |
| 5 | **Polymorphism**: subtype/runtime (dynamic dispatch), overloading (compile-time), duck typing | 🔴 T1 | Cho được ví dụ loại runtime bằng ngôn ngữ bạn dùng | `runtime vs compile time polymorphism`, `duck typing` |
| 6 | **Interface vs Abstract class** | 🟡 T2 | Điền bảng so sánh bên dưới | `interface vs abstract class when to use` |
| 7 | Tell, Don't Ask | 🔴 T1 | Hiểu vì sao `order.cancel()` tốt hơn `if order.status == ...: order.status = ...` | `tell don't ask principle` |
| 8 | Cơ chế OOP riêng của ngôn ngữ (prototype trong JS, Python không có private thật, Go không có kế thừa) | 🟢 T3 | Tra khi cần | docs ngôn ngữ |
| 9 | Cú pháp `private` / `protected` / `public` | 🟢 T3 | Tra khi cần | docs ngôn ngữ |

**Chi tiết cần hiểu**

- **Encapsulation khác Abstraction:**
  - Encapsulation trả lời *"ai được phép chạm vào dữ liệu?"*. Nó bảo vệ trạng thái bên trong.
  - Abstraction trả lời *"người dùng cần biết những gì?"*. Nó đơn giản hoá giao diện bên ngoài.
  - Ví dụ: `PaymentGateway.charge(amount)` là abstraction. Việc giấu biến `apiKey` và bộ đếm retry bên trong là encapsulation.
- **Polymorphism runtime:** gọi `shape.area()` mà không cần biết `shape` là `Circle` hay `Square`. Code gọi không phải sửa khi thêm hình mới. Đây là nền tảng của OCP (sẽ học ở D4).
- **Dấu hiệu phá vỡ encapsulation:** có getter/setter cho mọi field; logic nghiệp vụ nằm ở nơi *gọi* (service) chứ không nằm trong object. Hiện tượng này gọi là *anemic model*, bạn chỉ cần biết tên.

**🟡 Bảng so sánh T2: Interface vs Abstract class**

Nhóm: *cơ chế trừu tượng trong ngôn ngữ*. Trục chính của cuộc so sánh: **mức ràng buộc** vs **tái sử dụng code**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | Interface | Abstract class |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Chứa được state/implementation? | | |
| Ext: Một class implement/kế thừa được mấy cái? | | |

**🔴 Thẻ Anki (T1)**

1. Encapsulation khác Abstraction ở điểm nào? Cho một ví dụ có cả hai.
2. "Invariant" là gì? Encapsulation bảo vệ invariant như thế nào?
3. Runtime polymorphism giúp code mở rộng mà không phải sửa như thế nào?
4. Tell, Don't Ask nghĩa là gì?

**❓ Câu hỏi cuối bài**

1. Encapsulation khác Abstraction ở đâu? Cho ví dụ trong code bạn đang làm.
2. Polymorphism lúc chạy (overriding) khác lúc biên dịch (overloading) thế nào?
3. Vì sao để field `public` rồi ai cũng gán giá trị tuỳ ý là phá vỡ encapsulation?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Trong `OrderService` có đoạn: `if order.status == "PAID" and order.shipped_at is None: order.status = "CANCELLED"; order.refund_amount = order.total`. Đoạn này vi phạm nguyên lý nào? Nếu có thêm 3 nơi khác cũng huỷ đơn thì rủi ro gì? Bạn sửa thế nào?
5. Hệ thống đang tính tổng diện tích một danh sách `Circle`, `Square`. Cần thêm `Triangle`. Với runtime polymorphism, những file nào phải sửa, file nào không? Nếu code đang viết `if shape.type == "circle": ... elif ...` thì khác gì?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Encapsulation = ai được chạm vào state, bảo vệ invariant bên trong. Abstraction = giao diện bên ngoài chỉ nói "làm gì". Ví dụ phải có cả hai trong một class thật (method public đơn giản + field private).
- **Câu 2:** Overriding: lớp con định nghĩa lại method, chọn implementation **lúc chạy** theo kiểu thật của object (dynamic dispatch). Overloading: cùng tên khác tham số, chọn **lúc biên dịch** theo kiểu khai báo. Chỉ overriding giúp mở rộng mà không sửa code gọi.
- **Câu 3:** Không còn chỗ nào kiểm tra invariant (số dư có thể âm, status nhảy lung tung); logic kiểm tra phải lặp ở mọi nơi gán; đổi kiểu/cấu trúc field thì mọi nơi dùng phải sửa.
- **Câu 4:** Vi phạm Tell, Don't Ask và encapsulation (anemic model): quy tắc huỷ nằm ngoài object. 4 nơi copy thì dễ lệch nhau (một nơi quên hoàn tiền). Sửa: `order.cancel()` tự kiểm tra điều kiện, đổi status, tính refund; field không cho gán tự do.
- **Câu 5:** Chỉ **thêm** class `Triangle` implement `area()`; hàm tính tổng không sửa (OCP). Với `if type ==` thì mọi hàm rẽ nhánh theo loại đều phải sửa, dễ sót.

</details>

---

## D3 (T4, 30/09): Composition vs Inheritance

**⏱ Ước tính:** Giờ làm 35' (DSA 25' + Anki 10') · Tối 60' (Học 30' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 1h35'**

### 🧩 DSA: [1. Two Sum](https://leetcode.com/problems/two-sum/)

- **Pattern (🔴 T1):** *Hashing tìm phần bù*. Với mỗi `x`, hỏi xem `target − x` đã xuất hiện trước đó chưa. Lưu `giá trị → index` vào HashMap.
- **Các cách:**
  - Brute force → O(n²).
  - Một lần duyệt với HashMap → O(n) thời gian, O(n) bộ nhớ.
  - Nếu mảng **đã được sort**, dùng Two Pointers → O(n) thời gian, O(1) bộ nhớ (sẽ gặp ở bài 167, Tuần 2).
- **Lưu ý:** kiểm tra phần bù **trước**, rồi mới thêm phần tử hiện tại vào map. Làm ngược lại sẽ ghép một phần tử với chính nó.

### 📘 Bài học buổi tối: Composition vs Inheritance

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | "is-a" vs "has-a" | 🔴 T1 | Phân loại đúng được 5 ví dụ tự nghĩ ra | `is-a vs has-a relationship` |
| 2 | Các vấn đề của kế thừa: *fragile base class*, coupling chặt với lớp cha, bùng nổ số class, cây kế thừa quá sâu | 🔴 T1 | Kể được 3 vấn đề, mỗi vấn đề một ví dụ | `fragile base class problem`, `class explosion inheritance` |
| 3 | Composition + delegation | 🔴 T1 | Tự viết lại được ví dụ Duck bằng composition | `composition over inheritance example` |
| 4 | "Favor composition over inheritance" (GoF): khi nào **vẫn nên** kế thừa | 🔴 T1 | Nêu được điều kiện: quan hệ is-a thật sự ổn định, lớp con không phá hợp đồng của lớp cha (LSP), cây kế thừa nông | `when to use inheritance` |
| 5 | Mixin / Trait | 🟢 T3 | Chỉ cần biết tồn tại | `mixin vs inheritance` |

**Chi tiết cần hiểu**

- **Fragile base class:** lớp cha thay đổi một method nội bộ, và vô tình làm hỏng lớp con đang override method đó. Ví dụ kinh điển: `InstrumentedHashSet` trong *Effective Java*, Item 18.
- **Bùng nổ số class:** muốn kết hợp nhiều khả năng như `FlyingDuck`, `SwimmingDuck`, `FlyingSwimmingQuackingDuck`... Với 3 khả năng độc lập, dùng kế thừa có thể cần tới 2³ class. Dùng composition chỉ cần 3 behavior có thể cắm vào.
- **Composition:** object *chứa* một behavior (`flyBehavior`) và *uỷ quyền* việc bay cho nó. Có thể đổi behavior lúc chạy. Đây chính là Strategy pattern, sẽ học ở Tuần 3.

**🔴 Thẻ Anki (T1)**

1. Fragile base class là gì?
2. Vì sao composition giải quyết được bài toán bùng nổ số class?
3. Nêu 3 điều kiện để kế thừa vẫn là lựa chọn hợp lý.

**❓ Câu hỏi cuối bài**

1. Phân biệt "is-a" và "has-a".
2. Nêu một tình huống kế thừa gây rắc rối (lớp cha thay đổi làm vỡ lớp con, hoặc số class bùng nổ).
3. Viết lại ví dụ `Duck` (vịt biết bay / vịt gỗ không bay) bằng composition.

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Java có `class Stack extends Vector`, nên một `Stack` vẫn gọi được `insertElementAt(x, 0)` để chèn vào giữa. Đây là thiết kế tốt hay xấu? Vì sao? Nêu một tình huống mà kế thừa **vẫn** là lựa chọn đúng.

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** is-a: lớp con là một loại của lớp cha và dùng được ở mọi nơi lớp cha được dùng. has-a: object chứa/dùng object khác. Mẹo: nếu chỉ muốn **tái sử dụng code** chứ không phải "là một loại" thì đó là has-a.
- **Câu 2:** Fragile base class (lớp cha đổi method nội bộ, lớp con override bị sai, ví dụ `InstrumentedHashSet` đếm gấp đôi); hoặc bùng nổ class khi tổ hợp nhiều khả năng (2³ class cho 3 khả năng).
- **Câu 3:** `Duck` giữ `flyBehavior: FlyBehavior` (interface) + các implementation `FlyWithWings`, `NoFly`; `duck.fly()` uỷ quyền cho behavior; đổi được behavior lúc chạy; thêm khả năng mới không tạo thêm subclass Duck.
- **Câu 4:** Xấu: Stack không thật sự "là" Vector về hành vi; kế thừa làm lộ các method phá bất biến LIFO (vi phạm encapsulation, LSP). Nên dùng composition (Stack chứa một list bên trong). Kế thừa đúng khi: is-a ổn định, lớp con giữ hợp đồng lớp cha, cây nông, hoặc framework thiết kế để kế thừa (template method, base exception).

</details>

---

## D4 (T5, 01/10): SOLID, phần S và O

**⏱ Ước tính:** Giờ làm 55' (DSA 45' + Anki 10') · Tối 70' (Học 40' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 2h05'**

### 🧩 DSA: [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/)

- **Pattern (🔴 T1):** *Hashing theo khoá chuẩn hoá*. Biến mỗi phần tử thành một "khoá đại diện" để gom nhóm.
- **Hai cách chọn khoá:**
  - Chuỗi đã sort → O(n · k log k), với k là độ dài chuỗi.
  - Tuple đếm 26 ký tự → O(n · k).
- **Mục tiêu:** giải thích được vì sao cách đếm nhanh hơn, và vì sao khoá phải là kiểu dữ liệu hash được (tuple hoặc string, không phải list).

### 📘 Bài học buổi tối: SRP & OCP

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **SRP**: "một class chỉ có một lý do để thay đổi" (theo *actor*, tức nhóm người yêu cầu thay đổi) | 🔴 T1 | Giải thích được theo nghĩa "actor", không phải "chỉ làm một việc" | `single responsibility principle actor uncle bob` |
| 2 | Dấu hiệu vi phạm SRP | 🔴 T1 | Nhận diện được trong code thật | `god class code smell` |
| 3 | **OCP**: mở để mở rộng, đóng để sửa đổi, thực hiện qua abstraction + polymorphism | 🔴 T1 | Biến được một `switch` theo loại thành interface + các implementation | `open closed principle example switch` |
| 4 | Liên hệ OCP với Strategy và Factory | 🔴 T1 | Biết OCP là "tại sao", còn Strategy/Factory là "làm thế nào" | `open closed principle strategy pattern` |
| 5 | Không áp dụng quá tay: YAGNI, rule of three | 🔴 T1 | Chỉ trừu tượng hoá khi biến thể thứ 2 hoặc thứ 3 thực sự xuất hiện | `YAGNI over engineering SOLID` |

**Chi tiết cần hiểu**

- **Dấu hiệu vi phạm SRP:**
  - Class dài hàng trăm dòng.
  - Tên class chứa `Manager` / `Helper` / `Util` hoặc chữ "And".
  - Một file bị sửa bởi nhiều nhóm người vì nhiều lý do khác nhau (kế toán muốn đổi cách tính thuế, vận hành muốn đổi định dạng email).
  - Unit test phải mock quá nhiều thứ.
- **Ví dụ OCP:** `if method == "momo": ... elif method == "vnpay": ...` → interface `PaymentMethod.pay()`. Thêm ZaloPay chỉ cần **thêm** một class mới, không sửa code cũ.

**🔴 Thẻ Anki (T1)**

1. SRP định nghĩa theo "actor" nghĩa là gì?
2. Kể 3 dấu hiệu một class vi phạm SRP.
3. Làm sao biến một chuỗi `if/else` theo loại thành thiết kế tuân thủ OCP?
4. Khi nào **không nên** áp dụng OCP?

**❓ Câu hỏi cuối bài**

1. Chỉ ra một class trong project thật đang vi phạm SRP. Bạn sẽ tách nó thế nào?
2. Cần thêm một phương thức thanh toán mới mà **không sửa code cũ**. Bạn thiết kế thế nào?
3. SRP có nghĩa là "mỗi class chỉ có một method" không?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Code hiện chỉ có 2 phương thức thanh toán, sửa lần cuối cách đây 1 năm. PM nói "sau này có thể thêm". Bạn có dựng ngay interface + factory + registry không? Lập luận thế nào, và khi nào bạn đổi ý?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Chỉ ra class cụ thể + **các actor khác nhau** khiến nó thay đổi (kế toán, vận hành, marketing...). Tách theo actor (ví dụ `PricingPolicy`, `InvoiceRenderer`, `Notifier`), không tách vụn theo từng hàm.
- **Câu 2:** Interface `PaymentMethod.pay()` + mỗi phương thức một class; code gọi chỉ biết interface; việc chọn implementation gom về một chỗ (factory/registry ở composition root). Thêm phương thức mới = thêm class + đăng ký.
- **Câu 3:** Không. SRP = một **lý do để thay đổi** (một actor). Một class có nhiều method vẫn đúng SRP nếu mọi method phục vụ cùng một actor/mục đích.
- **Câu 4:** Chưa nên (YAGNI, rule of three): abstraction sớm tốn công và có thể đoán sai hướng thay đổi. `if/else` 2 nhánh vẫn dễ đọc. Đổi ý khi biến thể thứ 3 thực sự xuất hiện, hoặc cùng một `if` theo loại bắt đầu lặp ở nhiều nơi.

</details>

---

## D5 (T6, 02/10): SOLID, phần L, I, D

**⏱ Ước tính:** Giờ làm 60' (DSA 50' + Anki 10') · Tối 80' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h20'**

### 🧩 DSA: [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

- **Pattern (🔴 T1):** *Đếm tần suất + chọn Top-K*.
- **Các cách:**
  - Sort theo tần suất → O(n log n).
  - Min-heap giữ k phần tử → O(n log k).
  - Bucket sort theo tần suất (index = số lần xuất hiện) → O(n).
- **🟡 T2:** so sánh Heap và Bucket cho bài Top-K. Bucket dùng được vì tần suất luôn ≤ n, nhưng cần biết **toàn bộ** dữ liệu trước và tốn O(n) bucket. Heap giữ đúng k phần tử (O(k) bộ nhớ ngoài bảng đếm), nên hợp với dữ liệu đến dạng stream hoặc khi k ≪ n.

### 📘 Bài học buổi tối: LSP, ISP, DIP

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **LSP**: lớp con thay thế được lớp cha mà không làm sai hành vi | 🔴 T1 | Giải thích được ví dụ Rectangle–Square và "hợp đồng" (contract) | `liskov substitution rectangle square` |
| 2 | Dấu hiệu vi phạm LSP | 🔴 T1 | Nhận diện được trong code | `LSP violation examples` |
| 3 | **ISP**: tách interface theo nhu cầu của từng client | 🔴 T1 | Tách được một interface quá lớn thành nhiều interface nhỏ | `interface segregation principle example` |
| 4 | **DIP**: module cấp cao và cấp thấp đều phụ thuộc vào abstraction; module cấp cao *sở hữu* interface | 🔴 T1 | Vẽ được mũi tên phụ thuộc trước và sau khi áp dụng DIP | `dependency inversion principle diagram` |
| 5 | Phân biệt **DIP / DI / IoC** | 🔴 T1 | Phân biệt được: DIP là nguyên lý thiết kế, DI là kỹ thuật truyền dependency vào, IoC là nguyên lý đảo quyền điều khiển (framework gọi code của bạn) | `DIP vs DI vs IoC` |

**Chi tiết cần hiểu**

- **Rectangle–Square:** `Square` kế thừa `Rectangle`. Khi gọi `setWidth(5)` thì chiều cao của Square cũng đổi theo. Code đang dùng `Rectangle` và mong đợi diện tích = 5 × chiều cao cũ sẽ bị sai. Kết luận: về toán học Square "là" Rectangle, nhưng về *hành vi* thì không.
- **Hợp đồng của lớp con:** không được đòi hỏi điều kiện đầu vào khắt khe hơn lớp cha, và không được đảm bảo kết quả kém hơn lớp cha.
- **Dấu hiệu vi phạm LSP:**
  - Lớp con override method rồi `throw NotImplemented`.
  - Code gọi phải kiểm tra `if isinstance(x, Square)`.
- **DIP bằng ví dụ:**
  - Trước: `OrderService` → `MySQLOrderRepo` (phụ thuộc thẳng vào lớp cụ thể).
  - Sau: `OrderService` → `OrderRepository` (interface) ← `MySQLOrderRepo`.
  - Interface nằm cùng tầng với `OrderService`.

**🔴 Thẻ Anki (T1)**

1. Vì sao Square kế thừa Rectangle lại vi phạm LSP?
2. Kể 2 dấu hiệu vi phạm LSP trong code.
3. ISP giúp gì cho các class implement interface?
4. Phân biệt DIP, DI và IoC mỗi cái bằng một câu.

**❓ Câu hỏi cuối bài**

1. Ví dụ Rectangle–Square vi phạm LSP ở chỗ nào?
2. DIP (nguyên lý) khác Dependency Injection (kỹ thuật) thế nào?
3. Một interface quá lớn (fat interface) gây hại gì cho các class implement nó?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. `OrderService` (package `domain`) đang gọi thẳng `MySQLOrderRepo` (package `infrastructure`). Sau khi áp dụng DIP, interface `OrderRepository` nên nằm ở package nào? Mũi tên phụ thuộc đổi ra sao? Nếu đặt interface trong `infrastructure` thì mất gì?
5. Class `Bird` có `fly()`. Bạn thêm `Penguin extends Bird` và override `fly()` để ném `UnsupportedOperationException`. Code gọi sẽ phải thay đổi thế nào? Đây là vi phạm gì, và bạn sửa thiết kế ra sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** `setWidth` của Square đổi luôn chiều cao → code viết cho Rectangle (giả định width và height độc lập) cho kết quả sai. Square là Rectangle về toán, nhưng không giữ được **hợp đồng hành vi** của Rectangle.
- **Câu 2:** DIP là nguyên lý: module cấp cao không phụ thuộc cấp thấp, cả hai phụ thuộc abstraction. DI là kỹ thuật: dependency được truyền vào (qua constructor...) thay vì tự `new`. Có thể dùng DI mà vẫn vi phạm DIP (inject class cụ thể).
- **Câu 3:** Class phải implement method không dùng (để trống hoặc ném lỗi, dễ dẫn tới vi phạm LSP); đổi một method không liên quan cũng buộc mọi class phải sửa/biên dịch lại; client phụ thuộc vào thứ nó không cần.
- **Câu 4:** Interface đặt cùng tầng với `OrderService` (domain sở hữu interface). Mũi tên đổi thành `infrastructure → domain`. Đặt ở `infrastructure` thì domain vẫn import infrastructure: chỉ có DI, chưa đảo phụ thuộc.
- **Câu 5:** Code gọi phải `try/catch` hoặc `if isinstance(bird, Penguin)` → vi phạm LSP (lớp con không thay thế được lớp cha). Sửa: tách khả năng ra interface riêng (`Flyable`), chỉ loài biết bay mới implement (cũng là ISP).

</details>

---

## D6 (T7, 03/10): Lab

**⏱ Ước tính:** DSA 45' · Lab 2h30' · Ôn ⚠️ 30' · **Tổng 3h45'**

### 🧩 DSA: [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)

- **Pattern (🔴 T1):** *Prefix / Suffix*. Kết quả tại vị trí i bằng (tích các phần tử bên trái i) × (tích các phần tử bên phải i).
- **Mục tiêu:** O(n) thời gian, không dùng phép chia. Bộ nhớ phụ O(1) nếu không tính mảng output.
- Sau đó làm lại 1 bài sai trong tuần (nếu có).

### 🛠 Lab (3h)

**Bước 1: Chuẩn bị (30')**
- Tạo repo `interview-prep/` gồm `dsa/`, `notes/`, `project/`.
- Tạo `notes/error-list.md`, `notes/tradeoff-cheatsheet.md`, `notes/snippets.md`.
- Tạo Anki deck với 2 loại thẻ: **T1** (câu hỏi → giải thích) và **DSA-Pattern** (dấu hiệu đề bài → tên pattern + ý tưởng chính). Nhập các thẻ D1–D5.

**Bước 2: Refactor theo SOLID (2h)**
- Chọn một đoạn code thật ở công ty. Nếu không tiện, dùng đoạn mẫu dưới đây và viết lại bằng ngôn ngữ bạn dùng:

```python
class OrderService:
    def place_order(self, user, items, payment_method):
        if not items:                          # validate
            raise ValueError("empty")
        total = sum(i.price * i.qty for i in items)
        if user.is_vip:                         # tính giá
            total *= 0.9
        db = MySQLConnection("prod-db")         # phụ thuộc cứng vào lớp cụ thể
        order_id = db.insert("orders", {...})
        if payment_method == "momo":            # switch theo loại
            MomoClient().pay(total)
        elif payment_method == "vnpay":
            VnpayClient().pay(total)
        smtp = SmtpClient()                     # gửi email ngay trong service
        smtp.send(user.email, f"Order {order_id} placed")
        return order_id
```

- **Yêu cầu:**
  1. Liệt kê các vi phạm (gợi ý: có ít nhất 4 vi phạm SRP/OCP/DIP).
  2. Refactor: tách `PricingPolicy`, `PaymentMethod` (interface + 2 implementation), `OrderRepository`, `Notifier`; inject qua constructor.
  3. Viết một unit test cho `place_order` dùng fake repository và fake payment.
- Viết `notes/solid-refactor.md` theo 3 phần: **Trước → Vi phạm → Sau → Lợi ích**. Bạn sẽ dùng lại file này làm câu chuyện khi phỏng vấn.

**Bước 3 (30'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D7 (CN, 04/10): Chốt tuần 1

**⏱ Ước tính:** DSA 40' (làm lại 49, 347) · Làm lại 3 bài Easy 30' · Chốt tuần 60' · Anki/cheat sheet 30' · **Tổng 2h40'**

**DSA:** Làm lại 1 bài sai, hoặc tự giải lại bài 49 và 347 trong ≤ 20' mỗi bài, không xem lời giải.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Giải thích 4 tính chất OOP trong 2 phút, mỗi tính chất một ví dụ.
2. Khi nào **vẫn nên** dùng kế thừa?
3. Mở một file code thật và chỉ ra 2 chỗ vi phạm SOLID.
4. HashMap hoạt động bên trong thế nào (hash, bucket, collision)? Vì sao tra cứu trung bình O(1) nhưng xấu nhất O(n)?
   - *Mục này thuộc 🔴 T1, đã học ở D1 (mục 13). Từ khoá research: `how hashmap works internally`, `hash collision chaining open addressing`.*
5. Big-O của cách bạn giải Group Anagrams là bao nhiêu? Có cách nào tốt hơn không?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Encapsulation (ẩn state, bảo vệ invariant: số dư không âm) · Abstraction (chỉ đưa ra "làm gì": `PaymentGateway.charge`) · Inheritance (is-a, tái sử dụng, kèm rủi ro coupling) · Polymorphism (gọi qua interface, chọn implementation lúc chạy: `shape.area()`).
- **Câu 2:** Quan hệ is-a thật và ổn định; lớp con giữ hợp đồng của lớp cha (LSP); cây nông; hoặc framework được thiết kế để kế thừa. Còn lại ưu tiên composition.
- **Câu 3:** Chỉ đúng tên nguyên lý + giải thích vì sao vi phạm (bao nhiêu actor, `switch` theo loại, `new` class cụ thể...) + đề xuất sửa cụ thể + nói trade-off (có đáng sửa bây giờ không).
- **Câu 4:** hash(key) % số bucket → tìm trong bucket; collision xử lý bằng chaining hoặc open addressing; vượt load factor thì resize + rehash (O(1) amortized); xấu nhất O(n) khi mọi key rơi vào một bucket (Java 8+ còn O(log n) nhờ treeify).
- **Câu 5:** Khoá sort: O(n · k log k); khoá đếm 26 ký tự: O(n · k); bộ nhớ O(n · k). Cách đếm tốt hơn khi chuỗi dài; khoá phải là kiểu bất biến, hash được (tuple/string).

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] File `notes/solid-refactor.md` hoàn thành
- [ ] Tự giải lại 5 bài DSA của tuần không xem lời giải
- [ ] Anki: đã nhập đủ thẻ T1 của D1–D5 + thẻ pattern Hashing / Counting / Prefix-Suffix
- [ ] Cheat sheet: đã điền bảng Interface vs Abstract class

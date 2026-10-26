# D1: Big-O và HashMap bên trong (tổng hợp)

← [Tuần 1](../100-ngay/tuan-01.md) · Phạm vi: mục #1 đến #13 của D1 (bỏ #12, thuộc T3)

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python; các khác biệt của **TypeScript/JavaScript** nằm trong khối 🟦 cuối mục liên quan (6.4, 7.3, 9.3, 10.1, 12.8). Số đo trong khối 🟦 lấy từ Node 20.
> Nhãn: 🔴 T1 = nhớ và dạy lại được · 🟡 T2 = hiểu, nhớ tiêu chí chọn · 🟢 T3 = biết để tra khi cần · 📎 = đọc thêm

---

## Mục lục

1. [Big-O là gì](#1-big-o-là-gì) · 🔴 T1
2. [Best / Average / Worst case](#2-best--average--worst-case) · 🔴 T1
3. [Big-O vs Big-Θ vs Big-Ω](#3-big-o-vs-big-θ-vs-big-ω) · 🟢 T3
4. [Các bậc phổ biến](#4-các-bậc-phổ-biến) · 🔴 T1
5. [Quy tắc phân tích vòng lặp](#5-quy-tắc-phân-tích-vòng-lặp) · 🔴 T1
6. [Chi phí ẩn của hàm thư viện](#6-chi-phí-ẩn-của-hàm-thư-viện) · 🔴 T1
7. [Space complexity và call stack](#7-space-complexity-và-call-stack) · 🔴 T1
8. [Cây đệ quy (recursion tree)](#8-cây-đệ-quy-recursion-tree) · 🔴 T1
9. [Amortized (khấu hao)](#9-amortized-khấu-hao) · 🔴 T1
10. [Độ phức tạp của các cấu trúc dữ liệu](#10-độ-phức-tạp-của-các-cấu-trúc-dữ-liệu) · 🔴 T1
11. [Cấu trúc dữ liệu nằm trong bộ nhớ thế nào](#11-cấu-trúc-dữ-liệu-nằm-trong-bộ-nhớ-thế-nào) · 🔴 T1 · nền tảng cho mục 10
12. [HashMap bên trong](#12-hashmap-bên-trong) · 🔴 T1
13. [Sharding: thêm server với hash](#13-sharding-thêm-server-với-hash) · 📎 Mở rộng (ngoài bảng roadmap)
14. [Khung phân tích dùng cho mọi đoạn code](#14-khung-phân-tích-dùng-cho-mọi-đoạn-code) · 🔴 T1 · khung tổng hợp
15. [Thẻ Anki T1 kèm đáp án](#15-thẻ-anki-t1-kèm-đáp-án) · 🔴 T1
16. [Câu hỏi cuối bài](#16-câu-hỏi-cuối-bài) · đáp án mẫu

---

## 1. Big-O là gì

> 🔴 T1

🇬🇧 **Big O describes how the running time (or memory) grows when the input size n grows.** It does not measure seconds.

🇻🇳 Big O đo **tốc độ tăng** của khối lượng công việc theo n, không đo số giây. Số giây phụ thuộc máy, còn tốc độ tăng thì không.

**Hai quy tắc rút gọn:**

| Quy tắc | Ví dụ | Lý do |
|---|---|---|
| Bỏ hằng số | O(2n) = O(n) | hệ số chỉ làm đường dốc hơn, không đổi **dạng** |
| Bỏ bậc thấp | O(n² + n + 100) = O(n²) | khi n lớn, số hạng lớn nhất chiếm gần 100% |

**⭐ Vì sao O(2n + 5) = O(n):** số 5 là chi phí cố định, không tăng theo n nên bị bỏ. Hệ số 2 không làm thay đổi dạng tuyến tính (n gấp đôi thì 2n cũng chỉ gấp đôi). Còn lại O(n).

⚠️ "Bỏ hằng số" **không** có nghĩa là 2n và n chạy nhanh như nhau. Chúng chỉ **cùng nhóm**.

---

## 2. Best / Average / Worst case

> 🔴 T1

🇬🇧 **The same algorithm can take different numbers of steps on different inputs of the same size.**

| Case | Ý nghĩa | Khi nào quan tâm |
|---|---|---|
| Best | input may mắn nhất | gần như không bao giờ |
| Average | input thông thường, **cần giả định phân bố** | hiệu năng hằng ngày |
| Worst | input xui nhất | **cam kết** (SLA, timeout). Mặc định khi không ghi rõ |

**Hai ví dụ phải thuộc:**

| | Average | Worst | Vì sao worst |
|---|---|---|---|
| HashMap get/put | O(1) | O(n) (Java 8+: O(log n)) | mọi key dồn vào một bucket (hash tồi, hash flooding) |
| Quicksort | O(n log n) | O(n²) | pivot luôn là min/max (ví dụ mảng đã sort mà lấy pivot đầu). Mỗi tầng chỉ bớt 1 phần tử → dạng tam giác |

Cách tránh worst case của quicksort: random pivot, median-of-three, hoặc thuật toán lai (Introsort).

🏗️ **Production:** average ≈ p50, worst ≈ p99. Input do người ngoài kiểm soát thì giả định worst case sẽ xảy ra.

---

## 3. Big-O vs Big-Θ vs Big-Ω

> 🟢 T3

| Ký hiệu | Nghĩa | Giống dấu |
|---|---|---|
| O | cận trên: tăng **không nhanh hơn** | ≤ |
| Ω | cận dưới: tăng **ít nhất bằng** | ≥ |
| Θ | cận chặt: vừa O vừa Ω | = |

- `2n + 5` là O(n), cũng là O(n²) (đúng nhưng lỏng), và là **Θ(n)**.
- ⚠️ **Case và ký hiệu là hai trục độc lập.** "O = worst, Ω = best" là **sai**.
- Merge sort là Θ(n log n) ở mọi case. Quicksort không có Θ chung (trần n², sàn n log n).
- 🏗️ Đi làm và phỏng vấn: nói "Big O" nhưng luôn đưa **cận chặt nhất**, mặc định cho worst case.

---

## 4. Các bậc phổ biến

> 🔴 T1

Giả định máy chạy ~10⁸ phép tính/giây:

| Bậc | Dấu hiệu trong code | Ví dụ | n = 10⁵ |
|---|---|---|---|
| O(1) | không lặp theo n | `arr[i]`, `d[key]`, `append` | tức thì |
| O(log n) | `i *= 2`, `n //= 2`, chia đôi khoảng | binary search, heap push/pop, B-tree index | tức thì |
| O(n) | 1 vòng qua dữ liệu | duyệt mảng, `x in list` | tức thì |
| O(n log n) | sort, chia đôi + merge | `sorted()`, merge sort | ~1.7×10⁶, < 1s |
| O(n²) | 2 vòng lồng, `in list` trong vòng lặp | bubble sort, so từng cặp | 10¹⁰, ~100s ❌ |
| O(2ⁿ) | đệ quy 2 nhánh, giảm 1 mỗi tầng | subsets, fib không memo | ☠️ |
| O(n!) | thử mọi thứ tự | permutations, TSP brute force | ☠️ |

**Hai input khác nhau thì giữ hai biến:** O(n + m) khác O(n · m). Đừng gộp thành n.

---

## 5. Quy tắc phân tích vòng lặp

> 🔴 T1

### 5.1 Năm quy tắc

1. Nối tiếp thì **cộng**: O(n) + O(n) = O(n).
2. Lồng nhau thì **nhân**: O(n) · O(n) = O(n²).
3. Biến **nhân/chia** cho hằng số → O(log n). Sau k bước `i = 2ᵏ`, dừng khi `2ᵏ ≥ n` nên k = log₂ n. Cơ số không quan trọng.
4. Hai input khác nhau → giữ hai biến.
5. Biên vòng trong phụ thuộc vòng ngoài → phải **cộng từng lượt** (ví dụ `range(i, n)` là n(n+1)/2 → O(n²)).

### 5.2 ⭐ Khi nào nhân, khi nào cộng

**Sự thật gốc:** tổng luôn là **cộng** việc của vòng trong qua từng lượt. Nhân chỉ là trường hợp đặc biệt khi mọi số hạng bằng nhau.

**Câu hỏi phản xạ:** *biên vòng trong có chứa biến của vòng ngoài không?*

```
Không có i  → các số hạng bằng nhau → NHÂN
Có i        → nhìn biến ngoài thay đổi kiểu gì:
   i += 1 (đều)                    → NHÂN với số hạng lớn nhất (tam giác vẫn ra cùng kết quả)
   i *= k / i //= k, trong ~ log i → NHÂN
   i *= k / i //= k, trong ~ i     → ⚠️ NGOẠI LỆ: dãy cấp số nhân, số hạng lớn nhất thắng
```

**Ba dạng dãy:**

| Dãy | Tổng | Ví dụ |
|---|---|---|
| Tăng/giảm đều: 1 + 2 + … + n | ≈ ½n² | `for j in range(i)` với `i += 1` |
| Cấp số nhân: n + n/2 + n/4 + … | ≈ 2n (số hạng lớn nhất thắng) | `for j in range(i)` với `i //= 2` → **O(n)** |
| Tăng chậm: log 1 + … + log n | ≈ n log n | `while j < i: j *= 2` trong `for i` |

### 5.3 Các dạng bẫy

| Code | Trông như | Thật ra | Vì sao |
|---|---|---|---|
| ngoài `i //= 2`, trong `range(i)` | O(n log n) | **O(n)** | n + n/2 + … ≈ 2n |
| ngoài `i *= 2`, trong `range(i)` | O(n log n) | **O(n)** | 1 + 2 + … + n ≈ 2n |
| two pointers / sliding window có `while` lồng | O(n²) | **O(n)** | con trỏ không reset, tổng quãng đường ≤ n |
| `while i * i <= n` | | O(√n) | dừng khi i > √n |
| `break` sớm | | worst không đổi | chỉ giúp best case |

Mẫu câu trả lời: 🇬🇧 *"The outer loop runs ___ times. For each iteration, the inner loop runs ___ times. In total ___, so it is O(___)."*

---

## 6. Chi phí ẩn của hàm thư viện

> 🔴 T1

🇬🇧 **One line of code is not one step. Cost = how many elements the function has to touch, copy, or shift.**

### 6.1 Nối chuỗi trong vòng lặp có thể là O(n²)

String bất biến nên `s + t` tạo chuỗi mới và copy hết: O(len s + len t). Lặp n lần thì copy 1 + 2 + … + n → **O(n²)**.

```python
s = ""
for w in words:
    s += w               # có thể O(n²)

s = "".join(words)       # O(n): biết tổng độ dài, cấp phát 1 lần, copy 1 lần
```

- Nối **một lần** thì `s + t` và `"".join([s, t])` như nhau. `join` chỉ có lợi khi nối nhiều lần.
- CPython có tối ưu `s += w` tại chỗ, nhưng **đừng dựa vào**: không áp dụng cho PyPy, cho `s = w + s`, hay khi có tham chiếu thứ hai.
- Java/C#/Go: dùng `StringBuilder` / `strings.Builder`.

### 6.2 Bảng chi phí Python cần thuộc

| Thao tác | Chi phí |
|---|---|
| `arr[i]`, `len(arr)`, `append`, `pop()` | O(1) |
| `pop(0)`, `insert(0, x)`, `del arr[i]`, `remove` | **O(n)** (dịch phần tử) |
| `pop(i)` | O(n − i) |
| `x in list`, `index`, `count`, `min`, `max`, `sum` | **O(n)** |
| `arr[a:b]` | **O(b − a)**, không phải O(n) |
| `arr + other` | O(n + m) |
| `sort`, `sorted` | O(n log n) |
| `x in dict/set`, `d[k]` | O(1) tb |
| `x in d.values()` | **O(n)** |
| `set(arr)` | O(n), chi phí **chuẩn bị** |

**Cấu trúc thay thế:** đầu danh sách dùng `deque`; kiểm tra tồn tại dùng `set`; min/max lặp lại dùng `heapq`; nối chuỗi dùng `join`.

⚠️ Nhớ tính **chi phí chuẩn bị**: `for x in a: if x in set(b)` → nếu b đã là set thì O(n); nếu phải tạo `set(b)` trước thì O(n + m).

### 6.3 Các mẫu O(n²) ẩn

- `if x not in seen` với `seen` là list.
- BFS dùng `queue.pop(0)`.
- Đệ quy với `s[1:]` (vừa O(n²) time vừa O(n²) space).
- Sort lại bên trong vòng lặp.

🏗️ **Production:** ORM lazy load trong vòng lặp (N+1 query), `OFFSET` lớn, regex ReDoS, `json.dumps` object lớn trong vòng lặp.

### 6.4 🟦 TypeScript / JavaScript

> Đo trên Node 20 (V8). Con số chỉ để thấy **dạng tăng**, không phải cam kết. Kiểu của TS không đổi độ phức tạp, chỉ có runtime JS quyết định.

**Nối chuỗi:** V8 tối ưu `s += w` (rope), nối 200 000 lần chỉ ~13 ms (`join` ~3 ms). Trong JS dùng `+=` hay template literal đều ổn. Nhưng nếu mỗi vòng lại đọc chuỗi (`s[i]`, regex) thì rope bị làm phẳng và có thể đắt lại. Ghép nhiều mảnh: `parts.push(x)` rồi `parts.join("")`.

| Thao tác | Chi phí |
|---|---|
| `arr[i]`, `arr.length`, `push`, `pop` | O(1) |
| `shift`, `unshift`, `splice(i, …)` | **O(n)**. Đo: rút cạn 10 000 phần tử bằng `shift` ≈ 1 ms, nhưng 100 000 phần tử ≈ 0,8 s (mảng nhỏ V8 có đường tắt, mảng lớn bùng nổ) |
| `includes`, `indexOf`, `find`, `some`, `filter` | **O(n)** |
| `slice(a, b)` | O(b − a) |
| `[...arr]`, `concat`, `map` | O(n) |
| `sort` | O(n log n). ⚠️ Mặc định so sánh **như chuỗi**: `[10, 9, 1].sort()` → `[1, 10, 9]`. Luôn truyền `(a, b) => a - b`. `sort` sửa tại chỗ; `toSorted()` trả bản mới |
| `map.get/set/has/delete`, `set.has/add` | O(1) tb |
| `map.size`, `set.size` | O(1) |
| `Object.keys(o)`, `Object.values(o)`, `Object.entries(o)` | **O(n)**: tạo mảng mới. Đo: `Object.keys(o).length` ở 1 triệu key ≈ **140 ms mỗi lần gọi**, `map.size` ≈ tức thì |
| `key in o`, `o[key]` | O(1) tb |
| `[...map.keys()]`, `Array.from(set)`, `new Set(arr)` | O(n), chi phí **chuẩn bị** |
| `JSON.stringify/parse`, `structuredClone` | O(kích thước dữ liệu) |

**Tương ứng Python → JS:** `dict` ↔ `Map`, `set` ↔ `Set`, `len(d)` ↔ `map.size`. Cần đếm số key của `Object` liên tục thì đừng gọi `Object.keys(o).length` trong vòng lặp: giữ biến đếm hoặc dùng `Map`.

**Các mẫu O(n²) ẩn thường gặp trong TS:**

```ts
// ❌ O(n²): mỗi vòng copy cả acc. Đo: 16 000 phần tử ≈ 29 giây, sửa tại chỗ ≈ 2 ms
const byId = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
// ✅ O(n)
const byId = new Map(users.map(u => [u.id, u] as const));

// ❌ O(n²): includes trên mảng trong vòng lặp (đo 30 000 phần tử: 95 ms vs 2 ms)
if (!seen.includes(x)) seen.push(x);
// ✅ O(n)
const seen = new Set<number>(); if (!seen.has(x)) seen.add(x);

// ❌ BFS với queue.shift(): O(n²) khi queue lớn
// ✅ giữ chỉ số đầu thay vì dịch phần tử
let head = 0; while (head < queue.length) { const x = queue[head++]; /* ... */ }

// ❌ acc = [...acc, x] trong vòng lặp cũng O(n²)
```

🏗️ **Production (Node):** `for (const id of ids) await getUser(id)` là N+1 **tuần tự** (N round trip nối đuôi). Dùng `Promise.all` có giới hạn đồng thời (pool) hoặc gọi batch. Một vòng lặp đồng bộ nặng còn **chặn event loop**, làm mọi request khác đứng chờ.

---

## 7. Space complexity và call stack

> 🔴 T1

- **Input space:** bộ nhớ của input, không tính.
- **Auxiliary space:** bộ nhớ **phụ** bạn tạo thêm (biến, list mới, **call stack**). Phỏng vấn hỏi cái này.
- **In-place** = bộ nhớ phụ O(1).

### 7.1 Call stack

Mỗi lần gọi hàm tạo một **frame**, frame chỉ bị xóa khi hàm return. Đệ quy làm các frame chồng lên nhau.

⭐ **Space đệ quy = độ sâu lớn nhất × bộ nhớ mỗi frame**, không phải tổng số lần gọi.

> 🇬🇧 **Time = area of the tree. Space = height of the tree.**

| Hàm | Time | Space |
|---|---|---|
| `sum_to(n)` đệ quy / vòng lặp | O(n) | O(n) / **O(1)** |
| Binary search đệ quy / vòng lặp | O(log n) | O(log n) / **O(1)** |
| Fib không memo | O(2ⁿ) | **O(n)** |
| Fib có memo | O(n) | O(n) |
| DFS trên cây cao h | O(n) | **O(h)**: log n nếu cân bằng, n nếu lệch |
| Merge sort | O(n log n) | O(n) |
| Quicksort | O(n log n) tb | O(log n) tb, O(n) worst |
| Đệ quy có `s[1:]` | O(n²) | **O(n²)** (mỗi frame giữ một bản copy) |

### 7.2 Python thực tế

- Giới hạn đệ quy mặc định ~1000 tầng (`RecursionError`). Python không tối ưu tail recursion.
- Dữ liệu có thể sâu thì chuyển sang **vòng lặp + stack tự quản lý**.

🏗️ **Production:** bộ nhớ nhân theo số request đồng thời. Dùng streaming/generator thay vì `readlines()`, phân trang thay vì `SELECT *`, giới hạn kích thước cache (`lru_cache(maxsize=...)`).

### 7.3 🟦 TypeScript / JavaScript

- Giới hạn đệ quy: đo trên Node 20 khoảng **11 000 frame**, vượt thì `RangeError: Maximum call stack size exceeded` (tuỳ phiên bản và kích thước frame). **V8 không tối ưu tail call** (chuẩn ES2015 có, nhưng chỉ Safari làm). Dữ liệu có thể sâu thì chuyển sang vòng lặp + stack mảng (`stack.push/pop`).
- ⚠️ Spread thành đối số cũng ăn stack: `Math.max(...arr)` với 300 000 phần tử **ném `RangeError`** (đo; 100 000 vẫn chạy). Dùng `arr.reduce((m, x) => x > m ? x : m)` hoặc vòng lặp.
- Heap của Node có giới hạn mặc định (chỉnh bằng `--max-old-space-size`). Đọc file lớn thì dùng stream/`readline` thay vì `readFileSync` cả file.

---

## 8. Cây đệ quy (recursion tree)

> 🔴 T1

### 8.1 Ba câu hỏi

1. **Branching factor b:** mỗi lần gọi sinh ra mấy lời gọi con?
2. **Độ sâu:** n giảm 1 → sâu n; n chia đôi → sâu log n.
3. **Việc mỗi node** ngoài lời gọi đệ quy (vòng lặp, slice, merge…).

### 8.2 Công thức theo tầng

```
Tổng = Σ (k = 0 → độ sâu)  (số node ở tầng k) × (việc mỗi node ở tầng k)
       số node tầng k = bᵏ
```

Merge sort: Σ 2ᵏ × n/2ᵏ = n + n + … + n (log n số hạng) = **n log n**.

⚠️ Bên trong Σ là biểu thức theo **k**. `2^(log n) = n` chỉ là **số node ở tầng lá**, dùng khi điền bảng, không phải thừa số để nhân.

### 8.3 Ba dạng tổng theo tầng

| Dạng | Tổng mỗi tầng | Ai thắng | Ví dụ |
|---|---|---|---|
| ① Bằng nhau | n, n, n | mọi tầng | merge sort: n log n |
| ② Tăng về lá | 1, 2, 4… | tầng lá | fib: 2ⁿ; 2 nhánh chia đôi việc O(1): O(n) |
| ③ Giảm về lá | n, n/2, n/4… | tầng gốc | 1 nhánh chia đôi việc O(n): O(n) |

### 8.4 Memo

⭐ **Time = số bài toán con khác nhau × việc mỗi bài toán con.** Fib có memo: n × O(1) = O(n). Đây là nền tảng của DP.

### 8.5 Bẫy

- **Hai nhánh chưa chắc là 2ⁿ.** Cần cả phân nhánh **và** độ sâu ~n. Chia đôi thì 2^(log₂ n) = n node.
- `power(x, n//2) * power(x, n//2)` (gọi 2 lần) là O(n). Lưu vào `half` rồi dùng lại thì O(log n).
- Quên việc mỗi node (slice O(n) mỗi tầng).

🏗️ **Production:** cây gọi giữa các service = recursion tree. Fan-out bᵈ, request trùng lặp → memo = DataLoader / request coalescing. Retry ở mỗi tầng → retry storm 3⁴ = 81 request. Chỉ retry ở một tầng, kèm backoff và circuit breaker.

---

## 9. Amortized (khấu hao)

> 🔴 T1

🇬🇧 **Amortized cost = total cost of a sequence of operations ÷ number of operations.**

### 9.1 Vì sao `append` vào dynamic array là O(1) amortized

- Còn chỗ: O(1). Đầy: xin khối mới **×2** và copy O(n).
- Resize xảy ra ở 1, 2, 4, 8… nên tổng copy sau n lần append = 1 + 2 + 4 + … + n ≈ 2n.
- Tổng ≈ n (ghi) + 2n (copy) = 3n → chia n thao tác = **O(1)**.
- Banker's method: mỗi append "trả 3 đồng", 2 đồng để dành cho lần copy sau.

⚠️ Phải tăng **nhân** (hệ số > 1, không cần đúng 2). Tăng **cộng** thêm hằng số k thì tổng copy ≈ n²/k → O(n) mỗi thao tác. Python ~1.125×, Java 1.5×.

⚠️ Thu nhỏ khi còn **1/4** (không phải 1/2) để tránh thrashing.

### 9.2 Phân biệt

| | Trung bình trên | Cần xác suất? |
|---|---|---|
| Worst case | một thao tác, input xấu nhất | không |
| Average | các **input** | **có** |
| Amortized | một **chuỗi thao tác** | **không**, là cam kết chắc chắn |

Ví dụ khác: HashMap put, queue bằng 2 stack, two pointers / sliding window.

🏗️ **Production:** amortized tốt cho throughput nhưng **xấu cho tail latency** (lần resize gây p99 spike). Redis/Go map rehash dần (incremental). Biết trước kích thước thì cấp phát trước.

> 🇬🇧 *"Amortized analysis tells you the bill. It doesn't tell you when the bill arrives."*

### 9.3 🟦 TypeScript / JavaScript

`Array` của JS cũng là dynamic array: `push` O(1) amortized. V8 tăng capacity khoảng **1,5× + 16** (Python ~1,125×, Java 1,5×), cùng logic cấp số nhân ở 9.1. `new Array(n)` cấp phát trước nhưng tạo mảng "có lỗ" (holey) thường chậm hơn trong V8, nên thường để `push` amortized là đủ.

---

## 10. Độ phức tạp của các cấu trúc dữ liệu

> 🔴 T1

| Cấu trúc | Access | Search | Insert | Delete | Lý do 1 dòng |
|---|---|---|---|---|---|
| Array / Dynamic array | O(1) | O(n) | O(1)* cuối, O(n) giữa | O(1) cuối, O(n) giữa | liên tục: tính được địa chỉ, nhưng phải dịch |
| Sorted array | O(1) | O(log n) | O(n) | O(n) | binary search được, nhưng vẫn phải dịch |
| Linked list | O(n) | O(n) | O(1) nếu có con trỏ | O(1) nếu có con trỏ | rời rạc: không dịch, nhưng phải đi từ đầu |
| HashMap / HashSet | — | O(1) tb | O(1) tb | O(1) tb | hash nhảy thẳng tới bucket, mất thứ tự |
| Stack / Queue | — | — | O(1) | O(1) | chỉ thao tác ở hai đầu |
| Heap | O(1) min/max | O(n) | O(log n) | O(log n) pop | chỉ gốc có thứ tự; build heap O(n) |
| Balanced BST | — | O(log n) | O(log n) | O(log n) | giữ thứ tự, cây cao log n |

\* amortized

> 🇬🇧 **Contiguous → fast access, slow shift. Linked → no shift, slow access. Hashed → fast lookup, no order. Tree → log n everything, keeps order.**

**Bẫy:**
- "Linked list insert O(1)" chỉ đúng khi **đã cầm con trỏ**. Phải tìm vị trí thì O(n).
- Python không có balanced BST chuẩn → dùng `sortedcontainers`.
- `deque[i]` ở giữa là O(n).
- Cùng O(n) nhưng duyệt array nhanh hơn linked list nhiều lần nhờ **cache locality**. Mặc định dùng array.

**Chọn cấu trúc theo câu hỏi cần trả lời nhiều nhất:**

| Câu hỏi | Chọn |
|---|---|
| Phần tử thứ i? | Array |
| X có tồn tại? Key → value? Đếm? | HashSet / HashMap / `Counter` |
| Min/max hiện tại, dữ liệu thay đổi liên tục? | Heap |
| Phần tử trong khoảng [a, b]? Lớn hơn X gần nhất? | Balanced BST / sorted array |
| Vào sau ra trước (undo, DFS) | Stack |
| Vào trước ra trước (BFS, job) | Queue (`deque`) |

🏗️ **Production:** B-tree index (hỗ trợ `=`, khoảng, `ORDER BY`) vs hash index (chỉ `=`). Redis Sorted Set (skip list) cho leaderboard. LRU cache = HashMap + doubly linked list.

### 10.1 🟦 TypeScript / JavaScript: thư viện chuẩn có gì

| Cần | Python | JS / TS |
|---|---|---|
| dict / đếm | `dict`, `Counter` | `Map<K, V>`: `m.set(k, (m.get(k) ?? 0) + 1)` |
| set | `set` | `Set<T>` |
| queue hai đầu | `deque` | **không có sẵn**: mảng + chỉ số `head`, hoặc linked list tự viết |
| heap | `heapq` | **không có sẵn**: tự viết hoặc dùng thư viện |
| sorted / balanced BST | `sortedcontainers` | **không có sẵn** |
| key phức hợp | `tuple` | không có tuple hashable: dùng chuỗi `${a},${b}` (xem 12.8) |
| LRU | `OrderedDict` | `Map` **giữ thứ tự chèn**, xem bên dưới |

```ts
// LRU cache bằng Map: delete rồi set để đưa key lên "mới nhất"
class LRU<K, V> {
  private m = new Map<K, V>();
  constructor(private readonly cap: number) {}
  get(k: K): V | undefined {
    if (!this.m.has(k)) return undefined;
    const v = this.m.get(k)!; this.m.delete(k); this.m.set(k, v);
    return v;
  }
  set(k: K, v: V): void {
    this.m.delete(k); this.m.set(k, v);
    if (this.m.size > this.cap) this.m.delete(this.m.keys().next().value!);  // key cũ nhất
  }
}
```

**Bộ nhớ (nối mục 11):** mảng toàn số thì V8 thường lưu **giá trị thật** (không phải con trỏ); trộn kiểu (số lẫn object) thì chuyển sang chứa con trỏ. Cần chắc chắn và tiết kiệm (giống NumPy): `Uint8Array`, `Float64Array`.

---

## 11. Cấu trúc dữ liệu nằm trong bộ nhớ thế nào

> 🔴 T1 · nền tảng cho mục 10

**Nền tảng:** RAM là một mảng byte khổng lồ, mỗi byte có địa chỉ. Mọi cấu trúc ghép từ **2 viên gạch**:

| Viên gạch | Ưu | Nhược |
|---|---|---|
| Khối liên tục | tính được địa chỉ thứ i, cache tốt | không nới rộng tại chỗ được → phải xin khối mới + copy |
| Con trỏ | chèn/gỡ không cần dịch | phải đi theo từng con trỏ |

| Cấu trúc | Bố cục | Thao tác đắt và cơ chế |
|---|---|---|
| Dynamic array | struct {data, size, capacity} + khối liên tục | insert giữa: **dịch phải** từ cuối về; delete giữa: **dịch trái**; đầy: **xin ×2, copy, free khối cũ** |
| Python `list` | khối liên tục chứa **con trỏ** tới object | vì vậy chứa được nhiều kiểu; NumPy nhanh hơn vì lưu giá trị thật |
| Linked list | node {value, next[, prev]} rải rác | access phải đi từ head; insert: `new.next = node.next` **rồi** `node.next = new`; singly cần node trước để xóa, doubly thì O(1) |
| Queue (circular buffer) | mảng + `head`, `tail`, quay vòng bằng `% capacity` | không bao giờ dịch; đầy thì resize |
| Python `deque` | doubly linked list các khối 64 phần tử | hai đầu O(1) thật; giữa O(n) |
| Hash table | mảng bucket | collision: chaining (list mỗi ô) hoặc open addressing (dò ô khác, xóa phải đặt **tombstone**); resize: **rehash** từng key vì index phụ thuộc capacity |
| Heap | cây đầy đủ lưu trong mảng: con `2i+1`, `2i+2`, cha `(i-1)//2` | push: thêm cuối rồi **sift up**; pop: đưa phần tử cuối lên gốc rồi **sift down** |
| BST | node {left, key, right} | delete 3 case (lá / 1 con / 2 con dùng successor); cân bằng bằng **xoay** |
| B+ tree (DB) | mỗi node là một **page** 8–16 KB, hàng trăm key; lá nối nhau | 3–4 lần đọc đĩa cho hàng tỷ dòng; page đầy → **page split** lan lên trên |

**DB thực tế:**
- Disk đọc theo page, chậm hơn RAM ~1000 lần, nên tối ưu **số page đọc**.
- PK tăng dần insert nhanh; UUID v4 ngẫu nhiên gây split khắp cây (→ UUID v7).
- Mỗi index là một B+ tree riêng, nhiều index thì insert chậm.
- Composite index `(a, b)` dùng được cho `WHERE a`, không dùng được cho `WHERE b`.
- LSM tree (Cassandra, RocksDB): ghi append-only, gộp sau (compaction).

> 🇬🇧 **Contiguous memory → you pay with shifting and copying. Pointers → you pay with walking.**

---

## 12. HashMap bên trong

> 🔴 T1

### 12.1 Luồng 5 bước

```
① hash(key)                       → số nguyên
② index = hash & (capacity - 1)   → capacity luôn là lũy thừa 2 (Java trộn h ^ (h >>> 16) trước)
③ tới bucket[index]               → O(1) như access mảng
④ trống → ghi; trùng key → ghi đè; key khác → COLLISION
⑤ size / capacity > load factor   → resize ×2 + rehash
```

### 12.2 Hàm hash tốt: xác định, phân bố đều, nhanh

Hash chuỗi tốn O(k) (Python cache lại). Collision **chắc chắn** xảy ra (chuồng bồ câu, birthday paradox).

### 12.3 Chaining vs open addressing

| | Chaining (Java) | Open addressing (Python) |
|---|---|---|
| Mỗi ô | linked list / cây | một phần tử |
| Collision | nối vào list | dò ô khác (linear, quadratic, perturbation) |
| Xóa | gỡ node | đặt tombstone |
| Load factor | có thể > 1 | phải < 1 (~2/3) |
| Cache | kém | tốt |

### 12.4 Load factor và resize

- α = size / capacity. Độ dài bucket trung bình ≈ α. Giữ α ≤ 0.75 → **trung bình O(1)**.
- α thấp: nhanh, tốn bộ nhớ. α cao: tiết kiệm, nhiều collision.
- Resize phải **rehash** vì index phụ thuộc capacity. Một lần O(n), cả chuỗi **O(1) amortized** (cùng lập luận với dynamic array).
- Biết trước kích thước thì cấp phát trước: `new HashMap<>(expected / 0.75)`.

### 12.5 Average O(1), worst O(n)

- Worst: mọi key một bucket (hash tồi như `__hash__` trả hằng số, hoặc hash flooding).
- Phòng thủ: Python **hash randomization** (seed ngẫu nhiên mỗi tiến trình); Java 8+ **treeify** (bucket > 8 và capacity ≥ 64) → O(log n).

### 12.6 Hợp đồng hash/eq và key bất biến

- **`a == b` thì `hash(a) == hash(b)`.** Ngược lại không bắt buộc.
- Python: định nghĩa `__eq__` mà không có `__hash__` → `__hash__ = None` (unhashable). Dùng `@dataclass(frozen=True)`.
- Key bị sửa sau khi lưu thì hash đổi, map tìm sai bucket, dữ liệu bị "mồ côi". Python cấm `list`/`dict`/`set` làm key; Java không cấm nên lỗi **xảy ra im lặng**.
- Liên quan bài 49 Group Anagrams: key phải là `tuple(...)` hoặc `str`.

### 12.7 Câu trả lời mẫu (câu 4 Chốt tuần)

> "A HashMap is an **array of buckets**. To store a key, we compute **hash(key)**, then take it **modulo the capacity** to get a bucket index. Then we jump straight to that bucket, which is an O(1) array access.
>
> Two different keys can land in the same bucket. That's a **collision**. **Chaining**, used by Java, keeps a small linked list in each bucket. **Open addressing**, used by Python, probes for another empty slot in the same array.
>
> To keep buckets short, the map tracks the **load factor**. When it goes over a threshold (0.75 in Java), the map **doubles its capacity and rehashes** every key. One resize costs O(n), but it happens rarely, so insert is still **O(1) amortized**.
>
> So lookup is **O(1) on average**, as long as the hash spreads keys evenly. In the **worst case**, every key lands in the same bucket, and lookup becomes **O(n)**. Java 8 limits this to **O(log n)** by turning long buckets into red-black trees."

Checklist: `hash % capacity` · chaining / open addressing · load factor → resize ×2 + rehash → O(1) amortized · average O(1) vs worst O(n) · treeify O(log n) · *(điểm cộng)* key bất biến, hợp đồng hash/eq.

### 12.8 🟦 TypeScript / JavaScript: `Map` vs `Object`

| | `Map` | `Object` dùng như dict |
|---|---|---|
| Kiểu key | **bất kỳ** (số, object, ...) | chỉ `string` / `symbol`: `o[1]` ≡ `o["1"]` |
| Đếm | `m.size` O(1) | `Object.keys(o).length` **O(n)** |
| Thứ tự duyệt | thứ tự chèn | số nguyên tăng dần **trước**, rồi mới theo thứ tự chèn (đo: `{b, 2, a, 1}` → `["1","2","b","a"]`) |
| Key có sẵn | không | có prototype: `"toString" in {}` là `true`. Dùng `Object.hasOwn(o, k)` |
| Key từ input người dùng | an toàn | ⚠️ `o["__proto__"] = x` **đổi prototype** thay vì tạo key (đo) → *prototype pollution* |
| Thêm/xoá liên tục | tối ưu cho việc này | không |

**Chọn:** key động, thêm/xoá nhiều, cần `size`, key không phải string → `Map`. Bản ghi hình dạng cố định (DTO) → `object`/`interface`. Key đến từ bên ngoài (query, header, JSON) mà vẫn muốn dùng Object → `Object.create(null)` hoặc `Map`.

**Key trong `Map` so sánh bằng "SameValueZero":** primitive theo **giá trị** (`NaN` khớp `NaN`, `0` khớp `-0`), object theo **tham chiếu**.

```ts
const m = new Map<number[], string>();
m.set([1, 2], "x");
m.get([1, 2]);      // undefined ❌ hai mảng khác tham chiếu. Python báo lỗi unhashable ngay,
                    // JS thì im lặng sai. Đây là lỗi hay gặp với Map<object, ...>
```

**Không có hash/eq tuỳ biến**, nên key phức hợp phải tự **chuẩn hoá thành string/number**:

```ts
const key = `${userId}:${sku}`;               // chọn dấu ngăn không xuất hiện trong dữ liệu
const anagramKey = [...word].sort().join(""); // Group Anagrams, cách 1: O(k log k)
const counts = new Array(26).fill(0);         // cách 2: O(k)
for (const ch of word) counts[ch.charCodeAt(0) - 97]++;
const anagramKey2 = counts.join("#");         // ⚠️ cần dấu ngăn: [1,11] và [11,1] sẽ nhầm nếu nối liền
```

Vì object theo tham chiếu nên **không có** lỗi "key bị sửa → hash đổi, dữ liệu mồ côi" của mục 12.6 (đo: sửa `k.id` rồi `map.get(k)` vẫn tìm được). Đổi lại là không tra theo **nội dung** được.

```ts
// Two Sum (bài D3), bản TS: kiểm tra phần bù TRƯỚC, rồi mới thêm phần tử hiện tại
function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();           // value → index
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return null;
}
```

---

## 13. Sharding: thêm server với hash

> 📎 Mở rộng (ngoài bảng roadmap)

**Vấn đề:** `server = hash(key) % N`. Đổi N = 4 → 5 thì chỉ ~20% key ở lại, **~80% phải di chuyển** (lý tưởng chỉ ~1/5). Hậu quả: copy gần hết dữ liệu, cache miss hàng loạt → cache stampede đè DB.

### 13.1 Consistent hashing

- Đặt cả server và key lên **vòng** 0 → 2³². Key thuộc server **đầu tiên theo chiều kim đồng hồ**.
- Thêm server: chỉ cắt một đoạn của server kế bên → chỉ ~**1/N** key di chuyển.
- **Virtual nodes** (100–200 điểm mỗi server): phân bố đều, server mới lấy mẩu nhỏ từ **mọi** server, hỗ trợ server mạnh/yếu bằng số điểm.
- Dùng ở: Cassandra, DynamoDB, client Memcached, load balancer theo key, CDN.

### 13.2 Slot cố định (pre-sharding)

- `slot = hash(key) % 16384` **không bao giờ đổi**. Chỉ **bảng slot → server** thay đổi.
- Thêm server: mỗi server nhường ~1/N số slot. Như HashMap **không bao giờ resize**, chỉ chuyển nguyên bucket giữa các máy.
- Dùng ở: Redis Cluster (16384), Couchbase (1024 vBucket), Elasticsearch (số primary shard cố định), Kafka (tăng partition làm mất thứ tự theo key).

### 13.3 Di chuyển dữ liệu không downtime

- **Redis Cluster:** MIGRATING / IMPORTING → chuyển dần từng lô key → request rơi vào key đã chuyển nhận `ASK` → chuyển xong cập nhật bảng → client gửi nhầm nhận `MOVED` và refresh bảng.
- **Tự shard DB:** double write → backfill → verify → cutover đọc dần (1% → 100%) → cutover ghi → dọn dẹp. Rollback được tới trước bước cutover ghi.
- **Thiết kế từ đầu:** nhiều **logical shard** (1024+) trên ít server vật lý, ánh xạ trong config. Scale = chuyển nhóm shard, code không đổi.

| | Consistent hashing | Slot cố định |
|---|---|---|
| Thêm server | tự động | chủ động chọn slot |
| Kiểm soát / xử lý hot key | thấp / khó | cao / dễ |
| Metadata | danh sách server | bảng slot → server |

---

## 14. Khung phân tích dùng cho mọi đoạn code

> 🔴 T1 · khung tổng hợp

**2 tài nguyên × 3 góc nhìn:**

| | Time | Space |
|---|---|---|
| Worst | quan trọng nhất (cam kết) | quan trọng nhất (hết RAM là crash) |
| Average | hiệu năng hằng ngày | ít khi xét riêng |
| Amortized | chuỗi thao tác | ít khi xét riêng |

**Big O bỏ qua, production thì không:** hằng số (network ≈ 10⁴ lần RAM), từng thao tác đơn lẻ (spike), số request đồng thời (bộ nhớ nhân lên).

**5 câu hỏi khi viết hoặc review code:**

1. Time worst case? Có O(n²) ẩn không (`in list`, slice, nối chuỗi, query trong vòng lặp)?
2. Space? Gồm cấu trúc phụ **và** stack đệ quy.
3. Đang đổi space lấy time ở đâu, có đáng không?
4. Input do ai kiểm soát? Người ngoài thì giả định worst case.
5. Mỗi "bước" là RAM, disk hay network? Thao tác đắt hiếm hoi có gây spike không?

Câu 1–3 là DSA. Câu 4–5 là góc nhìn production.

Mẫu trả lời: 🇬🇧 *"Time is O(__) [worst / average / amortized], space is O(__) because of __. We can trade __ for __."*

---

## 15. Thẻ Anki T1 kèm đáp án

> 🔴 T1

1. **Vì sao O(2n + 100) được viết là O(n)?**
   Big O đo tốc độ tăng khi n lớn. 100 là chi phí cố định, không tăng theo n. Hệ số 2 không đổi dạng tuyến tính.

2. **`while n > 1: n = n // 2` có độ phức tạp bao nhiêu?**
   O(log n). Sau k bước n còn n/2ᵏ, dừng khi 2ᵏ ≥ n, tức k = log₂ n.

3. **HashMap tra cứu là O(1). Khi nào thành O(n)?**
   Khi mọi key dồn vào một bucket: hash tồi hoặc hash flooding. Java 8+ giảm còn O(log n) nhờ treeify.

4. **Vì sao `append` vào dynamic array là O(1) amortized?**
   Đầy thì tăng capacity theo cấp số nhân (×2) và copy. Resize ở 1, 2, 4, 8… nên tổng copy ≈ 2n sau n lần append. Chia đều thì O(1) mỗi lần.

5. **n ≤ 10⁵ thì O(n²) có chạy kịp không?**
   Không. 10¹⁰ phép tính ≈ 100 giây (máy ~10⁸ phép/giây). Cần O(n log n) hoặc tốt hơn.

6. **DFS đệ quy trên cây cao h tốn bao nhiêu bộ nhớ phụ?**
   O(h) cho call stack. O(log n) nếu cây cân bằng, O(n) nếu cây lệch.

7. **HashMap xử lý collision thế nào? Load factor và resize ảnh hưởng gì?**
   Chaining (list/cây trong mỗi bucket) hoặc open addressing (dò ô khác, xóa dùng tombstone). Vượt load factor (Java 0.75) thì resize ×2 và rehash mọi key: một lần O(n), nhưng O(1) amortized. Load factor thấp giữ bucket ngắn nên trung bình O(1).

8. **`Object.keys(o).length` độ phức tạp bao nhiêu trong JS? Đếm số key thì dùng gì?**
   O(n): nó tạo cả mảng key rồi mới lấy `length` (đo: 1 triệu key ≈ 140 ms mỗi lần gọi). Dùng `Map` và `map.size` (O(1)), hoặc tự giữ biến đếm.

9. **Vì sao `users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {})` chậm?**
   Mỗi vòng copy toàn bộ `acc`: 1 + 2 + … + n → O(n²). Sửa: `new Map(users.map(u => [u.id, u]))` hoặc gán trực tiếp vào một object duy nhất.

---

## 16. Câu hỏi cuối bài

> Đáp án mẫu (Claude viết hộ, 26/10/2026). Khi ôn: che đáp án, tự trả lời bằng tiếng Anh trước rồi mới mở.

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

<details><summary>Đáp án</summary>

Các con số dưới đây đã chạy thật (Python 3.11, máy cá nhân), không ước lượng theo trí nhớ.

**1.** Lần theo số thao tác:
- **Hai vòng lồng nhau:** cặp (i, j) với j > i được so một lần → (n−1) + (n−2) + … + 1 = n(n−1)/2 lần so sánh. Với n = 10⁵ là ≈ 5·10⁹ → **O(n²)** ([mục 5](#5-quy-tắc-phân-tích-vòng-lặp)).
- **HashSet:** duyệt mỗi phần tử **một lần**; mỗi lần làm `x in seen` + `seen.add(x)`, cả hai O(1) trung bình (hash → bucket, [mục 12](#12-hashmap-bên-trong)). n lần × O(1) = **O(n)**.
- **Cái giá:** bộ nhớ phụ **O(n)** cho set (xấu nhất mọi phần tử khác nhau, set chứa đủ n key, mỗi entry còn tốn hash + con trỏ, nặng hơn nhiều so với số nguyên trong mảng). O(1) cũng chỉ là **trung bình**: hash tồi / hash flooding dồn key vào một bucket thì mỗi lần tra thành O(n).
- Backend: kiểm tra "trong lô import 100k đơn có `order_code` trùng không" → dùng set, đừng lồng 2 vòng.

**2.** Tối đa **20 bước**. Mỗi bước so với phần tử giữa rồi bỏ một nửa: 10⁶ → 5·10⁵ → … → 1. Số lần chia đôi tới khi còn 1 phần tử là k với 2ᵏ ≥ n → k = ⌈log₂(10⁶ + 1)⌉ = 20 (vì 2²⁰ = 1 048 576 ≥ 10⁶). Đã chạy: tìm phần tử đầu, cuối, không tồn tại → nhiều nhất 20 vòng lặp. Gấp đôi dữ liệu chỉ thêm **1** bước: đó là sức mạnh của O(log n), cũng là lý do index B-tree của DB tra cứu nhanh trên bảng hàng triệu dòng.

**3.** Sort O(n log n) + một lần duyệt so `a[i] == a[i+1]` O(n) → **O(n log n)** thời gian. Bộ nhớ phụ: O(1) nếu sort tại chỗ kiểu heapsort; Python `list.sort()` (Timsort) dùng tới O(n) bộ nhớ tạm, JS `Array.prototype.sort` tuỳ engine. Tốt hơn HashSet khi:
- **Bộ nhớ bị giới hạn** (không cho phép thêm một set cỡ n);
- mảng **đã sort sẵn** (chỉ còn O(n), O(1) bộ nhớ), hoặc dữ liệu lấy từ DB đã `ORDER BY`;
- sau đó còn cần dữ liệu **có thứ tự** (in danh sách trùng theo thứ tự, tìm khoảng);
- dữ liệu quá lớn phải xử lý ngoài RAM (external sort).
Nhược điểm: chậm hơn về bậc (n log n > n) và **làm thay đổi input** (sort tại chỗ) → copy trước nếu caller còn dùng mảng gốc.

**4.** **Không kịp.** Lần theo từng dòng:
- `for x in arr`: n = 10⁵ vòng.
- `x not in seen`: `seen` là **list** → so lần lượt từng phần tử, O(len(seen)). Khi mọi phần tử khác nhau, `seen` dài dần 0, 1, 2, … → tổng ≈ n²/2 = 5·10⁹ phép so sánh → **O(n²)** ([mục 6](#6-chi-phí-ẩn-của-hàm-thư-viện): `in` trên list là chi phí ẩn).
- Đo thật: n = 10⁴ mất 0.19 s; **n = 10⁵ mất ≈ 19 s** (gấp 10 lần n → gấp 100 lần thời gian, đúng dấu hiệu O(n²)).
- Sửa: tra trong **set**, vẫn giữ list nếu cần thứ tự xuất hiện:
  ```python
  seen, result = set(), []
  for x in arr:
      if x not in seen:
          seen.add(x)
          result.append(x)
  ```
  Đo thật: n = 10⁵ còn **≈ 6 ms**. Ngắn hơn: `list(dict.fromkeys(arr))` (dict giữ thứ tự chèn, O(n)).

**5.** **Gấp đôi:** resize xảy ra khi size = 1, 2, 4, 8, …; mỗi lần copy đúng số phần tử đang có. Tổng copy sau n lần append ≈ 1 + 2 + 4 + … + n/2 < n → cộng n lần ghi = dưới 2n–3n thao tác cho n lần append → chia đều **O(1) amortized** ([mục 9](#9-amortized-khấu-hao)). Đo thật: n = 10⁵ → 131 071 lần copy (< 2n).
**Tăng cố định +10:** resize ở size 1, 11, 21, 31, … → khoảng n/10 lần resize, lần thứ k copy ≈ 10k phần tử → tổng ≈ 10·(1 + 2 + … + n/10) ≈ n²/20 → **O(n²)** tổng, **O(n) amortized mỗi lần append**. Đo thật: n = 10⁵ → 499 960 000 lần copy (≈ n²/20 = 5·10⁸).
Ý chính: tăng theo **cấp số nhân** (×2, Python thực tế ≈ ×1.125, Java `ArrayList` ×1.5) thì số lần resize chỉ là log n và tổng chi phí là chuỗi hình học bị chặn bởi hằng × n; tăng theo **cấp số cộng** thì số lần resize tỉ lệ với n và tổng thành chuỗi số học ~n².

</details>

# D9: Tổng quan Design Pattern + Singleton (tổng hợp)

← [Tuần 2](../100-ngay/tuan-02.md) · Phạm vi: mục #1 đến #8 của D9 + DSA 167 · Bài trước: [D8 Coupling & Cohesion](d08-coupling-cohesion.md)

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python; khác biệt của **TypeScript/JavaScript** nằm trong khối 🟦 cuối mỗi mục (đã kiểm chứng bằng cách chạy thật, không ghi theo trí nhớ).
> Nhãn: 🔴 T1 = nhớ và dạy lại được · 🟡 T2 = hiểu, nhớ tiêu chí chọn · 🟢 T3 = biết để tra khi cần

---

## Mục lục

1. [Design Pattern là gì](#1-design-pattern-là-gì) · 🔴 T1
2. [Ba nhóm GoF: Creational, Structural, Behavioral](#2-ba-nhóm-gof-creational-structural-behavioral) · 🔴 T1
3. Singleton: cấu trúc · 🔴 T1 *(hiệp sau)*
4. Vì sao Singleton bị coi là anti-pattern · 🔴 T1 *(hiệp sau)*
5. Race condition khi khởi tạo lazy · 🔴 T1 *(hiệp sau)*
6. Các cách làm Singleton thread-safe · 🟢 T3 *(hiệp sau)*
7. Singleton pattern vs singleton scope của DI container · 🟡 T2 *(hiệp sau)*
8. Singleton chỉ "duy nhất" trong một process · 🔴 T1 *(hiệp sau)*
9. DSA 167 Two Sum II + bảng T2 HashMap vs Two Pointers *(hiệp sau)*
10. Khung nhớ nhanh, thẻ Anki, câu hỏi cuối bài *(hiệp sau)*

---

## 1. Design Pattern là gì

| English | Nghĩa |
|---|---|
| design pattern | mẫu thiết kế: lời giải đã được đặt tên cho một vấn đề thiết kế hay lặp lại |
| recurring problem | vấn đề lặp đi lặp lại |
| intent | ý đồ: pattern sinh ra để giải quyết việc gì |
| consequences / trade-offs | hệ quả, cái được và cái mất khi dùng |
| shared vocabulary | từ vựng chung giữa các kỹ sư |
| GoF (Gang of Four) | 4 tác giả cuốn *Design Patterns* (1994): Gamma, Helm, Johnson, Vlissides |
| over-engineering | thiết kế quá tay, phức tạp hơn mức vấn đề cần |

### 🇬🇧 Theory

A **design pattern** is a **named, proven solution** to a design problem that keeps coming back. It is not code you copy. It is an idea you adapt to your code. Each pattern has four parts: a **name**, the **problem** it solves, the **solution** (which classes or functions, and how they talk), and the **consequences** (what you gain and what you pay).

The biggest value is the **name**. "Put an Adapter around the GHN SDK" says in four words what would otherwise take a paragraph, and every engineer who knows the pattern pictures the same structure.

### 🇻🇳 Giải thích

Pattern có giá trị ở 3 chỗ:

1. **Giao tiếp nhanh.** So sánh hai comment review:
   - Không có tên: *"Em tạo một class bọc cái SDK của GHN, class đó có method `quote` giống interface `Carrier` của mình, bên trong gọi `calc_fee` rồi lấy field `total_fee` ra…"*
   - Có tên: *"Bọc SDK GHN bằng một **Adapter** về port `Carrier`."*
   Người nghe biết luôn cấu trúc, biết luôn hệ quả (thêm một lớp, nhưng SDK đổi chỉ sửa một chỗ).
2. **Đọc code nhanh.** Thấy `XxxFactory`, `XxxAdapter`, `XxxStrategy` là đoán được vai trò trước khi đọc thân hàm.
3. **Mang theo cả trade-off.** Biết tên pattern là biết luôn nó *tốn* gì. Ví dụ biết "Singleton" thì phải nghĩ ngay tới phụ thuộc ẩn ([D8 #6](d08-coupling-cohesion.md#6-global-và-singleton-phụ-thuộc-ẩn)).

Pattern **không** phải mục tiêu. Đi từ vấn đề tới pattern ("SDK có interface khác ta → cần Adapter"), không đi ngược lại ("hôm nay học Adapter → tìm chỗ nhét Adapter").

Cách đọc một pattern (dùng cho mọi bài D10–D20): **Intent → Problem → Structure → Consequences**. Bỏ qua phần "Consequences" là bỏ phần quan trọng nhất.

### 🟦 TypeScript / JavaScript

- Rất nhiều pattern GoF được viết cho C++/Smalltalk năm 1994, khi chưa có hàm là giá trị (first-class function), closure, module. Trong TS/JS và Python, một số pattern **co lại** chỉ còn một hàm hoặc một module: Strategy thường chỉ là truyền một hàm vào, Iterator là `for...of` + generator, Observer có sẵn `EventEmitter`. Tên pattern vẫn dùng để giao tiếp, nhưng đừng viết đủ class + interface khi một hàm là đủ.

---

## 2. Ba nhóm GoF: Creational, Structural, Behavioral

| English | Nghĩa |
|---|---|
| creational | nhóm khởi tạo: tạo object thế nào |
| structural | nhóm cấu trúc: ghép, bọc object/class thế nào |
| behavioral | nhóm hành vi: chia việc và cho object nói chuyện với nhau thế nào |
| concrete class | class cụ thể (có thể `new` được) |
| wrap | bọc |
| interchangeable | thay thế cho nhau được |

### 🇬🇧 Theory

The GoF book lists **23 patterns** in three groups, by the question each one answers:

- **Creational** (5): *How do we create objects so that the calling code does not depend on the concrete class?*
- **Structural** (7): *How do we combine or wrap objects and classes so they fit together?*
- **Behavioral** (11): *How do we split responsibilities, and how do objects talk to each other?*

### 🇻🇳 Giải thích

Nhớ nhóm bằng **câu hỏi**, không học thuộc danh sách:

| Nhóm | Câu hỏi | Pattern sẽ học (tuần 2–3) | Còn lại trong GoF (🟢 T3, chỉ cần biết tên) |
|---|---|---|---|
| Creational | "Tạo object thế nào để code gọi không phụ thuộc class cụ thể?" | Singleton, Factory Method, Builder | Abstract Factory, Prototype |
| Structural | "Ghép, bọc object thế nào cho khớp và linh hoạt?" | Adapter, Decorator | Bridge, Composite, Facade, Flyweight, Proxy |
| Behavioral | "Chia việc thế nào, object nói chuyện với nhau ra sao?" | Strategy, Observer | Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, State, Template Method, Visitor |

Mẹo phân nhóm khi gặp pattern lạ: nhìn vào **thứ mà pattern làm cho linh hoạt**.
- Linh hoạt ở **chỗ `new`** → Creational.
- Linh hoạt ở **cách các object khớp/bọc vào nhau** (interface, lớp vỏ) → Structural.
- Linh hoạt ở **thuật toán hoặc luồng gọi** (ai làm, ai được báo) → Behavioral.

**Vì sao Adapter và Decorator cùng nhóm dù mục đích khác nhau?** Cả hai đều **bọc** một object khác (structural: cấu trúc ghép object). Khác ở chỗ:
- **Adapter đổi interface:** SDK có `calc_fee(payload)`, ta cần `quote(weight_g)`.
- **Decorator giữ nguyên interface, thêm hành vi:** vẫn là `Carrier.quote`, nhưng thêm cache hoặc log.

### Ví dụ: một tính năng, ba nhóm (đã chạy thật, `mypy --strict` sạch)

Tính phí ship cho đơn hàng. Mỗi nhóm giải một phần khác nhau của bài toán:

```python
from typing import Callable, Protocol


# Port do module shipping sở hữu
class Carrier(Protocol):
    def quote(self, weight_g: int) -> int: ...


# --- Structural: Adapter -------------------------------------------------
class GhnSdk:  # thư viện bên ngoài, interface khác hẳn ta
    def calc_fee(self, payload: dict[str, int]) -> dict[str, int]:
        return {"total_fee": 15_000 + payload["weight"] * 5}


class GhnAdapter:  # đổi interface của SDK thành Carrier
    def __init__(self, sdk: GhnSdk) -> None:
        self._sdk = sdk

    def quote(self, weight_g: int) -> int:
        return self._sdk.calc_fee({"weight": weight_g})["total_fee"]


class FlatCarrier:
    def quote(self, weight_g: int) -> int:
        return 30_000


# --- Creational: chọn class cụ thể ở một chỗ -----------------------------
def make_carrier(code: str) -> Carrier:
    if code == "ghn":
        return GhnAdapter(GhnSdk())
    if code == "flat":
        return FlatCarrier()
    raise ValueError(f"unknown carrier {code}")


# --- Behavioral: Strategy (ở Python, strategy thường chỉ là một hàm) ----
FeeRule = Callable[[int, int], int]          # (phí ship, giá trị đơn) -> phí cuối


def normal(fee: int, order_value: int) -> int:
    return fee


def free_over_500k(fee: int, order_value: int) -> int:
    return 0 if order_value >= 500_000 else fee


def shipping_fee(carrier: Carrier, rule: FeeRule, weight_g: int, order_value: int) -> int:
    return rule(carrier.quote(weight_g), order_value)


print(shipping_fee(make_carrier("ghn"), normal, 1_000, 300_000))          # 20000
print(shipping_fee(make_carrier("ghn"), free_over_500k, 1_000, 600_000))  # 0
print(shipping_fee(make_carrier("flat"), normal, 1_000, 300_000))         # 30000
```

| Phần code | Nhóm | Nó làm gì linh hoạt |
|---|---|---|
| `make_carrier("ghn")` | Creational | `shipping_fee` không biết class cụ thể nào được `new`. Thêm hãng mới chỉ sửa một chỗ. |
| `GhnAdapter` | Structural | SDK `calc_fee(dict) -> dict` khớp được vào port `quote(int) -> int` mà không sửa SDK. |
| `normal` / `free_over_500k` | Behavioral | Đổi luật tính phí lúc chạy mà không sửa `shipping_fee`. |

> `make_carrier` ở đây là **Simple Factory** (một hàm `if/else`), chưa phải **Factory Method** của GoF. Phân biệt hai cái này là bài D10.

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3 --strict` (`experimentalDecorators`), `@nestjs/common` 10, Node 22.

- **Cú pháp `@` không phải Decorator pattern.** `@Injectable()` của NestJS chỉ **gắn metadata** lên class, không bọc thêm hành vi:
  ```ts
  class Plain { hello() { return 'hi'; } }
  @Injectable() class Svc { hello() { return 'hi'; } }

  Reflect.getMetadataKeys(Plain);  // []
  Reflect.getMetadataKeys(Svc);    // [ '__injectable__', 'scope:options' ]
  ```
  Container đọc metadata đó để biết cách tạo class. GoF Decorator là **một object bọc object khác cùng interface** để thêm hành vi. Hai thứ trùng tên, khác bản chất.
- Python `@functools.lru_cache` thì gần với Decorator pattern hơn (bọc hàm, giữ cách gọi, thêm cache), nhưng ở mức **hàm**, không phải mức object.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"Biết nhiều pattern = thiết kế tốt."** Không. Nhét pattern khi chưa có vấn đề là over-engineering: thêm class, thêm lớp gián tiếp, khó đọc hơn. Hỏi trước: *vấn đề lặp lại ở đây là gì?*
- **Gọi sai tên.** Gọi mọi hàm `create_x()` là "Factory pattern", mọi class bọc là "Decorator". Gọi sai tên làm mất đúng cái lợi lớn nhất của pattern là giao tiếp chính xác.
- **Học thuộc sơ đồ UML, quên phần Consequences.** Lúc review, câu hỏi đúng là *"dùng pattern này mình trả giá gì?"*, không phải *"vẽ đúng sơ đồ chưa?"*.
- **Nhầm `@decorator` của ngôn ngữ với Decorator pattern** (xem khối 🟦 trên).

### 🏛️ Góc nhìn Solution Architect

- Ý tưởng "lời giải có tên cho vấn đề lặp lại" có ở **mọi tầng**. GoF ở tầng class/object. Ở tầng hệ thống có Circuit Breaker, Retry, Saga, Outbox, CQRS, Strangler Fig. Cách học giống nhau: intent → vấn đề → cấu trúc → trade-off.
- Trong ADR (Architecture Decision Record) và design review, tên pattern là đơn vị trao đổi: *"Dùng Outbox để đảm bảo ghi DB và publish event cùng thành công"* là một câu đủ để cả team thảo luận trade-off.
- Nhiều pattern GoF là cách **bù cho thiếu hụt của ngôn ngữ** (C++/Java 1994). Với TS/Python, hãy hỏi "ngôn ngữ đã có sẵn cái này chưa?" (hàm, closure, module, generator, `EventEmitter`) trước khi viết đủ bộ class.

### ✅ Tự kiểm tra cho #1-#2 (trả lời bằng tiếng Anh)

1. 🇬🇧 In your own words: what is a design pattern, and why does its *name* matter? 🇻🇳 Pattern là gì, vì sao cái *tên* quan trọng?
2. 🇬🇧 Put these 7 patterns into the 3 GoF groups: Singleton, Factory Method, Builder, Strategy, Observer, Adapter, Decorator. 🇻🇳 Xếp 7 pattern vào 3 nhóm.
3. 🇬🇧 Adapter and Decorator are in the same group. Why? What is the one-line difference? 🇻🇳 Vì sao cùng nhóm, khác nhau ở đâu (một dòng)?
4. 🇬🇧 A teammate says: "`@Injectable()` in NestJS is the Decorator pattern." Right or wrong? Why? 🇻🇳 Đúng hay sai, vì sao?
5. 🇬🇧 Name the group: (a) "We have 3 discount rules and want to switch between them at runtime." (b) "The payment SDK returns XML; our code expects a `PaymentResult` object." (c) "An order object has 12 optional fields and creating it is error-prone." 🇻🇳 Mỗi vấn đề thuộc nhóm nào?

<details><summary>Đáp án / Key points</summary>

**1.** *A design pattern is a named, proven solution to a design problem that keeps coming back. It is an idea to adapt, not code to copy. The name matters because it is a shared vocabulary: one word tells the team the structure and the trade-offs, so design talks and code reviews are faster and more precise.*

**2.** Creational: Singleton, Factory Method, Builder. Structural: Adapter, Decorator. Behavioral: Strategy, Observer.

**3.** *Both wrap another object, so both are about how objects are put together (structural). Adapter changes the interface; Decorator keeps the interface and adds behaviour.*

**4.** *Wrong. `@Injectable()` only attaches metadata (`__injectable__`, `scope:options`) that the DI container reads; it does not wrap the class or add behaviour. The GoF Decorator is an object that wraps another object with the same interface to add behaviour. Same word, different idea.*

**5.** (a) Behavioral (Strategy). (b) Structural (Adapter: đổi XML/SDK thành interface của ta). (c) Creational (Builder, bài D11).

</details>

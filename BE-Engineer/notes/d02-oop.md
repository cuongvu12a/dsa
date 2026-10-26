# D2: Bốn tính chất OOP (tổng hợp)

← [Tuần 1](../100-ngay/tuan-01.md) · Phạm vi: mục #1 đến #7 của D2 (số theo roadmap; #8, #9 của roadmap là T3 nên không ghi). Mục 8, 9 trong file này là phần tổng hợp thêm

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python; khác biệt của **TypeScript/JavaScript** nằm trong khối 🟦 cuối mỗi mục (đã biên dịch strict và chạy thử trên Node 20).
> Nhãn: 🔴 T1 = nhớ và dạy lại được · 🟡 T2 = hiểu, nhớ tiêu chí chọn · 🟢 T3 = biết để tra khi cần · 📎 = đọc thêm

---

## Mục lục

1. [Class vs Object, state vs behavior](#1-class-vs-object-state-vs-behavior) · 🔴 T1
2. [Encapsulation và invariant](#2-encapsulation-và-invariant) · 🔴 T1
3. [Abstraction, và khác Encapsulation chỗ nào](#3-abstraction-và-khác-encapsulation-chỗ-nào) · 🔴 T1
4. [Inheritance](#4-inheritance) · 🔴 T1
5. [Polymorphism](#5-polymorphism) · 🔴 T1
6. [Interface vs Abstract class](#6-interface-vs-abstract-class) · 🟡 T2
7. [Tell, Don't Ask](#7-tell-dont-ask) · 🔴 T1
8. [Khung nhớ nhanh cho 4 tính chất](#8-khung-nhớ-nhanh-cho-4-tính-chất) · 🔴 T1 · khung tổng hợp
9. [Thẻ Anki kèm đáp án](#9-thẻ-anki-kèm-đáp-án) · 🔴 T1
10. [Câu hỏi cuối bài](#10-câu-hỏi-cuối-bài)

---

## 1. Class vs Object, state vs behavior

> 🔴 T1

🇬🇧 **A class is a blueprint. An object is one real thing built from it.** State is what an object *knows*. Behavior is what it *does*.

🇻🇳 Class là khuôn, object là từng cái bánh. State là dữ liệu đang giữ (danh từ), behavior là việc làm được (động từ). **State và behavior nằm cùng nhau trong một object**: đó là ý gốc của OOP.

**Câu một câu cần nói được:** *A class defines the state and behavior; an object is one instance of it with its own state.*

```python
class Order:
    def __init__(self, order_id, items):
        self.order_id, self.items, self.status = order_id, items, "PENDING"
    def pay(self):    self.status = "PAID"
    def cancel(self): self.status = "CANCELLED"

a, b = Order("1001", ["shirt"]), Order("1002", ["mug"])
a.pay()   # chỉ a đổi, b vẫn PENDING
```

### ⭐ Class-level mutable state = global state trá hình

| Đặt ở đâu | Số bản |
|---|---|
| `self.items = []` trong `__init__` | mỗi object một bản |
| `items = []` ngay dưới `class` | **một bản cho cả class** |

Python đọc `obj.items` thì tìm ở object trước, không có thì **đi lên class**. Nên code trông giống hệt trường hợp đúng, nhưng bạn đang dùng list chung.

**Phản xạ: gán dời mũi tên, hàm sửa tại chỗ đổi vật ở đầu mũi tên.**

> 🇬🇧 *Assignment moves the arrow. A mutating method changes the thing the arrow points to.*

| Thao tác | Tác động |
|---|---|
| `u1.tags = [...]` | tạo thuộc tính riêng trong `u1`, chỉ `u1` đổi |
| `u1.tags.append(...)` | sửa list chung, **mọi object** thấy |
| `c1.items += [...]` (list) | `+=` với list vừa sửa tại chỗ vừa gán, **vẫn ảnh hưởng chung** |
| `c1.total += 1` (int) | chỉ gán, riêng `c1` |

**Class attribute không xấu. Xấu là khi nó vừa chung vừa sửa tại chỗ được.**

| Loại | Ví dụ | An toàn? |
|---|---|---|
| Immutable | `MAX_RETRY = 3`, `frozenset(...)` | ✅ vẫn là **một bản chung**, nhưng không sửa tại chỗ được |
| Mutable bị sửa lúc chạy | `cache = {}`, `items = []` | ❌ |

⚠️ Python không có "primitive giữ giá trị" như JS. `MAX_RETRY = 3` ở class-level **vẫn là một bản dùng chung**, an toàn vì int không sửa tại chỗ được.

| JS | Python |
|---|---|
| primitive (number, string) | immutable (int, str, tuple, frozenset) |
| object, array | mutable (list, dict, set, object) |

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Class và object là một | Class là kiểu, object là giá trị |
| Dữ liệu giống nhau thì là một object | Khác **identity**: `==` so giá trị, `is` so identity |
| Có class là làm OOP | Class chỉ chứa data, logic ở ngoài thì là cái túi dữ liệu |

### 🏛️ Góc nhìn Solution Architect

- State là thứ khó nhất của hệ thống: phải lưu, đồng bộ, khoá, migrate. Hỏi đầu tiên: *state này nằm đâu, ai được đổi?*
- Object trong RAM chết khi process restart. Service **stateless** dễ scale ngang vì state nằm ở DB/Redis, không ở RAM từng server.
- Class-level mutable state là global ngầm: race condition khi nhiều request, test phụ thuộc nhau, mỗi server một giá trị, cache không hết hạn. Hậu quả điển hình: quyền đã thu hồi mà cache cũ vẫn cho vào.
- **Nối D1:** `obj.attr` thực chất là tra dict của object, tức HashMap, O(1) trung bình.

### 🟦 TypeScript / JavaScript

| Khác Python | Chi tiết |
|---|---|
| Field trong thân class | `items: string[] = []` là **field riêng của mỗi object** (đo: `a.items.push(...)` không đổi `b.items`). Ngược Python, nơi `items = []` dưới `class` là một bản dùng chung. Muốn một bản cho cả class phải viết **`static`** |
| `this` không tự gắn | `const pay = order.pay; pay()` → `this` là `undefined` → `TypeError` (đo). Truyền method làm callback thì dùng arrow field (`cancel = () => { ... }`) hoặc `.bind(this)` |
| "Gán dời mũi tên" | Vẫn đúng: `const items = []` chỉ khoá **biến**, `items.push(1)` vẫn chạy. `readonly` (TS) chỉ chặn gán lúc compile; `Object.freeze` chặn lúc chạy nhưng **nông** |
| Immutable vs mutable | primitive (`number`, `string`, `boolean`, `bigint`, `symbol`) bất biến; `object`, `array`, `Map`, `Set` theo tham chiếu (đây chính là bảng JS ↔ Python ở trên) |

```ts
class Order {
  status: "PENDING" | "PAID" | "CANCELLED" = "PENDING";
  items: string[] = [];                      // mỗi object một bản
  static registry: Order[] = [];             // static = một bản cho cả class (global ngầm!)
  constructor(readonly orderId: string) {}
  pay(): void { this.status = "PAID"; }
  cancel = (): void => { this.status = "CANCELLED"; };   // this luôn đúng khi truyền đi
}

// ⚠️ Bẫy liên quan: một object được nhân bản bằng tham chiếu
const grid = Array(3).fill([]);              // 3 ô trỏ cùng MỘT mảng
grid[0].push(1);                             // [[1],[1],[1]]
const ok = Array.from({ length: 3 }, () => []);   // mỗi ô một mảng
```

🏛️ **Node:** process sống lâu, nên `const cache = new Map()` ở mức module hay singleton chính là state chung cả process (global ngầm, mục trên). Chạy nhiều worker/pod thì **mỗi nơi một bản**, cache lệch nhau. State cần chia sẻ phải nằm ở Redis/DB.

---

## 2. Encapsulation và invariant

> 🔴 T1

🇬🇧 **Encapsulation means: hide the state, and only allow changes through methods that keep the object valid.**

> An **invariant** is a condition that is always true for a valid object. Example: *an account balance is never negative.*

🇻🇳 Invariant là luật bất di bất dịch của object (số dư ≥ 0, đơn `PAID` không quay lại `PENDING`). Field để mở thì **cả codebase** phải nhớ luật, quên một chỗ là sai tiền. Encapsulation đặt luật **một chỗ duy nhất**, bên ngoài không có đường vi phạm.

**Phản xạ:** *"Luật này do ai giữ?"* Nếu đáp án là "mọi người tự nhớ" thì chưa encapsulate.

```python
class Account:
    def __init__(self, balance: int = 0):
        if balance < 0:
            raise ValueError("balance cannot be negative")
        self._balance = balance            # _ = quy ước "nội bộ"

    @property
    def balance(self) -> int:              # chỉ đọc từ ngoài
        return self._balance

    def withdraw(self, amount: int) -> None:
        if amount <= 0: raise ValueError("amount must be positive")
        if amount > self._balance: raise InsufficientFunds()
        self._balance -= amount
```

Luật được kiểm tra ở **mọi cổng vào**: constructor, `deposit`, `withdraw`. Object không bao giờ ở trạng thái sai, kể cả giữa chừng.

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Encapsulation = làm field `private` | `private` chỉ là công cụ. Mục đích là **bảo vệ invariant** |
| Getter + setter cho mọi field là đã đóng gói | `set_balance(-500)` không khác ghi thẳng. Đây là **anemic model**. Method phải mang nghĩa nghiệp vụ (`withdraw`) |
| Python không có private thì không đóng gói được | Đóng gói là **kỷ luật thiết kế**, ngôn ngữ chỉ hỗ trợ cưỡng chế (`_x` quy ước, `__x` đổi tên) |
| Chỉ cần kiểm tra ở API | Job nền, script, service khác vẫn gọi object. Luật ở object thì mọi đường đều bị chặn |
| Property trả thẳng `self._items` (list) | Caller `clear()`, `append()` được → **rò rỉ**. Trả `tuple(self._items)` hoặc bản sao |

### 🏛️ Góc nhìn Solution Architect

- **Mỗi invariant một chỗ chịu trách nhiệm.** Trong DDD, chỗ đó gọi là aggregate (chỉ cần biết tên).
- Tiền, kho, trạng thái đơn là ba nơi bắt buộc đóng gói.
- **Object chỉ bảo vệ trong bộ nhớ.** Hai request cùng đọc số dư 100 rồi cùng rút 80 trên hai server đều qua kiểm tra, kết quả -60. Lớp bảo vệ cuối phải ở DB: transaction, `UPDATE ... WHERE balance >= 80`, hoặc optimistic lock. **Cần cả hai tầng.**
- Ranh giới module/service cũng là đóng gói: service A không ghi thẳng DB của service B.

### 🟦 TypeScript / JavaScript

| Cơ chế | Cưỡng chế lúc | Ghi chú |
|---|---|---|
| `private` (từ khoá TS) | **compile** | Lúc chạy vẫn là field bình thường: `obj["x"]` hay `as any` đọc được, và `JSON.stringify` **xuất ra** |
| `#x` (ES2022) | **chạy** | private thật, bên ngoài không đọc được, không bị `JSON.stringify`/`Object.keys` thấy |
| `readonly` | compile | chỉ chặn gán; không bảo vệ mảng/object bên trong |

```ts
class Account {
  #balance: number;                                   // private thật
  constructor(balance = 0) {
    if (balance < 0) throw new Error("balance cannot be negative");
    this.#balance = balance;
  }
  get balance(): number { return this.#balance; }     // chỉ đọc từ ngoài
  withdraw(amount: number): void {
    if (amount <= 0) throw new RangeError("amount must be positive");
    if (amount > this.#balance) throw new InsufficientFunds();
    this.#balance -= amount;
  }
}
```

⚠️ **Bẫy riêng của TS/JS:**

- `class User { constructor(private passwordHash: string) {} }` rồi `res.json(user)` → **`passwordHash` bị gửi ra client** (đo: `JSON.stringify` in ra `"passwordHash":"secret"`). `private` của TS không phải bảo mật. Dùng `#x`, hoặc trả về **DTO** chọn đúng field.
- Tiền: `number` là số thực 64-bit (`0.1 + 0.2 === 0.30000000000000004`). Lưu **số nguyên đơn vị nhỏ nhất** (đồng/cent), hoặc `bigint`/thư viện decimal.
- Getter trả thẳng mảng nội bộ vẫn bị `push` từ ngoài. `readonly T[]` chỉ là kiểu, không chặn lúc chạy: trả `[...this.#items]`.

🏛️ **Node chạy một thread nhưng vẫn có race:** giữa hai `await` request khác chen vào. `if (acc.balance >= x) { await audit(); acc.withdraw(x) }` vẫn là check-then-act không an toàn (đúng như phần "hai request cùng rút" ở trên). Tầng DB vẫn phải bảo vệ.

---

## 3. Abstraction, và khác Encapsulation chỗ nào

> 🔴 T1

🇬🇧 **Abstraction means: show what something does, hide how it does it.** The test of a good abstraction: you can replace the implementation and the caller does not change.

🇻🇳 Người dùng chỉ cần biết **contract** (nhận gì, trả gì, lỗi gì), không cần biết cách làm. Lợi ích: caller nhẹ đầu, **đổi ruột không vỡ ngoài**.

### ⭐ Phân biệt Abstraction vs Encapsulation

| | Encapsulation | Abstraction |
|---|---|---|
| Câu hỏi | **Ai** được chạm vào dữ liệu? | Người dùng **cần biết gì**? |
| Hướng | Vào trong: bảo vệ state | Ra ngoài: đơn giản hoá giao diện |
| Bảo vệ | Invariant | Sự đơn giản và khả năng thay thế |
| Cái bị giấu | **Dữ liệu** | **Cách làm** |
| Hỏng thì | State sai, sai tiền | Caller dính chi tiết, đổi ruột là vỡ |

Ví dụ `PaymentGateway`: `charge(amount)` là **abstraction**, giấu `_api_key` và `_retry_count` là **encapsulation**.

> **Cách nhớ:** Encapsulation giấu **dữ liệu** để bảo vệ nó. Abstraction giấu **độ phức tạp** để dễ dùng.

```python
class PaymentGateway(ABC):                 # contract: "làm gì"
    @abstractmethod
    def charge(self, amount: int, token: str) -> str: ...

class StripeGateway(PaymentGateway): ...   # "làm thế nào" #1
class PayPalGateway(PaymentGateway): ...   # "làm thế nào" #2

class CheckoutService:
    def __init__(self, gateway: PaymentGateway):   # chỉ biết contract
        self._gateway = gateway
```

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Abstraction = interface / abstract class | Đó là **một công cụ**. Hàm tên tốt (`send_invoice()`) đã là abstraction |
| Càng nhiều tầng càng tốt | Thừa tầng khó đọc, khó debug. Chỉ trừu tượng hoá khi có lý do đổi hoặc chi tiết phức tạp |
| Tên `charge_via_stripe()` | **Leaky abstraction**: caller dính Stripe. Đặt tên theo nghiệp vụ |
| Mỗi gateway ném lỗi riêng | Caller phải biết cả hai → rò. Contract định nghĩa lỗi chung (`PaymentDeclined`), mỗi gateway tự dịch |

### 🏛️ Góc nhìn Solution Architect

- Abstraction là **khớp nối để thay đổi**. Xác định trước thứ *sẽ đổi* (nhà cung cấp thanh toán, nơi lưu file, nhà vận chuyển) và đặt abstraction quanh chúng.
- **Contract gồm cả lỗi và hiệu năng.** Hai gateway cùng `charge()`, một cái 200ms, một cái 8 giây. Contract không nói thì caller đặt timeout sai.
- Ranh giới service là abstraction ở quy mô hệ thống: API ổn định, ruột tự do.
- **Nối D1:** abstraction giấu cả độ phức tạp thời gian. `find_user(id)` có thể là O(1) hay quét bảng O(n). Khi review hỏi *"bên dưới nó chạy O(?)"*.

### 🟦 TypeScript / JavaScript

```ts
interface PaymentGateway {                               // contract: "làm gì"
  charge(amountMinor: number, token: string): Promise<ChargeResult>;
}
type ChargeResult =
  | { ok: true; txId: string }
  | { ok: false; reason: "DECLINED" | "TIMEOUT" };       // lỗi chung, mỗi gateway tự dịch

class StripeGateway implements PaymentGateway { /* ... */ }
class CheckoutService { constructor(private readonly gateway: PaymentGateway) {} }
```

- **`interface` là structural:** chỉ cần cùng "hình dạng", không bắt buộc `implements` (đo: object literal có `charge()` gán được vào biến kiểu `PaymentGateway`). Đây là duck typing có type check. Rất tiện để mock khi test.
- **Contract gồm cả bất đồng bộ và lỗi.** TS **không có checked exception**: chữ ký không nói hàm ném lỗi gì. Hoặc ghi vào tài liệu, hoặc đưa lỗi vào **kiểu trả về** (`Result` ở trên) để caller buộc phải xử lý.
- **Kiểu bị xoá lúc chạy.** Dữ liệu từ API ngoài/JSON/DB không được TS kiểm tra. Contract ở ranh giới hệ thống cần **validate lúc chạy** (zod, ajv...) chứ không chỉ khai báo kiểu.

---

## 4. Inheritance

> 🔴 T1

🇬🇧 **Inheritance lets a child class get everything from a parent class, then add or change parts.**

| Ý | Nghĩa |
|---|---|
| **is-a** | Chỉ kế thừa khi con *thật sự là một loại của* cha |
| **override** | Con thay method của cha bằng bản của mình |
| **`super()`** | Con gọi bản của cha, để **mở rộng** thay vì thay hoàn toàn |

🇻🇳 **Phép thử is-a:** đặt câu "X là một Y", rồi hỏi "mọi chỗ dùng Y có dùng X được không?". `CreditCardPayment` thay `Payment` ở mọi nơi được. `Order` kế thừa `list` thì không. Đây là mầm của nguyên lý Liskov (D4).

```python
class Payment:
    def pay(self):                       # khung chạy
        self._validate(); self._execute(); self.status = "PAID"
    def _validate(self):
        if self.amount <= 0: raise ValueError("amount must be positive")
    def _execute(self): raise NotImplementedError

class CodPayment(Payment):
    def _execute(self): ...              # override
    def _validate(self):                 # override + dùng lại cha
        super()._validate()
        if self.amount > 5_000_000: raise ValueError("COD limit exceeded")
```

Con quyết định chi tiết, cha giữ khung chạy (Template Method, chỉ cần biết tên).

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Kế thừa để dùng lại code | Lý do **yếu nhất**. Dùng lại code thì ưu tiên composition (D3) |
| Hai class giống nhau chút thì chung cha | Giống code ≠ giống khái niệm. `Invoice` và `Order` đều có `total` nhưng không is-a |
| Quên `super().__init__()` | Con mất state của cha, lỗi `AttributeError` lộ xa chỗ gây ra |
| Override mà đổi ý nghĩa | Con **được đổi cách làm, không được phá cam kết** của cha (LSP, D4) |
| Cây sâu 4–5 tầng | Đọc một method phải lần nhiều file. **1–2 tầng là đủ** |
| Gõ sai tên method override | Python **không báo lỗi**, chỉ lặng lẽ không override. Dùng `@abstractmethod` hoặc type checker |

⚠️ **Rủi ro lớn nhất (học kỹ ở D3):** *fragile base class*. Cha đổi một dòng, nhiều con có thể vỡ. Kế thừa là ràng buộc mạnh nhất giữa hai class.

### 🏛️ Góc nhìn Solution Architect

- Kế thừa là **coupling mạnh nhất** trong OOP. Quy tắc phổ biến: *prefer composition over inheritance*, chỉ cho kế thừa ở cây ngắn, ổn định, cùng module.
- **Không kế thừa qua ranh giới module/service.** Ranh giới nên là interface/contract.
- `Payment → CreditCard/COD/Wallet` ổn khi các loại chung vòng đời. Khi các loại khác nhau nhiều (hoàn tiền, đối soát, webhook riêng), cây phình, chuyển sang **strategy** (D3, D4).
- Ánh xạ cây kế thừa sang bảng DB có trade-off riêng và hay gây rắc rối migration.
- **Nối D1:** Python tra method qua chuỗi class (MRO), mỗi bước là tra dict O(1). Cái đắt là chi phí **đọc hiểu**, không phải CPU.

### 🟦 TypeScript / JavaScript

```ts
abstract class Payment {
  status = "NEW";
  constructor(protected readonly amount: number) {}
  pay(): void { this.validate(); this.execute(); this.status = "PAID"; }   // khung chạy
  protected validate(): void {
    if (this.amount <= 0) throw new Error("amount must be positive");
  }
  protected abstract execute(): void;
}

class CodPayment extends Payment {
  protected override execute(): void { /* ... */ }
  protected override validate(): void {            // override + dùng lại cha
    super.validate();
    if (this.amount > 5_000_000) throw new Error("COD limit exceeded");
  }
}
```

| Điểm | TS/JS |
|---|---|
| Gõ sai tên method override | Bật **`noImplicitOverride`** và dùng `override`: gõ sai là **lỗi compile** (đo: `TS4113`). Python để lặng lẽ không override |
| Constructor con | Phải gọi `super(...)` **trước khi** dùng `this` (và trước khi truy cập field của con) |
| `abstract`, `protected` | Chỉ cưỡng chế lúc **compile** (đo: `new` class abstract bị chặn bởi trình biên dịch) |
| Kế thừa `Error` | Đặt `this.name`; cần `target ≥ ES2015`, nếu không `instanceof` sai |
| Đa kế thừa | JS **chỉ một cha**. Muốn ghép khả năng thì composition hoặc mixin (D3 #5) |

🏛️ Bật `noImplicitOverride` trong `tsconfig` của dự án để bắt lỗi gõ sai tên override ngay lúc compile.

---

## 5. Polymorphism

> 🔴 T1

🇬🇧 **Polymorphism means: one call, many behaviors. The caller does not care which exact type it talks to.**

| Loại | Chọn method khi nào | Trong Python |
|---|---|---|
| **Subtype / runtime** (dynamic dispatch) | **Lúc chạy**, theo kiểu **thật** của object | ✅ override (mục #4) |
| **Overloading** | **Lúc compile**, theo tham số | ❌ không có |
| **Duck typing** | Lúc chạy, theo "có method không?" | ✅ rất phổ biến |

```python
def checkout(payment: Payment) -> None:
    payment.pay()          # không biết loại nào, không cần biết

for p in [CreditCardPayment(...), CodPayment(...), WalletPayment(...)]:
    checkout(p)            # thêm WalletPayment: checkout KHÔNG sửa dòng nào
```

**Phản mẫu thiếu đa hình:** `if payment.type == "CARD": ... elif "COD": ...`. Mỗi loại mới phải sửa hàm này **và mọi hàm tương tự** (báo cáo, hoàn tiền, huỷ). Quên một chỗ là bug.

**Duck typing:** không cần cha chung, chỉ cần có `.charge()`. Tiện cho test (thay gateway thật bằng giả). Đổi lại **lỗi chỉ lộ lúc chạy** và contract ngầm. Nên ghi bằng `Protocol` + type checker.

**Overloading Python:** định nghĩa trùng tên thì cái sau **đè** cái trước. Thay bằng tham số mặc định, `*args`, hoặc `functools.singledispatch`.

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Overloading và Overriding là một | **Overriding** = con viết lại method cha (runtime). **Overloading** = cùng tên khác tham số (compile time) |
| Python có overloading | Không, cái sau đè cái trước |
| Có `isinstance` / `if type ==` là OK | Thường là mùi code: bạn tự làm việc của polymorphism. Ngoại lệ: ranh giới hệ thống (parse input ngoài) |
| Duck typing = không cần contract | Contract vẫn có, chỉ **ngầm** |
| Runtime polymorphism cần kế thừa | Không nhất thiết, duck typing cho hiệu quả tương tự |

### 🏛️ Góc nhìn Solution Architect

- Biến "thêm tính năng" thành **"thêm file" thay vì "sửa file cũ"**. Code cũ đã test và chạy production không bị đụng, rủi ro hồi quy giảm. Đây là OCP (D4).
- **Đếm `elif` phải thêm ở mấy chỗ khi có loại mới.** Từ 3 chỗ trở lên nên cân nhắc polymorphism.
- Với 2–3 loại cố định, ít đổi, một `if/elif` rõ ràng **dễ đọc hơn** cả cây class. Hỏi: *loại mới có hay xuất hiện không?*
- Hệ lớn dùng duck typing nên có `Protocol` + mypy/pyright trong CI để bắt lỗi sớm.
- Ở quy mô service, nhiều service cùng cam kết một API thì gateway gọi đồng nhất: polymorphism ở mức mạng.
- **Nối D1:** dynamic dispatch là tra tên method trong dict của class, O(1) trung bình. Giá CPU không đáng kể.

### 🟦 TypeScript / JavaScript

- **Duck typing = structural typing có type check.** Object có đủ method là thay thế được, không cần kế thừa.
- **Overloading:** TS cho khai báo nhiều *chữ ký* nhưng **chỉ một phần cài đặt**; chọn nhánh bằng `typeof` lúc chạy. Đây là overloading về **kiểu**, không phải hai hàm riêng như Java.

```ts
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number): number | string {
  return typeof x === "string" ? Number(x) : String(x);
}
```

- **Lựa chọn thứ ba: discriminated union + `switch` kiểm tra đầy đủ.**

```ts
type Pay =
  | { kind: "card"; last4: string }
  | { kind: "cod"; limit: number }
  | { kind: "wallet"; walletId: string };

function fee(p: Pay): number {
  switch (p.kind) {
    case "card":   return 2;
    case "cod":    return 5;
    case "wallet": return 0;
    default: { const _x: never = p; return _x; }   // thêm loại mới mà quên case → LỖI COMPILE
  }
}
```

Dòng `never` giải quyết đúng điểm đau của `if type ==` ở trên: **compiler chỉ ra mọi chỗ quên**. Hai cách đánh đổi ngược nhau:

| Thay đổi hay xảy ra | Chọn | Vì sao |
|---|---|---|
| Thêm **loại** mới (nhà cung cấp, kênh) | Polymorphism (class/interface) | thêm file, không sửa code cũ |
| Thêm **thao tác** mới trên tập loại **cố định** | Union + `switch` | thêm một hàm, compiler soát hết các loại |

Hai cách đối ngược nhau nên **chọn theo hướng thay đổi**. Union hợp với dữ liệu đã biết hết các biến thể (kết quả API, event, trạng thái). Kiểu bị xoá lúc chạy nên dữ liệu từ ngoài cần validate trước khi tin vào `kind`.

---

## 6. Interface vs Abstract class

> 🟡 T2

🇬🇧 **Both are tools for abstraction. The question is: do I only promise behavior (interface), or do I also share code (abstract class)?**

🇻🇳 Trục so sánh: **mức ràng buộc** vs **tái sử dụng code**. Bảng đầy đủ nằm ở [tradeoff-cheatsheet.md](tradeoff-cheatsheet.md). Đây là bản tóm tắt:

| Tiêu chí | Interface | Abstract class |
|---|---|---|
| Use-case lý tưởng | Nhiều cài đặt cùng một cam kết, cần mock, ranh giới module/service (`PaymentGateway`) | Nhóm class cùng khung chạy, khác vài bước (`BasePayment`: validate → execute → mark PAID) |
| Trade-off chính | Linh hoạt, coupling thấp; **không** chia sẻ code, thêm method thì mọi cài đặt vỡ | Tái dùng code; coupling cao (fragile base class), thường chỉ 1 cha |
| Khi nào KHÔNG dùng | Chỉ có một cài đặt không đổi (thừa tầng); interface quá to | Chỉ muốn mượn code (dùng composition); đặt ở ranh giới module |
| Chứa state/implementation? | Không (Java 8+: `default method`, không có state) | Có |
| Implement/kế thừa mấy cái? | Nhiều | Một (Java, C#); Python cho nhiều nhưng nên tránh |

**Python:** không có từ khoá `interface`. Hai cách mô phỏng: `ABC` chỉ chứa `@abstractmethod` (kế thừa), hoặc `typing.Protocol` (duck typing, không cần kế thừa).

```python
from abc import ABC, abstractmethod

class Refundable(ABC):                    # "interface": chỉ cam kết
    @abstractmethod
    def refund(self, amount: int) -> None: ...

class BasePayment(ABC):                   # abstract class: khung + state + code chung
    def __init__(self, order_id: str, amount: int):
        self.order_id, self.amount, self.status = order_id, amount, "PENDING"
    def pay(self) -> None:
        self._validate(); self._execute(); self.status = "PAID"
    def _validate(self) -> None:
        if self.amount <= 0: raise ValueError("amount must be positive")
    @abstractmethod
    def _execute(self) -> None: ...       # con bắt buộc tự viết

class CardPayment(BasePayment, Refundable): ...   # một cha + một cam kết
```

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Cái nào "tốt hơn" | Không có. Đây là trade-off, mỗi cái hợp một bài toán |
| Abstract class = interface có thêm method | Khác **vai trò**: cam kết thuần vs khung code dùng chung |
| Dùng abstract class chỉ để mượn code | Quay lại bẫy kế thừa (#4). Chỉ mượn code thì dùng composition (D3) |
| Đặt interface cho mọi class "cho chuẩn" | Thừa tầng (#3). Đáng có khi nhiều cài đặt hoặc cần mock |
| Python không có interface nên khỏi dùng | Vẫn dùng ABC/Protocol, cưỡng chế yếu hơn nên kỷ luật nằm ở bạn |

### 🏛️ Góc nhìn Solution Architect

- **Interface đặt ở ranh giới module/service, abstract class đặt bên trong một module.** Ranh giới cần coupling thấp nhất. Lộ abstract class ra ngoài thì bên ngoài bị buộc vào ruột bạn.
- **Interface công khai khó đổi:** thêm method làm vỡ mọi cài đặt, kể cả ở team khác. Giữ interface **nhỏ và hẹp** (nhiều interface nhỏ tốt hơn một interface to, sẽ gặp lại ở ISP, D4).
- **Dễ test:** code phụ thuộc interface thì thay bằng bản giả. Phụ thuộc abstract class cụ thể thì kéo theo state và logic của cha.
- **Cần cả hai:** tách interface cho cam kết, class cơ sở cho code dùng chung.

### 🟦 TypeScript / JavaScript

| | `interface` / `type` | `abstract class` |
|---|---|---|
| Tồn tại lúc chạy | **Không** (bị xoá). `x instanceof Iface` là lỗi compile (đo) | **Có** |
| Chứa state/implementation | Không | Có |
| Khớp kiểu | Structural (chỉ cần đúng hình dạng) | Cũng structural, trừ khi có member `private`/`#` thì thành "danh nghĩa" |
| Một class dùng được mấy cái | `implements A, B, C` | `extends` **một** |

⚠️ **Bẫy backend hay gặp (NestJS, Angular DI):** interface bị xoá lúc chạy nên **không dùng làm injection token** được. Hai cách: (1) dùng `abstract class` làm token (nó tồn tại lúc chạy), (2) token riêng (`Symbol`/string) kèm `interface` để định kiểu. Nên chọn (2) khi không muốn chia sẻ code, (1) khi muốn tiện mà chấp nhận class.

**Phản xạ:** *cam kết hành vi → `interface`; chia sẻ code → ưu tiên composition, chỉ `abstract class` khi có khung chạy chung* (xem bảng ở [tradeoff-cheatsheet.md](tradeoff-cheatsheet.md)).

---

## 7. Tell, Don't Ask

> 🔴 T1

🇬🇧 **Tell the object what to do. Do not ask for its data and decide for it.**

| | Ask (hỏi rồi tự làm) | Tell (bảo object tự làm) |
|---|---|---|
| Cách làm | Lấy state ra → quyết định **bên ngoài** → sửa state | Gọi một method, object **tự quyết** |
| Luật nằm ở | Nơi gọi (rải nhiều chỗ) | **Trong object** (một chỗ) |

🇻🇳 Mọi `if order.status == ...: order.status = ...` ở bên ngoài là bạn đang **kéo luật của object ra khỏi object**. Đây là cách encapsulation (#2) bị phá lặng lẽ, và là nguồn gốc của *anemic model*.

```python
# ❌ Ask
if order.status in ("PENDING", "PAID"):
    order.status = "CANCELLED"
    if order.paid_amount > 0:
        refund(order)

# ✅ Tell
order.cancel()

class Order:
    def cancel(self) -> None:
        if self._status in ("SHIPPED", "DELIVERED"):
            raise CannotCancel(self._status)
        self._status = "CANCELLED"       # luật nằm đúng một chỗ
```

**Phản xạ khi review:** thấy chuỗi *đọc field → `if` → ghi field* trên **cùng một object** thì dừng lại hỏi: *"đoạn này có nên là method của object đó?"*

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Cấm mọi getter | Không. **Truy vấn để hiển thị/báo cáo** (đọc `status` để render UI) là bình thường. Nguyên tắc nhắm vào **ra quyết định rồi sửa state** |
| `order.cancel()` phải làm hết, kể cả gọi gateway hoàn tiền | Object nên giữ **luật của chính nó**. Việc chạm bên ngoài (gọi API, gửi mail) thuộc service điều phối |
| Chuỗi `order.customer.address.city` | Vi phạm **Law of Demeter**: bạn đang ask xuyên nhiều tầng. Thêm `order.shipping_city()` hoặc tương tự |
| Tell = method không trả gì | Method vẫn có thể trả kết quả hoặc ném lỗi. Điểm mấu chốt là **ai quyết định** |

### 🏛️ Góc nhìn Solution Architect

- **Luật nằm một chỗ → đổi luật sửa một chỗ.** Thêm trạng thái `ON_HOLD` thì chỉ sửa `Order.cancel()`, không phải săn 12 chỗ `if` trong service, job, controller.
- **Cùng nguyên lý ở tầng API:** `POST /orders/{id}/cancel` (tell, một hành động có nghĩa) tốt hơn `PATCH /orders/{id} {"status": "CANCELLED"}` (ask: client tự quyết trạng thái, server mất khả năng kiểm soát luật).
- **Check-then-act không an toàn khi đồng thời.** `if status == PENDING: status = CANCELLED` ở bộ nhớ có thể thua race (nối bài `withdraw` ở #2). Tầng DB phải bảo vệ: `UPDATE orders SET status='CANCELLED' WHERE id=? AND status IN ('PENDING','PAID')` rồi kiểm tra số dòng bị ảnh hưởng.
- Phân tầng gọn: **object giữ luật của mình, service điều phối nhiều object và I/O, DB bảo vệ khi đồng thời.**

### 🟦 TypeScript / JavaScript

```ts
class Order {
  #status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" = "PENDING";
  cancel(): void {
    if (this.#status === "SHIPPED" || this.#status === "DELIVERED") throw new CannotCancel(this.#status);
    this.#status = "CANCELLED";                      // luật nằm đúng một chỗ
  }
}
```

- **Anemic model là phong cách mặc định của nhiều backend TS:** `interface Order { status: string }` cộng một `OrderService` đầy hàm sửa field. Chạy được, nhưng luật rải ra nhiều nơi (đúng điều Tell, Don't Ask cảnh báo). Nếu dùng kiểu này, ít nhất gom luật vào **một module** thay vì mỗi controller một bản.
- Union literal (`"PENDING" | "PAID"`) chặn gán sai **lúc compile**, nhưng giá trị từ DB/JSON có thể sai lúc chạy: validate ở ranh giới.
- Node vẫn có race giữa các `await`: `UPDATE ... WHERE status IN (...)` ở tầng DB vẫn cần.

---

## 8. Khung nhớ nhanh cho 4 tính chất

> 🔴 T1 · khung tổng hợp

| Tính chất | Câu hỏi nó trả lời | Giấu cái gì | Công cụ | Hỏng thì |
|---|---|---|---|---|
| **Encapsulation** | **Ai** được chạm vào dữ liệu? | Dữ liệu (state) | Method có kiểm soát, `_x`, không getter/setter "ngu" | Invariant bị phá, sai tiền |
| **Abstraction** | Người dùng **cần biết gì**? | Cách làm | Contract, interface/ABC, tên theo nghiệp vụ | Caller dính chi tiết, đổi ruột là vỡ |
| **Inheritance** | Cái gì **là một loại của** cái gì? | (chia sẻ) khung chung | `class Child(Parent)`, override, `super()` | Fragile base class, cây sâu, coupling chặt |
| **Polymorphism** | Làm sao **một lời gọi, nhiều hành vi**? | Kiểu thật của object | Override + dynamic dispatch, duck typing | `if type ==` rải khắp nơi, thêm loại phải sửa nhiều chỗ |

**Chuỗi nối các ý:**
Object gom **state + behavior** (#1) → **Encapsulation** giữ invariant bằng method (#2) → **Tell, Don't Ask** là cách viết code để luật ở lại trong object (#7) → **Abstraction** cho caller chỉ thấy contract (#3) → **Inheritance** và **Interface** là hai cách đưa nhiều cài đặt vào cùng một contract (#4, #6) → **Polymorphism** là lợi ích: thêm loại mới không sửa code cũ (#5).

**5 phản xạ khi review code OOP:**

1. Thấy `= []`, `= {}` ở **class level** → hỏi: có bị sửa lúc chạy không? (#1)
2. Thấy `set_x()` hoặc ghi field từ ngoài → hỏi: **luật này do ai giữ?** (#2)
3. Thấy tên lộ công nghệ (`..._via_stripe`) hoặc caller bắt lỗi riêng từng nhà cung cấp → **leaky abstraction** (#3)
4. Thấy kế thừa chỉ để mượn code, hoặc cây sâu hơn 2 tầng → cân nhắc composition (#4, D3)
5. Thấy chuỗi *đọc field → `if` → ghi field* trên cùng object, hoặc `if type ==` lặp ở nhiều nơi → chuyển luật vào object, dùng polymorphism (#5, #7)

**Ba tầng bảo vệ (nối bài `withdraw`, `cancel`):** object giữ luật của mình → service điều phối nhiều object và I/O → DB bảo vệ khi đồng thời (transaction, `UPDATE ... WHERE`, optimistic lock).

**Mẫu trả lời:** 🇬🇧 *"Encapsulation answers who can touch the data; abstraction answers what the user needs to know. Polymorphism lets me add a new type without changing the caller."*

### 8.1 🟦 TypeScript / JavaScript tương ứng

| Tính chất | Công cụ trong TS |
|---|---|
| Encapsulation | `#x` (private thật), `readonly`, getter, trả bản sao/DTO. ⚠️ `private` của TS không chặn `JSON.stringify` |
| Abstraction | `interface`/`type`, hàm tên theo nghiệp vụ, `Result` cho lỗi |
| Inheritance | `extends` + `override` (bật `noImplicitOverride`) + `super`; chỉ một cha |
| Polymorphism | override/`interface`, structural typing, hoặc union + `switch` kiểm tra đầy đủ (`never`) |

---

## 9. Thẻ Anki kèm đáp án

**🔴 T1** (4 thẻ theo roadmap)

1. **Encapsulation khác Abstraction ở điểm nào? Cho một ví dụ có cả hai.**
   Encapsulation trả lời "ai được chạm vào dữ liệu", bảo vệ state và invariant bên trong. Abstraction trả lời "người dùng cần biết gì", giao diện bên ngoài chỉ nói "làm gì". Ví dụ `PaymentGateway`: `charge(amount)` là abstraction, giấu `_api_key` và `_retry_count` là encapsulation.

2. **"Invariant" là gì? Encapsulation bảo vệ invariant như thế nào?**
   Invariant là điều luôn đúng với object hợp lệ (số dư không âm). Encapsulation giấu state và chỉ cho sửa qua method (`withdraw`) kiểm tra luật ở mọi cổng vào, nên không có đường nào đưa object vào trạng thái sai.

3. **Runtime polymorphism giúp code mở rộng mà không phải sửa như thế nào?**
   Code gọi chỉ biết contract (`payment.pay()`), Python chọn method theo kiểu thật của object lúc chạy. Thêm loại mới (`WalletPayment`) chỉ cần thêm class mới, code gọi không đổi. Nếu dùng `if type == ...` thì mọi hàm rẽ nhánh phải sửa, dễ sót.

4. **Tell, Don't Ask nghĩa là gì?**
   Bảo object làm việc và để nó tự quyết theo luật của nó (`order.cancel()`), thay vì lấy state ra, quyết định bên ngoài rồi sửa state. Luật nằm một chỗ, mọi nơi gọi theo cùng một luật.

**🟡 T2** (1 thẻ)

5. **Khi nào chọn Interface thay vì Abstract class?**
   Chọn interface khi cần cam kết hành vi cho nhiều cài đặt khác nhau, nhất là ở ranh giới module/service hoặc cần mock: linh hoạt, coupling thấp, nhưng không chia sẻ code. Chọn abstract class khi các class cùng khung chạy và chỉ khác vài bước, cần tái dùng code, chấp nhận coupling cao. Chỉ muốn mượn code thì dùng composition.

**🟦 Thẻ bổ sung cho TypeScript**

6. **Trong TS, `private` khác `#x` ở đâu?**
   `private` chỉ được kiểm tra lúc compile; lúc chạy vẫn là field thường, đọc được bằng `obj["x"]` và bị `JSON.stringify` xuất ra (nguy cơ lộ `passwordHash` qua API). `#x` là private thật của JS (ES2022), bên ngoài không đọc được.

7. **`items: string[] = []` trong thân class TS khác Python ở đâu? Muốn một bản dùng chung thì làm sao?**
   Trong TS/JS, field trong thân class được khởi tạo **riêng cho mỗi object** (Python thì `items = []` dưới `class` là một bản chung). Muốn một bản chung phải khai báo `static`.

8. **Thêm một loại mới vào union TS mà quên cập nhật một `switch`, làm sao compiler biết?**
   Thêm nhánh `default: { const _x: never = p; return _x; }`. Khi union có loại chưa được xử lý, `p` không còn là `never` nên compile báo lỗi tại chính `switch` đó.

---

## 10. Câu hỏi cuối bài

> Đáp án mẫu (Claude viết hộ, 26/10/2026). Khi ôn: che đáp án, tự trả lời bằng tiếng Anh trước rồi mới mở.

1. Encapsulation khác Abstraction ở đâu? Cho ví dụ trong code bạn đang làm.
2. Polymorphism lúc chạy (overriding) khác lúc biên dịch (overloading) thế nào?
3. Vì sao để field `public` rồi ai cũng gán giá trị tuỳ ý là phá vỡ encapsulation?
4. *(Câu bổ sung)* Trong `OrderService` có đoạn: `if order.status == "PAID" and order.shipped_at is None: order.status = "CANCELLED"; order.refund_amount = order.total`. Đoạn này vi phạm nguyên lý nào? Nếu có thêm 3 nơi khác cũng huỷ đơn thì rủi ro gì? Bạn sửa thế nào?
5. *(Câu bổ sung)* Hệ thống đang tính tổng diện tích một danh sách `Circle`, `Square`. Cần thêm `Triangle`. Với runtime polymorphism, những file nào phải sửa, file nào không? Nếu code đang viết `if shape.type == "circle": ... elif ...` thì khác gì?

<details><summary>Đáp án</summary>

**1.** Hai khái niệm trả lời hai câu hỏi khác nhau ([mục 3](#3-abstraction-và-khác-encapsulation-chỗ-nào)):

| | Encapsulation | Abstraction |
|---|---|---|
| Câu hỏi | **Ai được chạm** vào state? | **Người dùng cần biết gì**? |
| Nhìn từ | bên trong class | bên ngoài, phía code gọi |
| Công cụ | field private, chỉ sửa qua method có kiểm tra | interface / method đặt tên theo nghiệp vụ |
| Bảo vệ | invariant (số dư không âm, status hợp lệ) | code gọi khỏi chi tiết cài đặt |

Ví dụ backend có cả hai trong một class: `PaymentGateway.charge(order_id, amount) -> ChargeResult`. Code checkout chỉ biết "trừ tiền đơn này" (**abstraction**), không biết có ký HMAC, retry 3 lần, gọi HTTP tới Momo. Bên trong, `_api_key`, `_retry_count`, `_http_client` là private, không ai bên ngoài đọc hoặc gán được (**encapsulation**). Có thể có cái này mà thiếu cái kia: một class toàn field private nhưng method tên `send_post_request_v2(payload: dict)` là có encapsulation mà abstraction tệ.

**2.** ([mục 5](#5-polymorphism))

| | Overriding (runtime) | Overloading (compile time) |
|---|---|---|
| Là gì | lớp con viết lại method của lớp cha / cài method của interface | cùng tên method, khác danh sách tham số |
| Chọn lúc nào, theo gì | **lúc chạy**, theo kiểu **thật** của object (dynamic dispatch) | **lúc biên dịch**, theo kiểu **khai báo** của tham số |
| Giúp mở rộng không sửa code gọi | ✅ thêm `ZaloPayPayment` thì `checkout(payment)` không đổi | ❌ chỉ là tiện cú pháp cho người gọi |
| Python | ✅ | ❌ định nghĩa trùng tên thì cái sau đè; thay bằng tham số mặc định, `singledispatch` |
| TypeScript | ✅ | chỉ nhiều **chữ ký**, một thân hàm, tự rẽ nhánh bằng `typeof` lúc chạy |

Chỉ overriding mới là thứ OCP và DIP dựa vào: `payment.pay(amount)` gọi đúng `MomoPayment.pay` hay `VnpayPayment.pay` tuỳ object truyền vào lúc chạy.

**3.** ([mục 2](#2-encapsulation-và-invariant)) Field `public` ai cũng gán được thì:
- **Không còn cổng kiểm tra invariant.** `account.balance = -500`, `order.status = "SHIPPED"` khi chưa thanh toán: object rơi vào trạng thái sai mà không ai chặn.
- **Luật phải lặp ở mọi chỗ gán.** 10 nơi gán `status` là 10 nơi phải nhớ kiểm tra; một nơi quên là có bug dữ liệu, thường chỉ phát hiện khi đối soát.
- **Không đổi được cách lưu bên trong.** Muốn đổi `balance: float` sang `balance_minor: int` (tránh lỗi làm tròn tiền) thì mọi nơi đọc/ghi field đều phải sửa. Có method `withdraw()`/`deposit()` thì chỉ sửa trong class.
- **Không biết ai đã đổi state.** Debug "vì sao đơn bị CANCELLED" phải grep toàn codebase thay vì đặt breakpoint ở một method.

**4.** Vi phạm **Tell, Don't Ask** và **encapsulation** ([mục 7](#7-tell-dont-ask)): service *hỏi* state của `Order`, *tự quyết* luật huỷ, rồi *gán* thẳng field. `Order` chỉ là túi dữ liệu (anemic model), luật huỷ đơn nằm ngoài object sở hữu nó.

Có 4 nơi cùng huỷ đơn thì rủi ro là **lệch luật**: một nơi quên `refund_amount`, một nơi quên kiểm tra `shipped_at` (huỷ cả đơn đã giao), một nơi thêm luật mới "đơn COD không hoàn tiền" còn 3 nơi kia không. Lỗi kiểu này không làm app crash, chỉ lộ ra khi kế toán đối soát tiền.

Sửa: đưa luật vào `Order.cancel()`, field không cho gán tự do (đã chạy, `mypy --strict` sạch):

```python
class OrderNotCancellable(Exception):
    pass

@dataclass
class Order:
    total: int
    _status: str = "PAID"
    _shipped_at: datetime | None = None
    _refund_amount: int = 0

    @property
    def status(self) -> str:
        return self._status

    def cancel(self) -> None:
        if self._status != "PAID" or self._shipped_at is not None:
            raise OrderNotCancellable(self._status)
        self._status = "CANCELLED"
        self._refund_amount = self.total

# 4 nơi gọi đều chỉ còn: order.cancel()
# Huỷ lần 2 → OrderNotCancellable('CANCELLED'), không hoàn tiền 2 lần
```

Thêm luật COD sau này chỉ sửa đúng một method.

**5.** Với runtime polymorphism (đã chạy, `mypy --strict` sạch):

```python
class Shape(Protocol):
    def area(self) -> float: ...

class Triangle:                        # file mới / class mới
    def __init__(self, base: float, height: float) -> None:
        self.base, self.height = base, height
    def area(self) -> float:
        return self.base * self.height / 2

def total_area(shapes: list[Shape]) -> float:     # KHÔNG sửa
    return sum(s.area() for s in shapes)
```

- **Thêm:** class `Triangle` có `area()`.
- **Sửa:** chỉ nơi **tạo** object (composition root / factory đọc input) để có thể sinh ra `Triangle`.
- **Không sửa:** `Circle`, `Square`, `total_area` và mọi hàm khác chỉ dùng `Shape`. Đây là OCP ([D4](d04-solid-s-o.md)).

Với `if shape.type == "circle": ... elif ...`: **mọi hàm** rẽ nhánh theo loại (`total_area`, `perimeter`, `render`, `to_json`...) đều phải thêm nhánh `triangle`, nằm rải ở nhiều file. Quên một chỗ thì không có lỗi compile, chỉ rơi vào `else` (trả 0 hoặc ném lỗi) lúc chạy. Ngoài đời đây là `if payment_method == "momo" ... elif "vnpay"` lặp ở chỗ tính phí, chỗ gọi API, chỗ xử lý webhook.

Ngoại lệ đáng nhớ: nếu tập loại **cố định** mà hay thêm **thao tác** mới, union + `switch` có kiểm tra `never` (TS) lại tiện hơn, vì compiler chỉ ra mọi chỗ quên (xem khối 🟦 [mục 5](#5-polymorphism)).

</details>

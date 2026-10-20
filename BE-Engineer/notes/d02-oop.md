# D2: Bốn tính chất OOP (tổng hợp)

← [Tuần 1](../100-ngay/tuan-01.md) · Phạm vi: mục #1 đến #7 của D2 (số theo roadmap; #8, #9 của roadmap là T3 nên không ghi). Mục 8, 9 trong file này là phần tổng hợp thêm

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python.
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

**❓ Câu hỏi cuối bài:** làm theo phần "Câu hỏi cuối bài" của D2 trong [tuan-01.md](../100-ngay/tuan-01.md) (5 câu, kể cả câu bổ sung về `OrderService` và `Triangle`). Tự trả lời bằng tiếng Anh trước khi mở đáp án.

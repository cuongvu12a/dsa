# D2: Bốn tính chất OOP (tổng hợp)

← [Tuần 1](../100-ngay/tuan-01.md) · Phạm vi: mục #1 đến #7 của D2 (bỏ #8, #9, thuộc T3)

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python.
> 🚧 Đang soạn dần. Còn thiếu: mục #6 (chờ bảng T2 của bạn), khung phân tích, thẻ Anki.

---

## Mục lục

1. [Class vs Object, state vs behavior](#1-class-vs-object-state-vs-behavior)
2. [Encapsulation và invariant](#2-encapsulation-và-invariant)
3. [Abstraction, và khác Encapsulation chỗ nào](#3-abstraction-và-khác-encapsulation-chỗ-nào)
4. [Inheritance](#4-inheritance)
5. [Polymorphism](#5-polymorphism)
6. [Interface vs Abstract class](#6-interface-vs-abstract-class) (🚧 chờ bảng T2)
7. [Tell, Don't Ask](#7-tell-dont-ask)
8. [Khung nhớ nhanh cho 4 tính chất](#8-khung-nhớ-nhanh-cho-4-tính-chất) (🚧)
9. [Thẻ Anki T1 kèm đáp án](#9-thẻ-anki-t1-kèm-đáp-án) (🚧)

---

## 1. Class vs Object, state vs behavior

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

> 🚧 **Chờ bạn điền bảng T2** vào `tradeoff-cheatsheet.md` rồi gửi mình soát. Sau khi bảng chốt, mình sẽ ghi bản chuẩn vào đây.

**Khung đã nắm (không phải đáp án bảng):**

- Trục so sánh: **mức ràng buộc** vs **tái sử dụng code**.
- Python không có từ khoá `interface`. Hai cách mô phỏng: `ABC` chỉ chứa `@abstractmethod`, hoặc `typing.Protocol` (kiểu duck typing).
- Câu review nên hỏi: *"Mình đang cam kết hành vi (interface) hay chia sẻ code (abstract class)?"*

---

## 7. Tell, Don't Ask

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

> 🚧 Sẽ viết khi học xong #6.

## 9. Thẻ Anki T1 kèm đáp án

> 🚧 Sẽ viết khi học xong #6.

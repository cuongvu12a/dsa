# D3: Composition vs Inheritance (tổng hợp)

← [Tuần 1](../100-ngay/tuan-01.md) · Phạm vi: mục #1 đến #5 của D3 (#5 chỉ giới thiệu, thuộc T3)

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python; khác biệt của **TypeScript/JavaScript** nằm trong khối 🟦 cuối mỗi mục (đã biên dịch strict và chạy thử trên Node 20).
> Nhãn: 🔴 T1 = nhớ và dạy lại được · 🟡 T2 = hiểu, nhớ tiêu chí chọn · 🟢 T3 = biết để tra khi cần
> Phần lý thuyết đã đủ. Bài tập và câu hỏi cuối bài đã có **đáp án mẫu** (Claude viết hộ, 26/10/2026) trong các khối thu gọn: khi ôn, che đáp án, tự làm lại trước rồi mới mở.

---

## Mục lục

1. [is-a vs has-a, và composition là gì](#1-is-a-vs-has-a-và-composition-là-gì) · 🔴 T1
2. [Các vấn đề của kế thừa](#2-các-vấn-đề-của-kế-thừa) · 🔴 T1
3. [Composition + delegation](#3-composition--delegation) · 🔴 T1
4. [Favor composition over inheritance: khi nào vẫn nên kế thừa](#4-favor-composition-over-inheritance-khi-nào-vẫn-nên-kế-thừa) · 🔴 T1
5. [Mixin / Trait](#5-mixin--trait--t3) · 🟢 T3
6. [Khung nhớ nhanh](#6-khung-nhớ-nhanh)
7. [Thẻ Anki T1 kèm đáp án](#7-thẻ-anki-t1-kèm-đáp-án) · 🔴 T1
8. [Câu hỏi cuối bài](#8-câu-hỏi-cuối-bài) · có đáp án mẫu
9. [Bài tập còn nợ](#bài-tập-còn-nợ-làm-khi-có-thời-gian) · có đáp án mẫu

---

## 1. is-a vs has-a, và composition là gì

| English | Nghĩa |
|---|---|
| **is-a** | "là một loại của" (kế thừa) |
| **has-a** | "có / chứa một" (composition) |
| **delegation** | uỷ quyền: object chứa gọi object bên trong làm việc |
| **substitute** | thay thế con vào chỗ cha |
| **role / lifetime** | vai trò (đổi được) / vòng đời của object |

🇬🇧 **"Is-a" means: the child is a special kind of the parent.** You can use the child anywhere the parent is expected, and nothing surprising happens. **"Has-a" means: one object holds another object and uses it.** The holder is *not* a kind of the thing it holds.

🇬🇧 **Composition means: build a class by putting other objects inside it, and ask them to do part of the work.** Asking the inner object to do the work is called **delegation**.

🇻🇳 is-a là cam kết về **hành vi**, không phải về từ ngữ. Composition là mặc định (service nhận service qua constructor là composition), inheritance là ngoại lệ cần lý do.

### Bốn phép thử (chạy theo thứ tự)

| # | Test | Câu hỏi |
|---|---|---|
| 1 | **Sentence** | "X is a kind of Y" đúng trong **nghiệp vụ**, không chỉ trong câu chữ? |
| 2 | **Substitution** | Thay Y bằng X ở mọi nơi, mọi caller vẫn đúng? |
| 3 | **Forever** | Đúng suốt vòng đời object? Hay vai trò/trạng thái đổi được? |
| 4 | **Reuse-only** | Lý do **duy nhất** là muốn dùng code đó? Nếu có thì là has-a |

```python
# ✅ is-a: qua cả 4 test
class CreditCardPayment(Payment): ...

# ❌ Chỉ muốn dùng lại code (fail test 1 và 4)
class OrderService(EmailSender): ...
# ✅ has-a: chứa và uỷ quyền
class OrderService:
    def __init__(self, sender: EmailSender):
        self._sender = sender

# ❌ Fail test 3: vai trò đổi theo thời gian
class Seller(User): ...
# ✅ has-a
class User:
    def __init__(self, roles: set[Role]):
        self._roles = roles
```

### Cùng một bài toán, hai cách

```python
# Inheritance
class LoggedEmailNotifier(EmailNotifier):
    def send(self, user, msg):
        print(f"sending to {user}")
        super().send(user, msg)

# Composition: bọc được mọi notifier
class LoggedNotifier:
    def __init__(self, inner: Notifier):
        self._inner = inner
    def send(self, user, msg):
        print(f"sending to {user}")
        self._inner.send(user, msg)       # delegation

notifier = RetryNotifier(LoggedNotifier(SmsNotifier()))
```

| | Inheritance | Composition |
|---|---|---|
| Câu mô tả | "X **là một loại của** Y" | "X **có / dùng** Y" |
| Cho bạn | Toàn bộ API cha, **tự động** | Chỉ thứ bạn **chủ động gọi** |
| Ràng buộc | Chặt, cố định lúc viết code | Lỏng, đổi được lúc chạy |
| Bên kia đổi bên trong | Con có thể vỡ ngầm | Thường không ảnh hưởng |
| Giá phải trả | Cây class phình, cứng | Viết thêm dòng uỷ quyền, tự nối object |

**Cách nhớ một câu:** *Inheritance trả lời "nó LÀ gì?". Composition trả lời "nó DÙNG gì?". Khi phân vân, chọn composition.*

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Câu "X is a Y" nghe xuôi là is-a | Phải qua phép thử **thay thế hành vi**. `Square is-a Rectangle` đúng trong toán, sai trong code |
| Hai class có chung field/method thì chung cha | Giống code ≠ giống khái niệm. `Invoice` và `Order` đều có `total` |
| Vai trò, trạng thái hay đổi thì làm subclass | Đổi được lúc chạy ⇒ has-a |
| Has-a chỉ chứa data | Has-a thường chứa **behavior** (`EmailSender`, `FlyBehavior`) |
| Is-a luôn dở, has-a luôn tốt | Is-a thật sự vẫn dùng được (mục #4) |

### 🏛️ Góc nhìn Solution Architect

- Mỗi lần gõ `class A(B)` là một quyết định kiến trúc: **coupling chặt nhất** trong OOP.
- Review: thấy `class X(Y)` thì hỏi *Y là loại của ai? Có phải chỉ để dùng lại method? Y có do mình sở hữu không?* Kế thừa class thư viện/framework ngoài module là rủi ro cao nhất.
- Chọn composition là **để dành chỗ cho thay đổi** (gateway, kênh thông báo, cách tính giá). Ở production: feature flag, A/B test, đổi nhà cung cấp mà không sửa logic lõi.
- Ở quy mô hệ thống: service A **gọi** service B qua API (has-a), không "kế thừa" logic B bằng cách copy code.
- **Nối D1:** `class Cache(dict)` fail test 4: lộ toàn bộ API dict (`clear()`, `update()`), mất khả năng giữ invariant (kích thước, TTL). Cache nên **chứa** một dict.
- **Nối D2 #4:** phép thử "mọi chỗ dùng cha thay bằng con được" chính là mầm LSP (D4).

> Đáp án mẫu (Claude viết hộ, 26/10/2026). Khi ôn: che đáp án, tự làm lại trước rồi mới mở.

**Bài tập mục #1:** tự nghĩ 5 ví dụ phân loại is-a / has-a / uses-a (đủ 1 is-a thật, 1 bẫy, 1 vai trò đổi theo thời gian).

<details><summary>Đáp án mẫu</summary>

| # | Cặp | Phân loại | Lý do (qua phép thử thay thế hành vi) |
|---|---|---|---|
| 1 | `OutOfStockError` và `DomainError` | **is-a thật** | Mọi chỗ `except DomainError` bắt được nó và xử lý đúng (trả 4xx, log nghiệp vụ). Cây nông, ổn định, exception được thiết kế để kế thừa |
| 2 | `RefundPayment` và `Payment` | **Bẫy: has-a** | Nghe như "refund là một loại payment", nhưng `Payment.capture()` vô nghĩa với refund; đưa refund vào chỗ đang xử lý `Payment` sẽ phá hợp đồng. Refund **tham chiếu tới** (has-a) payment gốc: `Refund(original: Payment, amount)` |
| 3 | `Customer` thành `VipCustomer` | **Vai trò đổi theo thời gian → has-a** | Khách lên/xuống hạng lúc chạy; không đổi được class của một object đang sống một cách an toàn. Đúng: `Customer` có `tier: MembershipTier` (hoặc `PricingPolicy`) đổi được |
| 4 | `OrderService` và `EmailSender` | **uses-a / has-a** (không phải is-a) | Chỉ muốn dùng lại hàm gửi mail. Kế thừa sẽ lộ `send_raw()`, `smtp_config` ra API của `OrderService`. Đúng: inject `Notifier` qua constructor |
| 5 | `Invoice` và `Order` (cùng có `total`, `items`) | **Không quan hệ** (giống code ≠ giống khái niệm) | Invoice có vòng đời riêng (phát hành, huỷ, điều chỉnh thuế). Cần dùng chung thì tách `LineItems` / `Money` rồi **cả hai cùng chứa** |

Mẹo nhanh: hỏi *"đặt con vào **mọi** chỗ đang dùng cha, có chỗ nào sai không?"* và *"quan hệ này có đổi lúc chạy không?"*. Sai ở một chỗ hoặc đổi được lúc chạy thì là has-a.

</details>

### 🟦 TypeScript / JavaScript

```ts
// ❌ Chỉ muốn dùng lại code
class OrderService extends EmailSender { /* ... */ }

// ✅ has-a: chứa và uỷ quyền, truyền từ ngoài vào
class OrderService {
  constructor(private readonly sender: EmailSender) {}   // "parameter property": khai báo + gán trong một dòng
}

// ✅ Vai trò đổi theo thời gian
class User { constructor(readonly id: string, private roles: Set<Role>) {} }
```

⚠️ **Structural typing không kiểm tra LSP.** TS chỉ so **hình dạng**: `ReadOnlyOrder extends Order` mà `addItem()` ném lỗi vẫn qua compile. Phép thử thay thế (test 2) vẫn là việc của bạn, không phải của compiler.

🏛️ DI container (NestJS, Angular) lắp ráp object bằng **constructor injection**: đó là composition ở quy mô ứng dụng.

---

## 2. Các vấn đề của kế thừa

| English | Nghĩa |
|---|---|
| **fragile base class** | lớp cha "dễ vỡ": sửa cha hợp lệ vẫn làm hỏng con |
| **self-use** | method của cha tự gọi method khác của chính nó |
| **implementation detail** | chi tiết cài đặt bên trong (không nằm trong contract) |
| **class explosion** | bùng nổ số class |
| **silent failure** | lỗi âm thầm, không báo gì |

### Vấn đề 1: Fragile base class

🇬🇧 **A fragile base class is a parent class where a safe-looking change breaks its children.** The child depends on *how* the parent works inside, not only on *what* it promises.

🇻🇳 Con override method của cha nên **phụ thuộc vào ruột của cha** (method nào gọi method nào, mấy lần, thứ tự nào). Ruột là thứ cha tưởng mình được tự do sửa.

```python
# Kinh điển (InstrumentedHashSet, bản Python; dùng Bag tự viết vì set của CPython là C)
class Bag:
    def __init__(self): self._items = []
    def add(self, x): self._items.append(x)
    def add_all(self, xs):
        for x in xs:
            self.add(x)                    # self-use

class CountingBag(Bag):
    def __init__(self): super().__init__(); self.count = 0
    def add(self, x): self.count += 1; super().add(x)
    def add_all(self, xs): self.count += len(xs); super().add_all(xs)

b = CountingBag(); b.add_all(["a", "b", "c"])
print(b.count)   # 6 ❌ (mong đợi 3): add_all cộng 3, rồi self.add của con cộng thêm 3
```

Vá bằng cách xoá dòng cộng trong `add_all` của con thì hôm nay đúng. Tuần sau cha tối ưu `add_all` thành `self._items.extend(xs)` thì `count` thành **0**. Con vỡ mà không ai sửa file của con.

```python
# Backend tương đương
class OrderRepository:
    def save(self, order): db.insert(order)
    def save_all(self, orders):
        for o in orders: self.save(o)

class AuditedRepository(OrderRepository):
    def save(self, order):
        audit_log.write("saved", order.id); super().save(order)
# Cha tối ưu save_all thành db.insert_many(orders) → audit thủng im lặng.
```

**Phản xạ:** *"Method này của cha có gọi method khác mà con override không?"*

### Vấn đề 2: Coupling chặt với lớp cha

🇬🇧 **Inheritance couples the child to everything in the parent: public methods, protected state, call order.** The parent cannot change freely, because it does not know who inherits from it.

```python
class CsvExporter:                       # 10 con override _header và _line
    def export(self, rows):
        out = [self._header()] + [self._line(r) for r in rows]
        return "\n".join(out)
```

Đổi `_line(row)` thành `_line(row, index)` thì phải sửa 10 con (method `_xxx` đã thành hợp đồng ngầm). Cha thêm `export_to_s3()` thì 10 con cũng có luôn, kể cả con không nên có.

**Phản xạ:** *"Đổi class này thì ai bị kéo theo?"* (với kế thừa: mọi con, kể cả ở module mình không biết).

### Vấn đề 3: Bùng nổ số class

🇬🇧 **When abilities are independent, inheritance needs one class for every combination.** *n* independent abilities → up to 2ⁿ classes. Composition needs *n* pieces.

```
Notifier = kênh (3) × mức (2) × log (2) → kế thừa: 12 class; composition: 3+2+1 = 6 mảnh
Duck: 3 khả năng độc lập → 2³ = 8 class (mục #3 viết lại bằng composition)
```

**Phản xạ:** tên class ghép 2–3 tính từ (`LoggedUrgentSmsNotifier`) thì các trục đang độc lập, đừng bắt chúng ngồi chung một cây.

### Vấn đề 4: Cây kế thừa quá sâu

`BaseModel → Payment → OnlinePayment → CardPayment → StripeCardPayment`: đọc 1 method phải mở 5 file, theo dõi mỗi tầng có gọi `super()` không. **1–2 tầng là đủ.**

| # | Vấn đề | Triệu chứng | Phản xạ khi review |
|---|---|---|---|
| 1 | Fragile base class | Cha tối ưu, con sai **âm thầm** | "Cha có `self.method()` mà con override không?" |
| 2 | Coupling chặt | Sửa cha phải sửa N con; con nhận cả method không muốn | "Ai bị kéo theo nếu mình đổi?" |
| 3 | Bùng nổ class | Tên class ghép 2–3 tính từ | "Các trục này độc lập không?" |
| 4 | Cây quá sâu | Đọc 1 method phải mở 5 file | "Cây sâu mấy tầng?" |

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Fragile base class chỉ xảy ra khi cha có bug | Cha thay đổi **hợp lệ** (tối ưu, refactor) vẫn làm con vỡ |
| `protected`/`_xxx` thì con không phụ thuộc ruột | Con **chính là** người dùng protected: nó đã là hợp đồng ngầm |
| Test của cha xanh là đủ | Con vẫn vỡ. Con cần test riêng, chạy lại khi cha đổi |
| Bùng nổ class chỉ là số file | Mỗi tổ hợp là một chỗ có thể sai và cần test |
| Composition tránh hết các vấn đề này | Giảm mạnh, không triệt tiêu: contract kém vẫn gây coupling |

### 🏛️ Góc nhìn Solution Architect

- Fragile base class là lý do kế thừa nên **cùng module, cùng team sở hữu**. Cha ở thư viện chung thì bạn không biết ai dựa vào ruột của bạn.
- Cha trong thư viện nội bộ dùng chung là nguồn "không dám sửa": 10 service kế thừa `BaseRepository`, đổi một chữ phải phối hợp release 10 nơi. Kết quả: thư viện đóng băng, mọi người copy code.
- Chỉ có hai cách làm kế thừa an toàn: (1) cha **được thiết kế và ghi tài liệu** cho việc bị kế thừa (ghi rõ method nào tự gọi method nào, ý của *Effective Java*), (2) **cấm kế thừa** (`final` ở Java; Python dùng quy ước hoặc `__init_subclass__`).
- **Silent failure đắt hơn crash:** audit thủng, đếm sai, cache không xoá: không exception, không alert, chỉ lộ khi đối soát hoặc khách báo.
- **Nối D2 #4:** mục "Rủi ro lớn nhất" ở D2 chính là vấn đề 1. **Nối D1:** `class MyDict(dict)` override `__setitem__` thì `dict.update()` **không** gọi nó (CPython đi đường tắt bằng C). Đây là fragile base class thật ngay trong thư viện chuẩn: dùng `collections.UserDict` hoặc composition.

> Đáp án mẫu (Claude viết hộ, 26/10/2026). Khi ôn: che đáp án, tự làm lại trước rồi mới mở.

**Bài tập mục #2:** 3 ví dụ backend tự nghĩ cho 3 vấn đề của kế thừa.

<details><summary>Đáp án mẫu</summary>

**1. Fragile base class: quota SMS đếm về 0 (đã chạy thật).**

```python
class SmsSender:                                   # thư viện nội bộ, v1
    def send(self, phone: str, text: str) -> None: ...
    def send_bulk(self, phones: list[str], text: str) -> None:
        for p in phones:
            self.send(p, text)                     # v1 tự gọi send()

class QuotaSmsSender(SmsSender):                   # team khác kế thừa để đếm quota
    used = 0
    def send(self, phone: str, text: str) -> None:
        QuotaSmsSender.used += 1
        super().send(phone, text)
```

Thư viện lên v2: `send_bulk` gọi thẳng bulk API của nhà mạng, **không qua `send()`** nữa (thay đổi hợp lệ, nhanh hơn). Gửi 3 số: v1 `quota used: 3`, v2 `quota used: 0`. Không exception, không alert: chỉ lộ khi hoá đơn nhà mạng vượt hạn mức. Sửa: `QuotaSmsSender` **chứa** một sender và đếm ở chính chỗ nó uỷ quyền (`send` và `send_bulk` đều đếm), không phụ thuộc cha gọi gì bên trong.

**2. Coupling chặt với lớp cha: `BaseController` dùng chung.** 30 controller kế thừa `BaseController` của thư viện nội bộ và đọc `self._user.tenant_id`. Thư viện đổi `_user` thành `self.auth.principal` (refactor nội bộ). 30 controller gãy, và chỉ gãy **lúc chạy** ở đúng route đó vì Python không kiểm tra thuộc tính protected. Thư viện "đóng băng", không ai dám sửa. Sửa: controller nhận `CurrentUser` qua DI (FastAPI `Depends`, decorator `@CurrentUser()` của Nest), chỉ phụ thuộc hợp đồng công khai.

**3. Bùng nổ class: thông báo đơn hàng.** Kênh (Email / SMS / Push) × có retry hay không × có log hay không = `3 × 2 × 2 = 12` class (`RetryingLoggedSmsNotifier`...). Thêm kênh Zalo: +4 class. Composition: 3 class kênh + `RetryingNotifier(inner)` + `LoggingNotifier(inner)` = 5 mảnh, ghép lúc chạy: `LoggingNotifier(RetryingNotifier(SmsNotifier()))`. Thêm Zalo: +1 class.

*Vấn đề thứ 4, cây quá sâu:* `BaseEntity → AuditableEntity → SoftDeletableEntity → TenantEntity → Order`. Muốn biết `order.save()` thật sự làm gì phải đọc 5 file theo thứ tự `super()`.

</details>

## 3. Composition + delegation

| English | Nghĩa |
|---|---|
| **behavior** (strategy) | một cách làm, tách thành object riêng |
| **inject** | truyền vào từ ngoài (qua constructor) |
| **swap at runtime** | đổi lúc chạy |
| **contract / protocol** | hợp đồng: các behavior cùng có method nào |
| **program to an interface** | viết code dựa vào contract, không dựa vào class cụ thể |

🇬🇧 **Composition has three moves:** (1) **Pull out** the part that changes into its own small class (a *behavior*). (2) **Define a contract** that all behaviors follow. (3) **Hold** a behavior inside the main class and **delegate** to it. Pass it in from outside, so you can swap it. **The main class no longer knows *how* the work is done. It only knows *who* to ask.**

🇻🇳 Tách phần hay đổi → đặt hợp đồng chung → class chính giữ một behavior và uỷ quyền, behavior truyền từ ngoài vào nên đổi được. Mẹo tìm chỗ cần tách: *"Cái gì khác nhau giữa các loại? Cái đó là behavior."*

```python
# ❌ Kế thừa: loại ship gắn vào class của Order
class StandardOrder(Order):  def shipping_fee(self): return 20_000
class ExpressOrder(Order):   def shipping_fee(self): return 50_000

# ✅ Composition
class ShippingFee(Protocol):                       # bước 2: contract
    def calculate(self, order: "Order") -> int: ...

class StandardFee:                                 # bước 1: behavior riêng
    def calculate(self, order): return 20_000
class ExpressFee:
    def calculate(self, order): return 50_000

class Order:
    def __init__(self, items, fee: ShippingFee):   # bước 3: giữ + inject
        self._items, self._fee = items, fee
    def shipping_fee(self) -> int:
        return self._fee.calculate(self)           # delegation
    def upgrade_shipping(self, fee: ShippingFee):  # đổi lúc chạy
        self._fee = fee
```

| Vấn đề của kế thừa (mục #2) | Composition xử lý |
|---|---|
| Bùng nổ class | Các trục **cộng** chứ không nhân |
| Coupling chặt | `Order` chỉ biết `calculate`, không biết ruột `ExpressFee` |
| Fragile base class | Không có cha để vỡ |
| Không đổi được lúc chạy | `upgrade_shipping()` |

**Bài tập Duck (🔴 T1): viết lại bằng composition.** Năm bước: (1) tìm phần thay đổi (`fly`, `quack`); (2) `Protocol` `FlyBehavior`, `QuackBehavior`; (3) behavior cụ thể: `FlyWithWings`, `NoFly`, `Quack`, `Squeak`, `Silent`; (4) `Duck` nhận hai behavior qua constructor, `fly()`/`quack()` uỷ quyền; (5) ghép Mallard, Rubber, Wooden **không tạo subclass `Duck`**, rồi đổi behavior bay của Mallard sang `NoFly` lúc chạy.
Tự kiểm: thêm `RocketFly` có sửa class cũ nào không (không)? `Duck` có `new` behavior cụ thể bên trong không (không)? còn `if type ==` không (không)? truyền `FlyBehavior` giả để test được không (được)?

> Đáp án mẫu (Claude viết hộ, 26/10/2026). Khi ôn: che đáp án, tự làm lại trước rồi mới mở.

<details><summary>Đáp án mẫu: Duck bằng composition (đã chạy, mypy --strict sạch)</summary>

```python
from typing import Protocol

# Bước 2: contract
class FlyBehavior(Protocol):
    def fly(self) -> str: ...

class QuackBehavior(Protocol):
    def quack(self) -> str: ...

# Bước 3: behavior cụ thể
class FlyWithWings:
    def fly(self) -> str: return "flapping wings"

class NoFly:
    def fly(self) -> str: return "cannot fly"

class Quack:
    def quack(self) -> str: return "Quack!"

class Squeak:
    def quack(self) -> str: return "Squeak!"

class Silent:
    def quack(self) -> str: return "..."

# Bước 4: Duck giữ behavior, nhận qua constructor, uỷ quyền
class Duck:
    def __init__(self, name: str, fly: FlyBehavior, quack: QuackBehavior) -> None:
        self.name = name
        self._fly = fly
        self._quack = quack

    def fly(self) -> str:
        return f"{self.name}: {self._fly.fly()}"

    def quack(self) -> str:
        return f"{self.name}: {self._quack.quack()}"

    def set_fly(self, fly: FlyBehavior) -> None:   # đổi lúc chạy
        self._fly = fly

# Bước 5: ghép, không tạo subclass Duck
mallard = Duck("Mallard", FlyWithWings(), Quack())
rubber = Duck("Rubber", NoFly(), Squeak())
wooden = Duck("Wooden", NoFly(), Silent())
mallard.set_fly(NoFly())                           # bị thương, hết bay
```

Output: `Mallard: flapping wings | Mallard: Quack!` · `Rubber: cannot fly | Rubber: Squeak!` · `Wooden: cannot fly | Wooden: ...` · sau `set_fly`: `Mallard: cannot fly`.

**Trả lời các câu tự kiểm:**

1. *Thêm `RocketFly` có sửa class cũ nào không?* Không. Thêm một class có `fly()`, rồi `wooden.set_fly(RocketFly())` → `Wooden: rocket-powered`. `Duck`, `FlyWithWings`, `NoFly` giữ nguyên (cũng là OCP, D4).
2. *`Duck` có `new` behavior cụ thể bên trong không?* Không. `Duck` chỉ biết `FlyBehavior`/`QuackBehavior`; việc chọn `FlyWithWings()` nằm ở chỗ lắp ráp (composition root, D4).
3. *Còn `if type == ...` không?* Không. Khác biệt giữa các loại vịt nằm ở **object được truyền vào**, không nằm ở nhánh `if`.
4. *Truyền `FlyBehavior` giả để test được không?* Được. `SpyFly` đếm số lần gọi: `Duck("Test", spy, Silent()).fly()` → `spy.calls == 1`.

</details>

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| Composition chỉ là khai báo field | Cốt lõi là **uỷ quyền và đổi được**. `self._db = PostgresDb()` cứng trong class chưa đổi được gì |
| Tự `new` behavior trong constructor | Vẫn dính class cụ thể, không đổi/giả được. **Truyền từ ngoài vào** |
| Behavior nào cũng nên tách | Tách khi có **nhiều cách làm** và **hay đổi**. Chỉ một cách, không đổi: đừng tạo Protocol cho đẹp |
| Delegation là chỉ chuyển tiếp, vô nghĩa | Class chính vẫn giữ state, giữ luật, điều phối nhiều behavior |
| Strategy là khái niệm khác | Strategy là **tên gọi** của kiểu composition này (Tuần 3) |
| Phải có `Protocol`/`ABC` | Không. Python truyền hàm được (`fee: Callable[[Order], int]`) |

### 🏛️ Góc nhìn Solution Architect

- **Composition là cách hệ production được "lắp ráp":** gateway thanh toán, nơi lưu file (S3/local), kênh thông báo, chính sách retry đều là behavior được **inject** theo config/môi trường. Test inject bản giả, production inject bản thật, cùng code lõi.
- **Composition root:** **một chỗ** (hàm khởi động app) quyết định dùng behavior nào, nối với ai. Phần còn lại chỉ nhận contract. Đổi nhà cung cấp = đổi một dòng ở đây.
- **Đổi lúc chạy = đổi không cần deploy:** chọn behavior theo cấu hình/feature flag, nền cho A/B test và rollout dần.
- **Giá phải trả:** nhiều object nhỏ, nhiều mối nối, lỗi "nối thiếu/nối sai" lộ lúc chạy. Cần test tích hợp cho **bản lắp ráp thật**.
- **Đừng trừu tượng sớm:** hôm nay chỉ một cách tính phí và không có kế hoạch đổi thì một hàm là đủ. Tách khi **cách thứ hai** xuất hiện (rule of three).
- **Nối D2 #3, #5:** contract = abstraction; gọi behavior mà không biết loại cụ thể = polymorphism.

### 🟦 TypeScript / JavaScript

Cùng logic `Bag`/`CountingBag` ở trên, bản TS:

```ts
class Bag {
  protected items: string[] = [];
  add(x: string): void { this.items.push(x); }
  addAll(xs: string[]): void { for (const x of xs) this.add(x); }   // self-use
}
class CountingBag extends Bag {
  count = 0;
  override add(x: string): void { this.count++; super.add(x); }
  override addAll(xs: string[]): void { this.count += xs.length; super.addAll(xs); }
}
const b = new CountingBag(); b.addAll(["a", "b", "c"]);
b.count;   // 6 ❌ (đo)
```

⭐ **Một fragile base class thật ngay trong thư viện chuẩn của JS:** constructor `Set`/`Map` gọi `this.add`/`this.set` đã bị override.

```ts
class CountingSet extends Set<number> {
  count = 0;
  override add(x: number): this { this.count++; return super.add(x); }
}
const s = new CountingSet([1, 2, 3]);
s.size;    // 3
s.count;   // 0 ❌ (đo)
```

Vì sao: `super(iterable)` chạy **trước** khi field của con (`count = 0`) được khởi tạo. Trong lúc đó `add` của con chạy với `this.count` là `undefined`, nên `undefined++` ra `NaN`; sau đó field initializer **ghi đè về 0**. Con vỡ vì phụ thuộc thứ tự bên trong của cha. (Tương tự `class MyDict(dict)` ở Python.) Sửa: **chứa** một `Set`, không `extends Set`.

**Bùng nổ class** và cách composition bằng hàm bọc:

```ts
const withLogging = (n: Notifier): Notifier => ({
  send: (u, m) => { console.log("sending to", u); n.send(u, m); },
});
const withRetry = (n: Notifier, times: number): Notifier => ({
  send: (u, m) => { for (let i = 0; ; i++) { try { return n.send(u, m); } catch (e) { if (i >= times) throw e; } } },
});
const notifier = withRetry(withLogging(new SmsNotifier()), 3);   // ghép lúc chạy, không thêm class
```

### 🟦 TypeScript / JavaScript

```ts
interface ShippingFee { calculate(order: Order): number; }          // bước 2: contract
class StandardFee implements ShippingFee { calculate() { return 20_000; } }   // bước 1
class ExpressFee  implements ShippingFee { calculate() { return 50_000; } }

class Order {
  constructor(readonly items: string[], private fee: ShippingFee) {}   // bước 3: giữ + inject
  shippingFee(): number { return this.fee.calculate(this); }          // delegation
  upgradeShipping(fee: ShippingFee): void { this.fee = fee; }         // đổi lúc chạy
}
```

- **Behavior chỉ có một method thì hàm là đủ:** `type FeeFn = (o: Order) => number` rồi `new Order(items, (o) => 0)`. Không cần `interface` và class cho mỗi biến thể. Dùng `interface` khi behavior có nhiều method hoặc cần state.
- **Khung cho bài tập Duck bằng TS** (chỉ chữ ký, phần còn lại bạn tự viết): `interface FlyBehavior { fly(): void }`, `interface QuackBehavior { quack(): void }`, `class Duck { constructor(private flyBehavior: FlyBehavior, private quackBehavior: QuackBehavior) {} ... }`.
- `constructor(private readonly x: X)` là cú pháp rút gọn: khai báo field **và** gán trong một dòng.

---

## 4. Favor composition over inheritance: khi nào vẫn nên kế thừa

| English | Nghĩa |
|---|---|
| **favor X over Y** | ưu tiên X hơn Y (mặc định, không phải cấm) |
| **Liskov Substitution (LSP)** | con thay cha ở mọi nơi mà không phá hợp đồng (D4) |
| **designed for inheritance** | cha được thiết kế và ghi tài liệu để bị kế thừa |
| **Template Method** | cha giữ khung chạy, con điền các bước |

🇬🇧 **"Favor composition over inheritance" (Gang of Four) is a default, not a ban.** Start with composition. Use inheritance only when a real, stable is-a exists *and* the risks from section 2 are under control.

🇻🇳 Đây là **mặc định**, không phải luật cấm. GoF đưa ra vì sửa composition thành inheritance rẻ hơn nhiều so với gỡ một cây kế thừa đã lan khắp code.

### Khi nào VẪN nên kế thừa (cần đủ các điều kiện)

| # | Điều kiện | Câu tự hỏi |
|---|---|---|
| 1 | **is-a thật và ổn định** | Qua đủ 4 phép thử mục #1 chưa? Có đổi theo thời gian không? |
| 2 | **Con không phá hợp đồng cha (LSP)** | Có chỗ nào con `raise NotImplementedError`, override rỗng, hoặc làm yếu cam kết không? |
| 3 | **Cây nông** (1–2 tầng) | Đọc một method phải mở mấy file? |
| 4 | **Cùng module / cùng chủ, hoặc cha được thiết kế để bị kế thừa** | Cha có ghi rõ method nào tự gọi method nào không? |

Roadmap yêu cầu nêu **3 điều kiện** (1, 2, 3). Điều kiện 4 là điều kiện thực tế thêm từ vấn đề fragile base class.

```python
# ✅ Kế thừa đúng chỗ 1: exception tuỳ biến (cây nông, ổn định, cha thiết kế để kế thừa)
class DomainError(Exception): ...
class OutOfStock(DomainError): ...
class PaymentDeclined(DomainError): ...

# ✅ Đúng chỗ 2: Template Method trong cùng module (D2 #4)
class Payment(ABC):
    def pay(self):                        # khung cố định
        self._validate(); self._execute(); self.status = "PAID"
    @abstractmethod
    def _execute(self): ...

# ✅ Đúng chỗ 3: framework thiết kế để kế thừa (Django View, unittest.TestCase)
class OrderListView(View):
    def get(self, request): ...

# ❌ Vi phạm LSP: con làm yếu cam kết của cha
class ReadOnlyOrder(Order):
    def add_item(self, item):
        raise PermissionError("read only")  # caller giữ Order gọi add_item bị nổ
```

**Trong thực tế Python hay kết hợp cả hai:** kế thừa `ABC`/`Protocol` để **khai báo contract** (cây nông 1 tầng), còn **hành vi** thì composition.

### Cây quyết định nhanh

```
Muốn dùng lại code của class X?          → composition (has-a)
X LÀ một loại của Y (4 phép thử đều qua)?
  ├─ Không                                 → composition
  └─ Có → con có phá hợp đồng cha không?
        ├─ Có                              → composition
        └─ Không → cây ≤ 2 tầng, cùng module / cha thiết kế để kế thừa?
              ├─ Có                        → inheritance OK
              └─ Không                     → composition
```

### ⚠️ Bẫy

| Hiểu nhầm | Thực tế |
|---|---|
| "Composition luôn tốt hơn, cấm kế thừa" | Nguyên tắc là **ưu tiên**, không cấm. Exception, template method, framework là chỗ kế thừa đúng |
| LSP chỉ là "con có đủ method của cha" | LSP là **hành vi**: con không đòi hỏi nhiều hơn, không hứa ít hơn, không ném lỗi cha không ném |
| Có `ABC` là đã kế thừa sai | `ABC` chỉ để khai báo contract. Rủi ro nằm ở **chia sẻ code** qua kế thừa |
| Kế thừa nhiều tầng vì "sau này dùng lại" | Đó là trừu tượng sớm. Tầng nào chưa có **hai con thật** thì chưa cần |
| Dùng composition rồi thì không còn coupling | Vẫn coupling vào contract. Contract rò chi tiết thì vẫn khó đổi |

### 🏛️ Góc nhìn Solution Architect

- **Khi review PR, `class A(B)` cần một câu giải thích** trong mô tả (vì sao là is-a, vì sao không composition). Không có thì mặc định đổi sang composition.
- **Ranh giới module/service luôn là contract**, không bao giờ là cây kế thừa: service A không kế thừa class của service B.
- **Kế thừa class của framework (Django, Spring)** là rủi ro nâng cấp: framework đổi ruột ở bản mới thì code con vỡ. Cô lập bằng một lớp mỏng bọc chúng.
- **Đo bằng chi phí thay đổi:** nếu bạn dự đoán gateway, kênh gửi, cách tính giá sẽ đổi thì composition; nếu thứ đó không bao giờ đổi và chỉ chia sẻ vòng đời thì inheritance rẻ hơn.
- **Nối D2 #6:** *cam kết hành vi → interface/`Protocol`; chia sẻ code → ưu tiên composition, abstract class chỉ khi có khung chạy chung.* Bảng so sánh ở [tradeoff-cheatsheet.md](tradeoff-cheatsheet.md).

### 🟦 TypeScript / JavaScript

```ts
// ✅ Kế thừa đúng chỗ: lỗi nghiệp vụ (cây nông, ổn định)
class DomainError extends Error {
  constructor(msg: string) { super(msg); this.name = new.target.name; }
}
class OutOfStock extends DomainError {}
// instanceof hoạt động khi tsconfig target ≥ ES2015 (với ES5, phải setPrototypeOf)
```

- **React là ví dụ ngành đã chuyển hẳn sang composition:** thời `class X extends React.Component` đã nhường cho function component + hook. Tài liệu React chính thức nêu họ chưa thấy trường hợp nào đáng tạo cây kế thừa component, và khuyên dùng composition (`children`, props).
- **Express/Koa middleware** (`app.use(logging, auth, handler)`) là chuỗi composition: mỗi lớp bọc lớp sau, thêm lớp không sửa lớp cũ.
- **NestJS** dựng cả ứng dụng bằng DI (composition); kế thừa dùng ít, chủ yếu cho `Error` và lớp nền trong cùng module.

---

## 5. Mixin / Trait 🟢 T3

🇬🇧 **A mixin is a small class that adds one extra ability to other classes, and is not meant to be used alone.** A *trait* is the same idea in languages like Rust, Scala, PHP.

🇻🇳 Mixin là mảnh nhỏ cho thêm **một khả năng** (không đứng một mình), được "trộn" vào class qua đa kế thừa. Chỉ cần biết nó tồn tại và nhận ra tên.

```python
class TimestampMixin:                       # chỉ làm một việc
    def touch(self):
        self.updated_at = datetime.utcnow()

class Order(TimestampMixin, Base): ...      # Order có thêm touch()
class User(TimestampMixin, Base): ...
```

Ví dụ thật: `LoginRequiredMixin` (Django), `default method` (Java), `trait` (Rust, Scala), `mixin` (Dart).

| Dùng khi | Tránh khi |
|---|---|
| Khả năng **ngang** (cross-cutting): timestamp, soft delete, serialize JSON | Mixin cần biết state/ruột của class đích |
| Mixin **không có state riêng**, một việc, tên kết thúc `Mixin` | Chồng nhiều mixin có method trùng tên (thứ tự MRO quyết định, rối) |

⚠️ Mixin vẫn là kế thừa nên mang lại **một phần** rủi ro ở mục #2. Nếu mixin cần gọi method của class đích thì đó là phụ thuộc ngầm, thường composition tốt hơn.

🏛️ Với nhiều team: thư viện dùng mixin ở ranh giới module là coupling ngầm, cần ghi rõ "mixin này yêu cầu class đích có thuộc tính gì".

### 🟦 TypeScript / JavaScript

JS chỉ cho **một cha**, nên mixin là một **hàm nhận class và trả về class mở rộng**:

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    updatedAt = new Date();
    touch(): void { this.updatedAt = new Date(); }
  };
}

class BaseEntity { id = 1; }
class Order extends Timestamped(BaseEntity) {}      // có id, updatedAt, touch()
```

Kiểu của mixin khá nặng nề, nhiều chồng lớp làm thông báo lỗi khó đọc. Với phần lớn trường hợp, **composition** (chứa một `Timestamps`/`AuditInfo`) hoặc hàm tiện ích đơn giản hơn.

---

## 6. Khung nhớ nhanh

**Một câu:** *Inheritance trả lời "nó LÀ gì?". Composition trả lời "nó DÙNG gì?". Khi phân vân, chọn composition.*

| | Inheritance | Composition |
|---|---|---|
| Quan hệ | is-a | has-a / uses-a |
| Cho bạn | Toàn bộ cha, tự động | Chỉ thứ bạn gọi |
| Đổi lúc chạy | Không | Có |
| Rủi ro | Fragile base, coupling, bùng nổ class, cây sâu | Nhiều mối nối, cần test lắp ráp |

**Bốn phép thử is-a:** Sentence · Substitution · Forever · Reuse-only.
**Ba bước composition:** Tách phần đổi → đặt contract → giữ + uỷ quyền (inject).
**Bốn vấn đề kế thừa:** Fragile base · Coupling chặt · Bùng nổ class · Cây quá sâu.
**Điều kiện giữ kế thừa:** is-a ổn định · không phá hợp đồng (LSP) · cây nông (+ cùng module / thiết kế để kế thừa).
**Phản xạ review:** thấy `class A(B)` → hỏi *B là loại của ai? chỉ để dùng lại? ai sở hữu B?* Thấy tên ghép hai tính từ → hỏi *trục có độc lập không?*

---

## 7. Thẻ Anki T1 kèm đáp án

**Thẻ 1.** *Fragile base class là gì?*
Lớp cha mà một thay đổi **hợp lệ** (tối ưu, refactor nội bộ) làm hỏng lớp con, vì con phụ thuộc vào cách cha hoạt động bên trong (method nào gọi method nào), không chỉ vào hợp đồng. Ví dụ `InstrumentedHashSet`: `add_all` của cha gọi `add`, con override cả hai nên đếm gấp đôi; cha đổi `add_all` thì lại đếm sai theo hướng khác. Backend: `AuditedRepository` mất audit khi cha chuyển `save_all` sang `insert_many`.

**Thẻ 2.** *Vì sao composition giải quyết được bài toán bùng nổ số class?*
Kế thừa nhét các khả năng độc lập vào **một cây** nên số class **nhân** (n khả năng → tới 2ⁿ). Composition tách mỗi khả năng thành behavior riêng và ghép lúc chạy nên số mảnh **cộng** (n mảnh). Thêm khả năng mới = thêm 1 class behavior, không đụng class cũ.

**Thẻ 3.** *Nêu 3 điều kiện để kế thừa vẫn là lựa chọn hợp lý.*
(1) Quan hệ is-a **thật và ổn định**, không đổi theo vai trò/trạng thái; (2) con **không phá hợp đồng** của cha (LSP), thay cha ở mọi nơi vẫn đúng; (3) cây kế thừa **nông** (1–2 tầng). Thực tế thêm: cùng module hoặc cha được thiết kế để bị kế thừa.

**🟦 Thẻ bổ sung cho TypeScript**

- **`class CountingSet extends Set<number>` ghi đè `add` để đếm. `new CountingSet([1,2,3])` cho `size = 3` nhưng `count = 0`. Vì sao?**
  Constructor `Set` gọi `this.add` (bản của con) **trước khi** field `count = 0` của con được khởi tạo, nên `undefined++` ra `NaN`, rồi field initializer ghi đè về 0. Đây là fragile base class thật trong thư viện chuẩn. Sửa: chứa một `Set` thay vì kế thừa.

---

## 8. Câu hỏi cuối bài

> Tự trả lời trước (bằng tiếng Anh), rồi mở đáp án để soát.
> Đáp án mẫu (Claude viết hộ, 26/10/2026). Khi ôn: che đáp án, tự làm lại trước rồi mới mở.

1. 🇬🇧 Explain the difference between "is-a" and "has-a". 🇻🇳 Phân biệt "is-a" và "has-a".
2. 🇬🇧 Describe one situation where inheritance causes trouble. 🇻🇳 Nêu một tình huống kế thừa gây rắc rối.
3. 🇬🇧 Rewrite the `Duck` example (a flying duck / a wooden duck that cannot fly) with composition. 🇻🇳 Viết lại ví dụ `Duck` bằng composition.
4. 🇬🇧 Java has `class Stack extends Vector`, so a `Stack` can still call `insertElementAt(x, 0)` and insert in the middle. Is this good or bad design? Why? Name one case where inheritance is still the right choice. 🇻🇳 `Stack extends Vector` có tốt không? Vì sao? Nêu một trường hợp kế thừa vẫn đúng.

<details><summary>Đáp án mẫu / Key points</summary>

**1.** is-a: con là một loại của cha, dùng được ở mọi nơi cha được dùng mà không phá hợp đồng (qua test thay thế). has-a: object **chứa/dùng** object khác. Mẹo: nếu chỉ muốn **dùng lại code** chứ không phải "là một loại" thì đó là has-a. Vai trò đổi theo thời gian cũng là has-a.

**2.** Hai hướng: (a) Fragile base class: `Bag.add_all` gọi `add`, `CountingBag` override cả hai, đếm gấp đôi (hoặc đếm 0 khi cha tối ưu sang `extend`); (b) Bùng nổ class: 3 kênh × 2 mức × 2 log = 12 class. Nêu cả hậu quả: silent failure hoặc phải sửa N con.

**3.** `Duck` giữ `fly_behavior: FlyBehavior` và `quack_behavior: QuackBehavior` (Protocol) được truyền qua constructor; `FlyWithWings`, `NoFly`; `duck.fly()` uỷ quyền cho behavior; đổi behavior lúc chạy bằng setter; thêm khả năng mới (`RocketFly`) không tạo subclass `Duck` và không sửa class cũ.

**4.** **Xấu.** `Stack` không thật sự "là" `Vector` về hành vi: kế thừa làm lộ `insertElementAt`, `remove(i)`... phá bất biến LIFO (phá encapsulation, vi phạm LSP). Python tương đương: `class Stack(list)` lộ `insert`, `sort`. Sửa: `Stack` **chứa** một list và chỉ mở `push`, `pop`, `peek`. Kế thừa vẫn đúng: custom exception (`OutOfStock(DomainError)`), Template Method trong cùng module (`Payment` → `CodPayment`), framework thiết kế để kế thừa (Django `View`, `unittest.TestCase`), điều kiện: is-a ổn định, không phá hợp đồng, cây nông.

</details>

### 8.1 🟦 Câu 4 bản TS

```ts
// ❌ class Stack<T> extends Array<T>: lộ unshift, splice, sort... phá LIFO
// ✅ Composition: chỉ mở đúng thao tác của Stack
class Stack<T> {
  #items: T[] = [];
  push(x: T): void { this.#items.push(x); }
  pop(): T | undefined { return this.#items.pop(); }
  peek(): T | undefined { return this.#items.at(-1); }
  get size(): number { return this.#items.length; }
}
```

---

## Bài tập còn nợ (làm khi có thời gian)

> Cả 4 bài đã có đáp án mẫu (Claude viết hộ, 26/10/2026) ngay tại mục tương ứng. Đánh dấu ✔ khi **tự** làm lại được mà không mở đáp án.

- [ ] Mục #1: 5 ví dụ is-a / has-a / uses-a tự nghĩ (đủ 1 is-a thật, 1 bẫy, 1 vai trò đổi theo thời gian). Đáp án mẫu: [mục #1](#1-is-a-vs-has-a-và-composition-là-gì)
- [ ] Mục #2: 3 ví dụ backend tự nghĩ cho 3 vấn đề của kế thừa. Đáp án mẫu: [mục #2](#2-các-vấn-đề-của-kế-thừa)
- [ ] Mục #3: viết lại `Duck` bằng composition (5 bước) và trả lời các câu tự kiểm. Đáp án mẫu: [mục #3](#3-composition--delegation)
- [ ] Mục #8: tự trả lời 4 câu cuối bài rồi soát. Đáp án mẫu: [mục #8](#8-câu-hỏi-cuối-bài)

# D5: SOLID — phần L (LSP), I (ISP) và D (DIP) (tổng hợp)

← [Tuần 1](../100-ngay/tuan-01.md) · Phạm vi: mục #1 đến #5 của D5

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python; khác biệt của **TypeScript/JavaScript** nằm trong khối 🟦 cuối mỗi mục (đã kiểm chứng bằng cách chạy thật, không ghi theo trí nhớ).
> Nhãn: 🔴 T1 = nhớ và dạy lại được · 🟡 T2 = hiểu, nhớ tiêu chí chọn · 🟢 T3 = biết để tra khi cần
> Cả 5 mục của D5 đều 🔴 T1.

---

## Mục lục

1. [LSP: lớp con thay được lớp cha, và "hợp đồng"](#1-lsp-lớp-con-thay-được-lớp-cha-và-hợp-đồng) · 🔴 T1
2. [Dấu hiệu vi phạm LSP](#2-dấu-hiệu-vi-phạm-lsp) · 🔴 T1
3. [ISP: tách interface theo nhu cầu từng client](#3-isp-tách-interface-theo-nhu-cầu-từng-client) · 🔴 T1
4. [DIP: đảo mũi tên phụ thuộc, module cấp cao sở hữu interface](#4-dip-đảo-mũi-tên-phụ-thuộc-module-cấp-cao-sở-hữu-interface) · 🔴 T1
5. [DIP / DI / IoC](#5-dip--di--ioc) · 🔴 T1
6. [Khung nhớ nhanh](#6-khung-nhớ-nhanh)
7. [Thẻ Anki T1 kèm đáp án](#7-thẻ-anki-t1-kèm-đáp-án) · 🔴 T1
8. [Câu hỏi cuối bài](#8-câu-hỏi-cuối-bài) (đáp án mẫu)

---

## 1. LSP: lớp con thay được lớp cha, và "hợp đồng"

| English | Nghĩa |
|---|---|
| Liskov Substitution Principle (LSP) | Nguyên lý thay thế Liskov |
| substitute / substitutable | thay thế / thay thế được |
| subtype / supertype | kiểu con / kiểu cha |
| contract | hợp đồng: những gì một method hứa với code gọi nó |
| caller / client | code gọi, code dùng |
| precondition | điều kiện đầu vào: caller phải đảm bảo gì *trước* khi gọi |
| postcondition | điều kiện đầu ra: method đảm bảo gì *sau* khi gọi xong |
| invariant | bất biến: điều luôn đúng với object ([D2 #2](d02-oop.md#2-encapsulation-và-invariant)) |
| Design by Contract | thiết kế theo hợp đồng (Bertrand Meyer) |
| backward compatible | tương thích ngược |

### 🇬🇧 Theory

Barbara Liskov (1987), in simple words: **if code works correctly with a `Parent`, it must still work correctly when you pass it a `Child` instead, without the code knowing or checking.**

The key word is *correctly*. Python and TypeScript only check that the child **has** the same methods (structure). LSP asks a harder question: does the child **behave** the way callers of the parent expect?

Contract rules (Design by Contract): a subtype may **weaken preconditions** (accept more) and **strengthen postconditions** (guarantee more). It must **never strengthen preconditions**, **weaken postconditions**, add **new exception types** the caller doesn't expect, or **break the parent's invariants**.

### 🇻🇳 Giải thích

LSP đã xuất hiện từ trước, chỉ chưa có tên:
- [D3 #1](d03-composition-vs-inheritance.md#1-is-a-vs-has-a-và-composition-là-gì): phép thử thứ 2 trong 4 phép thử is-a, **Substitution** ("thay Y bằng X ở mọi nơi, mọi caller vẫn đúng?"), chính là LSP.
- [D2 #5](d02-oop.md#5-polymorphism): polymorphism chỉ an toàn khi mọi lớp con giữ đúng lời hứa mà caller dựa vào.

**Contract** của một method = **nhận gì, trả gì, lỗi gì** ([D2 #3](d02-oop.md#3-abstraction-và-khác-encapsulation-chỗ-nào)). Khi hỏi "method này hứa gì", liệt kê đủ 3 thứ: **(1) giá trị trả về, (2) state thay đổi ra sao, (3) lỗi nào có thể ném**. Lời hứa thường nằm ở (2) và (3) nhiều hơn ở (1), và phần lớn là **lời hứa ngầm**, không được viết ra ở đâu.

**Hai luật, nhìn từ góc caller** (caller chỉ biết hợp đồng của cha):

| Chiều | Được phép | Bị cấm | Vì sao |
|---|---|---|---|
| **Vào** (precondition) | đòi **ít hơn hoặc bằng** cha | đòi **nhiều hơn** cha | Con đòi thêm thì input mà caller tin là hợp lệ bị từ chối. Caller không tránh được lỗi đó nếu không biết kiểu thật, nên buộc phải `isinstance`. |
| **Ra** (postcondition) | đảm bảo **nhiều hơn hoặc bằng** cha | đảm bảo **ít hơn** cha | Bước tiếp theo của caller xây trên lời hứa của cha. Con hứa ít hơn thì bước sau chạy trên giả định sai, có khi **sai im lặng** (báo thành công mà mất dữ liệu). |
| **Bất biến** | giữ hoặc thêm | phá bất biến của cha | Rectangle–Square phá bất biến "w, h độc lập" |

> **Phản xạ:** *Con đòi ít hơn, hứa nhiều hơn, thì được. Ngược lại thì vỡ.* (Demand less, promise more.)

**"Không hứa ít hơn" cụ thể là gì** (cha: `quote()` trả `{"amount": int, "currency": str}`, `amount >= 0`, chỉ ném `PricingError`):

| Loại lời hứa | ✅ Hợp lệ | ❌ Vi phạm |
|---|---|---|
| Field | giữ field cũ, **thêm** field mới (`tax_breakdown`) | bỏ / đổi tên / đổi kiểu / cho phép `None` |
| Khoảng giá trị | trả khoảng **hẹp hơn** (`amount > 0`) | trả khoảng **rộng hơn** (`amount = -500`) |
| State | đúng như cha hứa (`save` xong thì `get` được) | không lưu, lưu một nửa |
| Lỗi | ít lỗi hơn; ném **lớp con** của lỗi đã khai báo (`CardDeclinedError(PaymentError)`) | ném loại lỗi **mới, không liên quan** (`TimeoutError`) |

Lưu ý chiều của khoảng giá trị: **đầu vào** của con được **rộng hơn** cha, còn **đầu ra** của con được **hẹp hơn** cha. Hai chiều ngược nhau vì caller *gửi* gì cũng phải được nhận, còn caller *nhận* gì cũng phải nằm trong thứ nó đã chuẩn bị xử lý.

Về lỗi:
- Python/TS không có checked exception (`throws` của Java). "Khai báo" nghĩa là lỗi nằm trong hợp đồng đã được ghi lại (docstring, tài liệu interface, cây exception riêng). Compiler không ép thì bạn phải tự giữ.
- Lỗi của tầng dưới phải được **bọc lại** thành lỗi trong hợp đồng: `except TimeoutError as e: raise PaymentError("gateway timeout") from e`. Vì vậy mỗi tầng repository/gateway nên có cây exception riêng, không để `pymysql.Error`, `socket.timeout` lọt lên.
- Lỗi đã khai báo dành cho **tình huống bất thường**. Một implementation *luôn luôn* ném `RepositoryError("read-only")` thì đúng câu chữ nhưng vẫn vi phạm tinh thần hợp đồng ("`save` lưu được, trừ khi có sự cố").

### Ví dụ 1: Rectangle–Square (kinh điển)

```python
class Rectangle:
    def __init__(self, width: int, height: int):
        self._width = width
        self._height = height

    def set_width(self, width: int) -> None:
        self._width = width

    def set_height(self, height: int) -> None:
        self._height = height

    def area(self) -> int:
        return self._width * self._height


class Square(Rectangle):
    def __init__(self, side: int):
        super().__init__(side, side)

    def set_width(self, width: int) -> None:   # giữ "hình vuông" luôn vuông
        self._width = width
        self._height = width

    def set_height(self, height: int) -> None:
        self._width = height
        self._height = height


def resize_banner(banner: Rectangle) -> int:
    banner.set_width(5)
    banner.set_height(4)
    return banner.area()

resize_banner(Rectangle(2, 3))   # 20
resize_banner(Square(3))         # 16, caller mong 20
```

Lần theo state (đừng đọc constructor rồi nhảy thẳng tới kết quả, bug nằm ở các lời gọi giữa chừng):

| Bước | `Rectangle(2,3)` | `Square(3)` |
|---|---|---|
| `set_width(5)` | w=5, h=3 | w=5, **h=5** |
| `set_height(4)` | w=5, h=4 | **w=4**, h=4 |
| `area()` | **20** | **16** |

`resize_banner` dựa vào một **postcondition ngầm** của `set_width`: *height giữ nguyên*. Square là Rectangle khi xét **hình tĩnh**, nhưng Square (mutable) không giữ được **hợp đồng hành vi khi bị thay đổi** của Rectangle ("width và height đổi độc lập").

Nếu `Rectangle` **immutable** (không setter, chỉ `area()`) thì Square **không** vi phạm, vì hợp đồng "set_width không đụng height" không còn tồn tại. LSP được xét trên **hợp đồng cụ thể** của cha.

### Ví dụ 2: cùng vấn đề, trong backend

```python
class OrderRepository:
    def __init__(self):
        self._rows: dict[str, dict] = {}

    def get(self, order_id: str) -> dict | None:
        return self._rows.get(order_id)

    def save(self, order: dict) -> None:
        self._rows[order["id"]] = order


class ReadOnlyOrderRepository(OrderRepository):   # dùng cho read replica
    def save(self, order: dict) -> None:
        raise NotImplementedError("read-only replica: writes are not allowed")


def place_order(repo: OrderRepository, order: dict) -> str:
    repo.save(order)
    return f"order {order['id']} placed"

place_order(ReadOnlyOrderRepository(), {"id": "A2", "total": 100})  # NotImplementedError
```

- **Cha hứa:** sau khi `save(order)` trả về bình thường, đơn **đã được lưu**, `get(order["id"])` lấy lại được. (`save` trả `None`: lời hứa nằm ở **state**, không ở giá trị trả về.)
- **Con trả lại:** không lưu gì, còn ném một loại lỗi caller không biết là có thể xảy ra, nên vi phạm cả postcondition lẫn luật về lỗi.
- Tệ hơn nữa là bản `save` **lặng lẽ `pass`**: `place_order` báo "placed" nhưng đơn mất. Vi phạm im lặng nguy hiểm hơn vi phạm ném lỗi.

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3 --strict --noImplicitOverride`, Node 22; Python kiểm bằng `mypy 1.11 --strict`.

| Tình huống | Python runtime | mypy | TS `tsc --strict` |
|---|---|---|---|
| Rectangle–Square (sai hành vi) | chạy, ra 16 | không báo | không báo, chạy ra `20 16` |
| Override rồi `throw` (ReadOnlyRepo) | chạy | không báo | không báo |
| Con trả kiểu **yếu hơn** (`T` thành `T \| null`) | chạy | ❌ `[override]` | ❌ TS2416 |
| Con **thu hẹp kiểu tham số** (`string` thành `"momo"`) | chạy | ❌ kèm *"This violates the Liskov substitution principle"* | ⚠️ **dạng method compile qua**; dạng property `refund: (...) => string` thì ❌ TS2416 |

Bẫy riêng của TS: tham số của **method** là *bivariant*. `strictFunctionTypes` chỉ áp cho property kiểu hàm, không áp cho method:

```ts
type PaymentMethodName = "momo" | "vnpay" | "card";
class Refunder {
  refund(method: PaymentMethodName, amount: number): string { return `refund ${amount} via ${method}`; }
}
class MomoOnlyRefunder extends Refunder {
  override refund(method: "momo", amount: number): string { return `momo refund ${amount}`; } // precondition chặt hơn, tsc vẫn cho qua
}
const r: Refunder = new MomoOnlyRefunder();
console.log(r.refund("card", 10)); // "momo refund 10": hoàn tiền sai kênh, không có lỗi nào
```

Type checker chỉ bắt **phần chữ ký** của hợp đồng (và TS còn bỏ lọt tham số method). Phần **hành vi** (state sau khi gọi, exception) thì không ngôn ngữ nào bắt được, phải dùng test.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"Compile qua, cùng chữ ký, thì đúng LSP."** Sai. LSP là về hành vi; Rectangle–Square đúng chữ ký 100% vẫn vi phạm.
- **"Square is-a Rectangle trong toán nên kế thừa là đúng."** Is-a trong code = *thay được về hành vi*, không phải phân loại đời thực.
- **Chỉ nhìn giá trị trả về khi xét postcondition.** Phải nhìn đủ: giá trị trả về, state, exception.
- **"Không hứa ít hơn" = giữ nguyên.** Sai. Con được **hứa nhiều hơn**: thêm field, trả khoảng giá trị hẹp hơn, ném ít lỗi hơn.
- **Mọi exception ở lớp con đều sai.** Không. Lỗi đã nằm trong hợp đồng (hoặc lớp con của nó) thì hợp lệ; lỗi **mới, không liên quan** mới bị cấm.
- **Sửa Rectangle–Square bằng cách cho `Square` override `area()`.** Che triệu chứng. Gốc là quan hệ kế thừa sai.

### 🏛️ Góc nhìn Solution Architect

- **LSP ở mức service = API versioning.** Bản deploy mới của API là "lớp con" của bản cũ, client là caller:
  - *Đòi ít hơn:* không thêm field bắt buộc vào request, không thu hẹp enum/range đầu vào.
  - *Hứa nhiều hơn:* được thêm field vào response; không bỏ field, không đổi kiểu, không trả thêm mã lỗi mới mà client chưa biết.
  - Đây là luật *backward-compatible change*, gốc của nguyên tắc Postel: "liberal in what you accept, conservative in what you send".
- **Contract testing (Pact, consumer-driven contracts):** mỗi consumer ghi lại thứ nó *thực sự dựa vào* (lời hứa ngầm), provider phải chạy pass bộ contract đó trong CI trước khi deploy. Đây là cách kiểm tra LSP giữa các service, nơi type checker không với tới.
- **Áp dụng trong code:** mỗi interface quan trọng (`OrderRepository`, `PaymentGateway`) có **một bộ test chung** chạy lên *mọi* implementation (in-memory, MySQL, replica...). Implementation nào fail bộ test chung là vi phạm LSP.
- Read replica **không nên** là lớp con của repository ghi. Cách sửa (tách `OrderReader` / `OrderWriter`) là ISP ở mục #3.

### ✅ Tự kiểm tra (trả lời bằng tiếng Anh)

1. 🇬🇧 State the two contract rules for a subclass in one sentence each, and say *why* from the caller's point of view. 🇻🇳 Nêu 2 luật hợp đồng cho lớp con, mỗi luật một câu, kèm lý do nhìn từ caller.
2. 🇬🇧 If `Rectangle` were **immutable** (no setters, only `area()`), would `Square(Rectangle)` still violate LSP? Why? 🇻🇳 Nếu `Rectangle` immutable, `Square(Rectangle)` còn vi phạm LSP không? Vì sao?
3. 🇬🇧 Your public API v2 adds a new *required* field `currency` to `POST /orders`. Which contract rule does that break? 🇻🇳 API v2 thêm field *bắt buộc* `currency` vào `POST /orders`. Việc này phá luật nào?
4. 🇬🇧 Parent promises `amount >= 0`. A child always returns `amount > 0`. Is that OK? And a child that accepts `amount >= 0` when the parent required `amount > 0`? 🇻🇳 Cha hứa `amount >= 0`, con luôn trả `amount > 0`: được không? Còn con nhận `amount >= 0` trong khi cha đòi `amount > 0`?

<details><summary>Đáp án / Key points</summary>

**1.** Con **không được đòi đầu vào chặt hơn** cha, vì caller chỉ biết luật của cha, nên input hợp lệ theo cha sẽ bị con từ chối. Con **không được hứa kết quả yếu hơn** cha (kể cả ném exception mới), vì bước tiếp theo của caller dựa trên lời hứa của cha, hứa ít hơn là caller chạy trên giả định sai, thậm chí sai im lặng.

**2.** Không vi phạm. Vi phạm đến từ hợp đồng *thay đổi state* ("set_width không đụng height"). Bỏ setter thì hợp đồng đó biến mất; hợp đồng còn lại "`area()` = w × h" Square giữ được. LSP xét trên hợp đồng cụ thể; immutable làm hợp đồng nhỏ đi nên dễ thay thế hơn.

**3.** Làm chặt precondition: client v1 không gửi `currency` nên bị 400. Cách tương thích: `currency` optional có giá trị mặc định, hoặc version mới để client chủ động chuyển.

**4.** Cả hai đều được. Đầu ra hẹp hơn (`> 0` nằm trong `>= 0`) là hứa nhiều hơn. Đầu vào rộng hơn (nhận cả 0) là đòi ít hơn.

</details>

---

## 2. Dấu hiệu vi phạm LSP

| English | Nghĩa |
|---|---|
| code smell | dấu hiệu bất ổn trong code (chưa chắc là bug) |
| type check / type sniffing | kiểm tra kiểu lúc chạy (`isinstance`, `type(x) ==`, `hasattr`) |
| refused bequest | "từ chối di sản": lớp con kế thừa method nhưng không muốn / không làm được |
| no-op | không làm gì cả |
| silent failure | lỗi im lặng: không báo lỗi nhưng kết quả sai |
| symptom vs root cause | triệu chứng và nguyên nhân gốc |

### 🇬🇧 Theory

You rarely see the word "Liskov" in a bug report. You see its **smells**. The two classic ones:
1. A subclass **overrides a method only to throw** `NotImplementedError` (the "refused bequest" smell).
2. Calling code has to **check the concrete type** (`isinstance`, `type(x) ==`, `hasattr`) before using an object it received as the parent type.

Smell 1 is the **root cause** in the subclass; smell 2 is the **symptom** in the caller. They are not the only ones: any break of the contract rules in section #1 is a violation, even when nothing throws.

### 🇻🇳 Giải thích

Mục #1 cho **luật**, mục #2 luyện **mắt**. Cặp nguyên nhân và triệu chứng: lớp con không giữ được hợp đồng nên caller phải "biết" lớp con cụ thể để né. Mỗi lần caller `isinstance` để né thì polymorphism ([D2 #5](d02-oop.md#5-polymorphism)) coi như mất, và OCP ([D4 #3](d04-solid-s-o.md#3-ocp-biến-switchif-thành-interface--implementation)) vỡ theo: thêm lớp con mới là phải sửa caller.

Bảng dấu hiệu:

| Dấu hiệu | Nằm ở | Luật bị phá |
|---|---|---|
| override rồi `raise NotImplementedError` / "not supported" | lớp con (nguyên nhân) | postcondition yếu hơn + lỗi mới (refused bequest) |
| `if len(x) > N: raise ValueError` với input cha cho phép | lớp con (nguyên nhân) | precondition chặt hơn + lỗi mới |
| `return` / `pass` sớm mà không làm điều đã hứa | lớp con (nguyên nhân) | postcondition yếu hơn, **im lặng** |
| `isinstance` / `type(x) ==` / `hasattr` / `"x" in obj` trên object nhận qua kiểu cha | caller (triệu chứng) | (hệ quả) |

**Lớp con ném lỗi *nằm trong* cây lỗi của cha thì đã hợp lệ chưa?** "Caller không crash" là điều kiện cần, chưa đủ. Kiểm 2 lớp:

| Lớp | Câu hỏi |
|---|---|
| 1. Câu chữ | Lỗi có thuộc cây lỗi của cha (hoặc lớp con của nó) không? |
| 2. Tinh thần | ***Caller có gọi thành công với input đó mà không cần biết mình đang cầm lớp con nào không?*** |

- Thất bại do **môi trường lúc chạy** (bounce, timeout), kênh nào cũng có thể gặp, caller không tránh được và đã được báo trước: ✅ hợp lệ.
- Thất bại **đoán trước được từ (input + kiểu con)** (SMS luôn lỗi với tin > 160 ký tự): ❌ precondition chặt hơn **đội lốt** lỗi hợp lệ, dù có bọc trong `DeliveryError`.

### Ví dụ: `NotificationService` (bài tập đã làm)

```python
from dataclasses import dataclass


@dataclass
class User:
    id: int
    email: str
    phone: str
    device_token: str | None = None


class DeliveryError(Exception): ...
class BounceError(DeliveryError): ...


class NotificationChannel:
    def send(self, user: User, message: str) -> None:
        """Deliver `message` to `user`. Raises DeliveryError if delivery fails."""
        raise NotImplementedError


class EmailChannel(NotificationChannel):          # ✅ hợp lệ
    def send(self, user: User, message: str, cc: list[str] | None = None) -> None:
        if user.email.endswith("@invalid.test"):  # giả lập tín hiệu bounce từ SMTP
            raise BounceError(f"mailbox {user.email} bounced")
        print(f"[email] to={user.email} cc={cc or []}: {message}")


class SmsChannel(NotificationChannel):            # ❌ precondition chặt hơn + lỗi mới
    def send(self, user: User, message: str) -> None:
        if len(message) > 160:
            raise ValueError("SMS body must be <= 160 chars")
        print(f"[sms] to={user.phone}: {message}")


class PushChannel(NotificationChannel):           # ❌ postcondition yếu hơn, im lặng
    def send(self, user: User, message: str) -> None:
        if user.device_token is None:
            return
        print(f"[push] token={user.device_token}: {message}")


class WebhookChannel(NotificationChannel):        # ❌ refused bequest
    def send(self, user: User, message: str) -> None:
        raise NotImplementedError("webhooks are async, call send_async()")

    def send_async(self, user: User, message: str, callback_url: str) -> None:
        print(f"[webhook] POST {callback_url} user={user.id}: {message}")


class NotificationService:
    def __init__(self, channels: list[NotificationChannel]):
        self.channels = channels

    def notify_order_shipped(self, user: User, order_id: str, tracking_url: str) -> list[str]:
        message = f"Your order {order_id} has shipped. Track it here: {tracking_url}"
        delivered = []
        for channel in self.channels:
            if isinstance(channel, WebhookChannel):       # triệu chứng: né refused bequest
                channel.send_async(user, message, callback_url="https://partner.example/hooks")
                delivered.append("webhook")
                continue
            if isinstance(channel, SmsChannel):           # triệu chứng: né precondition chặt hơn
                message = message[:160]
            try:
                channel.send(user, message)
                delivered.append(type(channel).__name__)
            except DeliveryError as e:
                print(f"delivery failed: {e}")
        return delivered
```

Chạy thật với `[Sms, Email, Push, Webhook]` và tin 217 ký tự: **không exception nào**, nhưng có 2 lỗi im lặng.

| Lỗi im lặng | Nguyên nhân | Hậu quả |
|---|---|---|
| Email và Webhook cũng nhận tin bị cắt còn 160 (đổi thứ tự `[Email, Sms, …]` thì Email nhận đủ 217) | `message = message[:160]` **gán đè biến dùng chung cho cả vòng lặp** | link tracking mất đuôi; hành vi phụ thuộc thứ tự list |
| `delivered` có `PushChannel` nhưng không có dòng `[push]` | `PushChannel` `return` sớm | log/metric nói dối, CSKH không debug được, mất cơ hội retry/fallback |

Hai bài học:
- **Workaround bằng `isinstance` cho một lớp con thường làm hỏng lây sang lớp con khác.**
- **Vi phạm im lặng không sinh ra triệu chứng ở caller** (Push không có dòng né nào), nên mắt review không có gì để bắt. Vì vậy nó nguy hiểm nhất.

> **Phản xạ đọc code có state:** lần theo state qua từng lời gọi và từng vòng lặp. Thấy biến bị gán lại *trong* vòng lặp thì hỏi *"vòng sau nhìn thấy giá trị nào?"* (Cùng kiểu sai với việc đoán `area()` của Square ở mục #1.)

**Hướng sửa: sửa tại nguyên nhân, không sửa ở caller**

| Lớp con | Sửa | Nguyên lý |
|---|---|---|
| `SmsChannel` | tự gánh giới hạn: tách nhiều SMS hoặc tự rút gọn link, caller gửi tin đầy đủ | Tell, Don't Ask ([D2 #7](d02-oop.md#7-tell-dont-ask)) |
| `PushChannel` | không có token thì `raise DeliveryError("no device token")` | giữ postcondition |
| `WebhookChannel` | không phải `NotificationChannel`: tách interface riêng (mục #3 ISP) hoặc bọc lại (nhận `callback_url` qua constructor, `send()` đẩy job vào queue) | Composition ([D3 #3](d03-composition-vs-inheritance.md#3-composition--delegation)) |

Sau khi sửa, caller chỉ còn `try: channel.send(...) except DeliveryError`. Lưu ý: bọc Webhook kiểu "đẩy vào queue" đổi nghĩa "đã gửi" thành "**đã nhận để gửi**". Nếu vậy phải sửa hợp đồng của cha cho **mọi** kênh: một hợp đồng chỉ có một nghĩa.

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3 --strict`, Node 22.

- `c instanceof WebhookChannel` chạy được (class tồn tại lúc runtime). `c instanceof NotificationChannel` với **interface** thì lỗi compile `TS2693: 'NotificationChannel' only refers to a type, but is being used as a value here`, vì interface bị xoá lúc chạy ([D2 #6](d02-oop.md#6-interface-vs-abstract-class)). Nên trong TS triệu chứng thường có dạng **duck check**: `if ("sendAsync" in c)` hoặc type guard tự viết. Cùng một smell, khác cú pháp.
- JS không có sẵn `NotImplementedError`. Dạng hay gặp: `throw new Error("not implemented")`, `"Method not supported"`. Grep đúng mấy chuỗi này khi review.
- **Không phải mọi `switch` theo kiểu đều là smell.** Discriminated union đóng (`type Shipment = {kind:"standard",…} | {kind:"express",…}`) + `switch (s.kind)` + `default` gán vào `never` để kiểm tra đủ case là **mô hình hoá dữ liệu**: không có lớp cha nào hứa hành vi, nên không có LSP để vi phạm. Smell chỉ xuất hiện khi nhận object **qua kiểu cha có hành vi** rồi lại hỏi "mày thật ra là ai?".

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **Thấy `if ... raise` ở lớp con là kết luận vi phạm ngay.** Kiểm 2 lớp: lỗi có thuộc cây lỗi của cha không (tra cây kế thừa của exception trước, vd `BounceError(DeliveryError)`), và thất bại do môi trường hay do giới hạn riêng của lớp con.
- **Tham số optional thêm vào lớp con là vi phạm.** Không: `cc: list[str] | None = None` là **nới precondition** (đòi ít hơn), hợp lệ.
- **Bọc giới hạn riêng vào lỗi hợp lệ** (`raise DeliveryError("> 160")`) rồi coi như xong: đúng câu chữ, sai tinh thần.
- **Sửa ở caller** (thêm `isinstance`, cắt `message`): bản vá lan ra mọi caller và có thể hỏng lây sang lớp con khác.
- **Chỉ đi tìm `isinstance`.** Vi phạm im lặng không để lại triệu chứng. Đọc từng override và hỏi *"return ở đây thì lời hứa đã được thực hiện chưa?"*
- **Coi mọi `switch` theo `kind` là vi phạm LSP.** Union dữ liệu đóng thì không phải.

### 🏛️ Góc nhìn Solution Architect

- **Grep khi review / audit:** `NotImplementedError`, `not implemented`, `not supported`, `isinstance(` / `instanceof` trong tầng service, override có thân `pass` hoặc `return` sớm. Cách rẻ nhất để tìm điểm nóng LSP trong codebase lớn.
- **Vi phạm im lặng là kiểu sự cố đắt nhất ở mức hệ thống**: không alert, error rate không tăng, metric báo xanh, người phát hiện là khách hàng sau nhiều ngày. Hợp đồng giữa các service phải phân biệt `accepted` (202) với `delivered`; mọi "không làm được" phải được báo ra, không nuốt.
- **Bộ test hợp đồng chung** (mục #1) bắt được cả 3 lỗi: chạy cùng test "send rồi kiểm tra đã gửi" trên mọi channel thì Sms fail (tin dài), Push fail (không token mà không lỗi), Webhook fail (`NotImplementedError`).

### ✅ Tự kiểm tra (trả lời bằng tiếng Anh)

1. 🇬🇧 Name the two classic LSP smells and say which one is the *cause* and which is the *symptom*. 🇻🇳 Kể 2 dấu hiệu kinh điển, cái nào là nguyên nhân, cái nào là triệu chứng?
2. 🇬🇧 A subclass raises an exception that *is* in the parent's declared error tree. Give the one question that decides whether it still violates LSP. 🇻🇳 Lớp con ném lỗi *nằm trong* cây lỗi của cha. Câu hỏi nào quyết định nó còn vi phạm LSP hay không?
3. 🇬🇧 Why is a silent `return` worse than `raise NotImplementedError`? 🇻🇳 Vì sao `return` im lặng tệ hơn `raise NotImplementedError`?
4. 🇬🇧 With the current design, what must change to add `ZaloChannel` (1000-char limit)? Which D4 principle does that break? 🇻🇳 Theo thiết kế hiện tại, thêm `ZaloChannel` phải sửa chỗ nào? Phá nguyên lý nào ở D4?

<details><summary>Đáp án / Key points</summary>

**1.** Override rồi `raise NotImplementedError` là **nguyên nhân** (lớp con không giữ hợp đồng). Caller `isinstance` / `type(x) ==` / `hasattr` / `"x" in obj` là **triệu chứng** (caller né lớp con). Sửa ở nguyên nhân.

**2.** *"Caller có gọi thành công với input đó mà không cần biết kiểu con không?"* Thất bại đoán trước được từ (input + kiểu con) thì vẫn vi phạm (precondition chặt hơn đội lốt). Thất bại do môi trường lúc chạy thì hợp lệ.

**3.** `raise` còn để lại dấu vết (crash, log, triệu chứng `isinstance`) nên review/monitoring bắt được. `return` im lặng làm caller tin đã xong: log/metric nói dối, mất retry/fallback, khách hàng là người phát hiện.

**4.** Thêm một `if isinstance(channel, ZaloChannel): message = message[:1000]` nữa trong `notify_order_shipped`, tức là sửa caller đã ổn định mỗi khi có kênh mới: phá **OCP**. Do thứ tự list, nhánh mới còn có thể cắt tin của các kênh phía sau. Mỗi kênh tự gánh giới hạn thì thêm Zalo chỉ cần 1 class + 1 dòng đăng ký ở composition root.

</details>

---

## 3. ISP: tách interface theo nhu cầu từng client

| English | Nghĩa |
|---|---|
| Interface Segregation Principle (ISP) | Nguyên lý tách interface |
| segregate | tách riêng |
| fat interface / header interface | interface "béo": gom mọi method mà một class *có*, không theo nhu cầu của ai |
| role interface | interface theo vai trò: chỉ gồm những gì một client cần cho một vai trò |
| client | code **dùng** interface (khác với implementer: class **cài đặt** interface) |
| implementer | class cài đặt interface |
| stub | method giả, cài cho có (để trống / ném lỗi) |
| surface area | số method mà một client bị phụ thuộc vào |

### 🇬🇧 Theory

Robert C. Martin: **"Clients should not be forced to depend on methods they do not use."**

ISP talks about **clients**, the code that *uses* the interface. An interface should be shaped by **what its callers need**, not by **what one implementation happens to be able to do**. When one interface serves many different clients it grows fat, and two groups get hurt:
1. **Implementers** must write methods they cannot support, so they write stubs that throw: the LSP smell of section #2.
2. **Clients** depend on methods they never call. Changes to those methods can still force them to change, re-test or redeploy, and their tests must fake a big interface.

Split by **client need**, verify with the **implementation table**. Keep together methods that are always used and supported together. A role interface names *a capability a client needs* (`Refunder`), not *a thing that exists* (`StripeGateway`). One class may implement many role interfaces.

### 🇻🇳 Giải thích

ISP là **anh em của LSP**: lớp con bị ép cài method không làm được thường vì **interface quá to**. ISP sửa từ gốc: thu nhỏ hợp đồng về đúng thứ caller cần, lớp con không còn phải "hứa" thứ không giữ được.

Tách **không phải cắt bừa cho nhỏ**: tách theo **trục nhu cầu của từng client**, giống axis of variation ở [D4 #3](d04-solid-s-o.md#3-ocp-biến-switchif-thành-interface--implementation) nhưng nhìn từ phía người dùng. Tách theo client cũng là SRP ([D4 #1](d04-solid-s-o.md#1-srp-theo-nghĩa-actor)) áp lên interface: 2 client = 2 lý do thay đổi.

**Quy trình 5 bước:**
1. Lập bảng **client × method** (client nào thực sự gọi method nào).
2. Gom method theo client; xác nhận bằng bảng **implementation × nhóm**. Method luôn được cùng client dùng và cùng có/cùng không ở mọi implementation thì đi chung.
3. Đặt tên theo **vai trò nhìn từ client** (`Refunder`), không theo class (`StripeGateway`).
4. Mỗi implementation chỉ thoả những role nó làm được thật; client chỉ nhận đúng role nó dùng.
5. Kiểm tra: không còn stub `NotImplementedError`; type checker chặn được việc ghép sai.

### Ví dụ: `PaymentGateway` béo

```python
class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, order_id: str, amount: int) -> str: ...
    @abstractmethod
    def refund(self, transaction_id: str, amount: int) -> None: ...
    @abstractmethod
    def create_subscription(self, customer_id: str, plan_id: str) -> str: ...
    @abstractmethod
    def cancel_subscription(self, subscription_id: str) -> None: ...
    @abstractmethod
    def verify_webhook(self, payload: bytes, signature: str) -> bool: ...
    @abstractmethod
    def settlement_report(self, day: date) -> list[dict]: ...


class CodGateway(PaymentGateway):
    """Cash on delivery: the shipper collects cash, there is no online API."""
    def charge(self, order_id, amount): return f"cod_{order_id}"
    def refund(self, transaction_id, amount):
        raise NotImplementedError("COD refunds are done manually by finance")
    def create_subscription(self, customer_id, plan_id):
        raise NotImplementedError("COD has no subscriptions")
    def cancel_subscription(self, subscription_id):
        raise NotImplementedError("COD has no subscriptions")
    def verify_webhook(self, payload, signature):
        raise NotImplementedError("COD sends no webhooks")
    def settlement_report(self, day): return [{"day": str(day), "net": 0}]
# MomoGateway: 2 stub (subscription). StripeGateway: làm được tất cả.
# 5 client (Checkout, Refund, SubscriptionBilling, WebhookController, FinanceReconciliation) đều nhận cả PaymentGateway.
```

`RefundService(CodGateway()).refund_order(...)` → `NotImplementedError` **lúc chạy**, type checker không cảnh báo vì `CodGateway` *đúng là* một `PaymentGateway`.

**Bước 1: client × method**

| Client | charge | refund | create_sub | cancel_sub | verify_webhook | settlement_report |
|---|---|---|---|---|---|---|
| CheckoutService | ✅ | | | | | |
| RefundService | | ✅ | | | | |
| SubscriptionBilling | | | ✅ | ✅ | | |
| PaymentWebhookController | | | | | ✅ | |
| FinanceReconciliation | | | | | | ✅ |

`CheckoutService` dùng 1 method, phụ thuộc vào **5 method không dùng**. Mỗi hàng một cụm ✅, không cột nào dùng chung: dấu hiệu **header interface** (dựng theo thứ Stripe làm được, không theo thứ caller cần).

**Bước 2: implementation × nhóm**

| Implementation | Charge | Refund | Subscription | Webhook | Settlement |
|---|---|---|---|---|---|
| Stripe | ✅ | ✅ | ✅ | ✅ | ✅ |
| Momo | ✅ | ✅ | ❌ | ✅ | ✅ |
| COD | ✅ | ❌ | ❌ | ❌ | ✅ |

- `create_sub` + `cancel_sub` **đi chung**: cùng client, cùng có/cùng không. Tách ra không giúp ai (ranh giới chống tách quá tay).
- `charge` / `refund` **tách**: 2 client khác nhau, và COD có cái này không có cái kia. Kể cả khi mọi gateway đều có `refund`, vẫn tách vì 2 client = 2 lý do thay đổi.

**Bước 3 → 5: sau khi tách**

```python
from datetime import date
from typing import Protocol


class Charger(Protocol):
    def charge(self, order_id: str, amount: int) -> str: ...

class Refunder(Protocol):
    def refund(self, transaction_id: str, amount: int) -> None: ...

class SubscriptionProvider(Protocol):
    def create_subscription(self, customer_id: str, plan_id: str) -> str: ...
    def cancel_subscription(self, subscription_id: str) -> None: ...

class WebhookVerifier(Protocol):
    def verify_webhook(self, payload: bytes, signature: str) -> bool: ...

class SettlementSource(Protocol):
    def settlement_report(self, day: date) -> list[dict[str, object]]: ...


class StripeGateway:   # thoả cả 5 role (1 class, không cần tách)
    ...

class MomoGateway:     # Charger, Refunder, WebhookVerifier, SettlementSource; không còn stub
    ...

class CodGateway:      # chỉ Charger + SettlementSource
    def charge(self, order_id: str, amount: int) -> str: return f"cod_{order_id}"
    def settlement_report(self, day: date) -> list[dict[str, object]]: return [{"day": str(day), "net": 0}]


class CheckoutService:
    def __init__(self, charger: Charger): self.charger = charger

class RefundService:
    def __init__(self, refunder: Refunder): self.refunder = refunder

class FinanceReconciliation:
    def __init__(self, sources: list[SettlementSource]): self.sources = sources
```

Kiểm tra (chạy thật, `mypy 1.11 --strict`):
- 6 stub `NotImplementedError` → 0. Vi phạm LSP biến mất từ gốc.
- File trên: `Success: no issues found`.
- Thêm `RefundService(CodGateway())` → `error: Argument 1 to "RefundService" has incompatible type "CodGateway"; expected "Refunder"`.

**Lợi ích lớn nhất:** lỗi trước đây chỉ lộ **lúc chạy trên production** (khách đòi hoàn tiền đơn COD) giờ bị chặn **lúc type-check**. Interface nhỏ để hệ thống kiểu nói đúng sự thật về khả năng của từng gateway.

Hoàn tiền COD thì sao? Một `Refunder` riêng (vd `ManualRefundTicket` tạo ticket cho tài chính), chọn theo phương thức thanh toán ở composition root ([D4 #4](d04-solid-s-o.md#4-ocp-với-strategy-và-factory)). Nếu nó chỉ *tạo yêu cầu* chứ không *hoàn ngay* thì hợp đồng `Refunder` phải định nghĩa là "đã ghi nhận yêu cầu hoàn" cho **mọi** implementation (một hợp đồng một nghĩa, mục #2).

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3 --strict`, Node 22, NestJS 10.4.4.

- `new RefundService(new CodGateway())` → `TS2345: Argument of type 'CodGateway' is not assignable to parameter of type 'Refunder'. Property 'refund' is missing`.
- Gộp role: `interface ChargeAndRefund extends Charger, Refunder {}`; class thoả nhiều role: `class StripeGateway implements Charger, Refunder`. Python: `class ChargeAndRefund(Charger, Refunder, Protocol)`.
- **Interface làm injection token trong NestJS** ([D2 #6](d02-oop.md#6-interface-vs-abstract-class)): interface bị xoá lúc chạy nên mỗi role cần một token riêng; một class thoả nhiều role đăng ký bằng `useExisting`:

```ts
export const CHARGER = Symbol("CHARGER");
export const REFUNDER = Symbol("REFUNDER");

@Injectable()
class CheckoutService { constructor(@Inject(CHARGER) private readonly charger: Charger) {} }
@Injectable()
class RefundService { constructor(@Inject(REFUNDER) private readonly refunder: Refunder) {} }

@Module({
  providers: [
    StripeGateway,
    { provide: CHARGER, useExisting: StripeGateway },
    { provide: REFUNDER, useExisting: StripeGateway },
    CheckoutService, RefundService,
  ],
})
class PaymentModule {}
```

Chạy thật: `app.get(CHARGER) === app.get(REFUNDER)` → **`true`**. Tách interface **không** có nghĩa là tách class hay tạo thêm instance.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **Tách vụn: mỗi method một interface.** Đơn vị tách là **nhu cầu của client**, không phải method (`create_sub` + `cancel_sub` đi chung).
- **Tách theo implementation** ("Stripe có gì, Momo có gì") thay vì theo client. Bảng implementation chỉ để xác nhận.
- **Nghĩ ISP buộc phải tách class.** ISP tách **hợp đồng**, không tách **code cài đặt** (việc đó là SRP). Stripe vẫn 1 class, thoả 5 role.
- **"Python duck typing không cần ISP."** Hợp đồng vẫn có, chỉ ngầm ([D2 #5](d02-oop.md#5-polymorphism)). `Protocol` nhỏ giúp mypy chặn ghép sai trước production.
- **Client cần 2 role nhưng nhận 2 tham số rời**, dù 2 role phải là cùng một gateway (refund phải đi đúng gateway đã charge). Khi đó gộp thành một interface kế thừa cả hai.

### 🏛️ Góc nhìn Solution Architect

- **Chi phí khi một interface to bị nhiều team cùng phụ thuộc:** `PaymentGateway` nằm trong shared package, 5 team import. Team Subscription thêm tham số `trial_days` vào `create_subscription` → **mọi** implementation (kể cả stub của COD) phải cập nhật, **mọi** team bump version + chạy lại test dù không dùng method đó, release của một team bị khoá theo lịch 4 team còn lại. Với role interface, thay đổi chỉ chạm `SubscriptionProvider` và đúng một client: **blast radius** của D4 áp lên hợp đồng.
- **Ở mức service, ISP = API theo consumer.** "God API" phục vụ mọi client là fat interface phân tán. **BFF (Backend for Frontend)** và GraphQL (client chỉ lấy field mình cần) là ISP ở mức hệ thống.
- **NestJS/Angular:** mỗi role một token; test `CheckoutService` chỉ mock **1 method** của `CHARGER` thay vì 6. Số method phải mock là thước đo ISP thực tế (nối dấu hiệu SRP ở [D4 #2](d04-solid-s-o.md#2-dấu-hiệu-vi-phạm-srp)).
- **Đừng dựng role interface trước khi có client** ([D4 #5](d04-solid-s-o.md#5-yagni-rule-of-three-khi-nào-trừu-tượng-hoá)). Thời điểm tách tự nhiên: implementation mới bắt đầu phải viết stub (`CodGateway` ra đời), hoặc client mới chỉ dùng một phần nhỏ.

### ✅ Tự kiểm tra (trả lời bằng tiếng Anh)

1. 🇬🇧 Who are the two victims of a fat interface, and what does each suffer? 🇻🇳 Hai nạn nhân của fat interface là ai, mỗi bên chịu gì?
2. 🇬🇧 Why keep `create_subscription` and `cancel_subscription` together but split `charge` and `refund`? 🇻🇳 Vì sao giữ chung `create/cancel_subscription` nhưng tách `charge` và `refund`?
3. 🇬🇧 After the split, `StripeGateway` is still one class. Does that violate ISP? 🇻🇳 Stripe vẫn là 1 class. Có vi phạm ISP không?
4. 🇬🇧 **Practice:** split `UserManager { create, find_by_id, find_by_email, check_password, ban, send_verification_email }`. `AdminDashboard` calls `find_by_id`, `ban`; `SignupService` calls `create`, `find_by_email`, `send_verification_email`; `AuthService` calls `find_by_email`, `check_password`. `LdapUserStore` cannot `create`, `ban` or `send_verification_email`. 🇻🇳 **Tự luyện:** tách interface trên theo 3 client.

<details><summary>Đáp án / Key points</summary>

**1.** **Implementer** bị ép cài method không làm được, viết stub ném lỗi (vi phạm LSP). **Client** phụ thuộc method không dùng: thay đổi ở đó vẫn bắt nó sửa/test/redeploy, test phải mock cả interface to.

**2.** `create/cancel_sub` luôn được cùng một client dùng và luôn cùng có/cùng không ở mọi gateway, tách ra không giúp ai. `charge`/`refund` thuộc 2 client khác nhau (2 lý do thay đổi), và COD có `charge` nhưng không có `refund`.

**3.** Không. ISP nói về **client** không bị ép phụ thuộc method không dùng. Mỗi client chỉ thấy role của mình; một class thoả nhiều role là bình thường (NestJS: một instance, nhiều token qua `useExisting`).

**4.** Một lời giải: `UserFinder { find_by_id, find_by_email }`, `UserRegistrar { create }`, `PasswordChecker { check_password }`, `UserModeration { ban }`. `find_by_email` dùng chung bởi Signup và Auth nên nằm trong `UserFinder`. `send_verification_email` **không thuộc** user store: là trách nhiệm tầng notification (SRP). LDAP thoả `UserFinder` + `PasswordChecker`. Cách gộp khác vẫn đúng nếu lập luận theo bảng client và LDAP không phải viết stub.

</details>

---

## 4. DIP: đảo mũi tên phụ thuộc, module cấp cao sở hữu interface

| English | Nghĩa |
|---|---|
| Dependency Inversion Principle (DIP) | Nguyên lý đảo ngược phụ thuộc |
| high-level module | module cấp cao: chứa **luật nghiệp vụ** (policy) |
| low-level module | module cấp thấp: **chi tiết kỹ thuật** (DB, HTTP, queue, file) |
| abstraction / detail | trừu tượng (interface/Protocol) / chi tiết cài đặt |
| source-code dependency | phụ thuộc mã nguồn: A `import` / biết tên B |
| flow of control | luồng điều khiển: lúc chạy, A gọi B |
| own (an interface) | sở hữu interface: quyết định nó trông thế nào và đặt nó ở đâu |
| port / adapter | cổng do domain định nghĩa / bộ chuyển đổi hạ tầng cắm vào cổng (Hexagonal) |

### 🇬🇧 Theory

DIP has two parts:
1. **High-level modules should not depend on low-level modules. Both should depend on abstractions.**
2. **Abstractions should not depend on details. Details should depend on abstractions.**

Separate two kinds of arrows:
- **Flow of control:** at runtime, who *calls* whom.
- **Source-code dependency:** who *imports* / *knows the name of* whom.

Without DIP the two arrows point the **same** way. DIP makes the source-code arrow point the **opposite** way from the flow of control: that is the "inversion". It only works if the **high-level module owns the abstraction**: the interface lives in the high-level package and is written in the high-level module's vocabulary.

### 🇻🇳 Giải thích

"Cả hai phụ thuộc abstraction" mới là nửa dễ. Nửa quyết định: ***abstraction nằm ở đâu, và được viết bằng từ vựng của ai?*** Domain **sở hữu** interface: interface nằm trong package `domain` và nói bằng ngôn ngữ nghiệp vụ (`save(order: Order)`), không nói bằng ngôn ngữ của DB (`insert_order_row(row: dict)`).

> **Phản xạ:** đừng hỏi "có interface chưa?", hãy hỏi ***"interface nằm trong package nào, và được viết bằng từ vựng của ai?"***

**DIP và OCP/Strategy (D4) giống nhau ở đâu?** Cùng một **cơ chế** (polymorphism qua interface, lắp ráp ở composition root), nhưng khác **câu hỏi**:

| | OCP / Strategy ([D4 #3-#4](d04-solid-s-o.md#4-ocp-với-strategy-và-factory)) | DIP |
|---|---|---|
| Câu hỏi | Thêm biến thể mới có phải sửa code cũ không? | Mũi tên phụ thuộc chỉ về đâu? Ai sở hữu interface? |
| Cần nhiều implementation? | Có (≥ 2 biến thể) | **Không**: chỉ có mỗi MySQL vẫn cần DIP |
| Lợi ích chính | thêm loại mới an toàn | domain test được không cần DB; đổi hạ tầng không chạm domain |

Việc "truyền vào qua constructor" là **DI**, một kỹ thuật (mục #5).

### Ví dụ "trước"

```
shop/
├── domain/order_service.py           # luật nghiệp vụ
├── infrastructure/mysql_order_repo.py
└── main.py
```

```python
# infrastructure/mysql_order_repo.py
class MySQLOrderRepo:
    def __init__(self, dsn: str):
        self.dsn = dsn                      # thật: pymysql.connect(dsn)

    def insert_order_row(self, row: dict) -> int:
        print(f"INSERT INTO orders ... ({self.dsn}) {row}")
        return 101
```

```python
# domain/order_service.py
from infrastructure.mysql_order_repo import MySQLOrderRepo


class OrderService:
    def __init__(self):
        self.repo = MySQLOrderRepo("mysql://prod-db/shop")

    def place_order(self, user_id: int, items: list[dict]) -> int:
        total = sum(i["price"] * i["qty"] for i in items)
        if total <= 0:
            raise ValueError("empty order")
        return self.repo.insert_order_row({"user_id": user_id, "total": total, "status": "pending"})
```

Hậu quả:
- **Không test được luật `total <= 0` mà không có MySQL.** `__init__` **tự tạo** repo nên không có chỗ truyền mock; phải monkeypatch theo đường import, và `import domain.order_service` đã kéo theo cả tầng infra (cả driver `pymysql` trong code thật).
- **Đổi sang PostgreSQL phải sửa file trong `domain`**, dù luật nghiệp vụ không đổi một chữ.

### Vẽ mũi tên: trước và sau

```
TRƯỚC
  Phụ thuộc mã nguồn:   domain ──────────▶ infrastructure
  Luồng điều khiển:     OrderService ────▶ MySQLOrderRepo        (cùng chiều)

SAU
  ┌────────────── domain ───────────────┐        ┌──── infrastructure ────┐
  │ OrderService ──▶ «OrderRepository»  │ ◀───── │ MySQLOrderRepo         │
  │                   save(Order)       │ implements                      │
  └─────────────────────────────────────┘        └────────────────────────┘

  Phụ thuộc mã nguồn:   domain ◀────────── infrastructure        ← ĐẢO CHIỀU
  Luồng điều khiển:     OrderService ────▶ MySQLOrderRepo        (KHÔNG đổi)

  main.py (composition root) ──▶ cả hai: nơi duy nhất biết MySQLOrderRepo
```

**Cái bị "đảo" là mũi tên phụ thuộc mã nguồn giữa 2 package**: `domain → infrastructure` thành `infrastructure → domain`, ngược chiều với luồng điều khiển. Lúc chạy domain vẫn gọi MySQL; trong mã nguồn, MySQL phải `import` domain và tuân theo hợp đồng domain đặt ra.

**Hai cách làm "trông giống DIP" nhưng chưa đạt** (lỗi đã mắc khi tự vẽ):

| Cách làm | Vẽ ra | Vì sao chưa đạt |
|---|---|---|
| Interface đặt ở **package trung lập thứ ba** | `domain ──▶ contracts ◀── infrastructure` | Không có gì bị đảo, chỉ cùng chỉ vào bên thứ ba; chưa trả lời *ai sở hữu* `contracts` |
| Interface **giữ nguyên chữ ký của MySQL**: `insert_order_row(row: dict) -> int` | `domain ──▶ «interface hình MySQL»` | `insert`, `row`, `dict` là từ vựng SQL/driver. Đổi sang Mongo/event store thì interface đổi, kéo `OrderService` đổi: domain **vẫn phụ thuộc hạ tầng**, chỉ là gián tiếp |

### Ví dụ "sau" (đã chạy thật, `mypy --strict` sạch)

```python
# domain/order.py
from dataclasses import dataclass, field
from typing import NewType

OrderId = NewType("OrderId", int)

@dataclass
class Order:
    user_id: int
    total: int
    status: str = "pending"
    id: OrderId | None = field(default=None)
```

```python
# domain/order_repository.py: domain SỞ HỮU, viết bằng từ vựng domain
from typing import Protocol
from domain.order import Order, OrderId

class OrderRepository(Protocol):
    def save(self, order: Order) -> OrderId: ...
```

```python
# domain/order_service.py: không còn import infrastructure
from domain.order import Order, OrderId
from domain.order_repository import OrderRepository

class OrderService:
    def __init__(self, repo: OrderRepository):
        self.repo = repo

    def place_order(self, user_id: int, items: list[dict[str, int]]) -> OrderId:
        total = sum(i["price"] * i["qty"] for i in items)
        if total <= 0:
            raise ValueError("empty order")
        return self.repo.save(Order(user_id=user_id, total=total))
```

```python
# infrastructure/mysql_order_repo.py: chi tiết import domain, không phải ngược lại
from domain.order import Order, OrderId

class MySQLOrderRepo:                       # thoả domain.OrderRepository
    def __init__(self, dsn: str):
        self.dsn = dsn

    def save(self, order: Order) -> OrderId:
        row = {"user_id": order.user_id, "total": order.total, "status": order.status}  # dịch Order → row nằm Ở ĐÂY
        print(f"INSERT INTO orders ... ({self.dsn}) {row}")
        return OrderId(101)
```

```python
# main.py: composition root
service = OrderService(MySQLOrderRepo("mysql://prod-db/shop"))
```

Kiểm chứng:
- `grep` import: `domain/` chỉ import `domain.*` + thư viện chuẩn; `infrastructure/` import `domain.order`. Đúng chiều đã vẽ.
- Unit test luật `total <= 0` với `InMemoryOrderRepo` (5 dòng) pass, in `infrastructure loaded: False`: **test domain không nạp module hạ tầng nào**.
- Việc dịch `Order` → `row` nằm hẳn trong adapter. Đổi DB = thêm adapter mới, `domain/` giữ nguyên.

### 🔍 Làm rõ thêm (từ hỏi đáp)

**Đọc lại 2 câu định nghĩa bằng từ thường:**

| Thuật ngữ | Nghĩa thật | Không phải |
|---|---|---|
| high-level module | **policy**: hệ thống làm *gì*, theo luật nào | "tầng trên" |
| low-level module | **detail**: làm *bằng cách nào* (Mongo, HTTP, SMTP, Redis) | "tầng dưới" |
| depend on | trong **mã nguồn**, A nhắc tên B (import, kiểu tham số/trả về, mã lỗi) ⇒ B đổi thì A có thể phải sửa | "A gọi B lúc chạy" |
| abstraction | port viết bằng **từ vựng policy**, nằm trong **package policy** | "cứ có interface" |

- **Câu A** = luật nghiệp vụ không được nhắc tên công nghệ.
- **Câu B** = bản thân hợp đồng không được chứa chi tiết công nghệ. Vi phạm B gần như luôn kéo theo A: chữ ký có `SMTPTransportOptions` thì service phải `import nodemailer` để gọi.
- Hình ảnh: **cổng USB**. Laptop (policy) định nghĩa cổng, hãng chuột (detail) làm đầu cắm theo. Bên *dùng* định nghĩa cổng.

**Chữ ký (signature)** = phần người gọi phải biết để gọi: tên method + kiểu tham số + kiểu trả về (+ lỗi ném ra, là một phần hợp đồng dù TS/Python không ghi). Không gồm thân hàm. "Chữ ký của interface" = chữ ký mọi method public. DIP soi **chữ ký**, không soi thân: thân adapter chứa đầy SQL là đúng chỗ; nhưng mỗi kiểu trong chữ ký thì người gọi buộc phải biết. Cấu hình công nghệ (DSN, SMTP options, API key) đi vào **constructor của adapter**, không qua chữ ký port.

**DIP lật quy tắc phân tầng truyền thống.** Phân tầng: Controller → Service → Repository/DB, "tầng dưới không import tầng trên" ⇒ nghiệp vụ phụ thuộc DB. DIP: adapter DB ("tầng dưới") **import** domain. Clean Architecture viết lại: mũi tên không chỉ "xuống" mà chỉ "**vào trong**", về phía policy.

**"Repository đã map `Document` → object thuần, đổi DB chỉ sửa repo. Vậy DIP thêm được gì?"** Phần *hình dạng* đã đúng. Cái còn thiếu là **ai giữ hợp đồng sạch**: chữ ký class repo do người đang nghĩ bằng Mongo sửa tuỳ ý. Rò thường gặp dù đã map `Document`:

| Rò ở đâu | Dấu hiệu trong service | Bản domain |
|---|---|---|
| Transaction | `startSession()`, `{ session }` | port `UnitOfWork.run(work)`; adapter giữ session bằng `AsyncLocalStorage` |
| Query | `find({ createdAt: { $gte } })` | method nói ý định: `findPaidSince(from)` |
| Lỗi | `e.code === 11000` | adapter dịch sang `DuplicateOrderError` |
| Định danh | `new Types.ObjectId(id)` | `OrderId` của domain |
| Module khác | `conn.collection('users')` trong `OrderService` | port `BuyerDirectory.getActiveBuyer(id): Buyer` do **Order** sở hữu (ISP + DIP) |

Lợi ích lớn nhất trong dự án nhiều module **không phải đổi DB** mà là: schema của module khác đổi (team User đổi `tier` → Order không gãy ngầm), tách module thành service riêng (adapter Mongo → HTTP, `placeOrder` không đổi), test luật nghiệp vụ không cần Mongo, CI chặn được `domain/` import `mongoose`. Áp vào code cũ: bật luật CI cho thư mục mới, bắt đầu ở chỗ đau nhất (đọc thẳng collection module khác), mỗi lần sửa kéo một đoạn query ra adapter.

**Không đáng** khi: CRUD nhỏ, 1 DB, repo đã trả object thuần, không transaction xuyên repo, team 1-2 người.

**"Đọc `placeOrder` phải nhảy qua `save`, `Order.place`, handler event?"** Tách 3 thứ hay bị gộp: gọi port thay vì `conn.collection` (**DIP**); đưa luật vào `Order.place()` (rich domain model, *không bắt buộc*); `orderCount++` qua event (event-driven, *không bắt buộc*, làm luồng khó thấy hơn). Chỉ áp DIP thì toàn bộ luật vẫn nằm trong `placeOrder`, chỉ mất `startSession`/`$inc`/`11000`. Không cần đọc `save` để hiểu nghiệp vụ; cần debug *cách lưu* thì Go to Implementation.

**Kiểm tra DIP khi review, 3 bước:** (1) file này là policy hay detail? (2) policy có nhắc tên thư viện hạ tầng nào không (kể cả kiểu lỗi, `ObjectId`)? có ⇒ vi phạm A. (3) port có nằm trong package policy và chữ ký không chứa từ vựng hạ tầng không? sai ⇒ vi phạm B.

> **Phản xạ:** với mỗi kiểu trong chữ ký port, hỏi ***"đổi nhà cung cấp thì kiểu này còn đúng không?"*** `OrderId`: còn. `SMTPTransportOptions`, `html`: không ⇒ xuống adapter.

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3`, `--module commonjs`.

- Infra viết `import type { Order, OrderRepository } from "../domain/order-repository"`. File `mysql-order-repo.js` sau compile **không có `require` nào tới domain** (interface bị xoá). Mũi tên `infrastructure → domain` chỉ tồn tại ở mã nguồn / lúc type-check, không ở runtime. DIP là quan hệ **mã nguồn** nên mũi tên này vẫn tính và vẫn phải giữ đúng chiều.
- NestJS: **token cũng nằm trong domain**, cạnh interface (`export const ORDER_REPOSITORY = Symbol(...)`). Module hạ tầng đăng ký `{ provide: ORDER_REPOSITORY, useClass: MySQLOrderRepo }`. Token đặt trong module infra thì `OrderService` phải import infra để lấy token: mũi tên quay về chiều cũ.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"Có interface là có DIP."** Interface viết theo hình dạng hạ tầng, hoặc đặt trong package hạ tầng, thì domain vẫn phụ thuộc hạ tầng.
- **"Đảo" = đảo luồng gọi.** Lúc chạy domain vẫn gọi DB. Cái bị đảo là **mũi tên import** giữa các package.
- **Interface ở package trung lập thứ ba là xong.** Thiếu câu hỏi ai sở hữu.
- **Để lọt kiểu hạ tầng vào chữ ký** (`-> pymysql.Cursor`, `sqlalchemy.Row`, `raise pymysql.Error`): mũi tên ngược chiều đi cửa sau. Lỗi cũng là một phần hợp đồng (mục #1): bọc thành `RepositoryError` của domain.
- **DIP cho mọi thứ** (`datetime`, `json`, `math`). Chỉ đảo phụ thuộc vào **chi tiết dễ đổi hoặc gây khó khi test** (DB, HTTP, queue, đồng hồ, file). Thư viện chuẩn ổn định cứ phụ thuộc thẳng ([D4 #5](d04-solid-s-o.md#5-yagni-rule-of-three-khi-nào-trừu-tượng-hoá)).

### 🏛️ Góc nhìn Solution Architect

- **Ai sở hữu interface thì người đó quyết định hướng phụ thuộc thật sự.** Infra sở hữu (interface nằm trong infra, viết bằng từ vựng infra) thì mỗi lần đổi DB kéo domain sửa theo. Domain sở hữu thì infra phải "cắm vào" theo hình dạng domain yêu cầu. Đây là quan hệ quyền lực giữa các team: team hạ tầng không được tự ý đổi hợp đồng mà team nghiệp vụ dựa vào.
- **Hexagonal (Ports & Adapters):** `OrderRepository` là **port**, `MySQLOrderRepo` là **adapter**. **Clean Architecture** gọi là *Dependency Rule*: mũi tên mã nguồn chỉ được chỉ **vào trong** (frameworks/DB → adapters → use cases → entities). Cả hai là **DIP áp dụng có hệ thống** cho mọi ranh giới I/O.
- **Kiểm tra bằng máy:** công cụ kiểm luật import như `import-linter` (Python), `dependency-cruiser` hoặc `eslint-plugin-boundaries` (TS), chạy trong CI với luật "`domain` không được import `infrastructure`". Review thường bỏ sót mũi tên ngược chiều.
- **Khi nào package `contracts` riêng là đúng?** Khi interface do phía tiêu thụ định nghĩa nhưng nhiều bên cung cấp độc lập phải cài theo: JDBC (`java.sql.Connection`, mỗi hãng DB viết driver), SPI cho plugin. Tách package, nhưng **quyền sở hữu vẫn ở phía cấp cao**.
- **Nối D4:** composition root là nơi **duy nhất** được có mũi tên tới cả domain lẫn infrastructure (`main.py` trong sơ đồ "sau").

### ✅ Tự kiểm tra (trả lời bằng tiếng Anh)

1. 🇬🇧 In DIP, what exactly is "inverted"? What does *not* change? 🇻🇳 Trong DIP, chính xác cái gì bị đảo? Cái gì không đổi?
2. 🇬🇧 `OrderRepository` lives in `domain` but its method is `insert_order_row(row: dict)`. Is DIP satisfied? 🇻🇳 `OrderRepository` nằm trong domain nhưng method là `insert_order_row(row: dict)`. Đạt DIP chưa?
3. 🇬🇧 You only have one database and never plan to change it. Is DIP still worth it? Give one concrete benefit. 🇻🇳 Chỉ có 1 DB và không định đổi. DIP còn đáng không? Nêu 1 lợi ích cụ thể.
4. 🇬🇧 In NestJS, where should the `ORDER_REPOSITORY` token be declared, and what goes wrong if it lives in the infrastructure module? 🇻🇳 Token `ORDER_REPOSITORY` nên khai báo ở đâu? Khai báo trong module infra thì hỏng gì?

<details><summary>Đáp án / Key points</summary>

**1.** Bị đảo: **phụ thuộc mã nguồn giữa các package** (`domain → infrastructure` thành `infrastructure → domain`). Không đổi: **luồng điều khiển** lúc chạy (domain vẫn gọi DB). DIP làm 2 loại mũi tên này ngược chiều nhau.

**2.** Chưa. Vị trí đúng nhưng **hình dạng** do hạ tầng quyết định (`insert`, `row`, `dict` là từ vựng SQL). Đổi sang Mongo/event store thì interface đổi, kéo `OrderService` đổi. Phải là `save(order: Order) -> OrderId`.

**3.** Vẫn đáng: test luật nghiệp vụ không cần DB (`InMemoryOrderRepo`, không nạp module infra), test nhanh và ổn định. Đổi DB chỉ là lợi ích phụ. Chỉ làm cho phụ thuộc I/O, không làm cho thư viện chuẩn ổn định.

**4.** Trong **domain**, cạnh interface. Đặt trong infra thì `OrderService` phải import infra để lấy token: mũi tên `domain → infrastructure` quay lại dù đã có interface.

</details>

---

## 5. DIP / DI / IoC

| English | Nghĩa |
|---|---|
| Dependency Injection (DI) | tiêm phụ thuộc: đưa dependency **từ ngoài vào** thay vì tự tạo bên trong |
| constructor / setter injection | tiêm qua constructor / qua setter (property) |
| DI container | bộ máy tự tạo object và tiêm dependency (NestJS, Angular, `dependency-injector`) |
| Inversion of Control (IoC) | đảo quyền điều khiển: **framework gọi code của bạn**, thay vì bạn gọi thư viện |
| composition root | nơi duy nhất lắp ráp các object (`main.py`, `@Module({ providers })`) |
| service locator | object tự **hỏi** một registry toàn cục để lấy dependency (`Container.get(...)`) |

### 🇬🇧 Theory

- **DIP** is a **design principle**: source-code dependencies point toward policy, and policy owns the abstraction. It is about *which way the arrows point*.
- **DI** is a **technique**: an object receives its dependencies from outside (constructor, setter, or a container) instead of creating them. It is about *who creates the dependency*.
- **IoC** is a **broader idea**: the framework controls the flow and calls your code. *You call a library; a framework calls you.* A DI container is one form of IoC.

You can have DI without DIP. You can have IoC without DI. A DI container does not create DIP for you.

### 🇻🇳 Giải thích

| | DIP | DI | IoC |
|---|---|---|---|
| Loại | **nguyên lý** thiết kế | **kỹ thuật** | **ý tưởng** kiến trúc, rộng nhất |
| Câu hỏi kiểm tra | File policy có nhắc tên hạ tầng không? Ai sở hữu interface? | **Ai gọi constructor của dependency?** | **Ai nắm luồng chạy**: code của tôi hay framework? |
| Đạt khi | mũi tên mã nguồn chỉ về policy | dependency được truyền từ ngoài vào | framework gọi code của tôi |
| Ví dụ | port `OrderRepository` trong `domain` | `OrderService(repo)`, `@Inject(...)` | Nest container, FastAPI `Depends`, route handler, template method |

```
          IoC (framework gọi code của bạn)
   ┌──────────────────────────────────────────────┐
   │  template method · event loop · route handler │
   │   ┌───────────────────────┐                   │
   │   │ DI container (Nest,   │                   │       DI bằng tay
   │   │ Angular, Depends)     │◀── DI ───────────────▶  (main.py tự new: KHÔNG phải IoC)
   │   └───────────────────────┘                   │
   └──────────────────────────────────────────────┘

   DIP: một trục KHÁC. Hỏi "kiểu tham số là gì, nằm ở package nào",
   áp cho cả DI bằng tay lẫn DI qua container, đạt hoặc không.
```

- **DI giúp DIP vận hành được**: domain chỉ biết interface thì *ai đó bên ngoài* phải tạo adapter và truyền vào. Nhưng **kiểu của tham số** mới quyết định có DIP hay không.
- **DI bằng tay** là DI nhưng **không phải IoC**: code của bạn vẫn nắm việc lắp ráp.

> **Phản xạ DI:** hỏi ***"ai gọi constructor của dependency?"*** Chính class gọi ⇒ không DI. Bên ngoài gọi rồi truyền vào ⇒ DI, **bất kể kiểu tham số**.
> **Phản xạ DIP:** chỉ chấm **file policy**. Composition root import gì cũng được.
> **Phản xạ IoC:** hỏi ***"ở đây ai gọi ai?"***

### Ví dụ: 4 phiên bản `OrderService` (bài đã làm)

```python
# A: tự tạo bên trong
from infrastructure.mysql_order_repo import MySQLOrderRepo
class OrderService:
    def __init__(self) -> None:
        self.repo = MySQLOrderRepo("mysql://prod-db/shop")

# B: truyền vào qua constructor, nhưng kiểu là class hạ tầng
from infrastructure.mysql_order_repo import MySQLOrderRepo
class OrderService:
    def __init__(self, repo: MySQLOrderRepo) -> None:
        self.repo = repo

# C: truyền vào, kiểu là port domain sở hữu
from domain.order_repository import OrderRepository
class OrderService:
    def __init__(self, repo: OrderRepository) -> None:
        self.repo = repo

# main.py (B và C): composition root
service = OrderService(MySQLOrderRepo("mysql://prod-db/shop"))
```

D (NestJS) ở khối 🟦 bên dưới: `constructor(private repo: MongoOrderRepository)`, container tự tiêm.

| | DI? | DIP? | Vì sao |
|---|---|---|---|
| A | ❌ | ❌ | class tự gọi `MySQLOrderRepo(...)`; domain import infra |
| B | ✅ | ❌ | `main.py` tạo và truyền vào (DI), nhưng `order_service.py` vẫn import infra |
| C | ✅ | ✅ | `order_service.py` chỉ import `domain.*`; `main.py` biết MySQL là đúng vai composition root |
| D | ✅ | ❌ | container lo DI, nhưng `order.service.ts` import file Mongo |

**B và C có DI y hệt nhau, chỉ khác 1 dòng import.** Đã chạy thật (Python 3.11, mypy `--strict`), test `OrderService(FakeRepo())`:

| | B | C |
|---|---|---|
| Test chạy được | ✅ | ✅ |
| `infrastructure.mysql_order_repo` bị nạp khi import `OrderService` | **True** (code thật kéo theo `pymysql`) | False |
| `mypy --strict` | `error: Argument 1 to "OrderService" has incompatible type "FakeRepo"; expected "MySQLOrderRepo"` | Success |

Test chạy được ở B là công của **DI** (truyền được đồ giả lúc chạy). Kiểu và import vẫn đóng đinh vào MySQL là hậu quả của **thiếu DIP**.

Lỗi đã mắc khi tự chấm: B "không có DI" (tưởng DI cần interface/container); C "vi phạm DIP" (chấm cả `main.py`, hoặc lẫn với luồng điều khiển lúc chạy).

### IoC không có DI: template method (đã chạy, `mypy --strict` sạch)

```python
class WebhookHandler:
    def handle(self, payload: dict[str, str]) -> str:   # "framework" giữ luồng
        if not self.verify(payload):
            return "401"
        self.process(payload)
        return "200"

    def verify(self, payload: dict[str, str]) -> bool: raise NotImplementedError
    def process(self, payload: dict[str, str]) -> None: raise NotImplementedError

class MomoWebhook(WebhookHandler):                       # bạn chỉ điền chỗ trống
    def verify(self, payload: dict[str, str]) -> bool:
        return payload.get("sig") == "ok"
    def process(self, payload: dict[str, str]) -> None:
        print("mark order", payload["order_id"], "paid")

MomoWebhook().handle({"sig": "ok", "order_id": "42"})   # → "200"
```

Bạn không gọi `verify`, base class gọi: có IoC, không truyền dependency nào vào: không có DI.

### Service locator: dependency "lấy lén" (đã chạy)

```python
class OrderService:
    def __init__(self) -> None:                  # chữ ký nói "tôi không cần gì"
        pass

    def place_order(self, total: int) -> int:
        repo = Container.get("order_repo")       # ...nhưng thật ra cần repo
        result: int = repo.save(total)
        return result

svc = OrderService()        # tạo được, không lỗi
svc.place_order(50)         # KeyError('order_repo'): chỉ nổ khi GỌI tới nhánh này
```

`mypy --strict`: **Success**. `Container.get` trả `Any` nên type checker mù. Anti-pattern vì: (1) dependency bị giấu, đọc constructor không biết class cần gì; (2) quên đăng ký chỉ lộ lúc chạy đúng nhánh đó, constructor injection thì lộ ngay lúc khởi động; (3) mọi class phụ thuộc `Container` toàn cục, test phải sửa state toàn cục. Học sâu ở D12.

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3`, NestJS 10, `emitDecoratorMetadata`.

- **Phiên bản B trong TS** được chấp nhận hay không tuỳ class có member private: `new ServiceB(fake)` **qua** nếu `MySQLOrderRepo` chỉ có member public (structural typing); **bị từ chối** khi class có `private dsn`: `Property 'dsn' is missing in type '{ save: ... }' but required in type 'MySQLOrderRepoPrivate'`. B "trông như ổn" cho tới ngày ai đó thêm field private.
- **Inject interface không có token** thì Nest chết lúc khởi động: `Nest can't resolve dependencies of the OrderService (?). Please make sure that the argument Object at index [0] is available...`. Interface bị xoá khi compile nên metadata là `design:paramtypes [Object]` (nối [D2 #6](d02-oop.md#6-interface-vs-abstract-class)).
- **Cách đúng:** `export const ORDER_REPOSITORY = Symbol(...)` **trong domain** cạnh interface (mục #4), `@Inject(ORDER_REPOSITORY)`, module đăng ký `{ provide: ORDER_REPOSITORY, useClass: MongoOrderRepo }`. Log chạy: Nest gọi `new MongoOrderRepo()` rồi `new OrderService(...)`: đó là IoC.
- **Phiên bản D** (`constructor(private repo: MongoOrderRepository)`) chạy ngon vì class vừa là kiểu vừa là token. Container lo trọn DI, nhưng `OrderService` vẫn import file Mongo: **không có DIP**.
- `app.get(...)` / `moduleRef.get(...)` **bên trong service** chính là service locator. Chỉ dùng ở `main.ts` hoặc trong test.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"Dùng NestJS / `@Inject` là đã SOLID."** Container chỉ lo DI. DIP nằm ở kiểu tham số và vị trí interface, container không quan tâm.
- **"DI phải có interface hoặc container."** `OrderService(repo: MySQLOrderRepo)` truyền tay vẫn là DI.
- **"DI = IoC."** DI bằng tay không phải IoC; IoC còn nhiều dạng ngoài DI.
- **"Test chạy được với fake là ổn."** B chạy nhưng mypy từ chối và vẫn nạp hạ tầng; TS thì ổn cho tới khi có member private.
- **Service locator núp bóng DI:** inject `ModuleRef`/`Container` vào rồi `.get()` trong method. Trông như DI, thật ra lấy lén.

### 🏛️ Góc nhìn Solution Architect

- **DI container của NestJS/Angular là IoC:** khai báo, framework tạo và lắp. Đổi lại mất khả năng nhìn thấy luồng lắp ráp trong code thường, nên giữ module ít "phép thuật" (tránh `forwardRef` vòng tròn, scope request lồng nhau).
- **Composition root là ranh giới duy nhất được "bẩn"** ([D4 #4](d04-solid-s-o.md#4-ocp-với-strategy-và-factory)): Nest là các `@Module({ providers })`, Python là `main.py` / `create_app()`. Ngoài đó không class nào `new` adapter hạ tầng hay `.get()` vào container.
- **DI bằng tay hay container:** service Python nhỏ, tự lắp trong `create_app()` là đủ, dễ đọc, lỗi lộ ngay lúc khởi động. Container đáng khi đồ thị object lớn, cần lifecycle (singleton/request scope), interceptor/guard.
- **DI container không tự tạo ra DIP.** Kiểm tra bằng máy: luật lint chặn `domain/` import hạ tầng (mục #4), thêm luật cấm `ModuleRef`/`app.get` ngoài `main.ts` và test.

### ✅ Tự kiểm tra (trả lời bằng tiếng Anh)

1. 🇬🇧 Define DIP, DI and IoC in one sentence each, using the question each one answers. 🇻🇳 Định nghĩa DIP, DI, IoC mỗi cái 1 câu, theo câu hỏi kiểm tra của nó.
2. 🇬🇧 Give one example of IoC without DI, and one example of DI without IoC. 🇻🇳 Cho 1 ví dụ IoC không có DI, 1 ví dụ DI không có IoC.
3. 🇬🇧 A teammate says: "We use NestJS, everything is injected, so we follow DIP." What one thing do you check? 🇻🇳 Đồng nghiệp nói "dùng NestJS, mọi thứ đều inject, nên đã theo DIP". Bạn kiểm tra đúng 1 thứ gì?
4. 🇬🇧 Why is `Container.get("order_repo")` inside a method worse than constructor injection? Give two reasons. 🇻🇳 Vì sao `Container.get(...)` trong method tệ hơn constructor injection? Nêu 2 lý do.

<details><summary>Đáp án / Key points</summary>

**1.** DIP: do policy files avoid naming infrastructure, and does policy own the interface? DI: who calls the dependency's constructor? (someone outside → DI). IoC: who controls the flow? (the framework calls my code → IoC).

**2.** IoC without DI: template method (`WebhookHandler.handle` calls your `verify`), an event loop, a route handler. DI without IoC: wiring by hand in `main.py` (`OrderService(MySQLOrderRepo(...))`).

**3.** The **parameter types and imports of the service files**: does `order.service.ts` import anything from infrastructure (a Mongo repository class, `mongoose`, `ClientSession`)? Is the token/interface declared in the domain? Injection alone proves only DI.

**4.** (a) Hidden dependency: the constructor doesn't show what the class needs. (b) A missing registration fails only when that code path runs, not at startup; the type checker sees `Any`. Plus: every class depends on the global container, tests must mutate global state.

</details>

---

## 6. Khung nhớ nhanh

**Một câu:** *LSP hỏi "lớp con có giữ lời hứa của cha không?". ISP hỏi "client có bị ép biết method nó không dùng không?". DIP hỏi "file nghiệp vụ có nhắc tên công nghệ không, và ai sở hữu interface?". DI chỉ là cách truyền dependency vào; container không tự tạo ra DIP.*

| | LSP | ISP | DIP |
|---|---|---|---|
| Câu hỏi kiểm tra | Thay cha bằng con, caller còn đúng **mà không cần biết kiểu thật**? | Client này gọi những method nào trong interface nó nhận? | File policy có import/nhắc tên hạ tầng không? Port nằm trong package nào, viết bằng từ vựng của ai? |
| Vi phạm khi | Con đòi nhiều hơn, hứa ít hơn, ném lỗi mới, phá bất biến; caller phải `isinstance` | Implementation viết stub `NotImplementedError`; client phụ thuộc method không dùng, test phải mock cả interface to | Service import driver/ORM/SDK; chữ ký port có `ClientSession`, `Document`, `dict` row, mã lỗi `11000`; port hoặc token nằm trong infra |
| Công cụ | Hợp đồng rõ (vào/ra/lỗi/bất biến); bộ test chung chạy cho mọi implementation; composition thay kế thừa | Bảng client × method, role interface nhỏ (`Refunder`), một class thoả nhiều role | Port trong domain + adapter trong infra + composition root; DI (constructor) để lắp; lint chặn import |
| Rủi ro lạm dụng | Cấm mọi kế thừa; sợ thêm field vào response (thật ra hứa nhiều hơn là được) | Tách vụn mỗi method một interface; tách theo implementation thay vì theo client | Port cho cả `datetime`, `json`; interface 1-1 cho mọi class; dựng hexagonal cho CRUD nhỏ |
| Ở mức hệ thống | API backward-compatible, contract testing (Pact) | BFF, GraphQL, API theo consumer | Hexagonal / Clean Architecture, Dependency Rule |

**DIP / DI / IoC trong một bảng:**

| | Hỏi gì | Có thể có cái này mà không có cái kia |
|---|---|---|
| DIP | Mũi tên mã nguồn chỉ về đâu? Ai sở hữu port? | DI mà không DIP: `OrderService(repo: MySQLOrderRepo)` |
| DI | Ai gọi constructor của dependency? | DI mà không IoC: lắp tay trong `main.py` |
| IoC | Ai nắm luồng chạy? | IoC mà không DI: template method, route handler |

**Phản xạ LSP:** *Demand less, promise more.* Gặp `isinstance` trên object nhận qua kiểu cha thì đi tìm lớp con đang phá hợp đồng.
**Phản xạ ISP:** đếm số method client thật sự gọi và số method test phải mock. Chênh lệch lớn thì tách theo client.
**Phản xạ DIP:** với mỗi kiểu trong chữ ký port, hỏi *"đổi nhà cung cấp, kiểu này còn đúng không?"*; chỉ chấm file policy, composition root import gì cũng được.
**Phản xạ DI:** *"ai gọi constructor của dependency?"*, bất kể kiểu tham số.

---

## 7. Thẻ Anki T1 kèm đáp án

**Thẻ 1.** *Vì sao Square kế thừa Rectangle lại vi phạm LSP?*
Hợp đồng ngầm của `Rectangle.set_width(w)`: chỉ đổi chiều rộng, chiều cao giữ nguyên (w và h độc lập). `Square` buộc đổi cả hai để giữ bất biến của nó, nên code viết cho `Rectangle` (`r.set_width(5); r.set_height(4); assert r.area() == 20`) nhận `Square` thì ra 16. Cùng chữ ký nhưng **postcondition yếu hơn** và phá bất biến của cha. Square là hình chữ nhật trong toán, nhưng không thay được về **hành vi**. Nếu `Rectangle` immutable thì hết vi phạm, vì hợp đồng đổi state biến mất.

**Thẻ 2.** *Kể 2 dấu hiệu vi phạm LSP trong code.*
(1) Lớp con override method chỉ để `raise NotImplementedError` / "not supported", hoặc âm thầm `return`/`pass` không làm điều đã hứa (**nguyên nhân**, ở lớp con). (2) Caller phải kiểm tra kiểu thật (`isinstance`, `type(x) ==`, `hasattr`) trên object nhận qua kiểu cha (**triệu chứng**, ở caller). Ngoài ra: con chặn input mà cha cho phép, con ném loại lỗi mới không có trong hợp đồng.

**Thẻ 3.** *ISP giúp gì cho các class implement interface?*
Implementer chỉ phải cài những role nó làm được thật, nên **không còn stub ném lỗi** (gốc của vi phạm LSP). Đồng thời client chỉ phụ thuộc đúng method nó gọi: đổi method của nhóm khác không bắt nó sửa, test lại hay redeploy, test chỉ cần mock vài method. Tách theo **nhu cầu của client**, xác nhận bằng bảng implementation; một class vẫn có thể thoả nhiều role.

**Thẻ 4.** *Phân biệt DIP, DI và IoC mỗi cái bằng một câu.*
**DIP** là nguyên lý thiết kế: file nghiệp vụ không nhắc tên công nghệ, cả hai phụ thuộc port do phía nghiệp vụ sở hữu (mũi tên mã nguồn ngược chiều luồng gọi). **DI** là kỹ thuật: dependency được tạo bên ngoài rồi truyền vào (constructor/setter/container) thay vì class tự `new`. **IoC** là ý tưởng rộng hơn: framework nắm luồng và gọi code của bạn (container, route handler, template method). Có DI mà không DIP (inject class cụ thể), có IoC mà không DI (template method).

---

## 8. Câu hỏi cuối bài

> Đáp án mẫu (Claude viết hộ, 26/10/2026). Khi ôn: che đáp án, tự trả lời bằng tiếng Anh trước rồi mới mở.

1. Ví dụ Rectangle–Square vi phạm LSP ở chỗ nào?
2. DIP (nguyên lý) khác Dependency Injection (kỹ thuật) thế nào?
3. Một interface quá lớn (fat interface) gây hại gì cho các class implement nó?
4. *(Câu bổ sung)* `OrderService` (package `domain`) đang gọi thẳng `MySQLOrderRepo` (package `infrastructure`). Sau khi áp dụng DIP, interface `OrderRepository` nên nằm ở package nào? Mũi tên phụ thuộc đổi ra sao? Nếu đặt interface trong `infrastructure` thì mất gì?
5. *(Câu bổ sung)* Class `Bird` có `fly()`. Bạn thêm `Penguin extends Bird` và override `fly()` để ném `UnsupportedOperationException`. Code gọi sẽ phải thay đổi thế nào? Đây là vi phạm gì, và bạn sửa thiết kế ra sao?

<details><summary>Đáp án</summary>

**1.** Ở **hợp đồng hành vi** của setter, không phải ở chữ ký. Lần theo state từng dòng với `r = Square(2)`:

| Dòng | Rectangle thật | Square |
|---|---|---|
| `r.set_width(5)` | w=5, h=2 | w=5, h=5 |
| `r.set_height(4)` | w=5, h=4 | w=4, h=4 |
| `r.area()` | 20 | **16** |

Caller viết theo lời hứa của `Rectangle` ("đổi width không đụng height") nên kết quả sai mà không có lỗi nào ném ra. Square **hứa ít hơn** cha (postcondition yếu hơn) và phá bất biến "w, h độc lập". Sửa ở gốc: không kế thừa. Dùng `Shape` có `area()`, `Rectangle` và `Square` là hai lớp ngang hàng, hoặc làm hình immutable. Cho `Square` override `area()` chỉ che triệu chứng ([mục #1](#1-lsp-lớp-con-thay-được-lớp-cha-và-hợp-đồng)).

**2.** Khác **loại** và khác **câu hỏi**:
- DIP là **nguyên lý thiết kế**, hỏi *mũi tên mã nguồn chỉ về đâu, ai sở hữu interface*: module nghiệp vụ không import hạ tầng, port nằm trong domain và nói bằng từ vựng domain.
- DI là **kỹ thuật**, hỏi *ai tạo dependency*: dependency được truyền vào (constructor/setter/container) thay vì tự `new`.

DI là phương tiện thường dùng để **vận hành** DIP (ai đó bên ngoài phải truyền adapter vào), nhưng không đảm bảo DIP: `OrderService(repo: MySQLOrderRepo)` có DI mà vẫn import infra. Ngược lại, DIP cũng không bắt buộc phải có container ([mục #5](#5-dip--di--ioc)).

**3.** Hại cả hai phía ([mục #3](#3-isp-tách-interface-theo-nhu-cầu-từng-client)):
- **Implementer** bị ép cài method không làm được, phải viết stub ném `NotImplementedError` hoặc no-op, tức vi phạm LSP (Momo không có subscription).
- **Client** phụ thuộc method không dùng: method đó đổi chữ ký là mọi client và mọi implementation phải sửa, build và test lại; test phải mock cả interface 6-7 method; shared package bị nhiều team khoá lịch release của nhau.
Sửa: tách role interface theo nhu cầu client (`Charger`, `Refunder`, `SubscriptionProvider`), một class vẫn có thể thoả nhiều role.

**4.** `OrderRepository` nằm trong **`domain`**, cạnh `OrderService`, viết bằng từ vựng domain (`save(order: Order) -> OrderId`, không phải `insert_order_row(row: dict)`).
- Mũi tên mã nguồn: trước `domain → infrastructure`, sau `infrastructure → domain` (adapter `MySQLOrderRepo` import `Order` để dịch sang row). Luồng gọi lúc chạy **không đổi**: `OrderService` vẫn gọi MySQL.
- `main.py` / `@Module` (composition root) là nơi duy nhất biết cả hai.
- Đặt interface trong `infrastructure` thì `domain` vẫn phải import `infrastructure` để lấy interface: chỉ có DI, **không có gì bị đảo**. Mất: test domain vẫn nạp module hạ tầng, đổi DB hoặc đổi team hạ tầng sửa interface là kéo domain sửa theo, CI không chặn được mũi tên ngược ([mục #4](#4-dip-đảo-mũi-tên-phụ-thuộc-module-cấp-cao-sở-hữu-interface)). NestJS: token `ORDER_REPOSITORY` cũng phải nằm trong domain.

**5.** Code gọi phải né kiểu thật:

```python
for b in birds:
    if isinstance(b, Penguin):   # triệu chứng LSP
        continue
    b.fly()
```

hoặc bọc `try/except`. Mỗi loài không bay mới (đà điểu, kiwi) lại thêm một nhánh: OCP vỡ theo. Đây là **vi phạm LSP** (refused bequest: con hứa ít hơn cha, ném lỗi mới), gốc là **interface quá to** ở `Bird` (ISP).

Sửa: `fly()` không thuộc hợp đồng chung của `Bird`. Tách khả năng bay thành role riêng, chỉ loài bay được mới thoả (đã chạy, Python 3.11):

```python
class Bird:
    def __init__(self, name: str) -> None:
        self.name = name
    def eat(self) -> str:
        return f"{self.name} eats"

class Flyable(Protocol):
    def fly(self) -> str: ...

class Sparrow(Bird):
    def fly(self) -> str:
        return f"{self.name} flies"

class Penguin(Bird):
    def swim(self) -> str:
        return f"{self.name} swims"

def migrate(flock: list[Flyable]) -> list[str]:
    return [b.fly() for b in flock]

migrate([Penguin("penguin")])
# mypy --strict: List item 0 has incompatible type "Penguin"; expected "Flyable"
```

Lỗi chuyển từ **lúc chạy** (`'Penguin' object has no attribute 'fly'`) sang **lúc type-check**, trước khi lên production. `feed(birds: list[Bird])` vẫn nhận cả hai vì `eat()` là hợp đồng mà mọi loài giữ được.

</details>

### 🏋️ Bài tự luyện (tổng hợp L + I + D)

```python
# domain/report_service.py
from infrastructure.s3 import S3Client                 # (a)
from botocore.exceptions import ClientError            # (b)

class Exporter:                                        # dùng cho CSV, PDF, Excel
    def export(self, rows: list[dict[str, str]]) -> bytes: ...
    def set_password(self, pw: str) -> None: ...       # chỉ PDF và Excel hỗ trợ
    def add_chart(self, kind: str) -> None: ...        # chỉ Excel hỗ trợ

class CsvExporter(Exporter):
    def set_password(self, pw: str) -> None:
        raise NotImplementedError("csv has no password")
    def add_chart(self, kind: str) -> None:
        pass                                           # (c)

class ReportService:
    def __init__(self, exporter: Exporter, s3: S3Client) -> None:
        self.exporter, self.s3 = exporter, s3

    def monthly(self, rows: list[dict[str, str]], pw: str | None) -> str:
        if pw and not isinstance(self.exporter, CsvExporter):   # (d)
            self.exporter.set_password(pw)
        data = self.exporter.export(rows)
        try:
            return self.s3.put_object("reports", data)
        except ClientError as e:                               # (e)
            raise RuntimeError("upload failed") from e
```

🇬🇧 Label each of (a)–(e) as LSP, ISP or DIP (one can have two labels), then sketch the fixed design: which interfaces, in which package, and what `ReportService.__init__` receives. 🇻🇳 Gắn nhãn LSP / ISP / DIP cho (a)–(e), rồi phác thiết kế đã sửa: interface nào, nằm package nào, `__init__` nhận gì.

<details><summary>Đáp án mẫu</summary>

| | Nhãn | Vì sao |
|---|---|---|
| (a) | DIP | File domain import client S3 của hạ tầng: policy nhắc tên công nghệ (vi phạm câu A) |
| (b) | DIP | Kiểu lỗi của SDK lọt vào domain; lỗi là một phần hợp đồng. Adapter phải dịch sang lỗi domain (`ReportStorageError`) |
| (c) | LSP | No-op im lặng: hứa "thêm chart" mà không làm, caller không biết (postcondition yếu hơn, silent failure) |
| (d) | LSP (triệu chứng) + ISP (gốc) | Caller `isinstance` để né `set_password` của CSV. Gốc: `Exporter` béo, ép CSV cài thứ nó không làm được |
| `set_password` ném lỗi | LSP | Refused bequest (đi cặp với (d)) |

Thiết kế đã sửa:

```
domain/
  report_ports.py   ← Exporter { export(rows) -> bytes }            (role tối thiểu, mọi định dạng giữ được)
                       PasswordProtectable { set_password(pw) }      (chỉ PDF, Excel thoả)
                       ReportStorage { save(name, data) -> ReportUrl }  + ReportStorageError
  report_service.py ← ReportService(exporter: Exporter, storage: ReportStorage)
infrastructure/
  csv_exporter.py, pdf_exporter.py, excel_exporter.py
  s3_report_storage.py  ← import boto3, dịch ClientError → ReportStorageError
main.py             ← chọn exporter + S3ReportStorage
```

- Báo cáo cần mật khẩu thì `ReportService` nhận kiểu gộp `ProtectedExporter(Exporter, PasswordProtectable, Protocol)`: mypy chặn ngay việc truyền CSV vào luồng có mật khẩu, không cần `isinstance`.
- `add_chart` chỉ Excel dùng: đưa vào `ExcelExporter` hoặc một role `ChartCapable` khi có client cần (YAGNI).
- `ReportStorage` nói "lưu báo cáo", không nói "bucket", "put_object": đổi sang GCS hay lưu đĩa không chạm domain.

</details>

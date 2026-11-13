# D8: Coupling & Cohesion (tổng hợp)

← [Tuần 2](../100-ngay/tuan-02.md) · Phạm vi: mục #1 đến #8 của D8

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python; khác biệt của **TypeScript/JavaScript** nằm trong khối 🟦 cuối mỗi mục (đã kiểm chứng bằng cách chạy thật, không ghi theo trí nhớ).
> Nhãn: 🔴 T1 = nhớ và dạy lại được · 🟡 T2 = hiểu, nhớ tiêu chí chọn · 🟢 T3 = biết để tra khi cần
> Mục #1 đến #6 là 🔴 T1; mục #7 là 🟢 T3.

---

## Mục lục

1. [Coupling: một module biết bao nhiêu về module khác](#1-coupling-một-module-biết-bao-nhiêu-về-module-khác) · 🔴 T1
2. [Cohesion: các phần bên trong cùng một mục đích](#2-cohesion-các-phần-bên-trong-cùng-một-mục-đích) · 🔴 T1
3. [High cohesion, low coupling và SOLID](#3-high-cohesion-low-coupling-và-solid) · 🔴 T1
4. [Dấu hiệu coupling chặt](#4-dấu-hiệu-coupling-chặt) · 🔴 T1
5. [Law of Demeter: chỉ nói chuyện với bạn trực tiếp](#5-law-of-demeter-chỉ-nói-chuyện-với-bạn-trực-tiếp) · 🔴 T1
6. [Global và Singleton: phụ thuộc ẩn](#6-global-và-singleton-phụ-thuộc-ẩn) · 🔴 T1
7. [Phân loại coupling và cohesion, metric Ca Ce, connascence](#7-phân-loại-coupling-và-cohesion-metric-ca-ce-connascence) · 🟢 T3
8. [Khung nhớ nhanh](#8-khung-nhớ-nhanh)
9. [Thẻ Anki T1 kèm đáp án](#9-thẻ-anki-t1-kèm-đáp-án) · 🔴 T1
10. [Câu hỏi cuối bài (đáp án mẫu)](#10-câu-hỏi-cuối-bài)

---

## 1. Coupling: một module biết bao nhiêu về module khác

| English | Nghĩa |
|---|---|
| coupling | mức độ một module phụ thuộc vào module khác |
| module | đơn vị code bất kỳ: hàm, class, file, package, service |
| tightly / loosely coupled | phụ thuộc chặt / lỏng |
| dependency | phụ thuộc |
| ripple effect | hiệu ứng lan: sửa A kéo theo sửa B, C |
| stable / volatile | ổn định, ít đổi / hay đổi |
| knowledge (of another module) | A **biết** bao nhiêu về B |

### 🇬🇧 Theory

**Coupling** is how much one module depends on, and knows about, other modules. Test question: *"If B changes, how likely is it that A must change too?"* The more A **knows** about B (its concrete class, constructor arguments, host and port, internal fields, DB tables, error codes), the tighter the coupling.

Coupling can never be zero. The goal is to **know as little as possible**, and only about things that are **stable**.

### 🇻🇳 Giải thích

Đo coupling bằng 3 câu hỏi:

1. **Số lượng:** A phụ thuộc vào bao nhiêu thứ?
2. **Độ biết:** A biết gì về mỗi thứ? Chỉ biết tên một method mang nghĩa nghiệp vụ, hay biết cả class cụ thể, constructor, SQL, tên bảng?
3. **Độ ổn định:** thứ A phụ thuộc có hay đổi không?

Coupling thường là **một chiều** (A phụ thuộc B, B không biết A). Hai chiều là trường hợp xấu (phụ thuộc vòng, xem #4).

Coupling **không thể bằng 0**: `OrderService` đằng nào cũng phải gửi mail *bằng cách nào đó*. Mục tiêu là phụ thuộc vào thứ **ổn định** và biết **ít nhất có thể**. Coupling chặt gây ra 4 hậu quả:
- sửa lan ra nhiều chỗ (ripple effect);
- unit test phải dựng hạ tầng thật;
- không deploy riêng từng phần được;
- muốn hiểu một file phải đọc thêm nhiều file khác.

### Ví dụ "trước": `OrderService` biết quá nhiều

Code minh hoạ, không chạy được vì cần MySQL:

```python
import pymysql, smtplib
from email.message import EmailMessage

class OrderService:
    def __init__(self) -> None:
        self._db = pymysql.connect(host="10.0.0.5", user="app", password="...", database="shop")
        self._smtp = smtplib.SMTP("smtp.gmail.com", 587)   # mở kết nối ngay trong __init__

    def place_order(self, order_id: str, email: str, total: int) -> None:
        with self._db.cursor() as cur:
            cur.execute("INSERT INTO orders (id, email, total) VALUES (%s, %s, %s)", (order_id, email, total))
        msg = EmailMessage()
        msg["To"], msg["Subject"] = email, f"Order {order_id} confirmed"
        msg.set_content(f"Total: {total}")
        self._smtp.send_message(msg)
```

Đếm những gì `OrderService` **biết** về bên ngoài: driver pymysql, IP và mật khẩu DB, tên bảng và cột, câu SQL, smtplib, host và port Gmail, định dạng MIME. Mỗi thứ là một lý do *từ bên ngoài* có thể bắt class này phải sửa.

Tệ hơn: `smtplib.SMTP(host, port)` **kết nối ngay trong `__init__`**. Chạy thử `smtplib.SMTP('localhost', 1)` nhận `ConnectionRefusedError`. Nghĩa là không có mạng thì ngay cả việc tạo object `OrderService` trong test cũng không làm được.

### Ví dụ "sau" (đã chạy thật, `mypy --strict` sạch)

```python
from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class Order:
    id: str
    customer_email: str
    total: int

# Hai interface nằm trong module orders, dùng từ vựng nghiệp vụ (DIP, D5 #4)
class OrderRepository(Protocol):
    def save(self, order: Order) -> None: ...

class OrderNotifier(Protocol):
    def order_placed(self, order: Order) -> None: ...

class OrderService:
    def __init__(self, repo: OrderRepository, notifier: OrderNotifier) -> None:
        self._repo = repo
        self._notifier = notifier

    def place_order(self, order: Order) -> None:
        if order.total <= 0:
            raise ValueError("total must be positive")
        self._repo.save(order)
        self._notifier.order_placed(order)

# Test không cần DB, không cần SMTP
class InMemoryRepo:
    def __init__(self) -> None: self.saved: list[Order] = []
    def save(self, order: Order) -> None: self.saved.append(order)

class FakeNotifier:
    def __init__(self) -> None: self.sent: list[str] = []
    def order_placed(self, order: Order) -> None: self.sent.append(order.id)

repo, notifier = InMemoryRepo(), FakeNotifier()
OrderService(repo, notifier).place_order(Order("o1", "a@x.com", 150_000))
print(len(repo.saved), notifier.sent)   # 1 ['o1']
```

Coupling **vẫn còn** (2 dependency), nhưng chỉ vào 2 thứ **ổn định**. Interface ổn định **không phải vì nó là interface**, mà vì 2 lý do:
1. Nó do **module orders sở hữu**.
2. Nó viết bằng **từ vựng nghiệp vụ**: `order_placed(order)` nói *chuyện gì xảy ra*. Còn `send_email(to, subject, body)` nói *cách làm*, nên đổi sang SMS hay push notification là phải đổi interface.

Ngược lại, `Mailer.send_message(msg: EmailMessage)` cũng là interface nhưng viết bằng từ vựng SMTP, nên đổi sang SendGrid thì nó phải đổi theo.

> **Phản xạ:** *Interface ổn định là nhờ **ai sở hữu nó** và nó **viết bằng từ của ai**, không phải nhờ nó là interface.*

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3 --strict`, Node 24.

- **Import chỉ dùng làm type bị xoá khi compile**, cả `import type { OrderNotifier }` lẫn `import { OrderNotifier }` thường. File JS sinh ra không có `require("./order-notifier")`, và `console.log` đặt trong file interface không bao giờ chạy.
  - Phụ thuộc vào interface chỉ là coupling *lúc compile*, không tạo coupling *lúc runtime*, nên không gây vòng `require`.
  - Python khác: import `Protocol` vẫn là import thật lúc runtime. Muốn import chỉ phục vụ type checker thì phải bọc trong `if TYPE_CHECKING:`.
- **Hệ quả ngược lại:** interface không tồn tại lúc runtime, nên không dùng làm DI token được. Viết `{ provide: OrderNotifier, ... }` sẽ báo **TS2693** *"'OrderNotifier' only refers to a type, but is being used as a value here"*. NestJS phải dùng token dạng string, `Symbol` hoặc abstract class (học kỹ ở D12).
- **Structural typing:** `SmtpNotifier` không import, cũng không `implements OrderNotifier`, mà vẫn truyền vào `OrderService` được. Giống `Protocol` của Python, khác ABC (phải kế thừa nên bắt buộc import). Dù vậy, trong thực tế nên viết `implements` để sai chữ ký thì báo lỗi ngay tại class.

---

## 2. Cohesion: các phần bên trong cùng một mục đích

| English | Nghĩa |
|---|---|
| cohesion | mức độ các phần *bên trong* một module cùng phục vụ một mục đích |
| highly cohesive | các phần bên trong gắn bó với nhau |
| reason to change | lý do thay đổi ([D4 #1](d04-solid-s-o.md#1-srp-theo-nghĩa-actor)) |
| junk drawer / utility class | "ngăn kéo tạp": `Utils`, `Helper`, `Common` |

### 🇬🇧 Theory

**Cohesion** is how strongly the things inside one module belong together. Test question: *"Can I describe this module in one sentence without 'and'? Do its parts use the same data and change for the same reason?"*

### 🇻🇳 Giải thích

Cohesion đo **bên trong** một module, còn coupling đo **giữa** các module. "Cùng phục vụ một actor" là một **tiêu chí đo** cohesion (lấy từ SRP), không phải định nghĩa của nó.

| Cohesion cao | Cohesion thấp |
|---|---|
| Tên là một danh từ nghiệp vụ cụ thể: `ShippingFeeCalculator` | `Utils`, `Helper`, `Manager`, `Common` |
| Các method dùng chung field, dữ liệu | Mỗi method dùng một nhóm field riêng, không giao nhau |
| Một actor yêu cầu thay đổi | Nhiều actor, mỗi người đổi một góc |
| Gom theo **nghiệp vụ** (orders, payments) | Gom theo **loại kỹ thuật**, hoặc kiểu "không biết để đâu" |

### Ví dụ: `PaymentHelper`, đo bằng cách xem mỗi method dùng field nào

| Method | Dùng gì | Ai yêu cầu đổi |
|---|---|---|
| `calc_vat(amount)` | `vat_rate` | Kế toán |
| `mask_card_number(pan)` | (không dùng field nào) | Bảo mật / PCI |
| `send_slack_alert(msg)` | `slack_webhook_url` | DevOps |
| `parse_bank_webhook_date(s)` | `bank_tz` | Đội tích hợp ngân hàng |

Bốn method dùng bốn nhóm field không giao nhau, mỗi method do một actor khác yêu cầu đổi. Đây là cohesion thấp nhất: chúng ở chung chỉ vì cùng chữ "Payment" trong tên.

---

## 3. High cohesion, low coupling và SOLID

### 🇬🇧 Theory

**High cohesion, low coupling:** put things that change together in the same place, and let modules talk through **small, stable** interfaces. The two goals are two sides of one decision: **where to draw the boundary**.

### 🇻🇳 Giải thích

- Đặt ranh giới đúng (theo lý do thay đổi): những thứ đổi cùng nhau nằm chung một module, nên cohesion cao. Ít mũi tên phải cắt qua ranh giới, nên coupling thấp.
- Đặt ranh giới sai thì hỏng **cả hai cùng lúc**. Ví dụ rule giảm giá nằm rải ở `OrderService`, `CartController`, `InvoicePrinter`:
  - Nhìn từng class: mỗi class chứa một mẩu logic không thuộc về nó, nên cohesion thấp.
  - Nhìn giữa các class: đổi rule giảm giá phải sửa cả 3, nên coupling cao.
  - Đây là *shotgun surgery* (#4).

**SOLID phục vụ cái nào:**

| Nguyên lý | Phục vụ | Vì sao |
|---|---|---|
| **SRP** ([D4 #1](d04-solid-s-o.md#1-srp-theo-nghĩa-actor)) | **Cohesion** | Gom theo actor tức là gom những thứ cùng lý do thay đổi. Dấu hiệu "test phải mock 6 dependency" ở [D4 #2](d04-solid-s-o.md#2-dấu-hiệu-vi-phạm-srp): số dependency nhiều là coupling cao, nguyên nhân thường là class làm nhiều việc (cohesion thấp). Một triệu chứng chỉ ra cả hai vấn đề. |
| **OCP** | Coupling | Caller chỉ biết interface, nên thêm biến thể mới không phải sửa caller. |
| **LSP** | Giữ coupling qua interface **an toàn** | Nếu lớp con phá hợp đồng, caller buộc phải `isinstance`, và coupling vào class cụ thể quay lại. |
| **ISP** ([D5 #3](d05-solid-l-i-d.md#3-isp-tách-interface-theo-nhu-cầu-từng-client)) | **Coupling**: giảm **"biết bao nhiêu"** | Client chỉ biết những method nó dùng. |
| **DIP** ([D5 #4](d05-solid-l-i-d.md#4-dip-đảo-mũi-tên-phụ-thuộc-module-cấp-cao-sở-hữu-interface)) | **Coupling**: xử lý **"biết cái gì, của ai"** | Abstraction do module cấp cao sở hữu và viết bằng từ vựng nghiệp vụ, nên hạ tầng đổi không lan lên domain. |

> **Phản xạ:** *SRP lo bên trong (cohesion). ISP lo "biết bao nhiêu", DIP lo "biết cái gì, ai sở hữu" (cả hai thuộc coupling).*

**Ví dụ tách quá tay:** team tách `DiscountCalculator` thành `PercentRule`, `MinOrderRule`, `DiscountRounding`, và giờ mỗi lần đổi rule giảm giá phải sửa cả 3 cộng thêm `OrderService`.
- Từng class nhỏ trông có vẻ cohesive, nhưng cohesion đo bằng **lý do thay đổi**, không đo bằng kích thước. "Chính sách giảm giá" là một lý do thay đổi, giờ bị rải ra 4 nơi.
- 4 class đó cùng nắm cách tính giảm giá nên phải đổi đồng loạt, tức là coupling tăng (shotgun surgery).
- Cách sửa: gộp lại thành `DiscountPolicy.apply(order) -> Money`, `OrderService` chỉ biết method đó. Chỉ tách tiếp theo trục thay đổi **độc lập** thật sự (ví dụ mỗi loại giảm giá một Strategy, xem [D4 #4](d04-solid-s-o.md#4-ocp-với-strategy-và-factory)).
- Gốc của lỗi là hiểu SRP thành "mỗi class làm một việc nhỏ". SRP thực ra là **một actor, một lý do thay đổi**.

> **Phản xạ:** *trước khi tách, hỏi: "phần A và phần B có thay đổi **độc lập** với nhau không?" Nếu luôn đổi cùng nhau thì để chung.*

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"Coupling thấp là ít import."** Sai. Cái quyết định là *độ biết* và *độ ổn định*. Dồn hết vào một class cho đỡ import thì cohesion nát.
- **"Tách càng nhỏ càng cohesive."** Tách quá tay thì một nghiệp vụ bị rải ra nhiều class phải gọi qua lại liên tục, coupling giữa chúng tăng. Vẫn là shotgun surgery.
- **"Có interface là coupling thấp / ổn định."** Interface chép y class cụ thể, kiểu `send_message(msg: EmailMessage)`, vẫn để lọt chi tiết SMTP.
- **"Inject qua constructor là DIP"**, và ngược lại **"inject class cụ thể thì chẳng khác gì tự tạo"**. Cả hai đều sai. Tách thành 2 câu hỏi riêng:
  1. **"Ai tạo object?"** Không phải chính class đó tạo thì là **DI**. Đây là tiến bộ thật: không mở kết nối trong `__init__`, test truyền được fake.
  2. **"Mũi tên phụ thuộc chỉ vào đâu, cái đó do ai sở hữu?"** Chỉ vào abstraction do tầng cao sở hữu thì là **DIP**.

  Có thể đạt câu 1 mà trượt câu 2.
- **"Class ngắn thì cohesive."** `OrderUtils` có 3 hàm, rất ngắn, nhưng vẫn là ngăn kéo tạp.
- **Lẫn phạm vi của hai khái niệm.** Coupling nói về quan hệ **giữa** các module, cohesion nói về **bên trong** một module.

### 🏛️ Góc nhìn Solution Architect

- **Ở mức hệ thống, coupling chặt nhất là dùng chung DB.** Service Order đọc thẳng collection `users` thì team Users đổi schema là Order vỡ, và hai service không deploy độc lập được nữa. Xếp tiếp theo là chuỗi gọi đồng bộ A→B→C (*temporal coupling*: C chết kéo theo A chết). Chuyển sang event hoặc queue sẽ giảm loại này, đổi lại phải chấp nhận *eventual consistency*.
- **Microservice cắt sai ranh giới tạo ra "distributed monolith":** coupling vẫn cao như monolith, cộng thêm độ trễ và lỗi mạng. Ranh giới cohesion ở mức nghiệp vụ chính là *bounded context* trong DDD.
- **Gom code theo nghiệp vụ (package-by-feature)** như `orders/`, `payments/` cho cohesion cao hơn gom theo tầng (`controllers/`, `services/`, `repositories/`). NestJS `@Module` là đơn vị ranh giới tự nhiên cho cách gom này.
- **Coupling đo được bằng git:** file nào hay thay đổi cùng nhau trong một commit thì đang coupling với nhau (*change coupling*, có tool code-maat). Nếu một feature nhỏ mà PR luôn đụng tới 8 file ở 4 module, ranh giới đang đặt sai.

### ✅ Tự kiểm tra cho #1-#3 (trả lời bằng tiếng Anh)

1. 🇬🇧 Define coupling and cohesion in one sentence each, and give the one-question test for each. 🇻🇳 Định nghĩa coupling và cohesion, mỗi khái niệm một câu, kèm câu hỏi kiểm tra cho từng cái.
2. 🇬🇧 In the "before" `OrderService`, list 4 things it knows that could force it to change. After the refactor it still has 2 dependencies. Why is that acceptable? 🇻🇳 Kể 4 thứ `OrderService` bản "trước" biết, có thể bắt nó phải sửa. Bản "sau" vẫn còn 2 dependency, vì sao chấp nhận được?
3. 🇬🇧 A teammate says: *"I now inject `SmtpMailer` through the constructor, so `OrderService` follows DIP and is loosely coupled."* What is right and what is wrong? 🇻🇳 Câu của đồng nghiệp đúng chỗ nào, sai chỗ nào?
4. 🇬🇧 Which SOLID principle mainly serves cohesion, and which two mainly reduce coupling? One reason each. 🇻🇳 Nguyên lý nào chủ yếu phục vụ cohesion, hai nguyên lý nào chủ yếu giảm coupling? Mỗi cái một lý do.
5. 🇬🇧 A team splits `DiscountCalculator` into three rule classes, and now every discount change edits all three plus `OrderService`. What happened to cohesion and coupling? 🇻🇳 Team tách `DiscountCalculator` thành 3 class, giờ mỗi lần đổi rule phải sửa cả 3 cộng thêm `OrderService`. Cohesion và coupling thay đổi thế nào?

<details><summary>Đáp án / Key points</summary>

**1.** *Coupling is how much a module depends on, and knows about, other modules. Test: if B changes, must A change? Cohesion is how strongly the parts inside one module belong together. Test: can I describe it in one sentence without "and"?*

**2.** Chọn 4 trong số: driver pymysql; host và mật khẩu DB; tên bảng, cột, SQL; smtplib; host và port SMTP; định dạng MIME, nội dung mail. Bản "sau" chấp nhận được vì coupling không thể bằng 0, và 2 dependency còn lại là interface nhỏ **do module orders sở hữu, viết bằng từ vựng nghiệp vụ**. Interface ổn định là nhờ hai điều đó, không phải nhờ nó là interface. *The remaining dependencies are fine because they point to small interfaces owned by the orders module and written in business words, so infrastructure changes don't reach `OrderService`.*

**3.** *Right: that is DI. The service no longer creates the mailer, so tests can pass a fake. Wrong: it is not DIP. It still depends on the concrete `SmtpMailer` and its SMTP-shaped API, so switching providers still changes `OrderService`.* Nói "không khác gì cả" là sai: DI có tiến bộ thật.

**4.** *SRP serves cohesion: it groups code by one reason to change. ISP lowers coupling by limiting how much a client knows. DIP lowers coupling by making it depend on a stable abstraction owned by the high-level module.* (Tên đầy đủ: Interface **Segregation** Principle.)

**5.** *Both got worse. Cohesion is about reasons to change, not class size: one reason ("discount policy") is now spread over four places. The four classes share knowledge of the rule and must change together, which is shotgun surgery. Fix: merge into one `DiscountPolicy.apply(order)`, and split later only along axes that change independently.*

</details>

---

## 4. Dấu hiệu coupling chặt

| English | Nghĩa |
|---|---|
| code smell | dấu hiệu code có vấn đề (chưa chắc là bug) |
| shotgun surgery | một thay đổi nhỏ phải sửa ở nhiều nơi |
| inappropriate intimacy | biết hoặc dùng nội bộ của class khác |
| control coupling | truyền cờ để điều khiển luồng bên trong hàm khác |
| stamp coupling | truyền nguyên object lớn trong khi chỉ cần vài field |
| data coupling | chỉ truyền đúng dữ liệu cần (mức tốt nhất) |
| circular dependency | phụ thuộc vòng A ↔ B |
| message chain | chuỗi `a.b().c().d()` (xem #5) |

### 🇬🇧 Theory

A coupling smell is a line of code that *knows* something about another module that it does not need to know. To find them, walk through the code **line by line** and ask: *"What does this line know about another module or about the infrastructure? If that thing changes, does this line break?"*

### 🇻🇳 Giải thích

Roadmap liệt kê 6 dấu hiệu:
- **Shotgun surgery:** sửa một yêu cầu nhỏ phải đụng 5–6 file ở nhiều module.
- **Phải dựng DB hoặc API thật mới unit test được**, vì class tự `new` dependency hoặc đọc thẳng hạ tầng.
- **Inappropriate intimacy:** A đọc field nội bộ hoặc gọi method nội bộ của B.
- **Flag argument (control coupling):** `process(order, isAdmin=True, skipEmail=False)`.
- **Phụ thuộc vòng:** A import B, B import lại A.
- **Stamp coupling:** truyền cả object lớn khi chỉ cần 1–2 field.

### Bài tập: tìm dấu hiệu trong `OrderService.placeOrder` (NestJS + Mongo)

Code đã compile sạch (`tsc 5.6.3 --strict`, NestJS 10.4, `@nestjs/mongoose` 10.1, mongoose 8):

```ts
// payments/payment.service.ts (stub)
class StripeClient { async charge(customerId: string, amount: number) { return { id: `ch_${customerId}_${amount}` }; } }
class PaymentGateway { private client = new StripeClient(); getClient(): StripeClient { return this.client; } }

@Injectable()
export class PaymentService {
  private gateway = new PaymentGateway();
  constructor(@Inject(forwardRef(() => OrderService)) private readonly orders: OrderService) {}
  getGateway(): PaymentGateway { return this.gateway; }
}

// notifications/mail.service.ts (stub)
@Injectable()
export class MailService {
  transporter = { sendMail: async (opts: { to: string; subject: string; html: string }) => ({ messageId: opts.to }) };
}

// orders/order.service.ts
@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() private readonly conn: Connection,
    @Inject(forwardRef(() => PaymentService)) private readonly payments: PaymentService,
    private readonly mail: MailService,
  ) {}

  async placeOrder(userId: string, items: Item[], isAdmin: boolean, skipEmail: boolean) {
    const user = await this.conn.collection('users').findOne({ _id: new Types.ObjectId(userId) });
    if (!user) throw new Error('user not found');
    if (!isAdmin && user.status === 'banned') throw new Error('user banned');

    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    // rule này cũng đang được copy ở cart.service.ts và invoice.service.ts
    const total = user.tier === 'gold' ? subtotal * 0.9 : subtotal;

    let orderId: Types.ObjectId;
    try {
      const res = await this.conn.collection('orders').insertOne({
        userId: user._id, items, total, status: 'pending', createdAt: new Date(),
      });
      orderId = res.insertedId;
    } catch (e: any) {
      if (e.code === 11000) throw new ConflictException('duplicate order');
      throw e;
    }

    const charge = await this.payments.getGateway().getClient().charge(user.stripeCustomerId, total);
    await this.conn.collection('orders').updateOne(
      { _id: orderId }, { $set: { status: 'paid', chargeId: charge.id } },
    );

    if (!skipEmail) {
      await this.mail.transporter.sendMail({
        to: user.email,
        subject: `Order ${orderId} confirmed`,
        html: `<p>Hi ${user.profile.firstName}, total: ${total}</p>`,
      });
    }
    return orderId.toHexString();
  }
}
```

<details><summary>Đáp án: 9 dấu hiệu (tự tìm trước rồi mới mở)</summary>

| # | Dòng code | Smell | Nếu ___ đổi thì dòng này vỡ |
|---|---|---|---|
| 1 | `conn.collection('users')`, đọc `user.status/tier/email/profile.firstName` | **Inappropriate intimacy** qua **DB chung**. Ở mức hệ thống đây là coupling tệ nhất | team Users đổi schema hoặc tách DB |
| 2 | `@InjectConnection`, `Types.ObjectId`, `$set`, `e.code === 11000` | Coupling vào hạ tầng (bảng "chỗ hay rò" ở [D5 #4](d05-solid-l-i-d.md#4-dip-đảo-mũi-tên-phụ-thuộc-module-cấp-cao-sở-hữu-interface)) | đổi Mongo hoặc driver, đổi cách chống trùng |
| 3 | `isAdmin`, `skipEmail` | **Flag argument, control coupling** | caller phải biết luồng bên trong; thêm cờ mới thì sửa mọi caller |
| 4 | `payments.getGateway().getClient().charge(...)` | **Message chain**, vi phạm **Law of Demeter** (#5) | đổi `PaymentGateway`/`StripeClient` hoặc đổi provider |
| 5 | `mail.transporter.sendMail(...)` | **Inappropriate intimacy**: dùng field nội bộ của `MailService` | nodemailer → SES |
| 6 | `forwardRef` ở cả hai phía | **Circular dependency** Order ↔ Payment | không tách module được; thứ tự khởi tạo dễ lỗi |
| 7 | Rule `tier === 'gold'` copy ở 3 service | **Shotgun surgery** | đổi chính sách giảm giá phải sửa 3 nơi |
| 8 | `user.stripeCustomerId` | Order biết chi tiết của nhà cung cấp thanh toán | đổi Stripe sang provider khác |
| 9 | Unit test `placeOrder` | Phải mock `collection().findOne/insertOne/updateOne`, chuỗi 3 tầng của payment, `transporter`. Mock nhiều là dấu hiệu ở [D4 #2](d04-solid-s-o.md#2-dấu-hiệu-vi-phạm-srp) | |

Phụ: mẫu HTML của mail viết ngay trong service. Đây là cohesion thấp vì trộn nội dung mail với logic đặt hàng.

</details>

> **Phản xạ:** *Đừng đọc lướt rồi kể tên smell. **Đi từng dòng**, với mỗi dòng hỏi: "Dòng này biết gì về module khác hoặc về hạ tầng?" Một dòng có thể chứa 2–3 dấu hiệu, như dòng 1 ở trên.*

### Stamp coupling (bài tập không có dấu hiệu này)

Đã chạy thật: `40000 40000 45000`, `mypy --strict` sạch.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Address:
    province: str
    street: str

@dataclass(frozen=True)
class Customer:
    id: str
    email: str
    address: Address

@dataclass(frozen=True)
class Order:
    id: str
    customer: Customer
    weight_grams: int
    total: int

# BEFORE: stamp coupling - nhận nguyên Order, chỉ dùng 2 field nằm sâu bên trong
def shipping_fee_v1(order: Order) -> int:
    base = 30_000 if order.customer.address.province == "HN" else 45_000
    return base + (order.weight_grams // 500) * 5_000

# AFTER: data coupling - chỉ nhận đúng thứ cần
def shipping_fee(province: str, weight_grams: int) -> int:
    base = 30_000 if province == "HN" else 45_000
    return base + (weight_grams // 500) * 5_000

o = Order("o1", Customer("c1", "a@x.com", Address("HN", "1 Trang Tien")), 1200, 500_000)
print(shipping_fee_v1(o), shipping_fee("HN", 1200), shipping_fee("HCM", 400))  # 40000 40000 45000
```

Bản `v1` vỡ khi `Order`, `Customer` hoặc `Address` đổi cấu trúc. Muốn test nó lại phải dựng cả cây object 3 tầng. Bản sau chỉ cần 2 giá trị.

### Ví dụ "sau": `placeOrder` đã sửa (đã chạy thật, `mypy --strict` sạch)

```python
from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class Item:
    sku: str
    qty: int
    price: int

@dataclass(frozen=True)
class Buyer:            # góc nhìn riêng của module orders về user: chỉ thứ nó cần
    id: str
    tier: str
    can_buy: bool

@dataclass
class Order:
    id: str
    buyer_id: str
    items: list[Item]
    total: int
    status: str = "pending"
    charge_id: str | None = None

class DuplicateOrder(Exception): ...

# Port do module orders sở hữu, viết bằng từ vựng nghiệp vụ
class BuyerReader(Protocol):
    def get_buyer(self, user_id: str) -> Buyer | None: ...
class OrderRepository(Protocol):
    def next_id(self) -> str: ...
    def add(self, order: Order) -> None: ...          # ném DuplicateOrder, không lộ mã 11000
    def mark_paid(self, order_id: str, charge_id: str) -> None: ...
class PaymentPort(Protocol):
    def charge(self, buyer_id: str, order_id: str, amount: int) -> str: ...
class OrderNotifier(Protocol):
    def order_placed(self, order: Order) -> None: ...
class DiscountPolicy(Protocol):
    def apply(self, buyer: Buyer, subtotal: int) -> int: ...

class TierDiscount:     # rule chỉ còn ở một chỗ (trước đây copy ở 3 service)
    def apply(self, buyer: Buyer, subtotal: int) -> int:
        return subtotal * 9 // 10 if buyer.tier == "gold" else subtotal

class OrderService:
    def __init__(self, buyers: BuyerReader, orders: OrderRepository, payments: PaymentPort,
                 notifier: OrderNotifier, discount: DiscountPolicy) -> None:
        self._buyers, self._orders, self._payments = buyers, orders, payments
        self._notifier, self._discount = notifier, discount

    def place_order(self, user_id: str, items: list[Item]) -> str:
        buyer = self._buyers.get_buyer(user_id)
        if buyer is None or not buyer.can_buy:
            raise PermissionError("buyer cannot place orders")
        return self._place(buyer, items)

    def place_order_as_admin(self, user_id: str, items: list[Item]) -> str:   # thay cho cờ isAdmin
        buyer = self._buyers.get_buyer(user_id)
        if buyer is None:
            raise LookupError("user not found")
        return self._place(buyer, items)

    def _place(self, buyer: Buyer, items: list[Item]) -> str:
        subtotal = sum(i.qty * i.price for i in items)
        order = Order(self._orders.next_id(), buyer.id, items, self._discount.apply(buyer, subtotal))
        self._orders.add(order)
        charge_id = self._payments.charge(buyer.id, order.id, order.total)
        self._orders.mark_paid(order.id, charge_id)
        self._notifier.order_placed(order)          # thay cho cờ skipEmail: notifier tự quyết
        return order.id
```

Chạy với fake (repo in-memory, payment giả, notifier ghi lại id), không cần Mongo, Stripe hay SMTP:
- user gold → `o1 180000 paid ch_o1_180000 ['o1']`
- user bị khoá → `PermissionError: buyer cannot place orders`
- `place_order_as_admin` cho user đó → `o2 100000`

Mỗi dòng trong bảng ánh xạ sang bản sửa như sau:
- (1)(8) → `BuyerReader` trả về `Buyer`, không còn `stripeCustomerId`.
- (2) → `OrderRepository` với lỗi nghiệp vụ `DuplicateOrder`.
- (3) → tách 2 method công khai.
- (4)(6) → `PaymentPort` do orders sở hữu: payment implement port này, không cần import ngược lại, nên hết vòng.
- (5) → `OrderNotifier`.
- (7) → `DiscountPolicy`, viết ở một chỗ duy nhất.

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3 --strict`, NestJS 10, Node 22.

- **Phụ thuộc vòng mà không có `forwardRef`:** Nest báo lỗi khi khởi động:
  `Nest can't resolve dependencies of the PaymentService (?). Please make sure that the argument dependency at index [0] is available in the AppModule context.`
  - Dấu `?` xuất hiện vì 2 file `require` lẫn nhau. Lúc decorator ghi `design:paramtypes`, class bên kia vẫn là `undefined`.
  - Thêm `forwardRef` ở cả hai phía thì khởi động được. Nhưng đó là **băng dán**: nó che triệu chứng chứ không bỏ được vòng. Cách sửa thật là bỏ vòng bằng port hoặc event.
- **`e.code === 11000`:** trong bài có `catch (e: any)` nên compile qua. Nếu bỏ `: any` thì `--strict` báo `TS18046: 'e' is of type 'unknown'`, buộc phải thu hẹp kiểu: `e instanceof Error && 'code' in e && e.code === 11000`. Lỗi compile đó đang nhắc bạn rằng dòng này biết mã lỗi của Mongo. Chỗ đúng để biết mã đó là bên trong repository.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"Sửa stamp coupling = luôn truyền primitive."** Không đúng. Nếu hàm cần 6 field luôn đi cùng nhau thì gom chúng thành một object nhỏ đúng nghĩa (*Parameter Object*, ví dụ `ShippingInfo`). Thứ cần tránh là truyền cả *aggregate lớn* chỉ để lấy 1–2 field.
- **"Dùng `forwardRef` là xử lý xong phụ thuộc vòng."** Không, nó chỉ cho phép vòng tồn tại.
- **"Bỏ cờ bằng cách gộp các cờ vào một object `options`."** Gộp `{ isAdmin, skipEmail }` vào một object thì vẫn là control coupling, chỉ đổi hình thức truyền.

### 🏛️ Góc nhìn Solution Architect

- Ở mức hệ thống, các smell này có tên khác: **DB chung** (tệ nhất), **chuỗi gọi đồng bộ** A→B→C, **service vòng** (A gọi B, B gọi lại A), tức là *distributed monolith*.
- Khi review PR, nhìn 3 thứ trước tiên: **import chéo giữa các module**, **field nội bộ của module khác bị đọc trực tiếp**, **số lượng mock trong test**. Ba thứ này lộ ra coupling nhanh hơn đọc logic.

---

## 5. Law of Demeter: chỉ nói chuyện với bạn trực tiếp

| English | Nghĩa |
|---|---|
| Law of Demeter (LoD) | "chỉ nói chuyện với bạn trực tiếp" |
| message chain / train wreck | chuỗi `a.b().c().d()` |
| middle man | class chỉ chuyển lời, không làm gì thêm |
| fluent interface | API viết nối chuỗi, mỗi lời gọi trả về cùng một object |

### 🇬🇧 Theory

A method should only call methods on: (1) its own object, (2) its parameters, (3) objects it creates, (4) its object's direct fields. It should **not** reach through one object to get to another and talk to that stranger. *"Only one dot"* is a rough heuristic, not the rule itself.

### 🇻🇳 Giải thích

`invoice.get_order().get_customer().get_address().city` khiến `InvoicePrinter` phụ thuộc vào cấu trúc của **4 class**. Chỉ cần `Address` đổi (ví dụ thành danh sách nhiều địa chỉ) là printer vỡ, dù printer chẳng liên quan gì tới địa chỉ.

Đây chính là **Tell, Don't Ask** ở [D2 #7](d02-oop.md#7-tell-dont-ask): đừng "hỏi" từng tầng để lấy dữ liệu rồi tự xử lý, hãy để object chủ quản trả lời.

### Ví dụ (đã chạy thật, `mypy --strict` sạch)

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Address:
    city: str

class Customer:
    def __init__(self, address: Address) -> None:
        self._address = address
    def get_address(self) -> Address:
        return self._address

class Order:
    def __init__(self, customer: Customer) -> None:
        self._customer = customer
    def get_customer(self) -> Customer:
        return self._customer
    def shipping_city(self) -> str:              # AFTER: Order tự trả lời
        return self._customer.get_address().city # Order biết Customer: bạn trực tiếp của nó

class Invoice:
    def __init__(self, order: Order) -> None:
        self._order = order
    def get_order(self) -> Order:
        return self._order
    def shipping_city(self) -> str:
        return self._order.shipping_city()

class InvoicePrinterBefore:
    def header(self, invoice: Invoice) -> str:
        # biết cấu trúc của Invoice, Order, Customer VÀ Address
        return f"Ship to: {invoice.get_order().get_customer().get_address().city}"

class InvoicePrinter:
    def header(self, invoice: Invoice) -> str:
        return f"Ship to: {invoice.shipping_city()}"   # chỉ biết Invoice

inv = Invoice(Order(Customer(Address("Hanoi"))))
print(InvoicePrinterBefore().header(inv), "|", InvoicePrinter().header(inv))
# Ship to: Hanoi | Ship to: Hanoi
```

Output giống nhau, khác ở chỗ khi `Address` đổi thì chỉ `Order` phải sửa.

**Fluent API không vi phạm:**

```python
class Query:
    def __init__(self) -> None:
        self.parts: list[str] = []
    def where(self, cond: str) -> "Query":
        self.parts.append(f"WHERE {cond}"); return self
    def order_by(self, col: str) -> "Query":
        self.parts.append(f"ORDER BY {col}"); return self
    def limit(self, n: int) -> "Query":
        self.parts.append(f"LIMIT {n}"); return self

print(" ".join(Query().where("status='paid'").order_by("created_at").limit(10).parts))
# WHERE status='paid' ORDER BY created_at LIMIT 10
```

Mỗi lời gọi trả về **cùng một object `Query`**, không đi sâu vào object lạ. Nhiều dấu chấm chưa chắc vi phạm. Điều cần hỏi là mỗi dấu chấm có dẫn tới **một object khác** hay không.

### 🟦 TypeScript / JavaScript

Optional chaining `i.order?.customer?.address?.city ?? 'N/A'` compile sạch và chạy đúng (`{}` → `N/A`, đủ dữ liệu → `Hanoi`), nhưng **vẫn vi phạm LoD y nguyên**. `?.` chỉ giấu lỗi `undefined`, không giấu sự phụ thuộc vào cấu trúc 4 tầng.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **Sửa LoD bằng cách thêm getter chuyển tiếp ở khắp nơi**, kiểu `order.getCustomerAddressCity()`, `order.getCustomerEmail()`… sẽ biến `Order` thành **Middle Man** và làm interface phình to. Cách đúng là **chuyển hành vi** về nơi có dữ liệu (Tell, Don't Ask), chứ không phải đục thêm đường hầm.
- **DTO hoặc dữ liệu thuần** (JSON response, `dict` cấu hình) đi sâu nhiều tầng thường chấp nhận được. LoD nhắm vào **object có hành vi và nội bộ cần giấu**.
- **"Một dấu chấm" là luật.** Không, đó chỉ là mẹo nhận diện. Fluent API là phản ví dụ.

### 🏛️ Góc nhìn Solution Architect

LoD ở mức service: client gọi service A để lấy ID, rồi tự gọi tiếp B và C để ghép dữ liệu. Như vậy client biết topology bên trong của hệ thống. Cách sửa: A cung cấp một API trả lời thẳng, hoặc đặt một lớp BFF hay API Gateway để ghép dữ liệu thay cho client.

### ✅ Tự kiểm tra cho #4-#5 (trả lời bằng tiếng Anh)

1. 🇬🇧 Name 4 coupling smells in `placeOrder` and, for each, finish: *"If ___ changes, this line breaks."* 🇻🇳 Kể 4 dấu hiệu trong `placeOrder`, không nhìn bảng.
2. 🇬🇧 What is stamp coupling? When is passing an object still the right choice? 🇻🇳 Stamp coupling là gì, khi nào truyền object vẫn đúng?
3. 🇬🇧 Why is `forwardRef` not a real fix for `OrderService ↔ PaymentService`? How do you remove the cycle? 🇻🇳 Vì sao `forwardRef` không phải cách sửa thật? Bỏ vòng thế nào?
4. 🇬🇧 `invoice.getOrder().getCustomer().getAddress().getCity()`: the team changes `Address` into a list. Which classes must change, and how do you fix the line? Does `query.where().orderBy().limit(10)` violate LoD? 🇻🇳 Class nào phải sửa, sửa dòng thế nào, fluent query có vi phạm không?
5. 🇬🇧 A teammate "fixes" LoD by adding `getCustomerCity()`, `getCustomerEmail()`, `getCustomerPhone()` to `Order`. What smell did they create, and what is the better fix? 🇻🇳 Đồng nghiệp tạo ra smell gì, sửa thế nào tốt hơn?

<details><summary>Đáp án / Key points</summary>

**1.** Chọn 4 trong bảng ở #4, ví dụ: *Reading the `users` collection directly: if the Users team renames a field, this line breaks. `getGateway().getClient().charge()`: if we switch from Stripe, this line breaks. `isAdmin`/`skipEmail` flags: if we add another rule, every caller breaks. The gold-tier discount copied in 3 services: if the discount policy changes, we must edit 3 places.*

**2.** *Stamp coupling is passing a whole large object when the function only needs one or two fields, so the function depends on the shape of that object.* Truyền object vẫn đúng khi các field **luôn đi cùng nhau** và object đó nhỏ, có nghĩa riêng (*Parameter Object*). *Pass a small object whose fields belong together; avoid passing a big aggregate just to read two fields.*

**3.** *`forwardRef` only lets the cycle exist; both modules still know each other and cannot be separated or tested alone. Remove the cycle: the orders module owns a `PaymentPort` and payments implements it, or payments reacts to an `OrderPlaced` event.*

**4.** *`InvoicePrinter` must change, because it knows the structure of Invoice, Order, Customer and Address. Fix: ask `invoice.shippingCity()` and let `Order` decide which address to use.* Fluent query **không** vi phạm: *each call returns the same `Query` object, so we never talk to a stranger.*

**5.** *They created a Middle Man and a bloated `Order` interface. Better: move the behaviour that needs those fields to where the data lives (Tell, Don't Ask), e.g. `order.notifyCustomer(notifier)` or `invoice.shippingCity()` only where it is really needed.*

</details>

---

## 6. Global và Singleton: phụ thuộc ẩn

| English | Nghĩa |
|---|---|
| global state | dữ liệu dùng chung toàn chương trình |
| hidden dependency | phụ thuộc không lộ ra trong chữ ký hàm hay constructor |
| shared mutable state | state dùng chung và sửa được |
| test pollution / order-dependent test | test này làm bẩn state của test khác, kết quả phụ thuộc thứ tự chạy |
| seam | chỗ có thể chèn bản thay thế (fake) vào |
| composition root | nơi duy nhất tạo và lắp các object |

### 🇬🇧 Theory

A global or a Singleton accessed through `getInstance()` is a **hidden dependency**: the function signature does not show it, so callers and tests cannot see or replace it. If the state is **mutable and shared**, one part of the program (or one test) can silently change the behaviour of another. The fix is not "never have one instance". The fix is to **create one instance in one place and pass it in**.

### 🇻🇳 Giải thích: 3 vấn đề

**1. Phụ thuộc ẩn.** Chữ ký nói một đằng, code làm một nẻo. **2. State dùng chung:** test chạy riêng thì xanh, chạy chung thì đỏ. **3. Khó thay bằng fake:** muốn đổi phải patch hoặc reset state toàn cục.

### Ví dụ (đã chạy thật: pytest, `mypy --strict` sạch)

```python
# pricing.py
class Settings:
    _instance: "Settings | None" = None

    def __init__(self) -> None:
        self.vat_rate = 0.10

    @classmethod
    def instance(cls) -> "Settings":
        if cls._instance is None:
            cls._instance = Settings()
        return cls._instance

# Chữ ký nói: "tôi cần net". Thực tế còn cần Settings toàn cục, nhưng chữ ký không cho thấy.
def price_with_vat(net: int) -> int:
    return round(net * (1 + Settings.instance().vat_rate))

# AFTER: phụ thuộc nằm trong chữ ký
def price_with_vat_v2(net: int, vat_rate: float) -> int:
    return round(net * (1 + vat_rate))
```

```python
# test_pricing.py
def test_export_order_has_no_vat() -> None:
    Settings.instance().vat_rate = 0.0      # sửa state toàn cục, không trả lại
    assert price_with_vat(100) == 100

def test_domestic_order_has_vat() -> None:
    assert price_with_vat(100) == 110
```

Kết quả chạy thật:
- Chạy riêng `test_domestic_order_has_vat`: `1 passed`.
- Chạy cả file: `FAILED test_domestic_order_has_vat - assert 100 == 110`.

Lần theo state qua từng test:

| Bước | `Settings._instance` | `vat_rate` | `price_with_vat(100)` |
|---|---|---|---|
| Ban đầu | `None` | — | — |
| Test 1: `instance()` | instance A (mới tạo) | 0.10 | — |
| Test 1: gán `vat_rate = 0.0` | instance A | **0.0** | 100 ✅ |
| Test 2: `instance()` | **vẫn instance A** (đã khác `None`) | 0.0 | 100 ❌ (cần 110) |

Test thứ hai bản thân không sai. Nó đỏ vì test thứ nhất để lại state.

### Bẫy riêng của Python: module-level singleton và `patch`

```python
# config.py
class Settings:
    vat_rate = 0.10
settings = Settings()        # module được cache, nên mọi nơi import đều dùng chung object này

# checkout.py
from config import settings
def total(net: int) -> int:
    return round(net * (1 + settings.vat_rate))
```

Kết quả chạy thật:
- `config.settings is checkout.settings` → `True`.
- `patch("config.settings", Zero())` → `total(100)` vẫn ra **110**.
- `patch("checkout.settings", Zero())` → ra **100**.

Lý do: `from config import settings` đã chép tham chiếu vào namespace của `checkout`, nên patch ở `config` không ảnh hưởng tới nó. Phải **patch ở chỗ dùng**, nghĩa là test phải biết đường import bên trong `checkout`. Bản thân điều đó cũng là coupling.

> **Phản xạ:** *Thấy `getInstance()`, `global`, `import settings` hay `patch(...)` trong test thì hỏi: "Chữ ký hàm có cho thấy phụ thuộc này không? Test có truyền bản thay thế vào được mà không cần patch không?"*

### Liên hệ D5 #5: service locator

`Container.get(Mailer)` gọi bên trong method cũng là phụ thuộc ẩn ([D5 #5](d05-solid-l-i-d.md#5-dip--di--ioc)). Nó chỉ thay "biến global" bằng "cái hộp global". Khác biệt nằm ở **ai đi lấy**: code tự lấy thì phụ thuộc bị ẩn, còn được đưa vào qua constructor thì phụ thuộc lộ ra.

### Singleton pattern ≠ singleton lifetime

| | Singleton pattern (GoF) | Singleton lifetime (DI container) |
|---|---|---|
| Ai đảm bảo chỉ có 1 instance | Chính class đó (`getInstance`, constructor private) | Container / composition root |
| Code dùng lấy nó thế nào | Tự gọi `X.getInstance()`: **ẩn** | Nhận qua constructor: **lộ** |
| Test thay thế | Phải patch hoặc reset state | Truyền fake vào |

Vấn đề không nằm ở "chỉ có một instance". Vấn đề là **truy cập toàn cục**. Singleton pattern học ở D9, DI lifetime ở D12.

### 🟦 TypeScript / JavaScript

Đã chạy thật: `tsc 5.6.3 --strict`, NestJS 10 + `@nestjs/testing` 10, Node 22.

- **`export const db = new Db()` là singleton qua module cache.** `require('./db').db === db` → `true`. Vấn đề giống Python: test phải dùng `jest.mock('./db')`, tức là biết đường import.
- **Provider của NestJS mặc định là singleton scope** (`app.get(Checkout) === app.get(Checkout)` → `true`), nhưng **được inject**, nên test thay được:
  ```ts
  @Injectable() export class TaxPolicy { vatRate() { return 0.1; } }
  @Injectable() export class Checkout {
    constructor(private readonly tax: TaxPolicy) {}
    total(net: number) { return Math.round(net * (1 + this.tax.vatRate())); }
  }

  const mod = await Test.createTestingModule({ providers: [TaxPolicy, Checkout] })
    .overrideProvider(TaxPolicy).useValue({ vatRate: () => 0 }).compile();
  mod.get(Checkout).total(100);   // 100 (bản thật: 110)
  ```
  Một instance, nhưng phụ thuộc lộ trong constructor, nên đây là trường hợp tốt.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"Singleton lúc nào cũng xấu."** Không đúng. Pool kết nối DB, logger, config đọc một lần đều *nên* chỉ có 1 instance. Thứ xấu là *lấy nó qua truy cập toàn cục* và *state sửa được*.
- **"Config đọc từ env thì vô hại."** Nếu chỉ đọc một lần lúc khởi động rồi inject thì ổn. Còn hàm nghiệp vụ tự gọi `os.environ["VAT"]` thì đó là phụ thuộc ẩn.
- **Thêm `reset()` để sửa test đỏ** chỉ chữa triệu chứng. Code vẫn ẩn phụ thuộc, và chạy test song song vẫn vỡ.

### 🏛️ Góc nhìn Solution Architect

- Ở mức hệ thống, "global state" là **cache trong bộ nhớ của từng instance** hoặc **biến static trong service**. Scale lên 3 pod thì mỗi pod giữ một bản riêng và dữ liệu lệch nhau. Muốn chia sẻ state thật thì đưa ra ngoài (Redis, DB). Đây là nền cho bài *stateless service* ở tuần 9.
- Chạy test song song (`pytest -n`, Jest workers) là bài kiểm tra nhanh nhất: test nào đỏ ngẫu nhiên thì gần như chắc chắn đang dùng chung state.

### ✅ Tự kiểm tra cho #6 (trả lời bằng tiếng Anh)

1. 🇬🇧 What is a "hidden dependency"? Show it with `price_with_vat(net)`. 🇻🇳 Phụ thuộc ẩn là gì? Minh hoạ bằng `price_with_vat(net)`.
2. 🇬🇧 Trace the state: why does `test_domestic_order_has_vat` pass alone but fail after `test_export_order_has_no_vat`? 🇻🇳 Lần theo state từng bước, không đoán.
3. 🇬🇧 `patch("config.settings", ...)` has no effect on `checkout.total()`. Why? What does that tell you about coupling? 🇻🇳 Vì sao patch không có tác dụng, điều đó nói gì về coupling?
4. 🇬🇧 NestJS providers are singletons by default. Why is that not the same problem as `Settings.getInstance()`? 🇻🇳 Vì sao provider singleton của Nest không mắc cùng vấn đề?
5. 🇬🇧 Your service keeps a `Map` cache as a module-level variable. It works on 1 pod. What breaks on 3 pods, and how do you fix it? 🇻🇳 Cache `Map` cấp module chạy tốt trên 1 pod, lên 3 pod thì vỡ gì, sửa thế nào?

<details><summary>Đáp án / Key points</summary>

**1.** *A hidden dependency is something a function needs that its signature does not show. `price_with_vat(net)` looks like it only needs `net`, but it also reads `Settings.instance().vat_rate`, so callers and tests cannot see or replace it.*

**2.** Xem bảng lần theo state ở trên. *Test 1 creates the single instance and sets `vat_rate` to 0.0 without resetting it. Test 2 calls `instance()`, gets the same object (because `_instance` is no longer `None`), so the price is 100, not 110. The second test is correct; the shared state is the problem.*

**3.** *`from config import settings` copies the reference into `checkout`'s namespace, so patching `config.settings` does not change `checkout.settings`. You must patch where it is used, which means the test has to know `checkout`'s internal imports: that is coupling to implementation details.*

**4.** *Nest guarantees one instance, but the class receives it through its constructor, so the dependency is visible and a test can replace it with `overrideProvider`. The problem with `getInstance()` is global access, not having a single instance.*

**5.** *Each pod has its own `Map`, so the caches diverge: one pod updates or invalidates a key, the others still serve stale data, and results depend on which pod handles the request. Fix: move shared state out of the process (Redis or the DB), or accept a per-pod cache only for data that is read-only or can be stale, with a short TTL.*

</details>

---

## 7. Phân loại coupling và cohesion, metric Ca Ce, connascence

🟢 T3: chỉ cần nhớ hai đầu mút của mỗi bảng và biết tên các metric.

| Coupling, từ tệ nhất đến tốt nhất | Ví dụ |
|---|---|
| **Content**: sửa hoặc đọc thẳng nội bộ module khác | đọc collection `users` của module khác (#4) |
| **Common**: dùng chung biến global | `Settings.instance()` (#6) |
| External: dùng chung định dạng hoặc giao thức bên ngoài | hai module cùng parse một file CSV |
| **Control**: truyền cờ điều khiển | `isAdmin`, `skipEmail` (#4) |
| **Stamp**: truyền cả cấu trúc lớn | `shipping_fee_v1(order)` (#4) |
| **Data**: chỉ truyền dữ liệu cần (tốt nhất) | `shipping_fee(province, weight)` |

| Cohesion, từ tệ nhất đến tốt nhất | Ví dụ |
|---|---|
| **Coincidental**: ở chung vì tình cờ | `OrderUtils` |
| Logical: cùng "loại" nhưng khác việc | `Validators` chứa mọi hàm validate |
| Temporal: chạy cùng lúc | `on_startup()` làm 5 việc không liên quan |
| Procedural / Communicational / Sequential | các bước nối nhau, dùng chung dữ liệu |
| **Functional**: tất cả cùng phục vụ một việc (tốt nhất) | `DiscountPolicy` |

Bảng coupling khớp đúng với các smell của #4 và #6. Đó là lý do chỉ cần nhớ hai đầu mút.

**Metric Ca / Ce:**
- **Ca (afferent):** số module phụ thuộc **vào** module này.
- **Ce (efferent):** số module mà module này phụ thuộc vào.
- **Instability I = Ce / (Ca + Ce)**: gần 0 là ổn định (nhiều nơi dựa vào), gần 1 là hay đổi. Quy tắc: phụ thuộc theo hướng I giảm dần, đây chính là DIP ở mức package.

**Connascence** đo độ mạnh của coupling. Từ yếu đến mạnh:
- phụ thuộc **tên** (name);
- phụ thuộc **kiểu** (type);
- phụ thuộc **ý nghĩa** của giá trị, ví dụ `status = 2` nghĩa là "paid" (meaning);
- phụ thuộc **vị trí** tham số, ví dụ `place(u, items, True, False)` (position);
- phụ thuộc **thuật toán** dùng chung, ví dụ hai bên cùng phải hash giống nhau (algorithm).

Ngoài ra còn các loại runtime: execution, timing, value, identity.

---

## 8. Khung nhớ nhanh

**Một câu:** *Coupling hỏi "module này **biết** bao nhiêu về module khác, và thứ nó biết có hay đổi không?". Cohesion hỏi "mọi thứ trong module có **cùng một lý do thay đổi** không?". Muốn cohesion cao, coupling thấp, nhưng coupling không bao giờ bằng 0.*

| | Coupling | Cohesion |
|---|---|---|
| Phạm vi | **Giữa** các module | **Bên trong** một module |
| Câu hỏi kiểm tra | B đổi thì A có phải đổi không? Dòng này biết gì về module khác? | Mô tả module bằng một câu không có chữ "và" được không? |
| Dấu hiệu tệ | Shotgun surgery; phải dựng DB/API thật để test; inappropriate intimacy; flag argument; phụ thuộc vòng; stamp coupling; message chain; global/Singleton | `Utils`/`Helper` gom đủ thứ; method không dùng chung field nào; một class nhiều actor |
| Cách sửa | Port do module cấp cao sở hữu (DIP), interface nhỏ (ISP), inject qua constructor (DI), Tell Don't Ask (LoD), event thay cho gọi vòng, truyền đúng dữ liệu cần | Tách theo actor / lý do thay đổi (SRP), gom code theo nghiệp vụ (package-by-feature) |
| Rủi ro lạm dụng | Interface 1-1 cho mọi class; getter chuyển tiếp (Middle Man); `forwardRef` thay cho bỏ vòng | Tách vụn tới mức một nghiệp vụ rải ra 4 class, coupling lại tăng |
| Ở mức hệ thống | DB chung, chuỗi gọi đồng bộ, distributed monolith | Bounded context (DDD) |

**Phản xạ coupling:** *đi từng dòng, hỏi "dòng này biết gì về module khác hoặc hạ tầng? Nếu thứ đó đổi, dòng này có vỡ không?"*
**Phản xạ LoD:** *mỗi dấu chấm có dẫn tới **một object khác** không? Có thì chuyển hành vi về nơi có dữ liệu, đừng thêm getter.*
**Phản xạ Global/Singleton:** *chữ ký có cho thấy phụ thuộc không? Test có truyền fake vào được mà không cần `patch` không?*
**Phản xạ cohesion:** *trước khi tách, hỏi "hai phần này có thay đổi **độc lập** với nhau không?"*

---

## 9. Thẻ Anki T1 kèm đáp án

**Thẻ 1.** *Coupling và cohesion là gì? Vì sao muốn cohesion cao, coupling thấp?*
Coupling là mức một module **biết** và phụ thuộc vào module khác (kiểm tra: B đổi thì A có phải đổi không?). Cohesion là mức các phần **bên trong** một module cùng phục vụ một mục đích, cùng lý do thay đổi (kiểm tra: mô tả bằng một câu không có chữ "và"). Cohesion cao + coupling thấp thì sửa một chỗ không lan ra nhiều chỗ, test riêng được, deploy và hiểu từng phần độc lập. Coupling không bao giờ bằng 0: mục tiêu là biết ít nhất có thể và chỉ phụ thuộc vào thứ ổn định.

**Thẻ 2.** *SRP liên quan đến cohesion thế nào? DIP liên quan đến coupling thế nào?*
SRP (một actor, một lý do thay đổi) chính là cohesion: gom những thứ đổi cùng nhau, tách những thứ đổi độc lập. DIP giảm coupling: module nghiệp vụ chỉ phụ thuộc vào port do **chính nó sở hữu**, viết bằng từ vựng nghiệp vụ, nên hạ tầng đổi không lan tới. ISP cũng giảm coupling: client chỉ biết đúng các method nó dùng. Lưu ý: interface ổn định là nhờ ai sở hữu và viết bằng từ của ai, không phải nhờ nó là interface.

**Thẻ 3.** *Kể 3 dấu hiệu code đang bị coupling chặt.*
Chọn 3 trong số, mỗi cái kèm ví dụ: (1) **shotgun surgery**: đổi rule giảm giá phải sửa 3 service; (2) **phải dựng DB/API thật** mới unit test được, hoặc phải mock rất nhiều; (3) **inappropriate intimacy**: đọc thẳng collection `users` của module khác, dùng `mail.transporter`; (4) **flag argument** `isAdmin`, `skipEmail` (control coupling); (5) **phụ thuộc vòng** Order ↔ Payment phải dùng `forwardRef`; (6) **stamp coupling**: truyền cả `Order` khi chỉ cần tỉnh và cân nặng; (7) **message chain** `a.getB().getC().doX()`.

**Thẻ 4.** *Law of Demeter là gì? Cho ví dụ vi phạm và cách sửa.*
Một method chỉ nên gọi method của: chính object đó, tham số, object nó tạo ra, field trực tiếp của nó. Không đi xuyên qua một object để nói chuyện với "người lạ". Vi phạm: `invoice.getOrder().getCustomer().getAddress().getCity()` khiến `InvoicePrinter` phụ thuộc cấu trúc 4 class, `Address` đổi là nó vỡ. Sửa: `invoice.shippingCity()`, để `Order` tự trả lời (Tell, Don't Ask). Fluent API như `query.where().orderBy().limit()` **không** vi phạm vì mỗi lời gọi trả về cùng một object. Đừng sửa bằng cách thêm hàng loạt getter chuyển tiếp (Middle Man).

**Thẻ 5.** *Vì sao Singleton / biến global tạo ra "phụ thuộc ẩn"?*
Code tự lấy instance qua `getInstance()` hoặc biến global, nên chữ ký hàm không cho thấy nó phụ thuộc vào gì: `price_with_vat(net)` trông như chỉ cần `net`. Hệ quả: (1) caller và test không thấy, không thay được bằng fake, phải `patch` đúng chỗ dùng; (2) state dùng chung bị sửa ở nơi khác → test chạy riêng xanh, chạy chung đỏ. Sửa: tạo một instance ở composition root rồi inject vào. "Một instance" không xấu, "truy cập toàn cục" mới xấu.

---

## 10. Câu hỏi cuối bài

> Đáp án mẫu (Claude viết hộ, 13/11/2026). Khi ôn: che đáp án, tự trả lời bằng tiếng Anh trước rồi mới mở.

1. "High cohesion, low coupling" nghĩa là gì, nói bằng lời của bạn?
2. Kể 3 dấu hiệu cho thấy code đang bị coupling chặt.
3. Biến global và Singleton làm tăng coupling như thế nào?
4. *(Câu bổ sung)* `InvoicePrinter` có dòng `invoice.getOrder().getCustomer().getAddress().getCity()`. Team đổi `Address` thành danh sách nhiều địa chỉ giao hàng. Những class nào phải sửa? Vì sao? Bạn sửa dòng này thế nào? Còn `query.where(...).orderBy(...).limit(10)` có vi phạm Law of Demeter không?
5. *(Câu bổ sung)* Bạn tách `OrderUtils` (chứa `formatPrice`, `sendEmail`, `validatePhone`) thành 3 class riêng. Cohesion và coupling thay đổi ra sao? Việc này ứng với nguyên lý SOLID nào? Nếu sau khi tách, `OrderService` phải `new` cả 3 class cụ thể thì bạn cải thiện tiếp thế nào?

<details><summary>Đáp án</summary>

**1.** *High cohesion: everything inside a module serves one purpose and changes for the same reason. Low coupling: a module knows as little as possible about other modules, and only about stable things like small interfaces it owns. Together they mean a change stays in one place, and each part can be tested and deployed on its own.* ([#3](#3-high-cohesion-low-coupling-và-solid))

**2.** Chọn 3, mỗi cái kèm ví dụ từ bài `placeOrder` ([#4](#4-dấu-hiệu-coupling-chặt)): *shotgun surgery (the gold-tier discount copied in 3 services); needing a real DB to unit test (`conn.collection('users')` inside the service); inappropriate intimacy (`mail.transporter.sendMail`); flag arguments (`isAdmin`, `skipEmail`); circular dependency (`forwardRef` on both sides); stamp coupling (passing the whole `Order` to read two fields).*

**3.** ([#6](#6-global-và-singleton-phụ-thuộc-ẩn)) *Three ways: the dependency is hidden, because the signature does not show it; the state is shared and mutable, so one test or request can change another's result (tests pass alone, fail together); and it cannot be replaced by a fake without patching where it is used. The fix is to create one instance at the composition root and inject it.*

**4.** ([#5](#5-law-of-demeter-chỉ-nói-chuyện-với-bạn-trực-tiếp)) Phải sửa: `Address`, `Customer` (trả về danh sách), và **cả `InvoicePrinter`**, cùng mọi class khác đang đi chuỗi đó, dù chúng không liên quan tới địa chỉ. *`InvoicePrinter` knows the structure of four classes. Fix: `invoice.shippingCity()`, and `Order` decides which address is the shipping one, so only `Order` changes next time.* Fluent query **không** vi phạm: *each call returns the same `Query` object, so we never reach into a stranger.*

**5.** ([#2](#2-cohesion-các-phần-bên-trong-cùng-một-mục-đích), [#3](#3-high-cohesion-low-coupling-và-solid)) Cohesion của mỗi class tăng (từ coincidental lên functional), ứng với **SRP**. Coupling **không tự giảm**: nếu `OrderService` tự `new PriceFormatter()`, `new EmailSender()`, `new PhoneValidator()` thì nó vẫn biết 3 class cụ thể và test vẫn phải dựng SMTP. Cải thiện: `OrderService` phụ thuộc vào port nó sở hữu (`OrderNotifier.orderPlaced(order)` thay cho `EmailSender`), nhận qua constructor (**DIP + DI**). Hàm thuần như `formatPrice` không cần interface. *Splitting improves cohesion; it is the injected, owned abstractions that reduce coupling.*

</details>

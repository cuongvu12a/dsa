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
4. 🚧 Dấu hiệu coupling chặt · 🔴 T1
5. 🚧 Law of Demeter · 🔴 T1
6. 🚧 Global và Singleton: phụ thuộc ẩn · 🔴 T1
7. 🚧 Phân loại coupling và cohesion, metric Ca Ce, connascence · 🟢 T3
8. 🚧 Khung nhớ nhanh
9. 🚧 Thẻ Anki T1 kèm đáp án · 🔴 T1
10. 🚧 Câu hỏi cuối bài (đáp án mẫu)

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

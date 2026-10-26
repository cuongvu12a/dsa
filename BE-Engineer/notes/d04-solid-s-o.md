# D4: SOLID — phần S (SRP) và O (OCP) (tổng hợp)

← [Tuần 1](../100-ngay/tuan-01.md) · Phạm vi: mục #1 đến #5 của D4

> Ghi chú ôn tập. Câu tiếng Anh đơn giản 🇬🇧 để luyện đọc, kèm giải thích 🇻🇳. Code dùng Python; khác biệt của **TypeScript/JavaScript** nằm trong khối 🟦 cuối mỗi mục (đã kiểm chứng bằng cách chạy thật, không ghi theo trí nhớ).
> Nhãn: 🔴 T1 = nhớ và dạy lại được · 🟡 T2 = hiểu, nhớ tiêu chí chọn · 🟢 T3 = biết để tra khi cần
> Cả 5 mục của D4 đều 🔴 T1.

---

## Mục lục

1. [SRP theo nghĩa "actor"](#1-srp-theo-nghĩa-actor) · 🔴 T1
2. [Dấu hiệu vi phạm SRP](#2-dấu-hiệu-vi-phạm-srp) · 🔴 T1
3. [OCP: biến switch/if thành interface + implementation](#3-ocp-biến-switchif-thành-interface--implementation) · 🔴 T1
4. [OCP với Strategy và Factory](#4-ocp-với-strategy-và-factory) · 🔴 T1
5. [YAGNI, rule of three: khi nào trừu tượng hoá](#5-yagni-rule-of-three-khi-nào-trừu-tượng-hoá) · 🔴 T1
6. [Khung nhớ nhanh](#6-khung-nhớ-nhanh)
7. [Thẻ Anki T1 kèm đáp án](#7-thẻ-anki-t1-kèm-đáp-án) · 🔴 T1
8. [Câu hỏi cuối bài](#8-câu-hỏi-cuối-bài)

---

## 1. SRP theo nghĩa "actor"

| English | Nghĩa |
|---|---|
| Single Responsibility Principle (SRP) | Nguyên lý một trách nhiệm |
| reason to change | lý do để thay đổi |
| actor | tác nhân — một người/nhóm người cụ thể có thể yêu cầu sửa đoạn code này |
| stakeholder | bên liên quan |
| responsibility | trách nhiệm |
| cohesion | tính gắn kết (các phần tử trong 1 class phục vụ cùng một mục đích) |
| coupling | tính phụ thuộc chéo giữa các phần |
| god class | class ôm đồm nhiều việc không liên quan |

### 🇬🇧 Theory

Robert C. Martin's own definition (in *Clean Architecture*) is: **"A module should be responsible to one, and only one, actor."** An *actor* is a single person, or a single group of people playing the same role, who can request a change to that piece of code for a reason specific to them.

The popular paraphrase "a class should do only one thing" is misleading. A class can have five methods and still satisfy SRP — as long as all five methods change for the *same* reason, requested by the *same* actor. SRP is violated when **two different actors**, for two **independent** reasons, can each force a change to the *same* class.

### 🇻🇳 Giải thích

"Một lý do để thay đổi" **không** có nghĩa là "một hành động" hay "một method". Nó có nghĩa: nếu bạn hỏi *"ai là người sẽ yêu cầu sửa đoạn code này, và vì sao?"*, câu trả lời phải luôn quy về **một nhóm người / một vai trò duy nhất**.

Ví dụ kinh điển (Uncle Bob): class `Employee` có 3 method — `calculatePay()` (CFO/kế toán quan tâm công thức lương), `reportHours()` (COO/vận hành quan tâm cách tính giờ công để báo cáo), `save()` (DBA quan tâm cách lưu trữ). Ba actor này **độc lập** với nhau: kế toán đổi công thức thuế không liên quan gì tới DBA đổi schema. Nhưng vì cả 3 method nằm chung 1 class, một thay đổi của actor này có rủi ro ảnh hưởng tới code mà actor kia đang phụ thuộc (coupling ẩn qua state chung, qua việc build/test/deploy chung).

Liên hệ [D2 — Encapsulation (#2)](d02-oop.md#2-encapsulation-và-invariant): ở D2, một class bảo vệ **invariant của riêng nó**. SRP mở rộng ý đó lên một mức: một class nên gắn với **một lý do thay đổi** (một actor), giống như nó chỉ nên bảo vệ **một nhóm bất biến** thuộc về một chủ sở hữu nghiệp vụ.

### Ví dụ: `Invoice` gánh 3 actor

```python
class Invoice:
    def __init__(self, items: list[dict]):
        self.items = items

    def calculate_total(self) -> float:
        # Actor: Kế toán (Finance) — sở hữu công thức thuế, chiết khấu
        subtotal = sum(i["price"] * i["qty"] for i in self.items)
        tax = subtotal * 0.1
        return subtotal + tax

    def print_invoice(self) -> str:
        # Actor: Vận hành / CSKH — sở hữu định dạng hiển thị cho khách
        lines = [f"{i['name']} x{i['qty']}: {i['price']}" for i in self.items]
        return "\n".join(lines) + f"\nTotal: {self.calculate_total()}"

    def save(self, db) -> None:
        # Actor: Hạ tầng / DBA — sở hữu cách lưu trữ (SQL, NoSQL, file...)
        db.execute("INSERT INTO invoices ...", self.items)
```

Kế toán đổi công thức thuế → sửa `calculate_total`. CSKH muốn đổi hoá đơn in theo mẫu mới → sửa `print_invoice`. DBA chuyển từ Postgres sang Mongo → sửa `save`. Ba actor này **không ai cần biết tới 2 người kia**, nhưng cả ba đang cùng sửa một file `Invoice`, cùng chạy qua một bộ test, cùng review chung — đây chính là vi phạm SRP, không phải vì "class làm 3 việc" mà vì **3 lý do thay đổi độc lập cùng gánh trên 1 class**.

### 🟦 TypeScript / JavaScript

Ở mục này không có khác biệt ngôn ngữ đáng chú ý — cấu trúc class TS giống hệt Python, 3 method tương ứng 3 actor y hệt. Điểm khác biệt về SRP là vấn đề **thiết kế**, không phải cú pháp:

```ts
class Invoice {
  constructor(private items: { name: string; price: number; qty: number }[]) {}

  calculateTotal(): number { /* Actor: Kế toán */ return 0; }
  printInvoice(): string { /* Actor: Vận hành/CSKH */ return ""; }
  save(db: unknown): void { /* Actor: Hạ tầng/DBA */ }
}
```

### ⚠️ Bẫy / hiểu nhầm hay gặp

- **"SRP = class chỉ có 1 method"** — sai. Một class có 10 method vẫn đúng SRP nếu cả 10 phục vụ cùng một actor (vd 10 method đều thuộc về logic tính giá của kế toán).
- **Tách nhỏ bừa bãi để "trông gọn"** — nếu tách theo cảm tính thay vì theo actor thật, dễ tạo ra nhiều class rỗng gọi nhau loằng ngoằng (shotgun surgery theo hướng ngược — sửa 1 nghiệp vụ phải lần qua 5 class).
- **Actor không phải lúc nào cũng rõ ràng ngay** — nó là một **ước lượng** dựa trên tổ chức/nghiệp vụ hiện tại, không phải định lý toán học. Khi tổ chức đổi, actor có thể gộp hoặc tách lại.

### 🏛️ Góc nhìn Solution Architect

- Ranh giới actor thường **trùng với ranh giới team** (Conway's Law): nếu team Kế toán và team Hạ tầng phải cùng sửa 1 file để release tính năng của riêng họ, đó là tín hiệu rõ ràng của vi phạm SRP — gây xung đột merge, review chéo không cần thiết, và release của team này kéo theo rủi ro cho team kia.
- Ở quy mô hệ thống, vi phạm SRP lặp lại nhiều lần là lý do thực tế để tách module/service theo bounded context (mỗi actor/domain một service).
- Đừng đi tìm actor "có thể sẽ xuất hiện" — chỉ tách khi **ít nhất 2 actor thật đã và đang tồn tại** và có lịch sử yêu cầu thay đổi độc lập.

### ✅ Tự kiểm tra (trả lời trước khi xem đáp án)

1. 🇬🇧 In your own words: what does "one reason to change" mean, in terms of *actors* — not "one thing"? 🇻🇳 Diễn đạt lại: "một lý do để thay đổi" theo nghĩa *actor* nghĩa là gì — không phải "làm một việc"?
2. 🇬🇧 In the `Invoice` example, name the 3 actors and explain why they are independent of each other. 🇻🇳 Trong ví dụ `Invoice`, nêu tên 3 actor và giải thích vì sao họ độc lập với nhau.

<details><summary>Ý chính cần có / Key points</summary>

**1.** "Một lý do để thay đổi" = mọi yêu cầu sửa class này, dù xuất phát từ đâu, luôn quy về **cùng một nhóm người/vai trò** (actor). Không phải đếm số hành động class làm — một class nhiều method vẫn ổn nếu tất cả method phục vụ cùng actor; ngược lại một class chỉ 1 method vẫn có thể sai nếu actor của nó không rõ ràng hoặc dễ bị actor khác "mượn" sửa chung.

**2.** Kế toán (Finance) sở hữu `calculate_total` — công thức thuế/chiết khấu. Vận hành/CSKH sở hữu `print_invoice` — định dạng hiển thị cho khách. Hạ tầng/DBA sở hữu `save` — cách lưu trữ. Ba actor độc lập vì mỗi người có thể yêu cầu thay đổi phần của mình mà **không cần biết tới 2 actor kia tồn tại** — công thức thuế đổi không liên quan gì đến schema DB.

</details>

---

## 2. Dấu hiệu vi phạm SRP

| English | Nghĩa |
|---|---|
| code smell | dấu hiệu bất ổn trong code (chưa hẳn là bug) |
| god class | class ôm đồm quá nhiều trách nhiệm không liên quan |
| cohesion | tính gắn kết — các phần tử trong class có cùng phục vụ một mục đích không |
| shotgun surgery | một thay đổi nghiệp vụ buộc phải sửa ở nhiều nơi rải rác |
| mocking | giả lập một phụ thuộc trong unit test |

### 🇬🇧 Theory

You rarely *prove* an SRP violation with a formula — you **smell** it. Common signals: the class is huge; its name contains vague words like `Manager`, `Helper`, `Util`, or the word "And"; people from **different teams, for different reasons**, keep editing the same file; writing a unit test for one piece of behavior forces you to mock a pile of unrelated dependencies.

### 🇻🇳 Giải thích

Không có công thức đo SRP chính xác — chỉ có **dấu hiệu nghi ngờ**. Dấu hiệu rõ nhất **không phải** "class dài" (dài có thể chỉ vì nhiều logic cùng 1 actor), mà là: **lịch sử commit cho thấy 2 nhóm người khác nhau, vì 2 lý do độc lập, liên tục phải sửa cùng 1 file.**

### Ví dụ: `OrderService` gánh nhiều actor hơn tưởng tượng

```python
class OrderService:
    def __init__(self, db, smtp_client, tax_config):
        self.db = db
        self.smtp_client = smtp_client
        self.tax_config = tax_config

    def place_order(self, user_id: int, items: list[dict]) -> dict:
        subtotal = sum(i["price"] * i["qty"] for i in items)   # Actor: Kế toán/Pricing
        tax = subtotal * self.tax_config["rate"]
        total = subtotal + tax

        order = {"user_id": user_id, "items": items, "total": total, "status": "pending"}
        order_id = self.db.insert("orders", order)              # Actor: Hạ tầng/DBA

        self._validate_stock(items)
        self._send_confirmation_email(user_id, order_id, total)
        self._log_for_analytics(user_id, order_id, total)
        return {"order_id": order_id, "total": total}

    def _validate_stock(self, items: list[dict]) -> None:
        # Actor: Kho/Inventory
        for i in items:
            row = self.db.query("SELECT qty FROM inventory WHERE sku = ?", i["sku"])
            if row["qty"] < i["qty"]:
                raise ValueError(f"Out of stock: {i['sku']}")

    def _send_confirmation_email(self, user_id: int, order_id: int, total: float) -> None:
        # Actor: Vận hành/CSKH
        user = self.db.query("SELECT email FROM users WHERE id = ?", user_id)
        self.smtp_client.send(user["email"], f"Order #{order_id} confirmed", f"<h1>Thank you!</h1><p>Total: ${total}</p>")

    def _log_for_analytics(self, user_id: int, order_id: int, total: float) -> None:
        # Actor: Analytics/BI — và viết thẳng ra đường dẫn hardcode, không inject
        with open("/var/log/analytics.csv", "a") as f:
            f.write(f"{user_id},{order_id},{total}\n")
```

Class này gánh **5 actor độc lập**: Pricing (công thức thuế), DBA (schema `orders`), Kho (luật kiểm tồn), CSKH (nội dung/kênh thông báo), Analytics (định dạng log). Dấu hiệu rõ nhất không phải độ dài, mà là: muốn test riêng `total = subtotal + tax`, bạn buộc phải mock `db`, `smtp_client`, và cả `open()` (vì `_log_for_analytics` gọi thẳng filesystem, không inject) — **không kiểm tra được một trách nhiệm mà không kéo theo mọi trách nhiệm khác**. Phép tính `total` còn bị viết **inline** ngay trong `place_order` thay vì tách thành method riêng, nên không thể gọi test độc lập — phải chạy toàn bộ luồng (kiểm kho + gửi mail + ghi log) chỉ để kiểm tra một phép cộng thuế.

### 🟦 TypeScript / JavaScript

Cấu trúc tương đương hệt Python — vấn đề là thiết kế, không phải cú pháp. Điểm khác: trong TS/Node, `fs.appendFileSync('/var/log/analytics.csv', ...)` cũng là lời gọi filesystem trực tiếp, không mock được qua constructor injection như `smtp_client`, giống hệt bẫy `open()` ở Python.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- Nghĩ rằng "class dài" tự nó là bằng chứng vi phạm SRP — dấu hiệu đáng tin hơn là **actor độc lập cùng sửa 1 file**, không phải số dòng.
- Bỏ qua các dependency **không inject** (hardcode path, `open()`, `fs.writeFileSync` trực tiếp) — đây là smell nặng hơn nhiều so với 1 dependency được constructor inject nhưng khó mock.
- Coi "cần mock nhiều thứ trong test" là vấn đề của testing, không phải vấn đề thiết kế — thực ra đó chính là triệu chứng của SRP bị vi phạm.

### 🏛️ Góc nhìn Solution Architect

- Soi `git log` cho 1 file là cách thực tế nhất để phát hiện SRP violation: nếu commit tới từ nhiều nhóm tác giả, vì nhiều loại ticket khác nhau (tax rule, email template, DB migration...), đó là bằng chứng thật, không phải suy đoán.
- Một method gọi thẳng filesystem/network không qua constructor injection là tín hiệu kép: vừa vi phạm SRP (gánh thêm actor hạ tầng), vừa khiến class **không test được cô lập** — hai vấn đề luôn đi cùng nhau trong thực tế.

---

## 3. OCP: biến switch/if thành interface + implementation

| English | Nghĩa |
|---|---|
| Open/Closed Principle (OCP) | mở để mở rộng, đóng để sửa đổi |
| extension | mở rộng (thêm hành vi mới) |
| modification | sửa đổi (động vào code đã có) |
| abstraction | lớp trừu tượng (interface/abstract class) |
| polymorphism | đa hình — gọi cùng 1 thông điệp, mỗi loại tự xử lý khác nhau |
| protocol (Python) | kiểu "interface ngầm" — không cần kế thừa, chỉ cần đúng method |
| axis of variation | trục biến đổi — chiều mà một thứ thực sự thay đổi, độc lập với mọi chiều khác |

### 🇬🇧 Theory

OCP: *"software entities should be open for extension, but closed for modification."* It's a **promise to code that already works and is already tested**: once a piece of logic is written, reviewed, deployed, and trusted, nobody should need to re-open it just because a new case appears. The mechanism that makes this possible is **polymorphism** (see [D2 #5](d02-oop.md#5-polymorphism)): the calling code only knows "something that can `pay(amount)`", never the concrete class — so it never needs to change when a new case shows up.

### 🇻🇳 Giải thích

OCP không phải nói về "tổ chức code cho gọn" — nó là một **cam kết** với code **đã chạy ổn định trong production**. "Mở để mở rộng" nghĩa là hệ thống vẫn cho thêm hành vi mới, nhưng cách thêm là **viết thêm code mới** (1 class mới), không phải **sửa code cũ**. Lý do nguyên tắc này quan trọng:

1. **An toàn**: code cũ đã test kỹ, sửa nó = rủi ro phá cái đang chạy tốt dù chỉ định thêm 1 dòng.
2. **Tách trách nhiệm**: nếu logic cũ thuộc actor A, thêm case mới cho actor B mà không cần actor A review/test lại — nối trực tiếp với SRP ở mục #1-#2.
3. **Cơ chế**: polymorphism khiến code gọi không cần biết cụ thể loại nào, nên không bao giờ cần sửa khi có loại mới.

### Ví dụ có vấn đề

```python
def process_payment(method: str, amount: float) -> str:
    if method == "momo":
        return f"Paying {amount} via MoMo wallet"
    elif method == "vnpay":
        return f"Paying {amount} via VNPay gateway"
    elif method == "zalopay":
        return f"Paying {amount} via ZaloPay"
    else:
        raise ValueError(f"Unknown method: {method}")
```

Thêm `shopeepay` → phải **sửa** hàm này, thêm 1 `elif`. Phần **thay đổi theo loại**: logic/nguồn gọi API cụ thể của từng cổng. Phần **giữ nguyên**: chữ ký hàm — luôn nhận `amount`, luôn trả `str`. Phần giữ nguyên đó chính là **chữ ký chung** sẽ trở thành interface.

### Giải pháp: interface + implementation + registry

```python
from typing import Protocol

class PaymentMethod(Protocol):
    def pay(self, amount: float) -> str: ...

class MomoPayment:
    def pay(self, amount: float) -> str:
        return f"Paying {amount} via MoMo wallet"

class VnpayPayment:
    def pay(self, amount: float) -> str:
        return f"Paying {amount} via VNPay gateway"

class ZaloPayPayment:
    def pay(self, amount: float) -> str:
        return f"Paying {amount} via ZaloPay"

# "Registry" — map tên loại → instance implementation (Map/dict registry cho OCP, D1 dòng 112).
PAYMENT_METHODS: dict[str, PaymentMethod] = {
    "momo": MomoPayment(),
    "vnpay": VnpayPayment(),
    "zalopay": ZaloPayPayment(),
}

def process_payment(method: str, amount: float) -> str:
    handler = PAYMENT_METHODS.get(method)
    if handler is None:
        raise ValueError(f"Unknown method: {method}")
    return handler.pay(amount)
```

Thêm `ShopeePayPayment` giờ chỉ cần thêm class + 1 dòng đăng ký vào `PAYMENT_METHODS` — **không sửa** `process_payment` hay 3 class cũ. Lưu ý: việc "thêm vào registry" không phải là ngoại lệ phá vỡ OCP — registry là **điểm đăng ký** (composition root), khác bản chất với **sửa logic nghiệp vụ đã test** bên trong các class cũ.

**Ví dụ backend thứ hai — tính phí vận chuyển theo hãng:**

```python
class ShippingFeeCalculator(Protocol):
    def calculate(self, weight_kg: float) -> float: ...

class GhnFee:
    def calculate(self, weight_kg: float) -> float:
        return 15000 + weight_kg * 5000

class ViettelPostFee:
    def calculate(self, weight_kg: float) -> float:
        return 12000 + weight_kg * 4500

SHIPPING_CALCULATORS: dict[str, ShippingFeeCalculator] = {
    "ghn": GhnFee(),
    "viettelpost": ViettelPostFee(),
}
```

### Nhiều trục biến đổi (axis of variation) — chỗ dễ sai nhất

Một interface chỉ nên đại diện cho **đúng một trục**. Giả sử phí vận chuyển thực ra có 2 thứ thay đổi **độc lập**: hãng vận chuyển (GHN/ViettelPost) **và** mức dịch vụ (standard/express, áp dụng cho mọi hãng). Viết 1 interface duy nhất với 4 implementation (`GhnStandardFee`, `GhnExpressFee`, `ViettelStandardFee`, `ViettelExpressFee`) là **bùng nổ class** — đúng vấn đề đã học ở [D3 §2](d03-composition-vs-inheritance.md#2-các-vấn-đề-của-kế-thừa): 2×2=4 class, thêm hãng thứ 3 → 6, thêm mức thứ 3 → 9. Vì 2 trục độc lập bị gộp vào 1 trục giả.

Cách đúng — 2 interface riêng, composition lại ([D3 §3](d03-composition-vs-inheritance.md#3-composition--delegation)):

```python
class CarrierRateCalculator(Protocol):
    def base_fee(self, weight_kg: float) -> float: ...

class GhnRate:
    def base_fee(self, weight_kg: float) -> float:
        return 15000 + weight_kg * 5000

class ServiceLevelMultiplier(Protocol):
    def apply(self, base_fee: float) -> float: ...

class ExpressMultiplier:
    def apply(self, base_fee: float) -> float:
        return base_fee * 1.5

class ShippingFeeCalculator:
    def __init__(self, carrier: CarrierRateCalculator, service: ServiceLevelMultiplier):
        self.carrier = carrier
        self.service = service

    def calculate(self, weight_kg: float) -> float:
        return self.service.apply(self.carrier.base_fee(weight_kg))
```

Thêm hãng mới = thêm 1 `CarrierRateCalculator`. Thêm mức mới = thêm 1 `ServiceLevelMultiplier`. Số class **cộng**, không **nhân**.

**Cách nhận diện số trục:** với mỗi `if/switch`, liệt kê mọi thứ có thể đổi, rồi hỏi *"nếu A đổi, B có buộc đổi theo không?"* — nếu không, đó là 2 trục độc lập, cần 2 interface riêng. Đây chính là cơ chế đứng sau tín hiệu đã học ở [D3 §6](d03-composition-vs-inheritance.md#6-khung-nhớ-nhanh): *"tên class ghép nhiều tính từ → hỏi trục có độc lập không"* — tên ghép là dấu hiệu nghi ngờ để đi kiểm tra bằng phép thử trên, không phải bằng chứng cuối cùng (2 tính từ ghép nhau hiếm khi vẫn là 1 trục nếu chúng luôn đi liền nhau, không có tổ hợp lẻ).

### 🟦 TypeScript / JavaScript

```ts
interface PaymentMethod {
  pay(amount: number): string;
}

class MomoPayment implements PaymentMethod {
  pay(amount: number): string { return `Paying ${amount} via MoMo wallet`; }
}
class VnpayPayment implements PaymentMethod {
  pay(amount: number): string { return `Paying ${amount} via VNPay gateway`; }
}

const PAYMENT_METHODS: Record<string, PaymentMethod> = {
  momo: new MomoPayment(),
  vnpay: new VnpayPayment(),
};

function processPayment(method: string, amount: number): string {
  const handler = PAYMENT_METHODS[method];
  if (!handler) throw new Error(`Unknown method: ${method}`);
  return handler.pay(amount);
}
```

Đã kiểm chứng: khối trên biên dịch sạch với `tsc --strict` (Node 20). Khác biệt đáng chú ý so với Python `Protocol`: TS `interface` cũng là structural typing, nhưng `implements` là tuỳ chọn — một class không `implements PaymentMethod` nhưng có đúng method `pay(amount: number): string` vẫn gán được vào biến kiểu `PaymentMethod` ([D2 §6](d02-oop.md#6-interface-vs-abstract-class)).

### ⚠️ Bẫy / hiểu nhầm hay gặp

- Giữ `if/elif` để "biết hết các loại" rồi mới chuyển sang OCP khi có ≥3 loại — ngược tinh thần bài học: quan trọng là loại mới có xuất hiện thường xuyên/độc lập không, không phải số lượng (xem mục #5).
- Interface quá to (gộp `pay`, `refund`, `verify` vào 1 interface khi chỉ cần `pay`) — vi phạm cả ISP (D5), ép mọi implementation cài đặt thứ chưa cần.
- Đếm số tính từ trong tên class = số trục — sai, chỉ là gợi ý để đi kiểm tra bằng phép thử độc lập.

### 🏛️ Góc nhìn Solution Architect

- OCP giảm **blast radius**: thêm implementation mới không chạy lại test của implementation cũ, không risk regression ở code production ổn định.
- Interface hoá sớm có chi phí: thêm tầng gián tiếp, khó debug hơn khi chỉ có 1-2 case thật — một chuỗi `if/elif` ngắn, ít thay đổi, vẫn là lựa chọn đúng (mục #5).
- Registry dạng dict/Map là pattern production thật (feature flag theo tenant, pricing theo quốc gia, notification theo kênh), thường sống ở **composition root**, không rải `if` khắp codebase.
- File lớn nhiều actor (như một service thật ~5000 dòng) thường không chỉ vi phạm OCP đơn thuần — soi kỹ thường thấy **nhiều trục bị gộp chung** (ví dụ loại nghiệp vụ × đối tượng áp dụng) đan xen với vi phạm SRP (nhiều actor cùng sửa 1 file). Cách xử lý thực tế không phải viết lại toàn bộ một lần, mà theo kiểu Strangler Fig: mỗi lần có yêu cầu mới chạm vào file, tách đúng phần đó ra thành class riêng thay vì thêm nhánh/method vào chỗ cũ; chỉ dựng interface khi một trục biến đổi thật sự lặp lại (nối thẳng sang mục #5).

---

## 4. OCP với Strategy và Factory

| English | Nghĩa |
|---|---|
| Strategy pattern | đóng gói các thuật toán/hành vi thay thế được sau cùng 1 interface |
| Factory | nơi quyết định tạo ra implementation nào, thay vì nơi dùng nó tự quyết định |
| composition root | nơi duy nhất trong app "lắp ráp" dependency (đăng ký registry, chọn implementation) |
| "what" vs "how" | OCP là nguyên lý thiết kế (mục tiêu); Strategy/Factory là pattern (cách đạt mục tiêu) |

### 🇬🇧 Theory

OCP is a **principle** — a goal. Strategy and Factory are **patterns** — concrete techniques that achieve that goal. OCP says *why* you want an interface; Strategy says *how* (encapsulate each behavior as its own class behind a shared interface, swappable at runtime); Factory says *how* you decide **which** implementation to use without the calling code knowing the concrete class.

### 🇻🇳 Giải thích

Nhìn lại code mục #3 — đã làm cả Strategy lẫn Factory, chỉ chưa gọi tên:

```python
class PaymentMethod(Protocol): ...        # <- Strategy: contract chung
class MomoPayment: ...                    # <- mỗi Strategy cụ thể
class VnpayPayment: ...

PAYMENT_METHODS: dict[str, PaymentMethod] = {...}   # <- Factory đơn giản (registry-based)

def process_payment(method: str, amount: float) -> str:
    handler = PAYMENT_METHODS.get(method)   # <- "Factory" chọn Strategy; process_payment không biết class cụ thể
    ...
```

Mức cần nắm ở D4: thấy được OCP/Strategy/Factory là 3 góc nhìn trên cùng 1 đoạn code; chưa cần học sâu các biến thể Factory (Simple Factory / Factory Method / Abstract Factory) — phần đó học kỹ ở **Tuần 3**.

### 🟦 TypeScript / JavaScript

Cùng cấu trúc với Python: `interface PaymentMethod` = Strategy contract, `Record<string, PaymentMethod>` = Factory dạng registry, `processPayment` chọn qua `PAYMENT_METHODS[method]` mà không biết class cụ thể.

### ⚠️ Bẫy / hiểu nhầm hay gặp

- Nhầm "có dùng interface" = "đã dùng Strategy pattern" — Strategy cụ thể hơn: các implementation phải thay thế lẫn nhau được **tại runtime** cho cùng ngữ cảnh gọi.
- Nhầm Factory luôn phải là 1 class `XxxFactory` riêng — dict registry, hàm `create_xxx()`, hay `match/case` nhỏ đều là Factory hợp lệ ở mức đơn giản.

### 🏛️ Góc nhìn Solution Architect

Factory thường sống ở **composition root** — nơi app khởi động, đọc config, đăng ký registry **một lần**. Thấy nhiều nơi tự viết `if method == "momo"` để tạo instance là dấu hiệu Factory bị "rò rỉ" ra khỏi composition root, nên gom lại một chỗ.

### ✅ Tự kiểm tra

🇬🇧 In one sentence, what's the difference between what OCP asks for and what Strategy provides? 🇻🇳 Trong 1 câu, OCP yêu cầu gì khác với Strategy cung cấp gì?

<details><summary>Đáp án</summary>
OCP là mục tiêu thiết kế (không sửa code cũ khi thêm hành vi mới); Strategy là kỹ thuật cụ thể để đạt mục tiêu đó (đóng gói mỗi hành vi thành 1 class sau 1 interface chung, đổi được lúc chạy).
</details>

---

## 5. YAGNI, rule of three: khi nào trừu tượng hoá

| English | Nghĩa |
|---|---|
| YAGNI | *You Aren't Gonna Need It* — đừng xây cái bạn chưa chắc sẽ cần |
| rule of three | quy tắc: thấy lặp lại lần thứ 3 mới trừu tượng hoá |
| speculative generality | trừu tượng hoá dựa trên đoán tương lai, chưa có bằng chứng |
| premature abstraction | trừu tượng hoá quá sớm, khi chưa đủ biến thể thật |
| axis of variation | trục biến đổi — chiều mà một thứ thực sự thay đổi theo thời gian |

### 🇬🇧 Theory

YAGNI: don't build a capability until you have **actual, present evidence** you need it — not because "it might be useful later." Rule of three: see the same kind of change happen a **third** time before you extract an abstraction. The first occurrence is just code; the second might be coincidence; the third is a confirmed pattern.

### 🇻🇳 Giải thích

Đừng xây khả năng (interface, config flag, plugin system) chỉ vì "sau này có thể cần" — chỉ xây khi có bằng chứng **hiện tại**. Rule of three là cơ chế kích hoạt thực tế: thấy cùng kiểu thay đổi lặp lại lần thứ 3 mới nên trừu tượng hoá.

### Áp dụng vào câu hỏi của PM (câu 4 cuối bài)

Code hiện có 2 phương thức thanh toán, ổn định 1 năm, PM nói "sau này có thể thêm". Theo YAGNI + rule of three: **chưa nên** dựng interface + registry + factory ngay — mới 2 case, đã ổn định, "có thể thêm" là **dự đoán** chứ không phải bằng chứng. `if/elif` 2 nhánh vẫn dễ đọc, không tầng gián tiếp.

**Khi nào NÊN trừu tượng hoá (không chỉ khi nào không):**
- Biến thể **thứ 3** thực sự xuất hiện.
- Hoặc cùng dạng `if/elif` theo loại **lặp lại ở nhiều nơi khác nhau** trong codebase — tín hiệu mạnh hơn cả đếm case, vì trục biến đổi đã lan rộng.
- Hoặc có bằng chứng cụ thể (hợp đồng đã ký, ngày go-live đã định) chứ không phải lời nói chung chung.
- Hoặc khi **chi phí không trừu tượng hoá** cao hơn chi phí trừu tượng hoá — ví dụ logic hiện tại đan xen tới mức thêm 1 case rủi ro phá các case cũ (như file lớn nhiều actor ở mục #3).

### ⚠️ Bẫy / hiểu nhầm hay gặp

- YAGNI bị dùng làm cớ để không bao giờ refactor — sai, YAGNI nói về **không đoán trước tương lai**, không nói về việc phớt lờ bằng chứng hiện tại (class to, nhiều actor là bằng chứng *hiện tại*).
- Đếm đúng 3 lần copy-paste rồi tách, không xét chúng có cùng 1 trục biến đổi không — rule of three là heuristic, không phải luật cứng; 3 đoạn giống nhau nhưng đổi vì actor khác nhau tách chung vẫn sai (quay lại SRP).
- Nhầm "đơn giản" với "ít class" — đôi khi vài class nhỏ dễ hiểu hơn 1 hàm dài if/elif lồng nhau.

### 🏛️ Góc nhìn Solution Architect

- Dấu hiệu đáng tin nhất để quyết định trừu tượng hoá là **lịch sử thay đổi thực tế** (`git log`): file bị sửa lặp lại nhiều lần vì cùng 1 lý do trong vài tháng gần đây là bằng chứng mạnh hơn suy đoán lúc thiết kế.
- Một file 5000 dòng không sai vì "thiếu OCP ngay từ đầu" — rất có thể nó bắt đầu nhỏ, đúng YAGNI, rồi qua nhiều năm không ai áp dụng lại rule of three khi trục biến đổi đã rõ. YAGNI là quyết định **liên tục**, không phải chọn 1 lần lúc viết code đầu tiên.

### ✅ Tự kiểm tra

1. 🇬🇧 Why is "it might be useful later" not a valid reason to abstract, under YAGNI? 🇻🇳 Vì sao "sau này có thể hữu ích" không phải lý do hợp lệ để trừu tượng hoá theo YAGNI?
2. 🇬🇧 Give one case where you *should* abstract even though you only have 2 instances so far. 🇻🇳 Nêu một trường hợp bạn *nên* trừu tượng hoá dù mới chỉ có 2 instance.

<details><summary>Đáp án</summary>

**1.** Vì đó là dự đoán, không phải bằng chứng. Nếu đoán sai trục biến đổi, bạn trả chi phí trừu tượng hoá (thêm tầng gián tiếp, khó đọc hơn) mà không nhận lại lợi ích gì — tệ hơn cả không làm gì, vì còn phải "undo" interface sai sau này.

**2.** Khi cùng dạng rẽ nhánh theo loại lặp lại ở **nhiều nơi khác nhau** trong code, hoặc có bằng chứng cụ thể từ roadmap (hợp đồng đã ký, ngày go-live đã định), hoặc khi logic hiện tại đan xen tới mức sửa thêm 1 case rủi ro phá các case cũ.

</details>

---

## 6. Khung nhớ nhanh

**Một câu:** *SRP hỏi "class này phục vụ ai?" (một actor). OCP hỏi "thêm cái mới có phải sửa cái cũ không?" (không nên). Cả hai đều chỉ nên áp dụng khi có bằng chứng actor/trục thật, không phải dự đoán.*

| | SRP | OCP |
|---|---|---|
| Câu hỏi kiểm tra | Ai yêu cầu sửa đoạn code này? | Thêm case mới có phải sửa code cũ không? |
| Vi phạm khi | ≥2 actor độc lập cùng sửa 1 class | Thêm biến thể phải mở lại file cũ, đã test |
| Công cụ giải quyết | Tách theo actor thành nhiều class | Interface + implementation + registry (Strategy/Factory) |
| Rủi ro lạm dụng | Tách vụn theo cảm tính, không theo actor thật | Trừu tượng hoá sớm khi chưa có bằng chứng (vi phạm YAGNI) |

**Phản xạ actor (SRP):** hỏi *"ai ra quyết định/thay đổi đứng sau dòng code này"* — không phải ai viết hay ai đọc kết quả.
**Phản xạ trục (OCP):** với mỗi `if/switch`, hỏi *"nếu A đổi, B có buộc đổi theo không?"* — không, thì đó là ≥2 trục độc lập, cần ≥2 interface riêng, composition lại (không bùng nổ class như D3).
**Phản xạ YAGNI:** chỉ trừu tượng hoá khi biến thể thứ 3 **thật sự** xuất hiện, hoặc cùng dạng rẽ nhánh lặp lại ở nhiều nơi, hoặc có bằng chứng cụ thể — không phải vì "nghe nói sau này có thể cần".

---

## 7. Thẻ Anki T1 kèm đáp án

**Thẻ 1.** *SRP định nghĩa theo "actor" nghĩa là gì?*
"Một lý do để thay đổi" = mọi yêu cầu sửa class này luôn quy về **một nhóm người/vai trò duy nhất** (actor), không phải đếm số việc class làm. Một class nhiều method vẫn đúng SRP nếu tất cả phục vụ cùng 1 actor.

**Thẻ 2.** *Kể 3 dấu hiệu một class vi phạm SRP.*
(1) Tên chứa `Manager`/`Helper`/`Util`/"And"; (2) nhiều nhóm người khác nhau, vì lý do độc lập, liên tục sửa cùng 1 file (xem `git log`); (3) viết unit test cho 1 hành vi buộc phải mock hàng loạt dependency không liên quan (đặc biệt nặng khi có dependency hardcode, không inject, như gọi thẳng `open()`/filesystem).

**Thẻ 3.** *Làm sao biến một chuỗi `if/else` theo loại thành thiết kế tuân thủ OCP?*
Xác định phần **thay đổi theo loại** (logic riêng mỗi case) và phần **giữ nguyên** (chữ ký hàm) → phần giữ nguyên thành interface chung (`PaymentMethod.pay()`), mỗi loại thành 1 class implement interface đó, và một registry (dict/Map) tra theo loại để chọn implementation — code gọi chỉ biết interface, không biết class cụ thể.

**Thẻ 4.** *Khi nào **không nên** áp dụng OCP?*
Khi chưa có bằng chứng về biến thể lặp lại — mới có 1-2 case, ổn định lâu, "có thể thêm sau này" chỉ là dự đoán (YAGNI). Giữ `if/elif` ngắn cho tới khi biến thể thứ 3 thật sự xuất hiện, hoặc cùng dạng rẽ nhánh lặp lại ở nhiều nơi khác trong codebase.

---

## 8. Câu hỏi cuối bài

> Tự trả lời trước, rồi soát lại với phần dưới.

1. Chỉ ra một class trong project thật đang vi phạm SRP. Bạn sẽ tách nó thế nào?
2. Cần thêm một phương thức thanh toán mới mà **không sửa code cũ**. Bạn thiết kế thế nào?
3. SRP có nghĩa là "mỗi class chỉ có một method" không?
4. *(Câu bổ sung)* Code hiện chỉ có 2 phương thức thanh toán, sửa lần cuối cách đây 1 năm. PM nói "sau này có thể thêm". Bạn có dựng ngay interface + factory + registry không? Lập luận thế nào, và khi nào bạn đổi ý?

<details><summary>Đáp án</summary>

**1.** Ví dụ thật: `ImportsService` (`erp/src/modules/inventory/services/imports.service.ts`) — gần 5000 dòng, 70+ method, import cả `S3Service`, `RabbitService`, `AuditService`, `LegalEntityService`. Ít nhất 4-5 actor độc lập đang gánh chung: audit/logging, validate số lượng theo lot, resolve legal entity, tạo file export (S3), gọi message queue. Cách tách: theo actor, không theo "nhóm method nghe liên quan" — vd tách `LotValidationService` (actor: nghiệp vụ kiểm lot), `ReimportQuantityCalculator` (actor: Kế toán/Pricing tính số lượng tái nhập), giữ nguyên phần điều phối (`ImportsService`) chỉ gọi các service này. Không làm 1 lần — áp dụng Strangler Fig: mỗi khi có yêu cầu mới chạm vào actor nào, tách đúng phần đó ra trước khi thêm logic mới vào chỗ cũ.

**2.** Định nghĩa interface `PaymentMethod` với 1 method `pay(amount) -> str`; mỗi cổng thanh toán (Momo, Vnpay, ZaloPay...) implement interface này thành 1 class riêng; dùng 1 registry (dict/Map) ánh xạ tên loại → instance, đặt ở composition root; hàm gọi (`process_payment`) chỉ tra registry và gọi `handler.pay(amount)`, không biết class cụ thể. Thêm phương thức mới = thêm 1 class + 1 dòng đăng ký vào registry, không sửa interface, không sửa class cũ, không sửa hàm gọi.

**3.** Không. SRP = một **lý do để thay đổi** (một actor), không phải đếm method. Một class nhiều method vẫn đúng SRP nếu mọi method phục vụ cùng một actor/mục đích; một class chỉ 1 method vẫn có thể sai SRP nếu actor của nó mơ hồ hoặc dễ bị actor khác "mượn" sửa chung.

**4.** Chưa nên dựng ngay (YAGNI + rule of three): mới có 2 case, đã ổn định 1 năm — không có bằng chứng về trục biến đổi đang hoạt động, "có thể thêm" chỉ là dự đoán của PM, không phải cam kết cụ thể (hợp đồng đã ký, ngày go-live đã định). `if/elif` 2 nhánh vẫn dễ đọc, không tầng gián tiếp, chi phí bảo trì thấp. **Đổi ý** khi: biến thể thứ 3 thực sự được yêu cầu triển khai; hoặc cùng kiểu rẽ nhánh theo phương thức thanh toán bắt đầu lặp lại ở nhiều chỗ khác trong codebase (tính phí, gửi webhook, generate receipt...); hoặc có cam kết cụ thể từ roadmap, không phải lời nói chung chung.

</details>

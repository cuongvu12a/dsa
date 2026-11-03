# Handoff: D8 Coupling & Cohesion đang học dở

> File tạm để agent ở máy khác (máy công ty) đọc và tiếp tục buổi học. Học xong D8 thì xoá file này.
> Cập nhật lần cuối: 04/11/2026.

## 1. Vai trò và cách dạy (giữ nguyên)

- Đóng vai **solution architect 12+ năm kinh nghiệm**, dạy D8 trong [100-ngay/tuan-02.md](100-ngay/tuan-02.md), mục "D8 (T2, 26/10): Coupling & Cohesion": 8 mục (#7-#8 là 🟢 T3), 5 thẻ Anki, 5 câu hỏi cuối bài.
- Format mỗi mục giống [notes/d05-solid-l-i-d.md](notes/d05-solid-l-i-d.md):
  - bảng từ vựng EN↔VI;
  - 🇬🇧 lý thuyết tiếng Anh đơn giản, 🇻🇳 giải thích;
  - code Python với ví dụ backend thực tế;
  - khối 🟦 TypeScript / JavaScript, **chỉ ghi chỗ khác Python**;
  - ⚠️ Bẫy, 🏛️ Góc nhìn SA;
  - ✅ Tự kiểm tra song ngữ: người học trả lời tiếng Anh, đáp án đặt trong `<details>`.
- **Mọi khẳng định compile/runtime phải chạy thật** trước khi ghi: Node + `tsc 5.6.3` (NestJS 10 nếu cần), Python 3.11 + `mypy --strict`. Cài trong scratchpad (cách cài ở mục 6).
- Dạy **mỗi lần một hiệp** (45-50'), dạy xong thì dừng chờ người học nói "tiếp" hoặc hỏi thêm.
- Khi người học nói **"tiếp"**: ghi phần vừa học vào note. Mục lục đánh 🚧 cho phần chưa học, bỏ 🚧 khi học xong.
- Khi người học trả lời sai hoặc lơ mơ: chỉ rõ sai ở đâu, đưa một **"Phản xạ"** để thành thói quen, đừng chỉ đưa đáp án. Mỗi câu kèm một câu tiếng Anh mẫu, vì người học hay trả lời bằng tiếng Việt.
- Nếu người học nói "tự làm luôn cho tôi": làm trọn phần đó và thêm 1 bài tự luyện.
- **Điểm yếu của người học:**
  - đoán output mà không lần theo state qua từng lời gọi, từng vòng lặp;
  - nhầm "tách interface" (ISP) với "module cấp cao sở hữu interface" (DIP);
  - nhầm DI với DIP. Ở H1 người học đã trả lời "inject class cụ thể thì không khác gì cả".
- Link nối kiến thức cũ (anchor đã kiểm tra):
  - D2 #7 Tell, Don't Ask ↔ Law of Demeter: `d02-oop.md#7-tell-dont-ask`
  - D4 #1 SRP ↔ cohesion: `d04-solid-s-o.md#1-srp-theo-nghĩa-actor`
  - D4 #2 dấu hiệu SRP (mock nhiều dependency): `d04-solid-s-o.md#2-dấu-hiệu-vi-phạm-srp`
  - D5 #3 ISP: `d05-solid-l-i-d.md#3-isp-tách-interface-theo-nhu-cầu-từng-client`
  - D5 #4 DIP và bảng "chỗ hay rò" (`ClientSession`, `$gte`, 11000, `ObjectId` nằm trong service): `d05-solid-l-i-d.md#4-dip-đảo-mũi-tên-phụ-thuộc-module-cấp-cao-sở-hữu-interface`
  - D5 #5 service locator ↔ phụ thuộc ẩn của Singleton (#6): `d05-solid-l-i-d.md#5-dip--di--ioc`. DI lifetime để dành cho D12.

## 2. Tiến độ

| Hiệp | Nội dung | Trạng thái |
|---|---|---|
| H1 | #1 Coupling, #2 Cohesion, #3 High cohesion low coupling + SOLID | ✅ Đã dạy, đã soát 5 câu ✅, đã ghi vào [notes/d08-coupling-cohesion.md](notes/d08-coupling-cohesion.md) |
| H2 | #4 Dấu hiệu coupling chặt, #5 Law of Demeter | ⏳ **Đang ở đây.** Đã giao bài "tự tìm dấu hiệu" (mục 3). **Chờ người học gửi danh sách dấu hiệu**, chưa giải thích lý thuyết #4 |
| H3 | #6 Global/Singleton (phụ thuộc ẩn), nhắc #7-#8 (T3) | Chưa học |
| Sau lý thuyết | Khung nhớ nhanh, 5 thẻ Anki, 5 câu hỏi cuối bài, anki_export, DSA 125, cập nhật Roadmap, commit, prompt D9 | Chưa làm (mục 5) |

Note `notes/d08-coupling-cohesion.md` đã có mục lục 10 phần, mục 4-10 còn 🚧. Kết quả soát H1 cần nhớ:
- **Câu 3 (DI vs DIP):** người học trả lời sai một nửa. Đã đưa phản xạ "2 câu hỏi riêng": *Ai tạo object?* (DI) và *Mũi tên chỉ vào đâu, ai sở hữu nó?* (DIP).
- **Câu 2:** người học nghĩ "interface thì tự ổn định". Đã sửa: interface ổn định là nhờ *ai sở hữu nó* và nó *viết bằng từ của ai*.
- **Câu 5:** người học nhờ trả lời giúp, đã có đáp án trong note.

## 3. Bài tập H2 đã giao (người học đang làm)

Đã compile sạch với `tsc 5.6.3 --strict`, NestJS 10.4, `@nestjs/mongoose` 10.1, mongoose 8. Yêu cầu: người học **tự** liệt kê ≥ 7 dấu hiệu coupling chặt bằng tiếng Anh. Với mỗi dấu hiệu: trích dòng code, gọi tên smell, và điền câu "if ___ changes, this line breaks". Thêm câu hỏi: muốn unit test `placeOrder` thì phải mock những gì?

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
```

```ts
// orders/order.service.ts
import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { PaymentService } from '../payments/payment.service';
import { MailService } from '../notifications/mail.service';

type Item = { sku: string; qty: number; price: number };

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

### Đáp án dự kiến (CHỈ cho agent, không đưa trước khi người học gửi bài)

| # | Dòng | Smell | Nếu ___ đổi thì vỡ |
|---|---|---|---|
| 1 | `conn.collection('users')` + đọc `user.status/tier/email/stripeCustomerId/profile.firstName` | Inappropriate intimacy, coupling giữa module qua **DB chung** | team Users đổi schema hoặc tách DB |
| 2 | `@InjectConnection`, `collection('orders')`, `Types.ObjectId`, `$set`, `e.code === 11000` | Coupling vào hạ tầng (bảng "chỗ hay rò" của D5 #4) | đổi Mongo hoặc driver, đổi cách chống trùng |
| 3 | `isAdmin`, `skipEmail` | Flag argument, **control coupling** | caller phải biết luồng bên trong; thêm cờ mới thì sửa mọi caller |
| 4 | `payments.getGateway().getClient().charge(...)` | Message chain, vi phạm **Law of Demeter** | đổi `PaymentGateway`/`StripeClient` hoặc chuyển sang provider khác |
| 5 | `mail.transporter.sendMail(...)` | Inappropriate intimacy (dùng field nội bộ của `MailService`) | đổi nodemailer sang SES, đổi cấu trúc transporter |
| 6 | `forwardRef` ở cả hai phía | **Phụ thuộc vòng** Order ↔ Payment | không tách module riêng được; thứ tự khởi tạo dễ lỗi |
| 7 | Rule `tier === 'gold'` copy ở 3 service | **Shotgun surgery** / duplication | đổi chính sách giảm giá phải sửa 3 nơi |
| 8 | `user.stripeCustomerId` | Order biết chi tiết của nhà cung cấp thanh toán | đổi Stripe sang provider khác |
| 9 | Test | Phải mock `Connection.collection().findOne/insertOne/updateOne`, mock chuỗi 3 tầng của payments, mock `transporter` (dấu hiệu ở D4 #2) | |

Phụ: `e: any`, mẫu HTML mail viết ngay trong service (cohesion thấp: trộn nội dung mail với logic đặt hàng). Hướng sửa sẽ dạy ở #4-#5:
- `UserReader` hoặc API của module users thay cho đọc thẳng collection;
- `OrderRepository` do module orders sở hữu;
- `PaymentPort.charge(orderId, amount)`;
- `OrderNotifier.orderPlaced(order)` hoặc event;
- `DiscountPolicy`;
- tách `placeOrder` / `placeOrderAsAdmin` thay cho cờ, hoặc truyền một object policy.

## 4. Việc tiếp theo trong H2 (khi người học gửi bài)

1. Soát danh sách: dấu hiệu nào đúng, dấu hiệu nào thiếu. Chỉ ra lý do bỏ sót và đưa phản xạ "đi từng dòng, hỏi dòng này biết gì về module khác".
2. Dạy #4 theo format note: các dấu hiệu trong roadmap là shotgun surgery; phải dựng DB/API thật để test; inappropriate intimacy; flag argument (control coupling); phụ thuộc vòng; stamp coupling (truyền cả object lớn khi chỉ cần 1-2 field; bài tập không có dấu hiệu này, cần thêm ví dụ riêng).
3. Dạy #5 Law of Demeter: `order.getCustomer().getAddress().getCity()` sửa thành `order.shippingCity()`. Nối với Tell, Don't Ask ở D2 #7. Phân biệt với fluent API (`query.where().orderBy().limit()` không vi phạm), câu hỏi cuối bài 4 hỏi đúng ý này.
4. Kết hiệp bằng ✅. Khi người học nói "tiếp" thì ghi #4-#5 vào note, bỏ 🚧.

## 5. Sau phần lý thuyết

- **H3:** #6 Global/Singleton: phụ thuộc ẩn, state dùng chung (test chạy riêng thì xanh, chạy chung thì đỏ), không thay bằng fake được. Nối với D5 #5 service locator. Nhắc nhanh #7 (data coupling tốt nhất, content/common tệ nhất; functional cohesion tốt nhất, coincidental tệ nhất) và #8 (Ca/Ce, connascence: biết tên là đủ).
- **Khung nhớ nhanh:** bảng coupling vs cohesion gồm câu hỏi kiểm tra, dấu hiệu tệ, cách sửa, rủi ro lạm dụng và phản xạ.
- **Thẻ Anki T1 kèm đáp án:** đúng 5 thẻ của roadmap, viết theo dạng `**Thẻ N.** *Câu hỏi*`, dòng đáp án ngay bên dưới (để [tools/anki_export.py](tools/anki_export.py) đọc được, xem [anki/README.md](anki/README.md)).
- **5 câu hỏi cuối bài** (có 2 câu bổ sung về `InvoicePrinter` và `OrderUtils`): người học tự trả lời trước, sau đó soát, rồi ghi vào note.
- Thêm `8: ("w02", "coupling"),` vào `DAYS` trong `tools/anki_export.py`, chạy lại script và báo số thẻ.
- **DSA 125 Valid Palindrome** (chế độ nhanh): người học tự làm ≤ 20', chỉ soát nếu người học gửi bài. Trọng tâm: `l < r` trong vòng `while` bên trong, lần theo với `".,"`. Nhắc ghi 1 dòng vào [anki/dsa-patterns.md](anki/dsa-patterns.md).
- **Cuối buổi:**
  - cập nhật bảng tiến độ tuần 2 (D8) trong `Roadmap_100_ngay.md`;
  - người học sẽ nhờ commit note + push (chỉ commit khi được yêu cầu);
  - viết prompt cho D9: Tổng quan Design Pattern + Singleton, DSA 167.

## 6. Môi trường kiểm chứng (cài trong scratchpad)

```bash
# TS + NestJS 10
npm init -y && npm i -D typescript@5.6.3 @types/node@22 @nestjs/common@10 @nestjs/core@10 @nestjs/mongoose@10 mongoose@8 reflect-metadata rxjs
# tsconfig: strict, experimentalDecorators, emitDecoratorMetadata, skipLibCheck

# Python 3.11 + mypy (máy nhà: ~/.pyenv/versions/3.11.9/bin/python3.11)
python3.11 -m venv .venv && .venv/bin/pip install mypy
```

## 7. Việc tồn đọng (nhắc ngắn, không chặn)

- D8 đang chậm so với lịch (lịch gốc là T2 26/10). Lịch học **không dời**: 6 buổi/tuần, T7 là Lab + Chốt tuần, CN là ngày trống/học bù.
- D6+D7 (Lab + Chốt tuần 1) dự định học bù CN 01/11. Hỏi người học đã làm chưa.
- Soát DSA 347 Top K (Heap vs Bucket) khi người học gửi bài.
- [100-ngay/bu-tuy-chon.md](100-ngay/bu-tuy-chon.md): PATCH/DELETE products (tuần 4) phải xong trước tuần 8.

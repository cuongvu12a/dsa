# Tradeoff cheat sheet (bảng T2)

← [Tuần 1](../100-ngay/tuan-01.md)

> Mỗi bảng: 3 tiêu chí core (Use-case lý tưởng · Trade-off chính · Khi nào KHÔNG dùng) + 2 tiêu chí extension. Kèm 1 thẻ Anki "Khi nào chọn A thay vì B?".

---

## D2: Interface vs Abstract class

Nhóm: *cơ chế trừu tượng trong ngôn ngữ*. Trục chính: **mức ràng buộc** vs **tái sử dụng code**.

| Tiêu chí | Interface | Abstract class |
|---|---|---|
| Core: Use-case lý tưởng | Nhiều cài đặt khác nhau cùng một **cam kết**, cần thay thế hoặc mock, đặt ở ranh giới module/service. Vd: `PaymentGateway` (Stripe, PayPal, bản giả khi test), `NotificationSender`, `Repository` | Nhóm class **cùng vòng đời**, chỉ khác một vài bước (Template Method). Vd: `BasePayment.pay()` = validate → execute → mark PAID, mỗi loại tự viết `_execute`; `BaseReport` = load → format → save |
| Core: Trade-off chính | **Được:** linh hoạt, coupling thấp, dễ mock. **Mất:** không chia sẻ code, mỗi cài đặt tự viết lại phần chung; thêm method vào interface thì **mọi cài đặt vỡ** | **Được:** tái dùng code, khung chạy thống nhất. **Mất:** coupling cao (con gắn vào ruột cha, *fragile base class*), thường chỉ kế thừa được 1 cha, khó mock vì kéo theo state và logic của cha |
| Core: Khi nào KHÔNG dùng | Chỉ có **một** cài đặt, không bao giờ đổi, không cần mock (thừa tầng). Interface phình to nhiều method (ép cài đặt phải viết method không dùng) | Chỉ muốn **mượn code** (dùng composition). Các con không dùng gì từ cha. Đặt ở ranh giới module/service (bên ngoài bị buộc vào ruột bạn) |
| Ext: Chứa được state/implementation? | **Không** (interface thuần). Java 8+: có `default method` nhưng không có state instance. Python: `ABC` chỉ chứa `@abstractmethod`, hoặc `Protocol` | **Có**: field, constructor, method cụ thể và method abstract |
| Ext: Một class implement/kế thừa được mấy cái? | **Nhiều** (Java, C#, Go đều cho implement nhiều interface) | Java, C#: **một** cha. Python cho đa kế thừa nhưng dễ rối thứ tự tìm method (MRO), nên tránh |

**Cách chọn nhanh:** *"Mình đang cam kết hành vi (interface) hay đang chia sẻ code (abstract class)?"* Nếu cần cả hai thì tách: interface cho cam kết, class cơ sở cho code dùng chung.

**🟡 Thẻ Anki T2:** *Khi nào chọn Interface thay vì Abstract class?*
Chọn interface khi cần **cam kết hành vi** cho nhiều cài đặt khác nhau, nhất là ở ranh giới module/service hoặc cần mock khi test: linh hoạt, coupling thấp, nhưng không chia sẻ code. Chọn abstract class khi các class **cùng khung chạy** và chỉ khác vài bước, cần tái dùng code, chấp nhận coupling cao. Chỉ muốn mượn code thì dùng composition.

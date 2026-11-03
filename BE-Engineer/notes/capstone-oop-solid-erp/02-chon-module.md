# Capstone · 02 Chọn module

## Chọn module

> Hai điều chỉnh so với đề bài: (1) đường dẫn thật là `erp/backend/src/modules`; (2) ERP dùng **TypeORM + `DataSource`** (SQL), không dùng Mongo model (không có `@InjectModel`).

| Module | Quy mô | Mùi chính (file:line) | Chỗ đang làm đúng | Học được |
|---|---|---|---|---|
| **purchased-request** (đề xuất 1) | service 2060 dòng, 13 endpoint, 6 dep | ctor trộn Email/DataSource/I18n/S3/Rabbit (`purchased-request.service.ts:66-73`); dựng Excel bằng `exceljs` trong service (`:48`, `:152`, `:305`); với sang util của purchased-order (`:52-53`, `:1414`) | luật chuyển trạng thái để dạng dữ liệu (`constants/status-transitions.ts`, `:1921`); mail duyệt đã tách 1 phần (`purchased-request-approval-mail.service.ts`) | SRP theo actor, Encapsulation/state machine, DIP (2 client ngoài: `order-plan`, `nvl-alert`) |
| **purchased-order** (đề xuất 2, nâng cao) | 3879 dòng, 29 endpoint, 7 dep | rẽ nhánh theo nhà cung cấp `assertBoxesUsingBarCode` → `ViaSSA`/`ViaSanMar` (`purchased-order.service.ts:1579, 1624, 1719`), import thẳng `SanMarRequester` (`:50`); gánh duyệt email, chi phí thực tế, báo cáo chênh lệch, xuất hoá đơn (`:2510–3677`); phụ thuộc report + inventory (`:110, :112`) | đã có `ProviderAPIRequesterFactory` (`:49`), validator riêng có test | OCP + Strategy/Factory rõ nhất |
| **inventory/imports** (đề xuất 3, nặng) | 4793 dòng, 26 endpoint, 6 dep | phụ thuộc vòng với purchased-order qua `forwardRef` (`imports.service.ts:123`); luật lot/tái nhập dày đặc (`:2219–2627`); biến thể Lab bằng method song song (`:3241`, `:3513`) | `AuditService`, `Lock` tách riêng; `btp-lot-allocator` có test | DIP cắt vòng, value object Lot/Quantity |

**Khuyến nghị:** làm **purchased-request** trước (vừa sức, đủ 4 actor, có chỗ làm đúng để đối chiếu, có client ngoài để luyện DIP); purchased-order để làm bài OCP sau.

Trang HTML trực quan: [capstone.html](capstone.html).

**Đã chọn: purchased-request.**


---

← [01 Tổng kết](01-tong-ket-oop-solid.md) · [Mục lục](README.md) · [03 Hiện trạng](03-hien-trang.md) →

# Capstone: OOP + SOLID áp vào ERP (`purchased-request`)

Áp kiến thức D2–D5 (OOP, Composition vs Inheritance, SOLID) vào một module thật của ERP Merchize, ở mức **khung**, không viết logic.

> Nguồn tham chiếu: `merchize/maintain/erp/backend/src/modules/purchased-request` (chỉ đọc, không sửa). Các file ở đây chỉ dùng tên class/method, file:line và diễn giải. **Thư mục này chưa commit**: hỏi trước khi đưa lên GitHub vì có nội dung nội bộ.

## Đọc theo thứ tự

| # | File | Nội dung |
|---|---|---|
| 01 | [01-tong-ket-oop-solid.md](01-tong-ket-oop-solid.md) | Bảng nguyên lý → câu hỏi kiểm tra → dấu hiệu vi phạm → công cụ sửa; sơ đồ nối các nguyên lý |
| 02 | [02-chon-module.md](02-chon-module.md) | So sánh 3 module ứng viên, lý do chọn `purchased-request` |
| 03 | [03-hien-trang.md](03-hien-trang.md) | Nghiệp vụ, 8 actor, sơ đồ phụ thuộc hiện tại, bảng vi phạm có file:line, chỗ đang làm đúng |
| 04 | [04-hexagonal-co-ban.md](04-hexagonal-co-ban.md) | **Khái niệm, không framework:** domain gồm gì (entity, value object, aggregate, event, error…), port là interface và adapter là class cài đặt, khi nào bỏ qua port, use case ứng với gì, nhiều module YCMH → PO → PN → PX → Tồn kho nói chuyện thế nào, flow chạy vs flow phụ thuộc, DIP áp cho mũi tên nào |
| 05 | [05-hexagonal-trong-nestjs.md](05-hexagonal-trong-nestjs.md) | Áp vào NestJS: token, provider, module; trách nhiệm từng thư mục; vòng đời request trong ERP (middleware → guard → interceptor → pipe → handler) |
| 06 | [06-thiet-ke-lai.md](06-thiet-ke-lai.md) | Thiết kế lại: cây thư mục, link từng file khung, sơ đồ trước/sau, bảng ánh xạ, quyết định tách, Strangler Fig |
| 07 | *(sắp có)* | Câu hỏi phỏng vấn system design dựa trên module này |

Bản trực quan (mọi phần trên một trang, có sơ đồ): [capstone.html](capstone.html), cũng được publish dạng Artifact riêng tư.

## Ghi chú

- Bộ khung code (49 file `.ts`, stub, tsconfig, script kiểm Dependency Rule) và script dựng HTML đã được xoá ngày 2026-11-03 sau khi học xong. Thiết kế vẫn mô tả đủ trong [06-thiet-ke-lai.md](06-thiet-ke-lai.md): cây thư mục, từng file và trách nhiệm, sơ đồ trước/sau, bảng ánh xạ.
- Phần viết code áp dụng sẽ làm ở các buổi lab.
- Nếu cần xem lại code khung: bản Artifact **version 6** của `capstone.html` vẫn còn mục "Duyệt code" (xem lịch sử phiên bản trên claude.ai).

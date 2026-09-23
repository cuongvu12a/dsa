# Tuần 4 (19/10 – 25/10): Linked List, HTTP, REST API Design, Auth

[← Tuần 3](tuan-03.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 5 →](tuan-05.md)

**Mục tiêu tuần:** Thiết kế được một REST API đúng chuẩn. Hiểu HTTP, xác thực và phân quyền. Bắt đầu dự án xuyên suốt *Mini Order Service*. Cuối tuần chốt lại toàn bộ Giai đoạn 1.

> Cách học theo Tier (T1 → Anki, T2 → bảng so sánh, T3 → chỉ tra cứu): xem lại bảng [Cách học theo Tier ở Tuần 1](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Học đến đâu thì dừng theo cột *Cần nắm tới mức nào*.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Ngữ nghĩa HTTP method (safe / idempotent), PUT vs PATCH vs POST, các nhóm status code và các cặp hay nhầm (401/403, 400/422, 502/503/504), stateless và cách duy trì đăng nhập, vì sao offset chậm và lệch dữ liệu, định nghĩa idempotency, "timeout ≠ thất bại", breaking vs non-breaking change, AuthN vs AuthZ, JWT được *ký* chứ không *mã hoá*, vì sao JWT khó thu hồi, băm mật khẩu phải chậm + có salt, OAuth2 là uỷ quyền (OIDC mới là xác thực), CORS là cơ chế của *trình duyệt* (không bảo vệ server, không chống CSRF), SQL injection + parameterized query, N+1 và DataLoader, các pattern DSA: Linked List (dummy node, đảo list, fast/slow pointer), HashMap + Doubly Linked List (LRU) | HTTP/1.1 vs HTTP/2 vs HTTP/3, checklist thiết kế REST (đặt tên, filter/sort), Offset vs Cursor pagination, checklist Idempotency-Key, nơi lưu idempotency key (DB vs Redis), versioning qua URL vs header vs query, Session vs JWT, lưu token ở cookie HttpOnly vs localStorage, thuật toán băm mật khẩu (Argon2id / bcrypt / scrypt / PBKDF2), chọn grant type OAuth2, REST vs gRPC vs GraphQL, eager loading JOIN vs batch `IN` | Danh sách status code hiếm, chi tiết TLS handshake, các header CORS phụ (`Access-Control-Max-Age`, `Access-Control-Expose-Headers`), cú pháp Problem Details (RFC 9457), header `Sunset`/`Deprecation`, tham số cost của bcrypt/Argon2, tham số chi tiết của OAuth2 (`state`, `code_verifier`...), cú pháp `.proto`, 4 kiểu streaming của gRPC, API DataLoader, `LinkedHashMap` / `OrderedDict`, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D22 (T2) – HTTP | 42' | 85' | 2h07' |
| D23 (T3) – REST & Pagination | 42' | 75' | 1h57' |
| D24 (T4) – Idempotency & Versioning | 42' | 82' | 2h04' |
| D25 (T5) – Auth | 57' | 87' | 2h24' |
| D26 (T6) – REST/gRPC/GraphQL + N+1 | 62' | 85' | 2h27' |
| D27 (T7) – Lab | — | 4h00' | 4h00' |
| D28 (CN) – Chốt tuần + Chốt GĐ1 | — | 2h50' | 2h50' |

**Tổng tuần: 17h49'**

Ngày nặng nhất là **D27 (Lab 4h00', chạm trần Thứ Bảy)**; để các buổi tối không vượt 90', tuần này đã dời bảng T2 *Versioning* (D24) và *Cookie vs localStorage* (D25) sang D28, chuyển bảng *Argon2id vs bcrypt…* thành tuỳ chọn, và gộp bảng *JOIN vs batch `IN`* (D26) vào bảng giống hệt ở D39 Tuần 6.

---

## D22 (T2, 19/10): HTTP

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 85' (Học 50' + Bảng T2 10' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h07'**

### 🧩 DSA: [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)

- **Pattern (🔴 T1):** *Đảo con trỏ trên Linked List*. Ba biến `prev`, `curr`, `next`. Đây là "viên gạch" của rất nhiều bài linked list (143, 25, 234).
- **Các cách:**
  1. Lặp: lưu `next = curr.next` → `curr.next = prev` → `prev = curr` → `curr = next` → O(n) thời gian, O(1) bộ nhớ.
  2. Đệ quy: đảo phần còn lại rồi `head.next.next = head; head.next = null` → O(n) thời gian, O(n) bộ nhớ cho call stack.
- **Lỗi hay gặp:** gán `curr.next = prev` trước khi lưu `next` → mất phần còn lại của list. Hãy vẽ 3 node ra giấy và di chuyển từng mũi tên.
- **Câu hỏi hay gặp:** "cách đệ quy có tốt hơn không?" → Không, tốn O(n) stack và có thể stack overflow với list rất dài.

### 📘 Bài học buổi tối: HTTP (method, status code, header, stateless, HTTP/1.1 vs HTTP/2)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Cấu trúc request/response: start line, header, body | 🔴 T1 | Viết tay được một request `POST` và response `201` dạng thô | `http request response structure` |
| 2 | Ngữ nghĩa method: **safe** (không đổi state) và **idempotent** (gọi N lần = gọi 1 lần) | 🔴 T1 | Điền đúng bảng method bên dưới | `http methods safe idempotent`, `RFC 9110 methods` |
| 3 | **PUT vs PATCH vs POST** | 🔴 T1 | Nói được: PUT thay thế toàn bộ, PATCH sửa một phần, POST tạo mới / hành động không idempotent | `put vs patch vs post` |
| 4 | Các nhóm status code 1xx–5xx + các mã phải thuộc | 🔴 T1 | Thuộc các mã trong bảng bên dưới | `http status codes explained` |
| 5 | Các cặp hay nhầm: 401/403, 400/422, 502/503/504 | 🔴 T1 | Phân biệt được, có ví dụ | `401 vs 403`, `400 vs 422`, `502 vs 503 vs 504` |
| 6 | Header quan trọng: `Content-Type`, `Accept`, `Authorization`, `Cache-Control`, `ETag` / `If-None-Match`, `Location`, `Retry-After`, `Cookie` / `Set-Cookie` | 🔴 T1 | Biết mỗi header dùng để làm gì | `important http headers backend` |
| 7 | **Stateless**: mỗi request phải tự mang đủ thông tin; server "nhớ" bạn bằng cookie session hoặc token | 🔴 T1 | Giải thích được luồng cookie session từ lúc login | `http stateless session cookie` |
| 8 | Persistent connection (keep-alive) | 🔴 T1 | Biết vì sao tái sử dụng kết nối TCP giúp giảm độ trễ | `http keep alive` |
| 9 | **HTTP/1.1 vs HTTP/2 vs HTTP/3** | 🟡 T2 | Điền bảng; nói được multiplexing và head-of-line blocking | `http1.1 vs http2 vs http3`, `head of line blocking` |
| 10 | Danh sách đầy đủ status code, chi tiết TLS handshake | 🟢 T3 | Tra MDN khi cần | MDN |
| 11 | **CORS cơ bản**: *same-origin policy* của trình duyệt; server cho phép bằng `Access-Control-Allow-Origin` (+ `-Methods`, `-Headers`, `-Credentials`); request "không đơn giản" (có `Authorization`, `Content-Type: application/json`, method `PUT/DELETE`) sẽ có **preflight `OPTIONS`** | 🔴 T1 | Nói được 3 ý: (1) CORS do **trình duyệt** thực thi, curl/Postman/server khác bỏ qua → không phải lớp bảo vệ API; (2) không dùng `*` khi gửi kèm cookie (`credentials`); (3) CORS **không chống CSRF** (form submit đơn giản vẫn đi, chỉ là JS không đọc được response) | `cors preflight explained`, `cors vs csrf` |

**Chi tiết cần hiểu**

- **Bảng method (mục 2):**

  | Method | Safe | Idempotent | Dùng cho |
  |---|---|---|---|
  | GET, HEAD | ✅ | ✅ | Đọc |
  | OPTIONS | ✅ | ✅ | Hỏi khả năng (CORS preflight) |
  | PUT | ❌ | ✅ | Thay thế toàn bộ resource (hoặc tạo tại URI client chọn) |
  | DELETE | ❌ | ✅ | Xoá |
  | POST | ❌ | ❌ | Tạo mới, hành động |
  | PATCH | ❌ | ❌ *(không được đảm bảo)* | Sửa một phần |

  - Idempotent nói về **trạng thái trên server**, không nói về response. `DELETE /orders/1` lần hai có thể trả `404`, nhưng state không đổi thêm → vẫn idempotent.
  - PATCH *có thể* idempotent (`{"status": "cancelled"}`), nhưng không bắt buộc (`{"op": "add", "path": "/items/-", ...}` gọi hai lần thêm hai item, hoặc "tăng số lượng lên 1").
- **Status code phải thuộc (mục 4):**

  | Mã | Ý nghĩa | Khi dùng |
  |---|---|---|
  | 200 OK | Thành công | GET, PATCH/PUT trả body |
  | 201 Created | Đã tạo | POST tạo mới, kèm header `Location` trỏ tới resource mới |
  | 202 Accepted | Đã nhận, xử lý sau | Tác vụ bất đồng bộ |
  | 204 No Content | Thành công, không có body | DELETE, PUT không trả body |
  | 301 / 302 / 304 | Chuyển hướng vĩnh viễn / tạm thời / chưa thay đổi (dùng với cache, `ETag`) | |
  | 400 Bad Request | Request sai định dạng, không parse được, thiếu field bắt buộc | |
  | 401 Unauthorized | **Chưa xác thực** hoặc token sai/hết hạn (tên gọi gây nhầm) | Kèm `WWW-Authenticate` |
  | 403 Forbidden | **Đã biết bạn là ai nhưng không có quyền** | |
  | 404 Not Found | Không tồn tại (hoặc cố tình giấu sự tồn tại) | |
  | 409 Conflict | Xung đột với trạng thái hiện tại | Email đã tồn tại, huỷ đơn đã giao |
  | 422 Unprocessable Content | Đúng cú pháp nhưng **sai ngữ nghĩa** | `quantity = -5`, ngày kết thúc trước ngày bắt đầu |
  | 429 Too Many Requests | Bị rate limit | Kèm `Retry-After` |
  | 500 Internal Server Error | Lỗi không lường trước ở server | |
  | 502 Bad Gateway | Proxy/gateway nhận **response không hợp lệ** từ upstream (upstream chết, trả rác, đóng kết nối) | |
  | 503 Service Unavailable | Server **tạm thời** không phục vụ (quá tải, bảo trì) | Kèm `Retry-After` |
  | 504 Gateway Timeout | Proxy/gateway **chờ upstream quá lâu** | |

  - 400 và 422: nhiều API dùng luôn 400 cho mọi lỗi validate. Cả hai đều chấp nhận được, miễn là **nhất quán** trong toàn bộ API. Khi phỏng vấn, nói được sự khác biệt là đủ.
- **Server "nhớ" bạn thế nào (mục 7):** login thành công → server tạo session (lưu ở Redis/DB) và trả `Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax`. Mọi request sau, trình duyệt tự gửi `Cookie: sid=...`, server tra session. Với token (JWT), client tự gửi `Authorization: Bearer <token>`. Dù cách nào, **chính request mang thông tin trạng thái**, server không nhớ kết nối.
- **HTTP/1.1 vs HTTP/2 (mục 9):** HTTP/1.1 mỗi kết nối xử lý tuần tự từng request, nên trình duyệt mở nhiều kết nối song song tới một host (thường ~6). HTTP/2 dùng *binary framing*, **multiplexing** nhiều stream trên một kết nối TCP, nén header (HPACK). Nhưng HTTP/2 vẫn bị head-of-line blocking ở tầng TCP: mất một gói thì mọi stream cùng chờ. HTTP/3 chạy trên QUIC (UDP) để giải quyết điều này.

**🟡 Bảng so sánh T2: HTTP/1.1 vs HTTP/2 vs HTTP/3**

Nhóm: *protocol*. Trục chính: **hiệu năng trên một kết nối** vs **độ phức tạp / mức hỗ trợ của hạ tầng**.

| Tiêu chí | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Multiplexing / số kết nối | | | |
| Ext: Head-of-line blocking (tầng ứng dụng / tầng transport) | | | |
| Ext: Transport + nén header | | | |

**🔴 Thẻ Anki (T1)**

1. Safe và idempotent khác nhau thế nào? Method nào thuộc loại nào?
2. PUT, PATCH, POST khác nhau thế nào? PATCH có idempotent không?
3. `DELETE` lần hai trả 404 thì còn idempotent không? Vì sao?
4. 401 khác 403 thế nào?
5. 400 khác 422 thế nào?
6. 502, 503, 504 khác nhau thế nào? Mã nào nên kèm `Retry-After`?
7. HTTP stateless, vậy server "nhớ" user đã đăng nhập bằng cách nào?
8. HTTP/2 cải thiện gì so với HTTP/1.1? Nó còn vấn đề gì mà HTTP/3 giải quyết?
9. *(DSA-Pattern)* Đảo linked list: cần mấy con trỏ, thứ tự gán thế nào?
10. Vì sao Postman gọi được API mà trình duyệt báo lỗi CORS? CORS có chống CSRF không?

**🟢 Tra cứu (T3):** MDN *HTTP response status codes*, MDN *HTTP headers*. RFC 9110 (*HTTP Semantics*) khi cần định nghĩa chính xác.

**Tài liệu:**
- MDN Web Docs: *An overview of HTTP*, *HTTP request methods*, *HTTP response status codes*
- Hussein Nasser (YouTube): các video về HTTP/1.1 vs HTTP/2 vs HTTP/3

**❓ Câu hỏi cuối bài**

1. PUT, PATCH, POST khác nhau thế nào?
2. Phân biệt 401 và 403, 400 và 422, 502 / 503 / 504.
3. HTTP là stateless. Vậy làm sao server "nhớ" là bạn đã đăng nhập?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Client bị timeout khi gọi `POST /orders` và khi gọi `PUT /orders/5/address`. Tự động retry cái nào thì an toàn, vì sao? `DELETE /orders/5` lần hai trả `404` thì còn idempotent không?
5. SPA ở `https://shop.com` gọi `https://api.shop.com/orders` (gửi header `Authorization`) bị trình duyệt chặn vì CORS, nhưng Postman gọi được. Vì sao? Sửa ở phía nào, bằng header gì? Bật CORS "chặt" có giúp API chống bị gọi trái phép không?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- PUT: thay thế **toàn bộ** resource tại URI đã biết, idempotent.
- PATCH: sửa **một phần**, không được đảm bảo idempotent (ví dụ "tăng số lượng lên 1").
- POST: tạo mới (server chọn id, trả `201` + `Location`) hoặc hành động; không idempotent.

**Câu 2.**
- 401 = chưa xác thực / token sai hoặc hết hạn; 403 = biết bạn là ai nhưng không có quyền.
- 400 = request sai định dạng, không parse được; 422 = đúng cú pháp nhưng sai ngữ nghĩa (`quantity = -5`). Quan trọng là dùng nhất quán.
- 502 = upstream trả response hỏng; 503 = server tạm thời không phục vụ (kèm `Retry-After`); 504 = gateway chờ upstream quá lâu.

**Câu 3.**
- Server không nhớ kết nối; **mỗi request tự mang** thông tin trạng thái.
- Session: login → server lưu session (Redis/DB) → `Set-Cookie: sid=...; HttpOnly; Secure; SameSite` → trình duyệt tự gửi `Cookie` → server tra session.
- Token: client gửi `Authorization: Bearer <JWT>`, server verify chữ ký, không cần tra store.

**Câu 4.**
- `PUT` idempotent → gọi lại cho cùng kết quả trên server → retry an toàn. `POST` không idempotent → retry có thể tạo đơn thứ hai (cần `Idempotency-Key`, D24).
- Idempotent nói về **trạng thái server**, không nói về response: `DELETE` lần hai trả `404` nhưng state không đổi thêm → vẫn idempotent.

**Câu 5.**
- Same-origin policy là luật của **trình duyệt**; Postman/curl không áp dụng. Request có `Authorization` là "không đơn giản" → trình duyệt gửi preflight `OPTIONS` trước.
- Sửa ở **server API**: trả `Access-Control-Allow-Origin: https://shop.com`, `Access-Control-Allow-Headers: Authorization, Content-Type`, `Access-Control-Allow-Methods`; nếu gửi cookie thì thêm `Allow-Credentials: true` và **không** dùng `*`.
- CORS không chặn được kẻ gọi API bằng script/curl và không chống CSRF → vẫn cần xác thực, phân quyền, CSRF token/`SameSite`.

</details>

---

## D23 (T3, 20/10): Thiết kế REST & Pagination

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 75' (Học 40' + Bảng T2 10' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 1h57'**

### 🧩 DSA: [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)

- **Pattern (🔴 T1):** *Dummy node + con trỏ tail*. Tạo một node giả làm đầu list kết quả để không phải xử lý riêng trường hợp "list kết quả đang rỗng".
- **Các cách:**
  1. Lặp với dummy: so sánh hai đầu, nối node nhỏ hơn vào `tail`, cuối cùng nối phần còn lại → O(n + m) thời gian, O(1) bộ nhớ.
  2. Đệ quy → O(n + m) thời gian, O(n + m) bộ nhớ stack.
- **Lưu ý:** khi một list hết, **nối thẳng phần còn lại** của list kia, không cần duyệt tiếp. Trả về `dummy.next`, không phải `dummy`.
- **Liên hệ:** đây chính là bước "merge" của merge sort, và là nền cho bài 23 *Merge k Sorted Lists* (dùng heap, Tuần 6).

### 📘 Bài học buổi tối: Thiết kế REST (đặt tên resource, filter/sort, pagination offset vs cursor)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Checklist đặt tên resource: danh từ số nhiều, phân cấp theo quan hệ sở hữu, không dùng động từ, chữ thường | 🟡 T2 | Tự kiểm được 10 endpoint mẫu (xem chi tiết) | `REST resource naming best practices` |
| 2 | Hành động không phải CRUD: `POST /orders/{id}/cancel` | 🟡 T2 | Biết đây là cách chấp nhận được, và khi nào dùng `PATCH status` thay thế | `REST custom actions non CRUD` |
| 3 | Checklist filter / sort / chọn field: `?status=paid&sort=-created_at&fields=id,total` | 🟡 T2 | Thiết kế được query string cho một danh sách | `REST API filtering sorting` |
| 4 | Vì sao **offset chậm dần** ở trang sâu | 🔴 T1 | Giải thích được: DB vẫn phải đọc và bỏ đi `OFFSET` dòng đầu | `offset pagination performance` |
| 5 | Vì sao offset **trùng/sót bản ghi** khi dữ liệu thay đổi | 🔴 T1 | Vẽ được ví dụ: có dòng mới chèn lên đầu → trang 2 lặp lại dòng cuối trang 1 | `offset pagination duplicate records` |
| 6 | **Cursor (keyset) pagination**: `WHERE (created_at, id) < (:c_created_at, :c_id) ORDER BY created_at DESC, id DESC LIMIT n` | 🔴 T1 | Viết được câu SQL; biết cần **cột phụ duy nhất** (`id`) để phân định khi trùng `created_at`, và cần index khớp thứ tự sort | `keyset pagination`, `cursor pagination SQL` |
| 7 | **Offset vs Cursor pagination** | 🟡 T2 | Điền bảng | `offset vs cursor pagination` |
| 8 | Hình dạng response danh sách: `{ data: [...], next_cursor: "..." }` hoặc `nextLink`; cursor là chuỗi **opaque** (ví dụ base64) | 🟡 T2 | Thiết kế được response có phân trang | `opaque cursor pagination`, `microsoft rest api guidelines nextLink` |
| 9 | Định dạng lỗi chuẩn: Problem Details (RFC 9457, thay RFC 7807) | 🟢 T3 | Biết tồn tại, dùng làm mẫu cho lỗi | `RFC 9457 problem details` |

**Chi tiết cần hiểu**

- **Checklist đặt tên (mục 1):**

  | ❌ Tránh | ✅ Nên |
  |---|---|
  | `GET /getOrders` | `GET /orders` |
  | `POST /createOrder` | `POST /orders` |
  | `GET /order/5` | `GET /orders/5` |
  | `GET /orders/5/getItems` | `GET /orders/5/items` |
  | `POST /orders/5/delete` | `DELETE /orders/5` |

  - Lồng tối đa 1–2 cấp: `/users/{id}/orders` được, `/users/{id}/orders/{oid}/items/{iid}/reviews` là quá sâu.
- **Offset chậm (mục 4):** `LIMIT 20 OFFSET 100000` → DB đọc 100.020 dòng theo thứ tự sort, bỏ 100.000 dòng đầu, trả 20. Chi phí tăng tuyến tính theo số trang. Cursor với index phù hợp thì "nhảy" thẳng tới vị trí qua index, chi phí gần như không đổi dù ở trang nào.
- **Offset lệch dữ liệu (mục 5):** đang xem trang 1 (dòng 1–20, sắp xếp mới nhất trước). Có 1 đơn mới được tạo. Mở trang 2 (`OFFSET 20`): mọi dòng bị đẩy xuống 1 vị trí, dòng 20 cũ giờ ở vị trí 21 → **xuất hiện lại**. Nếu có dòng bị xoá thì ngược lại: một dòng bị **bỏ sót**.
- **Lưu ý cú pháp so sánh bộ giá trị (mục 6):** `(created_at, id) < (x, y)` chỉ đúng khi **mọi cột sort cùng chiều** (cùng `DESC` hoặc cùng `ASC`). Sort trộn chiều (ví dụ `status ASC, created_at DESC`) phải viết tách: `status > :s OR (status = :s AND created_at < :c)`. Postgres dùng được index cho cú pháp bộ giá trị; một số DB khác (MySQL cũ) dùng index kém hơn → viết dạng `OR` tách.
- **Nhược điểm của cursor:** không nhảy thẳng tới "trang 57"; khó hiện "tổng số trang"; đổi kiểu sort thì phải đổi cursor. Phù hợp với infinite scroll, feed, API cho máy đọc. Offset vẫn ổn cho trang admin ít dữ liệu, cần số trang.
- **Tổng số bản ghi (`total`)** cần `COUNT(*)`, rất tốn với bảng lớn. Chỉ trả khi thật sự cần.
- **Thiết kế cho câu hỏi 2:** `GET /users/{userId}/orders?status=paid&sort=-created_at&limit=20&cursor=...`. Nếu là user tự xem đơn của mình, dùng `GET /me/orders?...` hoặc `GET /orders?...` và lấy `userId` từ token, **đừng tin** `userId` do client gửi. Nếu là admin xem đơn của người khác, cần kiểm tra quyền.

**🟡 Bảng so sánh T2: Offset vs Cursor pagination**

Nhóm: *protocol/API design*. Trục chính: **tiện cho người dùng (nhảy trang, tổng số)** vs **hiệu năng và độ chính xác khi dữ liệu lớn/thay đổi**.

| Tiêu chí | Offset (`?page=&size=`) | Cursor / Keyset (`?cursor=&limit=`) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Hiệu năng ở trang sâu | | |
| Ext: Trùng/sót khi có insert/delete | | |
| Ext: Nhảy tới trang bất kỳ / hiển thị tổng số trang | | |

**🔴 Thẻ Anki (T1)**

1. Vì sao `OFFSET 100000` chậm dù chỉ lấy 20 dòng?
2. Khi có bản ghi mới chèn vào, offset pagination bị lỗi gì? Vẽ ví dụ.
3. Viết câu SQL keyset pagination theo `created_at DESC`. Vì sao cần thêm `id`?
4. Cursor pagination cần index nào?
5. Vì sao không nên tin `userId` do client gửi trong endpoint "đơn hàng của tôi"?

**Tài liệu:**
- Microsoft REST API Guidelines (GitHub `microsoft/api-guidelines`): phần *collections*, *filtering*, *pagination*
- use-the-index-luke.com: *Paging Through Results* (phần "fetch next page")

**❓ Câu hỏi cuối bài**

1. Vì sao phân trang bằng offset chậm dần ở các trang sâu? Cursor giải quyết thế nào?
2. Thiết kế endpoint lấy đơn hàng của một user, lọc theo trạng thái, sắp xếp theo ngày.
3. Khi dữ liệu mới được thêm liên tục, phân trang offset bị lỗi gì (trùng hoặc sót bản ghi)?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Đồng nghiệp viết cursor chỉ dựa trên `created_at`: `WHERE created_at < :c ORDER BY created_at DESC LIMIT 20`. Khi có nhiều đơn tạo cùng một mili giây (import hàng loạt), chuyện gì xảy ra? Sửa câu SQL và nói cần index nào.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- `OFFSET N` buộc DB **đọc rồi bỏ** N dòng đầu theo thứ tự sort → chi phí tăng tuyến tính theo độ sâu trang.
- Cursor/keyset: nhớ giá trị sort của dòng cuối trang trước, `WHERE (created_at, id) < (...)` → index "nhảy" thẳng tới vị trí, chi phí gần như không đổi.
- Đổi lại: không nhảy tới trang bất kỳ, khó hiện tổng số trang.

**Câu 2.**
- `GET /users/{userId}/orders?status=paid&sort=-created_at&limit=20&cursor=...` (admin), hoặc `GET /me/orders?...` với `userId` lấy từ token (user tự xem).
- Response `{ data: [...], next_cursor }`, cursor là chuỗi opaque; không tin `userId` do client gửi.
- Index hỗ trợ: `(user_id, created_at DESC, id DESC)` (thêm `status` nếu luôn lọc theo nó).

**Câu 3.**
- Dữ liệu mới chèn lên đầu → mọi dòng bị đẩy xuống → trang sau **lặp lại** dòng cuối trang trước.
- Có dòng bị xoá → mọi dòng bị kéo lên → **sót** một dòng.
- Keyset không bị vì nó bám vào giá trị, không bám vào vị trí.

**Câu 4.**
- Các dòng trùng `created_at` ở ranh giới trang bị **bỏ sót** (dùng `<`) hoặc **lặp lại** (dùng `<=`).
- Thêm cột duy nhất phá thế hoà: `WHERE (created_at, id) < (:c, :id) ORDER BY created_at DESC, id DESC`; cursor mã hoá cả hai giá trị.
- Index khớp thứ tự sort: `(created_at DESC, id DESC)`, hoặc `(user_id, created_at DESC, id DESC)` nếu lọc theo user.

</details>

---

## D24 (T4, 21/10): Idempotency & Versioning

**⏱ Ước tính:** Giờ làm 42' (DSA 30' + Anki 12') · Tối 82' (Học 45' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h04'**

> Tối nay chỉ điền bảng *DB vs Redis cho idempotency key*. Bảng *Versioning URL vs Header vs Query* **dời sang D28 (CN)** để buổi tối không vượt 90'.

### 🧩 DSA: [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

- **Pattern (🔴 T1):** *Fast/slow pointer (Floyd, "rùa và thỏ")*. `slow` đi 1 bước, `fast` đi 2 bước. Có chu trình thì hai con trỏ chắc chắn gặp nhau; không có thì `fast` chạm `null`.
- **Các cách:**
  1. HashSet lưu các node đã thăm → O(n) thời gian, O(n) bộ nhớ.
  2. Floyd → O(n) thời gian, O(1) bộ nhớ.
- **Key insight:** vì sao chắc chắn gặp nhau? Khi cả hai đã vào vòng, mỗi bước khoảng cách giữa `fast` và `slow` giảm đúng 1, nên không thể "nhảy qua" nhau.
- **Lưu ý:** điều kiện vòng lặp là `fast != null && fast.next != null`. So sánh **node** (tham chiếu), không so sánh giá trị.
- **Mở rộng hay gặp:** bài 142, tìm node bắt đầu chu trình (sau khi gặp, đưa một con trỏ về `head` rồi cho cả hai đi 1 bước).

### 📘 Bài học buổi tối: Idempotency & Versioning

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Định nghĩa idempotency, và method nào idempotent theo chuẩn HTTP | 🔴 T1 | Nhắc lại bảng method của D22 không cần nhìn | `idempotent http methods` |
| 2 | **"Timeout ≠ thất bại"**: client không phân biệt được "request chưa tới server" với "đã xử lý xong nhưng mất response" → phải retry → retry phải an toàn | 🔴 T1 | Kể được kịch bản bấm "Thanh toán" hai lần / retry sau timeout | `why idempotency matters retries` |
| 3 | Làm POST thành an toàn khi retry bằng **`Idempotency-Key`** | 🟡 T2 | Tự đi hết checklist thiết kế bên dưới | `stripe idempotent requests`, `idempotency key design` |
| 4 | Các ca biên: cùng key + cùng body / cùng key + body khác / hai request cùng key chạy đồng thời / key hết hạn | 🟡 T2 | Biết cách xử lý và status code cho từng ca | `IETF idempotency-key header draft` |
| 5 | **Nơi lưu idempotency key: DB (unique constraint) vs Redis (`SET NX` + TTL)** | 🟡 T2 | Điền bảng | `idempotency key postgres unique constraint`, `redis set nx idempotency` |
| 6 | **Breaking vs non-breaking change** | 🔴 T1 | Phân loại đúng: thêm field tuỳ chọn (không breaking), xoá/đổi tên field, đổi kiểu dữ liệu, thêm field bắt buộc ở request (breaking) | `api breaking changes examples` |
| 7 | **Versioning qua URL vs header vs query param** | 🟡 T2 | Điền bảng | `api versioning url vs header` |
| 8 | Chính sách deprecate: thông báo trước, header `Deprecation` / `Sunset` (RFC 8594) | 🟢 T3 | Biết tồn tại | `sunset header RFC 8594` |

**Chi tiết cần hiểu**

- **Idempotent không có nghĩa là "response giống nhau"** mà là "tác động lên server giống nhau". Với `Idempotency-Key`, ta làm thêm một bước: trả lại **đúng response đã lưu** cho lần retry, để client nhận kết quả như lần đầu.
- **Checklist thiết kế `Idempotency-Key` cho `POST /orders` (mục 3–4):**
  1. **Client** sinh key (UUID v4) cho **mỗi thao tác logic** (một lần bấm "Đặt hàng"), và dùng **lại đúng key đó** khi retry. Bấm lần hai do mạng chậm → vẫn cùng key.
  2. **Server** lưu bản ghi `(scope = user_id, key, request_hash, status, response_code, response_body, created_at)` với **unique** trên `(user_id, key)`. Scope theo user để key của người này không đụng key người khác.
  3. Request đến → **chèn nguyên tử** bản ghi `status = processing`. Chèn thành công nghĩa là "tôi là request đầu tiên" → xử lý nghiệp vụ → lưu response → `status = completed`.
  4. Chèn thất bại vì trùng key:
     - `completed` + cùng `request_hash` → trả lại **response đã lưu** (cùng status code, cùng body). Không xử lý lại.
     - Khác `request_hash` → lỗi (bản nháp IETF gợi ý `422`; Stripe trả lỗi idempotency). Client đang dùng sai key.
     - Đang `processing` → `409 Conflict` (bản nháp IETF gợi ý), client thử lại sau.
  5. Thiếu key ở endpoint bắt buộc → `400`.
  6. Key có **thời hạn** (Stripe: có thể bị xoá sau ít nhất 24 giờ). Dọn bằng job hoặc TTL.
  7. **Quan trọng nhất:** nếu được, ghi bản ghi key và ghi đơn hàng trong **cùng một transaction DB**. Nếu ghi đơn thành công mà chưa kịp đánh dấu key `completed` rồi crash, lần retry sẽ tạo đơn thứ hai.
  8. Nếu nghiệp vụ gọi ra ngoài (cổng thanh toán), truyền tiếp một idempotency key **cho nhà cung cấp đó**. Transaction DB của bạn không bao được lời gọi mạng ra ngoài.
- **Ghi chú Tier:** Roadmap gốc xếp "REST API design (idempotency, versioning, pagination)" vào T2 dạng checklist, nên thiết kế `Idempotency-Key` là T2. Nhưng *lý do cần idempotency* (mục 2) là T1, và sẽ quay lại ở Tuần 11 dưới dạng "at-least-once + consumer idempotent".
- **Versioning (mục 7):**
  - URL: `/v1/orders`. Dễ thấy, dễ test bằng trình duyệt/curl, dễ route ở gateway, cache theo URL tự nhiên.
  - Header: `Accept: application/vnd.myshop.v2+json` hoặc header riêng như `Api-Version: 2`. URL gọn, nhưng khó test tay hơn và cache phải để ý header `Vary`.
  - Query: `?api-version=2024-10-01` (Microsoft dùng kiểu này).
  - Stripe versioning theo **ngày** qua header `Stripe-Version`, và gắn version mặc định cho từng tài khoản.
  - Chỉ tăng version khi có **breaking change**. Thay đổi không breaking thì thêm vào version hiện tại.

**🟡 Bảng so sánh T2: Nơi lưu idempotency key, DB vs Redis**

Nhóm: *data storage*. Trục chính: **tính đúng đắn (cùng transaction với nghiệp vụ)** vs **tốc độ và tiện dọn dẹp**.

| Tiêu chí | Bảng trong DB chính (unique constraint) | Redis (`SET key NX EX ttl`) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Ghi cùng transaction với đơn hàng được không? | | |
| Ext: Dọn key hết hạn | | |
| Ext: Rủi ro mất key khi hạ tầng gặp sự cố | | |

**🟡 Bảng so sánh T2: Versioning qua URL vs Header vs Query param** *(điền ở D28 – CN; tối nay chỉ cần đọc phần "Versioning" ở trên)*

Nhóm: *protocol/API design*. Trục chính: **dễ thấy, dễ dùng** vs **URL "sạch", đúng tinh thần REST**.

| Tiêu chí | URL (`/v1/`) | Header (`Accept` / `Api-Version`) | Query (`?api-version=`) |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Caching behavior (CDN, `Vary`) | | | |
| Ext: Dễ test bằng trình duyệt/curl | | | |
| Ext: Route ở gateway | | | |

**🔴 Thẻ Anki (T1)**

1. Idempotent nghĩa là gì? Có phải "response giống nhau" không?
2. Vì sao client không thể biết một request timeout đã được xử lý hay chưa? Hệ quả?
3. Kể 3 thay đổi breaking và 2 thay đổi không breaking trong API.
4. *(Thẻ T2)* Idempotency-Key: xử lý thế nào khi (a) cùng key cùng body, (b) cùng key khác body, (c) cùng key đang xử lý?
5. *(Thẻ T2)* Vì sao nên ghi idempotency key cùng transaction với đơn hàng?
6. *(DSA-Pattern)* Phát hiện chu trình trong linked list với O(1) bộ nhớ thế nào? Vì sao hai con trỏ chắc chắn gặp nhau?

**🟢 Tra cứu (T3):** bản nháp IETF *The Idempotency-Key HTTP Header Field* (nhóm `httpapi`), RFC 8594 (*Sunset*).

**Tài liệu:**
- Stripe docs: *Idempotent requests* và *API versioning*
- Blog kỹ thuật của Stripe: *Designing robust and predictable APIs with idempotency* (tìm theo tên)
- Microsoft REST API Guidelines: phần *versioning*

**❓ Câu hỏi cuối bài**

1. Những method nào là idempotent theo chuẩn HTTP?
2. Mạng chậm, người dùng bấm "Thanh toán" hai lần. Thiết kế `Idempotency-Key` thế nào để không trừ tiền hai lần?
3. Versioning qua URL (`/v1/`) và qua header khác nhau thế nào về trade-off?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Team muốn phát hành cùng lúc: (a) thêm field `discount` vào response, (b) đổi `total` từ số sang chuỗi `"150000"`, (c) thêm field bắt buộc `currency` vào body `POST /orders`, (d) thêm query param tuỳ chọn `?include=items`. Thay đổi nào là breaking? Có cần lên `v2` không?
5. Service của bạn gọi cổng thanh toán và bị timeout sau 30 giây. Tiền của khách đã bị trừ chưa? Bạn xử lý thế nào để không trừ hai lần mà cũng không bỏ sót đơn đã thanh toán?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Idempotent: GET, HEAD, OPTIONS, PUT, DELETE (GET/HEAD/OPTIONS còn là safe).
- Không idempotent: POST; PATCH không được đảm bảo.
- Idempotent = tác động lên server như nhau khi gọi N lần, không phải "response giống nhau".

**Câu 2.**
- Client sinh `Idempotency-Key` cho **mỗi thao tác logic**, retry/bấm lại dùng **đúng key đó**.
- Server chèn nguyên tử `(user_id, key)` với unique constraint, trạng thái `processing` → xử lý → lưu response → `completed`; ghi key **cùng transaction** với đơn.
- Trùng key: đã xong + cùng body → trả lại response đã lưu; khác body → `422`; đang xử lý → `409`.
- Gọi cổng thanh toán thì truyền tiếp idempotency key cho nhà cung cấp.

**Câu 3.**
- URL `/v1/`: dễ thấy, dễ test bằng curl/trình duyệt, dễ route ở gateway, cache theo URL tự nhiên; nhưng URL "không thuần" REST.
- Header (`Accept: ...v2+json`, `Api-Version`): URL gọn, nhưng khó test tay, cache phải dùng `Vary`.
- Chỉ tăng version khi có breaking change.

**Câu 4.**
- Không breaking: (a) thêm field response, (d) thêm param tuỳ chọn (client cũ bỏ qua được).
- Breaking: (b) đổi kiểu dữ liệu, (c) thêm field **bắt buộc** ở request (client cũ sẽ bị `400/422`).
- Có (b), (c) → cần version mới (hoặc làm `currency` tuỳ chọn có giá trị mặc định để tránh breaking).

**Câu 5.**
- **Timeout ≠ thất bại**: không biết request đã tới và được xử lý hay chưa → không được coi là "chưa trừ tiền".
- Retry với **cùng idempotency key** gửi cho cổng thanh toán → nhà cung cấp trả kết quả cũ nếu đã trừ.
- Hoặc truy vấn trạng thái giao dịch theo mã tham chiếu / chờ webhook; đơn để ở trạng thái "chờ xác nhận", không tạo giao dịch mới.

</details>

---

## D25 (T5, 22/10): Auth

**⏱ Ước tính:** Giờ làm 57' (DSA 45' + Anki 12') · Tối 87' (Học 50' + Bảng T2 12' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h24'**

> Đây là bài dày nhất tuần. Tối nay chỉ điền bảng *Session vs JWT*. Bảng *Cookie HttpOnly vs localStorage* **dời sang D28 (CN)**; bảng *Argon2id vs bcrypt vs scrypt vs PBKDF2* và mục 5 (HS256 vs RS256) là **(tuỳ chọn)**, làm ở D28 nếu còn giờ.

### 🧩 DSA: [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

- **Pattern (🔴 T1):** *Hai con trỏ cách nhau n bước + dummy node*.
- **Các cách:**
  1. Hai lần duyệt: đếm độ dài L, rồi đi tới node thứ `L − n` → O(L).
  2. Một lần duyệt: cho `fast` đi trước `n + 1` bước tính từ `dummy`, rồi cho `fast` và `slow` cùng đi tới khi `fast = null`. Lúc đó `slow` đứng **ngay trước** node cần xoá → O(L), một lần duyệt.
- **Lỗi hay gặp:** không dùng dummy, rồi sai khi phải xoá **chính node đầu** (`n` bằng độ dài list). Dummy node xử lý gọn trường hợp này.

### 📘 Bài học buổi tối: Auth (session vs JWT, OAuth2 tổng quan, hash mật khẩu)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Authentication vs Authorization** | 🔴 T1 | Một câu mỗi khái niệm; nối được với 401 vs 403 | `authentication vs authorization` |
| 2 | Session-based auth: session lưu ở server (Redis/DB), client giữ session id trong cookie | 🔴 T1 | Vẽ được luồng login → cookie → tra session | `session based authentication flow` |
| 3 | **JWT**: `header.payload.signature` (base64url), **được ký, không được mã hoá** | 🔴 T1 | Biết: ai cũng đọc được payload → không để dữ liệu nhạy cảm trong đó | `jwt structure explained`, `jwt signed not encrypted` |
| 4 | Kiểm tra JWT đúng cách: chữ ký, `exp`, `iss`, `aud`; không chấp nhận `alg: none`; cố định thuật toán phía server | 🔴 T1 | Liệt kê được các bước verify | `jwt validation best practices`, `jwt alg none attack` |
| 5 | *(tuỳ chọn)* HS256 (khoá bí mật dùng chung) vs RS256/ES256 (khoá bí mật để ký, khoá công khai để verify) | 🟡 T2 | Biết khi có nhiều service cần verify thì chọn bất đối xứng | `hs256 vs rs256` |
| 6 | **Session vs JWT** | 🟡 T2 | Điền bảng | `session vs jwt pros cons` |
| 7 | **Vì sao JWT khó thu hồi** + các cách thu hồi | 🔴 T1 (vì sao) / 🟡 T2 (chọn cách nào) | Kể được 3 cách và cái giá của từng cách (xem chi tiết) | `revoke jwt`, `jwt denylist jti`, `refresh token rotation` |
| 8 | Lưu token ở đâu: cookie `HttpOnly` vs `localStorage` | 🟡 T2 | Nói được: localStorage dễ bị lộ qua XSS; cookie thì phải chống CSRF (`SameSite`, CSRF token). Nhớ lại D22: CORS **không** thay được chống CSRF | `jwt localstorage vs httponly cookie` |
| 9 | **OAuth2 tổng quan**: 4 vai trò (resource owner, client, authorization server, resource server); OAuth2 là **uỷ quyền**, OIDC thêm ID token để **xác thực** | 🔴 T1 | Vẽ được luồng Authorization Code ở mức hộp và mũi tên | `oauth2 roles`, `oauth2 vs openid connect` |
| 10 | Chọn grant type: Authorization Code + PKCE (app có người dùng, cả SPA/mobile), Client Credentials (service gọi service); Implicit và Password grant đã **không còn được khuyến nghị** | 🟡 T2 | Chọn đúng grant cho 3 tình huống | `oauth2 grant types which to use`, `oauth 2.1` |
| 11 | Tham số chi tiết của OAuth2 (`state`, `code_verifier`, `redirect_uri`...) | 🟢 T3 | Tra khi tích hợp | RFC 6749, RFC 7636 |
| 12 | **Vì sao không dùng MD5/SHA-256 thuần cho mật khẩu**: hàm băm nhanh → brute force bằng GPU rất rẻ; không salt → rainbow table, hai user cùng mật khẩu có cùng hash | 🔴 T1 | Giải thích được hai lý do "nhanh" và "không salt" | `why not sha256 for passwords`, `password salt rainbow table` |
| 13 | Thuật toán băm mật khẩu: Argon2id / scrypt / bcrypt / PBKDF2 | 🟡 T2 | Biết OWASP ưu tiên Argon2id; bcrypt vẫn chấp nhận được (giới hạn 72 byte) | `owasp password storage cheat sheet` |
| 14 | Tham số cost (bcrypt work factor, Argon2 memory/iterations) | 🟢 T3 | Tra OWASP khi cấu hình | OWASP |

**Chi tiết cần hiểu**

- **Vì sao JWT khó thu hồi (mục 7):** server verify JWT chỉ bằng chữ ký và `exp`, **không tra DB**. Đó chính là ưu điểm "stateless". Hệ quả: token bị lộ vẫn dùng được tới khi hết hạn. Các cách thu hồi đều là **thêm lại một chút state**:
  1. **Access token ngắn hạn (5–15') + refresh token dài hạn lưu ở server.** Logout/thu hồi = xoá refresh token. Access token đã phát vẫn sống tới khi hết hạn (tối đa vài phút). Nên xoay vòng refresh token (*rotation*): mỗi lần dùng cấp token mới, phát hiện token cũ bị dùng lại thì thu hồi cả chuỗi.
  2. **Denylist theo `jti`** trong Redis, TTL bằng thời gian còn lại của token. Mỗi request phải tra Redis.
  3. **Token version theo user**: lưu `token_version` (hoặc `tokens_valid_after`) trong DB/cache, nhét vào JWT; đổi mật khẩu/logout mọi thiết bị thì tăng version. Mỗi request phải tra version.
  - Điều cần nói được khi phỏng vấn: cách 2 và 3 tra state mỗi request, nên JWT không còn "stateless" hoàn toàn. Đổi lại vẫn nhẹ hơn tra session đầy đủ, và state có thể nằm ở một chỗ tập trung.
- **Session vs JWT không phải "cái nào tốt hơn":** session đơn giản, thu hồi tức thì, hợp với web app một hệ thống. JWT hợp khi nhiều service cần tự verify mà không gọi về một nơi, hoặc khi client là mobile/bên thứ ba.
- **Băm mật khẩu đúng (mục 12–13):** hàm băm dành cho mật khẩu phải **chậm có chủ đích** (điều chỉnh được cost), **có salt ngẫu nhiên riêng cho từng user** (thư viện bcrypt/Argon2 tự sinh và lưu salt trong chuỗi hash), và so sánh bằng hàm của thư viện (thời gian hằng). SHA-256 được thiết kế để *nhanh*, GPU tính hàng tỷ lần mỗi giây, nên đoán mật khẩu rất rẻ.
- **OAuth2 (mục 9):** "Đăng nhập bằng Google" thật ra là **OIDC** chạy trên OAuth2. OAuth2 thuần chỉ nói "app này được phép đọc Google Drive của bạn", không nói "bạn là ai".
- **Phân quyền đơn giản trong project:** RBAC (role: `customer`, `admin`) là đủ cho Mini Order Service. Kiểm tra quyền ở service/middleware, không chỉ ẩn nút ở frontend.

**🟡 Bảng so sánh T2: Session vs JWT**

Nhóm: *quản lý trạng thái xác thực*. Trục chính: **kiểm soát tập trung (stateful)** vs **tự verify, dễ scale (stateless)**.

| Tiêu chí | Session (server-side) | JWT (self-contained) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Thu hồi (revoke) tức thì? | | |
| Ext: Chi phí mỗi request (tra store hay chỉ verify chữ ký) | | |
| Ext: Kích thước dữ liệu gửi mỗi request | | |

**🟡 Bảng so sánh T2: Lưu token ở cookie HttpOnly vs localStorage** *(điền ở D28 – CN)*

Nhóm: *bảo mật phía client*. Trục chính: **rủi ro XSS** vs **rủi ro CSRF**.

| Tiêu chí | Cookie `HttpOnly; Secure; SameSite` | `localStorage` |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: JavaScript đọc được không (XSS)? | | |
| Ext: Trình duyệt tự gửi kèm không (CSRF)? | | |

**🟡 Bảng so sánh T2: Argon2id vs bcrypt vs scrypt vs PBKDF2** *(tuỳ chọn – điền nhanh ở D28 nếu còn giờ, theo OWASP Password Storage Cheat Sheet, 10'. Tối thiểu cần nhớ: OWASP ưu tiên Argon2id, bcrypt vẫn chấp nhận được)*

Nhóm: *thuật toán băm mật khẩu*. Trục chính: **khả năng chống GPU/ASIC** vs **mức hỗ trợ / yêu cầu tuân thủ**.

| Tiêu chí | Argon2id | bcrypt | scrypt | PBKDF2 |
|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | |
| Core: Trade-off chính | | | | |
| Core: Khi nào KHÔNG dùng | | | | |
| Ext: Memory-hard? | | | | |
| Ext: Giới hạn đáng chú ý | | | | |

**🔴 Thẻ Anki (T1)**

1. Authentication khác Authorization ở đâu? Liên quan gì tới 401 và 403?
2. JWT gồm 3 phần nào? Vì sao không được để dữ liệu nhạy cảm trong payload?
3. Verify một JWT cần kiểm tra những gì?
4. Vì sao JWT khó thu hồi? Kể 3 cách thu hồi và cái giá của từng cách.
5. OAuth2 khác OIDC thế nào?
6. Vì sao không được băm mật khẩu bằng MD5/SHA-256 thuần? Salt giải quyết vấn đề gì?
7. *(Thẻ T2)* Khi nào chọn session thay vì JWT?
8. *(DSA-Pattern)* Xoá node thứ n từ cuối trong một lần duyệt thế nào? Vì sao cần dummy node?

**Tài liệu:**
- OWASP Cheat Sheet Series: *Authentication*, *Password Storage*, *Session Management*, *JSON Web Token for Java* (đọc phần nguyên lý, bỏ qua code Java)
- Hussein Nasser (YouTube): các video về session vs JWT, OAuth
- jwt.io: dán thử một token để thấy payload đọc được

**❓ Câu hỏi cuối bài**

1. Session và JWT: ưu, nhược, và cách thu hồi (revoke) một JWT?
2. Vì sao không được lưu mật khẩu bằng MD5 hoặc SHA-256 thuần?
3. Authentication khác Authorization ở đâu?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Một bạn đề xuất: nhét `role`, `email`, `số điện thoại` vào JWT, và ở middleware chỉ cần base64-decode payload để lấy `role` cho nhanh. Chỉ ra 2 lỗi. Middleware verify đúng cần kiểm tra những gì?
5. "Đăng nhập bằng Google" dùng OAuth2 hay OIDC? Vì sao dùng access token OAuth2 thuần để kết luận "người này là ai" là sai?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Session: state ở server, thu hồi **tức thì** (xoá session), đơn giản cho web một hệ thống; mỗi request tra store.
- JWT: tự chứa, verify bằng chữ ký không tra DB → nhiều service tự verify, hợp mobile/bên thứ ba; nhược: **khó thu hồi**, token to hơn.
- Thu hồi JWT = thêm lại state: access token ngắn hạn + refresh token lưu server (có rotation), denylist `jti` trong Redis, hoặc `token_version` theo user. Cách 2–3 phải tra state mỗi request.

**Câu 2.**
- MD5/SHA-256 được thiết kế để **nhanh** → GPU thử hàng tỷ mật khẩu/giây.
- Không salt → rainbow table dùng được, hai user cùng mật khẩu có cùng hash.
- Dùng hàm chậm có chủ đích + salt riêng mỗi user: Argon2id / bcrypt (qua thư viện, so sánh thời gian hằng).

**Câu 3.**
- AuthN: xác minh **bạn là ai** (login, verify token) → thất bại trả `401`.
- AuthZ: xác định **bạn được làm gì** (role, chủ sở hữu resource) → thất bại trả `403` (hoặc `404` để giấu sự tồn tại).
- AuthN luôn đi trước AuthZ.

**Câu 4.**
- JWT chỉ được **ký**, không mã hoá → ai cũng đọc được payload → không để PII/dữ liệu nhạy cảm.
- Chỉ decode mà không verify chữ ký → kẻ tấn công tự sửa `role: admin`.
- Verify đúng: chữ ký với thuật toán **cố định phía server** (từ chối `alg: none`), `exp`, `iss`, `aud`.

**Câu 5.**
- Là **OIDC** chạy trên OAuth2; OIDC thêm **ID token** (JWT chứa `sub`, `aud` = app của bạn) để xác thực.
- OAuth2 thuần chỉ là **uỷ quyền**: access token nói "app được phép gọi API X", không được thiết kế để nói "ai đang dùng", và có thể là token phát cho app khác.
- Luồng khuyến nghị: Authorization Code + PKCE.

</details>

---

## D26 (T6, 23/10): REST vs gRPC vs GraphQL + N+1 problem

**⏱ Ước tính:** Giờ làm 62' (DSA 50' + Anki 12') · Tối 85' (Học 45' + Bảng T2 15' + Ghi chú/Anki 10' + Tự kiểm tra 15') · **Tổng 2h27'**

> Tối nay chỉ điền bảng *REST vs gRPC vs GraphQL*. Bảng *JOIN vs batch `IN`* là **(tuỳ chọn)**: nó trùng với bảng *Eager JOIN vs Batch `IN (...)`* ở D39 (Tuần 6), nên điền một lần ở D39.

### 🧩 DSA: [143. Reorder List](https://leetcode.com/problems/reorder-list/)

- **Pattern (🔴 T1):** *Ghép 3 kỹ thuật linked list*: tìm giữa bằng fast/slow → đảo nửa sau (bài 206) → trộn xen kẽ hai nửa (giống bài 21).
- **Các cách:**
  1. Chép node vào mảng, dùng hai con trỏ hai đầu để nối lại → O(n) thời gian, O(n) bộ nhớ.
  2. Ba bước tại chỗ ở trên → O(n) thời gian, O(1) bộ nhớ.
- **Lỗi hay gặp:** quên **cắt** list ở giữa (`slow.next = null`) → tạo chu trình khi trộn. Chú ý chọn điểm giữa cho list độ dài chẵn.
- **Mục tiêu:** bài này kiểm tra bạn đã thành thạo 206 và 21 chưa. Nếu bí, quay lại hai bài đó trước.

### 📘 Bài học buổi tối: REST vs gRPC vs GraphQL + N+1 problem

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | REST: resource + HTTP method, thường JSON, tận dụng HTTP caching | 🔴 T1 | Đã học D22–D24 | — |
| 2 | gRPC: HTTP/2, Protocol Buffers (nhị phân, có schema), sinh code client/server, hỗ trợ streaming | 🔴 T1 | Nói được 3 đặc điểm; biết trình duyệt không gọi thẳng được (cần gRPC-Web hoặc proxy) | `grpc explained`, `grpc web browser` |
| 3 | GraphQL: một endpoint, client tự chọn field cần lấy, schema có kiểu | 🔴 T1 | Nói được giải quyết over-fetching/under-fetching thế nào | `graphql over fetching under fetching` |
| 4 | **REST vs gRPC vs GraphQL** | 🟡 T2 | Điền bảng bên dưới; trả lời được câu 3 | `rest vs grpc vs graphql` |
| 5 | Rủi ro riêng của GraphQL: HTTP caching khó (thường là `POST` một endpoint), query quá sâu/quá nặng (cần giới hạn độ sâu/độ phức tạp), dễ N+1 | 🔴 T1 | Kể được 3 rủi ro | `graphql security query depth limit`, `graphql caching` |
| 6 | **N+1 problem**: 1 query lấy danh sách + N query lấy dữ liệu liên quan cho từng phần tử | 🔴 T1 | Nhận diện được trong code ORM và trong log SQL | `n+1 query problem orm` |
| 7 | Cách sửa N+1: eager loading (JOIN), batch loading (`WHERE id IN (...)`), **DataLoader** (gom + cache trong một request) | 🔴 T1 | Giải thích được DataLoader gom lời gọi thế nào | `graphql dataloader explained`, `eager loading vs lazy loading` |
| 8 | *(tuỳ chọn – điền ở D39)* **Eager loading bằng JOIN vs batch `IN`** | 🟡 T2 | Điền bảng nhỏ | `join vs separate query eager loading` |
| 9 | Cú pháp `.proto`, 4 kiểu streaming của gRPC, API cụ thể của DataLoader | 🟢 T3 | Tra docs khi dùng | grpc.io, graphql.org |
| 10 | **SQL injection + parameterized query**: ghép chuỗi input vào SQL → input trở thành *code*; prepared statement / placeholder (`$1`, `?`) gửi dữ liệu **tách khỏi** câu lệnh | 🔴 T1 | Chỉ ra được lỗ hổng trong đoạn code ghép chuỗi và sửa bằng placeholder. Biết 2 chỗ ORM vẫn hở: raw query ghép chuỗi, và **tên cột / `ORDER BY`** (không bind được bằng placeholder → phải dùng whitelist) | `sql injection parameterized query`, `owasp sql injection prevention`, `order by injection whitelist` |

**Chi tiết cần hiểu**

- **N+1 trong ORM (mục 6):** `orders = Order.findAll()` (1 query) rồi `for o in orders: print(o.customer.name)`. Nếu `customer` là quan hệ lazy, mỗi lần truy cập sinh thêm một query → 1 + N query. Với 100 đơn là 101 query. Mỗi query nhanh nhưng tổng độ trễ mạng tới DB cộng dồn lại.
- **Cách phát hiện:** bật log SQL ở môi trường dev, hoặc đếm số query mỗi request; thấy cùng một câu `SELECT ... WHERE id = ?` lặp nhiều lần là dấu hiệu.
- **Cách sửa (mục 7):**
  - *Eager loading bằng JOIN:* một query lấy cả đơn và customer. Tốt cho quan hệ nhiều–một; với quan hệ một–nhiều có thể nhân số dòng.
  - *Batch loading:* 1 query lấy đơn + 1 query `SELECT * FROM customers WHERE id IN (...)` → luôn là 2 query dù N bao nhiêu.
  - *DataLoader:* trong GraphQL, resolver của từng field gọi `loader.load(customerId)`. DataLoader **gom** mọi lời gọi trong cùng một nhịp xử lý thành một lần `batchLoad([ids])`, và **cache** trong phạm vi một request. Bản chất vẫn là batch loading.
- **SQL injection (mục 10):** `"SELECT * FROM orders WHERE status = '" + status + "'"` với `status = "x' OR '1'='1"` → trả mọi đơn; với `"x'; DROP TABLE orders; --"` còn tệ hơn. Sửa: `WHERE status = $1` và truyền `status` như tham số, DB không bao giờ parse nó thành SQL. Escape thủ công dễ sót; validate input chỉ là lớp phụ. Với `?sort=created_at` thì map qua whitelist `{created_at, total}` trước khi đưa vào SQL.
- **Câu 3, định hướng trả lời:**
  - Microservice nội bộ gọi nhau: gRPC là lựa chọn mạnh (hiệu năng, hợp đồng chặt bằng schema, sinh code). REST vẫn hợp lý nếu team nhỏ hoặc cần debug dễ.
  - Public API cho mobile/bên thứ ba: REST là mặc định an toàn (dễ dùng, cache tốt, ai cũng biết). GraphQL hợp khi nhiều màn hình cần hình dạng dữ liệu rất khác nhau và team kiểm soát cả client lẫn server.

**🟡 Bảng so sánh T2: REST vs gRPC vs GraphQL**

Nhóm: *protocol/API design*. Trục chính: **linh hoạt** vs **hiệu quả**. Tiêu chí extension theo `Prompt_Phan_Loai_Tier.md` cộng thêm các tiêu chí câu 1 yêu cầu.

| Tiêu chí | REST | gRPC | GraphQL |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Định dạng dữ liệu + transport | | | |
| Ext: Hiệu năng | | | |
| Ext: Over/under-fetching | | | |
| Ext: Caching behavior | | | |
| Ext: Độ phức tạp + tooling/ecosystem | | | |

**🟡 Bảng so sánh T2: Eager loading bằng JOIN vs batch `IN`** *(tuỳ chọn – điền một lần ở D39 Tuần 6, bảng "Eager JOIN vs Batch `IN (...)`")*

Nhóm: *data access*. Trục chính: **số round-trip** vs **lượng dữ liệu trùng lặp**.

| Tiêu chí | JOIN (1 query) | Batch `IN` (2 query) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Quan hệ một–nhiều có làm nhân số dòng không? | | |
| Ext: Số query khi N tăng | | |

**🔴 Thẻ Anki (T1)**

1. gRPC có 3 đặc điểm chính nào? Vì sao trình duyệt không gọi thẳng gRPC được?
2. GraphQL giải quyết over-fetching và under-fetching thế nào? Nó có 3 rủi ro nào?
3. N+1 problem là gì? Cho ví dụ trong ORM.
4. Làm sao phát hiện N+1?
5. DataLoader hoạt động thế nào (gom + cache)?
6. *(Thẻ T2)* Microservice nội bộ nên dùng gì? Public API cho mobile nên dùng gì? Vì sao?
7. *(DSA-Pattern)* Reorder List gồm 3 bước nào?
8. Vì sao parameterized query chặn được SQL injection còn escape thủ công thì không chắc? Chỗ nào placeholder không dùng được?

**🟢 Tra cứu (T3):** grpc.io (*Introduction to gRPC*, *Core concepts*), graphql.org (*Learn*), GitHub `graphql/dataloader`.

**Tài liệu:**
- ByteByteGo (YouTube): video so sánh REST, GraphQL, gRPC
- Docs ORM bạn dùng: mục eager loading / N+1

**❓ Câu hỏi cuối bài**

1. Lập bảng so sánh ba loại theo: định dạng dữ liệu, hiệu năng, use-case, độ phức tạp.
2. N+1 là gì? Nó xuất hiện trong ORM thế nào? Sửa bằng cách nào (eager loading, batch, DataLoader)?
3. Microservice nội bộ gọi nhau nên dùng gì? Public API cho mobile nên dùng gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Team mobile than: một màn hình phải gọi 5 endpoint REST, mỗi endpoint trả thừa rất nhiều field. GraphQL giải quyết việc này thế nào? Nếu chuyển sang GraphQL, bạn phải xử lý thêm 3 rủi ro nào?
5. Code: `db.query("SELECT * FROM orders WHERE status = '" + req.query.status + "' ORDER BY " + req.query.sort)`. Tấn công thế nào? Sửa cả hai chỗ ra sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Định dạng: REST thường JSON trên HTTP/1.1+; gRPC là Protobuf nhị phân trên HTTP/2; GraphQL là JSON, thường `POST` một endpoint.
- Hiệu năng: gRPC nhanh và gọn nhất (nhị phân, multiplexing); REST đủ tốt, tận dụng HTTP cache; GraphQL giảm số round-trip nhưng tốn công ở server.
- Use-case / độ phức tạp: REST cho public API (đơn giản, ai cũng biết); gRPC cho service nội bộ (schema chặt, sinh code, trình duyệt cần gRPC-Web); GraphQL khi nhiều client cần hình dạng dữ liệu khác nhau (phức tạp nhất: schema, resolver, bảo mật query).

**Câu 2.**
- N+1 = 1 query lấy danh sách + N query lấy dữ liệu liên quan cho từng phần tử, do **lazy loading** trong vòng lặp.
- Phát hiện: log SQL, đếm query mỗi request, thấy cùng một `SELECT … WHERE id = ?` lặp lại.
- Sửa: eager JOIN (1 query, có thể nhân dòng với quan hệ 1–N), batch `WHERE id IN (...)` (số query cố định), DataLoader (gom lời gọi trong một nhịp + cache trong request, bản chất là batch).

**Câu 3.**
- Nội bộ: gRPC (hiệu năng, hợp đồng chặt, sinh code); REST vẫn hợp lý nếu team nhỏ/cần debug dễ.
- Public cho mobile/bên thứ ba: REST mặc định an toàn (dễ dùng, cache tốt); GraphQL nếu team kiểm soát cả client lẫn server và màn hình rất đa dạng.

**Câu 4.**
- Client khai báo đúng field cần và gộp nhiều resource trong **một** query → hết over-fetching và under-fetching (nhiều round-trip).
- Rủi ro: HTTP caching khó (một endpoint `POST`); query quá sâu/nặng → cần giới hạn độ sâu/độ phức tạp; dễ N+1 ở resolver → cần DataLoader.

**Câu 5.**
- `status = x' OR '1'='1` → lộ mọi đơn; `sort = id; DROP TABLE orders` → phá dữ liệu. Input bị DB parse thành **code**.
- `status`: dùng placeholder `WHERE status = $1`, truyền giá trị riêng.
- `sort`: tên cột **không bind được** bằng placeholder → map qua whitelist (`created_at`, `total`) và chiều `ASC/DESC` cố định.

</details>

---

## D27 (T7, 24/10): Lab – Dự án

**⏱ Ước tính:** DSA 50' · Lab bắt buộc 2h40' · Ôn ⚠️ 30' · **Tổng 4h00'**

### 🧩 DSA: [146. LRU Cache](https://leetcode.com/problems/lru-cache/)

- **Pattern (🔴 T1):** *HashMap + Doubly Linked List*. HashMap cho tra cứu O(1) theo key; doubly linked list giữ **thứ tự dùng gần đây**, cho phép gỡ một node bất kỳ và chèn lên đầu trong O(1).
- **Cách giải:**
  - `get(key)`: không có → `-1`; có → chuyển node lên đầu, trả giá trị.
  - `put(key, value)`: có rồi → cập nhật + chuyển lên đầu; chưa có → tạo node, chèn đầu, thêm vào map; vượt `capacity` → gỡ node **cuối** (ít dùng nhất) và **xoá key khỏi map**.
  - Mọi thao tác O(1).
- **Mẹo:** dùng hai node giả `head` và `tail` (sentinel) để không phải kiểm tra `null` khi chèn/gỡ. Node phải lưu cả `key` để khi gỡ node cuối còn biết xoá key nào khỏi map.
- **Vì sao phải doubly?** Gỡ một node ở giữa cần biết node **trước** nó. Singly linked list phải duyệt O(n) để tìm.
- 🟢 T3: `LinkedHashMap` (Java) / `OrderedDict` (Python) làm sẵn việc này, nhưng người phỏng vấn thường yêu cầu tự cài đặt.

### 🛠 Lab (bắt buộc 2h40' + mở rộng ~1h): bắt đầu *Mini Order Service*

> Dùng ngôn ngữ và framework bạn đang làm hằng ngày. Postgres chạy bằng Docker. Dự án này sẽ được mở rộng ở các tuần 5–13, nên **cấu trúc đúng từ đầu** quan trọng hơn làm nhiều tính năng.

> **Chia phần để không vượt 4h của Thứ Bảy:**
> - **Bắt buộc (2h40'):** Bước 1 (20') → Bước 2 (20') → Bước 3 không có bonus (35') → Bước 4 chỉ `GET /products`, `GET /products/{id}`, `POST /products` (20') → Bước 5 (50') → Bước 6 phần *cốt lõi* (15': chạy từ máy trống, `401`/`403`, cùng key cùng body, khác body, thiếu key, phân trang 25 đơn).
> - **Mở rộng (làm nếu còn giờ, ~1h):** `PATCH`/`DELETE /products/{id}` (20'), bonus refresh token + logout ở Bước 3 (20'), các mục còn lại của Bước 6 (20').
> - **Bước 7 (tài liệu, 25') dời sang D28 (CN).**
> - Sau lab: **Ôn các câu ⚠️ trong tuần (30')**.

**Bước 1: Khởi tạo (30')**
- Tạo `project/mini-order-service/`.
- `docker-compose.yml` có service `postgres` (image `postgres:16`), map cổng, named volume cho dữ liệu, biến môi trường user/password/db.
- Cấu hình đọc từ biến môi trường: `DATABASE_URL`, `JWT_SECRET`, `JWT_TTL_MINUTES`. **Không hardcode secret.**
- Cấu trúc thư mục theo lớp (tên thư mục tuỳ quy ước của framework):

  ```
  src/
    controllers/    # HTTP: parse, validate định dạng, map DTO, status code
    services/       # business rule, transaction boundary
    repositories/   # SQL / ORM
    domain/         # entity, lỗi nghiệp vụ
    middleware/     # auth, error handler, request logging
  migrations/
  tests/
  ```

- Chọn công cụ migration của stack bạn dùng. Schema phải tạo được bằng một lệnh.

**Bước 2: Schema (30')**. Phác thảo (tự chuyển thành migration):

```sql
users(
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
)

products(
  id          BIGSERIAL PRIMARY KEY,
  sku         TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  price       BIGINT NOT NULL CHECK (price >= 0),   -- tiền lưu số nguyên (VND), không dùng float
  stock       INT NOT NULL CHECK (stock >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)

orders(
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id),
  status      TEXT NOT NULL CHECK (status IN ('pending','paid','cancelled')),
  total       BIGINT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)
-- index phục vụ cursor pagination "đơn của tôi, mới nhất trước"
INDEX ON orders(user_id, created_at DESC, id DESC)

order_items(
  order_id    BIGINT NOT NULL REFERENCES orders(id),
  product_id  BIGINT NOT NULL REFERENCES products(id),
  quantity    INT NOT NULL CHECK (quantity > 0),
  unit_price  BIGINT NOT NULL,        -- chụp lại giá tại thời điểm đặt
  PRIMARY KEY (order_id, product_id)
)

idempotency_keys(
  user_id        BIGINT NOT NULL REFERENCES users(id),
  key            TEXT NOT NULL,
  request_hash   TEXT NOT NULL,
  status         TEXT NOT NULL CHECK (status IN ('processing','completed')),
  response_code  INT,
  response_body  JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
)
```

- Tạo sẵn 1 tài khoản admin bằng seed script.

**Bước 3: Auth (45')**
- `POST /auth/register` → `201`; email đã tồn tại → `409`; body sai → `400`/`422` (chọn một, dùng nhất quán).
- `POST /auth/login` → `200 { access_token, token_type: "Bearer", expires_in }`; sai email hoặc mật khẩu → `401` với **cùng một thông báo** (không tiết lộ email có tồn tại hay không).
- Băm mật khẩu bằng Argon2id hoặc bcrypt qua thư viện chuẩn của stack.
- Middleware xác thực: đọc `Authorization: Bearer`, verify chữ ký, `exp`, `iss`; cố định thuật toán; gắn `userId`, `role` vào context. Sai/thiếu → `401`.
- Middleware/guard phân quyền: route admin mà role là `customer` → `403`.
- *Bonus (làm sau nếu dư giờ):* refresh token lưu DB + `POST /auth/logout` thu hồi refresh token.

**Bước 4: Product (40')**

| Endpoint | Quyền | Thành công | Lỗi cần xử lý |
|---|---|---|---|
| `GET /products?limit=&cursor=` | public | `200 { data, next_cursor }` | `400` cursor hỏng |
| `GET /products/{id}` | public | `200` | `404` |
| `POST /products` | admin | `201` + header `Location: /products/{id}` | `401`, `403`, `409` trùng SKU, `400/422` |
| `PATCH /products/{id}` | admin | `200` | `401`, `403`, `404`, `400/422` |
| `DELETE /products/{id}` | admin | `204` | `401`, `403`, `404` |

**Bước 5: Order (60')**

| Endpoint | Quyền | Thành công | Lỗi cần xử lý |
|---|---|---|---|
| `POST /orders` (header `Idempotency-Key` **bắt buộc**) | customer | `201` + `Location` | `400` thiếu key, `401`, `404` sản phẩm không tồn tại, `409` đang xử lý cùng key hoặc hết hàng, `422` key dùng lại với body khác |
| `GET /orders?status=&limit=&cursor=` | customer (chỉ đơn của mình) | `200 { data, next_cursor }` | `401`, `400` cursor hỏng |
| `GET /orders/{id}` | chủ đơn hoặc admin | `200` | `401`, `404` (đơn của người khác cũng trả `404` để không lộ sự tồn tại) |
| `POST /orders/{id}/cancel` | chủ đơn | `200` | `401`, `404`, `409` nếu đơn không ở trạng thái `pending` |

- **Body `POST /orders`:** `{ "items": [{ "product_id": 1, "quantity": 2 }] }`. **Không nhận giá từ client.** Service đọc giá từ DB, tính `total`, chụp `unit_price` vào `order_items`.
- **Trong một transaction ở tầng service:** chèn bản ghi idempotency (`processing`) → kiểm tra sản phẩm → tạo `orders` + `order_items` → trừ `stock` (kiểm tra `stock >= quantity`) → cập nhật bản ghi idempotency thành `completed` kèm response → commit.
  - Tuần này chỉ cần đúng với **một** request tại một thời điểm. Chống bán quá tồn kho khi nhiều request **đồng thời** là bài của Tuần 7.
- **Cursor:** mã hoá `(created_at, id)` của dòng cuối trang thành chuỗi base64, trả về `next_cursor`. Hết dữ liệu thì `next_cursor = null`.
- **Định dạng lỗi thống nhất** cho mọi endpoint, ví dụ `{ "error": { "code": "OUT_OF_STOCK", "message": "..." } }` (hoặc theo RFC 9457). Middleware xử lý lỗi map lỗi nghiệp vụ → status code, **không** để controller tự `try/catch` ở mọi nơi.

**Bước 6: Kiểm tra theo tiêu chí nghiệm thu (35')**. Dùng file `.http` / Postman / curl script, lưu lại trong repo.

- [ ] `docker compose up -d` + một lệnh migrate + một lệnh chạy app là chạy được từ máy trống.
- [ ] Có ít nhất 5 endpoint chạy đúng (mục tiêu: đủ các bảng ở bước 3–5).
- [ ] Gọi `/orders` không có token → `401`; customer gọi `POST /products` → `403`.
- [ ] Trong DB, `password_hash` không phải mật khẩu gốc và không phải hash MD5/SHA.
- [ ] Gửi `POST /orders` **hai lần cùng key, cùng body** → hai response giống hệt nhau (cùng `id`), bảng `orders` chỉ có **1** dòng mới, `stock` chỉ bị trừ **1** lần.
- [ ] Cùng key, **body khác** → `422`, không tạo đơn.
- [ ] Không gửi `Idempotency-Key` → `400`.
- [ ] Tạo 25 đơn, lấy với `limit=10` → đúng 3 trang (10, 10, 5), không trùng, không sót. Tạo thêm 1 đơn **giữa** lúc lấy trang 1 và trang 2 → trang 2 vẫn không lặp lại đơn nào của trang 1.
- [ ] User A gọi `GET /orders/{id}` đơn của user B → `404`.
- [ ] Controller không chứa SQL; service không đụng tới object request/response của HTTP.
- [ ] `JWT_SECRET` đọc từ biến môi trường.
- [ ] Không có câu SQL nào ghép chuỗi từ input (mọi giá trị đi qua placeholder); tham số sort (nếu có) đi qua whitelist.

**Bước 7: Tài liệu (30') – làm ở D28 (CN), ~25'**
- `project/mini-order-service/README.md`: cách chạy, danh sách endpoint, ví dụ request.
- `notes/api-design.md`: ghi lại các quyết định và **lý do** (vì sao chọn cursor, vì sao `404` thay vì `403` cho đơn của người khác, vì sao idempotency key ghi cùng transaction, chọn `400` hay `422` cho lỗi validate). Đây là nguyên liệu để kể khi phỏng vấn.

**Deliverable:** `project/mini-order-service/` chạy được, đạt các tiêu chí nghiệm thu ở bước 6, có `README.md` + `notes/api-design.md`.

---

## D28 (CN, 25/10): Chốt tuần 4 + Chốt Giai đoạn 1

**⏱ Ước tính:** DSA 35' · Chốt tuần 60' · Bảng T2 dời từ D24–D25 20' · Lab Bước 7 (tài liệu) 25' · Tổng kết GĐ1 + Anki/cheat sheet 30' · **Tổng 2h50'**

> **Việc dời từ trong tuần sang hôm nay:** bảng *Versioning URL vs Header vs Query* (D24, 10'), bảng *Cookie HttpOnly vs localStorage* (D25, 10'), Bước 7 của Lab D27 (`README.md` + `notes/api-design.md`, 25'). Nếu còn giờ (tuỳ chọn): bảng *Argon2id vs bcrypt…* (D25, 10'). Câu 5 (mock 30') đã tính trong 60' chốt tuần.

**DSA:** Làm lại các bài trong Error List đã đến hạn (sau 3 ngày / 7 ngày). Nếu Error List trống, tự giải lại 143 và 146 trong ≤ 25' mỗi bài.

**✅ Câu hỏi chốt tuần 4 — Tổng kết Giai đoạn 1.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Kể trọn vẹn chuyện gì xảy ra khi client gọi `POST /orders`: HTTP → middleware xác thực → controller → service → repository → transaction → response.
   - *Tự kiểm tra: có nhắc tới verify JWT (401), kiểm tra idempotency key, validate (400/422), transaction ở service, trả `201` + `Location`, và middleware xử lý lỗi không?*
2. Thiết kế API cho tính năng "giỏ hàng": endpoint, status code, cách phân trang.
3. LRU Cache: vì sao cần kết hợp HashMap với doubly linked list?
4. Kỹ thuật con trỏ nhanh/chậm (fast/slow pointer) dùng cho những bài nào?
   - *Ít nhất: phát hiện chu trình (141), tìm điểm bắt đầu chu trình (142), tìm node giữa (876, bước 1 của 143). Bài 19 dùng hai con trỏ cách nhau n bước, là họ hàng gần.*
5. **Tự mock 30':** giải một bài Medium chưa gặp thuộc nhóm Array / Two Pointers / Stack.
   - *Gợi ý chọn trong NeetCode 150 những bài bạn chưa làm, ví dụ [680. Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) hoặc [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/). Không chọn 128 và 150 vì hai bài này đã xếp lịch ở Tuần 13. Bấm giờ, nói to suy nghĩ như đang phỏng vấn.*

<details><summary>Ý chính cần có trong câu trả lời</summary>

**Câu 1.**
- Middleware xác thực: đọc `Authorization: Bearer`, verify chữ ký + `exp`/`iss` với thuật toán cố định → sai thì `401`; gắn `userId`, `role` vào context.
- Controller: parse + validate định dạng (`400`/`422`), map DTO, **không** nhận giá từ client; đọc `Idempotency-Key` (thiếu → `400`).
- Service: mở transaction → chèn bản ghi key `processing` (trùng key: trả response cũ / `409` / `422`) → kiểm tra sản phẩm, tồn kho → tạo `orders` + `order_items` (chụp `unit_price`) → trừ `stock` → key `completed` → commit.
- Repository chỉ chứa SQL (có placeholder); response `201` + `Location`; lỗi nghiệp vụ đi qua middleware xử lý lỗi, định dạng lỗi thống nhất.

**Câu 2.**
- Resource: `GET /me/cart`, `POST /me/cart/items` (`201`, trùng sản phẩm → cộng số lượng hoặc `409`), `PATCH /me/cart/items/{productId}` (`200`), `DELETE /me/cart/items/{productId}` (`204`), `POST /me/cart/checkout` → tạo đơn (`201`, cần `Idempotency-Key`).
- `userId` lấy từ token; sản phẩm không tồn tại `404`, số lượng sai `422`, hết hàng `409`.
- Giỏ hàng nhỏ → thường không cần phân trang; nếu cần thì cursor `(added_at, product_id)`.

**Câu 3.**
- HashMap cho tra cứu key → node trong O(1); danh sách liên kết **đôi** giữ thứ tự dùng gần đây.
- Gỡ một node ở giữa cần con trỏ `prev` → singly phải duyệt O(n); doubly làm O(1).
- Node lưu cả `key` để khi đuổi node cuối còn xoá được khỏi map; sentinel `head`/`tail` bỏ kiểm tra `null`.

**Câu 4.**
- Phát hiện chu trình (141), tìm điểm bắt đầu chu trình (142), tìm node giữa (876, bước 1 của 143), kiểm tra palindrome linked list (234).
- Ý tưởng: tốc độ chênh lệch 1 bước/lần → khoảng cách giảm dần, không nhảy qua nhau; O(1) bộ nhớ.
- Họ hàng gần: hai con trỏ cách nhau n bước (19).

**Câu 5.**
- Nói to trước khi code: làm rõ đề + ví dụ biên, nêu brute force + độ phức tạp, rồi mới tối ưu.
- Code xong tự chạy tay 1 ví dụ và 1 ca biên; nêu độ phức tạp thời gian/bộ nhớ.
- Quá 30' → ghi vào Error List kèm pattern.

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] *Mini Order Service* chạy được, có ít nhất 5 endpoint, đạt các tiêu chí nghiệm thu ở D27
- [ ] `README.md` và `notes/api-design.md` hoàn thành
- [ ] Anki: đã nhập đủ thẻ T1 của D22–D26 + thẻ pattern Linked List (dummy node, đảo list, fast/slow, HashMap + DLL)
- [ ] Cheat sheet: đã điền các bảng HTTP/1.1 vs 2 vs 3, Offset vs Cursor, DB vs Redis cho idempotency key, Versioning, Session vs JWT, Cookie vs localStorage, REST vs gRPC vs GraphQL. *(Tuỳ chọn: thuật toán băm mật khẩu. Bảng JOIN vs batch `IN` điền ở D39 Tuần 6.)*

### 🏁 Tổng kết Giai đoạn 1 (Tuần 1–4)

Đánh dấu từng mục. Mục nào chưa đạt thì đưa vào danh sách ôn của Tuần 14 (D92: *Ôn Giai đoạn 1*).

**Kiến thức**

- [ ] Giải thích được 4 tính chất OOP, Composition vs Inheritance, SOLID bằng ví dụ từ code của mình (Tuần 1)
- [ ] Đánh giá được một thiết kế theo coupling/cohesion (Tuần 2)
- [ ] Mỗi pattern sau nói được một câu "giải quyết vấn đề gì" và một ví dụ: Singleton, Factory Method, Builder, Strategy, Observer, Adapter, Decorator, Repository, Unit of Work (Tuần 2–3)
- [ ] Vẽ được kiến trúc phân lớp và nói được business logic + transaction nằm ở đâu (Tuần 3)
- [ ] Thiết kế được REST API: method, status code, pagination, idempotency, versioning, auth (Tuần 4)

**DSA: nhận ra pattern từ đề bài**

- [ ] Hashing / Counting / Prefix-Suffix / Bucket (Tuần 1)
- [ ] Two Pointers / Sliding Window cố định và thay đổi (Tuần 2)
- [ ] Stack / Monotonic Stack / Binary Search trên index và trên không gian đáp án (Tuần 3)
- [ ] Linked List: dummy node, đảo list, fast/slow, HashMap + DLL (Tuần 4)
- [ ] Error List: mọi bài sai của Giai đoạn 1 đã được làm lại ít nhất một lần

**Sản phẩm**

- [ ] `notes/solid-refactor.md` (Tuần 1)
- [ ] `project/notification/` + `notes/notification-design.md` (Tuần 2)
- [ ] `project/shipping/` + `notes/patterns-in-practice.md` (Tuần 3)
- [ ] `project/mini-order-service/` + `notes/api-design.md` (Tuần 4)
- [ ] `notes/tradeoff-cheatsheet.md` đã điền đủ các bảng T2 của 4 tuần

- [ ] **Đạt chốt Giai đoạn 1**

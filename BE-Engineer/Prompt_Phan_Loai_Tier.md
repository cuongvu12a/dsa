# Prompt phân loại Tier 1/2/3 — Dùng cho mọi kiến thức lập trình

> Mục đích: sau mỗi lần học xong 1 chủ đề mới, dùng prompt này để xác định phần nào cần **ghi nhớ nằm lòng**, phần nào cần **nhớ khung so sánh**, phần nào **chỉ cần biết để tra cứu** — tránh học xong rồi quên sạch.

---

## 1. Prompt đầy đủ (dùng khi học chủ đề lớn, nhiều tầng kiến thức)

Copy nguyên khối bên dưới, thay `[KIẾN THỨC MỚI]` bằng nội dung bạn vừa học:

```
Bạn là một Senior Engineer/Mentor giúp tôi phân loại kiến thức để học hiệu quả.

Tôi vừa học: [KIẾN THỨC MỚI — dán khái niệm, đoạn note, hoặc mô tả ngắn ở đây]

Hãy phân loại kiến thức này theo 3 Tier sau, dựa trên 3 câu hỏi chẩn đoán theo đúng thứ tự:

1. Đây có phải là NGUYÊN LÝ/MENTAL MODEL nền tảng không?
   (Dấu hiệu: dùng để tư duy/ra quyết định liên tục, là công cụ suy luận chứ không phải thông tin,
   nếu không nhớ thì không thể tự suy ra lại được, xuất hiện lặp lại ở nhiều bài toán khác nhau)
   → Nếu CÓ: đây là TIER 1 — dừng phân loại, không cần xét tiếp.

2. Đây có phải là SO SÁNH/TRADE-OFF giữa 2+ lựa chọn cùng loại không?
   (Dấu hiệu: câu hỏi dạng "A vs B", có ưu nhược điểm tùy tình huống, quyết định phụ thuộc use-case)
   → Nếu CÓ: đây là TIER 2.

3. Đây có phải là SYNTAX/CONFIG/CHI TIẾT TRIỂN KHAI cụ thể không?
   (Dấu hiệu: tên tham số, cú pháp câu lệnh, config file, ít khi thay đổi cách tư duy dù quên)
   → Nếu CÓ: đây là TIER 3.

Nếu kiến thức KHÔNG rơi vào cả 3 câu hỏi trên một cách rõ ràng, mặc định coi là TIER 1 ẩn
(nguyên lý tôi chưa nhận ra tầm quan trọng) và giải thích tại sao.

Với mỗi Tier, hãy đưa ra:
- TIER 1 → Giải thích ngắn gọn TẠI SAO nó là nguyên lý nền tảng (không phải chỉ định nghĩa),
  và gợi ý 1 câu hỏi Active Recall tôi nên tự hỏi định kỳ để kiểm tra mình còn nhớ không.
- TIER 2 → Trước khi điền bảng, hãy xác định cuộc so sánh này thuộc NHÓM nào
  (protocol/API design, data storage/model, messaging/streaming, distributed transaction
  pattern, deployment/infra strategy, compute model, sharding/scaling strategy, hoặc nhóm
  khác nếu không khớp) — vì mỗi nhóm có 1 trục trade-off quan trọng nhất khác nhau.
  Sau đó dùng CORE 3 tiêu chí bắt buộc (luôn giữ nguyên cho mọi so sánh):
  Use-case lý tưởng | Trade-off chính | Dấu hiệu KHÔNG nên dùng —
  CỘNG THÊM 2-3 tiêu chí EXTENSION đặc thù phản ánh đúng trục quan trọng nhất của
  nhóm đó (ví dụ: protocol/API → over/under-fetching, caching behavior; data storage →
  consistency model, schema flexibility; messaging → delivery guarantee, ordering
  guarantee; deployment/infra → rollback speed, risk exposure). Không dùng máy móc
  đúng 5 tiêu chí cố định nếu chúng không phản ánh đúng trục quan trọng nhất của
  cuộc so sánh — tự chọn tiêu chí extension phù hợp nhất, nói rõ vì sao chọn.
- TIER 3 → Chỉ cần 1 câu xác nhận "đây là chi tiết tra cứu, không cần ghi nhớ"
  kèm gợi ý nguồn tra cứu chuẩn (docs chính thức).

Nếu 1 chủ đề lớn có NHIỀU tầng (vừa có phần nguyên lý vừa có phần lựa chọn tình huống),
hãy tách rõ từng phần ra Tier riêng thay vì gộp chung — đừng phân loại cả chủ đề vào 1 Tier duy nhất.

Trả lời ngắn gọn, không lan man, ưu tiên tính áp dụng được ngay.
```

## 2. Prompt rút gọn (dùng nhanh trong chat, cho kiến thức nhỏ/đơn giản)

```
Phân loại [KIẾN THỨC] theo Tier 1 (nguyên lý cần nhớ nằm lòng) / Tier 2 (trade-off cần nhớ khung so sánh) / Tier 3 (chi tiết chỉ cần tra cứu). Với Tier 2: xác định nhóm so sánh này thuộc loại gì (protocol/API, data storage, messaging, deployment/infra...), rồi đưa bảng gồm core 3 tiêu chí (use-case lý tưởng | trade-off chính | khi nào không dùng) cộng thêm 2-3 tiêu chí đặc thù phản ánh đúng trục quan trọng nhất của nhóm đó — không dùng máy móc cùng 1 khung cho mọi loại so sánh.
```

---

## 3. Bảng tra: nhóm so sánh → tiêu chí extension nên thêm

CORE 3 tiêu chí (luôn giữ, mọi loại so sánh): **Use-case lý tưởng | Trade-off chính | Khi nào KHÔNG nên dùng**.

Ngoài core, thêm 2-3 tiêu chí EXTENSION theo đúng nhóm — đây là trục mà cuộc tranh luận A vs B thực sự xoay quanh:

| Nhóm so sánh | Ví dụ | Tiêu chí extension nên thêm |
|---|---|---|
| Protocol/API design | REST vs GraphQL vs gRPC | Over/under-fetching · Caching behavior · Tooling/ecosystem maturity |
| Data storage/model | SQL vs NoSQL, RDBMS khác nhau | Consistency model · Schema flexibility · Query capability (join phức tạp) |
| Messaging/Streaming | Kafka vs RabbitMQ vs SQS | Delivery guarantee · Ordering guarantee · Throughput ceiling |
| Distributed transaction pattern | 2PC vs Saga | Correctness guarantee (atomicity) · Latency overhead · Độ phức tạp rollback |
| Deployment/Infra strategy | Blue-Green vs Canary vs Rolling | Rollback speed · Resource cost · Risk exposure |
| Compute model (cloud) | EC2 vs Lambda vs ECS | Cost model · Cold start · Ai chịu trách nhiệm vận hành |
| Sharding/Scaling strategy | Range-based vs Hash-based vs Directory-based | Rebalancing difficulty · Hotspot risk · Range query có dễ không |

**Câu hỏi nhanh để tự xác định trục extension khi gặp 1 so sánh mới, chưa có trong bảng:** *"Cuộc tranh luận A vs B này thực chất xoay quanh trục nào?"*
- So sánh 2 cách *giao tiếp dữ liệu* → thường là **flexibility vs efficiency**.
- So sánh 2 cách *lưu trữ dữ liệu* → thường là **consistency vs flexibility/scale**.
- So sánh 2 cách *xử lý message/event* → thường là **guarantee vs throughput**.
- So sánh 2 *chiến lược deploy/vận hành* → thường là **risk vs cost/tốc độ**.

---

## 4. Ví dụ thực tế: áp dụng ngay sau khi học xong Docker

Đây là kết quả mẫu khi dán prompt đầy đủ với `[KIẾN THỨC MỚI]` = "Docker — container, image, Dockerfile, Docker Compose, networking, volume".

### 🔴 TIER 1 — Ghi nhớ nằm lòng

**Container vs Virtual Machine — nguyên lý cách ly tiến trình (process isolation) qua namespace & cgroup**
- Tại sao là Tier 1: đây là nguyên lý giải thích *toàn bộ* hành vi của Docker — tại sao container khởi động nhanh hơn VM, tại sao container chia sẻ kernel với host, tại sao container "nhẹ". Không hiểu cái này thì mọi hành vi khác của Docker (networking, resource limit, security) đều chỉ học vẹt.
- Active Recall: *"Nếu không có Docker, tôi có giải thích được vì sao container khởi động trong ~1 giây còn VM mất ~30 giây không?"*

**Image layer & Union File System (mỗi lệnh Dockerfile tạo 1 layer, layer được cache và tái sử dụng)**
- Tại sao là Tier 1: đây là nguyên lý quyết định cách bạn **viết Dockerfile tối ưu** (thứ tự lệnh, tách layer nào nên đặt trước/sau) — áp dụng cho MỌI Dockerfile bạn viết sau này, không riêng 1 dự án.
- Active Recall: *"Tôi có giải thích được tại sao nên COPY package.json trước rồi mới COPY toàn bộ source code không?"*

**Stateless vs Stateful container (container tự thân không lưu trạng thái, dữ liệu cần Volume)**
- Tại sao là Tier 1: nguyên lý này quyết định toàn bộ tư duy thiết kế hệ thống chạy trên container — nếu quên, bạn sẽ mắc lỗi kinh điển là để dữ liệu quan trọng bên trong container rồi mất khi container bị xóa.
- Active Recall: *"Nếu container này bị xóa và tạo lại ngay bây giờ, dữ liệu gì sẽ mất?"*

### 🟡 TIER 2 — Nhớ khung so sánh

**Docker Compose (single-host) vs Kubernetes (multi-host orchestration)** — nhóm: *Deployment/Infra strategy*

| Tiêu chí | Docker Compose | Kubernetes |
|---|---|---|
| **Core** — Use-case lý tưởng | Local dev, demo, app nhỏ 1 server | Production, cần scale, multi-server |
| **Core** — Trade-off chính | Đơn giản nhưng không chịu tải production thật | Mạnh nhưng tốn thời gian học + vận hành |
| **Core** — Khi nào KHÔNG nên dùng | Đừng dùng cho production cần High Availability | Đừng dùng nếu team < 3 người và app đơn giản |
| **Extension** — Resource cost | Không tốn thêm resource quản lý | Cần thêm control plane, tốn resource vận hành |
| **Extension** — Risk khi vận hành sai | Thấp — dễ debug, ít thành phần | Cao — sai config có thể ảnh hưởng cả cluster |

**Bind mount vs Named volume (2 cách lưu trữ dữ liệu ngoài container)** — nhóm: *Data storage/model (ở quy mô nhỏ, local)*

| Tiêu chí | Bind mount | Named volume |
|---|---|---|
| **Core** — Use-case lý tưởng | Dev — sync code local vào container | Production — Docker tự quản lý nơi lưu |
| **Core** — Trade-off chính | Dễ debug nhưng path phụ thuộc máy host | Dễ portable nhưng khó truy cập file trực tiếp từ host |
| **Core** — Khi nào KHÔNG nên dùng | Đừng dùng cho production data quan trọng | Đừng dùng nếu cần dev sync code liên tục |
| **Extension** — Performance | Phụ thuộc OS host (chậm hơn trên Mac/Windows) | Tối ưu hơn, Docker-managed |
| **Extension** — Schema/setup flexibility | Đơn giản, chỉ định path tay, không cần tạo trước | Cần tạo volume trước hoặc để Docker tự tạo |

### 🟢 TIER 3 — Chỉ cần biết để tra cứu

- Cú pháp cụ thể từng instruction trong Dockerfile (`ARG` vs `ENV`, thứ tự tham số của `HEALTHCHECK`...) — đây là chi tiết tra cứu, không cần ghi nhớ. Nguồn chuẩn: [Dockerfile reference](https://docs.docker.com/reference/dockerfile/).
- Cú pháp file `docker-compose.yml` (tên field, version schema cụ thể) — chi tiết tra cứu. Nguồn chuẩn: [Compose file reference](https://docs.docker.com/reference/compose-file/).
- Các flag cụ thể của lệnh `docker run` (`--rm`, `-d`, `-p`, `--network`...) — chi tiết tra cứu, dùng `docker run --help` hoặc docs khi cần.

---

## 5. Quy trình sử dụng thực tế (checklist ngắn)

1. Học xong 1 chủ đề (video, bài viết, sách) → mở file này, copy prompt đầy đủ (mục 1).
2. Dán nội dung vừa học vào chỗ `[KIẾN THỨC MỚI]`, chạy prompt.
3. Kết quả Tier 1 → copy nguyên câu Active Recall vào Anki/flashcard app.
4. Kết quả Tier 2 → copy bảng so sánh vào file tổng hợp "Trade-off Cheat Sheet" của bạn.
5. Kết quả Tier 3 → bỏ qua, không lưu trữ công phu, chỉ cần biết link docs để tra khi cần.
6. Với chủ đề nhỏ, đơn giản (không cần phân tầng phức tạp) → dùng thẳng prompt rút gọn (mục 2) cho nhanh.

# Phân loại Tier 1/2/3 cho toàn bộ Roadmap Senior Backend → Solution Architect

> Áp dụng framework 3 câu hỏi chẩn đoán để phân loại từng kiến thức trong roadmap. Mục đích: biết chính xác **cái gì phải ghi nhớ nằm lòng (Tier 1)**, **cái gì chỉ cần nhớ khung so sánh (Tier 2)**, và **cái gì chỉ cần biết đến, tra cứu khi dùng (Tier 3)**.
>
> Ký hiệu:
> - 🔴 **Tier 1** — Ghi nhớ nằm lòng, dùng Active Recall + Spaced Repetition nghiêm ngặt.
> - 🟡 **Tier 2** — Không cần nhớ chi tiết, chỉ cần nhớ **khung so sánh** (đã có template ở phần trước).
> - 🟢 **Tier 3** — Chỉ cần biết nó tồn tại, tra cứu khi cần, không tốn công sức ghi nhớ.

---

## PHASE 1: Deepening Backend Foundations

| Kiến thức | Tier | Lý do phân loại |
|---|---|---|
| SOLID principles | 🔴 T1 | Là công cụ tư duy dùng để đánh giá MỌI đoạn code bạn viết hoặc review — không phải thông tin, mà là "lăng kính" suy nghĩ |
| Composition vs Inheritance | 🔴 T1 | Nguyên lý nền tảng quyết định cách bạn thiết kế class — phải phản xạ ngay khi code, không có thời gian tra cứu |
| Coupling & Cohesion | 🔴 T1 | Tiêu chí đánh giá chất lượng thiết kế, dùng liên tục trong code review |
| Design Patterns (Factory, Builder, Strategy, Observer...) | 🔴 T1 | Là "từ vựng chung" của kỹ sư senior — phải nhận diện được pattern khi đọc code người khác, và biết chọn đúng lúc thiết kế |
| Repository / Unit of Work / CQRS (basic) | 🔴 T1 | Là building block tư duy cho kiến trúc, không phải chi tiết cần tra |
| REST API design (idempotency, versioning, pagination) | 🟡 T2 | Đây là **best-practice checklist**, không phải nguyên lý — nhớ khung "khi thiết kế API cần check: idempotency? versioning? pagination strategy?" |
| GraphQL vs REST vs gRPC | 🟡 T2 | Chính xác là ví dụ điển hình Tier 2 — nhớ khung so sánh (use-case, performance, complexity, trade-off), không nhớ chi tiết feature |
| GraphQL: N+1 problem & DataLoader | 🔴 T1 | Đây thực ra là nguyên lý ẩn — N+1 là pattern xuất hiện ở MỌI ORM/ORM-like system, không riêng GraphQL. Phải nhận diện được bất cứ đâu |
| gRPC: cú pháp Protocol Buffers cụ thể | 🟢 T3 | Chi tiết syntax `.proto` file — tra docs khi cần, không cần nhớ |
| Big-O complexity analysis | 🔴 T1 | Công cụ tư duy bắt buộc để đánh giá bất kỳ thuật toán/thiết kế nào |
| DSA patterns (Sliding Window, Two Pointers, DP...) | 🔴 T1 | Đây là *pattern nhận diện vấn đề*, không phải bài toán cụ thể — phải nhớ để nhận ra "bài này thuộc dạng gì" |
| Cú pháp cụ thể của 1 bài LeetCode đã giải | 🟢 T3 | Không cần nhớ code chi tiết — nhớ pattern (Tier 1) là đủ, code có thể viết lại được nếu hiểu pattern |

**Ghi chú riêng cho Phase 1:** Đây là phase có **tỷ lệ Tier 1 cao nhất** trong toàn bộ roadmap — vì OOP, Design Pattern, DSA pattern chính là "cơ bắp tư duy" nền tảng cho mọi phase sau. Đầu tư Spaced Repetition nghiêm túc ở phase này sẽ giúp các phase sau học nhanh hơn nhiều.

---

## PHASE 2: Mastering Data & Databases

| Kiến thức | Tier | Lý do phân loại |
|---|---|---|
| Cách đọc execution plan (Seq Scan, Index Scan, Bitmap Scan) | 🔴 T1 | Kỹ năng phải phản xạ mỗi khi debug performance — không thể "để lúc cần tra lại" |
| B-Tree index / Hash index / GIN/GiST — khái niệm hoạt động | 🔴 T1 | Nguyên lý giải thích "tại sao" — cần để tự suy luận ra quyết định index mới trong tình huống chưa từng gặp |
| Composite index & column order strategy | 🔴 T1 | Là quy tắc tư duy dùng lặp lại mỗi lần thiết kế index mới |
| Cardinality, selectivity | 🔴 T1 | Khái niệm nền giải thích "khi nào index KHÔNG giúp" — cần hiểu sâu để không lạm dụng index |
| MVCC, WAL, Transaction Isolation Levels | 🔴 T1 phần khái niệm + 🟡 T2 phần lựa chọn | Hiểu MVCC/WAL hoạt động ra sao = Tier 1 (nguyên lý). Nhưng "chọn Read Committed hay Serializable cho hệ thống nào" = Tier 2 (trade-off) |
| Vacuum/Autovacuum, bloat | 🟢 T3 | Cơ chế vận hành cụ thể của PostgreSQL — biết nó tồn tại, tra cứu config khi vận hành thật |
| Connection pooling (PgBouncer/ProxySQL) | 🟡 T2 | So sánh giữa các pooling mode (session/transaction/statement) — nhớ khung, không nhớ config chi tiết |
| Replication (master-slave, multi-master) | 🔴 T1 | Nguyên lý nền tảng của scaling — cần hiểu sâu để tự thiết kế được kiến trúc scale sau này |
| Sharding strategies (range/hash/directory-based) | 🟡 T2 | Đây là **các lựa chọn chiến lược** — nhớ khung so sánh (ưu/nhược từng loại), áp dụng tùy bài toán cụ thể |
| CAP theorem | 🔴 T1 | Nguyên lý tối quan trọng — dùng để giải thích MỌI quyết định trade-off trong distributed system, phải nhớ nằm lòng |
| RDBMS vs NoSQL (Document/KV/Wide-Column/Graph) | 🟡 T2 | So sánh trade-off theo use-case — nhớ khung, không nhớ chi tiết feature từng loại DB |
| Caching strategy (cache-aside, write-through, write-behind) | 🟡 T2 | Mỗi strategy có trade-off riêng — nhớ khung "khi nào dùng cái nào", tra cứu implementation chi tiết khi cần |
| Cú pháp cụ thể EXPLAIN của từng DBMS | 🟢 T3 | Chi tiết command-line/syntax — tra docs |

**Ghi chú riêng cho Phase 2:** Phase này có sự **trộn lẫn Tier 1 và Tier 2 trong cùng 1 chủ đề** rất rõ — ví dụ Transaction Isolation Level. Đây chính là kỹ năng bạn cần luyện: tách được "phần nguyên lý phải nhớ" ra khỏi "phần lựa chọn chỉ cần khung tư duy".

---

## PHASE 3: System Design & Architecture

| Kiến thức | Tier | Lý do phân loại |
|---|---|---|
| Load balancing algorithms (round-robin, least connections, consistent hashing) | 🟡 T2 | So sánh trade-off giữa các thuật toán theo tình huống — nhớ khung chọn lựa |
| Consistent hashing — nguyên lý hoạt động | 🔴 T1 | Bản thân cơ chế consistent hashing là nguyên lý nền tảng dùng lặp lại ở nhiều bài toán distributed system khác (không chỉ load balancing) |
| API Gateway / Reverse Proxy / Service Mesh — khái niệm | 🟢 T3 chuyển 🟡 T2 | Biết chúng tồn tại và vai trò (T3), nhưng "khi nào cần Service Mesh vs không cần" là T2 |
| Message Queue: Kafka vs RabbitMQ vs SQS | 🟡 T2 | Ví dụ điển hình Tier 2 — nhớ khung so sánh (throughput, ordering, delivery guarantee) |
| Delivery guarantees (at-most-once/at-least-once/exactly-once) | 🔴 T1 | Nguyên lý nền tảng — phải hiểu sâu để tự thiết kế hệ thống idempotent đúng |
| Event Sourcing, CQRS (nâng cao) | 🔴 T1 | Là mental model kiến trúc — cần nội tâm hóa để nhận ra "bài toán này có nên dùng CQRS không" |
| Consistency models (Strong/Eventual/Causal) | 🔴 T1 | Nguyên lý cốt lõi của distributed system — phải nhớ nằm lòng để đánh giá mọi thiết kế |
| Distributed transactions: 2PC vs Saga | 🟡 T2 (phần chọn lựa) + 🔴 T1 (nguyên lý Saga) | Nguyên lý Saga (compensating transaction) = T1 vì là mental model dùng lại nhiều nơi. Chọn 2PC hay Saga cho bài toán cụ thể = T2 |
| Circuit Breaker, Retry with backoff, Bulkhead | 🔴 T1 | Resilience pattern — phải phản xạ áp dụng khi thiết kế bất kỳ service nào gọi service khác |
| Raft/Paxos (nguyên lý consensus) | 🟢 T3 | Chỉ cần hiểu ở mức khái niệm để đọc hiểu tài liệu — hiếm khi tự implement, không cần nhớ chi tiết thuật toán |
| Domain-Driven Design (Bounded Context, Aggregate) | 🔴 T1 | Là ngôn ngữ tư duy để chia nhỏ hệ thống — dùng lặp lại mỗi lần thiết kế microservices mới |
| Database-per-service vs Shared database | 🔴 T1 | Nguyên lý/anti-pattern quan trọng, không phải lựa chọn tình huống — phải biết Shared DB là anti-pattern gần như luôn luôn |
| Strangler Fig pattern | 🟡 T2 | Đây là 1 chiến lược migration cụ thể — biết khi nào áp dụng, chi tiết triển khai tra cứu khi cần |
| Observability: Logging/Metrics/Tracing — khái niệm 3 trụ cột | 🔴 T1 | Mental model bắt buộc để thiết kế hệ thống production-ready |
| Cú pháp/config cụ thể của Prometheus, Jaeger, OpenTelemetry SDK | 🟢 T3 | Chi tiết công cụ — tra docs khi triển khai |
| Framework tiếp cận System Design Interview (Requirements → Capacity → HLD → Deep Dive → Trade-off) | 🔴 T1 | Đây LÀ khung tư duy tối quan trọng — phải nhớ nằm lòng vì áp dụng cho mọi case study, mọi interview |

**Ghi chú riêng cho Phase 3:** Đây là phase có **nhiều Tier 1 dạng "mental model" nhất** — khác với Tier 1 ở Phase 1 (nguyên lý code-level), Tier 1 ở đây là *nguyên lý kiến trúc-level*. Chúng đòi hỏi luyện tập qua nhiều case study thực tế (không chỉ đọc), vì đây là loại kiến thức chỉ "dính" khi bạn tự vận dụng nó để giải quyết vấn đề, không dính khi chỉ đọc định nghĩa.

---

## PHASE 4: DevOps & Cloud Architecture

| Kiến thức | Tier | Lý do phân loại |
|---|---|---|
| Docker: khái niệm container, image layer | 🔴 T1 | Nguyên lý nền tảng cần hiểu sâu để debug mọi vấn đề liên quan container sau này |
| Dockerfile syntax cụ thể (multi-stage build cú pháp) | 🟢 T3 | Cú pháp cụ thể — tra cứu/copy template khi cần |
| Kubernetes: Pod, Deployment, Service — khái niệm & mối quan hệ | 🔴 T1 | Mental model kiến trúc của K8s — phải hiểu sâu vì mọi thứ khác trong K8s xây trên nền này |
| Kubernetes: cú pháp YAML config cụ thể, Helm chart syntax | 🟢 T3 | Chi tiết config — tra cứu/copy, không cần nhớ |
| Horizontal Pod Autoscaler — nguyên lý scaling | 🟡 T2 | Hiểu cơ chế + so sánh với Vertical scaling — nhớ khung trade-off |
| CI/CD pipeline design (build→test→scan→deploy) | 🔴 T1 | Mental model quy trình chuẩn — phải nhớ nằm lòng vì áp dụng cho MỌI dự án, mọi công ty |
| GitOps (ArgoCD/Flux) — khái niệm | 🟡 T2 | So sánh GitOps vs push-based CI/CD truyền thống — nhớ khung, tra cứu setup chi tiết khi cần |
| Deployment strategies: Blue-Green vs Canary vs Rolling | 🟡 T2 | Ví dụ điển hình Tier 2 — nhớ khung so sánh (risk, rollback speed, resource cost) |
| Infrastructure as Code — nguyên lý (declarative vs imperative) | 🔴 T1 | Nguyên lý nền tảng thay đổi cách bạn nghĩ về infrastructure |
| Terraform syntax cụ thể (resource block, provider config) | 🟢 T3 | Cú pháp — tra docs, copy từ project cũ |
| Cloud compute options (EC2 vs Lambda vs ECS/EKS) | 🟡 T2 | So sánh trade-off (cost, cold start, quản lý vận hành) — nhớ khung chọn lựa theo use-case |
| VPC/Subnet/Security Group — khái niệm mô hình mạng | 🔴 T1 | Mental model networking cần hiểu sâu — nền tảng cho mọi thiết kế cloud sau này |
| Chi tiết config IAM policy JSON cụ thể | 🟢 T3 | Tra cứu/copy template khi cần |
| Cost optimization strategy (right-sizing, reserved/spot instance) | 🟡 T2 | Khung ra quyết định theo tình huống (workload ổn định vs biến động) — không cần nhớ giá cụ thể |
| SLA/SLO/SLI, Error Budget | 🔴 T1 | Mental model bắt buộc của tư duy Senior/Architect — dùng để đưa ra MỌI quyết định về độ tin cậy hệ thống |
| Blameless post-mortem — nguyên tắc | 🔴 T1 | Nguyên tắc văn hóa kỹ thuật quan trọng, ảnh hưởng cách bạn phản ứng khi có incident thật |

**Ghi chú riêng cho Phase 4:** Nhận diện rõ pattern: mọi **cú pháp/config cụ thể (Terraform, Kubernetes YAML, Dockerfile)** đều là Tier 3 — đừng cố học thuộc cú pháp, chỉ cần hiểu **khái niệm nó đại diện cho cái gì** (Tier 1) rồi tra cứu cú pháp khi thực hành.

---

## PHASE 5: Solution Architect Mastery & Certification

| Kiến thức | Tier | Lý do phân loại |
|---|---|---|
| TOGAF ADM — 4 tầng kiến trúc (Business/Data/Application/Technology) | 🔴 T1 | Đây LÀ khung tư duy cốt lõi của vai trò Solution Architect — phải nhớ nằm lòng, dùng trong mọi cuộc họp kiến trúc |
| TOGAF — chi tiết từng artifact/template cụ thể trong bộ chuẩn | 🟢 T3 | Chi tiết tài liệu hóa — tra cứu khi cần lập document thật |
| Multi-cloud vs Hybrid-cloud strategy | 🟡 T2 | So sánh trade-off (vendor lock-in, cost, complexity) — nhớ khung, không nhớ chi tiết implementation từng cloud |
| Event Mesh, Schema Registry (enterprise scale) | 🟡 T2 | Mở rộng của kiến thức Message Queue đã học ở Phase 3 — nhớ khung khi nào cần scale lên mức này |
| API Management ở tầng tổ chức (versioning policy, Developer Portal) | 🟡 T2 | Là bộ best-practice — nhớ khung checklist, không nhớ chi tiết tool cụ thể |
| Zero Trust security model | 🔴 T1 | Nguyên lý bảo mật nền tảng — thay đổi cách bạn thiết kế MỌI hệ thống, phải hiểu sâu |
| Compliance chi tiết (GDPR/SOC2/HIPAA điều khoản cụ thể) | 🟢 T3 | Chi tiết pháp lý — tra cứu với legal/compliance team khi cần, không tự nhớ điều khoản |
| Build vs Buy decision framework | 🔴 T1 | Đây LÀ khung ra quyết định cốt lõi của Architect — phải nhớ nằm lòng để áp dụng cho MỌI đề xuất |
| Technical Debt quantification | 🟡 T2 | Phương pháp đo lường có nhiều trường phái — nhớ khung tiêu chí, chọn phương pháp phù hợp tùy tổ chức |
| Total Cost of Ownership (TCO) analysis — cấu trúc phân tích | 🔴 T1 | Khung phân tích bắt buộc dùng lặp lại trong mọi proposal — phải thành phản xạ |
| Stakeholder communication / viết RFC thuyết phục | 🔴 T1 | Đây là kỹ năng cốt lõi phân biệt Senior Engineer với Architect — không phải kiến thức kỹ thuật nhưng vẫn Tier 1 vì dùng liên tục |

**Ghi chú riêng cho Phase 5:** Ở tầng Solution Architect, tỷ lệ Tier 1 tăng vọt trở lại — vì đây không còn là kiến thức kỹ thuật chi tiết (dễ tra cứu) mà là **frameworks ra quyết định** (TOGAF, Build vs Buy, TCO) — bản chất của vai trò Architect chính là sở hữu một bộ "khung tư duy nằm lòng" để áp dụng nhanh trong mọi tình huống mới.

---

## Tổng kết chiến lược học theo Tier xuyên suốt roadmap

### 🔴 Danh sách Tier 1 cốt lõi cần đưa vào Spaced Repetition ngay từ đầu
Đây là danh sách "phải thuộc lòng" quan trọng nhất xuyên suốt cả roadmap — ưu tiên đưa vào Anki/flashcard sớm nhất có thể:

- SOLID, Design Patterns, DSA patterns (Phase 1)
- Indexing internals, CAP theorem, MVCC concept (Phase 2)
- Consistency models, Resilience patterns, DDD, Observability 3 trụ cột, System Design Interview framework (Phase 3)
- Container/K8s mental model, CI/CD mental model, IaC principle, SLA/SLO/SLI, Networking mental model (Phase 4)
- TOGAF ADM, Zero Trust, Build vs Buy, TCO framework (Phase 5)

### 🟡 Danh sách khung so sánh Tier 2 cần xây dựng Cheat Sheet
Mỗi cặp này nên có 1 bảng so sánh riêng theo template đã có (use-case / performance / complexity / trade-off / khi nào không dùng):
REST vs GraphQL vs gRPC · SQL vs NoSQL · Kafka vs RabbitMQ vs SQS · 2PC vs Saga · Sharding strategies · Deployment strategies (Blue-Green/Canary/Rolling) · Multi-cloud vs Hybrid-cloud

### 🟢 Nguyên tắc với Tier 3
Toàn bộ syntax cụ thể (Terraform, Kubernetes YAML, Dockerfile, Protocol Buffers, IAM JSON, TOGAF artifact templates) — **không đưa vào kế hoạch ghi nhớ**. Chỉ cần 1 folder "cheat sheet/snippets" cá nhân để copy khi thực hành, và chấp nhận việc quên chi tiết cú pháp là hoàn toàn bình thường.

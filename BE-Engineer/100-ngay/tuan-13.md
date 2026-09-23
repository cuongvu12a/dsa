# Tuần 13 (21/12 – 27/12): Docker/K8s/CI-CD ở mức khái niệm + câu chuyện cá nhân

← [Tuần 12](tuan-12.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 14 →](tuan-14.md)

**Mục tiêu tuần:** Giải thích được luồng từ lúc commit đến lúc lên production. Có 5 câu chuyện STAR và phần giới thiệu bản thân trơn tru.

> Cách học theo Tier (🔴 T1 → Anki, 🟡 T2 → cheat sheet, 🟢 T3 → chỉ tra cứu): xem lại [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Tuần này **phần DevOps chỉ học ở mức khái niệm**. Mọi cú pháp (Dockerfile, YAML K8s, GitHub Actions) đều là 🟢 T3: copy snippet, không học thuộc.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Container vs VM (namespace, cgroup, chung kernel), image vs container, image layer + build cache, container stateless + volume, vì sao image nhỏ tốt hơn, K8s *desired state* + vòng reconcile, quan hệ Pod / Deployment / Service, liveness vs readiness probe, tách config khỏi image (ConfigMap/Secret), graceful shutdown, CI vs Continuous Delivery vs Continuous Deployment, pipeline chuẩn build → test → scan → deploy, *build once, deploy many* (tag bất biến theo commit SHA), deploy ≠ release, rollback = deploy lại artifact cũ, expand–contract migration, tương thích ngược giữa 2 phiên bản, khung STAR, khung giới thiệu bản thân và trình bày dự án, các pattern DSA: Hashing tìm điểm bắt đầu chuỗi / Sliding Window cố định + đếm / Stack tính biểu thức / DFS hậu thứ tự (LCA) / Backtracking phân hoạch | Docker Compose vs Kubernetes, Service `LoadBalancer` vs Ingress, HPA vs VPA, Blue-Green vs Canary vs Rolling, (tuỳ chọn) GitOps vs CI/CD kiểu push | Cú pháp Dockerfile, flag `docker run`, chọn base image (alpine / slim / distroless), YAML K8s, `kubectl`, Helm, các loại Service, StatefulSet / DaemonSet / Job, tên các thành phần control plane, cú pháp GitHub Actions, công cụ migration (Flyway, Liquibase, Alembic...), công thức viết bullet CV, câu chữ cụ thể của từng câu chuyện, câu "vì sao chọn công ty này" cho từng công ty, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D85 (T2) Docker | 65' | 75' | 2h20' |
| D86 (T3) K8s | 65' | 85' | 2h30' |
| D87 (T4) CI/CD + migration | 65' | 90' | 2h35' |
| D88 (T5) 5 câu chuyện STAR | 65' | 90' | 2h35' |
| D89 (T6) Giới thiệu + dự án + CV | 65' | 90' | 2h35' |
| D90 (T7) Mock coding + Lab | — | 4h00' | 4h00' |
| D91 (CN) Chốt tuần 13 | — | 2h40' | 2h40' |

**Tổng tuần: 19h15'** (chưa tính 1h tiếng Anh mỗi ngày).

Ngày nặng nhất là **D90 (4h00')**, chạm trần 4h của Thứ Bảy. Ba buổi tối D87–D89 cũng chạm trần 90', nên đã cân đối lại: phần ghi âm các chuyện STAR còn lại dời sang D91, các mục README "Số liệu" và "Nếu có thêm thời gian" dời sang D91.

---

## D85 (T2, 21/12): Docker

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 75' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 15') · **Tổng 2h20'**

### 🧩 DSA: [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)

- **Pattern (🔴 T1):** *Hashing: tìm điểm bắt đầu của chuỗi*. Đề đòi O(n) nên không được sort. Bỏ hết vào HashSet, rồi chỉ bắt đầu đếm từ những số `x` mà `x − 1` **không** có trong set (tức `x` là đầu một chuỗi liên tiếp).
- **Hãy tự nghĩ ra cả 3 cách** trước khi xem lời giải:
  1. Brute force: với mỗi `x`, tìm `x+1, x+2, ...` bằng cách duyệt mảng → O(n³) hoặc O(n²) nếu tra bằng set nhưng không lọc điểm bắt đầu.
  2. Sort rồi đếm đoạn liên tiếp (nhớ bỏ qua phần tử trùng) → O(n log n) thời gian.
  3. HashSet + chỉ đếm từ điểm bắt đầu → O(n) thời gian, O(n) bộ nhớ.
- **Key insight:** mỗi phần tử chỉ được "đi qua" tối đa 2 lần (một lần kiểm tra `x − 1`, một lần nằm trong vòng đếm của đúng một chuỗi) → tổng O(n) dù có vòng `while` bên trong vòng `for`. Đây là phân tích *amortized* đã học ở D1.
- **Lưu ý:** duyệt trên **set**, không duyệt trên mảng gốc. Nếu mảng có nhiều bản sao của một điểm bắt đầu, duyệt mảng gốc sẽ đếm lại cùng một chuỗi nhiều lần.

### 📘 Bài học buổi tối: Docker (container vs VM, image, layer, multi-stage build)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Container vs VM**: container là tiến trình được cách ly bằng *namespace* và giới hạn tài nguyên bằng *cgroup*, dùng chung kernel của host. VM có kernel riêng, chạy trên hypervisor | 🔴 T1 | Giải thích được vì sao container khởi động trong ~1 giây còn VM mất hàng chục giây | `container vs virtual machine namespace cgroup` |
| 2 | **Image vs Container**: image là khuôn chỉ đọc, container là một lần chạy của image (thêm một lớp ghi được) | 🔴 T1 | Nói được bằng một câu, liên hệ được với class vs object | `docker image vs container` |
| 3 | **Image layer + build cache**: mỗi lệnh trong Dockerfile tạo một layer. Layer nào đổi thì layer đó **và mọi layer sau** phải build lại | 🔴 T1 | Giải thích được vì sao COPY file khai báo dependency trước rồi mới COPY source | `docker layer caching order` |
| 4 | **Container stateless, dữ liệu phải nằm ở volume** | 🔴 T1 | Trả lời được "xoá container rồi tạo lại thì mất dữ liệu gì?" | `docker volume persistent data` |
| 5 | **Vì sao image nhỏ tốt hơn**, và ý tưởng multi-stage build: build ở một stage đầy đủ công cụ, chỉ copy kết quả sang stage runtime tối giản | 🔴 T1 | Nêu được 3 lợi ích của image nhỏ. Hiểu multi-stage giải quyết vấn đề gì (không cần thuộc cú pháp) | `docker multi-stage build why`, `docker image size security` |
| 6 | **Docker Compose vs Kubernetes** | 🟡 T2 | Điền bảng bên dưới | `docker compose vs kubernetes` |
| 7 | Bind mount vs Named volume | 🟡 T2 | Đã có bảng mẫu ở [Prompt_Phan_Loai_Tier.md mục 4](../Prompt_Phan_Loai_Tier.md). Chỉ đọc lại, không cần làm bảng mới | `bind mount vs volume` |
| 8 | Registry, tag, digest; vì sao không nên deploy bằng tag `latest` | 🟢 T3 | Biết rằng tag có thể bị ghi đè, digest thì không. Deploy nên dùng tag cố định (ví dụ theo commit SHA). Phỏng vấn hay hỏi "vì sao không deploy `latest`?": không biết đang chạy bản nào, 2 node có thể kéo về 2 bản khác nhau, không rollback được về "bản trước". Ý nguyên lý nằm ở D87 mục 3 | `docker tag vs digest` |
| 9 | Cú pháp các lệnh `FROM`, `RUN`, `COPY`, `CMD` vs `ENTRYPOINT`, `ARG` vs `ENV`, `HEALTHCHECK`, `.dockerignore` | 🟢 T3 | Tra khi viết Dockerfile ở lab D90 | [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) |
| 10 | Chọn base image (alpine / slim / distroless), chạy bằng user không phải root | 🟢 T3 | Chỉ cần biết tồn tại. Alpine dùng musl nên đôi khi lỗi thư viện native | `alpine vs slim vs distroless` |
| 11 | Flag của `docker run` (`-d`, `-p`, `--rm`, `-v`, `--network`, `-e`) | 🟢 T3 | `docker run --help` | — |

**Chi tiết cần hiểu**

- **Container vs VM (mục 1):**

  | | VM | Container |
  |---|---|---|
  | Cách ly bằng | Hypervisor, mỗi VM một kernel riêng | Namespace (pid, net, mnt, uts, ipc, user) + cgroup, chung kernel host |
  | Khởi động | Boot cả hệ điều hành → hàng chục giây | Chỉ start một tiến trình → khoảng 1 giây |
  | Kích thước | GB | MB tới vài trăm MB |
  | Mức cách ly | Mạnh hơn | Yếu hơn (lỗi kernel có thể ảnh hưởng mọi container) |

  - Trên macOS/Windows, Docker Desktop thực ra chạy một VM Linux nhỏ, và container chạy trong VM đó. Đây là lý do bind mount trên Mac chậm hơn trên Linux.
- **Layer và cache (mục 3):**
  - Layer là **chỉ đọc** và được xếp chồng (union filesystem, ví dụ overlay2). Container thêm một lớp mỏng ghi được ở trên cùng. Xoá container là mất lớp này.
  - Thứ tự đúng: `COPY package.json package-lock.json` → `RUN npm ci` → `COPY . .`. Sửa code chỉ làm vỡ cache từ bước `COPY . .`, bước cài dependency (thường chậm nhất) vẫn dùng cache.
  - Thứ tự sai: `COPY . .` trước → mỗi lần sửa một dòng code là cài lại toàn bộ dependency.
  - Nguyên tắc chung: **thứ ít thay đổi đặt trước, thứ hay thay đổi đặt sau**.
- **Image nhỏ tốt hơn (mục 5):**
  - Pull nhanh hơn → deploy và autoscale nhanh hơn (Pod mới lên nhanh khi traffic tăng).
  - Ít package hơn → ít lỗ hổng bảo mật (CVE) hơn, bề mặt tấn công nhỏ hơn.
  - Tốn ít dung lượng registry và băng thông hơn.
  - Multi-stage: stage `build` có compiler, dev dependency, source; stage `runtime` chỉ có binary hoặc code đã build + dependency production. Image cuối cùng chỉ chứa stage cuối.
- **Stateless (mục 4):** container có thể bị xoá, tạo lại, dời sang máy khác bất cứ lúc nào. Mọi thứ cần giữ lại (dữ liệu DB, file upload) phải nằm ở volume hoặc dịch vụ bên ngoài (S3, DB). Đây cũng là lý do service phải stateless mới scale ngang được (Tuần 9).

**🟡 Bảng so sánh T2: Docker Compose vs Kubernetes**

Nhóm: *Deployment/Infra strategy*. Trục chính của cuộc so sánh: **đơn giản** vs **khả năng chịu tải và tự phục hồi ở production**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`. Điền xong mới mở bảng mẫu ở [Prompt_Phan_Loai_Tier.md mục 4](../Prompt_Phan_Loai_Tier.md) để so:

| Tiêu chí | Docker Compose | Kubernetes |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Resource cost | | |
| Ext: Risk exposure (khi vận hành sai) | | |
| Ext: Tự phục hồi khi container/máy chết? | | |

**🔴 Thẻ Anki (T1)**

1. Container khác VM ở điểm nào? Vì sao container khởi động nhanh hơn?
2. Namespace và cgroup lần lượt làm nhiệm vụ gì?
3. Vì sao nên COPY file khai báo dependency trước rồi mới COPY source?
4. Xoá một container rồi tạo lại thì dữ liệu nào mất? Làm sao để không mất?
5. Kể 3 lợi ích của image nhỏ. Multi-stage build giúp image nhỏ đi như thế nào?
6. (T2) Khi nào chọn Docker Compose thay vì Kubernetes?

**🟢 Tra cứu (T3):** [Dockerfile reference](https://docs.docker.com/reference/dockerfile/), trang *Multi-stage builds* và *Building best practices* trong mục *Build* của docs.docker.com.

**Tài liệu:**
- Docker docs (docs.docker.com): *Docker overview* (phần kiến trúc, image, container), *Multi-stage builds*, *Building best practices*
- [Prompt_Phan_Loai_Tier.md mục 4](../Prompt_Phan_Loai_Tier.md): ví dụ phân loại Tier cho Docker, dùng để đối chiếu

**❓ Câu hỏi cuối bài**

1. Container khác VM ở đâu?
2. Image layer và cache khi build: vì sao nên COPY file khai báo dependency trước rồi mới COPY source?
3. Vì sao image nhỏ thì tốt hơn?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Image khác container thế nào? Xoá một container rồi chạy lại từ đúng image đó thì dữ liệu nào mất, và phải làm gì để không mất? Điều này liên quan gì tới việc service phải stateless?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** container là tiến trình được cách ly bằng namespace, giới hạn bằng cgroup, **chung kernel host**; VM có kernel riêng trên hypervisor. Container chỉ start một tiến trình (~1s), VM phải boot cả OS (hàng chục giây). Đánh đổi: VM cách ly mạnh hơn.
- **Câu 2:** mỗi lệnh tạo một layer; layer đổi thì nó **và mọi layer sau** build lại. File dependency ít đổi, `npm ci` chậm → đặt trước; source hay đổi → `COPY . .` sau cùng. Sửa code thì bước cài dependency vẫn `CACHED`.
- **Câu 3:** pull nhanh → deploy/autoscale nhanh; ít package → ít CVE, bề mặt tấn công nhỏ; tốn ít registry/băng thông. Multi-stage: build ở stage đủ công cụ, chỉ copy kết quả sang stage runtime.
- **Câu 4:** image = khuôn chỉ đọc (như class), container = một lần chạy + lớp ghi mỏng (như object). Xoá container → mất lớp ghi (file ghi trong container). Dữ liệu cần giữ → volume hoặc dịch vụ ngoài (DB, S3). Container có thể bị tạo lại/dời máy bất cứ lúc nào → service phải stateless mới scale ngang được.

</details>

---

## D86 (T3, 22/12): Kubernetes ở mức khái niệm

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 85' (Học 50' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h30'**

### 🧩 DSA: [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/)

- **Pattern (🔴 T1):** *Sliding Window kích thước cố định + đếm tần suất*. "s2 có chứa một hoán vị của s1" ⇔ có một cửa sổ dài `len(s1)` trong s2 mà tần suất ký tự **bằng** tần suất của s1. Kết hợp Counting (Tuần 1) với Sliding Window (Tuần 2).
- **Các cách:**
  - Sinh mọi hoán vị của s1 rồi tìm → O(n!), không dùng được.
  - Với mỗi cửa sổ, sort rồi so → O(n · k log k), với k = `len(s1)`.
  - Mảng đếm 26 phần tử, trượt cửa sổ (thêm ký tự vào bên phải, bỏ ký tự bên trái) và so hai mảng → O(26 · n) = O(n).
  - Tối ưu thêm: giữ biến `matches` = số ký tự đang có tần suất khớp; chỉ cập nhật cho 2 ký tự vừa vào/ra → O(n), không phải so cả mảng 26 mỗi bước.
- **Key insight:** cửa sổ **cố định** nên không cần hai con trỏ co giãn như bài 3 hay 424. Chỉ cần "thêm phải, bỏ trái" mỗi bước.
- **Lưu ý:** `len(s1) > len(s2)` → trả `false` ngay.

### 📘 Bài học buổi tối: K8s (Pod, Deployment, Service, Ingress, ConfigMap/Secret, HPA, probe)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | K8s giải quyết gì: bạn khai báo **trạng thái mong muốn** (desired state), các controller liên tục so với trạng thái thực và sửa cho khớp (reconciliation loop) | 🔴 T1 | Giải thích được "khai báo 3 replica, một Pod chết thì chuyện gì xảy ra?" | `kubernetes desired state reconciliation loop` |
| 2 | **Pod**: đơn vị nhỏ nhất, gồm 1 hoặc vài container dùng chung IP và volume. Pod là thứ **tạm thời**, chết là thay bằng Pod mới với IP mới | 🔴 T1 | Nói được vì sao không gọi thẳng IP của Pod | `kubernetes pod ephemeral` |
| 3 | **Deployment** → ReplicaSet → Pod: giữ đúng N bản sao, rolling update, rollback | 🔴 T1 | Vẽ được quan hệ 3 tầng. Biết rolling update tạo ReplicaSet mới rồi dần dần chuyển Pod sang | `kubernetes deployment replicaset rolling update` |
| 4 | **Service**: một địa chỉ ổn định (ClusterIP + tên DNS) chọn Pod theo **label selector** và chia tải cho chúng | 🔴 T1 | Giải thích được Pod thay đổi liên tục nhưng client vẫn gọi được qua Service | `kubernetes service label selector` |
| 5 | **Ingress**: điểm vào HTTP từ bên ngoài, định tuyến theo host/path tới các Service. Cần có Ingress controller (ví dụ ingress-nginx) | 🟡 T2 | So sánh với Service kiểu `LoadBalancer` (bảng bên dưới) | `kubernetes ingress vs loadbalancer service` |
| 6 | **ConfigMap / Secret**: tách cấu hình khỏi image, cùng một image chạy được ở mọi môi trường | 🔴 T1 | Biết nguyên tắc "config nằm ở môi trường, không nằm trong code" (12-factor). Biết Secret mặc định chỉ mã hoá base64, **không** phải mã hoá bảo mật | `12 factor config`, `kubernetes secret base64 not encrypted` |
| 7 | **Liveness vs Readiness probe** (và startup probe) | 🔴 T1 | Nói được hậu quả khác nhau khi mỗi loại thất bại (xem chi tiết) | `liveness vs readiness probe` |
| 8 | Graceful shutdown: khi xoá Pod, K8s gửi `SIGTERM`, chờ hết grace period (mặc định 30s) rồi mới `SIGKILL` | 🔴 T1 | Biết app phải bắt `SIGTERM` để ngừng nhận request mới và xử lý nốt request đang chạy. Không có cái này thì rolling update vẫn làm rớt request | `kubernetes graceful shutdown sigterm` |
| 9 | **HPA**: tự tăng giảm số Pod theo metric | 🟡 T2 | Hiểu cơ chế + điền bảng HPA vs VPA | `horizontal pod autoscaler how it works` |
| 10 | `requests` / `limits` tài nguyên | 🟢 T3 | Chỉ cần biết: scheduler dùng `requests` để xếp Pod; HPA tính % CPU dựa trên `requests`. Vượt **memory** limit → container bị kill (`OOMKilled`); vượt **CPU** limit → bị bóp (throttle), không bị kill. Không đặt `requests`/`limits` thì một Pod có thể ăn hết tài nguyên của node (noisy neighbor) | `kubernetes requests vs limits`, `OOMKilled cpu throttling` |
| 11 | Các loại Service (ClusterIP, NodePort, LoadBalancer), StatefulSet, DaemonSet, Job/CronJob | 🟢 T3 | Biết tên và một câu mô tả | kubernetes.io – *Concepts* |
| 12 | Thành phần control plane (API server, etcd, scheduler, controller manager) và kubelet trên node | 🟢 T3 | Biết tên. Người phỏng vấn Mid Backend hiếm khi hỏi sâu | `kubernetes components` |
| 13 | Cú pháp YAML manifest, `kubectl`, Helm chart | 🟢 T3 | Copy mẫu từ docs khi cần | kubernetes.io, helm.sh |

**Chi tiết cần hiểu**

- **Quan hệ Pod / Deployment / Service (mục 2–4):**

  ```
  Client ──► Service "order-api" (IP + DNS cố định)
                 │  chọn Pod có label app=order-api
                 ▼
         ┌── Pod ── Pod ── Pod ──┐   ← do ReplicaSet giữ đúng 3 bản
         └──────── ReplicaSet ───┘
                     ▲
               Deployment (image: order-api:v2, replicas: 3)
  ```

  - Deployment lo **"chạy bao nhiêu bản, phiên bản nào"**. Service lo **"gọi tới chúng bằng địa chỉ nào"**. Hai thứ này nối với nhau qua **label**, không trỏ trực tiếp vào nhau.
  - Rolling update: đổi image trong Deployment → tạo ReplicaSet mới → tăng dần Pod mới, giảm dần Pod cũ (theo `maxSurge` / `maxUnavailable`). Rollback = quay về ReplicaSet cũ.
- **Liveness vs Readiness (mục 7):**

  | Probe | Hỏi gì | Thất bại thì |
  |---|---|---|
  | Liveness | "Tiến trình còn sống không, hay đã treo?" | kubelet **restart container** |
  | Readiness | "Đã sẵn sàng nhận traffic chưa?" | Bị **gỡ khỏi Service** (không nhận request), **không** bị restart |
  | Startup | "Đã khởi động xong chưa?" (app khởi động chậm) | Tạm tắt 2 probe kia cho tới khi qua |

  - **Lỗi kinh điển:** liveness probe kiểm tra cả kết nối DB. DB chập chờn → mọi Pod bị restart cùng lúc → sự cố nhỏ thành sự cố lớn. Kiểm tra phụ thuộc bên ngoài (nếu cần) thì đặt ở readiness, liveness chỉ kiểm tra bản thân tiến trình.
- **Config và secret (mục 6), nguyên tắc 12-factor:**
  - Cùng **một image** chạy ở dev/staging/prod; khác nhau chỉ ở biến môi trường, ConfigMap, Secret. Build lại image cho từng môi trường là vi phạm *build once, deploy many* (D87).
  - Secret **không** bao giờ nằm trong image, trong Git hay trong `.env` được commit. Chỉ commit `.env.example`.
  - Secret của K8s mặc định chỉ base64. Muốn an toàn thật cần: bật mã hoá etcd (encryption at rest), giới hạn quyền đọc bằng RBAC, hoặc dùng secret manager bên ngoài (Vault, AWS Secrets Manager...) (🟢 T3, chỉ cần biết tên).
- **Graceful shutdown (mục 8), điểm hay bị bỏ sót:** K8s gửi `SIGTERM` **đồng thời** với việc gỡ Pod khỏi Service, nên vài giây đầu vẫn có thể có request mới tới. App nên: nhận `SIGTERM` → báo readiness fail / ngừng nhận request mới → xử lý nốt request và message đang dở → đóng kết nối DB → thoát, tất cả trong grace period. Hay gặp: thêm `preStop` sleep vài giây (🟢 T3).
- **HPA (mục 9):**
  - Đọc metric (mặc định CPU/memory qua metrics-server; có thể dùng custom metric như số message trong queue, QPS).
  - Công thức trong docs: `desiredReplicas = ceil(currentReplicas × currentMetric / targetMetric)`. Ví dụ: 3 Pod, CPU trung bình 90%, mục tiêu 60% → ceil(3 × 90/60) = 5 Pod.
  - Có `minReplicas` / `maxReplicas`. Scale down có cửa sổ ổn định (mặc định 5 phút) để tránh tăng giảm liên tục.
  - HPA chỉ hiệu quả khi service **stateless** và Pod khởi động nhanh (liên hệ D85: image nhỏ).

**🟡 Bảng so sánh T2: Service `LoadBalancer` vs Ingress**

Nhóm: *Deployment/Infra strategy (điểm vào từ bên ngoài)*. Trục chính: **đơn giản, mọi giao thức** vs **một điểm vào, định tuyến HTTP thông minh**. Tiêu chí extension chọn theo trục này thay vì dùng máy móc bộ Rollback speed / Risk exposure.

| Tiêu chí | Service `LoadBalancer` | Ingress |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Tầng hoạt động (L4 / L7) | | |
| Ext: Resource cost (mỗi service một LB của cloud?) | | |
| Ext: Định tuyến theo host/path, TLS tập trung? | | |

**🟡 Bảng so sánh T2: HPA vs VPA**

Nhóm: *Sharding/Scaling strategy*. Trục chính: **scale ngang (thêm Pod)** vs **scale dọc (Pod to hơn)**.

| Tiêu chí | HPA (Horizontal) | VPA (Vertical) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Có phải restart Pod khi scale không? | | |
| Ext: Loại workload phù hợp (stateless / stateful) | | |
| Ext: Resource cost | | |

**🔴 Thẻ Anki (T1)**

1. "Desired state + reconciliation loop" nghĩa là gì? Khai báo 3 replica mà một Pod chết thì chuyện gì xảy ra?
2. Vì sao client không gọi thẳng IP của Pod mà phải qua Service?
3. Deployment, ReplicaSet, Pod liên quan với nhau thế nào? Rolling update diễn ra ra sao?
4. Readiness probe thất bại và liveness probe thất bại: hậu quả khác nhau thế nào?
5. Vì sao không nên để liveness probe kiểm tra kết nối DB?
6. Vì sao phải tách config khỏi image? Secret trong K8s có được mã hoá mặc định không?
7. Khi xoá Pod, K8s làm gì? App cần xử lý `SIGTERM` thế nào?
8. (T2) Khi nào dùng Ingress thay vì mỗi service một `LoadBalancer`?
9. (T2) HPA dựa vào đâu để scale? Khi nào chọn VPA thay vì HPA?

**🟢 Tra cứu (T3):** kubernetes.io – *Concepts* (các trang *Pods*, *Deployments*, *Service*, *Ingress*, *ConfigMaps*, *Secrets*, *Horizontal Pod Autoscaling*) và trang Tasks *Configure Liveness, Readiness and Startup Probes*. Lưu 1 manifest Deployment + Service mẫu vào `notes/snippets.md`.

**Tài liệu:**
- kubernetes.io – *Concepts*: đọc *Overview*, *Workloads → Pods, Deployments*, *Services, Load Balancing, and Networking → Service, Ingress*
- kubernetes.io – *Horizontal Pod Autoscaling* (phần "Algorithm details" có công thức)
- ByteByteGo (YouTube): tìm video giải thích Kubernetes, dùng làm bài nghe tiếng Anh

**❓ Câu hỏi cuối bài**

1. Pod, Deployment, Service liên quan với nhau thế nào?
2. Readiness probe khác liveness probe ra sao?
3. HPA dựa vào đâu để scale?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Deployment khai báo 3 replica. Một Pod bị xoá (do rolling update hoặc node chết) đúng lúc đang xử lý request. K8s làm gì để quay về 3 Pod, và app phải làm gì để request đang chạy không bị rớt?
5. Vì sao cùng một image phải chạy được ở cả staging lẫn production? Config và secret nên đặt ở đâu? Secret của K8s có an toàn ngay từ đầu không?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** Deployment giữ "chạy bản nào, bao nhiêu bản" → tạo ReplicaSet → ReplicaSet giữ đúng N Pod. Service có IP/DNS cố định, chọn Pod bằng **label selector**, chia tải. Pod tạm thời, IP đổi liên tục → không gọi thẳng Pod. Rolling update = ReplicaSet mới tăng dần, cũ giảm dần; rollback = quay về ReplicaSet cũ.
- **Câu 2:** liveness fail → kubelet **restart** container; readiness fail → bị **gỡ khỏi Service**, không restart. Không để liveness kiểm tra DB (DB chập chờn → restart hàng loạt). Startup probe cho app khởi động chậm.
- **Câu 3:** metric (mặc định CPU/memory qua metrics-server, hoặc custom như độ dài queue, QPS). `desired = ceil(current × currentMetric / target)`, % CPU tính theo `requests`. Có min/max và cửa sổ ổn định khi scale down. Chỉ hiệu quả khi service stateless, Pod lên nhanh.
- **Câu 4:** controller thấy thực tế 2 ≠ mong muốn 3 → tạo Pod mới (vòng reconcile), Service tự trỏ sang Pod mới khi nó ready. Pod bị xoá nhận `SIGTERM` → ngừng nhận request mới, xử lý nốt, đóng kết nối, thoát trong grace period (30s) trước khi bị `SIGKILL`. Không bắt `SIGTERM` thì rolling update vẫn rớt request.
- **Câu 5:** *build once, deploy many*: image đã test ở staging chính là image lên prod, chỉ đổi config (12-factor: config nằm ở môi trường). Config → env/ConfigMap; secret → Secret hoặc secret manager, không nằm trong image/Git. Secret K8s mặc định chỉ base64, cần mã hoá etcd + RBAC.

</details>

---

## D87 (T4, 23/12): CI/CD, chiến lược deploy, migration DB không downtime

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 90' (Học 55' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h35'**

> ⚖️ Buổi tối chạm trần 90'. Nếu bài DSA xong sớm, dùng phần giờ làm còn lại để điền trước bảng T2 Blue-Green / Canary / Rolling. Mục 11 (GitOps) và phần "Đọc thêm" bỏ đầu tiên khi thiếu giờ.

### 🧩 DSA: [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)

- **Pattern (🔴 T1):** *Stack tính biểu thức hậu tố*. Gặp số → push. Gặp toán tử → pop 2 số, tính, push kết quả. Cuối cùng stack còn đúng 1 số.
- **Độ phức tạp:** O(n) thời gian, O(n) bộ nhớ.
- **Hai bẫy hay sai:**
  - **Thứ tự toán hạng:** pop lần đầu được `b`, lần hai được `a`, tính `a − b` và `a / b`. Làm ngược sẽ sai với `-` và `/`.
  - **Phép chia làm tròn về 0:** đề yêu cầu cắt phần thập phân về phía 0. Trong Python, `-7 // 2 = -4` (làm tròn xuống) là **sai**; dùng `int(a / b)` → `-3`. Java/C++/Go thì phép chia số nguyên đã làm tròn về 0.
- **Liên hệ:** Stack là cấu trúc của mọi bộ tính biểu thức và parser. Bài 20 (Valid Parentheses) ở Tuần 3 cùng họ.

### 📘 Bài học buổi tối: CI/CD + Blue-Green / Canary / Rolling + migration DB không downtime (expand–contract)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **CI** vs **Continuous Delivery** vs **Continuous Deployment** | 🔴 T1 | Phân biệt được bằng một câu mỗi cái (xem chi tiết) | `continuous integration vs delivery vs deployment` |
| 2 | **Pipeline chuẩn**: build → test → scan → deploy, và vì sao các bước nhanh, rẻ đặt trước | 🔴 T1 | Kể được đầy đủ các bước từ commit tới production (xem chi tiết) | `ci cd pipeline stages` |
| 3 | **Build once, deploy many**: build một artifact (image) duy nhất, đẩy qua staging → production, chỉ đổi config | 🔴 T1 | Giải thích được vì sao không build lại image riêng cho production | `build once deploy many` |
| 4 | **Deploy ≠ Release**: đưa code lên server khác với bật tính năng cho người dùng (feature flag) | 🔴 T1 | Nêu được lợi ích: tắt tính năng lỗi mà không cần rollback deploy | `decouple deployment from release feature flag` |
| 5 | **Blue-Green vs Canary vs Rolling** | 🟡 T2 | Điền bảng bên dưới, nói trôi chảy trong 1 phút | `blue green vs canary vs rolling deployment` |
| 6 | **Tương thích ngược giữa 2 phiên bản**: trong lúc rolling/canary, code cũ và code mới chạy **cùng lúc** trên **cùng một DB** | 🔴 T1 | Hiểu đây là lý do không được đổi schema theo kiểu "phá vỡ" trong một lần deploy | `backward compatible database migration rolling deploy` |
| 7 | **Expand–contract** (còn gọi *parallel change*): mở rộng schema → chuyển dần code → thu hẹp schema | 🔴 T1 | Tự viết được các bước đổi tên cột không downtime (xem chi tiết). Áp dụng được cho cả đổi API | `expand contract pattern`, `parallel change martin fowler` |
| 8 | Rollback code dễ, rollback DB khó: ưu tiên migration chỉ thêm (additive) và sửa tiến (forward fix) | 🔴 T1 | Giải thích được vì sao `DROP COLUMN` phải là bước **cuối cùng** và tách riêng | `database migration rollback strategy` |
| 9 | Cú pháp GitHub Actions / GitLab CI | 🟢 T3 | Tra khi làm lab D90 | docs.github.com – *Actions* |
| 10 | Công cụ migration (Flyway, Liquibase, Alembic, Prisma Migrate, golang-migrate...) | 🟢 T3 | Dùng công cụ của framework bạn đang làm | docs của công cụ |
| 11 | GitOps (ArgoCD, Flux) vs CI/CD kiểu push | 🟡 T2 (tuỳ chọn) | [Roadmap.md](../Roadmap.md) xếp T2. Ở đây chỉ cần **một câu**: CI kiểu push = pipeline tự chạy lệnh deploy vào cluster; GitOps = Git là nguồn sự thật, agent trong cluster tự kéo (pull) và reconcile cho khớp Git. Cài đặt chi tiết để sau 100 ngày ([Phụ lục B](../Roadmap_100_ngay.md)) | `gitops vs push based deployment` |

**Chi tiết cần hiểu**

- **CI / Delivery / Deployment (mục 1):**
  - **CI:** mọi người merge code vào nhánh chính thường xuyên; mỗi lần merge đều tự build + chạy test.
  - **Continuous Delivery:** code trên nhánh chính **luôn ở trạng thái deploy được**; lên production cần một người bấm nút duyệt.
  - **Continuous Deployment:** qua hết các bước tự động là **tự lên production**, không cần người duyệt.
- **Pipeline chuẩn (mục 2), từ commit tới production:**

  | # | Bước | Mục đích | Khi fail |
  |---|---|---|---|
  | 1 | Commit + mở Pull Request | Kích hoạt pipeline | — |
  | 2 | Lint + format + type check | Bắt lỗi rẻ nhất, chạy trong vài giây | Chặn merge |
  | 3 | Unit test | Kiểm tra logic | Chặn merge |
  | 4 | Build artifact / Docker image (tag theo commit SHA) | Tạo **một** artifact duy nhất | Chặn merge |
  | 5 | Integration test (DB, Redis thật chạy bằng container) | Kiểm tra phần nối với hạ tầng | Chặn merge |
  | 6 | Security scan (dependency, image) | Bắt thư viện có lỗ hổng | Chặn hoặc cảnh báo |
  | 7 | Code review + merge vào `main` | Người duyệt | — |
  | 8 | Push image lên registry → deploy staging → smoke test | Kiểm tra trong môi trường giống production | Dừng pipeline |
  | 9 | Chạy migration DB (dạng tương thích ngược) | Chuẩn bị schema | Dừng, sửa tiến |
  | 10 | Deploy production theo Rolling / Canary / Blue-Green | Giảm rủi ro | Rollback |
  | 11 | Theo dõi metric, log, error rate (SLO ở Tuần 12) | Phát hiện lỗi sau deploy | Rollback tự động hoặc thủ công |

  - Nguyên tắc sắp xếp: **nhanh và rẻ trước, chậm và đắt sau** → fail sớm, phản hồi nhanh cho dev.
- **Build once + rollback (mục 3, 4, 8):**
  - Image được tag **bất biến** theo commit SHA (không dùng `latest`). Staging và production chạy **đúng cùng một image**, chỉ khác config → cái đã test chính là cái lên production.
  - Nhờ vậy **rollback code** chỉ là deploy lại tag cũ (K8s: quay về ReplicaSet cũ, `kubectl rollout undo`), mất vài giây tới vài phút, không phải build lại gì.
  - Nhanh hơn nữa: tính năng lỗi nằm sau **feature flag** thì chỉ cần tắt flag, không cần deploy (deploy ≠ release).
  - **Rollback DB thì khác:** dữ liệu đã ghi theo schema mới không "quay lại" được dễ dàng. Vì vậy migration phải tương thích ngược để code cũ vẫn chạy được với schema mới → rollback code không cần rollback DB; lỗi ở DB thì sửa tiến (forward fix).
- **Cơ chế 3 chiến lược deploy (mục 5), chỉ là mô tả để bạn tự điền bảng:**
  - **Rolling:** thay dần từng nhóm instance cũ bằng instance mới (mặc định của K8s Deployment).
  - **Blue-Green:** dựng song song một bộ môi trường mới đầy đủ (green) bên cạnh bộ đang chạy (blue); kiểm tra xong thì chuyển toàn bộ traffic từ blue sang green một lần.
  - **Canary:** cho một phần nhỏ traffic (ví dụ 1% → 10% → 50% → 100%) vào phiên bản mới, so metric với phiên bản cũ, ổn mới tăng dần.
- **Expand–contract: đổi tên cột `name` → `full_name` không downtime (mục 7):**
  1. **Expand:** thêm cột `full_name` cho phép `NULL`. (Thêm cột nullable không có default là thao tác nhanh, không viết lại cả bảng.)
  2. **Deploy code v2:** ghi vào **cả hai** cột, vẫn đọc cột cũ.
  3. **Backfill:** copy dữ liệu cũ sang cột mới **theo từng lô nhỏ** (tránh khoá bảng lâu, tránh transaction khổng lồ).
  4. **Deploy code v3:** đọc cột mới, vẫn ghi cả hai (để còn rollback về v2 được).
  5. **Deploy code v4:** chỉ ghi cột mới.
  6. **Contract:** sau khi chắc chắn không cần rollback, `DROP COLUMN name`. Thêm ràng buộc `NOT NULL` hoặc index (dùng `CREATE INDEX CONCURRENTLY` trên Postgres) nếu cần.
  - Mỗi bước là một lần deploy riêng, và **ở mọi thời điểm, phiên bản code đang chạy và phiên bản ngay trước nó đều dùng được schema hiện tại**. Đó là điều kiện để rolling update và rollback an toàn.
  - Cùng tư duy áp dụng cho API: thêm field mới → client chuyển dần → bỏ field cũ (liên hệ versioning API ở Tuần 4).

**🟡 Bảng so sánh T2: Blue-Green vs Canary vs Rolling**

Nhóm: *Deployment/Infra strategy*. Trục chính của cuộc so sánh: **rủi ro** vs **chi phí / tốc độ**. Đây là 3 tiêu chí extension chuẩn của nhóm này trong [Prompt_Phan_Loai_Tier.md](../Prompt_Phan_Loai_Tier.md).

| Tiêu chí | Blue-Green | Canary | Rolling |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Rollback speed | | | |
| Ext: Resource cost | | | |
| Ext: Risk exposure (bao nhiêu người dùng gặp lỗi nếu bản mới hỏng?) | | | |
| Ext: Có lúc 2 phiên bản chạy song song không? (ảnh hưởng migration DB) | | | |

**🔴 Thẻ Anki (T1)**

1. Phân biệt CI, Continuous Delivery, Continuous Deployment.
2. Kể các bước của pipeline từ commit tới production. Vì sao lint/unit test đặt trước integration test?
3. "Build once, deploy many" là gì? Vì sao không build lại image cho production?
4. Deploy khác Release thế nào? Feature flag giúp gì?
5. Vì sao trong lúc rolling update không được đổi schema kiểu phá vỡ (đổi tên cột, xoá cột) trong một bước?
6. Kể 6 bước expand–contract để đổi tên một cột.
7. Vì sao `DROP COLUMN` phải là bước cuối cùng và tách riêng?
8. (T2) Khi nào chọn Canary thay vì Blue-Green?

**🟢 Tra cứu (T3):** docs.github.com – *Actions* (trang *Understanding GitHub Actions*, *Workflow syntax for GitHub Actions*), docs công cụ migration bạn dùng.

**Tài liệu:**
- ByteByteGo (YouTube/blog): tìm theo từ khoá `CI/CD pipeline`, `deployment strategies`
- martinfowler.com (bliki): *BlueGreenDeployment*, *CanaryRelease*, *ParallelChange* (chính là expand–contract), *ContinuousDelivery*
- Đọc thêm (khi dư giờ): *The Site Reliability Workbook* (sre.google), chương *Canarying Releases*

**❓ Câu hỏi cuối bài**

1. Một pipeline chuẩn gồm những bước nào?
2. So sánh Blue-Green, Canary, Rolling theo rủi ro, tốc độ rollback và chi phí.
3. Đổi tên một cột trong DB mà không gây downtime thì làm thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Bản mới vừa lên production thì error rate tăng vọt. Nêu 2 cách "quay lại" nhanh nhất mà không phải build lại gì. Vì sao *build once* + tag theo commit SHA làm việc này dễ, còn deploy bằng `latest` thì không?
5. Continuous Delivery khác Continuous Deployment ở đâu? Team chưa có bộ test tự động đáng tin thì nên chọn cái nào, vì sao?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** commit/PR → lint + type check → unit test → build **một** image (tag SHA) → integration test → security scan → review + merge → push registry, deploy staging, smoke test → migration tương thích ngược → deploy prod (rolling/canary/blue-green) → theo dõi metric, rollback nếu cần. Nhanh/rẻ trước, chậm/đắt sau để fail sớm.
- **Câu 2:** Rolling: rẻ, rollback chậm (phải lăn lại), lỗi lan dần. Blue-Green: rollback tức thì (chuyển traffic về), tốn gấp đôi tài nguyên, lỗi trúng 100% người dùng nếu không phát hiện trước. Canary: rủi ro nhỏ nhất (1% trước), cần metric tốt + điều phối traffic, chậm. Cả 3 đều có lúc 2 phiên bản dùng chung một DB.
- **Câu 3:** expand (thêm cột nullable) → code ghi cả hai, đọc cũ → backfill theo lô → đọc mới, ghi cả hai → chỉ ghi mới → contract (`DROP` cột cũ, tách riêng, cuối cùng). Mỗi bước một deploy; bản đang chạy và bản ngay trước đều dùng được schema hiện tại.
- **Câu 4:** (1) deploy lại image tag cũ / `rollout undo`; (2) tắt feature flag. Tag SHA bất biến → biết chính xác "bản trước" là gì, image đã từng chạy ổn. `latest` bị ghi đè → không biết bản nào đang chạy, không có "bản trước" để quay về, các node có thể chạy bản khác nhau. DB không rollback, chỉ sửa tiến.
- **Câu 5:** Delivery: luôn deploy được, lên prod cần người bấm duyệt. Deployment: qua hết bước tự động là tự lên prod. Chưa có test tin được → Continuous Delivery (giữ bước duyệt), đầu tư test + canary + monitoring trước rồi mới tự động hoàn toàn.

</details>

---

## D88 (T5, 24/12): Behavioral – viết 5 câu chuyện STAR

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 90' (Học 60' + Ghi chú/Anki 10' + Tự kiểm tra 20') · **Tổng 2h35'**

> ⚖️ Viết 5 phiếu (~12'/phiếu) đã chiếm 60'. Tối nay chỉ ghi âm + chấm rubric **2 chuyện mạnh nhất** (Tự kiểm tra 20'). 3 chuyện còn lại ghi âm và chấm ở D91. Nếu còn giờ làm sau DSA, gạch trước chất liệu (ticket, số liệu) cho các phiếu.

### 🧩 DSA: [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

- **Pattern (🔴 T1):** *DFS hậu thứ tự (post-order), trả thông tin từ con lên cha*. Mỗi node hỏi hai cây con: "bên con có tìm thấy p hoặc q không?".
- **Cách giải:**
  - Nếu node là `null`, `p` hoặc `q` → trả chính node đó.
  - Gọi đệ quy trái và phải. Nếu **cả hai** khác `null` → node hiện tại là LCA. Nếu chỉ một bên khác `null` → trả bên đó lên.
  - O(n) thời gian, O(h) bộ nhớ cho stack đệ quy (h là chiều cao, xấu nhất O(n) khi cây lệch).
  - Cách khác: DFS/BFS lưu `parent` của mọi node, đi từ p lên gốc bỏ vào set, rồi đi từ q lên tới node đầu tiên có trong set → O(n) thời gian, O(n) bộ nhớ. Dùng được khi cây rất sâu, sợ tràn stack.
- **So sánh với bài 235 (Tuần 5, LCA của BST):** BST có thứ tự nên chỉ cần đi một nhánh theo giá trị → O(h). Cây thường không có thứ tự nên phải duyệt cả hai nhánh → O(n). Người phỏng vấn rất hay hỏi câu này.

### 📘 Bài học buổi tối: Behavioral – STAR, viết 5 câu chuyện

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Khung STAR**: Situation → Task → Action → Result (+ Learning) và tỷ lệ thời gian cho từng phần | 🔴 T1 | Tự nói được khung mà không nhìn. Phần Action chiếm nhiều thời gian nhất | `STAR method interview` |
| 2 | Nói **"tôi"** chứ không chỉ "team"; mọi Result phải có **số liệu** hoặc hệ quả đo được | 🔴 T1 | Tự bắt lỗi được trong bản ghi âm của chính mình | `behavioral interview I vs we` |
| 3 | **Ma trận câu chuyện × câu hỏi**: 5 câu chuyện gốc phủ được 15+ câu hỏi behavioral phổ biến | 🔴 T1 | Nghe một câu hỏi lạ là chọn được ngay chuyện nào phù hợp | `behavioral interview story bank` |
| 4 | Những điều cần tránh: đổ lỗi, nói xấu công ty/đồng nghiệp cũ, chuyện không có kết quả, "điểm yếu" giả tạo kiểu "tôi quá cầu toàn" | 🔴 T1 | Nhận ra được trong câu trả lời của mình | `behavioral interview mistakes` |
| 5 | Nội dung cụ thể từng câu chuyện: **gạch đầu dòng + số liệu** | 🔴 T1 | Nhớ các ý chính và con số, **không học thuộc từng câu chữ** | — |
| 6 | Câu chữ chi tiết của từng câu chuyện | 🟢 T3 | Để trong `notes/stories.md`, đọc lại trước buổi phỏng vấn. Học thuộc từng chữ sẽ nghe như đọc bài | — |
| 7 | Bộ giá trị riêng của từng công ty (ví dụ Amazon Leadership Principles) | 🟢 T3 | Tra khi chuẩn bị cho công ty cụ thể, gắn lại 5 câu chuyện vào bộ giá trị đó | trang tuyển dụng của công ty |

**Chi tiết cần hiểu**

- **Khung STAR, cho câu chuyện dài khoảng 2 phút:**

  | Phần | Trả lời câu hỏi | Thời lượng | Lỗi hay gặp |
  |---|---|---|---|
  | **S**ituation | Ở đâu, dự án gì, quy mô thế nào, vấn đề là gì? | ~15–20s | Kể bối cảnh quá dài |
  | **T**ask | **Tôi** chịu trách nhiệm gì? Mục tiêu đo được là gì? | ~10s | Lẫn với Situation |
  | **A**ction | **Tôi** đã làm gì, theo thứ tự nào, vì sao chọn cách đó, đã cân nhắc phương án nào khác? | ~60–70s | Nói "chúng tôi" suốt; kể chung chung |
  | **R**esult | Kết quả bằng số (thời gian, %, tiền, số ticket, số sự cố). Tác động tới người dùng/team | ~15–20s | Không có số; bỏ quên |
  | **L**earning | Bài học rút ra, lần sau sẽ làm khác gì | ~10s | Bỏ qua (người phỏng vấn Mid/Senior rất thích phần này) |

- **Công thức mở đầu:** một câu tóm tắt trước khi kể. Ví dụ: *"Em xin kể lần em giảm thời gian phản hồi API danh sách đơn từ khoảng 2 giây xuống dưới 100ms."* Người nghe biết ngay đích đến.
- **Nếu không có số liệu chính xác:** dùng số ước lượng trung thực và nói rõ là ước lượng ("khoảng", "cỡ"). **Không bịa số.** Người phỏng vấn sẽ hỏi đào sâu.

**📝 5 phiếu viết câu chuyện** (viết vào `notes/stories.md`, mỗi chuyện một mục)

Mỗi phiếu điền theo mẫu sau:

```
## Chuyện #N: <tên ngắn>
Câu mở đầu (1 câu tóm tắt):
S:
T:
A: (3–4 gạch đầu dòng, mỗi dòng bắt đầu bằng "Tôi ...")
R: (có số)
L:
Số liệu đã kiểm chứng ở đâu (ticket, dashboard, notes/...):
Câu hỏi đào sâu có thể bị hỏi + câu trả lời ngắn:
Dùng được cho các câu hỏi behavioral: (#... trong danh sách bên dưới)
```

| # | Chủ đề (theo lộ trình tổng) | Gợi ý để tìm chất liệu | Câu hỏi đào sâu nên chuẩn bị |
|---|---|---|---|
| 1 | **Dự án bạn tự hào nhất** | Dự án ở công ty có tác động rõ nhất (doanh thu, số người dùng, thời gian tiết kiệm). Nếu chưa có, dùng dự án Mini Order Service | Kiến trúc thế nào? Phần khó nhất là gì? Nếu làm lại sẽ khác gì? |
| 2 | **Bug khó nhất** | Bug khó tái hiện: race condition, chỉ xảy ra trên production, lỗi dữ liệu. Nhớ lại **quy trình điều tra**: giả thuyết → kiểm chứng → loại trừ | Làm sao bạn khoanh vùng được? Đã thêm gì để lần sau phát hiện sớm hơn (log, alert, test)? |
| 3 | **Bất đồng với đồng nghiệp** | Tranh luận về thiết kế, về estimate, về chất lượng code khi review. Chọn chuyện kết thúc **có đồng thuận** hoặc bạn đã **thay đổi quan điểm vì dữ liệu** | Nếu người kia vẫn không đồng ý thì sao? Quan hệ với người đó sau này thế nào? |
| 4 | **Một sai lầm và bài học** | Một lần làm hỏng: deploy lỗi, estimate sai, quên edge case. Chọn lỗi **thật** nhưng **không quá nghiêm trọng**, và nhấn vào việc bạn đã khắc phục + ngăn tái diễn | Bạn phát hiện thế nào? Đã báo cho ai, khi nào? Quy trình thay đổi gì sau đó? |
| 5 | **Tối ưu hiệu năng** | Dùng lab Tuần 6 (`notes/` API danh sách đơn trước/sau) + chuyện đã viết ở chốt tuần 6 câu 3. Có EXPLAIN trước/sau, số liệu p95 | Vì sao chọn index đó mà không cache? Có đo trên dữ liệu thật không? Đánh đổi gì (tốc độ ghi, dung lượng)? |

**Danh sách câu hỏi behavioral phổ biến** (gắn số chuyện dùng được, bạn điều chỉnh theo chuyện thật của mình)

| # | Câu hỏi | Chuyện dùng được |
|---|---|---|
| 1 | Kể về dự án bạn tự hào nhất | 1, 5 |
| 2 | Kể về một vấn đề kỹ thuật khó nhất bạn từng giải quyết | 2, 5 |
| 3 | Kể về một lần bạn bất đồng với đồng nghiệp hoặc cấp trên | 3 |
| 4 | Kể về một lần bạn mắc lỗi | 4 |
| 5 | Kể về một lần bạn cải thiện hiệu năng / chất lượng hệ thống | 5, 2 |
| 6 | Kể về một lần bạn phải làm việc với deadline rất gấp | 1, 4 |
| 7 | Kể về một lần bạn nhận feedback tiêu cực. Bạn đã làm gì? | 4, 3 |
| 8 | Kể về một lần bạn chủ động làm việc ngoài phạm vi được giao | 5, 1 |
| 9 | Kể về một lần yêu cầu không rõ ràng. Bạn xử lý thế nào? | 1, 3 |
| 10 | Kể về một lần bạn phải học một công nghệ mới rất nhanh | 1 |
| 11 | Kể về một lần bạn giúp đỡ hoặc hướng dẫn đồng nghiệp | 2, 3 |
| 12 | Kể về một lần bạn phải đánh đổi giữa chất lượng và tốc độ | 4, 1 |
| 13 | Kể về một sự cố production bạn tham gia xử lý | 2, 4 |
| 14 | Điểm mạnh và điểm yếu của bạn là gì? | Điểm yếu thật + việc đang làm để cải thiện (ví dụ lộ trình 100 ngày này) |
| 15 | Vì sao bạn muốn rời công ty hiện tại? | Không kể chuyện; trả lời hướng về phía trước (muốn học gì, làm gì), **không** nói xấu nơi cũ |
| 16 | Kể về một lần bạn không đồng ý với quyết định của lead nhưng vẫn phải làm theo | 3. Nhấn vào: nêu ý kiến **có dữ liệu**, đúng kênh, sau đó **cam kết làm hết sức** khi đã chốt (*disagree and commit*); nếu sau đó dữ liệu chứng minh ai đúng thì xử lý thế nào |
| 17 | Kể về một lần có nhiều việc gấp cùng lúc. Bạn ưu tiên thế nào? | 1, 4. Nhấn vào: tiêu chí ưu tiên (ảnh hưởng người dùng, deadline cứng), **báo sớm** cho người liên quan việc gì bị lùi |
| 18 | Kể về một dự án/tính năng thất bại hoặc không đạt mục tiêu | 4. Khác câu 4 ở chỗ kết quả chung không tốt; vẫn phải có phần bạn làm gì để giảm thiệt hại và bài học cụ thể |

- **Kiểm tra độ phủ:** câu 6 (deadline gấp) và câu 10 (học công nghệ mới rất nhanh) là hai câu hay bị hỏi nhưng dễ "gượng" nếu dùng chuyện 1. (Tuỳ chọn) Viết thêm **chuyện #6** chuyên cho hai câu này, ví dụ: lần phải học một công nghệ trong vài ngày để kịp release.

**Rubric tự chấm** (ghi âm từng chuyện, nghe lại rồi chấm)

| Tiêu chí | 0 điểm | 1 điểm | 2 điểm |
|---|---|---|---|
| Cấu trúc STAR | Kể lộn xộn | Có đủ phần nhưng S quá dài hoặc thiếu R | Rõ 4 phần, có câu mở đầu tóm tắt |
| "Tôi" vs "team" | Toàn "chúng tôi" | Lẫn lộn | Rõ ràng việc **tôi** làm, vẫn ghi nhận team |
| Số liệu | Không có | Có nhưng mơ hồ ("nhanh hơn nhiều") | Có số cụ thể, kiểm chứng được |
| Thời lượng | > 3 phút | 2–3 phút | ≤ 2 phút |
| Learning | Không có | Chung chung ("rút kinh nghiệm") | Cụ thể: đã thay đổi gì trong cách làm |
| Thái độ | Đổ lỗi, nói xấu | Trung tính | Chủ động nhận trách nhiệm, tôn trọng người khác |

- **Đạt:** ≥ 10/12 cho mỗi chuyện. Chuyện nào < 10 thì sửa phiếu rồi ghi âm lại.
- **Mẹo tiếng Anh:** nếu công ty phỏng vấn bằng tiếng Anh, ghi âm thêm bản tiếng Anh của 2 chuyện mạnh nhất, tính vào giờ tiếng Anh của ngày.

**🔴 Thẻ Anki (T1)**

1. Kể 4 (+1) phần của STAR và phần nào chiếm nhiều thời gian nhất.
2. Vì sao phải nói "tôi" thay vì "chúng tôi"?
3. Không có số liệu chính xác thì nói thế nào?
4. Kể 3 điều cần tránh khi trả lời câu hỏi behavioral.
5. Mỗi chuyện trong 5 chuyện: câu mở đầu + con số chính là gì? (5 thẻ, mỗi chuyện một thẻ)

**Tài liệu:**
- Tech Interview Handbook (techinterviewhandbook.org): phần *Behavioral interviews* (cách chuẩn bị, STAR, danh sách câu hỏi hay gặp)
- Lab Tuần 6 và chuyện STAR đã viết ở chốt tuần 6 (dùng lại cho chuyện #5)

**❓ Câu hỏi cuối bài**

- Viết 5 câu chuyện: dự án bạn tự hào nhất / bug khó nhất / bất đồng với đồng nghiệp / một sai lầm và bài học / tối ưu hiệu năng (dùng lab tuần 6).
- Tự kiểm tra: mỗi chuyện ≤ 2 phút, có số liệu, nói rõ **"tôi"** đã làm gì chứ không chỉ "team".

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Người phỏng vấn hỏi một câu bạn chưa chuẩn bị: *"Kể về một lần bạn phải học một công nghệ mới rất nhanh."* Bạn chọn chuyện nào trong 5 chuyện, và chỉnh phần nào của STAR để chuyện khớp với câu hỏi?
5. Nghe lại bản ghi của chính mình: nêu 3 dấu hiệu khiến câu trả lời bị chấm thấp dù câu chuyện hoàn toàn có thật.

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Viết 5 câu chuyện:** mỗi phiếu có câu mở đầu 1 câu, S/T ngắn, A 3–4 dòng bắt đầu bằng "Tôi", R có số (ghi nguồn), L cụ thể; có sẵn câu trả lời cho câu hỏi đào sâu; ghi rõ phủ câu hỏi nào trong danh sách.
- **Tự kiểm tra:** ≤ 2 phút; Action ~60–70s là phần dài nhất; có số hoặc ước lượng trung thực ("khoảng"); nói "tôi" cho việc mình làm, vẫn ghi nhận team; rubric ≥ 10/12.
- **Câu 4:** dùng ma trận chuyện × câu hỏi, chọn chuyện có đoạn phải học/tìm hiểu gấp (thường chuyện 1 hoặc 2). Giữ nguyên S/R, **đổi trọng tâm Action**: học bằng cách nào, trong bao lâu, áp dụng ra sao. Câu mở đầu phải trả lời thẳng câu hỏi. Learning: cách học nhanh mình rút ra.
- **Câu 5:** nói "chúng tôi" suốt; Result không có số / mơ hồ; kể bối cảnh quá dài, > 3 phút; đổ lỗi hoặc nói xấu người khác; không có Learning; chuyện không trả lời đúng câu hỏi.

</details>

---

## D89 (T6, 25/12): Giới thiệu bản thân 2 phút + trình bày dự án + viết lại CV

**⏱ Ước tính:** Giờ làm 65' (DSA 45' + Anki 20') · Tối 90' (Học 55' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h35'**

> ⚖️ Học 55' = viết bài giới thiệu 15' + khung trình bày dự án 20' + viết lại CV 20'. CV chỉ cần sửa **3–5 bullet mạnh nhất** tối nay; phần còn lại làm nốt ở D91 nếu thiếu giờ.

### 🧩 DSA: [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/)

- **Pattern (🔴 T1):** *Backtracking phân hoạch (partition)*. Ở mỗi vị trí `start`, thử mọi điểm cắt `end`; nếu `s[start..end]` là palindrome thì chọn nó → đệ quy từ `end + 1` → bỏ chọn. Cùng khung "chọn → đệ quy → bỏ chọn" ở Tuần 8.
- **Độ phức tạp:** O(n · 2ⁿ) thời gian. Có tối đa 2ⁿ⁻¹ cách cắt, mỗi cách tốn O(n) để copy kết quả/kiểm tra palindrome.
- **Tối ưu:** tính trước bảng `isPal[i][j]` bằng DP trong O(n²) (`isPal[i][j] = s[i] == s[j] and isPal[i+1][j−1]`), để mỗi lần kiểm tra palindrome chỉ còn O(1). Độ phức tạp tổng không đổi về bậc nhưng nhanh hơn thực tế. Nối được với bài 5 (Longest Palindromic Substring) ở Tuần 11.
- **Lưu ý:** khi thêm vào kết quả phải **copy** danh sách hiện tại, không thêm tham chiếu.

### 📘 Bài học buổi tối: Giới thiệu bản thân 2 phút + trình bày dự án xuyên suốt + viết lại CV có số liệu

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Khung giới thiệu bản thân**: Hiện tại → Quá khứ → Vì sao vị trí này | 🔴 T1 | Nói trơn tru trong 2 phút, không nhìn giấy | `tell me about yourself present past future` |
| 2 | **Khung trình bày dự án 5 phút**: bài toán → kiến trúc → 3 quyết định kỹ thuật + trade-off → số liệu → nếu làm lại | 🔴 T1 | Trình bày được Mini Order Service theo đúng khung, có sơ đồ | `how to present a project in interview` |
| 3 | Câu trả lời cho 3 câu hỏi dự án hay gặp (❓ bên dưới) | 🔴 T1 | Trả lời ngay, có lý do và trade-off | — |
| 4 | **Công thức viết bullet CV**: động từ hành động + làm gì + kết quả đo được | 🟢 T3 | Lưu mẫu, tra khi viết CV. Không cần nhớ | `resume bullet XYZ formula` |
| 5 | Câu "Vì sao chọn công ty này" cho từng công ty | 🟢 T3 | Chuẩn bị riêng trước mỗi buổi phỏng vấn (đọc blog kỹ thuật, sản phẩm của công ty) | — |

**Chi tiết cần hiểu**

- **Giới thiệu bản thân 2 phút (mục 1)**, khoảng 250–300 từ tiếng Việt:

  | Phần | Thời lượng | Nội dung | Ví dụ khung câu |
  |---|---|---|---|
  | **Hiện tại** | ~40s | Vai trò, công ty/lĩnh vực, stack chính, **1 thành tựu có số** | *"Em là Backend Developer, khoảng X năm kinh nghiệm, hiện làm ở <công ty> trong mảng <lĩnh vực>. Em chủ yếu làm <ngôn ngữ/framework> với PostgreSQL, Redis... Gần đây em <thành tựu có số>."* |
  | **Quá khứ** | ~40s | Hành trình ngắn, 1–2 điểm nổi bật liên quan tới vị trí đang ứng tuyển | *"Trước đó em <kinh nghiệm>. Dự án em học được nhiều nhất là <dự án>, nơi em <việc cụ thể>."* |
  | **Vì sao vị trí này** | ~30s | Bạn đang hướng tới điều gì và vì sao công ty/vị trí này khớp | *"Thời gian gần đây em tập trung vào <thiết kế hệ thống / hiệu năng DB / hệ thống phân tán>, có làm dự án cá nhân <tên>. Em muốn làm ở môi trường <quy mô / bài toán> như bên mình vì <lý do cụ thể về công ty>."* |
  | **Kết** | ~10s | Mở đường cho câu hỏi tiếp | *"Em có thể kể chi tiết hơn về <dự án> nếu anh/chị quan tâm."* |

  - Không kể lại toàn bộ CV theo thứ tự thời gian. Không bắt đầu từ thời đi học (trừ khi mới ra trường).
  - Câu kết nên "móc" vào câu chuyện mạnh nhất của bạn, để người phỏng vấn hỏi đúng chỗ bạn đã chuẩn bị.
  - Nên chuẩn bị thêm bản tiếng Anh (tính vào giờ tiếng Anh).
- **Trình bày dự án 5 phút (mục 2)**, dùng cho Mini Order Service và cho 1 dự án ở công ty:

  | Bước | Thời lượng | Nội dung |
  |---|---|---|
  | 1. Bài toán | ~30s | Hệ thống làm gì, cho ai, yêu cầu phi chức năng quan trọng nhất (ví dụ: không bán quá tồn kho, API đọc nhanh) |
  | 2. Kiến trúc | ~1 phút | Vẽ sơ đồ: client → Nginx → 2 instance app → Postgres / Redis / RabbitMQ → consumer |
  | 3. 3 quyết định kỹ thuật | ~2 phút | Mỗi quyết định: **vấn đề → phương án đã cân nhắc → chọn gì → trade-off**. Gợi ý: khoá tồn kho (Tuần 7), cache-aside (Tuần 8), consumer idempotent + DLQ (Tuần 11) |
  | 4. Số liệu | ~1 phút | Trước/sau khi có index, cache hit rate, kết quả test đồng thời |
  | 5. Nếu làm lại | ~30s | Điều bạn sẽ làm khác, cho thấy bạn tự phản biện được |

- **Công thức bullet CV (mục 4):** **Động từ hành động + làm gì (bằng công nghệ gì) + kết quả đo được**. Tương tự công thức XYZ của Google: *"Accomplished [X] as measured by [Y], by doing [Z]"*.

  | ❌ Chưa tốt | ✅ Tốt hơn (thay số bằng số đo thật của bạn) |
  |---|---|
  | Làm API danh sách đơn hàng | **Tối ưu** API danh sách đơn hàng bằng composite index và loại bỏ N+1 query, **giảm p95 từ ~1,2s xuống ~80ms** trên bảng 5 triệu dòng |
  | Dùng Redis để cache | **Triển khai** cache-aside bằng Redis cho API chi tiết sản phẩm, **đạt cache hit rate ~90%, giảm ~70% tải đọc** lên PostgreSQL |
  | Xử lý bán quá tồn kho | **Khắc phục** lỗi bán quá tồn kho khi có request đồng thời bằng `SELECT ... FOR UPDATE` / cập nhật có điều kiện, **0 đơn vượt tồn kho** qua bài test 500 request song song |
  | Làm message queue | **Tách** gửi email khỏi luồng đặt hàng bằng RabbitMQ với consumer idempotent và DLQ, **giảm thời gian phản hồi đặt hàng ~X ms** |
  | Viết CI | **Xây dựng** pipeline GitHub Actions (lint, test, build image), **rút thời gian review** vì mọi PR đều có kết quả test tự động |

  - Động từ nên dùng: *thiết kế, xây dựng, triển khai, tối ưu, giảm, tăng, tự động hoá, tách, di chuyển (migrate), hướng dẫn*. Tránh: *tham gia, hỗ trợ, phụ trách* (không nói được bạn đã làm gì).
  - **Mọi con số phải có nguồn** (notes lab, dashboard, ticket). Người phỏng vấn sẽ hỏi "đo bằng cách nào?".
  - CV Mid Backend: 1 trang (tối đa 2), mỗi vị trí 3–5 bullet, bullet mạnh nhất lên đầu. Dự án cá nhân đặt link GitHub.
- **Gợi ý trả lời 3 câu hỏi dự án (mục 3):**
  - *Vì sao chọn Postgres, Redis, RabbitMQ?* → Gắn mỗi công nghệ với **một yêu cầu cụ thể** + phương án thay thế đã cân nhắc (ví dụ: đơn hàng cần transaction/ACID → Postgres; đọc nhiều, chấp nhận dữ liệu cũ vài giây → Redis; tác vụ cần retry/DLQ, không cần replay log → RabbitMQ thay vì Kafka).
  - *Traffic tăng 100 lần, sửa gì đầu tiên?* → **Đo trước, đoán sau**: xác định nút cổ chai bằng metric (DB CPU, connection, p95 từng endpoint). Sau đó đi theo thứ tự đã học: index/query → cache → scale ngang app (đã stateless) → read replica → queue để san tải ghi → sharding là bước cuối.
  - *Làm lại từ đầu sẽ khác gì?* → Chọn 1–2 điều thật (ví dụ: có observability từ đầu, viết integration test sớm hơn, thiết kế idempotency key ngay từ API đầu tiên) + lý do.

**🔴 Thẻ Anki (T1)**

1. Khung giới thiệu bản thân 2 phút gồm những phần nào? Mỗi phần bao lâu?
2. Khung trình bày dự án 5 phút gồm những bước nào?
3. 3 quyết định kỹ thuật của Mini Order Service là gì? Trade-off của từng cái?
4. Traffic tăng 100 lần: bạn làm gì trước tiên và theo thứ tự nào?

**🟢 Tra cứu (T3):** công thức bullet CV và bảng ví dụ ở trên → lưu vào `notes/cv-bullets.md`.

**Tài liệu:**
- Tech Interview Handbook (techinterviewhandbook.org): phần *Self introduction* và phần *Resume*
- File `notes/` của các lab Tuần 5–11 (lấy số liệu cho CV)

**❓ Câu hỏi cuối bài**

1. Vì sao bạn chọn Postgres, Redis, RabbitMQ?
2. Nếu traffic tăng 100 lần, bạn sửa gì đầu tiên?
3. Nếu làm lại từ đầu, bạn sẽ làm khác điều gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Nói bài giới thiệu bản thân trong 2 phút. Sau đó tự trả lời: 3 phần là gì, phần nào có con số, câu kết "móc" người phỏng vấn vào đâu, và vì sao không kể CV theo thứ tự thời gian?
5. Trình bày Mini Order Service theo khung 5 bước trong 5 phút. Với từng quyết định kỹ thuật, bạn có nói đủ "vấn đề → phương án đã cân nhắc → chọn gì → cái giá phải trả" không?

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** gắn mỗi công nghệ với **một yêu cầu**: đơn hàng cần transaction/ACID, ràng buộc → Postgres; đọc nhiều, chấp nhận cũ vài giây, rate limit → Redis; tác vụ nền cần retry/DLQ, không cần replay → RabbitMQ (thay vì Kafka). Nêu phương án thay thế đã cân nhắc.
- **Câu 2:** **đo trước**: metric DB CPU, connection, p95 từng endpoint để tìm nút cổ chai. Rồi theo thứ tự: index/query → cache → scale ngang app (đã stateless) → read replica → queue san tải ghi → sharding cuối cùng.
- **Câu 3:** 1–2 điều thật + lý do: observability từ đầu, integration test sớm, idempotency key ngay từ API đầu. Cho thấy tự phản biện, không phải "không có gì cần sửa".
- **Câu 4:** Hiện tại (~40s, vai trò + stack + 1 thành tựu có số) → Quá khứ (~40s, 1–2 điểm liên quan vị trí) → Vì sao vị trí này (~30s) → câu kết mời hỏi về chuyện mạnh nhất. Không kể CV theo thời gian vì dài, không nhấn được điểm liên quan.
- **Câu 5:** bài toán + yêu cầu phi chức năng → sơ đồ kiến trúc → 3 quyết định (khoá tồn kho, cache-aside, consumer idempotent + DLQ), mỗi cái có phương án khác + trade-off → số liệu trước/sau → nếu làm lại.

</details>

---

## D90 (T7, 26/12): Mock coding + Lab

**⏱ Ước tính:** Mock coding 60' · Lab 2h30' · Ôn ⚠️ 10' · Anki 20' · **Tổng 4h00'**

> ⚖️ Lab gốc 2h45' (60' + 60' + 45') cộng mock và Anki sẽ thành 4h15', quá trần 4h. Đã rút Bước 3 (README) xuống 30': làm sơ đồ + mô tả + cách chạy + endpoint + "Quyết định kỹ thuật"; hai mục "Số liệu" và "Nếu có thêm thời gian" dời sang D91. Bước 4 còn 10'.

### 🧩 DSA: Mock coding, 2 bài trong 60'

- **Luật chơi:** chọn 2 bài Medium **chưa làm**, thuộc 2 nhóm pattern khác nhau. Bấm giờ 60' cho cả hai. **Nói to** suy nghĩ của mình như đang có người phỏng vấn. Không xem lời giải trong 60'.
- **Kho đề gợi ý** (chủ yếu từ NeetCode 150, không trùng với các bài trong lộ trình; bỏ qua bài đã dùng ở D83):
  - Array / Hashing: [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)
  - Stack: [853. Car Fleet](https://leetcode.com/problems/car-fleet/)
  - Binary Search: [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/)
  - Linked List: [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/)
  - Tree: [1448. Count Good Nodes in Binary Tree](https://leetcode.com/problems/count-good-nodes-in-binary-tree/), [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
  - Graph: [130. Surrounded Regions](https://leetcode.com/problems/surrounded-regions/), [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)
  - DP: [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)
  - Greedy / Intervals: [763. Partition Labels](https://leetcode.com/problems/partition-labels/)
- **Quy trình mỗi bài (~30'):** đọc đề + hỏi làm rõ (3') → nêu brute force + độ phức tạp (3') → tìm cách tốt hơn (7') → code (12') → tự chạy tay 1 ví dụ + edge case (5').
- Sai hoặc quá giờ → ghi vào Error List, làm lại ở D91 hoặc Tuần 14.

### 🛠 Lab (3h): Docker hoá + GitHub Actions CI + README có sơ đồ kiến trúc

> Toàn bộ cú pháp dưới đây là 🟢 **T3**: copy, sửa theo stack của bạn, lưu vào `notes/snippets.md`. Thứ cần hiểu là **vì sao** mỗi bước ở đó (đã học ở D85, D87).

**Bước 1: Dockerfile multi-stage cho app (60')**

Khung dưới đây dùng Node.js làm ví dụ. Nếu bạn dùng ngôn ngữ khác, giữ nguyên **cấu trúc 2 stage**, chỉ đổi base image và lệnh build (Go: build ra binary rồi copy sang image tối giản; Java: build jar bằng Maven/Gradle rồi copy sang image JRE; Python: cài dependency vào thư mục riêng rồi copy sang).

```dockerfile
# ---- Stage 1: build (có đủ công cụ, dev dependency) ----
FROM node:<version>-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./   # 1. file khai báo dependency trước → tận dụng cache
RUN npm ci                                # 2. cài dependency (chậm nhất, ít đổi)
COPY . .                                  # 3. source code (hay đổi nhất) để sau cùng
RUN npm run build                         # 4. build ra dist/

# ---- Stage 2: runtime (chỉ những gì cần để chạy) ----
FROM node:<version>-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev                     # chỉ dependency production
COPY --from=build /app/dist ./dist        # chỉ lấy kết quả build từ stage 1
USER node                                 # không chạy bằng root
EXPOSE 3000
CMD ["node", "dist/main.js"]              # dạng exec → app là PID 1, nhận được SIGTERM
```

- Thêm `.dockerignore`: `node_modules`, `.git`, `.env`, `dist`, file test/log. Thiếu file này thì `COPY . .` kéo theo cả rác, làm vỡ cache và có thể lộ secret.
- **Kiểm tra:**
  - [ ] `docker build` thành công. Sửa 1 dòng code rồi build lại: bước `npm ci` hiện `CACHED`.
  - [ ] So kích thước image 1 stage và 2 stage (`docker images`), ghi số vào `notes/docker-lab.md`.
  - [ ] Thêm service `app` vào `docker-compose.yml` đã có (Postgres, Redis, RabbitMQ, Nginx từ các tuần trước). Cấu hình qua biến môi trường, **không** hard-code trong image.
  - [ ] App bắt `SIGTERM` để tắt gọn gàng (đóng kết nối DB, dừng consumer). Thử `docker stop` và xem log.

**Bước 2: GitHub Actions: lint → test → build (60')**

Tạo `.github/workflows/ci.yml`. Khung (đổi bước setup/lint/test theo stack của bạn):

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4        # hoặc setup-python / setup-go / setup-java
        with: { node-version: <version>, cache: npm }
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint                             # lint fail thì không chạy test
    runs-on: ubuntu-latest
    services:                               # DB thật chạy bằng container cho integration test
      postgres:
        image: postgres:<version>
        env: { POSTGRES_PASSWORD: postgres }
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready --health-interval 5s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: <version>, cache: npm }
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: false                       # chỉ build để kiểm tra; muốn push thì cần login registry
          tags: mini-order-service:${{ github.sha }}   # tag theo commit SHA, không dùng latest
```

- **Kiểm tra:**
  - [ ] Push lên GitHub, tab *Actions* chạy xanh cả 3 job.
  - [ ] Cố tình làm fail 1 test trên một nhánh, mở PR → CI đỏ → sửa → xanh. Chụp màn hình cho README.
  - [ ] (Tuỳ chọn) Bật *branch protection* cho `main`: bắt buộc CI xanh mới được merge.

**Bước 3: README có sơ đồ kiến trúc (30', xem ⚖️ ở đầu ngày)**

GitHub hiển thị được sơ đồ Mermaid ngay trong Markdown. Khung sơ đồ (sửa theo dự án thật):

````markdown
```mermaid
flowchart LR
  C[Client] --> N[Nginx LB]
  N --> A1[App instance 1]
  N --> A2[App instance 2]
  A1 & A2 --> P[(PostgreSQL)]
  A1 & A2 --> R[(Redis cache + rate limit)]
  A1 & A2 -- order.created --> Q[[RabbitMQ]]
  Q --> W[Email consumer<br/>idempotent + retry]
  Q -. lỗi quá số lần retry .-> D[[DLQ]]
```
````

**Checklist README:**

- [ ] Badge CI ở đầu file (lấy từ tab *Actions* → workflow → *Create status badge*)
- [ ] 2–3 câu mô tả: hệ thống làm gì, điểm kỹ thuật nổi bật
- [ ] Sơ đồ kiến trúc (Mermaid hoặc ảnh)
- [ ] Cách chạy: `docker compose up` + biến môi trường cần thiết (có file `.env.example`, **không** commit `.env`)
- [ ] Danh sách endpoint chính (hoặc link tới OpenAPI/Swagger)
- [ ] Mục **"Quyết định kỹ thuật"**: 3 quyết định + phương án đã cân nhắc + trade-off (dùng lại nội dung D89)
- [ ] Mục **"Số liệu"**: index trước/sau (Tuần 5–6), cache (Tuần 8), test đồng thời (Tuần 7), kích thước image (hôm nay)
- [ ] Mục **"Nếu có thêm thời gian"**: 2–3 việc sẽ làm tiếp (cho thấy bạn biết giới hạn của dự án)

**Bước 4 (10'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D91 (CN, 27/12): Chốt tuần 13

**⏱ Ước tính:** DSA 50' · Chốt tuần 60' · Việc dời từ D88–D90 30' · Anki 20' · **Tổng 2h40'**

**DSA:** Làm lại bài trong Error List (ưu tiên bài sai ở mock D90), bấm giờ ≤ 25'/bài.

**Việc dời từ D88–D90 (30'):** ghi âm + chấm rubric 3 chuyện STAR chưa chấm (~15'), README mục "Số liệu" và "Nếu có thêm thời gian" (~10'), bullet CV còn lại nếu D89 chưa xong (~5').

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Kể luồng code đi từ lúc commit đến production.
2. Giải thích Pod / Deployment / Service.
3. So sánh Canary và Blue-Green.
4. Kể 2 câu chuyện STAR trơn tru, không vấp.
5. Trình bày dự án trong 5 phút: kiến trúc + 3 quyết định kỹ thuật + trade-off.

<details><summary>Ý chính cần có trong câu trả lời</summary>

- **Câu 1:** PR → lint/type check → unit test → build **một** image tag theo SHA → integration test → scan → review + merge → registry → staging + smoke test → migration tương thích ngược (expand–contract) → deploy prod theo rolling/canary → theo dõi metric/SLO. Nhanh/rẻ trước để fail sớm. Rollback = deploy lại tag cũ hoặc tắt feature flag; DB thì sửa tiến.
- **Câu 2:** Deployment → ReplicaSet → N Pod (desired state, reconcile khi Pod chết). Pod tạm thời, IP đổi. Service = IP/DNS cố định, chọn Pod qua label, chỉ gửi tới Pod đã ready (readiness probe). Rolling update = ReplicaSet mới tăng, cũ giảm; cần graceful shutdown để không rớt request.
- **Câu 3:** Blue-Green: 2 môi trường đủ, chuyển 100% traffic một lần, rollback tức thì, tốn gấp đôi, lỗi trúng mọi người dùng. Canary: tăng dần 1% → 100%, so metric, rủi ro nhỏ, cần công cụ chia traffic + metric tốt, chậm. Chọn Canary khi thay đổi rủi ro cao và có observability; Blue-Green khi cần rollback tức thì, chịu được chi phí. Cả hai đòi schema tương thích ngược.
- **Câu 4:** mỗi chuyện ≤ 2 phút, câu mở đầu tóm tắt, Action dài nhất, "tôi" rõ ràng, Result có số, có Learning; trả lời được 1 câu đào sâu.
- **Câu 5:** bài toán + yêu cầu phi chức năng → sơ đồ → 3 quyết định (vấn đề → phương án khác → chọn gì → cái giá) → số liệu trước/sau → nếu làm lại. Đúng 5 phút.

</details>

**Sản phẩm:** Dự án có README, sơ đồ, CI chạy xanh.

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] Dự án có Dockerfile multi-stage, GitHub Actions chạy xanh, README có sơ đồ kiến trúc + quyết định kỹ thuật + số liệu
- [ ] `notes/stories.md` có đủ 5 câu chuyện, mỗi chuyện ≥ 10/12 theo rubric
- [ ] Bài giới thiệu bản thân 2 phút đã ghi âm ít nhất 1 lần và nghe lại
- [ ] CV đã viết lại với bullet có số liệu
- [ ] Anki: đã nhập thẻ T1 của D85–D89 + thẻ pattern Sliding Window cố định / Stack biểu thức / DFS hậu thứ tự / Backtracking phân hoạch
- [ ] Cheat sheet: đã điền bảng Docker Compose vs K8s, Service LoadBalancer vs Ingress, HPA vs VPA, Blue-Green vs Canary vs Rolling

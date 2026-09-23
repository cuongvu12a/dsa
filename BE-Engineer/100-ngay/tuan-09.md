# Tuần 9 (23/11 – 29/11): Intervals/Greedy, OS/Network, Scaling cơ bản

← [Tuần 8](tuan-08.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 10 →](tuan-10.md)

**Mục tiêu tuần:** Trả lời trọn vẹn câu *"Chuyện gì xảy ra khi gõ URL vào trình duyệt?"*. Hiểu stateless, load balancer, consistent hashing. Nhận ra dạng bài Intervals (sort theo điểm đầu/điểm cuối) và Greedy, nói được *vì sao* greedy đúng.

> 📌 **Cách học theo Tier** (🔴 T1 → Anki, 🟡 T2 → cheat sheet, 🟢 T3 → chỉ tra cứu): xem lại bảng ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Research theo cột *Từ khoá research*, dừng lại theo cột *Cần nắm tới mức nào*.

> ⚠️ Tuần này mở đầu **Giai đoạn 3 (Hệ thống & System Design)**. Phần OS/Network (D57–D59) không có trong Roadmap gốc, nhưng phỏng vấn Junior/Mid gần như luôn hỏi. Chỉ học tới mức "giải thích được cho người phỏng vấn", không đào sâu vào kernel hay RFC.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Pattern Intervals (sort theo start để merge, sort theo end để chọn nhiều khoảng nhất), Greedy + lập luận "đổi chỗ" (exchange argument), Kadane, Greedy tầm xa nhất (Jump Game), BFS theo tầng ẩn (Jump Game II); Process vs Thread, concurrency vs parallelism, race condition, critical section & mutex, 4 điều kiện deadlock, thread pool cạn kiệt khi dependency chậm; bắt tay 3 bước; luồng phân giải DNS; nguyên lý TLS (bất đối xứng để trao khoá, đối xứng để mã hoá dữ liệu, certificate); toàn bộ luồng "gõ URL"; service stateless; vai trò load balancer & health check (liveness vs readiness), connection draining khi tắt instance; **nguyên lý consistent hashing** + virtual node; vấn đề của `hash mod N`; CDN là gì | Mô hình concurrency (thread pool / event loop / goroutine–virtual thread); TCP vs UDP; scale dọc vs scale ngang; nơi lưu session (sticky / Redis / JWT); **L4 vs L7**; **thuật toán load balancing**; CDN push vs pull; **reverse proxy vs load balancer vs API Gateway** | API thread/lock của ngôn ngữ, GIL, semaphore/condition variable; bắt tay 4 bước khi đóng, `TIME_WAIT`; loại bản ghi DNS (A, AAAA, CNAME, MX...); chi tiết TLS 1.2 vs 1.3, cipher suite; HSTS, ARP, chi tiết render của trình duyệt; config Nginx/HAProxy; header `Cache-Control`; Kong/AWS API Gateway; code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D57 (T2) | 60' | 80' | 2h20' |
| D58 (T3) | 60' | 80' | 2h20' |
| D59 (T4) | 60' | 80' | 2h20' |
| D60 (T5) | 55' | 85' | 2h20' |
| D61 (T6) | 55' | 85' | 2h20' |
| D62 (T7) | — | 4h00' | 4h00' |
| D63 (CN) | — | 2h40' | 2h40' |

**Tổng tuần: 18h20'** (chưa tính 1h tiếng Anh mỗi ngày)

Ngày nặng nhất là **D62 (Lab 2 instance sau Nginx)**: Lab đã được chia *bắt buộc* / *mở rộng* để giữ ≤ 4h; tuần này có 9 bảng T2 nên 4 bảng (mô hình concurrency, TCP vs UDP, scale dọc vs ngang, thuật toán LB) được dời sang cuối tuần để buổi tối D57, D58, D60 không vượt 90'.

---

## D57 (T2, 23/11): Process, Thread, Concurrency

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 80' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h20'**

> ⏱ Bảng T2 *Mô hình concurrency* (15') dời sang **D63**. Tối nay vẫn học mục 7 đủ để trả lời câu hỏi cuối bài số 3.

### 🧩 DSA: [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)

- **Pattern (🔴 T1):** *Intervals: sort theo điểm bắt đầu rồi quét một lượt*. Sau khi sort theo `start`, các khoảng chồng nhau luôn **nằm cạnh nhau**, nên chỉ cần so khoảng hiện tại với khoảng cuối cùng trong kết quả.
- **Cách làm:**
  - Sort theo `start`.
  - Nếu `cur.start <= last.end` → gộp: `last.end = max(last.end, cur.end)`.
  - Ngược lại → thêm `cur` vào kết quả.
- **Độ phức tạp:** O(n log n) cho sort, quét O(n). Bộ nhớ O(n) cho output (O(log n) hoặc O(n) cho sort tuỳ ngôn ngữ).
- **Lỗi hay gặp:**
  - Gán `last.end = cur.end` thay vì lấy `max` → sai với `[1,10], [2,3]`.
  - Quên rằng `[1,4], [4,5]` được tính là chồng nhau (dùng `<=`, không phải `<`). Luôn hỏi lại người phỏng vấn về điểm chạm.

### 📘 Bài học buổi tối: Process vs Thread, concurrency vs parallelism, race condition, mutex

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Process vs Thread**: vùng nhớ riêng hay chung, chi phí tạo, chi phí context switch, cách ly lỗi | 🔴 T1 | Trả lời được câu hỏi cuối bài số 1 trong 1 phút | `process vs thread` |
| 2 | Context switch là gì, vì sao tốn kém | 🔴 T1 | Biết nó tồn tại và là lý do "càng nhiều thread càng nhanh" là sai | `context switch cost` |
| 3 | **Concurrency vs Parallelism** | 🔴 T1 | Nói được: concurrency là *xử lý nhiều việc xen kẽ*, parallelism là *chạy nhiều việc cùng một thời điểm* (cần nhiều core) | `concurrency vs parallelism rob pike` |
| 4 | **Race condition**: kết quả phụ thuộc vào thứ tự xen kẽ của các luồng | 🔴 T1 | Cho được 2 ví dụ: `count++` (đọc–sửa–ghi) và *check-then-act* | `race condition example read modify write` |
| 5 | **Critical section, mutex/lock, thao tác atomic** | 🔴 T1 | Biết 3 cách tránh race: khoá, thao tác atomic, không chia sẻ state (immutable / message passing) | `mutex critical section atomic operation` |
| 6 | Deadlock: ôn lại từ Tuần 7, áp dụng cho lock trong code | 🔴 T1 | Kể được **4 điều kiện cần** (Coffman): loại trừ lẫn nhau, giữ và chờ, không thể giành lại, chờ vòng tròn. Phá một điều kiện là tránh được: lấy lock theo thứ tự cố định (phá chờ vòng tròn), `tryLock` có timeout (phá giữ và chờ) | `deadlock conditions prevention`, `coffman conditions` |
| 7 | **Mô hình concurrency** của runtime | 🟡 T2 | Biết ngôn ngữ bạn dùng thuộc mô hình nào; điền bảng bên dưới ở D63 | `event loop vs thread pool`, `goroutines vs threads` |
| 8 | I/O-bound vs CPU-bound | 🔴 T1 | Biết vì sao event loop hợp I/O-bound, và vì sao một đoạn code CPU nặng làm "đứng" event loop | `io bound vs cpu bound` |
| 9 | Semaphore, condition variable, read-write lock | 🟢 T3 | Biết tên và mục đích một câu | `mutex vs semaphore` |
| 10 | Chi tiết riêng của ngôn ngữ: GIL của Python, `synchronized`/virtual thread của Java, `sync.Mutex` của Go, `worker_threads` của Node | 🟢 T3 | Tra khi cần | docs ngôn ngữ |
| 11 | **Thread pool cạn kiệt** với mô hình thread-per-request: request chờ I/O vẫn giữ thread; một dependency chậm (DB, API ngoài không có timeout) giữ hết thread → mọi request khác xếp hàng rồi timeout, kể cả endpoint không dùng dependency đó | 🔴 T1 | Giải thích được vì sao phải đặt **timeout** cho mọi lời gọi ra ngoài; liên hệ connection pool (Tuần 8) và Bulkhead (Tuần 12) | `thread pool exhaustion slow dependency` |

**Chi tiết cần hiểu**

- **Process vs Thread:**
  - Process có **vùng nhớ riêng**. Process này crash không làm chết process khác. Tạo và chuyển đổi tốn kém hơn.
  - Các thread trong cùng process **dùng chung heap** (biến global, object), mỗi thread có **stack riêng**. Tạo nhẹ hơn, giao tiếp dễ (đọc chung biến), nhưng chính vì dùng chung nên dễ race condition. Một thread làm hỏng bộ nhớ có thể làm chết cả process.
  - Liên hệ: Postgres dùng *một process cho mỗi connection* (lý do connection pool quan trọng, D54 Tuần 8). PHP-FPM hay Gunicorn chạy nhiều *worker process*. Tomcat dùng *thread pool*.
- **Race condition bằng ví dụ backend:**
  - *Read–modify–write:* hai request cùng đọc `views = 10`, cùng ghi `11`. Mất một lượt đếm. Sửa: thao tác atomic (`UPDATE ... SET views = views + 1`, hoặc `INCR` của Redis).
  - *Check-then-act:* "nếu chưa có user với email này thì tạo". Hai request cùng kiểm tra, cùng thấy chưa có, cùng tạo. Sửa: **unique constraint** trong DB, không dựa vào if trong code.
  - Bài overselling (Tuần 7) chính là một race condition ở tầng DB.
- **Điểm quan trọng khi chạy nhiều instance (chuẩn bị cho D60–D62):** mutex trong bộ nhớ của app chỉ có tác dụng **trong một process**. Chạy 2 instance sau load balancer thì lock trong RAM vô dụng. Phải dùng lock ở nơi dùng chung: DB (`FOR UPDATE`, unique constraint) hoặc Redis.

**🟡 Bảng so sánh T2: Mô hình concurrency** *(⏱ điền ở D63)*

Nhóm: *compute / concurrency model*. Trục chính: **hiệu quả với tải I/O nhiều kết nối** vs **dễ lập trình và an toàn khi có việc CPU nặng**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | Thread-per-request (thread pool, ví dụ Tomcat) | Event loop (Node.js, Python asyncio) | Green thread / M:N (goroutine, Java virtual thread) |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Hợp I/O-bound hay CPU-bound? | | | |
| Ext: Chi phí bộ nhớ cho mỗi đơn vị concurrency | | | |
| Ext: Hậu quả khi lỡ gọi code blocking | | | |

**🔴 Thẻ Anki (T1)**

1. Process khác Thread ở 4 điểm nào (bộ nhớ, chi phí tạo, context switch, cách ly lỗi)?
2. Concurrency khác parallelism thế nào? Một CPU một core có concurrency được không?
3. Cho ví dụ race condition kiểu *read-modify-write* và kiểu *check-then-act* trong backend. Sửa mỗi cái thế nào?
4. Kể 3 cách tránh race condition.
5. Vì sao mutex trong RAM không còn tác dụng khi chạy 2 instance?
6. *(DSA-Pattern)* Bài intervals cần gộp khoảng chồng nhau → sort theo gì? Điều kiện gộp là gì?

**🟢 Tra cứu (T3):** tài liệu concurrency của ngôn ngữ bạn dùng (ví dụ Node.js docs *The Node.js Event Loop*, Go docs *Effective Go – Concurrency*, Java docs *Virtual Threads*, Python docs *asyncio*).

**Tài liệu:**
- Hussein Nasser: tìm video `process vs thread`, `concurrency vs parallelism`
- NeetCode: video giải bài 56 Merge Intervals

**❓ Câu hỏi cuối bài**

1. Process khác Thread ở đâu?
2. Cho một ví dụ race condition và cách tránh.
3. Ngôn ngữ bạn dùng xử lý nhiều request cùng lúc thế nào (event loop, thread pool, goroutine…)?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Service chạy trên event loop (Node.js / asyncio) có một endpoint tính báo cáo nặng CPU mất 2 giây. Mỗi khi nó chạy, mọi endpoint khác đều chậm theo. Vì sao? Concurrency khác parallelism thế nào trong tình huống này? Sửa ra sao? (Nếu bạn dùng thread pool: điều tương tự xảy ra khi một API ngoài không đặt timeout. Vì sao?)
5. Bạn dùng mutex trong code để chống phát trùng mã giảm giá. Local chạy đúng, production 3 instance vẫn phát trùng. Vì sao? Nêu 2 cách sửa. Nếu một luồng cần giữ 2 lock cùng lúc thì làm sao tránh deadlock?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Process: vùng nhớ riêng, crash không ảnh hưởng process khác, tạo và context switch tốn hơn.
- Thread: chung heap, stack riêng, nhẹ hơn, giao tiếp dễ nhưng dễ race; một thread hỏng bộ nhớ có thể làm chết cả process.
- Liên hệ: Postgres một process mỗi connection; Tomcat thread pool; Gunicorn/PHP-FPM nhiều worker process.

**2.**
- Read-modify-write (`views++`) → thao tác atomic (`UPDATE … SET views = views + 1`, `INCR`).
- Check-then-act (kiểm tra email rồi tạo user) → unique constraint trong DB.
- Tránh chung: lock, atomic, không chia sẻ state.

**3.**
- Nói đúng mô hình: thread-per-request (thread pool) / event loop một luồng + I/O không chặn / goroutine–virtual thread (M:N).
- Nói hệ quả: event loop sợ code CPU nặng hoặc blocking; thread pool sợ cạn thread khi dependency chậm.

**4.**
- Event loop chạy callback trên **một** luồng: đoạn CPU 2 giây chặn mọi request khác → concurrency (xen kẽ) không phải parallelism (chạy song song).
- Sửa: đẩy việc CPU ra worker thread / process riêng / job queue, hoặc tính trước.
- Thread pool: request chờ API chậm vẫn giữ thread → pool cạn → mọi request xếp hàng; sửa bằng timeout + giới hạn pool riêng (bulkhead).

**5.**
- Mutex chỉ có tác dụng trong **một** process; 3 instance là 3 bộ nhớ riêng.
- Sửa: unique constraint / UPDATE có điều kiện trong DB, hoặc lock dùng chung (`SET NX PX` trên Redis, `FOR UPDATE`).
- Hai lock: luôn lấy theo **thứ tự cố định** (phá điều kiện chờ vòng tròn), hoặc `tryLock` có timeout.

</details>

---

## D58 (T3, 24/11): TCP/UDP, DNS, TLS

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 80' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h20'**

> ⏱ Bảng T2 *TCP vs UDP* (10') dời sang **D63**.

### 🧩 DSA: [57. Insert Interval](https://leetcode.com/problems/insert-interval/)

- **Pattern (🔴 T1):** *Intervals đã sort sẵn → quét tuyến tính theo 3 pha*. Không cần sort lại, nên làm được O(n).
- **3 pha:**
  1. Thêm mọi khoảng **kết thúc trước** khi `newInterval` bắt đầu (`end < new.start`).
  2. Gộp mọi khoảng **chồng** với `newInterval`: `new.start = min(...)`, `new.end = max(...)`, rồi thêm `newInterval`.
  3. Thêm phần còn lại.
- **Độ phức tạp:** O(n) thời gian, O(n) cho output.
- **Cách khác:** thêm `newInterval` vào cuối rồi gọi lại Merge Intervals → O(n log n). Đúng nhưng bỏ phí việc input đã sort. Nói được điều này là điểm cộng.
- **Lỗi hay gặp:** biên `<` / `<=` ở pha 1 và pha 2. Tự thử với `[[1,2],[3,5]]`, new = `[2,3]`.

### 📘 Bài học buổi tối: TCP vs UDP, bắt tay 3 bước, DNS, TLS/HTTPS

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Mô hình tầng rút gọn: Application (HTTP, DNS) → Transport (TCP, UDP) → Network (IP) → Link | 🔴 T1 | Biết mỗi giao thức hay gặp nằm ở tầng nào (cần cho L4 vs L7 ở D60) | `tcp ip model layers` |
| 2 | **TCP vs UDP** | 🟡 T2 | Nắm ý chính để trả lời câu hỏi cuối bài số 1; điền bảng bên dưới ở D63 | `tcp vs udp` |
| 3 | TCP đảm bảo tin cậy bằng gì: sequence number, ACK, gửi lại, flow control, congestion control | 🔴 T1 | Kể được tên cơ chế, không cần chi tiết thuật toán | `how tcp guarantees reliability` |
| 4 | **Bắt tay 3 bước** (SYN → SYN-ACK → ACK) | 🔴 T1 | Vẽ được; giải thích được vì sao cần 3 bước và tốn 1 RTT trước khi gửi dữ liệu, từ đó nối lại lý do dùng keep-alive / connection pool (Tuần 4, Tuần 8) | `tcp three way handshake why three` |
| 5 | Đóng kết nối 4 bước (FIN/ACK), `TIME_WAIT` | 🟢 T3 | Biết tồn tại. `TIME_WAIT` nhiều là dấu hiệu mở/đóng connection liên tục → nên dùng keep-alive, pool | `tcp time_wait` |
| 6 | **Luồng phân giải DNS**: cache trình duyệt → cache OS (file hosts) → recursive resolver → root → TLD → authoritative | 🔴 T1 | Vẽ được luồng; biết TTL của bản ghi DNS quyết định bao lâu thì thay đổi có hiệu lực | `how dns resolution works` |
| 7 | Loại bản ghi DNS: A, AAAA, CNAME, MX, NS, TXT | 🟢 T3 | Biết A trỏ tới IPv4, CNAME là bí danh. Còn lại tra khi cần | `dns record types` |
| 8 | **Nguyên lý TLS**: dùng mật mã bất đối xứng (trao đổi khoá ECDHE + chữ ký số của server) để hai bên thống nhất khoá phiên mà không gửi khoá qua mạng, rồi dùng **mã hoá đối xứng** cho dữ liệu; **certificate** do CA ký để xác thực server | 🔴 T1 | Giải thích được vì sao không mã hoá toàn bộ dữ liệu bằng bất đối xứng (chậm), và certificate chống được tấn công nào (man-in-the-middle) | `tls handshake explained`, `symmetric vs asymmetric encryption https` |
| 9 | HTTPS bảo vệ được gì, **không** bảo vệ được gì | 🔴 T1 | Trả lời được câu hỏi cuối bài số 3 (xem chi tiết) | `what does https protect` |
| 10 | Chi tiết TLS 1.2 vs 1.3 (2-RTT vs 1-RTT), cipher suite, SNI, OCSP | 🟢 T3 | Chỉ cần biết TLS 1.3 bắt tay nhanh hơn | `tls 1.3 vs 1.2` |
| 11 | HTTP/3 chạy trên QUIC (dựa trên UDP) | 🟢 T3 | Biết tồn tại, ví dụ UDP không chỉ dành cho game và video | `http3 quic udp` |

**Chi tiết cần hiểu**

- **Bắt tay 3 bước:**
  1. Client → `SYN` (số thứ tự khởi đầu x).
  2. Server → `SYN-ACK` (số thứ tự y, xác nhận x + 1).
  3. Client → `ACK` (xác nhận y + 1). Từ đây mới gửi dữ liệu.
  - Vì sao 3 mà không phải 2: **cả hai phía** đều cần biết phía kia đã nhận được số thứ tự khởi đầu của mình, và để loại bỏ gói SYN cũ bị trễ trong mạng.
  - Hệ quả thực tế: mỗi connection mới tốn ít nhất 1 RTT (cộng thêm TLS). Đây là lý do có **keep-alive**, **connection pool**, và HTTP/2 dùng chung một connection cho nhiều request.
- **Ví dụ dùng UDP:** DNS (truy vấn nhỏ, cần nhanh; câu trả lời lớn thì chuyển sang TCP), gọi video/voice, game realtime (gói tới muộn thì vô nghĩa, không cần gửi lại), QUIC/HTTP/3.
- **DNS thực tế cho backend:** đổi IP server mà client vẫn vào IP cũ → do TTL của bản ghi và cache ở nhiều tầng. Trước khi chuyển hạ tầng, hạ TTL xuống trước vài giờ. DNS cũng dùng để phân phối tải theo vùng địa lý (GeoDNS).
- **HTTPS bảo vệ:**
  - *Bí mật (confidentiality):* người ở giữa không đọc được nội dung, header, cookie, URL path, query string.
  - *Toàn vẹn (integrity):* không sửa được nội dung trên đường đi mà không bị phát hiện.
  - *Xác thực server (authentication):* certificate chứng minh bạn đang nói chuyện đúng với `shop.com`.
- **HTTPS không bảo vệ:**
  - IP đích và thường là cả **tên miền** (qua DNS và SNI) vẫn lộ.
  - Kích thước và thời điểm của traffic.
  - Lỗ hổng ở ứng dụng (SQL injection, XSS), server bị chiếm quyền, hoặc máy người dùng bị cài certificate giả.

**🟡 Bảng so sánh T2: TCP vs UDP** *(⏱ điền ở D63)*

Nhóm: *Protocol (tầng transport)*. Trục chính: **độ tin cậy** vs **độ trễ**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | TCP | UDP |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Đảm bảo thứ tự và không mất gói? | | |
| Ext: Chi phí thiết lập kết nối và overhead mỗi gói | | |
| Ext: Có giữ trạng thái kết nối (connection state)? | | |

**🔴 Thẻ Anki (T1)**

1. Vẽ bắt tay 3 bước. Vì sao cần 3 bước?
2. TCP đảm bảo tin cậy bằng những cơ chế nào?
3. Vẽ luồng phân giải DNS từ trình duyệt tới authoritative server.
4. Vì sao TLS dùng mã hoá bất đối xứng để trao khoá rồi mới dùng mã hoá đối xứng cho dữ liệu?
5. Certificate chống được kiểu tấn công nào?
6. HTTPS che được những gì và **không** che được những gì?
7. *(DSA-Pattern)* Insert Interval vì sao làm được O(n) mà không cần sort?

**🟢 Tra cứu (T3):** MDN – *An overview of HTTP*, *Transport Layer Security*; Cloudflare Learning Center (cloudflare.com/learning) các bài về DNS và TLS.

**Tài liệu:**
- Hussein Nasser: tìm video `TCP vs UDP`, `TLS handshake`
- ByteByteGo: tìm `bytebytego how dns works`, `bytebytego https`

**❓ Câu hỏi cuối bài**

1. TCP và UDP khác nhau thế nào? Mỗi loại dùng cho việc gì?
2. Bắt tay 3 bước diễn ra thế nào?
3. HTTPS bảo vệ được những gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Bạn chuyển server sang IP mới và cập nhật bản ghi DNS. 2 giờ sau một phần người dùng vẫn vào server cũ. Vì sao? Lần chuyển hạ tầng sau nên làm gì trước?
5. Vì sao TLS không mã hoá toàn bộ dữ liệu bằng mật mã bất đối xứng? Nếu trình duyệt không kiểm tra certificate do CA ký thì kẻ tấn công ở giữa (Wi-Fi quán cà phê) làm được gì?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- TCP: có kết nối, tin cậy, đúng thứ tự (seq/ACK/gửi lại, flow & congestion control), tốn handshake.
- UDP: không kết nối, không đảm bảo, overhead thấp, độ trễ thấp.
- TCP: HTTP/1.1–2, DB, API. UDP: DNS, voice/video, game realtime, QUIC/HTTP/3.

**2.**
- SYN (seq x) → SYN-ACK (seq y, ack x+1) → ACK (ack y+1).
- Cần 3 bước để **cả hai** phía xác nhận số thứ tự của nhau và loại SYN cũ bị trễ.
- Tốn 1 RTT trước khi gửi dữ liệu → lý do dùng keep-alive, connection pool.

**3.**
- Bí mật (nội dung, header, cookie, path, query), toàn vẹn, xác thực server bằng certificate.
- Không che: IP đích, tên miền (DNS/SNI), kích thước/thời điểm traffic; không chống lỗi ứng dụng (SQLi, XSS).

**4.**
- Bản ghi cũ còn nằm trong cache ở nhiều tầng (trình duyệt, OS, recursive resolver) cho tới khi hết TTL.
- Lần sau: hạ TTL xuống thấp trước vài giờ (≥ TTL cũ), chuyển, giữ server cũ chạy song song tới khi traffic cạn, rồi nâng TTL lại.

**5.**
- Mật mã bất đối xứng chậm hơn đối xứng nhiều lần → chỉ dùng để thống nhất khoá phiên (ECDHE) và ký; dữ liệu mã hoá bằng khoá đối xứng.
- Không có certificate: kẻ ở giữa giả làm server, tự làm TLS với cả hai phía (man-in-the-middle) → đọc và sửa được hết.

</details>

---

## D59 (T4, 25/11): "Gõ URL vào trình duyệt"

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 80' (Học 45' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h20'**

> ⏱ *Học 45'* ở đây là viết `notes/type-url.md` theo checklist; *Tự kiểm tra 20'* gồm nói thử 5' có bấm giờ, tự chấm, và 2 câu bổ sung.

### 🧩 DSA: [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

- **Pattern (🔴 T1):** *Greedy chọn nhiều khoảng không chồng nhau nhất (activity selection)*. Số khoảng phải xoá = n − số khoảng giữ lại được nhiều nhất.
- **Cách làm:** sort theo **điểm kết thúc**. Luôn giữ khoảng kết thúc **sớm nhất** còn hợp lệ, bỏ các khoảng chồng với nó.
- **Vì sao greedy đúng (lập luận đổi chỗ):** giả sử một lời giải tối ưu không chọn khoảng kết thúc sớm nhất A mà chọn B. Thay B bằng A: A kết thúc không muộn hơn B nên không chồng thêm khoảng nào, số khoảng giữ nguyên. Vậy luôn tồn tại lời giải tối ưu có chứa A.
- **Cách khác:** sort theo `start`, gặp chồng nhau thì bỏ khoảng có `end` lớn hơn (giữ `end = min(...)`). Cũng O(n log n).
- **Độ phức tạp:** O(n log n) thời gian, O(1) bộ nhớ phụ ngoài sort.
- **So sánh với bài 56:** Merge sort theo *start* (gộp); chọn nhiều khoảng nhất sort theo *end* (tham lam). Ghi vào thẻ Anki.

### 📘 Bài học buổi tối: Tự viết câu trả lời "Chuyện gì xảy ra khi gõ URL vào trình duyệt?"

Hôm nay không học kiến thức mới. Bạn **ghép** kiến thức từ Tuần 4 (HTTP), Tuần 5–8 (DB, cache), D57–D58 (network) thành một câu trả lời liền mạch, sau đó tập nói trong 5 phút.

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Thứ tự các chặng** từ URL tới trang hiển thị | 🔴 T1 | Nói đúng thứ tự các chặng 0–9 ở checklist bên dưới, không thiếu chặng nào | `what happens when you type a url` |
| 2 | Mỗi chặng: 1–2 câu "chuyện gì xảy ra" + 1 chi tiết chứng tỏ bạn hiểu sâu | 🔴 T1 | Xem cột "Ý bắt buộc" và "Điểm cộng" | — |
| 3 | Tối ưu ở từng chặng (cache DNS, keep-alive, TLS resumption, CDN, cache, index) | 🔴 T1 | Với mỗi chặng nói được 1 cách làm nó nhanh hơn | `web performance optimization latency` |
| 4 | Chi tiết trình duyệt: HSTS preload, parse URL, ARP, chi tiết render (DOM, CSSOM, layout, paint) | 🟢 T3 | Chỉ nhắc tên nếu người phỏng vấn hỏi thêm. Backend không cần đào sâu | github.com/alex/what-happens-when |

**📋 Checklist các chặng (dùng để tự chấm sau khi nói)**

| # | Chặng | Ý bắt buộc | Điểm cộng (nếu còn thời gian) |
|---|---|---|---|
| 0 | Trình duyệt xử lý URL | Tách scheme, domain, path. Kiểm tra cache của trình duyệt (có thể không cần gọi mạng) | HSTS ép dùng HTTPS; gõ chữ không phải URL thì thành tìm kiếm |
| 1 | **DNS** | Tra cache trình duyệt → OS → recursive resolver → root → TLD → authoritative → nhận IP, được cache theo TTL | DNS có thể trả IP khác nhau theo vùng (GeoDNS) hoặc trả IP của CDN |
| 2 | **TCP** | Bắt tay 3 bước tới IP:443, tốn 1 RTT | Keep-alive / HTTP/2 dùng lại connection; HTTP/3 dùng QUIC trên UDP |
| 3 | **TLS** | Client hello → server gửi certificate → trình duyệt kiểm tra chuỗi CA → trao đổi khoá → khoá phiên đối xứng | TLS 1.3 chỉ tốn 1 RTT; TLS thường được **kết thúc (terminate)** tại CDN hoặc load balancer |
| 4 | **HTTP request** | Method, path, header (`Host`, `Cookie`/`Authorization`, `Accept-Encoding`) | HTTP/2 multiplexing; cookie gửi kèm mọi request cùng domain |
| 5 | **CDN / Load balancer / reverse proxy** | Tài nguyên tĩnh có thể trả ngay từ CDN. Request động qua LB, LB chọn một instance khoẻ (health check) | L4 vs L7; rate limit, WAF ở tầng này |
| 6 | **Application server** | Middleware (log, auth, rate limit) → controller → service → repository (kiến trúc phân lớp, Tuần 3–4) | Correlation ID để trace; service stateless nên instance nào xử lý cũng được |
| 7 | **Cache / DB** | Cache-aside: hit trả luôn, miss thì query DB dùng index; transaction nếu là thao tác ghi | Đọc từ replica; connection pool; tránh N+1 |
| 8 | **HTTP response** | Status code, header (`Content-Type`, `Cache-Control`, `Set-Cookie`), body (thường nén gzip/brotli) | `Cache-Control` quyết định trình duyệt/CDN có cache được không |
| 9 | **Trình duyệt render** | Parse HTML → gặp CSS/JS/ảnh thì gửi thêm request (lặp lại từ chặng 1–8, thường dùng lại connection) → dựng trang và hiển thị | DOM + CSSOM → render tree → layout → paint; JS chặn parse nếu không `defer`/`async` |

**Chi tiết cần hiểu**

- **Phân bổ 5 phút:** chặng 0–3 (mạng) khoảng 1'30", chặng 4–8 (phía backend) khoảng 2'30", chặng 9 khoảng 30", còn 30" để tóm tắt: *"nếu phải làm nhanh hơn, tôi sẽ tối ưu ở ..."*. Là ứng viên backend, hãy dành nhiều thời gian nhất cho chặng 5–7: đó là nơi bạn khác biệt so với ứng viên frontend.
- **Người phỏng vấn thường cắt ngang để đào sâu một chặng.** Chuẩn bị sẵn cho các câu: "DNS cache ở những đâu?", "TLS dùng khoá gì?", "Nếu một instance chết thì sao?", "Nếu DB chậm thì sao?". Đây là lý do cột "Điểm cộng" tồn tại.
- **Cách viết:** viết một bản đầy đủ vào `notes/type-url.md` theo đúng 10 dòng của checklist, mỗi dòng 2–4 câu bằng lời của bạn. Sau đó **gập lại**, nói to, bấm giờ, ghi âm nếu được. So lại với checklist, chặng nào bỏ sót thì đánh dấu ⚠️.

**🔴 Thẻ Anki (T1)**

1. Kể đúng thứ tự các chặng khi gõ URL (DNS → ... → render).
2. TLS thường được terminate ở đâu? Vì sao?
3. Mỗi chặng mạng (DNS, TCP, TLS) tối ưu bằng cách nào? (cache DNS, keep-alive/pool, TLS 1.3/resumption)
4. Khi trình duyệt tải một trang có 30 file CSS/JS/ảnh, những chặng nào được lặp lại, chặng nào không?
5. *(DSA-Pattern)* Chọn nhiều khoảng không chồng nhau nhất → sort theo gì? Vì sao greedy đúng?

**🟢 Tra cứu (T3):** github.com/alex/what-happens-when (bản rất chi tiết, đọc lướt để lấy thêm "điểm cộng", **không** cố nhớ hết); MDN – *How browsers work*.

**Tài liệu:**
- github.com/alex/what-happens-when
- ByteByteGo: tìm `bytebytego what happens when you type a url`

**❓ Câu hỏi cuối bài**

- Tự nói trong 5 phút và kiểm tra đã đủ các ý: DNS → TCP → TLS → HTTP request → LB → server → DB → response → trình duyệt render.

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

2. Người phỏng vấn cắt ngang: *"Trang tải mất 3 giây, bạn tối ưu ở đâu?"* Với mỗi chặng mạng (DNS, TCP, TLS) và mỗi chặng phía backend (LB, app, DB), nêu 1 cách làm nhanh hơn.
3. Trang có 30 file CSS/JS/ảnh: chặng nào lặp lại cho mỗi file, chặng nào không? TLS thường được terminate ở đâu, và điều đó khiến backend phải đọc IP/scheme thật của client từ đâu?

*(Câu gốc chỉ có 1 ý nên câu bổ sung đánh số 2, 3.)*

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1. (gõ URL)**
- Đủ 10 chặng đúng thứ tự: xử lý URL/cache trình duyệt → DNS → TCP → TLS → HTTP request → CDN/LB → app (middleware → controller → service → repository) → cache/DB → response → render.
- Mỗi chặng có 1 chi tiết sâu (TTL DNS, 1 RTT, certificate + khoá phiên, health check, cache-aside, index, `Cache-Control`).
- Dành nhiều thời gian nhất cho chặng 5–7 (phía backend).

**2.**
- DNS: cache, TTL hợp lý. TCP: keep-alive, HTTP/2 dùng chung connection. TLS: TLS 1.3, session resumption, terminate gần user (CDN).
- LB/CDN: trả file tĩnh từ edge. App: tránh N+1, gọi song song, timeout. DB: index, cache-aside, read replica.
- Luôn nói "đo trước" (trace, p95) để biết chặng nào chậm.

**3.**
- Lặp lại: HTTP request/response và xử lý phía server cho mỗi file. Thường không lặp lại: DNS (đã cache), TCP + TLS (dùng lại connection nhờ keep-alive / HTTP/2).
- TLS thường terminate ở CDN hoặc LB → giảm tải CPU cho app, quản lý certificate tập trung.
- Backend đọc IP/scheme thật từ `X-Forwarded-For` / `X-Forwarded-Proto` (chỉ tin khi request đến từ proxy của mình).

</details>

---

## D60 (T5, 26/11): Scaling & Load balancer

**⏱ Ước tính:** Giờ làm 55' (DSA 40' + Anki 15') · Tối 85' (Học 30' + Bảng T2 L4/L7 + nơi lưu session 20' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h20'**

> ⏱ Bảng T2 *Scale dọc vs ngang* dời sang **D63**; bảng *Thuật toán load balancing* làm ở phần mở rộng của Lab D62 (cùng lúc thử `least_conn`), chưa làm kịp thì điền ở D63. Tối nay vẫn đọc phần chi tiết của mục 7 để trả lời câu hỏi cuối bài số 3.

### 🧩 DSA: [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

- **Pattern (🔴 T1):** *Kadane* (DP một chiều rút gọn / greedy). Tại mỗi vị trí, hỏi: *nối tiếp đoạn con đang có, hay bắt đầu đoạn mới từ đây?*
- **Công thức:** `cur = max(x, cur + x)`, `best = max(best, cur)`. Khi `cur` âm thì mang nó theo chỉ làm tổng nhỏ đi, nên bắt đầu lại.
- **Các cách:**
  1. Brute force mọi đoạn con → O(n²) (dùng prefix sum) hoặc O(n³).
  2. Kadane → O(n) thời gian, O(1) bộ nhớ.
  3. Chia để trị → O(n log n). Đề có nhắc tới như follow-up, chỉ cần biết ý tưởng: đáp án nằm ở nửa trái, nửa phải, hoặc cắt ngang điểm giữa.
- **Lỗi hay gặp:** khởi tạo `best = 0` → sai khi mọi số đều âm. Khởi tạo bằng `nums[0]`.

### 📘 Bài học buổi tối: Scale dọc vs scale ngang, service stateless, Load balancer (L4/L7, các thuật toán)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Scale dọc vs scale ngang** | 🟡 T2 | Điền bảng bên dưới (dời sang D63) | `vertical vs horizontal scaling` |
| 2 | **Service stateless**: không giữ state của user trong RAM/đĩa của instance | 🔴 T1 | Giải thích được vì sao đây là điều kiện để scale ngang; liệt kê được các loại state hay "lọt" vào instance | `stateless service horizontal scaling` |
| 3 | **Nơi lưu session**: sticky session vs session store dùng chung (Redis) vs token stateless (JWT) | 🟡 T2 | Điền bảng bên dưới | `sticky session vs centralized session store` |
| 4 | **Load balancer** làm gì: phân phối tải, health check, loại instance chết ra khỏi pool, là điểm vào duy nhất | 🔴 T1 | Kể được 4 vai trò | `what does a load balancer do` |
| 5 | Health check: active (LB chủ động gọi `/health`) vs passive (đếm lỗi của request thật) | 🔴 T1 | Biết endpoint `/health` nên kiểm tra gì. Phân biệt *liveness* (process còn sống, không treo) với *readiness* (sẵn sàng nhận traffic: đã kết nối được DB, đã warm-up). Biết bẫy: health check phụ thuộc cứng vào DB → DB chậm một lúc là LB loại **mọi** instance, cả hệ thống sập theo | `load balancer health check active passive` |
| 6 | **L4 vs L7 load balancer** | 🟡 T2 | Điền bảng bên dưới | `layer 4 vs layer 7 load balancer` |
| 7 | **Thuật toán load balancing** | 🟡 T2 | Đọc phần chi tiết; điền bảng bên dưới ở Lab D62 (mở rộng) hoặc D63 | `load balancing algorithms round robin least connections` |
| 8 | LB cũng có thể là điểm chết duy nhất (SPOF) → chạy cặp active–passive với IP ảo, hoặc dùng LB managed | 🔴 T1 | Trả lời được "LB chết thì sao?" | `load balancer single point of failure` |
| 9 | Config Nginx `upstream`, HAProxy; tên sản phẩm AWS ALB (L7) / NLB (L4) | 🟢 T3 | Tra khi làm lab D62 | nginx.org docs – *ngx_http_upstream_module* |
| 10 | **Connection draining / graceful shutdown**: khi tắt hoặc deploy một instance, LB ngừng gửi request mới tới nó, instance xử lý nốt request đang chạy rồi mới tắt | 🔴 T1 ở mức một câu | Trả lời được "deploy bản mới mà không rớt request thế nào?"; liên hệ Bước 5 Lab D62 (tắt app1 giữa chừng) | `connection draining graceful shutdown load balancer` |

**Chi tiết cần hiểu**

- **State hay "lọt" vào instance (mục 2):**
  - Session đăng nhập lưu trong RAM.
  - Cache in-process (lệch dữ liệu giữa các instance, D50 Tuần 8).
  - File upload lưu trên đĩa local → chuyển sang object storage (S3...).
  - Lock / bộ đếm / rate limit trong RAM (D57).
  - Bảng idempotency key lưu trong RAM (Tuần 4).
  - Cron job chạy trên mọi instance → job chạy trùng N lần.
- **Sticky session:** LB luôn gửi một user tới cùng một instance (theo cookie hoặc IP). Dễ làm, nhưng instance chết thì user mất session, và tải phân phối không đều. Đây là cách "chữa cháy", không phải thiết kế stateless thật.
- **L4 vs L7 bằng ví dụ:**
  - L4 chỉ nhìn thấy IP và port (TCP/UDP), chuyển tiếp gói tin/kết nối, không đọc nội dung HTTP. Nhanh, nhẹ, dùng được cho mọi giao thức TCP (DB, gRPC thô, MQTT).
  - L7 hiểu HTTP: đọc được URL, header, cookie. Làm được: `/api/*` sang service A, `/static/*` sang service B; terminate TLS; retry; nén; rate limit. Tốn CPU hơn vì phải giải mã và parse.
- **Thuật toán (mục 7):**
  - *Round-robin:* lần lượt từng server. Hợp khi server như nhau và request tốn thời gian như nhau.
  - *Weighted round-robin:* server mạnh nhận nhiều hơn.
  - *Least connections:* gửi tới server đang có ít kết nối nhất. Hợp khi thời gian xử lý request chênh nhau nhiều (có request 10ms, có request 5s), hoặc kết nối lâu (WebSocket).
  - *IP hash / consistent hashing:* cùng client (hoặc cùng key) luôn vào cùng server. Hợp khi server giữ cache theo key. Consistent hashing học kỹ ở D61.

**🟡 Bảng so sánh T2: Scale dọc vs Scale ngang** *(⏱ điền ở D63)*

Nhóm: *Sharding/Scaling strategy*. Trục chính: **đơn giản** vs **khả năng tăng trưởng và chịu lỗi**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | Scale dọc (vertical) | Scale ngang (horizontal) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Giới hạn trần | | |
| Ext: Điểm chết duy nhất (SPOF) / tính sẵn sàng | | |
| Ext: Yêu cầu với ứng dụng (phải stateless không?) | | |

**🟡 Bảng so sánh T2: Nơi lưu session khi scale ngang**

Nhóm: *quản lý state*. Trục chính: **đơn giản** vs **chịu lỗi và kiểm soát được phiên đăng nhập**.

| Tiêu chí | Sticky session | Session store dùng chung (Redis) | Token stateless (JWT) |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Instance chết thì user bị gì? | | | |
| Ext: Thu hồi (revoke) phiên ngay lập tức được không? | | | |
| Ext: Thêm phụ thuộc hạ tầng nào? | | | |

**🟡 Bảng so sánh T2: L4 vs L7 load balancer**

Nhóm: *Protocol / định tuyến traffic*. Trục chính: **hiệu năng** vs **khả năng định tuyến thông minh**.

| Tiêu chí | L4 (transport) | L7 (application) |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Nhìn thấy gì để định tuyến? | | |
| Ext: Hiệu năng / overhead | | |
| Ext: TLS termination và tính năng HTTP (retry, rewrite, nén) | | |

**🟡 Bảng so sánh T2: Thuật toán load balancing** *(⏱ điền ở Lab D62 phần mở rộng, hoặc D63)*

Nhóm: *Sharding/Scaling strategy (phân phối tải)*. Trục chính: **đơn giản, không cần trạng thái** vs **thích ứng với tải thực tế / giữ affinity**.

| Tiêu chí | Round-robin | Weighted round-robin | Least connections | IP hash / Consistent hashing |
|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | |
| Core: Trade-off chính | | | | |
| Core: Khi nào KHÔNG dùng | | | | |
| Ext: LB có cần theo dõi trạng thái server? | | | | |
| Ext: Hợp với request có thời gian xử lý chênh lệch lớn? | | | | |
| Ext: Cùng client có luôn vào cùng server (affinity)? | | | | |

**Thẻ Anki T2:** *"Khi nào chọn least connections thay vì round-robin?"*, *"Khi nào cần L7 thay vì L4?"*

**🔴 Thẻ Anki (T1)**

1. Vì sao scale ngang đòi hỏi service stateless?
2. Kể 5 loại state hay "lọt" vào instance và nơi nên chuyển chúng tới.
3. Load balancer đảm nhận 4 vai trò nào?
4. Endpoint `/health` nên kiểm tra gì? Active health check khác passive thế nào?
5. Load balancer chết thì sao? Làm sao tránh LB là SPOF?
6. *(DSA-Pattern)* Kadane: công thức chuyển là gì? Vì sao khởi tạo bằng `nums[0]`?

**🟢 Tra cứu (T3):** nginx.org docs – *ngx_http_upstream_module* (`least_conn`, `ip_hash`, `hash ... consistent`, `max_fails`, `fail_timeout`); HAProxy docs (haproxy.org).

**Tài liệu:**
- Alex Xu – *System Design Interview* Vol 1, ch.1 *Scale From Zero To Millions Of Users* (đọc kỹ: load balancer, stateless web tier, database replication, cache, CDN)
- ByteByteGo: tìm `bytebytego load balancing algorithms`
- Hussein Nasser: tìm video `layer 4 vs layer 7 load balancer`

**❓ Câu hỏi cuối bài**

1. Vì sao scale ngang đòi hỏi service phải stateless? Session khi đó lưu ở đâu?
2. Load balancer L4 khác L7 thế nào?
3. Round-robin khác least connections ra sao?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. `/health` của bạn trả 200 khi query được DB. Một hôm DB chậm 5 giây, LB đánh dấu cả 3 instance là chết và toàn site trả 502. Thiết kế health check đã sai ở đâu? Thiết kế lại thế nào (active/passive, liveness/readiness)?
5. Kiến trúc có 3 instance sau **một** Nginx duy nhất. Người phỏng vấn hỏi: *"Nginx chết thì sao?"* Trả lời, rồi nói cách deploy phiên bản mới mà không làm rớt request đang chạy.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Instance nào cũng phải xử lý được mọi request → không giữ state của user trong RAM/đĩa riêng; instance chết không mất gì.
- Session: store dùng chung (Redis) hoặc token stateless (JWT); sticky session chỉ là chữa cháy (instance chết mất session, tải lệch).
- Các state khác hay "lọt": cache in-process, file upload local, lock/bộ đếm trong RAM, cron chạy trùng.

**2.**
- L4: chỉ thấy IP/port, chuyển tiếp kết nối, nhanh, dùng cho mọi giao thức TCP/UDP.
- L7: hiểu HTTP (path, header, cookie) → định tuyến theo path, terminate TLS, retry, nén, rate limit; tốn CPU hơn.

**3.**
- Round-robin: lần lượt, không cần trạng thái; hợp khi server và request đồng đều.
- Least connections: LB theo dõi số kết nối đang mở; hợp khi thời gian xử lý chênh lệch lớn hoặc kết nối dài (WebSocket).

**4.**
- Health check phụ thuộc cứng vào DB → một sự cố chung làm LB loại **mọi** instance, biến "chậm" thành "sập".
- Liveness: chỉ kiểm tra process còn phản hồi. Readiness: kiểm tra dependency, nhưng có ngưỡng/timeout và không để LB loại hết instance cùng lúc.
- Kết hợp passive (đếm lỗi request thật) với active (`/health` định kỳ).

**5.**
- LB là SPOF → chạy cặp active–passive với IP ảo (keepalived) hoặc dùng LB managed, nhiều LB sau DNS.
- Deploy không rớt request: connection draining (LB ngừng gửi request mới, chờ request đang chạy xong), rolling từng instance, readiness chỉ bật khi instance mới sẵn sàng.

</details>

---

## D61 (T6, 27/11): Consistent hashing, CDN, reverse proxy, API Gateway

**⏱ Ước tính:** Giờ làm 55' (DSA 40' + Anki 15') · Tối 85' (Học 40' + Bảng T2 reverse proxy/LB/API Gateway 10' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h20'**

> ⏱ Bảng T2 *CDN push vs pull* là *(tuỳ chọn)*: ít được hỏi, làm ở D63 nếu còn giờ.

### 🧩 DSA: [55. Jump Game](https://leetcode.com/problems/jump-game/)

- **Pattern (🔴 T1):** *Greedy "tầm với xa nhất"*. Duyệt từ trái sang, giữ `farthest` = vị trí xa nhất có thể tới.
- **Cách làm:** nếu `i > farthest` → không tới được `i`, trả false. Ngược lại cập nhật `farthest = max(farthest, i + nums[i])`. Tới được (hoặc vượt) ô cuối → true.
- **Các cách:**
  1. DP/đệ quy có memo "từ ô i có tới đích được không" → O(n²).
  2. Greedy xuôi → O(n), O(1).
  3. Greedy ngược: `goal = n − 1`, duyệt từ phải sang, nếu `i + nums[i] >= goal` thì `goal = i`. Cuối cùng `goal == 0` là true.
- **Mục tiêu:** giải thích được vì sao chỉ cần một con số `farthest` thay cho cả mảng DP: mọi ô ≤ `farthest` đều tới được (tập các ô tới được là một đoạn liên tục).

### 📘 Bài học buổi tối: Consistent hashing, CDN, reverse proxy, API Gateway

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Vấn đề của `hash(key) mod N` khi thêm/bớt server | 🔴 T1 | Giải thích được vì sao đổi N làm **gần như toàn bộ** key đổi server → cache miss hàng loạt / di chuyển dữ liệu hàng loạt | `hash mod n problem adding server` |
| 2 | **Nguyên lý consistent hashing**: vòng hash, server và key cùng được hash lên vòng, key thuộc server đầu tiên theo chiều kim đồng hồ | 🔴 T1 | Vẽ được ra giấy; nói được khi thêm/bớt một server chỉ khoảng **K/N** key bị di chuyển (K key, N server) | `consistent hashing explained` |
| 3 | **Virtual node** | 🔴 T1 | Nói được 2 lợi ích: phân bố đều hơn, và khi một server chết thì tải của nó chia cho **nhiều** server chứ không dồn vào một server bên cạnh. Thêm: gán trọng số theo sức mạnh server | `consistent hashing virtual nodes` |
| 4 | Consistent hashing được dùng ở đâu | 🔴 T1 | Kể được 3 nơi: phân mảnh dữ liệu (Cassandra, DynamoDB), client cache phân tán (Memcached), load balancing theo key | `consistent hashing use cases` |
| 5 | **CDN là gì**: mạng máy chủ biên (edge) đặt gần người dùng, cache nội dung | 🔴 T1 | Nói được CDN giảm latency và giảm tải cho origin như thế nào | `how cdn works` |
| 6 | CDN cache những gì, invalidate thế nào | 🔴 T1 | Trả lời được câu hỏi cuối bài số 2 (xem chi tiết) | `what can cdn cache`, `cdn cache invalidation versioned filenames` |
| 7 | CDN **push vs pull** *(tuỳ chọn)* | 🟡 T2 | Điền bảng bên dưới (ngắn), ở D63 nếu còn giờ | `push cdn vs pull cdn` |
| 8 | **Reverse proxy vs Load balancer vs API Gateway** (vai trò và khi nào cần cái nào) | 🟡 T2 | Điền bảng bên dưới. Theo Roadmap gốc: biết vai trò là T3, còn "khi nào cần cái nào" là T2 | `reverse proxy vs load balancer vs api gateway` |
| 9 | Forward proxy vs reverse proxy | 🟢 T3 | Một câu: forward proxy đại diện cho **client**, reverse proxy đại diện cho **server** | `forward proxy vs reverse proxy` |
| 10 | Header `Cache-Control` (`max-age`, `s-maxage`, `no-store`, `private`), sản phẩm cụ thể (Cloudflare, CloudFront, Kong, AWS API Gateway) | 🟢 T3 | Tra khi cần | MDN – *HTTP caching* |

**Chi tiết cần hiểu**

- **`mod N` hỏng thế nào (mục 1):** có 4 server, key 13 → `13 mod 4 = 1`. Thêm server thứ 5 → `13 mod 5 = 3`. Chuyển từ N sang N + 1 server, chỉ khoảng 1/(N + 1) số key giữ nguyên chỗ, còn lại đều phải chuyển. Nếu đây là cụm cache thì gần như toàn bộ cache bị miss cùng lúc → DB bị đập (chính là *cache avalanche*, D52 Tuần 8).
- **Consistent hashing (mục 2–3):**
  - Không gian hash là một vòng tròn (ví dụ 0 … 2³² − 1).
  - Hash mỗi server lên vòng. Hash mỗi key lên vòng, đi theo chiều kim đồng hồ, gặp server nào thì key thuộc server đó.
  - *Thêm server S mới:* chỉ những key nằm giữa S và server đứng trước S chuyển sang S. Các key khác giữ nguyên.
  - *Bớt server:* chỉ key của server đó chuyển sang server kế tiếp.
  - *Vấn đề khi ít server:* các điểm trên vòng phân bố không đều → một server ôm một cung rất lớn. *Virtual node:* mỗi server có hàng trăm điểm trên vòng (`S1#1`, `S1#2`...) → các cung nhỏ và đều hơn.
- **CDN cache gì (mục 6):**
  - Chắc chắn: file tĩnh (ảnh, CSS, JS, font, video).
  - Có thể: response API công khai, giống nhau cho mọi người (danh mục sản phẩm), nếu có header `Cache-Control` phù hợp.
  - Không nên: response cá nhân hoá (giỏ hàng, thông tin tài khoản), dữ liệu cần tươi tuyệt đối.
  - Invalidate: gắn **version/hash vào tên file** (`app.3f2a1c.js`) để khỏi phải purge, hoặc gọi API purge của CDN.
- **Reverse proxy, LB, API Gateway (mục 8):**
  - *Reverse proxy:* đứng trước server, nhận request thay server. Terminate TLS, nén, cache, ẩn cấu trúc bên trong. Nginx là ví dụ điển hình.
  - *Load balancer:* một reverse proxy có nhiệm vụ chính là chia tải cho nhiều instance của **cùng một** service.
  - *API Gateway:* điểm vào cho **nhiều** service (thường là microservices), lo các việc xuyên suốt (cross-cutting): xác thực, rate limit, định tuyến theo path tới từng service, gom/biến đổi request, log, metric.
  - Ba thứ này chồng lấn nhau. Nginx có thể đóng cả ba vai ở quy mô nhỏ. Điều cần nói được là **vai trò**, không phải tên sản phẩm.

**🟡 Bảng so sánh T2: CDN push vs pull** *(tuỳ chọn, ⏱ D63 nếu còn giờ)*

Nhóm: *deployment / infra strategy (phân phối nội dung)*. Trục chính: **kiểm soát** vs **công vận hành**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | Push CDN | Pull CDN |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Request đầu tiên có chậm không? | | |
| Ext: Ai chịu trách nhiệm đưa nội dung lên / cập nhật? | | |

**🟡 Bảng so sánh T2: Reverse proxy vs Load balancer vs API Gateway**

Nhóm: *infra / điểm vào của traffic*. Trục chính: **mỏng và nhanh** vs **nhiều tính năng xuyên suốt (và nhiều rủi ro hơn)**.

| Tiêu chí | Reverse proxy | Load balancer | API Gateway |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng (khi nào là thừa) | | | |
| Ext: Đứng trước một service hay nhiều service? | | | |
| Ext: Tính năng xuyên suốt (auth, rate limit, biến đổi request) | | | |
| Ext: Rủi ro thêm latency / thành SPOF | | | |

**Thẻ Anki T2:** *"Khi nào cần API Gateway thay vì chỉ một load balancer?"*

**🔴 Thẻ Anki (T1)**

1. Vì sao `hash mod N` gây xáo trộn gần hết key khi thêm/bớt server?
2. Vẽ vòng consistent hashing. Thêm một server thì những key nào bị di chuyển?
3. Virtual node giải quyết 2 vấn đề nào?
4. Kể 3 nơi dùng consistent hashing.
5. CDN nên cache gì và không nên cache gì? Làm sao cập nhật file JS mà không phải purge CDN?
6. *(DSA-Pattern)* Jump Game: vì sao chỉ cần giữ một biến `farthest`?

**🟢 Tra cứu (T3):** MDN – *HTTP caching* (`Cache-Control`); nginx.org docs – `proxy_pass`, `proxy_cache`, `hash ... consistent`; docs của CDN hoặc API Gateway mà công ty bạn dùng.

**Tài liệu:**
- Alex Xu – *System Design Interview* Vol 1, ch.5 *Design Consistent Hashing* (đọc kỹ)
- Alex Xu Vol 1, ch.1 (đọc lại phần CDN)
- ByteByteGo: tìm `bytebytego consistent hashing`, `bytebytego api gateway`

**❓ Câu hỏi cuối bài**

1. Chia server bằng `hash mod N` gặp vấn đề gì khi thêm hoặc bớt server? Consistent hashing giải quyết thế nào? Virtual node để làm gì?
2. CDN cache những gì?
3. API Gateway đảm nhận những việc gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Bạn deploy bản JS mới nhưng một phần người dùng vẫn nhận file cũ từ CDN suốt 1 ngày. Vì sao? Làm sao để các lần deploy sau không cần purge CDN? Response API nào tuyệt đối không được để CDN cache?
5. LB định tuyến theo `user_id` để tận dụng cache in-process của từng instance. Khi autoscale từ 4 lên 6 instance, hit ratio rơi về gần 0 và DB bị đập. Vì sao? Sửa bằng gì?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- `mod N`: đổi N làm gần như mọi key đổi server (chỉ ~1/(N+1) giữ chỗ) → cache miss hàng loạt / di chuyển dữ liệu hàng loạt.
- Consistent hashing: server và key cùng trên vòng hash, key thuộc server kế tiếp theo chiều kim đồng hồ → thêm/bớt một server chỉ di chuyển ~K/N key.
- Virtual node: phân bố đều hơn; server chết thì tải chia cho nhiều server; gán trọng số theo sức mạnh.

**2.**
- Chắc chắn: file tĩnh (ảnh, CSS, JS, font, video).
- Có thể: API công khai giống nhau cho mọi người, nếu có `Cache-Control` phù hợp.
- Không: dữ liệu cá nhân hoá, dữ liệu cần tươi tuyệt đối.

**3.**
- Điểm vào cho nhiều service: định tuyến theo path, xác thực, rate limit, gom/biến đổi request, log, metric.
- Khác LB: LB chia tải cho nhiều instance của **một** service; gateway lo việc xuyên suốt cho **nhiều** service. Cái giá: thêm latency, có thể thành SPOF.

**4.**
- CDN (và trình duyệt) cache file theo URL tới hết TTL; tên file không đổi thì vẫn trả bản cũ.
- Gắn hash/version vào tên file (`app.3f2a1c.js`) + TTL dài; chỉ HTML trỏ tới file mới cần TTL ngắn.
- Không cache: response cá nhân hoá (giỏ hàng, tài khoản), response có `Set-Cookie` / cần xác thực → `Cache-Control: private` hoặc `no-store`.

**5.**
- Định tuyến kiểu `hash(user_id) mod N`: đổi N từ 4 → 6 làm gần như mọi user sang instance khác → cache lạnh toàn bộ.
- Dùng consistent hashing (Nginx `hash … consistent`) để chỉ ~1/3 user bị chuyển; hoặc chuyển sang cache dùng chung (Redis).

</details>

---

## D62 (T7, 28/11): Lab

**⏱ Ước tính:** DSA 40' · Lab bắt buộc 2h50' · Ôn ⚠️ 30' · **Tổng 4h00'**

> ⏱ Lab *bắt buộc (2h50')*: Bước 1 (rút còn 20'), Bước 2 (50', dùng thư viện session-store có sẵn), Bước 3 (45'), Bước 4 phần round-robin (10'), Bước 5 mục 1–3 (30'), Bước 6 (15'). *Mở rộng (làm nếu còn giờ, ~35')*: Bước 4 phần `least_conn` + điền bảng thuật toán LB (20'), Bước 5 mục 4 so sánh throughput 1 vs 2 instance (15'). "Làm lại 1 bài sai" dời sang D63 nếu hết giờ.

### 🧩 DSA: [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/)

- **Pattern (🔴 T1):** *Greedy theo tầng (BFS ẩn)*. Các ô tới được bằng k bước tạo thành một **đoạn liên tục**, giống một "tầng" của BFS.
- **Cách làm:** giữ `curEnd` (biên của tầng hiện tại) và `farthest`. Duyệt `i` từ 0 tới **n − 2**: cập nhật `farthest`; khi `i == curEnd` thì `jumps++`, `curEnd = farthest`.
- **Độ phức tạp:** O(n) thời gian, O(1) bộ nhớ. DP thông thường là O(n²).
- **Lỗi hay gặp:** duyệt tới `n − 1` → đếm thừa một bước khi `curEnd` rơi đúng vào ô cuối.
- Sau đó làm lại 1 bài sai trong tuần (nếu có, *nếu còn giờ*).

### 🛠 Lab (3–4h): 2 instance *Mini Order Service* sau Nginx, state ra Redis

**Bước 1: Tìm mọi state đang nằm trong instance (30')**

- Rà code theo danh sách ở D60: session trong RAM, cache in-process, lock/bộ đếm/rate limit trong RAM, bảng idempotency key (Tuần 4) trong RAM, file upload trên đĩa local, cron job.
- Ghi danh sách vào `notes/scale-out-lab.md`, mỗi mục ghi rõ: *đang ở đâu → chuyển đi đâu*.
- Nếu dự án đang dùng JWT thuần (không có session), state cần chuyển ra Redis có thể là: danh sách JWT bị thu hồi / refresh token, idempotency key, giỏ hàng tạm. **Phải có ít nhất một loại state thật sự nằm trong Redis** để bài test ở Bước 5 có ý nghĩa. Nếu chưa có, làm một endpoint session đơn giản (ví dụ `POST /login` tạo session lưu ở Redis, `GET /me` đọc session).

**Bước 2: Chuyển state ra Redis (1h)**

- Session: key `session:{id}`, value JSON, TTL = thời hạn phiên. Dùng thư viện session-store Redis của framework bạn dùng (🟢 T3, chỉ lưu link).
- Idempotency key: `idem:{key}` với `SET ... NX EX 86400`. `NX` đảm bảo chỉ một instance "giành" được key, đúng bài race condition D57.
- Thêm biến môi trường `INSTANCE_ID` và trả header `X-Instance-Id` trong mọi response để biết request rơi vào instance nào.
- Kiểm tra lại: `pool_size × 2 instance ≤ max_connections` của Postgres (D54 Tuần 8).

**Bước 3: docker compose + Nginx (45')**

```yaml
# 🟢 T3 snippet – docker-compose.yml (phác thảo, chỉnh theo stack của bạn)
x-app: &app
  build: .
  depends_on: [postgres, redis]

services:
  app1:
    <<: *app
    environment:
      DATABASE_URL: postgres://app:app@postgres:5432/orders
      REDIS_URL: redis://redis:6379
      INSTANCE_ID: app1
  app2:
    <<: *app
    environment:
      DATABASE_URL: postgres://app:app@postgres:5432/orders
      REDIS_URL: redis://redis:6379
      INSTANCE_ID: app2
  nginx:
    image: nginx:1.27-alpine
    ports: ["8080:80"]
    volumes: ["./nginx.conf:/etc/nginx/conf.d/default.conf:ro"]
    depends_on: [app1, app2]
  redis:
    image: redis:7-alpine
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: orders
    volumes: ["pgdata:/var/lib/postgresql/data"]

volumes:
  pgdata:
```

> Lưu ý: merge key `<<:` **không gộp sâu** các map con như `environment` (khai báo `environment` ở service sẽ thay thế toàn bộ, không trộn với anchor), nên mỗi service tự khai báo đủ biến như trên. App **không** mở `ports` ra ngoài, chỉ Nginx nhận traffic ở cổng 8080.

```nginx
# 🟢 T3 snippet – nginx.conf
upstream order_api {
    # least_conn;              # bỏ comment để thử least connections (mặc định là round-robin)
    server app1:3000 max_fails=3 fail_timeout=10s;
    server app2:3000 max_fails=3 fail_timeout=10s;
    keepalive 32;              # giữ connection tới upstream, tránh bắt tay lại (D58)
}

server {
    listen 80;

    location / {
        proxy_pass http://order_api;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Request-Id $request_id;           # correlation ID (Tuần 12)
        proxy_next_upstream error timeout http_502 http_503;  # instance lỗi thì thử instance khác
        add_header X-Upstream $upstream_addr always;         # xem request đi vào instance nào
    }
}
```

- Nginx bản open-source chỉ có **passive health check** (`max_fails`, `fail_timeout`). Active health check là tính năng của NGINX Plus. Ghi nhận điều này vào notes, nó trả lời trực tiếp câu hỏi D60.
- ⚠️ `proxy_next_upstream` sẽ **gửi lại** request sang instance khác. Với `POST /orders` điều này chỉ an toàn nhờ Idempotency-Key (Tuần 4). Mặc định Nginx không retry các method không idempotent như POST khi request đã được gửi tới upstream (trừ khi thêm `non_idempotent`). Đừng thêm `non_idempotent` nếu chưa có idempotency key.

**Bước 4: Kiểm tra phân phối tải (20')**

- `docker compose up -d --build`, gọi `curl -i localhost:8080/products/1` 10 lần → header `X-Instance-Id` luân phiên `app1`, `app2`.
- *(Mở rộng)* Bật `least_conn`, reload Nginx (`docker compose exec nginx nginx -s reload`), thử lại với một endpoint cố tình chậm ở một instance. Ghi nhận khác biệt.

**Bước 5: Kiểm tra stateless và chịu lỗi (40')**

1. **Session dùng chung:** đăng nhập (request rơi vào `app1`), gọi `GET /me` nhiều lần, có lần rơi vào `app2` → vẫn được xác thực.
2. **Một instance chết:** chạy load test (`hey`/`k6`/`wrk`) 60 giây, giữa chừng `docker compose stop app1`. Ghi lại: có bao nhiêu request lỗi, lỗi trong bao lâu, sau đó mọi request có dồn sang `app2` không. Rồi `docker compose start app1` và xem nó được nhận lại vào pool.
3. **Idempotency qua 2 instance:** gửi cùng một `POST /orders` với cùng `Idempotency-Key` hai lần liên tiếp (có thể rơi vào 2 instance khác nhau) → chỉ tạo **một** đơn.
4. *(Mở rộng)* **So sánh throughput:** 1 instance vs 2 instance. ⚠️ Trên một laptop, 2 instance chia chung CPU và cùng một Postgres, nên throughput có thể **không** tăng gấp đôi. Ghi lại con số thật và giải thích nút thắt ở đâu (CPU máy, DB, Redis). Đây là câu trả lời hay khi phỏng vấn.

**Bước 6: Ghi kết quả (20')**

- Viết `notes/scale-out-lab.md`:
  - Sơ đồ: Client → Nginx → app1/app2 → Postgres + Redis.
  - Danh sách state đã chuyển ra ngoài instance.
  - Bảng kết quả:

    | Kịch bản | req/s | p95 | Số request lỗi | Ghi chú |
    |---|---|---|---|---|
    | 1 instance | | | | |
    | 2 instance, round-robin | | | | |
    | 2 instance, `least_conn` | | | | |
    | Tắt app1 giữa chừng | | | | |

**Sản phẩm và tiêu chí nghiệm thu**

- [ ] `docker compose up` chạy đủ nginx + app1 + app2 + postgres + redis; chỉ Nginx mở cổng ra ngoài
- [ ] Header `X-Instance-Id` cho thấy request được chia cho cả 2 instance
- [ ] Đăng nhập ở một instance, request sau rơi vào instance kia vẫn được xác thực
- [ ] Tắt 1 instance → hệ thống vẫn phục vụ, số request lỗi đã được ghi lại
- [ ] Cùng Idempotency-Key gửi 2 lần qua 2 instance chỉ tạo 1 đơn
- [ ] `notes/scale-out-lab.md` có sơ đồ, danh sách state, bảng số liệu và giải thích nút thắt

**Bước 7 (30'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D63 (CN, 29/11): Chốt tuần 9

**⏱ Ước tính:** DSA 45' · Chốt tuần 60' · Bảng T2 dời từ trong tuần 35' (mô hình concurrency 15' + TCP vs UDP 10' + scale dọc vs ngang 10') · Anki/cheat sheet 20' · **Tổng 2h40'**

> ⏱ Còn tối đa 20' trong trần 3h: dùng cho bảng *thuật toán LB* nếu D62 chưa làm, rồi mới tới bảng *(tuỳ chọn)* CDN push vs pull.

### 🧩 DSA: [134. Gas Station](https://leetcode.com/problems/gas-station/)

- **Pattern (🔴 T1):** *Greedy + điều kiện toàn cục*.
- **Hai nhận xét:**
  1. Nếu `sum(gas) < sum(cost)` → chắc chắn không có đáp án, trả −1. Ngược lại luôn có đúng một đáp án (đề đảm bảo duy nhất).
  2. Đi từ trạm `start`, nếu bình xăng âm tại trạm `i` thì **mọi trạm từ `start` tới `i`** đều không thể là điểm xuất phát (xuất phát ở giữa còn có ít xăng hơn khi tới `i`). Đặt `start = i + 1`, reset bình về 0.
- **Độ phức tạp:** O(n) thời gian, O(1) bộ nhớ. Brute force thử mọi điểm xuất phát là O(n²).
- **Mục tiêu:** nói được lập luận ở nhận xét 2. Đây là kiểu "vì sao greedy đúng" mà câu chốt tuần số 4 hỏi.

**✅ Câu hỏi chốt tuần.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Trả lời "gõ URL" trọn vẹn trong 5 phút.
   - *Tự chấm bằng checklist 10 chặng ở D59. Bấm giờ, ghi âm nếu được.*
2. Vẽ consistent hashing ra giấy và giải thích.
   - *Phải có: vòng hash, vị trí server và key, chiều tìm server, chuyện gì xảy ra khi thêm/bớt server, virtual node.*
3. Vì sao service phải stateless thì mới scale ngang được?
   - *Dùng chính kết quả lab D62 làm ví dụ.*
4. Bài intervals: vì sao thường sort theo điểm bắt đầu trước? Greedy đúng khi nào?
   - *Gợi ý: merge sort theo start; chọn nhiều khoảng nhất sort theo end. Greedy đúng khi chứng minh được "lựa chọn tốt nhất cục bộ luôn nằm trong một lời giải tối ưu" (lập luận đổi chỗ ở bài 435, lập luận loại trạm ở bài 134).*
5. Một race condition bạn từng gặp, hoặc có thể xảy ra, trong dự án.
   - *Kể theo khung: tình huống → vì sao xảy ra (xen kẽ thế nào) → cách sửa (atomic / lock / unique constraint) → vì sao lock trong RAM không đủ khi chạy nhiều instance.*

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Đủ 10 chặng theo checklist D59, đúng thứ tự, trong 5 phút.
- Mỗi chặng có ít nhất 1 chi tiết sâu; phần backend (LB → app → cache/DB) chiếm nhiều thời gian nhất.
- Kết bằng "nếu cần nhanh hơn, tôi sẽ tối ưu ở …".

**2.**
- Vòng hash, server và key cùng được hash lên vòng, đi theo chiều kim đồng hồ.
- Thêm/bớt server chỉ di chuyển key của một cung (~K/N), so với gần hết key khi dùng `mod N`.
- Virtual node: phân bố đều, tải của server chết chia cho nhiều server.

**3.**
- LB có thể gửi request tới bất kỳ instance nào; instance có thể chết hoặc được thêm bất cứ lúc nào.
- State trong instance (session, cache, lock, file) → mất hoặc lệch; phải chuyển ra Redis / DB / object storage.
- Dẫn kết quả lab D62: đăng nhập ở app1, request sau vào app2 vẫn xác thực; tắt app1 hệ thống vẫn chạy.

**4.**
- Sort theo start để các khoảng chồng nhau nằm cạnh nhau (merge); sort theo end để giữ khoảng kết thúc sớm nhất (chọn nhiều khoảng nhất).
- Greedy đúng khi chứng minh được lựa chọn cục bộ luôn nằm trong một lời giải tối ưu (lập luận đổi chỗ ở 435, lập luận loại trạm ở 134).

**5.**
- Tình huống cụ thể → timeline xen kẽ của hai request → hậu quả.
- Cách sửa: atomic / unique constraint / lock dùng chung; vì sao mutex trong RAM không đủ khi có nhiều instance.

</details>

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] `notes/type-url.md` hoàn thành và đã nói thử ≥ 2 lần trong 5 phút
- [ ] 2 instance chạy sau Nginx + `notes/scale-out-lab.md` có số liệu
- [ ] Tự giải lại 7 bài intervals/greedy của tuần không xem lời giải
- [ ] Anki: đã nhập đủ thẻ T1 của D57–D61 + thẻ pattern Intervals / Greedy / Kadane
- [ ] Cheat sheet: đã điền mô hình concurrency, TCP vs UDP, scale dọc vs ngang, nơi lưu session, L4 vs L7, thuật toán LB, CDN push vs pull, reverse proxy vs LB vs API Gateway

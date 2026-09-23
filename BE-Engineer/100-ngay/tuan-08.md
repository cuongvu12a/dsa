# Tuần 8 (16/11 – 22/11): Backtracking, Cache, Replication, Sharding, NoSQL

← [Tuần 7](tuan-07.md) · [Về lộ trình tổng](../Roadmap_100_ngay.md) · [Tuần 9 →](tuan-09.md)

**Mục tiêu tuần:** Biết các bước scale database theo thứ tự hợp lý. Nắm chiến lược cache và các sự cố cache hay gặp. Chọn được SQL hay NoSQL theo từng use-case. Viết được khung backtracking (chọn → đệ quy → bỏ chọn) mà không cần nhìn mẫu.

> 📌 **Cách học theo Tier** (🔴 T1 → Anki, 🟡 T2 → cheat sheet, 🟢 T3 → chỉ tra cứu): xem lại bảng ở [Tuần 1 – Cách học theo Tier](tuan-01.md#cách-học-theo-tier-áp-dụng-cho-mọi-bài). Research theo cột *Từ khoá research*, dừng lại theo cột *Cần nắm tới mức nào*.

> ⚠️ Tuần này kết thúc **Giai đoạn 2 (Database)**. Chủ Nhật có phần chốt tổng hợp tuần 5–8 và một buổi tự mock 45'.

## Tổng kết Tier của tuần

| 🔴 T1 (vào Anki) | 🟡 T2 (vào cheat sheet) | 🟢 T3 (chỉ tra cứu) |
|---|---|---|
| Pattern Backtracking (chọn → đệ quy → bỏ chọn, cây quyết định, start index vs mảng `used`, bỏ trùng khi đã sort, đánh dấu visited trên lưới); cache là gì & tiêu chí chọn dữ liệu để cache; TTL & đánh đổi độ tươi ↔ hit ratio; luồng cache-aside & vì sao **xoá** cache sau khi ghi DB; 3 sự cố cache (stampede, penetration, avalanche) và cách chống; hot key; nguyên lý Bloom filter; **Replication** (primary–replica, replication lag, read-your-writes, failover, split brain, replica không thay được backup); vì sao cần sharding, cách chọn shard key, hot partition, chi phí cross-shard; vì sao cần connection pool & vì sao pool quá lớn lại chậm | LRU vs LFU; **cache-aside vs read-through vs write-through vs write-behind**; kiểu dữ liệu Redis cho từng bài toán; **sync vs async replication**; **range vs hash vs directory sharding**; pooling mode (session / transaction / statement); **SQL vs NoSQL** (Document / KV / Wide-column / Graph) | Tên các `maxmemory-policy` của Redis, big key, cú pháp lệnh Redis (`SET ... EX NX`, `EXPIRE`, `ZADD`...), LRU xấp xỉ bằng sampling, RDB vs AOF, cấu hình replication của Postgres/MySQL, công cụ failover (Patroni...), config PgBouncer, công thức pool size, multi-leader/leaderless replication, code chi tiết của từng lời giải LeetCode |

## ⏱ Thời lượng tuần

| Ngày | Giờ làm | Tối/Buổi | Tổng |
|---|---|---|---|
| D50 (T2) | 60' | 85' | 2h25' |
| D51 (T3) | 60' | 85' | 2h25' |
| D52 (T4) | 60' | 90' | 2h30' |
| D53 (T5) | 60' | 85' | 2h25' |
| D54 (T6) | 65' | 85' | 2h30' |
| D55 (T7) | — | 4h00' | 4h00' |
| D56 (CN) | — | 2h55' | 2h55' |

**Tổng tuần: 19h10'** (chưa tính 1h tiếng Anh mỗi ngày)

Ngày nặng nhất là **D55 (Lab cache-aside)**: Lab đã được chia *bắt buộc* / *mở rộng*, Bước 6 (bảng SQL vs NoSQL) dời sang đầu buổi D56; bảng pooling mode của D54 cũng dời sang D56 để buổi tối D54 không vượt 90'.

---

## D50 (T2, 16/11): Redis & cache cơ bản

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 85' (Học 40' + Bảng T2 LRU/LFU 10' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h25'**

### 🧩 DSA: [78. Subsets](https://leetcode.com/problems/subsets/)

- **Pattern (🔴 T1):** *Backtracking*. Bài toán yêu cầu **liệt kê tất cả** cấu hình (tập con, hoán vị, tổ hợp, đường đi) → nghĩ ngay tới backtracking. Hình dung đề bài như một **cây quyết định**: mỗi tầng là một lựa chọn, mỗi lá (hoặc mỗi nút) là một đáp án.
- **Khung chung (🔴 T1, học thuộc ý, không học thuộc code):**

  ```text
  backtrack(state, start):
      nếu state là một đáp án hợp lệ → lưu BẢN SAO của state
      for mỗi lựa chọn c hợp lệ (từ start trở đi):
          chọn c        (thêm c vào state)
          backtrack(state, vị trí tiếp theo)
          bỏ chọn c     (xoá c khỏi state, trả state về như cũ)
  ```

- **Các cách:**
  1. Backtracking với `start` index: ở **mọi nút** đều lưu `state` (vì tập con nào cũng là đáp án), vòng lặp chạy từ `start` để không sinh lại cùng một tập theo thứ tự khác.
  2. Cây nhị phân "lấy / không lấy" phần tử thứ i: lưu đáp án khi i == n.
  3. Lặp: bắt đầu từ `[[]]`, với mỗi phần tử x, nhân đôi danh sách bằng cách thêm x vào mọi tập đã có.
  4. Bitmask: số từ 0 tới 2ⁿ − 1, bit thứ i bật nghĩa là lấy `nums[i]`.
- **Độ phức tạp:** có 2ⁿ tập con, mỗi tập tốn tối đa O(n) để copy → **O(n · 2ⁿ)** thời gian. Bộ nhớ phụ O(n) cho stack đệ quy (không tính output).
- **Lỗi hay gặp:** lưu thẳng `state` (tham chiếu) thay vì bản sao → cuối cùng mọi phần tử trong kết quả đều là cùng một list rỗng.

### 📘 Bài học buổi tối: Redis & cache cơ bản (TTL, eviction LRU/LFU)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Cache là gì, vì sao nhanh (RAM vs disk/mạng), **cache hit / miss / hit ratio** | 🔴 T1 | Giải thích được cache đổi *độ tươi của dữ liệu* lấy *tốc độ* và *giảm tải DB* | `what is caching hit ratio` |
| 2 | Các tầng cache: trình duyệt, CDN, reverse proxy, in-process (trong RAM của app), cache phân tán (Redis) | 🔴 T1 | Kể được 4 tầng; biết vì sao cache in-process gây lệch dữ liệu khi chạy nhiều instance | `caching layers browser cdn application distributed` |
| 3 | Tiêu chí chọn dữ liệu nên cache | 🔴 T1 | Trả lời được câu hỏi cuối bài số 1 (xem chi tiết) | `what data should be cached` |
| 4 | **TTL**: dữ liệu hết hạn sau một khoảng thời gian | 🔴 T1 | Chọn TTL dựa trên: mức chấp nhận dữ liệu cũ, tần suất thay đổi, chi phí tính lại | `cache ttl how to choose` |
| 5 | Redis là gì: in-memory key-value, xử lý lệnh trên một luồng chính, hỗ trợ nhiều kiểu dữ liệu | 🔴 T1 | Giải thích được vì sao Redis nhanh (RAM, cấu trúc dữ liệu tối ưu, không có context switch giữa các lệnh) và hệ quả của đơn luồng: một lệnh O(n) trên tập lớn (`KEYS *`, `SMEMBERS` một set triệu phần tử) chặn **mọi** client | `why is redis fast single threaded` |
| 6 | Redis xoá key hết hạn thế nào: *lazy* (khi truy cập) + *active* (lấy mẫu định kỳ) | 🟢 T3 | Chỉ cần biết key hết hạn không bị xoá ngay lập tức | `redis expire lazy active expiration` |
| 7 | **Eviction**: khi RAM đầy thì đuổi key nào ra | 🔴 T1 | Biết eviction khác expiration: một bên do *hết RAM*, một bên do *hết TTL* | `redis key eviction` |
| 8 | **LRU vs LFU** | 🟡 T2 | Điền bảng so sánh bên dưới | `LRU vs LFU cache eviction` |
| 9 | Tên các `maxmemory-policy` (`noeviction`, `allkeys-lru`, `volatile-lru`, `allkeys-lfu`, `volatile-ttl`...) | 🟢 T3 | Biết mặc định là `noeviction` (đầy RAM thì báo lỗi khi ghi). Dùng làm cache thuần thì thường chọn `allkeys-lru` hoặc `allkeys-lfu` | Redis docs – *Key eviction* |
| 10 | LRU của Redis là **xấp xỉ** (lấy mẫu vài key), không phải LRU chính xác | 🟢 T3 | Chỉ cần biết tồn tại | `redis approximated LRU maxmemory-samples` |
| 11 | Persistence của Redis: RDB (snapshot) vs AOF (log lệnh) | 🟢 T3 | Biết Redis *có thể* lưu xuống đĩa. Dùng làm cache thì chấp nhận mất dữ liệu khi restart | `redis RDB vs AOF` |

**Chi tiết cần hiểu**

- **Nên cache (mục 3):**
  - Đọc nhiều, ghi ít (danh mục sản phẩm, cấu hình, profile).
  - Tính toán tốn kém (kết quả aggregate, trang chủ, bảng xếp hạng).
  - Chấp nhận được việc cũ vài giây tới vài phút.
- **Không nên cache (hoặc phải rất cẩn thận):**
  - Dữ liệu cần chính xác tuyệt đối tại thời điểm đọc: **số dư tài khoản, tồn kho lúc trừ kho** (đọc để hiển thị thì được, đọc để *quyết định* thì phải đọc DB trong transaction).
  - Dữ liệu ghi nhiều hơn đọc: cache liên tục bị xoá, hit ratio thấp, chỉ tốn thêm một bước.
  - Dữ liệu cá nhân hoá quá cao, mỗi key chỉ đọc một lần.
  - Dữ liệu nhạy cảm nếu không kiểm soát được quyền truy cập cache.
- **Chọn TTL:** TTL dài → hit ratio cao nhưng dữ liệu cũ lâu hơn. TTL ngắn → dữ liệu tươi nhưng DB chịu tải nhiều hơn. TTL là **lưới an toàn**: kể cả khi quên invalidate, dữ liệu sai cũng tự hết sau TTL. Vì vậy key cache **nên luôn có TTL**.
- **Eviction vs Expiration:** expiration xoá key vì đã *hết hạn*. Eviction đuổi key *còn hạn* vì RAM đã chạm `maxmemory`. Chạy Redis làm cache mà để `noeviction` là lỗi cấu hình hay gặp: đầy RAM thì mọi lệnh ghi báo lỗi.
- **LRU vs LFU bằng ví dụ:** một job quét toàn bộ sản phẩm một lần (scan). Với LRU, các key bị quét trở thành "mới dùng gần đây" và đẩy các key hot thật sự ra ngoài. LFU nhớ *tần suất*, nên key hot vẫn ở lại. Ngược lại, LFU chậm thích nghi khi một key từng rất hot nay không còn ai dùng (Redis xử lý bằng cơ chế giảm dần bộ đếm theo thời gian).
- **Liên hệ DSA:** bạn đã cài LRU Cache (bài 146, Tuần 4) bằng HashMap + doubly linked list. Đó chính là nguyên lý, còn Redis dùng bản xấp xỉ để tiết kiệm bộ nhớ.

**🟡 Bảng so sánh T2: LRU vs LFU**

Nhóm: *chính sách thay thế cache (eviction policy)*. Trục chính: **gần đây (recency)** vs **thường xuyên (frequency)**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | LRU | LFU |
|---|---|---|
| Core: Use-case lý tưởng | | |
| Core: Trade-off chính | | |
| Core: Khi nào KHÔNG dùng | | |
| Ext: Chịu được "scan" (quét một lượt nhiều key) không? | | |
| Ext: Thích nghi nhanh khi xu hướng truy cập thay đổi? | | |
| Ext: Chi phí theo dõi (bookkeeping) | | |

**🔴 Thẻ Anki (T1)**

1. Kể 3 loại dữ liệu nên cache và 2 loại không nên cache. Vì sao?
2. TTL dài và TTL ngắn đánh đổi điều gì? Vì sao key cache nên luôn có TTL?
3. Eviction khác expiration thế nào?
4. Vì sao cache in-process (trong RAM của app) gây lệch dữ liệu khi chạy 2 instance?
5. Vì sao Redis nhanh dù xử lý lệnh trên một luồng chính?
6. *(DSA-Pattern)* Dấu hiệu "liệt kê tất cả tập con / hoán vị / tổ hợp" → pattern gì? Khung 3 bước là gì?

**🟢 Tra cứu (T3):** Redis docs (redis.io/docs): trang *Key eviction*, lệnh `EXPIRE` / `TTL` / `SET` (tuỳ chọn `EX`, `PX`, `NX`), `INFO stats` (xem `keyspace_hits`, `keyspace_misses`), *Redis persistence*.

**Tài liệu:**
- Redis docs: *Key eviction*, *EXPIRE*
- ByteByteGo: các video/bài về caching (tìm `bytebytego cache`)
- NeetCode: video giải bài 78 Subsets (phần Backtracking của NeetCode 150)

**❓ Câu hỏi cuối bài**

1. Dữ liệu nào nên cache, dữ liệu nào không nên?
2. Chọn TTL dựa trên tiêu chí gì?
3. LRU khác LFU thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Redis dùng làm cache, đầy RAM thì mọi lệnh `SET` báo lỗi `OOM command not allowed`. Vì sao? Sửa cấu hình thế nào? Eviction khác expiration ở điểm nào?
5. Service chạy 2 instance, mỗi instance cache sản phẩm trong RAM của chính nó 5 phút. Admin đổi giá, người dùng F5 thấy lúc giá cũ lúc giá mới. Giải thích và nêu 2 cách sửa.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Nên: đọc nhiều ghi ít, tính toán tốn kém, chấp nhận cũ vài giây–vài phút.
- Không nên: dữ liệu dùng để **quyết định** (số dư, tồn kho lúc trừ kho), ghi nhiều hơn đọc, mỗi key chỉ đọc một lần, dữ liệu nhạy cảm.

**2.**
- Mức chấp nhận dữ liệu cũ, tần suất thay đổi, chi phí tính lại.
- TTL dài → hit ratio cao nhưng cũ lâu; TTL ngắn → tươi nhưng DB chịu tải hơn.
- Luôn đặt TTL: lưới an toàn khi quên invalidate.

**3.**
- LRU đuổi key lâu nhất chưa dùng (recency); LFU đuổi key ít được dùng nhất (frequency).
- LRU dễ bị một lượt scan đẩy key hot ra; LFU chịu scan tốt nhưng chậm thích nghi khi xu hướng đổi.

**4.**
- Mặc định `maxmemory-policy noeviction`: chạm `maxmemory` thì từ chối ghi.
- Làm cache thuần → `allkeys-lru` hoặc `allkeys-lfu`.
- Expiration: xoá vì hết TTL. Eviction: đuổi key **còn hạn** vì hết RAM.

**5.**
- Mỗi instance có bản cache riêng; invalidate ở instance A không xoá được cache ở B; LB chia request luân phiên.
- Sửa: dùng cache dùng chung (Redis); hoặc giữ cache in-process với TTL rất ngắn + phát sự kiện invalidate (pub/sub) tới mọi instance.

</details>

---

## D51 (T3, 17/11): Chiến lược cache

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 85' (Học 35' + Bảng T2 chiến lược cache 15' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h25'**

> ⏱ *Học 35'* dành cho các mục T1 (1, 6, 7); các mục T2 (2, 3, 4) học ngay trong lúc điền bảng so sánh.

### 🧩 DSA: [39. Combination Sum](https://leetcode.com/problems/combination-sum/)

- **Pattern (🔴 T1):** *Backtracking tổ hợp, được dùng lại phần tử*.
- **Điểm khác với Subsets:**
  - Vì mỗi số được dùng **nhiều lần**, khi đệ quy ta truyền lại **chính `i`** (không phải `i + 1`).
  - Vẫn cần `start` để không sinh trùng tổ hợp theo thứ tự khác ([2,3] và [3,2]).
  - Điều kiện dừng: `remaining == 0` → lưu đáp án; `remaining < 0` → quay lui.
- **Tỉa nhánh (pruning):** sort `candidates` trước. Khi `candidates[i] > remaining` thì `break` luôn (các số sau còn lớn hơn), không chỉ `continue`.
- **Độ phức tạp:** hàm mũ. Cận trên hay được nêu là O(N^(T/M + 1)), với T là target và M là số nhỏ nhất (độ sâu cây tối đa T/M). Khi phỏng vấn chỉ cần nói được *vì sao* nó là hàm mũ và độ sâu stack là O(T/M).

### 📘 Bài học buổi tối: Chiến lược cache (cache-aside / write-through / write-behind) + invalidation

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Luồng cache-aside** (lazy loading): app tự đọc cache, miss thì đọc DB rồi ghi vào cache | 🔴 T1 | Vẽ được luồng đọc và luồng ghi ra giấy không cần nhìn | `cache aside pattern` |
| 2 | Read-through: thư viện/cache layer tự nạp từ DB khi miss | 🟡 T2 | Phân biệt được với cache-aside: *ai* chịu trách nhiệm nạp dữ liệu | `read through vs cache aside` |
| 3 | Write-through: ghi vào cache và DB **đồng bộ** trong cùng thao tác | 🟡 T2 | Nói được ưu (cache luôn tươi) và nhược (ghi chậm hơn, cache chứa cả dữ liệu không ai đọc) | `write through cache` |
| 4 | Write-behind (write-back): ghi vào cache trước, **đẩy xuống DB bất đồng bộ** sau | 🟡 T2 | Nói được rủi ro: mất dữ liệu nếu cache chết trước khi flush | `write behind cache risk` |
| 5 | Write-around: ghi thẳng DB, bỏ qua cache | 🟢 T3 | Chỉ cần biết tên. Cache-aside thực chất ghi theo kiểu này | `write around cache` |
| 6 | **Invalidation: xoá hay cập nhật cache khi ghi DB?** | 🔴 T1 | Giải thích được vì sao "cập nhật DB rồi **xoá** cache" là mặc định an toàn (xem chi tiết) | `cache invalidation delete vs update` |
| 7 | Thứ tự thao tác: xoá cache trước hay ghi DB trước? Race condition còn sót lại của cache-aside | 🔴 T1 | Vẽ được timeline 2 request gây ra dữ liệu cũ trong cache | `cache aside race condition stale data` |
| 8 | Delayed double delete, invalidation qua CDC (đọc binlog/WAL) | 🟢 T3 | Chỉ cần biết tồn tại như cách giảm cửa sổ dữ liệu cũ | `delayed double delete cache`, `cache invalidation CDC` |
| 9 | Đặt tên key có version (`product:42:v2`) để invalidate hàng loạt khi đổi format | 🟢 T3 | Biết mẹo này tồn tại | `cache key versioning` |

**Chi tiết cần hiểu**

- **Cache-aside (mục 1):**
  - *Đọc:* `GET key` → hit thì trả về. Miss thì query DB → `SET key value EX ttl` → trả về.
  - *Ghi:* cập nhật DB (commit xong) → `DEL key`. Lần đọc sau sẽ miss và nạp giá trị mới.
  - Ưu: đơn giản, cache chỉ chứa dữ liệu thật sự được đọc, Redis chết thì app vẫn chạy (chỉ chậm hơn).
  - Nhược: lần đọc đầu tiên luôn miss; có một cửa sổ nhỏ có thể dữ liệu cũ (xem mục 7).
- **Vì sao xoá thường an toàn hơn cập nhật (mục 6):**
  - *Hai lệnh ghi đồng thời:* A ghi DB = 1, B ghi DB = 2, B `SET cache = 2`, rồi A mới `SET cache = 1`. Kết quả: DB = 2 nhưng cache = 1, và sai cho tới khi hết TTL. Nếu cả hai chỉ `DEL`, thứ tự không quan trọng: `DEL` hai lần vẫn là "không có key".
  - *Tốn công vô ích:* giá trị cache có thể là kết quả tổng hợp phức tạp. Cập nhật sau mỗi lần ghi là phí nếu không ai đọc.
  - `DEL` là thao tác **idempotent**, retry thoải mái.
- **Thứ tự thao tác (mục 7):**
  - *Xoá cache trước rồi mới ghi DB:* sai. Giữa hai bước, một request đọc thấy miss, đọc giá trị **cũ** từ DB và ghi lại vào cache → cache cũ tới hết TTL.
  - *Ghi DB rồi xoá cache:* vẫn còn một khe hở hiếm gặp: request đọc bị miss, đọc giá trị cũ từ DB, **chậm** tới mức request ghi đã cập nhật DB và xoá cache xong, rồi nó mới ghi giá trị cũ vào cache. Khe hở này chỉ xảy ra khi lần đọc DB chậm hơn cả một lần ghi, nên rất hiếm. TTL là lưới an toàn cuối cùng.
  - Xoá cache **sau khi transaction commit**, không phải trước khi commit (nếu xoá trong transaction rồi transaction rollback hoặc chưa commit, request khác vẫn nạp lại giá trị cũ).
- **Write-behind:** throughput ghi rất cao (gộp nhiều lần ghi thành một batch), nhưng: cache chết là mất dữ liệu chưa flush; DB có thể nhận các lần ghi không đúng thứ tự; khó debug. Hợp với số liệu kiểu bộ đếm lượt xem, không hợp với đơn hàng hay thanh toán.

**🟡 Bảng so sánh T2: các chiến lược cache**

Nhóm: *chiến lược đồng bộ cache ↔ DB* (gần với nhóm *Data storage*). Trục chính: **tính nhất quán / độ an toàn dữ liệu** vs **độ trễ ghi**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | Cache-aside | Read-through | Write-through | Write-behind |
|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | |
| Core: Trade-off chính | | | | |
| Core: Khi nào KHÔNG dùng | | | | |
| Ext: Độ tươi của cache so với DB | | | | |
| Ext: Độ trễ của thao tác ghi | | | | |
| Ext: Rủi ro mất dữ liệu khi cache chết | | | | |

**Thẻ Anki T2:** *"Khi nào chọn write-through thay vì cache-aside? Khi nào write-behind chấp nhận được?"*

**🔴 Thẻ Anki (T1)**

1. Vẽ luồng đọc và luồng ghi của cache-aside.
2. Vì sao khi ghi DB nên **xoá** cache thay vì **cập nhật** cache? (gợi ý: 2 lệnh ghi đồng thời, idempotent)
3. Vì sao "xoá cache trước, ghi DB sau" có thể để lại dữ liệu cũ trong cache?
4. Vì sao phải xoá cache **sau khi commit**?
5. *(DSA-Pattern)* Combination Sum cho phép dùng lại phần tử: khi đệ quy truyền `i` hay `i + 1`? Tỉa nhánh bằng cách nào?

**🟢 Tra cứu (T3):** tài liệu cache của framework bạn dùng (ví dụ Spring Cache `@Cacheable`/`@CacheEvict`, NestJS `CacheModule`, Django cache framework). Chỉ lưu link vào `notes/snippets.md`.

**Tài liệu:**
- ByteByteGo: các video/bài về caching strategies (tìm `bytebytego caching strategies`)
- Tài liệu AWS *Caching best practices* (phần lazy loading vs write-through) nếu muốn đọc thêm

**❓ Câu hỏi cuối bài**

1. Mô tả luồng đọc và luồng ghi của cache-aside.
2. Khi update DB, nên **xoá** cache hay **cập nhật** cache? Vì sao xoá thường an toàn hơn?
3. Write-behind có rủi ro gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Code của bạn làm theo thứ tự: `DEL cache` → `UPDATE DB` → `COMMIT`. Vẽ timeline cho thấy cache vẫn giữ giá cũ tới hết TTL. Đổi thứ tự thế nào, và khe hở nào vẫn còn sót lại?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Đọc: `GET` → hit trả luôn; miss → query DB → `SET … EX ttl` → trả về.
- Ghi: cập nhật DB, commit xong → `DEL key`.
- App tự lo cache; Redis chết thì vẫn chạy được (chậm hơn).

**2.**
- Xoá: hai lệnh ghi đồng thời có thể `SET` sai thứ tự → cache giữ giá trị cũ; `DEL` thì thứ tự không quan trọng.
- `DEL` idempotent, retry thoải mái; không tốn công tính lại giá trị không ai đọc.

**3.**
- Cache chết trước khi flush → mất dữ liệu đã báo thành công.
- DB nhận ghi trễ, có thể sai thứ tự; khó debug. Chỉ hợp số liệu kiểu bộ đếm lượt xem.

**4.**
- Giữa `DEL` và `COMMIT`, một request đọc bị miss, đọc giá **cũ** từ DB (chưa commit) và `SET` lại vào cache.
- Đúng: `UPDATE` → `COMMIT` → `DEL` (sau commit).
- Vẫn còn khe hở hiếm: request đọc chậm đọc giá cũ trước khi ghi, `SET` sau khi `DEL` → TTL (hoặc delayed double delete) là lưới an toàn.

</details>

---

## D52 (T4, 18/11): Sự cố cache + kiểu dữ liệu Redis

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 90' (Học 40' + Bảng T2 kiểu dữ liệu Redis 15' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h30'**

> ⏱ Tối đã chạm trần 90': nếu quá giờ, điền trước 3 cột String / Hash / Sorted Set; 2 cột List / Set là *(tuỳ chọn)*.

### 🧩 DSA: [46. Permutations](https://leetcode.com/problems/permutations/)

- **Pattern (🔴 T1):** *Backtracking hoán vị*. Thứ tự **có** ý nghĩa, nên mỗi tầng được chọn **bất kỳ** phần tử nào chưa dùng, không dùng `start` index.
- **Hai cách đánh dấu:**
  1. Mảng `used[]` (hoặc set): chọn → `used[i] = true`, đệ quy, bỏ chọn → `used[i] = false`.
  2. Swap tại chỗ: đổi `nums[start]` với `nums[i]`, đệ quy với `start + 1`, rồi đổi lại.
- **Độ phức tạp:** n! hoán vị, mỗi cái copy O(n) → **O(n · n!)**. Bộ nhớ phụ O(n).
- **Ghi vào Error List nếu nhầm:** *Tổ hợp/tập con* → dùng `start` (không quay lại phía trước). *Hoán vị* → dùng `used` (được chọn lại phía trước, chỉ cấm phần tử đã có trong state).

### 📘 Bài học buổi tối: Sự cố cache (stampede, penetration, avalanche) + kiểu dữ liệu Redis

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Cache stampede** (thundering herd / dog-piling): một key hot hết hạn, hàng loạt request cùng miss và cùng đập vào DB | 🔴 T1 | Mô tả được cơ chế và 3 cách chống | `cache stampede prevention` |
| 2 | **Cache penetration**: liên tục hỏi key **không tồn tại** trong DB, nên cache không bao giờ hit | 🔴 T1 | Nêu được 3 cách chống | `cache penetration bloom filter` |
| 3 | **Cache avalanche**: rất nhiều key hết hạn cùng lúc, hoặc cả cụm cache chết | 🔴 T1 | Phân biệt được với stampede (một key vs rất nhiều key) | `cache avalanche` |
| 4 | Nguyên lý **Bloom filter**: có thể báo nhầm "có" (false positive), không bao giờ báo nhầm "không" | 🔴 T1 | Giải thích được vì sao nó hợp để chặn penetration | `bloom filter explained false positive` |
| 5 | **Hot key**: một key nhận lượng đọc cực lớn, dồn tải vào một node Redis | 🔴 T1 | Biết tên và 2 cách giảm: cache in-process ngắn hạn phía trước, nhân bản key (`product:42#1..#N`, đọc ngẫu nhiên một bản). Biết thêm tên *big key* (một value vài MB hoặc một collection triệu phần tử): đọc/xoá nó chặn Redis đơn luồng | `redis hot key problem`, `redis big key` |
| 6 | **Kiểu dữ liệu Redis** và bài toán tương ứng | 🟡 T2 | Điền bảng bên dưới | `redis data types use cases` |
| 7 | Lock phân tán đơn giản bằng `SET key token NX PX 3000` | 🟢 T3 | Biết lệnh này dùng để làm mutex cho stampede; khi nhả lock phải kiểm tra đúng `token` của mình rồi mới xoá (nếu không có thể xoá nhầm lock của request khác khi lock đã hết hạn). Redlock và các tranh luận xung quanh: chỉ cần biết tồn tại | `redis SET NX PX lock` |
| 8 | Cú pháp lệnh từng kiểu (`HSET`, `LPUSH`, `SADD`, `ZADD`, `ZRANGE`...) | 🟢 T3 | Tra khi cần | Redis docs – *Commands* |
| 9 | HyperLogLog, Bitmap, Stream, Geo | 🟢 T3 | Biết tồn tại: HyperLogLog đếm số phần tử khác nhau xấp xỉ (ví dụ số người xem), Stream là log dạng append | `redis hyperloglog use case` |

**Chi tiết cần hiểu**

- **Chống stampede (mục 1):**
  - *Mutex / single-flight:* request đầu tiên bị miss lấy lock (`SET lock:key ... NX PX`) rồi đi nạp DB. Các request khác chờ ngắn rồi đọc lại cache, hoặc trả dữ liệu cũ.
  - *Làm mới sớm (early / probabilistic refresh):* trước khi key hết hạn thật, một request ngẫu nhiên đi nạp lại trước.
  - *Stale-while-revalidate / không để key hot hết hạn:* lưu kèm "hạn mềm", hết hạn mềm thì vẫn trả giá trị cũ và cho một job nền cập nhật.
- **Chống penetration (mục 2):**
  - Cache luôn cả kết quả "không tồn tại" (null / giá trị rỗng) với TTL **ngắn** (ví dụ 30–60 giây).
  - Bloom filter chứa mọi ID hợp lệ đặt trước cache: filter nói "không có" thì trả 404 ngay, không đụng DB.
  - Validate input (ID âm, sai định dạng) và rate limit theo client.
- **Chống avalanche (mục 3):**
  - Cộng **jitter** vào TTL (ví dụ 300s ± 10%) để các key không hết hạn cùng một lúc sau khi warm-up hàng loạt.
  - Cache có tính sẵn sàng cao (replica + Sentinel, hoặc Redis Cluster).
  - Bảo vệ DB khi cache chết: rate limit, circuit breaker, trả dữ liệu mặc định (sẽ học kỹ ở Tuần 12).
- **Cách nhớ nhanh:** *Stampede* = **một** key hot hết hạn. *Avalanche* = **nhiều** key cùng hết hạn (hoặc cả cache sập). *Penetration* = key **không bao giờ tồn tại**.
- **Sorted set (ZSET):** mỗi phần tử có một `score`, luôn được giữ theo thứ tự score. Thêm/xoá O(log n), lấy top-K theo khoảng O(log n + K). Dùng cho: bảng xếp hạng, sliding-window rate limiter (score = timestamp, sẽ dùng ở Tuần 10), hàng đợi trì hoãn (score = thời điểm cần chạy), "N bài mới nhất".

**🟡 Bảng so sánh T2: chọn kiểu dữ liệu Redis**

Nhóm: *cấu trúc dữ liệu trong kho key-value*. Trục chính: **thao tác nào cần nhanh** (truy cập theo field, theo thứ tự, theo thành viên) vs **bộ nhớ**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | String | Hash | List | Set | Sorted Set |
|---|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | | |
| Core: Trade-off chính | | | | | |
| Core: Khi nào KHÔNG dùng | | | | | |
| Ext: Độ phức tạp thao tác chính | | | | | |
| Ext: Cập nhật một phần giá trị được không? | | | | | |

**🔴 Thẻ Anki (T1)**

1. Phân biệt stampede, penetration, avalanche trong một câu mỗi loại.
2. Nêu 3 cách chống cache stampede.
3. Vì sao cache cả giá trị "không tồn tại" giúp chống penetration? Vì sao TTL của nó phải ngắn?
4. Bloom filter có thể sai theo chiều nào? Vì sao chiều sai đó chấp nhận được khi chặn penetration?
5. Vì sao cần cộng jitter vào TTL?
6. *(DSA-Pattern)* Khi nào dùng `start` index, khi nào dùng mảng `used`?

**🟢 Tra cứu (T3):** Redis docs: *Data types*, *Commands* (`SET` với `NX`/`PX`, `ZADD`, `ZRANGE`, `ZREMRANGEBYSCORE`), *Distributed locks with Redis*.

**Tài liệu:**
- ByteByteGo: tìm `bytebytego cache problems` (stampede / penetration / avalanche)
- Redis docs: *Understand Redis data types*

**❓ Câu hỏi cuối bài**

1. Cache stampede là gì? Chống bằng cách nào (lock, TTL lệch nhau)?
2. Cache penetration (liên tục hỏi key không tồn tại) chống bằng gì?
3. Sorted set của Redis dùng cho bài toán nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Sau khi deploy, một job warm-up nạp 1 triệu key với cùng TTL 1 giờ. Đúng 1 giờ sau DB quá tải. Đây là sự cố gì, khác stampede thế nào, và sửa ra sao?
5. Một sản phẩm flash sale nhận 200 nghìn lượt đọc/giây vào đúng một key Redis; node chứa key đó quá tải dù cả cluster còn rảnh. Vì sao thêm node vào cluster không giúp? Nêu 2 cách giảm tải.

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Một key hot hết hạn → hàng loạt request cùng miss và cùng đập vào DB.
- Chống: mutex / single-flight (`SET lock NX PX`), làm mới sớm trước khi hết hạn, stale-while-revalidate.

**2.**
- Cache luôn kết quả "không tồn tại" với TTL ngắn.
- Bloom filter chứa ID hợp lệ đặt trước cache: báo "không có" là chắc chắn không có (chỉ sai theo chiều false positive).
- Validate input + rate limit theo client.

**3.**
- Phần tử có `score`, luôn giữ thứ tự; thêm/xoá O(log n), lấy top-K O(log n + K).
- Bảng xếp hạng, sliding-window rate limiter (score = timestamp), hàng đợi trì hoãn, "N bài mới nhất".

**4.**
- Avalanche: **nhiều** key hết hạn cùng lúc (stampede chỉ là **một** key hot).
- Sửa: cộng jitter vào TTL; warm-up rải dần; bảo vệ DB bằng rate limit / circuit breaker.

**5.**
- Một key chỉ nằm trên một node (một slot) → thêm node không chia được tải của chính key đó.
- Cache in-process vài giây trước Redis; nhân bản key thành N bản (`key#1..#N`) và đọc ngẫu nhiên; thêm replica để đọc.

</details>

---

## D53 (T5, 19/11): Replication

**⏱ Ước tính:** Giờ làm 60' (DSA 45' + Anki 15') · Tối 85' (Học 40' + Bảng T2 sync/async 10' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h25'**

### 🧩 DSA: [90. Subsets II](https://leetcode.com/problems/subsets-ii/)

- **Pattern (🔴 T1):** *Backtracking + bỏ trùng*. Input có phần tử lặp, output không được có tập con trùng.
- **Cách làm:** **sort trước**, rồi trong vòng lặp: `if i > start and nums[i] == nums[i-1]: continue`.
- **Hiểu cho đúng điều kiện `i > start`:** ta chỉ bỏ phần tử trùng **ở cùng một tầng** của cây (hai nhánh anh em cùng bắt đầu bằng số 2 sẽ sinh ra cùng tập). Còn ở tầng sâu hơn, lấy số 2 thứ hai sau số 2 thứ nhất vẫn hợp lệ ([2, 2]).
- **Độ phức tạp:** O(n · 2ⁿ) trong trường hợp xấu nhất (không có phần tử trùng), sort O(n log n) không đáng kể.
- **Cách khác (kém hơn):** sinh hết rồi bỏ trùng bằng set các tuple. Vẫn đúng nhưng tốn thời gian sinh tập thừa. Người phỏng vấn muốn thấy cách tỉa ngay từ đầu.

### 📘 Bài học buổi tối: Replication (primary–replica, sync vs async, replication lag)

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | **Primary–replica** (leader–follower): mọi lệnh ghi vào primary, primary gửi log thay đổi (WAL / binlog) cho replica | 🔴 T1 | Vẽ được sơ đồ; nói được 3 mục đích: scale đọc, chịu lỗi (HA), đặt dữ liệu gần người dùng | `leader follower replication` |
| 2 | **Sync vs async replication** (và semi-sync) | 🟡 T2 | Điền bảng bên dưới | `synchronous vs asynchronous replication` |
| 3 | **Replication lag** và các hệ quả: *read-your-writes*, *monotonic reads* | 🔴 T1 | Cho được ví dụ người dùng thấy "mất" dữ liệu vừa ghi, và 2–3 cách xử lý | `replication lag read your writes` |
| 4 | **Failover**: phát hiện primary chết → chọn replica mới nhất → trỏ client sang primary mới | 🔴 T1 | Kể được 3 bước và 3 rủi ro (mất dữ liệu async, split brain, chọn timeout). Biết quyết định failover nên do **nhiều** node giám sát bỏ phiếu (quorum), không để một node tự kết luận | `database failover split brain`, `failover quorum fencing` |
| 5 | Read replica chỉ giúp **đọc**, không giúp **ghi** | 🔴 T1 | Giải thích được vì sao hệ ghi nhiều không giải được bằng replica | `read replicas scale reads not writes` |
| 6 | Multi-leader, leaderless (quorum) | 🟢 T3 | Chỉ cần biết tồn tại và có vấn đề xung đột khi ghi | DDIA ch.5 |
| 7 | Cấu hình cụ thể (`synchronous_commit`, `synchronous_standby_names` của Postgres, semi-sync của MySQL) | 🟢 T3 | Tra khi cần | PostgreSQL docs – *High Availability, Load Balancing, and Replication* |
| 8 | Công cụ tự động failover (Patroni cho Postgres, dịch vụ managed như RDS Multi-AZ) | 🟢 T3 | Biết tồn tại | `patroni postgres failover` |
| 9 | Replica **không** thay được backup: lệnh xoá nhầm (`DELETE` thiếu WHERE, `DROP TABLE`) được nhân bản sang replica gần như ngay lập tức | 🔴 T1 | Nói được cần thêm backup định kỳ + WAL archive để khôi phục theo thời điểm (PITR, nối với D46 Tuần 7) | `replication is not backup`, `postgres point in time recovery` |

**Chi tiết cần hiểu**

- **Replication lag (mục 3):** với async replication, replica có thể chậm vài ms tới vài giây, thậm chí lâu hơn khi tải cao.
  - *Read-your-writes:* user sửa tên, trang reload đọc từ replica chưa kịp cập nhật → thấy tên cũ, tưởng lưu thất bại.
  - *Monotonic reads:* user refresh hai lần, lần một vào replica mới, lần hai vào replica cũ → dữ liệu "đi lùi".
- **Cách xử lý read-your-writes:**
  - Đọc dữ liệu **của chính user** từ primary (ví dụ trang profile của mình), dữ liệu của người khác đọc từ replica.
  - Sau khi user ghi, trong một khoảng thời gian (ví dụ 1 phút) đọc từ primary cho user đó.
  - Ghi nhớ vị trí log (LSN / timestamp) của lần ghi cuối, chỉ đọc từ replica đã bắt kịp vị trí đó.
  - Monotonic reads: gắn mỗi user với cùng một replica (chọn replica theo hash của user_id).
- **Failover (mục 4):**
  1. *Phát hiện:* primary không trả heartbeat trong N giây. Timeout ngắn → failover nhầm khi mạng chập chờn. Timeout dài → downtime lâu.
  2. *Chọn primary mới:* thường là replica có dữ liệu mới nhất.
  3. *Cấu hình lại:* client và các replica khác trỏ về primary mới.
  - *Rủi ro:* với async, các lệnh ghi chưa kịp sang replica sẽ **mất**. Primary cũ sống lại mà vẫn tưởng mình là primary → **split brain** (hai nơi cùng nhận ghi). Cần cơ chế "rào" (fencing) primary cũ.
- **Liên hệ Tuần 7:** replica của Postgres nhận WAL từ primary. Đây chính là WAL bạn đã học, nay được dùng thêm cho mục đích nhân bản.

**🟡 Bảng so sánh T2: Sync vs Async replication**

Nhóm: *replication / độ bền dữ liệu*. Trục chính: **độ bền (không mất dữ liệu)** vs **độ trễ ghi và tính sẵn sàng**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | Synchronous | Asynchronous | Semi-synchronous |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Mất dữ liệu khi primary chết? | | | |
| Ext: Độ trễ của lệnh ghi | | | |
| Ext: Replica chết hoặc chậm thì lệnh ghi bị ảnh hưởng gì? | | | |

**Thẻ Anki T2:** *"Khi nào chọn sync replication thay vì async?"*

**🔴 Thẻ Anki (T1)**

1. Primary–replica hoạt động thế nào? Kể 3 lợi ích.
2. Replication lag gây ra lỗi *read-your-writes* thế nào? Kể 2 cách xử lý.
3. Failover gồm những bước nào? Split brain là gì?
4. Vì sao thêm read replica không giúp một hệ thống đang nghẽn ở phía **ghi**?
5. *(DSA-Pattern)* Subsets II: điều kiện bỏ trùng là gì? Vì sao phải có `i > start`?

**🟢 Tra cứu (T3):** PostgreSQL docs – chương *High Availability, Load Balancing, and Replication* (streaming replication, `synchronous_commit`); MySQL docs – *Replication* (semi-synchronous).

**Tài liệu:**
- DDIA ch.5 *Replication*: đọc lướt các phần *Leaders and Followers*, *Problems with Replication Lag*. Bỏ qua multi-leader và leaderless
- ByteByteGo: tìm `bytebytego database replication`

**❓ Câu hỏi cuối bài**

1. Vừa ghi xong đọc từ replica có thể thấy dữ liệu cũ. Xử lý thế nào (read-your-writes)?
2. Replication đồng bộ và bất đồng bộ: trade-off là gì?
3. Primary chết thì failover diễn ra thế nào?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Primary đang 95% CPU vì lượng INSERT đơn hàng. Đồng nghiệp đề xuất thêm 3 read replica. Bạn phản biện thế nào và đề xuất hướng nào?
5. Ai đó chạy nhầm `DELETE FROM orders` (thiếu WHERE) trên primary. Replica có cứu được dữ liệu không? Hệ thống cần có gì để khôi phục?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Đọc dữ liệu của chính user từ primary (hoặc trong ~1 phút sau khi user ghi).
- Nhớ vị trí log (LSN/timestamp) của lần ghi cuối, chỉ đọc từ replica đã bắt kịp.
- Monotonic reads: gắn user với cùng một replica (hash `user_id`).

**2.**
- Sync: không mất dữ liệu khi primary chết, nhưng ghi chậm hơn và replica chết/chậm làm nghẽn ghi.
- Async: ghi nhanh, primary không phụ thuộc replica, nhưng có lag và có thể mất các lệnh ghi cuối khi failover.
- Semi-sync: chờ ít nhất một replica xác nhận, điểm cân bằng.

**3.**
- Phát hiện (heartbeat timeout, nên có quorum) → chọn replica mới nhất → trỏ client và các replica khác sang primary mới.
- Rủi ro: mất ghi chưa sang replica (async), split brain khi primary cũ sống lại → cần fencing; timeout quá ngắn → failover nhầm.

**4.**
- Replica chỉ chia tải **đọc**; mọi lệnh ghi vẫn phải vào primary (và còn phải nhân bản sang replica).
- Đo trước: index thừa làm chậm ghi, transaction dài, batch INSERT; scale dọc; queue để làm mượt đỉnh; cuối cùng mới sharding.

**5.**
- Không: lệnh xoá được nhân bản sang replica gần như ngay → replica không phải backup.
- Cần backup định kỳ + WAL archive để khôi phục theo thời điểm (PITR) về ngay trước lệnh xoá.

</details>

---

## D54 (T6, 20/11): Sharding + connection pooling

**⏱ Ước tính:** Giờ làm 65' (DSA 50' + Anki 15') · Tối 85' (Học 40' + Bảng T2 sharding 10' + Ghi chú/Anki 15' + Tự kiểm tra 20') · **Tổng 2h30'**

> ⏱ Bảng T2 *Pooling mode* (10') dời sang **D56**.

### 🧩 DSA: [79. Word Search](https://leetcode.com/problems/word-search/)

- **Pattern (🔴 T1):** *Backtracking trên lưới (DFS + đánh dấu visited)*. Kết hợp DFS lưới (Tuần 7) với chọn → đệ quy → bỏ chọn.
- **Cách làm:**
  - Thử bắt đầu từ mọi ô có ký tự bằng `word[0]`.
  - `dfs(r, c, k)`: ra ngoài lưới, hoặc ô đã dùng, hoặc `board[r][c] != word[k]` → false. `k == len(word) - 1` và khớp → true.
  - **Chọn:** đánh dấu ô tạm thời (ví dụ gán `board[r][c] = '#'`). **Đệ quy** 4 hướng. **Bỏ chọn:** trả lại ký tự cũ.
- **Khác với Number of Islands:** ở đảo, visited là vĩnh viễn. Ở đây, visited phải được **gỡ ra** khi quay lui, vì ô đó có thể thuộc một đường đi khác.
- **Độ phức tạp:** O(m · n · 3ᴸ) với L là độ dài từ (từ bước thứ 2, mỗi ô chỉ còn tối đa 3 hướng vì không quay lại ô vừa đi). Bộ nhớ O(L) cho stack.
- **Tỉa nhánh (follow-up hay hỏi):** đếm ký tự trên bảng, thiếu ký tự thì trả false ngay; nếu ký tự cuối của `word` hiếm hơn ký tự đầu thì đảo ngược `word` trước khi tìm.

### 📘 Bài học buổi tối: Sharding (range / hash / directory) + connection pooling

**Mục kiến thức cần học**

| # | Mục | Tier | Cần nắm tới mức nào | Từ khoá research |
|---|---|---|---|---|
| 1 | Vì sao cần sharding: dữ liệu hoặc lượng **ghi** vượt khả năng một máy | 🔴 T1 | Nói được sharding là bước **cuối** khi đã hết cách khác (index, cache, replica, scale dọc, partition trong một DB) | `when to shard database` |
| 2 | Partitioning (chia bảng trong một DB) vs sharding (chia dữ liệu ra nhiều server) | 🔴 T1 | Phân biệt được bằng một câu | `partitioning vs sharding` |
| 3 | **Chọn shard key**: nhiều giá trị khác nhau, phân bố đều, khớp với kiểu query chính | 🔴 T1 | Chọn được shard key cho bảng `orders` và giải thích | `how to choose shard key` |
| 4 | **Range vs Hash vs Directory sharding** | 🟡 T2 | Điền bảng bên dưới | `range vs hash vs directory based sharding` |
| 5 | **Hot partition** (hotspot) | 🔴 T1 | Cho được 2 ví dụ: shard theo ngày tạo (mọi lệnh ghi dồn vào shard mới nhất), một "celebrity" user | `hot partition sharding celebrity problem` |
| 6 | Cái giá của sharding: query/JOIN xuyên shard (scatter-gather), transaction xuyên shard, ID duy nhất toàn cục, resharding | 🔴 T1 | Kể được 4 cái giá | `sharding challenges cross shard join` |
| 7 | Resharding: vì sao `hash mod N` phải di chuyển gần hết dữ liệu khi đổi N | 🔴 T1 | Chỉ cần nêu vấn đề. Lời giải (consistent hashing) học ở D61, Tuần 9 | `hash mod n resharding problem` |
| 8 | **Vì sao cần connection pool**, và vì sao pool quá lớn lại chậm | 🔴 T1 | Trả lời được câu hỏi cuối bài số 3 (xem chi tiết) | `why connection pooling`, `connection pool size too large` |
| 9 | **Pooling mode của PgBouncer: session / transaction / statement** | 🟡 T2 | Điền bảng bên dưới (dời sang D56) | `pgbouncer pool modes` |
| 10 | Config PgBouncer, công thức pool size tham khảo (bài *About Pool Sizing* trong wiki HikariCP) | 🟢 T3 | Tra khi cần | `hikaricp about pool sizing` |
| 11 | Vitess, Citus, MongoDB sharding | 🟢 T3 | Biết tên công cụ | — |

**Chi tiết cần hiểu**

- **Chọn shard key cho `orders` (mục 3):** shard theo `user_id` → mọi đơn của một user nằm cùng shard, query "đơn của tôi" chỉ chạm một shard. Nhưng query "mọi đơn hôm nay" phải hỏi mọi shard. Shard theo `created_at` → range query theo ngày dễ, nhưng mọi lệnh ghi đổ dồn vào shard mới nhất (hot partition). Không có shard key hoàn hảo, chỉ có shard key **khớp với query quan trọng nhất**.
- **Cái giá (mục 6):**
  - JOIN giữa hai bảng nằm ở hai shard khác nhau phải làm ở tầng ứng dụng.
  - Transaction xuyên shard cần 2PC hoặc Saga (Tuần 12).
  - Auto-increment không còn duy nhất toàn cục → cần ID generator (Snowflake, Tuần 10).
  - Thêm shard phải di chuyển dữ liệu.
- **Vì sao cần connection pool (mục 8):**
  - Mở một connection tốn kém: TCP handshake, có thể thêm TLS, xác thực, và **Postgres tạo hẳn một process** cho mỗi connection (tốn vài MB RAM).
  - Pool giữ sẵn một số connection đã mở và cho mượn lại, tránh chi phí mở mới cho mỗi request.
- **Pool quá lớn thì bị gì:**
  - DB chỉ có vài core CPU và vài ổ đĩa. Hàng trăm connection chạy cùng lúc → context switch, tranh chấp lock, tranh chấp bộ nhớ đệm. Throughput **giảm** và latency **tăng**.
  - Vượt `max_connections` của DB → request mới bị từ chối.
  - Nhớ nhân lên theo số instance: `pool_size × số instance ≤ max_connections` (liên quan trực tiếp tới lab Tuần 9 khi chạy 2 instance).
- **Pooling mode:** transaction mode tái sử dụng connection tốt nhất, nhưng làm hỏng các tính năng gắn với session (`SET` biến session, advisory lock, `LISTEN`, prepared statement ở một số phiên bản/driver).

**🟡 Bảng so sánh T2: Sharding strategies**

Nhóm: *Sharding/Scaling strategy*. Trục chính: **phân bố đều** vs **giữ được thứ tự để query theo khoảng**.

Research rồi tự điền vào `notes/tradeoff-cheatsheet.md`:

| Tiêu chí | Range-based | Hash-based | Directory-based |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Rebalancing (thêm/bớt shard) khó hay dễ? | | | |
| Ext: Nguy cơ hotspot | | | |
| Ext: Range query có dễ không? | | | |

**Thẻ Anki T2:** *"Khi nào chọn range sharding thay vì hash sharding?"*

**🟡 Bảng so sánh T2: Pooling mode** *(⏱ điền ở D56)*

Nhóm: *quản lý connection*. Trục chính: **mức tái sử dụng connection** vs **tính năng session còn dùng được**.

| Tiêu chí | Session | Transaction | Statement |
|---|---|---|---|
| Core: Use-case lý tưởng | | | |
| Core: Trade-off chính | | | |
| Core: Khi nào KHÔNG dùng | | | |
| Ext: Connection được trả về pool khi nào? | | | |
| Ext: Tính năng session-level (SET, advisory lock, LISTEN...) còn dùng được? | | | |

**🔴 Thẻ Anki (T1)**

1. Partitioning khác sharding ở đâu?
2. Tiêu chí chọn shard key tốt là gì? Chọn shard key cho bảng `orders`.
3. Hot partition là gì? Cho 2 ví dụ.
4. Kể 4 cái giá phải trả khi sharding.
5. Vì sao mở connection DB tốn kém? Vì sao pool quá lớn lại làm DB chậm hơn?
6. *(DSA-Pattern)* Word Search khác Number of Islands ở cách xử lý visited thế nào?

**🟢 Tra cứu (T3):** PgBouncer docs (pgbouncer.org): *pool_mode*, *default_pool_size*; config pool của ORM/driver bạn dùng; wiki HikariCP bài *About Pool Sizing*.

**Tài liệu:**
- ByteByteGo: tìm `bytebytego database sharding`
- DDIA ch.6 *Partitioning*: đọc lướt *Partitioning of Key-Value Data* (range vs hash, hot spot) và *Rebalancing Partitions*
- Hussein Nasser: tìm video `connection pooling`

**❓ Câu hỏi cuối bài**

1. So sánh 3 chiến lược sharding.
2. Hot partition là gì?
3. Vì sao cần connection pool? Đặt pool quá lớn thì bị gì?

*Câu bổ sung (kiểm tra ý chưa được hỏi):*

4. Bảng `orders` 2 tỷ dòng, bắt buộc phải shard. Bạn chọn shard key nào? Với lựa chọn đó, query "đơn của tôi" và "doanh thu hôm nay toàn hệ thống" chạy thế nào?
5. Trước khi quyết định shard, bạn sẽ thử những gì? Sau khi shard, những việc nào trước đây "miễn phí" giờ trở nên khó (kể ít nhất 3)?

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Range: giữ thứ tự, range query dễ; dễ hotspot (shard mới nhất nhận hết ghi).
- Hash: phân bố đều; mất range query, `mod N` khiến resharding phải di chuyển gần hết dữ liệu.
- Directory: bảng tra cứu key → shard, linh hoạt khi di chuyển; thêm một thành phần phải luôn sẵn sàng (SPOF, thêm một bước tra).

**2.**
- Một shard nhận phần lớn tải trong khi các shard khác rảnh.
- Ví dụ: shard theo ngày tạo (mọi lệnh ghi vào shard mới nhất), một celebrity user / một sản phẩm flash sale.

**3.**
- Mở connection tốn: TCP (+TLS) handshake, xác thực, Postgres tạo một process mỗi connection.
- Pool quá lớn: DB có ít core → context switch, tranh chấp lock/bộ nhớ, throughput giảm, latency tăng; vượt `max_connections`.
- Nhớ nhân theo số instance: `pool_size × số instance ≤ max_connections`.

**4.**
- `user_id`: nhiều giá trị, phân bố khá đều, khớp query chính "đơn của tôi" → chạm một shard.
- "Doanh thu hôm nay" phải scatter-gather mọi shard → thường tính trước bằng pipeline/bảng tổng hợp riêng.
- Tránh `created_at` làm shard key: mọi lệnh ghi dồn vào một shard.

**5.**
- Thử trước: index/query, cache, read replica, scale dọc, partition bảng trong một DB, lưu trữ dữ liệu cũ (archive).
- Khó sau khi shard: JOIN xuyên shard, transaction xuyên shard (2PC/Saga), ID duy nhất toàn cục, resharding, unique constraint toàn cục.

</details>

---

## D55 (T7, 21/11): Lab

**⏱ Ước tính:** DSA 30' · Lab bắt buộc 3h00' · Ôn ⚠️ 30' · **Tổng 4h00'**

> ⏱ Lab *bắt buộc* = Bước 1–5 (3h00'). *Mở rộng (làm nếu còn giờ)*: thử stampede ở Bước 4 (+30'). **Bước 6 (bảng SQL vs NoSQL, 45')** dời sang đầu buổi D56 nếu Thứ Bảy hết giờ. "Làm lại 1 bài sai" dời sang phần Error List của D56.

### 🧩 DSA: [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

- **Pattern (🔴 T1):** *Backtracking tích Descartes*. Tầng thứ i của cây là chữ số thứ i, mỗi nhánh là một chữ cái của chữ số đó.
- **Không cần `start` hay `used`:** mỗi tầng chọn từ một tập riêng, không có chuyện dùng lại phần tử.
- **Độ phức tạp:** O(4ⁿ · n) (chữ số 7 và 9 có 4 chữ cái), n ≤ 4.
- **Lỗi hay gặp:** input rỗng `""` phải trả `[]`, không phải `[""]`.
- Sau đó làm lại 1 bài sai trong tuần (nếu có, *nếu còn giờ*; nếu không thì làm ở D56).

### 🛠 Lab (3–4h): Redis cache-aside cho *Mini Order Service* + bảng SQL vs NoSQL

**Bước 1: Thêm Redis vào hạ tầng (20')**

- Thêm service Redis vào `docker-compose.yml` của dự án. Giới hạn RAM và chọn eviction policy để luyện đúng bài D50:

```yaml
# 🟢 T3 snippet – lưu vào notes/snippets.md, không cần thuộc
services:
  redis:
    image: redis:7-alpine
    command: ["redis-server", "--maxmemory", "100mb", "--maxmemory-policy", "allkeys-lru"]
    ports: ["6379:6379"]
```

- Kiểm tra: `docker compose exec redis redis-cli ping` trả `PONG`.

**Bước 2: Đo baseline (30')**

- Chọn công cụ bắn tải: `hey`, `wrk`, `k6` hoặc `autocannon` (tuỳ bạn quen).
- Bắn vào `GET /products/:id` **khi chưa có cache**, ví dụ 30 giây, 50 kết nối đồng thời, xoay vòng trong ~1.000 ID khác nhau.
- Ghi lại: **p50, p95, p99 latency**, requests/giây, số query DB (bật log query hoặc đếm bằng `pg_stat_statements`).
- ⚠️ Lưu ý trung thực: nếu `GET /products/:id` chỉ là tra theo primary key thì DB đã rất nhanh (dưới 1–2 ms) và cache gần như không cải thiện gì. Để thấy rõ khác biệt, cho endpoint trả thêm dữ liệu tốn kém hơn (ví dụ tồn kho tổng hợp, số lượt bán, điểm đánh giá trung bình tính bằng JOIN/aggregate). **Ghi nhận xét này vào kết quả lab.** Đây là một ý rất tốt để kể khi phỏng vấn ("cache không phải lúc nào cũng có lợi").

**Bước 3: Cài cache-aside (1h)**

- Cài theo **Decorator** (Tuần 3): `CachedProductRepository` bọc `ProductRepository`, cùng interface. Service không biết có cache.
- Quy ước:
  - Key: `product:{id}:v1`.
  - Value: JSON của product.
  - TTL: 300 giây **+ jitter** ngẫu nhiên 0–30 giây (chống avalanche, D52).
  - Không tồn tại: cache giá trị rỗng với TTL 30 giây (chống penetration, D52).
  - Redis lỗi hoặc timeout → **bỏ qua cache, đọc thẳng DB** và ghi log. Cache chết không được làm API chết.
- Thêm header `X-Cache: HIT` / `MISS` vào response để dễ kiểm tra bằng tay.

**Bước 4: Invalidation (40')**

- Ở `PUT/PATCH /products/:id` và `DELETE /products/:id`: cập nhật DB → **sau khi commit** → `DEL product:{id}:v1`.
- Viết test (integration hoặc thủ công bằng curl):
  1. `GET` hai lần → lần 2 là `HIT`.
  2. `PATCH` đổi giá.
  3. `GET` → `MISS` và thấy **giá mới**.
- *(Tuỳ chọn, +30')* Thử stampede: xoá key, bắn 200 request đồng thời vào cùng một ID, đếm số query DB. Sau đó thêm mutex bằng `SET lock:product:{id} ... NX PX 3000` và đếm lại.

**Bước 5: Đo lại và ghi kết quả (30')**

- Chạy lại đúng kịch bản ở Bước 2. Lấy hit ratio từ `redis-cli INFO stats` (`keyspace_hits / (keyspace_hits + keyspace_misses)`).
- Viết `notes/cache-lab.md`:

  | Kịch bản | p50 | p95 | p99 | req/s | Số query DB | Hit ratio |
  |---|---|---|---|---|---|---|
  | Không cache | | | | | | — |
  | Cache-aside | | | | | | |
  | *(tuỳ chọn)* Stampede không lock / có lock | | | | | | |

- Thêm một đoạn ngắn: TTL chọn bao nhiêu và vì sao; dữ liệu nào **không** cache (tồn kho lúc đặt hàng vẫn đọc DB trong transaction, Tuần 7).

**Bước 6: Bảng SQL vs NoSQL (45') — làm ở D56 nếu Thứ Bảy hết giờ**

- Research và điền vào `notes/tradeoff-cheatsheet.md` bảng dưới đây.

**🟡 Bảng so sánh T2: SQL vs NoSQL**

Nhóm: *Data storage/model*. Trục chính: **tính nhất quán và khả năng query** vs **linh hoạt schema và khả năng scale ngang**.

| Tiêu chí | Relational (PostgreSQL, MySQL) | Document (MongoDB) | Key-Value (Redis, DynamoDB) | Wide-column (Cassandra) | Graph (Neo4j) |
|---|---|---|---|---|---|
| Core: Use-case lý tưởng | | | | | |
| Core: Trade-off chính | | | | | |
| Core: Khi nào KHÔNG dùng | | | | | |
| Ext: Consistency model | | | | | |
| Ext: Schema flexibility | | | | | |
| Ext: Query capability (JOIN, query phức tạp) | | | | | |

- Gợi ý research: `sql vs nosql when to use`, `document vs key value vs wide column vs graph database`, ByteByteGo (tìm `bytebytego sql vs nosql`).
- **Thẻ Anki T2:** *"Khi nào chọn NoSQL thay vì SQL?"*. Câu trả lời tốt thường bắt đầu từ **kiểu truy cập dữ liệu** (access pattern), không bắt đầu từ "NoSQL nhanh hơn".

**Sản phẩm và tiêu chí nghiệm thu**

- [ ] `GET /products/:id` có cache-aside, header `X-Cache` hoạt động
- [ ] Update/delete product xoá cache **sau khi commit**; test "đổi giá xong đọc thấy giá mới" chạy đúng
- [ ] Tắt Redis (`docker compose stop redis`) → API vẫn trả dữ liệu (chậm hơn), không trả 500
- [ ] `notes/cache-lab.md` có bảng số liệu trước/sau + hit ratio + nhận xét
- [ ] Bảng SQL vs NoSQL đã điền

**Bước 7 (30'):** Ôn các câu đánh dấu ⚠️ trong tuần.

---

## D56 (CN, 22/11): Chốt tuần 8 + Chốt Giai đoạn 2

**⏱ Ước tính:** DSA (Error List) 20' · Bảng T2 dời (SQL vs NoSQL 40' + Pooling mode 10') 50' · Chốt tuần câu 1–4 30' · Tự mock 45' · Tổng kết Giai đoạn 2 15' · Anki/cheat sheet 15' · **Tổng 2h55'**

> ⏱ Làm bảng SQL vs NoSQL **trước** câu chốt 2. DSA buổi sáng rút còn 20' vì buổi tự mock đã có một bài Medium.

**DSA:** Làm lại bài trong Error List. Nếu Error List trống, tự giải lại 46 và 90 trong ≤ 20' mỗi bài, rồi viết khung backtracking ra giấy từ trí nhớ.

**✅ Câu hỏi chốt tuần — Tổng kết Giai đoạn 2.** Nói to hoặc viết ra, không nhìn tài liệu. Cần đạt ≥ 4/5.

1. Hệ thống đọc nhiều ghi ít, DB quá tải. Trình bày các bước scale **theo thứ tự**: index → cache → read replica → sharding.
   - *Gợi ý khung trả lời: trước mỗi bước phải **đo** (slow query log, EXPLAIN, metric CPU/IO) để biết nghẽn ở đâu. Với mỗi bước nói rõ: giải quyết được gì, cái giá là gì (index làm chậm ghi; cache gây dữ liệu cũ; replica gây replication lag; sharding mất JOIN/transaction xuyên shard). Có thể chen thêm connection pooling, scale dọc và partition bảng trước khi sharding.*
2. Chọn loại DB cho: giỏ hàng, log sự kiện, quan hệ bạn bè trên mạng xã hội, đơn hàng thanh toán.
   - *Dựa trên bảng SQL vs NoSQL ở Lab. Mỗi lựa chọn phải kèm lý do theo access pattern và yêu cầu nhất quán.*
3. Cache-aside và các vấn đề về tính nhất quán dữ liệu.
4. Khung code backtracking (chọn → đệ quy → bỏ chọn). Độ phức tạp của bài Subsets?
5. **Tự mock 45':** 2 câu hỏi về DB + 1 bài DSA Medium.
   - *Cách làm: bấm giờ. 15' đầu tự trả lời thành tiếng 2 câu DB chọn ngẫu nhiên từ các câu chốt tuần 5–8 (ví dụ: "vì sao Seq Scan dù có index?", "chống overselling thế nào?"). 30' sau giải một bài backtracking chưa gặp, ví dụ [40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) hoặc [22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses/). Nói to hướng giải trước khi code.*

<details><summary>Ý chính cần có trong câu trả lời</summary>

**1.**
- Đo trước mỗi bước (slow query log, EXPLAIN, CPU/IO) để biết nghẽn ở đâu.
- Index (chậm ghi) → cache (dữ liệu cũ) → read replica (replication lag) → sharding (mất JOIN/transaction xuyên shard); chen connection pooling, scale dọc, partition trước sharding.
- Đọc nhiều ghi ít → cache và replica là đòn bẩy chính; sharding chỉ khi dữ liệu/lượng ghi vượt một máy.

**2.**
- Giỏ hàng: key-value (Redis/DynamoDB), truy cập theo `user_id`, chấp nhận TTL.
- Log sự kiện: wide-column (Cassandra) hoặc kho append-only, ghi rất nhiều, query theo thời gian.
- Quan hệ bạn bè: graph DB khi cần duyệt nhiều bậc (bạn của bạn); ít bậc thì SQL vẫn ổn.
- Đơn hàng thanh toán: relational (ACID, constraint, transaction).

**3.**
- Luồng đọc/ghi; ghi DB → commit → **xoá** cache (không cập nhật, không xoá trước).
- Khe hở còn sót (request đọc chậm ghi đè giá trị cũ) → TTL làm lưới an toàn; cache in-process lệch giữa các instance.
- Dữ liệu dùng để quyết định (tồn kho lúc trừ) luôn đọc DB trong transaction.

**4.**
- Chọn → đệ quy → bỏ chọn; lưu **bản sao** của state.
- `start` cho tổ hợp/tập con, `used` cho hoán vị; sort + `i > start` để bỏ trùng.
- Subsets: 2ⁿ tập × O(n) copy = O(n · 2ⁿ), stack O(n).

**5.**
- Nói hướng giải trước khi code, nêu Big-O; câu DB trả lời theo khung "vấn đề → cơ chế → trade-off → ví dụ từ lab".
- Ghi lại chỗ ngập ngừng vào `notes/error-list.md`.

</details>

**📚 Tổng kết Giai đoạn 2 (Tuần 5–8)**

Tự kiểm tra: với mỗi dòng, bạn nói được trong 1 phút mà không vấp.

| Tuần | Chủ đề | 🔴 T1 phải nói được | 🟡 Bảng T2 phải có trong cheat sheet |
|---|---|---|---|
| 5 | SQL, chuẩn hoá, Index | INNER vs LEFT JOIN & thứ tự thực thi SQL, 1NF–3NF & constraint, B-Tree, composite index & leftmost prefix ("bằng trước, khoảng sau"), covering index, cardinality/selectivity, các lý do planner bỏ qua index | EXISTS/IN vs JOIN, chuẩn hoá vs phi chuẩn hoá, UUID vs auto-increment, B-Tree vs Hash index, một composite index vs nhiều index đơn cột, partial index vs index đầy đủ |
| 6 | EXPLAIN, tối ưu query | Đọc execution plan (cost vs actual, rows ước tính vs thực tế), Seq / Index / Index Only / Bitmap Scan, Nested Loop / Hash / Merge Join, N+1, keyset pagination, quy trình 5 bước "API chậm" | Các kiểu scan (planner chọn khi nào), Nested Loop vs Hash vs Merge Join, eager JOIN vs batch `IN (...)`, tối ưu query/index vs thêm cache, Heap vs Sort vs Quickselect (Top-K) |
| 7 | Transaction, Isolation, Locking | ACID, 6 lỗi đọc/ghi, isolation level & mức mặc định Postgres/InnoDB, MVCC, WAL, pessimistic/optimistic, deadlock, bài overselling | Chọn isolation level (RC / RR / Serializable), optimistic vs pessimistic lock, 3 cách chống overselling (kèm DFS vs BFS trên lưới, Kahn vs DFS) |
| 8 | Cache, Replication, Sharding, NoSQL | Cache-aside & invalidation, 3 sự cố cache + hot key, replication lag & failover, shard key & hot partition, connection pool | LRU vs LFU, chiến lược cache, kiểu dữ liệu Redis, sync vs async replication, sharding strategies, pooling mode, SQL vs NoSQL |

**Checklist cuối tuần**

- [ ] Đạt ≥ 4/5 câu chốt tuần
- [ ] Hoàn thành buổi tự mock 45' và ghi lại điểm yếu vào `notes/error-list.md`
- [ ] Cache-aside chạy được + `notes/cache-lab.md` có số liệu đo
- [ ] Tự giải lại 6 bài backtracking của tuần không xem lời giải
- [ ] Anki: đã nhập đủ thẻ T1 của D50–D54 + thẻ pattern Backtracking (subset / combination / permutation / grid)
- [ ] Cheat sheet: đã điền LRU vs LFU, các chiến lược cache, kiểu dữ liệu Redis, sync vs async replication, sharding strategies, pooling mode, SQL vs NoSQL
- [ ] Đạt chốt Giai đoạn 2

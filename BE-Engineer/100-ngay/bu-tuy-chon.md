# Bài bù tuỳ chọn: DSA và Lab bị cắt khi chuyển sang 6 buổi/tuần

← [Lộ trình 100 ngày](../Roadmap_100_ngay.md)

> Từ 26/10/2026 mỗi tuần học 6 buổi: Lab + Chốt tuần gộp vào Thứ Bảy, Chủ Nhật là ngày trống. Phần không vừa 4h của Thứ Bảy được chuyển thành **tuỳ chọn** ở mục "CN: Ngày trống" của từng file tuần. File này gom các phần đó lại thành một danh sách để làm khi rảnh.
>
> **Thứ tự ưu tiên khi có giờ:** (1) học bù buổi bị lỡ trong tuần → (2) DSA mới bị cắt (mục A) → (3) Lab bị cắt (mục C) → (4) DSA làm lại (mục B). Đề, gợi ý và hướng dẫn chi tiết nằm ở link "Chi tiết", file này chỉ là danh sách.
>
> Làm xong thì tick `[x]`. Bài DSA làm xong nhớ thêm 1 dòng vào [`anki/dsa-patterns.md`](../anki/dsa-patterns.md).

---

## A. DSA mới bị cắt (7 bài)

Đây là các bài **mới** của Chủ Nhật cũ, chưa xuất hiện ở buổi nào khác. Nên làm hết trước Tuần 12 (mock coding).

| | Tuần | Bài | Pattern | Mục tiêu | Chi tiết |
|---|---|---|---|---|---|
| [ ] | 2 | [424. Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) | Sliding Window thay đổi + điều kiện đếm | O(n); hiểu vì sao không cần giảm `maxFreq` | [tuần 2](tuan-02.md#cn-0111-ngày-trống) |
| [ ] | 3 | [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Binary Search, "một nửa luôn đã sort" | O(log n); đúng `<=` khi `l == mid` | [tuần 3](tuan-03.md#cn-0811-ngày-trống) |
| [ ] | 5 | [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | DFS truyền cận (low, high) | O(n); tránh bẫy chỉ so cha–con | [tuần 5](tuan-05.md#cn-2211-ngày-trống) |
| [ ] | 6 | [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/) | Greedy theo tần suất / max-heap + cooldown | Giải thích được công thức "khung" | [tuần 6](tuan-06.md#cn-2911-ngày-trống) |
| [ ] | 7 | [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Topological sort trả về thứ tự | ≤ 20' sau khi đã làm 207 | [tuần 7](tuan-07.md#cn-0612-ngày-trống) |
| [ ] | 9 | [134. Gas Station](https://leetcode.com/problems/gas-station/) | Greedy + điều kiện toàn cục | O(n), O(1); nói được vì sao greedy đúng | [tuần 9](tuan-09.md#cn-2012-ngày-trống) |
| [ ] | 10 | [139. Word Break](https://leetcode.com/problems/word-break/) | DP trên tiền tố | State / công thức / base case trước khi code | [tuần 10](tuan-10.md#cn-2712-ngày-trống) |

---

## B. DSA làm lại (không xem lời giải)

Ôn lại bài đã làm, giới hạn ≤ 20–25' mỗi bài. Nếu Error List (`notes/error-list.md`, tạo ở Lab tuần 1) có bài đến hạn (sau 3 ngày / 7 ngày) thì làm bài đó trước.

| | Tuần | Bài | Ghi chú |
|---|---|---|---|
| [ ] | 1 | 49, 347 · 217, 242, 1 | 347: so sánh Heap vs Bucket |
| [ ] | 2 | 15, 3 | |
| [ ] | 3 | 739, 875 | |
| [ ] | 4 | Error List, hoặc 143, 146 | |
| [ ] | 5 | 226, 104, 572, 235, 102 | |
| [ ] | 6 | 199, 230, 703, 1046, 973, 215 | |
| [ ] | 7 | 200, 133, 695, 994, 417, 207 | |
| [ ] | 8 | Error List, hoặc 46, 90 | Viết khung backtracking ra giấy từ trí nhớ |
| [ ] | 10 | 198, 322 (70 tuỳ chọn) | |
| [ ] | 11 | Error List, rồi 1143, 518 | 518: nói vì sao thứ tự 2 vòng lặp quan trọng |
| [ ] | 12 | 322 | Phản ví dụ greedy `[1, 3, 4]`, `amount = 6` |
| [ ] | 13 | Error List (ưu tiên bài sai ở mock D90) | Bấm giờ ≤ 25' |

---

## C. Lab bị cắt

Đây là các **khúc ở giữa** Lab của từng tuần (phần mở rộng hoặc bước cuối), **không phải** phần nối tiếp sau Tuần 14. Phần Lab bắt buộc vẫn nằm ở Thứ Bảy. Hầu hết các khúc này độc lập: bỏ qua không làm hỏng Lab các tuần sau. Có **2 ngoại lệ** (đánh dấu 🔗), làm chậm nhất trước tuần ghi trong cột "Hạn".

| | Tuần | Việc | Thời gian | Hạn | Chi tiết |
|---|---|---|---|---|---|
| [ ] | 2 | `notes/notification-design.md`: thêm phần "mỗi pattern dùng ở đâu, giải quyết vấn đề gì" | 15' |  | [tuần 2](tuan-02.md#cn-0111-ngày-trống) |
| [ ] | 4 | 🔗 **Bước 7:** `README.md` + `notes/api-design.md` (nguyên liệu kể khi phỏng vấn) | 25' | Trước tuần 10: Lab tuần 10, 11, 13 viết tiếp các mục vào README này | [tuần 4](tuan-04.md#cn-1511-ngày-trống) |
| [ ] | 4 | 🔗 **`PATCH` / `DELETE /products/{id}`** (phần đầu của Lab mở rộng) | 20' | Trước tuần 8: Lab cache cần endpoint này để xoá cache khi ghi | [tuần 4](tuan-04.md#cn-1511-ngày-trống) |
| [ ] | 4 | Lab mở rộng còn lại: refresh token + logout, phần còn lại của Bước 6 | 40' |  | [tuần 4](tuan-04.md#cn-1511-ngày-trống) |
| [ ] | 5 | Bước 7: đo chi phí ghi khi thêm index, ghi vào `notes/index-lab.md` | 15' |  | [tuần 5](tuan-05.md#cn-2211-ngày-trống) |
| [ ] | 6 | Bước 4f: chỉ SELECT cột cần | 15' |  | [tuần 6](tuan-06.md#cn-2911-ngày-trống) |
| [ ] | 7 | Bước 4 (quan sát khoá bằng 2 cửa sổ `psql`), làm cả hai cách ở Bước 5, thử deadlock ở Bước 7 | ~50' |  | [tuần 7](tuan-07.md#cn-0612-ngày-trống) |
| [ ] | 8 | Thử **cache stampede**: 200 request đồng thời, đếm query DB, thêm mutex `SET ... NX PX` rồi đo lại | 30' |  | [tuần 8](tuan-08.md#cn-1312-ngày-trống) |
| [ ] | 8 | Bước 6: bảng T2 SQL vs NoSQL (5 loại DB) | 40' |  | [tuần 8](tuan-08.md#bảng-t2-sql-vs-nosql-tuỳ-chọn-40) |
| [ ] | 9 | Bước 4 `least_conn` + bảng thuật toán load balancing; Bước 5 so sánh throughput 1 vs 2 instance | ~35' |  | [tuần 9](tuan-09.md#cn-2012-ngày-trống) |
| [ ] | 10 | Rate limiter: luật riêng cho API đọc, biến thể `redis.call('TIME')`, header số lượt còn lại | 30' |  | [tuần 10](tuan-10.md#cn-2712-ngày-trống) |
| [ ] | 11 | Bước 5b: test retry `transient` + chạy 2 instance consumer | 20' |  | [tuần 11](tuan-11.md#cn-0301-ngày-trống) |
| [ ] | 13 | README mục "Số liệu" và "Nếu có thêm thời gian" | ~10' |  | [tuần 13](tuan-13.md#cn-1701-ngày-trống) |

> Các phần tuỳ chọn khác (bảng T2 dời, bản nháp STAR, ôn ⚠️) vẫn nằm trong mục "CN: Ngày trống" của từng tuần, không gom vào đây.

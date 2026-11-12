// Yoga / mobility routine for posture (rounded upper back, forward head).
// Separate from the strength plan: not counted in weekly volume, never touches exercises.js.
// Human-readable version: yoga-mobility.md (keep both in sync).
window.YOGA_DATA = {
  id: "mobility",
  en: "Mobility",
  vi: "Yoga · tư thế",
  intro: "Bổ sung riêng, không thay đổi lịch tập kháng lực. Tập buổi sáng hoặc ngày nghỉ sau tập tạ. Số bài cố định — mệt thì giữ ngắn, rảnh thì giữ lâu.",
  // star: 2 = không bỏ, 1 = thuộc bộ tối thiểu, 0 = bài thường
  modes: [
    { id: "must", en: "2 poses", vi: "1–2 phút · chỉ 2 bài không bỏ", min: 2 },
    { id: "min",  en: "4 poses", vi: "~4 phút · ngày cực mệt/bận",    min: 1 },
    { id: "full", en: "8 poses", vi: "Ngày bình thường",              min: 0 }
  ],
  lengths: [
    { id: "short", en: "Short", vi: "Ngắn ~7'" },
    { id: "long",  en: "Long",  vi: "Dài ~25'" }
  ],
  poses: [
    { n: 1, star: 1, en: "Cat-Cow", vi: "Mèo – bò", place: "Sàn",
      goal: "Đánh thức cột sống, lưng trên",
      short: "6 nhịp thở", long: "12–15 nhịp, dừng 3s mỗi đầu", easier: "Ngồi ghế, tay trên gối" },
    { n: 2, star: 0, en: "Thread the Needle", vi: "Xỏ kim", place: "Sàn",
      goal: "Xoay lưng trên, giữa bả vai",
      short: "3 lần/bên + giữ 3 nhịp", long: "6 lần/bên + giữ 45–60s", easier: "Tay sau gáy, chỉ mở khuỷu" },
    { n: 3, star: 1, en: "Puppy Pose", vi: "Tư thế cún con", place: "Sàn",
      goal: "Duỗi lưng trên, giãn xô",
      short: "30s", long: "2 × 60–90s, bò tay sang hai bên", easier: "Tay tì sofa/ghế" },
    { n: 4, star: 0, en: "Low Lunge", vi: "Chùng chân thấp", place: "Sàn",
      goal: "Giãn cơ gập hông (do ngồi nhiều)",
      short: "30s/bên", long: "2 × 60s/bên, vòng 2 giơ tay", easier: "Khăn lót gối, tay vịn ghế" },
    { n: 5, star: 2, en: "Supported Fish + Chin Tuck", vi: "Nằm khăn cuộn dưới lưng + thu cằm", place: "Sàn",
      goal: "Mở lưng gù + ngực; chống đầu đưa trước",
      short: "60s + 5 lần thu cằm × 3s", long: "3–5', dời khăn lên 1 nấc; 10 × 5s", easier: "Khăn mỏng hơn, gối kê đầu",
      why: "Mở phần lưng gù và kéo đầu về đúng vị trí — nhắm thẳng cả gù lưng lẫn rụt cổ." },
    { n: 6, star: 2, en: "Wall Angels + Chin Tuck", vi: "Thiên thần dựa tường + thu cằm", place: "Đứng",
      goal: "Kích hoạt cơ thang dưới: vai xuống & ra sau",
      short: "6 lần chậm", long: "2–3 × 10, giữ 2s ở đỉnh", easier: "Đứng xa tường, biên độ nhỏ",
      why: "Bài làm khoẻ cơ giữ tư thế. Giãn cơ chỉ mở biên độ vài giờ — phần này mới giữ tư thế mới ở lại." },
    { n: 7, star: 0, en: "Wall Pec Stretch", vi: "Giãn ngực dựa tường", place: "Đứng",
      goal: "Giãn ngực",
      short: "20–30s/bên", long: "45–60s/bên, 2 độ cao tay", easier: "Xoay người ít hơn" },
    { n: 8, star: 0, en: "Seated Upper Trap Stretch", vi: "Giãn cầu vai khi ngồi", place: "Ngồi",
      goal: "Hạ vai nhô, dài cổ",
      short: "20s/bên", long: "2 × 45s/bên + cúi mũi về nách", easier: "Không kéo tay, chỉ nghiêng đầu" }
  ],
  extras: [
    "Ngày vừa (~12–15'): giữ mức Dài cho #3, #4, #5; còn lại mức Ngắn.",
    "Ngày rảnh: toàn bộ mức Dài; dư thời gian lặp thêm #6, có thể thêm Prone Y-T Raise hoặc Dead Hang trên xà."
  ],
  rules: [
    "Đếm nhịp thở thay đồng hồ: hít 4s – thở ra 6s ≈ 10s/nhịp. Thở ra dài → cơ thả lỏng hơn.",
    "Căng ở mức 4–6/10, không cố.",
    "Sáng: động hơn, giữ ≤ 30s, làm đủ #6.",
    "Ngày nghỉ sau tập tạ: mức Dài. Sau Upper giữ lâu Puppy + Pec, Wall Angels nhẹ. Sau Lower giữ lâu Low Lunge.",
    "Ngay trước buổi Upper: không giữ tĩnh lâu — chỉ #1, #2, #6 làm khởi động."
  ],
  desk: [
    "Mỗi 45–60 phút đứng dậy 1 phút: 5 lần thu cằm + giãn cầu vai 20s/bên (hoặc 5 Wall Angels).",
    "Mép trên màn hình ngang tầm mắt, bàn phím gần, khuỷu sát người.",
    "Kiểm tra 2 tuần/lần: lưng tựa tường, gáy chạm tường mà không ngửa cằm? + chụp ảnh nghiêng.",
    "Kỳ vọng: dễ chịu hơn sau 2–4 tuần, thấy thay đổi rõ sau 8–12 tuần."
  ],
  safety: [
    "Tê / ngứa ran / đau lan xuống tay → dừng ngay (dây thần kinh, không phải cơ).",
    "Thu cằm = trượt đầu thẳng ra sau (\"cằm đôi\"), không gập cằm xuống.",
    "Nằm khăn mà gáy bị kẹt → kê gối dưới đầu. Thắt lưng bị chèn → khăn mỏng hơn, co gối.",
    "Đau gối khi Low Lunge → lót dày hơn hoặc làm đứng, tay vịn ghế."
  ]
};

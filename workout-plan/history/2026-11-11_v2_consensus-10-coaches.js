/* =====================================================================
   WORKOUT DATA — sửa file này để đổi bài tập; không cần đụng vào HTML.
   ---------------------------------------------------------------------
   muscles   : id -> { en, vi }
   exercises : id -> { en, vi, primary:[muscle], secondary:[muscle], level:1–5,
                       hold?: "20–40s"   (bài giữ tĩnh: thay cho số rep của slot)
                       cue?:  "..."      (gợi ý riêng, thay cho cue của slot) }
   pools     : id -> [exercise ids]  — xếp từ HIỆU QUẢ NHẤT → kém nhất cho tăng cơ.
               Một pool = các bài thay thế lẫn nhau cho cùng nhóm cơ chính.
   sessions  : items = các "slot": { pool, pick (bài mặc định), role, sets, reps, cue, ss }
               ss = mã superset: "A1","A2" cùng chữ A = tập xen kẽ; chữ đứng một mình = tập riêng.
   Thêm bài thay thế: thêm vào `exercises`, rồi thêm id vào đúng `pools` theo thứ hạng.
   ===================================================================== */
window.WORKOUT_DATA = {
  meta: {
    title: "Home Recomp Plan",
    subtitleVi: "Kế hoạch tập tại nhà · tạ đơn + xà đơn",
    rotation: ["upperA", "lowerA", "upperB", "lowerB"],
    fallback: "fullBody",
    facts: ["30–45 min incl. 5' warm-up", "0–2 RIR", "Tempo + isometric progression"],
    notes: [
      "Progression: top of rep range at 0–2 RIR → slower eccentric (3s → 5s) → longer pause at the hardest point (1s → 3s) → 1½ reps → swap to a higher-ranked / harder alternative.",
      "Tiến bộ: chạm đỉnh khoảng rep với 0–2 RIR → hạ chậm hơn (3s → 5s) → dừng lâu hơn ở điểm khó (1s → 3s) → 1½ rep → đổi sang bài thay thế khó hơn.",
      "Supersets: A1 then A2, rest 60–90s, repeat. One-side exercises: sets are per side. · Superset: tập A1 rồi A2, nghỉ 60–90s. Bài một bên: số hiệp tính cho mỗi bên."
    ]
  },

  muscles: {
    chest:      { en: "Chest",           vi: "Ngực" },
    frontDelts: { en: "Front delts",     vi: "Vai trước" },
    sideDelts:  { en: "Side delts",      vi: "Vai giữa" },
    rearDelts:  { en: "Rear delts",      vi: "Vai sau" },
    traps:      { en: "Upper traps",     vi: "Cầu vai" },
    lats:       { en: "Lats",            vi: "Xô (lưng rộng)" },
    midBack:    { en: "Mid back",        vi: "Lưng giữa" },
    biceps:     { en: "Biceps",          vi: "Tay trước" },
    triceps:    { en: "Triceps",         vi: "Tay sau" },
    forearms:   { en: "Forearms / Grip", vi: "Cẳng tay / Lực nắm" },
    abs:        { en: "Abs",             vi: "Cơ bụng" },
    obliques:   { en: "Obliques",        vi: "Cơ liên sườn" },
    lowerBack:  { en: "Lower back",      vi: "Lưng dưới" },
    glutes:     { en: "Glutes",          vi: "Mông" },
    quads:      { en: "Quads",           vi: "Đùi trước" },
    hamstrings: { en: "Hamstrings",      vi: "Đùi sau" },
    calves:     { en: "Calves",          vi: "Bắp chân" }
  },

  exercises: {
    /* ---- Vertical pull ---- */
    pullUp:             { en: "Pull-Up", vi: "Hít xà đơn (tay sấp)", primary: ["lats", "biceps"], secondary: ["midBack", "rearDelts", "forearms", "abs"], level: 3 },
    weightedPullUp:     { en: "Weighted Pull-Up (dumbbell between feet)", vi: "Hít xà kẹp tạ ở chân", primary: ["lats", "biceps"], secondary: ["midBack", "rearDelts", "forearms", "abs"], level: 5 },
    archerPullUp:       { en: "Archer Pull-Up", vi: "Hít xà cung thủ", primary: ["lats", "biceps"], secondary: ["midBack", "rearDelts", "forearms", "abs"], level: 4 },
    footAssistedPullUp: { en: "Foot-Assisted Pull-Up (feet on chair)", vi: "Hít xà chân tì ghế trợ lực", primary: ["lats", "biceps"], secondary: ["midBack", "forearms"], level: 2 },
    negativePullUp:     { en: "Negative Pull-Up (5s lowering)", vi: "Hít xà chỉ pha hạ (5s)", primary: ["lats", "biceps"], secondary: ["midBack", "forearms"], level: 2 },
    chinUp:             { en: "Chin-Up", vi: "Hít xà tay ngửa", primary: ["lats", "biceps"], secondary: ["midBack", "forearms", "abs"], level: 3 },
    weightedChinUp:     { en: "Weighted Chin-Up", vi: "Hít xà tay ngửa kẹp tạ", primary: ["lats", "biceps"], secondary: ["midBack", "forearms", "abs"], level: 5 },
    closeGripChinUp15:  { en: "Close-Grip Chin-Up, 1½ Reps", vi: "Hít xà tay ngửa hẹp, 1½ rep", primary: ["biceps", "lats"], secondary: ["midBack", "forearms"], level: 4 },
    footAssistedChinUp: { en: "Foot-Assisted Chin-Up", vi: "Hít xà tay ngửa chân tì ghế", primary: ["lats", "biceps"], secondary: ["midBack", "forearms"], level: 2 },
    negativeChinUp:     { en: "Negative Chin-Up (5s lowering)", vi: "Hít xà tay ngửa chỉ pha hạ", primary: ["lats", "biceps"], secondary: ["midBack", "forearms"], level: 2 },

    /* ---- Horizontal pull / rear delts ---- */
    oaRow:              { en: "One-Arm Dumbbell Row (chair-supported)", vi: "Kéo tạ đơn một tay (tì ghế)", primary: ["lats", "midBack"], secondary: ["rearDelts", "biceps", "forearms"], level: 2 },
    oaRow15:            { en: "One-Arm Dumbbell Row, 1½ Reps", vi: "Kéo tạ một tay, 1½ rep", primary: ["lats", "midBack"], secondary: ["rearDelts", "biceps", "forearms"], level: 3 },
    chestSupportedRow:  { en: "Chest-Supported Dumbbell Row (on sofa arm)", vi: "Kéo tạ ngực tì tay sofa", primary: ["lats", "midBack"], secondary: ["rearDelts", "biceps"], level: 2 },
    twoPointRow:        { en: "Two-Point Dumbbell Row (no hand support)", vi: "Kéo tạ không tì tay", primary: ["lats", "midBack"], secondary: ["rearDelts", "biceps", "lowerBack", "obliques"], level: 3 },
    towelDoorRow:       { en: "Towel Door Row", vi: "Kéo khăn quấn tay nắm cửa", primary: ["midBack", "lats"], secondary: ["biceps", "forearms"], level: 1 },
    wideRow:            { en: "One-Arm Wide-Elbow Dumbbell Row", vi: "Kéo tạ một tay khuỷu mở rộng", primary: ["midBack", "rearDelts"], secondary: ["lats", "biceps", "forearms"], level: 2 },
    wideRow15:          { en: "Wide-Elbow Row, 1½ Reps", vi: "Kéo tạ khuỷu rộng, 1½ rep", primary: ["midBack", "rearDelts"], secondary: ["lats", "biceps", "forearms"], level: 3 },
    chestSupportedWideRow: { en: "Chest-Supported Wide Row (on sofa arm)", vi: "Kéo tạ khuỷu rộng ngực tì sofa", primary: ["midBack", "rearDelts"], secondary: ["lats", "biceps"], level: 2 },
    proneYT:            { en: "Prone Y-T Raise (floor)", vi: "Nằm sấp nâng tay chữ Y-T", primary: ["midBack", "rearDelts"], secondary: ["traps"], level: 1 },
    scapPullUp:         { en: "Scapular Pull-Up", vi: "Treo xà kéo bả vai", primary: ["midBack"], secondary: ["lats", "forearms"], level: 2 },
    rearFly:            { en: "Bent-Over Dumbbell Rear Delt Fly (one arm)", vi: "Dang tạ vai sau cúi người (một tay)", primary: ["rearDelts"], secondary: ["midBack", "traps"], level: 2 },
    chestSupportedRearFly: { en: "Chest-Supported Rear Delt Fly (on sofa arm)", vi: "Dang vai sau ngực tì sofa", primary: ["rearDelts"], secondary: ["midBack"], level: 2 },
    rearFly15:          { en: "Rear Delt Fly, 1½ Reps", vi: "Dang vai sau, 1½ rep", primary: ["rearDelts"], secondary: ["midBack", "traps"], level: 3 },
    rearDeltRow:        { en: "Dumbbell Rear Delt Row (elbow 90°)", vi: "Kéo tạ vai sau khuỷu 90°", primary: ["rearDelts", "midBack"], secondary: ["biceps"], level: 2 },
    proneT:             { en: "Prone T Raise (bodyweight)", vi: "Nằm sấp nâng tay chữ T", primary: ["rearDelts", "midBack"], secondary: [], level: 1 },

    /* ---- Arms / traps ---- */
    hammerCurl:         { en: "Dumbbell Hammer Curl", vi: "Cuốn tạ búa", primary: ["biceps", "forearms"], secondary: [], level: 2 },
    supCurl:            { en: "Supinated Dumbbell Curl (4s lowering)", vi: "Cuốn tạ tay ngửa (hạ 4s)", primary: ["biceps"], secondary: ["forearms"], level: 2 },
    hammerCurl15:       { en: "Hammer Curl, 1½ Reps", vi: "Cuốn tạ búa, 1½ rep", primary: ["biceps", "forearms"], secondary: [], level: 3 },
    closeGripChinSlow:  { en: "Close-Grip Chin-Up (slow)", vi: "Hít xà tay ngửa hẹp (chậm)", primary: ["biceps", "lats"], secondary: ["forearms", "midBack"], level: 4 },
    towelIsoCurl:       { en: "Towel Isometric Curl", vi: "Cuốn khăn giữ tĩnh", primary: ["biceps"], secondary: ["forearms"], level: 1, hold: "20–30s/side", cue: "max effort, elbow at 90°" },
    chairDip:           { en: "Chair Dip", vi: "Nhún tay sau trên ghế (dip ghế)", primary: ["triceps"], secondary: ["chest", "frontDelts"], level: 2 },
    diamondPushUp:      { en: "Diamond Push-Up", vi: "Chống đẩy kim cương", primary: ["triceps", "chest"], secondary: ["frontDelts", "abs"], level: 3 },
    dbOHTriExt:         { en: "Dumbbell Overhead Triceps Extension", vi: "Duỗi tay sau qua đầu với tạ", primary: ["triceps"], secondary: [], level: 2 },
    feChairDip:         { en: "Feet-Elevated Chair Dip", vi: "Dip ghế kê chân cao", primary: ["triceps"], secondary: ["chest", "frontDelts"], level: 3 },
    bentKneeDip:        { en: "Bent-Knee Chair Dip", vi: "Dip ghế co gối", primary: ["triceps"], secondary: ["frontDelts"], level: 1 },
    dbShrug:            { en: "One-Arm Dumbbell Shrug", vi: "Nhún vai tạ đơn (một tay)", primary: ["traps"], secondary: ["forearms"], level: 2 },
    shrugHold:          { en: "Dumbbell Shrug, 3s Top Hold", vi: "Nhún vai giữ đỉnh 3s", primary: ["traps"], secondary: ["forearms"], level: 3 },
    highPull:           { en: "One-Arm Dumbbell High Pull", vi: "Kéo tạ cao một tay", primary: ["traps", "sideDelts"], secondary: ["rearDelts", "forearms"], level: 3 },
    suitcaseHold:       { en: "Heavy Suitcase Hold", vi: "Xách tạ một bên giữ tĩnh", primary: ["forearms", "traps"], secondary: ["obliques"], level: 1, hold: "30–45s/side", cue: "stand tall, no lean" },
    /* forearms — direct work (cẳng tay) */
    wristCurl:          { en: "One-Arm Dumbbell Wrist Curl (forearm on thigh)", vi: "Cuốn cổ tay với tạ đơn (tì đùi)", primary: ["forearms"], secondary: [], level: 2 },
    fingerRollWristCurl:{ en: "Finger-Roll Wrist Curl", vi: "Cuốn cổ tay lăn ngón", primary: ["forearms"], secondary: [], level: 3 },
    behindBackWristCurl:{ en: "Behind-the-Back Wrist Curl", vi: "Cuốn cổ tay sau lưng", primary: ["forearms"], secondary: [], level: 2 },
    towelHang:          { en: "Towel Dead Hang", vi: "Treo xà nắm khăn", primary: ["forearms"], secondary: ["lats"], level: 4, hold: "20–40s", cue: "crush the towel, shoulders active" },
    deadHang:           { en: "Dead Hang", vi: "Treo xà tĩnh", primary: ["forearms"], secondary: ["lats"], level: 1, hold: "30–60s", cue: "full grip, relaxed shoulders" },
    reverseCurl:        { en: "Dumbbell Reverse Curl (overhand grip)", vi: "Cuốn tạ tay úp", primary: ["forearms"], secondary: ["biceps"], level: 3 },
    reverseWristCurl:   { en: "One-Arm Reverse Wrist Curl", vi: "Cuốn cổ tay ngược (tay úp)", primary: ["forearms"], secondary: [], level: 2 },
    leverRadial:        { en: "Dumbbell Lever Radial Deviation (hold one end)", vi: "Nâng cổ tay nghiêng (cầm một đầu tạ)", primary: ["forearms"], secondary: [], level: 2 },
    pikeShrug:          { en: "Elevated Pike Shrug", vi: "Nhún vai tư thế pike", primary: ["traps"], secondary: ["frontDelts"], level: 1 },

    /* ---- Push ---- */
    fePushUp:           { en: "Feet-Elevated Push-Up", vi: "Chống đẩy kê chân cao", primary: ["chest", "frontDelts"], secondary: ["triceps", "abs"], level: 3 },
    deficitPushUp:      { en: "Deficit Push-Up (hands on books/chairs)", vi: "Chống đẩy biên độ sâu (tay kê sách/ghế)", primary: ["chest"], secondary: ["frontDelts", "triceps", "abs"], level: 3 },
    archerPushUp:       { en: "Archer Push-Up", vi: "Chống đẩy cung thủ", primary: ["chest"], secondary: ["triceps", "frontDelts", "abs"], level: 4 },
    pushUp:             { en: "Standard Push-Up", vi: "Chống đẩy thường", primary: ["chest"], secondary: ["frontDelts", "triceps", "abs"], level: 2 },
    inclinePushUp:      { en: "Incline Push-Up (hands on chair)", vi: "Chống đẩy tay kê ghế", primary: ["chest"], secondary: ["frontDelts", "triceps"], level: 1 },
    pushUp15:           { en: "Push-Up, 1½ Reps", vi: "Chống đẩy 1½ rep", primary: ["chest"], secondary: ["frontDelts", "triceps", "abs"], level: 3 },
    oneArmPushUpNeg:    { en: "One-Arm Push-Up Negative", vi: "Chống đẩy một tay pha hạ", primary: ["chest", "triceps"], secondary: ["frontDelts", "obliques", "abs"], level: 5 },
    pseudoPlanche:      { en: "Pseudo-Planche Push-Up", vi: "Chống đẩy giả planche", primary: ["frontDelts", "chest"], secondary: ["triceps", "abs", "biceps"], level: 4 },
    pikePushUp:         { en: "Pike Push-Up", vi: "Chống đẩy pike (chổng mông)", primary: ["frontDelts", "triceps"], secondary: ["sideDelts", "traps", "chest"], level: 3 },
    fePikePushUp:       { en: "Feet-Elevated Pike Push-Up", vi: "Chống đẩy pike kê chân ghế", primary: ["frontDelts", "triceps"], secondary: ["sideDelts", "traps", "chest"], level: 4 },
    wallHspuNeg:        { en: "Wall Handstand Push-Up Negative", vi: "Trồng chuối dựa tường, pha hạ", primary: ["frontDelts", "triceps"], secondary: ["sideDelts", "traps"], level: 5 },
    kneelingPike:       { en: "Kneeling Pike Push-Up", vi: "Chống đẩy pike quỳ gối", primary: ["frontDelts", "triceps"], secondary: ["sideDelts"], level: 2 },
    dbOHP:              { en: "One-Arm Standing Dumbbell Overhead Press", vi: "Đẩy tạ đơn qua đầu một tay (đứng)", primary: ["frontDelts", "triceps"], secondary: ["sideDelts", "traps", "obliques"], level: 2 },
    halfKneelPress:     { en: "Half-Kneeling One-Arm Press", vi: "Đẩy tạ một tay quỳ một gối", primary: ["frontDelts", "triceps"], secondary: ["sideDelts", "obliques"], level: 2 },
    zPress:             { en: "Seated Z-Press (on floor)", vi: "Z-press ngồi sàn", primary: ["frontDelts", "triceps"], secondary: ["sideDelts", "abs", "traps"], level: 3 },
    arnoldPress:        { en: "One-Arm Arnold Press", vi: "Đẩy Arnold một tay", primary: ["frontDelts", "sideDelts"], secondary: ["triceps"], level: 2 },
    latRaise:           { en: "Seated Dumbbell Lateral Raise", vi: "Dang tạ ngang vai (ngồi)", primary: ["sideDelts"], secondary: ["traps"], level: 2 },
    leanLatRaise:       { en: "Lean-Away Dumbbell Lateral Raise", vi: "Dang tạ ngang nghiêng người (bám khung cửa)", primary: ["sideDelts"], secondary: ["traps"], level: 3 },
    latRaise15:         { en: "Lateral Raise, 1½ Reps", vi: "Dang tạ ngang, 1½ rep", primary: ["sideDelts"], secondary: ["traps"], level: 3 },
    sideLyingLatRaise:  { en: "Side-Lying Lateral Raise (floor)", vi: "Nằm nghiêng dang tạ", primary: ["sideDelts"], secondary: [], level: 2 },
    towelIsoLatRaise:   { en: "Towel Isometric Lateral Raise (doorframe)", vi: "Đẩy khăn ngang vào khung cửa giữ tĩnh", primary: ["sideDelts"], secondary: [], level: 1, hold: "20–30s/side", cue: "push out hard, shoulders down" },

    /* ---- Core ---- */
    hangKneeRaise:      { en: "Hanging Knee Raise", vi: "Treo xà gập gối", primary: ["abs"], secondary: ["obliques", "forearms"], level: 2 },
    hangLegRaise:       { en: "Hanging Leg Raise (straight legs)", vi: "Treo xà nâng chân thẳng", primary: ["abs"], secondary: ["obliques", "forearms"], level: 4 },
    toesToBar:          { en: "Toes-to-Bar", vi: "Treo xà chạm mũi chân vào xà", primary: ["abs"], secondary: ["obliques", "lats", "forearms"], level: 5 },
    reverseCrunch:      { en: "Reverse Crunch (floor)", vi: "Gập bụng ngược trên sàn", primary: ["abs"], secondary: ["obliques"], level: 1 },
    deadBug:            { en: "Dead Bug", vi: "Bọ chết (dead bug)", primary: ["abs"], secondary: ["obliques"], level: 1 },
    hollowHold:         { en: "Hollow Body Hold", vi: "Giữ thân hình thuyền (hollow)", primary: ["abs"], secondary: ["obliques"], level: 2, hold: "20–40s", cue: "low back pressed to floor" },
    hollowRock:         { en: "Hollow Body Rock", vi: "Hollow lắc người", primary: ["abs"], secondary: ["obliques"], level: 3 },
    hangObliqueRaise:   { en: "Hanging Oblique Knee Raise", vi: "Treo xà gập gối chéo", primary: ["obliques", "abs"], secondary: ["forearms"], level: 3 },
    windshieldWiper:    { en: "Hanging Windshield Wiper", vi: "Treo xà gạt nước", primary: ["obliques", "abs"], secondary: ["forearms", "lats"], level: 5 },
    sidePlankHipDip:    { en: "Side Plank Hip Dips", vi: "Plank nghiêng nhấp hông", primary: ["obliques"], secondary: ["abs", "glutes"], level: 3 },
    dbSideBend:         { en: "Dumbbell Side Bend", vi: "Nghiêng lườn với tạ", primary: ["obliques"], secondary: [], level: 1 },
    bicycleCrunch:      { en: "Bicycle Crunch", vi: "Gập bụng đạp xe", primary: ["obliques", "abs"], secondary: [], level: 1 },
    sidePlank:          { en: "Side Plank", vi: "Plank nghiêng", primary: ["obliques"], secondary: ["abs", "glutes"], level: 2, hold: "20–45s/side", cue: "hips high, no sag" },
    kneeSidePlank:      { en: "Knee Side Plank", vi: "Plank nghiêng chống gối", primary: ["obliques"], secondary: ["abs"], level: 1, hold: "20–45s/side", cue: "hips high, no sag" },

    /* ---- Squat / lunge ---- */
    gobletSquat:        { en: "Dumbbell Goblet Squat", vi: "Squat ôm tạ trước ngực (goblet)", primary: ["quads", "glutes"], secondary: ["abs", "lowerBack"], level: 2 },
    heelElevGoblet:     { en: "Heel-Elevated Goblet Squat", vi: "Goblet squat kê gót", primary: ["quads"], secondary: ["glutes", "abs"], level: 3 },
    shrimpSquat:        { en: "Shrimp Squat", vi: "Squat tôm (một chân)", primary: ["quads", "glutes"], secondary: ["calves"], level: 5 },
    pistolToChair:      { en: "Pistol Squat to Chair", vi: "Squat một chân xuống ghế", primary: ["quads", "glutes"], secondary: ["abs", "calves"], level: 4 },
    tempoBwSquat:       { en: "Tempo Bodyweight Squat (pause)", vi: "Squat tay không, dừng đáy", primary: ["quads", "glutes"], secondary: [], level: 1 },
    bss:                { en: "Bulgarian Split Squat", vi: "Squat chùng chân sau kê ghế (Bulgarian)", primary: ["quads", "glutes"], secondary: ["hamstrings", "forearms"], level: 3 },
    ffeBss:             { en: "Front-Foot-Elevated Bulgarian Split Squat", vi: "Bulgarian kê chân trước", primary: ["quads", "glutes"], secondary: ["hamstrings", "forearms"], level: 4 },
    splitSquat:         { en: "Split Squat (both feet on floor)", vi: "Squat chùng chân tại chỗ", primary: ["quads", "glutes"], secondary: ["hamstrings"], level: 2 },
    revLunge:           { en: "Dumbbell Reverse Lunge", vi: "Lunge lùi cầm tạ", primary: ["quads", "glutes"], secondary: ["hamstrings", "obliques"], level: 2 },
    deficitRevLunge:    { en: "Deficit Reverse Lunge (front foot on book)", vi: "Lunge lùi kê chân trước", primary: ["quads", "glutes"], secondary: ["hamstrings", "obliques"], level: 3 },
    stepUp:             { en: "Step-Up onto Chair", vi: "Bước lên ghế", primary: ["quads", "glutes"], secondary: ["calves"], level: 2 },
    bwRevLunge:         { en: "Bodyweight Reverse Lunge", vi: "Lunge lùi tay không", primary: ["quads", "glutes"], secondary: ["hamstrings"], level: 1 },

    /* ---- Hinge / knee flexion / glutes ---- */
    dbRdl:              { en: "Dumbbell Romanian Deadlift", vi: "RDL hai chân với tạ đơn", primary: ["hamstrings", "glutes", "lowerBack"], secondary: ["forearms", "traps"], level: 2 },
    slRdl:              { en: "Single-Leg Dumbbell RDL", vi: "RDL một chân với tạ đơn", primary: ["hamstrings", "glutes"], secondary: ["lowerBack", "obliques", "forearms"], level: 3 },
    deficitRdl:         { en: "Deficit Dumbbell RDL (on book)", vi: "RDL đứng trên sách (biên độ sâu)", primary: ["hamstrings", "glutes", "lowerBack"], secondary: ["forearms"], level: 3 },
    bStanceRdl:         { en: "B-Stance Dumbbell RDL", vi: "RDL lệch chân (B-stance)", primary: ["hamstrings", "glutes"], secondary: ["lowerBack", "forearms"], level: 3 },
    gobletGoodMorning:  { en: "Goblet Good Morning", vi: "Good morning ôm tạ", primary: ["hamstrings", "lowerBack"], secondary: ["glutes"], level: 1 },
    deficitSlRdl:       { en: "Deficit Single-Leg RDL", vi: "RDL một chân đứng trên sách", primary: ["hamstrings", "glutes"], secondary: ["lowerBack", "obliques", "forearms"], level: 4 },
    bwSlRdl:            { en: "Bodyweight Single-Leg RDL Reach", vi: "RDL một chân tay không", primary: ["hamstrings", "glutes"], secondary: ["lowerBack"], level: 2 },
    nordic:             { en: "Nordic Hamstring Curl (eccentric)", vi: "Nordic curl hạ chậm (móc chân dưới sofa)", primary: ["hamstrings"], secondary: ["glutes", "calves"], level: 4 },
    fullNordic:         { en: "Full Nordic Curl (up and down)", vi: "Nordic curl đủ hai pha", primary: ["hamstrings"], secondary: ["glutes", "calves"], level: 5 },
    slSlidingCurl:      { en: "Single-Leg Towel Sliding Leg Curl", vi: "Co gối trượt khăn một chân", primary: ["hamstrings"], secondary: ["glutes", "calves"], level: 3 },
    assistedNordic:     { en: "Hand-Assisted Nordic (push off floor)", vi: "Nordic có tay đẩy trợ lực", primary: ["hamstrings"], secondary: ["glutes", "calves"], level: 3 },
    slidingCurl:        { en: "Towel Sliding Leg Curl", vi: "Co gối trượt khăn (nằm ngửa)", primary: ["hamstrings"], secondary: ["glutes", "calves"], level: 2 },
    eccSlidingCurl:     { en: "Eccentric-Only Sliding Leg Curl", vi: "Trượt khăn chỉ pha duỗi chậm", primary: ["hamstrings"], secondary: ["glutes"], level: 1 },
    bridgeWalkout:      { en: "Hamstring Bridge Walkout", vi: "Cầu mông bước chân ra xa", primary: ["hamstrings", "glutes"], secondary: [], level: 1 },
    slHipThrust:        { en: "Single-Leg Hip Thrust (shoulders on sofa)", vi: "Đẩy hông một chân (vai tựa sofa)", primary: ["glutes"], secondary: ["hamstrings"], level: 3 },
    weightedSlHipThrust:{ en: "Weighted Single-Leg Hip Thrust (dumbbell on hip)", vi: "Đẩy hông một chân đặt tạ", primary: ["glutes"], secondary: ["hamstrings"], level: 4 },
    dbHipThrust:        { en: "Two-Leg Dumbbell Hip Thrust", vi: "Đẩy hông hai chân với tạ", primary: ["glutes"], secondary: ["hamstrings", "quads"], level: 2 },
    slGluteBridge:      { en: "Single-Leg Glute Bridge (floor)", vi: "Cầu mông một chân trên sàn", primary: ["glutes"], secondary: ["hamstrings"], level: 2 },
    frogPump:           { en: "Frog Pump", vi: "Cầu mông chân ếch", primary: ["glutes"], secondary: [], level: 1 },

    /* ---- Calves ---- */
    slCalf:             { en: "Single-Leg Calf Raise (on step)", vi: "Nhón bắp chân một chân trên bậc", primary: ["calves"], secondary: [], level: 3 },
    weightedSlCalf:     { en: "Weighted Single-Leg Calf Raise (dumbbell)", vi: "Nhón một chân cầm tạ", primary: ["calves"], secondary: ["forearms"], level: 4 },
    slCalf15:           { en: "Single-Leg Calf Raise, 1½ Reps", vi: "Nhón một chân, 1½ rep", primary: ["calves"], secondary: [], level: 3 },
    twoLegCalf:         { en: "Two-Leg Calf Raise (on step)", vi: "Nhón hai chân trên bậc", primary: ["calves"], secondary: [], level: 2 },
    flatCalf:           { en: "Flat-Floor Calf Raise", vi: "Nhón bắp chân trên sàn phẳng", primary: ["calves"], secondary: [], level: 1 },
    bentKneeCalf:       { en: "Bent-Knee Single-Leg Calf Raise", vi: "Nhón bắp chân gối khuỵu (một chân)", primary: ["calves"], secondary: [], level: 3 },
    seatedCalf:         { en: "Seated Dumbbell Calf Raise (on step)", vi: "Ngồi nhón bắp chân, tạ đặt gối", primary: ["calves"], secondary: [], level: 2 },
    bentKneeCalf15:     { en: "Bent-Knee Calf Raise, 1½ Reps", vi: "Nhón gối khuỵu, 1½ rep", primary: ["calves"], secondary: [], level: 4 },
    twoLegBentKnee:     { en: "Two-Leg Bent-Knee Calf Raise", vi: "Nhón hai chân gối khuỵu", primary: ["calves"], secondary: [], level: 1 }
  },

  /* Ranked best → least effective for hypertrophy (xếp hạng hiệu quả tăng cơ) */
  pools: {
    vPull:    ["weightedPullUp", "pullUp", "archerPullUp", "footAssistedPullUp", "negativePullUp"],
    chin:     ["weightedChinUp", "chinUp", "closeGripChinUp15", "footAssistedChinUp", "negativeChinUp"],
    row:      ["oaRow15", "oaRow", "chestSupportedRow", "twoPointRow", "towelDoorRow"],
    wideRow:  ["wideRow15", "wideRow", "chestSupportedWideRow", "proneYT", "scapPullUp"],
    rearDelt: ["chestSupportedRearFly", "rearFly15", "rearFly", "rearDeltRow", "proneT"],
    curl:     ["supCurl", "hammerCurl15", "hammerCurl", "closeGripChinSlow", "towelIsoCurl"],
    shrug:    ["shrugHold", "dbShrug", "highPull", "suitcaseHold", "pikeShrug"],
    push:     ["deficitPushUp", "fePushUp", "archerPushUp", "pushUp", "inclinePushUp"],
    pushB:    ["deficitPushUp", "archerPushUp", "pushUp15", "fePushUp", "oneArmPushUpNeg", "pseudoPlanche", "pushUp", "inclinePushUp"],
    pike:     ["fePikePushUp", "pikePushUp", "wallHspuNeg", "dbOHP", "kneelingPike"],
    ohp:      ["halfKneelPress", "dbOHP", "zPress", "fePikePushUp", "arnoldPress"],
    latRaise: ["leanLatRaise", "latRaise15", "latRaise", "sideLyingLatRaise", "towelIsoLatRaise"],
    triceps:  ["diamondPushUp", "dbOHTriExt", "feChairDip", "chairDip", "bentKneeDip"],
    absHang:  ["hangLegRaise", "toesToBar", "hangKneeRaise", "reverseCrunch", "deadBug"],
    absFloor: ["hangLegRaise", "hollowRock", "hollowHold", "reverseCrunch", "deadBug"],
    oblHang:  ["windshieldWiper", "hangObliqueRaise", "sidePlankHipDip", "dbSideBend", "bicycleCrunch"],
    oblPlank: ["hangObliqueRaise", "sidePlankHipDip", "sidePlank", "suitcaseHold", "kneeSidePlank"],
    squat:    ["heelElevGoblet", "gobletSquat", "shrimpSquat", "pistolToChair", "tempoBwSquat"],
    split:    ["ffeBss", "bss", "shrimpSquat", "revLunge", "splitSquat"],
    lunge:    ["bss", "deficitRevLunge", "revLunge", "stepUp", "bwRevLunge"],
    hinge:    ["slRdl", "deficitRdl", "dbRdl", "bStanceRdl", "gobletGoodMorning"],
    slHinge:  ["deficitSlRdl", "slRdl", "bStanceRdl", "dbRdl", "bwSlRdl"],
    kneeFlex: ["fullNordic", "nordic", "slSlidingCurl", "assistedNordic", "slidingCurl", "eccSlidingCurl", "bridgeWalkout"],
    glute:    ["weightedSlHipThrust", "slHipThrust", "dbHipThrust", "slGluteBridge", "frogPump"],
    calf:     ["weightedSlCalf", "slCalf15", "slCalf", "twoLegCalf", "flatCalf"],
    forearmFlex: ["fingerRollWristCurl", "wristCurl", "behindBackWristCurl", "towelHang", "deadHang"],
    forearmExt:  ["reverseCurl", "hammerCurl", "reverseWristCurl", "leverRadial"],
    calfBent: ["seatedCalf", "bentKneeCalf15", "bentKneeCalf", "weightedSlCalf", "twoLegBentKnee"]
  },

  sessions: [
    { id: "upperA", en: "Upper A", vi: "Thân trên A · thiên ngực", time: "≈ 42 min",
      priority: ["chest", "lats", "frontDelts", "sideDelts", "triceps"],
      items: [
        { pool: "vPull",    pick: "pullUp",        role: "Main",      sets: 4, reps: "4–8",        cue: "3s down, 1s chin-over-bar hold", ss: "A1" },
        { pool: "push",     pick: "fePushUp",      role: "Main",      sets: 4, reps: "8–15",       cue: "3s down, 1s pause at bottom",    ss: "A2" },
        { pool: "row",      pick: "oaRow",         role: "Main",      sets: 3, reps: "8–12/side",  cue: "2s squeeze at top, 3s down",     ss: "B1" },
        { pool: "pike",     pick: "pikePushUp",    role: "Main",      sets: 3, reps: "6–10",       cue: "3s down, 1s pause at bottom",    ss: "B2" },
        { pool: "latRaise", pick: "latRaise",      role: "Accessory", sets: 4, reps: "12–20/side", cue: "1s pause at top, 3s down",       ss: "C" },
        { pool: "curl",     pick: "supCurl",       role: "Accessory", sets: 3, reps: "8–12/side",  cue: "1s squeeze, 4s down",            ss: "D1" },
        { pool: "triceps",  pick: "dbOHTriExt",    role: "Accessory", sets: 3, reps: "10–15",      cue: "3s down into the stretch",       ss: "D2" }
      ] },
    { id: "lowerA", en: "Lower A", vi: "Thân dưới A · thiên đùi trước", time: "≈ 40 min",
      priority: ["quads", "glutes", "hamstrings", "abs", "calves", "forearms"],
      items: [
        { pool: "split",       pick: "bss",              role: "Main",      sets: 4, reps: "8–12/side",  cue: "3s down, 1s pause at bottom",     ss: "A" },
        { pool: "squat",       pick: "heelElevGoblet",   role: "Main",      sets: 3, reps: "10–15",      cue: "1½ reps, 3s down",                ss: "B1" },
        { pool: "calf",        pick: "slCalf",           role: "Accessory", sets: 3, reps: "10–20/side", cue: "2s stretch pause, 1s top hold",   ss: "B2" },
        { pool: "kneeFlex",    pick: "nordic",           role: "Accessory", sets: 3, reps: "3–6",        cue: "4–5s lowering, push back up",     ss: "C1" },
        { pool: "absHang",     pick: "hangKneeRaise",    role: "Accessory", sets: 3, reps: "8–15",       cue: "tilt pelvis up, no swing",        ss: "C2" },
        { pool: "forearmFlex", pick: "wristCurl",        role: "Accessory", sets: 2, reps: "15–20/side", cue: "full stretch, roll to fingertips", ss: "D1" },
        { pool: "forearmExt",  pick: "reverseWristCurl", role: "Accessory", sets: 2, reps: "15–20/side", cue: "2s squeeze, 3s down",             ss: "D2" }
      ] },
    { id: "upperB", en: "Upper B", vi: "Thân trên B · thiên lưng + vai", time: "≈ 43 min",
      priority: ["lats", "midBack", "rearDelts", "sideDelts", "frontDelts", "chest"],
      items: [
        { pool: "chin",     pick: "chinUp",        role: "Main",      sets: 4, reps: "5–10",       cue: "4s down, 1s dead-hang pause",    ss: "A1" },
        { pool: "pike",     pick: "fePikePushUp",  role: "Main",      sets: 4, reps: "6–10",       cue: "3s down, head past the hands",   ss: "A2" },
        { pool: "wideRow",  pick: "wideRow",       role: "Main",      sets: 3, reps: "10–15/side", cue: "2s squeeze at top, 3s down",     ss: "B1" },
        { pool: "pushB",    pick: "deficitPushUp", role: "Main",      sets: 4, reps: "8–15",       cue: "3s down, 1s pause in the stretch", ss: "B2" },
        { pool: "latRaise", pick: "leanLatRaise",  role: "Accessory", sets: 4, reps: "12–20/side", cue: "1s pause at top, 3s down",       ss: "C1" },
        { pool: "rearDelt", pick: "rearFly",       role: "Accessory", sets: 3, reps: "12–20/side", cue: "2s squeeze at top",              ss: "C2" },
        { pool: "curl",     pick: "hammerCurl",    role: "Accessory", sets: 3, reps: "8–12/side",  cue: "1s squeeze, 3s down",            ss: "D" }
      ] },
    { id: "lowerB", en: "Lower B", vi: "Thân dưới B · thiên gập hông", time: "≈ 42 min",
      priority: ["hamstrings", "glutes", "lowerBack", "sideDelts", "obliques", "forearms"],
      items: [
        { pool: "slHinge",  pick: "slRdl",           role: "Main",      sets: 4, reps: "8–12/side",  cue: "3s down, 1s stretch pause",     ss: "A" },
        { pool: "lunge",    pick: "deficitRevLunge", role: "Main",      sets: 3, reps: "8–12/side",  cue: "3s down, 1s pause at bottom",   ss: "B1" },
        { pool: "kneeFlex", pick: "slidingCurl",     role: "Accessory", sets: 3, reps: "6–12",       cue: "4s out, hips stay high",        ss: "B2" },
        { pool: "latRaise", pick: "latRaise",        role: "Accessory", sets: 3, reps: "12–20/side", cue: "1s pause at top, 3s down",      ss: "C1" },
        { pool: "calfBent", pick: "bentKneeCalf",    role: "Accessory", sets: 3, reps: "12–20/side", cue: "2s stretch pause at bottom",    ss: "C2" },
        { pool: "oblPlank", pick: "sidePlankHipDip", role: "Accessory", sets: 3, reps: "8–12/side",  cue: "slow, hips up high",            ss: "D1" },
        { pool: "forearmExt", pick: "reverseCurl",   role: "Accessory", sets: 3, reps: "10–15/side", cue: "wrists straight, 3s down",      ss: "D2" }
      ] },
    { id: "fullBody", en: "Full-Body", vi: "Toàn thân", time: "≈ 40 min",
      priority: ["lats", "chest", "quads", "hamstrings", "sideDelts"],
      items: [
        { pool: "vPull",    pick: "pullUp",        role: "Main",      sets: 3, reps: "4–8",        cue: "3s down, 1s top hold",           ss: "A1" },
        { pool: "push",     pick: "fePushUp",      role: "Main",      sets: 3, reps: "8–15",       cue: "3s down, 1s pause at bottom",    ss: "A2" },
        { pool: "squat",    pick: "gobletSquat",   role: "Main",      sets: 3, reps: "10–15",      cue: "3s down, 2s pause at bottom",    ss: "B1" },
        { pool: "row",      pick: "oaRow",         role: "Main",      sets: 3, reps: "8–12/side",  cue: "2s squeeze at top, 3s down",     ss: "B2" },
        { pool: "hinge",    pick: "dbRdl",         role: "Main",      sets: 3, reps: "8–12",       cue: "3s down, 1s stretch pause",      ss: "C1" },
        { pool: "latRaise", pick: "latRaise",      role: "Accessory", sets: 2, reps: "12–20/side", cue: "1s pause at top, 3s down",       ss: "C2" },
        { pool: "absHang",  pick: "hangKneeRaise", role: "Accessory", sets: 2, reps: "8–15",       cue: "1s squeeze at top, 3s down",     ss: "D" }
      ] }
  ]
};

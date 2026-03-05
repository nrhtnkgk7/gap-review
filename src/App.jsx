import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://hhnhzvxfqwhfhcewbpye.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhobmh6dnhmcXdoZmhjZXdicHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjc5NDQsImV4cCI6MjA4Nzk0Mzk0NH0.P4beK1FAe5pQhqX3oKQ-da7nkV3cMNd-jwcFnCLtQlM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Initial Mock Data ───────────────────────────────────────────────────────
const INITIAL_STORES = [
  { id: 1, name: "鮨 松籟", category: "鮨", area: "銀座", priceRange: "¥¥¥¥", description: "江戸前の技が光る老舗鮨店。旬のネタと職人の仕事を堪能できる。", image: "🍣" },
  { id: 2, name: "La Serre", category: "フレンチ", area: "表参道", priceRange: "¥¥¥", description: "モダンフレンチの新鋭。素材と技法の融合が美しい一皿を提供。", image: "🥂" },
  { id: 3, name: "焼肉 凛", category: "焼肉", area: "恵比寿", priceRange: "¥¥¥", description: "黒毛和牛専門。厳選された部位を炭火で丁寧に焼き上げる。", image: "🥩" },
  { id: 4, name: "天ぷら 真", category: "天ぷら", area: "麻布十番", priceRange: "¥¥¥¥", description: "旬野菜と魚介の天ぷらをカウンターで。揚げたての一瞬を楽しむ。", image: "🍤" },
  { id: 5, name: "Bar Nuit", category: "バー", area: "六本木", priceRange: "¥¥", description: "クラフトカクテルと厳選ウイスキー。深夜まで続く大人の時間。", image: "🍸" },
  { id: 6, name: "麺 侘寂", category: "ラーメン", area: "代々木", priceRange: "¥", description: "煮干しと昆布の澄んだスープ。シンプルの中に深みを追求。", image: "🍜" },
];

const INITIAL_REVIEWS = [
  { id: 1, storeId: 1, userId: "u2", userName: "Kaito M.", preExpect: "high", result: "Below", comment: "評判ほどではなかった。自分の好みとは合わなかった。", date: "2025-02-10", userType: "BI" },
  { id: 2, storeId: 1, userId: "u3", userName: "Risa T.", preExpect: "high", result: "Good", comment: "鮪の赤身の熟成具合が完璧。静かな空間も気に入った。", date: "2025-02-14", userType: "DI" },
  { id: 3, storeId: 2, userId: "u2", userName: "Kaito M.", preExpect: "high", result: "Below", comment: "評判ほどではなかった。料理の構成より素材そのものを重視する自分には合わなかった。", date: "2025-01-28", userType: "BI" },
  { id: 4, storeId: 3, userId: "u4", userName: "Sora Y.", preExpect: "low", result: "Good", comment: "期待以上にサービスが洗練されていた。肉質も申し分なし。", date: "2025-02-05", userType: "BC" },
  { id: 5, storeId: 4, userId: "u3", userName: "Risa T.", preExpect: "high", result: "Below", comment: "季節感は良かったが、油の温度管理に少し粗さを感じた。", date: "2025-01-20", userType: "DI" },
  { id: 6, storeId: 6, userId: "u4", userName: "Sora Y.", preExpect: "normal", result: "Good", comment: "このレベルのラーメンが千円台は驚き。スープが透き通っていて美しい。", date: "2025-02-18", userType: "DC" },
  { id: 7, storeId: 1, userId: "u5", userName: "Hana K.", preExpect: "normal", result: "Good", comment: "シャリの温度が完璧。ひとつひとつのネタへの向き合い方が誠実。", date: "2025-02-20", userType: "DC" },
  { id: 8, storeId: 2, userId: "u5", userName: "Hana K.", preExpect: "high", result: "Good", comment: "コースの流れが計算されていて、食後感がとても清々しかった。", date: "2025-02-22", userType: "DC" },
  { id: 9, storeId: 5, userId: "u3", userName: "Risa T.", preExpect: "normal", result: "Good", comment: "カクテルの精度が高い。バーテンダーの引き出しが広く会話も楽しめた。", date: "2025-02-15", userType: "DI" },
  { id: 10, storeId: 6, userId: "u2", userName: "Kaito M.", preExpect: "low", result: "Good", comment: "素材の良さをそのまま感じられるスープ。余計なものが何もない。", date: "2025-02-19", userType: "BI" },
];

const SAMPLE_USERS = [
  { id: "s1", name: "Aoi U00.", email: "s1@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s2", name: "Haruto U01.", email: "s2@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s3", name: "Yuna U02.", email: "s3@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s4", name: "Sota U03.", email: "s4@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s5", name: "Mio U04.", email: "s5@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s6", name: "Ren U05.", email: "s6@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s7", name: "Saki U06.", email: "s7@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s8", name: "Kento U07.", email: "s8@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s9", name: "Nana U08.", email: "s9@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s10", name: "Yuki U09.", email: "s10@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s11", name: "Riku U10.", email: "s11@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s12", name: "Hina U11.", email: "s12@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s13", name: "Daiki U12.", email: "s13@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s14", name: "Emi U13.", email: "s14@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s15", name: "Shota U14.", email: "s15@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s16", name: "Kana U15.", email: "s16@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s17", name: "Takuma U16.", email: "s17@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s18", name: "Yui U17.", email: "s18@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s19", name: "Naoto U18.", email: "s19@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s20", name: "Rika U19.", email: "s20@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s21", name: "Jun U20.", email: "s21@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s22", name: "Mei U21.", email: "s22@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s23", name: "Koki U22.", email: "s23@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s24", name: "Sara U23.", email: "s24@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s25", name: "Ryota U24.", email: "s25@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s26", name: "Ayaka U25.", email: "s26@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s27", name: "Kenji U26.", email: "s27@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s28", name: "Noa U27.", email: "s28@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s29", name: "Hiroshi U28.", email: "s29@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s30", name: "Miyu U29.", email: "s30@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s31", name: "Tatsuya U30.", email: "s31@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s32", name: "Akari U31.", email: "s32@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s33", name: "Shohei U32.", email: "s33@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s34", name: "Misaki U33.", email: "s34@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s35", name: "Yuya U34.", email: "s35@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s36", name: "Koharu U35.", email: "s36@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s37", name: "Taro U36.", email: "s37@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s38", name: "Asuka U37.", email: "s38@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s39", name: "Sho U38.", email: "s39@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s40", name: "Yuko U39.", email: "s40@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s41", name: "Makoto U40.", email: "s41@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s42", name: "Hana U41.", email: "s42@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s43", name: "Kazuki U42.", email: "s43@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s44", name: "Rin U43.", email: "s44@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s45", name: "Masaki U44.", email: "s45@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s46", name: "Chika U45.", email: "s46@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s47", name: "Ryo U46.", email: "s47@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s48", name: "Sena U47.", email: "s48@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s49", name: "Fuyu U48.", email: "s49@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s50", name: "Towa U49.", email: "s50@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s51", name: "Kaname U50.", email: "s51@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s52", name: "Itsuki U51.", email: "s52@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s53", name: "Shiori U52.", email: "s53@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s54", name: "Reon U53.", email: "s54@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s55", name: "Amane U54.", email: "s55@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s56", name: "Tsukasa U55.", email: "s56@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s57", name: "Kotone U56.", email: "s57@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s58", name: "Haruki U57.", email: "s58@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s59", name: "Suzu U58.", email: "s59@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s60", name: "Minato U59.", email: "s60@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s61", name: "Akito U60.", email: "s61@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s62", name: "Izumi U61.", email: "s62@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s63", name: "Soshi U62.", email: "s63@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s64", name: "Nozomi U63.", email: "s64@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s65", name: "Kanata U64.", email: "s65@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s66", name: "Yuito U65.", email: "s66@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s67", name: "Hinata U66.", email: "s67@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s68", name: "Souma U67.", email: "s68@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s69", name: "Kokona U68.", email: "s69@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s70", name: "Tsumugi U69.", email: "s70@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s71", name: "Hayato U70.", email: "s71@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s72", name: "Ichika U71.", email: "s72@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s73", name: "Ryusei U72.", email: "s73@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s74", name: "Sakura U73.", email: "s74@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s75", name: "Kain U74.", email: "s75@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s76", name: "Nanami U75.", email: "s76@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s77", name: "Shun U76.", email: "s77@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s78", name: "Kotaro U77.", email: "s78@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s79", name: "Arisa U78.", email: "s79@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s80", name: "Taiga U79.", email: "s80@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s81", name: "Miharu U80.", email: "s81@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s82", name: "Sosuke U81.", email: "s82@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s83", name: "Kokomi U82.", email: "s83@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s84", name: "Kira U83.", email: "s84@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s85", name: "Takeru U84.", email: "s85@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s86", name: "Seira U85.", email: "s86@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s87", name: "Yusei U86.", email: "s87@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s88", name: "Tomoka U87.", email: "s88@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s89", name: "Ibuki U88.", email: "s89@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s90", name: "Haruma U89.", email: "s90@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s91", name: "Mizuki U90.", email: "s91@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s92", name: "Rui U91.", email: "s92@example.com", password: "pass", isAdmin: false, userType: "DC" },
  { id: "s93", name: "Akane U92.", email: "s93@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s94", name: "Souta U93.", email: "s94@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s95", name: "Kohana U94.", email: "s95@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s96", name: "Itsumi U95.", email: "s96@example.com", password: "pass", isAdmin: false, userType: "BI" },
  { id: "s97", name: "Hayate U96.", email: "s97@example.com", password: "pass", isAdmin: false, userType: "DI" },
  { id: "s98", name: "Shouta U97.", email: "s98@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s99", name: "Fumika U98.", email: "s99@example.com", password: "pass", isAdmin: false, userType: "BC" },
  { id: "s100", name: "Tsuna U99.", email: "s100@example.com", password: "pass", isAdmin: false, userType: "BI" }
];

const SAMPLE_REVIEWS = [
  { id: 11, storeId: 1, userId: "s13", userName: "Daiki U12.", preExpect: "high", result: "Below", comment: "コスパを考えると、もう少し頑張ってほしかった。", date: "2025-01-07", userType: "BI" },
  { id: 12, storeId: 1, userId: "s6", userName: "Ren U05.", preExpect: "high", result: "Below", comment: "評判ほどではなかった。自分には合わなかった。", date: "2025-05-08", userType: "BI" },
  { id: 13, storeId: 1, userId: "s68", userName: "Souma U67.", preExpect: "high", result: "Below", comment: "友人に勧められて来たが、自分には刺さらなかった。", date: "2025-01-27", userType: "BI" },
  { id: 14, storeId: 1, userId: "s53", userName: "Shiori U52.", preExpect: "high", result: "Below", comment: "口に合わなかった。好みの問題かもしれない。", date: "2025-02-26", userType: "BI" },
  { id: 15, storeId: 1, userId: "s61", userName: "Akito U60.", preExpect: "high", result: "Below", comment: "コスパを考えると、もう少し頑張ってほしかった。", date: "2025-02-11", userType: "BI" },
  { id: 16, storeId: 1, userId: "s85", userName: "Takeru U84.", preExpect: "high", result: "Below", comment: "SNSの印象と実際のギャップが大きかった。", date: "2025-05-17", userType: "BI" },
  { id: 17, storeId: 1, userId: "s96", userName: "Itsumi U95.", preExpect: "high", result: "Expected", comment: "期待通りの安定感。", date: "2025-05-18", userType: "BI" },
  { id: 18, storeId: 1, userId: "s70", userName: "Tsumugi U69.", preExpect: "high", result: "Expected", comment: "期待通りの安定感。", date: "2025-02-21", userType: "BC" },
  { id: 19, storeId: 1, userId: "s19", userName: "Naoto U18.", preExpect: "normal", result: "Below", comment: "友人に勧められて来たが、自分には刺さらなかった。", date: "2025-01-19", userType: "BC" },
  { id: 20, storeId: 1, userId: "s57", userName: "Kotone U56.", preExpect: "normal", result: "Below", comment: "コスパを考えると、もう少し頑張ってほしかった。", date: "2025-01-03", userType: "BC" },
  { id: 21, storeId: 1, userId: "s99", userName: "Fumika U98.", preExpect: "normal", result: "Below", comment: "評判ほどではなかった。自分には合わなかった。", date: "2025-05-19", userType: "BC" },
  { id: 22, storeId: 1, userId: "s51", userName: "Kaname U50.", preExpect: "normal", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-04-25", userType: "BC" },
  { id: 23, storeId: 1, userId: "s41", userName: "Makoto U40.", preExpect: "normal", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-03-17", userType: "BC" },
  { id: 24, storeId: 1, userId: "s65", userName: "Kanata U64.", preExpect: "normal", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-05-23", userType: "DI" },
  { id: 25, storeId: 1, userId: "s71", userName: "Hayato U70.", preExpect: "normal", result: "Expected", comment: "丁寧な仕事だが、記憶に残るかは微妙。", date: "2025-03-16", userType: "DI" },
  { id: 26, storeId: 1, userId: "s91", userName: "Mizuki U90.", preExpect: "high", result: "Expected", comment: "期待通りの安定感。", date: "2025-06-28", userType: "DI" },
  { id: 27, storeId: 1, userId: "s56", userName: "Tsukasa U55.", preExpect: "normal", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-05-25", userType: "DI" },
  { id: 28, storeId: 1, userId: "s26", userName: "Ayaka U25.", preExpect: "normal", result: "Good", comment: "連れていった友人にも大好評だった。", date: "2025-06-04", userType: "DI" },
  { id: 29, storeId: 1, userId: "s59", userName: "Suzu U58.", preExpect: "high", result: "Expected", comment: "全体的に及第点。可もなく不可もなく。", date: "2025-01-27", userType: "DI" },
  { id: 30, storeId: 1, userId: "s15", userName: "Shota U14.", preExpect: "high", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-01-06", userType: "DC" },
  { id: 31, storeId: 1, userId: "s35", userName: "Yuya U34.", preExpect: "high", result: "Good", comment: "想像以上にレベルが高く、感動した。", date: "2025-03-14", userType: "DC" },
  { id: 32, storeId: 1, userId: "s83", userName: "Kokomi U82.", preExpect: "normal", result: "Good", comment: "期待を大きく超えてきた。また来たい。", date: "2025-05-21", userType: "DC" },
  { id: 33, storeId: 1, userId: "s8", userName: "Kento U07.", preExpect: "high", result: "Good", comment: "素晴らしい体験。スタッフの心配りも完璧。", date: "2025-03-21", userType: "DC" },
  { id: 34, storeId: 1, userId: "s17", userName: "Takuma U16.", preExpect: "normal", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-06-26", userType: "DC" },
  { id: 35, storeId: 2, userId: "s96", userName: "Itsumi U95.", preExpect: "high", result: "Below", comment: "サービスに少し難あり。料理も期待以下。", date: "2025-01-02", userType: "BI" },
  { id: 36, storeId: 2, userId: "s6", userName: "Ren U05.", preExpect: "high", result: "Below", comment: "サービスに少し難あり。料理も期待以下。", date: "2025-02-05", userType: "BI" },
  { id: 37, storeId: 2, userId: "s9", userName: "Nana U08.", preExpect: "normal", result: "Below", comment: "口に合わなかった。好みの問題かもしれない。", date: "2025-06-23", userType: "BI" },
  { id: 38, storeId: 2, userId: "s66", userName: "Yuito U65.", preExpect: "high", result: "Below", comment: "評判ほどではなかった。自分には合わなかった。", date: "2025-01-12", userType: "BI" },
  { id: 39, storeId: 2, userId: "s22", userName: "Mei U21.", preExpect: "high", result: "Below", comment: "雰囲気は良いが、肝心の料理が自分好みではなかった。", date: "2025-01-19", userType: "BI" },
  { id: 40, storeId: 2, userId: "s68", userName: "Souma U67.", preExpect: "high", result: "Below", comment: "SNSの印象と実際のギャップが大きかった。", date: "2025-05-27", userType: "BI" },
  { id: 41, storeId: 2, userId: "s60", userName: "Minato U59.", preExpect: "normal", result: "Below", comment: "ピークを過ぎた感じがした。", date: "2025-05-09", userType: "BI" },
  { id: 42, storeId: 2, userId: "s33", userName: "Shohei U32.", preExpect: "high", result: "Good", comment: "連れていった友人にも大好評だった。", date: "2025-01-25", userType: "BC" },
  { id: 43, storeId: 2, userId: "s57", userName: "Kotone U56.", preExpect: "high", result: "Good", comment: "ひとつひとつの仕事が丁寧だった。", date: "2025-04-03", userType: "BC" },
  { id: 44, storeId: 2, userId: "s64", userName: "Nozomi U63.", preExpect: "high", result: "Expected", comment: "サービスは良かったが料理は普通。", date: "2025-06-25", userType: "BC" },
  { id: 45, storeId: 2, userId: "s51", userName: "Kaname U50.", preExpect: "high", result: "Good", comment: "ひとつひとつの仕事が丁寧だった。", date: "2025-03-02", userType: "BC" },
  { id: 46, storeId: 2, userId: "s49", userName: "Fuyu U48.", preExpect: "high", result: "Good", comment: "想像以上にレベルが高く、感動した。", date: "2025-03-12", userType: "BC" },
  { id: 47, storeId: 2, userId: "s62", userName: "Izumi U61.", preExpect: "high", result: "Expected", comment: "全体的に及第点。可もなく不可もなく。", date: "2025-02-17", userType: "DI" },
  { id: 48, storeId: 2, userId: "s46", userName: "Chika U45.", preExpect: "high", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-04-27", userType: "DI" },
  { id: 49, storeId: 2, userId: "s95", userName: "Kohana U94.", preExpect: "normal", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-01-27", userType: "DI" },
  { id: 50, storeId: 2, userId: "s65", userName: "Kanata U64.", preExpect: "normal", result: "Expected", comment: "サービスは良かったが料理は普通。", date: "2025-05-10", userType: "DI" },
  { id: 51, storeId: 2, userId: "s37", userName: "Taro U36.", preExpect: "high", result: "Expected", comment: "値段相応の体験だった。", date: "2025-04-15", userType: "DI" },
  { id: 52, storeId: 2, userId: "s4", userName: "Sota U03.", preExpect: "normal", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-06-17", userType: "DI" },
  { id: 53, storeId: 2, userId: "s89", userName: "Ibuki U88.", preExpect: "normal", result: "Below", comment: "口に合わなかった。好みの問題かもしれない。", date: "2025-03-17", userType: "DI" },
  { id: 54, storeId: 2, userId: "s72", userName: "Ichika U71.", preExpect: "high", result: "Good", comment: "ひとつひとつの仕事が丁寧だった。", date: "2025-04-12", userType: "DC" },
  { id: 55, storeId: 2, userId: "s45", userName: "Masaki U44.", preExpect: "high", result: "Expected", comment: "サービスは良かったが料理は普通。", date: "2025-04-08", userType: "DC" },
  { id: 56, storeId: 2, userId: "s82", userName: "Sosuke U81.", preExpect: "high", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-02-09", userType: "DC" },
  { id: 57, storeId: 2, userId: "s76", userName: "Nanami U75.", preExpect: "high", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-06-08", userType: "DC" },
  { id: 58, storeId: 2, userId: "s5", userName: "Mio U04.", preExpect: "normal", result: "Expected", comment: "サービスは良かったが料理は普通。", date: "2025-01-24", userType: "DC" },
  { id: 59, storeId: 2, userId: "s83", userName: "Kokomi U82.", preExpect: "high", result: "Expected", comment: "値段相応の体験だった。", date: "2025-04-01", userType: "DC" },
  { id: 60, storeId: 3, userId: "s93", userName: "Akane U92.", preExpect: "normal", result: "Good", comment: "素材の質が抜群で、全皿に意志を感じた。", date: "2025-06-24", userType: "BI" },
  { id: 61, storeId: 3, userId: "s6", userName: "Ren U05.", preExpect: "low", result: "Expected", comment: "期待通りの安定感。", date: "2025-01-28", userType: "BI" },
  { id: 62, storeId: 3, userId: "s68", userName: "Souma U67.", preExpect: "normal", result: "Expected", comment: "悪くはないが、特別感はなかった。", date: "2025-01-24", userType: "BI" },
  { id: 63, storeId: 3, userId: "s85", userName: "Takeru U84.", preExpect: "low", result: "Good", comment: "ひとつひとつの仕事が丁寧だった。", date: "2025-05-13", userType: "BI" },
  { id: 64, storeId: 3, userId: "s21", userName: "Jun U20.", preExpect: "low", result: "Good", comment: "連れていった友人にも大好評だった。", date: "2025-05-26", userType: "BI" },
  { id: 65, storeId: 3, userId: "s69", userName: "Kokona U68.", preExpect: "normal", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-04-09", userType: "BI" },
  { id: 66, storeId: 3, userId: "s34", userName: "Misaki U33.", preExpect: "high", result: "Good", comment: "ひとつひとつの仕事が丁寧だった。", date: "2025-03-22", userType: "BC" },
  { id: 67, storeId: 3, userId: "s64", userName: "Nozomi U63.", preExpect: "normal", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-02-21", userType: "BC" },
  { id: 68, storeId: 3, userId: "s94", userName: "Souta U93.", preExpect: "low", result: "Expected", comment: "期待通りの安定感。", date: "2025-03-07", userType: "BC" },
  { id: 69, storeId: 3, userId: "s14", userName: "Emi U13.", preExpect: "low", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-04-15", userType: "BC" },
  { id: 70, storeId: 3, userId: "s98", userName: "Shouta U97.", preExpect: "low", result: "Good", comment: "素晴らしい体験。スタッフの心配りも完璧。", date: "2025-04-11", userType: "BC" },
  { id: 71, storeId: 3, userId: "s32", userName: "Akari U31.", preExpect: "normal", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-03-04", userType: "BC" },
  { id: 72, storeId: 3, userId: "s70", userName: "Tsumugi U69.", preExpect: "high", result: "Expected", comment: "全体的に及第点。可もなく不可もなく。", date: "2025-04-01", userType: "BC" },
  { id: 73, storeId: 3, userId: "s54", userName: "Reon U53.", preExpect: "high", result: "Expected", comment: "丁寧な仕事だが、記憶に残るかは微妙。", date: "2025-06-14", userType: "DI" },
  { id: 74, storeId: 3, userId: "s95", userName: "Kohana U94.", preExpect: "high", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-02-25", userType: "DI" },
  { id: 75, storeId: 3, userId: "s52", userName: "Itsuki U51.", preExpect: "normal", result: "Expected", comment: "期待通りの安定感。", date: "2025-03-08", userType: "DI" },
  { id: 76, storeId: 3, userId: "s37", userName: "Taro U36.", preExpect: "high", result: "Below", comment: "SNSの印象と実際のギャップが大きかった。", date: "2025-02-02", userType: "DI" },
  { id: 77, storeId: 3, userId: "s1", userName: "Aoi U00.", preExpect: "high", result: "Below", comment: "友人に勧められて来たが、自分には刺さらなかった。", date: "2025-02-19", userType: "DI" },
  { id: 78, storeId: 3, userId: "s2", userName: "Haruto U01.", preExpect: "high", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-02-11", userType: "DI" },
  { id: 79, storeId: 3, userId: "s5", userName: "Mio U04.", preExpect: "normal", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-01-24", userType: "DC" },
  { id: 80, storeId: 3, userId: "s8", userName: "Kento U07.", preExpect: "normal", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-01-25", userType: "DC" },
  { id: 81, storeId: 3, userId: "s16", userName: "Kana U15.", preExpect: "normal", result: "Good", comment: "期待を大きく超えてきた。また来たい。", date: "2025-02-07", userType: "DC" },
  { id: 82, storeId: 3, userId: "s35", userName: "Yuya U34.", preExpect: "normal", result: "Good", comment: "想像以上にレベルが高く、感動した。", date: "2025-01-27", userType: "DC" },
  { id: 83, storeId: 3, userId: "s50", userName: "Towa U49.", preExpect: "high", result: "Below", comment: "口に合わなかった。好みの問題かもしれない。", date: "2025-02-02", userType: "DC" },
  { id: 84, storeId: 4, userId: "s53", userName: "Shiori U52.", preExpect: "high", result: "Below", comment: "サービスに少し難あり。料理も期待以下。", date: "2025-03-09", userType: "BI" },
  { id: 85, storeId: 4, userId: "s69", userName: "Kokona U68.", preExpect: "high", result: "Expected", comment: "悪くはないが、特別感はなかった。", date: "2025-06-03", userType: "BI" },
  { id: 86, storeId: 4, userId: "s38", userName: "Asuka U37.", preExpect: "high", result: "Below", comment: "コスパを考えると、もう少し頑張ってほしかった。", date: "2025-01-09", userType: "BI" },
  { id: 87, storeId: 4, userId: "s6", userName: "Ren U05.", preExpect: "high", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-06-25", userType: "BI" },
  { id: 88, storeId: 4, userId: "s24", userName: "Sara U23.", preExpect: "high", result: "Below", comment: "サービスに少し難あり。料理も期待以下。", date: "2025-02-06", userType: "BI" },
  { id: 89, storeId: 4, userId: "s44", userName: "Rin U43.", preExpect: "normal", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-04-03", userType: "BI" },
  { id: 90, storeId: 4, userId: "s93", userName: "Akane U92.", preExpect: "high", result: "Expected", comment: "期待通りの安定感。", date: "2025-03-08", userType: "BI" },
  { id: 91, storeId: 4, userId: "s39", userName: "Sho U38.", preExpect: "high", result: "Below", comment: "コスパを考えると、もう少し頑張ってほしかった。", date: "2025-03-23", userType: "BC" },
  { id: 92, storeId: 4, userId: "s78", userName: "Kotaro U77.", preExpect: "high", result: "Expected", comment: "期待通りの安定感。", date: "2025-03-15", userType: "BC" },
  { id: 93, storeId: 4, userId: "s49", userName: "Fuyu U48.", preExpect: "high", result: "Below", comment: "SNSの印象と実際のギャップが大きかった。", date: "2025-05-23", userType: "BC" },
  { id: 94, storeId: 4, userId: "s19", userName: "Naoto U18.", preExpect: "high", result: "Below", comment: "評判ほどではなかった。自分には合わなかった。", date: "2025-04-03", userType: "BC" },
  { id: 95, storeId: 4, userId: "s31", userName: "Tatsuya U30.", preExpect: "high", result: "Below", comment: "サービスに少し難あり。料理も期待以下。", date: "2025-04-19", userType: "BC" },
  { id: 96, storeId: 4, userId: "s7", userName: "Saki U06.", preExpect: "high", result: "Expected", comment: "悪くはないが、特別感はなかった。", date: "2025-02-24", userType: "BC" },
  { id: 97, storeId: 4, userId: "s98", userName: "Shouta U97.", preExpect: "high", result: "Below", comment: "SNSの印象と実際のギャップが大きかった。", date: "2025-04-17", userType: "BC" },
  { id: 98, storeId: 4, userId: "s4", userName: "Sota U03.", preExpect: "normal", result: "Good", comment: "想像以上にレベルが高く、感動した。", date: "2025-03-22", userType: "DI" },
  { id: 99, storeId: 4, userId: "s97", userName: "Hayate U96.", preExpect: "normal", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-05-25", userType: "DI" },
  { id: 100, storeId: 4, userId: "s71", userName: "Hayato U70.", preExpect: "high", result: "Good", comment: "期待を大きく超えてきた。また来たい。", date: "2025-04-23", userType: "DI" },
  { id: 101, storeId: 4, userId: "s10", userName: "Yuki U09.", preExpect: "normal", result: "Good", comment: "コスパを超えた体験。リピート確定。", date: "2025-02-10", userType: "DI" },
  { id: 102, storeId: 4, userId: "s67", userName: "Hinata U66.", preExpect: "normal", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-01-05", userType: "DI" },
  { id: 103, storeId: 4, userId: "s74", userName: "Sakura U73.", preExpect: "normal", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-04-20", userType: "DI" },
  { id: 104, storeId: 4, userId: "s35", userName: "Yuya U34.", preExpect: "high", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-03-22", userType: "DC" },
  { id: 105, storeId: 4, userId: "s83", userName: "Kokomi U82.", preExpect: "high", result: "Expected", comment: "期待通りの安定感。", date: "2025-04-28", userType: "DC" },
  { id: 106, storeId: 4, userId: "s82", userName: "Sosuke U81.", preExpect: "normal", result: "Good", comment: "ひとつひとつの仕事が丁寧だった。", date: "2025-01-20", userType: "DC" },
  { id: 107, storeId: 4, userId: "s8", userName: "Kento U07.", preExpect: "normal", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-03-26", userType: "DC" },
  { id: 108, storeId: 4, userId: "s12", userName: "Hina U11.", preExpect: "normal", result: "Expected", comment: "悪くはないが、特別感はなかった。", date: "2025-03-23", userType: "DC" },
  { id: 109, storeId: 4, userId: "s20", userName: "Rika U19.", preExpect: "normal", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-02-24", userType: "DC" },
  { id: 110, storeId: 5, userId: "s6", userName: "Ren U05.", preExpect: "low", result: "Good", comment: "コスパを超えた体験。リピート確定。", date: "2025-03-05", userType: "BI" },
  { id: 111, storeId: 5, userId: "s68", userName: "Souma U67.", preExpect: "low", result: "Expected", comment: "丁寧な仕事だが、記憶に残るかは微妙。", date: "2025-01-04", userType: "BI" },
  { id: 112, storeId: 5, userId: "s69", userName: "Kokona U68.", preExpect: "low", result: "Good", comment: "期待を大きく超えてきた。また来たい。", date: "2025-04-27", userType: "BI" },
  { id: 113, storeId: 5, userId: "s96", userName: "Itsumi U95.", preExpect: "normal", result: "Good", comment: "今まで行った中でも上位に入る体験。", date: "2025-03-22", userType: "BI" },
  { id: 114, storeId: 5, userId: "s21", userName: "Jun U20.", preExpect: "low", result: "Good", comment: "期待を大きく超えてきた。また来たい。", date: "2025-05-25", userType: "BI" },
  { id: 115, storeId: 5, userId: "s48", userName: "Sena U47.", preExpect: "low", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-03-18", userType: "BI" },
  { id: 116, storeId: 5, userId: "s60", userName: "Minato U59.", preExpect: "low", result: "Good", comment: "連れていった友人にも大好評だった。", date: "2025-04-11", userType: "BI" },
  { id: 117, storeId: 5, userId: "s78", userName: "Kotaro U77.", preExpect: "low", result: "Good", comment: "今まで行った中でも上位に入る体験。", date: "2025-04-25", userType: "BC" },
  { id: 118, storeId: 5, userId: "s58", userName: "Haruki U57.", preExpect: "normal", result: "Expected", comment: "悪くはないが、特別感はなかった。", date: "2025-06-14", userType: "BC" },
  { id: 119, storeId: 5, userId: "s43", userName: "Kazuki U42.", preExpect: "low", result: "Good", comment: "素晴らしい体験。スタッフの心配りも完璧。", date: "2025-05-10", userType: "BC" },
  { id: 120, storeId: 5, userId: "s49", userName: "Fuyu U48.", preExpect: "normal", result: "Good", comment: "ひとつひとつの仕事が丁寧だった。", date: "2025-04-04", userType: "BC" },
  { id: 121, storeId: 5, userId: "s98", userName: "Shouta U97.", preExpect: "normal", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-06-01", userType: "BC" },
  { id: 122, storeId: 5, userId: "s64", userName: "Nozomi U63.", preExpect: "low", result: "Good", comment: "想像以上にレベルが高く、感動した。", date: "2025-06-02", userType: "BC" },
  { id: 123, storeId: 5, userId: "s54", userName: "Reon U53.", preExpect: "normal", result: "Good", comment: "連れていった友人にも大好評だった。", date: "2025-02-20", userType: "DI" },
  { id: 124, storeId: 5, userId: "s75", userName: "Kain U74.", preExpect: "low", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-06-12", userType: "DI" },
  { id: 125, storeId: 5, userId: "s2", userName: "Haruto U01.", preExpect: "normal", result: "Good", comment: "素材の質が抜群で、全皿に意志を感じた。", date: "2025-06-12", userType: "DI" },
  { id: 126, storeId: 5, userId: "s25", userName: "Ryota U24.", preExpect: "normal", result: "Good", comment: "想像以上にレベルが高く、感動した。", date: "2025-04-19", userType: "DI" },
  { id: 127, storeId: 5, userId: "s59", userName: "Suzu U58.", preExpect: "normal", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-01-05", userType: "DI" },
  { id: 128, storeId: 5, userId: "s10", userName: "Yuki U09.", preExpect: "normal", result: "Expected", comment: "丁寧な仕事だが、記憶に残るかは微妙。", date: "2025-04-16", userType: "DI" },
  { id: 129, storeId: 5, userId: "s81", userName: "Miharu U80.", preExpect: "low", result: "Expected", comment: "期待通りの安定感。", date: "2025-05-09", userType: "DC" },
  { id: 130, storeId: 5, userId: "s8", userName: "Kento U07.", preExpect: "low", result: "Good", comment: "今まで行った中でも上位に入る体験。", date: "2025-03-24", userType: "DC" },
  { id: 131, storeId: 5, userId: "s82", userName: "Sosuke U81.", preExpect: "low", result: "Good", comment: "コスパを超えた体験。リピート確定。", date: "2025-01-05", userType: "DC" },
  { id: 132, storeId: 5, userId: "s79", userName: "Arisa U78.", preExpect: "low", result: "Good", comment: "今まで行った中でも上位に入る体験。", date: "2025-02-17", userType: "DC" },
  { id: 133, storeId: 5, userId: "s92", userName: "Rui U91.", preExpect: "low", result: "Expected", comment: "サービスは良かったが料理は普通。", date: "2025-03-23", userType: "DC" },
  { id: 134, storeId: 6, userId: "s93", userName: "Akane U92.", preExpect: "low", result: "Good", comment: "素晴らしい体験。スタッフの心配りも完璧。", date: "2025-02-01", userType: "BI" },
  { id: 135, storeId: 6, userId: "s60", userName: "Minato U59.", preExpect: "normal", result: "Good", comment: "今まで行った中でも上位に入る体験。", date: "2025-02-02", userType: "BI" },
  { id: 136, storeId: 6, userId: "s6", userName: "Ren U05.", preExpect: "normal", result: "Good", comment: "連れていった友人にも大好評だった。", date: "2025-05-16", userType: "BI" },
  { id: 137, storeId: 6, userId: "s69", userName: "Kokona U68.", preExpect: "normal", result: "Good", comment: "素晴らしい体験。スタッフの心配りも完璧。", date: "2025-05-05", userType: "BI" },
  { id: 138, storeId: 6, userId: "s86", userName: "Seira U85.", preExpect: "low", result: "Good", comment: "想像以上にレベルが高く、感動した。", date: "2025-01-12", userType: "BI" },
  { id: 139, storeId: 6, userId: "s19", userName: "Naoto U18.", preExpect: "normal", result: "Good", comment: "期待を裏切られた——良い方向に。", date: "2025-03-05", userType: "BC" },
  { id: 140, storeId: 6, userId: "s7", userName: "Saki U06.", preExpect: "low", result: "Expected", comment: "期待通りの安定感。", date: "2025-05-19", userType: "BC" },
  { id: 141, storeId: 6, userId: "s98", userName: "Shouta U97.", preExpect: "low", result: "Expected", comment: "水準は高いが驚きはなかった。", date: "2025-05-23", userType: "BC" },
  { id: 142, storeId: 6, userId: "s43", userName: "Kazuki U42.", preExpect: "normal", result: "Good", comment: "静かな空間で集中して食べられた。", date: "2025-02-11", userType: "BC" },
  { id: 143, storeId: 6, userId: "s55", userName: "Amane U54.", preExpect: "normal", result: "Expected", comment: "値段相応の体験だった。", date: "2025-06-02", userType: "BC" },
  { id: 144, storeId: 6, userId: "s51", userName: "Kaname U50.", preExpect: "normal", result: "Expected", comment: "丁寧な仕事だが、記憶に残るかは微妙。", date: "2025-06-06", userType: "BC" },
  { id: 145, storeId: 6, userId: "s25", userName: "Ryota U24.", preExpect: "high", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-01-10", userType: "DI" },
  { id: 146, storeId: 6, userId: "s54", userName: "Reon U53.", preExpect: "high", result: "Below", comment: "ピークを過ぎた感じがした。", date: "2025-02-18", userType: "DI" },
  { id: 147, storeId: 6, userId: "s26", userName: "Ayaka U25.", preExpect: "normal", result: "Below", comment: "期待が高すぎたのか、全体的に物足りなかった。", date: "2025-04-12", userType: "DI" },
  { id: 148, storeId: 6, userId: "s52", userName: "Itsuki U51.", preExpect: "normal", result: "Below", comment: "ピークを過ぎた感じがした。", date: "2025-01-19", userType: "DI" },
  { id: 149, storeId: 6, userId: "s75", userName: "Kain U74.", preExpect: "high", result: "Expected", comment: "悪くはないが、特別感はなかった。", date: "2025-01-12", userType: "DI" },
  { id: 150, storeId: 6, userId: "s92", userName: "Rui U91.", preExpect: "low", result: "Expected", comment: "値段相応の体験だった。", date: "2025-04-14", userType: "DC" },
  { id: 151, storeId: 6, userId: "s5", userName: "Mio U04.", preExpect: "high", result: "Below", comment: "コスパを考えると、もう少し頑張ってほしかった。", date: "2025-01-27", userType: "DC" },
  { id: 152, storeId: 6, userId: "s8", userName: "Kento U07.", preExpect: "high", result: "Below", comment: "友人に勧められて来たが、自分には刺さらなかった。", date: "2025-01-18", userType: "DC" },
  { id: 153, storeId: 6, userId: "s16", userName: "Kana U15.", preExpect: "low", result: "Below", comment: "雰囲気は良いが、肝心の料理が自分好みではなかった。", date: "2025-02-11", userType: "DC" },
  { id: 154, storeId: 6, userId: "s73", userName: "Ryusei U72.", preExpect: "low", result: "Expected", comment: "コンセプトは好きだが印象が薄かった。", date: "2025-05-20", userType: "DC" },
  { id: 155, storeId: 6, userId: "s35", userName: "Yuya U34.", preExpect: "normal", result: "Expected", comment: "期待通りの安定感。", date: "2025-01-17", userType: "DC" },
  { id: 156, storeId: 6, userId: "s83", userName: "Kokomi U82.", preExpect: "normal", result: "Expected", comment: "期待通りの安定感。", date: "2025-04-01", userType: "DC" }
];

const USER_TYPES = {
  BI: { label: "がっつり × 素材派", icon: "🔥", desc: "濃い味 × 素材重視", color: "#C0392B" },
  BC: { label: "がっつり × バランス派", icon: "⚡", desc: "濃い味 × バランス重視", color: "#8E44AD" },
  DI: { label: "繊細 × 素材派", icon: "🌿", desc: "繊細な味 × 素材重視", color: "#27AE60" },
  DC: { label: "繊細 × バランス派", icon: "✨", desc: "繊細な味 × バランス重視", color: "#2980B9" },
};

// ─── 体験の感想の定義 ────────────────────────────────────────────────────
//
//  「期待値」と「体験の結果」の意味的な対応で判定する。
//  数値差分ではなく、各組み合わせを直接マッピングする方式。
//
//  超越（+1）: 期待を上回る体験だった
//    low  + Good     = 低期待だったのに良かった
//    normal + Good   = 普通に期待して良かった
//    high + Good     = 高期待だったのにさらに上回った  ← 最高
//
//  一致（0）: 期待通りの体験だった
//    low  + Expected = 低期待で、まあその通りだった
//    normal + Expected = 普通に期待通り
//    high + Expected = 高期待で、その通りだった
//
//  乖離（-1）: 期待を下回る体験だった
//    low  + Below    = 低期待だったのにさらに下回った
//    normal + Below  = 普通に期待してガッカリ
//    high + Below    = 高期待だったのに裏切られた  ← 最悪
//
//  value: 超越=1 / 一致=0 / 乖離=-1（マッチスコア計算に使用）

const GAP_MAP = {
  low:    { Good: 1,  Expected: 0,  Below: -1 },
  normal: { Good: 1,  Expected: 0,  Below: -1 },
  high:   { Good: 1,  Expected: 0,  Below: -1 },
};

function calcGap(preExpect, result) {
  const value = GAP_MAP[preExpect]?.[result] ?? 0;
  if (value === 1)  return { label: "期待以上！", color: "#1abc9c", emoji: "🚀", value };
  if (value === 0)  return { label: "期待通り", color: "#f39c12", emoji: "✓",  value };
  return              { label: "ちょっと残念", color: "#e74c3c", emoji: "↓",  value };
}

function getGapStats(reviews) {
  if (!reviews.length) return null;
  const beyond = reviews.filter(r => calcGap(r.preExpect, r.result).value >= 1).length;
  const match = reviews.filter(r => calcGap(r.preExpect, r.result).value === 0).length;
  const below = reviews.filter(r => calcGap(r.preExpect, r.result).value < 0).length;
  return { beyond, match, below, total: reviews.length };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── RECOMMENDATION ENGINE ──────────────────────────────────────────────────────
//
//  設計方針：calcMatchScore() のシグネチャを固定し、中身だけ差し替えられる構造。
//
//  引数:  storeId   - 対象店舗ID
//         user      - ログイン中のユーザーオブジェクト
//         reviews   - 全レビュー配列
//         stores    - 全店舗配列（Level2以降で使用）
//
//  戻り値: { score: 0-100, reason: string, genre?: string } | null
//
//  ▼ Level1（現在）: ジャンル別タイプ重み付きマッチ率
//  ▼ Level2（予定）: 協調フィルタリング（ユーザー履歴ベース）
//  ▼ Level3（予定）: 多軸プロファイル × ジャンル × 協調 の複合スコア
// ═══════════════════════════════════════════════════════════════════════════════

// ── 共通ユーティリティ ────────────────────────────────────────────────────────

// ギャップを 0-100 の数値に変換（全レベル共通）
// ギャップを 0-100 のスコアに変換（全レベル共通）
//
// 「結果」だけでなく「期待値×結果」の組み合わせでスコアを決定する。
// 理由: 「high期待で期待通り(一致)」は十分に良い体験であり、
//       「low期待で期待通り(一致)」より高く評価すべきため。
//
//                 Good   Expected  Below
//   high期待  →  100      75        0
//   normal期待→   90      50       15
//   low期待   →   80      30       25
//
// ポイント:
//  - highExpected(75) > low+Good(80)の差は意図的。
//    「高い期待に応えた」は「低期待で驚いた」より安定した推薦根拠になる。
//  - low+Below(25) > high+Below(0): 低期待でさらに下回るのは相当悪いが、
//    high期待を完全に裏切るより軽微とみなす。

// ─── マッチスコアの点数テーブル ─────────────────────────────────────────────
//
//  スコアは -100〜+100 の範囲。マイナスは「積極的に合わない」を意味する。
//
//  設計思想：
//   - 加点側（Good）: 期待値が高くても超えた体験ほど価値が高い
//   - 中立（Expected）: 期待通り。high期待を満たすことは十分に良い
//   - 減点側（Below）: 期待値が高いほど失望度が深刻
//     「周りが美味しいと言っていたのに合わなかった」(high+Below)が最も強い警告
//
//                 Good   Expected  Below
//   high期待  →  100      75      -80
//   normal期待→   90      50      -40
//   low期待   →   80      20      -20

const GAP_SCORE_MAP = {
  high:   { Good: 100, Expected: 75, Below: -80 },
  normal: { Good: 90,  Expected: 50, Below: -40 },
  low:    { Good: 80,  Expected: 20, Below: -20 },
};

function gapToScore(review) {
  return GAP_SCORE_MAP[review.preExpect]?.[review.result] ?? 50;
}

// ── ヒット判定 ───────────────────────────────────────────────────────────────
//
//  ヒット = 「行って良かった」と言える体験
//
//  定義:
//   ① result が Good（期待値に関わらず期待を超えた）
//   ② preExpect が high かつ result が Expected
//      → 「高い評判を聞いて行って、実際に良かった」
//        これは推薦に値する体験であり、ヒットに含める
//
//  ノンヒット:
//   - normal/low + Expected: 普通または想定内の普通。積極推薦にはならない
//   - any + Below:           期待を下回った。明確なミス

function isHit(review) {
  if (review.result === "Good") return true;
  if (review.preExpect === "high" && review.result === "Expected") return true;
  return false;
}

// ヒット率 = ヒット件数 / 総件数（0〜1）
function calcHitRate(reviews) {
  if (!reviews.length) return null;
  return reviews.filter(isHit).length / reviews.length;
}

// スコア群の分散を計算してSPLIT判定する（全レベル共通）
// variance が高い = 合う人と合わない人がはっきり分かれる
function calcVariance(scores) {
  if (scores.length < 2) return 0;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  return scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
}

// SPLIT判定: 同タイプの体験が大きく二極化しているか
// variance >= 900 ≒ 標準偏差30以上（例: 80と20が混在）を SPLIT とみなす
const SPLIT_VARIANCE_THRESHOLD = 900;

// タイプ同士の親和度（全レベル共通）
//   完全一致=1.0 / 1軸一致=0.5 / 完全異=0.2
function typeAffinity(typeA, typeB) {
  if (typeA === typeB) return 1.0;
  if (typeA[0] === typeB[0] || typeA[1] === typeB[1]) return 0.5;
  return 0.2;
}

// ── Level 1: ジャンル別マッチ率 ───────────────────────────────────────────────
//
//  設計思想：
//   「自分の味覚感覚に合う店かどうか」を正直に反映することが最優先。
//   同タイプユーザーが期待を超えられたかを軸に判断し、
//   データが不足している場合のみ補助的な情報で補う。
//
//  優先順位:
//   ① 同タイプが2件以上  → 同タイプのみで判断（最も信頼性高）
//   ② 同タイプが1件      → 同タイプを重視しつつ隣接タイプで補完
//   ③ 同タイプが0件      → 隣接タイプ → 全タイプ → ジャンル傾向の順で補完
//      ※補完データを使う場合はスコアを中央値方向に引き寄せ、誤誘導を防ぐ
//
//  ジャンル補正は「同タイプデータが全くない場合」にのみ薄く加味する。
//  同タイプの声がある限り、それが最優先の判断材料。

function calcMatchScore_Level1(storeId, user, reviews, stores) {
  const store = stores.find(s => s.id === storeId);
  if (!store) return null;

  const storeReviews = reviews.filter(r => r.storeId === storeId);
  if (!storeReviews.length) return null;

  const sameTypeReviews = storeReviews.filter(r => r.userType === user.userType);
  const adjacentTypeReviews = storeReviews.filter(r =>
    r.userType !== user.userType &&
    (r.userType[0] === user.userType[0] || r.userType[1] === user.userType[1])
  );
  const otherTypeReviews = storeReviews.filter(r =>
    r.userType !== user.userType &&
    r.userType[0] !== user.userType[0] &&
    r.userType[1] !== user.userType[1]
  );

  // ══════════════════════════════════════════════════════════════════════
  // MATCHスコア算出：ヒット率 × 品質係数 − ミス率 × 深刻度係数
  //
  //  ヒット = Good（期待値問わず超えた）+ high+Expected（高期待に応えた）
  //  ミス   = any + Below
  //
  //  rawScore = hitRate × avgHitScore − missRate × avgMissWeight
  //
  //  例:
  //    全員 high+Good  → 1.0 × 100 − 0 = 100
  //    全員 high+Exp   → 1.0 × 75  − 0 = 75
  //    全員 low+Good   → 1.0 × 80  − 0 = 80
  //    50% high+Good / 50% high+Below
  //                   → 0.5×100 − 0.5×80 = +10 (UNCERTAIN / SPLIT)
  //    全員 high+Below → 0 − 1.0×80 = -80
  //
  //  これにより:
  //  - ヒット率が同じでも品質（期待値×結果の深さ）が反映される
  //  - ミスの深刻度（high期待ほど重い）が減点に直結する
  // ══════════════════════════════════════════════════════════════════════

  function calcRawScore(reviewList) {
    if (!reviewList.length) return null;

    const hits  = reviewList.filter(isHit);
    const misses = reviewList.filter(r => r.result === "Below");

    const hitRate  = hits.length / reviewList.length;
    const missRate = misses.length / reviewList.length;

    // ヒットの平均点（good/high+expectedそれぞれの点数）
    const avgHitScore = hits.length
      ? hits.reduce((sum, r) => sum + gapToScore(r), 0) / hits.length
      : 0;

    // ミスの平均深刻度（high+Below=-80, normal+Below=-40, low+Below=-20の絶対値）
    const avgMissSeverity = misses.length
      ? misses.reduce((sum, r) => sum + Math.abs(gapToScore(r)), 0) / misses.length
      : 0;

    return hitRate * avgHitScore - missRate * avgMissSeverity;
  }

  let rawScore;
  let confidence;
  const n = sameTypeReviews.length;

  if (n >= 3) {
    // ① 同タイプ3件以上 → 同タイプのみで純粋計算
    rawScore = calcRawScore(sameTypeReviews);
    confidence = n >= 5 ? "high" : "medium";

  } else if (n >= 1) {
    // ② 同タイプ1〜2件 → 同タイプを重視、隣接で薄く補完
    const sameRaw = calcRawScore(sameTypeReviews) ?? 0;
    const adjRaw  = calcRawScore(adjacentTypeReviews) ?? sameRaw;
    rawScore = sameRaw * 0.85 + adjRaw * 0.15;
    confidence = "low";

  } else if (adjacentTypeReviews.length > 0) {
    // ③ 同タイプなし → 隣接タイプで補完
    const adjRaw   = calcRawScore(adjacentTypeReviews) ?? 0;
    const otherRaw = calcRawScore(otherTypeReviews) ?? 0;
    rawScore = adjacentTypeReviews.length
      ? adjRaw * 0.8 + (otherTypeReviews.length ? otherRaw * 0.2 : 0)
      : 0;
    confidence = "estimate_adjacent";

  } else {
    // ④ データなし → 異タイプのジャンル傾向で推定
    const genreReviews = reviews.filter(r => {
      const s = stores.find(st => st.id === r.storeId);
      return s && s.category === store.category && r.storeId !== storeId;
    });
    rawScore = calcRawScore([...otherTypeReviews, ...genreReviews]) ?? 0;
    confidence = "estimate_genre";
  }

  // confidence に応じた収縮（ゼロ基準）
  const shrink = (s, f) => s * f;
  const displayScore =
    confidence === "high"             ? Math.round(rawScore) :
    confidence === "medium"           ? Math.round(shrink(rawScore, 0.95)) :
    confidence === "low"              ? Math.round(shrink(rawScore, 0.80)) :
    confidence === "estimate_adjacent"? Math.round(shrink(rawScore, 0.55)) :
                                        Math.round(shrink(rawScore, 0.40));

  // SPLIT判定: ヒット率とミス率が両方 25% 以上 → 二極化している
  const hitRate  = sameTypeReviews.filter(isHit).length / (n || 1);
  const missRate = sameTypeReviews.filter(r => r.result === "Below").length / (n || 1);
  const isSplit  = n >= 4 && hitRate >= 0.25 && missRate >= 0.25;

  return {
    score: displayScore,
    rawScore: Math.round(rawScore ?? 0),
    genre: store.category,
    confidence,
    hasSameTypeData: n > 0,
    sameTypeCount: n,
    isSplit,
    hitRate: Math.round(hitRate * 100),  // UI表示用
  };
}
// ── エンジン切替口（ここだけ変えれば Level2/3 に移行できる） ──────────────────
function calcMatchScore(storeId, user, reviews, stores) {
  // Level2 に切り替える時はここを calcMatchScore_Level2(...) に変更するだけ
  return calcMatchScore_Level1(storeId, user, reviews, stores);
}

// ── ジャンル別マッチサマリー（プロフィール画面用） ───────────────────────────
//   そのユーザーがジャンルごとにどの程度「合いやすい」かを集計
function calcGenreAffinityMap(user, reviews, stores) {
  const genreMap = {};
  stores.forEach(store => {
    const result = calcMatchScore(store.id, user, reviews, stores);
    if (!result) return;
    if (!genreMap[store.category]) genreMap[store.category] = { scores: [], genre: store.category };
    genreMap[store.category].scores.push(result.score);
  });
  return Object.values(genreMap).map(g => ({
    genre: g.genre,
    avgScore: Math.round(g.scores.reduce((a, b) => a + b, 0) / g.scores.length),
    storeCount: g.scores.length,
  })).sort((a, b) => b.avgScore - a.avgScore);
}

// ── スコア → 表示ラベル・色の変換 ───────────────────────────────────────────
//
//   100〜 75 : HIGH MATCH     緑   同タイプが安定して期待を超えている
//    74〜 50 : LIKELY MATCH   金   同タイプが概ね良い体験をしている
//    49〜  0 : UNCERTAIN      灰   データ不足または評価が中立
//    -1〜-49 : UNLIKELY MATCH 赤薄 同タイプがやや失望している傾向
//   -50〜    : BAD MATCH      赤濃 同タイプが明確に失望している

function scoreToDisplay(score, isSplit) {
  // SPLITはスコアがプラス圏（0以上）の場合のみ適用する
  // スコアがマイナスの場合は「合わない」方向が明確なので BAD/UNLIKELY を優先する
  // 例: BIが鮨でBelowが多い → 分散は大きいがスコアはマイナス → BAD MATCH
  if (isSplit && score >= 0) return { label: "評価が分かれる", color: "#e67e22", tier: "split"    };
  if (score >= 75)           return { label: "かなり合いそう", color: "#1abc9c", tier: "high"     };
  if (score >= 50)           return { label: "合いそう",       color: "#f39c12", tier: "likely"   };
  if (score >= 0)            return { label: "まだわからない", color: "#7a7268", tier: "uncertain" };
  if (score >= -49)          return { label: "合わないかも",   color: "#e74c3c", tier: "unlikely"  };
  return                            { label: "あまり合わない", color: "#c0392b", tier: "bad"       };
}

function MatchBadge({ matchResult, compact }) {
  if (!matchResult) return null;
  if (compact) {
    const col = matchResult.score >= 70 ? "#1abc9c" : matchResult.score >= 50 ? "#f39c12" : matchResult.score < 0 ? "#e74c3c" : "#7a7268";
    return (
      <span style={{ fontSize: 10, color: col, background: col + "15", border: `1px solid ${col}33`, padding: "2px 7px", borderRadius: 20, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
        {matchResult.label} {matchResult.score > 0 ? matchResult.score : ""}
      </span>
    );
  }
  const { score, genre, confidence, sameTypeCount, isSplit } = matchResult;

  const { label, color, tier } = scoreToDisplay(score, isSplit);
  const isNegative = score < 0;
  const isEstimate = confidence === "estimate_adjacent" || confidence === "estimate_genre";
  const absScore = Math.abs(score);

  // dataLabelもscoreToDisplayと同じ条件で「賛否両論」を出す
  // score<0の場合はisSplit=trueでも「賛否両論」ではなく通常のデータ件数表示
  const showAsSplit = isSplit && score >= 0;
  const dataLabel = showAsSplit
    ? `同タイプ${sameTypeCount}件・評価が分かれる`
    : sameTypeCount >= 1
    ? `同タイプ ${sameTypeCount}件のデータ`
    : isEstimate
    ? "推定値（同タイプデータなし）"
    : "参考値";

  // 円グラフ: マイナスは逆回転（減算方向）で表現
  const circumference = 87.96;
  const filled = (absScore / 100) * circumference;
  const dashArray = isSplit
    ? `${circumference * 0.35} 4 ${circumference * 0.35} ${circumference}`
    : isEstimate
    ? `${filled * 0.45} 3 ${filled * 0.45} ${circumference}`
    : sameTypeCount === 1
    ? `${filled * 0.7} 2 ${filled * 0.3} ${circumference}`
    : `${filled} ${circumference}`;

  // マイナスの場合: 円の背景をうっすら赤く塗り、弧を逆方向（警告感）
  const svgRotation = isNegative ? "rotate(90deg)" : "rotate(-90deg)";

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: color + (isNegative ? "22" : "18"),
      border: `1px solid ${isEstimate ? color + "44" : color + "77"}`,
      borderRadius: 3, padding: "5px 10px"
    }}>
      <div style={{ width: 36, height: 36, position: "relative", flexShrink: 0 }}>
        <svg viewBox="0 0 36 36" style={{ width: 36, height: 36, transform: svgRotation }}>
          {/* ベースリング */}
          <circle cx="18" cy="18" r="14" fill="none" stroke="#c9a96e33" strokeWidth="3" />
          {/* マイナスの場合は全周うっすら赤で警告感を出す */}
          {isNegative && (
            <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3" opacity="0.15"
              strokeDasharray={`${circumference} 0`} />
          )}
          {/* スコア弧 */}
          <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={dashArray} strokeLinecap="round"
            opacity={isEstimate ? 0.5 : 1}
          />
        </svg>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 8, color, fontWeight: 700,
          opacity: isEstimate ? 0.6 : 1
        }}>
          {isNegative ? "−" : ""}{absScore}
        </span>
      </div>
      <div>
        <p style={{ fontSize: 10, color, letterSpacing: "0.1em", fontWeight: 700, opacity: isEstimate ? 0.7 : 1 }}>
          {label}
        </p>
        <p style={{ fontSize: 10, color: sameTypeCount >= 1 ? "#7a7268" : "#9a9088", marginTop: 1 }}>
          {dataLabel}
        </p>
        {genre && <p style={{ fontSize: 9, color: "#c4b9ac", marginTop: 1 }}>{genre}ジャンル</p>}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [stores, setStores] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [pageParam, setPageParam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [notification, setNotification] = useState(null);
  const [follows, setFollows] = useState({});
  const [wishlists, setWishlists] = useState({});

  // ── Supabase初期ロード ──────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("profiles").select("*").eq("id", session.user.id).single()
          .then(({ data }) => {
            if (data) setCurrentUser({ ...data, email: session.user.email, userType: data.user_type, isAdmin: data.is_admin });
          });
      }
    });
    Promise.all([
      supabase.from("stores").select("*").order("id"),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
      supabase.from("follows").select("*"),
      supabase.from("wishlists").select("*"),
    ]).then(([storesRes, reviewsRes, profilesRes, followsRes, wishlistsRes]) => {
      setStores(storesRes.data?.length
        ? storesRes.data.map(s => ({ id: s.id, name: s.name, category: s.category, area: s.area, priceRange: s.price_range, description: s.description, image: s.image }))
        : INITIAL_STORES);
      setReviews(reviewsRes.data?.length >= 10
        ? reviewsRes.data.map(r => ({ id: r.id, storeId: r.store_id, userId: r.user_id, userName: r.user_name, userType: r.user_type, preExpect: r.pre_expect, result: r.result, comment: r.comment, date: r.date }))
        : [...INITIAL_REVIEWS, ...SAMPLE_REVIEWS]);
      const dbUsers = (profilesRes.data || []).map(p => ({ ...p, userType: p.user_type, isAdmin: p.is_admin }));
      setUsers([...dbUsers, ...SAMPLE_USERS]);
      if (followsRes.data) {
        const map = {};
        followsRes.data.forEach(f => { if (!map[f.follower_id]) map[f.follower_id] = []; map[f.follower_id].push(f.followee_id); });
        setFollows(map);
      }
      if (wishlistsRes.data) {
        const map = {};
        wishlistsRes.data.forEach(w => { if (!map[w.user_id]) map[w.user_id] = []; map[w.user_id].push(w.store_id); });
        setWishlists(map);
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setCurrentUser(null);
    });

    // stores のリアルタイム同期（admin が変更した内容を全クライアントに即時反映）
    // ※ RLS有効時はpayload.newが空になるため、イベント受信後にDBから再取得する方式を採用
    const storesChannel = supabase
      .channel("stores-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "stores" }, async (payload) => {
        const id = payload.new?.id || payload.old?.id;
        console.log("[stores realtime] UPDATE fired", { payloadNew: payload.new, payloadOld: payload.old, resolvedId: id });
        if (!id) { console.warn("[stores realtime] id not found in payload"); return; }
        const { data, error } = await supabase.from("stores").select("*").eq("id", id).single();
        console.log("[stores realtime] re-fetch result", { data, error });
        if (!data) return;
        setStores(prev => prev.map(store =>
          store.id === data.id
            ? { id: data.id, name: data.name, category: data.category, area: data.area, priceRange: data.price_range, description: data.description, image: data.image }
            : store
        ));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "stores" }, async (payload) => {
        const id = payload.new?.id;
        if (!id) return;
        const { data } = await supabase.from("stores").select("*").eq("id", id).single();
        if (!data) return;
        setStores(prev => {
          if (prev.some(s => s.id === data.id)) return prev;
          return [...prev, { id: data.id, name: data.name, category: data.category, area: data.area, priceRange: data.price_range, description: data.description, image: data.image }];
        });
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "stores" }, (payload) => {
        setStores(prev => prev.filter(store => store.id !== payload.old.id));
      })
      .subscribe((status, err) => {
        console.log("[stores realtime] status:", status, err || "");
      });

    // reviews のリアルタイム同期（ユーザー名変更・新規投稿・削除を全クライアントに反映）
    const reviewsChannel = supabase
      .channel("reviews-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "reviews" }, async (payload) => {
        const id = payload.new?.id || payload.old?.id;
        if (!id) return;
        const { data } = await supabase.from("reviews").select("*").eq("id", id).single();
        if (!data) return;
        setReviews(prev => prev.map(review =>
          review.id === data.id
            ? { id: data.id, storeId: data.store_id, userId: data.user_id, userName: data.user_name, userType: data.user_type, preExpect: data.pre_expect, result: data.result, comment: data.comment, date: data.date }
            : review
        ));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reviews" }, (payload) => {
        const r = payload.new;
        setReviews(prev => {
          // 既に楽観的更新で追加済みの場合は重複しない
          if (prev.some(review => review.id === r.id)) return prev;
          return [{ id: r.id, storeId: r.store_id, userId: r.user_id, userName: r.user_name, userType: r.user_type, preExpect: r.pre_expect, result: r.result, comment: r.comment, date: r.date }, ...prev];
        });
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "reviews" }, (payload) => {
        setReviews(prev => prev.filter(review => review.id !== payload.old.id));
      })
      .subscribe((status, err) => {
        console.log("[reviews realtime] status:", status, err || "");
      });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(storesChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, []);

  const navigate = (p, param = null) => {
    // ブラウザ履歴に追加
    window.history.pushState({ page: p, param }, "", `#${p}${param ? `/${param}` : ""}`);
    setPage(p); setPageParam(param); window.scrollTo(0, 0);
  };

  // ブラウザの戻る/進むボタン対応
  useEffect(() => {
    const handlePop = (e) => {
      if (e.state?.page) { setPage(e.state.page); setPageParam(e.state.param || null); window.scrollTo(0, 0); }
      else { setPage("home"); setPageParam(null); }
    };
    window.addEventListener("popstate", handlePop);
    // 初期状態をhistoryに登録
    window.history.replaceState({ page: "home", param: null }, "", "#home");
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  const notify = (msg, type = "success") => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); };
  const props = { navigate, stores, setStores, reviews, setReviews, currentUser, setCurrentUser, users, setUsers, pageParam, searchQ, setSearchQ, notify, follows, setFollows, wishlists, setWishlists };

  if (loading) return (
    <div style={{ fontFamily: "'IBM Plex Sans JP','Hiragino Kaku Gothic ProN','Helvetica Neue',Arial,sans-serif", background: "#faf8f5", minHeight: "100vh", color: "#2c2420", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontStyle: "italic", color: "#c9a96e", marginBottom: 16 }}>Gap Review</p>
        <p style={{ fontSize: 12, color: "#c4b9ac", letterSpacing: "0.2em" }}>LOADING...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'IBM Plex Sans JP','Hiragino Kaku Gothic ProN','Helvetica Neue',Arial,sans-serif", background: "#faf8f5", minHeight: "100vh", color: "#2c2420" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        html,body{background:#faf8f5!important;margin:0;padding:0}
        *{box-sizing:border-box;margin:0;padding:0}
        input,textarea,select{font-size:16px!important;font-family:inherit;-webkit-text-size-adjust:none;touch-action:manipulation}
        button{cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;transition:filter 0.15s ease,transform 0.1s ease}
        button:active{filter:brightness(0.75);transform:scale(0.97)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0c0c0e}::-webkit-scrollbar-thumb{background:#3a3028;border-radius:2px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.45s ease forwards}
        .hover-lift{transition:transform 0.2s,box-shadow 0.2s}.hover-lift:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.10)}
      `}</style>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: notification.type === "success" ? "#1abc9c" : "#e74c3c", color: "#fff", padding: "12px 22px", borderRadius: 4, animation: "slideDown 0.3s ease", fontSize: 14, letterSpacing: "0.05em" }}>
          {notification.msg}
        </div>
      )}

      <NavBar {...props} />
      <div style={{ paddingTop: 64 }}>
        {page === "home" && <HomePage {...props} />}
        {page === "search" && <SearchPage {...props} />}
        {page === "store" && <StorePage {...props} />}
        {page === "review-form" && <ReviewFormPage {...props} />}
        {page === "login" && <LoginPage {...props} />}
        {page === "register" && <RegisterPage {...props} stores={stores} />}
        {page === "profile" && <ProfilePage {...props} setReviews={setReviews} setFollows={setFollows} wishlists={wishlists} setWishlists={setWishlists} />}
        {page === "request-store" && <RequestStorePage {...props} />}
        {page === "add-store" && <AddStorePage {...props} />}
        {page === "users" && <UsersPage {...props} />}
        {page === "admin" && <AdminPage {...props} />}
        {page === "user-profile" && <UserProfilePage {...props} />}
      </div>
    </div>
  );
}

function NavBar({ navigate, currentUser, setCurrentUser, notify }) {
  const logout = async () => { await supabase.auth.signOut(); setCurrentUser(null); notify("ログアウトしました"); navigate("home"); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(250,248,245,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #c9a96e44", height: 64, display: "flex", alignItems: "center", padding: "0 16px", gap: 14 }}>
      <style>{`
        .nav-label-mobile { display: none; }
        .nav-label-pc { display: inline; }
        @media (max-width: 640px) {
          .nav-label-mobile { display: inline; }
          .nav-label-pc { display: none; }
        }
      `}</style>
      <button onClick={() => navigate("home")} style={{ background: "none", border: "none", color: "#2c2420", fontSize: 16, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>Gap Review</button>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: "auto" }}>
        <button onClick={() => navigate("search")} style={{ background: "none", border: "none", color: "#8a8278", fontSize: 13, lineHeight: 1.3, textAlign: "center" }}>
          <span className="nav-label-pc">店舗一覧</span>
          <span className="nav-label-mobile">店舗<br />一覧</span>
        </button>
        {currentUser ? (
          <>
            <button onClick={() => navigate("add-store")} style={{ background: "none", border: "none", color: "#8a8278", fontSize: 13, lineHeight: 1.3, textAlign: "center" }}>
              <span className="nav-label-pc">店舗追加</span>
              <span className="nav-label-mobile">店舗<br />追加</span>
            </button>
            <button onClick={() => navigate("users")} style={{ background: "none", border: "none", color: "#8a8278", fontSize: 13 }}>
              <span className="nav-label-pc">ユーザー一覧</span>
              <span className="nav-label-mobile">ユーザー</span>
            </button>
            <button onClick={() => navigate("profile")} style={{ background: "none", border: "none", color: "#8a8278", fontSize: 13, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</button>
            {currentUser.isAdmin && <button onClick={() => navigate("admin")} style={{ background: "none", border: "1px solid #c9a96e", color: "#c9a96e", padding: "4px 10px", fontSize: 11, borderRadius: 2 }}>管理</button>}
            <button onClick={logout} style={{ background: "none", border: "1px solid #c9a96e44", color: "#7a7268", padding: "4px 10px", fontSize: 11, borderRadius: 2 }}>ログアウト</button>
          </>
        ) : (
          <button onClick={() => navigate("login")} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", fontSize: 12, letterSpacing: "0.1em", padding: "8px 16px", borderRadius: 2, fontWeight: 600 }}>ログイン</button>
        )}
      </div>
    </nav>
  );
}

function HomePage({ navigate, stores, reviews, currentUser, follows, users, wishlists, setWishlists }) {
  // ── ログイン時: レコメンド × フォロー新着の混在フィード ──
  const [feedFilter, setFeedFilter] = useState("all");

  if (currentUser) {
    const myFollowingIds = follows?.[currentUser.id] || [];
    const myWishlistIds = wishlists?.[currentUser.id] || [];

    // レコメンド店舗（未訪問・マッチ率60%以上）
    const visitedIds = new Set(reviews.filter(r => r.userId === currentUser.id).map(r => r.storeId));
    const recItems = stores
      .filter(s => !visitedIds.has(s.id))
      .map(s => ({ ...s, matchResult: calcMatchScore(s.id, currentUser, reviews, stores) }))
      .filter(s => s.matchResult !== null && s.matchResult.score >= 60)
      .sort((a, b) => b.matchResult.score - a.matchResult.score)
      .slice(0, 10)
      .map(s => ({ type: "recommend", data: s }));

    // フォロー中の新着レビュー
    const followItems = reviews
      .filter(r => myFollowingIds.includes(r.userId))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10)
      .map(r => ({ type: "follow", data: r }));

    // 同タイプ・フォローしていないユーザーの新着（自分の投稿も除く）
    const sameTypeItems = reviews
      .filter(r =>
        r.userType === currentUser.userType &&
        r.userId !== currentUser.id &&
        !myFollowingIds.includes(r.userId)
      )
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8)
      .map(r => ({ type: "sametype", data: r }));

    // ウィッシュリスト（未レビューのもの）→「行きましたか？」カード
    const wishlistItems = myWishlistIds
      .filter(sid => !visitedIds.has(sid))
      .map(sid => stores.find(s => s.id === sid))
      .filter(Boolean)
      .slice(0, 5)
      .map(s => ({ type: "wishlist", data: s }));

    // 混在パターン: レコメンド→フォロー→同タイプ→（ウィッシュリストを4枚に1枚差し込む）
    const feed = [];
    const recs = [...recItems];
    const follows_ = [...followItems];
    const sameTypes = [...sameTypeItems];
    const wishes = [...wishlistItems];
    let cycle = 0;
    while (recs.length > 0 || follows_.length > 0 || sameTypes.length > 0 || wishes.length > 0) {
      // 4サイクルに1回ウィッシュリストを差し込む
      if (cycle % 4 === 3 && wishes.length > 0) {
        feed.push(wishes.shift());
      } else {
        const pattern = cycle % 3;
        if (pattern === 0 && recs.length > 0) feed.push(recs.shift());
        else if (pattern === 1 && follows_.length > 0) feed.push(follows_.shift());
        else if (pattern === 2 && sameTypes.length > 0) feed.push(sameTypes.shift());
        else {
          if (recs.length > 0) feed.push(recs.shift());
          else if (follows_.length > 0) feed.push(follows_.shift());
          else if (sameTypes.length > 0) feed.push(sameTypes.shift());
          else if (wishes.length > 0) feed.push(wishes.shift());
        }
      }
      cycle++;
    }

    const FeedLabel = ({ type }) => {
      const config = {
        recommend: { color: "#c9a96e", text: "✦ あなたへのレコメンド" },
        follow:    { color: "#7a9acc", text: "● フォロー中の新着" },
        sametype:  { color: "#9a7acc", text: "◈ 同じタイプの新着" },
        wishlist:  { color: "#e67e22", text: "🍽️ 行ってみたかったお店" },
      };
      const c = config[type] || config.follow;
      return (
        <p style={{
          fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
          color: c.color, marginBottom: 6, paddingLeft: 2,
          fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic",
        }}>{c.text}</p>
      );
    };

    return (
      <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <SectionLabel>For You</SectionLabel>
          <button onClick={() => navigate("review-form")} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "10px 22px", fontSize: 12, letterSpacing: "0.12em", fontWeight: 600, borderRadius: 2 }}>レビューを書く +</button>
        </div>

        {/* フィルタータブ */}
        <div style={{ display: "flex", gap: 2, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { key: "all",       label: "すべて",               color: "#7a7268" },
            { key: "recommend", label: "✦ レコメンド",          color: "#c9a96e" },
            { key: "follow",    label: "● フォロー中",          color: "#7a9acc" },
            { key: "sametype",  label: "◈ 同タイプ",            color: "#9a7acc" },
            { key: "wishlist",  label: "🍽️ 行きたい",           color: "#e67e22" },
          ].map(t => (
            <button key={t.key} onClick={() => setFeedFilter(t.key)} style={{
              background: feedFilter === t.key ? t.color + "22" : "#ffffff",
              border: `1px solid ${feedFilter === t.key ? t.color : "#c9a96e44"}`,
              color: feedFilter === t.key ? t.color : "#7a7268",
              padding: "6px 14px", fontSize: 11, borderRadius: 2,
              letterSpacing: "0.06em", transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {(() => {
          // 「行きたい」タブはwishlistIds全件を直接表示（訪問済みも含む）
          const wishlistStores = myWishlistIds
            .map(sid => stores.find(s => s.id === sid))
            .filter(Boolean);
          const visibleFeed = feedFilter === "wishlist"
            ? wishlistStores.map(s => ({ type: "wishlist", data: s }))
            : feedFilter === "all"
              ? feed
              : feed.filter(item => item.type === feedFilter);
          return visibleFeed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9a9088" }}>
            <p style={{ fontSize: 36, marginBottom: 14 }}>🍽️</p>
            <p style={{ fontSize: 14, marginBottom: 8 }}>フィードがまだありません</p>
            <p style={{ fontSize: 12, color: "#c4b9ac", lineHeight: 1.9 }}>
              ユーザーをフォローするか、<br />レビューを投稿するとフィードが充実します
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
              <button onClick={() => navigate("users")} style={{ background: "none", border: "1px solid #c9a96e44", color: "#c9a96e", padding: "10px 20px", fontSize: 12, borderRadius: 2 }}>ユーザーを探す</button>
              <button onClick={() => navigate("search")} style={{ background: "none", border: "1px solid #c9a96e44", color: "#2c2420", padding: "10px 20px", fontSize: 12, borderRadius: 2 }}>店舗を探す</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {visibleFeed.map((item, i) => {
              if (item.type === "recommend") {
                const store = item.data;
                return (
                  <div key={"rec-" + store.id + "-" + i}>
                    <FeedLabel type="recommend" />
                    <StoreCard store={store} reviews={reviews.filter(r => r.storeId === store.id)} navigate={navigate} currentUser={currentUser} allReviews={reviews} allStores={stores} precomputedResult={store.matchResult} wishlists={wishlists} setWishlists={setWishlists} />
                  </div>
                );
              } else if (item.type === "wishlist") {
                const store = item.data;
                const matchResult = calcMatchScore(store.id, currentUser, reviews, stores);
                return (
                  <div key={"wish-" + store.id + "-" + i}>
                    <FeedLabel type="wishlist" />
                    <div style={{ background: "#ffffff", border: "1px solid #e67e2244", borderRadius: 3, padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <span style={{ fontSize: 28 }}>{store.image}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 2 }}>{store.name}</p>
                          <p style={{ fontSize: 11, color: "#7a7268" }}>{store.area} / {store.category}</p>
                        </div>
                        {matchResult && <MatchBadge matchResult={matchResult} />}
                      </div>
                      <p style={{ fontSize: 12, color: "#e67e22", fontWeight: 600, marginBottom: 12 }}>👀 行きましたか？感想を残しましょう</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => navigate("review-form", store.id)} style={{ flex: 1, background: "#e67e22", border: "none", color: "#fff", padding: "10px", fontSize: 12, fontWeight: 600, borderRadius: 2, letterSpacing: "0.08em" }}>
                          レビューを書く →
                        </button>
                        <button onClick={() => navigate("store", store.id)} style={{ background: "none", border: "1px solid #e67e2244", color: "#e67e22", padding: "10px 14px", fontSize: 12, borderRadius: 2 }}>
                          お店を見る
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const r = item.data;
                const store = stores.find(s => s.id === r.storeId);
                const matchResult = store ? calcMatchScore(store.id, currentUser, reviews, stores) : null;
                return (
                  <div key={item.type + "-" + r.id + "-" + i} onClick={() => navigate("store", r.storeId)} style={{ cursor: "pointer" }}>
                    <FeedLabel type={item.type} />
                    <ReviewCard review={r} storeName={store?.name} showStore currentUserType={currentUser.userType} navigate={navigate} matchResult={matchResult} />
                  </div>
                );
              }
            })}
          </div>
        );
        })()}
      </div>
    );
  }

  // ── 未ログイン時: ヒーロー + How It Works + 注目の店舗 ──
  return (
    <div className="fade-in">
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%,rgba(201,169,110,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 12, color: "#c9a96e", letterSpacing: "0.25em", marginBottom: 24, textTransform: "uppercase" }}>Gap Review</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(34px,7vw,76px)", fontWeight: 300, lineHeight: 1.1, color: "#2c2420", marginBottom: 28, letterSpacing: "-0.02em" }}>
          あなたの舌に<br /><em style={{ fontStyle: "italic", color: "#c9a96e" }}>ピッタリ</em>のお店が<br />見つかる
        </h1>
        <p style={{ fontSize: 14, color: "#7a7268", maxWidth: 420, lineHeight: 1.9, letterSpacing: "0.06em", marginBottom: 48 }}>
          点数評価に依存しない新しいレビューシステム。<br />あなたの「期待」と「体験」のギャップが、真の評価軸になる。
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => navigate("search")} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "14px 32px", fontSize: 13, letterSpacing: "0.15em", fontWeight: 600 }}>店舗を探す</button>
          <button onClick={() => navigate("login")} style={{ background: "none", border: "1px solid #c9a96e44", color: "#2c2420", padding: "14px 32px", fontSize: 13, letterSpacing: "0.15em" }}>レビューを書く</button>
        </div>
      </div>

      <div style={{ padding: "60px 20px", maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel>こんなふうに使います</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 2, marginTop: 28 }}>
          {[["01","訪問前に期待値を決める","行く前にどのくらい期待してる？を記録"],["02","食べたらひと言","期待以上？期待通り？ちょっと残念？の3択で報告"],["03","ズレが見える","期待とのズレが「期待以上・期待通り・ちょっと残念」で自動表示"]].map(([n,t,d]) => (
            <div key={n} style={{ background: "#ffffff", padding: "28px 22px", borderLeft: "1px solid #c9a96e44" }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, color: "#d8d0c4", fontWeight: 300, marginBottom: 12 }}>{n}</p>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, letterSpacing: "0.06em" }}>{t}</h3>
              <p style={{ fontSize: 12, color: "#6a6258", lineHeight: 1.8, letterSpacing: "0.04em" }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "40px 20px 80px", maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel>注目の店舗</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14, marginTop: 28 }}>
          {stores.slice(0, 3).map(store => <StoreCard key={store.id} store={store} reviews={reviews.filter(r => r.storeId === store.id)} navigate={navigate} currentUser={currentUser} allReviews={reviews} allStores={stores} wishlists={wishlists} setWishlists={setWishlists} />)}
        </div>
      </div>
    </div>
  );
}

function SearchPage({ navigate, stores, reviews, currentUser, searchQ, setSearchQ, wishlists, setWishlists }) {
  const [localQ, setLocalQ] = useState(searchQ);
  const [sortBy, setSortBy] = useState(currentUser ? "match" : "reviews");
  const [filterCat, setFilterCat] = useState("all");
  const categories = ["all", ...new Set(stores.map(s => s.category))];

  const storesWithScore = stores.map(s => ({
    ...s,
    matchResult: currentUser ? calcMatchScore(s.id, currentUser, reviews, stores) : null,
    reviewCount: reviews.filter(r => r.storeId === s.id).length,
  }));

  const filtered = storesWithScore
    .filter(s => {
      const q = localQ.toLowerCase();
      return (!q || s.name.includes(q) || s.category.includes(q) || s.area.includes(q)) && (filterCat === "all" || s.category === filterCat);
    })
    .sort((a, b) => {
      if (sortBy === "match" && currentUser) return ((b.matchResult?.score) ?? 0) - ((a.matchResult?.score) ?? 0);
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      if (sortBy === "newest") return b.id - a.id;
      if (sortBy === "latest-review") {
        const bLatest = reviews.filter(r => r.storeId === b.id).sort((x,y) => y.date.localeCompare(x.date))[0]?.date || "";
        const aLatest = reviews.filter(r => r.storeId === a.id).sort((x,y) => y.date.localeCompare(x.date))[0]?.date || "";
        return bLatest.localeCompare(aLatest);
      }
      return a.name.localeCompare(b.name, "ja");
    });

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px" }}>
      <SectionLabel>店舗一覧</SectionLabel>
      {currentUser ? (
        <div style={{ marginTop: 14, padding: "10px 14px", background: "#ffffff", border: "1px solid #c9a96e44", borderRadius: 3, display: "flex", alignItems: "center", gap: 8 }}>
          <span>{USER_TYPES[currentUser.userType]?.icon}</span>
          <p style={{ fontSize: 12, color: "#7a7268" }}>
            <span style={{ color: USER_TYPES[currentUser.userType]?.color }}>{USER_TYPES[currentUser.userType]?.label}</span> のあなたとの相性順に表示中
          </p>
        </div>
      ) : (
        <button onClick={() => navigate("login")}
          style={{ marginTop: 14, width: "100%", background: "linear-gradient(90deg,#f5f0e8 0%,#ede8df 100%)",
            border: "1px solid #c9a96e44", borderRadius: 3, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px dashed #c9a96e55",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>?</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: "#c9a96e", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 2 }}>
              あなたの好みに合うお店を発見しよう
            </p>
            <p style={{ fontSize: 11, color: "#7a7268" }}>
              ログインすると各店舗との相性が表示されます
            </p>
          </div>
          <span style={{ fontSize: 12, color: "#c9a96e", fontWeight: 600, letterSpacing: "0.08em", flexShrink: 0 }}>
            ログイン →
          </span>
        </button>
      )}
      <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={localQ} onChange={e => { setLocalQ(e.target.value); setSearchQ(e.target.value); }} placeholder="店名・エリア・カテゴリ..." style={{ flex: 1, minWidth: 150, background: "#f5f0e8", border: "1px solid #c9a96e44", borderRadius: 3, padding: "10px 14px", color: "#2c2420", outline: "none" }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ background: "#f5f0e8", border: "1px solid #c9a96e44", color: "#8a8278", padding: "10px 12px", outline: "none", borderRadius: 3 }}>
          {categories.map(c => <option key={c} value={c}>{c === "all" ? "全カテゴリ" : c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "#f5f0e8", border: "1px solid #c9a96e44", color: "#8a8278", padding: "10px 12px", outline: "none", borderRadius: 3 }}>
          {currentUser && <option value="match">相性順</option>}
          <option value="reviews">レビュー数順</option>
          <option value="newest">新店舗順</option>
          <option value="latest-review">新口コミ順</option>
          <option value="name">名前順</option>
        </select>
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: "#9a9088", letterSpacing: "0.08em" }}>{filtered.length} 件</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, marginTop: 12 }}>
        {filtered.map(store => <StoreCard key={store.id} store={store} reviews={reviews.filter(r => r.storeId === store.id)} navigate={navigate} currentUser={currentUser} allReviews={reviews} allStores={stores} precomputedResult={store.matchResult} wishlists={wishlists} setWishlists={setWishlists} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#9a9088" }}>
          <p style={{ fontSize: 36, marginBottom: 14 }}>🔍</p>
          <p style={{ fontSize: 14, letterSpacing: "0.06em" }}>該当する店舗が見つかりません</p>
          <button onClick={() => navigate("add-store")} style={{ marginTop: 18, background: "none", border: "1px solid #c9a96e44", color: "#c9a96e", padding: "10px 22px", fontSize: 12, letterSpacing: "0.1em", borderRadius: 2 }}>店舗を追加する</button>
        </div>
      )}
    </div>
  );
}

function StorePage({ navigate, stores, setStores, reviews, setReviews, pageParam, currentUser, notify, wishlists, setWishlists }) {
  const [sameTypeOnly, setSameTypeOnly] = useState(false);
  const store = stores.find(s => s.id === pageParam);
  if (!store) return <div style={{ padding: 80, textAlign: "center", color: "#9a9088" }}>店舗が見つかりません</div>;
  const storeReviews = reviews.filter(r => r.storeId === pageParam);
  // フィルター適用（同タイプのみ表示）
  const displayReviews = sameTypeOnly && currentUser
    ? storeReviews.filter(r => r.userType === currentUser.userType)
    : storeReviews;
  const stats = getGapStats(storeReviews);
  const matchResult = currentUser ? calcMatchScore(pageParam, currentUser, reviews, stores) : null;

  // ── タイプ別ヒット率 ──
  // ヒット = Good + high期待で期待通り（high+Expected）
  // 超越率（Goodのみ）ではなく、推薦できる体験の割合を表示する
  const typeBreakdown = Object.keys(USER_TYPES).map(type => {
    const tr = storeReviews.filter(r => r.userType === type);
    const hits = tr.filter(r => isHit(r)).length;
    const misses = tr.filter(r => r.result === "Below").length;
    return {
      type,
      count: tr.length,
      hitRate:  tr.length > 0 ? Math.round(hits   / tr.length * 100) : null,
      missRate: tr.length > 0 ? Math.round(misses / tr.length * 100) : null,
    };
  }).filter(t => t.count > 0);

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: "0 auto", padding: "40px 16px" }}>
      <p style={{ fontSize: 11, color: "#9a9088", letterSpacing: "0.15em", marginBottom: 12 }}>{store.area} / {store.category} / {store.priceRange}</p>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ fontSize: 50, lineHeight: 1 }}>{store.image}</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,5vw,36px)", fontWeight: 400, letterSpacing: "0.04em", marginBottom: 10 }}>{store.name}</h1>
          <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.8, letterSpacing: "0.04em" }}>{store.description}</p>
          {currentUser?.isAdmin && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => navigate("admin")} style={{ background: "none", border: "1px solid #c9a96e44", color: "#c9a96e", padding: "4px 12px", fontSize: 11, borderRadius: 2 }}>✏️ 編集</button>
              <button onClick={async () => {
                if (!window.confirm(`「${store.name}」を削除しますか？関連するレビューも全て削除されます。`)) return;
                const { error } = await supabase.from("stores").delete().eq("id", store.id);
                if (error) { notify("削除に失敗しました", "error"); return; }
                await supabase.from("reviews").delete().eq("store_id", store.id);
                setStores(prev => prev.filter(s => s.id !== store.id));
                setReviews(prev => prev.filter(r => r.storeId !== store.id));
                notify("店舗を削除しました");
                navigate("search");
              }} style={{ background: "none", border: "1px solid #4a2020", color: "#e74c3c", padding: "4px 12px", fontSize: 11, borderRadius: 2 }}>🗑 削除</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        {currentUser && matchResult ? (
          <>
            <MatchBadge matchResult={matchResult} />
            <p style={{ fontSize: 11, color: "#9a9088", marginTop: 6 }}>
              {USER_TYPES[currentUser.userType]?.label} タイプ・{matchResult.sameTypeCount}件のデータを元に算出
            </p>
          </>
        ) : !currentUser ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10,
            background: "#f5f0e8", border: "1px dashed #c9a96e44", borderRadius: 3, padding: "10px 14px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2px dashed #c9a96e44",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 18, color: "#c4b9ac" }}>?</span>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#c4b9ac", letterSpacing: "0.1em", fontWeight: 600 }}>相性</p>
              <p style={{ fontSize: 11, color: "#d8d0c4", marginTop: 2 }}>ログインすると表示されます</p>
            </div>
          </div>
        ) : null}
        {currentUser && matchResult && (
          <>
            {matchResult.isSplit && matchResult.score >= 0 && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#e67e2211", border: "1px solid #e67e2244", borderRadius: 3 }}>
                <p style={{ fontSize: 12, color: "#e67e22", fontWeight: 600, marginBottom: 4 }}>⚡ このお店、タイプ内でも評価が分かれています</p>
                <p style={{ fontSize: 11, color: "#7a7268", lineHeight: 1.7 }}>
                  同じタイプの人の中でも「最高だった」「イマイチだった」が分かれているお店です。
                  その日のコンディションや好みで体験が変わりやすいかもしれません。
                </p>
              </div>
            )}
            {!(matchResult.isSplit && matchResult.score >= 0) && matchResult.score <= -50 && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#c0392b11", border: "1px solid #c0392b44", borderRadius: 3 }}>
                <p style={{ fontSize: 12, color: "#c0392b", fontWeight: 600, marginBottom: 4 }}>⚠ あなたのタイプには合わないことが多いお店です</p>
                <p style={{ fontSize: 11, color: "#7a7268", lineHeight: 1.7 }}>
                  同じタイプの人の多くが「ちょっと残念」と感じているお店です。
                  世間の評判が高くても、あなたの好みとは合わない可能性があります。レビューをよく読んでから行くのがおすすめです。
                </p>
              </div>
            )}
            {!(matchResult.isSplit && matchResult.score >= 0) && matchResult.score > -50 && matchResult.score < 0 && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#e74c3c11", border: "1px solid #e74c3c33", borderRadius: 3 }}>
                <p style={{ fontSize: 12, color: "#e74c3c", fontWeight: 600, marginBottom: 4 }}>📋 やや合わない傾向があります</p>
                <p style={{ fontSize: 11, color: "#7a7268", lineHeight: 1.7 }}>
                  同じタイプの人に「ちょっと残念」が出てきているお店です。
                  期待しすぎず、レビューを参考にしてから行くといいかもしれません。
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {stats && (
        <div style={{ background: "#ffffff", border: "1px solid #c9a96e44", borderRadius: 4, padding: "22px 24px", marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#9a9088", marginBottom: 16, textTransform: "uppercase" }}>みんなの感想</p>
          <div style={{ display: "flex" }}>
            {[["期待以上！","#1abc9c",stats.beyond],["期待通り","#f39c12",stats.match],["ちょっと残念","#e74c3c",stats.below]].map(([label,color,count]) => (
              <div key={label} style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRight: "1px solid #c9a96e44" }}>
                <p style={{ fontSize: 24, fontFamily: "'Cormorant Garamond',serif", color, marginBottom: 4 }}>{count}</p>
                <p style={{ fontSize: 11, color, letterSpacing: "0.1em" }}>{label}</p>
                <p style={{ fontSize: 10, color: "#9a9088", marginTop: 3 }}>{Math.round(count / stats.total * 100)}%</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, height: 4, background: "#c9a96e22", borderRadius: 2, overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${stats.beyond / stats.total * 100}%`, background: "#1abc9c" }} />
            <div style={{ width: `${stats.match / stats.total * 100}%`, background: "#f39c12" }} />
            <div style={{ width: `${stats.below / stats.total * 100}%`, background: "#e74c3c" }} />
          </div>

          {typeBreakdown.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "#9a9088", marginBottom: 4 }}>タイプ別「よかった率」</p>
              <p style={{ fontSize: 10, color: "#c4b9ac", marginBottom: 12 }}>
                よかった = 期待以上 + 高い期待にしっかり応えた体験
              </p>
              {(() => {
                const best = typeBreakdown.filter(t => t.count >= 2).sort((a, b) => b.hitRate - a.hitRate)[0];
                if (!best || best.hitRate < 50) return null;
                const bestType = USER_TYPES[best.type];
                return (
                  <div style={{ background: bestType.color + "11", border: `1px solid ${bestType.color}33`, borderRadius: 3, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{bestType.icon}</span>
                    <p style={{ fontSize: 12, color: bestType.color, letterSpacing: "0.04em" }}>
                      <span style={{ fontWeight: 600 }}>{bestType.label}</span> タイプの人に一番刺さっています（よかった率 {best.hitRate}%）
                    </p>
                  </div>
                );
              })()}
              {typeBreakdown.map(t => {
                const ut = USER_TYPES[t.type];
                const isMe = currentUser?.userType === t.type;
                const hitColor = t.hitRate >= 75 ? "#1abc9c" : t.hitRate >= 50 ? "#f39c12" : "#e74c3c";
                return (
                  <div key={t.type} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 14, width: 20 }}>{ut.icon}</span>
                      <span style={{ fontSize: 11, color: isMe ? ut.color : "#7a7268", flex: 1, letterSpacing: "0.03em" }}>
                        {ut.label}{isMe ? " 👈" : ""}
                      </span>
                      <span style={{ fontSize: 11, color: isMe ? hitColor : "#7a7268", fontWeight: isMe ? 600 : 400 }}>
                        よかった {t.hitRate}%
                      </span>
                      {t.missRate > 0 && (
                        <span style={{ fontSize: 10, color: "#e74c3c" }}>/ 残念 {t.missRate}%</span>
                      )}
                      <span style={{ fontSize: 10, color: "#c4b9ac", width: 24, textAlign: "right" }}>{t.count}件</span>
                    </div>
                    {/* ヒット率バー（緑）＋ミス率バー（赤）を重ねて表示 */}
                    <div style={{ marginLeft: 28, height: 4, background: "#c9a96e22", borderRadius: 2, overflow: "hidden", display: "flex" }}>
                      <div style={{ width: `${t.hitRate}%`, height: "100%", background: isMe ? hitColor : "#c4b9ac", transition: "width 0.4s" }} />
                      <div style={{ width: `${t.missRate}%`, height: "100%", background: "#e74c3c55" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 32, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => navigate(currentUser ? "review-form" : "login", pageParam)} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "12px 28px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>レビューを書く</button>
        {currentUser && (() => {
          const isWished = (wishlists?.[currentUser.id] || []).includes(store.id);
          const toggleWishlist = async () => {
            if (isWished) {
              await supabase.from("wishlists").delete().eq("user_id", currentUser.id).eq("store_id", store.id);
              setWishlists(prev => ({ ...prev, [currentUser.id]: (prev[currentUser.id] || []).filter(id => id !== store.id) }));
            } else {
              await supabase.from("wishlists").insert({ user_id: currentUser.id, store_id: store.id });
              setWishlists(prev => ({ ...prev, [currentUser.id]: [...(prev[currentUser.id] || []), store.id] }));
            }
          };
          return (
            <button onClick={toggleWishlist} style={{
              background: isWished ? "#e67e2222" : "#ffffff",
              border: `1px solid ${isWished ? "#e67e22" : "#c9a96e44"}`,
              color: isWished ? "#e67e22" : "#7a7268",
              padding: "12px 20px", fontSize: 13, borderRadius: 2, display: "flex", alignItems: "center", gap: 6,
            }}>
              {isWished ? "🍽️ 行ってみたいリスト登録済み" : "♡ 行ってみたい"}
            </button>
          );
        })()}
      </div>

      {/* ── 口コミフィルター ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <SectionLabel>みんなの感想 ({sameTypeOnly && currentUser ? `${displayReviews.length} / ${storeReviews.length}` : storeReviews.length})</SectionLabel>
        {currentUser && storeReviews.length > 0 && (
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
            <div
              onClick={() => setSameTypeOnly(v => !v)}
              style={{
                width: 36, height: 20, borderRadius: 10, flexShrink: 0,
                background: sameTypeOnly ? USER_TYPES[currentUser.userType]?.color : "#d8d0c4",
                position: "relative", transition: "background 0.2s",
                border: `1px solid ${sameTypeOnly ? USER_TYPES[currentUser.userType]?.color : "#c9a96e33"}`,
              }}
            >
              <div style={{
                position: "absolute", top: 2, left: sameTypeOnly ? 17 : 2,
                width: 14, height: 14, borderRadius: "50%", background: "#2c2420",
                transition: "left 0.2s",
              }} />
            </div>
            <span style={{ fontSize: 11, color: sameTypeOnly ? USER_TYPES[currentUser.userType]?.color : "#7a7268", letterSpacing: "0.05em" }}>
              {USER_TYPES[currentUser.userType]?.icon} 同タイプのみ表示
            </span>
          </label>
        )}
      </div>

      {displayReviews.length === 0 ? (
        <p style={{ marginTop: 16, color: "#9a9088", fontSize: 14 }}>
          {sameTypeOnly ? "同じタイプの感想はまだありません" : "まだ感想が投稿されていません"}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {displayReviews.map(r => <ReviewCard key={r.id} review={r} currentUserType={currentUser?.userType} navigate={navigate} isAdmin={currentUser?.isAdmin} onAdminDelete={async (reviewId) => {
            if (!window.confirm("このレビューを削除しますか？")) return;
            const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
            if (error) { notify("削除に失敗しました", "error"); return; }
            setReviews(prev => prev.filter(rv => rv.id !== reviewId));
            notify("レビューを削除しました");
          }} />)}
        </div>
      )}
    </div>
  );
}

function ReviewFormPage({ navigate, stores, reviews, setReviews, currentUser, pageParam, notify }) {
  const [storeId, setStoreId] = useState(pageParam || "");
  const [storeQ, setStoreQ] = useState(pageParam ? (stores.find(s => s.id === pageParam)?.name || "") : "");
  const [showSug, setShowSug] = useState(false);
  const [preExpect, setPreExpect] = useState("");
  const [result, setResult] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) { navigate("login"); return null; }
  const selectedStore = stores.find(s => s.id === storeId);
  const suggestions = storeQ && !selectedStore ? stores.filter(s => s.name.includes(storeQ) || s.category.includes(storeQ) || s.area.includes(storeQ)).slice(0, 5) : [];
  const gap = preExpect && result ? calcGap(preExpect, result) : null;

  const handleSubmit = async () => {
    if (!storeId || !preExpect || !result) { notify("必須項目を入力してください", "error"); return; }
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase.from("reviews").insert({
      store_id: parseInt(storeId), user_id: currentUser.id, user_name: currentUser.name,
      user_type: currentUser.userType || currentUser.user_type, pre_expect: preExpect, result, comment, date: today,
    }).select().single();
    if (error) { notify("投稿に失敗しました", "error"); return; }
    setReviews(prev => [{ id: data.id, storeId: data.store_id, userId: data.user_id, userName: data.user_name, userType: data.user_type, preExpect: data.pre_expect, result: data.result, comment: data.comment, date: data.date }, ...prev]);
    setSubmitted(true); notify("レビューを投稿しました");
  };

  if (submitted) return (
    <div className="fade-in" style={{ maxWidth: 500, margin: "100px auto", padding: "0 20px", textAlign: "center" }}>
      <p style={{ fontSize: 44, marginBottom: 22 }}>✓</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>レビューを投稿しました</h2>
      {gap && <p style={{ fontSize: 18, color: gap.color, letterSpacing: "0.1em", marginBottom: 28 }}>{gap.emoji} {gap.label}</p>}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate("store", storeId)} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "12px 26px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>店舗ページへ</button>
        <button onClick={() => { setSubmitted(false); setStoreId(""); setStoreQ(""); setPreExpect(""); setResult(""); setComment(""); }} style={{ background: "none", border: "1px solid #c9a96e44", color: "#2c2420", padding: "12px 26px", fontSize: 13 }}>続けて投稿</button>
      </div>
    </div>
  );

  return (
    <div className="fade-in" style={{ maxWidth: 540, margin: "0 auto", padding: "44px 16px" }}>
      <SectionLabel>レビューを投稿</SectionLabel>
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 28 }}>

        <FormSection label="店舗" required>
          {selectedStore ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f5f0e8", border: "1px solid #c9a96e", borderRadius: 3, padding: "12px 16px" }}>
              <span style={{ fontSize: 22 }}>{selectedStore.image}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14 }}>{selectedStore.name}</p>
                <p style={{ fontSize: 12, color: "#7a7268" }}>{selectedStore.area} / {selectedStore.category}</p>
              </div>
              <button onClick={() => { setStoreId(""); setStoreQ(""); }} style={{ background: "none", border: "none", color: "#7a7268", fontSize: 20, padding: "4px 8px" }}>×</button>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <input value={storeQ} onChange={e => { setStoreQ(e.target.value); setShowSug(true); }} onFocus={() => setShowSug(true)} placeholder="店名・エリア・カテゴリで検索..." style={{ width: "100%", background: "#f5f0e8", border: "1px solid #c9a96e44", borderRadius: 3, padding: "12px 16px", color: "#2c2420", outline: "none" }} />
              {showSug && suggestions.length > 0 && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#f5f0e8", border: "1px solid #c9a96e44", borderTop: "none", zIndex: 10 }}>
                  {suggestions.map(s => (
                    <button key={s.id} onClick={() => { setStoreId(s.id); setStoreQ(s.name); setShowSug(false); }} style={{ width: "100%", background: "none", border: "none", padding: "12px 16px", color: "#2c2420", textAlign: "left", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid #c9a96e44" }}>
                      <span>{s.image}</span><span style={{ fontSize: 14 }}>{s.name}</span><span style={{ color: "#7a7268", marginLeft: "auto", fontSize: 11 }}>{s.area}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </FormSection>

        <FormSection label="訪問前の気分・期待" required>
          <div style={{ display: "flex", gap: 8 }}>
            {[["low","あまり期待してない"],["normal","普通に期待"],["high","かなり期待"]].map(([v,l]) => (
              <button key={v} onClick={() => setPreExpect(v)} style={{ flex: 1, background: preExpect === v ? "#c9a96e" : "#f5f0e8", border: `1px solid ${preExpect === v ? "#c9a96e" : "#d8d0c4"}`, color: preExpect === v ? "#faf8f5" : "#8a8278", padding: "14px 8px", borderRadius: 3, fontSize: 14, fontWeight: preExpect === v ? 600 : 400, transition: "all 0.2s" }}>{l}</button>
            ))}
          </div>
        </FormSection>

        <FormSection label="食べてみてどうでしたか？" required>
          <div style={{ display: "flex", gap: 8 }}>
            {[["Good","🚀","期待以上！","#1abc9c"],["Expected","✓","期待通り","#f39c12"],["Below","↓","ちょっと残念","#e74c3c"]].map(([v,icon,l,c]) => (
              <button key={v} onClick={() => setResult(v)} style={{ flex: 1, background: result === v ? c + "22" : "#f5f0e8", border: `1px solid ${result === v ? c : "#d8d0c4"}`, color: result === v ? c : "#8a8278", padding: "14px 8px", borderRadius: 3, transition: "all 0.2s" }}>
                <p style={{ fontSize: 20, marginBottom: 5 }}>{icon}</p>
                <p style={{ fontSize: 13, fontWeight: result === v ? 600 : 400 }}>{v}</p>
                <p style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{l}</p>
              </button>
            ))}
          </div>
        </FormSection>

        {gap && (
          <div style={{ background: gap.color + "11", border: `1px solid ${gap.color}44`, borderRadius: 4, padding: "14px 22px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: gap.color, letterSpacing: "0.15em", marginBottom: 4, textTransform: "uppercase" }}>体験の感想</p>
            <p style={{ fontSize: 22, color: gap.color, fontWeight: 700, letterSpacing: "0.06em" }}>{gap.emoji} {gap.label}</p>
          </div>
        )}

        <FormSection label="コメント（任意）">
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="体験についての自由なコメント..." rows={4} style={{ width: "100%", background: "#f5f0e8", border: "1px solid #c9a96e44", borderRadius: 3, padding: "12px 16px", color: "#2c2420", resize: "vertical", outline: "none", lineHeight: 1.7 }} />
        </FormSection>

        <button onClick={handleSubmit} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "16px", fontSize: 14, letterSpacing: "0.15em", fontWeight: 600, borderRadius: 2 }}>投稿する</button>
      </div>
    </div>
  );
}

function LoginPage({ navigate, setCurrentUser, notify }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) { notify("メールアドレスとパスワードを入力してください", "error"); return; }
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { notify("メールアドレスまたはパスワードが間違っています", "error"); setIsLoading(false); return; }
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    if (profile) { setCurrentUser({ ...profile, email: data.user.email, userType: profile.user_type, isAdmin: profile.is_admin }); notify(`ようこそ、${profile.name}さん`); navigate("home"); }
    setIsLoading(false);
  };
  return (
    <div className="fade-in" style={{ maxWidth: 400, margin: "60px auto", padding: "0 20px" }}>
      <SectionLabel>ログイン</SectionLabel>
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
        <FormSection label="メールアドレス">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@email.com" style={inputStyle} autoComplete="email" />
        </FormSection>
        <FormSection label="パスワード">
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="パスワード" style={inputStyle} autoComplete="current-password" />
        </FormSection>
        <button onClick={handleLogin} disabled={isLoading} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "16px", fontSize: 14, letterSpacing: "0.12em", fontWeight: 600, borderRadius: 2, opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>
        <p style={{ textAlign: "center", fontSize: 13, color: "#7a7268" }}>
          アカウントをお持ちでない方は{" "}
          <button onClick={() => navigate("register")} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: 13, textDecoration: "underline" }}>新規登録</button>
        </p>
      </div>
    </div>
  );
}

function RegisterPage({ navigate, users, setUsers, setCurrentUser, stores, notify }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [axis1, setAxis1] = useState("");
  const [axis2, setAxis2] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userType = axis1 && axis2 ? axis1 + axis2 : null;
  const ut = userType ? USER_TYPES[userType] : null;

  const handleRegister = async () => {
    if (!name || !email || !password || !userType) { notify("全ての項目を入力してください", "error"); return; }
    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { notify(error.message, "error"); setIsSubmitting(false); return; }
    await supabase.from("profiles").insert({ id: data.user.id, name, user_type: userType, is_admin: false });
    const newUser = { id: data.user.id, name, user_type: userType, userType, is_admin: false, isAdmin: false, email };
    setCurrentUser(newUser);
    setUsers(prev => [...prev, newUser]);
    setRegisteredUser(newUser);
    setStep(3);
    setIsSubmitting(false);
  };

  const suggestedCategories = [...new Set(stores.map(s => s.category))].slice(0, 4);

  return (
    <div className="fade-in" style={{ maxWidth: 500, margin: "40px auto", padding: "0 20px" }}>

      {step < 3 && (
        <>
          <SectionLabel>新規登録</SectionLabel>
          <div style={{ display: "flex", gap: 4, marginTop: 18, marginBottom: 28 }}>
            {[1, 2].map(n => (
              <div key={n} style={{ flex: 1, height: 2, background: step >= n ? "#c9a96e" : "#c9a96e33", transition: "background 0.3s" }} />
            ))}
          </div>
        </>
      )}

      {/* Step 1: 基本情報 */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FormSection label="お名前">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="田中 太郎" style={inputStyle} autoComplete="name" />
          </FormSection>
          <FormSection label="メールアドレス">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@email.com" style={inputStyle} autoComplete="email" />
          </FormSection>
          <FormSection label="パスワード">
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="パスワード" style={inputStyle} autoComplete="new-password" />
          </FormSection>
          <button
            onClick={() => { if (name && email && password) setStep(2); else notify("入力してください", "error"); }}
            style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "16px", fontSize: 14, letterSpacing: "0.12em", fontWeight: 600, borderRadius: 2 }}
          >
            次へ：好みを教えてください →
          </button>
        </div>
      )}

      {/* Step 2: 味覚タイプ */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.8 }}>あなたの味覚傾向を教えてください。あなたにぴったりのお店を見つけるためのベースになります。</p>
          <FormSection label="好みの味は？">
            <div style={{ display: "flex", gap: 8 }}>
              {[["B", "しっかり濃い味", "🔥"], ["D", "繊細・あっさり", "🌿"]].map(([v, l, icon]) => (
                <button key={v} onClick={() => setAxis1(v)} style={{ flex: 1, background: axis1 === v ? "#c9a96e22" : "#f5f0e8", border: `1px solid ${axis1 === v ? "#c9a96e" : "#d8d0c4"}`, color: axis1 === v ? "#c9a96e" : "#8a8278", padding: "18px 12px", borderRadius: 3, transition: "all 0.2s" }}>
                  <p style={{ fontSize: 26, marginBottom: 7 }}>{icon}</p>
                  <p style={{ fontSize: 13, fontWeight: axis1 === v ? 600 : 400 }}>{l}</p>
                </button>
              ))}
            </div>
          </FormSection>
          <FormSection label="何を大事にする？">
            <div style={{ display: "flex", gap: 8 }}>
              {[["I", "素材の良さ重視", "🥩"], ["C", "バランス・調和重視", "⚖️"]].map(([v, l, icon]) => (
                <button key={v} onClick={() => setAxis2(v)} style={{ flex: 1, background: axis2 === v ? "#c9a96e22" : "#f5f0e8", border: `1px solid ${axis2 === v ? "#c9a96e" : "#d8d0c4"}`, color: axis2 === v ? "#c9a96e" : "#8a8278", padding: "18px 12px", borderRadius: 3, transition: "all 0.2s" }}>
                  <p style={{ fontSize: 26, marginBottom: 7 }}>{icon}</p>
                  <p style={{ fontSize: 13, fontWeight: axis2 === v ? 600 : 400 }}>{l}</p>
                </button>
              ))}
            </div>
          </FormSection>
          {userType && (
            <div style={{ background: "#f5f0e8", border: `1px solid ${ut?.color}44`, borderRadius: 4, padding: "16px 22px", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#7a7268", marginBottom: 7 }}>あなたのタイプ</p>
              <p style={{ fontSize: 22, marginBottom: 5 }}>{ut?.icon}</p>
              <p style={{ fontSize: 15, color: ut?.color, fontWeight: 600, letterSpacing: "0.06em" }}>{ut?.label}</p>
              <p style={{ fontSize: 12, color: "#7a7268", marginTop: 4 }}>{ut?.desc}</p>
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: "none", border: "1px solid #c9a96e44", color: "#8a8278", padding: "14px", fontSize: 14 }}>← 戻る</button>
            <button onClick={handleRegister} disabled={isSubmitting} style={{ flex: 2, background: "#c9a96e", border: "none", color: "#faf8f5", padding: "14px", fontSize: 14, letterSpacing: "0.12em", fontWeight: 600, borderRadius: 2, opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? "登録中..." : "登録する"}</button>
          </div>
        </div>
      )}

      {/* Step 3: 登録完了 → レビューCTA */}
      {step === 3 && registeredUser && (() => {
        const rut = USER_TYPES[registeredUser.userType];
        return (
          <div style={{ textAlign: "center", paddingTop: 20 }}>

            {/* 完了ヘッダー */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ width: 72, height: 72, background: rut?.color + "22", border: `2px solid ${rut?.color}55`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>
                {rut?.icon}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "0.02em" }}>
                ようこそ、{registeredUser.name}さん
              </h2>
              <p style={{ fontSize: 12, color: rut?.color, letterSpacing: "0.12em", marginBottom: 4 }}>{rut?.label}</p>
              <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.9 }}>
                好みのタイプを登録しました。<br />
                最初の1件のレビューで、<br />
                あなた専用の「合いそう度」が動き始めます。
              </p>
            </div>

            {/* メインCTAカード */}
            <div style={{ background: "#ffffff", border: "1px solid #c9a96e33", borderRadius: 6, padding: "28px 24px", marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                First Review
              </p>
              <p style={{ fontSize: 14, color: "#8a8278", lineHeight: 1.9, marginBottom: 24 }}>
                最近訪れたお店はありますか？<br />
                体験を記録して、あなたの味覚データを育てましょう。
              </p>
              <button
                onClick={() => navigate("review-form")}
                style={{ width: "100%", background: "#c9a96e", border: "none", color: "#faf8f5", padding: "16px", fontSize: 14, letterSpacing: "0.15em", fontWeight: 600, borderRadius: 2, marginBottom: 20 }}
              >
                最初のレビューを書く →
              </button>

              {/* ジャンル別ショートカット */}
              <div>
                <p style={{ fontSize: 11, color: "#9a9088", letterSpacing: "0.1em", marginBottom: 10 }}>ジャンルから探す</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                  {suggestedCategories.map(cat => {
                    const catStore = stores.find(s => s.category === cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => navigate("review-form")}
                        style={{ background: "#f5f0e8", border: "1px solid #c9a96e44", color: "#8a8278", padding: "6px 14px", fontSize: 12, borderRadius: 20, letterSpacing: "0.06em" }}
                      >
                        {catStore?.image} {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* スキップ */}
            <button
              onClick={() => navigate("home")}
              style={{ background: "none", border: "none", color: "#9a9088", fontSize: 12, letterSpacing: "0.08em", textDecoration: "underline" }}
            >
              あとでレビューする
            </button>
          </div>
        );
      })()}
    </div>
  );
}


function ProfilePage({ navigate, currentUser, setCurrentUser, reviews, setReviews, stores, notify, follows, setFollows, users, wishlists, setWishlists }) {
  if (!currentUser) { navigate("login"); return null; }
  const myReviews = reviews.filter(r => r.userId === currentUser.id);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [contentTab, setContentTab] = useState("reviews"); // "reviews" | "wishlist"
  const [followTab, setFollowTab] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editAxis1, setEditAxis1] = useState(currentUser.userType?.[0] || "");
  const [editAxis2, setEditAxis2] = useState(currentUser.userType?.[1] || "");

  const handleSaveProfile = async () => {
    if (!editName.trim()) { notify("ユーザーネームを入力してください", "error"); return; }
    if (!editAxis1 || !editAxis2) { notify("タイプを選択してください", "error"); return; }
    const newType = editAxis1 + editAxis2;
    const newName = editName.trim();

    // profiles 更新
    const { error } = await supabase.from("profiles").update({ name: newName, user_type: newType }).eq("id", currentUser.id);
    if (error) { notify("更新に失敗しました", "error"); return; }

    // 名前が変わった場合は過去のレビューも一括更新
    if (newName !== currentUser.name) {
      const { error: reviewError } = await supabase
        .from("reviews")
        .update({ user_name: newName })
        .eq("user_id", currentUser.id);
      if (reviewError) { notify("レビューの名前更新に失敗しました", "error"); return; }
      // ローカルのreviewsも更新
      setReviews(prev => prev.map(r =>
        r.userId === currentUser.id ? { ...r, userName: newName } : r
      ));
    }

    setCurrentUser(prev => ({ ...prev, name: newName, userType: newType, user_type: newType }));
    setIsEditing(false);
    notify("プロフィールを更新しました");
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("このレビューを削除しますか？")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) { notify("削除に失敗しました", "error"); return; }
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    notify("レビューを削除しました");
  };

  const handleShare = () => {
    const url = `https://gap-review.com#user-profile/${currentUser.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => notify("URLをコピーしました"));
    } else { notify("URLのコピーに失敗しました", "error"); }
  };

  const ut = USER_TYPES[currentUser.userType];
  const visitedIds = new Set(myReviews.map(r => r.storeId));
  const recommended = stores
    .filter(s => !visitedIds.has(s.id))
    .map(s => ({ ...s, matchResult: calcMatchScore(s.id, currentUser, reviews, stores) }))
    .filter(s => s.matchResult !== null && s.matchResult.score >= 60)
    .sort((a, b) => b.matchResult.score - a.matchResult.score)
    .slice(0, 4);

  const myFollowingIds = follows[currentUser.id] || [];
  const myFollowerIds = Object.entries(follows).filter(([, ids]) => ids.includes(currentUser.id)).map(([id]) => id);
  const followingUsers = myFollowingIds.map(id => users.find(u => u.id === id)).filter(Boolean);
  const followerUsers = myFollowerIds.map(id => users.find(u => u.id === id)).filter(Boolean);

  const handleUnfollow = async (targetId) => {
    await supabase.from("follows").delete().eq("follower_id", currentUser.id).eq("followee_id", targetId);
    setFollows(prev => ({ ...prev, [currentUser.id]: (prev[currentUser.id] || []).filter(id => id !== targetId) }));
  };

  const gapKey = r => { const g = calcGap(r.preExpect, r.result); if (!g) return "match"; if (g.value > 0) return "beyond"; if (g.value < 0) return "below"; return "match"; };
  const reviewCounts = { all: myReviews.length, beyond: myReviews.filter(r => gapKey(r) === "beyond").length, match: myReviews.filter(r => gapKey(r) === "match").length, below: myReviews.filter(r => gapKey(r) === "below").length };
  const filteredReviews = reviewFilter === "all" ? myReviews : myReviews.filter(r => gapKey(r) === reviewFilter);

  if (followTab) {
    const listUsers = followTab === "following" ? followingUsers : followerUsers;
    return (
      <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>
        <button onClick={() => setFollowTab(null)} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: 13, letterSpacing: "0.08em", marginBottom: 12 }}>← マイページへ</button>
        <div style={{ borderTop: "1px solid #c9a96e44", paddingTop: 28, marginBottom: 4 }}>
          <SectionLabel>{followTab === "following" ? "フォロー中" : "フォロワー"} ({listUsers.length})</SectionLabel>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
          {listUsers.length === 0 ? (
            <p style={{ padding: 32, textAlign: "center", color: "#9a9088", fontSize: 13 }}>まだいません</p>
          ) : listUsers.map(u => {
            const uType = USER_TYPES[u.userType || u.user_type];
            return (
              <div key={u.id} style={{ background: "#ffffff", border: "1px solid #c9a96e44", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{uType?.icon}</span>
                <button onClick={() => { setFollowTab(null); navigate("user-profile", u.id); }} style={{ background: "none", border: "none", color: "#2c2420", fontSize: 14, flex: 1, textAlign: "left" }}>
                  <span style={{ marginRight: 8 }}>{u.name}</span>
                  <span style={{ fontSize: 11, color: uType?.color }}>{uType?.label}</span>
                </button>
                {followTab === "following" && (
                  <button onClick={() => handleUnfollow(u.id)} style={{ background: "none", border: "1px solid #c9a96e44", color: "#7a7268", padding: "5px 12px", fontSize: 11, borderRadius: 2 }}>解除</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ width: 58, height: 58, background: ut?.color + "22", border: `1px solid ${ut?.color}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{ut?.icon}</div>
        <div style={{ flex: 1 }}>
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FormSection label="ユーザーネーム">
                <input value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
              </FormSection>
              <FormSection label="好みの味は？">
                <div style={{ display: "flex", gap: 8 }}>
                  {[["B", "しっかり濃い味", "🔥"], ["D", "繊細・あっさり", "🌿"]].map(([v, l, icon]) => (
                    <button key={v} onClick={() => setEditAxis1(v)} style={{ flex: 1, background: editAxis1 === v ? "#c9a96e22" : "#f5f0e8", border: `1px solid ${editAxis1 === v ? "#c9a96e" : "#d8d0c4"}`, color: editAxis1 === v ? "#c9a96e" : "#8a8278", padding: "12px 8px", borderRadius: 3, transition: "all 0.2s" }}>
                      <p style={{ fontSize: 18, marginBottom: 4 }}>{icon}</p>
                      <p style={{ fontSize: 11, fontWeight: editAxis1 === v ? 600 : 400 }}>{l}</p>
                    </button>
                  ))}
                </div>
              </FormSection>
              <FormSection label="何を大事にする？">
                <div style={{ display: "flex", gap: 8 }}>
                  {[["I", "素材の良さ重視", "🥩"], ["C", "バランス・調和重視", "⚖️"]].map(([v, l, icon]) => (
                    <button key={v} onClick={() => setEditAxis2(v)} style={{ flex: 1, background: editAxis2 === v ? "#c9a96e22" : "#f5f0e8", border: `1px solid ${editAxis2 === v ? "#c9a96e" : "#d8d0c4"}`, color: editAxis2 === v ? "#c9a96e" : "#8a8278", padding: "12px 8px", borderRadius: 3, transition: "all 0.2s" }}>
                      <p style={{ fontSize: 18, marginBottom: 4 }}>{icon}</p>
                      <p style={{ fontSize: 11, fontWeight: editAxis2 === v ? 600 : 400 }}>{l}</p>
                    </button>
                  ))}
                </div>
              </FormSection>
              {editAxis1 && editAxis2 && (() => {
                const previewType = USER_TYPES[editAxis1 + editAxis2];
                return previewType ? (
                  <div style={{ background: "#f5f0e8", border: `1px solid ${previewType.color}44`, borderRadius: 4, padding: "12px 16px", textAlign: "center" }}>
                    <span style={{ fontSize: 20, marginRight: 8 }}>{previewType.icon}</span>
                    <span style={{ fontSize: 13, color: previewType.color, fontWeight: 600 }}>{previewType.label}</span>
                    <p style={{ fontSize: 11, color: "#7a7268", marginTop: 4 }}>{previewType.desc}</p>
                  </div>
                ) : null;
              })()}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setIsEditing(false); setEditName(currentUser.name); setEditAxis1(currentUser.userType?.[0] || ""); setEditAxis2(currentUser.userType?.[1] || ""); }} style={{ flex: 1, background: "none", border: "1px solid #c9a96e44", color: "#8a8278", padding: "12px", fontSize: 12, borderRadius: 2 }}>キャンセル</button>
                <button onClick={handleSaveProfile} style={{ flex: 2, background: "#c9a96e", border: "none", color: "#faf8f5", padding: "12px", fontSize: 12, fontWeight: 600, borderRadius: 2 }}>保存する</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.02em" }}>{currentUser.name}</h1>
                <button onClick={() => setIsEditing(true)} style={{ background: "none", border: "1px solid #c9a96e44", color: "#7a7268", padding: "4px 10px", fontSize: 11, borderRadius: 2 }}>✏️ 編集</button>
                <button onClick={handleShare} style={{ background: "none", border: "1px solid #c9a96e44", color: "#7a7268", padding: "4px 10px", fontSize: 11, borderRadius: 2 }}>🔗 シェア</button>
              </div>
              <p style={{ fontSize: 12, color: ut?.color, letterSpacing: "0.1em", marginBottom: 3 }}>{ut?.label}</p>
              <p style={{ fontSize: 12, color: "#7a7268" }}>{ut?.desc}</p>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <button onClick={() => setFollowTab("following")} style={{ background: "none", border: "none", padding: 0, color: "#2c2420", textAlign: "left" }}>
          <span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", color: "#c9a96e" }}>{myFollowingIds.length}</span>
          <span style={{ fontSize: 11, color: "#7a7268", marginLeft: 5 }}>フォロー中</span>
        </button>
        <button onClick={() => setFollowTab("followers")} style={{ background: "none", border: "none", padding: 0, color: "#2c2420", textAlign: "left" }}>
          <span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", color: "#c9a96e" }}>{myFollowerIds.length}</span>
          <span style={{ fontSize: 11, color: "#7a7268", marginLeft: 5 }}>フォロワー</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 24 }}>
        {[{ label: "投稿数", key: "all", value: reviewCounts.all }, { label: "よかった！", key: "beyond", value: reviewCounts.beyond }, { label: "残念だった", key: "below", value: reviewCounts.below }].map(({ label, key, value }) => (
          <button key={key} onClick={() => { setReviewFilter(key); setContentTab("reviews"); }} style={{ background: contentTab === "reviews" && reviewFilter === key ? "#f5f0e8" : "#ffffff", padding: "18px", textAlign: "center", border: "1px solid #c9a96e44", color: "#2c2420", cursor: "pointer" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#c9a96e", marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: 11, color: "#7a7268", letterSpacing: "0.1em" }}>{label}</p>
          </button>
        ))}
      </div>

      {/* ── コンテンツタブ ── */}
      {(() => {
        const myWishlistIds = wishlists?.[currentUser.id] || [];
        const wishStores = myWishlistIds.map(sid => stores.find(s => s.id === sid)).filter(Boolean);
        return (
          <div style={{ marginBottom: 36 }}>
            {/* タブヘッダー */}
            <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #c9a96e33" }}>
              <button
                onClick={() => setContentTab("reviews")}
                style={{
                  background: "none", border: "none", borderBottom: `2px solid ${contentTab === "reviews" ? "#c9a96e" : "transparent"}`,
                  color: contentTab === "reviews" ? "#c9a96e" : "#7a7268",
                  padding: "10px 18px", fontSize: 12, fontWeight: contentTab === "reviews" ? 600 : 400,
                  letterSpacing: "0.08em", transition: "all 0.15s", marginBottom: -1,
                }}
              >
                📝 レビュー ({myReviews.length})
              </button>
              <button
                onClick={() => setContentTab("wishlist")}
                style={{
                  background: "none", border: "none", borderBottom: `2px solid ${contentTab === "wishlist" ? "#e67e22" : "transparent"}`,
                  color: contentTab === "wishlist" ? "#e67e22" : "#7a7268",
                  padding: "10px 18px", fontSize: 12, fontWeight: contentTab === "wishlist" ? 600 : 400,
                  letterSpacing: "0.08em", transition: "all 0.15s", marginBottom: -1,
                }}
              >
                🍽️ 行きたいリスト ({wishStores.length})
              </button>
            </div>

            {/* レビュータブ */}
            {contentTab === "reviews" && (
              myReviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "44px 0" }}>
                  <p style={{ fontSize: 14, color: "#9a9088", marginBottom: 18 }}>まだ感想が投稿されていません</p>
                  <button onClick={() => navigate("review-form")} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "12px 26px", fontSize: 13, fontWeight: 600 }}>最初のレビューを書く</button>
                </div>
              ) : (
                <>
                  <ReviewFilterTabs filter={reviewFilter} setFilter={setReviewFilter} counts={reviewCounts} />
                  {filteredReviews.length === 0 ? (
                    <p style={{ padding: "24px 0", textAlign: "center", color: "#9a9088", fontSize: 13 }}>該当するレビューがありません</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {filteredReviews.map(r => {
                        const store = stores.find(s => s.id === r.storeId);
                        return (
                          <div key={r.id} style={{ background: "#ffffff", border: "1px solid #c9a96e44", padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                              <button onClick={() => navigate("store", r.storeId)} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 8, color: "#2c2420" }}>
                                <span style={{ fontSize: 18 }}>{store?.image}</span>
                                <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.04em" }}>{store?.name || "不明な店舗"}</span>
                                <span style={{ fontSize: 11, color: "#7a7268" }}>{store?.area} / {store?.category}</span>
                              </button>
                              <button onClick={() => handleDeleteReview(r.id)} style={{ background: "none", border: "1px solid #c9a96e44", color: "#7a7268", padding: "4px 10px", fontSize: 11, borderRadius: 2, flexShrink: 0 }}>削除</button>
                            </div>
                            <div style={{ marginBottom: 8 }}><span style={{ fontSize: 11, color: "#7a7268" }}>{r.date}</span></div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                              <span style={{ fontSize: 11, background: "#f5f0e8", border: "1px solid #c9a96e44", color: "#7a7268", padding: "3px 8px", borderRadius: 2 }}>{{ low: "あまり期待せずに訪問", normal: "普通の期待で訪問", high: "かなり期待して訪問" }[r.preExpect]}</span>
                              <span style={{ fontSize: 11, background: r.result === "Good" ? "#1abc9c22" : r.result === "Below" ? "#e74c3c22" : "#f39c1222", border: `1px solid ${r.result === "Good" ? "#1abc9c44" : r.result === "Below" ? "#e74c3c44" : "#f39c1244"}`, color: r.result === "Good" ? "#1abc9c" : r.result === "Below" ? "#e74c3c" : "#f39c12", padding: "3px 8px", borderRadius: 2 }}>{r.result}</span>
                            </div>
                            {r.comment && <p style={{ fontSize: 13, color: "#8a8278", lineHeight: 1.7 }}>{r.comment}</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )
            )}

            {/* ウィッシュリストタブ */}
            {contentTab === "wishlist" && (
              wishStores.length === 0 ? (
                <div style={{ textAlign: "center", padding: "44px 0" }}>
                  <p style={{ fontSize: 36, marginBottom: 14 }}>🍽️</p>
                  <p style={{ fontSize: 14, color: "#9a9088", marginBottom: 8 }}>気になるお店を保存しましょう</p>
                  <p style={{ fontSize: 12, color: "#c4b9ac", lineHeight: 1.9, marginBottom: 20 }}>
                    店舗カードや店舗ページの ♡ ボタンで<br />行ってみたいお店を保存できます
                  </p>
                  <button onClick={() => navigate("search")} style={{ background: "none", border: "1px solid #e67e2244", color: "#e67e22", padding: "10px 22px", fontSize: 12, borderRadius: 2 }}>店舗を探す →</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {wishStores.map(s => {
                    const matchResult = calcMatchScore(s.id, currentUser, reviews, stores);
                    const isVisited = visitedIds.has(s.id);
                    return (
                      <div key={s.id} style={{ background: "#ffffff", border: `1px solid ${isVisited ? "#c9a96e44" : "#e67e2233"}`, borderRadius: 3, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                        <button onClick={() => navigate("store", s.id)} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 14, flex: 1, textAlign: "left", color: "#2c2420", padding: 0 }}>
                          <span style={{ fontSize: 24 }}>{s.image}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 14, letterSpacing: "0.04em", marginBottom: 2 }}>{s.name}</p>
                            <p style={{ fontSize: 12, color: "#7a7268" }}>{s.area} / {s.category}</p>
                            {isVisited && <p style={{ fontSize: 10, color: "#1abc9c", marginTop: 2 }}>✓ 訪問済み・レビュー済み</p>}
                          </div>
                          {matchResult && <MatchBadge matchResult={matchResult} />}
                        </button>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          {!isVisited ? (
                            <button onClick={() => navigate("review-form", s.id)} style={{ background: "#e67e22", border: "none", color: "#fff", padding: "7px 14px", fontSize: 11, borderRadius: 2, fontWeight: 600 }}>
                              レビュー →
                            </button>
                          ) : (
                            <button onClick={() => navigate("store", s.id)} style={{ background: "none", border: "1px solid #1abc9c44", color: "#1abc9c", padding: "7px 14px", fontSize: 11, borderRadius: 2 }}>
                              レビュー済み
                            </button>
                          )}
                          <button onClick={async () => {
                            await supabase.from("wishlists").delete().eq("user_id", currentUser.id).eq("store_id", s.id);
                            setWishlists(prev => ({ ...prev, [currentUser.id]: (prev[currentUser.id] || []).filter(id => id !== s.id) }));
                          }} style={{ background: "none", border: "1px solid #c9a96e44", color: "#9a9088", padding: "7px 10px", fontSize: 11, borderRadius: 2 }}>
                            削除
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        );
      })()}

      {recommended.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <SectionLabel>あなたへのレコメンド</SectionLabel>
          <p style={{ fontSize: 12, color: "#7a7268", marginTop: 6, marginBottom: 16 }}>{ut?.label} タイプで相性よさそう・まだ行ってないお店</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recommended.map(s => (
              <button key={s.id} onClick={() => navigate("store", s.id)} style={{ background: "#ffffff", border: "1px solid #c9a96e44", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, textAlign: "left", color: "#2c2420", width: "100%" }}>
                <span style={{ fontSize: 24 }}>{s.image}</span>
                <div style={{ flex: 1 }}><p style={{ fontSize: 14, letterSpacing: "0.04em", marginBottom: 2 }}>{s.name}</p><p style={{ fontSize: 12, color: "#7a7268" }}>{s.area} / {s.category}</p></div>
                <MatchBadge matchResult={s.matchResult} />
              </button>
            ))}
          </div>
        </div>
      )}




    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// ── UsersPage: ユーザー一覧ページ ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function UsersPage({ navigate, currentUser, users, reviews, stores, follows }) {
  if (!currentUser) { navigate("login"); return null; }

  const [searchQ, setSearchQ] = useState("");
  const [sortBy, setSortBy] = useState("match");

  const usersWithStats = users.filter(u => u.id !== currentUser.id).map(u => {
    const ut = USER_TYPES[u.userType || u.user_type];
    const affinity = typeAffinity(currentUser.userType, u.userType || u.user_type);
    const myHitStoreIds = new Set(reviews.filter(r => r.userId === currentUser.id && isHit(r)).map(r => r.storeId));
    const theirHitStoreIds = new Set(reviews.filter(r => r.userId === u.id && isHit(r)).map(r => r.storeId));
    const union = new Set([...myHitStoreIds, ...theirHitStoreIds]);
    const intersection = [...myHitStoreIds].filter(id => theirHitStoreIds.has(id));
    const overlapRate = union.size > 0 ? intersection.length / union.size : 0;
    const tasteMatch = Math.round((affinity * 0.6 + overlapRate * 0.4) * 100);
    const reviewCount = reviews.filter(r => r.userId === u.id).length;
    const latestReview = reviews.filter(r => r.userId === u.id).sort((a, b) => b.date.localeCompare(a.date))[0];
    const isFollowing = (follows[currentUser.id] || []).includes(u.id);
    return { ...u, ut, tasteMatch, reviewCount, latestReview, isFollowing };
  });

  const filtered = usersWithStats.filter(u => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return u.name.toLowerCase().includes(q) || (u.ut?.label || "").toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "match") return b.tasteMatch - a.tasteMatch;
    if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
    if (sortBy === "recent") return (b.latestReview?.date || "").localeCompare(a.latestReview?.date || "");
    return 0;
  });

  return (
    <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>
      <SectionLabel>ユーザー一覧</SectionLabel>
      <p style={{ marginTop: 8, fontSize: 12, color: "#7a7268", marginBottom: 20 }}>
        {USER_TYPES[currentUser.userType]?.icon} {USER_TYPES[currentUser.userType]?.label} のあなたとの相性が高い順に表示中
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="ユーザー名で検索..." style={{ flex: 1, minWidth: 150, background: "#f5f0e8", border: "1px solid #c9a96e44", borderRadius: 3, padding: "10px 14px", color: "#2c2420", outline: "none" }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "#f5f0e8", border: "1px solid #c9a96e44", color: "#8a8278", padding: "10px 12px", outline: "none", borderRadius: 3 }}>
          <option value="match">相性が高い順</option>
          <option value="reviews">レビュー数順</option>
          <option value="recent">最新レビュー順</option>
        </select>
      </div>

      <p style={{ fontSize: 11, color: "#9a9088", letterSpacing: "0.08em", marginBottom: 12 }}>{sorted.length} 人</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sorted.map(u => {
          const matchColor = u.tasteMatch >= 70 ? "#1abc9c" : u.tasteMatch >= 50 ? "#f39c12" : "#7a7268";
          return (
            <button key={u.id} onClick={() => navigate("user-profile", u.id)} style={{ background: "#ffffff", border: "1px solid #c9a96e44", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, textAlign: "left", color: "#2c2420", width: "100%" }}>
              <div style={{ width: 42, height: 42, background: (u.ut?.color || "#7a7268") + "22", border: `1px solid ${(u.ut?.color || "#7a7268")}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{u.ut?.icon || "👤"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.04em" }}>{u.name}</p>
                  {u.isFollowing && <span style={{ fontSize: 10, color: "#c9a96e", background: "#c9a96e15", padding: "1px 8px", borderRadius: 20 }}>フォロー中</span>}
                </div>
                <p style={{ fontSize: 11, color: u.ut?.color || "#7a7268", marginTop: 2 }}>{u.ut?.label || "-"}</p>
                <p style={{ fontSize: 10, color: "#c4b9ac", marginTop: 2 }}>{u.reviewCount}件のレビュー{u.latestReview ? ` · 最終 ${u.latestReview.date}` : ""}</p>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ position: "relative", width: 40, height: 40 }}>
                  <svg viewBox="0 0 36 36" style={{ width: 40, height: 40, transform: "rotate(-90deg)" }}>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#c9a96e33" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke={matchColor} strokeWidth="3" strokeDasharray={`${(u.tasteMatch / 100) * 87.96} 87.96`} strokeLinecap="round" />
                  </svg>
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: matchColor, fontWeight: 700 }}>{u.tasteMatch}</span>
                </div>
                <p style={{ fontSize: 9, color: "#9a9088", marginTop: 2, letterSpacing: "0.05em" }}>相性</p>
              </div>
            </button>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9a9088" }}>
          <p style={{ fontSize: 36, marginBottom: 14 }}>👥</p>
          <p style={{ fontSize: 14 }}>{searchQ ? "該当するユーザーがいません" : "他のユーザーがまだいません"}</p>
        </div>
      )}
    </div>
  );
}


// ── AddStorePage: 一般ユーザー向け店舗登録 ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function AddStorePage({ navigate, currentUser, stores, setStores, notify }) {
  if (!currentUser) { navigate("login"); return null; }

  const CATEGORY_OPTIONS = [
    { label: "鮨", icon: "🍣" }, { label: "和食・割烹", icon: "🍱" },
    { label: "焼き鳥・鳥料理", icon: "🍗" }, { label: "フレンチ", icon: "🥂" },
    { label: "イタリアン", icon: "🍝" }, { label: "中華", icon: "🥢" },
    { label: "イノベーティブ", icon: "✨" }, { label: "焼肉・肉料理", icon: "🥩" },
    { label: "天ぷら", icon: "🍤" }, { label: "スパニッシュ", icon: "🥘" },
    { label: "アジア料理", icon: "🍜" }, { label: "デザート", icon: "🍮" },
    { label: "バー", icon: "🍸" }, { label: "麺類", icon: "🍜" },
    { label: "他和食", icon: "🍶" }, { label: "その他", icon: "🍽️" },
  ];
  const PRICE_OPTIONS = ["¥", "¥¥", "¥¥¥", "¥¥¥¥"];

  const [form, setForm] = useState({ name: "", category: "", area: "", priceRange: "", description: "", image: "" });
  const update = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleCategoryChange = (cat) => {
    const found = CATEGORY_OPTIONS.find(c => c.label === cat);
    setForm(p => ({ ...p, category: cat, image: found ? found.icon : p.image }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { notify("店舗名を入力してください", "error"); return; }
    if (!form.category) { notify("カテゴリを選択してください", "error"); return; }
    if (!form.area.trim()) { notify("エリアを入力してください", "error"); return; }
    if (!form.priceRange) { notify("価格帯を選択してください", "error"); return; }
    if (!form.description.trim()) { notify("説明を入力してください", "error"); return; }
    if (!form.image) { notify("絵文字を選択してください", "error"); return; }

    const { data, error } = await supabase.from("stores").insert({
      name: form.name.trim(), category: form.category, area: form.area.trim(),
      price_range: form.priceRange, description: form.description.trim(), image: form.image
    }).select().single();

    if (error) { notify("登録に失敗しました", "error"); return; }
    setStores(prev => [...prev, { id: data.id, name: data.name, category: data.category, area: data.area, priceRange: data.price_range, description: data.description, image: data.image }]);
    notify("店舗を登録しました");
    navigate("store", data.id);
  };

  const allFilled = form.name.trim() && form.category && form.area.trim() && form.priceRange && form.description.trim() && form.image;
  const selectStyle = { ...inputStyle, cursor: "pointer" };

  return (
    <div className="fade-in" style={{ maxWidth: 520, margin: "0 auto", padding: "44px 16px" }}>
      <SectionLabel>店舗を追加する</SectionLabel>
      <p style={{ marginTop: 8, fontSize: 13, color: "#7a7268", lineHeight: 1.8 }}>新しい店舗を登録できます。全ての項目を入力してください。</p>
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 22 }}>
        <FormSection label="店舗名" required>
          <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="例：鮨 銀座" style={inputStyle} />
        </FormSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormSection label="カテゴリ" required>
            <select value={form.category} onChange={e => handleCategoryChange(e.target.value)} style={selectStyle}>
              <option value="">選択してください</option>
              {CATEGORY_OPTIONS.map(c => <option key={c.label} value={c.label}>{c.icon} {c.label}</option>)}
            </select>
          </FormSection>
          <FormSection label="絵文字" required>
            <select value={form.image} onChange={e => update("image", e.target.value)} style={{ ...selectStyle, fontSize: 20 }}>
              <option value="">選択</option>
              {CATEGORY_OPTIONS.map(c => <option key={c.label + c.icon} value={c.icon}>{c.icon} {c.label}</option>)}
            </select>
          </FormSection>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormSection label="エリア" required>
            <input value={form.area} onChange={e => update("area", e.target.value)} placeholder="例：銀座・渋谷" style={inputStyle} />
          </FormSection>
          <FormSection label="価格帯" required>
            <select value={form.priceRange} onChange={e => update("priceRange", e.target.value)} style={selectStyle}>
              <option value="">選択</option>
              {PRICE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </FormSection>
        </div>
        <FormSection label="説明" required>
          <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={3} placeholder="お店の特徴を簡潔に記載してください" style={{ ...inputStyle, resize: "vertical" }} />
        </FormSection>
        {allFilled && (
          <div style={{ background: "#ffffff", border: "1px solid #c9a96e44", borderRadius: 3, padding: "16px" }}>
            <p style={{ fontSize: 10, color: "#7a7268", letterSpacing: "0.15em", marginBottom: 10, textTransform: "uppercase" }}>プレビュー</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{form.image}</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.02em" }}>{form.name}</p>
                <p style={{ fontSize: 11, color: "#7a7268", marginTop: 3 }}>{form.area} / {form.category} / {form.priceRange}</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#7a7268", lineHeight: 1.8, marginTop: 10 }}>{form.description}</p>
          </div>
        )}
        <button onClick={handleSubmit} style={{
          background: allFilled ? "#c9a96e" : "#d8d0c4", border: "none",
          color: allFilled ? "#faf8f5" : "#7a7268", padding: "16px", fontSize: 14,
          letterSpacing: "0.12em", fontWeight: 600, borderRadius: 2,
          cursor: allFilled ? "pointer" : "default", transition: "all 0.2s",
        }}>登録する</button>
      </div>
    </div>
  );
}

function RequestStorePage({ notify }) {
  const [name, setName] = useState(""); const [category, setCategory] = useState(""); const [area, setArea] = useState(""); const [note, setNote] = useState("");
  const handleSubmit = () => {
    if (!name || !category || !area) { notify("必須項目を入力してください", "error"); return; }
    notify("申請を受け付けました。確認後に登録します。");
    setName(""); setCategory(""); setArea(""); setNote("");
  };
  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: "0 auto", padding: "44px 16px" }}>
      <SectionLabel>店舗を申請する</SectionLabel>
      <p style={{ marginTop: 8, fontSize: 13, color: "#7a7268", lineHeight: 1.8 }}>掲載されていない店舗の追加を申請できます。</p>
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
        <FormSection label="店舗名" required><input value={name} onChange={e => setName(e.target.value)} placeholder="例：鮨 銀座" style={inputStyle} /></FormSection>
        <FormSection label="カテゴリ" required><input value={category} onChange={e => setCategory(e.target.value)} placeholder="例：鮨・フレンチ" style={inputStyle} /></FormSection>
        <FormSection label="エリア" required><input value={area} onChange={e => setArea(e.target.value)} placeholder="例：銀座・渋谷" style={inputStyle} /></FormSection>
        <FormSection label="備考"><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></FormSection>
        <button onClick={handleSubmit} style={{ background: "#c9a96e", border: "none", color: "#faf8f5", padding: "16px", fontSize: 14, letterSpacing: "0.12em", fontWeight: 600, borderRadius: 2 }}>申請する</button>
      </div>
    </div>
  );
}

function AdminPage({ navigate, currentUser, stores, setStores, reviews, setReviews, users, notify }) {
  const [tab, setTab] = useState("stores");
  const [editingStore, setEditingStore] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", area: "", priceRange: "¥¥", description: "", image: "🍽️" });

  if (!currentUser?.isAdmin) { navigate("home"); return null; }

  const handleSave = async () => {
    if (!form.name) { notify("店舗名を入力してください", "error"); return; }
    if (editingStore) {
      const { error } = await supabase.from("stores").update({ name: form.name, category: form.category, area: form.area, price_range: form.priceRange, description: form.description, image: form.image }).eq("id", editingStore);
      if (error) { notify("更新に失敗しました", "error"); return; }
      setStores(prev => prev.map(s => s.id === editingStore ? { ...s, ...form } : s));
      notify("更新しました");
    } else {
      const { data, error } = await supabase.from("stores").insert({ name: form.name, category: form.category, area: form.area, price_range: form.priceRange, description: form.description, image: form.image }).select().single();
      if (error) { notify("追加に失敗しました", "error"); return; }
      setStores(prev => [...prev, { id: data.id, name: data.name, category: data.category, area: data.area, priceRange: data.price_range, description: data.description, image: data.image }]);
      notify("追加しました");
    }
    setEditingStore(null); setForm({ name: "", category: "", area: "", priceRange: "¥¥", description: "", image: "🍽️" }); setTab("stores");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <SectionLabel>管理画面</SectionLabel>
        <span style={{ fontSize: 11, background: "#c9a96e22", color: "#c9a96e", padding: "3px 10px", borderRadius: 20 }}>ADMIN</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 32 }}>
        {[["登録店舗数",stores.length],["総レビュー数",reviews.length],["登録ユーザー数",users.length]].map(([l,v]) => (
          <div key={l} style={{ background: "#ffffff", padding: "16px", textAlign: "center", border: "1px solid #c9a96e44" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#c9a96e" }}>{v}</p>
            <p style={{ fontSize: 11, color: "#7a7268", marginTop: 3 }}>{l}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 22, flexWrap: "wrap" }}>
        {[["stores","店舗管理"],["edit",editingStore?"店舗を編集":"店舗を追加"],["reviews","レビュー一覧"],["users","ユーザー"]].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ background: tab === key ? "#c9a96e" : "#ffffff", border: "1px solid #c9a96e44", color: tab === key ? "#faf8f5" : "#7a7268", padding: "10px 16px", fontSize: 12, fontWeight: tab === key ? 600 : 400, transition: "all 0.2s" }}>{label}</button>
        ))}
      </div>

      {tab === "stores" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {stores.map(store => (
            <div key={store.id} style={{ background: "#ffffff", border: "1px solid #c9a96e44", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 20 }}>{store.image}</span>
              <div style={{ flex: 1, minWidth: 140 }}>
                <p style={{ fontSize: 13 }}>{store.name}</p>
                <p style={{ fontSize: 11, color: "#7a7268" }}>{store.area} / {store.category} / {store.priceRange}</p>
              </div>
              <p style={{ fontSize: 11, color: "#7a7268" }}>{reviews.filter(r => r.storeId === store.id).length}件</p>
              <button onClick={() => { setEditingStore(store.id); setForm({ name: store.name, category: store.category, area: store.area, priceRange: store.priceRange, description: store.description, image: store.image }); setTab("edit"); }} style={{ background: "none", border: "1px solid #c9a96e44", color: "#8a8278", padding: "5px 12px", fontSize: 11, borderRadius: 2 }}>編集</button>
              <button onClick={async () => {
                if (!window.confirm(`「${store.name}」を削除しますか？`)) return;
                const { error } = await supabase.from("stores").delete().eq("id", store.id);
                if (error) { notify("削除に失敗しました", "error"); return; }
                await supabase.from("reviews").delete().eq("store_id", store.id);
                setStores(prev => prev.filter(s => s.id !== store.id));
                notify("店舗を削除しました");
              }} style={{ background: "none", border: "1px solid #4a2020", color: "#e74c3c", padding: "5px 12px", fontSize: 11, borderRadius: 2 }}>削除</button>
            </div>
          ))}
        </div>
      )}

      {tab === "edit" && (() => {
        const CATEGORY_OPTIONS = [
          { label: "鮨", icon: "🍣" }, { label: "和食・割烹", icon: "🍱" },
          { label: "焼き鳥・鳥料理", icon: "🍗" }, { label: "フレンチ", icon: "🥂" },
          { label: "イタリアン", icon: "🍝" }, { label: "中華", icon: "🥢" },
          { label: "イノベーティブ", icon: "✨" }, { label: "焼肉・肉料理", icon: "🥩" },
          { label: "天ぷら", icon: "🍤" }, { label: "スパニッシュ", icon: "🥘" },
          { label: "アジア料理", icon: "🍜" }, { label: "デザート", icon: "🍮" },
          { label: "バー", icon: "🍸" }, { label: "麺類", icon: "🍜" },
          { label: "他和食", icon: "🍶" }, { label: "その他", icon: "🍽️" },
        ];
        const handleCategoryChange = (cat) => {
          const found = CATEGORY_OPTIONS.find(c => c.label === cat);
          setForm(p => ({ ...p, category: cat, image: found ? found.icon : p.image }));
        };
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormSection label="店舗名" required>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </FormSection>
              <FormSection label="絵文字">
                <select value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} style={{ ...inputStyle, cursor: "pointer", fontSize: 20 }}>
                  {CATEGORY_OPTIONS.map(c => <option key={c.icon} value={c.icon}>{c.icon} {c.label}</option>)}
                </select>
              </FormSection>
              <FormSection label="カテゴリ">
                <select value={form.category} onChange={e => handleCategoryChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">選択してください</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c.label} value={c.label}>{c.icon} {c.label}</option>)}
                </select>
              </FormSection>
              <FormSection label="エリア">
                <input value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} placeholder="例：銀座・渋谷区" style={inputStyle} />
              </FormSection>
              <FormSection label="価格帯">
                <select value={form.priceRange} onChange={e => setForm(p => ({ ...p, priceRange: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                  {["¥","¥¥","¥¥¥","¥¥¥¥"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </FormSection>
            </div>
            <FormSection label="説明">
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </FormSection>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setEditingStore(null); setTab("stores"); }} style={{ flex: 1, background: "none", border: "1px solid #c9a96e44", color: "#8a8278", padding: "14px", fontSize: 13 }}>キャンセル</button>
              <button onClick={handleSave} style={{ flex: 2, background: "#c9a96e", border: "none", color: "#faf8f5", padding: "14px", fontSize: 13, fontWeight: 600, borderRadius: 2 }}>{editingStore ? "更新する" : "追加する"}</button>
            </div>
          </div>
        );
      })()}

      {tab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reviews.map(r => { const store = stores.find(s => s.id === r.storeId); return <ReviewCard key={r.id} review={r} storeName={store?.name} showStore isAdmin onAdminDelete={async (reviewId) => {
            if (!window.confirm("このレビューを削除しますか？")) return;
            const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
            if (error) { notify("削除に失敗しました", "error"); return; }
            setReviews(prev => prev.filter(rv => rv.id !== reviewId));
            notify("レビューを削除しました");
          }} />; })}
        </div>
      )}

      {tab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {users.map(u => {
            const ut = USER_TYPES[u.userType];
            return (
              <div key={u.id} style={{ background: "#ffffff", border: "1px solid #c9a96e44", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 20 }}>{ut?.icon || "👤"}</span>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <p style={{ fontSize: 13 }}>{u.name} {u.isAdmin && <span style={{ fontSize: 10, color: "#c9a96e", marginLeft: 8, border: "1px solid #c9a96e44", padding: "1px 6px" }}>admin</span>}</p>
                  <p style={{ fontSize: 11, color: "#7a7268" }}>{u.email}</p>
                </div>
                <p style={{ fontSize: 12, color: ut?.color }}>{ut?.label || "-"}</p>
                <p style={{ fontSize: 12, color: "#7a7268" }}>{reviews.filter(r => r.userId === u.id).length}件</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── レビューフィルタタブ（共通）──────────────────────────────────────────────
function ReviewFilterTabs({ filter, setFilter, counts }) {
  const tabs = [
    { key: "all",    label: "すべて", color: "#7a7268" },
    { key: "beyond", label: "🚀 よかった！", color: "#1abc9c" },
    { key: "match",  label: "✓ 期待通り",  color: "#f39c12" },
    { key: "below",  label: "↓ ちょっと残念",  color: "#e74c3c" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 16, flexWrap: "wrap" }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => setFilter(t.key)} style={{
          background: filter === t.key ? t.color + "22" : "#ffffff",
          border: `1px solid ${filter === t.key ? t.color : "#c9a96e44"}`,
          color: filter === t.key ? t.color : "#7a7268",
          padding: "6px 14px", fontSize: 12, borderRadius: 2, transition: "all 0.15s",
        }}>
          {t.label}{counts && counts[t.key] !== undefined ? ` (${counts[t.key]})` : ""}
        </button>
      ))}
    </div>
  );
}

function StoreCard({ store, reviews, navigate, currentUser, allReviews, allStores, precomputedResult, wishlists, setWishlists }) {
  const stats = getGapStats(reviews);
  const matchResult = precomputedResult !== undefined
    ? precomputedResult
    : (currentUser && allReviews && allStores ? calcMatchScore(store.id, currentUser, allReviews, allStores) : null);

  const isWished = currentUser && (wishlists?.[currentUser.id] || []).includes(store.id);
  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!currentUser) { navigate("login"); return; }
    if (isWished) {
      await supabase.from("wishlists").delete().eq("user_id", currentUser.id).eq("store_id", store.id);
      setWishlists(prev => ({ ...prev, [currentUser.id]: (prev[currentUser.id] || []).filter(id => id !== store.id) }));
    } else {
      await supabase.from("wishlists").insert({ user_id: currentUser.id, store_id: store.id });
      setWishlists(prev => ({ ...prev, [currentUser.id]: [...(prev[currentUser.id] || []), store.id] }));
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => navigate("store", store.id)} className="hover-lift" style={{ background: "#ffffff", border: "1px solid #c9a96e44", padding: "20px", textAlign: "left", color: "#2c2420", borderRadius: 3, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 30 }}>{store.image}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 3 }}>{store.name}</p>
          <p style={{ fontSize: 11, color: "#7a7268" }}>{store.area} / {store.category}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: "#c9a96e" }}>{store.priceRange}</span>
          {currentUser && (
            <button
              onClick={toggleWishlist}
              title={isWished ? "行ってみたいリストから削除" : "行ってみたいリストに追加"}
              style={{
                background: isWished ? "#e67e2222" : "#faf8f5",
                border: `1px solid ${isWished ? "#e67e22" : "#c9a96e44"}`,
                borderRadius: "50%", width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isWished ? 14 : 16,
                color: isWished ? "#e67e22" : "#c9a96e",
                lineHeight: 1, transition: "all 0.2s", flexShrink: 0,
              }}
            >
              {isWished ? "🍽️" : "♡"}
            </button>
          )}
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#7a7268", lineHeight: 1.7, marginBottom: 12 }}>{store.description}</p>
      <div style={{ marginBottom: 10 }}>
        {currentUser
          ? (matchResult && <MatchBadge matchResult={matchResult} />)
          : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f5f0e8", border: "1px dashed #c9a96e44", borderRadius: 3, padding: "6px 10px",
              width: "100%" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", border: "2px dashed #c9a96e44",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 14, color: "#c4b9ac" }}>?</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, color: "#c4b9ac", letterSpacing: "0.1em", fontWeight: 600 }}>相性</p>
                <p style={{ fontSize: 10, color: "#d8d0c4", marginTop: 1 }}>ログインすると表示されます</p>
              </div>
            </div>
          )
        }
      </div>
      {stats ? (
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#1abc9c" }}>🚀 {stats.beyond}</span>
          <span style={{ fontSize: 11, color: "#f39c12" }}>✓ {stats.match}</span>
          <span style={{ fontSize: 11, color: "#e74c3c" }}>↓ {stats.below}</span>
          <span style={{ fontSize: 10, color: "#c4b9ac", marginLeft: "auto" }}>{stats.total}件</span>
        </div>
      ) : <p style={{ fontSize: 11, color: "#c4b9ac" }}>まだレビューなし</p>}
      </button>

    </div>
  );
}

function ReviewCard({ review, storeName, showStore, currentUserType, navigate, matchResult, isAdmin, onAdminDelete }) {
  const gap = calcGap(review.preExpect, review.result);
  const expectLabels = { low: "あまり期待せず", normal: "普通に期待", high: "かなり期待して" };
  const ut = USER_TYPES[review.userType];
  const isSameType = currentUserType && review.userType === currentUserType;
  return (
    <div style={{ background: "#ffffff", border: `1px solid ${isSameType ? ut?.color + "44" : "#c9a96e44"}`, padding: "16px 20px" }}>
      {showStore && storeName && (
        <button
          onClick={() => navigate && navigate("store", review.storeId)}
          style={{ background: "none", border: "none", padding: 0, display: "block", textAlign: "left", width: "100%", marginBottom: 10 }}
        >
          <p style={{ fontSize: 15, fontWeight: 700, color: "#2c2420", letterSpacing: "0.03em" }}>{storeName}</p>
        </button>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate && review.userId && navigate("user-profile", review.userId)}
              style={{ background: "none", border: "none", color: "#2c2420", fontSize: 13, fontWeight: 600, padding: 0, cursor: navigate ? "pointer" : "default", textDecoration: navigate ? "underline" : "none", textDecorationColor: "#c4b9ac" }}
            >{review.userName}</button>
            {ut && <span style={{ fontSize: 10, color: ut.color, background: ut.color + "15", padding: "2px 8px", borderRadius: 20 }}>{ut.icon} {ut.label}</span>}
            {isSameType && <span style={{ fontSize: 10, color: "#c9a96e" }}>あなたと同タイプ</span>}
          </div>
          <p style={{ fontSize: 11, color: "#c4b9ac", marginTop: 3 }}>{review.date}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 16, color: gap.color }}>{gap.emoji}</p>
            <p style={{ fontSize: 10, color: gap.color, letterSpacing: "0.1em" }}>{gap.label}</p>
          </div>
          {matchResult && <MatchBadge matchResult={matchResult} />}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#7a7268", background: "#f5f0e8", padding: "2px 9px", borderRadius: 20 }}>{expectLabels[review.preExpect]}で訪問</span>
        <span style={{ fontSize: 11, color: gap.color, background: gap.color + "15", padding: "2px 9px", borderRadius: 20 }}>{review.result}</span>
      </div>
      {review.comment && <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.8 }}>{review.comment}</p>}
      {isAdmin && onAdminDelete && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #c9a96e44", textAlign: "right" }}>
          <button onClick={(e) => { e.stopPropagation(); onAdminDelete(review.id); }} style={{ background: "none", border: "1px solid #4a2020", color: "#e74c3c", padding: "3px 10px", fontSize: 10, borderRadius: 2 }}>🗑 管理者削除</button>
        </div>
      )}
    </div>
  );
}

// ─── 他ユーザーのプロフィールページ ──────────────────────────────────────────
function UserProfilePage({ navigate, currentUser, users, reviews, stores, follows, setFollows, pageParam }) {
  const targetUser = users.find(u => u.id === pageParam);
  if (!targetUser) return (
    <div style={{ padding: 80, textAlign: "center", color: "#9a9088" }}>
      ユーザーが見つかりません
    </div>
  );

  const [reviewFilter, setReviewFilter] = useState("all");
  const ut = USER_TYPES[targetUser.userType];
  const targetReviews = reviews.filter(r => r.userId === targetUser.id);
  const isMe = currentUser?.id === targetUser.id;
  const followingIds = follows[currentUser?.id] || [];
  const isFollowing = followingIds.includes(targetUser.id);

  // フォロー/アンフォロー
  const toggleFollow = async () => {
    if (!currentUser) { navigate("login"); return; }
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", currentUser.id).eq("followee_id", targetUser.id);
      setFollows(prev => ({ ...prev, [currentUser.id]: (prev[currentUser.id] || []).filter(id => id !== targetUser.id) }));
    } else {
      await supabase.from("follows").insert({ follower_id: currentUser.id, followee_id: targetUser.id });
      setFollows(prev => ({ ...prev, [currentUser.id]: [...(prev[currentUser.id] || []), targetUser.id] }));
    }
  };

  // 自分との相性スコア（タイプ親和度 × ヒット傾向の重複度）
  const affinityScore = (() => {
    if (!currentUser || isMe) return null;
    const affinity = typeAffinity(currentUser.userType, targetUser.userType); // 0.2〜1.0
    // 共通してヒットしている店舗の割合
    const myHitStoreIds = new Set(
      reviews.filter(r => r.userId === currentUser.id && isHit(r)).map(r => r.storeId)
    );
    const theirHitStoreIds = new Set(
      targetReviews.filter(r => isHit(r)).map(r => r.storeId)
    );
    const union = new Set([...myHitStoreIds, ...theirHitStoreIds]);
    const intersection = [...myHitStoreIds].filter(id => theirHitStoreIds.has(id));
    const overlapRate = union.size > 0 ? intersection.length / union.size : 0;
    // 総合: タイプ親和度60% + 嗜好重複40%
    return Math.round((affinity * 0.6 + overlapRate * 0.4) * 100);
  })();

  // レビューフィルタ
  const gapKey = r => { const g = calcGap(r.preExpect, r.result); if (!g) return "match"; if (g.value > 0) return "beyond"; if (g.value < 0) return "below"; return "match"; };
  const reviewCounts = { all: targetReviews.length, beyond: targetReviews.filter(r => gapKey(r) === "beyond").length, match: targetReviews.filter(r => gapKey(r) === "match").length, below: targetReviews.filter(r => gapKey(r) === "below").length };
  const filteredTargetReviews = reviewFilter === "all" ? targetReviews : targetReviews.filter(r => gapKey(r) === reviewFilter);

  // よく行くエリア・ジャンル（上位3つ）
  const areaCounts = {}, genreCounts = {};
  targetReviews.forEach(r => {
    const s = stores.find(st => st.id === r.storeId);
    if (!s) return;
    areaCounts[s.area]  = (areaCounts[s.area]  || 0) + 1;
    genreCounts[s.category] = (genreCounts[s.category] || 0) + 1;
  });
  const topAreas  = Object.entries(areaCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);
  const topGenres = Object.entries(genreCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);

  // フォロワー数
  const followerCount  = Object.values(follows).filter(ids => ids.includes(targetUser.id)).length;
  const followingCount = (follows[targetUser.id] || []).length;

  return (
    <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>

      {/* ── ヘッダー ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ width: 58, height: 58, background: ut?.color + "22", border: `1px solid ${ut?.color}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{ut?.icon}</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, letterSpacing: "0.02em" }}>{targetUser.name}</h1>
          <p style={{ fontSize: 12, color: ut?.color, letterSpacing: "0.1em", marginBottom: 2 }}>{ut?.label}</p>
          <p style={{ fontSize: 12, color: "#7a7268" }}>{ut?.desc}</p>
        </div>
        {!isMe && currentUser && (
          <button onClick={toggleFollow} style={{
            background: isFollowing ? "transparent" : "#c9a96e",
            border: `1px solid ${isFollowing ? "#c4b9ac" : "#c9a96e"}`,
            color: isFollowing ? "#7a7268" : "#faf8f5",
            padding: "8px 20px", fontSize: 12, fontWeight: 600, borderRadius: 2, flexShrink: 0,
            letterSpacing: "0.08em"
          }}>
            {isFollowing ? "フォロー中" : "フォローする"}
          </button>
        )}
      </div>

      {/* ── フォロー数 ── */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <span><span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", color: "#c9a96e" }}>{followingCount}</span><span style={{ fontSize: 11, color: "#7a7268", marginLeft: 5 }}>フォロー中</span></span>
        <span><span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", color: "#c9a96e" }}>{followerCount}</span><span style={{ fontSize: 11, color: "#7a7268", marginLeft: 5 }}>フォロワー</span></span>
        <span><span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", color: "#c9a96e" }}>{targetReviews.length}</span><span style={{ fontSize: 11, color: "#7a7268", marginLeft: 5 }}>レビュー</span></span>
      </div>

      {/* ── 自分との相性 ── */}
      {affinityScore !== null && (
        <div style={{ background: "#ffffff", border: "1px solid #c9a96e44", borderRadius: 4, padding: "16px 20px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "#9a9088", marginBottom: 10, textTransform: "uppercase" }}>あなたとの相性</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: 48, height: 48, transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#c9a96e33" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none"
                  stroke={affinityScore >= 70 ? "#1abc9c" : affinityScore >= 50 ? "#f39c12" : "#7a7268"}
                  strokeWidth="3"
                  strokeDasharray={`${(affinityScore / 100) * 87.96} 87.96`}
                  strokeLinecap="round" />
              </svg>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                color: affinityScore >= 70 ? "#1abc9c" : affinityScore >= 50 ? "#f39c12" : "#7a7268", fontWeight: 700 }}>{affinityScore}</span>
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#2c2420", marginBottom: 3 }}>
                {affinityScore >= 70 ? "味覚の傾向が近いユーザーです" : affinityScore >= 50 ? "一部の好みが重なっています" : "味覚の傾向が異なるユーザーです"}
              </p>
              <p style={{ fontSize: 11, color: "#7a7268" }}>タイプの近さ＋訪問したお店の傾向をもとに算出</p>
            </div>
          </div>
        </div>
      )}

      {/* ── よく行くエリア・ジャンル ── */}
      {targetReviews.length > 0 && (
        <div style={{ background: "#ffffff", border: "1px solid #c9a96e44", borderRadius: 4, padding: "16px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "#9a9088", marginBottom: 12, textTransform: "uppercase" }}>よく行くエリア・ジャンル</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {topAreas.map(a => (
              <span key={a} style={{ fontSize: 12, color: "#c9a96e", background: "#c9a96e15", border: "1px solid #c9a96e33", padding: "4px 12px", borderRadius: 20 }}>{a}</span>
            ))}
            {topGenres.map(g => (
              <span key={g} style={{ fontSize: 12, color: "#7a9acc", background: "#7a9acc15", border: "1px solid #7a9acc33", padding: "4px 12px", borderRadius: 20 }}>{g}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── 口コミ一覧（フィルタ付き） ── */}
      <SectionLabel>みんなの感想 ({targetReviews.length}件)</SectionLabel>
      {targetReviews.length === 0 ? (
        <p style={{ marginTop: 22, color: "#9a9088", fontSize: 14 }}>まだ感想が投稿されていません</p>
      ) : (
        <>
          <div style={{ marginTop: 16 }}>
            <ReviewFilterTabs filter={reviewFilter} setFilter={setReviewFilter} counts={reviewCounts} />
          </div>
          {filteredTargetReviews.length === 0 ? (
            <p style={{ padding: "20px 0", textAlign: "center", color: "#9a9088", fontSize: 13 }}>該当するレビューがありません</p>
          ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredTargetReviews
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(r => {
              const store = stores.find(s => s.id === r.storeId);
              if (!store) return null;
              const gap = calcGap(r.preExpect, r.result);
              const expectLabels = { low: "あまり期待せず", normal: "普通に期待", high: "かなり期待して" };
              const ut = USER_TYPES[r.userType];
              // ログイン中のみ自分視点でマッチ率を計算する
              const matchResult = currentUser
                ? calcMatchScore(store.id, currentUser, reviews, stores)
                : null;
              return (
                <button key={r.id} onClick={() => navigate("store", store.id)}
                  style={{ background: "#ffffff", border: "1px solid #c9a96e44", borderRadius: 3,
                    padding: "16px", textAlign: "left", color: "#2c2420", width: "100%" }}>

                  {/* 上段: 店舗情報 + マッチバッジ */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{store.image}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", marginBottom: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{store.name}</p>
                      <p style={{ fontSize: 11, color: "#9a9088" }}>{store.area} · {store.category} · {store.priceRange}</p>
                    </div>
                    {currentUser
                      ? (matchResult && <MatchBadge matchResult={matchResult} />)
                      : (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
                          background: "#f5f0e8", border: "1px solid #c9a96e44",
                          borderRadius: 3, padding: "5px 10px" }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%",
                            border: "2px dashed #c9a96e44", display: "flex", alignItems: "center",
                            justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 14, color: "#c4b9ac" }}>?</span>
                          </div>
                          <div>
                            <p style={{ fontSize: 10, color: "#c4b9ac", letterSpacing: "0.08em", fontWeight: 600 }}>相性</p>
                            <p style={{ fontSize: 10, color: "#d8d0c4", marginTop: 1 }}>ログインで表示</p>
                          </div>
                        </div>
                      )
                    }
                  </div>

                  {/* 下段: ギャップ判定 + 期待値タグ + 日付（1行に収める） */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8,
                    borderTop: "1px solid #c9a96e33", paddingTop: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: gap.color, fontWeight: 600,
                      letterSpacing: "0.06em", marginRight: 2 }}>{gap.emoji} {gap.label}</span>
                    <span style={{ fontSize: 11, color: "#7a7268", background: "#f5f0e8",
                      padding: "2px 8px", borderRadius: 20 }}>{expectLabels[r.preExpect]}</span>
                    <span style={{ fontSize: 11, color: gap.color, background: gap.color + "15",
                      padding: "2px 8px", borderRadius: 20 }}>{r.result}</span>
                    <span style={{ fontSize: 10, color: "#c4b9ac", marginLeft: "auto" }}>{r.date}</span>
                  </div>

                  {/* コメント */}
                  {r.comment && (
                    <p style={{ fontSize: 12, color: "#7a7268", lineHeight: 1.8,
                      marginTop: 10, paddingTop: 10, borderTop: "1px solid #c9a96e33" }}>{r.comment}</p>
                  )}
                </button>
              );
            })}
          </div>
          )}
        </>
      )}
    </div>
  );
}


function SectionLabel({ children }) {
  return <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c9a96e", textTransform: "uppercase", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", borderBottom: "1px solid #c9a96e44", paddingBottom: 10, display: "inline-block" }}>{children}</p>;
}

function FormSection({ label, required, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: "#7a7268", letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: "#c9a96e", marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#f5f0e8", border: "1px solid #d8d0c4", borderRadius: 3,
  padding: "12px 16px", color: "#2c2420", fontSize: 16, outline: "none", letterSpacing: "0.04em",
};

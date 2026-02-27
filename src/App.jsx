import { useState, useEffect, useRef } from "react";

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
  { id: 1, storeId: 1, userId: "u2", userName: "Kaito M.", preExpect: "high", result: "Expected", comment: "期待通りの江戸前。職人の仕事が丁寧で、光り物が特に素晴らしかった。", date: "2025-02-10", userType: "BB" },
  { id: 2, storeId: 1, userId: "u3", userName: "Risa T.", preExpect: "high", result: "Good", comment: "鮪の赤身の熟成具合が完璧。静かな空間も気に入った。", date: "2025-02-14", userType: "DI" },
  { id: 3, storeId: 2, userId: "u2", userName: "Kaito M.", preExpect: "normal", result: "Good", comment: "アミューズから始まる構成が見事。素材の選び方に哲学を感じた。", date: "2025-01-28", userType: "BB" },
  { id: 4, storeId: 3, userId: "u4", userName: "Sora Y.", preExpect: "low", result: "Good", comment: "期待以上にサービスが洗練されていた。肉質も申し分なし。", date: "2025-02-05", userType: "BC" },
  { id: 5, storeId: 4, userId: "u3", userName: "Risa T.", preExpect: "high", result: "Below", comment: "季節感は良かったが、油の温度管理に少し粗さを感じた。", date: "2025-01-20", userType: "DI" },
  { id: 6, storeId: 6, userId: "u4", userName: "Sora Y.", preExpect: "normal", result: "Good", comment: "このレベルのラーメンが千円台は驚き。スープが透き通っていて美しい。", date: "2025-02-18", userType: "DC" },
];

// ─── User Types ───────────────────────────────────────────────────────────────
const USER_TYPES = {
  BI: { label: "Bold × Ingredient", icon: "🔥", desc: "濃い味 × 素材重視", color: "#C0392B" },
  BC: { label: "Bold × Composition", icon: "⚡", desc: "濃い味 × バランス重視", color: "#8E44AD" },
  DI: { label: "Delicate × Ingredient", icon: "🌿", desc: "繊細な味 × 素材重視", color: "#27AE60" },
  DC: { label: "Delicate × Composition", icon: "✨", desc: "繊細な味 × バランス重視", color: "#2980B9" },
};

// ─── Gap Calculation ──────────────────────────────────────────────────────────
function calcGap(preExpect, result) {
  const expectMap = { low: -1, normal: 0, high: 1 };
  const resultMap = { Good: 1, Expected: 0, Below: -1 };
  const gap = resultMap[result] - expectMap[preExpect];
  if (gap >= 1) return { label: "超越", color: "#1abc9c", emoji: "🚀", value: gap };
  if (gap === 0) return { label: "一致", color: "#f39c12", emoji: "✓", value: gap };
  return { label: "乖離", color: "#e74c3c", emoji: "↓", value: gap };
}

function getGapStats(reviews) {
  if (!reviews.length) return null;
  const beyond = reviews.filter(r => calcGap(r.preExpect, r.result).value >= 1).length;
  const match = reviews.filter(r => calcGap(r.preExpect, r.result).value === 0).length;
  const below = reviews.filter(r => calcGap(r.preExpect, r.result).value < 0).length;
  return { beyond, match, below, total: reviews.length };
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [stores, setStores] = useState(INITIAL_STORES);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { id: "u1", name: "Admin", email: "admin@example.com", password: "admin", isAdmin: true, userType: "DC" },
    { id: "u2", name: "Kaito M.", email: "kaito@example.com", password: "pass", isAdmin: false, userType: "BB" },
  ]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [pageParam, setPageParam] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [notification, setNotification] = useState(null);

  const navigate = (p, param = null) => {
    setPage(p);
    setPageParam(param);
    window.scrollTo(0, 0);
  };

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const props = { page, navigate, stores, setStores, reviews, setReviews, currentUser, setCurrentUser, users, setUsers, selectedStore, setSelectedStore, pageParam, searchQ, setSearchQ, notify };

  return (
    <div style={{ fontFamily: "'Noto Serif JP', 'Georgia', serif", background: "#0c0c0e", minHeight: "100vh", color: "#e8e0d4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0c0c0e; }
        ::-webkit-scrollbar-thumb { background: #3a3028; border-radius: 2px; }
        input, textarea, select { font-family: inherit; }
        button { cursor: pointer; font-family: inherit; }
        a { color: inherit; text-decoration: none; }
        .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        .gap-beyond { color: #1abc9c; }
        .gap-match { color: #f39c12; }
        .gap-below { color: #e74c3c; }
      `}</style>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: notification.type === "success" ? "#1abc9c" : "#e74c3c", color: "#fff", padding: "12px 24px", borderRadius: 4, animation: "slideDown 0.3s ease", fontSize: 14, letterSpacing: "0.05em" }}>
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
        {page === "register" && <RegisterPage {...props} />}
        {page === "profile" && <ProfilePage {...props} />}
        {page === "request-store" && <RequestStorePage {...props} />}
        {page === "admin" && <AdminPage {...props} />}
      </div>
    </div>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ navigate, currentUser, page, searchQ, setSearchQ }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localQ, setLocalQ] = useState(searchQ);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQ(localQ);
    navigate("search");
  };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(12,12,14,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e1c1a", height: 64, display: "flex", alignItems: "center", padding: "0 24px", gap: 24 }}>
      <button onClick={() => navigate("home")} style={{ background: "none", border: "none", color: "#e8e0d4", fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
        Gap Review
      </button>

      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 400 }}>
        <input
          value={localQ}
          onChange={e => setLocalQ(e.target.value)}
          placeholder="店舗を検索..."
          style={{ width: "100%", background: "#1a1814", border: "1px solid #2a2620", borderRadius: 3, padding: "8px 14px", color: "#e8e0d4", fontSize: 13, outline: "none", letterSpacing: "0.05em" }}
        />
      </form>

      <div style={{ display: "flex", gap: 20, alignItems: "center", marginLeft: "auto" }}>
        <button onClick={() => navigate("search")} style={{ background: "none", border: "none", color: "#9a9090", fontSize: 13, letterSpacing: "0.08em" }}>
          一覧
        </button>
        {currentUser ? (
          <>
            <button onClick={() => navigate("profile")} style={{ background: "none", border: "none", color: "#9a9090", fontSize: 13, letterSpacing: "0.08em" }}>
              {currentUser.name}
            </button>
            {currentUser.isAdmin && (
              <button onClick={() => navigate("admin")} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: 12, letterSpacing: "0.1em", border: "1px solid #c9a96e", padding: "4px 10px", borderRadius: 2 }}>
                管理
              </button>
            )}
          </>
        ) : (
          <button onClick={() => navigate("login")} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", fontSize: 12, letterSpacing: "0.12em", padding: "8px 18px", borderRadius: 2, fontWeight: 600 }}>
            ログイン
          </button>
        )}
      </div>
    </nav>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ navigate, stores, reviews, currentUser }) {
  const featured = stores.slice(0, 3);

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 14, color: "#c9a96e", letterSpacing: "0.25em", marginBottom: 24, textTransform: "uppercase" }}>
          Expectation Gap Review
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 300, lineHeight: 1.1, color: "#e8e0d4", marginBottom: 28, letterSpacing: "-0.02em" }}>
          期待と体験の<br />
          <em style={{ fontStyle: "italic", color: "#c9a96e" }}>差分</em>を可視化する
        </h1>
        <p style={{ fontSize: 15, color: "#7a7268", maxWidth: 480, lineHeight: 1.9, letterSpacing: "0.06em", marginBottom: 48 }}>
          点数評価に依存しない新しいレビューシステム。<br />
          あなたの「期待」と「体験」のギャップが、真の評価軸になる。
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={() => navigate("search")} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "14px 36px", fontSize: 13, letterSpacing: "0.15em", fontWeight: 600 }}>
            店舗を探す
          </button>
          <button onClick={() => navigate(currentUser ? "review-form" : "login")} style={{ background: "none", border: "1px solid #3a3028", color: "#e8e0d4", padding: "14px 36px", fontSize: 13, letterSpacing: "0.15em" }}>
            レビューを書く
          </button>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel>How It Works</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2, marginTop: 32 }}>
          {[
            { n: "01", title: "期待を設定", desc: "訪問前の期待値（低/普通/高）を記録する" },
            { n: "02", title: "体験を評価", desc: "Good / Expected / Below の3択で体験を報告" },
            { n: "03", title: "ギャップを可視化", desc: "差分が「超越・一致・乖離」として自動算出される" },
          ].map(s => (
            <div key={s.n} style={{ background: "#111012", padding: "36px 28px", borderLeft: "1px solid #1e1c1a" }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, color: "#2a2620", fontWeight: 300, marginBottom: 16 }}>{s.n}</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, letterSpacing: "0.06em" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#6a6258", lineHeight: 1.8, letterSpacing: "0.04em" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Stores */}
      <div style={{ padding: "40px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel>注目の店舗</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 32 }}>
          {featured.map(store => (
            <StoreCard key={store.id} store={store} reviews={reviews.filter(r => r.storeId === store.id)} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Search Page ──────────────────────────────────────────────────────────────
function SearchPage({ navigate, stores, reviews, searchQ, setSearchQ }) {
  const [localQ, setLocalQ] = useState(searchQ);
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", ...new Set(stores.map(s => s.category))];

  const filtered = stores
    .filter(s => {
      const q = localQ.toLowerCase();
      const matchQ = !q || s.name.includes(q) || s.category.includes(q) || s.area.includes(q);
      const matchCat = filterCategory === "all" || s.category === filterCategory;
      return matchQ && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "ja");
      if (sortBy === "reviews") return reviews.filter(r => r.storeId === b.id).length - reviews.filter(r => r.storeId === a.id).length;
      return 0;
    });

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
      <SectionLabel>店舗一覧</SectionLabel>

      <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={localQ}
          onChange={e => { setLocalQ(e.target.value); setSearchQ(e.target.value); }}
          placeholder="店名・エリア・カテゴリで検索..."
          style={{ flex: 1, minWidth: 200, background: "#1a1814", border: "1px solid #2a2620", borderRadius: 3, padding: "10px 16px", color: "#e8e0d4", fontSize: 13, outline: "none" }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ background: "#1a1814", border: "1px solid #2a2620", color: "#9a9090", padding: "10px 14px", fontSize: 13, outline: "none", borderRadius: 3 }}>
          {categories.map(c => <option key={c} value={c}>{c === "all" ? "全カテゴリ" : c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "#1a1814", border: "1px solid #2a2620", color: "#9a9090", padding: "10px 14px", fontSize: 13, outline: "none", borderRadius: 3 }}>
          <option value="name">名前順</option>
          <option value="reviews">レビュー数順</option>
        </select>
      </div>

      <p style={{ marginTop: 20, fontSize: 12, color: "#4a4440", letterSpacing: "0.08em" }}>{filtered.length} 件</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
        {filtered.map(store => (
          <StoreCard key={store.id} store={store} reviews={reviews.filter(r => r.storeId === store.id)} navigate={navigate} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#4a4440" }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>🔍</p>
          <p style={{ fontSize: 14, letterSpacing: "0.06em" }}>該当する店舗が見つかりません</p>
          <button onClick={() => navigate("request-store")} style={{ marginTop: 20, background: "none", border: "1px solid #3a3028", color: "#c9a96e", padding: "10px 24px", fontSize: 12, letterSpacing: "0.1em", borderRadius: 2 }}>
            店舗を申請する
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Store Page ───────────────────────────────────────────────────────────────
function StorePage({ navigate, stores, reviews, pageParam, currentUser }) {
  const storeId = pageParam;
  const store = stores.find(s => s.id === storeId);
  const storeReviews = reviews.filter(r => r.storeId === storeId);
  const stats = getGapStats(storeReviews);

  if (!store) return <div style={{ padding: 80, textAlign: "center", color: "#4a4440" }}>店舗が見つかりません</div>;

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      {/* Store Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, color: "#4a4440", letterSpacing: "0.15em", marginBottom: 12 }}>
          {store.area} / {store.category} / {store.priceRange}
        </p>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>{store.image}</div>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, letterSpacing: "0.04em", marginBottom: 10 }}>{store.name}</h1>
            <p style={{ fontSize: 14, color: "#7a7268", lineHeight: 1.8, letterSpacing: "0.04em" }}>{store.description}</p>
          </div>
        </div>
      </div>

      {/* Gap Stats */}
      {stats && (
        <div style={{ background: "#111012", border: "1px solid #1e1c1a", borderRadius: 4, padding: "28px 32px", marginBottom: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#4a4440", marginBottom: 20, textTransform: "uppercase" }}>期待値ギャップ分布</p>
          <div style={{ display: "flex", gap: 0 }}>
            {[
              { key: "beyond", label: "超越", color: "#1abc9c", count: stats.beyond },
              { key: "match", label: "一致", color: "#f39c12", count: stats.match },
              { key: "below", label: "乖離", color: "#e74c3c", count: stats.below },
            ].map(g => (
              <div key={g.key} style={{ flex: 1, textAlign: "center", padding: "16px 0", borderRight: "1px solid #1e1c1a" }}>
                <p style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: g.color, marginBottom: 4 }}>{g.count}</p>
                <p style={{ fontSize: 11, color: g.color, letterSpacing: "0.1em" }}>{g.label}</p>
                <p style={{ fontSize: 10, color: "#4a4440", marginTop: 4 }}>{stats.total > 0 ? Math.round(g.count / stats.total * 100) : 0}%</p>
              </div>
            ))}
          </div>
          {/* Bar */}
          <div style={{ marginTop: 20, height: 4, background: "#1e1c1a", borderRadius: 2, overflow: "hidden", display: "flex" }}>
            {stats.total > 0 && <>
              <div style={{ width: `${stats.beyond / stats.total * 100}%`, background: "#1abc9c", transition: "width 0.5s" }} />
              <div style={{ width: `${stats.match / stats.total * 100}%`, background: "#f39c12", transition: "width 0.5s" }} />
              <div style={{ width: `${stats.below / stats.total * 100}%`, background: "#e74c3c", transition: "width 0.5s" }} />
            </>}
          </div>
        </div>
      )}

      {/* Review Button */}
      <div style={{ marginBottom: 40, display: "flex", gap: 12 }}>
        <button onClick={() => navigate(currentUser ? "review-form" : "login", storeId)} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "12px 28px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
          レビューを書く
        </button>
      </div>

      {/* Reviews */}
      <div>
        <SectionLabel>口コミ ({storeReviews.length})</SectionLabel>
        {storeReviews.length === 0 ? (
          <p style={{ marginTop: 24, color: "#4a4440", fontSize: 14, letterSpacing: "0.06em" }}>まだレビューがありません</p>
        ) : (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 2 }}>
            {storeReviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Review Form Page ─────────────────────────────────────────────────────────
function ReviewFormPage({ navigate, stores, reviews, setReviews, currentUser, pageParam, notify }) {
  const [storeId, setStoreId] = useState(pageParam || "");
  const [storeQ, setStoreQ] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [preExpect, setPreExpect] = useState("");
  const [result, setResult] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedStore = stores.find(s => s.id === storeId);
  const suggestions = storeQ ? stores.filter(s => s.name.includes(storeQ) || s.category.includes(storeQ) || s.area.includes(storeQ)).slice(0, 5) : [];

  if (!currentUser) {
    navigate("login");
    return null;
  }

  const gap = preExpect && result ? calcGap(preExpect, result) : null;

  const handleSubmit = () => {
    if (!storeId || !preExpect || !result) {
      notify("必須項目を入力してください", "error");
      return;
    }
    const newReview = {
      id: Date.now(),
      storeId,
      userId: currentUser.id,
      userName: currentUser.name,
      preExpect,
      result,
      comment,
      date: new Date().toISOString().slice(0, 10),
      userType: currentUser.userType,
    };
    setReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
    notify("レビューを投稿しました");
  };

  if (submitted) {
    return (
      <div className="fade-in" style={{ maxWidth: 500, margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontSize: 48, marginBottom: 24 }}>✓</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, marginBottom: 16 }}>レビューを投稿しました</h2>
        {gap && (
          <p style={{ fontSize: 18, color: gap.color, letterSpacing: "0.1em", marginBottom: 32 }}>
            {gap.emoji} 期待値ギャップ：{gap.label}
          </p>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => navigate("store", storeId)} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "12px 28px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
            店舗ページへ
          </button>
          <button onClick={() => { setSubmitted(false); setStoreId(""); setStoreQ(""); setPreExpect(""); setResult(""); setComment(""); }} style={{ background: "none", border: "1px solid #3a3028", color: "#e8e0d4", padding: "12px 28px", fontSize: 13, letterSpacing: "0.12em" }}>
            続けて投稿
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
      <SectionLabel>レビューを投稿</SectionLabel>
      <p style={{ marginTop: 8, fontSize: 13, color: "#5a5450", letterSpacing: "0.04em" }}>訪問後の体験をギャップとして記録します</p>

      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Store Select */}
        <FormSection label="店舗" required>
          {selectedStore ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a1814", border: "1px solid #c9a96e", borderRadius: 3, padding: "12px 16px" }}>
              <span style={{ fontSize: 24 }}>{selectedStore.image}</span>
              <div>
                <p style={{ fontSize: 14, letterSpacing: "0.04em" }}>{selectedStore.name}</p>
                <p style={{ fontSize: 12, color: "#5a5450" }}>{selectedStore.area} / {selectedStore.category}</p>
              </div>
              <button onClick={() => { setStoreId(""); setStoreQ(""); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#5a5450", fontSize: 18 }}>×</button>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <input
                value={storeQ}
                onChange={e => { setStoreQ(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="店名・エリア・カテゴリで検索..."
                style={{ width: "100%", background: "#1a1814", border: "1px solid #2a2620", borderRadius: 3, padding: "12px 16px", color: "#e8e0d4", fontSize: 14, outline: "none" }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1814", border: "1px solid #2a2620", borderTop: "none", zIndex: 10 }}>
                  {suggestions.map(s => (
                    <button key={s.id} onClick={() => { setStoreId(s.id); setStoreQ(s.name); setShowSuggestions(false); }} style={{ width: "100%", background: "none", border: "none", padding: "10px 16px", color: "#e8e0d4", textAlign: "left", fontSize: 13, display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid #1e1c1a" }}>
                      <span>{s.image}</span>
                      <span>{s.name}</span>
                      <span style={{ color: "#5a5450", marginLeft: "auto", fontSize: 11 }}>{s.area}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </FormSection>

        {/* Pre Expectation */}
        <FormSection label="訪問前の期待値" required>
          <div style={{ display: "flex", gap: 8 }}>
            {[["low", "低い", "落ち着いて訪問"], ["normal", "普通", "標準的な期待"], ["high", "高い", "かなり期待して訪問"]].map(([v, l, d]) => (
              <button key={v} onClick={() => setPreExpect(v)} style={{ flex: 1, background: preExpect === v ? "#c9a96e" : "#1a1814", border: `1px solid ${preExpect === v ? "#c9a96e" : "#2a2620"}`, color: preExpect === v ? "#0c0c0e" : "#9a9090", padding: "12px 8px", borderRadius: 3, fontSize: 13, fontWeight: preExpect === v ? 600 : 400, transition: "all 0.2s" }}>
                <p>{l}</p>
                <p style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{d}</p>
              </button>
            ))}
          </div>
        </FormSection>

        {/* Result */}
        <FormSection label="実際の食体験" required>
          <div style={{ display: "flex", gap: 8 }}>
            {[["Good", "🚀", "期待以上", "#1abc9c"], ["Expected", "✓", "期待通り", "#f39c12"], ["Below", "↓", "期待以下", "#e74c3c"]].map(([v, icon, l, c]) => (
              <button key={v} onClick={() => setResult(v)} style={{ flex: 1, background: result === v ? c + "22" : "#1a1814", border: `1px solid ${result === v ? c : "#2a2620"}`, color: result === v ? c : "#9a9090", padding: "16px 8px", borderRadius: 3, fontSize: 13, transition: "all 0.2s" }}>
                <p style={{ fontSize: 22, marginBottom: 6 }}>{icon}</p>
                <p style={{ fontWeight: result === v ? 600 : 400 }}>{v}</p>
                <p style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{l}</p>
              </button>
            ))}
          </div>
        </FormSection>

        {/* Gap Preview */}
        {gap && (
          <div style={{ background: gap.color + "11", border: `1px solid ${gap.color}44`, borderRadius: 4, padding: "16px 24px", textAlign: "center", animation: "fadeIn 0.3s ease" }}>
            <p style={{ fontSize: 12, color: gap.color, letterSpacing: "0.15em", marginBottom: 4, textTransform: "uppercase" }}>期待値ギャップ</p>
            <p style={{ fontSize: 28, color: gap.color, fontFamily: "'Cormorant Garamond', serif" }}>{gap.emoji} {gap.label}</p>
          </div>
        )}

        {/* Comment */}
        <FormSection label="コメント（任意）">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="体験についての自由なコメント..."
            rows={4}
            style={{ width: "100%", background: "#1a1814", border: "1px solid #2a2620", borderRadius: 3, padding: "12px 16px", color: "#e8e0d4", fontSize: 13, resize: "vertical", outline: "none", lineHeight: 1.7, letterSpacing: "0.04em" }}
          />
        </FormSection>

        <button onClick={handleSubmit} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "16px", fontSize: 13, letterSpacing: "0.15em", fontWeight: 600, borderRadius: 2 }}>
          投稿する
        </button>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ navigate, users, setCurrentUser, notify }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      notify(`ようこそ、${user.name}さん`);
      navigate("home");
    } else {
      notify("メールアドレスまたはパスワードが間違っています", "error");
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 400, margin: "80px auto", padding: "0 24px" }}>
      <SectionLabel>ログイン</SectionLabel>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
        <FormSection label="メールアドレス">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@email.com" style={inputStyle} />
        </FormSection>
        <FormSection label="パスワード">
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} />
        </FormSection>
        <button onClick={handleLogin} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "14px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
          ログイン
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#5a5450", letterSpacing: "0.06em" }}>
          アカウントをお持ちでない方は{" "}
          <button onClick={() => navigate("register")} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: 12, letterSpacing: "0.06em", textDecoration: "underline" }}>
            新規登録
          </button>
        </p>
        <div style={{ marginTop: 8, padding: "12px 16px", background: "#111012", border: "1px solid #1e1c1a", borderRadius: 3 }}>
          <p style={{ fontSize: 11, color: "#4a4440", letterSpacing: "0.06em", marginBottom: 6 }}>デモアカウント</p>
          <p style={{ fontSize: 12, color: "#6a6258" }}>管理者: admin@example.com / admin</p>
          <p style={{ fontSize: 12, color: "#6a6258" }}>一般: kaito@example.com / pass</p>
        </div>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────
function RegisterPage({ navigate, users, setUsers, setCurrentUser, notify }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [axis1, setAxis1] = useState("");
  const [axis2, setAxis2] = useState("");

  const userType = axis1 && axis2 ? axis1 + axis2 : null;

  const handleRegister = () => {
    if (!name || !email || !password || !userType) {
      notify("全ての項目を入力してください", "error");
      return;
    }
    const newUser = { id: "u" + Date.now(), name, email, password, isAdmin: false, userType };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    notify(`ようこそ、${name}さん！`);
    navigate("home");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 500, margin: "60px auto", padding: "0 24px" }}>
      <SectionLabel>新規登録</SectionLabel>

      {step === 1 && (
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
          <FormSection label="お名前">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="田中 太郎" style={inputStyle} />
          </FormSection>
          <FormSection label="メールアドレス">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@email.com" style={inputStyle} />
          </FormSection>
          <FormSection label="パスワード">
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" style={inputStyle} />
          </FormSection>
          <button onClick={() => { if (name && email && password) setStep(2); else notify("入力してください", "error"); }} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "14px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
            次へ：味覚プロファイル →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 32 }}>
          <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.8, letterSpacing: "0.04em" }}>
            あなたの味覚傾向を教えてください。これがパーソナライズされたレコメンドの基礎になります。
          </p>

          <FormSection label="軸① 味の方向性">
            <div style={{ display: "flex", gap: 8 }}>
              {[["B", "Bold（濃い味）", "🔥"], ["D", "Delicate（繊細）", "🌿"]].map(([v, l, icon]) => (
                <button key={v} onClick={() => setAxis1(v)} style={{ flex: 1, background: axis1 === v ? "#c9a96e22" : "#1a1814", border: `1px solid ${axis1 === v ? "#c9a96e" : "#2a2620"}`, color: axis1 === v ? "#c9a96e" : "#9a9090", padding: "20px 12px", borderRadius: 3, fontSize: 13, transition: "all 0.2s" }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>{icon}</p>
                  <p style={{ fontWeight: axis1 === v ? 600 : 400 }}>{l}</p>
                </button>
              ))}
            </div>
          </FormSection>

          <FormSection label="軸② 体験志向">
            <div style={{ display: "flex", gap: 8 }}>
              {[["I", "素材重視", "🥩"], ["C", "設計・バランス重視", "⚖️"]].map(([v, l, icon]) => (
                <button key={v} onClick={() => setAxis2(v)} style={{ flex: 1, background: axis2 === v ? "#c9a96e22" : "#1a1814", border: `1px solid ${axis2 === v ? "#c9a96e" : "#2a2620"}`, color: axis2 === v ? "#c9a96e" : "#9a9090", padding: "20px 12px", borderRadius: 3, fontSize: 13, transition: "all 0.2s" }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>{icon}</p>
                  <p style={{ fontWeight: axis2 === v ? 600 : 400 }}>{l}</p>
                </button>
              ))}
            </div>
          </FormSection>

          {userType && (
            <div style={{ background: "#1a1814", border: `1px solid ${USER_TYPES[userType]?.color}44`, borderRadius: 4, padding: "16px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "#5a5450", letterSpacing: "0.15em", marginBottom: 8 }}>あなたのタイプ</p>
              <p style={{ fontSize: 24, marginBottom: 6 }}>{USER_TYPES[userType]?.icon}</p>
              <p style={{ fontSize: 16, color: USER_TYPES[userType]?.color, fontWeight: 600, letterSpacing: "0.06em" }}>{USER_TYPES[userType]?.label}</p>
              <p style={{ fontSize: 12, color: "#7a7268", marginTop: 4 }}>{USER_TYPES[userType]?.desc}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, background: "none", border: "1px solid #2a2620", color: "#9a9090", padding: "14px", fontSize: 13, letterSpacing: "0.1em" }}>
              ← 戻る
            </button>
            <button onClick={handleRegister} style={{ flex: 2, background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "14px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
              登録する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ navigate, currentUser, setCurrentUser, reviews, stores, notify }) {
  if (!currentUser) { navigate("login"); return null; }

  const myReviews = reviews.filter(r => r.userId === currentUser.id);
  const ut = USER_TYPES[currentUser.userType];

  const logout = () => {
    setCurrentUser(null);
    notify("ログアウトしました");
    navigate("home");
  };

  // Recommend: stores where similar-type users said "Good" beyond expectation
  const recommended = stores.filter(s => {
    const sReviews = reviews.filter(r => r.storeId === s.id && r.userType === currentUser.userType);
    return sReviews.some(r => calcGap(r.preExpect, r.result).value >= 1);
  }).slice(0, 3);

  return (
    <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      {/* Profile Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 48 }}>
        <div style={{ width: 64, height: 64, background: ut?.color + "22", border: `1px solid ${ut?.color}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
          {ut?.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, marginBottom: 6, letterSpacing: "0.04em" }}>{currentUser.name}</h1>
          <p style={{ fontSize: 12, color: ut?.color, letterSpacing: "0.1em", marginBottom: 4 }}>{ut?.label}</p>
          <p style={{ fontSize: 12, color: "#5a5450" }}>{ut?.desc}</p>
        </div>
        <button onClick={logout} style={{ background: "none", border: "1px solid #2a2620", color: "#5a5450", padding: "8px 16px", fontSize: 12, letterSpacing: "0.08em", borderRadius: 2 }}>
          ログアウト
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 48 }}>
        {[
          { label: "投稿数", value: myReviews.length },
          { label: "超越体験", value: myReviews.filter(r => calcGap(r.preExpect, r.result).value >= 1).length },
          { label: "乖離体験", value: myReviews.filter(r => calcGap(r.preExpect, r.result).value < 0).length },
        ].map(s => (
          <div key={s.label} style={{ background: "#111012", padding: "24px", textAlign: "center", border: "1px solid #1e1c1a" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: "#c9a96e", marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#5a5450", letterSpacing: "0.1em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <SectionLabel>あなたへのレコメンド</SectionLabel>
          <p style={{ fontSize: 12, color: "#5a5450", marginTop: 6, marginBottom: 20, letterSpacing: "0.06em" }}>
            同じ味覚タイプ（{ut?.label}）のユーザーが「超越」と評価した店舗
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recommended.map(s => (
              <button key={s.id} onClick={() => navigate("store", s.id)} style={{ background: "#111012", border: "1px solid #1e1c1a", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, textAlign: "left", color: "#e8e0d4" }}>
                <span style={{ fontSize: 28 }}>{s.image}</span>
                <div>
                  <p style={{ fontSize: 14, letterSpacing: "0.04em", marginBottom: 2 }}>{s.name}</p>
                  <p style={{ fontSize: 12, color: "#5a5450" }}>{s.area} / {s.category}</p>
                </div>
                <span style={{ marginLeft: "auto", color: "#1abc9c", fontSize: 12 }}>🚀 超越</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* My Reviews */}
      <div>
        <SectionLabel>投稿したレビュー</SectionLabel>
        {myReviews.length === 0 ? (
          <div style={{ marginTop: 24, textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 14, color: "#4a4440", letterSpacing: "0.06em", marginBottom: 20 }}>まだレビューがありません</p>
            <button onClick={() => navigate("review-form")} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "12px 28px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
              最初のレビューを書く
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 2 }}>
            {myReviews.map(r => {
              const store = stores.find(s => s.id === r.storeId);
              return (
                <div key={r.id} onClick={() => navigate("store", r.storeId)} style={{ cursor: "pointer" }}>
                  <ReviewCard review={r} storeName={store?.name} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Request Store Page ───────────────────────────────────────────────────────
function RequestStorePage({ notify, navigate }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!name || !category || !area) { notify("必須項目を入力してください", "error"); return; }
    notify("申請を受け付けました。確認後に登録します。");
    setName(""); setCategory(""); setArea(""); setNote("");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>
      <SectionLabel>店舗を申請する</SectionLabel>
      <p style={{ marginTop: 8, fontSize: 13, color: "#5a5450", lineHeight: 1.8, letterSpacing: "0.04em" }}>
        掲載されていない店舗の追加を申請できます。運営が確認後に登録します。
      </p>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
        <FormSection label="店舗名" required>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="例：鮨 銀座" style={inputStyle} />
        </FormSection>
        <FormSection label="カテゴリ" required>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="例：鮨・フレンチ・バー" style={inputStyle} />
        </FormSection>
        <FormSection label="エリア" required>
          <input value={area} onChange={e => setArea(e.target.value)} placeholder="例：銀座・渋谷" style={inputStyle} />
        </FormSection>
        <FormSection label="備考・補足">
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="URLや追加情報があれば..." style={{ ...inputStyle, resize: "vertical" }} />
        </FormSection>
        <button onClick={handleSubmit} style={{ background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "14px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
          申請する
        </button>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
function AdminPage({ navigate, currentUser, stores, setStores, reviews, users, notify }) {
  const [tab, setTab] = useState("stores");
  const [editingStore, setEditingStore] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", area: "", priceRange: "¥¥", description: "", image: "🍽️" });

  if (!currentUser?.isAdmin) { navigate("home"); return null; }

  const handleSaveStore = () => {
    if (!form.name) { notify("店舗名を入力してください", "error"); return; }
    if (editingStore) {
      setStores(prev => prev.map(s => s.id === editingStore ? { ...s, ...form } : s));
      notify("店舗を更新しました");
    } else {
      setStores(prev => [...prev, { ...form, id: Date.now() }]);
      notify("店舗を追加しました");
    }
    setEditingStore(null);
    setForm({ name: "", category: "", area: "", priceRange: "¥¥", description: "", image: "🍽️" });
  };

  const startEdit = (store) => {
    setEditingStore(store.id);
    setForm({ name: store.name, category: store.category, area: store.area, priceRange: store.priceRange, description: store.description, image: store.image });
    setTab("edit");
  };

  const deleteStore = (id) => {
    setStores(prev => prev.filter(s => s.id !== id));
    notify("削除しました");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <SectionLabel>管理画面</SectionLabel>
        <span style={{ fontSize: 11, background: "#c9a96e22", color: "#c9a96e", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.1em" }}>ADMIN</span>
      </div>

      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 40 }}>
        {[
          { label: "登録店舗数", value: stores.length },
          { label: "総レビュー数", value: reviews.length },
          { label: "登録ユーザー数", value: users.length },
        ].map(s => (
          <div key={s.label} style={{ background: "#111012", padding: "20px", textAlign: "center", border: "1px solid #1e1c1a" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#c9a96e" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#5a5450", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 28 }}>
        {[["stores", "店舗管理"], ["edit", editingStore ? "店舗を編集" : "店舗を追加"], ["reviews", "レビュー一覧"], ["users", "ユーザー"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ background: tab === key ? "#c9a96e" : "#111012", border: "1px solid #1e1c1a", color: tab === key ? "#0c0c0e" : "#7a7268", padding: "10px 20px", fontSize: 12, letterSpacing: "0.1em", fontWeight: tab === key ? 600 : 400, transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "stores" && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {stores.map(store => (
              <div key={store.id} style={{ background: "#111012", border: "1px solid #1e1c1a", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 24 }}>{store.image}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, letterSpacing: "0.04em" }}>{store.name}</p>
                  <p style={{ fontSize: 12, color: "#5a5450" }}>{store.area} / {store.category} / {store.priceRange}</p>
                </div>
                <p style={{ fontSize: 12, color: "#5a5450" }}>{reviews.filter(r => r.storeId === store.id).length}件</p>
                <button onClick={() => startEdit(store)} style={{ background: "none", border: "1px solid #3a3028", color: "#9a9090", padding: "6px 14px", fontSize: 11, letterSpacing: "0.08em", borderRadius: 2 }}>編集</button>
                <button onClick={() => deleteStore(store.id)} style={{ background: "none", border: "1px solid #4a2020", color: "#e74c3c", padding: "6px 14px", fontSize: 11, letterSpacing: "0.08em", borderRadius: 2 }}>削除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "edit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormSection label="店舗名" required>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="店舗名" style={inputStyle} />
            </FormSection>
            <FormSection label="アイコン絵文字">
              <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="🍽️" style={inputStyle} />
            </FormSection>
            <FormSection label="カテゴリ">
              <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="鮨・フレンチ..." style={inputStyle} />
            </FormSection>
            <FormSection label="エリア">
              <input value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} placeholder="銀座・渋谷..." style={inputStyle} />
            </FormSection>
            <FormSection label="価格帯">
              <select value={form.priceRange} onChange={e => setForm(p => ({ ...p, priceRange: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                {["¥", "¥¥", "¥¥¥", "¥¥¥¥"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </FormSection>
          </div>
          <FormSection label="説明">
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </FormSection>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setEditingStore(null); setTab("stores"); setForm({ name: "", category: "", area: "", priceRange: "¥¥", description: "", image: "🍽️" }); }} style={{ flex: 1, background: "none", border: "1px solid #2a2620", color: "#9a9090", padding: "14px", fontSize: 13 }}>キャンセル</button>
            <button onClick={handleSaveStore} style={{ flex: 2, background: "#c9a96e", border: "none", color: "#0c0c0e", padding: "14px", fontSize: 13, letterSpacing: "0.12em", fontWeight: 600 }}>
              {editingStore ? "更新する" : "追加する"}
            </button>
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reviews.map(r => {
            const store = stores.find(s => s.id === r.storeId);
            return <ReviewCard key={r.id} review={r} storeName={store?.name} showStore />;
          })}
        </div>
      )}

      {tab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {users.map(u => {
            const ut = USER_TYPES[u.userType];
            return (
              <div key={u.id} style={{ background: "#111012", border: "1px solid #1e1c1a", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 24 }}>{ut?.icon || "👤"}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, letterSpacing: "0.04em" }}>{u.name} {u.isAdmin && <span style={{ fontSize: 10, color: "#c9a96e", marginLeft: 8, border: "1px solid #c9a96e44", padding: "1px 6px" }}>admin</span>}</p>
                  <p style={{ fontSize: 12, color: "#5a5450" }}>{u.email}</p>
                </div>
                <p style={{ fontSize: 12, color: ut?.color }}>{ut?.label || "-"}</p>
                <p style={{ fontSize: 12, color: "#5a5450" }}>{reviews.filter(r => r.userId === u.id).length}件</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Sub Components ───────────────────────────────────────────────────────────
function StoreCard({ store, reviews, navigate }) {
  const stats = getGapStats(reviews);
  return (
    <button onClick={() => navigate("store", store.id)} className="hover-lift" style={{ background: "#111012", border: "1px solid #1e1c1a", padding: "24px", textAlign: "left", color: "#e8e0d4", borderRadius: 3, transition: "all 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        <span style={{ fontSize: 36 }}>{store.image}</span>
        <div>
          <p style={{ fontSize: 16, fontFamily: "'Noto Serif JP', serif", letterSpacing: "0.04em", marginBottom: 4 }}>{store.name}</p>
          <p style={{ fontSize: 11, color: "#5a5450", letterSpacing: "0.08em" }}>{store.area} / {store.category}</p>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#c9a96e" }}>{store.priceRange}</span>
      </div>
      <p style={{ fontSize: 12, color: "#5a5450", lineHeight: 1.7, letterSpacing: "0.04em", marginBottom: 16 }}>{store.description}</p>
      {stats ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#1abc9c" }}>🚀 {stats.beyond}</span>
          <span style={{ fontSize: 11, color: "#f39c12" }}>✓ {stats.match}</span>
          <span style={{ fontSize: 11, color: "#e74c3c" }}>↓ {stats.below}</span>
          <span style={{ fontSize: 10, color: "#3a3028", marginLeft: "auto" }}>{stats.total}件のレビュー</span>
        </div>
      ) : (
        <p style={{ fontSize: 11, color: "#3a3028" }}>まだレビューなし</p>
      )}
    </button>
  );
}

function ReviewCard({ review, storeName, showStore }) {
  const gap = calcGap(review.preExpect, review.result);
  const expectLabels = { low: "低い期待で訪問", normal: "普通の期待で訪問", high: "高い期待で訪問" };
  const ut = USER_TYPES[review.userType];
  return (
    <div style={{ background: "#111012", border: "1px solid #1e1c1a", padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <p style={{ fontSize: 13, letterSpacing: "0.04em", fontWeight: 600 }}>{review.userName}</p>
            {ut && <span style={{ fontSize: 10, color: ut.color, background: ut.color + "15", padding: "2px 8px", borderRadius: 20 }}>{ut.icon} {ut.label}</span>}
            {showStore && storeName && <span style={{ fontSize: 11, color: "#5a5450" }}>→ {storeName}</span>}
          </div>
          <p style={{ fontSize: 11, color: "#3a3028", marginTop: 4 }}>{review.date}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 18, color: gap.color }}>{gap.emoji}</p>
          <p style={{ fontSize: 10, color: gap.color, letterSpacing: "0.1em" }}>{gap.label}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#7a7268", background: "#1a1814", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em" }}>
          {expectLabels[review.preExpect]}
        </span>
        <span style={{ fontSize: 11, color: gap.color, background: gap.color + "15", padding: "3px 10px", borderRadius: 20 }}>
          {review.result}
        </span>
      </div>
      {review.comment && <p style={{ fontSize: 13, color: "#7a7268", lineHeight: 1.8, letterSpacing: "0.04em" }}>{review.comment}</p>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c9a96e", textTransform: "uppercase", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", borderBottom: "1px solid #1e1c1a", paddingBottom: 10, display: "inline-block" }}>
      {children}
    </p>
  );
}

function FormSection({ label, required, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: "#7a7268", letterSpacing: "0.12em", marginBottom: 8, textTransform: "uppercase" }}>
        {label} {required && <span style={{ color: "#c9a96e" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "#1a1814",
  border: "1px solid #2a2620",
  borderRadius: 3,
  padding: "12px 16px",
  color: "#e8e0d4",
  fontSize: 14,
  outline: "none",
  letterSpacing: "0.04em",
};

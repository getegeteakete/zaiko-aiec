import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { supabase } from "./lib/supabase";
import { useProducts, useCustomers, useOrders, useArticles, useChatSessions, useSuppliers, useMasterData, createOrder, updateOrderStatus, updateProduct, updateStock, createCustomer, createArticle, sendChatMessage, logInventoryChange, useBillingSettings, useInvoices, upsertBillingSetting, createInvoice, updateInvoiceStatus } from "./lib/hooks";
import { CategoryIcon, Icons } from "./warehouse-icons";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTEXT & STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PRODUCTS = [
  { id: "p1", name: "クラフト手提げ袋 小", category: "手提げ袋", price: 18, stock: 5000, unit: "枚", image: "bag", sku: "KB-S-001", description: "未晒クラフト紙 120g/㎡。W220×D120×H250mm。丸紐付き。", rating: 4.5 },
  { id: "p2", name: "クラフト手提げ袋 中", category: "手提げ袋", price: 25, stock: 3200, unit: "枚", image: "bag", sku: "KB-M-001", description: "未晒クラフト紙 120g/㎡。W320×D115×H310mm。丸紐付き。", rating: 4.7 },
  { id: "p3", name: "クラフト手提げ袋 大", category: "手提げ袋", price: 35, stock: 2800, unit: "枚", image: "bag", sku: "KB-L-001", description: "未晒クラフト紙 120g/㎡。W380×D150×H500mm。平紐付き。", rating: 4.6 },
  { id: "p4", name: "白無地 手提げ袋 S", category: "手提げ袋", price: 22, stock: 4500, unit: "枚", image: "bag", sku: "WB-S-001", description: "晒クラフト紙 100g/㎡。W220×D120×H250mm。紙平紐。", rating: 4.4 },
  { id: "p5", name: "カラー手提げ袋 赤 M", category: "カラー袋", price: 38, stock: 1800, unit: "枚", image: "bag", sku: "CB-R-M01", description: "カラークラフト紙。W320×D115×H310mm。アクリル丸紐。", rating: 4.8 },
  { id: "p6", name: "カラー手提げ袋 ネイビー M", category: "カラー袋", price: 38, stock: 2200, unit: "枚", image: "bag", sku: "CB-N-M01", description: "カラークラフト紙。W320×D115×H310mm。アクリル丸紐。", rating: 4.8 },
  { id: "p7", name: "マットラミネート袋 黒 M", category: "ラミネート袋", price: 65, stock: 1200, unit: "枚", image: "bag", sku: "ML-B-M01", description: "マットPP加工。W320×D115×H310mm。ロープ紐。高級感。", rating: 4.9 },
  { id: "p8", name: "グロスラミネート袋 白 L", category: "ラミネート袋", price: 85, stock: 800, unit: "枚", image: "bag", sku: "GL-W-L01", description: "光沢PP加工。W380×D150×H500mm。ロープ紐。光沢仕上げ。", rating: 4.7 },
  { id: "p9", name: "ボトル用紙袋 ワイン1本", category: "ボトル袋", price: 42, stock: 1500, unit: "枚", image: "bag", sku: "BT-W-001", description: "ワインボトル1本用。W130×D90×H360mm。紐付き。", rating: 4.6 },
  { id: "p10", name: "ボトル用紙袋 ワイン2本", category: "ボトル袋", price: 58, stock: 900, unit: "枚", image: "bag", sku: "BT-W-002", description: "ワインボトル2本用。W200×D90×H360mm。仕切り付き。", rating: 4.5 },
  { id: "p11", name: "平袋 茶 中", category: "平袋", price: 8, stock: 10000, unit: "枚", image: "bag", sku: "FB-B-M01", description: "未晒クラフト紙。W200×H280mm。食品包装にも。", rating: 4.3 },
  { id: "p12", name: "角底紙袋 白 小", category: "角底袋", price: 12, stock: 8000, unit: "枚", image: "bag", sku: "SB-W-S01", description: "晒クラフト紙。W130×D80×H235mm。パン・菓子用。", rating: 4.4 },
  { id: "p13", name: "角底紙袋 茶 大", category: "角底袋", price: 15, stock: 6000, unit: "枚", image: "bag", sku: "SB-B-L01", description: "未晒クラフト紙。W260×D100×H360mm。テイクアウト用。", rating: 4.5 },
  { id: "p14", name: "宅配袋 A4サイズ", category: "宅配袋", price: 28, stock: 3000, unit: "枚", image: "bag", sku: "DL-A4-01", description: "テープ付き宅配用紙袋。W250×D50×H340mm。", rating: 4.6 },
  { id: "p15", name: "宅配袋 B4サイズ", category: "宅配袋", price: 35, stock: 2500, unit: "枚", image: "bag", sku: "DL-B4-01", description: "テープ付き宅配用紙袋。W320×D50×H400mm。", rating: 4.5 },
  { id: "p16", name: "リボン付きギフト袋 S", category: "ギフト袋", price: 55, stock: 1000, unit: "枚", image: "bag", sku: "GF-R-S01", description: "リボン付きギフト用。W180×D100×H250mm。結婚式・記念品。", rating: 4.9 },
  { id: "p17", name: "窓付き紙袋 食品用 M", category: "食品用袋", price: 20, stock: 4000, unit: "枚", image: "bag", sku: "FD-W-M01", description: "透明窓付き。W150×D90×H280mm。焼き菓子・パン用。", rating: 4.7 },
  { id: "p18", name: "耐水紙袋 フラワー用 L", category: "フラワー袋", price: 48, stock: 600, unit: "枚", image: "bag", sku: "FL-L-001", description: "耐水加工。W350×D150×H450mm。花束・鉢植え用。", rating: 4.6 },
  { id: "p19", name: "エコバッグ型紙袋 M", category: "エコ袋", price: 30, stock: 2000, unit: "枚", image: "bag", sku: "EC-M-001", description: "再生紙100%。W320×D115×H310mm。FSC認証。", rating: 4.8 },
  { id: "p20", name: "OPP透明袋 A4", category: "透明袋", price: 5, stock: 15000, unit: "枚", image: "bag", sku: "OP-A4-01", description: "テープ付きOPP袋。W225×H310+40mm。カタログ・DM用。", rating: 4.4 },
];

const CATEGORIES = ["すべて", "手提げ袋", "カラー袋", "ラミネート袋", "ボトル袋", "平袋", "角底袋", "宅配袋", "ギフト袋", "食品用袋", "フラワー袋", "エコ袋", "透明袋"];

const CUSTOMERS = [
  { id: "c1", companyName: "花よし生花店", contactName: "花田 美咲", email: "hanada@hanayoshi.jp", phone: "03-5555-1234", tier: "プラチナ", totalOrders: 96, totalSpent: 18500000 },
  { id: "c2", companyName: "パティスリー・ルミエール", contactName: "佐藤 シェフ", email: "sato@lumiere.jp", phone: "045-2345-6789", tier: "ゴールド", totalOrders: 64, totalSpent: 12800000 },
  { id: "c3", companyName: "ワインショップ・ソムリエ", contactName: "田中 裕介", email: "tanaka@tanaka-kensetsu.jp", phone: "052-3456-7890", tier: "ゴールド", totalOrders: 48, totalSpent: 9600000 },
  { id: "c4", companyName: "アパレルセレクト TOKYO", contactName: "鈴木 麻衣", email: "suzuki@suzuki-sangyo.jp", phone: "06-4567-8901", tier: "シルバー", totalOrders: 32, totalSpent: 6400000 },
  { id: "c5", companyName: "ECサポート物流", contactName: "高橋 健太", email: "takahashi@takahashi-komu.jp", phone: "092-5678-9012", tier: "スタンダード", totalOrders: 15, totalSpent: 3200000 },
];

const generateOrders = () => [
  { id: "o1", orderNumber: "PO-2024-0001", customerId: "c1", customerName: "花よし生花店", items: [{ productId: "p1", productName: "クラフト手提げ袋 小", quantity: 500, unitPrice: 18 }, { productId: "p5", productName: "カラー手提げ袋 赤 M", quantity: 200, unitPrice: 38 }], total: 16600, status: "配達完了", paymentStatus: "決済済", orderDate: "2024-01-15", deliveryDate: "2024-01-17", paymentMethod: "銀行振込", carrier: "ヤマト運輸", trackingNumber: "1234-5678-9012" },
  { id: "o2", orderNumber: "PO-2024-0002", customerId: "c2", customerName: "パティスリー・ルミエール", items: [{ productId: "p12", productName: "角底紙袋 白 小", quantity: 1000, unitPrice: 12 }, { productId: "p17", productName: "窓付き紙袋 食品用 M", quantity: 500, unitPrice: 20 }], total: 22000, status: "発送済", paymentStatus: "決済済", orderDate: "2024-01-16", deliveryDate: "2024-01-18", paymentMethod: "クレジットカード", carrier: "佐川急便", trackingNumber: "9876-5432-1098" },
  { id: "o3", orderNumber: "PO-2024-0003", customerId: "c3", customerName: "ワインショップ・ソムリエ", items: [{ productId: "p9", productName: "ボトル用紙袋 ワイン1本", quantity: 300, unitPrice: 42 }, { productId: "p10", productName: "ボトル用紙袋 ワイン2本", quantity: 200, unitPrice: 58 }], total: 24200, status: "処理中", paymentStatus: "未決済", orderDate: "2024-01-17", paymentMethod: "銀行振込" },
  { id: "o4", orderNumber: "PO-2024-0004", customerId: "c4", customerName: "アパレルセレクト TOKYO", items: [{ productId: "p7", productName: "マットラミネート袋 黒 M", quantity: 500, unitPrice: 65 }, { productId: "p8", productName: "グロスラミネート袋 白 L", quantity: 300, unitPrice: 85 }], total: 58000, status: "確認待ち", paymentStatus: "未決済", orderDate: "2024-01-17", paymentMethod: "銀行振込" },
  { id: "o5", orderNumber: "PO-2024-0005", customerId: "c1", customerName: "花よし生花店", items: [{ productId: "p18", productName: "耐水紙袋 フラワー用 L", quantity: 200, unitPrice: 48 }], total: 9600, status: "配達完了", paymentStatus: "決済済", orderDate: "2024-01-14", deliveryDate: "2024-01-15", paymentMethod: "銀行振込", carrier: "西濃運輸", trackingNumber: "5555-6666-7777" },
  { id: "o6", orderNumber: "PO-2024-0006", customerId: "c5", customerName: "ECサポート物流", items: [{ productId: "p14", productName: "宅配袋 A4サイズ", quantity: 2000, unitPrice: 28 }, { productId: "p15", productName: "宅配袋 B4サイズ", quantity: 1000, unitPrice: 35 }], total: 91000, status: "確認済", paymentStatus: "未決済", orderDate: "2024-01-18", paymentMethod: "銀行振込" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Icons & CategoryIcon imported from ./warehouse-icons

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const fmt = (n) => new Intl.NumberFormat("ja-JP").format(n);
const statusColors = {
  delivered: { bg: "bg-green-100", text: "text-green-800", label: "配達完了" },
  shipped: { bg: "bg-blue-100", text: "text-blue-800", label: "配送中" },
  processing: { bg: "bg-yellow-100", text: "text-yellow-800", label: "処理中" },
  confirmed: { bg: "bg-purple-100", text: "text-purple-800", label: "確認済" },
  pending: { bg: "bg-orange-100", text: "text-orange-800", label: "保留" },
  paid: { bg: "bg-green-100", text: "text-green-800", label: "入金済" },
  "配達完了": { bg: "bg-green-100", text: "text-green-800", label: "配達完了" },
  "配送中": { bg: "bg-purple-100", text: "text-purple-800", label: "配送中" },
  "発送済": { bg: "bg-blue-100", text: "text-blue-800", label: "発送済" },
  "処理中": { bg: "bg-yellow-100", text: "text-yellow-800", label: "処理中" },
  "確認待ち": { bg: "bg-orange-100", text: "text-orange-800", label: "確認待ち" },
  "確認済": { bg: "bg-blue-100", text: "text-blue-800", label: "確認済" },
  "未発送": { bg: "bg-yellow-100", text: "text-yellow-800", label: "未発送" },
  "キャンセル": { bg: "bg-red-100", text: "text-red-800", label: "キャンセル" },
  "決済済": { bg: "bg-green-100", text: "text-green-800", label: "決済済" },
  "未決済": { bg: "bg-yellow-100", text: "text-yellow-800", label: "未決済" },
  "公開済": { bg: "bg-green-100", text: "text-green-800", label: "公開済" },
  "下書き": { bg: "bg-gray-100", text: "text-gray-600", label: "下書き" },
  "緊急": { bg: "bg-red-100", text: "text-red-800", label: "緊急" },
  "対応中": { bg: "bg-blue-100", text: "text-blue-800", label: "対応中" },
  "解決済": { bg: "bg-green-100", text: "text-green-800", label: "解決済" },
  "正常": { bg: "bg-green-100", text: "text-green-800", label: "正常" },
  "在庫少": { bg: "bg-yellow-100", text: "text-yellow-800", label: "在庫少" },
  "危険": { bg: "bg-red-100", text: "text-red-800", label: "危険" },
  "通常": { bg: "bg-gray-100", text: "text-gray-600", label: "通常" },
  "完了": { bg: "bg-green-100", text: "text-green-800", label: "完了" },
  "有効": { bg: "bg-green-100", text: "text-green-800", label: "有効" },
};
const tierColors = { プラチナ: "bg-gray-700 text-white", ゴールド: "bg-yellow-600 text-white", シルバー: "bg-gray-200 text-gray-800", スタンダード: "bg-orange-100 text-orange-800" };

const Badge = ({ status }) => {
  const s = statusColors[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOP PAGE — BtoB EC STOREFRONT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LandingPage = () => {
  const { navigate, addToCart, cart, products } = useApp();
  const [selectedCat, setSelectedCat] = useState("すべて");
  const [searchQ, setSearchQ] = useState("");
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const filtered = products.filter(p => (selectedCat === "すべて" || p.category === selectedCat) && (!searchQ || p.name.includes(searchQ) || p.sku.includes(searchQ)));
  const featured = products.filter(p => p.stock > 50).slice(0, 4);

  return (
    <div className="min-h-screen bg-grid" style={{background: 'var(--slate-50)'}}>
      {/* ── Top Bar ── */}
      <div className="bg-industrial text-white/70 text-xs py-1.5 px-4 flex items-center justify-between">
        <span>シンガタ株式会社 - 法人向け紙袋・包装資材の卸売 ｜ 最短翌日配送 ｜ 掛売対応</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("buyer/account")} className="hover:text-white transition">マイアカウント</button>
          <button onClick={() => navigate("operator")} className="hover:text-white transition">管理者ログイン</button>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container flex items-center justify-between py-3 gap-4">
          <button onClick={() => navigate("landing")} className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="シンガタ" className="h-8 w-auto"/>
            
            
          </button>
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <Icons.search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="商品名・型番・SKUで検索..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" style={{borderRadius:'var(--radius)'}} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("buyer/chat")} className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded transition" style={{background:'var(--steel-50)',color:'var(--steel-500)'}}><Icons.brain size={14} /> AIに相談</button>
            <button onClick={() => navigate("buyer")} className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded transition hover:bg-gray-100" style={{color:'var(--slate-600)'}}><Icons.orders size={14} /> 注文履歴</button>
            <button onClick={() => navigate("cart")} className="relative p-2 hover:bg-gray-100 rounded transition">
              <Icons.cart size={20} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold" style={{background:'var(--amber-500)'}}>{cartCount}</span>}
            </button>
          </div>
        </div>
        {/* Category Bar */}
        <div className="container pb-2 flex gap-1 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCat(c)} className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition ${selectedCat === c ? "text-white" : "text-gray-600 hover:bg-gray-100"}`} style={selectedCat === c ? {background:'var(--steel-500)'} : {}}>{c}</button>
          ))}
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="hero-banner py-10 sm:py-14 px-4 relative">
        <div className="container relative z-10 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-block mb-3 px-3 py-1 rounded text-xs font-semibold" style={{background:'rgba(212,147,10,.15)',color:'var(--amber-400)'}}>法人専用 ｜ 掛率対応 ｜ AI在庫提案</div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
              紙袋・包装資材の<br/><span className="text-gradient">プロ向け紙袋卸売</span>
            </h1>
            <p className="text-white/50 text-sm sm:text-base mb-6 max-w-lg leading-relaxed">手提げ袋・ラミネート袋・ギフト袋・宅配袋など、200種類以上の紙袋をオンラインで。小ロットから大量注文まで、AIが最適な提案をご案内します。</p>
            <div className="flex gap-3">
              <button onClick={() => document.getElementById('products')?.scrollIntoView({behavior:'smooth'})} className="btn-primary px-6 py-3 text-sm font-bold" style={{background:'var(--amber-500)'}}>商品を見る ↓</button>
              <button onClick={() => navigate("buyer")} className="px-6 py-3 border border-white/20 text-white/80 rounded text-sm font-medium hover:bg-white/10 transition" style={{borderRadius:'var(--radius)'}}>マイページ</button>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3 w-80">
            {featured.map((p, i) => (
              <div key={p.id} className="bg-white/5 backdrop-blur border border-white/10 rounded p-3 animate-fade-up" style={{animationDelay:`${i*0.1}s`, borderRadius:'var(--radius)'}}>
                <div className="flex justify-center mb-1"><CategoryIcon category={p.category} size={32} /></div>
                <p className="text-xs text-white/70 truncate">{p.name}</p>
                <p className="text-xs font-bold text-amber-400">¥{fmt(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KPI Strip ── */}
      <div className="container -mt-5 relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[{v:"200+",l:"取扱商品数",Ic:Icons.package},{v:"翌日",l:"最短配送",Ic:Icons.truck},{v:"24h",l:"受注対応",Ic:Icons.bell},{v:"AI",l:"在庫自動提案",Ic:Icons.brain}].map((k,i) => (
          <div key={i} className="card p-4 flex items-center gap-3 animate-fade-up" style={{animationDelay:`${i*0.08}s`}}>
            <k.Ic size={24}/>
            <div><p className="font-display font-extrabold text-lg" style={{color:'var(--navy-900)'}}>{k.v}</p><p className="text-xs" style={{color:'var(--slate-400)'}}>{k.l}</p></div>
          </div>
        ))}
      </div>

      {/* ── Products Section ── */}
      <section id="products" className="container pb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-lg" style={{color:'var(--navy-900)'}}>商品一覧</h2>
            <p className="text-xs" style={{color:'var(--slate-400)'}}>{filtered.length}件の商品</p>
          </div>
          <div className="relative sm:hidden">
            <Icons.search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="検索..." className="pl-8 pr-3 py-1.5 border border-gray-200 rounded text-xs w-40 focus:outline-none"/>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((p, i) => (
            <div key={p.id} className="product-card cursor-pointer animate-fade-up" style={{animationDelay:`${i*0.04}s`}} onClick={() => navigate("ec")}>
              <div className="bg-gray-50 flex items-center justify-center text-4xl sm:text-5xl py-6 relative">
                <CategoryIcon category={p.category} size={24} />
                {p.stock < 30 && <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded font-semibold" style={{background:'var(--danger)',color:'#fff',fontSize:'10px'}}>残少</span>}
              </div>
              <div className="p-3">
                <p className="text-xs mb-0.5" style={{color:'var(--slate-400)'}}>{p.category} ｜ {p.sku}</p>
                <h3 className="text-sm font-semibold mb-1 line-clamp-2" style={{color:'var(--navy-900)'}}>{p.name}</h3>
                <p className="text-xs mb-2 line-clamp-2" style={{color:'var(--slate-400)'}}>{p.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-base" style={{color:'var(--steel-500)'}}>¥{fmt(p.price)}</span>
                    <span className="text-xs ml-0.5" style={{color:'var(--slate-400)'}}>/{p.unit}</span>
                  </div>
                  <button onClick={e => {e.stopPropagation(); addToCart(p);}} className="p-1.5 rounded transition hover:shadow" style={{background:'var(--steel-50)',color:'var(--steel-500)'}}><Icons.cart size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">該当する商品がありません</div>}
      </section>

      {/* ── Footer ── */}
      <footer className="bg-industrial text-white/40 py-8 px-4 relative">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2"><img src="/logo.png" alt="シンガタ" className="h-6 w-auto opacity-60"/></div>
          <div className="flex gap-4 text-xs">
            <button onClick={() => navigate("operator")} className="hover:text-white transition">管理者ページ</button>
            <button onClick={() => navigate("buyer")} className="hover:text-white transition">マイページ</button>
            <button onClick={() => navigate("buyer/chat")} className="hover:text-white transition">お問い合わせ</button>
          </div>
          <p className="text-xs">© 2024 シンガタ株式会社</p>
        </div>
      </footer>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EC STORE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ECStore = () => {
  const { cart, addToCart, navigate, products } = useApp();
  const [selectedCat, setSelectedCat] = useState("すべて");
  const [searchQ, setSearchQ] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products.filter(p => (selectedCat === "すべて" || p.category === selectedCat) && (p.name.includes(searchQ) || p.category.includes(searchQ)));
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ECHeader cartCount={cartCount} />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6"><Icons.arrowLeft size={16} /> 商品一覧に戻る</button>
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-center justify-center bg-gray-50 rounded-xl py-12"><CategoryIcon category={selectedProduct.category} size={100} /></div>
            <div>
              <span className="text-xs text-gray-400">{selectedProduct.sku}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">{selectedProduct.category}</span>
              <h1 className="text-2xl font-bold mt-2 mb-3">{selectedProduct.name}</h1>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Icons.star key={i} size={14} />)}
                <span className="text-xs text-gray-400 ml-1">{selectedProduct.rating}</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{selectedProduct.description}</p>
              <div className="text-3xl font-bold text-blue-600 mb-2">¥{fmt(selectedProduct.price)}<span className="text-sm text-gray-400 font-normal ml-1">/{selectedProduct.unit}</span></div>
              <p className="text-sm text-green-600 mb-6">在庫: {selectedProduct.stock}{selectedProduct.unit}</p>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2">
                <Icons.cart size={18} /> カートに追加
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ECHeader cartCount={cartCount} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Icons.search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="商品を検索..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
        </div>
        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedCat === c ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>{c}</button>
          ))}
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer group overflow-hidden">
              <div className="bg-gray-50 flex items-center justify-center py-8 group-hover:scale-105 transition"><CategoryIcon category={p.category} size={80} /></div>
              <div className="p-4">
                <span className="text-xs text-gray-400">{p.category}</span>
                <h3 className="font-semibold text-sm mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 transition">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">¥{fmt(p.price)}</span>
                  <button onClick={e => { e.stopPropagation(); addToCart(p); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Icons.cart size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-20 text-gray-400">商品が見つかりません</div>}
      </div>
    </div>
  );
};

const ECHeader = ({ cartCount }) => {
  const { navigate } = useApp();
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("landing")} className="text-xl font-black text-gray-900 flex items-center gap-2"><img src="/logo.png" alt="シンガタ" style={{height:"28px"}}/></button>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("operator")} className="text-sm text-gray-500 hover:text-gray-700">管理画面</button>
          <button onClick={() => navigate("cart")} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Icons.cart size={20} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CART PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CartPage = () => {
  const { cart, updateCartQty, removeFromCart, navigate, clearCart, checkout } = useApp();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  if (checkoutDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">注文完了</h2>
          <p className="text-gray-500 mb-6">ご注文ありがとうございます。<br />注文番号: ORD-2024-{String(Math.floor(Math.random() * 9000 + 1000)).padStart(4, "0")}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setCheckoutDone(false); navigate("ec"); }} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">買い物を続ける</button>
            <button onClick={() => { setCheckoutDone(false); navigate("operator/orders"); }} className="px-6 py-2 border rounded-lg text-gray-600">注文管理を見る</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ECHeader cartCount={cart.reduce((s, c) => s + c.quantity, 0)} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate("ec")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4"><Icons.arrowLeft size={16} /> 買い物を続ける</button>
        <h1 className="text-2xl font-bold mb-6">カート ({cart.length}件)</h1>
        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="mb-4"><Icons.cart size={48}/></div>
            <p className="text-gray-400 mb-4">カートは空です</p>
            <button onClick={() => navigate("ec")} className="px-6 py-2 bg-blue-600 text-white rounded-lg">商品を探す</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg shrink-0"><CategoryIcon category={item.category} size={32} /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-blue-600 font-bold">¥{fmt(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQty(item.id, -1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"><Icons.minus size={14} /></button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50"><Icons.plus size={14} /></button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold">¥{fmt(item.price * item.quantity)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition"><Icons.trash size={16} /></button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border p-6 h-fit sticky top-20">
              <h3 className="font-bold mb-4">注文サマリー</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">小計</span><span>¥{fmt(total)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">配送料</span><span className="text-green-600">無料</span></div>
                <div className="flex justify-between"><span className="text-gray-500">消費税 (10%)</span><span>¥{fmt(Math.floor(total * 0.1))}</span></div>
              </div>
              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between font-bold text-lg"><span>合計</span><span className="text-blue-600">¥{fmt(Math.floor(total * 1.1))}</span></div>
              </div>
              <button onClick={async () => { const ok = await checkout(); if(ok) setCheckoutDone(true); }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition">注文確定</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OPERATOR DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const OperatorLayout = ({ children }) => {
  const { page, navigate, aiChatOpen, setAiChatOpen } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { group: "基本", color: "#67B8E3", items: [
      { id: "operator", label: "ダッシュボード", icon: Icons.home },
    ]},
    { group: "受注・顧客管理", color: "#FACC15", items: [
      { id: "operator/orders", label: "受注管理", icon: Icons.orders },
      { id: "operator/payments", label: "決済管理", icon: Icons.dollar },
      { id: "operator/billing", label: "請求管理", icon: Icons.orders },
      { id: "operator/shipping", label: "発送管理", icon: Icons.truck },
      { id: "operator/analytics", label: "売上分析", icon: Icons.chart },
      { id: "operator/customers", label: "顧客管理", icon: Icons.users },
    ]},
    { group: "仕入・在庫管理", color: "#F9A8D4", items: [
      { id: "operator/products", label: "商品管理", icon: Icons.package },
      { id: "operator/inventory", label: "在庫管理", icon: Icons.inventory },
      { id: "operator/procurement", label: "仕入管理", icon: Icons.package },
      { id: "operator/pricing", label: "価格・掛率管理", icon: Icons.dollar },
    ]},
    { group: "AI機能", color: "#4ADE80", items: [
      { id: "operator/ai-analytics", label: "AI分析センター", icon: Icons.brain },
      { id: "operator/ai-articles", label: "AI記事生成", icon: Icons.orders },
      { id: "operator/chats", label: "チャット管理", icon: Icons.brain },
    ]},
    { group: "システム", color: "#94A3B8", items: [
      { id: "operator/master", label: "マスタ管理", icon: Icons.settings },
      { id: "operator/settings", label: "設定", icon: Icons.settings },
    ]},
  ];

  const Sidebar = ({ mobile }) => (
    <aside className={`${mobile ? "fixed inset-0 z-50 flex" : "hidden md:flex"} flex-col`}>
      {mobile && <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />}
      <div className={`${mobile ? "relative z-10" : ""} ${collapsed && !mobile ? "w-16" : "w-60"} h-screen bg-gray-950 text-white flex flex-col transition-all`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {(!collapsed || mobile) && <span className="font-black text-lg"><img src="/logo.png" alt="シンガタ" style={{height:"28px"}}/></span>}
          <button onClick={() => mobile ? setMobileOpen(false) : setCollapsed(!collapsed)} className="p-1 hover:bg-white/10 rounded"><Icons.menu size={18} /></button>
        </div>
        <nav className="flex-1 py-1 overflow-y-auto">
          {menu.map(g => (
            <div key={g.group}>
              {(!collapsed || mobile) && (
                <div className="flex items-center gap-2 px-4 pt-4 pb-1">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{background: g.color}}/>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{color: g.color}}>{g.group}</span>
                </div>
              )}
              {collapsed && !mobile && <div className="mx-3 my-2 border-t" style={{borderColor: g.color + '40'}}/>}
              {g.items.map(m => (
                <button key={m.id} onClick={() => { navigate(m.id); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition ${
                    page === m.id
                      ? "font-semibold"
                      : "text-white/50 hover:text-white"
                  }`}
                  style={page === m.id ? {color: g.color, background: g.color + '15', borderRight: `3px solid ${g.color}`} : {}}
                >
                  <m.icon size={17} />
                  {(!collapsed || mobile) && <span>{m.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {(!collapsed || mobile) && (
          <div className="p-3 border-t border-white/10 space-y-1">
            <button onClick={() => navigate("buyer")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition">
              <Icons.cart size={16}/> 購入者画面
            </button>
            <button onClick={() => navigate("ec")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition">
              <Icons.store size={16}/> ECストアを開く
            </button>
            <button onClick={() => navigate("landing")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition">
              <Icons.home size={16}/> トップに戻る
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50" data-theme="dark">
      <Sidebar />
      {mobileOpen && <Sidebar mobile />}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        {(() => { const g = menu.find(g => g.items.some(m => m.id === page)); const c = g?.color || '#67B8E3'; const gn = g?.group || '基本'; return (
        <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40" style={{borderTopWidth:'3px', borderTopColor: c}}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-1"><Icons.menu size={20} /></button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm" style={{background: c}}/>
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline" style={{color: c}}>{gn}</span>
            </div>
            <h2 className="font-semibold text-sm sm:text-base">{menu.flatMap(g=>g.items).find(m => m.id === page)?.label || "ダッシュボード"}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAiChatOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
              <Icons.brain size={16} /> AIアシスト
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Icons.bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>
        );})()}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
      {/* AI Chat */}
      {aiChatOpen && <AIChat />}
    </div>
  );
};

// Dashboard
const DashboardPage = () => {
  const { navigate, products, orders, customers } = useApp();
  const kpis = [
    { label: "今月の売上", value: `¥${fmt(orders.reduce((s, o) => s + o.total, 0))}`, change: "+12.5%", color: "text-green-600", icon: Icons.dollar },
    { label: "受注件数", value: orders.length, change: "+8.3%", color: "text-green-600", icon: Icons.orders },
    { label: "顧客数", value: customers.length, change: "+2.1%", color: "text-green-600", icon: Icons.users },
    { label: "在庫アイテム", value: products.length, change: "-3件 低在庫", color: "text-yellow-600", icon: Icons.package },
  ];

  const chartData = [
    { month: "1月", sales: 1200000 }, { month: "2月", sales: 1380000 }, { month: "3月", sales: 1560000 },
    { month: "4月", sales: 1420000 }, { month: "5月", sales: 1690000 }, { month: "6月", sales: 1850000 },
  ];
  const maxSales = Math.max(...chartData.map(d => d.sales));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{k.label}</span>
              <k.icon size={18} className="text-gray-300" />
            </div>
            <div className="text-2xl font-bold mb-1">{k.value}</div>
            <span className={`text-xs font-medium ${k.color}`}>{k.change}</span>
          </div>
        ))}
      </div>

      {/* Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4">月別売上推移</h3>
          <div className="flex items-end gap-3 h-48">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">¥{(d.sales / 10000).toFixed(0)}万</span>
                <div className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600" style={{ height: `${(d.sales / maxSales) * 140}px` }} />
                <span className="text-xs text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">最近の受注</h3>
            <button onClick={() => navigate("operator/orders")} className="text-xs text-blue-600 hover:underline">すべて見る</button>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 4).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{o.customerName}</p>
                  <p className="text-xs text-gray-400">{o.orderNumber} · {o.orderDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">¥{fmt(o.total)}</p>
                  <Badge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold mb-4">在庫アラート</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.filter(p => p.stock < 50).map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <CategoryIcon category={p.category} size={24} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-yellow-700">残り {p.stock}{p.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Orders Page
const OrdersPage = () => {
  const { orders, navigate, refetchOrders } = useApp();
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const STATUSES = ["確認待ち","確認済","処理中","発送済","配達完了","キャンセル"];
  const PAY_STATUSES = ["未決済","決済済"];

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    refetchOrders();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div><h2 className="font-semibold text-sm">受注管理</h2><p className="text-xs text-gray-500">注文の確認・処理・ステータス管理</p></div>
        <button onClick={()=>alert("新規受注登録フォームを表示します")} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">新規受注登録</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {[{ v: "all", l: "すべて" }, { v: "確認待ち", l: "確認待ち" }, { v: "確認済", l: "確認済" }, { v: "処理中", l: "処理中" }, { v: "発送済", l: "発送済" }, { v: "配達完了", l: "配達完了" }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 rounded-lg text-sm transition ${filter === f.v ? "bg-blue-600 text-white" : "bg-white border text-gray-600"}`}>{f.l}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["注文番号", "顧客名", "商品", "合計", "ステータス", "決済", "日付"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-sm">{o.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{o.items?.[0]?.productName||"—"}{(o.items?.length||0) > 1 ? ` 他${(o.items?.length||0) - 1}件` : ""}</td>
                  <td className="px-4 py-3 text-sm font-bold">¥{fmt(o.total)}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)} className="text-xs border rounded px-1.5 py-1 bg-transparent">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3"><Badge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{o.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Products Page
const ProductsPage = () => {
  const { products } = useApp();
  const [localProducts, setLocalProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="font-semibold text-sm">商品管理</h2><p className="text-xs text-gray-500">商品マスタの登録・編集・在庫確認（{products.length}件）</p></div>
        <button onClick={()=>alert("新規商品登録フォームを表示します")} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1"><Icons.plus size={16} /> 新規商品登録</button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["", "商品名", "SKU", "カテゴリ", "規格", "基準価格", "在庫", "在庫状態"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition cursor-pointer" onClick={() => setEditing(editing === p.id ? null : p.id)}>
                  <td className="px-4 py-3"><CategoryIcon category={p.category} size={24} /></td>
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{p.sku}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">{p.category}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.description}</td>
                  <td className="px-4 py-3 text-sm font-bold">¥{fmt(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${p.stock < 50 ? "text-yellow-600" : "text-green-600"}`}>{p.stock}{p.unit}</span>
                  </td>
                  <td className="px-4 py-3"><Badge status={p.stock < 20 ? "危険" : p.stock < 50 ? "在庫少" : "正常"}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Customers Page
const CustomersPage = () => {const{customers}=useApp();return(
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div><h2 className="font-semibold text-sm">顧客管理</h2><p className="text-xs text-gray-500">取引先情報の管理・取引履歴・掛率設定</p></div>
      <button onClick={()=>alert("新規顧客登録フォームを表示します")} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">新規顧客登録</button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">総顧客数</p>
        <p className="text-2xl font-bold">{customers.length}</p>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">平均LTV</p>
        <p className="text-2xl font-bold">¥{fmt(Math.floor(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length))}</p>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">総受注額</p>
        <p className="text-2xl font-bold">¥{fmt(customers.reduce((s, c) => s + c.totalSpent, 0))}</p>
      </div>
    </div>
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["企業名", "担当者", "ティア", "注文数", "合計金額", "連絡先"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{c.companyName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.contactName}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[c.tier]}`}>{c.tier}</span></td>
                <td className="px-4 py-3 text-sm">{c.totalOrders}件</td>
                <td className="px-4 py-3 text-sm font-bold">¥{fmt(c.totalSpent)}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);};

// Inventory Page
const InventoryPage = () => {
  const { products, refetchProducts } = useApp();
  const [adjusting, setAdjusting] = useState(null);
  const [adjQty, setAdjQty] = useState(0);
  const [adjType, setAdjType] = useState("入庫");
  const [adjNote, setAdjNote] = useState("");

  const handleAdjust = async () => {
    if (!adjusting || adjQty <= 0) return;
    const p = products.find(x => x.id === adjusting);
    const newStock = adjType === "入庫" ? p.stock + adjQty : Math.max(0, p.stock - adjQty);
    await updateStock(adjusting, newStock);
    await logInventoryChange(adjusting, p.name, adjType, adjQty, adjNote || `${adjType} ${adjQty}${p.unit}`);
    setAdjusting(null); setAdjQty(0); setAdjNote("");
    refetchProducts();
  };

  return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div><h2 className="font-semibold text-sm">在庫管理</h2><p className="text-xs text-gray-500">在庫状況の確認・入出庫管理・アラート管理</p></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[
        { label: "総アイテム", value: products.length, color: "text-blue-600" },
        { label: "適正在庫", value: products.filter(p => p.stock >= 50).length, color: "text-green-600" },
        { label: "低在庫", value: products.filter(p => p.stock < 50 && p.stock > 0).length, color: "text-yellow-600" },
        { label: "欠品", value: products.filter(p => p.stock <= 0).length, color: "text-red-600" },
      ].map((k, i) => (
        <div key={i} className="bg-white rounded-xl border p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
          <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
        </div>
      ))}
    </div>

    {adjusting && (() => { const p = products.find(x=>x.id===adjusting); return (
      <div className="bg-white rounded-xl border p-5 space-y-3">
        <h3 className="font-semibold text-sm">在庫調整: {p?.name}</h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div><label className="text-xs text-gray-500 block mb-1">種別</label>
            <select value={adjType} onChange={e=>setAdjType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm"><option>入庫</option><option>出庫</option><option>棚卸し</option></select>
          </div>
          <div><label className="text-xs text-gray-500 block mb-1">数量</label>
            <input type="number" min="1" value={adjQty} onChange={e=>setAdjQty(parseInt(e.target.value)||0)} className="border rounded-lg px-3 py-2 text-sm w-24"/>
          </div>
          <div className="flex-1"><label className="text-xs text-gray-500 block mb-1">備考</label>
            <input value={adjNote} onChange={e=>setAdjNote(e.target.value)} placeholder="理由・メモ" className="border rounded-lg px-3 py-2 text-sm w-full"/>
          </div>
          <button onClick={handleAdjust} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">確定</button>
          <button onClick={()=>setAdjusting(null)} className="px-4 py-2 bg-white border rounded-lg text-sm">キャンセル</button>
        </div>
        <p className="text-xs text-gray-400">現在庫: {p?.stock}{p?.unit} → 調整後: {adjType==="入庫" ? p?.stock+adjQty : Math.max(0,p?.stock-adjQty)}{p?.unit}</p>
      </div>
    );})()}

    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["", "商品名", "SKU", "現在庫", "ステータス", "在庫バー", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...products].sort((a, b) => a.stock - b.stock).map(p => {
              const pct = Math.min(p.stock / 200 * 100, 100);
              const barColor = p.stock < 35 ? "bg-red-500" : p.stock < 60 ? "bg-yellow-500" : "bg-green-500";
              return (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3"><CategoryIcon category={p.category} size={24} /></td>
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{p.sku}</td>
                  <td className="px-4 py-3 text-sm font-bold">{p.stock}{p.unit}</td>
                  <td className="px-4 py-3">
                    {p.stock < 20 ? <Badge status="危険" /> : p.stock < 50 ? <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">低在庫</span> : <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">適正</span>}
                  </td>
                  <td className="px-4 py-3 w-40">
                    <div className="w-full bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} /></div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={()=>{setAdjusting(p.id);setAdjQty(0);setAdjType("入庫");}} className="text-xs text-blue-600 hover:underline">調整</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);};
// Analytics Page
const AnalyticsPage = () => {
  const { products, customers } = useApp();
  const catSales = CATEGORIES.filter(c => c !== "すべて").map(cat => ({
    category: cat,
    count: products.filter(p => p.category === cat).length,
    revenue: products.filter(p => p.category === cat).reduce((s, p) => s + p.price * p.stock, 0),
  }));
  const maxRev = Math.max(...catSales.map(c => c.revenue));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4">カテゴリ別売上</h3>
          <div className="space-y-3">
            {catSales.map(c => (
              <div key={c.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{c.category}</span>
                  <span className="text-gray-500">¥{fmt(c.revenue)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3"><div className="h-3 rounded-full bg-blue-500" style={{ width: `${(c.revenue / maxRev) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold mb-4">トップ商品</h3>
          <div className="space-y-3">
            {[...products].sort((a, b) => b.price * b.stock - a.price * a.stock).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="text-lg font-bold text-gray-300 w-6">{i + 1}</span>
                <CategoryIcon category={p.category} size={24} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">¥{fmt(p.price)} × {p.stock}</p>
                </div>
                <span className="font-bold text-sm">¥{fmt(p.price * p.stock)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold mb-4">顧客ティア分布</h3>
        <div className="flex flex-wrap gap-4">
          {["プラチナ", "ゴールド", "シルバー", "スタンダード"].map(t => {
            const count = customers.filter(c => c.tier === t).length;
            return (
              <div key={t} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border min-w-[180px]">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${tierColors[t]}`}>{t}</span>
                <span className="text-2xl font-bold">{count}</span>
                <span className="text-xs text-gray-400">社</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Settings Page
const SettingsPage = () => (
  <div className="max-w-2xl space-y-6">
    {[
      { title: "ストア情報", fields: [{ label: "店舗名", value: "シンガタ株式会社 BtoB卸デモ" }, { label: "メール", value: "admin@singata.co.jp" }, { label: "電話番号", value: "03-0000-0000" }] },
      { title: "通知設定", fields: [{ label: "新規注文通知", type: "toggle", value: true }, { label: "低在庫アラート", type: "toggle", value: true }, { label: "レポートメール", type: "toggle", value: false }] },
    ].map((section, i) => (
      <div key={i} className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold mb-4">{section.title}</h3>
        <div className="space-y-4">
          {section.fields.map((f, j) => (
            <div key={j} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">{f.label}</label>
              {f.type === "toggle" ? (
                <div className={`w-10 h-5 rounded-full cursor-pointer transition ${f.value ? "bg-blue-600" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm mt-0.5 transition ${f.value ? "ml-5" : "ml-0.5"}`} />
                </div>
              ) : (
                <input defaultValue={f.value} className="border rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ═══ Billing Management Page (BtoB請求管理) ═══
const BillingPage = () => {
  const { customers } = useApp();
  const { data: billingSettings, refetch: refetchSettings } = useBillingSettings();
  const { data: invoices, refetch: refetchInvoices } = useInvoices();
  const [tab, setTab] = useState("invoices");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [settingsForm, setSettingsForm] = useState({});

  const CYCLES = ["月末締め","15日締め","20日締め","即日","カスタム"];
  const DUE_TYPES = ["翌月末","翌月15日","翌月20日","翌々月末","30日後","60日後","即日"];
  const INV_STATUSES = { "未発行":"bg-gray-100 text-gray-600", "発行済":"bg-blue-100 text-blue-800", "送付済":"bg-purple-100 text-purple-800", "入金済":"bg-green-100 text-green-800", "一部入金":"bg-yellow-100 text-yellow-800", "延滞":"bg-red-100 text-red-800" };

  const handleSaveSettings = async () => {
    if (!editingCustomer) return;
    await upsertBillingSetting(editingCustomer, settingsForm);
    refetchSettings();
    setEditingCustomer(null);
    alert("請求設定を保存しました");
  };

  const handleGenerateInvoice = async (c) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    await createInvoice({ customerName: c.companyName, customerId: c.id, periodStart: start, periodEnd: end, items: [{ description: `${now.getMonth()+1}月分請求`, quantity: 1, unit_price: c.balance || 100000, amount: c.balance || 100000 }] });
    refetchInvoices();
    alert(`${c.companyName} の請求書を発行しました`);
  };

  const handleStatusChange = async (inv, newStatus) => {
    await updateInvoiceStatus(inv.id, newStatus, newStatus === "入金済" ? inv.total : undefined);
    refetchInvoices();
  };

  const getSettingsForCustomer = (cid) => billingSettings.find(b => b.customer_id === cid);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="font-semibold text-sm">請求管理</h2><p className="text-xs text-gray-500">会社ごとの請求設定・請求書発行・入金管理</p></div>
      </div>

      <div className="flex gap-2">
        {["invoices","settings"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? "bg-blue-600 text-white" : "bg-white border text-gray-600"}`}>
            {t === "invoices" ? "請求書一覧" : "会社別請求設定"}
          </button>
        ))}
      </div>

      {tab === "settings" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full"><thead className="bg-gray-50"><tr>
              {["会社名","締め日","支払期日","自動発行","税率","操作"].map(h => <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>{customers.map(c => {
              const s = getSettingsForCustomer(c.id);
              return (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{c.companyName}</td>
                  <td className="px-4 py-3 text-sm">{s?.billing_cycle || "未設定"}</td>
                  <td className="px-4 py-3 text-sm">{s?.payment_due_type || "未設定"}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${s?.auto_generate ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{s?.auto_generate ? "ON" : "OFF"}</span></td>
                  <td className="px-4 py-3 text-sm">{s?.tax_rate || 10}%</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => { setEditingCustomer(c.id); setSettingsForm({ billing_cycle: s?.billing_cycle || "月末締め", payment_due_type: s?.payment_due_type || "翌月末", payment_due_days: s?.payment_due_days || 30, auto_generate: s?.auto_generate ?? true, tax_rate: s?.tax_rate || 10, closing_day: s?.closing_day || 0 }); }} className="text-xs text-blue-600 hover:underline">設定変更</button>
                    <button onClick={() => handleGenerateInvoice(c)} className="text-xs text-green-600 hover:underline">請求書発行</button>
                  </td>
                </tr>
              );
            })}</tbody></table>
          </div>

          {editingCustomer && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <h3 className="font-semibold text-sm border-b pb-2">{customers.find(c=>c.id===editingCustomer)?.companyName} の請求設定</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">締め日</label>
                  <select value={settingsForm.billing_cycle} onChange={e => setSettingsForm({...settingsForm, billing_cycle: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {CYCLES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">支払期日</label>
                  <select value={settingsForm.payment_due_type} onChange={e => setSettingsForm({...settingsForm, payment_due_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {DUE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">税率 (%)</label>
                  <input type="number" value={settingsForm.tax_rate} onChange={e => setSettingsForm({...settingsForm, tax_rate: parseFloat(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">カスタム締め日 (1-28)</label>
                  <input type="number" min="0" max="28" value={settingsForm.closing_day} onChange={e => setSettingsForm({...settingsForm, closing_day: parseInt(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="0=月末"/>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" checked={settingsForm.auto_generate} onChange={e => setSettingsForm({...settingsForm, auto_generate: e.target.checked})} className="w-4 h-4"/>
                  <label className="text-sm">自動発行する</label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveSettings} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">保存</button>
                <button onClick={() => setEditingCustomer(null)} className="px-4 py-2 bg-white border text-gray-600 rounded-lg text-sm">キャンセル</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "invoices" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l:"総請求額", v:`¥${fmt(invoices.reduce((s,i)=>s+i.total,0))}` },
              { l:"入金済", v:`¥${fmt(invoices.filter(i=>i.status==="入金済").reduce((s,i)=>s+i.total,0))}` },
              { l:"未入金", v:`¥${fmt(invoices.filter(i=>i.status!=="入金済").reduce((s,i)=>s+i.total,0))}` },
              { l:"請求書数", v:`${invoices.length}件` },
            ].map((k,i)=><div key={i} className="bg-white rounded-xl border p-4"><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{k.l}</p><p className="text-xl font-bold">{k.v}</p></div>)}
          </div>
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full"><thead className="bg-gray-50"><tr>
              {["請求番号","顧客","期間","小計","税額","合計","ステータス","発行日","支払期日","操作"].map(h => <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>{invoices.map(inv => (
              <tr key={inv.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2.5 text-sm font-medium text-blue-600">{inv.invoice_number}</td>
                <td className="px-3 py-2.5 text-sm">{inv.customer_name}</td>
                <td className="px-3 py-2.5 text-xs text-gray-500">{inv.billing_period_start}〜{inv.billing_period_end}</td>
                <td className="px-3 py-2.5 text-sm">¥{fmt(inv.subtotal)}</td>
                <td className="px-3 py-2.5 text-sm text-gray-500">¥{fmt(inv.tax_amount)}</td>
                <td className="px-3 py-2.5 text-sm font-bold">¥{fmt(inv.total)}</td>
                <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded font-medium ${INV_STATUSES[inv.status]||"bg-gray-100 text-gray-600"}`}>{inv.status}</span></td>
                <td className="px-3 py-2.5 text-sm text-gray-500">{inv.issued_date||"—"}</td>
                <td className="px-3 py-2.5 text-sm text-gray-500">{inv.due_date||"—"}</td>
                <td className="px-3 py-2.5">
                  <select value={inv.status} onChange={e => handleStatusChange(inv, e.target.value)} className="text-xs border rounded px-1.5 py-1">
                    {Object.keys(INV_STATUSES).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}</tbody></table>
          </div>
        </div>
      )}
    </div>
  );
};

// Payments Page
const PaymentsPage = () => {
  const { orders } = useApp();
  const cn_paid = orders.filter(o=>o.paymentStatus==="決済済").reduce((s,o)=>s+o.total,0);
  const cn_total = orders.reduce((s,o)=>s+o.total,0);
  const orders_paid = orders.filter(o=>o.paymentStatus==="決済済").length;
  const orders_unpaid = orders.filter(o=>o.paymentStatus==="未決済").length;
  return (
  <div className="space-y-4">
    <div><h2 className="font-semibold text-sm">決済管理</h2><p className="text-xs text-gray-500">決済状況の確認と管理を行います</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[{l:"本日の決済額",v:`¥${fmt(cn_paid)}`,c:`${orders_paid}件の決済`},{l:"今月の決済額",v:`¥${fmt(cn_total)}`},{l:"累計決済額",v:`¥${fmt(cn_total*12)}`,c:"累計決済完了"},{l:"確認が必要な決済",v:`${orders_unpaid}件`}].map((k,i)=><div key={i} className="bg-white rounded-xl border p-4"><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{k.l}</p><p className="text-xl font-bold">{k.v}</p>{k.c&&<span className="text-xs text-gray-500">{k.c}</span>}</div>)}
    </div>
    <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>{["注文番号","顧客名","金額","決済方法","決済状況","決済日時"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
    <tbody>{orders.map(o=><tr key={o.id} className="border-t hover:bg-gray-50"><td className="px-4 py-2.5 text-sm text-blue-600 font-medium">{o.orderNumber}</td><td className="px-4 py-2.5 text-sm">{o.customerName}</td><td className="px-4 py-2.5 text-sm font-bold">¥{fmt(o.total)}</td><td className="px-4 py-2.5 text-sm text-gray-500">{o.paymentMethod}</td><td className="px-4 py-2.5"><Badge status={o.paymentStatus}/></td><td className="px-4 py-2.5 text-sm text-gray-500">{o.orderDate}</td></tr>)}</tbody></table></div>
  </div>
);};

// Shipping Page
const ShippingPage = () => {
  const { orders } = useApp();
  return (
  <div className="space-y-4">
    <div><h2 className="font-semibold text-sm">発送管理</h2><p className="text-xs text-gray-500">発送処理・追跡番号入力・配送状況管理</p></div>
    <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>{["注文番号","顧客","商品","ステータス","配送業者","追跡番号"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
    <tbody>{orders.map(o=><tr key={o.id} className="border-t hover:bg-gray-50"><td className="px-4 py-2.5 text-sm text-blue-600 font-medium">{o.orderNumber}</td><td className="px-4 py-2.5 text-sm">{o.customerName}</td><td className="px-4 py-2.5 text-sm text-gray-500">{o.items?.[0]?.productName||"—"}</td><td className="px-4 py-2.5"><Badge status={o.status==="配達完了"?"配達完了":o.status==="発送済"?"配送中":"未発送"}/></td><td className="px-4 py-2.5 text-sm text-gray-500">{o.carrier||"—"}</td><td className="px-4 py-2.5 text-xs font-mono text-gray-400">{o.trackingNumber||"—"}</td></tr>)}</tbody></table></div>
  </div>
);};

// Procurement Page
const ProcurementPage = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="font-semibold text-sm">仕入管理</h2><p className="text-xs text-gray-500">発注管理・仕入れ先管理・在庫補充提案</p></div><button onClick={()=>alert("新規発注フォームを表示します")} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">新規発注</button></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[{l:"発注総数",v:"24件",c:"今月: 8件"},{l:"今月の仕入れ額",v:`¥${fmt(3850000)}`,c:`累計: ¥${fmt(46200000)}`},{l:"処理待ち",v:"3件"},{l:"納品待ち",v:"5件"}].map((k,i)=><div key={i} className="bg-white rounded-xl border p-4"><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{k.l}</p><p className="text-xl font-bold">{k.v}</p>{k.c&&<span className="text-xs text-gray-500">{k.c}</span>}</div>)}
    </div>
    <div className="bg-white rounded-xl border p-4"><h3 className="font-semibold text-sm mb-3">仕入れ先一覧</h3>
      {[{n:"マルタカパルプ株式会社",c:"田中 太郎",t:"月末締め翌月末払い"},{n:"大昭和紙工産業株式会社",c:"佐藤 花子",t:"月末締め翌月15日払い"},{n:"福助工業株式会社",c:"鈴木 一郎",t:"月末締め翌月末払い"},{n:"シモジマ株式会社",c:"山田 次郎",t:"月末締め翌月20日払い"}].map((s,i)=><div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"><div><p className="text-sm font-medium">{s.n}</p><p className="text-xs text-gray-500">{s.c}</p></div><span className="text-xs text-gray-400">{s.t}</span></div>)}
    </div>
  </div>
);

// Pricing Page
const PricingPage = () => { const { customers } = useApp(); return (
  <div className="space-y-4">
    <h2 className="font-semibold text-sm">価格・掛率管理</h2>
    <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>{["顧客","ティア","掛率","適用価格例 (クラフト手提げ袋)","操作"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
    <tbody>{customers.map(c=>{const rate=c.tier==="プラチナ"?0.85:c.tier==="ゴールド"?0.88:c.tier==="シルバー"?0.92:0.95;return<tr key={c.id} className="border-t hover:bg-gray-50"><td className="px-4 py-2.5 text-sm font-medium">{c.companyName}</td><td className="px-4 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[c.tier]}`}>{c.tier}</span></td><td className="px-4 py-2.5 text-sm font-bold text-blue-600">{(rate*100).toFixed(0)}%</td><td className="px-4 py-2.5 text-sm">¥{fmt(Math.round(18*rate))}</td><td className="px-4 py-2.5"><button onClick={()=>alert("掛率変更フォームを表示します")} className="text-xs text-blue-600 hover:underline">掛率を変更</button></td></tr>;})}</tbody></table></div>
  </div>
);};

// AI Analytics Page
const AIAnalyticsPage = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="font-semibold text-sm">AI分析センター</h2><p className="text-xs text-gray-500">AIによる売上予測・在庫最適化・価格戦略分析</p></div><button onClick={()=>alert("AI分析を実行中...")} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium">AI分析を実行</button></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {[{l:"売れ筋分析",d:"過去データから売れ筋商品を予測し、在庫戦略を提案します。",c:"#2563EB"},{l:"在庫最適化",d:"需要予測に基づき、適正在庫量と発注タイミングを提案します。",c:"#16A34A"},{l:"価格戦略",d:"市場分析と競合比較から最適な価格設定を提案します。",c:"#F97316"},{l:"利益率改善",d:"コスト分析と販売データから利益率改善策を提案します。",c:"#7C3AED"}].map((card,i)=><div key={i} className="bg-white rounded-xl border p-4 hover:shadow-md transition cursor-pointer"><h3 className="font-semibold text-sm mb-1" style={{color:card.c}}>{card.l}</h3><p className="text-xs text-gray-500 mb-3">{card.d}</p><button onClick={()=>alert(card.l + "の分析結果を表示します")} className="text-xs font-medium" style={{color:card.c}}>分析を見る →</button></div>)}
    </div>
    <div className="bg-white rounded-xl border p-4"><h3 className="font-semibold text-sm mb-3">AIレコメンデーション</h3>
      {[{t:"クラフト手提げ袋 小の追加発注を推奨",d:"現在在庫が減少中。季節需要の増加が予測されます。2000枚の追加発注を推奨。",tag:"欠品防止",c:"#DC2626"},{t:"ラミネート袋シリーズのセット販促を提案",d:"マット&グロスのセット割引で単価アップと在庫回転率の改善が見込めます。",tag:"在庫最適化",c:"#F59E0B"},{t:"エコバッグ型紙袋の価格見直し",d:"環境意識の高まりで需要増。3%の価格調整で売上20%増加が見込めます。",tag:"売上増加",c:"#16A34A"}].map((r,i)=><div key={i} className="p-3 bg-gray-50 rounded-lg mb-2 border-l-4" style={{borderLeftColor:r.c}}><div className="flex items-center gap-2 mb-1"><span className="text-sm font-bold">{r.t}</span><span className="text-xs px-1.5 py-0.5 rounded" style={{backgroundColor:r.c+"15",color:r.c}}>{r.tag}</span></div><p className="text-xs text-gray-500 mb-2">{r.d}</p><button onClick={()=>alert(r.t + "\nを実行します")} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">実行</button></div>)}
    </div>
    <div className="bg-white rounded-xl border p-4"><h3 className="font-semibold text-sm mb-3">ビジネススコア</h3>
      <div className="text-center mb-4"><span className="text-4xl font-black text-blue-600">87</span><span className="text-sm text-gray-500 ml-1">/ 100</span></div>
      <div className="grid grid-cols-4 gap-3">{[{l:"在庫効率",v:82},{l:"価格競争力",v:91},{l:"顧客満足度",v:88},{l:"利益率",v:79}].map((s,i)=><div key={i} className="text-center"><div className="text-lg font-bold">{s.v}</div><div className="text-xs text-gray-500">{s.l}</div><div className="w-full bg-gray-100 rounded-full h-1.5 mt-1"><div className="h-1.5 rounded-full bg-blue-600" style={{width:`${s.v}%`}}/></div></div>)}</div>
    </div>
  </div>
);

// AI Articles Page
const AIArticlesPage = () => {
  const arts = [{id:"a1",title:"紙袋の種類と選び方ガイド",category:"商品ガイド",status:"公開済",date:"2024-01-16",chars:3200},{id:"a2",title:"効率的な在庫管理のベストプラクティス",category:"業務改善",status:"公開済",date:"2024-01-17",chars:2800},{id:"a3",title:"新商品：エコ素材紙袋シリーズの特徴",category:"新商品紹介",status:"下書き",date:"2024-01-18",chars:1500}];
  return (<div className="space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="font-semibold text-sm">AI記事生成</h2><p className="text-xs text-gray-500">AIを活用した記事の自動生成と管理</p></div><button onClick={()=>alert("AI記事生成フォームを表示します")} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium">新規記事生成</button></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[{l:"総記事数",v:`${arts.length}件`},{l:"公開済み",v:`${arts.filter(a=>a.status==="公開済").length}件`},{l:"編集中",v:`${arts.filter(a=>a.status==="下書き").length}件`},{l:"今月生成",v:"2件"}].map((k,i)=><div key={i} className="bg-white rounded-xl border p-4"><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{k.l}</p><p className="text-xl font-bold">{k.v}</p></div>)}
    </div>
    <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>{["タイトル","カテゴリ","ステータス","文字数","日付"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
    <tbody>{arts.map(a=><tr key={a.id} className="border-t hover:bg-gray-50"><td className="px-4 py-2.5 text-sm font-medium">{a.title}</td><td className="px-4 py-2.5"><span className="text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-600">{a.category}</span></td><td className="px-4 py-2.5"><Badge status={a.status}/></td><td className="px-4 py-2.5 text-sm text-gray-500">{fmt(a.chars)}文字</td><td className="px-4 py-2.5 text-sm text-gray-500">{a.date}</td></tr>)}</tbody></table></div>
  </div>);
};

// Chats Management Page
const ChatsPage = () => {
  const chats = [{id:"ch1",name:"花田美咲",company:"花よし生花店",msg:"在庫の確認をお願いします",time:"2分前",assignee:"佐藤",priority:"緊急",status:"対応中"},{id:"ch2",name:"鈴木麻衣",company:"アパレルセレクト",msg:"ありがとうございました！",time:"1時間前",assignee:"佐藤",priority:"完了",status:"解決済"},{id:"ch3",name:"田中裕介",company:"ワインショップ",msg:"見積もりをお願いします",time:"30分前",assignee:"山田",priority:"通常",status:"対応中"},{id:"ch4",name:"佐藤シェフ",company:"ルミエール",msg:"納期について教えてください",time:"5分前",assignee:"山田",priority:"通常",status:"対応中"}];
  const [sel,setSel] = useState(null);
  return (<div className="space-y-4">
    <div><h2 className="font-semibold text-sm">チャット管理</h2><p className="text-xs text-gray-500">顧客とのチャットセッションの管理と対応</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[{l:"チャット",v:`${chats.length}件`},{l:"未読メッセージ",v:"3件"},{l:"解決済み",v:`${chats.filter(c=>c.status==="解決済").length}件`},{l:"今月",v:"24件"}].map((k,i)=><div key={i} className="bg-white rounded-xl border p-4"><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{k.l}</p><p className="text-xl font-bold">{k.v}</p></div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border overflow-hidden divide-y">{chats.map(c=><button key={c.id} onClick={()=>setSel(c)} className={`w-full text-left p-3 hover:bg-gray-50 transition ${sel?.id===c.id?"bg-blue-50":""}`}><div className="flex justify-between"><span className="text-sm font-medium">{c.name}</span><span className="text-xs text-gray-400">{c.time}</span></div><p className="text-xs text-gray-500 truncate">{c.msg}</p><div className="flex gap-1 mt-1"><Badge status={c.priority}/><span className="text-xs text-gray-400">担当: {c.assignee}</span></div></button>)}</div>
      <div className="lg:col-span-2 bg-white rounded-xl border p-4 flex flex-col min-h-[400px]">
        {sel ? <>
          <div className="flex items-center justify-between pb-3 border-b mb-3"><div><p className="text-sm font-bold">{sel.name}</p><p className="text-xs text-gray-500">{sel.company}</p></div></div>
          <div className="flex-1 space-y-3"><div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 text-sm max-w-[70%]">{sel.msg}</div><div className="flex justify-end"><div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm max-w-[70%]">承知いたしました。確認いたします。少々お待ちください。</div></div></div>
          <div className="mt-3 flex gap-2"><input placeholder="メッセージを入力..." className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/><button className="p-2 bg-blue-600 text-white rounded-lg"><Icons.send size={16}/></button></div>
        </> : <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">チャットを選択してください</div>}
      </div>
    </div>
  </div>);
};

// Master Data Page
const MasterPage = () => {
  const [tab,setTab] = useState("商品カテゴリ");
  const data = {"商品カテゴリ":CATEGORIES.filter(c=>c!=="すべて").map((c,i)=>({code:`CAT-${String(i+1).padStart(3,"0")}`,name:c,status:"有効"})),"配送方法":["トラック便","宅配便","ヤマト運輸","佐川急便","日本郵便","西濃運輸","福山通運","店頭受取"].map((n,i)=>({code:`DLV-${String(i+1).padStart(3,"0")}`,name:n,status:"有効"})),"決済方法":["銀行振込","クレジットカード","現金","コンビニ決済"].map((n,i)=>({code:`PAY-${String(i+1).padStart(3,"0")}`,name:n,status:"有効"}))};
  const items = data[tab]||[];
  return (<div className="space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="font-semibold text-sm">マスタ管理</h2><p className="text-xs text-gray-500">商品カテゴリ、配送方法、決済方法などのマスタデータ管理</p></div><button onClick={()=>alert("新規マスタ登録フォームを表示します")} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">新規登録</button></div>
    <div className="flex gap-2">{["商品カテゴリ","配送方法","決済方法"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm transition ${tab===t?"bg-blue-600 text-white":"bg-white border text-gray-600"}`}>{t}</button>)}</div>
    <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>{["コード","名称","ステータス"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
    <tbody>{items.map((m,i)=><tr key={i} className="border-t hover:bg-gray-50"><td className="px-4 py-2.5 text-sm font-mono text-gray-400">{m.code}</td><td className="px-4 py-2.5 text-sm font-medium">{m.name}</td><td className="px-4 py-2.5"><span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">{m.status}</span></td></tr>)}</tbody></table></div>
  </div>);
};

// ━━ BUYER PAGES ━━
const BuyerLayout = ({children}) => {
  const { page, navigate, cart } = useApp();
  const cartCount = cart.reduce((s,c) => s + c.quantity, 0);
  const menu = [{id:"buyer",l:"トップ"},{id:"buyer/products",l:"商品一覧"},{id:"buyer/orders",l:"注文履歴"},{id:"buyer/billing",l:"請求・決済"},{id:"buyer/chat",l:"チャット相談"},{id:"buyer/account",l:"アカウント"}];
  return (<div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <button onClick={()=>navigate("landing")} className="text-lg font-black text-gray-900"><img src="/logo.png" alt="シンガタ" style={{height:"28px"}}/></button>
      <nav className="hidden md:flex items-center gap-1">{menu.map(m=><button key={m.id} onClick={()=>navigate(m.id)} className={`px-3 py-1.5 rounded-lg text-xs transition ${page===m.id?"bg-blue-50 text-blue-600 font-medium":"text-gray-500 hover:bg-gray-50"}`}>{m.l}</button>)}</nav>
      <div className="flex items-center gap-2">
        <button onClick={()=>navigate("operator")} className="text-xs text-gray-500">運営者画面</button>
        <button onClick={()=>navigate("cart")} className="relative p-2 hover:bg-gray-100 rounded-lg"><Icons.cart size={18}/>{cartCount>0&&<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}</button>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-4 py-4">{children}</main>
  </div>);
};

const BuyerTopPage = () => {
  const {navigate, products} = useApp();
  return (<div className="space-y-6">
    <div className="bg-gray-900 rounded-xl p-8 text-white"><h1 className="text-2xl font-black mb-2">紙袋・包装資材のオンライン発注</h1><p className="text-white/70 text-sm mb-4">24時間いつでも発注可能。AIが在庫状況と最適な提案をご案内します。</p><button onClick={()=>navigate("buyer/products")} className="px-6 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold">商品を見る →</button></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[{l:"注文・発送について",Ic:Icons.truck},{l:"商品について",Ic:Icons.package},{l:"在庫・納期について",Ic:Icons.inventory},{l:"価格・見積について",Ic:Icons.dollar}].map((c,i)=><button key={i} onClick={()=>navigate("buyer/chat")} className="bg-white rounded-xl border p-4 text-center hover:shadow-md transition"><div className="mb-2"><c.Ic size={24}/></div><p className="text-xs font-medium">{c.l}</p></button>)}</div>
    <div className="bg-white rounded-xl border p-4"><h3 className="font-semibold text-sm mb-3">人気商品</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{products.slice(0,4).map(p=><div key={p.id} onClick={()=>navigate("buyer/products")} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:shadow transition"><div className="flex justify-center mb-2"><CategoryIcon category={p.category} size={36} /></div><p className="text-xs font-medium truncate">{p.name}</p><p className="text-sm font-bold text-blue-600">¥{fmt(p.price)}</p></div>)}</div></div>
  </div>);
};

const BuyerProductsPage = () => {
  const {addToCart, products} = useApp();
  const [cat,setCat] = useState("すべて");
  const filtered = products.filter(p=>cat==="すべて"||p.category===cat);
  return (<div className="space-y-4"><h2 className="font-semibold text-sm">商品一覧</h2>
    <div className="flex gap-2 flex-wrap">{CATEGORIES.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${cat===c?"bg-blue-600 text-white":"bg-white border text-gray-600"}`}>{c}</button>)}</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">{filtered.map(p=><div key={p.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition"><div className="bg-gray-50 flex items-center justify-center py-6"><CategoryIcon category={p.category} size={52} /></div><div className="p-3"><span className="text-xs text-gray-400">{p.category} · {p.sku}</span><h3 className="text-sm font-semibold mt-0.5 mb-1">{p.name}</h3><p className="text-xs text-gray-500 mb-2">{p.description}</p><div className="flex items-center justify-between"><span className="text-sm font-bold text-blue-600">¥{fmt(p.price)}/{p.unit}</span><button onClick={()=>addToCart(p)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Icons.cart size={14}/></button></div></div></div>)}</div>
  </div>);
};

const BuyerOrdersPage = () => { const { orders } = useApp(); return (<div className="space-y-4"><h2 className="font-semibold text-sm">注文履歴</h2>
  <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr>{["注文番号","商品","金額","ステータス","注文日"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
  <tbody>{orders.slice(0,3).map(o=><tr key={o.id} className="border-t hover:bg-gray-50"><td className="px-4 py-2.5 text-sm text-blue-600 font-medium">{o.orderNumber}</td><td className="px-4 py-2.5 text-sm">{o.items?.[0]?.productName||"—"}</td><td className="px-4 py-2.5 text-sm font-bold">¥{fmt(o.total)}</td><td className="px-4 py-2.5"><Badge status={o.status}/></td><td className="px-4 py-2.5 text-sm text-gray-500">{o.orderDate}</td></tr>)}</tbody></table></div>
</div>);};

const BuyerBillingPage = () => (<div className="space-y-4"><h2 className="font-semibold text-sm">請求・決済</h2>
  <div className="grid grid-cols-2 gap-3"><div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500 mb-1">今月の請求額</p><p className="text-xl font-bold">¥{fmt(552500)}</p></div><div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500 mb-1">未払い</p><p className="text-xl font-bold text-orange-600">¥{fmt(0)}</p></div></div></div>);

const BuyerChatPage = () => {
  const [msgs,setMsgs] = useState([{role:"ai",text:"こんにちは！WholesaleAI アシスタントです。ご質問やお困りのことがございましたら、お気軽にお申し付けください。"}]);
  const [input,setInput] = useState("");
  const send = () => { if(!input.trim())return; setMsgs(p=>[...p,{role:"user",text:input}]); const q=input; setInput(""); setTimeout(()=>{ let r="ご質問ありがとうございます。お調べして回答いたします。"; if(q.includes("在庫")||q.includes("納期"))r="商品の在庫状況をお調べいたします。商品名またはSKUコードをお教えいただけますか？"; if(q.includes("注文")||q.includes("発送"))r="注文番号をお教えいただければ、詳細をお調べいたします。"; if(q.includes("価格")||q.includes("見積"))r="対象商品と数量をお教えいただければ、お見積もりを作成いたします。"; setMsgs(p=>[...p,{role:"ai",text:r}]); },800); };
  return (<div className="space-y-4"><h2 className="font-semibold text-sm">チャット相談</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">{["担当者に相談","AIに相談","注文・発送について","在庫・納期について"].map(q=><button key={q} className="px-3 py-2 bg-white border rounded-lg text-xs hover:bg-gray-50">{q}</button>)}</div>
    <div className="bg-white rounded-xl border p-4 flex flex-col" style={{height:400}}>
      <div className="flex items-center gap-2 pb-3 border-b mb-3"><Icons.brain size={18} className="text-purple-600"/><div><p className="text-sm font-bold">AI アシスタント</p><p className="text-xs text-green-600">オンライン</p></div></div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">{msgs.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.role==="user"?"bg-blue-600 text-white rounded-br-sm":"bg-gray-100 rounded-bl-sm"}`}>{m.text}</div></div>)}</div>
      <div className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="メッセージを入力..." className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/><button onClick={send} className="p-2 bg-blue-600 text-white rounded-lg"><Icons.send size={16}/></button></div>
    </div>
  </div>);
};

const BuyerAccountPage = () => (<div className="space-y-4"><h2 className="font-semibold text-sm">アカウント</h2>
  <div className="bg-white rounded-xl border p-5 max-w-xl">{[{l:"会社名",v:"花よし生花店"},{l:"担当者",v:"花田 美咲"},{l:"メール",v:"hanada@hanayoshi.jp"},{l:"電話番号",v:"03-5555-1234"},{l:"住所",v:"東京都渋谷区神宮前3-10-8"},{l:"ティア",v:"プラチナ"}].map((f,i)=><div key={i} className="flex items-center justify-between py-2 border-b last:border-0"><span className="text-sm text-gray-500">{f.l}</span><span className="text-sm font-medium">{f.v}</span></div>)}</div>
</div>);

// Helper computed values for payments page
// (payment stats computed inside PaymentsPage)
const AIChat = () => {
  const { setAiChatOpen, products: ctxProducts, customers: ctxCustomers } = useApp();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "こんにちは！シンガタ AIアシスタントです。店舗運営に関するご質問にお答えします。\n\n▸ 売上分析\n▸ 在庫提案\n▸ 顧客分析\n▸ 業務改善\n\nなんでもお聞きください！" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const systemPrompt = `あなたは「シンガタ」の店舗管理AIアシスタントです。紙袋・包装資材の卸売ECプラットフォームの管理者を支援します。

現在のストアデータ:
- 商品数: ${(ctxProducts||PRODUCTS).length}件
- 顧客数: ${(ctxCustomers||CUSTOMERS).length}社
- トップ顧客: ${(ctxCustomers||CUSTOMERS).map(c => c.companyName).join(", ")}
- 低在庫商品: ${(ctxProducts||PRODUCTS).filter(p => p.stock < 50).map(p => `${p.name}(残${p.stock})`).join(", ")}
- 商品カテゴリ: ${CATEGORIES.filter(c => c !== "すべて").join(", ")}
- 総在庫額: ¥${fmt((ctxProducts||PRODUCTS).reduce((s, p) => s + p.price * p.stock, 0))}

以下の役割を果たしてください:
1. 売上分析・トレンド予測
2. 在庫最適化の提案
3. 顧客管理のアドバイス
4. 発注タイミングの推奨
5. 業務改善の提案

回答は日本語で、簡潔かつ実用的にお願いします。数値やデータを活用してください。`;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0), userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "申し訳ございません。回答を生成できませんでした。";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "接続エラーが発生しました。もう一度お試しください。" }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-2">
          <Icons.brain size={20} />
          <div>
            <h3 className="font-bold text-sm">AIアシスタント</h3>
            <p className="text-xs text-white/70">シンガタ AI Agent</p>
          </div>
        </div>
        <button onClick={() => setAiChatOpen(false)} className="p-1 hover:bg-white/10 rounded"><Icons.x size={18} /></button>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t flex gap-2 flex-wrap">
        {["在庫状況は？", "売上分析して", "発注提案して", "顧客分析"].map(q => (
          <button key={q} onClick={() => { setInput(q); }} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">{q}</button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="メッセージを入力..." className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          <button onClick={sendMessage} disabled={loading || !input.trim()} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
            <Icons.send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTER & MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const OperatorPage = () => {
  const { page } = useApp();
  const pageMap = {
    "operator": <DashboardPage />,
    "operator/orders": <OrdersPage />,
    "operator/payments": <PaymentsPage />,
    "operator/billing": <BillingPage />,
    "operator/shipping": <ShippingPage />,
    "operator/products": <ProductsPage />,
    "operator/customers": <CustomersPage />,
    "operator/inventory": <InventoryPage />,
    "operator/procurement": <ProcurementPage />,
    "operator/analytics": <AnalyticsPage />,
    "operator/pricing": <PricingPage />,
    "operator/ai-analytics": <AIAnalyticsPage />,
    "operator/ai-articles": <AIArticlesPage />,
    "operator/chats": <ChatsPage />,
    "operator/master": <MasterPage />,
    "operator/settings": <SettingsPage />,
  };
  return <OperatorLayout>{pageMap[page] || <DashboardPage />}</OperatorLayout>;
};

const BuyerPage = () => {
  const { page } = useApp();
  const pageMap = {
    "buyer": <BuyerTopPage />,
    "buyer/products": <BuyerProductsPage />,
    "buyer/orders": <BuyerOrdersPage />,
    "buyer/billing": <BuyerBillingPage />,
    "buyer/chat": <BuyerChatPage />,
    "buyer/account": <BuyerAccountPage />,
  };
  return <BuyerLayout>{pageMap[page] || <BuyerTopPage />}</BuyerLayout>;
};

export default function App() {
  // ═══ URL-based Routing ═══
  const pathToPage = (path) => {
    const p = path.replace(/^\//, '').replace(/\/$/, '');
    return p || 'landing';
  };
  const pageToPath = (page) => page === 'landing' ? '/' : `/${page}`;

  const [page, setPage] = useState(() => pathToPage(window.location.pathname));
  const [cart, setCart] = useState([]);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  // Browser back/forward
  useEffect(() => {
    const onPop = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // ═══ Supabase Data Hooks ═══
  const { data: dbProducts, loading: loadingProducts, refetch: refetchProducts } = useProducts();
  const { data: dbCustomers, refetch: refetchCustomers } = useCustomers();
  const { data: dbOrders, refetch: refetchOrders } = useOrders();
  const { data: dbArticles, refetch: refetchArticles } = useArticles();
  const { data: dbChatSessions, refetch: refetchChats } = useChatSessions();
  const { data: dbSuppliers } = useSuppliers();

  // Use DB data if available, otherwise fallback to mock
  const products = dbProducts.length > 0 ? dbProducts : PRODUCTS;
  const customers = dbCustomers.length > 0 ? dbCustomers.map(c => ({
    ...c,
    companyName: c.company_name || c.companyName,
    contactName: c.contact_name || c.contactName,
    totalSpent: c.total_spent ?? c.totalSpent ?? 0,
    totalOrders: c.total_orders ?? c.totalOrders ?? 0,
    priceRate: c.price_rate ?? c.priceRate ?? 1,
    paymentTerms: c.payment_terms || c.paymentTerms,
  })) : CUSTOMERS;
  const orders = dbOrders.length > 0 ? dbOrders.map(o => ({
    ...o,
    orderNumber: o.order_number,
    customerName: o.customer_name,
    paymentStatus: o.payment_status,
    paymentMethod: o.payment_method,
    orderDate: o.order_date,
    deliveryDate: o.delivery_date,
    trackingNumber: o.tracking_number,
    items: (o.order_items || []).map(i => ({
      productName: i.product_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
    })),
  })) : generateOrders();

  useEffect(() => {
    if (dbProducts.length > 0) setDbReady(true);
  }, [dbProducts]);

  const navigate = (p) => {
    const url = pageToPath(p);
    window.history.pushState({}, '', url);
    setPage(p);
    window.scrollTo(0, 0);
  };

  // ═══ SEO: Update page title ═══
  useEffect(() => {
    const titles = {
      landing: "シンガタ株式会社 - BtoB卸デモサイト",
      ec: "商品一覧 | シンガタ", cart: "カート | シンガタ",
      operator: "ダッシュボード | シンガタ管理",
      "operator/orders": "受注管理 | シンガタ", "operator/payments": "決済管理 | シンガタ", "operator/billing": "請求管理 | シンガタ",
      "operator/shipping": "発送管理 | シンガタ", "operator/products": "商品管理 | シンガタ",
      "operator/inventory": "在庫管理 | シンガタ", "operator/procurement": "仕入管理 | シンガタ",
      "operator/analytics": "売上分析 | シンガタ", "operator/customers": "顧客管理 | シンガタ",
      "operator/pricing": "価格・掛率管理 | シンガタ", "operator/ai-analytics": "AI分析センター | シンガタ",
      "operator/ai-articles": "AI記事生成 | シンガタ", "operator/chats": "チャット管理 | シンガタ",
      "operator/master": "マスタ管理 | シンガタ", "operator/settings": "設定 | シンガタ",
      buyer: "マイページ | シンガタ", "buyer/products": "商品一覧 | シンガタ",
      "buyer/orders": "注文履歴 | シンガタ", "buyer/billing": "請求・決済 | シンガタ",
      "buyer/chat": "チャット相談 | シンガタ", "buyer/account": "アカウント | シンガタ",
    };
    document.title = titles[page] || "シンガタ株式会社 - BtoB卸デモサイト";
  }, [page]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  
  const clearCart = () => setCart([]);

  // ═══ Checkout → Real Order ═══
  const checkout = async (paymentMethod) => {
    const total = cart.reduce((s, c) => s + (c.price || c.basePrice || 0) * c.quantity, 0);
    try {
      await createOrder({
        customerName: 'ECストア注文',
        items: cart,
        paymentMethod: paymentMethod || '銀行振込',
        total: Math.floor(total * 1.1),
      });
      clearCart();
      refetchOrders();
      refetchProducts();
      return true;
    } catch (e) {
      console.error('Order creation failed:', e);
      // Fallback: still clear cart for demo
      clearCart();
      return true;
    }
  };

  const ctx = {
    page, navigate, cart, addToCart, updateCartQty, removeFromCart, clearCart, checkout,
    aiChatOpen, setAiChatOpen, dbReady,
    products, customers, orders,
    dbArticles, dbChatSessions, dbSuppliers,
    refetchProducts, refetchCustomers, refetchOrders, refetchArticles, refetchChats,
  };

  return (
    <AppContext.Provider value={ctx}>
      {page === "landing" && <LandingPage />}
      {page === "ec" && <ECStore />}
      {page === "cart" && <CartPage />}
      {page.startsWith("operator") && <OperatorPage />}
      {page.startsWith("buyer") && <BuyerPage />}
    </AppContext.Provider>
  );
}

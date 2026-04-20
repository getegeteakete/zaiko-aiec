import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTEXT & STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PRODUCTS = [
  { id: "p1", name: "国産鶏もも肉 2kg", category: "精肉", price: 1980, stock: 150, unit: "パック", image: "🍗", sku: "MT-001", description: "新鮮な国産鶏もも肉。唐揚げ・照り焼きに最適。", rating: 4.5 },
  { id: "p2", name: "有機キャベツ 1玉", category: "野菜", price: 298, stock: 200, unit: "個", image: "🥬", sku: "VG-001", description: "契約農家直送の有機キャベツ。甘みが強く生食にも。", rating: 4.8 },
  { id: "p3", name: "特選和牛サーロイン 500g", category: "精肉", price: 4980, stock: 30, unit: "パック", image: "🥩", sku: "MT-002", description: "A5ランク和牛サーロイン。きめ細かいサシが特徴。", rating: 4.9 },
  { id: "p4", name: "北海道産じゃがいも 5kg", category: "野菜", price: 890, stock: 80, unit: "箱", image: "🥔", sku: "VG-002", description: "北海道十勝産メークイン。煮崩れしにくい品種。", rating: 4.3 },
  { id: "p5", name: "業務用サラダ油 16.5L", category: "調味料", price: 3150, stock: 45, unit: "缶", image: "🫗", sku: "OL-001", description: "大容量業務用サラダ油。フライ・炒め物に。", rating: 4.1 },
  { id: "p6", name: "特選醤油 1.8L", category: "調味料", price: 680, stock: 120, unit: "本", image: "🍶", sku: "SS-001", description: "丸大豆使用の天然醸造醤油。深いコク。", rating: 4.6 },
  { id: "p7", name: "冷凍エビフライ 30本入", category: "冷凍食品", price: 2480, stock: 60, unit: "箱", image: "🍤", sku: "FZ-001", description: "衣付き冷凍エビフライ。大ぶりサイズ。", rating: 4.4 },
  { id: "p8", name: "業務用白米 10kg", category: "米・穀物", price: 3800, stock: 100, unit: "袋", image: "🍚", sku: "RC-001", description: "新潟産コシヒカリ。ふっくら炊き上がり。", rating: 4.7 },
  { id: "p9", name: "国産豚バラ肉 1kg", category: "精肉", price: 1280, stock: 90, unit: "パック", image: "🥓", sku: "MT-003", description: "国産豚バラスライス。角煮・炒め物に。", rating: 4.2 },
  { id: "p10", name: "有機トマト 1kg", category: "野菜", price: 580, stock: 75, unit: "パック", image: "🍅", sku: "VG-003", description: "有機栽培の完熟トマト。甘みと酸味のバランス◎", rating: 4.5 },
  { id: "p11", name: "冷凍餃子 50個入", category: "冷凍食品", price: 1680, stock: 55, unit: "箱", image: "🥟", sku: "FZ-002", description: "手作り風冷凍餃子。焼き・水餃子両対応。", rating: 4.3 },
  { id: "p12", name: "業務用味噌 4kg", category: "調味料", price: 1200, stock: 40, unit: "パック", image: "🫘", sku: "SS-002", description: "信州味噌。味噌汁・味噌漬けに最適。", rating: 4.4 },
];

const CATEGORIES = ["すべて", "精肉", "野菜", "調味料", "冷凍食品", "米・穀物"];

const CUSTOMERS = [
  { id: "c1", companyName: "レストラン花月", contactName: "田中太郎", email: "tanaka@kagetsu.jp", phone: "03-1234-5678", tier: "ゴールド", totalOrders: 48, totalSpent: 2340000 },
  { id: "c2", companyName: "居酒屋まるや", contactName: "佐藤花子", email: "sato@maruya.jp", phone: "03-2345-6789", tier: "シルバー", totalOrders: 32, totalSpent: 1560000 },
  { id: "c3", companyName: "カフェ青空", contactName: "鈴木一郎", email: "suzuki@aozora.jp", phone: "03-3456-7890", tier: "ブロンズ", totalOrders: 15, totalSpent: 720000 },
  { id: "c4", companyName: "ホテルグランド", contactName: "高橋美咲", email: "takahashi@grand.jp", phone: "03-4567-8901", tier: "プラチナ", totalOrders: 96, totalSpent: 8900000 },
  { id: "c5", companyName: "弁当工房さくら", contactName: "渡辺健", email: "watanabe@sakura.jp", phone: "03-5678-9012", tier: "ゴールド", totalOrders: 64, totalSpent: 3200000 },
];

const generateOrders = () => [
  { id: "o1", orderNumber: "ORD-2024-0001", customerId: "c1", customerName: "レストラン花月", items: [{ productId: "p1", productName: "国産鶏もも肉 2kg", quantity: 10, unitPrice: 1980 }, { productId: "p6", productName: "特選醤油 1.8L", quantity: 5, unitPrice: 680 }], total: 23200, status: "delivered", paymentStatus: "paid", orderDate: "2024-03-15", deliveryDate: "2024-03-16", paymentMethod: "振込" },
  { id: "o2", orderNumber: "ORD-2024-0002", customerId: "c4", customerName: "ホテルグランド", items: [{ productId: "p3", productName: "特選和牛サーロイン 500g", quantity: 20, unitPrice: 4980 }, { productId: "p8", productName: "業務用白米 10kg", quantity: 5, unitPrice: 3800 }], total: 118600, status: "shipped", paymentStatus: "paid", orderDate: "2024-03-16", deliveryDate: "2024-03-17", paymentMethod: "カード" },
  { id: "o3", orderNumber: "ORD-2024-0003", customerId: "c2", customerName: "居酒屋まるや", items: [{ productId: "p7", productName: "冷凍エビフライ 30本入", quantity: 3, unitPrice: 2480 }, { productId: "p11", productName: "冷凍餃子 50個入", quantity: 5, unitPrice: 1680 }], total: 15840, status: "processing", paymentStatus: "pending", orderDate: "2024-03-17", paymentMethod: "振込" },
  { id: "o4", orderNumber: "ORD-2024-0004", customerId: "c5", customerName: "弁当工房さくら", items: [{ productId: "p9", productName: "国産豚バラ肉 1kg", quantity: 15, unitPrice: 1280 }, { productId: "p2", productName: "有機キャベツ 1玉", quantity: 20, unitPrice: 298 }], total: 25160, status: "confirmed", paymentStatus: "pending", orderDate: "2024-03-17", paymentMethod: "代引き" },
  { id: "o5", orderNumber: "ORD-2024-0005", customerId: "c3", customerName: "カフェ青空", items: [{ productId: "p10", productName: "有機トマト 1kg", quantity: 8, unitPrice: 580 }], total: 4640, status: "delivered", paymentStatus: "paid", orderDate: "2024-03-14", deliveryDate: "2024-03-15", paymentMethod: "カード" },
  { id: "o6", orderNumber: "ORD-2024-0006", customerId: "c1", customerName: "レストラン花月", items: [{ productId: "p5", productName: "業務用サラダ油 16.5L", quantity: 2, unitPrice: 3150 }, { productId: "p12", productName: "業務用味噌 4kg", quantity: 3, unitPrice: 1200 }], total: 9900, status: "delivered", paymentStatus: "paid", orderDate: "2024-03-13", deliveryDate: "2024-03-14", paymentMethod: "振込" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICONS (inline SVG)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  home: (p) => <Icon {...p} d={["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]} />,
  package: (p) => <Icon {...p} d={["M16.5 9.4l-9-5.19", "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.27 6.96L12 12.01l8.73-5.05", "M12 22.08V12"]} />,
  orders: (p) => <Icon {...p} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} />,
  users: (p) => <Icon {...p} d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87"]} />,
  chart: (p) => <Icon {...p} d={["M3 3v18h18", "M18 17V9", "M13 17V5", "M8 17v-3"]} />,
  cart: (p) => <Icon {...p} d={["M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"]} />,
  brain: (p) => <Icon {...p} d={["M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z", "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z", "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"]} />,
  search: (p) => <Icon {...p} d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"]} />,
  send: (p) => <Icon {...p} d={["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"]} />,
  x: (p) => <Icon {...p} d={["M18 6L6 18", "M6 6l12 12"]} />,
  menu: (p) => <Icon {...p} d={["M3 12h18", "M3 6h18", "M3 18h18"]} />,
  chevronRight: (p) => <Icon {...p} d="M9 18l6-6-6-6" />,
  chevronDown: (p) => <Icon {...p} d="M6 9l6 6 6-6" />,
  dollar: (p) => <Icon {...p} d={["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]} />,
  truck: (p) => <Icon {...p} d={["M1 3h15v13H1z", "M16 8h4l3 3v5h-7V8z", "M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", "M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"]} />,
  settings: (p) => <Icon {...p} d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]} />,
  minus: (p) => <Icon {...p} d="M5 12h14" />,
  plus: (p) => <Icon {...p} d={["M12 5v14", "M5 12h14"]} />,
  trash: (p) => <Icon {...p} d={["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} />,
  check: (p) => <Icon {...p} d="M20 6L9 17l-5-5" />,
  arrowLeft: (p) => <Icon {...p} d={["M19 12H5", "M12 19l-7-7 7-7"]} />,
  star: (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  inventory: (p) => <Icon {...p} d={["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"]} />,
  bell: (p) => <Icon {...p} d={["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"]} />,
  store: (p) => <Icon {...p} d={["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} />,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const fmt = (n) => new Intl.NumberFormat("ja-JP").format(n);
const statusColors = {
  delivered: { bg: "bg-green-100", text: "text-green-800", label: "配送完了" },
  shipped: { bg: "bg-blue-100", text: "text-blue-800", label: "配送中" },
  processing: { bg: "bg-yellow-100", text: "text-yellow-800", label: "処理中" },
  confirmed: { bg: "bg-purple-100", text: "text-purple-800", label: "確認済" },
  pending: { bg: "bg-orange-100", text: "text-orange-800", label: "保留" },
  paid: { bg: "bg-green-100", text: "text-green-800", label: "入金済" },
};
const tierColors = { プラチナ: "bg-gradient-to-r from-slate-400 to-slate-600 text-white", ゴールド: "bg-gradient-to-r from-amber-400 to-amber-600 text-white", シルバー: "bg-gray-200 text-gray-800", ブロンズ: "bg-orange-100 text-orange-800" };

const Badge = ({ status }) => {
  const s = statusColors[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LANDING PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LandingPage = () => {
  const { navigate } = useApp();
  const features = [
    { icon: "📊", title: "AIダッシュボード", desc: "売上・在庫・顧客動向をAIがリアルタイム分析" },
    { icon: "🛒", title: "EC受発注", desc: "BtoB向け資材EC。ワンクリックで発注・再注文" },
    { icon: "🤖", title: "AIエージェント", desc: "在庫提案・需要予測・業務自動化をAIが支援" },
    { icon: "📦", title: "在庫・配送管理", desc: "リアルタイム在庫管理と配送状況のトラッキング" },
    { icon: "💳", title: "決済・請求", desc: "複数決済対応。請求書自動発行・入金管理" },
    { icon: "📈", title: "分析レポート", desc: "売上トレンド・ABC分析・顧客LTV自動算出" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight">🏪 shopeee</span>
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full ml-1">AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("ec")} className="px-4 py-2 text-sm text-white/80 hover:text-white transition">ECストア</button>
          <button onClick={() => navigate("operator")} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition">管理画面</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 sm:px-12 py-20 sm:py-32 text-center">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-blue-500/10" style={{ width: Math.random() * 300 + 50, height: Math.random() * 300 + 50, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 border border-blue-400/30 rounded-full text-sm text-blue-300">
            ✨ 飲食・小売店舗のための資材ECです
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
            店舗管理を<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">AIでスマート</span>に
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            発注・在庫・顧客管理をAIエージェントがサポート。<br />
            業務効率を劇的に改善するEnterprise SaaSプラットフォーム
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("ec")} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-bold transition shadow-lg shadow-blue-600/30">
              ECストアを見る →
            </button>
            <button onClick={() => navigate("operator")} className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-lg font-medium transition">
              管理画面デモ
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-12 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">主な機能</h2>
        <p className="text-white/50 text-center mb-12">AIが店舗運営のすべてをサポートします</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-12 py-20 text-center">
        <div className="max-w-3xl mx-auto p-10 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">今すぐ始めましょう</h2>
          <p className="text-white/60 mb-8">14日間無料トライアル。クレジットカード不要。</p>
          <button onClick={() => navigate("operator")} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-bold transition">
            無料で始める
          </button>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-white/10 text-center text-white/30 text-sm">
        © 2024 shopeee - 店舗管理AIアシスト
      </footer>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EC STORE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ECStore = () => {
  const { cart, addToCart, navigate } = useApp();
  const [selectedCat, setSelectedCat] = useState("すべて");
  const [searchQ, setSearchQ] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = PRODUCTS.filter(p => (selectedCat === "すべて" || p.category === selectedCat) && (p.name.includes(searchQ) || p.category.includes(searchQ)));
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ECHeader cartCount={cartCount} />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6"><Icons.arrowLeft size={16} /> 商品一覧に戻る</button>
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-center justify-center text-[120px] bg-gray-50 rounded-xl py-12">{selectedProduct.image}</div>
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
              <div className="bg-gray-50 flex items-center justify-center text-6xl py-8 group-hover:scale-105 transition">{p.image}</div>
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
        <button onClick={() => navigate("landing")} className="text-xl font-black text-gray-900 flex items-center gap-2">🏪 shopeee</button>
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
  const { cart, updateCartQty, removeFromCart, navigate, clearCart } = useApp();
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
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-400 mb-4">カートは空です</p>
            <button onClick={() => navigate("ec")} className="px-6 py-2 bg-blue-600 text-white rounded-lg">商品を探す</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                  <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg shrink-0">{item.image}</div>
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
              <button onClick={() => { clearCart(); setCheckoutDone(true); }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition">注文確定</button>
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
    { id: "operator", label: "ダッシュボード", icon: Icons.home },
    { id: "operator/orders", label: "受注管理", icon: Icons.orders },
    { id: "operator/products", label: "商品管理", icon: Icons.package },
    { id: "operator/customers", label: "顧客管理", icon: Icons.users },
    { id: "operator/inventory", label: "在庫管理", icon: Icons.inventory },
    { id: "operator/analytics", label: "分析", icon: Icons.chart },
    { id: "operator/settings", label: "設定", icon: Icons.settings },
  ];

  const Sidebar = ({ mobile }) => (
    <aside className={`${mobile ? "fixed inset-0 z-50 flex" : "hidden md:flex"} flex-col`}>
      {mobile && <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />}
      <div className={`${mobile ? "relative z-10" : ""} ${collapsed && !mobile ? "w-16" : "w-60"} h-screen bg-[#0F172A] text-white flex flex-col transition-all`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {(!collapsed || mobile) && <span className="font-black text-lg">🏪 shopeee</span>}
          <button onClick={() => mobile ? setMobileOpen(false) : setCollapsed(!collapsed)} className="p-1 hover:bg-white/10 rounded"><Icons.menu size={18} /></button>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {menu.map(m => (
            <button key={m.id} onClick={() => { navigate(m.id); setMobileOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${page === m.id ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-400" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
              <m.icon size={18} />
              {(!collapsed || mobile) && <span>{m.label}</span>}
            </button>
          ))}
        </nav>
        {(!collapsed || mobile) && (
          <div className="p-3 border-t border-white/10">
            <button onClick={() => navigate("ec")} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition">
              <Icons.store size={16} /> ECストアを開く
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      {mobileOpen && <Sidebar mobile />}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-1"><Icons.menu size={20} /></button>
            <h2 className="font-semibold text-sm sm:text-base">{menu.find(m => m.id === page)?.label || "ダッシュボード"}</h2>
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
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
      {/* AI Chat */}
      {aiChatOpen && <AIChat />}
    </div>
  );
};

// Dashboard
const DashboardPage = () => {
  const orders = generateOrders();
  const kpis = [
    { label: "今月の売上", value: `¥${fmt(orders.reduce((s, o) => s + o.total, 0))}`, change: "+12.5%", color: "text-green-600", icon: Icons.dollar },
    { label: "受注件数", value: orders.length, change: "+8.3%", color: "text-green-600", icon: Icons.orders },
    { label: "顧客数", value: CUSTOMERS.length, change: "+2.1%", color: "text-green-600", icon: Icons.users },
    { label: "在庫アイテム", value: PRODUCTS.length, change: "-3件 低在庫", color: "text-yellow-600", icon: Icons.package },
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
            <button className="text-xs text-blue-600 hover:underline">すべて見る</button>
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
          {PRODUCTS.filter(p => p.stock < 50).map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <span className="text-2xl">{p.image}</span>
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
  const [orders] = useState(generateOrders());
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {[{ v: "all", l: "すべて" }, { v: "processing", l: "処理中" }, { v: "confirmed", l: "確認済" }, { v: "shipped", l: "配送中" }, { v: "delivered", l: "完了" }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 rounded-lg text-sm transition ${filter === f.v ? "bg-blue-600 text-white" : "bg-white border text-gray-600"}`}>{f.l}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["注文番号", "顧客名", "商品", "合計", "ステータス", "支払い", "日付"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-sm">{o.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{o.items[0].productName}{o.items.length > 1 ? ` 他${o.items.length - 1}件` : ""}</td>
                  <td className="px-4 py-3 text-sm font-bold">¥{fmt(o.total)}</td>
                  <td className="px-4 py-3"><Badge status={o.status} /></td>
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
  const [products, setProducts] = useState(PRODUCTS);
  const [editing, setEditing] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{products.length}件の商品</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1"><Icons.plus size={16} /> 商品追加</button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["", "商品名", "SKU", "カテゴリ", "価格", "在庫", "評価"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition cursor-pointer" onClick={() => setEditing(editing === p.id ? null : p.id)}>
                  <td className="px-4 py-3 text-2xl">{p.image}</td>
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{p.sku}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">{p.category}</span></td>
                  <td className="px-4 py-3 text-sm font-bold">¥{fmt(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${p.stock < 50 ? "text-yellow-600" : "text-green-600"}`}>{p.stock}{p.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{p.rating}</td>
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
const CustomersPage = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">総顧客数</p>
        <p className="text-2xl font-bold">{CUSTOMERS.length}</p>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">平均LTV</p>
        <p className="text-2xl font-bold">¥{fmt(Math.floor(CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / CUSTOMERS.length))}</p>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">総受注額</p>
        <p className="text-2xl font-bold">¥{fmt(CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0))}</p>
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
            {CUSTOMERS.map(c => (
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
);

// Inventory Page
const InventoryPage = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[
        { label: "総アイテム", value: PRODUCTS.length, color: "text-blue-600" },
        { label: "適正在庫", value: PRODUCTS.filter(p => p.stock >= 50).length, color: "text-green-600" },
        { label: "低在庫", value: PRODUCTS.filter(p => p.stock < 50 && p.stock > 0).length, color: "text-yellow-600" },
        { label: "欠品", value: 0, color: "text-red-600" },
      ].map((k, i) => (
        <div key={i} className="bg-white rounded-xl border p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
          <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["", "商品名", "SKU", "現在庫", "ステータス", "在庫バー"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...PRODUCTS].sort((a, b) => a.stock - b.stock).map(p => {
              const pct = Math.min(p.stock / 200 * 100, 100);
              const barColor = p.stock < 35 ? "bg-red-500" : p.stock < 60 ? "bg-yellow-500" : "bg-green-500";
              return (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-2xl">{p.image}</td>
                  <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{p.sku}</td>
                  <td className="px-4 py-3 text-sm font-bold">{p.stock}{p.unit}</td>
                  <td className="px-4 py-3">
                    {p.stock < 35 ? <Badge status="pending" /> : p.stock < 60 ? <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">低在庫</span> : <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">適正</span>}
                  </td>
                  <td className="px-4 py-3 w-40">
                    <div className="w-full bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} /></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Analytics Page
const AnalyticsPage = () => {
  const catSales = CATEGORIES.filter(c => c !== "すべて").map(cat => ({
    category: cat,
    count: PRODUCTS.filter(p => p.category === cat).length,
    revenue: PRODUCTS.filter(p => p.category === cat).reduce((s, p) => s + p.price * p.stock, 0),
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
            {[...PRODUCTS].sort((a, b) => b.price * b.stock - a.price * a.stock).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="text-lg font-bold text-gray-300 w-6">{i + 1}</span>
                <span className="text-2xl">{p.image}</span>
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
          {["プラチナ", "ゴールド", "シルバー", "ブロンズ"].map(t => {
            const count = CUSTOMERS.filter(c => c.tier === t).length;
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
      { title: "ストア情報", fields: [{ label: "店舗名", value: "shopeee デモストア" }, { label: "メール", value: "admin@shopeee.jp" }, { label: "電話番号", value: "03-0000-0000" }] },
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI CHAT (Claude API Integration)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AIChat = () => {
  const { setAiChatOpen } = useApp();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "こんにちは！shopeee AIアシスタントです。店舗運営に関するご質問にお答えします。\n\n📊 売上分析\n📦 在庫提案\n👥 顧客分析\n💡 業務改善\n\nなんでもお聞きください！" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const systemPrompt = `あなたは「shopeee」の店舗管理AIアシスタントです。飲食店・小売店向け卸売ECプラットフォームの管理者を支援します。

現在のストアデータ:
- 商品数: ${PRODUCTS.length}件
- 顧客数: ${CUSTOMERS.length}社
- トップ顧客: ${CUSTOMERS.map(c => c.companyName).join(", ")}
- 低在庫商品: ${PRODUCTS.filter(p => p.stock < 50).map(p => `${p.name}(残${p.stock})`).join(", ")}
- 商品カテゴリ: ${CATEGORIES.filter(c => c !== "すべて").join(", ")}
- 総在庫額: ¥${fmt(PRODUCTS.reduce((s, p) => s + p.price * p.stock, 0))}

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
            <p className="text-xs text-white/70">shopeee AI Agent</p>
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
    "operator/products": <ProductsPage />,
    "operator/customers": <CustomersPage />,
    "operator/inventory": <InventoryPage />,
    "operator/analytics": <AnalyticsPage />,
    "operator/settings": <SettingsPage />,
  };
  return <OperatorLayout>{pageMap[page] || <DashboardPage />}</OperatorLayout>;
};

export default function App() {
  const [page, setPage] = useState("landing");
  const [cart, setCart] = useState([]);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const navigate = (p) => { setPage(p); window.scrollTo(0, 0); };

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

  const ctx = { page, navigate, cart, addToCart, updateCartQty, removeFromCart, clearCart, aiChatOpen, setAiChatOpen };

  return (
    <AppContext.Provider value={ctx}>
      {page === "landing" && <LandingPage />}
      {page === "ec" && <ECStore />}
      {page === "cart" && <CartPage />}
      {page.startsWith("operator") && <OperatorPage />}
    </AppContext.Provider>
  );
}

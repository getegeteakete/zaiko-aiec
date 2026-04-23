-- ═══════════════════════════════════════
-- shopeee - 紙袋商品データ (既存データ入替)
-- Supabase SQL Editorで実行してください
-- ═══════════════════════════════════════

-- 既存データ削除
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM customers;
DELETE FROM suppliers;
DELETE FROM articles;
DELETE FROM chat_sessions;
DELETE FROM master_data;
DELETE FROM invoice_items;
DELETE FROM invoices;
DELETE FROM billing_settings;

-- 紙袋商品データ (20種)
INSERT INTO products (name, category, maker, spec, price, stock, unit, sku, description, image, status, rating) VALUES
('クラフト手提げ袋 小', '手提げ袋', 'マルタカパルプ', 'W220×D120×H250mm', 18, 5000, '枚', 'KB-S-001', '未晒クラフト紙 120g/㎡。W220×D120×H250mm。丸紐付き。', 'bag', '正常', 4.5),
('クラフト手提げ袋 中', '手提げ袋', 'マルタカパルプ', 'W320×D115×H310mm', 25, 3200, '枚', 'KB-M-001', '未晒クラフト紙 120g/㎡。W320×D115×H310mm。丸紐付き。', 'bag', '正常', 4.7),
('クラフト手提げ袋 大', '手提げ袋', 'マルタカパルプ', 'W380×D150×H500mm', 35, 2800, '枚', 'KB-L-001', '未晒クラフト紙 120g/㎡。W380×D150×H500mm。平紐付き。', 'bag', '正常', 4.6),
('白無地 手提げ袋 S', '手提げ袋', '大昭和紙工産業', 'W220×D120×H250mm', 22, 4500, '枚', 'WB-S-001', '晒クラフト紙 100g/㎡。W220×D120×H250mm。紙平紐。', 'bag', '正常', 4.4),
('カラー手提げ袋 赤 M', 'カラー袋', 'シモジマ', 'W320×D115×H310mm', 38, 1800, '枚', 'CB-R-M01', 'カラークラフト紙。W320×D115×H310mm。アクリル丸紐。', 'bag', '正常', 4.8),
('カラー手提げ袋 ネイビー M', 'カラー袋', 'シモジマ', 'W320×D115×H310mm', 38, 2200, '枚', 'CB-N-M01', 'カラークラフト紙。W320×D115×H310mm。アクリル丸紐。', 'bag', '正常', 4.8),
('マットラミネート袋 黒 M', 'ラミネート袋', '福助工業', 'W320×D115×H310mm', 65, 1200, '枚', 'ML-B-M01', 'マットPP加工。W320×D115×H310mm。ロープ紐。高級感。', 'bag', '正常', 4.9),
('グロスラミネート袋 白 L', 'ラミネート袋', '福助工業', 'W380×D150×H500mm', 85, 800, '枚', 'GL-W-L01', '光沢PP加工。W380×D150×H500mm。ロープ紐。光沢仕上げ。', 'bag', '在庫少', 4.7),
('ボトル用紙袋 ワイン1本', 'ボトル袋', 'シモジマ', 'W130×D90×H360mm', 42, 1500, '枚', 'BT-W-001', 'ワインボトル1本用。W130×D90×H360mm。紐付き。', 'bag', '正常', 4.6),
('ボトル用紙袋 ワイン2本', 'ボトル袋', 'シモジマ', 'W200×D90×H360mm', 58, 900, '枚', 'BT-W-002', 'ワインボトル2本用。W200×D90×H360mm。仕切り付き。', 'bag', '在庫少', 4.5),
('平袋 茶 中', '平袋', 'マルタカパルプ', 'W200×H280mm', 8, 10000, '枚', 'FB-B-M01', '未晒クラフト紙。W200×H280mm。食品包装にも。', 'bag', '正常', 4.3),
('角底紙袋 白 小', '角底袋', '大昭和紙工産業', 'W130×D80×H235mm', 12, 8000, '枚', 'SB-W-S01', '晒クラフト紙。W130×D80×H235mm。パン・菓子用。', 'bag', '正常', 4.4),
('角底紙袋 茶 大', '角底袋', '大昭和紙工産業', 'W260×D100×H360mm', 15, 6000, '枚', 'SB-B-L01', '未晒クラフト紙。W260×D100×H360mm。テイクアウト用。', 'bag', '正常', 4.5),
('宅配袋 A4サイズ', '宅配袋', '福助工業', 'W250×D50×H340mm', 28, 3000, '枚', 'DL-A4-01', 'テープ付き宅配用紙袋。W250×D50×H340mm。', 'bag', '正常', 4.6),
('宅配袋 B4サイズ', '宅配袋', '福助工業', 'W320×D50×H400mm', 35, 2500, '枚', 'DL-B4-01', 'テープ付き宅配用紙袋。W320×D50×H400mm。', 'bag', '正常', 4.5),
('リボン付きギフト袋 S', 'ギフト袋', 'シモジマ', 'W180×D100×H250mm', 55, 1000, '枚', 'GF-R-S01', 'リボン付きギフト用。W180×D100×H250mm。結婚式・記念品。', 'bag', '正常', 4.9),
('窓付き紙袋 食品用 M', '食品用袋', '大昭和紙工産業', 'W150×D90×H280mm', 20, 4000, '枚', 'FD-W-M01', '透明窓付き。W150×D90×H280mm。焼き菓子・パン用。', 'bag', '正常', 4.7),
('耐水紙袋 フラワー用 L', 'フラワー袋', 'マルタカパルプ', 'W350×D150×H450mm', 48, 600, '枚', 'FL-L-001', '耐水加工。W350×D150×H450mm。花束・鉢植え用。', 'bag', '在庫少', 4.6),
('エコバッグ型紙袋 M', 'エコ袋', 'マルタカパルプ', 'W320×D115×H310mm', 30, 2000, '枚', 'EC-M-001', '再生紙100%。W320×D115×H310mm。FSC認証。', 'bag', '正常', 4.8),
('OPP透明袋 A4', '透明袋', '福助工業', 'W225×H310+40mm', 5, 15000, '枚', 'OP-A4-01', 'テープ付きOPP袋。W225×H310+40mm。カタログ・DM用。', 'bag', '正常', 4.4);

-- 紙袋関連の顧客
INSERT INTO customers (company_name, contact_name, email, phone, address, tier, price_rate, total_orders, total_spent, balance, payment_terms) VALUES
('花よし生花店', '花田 美咲', 'hanada@hanayoshi.jp', '03-5555-1234', '東京都渋谷区神宮前3-10-8', 'プラチナ', 0.85, 96, 1850000, 120000, '月末締め翌月末払い'),
('パティスリー・ルミエール', '佐藤 シェフ', 'sato@lumiere.jp', '045-2345-6789', '神奈川県横浜市中区元町4-5-6', 'ゴールド', 0.88, 64, 1280000, 85000, '月末締め翌月15日払い'),
('ワインショップ・ソムリエ', '田中 裕介', 'tanaka@sommelier.jp', '052-3456-7890', '愛知県名古屋市中区栄7-8-9', 'ゴールド', 0.88, 48, 960000, 62000, '月末締め翌月末払い'),
('アパレルセレクト TOKYO', '鈴木 麻衣', 'suzuki@select-tokyo.jp', '06-4567-8901', '大阪府大阪市北区梅田10-11-12', 'シルバー', 0.92, 32, 640000, 38000, '月末締め翌月末払い'),
('ECサポート物流', '高橋 健太', 'takahashi@ec-support.jp', '092-5678-9012', '福岡県福岡市博多区博多駅前13-14-15', 'スタンダード', 0.95, 15, 320000, 15000, '月末締め翌月20日払い');

-- 仕入れ先
INSERT INTO suppliers (name, contact_name, address, payment_terms) VALUES
('マルタカパルプ株式会社', '中村 太郎', '東京都中央区日本橋1-1-1', '月末締め翌月末払い'),
('大昭和紙工産業株式会社', '山本 花子', '静岡県富士市大淵1-2-3', '月末締め翌月15日払い'),
('福助工業株式会社', '伊藤 一郎', '愛媛県四国中央市三島1-4-5', '月末締め翌月末払い'),
('シモジマ株式会社', '渡辺 次郎', '東京都台東区浅草橋5-29-8', '月末締め翌月20日払い');

-- 注文データ
INSERT INTO orders (order_number, customer_name, total, status, payment_status, payment_method, order_date, delivery_date, carrier, tracking_number) VALUES
('PO-2024-0001', '花よし生花店', 16600, '配達完了', '決済済', '銀行振込', '2024-01-15', '2024-01-17', 'ヤマト運輸', '1234-5678-9012'),
('PO-2024-0002', 'パティスリー・ルミエール', 22000, '発送済', '決済済', 'クレジットカード', '2024-01-16', '2024-01-18', '佐川急便', '9876-5432-1098'),
('PO-2024-0003', 'ワインショップ・ソムリエ', 24200, '処理中', '未決済', '銀行振込', '2024-01-17', NULL, NULL, NULL),
('PO-2024-0004', 'アパレルセレクト TOKYO', 58000, '確認待ち', '未決済', '銀行振込', '2024-01-17', NULL, NULL, NULL),
('PO-2024-0005', '花よし生花店', 9600, '配達完了', '決済済', '銀行振込', '2024-01-14', '2024-01-15', '西濃運輸', '5555-6666-7777'),
('PO-2024-0006', 'ECサポート物流', 91000, '確認済', '未決済', '銀行振込', '2024-01-18', NULL, NULL, NULL);

-- 注文明細
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'クラフト手提げ袋 小', 500, 18 FROM orders o WHERE o.order_number = 'PO-2024-0001';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'カラー手提げ袋 赤 M', 200, 38 FROM orders o WHERE o.order_number = 'PO-2024-0001';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, '角底紙袋 白 小', 1000, 12 FROM orders o WHERE o.order_number = 'PO-2024-0002';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, '窓付き紙袋 食品用 M', 500, 20 FROM orders o WHERE o.order_number = 'PO-2024-0002';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'ボトル用紙袋 ワイン1本', 300, 42 FROM orders o WHERE o.order_number = 'PO-2024-0003';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'マットラミネート袋 黒 M', 500, 65 FROM orders o WHERE o.order_number = 'PO-2024-0004';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, '耐水紙袋 フラワー用 L', 200, 48 FROM orders o WHERE o.order_number = 'PO-2024-0005';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, '宅配袋 A4サイズ', 2000, 28 FROM orders o WHERE o.order_number = 'PO-2024-0006';

-- 記事
INSERT INTO articles (title, category, content, status, char_count, tags) VALUES
('紙袋の種類と選び方ガイド', '商品ガイド', '用途に合った紙袋の選び方を解説。手提げ袋、角底袋、宅配袋など種類別の特徴...', '公開済', 3200, ARRAY['ガイド','紙袋']),
('効率的な在庫管理のベストプラクティス', '業務改善', 'シーズン需要に合わせた在庫管理で、コスト削減と欠品防止を両立する方法...', '公開済', 2800, ARRAY['業務改善']),
('新商品：エコ素材紙袋シリーズの特徴', '新商品紹介', 'FSC認証の再生紙100%紙袋シリーズ。環境配慮型パッケージの需要増に対応...', '下書き', 1500, ARRAY['新商品','エコ']);

-- チャット
INSERT INTO chat_sessions (customer_name, company, last_message, assignee, priority, status) VALUES
('花田美咲', '花よし生花店', 'フラワー袋の在庫を確認したいです', '佐藤', '緊急', '対応中'),
('鈴木麻衣', 'アパレルセレクト', 'ラミネート袋のサンプルをお願いします', '佐藤', '完了', '解決済'),
('田中裕介', 'ワインショップ', 'ボトル袋のロゴ印刷は可能ですか？', '佐藤', '通常', '対応中'),
('佐藤シェフ', 'ルミエール', '窓付き袋の納期を教えてください', '佐藤', '通常', '対応中');

-- マスタデータ
INSERT INTO master_data (type, code, name) VALUES
('カテゴリ', 'CAT-001', '手提げ袋'), ('カテゴリ', 'CAT-002', 'カラー袋'), ('カテゴリ', 'CAT-003', 'ラミネート袋'),
('カテゴリ', 'CAT-004', 'ボトル袋'), ('カテゴリ', 'CAT-005', '平袋'), ('カテゴリ', 'CAT-006', '角底袋'),
('カテゴリ', 'CAT-007', '宅配袋'), ('カテゴリ', 'CAT-008', 'ギフト袋'), ('カテゴリ', 'CAT-009', '食品用袋'),
('カテゴリ', 'CAT-010', 'フラワー袋'), ('カテゴリ', 'CAT-011', 'エコ袋'), ('カテゴリ', 'CAT-012', '透明袋'),
('配送', 'DLV-001', 'トラック便'), ('配送', 'DLV-002', '宅配便'), ('配送', 'DLV-003', 'ヤマト運輸'),
('配送', 'DLV-004', '佐川急便'), ('配送', 'DLV-005', '西濃運輸'), ('配送', 'DLV-006', '店頭受取'),
('決済', 'PAY-001', '銀行振込'), ('決済', 'PAY-002', 'クレジットカード'),
('決済', 'PAY-003', '現金'), ('決済', 'PAY-004', 'コンビニ決済');

-- 請求設定
INSERT INTO billing_settings (customer_id, billing_cycle, closing_day, payment_due_type, payment_due_days, auto_generate)
SELECT id, '月末締め', 0, '翌月末', 30, true FROM customers;

-- 請求書
INSERT INTO invoices (invoice_number, customer_name, billing_period_start, billing_period_end, subtotal, tax_amount, total, status, issued_date, due_date) VALUES
('INV-2024-0001', '花よし生花店', '2024-01-01', '2024-01-31', 23818, 2382, 26200, '入金済', '2024-02-01', '2024-02-28'),
('INV-2024-0002', 'パティスリー・ルミエール', '2024-01-01', '2024-01-31', 20000, 2000, 22000, '送付済', '2024-02-01', '2024-02-15'),
('INV-2024-0003', 'アパレルセレクト TOKYO', '2024-01-01', '2024-01-31', 52727, 5273, 58000, '未発行', NULL, '2024-02-28');

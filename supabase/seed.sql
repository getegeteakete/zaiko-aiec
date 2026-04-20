-- ═══════════════════════════════════════
-- shopeee - Seed Data (初期データ)
-- ═══════════════════════════════════════

-- 商品データ
INSERT INTO products (name, category, maker, spec, price, stock, unit, sku, description, image, status, rating) VALUES
('ステンレス鋼管 50A', '配管材', '日本製鉄', '外径60.5mm × 厚さ2.0mm × 長さ4000mm', 4800, 120, '本', 'PIP-SS-50A', '外径60.5mm × 厚さ2.0mm × 長さ4000mm。日本製鉄製。', '🔧', '正常', 4.5),
('銅管 25A', '配管材', '三菱マテリアル', '外径28.58mm × 厚さ1.0mm × 長さ4000mm', 3200, 18, '本', 'PIP-CU-25A', '外径28.58mm × 厚さ1.0mm × 長さ4000mm。三菱マテリアル製。', '🔧', '危険', 4.8),
('VLP管 100A', '配管材', 'クボタケミックス', '外径114mm × 長さ4000mm', 2800, 85, '本', 'PIP-VL-100A', '外径114mm × 長さ4000mm。クボタケミックス製。', '🔧', '正常', 4.3),
('ボールバルブ 50A', 'バルブ', 'キッツ', 'ステンレス製 フルボア JIS10K', 8500, 45, '個', 'VLV-BB-50A', 'ステンレス製 フルボア JIS10K。キッツ製。', '🔩', '正常', 4.9),
('渦巻ポンプ 2HP', 'ポンプ', '荏原製作所', '揚程25m 流量200L/min', 125000, 8, '台', 'PMP-VR-2HP', '揚程25m 流量200L/min。荏原製作所製。', '⚙️', '在庫少', 4.6),
('ロックウール保温材 50mm', '保温材', 'ニチアス', '厚さ50mm × 幅610mm × 長さ1820mm', 1800, 200, '枚', 'INS-RW-50', '厚さ50mm × 幅610mm × 長さ1820mm。ニチアス製。', '📦', '正常', 4.1),
('ウェルドネックフランジ 80A', 'フランジ', 'ベンカン', 'JIS10K ステンレス製', 6200, 35, '個', 'FLG-WN-80A', 'JIS10K ステンレス製。ベンカン製。', '⭕', '正常', 4.4),
('PTFEガスケット 80A', 'ガスケット', 'バルカー', 'JIS10K 厚さ3mm', 850, 150, '枚', 'GSK-PT-80A', 'JIS10K 厚さ3mm。バルカー製。', '⭕', '正常', 4.7),
('ステンレスボルト M16×60', '締結材', 'サンコーインダストリー', 'SUS304 六角ボルト', 320, 500, '本', 'BLT-SS-M16', 'SUS304 六角ボルト。サンコーインダストリー製。', '🔩', '正常', 4.2),
('90°エルボ 50A', '継手', 'ベンカン', 'ステンレス製 ロングラジアス', 3500, 60, '個', 'FIT-EL-50A', 'ステンレス製 ロングラジアス。ベンカン製。', '🔧', '正常', 4.5);

-- 顧客データ
INSERT INTO customers (company_name, contact_name, email, phone, address, tier, price_rate, total_orders, total_spent, balance, payment_terms) VALUES
('山田設備工業株式会社', '山田 太郎', 'yamada@yamada-setsubi.jp', '03-1234-5678', '東京都品川区大崎1-2-3', 'プラチナ', 0.85, 96, 18500000, 1200000, '月末締め翌月末払い'),
('佐藤管工株式会社', '佐藤 一郎', 'sato@sato-kanko.jp', '045-2345-6789', '神奈川県横浜市中区港町4-5-6', 'ゴールド', 0.88, 64, 12800000, 850000, '月末締め翌月15日払い'),
('田中建設株式会社', '田中 次郎', 'tanaka@tanaka-kensetsu.jp', '052-3456-7890', '愛知県名古屋市中区栄7-8-9', 'ゴールド', 0.88, 48, 9600000, 620000, '月末締め翌月末払い'),
('鈴木産業株式会社', '鈴木 三郎', 'suzuki@suzuki-sangyo.jp', '06-4567-8901', '大阪府大阪市北区梅田10-11-12', 'シルバー', 0.92, 32, 6400000, 380000, '月末締め翌月末払い'),
('高橋工務店', '高橋 四郎', 'takahashi@takahashi-komu.jp', '092-5678-9012', '福岡県福岡市博多区博多駅前13-14-15', 'スタンダード', 0.95, 15, 3200000, 150000, '月末締め翌月20日払い');

-- 仕入れ先
INSERT INTO suppliers (name, contact_name, address, payment_terms) VALUES
('日本製鉄株式会社', '田中 太郎', '東京都千代田区丸の内1-1-1', '月末締め翌月末払い'),
('三菱マテリアル株式会社', '佐藤 花子', '東京都港区虎ノ門2-3-1', '月末締め翌月15日払い'),
('キッツ株式会社', '鈴木 一郎', '東京都渋谷区渋谷1-2-3', '月末締め翌月末払い'),
('クボタケミックス株式会社', '山田 次郎', '東京都新宿区新宿3-4-5', '月末締め翌月20日払い');

-- 注文データ (customer_idは後で紐付け)
INSERT INTO orders (order_number, customer_name, total, status, payment_status, payment_method, order_date, delivery_date, carrier, tracking_number) VALUES
('PO-2024-0001', '山田設備工業株式会社', 552500, '配達完了', '決済済', '銀行振込', '2024-01-15', '2024-01-17', 'ヤマト運輸', '1234-5678-9012'),
('PO-2024-0002', '佐藤管工株式会社', 233200, '発送済', '決済済', 'クレジットカード', '2024-01-16', '2024-01-18', '佐川急便', '9876-5432-1098'),
('PO-2024-0003', '田中建設株式会社', 711040, '処理中', '未決済', '銀行振込', '2024-01-17', NULL, NULL, NULL),
('PO-2024-0004', '鈴木産業株式会社', 395600, '確認待ち', '未決済', '銀行振込', '2024-01-17', NULL, NULL, NULL),
('PO-2024-0005', '山田設備工業株式会社', 144600, '配達完了', '決済済', '銀行振込', '2024-01-14', '2024-01-15', '西濃運輸', '5555-6666-7777'),
('PO-2024-0006', '高橋工務店', 136800, '確認済', '未決済', '現金', '2024-01-18', NULL, NULL, NULL);

-- 注文明細
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'ステンレス鋼管 50A', 100, 4080 FROM orders o WHERE o.order_number = 'PO-2024-0001';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'ボールバルブ 50A', 20, 7225 FROM orders o WHERE o.order_number = 'PO-2024-0001';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, '銅管 25A', 50, 2816 FROM orders o WHERE o.order_number = 'PO-2024-0002';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, '90°エルボ 50A', 30, 3080 FROM orders o WHERE o.order_number = 'PO-2024-0002';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'VLP管 100A', 200, 2464 FROM orders o WHERE o.order_number = 'PO-2024-0003';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'ウェルドネックフランジ 80A', 40, 5456 FROM orders o WHERE o.order_number = 'PO-2024-0003';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, '渦巻ポンプ 2HP', 2, 115000 FROM orders o WHERE o.order_number = 'PO-2024-0004';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'ロックウール保温材 50mm', 100, 1656 FROM orders o WHERE o.order_number = 'PO-2024-0004';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'PTFEガスケット 80A', 200, 723 FROM orders o WHERE o.order_number = 'PO-2024-0005';
INSERT INTO order_items (order_id, product_name, quantity, unit_price)
SELECT o.id, 'ステンレス鋼管 50A', 30, 4560 FROM orders o WHERE o.order_number = 'PO-2024-0006';

-- 記事データ
INSERT INTO articles (title, category, content, status, char_count, tags) VALUES
('配管材の選び方とメンテナンス方法', '商品ガイド', '配管材を選ぶ際のポイントと、長持ちさせるためのメンテナンス方法について解説します...', '公開済', 3200, ARRAY['メンテナンス','ガイド']),
('効率的な在庫管理のベストプラクティス', '業務改善', '効率的な在庫管理により、コスト削減と顧客満足度向上を実現する方法を紹介...', '公開済', 2800, ARRAY['業務改善']),
('新商品：ステンレス鋼管シリーズの特徴', '新商品紹介', '当社が新たに取り扱いを開始したステンレス鋼管シリーズの特徴と用途について...', '下書き', 1500, ARRAY['新商品','ステンレス鋼管']);

-- チャットセッション
INSERT INTO chat_sessions (customer_name, company, last_message, assignee, priority, status) VALUES
('山田太郎', '山田設備工業', '在庫の確認をお願いします', '佐藤', '緊急', '対応中'),
('鈴木花子', '鈴木管工', 'ありがとうございました！', '佐藤', '完了', '解決済'),
('田中一郎', '田中建設', '見積もりをお願いします', '山田', '通常', '対応中'),
('佐藤次郎', '佐藤設備', '納期について教えてください', '山田', '通常', '対応中');

-- マスタデータ
INSERT INTO master_data (type, code, name) VALUES
('カテゴリ', 'CAT-001', '配管材'), ('カテゴリ', 'CAT-002', 'バルブ'), ('カテゴリ', 'CAT-003', 'ポンプ'),
('カテゴリ', 'CAT-004', '保温材'), ('カテゴリ', 'CAT-005', 'フランジ'), ('カテゴリ', 'CAT-006', 'ガスケット'),
('カテゴリ', 'CAT-007', '締結材'), ('カテゴリ', 'CAT-008', '継手'),
('配送', 'DLV-001', 'トラック便'), ('配送', 'DLV-002', '宅配便'), ('配送', 'DLV-003', 'ヤマト運輸'),
('配送', 'DLV-004', '佐川急便'), ('配送', 'DLV-005', '日本郵便'), ('配送', 'DLV-006', '西濃運輸'),
('配送', 'DLV-007', '福山通運'), ('配送', 'DLV-008', '店頭受取'),
('決済', 'PAY-001', '銀行振込'), ('決済', 'PAY-002', 'クレジットカード'),
('決済', 'PAY-003', '現金'), ('決済', 'PAY-004', 'コンビニ決済');

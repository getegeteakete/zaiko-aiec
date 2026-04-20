-- ═══════════════════════════════════════
-- shopeee BtoB EC - Database Schema
-- Supabase PostgreSQL
-- ═══════════════════════════════════════

-- 商品テーブル
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  maker TEXT,
  spec TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT DEFAULT '個',
  sku TEXT UNIQUE,
  description TEXT,
  image TEXT DEFAULT '📦',
  status TEXT DEFAULT '正常',
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 顧客テーブル
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  tier TEXT DEFAULT 'スタンダード',
  price_rate NUMERIC(3,2) DEFAULT 1.00,
  total_orders INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  balance INTEGER DEFAULT 0,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 注文テーブル
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT,
  total INTEGER DEFAULT 0,
  status TEXT DEFAULT '確認待ち',
  payment_status TEXT DEFAULT '未決済',
  payment_method TEXT,
  order_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE,
  carrier TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 注文明細テーブル
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 仕入れ先テーブル
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 仕入れ発注テーブル
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  supplier_name TEXT,
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  quantity INTEGER DEFAULT 0,
  unit_price INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  status TEXT DEFAULT '発注済',
  order_date DATE DEFAULT CURRENT_DATE,
  expected_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI記事テーブル
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  content TEXT,
  status TEXT DEFAULT '下書き',
  char_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- チャットセッション
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  company TEXT,
  last_message TEXT,
  assignee TEXT,
  priority TEXT DEFAULT '通常',
  status TEXT DEFAULT '対応中',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- チャットメッセージ
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- マスタテーブル
CREATE TABLE IF NOT EXISTS master_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT '有効',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(type, code)
);

-- 在庫変動ログ
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  change_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══ Updated_at トリガー ═══
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER customers_updated BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER articles_updated BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══ RLS (Row Level Security) ═══
-- デモ用：anonキーで全操作可能にする
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- デモ用ポリシー (全操作許可)
CREATE POLICY "Allow all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON master_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON inventory_logs FOR ALL USING (true) WITH CHECK (true);

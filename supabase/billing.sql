-- ═══════════════════════════════════════
-- BtoB 請求管理テーブル
-- ═══════════════════════════════════════

-- 請求設定（顧客ごと）
CREATE TABLE IF NOT EXISTS billing_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  billing_cycle TEXT NOT NULL DEFAULT '月末締め',
  -- 月末締め / 15日締め / 20日締め / 即日 / カスタム
  closing_day INTEGER DEFAULT 0,
  -- 0=月末, 1-28=その日に締め
  payment_due_type TEXT NOT NULL DEFAULT '翌月末',
  -- 翌月末 / 翌月15日 / 翌月20日 / 翌々月末 / 30日後 / 60日後 / 即日
  payment_due_days INTEGER DEFAULT 30,
  -- 締め日から何日後に支払期日か
  auto_generate BOOLEAN DEFAULT true,
  -- 自動発行するか
  invoice_prefix TEXT DEFAULT 'INV',
  tax_rate NUMERIC(4,2) DEFAULT 10.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id)
);

-- 請求書
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT,
  billing_period_start DATE,
  billing_period_end DATE,
  subtotal INTEGER DEFAULT 0,
  tax_amount INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  status TEXT DEFAULT '未発行',
  -- 未発行 / 発行済 / 送付済 / 入金済 / 一部入金 / 延滞
  issued_date DATE,
  due_date DATE,
  paid_date DATE,
  paid_amount INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 請求明細
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  order_number TEXT,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER DEFAULT 0,
  amount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON billing_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON invoice_items FOR ALL USING (true) WITH CHECK (true);

-- Triggers
DO $$ BEGIN
  CREATE TRIGGER invoices_updated BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER billing_settings_updated BEFORE UPDATE ON billing_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 初期データ: 既存顧客の請求設定
INSERT INTO billing_settings (customer_id, billing_cycle, closing_day, payment_due_type, payment_due_days, auto_generate)
SELECT id, '月末締め', 0, '翌月末', 30, true FROM customers
ON CONFLICT (customer_id) DO NOTHING;

-- サンプル請求書
INSERT INTO invoices (invoice_number, customer_name, billing_period_start, billing_period_end, subtotal, tax_amount, total, status, issued_date, due_date)
SELECT 
  'INV-2024-0001',
  '山田設備工業株式会社',
  '2024-01-01', '2024-01-31',
  633409, 63341, 696750,
  '入金済', '2024-02-01', '2024-02-28'
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-0001');

INSERT INTO invoices (invoice_number, customer_name, billing_period_start, billing_period_end, subtotal, tax_amount, total, status, issued_date, due_date)
SELECT
  'INV-2024-0002',
  '佐藤管工株式会社',
  '2024-01-01', '2024-01-31',
  212000, 21200, 233200,
  '送付済', '2024-02-01', '2024-02-15'
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-0002');

INSERT INTO invoices (invoice_number, customer_name, billing_period_start, billing_period_end, subtotal, tax_amount, total, status, issued_date, due_date)
SELECT
  'INV-2024-0003',
  '田中建設株式会社',
  '2024-01-01', '2024-01-31',
  646400, 64640, 711040,
  '未発行', NULL, '2024-02-28'
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-0003');

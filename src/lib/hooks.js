import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseReady } from './supabase';

// ═══ Generic fetch hook ═══
export function useSupabase(table, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseReady()) { setLoading(false); return; }
    setLoading(true);
    try {
      let q = supabase.from(table).select(options.select || '*');
      if (options.order) q = q.order(options.order, { ascending: options.asc ?? false });
      if (options.filter) {
        for (const [col, val] of Object.entries(options.filter)) {
          q = q.eq(col, val);
        }
      }
      if (options.limit) q = q.limit(options.limit);
      const { data: rows, error: err } = await q;
      if (err) throw err;
      setData(rows || []);
    } catch (e) {
      console.error(`[${table}]`, e);
      setError(e);
    }
    setLoading(false);
  }, [table, JSON.stringify(options)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch, setData };
}

// ═══ Products ═══
export function useProducts() {
  return useSupabase('products', { order: 'created_at' });
}

// ═══ Customers ═══
export function useCustomers() {
  return useSupabase('customers', { order: 'total_spent' });
}

// ═══ Orders with items ═══
export function useOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!isSupabaseReady()) { setLoading(false); return; }
    setLoading(true);
    const { data: orders } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setData(orders || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

// ═══ Create Order ═══
export async function createOrder({ customerName, items, paymentMethod, total }) {
  const orderNum = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  
  if (!isSupabaseReady()) throw new Error("DB not ready");
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNum,
      customer_name: customerName || 'ゲスト',
      total,
      status: '確認待ち',
      payment_status: '未決済',
      payment_method: paymentMethod || '銀行振込',
      order_date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) throw error;

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
  }));

  await supabase.from('order_items').insert(orderItems);

  // Update stock
  for (const item of items) {
    await supabase.rpc('decrement_stock', { 
      p_sku: item.sku, 
      p_qty: item.quantity 
    }).catch(() => {
      // If RPC doesn't exist, do manual update
      supabase
        .from('products')
        .update({ stock: item.stock - item.quantity })
        .eq('sku', item.sku);
    });
  }

  return order;
}

// ═══ Update Order Status ═══
export async function updateOrderStatus(id, status) {
  return supabase.from('orders').update({ status }).eq('id', id);
}

// ═══ Update Payment Status ═══
export async function updatePaymentStatus(id, paymentStatus) {
  return supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', id);
}

// ═══ Products CRUD ═══
export async function createProduct(product) {
  return supabase.from('products').insert(product).select().single();
}

export async function updateProduct(id, updates) {
  return supabase.from('products').update(updates).eq('id', id);
}

export async function updateStock(id, newStock) {
  const status = newStock <= 0 ? '欠品' : newStock < 20 ? '危険' : newStock < 50 ? '在庫少' : '正常';
  return supabase.from('products').update({ stock: newStock, status }).eq('id', id);
}

// ═══ Customers CRUD ═══
export async function createCustomer(customer) {
  return supabase.from('customers').insert(customer).select().single();
}

export async function updateCustomer(id, updates) {
  return supabase.from('customers').update(updates).eq('id', id);
}

// ═══ Articles ═══
export function useArticles() {
  return useSupabase('articles', { order: 'created_at' });
}

export async function createArticle(article) {
  return supabase.from('articles').insert(article).select().single();
}

// ═══ Chat Sessions ═══
export function useChatSessions() {
  return useSupabase('chat_sessions', { order: 'updated_at' });
}

export function useChatMessages(sessionId) {
  return useSupabase('chat_messages', { 
    filter: sessionId ? { session_id: sessionId } : undefined,
    order: 'created_at',
    asc: true,
  });
}

export async function sendChatMessage(sessionId, role, content) {
  const { data } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, role, content })
    .select()
    .single();
  
  // Update session last message
  await supabase
    .from('chat_sessions')
    .update({ last_message: content, updated_at: new Date().toISOString() })
    .eq('id', sessionId);
  
  return data;
}

// ═══ Suppliers ═══
export function useSuppliers() {
  return useSupabase('suppliers', { order: 'created_at' });
}

// ═══ Master Data ═══
export function useMasterData(type) {
  return useSupabase('master_data', { 
    filter: type ? { type } : undefined,
    order: 'code',
    asc: true,
  });
}

// ═══ Inventory Logs ═══
export async function logInventoryChange(productId, productName, changeType, quantity, note) {
  return supabase.from('inventory_logs').insert({
    product_id: productId,
    product_name: productName,
    change_type: changeType,
    quantity,
    note,
  });
}

// ═══ Dashboard Stats ═══
export async function getDashboardStats() {
  const [products, customers, orders] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('customers').select('*'),
    supabase.from('orders').select('*'),
  ]);

  return {
    totalProducts: products.data?.length || 0,
    totalCustomers: customers.data?.length || 0,
    totalOrders: orders.data?.length || 0,
    totalSales: orders.data?.reduce((s, o) => s + (o.total || 0), 0) || 0,
    lowStockProducts: products.data?.filter(p => p.status !== '正常') || [],
    recentOrders: orders.data?.slice(0, 5) || [],
  };
}

// ═══ Guard wrapper ═══
function guardedAsync(fn) {
  return async (...args) => {
    if (!isSupabaseReady()) return { data: null, error: new Error('DB not configured') };
    return fn(...args);
  };
}

// ═══ Billing Settings ═══
export function useBillingSettings() {
  return useSupabase('billing_settings', { order: 'created_at', asc: true });
}

export async function upsertBillingSetting(customerId, settings) {
  return supabase.from('billing_settings').upsert({
    customer_id: customerId,
    ...settings,
  }, { onConflict: 'customer_id' }).select().single();
}

// ═══ Invoices ═══
export function useInvoices() {
  return useSupabase('invoices', { order: 'created_at' });
}

export async function createInvoice({ customerName, customerId, periodStart, periodEnd, items, taxRate = 10 }) {
  const num = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const taxAmount = Math.floor(subtotal * taxRate / 100);

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      invoice_number: num,
      customer_id: customerId,
      customer_name: customerName,
      billing_period_start: periodStart,
      billing_period_end: periodEnd,
      subtotal,
      tax_amount: taxAmount,
      total: subtotal + taxAmount,
      status: '発行済',
      issued_date: new Date().toISOString().split('T')[0],
      due_date: periodEnd,
    })
    .select()
    .single();

  if (error) throw error;

  if (items.length > 0) {
    await supabase.from('invoice_items').insert(
      items.map(i => ({ invoice_id: invoice.id, ...i }))
    );
  }
  return invoice;
}

export async function updateInvoiceStatus(id, status, paidAmount) {
  const updates = { status };
  if (status === '入金済') updates.paid_date = new Date().toISOString().split('T')[0];
  if (paidAmount !== undefined) updates.paid_amount = paidAmount;
  return supabase.from('invoices').update(updates).eq('id', id);
}

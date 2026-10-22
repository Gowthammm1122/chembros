import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, FlaskConical, MessageSquare, Settings, 
  Lock, LogOut, CheckCircle2, AlertCircle, RefreshCw, Eye, ShieldCheck, ChevronRight,
  Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight
} from 'lucide-react';
import { formatPrice } from '../data/fragrances';

export const AdminPage: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('chembros_admin_token') !== null;
  });
  const [loginEmail, setLoginEmail] = useState('admin@chembros.in');
  const [loginPass, setLoginPass] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'messages' | 'settings'>('overview');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Product management modal & editor state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    formulaNo: '05',
    family: 'Luminous Solar Floral',
    subtitle: '',
    description: '',
    character: '',
    liquidColor: 'rgba(225, 185, 105, 0.45)',
    price50: 4500,
    stock50: 100,
    price100: 7200,
    stock100: 100,
    topNotes: 'Dewy Green Tea, Bergamot, Pink Pepper',
    heartNotes: 'Madurai Jasmine Absolute, White Petals',
    baseNotes: 'Ambroxan, Skin Musk, Solar Woods',
    ratio: '28% Pure Extrait Concentration',
    maceration: '90 Days in Dark Nitrogen Vault',
    volatility: 'Medium-Low (12–14 hr persistence)',
    ph: '5.4 botanical balance',
    keyIsolate: 'Benzyl Acetate Molecular Isolate',
  });

  // Inline quick editing state for variant price & stock
  const [inlineEditVariantId, setInlineEditVariantId] = useState<string | null>(null);
  const [inlinePrice, setInlinePrice] = useState<number>(0);
  const [inlineStock, setInlineStock] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('chembros_admin_token', data.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || 'Login error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chembros_admin_token');
    setIsAuthenticated(false);
  };

  const loadData = async () => {
    setLoading(true);
    setActionSuccess(null);
    try {
      if (activeTab === 'overview') {
        const res = await fetch('/api/admin/dashboard').then(r => r.json());
        if (res.success) setStats(res);
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders').then(r => r.json());
        if (res.success) setOrders(res.data);
      } else if (activeTab === 'products') {
        const res = await fetch('/api/admin/products').then(r => r.json());
        if (res.success) setProducts(res.data);
      } else if (activeTab === 'messages') {
        const res = await fetch('/api/admin/messages').then(r => r.json());
        if (res.success) setMessages(res.data);
      } else if (activeTab === 'settings') {
        const res = await fetch('/api/admin/settings').then(r => r.json());
        if (res.success) setSettings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).then(r => r.json());

      if (res.success) {
        setActionSuccess(`Order #${id} updated to ${status}`);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      formulaNo: String(products.length + 1).padStart(2, '0'),
      family: 'Luminous Solar Floral',
      subtitle: '',
      description: '',
      character: '',
      liquidColor: 'rgba(225, 185, 105, 0.45)',
      price50: 4500,
      stock50: 100,
      price100: 7200,
      stock100: 100,
      topNotes: 'Dewy Green Tea, Bergamot, Pink Pepper',
      heartNotes: 'Madurai Jasmine Absolute, White Petals',
      baseNotes: 'Ambroxan, Skin Musk, Solar Woods',
      ratio: '28% Pure Extrait Concentration',
      maceration: '90 Days in Dark Nitrogen Vault',
      volatility: 'Medium-Low (12–14 hr persistence)',
      ph: '5.4 botanical balance',
      keyIsolate: 'Benzyl Acetate Molecular Isolate',
    });
    setShowProductModal(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    const v50 = p.variants?.find((v: any) => v.sizeMl === 50);
    const v100 = p.variants?.find((v: any) => v.sizeMl === 100);

    setProductForm({
      name: p.name,
      formulaNo: p.formulaNo || p.formula_no || '01',
      family: p.family || '',
      subtitle: p.subtitle || '',
      description: p.description || '',
      character: p.character || '',
      liquidColor: p.liquidColor || p.liquid_color || 'rgba(225, 185, 105, 0.45)',
      price50: v50 ? v50.price : p.price || 4500,
      stock50: v50 ? v50.stockQuantity : 100,
      price100: v100 ? v100.price : 7200,
      stock100: v100 ? v100.stockQuantity : 100,
      topNotes: Array.isArray(p.pyramid?.top) ? p.pyramid.top.join(', ') : '',
      heartNotes: Array.isArray(p.pyramid?.heart) ? p.pyramid.heart.join(', ') : '',
      baseNotes: Array.isArray(p.pyramid?.base) ? p.pyramid.base.join(', ') : '',
      ratio: p.specs?.ratio || '',
      maceration: p.specs?.maceration || '',
      volatility: p.specs?.volatility || '',
      ph: p.specs?.ph || '',
      keyIsolate: p.specs?.keyIsolate || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const topArr = productForm.topNotes.split(',').map(s => s.trim()).filter(Boolean);
      const heartArr = productForm.heartNotes.split(',').map(s => s.trim()).filter(Boolean);
      const baseArr = productForm.baseNotes.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        name: productForm.name,
        formulaNo: productForm.formulaNo,
        family: productForm.family,
        subtitle: productForm.subtitle,
        description: productForm.description,
        character: productForm.character,
        liquidColor: productForm.liquidColor,
        variants: [
          { sizeMl: 50, price: Number(productForm.price50), stockQuantity: Number(productForm.stock50) },
          { sizeMl: 100, price: Number(productForm.price100), stockQuantity: Number(productForm.stock100) },
        ],
        pyramid: { top: topArr, heart: heartArr, base: baseArr },
        spec: {
          ratio: productForm.ratio,
          maceration: productForm.maceration,
          volatility: productForm.volatility,
          ph: productForm.ph,
          keyIsolate: productForm.keyIsolate,
        },
      };

      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(r => r.json());

      if (res.success) {
        setActionSuccess(editingProduct ? `Formulation ${productForm.name} updated` : `Formulation ${productForm.name} created`);
        setShowProductModal(false);
        loadData();
      } else {
        alert(res.error?.message || res.message || 'Failed to save formulation');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving formulation');
    }
  };

  const handleToggleProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/toggle`, {
        method: 'PATCH',
      }).then(r => r.json());

      if (res.success) {
        setActionSuccess(res.message);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete formulation "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      }).then(r => r.json());

      if (res.success) {
        setActionSuccess(res.message);
        loadData();
      } else {
        alert(res.error?.message || 'Error deleting formulation');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickSaveVariant = async (variantId: string) => {
    try {
      const res = await fetch(`/api/admin/variants/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(inlinePrice), stockQuantity: Number(inlineStock) }),
      }).then(r => r.json());

      if (res.success) {
        setActionSuccess('Price and inventory saved');
        setInlineEditVariantId(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      }).then(r => r.json());

      if (res.success) {
        setActionSuccess('Store settings updated successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // Unauthenticated State: Sign In Form
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#03151D] text-white flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-[#0A2533] border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-sm border border-[#087A91] text-[#087A91] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl font-medium tracking-tight text-white">
              Atelier Management
            </h1>
            <p className="font-mono text-xs text-[#9BB3C1]">
              Chem Bros Internal Administration Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-[#9BB3C1] tracking-wider block">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#03151D] border border-white/15 text-white font-mono text-xs focus:border-[#48B8CE] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-[#9BB3C1] tracking-wider block">
                Security Password
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#03151D] border border-white/15 text-white font-mono text-xs focus:border-[#48B8CE] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#087A91] hover:bg-[#48B8CE] text-white font-mono text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoggingIn ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
            </button>

            <div className="p-3 bg-white/5 border border-white/10 text-[11px] font-mono text-[#9BB3C1] text-center">
              Default access: <span className="text-white font-semibold">admin@chembros.in</span> / <span className="text-white font-semibold">admin123</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated State: Admin Workspace
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0A2533] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#0A2533]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#087A91] uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Internal Operations // Node.js + SQLite Engine</span>
            </div>
            <h1 className="font-display text-3xl font-medium text-[#0A2533] tracking-tight mt-1">
              Atelier Backoffice
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 border border-[#0A2533]/15 hover:border-[#0A2533] text-[#0A2533] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A2533] hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-[#0A2533]/10 mt-6 pb-px">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
            { id: 'products', label: 'Catalogue & Prices', icon: FlaskConical },
            { id: 'messages', label: 'Concierge Inquiries', icon: MessageSquare },
            { id: 'settings', label: 'Store & Gateway Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer shrink-0 ${
                  active
                    ? 'border-[#087A91] text-[#087A91] font-semibold bg-white'
                    : 'border-transparent text-[#5A7785] hover:text-[#0A2533]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'overview' && stats && (
          <div className="mt-8 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 bg-white border border-[#0A2533]/10 space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider">Settled Revenue</span>
                <div className="font-mono text-2xl font-bold text-[#0A2533] tabular-nums">
                  {formatPrice(stats.stats.totalRevenue)}
                </div>
                <div className="text-[10px] font-mono text-emerald-700">From completed orders</div>
              </div>

              <div className="p-6 bg-white border border-[#0A2533]/10 space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider">Total Orders</span>
                <div className="font-mono text-2xl font-bold text-[#0A2533] tabular-nums">
                  {stats.stats.totalOrders}
                </div>
                <div className="text-[10px] font-mono text-[#5A7785]">All historical batches</div>
              </div>

              <div className="p-6 bg-white border border-[#0A2533]/10 space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider">Queue Processing</span>
                <div className="font-mono text-2xl font-bold text-[#087A91] tabular-nums">
                  {stats.stats.pendingOrders}
                </div>
                <div className="text-[10px] font-mono text-[#5A7785]">Awaiting fulfillment</div>
              </div>

              <div className="p-6 bg-white border border-[#0A2533]/10 space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider">New Inquiries</span>
                <div className="font-mono text-2xl font-bold text-[#0A2533] tabular-nums">
                  {stats.stats.unreadMessages}
                </div>
                <div className="text-[10px] font-mono text-[#087A91]">From fragrance concierge</div>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white border border-[#0A2533]/10 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#0A2533]/10">
                <h3 className="font-display font-medium text-lg text-[#0A2533]">Recent Batches</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-mono text-[#087A91] hover:underline uppercase"
                >
                  View All Orders →
                </button>
              </div>

              {stats.recentOrders?.length === 0 ? (
                <div className="py-8 text-center font-mono text-xs text-[#5A7785]">
                  No orders recorded yet. Make a test order on the storefront!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#F8FAFC] text-[#5A7785] border-b border-[#0A2533]/10">
                      <tr>
                        <th className="p-3">Reference</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">City / State</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0A2533]/5">
                      {stats.recentOrders.map((o: any) => (
                        <tr key={o.id} className="hover:bg-[#F8FAFC]">
                          <td className="p-3 font-semibold text-[#0A2533]">{o.ref}</td>
                          <td className="p-3">{o.name}</td>
                          <td className="p-3">{o.city}, {o.state}</td>
                          <td className="p-3 font-semibold tabular-nums">{formatPrice(o.total)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                              o.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.payment_status}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-[#087A91]">{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 2: ORDERS & FULFILLMENT */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="mt-8 bg-white border border-[#0A2533]/10 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#0A2533]/10">
              <h2 className="font-display font-medium text-lg text-[#0A2533]">
                Customer Orders & Dispatch Log
              </h2>
              <span className="font-mono text-xs text-[#087A91]">{orders.length} Total</span>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-[#5A7785]">
                No orders found.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="p-5 border border-[#0A2533]/10 bg-[#F8FAFC] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#0A2533]/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-[#0A2533]">{order.ref}</span>
                        {order.invoice_no && (
                          <span className="px-2 py-0.5 bg-[#0A2533]/5 text-[#0A2533] text-[10px] font-mono font-semibold">
                            GST INVOICE: {order.invoice_no}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold ${
                          order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#5A7785]">Fulfillment:</span>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          className="px-2.5 py-1 text-xs font-mono bg-white border border-[#0A2533]/20 focus:border-[#087A91] outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[#5A7785] block text-[10px] uppercase">Customer</span>
                        <span className="font-semibold text-[#0A2533]">{order.name}</span>
                        <span className="block text-[#5A7785]">{order.email}</span>
                        <span className="block text-[#5A7785]">+91 {order.phone}</span>
                      </div>

                      <div>
                        <span className="text-[#5A7785] block text-[10px] uppercase">Delivery Address</span>
                        <span className="text-[#0A2533]">{order.line1}</span>
                        <span className="block text-[#0A2533]">{order.city}, {order.state} - {order.postcode}</span>
                      </div>

                      <div>
                        <span className="text-[#5A7785] block text-[10px] uppercase">Financials</span>
                        <span className="font-semibold text-[#0A2533] text-sm tabular-nums">
                          Total: {formatPrice(order.total)}
                        </span>
                        <span className="block text-[11px] text-[#5A7785]">Subtotal: {formatPrice(order.subtotal)} | Ship: {formatPrice(order.shipping)}</span>
                        {order.tax > 0 && (
                          <span className="block text-[10px] text-[#087A91]">GST: {formatPrice(order.tax)} ({order.cgst > 0 ? `CGST: ${formatPrice(order.cgst)} + SGST: ${formatPrice(order.sgst)}` : `IGST: ${formatPrice(order.igst)}`})</span>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="pt-2 border-t border-[#0A2533]/5">
                        <span className="text-[10px] font-mono text-[#5A7785] uppercase block mb-1">Specimens Allocated:</span>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((i: any) => (
                            <span key={i.id} className="px-2.5 py-1 bg-white border border-[#0A2533]/10 font-mono text-xs">
                              {i.name} ({i.size}ml) × {i.qty} — <span className="font-semibold">{formatPrice(i.line_total)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 3: PRODUCTS & PRICES */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="mt-8 bg-white border border-[#0A2533]/10 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0A2533]/10">
              <div>
                <h2 className="font-display font-medium text-lg text-[#0A2533]">
                  Laboratory Formulations & Pricing
                </h2>
                <p className="font-mono text-xs text-[#5A7785]">
                  Manage active formulas, adjust retail prices, monitor vault inventory, and craft new specimens.
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#087A91] hover:bg-[#0A2533] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Formulation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map(p => (
                <div key={p.id} className="p-5 border border-[#0A2533]/10 bg-[#F8FAFC] space-y-4 flex flex-col justify-between">
                  <div>
                    {/* Header: Badge, Name, Status & Action Icons */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#0A2533]/10">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-9 h-9 rounded-sm font-mono text-xs font-bold flex items-center justify-center text-[#0A2533] border border-black/10 shadow-inner"
                          style={{ background: p.liquidColor || p.liquid_color || 'rgba(225, 185, 105, 0.45)' }}
                        >
                          {p.formulaNo || p.formula_no}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-medium text-base text-[#0A2533]">{p.name}</h3>
                            <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider ${
                              p.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                            }`}>
                              {p.isActive !== false ? 'ACTIVE' : 'ARCHIVED'}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[#5A7785]">{p.family}</span>
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleProduct(p.id)}
                          title={p.isActive !== false ? 'Archive from storefront' : 'Make active in storefront'}
                          className="p-1.5 hover:bg-white text-[#5A7785] hover:text-[#087A91] border border-transparent hover:border-[#0A2533]/15 transition-all cursor-pointer"
                        >
                          {p.isActive !== false ? (
                            <ToggleRight className="w-5 h-5 text-emerald-700" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-zinc-400" />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit full formulation"
                          className="p-1.5 hover:bg-white text-[#5A7785] hover:text-[#087A91] border border-transparent hover:border-[#0A2533]/15 transition-all cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          title="Delete or archive formulation"
                          className="p-1.5 hover:bg-white text-[#5A7785] hover:text-red-700 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-[#5A7785] line-clamp-2 mt-3 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Variant Price & Inventory Table */}
                    <div className="mt-4 space-y-2">
                      <span className="text-[10px] font-mono text-[#5A7785] uppercase tracking-wider block">
                        Variants & Vault Stock
                      </span>

                      <div className="space-y-2">
                        {(p.variants || []).map((v: any) => {
                          const isEditing = inlineEditVariantId === v.id;
                          return (
                            <div
                              key={v.id}
                              className="p-2.5 bg-white border border-[#0A2533]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#0A2533]">{v.sizeMl}ml</span>
                                <span className="text-[10px] text-[#5A7785]">({v.sku})</span>
                              </div>

                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-[#5A7785]">₹</span>
                                    <input
                                      type="number"
                                      value={inlinePrice}
                                      onChange={e => setInlinePrice(Number(e.target.value))}
                                      className="w-20 px-2 py-1 border border-[#087A91] text-xs font-bold text-[#0A2533] outline-none"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-[#5A7785]">Stock:</span>
                                    <input
                                      type="number"
                                      value={inlineStock}
                                      onChange={e => setInlineStock(Number(e.target.value))}
                                      className="w-16 px-2 py-1 border border-[#087A91] text-xs font-bold text-[#0A2533] outline-none"
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleQuickSaveVariant(v.id)}
                                    className="p-1 bg-[#087A91] text-white hover:bg-[#0A2533] transition-colors cursor-pointer"
                                    title="Save price & stock"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setInlineEditVariantId(null)}
                                    className="p-1 text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-[#087A91] tabular-nums">
                                    {formatPrice(v.price)}
                                  </span>
                                  <span className={`px-2 py-0.5 text-[10px] ${
                                    v.stockQuantity < 20 ? 'bg-red-100 text-red-800 font-bold' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {v.stockQuantity} in vault
                                  </span>
                                  <button
                                    onClick={() => {
                                      setInlineEditVariantId(v.id);
                                      setInlinePrice(v.price);
                                      setInlineStock(v.stockQuantity);
                                    }}
                                    className="text-[10px] text-[#087A91] hover:underline cursor-pointer"
                                  >
                                    Quick Edit
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-3 border-t border-[#0A2533]/10 flex items-center justify-between text-[11px] font-mono text-[#5A7785]">
                    <span>Slug: /{p.slug}</span>
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-[#087A91] hover:underline"
                    >
                      Inspect Pyramids & Specs →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 4: CONCIERGE MESSAGES */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'messages' && (
          <div className="mt-8 bg-white border border-[#0A2533]/10 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#0A2533]/10">
              <h2 className="font-display font-medium text-lg text-[#0A2533]">
                Client Concierge Inquiries
              </h2>
              <span className="font-mono text-xs text-[#087A91]">{messages.length} Submissions</span>
            </div>

            {messages.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-[#5A7785]">
                No customer inquiries received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className="p-5 border border-[#0A2533]/10 bg-[#F8FAFC] space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-baseline pb-2 border-b border-[#0A2533]/10">
                      <div>
                        <span className="font-bold text-sm text-[#0A2533]">{msg.name}</span>
                        <span className="text-[#5A7785] ml-2">&lt;{msg.email}&gt;</span>
                      </div>
                      <span className="text-[#5A7785] text-[10px]">{msg.created_at}</span>
                    </div>
                    <div className="text-[#087A91] font-semibold">Subject: {msg.subject}</div>
                    <p className="text-[#0A2533] whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 5: STORE & GATEWAY SETTINGS */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="mt-8 bg-white border border-[#0A2533]/10 p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-[#0A2533]/10">
              <h2 className="font-display font-medium text-lg text-[#0A2533]">
                Store, GST & Cashfree Gateway Settings
              </h2>
              <p className="font-mono text-xs text-[#5A7785] mt-1">
                Configure taxation, invoice numbering, and banking credentials.
              </p>
            </div>

            <form onSubmit={saveSettings} className="space-y-6 max-w-2xl font-mono text-xs">
              <div className="space-y-4">
                <h3 className="font-display text-sm font-medium text-[#0A2533] uppercase">
                  GST & Invoicing Configuration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#5A7785] uppercase">GSTIN Registration Number</label>
                    <input
                      type="text"
                      value={settings.gst_number || ''}
                      onChange={e => setSettings({ ...settings, gst_number: e.target.value })}
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#5A7785] uppercase">GST Tax Rate (Basis Points: 1800 = 18%)</label>
                    <input
                      type="text"
                      value={settings.gst_rate || '1800'}
                      onChange={e => setSettings({ ...settings, gst_rate: e.target.value })}
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#5A7785] uppercase">Invoice Series Prefix</label>
                    <input
                      type="text"
                      value={settings.invoice_prefix || 'CB '}
                      onChange={e => setSettings({ ...settings, invoice_prefix: e.target.value })}
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#5A7785] uppercase">Free Shipping Threshold (₹)</label>
                    <input
                      type="text"
                      value={settings.free_shipping_over || '5000'}
                      onChange={e => setSettings({ ...settings, free_shipping_over: e.target.value })}
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#0A2533]/10">
                <h3 className="font-display text-sm font-medium text-[#0A2533] uppercase">
                  Cashfree Payment Gateway Integration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#5A7785] uppercase">Gateway Active</label>
                    <select
                      value={settings.payment_enabled || 'false'}
                      onChange={e => setSettings({ ...settings, payment_enabled: e.target.value })}
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none bg-white"
                    >
                      <option value="false">Disabled (Fallback to COD / Offline)</option>
                      <option value="true">Enabled (Accept Online Payments)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#5A7785] uppercase">Gateway Environment</label>
                    <select
                      value={settings.payment_mode || 'sandbox'}
                      onChange={e => setSettings({ ...settings, payment_mode: e.target.value })}
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none bg-white"
                    >
                      <option value="sandbox">Sandbox (Testing)</option>
                      <option value="production">Production (Live)</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] text-[#5A7785] uppercase">Cashfree App ID</label>
                    <input
                      type="text"
                      value={settings.cashfree_test_app_id || ''}
                      onChange={e => setSettings({ ...settings, cashfree_test_app_id: e.target.value })}
                      placeholder="TEST1034..."
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] text-[#5A7785] uppercase">Cashfree Secret Key</label>
                    <input
                      type="password"
                      value={settings.cashfree_test_secret || ''}
                      onChange={e => setSettings({ ...settings, cashfree_test_secret: e.target.value })}
                      placeholder="cfsk_ma_test_..."
                      className="w-full px-3 py-2 border border-[#0A2533]/15 focus:border-[#087A91] outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                SAVE CONFIGURATION
              </button>
            </form>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* MODAL: CREATE / EDIT LABORATORY FORMULATION */}
        {/* ----------------------------------------------------------- */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-[#03151D]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0A2533] border border-white/15 text-white w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#087A91] text-white flex items-center justify-center font-mono text-xs font-bold">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg text-white">
                      {editingProduct ? `Edit Formulation ${editingProduct.name}` : 'New Laboratory Formulation'}
                    </h3>
                    <p className="font-mono text-[11px] text-[#9BB3C1]">
                      Configure olfactory notes, variant pricing, and lab specifications.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-1.5 text-[#9BB3C1] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6 font-mono text-xs">
                {/* Section 1: Basic Identity */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase text-[#48B8CE] tracking-wider font-semibold block">
                    1. Identity & Classification
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Formula Code</label>
                      <input
                        type="text"
                        required
                        value={productForm.formulaNo}
                        onChange={e => setProductForm({ ...productForm, formulaNo: e.target.value })}
                        placeholder="05"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Formula Name</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="MOLECULE Z"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Olfactory Family</label>
                      <input
                        type="text"
                        required
                        value={productForm.family}
                        onChange={e => setProductForm({ ...productForm, family: e.target.value })}
                        placeholder="Solar Woody Floral"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Subtitle / Epithet</label>
                      <input
                        type="text"
                        value={productForm.subtitle}
                        onChange={e => setProductForm({ ...productForm, subtitle: e.target.value })}
                        placeholder="The Mirage"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-3">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Description / Formulation Story</label>
                      <textarea
                        required
                        rows={2}
                        value={productForm.description}
                        onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="A luminous, nostalgic solar floral born from pure Madurai Sambac isolates..."
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Character / Sensation</label>
                      <input
                        type="text"
                        value={productForm.character}
                        onChange={e => setProductForm({ ...productForm, character: e.target.value })}
                        placeholder="Radiant, hypnotic, intimate skin warmth"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Liquid Amber Color (RGBA)</label>
                      <input
                        type="text"
                        value={productForm.liquidColor}
                        onChange={e => setProductForm({ ...productForm, liquidColor: e.target.value })}
                        placeholder="rgba(225, 185, 105, 0.45)"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Pricing & Vault Quantities */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <span className="text-[10px] uppercase text-[#48B8CE] tracking-wider font-semibold block">
                    2. Variant Pricing & Inventory
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">50ml Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={productForm.price50}
                        onChange={e => setProductForm({ ...productForm, price50: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">50ml Vault Stock</label>
                      <input
                        type="number"
                        required
                        value={productForm.stock50}
                        onChange={e => setProductForm({ ...productForm, stock50: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">100ml Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={productForm.price100}
                        onChange={e => setProductForm({ ...productForm, price100: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">100ml Vault Stock</label>
                      <input
                        type="number"
                        required
                        value={productForm.stock100}
                        onChange={e => setProductForm({ ...productForm, stock100: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Olfactory Pyramid */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <span className="text-[10px] uppercase text-[#48B8CE] tracking-wider font-semibold block">
                    3. Olfactory Architecture (Comma Separated)
                  </span>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Top Accord (High Volatility)</label>
                      <input
                        type="text"
                        value={productForm.topNotes}
                        onChange={e => setProductForm({ ...productForm, topNotes: e.target.value })}
                        placeholder="Green Tea, Cold-Pressed Bergamot, Pink Peppercorn"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Heart Accord (Core Bloom)</label>
                      <input
                        type="text"
                        value={productForm.heartNotes}
                        onChange={e => setProductForm({ ...productForm, heartNotes: e.target.value })}
                        placeholder="Madurai Jasmine Sambac Absolute, Water Honeysuckle"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Base Accord (Anchors & Woods)</label>
                      <input
                        type="text"
                        value={productForm.baseNotes}
                        onChange={e => setProductForm({ ...productForm, baseNotes: e.target.value })}
                        placeholder="Ambroxan Isolate, Sheer Skin Musk, Solar Woods"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Laboratory Specifications */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <span className="text-[10px] uppercase text-[#48B8CE] tracking-wider font-semibold block">
                    4. Laboratory Technical Data
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Concentration Ratio</label>
                      <input
                        type="text"
                        value={productForm.ratio}
                        onChange={e => setProductForm({ ...productForm, ratio: e.target.value })}
                        placeholder="28% Pure Extrait Concentration"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Maceration Vault Period</label>
                      <input
                        type="text"
                        value={productForm.maceration}
                        onChange={e => setProductForm({ ...productForm, maceration: e.target.value })}
                        placeholder="90 Days in Dark Nitrogen Vault"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-[#9BB3C1] uppercase">Key Molecular Isolate</label>
                      <input
                        type="text"
                        value={productForm.keyIsolate}
                        onChange={e => setProductForm({ ...productForm, keyIsolate: e.target.value })}
                        placeholder="Benzyl Acetate & Methyl Jasmonate (99.2% Pure Isolate)"
                        className="w-full px-3 py-2 bg-[#03151D] border border-white/15 text-white focus:border-[#48B8CE] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-5 py-2.5 border border-white/20 text-[#9BB3C1] hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#087A91] hover:bg-[#48B8CE] text-white hover:text-[#03151D] font-mono text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-md"
                  >
                    {editingProduct ? 'Update Formulation' : 'Create Formulation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

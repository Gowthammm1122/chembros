import { FRAGRANCES, Fragrance } from '../data/fragrances';

export interface CartCalculationItem {
  slug: string;
  qty: number;
  size?: number;
}

export interface CartSummaryResponse {
  lines: Array<{
    product_id: number | null;
    slug: string;
    name: string;
    accord: string | null;
    size: number;
    img: string | null;
    unit: number;
    qty: number;
    line_total: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  cgst: number;
  sgst: number;
  igst: number;
  rate: number;
  inclusive: boolean;
  interstate: boolean;
  total: number;
  items: number;
}

export interface PlaceOrderPayload {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
  items: Array<{
    slug: string;
    qty: number;
    size?: number;
  }>;
  return_url?: string;
}

export interface PlaceOrderResponse {
  success: boolean;
  order_ref: string;
  order_id: number;
  total: number;
  cashfree?: {
    enabled: boolean;
    payment_session_id?: string;
    mode?: string;
    sdk_url?: string;
  };
  cod?: boolean;
  message?: string;
  warning?: string;
  error?: string;
}

export interface OrderStatusResponse {
  success: boolean;
  order: {
    ref: string;
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    cgst: number;
    sgst: number;
    igst: number;
    invoice_no: string | null;
    payment_status: string;
    status: string;
    items_count: number;
    email: string;
    name: string;
    created_at: string;
  };
  lines?: Array<any>;
  error?: string;
}

declare global {
  interface Window {
    Cashfree?: any;
  }
}

/**
 * Robust API Client connecting the React Storefront to CodeIgniter 4 Backend
 */
class ApiService {
  private baseUrl = '';

  /**
   * Helper for robust fetch with JSON parsing and fallback error handling
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `HTTP error ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  /**
   * Fetch catalogue from backend or fallback to local curated specimens
   */
  async getProducts(): Promise<Fragrance[]> {
    try {
      const res = await this.request<{ success: boolean; data: any[] }>('/api/products');
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        // Map backend catalogue items to frontend Fragrance model
        return res.data.map((item, index) => {
          const fallback = FRAGRANCES.find(f => f.id === item.slug) || FRAGRANCES[index % FRAGRANCES.length];
          return {
            id: item.slug,
            formulaNo: item.badge || fallback.formulaNo,
            name: item.name,
            subtitle: item.epithet || fallback.subtitle,
            family: item.family || fallback.family,
            price: Number(item.price),
            currency: '₹',
            sizes: item.specs?.sizes || fallback.sizes,
            liquidColor: fallback.liquidColor,
            liquidGradient: fallback.liquidGradient,
            pedestalHeight: fallback.pedestalHeight,
            description: item.story || fallback.description,
            character: item.tagline || fallback.character,
            olfactoryPyramid: {
              top: item.pyramid?.Top ? item.pyramid.Top.split(',').map((s: string) => s.trim()) : fallback.olfactoryPyramid.top,
              heart: item.pyramid?.Heart ? item.pyramid.Heart.split(',').map((s: string) => s.trim()) : fallback.olfactoryPyramid.heart,
              base: item.pyramid?.Base ? item.pyramid.Base.split(',').map((s: string) => s.trim()) : fallback.olfactoryPyramid.base,
            },
            labSpec: item.specs?.labSpec || fallback.labSpec,
          };
        });
      }
    } catch {
      // Backend not running or offline - fallback gracefully to curated specimens
    }
    return FRAGRANCES;
  }

  /**
   * Secure cart calculation with server-side pricing, GST, and shipping rules
   */
  async calculateCart(items: CartCalculationItem[], state?: string): Promise<CartSummaryResponse> {
    try {
      const res = await this.request<{ success: boolean; summary: CartSummaryResponse }>('/api/cart/calculate', {
        method: 'POST',
        body: JSON.stringify({ items, state }),
      });
      if (res.success && res.summary) {
        return res.summary;
      }
    } catch {
      // Fallback calculation in case backend is offline during frontend design preview
    }

    // Local estimation fallback
    const subtotal = items.reduce((sum, item) => {
      const matched = FRAGRANCES.find(f => f.id === item.slug);
      const unit = matched ? (matched.sizes.find(s => s.ml === item.size)?.price || matched.price) : 4500;
      return sum + unit * item.qty;
    }, 0);

    const shipping = subtotal > 0 && subtotal < 5000 ? 250 : 0;
    const gstRate = 1800; // 18% inclusive
    const tax = Math.round((subtotal * gstRate) / (10000 + gstRate));

    return {
      lines: items.map(item => {
        const matched = FRAGRANCES.find(f => f.id === item.slug);
        const unit = matched ? (matched.sizes.find(s => s.ml === item.size)?.price || matched.price) : 4500;
        return {
          product_id: null,
          slug: item.slug,
          name: matched?.name || item.slug,
          accord: matched?.family || null,
          size: item.size || 50,
          img: null,
          unit,
          qty: item.qty,
          line_total: unit * item.qty,
        };
      }),
      subtotal,
      shipping,
      tax,
      cgst: Math.ceil(tax / 2),
      sgst: Math.floor(tax / 2),
      igst: 0,
      rate: gstRate,
      inclusive: true,
      interstate: false,
      total: subtotal + shipping,
      items: items.reduce((acc, i) => acc + i.qty, 0),
    };
  }

  /**
   * Save order on backend & generate Cashfree payment session
   */
  async placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResponse> {
    return this.request<PlaceOrderResponse>('/api/checkout/place', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Confirm Cashfree payment with backend API
   */
  async verifyPayment(orderRef: string): Promise<{ success: boolean; status: string; order?: any; error?: string }> {
    return this.request('/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ order_ref: orderRef }),
    });
  }

  /**
   * Query order status for display on receipt / confirmation page
   */
  async getOrderStatus(orderRef: string): Promise<OrderStatusResponse> {
    return this.request<OrderStatusResponse>(`/api/payment/status/${encodeURIComponent(orderRef)}`);
  }

  /**
   * Submit concierge message
   */
  async submitContact(data: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Dynamically loads the official Cashfree JS checkout SDK
   */
  async loadCashfreeSDK(sdkUrl = 'https://sdk.cashfree.com/js/v3/cashfree.js'): Promise<any> {
    if (window.Cashfree) {
      return window.Cashfree;
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${sdkUrl}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.Cashfree));
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')));
        return;
      }

      const script = document.createElement('script');
      script.src = sdkUrl;
      script.async = true;
      script.onload = () => resolve(window.Cashfree);
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.body.appendChild(script);
    });
  }
}

export const api = new ApiService();

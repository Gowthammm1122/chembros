import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/fragrances';
import { api, CartSummaryResponse } from '../services/api';

const INDIAN_STATES = [
  'Tamil Nadu',
  'Maharashtra',
  'Karnataka',
  'Delhi',
  'Uttar Pradesh',
  'Telangana',
  'Gujarat',
  'Kerala',
  'West Bengal',
  'Rajasthan',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Haryana',
  'Bihar',
  'Punjab',
  'Goa',
  'Odisha',
  'Assam',
  'Uttarakhand',
  'Jharkhand',
  'Himachal Pradesh',
  'Chandigarh',
  'Puducherry',
];

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    line1: '',
    city: '',
    state: 'Tamil Nadu',
    postcode: '',
    country: 'India',
  });

  const [summary, setSummary] = useState<CartSummaryResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Recalculate summary with state selected
  useEffect(() => {
    if (cart.length === 0) return;

    const items = cart.map(i => ({
      slug: i.fragranceId,
      qty: i.quantity,
      size: i.size,
    }));

    api.calculateCart(items, formData.state)
      .then(res => setSummary(res))
      .catch(() => {});
  }, [cart, formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.line1.trim() || !formData.city.trim() || !formData.postcode.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    // Phone validation for Indian mobile
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const mobile10 = cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone;
    if (!/^[6-9]\d{9}$/.test(mobile10)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your allocation bag is empty.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        phone: mobile10,
        line1: formData.line1.trim(),
        city: formData.city.trim(),
        state: formData.state,
        postcode: formData.postcode.trim(),
        country: formData.country,
        items: cart.map(i => ({
          slug: i.fragranceId,
          qty: i.quantity,
          size: i.size,
        })),
        return_url: `${window.location.origin}/payment/verify?order_ref={order_id}`,
      };

      const res = await api.placeOrder(payload);

      if (!res.success) {
        throw new Error(res.error || 'Failed to initialize order.');
      }

      // Handle Cashfree Online Checkout
      if (res.cashfree?.enabled && res.cashfree.payment_session_id) {
        const CashfreeSDK = await api.loadCashfreeSDK(res.cashfree.sdk_url);
        const cashfreeInstance = CashfreeSDK({
          mode: res.cashfree.mode === 'production' ? 'production' : 'sandbox',
        });

        // Open Cashfree checkout popup / redirect
        cashfreeInstance.checkout({
          paymentSessionId: res.cashfree.payment_session_id,
          redirectTarget: '_self',
        });
      } else {
        // Cashfree disabled or COD order placed
        navigate(`/payment/verify?order_ref=${encodeURIComponent(res.order_ref)}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = summary ? summary.total : rawSubtotal;
  const shippingFee = summary ? summary.shipping : 0;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] pt-32 pb-20 text-center">
        <h2 className="font-display text-2xl text-[#0A2533]">Your bag is empty</h2>
        <p className="text-xs font-mono text-[#5A7785] mt-2 mb-6">Please add items to proceed with checkout.</p>
        <Link to="/product/molecule-j" className="px-6 py-3 bg-[#0A2533] text-white font-mono text-xs uppercase tracking-wider">
          Return to Fragrances
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0A2533] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-[#0A2533]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#5A7785] mb-2">
              <Lock className="w-3.5 h-3.5 text-[#087A91]" />
              <span>Encrypted Checkout Protocol</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-[#0A2533] font-medium tracking-tight">
              Dispatch & Allocation
            </h1>
          </div>
          <Link
            to="/cart"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5A7785] hover:text-[#087A91] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </Link>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Customer & Delivery Details Form */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
            
            {/* Section 1: Customer Contact */}
            <div className="bg-white border border-[#0A2533]/10 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#0A2533]/10">
                <span className="font-display text-base font-medium text-[#0A2533]">
                  1. Contact Information
                </span>
                <span className="font-mono text-[11px] text-[#5A7785]">For dispatch tracking & receipt</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Siddharth"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Ramanathan"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@chembros.in"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                    Mobile Number (+91) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="bg-white border border-[#0A2533]/10 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#0A2533]/10">
                <span className="font-display text-base font-medium text-[#0A2533]">
                  2. Delivery Address
                </span>
                <span className="font-mono text-[11px] text-[#087A91]">Insured Cold-Chain Dispatch</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                    Street Address & Apartment / Suite *
                  </label>
                  <input
                    type="text"
                    name="line1"
                    required
                    value={formData.line1}
                    onChange={handleChange}
                    placeholder="Flat 12B, Luxury Residence, Anna Nagar"
                    className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Chennai"
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                    >
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-[#5A7785] tracking-wider block">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      required
                      maxLength={6}
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="600028"
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#F8FAFC] border border-[#0A2533]/15 focus:border-[#087A91] focus:bg-white outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Gateway Notice */}
            <div className="bg-white border border-[#0A2533]/10 p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#0A2533]/10">
                <span className="font-display text-base font-medium text-[#0A2533]">
                  3. Payment Protocol
                </span>
                <span className="font-mono text-[11px] text-[#087A91]">Cashfree Banking Gateway</span>
              </div>
              <p className="text-xs font-mono text-[#5A7785] leading-relaxed">
                Upon confirming your allocation, you will be securely redirected to the verified 
                <strong> Cashfree Payment Gateway</strong> supporting UPI (Google Pay, PhonePe, Paytm), 
                Credit & Debit Cards (Visa, Mastercard, RuPay), and NetBanking.
              </p>
              <div className="p-3 bg-[#F8FAFC] border border-[#0A2533]/10 flex items-center gap-3 text-xs font-mono text-[#0A2533]">
                <ShieldCheck className="w-4 h-4 text-[#087A91] shrink-0" />
                <span>256-Bit SSL Encryption • PCI-DSS Level 1 Certified Infrastructure</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>CONTACTING PAYMENT GATEWAY...</span>
              ) : (
                <>
                  <span>AUTHORIZE ALLOCATION & PROCEED TO PAY</span>
                  <ArrowRight className="w-4 h-4 text-[#48B8CE]" />
                </>
              )}
            </button>
          </form>

          {/* Right: Order Details Column */}
          <div className="lg:col-span-5 bg-white border border-[#0A2533]/10 p-6 sm:p-8 space-y-6 shadow-xs sticky top-32">
            <div className="pb-4 border-b border-[#0A2533]/10 flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-[#0A2533]">
                Allocation Summary
              </h2>
              <span className="font-mono text-xs text-[#087A91] font-semibold">
                [{cart.reduce((sum, item) => sum + item.quantity, 0)} Items]
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-xs shrink-0 flex items-center justify-center text-[9px] font-bold" style={{ background: item.liquidColor }}>
                      {item.formulaNo}
                    </span>
                    <span className="text-[#0A2533] font-medium truncate">{item.name} ({item.size}ml)</span>
                    <span className="text-[#5A7785]">× {item.quantity}</span>
                  </div>
                  <span className="text-[#0A2533] font-semibold tabular-nums shrink-0 ml-2">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#0A2533]/10 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-[#5A7785]">
                <span>Subtotal</span>
                <span className="text-[#0A2533] font-semibold tabular-nums">
                  {formatPrice(rawSubtotal)}
                </span>
              </div>

              <div className="flex justify-between text-[#5A7785]">
                <span>Shipping & Cold-Chain</span>
                <span className="text-[#087A91] font-medium">
                  {shippingFee === 0 ? 'COMPLIMENTARY' : formatPrice(shippingFee)}
                </span>
              </div>

              {summary && summary.tax > 0 && (
                <div className="flex justify-between text-[#5A7785]">
                  <span>
                    GST ({summary.interstate ? 'IGST 18%' : 'CGST 9% + SGST 9%'})
                  </span>
                  <span className="text-[#0A2533] font-mono">
                    {formatPrice(summary.tax)}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-[#0A2533]/10 flex justify-between items-baseline text-[#0A2533]">
                <span className="font-display font-medium text-base">Grand Total</span>
                <span className="font-mono text-xl font-bold text-[#0A2533] tabular-nums">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0A2533]/10 space-y-2 text-[11px] font-mono text-[#5A7785]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087A91]" />
                <span>GST Tax Invoice with continuous sequence generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087A91]" />
                <span>Direct dispatch from Chennai Laboratory</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

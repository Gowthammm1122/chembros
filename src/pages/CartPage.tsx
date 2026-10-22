import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, ArrowLeft, FlaskConical } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/fragrances';
import { api, CartSummaryResponse } from '../services/api';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<CartSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync with backend calculation whenever cart changes
  useEffect(() => {
    if (cart.length === 0) {
      setSummary(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const items = cart.map(i => ({
      slug: i.fragranceId,
      qty: i.quantity,
      size: i.size,
    }));

    api.calculateCart(items)
      .then(res => {
        if (isMounted) setSummary(res);
      })
      .catch(() => {
        // Fallback local calculation is already handled inside api service
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cart]);

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = summary ? summary.total : rawSubtotal;
  const shippingFee = summary ? summary.shipping : 0;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0A2533] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between pb-8 border-b border-[#0A2533]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#5A7785] mb-2">
              <FlaskConical className="w-3.5 h-3.5 text-[#087A91]" />
              <span>Laboratory Allocation / Cart</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-[#0A2533] font-medium tracking-tight">
              Your Allocation Bag
            </h1>
          </div>
          <Link
            to="/product/molecule-j"
            className="hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5A7785] hover:text-[#087A91] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Exploring</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full border border-[#0A2533]/15 flex items-center justify-center mx-auto text-[#5A7785] font-mono text-lg">
              00
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-medium text-[#0A2533]">
                Your laboratory bag is empty.
              </h2>
              <p className="text-xs font-mono text-[#5A7785] leading-relaxed">
                No molecular specimens have been allocated. Explore the signature fragrance collection to begin your formulation journey.
              </p>
            </div>
            <Link
              to="/product/molecule-j"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-widest transition-all duration-200 shadow-sm"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Cart Table & Checkout Summary */
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#0A2533]/10 text-xs font-mono uppercase tracking-wider text-[#5A7785]">
                <span>Allocated Specimen</span>
                <span>Quantity & Subtotal</span>
              </div>

              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="p-5 bg-white border border-[#0A2533]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 hover:border-[#0A2533]/25"
                  >
                    {/* Badge & Details */}
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-sm border border-[#0A2533]/15 shrink-0 flex items-center justify-center font-mono text-xs text-[#0A2533] font-bold shadow-xs"
                        style={{ background: item.liquidColor }}
                      >
                        {item.formulaNo}
                      </div>

                      <div>
                        <h3 className="font-display font-medium text-base text-[#0A2533]">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#5A7785] mt-0.5">
                          <span>FORMULA {item.formulaNo}</span>
                          <span>·</span>
                          <span>{item.size}ML EXTRAIT</span>
                        </div>
                        <div className="font-mono text-xs text-[#087A91] font-semibold mt-1">
                          {formatPrice(item.price)} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#0A2533]/5">
                      <div className="flex items-center border border-[#0A2533]/15 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 text-[#5A7785] hover:text-[#0A2533] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-medium text-[#0A2533] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 text-[#5A7785] hover:text-[#0A2533] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold text-[#0A2533] tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[#A9C2CE] hover:text-red-500 text-[11px] font-mono inline-flex items-center gap-1 mt-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-mono text-[#5A7785] hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  Clear Bag
                </button>
                <Link
                  to="/product/molecule-j"
                  className="text-xs font-mono text-[#087A91] hover:underline uppercase tracking-wider"
                >
                  + Add Another Specimen
                </Link>
              </div>
            </div>

            {/* Right: Authoritative Order Summary Panel */}
            <div className="lg:col-span-5 bg-white border border-[#0A2533]/10 p-6 sm:p-8 space-y-6 shadow-xs sticky top-32">
              <div className="pb-4 border-b border-[#0A2533]/10 flex items-center justify-between">
                <h2 className="font-display text-lg font-medium text-[#0A2533]">
                  Order Summary
                </h2>
                <span className="font-mono text-xs text-[#087A91] tracking-wider uppercase font-semibold">
                  [{cart.reduce((sum, item) => sum + item.quantity, 0)} Items]
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[#5A7785]">
                  <span>Subtotal</span>
                  <span className="text-[#0A2533] font-semibold tabular-nums">
                    {formatPrice(rawSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[#5A7785]">
                  <span>Courier & Handling</span>
                  <span className="text-[#087A91] font-medium">
                    {shippingFee === 0 ? 'COMPLIMENTARY' : formatPrice(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-[#5A7785]">
                  <span>Nitrogen Cushion Vault</span>
                  <span className="text-[#087A91] font-medium">INCLUDED</span>
                </div>

                {summary && summary.tax > 0 && (
                  <div className="flex justify-between text-[#5A7785] pt-1">
                    <span>GST (18% {summary.inclusive ? 'Included' : 'Extra'})</span>
                    <span className="text-[#0A2533] font-mono">
                      {formatPrice(summary.tax)}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#0A2533]/10 flex justify-between items-baseline text-[#0A2533]">
                  <span className="font-display font-medium text-base">Estimated Total</span>
                  <span className="font-mono text-xl font-bold text-[#0A2533] tabular-nums">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                disabled={loading || cart.length === 0}
                className="w-full py-4 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4 text-[#48B8CE]" />
              </button>

              <div className="pt-2 border-t border-[#0A2533]/10 space-y-2 text-[11px] font-mono text-[#5A7785]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#087A91] shrink-0" />
                  <span>Encrypted Cashfree Payment Gateway (UPI, Cards, NetBanking)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#087A91] shrink-0" />
                  <span>GST Compliance Invoicing with HSN 33030050 verification</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

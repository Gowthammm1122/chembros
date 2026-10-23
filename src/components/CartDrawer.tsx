import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../data/fragrances';
import { useCart, CartItem } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChemButton } from './ChemButton';

export type { CartItem };

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
  onClearCart?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  items: propItems,
  onUpdateQuantity: propUpdateQuantity,
  onRemoveItem: propRemoveItem,
  onClearCart: propClearCart,
}) => {
  const cartContext = useCart();

  const effectiveIsOpen = propIsOpen ?? cartContext.isCartOpen;
  const effectiveClose = propOnClose ?? cartContext.closeCart;
  const effectiveItems = propItems ?? cartContext.cart;
  const effectiveUpdateQuantity = propUpdateQuantity ?? cartContext.updateQuantity;
  const effectiveRemoveItem = propRemoveItem ?? cartContext.removeItem;
  const effectiveClearCart = propClearCart ?? cartContext.clearCart;

  const navigate = useNavigate();
  const subtotal = effectiveItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    effectiveClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    effectiveClose();
    navigate('/cart');
  };

  if (!effectiveIsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={effectiveClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#0A2533]/15 flex flex-col justify-between shadow-2xl text-[#0A2533]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#0A2533]/10 flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <span className="font-display font-semibold text-lg text-[#0A2533]">
                Laboratory Bag
              </span>
              <span className="font-mono text-xs text-[#087A91] tracking-wider uppercase font-semibold">
                [{effectiveItems.reduce((sum, item) => sum + item.quantity, 0)} Items]
              </span>
            </div>
            <button
              onClick={effectiveClose}
              className="text-[#5A7785] hover:text-[#0A2533] p-1 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {effectiveItems.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#0A2533]/15 flex items-center justify-center mx-auto text-[#5A7785] font-mono">
                  00
                </div>
                <h4 className="font-display text-lg text-[#0A2533] font-medium">
                  Your bag is currently empty.
                </h4>
                <p className="text-xs font-mono text-[#5A7785] max-w-xs mx-auto">
                  Select a signature formula from the four laboratory specimens to begin.
                </p>
                <Link
                  to="/product/molecule-j"
                  onClick={effectiveClose}
                  className="inline-block mt-4 px-6 py-2.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  EXPLORE THE 4 FORMULAS
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {effectiveItems.map(item => (
                  <div
                    key={item.id}
                    className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC] flex items-center justify-between gap-4"
                  >
                    {/* Liquid swatch badge */}
                    <div 
                      className="w-10 h-10 rounded-sm border border-[#0A2533]/10 shrink-0 flex items-center justify-center font-mono text-[9px] text-[#0A2533] font-bold shadow-xs"
                      style={{ background: item.liquidColor }}
                    >
                      {item.formulaNo}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-sm text-[#0A2533] truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#5A7785]">
                        <span>FORMULA {item.formulaNo}</span>
                        <span>·</span>
                        <span>{item.size}ML EXTRAIT</span>
                      </div>
                      <div className="font-mono text-xs text-[#087A91] font-semibold mt-1 tabular-nums">
                        {formatPrice(item.price)} each
                      </div>
                    </div>

                    {/* Quantity Adjustment Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-[#0A2533]/15 bg-white">
                        <button
                          onClick={() => effectiveUpdateQuantity(item.id, -1)}
                          className="p-1.5 text-[#5A7785] hover:text-[#0A2533] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-medium text-[#0A2533] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => effectiveUpdateQuantity(item.id, 1)}
                          className="p-1.5 text-[#5A7785] hover:text-[#0A2533] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => effectiveRemoveItem(item.id)}
                        className="text-[#A9C2CE] hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                        title="Remove specimen"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {effectiveItems.length > 0 && (
            <div className="p-6 border-t border-[#0A2533]/10 bg-[#F8FAFC] space-y-4">
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#5A7785]">
                  <span>SUBTOTAL</span>
                  <span className="text-[#0A2533] font-semibold tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#5A7785]">
                  <span>DISPATCH & HANDLING</span>
                  <span className="text-[#087A91] font-medium">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between text-[#5A7785]">
                  <span>PACKAGING</span>
                  <span className="text-[#087A91] font-medium">NITROGEN VAULT BOX</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#0A2533] pt-2 border-t border-[#0A2533]/10">
                  <span>ESTIMATED TOTAL</span>
                  <span className="tabular-nums text-base">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <ChemButton
                  label="PROCEED TO CHECKOUT"
                  variant="primary"
                  fullWidth
                  onClick={handleCheckout}
                  aria-label="Proceed to checkout"
                />

                <button
                  type="button"
                  onClick={handleViewCart}
                  className="w-full py-2.5 bg-white border border-[#0A2533]/20 hover:border-[#0A2533] text-[#0A2533] font-mono text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                >
                  <span>VIEW DETAILED BAG</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#5A7785]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#087A91]" />
                <span>Cold-chain guaranteed delivery • Pure molecular extrait</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

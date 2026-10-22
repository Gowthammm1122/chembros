import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ShieldCheck, FileText, ArrowRight, Loader2, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/fragrances';
import { api, OrderStatusResponse } from '../services/api';

export const PaymentVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get('order_ref') || searchParams.get('order_id') || '';
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderStatusResponse['order'] | null>(null);
  const [orderLines, setOrderLines] = useState<any[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Verifying payment signature with banking gateway...');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!orderRef) {
      setLoading(false);
      setErrorDetails('No order reference provided.');
      return;
    }

    let isMounted = true;

    // 1. Ask backend to verify with Cashfree and settle order
    api.verifyPayment(orderRef)
      .then(res => {
        if (!isMounted) return;

        if (res.success && (res.status === 'PAID' || res.status === 'COD')) {
          setPaymentSuccess(true);
          setStatusMessage(res.status === 'PAID' ? 'Payment Verified & Confirmed' : 'Order Recorded (Pending Fulfillment)');
          clearCart(); // Safely clear bag now that order is sealed
        } else {
          setPaymentSuccess(false);
          setErrorDetails(res.error || 'Payment was not completed by the gateway.');
        }

        // 2. Fetch full order details
        return api.getOrderStatus(orderRef);
      })
      .then(statusRes => {
        if (!isMounted || !statusRes?.success) return;
        setOrderData(statusRes.order);
        setOrderLines(statusRes.lines || []);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        // Even if verify API threw an error, check if order exists in DB
        api.getOrderStatus(orderRef)
          .then(fallbackRes => {
            if (fallbackRes?.success) {
              setOrderData(fallbackRes.order);
              setOrderLines(fallbackRes.lines || []);
              if (fallbackRes.order.payment_status === 'paid' || fallbackRes.order.payment_status === 'cod') {
                setPaymentSuccess(true);
                clearCart();
                return;
              }
            }
            setErrorDetails(err.message || 'Unable to confirm payment status.');
          })
          .catch(() => {
            setErrorDetails(err.message || 'Unable to confirm payment status.');
          });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
        <Loader2 className="w-10 h-10 text-[#087A91] animate-spin mb-4" />
        <h2 className="font-display text-xl text-[#0A2533] font-medium">
          Verifying Allocation with Gateway
        </h2>
        <p className="text-xs font-mono text-[#5A7785] mt-2">
          {statusMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0A2533] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        
        {paymentSuccess ? (
          /* Success Screen */
          <div className="bg-white border border-[#0A2533]/10 p-8 sm:p-12 shadow-sm space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-3 pb-6 border-b border-[#0A2533]/10">
              <div className="w-16 h-16 rounded-full bg-[#087A91]/10 text-[#087A91] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#087A91] font-semibold">
                Allocation Confirmed // ISO-9001
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-medium text-[#0A2533] tracking-tight">
                Specimen Sealed & In Queue
              </h1>
              <p className="text-xs font-mono text-[#5A7785] max-w-md mx-auto leading-relaxed">
                Thank you. Your signature fragrance order has been committed to our nitrogen vault queue for cold stabilization and dispatch.
              </p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="p-6 bg-[#F8FAFC] border border-[#0A2533]/10 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#0A2533]/10">
                <span className="text-[#5A7785]">Batch Reference:</span>
                <span className="font-bold text-sm text-[#0A2533]">
                  {orderData?.ref || orderRef}
                </span>
              </div>

              {orderData?.invoice_no && (
                <div className="flex justify-between items-center">
                  <span className="text-[#5A7785]">GST Tax Invoice No:</span>
                  <span className="font-semibold text-[#087A91]">
                    {orderData.invoice_no}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-[#5A7785]">Recipient:</span>
                <span className="text-[#0A2533] font-medium">
                  {orderData?.name || 'Valued Client'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#5A7785]">Notification Email:</span>
                <span className="text-[#0A2533] font-medium">
                  {orderData?.email}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#5A7785]">Settlement Status:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold tracking-wider rounded-xs">
                  {orderData?.payment_status === 'paid' ? 'PAID IN FULL' : 'COD / PENDING'}
                </span>
              </div>

              <div className="pt-3 border-t border-[#0A2533]/10 flex justify-between items-baseline text-sm">
                <span className="text-[#5A7785]">Amount Settled:</span>
                <span className="text-[#0A2533] font-bold text-base tabular-nums">
                  {formatPrice(orderData?.total || 0)}
                </span>
              </div>
            </div>

            {/* Allocated Items List */}
            {orderLines.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-sm font-medium text-[#0A2533] uppercase tracking-wider">
                  Allocated Formulations
                </h3>
                <div className="divide-y divide-[#0A2533]/10 border-t border-b border-[#0A2533]/10">
                  {orderLines.map((line, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="font-semibold text-[#0A2533]">{line.name}</span>
                        <span className="text-[#5A7785] ml-2">({line.size}ml) × {line.qty}</span>
                      </div>
                      <span className="font-medium text-[#0A2533] tabular-nums">
                        {formatPrice(line.line_total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/product/molecule-j"
                className="flex-1 py-3.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>EXPLORE CATALOGUE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="px-6 py-3.5 border border-[#0A2533]/20 hover:border-[#0A2533] text-[#0A2533] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4 text-[#5A7785]" />
                <span>Return Home</span>
              </Link>
            </div>

            {/* Invoicing compliance note */}
            <div className="pt-6 border-t border-[#0A2533]/10 flex items-center justify-center gap-2 text-[11px] font-mono text-[#5A7785]">
              <FileText className="w-3.5 h-3.5 text-[#087A91]" />
              <span>A GST compliant tax invoice and dispatch tracking link have been dispatched to your email.</span>
            </div>

          </div>
        ) : (
          /* Error / Incomplete State */
          <div className="bg-white border border-[#0A2533]/10 p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-medium text-[#0A2533]">
              Payment Verification Incomplete
            </h1>

            <p className="text-xs font-mono text-[#5A7785] max-w-md mx-auto leading-relaxed">
              {errorDetails || 'The banking gateway did not return a successful authorization for this transaction. If amount was debited from your account, it will automatically reconcile or be refunded within 24-48 hours.'}
            </p>

            {orderRef && (
              <div className="p-3 bg-[#F8FAFC] border border-[#0A2533]/10 max-w-xs mx-auto text-xs font-mono">
                <span className="text-[#5A7785]">Reference: </span>
                <span className="font-bold text-[#0A2533]">{orderRef}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/checkout"
                className="px-8 py-3.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-widest transition-all"
              >
                Retry Checkout
              </Link>
              <Link
                to="/concierge"
                className="px-8 py-3.5 border border-[#0A2533]/20 hover:border-[#0A2533] text-[#0A2533] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

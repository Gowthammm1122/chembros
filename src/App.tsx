import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PhilosophyPage } from './pages/PhilosophyPage';
import { ConciergePage } from './pages/ConciergePage';
import { PoliciesPage } from './pages/PoliciesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentVerifyPage } from './pages/PaymentVerifyPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="shop" element={<CollectionPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment/verify" element={<PaymentVerifyPage />} />
            <Route path="order/success" element={<PaymentVerifyPage />} />
            <Route path="order/:ref" element={<PaymentVerifyPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="philosophy" element={<PhilosophyPage />} />
            <Route path="story" element={<PhilosophyPage />} />
            <Route path="concierge" element={<ConciergePage />} />
            <Route path="contact" element={<ConciergePage />} />
            <Route path="policies" element={<PoliciesPage />} />
            <Route path="policies/:type" element={<PoliciesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

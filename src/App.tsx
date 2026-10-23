import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OurStoryPage } from './pages/OurStoryPage';
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
            {/* Products catalog listing routes */}
            <Route path="products" element={<ProductsPage />} />
            <Route path="fragrances" element={<ProductsPage />} />
            <Route path="collection" element={<ProductsPage />} />
            <Route path="shop" element={<ProductsPage />} />
            <Route path="product" element={<Navigate to="/products" replace />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment/verify" element={<PaymentVerifyPage />} />
            <Route path="order/success" element={<PaymentVerifyPage />} />
            <Route path="order/:ref" element={<PaymentVerifyPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="story" element={<OurStoryPage />} />
            <Route path="our-story" element={<OurStoryPage />} />
            <Route path="philosophy" element={<OurStoryPage />} />
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

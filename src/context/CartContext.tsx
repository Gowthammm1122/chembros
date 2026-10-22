import React, { createContext, useContext, useState, useEffect } from 'react';
import { Fragrance } from '../data/fragrances';

export interface CartItem {
  id: string; // unique per item + size combo
  fragranceId: string;
  name: string;
  formulaNo: string;
  size: number;
  price: number;
  quantity: number;
  liquidColor: string;
}

interface CartContextType {
  cart: CartItem[];
  totalCartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (fragrance: Fragrance, size: number, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  // Global Modals State
  selectedFragranceForModal: Fragrance | null;
  openSpecimenModal: (fragrance: Fragrance) => void;
  closeSpecimenModal: () => void;

  isStoryOpen: boolean;
  openStory: () => void;
  closeStory: () => void;

  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;

  activePolicy: 'shipping' | 'privacy' | 'terms' | null;
  openPolicy: (policy: 'shipping' | 'privacy' | 'terms') => void;
  closePolicy: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'chembros_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage if available, otherwise default to a single specimen
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'molecule-j-50',
        fragranceId: 'molecule-j',
        name: 'MOLECULE J',
        formulaNo: '01',
        size: 50,
        price: 4500,
        quantity: 1,
        liquidColor: 'rgba(225, 185, 105, 0.45)',
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFragranceForModal, setSelectedFragranceForModal] = useState<Fragrance | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<'shipping' | 'privacy' | 'terms' | null>(null);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage unavailable
    }
  }, [cart]);

  const addToCart = (fragrance: Fragrance, size: number, quantity = 1) => {
    const itemPrice = fragrance.sizes.find(s => s.ml === size)?.price || fragrance.price;
    const itemId = `${fragrance.id}-${size}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            fragranceId: fragrance.id,
            name: fragrance.name,
            formulaNo: fragrance.formulaNo,
            size,
            price: itemPrice,
            quantity,
            liquidColor: fragrance.liquidColor,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prevCart =>
      prevCart
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalCartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        selectedFragranceForModal,
        openSpecimenModal: (f: Fragrance) => setSelectedFragranceForModal(f),
        closeSpecimenModal: () => setSelectedFragranceForModal(null),
        isStoryOpen,
        openStory: () => setIsStoryOpen(true),
        closeStory: () => setIsStoryOpen(false),
        isContactOpen,
        openContact: () => setIsContactOpen(true),
        closeContact: () => setIsContactOpen(false),
        activePolicy,
        openPolicy: (p: 'shipping' | 'privacy' | 'terms') => setActivePolicy(p),
        closePolicy: () => setActivePolicy(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

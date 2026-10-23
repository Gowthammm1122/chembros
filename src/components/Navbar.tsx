
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChemBrosLogo } from './ChemBrosLogo';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenStory?: () => void;
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount: propCartCount,
  onOpenCart: propOpenCart,
}) => {
  const { totalCartCount, openCart } = useCart();

  const cartCount = propCartCount ?? totalCartCount;
  const handleOpenCart = propOpenCart ?? openCart;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const light = isHome && scrolled;

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 32);

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { label: 'Fragrances', to: '/products' },
    { label: 'Our Story', to: '/story' },
  ];

  const surface = light
    ? 'border-[#0A2533]/10 bg-white/85 text-[#0A2533] shadow-[0_6px_28px_rgba(10,37,51,0.06)]'
    : 'border-white/[0.12] bg-[#061A22]/80 text-[#E8EEF0] shadow-[0_6px_28px_rgba(0,0,0,0.12)]';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="relative mx-auto max-w-[960px]">

        {/* Floating navigation */}
        <div
          className={`relative flex h-[48px] items-center justify-between rounded-full border px-2.5 pl-4 backdrop-blur-2xl transition-all duration-500 sm:h-[54px] sm:px-3.5 sm:pl-5 ${surface}`}
        >
          {/* Brand */}
          <Link
            to="/"
            aria-label="Chem Bros homepage"
            className="flex min-w-0 flex-1 items-center transition-opacity duration-200 hover:opacity-70"
          >
            <ChemBrosLogo
              variant={light ? 'black' : 'white'}
              size="sm"
              showTagline={false}
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-current/[0.06] bg-current/[0.035] p-0.5 md:flex"
          >
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-[10px] font-medium tracking-wide transition-all duration-300 lg:px-4 ${
                    isActive
                      ? light
                        ? 'bg-[#0A2533] text-white shadow-sm'
                        : 'bg-white text-[#071B23] shadow-sm'
                      : 'opacity-65 hover:bg-current/[0.07] hover:opacity-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Cart and mobile menu */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleOpenCart}
              aria-label={`Open shopping bag, ${cartCount} items`}
              className={`group relative flex h-8 items-center gap-2 rounded-full border border-current/10 px-2.5 transition-all duration-300 hover:border-current/25 hover:bg-current/[0.06] sm:h-9 sm:px-3 ${
                light ? 'text-[#0A2533]' : 'text-white'
              }`}
            >
              <ShoppingBag
                size={15}
                strokeWidth={1.6}
                className="transition-transform duration-300 group-hover:-rotate-6"
              />

              <span className="text-[10px] font-medium tabular-nums">
                {cartCount}
              </span>

              {cartCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#A8C9A5]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-current/10 transition-colors hover:bg-current/[0.06] md:hidden"
            >
              {menuOpen ? (
                <X size={16} strokeWidth={1.6} />
              ) : (
                <Menu size={16} strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-[20px] border backdrop-blur-2xl transition-all duration-300 md:hidden ${surface} ${
            menuOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0'
          }`}
          aria-hidden={!menuOpen}
        >
          <div className="p-2.5">
            <p className="px-3 pb-2 pt-2 text-[9px] uppercase tracking-[0.2em] opacity-45">
              Discover
            </p>

            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3.5 py-3 text-[13px] transition-colors ${
                    isActive
                      ? 'bg-current/[0.07]'
                      : 'hover:bg-current/[0.04]'
                  }`
                }
              >
                <span>{item.label}</span>
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="opacity-50"
                />
              </NavLink>
            ))}

            <div className="mx-3 my-2 border-t border-current/10" />

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleOpenCart();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[13px] transition-colors hover:bg-current/[0.05]"
            >
              <span>Shopping bag</span>
              <span className="text-xs opacity-60">({cartCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

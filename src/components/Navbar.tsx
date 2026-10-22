import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
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
  onOpenStory: propOpenStory,
}) => {
  const { totalCartCount, openCart, openStory } = useCart();
  const effectiveCartCount = propCartCount ?? totalCartCount;
  const effectiveOpenCart = propOpenCart ?? openCart;
  const effectiveOpenStory = propOpenStory ?? openStory;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When not on home page, keep a sleek dark luxury backdrop
  const showDarkNavbar = !isHomePage || !scrolled;
  const isLightMode = isHomePage && scrolled;

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLightMode
          ? 'bg-white/90 backdrop-blur-md border-b border-[#0A2533]/[0.08] shadow-[0_2px_16px_rgba(10,37,51,0.04)] text-[#0A2533]'
          : 'bg-[#03151D]/80 backdrop-blur-md border-b border-white/[0.08] text-[#DCE3E8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="shrink-0 transition-opacity duration-300 hover:opacity-85 select-none"
          aria-label="CHEM BROS Homepage"
        >
          <ChemBrosLogo
            variant={isLightMode ? 'black' : 'white'}
            size="sm"
            showTagline={false}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-7 lg:gap-10 text-[11px] lg:text-[12px] font-sans font-medium tracking-[0.16em] uppercase transition-colors duration-300 ${
            isLightMode ? 'text-[#0A2533]/75' : 'text-[#DCE3E8]/75'
          }`}
        >
          <NavLink
            to="/collection"
            className={({ isActive }) =>
              `py-1.5 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all ${
                isActive
                  ? isLightMode
                    ? 'text-[#0A2533] font-semibold after:w-full after:bg-[#0A2533]'
                    : 'text-white font-semibold after:w-full after:bg-white'
                  : isLightMode
                  ? 'hover:text-[#0A2533] after:w-0 hover:after:w-full after:bg-[#0A2533]'
                  : 'hover:text-white after:w-0 hover:after:w-full after:bg-white'
              }`
            }
          >
            Fragrances
          </NavLink>

          <NavLink
            to="/philosophy"
            className={({ isActive }) =>
              `py-1.5 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all ${
                isActive
                  ? isLightMode
                    ? 'text-[#0A2533] font-semibold after:w-full after:bg-[#0A2533]'
                    : 'text-white font-semibold after:w-full after:bg-white'
                  : isLightMode
                  ? 'hover:text-[#0A2533] after:w-0 hover:after:w-full after:bg-[#0A2533]'
                  : 'hover:text-white after:w-0 hover:after:w-full after:bg-white'
              }`
            }
          >
            Philosophy
          </NavLink>

          <button
            onClick={effectiveOpenStory}
            className={`py-1.5 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:transition-all cursor-pointer uppercase font-sans text-[11px] lg:text-[12px] font-medium tracking-[0.16em] ${
              isLightMode
                ? 'hover:text-[#0A2533] after:bg-[#0A2533]'
                : 'hover:text-white after:bg-white'
            }`}
          >
            The Chronicle
          </button>

          <NavLink
            to="/concierge"
            className={({ isActive }) =>
              `py-1.5 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all ${
                isActive
                  ? isLightMode
                    ? 'text-[#0A2533] font-semibold after:w-full after:bg-[#0A2533]'
                    : 'text-white font-semibold after:w-full after:bg-white'
                  : isLightMode
                  ? 'hover:text-[#0A2533] after:w-0 hover:after:w-full after:bg-[#0A2533]'
                  : 'hover:text-white after:w-0 hover:after:w-full after:bg-white'
              }`
            }
          >
            Concierge
          </NavLink>
        </nav>

        {/* Right Action Icons: Quick Discovery & Bag */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/collection"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 border text-[10px] font-mono tracking-widest uppercase transition-all ${
              isLightMode
                ? 'border-[#087A91]/30 text-[#087A91] hover:border-[#087A91] hover:bg-[#087A91]/5'
                : 'border-[#48B8CE]/30 text-[#48B8CE] hover:border-[#48B8CE] hover:bg-[#48B8CE]/10'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>DISCOVERY KIT</span>
          </Link>

          <button
            onClick={effectiveOpenCart}
            aria-label={`View shopping bag (${effectiveCartCount} items)`}
            className={`flex items-center gap-2 py-1.5 text-[11px] lg:text-[12px] font-sans font-medium tracking-[0.16em] uppercase transition-colors cursor-pointer select-none ${
              isLightMode
                ? 'text-[#0A2533]/85 hover:text-[#0A2533]'
                : 'text-white/85 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[1.6]" />
            <span className="hidden sm:inline">BAG</span>
            <span className="tabular-nums font-normal opacity-70">
              ({effectiveCartCount})
            </span>
          </button>

          {/* Minimal Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1.5 cursor-pointer transition-colors ${
              isLightMode ? 'text-[#0A2533]' : 'text-white'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden backdrop-blur-xl border-b px-6 py-6 flex flex-col gap-4 text-xs font-sans font-medium uppercase tracking-[0.18em] shadow-lg animate-in fade-in duration-200 ${
            isLightMode
              ? 'bg-white/98 border-[#0A2533]/10 text-[#0A2533]'
              : 'bg-[#03151D]/98 border-white/10 text-[#DCE3E8]'
          }`}
        >
          <Link
            to="/collection"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:opacity-60 transition-opacity py-1.5"
          >
            Fragrances & Shop
          </Link>

          <Link
            to="/philosophy"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:opacity-60 transition-opacity py-1.5"
          >
            Philosophy
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              effectiveOpenStory();
            }}
            className="text-left hover:opacity-60 transition-opacity py-1.5 uppercase font-sans text-xs font-medium tracking-[0.18em] cursor-pointer"
          >
            The Chronicle
          </button>

          <Link
            to="/concierge"
            onClick={() => setMobileMenuOpen(false)}
            className="hover:opacity-60 transition-opacity py-1.5"
          >
            Concierge & Inquiries
          </Link>

          <div className="pt-4 border-t border-current/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                effectiveOpenCart();
              }}
              className="flex items-center gap-2 text-xs font-mono tracking-wider cursor-pointer py-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>SHOPPING BAG ({effectiveCartCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

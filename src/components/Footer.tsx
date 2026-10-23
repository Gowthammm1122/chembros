import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChemBrosLogo } from './ChemBrosLogo';
import { useCart } from '../context/CartContext';

interface FooterProps {
  onOpenStory?: () => void;
  onOpenContact?: () => void;
  onOpenPolicy?: (type: 'shipping' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStory: propOpenStory,
  onOpenContact: propOpenContact,
  onOpenPolicy: propOpenPolicy,
}) => {
  const { openStory, openContact, openPolicy } = useCart();
  const effectiveOpenStory = propOpenStory ?? openStory;
  const effectiveOpenContact = propOpenContact ?? openContact;
  const effectiveOpenPolicy = propOpenPolicy ?? openPolicy;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#060A0D] text-[#8EA3B0] font-mono border-t border-white/10 selection:bg-[#48B8CE] selection:text-black">
      
      {/* Subtle Lab Technical Grid Lines */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* TOP TIER: Newsletter & Brand Value Proposition */}
        <div className="pt-16 pb-14 border-b border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          
          {/* Left: Brand Identity & Lab Quality Guarantee */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2.5 text-[10px] tracking-[0.25em] text-[#48B8CE] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#48B8CE]" />
              <span>HAND-CRAFTED PERFUMERY</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-light text-white font-sans tracking-tight max-w-lg">
              Fine fragrances developed with lab precision.
            </h3>

            <p className="text-xs text-[#708896] leading-relaxed max-w-md">
              Small-batch extractions compounded and bottled in our Madurai studio. Long-lasting, cruelty-free, and skin-safe.
            </p>
          </div>

          {/* Right: Clean E-Commerce Newsletter */}
          <div className="lg:col-span-5">
            <div className="space-y-3">
              <span className="text-[10px] tracking-widest uppercase text-white/80 block">
                Join the Private List
              </span>
              <p className="text-xs text-[#708896]">
                Get 10% off your first bottle and early access to limited edition drops.
              </p>

              <form onSubmit={handleSubscribe} className="relative mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/[0.03] border border-white/15 px-4 py-3 text-xs text-white placeholder-[#516C7B] focus:outline-none focus:border-[#48B8CE] transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-white hover:bg-[#48B8CE] text-black font-semibold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* MIDDLE TIER: Standard E-Commerce 4-Column Navigation */}
        <div className="py-14 border-b border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          
          {/* Column 1: Shop */}
          <div>
            <span className="text-[10px] tracking-widest text-[#48B8CE] uppercase block mb-4">
              [01] SHOP
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link to="/fragrances" className="hover:text-white transition-colors block">
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link to="/discovery-set" className="hover:text-white transition-colors block">
                  Sample Set
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="hover:text-white transition-colors block">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-[#48B8CE] transition-colors block">
                  Fragrance Finder Quiz →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: About Us */}
          <div>
            <span className="text-[10px] tracking-widest text-[#48B8CE] uppercase block mb-4">
              [02] ABOUT
            </span>
            <ul className="space-y-2.5">
              <li>
                <button onClick={effectiveOpenStory} className="hover:text-white transition-colors cursor-pointer text-left block">
                  Our Story
                </button>
              </li>
              <li>
                <Link to="/ingredients" className="hover:text-white transition-colors block">
                  Clean Ingredients
                </Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-white transition-colors block">
                  How We Formulate
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors block">
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <span className="text-[10px] tracking-widest text-[#48B8CE] uppercase block mb-4">
              [03] HELP & CARE
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors block">
                  FAQs
                </Link>
              </li>
              <li>
                <button onClick={() => effectiveOpenPolicy?.('shipping')} className="hover:text-white transition-colors cursor-pointer text-left block">
                  Shipping & Returns
                </button>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition-colors block">
                  Track Order
                </Link>
              </li>
              <li>
                <button onClick={effectiveOpenContact} className="hover:text-white transition-colors cursor-pointer text-left block">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Laboratory Studio Details */}
          <div>
            <span className="text-[10px] tracking-widest text-[#48B8CE] uppercase block mb-4">
              [04] STUDIO
            </span>
            <div className="space-y-2 text-[11px] text-[#708896]">
              <p className="text-white">Chem Bros Fragrances</p>
              <p>Madurai, Tamil Nadu, India</p>
              <p className="pt-2">Mon – Sat: 10:00 – 18:00</p>
              <p>care@chembros.com</p>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 text-[10px] tracking-wider text-white/50 hover:text-white transition-colors flex items-center gap-1 cursor-pointer uppercase"
            >
              <span>Back to Top</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* BOTTOM TIER: Legal, Badges & Copyright */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-wider text-[#5A7482]">
          
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} CHEM BROS.</span>
            <span>·</span>
            <span>IFRA CERTIFIED</span>
            <span>·</span>
            <span>CRUELTY-FREE</span>
            <span>·</span>
            <span className="text-[#48B8CE]">PARABEN & PHTHALATE FREE</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => effectiveOpenPolicy?.('privacy')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => effectiveOpenPolicy?.('terms')} className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
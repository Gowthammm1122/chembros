import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChemBrosLogo } from './ChemBrosLogo';
import { FRAGRANCES, Fragrance } from '../data/fragrances';
import { PerfumeBottle } from './PerfumeBottle';
import { useCart } from '../context/CartContext';

interface FooterProps {
  onOpenStory?: () => void;
  onOpenContact?: () => void;
  onOpenPolicy?: (type: 'shipping' | 'privacy' | 'terms') => void;
  onSelectFragrance?: (fragrance: Fragrance) => void;
  onAddToCart?: (fragrance: Fragrance, size: number) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStory: propOpenStory,
  onOpenContact: propOpenContact,
  onOpenPolicy: propOpenPolicy,
  onSelectFragrance: propSelectFragrance,
  onAddToCart: propAddToCart,
}) => {
  const { openStory, openContact, openPolicy, openSpecimenModal, addToCart } = useCart();
  const effectiveOpenStory = propOpenStory ?? openStory;
  const effectiveOpenContact = propOpenContact ?? openContact;
  const effectiveOpenPolicy = propOpenPolicy ?? openPolicy;
  const effectiveSelectFragrance = propSelectFragrance ?? openSpecimenModal;
  const effectiveAddToCart = propAddToCart ?? addToCart;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const signatureFragrance = FRAGRANCES[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="relative bg-[#020608] text-[#DCE3E8] overflow-hidden font-sans border-t border-white/10">
      {/* Ambient Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#087A91]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#48B8CE]/5 blur-[120px] rounded-full" />
      </div>

      {/* TOP CALL-TO-ACTION SECTION: Minimal Luxury Showcase */}
      <section className="relative z-10 border-b border-white/10 pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Bold Typography & Clean CTA */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.28em] uppercase text-[#48B8CE] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#48B8CE]" />
                <span>LIMITED BATCH FORMULATIONS</span>
              </div>

              <h2 className="font-display font-light text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] max-w-xl">
                Experience the precision of olfactory chemistry.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#9BB3C1] font-light leading-relaxed max-w-lg">
                Four artisanal extracts formulated without compromise. Cryogenically stabilized, nitrogen aged, and poured in Madurai.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/collection"
                  className="inline-flex items-center gap-3 px-7 py-3.5 bg-white hover:bg-[#48B8CE] text-[#020608] hover:text-[#020608] font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                >
                  <span>EXPLORE ALL FORMULAS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/concierge"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 hover:border-white text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#48B8CE]" />
                  <span>OLFACTORY CONSULT</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Specimen Showcase Plinth */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <Link 
                to={`/product/${signatureFragrance.id}`}
                className="w-full max-w-xs p-6 bg-white/[0.03] border border-white/10 rounded-sm backdrop-blur-sm group hover:border-[#48B8CE]/40 transition-all duration-500 block cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#7E9DAA] uppercase mb-4">
                  <span>SIGNATURE HIGHLIGHT</span>
                  <span className="text-[#48B8CE]">FORMULA 01</span>
                </div>

                <div className="flex justify-center py-4 transform group-hover:scale-105 transition-transform duration-500">
                  <PerfumeBottle
                    fragrance={signatureFragrance}
                    size="md"
                    showPedestal={true}
                    pedestalHeight={70}
                    interactive={false}
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-medium">{signatureFragrance.name}</span>
                  <span className="text-[#48B8CE] font-semibold">₹4,500</span>
                </div>
              </Link>
            </div>


          </div>
        </div>
      </section>

      {/* MIDDLE TIER: Structured Navigation & Newsletter */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          
          {/* Brand Wordmark & City Base */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <Link to="/" className="inline-block" aria-label="CHEM BROS home">
              <ChemBrosLogo
                variant="white"
                size="sm"
                showTagline={false}
              />
            </Link>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="text-xs font-mono text-[#7E9DAA] tracking-wider uppercase">
              MADURAI · PARIS · NEW YORK
            </span>
          </div>

          {/* Essential Minimal Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono tracking-wider text-[#A1B8C4]">
            <Link to="/collection" className="hover:text-white transition-colors uppercase">
              Collection
            </Link>
            <Link to="/philosophy" className="hover:text-white transition-colors uppercase">
              Philosophy
            </Link>
            <button onClick={effectiveOpenStory} className="hover:text-white transition-colors cursor-pointer uppercase">
              The Chronicle
            </button>
            <Link to="/concierge" className="hover:text-white transition-colors uppercase">
              Concierge
            </Link>
            <Link to="/policies/shipping" className="hover:text-white transition-colors uppercase">
              Client Care
            </Link>
          </nav>

          {/* Compact Private Allocation Input */}
          <div className="w-full md:w-auto min-w-[260px] max-w-xs">
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join batch allocation list"
                required
                className="w-full bg-white/[0.04] border border-white/15 px-3 py-2 text-xs text-white placeholder-[#5A7785] focus:outline-none focus:border-[#48B8CE] transition-all font-mono"
              />
              <button
                type="submit"
                aria-label="Submit email"
                className="absolute right-1 px-2.5 py-1 bg-white text-[#020608] hover:bg-[#48B8CE] hover:text-white text-xs font-mono transition-colors cursor-pointer font-semibold"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-1.5 text-[11px] font-mono text-[#48B8CE]">
                ✓ Registered for next allocation.
              </p>
            )}
          </div>
        </div>

        {/* BOTTOMMOST TIER: Copyright & Discreet Compliance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6A8896]">
          <div>
            © 2026 CHEM BROS FRAGRANCE LABORATORY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/policies/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>·</span>
            <Link to="/policies/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>·</span>
            <Link to="/policies/shipping" className="hover:text-white transition-colors">
              Shipping & Returns
            </Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-[#48B8CE] transition-colors">
              Atelier Portal
            </Link>
            <span>·</span>
            <span className="text-[#48B8CE]">IFRA 51ST COMPLIANT</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

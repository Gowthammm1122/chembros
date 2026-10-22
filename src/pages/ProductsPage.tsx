import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FRAGRANCES, DISCOVERY_ARCHIVE, ALL_PRODUCTS, Fragrance, formatPrice } from '../data/fragrances';
import { ProductCard } from '../components/ProductCard';
import { LiquidChromeButton } from '../components/LiquidChromeButton';
import { useCart } from '../context/CartContext';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filteredFragrances = selectedFilter === 'all'
    ? FRAGRANCES
    : FRAGRANCES.filter(f => f.id === selectedFilter);

  const showDiscoveryArchive = selectedFilter === 'all' || selectedFilter === 'discovery-archive';

  return (
    <div className="pt-20 sm:pt-24 pb-28 bg-[#03151D] min-h-screen text-[#DCE3E8] selection:bg-[#48B8CE]/30 selection:text-white">
      
      {/* 1. Atmospheric Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="border-b border-white/10 bg-[#03151D]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex items-center justify-between text-xs font-mono text-[#A9C2CE]">
          <div className="flex items-center gap-2.5 tracking-wider uppercase">
            <Link to="/" className="hover:text-white transition-colors">HOME</Link>
            <span className="text-white/30">/</span>
            <span className="text-[#48B8CE] font-semibold">ALL FRAGRANCES</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-white/50 text-[11px] font-mono tracking-widest uppercase">
            <span>5 FORMULATIONS</span>
            <span>•</span>
            <span>25% EXTRAIT CONCENTRATION</span>
          </div>
        </div>
      </nav>

      {/* 2. Editorial Catalog Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-12 pb-8 sm:pb-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] text-[#48B8CE] uppercase font-semibold mb-3">
            <span className="w-4 h-[1px] bg-[#48B8CE]" />
            <span>THE COLLECTION CATALOG</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
            The Molecule Series
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#DCE3E8]/80 leading-relaxed font-light">
            Precision-extracted molecular extraits formulated in Madurai, Tamil Nadu. Four flacons exploring singular botanical characters, alongside our miniature discovery coffret.
          </p>
        </div>

        {/* 3. Filter Navigation Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-white text-[#03151D] font-semibold shadow-xs'
                : 'bg-white/5 text-[#A9C2CE] border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            ALL PRODUCTS (5)
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('molecule-j')}
            className={`px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'molecule-j'
                ? 'bg-white text-[#03151D] font-semibold shadow-xs'
                : 'bg-white/5 text-[#A9C2CE] border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            MOLECULE J · JASMINE
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('molecule-t')}
            className={`px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'molecule-t'
                ? 'bg-white text-[#03151D] font-semibold shadow-xs'
                : 'bg-white/5 text-[#A9C2CE] border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            MOLECULE T · TUBEROSE
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('molecule-r')}
            className={`px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'molecule-r'
                ? 'bg-white text-[#03151D] font-semibold shadow-xs'
                : 'bg-white/5 text-[#A9C2CE] border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            MOLECULE R · CHAMPACA
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('molecule-x')}
            className={`px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'molecule-x'
                ? 'bg-white text-[#03151D] font-semibold shadow-xs'
                : 'bg-white/5 text-[#A9C2CE] border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            MOLECULE X · DAVANA
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('discovery-archive')}
            className={`px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'discovery-archive'
                ? 'bg-white text-[#03151D] font-semibold shadow-xs'
                : 'bg-white/5 text-[#A9C2CE] border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            DISCOVERY ARCHIVE (COFFRET)
          </button>
        </div>
      </section>

      {/* 4. Products Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-6">
        {selectedFilter !== 'discovery-archive' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredFragrances.map((fragrance, idx) => (
              <ProductCard
                key={fragrance.id}
                fragrance={fragrance}
                index={idx}
                onSelect={(f) => navigate(`/product/${f.id}`)}
                onAddToCart={(f, size) => {
                  addToCart(f, size, 1);
                  openCart();
                }}
              />
            ))}
          </div>
        )}

        {/* 5. The Discovery Archive Miniature Coffret (Continuous bg1.jpeg Background) */}
        {showDiscoveryArchive && (
          <div className="mt-14 w-full">
            <div
              className="relative overflow-hidden rounded-sm border border-white/15 shadow-[0_24px_64px_rgba(3,21,29,0.45)] grid grid-cols-1 md:grid-cols-12 bg-cover bg-center"
              style={{ backgroundImage: "url('/bg/bg1.jpeg')" }}
            >
              {/* Luminous glass tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/35 pointer-events-none" />

              {/* Left Visual: Floating Dummy Product Stage */}
              <div className="md:col-span-5 lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] md:min-h-[480px] flex flex-col items-center justify-center p-6 sm:p-10 z-10">
                <div className="absolute w-64 h-64 rounded-full bg-[#48B8CE]/10 blur-3xl pointer-events-none" />

                <div 
                  onClick={() => navigate('/product/discovery-archive')}
                  className="relative group cursor-pointer flex flex-col items-center"
                >
                  <img
                    src="/images/discovery-archive-bottle.png"
                    alt="Discovery Archive Miniature Coffret"
                    className="w-auto h-[240px] sm:h-[300px] md:h-[360px] max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.65)] transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700 select-none"
                  />
                  <div className="w-48 sm:w-56 h-3 bg-gradient-to-r from-transparent via-black/60 to-transparent blur-sm mt-3" />
                </div>
              </div>

              {/* Right Dossier */}
              <div className="md:col-span-7 lg:col-span-6 p-7 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center text-left relative z-10">
                <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-[#48B8CE] uppercase font-semibold mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#48B8CE] animate-pulse" />
                  <span>MINIATURE COFFRET</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em] text-white uppercase font-light leading-tight">
                  THE DISCOVERY ARCHIVE
                </h3>

                <div className="w-14 h-[1px] bg-gradient-to-r from-[#48B8CE] via-[#48B8CE]/40 to-transparent my-4 sm:my-5" />

                <p className="text-sm sm:text-base text-[#DCE3E8]/85 font-light leading-relaxed">
                  The complete Molecule Series, in miniature. 4 × 3ml extraits to experience the full olfactory spectrum.
                </p>

                <div className="w-14 h-[1px] bg-gradient-to-r from-white/15 to-transparent my-4 sm:my-5" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-[#A9C2CE] mb-7 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#48B8CE]" />
                    <span>4 × 3ML EXTRAIT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#48B8CE]" />
                    <span>EXTRAIT DE PARFUM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#48B8CE]" />
                    <span>25% CONCENTRATION</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#48B8CE]" />
                    <span>UNISEX · 8+ HOURS</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2.5 mb-6">
                  <span className="text-2xl sm:text-3xl font-display text-white font-medium tracking-tight">
                    {formatPrice(DISCOVERY_ARCHIVE.price)}
                  </span>
                  <span className="font-mono text-[9px] text-[#A9C2CE]/70 uppercase tracking-widest font-normal">
                    INCL. ALL TAXES
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <LiquidChromeButton
                    label="ADD TO BAG"
                    size="sm"
                    accentColor="72,184,206"
                    onClick={() => {
                      addToCart(DISCOVERY_ARCHIVE, 12, 1);
                      openCart();
                    }}
                    aria-label="Add Discovery Archive to Bag"
                  />

                  <Link
                    to="/product/discovery-archive"
                    className="px-5 py-3 border border-white/20 hover:border-[#48B8CE] text-white hover:text-[#48B8CE] text-xs font-mono tracking-[0.18em] uppercase transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xs inline-flex items-center justify-center self-center"
                  >
                    <span>EXPLORE DOSSIER</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 opacity-70" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. Brand Quality Guarantees Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mt-16 pt-10 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono text-[#A9C2CE]">
          <div className="flex items-center gap-3 p-4 border border-white/10 bg-white/5 rounded-xs">
            <ShieldCheck className="w-5 h-5 text-[#48B8CE] shrink-0" />
            <div>
              <div className="text-white font-semibold uppercase">25% EXTRAIT PURITY</div>
              <div className="text-white/60 mt-0.5">High natural oil concentration for 12+ hour persistence.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-white/10 bg-white/5 rounded-xs">
            <Truck className="w-5 h-5 text-[#48B8CE] shrink-0" />
            <div>
              <div className="text-white font-semibold uppercase">COMPLIMENTARY SHIPPING</div>
              <div className="text-white/60 mt-0.5">Expedited pan-India delivery with secure tamper sealing.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-white/10 bg-white/5 rounded-xs">
            <RotateCcw className="w-5 h-5 text-[#48B8CE] shrink-0" />
            <div>
              <div className="text-white font-semibold uppercase">7-DAY SPECIMEN GUARANTEE</div>
              <div className="text-white/60 mt-0.5">Hassle-free replacement for unopened bottles or transit damage.</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { FRAGRANCES, DISCOVERY_ARCHIVE, Fragrance, formatPrice } from '../data/fragrances';
import { ProductCard } from './ProductCard';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCollectionProps {
  onSelectFragrance: (fragrance: Fragrance) => void;
  onAddToCart: (fragrance: Fragrance, size: number) => void;
}

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  onSelectFragrance,
  onAddToCart,
}) => {
  return (
    <section
      id="collection"
      className="relative min-h-screen py-14 sm:py-18 lg:py-24 bg-gradient-to-b from-[#FFFFFF] via-[#F4F8FA] to-[#FFFFFF] px-4 sm:px-8 lg:px-12 flex flex-col justify-center overflow-hidden border-b border-[#0A2533]/10"
    >
      {/* Seamless Top Blend from Hero */}
      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#03151D]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center relative z-10">
        
        {/* Section Header with "VIEW ALL" button redirecting to product page */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 sm:pb-6 mb-8 sm:mb-10 border-b border-[#0A2533]/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-[#087A91] uppercase mb-1.5 font-semibold">
              <span className="w-4 h-[1px] bg-[#087A91]" />
              <span>THE COLLECTION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-[#0A2533] tracking-tight leading-tight">
              Four formulas. <span className="font-normal text-[#244250]">Four identities.</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#4A6572] font-light leading-relaxed">
              Precision-extracted molecular fragrances born from the florals of Tamil Nadu.
            </p>
          </div>

          {/* Clean VIEW ALL button redirecting directly to the product dossier */}
          <Link
            to="/product/molecule-j"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#0A2533]/20 hover:border-[#087A91] bg-white hover:bg-[#F0F6F9] text-[#0A2533] hover:text-[#087A91] text-xs font-mono tracking-widest uppercase transition-all duration-300 self-start sm:self-auto shrink-0 shadow-xs group cursor-pointer"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 1. Exactly 4 Core Perfume Flacons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-6 w-full items-stretch">
          {FRAGRANCES.map((fragrance, idx) => (
            <ProductCard
              key={fragrance.id}
              fragrance={fragrance}
              index={idx}
              onSelect={onSelectFragrance}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* 2. Standalone Dedicated Feature Card: THE DISCOVERY ARCHIVE (Matching Authentic Reference) */}
        <div className="mt-12 sm:mt-16 w-full">
          <div className="relative overflow-hidden border border-[#0A2533]/15 shadow-[0_12px_40px_rgba(10,37,51,0.06)] grid grid-cols-1 md:grid-cols-12 bg-white">
            
            {/* Left Visual: Authentic Coffret Imagery with Floral Setting */}
            <div className="md:col-span-6 relative min-h-[320px] sm:min-h-[400px] md:min-h-[460px] bg-[#0A0D10] overflow-hidden group">
              <img
                src="/images/discovery-archive-coffret.png"
                alt="The Discovery Archive Miniature Coffret"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none md:hidden" />
            </div>

            {/* Right Dossier: Warm Cream Canvas matching user specification (#F0E6DA) */}
            <div className="md:col-span-6 bg-[#F0E6DA] p-7 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center text-left">
              
              {/* Category Eyebrow */}
              <div className="font-mono text-[10px] tracking-[0.28em] text-[#610718] uppercase font-bold mb-2">
                MINIATURE COFFRET
              </div>

              {/* Title: The Discovery Archive */}
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.06em] text-[#1A1A1A] uppercase font-normal leading-tight">
                THE DISCOVERY ARCHIVE
              </h3>

              {/* Thin Divider Rule */}
              <div className="w-12 h-[1px] bg-[#1A1A1A]/25 my-4 sm:my-5" />

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#3A3A3A] font-serif leading-relaxed font-normal">
                The complete Molecule Series, in miniature.
              </p>

              {/* Thin Divider Rule */}
              <div className="w-12 h-[1px] bg-[#1A1A1A]/25 my-4 sm:my-5" />

              {/* Specifications List */}
              <div className="space-y-1.5 text-[10.5px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-[#4A4A4A] mb-6 sm:mb-8 font-medium">
                <div>4 × 3ML EXTRAIT</div>
                <div>EXTRAIT DE PARFUM</div>
                <div>25% NATURAL OIL CONCENTRATION</div>
                <div>UNISEX · 8+ HOURS</div>
              </div>

              {/* Price: ₹1,299 */}
              <div className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] font-medium mb-6 tracking-tight">
                {formatPrice(DISCOVERY_ARCHIVE.price)}
              </div>

              {/* Action Buttons: ADD TO BAG in authentic Crimson (#610718) + View Details */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCart(DISCOVERY_ARCHIVE, 12)}
                  className="px-8 py-3.5 bg-[#610718] hover:bg-[#7D0E23] text-white text-xs font-mono tracking-[0.22em] uppercase transition-colors cursor-pointer shadow-sm text-center font-bold flex items-center justify-center gap-2 active:scale-98"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ADD TO BAG</span>
                </button>

                <Link
                  to="/product/discovery-archive"
                  className="px-5 py-3.5 border border-[#1A1A1A]/25 hover:border-[#610718] text-[#1A1A1A] hover:text-[#610718] text-xs font-mono tracking-[0.18em] uppercase transition-colors text-center font-medium bg-white/40 hover:bg-white"
                >
                  DETAILS & NOTES
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

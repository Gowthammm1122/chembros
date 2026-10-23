import React from 'react';
import { Link } from 'react-router-dom';
import { FRAGRANCES, DISCOVERY_ARCHIVE, Fragrance, formatPrice } from '../data/fragrances';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { ChemButton } from './ChemButton';

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

          {/* Clean VIEW ALL button redirecting directly to the products catalog */}
          <Link
            to="/products"
            className="self-start sm:self-auto shrink-0"
          >
            <ChemButton
              label="VIEW ALL"
              variant="secondary"
              aria-label="View all products"
            />
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

        {/* 2. Standalone Dedicated Feature Card: THE DISCOVERY ARCHIVE (Full Background with Floating Dummy Product) */}
        <div className="mt-12 sm:mt-16 w-full">
          <div
            className="relative overflow-hidden rounded-sm border border-white/15 shadow-[0_24px_64px_rgba(3,21,29,0.45)] grid grid-cols-1 md:grid-cols-12 bg-cover bg-center"
            style={{ backgroundImage: "url('/bg/bg1.jpeg')" }}
          >
            {/* Subtle luminous glass tint overlay to ensure high readability while keeping full bg visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/35 pointer-events-none" />

            {/* Left Visual: Floating Dummy Product Stage (User can replace this image) */}
            <div className="md:col-span-5 lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] md:min-h-[480px] flex flex-col items-center justify-center p-6 sm:p-10 z-10">
              {/* Subtle ambient halo behind product */}
              <div className="absolute w-64 h-64 rounded-full bg-[#48B8CE]/10 blur-3xl pointer-events-none" />

              {/* Floating Dummy Product Image */}
              <div className="relative group cursor-pointer flex flex-col items-center">
                <img
                  src="/images/discovery-archive-bottle.png"
                  alt="Discovery Archive Flacon Specimen (Dummy Image - Replace with your product image)"
                  className="w-auto h-[240px] sm:h-[300px] md:h-[360px] max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.65)] transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700 select-none"
                />
                {/* Floating soft platform shadow */}
                <div className="w-48 sm:w-56 h-3 bg-gradient-to-r from-transparent via-black/60 to-transparent blur-sm mt-3" />
              </div>
            </div>

            {/* Right Dossier: ChemBros Atmospheric Typography & Actions */}
            <div className="md:col-span-7 lg:col-span-6 p-7 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center text-left relative z-10">

              {/* Category Eyebrow */}
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-[#48B8CE] uppercase font-semibold mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#48B8CE] animate-pulse" />
                <span>MINIATURE COFFRET</span>
              </div>

              {/* Title: The Discovery Archive */}
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-[0.04em] text-white uppercase font-light leading-tight">
                THE DISCOVERY ARCHIVE
              </h3>

              {/* Thin Divider Rule with Cyan Accent */}
              <div className="w-14 h-[1px] bg-gradient-to-r from-[#48B8CE] via-[#48B8CE]/40 to-transparent my-4 sm:my-5" />

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#DCE3E8]/85 font-light leading-relaxed">
                The complete Molecule Series, in miniature.
              </p>

              {/* Thin Divider Rule */}
              <div className="w-14 h-[1px] bg-gradient-to-r from-white/15 to-transparent my-4 sm:my-5" />

              {/* Specifications Grid */}
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

              {/* Price: ₹1,299 */}
              <div className="flex items-baseline gap-2.5 mb-6">
                <span className="text-2xl sm:text-3xl font-display text-white font-medium tracking-tight">
                  {formatPrice(DISCOVERY_ARCHIVE.price)}
                </span>
                <span className="font-mono text-[9px] text-[#A9C2CE]/70 uppercase tracking-widest font-normal">
                  INCL. ALL TAXES
                </span>
              </div>

              {/* Action Buttons: Liquid Chrome ADD TO BAG + View Details */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <ChemButton
                  label="ADD TO BAG"
                  variant="ghost"
                  onClick={() => onAddToCart(DISCOVERY_ARCHIVE, 12)}
                  aria-label="Add Discovery Archive to Bag"
                />

                <Link
                  to="/product/discovery-archive"
                  className="px-5 py-3 border border-white/20 hover:border-[#48B8CE] text-white hover:text-[#48B8CE] text-xs font-mono tracking-[0.18em] uppercase transition-all bg-white/5 hover:bg-white/10 backdrop-blur-xs inline-flex items-center justify-center self-center"
                >
                  <span>DETAILS & NOTES</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 opacity-70" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

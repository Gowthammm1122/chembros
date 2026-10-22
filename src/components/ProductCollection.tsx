import React, { useState, useEffect } from 'react';
import { FRAGRANCES, Fragrance } from '../data/fragrances';
import { ProductCard } from './ProductCard';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProductCollectionProps {
  onSelectFragrance: (fragrance: Fragrance) => void;
  onAddToCart: (fragrance: Fragrance, size: number) => void;
}

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  onSelectFragrance,
  onAddToCart,
}) => {
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [filter]);

  const filteredFragrances = filter === 'all'
    ? FRAGRANCES
    : FRAGRANCES.filter(f => f.id === filter);

  return (
    <section
      id="collection"
      className="relative min-h-screen py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#FFFFFF] via-[#F4F8FA] to-[#FFFFFF] px-4 sm:px-8 lg:px-12 flex flex-col justify-center overflow-hidden border-b border-[#073849]/10"
    >
      {/* Seamless Top Blend from Hero */}
      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#03151D]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center relative z-10">
        {/* Section Header: Ample breathing space for Title, description, and filters */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 sm:pb-6 mb-8 sm:mb-10 border-b border-[#073849]/10 shrink-0">
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

          {/* Interactive Formula Filter Controls: ALL, 01, 02, 03, 04 */}
          <div className="flex items-center gap-1 p-1 bg-[#F0F6F9] border border-[#073849]/10 self-start sm:self-auto shrink-0 rounded-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#073849] text-white font-medium shadow-sm'
                  : 'text-[#4A6572] hover:text-[#073849] hover:bg-white'
              }`}
            >
              ALL
            </button>
            {FRAGRANCES.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  filter === f.id
                    ? 'bg-[#073849] text-white font-medium shadow-sm'
                    : 'text-[#4A6572] hover:text-[#073849] hover:bg-white'
                }`}
              >
                {f.formulaNo}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Balanced Grid with Reduced Card Heights & Ample Breathing Room */}
        <div
          className={`grid gap-5 sm:gap-6 lg:gap-6 w-full items-stretch ${
            filteredFragrances.length === 1
              ? 'grid-cols-1 max-w-sm sm:max-w-md mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {filteredFragrances.map((fragrance, idx) => (
            <ProductCard
              key={fragrance.id}
              fragrance={fragrance}
              index={idx}
              onSelect={onSelectFragrance}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

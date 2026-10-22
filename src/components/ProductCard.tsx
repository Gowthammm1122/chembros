import React from 'react';
import { Fragrance, formatPrice } from '../data/fragrances';
import { PerfumeBottle } from './PerfumeBottle';
import { Link } from 'react-router-dom';
import { LiquidChromeButton } from './LiquidChromeButton';

interface ProductCardProps {
  fragrance: Fragrance;
  onSelect: (fragrance: Fragrance) => void;
  onAddToCart: (fragrance: Fragrance, size: number) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  fragrance,
  onSelect,
  onAddToCart,
  index,
}) => {
  return (
    <div
      className="group relative flex flex-col rounded-sm border border-white/10 hover:border-[#48B8CE]/50 transition-all duration-500 overflow-hidden bg-cover bg-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_48px_rgba(8,122,145,0.28)] h-[475px] sm:h-[495px]"
      style={{ backgroundImage: "url('/bg/bg1.jpeg')" }}
    >
      {/* Subtle atmospheric tint overlay for depth and high text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

      {/* 1. Flacon Presentation Stage */}
      <div className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-center py-6 px-4 overflow-hidden transition-colors duration-500">

        {/* Flacon Visual with Interactive Depth */}
        <Link
          to={`/product/${fragrance.id}`}
          className="my-auto py-1 cursor-pointer transform group-hover:-translate-y-2 transition-transform duration-500 flex items-center justify-center relative z-10"
          aria-label={`Inspect ${fragrance.name}`}
        >
          <PerfumeBottle
            fragrance={fragrance}
            size="sm"
            showPedestal={false}
            interactive={true}
            visualId={index === 0 ? 'collection-card-formula-001-visual' : undefined}
            svgId={index === 0 ? 'collection-card-formula-001-svg' : undefined}
          />
        </Link>

        {/* Studio Pedestal Shadow */}
        <div className="w-1/2 h-1.5 bg-gradient-to-r from-transparent via-black/80 to-transparent blur-[2px] mt-1 shrink-0" />
      </div>

      {/* 2. Clean Minimal Dossier & Action Zone: Name, Small Description, Price, and Button */}
      <div className="p-4 sm:p-5 shrink-0 flex flex-col justify-between border-t border-white/10 relative z-10">
        <div>
          {/* Fragrance Name */}
          <Link
            to={`/product/${fragrance.id}`}
            className="font-display font-medium text-base sm:text-lg text-white tracking-wide group-hover:text-[#48B8CE] transition-colors cursor-pointer truncate block leading-tight"
          >
            {fragrance.name}
          </Link>

          {/* Small Scent Description */}
          <p className="mt-1 text-[11px] sm:text-xs text-[#DCE3E8]/75 line-clamp-2 leading-relaxed font-light">
            {fragrance.description}
          </p>
        </div>

        {/* Price & Liquid Chrome Button */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="font-display text-base sm:text-lg text-white font-medium tabular-nums">
            {formatPrice(fragrance.price)}
          </div>

          {/* Reusable Liquid Chrome Button */}
          <div className="flex items-center">
            <LiquidChromeButton
              label="ADD"
              size={0.17}
              onClick={() => onAddToCart(fragrance, 50)}
              aria-label={`Add ${fragrance.name} to cart`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Fragrance, formatPrice } from '../data/fragrances';
import { PerfumeBottle } from './PerfumeBottle';
import { Plus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const cardStageGradients = [
    'linear-gradient(180deg, #F8FAFB 0%, #EFF5F8 60%, #E6EFF3 100%)',
    'linear-gradient(180deg, #F7FAF9 0%, #EEF5F3 60%, #E4EFEA 100%)',
    'linear-gradient(180deg, #F8F9FB 0%, #EFF3F8 60%, #E6ECF5 100%)',
    'linear-gradient(180deg, #FAF8F6 0%, #F5F0EB 60%, #EFE8E1 100%)',
  ];

  return (
    <div className="group relative flex flex-col rounded-sm border border-[#0A2533]/10 hover:border-[#087A91]/40 transition-all duration-500 overflow-hidden bg-white shadow-[0_4px_20px_rgba(10,37,51,0.04)] hover:shadow-[0_16px_36px_rgba(10,37,51,0.1)] h-[375px] sm:h-[395px]">
      {/* 1. Visual Stage & Formula Presentation */}
      <div 
        className="relative w-full flex-1 min-h-0 flex flex-col items-center justify-center py-2 px-3 sm:py-3 overflow-hidden border-b border-[#0A2533]/10 transition-colors duration-500"
        style={{ background: cardStageGradients[index % cardStageGradients.length] }}
      >
        {/* Subtle Specimen Number Watermark */}
        <div className="absolute top-2 left-2.5 flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] tracking-widest text-[#5A7785] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#087A91]/60" />
          <span>FORMULA {fragrance.formulaNo}</span>
        </div>

        {/* Quick Link to Product Page Icon */}
        <Link
          to={`/product/${fragrance.id}`}
          className="absolute top-2 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#087A91] hover:text-[#0A2533] bg-white/70 backdrop-blur-xs rounded-xs"
          title="Open Formula Dossier"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        {/* Perfume Bottle Rendering */}
        <Link 
          to={`/product/${fragrance.id}`}
          className="my-auto py-0.5 cursor-pointer transform group-hover:-translate-y-1 transition-transform duration-500 flex items-center justify-center" 
          aria-label={`View ${fragrance.name}`}
        >
          <PerfumeBottle
            fragrance={fragrance}
            size="sm"
            showPedestal={false}
            interactive={true}
            visualId={index === 0 ? "collection-card-formula-001-visual" : undefined}
            svgId={index === 0 ? "collection-card-formula-001-svg" : undefined}
          />
        </Link>

        {/* Clean Studio Platform Shadow */}
        <div className="w-1/2 h-1 bg-gradient-to-r from-transparent via-[#0A2533]/15 to-transparent blur-[1.5px] mt-0.5 shrink-0" />
      </div>

      {/* 2. Structured Product Metadata & Action Zone */}
      <div className="p-3 sm:p-3.5 bg-white shrink-0 flex flex-col justify-between">
        <div>
          {/* Family / Concentration */}
          <div className="flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono tracking-widest text-[#5A7785] uppercase mb-0.5 font-medium">
            <span className="truncate pr-2">{fragrance.family}</span>
            <span className="text-[#087A91] font-semibold shrink-0">EXTRAIT</span>
          </div>

          {/* Fragrance Name */}
          <Link 
            to={`/product/${fragrance.id}`}
            className="font-display font-semibold text-sm sm:text-base text-[#0A2533] tracking-wide group-hover:text-[#087A91] transition-colors cursor-pointer truncate block"
          >
            {fragrance.name}
          </Link>

          {/* Scent Description */}
          <p className="mt-0.5 text-[11px] text-[#4A6775] line-clamp-1 leading-normal font-light">
            {fragrance.description}
          </p>
        </div>

        {/* Bottom Price & Controls */}
        <div className="mt-2.5 pt-2 border-t border-[#0A2533]/10 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-mono text-[8.5px] sm:text-[9px] tracking-widest uppercase text-[#5A7785]">FROM (50ML)</span>
            <span className="font-display text-sm sm:text-base text-[#0A2533] font-semibold tabular-nums">
              {formatPrice(fragrance.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/product/${fragrance.id}`}
              className="text-[10.5px] font-mono tracking-wider uppercase text-[#0A2533] hover:text-[#087A91] transition-colors py-1 px-2 border border-[#0A2533]/20 hover:border-[#087A91] cursor-pointer font-medium"
            >
              DETAILS
            </Link>

            <button
              onClick={() => onAddToCart(fragrance, 50)}
              aria-label={`Quick add ${fragrance.name} to cart`}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#0A2533] hover:bg-[#087A91] text-white transition-all duration-200 text-xs font-mono uppercase tracking-wider cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>ADD</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FRAGRANCES, Fragrance, formatPrice } from '../data/fragrances';
import { PerfumeBottle } from './PerfumeBottle';
import { ArrowRight, Check, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SignatureSpotlightProps {
  onSelectFragrance: (fragrance: Fragrance) => void;
  onAddToCart: (fragrance: Fragrance, size: number) => void;
}

export const SignatureSpotlight: React.FC<SignatureSpotlightProps> = ({
  onSelectFragrance,
  onAddToCart,
}) => {
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance>(FRAGRANCES[0]);
  const [selectedSize, setSelectedSize] = useState<number>(50);

  const currentPrice = selectedFragrance.sizes.find(s => s.ml === selectedSize)?.price || selectedFragrance.price;

  return (
    <section className="relative min-h-[90vh] bg-spotlight-gradient py-24 text-[#0A2533] border-b border-[#0A2533]/10 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Formula Switcher Tabs */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 border-b border-[#0A2533]/10">
          <span className="text-xs font-mono tracking-widest text-[#5A7785] uppercase mr-2 font-medium">
            SELECT SPOTLIGHT:
          </span>
          {FRAGRANCES.map(f => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFragrance(f);
                setSelectedSize(50);
              }}
              className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                selectedFragrance.id === f.id
                  ? 'bg-[#0A2533] text-white font-semibold shadow-sm'
                  : 'text-[#4A6775] hover:text-[#0A2533] hover:bg-white/80'
              }`}
            >
              FORMULA {f.formulaNo} — {f.name}
            </button>
          ))}
        </div>

        {/* Split Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left/Center Visual Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[460px] p-8 border border-[#0A2533]/10 bg-gradient-to-b from-[#FBFDFC] via-white to-[#F2F7FA] backdrop-blur-sm shadow-[0_16px_40px_rgba(10,37,51,0.04)]">
            {/* Specimen Number Overlay */}
            <div className="absolute top-6 left-6 font-mono text-xs tracking-[0.25em] text-[#087A91] font-semibold">
              SPECIMEN // {selectedFragrance.formulaNo}
            </div>
            <div className="absolute top-6 right-6 font-mono text-xs tracking-[0.25em] text-[#5A7785]">
              EXTRAIT 28% VOL.
            </div>

            {/* Large Perfume Bottle Specimen on Brushed Metal Plinth */}
            <div className="py-8 transform hover:scale-[1.02] transition-transform duration-700">
              <PerfumeBottle
                fragrance={selectedFragrance}
                size="lg"
                showPedestal={true}
                pedestalHeight={140}
                interactive={true}
                onClick={() => onSelectFragrance(selectedFragrance)}
              />
            </div>

            {/* Soft Shadow Line */}
            <div className="w-[85%] h-1 bg-gradient-to-r from-transparent via-[#0A2533]/15 to-transparent blur-sm" />

            {/* Olfactory Note Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#0A2533]">
              {selectedFragrance.olfactoryPyramid.heart.map(note => (
                <span key={note} className="px-3 py-1 bg-white border border-[#0A2533]/10 shadow-sm font-medium">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Right Product Details & Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.25em] uppercase text-[#087A91] mb-3 font-semibold">
              <span>SIGNATURE SPOTLIGHT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#087A91]" />
              <span>FORMULA NO. {selectedFragrance.formulaNo}</span>
            </div>

            {/* Fragrance Title */}
            <h2 className="font-display font-light text-4xl sm:text-5xl text-[#0A2533] tracking-tight leading-tight">
              {selectedFragrance.name}
            </h2>

            {/* Subtitle / Olfactory Family */}
            <p className="mt-2 text-sm font-mono tracking-widest text-[#5A7785] uppercase">
              {selectedFragrance.family} — {selectedFragrance.subtitle}
            </p>

            {/* Description */}
            <p className="mt-6 text-base text-[#4A6775] leading-relaxed font-light">
              {selectedFragrance.description}
            </p>

            {/* Olfactory Pyramid Breakdown */}
            <div className="mt-6 p-4 border border-[#0A2533]/10 bg-white shadow-sm space-y-2 text-xs font-mono">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#5A7785] shrink-0 font-medium">TOP NOTES:</span>
                <span className="text-[#0A2533] text-right">{selectedFragrance.olfactoryPyramid.top.join(', ')}</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-t border-[#0A2533]/10 pt-2">
                <span className="text-[#5A7785] shrink-0 font-medium">HEART:</span>
                <span className="text-[#0A2533] text-right font-medium">{selectedFragrance.olfactoryPyramid.heart.join(', ')}</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-t border-[#0A2533]/10 pt-2">
                <span className="text-[#5A7785] shrink-0 font-medium">DRYDOWN:</span>
                <span className="text-[#0A2533] text-right">{selectedFragrance.olfactoryPyramid.base.join(', ')}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-8">
              <span className="block text-xs font-mono tracking-widest text-[#5A7785] uppercase mb-2.5 font-medium">
                AVAILABLE VOLUME:
              </span>
              <div className="flex items-center gap-3">
                {selectedFragrance.sizes.map(sizeOption => (
                  <button
                    key={sizeOption.ml}
                    onClick={() => setSelectedSize(sizeOption.ml)}
                    className={`flex-1 py-2.5 px-4 border text-xs font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center justify-between ${
                      selectedSize === sizeOption.ml
                        ? 'border-[#0A2533] bg-[#0A2533] text-white font-medium shadow-sm'
                        : 'border-[#0A2533]/15 bg-white text-[#0A2533] hover:border-[#0A2533]/40'
                    }`}
                  >
                    <span>{sizeOption.ml} ML</span>
                    <span className="tabular-nums font-semibold">{formatPrice(sizeOption.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase CTA */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => onAddToCart(selectedFragrance, selectedSize)}
                className="flex-1 py-4 px-6 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-3 transition-colors duration-200 shadow-[0_10px_25px_rgba(10,37,51,0.15)] cursor-pointer"
              >
                <span>ADD TO BAG</span>
              </button>

              <Link
                to={`/product/${selectedFragrance.id}`}
                className="py-4 px-4 border border-[#0A2533]/20 hover:border-[#0A2533] text-[#0A2533] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer bg-white flex items-center gap-1"
                title="Full Laboratory Sheet"
              >
                <span>DOSSIER</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-[#5A7785]">
              <Check className="w-3.5 h-3.5 text-[#087A91]" />
              <span>Complimentary insured shipping & signature laboratory box</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

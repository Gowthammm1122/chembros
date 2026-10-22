import React, { useState } from 'react';
import { Fragrance, formatPrice } from '../data/fragrances';
import { PerfumeBottle } from './PerfumeBottle';
import { X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SpecimenModalProps {
  fragrance: Fragrance | null;
  onClose: () => void;
  onAddToCart: (fragrance: Fragrance, size: number) => void;
}

export const SpecimenModal: React.FC<SpecimenModalProps> = ({
  fragrance,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<number>(50);

  if (!fragrance) return null;

  const currentPrice = fragrance.sizes.find(s => s.ml === selectedSize)?.price || fragrance.price;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white border border-[#0A2533]/20 shadow-2xl text-[#0A2533] overflow-hidden my-auto z-10">
        
        {/* Top Laboratory Bar */}
        <div className="px-6 py-4 border-b border-[#0A2533]/10 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[#087A91] tracking-[0.25em] uppercase font-semibold">
              SPECIMEN DOSSIER // NO. {fragrance.formulaNo}
            </span>
            <span className="text-[#0A2533]/20">|</span>
            <span className="text-xs font-mono text-[#5A7785] uppercase hidden sm:inline">
              ISO-9001 CERTIFIED BATCH
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#5A7785] hover:text-[#0A2533] p-1 transition-colors cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Bottle Presentation (md:col-span-5) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#F2F7FA] via-white to-[#EFF5F8] border border-[#0A2533]/10 relative overflow-hidden">
            <PerfumeBottle
              fragrance={fragrance}
              size="lg"
              showPedestal={true}
              pedestalHeight={100}
              interactive={true}
            />

            {/* Subtle specimen stamp */}
            <div className="mt-6 text-center font-mono text-[10px] tracking-widest text-[#5A7785] uppercase">
              <span className="block text-[#087A91] font-semibold mb-0.5">
                FORMULATION NUMBER
              </span>
              <span className="font-display text-[#0A2533] text-lg font-semibold">
                CB-{fragrance.formulaNo}
              </span>
            </div>
          </div>

          {/* Right Column: Technical Spec & Add to Bag (md:col-span-7) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Family & Title */}
              <div className="text-xs font-mono tracking-widest text-[#087A91] uppercase mb-1 font-semibold">
                {fragrance.family}
              </div>
              <h2 className="font-display font-light text-3xl sm:text-4xl text-[#0A2533] tracking-tight">
                {fragrance.name}
              </h2>
              <p className="mt-2 text-sm text-[#5A7785] font-mono">
                {fragrance.subtitle}
              </p>

              {/* Character prose */}
              <p className="mt-4 text-sm text-[#4A6775] font-light leading-relaxed">
                {fragrance.description}
              </p>

              {/* Olfactory Pyramid Grid */}
              <div className="mt-6 pt-4 border-t border-[#0A2533]/10">
                <span className="text-[11px] font-mono tracking-widest text-[#5A7785] uppercase block mb-3 font-semibold">
                  OLFACTORY ARCHITECTURE:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-[#F6FAFC] border border-[#0A2533]/10">
                    <span className="text-[#087A91] block text-[10px] uppercase font-semibold">TOP ACCORDS</span>
                    <ul className="mt-1 space-y-0.5 text-[#0A2533] text-[11px]">
                      {fragrance.olfactoryPyramid.top.map(n => <li key={n}>• {n}</li>)}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-[#F6FAFC] border border-[#0A2533]/10">
                    <span className="text-[#087A91] block text-[10px] uppercase font-semibold">HEART FRACTION</span>
                    <ul className="mt-1 space-y-0.5 text-[#0A2533] text-[11px]">
                      {fragrance.olfactoryPyramid.heart.map(n => <li key={n}>• {n}</li>)}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-[#F6FAFC] border border-[#0A2533]/10">
                    <span className="text-[#087A91] block text-[10px] uppercase font-semibold">DRYDOWN BASE</span>
                    <ul className="mt-1 space-y-0.5 text-[#0A2533] text-[11px]">
                      {fragrance.olfactoryPyramid.base.map(n => <li key={n}>• {n}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chemical Lab Parameters */}
              <div className="mt-6 p-4 bg-[#F8FAFC] border border-[#0A2533]/10 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#5A7785]">Concentration:</span>
                  <span className="text-[#0A2533] font-semibold">{fragrance.labSpec.ratio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A7785]">Maceration Vault:</span>
                  <span className="text-[#0A2533]">{fragrance.labSpec.maceration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A7785]">Persistence Curve:</span>
                  <span className="text-[#087A91] font-semibold">{fragrance.labSpec.volatility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A7785]">Key Isolate:</span>
                  <span className="text-[#0A2533] truncate max-w-[200px]">{fragrance.labSpec.keyIsolate}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <span className="text-[11px] font-mono tracking-widest text-[#5A7785] uppercase block mb-2 font-medium">
                  SELECT VOLUME:
                </span>
                <div className="flex gap-3">
                  {fragrance.sizes.map(s => (
                    <button
                      key={s.ml}
                      onClick={() => setSelectedSize(s.ml)}
                      className={`flex-1 py-2 px-3 border text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center justify-between ${
                        selectedSize === s.ml
                          ? 'border-[#0A2533] bg-[#0A2533] text-white font-semibold'
                          : 'border-[#0A2533]/15 text-[#0A2533] bg-white hover:border-[#0A2533]/30'
                      }`}
                    >
                      <span>{s.ml} ML FLACON</span>
                      <span className="tabular-nums">{formatPrice(s.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="mt-8 pt-4 border-t border-[#0A2533]/10 flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToCart(fragrance, selectedSize);
                  onClose();
                }}
                className="flex-1 py-3.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-lg"
              >
                <span>ADD SPECIMEN TO BAG</span>
                <span className="tabular-nums font-semibold">({formatPrice(currentPrice)})</span>
                <ArrowRight className="w-4 h-4 text-[#48B8CE]" />
              </button>

              <Link
                to={`/product/${fragrance.id}`}
                onClick={onClose}
                className="px-4 py-3.5 border border-[#0A2533]/20 hover:border-[#0A2533] text-[#0A2533] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer bg-white flex items-center gap-1.5"
                title="Full Dedicated Page"
              >
                <span>DOSSIER</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BrandPhilosophyProps {
  onOpenStory: () => void;
}

export const BrandPhilosophy: React.FC<BrandPhilosophyProps> = ({ onOpenStory }) => {
  return (
    <section id="philosophy" className="relative bg-transparent py-32 text-[#0A2533] overflow-hidden border-b border-[#0A2533]/10">
      {/* Soft Lab Fog & Frost Sheen */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-white/70 blur-[100px] transform-gpu will-change-transform pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.3em] uppercase text-[#087A91] font-semibold mb-6">
          <span className="w-6 h-[1.5px] bg-[#087A91]" />
          <span>OUR PHILOSOPHY</span>
          <span className="w-6 h-[1.5px] bg-[#087A91]" />
        </div>

        {/* Substantial Headline */}
        <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl text-[#0A2533] tracking-tight leading-tight max-w-4xl mx-auto">
          Not made to blend in.
        </h2>

        {/* Body Copy */}
        <p className="mt-8 text-base sm:text-xl text-[#4A6775] font-light leading-relaxed max-w-2xl mx-auto">
          Fragrance is more than a finishing touch. It is a personal signature, an atmosphere and a memory in the making.
        </p>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={onOpenStory}
            className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-[0_15px_30px_rgba(10,37,51,0.12)] cursor-pointer"
          >
            <span>GET TO KNOW CHEM BROS</span>
            <ArrowRight className="w-4 h-4 text-[#48B8CE] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3 Core Tenets Strip */}
        <div className="mt-20 pt-10 border-t border-[#0A2533]/10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white border border-[#0A2533]/10 shadow-sm">
            <span className="text-[11px] font-mono text-[#087A91] tracking-widest block uppercase font-semibold mb-1">
              01 // FORMULATION
            </span>
            <h4 className="font-display font-semibold text-base text-[#0A2533]">High Concentration</h4>
            <p className="text-xs text-[#4A6775] mt-1.5 font-light leading-relaxed">
              25% to 30% pure perfume extract. Long-lasting skin intimacy without alcohol harshness.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#0A2533]/10 shadow-sm">
            <span className="text-[11px] font-mono text-[#087A91] tracking-widest block uppercase font-semibold mb-1">
              02 // TRANSPARENCY
            </span>
            <h4 className="font-display font-semibold text-base text-[#0A2533]">Pure Isolates</h4>
            <p className="text-xs text-[#4A6775] mt-1.5 font-light leading-relaxed">
              Bio-fermented synthetics paired with supercritical botanical extracts. Cruelty-free and IFRA compliant.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#0A2533]/10 shadow-sm">
            <span className="text-[11px] font-mono text-[#087A91] tracking-widest block uppercase font-semibold mb-1">
              03 // IDENTITY
            </span>
            <h4 className="font-display font-semibold text-base text-[#0A2533]">Gender Fluid</h4>
            <p className="text-xs text-[#4A6775] mt-1.5 font-light leading-relaxed">
              Formulated for olfactory resonance, never demographic labels. Worn purely by personal instinct.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

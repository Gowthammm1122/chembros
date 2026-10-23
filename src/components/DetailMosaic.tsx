import React from 'react';
import { FRAGRANCES, Fragrance } from '../data/fragrances';
import { PerfumeBottle } from './PerfumeBottle';
import { ChemBrosLogo } from './ChemBrosLogo';

interface DetailMosaicProps {
  onSelectFragrance: (fragrance: Fragrance) => void;
}

export const DetailMosaic: React.FC<DetailMosaicProps> = ({ onSelectFragrance }) => {
  return (
    <section className="relative bg-transparent py-24 border-b border-[#0A2533]/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Eyebrow */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#0A2533]/10 text-xs font-mono tracking-[0.25em] uppercase text-[#5A7785]">
          <span>EDITORIAL MOSAIC // VISUAL INTERLUDE</span>
          <span className="text-[#087A91] font-semibold">PARIS — TOKYO — NEW YORK</span>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Panel 1: Tall Close-up of Perfume Specimen on Left (md:col-span-5) */}
          <div className="md:col-span-5 relative min-h-[580px] p-8 border border-[#0A2533]/10 bg-gradient-to-b from-[#F5F9FA] via-white to-[#EFF5F8] flex flex-col justify-between overflow-hidden group shadow-[0_4px_24px_rgba(10,37,51,0.03)]">
            {/* Top Lab Header */}
            <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[#5A7785]">
              <span>SPECIMEN DETAIL</span>
              <span className="font-semibold text-[#087A91]">1:1 SCALE RATIO</span>
            </div>

            {/* Central Flacon Presentation */}
            <div 
              className="my-auto flex flex-col items-center justify-center cursor-pointer transition-transform duration-700 group-hover:scale-105"
              onClick={() => onSelectFragrance(FRAGRANCES[1])}
            >
              <PerfumeBottle
                fragrance={FRAGRANCES[1]}
                size="lg"
                showPedestal={true}
                pedestalHeight={90}
                interactive={true}
              />
            </div>

            {/* Bottom Caption */}
            <div className="pt-4 border-t border-[#0A2533]/10 flex items-center justify-between text-xs font-mono text-[#0A2533]">
              <span className="uppercase tracking-wider font-semibold">MOLECULE T // NIGHT TUBEROSE</span>
              <span className="text-[#087A91] font-semibold">50 ML EDP</span>
            </div>
          </div>

          {/* Right Column Container (md:col-span-7) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Panel 2: Wide Cyan-to-Deep Slate Typography Panel */}
            <div className="relative min-h-[260px] p-10 border border-[#087A91]/30 bg-gradient-to-br from-[#0A2533] via-[#0D364A] to-[#0A2533] flex flex-col justify-between overflow-hidden shadow-lg">
              {/* Subtle background molecular coordinates */}
              <div className="absolute right-4 top-4 text-[9px] font-mono text-white/50 tracking-widest">
                C16H28O • MOLECULAR PURITY 99.8%
              </div>

              <div>
                <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#48B8CE] block mb-3 font-semibold">
                  ART DIRECTION // AESTHETIC DIRECTIVE
                </span>
                <h3 className="font-display font-light text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">
                  SCIENCE IN FORM.<br />
                  <span className="font-normal text-[#E2EDF1]">
                    CHARACTER IN EVERY DROP.
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase text-white/80 pt-4 border-t border-white/15">
                <span>OLFACTORY SYNTHESIS</span>
                <span>•</span>
                <span>PHYSICAL SPECIMEN</span>
              </div>
            </div>

            {/* Split Bottom Subgrid: Panel 3 & Panel 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
              
              {/* Panel 3: Secondary Specimen & Frosted Packaging Silhouette */}
              <div 
                className="p-6 border border-[#0A2533]/10 bg-gradient-to-b from-white via-[#F5F9FA] to-[#EFF5F8] flex flex-col justify-between cursor-pointer group hover:border-[#087A91]/50 transition-colors shadow-sm"
                onClick={() => onSelectFragrance(FRAGRANCES[2])}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-[#5A7785]">
                  <span className="font-semibold text-[#087A91]">FORMULA 03</span>
                  <span className="text-[#0A2533] font-semibold">MOLECULE R</span>
                </div>

                <div className="py-6 flex justify-center">
                  <PerfumeBottle
                    fragrance={FRAGRANCES[2]}
                    size="sm"
                    showPedestal={false}
                    interactive={true}
                  />
                </div>

                <div className="text-[11px] font-mono text-[#4A6775] tracking-wider">
                  Tamil Nadu Red Champaca & Smoldering Saffron
                </div>
              </div>

              {/* Panel 4: Chem Bros Brand Logo Specimen Panel */}
              <div className="p-8 border border-[#0A2533]/10 bg-white flex flex-col items-center justify-between text-center relative overflow-hidden shadow-sm">
                {/* Micro corner indicators */}
                <div className="absolute top-3 left-3 text-[8px] font-mono text-[#087A91] font-semibold">04/04</div>
                <div className="absolute top-3 right-3 text-[8px] font-mono text-[#087A91] font-semibold">CB</div>

                {/* The User's Chem Bros Brand Logo Mark */}
                <div className="my-auto py-4">
                  <ChemBrosLogo
                    variant="black"
                    size="xl"
                    showTagline={true}
                    className="flex-col !gap-3 text-center items-center justify-center"
                  />
                </div>

                {/* Laboratory Subtitle */}
                <div className="pt-3 border-t border-[#0A2533]/10 w-full">
                  <p className="text-[10px] font-mono text-[#5A7785] tracking-[0.22em] uppercase">
                    LABORATORY OF OLFACTORY ART
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

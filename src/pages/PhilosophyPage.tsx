import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Microscope, Droplets, Compass } from 'lucide-react';
import { ConicalFlask } from '../components/ConicalFlask';

export const PhilosophyPage: React.FC = () => {
  return (
    <div className="pt-24 pb-24 bg-white text-[#0A2533]">
      {/* 1. Cinematic Narrative Header */}
      <section className="bg-[#03151D] text-white px-6 sm:px-12 pt-16 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[#087A91]/15 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.3em] uppercase text-[#48B8CE] mb-6 font-semibold">
            <span className="w-6 h-[1.5px] bg-[#48B8CE]" />
            <span>THE CHEM BROS MANIFESTO</span>
            <span className="w-6 h-[1.5px] bg-[#48B8CE]" />
          </div>

          <h1 className="font-display font-light text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Where molecular chemistry meets raw olfactory art.
          </h1>

          <p className="mt-8 text-base sm:text-xl text-[#9BB3C1] font-light leading-relaxed max-w-2xl mx-auto">
            Traditional perfumery often celebrates folklore while hiding ingredient compromise. We believe true luxury begins with surgical purity, high-concentration extraits, and radical transparency.
          </p>
        </div>
      </section>

      {/* 2. Three Pillars of Laboratory Chemistry */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 -mt-14 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-[#0A2533]/10 shadow-[0_12px_36px_rgba(10,37,51,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-sm bg-[#F2F7FA] border border-[#0A2533]/10 flex items-center justify-center text-[#087A91] mb-6 font-mono text-xs font-bold">
                01
              </div>
              <h3 className="font-display font-semibold text-xl text-[#0A2533] mb-3">
                Madurai Extraction Vaults
              </h3>
              <p className="text-sm text-[#4A6775] font-light leading-relaxed">
                Direct single-origin botanical partnerships in Tamil Nadu, India. Hand-harvested dawn jasmine sambac, wild night tuberose, and supercritical red champaca extractions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#0A2533]/10 text-[11px] font-mono text-[#087A91] font-semibold">
              ORIGIN // TAMIL NADU, INDIA
            </div>
          </div>

          <div className="p-8 bg-white border border-[#0A2533]/10 shadow-[0_12px_36px_rgba(10,37,51,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-sm bg-[#F2F7FA] border border-[#0A2533]/10 flex items-center justify-center text-[#087A91] mb-6 font-mono text-xs font-bold">
                02
              </div>
              <h3 className="font-display font-semibold text-xl text-[#0A2533] mb-3">
                Cryogenic Cold Fractionalization
              </h3>
              <p className="text-sm text-[#4A6775] font-light leading-relaxed">
                Heat destroys volatile olfactory nuances. We deploy cryogenic cold separation to retain intact cellular aroma profiles without cooking or oxidizing the delicate botanical extracts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#0A2533]/10 text-[11px] font-mono text-[#087A91] font-semibold">
              PRECISION // -20°C STABILIZATION
            </div>
          </div>

          <div className="p-8 bg-white border border-[#0A2533]/10 shadow-[0_12px_36px_rgba(10,37,51,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-sm bg-[#F2F7FA] border border-[#0A2533]/10 flex items-center justify-center text-[#087A91] mb-6 font-mono text-xs font-bold">
                03
              </div>
              <h3 className="font-display font-semibold text-xl text-[#0A2533] mb-3">
                Nitrogen-Purged Maceration
              </h3>
              <p className="text-sm text-[#4A6775] font-light leading-relaxed">
                Every batch rests for 75 to 100 days inside dark nitrogen-purged tanks. Oxygen is completely displaced to ensure rich molecular bonding without premature degradation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#0A2533]/10 text-[11px] font-mono text-[#087A91] font-semibold">
              VAULT DURATION // 90 DAYS AVG.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deep Dive In-Depth Narrative */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 py-20 lg:py-28">
        <div className="space-y-12">
          
          <div>
            <span className="text-xs font-mono tracking-[0.25em] text-[#087A91] uppercase font-semibold block mb-2">
              THE GENESIS STORY
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-[#0A2533] tracking-tight">
              Two formulation chemists who rejected standard industry dilution.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#4A6775] font-light leading-relaxed">
              CHEM BROS was founded by formulation chemists who spent years analyzing commercial luxury perfumes through gas chromatography and mass spectrometry. What we discovered was disheartening: prestigious designer fragrances diluted down to 8–12% concentration, heavily loaded with synthetic fillers, and sold at 2000% markups behind fairy-tale marketing.
            </p>
            <p className="mt-4 text-base sm:text-lg text-[#4A6775] font-light leading-relaxed">
              We decided to do the exact opposite. Build an independent formulation studio where the chemical formula itself is celebrated. Where pure extracted floral absolutes from Madurai are balanced with high-grade molecular isolates like Ambroxan, Benzyl Acetate, and Davanone at 26% to 30% pure extrait strength.
            </p>
          </div>

          <div className="p-8 border border-[#0A2533]/10 bg-[#F8FAFC]">
            <h3 className="font-display font-semibold text-xl text-[#0A2533] mb-4">
              Our Formulation Commitments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#244250]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#087A91]" />
                <span>100% IFRA 51st Amendment Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Microscope className="w-4 h-4 text-[#087A91]" />
                <span>Small Batch Gas Chromatography Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#087A91]" />
                <span>Zero Synthetic Coloring or Phthalates</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#087A91]" />
                <span>Cruelty-Free & Sustainably Distilled</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#0A2533]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-medium text-lg text-[#0A2533]">
                Ready to experience the chemistry on your skin?
              </h4>
              <p className="text-xs font-mono text-[#5A7785] mt-1">
                Explore the four signature formulations or sample the discovery kit.
              </p>
            </div>

            <Link
              to="/product/molecule-j"
              className="px-8 py-3.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <span>EXPLORE THE FORMULAS</span>
              <ArrowRight className="w-4 h-4 text-[#48B8CE]" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

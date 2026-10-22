import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Lock, FileText, Droplets, ArrowRight } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const initialTab = (type === 'privacy' || type === 'terms' || type === 'care') ? type : 'shipping';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  return (
    <div className="pt-24 pb-24 bg-white text-[#0A2533] min-h-screen">
      {/* 1. Header */}
      <section className="bg-[#03151D] text-white px-6 sm:px-12 pt-16 pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-[#48B8CE] mb-4 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#48B8CE]" />
            <span>CLIENT ASSURANCE // STANDARDS</span>
          </div>

          <h1 className="font-display font-light text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Policies & Laboratory Commitments
          </h1>

          <p className="mt-4 text-base text-[#9BB3C1] font-light leading-relaxed max-w-xl mx-auto">
            Transparent protocols governing insured cold-chain dispatch, formulation safety, and client data confidentiality.
          </p>
        </div>
      </section>

      {/* 2. Policy Tabs & Content */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 py-12">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#0A2533]/10 pb-3 mb-10 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'shipping'
                ? 'bg-[#0A2533] text-white font-semibold'
                : 'text-[#5A7785] hover:text-[#0A2533] hover:bg-[#F2F7FA]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping & Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-[#0A2533] text-white font-semibold'
                : 'text-[#5A7785] hover:text-[#0A2533] hover:bg-[#F2F7FA]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Confidentiality & Privacy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'bg-[#0A2533] text-white font-semibold'
                : 'text-[#5A7785] hover:text-[#0A2533] hover:bg-[#F2F7FA]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Formulation</span>
          </button>

          <button
            onClick={() => setActiveTab('care')}
            className={`px-4 py-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'care'
                ? 'bg-[#0A2533] text-white font-semibold'
                : 'text-[#5A7785] hover:text-[#0A2533] hover:bg-[#F2F7FA]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Flacon Preservation</span>
          </button>
        </div>

        {/* Tab 1: Shipping & Dispatch */}
        {activeTab === 'shipping' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display font-semibold text-2xl text-[#0A2533] mb-3">
                Insured Cold-Chain Dispatch
              </h2>
              <p className="text-sm text-[#4A6775] leading-relaxed font-light">
                All CHEM BROS flacons are cushioned inside shock-absorbent thermal barrier packaging and nitrogen sealed prior to departure from our Madurai formulation vaults.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC]">
                <span className="text-[#087A91] block uppercase font-semibold mb-1">DOMESTIC DELIVERY (INDIA)</span>
                <span className="text-[#5A7785]">Complimentary express air courier on all orders. Delivered within 2–3 business days.</span>
              </div>

              <div className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC]">
                <span className="text-[#087A91] block uppercase font-semibold mb-1">INTERNATIONAL DISPATCH</span>
                <span className="text-[#5A7785]">Available to 48 countries via DHL Express Dangerous Goods certified carriers (5–7 business days).</span>
              </div>
            </div>

            <div className="border-t border-[#0A2533]/10 pt-6">
              <h3 className="font-display font-medium text-lg text-[#0A2533] mb-2">
                14-Day Specimen Return Guarantee
              </h3>
              <p className="text-sm text-[#4A6775] leading-relaxed font-light">
                Each 50ml or 100ml flacon is accompanied by a complimentary matching 2ml sample vial. Test the scent using the sample vial first. If the formula does not align with your skin chemistry, you may return the unopened main flacon within 14 days for a 100% refund.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Confidentiality & Privacy */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display font-semibold text-2xl text-[#0A2533] mb-3">
                Client Data Confidentiality
              </h2>
              <p className="text-sm text-[#4A6775] leading-relaxed font-light">
                We collect only the essential personal information necessary to safely authorize allocations and execute high-security cold-chain delivery.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono text-[#4A6775] leading-relaxed">
              <div className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC]">
                <span className="text-[#0A2533] font-semibold block mb-1">01. ZERO THIRD-PARTY MONETIZATION</span>
                <span>We do not sell, rent, or syndicate client records, order histories, or olfactory preferences to advertising brokers.</span>
              </div>
              <div className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC]">
                <span className="text-[#0A2533] font-semibold block mb-1">02. 256-BIT ENCRYPTED ALLOCATION</span>
                <span>Financial transactions and payment credentials are processed exclusively via PCI-DSS Level 1 certified gateways.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Terms of Formulation */}
        {activeTab === 'terms' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display font-semibold text-2xl text-[#0A2533] mb-3">
                Laboratory Formulation Standards
              </h2>
              <p className="text-sm text-[#4A6775] leading-relaxed font-light">
                Every bottle produced by CHEM BROS adheres to strict analytical testing before release from quarantine.
              </p>
            </div>

            <div className="p-5 border border-[#0A2533]/10 bg-[#F8FAFC] space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#087A91] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>IFRA 51ST AMENDMENT COMPLIANCE</span>
              </div>
              <p className="text-[#5A7785] leading-relaxed">
                All raw botanical absolutes, supercritical extracts, and molecular isolates comply strictly with the safety guidelines set forth by the International Fragrance Association. Formulations are free from nitro musks, parabens, and restricted phthalates.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Flacon Preservation */}
        {activeTab === 'care' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display font-semibold text-2xl text-[#0A2533] mb-3">
                Preserving High-Extrait Molecular Perfumes
              </h2>
              <p className="text-sm text-[#4A6775] leading-relaxed font-light">
                Because CHEM BROS formulas contain 26% to 30% pure perfume extract with no artificial UV stabilizers, proper storage preserves their olfactory brilliance for decades.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC]">
                <span className="text-[#087A91] block uppercase font-semibold mb-1">LIGHT CONTROL</span>
                <span className="text-[#5A7785]">Avoid direct ultraviolet daylight. Store inside the heavy laboratory box or in a shaded drawer.</span>
              </div>
              <div className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC]">
                <span className="text-[#087A91] block uppercase font-semibold mb-1">TEMPERATURE</span>
                <span className="text-[#5A7785]">Maintain between 15°C and 22°C. Keep away from humid bathroom fluctuations or heating vents.</span>
              </div>
              <div className="p-4 border border-[#0A2533]/10 bg-[#F8FAFC]">
                <span className="text-[#087A91] block uppercase font-semibold mb-1">APPLICATION</span>
                <span className="text-[#5A7785]">Spray onto warm pulse points from 15cm. Never rub wrists together, which shears top molecules.</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA to collection */}
        <div className="mt-16 pt-8 border-t border-[#0A2533]/10 flex items-center justify-between">
          <Link
            to="/product/molecule-j"
            className="text-xs font-mono text-[#087A91] hover:text-[#0A2533] uppercase tracking-wider font-semibold flex items-center gap-2"
          >
            <span>EXPLORE LABORATORY COLLECTION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/concierge"
            className="text-xs font-mono text-[#5A7785] hover:text-[#0A2533] uppercase tracking-wider"
          >
            HAVE A QUESTION? CONTACT CONCIERGE →
          </Link>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { FRAGRANCES, Fragrance, formatPrice } from '../data/fragrances';
import { ProductCard } from '../components/ProductCard';
import { SignatureSpotlight } from '../components/SignatureSpotlight';
import { ConversionSection } from '../components/ConversionSection';
import { useCart } from '../context/CartContext';
import { SlidersHorizontal, Sparkles, Shield, Droplets, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CollectionPage: React.FC = () => {
  const { openSpecimenModal, addToCart } = useCart();

  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'formula' | 'price-asc' | 'price-desc'>('formula');

  const families = [
    { id: 'all', label: 'All Formulations' },
    { id: 'Luminous Solar Floral', label: 'Solar Floral' },
    { id: 'Creamy Carnal Floral', label: 'Carnal Floral' },
    { id: 'Exotic Spiced Amber Floral', label: 'Spiced Amber' },
    { id: 'Herbaceous Boozy Aromatic', label: 'Boozy Aromatic' },
  ];

  const filteredAndSortedFragrances = useMemo(() => {
    let list = [...FRAGRANCES];
    if (selectedFamily !== 'all') {
      list = list.filter(f => f.family.toLowerCase().includes(selectedFamily.toLowerCase()) || f.family === selectedFamily);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => a.formulaNo.localeCompare(b.formulaNo));
    }

    return list;
  }, [selectedFamily, sortBy]);

  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#03151D] via-[#F4F8FA] to-white min-h-screen text-[#0A2533]">
      {/* 1. Dark Luxury Header */}
      <section className="px-6 sm:px-12 pt-12 pb-20 text-[#DCE3E8] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#087A91]/15 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.3em] uppercase text-[#48B8CE] mb-4 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#48B8CE]" />
            <span>ARCHIVE CATALOG // 2026</span>
          </div>

          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-3xl">
            The Formulation Archive.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9BB3C1] font-light leading-relaxed max-w-2xl">
            Four molecular fragrances engineered from the botanical extracts of Tamil Nadu. Hand-compounded in limited 500-flacon batches at high extrait concentrations.
          </p>

          {/* Quick Lab Metric Badges */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-[#A9C2CE]">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#48B8CE]" />
              <span>26%–30% Extrait</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#48B8CE]" />
              <span>75–100 Day Aging</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#48B8CE]" />
              <span>IFRA 51st Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#48B8CE]" />
              <span>Cryogenic Extracts</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Filter & Sorting Bar */}
      <div className="sticky top-16 sm:top-18 z-30 bg-white/95 backdrop-blur-md border-y border-[#0A2533]/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Family Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono text-[#5A7785] uppercase tracking-wider hidden sm:inline mr-1">
              ACCORD:
            </span>
            {families.map(fam => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamily(fam.id)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedFamily === fam.id
                    ? 'bg-[#0A2533] text-white font-medium shadow-xs'
                    : 'bg-[#F2F7FA] text-[#4A6775] hover:bg-[#E5EFF4] hover:text-[#0A2533]'
                }`}
              >
                {fam.label}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-xs font-mono">
            <div className="flex items-center gap-2 text-[#5A7785]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>SORT:</span>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#F2F7FA] border border-[#0A2533]/15 text-[#0A2533] py-1.5 px-3 rounded-none font-mono text-xs focus:outline-none focus:border-[#087A91]"
            >
              <option value="formula">Formula Number (01 → 04)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Catalog Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredAndSortedFragrances.map((fragrance, idx) => (
            <ProductCard
              key={fragrance.id}
              fragrance={fragrance}
              index={idx}
              onSelect={openSpecimenModal}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* Discovery Sampler Callout Card */}
        <div className="mt-16 p-8 sm:p-10 border border-[#087A91]/20 bg-gradient-to-r from-[#03151D] via-[#073849] to-[#0A2533] text-white rounded-xs shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#48B8CE]/5 blur-3xl pointer-events-none" />

          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#48B8CE] mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ALL-IN-ONE SAMPLER</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-light text-white tracking-tight">
              The Complete Molecular Discovery Set
            </h3>
            <p className="mt-2 text-sm text-[#A9C2CE] font-light leading-relaxed">
              Experience all four formulas on your skin. Includes 4 × 5ml glass atomizers in a brushed aluminum specimen box. Comes with a ₹1,500 voucher toward your first full flacon.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 shrink-0">
            <div className="text-right sm:text-left">
              <span className="text-[10px] font-mono text-[#48B8CE] uppercase tracking-wider block">DISCOVERY PRICE</span>
              <span className="font-display text-2xl text-white font-semibold">₹1,800</span>
            </div>
            <button
              onClick={() => {
                addToCart(
                  {
                    ...FRAGRANCES[0],
                    id: 'discovery-set',
                    name: 'COMPLETE DISCOVERY SET (4 × 5ML)',
                    formulaNo: 'BOX',
                    price: 1800,
                    sizes: [{ ml: 20, price: 1800 }],
                  },
                  20
                );
              }}
              className="px-6 py-3.5 bg-[#48B8CE] hover:bg-white text-[#03151D] font-mono text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-md"
            >
              ACQUIRE SET
            </button>
          </div>
        </div>
      </section>

      {/* 4. Signature Spotlight Feature */}
      <SignatureSpotlight
        onSelectFragrance={openSpecimenModal}
        onAddToCart={addToCart}
      />

      {/* 5. Olfactory Matcher Questionnaire */}
      <ConversionSection
        onSelectFragrance={openSpecimenModal}
        onAddToCart={addToCart}
      />
    </div>
  );
};

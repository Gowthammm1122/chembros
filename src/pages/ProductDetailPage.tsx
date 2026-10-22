import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FRAGRANCES, Fragrance, formatPrice } from '../data/fragrances';
import { PerfumeBottle } from '../components/PerfumeBottle';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Droplet, 
  Clock, 
  Check, 
  Plus, 
  Minus,
  FlaskConical,
  Layers
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fragrance = FRAGRANCES.find(f => f.id === id) || FRAGRANCES[0];
  const [selectedSize, setSelectedSize] = useState<number>(fragrance.sizes[0]?.ml || 50);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Suggested complementary pairing formula (e.g. next formula in sequence)
  const currentIdx = FRAGRANCES.findIndex(f => f.id === fragrance.id);
  const pairingFragrance = FRAGRANCES[(currentIdx + 1) % FRAGRANCES.length];

  const currentPrice = fragrance.sizes.find(s => s.ml === selectedSize)?.price || fragrance.price;

  const handleAdd = () => {
    addToCart(fragrance, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="pt-24 pb-24 bg-white min-h-screen text-[#0A2533]">
      {/* 1. Breadcrumbs & Quick Back Nav */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 border-b border-[#0A2533]/10">
        <div className="flex items-center justify-between text-xs font-mono text-[#5A7785]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#0A2533] transition-colors">HOME</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-[#0A2533] transition-colors">COLLECTION</Link>
            <span>/</span>
            <span className="text-[#087A91] font-semibold">FORMULA {fragrance.formulaNo}</span>
          </div>

          <Link
            to="/collection"
            className="inline-flex items-center gap-1.5 text-xs text-[#087A91] hover:text-[#0A2533] transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ARCHIVE</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Product Showcase Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Visual Column (lg:col-span-6) */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="relative min-h-[500px] sm:min-h-[580px] p-8 sm:p-12 border border-[#0A2533]/10 bg-gradient-to-b from-[#F5F9FA] via-white to-[#EFF5F8] flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(10,37,51,0.04)]">
              {/* Header Badges */}
              <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[#5A7785] uppercase">
                <span className="text-[#087A91] font-semibold">SPECIMEN // {fragrance.formulaNo}</span>
                <span>ISO-9001 BATCH CERTIFIED</span>
              </div>

              {/* Central Flacon Presentation */}
              <div className="my-auto py-10 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-700">
                <PerfumeBottle
                  fragrance={fragrance}
                  size="lg"
                  showPedestal={true}
                  pedestalHeight={140}
                  interactive={true}
                />
              </div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-[#0A2533]/10 flex items-center justify-between text-xs font-mono text-[#5A7785]">
                <span>TAMIL NADU EXTRACTION</span>
                <span className="text-[#087A91] font-semibold">{selectedSize}ML EXTRAIT</span>
              </div>
            </div>

            {/* Quick Scent Accords Bar */}
            <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#0A2533]/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[#5A7785]">HERO ISOLATE:</span>
              <span className="text-[#0A2533] font-medium text-right truncate max-w-[280px]">
                {fragrance.labSpec.keyIsolate}
              </span>
            </div>
          </div>

          {/* Right Product Dossier & Order Actions (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Specimen Eyebrow */}
            <div className="flex items-center gap-2.5 text-xs font-mono tracking-[0.25em] uppercase text-[#087A91] font-semibold mb-2">
              <span>{fragrance.family}</span>
              <span>•</span>
              <span>FORMULA NO. {fragrance.formulaNo}</span>
            </div>

            {/* Fragrance Name */}
            <h1 className="font-display font-light text-4xl sm:text-5xl text-[#0A2533] tracking-tight leading-tight">
              {fragrance.name}
            </h1>

            {/* Subtitle */}
            <p className="mt-1 text-base font-mono text-[#5A7785] tracking-wider uppercase">
              {fragrance.subtitle}
            </p>

            {/* Price Display */}
            <div className="mt-6 flex items-baseline gap-4 pb-6 border-b border-[#0A2533]/10">
              <span className="font-display text-3xl sm:text-4xl text-[#0A2533] font-semibold tabular-nums">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-xs font-mono text-[#5A7785] uppercase">
                Includes all taxes & cold-chain insured courier
              </span>
            </div>

            {/* Description Prose */}
            <p className="mt-6 text-base text-[#4A6775] leading-relaxed font-light">
              {fragrance.description}
            </p>

            <blockquote className="mt-4 p-4 border-l-2 border-[#087A91] bg-[#F4F8FA] text-xs font-mono text-[#244250] leading-relaxed italic">
              "{fragrance.character}"
            </blockquote>

            {/* Volume / Size Switcher */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-[#5A7785] mb-3">
                <span className="font-medium">SELECT FLACON VOLUME:</span>
                <span className="text-[#087A91] font-semibold">{selectedSize} ML</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {fragrance.sizes.map(sizeOption => (
                  <button
                    key={sizeOption.ml}
                    onClick={() => setSelectedSize(sizeOption.ml)}
                    className={`p-4 border text-left text-xs font-mono transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedSize === sizeOption.ml
                        ? 'border-[#0A2533] bg-[#0A2533] text-white shadow-md'
                        : 'border-[#0A2533]/15 bg-white text-[#0A2533] hover:border-[#0A2533]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-sm">{sizeOption.ml} ML</span>
                      <span className="opacity-75">{sizeOption.ml === 50 ? 'STANDARD FLACON' : 'EXTENDED ALLOCATION'}</span>
                    </div>
                    <span className="font-display text-lg font-medium tabular-nums">
                      {formatPrice(sizeOption.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Bag CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-[#0A2533]/20 bg-white h-14 px-3 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono font-medium text-sm tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main CTA */}
              <button
                onClick={handleAdd}
                className="flex-1 h-14 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-3 transition-colors shadow-lg cursor-pointer"
              >
                <span>ACQUIRE SPECIMEN</span>
                <span className="tabular-nums font-bold">({formatPrice(currentPrice * quantity)})</span>
                <ArrowRight className="w-4 h-4 text-[#48B8CE]" />
              </button>
            </div>

            {addedNotice && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Formula {fragrance.formulaNo} added to your laboratory bag.</span>
              </div>
            )}

            {/* Confidence Assurances */}
            <div className="mt-8 pt-6 border-t border-[#0A2533]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#5A7785]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#087A91]" />
                <span>Complimentary 48-hr Dispatch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#087A91]" />
                <span>Pure Extrait Concentration</span>
              </div>
            </div>

            {/* Detailed Olfactory Pyramid Section */}
            <div className="mt-12 pt-8 border-t border-[#0A2533]/10">
              <h3 className="font-display font-semibold text-lg text-[#0A2533] mb-4 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#087A91]" />
                <span>Olfactory Architecture</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-4 bg-[#F8FAFC] border border-[#0A2533]/10">
                  <span className="text-[#087A91] block text-[10px] tracking-wider uppercase font-semibold mb-2">
                    01 // TOP NOTES (0–30 MIN)
                  </span>
                  <ul className="space-y-1.5 text-[#0A2533]">
                    {fragrance.olfactoryPyramid.top.map(note => (
                      <li key={note} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#087A91]" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#0A2533]/10">
                  <span className="text-[#087A91] block text-[10px] tracking-wider uppercase font-semibold mb-2">
                    02 // HEART (30 MIN–4 HRS)
                  </span>
                  <ul className="space-y-1.5 text-[#0A2533] font-medium">
                    {fragrance.olfactoryPyramid.heart.map(note => (
                      <li key={note} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#087A91]" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#0A2533]/10">
                  <span className="text-[#087A91] block text-[10px] tracking-wider uppercase font-semibold mb-2">
                    03 // DRYDOWN (4–14+ HRS)
                  </span>
                  <ul className="space-y-1.5 text-[#0A2533]">
                    {fragrance.olfactoryPyramid.base.map(note => (
                      <li key={note} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#087A91]" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Laboratory Specifications Table */}
            <div className="mt-10 pt-8 border-t border-[#0A2533]/10">
              <h3 className="font-display font-semibold text-lg text-[#0A2533] mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#087A91]" />
                <span>Laboratory Technical Specification</span>
              </h3>

              <div className="border border-[#0A2533]/10 bg-white font-mono text-xs divide-y divide-[#0A2533]/10">
                <div className="p-3.5 flex justify-between items-center bg-[#F8FAFC]">
                  <span className="text-[#5A7785]">Concentration Classification</span>
                  <span className="text-[#0A2533] font-semibold">{fragrance.labSpec.ratio}</span>
                </div>
                <div className="p-3.5 flex justify-between items-center">
                  <span className="text-[#5A7785]">Maceration Protocol</span>
                  <span className="text-[#0A2533]">{fragrance.labSpec.maceration}</span>
                </div>
                <div className="p-3.5 flex justify-between items-center bg-[#F8FAFC]">
                  <span className="text-[#5A7785]">Skin Volatility Curve</span>
                  <span className="text-[#087A91] font-semibold">{fragrance.labSpec.volatility}</span>
                </div>
                <div className="p-3.5 flex justify-between items-center">
                  <span className="text-[#5A7785]">Formulation pH Balance</span>
                  <span className="text-[#0A2533]">{fragrance.labSpec.ph}</span>
                </div>
                <div className="p-3.5 flex justify-between items-center bg-[#F8FAFC]">
                  <span className="text-[#5A7785]">Primary Key Chemical Isolate</span>
                  <span className="text-[#0A2533] font-medium text-right">{fragrance.labSpec.keyIsolate}</span>
                </div>
              </div>
            </div>

            {/* Recommended Layering Pairing */}
            <div className="mt-10 p-6 bg-gradient-to-r from-[#F4F8FA] to-white border border-[#087A91]/20">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#087A91] font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>RECOMMENDED LAYERED FORMULATION</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-semibold text-base text-[#0A2533]">
                    Pair with Formula {pairingFragrance.formulaNo} — {pairingFragrance.name}
                  </h4>
                  <p className="text-xs text-[#5A7785] font-light mt-0.5">
                    Creates an extraordinary dimensional contrast with {pairingFragrance.family.toLowerCase()} accents.
                  </p>
                </div>

                <Link
                  to={`/product/${pairingFragrance.id}`}
                  className="px-4 py-2 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-[11px] uppercase tracking-wider transition-colors shrink-0"
                >
                  EXPLORE PAIR
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

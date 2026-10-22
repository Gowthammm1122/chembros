import React, { useState, useId } from 'react';
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
  Star,
  ShoppingBag,
  Zap,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

// Initial curated reviews tailored to each fragrance formula
const INITIAL_REVIEWS: Record<string, Review[]> = {
  'molecule-j': [
    {
      id: 'rev-j-1',
      author: 'Ananya Ramachandran',
      location: 'Chennai, Tamil Nadu',
      rating: 5,
      date: 'October 12, 2026',
      title: 'Authentic Madurai Jasmine — unmatched quality',
      comment: 'The Jasmine Sambac in this bottle is completely authentic. It smells like fresh Madurai malli plucked at sunrise with a crisp green tea opening. It easily lasted 14 hours on my skin without becoming synthetic.',
      verified: true,
    },
    {
      id: 'rev-j-2',
      author: 'Vikramaditya Sengupta',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      date: 'September 28, 2026',
      title: 'Remarkable skin scent and longevity',
      comment: 'The ambroxan and bergamot drydown is subtle yet magnetic. People ask me what I am wearing everywhere I go. The packaging and bottle feel like high jewelry.',
      verified: true,
    },
    {
      id: 'rev-j-3',
      author: 'Dr. Priya Krishnan',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      date: 'September 14, 2026',
      title: 'Intimate, warm, and sophisticated',
      comment: 'Worth every rupee. Not overpowering like designer scents, but has incredible density and intimate projection. I am ordering the 100ml flacon today.',
      verified: true,
    },
  ],
  'molecule-t': [
    {
      id: 'rev-t-1',
      author: 'Rhea Kapoor',
      location: 'New Delhi',
      rating: 5,
      date: 'October 15, 2026',
      title: 'The best night tuberose I have ever experienced',
      comment: 'Creamy, carnal, and hypnotic. The coconut pulp and sandalwood balance the night-blooming tuberose so elegantly. True luxury extrait concentration.',
      verified: true,
    },
    {
      id: 'rev-t-2',
      author: 'Arjun Nambiar',
      location: 'Kochi, Kerala',
      rating: 5,
      date: 'October 02, 2026',
      title: 'Pure indulgence for evening wear',
      comment: 'Stays on clothing for days. Warm, seductive, and deeply comforting drydown. The bottle design is modern minimalism at its best.',
      verified: true,
    },
  ],
  'molecule-r': [
    {
      id: 'rev-r-1',
      author: 'Siddharth Iyer',
      location: 'Hyderabad, Telangana',
      rating: 5,
      date: 'October 18, 2026',
      title: 'Smoky, velvety dark rose masterpiece',
      comment: 'The black pepper and smoked patchouli elevate the Damask rose into something otherworldly. Mysterious and unisex. Lasts over 16 hours.',
      verified: true,
    },
    {
      id: 'rev-r-2',
      author: 'Meera Chawla',
      location: 'Pune, Maharashtra',
      rating: 5,
      date: 'September 20, 2026',
      title: 'Complex and deeply addictive',
      comment: 'Rich amber and frankincense with velvety crimson petals. My favorite evening fragrance of the year.',
      verified: true,
    },
  ],
  'molecule-x': [
    {
      id: 'rev-x-1',
      author: 'Kabir Malhotra',
      location: 'Gurugram, Haryana',
      rating: 5,
      date: 'October 10, 2026',
      title: 'Unbelievable herbaceous depth with aged rum',
      comment: 'Smells like an exclusive members club library with crushed sage, aged dark rum, and earthy vetiver. Incredibly unique and bold.',
      verified: true,
    },
    {
      id: 'rev-x-2',
      author: 'Nikhil Varma',
      location: 'Coimbatore, Tamil Nadu',
      rating: 5,
      date: 'September 30, 2026',
      title: 'Distinctive, commanding signature scent',
      comment: 'Extremely long lasting with sophisticated tobacco and cedarwood undertones. A true triumph of modern Indian perfumery.',
      verified: true,
    },
  ],
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  // Find target fragrance or fallback to Formula 01
  const fragrance: Fragrance = FRAGRANCES.find(f => f.id === id) || FRAGRANCES[0];
  const [selectedSize, setSelectedSize] = useState<number>(fragrance.sizes[0]?.ml || 50);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'specifications' | 'usage'>('notes');

  // Customer Reviews State
  const initialFragranceReviews = INITIAL_REVIEWS[fragrance.id] || INITIAL_REVIEWS['molecule-j'];
  const [reviews, setReviews] = useState<Review[]>(initialFragranceReviews);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerLocation, setReviewerLocation] = useState<string>('');
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Other products for "You May Also Like"
  const otherFragrances = FRAGRANCES.filter(f => f.id !== fragrance.id);

  // Calculated current price
  const currentPrice = fragrance.sizes.find(s => s.ml === selectedSize)?.price || fragrance.price;

  // Add to Bag handler
  const handleAddToCart = () => {
    addToCart(fragrance, selectedSize, quantity);
    setAddedNotice(true);
    openCart();
    setTimeout(() => setAddedNotice(false), 3500);
  };

  // Instant Buy Now handler (adds to cart & goes to checkout)
  const handleBuyNow = () => {
    addToCart(fragrance, selectedSize, quantity);
    navigate('/checkout');
  };

  // Submit Review handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      location: reviewerLocation.trim() || 'Verified Customer',
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle.trim() || 'Exceptional Fragrance',
      comment: reviewComment.trim(),
      verified: true,
    };

    setReviews(prev => [newRev, ...prev]);
    setReviewerName('');
    setReviewerLocation('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="pt-20 sm:pt-24 pb-24 bg-white min-h-screen text-[#0A2533] selection:bg-[#087A91]/20">
      
      {/* 1. Clean Breadcrumbs & Quick Sequence Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-[#0A2533]/[0.08] bg-[#FAFBFD]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex items-center justify-between text-xs font-mono text-[#5A7785]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#0A2533] transition-colors">HOME</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-[#0A2533] transition-colors">FRAGRANCES</Link>
            <span>/</span>
            <span className="text-[#087A91] font-semibold">FORMULA {fragrance.formulaNo}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/collection"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#5A7785] hover:text-[#0A2533] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ALL FRAGRANCES</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Main Product Hero Section (2-Column Desktop Grid) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Visual Flacon Stage (lg:col-span-6) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative min-h-[480px] sm:min-h-[560px] p-8 sm:p-12 border border-[#0A2533]/10 bg-gradient-to-b from-[#F7FAFC] via-[#F1F6F8] to-[#E9F1F5] flex flex-col justify-between overflow-hidden shadow-[0_12px_36px_rgba(10,37,51,0.04)] rounded-sm">
              
              {/* Formula No & Extrait Badge */}
              <div className="flex items-center justify-between font-mono text-[11px] tracking-widest uppercase text-[#5A7785]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#087A91]" />
                  <span className="text-[#087A91] font-semibold">FORMULA {fragrance.formulaNo}</span>
                </div>
                <span>EXTRAIT DE PARFUM</span>
              </div>

              {/* Central Flacon Display */}
              <div className="my-auto py-8 flex flex-col items-center justify-center transform hover:scale-[1.03] transition-transform duration-700 select-none">
                <PerfumeBottle
                  fragrance={fragrance}
                  size="lg"
                  showPedestal={true}
                  pedestalHeight={130}
                  interactive={true}
                />
              </div>

              {/* Quick Notes Strip under Bottle */}
              <div className="pt-4 border-t border-[#0A2533]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#5A7785]">
                <span>KEY ACCORDS:</span>
                <span className="text-[#0A2533] font-medium text-right">
                  {fragrance.olfactoryPyramid.heart.slice(0, 2).join(' • ')} • {fragrance.olfactoryPyramid.base[0]}
                </span>
              </div>
            </div>

            {/* Reassurance Guarantees */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-mono text-[#5A7785]">
              <div className="p-3 bg-[#FAFBFD] border border-[#0A2533]/[0.08]">
                <span className="block font-semibold text-[#0A2533]">100% PURE</span>
                <span className="text-[10px] opacity-75">Extrait Oil Base</span>
              </div>
              <div className="p-3 bg-[#FAFBFD] border border-[#0A2533]/[0.08]">
                <span className="block font-semibold text-[#0A2533]">12–14 HRS</span>
                <span className="text-[10px] opacity-75">Skin Persistence</span>
              </div>
              <div className="p-3 bg-[#FAFBFD] border border-[#0A2533]/[0.08]">
                <span className="block font-semibold text-[#0A2533]">DISPATCH</span>
                <span className="text-[10px] opacity-75">48-Hr Express</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Actions & Details (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Category / Formula Pill */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-[#087A91] font-semibold mb-2">
              <span>{fragrance.family}</span>
              <span>•</span>
              <span>NO. {fragrance.formulaNo}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-display font-light text-4xl sm:text-5xl text-[#0A2533] tracking-tight leading-tight">
              {fragrance.name}
            </h1>

            {/* Subtitle */}
            <p className="mt-1 text-base font-mono text-[#5A7785] tracking-wider uppercase">
              {fragrance.subtitle}
            </p>

            {/* Rating Stars Summary (Click to scroll to reviews) */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <a 
                href="#reviews"
                className="text-xs font-mono text-[#5A7785] hover:text-[#087A91] transition-colors underline underline-offset-4"
              >
                {averageRating} / 5.0 ({reviews.length} Verified Customer Reviews)
              </a>
            </div>

            {/* Pricing Card */}
            <div className="mt-6 p-4 sm:p-5 bg-[#FAFBFD] border border-[#0A2533]/[0.08] rounded-sm">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl sm:text-4xl text-[#0A2533] font-semibold tabular-nums">
                  {formatPrice(currentPrice)}
                </span>
                <span className="text-xs font-mono text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  IN STOCK • READY TO SHIP
                </span>
              </div>
              <p className="mt-1.5 text-xs font-mono text-[#5A7785]">
                MRP inclusive of all taxes (18% GST). Complimentary insured shipping throughout India.
              </p>
            </div>

            {/* Narrative Description (Clear, evocative, no AI slop) */}
            <p className="mt-6 text-base text-[#3A5563] leading-relaxed font-light">
              {fragrance.description}
            </p>

            <div className="mt-4 p-4 border-l-2 border-[#087A91] bg-[#F4F9FB] text-xs font-mono text-[#244250] leading-relaxed">
              <span className="font-semibold block text-[#087A91] uppercase tracking-wider mb-0.5">Scent Character</span>
              "{fragrance.character}"
            </div>

            {/* Flacon Size Selection (50ml / 100ml) */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-[#5A7785] mb-3">
                <span className="font-semibold text-[#0A2533]">SELECT FLACON SIZE:</span>
                <span className="text-[#087A91] font-semibold">{selectedSize} ML ALLOCATION</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {fragrance.sizes.map(sizeOption => {
                  const isSelected = selectedSize === sizeOption.ml;
                  return (
                    <button
                      key={sizeOption.ml}
                      type="button"
                      onClick={() => setSelectedSize(sizeOption.ml)}
                      className={`p-4 border text-left transition-all cursor-pointer rounded-sm flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-[#0A2533] bg-[#0A2533] text-white shadow-md'
                          : 'border-[#0A2533]/15 bg-white text-[#0A2533] hover:border-[#0A2533]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-sm font-bold tracking-wider">{sizeOption.ml} ML</span>
                        <span className={`text-[10px] font-mono uppercase ${isSelected ? 'text-[#48B8CE]' : 'text-[#5A7785]'}`}>
                          {sizeOption.ml === 50 ? 'Standard Flacon' : 'Extended Flacon'}
                        </span>
                      </div>
                      <span className="font-display text-lg font-medium tabular-nums">
                        {formatPrice(sizeOption.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector + CTAs (Add to Cart & Buy Now) */}
            <div className="mt-8 space-y-3.5">
              
              <div className="flex flex-col sm:flex-row items-stretch gap-3.5">
                {/* Quantity Box */}
                <div className="flex items-center border border-[#0A2533]/20 bg-white h-13 px-3 shrink-0 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono font-semibold text-sm tabular-nums text-[#0A2533]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary ADD TO CART Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-13 bg-[#0A2533] hover:bg-[#073849] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer rounded-sm active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                  <span className="tabular-nums font-bold">({formatPrice(currentPrice * quantity)})</span>
                </button>
              </div>

              {/* Secondary BUY NOW Button (Instant Checkout) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-13 bg-[#087A91] hover:bg-[#066579] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer rounded-sm active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>BUY NOW • INSTANT CHECKOUT</span>
              </button>
            </div>

            {/* Added Confirmation Banner */}
            {addedNotice && (
              <div className="mt-3.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center justify-between rounded-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Formula {fragrance.formulaNo} ({selectedSize}ml × {quantity}) added to bag.</span>
                </div>
                <button 
                  type="button"
                  onClick={() => openCart()}
                  className="underline font-semibold hover:text-emerald-950 cursor-pointer"
                >
                  View Bag
                </button>
              </div>
            )}

            {/* Trust Assurances */}
            <div className="mt-8 pt-6 border-t border-[#0A2533]/10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono text-[#5A7785]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#087A91]" />
                <span>Free delivery on orders over ₹5,000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#087A91]" />
                <span>Authentic 100% Extrait de Parfum</span>
              </div>
            </div>

            {/* Tabbed Product Details: Notes / Specs / How to Use */}
            <div className="mt-12 pt-8 border-t border-[#0A2533]/10">
              <div className="flex items-center gap-2 border-b border-[#0A2533]/10 text-xs font-mono uppercase tracking-wider mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 border-b-2 font-medium transition-colors cursor-pointer ${
                    activeTab === 'notes'
                      ? 'border-[#087A91] text-[#087A91] font-semibold'
                      : 'border-transparent text-[#5A7785] hover:text-[#0A2533]'
                  }`}
                >
                  Olfactory Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specifications')}
                  className={`pb-3 border-b-2 font-medium transition-colors cursor-pointer ${
                    activeTab === 'specifications'
                      ? 'border-[#087A91] text-[#087A91] font-semibold'
                      : 'border-transparent text-[#5A7785] hover:text-[#0A2533]'
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('usage')}
                  className={`pb-3 border-b-2 font-medium transition-colors cursor-pointer ${
                    activeTab === 'usage'
                      ? 'border-[#087A91] text-[#087A91] font-semibold'
                      : 'border-transparent text-[#5A7785] hover:text-[#0A2533]'
                  }`}
                >
                  How to Wear
                </button>
              </div>

              {/* Tab 1: Scent Architecture */}
              {activeTab === 'notes' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-4 bg-[#FAFBFD] border border-[#0A2533]/[0.08] rounded-sm">
                    <span className="text-[#087A91] block text-[10px] tracking-wider uppercase font-semibold mb-2">
                      01 // TOP NOTES (0–30 MIN)
                    </span>
                    <ul className="space-y-1.5 text-[#0A2533]">
                      {fragrance.olfactoryPyramid.top.map(note => (
                        <li key={note} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#087A91]" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAFBFD] border border-[#0A2533]/[0.08] rounded-sm">
                    <span className="text-[#087A91] block text-[10px] tracking-wider uppercase font-semibold mb-2">
                      02 // HEART (30 MIN–4 HRS)
                    </span>
                    <ul className="space-y-1.5 text-[#0A2533] font-medium">
                      {fragrance.olfactoryPyramid.heart.map(note => (
                        <li key={note} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#087A91]" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAFBFD] border border-[#0A2533]/[0.08] rounded-sm">
                    <span className="text-[#087A91] block text-[10px] tracking-wider uppercase font-semibold mb-2">
                      03 // DRYDOWN (4–14+ HRS)
                    </span>
                    <ul className="space-y-1.5 text-[#0A2533]">
                      {fragrance.olfactoryPyramid.base.map(note => (
                        <li key={note} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#087A91]" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Technical Specifications */}
              {activeTab === 'specifications' && (
                <div className="border border-[#0A2533]/10 bg-white font-mono text-xs divide-y divide-[#0A2533]/10 rounded-sm">
                  <div className="p-3.5 flex justify-between items-center bg-[#FAFBFD]">
                    <span className="text-[#5A7785]">Concentration</span>
                    <span className="text-[#0A2533] font-semibold">{fragrance.labSpec.ratio}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-[#5A7785]">Maceration Protocol</span>
                    <span className="text-[#0A2533]">{fragrance.labSpec.maceration}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center bg-[#FAFBFD]">
                    <span className="text-[#5A7785]">Skin Longevity</span>
                    <span className="text-[#087A91] font-semibold">{fragrance.labSpec.volatility}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-[#5A7785]">Formulation pH</span>
                    <span className="text-[#0A2533]">{fragrance.labSpec.ph}</span>
                  </div>
                  <div className="p-3.5 flex justify-between items-center bg-[#FAFBFD]">
                    <span className="text-[#5A7785]">Origin</span>
                    <span className="text-[#0A2533] font-medium">Extracted & Hand-Compounded in Tamil Nadu</span>
                  </div>
                </div>
              )}

              {/* Tab 3: How to Wear */}
              {activeTab === 'usage' && (
                <div className="p-5 bg-[#FAFBFD] border border-[#0A2533]/[0.08] text-xs font-mono text-[#3A5563] space-y-3 leading-relaxed rounded-sm">
                  <p>
                    <strong className="text-[#0A2533]">1. Application Pulse Points:</strong> Spray directly onto the base of the throat, wrists, and collarbones. Because Chem Bros uses high extrait concentrations, 2 to 3 sprays are sufficient for day-long presence.
                  </p>
                  <p>
                    <strong className="text-[#0A2533]">2. The Golden Rule:</strong> Never rub the wrists together after spraying; friction crushes the delicate molecular top notes (bergamot, green tea, and floral petals) before they can unfold organically.
                  </p>
                  <p>
                    <strong className="text-[#0A2533]">3. Storage:</strong> Store in a cool, shaded environment away from direct sunlight and humidity to preserve natural absolute clarity.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 3. Customer Reviews Section (Crucial Requirement) */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-[#0A2533]/10">
        
        {/* Reviews Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#0A2533]/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#087A91] uppercase mb-1 font-semibold">
              <span className="w-3 h-[1px] bg-[#087A91]" />
              <span>VERIFIED BUYERS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#0A2533] tracking-tight">
              Customer Reviews
            </h2>
          </div>

          {/* Overall Rating Score & Add Review Trigger */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-[#0A2533]/10">
              <span className="font-display text-4xl text-[#0A2533] font-semibold">{averageRating}</span>
              <div>
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#5A7785]">Based on {reviews.length} reviews</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-sm flex items-center gap-2"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>{showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}</span>
            </button>
          </div>
        </div>

        {/* Success Banner after submitting review */}
        {reviewSubmitted && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2.5 rounded-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your verified review has been submitted and posted to the community.</span>
          </div>
        )}

        {/* Interactive Review Form */}
        {showReviewForm && (
          <form 
            onSubmit={handleSubmitReview}
            className="mt-8 p-6 sm:p-8 bg-[#FAFBFD] border border-[#087A91]/30 rounded-sm shadow-sm animate-in fade-in"
          >
            <h3 className="font-display text-xl font-medium text-[#0A2533] mb-4">
              Write a Review for {fragrance.name}
            </h3>

            {/* Rating Stars Picker */}
            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-2">
                Your Overall Rating *
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= reviewRating 
                          ? 'fill-amber-400 stroke-amber-400' 
                          : 'stroke-[#CBD5E1] fill-transparent'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-mono text-[#5A7785] font-semibold">
                  {reviewRating} out of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5">
                  City / State (Optional)
                </label>
                <input
                  type="text"
                  value={reviewerLocation}
                  onChange={e => setReviewerLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={e => setReviewTitle(e.target.value)}
                placeholder="e.g. Magnificent floral depth and persistence"
                className="w-full px-3.5 py-2.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5">
                Detailed Experience *
              </label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your thoughts on the scent evolution, skin longevity, projection, and occasion..."
                className="w-full p-3.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-sm resize-y"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-[#0A2533]/20 text-xs font-mono uppercase tracking-wider text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#087A91] hover:bg-[#073849] text-white text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer rounded-sm"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="mt-8 space-y-6">
          {reviews.map(review => (
            <div 
              key={review.id}
              className="p-6 bg-[#FAFBFD] border border-[#0A2533]/[0.08] rounded-sm hover:border-[#087A91]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-display font-semibold text-base text-[#0A2533]">
                    {review.title}
                  </h4>
                </div>

                <span className="text-[11px] font-mono text-[#5A7785]">
                  {review.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-light text-[#3A5563] leading-relaxed mb-4">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-[#5A7785]">
                <span className="font-semibold text-[#0A2533]">{review.author}</span>
                <span>•</span>
                <span>{review.location}</span>
                {review.verified && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-[#087A91] font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 4. "Explore Other Fragrances" / You May Also Like (Crucial Requirement) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-[#0A2533]/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#0A2533]/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#087A91] uppercase mb-1 font-semibold">
              <span className="w-3 h-[1px] bg-[#087A91]" />
              <span>THE ATELIER COLLECTION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[#0A2533] tracking-tight">
              Explore Other Fragrances
            </h2>
          </div>

          <Link
            to="/collection"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#087A91] hover:text-[#0A2533] transition-colors uppercase tracking-wider font-semibold"
          >
            <span>View All Formulas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Card Grid for the other formulas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {otherFragrances.map(other => (
            <div
              key={other.id}
              className="group border border-[#0A2533]/10 hover:border-[#087A91]/40 bg-white rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Card Visual Stage */}
              <Link 
                to={`/product/${other.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="relative p-6 sm:p-8 bg-gradient-to-b from-[#FAFBFD] via-[#F4F8FA] to-[#EBF2F6] flex flex-col items-center justify-center cursor-pointer border-b border-[#0A2533]/10"
              >
                <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest text-[#087A91] font-semibold uppercase">
                  FORMULA {other.formulaNo}
                </div>

                <div className="py-4 transform group-hover:scale-105 transition-transform duration-500">
                  <PerfumeBottle
                    fragrance={other}
                    size="md"
                    showPedestal={true}
                    pedestalHeight={70}
                    interactive={false}
                  />
                </div>

                <div className="mt-2 text-[10px] font-mono tracking-wider uppercase text-[#5A7785]">
                  {other.family}
                </div>
              </Link>

              {/* Card Meta & Actions */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                <div>
                  <Link
                    to={`/product/${other.id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="font-display font-semibold text-lg text-[#0A2533] group-hover:text-[#087A91] transition-colors block"
                  >
                    {other.name}
                  </Link>
                  <p className="mt-1 text-xs text-[#5A7785] font-light line-clamp-2">
                    {other.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#0A2533]/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-[#5A7785]">FROM (50ML)</span>
                    <span className="font-display text-base font-semibold text-[#0A2533] tabular-nums">
                      {formatPrice(other.price)}
                    </span>
                  </div>

                  <Link
                    to={`/product/${other.id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-3.5 py-1.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-medium"
                  >
                    VIEW
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

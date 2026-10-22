import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ALL_PRODUCTS, FRAGRANCES, Fragrance, formatPrice } from '../data/fragrances';
import { PerfumeBottle } from '../components/PerfumeBottle';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  Clock,
  Droplets
} from 'lucide-react';
import { LiquidChromeButton } from '../components/LiquidChromeButton';

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

const REVIEWS_DATA: Record<string, Review[]> = {
  'molecule-j': [
    {
      id: 'rev-j-1',
      author: 'Ananya Ramachandran',
      location: 'Chennai, Tamil Nadu',
      rating: 5,
      date: 'October 12, 2026',
      title: 'Authentic Madurai Jasmine — unmatched quality',
      comment: 'The Jasmine Sambac in this bottle is completely authentic. It smells like fresh Madurai malli plucked at sunrise with a crisp green bite. It easily lasts 14 hours on my skin without becoming synthetic.',
      verified: true,
    },
    {
      id: 'rev-j-2',
      author: 'Vikramaditya S.',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      date: 'September 28, 2026',
      title: 'Remarkable skin scent and longevity',
      comment: 'The sandalwood and saffron drydown is subtle yet magnetic. People ask me what I am wearing everywhere I go. The flacon feels like high jewelry.',
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
      comment: 'Creamy, carnal, and hypnotic. The whiskey and neroli balance the night-blooming tuberose so elegantly. True luxury extrait concentration.',
      verified: true,
    },
    {
      id: 'rev-t-2',
      author: 'Arjun Nambiar',
      location: 'Kochi, Kerala',
      rating: 5,
      date: 'October 02, 2026',
      title: 'Pure indulgence for evening wear',
      comment: 'Stays on clothing for days. Warm, seductive, and deeply comforting drydown. Beautiful minimalist bottle.',
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
      title: 'Smoky, velvety dark rose and champaca masterpiece',
      comment: 'The cherry blossom and red champaca ignite into dark vanilla and oud. Mysterious and unisex. Lasts over 16 hours.',
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
      comment: 'Smells like an exclusive library with wild davana, dark aged rum, and earthy vetiver. Incredibly unique and bold.',
      verified: true,
    },
  ],
  'discovery-archive': [
    {
      id: 'rev-da-1',
      author: 'Tanvi Mehra',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      date: 'October 19, 2026',
      title: 'The perfect way to discover the collection',
      comment: 'Every miniature is generous at 3ml and comes in a luxurious presentation coffret. Molecule J and Molecule T are my absolute favorites.',
      verified: true,
    },
  ],
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  // Find target product across all products (or default to Molecule J)
  const fragrance: Fragrance = ALL_PRODUCTS.find(f => f.id === id) || FRAGRANCES[0];
  const [selectedSize, setSelectedSize] = useState<number>(fragrance.sizes[0]?.ml || 50);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'evolution' | 'story'>('notes');

  // Sync size when fragrance changes
  useEffect(() => {
    setSelectedSize(fragrance.sizes[0]?.ml || 50);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fragrance.id]);

  // Customer Reviews State
  const initialReviews = REVIEWS_DATA[fragrance.id] || REVIEWS_DATA['molecule-j'];
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerLocation, setReviewerLocation] = useState<string>('');
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Other products for "The Collection" bottom section
  const otherFragrances = ALL_PRODUCTS.filter(f => f.id !== fragrance.id);

  // Price for selected size
  const currentPrice = fragrance.sizes.find(s => s.ml === selectedSize)?.price || fragrance.price;

  // Add to Bag
  const handleAddToCart = () => {
    addToCart(fragrance, selectedSize, quantity);
    setAddedNotice(true);
    openCart();
    setTimeout(() => setAddedNotice(false), 3500);
  };

  // Buy Now (Instant Checkout)
  const handleBuyNow = () => {
    addToCart(fragrance, selectedSize, quantity);
    navigate('/checkout');
  };

  // Submit Review
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
    <div className="pt-20 sm:pt-24 pb-24 bg-[#03151D] min-h-screen text-[#DCE3E8] selection:bg-[#48B8CE]/30 selection:text-white">
      
      {/* 1. Sleek Atmospheric Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-white/10 bg-[#03151D]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex items-center justify-between text-xs font-mono text-[#A9C2CE]">
          <div className="flex items-center gap-2.5 tracking-wider uppercase">
            <Link to="/" className="hover:text-white transition-colors">HOME</Link>
            <span className="text-white/30">/</span>
            <Link to="/products" className="hover:text-white transition-colors">ALL FRAGRANCES</Link>
            <span className="text-white/30">/</span>
            <span className="text-[#48B8CE] font-semibold">{fragrance.name.toUpperCase()}</span>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs text-[#A9C2CE] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BACK TO ALL FRAGRANCES</span>
          </Link>
        </div>
      </nav>

      {/* 2. Main Product Showcase Hero Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Visual Stage (lg:col-span-6) — Continuous bg1.jpeg Atmospheric Stage */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div
              className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] border border-white/10 rounded-sm overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: "url('/bg/bg1.jpeg')" }}
            >
              {/* Luminous atmospheric overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

              {/* Ambient radial lighting behind flacon */}
              <div className="absolute w-80 h-80 rounded-full bg-[#48B8CE]/15 blur-3xl pointer-events-none" />

              {/* Fragrance Presentation Flacon */}
              <div className="relative z-10 py-10 flex flex-col items-center justify-center select-none transform hover:scale-105 transition-transform duration-700">
                {fragrance.id === 'discovery-archive' ? (
                  <div className="flex flex-col items-center">
                    <img
                      src="/images/discovery-archive-bottle.png"
                      alt="The Discovery Archive"
                      className="w-auto h-[340px] sm:h-[400px] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)]"
                    />
                    <div className="w-64 h-3 bg-gradient-to-r from-transparent via-black/80 to-transparent blur-sm mt-3" />
                  </div>
                ) : (
                  <PerfumeBottle
                    fragrance={fragrance}
                    size="lg"
                    showPedestal={true}
                    pedestalHeight={140}
                    interactive={true}
                  />
                )}
              </div>

              {/* Specimen Badge at Bottom of Visual Stage */}
              <div className="absolute bottom-4 inset-x-6 z-10 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border-t border-white/10 pt-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#48B8CE] animate-pulse" />
                  <span>25% EXTRAIT DE PARFUM</span>
                </div>
                <span>MADURAI, TN</span>
              </div>
            </div>
          </div>

          {/* Right Product Dossier (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Category Eyebrow */}
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] text-[#48B8CE] uppercase font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#48B8CE]" />
              <span>{fragrance.ingredientTitle || fragrance.family.toUpperCase()}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-display font-light text-4xl sm:text-5xl text-white tracking-tight leading-tight">
              {fragrance.name}
            </h1>

            {/* Subtitle / Poetic Tagline */}
            {fragrance.tagline && (
              <p className="mt-2 text-base sm:text-lg font-serif italic text-[#A9C2CE]/90">
                {fragrance.tagline}
              </p>
            )}

            {/* Price & Taxes */}
            <div className="mt-6 flex items-baseline gap-3 pb-6 border-b border-white/10">
              <span className="font-display text-3xl sm:text-4xl text-white font-medium tabular-nums">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-xs font-mono text-[#A9C2CE] uppercase tracking-wider">
                INCL. ALL TAXES · FREE SHIPPING
              </span>
            </div>

            {/* Narrative Prose */}
            <div className="mt-6 text-sm sm:text-base text-[#DCE3E8]/85 leading-relaxed font-light">
              <p>{fragrance.description}</p>
            </div>

            {/* Flacon Size Switcher (if product has 50ml / 100ml options) */}
            {fragrance.sizes.length > 1 && (
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-[#A9C2CE] mb-2.5">
                  <span>SELECT VOLUME</span>
                  <span className="text-[#48B8CE] font-semibold">{selectedSize} ML</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {fragrance.sizes.map(s => (
                    <button
                      key={s.ml}
                      type="button"
                      onClick={() => setSelectedSize(s.ml)}
                      className={`p-3.5 border text-left font-mono transition-all cursor-pointer rounded-xs flex items-center justify-between ${
                        selectedSize === s.ml
                          ? 'border-[#48B8CE] bg-[#48B8CE]/15 text-white shadow-xs'
                          : 'border-white/15 bg-white/5 text-[#A9C2CE] hover:border-white/40'
                      }`}
                    >
                      <span className="text-xs font-semibold">{s.ml} ML</span>
                      <span className={`text-xs font-medium ${selectedSize === s.ml ? 'text-white' : 'text-[#48B8CE]'}`}>
                        {formatPrice(s.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Tabbed Specs (Notes / Evolution / Story) */}
            <div className="mt-8 border border-white/10 rounded-sm bg-white/5 backdrop-blur-md overflow-hidden">
              <div className="flex border-b border-white/10 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                    activeTab === 'notes' ? 'text-white bg-white/10 font-semibold border-b-2 border-[#48B8CE]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  NOTE PYRAMID
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('evolution')}
                  className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                    activeTab === 'evolution' ? 'text-white bg-white/10 font-semibold border-b-2 border-[#48B8CE]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  SKIN TIMELINE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('story')}
                  className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                    activeTab === 'story' ? 'text-white bg-white/10 font-semibold border-b-2 border-[#48B8CE]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  LAB SPEC
                </button>
              </div>

              <div className="p-5">
                {activeTab === 'notes' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-12 gap-2 py-2 border-b border-white/10">
                      <span className="col-span-3 text-[#48B8CE] tracking-wider uppercase font-semibold">
                        TOP NOTES
                      </span>
                      <span className="col-span-9 text-white font-light">
                        {fragrance.olfactoryPyramid.top.join(' · ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-2 py-2 border-b border-white/10">
                      <span className="col-span-3 text-[#48B8CE] tracking-wider uppercase font-semibold">
                        HEART
                      </span>
                      <span className="col-span-9 text-white font-light">
                        {fragrance.olfactoryPyramid.heart.join(' · ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-2 py-2">
                      <span className="col-span-3 text-[#48B8CE] tracking-wider uppercase font-semibold">
                        BASE NOTES
                      </span>
                      <span className="col-span-9 text-white font-light">
                        {fragrance.olfactoryPyramid.base.join(' · ')}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'evolution' && (
                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex items-start gap-3 py-1.5 border-b border-white/10">
                      <Clock className="w-4 h-4 text-[#48B8CE] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-semibold uppercase">00:00 — THE OPENING</div>
                        <div className="text-white/70 font-light mt-0.5">Crisp, electric burst of fresh green botanical energy.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-1.5 border-b border-white/10">
                      <Clock className="w-4 h-4 text-[#48B8CE] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-semibold uppercase">02:00 — THE BLOOM</div>
                        <div className="text-white/70 font-light mt-0.5">Intoxicating floral core radiates with skin temperature.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-1.5">
                      <Clock className="w-4 h-4 text-[#48B8CE] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-semibold uppercase">08:00+ — THE SANCTUARY</div>
                        <div className="text-white/70 font-light mt-0.5">Warm amber, sandalwood, and musk settle for all-day persistence.</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'story' && (
                  <div className="space-y-2 text-xs font-mono text-white/80">
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-[#A9C2CE]">CONCENTRATION</span>
                      <span className="text-white">{fragrance.labSpec.ratio}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-[#A9C2CE]">MACERATION</span>
                      <span className="text-white">{fragrance.labSpec.maceration}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/10">
                      <span className="text-[#A9C2CE]">VOLATILITY</span>
                      <span className="text-white">{fragrance.labSpec.volatility}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#A9C2CE]">KEY ISOLATE</span>
                      <span className="text-white">{fragrance.labSpec.keyIsolate}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Zone: Quantity + Primary Liquid Chrome Button + Instant Buy Now */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-white/20 bg-white/5 h-13 px-2 rounded-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-white/60 hover:text-white cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-semibold text-sm tabular-nums text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-white/60 hover:text-white cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Liquid Chrome ADD TO BAG Button */}
                <div className="flex-1 flex items-center">
                  <LiquidChromeButton
                    label={`ADD TO BAG · ${formatPrice(currentPrice * quantity)}`}
                    size={0.25}
                    onClick={handleAddToCart}
                    aria-label={`Add ${fragrance.name} to cart`}
                  />
                </div>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 border border-white/20 hover:border-[#48B8CE] text-white hover:text-[#48B8CE] text-xs font-mono tracking-[0.2em] uppercase transition-all bg-white/5 hover:bg-white/10 cursor-pointer rounded-xs flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-[#48B8CE]" />
                <span>BUY NOW · INSTANT CHECKOUT</span>
              </button>
            </div>

            {/* Added Notification Toast */}
            {addedNotice && (
              <div className="mt-4 p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between rounded-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{fragrance.name} added to your bag.</span>
                </div>
                <button 
                  type="button"
                  onClick={() => openCart()}
                  className="underline font-semibold text-white hover:text-emerald-300 cursor-pointer"
                >
                  View Bag
                </button>
              </div>
            )}

            {/* Trust Assurances */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2 text-xs font-mono text-[#A9C2CE]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#48B8CE]" />
                <span>Authentic molecular extrait • Hand-poured in Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#48B8CE]" />
                <span>Complimentary express delivery across India</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Customer Reviews Section in Signature Dark Luxury Theme */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#48B8CE] uppercase mb-1 font-semibold">
              <span className="w-3 h-[1px] bg-[#48B8CE]" />
              <span>COMMUNITY IMPRESSIONS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight">
              Customer Reviews
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3 pr-5 border-r border-white/10">
              <span className="font-display text-4xl text-white font-medium">{averageRating}</span>
              <div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#A9C2CE]">Based on {reviews.length} reviews</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer rounded-xs"
            >
              {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
            </button>
          </div>
        </div>

        {/* Review Submitted Notice */}
        {reviewSubmitted && (
          <div className="mt-6 p-4 bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2.5 rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you! Your verified review has been posted.</span>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <form 
            onSubmit={handleSubmitReview}
            className="mt-8 p-6 sm:p-8 bg-white/5 border border-white/15 rounded-sm backdrop-blur-md animate-in fade-in"
          >
            <h3 className="font-display text-xl text-white mb-4">
              Write a Review for {fragrance.name}
            </h3>

            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A9C2CE] mb-2 font-medium">
                Rating *
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
                          : 'stroke-white/30 fill-transparent'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A9C2CE] mb-1.5 font-medium">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  placeholder="e.g. Priya S."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/20 text-xs font-mono text-white focus:border-[#48B8CE] outline-hidden rounded-xs placeholder-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A9C2CE] mb-1.5 font-medium">
                  City / State (Optional)
                </label>
                <input
                  type="text"
                  value={reviewerLocation}
                  onChange={e => setReviewerLocation(e.target.value)}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/20 text-xs font-mono text-white focus:border-[#48B8CE] outline-hidden rounded-xs placeholder-white/30"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A9C2CE] mb-1.5 font-medium">
                Headline *
              </label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={e => setReviewTitle(e.target.value)}
                placeholder="e.g. Scent evolution is intoxicating"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/20 text-xs font-mono text-white focus:border-[#48B8CE] outline-hidden rounded-xs placeholder-white/30"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A9C2CE] mb-1.5 font-medium">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience on skin longevity, scent notes, and projection..."
                className="w-full p-3.5 bg-white/5 border border-white/20 text-xs font-mono text-white focus:border-[#48B8CE] outline-hidden rounded-xs resize-y placeholder-white/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-white/20 text-xs font-mono uppercase tracking-wider text-[#A9C2CE] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#087A91] hover:bg-[#48B8CE] text-white text-xs font-mono uppercase tracking-wider font-bold cursor-pointer rounded-xs transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="mt-8 space-y-4">
          {reviews.map(review => (
            <div 
              key={review.id}
              className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-white/25 transition-colors shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-display font-medium text-base text-white">
                    {review.title}
                  </h4>
                </div>

                <span className="text-[11px] font-mono text-[#A9C2CE]">
                  {review.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-light text-[#DCE3E8]/85 leading-relaxed mb-3">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-[#A9C2CE]">
                <span className="font-semibold text-white">{review.author}</span>
                <span>•</span>
                <span>{review.location}</span>
                {review.verified && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-[#48B8CE] font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#48B8CE]" />
                      <span>Verified Buyer</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. "THE MOLECULE SERIES" Section — Uses the Redesigned Minimal ProductCard */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-white/10">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#48B8CE] uppercase mb-1 font-semibold">
              <span className="w-3 h-[1px] bg-[#48B8CE]" />
              <span>THE COLLECTION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-white tracking-tight">
              Other Formulations
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white hover:text-[#48B8CE] transition-colors uppercase tracking-wider font-semibold border border-white/20 hover:border-[#48B8CE] px-3.5 py-1.5 bg-white/5"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid of Redesigned ProductCards with Continuous bg1.jpeg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherFragrances.slice(0, 4).map((prod, idx) => (
            <ProductCard
              key={prod.id}
              fragrance={prod}
              index={idx}
              onSelect={(p) => navigate(`/product/${p.id}`)}
              onAddToCart={(p, size) => {
                addToCart(p, size, 1);
                openCart();
              }}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

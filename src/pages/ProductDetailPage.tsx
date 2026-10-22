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
  Star, 
  Plus, 
  Minus, 
  Check, 
  ShoppingBag, 
  Zap, 
  CheckCircle2, 
  Maximize2,
  Sparkles,
  RotateCcw
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

  // Find target fragrance or default to Molecule J
  const fragrance: Fragrance = FRAGRANCES.find(f => f.id === id) || FRAGRANCES[0];
  const [selectedSize, setSelectedSize] = useState<number>(fragrance.sizes[0]?.ml || 50);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'photo' | 'bottle'>('photo');

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

  // Other products for "The Molecule Series" section
  const otherFragrances = FRAGRANCES.filter(f => f.id !== fragrance.id);

  // Price for the selected size
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
    <div className="pt-20 sm:pt-24 pb-24 bg-[#0A0D10] min-h-screen text-[#E6ECF0] selection:bg-[#C5A059]/30">
      
      {/* 1. Subtle Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-white/[0.08] bg-[#07090C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex items-center justify-between text-xs font-mono text-[#829CA9]">
          <div className="flex items-center gap-2 tracking-wider uppercase">
            <Link to="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-white transition-colors">COLLECTIONS</Link>
            <span>/</span>
            <span className="text-[#C5A059] font-medium">{fragrance.name.toUpperCase()}</span>
          </div>

          <Link
            to="/collection"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#829CA9] hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL FRAGRANCES</span>
          </Link>
        </div>
      </nav>

      {/* 2. Main Product Showcase Grid (Matching Screenshot 1-4) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Visual Stage (lg:col-span-6) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative min-h-[480px] sm:min-h-[580px] border border-white/10 bg-[#0E1318] flex flex-col justify-between overflow-hidden shadow-2xl rounded-xs group">
              
              {/* Product Visual Container */}
              <div className="relative w-full h-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center p-6 sm:p-10">
                {viewMode === 'photo' && fragrance.image ? (
                  <div className="relative w-full h-full min-h-[440px] sm:min-h-[520px] flex items-center justify-center overflow-hidden">
                    <img
                      src={fragrance.image}
                      alt={fragrance.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D10]/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="my-auto py-8 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-700 select-none">
                    <PerfumeBottle
                      fragrance={fragrance}
                      size="lg"
                      showPedestal={true}
                      pedestalHeight={130}
                      interactive={true}
                    />
                  </div>
                )}

                {/* Hover to Zoom / Mode Pill */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                  {fragrance.image && (
                    <button
                      type="button"
                      onClick={() => setViewMode(viewMode === 'photo' ? 'bottle' : 'photo')}
                      className="px-3 py-1 bg-black/75 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono tracking-widest uppercase backdrop-blur-md transition-colors cursor-pointer rounded-xs flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{viewMode === 'photo' ? '3D FLACON VIEW' : 'STUDIO PHOTO'}</span>
                    </button>
                  )}
                  <span className="px-3 py-1 bg-black/60 text-white/70 border border-white/10 text-[10px] font-mono tracking-widest uppercase backdrop-blur-md hidden sm:inline-flex items-center gap-1.5">
                    <Maximize2 className="w-3 h-3" />
                    <span>HOVER TO ZOOM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* View Mode Thumbnails */}
            <div className="mt-4 flex items-center gap-3">
              {fragrance.image && (
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`w-20 h-20 border overflow-hidden transition-all cursor-pointer rounded-xs ${
                    viewMode === 'photo' ? 'border-[#C5A059] ring-1 ring-[#C5A059]' : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={fragrance.image} alt="Studio view" className="w-full h-full object-cover" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewMode('bottle')}
                className={`w-20 h-20 border p-2 bg-[#0E1318] flex items-center justify-center transition-all cursor-pointer rounded-xs ${
                  viewMode === 'bottle' ? 'border-[#C5A059] ring-1 ring-[#C5A059]' : 'border-white/15 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center scale-50 pointer-events-none">
                  <PerfumeBottle fragrance={fragrance} size="sm" showPedestal={false} />
                </div>
              </button>
            </div>
          </div>

          {/* Right Product Dossier (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Top Ingredient / Category Title */}
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#C5A059] font-medium mb-1.5 block">
              {fragrance.ingredientTitle || fragrance.family.toUpperCase()}
            </span>

            {/* Product Title (Large Serif) */}
            <h1 className="font-display font-normal text-4xl sm:text-5xl text-white tracking-tight leading-tight">
              {fragrance.name}
            </h1>

            {/* Italic Tagline */}
            {fragrance.tagline && (
              <p className="mt-1.5 text-base sm:text-lg font-serif italic text-[#C5B39A]">
                {fragrance.tagline}
              </p>
            )}

            {/* Price & Size Display */}
            <div className="mt-6 flex items-baseline gap-3 pb-6 border-b border-white/10">
              <span className="font-display text-3xl sm:text-4xl text-[#D4AF37] font-semibold tabular-nums">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-sm font-mono text-[#829CA9]">
                {fragrance.sizeLabel || `${selectedSize} ml`}
              </span>
            </div>

            {/* Narrative Story Prose (Simple, evocative, no AI slop) */}
            <div className="mt-6 text-sm sm:text-base text-[#B0C3CD] leading-relaxed font-light">
              <p>{fragrance.description}</p>
            </div>

            {/* Clean NOTE PYRAMID (Exact layout from screenshots) */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="font-mono text-xs tracking-[0.25em] text-[#C5A059] uppercase font-semibold mb-4">
                NOTE PYRAMID
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-white/5">
                  <span className="col-span-3 text-[#C5A059] tracking-wider uppercase font-semibold">
                    TOP
                  </span>
                  <span className="col-span-9 text-white">
                    {fragrance.olfactoryPyramid.top.join(', ')}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1.5 border-b border-white/5">
                  <span className="col-span-3 text-[#C5A059] tracking-wider uppercase font-semibold">
                    HEART
                  </span>
                  <span className="col-span-9 text-white">
                    {fragrance.olfactoryPyramid.heart.join(', ')}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1.5">
                  <span className="col-span-3 text-[#C5A059] tracking-wider uppercase font-semibold">
                    BASE
                  </span>
                  <span className="col-span-9 text-white">
                    {fragrance.olfactoryPyramid.base.join(' & ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Size Switcher (if product has 50ml / 100ml options) */}
            {fragrance.sizes.length > 1 && (
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-[#829CA9] mb-2.5">
                  <span>FLACON SIZE</span>
                  <span className="text-[#C5A059]">{selectedSize} ML</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {fragrance.sizes.map(s => (
                    <button
                      key={s.ml}
                      type="button"
                      onClick={() => setSelectedSize(s.ml)}
                      className={`p-3.5 border text-left font-mono transition-all cursor-pointer rounded-xs flex items-center justify-between ${
                        selectedSize === s.ml
                          ? 'border-[#C5A059] bg-[#C5A059]/10 text-white'
                          : 'border-white/15 bg-white/[0.02] text-[#829CA9] hover:border-white/30'
                      }`}
                    >
                      <span className="text-xs font-semibold">{s.ml} ML</span>
                      <span className="text-xs font-medium text-[#D4AF37]">{formatPrice(s.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: Quantity + Gold ADD TO CART Button + BUY NOW */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Selector: [- 1 +] */}
                <div className="flex items-center border border-white/20 bg-[#0E1318] h-13 px-2 rounded-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#829CA9] hover:text-white cursor-pointer"
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
                    className="p-2 text-[#829CA9] hover:text-white cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main Gold Button: ADD TO CART — ₹2,699 → */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-13 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0D10] font-mono text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer rounded-xs active:scale-[0.99]"
                >
                  <span>ADD TO CART — {formatPrice(currentPrice * quantity)}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Instant BUY NOW Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/20 font-mono text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xs"
              >
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>BUY NOW • INSTANT CHECKOUT</span>
              </button>
            </div>

            {/* Added Notification */}
            {addedNotice && (
              <div className="mt-3.5 p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between rounded-xs animate-in fade-in">
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

            {/* Trust Bullet Points (Matching Screenshots) */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2 text-xs font-mono text-[#829CA9]">
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">•</span>
                <span>Complimentary shipping on orders over ₹1,500</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A059]">•</span>
                <span>7-day returns on unopened bottles or damaged goods</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Customer Reviews Section */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#C5A059] uppercase mb-1 font-semibold">
              <span className="w-3 h-[1px] bg-[#C5A059]" />
              <span>COMMUNITY IMPRESSIONS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-white tracking-tight">
              Customer Reviews
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
              <span className="font-display text-4xl text-[#D4AF37] font-semibold">{averageRating}</span>
              <div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#829CA9]">Based on {reviews.length} reviews</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0D10] font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer rounded-xs"
            >
              {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
            </button>
          </div>
        </div>

        {reviewSubmitted && (
          <div className="mt-6 p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2.5 rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you! Your verified review has been posted.</span>
          </div>
        )}

        {showReviewForm && (
          <form 
            onSubmit={handleSubmitReview}
            className="mt-8 p-6 sm:p-8 bg-[#0E1318] border border-[#C5A059]/40 rounded-xs shadow-xl animate-in fade-in"
          >
            <h3 className="font-display text-xl text-white mb-4">
              Write a Review for {fragrance.name}
            </h3>

            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#829CA9] mb-2">
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
                          : 'stroke-[#4A5D68] fill-transparent'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#829CA9] mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  placeholder="e.g. Priya S."
                  className="w-full px-3.5 py-2.5 bg-[#07090C] border border-white/20 text-xs font-mono text-white focus:border-[#C5A059] outline-hidden rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#829CA9] mb-1.5">
                  City / State (Optional)
                </label>
                <input
                  type="text"
                  value={reviewerLocation}
                  onChange={e => setReviewerLocation(e.target.value)}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full px-3.5 py-2.5 bg-[#07090C] border border-white/20 text-xs font-mono text-white focus:border-[#C5A059] outline-hidden rounded-xs"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#829CA9] mb-1.5">
                Headline *
              </label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={e => setReviewTitle(e.target.value)}
                placeholder="e.g. Scent evolution is intoxicating"
                className="w-full px-3.5 py-2.5 bg-[#07090C] border border-white/20 text-xs font-mono text-white focus:border-[#C5A059] outline-hidden rounded-xs"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#829CA9] mb-1.5">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience on skin longevity, scent notes, and projection..."
                className="w-full p-3.5 bg-[#07090C] border border-white/20 text-xs font-mono text-white focus:border-[#C5A059] outline-hidden rounded-xs resize-y"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-white/20 text-xs font-mono uppercase tracking-wider text-[#829CA9] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0D10] text-xs font-mono uppercase tracking-wider font-bold cursor-pointer rounded-xs"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 space-y-4">
          {reviews.map(review => (
            <div 
              key={review.id}
              className="p-6 bg-[#0E1318] border border-white/[0.08] rounded-xs hover:border-[#C5A059]/30 transition-colors"
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

                <span className="text-[11px] font-mono text-[#829CA9]">
                  {review.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-light text-[#B0C3CD] leading-relaxed mb-3">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-[#829CA9]">
                <span className="font-semibold text-white">{review.author}</span>
                <span>•</span>
                <span>{review.location}</span>
                {review.verified && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-[#C5A059] font-medium">
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

      {/* 4. "THE MOLECULE SERIES" Grid (Exact Design from Screenshot 5) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-white/10">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
          <h2 className="font-mono text-sm sm:text-base tracking-[0.25em] text-white uppercase font-semibold">
            THE MOLECULE SERIES
          </h2>

          <Link
            to="/collection"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#C5A059] hover:text-white transition-colors uppercase tracking-wider font-semibold"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Card Grid matching Screenshot 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FRAGRANCES.filter(f => f.id !== 'discovery-archive').map(prod => (
            <div
              key={prod.id}
              className="group border border-white/10 bg-[#0E1318] rounded-xs overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#C5A059]/40"
            >
              {/* Product Visual Container */}
              <Link 
                to={`/product/${prod.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="relative h-[280px] bg-[#07090C] flex items-center justify-center overflow-hidden border-b border-white/10 cursor-pointer"
              >
                {/* Bestseller Badge */}
                {prod.isBestseller && (
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#8B0000] text-white text-[9px] font-mono tracking-widest uppercase font-semibold">
                    BESTSELLER
                  </span>
                )}

                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="py-4 transform group-hover:scale-105 transition-transform duration-500">
                    <PerfumeBottle fragrance={prod} size="md" showPedestal={false} />
                  </div>
                )}
              </Link>

              {/* Product Information */}
              <div className="p-4 sm:p-5 flex flex-col items-center text-center">
                <Link
                  to={`/product/${prod.id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-white font-semibold group-hover:text-[#C5A059] transition-colors"
                >
                  {prod.name.toUpperCase()}
                </Link>

                <span className="mt-1 text-[10px] font-mono tracking-widest uppercase text-[#C5A059]">
                  {prod.ingredientTitle || prod.family.toUpperCase()}
                </span>

                <span className="mt-3 text-xs font-serif italic tracking-wider uppercase text-[#829CA9]">
                  {prod.subtitle.toUpperCase()}
                </span>

                <span className="mt-1 text-xs font-mono text-[#D4AF37] font-semibold tabular-nums">
                  50 ml &nbsp;|&nbsp; {formatPrice(prod.price)}
                </span>
              </div>

              {/* Deep Crimson ADD TO BAG Button (Matching Screenshot 5) */}
              <button
                type="button"
                onClick={() => {
                  addToCart(prod, 50, 1);
                  openCart();
                }}
                className="w-full py-3 bg-[#540B13] hover:bg-[#6E0F19] text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer"
              >
                ADD TO BAG
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

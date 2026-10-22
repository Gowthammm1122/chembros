import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ALL_PRODUCTS, FRAGRANCES, Fragrance, formatPrice } from '../data/fragrances';
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

  // Find target product across all products (or default to Molecule J)
  const fragrance: Fragrance = ALL_PRODUCTS.find(f => f.id === id) || FRAGRANCES[0];
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
    <div className="pt-20 sm:pt-24 pb-24 bg-[#FAFBFD] min-h-screen text-[#0A2533]">
      
      {/* 1. Subtle Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-[#0A2533]/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3.5 flex items-center justify-between text-xs font-mono text-[#5A7785]">
          <div className="flex items-center gap-2 tracking-wider uppercase">
            <Link to="/" className="hover:text-[#087A91] transition-colors">HOME</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-[#087A91] transition-colors">COLLECTIONS</Link>
            <span>/</span>
            <span className="text-[#087A91] font-semibold">{fragrance.name.toUpperCase()}</span>
          </div>

          <Link
            to="/collection"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#5A7785] hover:text-[#087A91] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL FRAGRANCES</span>
          </Link>
        </div>
      </nav>

      {/* 2. Main Product Showcase Grid (Restyled to Chem Bros Light Theme) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Visual Stage (lg:col-span-6) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative min-h-[480px] sm:min-h-[580px] border border-[#0A2533]/10 bg-gradient-to-b from-[#F8FAFB] via-[#EFF5F8] to-[#E6EFF3] flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(10,37,51,0.05)] rounded-xs group">
              
              {/* Product Visual Container */}
              <div className="relative w-full h-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center p-6 sm:p-10">
                {viewMode === 'photo' && fragrance.image ? (
                  <div className="relative w-full h-full min-h-[440px] sm:min-h-[520px] flex items-center justify-center overflow-hidden">
                    <img
                      src={fragrance.image}
                      alt={fragrance.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 select-none shadow-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
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

                {/* View Switcher Pill */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                  {fragrance.image && (
                    <button
                      type="button"
                      onClick={() => setViewMode(viewMode === 'photo' ? 'bottle' : 'photo')}
                      className="px-3 py-1 bg-white/90 hover:bg-white text-[#0A2533] border border-[#0A2533]/15 text-[10px] font-mono tracking-widest uppercase backdrop-blur-md transition-colors cursor-pointer rounded-xs flex items-center gap-1.5 shadow-xs font-medium"
                    >
                      <RotateCcw className="w-3 h-3 text-[#087A91]" />
                      <span>{viewMode === 'photo' ? '3D FLACON VIEW' : 'STUDIO PHOTO'}</span>
                    </button>
                  )}
                  <span className="px-3 py-1 bg-white/70 text-[#5A7785] border border-[#0A2533]/10 text-[10px] font-mono tracking-widest uppercase backdrop-blur-md hidden sm:inline-flex items-center gap-1.5">
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
                    viewMode === 'photo' 
                      ? 'border-[#087A91] ring-2 ring-[#087A91]/30 shadow-xs' 
                      : 'border-[#0A2533]/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={fragrance.image} alt="Studio view" className="w-full h-full object-cover" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewMode('bottle')}
                className={`w-20 h-20 border p-2 bg-[#F8FAFB] flex items-center justify-center transition-all cursor-pointer rounded-xs ${
                  viewMode === 'bottle' 
                    ? 'border-[#087A91] ring-2 ring-[#087A91]/30 shadow-xs' 
                    : 'border-[#0A2533]/15 opacity-70 hover:opacity-100'
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
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#087A91] font-semibold mb-1.5 block">
              {fragrance.ingredientTitle || fragrance.family.toUpperCase()}
            </span>

            {/* Product Title (Large Serif) */}
            <h1 className="font-display font-light text-4xl sm:text-5xl text-[#0A2533] tracking-tight leading-tight">
              {fragrance.name}
            </h1>

            {/* Italic Tagline */}
            {fragrance.tagline && (
              <p className="mt-1.5 text-base sm:text-lg font-serif italic text-[#4A6775]">
                {fragrance.tagline}
              </p>
            )}

            {/* Price & Size Display */}
            <div className="mt-6 flex items-baseline gap-3 pb-6 border-b border-[#0A2533]/10">
              <span className="font-display text-3xl sm:text-4xl text-[#0A2533] font-semibold tabular-nums">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-sm font-mono text-[#5A7785]">
                {fragrance.sizeLabel || `${selectedSize} ml`}
              </span>
            </div>

            {/* Narrative Story Prose (Simple, evocative, clean) */}
            <div className="mt-6 text-sm sm:text-base text-[#3A5563] leading-relaxed font-light">
              <p>{fragrance.description}</p>
            </div>

            {/* Clean NOTE PYRAMID in Our Theme */}
            <div className="mt-8 p-5 bg-white border border-[#0A2533]/10 rounded-xs shadow-xs">
              <h3 className="font-mono text-xs tracking-[0.25em] text-[#087A91] uppercase font-semibold mb-3">
                NOTE PYRAMID
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-12 gap-2 py-2 border-b border-[#0A2533]/5">
                  <span className="col-span-3 text-[#087A91] tracking-wider uppercase font-semibold">
                    TOP
                  </span>
                  <span className="col-span-9 text-[#0A2533] font-medium">
                    {fragrance.olfactoryPyramid.top.join(', ')}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-2 border-b border-[#0A2533]/5">
                  <span className="col-span-3 text-[#087A91] tracking-wider uppercase font-semibold">
                    HEART
                  </span>
                  <span className="col-span-9 text-[#0A2533] font-medium">
                    {fragrance.olfactoryPyramid.heart.join(', ')}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-2">
                  <span className="col-span-3 text-[#087A91] tracking-wider uppercase font-semibold">
                    BASE
                  </span>
                  <span className="col-span-9 text-[#0A2533] font-medium">
                    {fragrance.olfactoryPyramid.base.join(' & ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Size Switcher (if product has 50ml / 100ml options) */}
            {fragrance.sizes.length > 1 && (
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs font-mono tracking-wider uppercase text-[#5A7785] mb-2.5">
                  <span>FLACON SIZE</span>
                  <span className="text-[#087A91] font-semibold">{selectedSize} ML</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {fragrance.sizes.map(s => (
                    <button
                      key={s.ml}
                      type="button"
                      onClick={() => setSelectedSize(s.ml)}
                      className={`p-3.5 border text-left font-mono transition-all cursor-pointer rounded-xs flex items-center justify-between ${
                        selectedSize === s.ml
                          ? 'border-[#0A2533] bg-[#0A2533] text-white shadow-xs'
                          : 'border-[#0A2533]/15 bg-white text-[#0A2533] hover:border-[#087A91]'
                      }`}
                    >
                      <span className="text-xs font-semibold">{s.ml} ML</span>
                      <span className={`text-xs font-medium ${selectedSize === s.ml ? 'text-white/90' : 'text-[#087A91]'}`}>
                        {formatPrice(s.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: Quantity + Primary ADD TO CART Button + BUY NOW */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Selector: [- 1 +] */}
                <div className="flex items-center border border-[#0A2533]/20 bg-[#F4F8FA] h-13 px-2 rounded-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-semibold text-sm tabular-nums text-[#0A2533]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-[#5A7785] hover:text-[#0A2533] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main Action Button: ADD TO CART */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-13 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer rounded-xs active:scale-[0.99]"
                >
                  <span>ADD TO CART — {formatPrice(currentPrice * quantity)}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Instant BUY NOW Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-11 bg-white hover:bg-[#F0F6F9] text-[#0A2533] hover:text-[#087A91] border border-[#0A2533]/25 hover:border-[#087A91] font-mono text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xs shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-[#087A91]" />
                <span>BUY NOW • INSTANT CHECKOUT</span>
              </button>
            </div>

            {/* Added Notification */}
            {addedNotice && (
              <div className="mt-3.5 p-3.5 bg-emerald-50 border border-emerald-400/50 text-emerald-800 text-xs font-mono flex items-center justify-between rounded-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{fragrance.name} added to your bag.</span>
                </div>
                <button 
                  type="button"
                  onClick={() => openCart()}
                  className="underline font-semibold text-emerald-900 hover:text-emerald-700 cursor-pointer"
                >
                  View Bag
                </button>
              </div>
            )}

            {/* Trust Bullet Points */}
            <div className="mt-8 pt-6 border-t border-[#0A2533]/10 space-y-2 text-xs font-mono text-[#5A7785]">
              <div className="flex items-center gap-2">
                <span className="text-[#087A91] font-bold">•</span>
                <span>Complimentary shipping on orders over ₹1,500</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#087A91] font-bold">•</span>
                <span>7-day returns on unopened bottles or damaged goods</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Customer Reviews Section in Our Theme */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-[#0A2533]/10 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#0A2533]/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#087A91] uppercase mb-1 font-semibold">
              <span className="w-3 h-[1px] bg-[#087A91]" />
              <span>COMMUNITY IMPRESSIONS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#0A2533] tracking-tight">
              Customer Reviews
            </h2>
          </div>

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
              className="px-4 py-2 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer rounded-xs shadow-xs"
            >
              {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
            </button>
          </div>
        </div>

        {reviewSubmitted && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-400/50 text-emerald-800 text-xs font-mono flex items-center gap-2.5 rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your verified review has been posted.</span>
          </div>
        )}

        {showReviewForm && (
          <form 
            onSubmit={handleSubmitReview}
            className="mt-8 p-6 sm:p-8 bg-[#F8FAFB] border border-[#0A2533]/15 rounded-xs shadow-md animate-in fade-in"
          >
            <h3 className="font-display text-xl text-[#0A2533] mb-4">
              Write a Review for {fragrance.name}
            </h3>

            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-2 font-medium">
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
                          : 'stroke-[#8DA4B0] fill-transparent'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5 font-medium">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  placeholder="e.g. Priya S."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5 font-medium">
                  City / State (Optional)
                </label>
                <input
                  type="text"
                  value={reviewerLocation}
                  onChange={e => setReviewerLocation(e.target.value)}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-xs"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5 font-medium">
                Headline *
              </label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={e => setReviewTitle(e.target.value)}
                placeholder="e.g. Scent evolution is intoxicating"
                className="w-full px-3.5 py-2.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-xs"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A7785] mb-1.5 font-medium">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience on skin longevity, scent notes, and projection..."
                className="w-full p-3.5 bg-white border border-[#0A2533]/20 text-xs font-mono text-[#0A2533] focus:border-[#087A91] outline-hidden rounded-xs resize-y"
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
                className="px-6 py-2.5 bg-[#0A2533] hover:bg-[#087A91] text-white text-xs font-mono uppercase tracking-wider font-bold cursor-pointer rounded-xs shadow-xs"
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
              className="p-6 bg-white border border-[#0A2533]/10 rounded-xs hover:border-[#087A91]/40 transition-colors shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-display font-medium text-base text-[#0A2533]">
                    {review.title}
                  </h4>
                </div>

                <span className="text-[11px] font-mono text-[#5A7785]">
                  {review.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-light text-[#3A5563] leading-relaxed mb-3">
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
                      <CheckCircle2 className="w-3 h-3 text-[#087A91]" />
                      <span>Verified Buyer</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. "THE MOLECULE SERIES" Grid in Our Theme */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 border-t border-[#0A2533]/10">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#0A2533]/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-[#087A91] uppercase mb-1 font-semibold">
              <span className="w-3 h-[1px] bg-[#087A91]" />
              <span>THE COLLECTION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[#0A2533] tracking-tight">
              The Molecule Series
            </h2>
          </div>

          <Link
            to="/collection"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0A2533] hover:text-[#087A91] transition-colors uppercase tracking-wider font-semibold border border-[#0A2533]/20 hover:border-[#087A91] px-3.5 py-1.5 bg-white shadow-xs"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Card Grid matching Authentic Series */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FRAGRANCES.map(prod => (
            <div
              key={prod.id}
              className="group border border-[#0A2533]/10 bg-white rounded-xs overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#087A91]/40 shadow-[0_4px_20px_rgba(10,37,51,0.04)] hover:shadow-[0_12px_28px_rgba(10,37,51,0.08)]"
            >
              {/* Product Visual Container */}
              <Link 
                to={`/product/${prod.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="relative h-[270px] bg-gradient-to-b from-[#F8FAFB] via-[#EFF5F8] to-[#E6EFF3] flex items-center justify-center overflow-hidden border-b border-[#0A2533]/10 cursor-pointer"
              >
                {/* Bestseller Badge */}
                {prod.isBestseller && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-[#8B0000] text-white text-[9px] font-mono tracking-widest uppercase font-semibold">
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
                  className="font-mono text-xs uppercase tracking-[0.2em] text-[#0A2533] font-semibold group-hover:text-[#087A91] transition-colors"
                >
                  {prod.name.toUpperCase()}
                </Link>

                <span className="mt-1 text-[10px] font-mono tracking-widest uppercase text-[#087A91] font-medium">
                  {prod.ingredientTitle || prod.family.toUpperCase()}
                </span>

                <span className="mt-2 text-xs font-serif italic tracking-wider text-[#5A7785]">
                  {prod.subtitle}
                </span>

                <span className="mt-1.5 text-xs font-mono text-[#0A2533] font-semibold tabular-nums">
                  50 ml &nbsp;|&nbsp; {formatPrice(prod.price)}
                </span>
              </div>

              {/* Authentic Crimson ADD TO BAG Button */}
              <button
                type="button"
                onClick={() => {
                  addToCart(prod, 50, 1);
                  openCart();
                }}
                className="w-full py-3 bg-[#610718] hover:bg-[#7D0E23] text-white text-xs font-mono uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer"
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

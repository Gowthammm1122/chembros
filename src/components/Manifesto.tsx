import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FRAGRANCES, Fragrance, formatPrice } from '../data/fragrances';
import { ShoppingBag, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ManifestoProps {
  onSelectFragrance?: (fragrance: Fragrance) => void;
  onAddToCart?: (fragrance: Fragrance, size: number) => void;
}

interface ProductShowcaseCard {
  fragrance: Fragrance;
  formulaNo: string;
  name: string;
  image: string;
  flavorTitle: string;
  flavorNotes: string[];
  essenceSummary: string;
  keyIsolate: string;
  accentColor: string;
}

export const Manifesto: React.FC<ManifestoProps> = ({
  onSelectFragrance,
  onAddToCart,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgContainers = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStep, setActiveStep] = useState<number>(0);

  // Four luxury landscape images corresponding to the four authentic ChemBros formulas
  const cards: ProductShowcaseCard[] = [
    {
      fragrance: FRAGRANCES[0],
      formulaNo: '01',
      name: 'MOLECULE J',
      image: '/images/formula-01-amber.jpg',
      flavorTitle: 'Luminous Solar Floral',
      flavorNotes: ['Madurai Jasmine Sambac', 'Dewy Green Tea', 'Bergamot', 'Ambroxan'],
      essenceSummary: 'The Beginning. Pure Madurai Jasmine Sambac shaped by memory, fresh morning air, and skin intimacy.',
      keyIsolate: 'Benzyl Acetate & Methyl Jasmonate (99.2% Pure Madurai Malli Isolate)',
      accentColor: '#E5A93C',
    },
    {
      fragrance: FRAGRANCES[1],
      formulaNo: '02',
      name: 'MOLECULE T',
      image: '/images/formula-02-vetiver.jpg',
      flavorTitle: 'Creamy Carnal Floral',
      flavorNotes: ['Night Tuberose', 'Lactonic Sandalwood', 'Coconut Pulp', 'Crushed Stems'],
      essenceSummary: 'The Obsession. Hypnotic night-blooming tuberose wrapped in velvety sandalwood cream and spiced twilight.',
      keyIsolate: 'Methyl Anthranilate & Tuberose Lactones Isolate',
      accentColor: '#48B8CE',
    },
    {
      fragrance: FRAGRANCES[2],
      formulaNo: '03',
      name: 'MOLECULE R',
      image: '/images/formula-03-myrrh.jpg',
      flavorTitle: 'Exotic Spiced Amber Floral',
      flavorNotes: ['Red Champaca', 'Saffron Stigmas', 'Wild Blossom Honey', 'Smoked Labdanum'],
      essenceSummary: 'The Fire. Single-distillate Tamil Nadu Red Champaca carrying the heat of desire and smoldering resins.',
      keyIsolate: 'Phenylacetaldehyde & Supercritical Champaca CO2',
      accentColor: '#D97706',
    },
    {
      fragrance: FRAGRANCES[3],
      formulaNo: '04',
      name: 'MOLECULE X',
      image: '/images/formula-04-oak.jpg',
      flavorTitle: 'Herbaceous Boozy Aromatic',
      flavorNotes: ['Davana Distillate', 'Macerated Plum Liqueur', 'Iso E Super', 'Limousin Oak'],
      essenceSummary: 'The Anomaly. The wild botanical chameleon of perfumery that morphs unpredictably on individual skin chemistry.',
      keyIsolate: 'Davanone & Iso E Super Synergistic Matrix',
      accentColor: '#D4B996',
    },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Initial state: Card 0 text active, others hidden cleanly
      if (cardRefs.current[0]) gsap.set(cardRefs.current[0], { opacity: 1 });
      if (contentRefs.current[0]) gsap.set(contentRefs.current[0], { opacity: 1, y: 0 });

      for (let i = 1; i < cards.length; i++) {
        if (cardRefs.current[i]) gsap.set(cardRefs.current[i], { opacity: 1 });
        if (imgContainers.current[i]) gsap.set(imgContainers.current[i], { scale: 1.0 });
        if (contentRefs.current[i]) gsap.set(contentRefs.current[i], { opacity: 0, y: 35 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3600',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.26) {
              setActiveStep(0);
            } else if (self.progress < 0.54) {
              setActiveStep(1);
            } else if (self.progress < 0.80) {
              setActiveStep(2);
            } else {
              setActiveStep(3);
            }
          },
        },
      });

      // CHAPTER 1 -> 2 (Card 0 -> Card 1)
      // Card 0 image zooms gently
      tl.to(imgContainers.current[0], { scale: 1.2, ease: 'none', duration: 1.0 }, 0);

      // Card 0 text smoothly glides up & dissolves before next text enters
      tl.to(contentRefs.current[0], { opacity: 0, y: -30, ease: 'power2.in', duration: 0.2 }, 0.65);

      // Card 0 image dissolves to reveal Card 1 behind it
      tl.to(cardRefs.current[0], { opacity: 0, ease: 'power1.inOut', duration: 0.24 }, 0.72);
      tl.set(cardRefs.current[0], { pointerEvents: 'none' }, 0.96);

      // Card 1 text rises gently & emerges seamlessly
      tl.fromTo(
        contentRefs.current[1],
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.24 },
        0.82
      );

      // CHAPTER 2 -> 3 (Card 1 -> Card 2)
      // Card 1 image zooms gently
      tl.to(imgContainers.current[1], { scale: 1.2, ease: 'none', duration: 1.0 }, 0.8);

      // Card 1 text smoothly glides up & dissolves
      tl.to(contentRefs.current[1], { opacity: 0, y: -30, ease: 'power2.in', duration: 0.2 }, 1.65);

      // Card 1 image dissolves to reveal Card 2
      tl.to(cardRefs.current[1], { opacity: 0, ease: 'power1.inOut', duration: 0.24 }, 1.72);
      tl.set(cardRefs.current[1], { pointerEvents: 'none' }, 1.96);

      // Card 2 text rises gently & emerges seamlessly
      tl.fromTo(
        contentRefs.current[2],
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.24 },
        1.82
      );

      // CHAPTER 3 -> 4 (Card 2 -> Card 3)
      // Card 2 image zooms gently
      tl.to(imgContainers.current[2], { scale: 1.2, ease: 'none', duration: 1.0 }, 1.8);

      // Card 2 text smoothly glides up & dissolves
      tl.to(contentRefs.current[2], { opacity: 0, y: -30, ease: 'power2.in', duration: 0.2 }, 2.65);

      // Card 2 image dissolves to reveal Card 3
      tl.to(cardRefs.current[2], { opacity: 0, ease: 'power1.inOut', duration: 0.24 }, 2.72);
      tl.set(cardRefs.current[2], { pointerEvents: 'none' }, 2.96);

      // Card 3 text rises gently & emerges seamlessly
      tl.fromTo(
        contentRefs.current[3],
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.24 },
        2.82
      );

      // CHAPTER 4 finale (Card 3 stays locked & readable until normal unpin)
      tl.to(imgContainers.current[3], { scale: 1.15, ease: 'none', duration: 1.0 }, 2.8);
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Quick navigation helper to jump to a specific formula card
  const scrollToCard = (index: number) => {
    if (!sectionRef.current) return;
    const scrollTriggerInstance = ScrollTrigger.getById('manifesto-scroll') || ScrollTrigger.getAll().find(st => st.trigger === sectionRef.current);
    if (scrollTriggerInstance) {
      const targetProgress = index === 0 ? 0.05 : index === 1 ? 0.38 : index === 2 ? 0.65 : 0.92;
      const scrollPos = scrollTriggerInstance.start + (scrollTriggerInstance.end - scrollTriggerInstance.start) * targetProgress;
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[#03151D] text-white select-none"
    >
      {/* Stacked Full-Viewport Landscape Cards */}
      {cards.map((card, idx) => (
        <div
          key={card.formulaNo}
          ref={(el) => {
            cardRefs.current[idx] = el;
          }}
          className="absolute inset-0 w-full h-full overflow-hidden will-change-[opacity,transform]"
          style={{ zIndex: 40 - idx * 10 }}
        >
          {/* Zooming Landscape Image Container */}
          <div
            ref={(el) => {
              imgContainers.current[idx] = el;
            }}
            className="absolute inset-0 w-full h-full will-change-transform transform-gpu origin-center"
          >
            <img
              src={card.image}
              alt={`${card.formulaNo} - ${card.name}`}
              className="w-full h-full object-cover object-center select-none"
              referrerPolicy="no-referrer"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />

            {/* Cinematic Gradient Overlays: Deep Scrim & Radial Vignette for crystalline text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#03151D] via-[#03151D]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#03151D]/90 via-[#03151D]/55 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(3,21,29,0.85)_0%,_transparent_65%)]" />
          </div>

          {/* Minimalist Editorial Content Layer */}
          <div
            ref={(el) => {
              contentRefs.current[idx] = el;
            }}
            className="relative z-10 w-full h-full flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-12 sm:pb-16 pt-12 will-change-[opacity,transform]"
            style={{ opacity: idx === 0 ? 1 : 0 }}
          >
            {/* Bottom Content: Minimal Flavor & Product Details (Zero AI fluff) */}
            <div className="max-w-3xl">
              {/* Product Headline (Kallisto Typography) with clean 01-04 indicator */}
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.05] mb-4 flex items-baseline gap-3 sm:gap-4">
                <span className="font-mono text-2xl sm:text-4xl text-white/45 font-normal tracking-wide">
                  {card.formulaNo}
                </span>
                <span>{card.name}</span>
              </h2>

              {/* Essence Summary: Concise truth of the fragrance flavor */}
              <p className="text-base sm:text-lg text-white/85 font-light leading-relaxed max-w-2xl mb-6">
                {card.essenceSummary}
              </p>

              {/* Flavor Profile Notes */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
                <span className="font-mono text-[11px] tracking-wider text-white/50 uppercase mr-1">
                  FLAVOR NOTES:
                </span>
                {card.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs text-white/95 font-light tracking-wide transition-colors"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Quick Interactive Actions */}
              <div className="flex flex-wrap items-center gap-4">
                {onSelectFragrance && (
                  <button
                    onClick={() => onSelectFragrance(card.fragrance)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0A2533] hover:bg-white/90 text-xs font-mono tracking-widest uppercase font-semibold transition-all shadow-lg cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0A2533]" />
                    <span>VIEW DOSSIER</span>
                  </button>
                )}

                {onAddToCart && (
                  <button
                    onClick={() => onAddToCart(card.fragrance, 50)}
                    className="flex items-center gap-2 px-5 py-2.5 border border-white/30 hover:border-white text-white hover:bg-white/10 text-xs font-mono tracking-widest uppercase font-medium transition-all backdrop-blur-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-white/80" />
                    <span>ORDER 50ML — {formatPrice(card.fragrance.price)}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Floating HUD: Formula Navigation Tabs & Scroll Indicator */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4">
        <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase rotate-90 mb-4 origin-center">
          SCROLL
        </span>

        {cards.map((c, i) => (
          <button
            key={c.formulaNo}
            onClick={() => scrollToCard(i)}
            aria-label={`Jump to Formula ${c.formulaNo}`}
            className="group flex items-center gap-2 cursor-pointer py-1"
          >
            <span
              className={`font-mono text-[11px] tracking-wider transition-all ${
                activeStep === i
                  ? 'text-white font-bold opacity-100 scale-110'
                  : 'text-white/40 group-hover:text-white/70 opacity-60'
              }`}
            >
              {c.formulaNo}
            </span>
            <span
              className={`w-1.5 transition-all duration-300 rounded-full ${
                activeStep === i
                  ? 'h-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : 'h-1.5 bg-white/30 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

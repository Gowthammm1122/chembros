import React, { useState, useEffect, useRef } from 'react';
import { FRAGRANCES, Fragrance } from '../data/fragrances';
import { MoleculeXBottle } from './MoleculeXBottle';
import { RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onSelectFragrance: (fragrance: Fragrance) => void;
  onOpenStory?: () => void;
  onIntroCompleteChange?: (isComplete: boolean) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectFragrance, onIntroCompleteChange }) => {
  const [activeFragranceIndex, setActiveFragranceIndex] = useState<number>(0);
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(false);

  // GSAP animation references
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const entranceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blackScreenRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const replayBtnRef = useRef<HTMLButtonElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerInstanceRef = useRef<gsap.plugins.ScrollTriggerInstance | null>(null);

  // Stepped pedestal heights calibrated to stay grounded at the bottom of the screen
  const heroPedestalHeights = [
    'clamp(100px, 19vh, 175px)',
    'clamp(55px, 11vh, 110px)',
    'clamp(75px, 12.5vh, 145px)',
    'clamp(45px, 12vh, 90px)',
  ];

  // Function to run the cinematic bottle splitting opening animation
  const runOpeningAnimation = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) {
      if (blackScreenRef.current) blackScreenRef.current.style.display = 'none';
      gsap.set('#main-navbar', { opacity: 1 });
      setIsIntroComplete(true);
      onIntroCompleteChange?.(true);
      return;
    }

    // Kill any active timeline or ScrollTrigger instance
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
      scrollTriggerInstanceRef.current = null;
    }

    setIsIntroComplete(false);
    onIntroCompleteChange?.(false);
    document.body.style.overflow = 'hidden';

    // Show black screen backdrop
    if (blackScreenRef.current) {
      blackScreenRef.current.style.display = 'flex';
      gsap.set(blackScreenRef.current, { opacity: 1 });
    }

    // Reset initial states of surrounding UI elements
    gsap.set('#main-navbar', { opacity: 0 });
    if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, y: -25 });
    if (replayBtnRef.current) gsap.set(replayBtnRef.current, { opacity: 0 });
    gsap.set('.hero-pedestal', { opacity: 0, y: 70 });

    // Clear previous inline transforms on bottles to measure natural base layout
    gsap.set(entranceRefs.current, { clearProps: 'transform,zIndex,position' });

    // Calculate exact optical center coordinates of the viewport
    const viewportCenterX = window.innerWidth / 2;
    const targetCenterY = window.innerHeight * 0.46; // balanced optical center

    // Stack all 4 bottles precisely at the center
    entranceRefs.current.forEach((el, idx) => {
      if (!el) return;
      const visual = el.querySelector('.bottle-visual') || el;
      const rect = visual.getBoundingClientRect();
      const bottleCenterX = rect.left + rect.width / 2;
      const bottleCenterY = rect.top + rect.height / 2;

      const deltaX = viewportCenterX - bottleCenterX;
      const deltaY = targetCenterY - bottleCenterY;

      // Bottle 0 is at the front (z-index 60), subsequent bottles stacked behind
      const zIndex = 60 - idx;
      gsap.set(el, {
        x: deltaX,
        y: deltaY,
        zIndex,
        position: 'relative',
      });
    });

    // Create the slow, cinematic GSAP timeline
    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        if (blackScreenRef.current) {
          blackScreenRef.current.style.display = 'none';
        }
        // Clear transforms so natural hover and responsive positioning remain 100% fluid
        gsap.set(entranceRefs.current, { clearProps: 'transform,zIndex,position' });
        gsap.set('.hero-pedestal', { clearProps: 'transform,opacity' });
        document.body.style.overflow = '';
        setIsIntroComplete(true);
        onIntroCompleteChange?.(true);

        if (stageRef.current) {
          gsap.set(stageRef.current, { clearProps: 'transform' });
        }
      },
    });

    timelineRef.current = tl;

    // 1. PHASE 1: Dramatic hold on the single illuminated bottle in the dark void
    tl.to({}, { duration: 1.1 });

    // 2. PHASE 2: Slower, silky-smooth glide from center out to their 4 hero columns
    tl.to(
      entranceRefs.current,
      {
        x: 0,
        y: 0,
        duration: 2.6,
        ease: 'power2.inOut',
      },
      'split'
    );

    // 3. PHASE 3: Black void dissolves smoothly into the moody laboratory video background
    if (blackScreenRef.current) {
      tl.to(
        blackScreenRef.current,
        {
          opacity: 0,
          duration: 1.8,
          ease: 'power2.inOut',
        },
        'split+=0.8'
      );
    }

    // 4. PHASE 4: Brushed metal plinths glide up to dock under each bottle as they arrive
    tl.to(
      '.hero-pedestal',
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.08,
        ease: 'power3.out',
      },
      'split+=1.3'
    );

    // 5. PHASE 5: Headline "CHEMISTRY, CAPTURED IN A BOTTLE" reveals with soft descent
    if (titleRef.current) {
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power2.out',
        },
        'split+=1.5'
      );
    }

    // 6. PHASE 6: Navbar & Replay controls fade in
    tl.to(
      '#main-navbar',
      {
        opacity: 1,
        duration: 1.1,
        ease: 'power2.out',
      },
      'split+=1.8'
    );

    if (replayBtnRef.current) {
      tl.to(
        replayBtnRef.current,
        {
          opacity: 1,
          duration: 1.0,
          ease: 'power2.out',
        },
        'split+=2.0'
      );
    }
  };

  useEffect(() => {
    // Run opening animation on mount
    runOpeningAnimation();

    return () => {
      document.body.style.overflow = '';
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
      }
      gsap.set('#main-navbar', { clearProps: 'opacity' });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 h-screen h-[100vh] h-[100svh] w-full bg-[#03151D] flex flex-col items-center justify-between pt-16 sm:pt-18 md:pt-20 pb-0 overflow-hidden"
    >
      {/* Black Screen Overlay for Cinematic Opening — z-10 behind bottles (z-20) */}
      <div
        ref={blackScreenRef}
        className="fixed inset-0 bg-[#000000] z-10 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        {/* Ambient Laboratory Spotlight Behind the Single Bottle */}
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(72,184,206,0.22)_0%,rgba(8,122,145,0.08)_45%,transparent_75%)] pointer-events-none blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      {/* 1. Background Laboratory Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/bg/bg1.jpeg"
          alt="Hero Background"
          className="w-full h-full object-cover object-center scale-[1.03]"
        />
        {/* Cinematic Scrim & Gradient Overlay for Contrast & Depth */}
        <div className="absolute inset-0 bg-[#03151D]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#03151D]/65 via-transparent to-[#03151D]/80" />
      </div>

      {/* Floating Replay Control (Discreet in top-right under navbar) */}
      <button
        ref={replayBtnRef}
        onClick={runOpeningAnimation}
        className="absolute top-24 right-6 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#03151D]/60 hover:bg-[#03151D]/90 border border-white/10 hover:border-[#48B8CE]/50 text-[10px] font-space tracking-widest text-white/60 hover:text-white transition-all backdrop-blur-sm cursor-pointer shadow-lg"
        title="Replay opening sequence"
      >
        <RotateCcw className="w-3 h-3 text-[#48B8CE]" />
        <span className="hidden sm:inline">REPLAY INTRO</span>
      </button>

      {/* 2. Headline Layer — Editorial Luxury Typography (Instrument Serif · Space Grotesk) */}
      <div
        ref={titleRef}
        className="relative z-10 max-w-4xl mx-auto px-6 w-full text-center mt-2 sm:mt-4 md:mt-6 shrink-0 will-change-transform select-none flex flex-col items-center"
      >
        {/* Ambient atmospheric backdrop glow for pristine legibility */}
        <div className="absolute -inset-x-16 -inset-y-10 bg-[radial-gradient(ellipse_at_center,rgba(72,184,206,0.12)_0%,transparent_70%)] pointer-events-none -z-10 blur-2xl" />

        {/* Eyebrow: Space Grotesk */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 bg-white/[0.04] border border-white/10 backdrop-blur-md mb-3 sm:mb-4 shadow-[0_2px_14px_rgba(0,0,0,0.4)]">
          <span className="font-space text-[10px] sm:text-[11px] md:text-xs tracking-[0.24em] uppercase text-[#DCE3E8]/90 font-medium">
            Luxury meets modern science
          </span>
        </div>

        {/* Headline: Instrument Serif */}
        <h1 className="font-instrument text-4xl sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] leading-[1.08] sm:leading-[1.04] text-center drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] tracking-[-0.01em]">
          <span className="block text-white font-normal">
            Chemistry,
          </span>
          <span className="block mt-0.5 sm:mt-1 italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#DCE3E8] to-[#9CBAC7] pr-2">
            captured in a bottle.
          </span>
        </h1>
      </div>

      {/* 3. Central Physical Product Display: Four Flacons with Plinths extending to bottom of screen */}
      <div
        ref={stageRef}
        className="relative z-20 w-full max-w-6xl xl:max-w-7xl mx-auto px-4 flex-1 min-h-0 flex flex-col justify-end items-center pb-0"
      >
        {/* The 4 Staggered Plinths & Bottles extending to the bottom edge */}
        <div className="relative flex items-end justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-11 w-full">
          {FRAGRANCES.map((fragrance, idx) => {
            const isActive = idx === activeFragranceIndex;
            return (
              <div
                key={fragrance.id}
                ref={el => {
                  entranceRefs.current[idx] = el;
                }}
                className="will-change-transform flex flex-col justify-end"
              >
                <div
                  onMouseEnter={() => setActiveFragranceIndex(idx)}
                  onClick={() => onSelectFragrance(fragrance)}
                  className={`relative flex flex-col items-center justify-end transition-all duration-500 cursor-pointer ${isActive ? 'scale-[1.02] z-20' : 'opacity-90 hover:opacity-100 z-10'
                    }`}
                >
                  {/* Active Indicator Light Beam */}
                  {isActive && isIntroComplete && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-fadeIn">
                      <span className="font-space text-[10px] tracking-[0.22em] uppercase text-[#03151D] bg-white/95 px-2.5 py-0.5 font-medium shadow-sm whitespace-nowrap">
                        {fragrance.name}
                      </span>
                      <div className="w-[1px] h-2.5 bg-[#48B8CE]" />
                    </div>
                  )}

                  {/* Conical Perfume Bottle with Brushed Metal Plinth extending to screen bottom */}
                  <MoleculeXBottle
                    fragrance={fragrance}
                    size="hero"
                    showPedestal={true}
                    extendToBottom={true}
                    pedestalHeight={heroPedestalHeights[idx]}
                    pedestalClassName="hero-pedestal will-change-transform"
                    interactive={true}
                    visualId={idx === 3 ? "hero-last-bottle-visual" : undefined}
                    svgId={idx === 3 ? "hero-last-bottle-svg" : undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

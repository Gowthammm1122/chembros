import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Curated High-Resolution Luxury Perfume Stock Images (10 total, portrait 2:3 ratio)
const GALLERY_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85', // Golden amber flacon with warm cinematic sunlight
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85', // Architectural clear perfume flacon on stone pedestal
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85', // Minimalist amber extrait bottle with delicate shadows
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85', // Moody dark luxury flacon with crystal refractions
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1200&q=85', // Luminous floral essence bottle with botanical atmosphere
  'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&q=85', // Modern laboratory glass flacon with subtle emerald hue
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=85', // Studio still-life luxury perfume with geometric silhouettes
  'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=85', // Gold atomizer perfume flacon with ambient light prism
  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1200&q=85', // Artisanal sculpted flacon on textured plaster plinth
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=85', // Rare botanical aromatic bottle in dark apothecary setting
];

// Scattered Grid Layout Algorithm
function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let placed = 0;
  let r = 0;
  while (placed < count) {
    const row: number[] = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = placed++;
    if (r % 3 === 0 && placed < count) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = placed++;
    }
    rows.push(row);
    r++;
  }
  return rows;
}

export const PrmptExperience: React.FC = () => {
  // Container & viewport refs
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinnedStageRef = useRef<HTMLDivElement | null>(null);

  // Black panel & gallery refs
  const blackPanelRef = useRef<HTMLDivElement | null>(null);
  const innerWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive column count
  const [cols, setCols] = useState<number>(4);
  const [totalHeight, setTotalHeight] = useState<string>('400vh');

  // Grid layout memoization
  const gridRows = useMemo(() => buildLayout(GALLERY_IMAGES.length, cols), [cols]);

  // Handle responsive columns
  useEffect(() => {
    const checkViewport = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 1024) setCols(3);
      else setCols(4);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Main ScrollTrigger & RAF Scroll-Driven Animation
  useEffect(() => {
    const root = rootRef.current;
    const stage = pinnedStageRef.current;
    const blackPanel = blackPanelRef.current;
    const innerWrapper = innerWrapperRef.current;
    if (!root || !stage || !blackPanel || !innerWrapper) return;

    let rafId: number;

    const ctx = gsap.context(() => {
      // Calculate dynamic scroll distance
      const vh = window.innerHeight;
      const wrapHeight = innerWrapper.scrollHeight || 1600;
      const maxScroll = Math.max(vh, wrapHeight - vh);
      // Phase 1: 1 vh (black screen slides up) + Phase 2: maxScroll (gallery scrolls) + padding
      const totalScrollDist = vh + maxScroll + vh * 0.4;
      const totalContainerHeight = totalScrollDist + vh;

      setTotalHeight(`${totalContainerHeight}px`);

      // Create pinning ScrollTrigger on root container
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const scroll = self.progress * totalScrollDist;

          // 1. PHASE 1: Plain Background with Text -> Black Panel slides up covering it
          if (scroll <= vh) {
            const panelOffset = Math.max(0, vh - scroll);
            blackPanel.style.transform = `translateY(${panelOffset}px)`;
            innerWrapper.style.transform = 'translateY(0px)';
          }
          // 2. PHASE 2: Black Panel Locked -> Scattered Gallery Grid Translates Up
          else {
            blackPanel.style.transform = 'translateY(0px)';
            const galleryOffset = -(scroll - vh);
            innerWrapper.style.transform = `translateY(${galleryOffset}px)`;
          }

          // Per-frame card scale calculation based on viewport entry/exit
          cardElementsRef.current.forEach((card) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const top = rect.top;
            const bottom = rect.bottom;

            if (bottom <= 0 || top >= vh) {
              card.style.transform = 'scale(0)';
            } else {
              const enter = Math.min(1, (vh - top) / (vh * 0.55));
              const exit = Math.min(1, bottom / (vh * 0.45));
              const finalScale = Math.max(0, Math.min(enter, exit));
              card.style.transform = `scale(${finalScale.toFixed(4)})`;
            }
          });
        },
      });

      // Continuous RAF loop to ensure smooth card scaling during momentum scroll
      const updateCardsLoop = () => {
        const vh = window.innerHeight;
        cardElementsRef.current.forEach((card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const top = rect.top;
          const bottom = rect.bottom;

          if (bottom <= 0 || top >= vh) {
            card.style.transform = 'scale(0)';
          } else {
            const enter = Math.min(1, (vh - top) / (vh * 0.55));
            const exit = Math.min(1, bottom / (vh * 0.45));
            const finalScale = Math.max(0, Math.min(enter, exit));
            card.style.transform = `scale(${finalScale.toFixed(4)})`;
          }
        });
        rafId = requestAnimationFrame(updateCardsLoop);
      };

      rafId = requestAnimationFrame(updateCardsLoop);

      return () => {
        cancelAnimationFrame(rafId);
        st.kill();
      };
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, [gridRows]);

  return (
    <section
      id="scroll-spacer"
      ref={rootRef}
      className="relative w-full select-none bg-black font-['Inter_Tight',sans-serif]"
      style={{ height: totalHeight }}
    >
      {/* Pinned 100vh Full-Screen Stage */}
      <div
        ref={pinnedStageRef}
        className="w-full h-screen h-[100vh] h-[100svh] relative overflow-hidden bg-[#051118]"
      >
        {/* ========================================================= */}
        {/* PHASE 1: PLAIN BACKGROUND WITH TEXT                       */}
        {/* ========================================================= */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-14 lg:p-20 z-0 bg-gradient-to-b from-[#040E14] via-[#061822] to-[#040E14]">
          {/* Top Header Label */}
          <div className="flex items-center justify-between w-full border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-[#087A91] uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#087A91] animate-pulse" />
              <span>THE ARCHIVE</span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
              SECTION 03 &bull; VOL. 2026
            </span>
          </div>

          {/* Central Plain Text Block */}
          <div className="max-w-4xl mx-auto text-center my-auto py-12">
            <span className="inline-block font-mono text-[11px] sm:text-xs tracking-[0.35em] text-white/50 uppercase mb-4">
              VISUAL CHRONICLES & SPECIMEN ARCHIVES
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15]">
              Formulation in Motion.
            </h2>
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-white/60 font-light max-w-xl mx-auto leading-relaxed">
              Explore the raw isolates, cryogenic distillates, and harvesting rituals from the Madurai jasmine fields to the laboratory bench.
            </p>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="flex items-center justify-between w-full pt-6 border-t border-white/10 text-white/40 font-mono text-[10px] tracking-widest uppercase">
            <span>CHEM BROS LABORATORY</span>
            <div className="flex items-center gap-2 text-white/70">
              <span>SCROLL TO REVEAL GALLERY</span>
              <svg className="w-3.5 h-3.5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>MADURAI &bull; CHENNAI</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PHASE 2: BLACK SCREEN SLIDES UP + SCATTERED GALLERY       */}
        {/* ========================================================= */}
        <div
          ref={blackPanelRef}
          className="absolute inset-0 bg-black z-10 w-full h-full overflow-hidden will-change-transform shadow-[0_-25px_60px_rgba(0,0,0,0.8)]"
          style={{ transform: 'translateY(100vh)' }}
        >
          {/* Inner Wrapper Translates Up as user continues scrolling in Phase 2 */}
          <div
            ref={innerWrapperRef}
            className="w-full will-change-transform pt-[min(320px,35vh)] pb-[40vh] px-4 sm:px-8 lg:px-12"
          >
            {/* Scattered Responsive Grid: 2 cols (<640), 3 cols (640-1024), 4 cols (>=1024) */}
            <div
              className={`grid gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl mx-auto ${
                cols === 2
                  ? 'grid-cols-2'
                  : cols === 3
                  ? 'grid-cols-3'
                  : 'grid-cols-4'
              }`}
            >
              {gridRows.map((row, rowIdx) =>
                row.map((itemIdx, colIdx) => {
                  if (itemIdx === -1 || !GALLERY_IMAGES[itemIdx]) {
                    // Empty spacer cell in scattered layout
                    return (
                      <div
                        key={`empty-${rowIdx}-${colIdx}`}
                        className="w-full aspect-[2/3] pointer-events-none"
                      />
                    );
                  }

                  const isLeftHalf = colIdx < cols / 2;
                  const transformOrigin = isLeftHalf
                    ? 'right bottom'
                    : 'left bottom';

                  return (
                    <div
                      key={`card-${itemIdx}`}
                      ref={(el) => {
                        cardElementsRef.current[itemIdx] = el;
                      }}
                      className="bp-card relative w-full aspect-[2/3] overflow-hidden bg-[#111111] will-change-transform shadow-2xl rounded-sm border border-white/5"
                      style={{
                        transform: 'scale(0)',
                        transformOrigin,
                      }}
                    >
                      <img
                        src={GALLERY_IMAGES[itemIdx]}
                        alt={`Archive Visual ${itemIdx + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading="lazy"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

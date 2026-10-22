import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FRAGRANCES } from '../data/fragrances';
import { MoleculeXBottle } from './MoleculeXBottle';

gsap.registerPlugin(ScrollTrigger);

interface ScrollBottleTransitionProps {
  isIntroComplete?: boolean;
}

export const ScrollBottleTransition: React.FC<ScrollBottleTransitionProps> = ({
  isIntroComplete = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottleWrapperRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only initialize once hero opening animation is complete
    if (!isIntroComplete) {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx: gsap.Context | null = null;

    const setupAnimation = () => {
      // Find source element (4th bottle in Hero) and target element (Formula 001 bottle in Collection)
      const heroVisual = document.getElementById('hero-last-bottle-visual');
      const targetVisual = document.getElementById('collection-card-formula-001-visual');
      const collectionSection = document.getElementById('collection');

      if (!heroVisual || !targetVisual || !collectionSection || !bottleWrapperRef.current || !containerRef.current) {
        return;
      }

      // Kill previous timeline if any
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      // Temporarily ensure elements are measurable
      const prevHeroVisibility = heroVisual.style.visibility;
      const prevTargetVisibility = targetVisual.style.visibility;
      heroVisual.style.visibility = 'visible';
      targetVisual.style.visibility = 'visible';

      const containerRect = containerRef.current.getBoundingClientRect();
      const heroRect = heroVisual.getBoundingClientRect();
      const targetRect = targetVisual.getBoundingClientRect();

      heroVisual.style.visibility = prevHeroVisibility;
      targetVisual.style.visibility = prevTargetVisibility;

      const heroWidth = heroRect.width;
      const heroHeight = heroRect.height;
      const targetWidth = targetRect.width;
      const targetHeight = targetRect.height;

      const heroLeft = heroRect.left - containerRect.left;
      const heroTop = heroRect.top - containerRect.top;

      const targetLeft = targetRect.left - containerRect.left;
      const targetTop = targetRect.top - containerRect.top;

      const heroCenterX = heroLeft + heroWidth / 2;
      const heroCenterY = heroTop + heroHeight / 2;

      const targetCenterX = targetLeft + targetWidth / 2;
      const targetCenterY = targetTop + targetHeight / 2;

      const deltaX = targetCenterX - heroCenterX;
      const deltaY = targetCenterY - heroCenterY;
      const scaleRatio = targetWidth / heroWidth;

      // Position the floating bottle container precisely on top of Hero Bottle 4 in container space
      gsap.set(bottleWrapperRef.current, {
        position: 'absolute',
        left: heroLeft,
        top: heroTop,
        width: heroWidth,
        height: heroHeight,
        transformOrigin: '50% 50%',
        clearProps: 'transform',
      });

      // Initially hidden until scroll begins
      gsap.set(bottleWrapperRef.current, { autoAlpha: 0 });

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: collectionSection,
            start: 'top 98%',
            end: 'top top',
            scrub: 1.1,
            invalidateOnRefresh: true,
            onUpdate: self => {
              const p = self.progress;
              if (p <= 0.002) {
                // At Hero: Hero bottle 4 is visible, floating is hidden, target is normal
                gsap.set(bottleWrapperRef.current, { autoAlpha: 0 });
                gsap.set(heroVisual, { autoAlpha: 1 });
                gsap.set(targetVisual, { autoAlpha: 1 });
              } else if (p >= 0.998) {
                // Docked at Card 1: Target bottle takes over, hero bottle hidden, floating hidden
                gsap.set(bottleWrapperRef.current, { autoAlpha: 0 });
                gsap.set(heroVisual, { autoAlpha: 0 });
                gsap.set(targetVisual, { autoAlpha: 1 });
              } else {
                // In Flight: Floating bottle active, source & destination masked for seamlessness
                gsap.set(bottleWrapperRef.current, { autoAlpha: 1 });
                gsap.set(heroVisual, { autoAlpha: 0 });
                gsap.set(targetVisual, { autoAlpha: 0 });
              }
            },
          },
        });

        // Choreographed Tilt & Float Flight Path
        // 1. Liftoff & Tilt (0% -> 30%): Bottle floats up on an arc and tilts elegantly -15deg
        tl.to(bottleWrapperRef.current, {
          x: deltaX * 0.28,
          y: deltaY * 0.2 - 42,
          rotation: -15,
          rotateY: 10,
          rotateX: 4,
          scale: 0.96,
          ease: 'power2.out',
          duration: 0.35,
        });

        // 2. Transversal Flight (30% -> 70%): Majestic diagonal glide across screen
        tl.to(bottleWrapperRef.current, {
          x: deltaX * 0.72,
          y: deltaY * 0.68 - 12,
          rotation: -12,
          rotateY: 6,
          rotateX: 2,
          scale: 1 - (1 - scaleRatio) * 0.7,
          ease: 'none',
          duration: 0.35,
        });

        // 3. Precision Docking (70% -> 100%): Level out, align rotation to 0, fit into Card 1
        tl.to(bottleWrapperRef.current, {
          x: deltaX,
          y: deltaY,
          rotation: 0,
          rotateY: 0,
          rotateX: 0,
          scale: scaleRatio,
          ease: 'power2.inOut',
          duration: 0.3,
        });

        // Aura radiance expansion during mid-flight
        if (glowRef.current) {
          tl.to(
            glowRef.current,
            {
              opacity: 0.65,
              scale: 1.25,
              duration: 0.45,
              ease: 'power2.out',
            },
            0
          ).to(
            glowRef.current,
            {
              opacity: 0.2,
              scale: 0.85,
              duration: 0.55,
              ease: 'power2.in',
            },
            0.45
          );
        }

        timelineRef.current = tl;
        setIsReady(true);
      });
    };

    // Small delay to ensure DOM layout has stabilized after intro
    const timer = setTimeout(setupAnimation, 120);

    const handleRefresh = () => {
      setupAnimation();
    };

    window.addEventListener('resize', handleRefresh);
    ScrollTrigger.addEventListener('refresh', handleRefresh);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleRefresh);
      ScrollTrigger.removeEventListener('refresh', handleRefresh);
      if (ctx) ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      // Restore natural opacities on teardown
      const heroVisual = document.getElementById('hero-last-bottle-visual');
      const targetVisual = document.getElementById('collection-card-formula-001-visual');
      if (heroVisual) gsap.set(heroVisual, { autoAlpha: 1 });
      if (targetVisual) gsap.set(targetVisual, { autoAlpha: 1 });
    };
  }, [isIntroComplete]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-35 overflow-visible"
      aria-hidden="true"
    >
      <div
        ref={bottleWrapperRef}
        className="will-change-transform transform-gpu flex items-center justify-center opacity-0"
        style={{
          perspective: 1000,
        }}
      >
        {/* The Exact Conical Flacon SVG of Formula 001 */}
        <MoleculeXBottle
          fragrance={FRAGRANCES[0]}
          size="hero"
          showPedestal={false}
          interactive={false}
          className="filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
        />
      </div>
    </div>
  );
};

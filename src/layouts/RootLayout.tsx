import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { StoryModal, ContactModal, PolicyModal } from '../components/InfoModals';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { useCart } from '../context/CartContext';

// Global Lenis instance — shared with ScrollTrigger and subcomponents
export let globalLenis: Lenis | null = null;

export const RootLayout: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();

  const {
    isCartOpen,
    closeCart,
    selectedFragranceForModal,
    closeSpecimenModal,
    addToCart,
    isStoryOpen,
    closeStory,
    isContactOpen,
    closeContact,
    activePolicy,
    closePolicy,
  } = useCart();

  // ─── Lenis Smooth Scroll + GSAP ScrollTrigger Bridge ──────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      infinite: false,
      autoRaf: false,
    });

    globalLenis = lenis;
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // Store ticker fn reference so we can remove it exactly
    const rafTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafTick);
      lenis.destroy();
      globalLenis = null;
      lenisRef.current = null;
    };
  }, []);

  // Pause smooth scroll while any modal or drawer is open
  useEffect(() => {
    if (!lenisRef.current) return;
    const isModalOpen = !!(selectedFragranceForModal || isStoryOpen || isContactOpen || activePolicy || isCartOpen);
    if (isModalOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [selectedFragranceForModal, isStoryOpen, isContactOpen, activePolicy, isCartOpen]);

  // Refresh ScrollTrigger calculations whenever route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-[#0A2533] relative selection:bg-[#087A91]/20 selection:text-[#073849] flex flex-col justify-between">
      <ScrollToTop />

      {/* Global Luxury Sticky Navigation */}
      <Navbar />

      {/* Routed Page Content */}
      <main className="relative flex-1">
        <Outlet />
      </main>

      {/* Global Minimal Dark Luxury Footer */}
      <Footer />

      {/* Global Cart Slide-over Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />


      {/* Global Auxiliary Modals */}
      <StoryModal isOpen={isStoryOpen} onClose={closeStory} />
      <ContactModal isOpen={isContactOpen} onClose={closeContact} />
      <PolicyModal type={activePolicy} onClose={closePolicy} />
    </div>
  );
};

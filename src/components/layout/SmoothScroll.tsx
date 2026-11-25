import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { scrollToTarget, setLenis } from '../../lib/lenis';
import { useReady } from '../../lib/ready';

/**
 * Mounts Lenis (buttery inertial scrolling), routes in-page `#anchor` clicks through it,
 * and resets / restores scroll position on navigation. Renders nothing.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const location = useLocation();
  const ready = useReady();

  useEffect(() => {
    // Lenis owns scroll position; let it (not the browser) decide where a reload starts.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    let rafId = 0;
    let cancelled = false;
    let lenis: any = null;

    if (!reduce) {
      import('lenis').then((mod) => {
        if (cancelled) return;
        const Lenis: any = (mod as any).default ?? mod;
        lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
        setLenis(lenis);
        const loop = (t: number) => {
          lenis.raf(t);
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
      });
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      e.preventDefault();
      if (href === '#' || href === '#top') {
        scrollToTarget(0);
        return;
      }
      const el = document.querySelector(href) as HTMLElement | null;
      if (el) scrollToTarget(el);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, [reduce]);

  // New page → top. Same page with #hash → glide to that section once it exists.
  useEffect(() => {
    if (!location.hash) {
      scrollToTarget(0, { immediate: true });
      return;
    }
    if (!ready) return; // wait for the intro curtain — Lenis is paused until then
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.querySelector(location.hash) as HTMLElement | null;
      if (el || ++tries > 30) {
        window.clearInterval(timer);
        if (el) scrollToTarget(el, { duration: 1.6 });
      }
    }, 80);
    return () => window.clearInterval(timer);
  }, [location.pathname, location.hash, ready]);

  return null;
}

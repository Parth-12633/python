import { useEffect, useRef } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { getLenis } from '../../lib/lenis';
import { LogoMark } from './Logo';

/** One-time-per-session intro: big lime counter climbs to 100, curtain lifts. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    getLenis()?.stop();
    const controls = animate(0, 100, {
      duration: reduce ? 0.2 : 1.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (counter.current) counter.current.textContent = String(Math.round(v));
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
      },
      onComplete: () => window.setTimeout(onDone, 150)
    });
    return () => {
      controls.stop();
      document.documentElement.style.overflow = '';
      getLenis()?.start();
    };
  }, [onDone, reduce]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-black p-6 md:p-10"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      aria-hidden
    >
      <div className="flex items-center gap-3">
        <LogoMark size={36} />
        <span className="font-display text-2xl font-semibold text-neon">NovaCraft Studio</span>
      </div>

      <div className="flex items-end justify-between">
        <span className="max-w-[10rem] text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Loading the studio</span>
        <span className="font-display text-[clamp(6rem,24vw,20rem)] font-semibold leading-[0.8] tabular-nums text-neon">
          <span ref={counter}>0</span>
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/10">
        <div ref={bar} className="h-full origin-left bg-neon" style={{ transform: 'scaleX(0)' }} />
      </div>
    </motion.div>
  );
}

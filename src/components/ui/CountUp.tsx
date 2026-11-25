import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Counts from 0 to `to` when scrolled into view. Writes straight to the DOM — no re-renders. */
export function CountUp({ to, suffix = '', duration = 2.2, className }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView || reduce) {
      node.textContent = `${reduce ? to : 0}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      }
    });
    return () => controls.stop();
  }, [inView, reduce, to, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

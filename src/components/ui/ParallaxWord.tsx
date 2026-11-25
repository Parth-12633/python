import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Giant outlined word that drifts sideways behind a section as you scroll past it. */
export function ParallaxWord({ text, top = '8%', from = '12%', to = '-30%', lime = false }: { text: string; top?: string; from?: string; to?: string; lime?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 -z-10 overflow-hidden" style={{ top, height: '1.2em', fontSize: 'clamp(8rem,26vw,26rem)' }}>
      <motion.span
        style={reduce ? undefined : { x, color: 'transparent', WebkitTextStroke: `2px ${lime ? 'rgba(183,255,0,0.55)' : 'rgba(255,255,255,0.3)'}` }}
        className="block whitespace-nowrap font-display font-semibold uppercase leading-none tracking-[-0.04em]"
      >
        {text}
      </motion.span>
    </div>
  );
}

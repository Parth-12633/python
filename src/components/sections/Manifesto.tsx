import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const copy =
  'We are a software studio that treats every product like our own. *Clean architecture.* *Considered design.* *Production-grade AI.* Delivered in weeks — owned by you, forever.';

type Tok = { w: string; hi: boolean };

function tokens(): Tok[] {
  let hi = false;
  return copy.split(' ').map((raw) => {
    let w = raw;
    if (w.startsWith('*')) { hi = true; w = w.slice(1); }
    const cur = hi;
    if (w.endsWith('*')) { hi = false; w = w.slice(0, -1); }
    return { w, hi: cur };
  });
}

function Word({ t, progress, range }: { t: Tok; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.28em] inline-block ${t.hi ? 'text-neon' : 'text-white'}`}>
      {t.w}
    </motion.span>
  );
}

/** Statement paragraph whose words light up one by one, scrubbed by scroll position. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const list = tokens();

  return (
    <section ref={ref} className="relative px-6 py-28 md:px-12 md:py-44 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-10">The studio</p>
        <p className="font-display text-[clamp(1.9rem,4.6vw,4rem)] font-semibold uppercase leading-[1.08] tracking-[-0.015em]">
          {list.map((t, i) => {
            const start = i / list.length;
            return <Word key={i} t={t} progress={scrollYProgress} range={[start * 0.85, Math.min(1, start * 0.85 + 0.12)]} />;
          })}
        </p>
      </div>
    </section>
  );
}

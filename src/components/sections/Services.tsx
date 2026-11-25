import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { services } from '../../data/siteData';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ParallaxWord } from '../ui/ParallaxWord';
import { SectionHeader } from '../ui/SectionHeader';

function StackCard({ s, i, stack }: { s: (typeof services)[number]; i: number; stack: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = s.icon;
  // As later cards slide over this one, it shrinks and dims.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, stack ? 0.9 : 1]);
  const dim = useTransform(scrollYProgress, [0, 1], [1, stack ? 0.35 : 1]);

  return (
    <div ref={ref} className={stack ? 'sticky mb-6' : 'mb-6'} style={stack ? { top: `${6 + i * 1.1}rem` } : undefined}>
      <motion.article
        style={{ scale, opacity: dim, transformOrigin: 'top center' }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="group relative grid gap-8 overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] p-7 transition-colors duration-500 hover:border-neon/60 md:grid-cols-[1.2fr_1fr] md:p-12"
      >
        <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-neon transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
        <span className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[12rem] font-semibold leading-none text-white/[0.04] md:text-[16rem]">
          0{i + 1}
        </span>

        <div className="relative">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-neon/50 text-neon transition-all duration-700 group-hover:rotate-[360deg] group-hover:bg-neon group-hover:text-black">
            <Icon size={24} />
          </span>
          <h3 className="mt-8 font-display text-[2rem] font-semibold uppercase leading-[1.02] text-white md:text-[3rem]">{s.title}</h3>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-white/60">{s.description}</p>
        </div>

        <div className="relative flex flex-col justify-between gap-8">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {s.points.map((p, k) => (
              <li key={p} className="flex items-center justify-between py-4 text-sm text-white/80 transition-all duration-500 group-hover:pl-2">
                {p}
                <span className="text-xs font-semibold text-neon">[0{k + 1}]</span>
              </li>
            ))}
          </ul>
          <a href="#contact" className="inline-flex items-center gap-3 self-start text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:text-neon">
            <span className="link-underline">Start a conversation</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={15} />
            </span>
          </a>
        </div>
      </motion.article>
    </div>
  );
}

export function Services() {
  const stack = useMediaQuery('(min-width: 768px)');
  return (
    <section id="services" className="relative px-6 py-28 md:px-12 md:py-36 lg:px-16">
      <ParallaxWord text="Services" top="4%" />
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Services" title={'What we *build*'} description="End-to-end product engineering — from the first sketch to production scale." />
        <div className="mt-16">
          {services.map((s, i) => (
            <StackCard key={s.title} s={s} i={i} stack={stack} />
          ))}
        </div>
      </div>
    </section>
  );
}

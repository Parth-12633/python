import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { benefits } from '../../data/siteData';
import { EASE, Reveal } from '../ui/Reveal';
import { ParallaxWord } from '../ui/ParallaxWord';
import { SectionHeader } from '../ui/SectionHeader';

export function WhyUs() {
  return (
    <section id="why" className="relative px-6 py-28 md:px-12 md:py-36 lg:px-16">
      <ParallaxWord text="Why" top="2%" lime />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            eyebrow="Why NovaCraft Studio"
            title={'Strategy, design, execution. *One roof.*'}
            description="One senior team owns the whole journey — so nothing gets lost between the pitch, the pixels, and production."
          />
        </div>

        <ul>
          {benefits.map((b, i) => (
            <li key={b.title} className="relative">
              {/* border line that draws itself in */}
              <motion.span
                className="absolute inset-x-0 top-0 h-px origin-left bg-white/15"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 1.2, delay: i * 0.08, ease: EASE }}
              />
              <Reveal delay={i * 0.06} y={30}>
                <div className="group relative flex items-center gap-6 overflow-hidden px-2 py-9 md:gap-10 md:py-11">
                  {/* hover sweep */}
                  <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/[0.06] to-transparent transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
                  <span className="relative font-mono text-sm tracking-widest text-white/30 transition-colors duration-500 group-hover:text-brand-blue">
                    0{i + 1}
                  </span>
                  <div className="relative flex-1 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3">
                    <h3 className="font-display text-[1.8rem] font-semibold uppercase leading-[1.05] text-white md:text-[2.4rem]">{b.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-white/50">{b.text}</p>
                  </div>
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-500 group-hover:rotate-45 group-hover:border-white group-hover:bg-neon group-hover:text-black">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
          <li className="relative h-px">
            <motion.span
              className="absolute inset-0 origin-left bg-white/15"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            />
          </li>
        </ul>
      </div>
    </section>
  );
}

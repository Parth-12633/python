import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import ReactGA from 'react-ga4';
import { Check } from 'lucide-react';
import { steps } from '../../data/siteData';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { scrollToTarget } from '../../lib/lenis';
import { EASE } from '../ui/Reveal';
import { ParallaxWord } from '../ui/ParallaxWord';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Desktop: a tall scroll track with a pinned panel — scrolling advances through the six stages.
 * Mobile/tablet: simple tabs. Both are clickable.
 */
export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [index, setIndex] = useState(0);
  const first = useRef(true);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!isDesktop) return;
    setIndex(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length * 0.999))));
  });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ReactGA.event({ category: 'Engagement', action: 'Process Step Viewed', label: steps[index].label });
  }, [index]);

  const goTo = (i: number) => {
    if (isDesktop && trackRef.current) {
      const top = trackRef.current.getBoundingClientRect().top + window.scrollY;
      const range = trackRef.current.offsetHeight - window.innerHeight;
      scrollToTarget(top + range * ((i + 0.5) / steps.length), { offset: 0, duration: 1.2 });
    } else {
      setIndex(i);
    }
  };

  const step = steps[index];
  const StepIcon = step.icon;

  return (
    <section id="process" className="relative px-6 pt-28 md:px-12 md:pt-36 lg:px-16">
      <ParallaxWord text="Process" top="2%" lime />
      <div className="aurora-blob -left-40 top-1/3 -z-10 h-[34rem] w-[34rem] bg-violet-700/20" />
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="How we work"
          title={'Ambition to *execution.* No friction.'}
          description="We combine strategic clarity, premium product design, and thoughtful engineering to build systems that feel effortless to use and durable in the long term."
        />
      </div>

      <div ref={trackRef} className="relative mx-auto mt-14 max-w-7xl lg:mt-8" style={isDesktop ? { height: `${steps.length * 70}vh` } : undefined}>
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-10">
          <div className="grid w-full gap-6 lg:grid-cols-[17rem_1fr] xl:grid-cols-[19rem_1fr]">
            {/* Step rail */}
            <div className="relative">
              {/* mobile: horizontal scroll tabs */}
              <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:hidden">
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ${
                      i === index ? 'border-white/40 bg-neon text-black' : 'border-white/10 bg-white/[0.03] text-white/60'
                    }`}
                  >
                    <span className="mr-2 font-mono text-[10px] opacity-60">{s.number}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* desktop: vertical rail with filling progress line */}
              <ol className="relative hidden lg:block">
                <span className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-white/10" />
                <motion.span
                  className="absolute left-[1.15rem] top-3 w-px origin-top bg-neon"
                  style={{ scaleY: fill, bottom: '0.75rem' }}
                />
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === index;
                  const done = i < index;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        className="group relative flex w-full items-center gap-4 py-3.5 text-left"
                      >
                        <span
                          className={`relative z-10 flex h-[2.35rem] w-[2.35rem] shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                            active
                              ? 'scale-110 border-white/50 bg-neon text-black '
                              : done
                                ? 'border-brand-blue/40 bg-brand-blue/15 text-brand-blue'
                                : 'border-white/12 bg-ink-900 text-white/40 group-hover:border-white/30 group-hover:text-white/80'
                          }`}
                        >
                          {done ? <Check size={15} /> : <Icon size={15} />}
                        </span>
                        <span className="flex flex-col">
                          <span className={`font-mono text-[10px] tracking-[0.25em] transition-colors ${active ? 'text-brand-blue' : 'text-white/30'}`}>{s.number}</span>
                          <span
                            className={`font-display text-[1.65rem] leading-tight transition-all duration-500 ${
                              active ? 'translate-x-1 text-white' : 'text-white/40 group-hover:text-white/75'
                            }`}
                          >
                            {s.label}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Stage panel */}
            <div className="glass relative min-h-[34rem] overflow-hidden rounded-xl p-7 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)] md:p-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`ghost-${step.id}`}
                  aria-hidden
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[16rem] leading-none text-white/[0.035] md:text-[22rem]"
                >
                  {step.number}
                </motion.span>
              </AnimatePresence>

              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
                  Stage {step.number} / 0{steps.length}
                </span>
                <div className="flex gap-1.5">
                  {steps.map((s, i) => (
                    <span key={s.id} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-white' : i < index ? 'w-3 bg-brand-blue/70' : 'w-3 bg-white/15'}`} />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="relative mt-8 grid gap-10 xl:grid-cols-[1.35fr_1fr]"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-brand-blue/25 bg-brand-blue/10 text-brand-blue">
                      <StepIcon size={22} />
                    </span>
                    <h3 className="mt-6 font-display text-[2.4rem] leading-[1.05] text-white md:text-[3.1rem]">{step.heading}</h3>
                    <p className="mt-4 max-w-lg text-[15px] leading-7 text-white/65">{step.description}</p>

                    <p className="mb-4 mt-9 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">What you get</p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {step.deliverables.map((d, i) => (
                        <motion.li
                          key={d}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                          className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white/80"
                        >
                          <Check size={14} className="shrink-0 text-brand-cyan" />
                          {d}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between gap-8 xl:border-l xl:border-white/10 xl:pl-10">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">Typical duration</p>
                      <p className="mt-3 font-display text-[5rem] leading-none text-neon">{step.duration}</p>
                      <p className="mt-2 text-sm text-white/45">{step.durationLabel}</p>
                    </div>
                    <div>
                      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">Key output</p>
                      <blockquote className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 font-display text-xl  leading-snug text-white/85">
                        “{step.output}”
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

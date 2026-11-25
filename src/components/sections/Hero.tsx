import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import ReactGA from 'react-ga4';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CALENDLY_URL, HERO_VIDEO_URL } from '../../config';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReady } from '../../lib/ready';
import { SplitText } from '../ui/SplitText';
import { Magnetic } from '../ui/Magnetic';
import { EASE } from '../ui/Reveal';

const points = ['Custom web apps & SaaS', 'AI & automation systems', 'Analytics dashboards', 'Enterprise ERPs & portals', 'Wedding & event invitations'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useReady();
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const headX = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const badgeRot = useTransform(scrollYProgress, [0, 1], [0, 540]);

  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay, ease: EASE }
  });

  return (
    <section id="top" ref={ref} className="hero-min-height relative isolate flex flex-col overflow-hidden bg-black">
      {/* Background: monochrome footage, dimmed, under a faint grid */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        {wide && !reduce && (
          <video
            className={`absolute inset-0 h-full w-full scale-105 object-cover grayscale transition-opacity duration-[2000ms] ${videoReady ? 'opacity-35' : 'opacity-0'}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        )}
        <div className="grid-bg absolute inset-0" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.2)_40%,#000_100%)]" />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-24 pt-36 md:px-10"
      >
        <motion.p {...appear(0.1)} className="eyebrow mb-8">
          Software · AI · Product studio
        </motion.p>

        <motion.div style={reduce ? undefined : { x: headX }}>
        <SplitText
          as="h1"
          when={ready}
          delay={0.1}
          stagger={0.08}
          text={'We build the\nsoftware *others*\nonly promise.'}
          className="text-[clamp(2.6rem,7.4vw,7rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em] text-white"
        />
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.p {...appear(0.9)} className="font-display text-lg font-semibold uppercase tracking-wide text-neon md:text-2xl">
              Premium products. Real engineering. Zero fluff.
            </motion.p>
            <motion.p {...appear(1.0)} className="mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">
              Professional software agency helping businesses build modern digital products, AI applications, analytics platforms, and enterprise solutions.
            </motion.p>
            <motion.div {...appear(1.15)} className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => ReactGA.event({ category: 'Contact', action: 'Book Call Clicked' })}
                  className="btn btn-primary group"
                >
                  Book a free call
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#projects" className="btn btn-ghost group">
                  Explore the work
                  <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* Spec-sheet card with corner registration marks */}
          <motion.div {...appear(1.3)} className="hidden lg:block">
            <div className="corners w-[22rem] border border-white/20 bg-black/70 p-6">
              <i className="corner" /><i className="corner" /><i className="corner" /><i className="corner" />
              <p className="eyebrow">What we ship</p>
              <ul className="mt-5 divide-y divide-white/10">
                {points.map((p, i) => (
                  <li key={p} className="flex items-center justify-between py-3 text-sm text-white/85">
                    {p}
                    <span className="text-xs font-semibold text-neon">0{i + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.dl {...appear(1.35)} className="mt-14 grid max-w-3xl grid-cols-3 border-t border-white/20 pt-6">
          {[
            ['20+', 'Projects delivered'],
            ['2–4 wks', 'Average sprint'],
            ['100%', 'Code ownership']
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="font-display text-3xl font-semibold text-white md:text-5xl">{v}</dt>
              <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{l}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
      {/* Scroll badge — spins as you scroll */}
      <a href="#about" aria-label="Scroll down" className="absolute bottom-8 right-8 z-10 hidden h-28 w-28 items-center justify-center md:flex">
        <motion.svg viewBox="0 0 120 120" className="absolute inset-0" style={{ rotate: badgeRot }}>
          <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
          <text fill="#B7FF00" fontSize="11" fontWeight="600" letterSpacing="3.2" style={{ textTransform: 'uppercase' }}>
            <textPath href="#circ">Scroll to explore • Scroll to explore •</textPath>
          </text>
        </motion.svg>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neon text-black"><ArrowRight size={20} className="rotate-90" /></span>
      </a>
    </section>
  );
}

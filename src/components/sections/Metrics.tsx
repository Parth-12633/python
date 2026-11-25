import { agencyMetrics } from '../../data/siteData';
import { CountUp } from '../ui/CountUp';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';
import { ParallaxWord } from '../ui/ParallaxWord';
import { SectionHeader } from '../ui/SectionHeader';
import { SpotlightCard } from '../ui/SpotlightCard';

export function Metrics() {
  return (
    <section id="about" className="relative px-6 py-28 md:px-12 md:py-36 lg:px-16">
      <ParallaxWord text="Studio" top="2%" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <SectionHeader eyebrow="Agency Metrics" title={'Built to launch. *Built to last.*'} />
          <Reveal delay={0.2} className="max-w-md text-[15px] leading-7 text-white/55 lg:pb-3">
            Modern digital products, enterprise platforms and AI-powered solutions — without the bloat. We eliminate agency overhead with direct senior engineering, milestone-driven sprints, and production-ready code from day one.
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {agencyMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <StaggerItem key={m.label} className="h-full">
                <SpotlightCard className="glass group flex h-full flex-col justify-between rounded-xl p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/80 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:border-white/25 group-hover:text-white">
                      <Icon size={19} />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{m.label}</span>
                  </div>
                  <div className="mt-14">
                    <div className="font-display text-[3.6rem] leading-none tracking-tight text-white md:text-[4.2rem]">
                      {m.countTo !== undefined ? <CountUp to={m.countTo} suffix={m.suffix} /> : m.text}
                    </div>
                    <p className="mt-5 text-[13px] leading-6 text-white/55">{m.description}</p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

import { ecosystemColumns, stackStats, techIconMap } from '../../data/siteData';
import { CountUp } from '../ui/CountUp';
import { Marquee } from '../ui/Marquee';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';
import { ParallaxWord } from '../ui/ParallaxWord';
import { SectionHeader } from '../ui/SectionHeader';
import { SpotlightCard } from '../ui/SpotlightCard';

const allTech = Object.keys(techIconMap);
const rowA = allTech.slice(0, Math.ceil(allTech.length / 2));
const rowB = allTech.slice(Math.ceil(allTech.length / 2));

function TechPill({ name, onSelect }: { name: string; onSelect: (t: string) => void }) {
  const Icon = techIconMap[name];
  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      title={`Filter projects built with ${name}`}
      className="group flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.035] px-6 py-3.5 text-[15px] text-white/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
    >
      {Icon && <Icon size={20} className="text-white/60 transition-colors duration-300 group-hover:text-brand-blue" />}
      {name}
    </button>
  );
}

export function TechStack({ onSelect }: { onSelect: (tech: string) => void }) {
  return (
    <section id="tech-stack" className="relative overflow-hidden py-28 md:py-36">
      <ParallaxWord text="Stack" top="2%" lime />
      <div className="aurora-blob left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 bg-indigo-700/15" />
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <SectionHeader
          eyebrow="Technology Stack"
          title={'Modern tooling. *Sharp execution.*'}
          description="We select mature, high-performance technologies built for scale, reliability, and developer ergonomics. Click any technology to view matching case studies."
        />
      </div>

      <Reveal className="mt-16 space-y-4" y={24}>
        <Marquee duration={55} gap="1rem">
          {rowA.map((t) => <TechPill key={t} name={t} onSelect={onSelect} />)}
        </Marquee>
        <Marquee duration={62} gap="1rem" reverse>
          {rowB.map((t) => <TechPill key={t} name={t} onSelect={onSelect} />)}
        </Marquee>
      </Reveal>

      <div className="mx-auto mt-20 max-w-7xl px-6 md:px-12 lg:px-16">
        <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" stagger={0.08}>
          {ecosystemColumns.map((col) => {
            const Icon = col.icon;
            return (
              <StaggerItem key={col.title} className="h-full">
                <SpotlightCard className="glass group flex h-full flex-col rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white/[0.04] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ borderColor: `${col.accent}40`, color: col.accent }}
                    >
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold uppercase leading-tight text-white">{col.title}</h3>
                      <p className="mt-1 text-[13px] leading-5 text-white/50">{col.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.07] pt-5">
                    {col.items.map((item) => {
                      const TIcon = techIconMap[item];
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => onSelect(item)}
                          title={`Filter projects built with ${item}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/75 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: col.accent }} />
                          {TIcon && <TIcon size={13} className="text-white/60" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {stackStats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.05]">
                <div className="font-display text-5xl text-neon">
                  {s.countTo !== undefined ? <CountUp to={s.countTo} suffix={s.suffix} /> : s.text2}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{s.label}</div>
                <div className="mt-2 text-xs leading-5 text-white/45">{s.text}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

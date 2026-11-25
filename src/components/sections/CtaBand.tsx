import { ArrowUpRight } from 'lucide-react';
import { Marquee } from '../ui/Marquee';
import { Magnetic } from '../ui/Magnetic';
import { Reveal } from '../ui/Reveal';

const words = ["Let's build", 'Ship it', 'Scale it'];

/** Big kinetic-type band that bridges "why us" into the contact form. */
export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-y border-white/15 py-16 md:py-24" aria-label="Call to action">
      <Marquee duration={60} gap="3rem">
        {words.map((w, i) => (
          <span key={w} className="flex items-center gap-12 whitespace-nowrap">
            <span
              className="font-display text-[clamp(4rem,13vw,12rem)] font-semibold uppercase leading-none tracking-[-0.03em]"
              style={i % 2 === 1 ? { color: '#B7FF00' } : { color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.8)' }}
            >
              {w}
            </span>
            <span className="h-4 w-4 bg-neon" />
          </span>
        ))}
      </Marquee>
      <Reveal className="mt-12 flex justify-center">
        <Magnetic>
          <a href="#contact" className="btn btn-primary group !px-9 !py-4 !text-lg">
            Start your project
            <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Magnetic>
      </Reveal>
    </section>
  );
}

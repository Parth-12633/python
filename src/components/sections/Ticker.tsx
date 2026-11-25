import { capabilityTicker } from '../../data/siteData';
import { Marquee } from '../ui/Marquee';

const glyphs = ['✚', '●', '▲', '■'];
const reversed = [...capabilityTicker].reverse();

/** Two ribbons that cross each other at opposing tilts and run in opposite directions. */
export function Ticker() {
  return (
    <div className="relative z-10 -my-4 h-[13rem] overflow-hidden md:h-[16rem]" aria-label="Capabilities">
      {/* back ribbon: solid lime */}
      <div className="absolute inset-x-[-6%] top-1/2 -translate-y-1/2 rotate-[2.2deg] bg-neon py-4 text-black md:py-5">
        <Marquee duration={55} gap="2.5rem">
          {capabilityTicker.map((item, i) => (
            <span key={item} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold uppercase tracking-tight md:text-4xl">
              {item}
              <span className="text-xl">{glyphs[i % 4]}</span>
            </span>
          ))}
        </Marquee>
      </div>
      {/* front ribbon: black with white outline type, crossing the lime one */}
      <div className="absolute inset-x-[-6%] top-1/2 -translate-y-1/2 -rotate-[2.2deg] border-y-2 border-white bg-black py-4 md:py-5">
        <Marquee duration={65} gap="2.5rem" reverse>
          {reversed.map((item, i) => (
            <span
              key={item}
              className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold uppercase tracking-tight md:text-4xl"
              style={{ color: 'transparent', WebkitTextStroke: '1.3px #fff' }}
            >
              {item}
              <span className="text-xl text-neon" style={{ WebkitTextStroke: 0 }}>{glyphs[(i + 2) % 4]}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '../../config';
import { getLenis } from '../../lib/lenis';
import { useReady } from '../../lib/ready';
import { Logo } from './Logo';
import { Magnetic } from '../ui/Magnetic';

function NavItem({ id, isHome, children, className, onClick }: { id: string; isHome: boolean; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return isHome ? (
    <a href={`#${id}`} className={className} onClick={onClick}>{children}</a>
  ) : (
    <Link to={{ pathname: '/', hash: `#${id}` }} className={className} onClick={onClick}>{children}</Link>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const ready = useReady();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 520 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  // Highlight the section currently crossing the middle of the viewport.
  useEffect(() => {
    if (!isHome) {
      setActive(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    const attach = window.setTimeout(() => {
      NAV_LINKS.forEach((l) => {
        const el = document.getElementById(l.id);
        if (el) observer.observe(el);
      });
    }, 400);
    const hero = () => window.scrollY < 200 && setActive(null);
    window.addEventListener('scroll', hero, { passive: true });
    return () => {
      window.clearTimeout(attach);
      observer.disconnect();
      window.removeEventListener('scroll', hero);
    };
  }, [isHome]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) getLenis()?.stop();
    else getLenis()?.start();
    return () => {
      document.documentElement.style.overflow = '';
      getLenis()?.start();
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  const highlight = hovered ?? active;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 md:px-6 md:pt-5"
        initial={{ y: -120, opacity: 0 }}
        animate={ready ? { y: hidden && !menuOpen ? -130 : 0, opacity: 1 } : { y: -120, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex h-14 max-w-[1280px] items-center justify-between rounded-full border pl-4 pr-2 transition-all duration-500 md:h-16 md:pl-5 ${
            scrolled
              ? 'border-white/20 bg-black/85 backdrop-blur-md'
              : 'border-white/15 bg-black/40 backdrop-blur-sm'
          }`}
        >
          <Link to="/" aria-label="NovaCraft Studio home" onClick={() => isHome && window.scrollTo({ top: 0 })} className="shrink-0">
            <Logo />
          </Link>

          <ul className="relative hidden items-center gap-1 lg:flex" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((l) => (
              <li key={l.id} className="relative">
                <NavItem
                  isHome={isHome}
                  id={l.id}
                  className={`relative z-10 block rounded-full px-4 py-2 text-[0.84rem] font-medium transition-colors duration-300 ${
                    highlight === l.id ? 'text-neon' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span onMouseEnter={() => setHovered(l.id)}>{l.label}</span>
                </NavItem>
                {highlight === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-neon/15 ring-1 ring-neon/40"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <Magnetic strength={0.2}>
                <NavItem isHome={isHome} id="contact" className="btn btn-primary group !px-5 !py-2.5 !text-[0.84rem]">
                  Book Consultation
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </NavItem>
              </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((p) => !p)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-white/10 bg-white/5 lg:hidden"
            >
              <span className={`h-px w-4 bg-white transition-transform duration-300 ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`h-px w-4 bg-white transition-transform duration-300 ${menuOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[99] flex flex-col justify-between overflow-hidden bg-ink-950/95 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="aurora-blob -right-24 top-10 h-72 w-72 bg-indigo-600/40" />
            <div className="aurora-blob -left-24 bottom-10 h-72 w-72 bg-cyan-500/25" style={{ animationDelay: '-8s' }} />
            <ul className="relative flex flex-col gap-1">
              {[{ label: 'Home', id: '' }, ...NAV_LINKS].map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/[0.07]"
                >
                  {l.id ? (
                    <NavItem isHome={isHome} id={l.id} onClick={() => setMenuOpen(false)} className="flex items-baseline gap-4 py-3.5 font-display text-4xl text-white">
                      <span className="font-mono text-xs text-white/35">0{i}</span>
                      {l.label}
                    </NavItem>
                  ) : (
                    <a href="#" onClick={() => setMenuOpen(false)} className="flex items-baseline gap-4 py-3.5 font-display text-4xl text-white">
                      <span className="font-mono text-xs text-white/35">0{i}</span>
                      {l.label}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="relative">
              <NavItem isHome={isHome} id="contact" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">
                Book Consultation <ArrowUpRight size={16} />
              </NavItem>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

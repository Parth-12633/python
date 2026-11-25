import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import ReactGA from 'react-ga4';
import { ChevronUp } from 'lucide-react';
import { whatsappLink } from '../../config';
import { scrollToTarget } from '../../lib/lenis';

export function FloatingActions() {
  const { scrollY, scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setShowTop(y > 600));

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            onClick={() => scrollToTarget(0, { duration: 1.8 })}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 360, damping: 24 }}
            className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-black text-white border border-white/20"
            aria-label="Back to top"
            title="Back to top"
          >
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <motion.circle cx="24" cy="24" r="22" stroke="#B7FF00" strokeWidth="2" strokeLinecap="round" style={{ pathLength }} />
              <defs>
                <linearGradient id="ring" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#9cc2ff" />
                  <stop offset="1" stopColor="#6ff0d6" />
                </linearGradient>
              </defs>
            </svg>
            <ChevronUp size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => ReactGA.event({ category: 'Contact', action: 'WhatsApp Clicked' })}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center gap-2.5 rounded-full bg-neon py-2 pl-2 pr-2 text-black md:pr-5"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-neon opacity-25" />
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-neon">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.526 5.845L.057 23.571a.5.5 0 00.625.601l5.865-1.539A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.012-1.376l-.36-.213-3.733.979.998-3.645-.234-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
        </span>
        <span className="hidden text-sm font-semibold md:inline">Chat on WhatsApp</span>
      </motion.a>
    </div>
  );
}

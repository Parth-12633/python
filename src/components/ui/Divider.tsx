import { motion } from 'framer-motion';
import { EASE } from './Reveal';

/** Hairline that draws itself across the page, with a lime head. */
export function Divider() {
  return (
    <div className="relative mx-auto h-px max-w-[1400px] px-6 md:px-10">
      <motion.span
        className="absolute inset-x-6 top-0 h-px origin-left bg-white/20 md:inset-x-10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <motion.span
        className="absolute left-6 top-[-3px] h-[7px] w-[7px] bg-neon md:left-10"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </div>
  );
}

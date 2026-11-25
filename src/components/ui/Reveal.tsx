import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  className?: string;
  blur?: boolean;
  scale?: number;
  once?: boolean;
  amount?: number;
};

/** Fades, rises and un-blurs its children the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  x = 0,
  duration = 1,
  className,
  blur = true,
  scale = 1,
  once = true,
  amount = 0.2
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its <StaggerItem> children when scrolled into view. */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  amount = 0.15
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 36 }: { children: ReactNode; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } }
      }}
    >
      {children}
    </motion.div>
  );
}

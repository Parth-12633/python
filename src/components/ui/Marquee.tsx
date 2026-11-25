import { useRef, type ReactNode } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Infinite ticker whose speed reacts to scroll: scroll fast and it surges,
 * scroll up and it reverses direction.
 */
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className = '',
  gap = '1rem'
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  gap?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(reverse ? 1 : -1);
  const base = (reverse ? 1 : -1) * (50 / duration); // % of one half-width per second

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = base * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -Math.sign(base);
    else if (f > 0) dir.current = Math.sign(base);
    move += dir.current * Math.abs(move) * Math.abs(f) * 1.2 * (f < 0 ? 1 : 1);
    baseX.set(baseX.get() + move);
  });

  const item = { gap, paddingRight: gap };
  return (
    <div className={`mask-fade-x overflow-hidden ${className}`}>
      <motion.div className="flex w-max" style={{ x }}>
        <div className="flex shrink-0 items-center" style={item}>{children}</div>
        <div className="flex shrink-0 items-center" style={item} aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}

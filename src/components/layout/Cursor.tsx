import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a, button, input, textarea, label, select, [data-cursor], [role="button"], [role="link"]';

/**
 * Viewfinder cursor: a tiny lime square tracks the pointer exactly while four corner
 * brackets trail it. Over anything clickable the brackets snap open to frame the element.
 * Elements with data-cursor="Label" also get a label tag.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const bx = useMotionValue(-100);
  const by = useMotionValue(-100);
  const bw = useMotionValue(30);
  const bh = useMotionValue(30);
  const sx = useSpring(bx, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(by, { stiffness: 380, damping: 32, mass: 0.5 });
  const sw = useSpring(bw, { stiffness: 380, damping: 30, mass: 0.5 });
  const sh = useSpring(bh, { stiffness: 380, damping: 30, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    let target: HTMLElement | null = null;
    let mouse = { x: -100, y: -100 };

    const sync = () => {
      if (target && document.contains(target)) {
        const r = target.getBoundingClientRect();
        bx.set(r.left + r.width / 2);
        by.set(r.top + r.height / 2);
        bw.set(r.width + 14);
        bh.set(r.height + 14);
      } else {
        bx.set(mouse.x);
        by.set(mouse.y);
        bw.set(30);
        bh.set(30);
      }
    };

    const move = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      x.set(e.clientX);
      y.set(e.clientY);
      sync();
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      target = t;
      setLocked(!!t);
      setLabel((t?.closest('[data-cursor]') as HTMLElement | null)?.dataset.cursor ?? null);
      sync();
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      x.set(-100); y.set(-100); bx.set(-100); by.set(-100);
    };
    const onScroll = () => target && sync();

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [x, y, bx, by, bw, bh]);

  if (!enabled) return null;

  const corner = 'absolute h-2.5 w-2.5 border-neon transition-colors';
  return (
    <>
      {/* corner brackets */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[150]"
        style={{ x: sx, y: sy, width: sw, height: sh, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div className="relative h-full w-full" animate={{ scale: pressed ? 0.82 : 1, rotate: locked ? 0 : 45 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
          <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
          <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
          <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
          <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        </motion.div>
        {label && (
          <span className="absolute left-full top-0 ml-3 whitespace-nowrap bg-neon px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
            {label}
          </span>
        )}
      </motion.div>
      {/* exact-position core */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[151] h-1.5 w-1.5 bg-neon"
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: locked ? 0 : 1 }}
      />
    </>
  );
}

import type { CSSProperties, MouseEvent, ReactNode } from 'react';

/** Card with a cursor-following glow + border highlight. Pure CSS vars → zero React re-renders on mouse move. */
export function SpotlightCard({
  children,
  className = '',
  style,
  tilt = false
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tilt?: boolean;
}) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    el.style.setProperty('--mx', `${px}px`);
    el.style.setProperty('--my', `${py}px`);
    if (tilt) {
      const rx = (py / r.height - 0.5) * -6;
      const ry = (px / r.width - 0.5) * 6;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    }
  };
  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (tilt) e.currentTarget.style.transform = '';
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`spotlight ${className}`}
      style={{ transition: 'transform 0.5s cubic-bezier(.16,1,.3,1), border-color .3s', ...style }}
    >
      {children}
    </div>
  );
}

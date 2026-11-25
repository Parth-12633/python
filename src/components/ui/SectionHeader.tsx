import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { SplitText } from './SplitText';

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
  children
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
}) {
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Reveal y={16} blur={false}>
        <span className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</span>
      </Reveal>
      <SplitText text={title} className="section-title mt-5" />
      {description ? (
        <Reveal delay={0.25} className={`mt-6 max-w-2xl text-base leading-7 text-white/60 md:text-lg ${center ? 'mx-auto' : ''}`}>
          {description}
        </Reveal>
      ) : null}
      {children}
    </div>
  );
}

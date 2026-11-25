import { Fragment, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './Reveal';

type SplitTextProps = {
  /** Plain text. Use *asterisks* around words to render them as gradient s. Use \n for line breaks. */
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** When provided, animation is driven by this flag instead of scroll visibility (used in the hero). */
  when?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
};

type Token = { word: string; em: boolean };

function tokenize(text: string): Token[][] {
  let em = false;
  return text.split('\n').map((line) =>
    line
      .split(' ')
      .filter(Boolean)
      .map((raw) => {
        let word = raw;
        if (word.startsWith('*')) {
          em = true;
          word = word.slice(1);
        }
        const wasEm = em;
        if (word.endsWith('*')) {
          em = false;
          word = word.slice(0, -1);
        }
        return { word, em: wasEm };
      })
  );
}

/** Masked word-by-word headline reveal — each word slides up from behind a clipping line. */
export function SplitText({ text, className = '', delay = 0, stagger = 0.055, when, as = 'h2' }: SplitTextProps) {
  const reduce = useReducedMotion();
  const lines = useMemo(() => tokenize(text), [text]);
  const Tag = motion[as] as typeof motion.h2;

  const trigger =
    when === undefined
      ? { initial: reduce ? 'visible' : 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.6 } }
      : { initial: 'hidden', animate: when || reduce ? 'visible' : 'hidden' };

  return (
    <Tag
      className={className}
      aria-label={text.replace(/\*/g, '').replace(/\n/g, ' ')}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger}
    >
      {lines.map((words, li) => (
        <span key={li} className="block" aria-hidden>
          {words.map((t, wi) => (
            <Fragment key={wi}>
              <span className="inline-block overflow-hidden align-bottom" style={{ paddingTop: '0.12em', marginTop: '-0.12em', paddingBottom: '0.18em', marginBottom: '-0.18em' }}>
                <motion.span
                  className={`inline-block will-change-transform ${t.em ? ' text-neon pr-[0.06em]' : ''}`}
                  variants={{
                    hidden: { y: '118%', rotate: 4, opacity: 0 },
                    visible: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 1.05, ease: EASE } }
                  }}
                  style={{ transformOrigin: 'left bottom' }}
                >
                  {t.word}
                </motion.span>
              </span>
              {wi < words.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

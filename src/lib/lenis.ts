// Tiny singleton so any component can drive the smooth scroller.
type LenisLike = {
  scrollTo: (target: number | string | HTMLElement, opts?: Record<string, unknown>) => void;
  raf: (t: number) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
};

let instance: LenisLike | null = null;

export const getLenis = () => instance;
export const setLenis = (l: LenisLike | null) => {
  instance = l;
};

export function scrollToTarget(
  target: number | string | HTMLElement,
  opts: { offset?: number; immediate?: boolean; duration?: number } = {}
) {
  const offset = opts.offset ?? -88;
  if (instance) {
    instance.scrollTo(target, { offset, immediate: opts.immediate, duration: opts.duration ?? 1.4 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: opts.immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: opts.immediate ? 'auto' : 'smooth' });
  }
}

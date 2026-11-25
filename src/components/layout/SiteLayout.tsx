import { useCallback, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ReadyContext } from '../../lib/ready';
import { Cursor } from './Cursor';
import { FloatingActions } from './FloatingActions';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { Preloader } from './Preloader';
import { ScrollProgress } from './ScrollProgress';
import { SmoothScroll } from './SmoothScroll';

const SEEN_KEY = 'nc-intro-seen';

export function SiteLayout({ children }: { children: ReactNode }) {
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem(SEEN_KEY);
    } catch {
      return false;
    }
  });

  const done = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode */
    }
    setIntro(false);
  }, []);

  return (
    <ReadyContext.Provider value={!intro}>
      <div className="grain relative isolate min-h-screen overflow-x-clip bg-ink-950 text-white">
        <div aria-hidden className="grid-page pointer-events-none fixed inset-0 -z-10" />
        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        <AnimatePresence>{intro && <Preloader key="preloader" onDone={done} />}</AnimatePresence>
        <Navbar />
        {children}
        <Footer />
        <FloatingActions />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'rgba(14,17,28,0.95)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px',
              fontSize: '14px',
              backdropFilter: 'blur(16px)'
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0e111c' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0e111c' } }
          }}
        />
      </div>
    </ReadyContext.Provider>
  );
}

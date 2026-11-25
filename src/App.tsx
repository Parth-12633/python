import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import Home from './pages/Home';

// The case-study page is only needed once a visitor opens a project, so it ships as its own chunk.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <SiteLayout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route
            path="/project/:id"
            element={
              <Page>
                <Suspense fallback={<div className="min-h-screen" />}>
                  <ProjectDetail />
                </Suspense>
              </Page>
            }
          />
          <Route path="*" element={<Page><Home /></Page>} />
        </Routes>
      </AnimatePresence>
    </SiteLayout>
  );
}

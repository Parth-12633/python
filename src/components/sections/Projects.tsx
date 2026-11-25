import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { projectFilters } from '../../data/siteData';
import type { Project } from '../../types';
import { ProjectCard } from '../ProjectCard';
import { Reveal } from '../ui/Reveal';
import { ParallaxWord } from '../ui/ParallaxWord';
import { SectionHeader } from '../ui/SectionHeader';

export function Projects({
  projects,
  projectFilter,
  setProjectFilter
}: {
  projects: Project[];
  projectFilter: string | null;
  setProjectFilter: (v: string | null) => void;
}) {
  const isPreset = projectFilters.some((f) => f.match === projectFilter);

  return (
    <section id="projects" className="relative px-6 py-28 md:px-12 md:py-36 lg:px-16">
      <ParallaxWord text="Work" top="2%" />
      <div className="mx-auto max-w-[1400px]">
        <div id="more-projects" className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Featured Work"
            title={'Selected *work*'}
          />
          <Reveal delay={0.2} className="lg:max-w-xs lg:pb-2">
            <p className="text-sm leading-6 text-white/50">
              {projects.length} selected {projects.length === 1 ? 'project' : 'projects'} — from clinical portals to real-time auction platforms.
            </p>
          </Reveal>
        </div>

        {/* Filter chips */}
        <Reveal delay={0.15} className="mt-10">
          <LayoutGroup id="project-filters">
            <div className="flex flex-wrap items-center gap-2">
              {projectFilters.map((f) => {
                const active = f.match === projectFilter;
                return (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setProjectFilter(f.match)}
                    className={`relative rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                      active ? 'border-transparent text-ink-950' : 'border-white/12 bg-white/[0.03] text-white/65 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {active && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className="relative">{f.label}</span>
                  </button>
                );
              })}
              {projectFilter && !isPreset && (
                <button
                  type="button"
                  onClick={() => setProjectFilter(null)}
                  className="rounded-full border border-brand-blue/40 bg-brand-blue/10 px-4 py-2 text-[13px] text-brand-blue transition hover:bg-brand-blue/20"
                >
                  “{projectFilter}” ✕
                </button>
              )}
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.div layout className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {projects.length > 0 ? (
              projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass col-span-full rounded-xl p-14 text-center text-sm text-white/60"
              >
                No projects match “{projectFilter}” yet.{' '}
                <button type="button" onClick={() => setProjectFilter(null)} className="text-white underline underline-offset-4">
                  Show all work
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

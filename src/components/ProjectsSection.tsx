import React from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

export default function ProjectsSection({
  filteredProjects,
  projectFilter,
  setProjectFilter
}: {
  filteredProjects: Project[];
  projectFilter: string | null;
  setProjectFilter: (v: string | null) => void;
}) {
  return (
    <section id="projects" data-scene-section="projects" className="relative z-20 w-full py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-12">
        <div id="more-projects" className="relative z-20 space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/55">Featured Work</p>
          <div className="relative z-20 mx-auto max-w-3xl text-3xl font-normal leading-tight text-white md:text-5xl">
            A selection of software, AI, analytics, and web work that feels premium, polished, and built to scale.
          </div>
        </div>

        {projectFilter && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-white/75">
            <button
              type="button"
              onClick={() => setProjectFilter(null)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Clear filter
            </button>
            <span className="text-sm">
              Showing {filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'} for "{projectFilter}"
            </span>
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-10 text-center text-sm text-white/70">
              No projects match "{projectFilter}". Try another technology.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

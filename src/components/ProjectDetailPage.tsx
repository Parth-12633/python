import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560"><rect width="900" height="560" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" fill="%23ffffff">Preview unavailable</text></svg>';

export function ProjectDetailPage({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="relative min-h-screen bg-[#050505] px-6 py-8 text-white md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
          <button onClick={onBack} className="self-start rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            ← Back to work
          </button>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/55">Project details</p>
            <h2 className="text-4xl font-bold tracking-[0.01em] text-white md:text-5xl">{project.title}</h2>
            <p className="max-w-3xl text-lg leading-8 text-white/70">{project.overview}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Category</p>
              <p className="mt-3 text-lg font-semibold text-white">{project.category}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Main tools</p>
              <p className="mt-3 text-lg font-semibold text-white">{project.tools.join(', ')}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Outcomes</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {project.results.map((result) => (
                  <li key={result}>• {result}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/55">Challenge</p>
                <p className="mt-3 text-white/70">{project.challenge}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/55">Solution</p>
                <p className="mt-3 text-white/70">{project.solution}</p>
              </div>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Technologies</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.28em] text-white/80">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {project.images.map((image, index) => (
              <div key={image ?? index} className="aspect-video rounded-[1.5rem] overflow-hidden border border-white/10 bg-white/[0.04] flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt={`${project.title} ${index + 1}`}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white/10">{project.initials}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

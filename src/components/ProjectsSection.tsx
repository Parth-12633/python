import React, { useEffect, useRef, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { Check } from 'lucide-react';
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
  const [scale, setScale] = useState(0.5);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      setScale(containerWidth / 1440);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section id="projects" data-scene-section="projects" className="relative z-20 w-full py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 items-stretch">
          <aside className="order-2 flex flex-col h-auto w-full min-w-0 min-w-[320px] rounded-[24px] border border-white/10 bg-white/5 p-9 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl overflow-y-auto lg:order-1">
            <div className="flex min-h-0 flex-col text-white">
              <div className="space-y-6">
                <div className="text-[11px] uppercase tracking-[0.35em] text-white/55">Featured Client Project</div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/20">
                  <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                  Completed & Delivered
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">Dental Clinic Website</h2>
                <p className="max-w-xl text-[14px] leading-tight text-white/70">A premium appointment-first website for a dental practice built to increase bookings, trust, and discovery.</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-white/80">
                <div className="flex h-20 flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Industry</p>
                  <p className="mt-2 text-[13px] text-white">Healthcare</p>
                </div>
                <div className="flex h-20 flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Duration</p>
                  <p className="mt-2 text-[13px] text-white">2 Weeks</p>
                </div>
                <div className="flex h-20 flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Platform</p>
                  <p className="mt-2 text-[13px] text-white">Responsive Website</p>
                </div>
              </div>

              {/* Services + Technologies (restored) */}
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Services */}
                <div>
                  <p className="text-xs tracking-widest text-white/40 uppercase mb-3">Services</p>
                  <div className="space-y-2">
                    {['Product Strategy', 'Analytics Integration', 'Platform Development', 'Performance Optimization'].map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                        <span className="text-sm text-white/70">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <p className="text-xs tracking-widest text-white/40 uppercase mb-3">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {['REACT', 'NEXT.JS', 'TAILWIND CSS', 'FRAMER MOTION', 'VERCEL'].map(t => (
                      <span key={t} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white/60 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="w-full rounded-xl border border-white/10 bg-slate-950/40 p-5 text-[13px] leading-tight text-white/70">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Project Overview</p>
                  <p className="mt-3 leading-tight">A modern dental website built to increase patient bookings, improve trust, and deliver a seamless experience across devices.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-[13px] leading-tight text-white/70">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Challenge</p>
                    <p className="mt-3 leading-tight">No modern digital presence, unclear booking flow, and low patient trust.</p>
                  </div>
                  <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-[13px] leading-tight text-white/70">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Solution</p>
                    <p className="mt-3 leading-tight">Built a clean responsive website with easy appointment booking and clear service clarity.</p>
                  </div>
                </div>

                {/* Result tags (2x2) */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {['Higher Trust', 'More Bookings', 'Better SEO', 'Faster Load'].map(result => (
                    <div key={result} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                      <Check size={13} className="text-green-400 shrink-0" />
                      <span className="text-sm text-white/60">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4">
                <a href="https://dr-poojabala.netlify.app" target="_blank" rel="noreferrer noopener" className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[13px] font-semibold text-white transition duration-300 hover:bg-white/10">
                  Explore Work →
                </a>
              </div>
            </div>
          </aside>

          <div className="order-1 min-w-0 h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] relative lg:order-2">
            {/* Browser chrome bar */}
            <div className="sticky top-0 z-[60] flex h-12 items-center gap-2 px-4 bg-[#1a1a1a] border-b border-white/10 shrink-0">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-3 bg-white/5 rounded-md px-3 py-1 text-center">
                <span className="text-xs text-white/40 font-mono tracking-wide">
                  DR-POOJABALA.NETLIFY.APP
                </span>
              </div>
            </div>

            <div
              ref={containerRef}
              className="flex-1 relative overflow-hidden bg-white z-0"
              style={{ minHeight: '500px' }}
            >
              <iframe
                src="https://dr-poojabala.netlify.app"
                title="Dr. Pooja Bala Dental Clinic"
                style={{
                  width: `${100 / scale}%`,
                  height: `${100 / scale}%`,
                  minHeight: '800px',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  border: 'none',
                  pointerEvents: 'auto',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: -1,
                }}
                scrolling="yes"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div id="more-projects" className="relative z-20 space-y-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/55">More Projects</p>
          <div className="relative z-20 mx-auto max-w-3xl text-3xl font-normal leading-tight text-white md:text-5xl">
            A selection of software, AI, analytics, and web work that feels premium, polished, and built to scale.
          </div>
        </div>

        {projectFilter && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-white/75">
            <button type="button" onClick={() => setProjectFilter(null)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10">Clear filter</button>
            <span className="text-sm">Showing {filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'} for "{projectFilter}"</span>
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-10 text-center text-sm text-white/70">No projects match "{projectFilter}". Try another technology.</div>
          )}
        </div>
      </div>
    </section>
  );
}

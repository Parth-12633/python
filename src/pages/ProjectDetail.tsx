import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicAsset } from '../utils/assetHelpers';
import { projectsData } from '../data/projectsData';
import type { Project } from '../types';

type GalleryImageProps = {
  src: string | null;
  alt: string;
  initials: string;
  onOpen: (src: string) => void;
};

function GalleryImage({ src, alt, initials, onOpen }: GalleryImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/[0.04] flex items-center justify-center">
        <span className="text-3xl font-bold text-white/10">{initials}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(src)}
      className="group aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-transparent p-0 text-left transition hover:border-white/20"
    >
      <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onError={() => setErrored(true)}
                    className="h-full w-full rounded-xl object-cover transition duration-300 group-hover:scale-105"
                  />
    </button>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projectsData.find((projectItem) => projectItem.slug === id);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxSrc(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!project) {
    return (
      <motion.div
        initial={{ opacity: 0.15, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-transparent px-6 py-16 text-white"
      >
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950/70 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-white/55">Project not found</p>
          <h1 className="mt-6 text-4xl font-semibold text-white">We couldn’t locate that project.</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to Projects
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.15, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-transparent px-6 py-10 text-white md:px-12 lg:px-16"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <AnimatePresence>
            {lightboxSrc ? (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.15 }}
              >
                <button
                  type="button"
                  onClick={() => setLightboxSrc(null)}
                  className="absolute right-4 top-4 z-50 rounded-full border border-white/20 bg-black/60 p-3 text-white transition hover:bg-white/10"
                >
                  Close
                </button>
                <img
                  src={lightboxSrc}
                  alt="Project preview enlarged"
                  loading="lazy"
                  className="max-h-[90vh] max-w-full rounded-3xl object-contain shadow-2xl"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ← Back to Projects
          </button>

          <div className="mt-8 space-y-6">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.68rem] uppercase tracking-[0.35em] text-white/70">
              {project.badge}
            </span>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/70">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.28em] text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Duration</p>
              <p className="mt-3 text-xl font-semibold text-white">{project.duration}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Platform</p>
              <p className="mt-3 text-xl font-semibold text-white">{project.platform}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Category</p>
              <p className="mt-3 text-xl font-semibold text-white">{project.category}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {project.images.map((src, index) => {
              const assetSrc = publicAsset(src);
              return (
                <GalleryImage
                  key={assetSrc ?? index}
                  src={assetSrc}
                  alt={`${project.title} preview ${index + 1}`}
                  initials={project.initials}
                  onOpen={(selectedSrc) => setLightboxSrc(selectedSrc)}
                />
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/55">Overview</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Project overview</h2>
            <p className="mt-4 leading-8 text-white/70">{project.overview}</p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Challenge</p>
              <p className="mt-4 leading-8 text-white/70">{project.challenge}</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Solution</p>
              <p className="mt-4 leading-8 text-white/70">{project.solution}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {project.results.map((result) => (
            <div
              key={result}
              className="flex items-start gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-3xl bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <p className="text-white/80">{result}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Interested in a similar project?</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Let’s build something exceptional.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Contact Us
              </a>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Live Site
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

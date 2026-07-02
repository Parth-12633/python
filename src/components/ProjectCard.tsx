import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types';
import { publicAsset } from '../utils/assetHelpers';

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560"><rect width="900" height="560" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" fill="%23ffffff">Preview unavailable</text></svg>';

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(publicAsset(project.previewImage));
  const initials = project.title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

  return (
    <motion.article
      initial={{ opacity: 0.15, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.05, 0.15) }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03] shadow-[0_24px_70px_rgba(0,0,0,0.16)] transition duration-500"
    >
      <div className="relative overflow-hidden rounded-t-[26px] bg-slate-950/40">
        <img
          src={imageSrc}
          alt={project.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            setImageSrc(FALLBACK_IMAGE);
          }}
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-5">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-white/70">
            {project.status}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-3xl bg-white/10 text-lg text-white/80">{initials}</div>
        </div>
      </div>
      <div className="relative z-10 flex-1 p-6">
        <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/70">{project.description}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-white/75">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 p-6">
        <button
          type="button"
          onClick={() => navigate(`/project/${project.slug}`)}
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
        >
          View Project →
        </button>
      </div>
    </motion.article>
  );
}

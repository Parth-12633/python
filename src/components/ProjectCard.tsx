import { forwardRef, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';
import { publicAsset } from '../utils/assetHelpers';
import { SpotlightCard } from './ui/SpotlightCard';
import { EASE } from './ui/Reveal';

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560"><rect width="900" height="560" fill="%230f172a"/></svg>';

type ProjectCardProps = {
  project: Project;
  index: number;
};

export const ProjectCard = forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard({ project, index }, ref) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(publicAsset(project.previewImage));
  const imgBox = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgBox, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);

  const open = () => {
    ReactGA.event({ category: 'Portfolio', action: 'Project Viewed', label: project.title });
    navigate(`/project/${project.slug}`);
  };

  const shown = project.technologies.slice(0, 4);
  const extra = project.technologies.length - shown.length;

  return (
    <motion.article
      ref={ref as any}
      layout
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.12, ease: EASE, layout: { duration: 0.6, ease: EASE } }}
      className="h-full"
    >
      <SpotlightCard className="glass group flex h-full flex-col overflow-hidden rounded-xl transition-[transform,box-shadow] duration-700 hover:-translate-y-2">
        <div
          role="link"
          tabIndex={0}
          aria-label={`Open ${project.title} case study`}
          data-cursor="View"
          onClick={open}
          onKeyDown={(e) => e.key === 'Enter' && open()}
          className="relative block cursor-pointer overflow-hidden"
        >
          <motion.div ref={imgBox} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="aspect-[16/10] overflow-hidden bg-ink-800">
            <motion.div
              className="h-full w-full"
              variants={{ hidden: { clipPath: 'inset(0 0 100% 0)' }, show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.2, ease: EASE } } }}
            >
            <motion.img
              style={{ y: imgY, scale: 1.18 }}
              src={imageSrc}
              alt={project.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                setImageSrc(FALLBACK_IMAGE);
              }}
              className="h-full w-full object-cover object-top"
            />
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
            <span className="rounded-full border border-white/15 bg-ink-950/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
              {project.status ?? project.badge}
            </span>
            <span className="font-mono text-xs text-white/60">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">{project.category}</span>
            <span className="flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-neon text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-7">
          <h3 className="font-display text-[1.5rem] font-semibold uppercase leading-[1.1] text-white md:text-[1.8rem]">{project.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/60">{project.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {shown.map((tech) => (
              <li key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
                {tech}
              </li>
            ))}
            {extra > 0 && <li className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/40">+{extra}</li>}
          </ul>

          <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
            <button type="button" onClick={open} className="btn btn-ghost group/btn flex-1 !py-3 !text-sm">
              {project.liveUrl ? 'Case study' : 'View project'}
              <ArrowRight size={15} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ReactGA.event({ category: 'Portfolio', action: 'Live Site Clicked', label: project.title })}
                className="btn flex-1 border border-neon/35 bg-neon/10 !py-3 !text-sm text-neon hover:bg-neon/20 hover:text-white"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-neon/70" />
                  <span className="h-2 w-2 rounded-full bg-neon" />
                </span>
                Live site
              </a>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  );
});

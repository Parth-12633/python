import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { projectsData } from '../data/projectsData';
import { getLenis } from '../lib/lenis';
import { publicAsset } from '../utils/assetHelpers';
import { Magnetic } from '../components/ui/Magnetic';
import { EASE, Reveal, Stagger, StaggerItem } from '../components/ui/Reveal';
import { SplitText } from '../components/ui/SplitText';
import { SpotlightCard } from '../components/ui/SpotlightCard';

function GalleryImage({ src, alt, initials, onOpen }: { src: string; alt: string; initials: string; onOpen: () => void }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
        <span className="font-display text-5xl text-white/10">{initials}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="Expand"
      className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-ink-800 p-0 text-left transition-colors duration-500 hover:border-white/30"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-neon text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <Maximize2 size={15} />
      </span>
    </button>
  );
}

function Lightbox({ images, index, onClose, onChange }: { images: string[]; index: number; onClose: () => void; onChange: (i: number) => void }) {
  const next = useCallback(() => onChange((index + 1) % images.length), [index, images.length, onChange]);
  const prev = useCallback(() => onChange((index - 1 + images.length) % images.length), [index, images.length, onChange]);

  useEffect(() => {
    getLenis()?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      getLenis()?.start();
    };
  }, [next, prev, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[190] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15">
        <X size={18} />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image" className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:left-8">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image" className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:right-8">
            <ChevronRight size={20} />
          </button>
        </>
      )}
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`Project preview ${index + 1}`}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="max-h-[86vh] max-w-full rounded-lg object-contain shadow-2xl"
        />
      </AnimatePresence>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-white/50">
        {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </span>
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projectsData.find((p) => p.slug === id || (id === 'analytics-dashboard' && p.slug === 'hingu-tailors-erp'));
  const [lightbox, setLightbox] = useState<number | null>(null);

  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ['start end', 'end start'] });
  const coverY = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-32">
        <div className="glass max-w-xl rounded-xl p-12 text-center">
          <p className="eyebrow justify-center">Project not found</p>
          <h1 className="mt-6 font-display text-5xl text-white">We couldn’t locate that project.</h1>
          <Link to="/" className="btn btn-primary mt-8">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  const index = projectsData.findIndex((p) => p.slug === project.slug);
  const nextProject = projectsData[(index + 1) % projectsData.length];
  const gallery = project.images.map((src) => publicAsset(src));
  const cover = publicAsset(project.previewImage);

  return (
    <article className="relative">
      <Helmet>
        <title>{`${project.title} — NovaCraft Studio Case Study`}</title>
        <meta name="description" content={project.description} />
      </Helmet>

      {/* Hero */}
      <header className="relative isolate overflow-hidden px-6 pb-16 pt-36 md:px-12 md:pt-44 lg:px-16">
        <div className="aurora-blob -left-32 top-0 -z-10 h-[32rem] w-[32rem] bg-indigo-600/30" />
        <div className="aurora-blob -right-24 top-32 -z-10 h-[28rem] w-[28rem] bg-cyan-500/20" style={{ animationDelay: '-8s' }} />
        <div className="grid-bg absolute inset-0 -z-10 opacity-50" />

        <div className="mx-auto max-w-6xl">
          <Reveal y={16} blur={false} className="flex flex-wrap items-center justify-between gap-4">
            <Link to={{ pathname: '/', hash: '#projects' }} className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:-translate-x-1 group-hover:border-white/40">
                <ArrowLeft size={15} />
              </span>
              All projects
            </Link>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn border border-neon/35 bg-neon/10 !py-2.5 !text-sm text-neon hover:bg-neon/20 hover:text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-neon/70" />
                  <span className="h-2 w-2 rounded-full bg-neon" />
                </span>
                Visit live site <ArrowUpRight size={15} />
              </a>
            )}
          </Reveal>

          <Reveal delay={0.1} y={16} blur={false} className="mt-14">
            <span className="eyebrow">{project.badge}</span>
          </Reveal>
          <SplitText as="h1" text={project.title} stagger={0.05} delay={0.15} when className="mt-5 max-w-5xl text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.02] tracking-[-0.03em] text-white" />
          <Reveal delay={0.5} className="mt-7 max-w-3xl text-lg leading-8 text-white/65">
            {project.description}
          </Reveal>
          <Reveal delay={0.6} className="mt-7 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/70">
                {tag}
              </span>
            ))}
          </Reveal>

          <Stagger className="mt-14 grid gap-4 md:grid-cols-3" stagger={0.1} delay={0.4}>
            {[
              ['Duration', project.duration],
              ['Platform', project.platform],
              ['Category', project.category]
            ].map(([k, v]) => (
              <StaggerItem key={k}>
                <SpotlightCard className="glass rounded-xl p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">{k}</p>
                  <p className="mt-3 font-display text-[1.7rem] leading-tight text-white">{v}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </header>

      {/* Cover with parallax */}
      <div className="px-6 md:px-12 lg:px-16">
        <Reveal y={60} scale={0.96} duration={1.3} className="mx-auto max-w-6xl">
          <div ref={coverRef} className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-ink-800">
            <motion.img
              src={cover}
              alt={project.title}
              style={{ y: coverY, scale: 1.2 }}
              className="absolute inset-0 h-full w-full object-cover object-top"
              onError={(e) => ((e.currentTarget.style.display = 'none'))}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
          </div>
        </Reveal>
      </div>

      {/* Story */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-16">
          {[
            { label: 'Overview', title: 'The project', body: project.overview },
            { label: 'Challenge', title: 'What stood in the way', body: project.challenge },
            { label: 'Solution', title: 'How we solved it', body: project.solution }
          ].map((b, i) => (
            <div key={b.label} className="grid gap-6 border-t border-white/10 pt-10 md:grid-cols-[14rem_1fr] md:gap-16">
              <Reveal y={20} blur={false}>
                <p className="eyebrow">0{i + 1} — {b.label}</p>
              </Reveal>
              <div>
                <SplitText text={b.title} className="font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-tight text-white" />
                <Reveal delay={0.15} className="mt-5 max-w-3xl text-base leading-8 text-white/65">{b.body}</Reveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <Reveal y={20} blur={false} className="mb-10 flex items-end justify-between">
              <div>
                <p className="eyebrow">Gallery</p>
                <h2 className="section-title mt-4">Inside the build</h2>
              </div>
              <span className="font-mono text-xs text-white/40">{gallery.length} screens</span>
            </Reveal>
            <Stagger className="grid gap-4 md:grid-cols-2" stagger={0.1}>
              {gallery.map((src, i) => (
                <StaggerItem key={src} className={gallery.length % 2 === 1 && i === 0 ? 'md:col-span-2' : ''}>
                  <GalleryImage src={src} alt={`${project.title} preview ${i + 1}`} initials={project.initials} onOpen={() => setLightbox(i)} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Results + technologies */}
      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal y={20} blur={false}>
            <p className="eyebrow">Outcomes</p>
            <h2 className="section-title mt-4">Results that <em className="text-neon">matter</em></h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.09}>
            {project.results.map((r) => (
              <StaggerItem key={r} className="h-full">
                <SpotlightCard className="glass flex h-full items-start gap-4 rounded-xl p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-neon/10 text-neon">
                    <CheckCircle2 size={20} />
                  </span>
                  <p className="pt-1.5 text-[15px] leading-7 text-white/80">{r}</p>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="mt-12">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span key={t} className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/75">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Next project */}
      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-16">
        <Reveal className="mx-auto max-w-6xl">
          <Link
            to={`/project/${nextProject.slug}`}
            data-cursor="Next"
            className="group relative block overflow-hidden rounded-xl border border-white/10 bg-ink-800"
          >
            <img
              src={publicAsset(nextProject.previewImage)}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-40 transition-all duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105 group-hover:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
            <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between md:p-14">
              <div>
                <p className="eyebrow">Next project</p>
                <h3 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] text-white">{nextProject.title}</h3>
              </div>
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-neon group-hover:text-black">
                <ArrowRight size={24} />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28 md:px-12 lg:px-16">
        <Reveal className="mx-auto max-w-6xl">
          <div className="glass relative overflow-hidden rounded-xl p-10 md:p-16">
            <div className="aurora-blob -right-20 -top-20 h-72 w-72 bg-indigo-600/40" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow">Interested in a similar project?</p>
                <h2 className="section-title mt-4 max-w-xl">Let’s build something <em className="text-neon">exceptional.</em></h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <Link to={{ pathname: '/', hash: '#contact' }} className="btn btn-primary group">
                    Contact us <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </Magnetic>
                {project.liveUrl && (
                  <Magnetic>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View live site ↗</a>
                  </Magnetic>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <AnimatePresence>
        {lightbox !== null && <Lightbox images={gallery} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />}
      </AnimatePresence>
    </article>
  );
}

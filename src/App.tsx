import React, { useEffect, useRef, useState, useMemo, lazy, Suspense, type ReactNode } from 'react';
import { AnimatePresence, motion, useAnimation, useScroll, useSpring } from 'framer-motion';
// Heavy libraries (gsap, lenis, three, react-three) are loaded dynamically for performance.
import emailjs from '@emailjs/browser';
import { toast, Toaster } from 'react-hot-toast';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight,
  Blocks,
  Brain,
  BrainCircuit,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CheckCircle2,
  ChevronUp,
  Clock,
  Box,
  Code2,
  Cloud,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  FileCode,
  FileText,
  FolderGit2,
  GitBranch,
  Gauge,
  Globe,
  LayoutGrid,
  Layers,
  Lock,
  Menu,
  Monitor,
  MonitorPlay,
  Rocket,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap
} from 'lucide-react';
import type { IconType } from 'react-icons';
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiAmazonaws,
  SiDocker,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiFramer,
  SiOpenai,
  SiTailwindcss,
  SiTypescript,
  SiTensorflow,
  SiVercel
} from 'react-icons/si';
import type { Project } from './types';
import { ProjectCard } from './components/ProjectCard';
import { projectsData } from './data/projectsData';
import ProjectDetail from './pages/ProjectDetail';
import { Route, Routes } from 'react-router-dom';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'YOUR_PUBLIC_KEY';
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? 'G-XXXXXXXXXX';
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID ?? 'YOUR_CLARITY_ID';
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? 'https://calendly.com/YOUR_USERNAME';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? 'YOUR_PHONE_NUMBER';
const APP_URL = import.meta.env.VITE_APP_URL ?? 'https://yourdomain.com';
const OG_IMAGE_URL = import.meta.env.VITE_OG_IMAGE_URL ?? `${APP_URL}/og-image.png`;

const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const ProcessSection = lazy(() => import('./components/ProcessSection'));

function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.15, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type AnimatedHeadingProps = {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
};

function AnimatedHeading({ text, className = '', delay = 200, charDelay = 28 }: AnimatedHeadingProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  const linesWithDelays = useMemo(() => {
    let runningCharIndex = 0;
    return text.split('\n').map((line) => {
      const words = line.split(' ');
      return words.map((word) => {
        const wordDelay = runningCharIndex * charDelay;
        runningCharIndex += word.length + 1;
        return { word, delay: wordDelay };
      });
    });
  }, [text, charDelay]);

  return (
    <h1
      className={className}
      style={{
        letterSpacing: '-0.04em',
        wordBreak: 'keep-all',
        overflowWrap: 'normal',
        whiteSpace: 'normal'
      }}
    >
      {linesWithDelays.map((words, lineIndex) => (
        <span key={lineIndex} className="block">
          {words.map(({ word, delay: wordDelay }, wordIndex) => (
            <React.Fragment key={`${lineIndex}-${wordIndex}`}>
              <span
                className="inline-block"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-18px)',
                  transition: 'opacity 500ms ease, transform 500ms ease',
                  transitionDelay: `${wordDelay}ms`,
                  wordBreak: 'keep-all',
                  overflowWrap: 'normal',
                  whiteSpace: 'normal'
                }}
              >
                {word}
              </span>
              {wordIndex < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </span>
      ))}
    </h1>
  );
}

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
};

function FadeIn({ children, delay = 0, duration = 1000 }: FadeInProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="transition-opacity"
      style={{ opacity: visible ? 1 : 0.15, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

const agencyMetrics = [
  {
    icon: Rocket,
    value: '20+',
    label: 'Projects Delivered',
    description: 'Custom SaaS, enterprise ERPs, clinical portals, and AI systems built for real businesses.'
  },
  {
    icon: Zap,
    value: '2–4 Wks',
    label: 'Average Sprint',
    description: 'Milestone-driven execution delivering testable staging deployments every week.'
  },
  {
    icon: ShieldCheck,
    value: '99%',
    label: 'Performance Score',
    description: 'Engineered for high availability, sub-second responses, and fault-tolerant cloud scale.'
  },
  {
    icon: Code2,
    value: '100%',
    label: 'Code Ownership',
    description: 'Clean TypeScript & Python codebases, comprehensive documentation, and zero vendor lock-in.'
  }
];

const steps = [
  {
    id: 1,
    number: '01',
    label: 'Discovery',
    icon: Search,
    heading: 'Understanding what actually matters.',
    description: 'We start by mapping goals, constraints, and opportunities before writing a single line of code.',
    deliverables: ['Stakeholder interviews', 'Competitive analysis', 'Technical feasibility report', 'Project scope document'],
    duration: '3–5',
    durationLabel: 'business days',
    output: 'A clear project brief that eliminates guesswork before we build.'
  },
  {
    id: 2,
    number: '02',
    label: 'Strategy',
    icon: Compass,
    heading: 'Planning the path to execution.',
    description: 'Architecture, flows, and automation decisions that prevent costly rework later.',
    deliverables: ['System architecture diagram', 'User flow mapping', 'Tech stack decision', 'Sprint roadmap'],
    duration: '3–7',
    durationLabel: 'business days',
    output: 'A battle-tested blueprint that the entire team aligns on before a line is written.'
  },
  {
    id: 3,
    number: '03',
    label: 'Design',
    icon: Layers,
    heading: 'Interfaces that feel inevitable.',
    description: 'Every interaction is considered — nothing is accidental.',
    deliverables: ['Wireframes', 'Component library', 'High-fidelity mockups', 'Interactive prototype'],
    duration: '1–2',
    durationLabel: 'weeks',
    output: 'A Figma prototype so detailed, development becomes systematic.'
  },
  {
    id: 4,
    number: '04',
    label: 'Development',
    icon: Code2,
    heading: 'Building scalable systems with confidence.',
    description: 'Clean, maintainable code built to grow with the business.',
    deliverables: ['Frontend development', 'Backend/API build', 'Database architecture', 'CI/CD pipeline setup'],
    duration: '2–6',
    durationLabel: 'weeks',
    output: 'Production-ready code with full documentation and test coverage.'
  },
  {
    id: 5,
    number: '05',
    label: 'Testing',
    icon: ShieldCheck,
    heading: 'Quality before it reaches your users.',
    description: 'Refinement and QA to catch issues before users do.',
    deliverables: ['Cross-browser testing', 'Performance audit', 'Accessibility review', 'Bug fix cycle'],
    duration: '3–5',
    durationLabel: 'business days',
    output: 'A product that works flawlessly across all devices and edge cases.'
  },
  {
    id: 6,
    number: '06',
    label: 'Launch',
    icon: Rocket,
    heading: 'From ambition to execution.',
    description: 'Shipped, monitored, and ready to scale.',
    deliverables: ['Production deployment', 'Performance monitoring setup', 'Client handoff & training', '30-day support window'],
    duration: '1–2',
    durationLabel: 'business days',
    output: 'A live product backed by real monitoring and a team that stands behind it.'
  }
];

const services = [
  {
    title: 'Custom Web Development',
    description: 'Building modern web applications, portals, and SaaS experiences with scalable architecture and polished execution.',
    icon: ChartNoAxesCombined,
    accent: 'from-emerald-400/20 via-transparent to-slate-400/20'
  },
  {
    title: 'AI Solutions',
    description: 'Delivering intelligent automation, predictive models, and machine learning systems that power smarter business outcomes.',
    icon: BrainCircuit,
    accent: 'from-cyan-500/20 via-transparent to-blue-500/20'
  },
  {
    title: 'Data Analytics',
    description: 'Turning data into dashboards, analytics platforms, and insight-driven products for enterprise teams.',
    icon: Database,
    accent: 'from-violet-500/20 via-transparent to-fuchsia-500/20'
  },
  {
    title: 'UI/UX Design',
    description: 'Designing polished digital products and interfaces that feel intuitive, premium, and built for conversion.',
    icon: LayoutGrid,
    accent: 'from-white/15 via-transparent to-slate-400/20'
  }
];

const benefits = ['Modern web applications', 'AI-powered solutions', 'Enterprise platforms', 'Analytics dashboards'];

const localPlaceholder = '/placeholder.svg';
const fallbackPreview = '/project-preview.svg';

const moreProjects = projectsData;

const ecosystemColumns = [
  {
    title: 'Frontend',
    icon: Monitor,
    accentFrom: '#3b82f6',
    accentTo: '#06b6d4',
    description: 'Modern responsive interfaces built for speed.',
    items: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript']
  },
  {
    title: 'Backend',
    icon: Server,
    accentFrom: '#10b981',
    accentTo: '#059669',
    description: 'Scalable APIs and business logic.',
    items: ['Node.js', 'Express', 'Python', 'Flask']
  },
  {
    title: 'AI & Automation',
    icon: Brain,
    accentFrom: '#fb7185',
    accentTo: '#f472b6',
    description: 'Intelligent workflows and automation.',
    items: ['OpenAI', 'Python', 'Automation', 'TensorFlow']
  },
  {
    title: 'Database',
    icon: Database,
    accentFrom: '#06b6d4',
    accentTo: '#0ea5a4',
    description: 'Reliable structured data layer.',
    items: ['MySQL', 'MongoDB', 'PostgreSQL']
  },
  {
    title: 'Cloud Infrastructure',
    icon: Cloud,
    accentFrom: '#f59e0b',
    accentTo: '#fb923c',
    description: 'Deployment and infrastructure.',
    items: ['AWS', 'Docker', 'Vercel']
  },
  {
    title: 'Motion & UX',
    icon: Sparkles,
    accentFrom: '#8b5cf6',
    accentTo: '#7c3aed',
    description: 'Interactive experiences and refined motion.',
    items: ['Framer Motion', 'GSAP', 'Lenis']
  }
];

// map technology names to react-icons for badges
const techIconMap: Record<string, IconType> = {
  React: SiReact,
  'Next.js': SiNextdotjs,
  'Tailwind CSS': SiTailwindcss,
  TypeScript: SiTypescript,
  'Node.js': SiNodedotjs,
  Express: SiNodedotjs,
  Python: SiPython,
  Flask: SiPython,
  OpenAI: SiOpenai,
  TensorFlow: SiTensorflow,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  AWS: SiAmazonaws,
  Docker: SiDocker,
  Vercel: SiVercel,
  'Framer Motion': SiFramer
};

const stackStats = [
  { value: '20+', label: 'Projects Delivered', text: 'Successfully launched for businesses worldwide.' },
  { value: '15+', label: 'Core Technologies', text: 'Modern stack for scalable applications.' },
  { value: '99%', label: 'Performance Score', text: 'Optimized for speed and reliability.' },
  { value: 'AI', label: 'Powered Development', text: 'Building intelligent digital experiences.' }
];



type ServiceCardProps = {
  service: {
    title: string;
    description: string;
    icon: React.ElementType;
    accent: string;
  };
  index: number;
};
 

function ParallaxCard({ children }: { children: ReactNode }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setOffset({ x: x * 8, y: y * 8 });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ x: offset.x, y: offset.y }}
      whileHover={{ y: -6, scale: 1.01, rotateX: 2, rotateY: -2 }}
      className="transition-transform duration-500"
    >
      {children}
    </motion.div>
  );
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = service.icon;
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const delay = ((index % 2) + Math.floor(index / 2)) * 0.08;

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientY - rect.top) / rect.height - 0.5;
    const y = (event.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * -8, y: y * 8 });
  };

  return (
    <motion.article
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0.15, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay } }
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="revealer group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-blue-500/30"
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformPerspective: 1000
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-70 transition duration-700 group-hover:scale-105`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_56%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
      <div className="relative z-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 ring-1 ring-white/10 transition duration-300 group-hover:border-blue-400/30 group-hover:ring-blue-400/20">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
        <p className="mt-3 max-w-xl text-base leading-7 text-white/70">{service.description}</p>
      </div>
    </motion.article>
  );
}

function CountUp({ value, duration = 1100 }: { value: number | string; duration?: number }) {
  const [display, setDisplay] = useState<string>(typeof value === 'number' ? '0' : String(value));

  useEffect(() => {
    if (typeof value !== 'number') return setDisplay(String(value));
    let raf = 0;
    const start = performance.now();
    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1);
      const current = Math.floor(t * value);
      setDisplay(String(current));
      if (t < 1) raf = requestAnimationFrame(animate);
      else setDisplay(String(value));
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}

export default function App() {
  const [activity, setActivity] = useState(0.35);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [pageReady, setPageReady] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'cookies' | 'security' | null>(null);
  const contactFormRef = useRef<HTMLFormElement | null>(null);

  const activeStepData = steps[activeStepIndex] ?? steps[0];

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const filteredProjects = projectFilter
    ? moreProjects.filter((project) =>
        project.tags.some((tag) => tag.toLowerCase().includes(projectFilter.toLowerCase()))
      )
    : moreProjects;

  const handleTechFilter = (tech: string) => {
    setProjectFilter(tech);
    const anchor = document.getElementById('more-projects') || document.getElementById('projects');
    anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateEmail = (email: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  };

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactFormRef.current) return;

    const formData = new FormData(contactFormRef.current);
    const name = String(formData.get('user_name') ?? '').trim();
    const email = String(formData.get('user_email') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!name || !email || !message) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const replyToInput = contactFormRef.current.querySelector('input[name="reply_to"]') as HTMLInputElement | null;
    if (replyToInput) {
      replyToInput.value = email;
    }

    setIsSendingContact(true);

    ReactGA.event({ category: 'Contact', action: 'Form Submitted' });

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        contactFormRef.current,
        EMAILJS_PUBLIC_KEY
      );
      toast.success("Message sent! We'll be in touch within 24 hours.");
      contactFormRef.current.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error('Something went wrong. Please try WhatsApp instead.');
    } finally {
      setIsSendingContact(false);
    }
  };

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let lenis: any = null;
    let rafId: number | null = null;

    let handleMouseMove: ((event: MouseEvent) => void) | null = null;
    let handleScroll: (() => void) | null = null;

    // Dynamically import heavy runtime libraries to reduce initial bundle size.
    (async () => {
      try {
        const gsapModule = await import('gsap');
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        const gsap: any = gsapModule && (gsapModule as any).default ? (gsapModule as any).default : gsapModule;
        const ScrollTrigger: any = (ScrollTriggerModule && (ScrollTriggerModule as any).ScrollTrigger) || (ScrollTriggerModule as any).default || ScrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        const lenisModule = await import('lenis');
        const Lenis: any = (lenisModule as any).default ?? lenisModule;

        lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });

        function raf(time: number) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        handleMouseMove = (event: MouseEvent) => {
          setMouse({ x: (event.clientX / window.innerWidth) - 0.5, y: (event.clientY / window.innerHeight) - 0.5 });
        };

        handleScroll = () => {
          setScroll(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Setup GSAP animations that rely on DOM
        gsap.utils.toArray('.counter').forEach((counter: any) => {
          gsap.fromTo(
            counter,
            { textContent: '0', opacity: 0.15, y: 16 },
            {
              textContent: Number(counter.dataset.value),
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: 'power3.out',
              snap: { textContent: 1 },
              scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                once: true
              }
            }
          );
        });

        gsap.from('.revealer', {
          opacity: 0.15,
          y: 40,
          blur: 10,
          duration: 1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.revealer',
            start: 'top 90%',
            once: true
          }
        });
      } catch (e) {
        // If dynamic imports fail, degrade gracefully
        // console.warn('Dynamic import failed', e);
      }
    })();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis && typeof lenis.destroy === 'function') lenis.destroy();
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleScroll) window.removeEventListener('scroll', handleScroll as EventListenerOrEventListenerObject);
      try {
        const tt: any = (window as any).gsapScrollTriggers;
        if (tt && Array.isArray(tt)) tt.forEach((t: any) => t.kill && t.kill());
      } catch (e) {
        // ignore
      }
    };
  }, []);


  const homePage = (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent text-white opacity-100" style={{ opacity: pageReady ? 1 : 1 }}>
      <Helmet>
        <title>NovaCraft — Premium Software Development & AI Agency</title>
        <meta name="description" content="We build premium software, AI systems, and digital products that scale. Based in India, working globally." />
        <meta name="keywords" content="software development agency, AI agency, React development, web development India, Next.js agency" />
        <link rel="canonical" href={APP_URL} />

        <meta property="og:title" content="NovaCraft — Premium Software Development & AI Agency" />
        <meta property="og:description" content="We build premium software, AI systems, and digital products that scale." />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:url" content={APP_URL} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NovaCraft — Premium Software Development & AI Agency" />
        <meta name="twitter:description" content="We build premium software, AI systems, and digital products that scale." />
        <meta name="twitter:image" content={OG_IMAGE_URL} />

        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "NovaCraft",
            "description": "Premium software development and AI agency",
            "url": "${APP_URL}",
            "logo": "${APP_URL}/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["English", "Hindi"]
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://github.com/YOUR_GITHUB",
              "https://linkedin.com/company/YOUR_LINKEDIN"
            ]
          }
        `}</script>
      </Helmet>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-blue-500 origin-left z-[100]" style={{ scaleX: useSpring(useScroll().scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 }) }} />
      {/* Global fixed background video */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.40 }}
        >
          <source src="/videos/bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <section className="relative isolate z-10 hero-min-height overflow-hidden bg-transparent text-white">
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.58)_42%,rgba(0,0,0,0.24)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%)]" />

        <div className="relative z-10 flex min-h-full flex-col px-6 pt-6 md:px-12 lg:px-16">
          <nav className="liquid-glass flex h-16 items-center justify-between rounded-xl px-4 py-2 lg:h-auto">
            <div className="text-2xl font-semibold tracking-tight">NovaCraft</div>
            <div className="hidden items-center gap-8 text-sm text-white/80 lg:flex">
              <a className="transition-colors hover:text-gray-300" href="#services">Services</a>
              <a className="transition-colors hover:text-gray-300" href="#projects">Projects</a>
              <a className="transition-colors hover:text-gray-300" href="#process">Process</a>
              <a className="transition-colors hover:text-gray-300" href="#about">About</a>
              <a className="transition-colors hover:text-gray-300" href="#contact">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <a className="hidden rounded-lg border border-white/20 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black lg:inline-flex" href="#contact">
                Book Consultation
              </a>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xl px-5 py-6 lg:hidden"
              >
                <div className="mx-auto flex h-full max-w-3xl flex-col gap-10 rounded-3xl border border-white/10 bg-black/90 p-6 shadow-2xl shadow-black/40">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold tracking-tight text-white">NovaCraft</div>
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                      aria-label="Close menu"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-5 text-lg font-medium text-white">
                    <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-gray-300">Home</a>
                    <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-gray-300">Services</a>
                    <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-gray-300">Projects</a>
                    <a href="#process" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-gray-300">Process</a>
                    <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-gray-300">About</a>
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="transition-colors hover:text-gray-300">Contact</a>
                  </div>

                  <a
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-white/15"
                  >
                    Book Consultation
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-1 flex-col justify-center pt-[19vh] pb-6 lg:pb-8">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
              <div className="max-w-4xl">
                <div className="mb-4 text-xs uppercase tracking-[0.3em] text-white/60">Software • AI • Product</div>
                <AnimatedHeading
                  text={"A premium software agency\nbuilding modern digital products,\nAI applications, analytics platforms,\nand enterprise solutions"}
                  className="mb-5 text-4xl font-normal leading-[0.9] text-white md:text-5xl lg:text-6xl xl:text-7xl"
                  delay={200}
                  charDelay={28}
                />
                <FadeIn delay={800} duration={1000}>
                  <p className="mb-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                    Professional software agency helping businesses build modern digital products, AI applications, analytics platforms, and enterprise solutions.
                  </p>
                </FadeIn>
                <FadeIn delay={1200} duration={1000}>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => ReactGA.event({ category: 'Contact', action: 'Book Call Clicked' })}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 text-white transition-all duration-300 hover:bg-white/10 group"
                    >
                      <CalendarDays size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                      Book a Free Call
                    </a>
                    <a className="rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white/10" href="#projects">
                      Explore the Work
                    </a>
                  </div>
                </FadeIn>
              </div>

              <div className="flex items-end justify-start lg:justify-end">
                <FadeIn delay={1400} duration={1000}>
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 0.5, 0] }}
                    transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
                    className="liquid-glass rounded-2xl border border-white/20 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.35)]"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/55">Designed for ambitious product teams</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/80">
                      <span className="rounded-full border border-white/10 px-3 py-1">Product-first</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">Conversion-led</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">Mobile-first</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">Trust-building</span>
                    </div>
                  </motion.div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
          </section>

      <section id="about" data-scene-section="about" className="relative z-20 px-6 py-12 md:py-16 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/55">Agency Metrics</p>
              <h2 className="text-2xl font-normal leading-tight text-white md:text-4xl">
                Built to launch modern digital products, enterprise platforms, and AI-powered solutions.
              </h2>
            </div>
            <p className="text-sm text-white/60 max-w-md">
              We eliminate bloated agency overhead with direct senior engineering, milestone-driven sprints, and production-ready code from day one.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {agencyMetrics.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="liquid-glass group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 group-hover:border-white/20 group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/60 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      {card.label}
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white font-mono">
                      {card.value}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center">Loading process…</div>}>
        <ProcessSection
          steps={steps}
          activeStepIndex={activeStepIndex}
          setActiveStepIndex={setActiveStepIndex}
          onStepView={(label: string) => ReactGA.event({ category: 'Engagement', action: 'Process Step Viewed', label })}
        />
      </Suspense>

      <Suspense fallback={<div className="py-10 text-center">Loading projects…</div>}>
        <ProjectsSection
          filteredProjects={filteredProjects}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
        />
      </Suspense>

      <section id="services" data-scene-section="services" className="relative z-20 px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0.15, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }} transition={{ duration: 0.8 }} className="relative z-20 mb-10 max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/55">Services</p>
            <SectionHeading className="text-3xl font-normal leading-tight text-white md:text-5xl">What we build</SectionHeading>
          </motion.div>
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="tech-stack" className="relative z-10 px-6 py-16 md:px-12 lg:px-16">
        <div className="relative mx-auto max-w-[1500px]">
          <div className="mb-10 max-w-[680px]">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/55">Technology Stack</p>
            <SectionHeading className="text-3xl font-semibold leading-tight text-white md:text-5xl">
              Modern tooling, zero legacy baggage, sharp execution.
            </SectionHeading>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              We select mature, high-performance technologies built for scale, reliability, and developer ergonomics. Click any technology badge to view matching agency case studies.
            </p>
          </div>

          <div className="relative mx-auto w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#090d1a]/95 p-6 md:p-10 shadow-2xl">
            {/* Subtle non-blocking ambient glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06)_0%,transparent_60%)]" />

            <div className="relative z-10 grid gap-8">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {ecosystemColumns.map((column) => {
                  const ColumnIcon = column.icon as any;

                  return (
                    <div
                      key={column.title}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white shadow-sm"
                          style={{ borderColor: `${column.accentFrom}33` }}
                        >
                          <ColumnIcon size={22} style={{ color: column.accentFrom }} />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white tracking-tight">{column.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-white/60">{column.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {column.items.map((item) => {
                          const TechIcon = techIconMap[item];
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleTechFilter(item)}
                              title={`Filter projects built with ${item}`}
                              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition-all duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white active:scale-95 cursor-pointer"
                            >
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: column.accentFrom }} />
                              {TechIcon ? <TechIcon size={13} className="text-white/70" /> : null}
                              <span className="whitespace-nowrap">{item}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4 border-t border-white/10">
                {stackStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center text-white transition hover:border-white/20"
                  >
                    <div className="text-3xl font-bold font-mono text-white">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 text-[10px] uppercase tracking-[0.25em] text-white/50">{stat.label}</div>
                    <div className="mt-2 text-xs text-white/60 leading-normal">{stat.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" data-scene-section="why" className="relative z-20 px-6 py-24 md:px-12 lg:px-16 opacity-100">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/55">Why NovaCraft</p>
            <h2 className="text-3xl font-normal leading-tight text-white md:text-5xl">Strategy, design, and execution under one roof.</h2>
          </div>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="liquid-glass group flex flex-col justify-between rounded-[1.5rem] border border-white/10 px-6 py-8 md:flex-row md:items-center transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04]"
              >
                <div className="text-3xl font-semibold text-white/40 group-hover:text-white transition-colors md:text-4xl">
                  0{index + 1}
                </div>
                <div className="mt-4 text-2xl font-normal text-white md:mt-0 md:text-3xl flex items-center justify-between gap-4">
                  <span>{benefit}</span>
                  <ArrowRight className="h-6 w-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block text-white/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" data-scene-section="contact" className="relative z-10 isolate px-6 py-24 md:px-12 lg:px-16">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay loop muted playsInline>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.45))]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 rounded-[2rem] border border-white/10 bg-black/70 p-8 shadow-[0_0_80px_rgba(255,255,255,0.08)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/55">Contact</p>
            <SectionHeading className="text-3xl font-normal leading-tight text-white md:text-5xl">Let&apos;s build something amazing together.</SectionHeading>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70">
              Whether you need AI automation, custom software, analytics dashboards, or enterprise products, we are ready to help bring your vision to life.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => ReactGA.event({ category: 'Contact', action: 'Book Call Clicked' })}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 text-white transition-all duration-300 hover:bg-white/10 group"
                    >
                <CalendarDays size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                Book a Free Call
              </a>
              
            </div>
          </div>

          <form ref={contactFormRef} onSubmit={handleContactSubmit} className="liquid-glass rounded-[1.5rem] border border-white/10 p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-white/70">
                <span className="mb-2 block">Name <span className="text-white/40">*</span></span>
                <input
                  name="user_name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
                  placeholder="Your name"
                />
              </label>
              <label className="text-sm text-white/70">
                <span className="mb-2 block">Email <span className="text-white/40">*</span></span>
                <input
                  name="user_email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
                  placeholder="you@company.com"
                />
              </label>
              <input type="hidden" name="reply_to" value="" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-white/70">
                <span className="mb-2 block">Phone / WhatsApp</span>
                <input
                  name="user_whatsapp"
                  type="tel"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
                  placeholder="+1 (555) 000-0000"
                />
              </label>
              <label className="text-sm text-white/70">
                <span className="mb-2 block">Company / Organization</span>
                <input
                  name="user_company"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
                  placeholder="Company name (optional)"
                />
              </label>
            </div>
            <label className="mt-4 block text-sm text-white/70">
              <span className="mb-2 block">Message <span className="text-white/40">*</span></span>
              <textarea
                name="message"
                required
                className="min-h-32 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-white/30"
                placeholder="Tell us about the challenge or project requirements."
              />
            </label>
            <button
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSendingContact}
            >
              {isSendingContact ? 'Sending…' : 'Submit'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Floating Action Buttons: Back to Top & WhatsApp */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2.5">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#141414]/90 backdrop-blur-md text-white/90 shadow-xl shadow-black/50 transition-all duration-300 hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 group ${
            scroll > 200 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          title="Back to top"
          aria-label="Back to top"
        >
          <ChevronUp size={20} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20NovaCraft%20Studio,%0A%0AI%20found%20your%20website%20and%20would%20like%20to%20discuss%20my%20project.%0A%0A•%20Name:%0A•%20Company:%0A•%20Service%20Required:%0A•%20Brief%20Requirement:%0A%0ALooking%20forward%20to%20hearing%20from%20you.`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => ReactGA.event({ category: 'Contact', action: 'WhatsApp Clicked' })}
          className="inline-flex items-center gap-3 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:bg-green-400 hover:scale-110"
          title="Chat on WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.526 5.845L.057 23.571a.5.5 0 00.625.601l5.865-1.539A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.012-1.376l-.36-.213-3.733.979.998-3.645-.234-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
          </span>
          <span className="relative text-sm font-semibold">WhatsApp</span>
        </a>
      </div>

      {/* Comprehensive Professional Deployable Agency Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#070b14]/95 px-6 pt-16 pb-12 text-sm text-white/60 md:px-12 lg:px-16 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Directory */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 pb-14 border-b border-white/10">
            {/* Column 1: Brand & Overview (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white font-bold text-base shadow-sm">
                  NC
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-white leading-none">NovaCraft Studio</div>
                  <div className="text-xs text-white/40 mt-1">Enterprise Software • AI Systems • Cloud Architecture</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-white/65 max-w-sm">
                Engineering high-performance digital products, bespoke enterprise platforms, and production AI systems for forward-thinking enterprises globally.
              </p>
              
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Available for new projects (Q4 / Q1)</span>
              </div>

              <div className="pt-2 text-xs text-white/50 space-y-1">
                <p><span className="text-white/70 font-medium">Headquarters:</span> India (IST / UTC +5:30)</p>
                <p><span className="text-white/70 font-medium">Coverage:</span> United States, Europe, Middle East &amp; APAC</p>
                <p><span className="text-white/70 font-medium">Response SLA:</span> Within 24 business hours</p>
              </div>
            </div>

            {/* Column 2: Sitemap & Navigation (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Sitemap</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="transition-colors hover:text-white">Home</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">Services</a></li>
                <li><a href="#projects" className="transition-colors hover:text-white">Case Studies</a></li>
                <li><a href="#process" className="transition-colors hover:text-white">6-Stage Process</a></li>
                <li><a href="#why" className="transition-colors hover:text-white">Why NovaCraft</a></li>
                <li><a href="#tech-stack" className="transition-colors hover:text-white">Tech Stack</a></li>
                <li><a href="#about" className="transition-colors hover:text-white">Agency Performance</a></li>
                <li><a href="#contact" className="transition-colors hover:text-white">Start a Project</a></li>
              </ul>
            </div>

            {/* Column 3: Solutions & Industries (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Solutions &amp; Industries</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" className="transition-colors hover:text-white">Custom Web Applications</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">Healthcare &amp; Clinical Portals</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">Bespoke Tailoring &amp; Garment ERP</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">Real-Time Sports &amp; Auction Platforms</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">AI Voice &amp; Mock Interview Engines</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">B2B Industrial Minerals &amp; Export</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">Supply Chain &amp; Retail Operations</a></li>
              </ul>
            </div>

            {/* Column 4: Featured Live Work (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">Featured Client Work</p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="https://drpoojabala.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                    <span>Dr. Pooja Bala Dental Clinic</span>
                    <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1 py-0.2 rounded">Live ↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://hingutailors.vercel.app/login" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                    <span>Hingu Tailors Cloud ERP</span>
                    <span className="text-[10px] text-blue-400 border border-blue-500/30 px-1 py-0.2 rounded">ERP ↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://cricketbid-tau.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                    <span>Cricket Auction Platform</span>
                    <span className="text-[10px] text-amber-400 border border-amber-500/30 px-1 py-0.2 rounded">Live ↗</span>
                  </a>
                </li>
                <li><a href="#projects" className="transition-colors hover:text-white">Aurevo Minerals (B2B Catalog)</a></li>
                <li><a href="#projects" className="transition-colors hover:text-white">InterviewIQ (Voice AI Simulation)</a></li>
                <li><a href="#projects" className="transition-colors hover:text-white">Grocery Operations Management</a></li>
              </ul>

              <div className="pt-3 border-t border-white/10">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => ReactGA.event({ category: 'Contact', action: 'Book Call Clicked (Footer)' })}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                >
                  <CalendarDays size={13} />
                  <span>Book Free Technical Call</span>
                </a>
              </div>
            </div>
          </div>

          {/* Legal, Compliance & Deployable Policy Links */}
          <div className="py-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-white/30 uppercase tracking-wider font-semibold text-[10px]">Legal &amp; Trust:</span>
              <button
                type="button"
                onClick={() => setActiveLegalModal('privacy')}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalModal('terms')}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalModal('cookies')}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Cookie Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalModal('security')}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Security Standards
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                XML Sitemap ↗
              </a>
            </div>
          </div>

          {/* Sub-Footer */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-white/40">
            <div>
              © {new Date().getFullYear()} NovaCraft Studio. All rights reserved. Registered software &amp; AI engineering agency.
            </div>
            <div className="flex items-center gap-4 text-white/60">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="GitHub"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="LinkedIn"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="WhatsApp Direct"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessible Production-Ready Legal & Policy Modals */}
      <AnimatePresence>
        {activeLegalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0b101d] p-6 md:p-8 text-white shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">
                      {activeLegalModal === 'privacy' && 'Privacy Policy'}
                      {activeLegalModal === 'terms' && 'Terms of Service'}
                      {activeLegalModal === 'cookies' && 'Cookie Policy'}
                      {activeLegalModal === 'security' && 'Security Standards'}
                    </h3>
                    <p className="text-[11px] text-white/40">NovaCraft Studio • Last updated November 2026</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-xs text-white/70 space-y-4 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                {activeLegalModal === 'privacy' && (
                  <>
                    <p>At NovaCraft Studio, we respect your privacy and are committed to protecting the confidential information of our clients, prospective partners, and site visitors.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">1. Information We Collect</h4>
                    <p>We collect information you explicitly provide when submitting contact inquiries, scheduling consultations, or entering into software development agreements. This includes name, email, phone number, company name, and project scope details.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">2. How We Use Information</h4>
                    <p>Information is used solely to respond to project inquiries, provide architectural assessments, prepare development proposals, and fulfill contractual software deliverables. We do not sell or lease your data to third parties.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">3. Data Security &amp; Confidentiality</h4>
                    <p>All communication and project materials are protected under strict confidentiality protocols. Data submitted via web forms is transmitted using TLS encryption.</p>
                  </>
                )}

                {activeLegalModal === 'terms' && (
                  <>
                    <p>These Terms of Service govern your access to NovaCraft Studio services and development deliverables.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">1. Scope of Services</h4>
                    <p>NovaCraft Studio provides software engineering, product design, AI system development, cloud infrastructure setup, and consulting services under mutual statements of work (SOW) or milestone agreements.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">2. Intellectual Property Ownership</h4>
                    <p>Unless explicitly agreed otherwise, upon complete milestone payment, 100% of custom source code, documentation, assets, and intellectual property created for the client are assigned directly and exclusively to the client with zero vendor lock-in.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">3. Warranties &amp; Support</h4>
                    <p>We guarantee all delivered software against technical defects for a 30-day post-launch warranty window, with extended SLA maintenance agreements available upon request.</p>
                  </>
                )}

                {activeLegalModal === 'cookies' && (
                  <>
                    <p>This Cookie Policy explains how NovaCraft Studio uses cookies and browser storage technologies.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">1. Essential Cookies</h4>
                    <p>We utilize strictly necessary technical tokens to maintain session integrity, user preferences (such as theme and navigation states), and ensure reliable form submissions.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">2. Performance &amp; Analytics</h4>
                    <p>We use privacy-friendly analytics (such as Google Analytics 4 and Microsoft Clarity) with IP anonymization to evaluate aggregate website traffic, optimize page speed, and enhance navigation usability.</p>
                  </>
                )}

                {activeLegalModal === 'security' && (
                  <>
                    <p>NovaCraft Studio maintains rigorous security and non-disclosure standards for enterprise clients.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">1. Non-Disclosure Agreements (NDA)</h4>
                    <p>We sign mutual NDAs before reviewing proprietary repositories, internal datasets, or business logic. All internal team members are bound by confidentiality clauses.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">2. Code &amp; Secret Management</h4>
                    <p>We never commit client secrets, API keys, or production database credentials to public repositories. Environment variables are managed securely via Doppler, AWS Secrets Manager, or encrypted vaults.</p>
                    <h4 className="text-sm font-semibold text-white pt-2">3. Repository Security</h4>
                    <p>Code is developed within private client repositories or transferred immediately upon milestone completion. Automated security linters and dependency vulnerability scans are run continuously in our CI/CD workflows.</p>
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Understood &amp; Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px'
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1a1a1a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1a1a1a' } }
        }}
      />
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={homePage} />
      <Route path="/project/:id" element={<ProjectDetail />} />
    </Routes>
  );
}

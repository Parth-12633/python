import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowRight,
  Blocks,
  Brain,
  BrainCircuit,
  ChartNoAxesCombined,
  Box,
  Code2,
  Cloud,
  Compass,
  Database,
  FileCode,
  GitBranch,
  Gauge,
  LayoutGrid,
  Layers,
  Monitor,
  MonitorPlay,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow
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

gsap.registerPlugin(ScrollTrigger);

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

const serviceObserverOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

let serviceObserver: IntersectionObserver | null = null;
const serviceRevealCallbacks = new Map<Element, () => void>();

function getServiceObserver() {
  if (!serviceObserver) {
    serviceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const callback = serviceRevealCallbacks.get(entry.target);
        if (callback) {
          callback();
          serviceObserver?.unobserve(entry.target);
          serviceRevealCallbacks.delete(entry.target);
        }
      });
    }, serviceObserverOptions);
  }

  return serviceObserver;
}

function useServiceReveal(onReveal: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = getServiceObserver();
    serviceRevealCallbacks.set(element, onReveal);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      serviceRevealCallbacks.delete(element);
    };
  }, [onReveal]);

  return ref;
}

type AnimatedHeadingProps = {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
};

function AnimatedHeading({ text, className = '', delay = 200, charDelay = 32 }: AnimatedHeadingProps) {
  const [visible, setVisible] = useState(false);
  const lines = text.split('\n');

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <h1 className={className} style={{ letterSpacing: '-0.04em' }}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split('').map((char, charIndex) => {
            const transitionDelay = lineIndex * line.length * charDelay + charIndex * charDelay;
            return (
              <span
                key={`${lineIndex}-${charIndex}`}
                className="inline-block"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-18px)',
                  transition: 'opacity 500ms ease, transform 500ms ease',
                  transitionDelay: `${transitionDelay}ms`,
                  whiteSpace: char === ' ' ? 'pre' : 'normal'
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

const metrics = [
  { value: '12+', label: 'Product Launches' },
  { value: '4.9★', label: 'Client Rating' },
  { value: '27%', label: 'Efficiency Lift' },
  { value: '98%', label: 'Retention Rate' }
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

type InteractiveBackgroundProps = {
  activity: number;
  mouse: { x: number; y: number };
  focus: string;
  scroll: number;
};

function BackgroundScene({ activity, mouse, focus, scroll }: InteractiveBackgroundProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const formRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.04 + (focus === 'services' ? 0.015 : 0), 0.02);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.03 + (focus === 'process' ? 0.01 : 0), 0.02);
      groupRef.current.position.y = Math.sin(time * 0.08 + scroll * 0.0004) * 0.03;
    }

    if (sphereRef.current) {
      sphereRef.current.position.x = -2.2 + mouse.x * 0.18;
      sphereRef.current.position.y = 1.05 + Math.sin(time * 0.35 + scroll * 0.0002) * 0.09 - mouse.y * 0.06;
      sphereRef.current.scale.setScalar(1 + activity * 0.015);
    }

    if (ringRef.current) {
      ringRef.current.position.x = 2.0 + mouse.x * 0.12;
      ringRef.current.position.y = -0.35 + Math.cos(time * 0.28 + scroll * 0.00015) * 0.08 + mouse.y * 0.04;
      ringRef.current.rotation.z = time * 0.08;
    }

    if (formRef.current) {
      formRef.current.position.x = -0.2 + mouse.x * 0.08;
      formRef.current.position.y = -1.2 + Math.sin(time * 0.24 + scroll * 0.00012) * 0.08;
      formRef.current.rotation.y = time * 0.1;
      formRef.current.rotation.z = 0.25 + mouse.y * 0.02;
    }
  });

  return (
    <>
      <color attach="background" args={['#020305']} />
      <fog attach="fog" args={['#020305', 9, 22]} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[3, 2, 5]} intensity={0.28} color="#e8efff" />
      <spotLight position={[-2.5, 1.5, 4.5]} intensity={0.16} color="#8ebabd" angle={0.36} penumbra={0.28} />

      <group ref={groupRef}>
        <Float speed={0.2} rotationIntensity={0.03} floatIntensity={0.12}>
          <mesh ref={sphereRef} position={[-2.2, 1.05, -1.4]}>
            <sphereGeometry args={[0.7, 48, 48]} />
            <meshPhysicalMaterial color="#f8fbff" roughness={0.14} metalness={0.12} transmission={0.9} thickness={0.4} transparent opacity={0.55} />
          </mesh>
        </Float>

        <Float speed={0.18} rotationIntensity={0.02} floatIntensity={0.1}>
          <mesh ref={ringRef} position={[2.0, -0.35, -1.35]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.8, 0.09, 20, 90]} />
            <meshStandardMaterial color="#f2f7ff" metalness={0.7} roughness={0.2} emissive="#8eb2ff" emissiveIntensity={0.05} />
          </mesh>
        </Float>

        <Float speed={0.22} rotationIntensity={0.03} floatIntensity={0.11}>
          <mesh ref={formRef} position={[-0.2, -1.2, -1.8]} rotation={[0.22, 0.45, 0.18]}>
            <torusKnotGeometry args={[0.5, 0.12, 96, 12]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.17} metalness={0.55} transmission={0.58} thickness={0.2} transparent opacity={0.5} />
          </mesh>
        </Float>
      </group>

      <mesh position={[0, 0, -4.2]}>
        <planeGeometry args={[24, 16]} />
        <meshBasicMaterial color="#020305" transparent opacity={0.12} />
      </mesh>
    </>
  );
}

function InteractiveBackground({ activity, mouse, focus, scroll }: InteractiveBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 48 }} dpr={[1, 2]}>
        <BackgroundScene activity={activity} mouse={mouse} focus={focus} scroll={scroll} />
      </Canvas>
    </div>
  );
}

type ServiceCardProps = {
  service: {
    title: string;
    description: string;
    icon: React.ElementType;
    accent: string;
  };
  index: number;
};

function ServiceCard({ service, index }: ServiceCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = service.icon;
  const controls = useAnimation();
  const [willChangeActive, setWillChangeActive] = useState(true);
  const revealRef = useServiceReveal(() => controls.start('visible'));
  const delay = ((index % 2) + Math.floor(index / 2)) * 0.08;

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientY - rect.top) / rect.height - 0.5;
    const y = (event.clientX - rect.left) / rect.width - 0.5;
    setTilt({ x: x * -8, y: y * 8 });
  };

  return (
    <motion.article
      ref={revealRef as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0.15, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay } }
      }}
      onAnimationComplete={() => setWillChangeActive(false)}
      whileHover={{ y: -2, scale: 1.01 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="revealer group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-blue-500/30"
      style={{
        willChange: willChangeActive ? 'opacity, transform' : 'auto',
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

function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.15, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
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

  const activeStepData = steps[activeStepIndex] ?? steps[0];

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

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) - 0.5,
        y: (event.clientY / window.innerHeight) - 0.5
      });
    };

    const handleScroll = () => {
      setScroll(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    gsap.utils.toArray<HTMLElement>('.counter').forEach((counter) => {
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

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);


  const homePage = (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white opacity-100" style={{ opacity: pageReady ? 1 : 1 }}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <video
          className="h-full w-full scale-105 object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_26%),linear-gradient(135deg,rgba(2,6,10,0.76)_0%,rgba(2,4,8,0.58)_45%,rgba(2,4,8,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.66)_0%,rgba(0,0,0,0.28)_48%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>
      <section className="relative isolate z-10 min-h-screen overflow-hidden bg-transparent text-white">
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

        <div className="relative z-10 flex min-h-screen flex-col px-6 pt-6 md:px-12 lg:px-16">
          <nav className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
            <div className="text-2xl font-semibold tracking-tight">Northstar Labs</div>
            <div className="hidden items-center gap-8 text-sm text-white/80 md:flex">
              <a className="transition-colors hover:text-gray-300" href="#services">Services</a>
              <a className="transition-colors hover:text-gray-300" href="#projects">Projects</a>
              <a className="transition-colors hover:text-gray-300" href="#process">Process</a>
              <a className="transition-colors hover:text-gray-300" href="#about">About</a>
              <a className="transition-colors hover:text-gray-300" href="#contact">Contact</a>
            </div>
            <a className="liquid-glass rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black" href="#contact">
              Book Consultation
            </a>
          </nav>

          <div className="flex flex-1 flex-col justify-end pb-12 lg:pb-16">
            <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
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
                    <a className="liquid-glass rounded-lg px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black" href="#contact">
                      Book a Strategy Call
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

            <section id="about" data-scene-section="about" className="relative z-20 px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/55">Agency metrics</p>
          <h2 className="max-w-4xl text-3xl font-normal leading-tight text-white md:text-5xl">
              Built to launch modern digital products, enterprise platforms, and AI-powered solutions.
          </h2>
          <div className="mt-12 grid gap-8 border-t border-white/10 pt-12 md:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="border-b border-white/10 pb-6 md:border-b-0 md:pb-0">
                <div data-value={metric.value.replace(/\D/g, '')} className="counter text-4xl font-semibold text-white md:text-5xl">
                  {metric.value.replace(/\D/g, '')}
                </div>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/70">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" data-scene-section="process" className="relative z-50 px-6 py-24 md:px-12 lg:px-16" style={{ opacity: 1 }}>
        <div className="mx-auto max-w-7xl">
          <div className="h-fit self-start">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/70">Sticky storytelling</p>
            <div className="space-y-6">
              <div className="text-3xl font-normal leading-tight text-white md:text-5xl">
                A process designed to move from ambition to execution without friction.
              </div>
              <p className="text-base leading-7 text-white/80 max-w-3xl">
                We combine strategic clarity, premium product design, and thoughtful engineering to build systems that feel effortless to use and durable in the long term.
              </p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 shadow-[0_50px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="grid grid-cols-6 divide-x divide-white/10 border-b border-white/10 bg-slate-950/75">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepIndex(index)}
                    className={`relative flex flex-col items-start gap-2 px-5 py-5 text-left transition duration-200 ${activeStepIndex === index ? 'bg-slate-900/95 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${activeStepIndex === index ? 'text-blue-300' : 'text-white/40'}`}>
                      {step.number}
                    </span>
                    <div className="flex items-center gap-2">
                      <StepIcon size={16} className={activeStepIndex === index ? 'text-white' : 'text-white/40'} />
                      <span className={`text-sm font-semibold tracking-[0.01em] ${activeStepIndex === index ? 'text-white' : 'text-white/40'}`}>{step.label}</span>
                    </div>
                    {activeStepIndex === index && <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500" />}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.95fr] gap-0 overflow-visible min-h-[520px]">
              <div className="p-10 border-r border-white/10 bg-slate-950/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center gap-3 text-white/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                      {React.createElement(activeStepData.icon, { size: 18, className: 'text-blue-300' })}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-300">
                      {activeStepData.number} — {activeStepData.label}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                      {activeStepData.heading}
                    </h3>
                    <p className="text-white text-base leading-relaxed max-w-2xl">
                      {activeStepData.description}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/40 mb-3">What you get</p>
                    {activeStepData.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-2 block h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                        <span className="text-sm text-white/70 leading-6">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-10 bg-slate-950/80 border-l border-white/10 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-xs tracking-widest text-white/30 uppercase mb-6">Typical Duration</p>
                    <p className="text-5xl font-bold text-white">{activeStepData.duration}</p>
                    <p className="text-white/30 text-sm mt-1">{activeStepData.durationLabel}</p>
                  </div>
                  <div className="mt-8">
                    <p className="text-xs tracking-widest text-white/30 uppercase mb-4">Key Output</p>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                      <p className="text-white/70 text-sm leading-relaxed italic">"{activeStepData.output}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" data-scene-section="projects" className="relative px-6 py-10 lg:px-16 lg:py-12">
        <div className="mx-auto max-w-[1500px] space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-10 lg:items-stretch">
            <motion.aside
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="order-2 flex h-auto w-full flex-col rounded-[24px] border border-white/10 bg-white/5 p-9 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-xl lg:order-1"
            >
              <div className="flex min-h-0 flex-col text-white">
                <div className="space-y-6">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-white/55">Featured Client Project</div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/20">
                    <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                    Completed & Delivered
                  </div>
                  <h2 className="text-[48px] font-bold leading-tight tracking-[-0.03em] text-white">Dental Clinic Website</h2>
                  <p className="max-w-xl text-[14px] leading-tight text-white/70">
                    A premium appointment-first website for a dental practice built to increase bookings, trust, and discovery.
                  </p>
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

                <div className="mt-6 grid gap-4 lg:grid-cols-2 text-white/80">
                  <div className="space-y-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Services</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Product Strategy', 'Platform Development', 'Analytics Integration', 'Performance Optimization'].map((service) => (
                        <div key={service} className="flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-[13px]">
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Technologies</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] uppercase tracking-[0.25em] text-white/75">
                      {['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'].map((tech) => (
                        <div key={tech} className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-[11px] uppercase tracking-[0.25em]">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="w-full rounded-xl border border-white/10 bg-slate-950/40 p-5 text-[13px] leading-tight text-white/70">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Project Overview</p>
                    <p className="mt-3 leading-tight">
                      A modern dental website built to increase patient bookings, improve trust, and deliver a seamless experience across devices.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-[13px] leading-tight text-white/70">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Challenge</p>
                      <p className="mt-3 leading-tight">
                        No modern digital presence, unclear booking flow, and low patient trust.
                      </p>
                    </div>
                    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-5 text-[13px] leading-tight text-white/70">
                      <p className="text-[11px] uppercase tracking-[0.35em] text-white/55">Solution</p>
                      <p className="mt-3 leading-tight">
                        Built a clean responsive website with easy appointment booking and clear service clarity.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-[12px] text-white/85">
                  {[
                    'Higher Trust',
                    'More Bookings',
                    'Clear Care Messaging',
                    'Faster Performance'
                  ].map((label) => (
                    <div key={label} className="flex h-20 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-xs">✔</div>
                      <p className="font-semibold leading-tight">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <a
                    href="https://dr-poojabala.netlify.app"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[13px] font-semibold text-white transition duration-300 hover:bg-white/10"
                  >
                    Explore Work →
                  </a>
                </div>
              </div>
            </motion.aside>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="order-1 flex min-h-0 h-full w-full flex-col rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.95)] shadow-[0_40px_120px_rgba(0,0,0,0.45)] transition duration-300 lg:order-2"
            >
              <div className="relative flex min-h-0 flex-1 w-full flex-col overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.95)]">
                <div className="relative flex h-[58px] items-center justify-center border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.95)] backdrop-blur-[20px] px-6">
                  <div className="absolute left-6 flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="absolute inset-x-0 flex justify-center">
                    <div className="flex h-8 w-80 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] px-4 text-[12px] uppercase tracking-[0.16em] text-white/80">
                      DR-POOJABALA.NETLIFY.APP
                    </div>
                  </div>
                </div>
                <div className="relative flex min-h-0 flex-1 w-full overflow-hidden bg-slate-950">
                  {!iframeError ? (
                    <iframe
                      ref={iframeRef}
                      src="https://dr-poojabala.netlify.app"
                      title="Dental Clinic Website Preview"
                      onLoad={() => setIframeError(false)}
                      onError={() => setIframeError(true)}
                      className="absolute inset-0 h-full w-full border-none"
                    />
                  ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-950 text-center text-white">
                        <div className="mx-auto max-w-xl px-8 py-10">
                          <p className="text-xs uppercase tracking-[0.28em] text-white/50">Preview unavailable</p>
                          <h3 className="mt-4 text-2xl font-semibold text-white">Website cannot be embedded</h3>
                          <p className="mt-3 text-sm leading-6 text-white/70">
                            The live site blocked iframe embedding. Use a static preview image or update the target site&apos;s embed headers for a reliable mockup.
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          </div>

          <div id="more-projects" className="space-y-8 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">More Projects</p>
            <SectionHeading className="mx-auto max-w-3xl text-3xl font-normal leading-tight text-white md:text-5xl">
              A selection of software, AI, analytics, and web work that feels premium, polished, and built to scale.
            </SectionHeading>
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

      <section id="services" data-scene-section="services" className="px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0.15, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }} transition={{ duration: 0.8 }} className="mb-10 max-w-3xl">
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

      <section className="relative px-6 py-20 md:px-12 lg:px-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-5%] top-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl" />
          <div className="absolute left-[40%] top-14 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-[20%] top-[55%] h-2 w-2 rounded-full bg-white/40" />
          <div className="absolute left-[22%] top-[44%] h-1.5 w-1.5 rounded-full bg-white/40" />
          <div className="absolute left-[75%] top-[34%] h-1.5 w-1.5 rounded-full bg-white/30" />
          <div className="absolute left-[60%] top-[68%] h-1.5 w-1.5 rounded-full bg-white/30" />
        </div>

        <div className="relative mx-auto max-w-[1500px]">
          <motion.div initial={{ opacity: 0.15, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }} transition={{ duration: 0.8 }} className="mb-14 max-w-[680px]">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/55">Technology stack</p>
            <SectionHeading className="text-4xl font-semibold leading-tight text-white md:text-6xl">Built with modern tooling and sharp execution.</SectionHeading>
            <p className="mt-6 text-base leading-8 text-white/65">
              We use a carefully selected technology ecosystem to build scalable, high-performance digital products—from modern web applications to AI-powered solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.15, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto w-[95vw] max-w-[1600px] overflow-hidden rounded-[32px] border border-white/8 bg-slate-950/75 px-6 py-12 shadow-[0_50px_130px_rgba(2,6,23,0.8)] backdrop-blur-[40px] md:px-12 md:py-16"
          >
            {/* subtle animated central glow */}
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.015, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="h-[560px] w-[560px] rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 35%)', opacity: 0.28 }}
              />
            </motion.div>

            {/* noise + soft gradient overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_42%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.05),transparent_36%)] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-10 h-48 w-48 rounded-full bg-blue-400/8 blur-3xl opacity-8" />
              <div className="absolute right-8 bottom-6 h-36 w-36 rounded-full bg-pink-400/8 blur-3xl opacity-8" />
            </div>

            <div className="relative z-10 grid gap-10 xl:gap-12">
              <div className="max-w-3xl">
                <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/55">Technology ecosystem</p>
                <h2 className="text-4xl font-semibold leading-tight text-white md:text-5xl">A unified platform for premium digital experiences.</h2>
                <p className="mt-6 text-base leading-8 text-white/65">
                  Six strategic domains, one refined ecosystem designed to feel editorial, polished and deeply crafted for modern agency production.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {ecosystemColumns.map((column, index) => {
                  const ColumnIcon = column.icon as any;

                  return (
                    <motion.div
                      key={column.title}
                      initial={{ opacity: 0.15, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }}
                      transition={{ duration: 0.6, delay: Math.min(0.12 + index * 0.06, 0.15) }}
                      whileHover={{ y: -6, scale: 1.02, boxShadow: '0 30px 90px rgba(2,6,23,0.6)' }}
                      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-8 text-white transition-all duration-300"
                      style={{ minHeight: 220 }}
                    >
                      <div className="absolute inset-x-6 top-0 h-[3px] rounded-b-md opacity-95" style={{ background: `linear-gradient(90deg, ${column.accentFrom}, ${column.accentTo})`, filter: 'blur(6px)' }} />
                      <div className="absolute inset-x-6 top-[6px] h-1 rounded-b-md opacity-30" style={{ background: `linear-gradient(90deg, ${column.accentFrom}, ${column.accentTo})`, filter: 'blur(10px)' }} />

                      <div className="relative flex items-start gap-6">
                        <motion.div
                          whileHover={{ rotate: 5, scale: 1.08 }}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                          className="relative flex h-[54px] w-[54px] items-center justify-center rounded-full"
                        >
                          <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${column.accentFrom}22 0%, ${column.accentTo}12 25%, transparent 55%)`, filter: 'blur(16px)' }} />
                          <div className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/10 bg-white/6 backdrop-blur-sm" style={{ boxShadow: `0 12px 40px ${column.accentFrom}14` }}>
                            <ColumnIcon size={48} className="relative text-white" />
                          </div>
                        </motion.div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white tracking-tight">{column.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-white/65">{column.description}</p>

                          <div className="mt-7 flex flex-wrap gap-3">
                            {column.items.map((item) => {
                              const TechIcon = techIconMap[item];
                              return (
                                <motion.button
                                  key={item}
                                  whileHover={{ y: -4 }}
                                  transition={{ duration: 0.25 }}
                                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgba(2,6,23,0.35)]"
                                  style={{
                                    boxShadow: '0 6px 22px rgba(0,0,0,0.24)',
                                    borderColor: 'rgba(255,255,255,0.08)'
                                  }}
                                >
                                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: column.accentFrom }} />
                                  {TechIcon ? <TechIcon size={14} className="text-white/70" /> : null}
                                  <span className="whitespace-nowrap">{item}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stackStats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-[28px] border border-white/10 bg-white/4 p-6 text-center text-white backdrop-blur-sm"
                    style={{ boxShadow: '0 20px 60px rgba(2,6,23,0.55)' }}
                  >
                    <div className="text-4xl font-semibold">
                      {typeof stat.value === 'number' ? <CountUp value={stat.value} /> : stat.value}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.35em] text-white/50">{stat.label}</div>
                    <div className="mt-3 text-sm text-white/65">{stat.text}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section data-scene-section="why" className="px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-6">
          <motion.div initial={{ opacity: 0.15, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/55">Why Northstar Labs</p>
            <SectionHeading className="text-3xl font-normal leading-tight text-white md:text-5xl">Strategy, design, and execution under one roof.</SectionHeading>
          </motion.div>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div key={benefit} initial={{ opacity: 0.15, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1, margin: '0px 0px -50px 0px' }} transition={{ duration: 0.7, delay: Math.min(index * 0.05, 0.15) }} className="liquid-glass flex flex-col justify-between rounded-[1.5rem] border border-white/10 px-6 py-8 md:flex-row md:items-center">
                <div className="text-3xl font-semibold text-white md:text-4xl">0{index + 1}</div>
                <div className="mt-4 text-2xl font-normal text-white md:mt-0 md:text-3xl">{benefit}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" data-scene-section="contact" className="relative isolate px-6 py-24 md:px-12 lg:px-16">
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
              <a className="liquid-glass rounded-lg px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black" href="mailto:hello@northstarlabs.com">Book Consultation</a>
              <a className="rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white/10" href="mailto:hello@northstarlabs.com">Start a Conversation</a>
            </div>
          </div>

          <form className="liquid-glass rounded-[1.5rem] border border-white/10 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-white/70">
                <span className="mb-2 block">Name</span>
                <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Your name" />
              </label>
              <label className="text-sm text-white/70">
                <span className="mb-2 block">Email</span>
                <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="you@company.com" />
              </label>
            </div>
            <label className="mt-4 block text-sm text-white/70">
              <span className="mb-2 block">Company</span>
              <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Company name" />
            </label>
            <label className="mt-4 block text-sm text-white/70">
              <span className="mb-2 block">Project Details</span>
              <textarea className="min-h-32 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Tell us about the challenge." />
            </label>
            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-gray-100" type="button">
              Submit <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-sm text-white/60 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold text-white">Northstar Labs</div>
            <div>AI • Software • Analytics</div>
          </div>
          <div className="flex flex-wrap gap-4">
            <a className="transition-colors hover:text-white" href="#services">Services</a>
            <a className="transition-colors hover:text-white" href="#projects">Projects</a>
            <a className="transition-colors hover:text-white" href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={homePage} />
      <Route path="/project/:id" element={<ProjectDetail />} />
    </Routes>
  );
}

import type { ComponentType, CSSProperties } from 'react';
import {
  BrainCircuit,
  Brain,
  ChartNoAxesCombined,
  Cloud,
  Heart,
  Code2,
  Compass,
  Database,
  LayoutGrid,
  Layers,
  Monitor,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  SiAmazonaws,
  SiDocker,
  SiFramer,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiVercel
} from 'react-icons/si';

type Icon = ComponentType<{ size?: number | string; className?: string; style?: CSSProperties }>;

export const agencyMetrics: {
  icon: Icon;
  label: string;
  description: string;
  countTo?: number;
  suffix?: string;
  text?: string;
}[] = [
  {
    icon: Rocket,
    countTo: 20,
    suffix: '+',
    label: 'Projects Delivered',
    description: 'Custom SaaS, enterprise ERPs, clinical portals, and AI systems built for real businesses.'
  },
  {
    icon: Zap,
    text: '2–4 wks',
    label: 'Average Sprint',
    description: 'Milestone-driven execution delivering testable staging deployments every week.'
  },
  {
    icon: ShieldCheck,
    countTo: 99,
    suffix: '%',
    label: 'Performance Score',
    description: 'Engineered for high availability, sub-second responses, and fault-tolerant cloud scale.'
  },
  {
    icon: Code2,
    countTo: 100,
    suffix: '%',
    label: 'Code Ownership',
    description: 'Clean TypeScript & Python codebases, comprehensive documentation, and zero vendor lock-in.'
  }
];

export const steps = [
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

export type Step = (typeof steps)[number];

export const services = [
  {
    title: 'Custom Web Development',
    description: 'Building modern web applications, portals, and SaaS experiences with scalable architecture and polished execution.',
    icon: ChartNoAxesCombined,
    glow: '#B7FF00',
    points: ['SaaS platforms', 'Client portals', 'APIs & integrations']
  },
  {
    title: 'AI Solutions',
    description: 'Delivering intelligent automation, predictive models, and machine learning systems that power smarter business outcomes.',
    icon: BrainCircuit,
    glow: '#B7FF00',
    points: ['Workflow automation', 'Predictive models', 'LLM applications']
  },
  {
    title: 'Data Analytics',
    description: 'Turning data into dashboards, analytics platforms, and insight-driven products for enterprise teams.',
    icon: Database,
    glow: '#B7FF00',
    points: ['Live dashboards', 'Data pipelines', 'Reporting suites']
  },
  {
    title: 'UI/UX Design',
    description: 'Designing polished digital products and interfaces that feel intuitive, premium, and built for conversion.',
    icon: LayoutGrid,
    glow: '#B7FF00',
    points: ['Product design', 'Design systems', 'Interactive prototypes']
  },
  {
    title: 'Wedding & Event Invitations',
    description: 'Cinematic digital invitations for weddings, anniversaries and celebrations — animated reveals, countdowns, RSVP and maps, shared with a single link.',
    icon: Heart,
    glow: '#B7FF00',
    points: ['Wedding & anniversary cards', 'RSVP & guest tracking', 'Countdown, maps & calendar']
  }
];

export const capabilityTicker = [
  'Web Applications',
  'AI Systems',
  'Analytics Platforms',
  'Enterprise ERP',
  'Healthcare Portals',
  'SaaS Products',
  'Automation',
  'UI / UX Design',
  'Wedding Invitations'
];

export const benefits = [
  { title: 'Modern web applications', text: 'Fast, accessible, SEO-ready products built on React and TypeScript.' },
  { title: 'AI-powered solutions', text: 'Practical automation and ML features wired into your real workflows.' },
  { title: 'Enterprise platforms', text: 'ERPs, portals, and internal tools designed for scale and reliability.' },
  { title: 'Analytics dashboards', text: 'Decision-ready insights surfaced in clean, real-time interfaces.' }
];

export const ecosystemColumns: {
  title: string;
  icon: Icon;
  accent: string;
  description: string;
  items: string[];
}[] = [
  { title: 'Frontend', icon: Monitor, accent: '#B7FF00', description: 'Modern responsive interfaces built for speed.', items: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'] },
  { title: 'Backend', icon: Server, accent: '#B7FF00', description: 'Scalable APIs and business logic.', items: ['Node.js', 'Express', 'Python', 'Flask'] },
  { title: 'AI & Automation', icon: Brain, accent: '#B7FF00', description: 'Intelligent workflows and automation.', items: ['OpenAI', 'Python', 'Automation', 'TensorFlow'] },
  { title: 'Database', icon: Database, accent: '#B7FF00', description: 'Reliable structured data layer.', items: ['MySQL', 'MongoDB', 'PostgreSQL'] },
  { title: 'Cloud Infrastructure', icon: Cloud, accent: '#B7FF00', description: 'Deployment and infrastructure.', items: ['AWS', 'Docker', 'Vercel'] },
  { title: 'Motion & UX', icon: Sparkles, accent: '#B7FF00', description: 'Interactive experiences and refined motion.', items: ['Framer Motion', 'GSAP', 'Lenis'] }
];

export const techIconMap: Record<string, Icon> = {
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

export const stackStats = [
  { countTo: 20, suffix: '+', label: 'Projects Delivered', text: 'Successfully launched for businesses worldwide.' },
  { countTo: 15, suffix: '+', label: 'Core Technologies', text: 'Modern stack for scalable applications.' },
  { countTo: 99, suffix: '%', label: 'Performance Score', text: 'Optimized for speed and reliability.' },
  { text2: 'AI', label: 'Powered Development', text: 'Building intelligent digital experiences.' }
] as { countTo?: number; suffix?: string; text2?: string; label: string; text: string }[];

/** Quick-filter chips for the work grid. `match` is a substring or pipe-separated keyword list tested against project tags and category. */
export const projectFilters = [
  { label: 'All work', match: null },
  { label: 'Healthcare', match: 'healthcare' },
  { label: 'Business & ERP', match: 'business|erp' },
  { label: 'Invitations', match: 'invitation|wedding' },
  { label: 'Architecture', match: 'architecture' },
  { label: 'AI Solutions', match: 'ai' },
  { label: 'Platforms', match: 'platform|auction' }
] as { label: string; match: string | null }[];

export const featuredLinks = [
  { name: 'Dr. Kabir Anand (Cardiology)', href: 'https://darshvk12.github.io/dr-kabir-anand/', tag: 'Live', color: 'text-neon border-neon/40' },
  { name: 'Dr. Ruchit Shah (Orthopaedics)', href: 'https://darshvk12.github.io/dr-ruchit-shah/', tag: 'Live', color: 'text-neon border-neon/40' },
  { name: 'Valence Atelier (Architecture)', href: 'https://valence-atelier.vercel.app/', tag: 'Live', color: 'text-neon border-neon/40' },
  { name: 'Dr. Pooja Bala Dental Clinic', href: 'https://drpoojabala.com', tag: 'Live', color: 'text-neon border-neon/30' },
  { name: 'Hingu Tailors Cloud ERP', href: 'https://hingutailors.vercel.app/login', tag: 'ERP', color: 'text-neon border-neon/40' },
  { name: 'Cricket Auction Platform', href: 'https://cricketbid-tau.vercel.app/', tag: 'Live', color: 'text-neon border-neon/40' },
  { name: 'Aurevo Minerals LLP', href: 'https://auerevo-minerals.vercel.app/', tag: 'Live', color: 'text-neon border-neon/30' },
  { name: 'Golden Jubilee Invitation', href: 'https://anniversary-invitation-card.vercel.app/', tag: 'Live', color: 'text-neon border-neon/40' },
  { name: 'Heritage Wedding Invitation (Showcase)', href: '/demos/heritage-wedding/index.html', tag: 'Demo', color: 'text-neon border-neon/40' }
];

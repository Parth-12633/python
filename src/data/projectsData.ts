import type { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'dr-pooja-bala-dental-clinic',
    slug: 'dr-pooja-bala-dental-clinic',
    badge: 'CLIENT PROJECT',
    status: 'CLIENT PROJECT',
    initials: 'DP',
    title: 'Dr. Pooja Bala Dental Clinic',
    description: 'A premium appointment-first website for a dental practice built to increase bookings, trust, and discovery.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    category: 'Healthcare',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    duration: '2 Weeks',
    platform: 'Responsive Website',
    overview: 'A modern, appointment-first dental clinic website built for Dr. Pooja Bala, a leading endodontist and dental specialist in Agra. The platform delivers instant patient appointment scheduling, showcases before/after smile transformations, details specialized dental treatments, and establishes strong clinical trust.',
    challenge: 'The clinic had no modern digital presence, relied on manual phone appointment bookings, and lacked an interactive way to showcase complex clinical work and patient testimonials.',
    solution: 'Designed and engineered a high-converting, mobile-first responsive platform featuring one-click appointment scheduling, direct WhatsApp inquiries, comprehensive treatment service guides, before/after smile galleries, and verified patient reviews.',
    results: [
      'High conversion rate for online patient appointments',
      'Seamless multi-device mobile & desktop booking flow',
      'Optimized local SEO and fast Core Web Vitals',
      'Interactive smile gallery and clinical proof points'
    ],
    previewImage: '/projects/dental.png',
    liveUrl: 'https://drpoojabala.com',
    images: [
      '/projects/dental1.png',
      '/projects/dental2.png',
      '/projects/dental3.png',
      '/projects/dental4.png'
    ]
  },
  {
    id: 'hingu-tailors-erp',
    slug: 'hingu-tailors-erp',
    badge: 'CLIENT PROJECT',
    status: 'CLIENT PROJECT',
    initials: 'HT',
    title: 'Hingu Tailors ERP',
    description: 'An enterprise cloud ERP platform engineered for bespoke tailoring, custom garment manufacturing, and multi-stage order tracking.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'ERP'],
    category: 'Enterprise ERP / Retail',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'REST API'],
    duration: '6 Weeks',
    platform: 'Web Application',
    overview: 'Hingu Tailors ERP is a specialized garment manufacturing and bespoke tailoring management system. The platform streamlines physical measurement registers into secure digital archives, tracks garment production across cutting and stitching stages, manages worker piece-rates, handles fabric stock, prints job slips with barcodes, and empowers customers to track their tailoring orders live.',
    challenge: 'Traditional bespoke tailoring businesses grapple with lost physical measurement books, chaotic order statuses, inaccurate fabric stock calculations, and manual invoicing — causing delivery delays and customer friction.',
    solution: 'Architected and built a dedicated cloud-based ERP with digital measurement profiles, automated order progression boards, worker wage/rate masters, barcode scanning for fast job slips, real-time fabric stock management, and self-serve customer order tracking.',
    results: [
      'End-to-end tracking of bespoke orders from cutting to customer delivery',
      'Zero measurement record loss with digital measurement repository',
      'Real-time fabric inventory control and job costing',
      'Direct customer live tracking via secure public links'
    ],
    previewImage: '/projects/s.png',
    liveUrl: 'https://hingutailors.vercel.app/login',
    images: [
      '/projects/s1.png',
      '/projects/s2.png',
      '/projects/s3.png',
      '/projects/s4.png'
    ]
  },
  {
    id: 'aurevo-minerals',
    slug: 'aurevo-minerals',
    badge: 'CLIENT PROJECT',
    status: 'CLIENT PROJECT',
    initials: 'AM',
    title: 'Aurevo Minerals',
    description: 'A global B2B commercial platform specializing in high-grade activated carbon and mineral-rich roasted bamboo salt.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'B2B'],
    category: 'Industrial Minerals / Export',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    duration: '3 Weeks',
    platform: 'B2B Web Platform',
    overview: 'Aurevo Minerals is a dedicated B2B manufacturing and international export platform engineered for activated carbon grades and premium roasted bamboo salt products. The platform equips global industrial buyers and health enterprises with instant technical specification sheets, dynamic bulk Request-for-Quote (RFQ) pipelines, laboratory quality certifications, and direct trade inquiries.',
    challenge: 'Global buyers in water purification, industrial filtration, and therapeutic mineral markets struggled with fragmented supplier catalogs, lack of downloadable lab test reports, and delayed offline email quotation processes.',
    solution: 'Architected a streamlined commercial digital catalog highlighting activated carbon adsorption ratings (iodine values, mesh sizes) and multi-roasted bamboo salt mineral profiles, coupled with automated RFQ workflows, WhatsApp B2B desk connection, and rapid sample dispatch requests.',
    results: [
      'Comprehensive digital catalog of activated carbon & bamboo salt grades',
      'Streamlined international bulk quotation & RFQ funnel',
      'Direct access to technical data sheets & lab certificates',
      'Mobile-responsive global buyer portal optimized for trade'
    ],
    previewImage: '/projects/aurevo.png',
    liveUrl: '',
    images: [
      '/projects/aurevo1.png',
      '/projects/aurevo2.png',
      '/projects/aurevo3.png'
    ]
  },
  {
    id: 'cricket-tournament-platform',
    slug: 'cricket-tournament-platform',
    badge: 'CLIENT PROJECT',
    status: 'CLIENT PROJECT',
    initials: 'CT',
    title: 'Cricket Auction Platform',
    description: 'A production-grade, real-time IPL-style cricket auction platform built for 1000+ concurrent users.',
    tags: ['React', 'Node.js', 'Socket.IO', 'MongoDB'],
    category: 'Real-Time Event Platform',
    technologies: ['React', 'Next.js', 'AWS', 'Firebase'],
    duration: '8 Weeks',
    platform: 'Web Application',
    overview: 'A real-time auction platform that lets admins run live IPL-style player auctions with role-based team logins, Excel-based bulk player uploads, Google Drive-hosted player images, live bidding synced via Socket.IO, countdown timers, and full analytics/export tools.',
    challenge: 'Organizers needed a way to run transparent, real-time player auctions online — with instant bid syncing across every team\'s screen, admin controls for pausing/skipping/forcing sales, and no dependency on paid image storage or complex file uploads.',
    solution: 'Built a Socket.IO-powered auction engine with live bid broadcasting, a configurable countdown timer that resets on every bid, full admin controls (start/pause/force sell/skip/mark unsold), Excel bulk import for players, and Google Drive as a zero-cost image CDN — all backed by MongoDB with atomic transactions for bid integrity.',
    results: [
      'Real-time bid syncing across 1000+ concurrent users',
      'Full squad & purse transparency for all teams',
      'Automated Excel import/export for players & results',
      'Zero-cost image hosting via Google Drive'
    ],
    previewImage: '/projects/cric.png',
    liveUrl: 'https://cricketbid-tau.vercel.app/',
    images: [
      '/projects/cric1.png',
      '/projects/cric2.png',
      '/projects/cric3.png',
      '/projects/cric4.png'
    ]
  },
  {
    id: 'interviewiq',
    slug: 'interviewiq',
    badge: 'CLIENT PROJECT',
    status: 'CLIENT PROJECT',
    initials: 'II',
    title: 'InterviewIQ',
    description: 'An AI-powered mock interview platform that conducts voice-based interviews and delivers instant performance analytics.',
    tags: ['React', 'Node.js', 'OpenAI', 'Firebase'],
    category: 'AI / EdTech',
    technologies: ['React', 'Node.js', 'OpenAI', 'Firebase'],
    duration: '10 Weeks',
    platform: 'Web Application',
    overview: 'InterviewIQ helps candidates practice real interviews with an AI interviewer that speaks and listens in real time. Users sign in with Google, receive free starter credits, then either manually select their target role, experience level, and interview type (HR or Technical) — or upload their resume to auto-extract this information. The AI then conducts a structured 5-question voice interview that progressively increases in difficulty.',
    challenge: 'Candidates lack access to realistic, low-cost interview practice with actionable feedback. Most mock interview tools are either text-based, generic, or require scheduling a human interviewer.',
    solution: 'Built a voice-driven AI interviewer using speech-to-text and text-to-speech pipelines integrated with OpenAI, resume parsing for auto-filled role/experience detection, Google OAuth sign-in with a free credit system, and a difficulty-scaled question engine (2 easy, 2 medium, 1 hard). After the interview, users get a full analysis dashboard with strengths, weaknesses, and improvement recommendations.',
    results: [
      'Voice-to-voice AI interview simulation, no scheduling needed',
      'Resume upload auto-detects role & experience level',
      'Progressive difficulty scoring across 5 questions',
      'Post-interview analytics dashboard with actionable feedback'
    ],
    previewImage: '/projects/i.png',
    liveUrl: '',
    images: [
      '/projects/i1.png',
      '/projects/i2.png',
      '/projects/i3.png',
      '/projects/i4.png'
    ]
  },
  {
    id: 'grocery-store-management-system',
    slug: 'grocery-store-management-system',
    badge: 'INTERNAL PRODUCT',
    status: 'INTERNAL PRODUCT',
    initials: 'GS',
    title: 'Grocery Store Management System',
    description: 'A modern grocery operations platform for store teams, supplier workflows, and reporting.',
    tags: ['REACT', 'TAILWIND CSS', 'NODE.JS', 'POSTGRESQL'],
    category: 'Retail Operations',
    technologies: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    duration: '6 Weeks',
    platform: 'Web Application',
    overview: 'A full-stack grocery management system built to streamline daily store operations, manage inventory levels, handle supplier orders, and generate performance reports for store managers.',
    challenge: 'Manual inventory tracking, supplier miscommunication, and lack of real-time reporting were causing stockouts and revenue loss.',
    solution: 'Built a centralized dashboard with real-time inventory updates, supplier portal, and automated reporting — reducing stockouts by 40%.',
    results: ['40% reduction in stockouts', 'Faster supplier order flow', 'Real-time reporting dashboard', 'Mobile-ready for store staff'],
    previewImage: '/projects/groc4.png',
    liveUrl: '',
    images: [
      '/projects/groc1.png',
      '/projects/groc2.png',
      '/projects/groc3.png',
      '/projects/groc5.png'
    ]
  }
];

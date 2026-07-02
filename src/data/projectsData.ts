import type { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'grocery-store-management-system',
    slug: 'grocery-store-management-system',
    badge: 'INTERNAL PRODUCT',
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
  },
  {
    id: 'cricket-tournament-platform',
    slug: 'cricket-tournament-platform',
    badge: 'CLIENT PROJECT',
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
    liveUrl: '',
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
    id: 'analytics-dashboard',
    slug: 'analytics-dashboard',
    badge: 'CLIENT PROJECT',
    initials: 'AD',
    title: 'Prompt2Site',
    description: 'An AI website builder that turns a single text prompt into a fully editable, functional website.',
    tags: ['TypeScript', 'React', 'CSS', 'AI'],
    category: 'AI / Website Builder',
    technologies: ['React', 'Tailwind CSS', 'PostgreSQL', 'Chart.js'],
    duration: '6 Weeks',
    platform: 'Web Application',
    overview: 'Prompt2Site lets users describe the website they want in plain language, then generates a complete, working site — layout, content, and functionality included. Once generated, users can visually edit every section, component, and style directly in the browser, no code required.',
    challenge: 'Building a website from scratch takes design skills, coding knowledge, and hours of setup — even for simple landing pages or portfolios. Non-technical users needed a way to go from idea to a live, editable website in minutes.',
    solution: 'Built an AI generation pipeline that interprets a user\'s prompt and scaffolds a full website with working components and pages. Added an in-browser visual editor so users can tweak text, layout, colors, and functionality post-generation without touching code.',
    results: [
      'Full website generated from a single text prompt',
      'Live in-browser editor for every generated section',
      'No-code workflow from idea to deployable site',
      'Built primarily in TypeScript for type-safe, maintainable output'
    ],
    previewImage: '/projects/s.png',
    liveUrl: '',
    images: [
      '/projects/s1.png',
      '/projects/s2.png',
      '/projects/s3.png',
      '/projects/s4.png'
    ]
  }
];

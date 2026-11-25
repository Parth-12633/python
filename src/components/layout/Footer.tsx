import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, Github, Globe, Linkedin, MessageCircle } from 'lucide-react';
import { CALENDLY_URL, whatsappLink } from '../../config';
import { featuredLinks } from '../../data/siteData';
import { Logo } from './Logo';
import { LegalModal, type LegalKey } from './LegalModal';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';

const navigate = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/#services' },
  { label: 'Case Studies', to: '/#projects' },
  { label: 'Our Process', to: '/#process' },
  { label: 'Tech Stack', to: '/#tech-stack' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' }
];

const expertise = [
  'Custom Web Applications',
  'AI & Automation Systems',
  'Analytics Dashboards',
  'Healthcare & Clinical Portals',
  'Enterprise ERP & Retail Ops',
  'Real-Time Sports & Auction Platforms',
  'B2B Industrial & Export Portals',
  'Wedding & Event Invitations'
];

const legalLinks: [LegalKey, string][] = [
  ['privacy', 'Privacy Policy'],
  ['terms', 'Terms of Service'],
  ['cookies', 'Cookie Policy'],
  ['security', 'Security Standards']
];

const socials = [
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin }
];

function Heading({ children }: { children: React.ReactNode }) {
  return <h4 className="eyebrow mb-6 !font-display !text-[0.8rem] !text-white">{children}</h4>;
}

const linkCls = 'group/l inline-flex items-center gap-1.5 text-[14px] text-white/60 transition-colors duration-300 hover:text-neon';

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  const [pathname, hash] = to.split('#');
  return (
    <Link to={{ pathname: pathname || '/', hash: hash ? `#${hash}` : '' }} className={linkCls}>
      <span className="h-px w-0 bg-neon transition-all duration-300 group-hover/l:w-3" />
      {children}
    </Link>
  );
}

export function Footer() {
  const [legal, setLegal] = useState<LegalKey | null>(null);

  return (
    <footer className="relative z-10 border-t border-white/15 bg-black text-sm text-white/60">
      {/* Pre-footer CTA */}
      <div className="border-b border-white/15">
        <Reveal className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 md:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-20">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h3 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.6vw,3.8rem)] font-semibold uppercase leading-[1] text-white">
              Have a project in mind? <span className="text-neon">Let’s talk.</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ReactGA.event({ category: 'Contact', action: 'Book Call Clicked (Footer)' })}
              className="btn btn-primary group"
            >
              <CalendarDays size={18} /> Book a free call
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="/#contact" className="btn btn-ghost">Send an enquiry</a>
          </div>
        </Reveal>
      </div>

      {/* Main directory */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-16">
        <Stagger className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12" stagger={0.08}>
          <StaggerItem className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-[14px] leading-7 text-white/60">
              A software and AI engineering studio building high-performance digital products, enterprise platforms and production AI systems for businesses worldwide.
            </p>
            <ul className="mt-8 space-y-3 text-[13px]">
              <li className="flex items-center gap-3"><Globe size={15} className="text-neon" /> India · IST (UTC +5:30) · working globally</li>
              <li className="flex items-center gap-3"><Clock size={15} className="text-neon" /> Replies within 24 business hours</li>
            </ul>
          </StaggerItem>

          <StaggerItem className="lg:col-span-2">
            <Heading>Navigate</Heading>
            <ul className="space-y-3">
              {navigate.map((n) => (
                <li key={n.label}><FooterLink to={n.to}>{n.label}</FooterLink></li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem className="lg:col-span-3">
            <Heading>Expertise</Heading>
            <ul className="space-y-3">
              {expertise.map((e) => (
                <li key={e}><FooterLink to="/#services">{e}</FooterLink></li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem className="lg:col-span-3">
            <Heading>Featured work</Heading>
            <ul className="space-y-3">
              {featuredLinks.map((l) => (
                <li key={l.name}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    <span className="h-px w-0 bg-neon transition-all duration-300 group-hover/l:w-3" />
                    {l.name}
                    <ArrowUpRight size={13} className="opacity-0 transition-opacity duration-300 group-hover/l:opacity-100" />
                  </a>
                </li>
              ))}
              <li><FooterLink to="/#projects">InterviewIQ — Voice AI Engine</FooterLink></li>
            </ul>
          </StaggerItem>
        </Stagger>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-7 md:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} NovaCraft Studio. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            {legalLinks.map(([key, label]) => (
              <li key={key}>
                <button type="button" onClick={() => setLegal(key)} className="link-underline text-white/55 transition-colors hover:text-neon">
                  {label}
                </button>
              </li>
            ))}
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="link-underline text-white/55 transition-colors hover:text-neon">
                Sitemap
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            {[...socials, { href: whatsappLink(false), label: 'WhatsApp', icon: MessageCircle }].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-neon hover:bg-neon hover:text-black"
              >
                <Icon size={16} />
              </a>
            ))}
            <a
              href="#top"
              className="ml-2 inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-xs font-semibold uppercase tracking-wider text-white/80 transition-all duration-300 hover:border-neon hover:text-neon"
            >
              Top <ArrowUpRight size={13} className="-rotate-45" />
            </a>
          </div>
        </div>
      </div>

      <LegalModal active={legal} onClose={() => setLegal(null)} />
    </footer>
  );
}

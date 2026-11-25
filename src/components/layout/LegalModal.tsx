import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import { getLenis } from '../../lib/lenis';

export type LegalKey = 'privacy' | 'terms' | 'cookies' | 'security';

const TITLES: Record<LegalKey, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  cookies: 'Cookie Policy',
  security: 'Security Standards'
};

const H = ({ children }: { children: React.ReactNode }) => <h4 className="pt-2 text-sm font-semibold text-white">{children}</h4>;

function Body({ k }: { k: LegalKey }) {
  if (k === 'privacy')
    return (
      <>
        <p>At NovaCraft Studio, we respect your privacy and are committed to protecting the confidential information of our clients, prospective partners, and site visitors.</p>
        <H>1. Information We Collect</H>
        <p>We collect information you explicitly provide when submitting contact inquiries, scheduling consultations, or entering into software development agreements. This includes name, email, phone number, company name, and project scope details.</p>
        <H>2. How We Use Information</H>
        <p>Information is used solely to respond to project inquiries, provide architectural assessments, prepare development proposals, and fulfill contractual software deliverables. We do not sell or lease your data to third parties.</p>
        <H>3. Data Security &amp; Confidentiality</H>
        <p>All communication and project materials are protected under strict confidentiality protocols. Data submitted via web forms is transmitted using TLS encryption.</p>
      </>
    );
  if (k === 'terms')
    return (
      <>
        <p>These Terms of Service govern your access to NovaCraft Studio services and development deliverables.</p>
        <H>1. Scope of Services</H>
        <p>NovaCraft Studio provides software engineering, product design, AI system development, cloud infrastructure setup, and consulting services under mutual statements of work (SOW) or milestone agreements.</p>
        <H>2. Intellectual Property Ownership</H>
        <p>Unless explicitly agreed otherwise, upon complete milestone payment, 100% of custom source code, documentation, assets, and intellectual property created for the client are assigned directly and exclusively to the client with zero vendor lock-in.</p>
        <H>3. Warranties &amp; Support</H>
        <p>We guarantee all delivered software against technical defects for a 30-day post-launch warranty window, with extended SLA maintenance agreements available upon request.</p>
      </>
    );
  if (k === 'cookies')
    return (
      <>
        <p>This Cookie Policy explains how NovaCraft Studio uses cookies and browser storage technologies.</p>
        <H>1. Essential Cookies</H>
        <p>We utilize strictly necessary technical tokens to maintain session integrity, user preferences (such as theme and navigation states), and ensure reliable form submissions.</p>
        <H>2. Performance &amp; Analytics</H>
        <p>We use privacy-friendly analytics (such as Google Analytics 4 and Microsoft Clarity) with IP anonymization to evaluate aggregate website traffic, optimize page speed, and enhance navigation usability.</p>
      </>
    );
  return (
    <>
      <p>NovaCraft Studio maintains rigorous security and non-disclosure standards for enterprise clients.</p>
      <H>1. Non-Disclosure Agreements (NDA)</H>
      <p>We sign mutual NDAs before reviewing proprietary repositories, internal datasets, or business logic. All internal team members are bound by confidentiality clauses.</p>
      <H>2. Code &amp; Secret Management</H>
      <p>We never commit client secrets, API keys, or production database credentials to public repositories. Environment variables are managed securely via Doppler, AWS Secrets Manager, or encrypted vaults.</p>
      <H>3. Repository Security</H>
      <p>Code is developed within private client repositories or transferred immediately upon milestone completion. Automated security linters and dependency vulnerability scans are run continuously in our CI/CD workflows.</p>
    </>
  );
}

export function LegalModal({ active, onClose }: { active: LegalKey | null; onClose: () => void }) {
  useEffect(() => {
    if (!active) return;
    getLenis()?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      getLenis()?.start();
    };
  }, [active, onClose]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={TITLES[active]}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass relative w-full max-w-2xl space-y-5 rounded-xl bg-ink-800/95 p-6 text-white shadow-2xl md:p-8"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon/20 bg-neon/10 text-neon">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white">{TITLES[active]}</h3>
                  <p className="text-[11px] text-white/40">NovaCraft Studio • Last updated November 2026</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close dialog">
                <X size={18} />
              </button>
            </div>
            <div data-lenis-prevent className="max-h-[55vh] space-y-4 overflow-y-auto pr-2 text-[13px] leading-relaxed text-white/70">
              <Body k={active} />
            </div>
            <div className="flex justify-end border-t border-white/10 pt-4">
              <button type="button" onClick={onClose} className="btn btn-ghost !px-5 !py-2 !text-xs">
                Understood &amp; Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

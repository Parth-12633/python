import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';
import ReactGA from 'react-ga4';
import { ArrowRight, CalendarDays, Clock, Loader2, MessageCircle, ShieldCheck } from 'lucide-react';
import { CALENDLY_URL, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, whatsappLink } from '../../config';
import { Magnetic } from '../ui/Magnetic';
import { Reveal } from '../ui/Reveal';
import { ParallaxWord } from '../ui/ParallaxWord';
import { SectionHeader } from '../ui/SectionHeader';

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
};

function Field({ label, name, type = 'text', required, textarea }: FieldProps) {
  const base =
    'peer w-full rounded-lg border border-white/20 bg-transparent px-4 pb-2.5 pt-6 text-[15px] text-white outline-none transition-all duration-300 placeholder-transparent hover:border-white/20 focus:border-neon focus:bg-white/[0.04]';
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={name} name={name} required={required} placeholder=" " className={`${base} min-h-36 resize-y`} />
      ) : (
        <input id={name} name={name} type={type} required={required} placeholder=" " className={base} />
      )}
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 top-[1.05rem] origin-left text-sm text-white/45 transition-all duration-300 peer-focus:-translate-y-2.5 peer-focus:scale-[0.78] peer-focus:text-neon peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.78]"
      >
        {label}
        {required && <span className="ml-0.5 text-white/40">*</span>}
      </label>
    </div>
  );
}

const validateEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);

export function Contact() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const name = String(data.get('user_name') ?? '').trim();
    const email = String(data.get('user_email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message) {
      toast.error('Please complete all required fields.');
      return;
    }
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const replyTo = formRef.current.querySelector('input[name="reply_to"]') as HTMLInputElement | null;
    if (replyTo) replyTo.value = email;

    setSending(true);
    ReactGA.event({ category: 'Contact', action: 'Form Submitted' });

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY);
      toast.success("Message sent! We'll be in touch within 24 hours.");
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error('Something went wrong. Please try WhatsApp instead.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative isolate overflow-hidden px-6 py-28 md:px-12 md:py-36 lg:px-16">
      <ParallaxWord text="Hello" top="2%" />
      <div className="aurora-blob -left-32 top-10 -z-10 h-[32rem] w-[32rem] bg-indigo-600/30" />
      <div className="aurora-blob -right-32 bottom-0 -z-10 h-[32rem] w-[32rem] bg-cyan-500/20" style={{ animationDelay: '-9s' }} />

      <div className="mx-auto grid max-w-7xl gap-12 rounded-xl border border-white/10 bg-ink-900 p-7  md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="flex flex-col">
          <SectionHeader
            eyebrow="Contact"
            title={"Let's build something *amazing.*"}
            description="Whether you need AI automation, custom software, analytics dashboards, or enterprise products, we are ready to help bring your vision to life."
          />

          <Reveal delay={0.2} className="mt-10 space-y-4">
            {[
              { icon: Clock, title: 'Reply within 24 business hours', text: 'A senior engineer — not a sales bot — responds.' },
              { icon: ShieldCheck, title: 'NDA before we look at anything', text: 'Your ideas and codebase stay confidential.' }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-blue">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-[13px] text-white/50">{text}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ReactGA.event({ category: 'Contact', action: 'Book Call Clicked' })}
                className="btn btn-primary group"
              >
                <CalendarDays size={16} className="transition-transform duration-300 group-hover:rotate-12" />
                Book a Free Call
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ReactGA.event({ category: 'Contact', action: 'WhatsApp Clicked' })}
                className="btn btn-ghost"
              >
                <MessageCircle size={16} /> WhatsApp us
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.15} x={30} y={20}>
          <form ref={formRef} onSubmit={onSubmit} className="glass rounded-xl p-6 md:p-8" noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" name="user_name" required />
              <Field label="Email" name="user_email" type="email" required />
              <input type="hidden" name="reply_to" value="" />
              <Field label="Phone / WhatsApp" name="user_whatsapp" type="tel" />
              <Field label="Company / Organization" name="user_company" />
            </div>
            <div className="mt-4">
              <Field label="Tell us about your project" name="message" required textarea />
            </div>
            <button type="submit" disabled={sending} className="btn btn-primary group mt-6 w-full !py-4 sm:w-auto">
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-white/35">By submitting you agree to be contacted about your enquiry. No spam, ever.</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

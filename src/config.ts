export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'YOUR_SERVICE_ID';
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'YOUR_TEMPLATE_ID';
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'YOUR_PUBLIC_KEY';
export const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL ?? 'https://calendly.com/YOUR_USERNAME';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? 'YOUR_PHONE_NUMBER';
export const APP_URL = import.meta.env.VITE_APP_URL ?? 'https://yourdomain.com';
export const OG_IMAGE_URL = import.meta.env.VITE_OG_IMAGE_URL ?? `${APP_URL}/og-image.png`;

export const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

export const WHATSAPP_MESSAGE =
  'Hello NovaCraft Studio,\n\nI found your website and would like to discuss my project.\n\n• Name:\n• Company:\n• Service Required:\n• Brief Requirement:\n\nLooking forward to hearing from you.';

export const whatsappLink = (withMessage = true) =>
  `https://wa.me/${WHATSAPP_NUMBER}${withMessage ? `?text=${encodeURIComponent(WHATSAPP_MESSAGE)}` : ''}`;

export const NAV_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'Work', id: 'projects' },
  { label: 'Process', id: 'process' },
  { label: 'Stack', id: 'tech-stack' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' }
] as const;

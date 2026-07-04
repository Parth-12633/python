/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID: string;
    readonly VITE_EMAILJS_TEMPLATE_ID: string;
    readonly VITE_EMAILJS_PUBLIC_KEY: string;
    readonly VITE_GA_MEASUREMENT_ID: string;
    readonly VITE_CLARITY_ID: string;
    readonly VITE_CALENDLY_URL: string;
    readonly VITE_WHATSAPP_NUMBER: string;
    readonly VITE_APP_URL: string;
    readonly VITE_OG_IMAGE_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};

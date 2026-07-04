import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import App from './App';
import './index.css';

// Inject Clarity (Microsoft) script at runtime if configured
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID ?? '';
if (typeof window !== 'undefined' && CLARITY_ID && CLARITY_ID !== 'YOUR_CLARITY_ID') {
  try {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.appendChild(s);
  } catch (e) {
    // don't block app if clarity fails
    // console.warn('Clarity injection failed', e);
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? 'G-XXXXXXXXXX';
ReactGA.initialize(GA_MEASUREMENT_ID); // Replace with your GA4 Measurement ID from analytics.google.com
ReactGA.send({ hitType: 'pageview', page: window.location.pathname });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);

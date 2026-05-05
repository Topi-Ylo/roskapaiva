declare global {
  interface Window {
    dataLayer?: unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
let loaded = false;

/** Inject the GA4 gtag.js script only after the user has accepted analytics. */
export function loadAnalytics() {
  if (loaded || !GA_ID || typeof window === 'undefined') return;
  loaded = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  // anonymize IPs by default; consent already obtained
  window.gtag('config', GA_ID, { anonymize_ip: true, send_page_view: true });
}

/** Track a SPA page view. Call this on route changes. */
export function trackPageView(path: string, title?: string) {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  });
}

export const ANALYTICS_ENABLED = Boolean(GA_ID);

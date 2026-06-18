import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import KansalaisaloitePage from './pages/KansalaisaloitePage';
import PalvelutPage from './pages/PalvelutPage';
import MediaPage from './pages/MediaPage';
import CookieConsent from './components/CookieConsent';
import PreviewBanner from './components/PreviewBanner';
import { AuthProvider } from './lib/auth';
import { ConsentProvider, useConsent } from './lib/consent';
import { PreviewProvider } from './lib/preview';
import { loadAnalytics, trackPageView } from './lib/analytics';

import RequireAdmin from './components/admin/RequireAdmin';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AnalyticsAdmin from './pages/admin/AnalyticsAdmin';
import PastEventsAdmin from './pages/admin/PastEventsAdmin';
import TimelineAdmin from './pages/admin/TimelineAdmin';
import SocialMediaAdmin from './pages/admin/SocialMediaAdmin';
import MediaPostsAdmin from './pages/admin/MediaPostsAdmin';
import PressImagesAdmin from './pages/admin/PressImagesAdmin';
import PartnersAdmin from './pages/admin/PartnersAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import ImageLibraryAdmin from './pages/admin/ImageLibraryAdmin';
import ActivityAdmin from './pages/admin/ActivityAdmin';
import BackupAdmin from './pages/admin/BackupAdmin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function RevealObserver() {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    // Track which elements we have already observed so the mutation pass
    // below doesn't re-observe them on every DOM tick.
    const seen = new WeakSet<Element>();
    const observeAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        observer.observe(el);
      });
    };

    const rafId = window.requestAnimationFrame(observeAll);

    // Sections that load their content from Supabase (Services, MediaLibrary,
    // Media, MediaKortti, etc.) mount their `.reveal` cards AFTER the initial
    // raf scan. Without this MutationObserver those cards never get observed,
    // never get the `is-visible` class, and stay at opacity: 0 forever — so
    // images load over the network but nothing appears on screen.
    const mutationObserver = new MutationObserver(() => observeAll());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);
  return null;
}

/** Loads GA4 once consent is granted, and tracks page views on route changes. */
function AnalyticsTracker() {
  const { consent } = useConsent();
  const { pathname } = useLocation();

  useEffect(() => {
    if (consent === 'granted') loadAnalytics();
  }, [consent]);

  useEffect(() => {
    if (consent === 'granted') trackPageView(pathname);
  }, [consent, pathname]);

  return null;
}

function PublicShell() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/5-9-2026" element={<EventPage />} />
        <Route path="/kansalaisaloite" element={<KansalaisaloitePage />} />
        <Route path="/palvelut" element={<PalvelutPage />} />
        <Route path="/medialle" element={<MediaPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <div className="bg-forest-night">
      <ConsentProvider>
        <AuthProvider>
          <PreviewProvider>
          <BrowserRouter>
            <ScrollToTop />
            <RevealObserver />
            <AnalyticsTracker />
            <Routes>
              {/* Admin routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AnalyticsAdmin />} />
                <Route path="past-events" element={<PastEventsAdmin />} />
                <Route path="timeline" element={<TimelineAdmin />} />
                <Route path="social-media" element={<SocialMediaAdmin />} />
                <Route path="media-posts" element={<MediaPostsAdmin />} />
                <Route path="press-images" element={<PressImagesAdmin />} />
                <Route path="partners" element={<PartnersAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="library" element={<ImageLibraryAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="activity" element={<ActivityAdmin />} />
                <Route path="backup" element={<BackupAdmin />} />
              </Route>

              {/* Public site (catch-all) */}
              <Route path="*" element={<PublicShell />} />
            </Routes>
            <CookieConsent />
            <PreviewBanner />
          </BrowserRouter>
          </PreviewProvider>
        </AuthProvider>
      </ConsentProvider>
    </div>
  );
}

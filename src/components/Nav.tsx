import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHeroProgress } from '../hooks/useHeroProgress';
import { useHeroRevealed } from '../hooks/useHeroReveal';

interface NavLink {
  to: string;
  label: string;
}

const links: NavLink[] = [
  { to: '/', label: 'Tarina' },
  { to: '/5-9-2026', label: "Roskapäivä '26" },
  { to: '/palvelut', label: 'Palvelut' },
  { to: '/medialle', label: 'Medialle' },
];

export default function Nav() {
  const progress = useHeroProgress();
  const revealed = useHeroRevealed();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  // On the home page the hero plays its video once and flips `revealed` to
  // true at 3.5 s of playback (set by Hero) — same trigger on desktop and
  // mobile now. Off-home: nav is always visible.
  const reveal = isHome ? (revealed ? 1 : 0) : 1;

  // Use the opaque "scrolled" background once visible (always, off-home, and
  // also while the mobile drawer is open so the nav reads cleanly on top).
  const scrolled = !isHome || reveal > 0.01 || progress >= 1 || menuOpen;

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (menuOpen) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [menuOpen]);

  // Escape closes drawer
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);

  return (
    <>
      <nav
        id="top-nav"
        className={`nav-blur fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}
        style={{
          transform: `translate3d(0, ${(reveal - 1) * 100}%, 0)`,
          opacity: reveal,
          transition: isHome
            ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'none',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://i.imgur.com/ORj8kKe.png"
              alt="Roskapäivä"
              className="h-10 w-auto"
            />
            <span className="font-display text-xl tracking-wider text-cream">Roskapäivä</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-10 md:flex">
            {links.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition ${
                    active ? 'text-cream' : 'text-cream/70 hover:text-cream'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/kansalaisaloite"
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                isActive('/kansalaisaloite')
                  ? 'bg-amber text-forest-night hover:bg-amber-light'
                  : 'ghost-cta text-cream'
              }`}
            >
              Kansalaisaloite
            </Link>
          </div>

          {/* Mobile hamburger — 44x44 hit target, swaps to X when open */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-cream md:hidden"
            aria-label={menuOpen ? 'Sulje menu' : 'Avaa menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer — sits below the nav so the nav's hamburger stays tappable */}
      <div
        id="mobile-drawer"
        className={`fixed inset-0 z-[45] flex flex-col bg-forest-night/97 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col gap-3 px-6 pt-28 pb-12">
          {links.map((link, i) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`font-display py-2 text-3xl transition ${
                  active ? 'text-amber' : 'text-cream/90 hover:text-cream'
                }`}
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateX(0)' : 'translateX(-12px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  transitionDelay: menuOpen ? `${0.1 + i * 0.06}s` : '0s',
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/kansalaisaloite"
            onClick={() => setMenuOpen(false)}
            className={`mt-8 inline-flex items-center justify-center self-start rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-widest transition ${
              isActive('/kansalaisaloite')
                ? 'bg-amber text-forest-night'
                : 'ghost-cta text-cream'
            }`}
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              transitionDelay: menuOpen ? `${0.1 + links.length * 0.06}s` : '0s',
            }}
          >
            Kansalaisaloite
          </Link>
        </div>

        <div className="mt-auto px-6 pb-8 text-xs text-cream/40">
          <p className="font-quote italic">Tehty Helsingissä.</p>
        </div>
      </div>
    </>
  );
}

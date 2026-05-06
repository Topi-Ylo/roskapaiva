import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { usePreview } from '../../lib/preview';

interface NavItem {
  to: string;
  label: string;
  badge?: string;
}

const NAV: NavItem[] = [
  { to: '/admin', label: 'Yleisnäkymä' },
  { to: '/admin/analytics', label: 'Analytiikka' },
  { to: '/admin/past-events', label: 'Edelliset tapahtumat' },
  { to: '/admin/timeline', label: 'Aikajana' },
  { to: '/admin/social-media', label: 'Some-yhteistyöt' },
  { to: '/admin/media-posts', label: 'Mediassa' },
  { to: '/admin/press-images', label: 'Lehdistökuvat' },
  { to: '/admin/partners', label: 'Kumppanit' },
  { to: '/admin/services', label: 'Palvelut' },
  { to: '/admin/library', label: 'Kuvakirjasto' },
  { to: '/admin/settings', label: 'Sivuston asetukset' },
  { to: '/admin/users', label: 'Käyttäjät' },
  { to: '/admin/activity', label: 'Loki' },
  { to: '/admin/backup', label: 'Varmuuskopio' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { enabled: previewOn, toggle: togglePreview } = usePreview();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-forest-night text-cream">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col self-start border-r border-cream/10 bg-forest-deep md:flex">
        <Link to="/admin" className="flex items-center gap-3 border-b border-cream/10 px-6 py-5">
          <img src="https://i.imgur.com/ORj8kKe.png" alt="" className="h-8 w-auto" />
          <span className="font-display text-lg tracking-wider">Admin</span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = item.to === '/admin' ? pathname === '/admin' : pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                  active ? 'bg-amber/10 text-cream' : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-medium uppercase tracking-wider text-cream/40">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-cream/10 px-6 py-4 text-xs text-cream/55">
          <button
            type="button"
            onClick={togglePreview}
            className={`mb-3 flex w-full items-center justify-between rounded border px-3 py-2 text-[11px] uppercase tracking-widest transition ${
              previewOn ? 'border-amber/50 bg-amber/10 text-amber' : 'border-cream/15 text-cream/60 hover:border-amber/40 hover:text-cream'
            }`}
          >
            <span>Esikatselutila</span>
            <span>{previewOn ? 'PÄÄLLÄ' : 'POIS'}</span>
          </button>
          <p className="truncate">{user?.email}</p>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-2 text-cream/70 underline-offset-2 transition hover:text-amber hover:underline"
          >
            Kirjaudu ulos
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-cream/10 bg-forest-deep px-4 py-3 md:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="https://i.imgur.com/ORj8kKe.png" alt="" className="h-7 w-auto" />
          <span className="font-display text-sm tracking-wider">Admin</span>
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="text-xs uppercase tracking-widest text-cream/60"
        >
          Kirjaudu ulos
        </button>
      </div>

      <main className="flex-1 px-4 pb-12 pt-20 md:px-10 md:pt-10">
        <Outlet />
      </main>
    </div>
  );
}

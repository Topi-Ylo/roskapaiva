import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth, SUPABASE_CONFIGURED } from '../../lib/auth';

export default function LoginPage() {
  const { user, isAdmin, loading, signIn, resetPassword } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  if (!loading && user && isAdmin) {
    const dest = (location.state as { from?: string } | null)?.from ?? '/admin';
    return <Navigate to={dest} replace />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    if (resetMode) {
      const { error } = await resetPassword(email);
      setSubmitting(false);
      if (error) setError(error);
      else setInfo('Salasanan vaihtolinkki lähetetty sähköpostiisi.');
      return;
    }

    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setError(error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-night px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex items-center gap-3">
          <img src="https://i.imgur.com/ORj8kKe.png" alt="Roskapäivä" className="h-10 w-auto" />
          <span className="font-display text-xl tracking-wider text-cream">Roskapäivä Admin</span>
        </Link>

        {!SUPABASE_CONFIGURED ? (
          <div className="rounded-lg border border-amber/40 bg-amber/5 p-6 text-sm leading-relaxed text-cream/85">
            <p className="font-display text-base text-amber">Supabase ei ole vielä konfiguroitu</p>
            <p className="mt-3">
              Liitä Supabase-projekti bolt.new:n integraation kautta ja varmista että ympäristömuuttujat
              <code className="mx-1 text-cream">VITE_SUPABASE_URL</code> ja
              <code className="mx-1 text-cream">VITE_SUPABASE_ANON_KEY</code>
              ovat asetettu. Katso lisätiedot tiedostosta <code className="text-cream">.env.example</code>.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-cream/10 bg-forest-deep p-8">
            <h1 className="font-display text-3xl text-cream">
              {resetMode ? 'Vaihda salasana' : 'Kirjaudu sisään'}
            </h1>
            <p className="text-sm text-cream/65">
              {resetMode
                ? 'Anna sähköpostiosoitteesi niin lähetämme vaihtolinkin.'
                : 'Vain hyväksytyt ylläpitäjät voivat kirjautua sisään.'}
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-cream/60">
                Sähköposti
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-cream/15 bg-forest-night px-4 py-3 text-cream placeholder:text-cream/40 focus:border-amber focus:outline-none"
                placeholder="eino@roskapaiva.com"
              />
            </div>

            {!resetMode && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-cream/60">
                  Salasana
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-md border border-cream/15 bg-forest-night px-4 py-3 text-cream placeholder:text-cream/40 focus:border-amber focus:outline-none"
                />
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
            {info && <p className="text-sm text-amber-light">{info}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-amber px-6 py-3 text-xs font-semibold uppercase tracking-widest text-forest-night transition hover:bg-amber-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Hetki…' : resetMode ? 'Lähetä linkki' : 'Kirjaudu'}
            </button>

            <div className="flex items-center justify-between text-xs text-cream/55">
              <button
                type="button"
                onClick={() => {
                  setResetMode((v) => !v);
                  setError(null);
                  setInfo(null);
                }}
                className="transition hover:text-cream"
              >
                {resetMode ? '← Takaisin' : 'Unohtuiko salasana?'}
              </button>
              <Link to="/" className="transition hover:text-cream">
                Etusivulle
              </Link>
            </div>

            {!isAdmin && user && (
              <p className="rounded-md border border-amber/30 bg-amber/5 p-3 text-xs text-cream/75">
                Olet kirjautunut sisään mutta tilisi ei ole ylläpitäjä. Pyydä toista ylläpitäjää
                lisäämään sinut admins-tauluun.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

import { useSiteSettings } from '../hooks/useSiteSettings';
export default function ContactSection() {
  const settings = useSiteSettings();
  return (
    <section id="yhteys" className="relative bg-forest-night py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal text-center">
          <p className="eyebrow text-amber">Yhteydenotto</p>
          <h3 className="font-display mt-4 text-4xl text-cream md:text-5xl">
            Saat minuun parhaiten yhteyden<br />sähköpostitse tai Instagramin viestillä.
          </h3>
          <div className="mt-10 flex flex-col items-center justify-center gap-x-10 gap-y-3 md:flex-row">
            <a href={`mailto:${settings.contact_email ?? 'eino@roskapaiva.com'}`} className="font-display text-2xl text-amber transition hover:text-amber-light md:text-3xl">{settings.contact_email ?? 'eino@roskapaiva.com'}</a>
            <span className="hidden text-cream/30 md:inline">·</span>
            <a href={`tel:${(settings.contact_phone ?? '+358 45 673 2109').replace(/\s/g, '')}`} className="font-display text-2xl text-amber transition hover:text-amber-light md:text-3xl">{settings.contact_phone ?? '+358 45 673 2109'}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

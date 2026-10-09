import { useLanguage } from './Language';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';

function Preview({ id, active }: { id: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (active) void ref.current?.play().catch(() => { /* The poster remains visible when autoplay is unavailable. */ });
    else ref.current?.pause();
  }, [active]);
  return <video ref={ref} src={`/media/${id}-preview.mp4`} poster={`/media/${id}.webp`} muted loop playsInline preload="none" aria-hidden="true" />;
}

export default function Hero({ modalOpen, onWatch }: { modalOpen: boolean; onWatch: () => void }) {
  const { t } = useLanguage();
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !('connection' in navigator && (navigator.connection as { saveData?: boolean }).saveData));
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(section.current!);
    const query = window.matchMedia('(max-width: 700px)');
    const resize = () => setMobile(query.matches);
    query.addEventListener('change', resize);
    return () => { observer.disconnect(); query.removeEventListener('change', resize); };
  }, []);
  const active = motion && visible && !modalOpen;

  return (
    <section className="hero" ref={section} aria-labelledby="hero-title">
      <div className="hero-topline"><p>{t("Video editor & motion designer")}</p><p>{t("Almaty, Kazakhstan")} <span className="location-dot" /></p></div>
      <div className="hero-composition">
        <div className="hero-copy">
          <h1 id="hero-title" data-reveal>{t("Good footage.")}<br /><span>{t("Great stories.")}</span></h1>
          <p className="hero-description" data-reveal data-reveal-delay="80">{t("I turn raw footage into stories that move.")}<br />{t("Editing, rhythm and motion — frame by frame.")}</p>
          <div className="hero-actions"><button className="primary-button" onClick={onWatch}><Play size={15} fill="currentColor" /> {t("Watch a film")}</button><a href="#work" className="text-link">{t("Explore my work")} <ArrowUpRight size={17} /></a></div>
        </div>
        <div className="hero-films">
          <div className="film-frame frame-left"><img src="/media/rasul-6.webp" alt={t("An expert reel edited for Rasul Abdulla")} fetchPriority="high" /><span>{t("Storytelling")}</span></div>
          <button className="film-frame frame-main" onClick={onWatch} aria-label={t("Watch 971 MMA & Fitness Academy project")}><Preview id="academy" active={active} /><span className="frame-play"><Play size={23} fill="currentColor" /></span><span className="frame-caption">971 MMA & Fitness Academy</span></button>
          <div className="film-frame frame-right">{mobile ? <img src="/media/optics.webp" alt={t("BG Optics motion graphics")} /> : <Preview id="optics" active={active} />}<span>{t("Motion design")}</span></div>
          <span className="cut-sticker" aria-hidden="true">{t("A little")}<br />{t("motion.")}<svg viewBox="0 0 120 60"><path d="M5 10C45 5 35 54 96 33M78 24l20 10-16 13" fill="none" stroke="currentColor" strokeWidth="3" /></svg></span>
        </div>
      </div>
      <div className="hero-bottomline"><a href="#work"><ArrowDown size={16} /> {t("Scroll to selected work")}</a><button className="motion-toggle" onClick={() => setMotion(!motion)}>{motion ? <Pause size={13} /> : <Play size={13} />} {t(motion ? 'Pause previews' : 'Play previews')}</button><span>{t("4+ years of commercial experience")}</span></div>
      <div className="hero-signature" data-reveal><img src="/brand/islam-dubaev-signature.svg" alt={t("Islam Dubaev")} width="995" height="86" /></div>
      {/* Previous wordmark, retained at the user's request for a quick visual rollback:
      <div className="hero-wordmark" aria-label={t("Islam Dubaev")}>ISLAM DUBAEV<span className="cut-mark" aria-hidden="true" /></div>
      */}
    </section>
  );
}


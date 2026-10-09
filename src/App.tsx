import { useLanguage, LanguageToggle } from './Language';
import { lazy, Suspense, useState } from 'react';
import { ArrowDown, ArrowUpRight, Download, Menu, MessageCircle, Phone, X } from 'lucide-react';
import Hero from './Hero';
import WorkGallery from './WorkGallery';
import BeforeAfter from './BeforeAfter';
import useScrollReveal from './useScrollReveal';
import { projects, type Project } from './projects';

const ProjectDialog = lazy(() => import('./ProjectDialog'));
const capabilities = [
  { title: 'Video editing', detail: 'From selecting the footage to finding the story. Dynamic cuts, thoughtful pacing and a finish ready for the platform.', tags: 'Reels · TikTok · Shorts · Podcasts' },
  { title: 'Motion design', detail: 'Text, graphics and animation that become part of the story. From brand identities to LED-screen visuals.', tags: 'Typography · Brand animation · Motion graphics' },
  { title: 'The finishing touch', detail: 'Colour correction, sound design and platform-ready delivery. Working confidently with footage of different quality.', tags: 'Colour · Sound · Social delivery' },
];

export default function App() {
  const { t, language } = useLanguage();
  const main = useScrollReveal();
  const [selection, setSelection] = useState<{ project: Project; compare: boolean } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openProject = (project: Project, compare = false) => setSelection({ project, compare });

  return (
    <>
      <a className="skip-link" href="#work">{t("Skip to selected work")}</a>
      <header id="top" className="site-header">
        <a className="brand" href="#top" aria-label={t("Islam Dubaev home")}><span className="brand-symbol" aria-hidden="true" /><span className="sr-only">{t("Islam Dubaev")}</span></a>
        <nav id="main-navigation" className={menuOpen ? 'main-navigation is-open' : 'main-navigation'} aria-label={t("Main navigation")} onClick={() => setMenuOpen(false)}>
          <a href="#work">{t("Work")} <span>{projects.length}</span></a><a href="#before-after">{t("Before & after")}</a><a href="#about">{t("About")}</a><a className="header-contact" href="#contact">{t("Let’s talk")} <ArrowUpRight size={15} /></a>
        </nav>
        <div className="header-controls"><LanguageToggle /><button className="mobile-menu-toggle icon-button" aria-label={t(menuOpen ? 'Close menu' : 'Open menu')} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>
      <main ref={main}>
        <Hero modalOpen={selection !== null} onWatch={() => openProject(projects.find(p => p.id === 'academy')!)} />
        <div className="client-strip"><p>{t("Editing work for")}</p><div><span>TFF Global Investment</span><span>971 MMA & Fitness</span><span>Tooba Help Easy</span><span>The Base</span><span>Rasul Abdulla</span></div></div>
        <WorkGallery onOpen={openProject} />
        <BeforeAfter onOpen={openProject} />
        <section id="about" className="about-section section-padding" aria-labelledby="about-title">
          <div className="about-feature"><figure className="about-portrait" data-reveal><img src="/me.webp" alt={t("Islam Dubaev in the mountains near Almaty")} width="1100" height="1467" loading="lazy" /><figcaption><span>{t("Islam Dubaev")}</span><span>{t("Almaty, Kazakhstan")}</span></figcaption></figure><div className="about-heading"><p className="section-kicker" data-reveal>{t("Behind the timeline")}</p><h2 id="about-title" data-reveal data-reveal-delay="60">{t("Hi, I’m Islam.")}<br /><span>{t("I think in frames.")}</span></h2><div className="about-intro"><p data-reveal data-reveal-delay="120">{t("I’m a video editor and motion designer based in Almaty, Kazakhstan, with ")}<strong>{t("4+ years of commercial experience.")}</strong></p><p data-reveal data-reveal-delay="120">{t("I create dynamic short-form content, expert videos, advertising and content for personal brands. From raw footage to the final export, I bring the story together.")}</p><a className="cv-link" href={language === 'ru' ? '/cv-ru.html' : '/cv.html'} target="_blank" rel="noreferrer">{t("View my CV")} <Download size={17} /></a></div></div></div>
          <div className="capabilities">{capabilities.map((item, index) => <article key={item.title} data-reveal data-reveal-delay={index * 60}><h3>{t(item.title)}</h3><p>{t(item.detail)}</p><span>{t(item.tags)}</span></article>)}</div>
          <div className="about-details"><div><h3>{t("My toolkit")}</h3><ul className="software-list"><li><img className="software-icon" src="/icons/premiere-pro.svg" alt="" width="40" height="40" loading="lazy" /><div>Adobe Premiere Pro<small>{t("Professional video editing")}</small></div></li><li><img className="software-icon" src="/icons/after-effects.svg" alt="" width="40" height="40" loading="lazy" /><div>Adobe After Effects<small>{t("Motion, animation & visual effects")}</small></div></li><li><img className="software-icon" src="/icons/photoshop.svg" alt="" width="40" height="40" loading="lazy" /><div>Adobe Photoshop<small>{t("Graphics & asset preparation")}</small></div></li></ul><p className="ai-note">{t("I also use AI tools to improve quality and speed up production.")}</p></div><div><h3>{t("Stories in all shapes")}</h3><p>{t("Personal brands and entrepreneurs. Construction and manufacturing. Cosmetics, fashion, bathhouses and interiors. Bloggers, experts and SMM campaigns.")}</p><div className="format-tags">{['Expert reels', 'Talking-head', 'Podcasts', 'Product films', 'Reviews', 'Advertising', 'Social content', 'Promotional films'].map(item => <span key={item}>{t(item)}</span>)}</div></div></div>
        </section>
        <section id="contact" className="contact-section section-padding" aria-labelledby="contact-title">
          <div className="contact-top"><p data-reveal>{t("Have footage. Have an idea.")}<br />{t("Let’s give it a story.")}</p><span>{t("Almaty, Kazakhstan")}</span></div>
          <a className="contact-title" href="https://t.me/Issslam95" target="_blank" rel="noreferrer"><h2 id="contact-title" data-reveal data-reveal-delay="80">{t("Let’s make")}<br /><span>{t("the cut.")}</span></h2><ArrowUpRight className="contact-arrow" /></a>
          <div className="contact-links"><a href="https://t.me/Issslam95" target="_blank" rel="noreferrer"><MessageCircle size={19} /><span>{t("Telegram")}<small>@Issslam95</small></span><ArrowUpRight size={20} /></a><a href="tel:+77770181895"><Phone size={19} /><span>{t("Phone")}<small>+7 777 018 18 95</small></span><ArrowUpRight size={20} /></a><a href="https://t.me/IslamDubaev" target="_blank" rel="noreferrer"><PlayPortfolioIcon /><span>{t("More work")}<small>{t("Telegram portfolio")}</small></span><ArrowUpRight size={20} /></a></div>
        </section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} {t('Islam Dubaev')}</span><span>{t("Video editing & motion design")}</span><a href="#top">{t("Back to top")} <ArrowDown size={13} /></a></footer>
      {selection && <Suspense fallback={<div className="modal-loading" role="status">{t("Opening film…")}</div>}><ProjectDialog key={selection.project.id} project={selection.project} compare={selection.compare} onClose={() => setSelection(null)} /></Suspense>}
    </>
  );
}

function PlayPortfolioIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m10 8 6 4-6 4Z" /></svg>;
}


import { lazy, Suspense, useState } from 'react';
import { ArrowDown, ArrowUpRight, Download, Menu, MessageCircle, Phone, X } from 'lucide-react';
import Hero from './Hero';
import WorkGallery from './WorkGallery';
import BeforeAfter from './BeforeAfter';
import { projects, type Project } from './projects';

const ProjectDialog = lazy(() => import('./ProjectDialog'));
const capabilities = [
  { title: 'Video editing', detail: 'From selecting the footage to finding the story. Dynamic cuts, thoughtful pacing and a finish ready for the platform.', tags: 'Reels · TikTok · Shorts · Podcasts' },
  { title: 'Motion design', detail: 'Text, graphics and animation that become part of the story. From brand identities to LED-screen visuals.', tags: 'Typography · Brand animation · Motion graphics' },
  { title: 'The finishing touch', detail: 'Colour correction, sound design and platform-ready delivery. Working confidently with footage of different quality.', tags: 'Colour · Sound · Social delivery' },
];

export default function App() {
  const [selection, setSelection] = useState<{ project: Project; compare: boolean } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openProject = (project: Project, compare = false) => setSelection({ project, compare });

  return (
    <>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <header id="top" className="site-header">
        <a className="brand" href="#top" aria-label="Islam Dubaev home"><span className="brand-symbol" aria-hidden="true" /><span>Islam<br />Dubaev</span></a>
        <button className="mobile-menu-toggle icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav id="main-navigation" className={menuOpen ? 'main-navigation is-open' : 'main-navigation'} aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
          <a href="#work">Work <span>{projects.length}</span></a><a href="#before-after">Before & after</a><a href="#about">About</a><a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
        </nav>
      </header>
      <main>
        <Hero modalOpen={selection !== null} onWatch={() => openProject(projects.find(p => p.id === 'academy')!)} />
        <div className="client-strip"><p>Editing work for</p><div><span>TFF Global Investment</span><span>971 MMA & Fitness</span><span>Tooba Help Easy</span><span>The Base</span><span>Rasul Abdulla</span></div></div>
        <WorkGallery onOpen={openProject} />
        <BeforeAfter onOpen={openProject} />
        <section id="about" className="about-section section-padding" aria-labelledby="about-title">
          <div className="about-heading"><p className="section-kicker">Behind the timeline</p><h2 id="about-title">Hi, I’m Islam.<br /><span>I think in frames.</span></h2><div className="about-intro"><p>I’m a video editor and motion designer based in Almaty, Kazakhstan, with <strong>4+ years of commercial experience.</strong></p><p>I create dynamic short-form content, expert videos, advertising and content for personal brands. From raw footage to the final export, I bring the story together.</p><a className="cv-link" href="/cv.html" target="_blank" rel="noreferrer">View my CV <Download size={17} /></a></div></div>
          <div className="capabilities">{capabilities.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.detail}</p><span>{item.tags}</span></article>)}</div>
          <div className="about-details"><div><h3>My toolkit</h3><ul className="software-list"><li><img className="software-icon" src="/icons/premiere-pro.svg" alt="" width="40" height="40" loading="lazy" /><div>Adobe Premiere Pro<small>Professional video editing</small></div></li><li><img className="software-icon" src="/icons/after-effects.svg" alt="" width="40" height="40" loading="lazy" /><div>Adobe After Effects<small>Motion, animation & visual effects</small></div></li><li><img className="software-icon" src="/icons/photoshop.svg" alt="" width="40" height="40" loading="lazy" /><div>Adobe Photoshop<small>Graphics & asset preparation</small></div></li></ul><p className="ai-note">I also use AI tools to improve quality and speed up production.</p></div><div><h3>Stories in all shapes</h3><p>Personal brands and entrepreneurs. Construction and manufacturing. Cosmetics, fashion, bathhouses and interiors. Bloggers, experts and SMM campaigns.</p><div className="format-tags">{['Expert reels', 'Talking-head', 'Podcasts', 'Product films', 'Reviews', 'Advertising', 'Social content', 'Promotional films'].map(item => <span key={item}>{item}</span>)}</div></div></div>
        </section>
        <section id="contact" className="contact-section section-padding" aria-labelledby="contact-title">
          <div className="contact-top"><p>Have footage. Have an idea.<br />Let’s give it a story.</p><span>Almaty, Kazakhstan</span></div>
          <a className="contact-title" href="https://t.me/Issslam95" target="_blank" rel="noreferrer"><h2 id="contact-title">Let’s make<br /><span>the cut.</span></h2><ArrowUpRight className="contact-arrow" /></a>
          <div className="contact-links"><a href="https://t.me/Issslam95" target="_blank" rel="noreferrer"><MessageCircle size={19} /><span>Telegram<small>@Issslam95</small></span><ArrowUpRight size={20} /></a><a href="tel:+77770181895"><Phone size={19} /><span>Phone<small>+7 777 018 18 95</small></span><ArrowUpRight size={20} /></a><a href="https://t.me/IslamDubaev" target="_blank" rel="noreferrer"><PlayPortfolioIcon /><span>More work<small>Telegram portfolio</small></span><ArrowUpRight size={20} /></a></div>
        </section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Islam Dubaev</span><span>Video editing & motion design</span><a href="#top">Back to top <ArrowDown size={13} /></a></footer>
      {selection && <Suspense fallback={<div className="modal-loading" role="status">Opening film…</div>}><ProjectDialog key={selection.project.id} project={selection.project} compare={selection.compare} onClose={() => setSelection(null)} /></Suspense>}
    </>
  );
}

function PlayPortfolioIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m10 8 6 4-6 4Z" /></svg>;
}


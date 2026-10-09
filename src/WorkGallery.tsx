import { useLanguage } from './Language';
import { useState } from 'react';
import { ArrowUpRight, Play, SlidersHorizontal } from 'lucide-react';
import { projects, formatTime, type Category, type Project } from './projects';
import SelectMenu from './SelectMenu';

const categories: { value: 'all' | Category; label: string }[] = [
  { value: 'all', label: 'All work' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'expert', label: 'Expert reels' },
  { value: 'motion', label: 'Motion design' },
  { value: 'creative', label: 'Creative edits' },
];
const clients = [...new Set(projects.flatMap(p => p.client ? [p.client] : []))];
const clientOptions = [
  { value: 'all', label: 'All clients', detail: String(projects.length) },
  ...clients.map(name => ({ value: name, label: name, detail: String(projects.filter(project => project.client === name).length) })),
];

export default function WorkGallery({ onOpen }: { onOpen: (project: Project, compare?: boolean) => void }) {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState<'all' | Category>('all');
  const [client, setClient] = useState('all');
  const filtered = projects.filter(p => (category === 'all' || p.category === category) && (client === 'all' || p.client === client));

  return (
    <section id="work" className="work-section section-padding" aria-labelledby="work-title">
      <div className="section-heading"><div><p className="section-kicker" data-reveal>{t("The portfolio")}</p><h2 id="work-title" data-reveal data-reveal-delay="60">{t("Selected ")}<span>{t("work.")}</span></h2></div><p className="section-intro" data-reveal data-reveal-delay="120">{t("Different brands. Different stories.")}<br />{t("One thing in common: every cut counts.")}</p></div>
      <div className="work-filters"><div className="category-tabs" aria-label={t("Filter work by category")}>{categories.map(item => <button key={item.value} className={category === item.value ? 'active' : ''} aria-pressed={category === item.value} onClick={() => { setCategory(item.value); setClient('all'); }}>{t(item.label)}<span>{item.value === 'all' ? projects.length : projects.filter(p => p.category === item.value).length}</span></button>)}</div>
        <div className="client-filter"><SlidersHorizontal size={14} aria-hidden="true" /><SelectMenu label={t("Filter by client")} value={client} options={clientOptions.map(option => ({ ...option, label: t(option.label) }))} onChange={value => { setClient(value); setCategory('all'); }} /></div>
      </div>
      <p className="sr-only" role="status">{language === 'ru' ? `Показано работ: ${filtered.length}` : `Showing ${filtered.length} projects`}</p>
      <div className="project-grid">
        {filtered.map(project => <article className={`project-card ${project.width > project.height ? 'landscape-card' : ''}`} key={project.id}>
          <button className="project-image" onClick={() => onOpen(project)} aria-label={`${language === 'ru' ? 'Смотреть' : 'Watch'} ${t(project.title)}`}>
            <img src={project.poster} alt={`${t(project.title)} — ${t(project.format)}`} loading="lazy" width={project.width} height={project.height} />
            <span className="duration-badge">{formatTime(project.duration)}</span>
            {project.before && <span className="compare-badge">{t("Before & after")}</span>}
            <span className="card-play"><Play size={23} fill="currentColor" /></span>
            <span className="watch-label">{t("Watch film")} <ArrowUpRight size={16} /></span>
          </button>
          <div className="project-meta"><div><h3><button onClick={() => onOpen(project)}>{t(project.title)}</button></h3><p>{t(project.format)}{project.client && ` / ${t('Video editing')}`}</p></div><button className="project-arrow" onClick={() => onOpen(project)} aria-label={`${language === 'ru' ? 'Открыть' : 'Open'} ${t(project.title)}`}><ArrowUpRight size={20} /></button></div>
        </article>)}
      </div>
      <div className="work-footer"><span>{t("Video editing / Motion design / Sound & colour")}</span><a href="https://t.me/IslamDubaev" target="_blank" rel="noreferrer">{t("More on Telegram")} <ArrowUpRight size={16} /></a></div>
    </section>
  );
}

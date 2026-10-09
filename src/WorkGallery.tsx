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
  const [category, setCategory] = useState<'all' | Category>('all');
  const [client, setClient] = useState('all');
  const filtered = projects.filter(p => (category === 'all' || p.category === category) && (client === 'all' || p.client === client));

  return (
    <section id="work" className="work-section section-padding" aria-labelledby="work-title">
      <div className="section-heading"><div><p className="section-kicker">The portfolio</p><h2 id="work-title">Selected <span>work.</span></h2></div><p className="section-intro">Different brands. Different stories.<br />One thing in common: every cut counts.</p></div>
      <div className="work-filters"><div className="category-tabs" aria-label="Filter work by category">{categories.map(item => <button key={item.value} className={category === item.value ? 'active' : ''} aria-pressed={category === item.value} onClick={() => { setCategory(item.value); setClient('all'); }}>{item.label}<span>{item.value === 'all' ? projects.length : projects.filter(p => p.category === item.value).length}</span></button>)}</div>
        <div className="client-filter"><SlidersHorizontal size={14} aria-hidden="true" /><SelectMenu label="Filter by client" value={client} options={clientOptions} onChange={value => { setClient(value); setCategory('all'); }} /></div>
      </div>
      <p className="sr-only" role="status">Showing {filtered.length} projects</p>
      <div className="project-grid">
        {filtered.map(project => <article className={`project-card ${project.width > project.height ? 'landscape-card' : ''}`} key={project.id}>
          <button className="project-image" onClick={() => onOpen(project)} aria-label={`Watch ${project.title}`}>
            <img src={project.poster} alt={`${project.title} — ${project.format}`} loading="lazy" width={project.width} height={project.height} />
            <span className="duration-badge">{formatTime(project.duration)}</span>
            {project.before && <span className="compare-badge">Before & after</span>}
            <span className="card-play"><Play size={23} fill="currentColor" /></span>
            <span className="watch-label">Watch film <ArrowUpRight size={16} /></span>
          </button>
          <div className="project-meta"><div><h3><button onClick={() => onOpen(project)}>{project.title}</button></h3><p>{project.format}{project.client && ' / Video editing'}</p></div><button className="project-arrow" onClick={() => onOpen(project)} aria-label={`Open ${project.title}`}><ArrowUpRight size={20} /></button></div>
        </article>)}
      </div>
      <div className="work-footer"><span>Video editing / Motion design / Sound & colour</span><a href="https://t.me/IslamDubaev" target="_blank" rel="noreferrer">More on Telegram <ArrowUpRight size={16} /></a></div>
    </section>
  );
}

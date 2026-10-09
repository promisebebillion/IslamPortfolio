import { useState } from 'react';
import { ArrowUpRight, MoveHorizontal, Play } from 'lucide-react';
import { projects, type Project } from './projects';

const comparisons = projects.filter(project => project.before);

export default function BeforeAfter({ onOpen }: { onOpen: (project: Project, compare: boolean) => void }) {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(50);
  const project = comparisons[index];

  return (
    <section id="before-after" className="comparison-section section-padding" aria-labelledby="comparison-title">
      <div className="comparison-copy"><p className="section-kicker" data-reveal>From footage to feeling</p><h2 id="comparison-title" data-reveal data-reveal-delay="60">Same footage.<br /><span>A different story.</span></h2><p data-reveal data-reveal-delay="120">The edit is where it all comes together. Compare the source footage with the rhythm, graphics and detail of the finished piece.</p>
        <div className="comparison-projects" aria-label="Select a before-and-after project">{comparisons.map((item, n) => <button key={item.id} aria-pressed={index === n} className={index === n ? 'active' : ''} onClick={() => { setIndex(n); setPosition(50); }}><span>{item.title}</span><ArrowUpRight size={16} /></button>)}</div>
        <button className="primary-button" onClick={() => onOpen(project, true)}><Play size={15} fill="currentColor" /> Compare the videos</button>
        <p className="comparison-help">Drag to compare stills. Open the videos for shared playback.</p>
      </div>
      <div className="comparison-visual"><div className="still-comparison">
        <img src={project.poster} alt={`${project.title}, finished edit`} />
        <img className="before-still" src={project.beforePoster} alt={`${project.title}, source footage`} style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} />
        <div className="still-labels"><span>Before</span><span>After</span></div>
        <div className="comparison-divider" style={{ left: `${position}%` }}><span><MoveHorizontal size={20} /></span></div>
        <input type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} aria-label="Before and after comparison position" />
      </div><p className="comparison-caption"><span>{project.title}</span><span>Source / Finished edit</span></p></div>
    </section>
  );
}

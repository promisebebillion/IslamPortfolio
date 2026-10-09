import { useLanguage } from './Language';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import VideoPlayer, { type PlayerMode } from './VideoPlayer';
import { type Project } from './projects';
import SelectMenu from './SelectMenu';

interface Props { project: Project; compare: boolean; onClose: () => void }
const qualityOptions = [{ value: 'lite', label: 'Light / fast loading' }, { value: 'hd', label: 'HD / original size' }];

export default function ProjectDialog({ project, compare, onClose }: Props) {
  const { t } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<PlayerMode>(compare && project.before ? 'compare' : 'edit');
  const [quality, setQuality] = useState<'lite' | 'hd'>('lite');

  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title" onCancel={onClose}
      onClick={event => { if (event.target === dialog.current) onClose(); }}>
      <div className="dialog-content">
        <header className="dialog-header">
          <div><p className="dialog-format">{t(project.format)}</p><h2 id="project-title">{t(project.title)}</h2></div>
          <button className="icon-button close-dialog" onClick={onClose} aria-label={t("Close project")}><X /></button>
        </header>
        <div className="dialog-toolbar">
          {project.before ? <div className="mode-tabs" aria-label={t("Video view")}>
            <button aria-pressed={mode === 'edit'} onClick={() => setMode('edit')}>{t("Finished edit")}</button>
            <button aria-pressed={mode === 'compare'} onClick={() => setMode('compare')}>{t("Before & after")}</button>
            <button aria-pressed={mode === 'source'} onClick={() => setMode('source')}>{t("Source footage")}</button>
          </div> : <span className="dialog-role">{t(project.category === 'motion' ? 'Motion design' : 'Video editing')}</span>}
          <div className="quality-picker"><span>{t("Quality")}</span><SelectMenu label={t("Video quality")} value={quality} options={qualityOptions.map(option => ({ ...option, label: t(option.label) }))} onChange={value => setQuality(value === 'hd' ? 'hd' : 'lite')} /></div>
        </div>
        <VideoPlayer key={`${quality}-${mode}`} project={project} quality={quality} mode={mode} />
        <footer className="dialog-footer"><p>{t(project.description)}</p>{project.profile && <a href={project.profile} target="_blank" rel="noreferrer">{t("Client profile")} <ArrowUpRight size={16} /></a>}</footer>
      </div>
    </dialog>
  );
}

import { useLanguage } from './Language';
import { useEffect, useRef, useState } from 'react';
import { Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { formatTime, type Project } from './projects';

export type PlayerMode = 'edit' | 'compare' | 'source';

interface Props {
  project: Project;
  quality: 'lite' | 'hd';
  mode: PlayerMode;
}

export default function VideoPlayer({ project, quality, mode }: Props) {
  const { t } = useLanguage();
  const video = useRef<HTMLVideoElement>(null);
  const before = useRef<HTMLVideoElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(mode === 'source' ? project.beforeInfo!.duration : project.duration);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const isSource = mode === 'source';
  const src = isSource ? (quality === 'hd' ? project.beforeHd : project.beforeSrc) : (quality === 'hd' ? project.hd : project.src);
  const beforeSrc = quality === 'hd' ? project.beforeHd : project.beforeSrc;

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === container.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  async function togglePlay() {
    const main = video.current;
    if (!main) return;
    if (!main.paused) {
      main.pause();
      before.current?.pause();
      return;
    }
    setFailed(false);
    setLoading(true);
    if (main.ended) {
      main.currentTime = 0;
      if (before.current) before.current.currentTime = 0;
    }
    try {
      await main.play();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      main.pause();
      before.current?.pause();
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function resumeBefore() {
    const main = video.current;
    const original = before.current;
    if (!main || !original || main.paused || !Number.isFinite(original.duration)) return;
    const target = Math.min(main.currentTime, Math.max(0, original.duration - 0.05));
    if (Math.abs(original.currentTime - target) > 0.3) original.currentTime = target;
    if (main.currentTime < original.duration) void original.play().catch(error => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setFailed(true);
    });
  }

  function seek(next: number) {
    if (!video.current) return;
    video.current.currentTime = next;
    setTime(next);
    if (before.current && Number.isFinite(before.current.duration)) {
      before.current.currentTime = Math.min(next, Math.max(0, before.current.duration - 0.05));
    }
  }

  function updateTime() {
    const main = video.current;
    if (!main) return;
    setTime(main.currentTime);
    const original = before.current;
    if (original && Number.isFinite(original.duration) && main.currentTime < original.duration - 0.1) {
      if (Math.abs(original.currentTime - main.currentTime) > 0.3) original.currentTime = main.currentTime;
    }
  }

  function toggleMute() {
    if (video.current) video.current.muted = !video.current.muted;
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (container.current?.requestFullscreen) await container.current.requestFullscreen();
  }

  return (
    <div ref={container} className={`video-player ${mode === 'compare' ? 'is-comparing' : ''}`} tabIndex={0}
      onKeyDown={event => {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement || event.target instanceof HTMLSelectElement) return;
        if (event.key === ' ' || event.key === 'k') { event.preventDefault(); void togglePlay(); }
        if (event.key === 'm') toggleMute();
        if (event.key === 'ArrowRight') { event.preventDefault(); seek(Math.min(duration, time + 5)); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); seek(Math.max(0, time - 5)); }
        if (event.key === 'f') void toggleFullscreen();
      }}>
      <div className="player-stage">
        {mode === 'compare' && (
          <div className="video-pane">
            <span className="pane-label">{t("Before / source footage")}</span>
            <video ref={before} src={beforeSrc} poster={project.beforePoster} muted playsInline preload="metadata"
              onError={() => setFailed(true)} onWaiting={() => setLoading(true)}
              onCanPlay={() => { setLoading(false); resumeBefore(); }} />
          </div>
        )}
        <div className="video-pane">
          {mode === 'compare' && <span className="pane-label after-label">{t("After / finished edit")}</span>}
          <video ref={video} src={src} poster={isSource ? project.beforePoster : project.poster}
            playsInline preload="metadata" onClick={() => void togglePlay()}
            onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
            onTimeUpdate={updateTime} onPlay={() => setPlaying(true)}
            onPause={() => { setPlaying(false); setLoading(false); before.current?.pause(); }}
            onEnded={() => { setPlaying(false); before.current?.pause(); }}
            onWaiting={() => { setLoading(true); before.current?.pause(); }}
            onPlaying={() => { setLoading(false); resumeBefore(); }}
            onVolumeChange={event => { setMuted(event.currentTarget.muted); setVolume(event.currentTarget.volume); }}
            onError={() => { setFailed(true); setLoading(false); }} />
        </div>
        {!playing && !failed && <button className="stage-play" onClick={() => void togglePlay()} aria-label={t("Play video")}><Play size={30} fill="currentColor" /></button>}
        {loading && !failed && <div className="loading-indicator" role="status">{t("Loading video")}<span /></div>}
        {failed && <div className="player-error" role="alert"><p>{t("This video couldn’t be played.")}</p><button onClick={() => { video.current?.load(); before.current?.load(); setFailed(false); }}>{t("Try again")}</button><a href={src}>{t("Open video directly")}</a></div>}
      </div>
      <div className="player-controls">
        <button onClick={() => void togglePlay()} aria-label={t(playing ? 'Pause video' : 'Play video')}>{playing ? <Pause size={19} /> : <Play size={19} />}</button>
        <button onClick={() => seek(0)} aria-label={t("Restart video")}><RotateCcw size={17} /></button>
        <span className="player-time">{formatTime(time)}</span>
        <input className="seek-bar" type="range" min={0} max={duration} step={0.1} value={time} aria-label={t("Video progress")} onChange={event => seek(Number(event.target.value))} style={{ background: `linear-gradient(to right, var(--accent) ${duration ? time / duration * 100 : 0}%, var(--player-track) 0)` }} />
        <span className="player-time">{formatTime(duration)}</span>
        <button onClick={toggleMute} aria-label={t(muted ? 'Unmute video' : 'Mute video')}>{muted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>
        <input className="volume-bar" type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} aria-label={t("Volume")} onChange={event => { if (video.current) { video.current.volume = Number(event.target.value); video.current.muted = false; } }} />
        <button onClick={() => void toggleFullscreen()} aria-label={t(fullscreen ? 'Exit fullscreen' : 'Enter fullscreen')}>{fullscreen ? <Minimize size={19} /> : <Maximize size={19} />}</button>
      </div>
      {mode === 'compare' && <p className="comparison-note">{t("Shared playback. Audio from the finished edit. Editing may change the timing.")}</p>}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export function FloatingPathsBackground({ position, children, className, active = true }: {
  position: number;
  className?: string;
  children: ReactNode;
  active?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [foreground, setForeground] = useState(() => !document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current!);
    const visibility = () => setForeground(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const animate = active && visible && foreground && !reducedMotion;
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return <div ref={root} className={cn('w-full relative', className)}>
    <div className="floating-paths-layer absolute inset-0 pointer-events-none" aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        {paths.map(path => <motion.path key={path.id} d={path.d} stroke="currentColor" strokeWidth={path.width}
          strokeOpacity={0.1 + path.id * 0.02} initial={false}
          animate={animate ? { pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] } : { pathLength: 0.75, opacity: 0.35, pathOffset: 0 }}
          transition={animate ? { duration: 24 + path.id % 10, repeat: Infinity, ease: 'linear' } : { duration: 0 }} />)}
      </svg>
    </div>
    {children}
  </div>;
}

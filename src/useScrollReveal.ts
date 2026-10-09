import { useEffect, useRef } from 'react';

export default function useScrollReveal() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        const animation = element.animate([
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], {
          duration: 620,
          delay: Number(element.dataset.revealDelay ?? 0),
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        });
        animations.add(animation);
        animation.addEventListener('finish', () => animations.delete(animation), { once: true });
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

    root.current!.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    const stop = () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const reduceMotion = () => { if (preference.matches) stop(); };
    preference.addEventListener('change', reduceMotion);
    return () => { stop(); preference.removeEventListener('change', reduceMotion); };
  }, []);

  return root;
}

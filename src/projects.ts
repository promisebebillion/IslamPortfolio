import media from './media.json';

export type Category = 'commercial' | 'expert' | 'motion' | 'creative';
export interface Project {
  id: string;
  title: string;
  category: Category;
  format: string;
  client?: string;
  description: string;
  profile?: string;
  width: number;
  height: number;
  duration: number;
  src: string;
  hd: string;
  poster: string;
  before?: string;
  beforeSrc?: string;
  beforeHd?: string;
  beforePoster?: string;
  beforeInfo?: { duration: number; width: number; height: number };
}

export const projects: Project[] = media.map(item => {
  if (!['commercial', 'expert', 'motion', 'creative'].includes(item.category)) {
    throw new Error(`Invalid project category for ${item.id}`);
  }
  return { ...item, category: item.category as Category };
});

export function formatTime(seconds: number) {
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

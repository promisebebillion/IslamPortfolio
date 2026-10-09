import { readFile, writeFile } from 'node:fs/promises';
import { ru } from '../src/translations.ts';

const extra = {
  'Islam Dubaev — CV': 'Ислам Дубаев — Резюме',
  'Almaty, Kazakhstan · 4+ years of commercial experience': 'Алматы, Казахстан · Более 4 лет коммерческого опыта',
  'Portfolio: t.me/IslamDubaev': 'Портфолио: t.me/IslamDubaev',
  'TFF Global Investment, 971 MMA & Fitness Academy, Tooba Help Easy, The Base, and Rasul Abdulla.': 'TFF Global Investment, 971 MMA & Fitness Academy, Tooba Help Easy, The Base и Rasul Abdulla.',
};
const source = await readFile('public/cv.html', 'utf8');
const translated = source.replace('lang="en"', 'lang="ru"').replace(/>([^<>]+)</g, (match, text) => {
  const key = text.trim();
  const result = extra[key] ?? ru[key] ?? (key.startsWith('— ') && ru[key.slice(2)] ? `— ${ru[key.slice(2)]}` : undefined);
  return result ? `>${text.match(/^\s*/)[0]}${result}${text.match(/\s*$/)[0]}<` : match;
});
await writeFile('public/cv-ru.html', translated);

import { mkdir, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

// The open D/B and separated top bar of E follow the client's supplied artwork.
const glyphs = {
  D: 'M0 0H25C45 0 54 14 54 36S45 72 25 72H0',
  U: 'M0 0V47C0 65 9 72 27 72S54 65 54 47V0',
  B: 'M0 0H29C43 0 49 6 49 18S43 36 29 36H0M29 36C47 36 54 42 54 54S47 72 29 72H0',
  A: 'M0 72L31 0L62 72M12 50H50',
  E: 'M0 0H46M0 36H39M0 36V72H46',
  V: 'M0 0L31 72L62 0',
  I: 'M0 0V72',
  S: 'M54 5C45 0 38 0 27 0C9 0 0 6 0 18C0 32 13 35 27 36S54 42 54 55C54 68 42 72 27 72C15 72 7 69 0 66',
  L: 'M0 0V72H48',
  M: 'M0 72V0L31 48L62 0V72',
};
const widths = { D:54, U:54, B:54, A:62, E:46, V:62, I:0, S:54, L:48, M:62 };
const directory = 'public/brand';
await mkdir(directory, { recursive: true });

function paths(word, x, y, gap = 28) {
  return [...word].map(letter => {
    const path = `<path d="${glyphs[letter]}" transform="translate(${x} ${y})"/>`;
    x += widths[letter] + gap;
    return path;
  }).join('');
}

function svg(content, width, height, color, stroke = 2.8) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><g fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="butt" stroke-linejoin="round">${content}</g></svg>`;
}

for (const [name, color] of [['green','#d7ff3f'], ['white','#ffffff']]) {
  const mark = svg(paths('DUB',23,28,16)+paths('AEV',23,140,12),240,240,color);
  await writeFile(`${directory}/dubaev-${name}.svg`, mark);
  await writeFile(`${directory}/dubaev-${name}.png`, new Resvg(mark,{fitTo:{mode:'width',value:1024}}).render().asPng());
  const horizontal = svg(paths('DUBAEV',4,4,54),622,80,color);
  await writeFile(`${directory}/dubaev-horizontal-${name}.svg`, horizontal);
  await writeFile(`${directory}/dubaev-horizontal-${name}.png`, new Resvg(horizontal,{fitTo:{mode:'width',value:2048}}).render().asPng());
}

const signature = svg(paths('ISLAM',4,7,35)+paths('DUBAEV',435,7,35),995,86,'#f2f2e9',2.8);
await writeFile(`${directory}/islam-dubaev-signature.svg`,signature);
const compact = svg(paths('DUB',23,28,16)+paths('AEV',23,140,12),240,240,'#d7ff3f',4.2);
await writeFile(`${directory}/dubaev-compact.svg`,compact);
const favicon = svg(paths('DUB',23,28,16)+paths('AEV',23,140,12),240,240,'#d7ff3f',7);
await writeFile('public/favicon.svg',favicon);
for (const size of [32,64,180]) {
  await writeFile(`public/favicon-${size}.png`,new Resvg(favicon,{fitTo:{mode:'width',value:size}}).render().asPng());
}
console.log('Brand SVGs, transparent PNGs and favicons generated.');

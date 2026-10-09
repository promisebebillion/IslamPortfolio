import { readFile } from 'node:fs/promises';
import convert from 'heic-convert';
import sharp from 'sharp';

const input = await readFile('public/me.HEIC');
const jpeg = await convert({ buffer: input, format: 'JPEG', quality: 1 });
await sharp(Buffer.from(jpeg)).rotate().resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 88 }).toFile('public/me.webp');
console.log(await sharp('public/me.webp').metadata());

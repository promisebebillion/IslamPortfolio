import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile, stat, rename } from 'node:fs/promises';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import { catalog } from './media-catalog.mjs';

const exec = promisify(execFile);
const root = process.cwd();
const source = path.join(root, 'VideoPortfolio');
const output = path.join(root, 'public', 'media');
const inspection = path.join(root, 'output', 'media');
const metadataPath = path.join(root, 'src', 'media.json');

async function run(args) {
  await exec(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { maxBuffer: 8 * 1024 * 1024 });
}

async function probe(file) {
  const { stdout } = await exec(ffprobe.path, ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', file]);
  const data = JSON.parse(stdout);
  const stream = data.streams.find(s => s.codec_type === 'video');
  const [numerator, denominator] = stream.avg_frame_rate.split('/').map(Number);
  return {
    width: stream.width, height: stream.height,
    duration: Number(data.format.duration), fps: numerator / denominator,
    bytes: Number(data.format.size), codec: stream.codec_name,
    audio: data.streams.some(s => s.codec_type === 'audio'),
  };
}

async function inspect() {
  await mkdir(output, { recursive: true });
  await mkdir(inspection, { recursive: true });
  await mkdir(path.dirname(metadataPath), { recursive: true });
  const projects = [];
  for (const item of catalog) {
    const info = await probe(path.join(source, item.file));
    const entry = { ...item, ...info, aspect: `${info.width}:${info.height}`, src: `/media/${item.id}-lite.mp4`, hd: `/media/${item.id}-hd.mp4`, poster: `/media/${item.id}.webp` };
    await run(['-ss', String(info.duration * 0.3), '-i', path.join(source, item.file), '-frames:v', '1', '-vf', 'scale=640:-2', '-quality', '85', path.join(output, `${item.id}.webp`)]);
    for (let n = 0; n < 3; n++) {
      await run(['-ss', String(info.duration * [0.15, 0.5, 0.8][n]), '-i', path.join(source, item.file), '-frames:v', '1', '-vf', 'scale=360:-2', path.join(inspection, `${item.id}-${n}.jpg`)]);
    }
    if (item.before) {
      entry.beforeInfo = await probe(path.join(source, item.before));
      entry.beforeSrc = `/media/${item.id}-before-lite.mp4`;
      entry.beforeHd = `/media/${item.id}-before-hd.mp4`;
      entry.beforePoster = `/media/${item.id}-before.webp`;
      await run(['-ss', String(entry.beforeInfo.duration * 0.3), '-i', path.join(source, item.before), '-frames:v', '1', '-vf', 'scale=640:-2', '-quality', '85', path.join(output, `${item.id}-before.webp`)]);
    }
    projects.push(entry);
    console.log(`${item.id}: ${info.width}×${info.height}, ${info.duration.toFixed(1)}s, ${info.fps.toFixed(2)}fps, ${(info.bytes / 1e6).toFixed(1)}MB`);
  }
  await writeFile(metadataPath, JSON.stringify(projects, null, 2));
  await writeFile(path.join(inspection, 'audit.json'), JSON.stringify(projects, null, 2));
}

async function encode(file, id, info, quality) {
  const destination = path.join(output, `${id}-${quality}.mp4`);
  try { if ((await stat(destination)).size > 0) return; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const lite = quality === 'lite';
  const maximum = lite ? 960 : 1920;
  const scale = Math.min(1, maximum / Math.max(info.width, info.height));
  const width = Math.floor(info.width * scale / 2) * 2;
  const height = Math.floor(info.height * scale / 2) * 2;
  const temporary = path.join(output, `${id}-${quality}.pending.mp4`);
  const args = ['-i', path.join(source, file), '-map', '0:v:0', '-map', '0:a?', '-vf', `scale=${width}:${height}`, '-c:v', 'libx264', '-preset', 'fast', '-crf', lite ? '25' : '20', '-threads', '3', '-pix_fmt', 'yuv420p', '-g', String(Math.round(info.fps * 2)), '-c:a', 'aac', '-b:a', lite ? '96k' : '160k', '-movflags', '+faststart', temporary];
  await run(args);
  await rename(temporary, destination);
  console.log(`Ready ${id} / ${quality}: ${((await stat(destination)).size / 1e6).toFixed(1)}MB`);
}

async function prepare() {
  const projects = JSON.parse(await readFile(metadataPath, 'utf8'));
  const jobs = [];
  for (const item of projects) {
    for (const quality of ['lite', 'hd']) {
      jobs.push(() => encode(item.file, item.id, item, quality));
      if (item.before) jobs.push(() => encode(item.before, `${item.id}-before`, item.beforeInfo, quality));
    }
  }
  let cursor = 0;
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (cursor < jobs.length) await jobs[cursor++]();
  }));
  for (const id of ['academy', 'tff', 'optics']) {
    const item = projects.find(p => p.id === id);
    await run(['-ss', String(item.duration * 0.25), '-i', path.join(source, item.file), '-t', '5', '-an', '-vf', 'scale=270:-2,fps=24', '-c:v', 'libx264', '-preset', 'fast', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(output, `${id}-preview.mp4`)]);
  }
  let original = 0;
  let lite = 0;
  let hd = 0;
  for (const item of projects) {
    original += item.bytes + (item.beforeInfo?.bytes || 0);
    for (const variant of ['', ...(item.before ? ['-before'] : [])]) {
      lite += (await stat(path.join(output, `${item.id}${variant}-lite.mp4`))).size;
      hd += (await stat(path.join(output, `${item.id}${variant}-hd.mp4`))).size;
    }
  }
  await writeFile(path.join(inspection, 'compression.json'), JSON.stringify({ original, lite, hd, files: projects.length }, null, 2));
  console.log(`Total: original ${(original / 1e6).toFixed(1)}MB; lite ${(lite / 1e6).toFixed(1)}MB; HD ${(hd / 1e6).toFixed(1)}MB`);
}

const command = process.argv[2];
if (command === 'inspect') await inspect();
else if (command === 'prepare') await prepare();
else throw new Error('Use media.mjs inspect or media.mjs prepare.');

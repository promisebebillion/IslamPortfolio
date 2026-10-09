import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { open, readFile, stat, writeFile } from 'node:fs/promises';
import ffprobe from 'ffprobe-static';

const exec = promisify(execFile);
const projects = JSON.parse(await readFile('src/media.json', 'utf8'));
const results = [];

async function verify(url, source, quality) {
  const file = `public${url}`;
  const { stdout } = await exec(ffprobe.path, ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', file]);
  const metadata = JSON.parse(stdout);
  const video = metadata.streams.find(stream => stream.codec_type === 'video');
  assert.equal(video.codec_name, 'h264', file);
  assert.equal(video.pix_fmt, 'yuv420p', file);
  const [frames, seconds] = video.avg_frame_rate.split('/').map(Number);
  assert.ok(Math.abs(frames / seconds - source.fps) < 0.01, `Frame rate: ${file}`);
  if (source.audio) assert.equal(metadata.streams.find(stream => stream.codec_type === 'audio')?.codec_name, 'aac', file);
  assert.ok(Math.abs(Number(metadata.format.duration) - source.duration) < 0.2, `Duration: ${file}`);
  assert.ok(Math.abs(video.width / video.height - source.width / source.height) < 0.005, `Aspect ratio: ${file}`);
  if (quality === 'hd') {
    assert.equal(video.width, source.width, file);
    assert.equal(video.height, source.height, file);
  }
  const handle = await open(file);
  const header = Buffer.alloc(16);
  const boxes = [];
  let offset = 0;
  const size = (await handle.stat()).size;
  try {
    while (offset < size) {
      await handle.read(header, 0, 16, offset);
      let length = header.readUInt32BE(0);
      const type = header.toString('ascii', 4, 8);
      boxes.push(type);
      if (length === 1) length = Number(header.readBigUInt64BE(8));
      if (length === 0) break;
      offset += length;
    }
  } finally { await handle.close(); }
  assert.ok(boxes.indexOf('moov') >= 0 && boxes.indexOf('moov') < boxes.indexOf('mdat'), `Fast start: ${file}`);
  results.push({ file, width: video.width, height: video.height, duration: Number(metadata.format.duration), bytes: size, fastStart: true });
}

for (const project of projects) {
  assert.ok((await stat(`public${project.poster}`)).size > 0);
  await verify(project.src, project, 'lite');
  await verify(project.hd, project, 'hd');
  if (project.before) {
    assert.ok((await stat(`public${project.beforePoster}`)).size > 0);
    await verify(project.beforeSrc, project.beforeInfo, 'lite');
    await verify(project.beforeHd, project.beforeInfo, 'hd');
  }
}
await writeFile('output/media/verification.json', JSON.stringify(results, null, 2));
console.log(`Verified ${results.length} MP4 files: duration, aspect ratio, HD dimensions, codec and fast-start metadata.`);

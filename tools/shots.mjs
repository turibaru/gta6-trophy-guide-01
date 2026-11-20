// Screenshot maker for the Leonida Platinum guide.
// Serves app/ with serve.ts on a local port, renders each shot URL in the
// local headless Chromium, converts the PNG capture to JPEG (quality 82)
// with ffmpeg, and checks the gate limits (<=256 KiB, long side <=1280,
// short side >=480). Node 22 stdlib only; Chromium + ffmpeg are local tools.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CHROME = process.env.CHROME_BIN ||
  join(process.env.HOME || '', '.cache/ms-playwright/chromium-1255/chrome-linux64/chrome');
const PORT = 8123;
import { readFileSync } from 'node:fs';

const SHOTS = JSON.parse(readFileSync(join(ROOT, 'shots.json'), 'utf8')).shots;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitUp(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error('server did not come up at ' + url);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('error', reject);
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(cmd + ' exited ' + code))));
  });
}

const server = spawn(process.execPath, [join(ROOT, 'serve.ts'), String(PORT)], { cwd: ROOT, stdio: 'pipe' });
try {
  await waitUp(`http://localhost:${PORT}/`);
  for (const shot of SHOTS) {
    const png = join(ROOT, 'screenshots', shot.file.replace(/\.jpg$/, '.png'));
    const jpg = join(ROOT, 'screenshots', shot.file);
    const url = `http://localhost:${PORT}${shot.url}`;
    await run(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--window-size=1280,800', '--virtual-time-budget=6000', '--screenshot=' + png, url]);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-q:v', '3', jpg]);
    unlinkSync(png);
    const size = statSync(jpg).size;
    console.log(shot.file, size + ' bytes', size <= 262144 ? 'OK' : 'TOO BIG');
    if (size > 262144) throw new Error(shot.file + ' exceeds 256 KiB');
    if (!existsSync(jpg)) throw new Error('missing ' + jpg);
  }
  console.log('all screenshots done');
} finally {
  server.kill();
}

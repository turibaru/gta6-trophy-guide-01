// Leonida Platinum — entry program for the GTA 6 trophy guide bounty.
// Copies app/ and screenshots/ from this repository into the output
// directory and writes dossier.json with make.fun's frontend dossier
// library. Node 22, standard library only, no network, no build step.
// Run: MAKEFUN_OUTPUT_DIR=out node main.ts   (defaults to /output)
import { buildDossier } from './vendor/makefun-frontend.ts';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const ROOT = new URL('.', import.meta.url).pathname;

function copyTree(name: string): void {
  const from = join(ROOT, name);
  const to = join(OUT_DIR, name);
  if (!existsSync(from)) throw new Error(`main.ts: missing ${name}/ in the repository`);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

mkdirSync(OUT_DIR, { recursive: true });
copyTree('app');
copyTree('screenshots');

const dossier = buildDossier(OUT_DIR, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(OUT_DIR, 'dossier.json'), dossier);
console.log(`main.ts: wrote ${OUT_DIR}/dossier.json (${dossier.length} bytes)`);

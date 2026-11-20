// gta6-meme-x-01 entrypoint (Node 22, standard library only).
//
// The entry is the X post named in POST.json; this program hands that
// address to the gate by writing it to /output/POST.json, where the
// house reads it and fetches the post from X. Nothing else is judged
// from what this program writes.
//
// Grader env: MAKEFUN_BOT_DIR is the repository root, MAKEFUN_OUTPUT_DIR
// is /output. Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(`meme entry: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, 'POST.json');
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(sourcePath, 'utf8'));
} catch (err) {
  fail(`cannot read ${sourcePath}: ${(err as Error).message}`);
}

if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  fail('POST.json must be a JSON object');
}
const record = parsed as Record<string, unknown>;
if (typeof record.url !== 'string' || record.url.length === 0) {
  fail('POST.json must name the post address in its "url" field');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), JSON.stringify({ url: record.url }) + '\n');

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('building the application cannot invoke database migration implicitly', () => {
  const scripts = pkg.scripts;
  assert.match(scripts.build, /\bvite build\b/);
  assert.doesNotMatch(scripts.build, /db:migrate|\bmigrate(?:\.mjs)?\b|&&|;|\|\|/);
  assert.equal(scripts['build:spa'], 'npm run build');
  assert.equal(scripts['db:migrate'], 'node scripts/migrate.mjs');
});

test('migration and release decisions are documented as independent gates', async () => {
  const content = await readFile(new URL('../docs/governance/CE_BUILD_MIGRATION_SEPARATION_20261114.md', import.meta.url), 'utf8');
  assert.match(content, /NO_DEPLOY/);
  assert.match(content, /npm run db:migrate/);
  assert.match(content, /aprova[cç][aã]o humana/i);
  assert.match(content, /backup/i);
});

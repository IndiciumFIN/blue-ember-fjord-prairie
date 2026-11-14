import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url));
const json = (path) => JSON.parse(read(path).toString('utf8'));
const gitBlobSha = (bytes) => createHash('sha1')
  .update(Buffer.from('blob ' + bytes.length + '\0'))
  .update(bytes)
  .digest('hex');

const snapshotPath = 'registers/pmo/snapshots/queue-r84-r85-rev18-20261031.v1.json';
const livePath = 'registers/pmo/queue.v1.json';
const expectedSha = 'c713557a808857eab9952e511d1f2a10bfa6f828';

test('R84/R85 source pin is the exact original Git blob, not the evolving queue', () => {
  const bytes = read(snapshotPath);
  const snapshot = JSON.parse(bytes.toString('utf8'));
  const r84 = json('registers/governance/r84-pmo-owner-decision-intake-20261031.v1.json');
  const r85 = json('registers/governance/r85-pmo-conversation-owner-assent-20261031.v1.json');

  assert.equal(gitBlobSha(bytes), expectedSha, 'original R84/R85 bytes drifted');
  assert.equal(r84.source.mainBaselineQueueBlobSha, expectedSha);
  assert.equal(r85.sourcePins.currentQueue.sha, expectedSha);
  assert.equal(r85.sourcePins.currentQueue.path, livePath, 'original historical source path was rewritten');
  assert.equal(snapshot.registryId, 'CE-PMO-001');
  assert.equal(snapshot.revision, 18);
  assert.equal(snapshot.items.length, 10);
  assert.equal(snapshot.events.length, 20);
});

test('later PMO queue updates are append-only events, never retroactive R84/R85 authority', () => {
  const snapshot = json(snapshotPath);
  const current = json(livePath);
  assert.equal(current.registryId, snapshot.registryId);
  assert.ok(current.events.length >= snapshot.events.length);
  assert.deepEqual(current.events.slice(0, snapshot.events.length), snapshot.events,
    'historical event prefix changed; quarantine the PMO source before re-evaluation');
  const sourceIds = new Set(snapshot.items.map(item => item.id));
  const currentIds = new Set(current.items.map(item => item.id));
  for (const id of sourceIds) assert.ok(currentIds.has(id), 'historical PMO WO removed: ' + id);
  assert.equal(json('registers/governance/r84-pmo-owner-decision-intake-20261031.v1.json').governance.releaseGate, 'HOLD_HUMAN');
});

test('negative: replacing the pinned snapshot with the current queue is rejected', () => {
  const source = read(snapshotPath);
  const current = read(livePath);
  assert.equal(gitBlobSha(source), expectedSha);
  if (gitBlobSha(current) !== expectedSha) {
    assert.notEqual(gitBlobSha(current), expectedSha);
  } else {
    assert.fail('source and active queue unexpectedly became identical; re-audit historic lineage');
  }
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const src = await readFile(new URL('../src/lib/source.functions.ts', import.meta.url), 'utf8');
const begin = src.indexOf('export const ensureRole = ');
const end = src.indexOf('export const adminDesk = ', begin);
assert.ok(begin >= 0 && end > begin, 'Role registration server action must exist');
const roleAction = src.slice(begin, end);

test('new session cannot claim admin role when no admin exists', () => {
  assert.match(roleAction, /insert into member\s*\(user_id,\s*role\)/);
  assert.match(roleAction, /values\s*\(\$\{context\.userId\},\s*\$\{"subscriber"\}\)/);
  assert.match(roleAction, /on conflict\s*\(user_id\)\s*do nothing/);
  assert.doesNotMatch(roleAction, /case\s+when\s+exists/i);
  assert.doesNotMatch(roleAction, /then\s*'subscriber'\s*else\s*'admin'/i);
});

test('member insert is idempotent and never demotes an existing admin', async () => {
  const db = new PGlite();
  try {
    await db.exec("create table member (user_id text primary key, role text not null check(role in ('admin','subscriber')))");
    const sql = "insert into member(user_id,role) values ($1,$2) on conflict(user_id) do nothing";
    await db.query(sql, ['first-signed-in', 'subscriber']);
    await db.query(sql, ['first-signed-in', 'subscriber']);
    await db.query(sql, ['existing-admin', 'admin']);
    await db.query(sql, ['existing-admin', 'subscriber']);
    const rs = await db.query('select user_id,role from member order by user_id');
    assert.deepEqual(rs.rows, [
      {user_id:'existing-admin',role:'admin'},
      {user_id:'first-signed-in',role:'subscriber'},
    ]);
  } finally {
    await db.close();
  }
});

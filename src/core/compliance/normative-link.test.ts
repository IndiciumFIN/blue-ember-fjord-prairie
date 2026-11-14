import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("os 45 vínculos gravam a leitura e não admitem o trecho", async () => {
  const meta = JSON.parse(await readFile(new URL("../../../attachments/metamodelo-normativos.json", import.meta.url), "utf8"));
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const links = await db.query<{ n: number }>("select count(*)::int as n from normative_link");
  const assets = await db.query<{ n: number }>("select count(*)::int as n from normative_asset");
  assert.equal(links.rows[0]?.n, meta.tabelas.meta_vinculo_normativo.length);
  assert.equal(assets.rows[0]?.n, meta.tabelas.meta_activo.length);
  const promoted = await db.query<{ n: number }>(`
    select count(*)::int as n
    from normative_link as link
    join content_atom as atom on atom.id = link.rule_id
    where link.reading = 'CONFORME' and atom.status <> 'candidato'
  `);
  assert.equal(promoted.rows[0]?.n, 0);
  const orders = await db.query<{ n: number }>("select count(*)::int as n from kernel_order");
  assert.equal(orders.rows[0]?.n ?? 0, 0);
});

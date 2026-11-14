import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

type Count = { n: number };
type DictColumn = { entity: string; name: string; definition: string; ref_entity: string | null; syntax: string | null };
type DictEntity = { name: string; layer_id: string; purpose: string; primary_key: string };

async function rootPGlite() {
  const db = new PGlite();
  const base = new URL("../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter(n => /^\d{4}_.+\.sql$/.test(n)).sort();
  assert.equal(names.length, 85, "the root migration corpus changed; re-review 0087 before remote admission");
  assert.equal(names.at(-1), "0085_carreira_fundamento.sql");
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  return db;
}
async function count(db: PGlite, sql: string) {
  return (await db.query<Count>(sql)).rows[0]?.n ?? -1;
}
async function dictionary(db: PGlite) {
  const entities = (await db.query<DictEntity>(
    "select name, layer_id, purpose, primary_key from schema_entity order by name"
  )).rows;
  const columns = (await db.query<DictColumn>(
    "select entity, name, definition, ref_entity, syntax from schema_column order by entity, name"
  )).rows;
  return { entities, columns };
}
async function protectedFingerprint(db: PGlite) {
  const protectedTables = [
    "kernel_order", "content_atom", "source_tool", "content_text",
    "data_specification", "business_rule", "governance_item", "fundamento",
    "schema_relation", "metadata_element", "schema_domain",
  ];
  const result: Record<string, { count: number; digest: string | null }> = {};
  for (const table of protectedTables) {
    const rows = await db.query<{ count: number; digest: string | null }>(
      `select count(*)::int as count,
              md5(coalesce(string_agg(to_jsonb(t)::text, '|' order by to_jsonb(t)::text), '')) as digest
         from ${table} as t`
    );
    result[table] = rows.rows[0]!;
  }
  return result;
}

test("0087 is metadata-only, idempotent and never admits or publishes candidates", async () => {
  const db = await rootPGlite();
  const original = await dictionary(db);
  const protectedBefore = await protectedFingerprint(db);
  assert.equal(original.entities.length, 166, "physical/dictionary entity baseline drift");
  assert.equal(original.columns.length, 1057, "physical/dictionary column baseline drift");
  assert.equal(original.columns.filter(c => c.definition === "Coluna física sem definição humana.").length,
    454, "unexpected source definitions; fail closed");
  assert.equal(original.entities.filter(e => e.layer_id === "candidato").length, 55);
  const sourceSql = await readFile(new URL("../../migrations/candidates/0087_dicionario_candidato.sql", import.meta.url), "utf8");
  assert.ok(sourceSql.startsWith("-- Dicionário do que já existe na camada candidato."));
  await db.exec(sourceSql);
  const once = await dictionary(db);
  const protectedOnce = await protectedFingerprint(db);
  assert.equal(once.columns.filter(c => c.definition === "Coluna física sem definição humana.").length, 0);
  assert.equal(once.entities.filter(e => e.layer_id === "candidato").length, 55);
  assert.equal(once.entities.length, 166);
  assert.equal(once.columns.length, 1057);
  for (const prev of original.columns) {
    if (prev.definition === "Coluna física sem definição humana.") continue;
    const current = once.columns.find(c => c.entity === prev.entity && c.name === prev.name);
    assert.ok(current, "dictionary column disappeared");
    if (prev.entity === "intake_file" && prev.name === "locale") continue;
    assert.equal(current.definition, prev.definition, "non-generic definition overwritten: " + prev.entity + "." + prev.name);
  }
  const keys: Record<string, string> = {
    career_path_step_candidate: "path_id + step_order",
    career_profile_skill_candidate: "participant_key + skill_id",
    career_profile_credential_candidate: "participant_key + credential_id",
    career_editorial_block_candidate: "document_id + block_id",
    career_content_claim_binding_candidate: "document_id + block_id + claim_id",
  };
  for (const [name, key] of Object.entries(keys)) {
    assert.equal(once.entities.find(e => e.name === name)?.primary_key, key);
  }
  assert.equal(once.columns.find(c => c.entity === "intake_file" && c.name === "locale")?.ref_entity, "locale");
  assert.equal(once.columns.find(c => c.entity === "content_atom" && c.name === "reference_tool")?.ref_entity, "tool_reference");
  assert.deepEqual(protectedOnce, protectedBefore, "0087 modified protected clinical, publication or governance data");
  await db.exec(sourceSql);
  const twice = await dictionary(db);
  assert.deepEqual(twice, once, "second application is not idempotent");
  assert.deepEqual(await protectedFingerprint(db), protectedBefore);
  assert.equal(await count(db, "select count(*)::int as n from kernel_order"), 0);
  assert.equal(await count(db, "select count(*)::int as n from schema_column where entity='content_object' and name='file_kind'"), 1);
  console.log("CANDIDATE_DICTIONARY_0087", JSON.stringify({
    status: "PASS_SOURCE_ISOLATED", entities: once.entities.length, columns: once.columns.length,
    candidateEntities: 55, definitionsCorrected: 454, primaryKeysCorrected: Object.keys(keys).length,
    repeatedApplications: 2, kernelOrders: 0, clinicalRelease: false,
  }));
});

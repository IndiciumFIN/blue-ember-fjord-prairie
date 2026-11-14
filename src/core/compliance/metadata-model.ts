import { readFileSync } from "node:fs";
import { auditProcessSpine } from "./process-layer.ts";

/** O elemento liga o que já existe. Não declara a ISO 11179 cumprida. */
export function auditMetadataModel() {
  const sql = readFileSync(new URL("../../../migrations/0068_metadado.sql", import.meta.url), "utf8");
  const domain = sql.includes("create table if not exists schema_domain") && sql.includes("schema_term_domain_fkey");
  const element = sql.includes("create table if not exists metadata_element")
    && sql.includes("foreign key (entity, name) references schema_column (entity, name)")
    && sql.includes("support_id text not null references governance_item");
  const bound = sql.includes("from schema_column as column_row") && sql.includes("'politica-metadado'");
  const identifiers = ["STD-ISO-11179-1", "STD-ISO-11179-3", "STD-ISO-11179-31"].every((id) => sql.includes(`'${id}'`));
  const notLicensed = sql.includes("A cláusula não entra") && sql.includes("nasce em rascunho");
  const relations = sql.includes("('schema_domain', 'termos', 'schema_term'")
    && sql.includes("('schema_column', 'elemento', 'metadata_element'")
    && sql.includes("('governance_item', 'elementos', 'metadata_element'");
  const spine = auditProcessSpine();
  return {
    domain,
    element,
    bound,
    identifiers,
    notLicensed,
    relations,
    spine: spine.spine,
    adherentToNormText: false,
    wholeLayer: false,
    concluded: domain && element && bound && identifiers && notLicensed && relations && spine.spine,
  };
}

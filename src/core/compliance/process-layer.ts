import { readFileSync } from "node:fs";
import { auditIdentityAccessFlow } from "./identity-access-flow.ts";

const spine = ["process", "process_setting", "governance_item", "document_version", "schema_layer", "schema_entity", "schema_column", "policy_package", "fundamento"];

const open = ["intake_batch", "intake_file", "suggestion", "work_order", "cmd_command", "cmd_run", "cmd_event", "repo_source", "repo_file", "repo_branch", "agent", "kernel_atom"];

/** A espinha do processo fecha. Carga, repositório, comando e agente continuam fora. */
export function auditProcessSpine() {
  const sql = readFileSync(new URL("../../../migrations/0067_processo_espinha.sql", import.meta.url), "utf8");
  const described = spine.every((entity) => sql.includes(`('${entity}',`));
  const relations = [
    "('process', 'ajustes', 'process_setting', '1:N', 'id', 'process_id'",
    "('governance_item', 'versoes', 'document_version', '1:N', 'id', 'item_id'",
    "('schema_layer', 'tabelas', 'schema_entity', '1:N', 'id', 'layer_id'",
    "('schema_entity', 'colunas', 'schema_column', '1:N', 'name', 'entity'",
    "('policy_package', 'regras', 'policy_rule', '1:N', 'id', 'package_id'",
  ].every((line) => sql.includes(line));
  const leavesRemainder = open.every((entity) => !sql.includes(`('${entity}',`));
  const flow = auditIdentityAccessFlow();
  return {
    described,
    relations,
    leavesRemainder,
    priorFlow: flow.flow,
    spine: described && relations && leavesRemainder && flow.flow,
    wholeLayer: false,
  };
}

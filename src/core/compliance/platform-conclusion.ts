import { readdirSync, readFileSync } from "node:fs";
import { evaluateWorkOrder } from "../governance/kernel.ts";
import type { Manifest, PolicyRule, WorkOrder } from "../governance/types.ts";
import { formulas } from "../../lib/tools/formulas.ts";

const requiredEntities = [
  "user", "session", "member", "governance_item", "fundamento", "policy_part",
  "kernel_order", "kernel_order_policy", "kernel_validator", "kernel_manifest",
  "source_tool", "tool_formula", "tool_formula_step",
  "inst_page", "editorial_template", "library_item", "catalog_item",
];

const catalogSlugs = ["braden", "morse", "apgar", "aldrete", "gotejamento", "imc", "exames-laboratoriais"];

function migrations() {
  return readdirSync(new URL("../../../migrations", import.meta.url))
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .map((name) => readFileSync(new URL(`../../../migrations/${name}`, import.meta.url), "utf8"))
    .join("\n");
}

function order(): WorkOrder {
  const approvedAt = "2026-11-13T15:00:00.000Z";
  return {
    id: "os-plataforma",
    type: "test",
    title: "Conclusão da plataforma",
    objective: "Fonte única",
    scope: "tabelas já descritas",
    owner: "autor",
    approver: "revisor",
    sourceRef: "governance_item:politica-dado",
    policySet: ["politica-dado"],
    riskLevel: "high",
    dataClassification: "internal",
    securityImpact: "medium",
    environment: "test",
    status: "in_test",
    hash: "a".repeat(64),
    dependencies: [],
    acceptanceCriteria: ["dicionario"],
    evidence: [],
    approvals: [{ id: "apr-1", approver: "revisor", decision: "approved", approvedAt }],
    createdAt: approvedAt,
    updatedAt: approvedAt,
  };
}

function manifest(status: Manifest["status"], approvedBy?: string): Manifest {
  return {
    id: "manifest-os-plataforma",
    serviceOrderId: "os-plataforma",
    version: "1.0.0",
    state: "preview",
    hash: "a".repeat(64),
    validators: ["dicionario"],
    policySet: ["politica-dado"],
    status,
    approvedBy,
    approvedAt: approvedBy ? "2026-11-13T15:00:00.000Z" : undefined,
  };
}

const policy: PolicyRule = {
  id: "politica-dado",
  code: "politica-dado",
  description: "Não grava paciente.",
  version: "interno",
  active: true,
  scope: "content",
};

export async function auditPlatformConclusion() {
  const sql = migrations();
  const entities = new Set([...sql.matchAll(/\('([a-z0-9_]+)', '(?:identidade|acesso|processo|conteudo|clinico)'/g)].map((item) => item[1]));
  const dictionary = requiredEntities.every((name) => entities.has(name));
  const columns = ["tool_slug", "method", "statement", "position", "target", "expression"].every((name) => sql.includes(`'${name}'`));
  const reverted = sql.includes("Desfaz a aprovação em lote") && sql.includes("set status = 'rascunho', approved_by = null");
  const kernelCannotApprove = sql.includes("approver_id <> 'kernel'") && sql.includes("approved_by <> 'kernel'");
  const formulasLinked = catalogSlugs.every((slug) => sql.includes(`'${slug}'`));
  const methods = Object.keys(formulas).every((slug) => sql.includes(`'${slug}'`));
  const noAdmittedOrder = !/insert into kernel_order[\s\S]{0,200}'admitida'/.test(sql);
  const document = readFileSync(new URL("../../../docs/documento-interno-arredondamento.md", import.meta.url), "utf8");
  const holdWithoutPolicy = await evaluateWorkOrder(order(), manifest("approved", "revisor"), [policy], [{ id: "dicionario", run: async () => true }]);
  const holdSelf = await evaluateWorkOrder(order(), manifest("approved", "kernel"), [policy], [{ id: "dicionario", run: async () => true }], async () => ({ allow: true, decisionId: "dec-1", bundleRef: "interno" }));
  const admitted = await evaluateWorkOrder(order(), manifest("approved", "revisor"), [policy], [{ id: "dicionario", run: async () => true }], async () => ({ allow: true, decisionId: "dec-1", bundleRef: "interno" }));
  const stages = [
    { id: "dicionario", ok: dictionary && columns, detail: "Entidades do plano e colunas da conta estão no dicionário." },
    { id: "politica", ok: reverted && kernelCannotApprove, detail: "Aprovação em lote foi desfeita. O kernel não é aprovador." },
    { id: "kernel", ok: holdWithoutPolicy.outcome === "hold" && holdSelf.outcome === "hold" && admitted.outcome === "admit", detail: "Sem avaliador ou sem pessoa, a ordem espera. Com revisor e política, admite." },
    { id: "clinico", ok: formulasLinked && methods, detail: "Cada ferramenta do catálogo tem método na tabela." },
    { id: "norma-externa", ok: document.includes("Não há depósito nem indicador de texto licenciado") && document.includes("A IEEE 754 não é critério desta fase."), detail: "Identificador externo não substitui o documento interno." },
    { id: "conclusao", ok: false, detail: "Nenhuma ordem está admitida no banco. Sem aprovador humano a plataforma não fecha." },
  ];
  return {
    stages,
    adherent: stages.filter((stage) => stage.id !== "conclusao").every((stage) => stage.ok),
    concluded: noAdmittedOrder ? false : stages.every((stage) => stage.ok),
  };
}

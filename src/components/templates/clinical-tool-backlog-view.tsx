import { useState } from "react";
import { ArticlePage } from "@/components/article/article-page";
import { Callout } from "@/components/site/callout";
import { clinicalToolBacklog } from "@/lib/clinical-tool-backlog";

/** Diagnostic inventory, not a navigation route to unapproved calculators. */
export function ClinicalToolBacklogView() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<"all" | "missing" | "candidate">("all");
  const entries = clinicalToolBacklog();
  const filtered = entries.filter((row) =>
    row.slug.includes(query.trim().toLowerCase()) &&
    (state === "all" || (state === "missing" ? row.state === "MISSING_RUNTIME" : row.state === "CANDIDATE_RUNTIME")),
  );
  return (
    <ArticlePage
      kind="editorial"
      crumbs={[{ label: "Início", to: "/" }, { label: "Templates", to: "/modelos" }, { label: "Inventário de ferramentas" }]}
      eyebrow="Diagnóstico canônico · somente leitura"
      title="Ferramentas pendentes de consolidação"
      lead="Inventário histórico para encontrar lacunas de implementação. Não equivale a homologação, catálogo publicado ou recomendação de uso clínico."
    >
      <Callout>
        A lista vem de um relatório do backup de 01/11/2026. Ela não prova vigência normativa,
        funcionamento de cálculos ou direitos de uso. Cada item exige FIND, fonte, política,
        validação, WO, Kernel, auditoria e aprovação humana.
      </Callout>
      <section className="inst-sec" aria-labelledby="tool-inventory-title">
        <h2 id="tool-inventory-title">Cobertura registrada</h2>
        <p>{entries.filter((row) => row.state === "CANDIDATE_RUNTIME").length} candidatos com implementação presente; {entries.filter((row) => row.state === "MISSING_RUNTIME").length} ausentes da runtime atual.</p>
        <div className="patient-grid">
          <label className="field">
            <span>Buscar identificador</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: glasgow" autoComplete="off" />
          </label>
          <label className="field">
            <span>Situação</span>
            <select value={state} onChange={(event) => setState(event.target.value as typeof state)}>
              <option value="all">Todas</option>
              <option value="missing">Ausentes</option>
              <option value="candidate">Candidatas na runtime</option>
            </select>
          </label>
        </div>
        <p className="tool-help" role="status">{filtered.length} itens encontrados.</p>
        <ul className="related-grid">
          {filtered.map((row) => (
            <li key={row.canonicalId} className="nav-card">
              <h3>{row.slug}</h3>
              <p>{row.state === "MISSING_RUNTIME" ? "Sem motor no catálogo atual" : "Candidata presente, sem homologação"}</p>
              <p className="tool-help">{row.canonicalId} · NO-GO</p>
            </li>
          ))}
        </ul>
      </section>
    </ArticlePage>
  );
}

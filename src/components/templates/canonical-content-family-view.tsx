import { useState } from "react";
import { ArticlePage } from "@/components/article/article-page";
import { Callout } from "@/components/site/callout";
import type { CanonicalContentFamily } from "@/lib/canonical-content-families";

/**
 * One renderer for the new content-family templates.
 * Uses only the existing CE design contract, ArticlePage, and stylesheet classes.
 * Candidate blocks are examples, never interpreted as validated clinical guidance.
 */
export function CanonicalContentFamilyView({
  family,
  blocks = family.blocks,
}: {
  family: CanonicalContentFamily;
  blocks?: readonly string[];
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const checklist = family.id === "checklist";
  return (
    <ArticlePage
      kind={family.kind}
      crumbs={[{ label: "Início", to: "/" }, { label: "Templates", to: "/modelos" }, { label: family.name }]}
      eyebrow="Contrato visual canônico · v1"
      title={family.name}
      lead="Estrutura reutilizável para conteúdo editorial candidato. Sem material clínico aprovado e sem persistência de dados."
    >
      <Callout>
        Este é um molde para revisão. Fontes, direitos, vínculos CKO, revisão humana e gates de publicação
        precisam ser comprovados antes de qualquer divulgação de conteúdo.
      </Callout>
      <section className="inst-sec" aria-labelledby="family-structure-title">
        <h2 id="family-structure-title">Estrutura do template</h2>
        {checklist ? (
          <>
            <ul className="choice-list">
              {blocks.map((block, index) => {
                const key = `${index}:${block}`;
                return (
                  <li key={key}>
                    <label className="choice">
                      <input
                        type="checkbox"
                        checked={checked.includes(key)}
                        onChange={(event) => setChecked((current) =>
                          event.target.checked ? [...current, key] : current.filter((value) => value !== key))}
                      />
                      <span>{block}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className="tool-help" role="status">
              {checked.length} de {blocks.length} itens marcados nesta sessão. Nenhum dado é enviado.
            </p>
            <button className="btn-ghost" type="button" onClick={() => setChecked([])}>
              Limpar marcações
            </button>
          </>
        ) : (
          <ol className="inst-flow">
            {blocks.map((block, index) => <li key={`${index}:${block}`}>{block}</li>)}
          </ol>
        )}
      </section>
      {family.id === "podcast" || family.id === "video" ? (
        <section className="inst-sec" aria-labelledby="family-media-title">
          <h2 id="family-media-title">Mídia e acessibilidade</h2>
          <p className="tool-help">
            Nenhuma mídia está associada a este molde. O componente de reprodução só poderá ser
            disponibilizado com arquivo autorizado, origem identificada e transcrição ou legendas.
          </p>
        </section>
      ) : null}
      <section className="inst-sec" aria-labelledby="family-governance-title">
        <h2 id="family-governance-title">Vínculos obrigatórios</h2>
        <ul className="guide-cards">
          <li><b>Objeto canônico</b><span>ID e versão identificáveis</span></li>
          <li><b>Fonte e direitos</b><span>Proveniência, licença e localização verificadas</span></li>
          <li><b>Governança</b><span>FIND, política, validação, WO e Kernel</span></li>
          <li><b>Publicação</b><span>Bloqueada até revisão humana e gates de release</span></li>
        </ul>
      </section>
    </ArticlePage>
  );
}

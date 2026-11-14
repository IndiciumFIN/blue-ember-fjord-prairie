import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { Shell } from "@/components/site/shell";

export const Route = createFileRoute("/kids/jogos")({
  component: () => (
    <Shell>
      <ArticlePage kind="editorial" crumbs={[{ label: "Início", to: "/" }, { label: "Vila do Cuidado" }, { label: "Jogos" }]} eyebrow="Vila do Cuidado" title="Jogos" lead="Jogos educacionais da Vila do Cuidado.">
        <section className="inst-sec"><h2>Status: CANDIDATE</h2><p>Conteúdo em desenvolvimento.</p></section>
      </ArticlePage>
    </Shell>
  ),
  head: () => ({ meta: [{ title: "Jogos · Vila do Cuidado" }, { name: "robots", content: "noindex, nofollow" }] }),
});

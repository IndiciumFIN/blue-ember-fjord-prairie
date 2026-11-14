import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { Shell } from "@/components/site/shell";

export const Route = createFileRoute("/kids/colorir")({
  component: () => (
    <Shell>
      <ArticlePage kind="editorial" crumbs={[{ label: "Início", to: "/" }, { label: "Vila do Cuidado" }, { label: "Colorir" }]} eyebrow="Vila do Cuidado" title="Colorir" lead="Páginas para colorir da Vila do Cuidado.">
        <section className="inst-sec"><h2>Status: CANDIDATE</h2><p>Conteúdo em desenvolvimento.</p></section>
      </ArticlePage>
    </Shell>
  ),
  head: () => ({ meta: [{ title: "Colorir · Vila do Cuidado" }, { name: "robots", content: "noindex, nofollow" }] }),
});

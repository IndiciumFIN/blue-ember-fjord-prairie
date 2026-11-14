import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { Shell } from "@/components/site/shell";

export const Route = createFileRoute("/residencias")({
  head: () => ({ meta: [
    { title: "Residências · Calculadoras de Enfermagem" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: () => (
    <Shell>
      <ArticlePage kind="secao" crumbs={[{ label: "Início", to: "/" }, { label: "Residências" }]} eyebrow="Carreira" title="Residências" lead="Esta seção ainda não tem conteúdo publicado.">
        <section className="inst-sec"><h2>Em preparação</h2><p>O texto desta página ainda não entrou na fonte.</p></section>
      </ArticlePage>
    </Shell>
  ),
});

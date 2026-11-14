import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { Shell } from "@/components/site/shell";

export const Route = createFileRoute("/kids/$section")({
  component: KidsSection,
  head: () => ({ meta: [
    { title: "Vila do Cuidado — Seção · Calculadoras de Enfermagem" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
});

function KidsSection() {
  return (
    <Shell>
      <ArticlePage kind="editorial" crumbs={[{ label: "Início", to: "/" }, { label: "Vila do Cuidado" }, { label: "Seção" }]} eyebrow="Comunidade · seção" title="Vila do Cuidado" lead="Seção de conteúdo da Vila do Cuidado.">
        <section className="inst-sec"><h2>Em preparação</h2><p>O texto desta seção ainda não entrou na fonte.</p></section>
      </ArticlePage>
    </Shell>
  );
}

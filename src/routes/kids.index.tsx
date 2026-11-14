import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { Shell } from "@/components/site/shell";

export const Route = createFileRoute("/kids/")({
  component: KidsIndex,
  head: () => ({ meta: [
    { title: "Vila do Cuidado · Calculadoras de Enfermagem" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
});

function KidsIndex() {
  return (
    <Shell>
      <ArticlePage kind="editorial" crumbs={[{ label: "Início", to: "/" }, { label: "Vila do Cuidado" }]} eyebrow="Comunidade · narrativas de cuidado" title="Vila do Cuidado" lead="Plataforma de histórias, narrativas de cuidado e comunidade para profissionais e pacientes.">
        <section className="inst-sec">
          <h2>Status: CANDIDATE</h2>
          <p>Plataforma em desenvolvimento. Conteúdo aguardando curadoria humana.</p>
        </section>
      </ArticlePage>
    </Shell>
  );
}

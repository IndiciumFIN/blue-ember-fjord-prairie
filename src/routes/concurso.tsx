import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { Shell } from "@/components/site/shell";
import { CurriculumEditor } from "@/components/career/curriculum-editor";

export const Route = createFileRoute("/concurso")({
  component: ConcursoPage,
  head: () => ({
    meta: [
      {
        title: "Carreira e Concursos · Gerador de Currículo · Calculadoras de Enfermagem",
      },
      {
        name: "description",
        content:
          "Monte seu currículo profissional nos formatos Lattes e ABNT NBR 14724. Vincule publicações cadastradas, certificações, competências. Modelo de dados canônico conforme curriculum.schema.json.",
      },
    ],
  }),
});

function ConcursoPage() {
  return (
    <Shell>
      <ArticlePage
        kind="editorial"
        crumbs={[{ label: "Início", to: "/" }, { label: "Currículo" }]}
        eyebrow="Carreira e Concursos · Gerador de Currículo"
        title="Monte seu currículo Lattes / ABNT"
        lead="Gerador de currículo profissional vinculado às suas publicações, certificações e competências. Exporte nos formatos Lattes (CNPq) e ABNT NBR 14724. Os dados são salvos localmente no seu navegador."
      >
        <section style={{ marginTop: "1.5rem" }}>
          <CurriculumEditor />
        </section>
      </ArticlePage>
    </Shell>
  );
}

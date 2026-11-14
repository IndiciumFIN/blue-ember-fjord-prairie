import { Link } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { Shell } from "@/components/site/shell";

export function NotFound() {
  return (
    <Shell>
      <ArticlePage
        kind="secao"
        crumbs={[{ label: "Início", to: "/" }, { label: "Página não encontrada" }]}
        eyebrow="404"
        title="Página não encontrada"
        lead="Esse endereço não faz parte da etapa atual do pacote."
      >
        <p><Link to="/" className="btn-navy">Voltar ao início</Link></p>
      </ArticlePage>
    </Shell>
  );
}

import { Link, createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/article/article-page";
import { AreaFrame, AreaGuard } from "@/components/site/areas";
import { MemberIdentityPanel } from "@/components/site/member-identity";
import { SubscriptionPanel } from "@/components/site/subscription";

export const Route = createFileRoute("/conta")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "Minha conta · Calculadoras de Enfermagem" },
      { name: "description", content: "Perfil e assinatura do usuário, acessíveis em sessão autenticada." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AccountPage() {
  return (
    <AreaGuard allow="member">
      <AreaFrame role="assinante" title="Minha conta">
        <ArticlePage
          kind="area"
          crumbs={[{ label: "Site público", to: "/" }, { label: "Minha conta" }]}
          eyebrow="Minha área"
          title="Conta e assinatura"
          lead="Consulte sua identidade e o estado de sua solicitação de assinatura. Sem dados clínicos persistidos nesta área."
        >
          <MemberIdentityPanel />
          <SubscriptionPanel />
          <section className="paper tool-block" aria-labelledby="account-resources-title">
            <h2 id="account-resources-title">Acessos da conta</h2>
            <ul className="related-grid">
              <li><Link className="nav-card" to="/assinante"><h3>Área do assinante</h3><p>Conteúdo habilitado e comunidade, conforme as permissões da conta.</p></Link></li>
              <li><Link className="nav-card" to="/modelos"><h3>Templates</h3><p>Estruturas reutilizáveis em avaliação, sem aprovação clínica automática.</p></Link></li>
            </ul>
          </section>
        </ArticlePage>
      </AreaFrame>
    </AreaGuard>
  );
}

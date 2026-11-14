import { useCurrentUserState } from "@/lib/auth/use-current-user";

/** Read-only identity shared by the user and subscriber areas. */
export function MemberIdentityPanel() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <p className="tool-help" role="status">Consultando a sessão…</p>;
  if (!user) return <p className="tool-help">Identidade não disponível nesta sessão.</p>;
  return (
    <section className="paper tool-block" aria-labelledby="member-identity-title">
      <h2 id="member-identity-title">Meu perfil</h2>
      {user.isDevFallback ? (
        <p className="tool-help">Ambiente de demonstração: as informações abaixo são fictícias.</p>
      ) : null}
      <dl>
        <dt>Nome exibido</dt>
        <dd>{user.displayName ?? "Não informado"}</dd>
        <dt>E-mail da conta</dt>
        <dd>{user.primaryEmail ?? "Não informado"}</dd>
      </dl>
      <p className="tool-help">
        Esta seção é somente leitura e não armazena respostas clínicas ou dados de pacientes.
      </p>
    </section>
  );
}

# CE/NCOS — provisionamento administrativo explícito (14/11/2026)

**Estado:** CANDIDATE, NO_DEPLOY, HOLD_SECURITY. Esta mudança não cria nem provisiona administradores no banco.

## Vulnerabilidade mitigada

O fluxo anterior de `ensureRole` criava o PRIMEIRO usuário autenticado com papel `admin` se nenhum outro administrador existisse. Um cadastro público poderia portanto receber acesso privilegiado pela ordem de chegada.

Novo contrato: toda nova sessão verificada recebe `subscriber`, de forma idempotente. Usuários já provisionados como `admin` preservam o papel. O sistema jamais cria admin por ausência de outro admin.

## Provisionamento administrativo (somente operação aprovada)

1. Identificar a instância certa (dev, homologação ou produção). Não usar usuários de demonstração ou identificadores escolhidos pelo cliente.
2. Verificar a identidade do proprietário no provedor de autenticação e confrontar o `user.id` persistido na tabela `user`.
3. Abrir WO de IAM, documentar solicitante, justificativa, aprovador independente, privilégios necessários e janela.
4. Executar uma alteração de papel exclusivamente no banco administrativo privilegiado, em transação, usando parâmetros para o ID verificado; nenhuma API pública pode executar o bootstrap.
5. Registrar em `audit_event` a identidade do operador, data, ação e motivo, segundo a política vigente; se não houver trilha de auditoria suficiente, manter HOLD.
6. Validar o primeiro login como admin, a permanência do assinante como assinante e rejeição de acesso cruzado aos endpoints.
7. Testar revogação, recuperação de acesso e regra de que a organização nunca dependa de um único administrador sem contingência.

## Gates de aceite

- 0 elevação implícita por ordem de cadastro; 0 alteração de papel pelo frontend.
- Testes negativos para primeiro cadastro, idempotência e preservação de admin existentes.
- Testar isolamento de sessões e RBAC server-side com identidades distintas.
- Liberação sujeita à aprovação humana e aos demais gates NCOS; sem relaxar `surface-bindings`.
- Nenhuma execução do procedimento privilegiado foi realizada por esta PR.

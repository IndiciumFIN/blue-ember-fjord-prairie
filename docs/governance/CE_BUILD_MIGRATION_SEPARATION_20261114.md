# CE/NCOS — contrato de build e migrations separados (2026-11-14)

**Escopo:** segurança de execução. Nenhum schema, tenant, conteúdo clínico ou contrato editorial é alterado.
**Estado:** CANDIDATE / NO_DEPLOY / NO_MERGE enquanto persistirem os gates de release.

## Decisão

Compilar não pode modificar o banco remoto. `npm run build` e `npm run build:spa` executam somente o compilador Vite. O comando `npm run db:migrate` continua disponível como operação separada e **nunca deve ser chamado pelo build**.

Esta alteração não autoriza executar migrations e não aprova o schema remoto.

## Fluxo de execução independente

1. Congelar commit SHA, identificar ambiente (dev/homologação/produção) e inspecionar o banco existente em leitura.
2. Reconciliar migrations e hashes, contratos, RLS, papéis, impacto em dados e retrocompatibilidade.
3. Testar em instância descartável e produzir evidências de restauração de **backup** e plano de rollback.
4. Registrar FIND, política, validador, WO e risco; exigir **aprovação humana** independente para alterar o banco.
5. Somente após autorização, executar explicitamente `npm run db:migrate` no ambiente apropriado.
6. Reconciliar a tabela `_migrations`, logs, dados e controles; em erro, manter HOLD e executar plano de retorno.
7. Publicar aplicativo separadamente, sujeito aos gates de funcionalidade, segurança, clínica e conteúdo.

## Regras de não regressão

- CI de compilação é NO_DEPLOY, usa DATABASE_URL vazio e não executa migrations remotas.
- Nenhum gate de rotas, proveniência, conteúdo ou publicação é contornado.
- `migrations/preview/` permanece apenas para a base local PGLite.
- O repositório não afirma que o banco remoto foi homologado.
- A mudança deve seguir por PR independente e somente por promoção aprovada.

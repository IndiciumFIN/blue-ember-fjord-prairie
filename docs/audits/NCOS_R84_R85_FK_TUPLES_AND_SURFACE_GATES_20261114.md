# NCOS — reconciliação de evidência R84/R85, tuplas FK e gates de superfície
Data: 2026-11-14. Escopo: CE/NCOS, **não inclui WU-TRIB ou contabilidade**.
Estado de homologação: **NO-GO**. Não cria admissão clínica, autorização ou publicação.

## Fontes Git congeladas
- Baseline anterior: `967dbfc92ab2787d9c1f6c66e3982d8f530c14f1`.
- Baseline após correções: consultar `main` e o run CI vinculado ao commit; não presumir que um nome de branch é imutável.
- Evidência R84/R85 original: Git blob `c713557a808857eab9952e511d1f2a10bfa6f828`.
- Snapshot byte-idêntico: `registers/pmo/snapshots/queue-r84-r85-rev18-20261031.v1.json`.
- Fila atual: `registers/pmo/queue.v1.json`; seu Git blob é diferente, sem reatribuir autoria ou autoridade ao histórico.

## R84/R85 — correção de leitura da fonte
A fonte original contém 10 WOs e 20 eventos, na revisão 18. A fila atual contém 11 WOs e 21 eventos, com `WO-CE-DB-SKELETON-001` em `QUEUED`. A sequência histórica de eventos permanece idêntica e os 10 itens antigos são preservados. A versão fixada é carregada nas verificações históricas; a fila atual é verificada separadamente por teste de prefixo append-only.

A alteração **não** edita os documentos R84/R85, seus pins, assinaturas inexistentes, recomendações, permissões, estados de admissão ou eventos da fila. O caminho no documento histórico continua indicando a origem à época, não um ponteiro flutuante para o HEAD de hoje.

## Auditoria de FK física vs dicionário
O teste `src/lib/fk-tuple-catalog.test.ts` reaplica apenas os SQLs da raiz `migrations/*.sql` em PGLite limpo e lê `pg_constraint`, `pg_attribute` e `schema_relation`:
- 150 FKs físicas, 137 simples, 13 compostas.
- 0 FKs simples sem relação de primeiro par equivalente.
- 0 FKs compostas sem relação de primeiro par equivalente.
- 13 FKs compostas sob **HOLD_COMPOSITE_TUPLE_UNREPRESENTED**: o contrato `schema_relation` ainda armazena `from_column` e `to_column` escalares. A presença do primeiro par **não** certifica a tupla ordenada completa.
- Testes negativos rejeitam relação escalar com coluna errada, inversão da ordem e redução da aridade de um constraint.

Nenhuma FK física, migration histórica, schema ou dicionário foi alterado para tentar satisfazer o gate. A próxima evolução deve ser uma estrutura versionada para os vetores completos, com migração própria validada e sem substituir relações históricas.

## CI comprovado
Workflow: https://github.com/IndiciumFIN/blue-ember-fjord-prairie/actions/runs/43580585116
- Primeira suíte: 526 testes; 518 PASS, 0 FAIL, 8 SKIP.
- TypeScript: 62 PASS, 0 FAIL.
- Plataforma/dicionário: 7 PASS, 0 FAIL.
- Typecheck: PASS.
- **Gate de integração de superfície: FAIL**, bloqueando o CI global e build final.

## Contratos de superfície — riscos, não auto-admitir
`src/routes` contém 53 arquivos, enquanto `registers/canonical/surface-contracts.v2.json` possui 33 entradas. Há 20 arquivos `UNKNOWN_ROUTE`. Outros contratos requerem imports que já não correspondem ao código, incluindo áreas de administração, ferramentas, Vila do Cuidado e templates.

Entre as 20 rotas existe `calculadoras-trabalhistas.tsx`, que deve permanecer fora da projeção de enfermagem. Não inserir automaticamente todas as rotas no contrato como se fossem admitidas. Para cada rota, exigir FIND, classificação de domínio, origem de conteúdo, papel, controle de acesso, destino real, fontes normativas/editoriais e eventuais políticas de publicação.

## Fonte de migração ausente
`migrations/0087_dicionario_candidato.sql` não está no HEAD remoto verificado. A raiz contém 85 SQLs, até `0085_carreira_fundamento.sql`; a publicação experimental `0086_publicacao_teste.sql` fica em `migrations/preview/`. O arquivo 0087 precisa de recuperação byte-exata, revisão dos 454 campos e comprovação de idempotência antes de aplicação; este relatório não infere essas definições.

## Gate de decisão
- Recuperação de evidência R84/R85: PASS TÉCNICO, sem admissão.
- Paridade das FKs escalares: PASS ESTRUTURAL.
- Tuplas compostas no metamodelo: HOLD_TECHNICAL.
- Migração 0087: HOLD_SOURCE.
- Contratos de superfície: FAIL.
- Lincenciamento, claims e homologação clínica: HOLD_HUMAN / NO-GO.

Sequência autorizável: FIND -> política -> validador -> tarefa -> WO -> Kernel -> teste/auditoria -> aprovação independente, sem promover conteúdo clínico automaticamente.

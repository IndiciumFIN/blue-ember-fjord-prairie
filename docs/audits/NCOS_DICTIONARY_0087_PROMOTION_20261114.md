# NCOS — promoção da migration 0087 do dicionário candidato

**Data:** 2026-11-14  
**Repositório:** `IndiciumFIN/blue-ember-fjord-prairie`  
**Status:** correção estrutural validada; plataforma/clinical release **NO-GO**.

## Identidade e origem
- Origem: arquivo original fornecido para recuperação da migration `0087_dicionario_candidato.sql`.
- Tamanho: **53.120 bytes**, 640 linhas, LF no final.
- SHA-256: `544c68326e5972c76da3118044fae35cf0d39804cf1db3b26032551ab22fc773`.
- Git blob SHA-1: `2e84f20919e07bfa74f167837e0411e39049e58c`.
- Cópia para replay isolado: `migrations/candidates/0087_dicionario_candidato.sql`; root promovida: `migrations/0087_dicionario_candidato.sql`. Verificadas como byte-idênticas por SHA de blob Git.
- Commit de integração: `b2e4aee05891955a485b628767490ed1ac37f3f6`.
- Nenhuma branch nova ou PR; integração direta na `main`, conforme a autorização anterior.

## Escopo do SQL e gate de segurança
- 55 entidades candidatas receberam propósitos individuais no dicionário.
- 454 definições de coluna substituem exclusivamente a descrição placeholder; 0 definições mudas após aplicação.
- 5 descrições de PK compostas alinhadas à estrutura física.
- `intake_file.locale` recebe `ref_entity='locale'`, descrição e sintaxe coerentes com a FK.
- Ponteiros `ref_entity` anteriormente nulos são preenchidos somente diante de um único destino físico inequívoco.
- O arquivo executa apenas `UPDATE` em `schema_entity` e `schema_column`, seguido de bloco `DO $$` de validação e falha fechada.
- Não cria ordem do Kernel, não modifica tabelas de conteúdo/claim nem executa publicação de páginas ou admissão clínica. Não altera `content_object.file_kind`.
- Ponteiros manuais de cadeias compostas não são sobrescritos indiscriminadamente.

## Evidências reproduzíveis
1. CI pré-promoção: https://github.com/IndiciumFIN/blue-ember-fjord-prairie/actions/runs/43583098107 .
   - Criado PGLite limpo com as 85 SQLs root anteriores, aplicado o mesmo arquivo 0087 duas vezes; snapshots idênticos após primeira e segunda aplicação.
   - `CANDIDATE_DICTIONARY_0087: PASS_SOURCE_ISOLATED`; 166 entidades, 1.057 colunas, 454 definições, 55 entidades candidatas, 5 PKs, zero `kernel_order`.
   - Fingerprints de 11 tabelas de publicação, governança, clínica e metadados preservados.
2. CI **pós-promoção**: https://github.com/IndiciumFIN/blue-ember-fjord-prairie/actions/runs/43583427531 .
   - 532 testes JS (524 PASS, 8 SKIP, 0 FAIL), 62 TS (62 PASS), 8 testes de plataforma (8 PASS).
   - Teste confere byte-identidade entre raiz e candidato, reaplica a original duas vezes sobre o baseline de 85 SQLs e verifica metadados e dados protegidos.
   - Gate `isolation`, `context`, `publication-structure` PASS.
   - Gate `surface-bindings`: **FAIL intencional** pelos candidatos ainda não admitidos; build final não comprovado no workflow.
3. Catálogo de migrations incluindo 0087: https://github.com/IndiciumFIN/blue-ember-fjord-prairie/actions/runs/43583427572 — PASS.

## Atenção: efeitos em infraestrutura
`package.json` executa `db:migrate` no `build`; `scripts/migrate.mjs` aplica as migrations da raiz à conexão `DATABASE_URL` quando configurada. Assim, a presença do arquivo na `main` pode levar à aplicação **automática** durante um deployment externo. Esta auditoria **não inspecionou banco Neon remoto nem deployment Vercel**, e não declara aplicação remota concluída. Verificar tabela `_migrations`, ambiente de destino, versão do deployment e logs antes de fechar esse gate.

## HOLD / não homologado
- 20 rotas sem admissão canônica: 19 `HOLD_*` e uma `OUT_OF_SCOPE` (trabalhista).
- 13 FKs compostas não integralmente modeladas como tuplas ordenadas.
- Metadados descritos não equivalem a comprovação de ISO/IEC 11179 completa.
- CKO ainda depende de incorporação seletiva, fontes verificadas, direitos e validação humana.
- Nenhuma ordem admitida no Kernel. **Homologação de cálculo clínico: NO-GO.**

**Ordem seguinte recomendada:** conferir o estado da migration em ambiente remoto, corrigir modelagem de FK composta por contrato versionado e tratar cada rota candidada por FIND → política → validador → WO → Kernel → testes/auditoria → admissão independente.

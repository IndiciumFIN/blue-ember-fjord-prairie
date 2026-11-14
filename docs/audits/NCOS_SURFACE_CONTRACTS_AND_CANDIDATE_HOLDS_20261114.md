# Auditoria e correção seletiva — contratos de superfície NCOS
Data: 2026-11-14
Repositório: IndiciumFIN/blue-ember-fjord-prairie
Escopo: enfermagem; contabilidade/WU-TRIB e ferramentas trabalhistas não são admitidas no NCOS.
Estado final pretendido nesta fase: **evidência técnica, não release**.

## Premissas de autoridade
- Arquivo de rota presente no Git **não** equivale a conteúdo publicado, homologado, indexável ou clinicamente seguro.
- `registers/canonical/surface-contracts.v2.json` contém apenas as 33 rotas com contrato anterior.
- `registers/governance/ncos-surface-intake-candidates-20261114.v1.json` é inventário de **20 candidatas não admitidas**: nenhum item transforma o estado em autorizado.
- O audit `scripts/audit-surface-bindings-v2.mjs` só informa `STATIC_PASS_NOT_VISUAL` quando não há achados. Enquanto houver HOLD/OUT_OF_SCOPE, **FAIL é obrigatório**.
- Não alterar regras de acesso, resolver conflitos clínicos por conveniência ou criar assinatura de aprovador sem prova.

## Reconciliação comprovável de código com contrato
O contrato tinha exigências de imports não correspondentes ao código, apesar das rotas estarem na árvore.
Foram atualizadas **somente** as listas `requiredImports` destas 11 rotas:
1. `admin.tsx`: `admin/shell` e guardas de área.
2. `assinante.ferramentas.$slug.tsx`: `source.functions`, componente clínico e guardas.
3. `assinante.tsx`: artigo, comunidade, `source.functions` e guardas.
4. `ferramentas.$slug.tsx`: `source.functions`, shell, renderização e SEO.
5. `kids.$section.tsx`: página editorial/shell, ainda sem publicação.
6. `kids.index.tsx`: página editorial/shell, ainda sem publicação.
7. `modelos.$id.tsx`: `template-catalog`, visões e shell.
8. `modelos.index.tsx`: `template-catalog`, artigo e shell.
9. `pacote.tsx`: `stored`, artigo e shell.
10. `secao.$slug.tsx`: `stored.functions`, seção e shell.
11. `viladocuidado.tsx`: `components/vila-page`.
A alteração **não** muda `role`, `kind`, `templateKind` nem `route-contracts.v1.json`. Essa verificação é estática, não atesta renderização, acessibilidade ou direitos.

## Inventário e política das 20 rotas não contratadas
Inventário baseado no caminho e SHA do blob Git. Para cada rota são preservados escopo, gate e ausência de aprovação.
- 8 em `HOLD_SOURCE`: ausência de fonte/conteúdo admitido.
- 2 em `HOLD_RIGHTS`: direitos editoriais/ativos pendentes.
- 6 em `HOLD_HUMAN`: revisão de finalidade, acesso e curadoria.
- 3 em `HOLD_CLINICAL`: referência clínica, vigilância, ou passagem de plantão sem aprovação clínica.
- 1 `OUT_OF_SCOPE`: `calculadoras-trabalhistas.tsx`. Presença física não autoriza mistura com o escopo de enfermagem.

Script do gate: `scripts/lib/ncos-surface-intake-audit.mjs`. Recusa:
- entrada duplicada, caminho ou hash inválido;
- arquivo ausente ou blob divergente;
- status de admissão atribuído sem verificação;
- caminho não catalogado;
- tentativa de usar o próprio inventário para autorizar conteúdo clínico.

Os resultados `CANDIDATE_ROUTE_HOLD` e `OUT_OF_SCOPE_ROUTE_PRESENT` são deliberadamente **bloqueantes**. Não mudar o script para ignorá-los com o único objetivo de tornar CI verde.

## Páginas provisórias e SEO
As seis rotas `bolsas.tsx`, `concursos.tsx`, `cursos-sus.tsx`, `oportunidades.tsx`, `residencias.tsx`, `vagas.tsx` continham somente o aviso 'Em preparação' mas declaravam `robots: index, follow`. Agora declaram `robots: noindex, nofollow`.
A atualização alterou apenas o sinalizador para buscadores. **Não é controle de autenticação nem prova de retirada de URLs do ar.** Os seis hashes foram reconciliados no inventário e as seis rotas permanecem HOLD_SOURCE.

## Evidência de CI e testes
- CI anterior, contrato atualizado: https://github.com/IndiciumFIN/blue-ember-fjord-prairie/actions/runs/43581494134 — TypeScript, `npm test` e `test:platform` PASS; `surface-bindings` FAIL por 20 candidatos.
- CI com inventário (primeira versão): https://github.com/IndiciumFIN/blue-ember-fjord-prairie/actions/runs/43581684044 — 531 testes JavaScript, 523 PASS, 0 FAIL, 8 SKIP; 62/62 TS, 7/7 plataforma, gate com achados classificados. Uma entrada `concursos.tsx` tinha SHA escrito com 39 dígitos e foi detectada como inválida, não ignorada.
- A atualização `noindex` e o repin substituíram o SHA inválido de `concursos.tsx` por SHA de 40 dígitos retornado pela API GitHub. O teste `scripts/ncos-surface-intake-source.test.mjs` deve comprovar 20 registros, 0 desconhecidos, 0 drift, 0 admitidos, 19 HOLD e 1 OUT_OF_SCOPE no HEAD resultante.

## Pendências (não mitigadas por esta alteração)
- O gate `surface-bindings` precisa de decisões individuais e comprovação de efetiva autoridade antes de integrar qualquer nova rota. Mesmo com hashes coerentes, 20 rotas seguem bloqueadas.
- A migration `migrations/0087_dicionario_candidato.sql` não estava na `main` examinada; recuperar versão original e reexecutar PGLite idempotente, sem recriar 454 definições por suposição.
- FKs: 150 físicas; 137 simples e 13 compostas. Metamodelo de tupla ordenada ainda HOLD_TECHNICAL.
- PK, dados clínicos, direitos, acessibilidade, segurança e admissão do Kernel carecem de avaliação específica.
- A `main` permanece sem proteção; os commits diretos são evidência de execução, mas não constituem segregação de funções.
- Nenhum deploy nem migração de banco foi autorizado/executado nesta rodada.

## Próximas WOs candidatas
| WO candidata | Conteúdo | Critério de conclusão | Estado |
|---|---|---|---|
| SURFACE-01 | Currículo, concursos, vagas, residências, bolsas, oportunidades e cursos | Fontes oficiais e editoriais, dados e direitos por item | HOLD_SOURCE |
| SURFACE-02 | Rotas clínicas de exames, notificação, SBAR | Normativos oficiais, validadores clínicos, auditor independente | HOLD_CLINICAL |
| SURFACE-03 | Vila do Cuidado, pesquisa, estudo e modelos | Separar candidatos, controle de acesso, direitos e teste UX | HOLD_HUMAN |
| SURFACE-04 | Rota trabalhista de outro domínio | Segregar por produto e impedir admissão no NCOS | OUT_OF_SCOPE |
| SURFACE-05 | Captura de visuais e acessibilidade | Testes navegador, WCAG, segurança, responsividade | TODO |
| SOURCE-0087 | Recuperar migration do dicionário por hash | Idempotência em banco limpo e revisão de 454 descrições | HOLD_SOURCE |

**Não promover para DONE nem declarar release clínico com este documento.**

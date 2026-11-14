# Pendências

Medição em 2026-11-01, na main local depois da `0059`, mais o portão das provas no Calculadoras-Smart. Não reabri as branches nem os dois projetos Supabase pausados.

O que esta medição fechou: 106 tabelas e 106 entidades no dicionário, nenhuma entidade sem tabela. `exam_intake` está vazia. Rótulo de interface em inglês, espanhol e francês cobre o português. Não há coluna de paciente nas tabelas novas.

## Decisão ainda sem sim

| Id | Pendência | Evidência | Bloqueia |
|---|---|---|---|
| D1 | Escolher o caminho A ou o C. O B está recusado | Parte 7 | Qualquer carga de prova |
| D2 | Aprovar, ou manter em rascunho, as 16 regras de negócio | As 16 estão `rascunho`, inclusive as 4 de `exam_intake` e as de admissão do kernel | Tratar regra como controle aprovado |

Caminho A: gravar só as cinco provas sem anulação, 240 questões, em `revisao`.
Caminho C: a `0059` passa a aceitar questão anulada sem letra, e só então as outras cinco voltam.
Caminho B, inventar A–E nas onze, continua recusado. As onze têm `annulled = true`, dez com `*` e uma com `X`.

## Prova

| Id | Pendência | Medida |
|---|---|---|
| P1 | Nenhuma prova candidata foi gravada | `exam_intake` 0 |
| P2 | Cinco provas passam o portão estrutural e esperam o sim do caminho A | HCFAMEMA, São José dos Campos técnico, Sorocaba, UNESP, Osasco |
| P3 | Cinco provas continuam barradas enquanto não existir estado `anulada` | 11 questões, números na parte 7 |
| P4 | O restante remoto não é candidato | 40 provas `DRAFT` e 18 `REVIEW_REQUIRED` sem questão. 470 questões só com `C` e `E` estão nesse rascunho |
| P5 | O treino publicado não é o banco de provas | `study_item` tem 5 questões e 6 cartões de template |

## Ferramenta

| Id | Pendência | Medida |
|---|---|---|
| F1 | Registro remoto não entra em `source_tool` | 131 ferramentas com `canonical_promotion_allowed = false` |
| F2 | Capa local publicada continua só nas cinco com fórmula | `apgar`, `braden`, `gotejamento`, `imc`, `morse`. Outras 77 capas existem e não estão publicadas |
| F3 | Contrato de campo remoto não vira `tool_field` | 1.199 campos, 1.152 sem mínimo. Os quatro de Braden são `pacNome`, `pacIdade`, `pacSetor`, `pacData` |
| F4 | Campo de paciente não tem destino | 283 campos `pac*` em 69 ferramentas. Não vão para cookie nem para `tool_field` |

## Idioma e texto

| Id | Pendência | Medida |
|---|---|---|
| I1 | Texto alternativo publicado só em português | 17 imagens. Inglês, espanhol e francês estão em rascunho |
| I2 | Quase toda tradução de página está em rascunho | 1.765 textos publicados em pt-BR. Fora dele, só a `home` em en, es e fr está publicada. Há 2.143 rascunhos nesses outros idiomas e 15 rascunhos em pt-BR |
| I3 | O seletor anuncia en, es e fr numa ferramenta cujo corpo clínico abre em pt-BR | Achado `I18N-HREFLANG`, já conhecido |
| I4 | O teste da mesa exige mais de 3 textos publicados fora do pt-BR | Existem exatamente 3, as três homes. O teste falha por isso |

## Teste e escopo deixado de fora

| Id | Pendência | Medida |
|---|---|---|
| T1 | `0055_intake_fora_do_git.sql` faz o teste de "sem JSON" falhar | A migration não tem coluna `json`. O teste vê a letra `json` no caminho dos arquivos inventariados |
| E1 | Contabilidade CFC não foi promovida | Schema `contabilidade_cfc` e as tabelas `cfc_*` dentro de `public` e `cko_governance` |
| E2 | Excel Inspector não é página do site | 12 páginas `xlf_publication.page`, rascunho, URL `example.invalid` |
| E3 | Dois projetos Supabase não foram lidos | `SOT-10-09-2026` e `auditeduca's Project` estão pausados |
| E4 | Kernel local não tem pedido | `kernel_order` está vazia |

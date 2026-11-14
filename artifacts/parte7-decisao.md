# Parte 7 — decisão, sem carga

Data: 2026-11-01. Nada foi inserido em `exam_intake`. Nenhum enunciado saiu do Supabase. Nenhuma regra saiu de rascunho.

A parte 6 tratou letra vazia como defeito. A proveniência do gabarito muda isso.

## O que as onze letras são

Nas 550 questões das provas `VALIDATED`:

| Fato | Quantidade |
|---|---:|
| Gabarito anulado | 11 |
| Anulada e ainda com letra | 0 |
| Letra vazia sem anulação | 0 |
| Marca oficial `*` | 10 |
| Marca oficial `X` | 1 |

As onze têm `provenance.annulled = true` e `raw_answer` `*` ou `X`. O tipo continua `OFFICIAL_DEFINITIVE` e o status `VALIDATED`. A letra vazia é a anulação, não um furo de extração. Inventar A–E falsificaria o gabarito.

| Prova | Número | Marca | Tema |
|---|---:|---|---|
| EBSERH grupo enfermagem | 36 | `*` | Saúde da Mulher |
| EBSERH técnico | 13 | `*` | Saúde do Trabalhador |
| EBSERH técnico | 14 | `*` | Enfermagem Geral |
| EBSERH técnico | 19 | `*` | Saúde do Trabalhador |
| EBSERH técnico | 59 | `*` | Enfermagem Geral |
| EBSERH técnico, saúde do trabalhador | 13 | `*` | Saúde do Trabalhador |
| EBSERH técnico, saúde do trabalhador | 14 | `*` | Saúde do Trabalhador |
| EBSERH técnico, saúde do trabalhador | 19 | `*` | Saúde do Trabalhador |
| São José dos Campos enfermeiro | 29 | `*` | Saúde do Trabalhador |
| São José dos Campos enfermeiro | 57 | `*` | Enfermagem Geral |
| SANESUL técnico do trabalho | 52 | `X` | Enfermagem Geral |

Os números 13, 14 e 19 coincidem nas duas provas de técnico da EBSERH. A origem do arquivo não é a mesma. Isso não junta os enunciados.

As outras cinco provas não têm anulação. São 240 questões, todas com letra.

## O que a 0059 faz com isso

A migration exige letra em toda questão. Uma anulada barra a prova inteira. Isso está certo para o desenho atual e errado se a anulação for um estado válido.

Não alterei a `0059`.

## Decisão que fica para uma pessoa

Três caminhos. Nenhum foi executado.

| Caminho | Efeito | Estado |
|---|---|---|
| A. Admitir só as cinco provas sem anulação | 240 questões, letra em todas. Continua em `revisao`. Não publica | não executado |
| B. Inventar letra nas onze | Proibido por esta evidência | recusado |
| C. Ensinar a `0059` a guardar `anulada` sem letra, e só então rever as outras cinco | As onze entram como anuladas, não como gabarito | não desenhado |

O caminho B está recusado aqui. A e C dependem de um sim explícito. Status remoto não é esse sim.

A parte 8, se for o caminho A, grava só as cinco provas sem anulação, ainda em `revisao`, com enunciado. Se for o caminho C, muda o portão antes de qualquer carga.

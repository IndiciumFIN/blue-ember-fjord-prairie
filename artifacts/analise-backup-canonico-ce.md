# Análise do backup-canônico-ce

Data: 2026-11-02. Só leitura. Nada foi aplicado.

## O zip está completo

A `part-00` chegou, 5.242.880 bytes, começando em `PK`. Juntada com as partes 01 a 11, o arquivo tem 62.716.391 bytes e 1.535 entradas. A `part-05` duplicada é o mesmo hash e não entrou duas vezes. A `part-03 (1)` é a parte 03.

SHA-256 do zip remontado: `e2f7145967906dfb673514e24e94c7c58c60393e763c5105a0dc41056e372bd2`.

O único efeito da `part-00` é completar `calculadoras-smart-bruto.dump`. Descompactado, tem 47.615.292 bytes, cabeçalho `PGDMP`, e é byte a byte o arquivo que já está em `artifacts/calculadoras-smart-bruto.dump`. SHA-256 dos dois: `d5459c8f5a65ca8a69691e789897873181ae9ed0d80923f089c1cc0899943e36`.

## O que o zip contém

| Pasta | Arquivos | O que é |
|---|---:|---|
| `calculadoras-smart-bruto.dump` | 1 | O dump já medido. Agora comprovado idêntico |
| `conteudo/manifest-v2.jsonl` | 1.804 linhas | Crawl do site no ar, com HTML e texto da página |
| `conteudo/manifest.csv` | 1.820 linhas | O mesmo crawl, sem o HTML |
| `i18n/incoming` | 1.163 | Candidatos de tradução, não publicação |
| `imagens` | 323 | 262 avif de biblioteca, marcas, favicon, 1 PDF |
| `tabelas/00_tabelas_supabase.sql` | 1 | DDL gerado em 2026-11-02. Não executável |

O crawl, por categoria:

| Categoria | Páginas |
|---|---:|
| biblioteca | 1.429 |
| raiz | 266 |
| downloads | 71 |
| sem categoria | 15 |
| en-i18n | 14 |
| blog | 9 |

1.789 páginas responderam HTTP 200. 15 vieram com status 0. 1.456 têm `canonical` preenchido e 348 não. `og_locale` da amostra é `pt_BR`. Isso é cópia do HTML público, não linha canônica.

Os idiomas em `i18n/incoming` são 19, com cerca de 60 arquivos cada. A maior parte é `contracts`. Não substitui os 2.143 rascunhos já medidos na main.

## O DDL não fecha

O cabeçalho diz 432 tabelas em 32 schemas. O arquivo tem 32 `CREATE SCHEMA` e 371 `CREATE TABLE`.

Não roda:

- 263 chamadas `now()` perderam o parêntese de fechamento
- 415 parênteses abertos a mais
- 729 colunas `jsonb`
- o `COMMIT` final está depois de um `CREATE TABLE` quebrado em `xlf_runtime.learning_event`

Aplicar isso na main criaria schemas paralelos (`cko_*`, `xlf_*`, `vdc_ai`, `account_palm`) e ainda deixaria `public.cfc_internal_normative_*`. A main local tem 106 tabelas, todas com entidade no dicionário, e o teste dela recusa JSON.

## O que isto não resolve

Continua valendo a lista de pendências de 2026-11-01.

| Pendência | Efeito deste backup |
|---|---|
| D1, caminho A ou C da prova | Não decide e não grava `exam_intake` |
| D2, 16 regras em rascunho | Não aprova |
| P2–P4, as 10 provas e o rascunho `C`/`E` | O dump é o mesmo já lido. Nada novo |
| F1–F4, ferramentas e campo de paciente | Não promove |
| I1–I4, alt e texto traduzido | O incoming é candidato, não publicação |
| E1, CFC | O schema `contabilidade_cfc` ficou de fora, mas duas tabelas `cfc_internal_*` entraram no SQL de `public` |
| T1, teste da `0055` | Não mexe |

Não promover este zip. A parte que faltava só completa um dump que já tínhamos. O SQL precisa ser reescrito antes de qualquer conversa sobre criar essas 371 tabelas.

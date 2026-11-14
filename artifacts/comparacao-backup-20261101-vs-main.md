# Versão anterior e a main atual

Anterior: `ce-backup-completo-2026-11-01 (1).tar.gz`, SHA-256 `8ec794bf2b0b95000b204a20da02e33945ed21adad90cde7e6c1e671876c24a5`. 5.180 arquivos, 113 MB descompactados.

Atual: a main local, sem `node_modules`, `attachments` nem `artifacts`. 4.796 arquivos.

Nada foi copiado de um lado para o outro.

## Conta

| | Anterior | Atual |
|---|---:|---:|
| Arquivos no mesmo caminho e do mesmo tamanho | 2.474 | 2.474 |
| Mesmo caminho, tamanho diferente | 145 | 145 |
| Só de um lado | 2.561 | 2.177 |

As dependências do `package.json` são as mesmas. Os scripts `audit:*`, `gov:*` e `contracts:generate` existiam como atalho npm na anterior e não estão no `package.json` atual.

## O que a anterior tem e a main não usa

| Pasta | Arquivos | Leitura |
|---|---:|---|
| `_archive` | 1.445 | Cópia antiga de docs, skills, evidência e 11 SQL. Não é a pasta viva |
| `upload/ce-skeleton` | 935 | Esqueleto de admin empacotado, não a área que roda |
| `src` solto | 157 | 116 contratos que saíram de `src/data/contracts`, mais telas monolíticas: `admin-console`, `vila-hub`, `biography-view`, `library-canonical` |
| `.env` | 1 | Está no backup. A main comparada não guarda esse arquivo |

Restaurar a anterior por cima apagaria a main. Também devolveria o `.env`.

## O que a main tem e a anterior não tinha

| Pasta | Arquivos | Leitura |
|---|---:|---|
| `migrations` | 69 SQL | A anterior não tinha `migrations/` na raiz. Tinha 11 SQL dentro de `_archive/migrations` |
| `contracts` | 737 | Os 116 da anterior foram para cá. O restante é contrato que a anterior não carregava na raiz |
| `public` | 286 a mais | Catálogo de biblioteca, anatomia e seringas. Nenhum arquivo de `public` da anterior sumiu |
| `registers`, `docs`, `audit-evidence` | 259 + 119 + 120 | Não estavam na raiz da anterior |
| `src` novo | 293 | `components/admin` (22), `components/site` (19), `components/templates` (15), conteúdo e kernel |

A sequência viva vai de `0001_auth.sql` a `0059_exam_intake.sql`, 59 arquivos. A anterior parava, no arquivo, em `0004_revisao_conteudo.sql`. Esse nome não existe mais: o `0004` atual é `0004_metamodel.sql`. Os SQL de 26/10 e os de vila e simulados continuam, agora em `migrations/candidates` e `migrations/candidate`, não em `_archive`.

## Rotas

A anterior tinha 44 rotas. A main tem 53. Nenhuma rota da anterior saiu. Entraram:

- `blog.index` e `blog.mary-eliza-mahoney`
- `bolsas`, `concursos`, `cursos-sus`, `oportunidades`, `residencias`, `vagas`
- `$.tsx`, a rota que captura o resto

## Arquivos que mudaram de verdade

O mesmo caminho, outro tamanho. Os maiores:

| Arquivo | Anterior | Atual | Leitura |
|---|---:|---:|---|
| `src/lib/tools/catalog.ts` | 286.447 | 18.381 | O catálogo saiu do fonte |
| `src/lib/contract-index.generated.ts` | 36.824 | 102.029 | O índice de contrato cresceu |
| `src/lib/chrome.tsx` | 54.421 | 15.835 | O texto da interface saiu do componente |
| `src/lib/sections.ts` | 22.691 | 3.614 | A seção saiu do fonte |
| `src/lib/nav.ts` | 6.379 | 229 | O menu saiu do fonte |
| `src/lib/source.functions.ts` | 6.276 | 20.781 | A leitura do banco cresceu |
| `src/lib/db.ts` | 5.457 | 10.864 | A abertura do banco cresceu |
| `src/core/governance/kernel.ts` | 6.258 | 5.849 | Mudou, não foi trocado por outro arquivo |

Há outras 68 diferenças em `src`, menores. `kernel.ts` e os testes de importação estão nesse grupo.

## O que não é esta comparação

O zip `backup-canônico-ce` não é uma versão anterior do código. É o dump do Supabase mais o crawl, as imagens e um DDL que não executa. O dump é o mesmo arquivo que já está em `artifacts/`.

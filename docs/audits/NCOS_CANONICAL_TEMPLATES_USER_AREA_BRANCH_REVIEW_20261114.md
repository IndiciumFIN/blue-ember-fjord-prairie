# NCOS — Consolidação canônica de templates, conta e cobertura de ferramentas (14/11/2026)

## Escopo e inventário verificado
- Repositório consultado: `IndiciumFIN/blue-ember-fjord-prairie`, base `main`.
- Antes desta tarefa, duas branches: `main` e `fix/ncos-fk-ordinality-guard-20261114`. Única PR: #1, incorporada via squash `d2643480795e9ff4b41f7ee226e494fea3388ae1` após testes específicos PASS. Os gates globais de fonte/rotas continuam bloqueados.
- ZIP fornecido (`chat-803277ac-d6c0-425f-b51c-5d78538fd2d6.zip`): 496 entradas, incluindo 430 HTMLs, 42 PNGs, 20 MDs. **São referências históricas, não fontes normativas.** Não importar scripts externos, conteúdo licenciado, código de deploy, segredos ou CSS inline de forma indiscriminada.
- DS único existente: `src/styles.css` (tokens), `src/lib/template-contract.ts` (contratos), `src/components/article/article-page.tsx` e famílias em `src/components/templates/`. **Sem DS paralelo e sem alteração de paleta/tipografia.**
- Existentes: 15 componentes em `src/components/templates/`, formulários CKO em `src/lib/admin-form-template-registry.ts`, `/modelos`, `/assinante`, IAM em `src/lib/auth`, assinatura em `src/lib/community.functions.ts`.

## Entrega estrutural nesta branch
1. Registro versionado `canonical-content-families.ts`: checklist, mapa mental, podcast, vídeo, curso e protocolo. Cada família possui identidade única, blocos reutilizáveis e validação de evidência fail-closed; o registro não declara nenhuma publicação aprovada.
2. Renderer `CanonicalContentFamilyView`: usa `ArticlePage`, `Callout` e classes do DS existente; checklist interativo local; mídia ausente nunca é simulada como licenciada; moldes expostos somente na galeria `noindex`.
3. `/conta`: identidade própria de usuário, assinatura e acessos; reaproveita `AreaGuard`, `AreaFrame`, `useCurrentUserState` e `SubscriptionPanel`. `MemberIdentityPanel` também é usado na área do assinante. Sem duplicar cadastro ou persistir dados clínicos.
4. Inventário `clinical-tool-backlog.ts` derivado de 78 candidatos nominais do relatório `REVISAO-FINAL-PENDENCIAS.md` (snapshot de 01/11/2026): 4 calculadoras trabalhistas e 3 recursos editoriais foram excluídos. Dos 71 itens de possível ferramenta clínica, 2 têm runtime candidata (`aldrete`, `exames-laboratoriais`) e **69 não aparecem no catálogo de runtime** desta base. O catálogo separadamente possui 5 ferramentas originais. Isto **não é** inventário exaustivo de todas as ferramentas que o produto deverá oferecer.
5. Tela de diagnóstico em `/modelos/inventario-ferramentas` com busca/filtro, sem links de execução de cálculo não aprovado.
6. Testes de unicidade, vínculo catálogo/renderer, identidade, classificação e veto clínico; incluídos na suíte de plataforma.

## Falhas estruturais e backlog canônico
| Prioridade | Objeto | Evidência | Próxima ação |
| --- | --- | --- | --- |
| P0 | Rotas candidatas | 20 rotas bloqueadas pelo gate `surface-bindings`; CI geral FAIL | FIND por rota → fonte/política → validador → WO → Kernel → testes e decisão humana |
| P0 | Publicação clínica | Nenhuma ordem admitida; homologação NO-GO | Não mudar flags de publicação por efeito colateral |
| P0 | Repositório/ambiente | Nenhum projeto Vercel encontrado vinculado a este repositório nos contextos consultados | Identificar destino, configurar ambiente isolado e testar deploy sem executar migrations remotas |
| P1 | FKs compostas | 13 tuplas ainda não completamente representadas; PR #1 só bloqueia pares falsos | Contrato versionado de tupla ordenada, reconstrução por catálogo físico e teste de divergência |
| P1 | Ferramentas | 69 slugs históricos sem runtime; 2 candidatas e 5 originais | Para cada slug: confrontar corpus normativo/editorial, domínio, aplicabilidade, direitos, fórmula, vetores ouro, CI e aprovação |
| P1 | Templates | Seis famílias novas em condição de molde | Alimentar com conteúdo autoral atomizado, provas de origem e revisão por objeto, sem duplicar DS |
| P1 | Conta/assinante | Área de conta antes era redirect; subscrição já existe sem cobrança | Revisão E2E auth-on, perfis, políticas de banco e separação user/subscriber/admin |
| P2 | Rastreabilidade do backup | Snapshot inclui HTML, PNG e MD históricos | Homologar por hash e origem antes de incorporar qualquer asset |

## Política de liberação
- Publicação de **código estrutural** só após typecheck, testes e revisão dos diffs; não equivale à promoção dos conteúdos.
- Sem deploy de produção neste lote; o comando `npm run build` executa `db:migrate` se `DATABASE_URL` estiver configurada.
- Qualquer novo item clínico exige norma oficial, direitos, aplicabilidade, bibliografia, teste por vetor-ouro, evidência, aprovação humana e gate da plataforma.
- Separar estágios: `TEMPLATE_MOLDE` → `CANDIDATE_CONTENT` → `HOLD_SOURCE|RIGHTS|CLINICAL` → `WO_REVIEW` → `ADMITTED` → `PUBLISHED`. Nesta entrega tudo novo permanece em molde ou diagnóstico.

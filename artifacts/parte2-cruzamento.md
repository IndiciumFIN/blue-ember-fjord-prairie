# Parte 2 — cruzamento sem cópia

Data: 2026-11-01. Fonte remota: Calculadoras-Smart (`pgsybzggewhinaniybiy`), contagem exata. Fonte local: migrations `0001`–`0058`. Nenhuma linha foi copiada.

Escopo: os três homônimos e os schemas de conteúdo `calculadoras_de_enfermagem`, `cko_*`, `public`, mais `xlf_md`, `xlf_publication` e `realtime` só porque os homônimos moram neles. `contabilidade_cfc` ficou de fora de propósito.

## Veredito

Nenhuma tabela remota deste escopo é o mesmo objeto que uma tabela da main. O overlap de nome que sobrou na parte 1 é homonímia. O overlap de coluna no restante é genérico (`id`, `status`, `title`, `created_at`) e não autoriza fusão.

| Disposição | Tabelas | O que significa |
|---|---:|---|
| homonimo_nao_fundir | 3 | Mesmo nome, contrato diferente |
| candidato_revisao_sem_copia | 32 | Conteúdo útil para uma futura admissão governada |
| fora_escopo_cfc | 4 | Contabilidade dentro de `public` / `cko_governance` |
| fora_escopo_plataforma_ou_xlf | 12 | Realtime do Supabase ou Excel Inspector |
| telemetria_nao_conteudo | 9 | Log, scan e saúde de agente |
| vazio | 17 | Zero linhas |
| sem_par_local | 221 | Existe no remoto, sem contrato equivalente na main |

Planilha completa: `parte2-cruzamento.csv`.

## Os três homônimos

### `realtime.subscription` × `public.subscription`

Não fundir. Zero colunas em comum. Zero linhas no remoto.

O remoto é a fila interna do Realtime do Supabase: `id bigint`, `subscription_id uuid`, `entity regclass`, `filters`, `claims jsonb`, `claims_role`. A local é adesão de comunidade: `user_id`, `status` (`pedido` / `ativo` / `recusado`), `updated_at`.

### `xlf_md.locale` × `public.locale`

Não fundir. Zero colunas em comum. Conceito vizinho, chave diferente.

Remoto, 3 linhas, todas `ACTIVE`: `XLF-LOC-PT-BR` (`pt-BR`), `XLF-LOC-EN-US` (`en-US`), `XLF-LOC-UND` (`und`). Não há espanhol. A local é o catálogo do site: `pt-BR`, `en`, `es`, com `label` e `source`.

### `xlf_publication.page` × `public.page`

Não fundir. Só `slug` e `title` coincidem.

As 12 linhas remotas estão `DRAFT` / `DRAFT_NOINDEX`. A URL canônica é `https://example.invalid/excel/revisao/...`. O conteúdo é regra do Finance Inspector (linhas e colunas ocultas de planilha), gerado por `XLF-PUBLICATION-FACTORY-0.1.0`. A local é página editorial do site (`kind`, `lead`, `published`, `piece_id`).

## O que presta para revisão, ainda sem copiar

Nada abaixo está clinicamente aprovado no próprio remoto. `canonical_promotion_allowed` está `false` nas 131 ferramentas. Os 15 temas estão `is_clinically_approved = false` e `crosswalk_status = EM_ANALISE`.

| Objeto remoto | Linhas | Leitura |
|---|---:|---|
| `public.exams` | 68 | Concursos de enfermagem. 33 enfermeiro, 23 técnico, 12 auxiliar. Não é `study_item`. |
| `public.exam_questions` | 2.330 | Enunciado, número, tema. Não é `kernel_claim`. |
| `public.exam_question_options` | 10.240 | Alternativas. |
| `public.exam_answer_keys` | 2.330 | Gabarito. |
| `public.exam_documents` | 185 | Documento-fonte da prova. |
| `public.regulatory_instruments` | 253 | 249 classificados como `OUTRO`. Catálogo sujo, não norma pronta. |
| `public.regulatory_source_bindings` | 502 | Ligação instrumento–fonte. |
| `public.regulatory_acquisition_evidence` | 262 | Evidência de coleta, com SHA-256 e gates. |
| `cko_regulatory.instruments` | 10 | Recorte menor, com emissor e vigência. |
| `cko_regulatory.provisions` | 65 | Dispositivo citável. |
| `cko_evidence.sources` | 157 | Fonte com URI oficial. |
| `cko_evidence.fragments` | 103 | Trecho com hash. |
| `cko_evidence.assertions` / `claims` | 46 / 41 | Afirmação ainda com `human_review_required`. |
| `cko_governance.documents` | 187 | Markdown governado. Maior tipo: 14 `REGULATORY_STANDARD` em baseline, não publicação. |
| `cko_governance.normative_reference_catalog` | 362 | Referência normativa, sem texto integral. |
| `cko_governance.md_tool_registry_v2_candidate` | 131 | 81 com identidade resolvida, 38 em hold de id, 12 sem identidade. Promoção canônica bloqueada em todas. Exemplos: `adicional-noturno` → `/adicional-noturno.html`, `aldrete` → `/aldrete.html`. |
| `cko_governance.field_catalog` | 2.496 | Dicionário de campo, não formulário do site. |
| `cko_master.entities` / `relationships` | 1.164 / 7.558 | Grafo mestre com `canonical_id`. Não é `schema_entity`. |
| `calculadoras_de_enfermagem.theme_inventory` | 15 | Inventário de átomos (547.908 declarados). QA só estrutural. |

`calculadoras_de_enfermagem` inteiro tem 396 linhas em 22 tabelas. É trilha de auditoria e crosswalk do acervo, não o cadastro das calculadoras.

## O que não entra

- Excel Inspector (`xlf_*`): 12 páginas, 108 átomos, 164 linhas de cadastro mestre XLF. Produto diferente.
- CFC: `cfc_relation_resolution_candidates_v1` (2.755), `cfc_strong_relation_candidates_v1` (110), `cfc_internal_normative_extractions` (249), `cfc_internal_normative_chunks` (12). Schema `contabilidade_cfc` nem foi aberto.
- Telemetria: `capetinha_observations` (103.395), `capetinha_scan_runs` (6.893), `change_audit_ledger` (26.940), checagens de saúde de agente (5.185 + 5.185), `knowledge_pack_members` (13.950).

## Parte 3

Contrato de admissão, ainda sem cópia, só para o banco de provas e para o registro de ferramentas: campo remoto, campo local destino, e o que falta para deixar de ser candidato.

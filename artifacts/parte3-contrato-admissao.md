# Parte 3 — contrato de admissão, sem cópia

Data: 2026-11-01. Fonte: Calculadoras-Smart, contagem exata. Destino consultado: migrations `0001`–`0058`. Nenhuma linha saiu do Supabase. Nenhuma tabela nova foi criada na main.

Dois objetos. Os dois continuam candidatos.

## Regra geral

Não escrever o banco de provas em `study_item` / `study_choice`.
Não escrever o registro de ferramentas em `source_tool` / `tool_field`.
O remoto não é aprovação. `VALIDATED` lá não publica aqui. `canonical_promotion_allowed = false` nas 131 ferramentas.

## 1. Banco de provas

### Por que não cabe na tabela atual

`study_item` é um treino publicado: `id`, `kind`, `position`, `prompt`, `detail`, `answer_index`. A alternativa certa é um índice que começa em zero. Não há órgão, ano, banca, nível, especialidade nem prova-mãe.

`study_choice` guarda o texto numa posição que começa em um. Não guarda a letra da banca.

Despejar 2.330 questões ali apaga a prova como objeto e mistura com `SIM-PUB-*`.

### Integridade que já passa

Nas 2.330 questões:

| Prova | Resultado |
|---|---:|
| Questão sem prova | 0 |
| Questão sem alternativa | 0 |
| Questão sem gabarito | 0 |
| Gabarito sem questão | 0 |
| Gabarito apontando letra inexistente | 0 |
| Número de questão repetido na mesma prova | 0 |
| Enunciado vazio | 0 |
| Órgão vazio | 0 |
| Alternativa vazia | 0 |
| Documento sem prova | 0 |
| Mais de um gabarito por questão | 0 |
| Letra maiúscula e minúscula na mesma questão | 0 |

Cada questão tem um gabarito. 1.860 têm cinco alternativas. 470 têm duas.

### Integridade que barra a admissão

| Bloqueio | Medida |
|---|---|
| Prova em `DRAFT` | 40 provas, 1.780 questões `EXTRACTED` |
| Prova em `REVIEW_REQUIRED` sem nenhuma questão | 18 |
| Gabarito marcado `VALIDATED` em questão só `EXTRACTED` | 1.780. O status do gabarito não herda o status da prova |
| Item com só duas letras, e as letras são `C` e `E` | 470 questões, todas em prova `DRAFT`. Quatro desses gabaritos têm letra nula |
| Caixa da letra não é única no acervo | 6.115 maiúsculas, 4.125 minúsculas. Não mistura dentro da questão, mas não é uma chave só |
| Identidade da prova não é órgão + ano + nível | Os dois EBSERH técnico 2025 são provas diferentes: `TIPO1` generalista e saúde do trabalhador |

Só 10 provas estão `VALIDATED`, com 550 questões `VALIDATED` e gabarito `OFFICIAL_DEFINITIVE`. São o único lote que o contrato aceita como candidato. Ainda assim não entra.

As 10, sem o enunciado:

| Órgão | Ano | Nível | Banca | Questões | Chave |
|---|---:|---|---|---:|---|
| EBSERH | 2025 | enfermeiro | FGV | 60 | a chave canônica distingue a prova |
| EBSERH | 2025 | técnico generalista | FGV | 60 | `...TECNICO_ENFERMAGEM\|TIPO1` |
| EBSERH | 2025 | técnico, saúde do trabalhador | FGV | 60 | `...SAUDE_TRABALHADOR\|TIPO1` |
| HCFAMEMA | 2025 | enfermeiro | VUNESP | 50 | SP |
| São José dos Campos | 2025 | enfermeiro | FGV | 70 | SP |
| São José dos Campos | 2025 | técnico | FGV | 60 | SP |
| Sorocaba | 2025 | enfermeiro | VUNESP | 50 | SP |
| SANESUL | 2025 | técnico | Instituto AOCP | 60 | MS |
| UNESP | 2025 | enfermeiro | VUNESP | 40 | SP |
| Osasco | 2026 | técnico | VUNESP | 40 | SP |

### Mapa, se um dia for admitido

Destino proposto, ainda inexistente: `exam_intake`, `exam_question_intake`, `exam_option_intake`, `exam_key_intake`. Situação inicial: `revisao`. Não é `study_item`.

| Remoto | Destino proposto | Regra |
|---|---|---|
| `exams.canonical_key` | `exam_intake.canonical_key` | Identidade. Não usar órgão+ano+nível |
| `exams.id` | `exam_intake.remote_id` | Rastro. Não vira chave local |
| `organization`, `year`, `exam_board`, `state_code` | os mesmos nomes | Cópia literal |
| `nursing_level` | `nursing_level` | `ENFERMEIRO`, `TECNICO`, `AUXILIAR`. Não vira `kind` |
| `role_title`, `specialty`, `exam_date` | os mesmos nomes | O nível sozinho não separa as duas EBSERH |
| `exams.status` | `remote_status` | Não vira `publicado` |
| `exam_questions.statement` | `prompt` | Não vai para `study_item.prompt` nesta fase |
| `question_number` | `position` | Ordem na prova. Não é o índice da resposta |
| `subject`, `topic`, `subtopic` | os mesmos nomes | Não se deduzem do enunciado |
| `option_key` | `letter` | Guardar a original e uma forma `upper(letter)` |
| `option_text` | `label` | |
| `ordinal` | `position` | Começa onde a banca começou. Não recontar do zero |
| `correct_option_key` | `correct_letter` | Tem de existir em `letter` da mesma questão |
| `answer_key_type` | `key_type` | `OFFICIAL_DEFINITIVE` é o único tipo aceitável no lote candidato |
| `provenance` | `provenance` | Evidência de extração. Não é aprovação humana |

`answer_index` da main não recebe este gabarito. Se no futuro alguém precisar do índice, ele é a posição da letra certa menos um, e isso é conta de leitura, não coluna de origem.

### Portão para sair de candidato

Uma prova só deixa de ser candidato quando, ao mesmo tempo:

1. `remote_status = VALIDATED` e toda questão dessa prova está `VALIDATED`.
2. Toda questão tem no mínimo as alternativas que a banca publicou. Item com só `C` e `E` não passa.
3. A letra do gabarito existe, não é nula, e a caixa foi normalizada sem perder a original.
4. `canonical_key` é única no lote.
5. Uma pessoa, não o kernel sozinho, registra a aprovação. O status remoto não substitui essa pessoa.

Hoje o portão 1 deixa passar só as 10 provas. Os portões 4 e 5 não foram executados. Por isso nada entra.

## 2. Registro de ferramentas

### Por que não cabe na tabela atual

`source_tool` exige `slug`, `kind`, `title`, `lead`, `published`. O registro remoto não tem título nem lead. A capa local já nasce de `content_text` em pt-BR. O remoto não pode reescrever essa capa.

`tool_field` exige `label`, `unit`, `min_value`, `max_value` e `step` numéricos e obrigatórios. No remoto, mínimo e máximo são texto, e faltam em 1.152 e 1.184 dos 1.199 campos. Unidade falta em 1.077. Os quatro campos de `braden` são `pacNome`, `pacIdade`, `pacSetor`, `pacData`: identificação, não os critérios da escala. Isso não é `tool_field`.

### O que o registro remoto de fato prova

131 linhas. `canonical_promotion_allowed` é falso em todas. `field_count` bate com o contrato de campo onde há campo: 0 divergências. 18 ferramentas não têm campo nenhum.

| Situação | Ferramentas |
|---|---:|
| Identidade resolvida e com rota | 81 |
| Identidade recuperada, sem rota | 38 |
| Identidade sem resolver, sem rota | 12 |
| Binding ainda `CANDIDATE` | 64 |
| Binding de registro legado | 38 |
| Sem binding | 12 |
| Checker passou e ainda há hold a jusante | 11 |
| Sem campo, marcado `N/A` | 6 |

As 11 com checker não estão liberadas. Sete delas têm todos os campos num status `PASS_*` e, mesmo assim, o binding é `FIELD_BINDING_CHECKER_PASS_DOWNSTREAM_HOLDS`: `apgar`, `cries`, `downes`, `flacc`, `nips`, `pews`, `silverman`. Cada uma ainda carrega campo de paciente. Promoção continua falsa.

`braden`, `morse`, `imc`, `gotejamento` e `adicional-noturno` estão em `FIELD_BINDING_CANDIDATE`. Não entram no grupo dos sete.

Campos `pac*` : 283, em 69 ferramentas. Não têm destino. Não vão para cookie, não vão para `tool_field`, não vão para uma ficha de paciente nesta fase.

### Mapa do que pode ser comparado, não copiado

| Remoto | Local já existente | Regra |
|---|---|---|
| `tool_slug` | `source_tool.slug` | Só compara. Não cria linha |
| `route` | caminho do instrumento | A rota `/braden.html` não preenche `title` nem `lead` |
| `identity_status` | nenhum | `IDENTITY_RESOLVED` é necessário e não é suficiente |
| `field_count` | contagem de `tool_field` | Conferência. Os campos remotos de paciente não entram na conta local |
| `canonical_promotion_allowed` | nenhum | Falso barra qualquer escrita |
| `field_name` clínico | `tool_field.id` | Só depois de separar `pac*` e de ter mínimo, máximo e passo numéricos |
| `unit_system_ref` | `tool_field.unit` | Não é a mesma coisa. `UCUM 2.2` não é a unidade do campo |
| `min_value_text`, `max_value_text`, `step_value_text` | `min_value`, `max_value`, `step` | Só se os três forem número e `min <= max`. Hoje quase todos falham |

### Portão para sair de candidato

Uma ferramenta só deixa de ser candidato quando, ao mesmo tempo:

1. `canonical_promotion_allowed` vira verdadeiro por decisão humana, não por este contrato.
2. `identity_status = IDENTITY_RESOLVED` e a rota não é vazia.
3. A capa (`title`, `lead`) continua vindo da main. O remoto não a substitui.
4. Campo `pac*` fica fora de `tool_field`.
5. Cada campo clínico tem mínimo, máximo e passo numéricos, ou é escolha com lista fechada. Texto de hold não vale.
6. O binding deixa de terminar em `HOLDS`.

Hoje o portão 1 fecha as 131. Nada é escrito.

## O que esta parte não fez

Não criou tabela. Não copiou as 10 provas. Não marcou ferramenta como publicada. Não tratou CFC, Excel Inspector nem telemetria.

A parte 4, se for pedida, é só o desenho vazio das quatro tabelas de intake da prova, sem `insert` e sem ligar no Supabase. A ferramenta continua só como comparação de slug.

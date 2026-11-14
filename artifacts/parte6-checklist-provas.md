# Parte 6 — checklist das 10 provas, sem carga

Data: 2026-11-01. Fonte: Calculadoras-Smart, só provas com `status = VALIDATED`. Destino: `exam_intake` da migration `0059`. Nenhuma linha foi inserida. Nenhum enunciado foi copiado para este arquivo.

O portão estrutural é o da `0059`: prova e questão `VALIDATED`, cinco letras de A a E, gabarito `OFFICIAL_DEFINITIVE` com letra não vazia, chave canônica única. A aprovação humana não foi executada. Por isso as cinco que passam o estrutural também ficam de fora.

## Lote

| Conferência | Resultado |
|---|---:|
| Provas | 10 |
| Questões validadas | 550 |
| Chave canônica repetida | 0 |
| Número repetido na mesma prova | 0 |
| Letra maiúscula e minúscula na mesma questão | 0 |
| Questão com menos de 4 letras | 0 |
| Par só `C`/`E` | 0 |
| Enunciado vazio | 0 |
| Letra fora de A–E | 0 |
| Gravadas em `exam_intake` | 0 |

O defeito das 470 questões só com `C` e `E` continua no rascunho. Não está neste lote.

## Quem passa o estrutural

Cinco provas, 240 questões. Todas com 5 letras e gabarito completo. Não foram gravadas.

| Prova | Questões |
|---|---:|
| `2025\|VUNESP\|HCFAMEMA\|ENFERMEIRO` | 50 |
| `2025\|FGV\|SAO_JOSE_DOS_CAMPOS_SP\|TECNICO_ENFERMAGEM\|TIPO1` | 60 |
| `2025\|VUNESP\|SOROCABA_SP\|ENFERMEIRO` | 50 |
| `2025\|VUNESP\|UNESP\|ENFERMEIRO_SAUDE_MENTAL` | 40 |
| `2026\|VUNESP\|OSASCO_SP\|TECNICO_ENFERMAGEM_TRABALHO` | 40 |

## Quem o portão barra

Cinco provas. O remoto marca o gabarito como `OFFICIAL_DEFINITIVE` e `VALIDATED`, mas a letra está vazia. A `0059` não aceita letra nula e não aceita prova pela metade: uma questão sem letra barra a prova inteira.

| Prova | Sem letra | Números |
|---|---:|---|
| `2025\|FGV\|EBSERH\|GRUPO_ENFERMAGEM\|TIPO1` | 1 | 36 |
| `2025\|FGV\|EBSERH\|TECNICO_ENFERMAGEM\|TIPO1` | 4 | 13, 14, 19, 59 |
| `2025\|FGV\|EBSERH\|TECNICO_ENFERMAGEM_SAUDE_TRABALHADOR\|TIPO1` | 3 | 13, 14, 19 |
| `2025\|FGV\|SAO_JOSE_DOS_CAMPOS_SP\|ENFERMEIRO\|TIPO1` | 2 | 29, 57 |
| `2025\|INSTITUTO_AOCP\|SANESUL\|TECNICO_ENFERMAGEM_TRABALHO` | 1 | 52 |

Os números 13, 14 e 19 aparecem nas duas provas de técnico da EBSERH. Isso não prova que o enunciado seja o mesmo. O enunciado não foi lido para este checklist.

## O que não fechou

Aprovação humana: não executada nas 10. Status remoto não substitui essa pessoa.

A parte 7, se for pedida, ainda não grava as cinco. É a lista do que uma pessoa teria de decidir: admitir as cinco inteiras, ou reparar as onze letras antes de olhar de novo as outras cinco.

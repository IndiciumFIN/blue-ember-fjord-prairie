# Documento interno de arredondamento

Este texto é nosso. Ele cita metadados públicos e o procedimento que o motor executa. Não reproduz cláusula da ABNT, da IEEE nem de nenhuma ISO.

## Metadados

| Identificador | Nome público | Domínio | Direito registrado | Prioridade |
|---|---|---|---|---|
| STD-ABNT-NBR5891 | ABNT NBR 5891:2014 | Arredondamento | Uso interno | P0 |
| STD-IEEE-754 | IEEE 754-2019 | Aritmética de máquina | Só metadado | P1 |

O cálculo usa este documento. Não há depósito nem indicador de texto licenciado.

A IEEE 754 não é critério desta fase.

## Procedimento que o motor executa

Um número só entra se for finito.

A redução de casas usa o texto decimal do conversor interno.

Se o primeiro dígito descartado é menor que 5, o último dígito conservado fica.

Se é maior que 5, o último dígito conservado sobe.

Se é 5 e só há zeros depois, o último dígito conservado fica par.

Se é 5 e há outro dígito diferente de zero depois, o último dígito conservado sobe.

Valor de exame digitado não passa por este procedimento. Escore de escala inteiro passa.

O único atributo executado é roundTiesToEven. roundTiesToAway, roundTowardPositive, roundTowardNegative e roundTowardZero não são executados. Formato e exceção da IEEE 754 não são implementados. Isso não cumpre essa norma.

## O que este documento não faz

Não substitui o texto licenciado. Não certifica o produto. Não altera o direito registrado em `fundamento`.

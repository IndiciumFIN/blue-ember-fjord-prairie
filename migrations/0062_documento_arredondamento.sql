-- Documento interno do arredondamento. Metadados públicos e o procedimento do motor. Não copia cláusula.

insert into governance_item (id, kind, title, body)
values (
  'politica-arredondamento-interno',
  'politica',
  'Documento interno de arredondamento',
  '[[sec:proposito]]
Este texto é nosso. Ele cita metadados públicos e o procedimento que o motor executa. Não reproduz cláusula da ABNT, da IEEE nem de nenhuma ISO.
[[sec:metadados]]
STD-ABNT-NBR5891, nome público ABNT NBR 5891:2014, domínio Arredondamento, direito Uso interno, prioridade P0. STD-IEEE-754, nome público IEEE 754-2019, domínio Aritmética de máquina, direito Só metadado, prioridade P1. O corpo licenciado não está depositado.
[[sec:procedimento]]
Um número só entra se for finito. A redução de casas usa o texto decimal do conversor interno. Se o primeiro dígito descartado é menor que 5, o último dígito conservado fica. Se é maior que 5, o último dígito conservado sobe. Se é 5 e só há zeros depois, o último dígito conservado fica par. Se é 5 e há outro dígito diferente de zero depois, o último dígito conservado sobe. Valor de exame digitado não passa por este procedimento.
[[sec:excecao]]
Não há exceção para copiar o texto licenciado. Este documento não certifica o produto.'
)
on conflict (id) do nothing;

update fundamento
set support_id = 'politica-arredondamento-interno'
where id in ('STD-ABNT-NBR5891', 'STD-IEEE-754');

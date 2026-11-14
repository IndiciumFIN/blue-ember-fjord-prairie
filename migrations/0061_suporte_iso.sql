-- Documento interno das normas citadas. Não copia cláusula. Não certifica.

insert into governance_item (id, kind, title, body)
values (
  'politica-iso-suporte',
  'politica',
  'Documento interno das normas citadas',
  '[[sec:proposito]]
Este texto é nosso. Ele ocupa o lugar da cláusula protegida por direito autoral e não a reproduz.
[[sec:objetivos]]
Cada identificador em fundamento ou tem este documento, ou fica explícito que só há metadado.
[[sec:requisitos]]
STD-ISO-27001 usa politica-27001 e politica-acesso: a escrita lê a sessão, não um id enviado pelo cliente, e a publicação com autenticação desligada não grava. STD-ISO-27002 usa a matriz de papéis do código, que separa quem aprova de quem executa. STD-ISO-25010 usa politica-25010: a prova existente é o motor das cinco ferramentas e a migration repetida. STD-ISO-31000 usa a regra que segura o pacote quando falta o plano de tratamento. STD-ISO-9001, STD-ISO-38500 e as demais fichas continuam só metadado até nascer outro rascunho.
[[sec:melhoria]]
Ficha sem obrigação interna aparece como só metadado. A tela não declara a norma cumprida.
[[sec:papeis]]
O administrador escreve. Outra pessoa aprova. Este item nasce em rascunho.
[[sec:excecao]]
Não há exceção para copiar o texto da norma.
[[sec:consequencia]]
Sem este documento, o código não afirma conformidade.
[[sec:revisao]]
Rever quando entrar outro identificador ou quando uma política citada mudar.'
)
on conflict (id) do nothing;

alter table fundamento add column if not exists support_id text references governance_item (id);

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values ('fundamento', 'support_id', 'texto', false, false, 'governance_item', 'Documento interno que sustenta o identificador. Não é a cláusula.', 'id de governance_item', null)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values ('governance_item', 'normas', 'fundamento', '1:N', 'id', 'support_id', 'Um documento interno sustenta várias fichas. Não é a cláusula.')
on conflict (from_entity, name) do nothing;

insert into fundamento (id, name, domain, right_name, priority, support_id)
values
  ('STD-ISO-27001', 'ISO/IEC 27001:2022', 'Segurança da informação', 'Só metadado', 'P0', 'politica-iso-suporte'),
  ('STD-ISO-27002', 'ISO/IEC 27002:2022', 'Controles de segurança', 'Só metadado', 'P0', 'politica-iso-suporte'),
  ('STD-ISO-27701', 'ISO/IEC 27701:2025', 'Privacidade', 'Só metadado', 'P1', 'politica-iso-suporte'),
  ('STD-ISO-42001', 'ISO/IEC 42001:2023', 'Gestão de inteligência artificial', 'Só metadado', 'P1', 'politica-iso-suporte')
on conflict (id) do nothing;

update fundamento
set support_id = 'politica-iso-suporte'
where support_id is null
  and (id like 'STD-ISO-%' or id like 'WATCH-ISO-%');

-- Elemento de metadado. Liga coluna, domínio, especificação e documento interno. Não copia cláusula e não aprova.

create table if not exists schema_domain (
  id text primary key,
  definition text not null
);

insert into schema_domain (id, definition)
select distinct domain, 'Domínio já usado por um termo.'
from schema_term
on conflict (id) do nothing;

insert into schema_domain (id, definition)
values
  ('member_role', 'Papel gravado na pessoa.'),
  ('subscription_status', 'Estado do pedido de assinatura.'),
  ('governance_status', 'Estado do documento interno.'),
  ('formula_method', 'Método interpretado pelo motor.')
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'schema_term_domain_fkey') then
    alter table schema_term
      add constraint schema_term_domain_fkey foreign key (domain) references schema_domain (id);
  end if;
end $$;

insert into schema_term (domain, code, label, definition)
values
  ('member_role', 'subscriber', 'Assinante', 'Valor de member.role. Não escreve a fonte.'),
  ('member_role', 'admin', 'Administrador', 'Valor de member.role. É o único papel que grava.'),
  ('subscription_status', 'pedido', 'Pedido', 'Assinatura pedida e ainda não aceita.'),
  ('subscription_status', 'ativo', 'Ativo', 'Assinatura aceita.'),
  ('subscription_status', 'recusado', 'Recusado', 'Assinatura recusada.'),
  ('governance_status', 'rascunho', 'Rascunho', 'Documento interno ainda sem aprovador.'),
  ('governance_status', 'aprovado', 'Aprovado', 'Documento interno aprovado por uma pessoa.'),
  ('formula_method', 'soma', 'Soma', 'Soma dos critérios.'),
  ('formula_method', 'gotejamento', 'Gotejamento', 'Volume, tempo e fator.'),
  ('formula_method', 'imc', 'IMC', 'Peso dividido pelo quadrado da altura.'),
  ('formula_method', 'exame', 'Exame', 'Valor informado, sem redução.')
on conflict (domain, code) do nothing;

insert into governance_item (id, kind, title, body)
values (
  'politica-metadado',
  'politica',
  'Documento interno do elemento de metadado',
  'Este texto é nosso. Uma coluna descrita em schema_column é um elemento. O elemento pode ter um domínio em schema_domain, uma especificação em data_specification e este documento. STD-ISO-11179-1, STD-ISO-11179-3 e STD-ISO-11179-31 ficam como identificador. A cláusula não entra. Este item nasce em rascunho.'
)
on conflict (id) do nothing;

update fundamento
set support_id = 'politica-metadado'
where id in ('STD-ISO-11179-1', 'STD-ISO-11179-3', 'STD-ISO-11179-31');

create table if not exists metadata_element (
  entity text not null,
  name text not null,
  domain_id text references schema_domain (id),
  specification_id text references data_specification (id),
  support_id text not null references governance_item (id),
  primary key (entity, name),
  foreign key (entity, name) references schema_column (entity, name)
);

insert into metadata_element (entity, name, domain_id, specification_id, support_id)
select
  column_row.entity,
  column_row.name,
  case
    when column_row.entity = 'member' and column_row.name = 'role' then 'member_role'
    when column_row.entity = 'subscription' and column_row.name = 'status' then 'subscription_status'
    when column_row.entity = 'governance_item' and column_row.name = 'status' then 'governance_status'
    when column_row.entity = 'kernel_order' and column_row.name = 'status' then 'admission_status'
    when column_row.entity = 'tool_formula' and column_row.name = 'method' then 'formula_method'
    else null
  end,
  specification.id,
  'politica-metadado'
from schema_column as column_row
left join data_specification as specification
  on specification.entity = column_row.entity
 and specification.characteristic = column_row.name
on conflict (entity, name) do nothing;

insert into schema_entity (name, layer_id, primary_key, purpose, links)
values
  ('schema_domain', 'processo', 'id', 'Domínio fechado de um elemento. Não é a cláusula da norma.', ''),
  ('metadata_element', 'processo', 'entity + name', 'Coluna descrita, com domínio, especificação e documento interno.', 'entity + name → schema_column')
on conflict (name) do nothing;

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values
  ('schema_domain', 'id', 'texto', true, true, null, 'Identidade do domínio.', 'texto', null),
  ('schema_domain', 'definition', 'texto', true, false, null, 'O que o domínio contém.', 'texto', null),
  ('metadata_element', 'entity', 'texto', true, true, 'schema_entity', 'Tabela do elemento.', 'nome de schema_entity', null),
  ('metadata_element', 'name', 'texto', true, true, null, 'Coluna do elemento.', 'nome de schema_column', null),
  ('metadata_element', 'domain_id', 'texto', false, false, 'schema_domain', 'Domínio fechado, quando a coluna só aceita termos.', 'id de schema_domain', null),
  ('metadata_element', 'specification_id', 'texto', false, false, 'data_specification', 'Especificação da característica, se já existe.', 'id de data_specification', null),
  ('metadata_element', 'support_id', 'texto', true, false, 'governance_item', 'Documento interno. Não é a cláusula.', 'id de governance_item', null)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values
  ('schema_domain', 'termos', 'schema_term', '1:N', 'id', 'domain', 'Um domínio tem um ou mais termos.'),
  ('schema_column', 'elemento', 'metadata_element', '1:1', 'name', 'name', 'Uma coluna descrita tem no máximo um elemento. A chave completa é entity + name.'),
  ('governance_item', 'elementos', 'metadata_element', '1:N', 'id', 'support_id', 'Um documento interno sustenta vários elementos.')
on conflict (from_entity, name) do nothing;

-- Camada 2, Acesso. Descreve as tabelas que já existem. Não muda papel nem admite pedido.

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values
  ('member', 'user_id', 'texto', true, true, 'user', 'Pessoa deste papel. Uma pessoa, um papel.', 'id de user', null),
  ('member', 'role', 'texto', true, false, null, 'Papel gravado. Não é o aprovador do kernel.', 'subscriber ou admin', null),
  ('member', 'created_at', 'instante', true, false, null, 'Quando o papel foi gravado.', 'instante', null),
  ('subscription', 'user_id', 'texto', true, true, 'user', 'Pessoa deste pedido. Uma pessoa, um pedido.', 'id de user', null),
  ('subscription', 'status', 'texto', true, false, null, 'Estado do pedido de assinatura.', 'pedido, ativo ou recusado', null),
  ('subscription', 'updated_at', 'instante', true, false, null, 'Quando o pedido foi alterado.', 'instante', null),
  ('community_post', 'id', 'texto', true, true, null, 'Identidade do recado.', 'texto', null),
  ('community_post', 'user_id', 'texto', true, false, 'user', 'Pessoa que escreveu o recado.', 'id de user', null),
  ('community_post', 'body', 'texto', true, false, null, 'Texto do recado.', 'texto', null),
  ('community_post', 'hidden', 'booleano', true, false, null, 'Se o recado está oculto.', 'booleano', null),
  ('community_post', 'created_at', 'instante', true, false, null, 'Quando o recado foi escrito.', 'instante', null)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values
  ('user', 'papel', 'member', '1:1', 'id', 'user_id', 'Uma pessoa tem no máximo um papel.'),
  ('user', 'assinatura', 'subscription', '1:1', 'id', 'user_id', 'Uma pessoa tem no máximo um pedido de assinatura.'),
  ('user', 'recados', 'community_post', '1:N', 'id', 'user_id', 'Uma pessoa tem zero ou mais recados.')
on conflict (from_entity, name) do nothing;

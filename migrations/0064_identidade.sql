-- Camada 1, Identidade. Descreve as tabelas que já existem. Não cria conta nem aprova pedido.

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values
  ('user', 'id', 'texto', true, true, null, 'Identidade da pessoa.', 'texto', null),
  ('user', 'name', 'texto', true, false, null, 'Nome mostrado da pessoa.', 'texto', null),
  ('user', 'email', 'texto', true, false, null, 'E-mail único da pessoa.', 'texto', null),
  ('user', 'emailVerified', 'booleano', true, false, null, 'Se o e-mail foi verificado.', 'booleano', null),
  ('user', 'image', 'texto', false, false, null, 'Imagem opcional.', 'texto', null),
  ('user', 'createdAt', 'instante', true, false, null, 'Quando a pessoa foi registrada.', 'instante', null),
  ('user', 'updatedAt', 'instante', true, false, null, 'Quando a pessoa foi alterada.', 'instante', null),
  ('session', 'id', 'texto', true, true, null, 'Identidade da sessão.', 'texto', null),
  ('session', 'expiresAt', 'instante', true, false, null, 'Quando a sessão expira.', 'instante', null),
  ('session', 'token', 'texto', true, false, null, 'Segredo da sessão. Não entra em página.', 'texto', null),
  ('session', 'createdAt', 'instante', true, false, null, 'Quando a sessão abriu.', 'instante', null),
  ('session', 'updatedAt', 'instante', true, false, null, 'Quando a sessão foi alterada.', 'instante', null),
  ('session', 'ipAddress', 'texto', false, false, null, 'Endereço registrado na sessão.', 'texto', null),
  ('session', 'userAgent', 'texto', false, false, null, 'Agente registrado na sessão.', 'texto', null),
  ('session', 'userId', 'texto', true, false, 'user', 'Pessoa dona da sessão.', 'id de user', null),
  ('account', 'id', 'texto', true, true, null, 'Identidade do vínculo com o provedor.', 'texto', null),
  ('account', 'accountId', 'texto', true, false, null, 'Identidade no provedor.', 'texto', null),
  ('account', 'providerId', 'texto', true, false, null, 'Provedor da entrada.', 'texto', null),
  ('account', 'userId', 'texto', true, false, 'user', 'Pessoa dona deste vínculo.', 'id de user', null),
  ('account', 'accessToken', 'texto', false, false, null, 'Segredo do provedor. Não entra em página.', 'texto', null),
  ('account', 'refreshToken', 'texto', false, false, null, 'Segredo de renovação. Não entra em página.', 'texto', null),
  ('account', 'idToken', 'texto', false, false, null, 'Segredo de identidade. Não entra em página.', 'texto', null),
  ('account', 'accessTokenExpiresAt', 'instante', false, false, null, 'Validade do segredo de acesso.', 'instante', null),
  ('account', 'refreshTokenExpiresAt', 'instante', false, false, null, 'Validade do segredo de renovação.', 'instante', null),
  ('account', 'scope', 'texto', false, false, null, 'Escopo concedido pelo provedor.', 'texto', null),
  ('account', 'password', 'texto', false, false, null, 'Segredo local. Não entra em página.', 'texto', null),
  ('account', 'createdAt', 'instante', true, false, null, 'Quando o vínculo foi criado.', 'instante', null),
  ('account', 'updatedAt', 'instante', true, false, null, 'Quando o vínculo foi alterado.', 'instante', null),
  ('verification', 'id', 'texto', true, true, null, 'Identidade do código.', 'texto', null),
  ('verification', 'identifier', 'texto', true, false, null, 'Destino do código. Não é o id da pessoa.', 'texto', null),
  ('verification', 'value', 'texto', true, false, null, 'Código. Não entra em página.', 'texto', null),
  ('verification', 'expiresAt', 'instante', true, false, null, 'Quando o código expira.', 'instante', null),
  ('verification', 'createdAt', 'instante', true, false, null, 'Quando o código foi criado.', 'instante', null),
  ('verification', 'updatedAt', 'instante', true, false, null, 'Quando o código foi alterado.', 'instante', null)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values
  ('user', 'sessoes', 'session', '1:N', 'id', 'userId', 'Uma pessoa tem zero ou mais sessões.'),
  ('user', 'contas', 'account', '1:N', 'id', 'userId', 'Uma pessoa tem zero ou mais vínculos de provedor.')
on conflict (from_entity, name) do nothing;

update schema_entity
set links = 'Não aponta para user. identifier é o destino do código, não a pessoa.'
where name = 'verification';

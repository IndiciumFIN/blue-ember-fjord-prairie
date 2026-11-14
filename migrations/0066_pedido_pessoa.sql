-- O pedido aponta para a pessoa. Não admite ordem e não abre a camada 3.

do $$
declare
  orphans integer;
begin
  if to_regclass('public.kernel_order') is not null and to_regclass('public.user') is not null
     and not exists (select 1 from pg_constraint where conname = 'kernel_order_owner_user_fkey') then
    select count(*) into orphans from kernel_order
     where owner_id is not null
       and not exists (select 1 from "user" where "user".id = kernel_order.owner_id);
    if orphans = 0 then
      alter table kernel_order
        add constraint kernel_order_owner_user_fkey foreign key (owner_id) references "user" (id);
    end if;
  end if;

  if to_regclass('public.kernel_order') is not null and to_regclass('public.user') is not null
     and not exists (select 1 from pg_constraint where conname = 'kernel_order_approver_user_fkey') then
    select count(*) into orphans from kernel_order
     where approver_id is not null
       and not exists (select 1 from "user" where "user".id = kernel_order.approver_id);
    if orphans = 0 then
      alter table kernel_order
        add constraint kernel_order_approver_user_fkey foreign key (approver_id) references "user" (id);
    end if;
  end if;
end $$;

update schema_column
set ref_entity = 'user',
    definition = 'Pessoa que pede. Aponta para user. Não pode ser quem aprova.',
    syntax = 'id de user, diferente de approver_id'
where entity = 'kernel_order' and name = 'owner_id';

update schema_column
set ref_entity = 'user',
    definition = 'Pessoa que aprova. Aponta para user. Não pode ser kernel nem o dono.',
    syntax = 'id de user, diferente de kernel e de owner_id'
where entity = 'kernel_order' and name = 'approver_id';

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values
  ('user', 'pedidos', 'kernel_order', '1:N', 'id', 'owner_id', 'Uma pessoa pode abrir vários pedidos. O papel não é a chave.'),
  ('user', 'aprovacoes', 'kernel_order', '1:N', 'id', 'approver_id', 'Uma pessoa pode aprovar vários pedidos. Não aprova o próprio.')
on conflict (from_entity, name) do nothing;

update policy_rule
set subject_role = 'subscriber'
where subject_role = 'assinante';

update schema_column
set syntax = 'admin, subscriber ou agente'
where entity = 'policy_rule' and name = 'subject_role';

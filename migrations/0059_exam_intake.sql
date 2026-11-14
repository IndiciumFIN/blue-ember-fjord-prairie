-- Intake de prova, vazio. Nao copia as provas remotas.
-- Nao liga no Supabase. Nao cria study_item nem tool_field.
-- Campo de paciente nao tem coluna.
-- A situacao so pode ser revisao. Este desenho nao publica.

create table if not exists exam_intake (
  id text primary key,
  remote_id text not null unique,
  canonical_key text not null unique check (btrim(canonical_key) <> ''),
  organization text not null check (btrim(organization) <> ''),
  year integer not null check (year between 1990 and 2100),
  exam_board text not null check (btrim(exam_board) <> ''),
  state_code text,
  nursing_level text not null check (nursing_level in ('ENFERMEIRO', 'TECNICO', 'AUXILIAR')),
  role_title text,
  specialty text,
  exam_date date,
  remote_status text not null check (remote_status = 'VALIDATED'),
  provenance text not null default '',
  situacao text not null default 'revisao' check (situacao = 'revisao')
);

create table if not exists exam_question_intake (
  id text primary key,
  exam_id text not null references exam_intake (id),
  remote_id text not null unique,
  position integer not null check (position > 0),
  prompt text not null check (btrim(prompt) <> ''),
  subject text not null default '',
  topic text not null default '',
  subtopic text not null default '',
  remote_status text not null check (remote_status = 'VALIDATED'),
  unique (exam_id, position)
);

create table if not exists exam_option_intake (
  question_id text not null references exam_question_intake (id),
  position integer not null check (position > 0),
  letter text not null,
  letter_norm text not null,
  label text not null check (btrim(label) <> ''),
  primary key (question_id, letter_norm),
  unique (question_id, position),
  check (letter_norm = upper(letter)),
  check (letter_norm in ('A', 'B', 'C', 'D', 'E'))
);

create table if not exists exam_key_intake (
  question_id text primary key references exam_question_intake (id),
  correct_letter text not null,
  correct_letter_norm text not null,
  key_type text not null check (key_type = 'OFFICIAL_DEFINITIVE'),
  remote_key_status text not null default '',
  check (correct_letter_norm = upper(correct_letter)),
  check (correct_letter_norm in ('A', 'B', 'C', 'D', 'E')),
  foreign key (question_id, correct_letter_norm)
    references exam_option_intake (question_id, letter_norm)
);

-- Fecha no commit. Uma prova so sobrevive com questao, gabarito e ao menos
-- quatro letras. O par C/E sozinho, visto no rascunho remoto, nao entra.
create or replace function exam_intake_fechar()
returns trigger
language plpgsql
as $$
declare
  prova record;
  item record;
  letras text;
  n integer;
begin
  for prova in select id from exam_intake loop
    if not exists (select 1 from exam_question_intake where exam_id = prova.id) then
      raise exception 'prova % bloqueada: sem questao', prova.id;
    end if;
  end loop;

  for item in select id from exam_question_intake loop
    select count(*), string_agg(letter_norm, '' order by letter_norm)
      into n, letras
    from exam_option_intake
    where question_id = item.id;

    if coalesce(n, 0) < 4 then
      raise exception 'questao % bloqueada: % alternativas', item.id, coalesce(n, 0);
    end if;
    if letras in ('C', 'E', 'CE') then
      raise exception 'questao % bloqueada: letras C/E incompletas', item.id;
    end if;
    if not exists (select 1 from exam_key_intake where question_id = item.id) then
      raise exception 'questao % bloqueada: sem gabarito', item.id;
    end if;
  end loop;
  return null;
end $$;

drop trigger if exists exam_intake_fechar_prova on exam_intake;
drop trigger if exists exam_intake_fechar_questao on exam_question_intake;
drop trigger if exists exam_intake_fechar_letra on exam_option_intake;
drop trigger if exists exam_intake_fechar_gabarito on exam_key_intake;

create constraint trigger exam_intake_fechar_prova
after insert or update or delete on exam_intake
deferrable initially deferred
for each row execute function exam_intake_fechar();

create constraint trigger exam_intake_fechar_questao
after insert or update or delete on exam_question_intake
deferrable initially deferred
for each row execute function exam_intake_fechar();

create constraint trigger exam_intake_fechar_letra
after insert or update or delete on exam_option_intake
deferrable initially deferred
for each row execute function exam_intake_fechar();

create constraint trigger exam_intake_fechar_gabarito
after insert or update or delete on exam_key_intake
deferrable initially deferred
for each row execute function exam_intake_fechar();

-- Dicionario. Nao e prova. Exige schema_layer, schema_entity, schema_column,
-- schema_relation e business_rule, que a main ja tem desde 0025 e 0028.
insert into schema_entity (name, layer_id, primary_key, purpose, links)
values
  ('exam_intake', 'conteudo', 'id', 'Prova candidata. Nao e o treino publicado.', ''),
  ('exam_question_intake', 'conteudo', 'id', 'Questao de uma prova candidata. Nao e study_item.', 'exam_id → exam_intake.id'),
  ('exam_option_intake', 'conteudo', 'question_id + letter_norm', 'Uma letra de uma questao candidata.', 'question_id → exam_question_intake.id'),
  ('exam_key_intake', 'conteudo', 'question_id', 'Letra dada como certa. Nao e answer_index.', 'question_id → exam_question_intake.id')
on conflict (name) do nothing;

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values
  ('exam_intake', 'id', 'texto', true, true, null, 'Identidade local da prova candidata.', 'texto', null),
  ('exam_intake', 'remote_id', 'texto', true, false, null, 'Rastro do id remoto. Nao e a chave.', 'texto', null),
  ('exam_intake', 'canonical_key', 'texto', true, false, null, 'Identidade da prova. Orgao, ano e nivel nao bastam.', 'texto', null),
  ('exam_intake', 'organization', 'texto', true, false, null, 'Orgao. Nao identifica a prova sozinho.', 'texto', null),
  ('exam_intake', 'year', 'inteiro', true, false, null, 'Ano. Nao identifica a prova sozinho.', 'inteiro', null),
  ('exam_intake', 'exam_board', 'texto', true, false, null, 'Banca.', 'texto', null),
  ('exam_intake', 'state_code', 'texto', false, false, null, 'UF. Pode faltar.', 'texto', null),
  ('exam_intake', 'nursing_level', 'texto', true, false, null, 'Nivel. Nao separa as duas EBSERH tecnico.', 'ENFERMEIRO, TECNICO ou AUXILIAR', null),
  ('exam_intake', 'role_title', 'texto', false, false, null, 'Cargo fino.', 'texto', null),
  ('exam_intake', 'specialty', 'texto', false, false, null, 'Especialidade. Separa generalista de saude do trabalhador.', 'texto', null),
  ('exam_intake', 'exam_date', 'data', false, false, null, 'Data da prova. Pode faltar.', 'data', null),
  ('exam_intake', 'remote_status', 'texto', true, false, null, 'Status remoto. So VALIDATED entra, e nem assim publica.', 'VALIDATED', null),
  ('exam_intake', 'provenance', 'texto', true, false, null, 'Rastro da extracao. Nao e aprovacao.', 'texto', null),
  ('exam_intake', 'situacao', 'texto', true, false, null, 'So revisao. Esta tabela nao publica.', 'revisao', null),
  ('exam_question_intake', 'id', 'texto', true, true, null, 'Identidade local da questao candidata.', 'texto', null),
  ('exam_question_intake', 'exam_id', 'texto', true, false, 'exam_intake', 'Prova dona da questao.', 'id de exam_intake', null),
  ('exam_question_intake', 'remote_id', 'texto', true, false, null, 'Rastro do id remoto.', 'texto', null),
  ('exam_question_intake', 'position', 'inteiro', true, false, null, 'Numero na prova. Nao e o indice da resposta.', 'inteiro positivo', null),
  ('exam_question_intake', 'prompt', 'texto', true, false, null, 'Enunciado. Nao vai para study_item nesta fase.', 'texto', null),
  ('exam_question_intake', 'subject', 'texto', true, false, null, 'Disciplina. Nao se deduz do enunciado.', 'texto', null),
  ('exam_question_intake', 'topic', 'texto', true, false, null, 'Tema.', 'texto', null),
  ('exam_question_intake', 'subtopic', 'texto', true, false, null, 'Subtema.', 'texto', null),
  ('exam_question_intake', 'remote_status', 'texto', true, false, null, 'Status remoto da questao. So VALIDATED entra.', 'VALIDATED', null),
  ('exam_option_intake', 'question_id', 'texto', true, true, 'exam_question_intake', 'Questao dona da letra.', 'id de exam_question_intake', null),
  ('exam_option_intake', 'position', 'inteiro', true, false, null, 'Ordem da letra na questao. Nao recomeca do zero.', 'inteiro positivo', null),
  ('exam_option_intake', 'letter', 'texto', true, false, null, 'Letra como veio.', 'texto', null),
  ('exam_option_intake', 'letter_norm', 'texto', true, true, null, 'Letra em maiuscula. Parte da chave.', 'A a E', null),
  ('exam_option_intake', 'label', 'texto', true, false, null, 'Texto da alternativa.', 'texto', null),
  ('exam_key_intake', 'question_id', 'texto', true, true, 'exam_question_intake', 'Questao do gabarito.', 'id de exam_question_intake', null),
  ('exam_key_intake', 'correct_letter', 'texto', true, false, null, 'Letra certa como veio.', 'texto', null),
  ('exam_key_intake', 'correct_letter_norm', 'texto', true, false, null, 'Letra certa em maiuscula. Tem de existir na questao.', 'A a E', null),
  ('exam_key_intake', 'key_type', 'texto', true, false, null, 'So o gabarito oficial definitivo entra.', 'OFFICIAL_DEFINITIVE', null),
  ('exam_key_intake', 'remote_key_status', 'texto', true, false, null, 'Status remoto do gabarito. Nao publica a prova.', 'texto', null)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values
  ('exam_intake', 'questoes', 'exam_question_intake', '1:N', 'id', 'exam_id', 'Uma prova candidata tem uma ou mais questoes. O gatilho recusa prova vazia.'),
  ('exam_question_intake', 'letras', 'exam_option_intake', '1:N', 'id', 'question_id', 'Uma questao tem quatro ou mais letras. C e E sozinhos nao passam.'),
  ('exam_question_intake', 'gabarito', 'exam_key_intake', '1:1', 'id', 'question_id', 'Uma questao tem um gabarito. A letra tem de existir.')
on conflict (from_entity, name) do nothing;

insert into business_rule (id, from_entity, to_entity, statement, enforcement, status)
values
  ('br-exam-intake-revisao', 'exam_intake', null, 'A prova candidata permanece em revisao. Esta tabela nao publica.', 'check situacao = revisao', 'rascunho'),
  ('br-exam-intake-validada', 'exam_intake', null, 'So entra prova cujo status remoto e VALIDATED. Isso nao e aprovacao local.', 'check remote_status = VALIDATED', 'rascunho'),
  ('br-exam-intake-letras', 'exam_question_intake', 'exam_option_intake', 'Menos de quatro letras, ou so C e E, bloqueia a questao.', 'exam_intake_fechar', 'rascunho'),
  ('br-exam-intake-sem-treino', 'exam_question_intake', null, 'A questao candidata nao e study_item e nao grava answer_index.', 'sem chave estrangeira para study_item', 'rascunho')
on conflict (id) do nothing;

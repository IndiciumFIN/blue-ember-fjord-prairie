-- Dicionário da conta e as duas fichas que ainda não tinham método. Não aprova nada.

alter table tool_formula drop constraint if exists tool_formula_method_check;
alter table tool_formula add constraint tool_formula_method_check check (method in ('soma', 'gotejamento', 'imc', 'exame'));

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values
  ('tool_formula', 'tool_slug', 'texto', true, true, 'source_tool', 'Capa da conta.', 'slug existente', null),
  ('tool_formula', 'method', 'texto', true, false, null, 'Método interpretado pelo motor. Não é cláusula de norma.', 'soma, gotejamento, imc ou exame', null),
  ('tool_formula', 'statement', 'texto', true, false, null, 'Frase interna do método.', 'texto', null),
  ('tool_formula_step', 'tool_slug', 'texto', true, true, 'tool_formula', 'Conta deste passo.', 'slug existente', null),
  ('tool_formula_step', 'position', 'inteiro', true, true, null, 'Ordem do passo.', 'inteiro maior que zero', null),
  ('tool_formula_step', 'target', 'texto', true, false, null, 'Nome do resultado do passo.', 'texto', null),
  ('tool_formula_step', 'expression', 'texto', true, false, null, 'Expressão interna. Não é cláusula de norma.', 'texto', null)
on conflict (entity, name) do nothing;

insert into tool_formula (tool_slug, method, statement)
select tool.slug, formula.method, formula.statement
from (
  values
    ('aldrete', 'soma', 'Soma dos critérios marcados.'),
    ('exames-laboratoriais', 'exame', 'O valor informado não é reduzido. A leitura compara com a faixa.')
) as formula(slug, method, statement)
join source_tool as tool on tool.slug = formula.slug
on conflict (tool_slug) do nothing;

insert into tool_formula_step (tool_slug, position, target, expression)
select tool.slug, step.position, step.target, step.expression
from (
  values
    ('aldrete', 1, 'total', 'soma dos critérios'),
    ('exames-laboratoriais', 1, 'situacao', 'valor informado, sem redução')
) as step(slug, position, target, expression)
join source_tool as tool on tool.slug = step.slug
on conflict (tool_slug, position) do nothing;

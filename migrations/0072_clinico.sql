-- Camada 5, Clínico. Descreve a coluna que já existe. Não publica capa e não grava paciente.

update schema_column as column_row
set definition = spec.definition,
    syntax = spec.syntax,
    ref_entity = spec.ref_entity
from (
  values
    ('source_tool', 'updated_by', 'Quem alterou a capa. Texto solto, não é chave para user.', 'texto', null),
    ('source_tool', 'updated_at', 'Quando a capa foi alterada.', 'instante', null),
    ('tool_band_nanda', 'tool_slug', 'Faixa desta sugestão. A chave completa inclui o escore mínimo.', 'slug de tool_band', 'tool_band'),
    ('tool_band_nanda', 'min_score', 'Escore mínimo da faixa. Faz parte da chave para tool_band.', 'número', null),
    ('tool_band_nanda', 'label', 'Rótulo sugerido na folha impressa. Não entra na tela de cálculo.', 'texto', null),
    ('tool_faq', 'tool_slug', 'Instrumento desta pergunta.', 'slug de source_tool', 'source_tool'),
    ('tool_faq', 'position', 'Ordem da pergunta.', 'inteiro maior que zero', null),
    ('tool_faq', 'question', 'Pergunta.', 'texto', null),
    ('tool_faq', 'answer', 'Resposta.', 'texto', null),
    ('tool_meta', 'tool_slug', 'Instrumento deste campo de contexto.', 'slug de source_tool', 'source_tool'),
    ('tool_meta', 'id', 'Identidade do campo dentro do instrumento.', 'texto', null),
    ('tool_meta', 'label', 'Nome do campo de contexto.', 'texto', null),
    ('tool_meta', 'position', 'Ordem do campo.', 'inteiro maior que zero', null),
    ('tool_meta_option', 'tool_slug', 'Instrumento da opção. A chave completa inclui o campo.', 'slug de tool_meta', 'tool_meta'),
    ('tool_meta_option', 'meta_id', 'Campo de contexto. Faz parte da chave para tool_meta.', 'texto', null),
    ('tool_meta_option', 'value', 'Valor gravado da opção.', 'texto', null),
    ('tool_meta_option', 'label', 'Texto da opção.', 'texto', null),
    ('tool_meta_option', 'position', 'Ordem da opção.', 'inteiro maior que zero', null),
    ('tool_reference', 'tool_slug', 'Instrumento desta referência.', 'slug de source_tool', 'source_tool'),
    ('tool_reference', 'position', 'Ordem da referência.', 'inteiro maior que zero', null),
    ('tool_reference', 'citation', 'Referência citada. Não é a cláusula.', 'texto', null),
    ('tool_related', 'tool_slug', 'Instrumento de origem.', 'slug de source_tool', 'source_tool'),
    ('tool_related', 'related_slug', 'Instrumento citado. Sem chave estrangeira.', 'texto', null),
    ('tool_related', 'position', 'Ordem do item relacionado.', 'inteiro maior que zero', null),
    ('tool_select', 'tool_slug', 'Instrumento desta lista.', 'slug de source_tool', 'source_tool'),
    ('tool_select', 'id', 'Identidade da lista dentro do instrumento.', 'texto', null),
    ('tool_select', 'label', 'Nome da lista.', 'texto', null),
    ('tool_select', 'position', 'Ordem da lista.', 'inteiro maior que zero', null),
    ('tool_select_option', 'tool_slug', 'Instrumento da opção. A chave completa inclui a lista.', 'slug de tool_select', 'tool_select'),
    ('tool_select_option', 'select_id', 'Lista. Faz parte da chave para tool_select.', 'texto', null),
    ('tool_select_option', 'value', 'Peso da opção, em pontos.', 'inteiro', null),
    ('tool_select_option', 'label', 'Texto da opção.', 'texto', null),
    ('tool_select_option', 'position', 'Ordem da opção.', 'inteiro maior que zero', null),
    ('tool_specific', 'tool_slug', 'Instrumento deste texto específico.', 'slug de source_tool', 'source_tool'),
    ('tool_specific', 'position', 'Ordem do texto.', 'inteiro maior que zero', null),
    ('tool_specific', 'body', 'Texto específico do instrumento.', 'texto', null),
    ('tool_step', 'tool_slug', 'Instrumento deste passo de uso.', 'slug de source_tool', 'source_tool'),
    ('tool_step', 'position', 'Ordem do passo.', 'inteiro maior que zero', null),
    ('tool_step', 'body', 'Texto do passo. Não é o passo da fórmula.', 'texto', null)
) as spec(entity, name, definition, syntax, ref_entity)
where column_row.entity = spec.entity
  and column_row.name = spec.name
  and column_row.definition = 'Coluna física sem definição humana.';

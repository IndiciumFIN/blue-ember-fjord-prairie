-- Ficha que se declara imagem, e o número que o texto restante cita.

alter table content_object drop constraint if exists content_object_file_kind_check;
alter table content_object add constraint content_object_file_kind_check
  check (file_kind is null or file_kind in ('webp', 'png', 'jpeg', 'gif', 'avif', 'svg', 'pdf', 'mp4', 'csv', 'json', 'md', 'txt', 'imagem', 'catalogo'));

update content_object as object
set file_kind = classified.file_kind
from (
  select
    text.slug,
    case
      when text.body ~* 'arquivo mp4|file mp4' then 'mp4'
      when text.body ~* 'arquivo csv|file csv' then 'csv'
      when text.body ~* 'arquivo json|file json' then 'json'
      when text.body ~* 'arquivo md|file md' then 'md'
      when text.body ~* 'arquivo txt|file txt' then 'txt'
      when text.body ~ '· Imagem' then 'imagem'
      else null
    end as file_kind
  from content_text as text
  where text.locale = 'pt-BR' and text.view = 'leitura'
) as classified
where object.slug = classified.slug
  and object.kind = 'biblioteca'
  and object.file_kind is null
  and classified.file_kind is not null;

update content_object as object
set file_kind = 'catalogo'
from content_text as text
where text.slug = object.slug
  and text.locale = 'pt-BR'
  and text.view = 'leitura'
  and object.kind = 'biblioteca'
  and object.file_kind is null
  and text.body ~ '\d+ imagens';

update schema_column
set syntax = 'webp, png, jpeg, gif, avif, svg, pdf, mp4, csv, json, md, txt, imagem ou catalogo'
where entity = 'content_object' and name = 'file_kind';

insert into fundamento (id, name, domain, right_name, priority, support_id)
values
  ('CITE-RDC-15-2012', 'RDC 15/2012', 'citado', 'citado na ficha', 'candidato', 'politica-referencia-citada'),
  ('CITE-RDC-222-2018', 'RDC 222/2018', 'citado', 'citado na ficha', 'candidato', 'politica-referencia-citada'),
  ('CITE-COFEN-24-2018', 'COFEN 24/2018', 'citado', 'citado na ficha', 'candidato', 'politica-referencia-citada')
on conflict (id) do nothing;

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
values
  ('atom-cita-biblioteca-cirurgica-CITE-RDC-15-2012', 'biblioteca-cirurgica', 'normativo', 'CITE-RDC-15-2012', 'A ficha cita este identificador. A cláusula não entra.', 'content_text:biblioteca-cirurgica:pt-BR', 'candidato'),
  ('atom-cita-biblioteca-seringa-CITE-RDC-222-2018', 'biblioteca-seringa', 'normativo', 'CITE-RDC-222-2018', 'A ficha cita este identificador. A cláusula não entra.', 'content_text:biblioteca-seringa:pt-BR', 'candidato'),
  ('atom-cita-biblioteca-carinho-de-emergencia-CITE-COFEN-24-2018', 'biblioteca-carinho-de-emergencia', 'normativo', 'CITE-COFEN-24-2018', 'A ficha cita este identificador. A cláusula não entra.', 'content_text:biblioteca-carinho-de-emergencia:pt-BR', 'candidato'),
  ('atom-cita-biblioteca-carinho-de-emergencia-CKO-SRC-0016', 'biblioteca-carinho-de-emergencia', 'normativo', 'CKO-SRC-0016', 'A ficha cita a Lei 7.498/86. O ano de dois dígitos é 1986. A cláusula não entra.', 'content_text:biblioteca-carinho-de-emergencia:pt-BR', 'candidato')
on conflict (id) do nothing;

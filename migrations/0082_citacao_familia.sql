-- A edição de 2019 é IEC 31010, em logo duplo com a ISO. Substitui a ISO/IEC 31010:2009.

update content_text
set title = 'IEC 31010:2019'
where slug = 'norma/CKO-SRC-0047' and locale = 'pt-BR' and title = 'ISO/IEC 31010:2019';

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
select cited.id, cited.slug, 'normativo', cited.fundamento_id,
  'O texto em português cita este identificador. A cláusula não entra.',
  'content_text:' || cited.slug || ':pt-BR',
  'candidato'
from (values
  ('atom-cita-guia_rapido_dimensionamento_de_enfermagem-CITE-COFEN-01-2024', 'guia_rapido_dimensionamento_de_enfermagem', 'CITE-COFEN-01-2024'),
  ('atom-cita-norma-CKO-SRC-0047-STD-IEC-31010', 'norma/CKO-SRC-0047', 'STD-IEC-31010'),
  ('atom-cita-norma-NORM-ISO-14971-2019-CKO-SRC-0110', 'norma/NORM-ISO-14971-2019', 'CKO-SRC-0110'),
  ('atom-cita-norma-NORM-ISO-15489-1-2016-STD-ISO-15489-1', 'norma/NORM-ISO-15489-1-2016', 'STD-ISO-15489-1'),
  ('atom-cita-norma-NORM-ISO-8601-1-2019-CKO-SRC-0087', 'norma/NORM-ISO-8601-1-2019', 'CKO-SRC-0087'),
  ('atom-cita-norma-NORM-ISO-IEC-11179-3-2023-SAMPLE-OFICIAL-STD-ISO-11179-3', 'norma/NORM-ISO-IEC-11179-3-2023-SAMPLE-OFICIAL', 'STD-ISO-11179-3'),
  ('atom-cita-norma-NORM-ISO-IEC-22989-2022-CKO-SRC-0077', 'norma/NORM-ISO-IEC-22989-2022', 'CKO-SRC-0077'),
  ('atom-cita-norma-NORM-ISO-IEC-22989-2022-CD-AMD-2-CKO-SRC-0077', 'norma/NORM-ISO-IEC-22989-2022-CD-AMD-2', 'CKO-SRC-0077'),
  ('atom-cita-norma-NORM-ISO-IEC-22989-2022-FDAMD-1-CKO-SRC-0077', 'norma/NORM-ISO-IEC-22989-2022-FDAMD-1', 'CKO-SRC-0077'),
  ('atom-cita-norma-NORM-ISO-IEC-23894-2023-PREVIEW-OFICIAL-CKO-SRC-0075', 'norma/NORM-ISO-IEC-23894-2023-PREVIEW-OFICIAL', 'CKO-SRC-0075'),
  ('atom-cita-norma-NORM-ISO-IEC-25012-2008-STD-ISO-25012', 'norma/NORM-ISO-IEC-25012-2008', 'STD-ISO-25012'),
  ('atom-cita-norma-NORM-ISO-IEC-27001-2022-PREVIEW-OFICIAL-STD-ISO-27001', 'norma/NORM-ISO-IEC-27001-2022-PREVIEW-OFICIAL', 'STD-ISO-27001'),
  ('atom-cita-norma-NORM-ISO-IEC-38507-2022-CKO-SRC-0076', 'norma/NORM-ISO-IEC-38507-2022', 'CKO-SRC-0076'),
  ('atom-cita-norma-NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL-STD-ISO-42001', 'norma/NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL', 'STD-ISO-42001'),
  ('atom-cita-norma-NORM-ISO-IEC-5338-2023-CKO-SRC-0078', 'norma/NORM-ISO-IEC-5338-2023', 'CKO-SRC-0078'),
  ('atom-cita-simulado_lei_organica_do_sus_8080-90-CITE-LEI-8080-1990', 'simulado_lei_organica_do_sus_8080-90', 'CITE-LEI-8080-1990'),
  ('atom-cita-termos-CKO-SRC-0004', 'termos', 'CKO-SRC-0004')
) as cited(id, slug, fundamento_id)
where exists (select 1 from content_object as object where object.slug = cited.slug)
  and exists (select 1 from fundamento where fundamento.id = cited.fundamento_id)
  and not exists (
    select 1 from content_atom as atom
    where atom.slug = cited.slug and atom.fundamento_id = cited.fundamento_id
  );

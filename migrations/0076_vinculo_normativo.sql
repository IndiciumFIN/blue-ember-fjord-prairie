-- Os 45 vínculos do metamodelo. A leitura do arquivo não admite o trecho.

create table if not exists normative_asset (
  id text primary key,
  kind text not null,
  path text not null
);

create table if not exists normative_link (
  id text primary key,
  rule_id text not null references content_atom (id),
  asset_id text not null references normative_asset (id),
  reading text not null check (reading in ('EM_ANALISE', 'NAO_CONFORME', 'CONFORME')),
  audited_on text not null,
  work_order_ref text not null,
  origin text not null
);

insert into normative_asset (id, kind, path) values
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A1', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#A1'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A4', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#A4'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A6', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#A6'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A7', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#A7'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A8', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#A8'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O1', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#O1'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O2', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#O2'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O3', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#O3'),
  ('ACT:REGISTO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O4', 'REGISTO', '05-implantacao/registro-22-reconstruido.json#O4'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N1', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#N1'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N2', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#N2'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N3', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#N3'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N4', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#N4'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N5', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#N5'),
  ('ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N6', 'CAMPO', '05-implantacao/registro-22-reconstruido.json#N6'),
  ('ACT:ARTEFACTO:01_NORMATIVO_OBTIDOS_ISO_IEC_42005_2025_PREVIEW_HTML', 'ARTEFACTO', '01-normativo/obtidos/iso-iec-42005-2025-preview.html'),
  ('ACT:CAMPO:REFERENCE_RIGHTS', 'CAMPO', 'reference.rights'),
  ('ACT:CAMPO:SRC_DATA_CONTRACTS_ENTITIES_TOOL_SOURCES_V1_JSON_SRC_CFM_PAR', 'CAMPO', 'src/data/contracts/entities/tool-sources.v1.json#SRC-CFM-PARECER-28-2020.limiar_aldrete'),
  ('ACT:REGISTO:06_REGISTO_ACHADOS_JSON_GAP_E22', 'REGISTO', '06-registo/achados.json#GAP-E22'),
  ('ACT:REGISTO:05_IMPLANTACAO_BASELINE_TOOL_SOURCES_V1_JSON', 'REGISTO', '05-implantacao/baseline/tool-sources.v1.json'),
  ('ACT:REGISTO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON', 'REGISTO', '05-implantacao/registro-22-reconstruido.json'),
  ('ACT:REGISTO:PRODUTOR_DOUTRINA_NORMATIVA', 'REGISTO', 'produtor (doutrina-normativa)'),
  ('ACT:REGISTO:DONO_WORK_ORDER_SCHEMA', 'REGISTO', 'dono (WORK ORDER schema)'),
  ('ACT:REGISTO:PRODUTOR', 'REGISTO', 'produtor'),
  ('ACT:REGISTO:VERIFICADOR', 'REGISTO', 'verificador'),
  ('ACT:REGISTO:DONO_KERNEL_CLINICO', 'REGISTO', 'dono (Kernel) + clinico'),
  ('ACT:REGISTO:PROGRAMA', 'REGISTO', 'programa'),
  ('ACT:REGISTO:DONO_LICENCA', 'REGISTO', 'dono (licenca)'),
  ('ACT:REGISTO:DONO', 'REGISTO', 'dono'),
  ('ACT:REGISTO:DONO_CLINICO', 'REGISTO', 'dono + clinico'),
  ('ACT:REGISTO:PRODUTOR_CLINICO', 'REGISTO', 'produtor + clinico')
on conflict (id) do nothing;

insert into normative_link (id, rule_id, asset_id, reading, audited_on, work_order_ref, origin) values
  ('VINC:A1:CAMPO:05-implantacao/registro-22-reconstruido.json#A1', 'atom-regra-ANC:ISO11179-D6', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A1', 'EM_ANALISE', '2026-11-01', 'WO:A1', 'achado:A1'),
  ('VINC:A4:CAMPO:05-implantacao/registro-22-reconstruido.json#A4', 'atom-regra-ANC:ISO11179-D6', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A4', 'EM_ANALISE', '2026-11-01', 'WO:A4', 'achado:A4'),
  ('VINC:A6:CAMPO:05-implantacao/registro-22-reconstruido.json#A6', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A6', 'EM_ANALISE', '2026-11-01', 'WO:A6', 'achado:A6'),
  ('VINC:A7:CAMPO:05-implantacao/registro-22-reconstruido.json#A7', 'atom-regra-ANC:ISO42005-5.7', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A7', 'EM_ANALISE', '2026-11-01', 'WO:A7', 'achado:A7'),
  ('VINC:A8:CAMPO:05-implantacao/registro-22-reconstruido.json#A8', 'atom-regra-ANC:ISO27037-5.3.2', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_A8', 'EM_ANALISE', '2026-11-01', 'WO:A8', 'achado:A8'),
  ('VINC:GAP-E14:ARTEFACTO:01-normativo/obtidos/iso-iec-42005-2025-preview.html', 'atom-regra-ANC:ISO42005-5.7', 'ACT:ARTEFACTO:01_NORMATIVO_OBTIDOS_ISO_IEC_42005_2025_PREVIEW_HTML', 'EM_ANALISE', '2026-11-01', 'WO:E14', 'achado:GAP-E14'),
  ('VINC:GAP-E17:CAMPO:reference.rights', 'atom-regra-ANC:ISO27001-A.5.32', 'ACT:CAMPO:REFERENCE_RIGHTS', 'NAO_CONFORME', '2026-11-01', 'WO:GAP-E17', 'achado:GAP-E17'),
  ('VINC:GAP-E22:CAMPO:src/data/contracts/entities/tool-sources.v1.json#SRC-CFM-PARECER-28-2020.limiar_aldrete', 'atom-regra-ANC:ISO14971-9', 'ACT:CAMPO:SRC_DATA_CONTRACTS_ENTITIES_TOOL_SOURCES_V1_JSON_SRC_CFM_PAR', 'NAO_CONFORME', '2026-11-01', 'WO:GAP-E22', 'achado:GAP-E22'),
  ('VINC:GAP-E22:REGISTO:06-registo/achados.json#GAP-E22', 'atom-regra-ANC:ISO14971-9', 'ACT:REGISTO:06_REGISTO_ACHADOS_JSON_GAP_E22', 'EM_ANALISE', '2026-11-01', 'WO:GAP-E22', 'achado:GAP-E22'),
  ('VINC:N1:CAMPO:05-implantacao/registro-22-reconstruido.json#N1', 'atom-regra-ANC:ISO11179-D6', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N1', 'CONFORME', '2026-11-01', '', 'achado:N1'),
  ('VINC:N2:CAMPO:05-implantacao/registro-22-reconstruido.json#N2', 'atom-regra-ANC:ISO11179-D6', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N2', 'CONFORME', '2026-11-01', '', 'achado:N2'),
  ('VINC:N3:CAMPO:05-implantacao/registro-22-reconstruido.json#N3', 'atom-regra-ANC:ISO14971-9', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N3', 'EM_ANALISE', '2026-11-01', 'WO:N3', 'achado:N3'),
  ('VINC:N4:CAMPO:05-implantacao/registro-22-reconstruido.json#N4', 'atom-regra-ANC:ISO14971-9', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N4', 'EM_ANALISE', '2026-11-01', 'WO:N4', 'achado:N4'),
  ('VINC:N5:CAMPO:05-implantacao/registro-22-reconstruido.json#N5', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N5', 'CONFORME', '2026-11-01', '', 'achado:N5'),
  ('VINC:N6:CAMPO:05-implantacao/registro-22-reconstruido.json#N6', 'atom-regra-ANC:ISO27037-5.3.2', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_N6', 'CONFORME', '2026-11-01', '', 'achado:N6'),
  ('VINC:O1:CAMPO:05-implantacao/registro-22-reconstruido.json#O1', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O1', 'EM_ANALISE', '2026-11-01', 'WO:O1', 'achado:O1'),
  ('VINC:O2:CAMPO:05-implantacao/registro-22-reconstruido.json#O2', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O2', 'EM_ANALISE', '2026-11-01', 'WO:O2', 'achado:O2'),
  ('VINC:O3:CAMPO:05-implantacao/registro-22-reconstruido.json#O3', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:CAMPO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O3', 'EM_ANALISE', '2026-11-01', 'WO:O3', 'achado:O3'),
  ('VINC:O4:REGISTO:05-implantacao/registro-22-reconstruido.json#O4', 'atom-regra-ANC:ISO15489-5.2.2.3', 'ACT:REGISTO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON_O4', 'EM_ANALISE', '2026-11-01', 'WO:O4', 'achado:O4'),
  ('VINC:WO:A1:produtor (doutrina-normativa)', 'atom-regra-ANC:ISO11179-D6', 'ACT:REGISTO:PRODUTOR_DOUTRINA_NORMATIVA', 'EM_ANALISE', '', 'WO:A1', 'work_order:WO:A1'),
  ('VINC:WO:A4:dono (WORK ORDER schema)', 'atom-regra-ANC:ISO11179-D6', 'ACT:REGISTO:DONO_WORK_ORDER_SCHEMA', 'EM_ANALISE', '', 'WO:A4', 'work_order:WO:A4'),
  ('VINC:WO:A6:produtor', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:REGISTO:PRODUTOR', 'EM_ANALISE', '', 'WO:A6', 'work_order:WO:A6'),
  ('VINC:WO:A7:produtor', 'atom-regra-ANC:ISO42005-5.7', 'ACT:REGISTO:PRODUTOR', 'EM_ANALISE', '', 'WO:A7', 'work_order:WO:A7'),
  ('VINC:WO:A8:produtor', 'atom-regra-ANC:ISO27037-5.3.2', 'ACT:REGISTO:PRODUTOR', 'EM_ANALISE', '', 'WO:A8', 'work_order:WO:A8'),
  ('VINC:WO:F1:05-implantacao/baseline/tool-sources.v1.json', 'atom-regra-ANC:CKO-STATUS-ENUM', 'ACT:REGISTO:05_IMPLANTACAO_BASELINE_TOOL_SOURCES_V1_JSON', 'EM_ANALISE', '', 'WO:F1', 'work_order:WO:F1'),
  ('VINC:WO:F3:05-implantacao/registro-22-reconstruido.json', 'atom-regra-ANC:ISO11179-D6', 'ACT:REGISTO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON', 'EM_ANALISE', '', 'WO:F3', 'work_order:WO:F3'),
  ('VINC:WO:F5:05-implantacao/registro-22-reconstruido.json', 'atom-regra-ANC:ISO19770-1', 'ACT:REGISTO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON', 'EM_ANALISE', '', 'WO:F5', 'work_order:WO:F5'),
  ('VINC:WO:F5b:05-implantacao/registro-22-reconstruido.json', 'atom-regra-ANC:ISO15489-5.2.2.3', 'ACT:REGISTO:05_IMPLANTACAO_REGISTRO_22_RECONSTRUIDO_JSON', 'EM_ANALISE', '', 'WO:F5b', 'work_order:WO:F5b'),
  ('VINC:WO:GAP-E12:programa', 'atom-regra-ANC:ISO27001-A.5.32', 'ACT:REGISTO:PROGRAMA', 'EM_ANALISE', '', 'WO:GAP-E12', 'work_order:WO:GAP-E12'),
  ('VINC:WO:GAP-E14:dono (licenca)', 'atom-regra-ANC:ISO42005-5.7', 'ACT:REGISTO:DONO_LICENCA', 'EM_ANALISE', '', 'WO:GAP-E14', 'work_order:WO:GAP-E14'),
  ('VINC:WO:GAP-E20:dono', 'atom-regra-ANC:ISO42006-4', 'ACT:REGISTO:DONO', 'EM_ANALISE', '', 'WO:GAP-E20', 'work_order:WO:GAP-E20'),
  ('VINC:WO:GAP-E21:dono + clinico', 'atom-regra-ANC:TS25058-QEAI', 'ACT:REGISTO:DONO_CLINICO', 'EM_ANALISE', '', 'WO:GAP-E21', 'work_order:WO:GAP-E21'),
  ('VINC:WO:GAP-E22:dono (Kernel) + clinico', 'atom-regra-ANC:ISO14971-9', 'ACT:REGISTO:DONO_KERNEL_CLINICO', 'EM_ANALISE', '', 'WO:GAP-E22', 'work_order:WO:GAP-E22'),
  ('VINC:WO:GAP-E23:produtor + clinico', 'atom-regra-ANC:ISO11179-D6', 'ACT:REGISTO:PRODUTOR_CLINICO', 'EM_ANALISE', '', 'WO:GAP-E23', 'work_order:WO:GAP-E23'),
  ('VINC:WO:GAP-E24:dono', 'atom-regra-ANC:COSO-IC-P13', 'ACT:REGISTO:DONO', 'EM_ANALISE', '', 'WO:GAP-E24', 'work_order:WO:GAP-E24'),
  ('VINC:WO:GAP-E25:dono', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:REGISTO:DONO', 'EM_ANALISE', '', 'WO:GAP-E25', 'work_order:WO:GAP-E25'),
  ('VINC:WO:GAP-E26:dono', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:REGISTO:DONO', 'EM_ANALISE', '', 'WO:GAP-E26', 'work_order:WO:GAP-E26'),
  ('VINC:WO:N3:dono (Kernel) + clinico', 'atom-regra-ANC:ISO14971-9', 'ACT:REGISTO:DONO_KERNEL_CLINICO', 'EM_ANALISE', '', 'WO:N3', 'work_order:WO:N3'),
  ('VINC:WO:N4:dono (Kernel) + clinico', 'atom-regra-ANC:ISO14971-9', 'ACT:REGISTO:DONO_KERNEL_CLINICO', 'EM_ANALISE', '', 'WO:N4', 'work_order:WO:N4'),
  ('VINC:WO:O1:produtor', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:REGISTO:PRODUTOR', 'EM_ANALISE', '', 'WO:O1', 'work_order:WO:O1'),
  ('VINC:WO:O2:produtor', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:REGISTO:PRODUTOR', 'EM_ANALISE', '', 'WO:O2', 'work_order:WO:O2'),
  ('VINC:WO:O3:verificador', 'atom-regra-ANC:ISO19011-6.4.8', 'ACT:REGISTO:VERIFICADOR', 'EM_ANALISE', '', 'WO:O3', 'work_order:WO:O3'),
  ('VINC:WO:O4:produtor', 'atom-regra-ANC:ISO15489-5.2.2.3', 'ACT:REGISTO:PRODUTOR', 'EM_ANALISE', '', 'WO:O4', 'work_order:WO:O4'),
  ('VINC:WO:WO:ADQUIRIR-MANUAL-CAPES-2006:dono', 'atom-regra-ANC:ISO27037-3.11', 'ACT:REGISTO:DONO', 'EM_ANALISE', '', 'WO:WO:ADQUIRIR-MANUAL-CAPES-2006', 'work_order:WO:WO:ADQUIRIR-MANUAL-CAPES-2006'),
  ('VINC:WO:WO:ADQUIRIR-PDF-BRADEN-1999:dono', 'atom-regra-ANC:ISO27037-3.11', 'ACT:REGISTO:DONO', 'EM_ANALISE', '', 'WO:WO:ADQUIRIR-PDF-BRADEN-1999', 'work_order:WO:WO:ADQUIRIR-PDF-BRADEN-1999')
on conflict (id) do nothing;

insert into schema_entity (name, layer_id, primary_key, purpose, links)
values
  ('normative_asset', 'conteudo', 'id', 'Campo citado pelo metamodelo. Não é página do site.', ''),
  ('normative_link', 'conteudo', 'id', 'Leitura do arquivo entre a regra e o campo. Não admite o trecho.', 'rule_id → content_atom.id; asset_id → normative_asset.id')
on conflict (name) do nothing;

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values
  ('normative_asset', 'id', 'texto', true, true, null, 'Identidade do campo citado.', 'texto', null),
  ('normative_asset', 'kind', 'texto', true, false, null, 'Tipo do campo citado.', 'texto', null),
  ('normative_asset', 'path', 'texto', true, false, null, 'Caminho do campo no arquivo de implantação.', 'texto', null),
  ('normative_link', 'id', 'texto', true, true, null, 'Identidade da leitura.', 'texto', null),
  ('normative_link', 'rule_id', 'texto', true, false, 'content_atom', 'Regra parafraseada já gravada.', 'id de content_atom', null),
  ('normative_link', 'asset_id', 'texto', true, false, 'normative_asset', 'Campo citado.', 'id de normative_asset', null),
  ('normative_link', 'reading', 'texto', true, false, null, 'Leitura que veio no arquivo. Não admite o trecho.', 'EM_ANALISE, NAO_CONFORME ou CONFORME', null),
  ('normative_link', 'audited_on', 'texto', true, false, null, 'Data da leitura no arquivo. Pode vir vazia.', 'texto', null),
  ('normative_link', 'work_order_ref', 'texto', true, false, null, 'Referência da ordem no arquivo. Não é kernel_order.', 'texto', null),
  ('normative_link', 'origin', 'texto', true, false, null, 'De onde a leitura foi copiada.', 'texto', null)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values
  ('content_atom', 'leituras', 'normative_link', '1:N', 'id', 'rule_id', 'Uma regra pode ter várias leituras. A leitura não muda o estado do trecho.'),
  ('normative_asset', 'leituras', 'normative_link', '1:N', 'id', 'asset_id', 'Um campo citado pode aparecer em várias leituras.')
on conflict (from_entity, name) do nothing;

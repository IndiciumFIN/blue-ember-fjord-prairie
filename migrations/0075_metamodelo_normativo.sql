-- Metamodelo local. 120 identificadores e 37 regras parafraseadas. Sem cláusula e sem publicação.

insert into governance_item (id, kind, title, body)
values (
  'politica-metamodelo-normativo',
  'politica',
  'Documento interno do metamodelo normativo',
  'Este texto é nosso. Cada linha de meta_normativo vira identificador. A regra guarda a paráfrase que já estava no arquivo. A cláusula não entra. O objeto nasce em rascunho e o trecho nasce candidato.'
)
on conflict (id) do nothing;

drop table if exists meta_norm;
create temporary table meta_norm (
  id text primary key,
  name text not null,
  sphere text not null,
  editor text not null
);

insert into meta_norm (id, name, sphere, editor) values
  ('NORM-COSO-AI-2021-PRESS-RELEASE-DRAFT', 'COSO AI 2021 — press release (draft)', 'ESF:AI', 'EDIT:COSO'),
  ('NORM-COSO-GENAI-IC-2026-ACHIEVING-EFFECTIVE-IC-OV-b', 'COSO GenAI IC 2026 — Achieving Effective IC over GenAI', 'ESF:AI', 'EDIT:COSO'),
  ('NORM-COSO-GENAI-IC-2026-ACHIEVING-EFFECTIVE-IC-OV-c', 'COSO GenAI IC 2026 — Achieving Effective IC over GenAI (variante C)', 'ESF:AI', 'EDIT:COSO'),
  ('NORM-COSO-GENAI-IC-2026-PRESS-RELEASE', 'COSO GenAI IC 2026 — press release', 'ESF:AI', 'EDIT:COSO'),
  ('NORM-ISO-AWI-TR-24492', 'ISO/AWI TR 24492', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-12792-2025', 'ISO/IEC 12792:2025', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-20546-2019', 'ISO/IEC 20546:2019', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-20547-3-2020', 'ISO/IEC 20547-3:2020', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-22989-2022', 'ISO/IEC 22989:2022', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-22989-2022-CD-AMD-2', 'ISO/IEC 22989:2022/CD Amd 2', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-22989-2022-FDAMD-1', 'ISO/IEC 22989:2022/FDAmd 1', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-23053-2022', 'ISO/IEC 23053:2022', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-23053-2022-AWI-AMD-2', 'ISO/IEC 23053:2022/AWI Amd 2', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-23053-2022-FDAMD-1', 'ISO/IEC 23053:2022/FDAmd 1', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-23894-2023-PREVIEW-OFICIAL', 'ISO/IEC 23894:2023 (preview oficial)', 'ESF:AI', 'EDIT:ISO'),
  ('NORM-ISO-IEC-24029-2-2023', 'ISO/IEC 24029-2:2023', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-24668-2022', 'ISO/IEC 24668:2022', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-24970', 'ISO/IEC 24970', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-25059-2023', 'ISO/IEC 25059:2023', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-38507-2022', 'ISO/IEC 38507:2022', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL', 'ISO/IEC 42001:2023 (preview oficial)', 'ESF:AI', 'EDIT:ISO'),
  ('NORM-ISO-IEC-42005-2025-PAGINA-DE-CATALOGO-EVS-NA', 'ISO/IEC 42005:2025 (pagina de catalogo EVS — nao e o texto)', 'ESF:AI', 'EDIT:ISO'),
  ('NORM-ISO-IEC-42105', 'ISO/IEC 42105', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-5259-1-2024', 'ISO/IEC 5259-1:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-5259-2-2024', 'ISO/IEC 5259-2:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-5259-3-2024', 'ISO/IEC 5259-3:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-5259-4-2024', 'ISO/IEC 5259-4:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-5338-2023', 'ISO/IEC 5338:2023', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-5339-2024', 'ISO/IEC 5339:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-5392-2024', 'ISO/IEC 5392:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-8183-2023', 'ISO/IEC 8183:2023', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-22989-2', 'ISO/IEC AWI 22989-2', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-25058', 'ISO/IEC AWI 25058', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-25623', 'ISO/IEC AWI 25623', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-25872-1', 'ISO/IEC AWI 25872-1', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-25880', 'ISO/IEC AWI 25880', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-26582', 'ISO/IEC AWI 26582', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-26741', 'ISO/IEC AWI 26741', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-42003', 'ISO/IEC AWI 42003', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-25223', 'ISO/IEC AWI TS 25223', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-25566', 'ISO/IEC AWI TS 25566', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-25569', 'ISO/IEC AWI TS 25569', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-25864', 'ISO/IEC AWI TS 25864', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-26312', 'ISO/IEC AWI TS 26312', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-26320', 'ISO/IEC AWI TS 26320', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-42119-7', 'ISO/IEC AWI TS 42119-7', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-AWI-TS-42119-8', 'ISO/IEC AWI TS 42119-8', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-25589', 'ISO/IEC CD 25589', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-25590', 'ISO/IEC CD 25590', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-25704', 'ISO/IEC CD 25704', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-25870', 'ISO/IEC CD 25870', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TR-23281', 'ISO/IEC CD TR 23281', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TR-24030', 'ISO/IEC CD TR 24030', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TR-25523', 'ISO/IEC CD TR 25523', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TR-42109', 'ISO/IEC CD TR 42109', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TS-22440-1', 'ISO/IEC CD TS 22440-1', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TS-22440-2', 'ISO/IEC CD TS 22440-2', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TS-22440-3', 'ISO/IEC CD TS 22440-3', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TS-25258', 'ISO/IEC CD TS 25258', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TS-25571', 'ISO/IEC CD TS 25571', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-CD-TS-42111', 'ISO/IEC CD TS 42111', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-DIS-23282', 'ISO/IEC DIS 23282', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-DIS-25029', 'ISO/IEC DIS 25029', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-DIS-42007', 'ISO/IEC DIS 42007', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-DIS-42102', 'ISO/IEC DIS 42102', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-DIS-4213', 'ISO/IEC DIS 4213', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-DTR-42103', 'ISO/IEC DTR 42103', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-DTS-25568', 'ISO/IEC DTS 25568', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-FDIS-24029-3', 'ISO/IEC FDIS 24029-3', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-FDIS-25059', 'ISO/IEC FDIS 25059', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-17903-2024', 'ISO/IEC TR 17903:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-20226-2025', 'ISO/IEC TR 20226:2025', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-20547-1-2020', 'ISO/IEC TR 20547-1:2020', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-20547-2-2018', 'ISO/IEC TR 20547-2:2018', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-20547-5-2018', 'ISO/IEC TR 20547-5:2018', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-21221-2025', 'ISO/IEC TR 21221:2025', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-24027-2021', 'ISO/IEC TR 24027:2021', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-24028-2020', 'ISO/IEC TR 24028:2020', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-24029-1-2021', 'ISO/IEC TR 24029-1:2021', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-24030-2021', 'ISO/IEC TR 24030:2021', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-24030-2024', 'ISO/IEC TR 24030:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-24368-2022', 'ISO/IEC TR 24368:2022', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-24372-2021', 'ISO/IEC TR 24372:2021', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TR-5469-2024', 'ISO/IEC TR 5469:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-12791-2024', 'ISO/IEC TS 12791:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-22443', 'ISO/IEC TS 22443', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-25058-2024', 'ISO/IEC TS 25058:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-42119-2-2025', 'ISO/IEC TS 42119-2:2025', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-42119-3', 'ISO/IEC TS 42119-3', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-4213-2022', 'ISO/IEC TS 4213:2022', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-6254-2025', 'ISO/IEC TS 6254:2025', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-TS-8200-2024', 'ISO/IEC TS 8200:2024', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-WD-TS-25570', 'ISO/IEC WD TS 25570', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-IEEE-DIS-42703', 'ISO/IEC/IEEE DIS 42703', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-NIST-AI-600-1-GENAI-PROFILE', 'NIST AI 600-1 — GenAI Profile', 'ESF:AI', 'EDIT:NIST'),
  ('NORM-NIST-AI-RMF-1-0-NIST-AI-100-1', 'NIST AI RMF 1.0 (NIST AI 100-1)', 'ESF:AI', 'EDIT:NIST'),
  ('NORM-NIST-AI-RMF-1-0-C-PIA-GPO-GOVPUB-C13', 'NIST AI RMF 1.0 — cópia GPO (GOVPUB-C13-…)', 'ESF:AI', 'EDIT:NIST'),
  ('NORM-NIST-AI-RMF-PLAYBOOK-WEB', 'NIST AI RMF Playbook (web)', 'ESF:AI', 'EDIT:NIST'),
  ('NORM-REGULAMENTO-UE-2024-1689-AI-ACT', 'Regulamento (UE) 2024/1689 (AI Act)', 'ESF:AI', 'EDIT:EUR_LEX'),
  ('NORM-ISO-19011-2018-PREVIEW-OFICIAL', 'ISO 19011:2018 (preview oficial)', 'ESF:AUD', 'EDIT:ISO'),
  ('NORM-COBIT-2019-GOVERNANCE-AND-MANAGEMENT-OBJECTI', 'COBIT 2019 — Governance and Management Objectives', 'ESF:COBIT', 'EDIT:ISACA'),
  ('NORM-COSO-ERM-2017-EXECUTIVE-SUMMARY', 'COSO ERM 2017 (Executive Summary)', 'ESF:ERM', 'EDIT:COSO'),
  ('NORM-COSO-IC-2013-EXECUTIVE-SUMMARY', 'COSO IC 2013 (Executive Summary)', 'ESF:IC', 'EDIT:COSO'),
  ('NORM-ISO-IEC-11179-3-2023-SAMPLE-OFICIAL', 'ISO/IEC 11179-3:2023 (sample oficial)', 'ESF:MDR', 'EDIT:ISO'),
  ('NORM-IEC-62304-2006', 'IEC 62304:2006', 'ESF:OUT', 'EDIT:ISO_IEC'),
  ('NORM-ISO-15489-1-2016', 'ISO 15489-1:2016', 'ESF:OUT', 'EDIT:ISO_IEC'),
  ('NORM-ISO-8601-1-2019', 'ISO 8601-1:2019', 'ESF:OUT', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-25012-2008', 'ISO/IEC 25012:2008', 'ESF:OUT', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-27001-2022-PREVIEW-OFICIAL', 'ISO/IEC 27001:2022 (preview oficial)', 'ESF:SEG', 'EDIT:ISO'),
  ('NORM-ISO-IEC-27037-2012-PREVIEW-OFICIAL', 'ISO/IEC 27037:2012 (preview oficial)', 'ESF:SEG', 'EDIT:ISO'),
  ('NORM-ISO-IEC-42006-CATALOGO-OFICIAL', 'ISO/IEC 42006:2025 (GATES DE AUDITORIA E CERTIFICACAO DE SISTEMAS DE GESTAO DE IA)', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-25019-2023', 'ISO/IEC 25019:2023', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-33020-2019', 'ISO/IEC 33020:2019', 'ESF:AI', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-38505-1-2017', 'ISO/IEC 38505-1:2017', 'ESF:GOVERNANCA_DE_DADOS', 'EDIT:ISO_IEC'),
  ('NORM-ISO-IEC-9075-1-2023', 'ISO/IEC 9075-1:2023', 'ESF:LINGUAGENS_DE_BASE_DE_DADOS', 'EDIT:ISO_IEC'),
  ('NORM-ISO-14971-2019', 'ISO 14971:2019', 'ESF:GESTAO_DE_RISCO', 'EDIT:ISO'),
  ('NORM-ISO-IEC-19770-1-2017', 'ISO/IEC 19770-1:2017', 'ESF:GESTAO_DE_ACTIVOS_DE_IT', 'EDIT:ISO_IEC'),
  ('NORM-CODD-1970-RELATIONAL-MODEL', 'Codd, E. F. (1970) — A relational model of data for large shared data banks', 'ESF:NORMALIZACAO', 'EDIT:ACM'),
  ('NORM-DOUTRINA-PARECER-V6', 'Parecer V6 (doutrina interna do Canone) — E2-PARECER-V6.md', 'ESF:DOUTRINA_CONTRATO_INTERNO', 'EDIT:CANONE'),
  ('NORM-CONTRATO-SCHEMA-CKO', 'Esquema canonico do Cânone — source.schema.json (dominio status)', 'ESF:DOUTRINA_CONTRATO_INTERNO', 'EDIT:CANONE');

drop table if exists meta_rule;
create temporary table meta_rule (
  id text primary key,
  norm_id text not null,
  pinpoint text not null,
  statement text not null
);

insert into meta_rule (id, norm_id, pinpoint, statement) values
  ('ANC:COSO-IC-P1', 'NORM-COSO-IC-2013-EXECUTIVE-SUMMARY', 'Principio 1', 'A organizacao demonstra compromisso com integridade e valores eticos, e esse compromisso e verificavel.'),
  ('ANC:COSO-IC-P6', 'NORM-COSO-IC-2013-EXECUTIVE-SUMMARY', 'Principio 6', 'Os objectivos sao especificados com clareza suficiente para identificar riscos; o vocabulario de dominio e gerido.'),
  ('ANC:COSO-IC-P9', 'NORM-COSO-IC-2013-EXECUTIVE-SUMMARY', 'Principio 9', 'Mudancas que possam afectar o controlo sao identificadas e avaliadas.'),
  ('ANC:COSO-IC-P13', 'NORM-COSO-IC-2013-EXECUTIVE-SUMMARY', 'Principio 13', 'A informacao usada e gerada e relevante e de qualidade.'),
  ('ANC:COSO-IC-P16', 'NORM-COSO-IC-2013-EXECUTIVE-SUMMARY', 'Principio 16', ' Sao executadas avaliacoes de controlo, internas e externas.'),
  ('ANC:COSO-ERM-GC', 'NORM-COSO-ERM-2017-EXECUTIVE-SUMMARY', 'Governance and Culture', 'A cultura e a governacao sustentam o tratamento de risco e as decisoes ficam registadas.'),
  ('ANC:COSO-AI-GOV', 'NORM-COSO-AI-2021-PRESS-RELEASE-DRAFT', 'Governance of AI risk', 'A IA e gerida como risco empresarial, incluindo fornecedores e modelos de terceiros.'),
  ('ANC:COBIT-MEA02', 'NORM-ISO-IEC-20546-2019', 'Objetivo MEA02', 'A conformidade com as politicas e objectivos internos e avaliada de forma independente.'),
  ('ANC:COBIT-DSS05', 'NORM-ISO-IEC-20546-2019', 'Objetivo DSS05', 'Os servicos de seguranca de informacao sao geridos de forma consistente.'),
  ('ANC:NIST-GOVERN-1.2', 'NORM-NIST-AI-RMF-1-0-NIST-AI-100-1', 'GOVERN 1.2', 'As exigences legais e regulamentares aplicaveis a IA sao incorporadas na politica e na pratica.'),
  ('ANC:NIST-MEASURE-2.5', 'NORM-NIST-AI-RMF-1-0-NIST-AI-100-1', 'MEASURE 2.5', 'O sistema e avaliado face aos riscos mapeados.'),
  ('ANC:NIST-MANAGE-4.1', 'NORM-NIST-AI-RMF-1-0-NIST-AI-100-1', 'MANAGE 4.1', 'Incidentes e respostas a incidentes sao registados e monitorizados.'),
  ('ANC:ISO42001-4.3', 'NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL', '4.3', 'O ambito do sistema de gestao de IA e determinado e documentado.'),
  ('ANC:ISO42001-7.5.2', 'NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL', '7.5.2', 'A informacao documentada e criada, actualizada e mantida de forma controlada.'),
  ('ANC:ISO42001-7.5.3', 'NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL', '7.5.3', 'A informacao documentada e controlada quanto a disponibilidade, retencao e disposicao.'),
  ('ANC:ISO42001-9.2', 'NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL', '9.2', 'A auditoria interna e executada a intervalos planificados.'),
  ('ANC:ISO42001-10.2', 'NORM-ISO-IEC-42001-2023-PREVIEW-OFICIAL', '10.2', 'Nao conformidades e acoes correctivas sao registadas e a sua eficacia avaliada.'),
  ('ANC:ISO23894-6.4', 'NORM-ISO-IEC-23894-2023-PREVIEW-OFICIAL', '6.4', 'Os riscos de IA sao avaliados de forma iterativa e continua.'),
  ('ANC:ISO42005-5.7', 'NORM-ISO-IEC-42005-2025-PAGINA-DE-CATALOGO-EVS-NA', '5.7', 'Os limiares de avaliacao de impacto sao definidos e aplicados de forma consistente.'),
  ('ANC:ISO27001-A.5.32', 'NORM-ISO-IEC-27001-2022-PREVIEW-OFICIAL', 'A.5.32', 'A propriedade intelectual e os direitos de autor sao respeitados e protegidos.'),
  ('ANC:ISO27037-3.11', 'NORM-ISO-IEC-27037-2012-PREVIEW-OFICIAL', '3.11', 'O valor de hash de um ficheiro e calculado e registado para servir de prova de integridade.'),
  ('ANC:ISO27037-5.3.2', 'NORM-ISO-IEC-27037-2012-PREVIEW-OFICIAL', '5.3.2', 'A prova e verificavel por um terceiro, que pode repetir a operacao.'),
  ('ANC:ISO15489-5.2.2.3', 'NORM-ISO-15489-1-2016', '5.2.2.3', 'As alteracoes a registos sao explicitas, datadas e rastreaveis.'),
  ('ANC:ISO11179-D6', 'NORM-ISO-IEC-11179-3-2023-SAMPLE-OFICIAL', 'Anexo D.6 (value meanings)', 'Cada valor de um dominio enumerado tem um significado registado.'),
  ('ANC:ISO19011-6.4.8', 'NORM-ISO-19011-2018-PREVIEW-OFICIAL', '6.4.8', 'Os achados de auditoria sao registados com criteria, condicao, causa e efeito.'),
  ('ANC:ISO19011-4(f)', 'NORM-ISO-19011-2018-PREVIEW-OFICIAL', '4(f)', 'O auditor e independente e objetivo, e a sua propria metodologia e auditada.'),
  ('ANC:ISO14971-9', 'NORM-ISO-14971-2019', '9', 'A eficacia dos controlos de risco e verificada e a sua eficacia e monitorizada.'),
  ('ANC:ISO19770-1', 'NORM-ISO-IEC-19770-1-2017', 'Identificacao de activos', 'Cada referencia a um activo resolve para um activo existente.'),
  ('ANC:ISO8601-1', 'NORM-ISO-8601-1-2019', 'Representacao de datas', 'As datas sao representadas de forma nao ambigua e verificavel.'),
  ('ANC:AIACT-11', 'NORM-ISO-IEC-5259-1-2024', 'Artigo 11', 'A documentacao tecnica e mantida e actualizada ao longo do ciclo de vida (benchmark, nao aplicavel directamente).'),
  ('ANC:ISO42006-4', 'NORM-ISO-IEC-42006-CATALOGO-OFICIAL', '4', 'Os organismos que prestam auditoria e certificacao de sistemas de gestao de IA devem ser imparciais e competentes (benchmark para o papel do agente auditor).'),
  ('ANC:TS25058-QEAI', 'NORM-ISO-IEC-AWI-25058', 'Guidance for quality evaluation of AI systems', 'A avaliacao de qualidade de sistemas de IA e orientada por um modelo de qualidade aplicavel (benchmark).'),
  ('ANC:ISO25012', 'NORM-ISO-IEC-25012-2008', 'Caracteristicas de qualidade dos dados', 'Os dados registados sao avaliados por caracteristicas de qualidade (exactidao, completude, consistencia, credibilidade, actualidade, rastreabilidade, conformidade).'),
  ('ANC:PARECER-V6-4', 'NORM-DOUTRINA-PARECER-V6', 'Item 4', 'A classificacao faz-se por cotejo com a ontologia (natureza do documento), nunca por traducao de rotulos de uma tabela.'),
  ('ANC:CKO-STATUS-ENUM', 'NORM-CONTRATO-SCHEMA-CKO', 'dominio `status` (10 valores)', 'O estado de um objecto canonico so pode assumir um valor do dominio fechado definido no esquema; nao ha estado inventado.'),
  ('ANC:CODD-1970-NF', 'NORM-CODD-1970-RELATIONAL-MODEL', 'Formas normais 1NF/2NF/3NF', 'As tabelas do programa sao verificadas quanto a atomicidade (1NF), chave unica e dependencia nao parcial (2NF) e ausencia de dependencia transitiva (3FN); a verificacao e executada, nao declarada.'),
  ('ANC:ISO38505-1', 'NORM-ISO-IEC-38505-1-2017', 'Principios de governanca de dados (aplicacao da ISO/IEC 38500)', 'A governanca dos dados do programa define responsabilidade, finalidade e monitorizacao; o metamodelo normativo e a sua materializacao.');

insert into fundamento (id, name, domain, right_name, priority, support_id)
select id, name, sphere, 'Só metadado', 'P1', 'politica-metamodelo-normativo'
from meta_norm
on conflict (id) do nothing;

insert into content_object (slug, kind, origin_path)
select 'norma/' || id, 'norma', 'norma/' || id
from meta_norm
on conflict (slug) do nothing;

insert into content_text (slug, locale, view, title, lead, body, status)
select 'norma/' || id, 'pt-BR', 'leitura', name, editor, '', 'rascunho'
from meta_norm
on conflict (slug, locale, view) do nothing;

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
select
  'atom-meta-' || id,
  'norma/' || id,
  'normativo',
  id,
  'Identificador do metamodelo local. A cláusula não entra.',
  'attachments/metamodelo-normativos.json:' || id,
  'candidato'
from meta_norm
on conflict (id) do nothing;

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
select
  'atom-regra-' || rule.id,
  'norma/' || rule.norm_id,
  'normativo',
  rule.norm_id,
  rule.statement,
  'meta_regra:' || rule.id || ':' || rule.pinpoint,
  'candidato'
from meta_rule as rule
join meta_norm as norm on norm.id = rule.norm_id
on conflict (id) do nothing;

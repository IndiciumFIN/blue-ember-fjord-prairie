-- Registro local de fontes. Não copia cláusula. Não publica. Contabilidade fica de fora.

insert into governance_item (id, kind, title, body)
values (
  'politica-registro-normativo',
  'politica',
  'Documento interno do registro de fontes',
  'Este texto é nosso. Cada fonte do registro local vira identificador. O código e o título entram. A cláusula não entra. A fonte de contabilidade não entra. O objeto nasce em rascunho e o trecho nasce candidato.'
)
on conflict (id) do nothing;

drop table if exists registry_source;
create temporary table registry_source (
  source_id text primary key,
  code text not null,
  title text not null,
  vertical text not null,
  ingestion text not null,
  eligibility text not null,
  existing_id text
);

insert into registry_source (source_id, code, title, vertical, ingestion, eligibility, existing_id)
values
  ('CKO-SRC-0001', 'Lei 13.709/2018 (LGPD)', 'Lei Geral de Proteção de Dados Pessoais', 'Geral', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0002', 'ANPD — Regulamentos (Res. CD/ANPD)', 'Regulamentos da ANPD (incidentes, encarregado, transferência, pequenos agentes etc.)', 'Geral', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0003', 'Lei 12.965/2014 (Marco Civil da Internet)', 'Marco Civil da Internet', 'Geral', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0004', 'Lei 9.610/1998 (Direitos Autorais)', 'Lei de Direitos Autorais', 'Geral', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0005', 'Lei 13.146/2015 (LBI)', 'Lei Brasileira de Inclusão da Pessoa com Deficiência', 'Geral', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0006', 'Lei 8.078/1990 (CDC)', 'Código de Defesa do Consumidor', 'Geral', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0007', 'eMAG — Modelo de Acessibilidade em Governo Eletrônico', 'eMAG', 'Geral', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0008', 'Lei 13.787/2018 (Prontuário eletrônico)', 'Digitalização e uso de sistemas informatizados para prontuário', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0009', 'Lei 14.510/2022 (Telessaúde)', 'Telessaúde em todo o território nacional', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0010', 'Reg. (UE) 2016/679 (GDPR)', 'General Data Protection Regulation', 'Geral', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0011', 'Reg. (UE) 2024/1689 (AI Act)', 'Regulamento da Inteligência Artificial', 'IA', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0012', 'Reg. (UE) 2017/745 (MDR)', 'Regulamento de Dispositivos Médicos', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0013', 'Reg. (UE) 2025/327 (EHDS)', 'Espaço Europeu de Dados de Saúde', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0014', 'Reg. (UE) 2023/2854 (Data Act)', 'Regulamento de Dados', 'Dados', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0015', 'Dir. (UE) 2019/882 (EAA)', 'European Accessibility Act', 'Geral', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0016', 'Lei 7.498/1986', 'Lei do Exercício Profissional da Enfermagem', 'Enfermagem', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0017', 'Decreto 94.406/1987', 'Regulamenta a Lei 7.498/1986', 'Enfermagem', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0018', 'Res. COFEN 564/2017', 'Código de Ética dos Profissionais de Enfermagem', 'Enfermagem', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0019', 'Res. COFEN 736/2024', 'Implementação do Processo de Enfermagem em todo contexto de cuidado', 'Enfermagem', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0020', 'Res. COFEN 358/2009', 'Sistematização da Assistência de Enfermagem (SAE)', 'Enfermagem', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0021', 'Res. COFEN 429/2012', 'Registro das ações profissionais no prontuário', 'Enfermagem', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0022', 'Portaria MS/GM 529/2013 (PNSP)', 'Programa Nacional de Segurança do Paciente', 'Saúde', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0023', 'RDC Anvisa 36/2013', 'Segurança do paciente em serviços de saúde', 'Saúde', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0024', 'RDC Anvisa 657/2022', 'Regularização de software como dispositivo médico (SaMD)', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0025', 'RDC Anvisa 751/2022', 'Classificação de risco e regularização de dispositivos médicos', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0026', 'Protocolos Básicos de Segurança do Paciente (MS/Anvisa/Fiocruz)', 'Protocolos de identificação, higiene das mãos, medicação, quedas, lesão por pressão, cirurgia segura', 'Enfermagem', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0027', 'RENAME / DCB / Bulário Anvisa', 'Relação Nacional de Medicamentos, Denominação Comum Brasileira e bulas', 'Saúde', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0028', 'ANS — TISS/TUSS', 'Padrão de troca de informações e terminologia unificada da saúde suplementar', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0029', 'WHO — Global Patient Safety Action Plan 2021–2030', 'Plano Global de Ação para a Segurança do Paciente', 'Saúde', 'excerpt', 'REFERENCIAL', null),
  ('CKO-SRC-0030', 'WHO — Ethics and governance of AI for health', 'Orientação da OMS (2021) e guia sobre LMMs (2024/2025)', 'IA em saúde', 'excerpt', 'REFERENCIAL', null),
  ('CKO-SRC-0031', 'HL7 FHIR', 'Fast Healthcare Interoperability Resources', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0032', 'SNOMED CT', 'Terminologia clínica', 'Saúde', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0033', 'LOINC', 'Códigos de observações e exames', 'Saúde', 'full_text', 'CONDICIONAL', null),
  ('CKO-SRC-0034', 'UCUM', 'Unified Code for Units of Measure', 'Dados', 'full_text', 'ELEGIVEL', 'SPEC-UCUM22'),
  ('CKO-SRC-0035', 'ICD-11 / CID-11 (e CID-10 DATASUS)', 'Classificação Internacional de Doenças', 'Saúde', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0036', 'ICNP / CIPE', 'Classificação Internacional para a Prática de Enfermagem', 'Enfermagem', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0037', 'NANDA-I / NIC / NOC', 'Diagnósticos, intervenções e resultados de enfermagem', 'Enfermagem', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0038', 'ATC/DDD (WHO CC)', 'Classificação anatômica terapêutica química e doses diárias definidas', 'Saúde', 'excerpt', 'CONDICIONAL', null),
  ('CKO-SRC-0039', 'ISMP — Lista de medicamentos potencialmente perigosos', 'High-alert medications (ISMP / ISMP Brasil)', 'Enfermagem', 'excerpt', 'REFERENCIAL', null),
  ('CKO-SRC-0040', 'IMDRF — SaMD (N10/N12/N23)', 'Software as a Medical Device: definição, framework de risco, QMS', 'Saúde', 'excerpt', 'CONDICIONAL', null),
  ('CKO-SRC-0041', 'FDA — Clinical Decision Support Software (guidance)', 'Diretriz sobre CDS', 'Saúde', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0042', 'ISO 9001:2026', 'Sistemas de gestão da qualidade — requisitos', 'Qualidade', 'metadata_only', 'ELEGIVEL', 'STD-ISO-9001'),
  ('CKO-SRC-0043', 'ISO 19011:2026', 'Diretrizes para auditoria de sistemas de gestão', 'Auditoria', 'metadata_only', 'ELEGIVEL', 'STD-ISO-19011'),
  ('CKO-SRC-0044', 'ISO/IEC 38505-1:2026', 'Governança de dados', 'Dados', 'metadata_only', 'ELEGIVEL', 'STD-ISO-38505-1'),
  ('CKO-SRC-0045', 'ISO/IEC 38500:2024', 'Governança de TI', 'Governança', 'metadata_only', 'ELEGIVEL', 'STD-ISO-38500'),
  ('CKO-SRC-0046', 'ISO 31000:2018', 'Gestão de riscos — diretrizes', 'Risco', 'metadata_only', 'ELEGIVEL', 'STD-ISO-31000'),
  ('CKO-SRC-0047', 'ISO/IEC 31010:2019', 'Técnicas de avaliação de riscos', 'Risco', 'metadata_only', 'ELEGIVEL', 'STD-IEC-31010'),
  ('CKO-SRC-0048', 'ISO 37301:2021', 'Sistemas de gestão de compliance', 'Compliance', 'metadata_only', 'ELEGIVEL', 'STD-ISO-37301'),
  ('CKO-SRC-0049', 'ISO 22301:2019', 'Continuidade de negócios', 'Operação', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0050', 'ISO/IEC 20000-1', 'Gestão de serviços de TI', 'Operação', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0051', 'ISO 30401:2018', 'Gestão do conhecimento', 'Conhecimento', 'metadata_only', 'REFERENCIAL', 'STD-ISO-30401'),
  ('CKO-SRC-0052', 'ISO 21502:2020', 'Gestão de projetos', 'Projetos', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0053', 'COBIT 2019', 'Framework de governança e gestão de TI empresarial', 'Governança', 'metadata_only', 'ELEGIVEL', 'FRAME-COBIT'),
  ('CKO-SRC-0054', 'COSO ICIF 2013', 'Internal Control — Integrated Framework', 'Controle interno', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0055', 'COSO ERM 2017', 'Enterprise Risk Management — Integrating with Strategy and Performance', 'Risco', 'metadata_only', 'ELEGIVEL', 'FRAME-COSO-ERM'),
  ('CKO-SRC-0056', 'COSO — Achieving Effective Internal Control over GenAI', 'Guia COSO sobre controle interno para IA generativa', 'IA', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0057', 'IIA — Global Internal Audit Standards', 'Normas Globais de Auditoria Interna', 'Auditoria', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0058', 'IIA — Three Lines Model', 'Modelo das Três Linhas', 'Governança', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0059', 'IAASB — ISA 315 (Rev. 2019), 330, 500, 530', 'Normas Internacionais de Auditoria', 'Auditoria', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0061', 'ISO/IEC 27001:2022 (+ Amd 1:2024)', 'SGSI — requisitos', 'Segurança', 'metadata_only', 'ELEGIVEL', 'STD-ISO-27001'),
  ('CKO-SRC-0062', 'ISO/IEC 27002:2022', 'Controles de segurança da informação', 'Segurança', 'metadata_only', 'ELEGIVEL', 'STD-ISO-27002'),
  ('CKO-SRC-0063', 'ISO/IEC 27005:2022', 'Gestão de riscos de segurança da informação', 'Segurança', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0064', 'ISO/IEC 27701:2025', 'Gestão de privacidade (PIMS)', 'Privacidade', 'metadata_only', 'ELEGIVEL', 'STD-ISO-27701'),
  ('CKO-SRC-0065', 'ISO/IEC 27018 / 27017', 'Proteção de PII e controles em nuvem', 'Segurança', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0066', 'ISO/IEC 27799:2016', 'Segurança da informação em saúde', 'Saúde', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0067', 'ISO/IEC 29100:2024', 'Framework de privacidade', 'Privacidade', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0068', 'NIST CSF 2.0', 'Cybersecurity Framework', 'Segurança', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0069', 'NIST SP 800-53 Rev.5', 'Controles de segurança e privacidade', 'Segurança', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0070', 'NIST SP 800-218 (SSDF)', 'Secure Software Development Framework', 'Software', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0071', 'OWASP ASVS', 'Application Security Verification Standard', 'Segurança', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0072', 'OWASP Top 10 for LLM Applications', 'Riscos de aplicações LLM', 'IA', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0073', 'MITRE ATLAS', 'Táticas e técnicas adversariais contra IA', 'IA', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0074', 'ISO/IEC 42001:2023', 'Sistema de gestão de IA', 'IA', 'metadata_only', 'ELEGIVEL', 'STD-ISO-42001'),
  ('CKO-SRC-0075', 'ISO/IEC 23894:2023', 'Gestão de riscos de IA', 'IA', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0076', 'ISO/IEC 38507:2022', 'Governança do uso de IA', 'IA', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0077', 'ISO/IEC 22989:2022', 'Conceitos e terminologia de IA', 'IA', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0078', 'ISO/IEC 5338:2023', 'Processos de ciclo de vida de sistemas de IA', 'IA', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0079', 'ISO/IEC 5259 (série)', 'Qualidade de dados para analítica e ML', 'IA', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0080', 'ISO/IEC TR 24027 / TR 24028 / 12792', 'Viés, confiabilidade e taxonomia de transparência de IA', 'IA', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0081', 'NIST AI RMF 1.0 (AI 100-1)', 'AI Risk Management Framework', 'IA', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0082', 'NIST AI 600-1 (GenAI Profile)', 'Perfil de IA generativa do AI RMF', 'IA', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0083', 'ISO/IEC 11179 (partes 1, 3, 6)', 'Registro de metadados (MDR)', 'Dados', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0084', 'ISO 8000 (partes 61, 110 etc.)', 'Qualidade de dados mestres', 'Dados', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0085', 'ISO/IEC 25010:2023 / 25012 / 25024', 'Modelos de qualidade de produto e de dados; medição', 'Qualidade', 'metadata_only', 'ELEGIVEL', 'STD-ISO-25010'),
  ('CKO-SRC-0086', 'ISO 15489-1:2016', 'Gestão de documentos de arquivo', 'Registros', 'metadata_only', 'ELEGIVEL', 'STD-ISO-15489-1'),
  ('CKO-SRC-0087', 'ISO 8601-1:2019', 'Data e hora', 'Dados', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0088', 'ISO 80000 (série) / ISO/IEC 80000-13', 'Grandezas e unidades', 'Dados', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0089', 'ISO 639 / 3166 / 15924 + BCP 47 (RFC 5646)', 'Códigos de idioma, país e escrita', 'Idiomas', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0090', 'Unicode CLDR / UAX', 'Formatação por locale, plurais, calendários', 'Idiomas', 'excerpt', 'ELEGIVEL', null),
  ('CKO-SRC-0091', 'ISO 17100:2015 (+ 18587)', 'Serviços de tradução; pós-edição', 'Idiomas', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0092', 'FAIR Principles', 'Findable, Accessible, Interoperable, Reusable', 'Dados', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0093', 'W3C PROV-O', 'Ontologia de proveniência', 'Dados', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0094', 'W3C DCAT 3', 'Vocabulário de catálogos de dados', 'Dados', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0095', 'W3C SKOS / OWL 2 / SHACL / JSON-LD 1.1', 'Ontologias, validação de grafos e dados ligados', 'Dados', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0096', 'W3C ODRL', 'Linguagem de expressão de direitos', 'Direitos', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0097', 'schema.org', 'Vocabulário de marcação semântica', 'SEO', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0098', 'SPDX (ISO/IEC 5962)', 'Identificadores de licença e SBOM', 'Software', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0099', 'CycloneDX (ECMA-424)', 'Formato de SBOM', 'Software', 'full_text', 'REFERENCIAL', null),
  ('CKO-SRC-0100', 'OpenAPI Specification', 'Descrição de APIs HTTP', 'API', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0101', 'JSON Schema', 'Validação de documentos JSON', 'API', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0102', 'IETF RFCs de núcleo (2119/8174, 3986, 8259, 9110, 9562, 6749, 7519)', 'Palavras-chave normativas, URI, JSON, HTTP, UUID, OAuth 2.0, JWT', 'API', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0103', 'WCAG 2.2', 'Web Content Accessibility Guidelines', 'Acessibilidade', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0104', 'WAI-ARIA 1.2 / ARIA Authoring Practices', 'Papéis e propriedades de acessibilidade', 'Acessibilidade', 'full_text', 'ELEGIVEL', null),
  ('CKO-SRC-0105', 'EN 301 549 v3.2.1', 'Requisitos de acessibilidade para TIC', 'Acessibilidade', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0106', 'ISO/IEC/IEEE 12207:2026', 'Processos de ciclo de vida de software', 'Software', 'metadata_only', 'ELEGIVEL', 'STD-ISO-12207'),
  ('CKO-SRC-0107', 'ISO/IEC/IEEE 15288:2023', 'Processos de ciclo de vida de sistemas', 'Software', 'metadata_only', 'REFERENCIAL', null),
  ('CKO-SRC-0108', 'ISO/IEC/IEEE 29119 (série) / 828', 'Teste de software; gestão de configuração', 'Software', 'metadata_only', 'ELEGIVEL', null),
  ('CKO-SRC-0109', 'IEC 62304:2006+A1:2015', 'Ciclo de vida de software de dispositivo médico', 'Saúde', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0110', 'ISO 14971:2019', 'Gestão de risco de dispositivos médicos', 'Saúde', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0111', 'ISO 13485:2016', 'QMS de dispositivos médicos', 'Saúde', 'metadata_only', 'CONDICIONAL', null),
  ('CKO-SRC-0112', 'IEC 62366-1:2015+A1:2020 / IEC 82304-1:2016', 'Usabilidade e requisitos de software de saúde', 'Saúde', 'metadata_only', 'CONDICIONAL', null);

update registry_source as source
set existing_id = null
where existing_id is not null
  and not exists (select 1 from fundamento where fundamento.id = source.existing_id);

insert into fundamento (id, name, domain, right_name, priority, support_id)
select
  source.source_id,
  source.code,
  source.vertical,
  source.ingestion,
  case source.eligibility
    when 'ELEGIVEL' then 'P0'
    when 'CONDICIONAL' then 'P1'
    else 'P2'
  end,
  'politica-registro-normativo'
from registry_source as source
where source.existing_id is null
on conflict (id) do nothing;

insert into content_object (slug, kind, origin_path)
select 'norma/' || source.source_id, 'norma', 'norma/' || source.source_id
from registry_source as source
on conflict (slug) do nothing;

insert into content_text (slug, locale, view, title, lead, body, status)
select 'norma/' || source.source_id, 'pt-BR', 'leitura', source.code, source.title, '', 'rascunho'
from registry_source as source
on conflict (slug, locale, view) do nothing;

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
select
  'atom-src-' || source.source_id,
  'norma/' || source.source_id,
  'normativo',
  coalesce(source.existing_id, source.source_id),
  'Identificador do registro local. A cláusula não entra.',
  'attachments/CKO_Fontes_Normativas_Registry.json:' || source.source_id,
  'candidato'
from registry_source as source
on conflict (id) do nothing;

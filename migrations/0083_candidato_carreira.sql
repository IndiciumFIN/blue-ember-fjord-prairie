-- Candidatos de carreira, pesquisa e participação. Não admite. Não copia cláusula.
-- O segundo kernel em outro esquema não entra. Lista e JSON não entram.

insert into schema_layer (id, label, position)
values ('candidato', 'Candidato', 6)
on conflict (id) do nothing;

create table if not exists career_projection_candidate (
  id text primary key,
  route_slug text not null unique,
  title text not null,
  lead text not null,
  audience text not null check (audience in ('PROFESSIONAL','YOUTH')),
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_module_candidate (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null,
  object_class text not null check (object_class in ('FUNCTIONAL','EDITORIAL','HYBRID')),
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  family text not null,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN')),
  sort_order integer not null default 0
);

create table if not exists career_projection_item_candidate (
  projection_id text not null references career_projection_candidate(id),
  module_id text not null references career_module_candidate(id),
  sort_order integer not null default 0,
  primary key (projection_id,module_id)
);

create table if not exists career_role_candidate (
  id text primary key,
  slug text not null unique,
  title text not null,
  family text not null,
  summary text not null,
  education_path text not null,
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_skill_candidate (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_role_skill_candidate (
  role_id text not null references career_role_candidate(id),
  skill_id text not null references career_skill_candidate(id),
  required_level smallint not null check (required_level between 1 and 5),
  importance text not null check (importance in ('CORE','IMPORTANT','OPTIONAL')),
  primary key (role_id,skill_id)
);

create table if not exists career_path_candidate (
  id text primary key,
  slug text not null unique,
  title text not null,
  summary text not null,
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_path_step_candidate (
  path_id text not null references career_path_candidate(id),
  step_order integer not null,
  title text not null,
  description text not null,
  object_type text not null,
  object_ref text,
  primary key(path_id,step_order)
);

create table if not exists career_opportunity_type_candidate (
  id text primary key,
  kind text not null unique,
  title text not null,
  description text not null,
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  official_source_required boolean not null default true,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_credential_candidate (
  id text primary key,
  title text not null,
  category text not null,
  issuer_scope text not null,
  validity_note text not null,
  source_required boolean not null default true,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_document_template_candidate (
  id text primary key,
  kind text not null check (kind in ('CV','COVER_LETTER','PORTFOLIO','PROFESSIONAL_SUMMARY')),
  title text not null,
  description text not null,
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_market_signal_candidate (
  id text primary key,
  metric_key text not null,
  label text not null,
  role_ref text references career_role_candidate(id),
  region text not null default 'BR',
  metric_value numeric,
  unit text,
  source_ref text,
  status text not null check (status in ('SOURCE_REQUIRED','VERIFIED_CANDIDATE'))
);

create table if not exists career_editorial_candidate (
  id text primary key,
  slug text not null unique,
  title text not null,
  dek text not null,
  content_type text not null check (content_type in ('ARTICLE','GUIDE','CAMPAIGN','CHECKLIST','STORY','QUIZ_INTRO')),
  campaign_key text,
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  linked_object_type text,
  linked_object_ref text,
  status text not null check (status in ('DRAFT_CANDIDATE','HOLD_HUMAN')),
  sort_order integer not null default 0
);

create table if not exists career_reflection_question_candidate (
  id text primary key,
  prompt text not null,
  dimension text not null,
  weight smallint not null default 1 check (weight between 1 and 5),
  audience text not null check (audience in ('YOUTH','BOTH')),
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN')),
  sort_order integer not null default 0
);

create table if not exists career_profile_candidate (
  participant_key text primary key,
  target_role_id text references career_role_candidate(id),
  stage text not null check (stage in ('EXPLORING','STUDENT','FIRST_JOB','PROFESSIONAL','SPECIALIST','LEADERSHIP','RESEARCH','INTERNATIONAL')),
  goal text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists career_profile_skill_candidate (
  participant_key text not null references career_profile_candidate(participant_key),
  skill_id text not null references career_skill_candidate(id),
  self_level smallint not null check (self_level between 0 and 5),
  updated_at timestamptz not null default now(),
  primary key(participant_key,skill_id)
);

create table if not exists career_application_candidate (
  id text primary key,
  participant_key text not null references career_profile_candidate(participant_key),
  opportunity_kind text not null,
  label text not null,
  stage text not null check (stage in ('SAVED','APPLIED','INTERVIEW','TECHNICAL_STAGE','OFFER','APPROVED','DECLINED','CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists career_profile_credential_candidate (
  participant_key text not null references career_profile_candidate(participant_key),
  credential_id text not null references career_credential_candidate(id),
  state text not null check (state in ('PLANNED','IN_PROGRESS','COMPLETED','RENEWAL_REVIEW')),
  updated_at timestamptz not null default now(),
  primary key(participant_key,credential_id)
);

create table if not exists career_milestone_candidate (
  id text primary key,
  participant_key text not null references career_profile_candidate(participant_key),
  milestone_type text not null,
  label text not null,
  achieved_on date,
  created_at timestamptz not null default now()
);

create table if not exists career_learning_resource_type_candidate (
  id text primary key,
  kind text not null unique,
  title text not null,
  description text not null,
  source_required boolean not null default true,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_interview_scenario_candidate (
  id text primary key,
  kind text not null,
  title text not null,
  description text not null,
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_network_capability_candidate (
  id text primary key,
  kind text not null,
  title text not null,
  description text not null,
  requires_identity boolean not null default true,
  moderation_required boolean not null default true,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_jurisdiction_requirement_candidate (
  id text primary key,
  jurisdiction text not null,
  requirement_kind text not null,
  title text not null,
  description text not null,
  source_ref text,
  status text not null check (status in ('SOURCE_REQUIRED','VERIFIED_CANDIDATE'))
);

create table if not exists career_worklife_capability_candidate (
  id text primary key,
  kind text not null,
  title text not null,
  description text not null,
  normative_source_required boolean not null default true,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_youth_activity_candidate (
  id text primary key,
  kind text not null check (kind in ('QUIZ','GAME','CARD_SET','SCENARIO','GUIDED_REFLECTION')),
  title text not null,
  description text not null,
  linked_module_ref text,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN'))
);

create table if not exists career_source_candidate (
  id text primary key,
  source_type text not null check (source_type in ('OFFICIAL_LAW','REGULATOR','STANDARD','TERMINOLOGY','PRIMARY_STUDY','GUIDELINE','TEXTBOOK','DATASET_API','SOFTWARE','IMAGE','INTERNAL_GOVERNED')),
  title text not null,
  authority text not null,
  uri text not null,
  pinpoint text not null,
  rights text not null check (rights in ('UNKNOWN','PERMITTED','RESTRICTED','LICENSED','PUBLIC_DOMAIN','NOT_APPLICABLE')),
  jurisdiction text not null,
  retrieved_at date not null,
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  snapshot_ref text not null,
  effective_from date,
  effective_until date,
  language text,
  status text not null check (status in ('CANDIDATE','SOURCE_QUALIFIED','HOLD_HUMAN','RETIRED'))
);

create table if not exists career_authority_binding_candidate (
  id text primary key,
  field_path text not null,
  requirement_id text not null,
  source_id text not null references career_source_candidate(id),
  authority_class text not null check (authority_class in ('REGULATORY','TECHNICAL_STANDARD','AUTHORITATIVE_TERMINOLOGY','CLINICAL_EVIDENCE','INTERNAL_NONCLINICAL')),
  jurisdiction text not null,
  applicable_from date not null,
  applicable_until date,
  decision text not null check (decision in ('ALLOW','HOLD_HUMAN','REJECT','NOT_APPLICABLE_JUSTIFIED')),
  status text not null check (status in ('CANDIDATE','EVIDENCE_BOUND','HOLD_HUMAN','ASSURED')),
  claim_id text,
  source_ids_text text not null default '',
  evidence_bundle_ids_text text not null default '',
  validator_ids_text text not null default ''
);

create table if not exists career_ingestion_run_candidate (
  id text primary key,
  source_id text not null references career_source_candidate(id),
  object_family text not null check (object_family in ('OPPORTUNITY','LEARNING_RESOURCE','MARKET_OBSERVATION','JURISDICTION_REQUIREMENT','EDITORIAL_SOURCE')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  input_count integer not null default 0 check (input_count >= 0),
  accepted_count integer not null default 0 check (accepted_count >= 0),
  rejected_count integer not null default 0 check (rejected_count >= 0),
  deduplicated_count integer not null default 0 check (deduplicated_count >= 0),
  state text not null check (state in ('PLANNED','IMPORTED','VALIDATED','REJECTED','HOLD_HUMAN')),
  evidence_ref text
);

create table if not exists career_opportunity_candidate (
  id text primary key,
  type_id text not null references career_opportunity_type_candidate(id),
  source_id text not null references career_source_candidate(id),
  ingestion_run_id text references career_ingestion_run_candidate(id),
  title text not null,
  organization text not null,
  jurisdiction text not null,
  location_text text,
  source_locator text not null,
  published_at timestamptz,
  expires_at timestamptz,
  dedupe_key text not null unique,
  status text not null check (status in ('SOURCE_QUALIFIED','EVIDENCE_BOUND','EXPIRED','HOLD_HUMAN','RETIRED'))
);

create table if not exists career_learning_resource_candidate (
  id text primary key,
  resource_type_id text not null references career_learning_resource_type_candidate(id),
  source_id text not null references career_source_candidate(id),
  ingestion_run_id text references career_ingestion_run_candidate(id),
  title text not null,
  provider text not null,
  modality text,
  workload_text text,
  price_text text,
  jurisdiction text not null,
  source_locator text not null,
  available_from timestamptz,
  available_until timestamptz,
  dedupe_key text not null unique,
  status text not null check (status in ('SOURCE_QUALIFIED','EVIDENCE_BOUND','EXPIRED','HOLD_HUMAN','RETIRED'))
);

create table if not exists career_market_observation_candidate (
  id text primary key,
  signal_id text not null references career_market_signal_candidate(id),
  source_id text not null references career_source_candidate(id),
  ingestion_run_id text references career_ingestion_run_candidate(id),
  role_ref text references career_role_candidate(id),
  jurisdiction text not null,
  statistic_kind text not null check (statistic_kind in ('POSTED_SALARY','OFFICIAL_STATISTIC','SURVEY_ESTIMATE','MARKET_INDEX')),
  observed_value numeric not null,
  unit text not null,
  period_start date,
  period_end date,
  methodology_note text not null,
  status text not null check (status in ('SOURCE_QUALIFIED','EVIDENCE_BOUND','HOLD_HUMAN','RETIRED'))
);

create table if not exists career_projection_contract_candidate (
  id text primary key,
  projection_kind text not null check (projection_kind in ('CV','COVER_LETTER','PORTFOLIO','PROFESSIONAL_SUMMARY','EDITORIAL','YOUTH_GUIDE')),
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  source_object_family text not null,
  cko_projection_schema_ref text not null,
  editorial_projection_schema_ref text,
  allowed_channels text not null,
  sources_gate text not null check (sources_gate in ('PASS','HOLD','FAIL','NOT_APPLICABLE')),
  rights_gate text not null check (rights_gate in ('PASS','HOLD','FAIL','NOT_APPLICABLE')),
  a11y_gate text not null check (a11y_gate in ('PASS','HOLD','FAIL','NOT_APPLICABLE')),
  privacy_gate text not null check (privacy_gate in ('PASS','HOLD','FAIL','NOT_APPLICABLE')),
  human_gate text not null check (human_gate in ('PASS','HOLD','FAIL','NOT_APPLICABLE')),
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN','ASSURED'))
);

create table if not exists career_capability_governance_candidate (
  id text primary key,
  capability_ref text not null,
  identity_required boolean not null default false,
  consent_required boolean not null default false,
  moderation_required boolean not null default false,
  report_required boolean not null default false,
  block_required boolean not null default false,
  audit_log_required boolean not null default true,
  retention_policy_required boolean not null default true,
  age_policy_required boolean not null default false,
  status text not null check (status in ('CANDIDATE','HOLD_HUMAN','ASSURED'))
);

create table if not exists research_project_candidate (
  id text primary key,
  title text not null,
  summary text not null default '',
  research_type text not null check (research_type in ('QUALITATIVE','QUANTITATIVE','MIXED','REVIEW','IMPLEMENTATION','OTHER')),
  status text not null check (status in ('CANDIDATE','DRAFT','HOLD_HUMAN','READY_FOR_REVIEW')),
  ethics_state text not null check (ethics_state in ('UNASSESSED','REQUIRES_HUMAN_CHECK','DOCUMENTED_NOT_APPLICABLE','APPROVAL_RECORDED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists research_instrument_candidate (
  id text primary key,
  project_id text references research_project_candidate(id),
  kind text not null check (kind in ('SURVEY','INTERVIEW','OBSERVATION','FORM','CHECKLIST','OTHER')),
  title text not null,
  definition_text text not null default '',
  status text not null check (status in ('CANDIDATE','DRAFT','HOLD_HUMAN','READY_FOR_REVIEW')),
  created_at timestamptz not null default now()
);

create table if not exists research_risk_candidate (
  id text primary key,
  project_id text references research_project_candidate(id),
  category text not null check (category in ('ETHICS','PRIVACY','METHOD','FINANCIAL','REPUTATION','SECURITY','BIAS','OTHER')),
  description text not null,
  likelihood smallint not null check (likelihood between 1 and 5),
  impact smallint not null check (impact between 1 and 5),
  treatment text not null default '',
  status text not null check (status in ('OPEN','MITIGATING','HOLD_HUMAN','CLOSED_CANDIDATE')),
  created_at timestamptz not null default now()
);

create table if not exists research_skill_need_candidate (
  id text primary key,
  project_id text references research_project_candidate(id),
  skill text not null,
  priority text not null check (priority in ('LOW','MEDIUM','HIGH','CRITICAL')),
  coverage_state text not null check (coverage_state in ('GAP','PARTIAL','COVERED','REVIEW_REQUIRED'))
);

create table if not exists participation_process_candidate (
  id text primary key,
  title text not null,
  description text not null,
  status text not null check (status in ('CANDIDATE','DRAFT','OPEN_CANDIDATE','CLOSED_CANDIDATE','HOLD_HUMAN')),
  official boolean not null default false,
  normative_ref text,
  created_at timestamptz not null default now()
);

create table if not exists participation_statement_candidate (
  id text primary key,
  process_id text not null references participation_process_candidate(id),
  statement text not null,
  display_order integer not null default 0,
  active boolean not null default true
);

create table if not exists participation_contribution_candidate (
  id text primary key,
  process_id text not null references participation_process_candidate(id),
  participant_key text not null,
  contribution_kind text not null check (contribution_kind in ('PULSE','EXPERIENCE','COMMENT','EVIDENCE_NOTE')),
  body text not null default '',
  payload_text text not null default '',
  moderation_status text not null default 'RECEIVED' check (moderation_status in ('RECEIVED','REVIEW_REQUIRED','ACCEPTED_CANDIDATE','HIDDEN_CANDIDATE')),
  created_at timestamptz not null default now()
);

create table if not exists participation_proposal_candidate (
  id text primary key,
  process_id text not null references participation_process_candidate(id),
  participant_key text not null,
  title text not null,
  problem text not null,
  proposal text not null,
  status text not null default 'RECEIVED' check (status in ('RECEIVED','REVIEW_REQUIRED','COMMUNITY_PRIORITY','REFERRED_CANDIDATE','CLOSED_CANDIDATE')),
  created_at timestamptz not null default now()
);

create table if not exists participation_reaction_candidate (
  id text primary key,
  proposal_id text not null references participation_proposal_candidate(id),
  participant_key text not null,
  reaction text not null check (reaction in ('SUPPORT','CONCERN')),
  created_at timestamptz not null default now(),
  unique (proposal_id, participant_key)
);

create table if not exists participation_consensus_vote_candidate (
  id text primary key,
  process_id text not null references participation_process_candidate(id),
  statement_id text not null references participation_statement_candidate(id),
  participant_key text not null,
  position text not null check (position in ('AGREE','DISAGREE','UNSURE')),
  profile text not null default 'NAO_INFORMADO',
  region text not null default 'NAO_INFORMADO',
  created_at timestamptz not null default now(),
  unique (statement_id, participant_key)
);

create table if not exists participation_outcome_candidate (
  id text primary key,
  process_id text not null references participation_process_candidate(id),
  title text not null,
  summary text not null,
  outcome_state text not null check (outcome_state in ('COMMUNITY_SYNTHESIS','REFERRED_CANDIDATE','OFFICIAL_RESPONSE_VERIFIED','CLOSED_CANDIDATE')),
  official_evidence_ref text,
  published_at timestamptz not null default now()
);

create table if not exists career_editorial_document_candidate (
  id text primary key,
  editorial_id text not null references career_editorial_candidate(id),
  slug text not null unique,
  template_id text not null,
  locale text not null default 'pt-BR',
  audience text not null check (audience in ('PROFESSIONAL','YOUTH','BOTH')),
  title text not null,
  lead text not null,
  source_gate text not null check (source_gate in ('PASS','HOLD','FAIL')),
  human_gate text not null check (human_gate in ('PASS','HOLD','FAIL')),
  status text not null check (status in ('DRAFT_CANDIDATE','HOLD_HUMAN','ASSURED')),
  updated_at date not null default current_date
);

create table if not exists career_editorial_block_candidate (
  document_id text not null references career_editorial_document_candidate(id),
  block_order integer not null,
  block_id text not null,
  block_type text not null check (block_type in ('title','lead','section','claim','callout','definition','steps','timeline','comparison','references','reflection','related_content')),
  semantic_role text not null,
  heading text,
  body text not null default '',
  payload_text text not null default '',
  source_mode text not null check (source_mode in ('canonical_object','claim','evidence','visual_resource','computed_projection','static_nontechnical_copy')),
  source_refs_text text not null default '',
  primary key(document_id,block_id)
);

create table if not exists career_source_fragment_candidate (
  id text primary key,
  source_id text not null references career_source_candidate(id),
  fact_index integer not null check (fact_index > 0),
  fragment_kind text not null check (fragment_kind in ('PARAPHRASE_ANCHOR','DIRECT_EXCERPT','STRUCTURAL_LOCATOR')),
  locator text not null,
  locator_status text not null check (locator_status in ('VERIFIED','HOLD_HUMAN')),
  normalized_text text not null,
  source_sha256 text not null check (source_sha256 ~ '^[a-f0-9]{64}$'),
  fragment_sha256 text not null check (fragment_sha256 ~ '^[a-f0-9]{64}$'),
  status text not null check (status in ('CANDIDATE','REVIEW_REQUIRED','HOLD_HUMAN','EVIDENCE_BOUND')),
  unique(source_id,fact_index)
);

create table if not exists career_atomic_fact_candidate (
  id text primary key,
  fragment_id text not null references career_source_fragment_candidate(id),
  source_id text not null references career_source_candidate(id),
  normalized_statement text not null,
  fact_type text not null check (fact_type in ('REGULATORY','EDUCATIONAL','NONCLINICAL')),
  subject_key text not null,
  predicate_key text not null,
  object_value text not null,
  jurisdiction text not null,
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  status text not null check (status in ('CANDIDATE','REVIEW_REQUIRED','HOLD_HUMAN','EVIDENCE_BOUND')),
  review text not null check (review in ('PENDING','EDITORIAL_APPROVED','REJECTED'))
);

create table if not exists career_claim_candidate (
  canonical_id text primary key,
  version text not null,
  status text not null check (status in ('CANDIDATE','DRAFT','SOURCE_QUALIFIED','EVIDENCE_BOUND','REVIEW_REQUIRED','HOLD_HUMAN','ASSURED','ELIGIBLE_FOR_RELEASE','RELEASED','RETIRED')),
  updated_at date not null,
  provenance_refs text not null,
  object_id text not null,
  assertion_key text not null,
  source_ids text not null,
  binding_ids text not null,
  jurisdiction text not null,
  applicability text not null,
  review text not null check (review in ('PENDING','CLINICAL_APPROVED','EDITORIAL_APPROVED','REJECTED')),
  claim_type text check (claim_type in ('CLINICAL','ANATOMICAL','EDUCATIONAL','REGULATORY','NONCLINICAL')),
  confidence_framework_ref text,
  atomic_fact_id text not null references career_atomic_fact_candidate(id)
);

create table if not exists career_evidence_bundle_candidate (
  id text primary key,
  claim_id text not null references career_claim_candidate(canonical_id),
  source_id text not null references career_source_candidate(id),
  fragment_id text not null references career_source_fragment_candidate(id),
  atomic_fact_id text not null references career_atomic_fact_candidate(id),
  source_sha256 text not null check (source_sha256 ~ '^[a-f0-9]{64}$'),
  fragment_sha256 text not null check (fragment_sha256 ~ '^[a-f0-9]{64}$'),
  fact_sha256 text not null check (fact_sha256 ~ '^[a-f0-9]{64}$'),
  lineage_path text not null,
  status text not null check (status in ('CANDIDATE','REVIEW_REQUIRED','HOLD_HUMAN','EVIDENCE_BOUND','ASSURED')),
  review text not null check (review in ('PENDING','APPROVED','REJECTED'))
);

create table if not exists career_content_claim_binding_candidate (
  document_id text not null references career_editorial_document_candidate(id),
  block_id text not null,
  claim_id text not null references career_claim_candidate(canonical_id),
  binding_role text not null check (binding_role in ('SUPPORTS','CONTEXT','LIMITS')),
  status text not null check (status in ('CANDIDATE','REVIEW_REQUIRED','HOLD_HUMAN','EVIDENCE_BOUND')),
  primary key(document_id,block_id,claim_id)
);

create table if not exists career_review_item_candidate (
  id text primary key,
  item_kind text not null check (item_kind in ('CLAIM','EDITORIAL_DOCUMENT')),
  target_id text not null,
  review_area text not null check (review_area in ('REGULATORY','EDUCATIONAL','EDITORIAL')),
  decision text not null check (decision in ('PENDING','APPROVED','REJECTED','HOLD')),
  required_role text not null,
  evidence_ref text,
  reviewed_at timestamptz,
  status text not null check (status in ('REVIEW_REQUIRED','HOLD_HUMAN','ASSURED'))
);

create table if not exists career_release_gate_candidate (
  canonical_id text primary key,
  version text not null,
  status text not null check (status in ('CANDIDATE','DRAFT','SOURCE_QUALIFIED','EVIDENCE_BOUND','REVIEW_REQUIRED','HOLD_HUMAN','ASSURED','ELIGIBLE_FOR_RELEASE','RELEASED','RETIRED')),
  updated_at date not null,
  provenance_refs text not null,
  upstream_gate_refs text not null,
  required_approvals text not null,
  evidence_bundle_refs text not null,
  decision text not null check (decision in ('HOLD','REJECTED','APPROVED')),
  replay_hash text not null check (replay_hash ~ '^[a-f0-9]{64}$'),
  deployment_scope text not null,
  reviewed_by text
);

create table if not exists career_publication_candidate (
  canonical_id text primary key,
  version text not null,
  status text not null check (status in ('CANDIDATE','DRAFT','SOURCE_QUALIFIED','EVIDENCE_BOUND','REVIEW_REQUIRED','HOLD_HUMAN','ASSURED','ELIGIBLE_FOR_RELEASE','RELEASED','RETIRED')),
  updated_at date not null,
  provenance_refs text not null,
  artifact_id text not null,
  resolved_projection_id text not null,
  required_gate_ids text not null,
  gate_results text not null,
  human_approval text not null check (human_approval in ('PENDING','APPROVED','REJECTED')),
  output_sha256 text not null check (output_sha256 ~ '^[a-f0-9]{64}$'),
  deployment_target text,
  release_ref text
);

create table if not exists kernel_order_criterion (
  order_id text not null references kernel_order (id) on delete cascade,
  position integer not null,
  criterion text not null,
  primary key (order_id, position)
);

insert into schema_entity (name, layer_id, primary_key, purpose, links) values
  ('career_projection_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_module_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_projection_item_candidate', 'candidato', 'projection_id + module_id', 'Candidato ainda não admitido.', ''),
  ('career_role_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_skill_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_role_skill_candidate', 'candidato', 'role_id + skill_id', 'Candidato ainda não admitido.', ''),
  ('career_path_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_path_step_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_opportunity_type_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_credential_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_document_template_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_market_signal_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_editorial_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_reflection_question_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_profile_candidate', 'candidato', 'participant_key', 'Candidato ainda não admitido.', ''),
  ('career_profile_skill_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_application_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_profile_credential_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_milestone_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_learning_resource_type_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_interview_scenario_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_network_capability_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_jurisdiction_requirement_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_worklife_capability_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_youth_activity_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_source_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_authority_binding_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_ingestion_run_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_opportunity_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_learning_resource_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_market_observation_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_projection_contract_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_capability_governance_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('research_project_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('research_instrument_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('research_risk_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('research_skill_need_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('participation_process_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('participation_statement_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('participation_contribution_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('participation_proposal_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('participation_reaction_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('participation_consensus_vote_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('participation_outcome_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_editorial_document_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_editorial_block_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_source_fragment_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_atomic_fact_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_claim_candidate', 'candidato', 'canonical_id', 'Candidato ainda não admitido.', ''),
  ('career_evidence_bundle_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_content_claim_binding_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_review_item_candidate', 'candidato', 'id', 'Candidato ainda não admitido.', ''),
  ('career_release_gate_candidate', 'candidato', 'canonical_id', 'Candidato ainda não admitido.', ''),
  ('career_publication_candidate', 'candidato', 'canonical_id', 'Candidato ainda não admitido.', ''),
  ('kernel_order_criterion', 'candidato', 'order_id + position', 'Candidato ainda não admitido.', '')
on conflict (name) do nothing;

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
select
  physical.table_name,
  physical.column_name,
  case physical.data_type
    when 'boolean' then 'booleano'
    when 'integer' then 'inteiro'
    when 'bigint' then 'inteiro'
    when 'smallint' then 'inteiro'
    when 'timestamp with time zone' then 'instante'
    when 'text' then 'texto'
    else physical.data_type
  end,
  physical.is_nullable = 'NO',
  exists (
    select 1
    from information_schema.table_constraints as key_row
    join information_schema.key_column_usage as key_column
      on key_column.constraint_name = key_row.constraint_name
     and key_column.table_schema = key_row.table_schema
     and key_column.table_name = key_row.table_name
    where key_row.table_schema = 'public'
      and key_row.table_name = physical.table_name
      and key_row.constraint_type = 'PRIMARY KEY'
      and key_column.column_name = physical.column_name
  ),
  null,
  'Coluna física sem definição humana.',
  physical.data_type,
  null
from information_schema.columns as physical
join schema_entity as entity on entity.name = physical.table_name
where physical.table_schema = 'public'
  and not exists (
    select 1 from schema_column as known
    where known.entity = physical.table_name and known.name = physical.column_name
  );

insert into metadata_element (entity, name, support_id)
select column_row.entity, column_row.name, 'politica-metadado'
from schema_column as column_row
where not exists (
  select 1 from metadata_element as element
  where element.entity = column_row.entity and element.name = column_row.name
)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
select
  parent_table.relname,
  'fk-' || constraint_row.conname,
  child_table.relname,
  case
    when (
      select count(*) = 1
      from pg_index as index_row
      join pg_attribute as indexed
        on indexed.attrelid = index_row.indrelid and indexed.attnum = any (index_row.indkey)
      where index_row.indrelid = constraint_row.conrelid
        and index_row.indisunique
        and indexed.attname = child_attribute.attname
        and (
          select count(*)
          from pg_attribute as only_one
          where only_one.attrelid = index_row.indrelid
            and only_one.attnum = any (index_row.indkey)
            and only_one.attnum > 0
        ) = 1
    ) then '1:1'
    else '1:N'
  end,
  parent_attribute.attname,
  child_attribute.attname,
  'Ligação lida da chave estrangeira ' || constraint_row.conname || '.'
from pg_constraint as constraint_row
join pg_class as child_table on child_table.oid = constraint_row.conrelid
join pg_class as parent_table on parent_table.oid = constraint_row.confrelid
join pg_namespace as namespace on namespace.oid = child_table.relnamespace
join lateral unnest(constraint_row.conkey) with ordinality as child_key(attnum, ord) on true
join pg_attribute as child_attribute
  on child_attribute.attrelid = child_table.oid and child_attribute.attnum = child_key.attnum
join lateral unnest(constraint_row.confkey) with ordinality as parent_key(attnum, ord)
  on parent_key.ord = child_key.ord
join pg_attribute as parent_attribute
  on parent_attribute.attrelid = parent_table.oid and parent_attribute.attnum = parent_key.attnum
where constraint_row.contype = 'f'
  and namespace.nspname = 'public'
  and child_key.ord = 1
  and not exists (
    select 1 from schema_relation as known
    where (
      known.from_entity = parent_table.relname
      and known.to_entity = child_table.relname
      and known.from_column = parent_attribute.attname
      and known.to_column = child_attribute.attname
    ) or (
      known.from_entity = child_table.relname
      and known.to_entity = parent_table.relname
      and known.from_column = child_attribute.attname
      and known.to_column = parent_attribute.attname
    )
  )
on conflict (from_entity, name) do nothing;

do $$
declare
  missing text;
  invented text;
begin
  select string_agg(format('%s.%s', child_table.relname, child_attribute.attname), ', ' order by child_table.relname)
    into missing
  from pg_constraint as constraint_row
  join pg_class as child_table on child_table.oid = constraint_row.conrelid
  join pg_class as parent_table on parent_table.oid = constraint_row.confrelid
  join pg_namespace as namespace on namespace.oid = child_table.relnamespace
  join lateral unnest(constraint_row.conkey) with ordinality as child_key(attnum, ord) on child_key.ord = 1
  join pg_attribute as child_attribute
    on child_attribute.attrelid = child_table.oid and child_attribute.attnum = child_key.attnum
  join lateral unnest(constraint_row.confkey) with ordinality as parent_key(attnum, ord) on parent_key.ord = 1
  join pg_attribute as parent_attribute
    on parent_attribute.attrelid = parent_table.oid and parent_attribute.attnum = parent_key.attnum
  where constraint_row.contype = 'f'
    and namespace.nspname = 'public'
    and not exists (
      select 1 from schema_relation as known
      where (
        known.from_entity = parent_table.relname and known.to_entity = child_table.relname
        and known.from_column = parent_attribute.attname and known.to_column = child_attribute.attname
      ) or (
        known.from_entity = child_table.relname and known.to_entity = parent_table.relname
        and known.from_column = child_attribute.attname and known.to_column = parent_attribute.attname
      ) or (
        cardinality(constraint_row.conkey) > 1
        and (
          (known.from_entity = parent_table.relname and known.to_entity = child_table.relname)
          or (known.from_entity = child_table.relname and known.to_entity = parent_table.relname)
        )
      )
    );

  select string_agg(format('%s.%s', relation.from_entity, relation.name), ', ' order by relation.from_entity)
    into invented
  from schema_relation as relation
  where not exists (
    select 1
    from pg_constraint as constraint_row
    join pg_class as child_table on child_table.oid = constraint_row.conrelid
    join pg_class as parent_table on parent_table.oid = constraint_row.confrelid
    join pg_namespace as namespace on namespace.oid = child_table.relnamespace
    join pg_attribute as child_attribute
      on child_attribute.attrelid = child_table.oid and child_attribute.attnum = any (constraint_row.conkey)
    join pg_attribute as parent_attribute
      on parent_attribute.attrelid = parent_table.oid and parent_attribute.attnum = any (constraint_row.confkey)
    where constraint_row.contype = 'f'
      and namespace.nspname = 'public'
      and (
        (relation.from_entity = parent_table.relname and relation.to_entity = child_table.relname
          and relation.from_column = parent_attribute.attname and relation.to_column = child_attribute.attname)
        or (relation.from_entity = child_table.relname and relation.to_entity = parent_table.relname
          and relation.from_column = child_attribute.attname and relation.to_column = parent_attribute.attname)
      )
  );

  if missing is not null or invented is not null then
    raise exception 'dicionario inconsistente. sem relacao: %. relacao sem chave: %', coalesce(missing, ''), coalesce(invented, '');
  end if;
end $$;

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyzeFkTuples } from './lib/fk-tuple-audit.mjs';

test('one-column FK is represented only by matching physical endpoints', () => {
  const fk = {constraint_name:'tool_field_tool_slug_fkey',child_table:'tool_field',
    parent_table:'source_tool',child_columns:['tool_slug'],parent_columns:['slug']};
  const rel = {name:'ferramenta',from_entity:'source_tool',to_entity:'tool_field',
    from_column:'slug',to_column:'tool_slug'};
  const ok = analyzeFkTuples([fk],[rel]);
  assert.equal(ok.completeRelationMetadata,true);
  assert.equal(ok.missingScalar.length,0);
  assert.equal(ok.findings[0].status,'SCALAR_PAIR_REPRESENTED');
  const wrong = analyzeFkTuples([fk],[{...rel,from_column:'other_column'}]);
  assert.equal(wrong.completeRelationMetadata,false);
  assert.equal(wrong.missingScalar.length,1);
});

test('a composite FK stays HOLD even if its first pair is described', () => {
  const fk = {constraint_name:'tool_choice_criterion_fkey',child_table:'tool_choice',
    parent_table:'tool_criterion',child_columns:['tool_slug','criterion_id'],
    parent_columns:['tool_slug','id']};
  const first = {name:'primeira-parte',from_entity:'tool_criterion',to_entity:'tool_choice',
    from_column:'tool_slug',to_column:'tool_slug'};
  const state = analyzeFkTuples([fk],[first]);
  assert.equal(state.compositeForeignKeys,1);
  assert.equal(state.findings[0].firstPairDescribed,true);
  assert.equal(state.findings[0].status,'HOLD_COMPOSITE_TUPLE_UNREPRESENTED');
  assert.equal(state.completeRelationMetadata,false);
});

test('reordering or omitting components cannot be called full-tuple evidence', () => {
  const fk = {constraint_name:'fk',child_table:'child',parent_table:'parent',
    child_columns:['second','first'],parent_columns:['key_b','key_a']};
  const first = {name:'not-first',from_entity:'parent',to_entity:'child',
    from_column:'key_a',to_column:'first'};
  const state = analyzeFkTuples([fk],[first]);
  assert.equal(state.findings[0].firstPairDescribed,false);
  assert.equal(state.findings[0].anyPairRelationNames.length,1);
  assert.equal(state.completeRelationMetadata,false);
  assert.throws(()=>analyzeFkTuples([{...fk,parent_columns:['key_a']}],[]),/Malformed physical FK tuple/);
});

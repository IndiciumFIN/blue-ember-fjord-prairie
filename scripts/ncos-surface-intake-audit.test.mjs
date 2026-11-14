import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { auditCandidateRouteIntake } from './lib/ncos-surface-intake-audit.mjs';
const bytes='export const candidate = true;\n';
const gitSha=createHash('sha1').update(Buffer.from('blob '+Buffer.byteLength(bytes)+'\0'))
  .update(bytes).digest('hex');
const record={file:'x.tsx',sourcePath:'src/routes/x.tsx',gitBlobSha1:gitSha,
  reviewClass:'CE_EDUCATION_SIMULATIONS',gate:'HOLD_HUMAN',admitted:false,
  independentReview:'NOT_PERFORMED',runtimeAccess:'NOT_TESTED',kernelAdmission:'NOT_VERIFIED'};
const base=()=>({
  actual:['x.tsx'],contracted:[],
  intake:{schemaVersion:'1.0.0',routeAdmission:false,clinicalRelease:false,
    records:[{...record}]},
  readRoute:()=>bytes,
});
test('intake labels observed candidates but never clears their HOLD',()=>{
  const state=auditCandidateRouteIntake(base());
  assert.deepEqual(state.findings.map(f=>f.id),['CANDIDATE_ROUTE_HOLD']);
  assert.equal(state.summary.untracked,0);
  assert.equal(state.summary.held,1);
});
test('missing or altered source bytes cannot inherit old review',()=>{
  const state=auditCandidateRouteIntake({...base(),readRoute:()=>bytes+'mutated'});
  assert.equal(state.summary.sourceDrift,1);
  assert.ok(state.findings.some(f=>f.id==='CANDIDATE_SOURCE_DRIFT'));
});
test('unauthorized admission and clinical release never become accepted',()=>{
  const forged=base();
  forged.intake.records[0].admitted=true;
  assert.ok(auditCandidateRouteIntake(forged).findings.some(f=>f.id==='CANDIDATE_AUTHORITY_FORGED'));
  forged.intake.routeAdmission=true;
  assert.deepEqual(auditCandidateRouteIntake(forged).findings.map(f=>f.id),
    ['CANDIDATE_MANIFEST_AUTHORITY_INVALID']);
});
test('untracked route still fails even with another candidate recorded',()=>{
  const candidate=base();
  candidate.actual.push('other.tsx');
  const state=auditCandidateRouteIntake(candidate);
  assert.equal(state.summary.untracked,1);
  assert.ok(state.findings.some(f=>f.id==='UNKNOWN_ROUTE'&&f.route==='other.tsx'));
});
test('out-of-scope labor route remains outside CE, not silently admitted',()=>{
  const candidate=base();
  candidate.intake.records[0].reviewClass='OUT_OF_SCOPE_LABOR_TOOLS';
  candidate.intake.records[0].gate='OUT_OF_SCOPE';
  const state=auditCandidateRouteIntake(candidate);
  assert.ok(state.findings.some(f=>f.id==='OUT_OF_SCOPE_ROUTE_PRESENT'));
  assert.equal(state.summary.excluded,1);
});

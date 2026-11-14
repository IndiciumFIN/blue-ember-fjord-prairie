import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { auditCandidateRouteIntake } from './lib/ncos-surface-intake-audit.mjs';

test('source-audited route intake retains 33 contracts and 20 blocked candidates', () => {
  const root=resolve(import.meta.dirname,'..');
  const dir=join(root,'src/routes');
  const readJson=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
  const actual=readdirSync(dir,{recursive:true}).filter(p=>/\.(ts|tsx)$/.test(p)).sort();
  const contracted=Object.keys(readJson('registers/canonical/surface-contracts.v2.json').entries);
  const intake=readJson('registers/governance/ncos-surface-intake-candidates-20261114.v1.json');
  const check=auditCandidateRouteIntake({
    actual, contracted, intake, readRoute:file=>readFileSync(join(dir,file)),
  });
  assert.equal(actual.length,53,'route universe changed: require new FIND and scope review');
  assert.equal(contracted.length,33,'canonical route count changed without admission');
  assert.equal(check.summary.registered,20);
  assert.equal(check.summary.held,19);
  assert.equal(check.summary.excluded,1);
  assert.equal(check.summary.untracked,0,'new route lacks explicit HOLD');
  assert.equal(check.summary.sourceDrift,0,'candidate Git blob changed');
  assert.equal(check.summary.admitted,0);
  assert.equal(check.findings.length,20);
  assert.ok(check.findings.every(x=>['CANDIDATE_ROUTE_HOLD','OUT_OF_SCOPE_ROUTE_PRESENT'].includes(x.id)),
    'unreviewed, altered or falsely admitted route found');
  assert.equal(intake.routeAdmission,false);
  assert.equal(intake.clinicalRelease,false);
});

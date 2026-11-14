import { createHash } from 'node:crypto';

/**
 * Non-authorizing, fail-closed inspection of candidate routes. Their presence
 * in the intake register does NOT register a canonical route.
 *
 * @typedef {{file:string,sourcePath:string,gitBlobSha1:string,reviewClass:string,
 *  gate:string,admitted:boolean,independentReview:string,runtimeAccess:string,
 *  kernelAdmission:string}} Candidate
 * @typedef {{schemaVersion:string,routeAdmission:boolean,clinicalRelease:boolean,
 *  records:Candidate[]}} Intake
 * @param {{
 *  actual: string[], contracted: string[], intake: Intake,
 *  readRoute: (file:string) => string|Buffer
 * }} args
 */
export function auditCandidateRouteIntake({ actual, contracted, intake, readRoute }) {
  /** @type {Array<{id:string,route?:string,reason?:string}>} */
  const findings=[];
  if(intake?.schemaVersion!=='1.0.0' || intake.routeAdmission!==false
      || intake.clinicalRelease!==false || !Array.isArray(intake.records)) {
    return { findings:[{id:'CANDIDATE_MANIFEST_AUTHORITY_INVALID'}],
      summary:{registered:0,untracked:0,sourceDrift:0,admitted:0,held:0,excluded:0}};
  }
  const routeSet=new Set(actual), canonical=new Set(contracted);
  const seen=new Set();
  let sourceDrift=0,admitted=0,held=0,excluded=0;
  for (const entry of intake.records) {
    if(typeof entry.file!=='string' || !entry.file || entry.sourcePath!=='src/routes/'+entry.file
       || !/^[a-f0-9]{40}$/.test(entry.gitBlobSha1??'') || seen.has(entry.file)) {
      findings.push({id:'CANDIDATE_MANIFEST_RECORD_INVALID',route:String(entry.file??''),reason:'duplicate/path/hash'});
      continue;
    }
    seen.add(entry.file);
    if(!routeSet.has(entry.file)) {
      findings.push({id:'CANDIDATE_FILE_MISSING',route:entry.file});
      continue;
    }
    if(canonical.has(entry.file)) {
      findings.push({id:'CANDIDATE_CONTRACT_CONFLICT',route:entry.file});
    }
    const bytes=Buffer.from(readRoute(entry.file));
    const gitBlob=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
    if(gitBlob!==entry.gitBlobSha1) {
      sourceDrift++;
      findings.push({id:'CANDIDATE_SOURCE_DRIFT',route:entry.file});
    }
    if(entry.admitted!==false || entry.kernelAdmission!=='NOT_VERIFIED'
       || entry.independentReview!=='NOT_PERFORMED') {
      admitted++;
      findings.push({id:'CANDIDATE_AUTHORITY_FORGED',route:entry.file});
    }
    if(entry.gate==='OUT_OF_SCOPE' && entry.reviewClass==='OUT_OF_SCOPE_LABOR_TOOLS') {
      excluded++;
      findings.push({id:'OUT_OF_SCOPE_ROUTE_PRESENT',route:entry.file});
    } else if(typeof entry.gate==='string' && /^HOLD_(SOURCE|RIGHTS|HUMAN|CLINICAL)$/.test(entry.gate)) {
      held++;
      findings.push({id:'CANDIDATE_ROUTE_HOLD',route:entry.file,reason:entry.gate});
    } else {
      findings.push({id:'CANDIDATE_INVALID_GATE',route:entry.file});
    }
  }
  let untracked=0;
  for (const file of actual) {
    if(!canonical.has(file) && !seen.has(file)) {
      untracked++;
      findings.push({id:'UNKNOWN_ROUTE',route:file});
    }
  }
  return {findings,summary:{registered:seen.size,untracked,sourceDrift,admitted,held,excluded}};
}

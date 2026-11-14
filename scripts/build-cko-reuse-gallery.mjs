#!/usr/bin/env node
/** CKO preview only: original canonical skeletons and browser DOM snapshots. No deploy. */
import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { templateCatalog } from '../src/lib/template-catalog.ts';
const root=resolve('.');
const out=resolve('audit/visual/cko-reuse-gallery');
const target=process.env.CKO_GALLERY_ORIGIN || 'http://127.0.0.1:8080';
const url=new URL(target);
if(url.protocol!=='http:' || !['localhost','127.0.0.1','[::1]'].includes(url.hostname) || url.pathname!=='/' || url.search || url.hash)
  throw new Error('Preview must target local HTTP origin');
const hash=x=>createHash('sha256').update(x).digest('hex');
const J=async p=>JSON.parse(await readFile(join(root,p),'utf8'));
const P=async(p,data)=>{await mkdir(dirname(p),{recursive:true});await writeFile(p,data)};
const escape=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const registry=await J('contracts/cko-editorial/registry/template_registry.json');
const components=await J('contracts/cko-editorial/registry/component_registry.json');
const overlays=await J('contracts/cko-editorial/registry/overlay_registry.json');
const officialCss=await readFile(join(root,'contracts/cko-tokens/dist/cko-universal-content-tokens.css'),'utf8');
if(registry.templates.length!==8 || components.components.length!==27 || overlays.overlays.length!==20)
  throw new Error('Core registry counts changed');
await P(join(out,'assets','cko-universal-content-tokens.css'),officialCss);
const responsiveAdapter='@media(max-width:770px){.cko-wrap{min-width:0}.cko-panel{min-width:0;overflow-wrap:anywhere}.cko-table{width:100%;table-layout:fixed}.cko-table th,.cko-table td{white-space:normal!important;overflow-wrap:anywhere}.status{max-width:100%;white-space:normal;overflow-wrap:anywhere}}';
await P(join(out,'assets','cko-responsive-layout-adapter.css'),responsiveAdapter);

const manifest={
 schemaVersion:1,mode:'REVIEW_ONLY',source:'IndiciumFIN/blue-ember-fjord-prairie',
 sourceCommit:process.env.GITHUB_SHA || null,generatedAt:new Date().toISOString(),
 canonicalTemplateRegistry:'contracts/cko-editorial/registry/template_registry.json',
 componentRegistry:'contracts/cko-editorial/registry/component_registry.json',
 overlayRegistry:'contracts/cko-editorial/registry/overlay_registry.json',
 tokenSource:'contracts/cko-tokens/dist/cko-universal-content-tokens.css',
 catalogSource:'src/lib/template-catalog.ts',
 sourceOfTruth:'Original CKO v0.1 skeleton and v0.2 manifest; shared CSS source; actual rendered site pages',
 clinicalReleased:false,published:false,serverFunctionalityInSnapshots:false,
 profiles:[],siteExamples:[],issues:[]
};
manifest.layoutAdapter={path:'assets/cko-responsive-layout-adapter.css',sha256:hash(responsiveAdapter),status:'PREVIEW_ONLY_SHARED_RESPONSIVE_ADAPTER',changesToOriginalSource:false};
const browser=await chromium.launch({headless:true});
const ctx=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
const d={id:'desktop',width:1440,height:900},m={id:'mobile',width:390,height:844};
async function shot(targetPath,dest,vp){
 await mkdir(dirname(dest),{recursive:true});
 const page=await ctx.newPage();
 await page.setViewportSize({width:vp.width,height:vp.height});
 try{
  const errs=[];page.on('pageerror',er=>errs.push(String(er)));
  const response=await page.goto(pathToFileURL(targetPath).href,{waitUntil:'load',timeout:25000});
  const info=await page.evaluate(()=>({width:window.innerWidth,height:window.innerHeight,heading:document.querySelector('h1')?.textContent?.trim() || '',text:(document.body?.innerText||'').trim().length,overflow:document.documentElement.scrollWidth>window.innerWidth+4}));
  if(info.width!==vp.width || info.height!==vp.height)errs.push('VIEWPORT_MISMATCH');
  if(info.text<50)errs.push('EMPTY_RENDER');
  if(info.overflow)errs.push('HORIZONTAL_OVERFLOW');
  await page.screenshot({path:dest,fullPage:true,animations:'disabled',timeout:30000});
  const bytes=await readFile(dest);
  return {viewport:vp.id,file:dest.slice(out.length+1),sha256:hash(bytes),bytes:bytes.length,httpStatus:response?.status() ?? null,render:info,errors:errs};
 }finally{await page.close()}
}
const cssFingerprints=new Set(),validBlocks=new Set(components.components.map(c=>c.block_type));
for(const reg of registry.templates){
 const data=await J('contracts/cko-editorial/'+reg.manifest);
 const original='contracts/cko-skeletons/04-templates-perfis/'+reg.profile+'/'+reg.profile+'.html';
 const html=await readFile(join(root,original),'utf8');
 if(data.template_id!==reg.template_id || data.profile!==reg.profile || data.version!==reg.version || !html.includes(reg.template_id))
  throw new Error('Contract mismatch: '+reg.template_id);
 const styles=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)];
 if(styles.length!==1)throw new Error('Expected original single CSS: '+reg.template_id);
 cssFingerprints.add(hash(styles[0][1]));
 if(cssFingerprints.size>1)throw new Error('Divergent CSS found in CKO skeletons');
 if(manifest.profiles.length===0)await P(join(out,'assets','cko-original-shared.css'),styles[0][1]);
 const converted=html.replace(styles[0][0],'<link rel="stylesheet" href="../assets/cko-universal-content-tokens.css"><link rel="stylesheet" href="../assets/cko-original-shared.css"><link rel="stylesheet" href="../assets/cko-responsive-layout-adapter.css">')
 .replace(/<\/head>/i,'<meta name="cko-contract-version" content="'+escape(reg.version)+'"><meta name="cko-source-html" content="'+escape(original)+'"></head>');
 const htmlPath='perfis/'+reg.template_id+'.html';
 await P(join(out,htmlPath),converted);
 const invalid=(data.allowed_block_types||[]).filter(x=>!validBlocks.has(x));
 const item={id:reg.template_id,profile:reg.profile,version:reg.version,channels:reg.channels,
   originalSource:original,sourceSha256:hash(html),contractManifest:reg.manifest,html:htmlPath,htmlSha256:hash(converted),
   cssSha256:hash(styles[0][1]),identityMatches:true,allowedBlocksValid:invalid.length===0,
   missingBlockTypes:invalid,status:'CANDIDATE_NOT_PUBLISHED',screenshots:[]};
 if(invalid.length)manifest.issues.push({id:item.id,invalidBlockTypes:invalid});
 manifest.profiles.push(item);
}
for(const item of manifest.profiles){
 for(const vp of [d,m]){
  try{item.screenshots.push(await shot(join(out,item.html),join(out,'prints','perfis',item.id+'-'+vp.id+'.png'),vp))}
  catch(er){manifest.issues.push({id:item.id,viewport:vp.id,error:String(er)})}
 }
 console.log('CKO_PROFILE '+item.id+' '+item.screenshots.length);
}
const cssCache=new Map();
async function keepStyle(css){
 const digest=hash(css);
 if(!cssCache.has(digest)){
  const filename='site-'+digest.slice(0,16)+'.css';
  await P(join(out,'assets',filename),css);
  cssCache.set(digest,filename);
 }
 return cssCache.get(digest);
}
const id=x=>String(x).replace(/[^a-zA-Z0-9_-]/g,'_');
const routes=new Map(templateCatalog.map(x=>[x.href,id(x.id)+'.html']));
for(const x of templateCatalog){
 const page=await ctx.newPage();
 await page.setViewportSize({width:d.width,height:d.height});
 const issues=[];page.on('pageerror',er=>issues.push('BROWSER: '+String(er).slice(0,350)));
 let html='',code=null,title='';
 try{
  if(!x.href.startsWith('/') || x.href.startsWith('//'))throw new Error('External URL denied');
  const res=await page.goto(new URL(x.href,url.origin).href,{waitUntil:'domcontentloaded',timeout:25000});
  code=res?.status()??null;
  try{await page.waitForFunction(()=>document.querySelector('h1')?.textContent?.trim() && document.body?.innerText?.trim()?.length>35,{timeout:10000})}
  catch{issues.push('HYDRATION_TIMEOUT')}
  await page.evaluate(()=>document.fonts.ready);
  title=await page.title();html=await page.content();
 }catch(er){issues.push('LIVE_ERROR: '+String(er).slice(0,400))}
 finally{await page.close()}
 const obj={id:x.id,name:x.name,route:x.href,kind:x.kind,
   source:x.source,status:x.situacao,html:'paginas/'+id(x.id)+'.html',screenshots:[],
   htmlType:'STATIC_DOM_SNAPSHOT_NOT_INTERACTIVE',runtimeReusable:false,httpStatus:code,title,issues};
 if(html){
   for(const st of [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]){
     const name=await keepStyle(st[1]);
     html=html.replace(st[0],'<link rel="stylesheet" href="../assets/'+name+'">');
   }
   html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
   html=html.replace(/<link\b(?=[^>]*rel=["']modulepreload["'])[^>]*>/gi,'');
   for(const link of [...html.matchAll(/<link\b(?=[^>]*rel=["']stylesheet["'])[^>]*>/gi)]){
     const href=link[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
     if(!href || href.startsWith('../assets/') || !href.startsWith('/') || href.startsWith('//'))continue;
     try{
       const fetched=await fetch(new URL(href,url.origin));
       if(!fetched.ok){issues.push('CSS_HTTP_'+fetched.status+': '+href);continue}
       const filename=await keepStyle(await fetched.text());
       html=html.replace(link[0],'<link rel="stylesheet" href="../assets/'+filename+'">');
     }catch(er){issues.push('CSS_MISSING: '+href)}
   }
   for(const mat of [...html.matchAll(/\b(src|poster)=["'](\/[^"'<>]+)["']/gi)]){
     const relative=mat[2].split('?')[0].slice(1);
     if(!/^[\w./-]+$/.test(relative)||relative.includes('..'))continue;
     const source=join(root,'public',relative);
     try{
       await access(source);
       const dest=join(out,'assets','public',relative);
       await mkdir(dirname(dest),{recursive:true});
       await copyFile(source,dest);
       html=html.replace(mat[0],mat[1]+'="../assets/public/'+relative+'"');
     }catch{issues.push('MISSING_PUBLIC_ASSET: '+relative)}
   }
   html=html.replace(/<a\b([^>]*?)href=["'](\/[^"'<>]+)["']([^>]*?)>/gi,(_all,before,href,after)=>{
     const local=routes.get(href);
     return '<a'+before+'href="'+(local||escape(href))+'"'+after+'>';
   });
   html=html.replace(/<\/head>/i,'<meta name="robots" content="noindex,nofollow"><meta name="cko-render-state" content="STATIC_SNAPSHOT_ONLY"><meta name="cko-source-route" content="'+escape(x.href)+'"></head>');
   await P(join(out,obj.html),html);
   obj.htmlSha256=hash(html);
   try{obj.screenshots.push(await shot(join(out,obj.html),join(out,'prints','paginas',id(x.id)+'-desktop.png'),d))}
   catch(er){issues.push('SNAPSHOT_CAPTURE: '+String(er).slice(0,350))}
 }
 if(issues.length)manifest.issues.push({id:obj.id,scope:'site-example',issues});
 manifest.siteExamples.push(obj);
 console.log('CKO_SITE '+obj.id+' '+obj.screenshots.length);
}
const galleryCss='<style>body{margin:0;background:var(--cko-bg-subtle);font:16px/1.55 var(--cko-font-body);color:var(--cko-text-primary)}main{max-width:1240px;margin:auto;padding:26px}header{background:var(--cko-brand);color:#fff;padding:26px}header strong{font-size:21px}h1,h2{font-family:var(--cko-font-display)}.row{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:16px;margin:18px 0 30px}.box{border-radius:12px;border:1px solid var(--cko-border-default);background:var(--cko-surface);padding:16px}.box img{width:100%;height:145px;object-fit:contain;background:var(--cko-bg-subtle)}.box a{color:var(--cko-brand);font-weight:700}.box small{display:block;color:var(--cko-text-muted)}.info{padding:18px;background:var(--cko-surface-soft);border:1px solid var(--cko-border-default);border-radius:10px}a:focus-visible{outline:3px solid var(--cko-focus)}</style>';
const profileCards=manifest.profiles.map(x=>'<article class="box"><a href="'+escape(x.html)+'"><img alt="Prévia '+escape(x.profile)+'" src="'+escape(x.screenshots[0]?.file||'')+'">'+escape(x.id)+'</a><small>'+escape(x.profile)+' · '+escape(x.version)+'</small><small>CANDIDATE / NO-DEPLOY</small><a href="'+escape(x.screenshots[0]?.file||'')+'">Print desktop</a> · <a href="'+escape(x.screenshots[1]?.file||'')+'">Mobile</a></article>').join('');
const siteCards=manifest.siteExamples.map(x=>'<article class="box"><a href="'+escape(x.html)+'"><img alt="Página '+escape(x.name)+'" src="'+escape(x.screenshots[0]?.file||'')+'">'+escape(x.name)+'</a><small>'+escape(x.route)+'</small><small>Snapshot estático, não aplicação funcional</small><a href="'+escape(x.screenshots[0]?.file||'')+'">Print</a></article>').join('');
const index='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CKO — revisão canônica</title><link rel="stylesheet" href="assets/cko-universal-content-tokens.css">'+galleryCss+'</head><body><a href="#main">Pular para o catálogo</a><header><strong>Calculadoras de Enfermagem · CKO</strong><p>Prévia documental, sem deploy nem homologação clínica</p></header><main id="main"><h1>Templates CKO: HTML + print</h1><p class="info">8 perfis oficiais com HTML de origem e CSS compartilhado; 41 exemplos de páginas com DOM estático derivado do navegador. Não confundir snapshots com componentes React interativos. Direitos, evidências e aprovação permanecem HOLD.</p><h2>Perfis canônicos: 8</h2><div class="row">'+profileCards+'</div><h2>Páginas do catálogo: '+manifest.siteExamples.length+'</h2><div class="row">'+siteCards+'</div><p><a href="manifest.json">Manifesto JSON</a> · <a href="indice.csv">Índice CSV</a></p></main></body></html>';
await P(join(out,'index.html'),index);
const lines=[['tipo','id','nome','origem','html','print','estado','avisos'],...manifest.profiles.map(x=>['PERFIL',x.id,x.profile,x.originalSource,x.html,x.screenshots[0]?.file||'',x.status,x.missingBlockTypes.join(';')]),...manifest.siteExamples.map(x=>['PAGINA',x.id,x.name,x.route,x.html,x.screenshots[0]?.file||'',x.status,x.issues.join(';')])];
const csv=lines.map(line=>line.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
await P(join(out,'indice.csv'),csv);
await P(join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const allShotIssues=[...manifest.profiles,...manifest.siteExamples].flatMap(obj=>obj.screenshots.map(s=>({id:obj.id,viewport:s.viewport,errors:s.errors}))).filter(x=>x.errors.length);
manifest.visualWarnings=allShotIssues;
await P(join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const summary={profiles:manifest.profiles.length,profileHtml:manifest.profiles.filter(x=>x.htmlSha256).length,profilePng:manifest.profiles.reduce((n,x)=>n+x.screenshots.length,0),siteRows:manifest.siteExamples.length,siteHtml:manifest.siteExamples.filter(x=>x.htmlSha256).length,sitePng:manifest.siteExamples.reduce((n,x)=>n+x.screenshots.length,0),sharedOriginalStyles:cssFingerprints.size,issues:manifest.issues.length};
console.log('CKO_REVIEW_RESULT '+JSON.stringify(summary));
await ctx.close();await browser.close();
if(summary.profileHtml!==8 || summary.profilePng!==16 || summary.siteHtml!==41 || summary.sitePng!==41 || allShotIssues.some(x=>x.errors.includes('VIEWPORT_MISMATCH')))process.exitCode=1;

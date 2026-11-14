#!/usr/bin/env node
/**
 * Browser screenshot atlas for the canonical templateCatalog.
 * Read-only browser, no deployment, no migration and no clinical admission.
 * Every requested catalog row gets an evidence record; failures are explicit.
 */
import { templateCatalog } from "../src/lib/template-catalog.ts";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
import { chromium } from "playwright";

const origin = process.env.CE_SCREENSHOT_ORIGIN || "http://127.0.0.1:8080";
const parsed = new URL(origin);
if (parsed.protocol !== "http:" || !["127.0.0.1","localhost","[::1]"].includes(parsed.hostname)
  || parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.username || parsed.password) {
  throw new Error("Screenshot capture requires a local HTTP origin.");
}
const output = resolve("audit/visual/template-atlas");
await mkdir(output, { recursive: true });
const mobileIds = new Set(["checklist","mapa-mental","podcast","video","curso","protocolo","area-assinante","area-admin","inventario-ferramentas"]);
const captures = templateCatalog.flatMap((item, index) => [
  { item, index: index+1, viewport: { id:"desktop", width: 1440, height: 900 } },
  ...(mobileIds.has(item.id) ? [{ item, index:index+1, viewport:{ id:"mobile", width:390, height:844 } }] : []),
]);
const manifest = {
  schemaVersion:1,
  snapshotKind:"actual-local-browser-screenshot",
  sourceRepository:"IndiciumFIN/blue-ember-fjord-prairie",
  sourceRegistry:"src/lib/template-catalog.ts",
  sourceCommit:process.env.GITHUB_SHA || null,
  origin:parsed.origin,
  createdAt:new Date().toISOString(),
  catalogItems:templateCatalog.length,
  expectedCaptures:captures.length,
  screenshots:[],
  failures:[],
  publicationAuthorization:false,
  clinicalApproval:false,
};
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({serviceWorkers:"block", reducedMotion:"reduce"});
async function capture(job) {
  const {item,viewport,index}=job;
  const page=await context.newPage();
  await page.setViewportSize({width:viewport.width,height:viewport.height});
  const safeId=item.id.replace(/[^-a-z0-9]/gi,"_");
  const name=`${String(index).padStart(2,"0")}-${safeId}-${viewport.id}.png`;
  const errors=[];
  const entry={index, id:item.id, name:item.name, route:item.href, kind:item.kind, frame:item.frame,
    catalogState:item.situacao, viewport:viewport.id, file:name, httpStatus:null, pageTitle:null,
    textLength:0, hasHeading:false, screenshotSha256:null, screenshotBytes:0,
    renderState:"UNKNOWN", browserErrors:errors};
  page.on("pageerror",e=>errors.push(String(e).slice(0,500)));
  try {
    if (!item.href.startsWith("/") || item.href.startsWith("//")) throw new Error("Refused non-local catalog URL");
    const response=await page.goto(new URL(item.href, parsed.origin).href,{waitUntil:"domcontentloaded",timeout:25000});
    entry.httpStatus=response?.status() ?? null;
    try {
      await page.waitForFunction(() => {
        const heading=document.querySelector("h1");
        return !!heading?.textContent?.trim() && (document.body?.innerText?.trim()?.length ?? 0)>35;
      },{timeout:16000});
    } catch { errors.push("HYDRATION_OR_HEADING_TIMEOUT"); }
    // Allow font/layout to settle; capture regardless of route HOLD/error to preserve evidence.
    try { await page.evaluate(() => document.fonts.ready); } catch {}
    const details=await page.evaluate(() => ({
      title:document.title, length:(document.body?.innerText || "").trim().length,
      heading:!!document.querySelector("h1")?.textContent?.trim(),
      overflow:document.documentElement.scrollWidth>window.innerWidth+3,
      actualViewport:{width:window.innerWidth,height:window.innerHeight},
    }));
    entry.pageTitle=details.title;
    entry.actualViewport=details.actualViewport;
    if (details.actualViewport.width !== viewport.width || details.actualViewport.height !== viewport.height) {
      errors.push("VIEWPORT_MISMATCH");
    }
    entry.textLength=details.length;
    entry.hasHeading=details.heading;
    if(details.overflow) errors.push("HORIZONTAL_OVERFLOW");
    entry.renderState=(entry.httpStatus===200 && details.heading && details.length>35)?"RENDERED":"INCOMPLETE_RENDER";
    await page.screenshot({path:join(output,name),fullPage:true,animations:"disabled",timeout:25000});
    const bytes=await readFile(join(output,name));
    entry.screenshotSha256=createHash("sha256").update(bytes).digest("hex");
    entry.screenshotBytes=bytes.length;
  } catch(error) {
    entry.renderState="CAPTURE_ERROR";
    errors.push(String(error).slice(0,700));
    try {
      await page.screenshot({path:join(output,name),fullPage:true,animations:"disabled",timeout:7000});
      const bytes=await readFile(join(output,name));
      entry.screenshotSha256=createHash("sha256").update(bytes).digest("hex");
      entry.screenshotBytes=bytes.length;
    } catch(error2) { errors.push("FAILED_TO_CAPTURE: "+String(error2).slice(0,400)); }
  } finally {
    await page.close();
  }
  return entry;
}
try {
  // Limit parallel page work to protect PGlite/local dev resource consumption.
  const workers=2;
  let next=0;
  async function worker() {
    while(next<captures.length) {
      const job=captures[next++];
      const entry=await capture(job);
      manifest.screenshots.push(entry);
      if(entry.renderState!=="RENDERED" || entry.browserErrors.length) manifest.failures.push({
        id:entry.id,viewport:entry.viewport,state:entry.renderState,errors:entry.browserErrors,
      });
      console.log(`${entry.renderState} ${entry.id} [${entry.viewport}] ${entry.httpStatus ?? "no-http"} - ${entry.file}`);
    }
  }
  await Promise.all(Array.from({length:workers},()=>worker()));
} finally {
  await context.close();
  await browser.close();
  manifest.screenshots.sort((a,b)=>a.index-b.index || a.viewport.localeCompare(b.viewport));
  await writeFile(join(output,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
  const csv=["index,id,name,route,viewport,state,httpStatus,file,sha256",
    ...manifest.screenshots.map(x=>[x.index,x.id,x.name,x.route,x.viewport,x.renderState,x.httpStatus??"",x.file,x.screenshotSha256??""]
      .map(v=>'"'+String(v).replaceAll('"','""')+'"').join(","))].join("\n")+"\n";
  await writeFile(join(output,"index.csv"),csv);
  console.log("ATLAS_RESULT "+JSON.stringify({
    catalogItems:manifest.catalogItems,expected:manifest.expectedCaptures,
    screenshots:manifest.screenshots.filter(x=>x.screenshotSha256).length,
    rendered:manifest.screenshots.filter(x=>x.renderState==="RENDERED").length,
    issues:manifest.failures.length,output,
  }));
}

#!/usr/bin/env node
/** Aceitação no navegador: a página publicada calcula o mesmo número do motor. */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.CLINICAL_E2E_BASE_URL || "http://127.0.0.1:8080";

async function open(page, slug) {
  const response = await page.goto(`${base}/ferramentas/${slug}`, { waitUntil: "networkidle", timeout: 30000 });
  return response?.status() ?? 0;
}

async function patient(page) {
  await page.locator("#campo-nome").fill("Ana");
  await page.locator("#campo-setor").fill("Leito 2");
  await page.locator("#campo-data").fill("2026-11-13");
}

async function mark(page, legend, label) {
  const group = page.getByRole("group", { name: legend });
  await group.getByRole("radio", { name: label }).check();
}

async function markScale(page, legend, label) {
  const group = page.getByRole("group", { name: legend });
  await group.getByRole("radio", { name: new RegExp(`^\\d+\\s+${label}$`) }).check();
}

async function score(page) {
  return (await page.locator(".score-num").innerText()).replace(/\s+/g, "");
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const failures = [];
page.on("pageerror", (error) => failures.push(error.message));

try {
  assert.equal(await open(page, "imc"), 200);
  await page.getByRole("heading", { level: 1, name: /IMC/ }).waitFor();
  await page.locator("#campo-peso").fill("70");
  await page.locator("#campo-altura").fill("170");
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.locator(".score-pill", { hasText: "Adequado" }).waitFor();
  assert.equal(await score(page), "24,2");

  await page.locator("#campo-peso").fill("abc");
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.getByText("Informe um número.").waitFor();

  assert.equal(await open(page, "gotejamento"), 200);
  await page.getByRole("heading", { level: 1, name: /Gotejamento/ }).waitFor();
  await page.locator("#campo-volume").fill("500");
  await page.locator("#campo-horas").fill("2");
  await page.locator("#campo-minutos").fill("0");
  await mark(page, "Equipo", "Macrogotas (20 gotas/mL)");
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.locator(".score-card").waitFor();
  const drip = await page.locator(".score-num").allInnerTexts();
  assert.deepEqual(drip.map((item) => item.replace(/\s+/g, "")), ["250,0", "83"]);
  await page.locator("#resultado").getByText("Número reduzido.").waitFor();

  await page.locator("#campo-horas").fill("0");
  await page.locator("#campo-minutos").fill("0");
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.locator("#resultado").getByText("Informe um tempo maior que zero.").waitFor();

  await page.locator("#campo-volume").fill("100");
  await page.locator("#campo-horas").fill("1");
  await page.locator("#campo-minutos").fill("30");
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.locator(".score-card").waitFor();
  const mixed = await page.locator(".score-num").allInnerTexts();
  assert.deepEqual(mixed.map((item) => item.replace(/\s+/g, "")), ["66,7", "22"]);

  assert.equal(await open(page, "braden"), 200);
  await page.getByRole("heading", { level: 1, name: /Braden/ }).waitFor();
  await patient(page);
  await page.locator("#campo-idade").fill("não");
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.getByText("Informe a idade em anos ou deixe em branco.").waitFor();
  await page.locator("#campo-idade").fill("");
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.getByText("Escolha uma opção.").first().waitFor();
  assert.equal(await page.getByText("Escolha uma opção.").count(), 6);
  assert.equal(await page.locator(".score-card").count(), 0);
  for (const [legend, label] of [
    ["Percepção sensorial", "Completamente limitada"],
    ["Umidade", "Completamente molhada"],
    ["Atividade", "Acamado"],
    ["Mobilidade", "Completamente imóvel"],
    ["Nutrição", "Muito pobre"],
    ["Fricção e cisalhamento", "Problema"],
  ]) await markScale(page, legend, label);
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.locator(".score-pill", { hasText: "Risco muito alto" }).waitFor();
  assert.equal(await score(page), "6/23");

  assert.equal(await open(page, "morse"), 200);
  await page.getByRole("heading", { level: 1, name: /Morse/ }).waitFor();
  await patient(page);
  for (const [legend, label] of [
    ["Histórico de quedas", "Não"],
    ["Diagnóstico secundário", "Não"],
    ["Auxílio na deambulação", "Nenhum, acamado ou auxílio da enfermagem"],
    ["Terapia endovenosa", "Não"],
    ["Marcha", "Normal, acamado ou cadeira de rodas"],
    ["Estado mental", "Orientado quanto à capacidade"],
  ]) await markScale(page, legend, label);
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.locator(".score-pill", { hasText: "Risco baixo" }).waitFor();
  assert.equal(await score(page), "0/125");

  assert.equal(await open(page, "apgar"), 200);
  await page.getByRole("heading", { level: 1, name: /Apgar/ }).waitFor();
  await patient(page);
  for (const [legend, label] of [
    ["Frequência cardíaca", "Ausente"],
    ["Respiração", "Ausente"],
    ["Tônus muscular", "Flácido"],
    ["Irritabilidade reflexa", "Sem resposta"],
    ["Cor", "Cianótico ou pálido"],
  ]) await markScale(page, legend, label);
  await page.getByRole("button", { name: "Calcular" }).click();
  await page.locator(".score-pill", { hasText: "Depressão grave" }).waitFor();
  assert.equal(await score(page), "0/10");

  assert.equal(await open(page, "aldrete"), 404);
  await page.getByRole("heading", { name: "Página não encontrada" }).waitFor();
  assert.equal(failures.length, 0, failures.join("\n"));
  console.log("aceitação clínica: imc, gotejamento, braden, morse e apgar passaram; aldrete permanece fora do ar");
} finally {
  await browser.close();
}

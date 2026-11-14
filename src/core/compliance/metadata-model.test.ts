import assert from "node:assert/strict";
import test from "node:test";
import { auditMetadataModel } from "./metadata-model.ts";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("o elemento de metadado liga coluna, domínio e documento sem cumprir a norma", async () => {
  const model = auditMetadataModel();
  assert.equal(model.domain, true);
  assert.equal(model.element, true);
  assert.equal(model.bound, true);
  assert.equal(model.identifiers, true);
  assert.equal(model.notLicensed, true);
  assert.equal(model.relations, true);
  assert.equal(model.spine, true);
  assert.equal(model.adherentToNormText, false);
  assert.equal(model.wholeLayer, false);
  assert.equal(model.concluded, true);
  const platform = await auditPlatformConclusion();
  assert.equal(platform.concluded, false);
});

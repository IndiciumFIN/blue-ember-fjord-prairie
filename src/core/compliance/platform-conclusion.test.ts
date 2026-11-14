import assert from "node:assert/strict";
import test from "node:test";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("o plano adere ao dicionário e ao kernel e não se declara concluído", async () => {
  const audit = await auditPlatformConclusion();
  const failed = audit.stages.filter((stage) => stage.id !== "conclusao" && !stage.ok).map((stage) => stage.id);
  assert.deepEqual(failed, []);
  assert.equal(audit.stages.find((stage) => stage.id === "conclusao")?.ok, false);
  assert.equal(audit.adherent, true);
  assert.equal(audit.concluded, false);
});

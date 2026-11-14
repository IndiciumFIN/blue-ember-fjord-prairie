import { matchesSyntax } from "../compliance/semantic.ts";

export type StepKind = "schema" | "engine" | "validator" | "renderer" | "runtime";

export type StepVerdict =
  | { outcome: "admit" }
  | { outcome: "stop"; reason?: string }
  | { outcome: "reject"; reason?: string };

export type Admitted<T> =
  | { ok: true; outcome: "admit"; kind: StepKind; value: T }
  | { ok: false; outcome: "stop"; kind: StepKind; reason: string; value: T }
  | { ok: false; outcome: "reject"; kind: StepKind; reason: string };

/** Admite só o que a checagem aceita. Parada devolve o valor e não conta como sucesso. Recusa não devolve o valor. */
export function admitStep<T>(kind: StepKind, value: T, validate: (value: T) => StepVerdict): Admitted<T> {
  const verdict = validate(value);
  if (verdict.outcome === "admit") return { ok: true, outcome: "admit", kind, value };
  if (verdict.outcome === "stop") return { ok: false, outcome: "stop", kind, reason: verdict.reason ?? `${kind}:parada`, value };
  return { ok: false, outcome: "reject", kind, reason: verdict.reason ?? `${kind}:recusado` };
}

export function admitSyntax(syntax: string, value: unknown) {
  return admitStep("schema", value, () => {
    const result = matchesSyntax(syntax, value);
    return result.ok ? { outcome: "admit" } : { outcome: "reject", reason: result.reason };
  });
}

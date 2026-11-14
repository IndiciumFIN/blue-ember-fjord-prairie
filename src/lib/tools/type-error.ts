const names: Record<string, string> = {
  string: "texto",
  number: "número",
  boolean: "booleano",
  object: "objeto",
  array: "lista",
  date: "data",
};

/** Troca a frase em inglês do tipo errado. Outros erros ficam como estão. */
export function typeErrorMessage(issue: { code: string; message: string; expected?: unknown }) {
  if (issue.code !== "invalid_type") return issue.message;
  const expected = typeof issue.expected === "string" ? names[issue.expected] : undefined;
  return expected ? `O campo precisa ser ${expected}.` : issue.message;
}

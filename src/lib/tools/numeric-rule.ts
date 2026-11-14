/** Regra interna dos identificadores STD-IEEE-754 e STD-ABNT-NBR5891. Não lê o texto dessas normas. */

export function ieeeDecimal(value: number): string {
  if (!Number.isFinite(value)) throw new Error("ieee754:nao-finito");
  if (value === 0) return Object.is(value, -0) ? "-0" : "0";
  const negative = value < 0;
  const match = Math.abs(value).toExponential(15).match(/^(\d)\.(\d+)e([+-]\d+)$/);
  if (!match) throw new Error("ieee754:formato");
  const digits = match[1] + match[2];
  const point = 1 + Number(match[3]);
  const body = point <= 0
    ? `0.${"0".repeat(-point)}${digits}`
    : point >= digits.length
      ? digits + "0".repeat(point - digits.length)
      : `${digits.slice(0, point)}.${digits.slice(point)}`;
  return `${negative ? "-" : ""}${body}`;
}

/** Reduz casas sobre um texto decimal. 5 seguido só de zero vai para o par. 5 seguido de outro dígito sobe. */
export function roundDecimalText(text: string, digits: number): string {
  const match = text.trim().match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (!match || !Number.isInteger(digits) || digits < 0 || digits > 12) throw new Error("nbr5891:texto");
  const sign = match[1];
  let whole = match[2].replace(/^0+(?=\d)/, "");
  const fraction = match[3] ?? "";
  let kept = fraction.slice(0, digits).padEnd(digits, "0");
  const next = fraction[digits] ?? "0";
  const tail = fraction.slice(digits + 1);
  const last = (digits === 0 ? whole.at(-1) : kept.at(-1)) ?? "0";
  const raise = next > "5" || (next === "5" && (/[1-9]/.test(tail) || Number(last) % 2 === 1));
  if (raise) {
    const added = addOne(digits === 0 ? whole : `${whole}${kept}`);
    if (digits === 0) whole = added;
    else {
      whole = added.slice(0, added.length - digits);
      kept = added.slice(-digits);
    }
  }
  if (digits === 0) return `${sign}${whole}`;
  return `${sign}${whole}.${kept}`;
}

function addOne(digits: string) {
  const out = digits.split("");
  for (let index = out.length - 1; index >= 0; index -= 1) {
    if (out[index] !== "9") {
      out[index] = String(Number(out[index]) + 1);
      return out.join("");
    }
    out[index] = "0";
  }
  return `1${out.join("")}`;
}

export const implementedRoundingAttribute = "roundTiesToEven";

const refusedAttributes = ["roundTiesToAway", "roundTowardPositive", "roundTowardNegative", "roundTowardZero"];

/** Só o empate no par está implementado. Outro atributo público não executa. Isso não cumpre a IEEE 754. */
export function acceptRoundingAttribute(attribute: string) {
  if (attribute === implementedRoundingAttribute) return { ok: true as const, attribute };
  if (refusedAttributes.includes(attribute)) return { ok: false as const, message: "O motor só executa roundTiesToEven." };
  return { ok: false as const, message: "Atributo de arredondamento desconhecido." };
}

export function numericFailure(value: unknown) {
  if (typeof value !== "number") return "A fórmula não devolveu todos os resultados.";
  if (Number.isNaN(value)) return "A conta não é um número.";
  if (!Number.isFinite(value)) return "A conta não cabe num número finito.";
  return "";
}

export function roundFinite(value: number, digits: number) {
  return Number(roundDecimalText(ieeeDecimal(value), digits));
}

export function formatNumber(value: number, digits: number) {
  const text = roundDecimalText(ieeeDecimal(value), digits);
  const negative = text.startsWith("-");
  const [whole, fraction] = (negative ? text.slice(1) : text).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const body = fraction === undefined ? grouped : `${grouped},${fraction}`;
  return `${negative ? "-" : ""}${body}`;
}

export type OptionalConsent = { translation: boolean; audience: boolean; memory: boolean };
export type Consent = "unknown" | OptionalConsent;

export const cookieStorageKey = "cde-consent";

export const cookieCategories = [
  { id: "necessary", optional: false, labelKey: "cookieNecessary" },
  { id: "translation", optional: true, labelKey: "cookieTranslation" },
  { id: "audience", optional: true, labelKey: "cookieAudience" },
  { id: "memory", optional: true, labelKey: "cookieMemory" },
] as const;

export type CookieCategoryId = (typeof cookieCategories)[number]["id"];

const empty: OptionalConsent = { translation: false, audience: false, memory: false };

export const memoryKeys = [
  "ce-editorial/forum.v1",
  "ce-forum/user-id",
  "ce-forum/user-name",
  "ce-forum/user-role",
  "ce-sbar/handoffs.v1",
  "ce-education/items.v1",
  "ce-education/flashcards.v1",
  "ce-education/decks.v1",
  "ce-education/simulados.v1",
  "ce-education/history.v1",
  "ce-career/curricula.v1",
  "ce-research/sources.v1",
  "ce-research/references.v1",
  "ce-research/methods.v1",
  "ce.research.participant.v1",
  "ce.research.draft.v1",
  "ce.career.participant.v1",
] as const;

const memoryEvents = ["ce-editorial:change", "ce-sbar:change", "ce-education:change", "ce-career:change", "ce-research:change"];

export function parseConsent(raw: string | null): Consent {
  if (raw === "accepted") return { translation: true, audience: true, memory: true };
  if (raw === "rejected") return empty;
  if (!raw) return "unknown";
  try {
    const parsed = JSON.parse(raw) as Partial<OptionalConsent>;
    if (typeof parsed.translation === "boolean" && typeof parsed.audience === "boolean") {
      return { translation: parsed.translation, audience: parsed.audience, memory: parsed.memory === true };
    }
  } catch {
    /* a broken preference stays unknown so the banner can be shown again */
  }
  return "unknown";
}

export function serializeConsent(value: Consent): string | null {
  if (value === "unknown") return null;
  return JSON.stringify({ translation: value.translation, audience: value.audience, memory: value.memory });
}

export function categoryOn(consent: Consent, id: CookieCategoryId) {
  if (id === "necessary") return true;
  if (consent === "unknown") return false;
  return consent[id];
}

export function allows(id: CookieCategoryId) {
  if (id === "necessary") return true;
  if (typeof localStorage === "undefined") return false;
  return categoryOn(parseConsent(localStorage.getItem(cookieStorageKey)), id);
}

export function applyCookieConsent(value: Consent) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.cookies = value === "unknown" ? "unknown" : "set";
  root.dataset.translation = categoryOn(value, "translation") ? "on" : "off";
  root.dataset.audience = categoryOn(value, "audience") ? "on" : "off";
  root.dataset.memory = categoryOn(value, "memory") ? "on" : "off";
}

export function enforceConsent(value: Consent) {
  applyCookieConsent(value);
  if (value === "unknown" || typeof localStorage === "undefined") return;
  if (!value.memory) {
    for (const key of memoryKeys) localStorage.removeItem(key);
    for (const name of memoryEvents) window.dispatchEvent(new CustomEvent(name, { detail: { key: "*" } }));
  }
  if (!value.translation && typeof sessionStorage !== "undefined") {
    const drop: string[] = [];
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (key?.startsWith("cde-mt:")) drop.push(key);
    }
    for (const key of drop) sessionStorage.removeItem(key);
  }
}

export function syncCookieOffset(banner: HTMLElement | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!banner) {
    root.style.removeProperty("--cookie-offset");
    return;
  }
  root.style.setProperty("--cookie-offset", `${Math.ceil(banner.getBoundingClientRect().height)}px`);
}

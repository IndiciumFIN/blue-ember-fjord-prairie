import { readFileSync } from "node:fs";

const userColumns = ["id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt"];
const sessionColumns = ["id", "expiresAt", "token", "createdAt", "updatedAt", "ipAddress", "userAgent", "userId"];
const accountColumns = ["id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt"];
const verificationColumns = ["id", "identifier", "value", "expiresAt", "createdAt", "updatedAt"];

/** Camada 1 só fecha o dicionário da identidade. Não admite a plataforma. */
export function auditIdentityLayer() {
  const sql = readFileSync(new URL("../../../migrations/0064_identidade.sql", import.meta.url), "utf8");
  const described = (entity: string, columns: string[]) => columns.every((name) => sql.includes(`('${entity}', '${name}',`));
  const relations = sql.includes("('user', 'sessoes', 'session', '1:N', 'id', 'userId'")
    && sql.includes("('user', 'contas', 'account', '1:N', 'id', 'userId'");
  const verificationAlone = sql.includes("Não aponta para user") && !sql.includes("('verification', 'user'");
  return {
    user: described("user", userColumns),
    session: described("session", sessionColumns),
    account: described("account", accountColumns),
    verification: described("verification", verificationColumns),
    relations,
    verificationAlone,
    concluded: described("user", userColumns) && described("session", sessionColumns) && described("account", accountColumns) && described("verification", verificationColumns) && relations && verificationAlone,
  };
}

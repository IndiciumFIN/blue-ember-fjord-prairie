import { readFileSync } from "node:fs";

const memberColumns = ["user_id", "role", "created_at"];
const subscriptionColumns = ["user_id", "status", "updated_at"];
const postColumns = ["id", "user_id", "body", "hidden", "created_at"];

/** Camada 2 fecha o acesso. O papel não vira aprovador do kernel. */
export function auditAccessLayer() {
  const sql = readFileSync(new URL("../../../migrations/0065_acesso.sql", import.meta.url), "utf8");
  const described = (entity: string, columns: string[]) => columns.every((name) => sql.includes(`('${entity}', '${name}',`));
  const relations = sql.includes("('user', 'papel', 'member', '1:1', 'id', 'user_id'")
    && sql.includes("('user', 'assinatura', 'subscription', '1:1', 'id', 'user_id'")
    && sql.includes("('user', 'recados', 'community_post', '1:N', 'id', 'user_id'");
  const notKernel = sql.includes("Não é o aprovador do kernel") && !sql.includes("kernel_order");
  return {
    member: described("member", memberColumns),
    subscription: described("subscription", subscriptionColumns),
    communityPost: described("community_post", postColumns),
    relations,
    notKernel,
    concluded: described("member", memberColumns) && described("subscription", subscriptionColumns) && described("community_post", postColumns) && relations && notKernel,
  };
}

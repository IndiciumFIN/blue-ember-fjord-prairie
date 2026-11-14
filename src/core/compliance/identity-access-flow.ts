import { readFileSync } from "node:fs";
import { auditAccessLayer } from "./access-layer.ts";
import { auditIdentityLayer } from "./identity-layer.ts";

function text(name: string) {
  return readFileSync(new URL(`../../../migrations/${name}`, import.meta.url), "utf8");
}

/** Confere o fluxo das camadas 1 e 2 e a ponte do pedido até a pessoa. A camada 3 não fecha. */
export function auditIdentityAccessFlow() {
  const auth = text("0001_auth.sql");
  const keys = text("0033_cross_keys.sql");
  const bridge = text("0066_pedido_pessoa.sql");
  const identity = auditIdentityLayer();
  const access = auditAccessLayer();
  const sessionAccount = auth.includes('references "user" ("id")') && auth.split('references "user" ("id")').length >= 3;
  const accessKeys = ["member_user_fkey", "subscription_user_fkey", "community_post_user_fkey"].every((name) => keys.includes(name));
  const verificationAlone = !text("0064_identidade.sql").includes("('verification', 'user'");
  const orderPointsToUser = bridge.includes("kernel_order_owner_user_fkey") && bridge.includes("kernel_order_approver_user_fkey");
  const relations = bridge.includes("('user', 'pedidos', 'kernel_order', '1:N', 'id', 'owner_id'")
    && bridge.includes("('user', 'aprovacoes', 'kernel_order', '1:N', 'id', 'approver_id'");
  const sameRoleWord = bridge.includes("set subject_role = 'subscriber'") && bridge.includes("admin, subscriber ou agente");
  const flow = identity.concluded && access.concluded && sessionAccount && accessKeys && verificationAlone && orderPointsToUser && relations && sameRoleWord;
  return {
    identity: identity.concluded,
    access: access.concluded,
    sessionAccount,
    accessKeys,
    verificationAlone,
    orderPointsToUser,
    relations,
    sameRoleWord,
    flow,
    layer3: false,
  };
}

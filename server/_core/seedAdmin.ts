/**
 * Seed admin user: bod / bod@1
 */
import * as db from "../db";
import { hashPassword } from "./authLocal";

const ADMIN_USERNAME = "bod";
const ADMIN_PASSWORD = "bod@1";

export async function ensureAdminExists(): Promise<void> {
  const existing = await db.getUserByUsername(ADMIN_USERNAME);
  if (existing) return;

  const hash = await hashPassword(ADMIN_PASSWORD);
  await db.createUser({
    openId: `local:${ADMIN_USERNAME}`,
    username: ADMIN_USERNAME,
    passwordHash: hash,
    name: "مدير النظام",
    role: "admin",
    accountType: "pro",
    dailyMessagesLimit: 999999,
    dailyImagesLimit: 999999,
  });
  console.log("[Seed] Admin user created: bod");
}

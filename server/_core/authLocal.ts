/**
 * Local authentication - no Manus/OAuth
 * Supports: username+password, phone (OTP-ready), guest
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import bcrypt from "bcryptjs";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

const SALT_ROUNDS = 10;

// Validation rules
export const RULES = {
  password: {
    minLength: 9,
    mustStartWithLetter: true,
    regex: /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
  },
  username: {
    minLength: 6,
    mustStartWithLetter: true,
    regex: /^[a-zA-Z][a-zA-Z0-9_]*$/,
  },
  phone: {
    regex: /^\+\d{10,15}$/, // e.g. +966501234567
  },
} as const;

export function validatePassword(password: string): { ok: boolean; error?: string } {
  if (password.length < RULES.password.minLength) {
    return { ok: false, error: `كلمة السر يجب أن تكون ${RULES.password.minLength} خانات على الأقل` };
  }
  if (!/^[a-zA-Z]/.test(password)) {
    return { ok: false, error: "كلمة السر يجب أن تبدأ بحرف" };
  }
  return { ok: true };
}

export function validateUsername(username: string): { ok: boolean; error?: string } {
  if (username.length < RULES.username.minLength) {
    return { ok: false, error: `اسم المستخدم يجب أن يكون ${RULES.username.minLength} خانات على الأقل` };
  }
  if (!/^[a-zA-Z]/.test(username)) {
    return { ok: false, error: "اسم المستخدم يجب أن يبدأ بحرف" };
  }
  if (!RULES.username.regex.test(username)) {
    return { ok: false, error: "اسم المستخدم: حروف وأرقام وشرطة سفلية فقط" };
  }
  return { ok: true };
}

export function validatePhone(phone: string): { ok: boolean; error?: string } {
  const trimmed = phone.replace(/\s/g, "");
  if (!RULES.phone.regex.test(trimmed)) {
    return { ok: false, error: "رقم الجوال يبدأ بكود الدولة مثل +966 متبوعاً بالرقم" };
  }
  return { ok: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type SessionPayload = {
  userId: number;
  username?: string;
};

function getSessionSecret() {
  const secret = ENV.cookieSecret || "bodrix-local-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const expiresInMs = ONE_YEAR_MS;
  const expirationSeconds = Math.floor((Date.now() + expiresInMs) / 1000);
  return new SignJWT({
    userId: payload.userId,
    username: payload.username ?? "",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSessionSecret());
}

export async function verifySessionToken(
  cookieValue: string | undefined | null
): Promise<SessionPayload | null> {
  if (!cookieValue) return null;
  try {
    const { payload } = await jwtVerify(cookieValue, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    const userId = payload.userId;
    if (typeof userId !== "number") return null;
    return {
      userId,
      username: typeof payload.username === "string" ? payload.username : undefined,
    };
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  if (!cookieHeader) return new Map();
  const parsed = parseCookieHeader(cookieHeader);
  return new Map(Object.entries(parsed));
}

export async function authenticateRequest(req: Request): Promise<User> {
  const cookies = parseCookies(req.headers.cookie);
  const sessionCookie = cookies.get(COOKIE_NAME);
  const session = await verifySessionToken(sessionCookie);

  if (!session) {
    throw ForbiddenError("Invalid session - please login");
  }

  const user = await db.getUserById(session.userId);
  if (!user) {
    throw ForbiddenError("User not found");
  }

  await db.upsertUser({
    openId: user.openId,
    lastSignedIn: new Date(),
  });

  return user;
}

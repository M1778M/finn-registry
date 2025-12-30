import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { db, getDb } from "./db";
import { sessions, authCodes } from "./db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

/**
 * Secure random string
 */
export function generateRandomString(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

/**
 * Generate API key
 */
export function generateApiKey(): string {
  return "fn_" + randomBytes(24).toString("hex");
}

/**
 * Hash API key
 */
export function hashApiKey(key: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(key, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Verify API key
 */
export function verifyApiKey(key: string, hashedKey: string): boolean {
  const [salt, storedHash] = hashedKey.split(":");
  const derivedKey = scryptSync(key, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");
  return timingSafeEqual(derivedKey, storedHashBuffer);
}

/**
 * Calculate content checksum
 */
export function calculateChecksum(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Generate JWT
 */
export async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

/**
 * Verify JWT
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Session management
 */
export async function createSession(userId: string, env?: any) {
  const currentDb = getDb(env);
  const token = generateRandomString(48);
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  const id = crypto.randomUUID();
  await currentDb.insert(sessions).values({
    id,
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function verifySession(token: string, env?: any) {
  const currentDb = getDb(env);
  const session = await currentDb.select().from(sessions).where(eq(sessions.token, token)).get();

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return session;
}

export async function deleteSession(token: string, env?: any) {
  const currentDb = getDb(env);
  await currentDb.delete(sessions).where(eq(sessions.token, token));
}

/**
 * Auth code flow
 */
export async function createAuthCode(userId: string, env?: any) {
  const currentDb = getDb(env);
  const code = generateRandomString(16);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  const id = crypto.randomUUID();
  await currentDb.insert(authCodes).values({
    id,
    userId,
    code,
    expiresAt,
  });

  return code;
}

export async function exchangeAuthCode(code: string, env?: any) {
  const currentDb = getDb(env);
  const authCode = await currentDb.select().from(authCodes).where(eq(authCodes.code, code)).get();

  if (!authCode || authCode.expiresAt < Date.now()) {
    return null;
  }

  // Single use: delete after exchange
  await currentDb.delete(authCodes).where(eq(authCodes.id, authCode.id));

  return authCode.userId;
}

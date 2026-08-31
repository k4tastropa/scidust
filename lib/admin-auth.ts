import "server-only"

import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { compare, hash } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import { sql } from "@/lib/database"

const SESSION_COOKIE = "scidust_admin"
const SESSION_DURATION_SECONDS = 60 * 60 * 8
const MAX_LOGIN_FAILURES = 5
const LOCK_DURATION_MS = 15 * 60 * 1000

type Credential = {
  username: string
  password_hash: string
  session_secret: string
  session_version: number
}

type LoginAttempt = {
  failure_count: number
  locked_until: Date | string | null
}

function sessionKey(secret: string) {
  return new TextEncoder().encode(secret)
}

function lockIsActive(value: Date | string | null) {
  if (!value) {
    return false
  }

  return new Date(value).getTime() > Date.now()
}

async function getCredential(): Promise<Credential> {
  const [existing] = (await sql`
    SELECT username, password_hash, session_secret, session_version
    FROM admin_credentials
    LIMIT 1
  `) as Credential[]

  if (existing) {
    return existing
  }

  const username = process.env.ADMIN_USERNAME
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD

  if (!username || !initialPassword) {
    throw new Error("Admin bootstrap credentials are not configured.")
  }

  const passwordHash = await hash(initialPassword, 12)
  const sessionSecret = randomBytes(32).toString("base64url")
  const [created] = (await sql`
    INSERT INTO admin_credentials (
      username,
      password_hash,
      session_secret,
      session_version
    )
    VALUES (${username}, ${passwordHash}, ${sessionSecret}, 1)
    ON CONFLICT (username) DO NOTHING
    RETURNING username, password_hash, session_secret, session_version
  `) as Credential[]

  if (created) {
    return created
  }

  const [racedCredential] = (await sql`
    SELECT username, password_hash, session_secret, session_version
    FROM admin_credentials
    WHERE username = ${username}
  `) as Credential[]

  if (!racedCredential) {
    throw new Error("Could not initialize admin credentials.")
  }

  return racedCredential
}

async function getClientIdentifier() {
  const requestHeaders = await headers()
  const cfIp = requestHeaders.get("cf-connecting-ip")
  const realIp = requestHeaders.get("x-real-ip")
  const forwardedFor = requestHeaders.get("x-forwarded-for")

  const clientAddress =
    cfIp?.trim() ||
    realIp?.trim() ||
    forwardedFor?.split(",")[0]?.trim() ||
    "unknown"

  return createHash("sha256").update(clientAddress).digest("hex")
}

async function recordFailure(identifier: string) {
  const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS).toISOString()

  await sql`
    INSERT INTO admin_login_attempts (
      identifier,
      failure_count,
      locked_until,
      updated_at
    )
    VALUES (${identifier}, 1, NULL, NOW())
    ON CONFLICT (identifier) DO UPDATE SET
      failure_count = CASE
        WHEN admin_login_attempts.locked_until IS NOT NULL
          AND admin_login_attempts.locked_until <= NOW()
          THEN 1
        ELSE admin_login_attempts.failure_count + 1
      END,
      locked_until = CASE
        WHEN admin_login_attempts.locked_until IS NOT NULL
          AND admin_login_attempts.locked_until <= NOW()
          THEN NULL
        WHEN admin_login_attempts.failure_count + 1 >= ${MAX_LOGIN_FAILURES}
          THEN ${lockedUntil}
        ELSE NULL
      END,
      updated_at = NOW()
  `
}

export async function authenticateAdmin(username: string, password: string) {
  if (
    !username ||
    !password ||
    username.length > 160 ||
    password.length > 256
  ) {
    return { ok: false, reason: "invalid" as const }
  }

  const credential = await getCredential()
  const identifier = await getClientIdentifier()
  const [attempt] = (await sql`
    SELECT failure_count, locked_until
    FROM admin_login_attempts
    WHERE identifier = ${identifier}
  `) as LoginAttempt[]

  if (attempt && lockIsActive(attempt.locked_until)) {
    return { ok: false, reason: "locked" as const }
  }

  // Constant-time username comparison using SHA-256 digests
  const userDigest = createHash("sha256").update(username).digest()
  const expectedDigest = createHash("sha256").update(credential.username).digest()
  const usernameMatches = timingSafeEqual(userDigest, expectedDigest)

  const passwordMatches = await compare(password, credential.password_hash)
  const valid = usernameMatches && passwordMatches

  if (!valid) {
    await recordFailure(identifier)
    return { ok: false, reason: "invalid" as const }
  }

  await sql`
    DELETE FROM admin_login_attempts WHERE identifier = ${identifier}
  `

  return {
    ok: true as const,
    credential,
  }
}

export async function createAdminSession(credential: Credential) {
  const token = await new SignJWT({ version: credential.session_version })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(credential.username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(sessionKey(credential.session_secret))
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  })
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  try {
    const credential = await getCredential()
    const { payload } = await jwtVerify(token, sessionKey(credential.session_secret))

    if (
      payload.sub !== credential.username ||
      payload.version !== credential.session_version
    ) {
      return null
    }

    return { username: credential.username }
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/otherworld/login")
  }

  return session
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  })
}

export async function updateAdminPassword(
  currentPassword: string,
  nextPassword: string
) {
  const session = await getAdminSession()

  if (!session) {
    return false
  }

  const credential = await getCredential()
  const currentPasswordMatches = await compare(
    currentPassword,
    credential.password_hash
  )

  if (!currentPasswordMatches) {
    return false
  }

  const passwordHash = await hash(nextPassword, 12)
  const sessionSecret = randomBytes(32).toString("base64url")
  const [updated] = (await sql`
    UPDATE admin_credentials
    SET
      password_hash = ${passwordHash},
      session_secret = ${sessionSecret},
      session_version = session_version + 1,
      updated_at = NOW()
    WHERE username = ${credential.username}
    RETURNING username, password_hash, session_secret, session_version
  `) as Credential[]

  if (!updated) {
    return false
  }

  await createAdminSession(updated)
  return true
}

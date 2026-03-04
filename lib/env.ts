/**
 * lib/env.ts — Server-side environment variable validation
 *
 * Validates all required env vars at startup using Zod.
 * Fails fast with a clear error message rather than at the DB call site.
 *
 * IMPORTANT: this module is server-only. Never import it in client components
 * or pages with `'use client'` — doing so will throw a build error.
 *
 * MongoDB URI priority:
 *   1. MONGODB_URI_B64  — base64-encoded URI (recommended for Netlify — avoids
 *                         special-character issues with @, +, =, & in env vars)
 *   2. MONGODB_URI      — plain URI (works locally and on most platforms)
 *   3. MONGODB_USER + MONGODB_PASSWORD + MONGODB_CLUSTER  — individual parts
 */
import 'server-only'
import { z } from 'zod'

/** Decode a base64 string safely; returns undefined if invalid. */
function decodeB64(v: string | undefined): string | undefined {
  if (!v?.trim()) return undefined
  try {
    return Buffer.from(v.trim(), 'base64').toString('utf8')
  } catch {
    return undefined
  }
}

const schema = z
  .object({
    // ── Option A1: base64-encoded Atlas URI (Netlify-safe) ──────────────────
    MONGODB_URI_B64: z.string().optional(),

    // ── Option A2: plain Atlas URI ──────────────────────────────────────────
    // Treat empty-string assignments the same as unset.
    MONGODB_URI: z.string().optional().transform(v => v?.trim() || undefined).pipe(z.url().optional()),

    // ── Option B: individual connection parts ───────────────────────────────
    MONGODB_USER:     z.string().min(1).optional(),
    MONGODB_PASSWORD: z.string().min(1).optional(),
    MONGODB_CLUSTER:  z.string().min(1).optional(),
    MONGODB_DB:       z.string().min(1).default('investment_dashboard'),

    // ── Runtime ─────────────────────────────────────────────────────────────
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  })
  .refine(
    (data) =>
      !!data.MONGODB_URI_B64 ||
      !!data.MONGODB_URI    ||
      (!!data.MONGODB_USER && !!data.MONGODB_PASSWORD && !!data.MONGODB_CLUSTER),
    {
      message:
        'MongoDB config missing. Set MONGODB_URI_B64 (base64 URI, recommended for Netlify), ' +
        'MONGODB_URI (plain URI), or all three of MONGODB_USER / MONGODB_PASSWORD / MONGODB_CLUSTER.',
    },
  )

function parseEnv() {
  const result = schema.safeParse(process.env)

  if (!result.success) {
    const errors = z.flattenError(result.error)
    console.error('\n⛔  Invalid / missing environment variables:\n')

    for (const [field, messages] of Object.entries(errors.fieldErrors)) {
      console.error(`  ${field}: ${(messages as string[]).join(', ')}`)
    }

    for (const message of errors.formErrors) {
      console.error(`  (root): ${message}`)
    }

    console.error('\nSee .env.example for the full list of required variables.\n')
    throw new Error('Environment variable validation failed — see above for details.')
  }

  return result.data
}

export const env = parseEnv()

/**
 * Ensures the username and password in a MongoDB URI are properly URL-encoded.
 *
 * Special characters that MUST be percent-encoded in MongoDB credentials:
 *   @ : / ? # [ ] ! $ & ' ( ) * + , ; = %
 *
 * Strategy:
 *   - Split on the LAST @ to handle passwords that contain @ literally
 *   - Split username:password on the FIRST colon
 *   - Decode any existing percent-encoding first (idempotent — never double-encodes)
 *   - Re-encode with encodeURIComponent
 *
 * Examples:
 *   in:  mongodb+srv://user:p@ssw0rd!@cluster.mongodb.net/db
 *   out: mongodb+srv://user:p%40ssw0rd%21@cluster.mongodb.net/db
 *
 *   already encoded (idempotent):
 *   in:  mongodb+srv://user:p%40ssword@cluster.mongodb.net/db
 *   out: mongodb+srv://user:p%40ssword@cluster.mongodb.net/db
 */

/** Decode percent-encoding then re-encode — prevents double-encoding. */
function safeEncode(s: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(s))
  } catch {
    // decodeURIComponent throws on malformed sequences — encode the raw string
    return encodeURIComponent(s)
  }
}

function sanitizeMongoUri(uri: string): string {
  const protoMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/)
  if (!protoMatch) return uri  // unrecognized format — pass through unchanged

  const [, protocol, withoutProto] = protoMatch

  // Use LAST @ as the credentials/host separator (passwords may contain @)
  const lastAt = withoutProto.lastIndexOf('@')
  if (lastAt === -1) return uri  // no credentials section

  const credentials = withoutProto.slice(0, lastAt)
  const hostAndRest  = withoutProto.slice(lastAt + 1)

  // Split username:password on the FIRST colon only
  const firstColon = credentials.indexOf(':')
  if (firstColon === -1) {
    // Username with no password
    return `${protocol}${safeEncode(credentials)}@${hostAndRest}`
  }

  const user = safeEncode(credentials.slice(0, firstColon))
  const pass = safeEncode(credentials.slice(firstColon + 1))

  return `${protocol}${user}:${pass}@${hostAndRest}`
}

/** Builds the MongoDB Atlas connection string. Priority: B64 > plain URI > parts. */
export function getMongoUri(): string {
  // Option A1 — base64-encoded URI (recommended for Netlify)
  const fromB64 = decodeB64(env.MONGODB_URI_B64)
  if (fromB64) return sanitizeMongoUri(fromB64)

  // Option A2 — plain URI (sanitize to handle any unencoded special chars)
  if (env.MONGODB_URI) return sanitizeMongoUri(env.MONGODB_URI)

  // Option B — individual parts, encoded before interpolation
  const user     = encodeURIComponent(env.MONGODB_USER!)
  const password = encodeURIComponent(env.MONGODB_PASSWORD!)

  return `mongodb+srv://${user}:${password}@${env.MONGODB_CLUSTER}/${env.MONGODB_DB}?retryWrites=true&w=majority`
}

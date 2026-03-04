/**
 * lib/env.ts — Server-side environment variable validation
 *
 * Validates all required env vars at startup using Zod.
 * Fails fast with a clear error message rather than at the DB call site.
 *
 * IMPORTANT: this module is server-only. Never import it in client components
 * or pages with `'use client'` — doing so will throw a build error.
 */
import 'server-only'
import { z } from 'zod'

const schema = z
  .object({
    // ── Option A: single Atlas URI ──────────────────────────────────────────
    // Treat empty-string assignments (e.g. MONGODB_URI= in a copied .env.example)
    // the same as unset — coerce '' → undefined before URL validation.
    MONGODB_URI: z.string().optional().transform(v => v?.trim() || undefined).pipe(z.string().url().optional()),

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
      !!data.MONGODB_URI ||
      (!!data.MONGODB_USER && !!data.MONGODB_PASSWORD && !!data.MONGODB_CLUSTER),
    {
      message:
        'MongoDB config missing. Set MONGODB_URI (Atlas connection string) ' +
        'or all three of MONGODB_USER, MONGODB_PASSWORD, and MONGODB_CLUSTER.',
    },
  )

function parseEnv() {
  const result = schema.safeParse(process.env)

  if (!result.success) {
    // Print each invalid field so the developer knows exactly what to fix
    const errors = result.error.flatten()
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

/** Builds the MongoDB Atlas connection string from env, preferring MONGODB_URI. */
export function getMongoUri(): string {
  if (env.MONGODB_URI) return env.MONGODB_URI

  // Safely encode credentials — handles special chars (@ ! $ % etc.)
  const user     = encodeURIComponent(env.MONGODB_USER!)
  const password = encodeURIComponent(env.MONGODB_PASSWORD!)

  return `mongodb+srv://${user}:${password}@${env.MONGODB_CLUSTER}/${env.MONGODB_DB}?retryWrites=true&w=majority`
}

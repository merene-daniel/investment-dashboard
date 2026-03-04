import mongoose from 'mongoose'
import { getMongoUri } from '@/lib/env'

interface MongooseCache {
  conn:    typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

// Reused across hot-reloads in dev; each cold-start in serverless gets a fresh module scope
let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null }
global.mongoose = cached

const CONNECT_OPTS: mongoose.ConnectOptions = {
  // Keep pool at 1 — prevents Atlas connection exhaustion when many
  // serverless instances run concurrently (each adds its own pool)
  maxPoolSize: 1,

  // Drop idle connections after 10 s, well under Atlas's 30-min server-side
  // idle timeout — avoids reusing a silently-closed socket
  maxIdleTimeMS: 10_000,

  // Never buffer Mongoose ops while reconnecting — fail fast in serverless
  bufferCommands: false,

  // Surface network problems quickly rather than hanging a function invocation
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS:         10_000,
  socketTimeoutMS:          45_000,
}

async function connectDB(): Promise<typeof mongoose> {
  // readyState 1 = connected — safe to reuse
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn

  // Stale / dropped connection — clear cache and reconnect
  if (cached.conn) {
    cached.conn    = null
    cached.promise = null
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), CONNECT_OPTS).then(m => m)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB

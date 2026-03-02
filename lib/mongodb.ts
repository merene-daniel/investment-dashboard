import mongoose from 'mongoose'

function resolveMongoUri(): string {
  const rawUri = process.env.MONGODB_URI?.trim()

  if (rawUri) {
    const isLocalUri =
      rawUri.includes('localhost') || rawUri.includes('127.0.0.1')

    if (isLocalUri) {
      throw new Error(
        'MONGODB_URI is configured for a local database. Use an online MongoDB Atlas URI instead.'
      )
    }

    return rawUri
  }

  const user = process.env.MONGODB_USER?.trim()
  const password = process.env.MONGODB_PASSWORD?.trim()
  const cluster = process.env.MONGODB_CLUSTER?.trim()
  const db = process.env.MONGODB_DB?.trim() || 'investment_dashboard'

  if (!user || !password || !cluster) {
    throw new Error(
      'Missing MongoDB config. Set MONGODB_URI (Atlas) or MONGODB_USER, MONGODB_PASSWORD, and MONGODB_CLUSTER.'
    )
  }

  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${cluster}/${db}`
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  const mongoUri = resolveMongoUri()

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      return mongoose
    })
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

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn("MONGODB_URI not defined in environment variables")
}

// Type declaration for global mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose | null> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null }

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise && MONGODB_URI) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB")
        return mongoose
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err)
        cached.promise = null
        return null
      })
  }

  if (!cached.promise) {
    return null
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e)
    cached.promise = null
    return null
  }
}

export async function connectToDatabase() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not defined")
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }

    return await mongoose.connect(MONGODB_URI)
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

const mongoose = require('mongoose')

let cachedConn = null
let cachedPromise = null

/**
 * connectDB — Connect to MongoDB Atlas with connection caching across serverless invocations.
 * In serverless environments (Vercel), functions are frozen and thawed across requests.
 * Reusing existing connections prevents connection storms on MongoDB Atlas.
 */
const connectDB = async () => {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  // If a connection attempt is in progress, await the existing promise
  if (cachedPromise) {
    return cachedPromise
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables.')
  }

  try {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      socketTimeoutMS: 45000,
      autoIndex: process.env.NODE_ENV !== 'production',
    }).then((conn) => {
      cachedConn = conn
      console.log(`[DB] MongoDB connected: ${conn.connection.host}`)
      return conn
    }).catch((err) => {
      cachedPromise = null
      throw err
    })

    return await cachedPromise
  } catch (error) {
    cachedPromise = null
    console.error(`[DB] Connection error: ${error.message}`)
    throw error
  }
}

module.exports = connectDB


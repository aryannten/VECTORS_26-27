const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`)
    throw error
  }
}

module.exports = connectDB

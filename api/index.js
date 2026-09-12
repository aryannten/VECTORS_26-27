/**
 * Vercel Serverless Function Entrypoint
 * Bridges incoming /api/* HTTP requests to the Express application.
 */
const app = require('../server/index')

module.exports = app

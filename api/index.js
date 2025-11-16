/**
 * Vercel Serverless Function Entry Point
 * This exports the Express app for serverless deployment
 */

const app = require('../server');

// Export the Express app as a serverless function
module.exports = app;

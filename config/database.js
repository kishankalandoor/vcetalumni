/**
 * Database Configuration
 * MySQL2 Connection Pool
 */

const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection only in non-serverless environments
// In serverless, connection will be established on first request
if (process.env.VERCEL !== '1') {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Database connection failed:', err.message);
            process.exit(1);
        }
        console.log('✅ Database connected successfully');
        connection.release();
    });
}

// Export promise-based pool
module.exports = pool.promise();

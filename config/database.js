/**
 * Database Configuration
 * MySQL2 Connection Pool
 */

const mysql = require('mysql2');

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Database configuration error: Missing required environment variables');
    console.error('Missing variables:', missingEnvVars.join(', '));
    console.error('\n📋 Please create a .env file with the following variables:');
    console.error('   DB_HOST=localhost');
    console.error('   DB_USER=root');
    console.error('   DB_PASSWORD=');
    console.error('   DB_NAME=vcet_alumni_hub');
    console.error('   DB_PORT=3306');
    console.error('\n💡 You can copy .env.example to .env and update the values.');
    process.exit(1);
}

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000 // 10 seconds timeout
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('\n🔍 Troubleshooting tips:');
        console.error('   1. Ensure MySQL server is running');
        console.error('   2. Check database credentials in .env file');
        console.error('   3. Verify the database exists:', process.env.DB_NAME);
        console.error('   4. Check firewall/network settings');
        console.error('\n📝 Current configuration:');
        console.error('   Host:', process.env.DB_HOST);
        console.error('   Port:', process.env.DB_PORT || 3306);
        console.error('   User:', process.env.DB_USER);
        console.error('   Database:', process.env.DB_NAME);
        process.exit(1);
    }
    console.log('✅ Database connected successfully');
    connection.release();
});

// Export promise-based pool
module.exports = pool.promise();

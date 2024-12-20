const { Pool } = require('pg');
require('dotenv').config();

// Create a new instance of the connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to PostgreSQL database successfully.');
    }
    release(); // Release the client back to the pool
});

module.exports = pool;

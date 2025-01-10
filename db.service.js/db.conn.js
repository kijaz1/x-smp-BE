require('dotenv').config(); // Load environment variables from .env file

const { Pool } = require("pg");
const sql = require("./queries.service");

// DATABASE CREATION ALONG WITH ALL THE TABLES
async function createDatabase() {
    try {
        // Create a pool to connect to PostgreSQL server
        const pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        // Connect to the PostgreSQL server
        const client = await pool.connect();

        // CREATE THE DATABASE IF IT DOESN'T EXIST
        await client.query(sql.CREATE_DATABASE); // Use the client to run the query to create the DB
        console.log("Database created or already exists");

        // After creating the database, release the client to avoid connection leak
        client.release();

        // Now connect to the newly created (or existing) database
        const dbPool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        const dbClient = await dbPool.connect();

        // Array of table creation queries
        const tableCreationQueries = [
            sql.CREATE_TABLE_CENTERS,
            sql.CREATE_TABLE_USERS,
            sql.CREATE_TABLE_LEADS,
            sql.ADD_CENTER,
            sql.ADD_MASTER_ADMIN_BK,
            sql.ADD_INITIAL_LEAD,
            sql.CLAIMED_LEAD,
            sql.CALL_BACK_LEADS,
            sql.CREATE_TABLE_LICENSE_AGENT,
            sql.CREATE_TABLE_HEALTH,
        ];

        // Iterate over the array and create each table
        for (const tableQuery of tableCreationQueries) {
            await dbClient.query(tableQuery);
        }
        console.log("All Tables created or already exist");

        // Release client and pool after the operations
        dbClient.release();
        dbPool.end();
    } catch (error) {
        console.error("Error creating database or tables:", error.message);
    }
}

// Connection pool module for other uses
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

module.exports = { createDatabase, pool };

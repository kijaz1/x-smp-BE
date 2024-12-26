const { Pool } = require("pg");
const sql = require("./queries.service");

// DATABASE CREATION ALONG WITH ALL THE TABLES
async function createDatabase() {
    try {
        const pool = new Pool({
            host: "localhost",
            user: "postgres", // Replace with your PostgreSQL username
            password: "1", // Replace with your PostgreSQL password
        });

        const client = await pool.connect();

        // Check if the database already exists
        const dbExistsQuery = `
            SELECT 1 
            FROM pg_database 
            WHERE datname = 'xsmp';
        `;
        const result = await client.query(dbExistsQuery);

        if (result.rowCount === 0) {
            // Create the database if it doesn't exist
            await client.query(`CREATE DATABASE xsmp;`);
            console.log("Database created");
        } else {
            console.log("Database already exists");
        }

        client.release(); // Release the client to connect with the specific database below

        const dbPool = new Pool({
            host: "localhost",
            user: "postgres",
            password: "1",
            database: "xsmp", // Replace with your target database name
        });

        const dbClient = await dbPool.connect();

        // Array of table creation queries
        const tableCreationQueries = [
            sql.CREATE_TABLE_USERS,
            sql.ADD_MASTER_ADMIN_BK
        ];

        // Iterate over the array and create each table
        for (const tableQuery of tableCreationQueries) {
            await dbClient.query(tableQuery);
        }
        console.log("All Tables created or already exist");

        dbClient.release();
        dbPool.end();
    } catch (error) {
        console.error("Error creating database or tables:", error.message);
    }
}

// Connection pool module
const pool = new Pool({
    host: "localhost",
    user: "postgres", // Replace with your PostgreSQL username
    password: "1", // Replace with your PostgreSQL password
    database: "xsmp", // Replace with your target database name
});

module.exports = { createDatabase, pool };
const { Pool } = require("pg");
const sql = require("./queries.service");

// DATABASE CREATION ALONG WITH ALL THE TABLES
async function createDatabase() {
    try {
        const pool = new Pool({
            host: "localhost",
            user: "root",
            password: "",
        });

        // CREATE THE DATABASE IF IT DOESN'T EXIST
        await connection.query(sql.CREATE_DATABASE);
        console.log("Database created or already exists");

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
    user: "root",
    password: "",
    database: "ems",
});

module.exports = { createDatabase, pool };
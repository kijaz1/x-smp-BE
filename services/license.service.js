const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
// const { generateToken } = require("../util/admin.jwt");

module.exports = {

    // TO RESGISTER USERS


    async addLicense(first_name,last_name,email,cell_number) {
        try {
            const insertResult = await pool.query(sql.ADD_LICENSE, [
                first_name,
                last_name,
                email,
                cell_number
            ]);
            
            if (insertResult.rows.length > 0) {
                const registerlicense = insertResult.rows[0].id;
                return { message: "User Created Successfully", userId: registerlicense };
            } else {
                throw new Error("Insert failed, no rows returned.");
            }
            
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },



};
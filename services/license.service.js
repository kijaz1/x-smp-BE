const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
// const { generateToken } = require("../util/admin.jwt");

module.exports = {

    // TO RESGISTER USERS


    async addLicense(user_id,first_name, last_name, email, cell_number) {
        try {
            const insertResult = await pool.query(sql.ADD_LICENSE, [
                user_id,first_name, last_name, email, cell_number
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


async updateLicense( id,
    address,
    date_of_birth,

    ssn,
    states,
    license_numbers,
    license_issue_dates,
    license_expiry_dates,
    license_types,
    id_number,
    id_front_image,
    id_back_image,
    
    other_agencies){
        try {
            // SQL query to update the license details
            const updateResult = await pool.query(sql.UPDATE_LICENSE, [
                address,
                date_of_birth,
                ssn,
                states,
                license_numbers,
                license_issue_dates,
                license_expiry_dates,
                license_types,
                id_number,
                id_front_image,
                id_back_image,
            
                other_agencies,
                id  // The unique identifier to update the correct record
            ]);
            
            if (updateResult.rowCount > 0) {
                return { message: "License details updated successfully" };
            } else {
                throw new Error("Update failed, no rows were affected.");
            }
            
        } catch (error) {
            console.error("Error updating license:", error);
            throw error;
        }
    }

};
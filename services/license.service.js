const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require("../utils/utils");

module.exports = {

    // Function to either add or update license based on whether id is provided
    async addLicense(
        first_name,
        last_name,
        email,
        cell_number,
    ) {
        try {
            const insertResult = await pool.query(sql.ADD_LICENSE, [
                first_name, last_name, email, cell_number
            ]);

            if (insertResult.rows.length > 0) {
                const id = insertResult.rows[0].id;
                const Fullname = insertResult.rows[0].first_name + insertResult.rows[0].last_name;
                const email = insertResult.rows[0].email;
                let publicFormUrl = `http://localhost:5173/license-agent/${id}`
                await utils.sendEmail(publicFormUrl, Fullname, email)

                return { message: "Email sent" };
            } else {
                throw new Error("Insert failed, no rows returned.");
            }

        } catch (error) {
            console.error("Error adding or updating license:", error);
            throw error;
        }
    },


    async updateLicense(
        id,
        address,
        date_of_birth,
        ssn,
        states,
        license_details,
        id_number,
        fileUrls,
        other_agencies
    ) {
        try {
            if (id) {
                // If id is provided, update the license
                const updateResult = await pool.query(sql.UPDATE_LICENSE, [
                    address,
                    date_of_birth,
                    ssn,
                    states,
                    license_details,
                    id_number,
                    fileUrls,
                    other_agencies,
                    id
                ]);

                if (updateResult.rowCount > 0) {
                    return { message: "License details updated successfully" };
                } else {
                    throw new Error("Update failed, no rows were affected.");
                }
            }

        } catch (error) {
            console.error("Error adding or updating license:", error);
            throw error;
        }
    },




    async getAgentData(id) {
        try {
            if (id) {
                let agentDetails = await pool.query(sql.SELECT_LICENSE_BY_ID, [id]);
                return agentDetails.rows[0];
            }
        } catch (error) {
            console.error("Error updating lead statuses:", error);
            throw error;
        }
    }
};

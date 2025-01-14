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
                const registerlicense = insertResult.rows[0].id;
                return { message: "User Created Successfully", userId: registerlicense };
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
            } else {
                // If no id is provided, add a new license
                const insertResult = await pool.query(sql.ADD_LICENSE, [
                    first_name, last_name, email, cell_number
                ]);

                if (insertResult.rows.length > 0) {
                    const registerlicense = insertResult.rows[0].id;
                    return { message: "User Created Successfully", userId: registerlicense };
                } else {
                    throw new Error("Insert failed, no rows returned.");
                }
            }

        } catch (error) {
            console.error("Error adding or updating license:", error);
            throw error;
        }
    },




    async getAgentBasicData(id) {
        try {
            const status = "paid";

            for (const lead_id of lead_ids) {
                await pool.query(sql.UPDATE_LEAD_STATUS, [status, lead_id]);
            }
            return "Status updated for all leads.";
        } catch (error) {
            console.error("Error updating lead statuses:", error);
            throw error;
        }
    }
};

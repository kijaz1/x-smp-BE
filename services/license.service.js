const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require("../utils/utils");
const dotenv = require('dotenv');
dotenv.config();

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
                let publicFormUrl = `${process.env.WEBSITE_URL}license-agent/${id}`
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
        license_details,
        id_number,
        other_agencies,
        issue_company,
        policy_number,
        effictive_date,
        bank_name,
        bank_address,
        account_title,
        account_number,
        routing_number,
        id_upload_front,
        id_upload_back,
        upload_voided,
    ) {
        try {

            // Convert and upload each base64 file
            const files = [
                { base64: id_upload_front, key: "id_upload_front" },
                { base64: id_upload_back, key: "id_upload_back" },
                { base64: upload_voided, key: "upload_voided" },
            ];

            const result = {};

            for (const file of files) {
                if (file.base64) {
                    const fileUrl = await utils.uploadToS3(file.base64, file.key);
                    result[file.key] = fileUrl; // Assign the file URL to the corresponding key
                }
            }


            if (id) {
                // If id is provided, update the license
                const updateResult = await pool.query(sql.UPDATE_LICENSE, [
                    address,
                    date_of_birth,
                    ssn,
                    license_details,
                    id_number,
                    result.id_upload_front,
                    result.id_upload_back,
                    issue_company,
                    policy_number,
                    effictive_date,
                    bank_name,
                    bank_address,
                    account_title,
                    account_number,
                    routing_number,
                    result.upload_voided,
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

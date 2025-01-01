const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');
const countryPrefix = require("../utils/country.prefix.json")





module.exports = {

    async getAllCentersData() {
        try {
            const result = await pool.query(sql.ALL_CALL_DATA);

            // Log the result to inspect its structure
            console.log("Query result:", result);

            // Access the 'rows' property for the actual data
            const calls = result.rows;

            // Check if data exists and return it
            if (!calls) {
                throw new Error('No call centers found');
            }

            return calls; // Return the rows from the query
        } catch (error) {
            console.error("Error fetching call center data:", error);
            throw error;
        }
    },

    async sendEmails(callcenter_id, lead_id) {
        try {
            const payout = await pool.query(sql.SELECT_PAYOUT, [callcenter_id]);
            const claimLeads = await pool.query(sql.SELECT_PAYOUT, [callcenter_id, lead_id]);

            // Log the result to inspect its structure
            console.log("Query result:", result);

            // Access the 'rows' property for the actual data
            const calls = result.rows;

            // Check if data exists and return it
            if (!calls) {
                throw new Error('No call centers found');
            }

            return calls; // Return the rows from the query
        } catch (error) {
            console.error("Error fetching call center data:", error);
            throw error;
        }
    },

}
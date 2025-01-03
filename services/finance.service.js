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

    async getAllCentersPayoutData(callcenter_id, fromDate, tillDate) {
        try {
            const payoutData = await pool.query(sql.SELECT_PAYOUT, [callcenter_id]);
            let payout = payoutData.rows[0].payout;
            const approvedLeads = await pool.query(sql.GET_APPROVED_LEADS_BY_CENTER, [callcenter_id, fromDate, tillDate]);
            let numberOfleads = approvedLeads.rows.length
            let totalPayment
            if (payout != null && numberOfleads > 0) {
                totalPayment = payout * numberOfleads
            }
            return totalPayment
        } catch (error) {
            console.error("Error fetching call center data:", error);
            throw error;
        }
    },

    async setPaidLeadsStatus(lead_ids) {
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


}
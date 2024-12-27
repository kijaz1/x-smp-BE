const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');


module.exports = {

    // CLOCK IN
    async callbackdata(callbackDetail) {
        try {
            const { user_id, lead_id, date_time, additional_notes } = callbackDetail;
    
            // Debugging logs
    
            const result = await pool.query(sql.ADD_CALL_BACK_DATA, [
                user_id,
                lead_id,
                date_time,
                additional_notes
            ]);
    
            return { message: "CALLBACK DATA added successfully", data: result.rows[0] };
        } catch (error) {
            console.error("Error inserting data into call_back_leads:", error);
            throw new Error("Failed to add callback lead");
        }
    }
    
    
}
const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');


module.exports = {

     async updateCallBack(user_id, is_claim, lead_id) {
            try {
                // First, set all claim_leads to false for the user (if claim_lead is true)
        
                // Then, update the specific lead with the new claim_lead value
                const result = await pool.query(sql.UUPDATE_CALL_BACK_LEAD, [is_claim, user_id, lead_id]);
        
                // Check if any rows were updated
                if (result.rowCount === 0) {
                    return { message: 'Lead not found or no change in claim status' };
                }
        
                // If the claim_lead is true, insert it into claim_lead table
                if (is_claim) {
                    const query = await pool.query(sql.ADD_CALL_BACK_DATA, [user_id, lead_id]);
                    return { message: 'Lead claim status updated successfully', data: query.rows[0] };
                }
        
                return { message: 'Lead claim status updated successfully' };
            } catch (error) {
                console.error('Error updating claim_lead:', error);
                throw error; // Re-throw the error for the controller to handle
            }
        },
        async allCallBack(user_id) {
          try {
              // Execute the query to get all leads that the user has claimed
              const query = await pool.query(sql.ALL_LEAD_IN_CALL_BACK_LEAD, [user_id]);
        
              // Return the list of leads the user has claimed
              return query.rows;
          } catch (err) {
              console.error('Error retrieving data from claim_lead:', err);
              throw err; // Rethrow the error for further handling
          }
        }
        ,
        
        async getApprovedLeads(user_id) {
            try {
                // SQL query to fetch leads with form_status = 'Approve'
                const query = await pool.query(sql.APPROVED_LEAD, [user_id]);
        
                return query.rows;  // Return the result (approved leads)
            } catch (err) {
                console.error('Error retrieving data from claim_lead:', err);
                throw err; // Rethrow the error for further handling
            }
        },
                
        async getRejectedLeads(user_id) {
            try {
                // SQL query to fetch leads with form_status = 'Approve'
                const query = await pool.query(sql.REJECTED_LEAD, [user_id]);
        
                return query.rows;  // Return the result (approved leads)
            } catch (err) {
                console.error('Error retrieving data from claim_lead:', err);
                throw err; // Rethrow the error for further handling
            }
        },
}
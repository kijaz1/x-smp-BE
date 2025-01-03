const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');
const utils = require('../utils/utils');


module.exports = {

      // GET ALL PENDING LEAVES
    // Service: Fetching all claimed leads for a specific user_id
async allClaimlead(user_id) {
  try {
      // Execute the query to get all leads that the user has claimed
      const query = await pool.query(sql.ALL_LEAD_IN_CLAIM_LEAD, [user_id]);

      // Return the list of leads the user has claimed
      return query.rows;
  } catch (err) {
      console.error('Error retrieving data from claim_lead:', err);
      throw err; // Rethrow the error for further handling
  }
}
,
    async allClaimdata(leadData) {
      const query = `
          SELECT 
              leads.id AS lead_id,
              leads.user_id,
              users.id AS user_id,
              
          FROM 
              leads
          JOIN 
              users ON leads.user_id = users.id
          LEFT JOIN 
              claim_lead ON claim_lead.lead_id = leads.id
          WHERE 
              leads.claim_lead = true;
      `;
  
      try {
         
          const result = await db.query(query); // Assuming `db.query` is your database query function
          return { message: "Claim data fetched successfully", data: result.rows };
      } catch (error) {
          console.error("Database query error:", error);
          throw new Error("Unable to fetch claim data.");
      }
  }
  

}
const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');


module.exports = {

    // CLOCK IN
    async insertLead(leadDetail) {
        try {
            const { 
                user_id, first_name, last_name, address, city, state, zip_code, 
                date_of_birth, gender, recording_link, cell_phone, home_phone, 
                email, mode_of_income, decision_make, form_status, isdeleted 
            } = leadDetail;
    
            // Insert the lead into the database
            await pool.query(sql.ADD_LEAD, [
                user_id, first_name, last_name, address, city, state, zip_code, 
                date_of_birth, gender, recording_link, cell_phone, home_phone, 
                email, mode_of_income, decision_make, form_status, isdeleted
            ]);
    
            return { message: "Lead added successfully" };
        } catch (error) {
            console.error("Error adding lead:", error);
            throw error; // Re-throw the error to be handled by the controller
        }
    },
    
//pending for id can see there lead 
    // CLOCK OUT
    async getLeadsByID(alldetails) {
        try {
            const { user_id } = alldetails;
    
            // Ensure user_id is provided
            if (!user_id) {
                throw new Error("User ID is required");
            }
    
            // Query database for leads by user ID
            const result = await pool.query(sql.ALL_lead_BY_ID, [user_id]);
    
            if (result.rows.length > 0) {
                return { message: "Leads fetched successfully", leads: result.rows };
            } else {
                return { message: "No leads found for this user ID" };
            }
        } catch (error) {
            console.error("Error fetching leads by ID:", error);
            throw error;
        }
    }
,    


///all leads 
    async getLeads() {
        try {
            // Run the SQL query to fetch all leads
            const result = await pool.query(sql.ALL_LEAD);
    
            // Check if any leads are found
            if (result.rows.length > 0) {
                return { message: "Leads fetched successfully", leads: result.rows };
            } else {
                return { message: "No leads found" };
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            throw error;
        }
    },
    

    async updateStatus(user_id, form_status) {
        try {
            // SQL query to update the form_status field
            const result = await pool.query(sql.UPDATE_LEAD, [form_status, user_id]); // Pass parameters directly
    
            // Check if any rows were updated
            if (result.rowCount === 0) {
                return { message: 'Lead not found or no change in status' };
            }
    
            return { message: 'Lead status updated successfully' };
        } catch (error) {
            console.error('Error updating lead status:', error);
            throw error;  // Re-throw the error for the controller to handle
        }
    }
    
    

}
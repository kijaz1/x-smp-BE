
const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');


module.exports = {

    // CLOCK IN
    async insertLead(leadDetail) {
        try {
            const { 
                user_id,callcenter_id, first_name, last_name, address, city, state, zip_code, 
                date_of_birth, gender, recording_link, cell_phone, home_phone, 
                email, mode_of_income, decision_make, form_status, isdeleted 
            } = leadDetail;
    
            // Insert the lead into the database
            await pool.query(sql.ADD_LEAD, [
                user_id,callcenter_id, first_name, last_name, address, city, state, zip_code, 
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
    

    async updateClaimStatus(user_id, claim_lead, leads_id) {
        try {
            // First, set all claim_leads to false for the user (if claim_lead is true)
    
            // Then, update the specific lead with the new claim_lead value
            const result = await pool.query(sql.UUPDATE_CLAIM_LEAD, [claim_lead, user_id, leads_id]);
    
            // Check if any rows were updated
            if (result.rowCount === 0) {
                return { message: 'Lead not found or no change in claim status' };
            }
    
            // If the claim_lead is true, insert it into claim_lead table
            if (claim_lead) {
                const query = await pool.query(sql.INSERT_CLAIMED_LEAD, [user_id, leads_id]);
                return { message: 'Lead claim status updated successfully', data: query.rows[0] };
            }
    
            return { message: 'Lead claim status updated successfully' };
        } catch (error) {
            console.error('Error updating claim_lead:', error);
            throw error; // Re-throw the error for the controller to handle
        }
    },


    async deleteLead(lead_id){
        try {
            // Perform the database operation
            await pool.query(sql.DELETE_LEAD, [lead_id]);
            return { message: "Lead deleted successfully" };
        } catch (error) {
            console.error("Error deleting lead in service:", error);
            throw error; // Re-throw the error for the controller to handle
        }
    },
    
    async updateleads(lead_id, first_name, last_name, address, city, cell_phone) {
        try {
            const result = await pool.query(sql.EDIT_LEAD, [first_name, last_name, address, city, cell_phone, lead_id]);
    
            if (result.rowCount === 0) {
                throw new Error('No lead found with the provided ID.');
            }
    
            return { message: "Lead updated successfully" };
        } catch (error) {
            console.error("Error editing lead in service:", error);
            throw error; // Re-throw the error for the controller to handle
        }
    },

    async updateStatus(lead_id, form_status){
        try {
            // Check if user_id and form_status are valid
            if (!lead_id || !form_status) {
                throw new Error('lead_id and form_status are required');
            }
    
            const validStatuses = ['Pending', 'Approved', 'Rejected']; // Valid status options
            if (!validStatuses.includes(form_status)) {
                throw new Error('Invalid form_status value');
            }
    
            // Logic to update the lead status in the database
            // Replace this with your actual database interaction, for example:
            const result = await pool.query(sql.UPDATE_LEAD, [form_status, lead_id]);
    
            if (result.affectedRows === 0) {
                throw new Error('No lead found for the given user_id');
            }
    
            return { message: 'Status updated successfully' };
    
        } catch (error) {
            console.error('Error in updating status:', error.message);
            throw new Error('Failed to update status');
        }
    },
    
        // Method to get leads based on form_status and service
        async getApprovedLeads() {
            try {
                // SQL query to fetch leads with form_status = 'Approve'
                const query = 'SELECT * FROM leads WHERE form_status = $1';
                const result = await pool.query(query, ['Approved']);  // Fetch leads with 'Approve' status
                
                return result.rows;  // Return the result (approved leads)
            } catch (error) {
                console.error('Error in LeadService:', error);
                throw new Error('Failed to fetch approved leads');
            }
        },
        async getRejectedLeads() {
            try {
                // SQL query to fetch leads with form_status = 'Approve'
                const query = 'SELECT * FROM leads WHERE form_status = $1';
                const result = await pool.query(query, ['Rejected']);  // Fetch leads with 'Approve' status
                
                return result.rows;  // Return the result (approved leads)
            } catch (error) {
                console.error('Error in LeadService:', error);
                throw new Error('Failed to fetch approved leads');
            }
        }
    }


    


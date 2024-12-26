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
    // async getLeads(alldetails) {
    //     try {
    //         const { user_id } = alldetails; // You can use user_id or remove it if you want to fetch all leads
    //         const result = await pool.query(sql.ALL_LEAD, [user_id]); // Use the query from your SQL file
    
    //         // Check if results are returned
    //         if (result.rows.length > 0) {
    //             return { message: "Leads fetched successfully", leads: result.rows };
    //         } else {
    //             return { message: "No leads found" };
    //         }
    //     } catch (error) {
    //         console.error("Error fetching leads:", error);
    //         throw error;
    //     }
    // }
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
    }
    

    // // GET AT WHAT TIME THE USER CLOCKED-IN
    // async getClockInTime(user_id, clock_type) {
    //     try {
    //         // Get the most recent attendance time from the database
    //         const [most_recent_attendance_time_result] = await pool.query(sql.CHECK_MOST_RECENT_ATTENDANCE_TIME, [user_id, clock_type]);
    //         const most_recent_attendance_time = most_recent_attendance_time_result[0]?.attendance_date_time;
    //         const most_recent_timezone = most_recent_attendance_time_result[0]?.time_zone;

    //         if (most_recent_attendance_time) {
    //             const most_recent_attendance_time_ET = utils.convertToEST(new Date(most_recent_attendance_time), most_recent_timezone);
    //             return most_recent_attendance_time_ET
    //         }
    //     } catch (error) {
    //         console.error("Error creating user:", error);
    //         throw error;
    //     }
    // },


}
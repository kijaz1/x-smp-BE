const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');
const utils = require('../utils/utils');


module.exports = {

      // GET ALL PENDING LEAVES
    async allClaimlead(leadData) {
        try {
        const { user_id, leadsid, date_time } = leadData;
        const query = await pool.query(sql.INSERT_CLAIMED_LEAD, [user_id, leadsid, date_time]);
        return query.rows[0]; // Return the inserted data row
    }
     catch (err) {
      console.error('Error inserting data into claim_lead:', err);
      throw err; // Rethrow the error for further handling
    }
    }

    // UPDATE LEAVE STATUS

    // async updateLeaveStatus(leaveId, status) {
    //     try {
    //         const [leavesStatus] = await pool.query(sql.UPDATE_LEAVE_STATUS, [status, leaveId]);
    //         if(leavesStatus.affectedRows==1){
    //             const [emailResult] = await pool.query(sql.GET_EMAIL_BY_LEAVE_ID, [leaveId]);
    //             const email = emailResult[0].email;
    //             let sendEmail = utils.sendEmail(email, status);
    //             if(sendEmail){
    //                 return { message: "Email sent" };
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error updating leave status or sending email:", error);
    //         throw error;
    //     }
    // },


    // async getAllLeavesAppliedByUserId(userId) {
    //     try {
    //         const [allLeaves] = await pool.query(sql.GET_ALL_LEAVES_BY_USER_ID, [userId]);
    //         const leaves = []
    //         let leave_status;
    //         for (const allLeave of allLeaves) {
    //             const { leave_id, first_name, last_name, leave_category } = allLeave;
    //             const from_date = new Date(allLeave.from_date).toISOString().split('T')[0];
    //             const till_date = new Date(allLeave.till_date).toISOString().split('T')[0];
    //             if (allLeave.leave_status === 1) {
    //                 leave_status = 'pending'
    //             }
    //             else if (allLeave.leave_status === 2) {
    //                 leave_status = 'approved'
    //             }
    //             else if (allLeave.leave_status === 3) {
    //                 leave_status = 'rejected'
    //             }
    //             leaves.push({ leave_id, first_name, last_name, from_date, till_date, leave_category, leave_status });
    //         }
    //         return leaves;
    //     } catch (error) {
    //         console.error("Error fetching manager attendance:", error);
    //         throw error;
    //     }
    // },
}
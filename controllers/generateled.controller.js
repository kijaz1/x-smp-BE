const generateLead = require("../services/generatelead.service");
const utils = require('../utils/utils');


module.exports = {

    // INSERT ATTENDENCE
 async insertLead(req, res) {
    try {
        const leadDetail = req.body;
        const leadAdded = await generateLead.insertLead(leadDetail);
        return res.status(200).json({ message: leadAdded.message });
    } catch (error) {
        console.error("Error creating lead:", error);
        return res.status(401).json({ error: "Failed to add lead" });
    }
},


//    CLOCK OUT
async getLeads(req, res) {
    try {
        // Call the service to fetch all leads
        const leadsData = await generateLead.getLeads();

        // Send back a response with the fetched leads
        return res.status(200).json({ message: leadsData.message, leads: leadsData.leads || [] });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return res.status(500).json({ error: "Failed to fetch leads" });
    }
}


    // // GET AT WHAT TIME THE USER CLOCKED-IN
    // async getClockInTime(req, res) {
    //     try {
    //         const { user_id, clock_type } = req.query; // Use req.query to get query parameters
    //         const recent_attendance_time = await attendanceService.getClockInTime(user_id, clock_type);
    //         return res.status(200).json({ recent_attendance_time });
    //     } catch (error) {
    //         console.error("Error getting clock-in time:", error);
    //         return res.status(401).json({ error: "Failed to get attendance time" });
    //     }
    // }


}
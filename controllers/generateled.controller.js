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
},

async getLeadsByID(req, res) {
    try {
        // Extract userid from route parameters
        const { userid } = req.params;

        if (!userid) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Call the service to fetch leads for the given userid
        const leadsData = await generateLead.getLeadsByID({ user_id: userid });

        // Return the leads data
        return res.status(200).json({
            message: leadsData.message,
            leads: leadsData.leads || [],
        });
    } catch (error) {
        console.error("Error fetching leads by user ID:", error);
        return res.status(500).json({ error: "Failed to fetch leads" });
    }
},

async updateStatus(req, res) {
    try {
        const { user_id, form_status } = req.body;  // form_status should be a string (e.g., 'Approved', 'Pending')

        if (!user_id || !form_status) {
            return res.status(400).json({ error: 'user_id and form_status are required' });
        }

        // Ensure the form_status is valid (you can add more validation if needed)
        const validStatuses = ['Pending', 'Approved', 'Rejected']; // Example valid statuses
        if (!validStatuses.includes(form_status)) {
            return res.status(400).json({ error: 'Invalid form_status value' });
        }

        const result = await generateLead.updateStatus(user_id, form_status);

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error updating lead status:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
}




}
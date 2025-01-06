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
        const { lead_id, form_status } = req.body;  // form_status should be a string (e.g., 'Approved', 'Pending')

        if (!lead_id || !form_status) {
            return res.status(400).json({ error: 'lead_id and form_status are required' });
        }

        // Ensure the form_status is valid (you can add more validation if needed)
        const validStatuses = ['Pending', 'Approved', 'Rejected']; // Example valid statuses
        if (!validStatuses.includes(form_status)) {
            return res.status(400).json({ error: 'Invalid form_status value' });
        }

        const result = await generateLead.updateStatus(lead_id, form_status);

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error updating lead status:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
},


async updateClaimLead(req, res) {
    try {
        const { user_id, claim_lead, leads_id } = req.body;

        // Validate the input
        if (user_id === undefined || claim_lead === undefined || leads_id === undefined) {
            return res.status(400).json({ error: 'user_id, claim_lead, and leads_id are required' });
        }

        // Validate claim_lead is a boolean
        if (typeof claim_lead !== 'boolean') {
            return res.status(400).json({ error: 'claim_lead must be a boolean value' });
        }

        // Call the service to update the claim_lead field
        const result = await generateLead.updateClaimStatus(user_id, claim_lead, leads_id);

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error updating claim_lead:', error);
        return res.status(500).json({ error: 'Failed to update claim_lead' });
    }
},

async deltelead(req, res) {
    try {
        const { lead_id } = req.body;

        if (!lead_id) {
            return res.status(400).json({ error: "Lead ID is required" });
        }

        // Call the service function
        const result = await generateLead.deleteLead(lead_id);
        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error deleting lead:", error);
        return res.status(500).json({ error: "Failed to delete lead" });
    }
},

async updateleads(req,res){
    try {
        const { lead_id, first_name, last_name, address, city, cell_phone} = req.body;

        // Validate that required fields are provided
        if (!lead_id || !first_name || !last_name || !address || !city || !cell_phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Call the service function to update the lead
        const result = await generateLead.updateleads(lead_id, first_name, last_name, address, city, cell_phone);
        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error editing lead:", error);
        return res.status(500).json({ error: "Failed to edit lead" });
    }
}

}
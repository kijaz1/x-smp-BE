const generateLead = require("../services/callback.service");
const utils = require('../utils/utils');


module.exports = {

    // INSERT ATTENDENCE
    
    async updateCallBack(req, res) {
        try {
            const { user_id, is_claim, lead_id } = req.body;
    
            // Validate the input
            if (user_id === undefined || is_claim === undefined || lead_id === undefined) {
                return res.status(400).json({ error: 'user_id, claim_lead, and leads_id are required' });
            }
    
            // Validate claim_lead is a boolean
            if (typeof is_claim !== 'boolean') {
                return res.status(400).json({ error: 'claim_lead must be a boolean value' });
            }
    
            // Call the service to update the claim_lead field
            const result = await generateLead.updateCallBack(user_id, is_claim, lead_id);
    
            return res.status(200).json({ message: result.message });
        } catch (error) {
            console.error('Error updating claim_lead:', error);
            return res.status(500).json({ error: 'Failed to update call back' });
        }
    },
    async allCallBack(req, res) {
        try {
            const { user_id } = req.query;  
            // Call the service method to fetch the claimed leads for the user
            const claimedLeads = await generateLead.allCallBack(user_id);
    
            // Return the response with the claimed leads
            return res.status(200).json({ claimedLeads });
        } catch (error) {
            console.error('Error retrieving claimed leads:', error);
            return res.status(500).json({ error: 'Failed to retrieve claimed leads' });
        }
    }
    ,
    async getApprovedLeads(req, res) {
        try {
            // Get the user_id from query parameters
            const { user_id } = req.query;
    
            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }
    
            // Call the service method to fetch the approved leads for the user
            const claimedLeads = await generateLead.getApprovedLeads(user_id);
    
            // Return the response with the claimed leads
            return res.status(200).json({ claimedLeads });
        } catch (error) {
            console.error('Error retrieving claimed leads:', error);
            return res.status(500).json({ error: 'Failed to retrieve claimed leads' });
        }
    },
    async getRejectedLeads(req, res) {
        try {
            // Get the user_id from query parameters
            const { user_id } = req.query;
    
            if (!user_id) {
                return res.status(400).json({ error: 'user_id is required' });
            }
    
            // Call the service method to fetch the approved leads for the user
            const claimedLeads = await generateLead.getRejectedLeads(user_id);
    
            // Return the response with the claimed leads
            return res.status(200).json({ claimedLeads });
        } catch (error) {
            console.error('Error retrieving claimed leads:', error);
            return res.status(500).json({ error: 'Failed to retrieve claimed leads' });
        }
    }
    
    

}
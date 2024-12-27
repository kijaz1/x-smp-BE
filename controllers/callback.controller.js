const generateLead = require("../services/callback.service");
const utils = require('../utils/utils');


module.exports = {

    // INSERT ATTENDENCE
    async  callbackdata(req, res) {
        try {
            const callbackDetail = req.body;
    
            // Debugging logs
    
            const leadAdded = await generateLead.callbackdata(callbackDetail);
            return res.status(200).json({ message: leadAdded.message, data: leadAdded.data });
        } catch (error) {
            console.error("Error creating lead:", error);
            return res.status(500).json({ error: "Failed to add lead" });
        }
    }
    

}
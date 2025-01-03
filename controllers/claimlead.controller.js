
const leadService = require("../services/claimlead.service");


module.exports = {

    // GET ATTENDANCE BY USER ID
   
    // GET DAILY PROGRESS OF EMPLOYEES
    async allClaimlead(req, res) {
        try {
            const leadData = req.body;
            const leadAdded = await leadService.allClaimlead(leadData);
            return res.status(200).json({ message: leadAdded.message });
        } catch (error) {
            console.error("Error creating lead:", error);
            return res.status(401).json({ error: "Failed to add lead" });
        }
    },
    async allClaimdata(req, res) {
        try {
            const leadData = req.body; 
            const claimData = await claimService.allClaimmdata(leadData);
            return res.status(200).json({ data: claimData });
        } catch (error) {
            console.error("Error fetching claim data:", error);
            return res.status(401).json({ error: "Failed to fetch claim data" });
        }
    }
    
    // UPDATE LEAVE STATUS
    
}
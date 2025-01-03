
const leadService = require("../services/claimlead.service");


module.exports = {

    // GET ATTENDANCE BY USER ID
   
    // GET DAILY PROGRESS OF EMPLOYEES
    // Controller: Handling claim lead request
async allClaimlead(req, res) {
    try {
        const { user_id } = req.query;  
        // Call the service method to fetch the claimed leads for the user
        const claimedLeads = await leadService.allClaimlead(user_id);

        // Return the response with the claimed leads
        return res.status(200).json({ claimedLeads });
    } catch (error) {
        console.error('Error retrieving claimed leads:', error);
        return res.status(500).json({ error: 'Failed to retrieve claimed leads' });
    }
}
,
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
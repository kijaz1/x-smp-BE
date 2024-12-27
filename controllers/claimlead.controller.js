
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

    // // APPLY FOR LEAVES
    // async applyLeave(req, res) {
    //     try {
    //         const { userId, from, till, category } = req.body;
    //         const application = await sharedService.applyLeave(userId, from, till, category);
    //         return res.status(200).json(application.message);
    //     } catch (error) {
    //         console.error("Error while appling leave", error);
    //         return res.status(401).json({ error: "Failed " });
    //     }
    // },

    // // GET ALL PENDING LEAVES
    // async getAllPendingleaves(req, res) {
    //     try {
    //         const allPendingleaves = await sharedService.getAllPendingleaves();
    //         return res.status(200).json(allPendingleaves);
    //     } catch (error) {
    //         console.error("Error creating user:", error);
    //         return res.status(401).json({ error: "Failed " });
    //     }
    // },

    // UPDATE LEAVE STATUS
    
}
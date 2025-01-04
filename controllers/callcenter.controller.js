
const callService = require("../services/call.service");


module.exports = {

    // GET ALL EMPLOYEE
    async registerCall(req, res) {
        try {
            const Callinsert = req.body;
            
            // Log the incoming data to ensure it is correct
            console.log("Call center data to be inserted:", Callinsert);
            
            const callAdded = await callService.insertcalldata(Callinsert);
    
            return res.status(200).json({
                message: "Call center added successfully.",
                data: callAdded,
            });
        } catch (error) {
            console.error("Error creating call center:", error);
            
            if (error.message === "Duplicate callcenter_id") {
                return res.status(409).json({ error: "Call center with this ID already exists." });
            }
        
            console.error("Detailed Error:", error.message);
            return res.status(500).json({ error: "Failed to add call center." });
        }
    }
    
,      
    
   
    async getallcalls(req, res) {
        try {
            const callsDetail = req.body; // Assuming no data is passed in the body, it's likely not needed here
            const registrationResult = await callService.getallcalls(callsDetail);
            return res.status(200).json({ message: "Call centers fetched successfully", data: registrationResult });
        } catch (error) {
            console.error("Error fetching call centers:", error);
            return res.status(500).json({ error: "Failed to fetch call centers" });
        }
    }
    
    

    
}
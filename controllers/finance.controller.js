
const callService = require("../services/finance.service");


module.exports = {

    async getAllCenters(req, res) {
        try {
            const callsDetail = req.body; // Assuming no data is passed in the body, it's likely not needed here
            const registrationResult = await callService.getAllCentersData(callsDetail);
            return res.status(200).json({ message: "Call centers fetched successfully", data: registrationResult });
        } catch (error) {
            console.error("Error fetching call centers:", error);
            return res.status(500).json({ error: "Failed to fetch call centers" });
        }
    }

}
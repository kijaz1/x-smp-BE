
const financeService = require("../services/finance.service");


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
    },

    async getCentersPayout(req, res) {
        try {
            const { from_date, till_date, callcenter_id } = req.query; // Assuming no data is passed in the body, it's likely not needed here
            const totalPayment = await financeService.getAllCentersPayoutData(callcenter_id, from_date, till_date);
            return res.status(200).json({ totalPayment: totalPayment });
        } catch (error) {
            console.error("Error fetching call centers:", error);
            return res.status(500).json({ error: "Failed to fetch call centers" });
        }
    },

    async setPaymentStatus(req, res) {
        try {
            const lead_ids = req.body; // Assuming no data is passed in the body, it's likely not needed here
            const leadStatus = await financeService.getAllCentersPayoutData(lead_ids);
            return res.status(200).json({ message:"Leads Status changed" });
        } catch (error) {
            console.error("Error fetching call centers:", error);
            return res.status(500).json({ error: "Failed to fetch call centers" });
        }
    }

}
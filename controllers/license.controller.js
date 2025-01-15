
const licenseService = require("../services/license.service");


module.exports = {
    async addOrUpdateLicense(req, res, fileUrls) {
        try {
            const { first_name, last_name, email, cell_number,
                id, address, date_of_birth, ssn, states, license_details,
                id_number, other_agencies
            } = req.body;

            if (id) {
                const licenseDetailsArray = license_details.split(',');
                const otherAgenciesArray = other_agencies.split(',');
                const updateLicenseResult = await licenseService.updateLicense(
                    id,
                    address,
                    date_of_birth,
                    ssn,
                    states,
                    licenseDetailsArray,
                    id_number,
                    fileUrls,
                    otherAgenciesArray
                );
                return res.status(200).json({ message: updateLicenseResult.message });
            } else {
                const addlicense = await licenseService.addLicense(
                    first_name,
                    last_name,
                    email,
                    cell_number
                );
                return res.status(200).json({ message: addlicense.message });
            }
        } catch (error) {
            console.error("Error adding or updating license:", error);
            return res.status(401).json({ error: "Failed to process license" });
        }
    },

    async getAgentData(req, res) {
        try {
            const { id } = req.query; // Assuming no data is passed in the body, it's likely not needed here
            const agentDetails = await licenseService.getAgentData(id);
            return res.status(200).json({ agentDetails });
        } catch (error) {
            console.error("Error fetching call centers:", error);
            return res.status(500).json({ error: "Failed to fetch call centers" });
        }
    }

}
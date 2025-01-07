
const licenseService = require("../services/license.service");


module.exports = {


    async addLicense(req, res) {
        try {
            const userDetail = req.body;
            console.log(userDetail); // Add this line to log the request body and check its structure.
    
            const addlicense = await licenseService.addLicense(userDetail);
            return res.status(200).json({ message: addlicense.message });
        }
        catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed to create user" });
        }
    }
    
}

const licenseService = require("../services/license.service");


module.exports = {
    async addLicense(req, res) {
        try {
            const { user_id,first_name, last_name, email, cell_number  } = req.body;
    
            // Log the extracted details to verify
            console.log({ first_name, last_name, email, cell_number, user_id });
    
            // Pass individual parameters to the service function
            const addlicense = await licenseService.addLicense(
                user_id,
                first_name,
                last_name,
                email,
                cell_number,
            );
    
            return res.status(200).json({ message: addlicense.message });
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(401).json({ error: "Failed to create user" });
        }
    }
,    

    async updatelicense(req,res){
 try {
        const {
            id,
            address,
            date_of_birth,
            ssn,
            states,
            license_numbers,
            license_issue_dates,
            license_expiry_dates,
            license_types,
            id_number,
            id_front_image,
            id_back_image,
            other_agencies
        } = req.body;

        // Log the request body to check its structure
        console.log(req.body);

        // Pass the received data and the ID to the service
        const updateLicenseResult = await licenseService.updateLicense(
            id,
            address,
            date_of_birth,
            ssn,
            states,
            license_numbers,
            license_issue_dates,
            license_expiry_dates,
            license_types,
            id_number,
            id_front_image,
            id_back_image,
            
            other_agencies
        );

        return res.status(200).json({ message: updateLicenseResult.message });
    } catch (error) {
        console.error("Error updating license:", error);
        return res.status(401).json({ error: "Failed to update license" });
    }
}
}
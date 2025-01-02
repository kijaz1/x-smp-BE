const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const convertBase64 = require('../utils/utils');



module.exports = {

    // GET ALL MANAGERS REGISTERED  
    async getAllManagers() {
        try {
            const managerMap = new Map();
            const [managers] = await pool.query(sql.GET_ALL_MANAGERS);

            managers.forEach(manager => {
                const existingManager = managerMap.get(manager.user_id);

                if (existingManager) {
                    existingManager.roles.push(manager.role);
                } else {
                    managerMap.set(manager.user_id, {
                        "user_id": manager.user_id,
                        "first_name": manager.first_name,
                        "last_name": manager.last_name,
                        "email": manager.email,
                        "password": manager.password,
                        "user_type": manager.user_type,
                        "roles": [manager.role],
                        "designation": manager.designation,
                        "date_of_joining": manager.date_of_joining
                    });
                }
            });

            const modifiedManagers = Array.from(managerMap.values());
            return modifiedManagers;

        } catch (error) {
            console.error("Error fetching manager attendance:", error);
            throw error;
        }
    },

    // GET ALL MANAGERS ATTENDANCE
   

}
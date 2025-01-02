const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
// const { generateToken } = require("../util/admin.jwt");

module.exports = {

    // TO RESGISTER USERS


    async register(userDetail) {
        try {
            const { first_name, last_name, email, password, role, phone_number } = userDetail;

            // Check if the user is already registered
            const result = await pool.query(sql.CHECK_USER_REGISTERED, [email]);
            const isUserRegistered = result.rows;

            if (!isUserRegistered.length) {
                // Insert the new user into the database and return the ID
                const insertResult = await pool.query(sql.INSERT_INTO_USERS, [
                    first_name,
                    last_name,
                    email,
                    password,
                    role,
                    phone_number
                ]);

                const registeredUserId = insertResult.rows[0].id; // Get the ID of the newly registered user

                return { message: "User Created Successfully", userId: registeredUserId };
            } else {
                return { message: "User Already Registered" };
            }
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // SIGN IN
    async signIn(email, password, role) {
        try {


            if (role === 'MABK') {

                const result = await pool.query(sql.LOGIN_USER, [
                    email,
                    password,
                    role
                ]);

                // Check if there are any results in the rows array
                if (result.rows.length === 0) {
                    throw new Error("Invalid email, password, or role.");
                }

                // Return the manager user data
                const userData = result.rows[0];
                console.log("Sign-in successful for Manager:", userData.first_name, userData.last_name);

                return {
                    user_id: userData.id || "",
                    first_name: userData.first_name || "",
                    last_name: userData.last_name || "",
                    email: userData.email || "",
                    password: userData.password || "",
                    role: userData.role || "",
                    callcenter_id: userData.callcenter_id || "",
                    center_name: userData.center_name || "",
                    country: userData.country || "",
                    owner_phone_no: userData.owner_phone_no || "",
                    authorized_person: userData.authorized_person || "",
                    center_email: userData.center_email || "",
                    phone_number: userData.phone_number || "",
                    phone_number: userData.phone_number || "",
                    phone_number: userData.phone_number || "",
                };
            } else if (role === 'MADD' || role === 'MACC') {
                // Query for other user roles (MADD, MACC)
                const result = await pool.query(sql.LOGIN_USER, [
                    email,
                    password,
                    role
                ]);

                // Check if there are any results in the rows array
                if (result.rows.length === 0) {
                    throw new Error("Invalid email, password, or role.");
                }

                // Return the user data
                const userData = result.rows[0];

                return {
                    user_id: userData.id || "",
                    first_name: userData.first_name || "",
                    last_name: userData.last_name || "",
                    email: userData.email || "",
                    password: userData.password || "",
                    role: userData.role || "",
                    phone_number: userData.phone_number || "",
                    callcenter_id: userData.callcenter_id || "",
                    center_name: userData.center_name || "",
                    country: userData.country || "",
                    owner_phone_no: userData.owner_phone_no || "",
                    authorized_person: userData.authorized_person || "",
                    center_email: userData.center_email || "",
                    phone_number: userData.phone_number || "",
                    phone_number: userData.phone_number || "",
                    phone_number: userData.phone_number || "",
                };
                console.log("sign in successfull");

            } else {
                // Invalid role
                throw new Error("Invalid role.");
            }
        } catch (error) {
            console.error("Error signing in:", error.message);
            throw error;
        }
    }



};
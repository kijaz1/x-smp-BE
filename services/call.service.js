const { pool } = require("../db.service.js/db.conn");
const sql = require("../db.service.js/queries.service");
const utils = require('../utils/utils');
const countryPrefix = require("../utils/country.prefix.json")





module.exports = {

    async insertcalldata(Callinsert) {
        try {
            const {
                user_id,
                name,
                address_line_1,
                address_line_2,
                city,
                state,
                country,
                owner_name,
                upload_owner_id,
                owner_phone_no,
                whatsapp_no,
                authorized_person,
                center_email,
                skype_id,
                account_information,
                upload_fully_executed_contract,
                payout,
            } = Callinsert;

            let prefix;
            // Validate that country is provided
            if (!country) {
                throw new Error("Country is required");
            }
            else {
                prefix = this.getCountryPrefix(country)
            }

            // Fetch the most recent callcenter_id for the given country
            const result = await pool.query(
                `SELECT callcenter_id
                 FROM centers
                 WHERE callcenter_id LIKE $1
                 ORDER BY created_at DESC
                 LIMIT 1;`,
                [`${prefix}%`] // Pass the prefix as the parameter for LIKE
            );

            let nextId;

            // Check if the result is empty
            if (result.rows.length > 0) {
                nextId = result.rows[0].callcenter_id;
                // Increment the ID (assuming the ID is numeric and can be incremented)
                nextId = parseInt(nextId.split('-')[1]) + 1;
            } else {
                nextId = 10; // Starting from 010 (numeric 10 to be zero-padded)
            }
            
            // Format the new callcenter_id with the prefix and zero-padding to ensure 3 digits
            const callcenter_id = `${prefix}-${nextId.toString().padStart(3, '0')}`;
            // Insert the new center data into the database
            const insertResult = await pool.query(
                `
                INSERT INTO centers (
                    callcenter_id,   
                    
                    name,
                    address_line_1,
                    address_line_2,
                    city,
                    state,
                    country, 
                    owner_name,
                    upload_owner_id,
                    owner_phone_no,
                    whatsapp_no,
                    authorized_person,
                    center_email,
                    skype_id,
                    account_information,
                    upload_fully_executed_contract,
                    payout
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *;
                `,
                [
                    callcenter_id,
                    
                    name,
                    address_line_1,
                    address_line_2,
                    city,
                    state,
                    country,
                    owner_name,
                    upload_owner_id,
                    owner_phone_no,
                    whatsapp_no,
                    authorized_person,
                    center_email,
                    skype_id,
                    account_information,
                    upload_fully_executed_contract,
                    payout,
                ]
            );

            return insertResult.rows[0]; // Return the inserted row with generated ID
        } catch (error) {
            console.error("Error inserting into centers table:", error);
            throw error;
        }
    },

    getCountryPrefix(countryName) {
        for (const [prefix, country] of Object.entries(countryPrefix)) {
            if (country === countryName) {
                return prefix;
            }
        }
        return null; // If country not found
    },

    async getallcalls() {
        try {
            const result = await pool.query(sql.ALL_CALL_DATA);

            // Log the result to inspect its structure
            console.log("Query result:", result);

            // Access the 'rows' property for the actual data
            const calls = result.rows;

            // Check if data exists and return it
            if (!calls) {
                throw new Error('No call centers found');
            }

            return calls; // Return the rows from the query
        } catch (error) {
            console.error("Error fetching call center data:", error);
            throw error;
        }
    }




}
module.exports = {

    CHECK_DATABASE: `
    SELECT 1 
    FROM pg_database 
    WHERE datname = 'xsmp';
`,

    CREATE_DATABASE: `CREATE DATABASE xsmp;`,


    CREATE_TABLE_USERS: `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    callcenter_id VARCHAR(50) REFERENCES centers(callcenter_id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(50),
    phone_number VARCHAR(50),
    isdeleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`,
    CREATE_TABLE_LEADS: `
CREATE TABLE IF NOT EXISTS leads (
 id SERIAL PRIMARY KEY,
 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
 callcenter_id VARCHAR(50) REFERENCES centers(callcenter_id) ON DELETE CASCADE,
 first_name VARCHAR(50),
 last_name VARCHAR(50),
 address VARCHAR(255),
 city VARCHAR(100),
 state VARCHAR(50),
 zip_code VARCHAR(20),
 date_of_birth DATE,
 gender VARCHAR(10),
 recording_link VARCHAR(255),
 cell_phone VARCHAR(50),
 home_phone VARCHAR(50),
 email VARCHAR(100),
 mode_of_paymemt VARCHAR(100),
 decision_make VARCHAR(100),
 form_status VARCHAR(50),
 isdeleted BOOLEAN DEFAULT false,
 claim_lead BOOLEAN DEFAULT false,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`,

    CREATE_TABLE_CENTERS: `
CREATE TABLE IF NOT EXISTS centers (
 callcenter_id VARCHAR(50) PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 address_line_1 VARCHAR(255),
 address_line_2 VARCHAR(255),
 city VARCHAR(100),
 state VARCHAR(100),
 country VARCHAR(100),
 owner_name VARCHAR(100),
 upload_owner_id VARCHAR(255),
 owner_phone_no VARCHAR(50),
 whatsapp_no VARCHAR(50),
 authorized_person VARCHAR(100),
 center_email VARCHAR(100),
 skype_id VARCHAR(100),
 account_information TEXT,
 upload_fully_executed_contract VARCHAR(255),
 payout DECIMAL(10, 2) CHECK (payout >= 0),
 is_deleted BOOLEAN DEFAULT false,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );`,

    CLAIMED_LEAD: `
 CREATE TABLE IF NOT EXISTS claim_lead (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
     date_time TIMESTAMP NOT NULL,
     is_claim BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
 `,

    CALL_BACK_LEADS: `
 CREATE TABLE IF NOT EXISTS call_back_leads (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
     date DATE NOT NULL,             -- Separate column for date
     time TIME NOT NULL,             -- Separate column for time
     additional_notes TEXT,
     claim_lead BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
 
 `,

CREATE_TABLE_LICENSE_AGENT:`
CREATE TABLE insurance_applicants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) ,
    last_name VARCHAR(100) ,
    address VARCHAR(255) ,
    cell_number VARCHAR(50) ,
    date_of_birth DATE ,
    ssn VARCHAR(59) ,
    email VARCHAR(100) ,
    states TEXT ,  -- Stores a list of states the applicant is licensed in
    license_numbers TEXT,  -- Stores license numbers corresponding to each state
    license_issue_dates TEXT,  -- Stores license issue dates corresponding to each state
    license_expiry_dates TEXT,  -- Stores license expiry dates corresponding to each state
    license_types TEXT,  -- Stores license types ('Resident', 'Non-resident') for each state
    id_number VARCHAR(50) ,
    id_front_image VARCHAR(255) ,  -- Path to the front image of ID
    id_back_image VARCHAR(255) ,   -- Path to the back image of ID
    other_agencies TEXT,  -- Names of other agencies if applicable
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`,

    ADD_MASTER_ADMIN_BK: `
INSERT INTO users (callcenter_id, first_name, last_name, email, password, role, phone_number)
SELECT 'PK-010', 'Kashif', 'Ijaz', 'kashif.ijaz@xphyre.com', '12345678', 'MABK', '12345678'
WHERE NOT EXISTS (
    SELECT 1
    FROM users
    WHERE email = 'kashif.ijaz@xphyre.com'
    AND phone_number = '12345678'
);
`
    ,
    CHECK_USER_REGISTERED: `
SELECT id FROM users WHERE email = $1 AND isdeleted = false;
`,
    INSERT_INTO_USERS: `
INSERT INTO users (callcenter_id, first_name, last_name, email, password, role, phone_number)
VALUES ('PK-010',$1, $2, $3, $4, $5, $6)
RETURNING id;
`,


    ADD_CENTER: `
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
)
SELECT 
    'PK-010', 
    'Xphyre Call Center', 
    '123 Main Street', 
    'Suite 400', 
    'Los Angeles', 
    'California', 
    'USA', 
    'Kashif Ijaz', 
    'owner_id_123', 
    '123-456-7890', 
    '123-456-7890', 
    'Jane Smith', 
    'callcenter@example.com', 
    'live:callcenter', 
    'Bank Account: ABC Bank, Account No: 12345678', 
    'contract_file_path.pdf', 
    1000.00
WHERE NOT EXISTS (
    SELECT 1
    FROM centers
    WHERE callcenter_id = 'PK-010'
);
`
    ,


    //     LOGIN_USER: `SELECT id, first_name, last_name, email, password, role, phone_number
    // FROM users
    // WHERE email = $1 AND password = $2 AND role = $3;
    // `,

    LOGIN_USER: `
SELECT 
    u.id, 
    u.first_name, 
    u.last_name, 
    u.email, 
    u.password, 
    u.role, 
    u.phone_number, 
    c.callcenter_id, 
    c.name AS center_name, 
    c.address_line_1, 
    c.address_line_2, 
    c.city, 
    c.state, 
    c.country, 
    c.owner_name, 
    c.owner_phone_no, 
    c.whatsapp_no, 
    c.authorized_person, 
    c.center_email, 
    c.skype_id, 
    c.account_information, 
    c.upload_fully_executed_contract, 
    c.payout
FROM 
    users u
JOIN 
    centers c
ON 
    u.callcenter_id = c.callcenter_id
WHERE 
    u.email = $1 
    AND u.password = $2 
    
    AND u.isdeleted = false 
    AND (c.is_deleted = false OR c.is_deleted IS NULL);
`,


    ADD_INITIAL_LEAD: `
INSERT INTO leads (
    user_id, 
    callcenter_id, 
    first_name, 
    last_name, 
    address, 
    city, 
    state, 
    zip_code, 
    date_of_birth, 
    gender, 
    recording_link, 
    cell_phone, 
    home_phone, 
    email, 
    mode_of_paymemt, 
    decision_make, 
    form_status
)
VALUES (
    1, 
    'PK-010', 
    'John', 
    'Doe', 
    '456 Elm Street', 
    'San Francisco', 
    'California', 
    '94103', 
    '1990-05-15', 
    'Male', 
    'recordings/johndoe.mp3', 
    '123-456-7890', 
    '098-765-4321', 
    'johndoe@example.com', 
    'Full-time Employment', 
    'Self', 
    'Pending'
);
`

    ,

    APPROVED_LEAD: `
    SELECT 
    leads.*, 
    users.first_name AS approved_by_first_name, 
    users.last_name AS approved_by_last_name,
    users.email AS approved_by_email
FROM 
    leads
JOIN 
    users ON leads.user_id = users.id   
WHERE 
    leads.form_status = 'Approved'
    AND leads.user_id = $1; `,
    REJECTED_LEAD: `
    SELECT 
    leads.*, 
    users.first_name AS approved_by_first_name, 
    users.last_name AS approved_by_last_name,
    users.email AS approved_by_email
FROM 
    leads
JOIN 
    users ON leads.user_id = users.id   
WHERE 
    leads.form_status = 'Rejected'
    AND leads.user_id = $1; `,

    DELETE_LEAD: `UPDATE leads SET isdeleted = true WHERE id = $1;`,

    EDIT_LEAD: `UPDATE leads
SET first_name = $1,
    last_name = $2,
    address = $3,
    city = $4,
    cell_phone = $5
WHERE id = $6;

`,


    UPDATE_LEAD: `
UPDATE leads
SET form_status = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;
`,

    UUPDATE_CLAIM_LEAD: `
    UPDATE leads
    SET claim_lead = $1
    WHERE user_id = $2 AND id = $3;
`,


    UUPDATE_CALL_BACK_LEAD: `
UPDATE claim_lead
SET is_claim = $1
WHERE user_id = $2 AND lead_id = $3;
`,


    CONFIRM_CLAIM_LEAD_TO_CALL_BACK_LEAD: `
UPDATE leads
SET claim_lead = $1
WHERE user_id = $2 AND id = $3;
`,


    ADD_LEAD: `
    INSERT INTO leads (
        user_id,callcenter_id, first_name, last_name, address, city, state, zip_code, date_of_birth, 
        gender, recording_link, cell_phone, home_phone, email, mode_of_paymemt, 
        decision_make, form_status, isdeleted
    )    
    VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,$18)
`,
    INSERT_CLAIMED_LEAD: `
INSERT INTO claim_lead (
    user_id, 
    lead_id, 
    date_time
) 
VALUES (
    $1,  
    $2,  
    CURRENT_TIMESTAMP
)
RETURNING id, user_id, lead_id, date_time, created_at, updated_at;
`,
    ALL_LEAD: `
SELECT 
    *
FROM leads
WHERE isdeleted = false AND claim_lead = false;
`, ALL_LEAD_IN_CLAIM_LEAD: `
SELECT 
    cl.id AS claim_id,
    cl.user_id,
    cl.lead_id,
    cl.date_time,
    cl.created_at AS claim_created_at,
    cl.updated_at AS claim_updated_at,
    l.first_name,
    l.last_name,
    l.cell_phone,
    l.email,
    l.form_status,
    l.recording_link,
    l.created_at AS lead_created_at,
    l.updated_at AS lead_updated_at,
    u.first_name AS user_first_name,
    u.last_name AS user_last_name,
    u.email AS user_email
FROM 
    claim_lead cl
INNER JOIN 
    leads l ON cl.lead_id = l.id
INNER JOIN 
    users u ON cl.user_id = u.id
WHERE 
    cl.user_id = $1 
    AND cl.is_claim = false;
`,

    ALL_lead_BY_ID: `SELECT * 
    FROM leads 
    WHERE user_id = $1 AND isdeleted = false;
`,


    //Call center

    SELECT_ID: `SELECT callcenter_id
    FROM centers
    WHERE callcenter_id::text LIKE $1  -- Match by prefix
    ORDER BY callcenter_id DESC
    LIMIT 1;`,


    INSERT_CENTER: `
    INSERT INTO centers (
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
        payout
    )
    VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
    RETURNING *;
`,


    ALL_CALL_DATA: `
    SELECT *
    FROM centers;
`,


    //Call BACK Leads


    ADD_CALL_BACK_DATA: `
    INSERT INTO call_back_leads (
        user_id,
        lead_id,
        date,
        time,
        
        created_at
    )
    VALUES (
        $1, 
        $2, 
        CURRENT_DATE, -- Extracts the date part of the current timestamp
        CURRENT_TIME, -- Extracts the time part of the current timestamp
        
        CURRENT_TIMESTAMP -- Full timestamp for created_at
    )
    RETURNING id, user_id, lead_id, date, time,  created_at, updated_at;
    `
    ,

    ALL_LEAD_IN_CALL_BACK_LEAD: `
SELECT 
    cl.id AS claim_id,
    cl.user_id,
    cl.lead_id,
    CAST(cl.date AS TEXT) || ' ' || CAST(cl.time AS TEXT) AS date_time, -- Combine date and time
    cl.created_at AS claim_created_at,
    cl.updated_at AS claim_updated_at,
    l.first_name,
    l.last_name,
    l.cell_phone,
    l.email,
    l.form_status,
    l.recording_link,
    l.created_at AS lead_created_at,
    l.updated_at AS lead_updated_at,
    u.first_name AS user_first_name,
    u.last_name AS user_last_name,
    u.email AS user_email
FROM 
    call_back_leads cl
INNER JOIN 
    leads l ON cl.lead_id = l.id
INNER JOIN 
    users u ON cl.user_id = u.id
WHERE 
    cl.user_id = $1 AND l.claim_lead = true;


`,

    //Claimed Lead





    SELECT_PAYOUT: `
     SELECT payout 
    FROM centers 
    WHERE is_deleted = false AND callcenter_id = $1;
    `,

    GET_APPROVED_LEADS_BY_CENTER: `
SELECT 
    l.id,
    l.user_id,
    l.callcenter_id,
    l.first_name,
    l.last_name,
    l.address,
    l.city,
    l.state,
    l.zip_code,
    l.date_of_birth,
    l.gender,
    l.recording_link,
    l.cell_phone,
    l.home_phone,
    l.email,
    l.mode_of_paymemt,
    l.decision_make,
    l.form_status,
    l.isdeleted,
    l.created_at,
    l.updated_at,
    u.first_name AS user_first_name,
    u.last_name AS user_last_name,
    c.name AS callcenter_name
FROM 
    leads l
LEFT JOIN 
    users u ON l.user_id = u.id
LEFT JOIN 
    centers c ON l.callcenter_id = c.callcenter_id
WHERE 
    l.form_status = 'approved' 
    AND l.isdeleted = false
    AND l.callcenter_id = $1
    AND l.created_at BETWEEN $2 AND $3;
`,

    UPDATE_LEAD_STATUS: `
UPDATE leads
SET form_status = $1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2;
`,
// licENSE


ADD_LICENSE: `
INSERT INTO insurance_applicants (
    user_id, first_name, last_name, email, cell_number
)    
VALUES ($1, $2, $3, $4, $5)
RETURNING id, first_name, last_name, email, cell_number
`
,

UPDATE_LICENSE: `
UPDATE insurance_applicants
SET
    
    address = $1,
    date_of_birth = $2,
    ssn = $3,
    states = $4,
    license_numbers = $5,
    license_issue_dates = $6,
    license_expiry_dates = $7,
    license_types = $8,
    id_number = $9,
    id_front_image = $10,
    id_back_image = $11,
    other_agencies = $12
WHERE
    id = $13
RETURNING id, address, date_of_birth, ssn, states, license_numbers, license_issue_dates, license_expiry_dates, license_types, id_number, id_front_image, id_back_image, other_agencies;
`,
SHOW_LICENSE:`SELECT id, user_id, first_name, last_name, address
FROM insurance_applicants;
`,
}



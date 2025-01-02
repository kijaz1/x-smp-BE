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
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    AND u.role = $3 
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



    UPDATE_LEAD: `
UPDATE leads
SET form_status = $1, updated_at = CURRENT_TIMESTAMP
WHERE user_id = $2;
`,
    ADD_LEAD: `
    INSERT INTO leads (
        user_id, first_name, last_name, address, city, state, zip_code, date_of_birth, 
        gender, recording_link, cell_phone, home_phone, email, mode_of_paymemt, 
        decision_make, form_status, isdeleted
    )    
    VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
`,

    ALL_LEAD: `
    SELECT 
        id,
        user_id,
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
    FROM leads
    WHERE isdeleted = false;
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

    CALL_BACK_LEADS: `
CREATE TABLE IF NOT EXISTS call_back_leads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    date DATE NOT NULL,             -- Separate column for date
    time TIME NOT NULL,             -- Separate column for time
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`,
    ADD_CALL_BACK_DATA: `INSERT INTO call_back_leads (
    user_id,
    lead_id,
    date,  -- Adjust to match the schema
    time,  -- Adjust to match the schema
    additional_notes
)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, user_id, lead_id, date, time, additional_notes, created_at, updated_at;


`,

    //Claimed Lead


    INSERT_CLAIMED_LEAD: `
    INSERT INTO claim_lead (
        user_id, 
        lead_id, 
        date_time
    ) 
    VALUES (
        $1,  -- user_id: Replace with the actual user ID
        $2,  -- lead_id: Replace with the actual lead ID    
        $3   -- date_time: Provide the timestamp (e.g., '2024-12-27 14:48:26')
    )
    RETURNING id, user_id, lead_id, date_time, created_at, updated_at;
    `,

    SELECT_PAYOUT:`
     SELECT payout 
    FROM centers 
    WHERE is_deleted = false AND callcenter_id = $1;
    `,
//     GET_APPROVED_LEADS_BY_CENTER: `
// SELECT 
//     l.id,
//     l.user_id,
//     l.callcenter_id,
//     l.first_name,
//     l.last_name,
//     l.address,
//     l.city,
//     l.state,
//     l.zip_code,
//     l.date_of_birth,
//     l.gender,
//     l.recording_link,
//     l.cell_phone,
//     l.home_phone,
//     l.email,
//     l.mode_of_paymemt,
//     l.decision_make,
//     l.form_status,
//     l.isdeleted,
//     l.created_at,
//     l.updated_at,
//     u.first_name AS user_first_name,
//     u.last_name AS user_last_name,
//     c.name AS callcenter_name
// FROM 
//     leads l
// LEFT JOIN 
//     users u ON l.user_id = u.id
// LEFT JOIN 
//     centers c ON l.callcenter_id = c.callcenter_id
// WHERE 
//     l.form_status = 'approved' 
//     AND l.isdeleted = false
//     AND l.callcenter_id = $1;
// `,
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


}
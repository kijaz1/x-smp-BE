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
 carier_status VARCHAR(50),
 assigned_to VARCHAR(50),
 isdeleted BOOLEAN DEFAULT false,
 claim_lead BOOLEAN DEFAULT false,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`,

    CREATE_TABLE_CENTERS: `
CREATE TABLE IF NOT EXISTS centers (
    id SERIAL PRIMARY KEY,  -- New primary key
    callcenter_id VARCHAR(50) UNIQUE,  -- Call center ID is now unique
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
);
`,


    CREATE_CALL_BACK_LEADS: `
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

    CREATE_TABLE_LICENSE_AGENT: `
    CREATE TABLE license_agent (
    id SERIAL PRIMARY KEY,  
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address VARCHAR(255),
    cell_number VARCHAR(50),
    date_of_birth DATE,
    ssn VARCHAR(59),
    email VARCHAR(100),
    license_details TEXT[], 
    id_number VARCHAR(50),
    id_upload_front VARCHAR(255), 
    id_upload_back VARCHAR(255), 
    issue_company VARCHAR(255),
    policy_number VARCHAR(50), 
    effictive_date DATE, 
    bank_name VARCHAR(255),
    bank_address VARCHAR(255), 
    account_title VARCHAR(255),
    account_number VARCHAR(50),
    routing_number VARCHAR(50),
    upload_voided VARCHAR(255),  
    other_agencies TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    CREATE_TABLE_HEALTH: `
    CREATE TABLE health_questionnaire (
    id SERIAL PRIMARY KEY, -- Unique ID for each record
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE, -- Foreign key to leads table
    treated_admitted_30_days BOOLEAN, -- Section 1: Q1
    terminal_illness_12_months BOOLEAN, -- Section 1: Q2
    seizure_treatment_30_days BOOLEAN, -- Section 1: Q3
    help_supervision_daily_living BOOLEAN, -- Section 1: Q4
    tumors_cancers_90_days BOOLEAN, -- Section 1: Q5
    hepatitis_c_6_months BOOLEAN, -- Section 1: Q6
    neurological_diseases BOOLEAN, -- Section 1: Q7
    on_dialysis BOOLEAN, -- Section 1: Q8
    aids_hiv_positive BOOLEAN, -- Section 1: Q9
    high_insulin_use BOOLEAN, -- Section 2: Q1
    seizures_over_2_years BOOLEAN, -- Section 2: Q2
    diabetic_neuropathy BOOLEAN, -- Section 2: Q3
    copd_no_oxygen_tobacco BOOLEAN, -- Section 2: Q4
    cardiac_procedures BOOLEAN, -- Section 3: Q1
    tumors_cancers_any BOOLEAN, -- Section 3: Q2
    brain_tumor_strokes BOOLEAN, -- Section 3: Q3
    heart_diseases_any BOOLEAN, -- Section 3: Q4
    lung_diseases_any BOOLEAN, -- Section 3: Q5
    kidney_liver_diseases BOOLEAN, -- Section 3: Q6
    diabetes_complications BOOLEAN, -- Section 3: Q7
    neurological_disorders BOOLEAN, -- Section 3: Q8
    mental_disorders BOOLEAN, -- Section 3: Q9
    pending_tests_surgeries BOOLEAN, -- Section 3: Q10
    substance_abuse BOOLEAN, -- Section 3: Q11
    medical_appliance_dependence BOOLEAN, -- Section 3: Q12,
    alternative_carrier BOOLEAN DEFAULT NULL, -- For rejection case
    accepted_carrier BOOLEAN DEFAULT NULL, -- For acceptance case
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for record creation
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
    user_id, callcenter_id, first_name, last_name, address, city, state, zip_code, date_of_birth, 
    gender, recording_link, cell_phone, home_phone, email, mode_of_payment, 
    decision_make, form_status, isdeleted
)    
VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
RETURNING id;
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
INSERT INTO license_agent (
    first_name, last_name, email, cell_number
)    
VALUES ($1, $2, $3, $4)
RETURNING*
`
    ,

    SELECT_LICENSE_BY_ID: `
    SELECT 
        first_name, 
        last_name, 
        email, 
        cell_number 
    FROM 
        license_agent
    WHERE 
        id = $1
`,


    UPDATE_LICENSE: `
UPDATE license_agent
SET
    address = $1,
    date_of_birth = $2,
    ssn = $3,
    states = $4,
    license_details=$5,
    id_number = $6,
    fileUrls= $7,
    other_agencies = $8
WHERE
    id = $9
RETURNING id, address, date_of_birth, ssn, states, license_details, id_number, fileUrls, other_agencies;
`,
    SHOW_LICENSE: `SELECT id, user_id, first_name, last_name, address
FROM insurance_applicants;
`,

    HEALTHQUESTION: `INSERT INTO health_questionnaire (
    lead_id, 
    treated_admitted_30_days, 
    terminal_illness_12_months, 
    seizure_treatment_30_days, 
    help_supervision_daily_living, 
    tumors_cancers_90_days, 
    hepatitis_c_6_months, 
    neurological_diseases, 
    on_dialysis, 
    aids_hiv_positive, 
    high_insulin_use, 
    seizures_over_2_years, 
    diabetic_neuropathy, 
    copd_no_oxygen_tobacco, 
    cardiac_procedures, 
    tumors_cancers_any, 
    brain_tumor_strokes, 
    heart_diseases_any, 
    lung_diseases_any, 
    kidney_liver_diseases, 
    diabetes_complications, 
    neurological_disorders, 
    mental_disorders, 
    pending_tests_surgeries, 
    substance_abuse, 
    medical_appliance_dependence, 
    alternative_carrier, 
    accepted_carrier
) VALUES (
    $1, -- lead_id
    $2, -- treated_admitted_30_days
    $3, -- terminal_illness_12_months
    $4, -- seizure_treatment_30_days
    $5, -- help_supervision_daily_living
    $6, -- tumors_cancers_90_days
    $7, -- hepatitis_c_6_months
    $8, -- neurological_diseases
    $9, -- on_dialysis
    $10, -- aids_hiv_positive
    $11, -- high_insulin_use
    $12, -- seizures_over_2_years
    $13, -- diabetic_neuropathy
    $14, -- copd_no_oxygen_tobacco
    $15, -- cardiac_procedures
    $16, -- tumors_cancers_any
    $17, -- brain_tumor_strokes
    $18, -- heart_diseases_any
    $19, -- lung_diseases_any
    $20, -- kidney_liver_diseases
    $21, -- diabetes_complications
    $22, -- neurological_disorders
    $23, -- mental_disorders
    $24, -- pending_tests_surgeries
    $25, -- substance_abuse
    $26, -- medical_appliance_dependence
    $27, -- alternative_carrier
    $28 -- accepted_carrier
)
RETURNING id;
`,

//     CLAIMED_LEAD: `
//  CREATE TABLE IF NOT EXISTS claim_lead (
//      id SERIAL PRIMARY KEY,
//      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//      lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
//      date_time TIMESTAMP NOT NULL,
//      is_claim BOOLEAN DEFAULT false,
//      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//  );
//  `,

}



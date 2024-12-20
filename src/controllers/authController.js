const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Ensure this is correctly configured

// User login function
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists in the database
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = rows[0];

        // Validate password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }  // Use configurable expiration if needed
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Send the generated token
        });
    } catch (error) {
        next(error); // Handle errors via Express error handler middleware
    }
};

// User signup function
const signup = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(checkQuery, [email]);

        if (rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }

        // Hash the user's password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
        const { rows: newUserRows } = await pool.query(insertQuery, [email, hashedPassword]);

        const newUser = newUserRows[0];

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                email: newUser.email
            },
        });
    } catch (error) {
        next(error); // Handle errors via Express error handler middleware
    }
};

module.exports = { login, signup };

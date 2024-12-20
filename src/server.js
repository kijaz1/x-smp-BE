const express = require('express');
const app = express();
const pool = require('./config/db');
app.use(express.json());
const routes = require('./routes');

app.use('/api', routes);


pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL database successfully');

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
        });
        client.release();
    })
    .catch(err => {
        console.error('Failed to connect to PostgreSQL database:', err);
    });

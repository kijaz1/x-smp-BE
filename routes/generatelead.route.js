const express = require('express');
const router = express.Router();

const generatelead = require('../controllers/generateled.controller');

//ROUTES

// POST
router.post('/insert-lead', generatelead.insertLead);
// router.post('/clock-out', attendenceController.clockOut);

// // GET
router.get('/get-all-lead', generatelead.getLeads);



module.exports = router;
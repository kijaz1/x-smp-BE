const express = require('express');
const router = express.Router();

const generatelead = require('../controllers/generateled.controller');

//ROUTES

// POST
router.post('/insert-lead', generatelead.insertLead);
router.post('/update-callcenter-status', generatelead.updateStatus);
router.post('/update-callcenter-claimlead', generatelead.updateClaimLead);

// // GET
router.get('/get-all-lead', generatelead.getLeads);

router.get('/get-all-lead-by-id/:userid', generatelead.getLeadsByID);


module.exports = router;
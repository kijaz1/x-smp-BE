const express = require('express');
const router = express.Router();

const generatelead = require('../controllers/generateled.controller');

//ROUTES

// POST
router.post('/insert-lead', generatelead.insertLead);
router.post('/update-callcenter-status', generatelead.updateStatus);
router.post('/update-callcenter-claimlead', generatelead.updateClaimLead);
router.post('/Delete-callcenter-claimlead', generatelead.deltelead);
router.post('/Edit-claimlead', generatelead.updateleads);
router.post('/Add-healthquestion', generatelead.healthquestion);
// // GET
router.get('/get-all-lead', generatelead.getLeads);
router.get('/get-all-lead-Approved', generatelead.getLeadsByStatusAndService);
router.get('/get-all-lead-Rejected', generatelead.getRejectedLeads);

//router.get('/get-all-lead', generatelead.getLeads);

router.get('/get-all-lead-by-id/:userid', generatelead.getLeadsByID);


module.exports = router;
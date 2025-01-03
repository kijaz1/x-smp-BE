const express = require('express');
const sharedLead = require('../controllers/claimlead.controller');

const router = express.Router();

//ROUTES

//POST
router.post('/add-lead', sharedLead.allClaimlead);
router.post('/claim-lead', sharedLead.allClaimlead);

module.exports = router;
const express = require('express');
const sharedLead = require('../controllers/claimlead.controller');

const router = express.Router();

//ROUTES

router.get('/get-lead', sharedLead.allClaimlead);
//POST
router.post('/claim-lead', sharedLead.allClaimlead);

module.exports = router;
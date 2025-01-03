const express = require('express');
const finance = require('../controllers/finance.controller');

const router = express.Router();

//ROUTES

// POST
//router.post('/register-callcenter', finance.registerCall);

// // GET
 router.get('/get-all-call-centers', finance.getAllCenters);
 router.get('/get-call-centers-payout', finance.getCentersPayout);
 router.post('/set-leads-payment-status', finance.setPaymentStatus);


module.exports = router;
const express = require('express');
const callController = require('../controllers/finance.controller');

const router = express.Router();

//ROUTES

// POST
//router.post('/register-callcenter', callController.registerCall);

// // GET
 router.get('/get-all-call-centers', callController.getAllCenters);


module.exports = router;
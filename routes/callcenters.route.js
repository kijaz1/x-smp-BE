const express = require('express');
const callController = require('../controllers/callcenter.controller');

const router = express.Router();

//ROUTES

// POST
router.post('/register-callcenter', callController.registerCall);

// // GET
 router.get('/get-all-calls', callController.getallcalls);


module.exports = router;
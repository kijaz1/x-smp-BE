const express = require('express');
const callbackcontroller = require('../controllers/callback.controller');

const router = express.Router();

//ROUTES

//POST
router.post('/call-back', callbackcontroller.callbackdata);


module.exports = router;
const express = require('express');
const callbackcontroller = require('../controllers/callback.controller');

const router = express.Router();

//ROUTES
router.get('/all-call-back', callbackcontroller.allCallBack);

//POST
router.post('/call-back', callbackcontroller.updateCallBack);


module.exports = router;
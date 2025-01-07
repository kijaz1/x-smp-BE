const express = require('express');
const license = require('../controllers/license.controller');

const router = express.Router();

router.post('/license', license.addLicense);

module.exports = router;
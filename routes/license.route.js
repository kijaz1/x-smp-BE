const express = require('express');
const license = require('../controllers/license.controller');

const router = express.Router();

router.post('/license', license.addLicense);

router.post('/license_update', license.updatelicense);

module.exports = router;
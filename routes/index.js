const express = require('express');
const router = express.Router();

// ALL ROUTES THAT ARE REQUIRED
const authRoute = require('./auth.route');
const generatelead = require('./generatelead.route');
const callCenterRoute = require('./callcenters.route');
const adminRoute = require('./admin.route');
const claimleadRoute = require('./claimlead.route');
const callbackRoute = require('./callback.route');



// ROUTES
router.use('/auth', authRoute);
router.use('/generatelead', generatelead);
router.use('/callcenter', callCenterRoute);
router.use('/admin', adminRoute);
router.use('/claimlead', claimleadRoute);
router.use('/callback', callbackRoute);



module.exports = router;
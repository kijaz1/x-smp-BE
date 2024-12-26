const express = require('express');
const router = express.Router();

// ALL ROUTES THAT ARE REQUIRED
const authRoute = require('./auth.route');
const generatelead = require('./generatelead.route');
const managerRoute = require('./manager.route');
const adminRoute = require('./admin.route');
const sharedRoute = require('./shared.route');



// ROUTES
router.use('/auth', authRoute);
router.use('/generatelead', generatelead);
router.use('/manager', managerRoute);
router.use('/admin', adminRoute);
router.use('/shared', sharedRoute);



module.exports = router;
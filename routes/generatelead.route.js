const express = require('express');
const router = express.Router();

const generatelead = require('../controllers/generateled.controller');

//ROUTES

// POST
router.post('/insert-attendence', generatelead.insertAttendance);
// router.post('/clock-out', attendenceController.clockOut);

// // GET
// router.get('/get-clock-in-time/:user_id', attendenceController.getClockInTime);


module.exports = router;
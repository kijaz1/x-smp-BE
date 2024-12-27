const express = require('express');
const sharedLead = require('../controllers/claimlead.controller');

const router = express.Router();

//ROUTES

//POST
router.post('/add-lead', sharedLead.allClaimlead);
// router.post('/apply-for-leave', sharedController.applyLeave);

// // GET
// router.get('/get-attendance', sharedController.getAttendanceByUserId);
// router.get('/get-clockin-status/:userId/:date', sharedController.getClockStatusByUserIdAndDate);
// router.get('/get-clockin-time/:userId/:date', sharedController.getClockInTimeByUserIdAndDate);
// router.get('/check-progress', sharedController.checkProgress);
// router.get('/check-all-progress-entered', sharedController.checkAllProgressEntered);
// router.get('/get-progress-detail/:attendanceId/:date', sharedController.getProgressDetail);
// router.get('/get-all-pending-leaves', sharedController.getAllPendingleaves);
// router.get('/get-all-leaves-applied-by-userid', sharedController.getAllLeavesAppliedByUserId);

// // PUT
// router.put('/update-leave-status', sharedController.updateLeaveStatus);

module.exports = router;
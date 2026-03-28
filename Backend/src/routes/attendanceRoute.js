const express = require("express");
const router = express.Router();
const { requestAttendanceReport, getStudentReports } = require("../controllers/attendanceController");

router.post("/request", requestAttendanceReport);
router.get("/reports/:email", getStudentReports);

module.exports = router;

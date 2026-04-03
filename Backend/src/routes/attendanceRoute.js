const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { requestAttendanceReport, getStudentReports, getAllAttendanceRequests, sendAttendancePdf, downloadAttendancePdf } = require("../controllers/attendanceController");

router.post("/request", requestAttendanceReport);
router.get("/reports/:email", getStudentReports);
router.get("/admin/requests", getAllAttendanceRequests);
router.post("/send-pdf/:id", upload.single("pdf"), sendAttendancePdf);
router.get("/download/:id", downloadAttendancePdf);

module.exports = router;

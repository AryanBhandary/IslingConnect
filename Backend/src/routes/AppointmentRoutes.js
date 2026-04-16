const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
    bookPATAppointment,
    bookITAppointment,
    getStudentAppointments,
    studentHandleReschedule,
    getPATAdminAppointments,
    getITAdminAppointments,
    updatePATAppointmentStatus,
    updateITAppointmentStatus,
    getITAppointmentStats,
    getPATAppointmentStats,
} = require("../controllers/appointmentController");

// --- Student Routes ---
router.post("/book/pat", verifyToken(["user"]), bookPATAppointment);
router.post("/book/it", verifyToken(["user"]), bookITAppointment);
router.get("/my-appointments", verifyToken(["user"]), getStudentAppointments);
router.put("/reschedule-handle/:id", verifyToken(["user"]), studentHandleReschedule);

// --- PAT Admin Routes ---
router.get("/admin/pat/all", verifyToken(["admin", "pat_admin"]), getPATAdminAppointments);
router.put("/admin/pat/update-status/:id", verifyToken(["admin", "pat_admin"]), updatePATAppointmentStatus);
router.get("/admin/pat/stats", verifyToken(["admin", "pat_admin"]), getPATAppointmentStats);

// --- IT Admin Routes ---
router.get("/admin/it/all", verifyToken(["admin", "it_admin"]), getITAdminAppointments);
router.put("/admin/it/update-status/:id", verifyToken(["admin", "it_admin"]), updateITAppointmentStatus);
router.get("/admin/it/stats", verifyToken(["admin", "it_admin"]), getITAppointmentStats);

module.exports = router;

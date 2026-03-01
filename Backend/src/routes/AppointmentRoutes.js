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
} = require("../controllers/appointmentController");

// --- Student Routes ---
router.post("/book/pat", verifyToken(["user"]), bookPATAppointment);
router.post("/book/it", verifyToken(["user"]), bookITAppointment);
router.get("/my-appointments", verifyToken(["user"]), getStudentAppointments);
router.put("/reschedule-handle/:id", verifyToken(["user"]), studentHandleReschedule);

// --- PAT Admin Routes ---
router.get("/admin/pat/all", verifyToken(["admin", "ss_admin", "pat_admin"]), getPATAdminAppointments);
router.put("/admin/pat/update-status/:id", verifyToken(["admin", "ss_admin", "pat_admin"]), updatePATAppointmentStatus);

// --- IT Admin Routes ---
router.get("/admin/it/all", verifyToken(["admin", "ss_admin", "it_admin"]), getITAdminAppointments);
router.put("/admin/it/update-status/:id", verifyToken(["admin", "ss_admin", "it_admin"]), updateITAppointmentStatus);

module.exports = router;

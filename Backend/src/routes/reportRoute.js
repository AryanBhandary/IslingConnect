const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyToken = require("../middlewares/authMiddleware");

// All routes require an admin role
const allowedRoles = ["ss_admin", "it_admin", "pat_admin", "lf_admin"];

router.post("/generate", verifyToken(allowedRoles), reportController.generateReport);
router.get("/", verifyToken(allowedRoles), reportController.getReports);
router.get("/:id/download", verifyToken(allowedRoles), reportController.downloadReport);

module.exports = router;

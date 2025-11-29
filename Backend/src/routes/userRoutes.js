const express = require ("express");
const verifyToken = require ("../middlewares/authMiddleware");
const router = express.Router();

// Only allow admin
router.get("/admin", verifyToken(["admin"]), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// Only allow admin
router.get("/ss_admin", verifyToken(["ss_admin"]), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// Only allow admin
router.get("/pat_admin", verifyToken(["pat_admin"]), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// Only allow admin
router.get("/it_admin", verifyToken(["it_admin"]), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// Only allow admin
router.get("/lf_admin", verifyToken(["lf_admin"]), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

// Allow all logged-in users
router.get("/user", verifyToken(), (req, res) => {
    res.json({ message: "Welcome User" });
});

module.exports = router;

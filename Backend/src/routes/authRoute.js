const express = require("express");
const { register, login, sendOtp, sendResetOtp, resetPassword } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;

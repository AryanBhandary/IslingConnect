const express = require("express");
const { register, login, sendOtp } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);

module.exports = router;

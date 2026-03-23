const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const { sendEmail } = require("../services/emailService");
const crypto = require("crypto");

// SEND OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate domain
    if (!email.endsWith("@islingtoncollege.edu.np")) {
      return res.status(400).json({ message: "Only @islingtoncollege.edu.np emails are allowed" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP to DB (replaces existing if any for this email)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send Email
    await sendEmail(
      email,
      "Your IslingConnect Verification Code",
      `Your verification code is: ${otp}. It will expire in 10 minutes.`
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({
      message: "Failed to send OTP",
      error: err.message,
      details: "Check if your email/password matches. You may need an App Password if MFA is on."
    });
  }
};

// REGISTER
const register = async (req, res) => {
  try {
    const { username, email, phone, password, role, otp } = req.body;

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Delete OTP after verification
    await Otp.deleteOne({ _id: otpRecord._id });

    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({ username, email, phone, password: hashedPassword, role });
    await newUser.save();

    // generate JWT
    const token = jwt.sign(
      { id: newUser._id, name: newUser.username, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // send response
    res.status(201).json({
      message: "User Registered",
      token,
      role: newUser.role,
      user: { id: newUser._id, name: newUser.username, email: newUser.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.username, phone: user.phone, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      role: user.role,
      user: { id: user._id, name: user.username, phone:user.phone, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, sendOtp };

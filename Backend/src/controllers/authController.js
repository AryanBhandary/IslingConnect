const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// REGISTER
const register = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

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
      { id: user._id, name: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      role: user.role,
      user: { id: user._id, name: user.username, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };

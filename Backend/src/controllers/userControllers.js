const User = require("../models/userModel");


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" })
        }
        res.status(200).json(users)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const countUsers = async (req, res) => {
    try {
        const noSuperAdmin = ["user", "ss_admin", "lf_admin", "pat_admin", "it_admin"]
        const totalUsers = await User.countDocuments({ role: { $in: noSuperAdmin } });
        const excludedRoles = ["admin", "ss_admin", "lf_admin", "pat_admin", "it_admin"];

        const adminRoles = ["ss_admin", "lf_admin", "pat_admin", "it_admin"];
        const totalAdmins = await User.countDocuments({ role: { $in: adminRoles } });

        const totalStudents = await User.countDocuments({ role: { $nin: excludedRoles } })

        res.status(200).json({ totalUsers, totalAdmins, totalStudents });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { username, phone } = req.body;
        const userId = req.user.id;
        const trimmedUsername = typeof username === "string" ? username.trim() : "";
        const trimmedPhone = typeof phone === "string" ? phone.trim() : "";

        if (!trimmedUsername && !trimmedPhone) {
            return res.status(400).json({ message: "Username and phone number are required" });
        }

        if (!trimmedUsername) {
            return res.status(400).json({ message: "Username is required" });
        }

        if (!trimmedPhone) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // Check phone uniqueness if being updated
        const existing = await User.findOne({ phone: trimmedPhone, _id: { $ne: userId } });
        if (existing) {
            return res.status(409).json({ message: "Phone number is already in use" });
        }

        const updates = {};
        updates.username = trimmedUsername;
        updates.phone = trimmedPhone;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, select: "-password" }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllUsers,
    countUsers,
    updateProfile
}
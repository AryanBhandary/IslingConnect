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

module.exports = {
    getAllUsers,
    countUsers
}
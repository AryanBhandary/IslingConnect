const AttendanceReport = require("../models/AttendanceReport");

const requestAttendanceReport = async (req, res) => {
    try {
        const { studentName, studentEmail } = req.body;

        if (!studentName || !studentEmail) {
            return res.status(400).json({ success: false, message: "Missing student details" });
        }

        // Save request to DB
        const report = await AttendanceReport.create({ studentName, studentEmail });

        // Emit a socket event so that the admin gets a real-time notification
        const io = req.app.get("socketio");
        if (io) {
            io.emit("attendance_report_requested", {
                studentName,
                studentEmail,
                status: "Pending",
                timestamp: new Date()
            });
        }

        res.status(200).json({ success: true, message: "Attendance report requested successfully", report });
    } catch (error) {
        console.error("Error requesting attendance report:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getStudentReports = async (req, res) => {
    try {
        const { email } = req.params;
        const reports = await AttendanceReport.find({ studentEmail: email }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error("Error fetching attendance reports:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    requestAttendanceReport,
    getStudentReports
};

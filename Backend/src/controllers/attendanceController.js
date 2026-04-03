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

const { sendEmailWithAttachment } = require("../services/emailService");

const getAllAttendanceRequests = async (req, res) => {
    try {
        const requests = await AttendanceReport.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching all attendance requests:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const sendAttendancePdf = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "No PDF file uploaded" });
        }

        const report = await AttendanceReport.findById(id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Attendance report request not found" });
        }

        const subject = "Your Attendance Report";
        const text = `Dear ${report.studentName},\n\nPlease find attached your requested attendance report.\n\nRegards,\nStudent Service Department`;

        await sendEmailWithAttachment(report.studentEmail, subject, text, file.originalname, file.buffer);

        report.status = "Sent";
        report.fileData = file.buffer;
        report.fileName = file.originalname;
        await report.save();

        // Optional: emit socket event if connected
        const io = req.app.get("socketio");
        if (io) {
            io.emit("attendance_report_sent", {
                id: report._id,
                studentEmail: report.studentEmail,
                status: "Sent"
            });
        }

        res.status(200).json({ success: true, message: "Attendance report sent successfully", report });
    } catch (error) {
        console.error("Error sending attendance PDF:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const downloadAttendancePdf = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await AttendanceReport.findById(id);

        if (!report || !report.fileData) {
            return res.status(404).json({ success: false, message: "PDF not found" });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${report.fileName || 'report.pdf'}"`);
        res.send(report.fileData);
    } catch (error) {
        console.error("Error downloading attendance PDF:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    requestAttendanceReport,
    getStudentReports,
    getAllAttendanceRequests,
    sendAttendancePdf,
    downloadAttendancePdf
};

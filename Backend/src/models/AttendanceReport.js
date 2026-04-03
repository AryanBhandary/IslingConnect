const mongoose = require("mongoose");

const attendanceReportSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: "Student Service Department",
    },
    description: {
      type: String,
      default: "Attendance report requested by student.",
    },
    status: {
      type: String,
      enum: ["Sent", "Pending"],
      default: "Pending",
    },
    fileData: {
      type: Buffer,
    },
    fileName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AttendanceReport", attendanceReportSchema);

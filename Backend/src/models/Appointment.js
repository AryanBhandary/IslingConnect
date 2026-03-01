const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        studentName: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
            enum: ["PAT", "IT"],
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "Confirmed", "Reschedule Requested", "Cancelled"],
            default: "Pending",
        },
        rescheduledDate: {
            type: Date,
        },
        rescheduledTime: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

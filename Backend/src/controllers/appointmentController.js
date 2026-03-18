const Appointment = require("../models/Appointment");
const User = require("../models/userModel");

// --- Student Controllers ---

// Book PAT Appointment
const bookPATAppointment = async (req, res) => {
    try {
        const { studentName, title, date, time } = req.body;
        const studentId = req.user.id;

        // Fetch registered user details
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAppointment = new Appointment({
            student: studentId,
            studentName,
            registeredName: user.username,
            registeredEmail: user.email,
            registeredPhone: user.phone,
            title,
            department: "PAT",
            date,
            time,
            status: "Pending",
        });

        await newAppointment.save();
        res.status(201).json({ message: "PAT Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error booking PAT appointment", error: error.message });
    }
};

// Book IT Appointment
const bookITAppointment = async (req, res) => {
    try {
        const { studentName, title, date, time } = req.body;
        const studentId = req.user.id;

        // Fetch registered user details
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAppointment = new Appointment({
            student: studentId,
            studentName,
            registeredName: user.username,
            registeredEmail: user.email,
            registeredPhone: user.phone,
            title,
            department: "IT",
            date,
            time,
            status: "Pending",
        });

        await newAppointment.save();
        res.status(201).json({ message: "IT Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error booking IT appointment", error: error.message });
    }
};

// Get All Appointments (for Students)
const getStudentAppointments = async (req, res) => {
    try {
        const studentId = req.user.id;
        const appointments = await Appointment.find({ student: studentId }).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};

// Student Handle Reschedule (Accept or Cancel)
const studentHandleReschedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'accept' or 'cancel'

        const appointment = await Appointment.findById(id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        if (action === "accept") {
            appointment.date = appointment.rescheduledDate;
            appointment.time = appointment.rescheduledTime;
            appointment.status = "Confirmed";
            appointment.rescheduledDate = null;
            appointment.rescheduledTime = null;
        } else if (action === "cancel") {
            appointment.status = "Cancelled";
        }

        await appointment.save();
        res.status(200).json({ message: `Appointment ${action}ed successfully`, appointment });
    } catch (error) {
        res.status(500).json({ message: "Error handling reschedule", error: error.message });
    }
};

// --- Admin Controllers ---

// Get PAT Admin Appointments
const getPATAdminAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ department: "PAT" }).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching PAT appointments", error: error.message });
    }
};

// Get IT Admin Appointments
const getITAdminAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ department: "IT" }).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching IT appointments", error: error.message });
    }
};

// PAT Admin Update Status
const updatePATAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rescheduledDate, rescheduledTime } = req.body;

        const appointment = await Appointment.findOne({ _id: id, department: "PAT" });
        if (!appointment) return res.status(404).json({ message: "PAT Appointment not found" });

        appointment.status = status;
        if (status === "Reschedule Requested") {
            appointment.rescheduledDate = rescheduledDate;
            appointment.rescheduledTime = rescheduledTime;
        }

        await appointment.save();
        res.status(200).json({ message: "PAT Appointment status updated", appointment });
    } catch (error) {
        res.status(500).json({ message: "Error updating PAT appointment status", error: error.message });
    }
};

// IT Admin Update Status
const updateITAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rescheduledDate, rescheduledTime } = req.body;

        const appointment = await Appointment.findOne({ _id: id, department: "IT" });
        if (!appointment) return res.status(404).json({ message: "IT Appointment not found" });

        appointment.status = status;
        if (status === "Reschedule Requested") {
            appointment.rescheduledDate = rescheduledDate;
            appointment.rescheduledTime = rescheduledTime;
        }

        await appointment.save();
        res.status(200).json({ message: "IT Appointment status updated", appointment });
    } catch (error) {
        res.status(500).json({ message: "Error updating IT appointment status", error: error.message });
    }
};

// IT Appointment Stats
const getITAppointmentStats = async (req, res) => {
    try {
        const [total, pending, confirmed, cancelled, rescheduled] = await Promise.all([
            Appointment.countDocuments({ department: "IT" }),
            Appointment.countDocuments({ department: "IT", status: "Pending" }),
            Appointment.countDocuments({ department: "IT", status: "Confirmed" }),
            Appointment.countDocuments({ department: "IT", status: "Cancelled" }),
            Appointment.countDocuments({ department: "IT", status: "Reschedule Requested" }),
        ]);
        res.status(200).json({ total, pending, confirmed, cancelled, rescheduled });
    } catch (error) {
        res.status(500).json({ message: "Error fetching IT stats", error: error.message });
    }
};

// PAT Appointment Stats
const getPATAppointmentStats = async (req, res) => {
    try {
        const [total, pending, confirmed, cancelled, rescheduled] = await Promise.all([
            Appointment.countDocuments({ department: "PAT" }),
            Appointment.countDocuments({ department: "PAT", status: "Pending" }),
            Appointment.countDocuments({ department: "PAT", status: "Confirmed" }),
            Appointment.countDocuments({ department: "PAT", status: "Cancelled" }),
            Appointment.countDocuments({ department: "PAT", status: "Reschedule Requested" }),
        ]);
        res.status(200).json({ total, pending, confirmed, cancelled, rescheduled });
    } catch (error) {
        res.status(500).json({ message: "Error fetching PAT stats", error: error.message });
    }
};

module.exports = {
    bookPATAppointment,
    bookITAppointment,
    getStudentAppointments,
    studentHandleReschedule,
    getPATAdminAppointments,
    getITAdminAppointments,
    updatePATAppointmentStatus,
    updateITAppointmentStatus,
    getITAppointmentStats,
    getPATAppointmentStats,
};

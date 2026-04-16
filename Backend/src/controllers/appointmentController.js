const Appointment = require("../models/Appointment");
const User = require("../models/userModel");

// --- Student Controllers ---
const INACTIVE_APPOINTMENT_STATUSES = ["Cancelled", "Completed"];

const parseAppointmentDateTime = (dateValue, timeValue) => {
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime()) || typeof timeValue !== "string") {
        return null;
    }

    const sanitizedTime = timeValue.trim();
    const twentyFourHourMatch = sanitizedTime.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    const twelveHourMatch = sanitizedTime.match(/^([1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i);

    let hours;
    let minutes;

    if (twentyFourHourMatch) {
        hours = Number.parseInt(twentyFourHourMatch[1], 10);
        minutes = Number.parseInt(twentyFourHourMatch[2], 10);
    } else if (twelveHourMatch) {
        hours = Number.parseInt(twelveHourMatch[1], 10);
        minutes = Number.parseInt(twelveHourMatch[2], 10);
        const meridiem = twelveHourMatch[3].toUpperCase();

        if (meridiem === "AM" && hours === 12) hours = 0;
        if (meridiem === "PM" && hours !== 12) hours += 12;
    } else {
        return null;
    }

    const slotDateTime = new Date(parsedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);
    return slotDateTime;
};

const hasConflictingAppointment = async (studentId, dateValue, timeValue) => {
    const dayStart = new Date(dateValue);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const existingAppointments = await Appointment.find({
        student: studentId,
        date: { $gte: dayStart, $lt: dayEnd },
        status: { $nin: INACTIVE_APPOINTMENT_STATUSES },
    });

    const requestedDateTime = parseAppointmentDateTime(dateValue, timeValue);
    if (!requestedDateTime) {
        return false;
    }

    return existingAppointments.some((appointment) => {
        const existingDateTime = parseAppointmentDateTime(appointment.date, appointment.time);
        return existingDateTime && existingDateTime.getTime() === requestedDateTime.getTime();
    });
};

// Book PAT Appointment
const bookPATAppointment = async (req, res) => {
    try {
        const { studentName, title, date, time } = req.body;
        const studentId = req.user.id;

        const requestedDateTime = parseAppointmentDateTime(date, time);
        if (!requestedDateTime) {
            return res.status(400).json({ message: "Invalid appointment date or time" });
        }

        if (requestedDateTime.getTime() < Date.now()) {
            return res.status(400).json({ message: "Past date/time cannot be selected for appointments" });
        }

        // Fetch registered user details
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const conflictExists = await hasConflictingAppointment(studentId, date, time);
        if (conflictExists) {
            return res.status(409).json({
                message: "You already have an appointment at this date and time",
            });
        }

        const appointmentDate = new Date(requestedDateTime);
        appointmentDate.setHours(0, 0, 0, 0);

        const newAppointment = new Appointment({
            student: studentId,
            studentName,
            registeredName: user.username,
            registeredEmail: user.email,
            registeredPhone: user.phone,
            title,
            department: "PAT",
            date: appointmentDate,
            time: time.trim(),
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

        const requestedDateTime = parseAppointmentDateTime(date, time);
        if (!requestedDateTime) {
            return res.status(400).json({ message: "Invalid appointment date or time" });
        }

        if (requestedDateTime.getTime() < Date.now()) {
            return res.status(400).json({ message: "Past date/time cannot be selected for appointments" });
        }

        // Fetch registered user details
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const conflictExists = await hasConflictingAppointment(studentId, date, time);
        if (conflictExists) {
            return res.status(409).json({
                message: "You already have an appointment at this date and time",
            });
        }

        const appointmentDate = new Date(requestedDateTime);
        appointmentDate.setHours(0, 0, 0, 0);

        const newAppointment = new Appointment({
            student: studentId,
            studentName,
            registeredName: user.username,
            registeredEmail: user.email,
            registeredPhone: user.phone,
            title,
            department: "IT",
            date: appointmentDate,
            time: time.trim(),
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

        const io = req.app.get("socketio");
        if (io && appointment.student) {
            io.to(`user_${appointment.student}`).emit("appointment_status_changed", {
                appointmentId: appointment._id,
                department: appointment.department,
                status: appointment.status
            });
        }

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

        const io = req.app.get("socketio");
        if (io && appointment.student) {
            io.to(`user_${appointment.student}`).emit("appointment_status_changed", {
                appointmentId: appointment._id,
                department: "PAT",
                status: appointment.status
            });
        }

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

        const io = req.app.get("socketio");
        if (io && appointment.student) {
            io.to(`user_${appointment.student}`).emit("appointment_status_changed", {
                appointmentId: appointment._id,
                department: "IT",
                status: appointment.status
            });
        }

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

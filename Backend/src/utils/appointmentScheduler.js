const Appointment = require("../models/Appointment");

/**
 * Parses a time string like "10:00 AM" or "2:30 PM" into hours and minutes (24h format).
 */
const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
};

/**
 * Marks Confirmed appointments as Completed if 15 minutes have passed
 * since their scheduled date + time.
 */
const completeExpiredAppointments = async () => {
    try {
        const now = new Date();

        // Find all active appointments (exclude already Completed or Cancelled)
        const confirmedAppointments = await Appointment.find({
            status: { $nin: ["Completed", "Cancelled"] },
        });

        let updatedCount = 0;

        for (const appointment of confirmedAppointments) {
            const { hours, minutes } = parseTime(appointment.time);

            // Build the full scheduled Date object from appointment date + time
            const scheduledTime = new Date(appointment.date);
            scheduledTime.setHours(hours, minutes, 0, 0);

            // Add 15 minutes
            const completionTime = new Date(scheduledTime.getTime() + 15 * 60 * 1000);

            if (now >= completionTime) {
                appointment.status = "Completed";
                await appointment.save();
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            console.log(`[Scheduler] Marked ${updatedCount} appointment(s) as Completed.`);
        }
    } catch (error) {
        console.error("[Scheduler] Error completing expired appointments:", error.message);
    }
};

/**
 * Starts the scheduler - runs every minute to check for appointments to complete.
 */
const startAppointmentScheduler = () => {
    console.log("[Scheduler] Appointment auto-complete scheduler started (checks every minute).");

    // Run once immediately on startup
    completeExpiredAppointments();

    // Then run every 1 minute
    setInterval(completeExpiredAppointments, 60 * 1000);
};

module.exports = { startAppointmentScheduler };

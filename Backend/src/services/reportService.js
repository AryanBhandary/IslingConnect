const Appointment = require("../models/Appointment");
const LostFoundItem = require("../models/LostFoundItem");
const AttendanceReport = require("../models/AttendanceReport");

/**
 * Get date range for the specified period
 * @param {String} period - 'Daily', 'Weekly', 'Monthly'
 * @returns {Object} - { startDate, endDate }
 */
const getDateRange = (period) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (period.toLowerCase()) {
        case "daily":
            startDate.setHours(0, 0, 0, 0);
            break;
        case "weekly":
            startDate.setDate(endDate.getDate() - 7);
            break;
        case "monthly":
            startDate.setDate(endDate.getDate() - 30);
            break;
        default:
            startDate.setHours(0, 0, 0, 0);
    }
    return { startDate, endDate };
};

/**
 * Fetch and aggregate data for the report
 */
const fetchReportData = async (department, period) => {
    const { startDate, endDate } = getDateRange(period);
    let data = [];
    let summary = {};

    const query = {
        createdAt: { $gte: startDate, $lte: endDate }
    };

    if (department === "IT" || department === "PAT") {
        query.department = department;
        data = await Appointment.find(query).sort({ createdAt: -1 }).lean();
        
        // Calculate Summary
        summary = {
            "Total Appointments": data.length,
            "Pending": data.filter(a => a.status === "Pending").length,
            "Confirmed": data.filter(a => a.status === "Confirmed").length,
            "Completed": data.filter(a => a.status === "Completed").length,
            "Cancelled": data.filter(a => a.status === "Cancelled").length,
        };
    } else if (department === "LostFound") {
        data = await LostFoundItem.find(query)
            .populate("user", "username studentEmail phone")
            .populate("reclaimer", "username studentEmail phone")
            .sort({ createdAt: -1 })
            .lean();
        
        // Calculate Summary
        summary = {
            "Total Items": data.length,
            "Lost Items": data.filter(i => i.type === "lost").length,
            "Found Items": data.filter(i => i.type === "found").length,
            "Returned": data.filter(i => i.status === "returned").length,
            "Active": data.filter(i => i.status === "active").length,
        };
    } else if (department === "StudentServices") {
        data = await AttendanceReport.find(query).sort({ createdAt: -1 }).lean();
        
        // Calculate Summary
        summary = {
            "Total Requests": data.length,
            "Sent": data.filter(r => r.status === "Sent").length,
            "Pending": data.filter(r => r.status === "Pending").length,
        };
    }

    return { data, summary, startDate, endDate };
};

module.exports = { fetchReportData };

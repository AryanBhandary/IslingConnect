const Report = require("../models/Report");
const reportService = require("../services/reportService");
const pdfUtils = require("../utils/pdfUtils");
const User = require("../models/userModel");

/**
 * Maps User Role to Department
 */
const getDepartmentFromRole = (role) => {
    switch (role) {
        case "it_admin": return "IT";
        case "pat_admin": return "PAT";
        case "lf_admin": return "LostFound";
        case "ss_admin": return "StudentServices";
        default: return null;
    }
};

/**
 * Generate a new report
 */
const generateReport = async (req, res) => {
    try {
        const { period } = req.body;
        const adminId = req.user.id;
        const role = req.user.role;

        const department = getDepartmentFromRole(role);
        if (!department) {
            return res.status(403).json({ message: "Unauthorized role for report generation" });
        }

        const { data, summary, startDate, endDate } = await reportService.fetchReportData(department, period);

        const fileName = `report_${department.toLowerCase()}_${period.toLowerCase()}_${new Date().getTime()}.pdf`;

        const newReport = new Report({
            admin: adminId,
            department,
            period,
            startDate,
            endDate,
            summary,
            dataSnapshot: data, // Store snapshot for consistency
            fileName
        });

        await newReport.save();

        res.status(201).json({ 
            message: "Report generated successfully", 
            report: {
                _id: newReport._id,
                department: newReport.department,
                period: newReport.period,
                summary: newReport.summary,
                createdAt: newReport.createdAt,
                dataSnapshot: newReport.dataSnapshot
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Error generating report", error: error.message });
    }
};

/**
 * Get historical reports for the admin's department
 */
const getReports = async (req, res) => {
    try {
        const role = req.user.role;
        const department = getDepartmentFromRole(role);

        if (!department) {
            return res.status(403).json({ message: "Unauthorized role for viewing reports" });
        }

        const reports = await Report.find({ department })
            .select("-dataSnapshot") // Exclude raw data for list
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
};

/**
 * Download the report as PDF
 */
const downloadReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id).populate("admin", "username");

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Verify department access
        const userDepartment = getDepartmentFromRole(req.user.role);
        if (userDepartment !== report.department) {
            return res.status(403).json({ message: "Access denied to this report" });
        }

        const pdfBuffer = await pdfUtils.generatePDFReport(
            {
                department: report.department,
                period: report.period,
                startDate: report.startDate,
                endDate: report.endDate,
                adminName: report.admin.username,
                summary: report.summary
            },
            report.dataSnapshot
        );

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${report.fileName}"`,
            "Content-Length": pdfBuffer.length,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({ message: "Error downloading report", error: error.message });
    }
};

module.exports = {
    generateReport,
    getReports,
    downloadReport
};

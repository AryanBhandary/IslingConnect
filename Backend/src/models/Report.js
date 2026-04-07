const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        department: {
            type: String,
            required: true,
            enum: ["IT", "PAT", "LostFound", "StudentServices"],
        },
        period: {
            type: String,
            required: true,
            enum: ["Daily", "Weekly", "Monthly"],
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        summary: {
            type: Object,
            required: true,
        },
        dataSnapshot: [
            {
                type: mongoose.Schema.Types.Mixed,
            },
        ],
        fileName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Report", reportSchema);

const mongoose = require("mongoose");

const lostFoundItemSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["lost", "found"],
        },
        category: {
            type: String,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        linkUserInfo: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reclaimer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        claimCode: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "pending", "returned"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LostFoundItem", lostFoundItemSchema);

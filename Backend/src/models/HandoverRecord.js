const mongoose = require("mongoose");

const handoverRecordSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LostFoundItem",
            required: true,
        },
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reclaimer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        itemName: String,
        handoverDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("HandoverRecord", handoverRecordSchema);

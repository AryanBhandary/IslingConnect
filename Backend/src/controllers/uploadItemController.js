const LostFoundItem = require("../models/LostFoundItem");

const HandoverRecord = require("../models/HandoverRecord");
const crypto = require("crypto");

const reportItem = async (req, res) => {
    try {
        console.log("[Backend] Received reportItem request:", req.body);
        console.log("[Backend] User from token:", req.user);

        const {
            type,
            category,
            itemName,
            date,
            location,
            imageUrl,
            linkUserInfo,
        } = req.body;

        if (!type || !category || !itemName || !date || !location) {
            console.log("[Backend] Missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newItem = new LostFoundItem({
            type,
            category,
            itemName,
            date,
            location,
            imageUrl,
            linkUserInfo,
            user: req.user.id,
            status: "active",
        });

        await newItem.save();
        console.log("[Backend] Item saved successfully:", newItem._id);

        res.status(201).json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} item reported successfully`,
            item: newItem,
        });
    } catch (err) {
        console.error("[Backend] Report item error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getLostFoundItems = async (req, res) => {
    try {
        const items = await LostFoundItem.find({ status: { $in: ["active", "pending"] } })
            .populate("user", "username email phone")
            .sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        console.error("Get items error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getMyItems = async (req, res) => {
    try {
        const items = await LostFoundItem.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAdminItems = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status && status !== "all" ? { status } : {};
        const items = await LostFoundItem.find(filter)
            .populate("user", "username email phone")
            .populate("reclaimer", "username email phone")
            .sort({ updatedAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const generateClaimCode = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await LostFoundItem.findOne({ _id: itemId, user: req.user.id });

        if (!item) return res.status(404).json({ message: "Item not found or unauthorized" });

        const code = crypto.randomBytes(4).toString("hex").toUpperCase();
        item.claimCode = code;
        item.status = "pending";
        await item.save();

        res.status(200).json({ claimCode: code, message: "Claim code generated" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const verifyClaim = async (req, res) => {
    try {
        const { claimCode, itemId } = req.body;
        const item = await LostFoundItem.findById(itemId);

        if (!item) return res.status(404).json({ message: "Item not found" });
        if (item.claimCode !== claimCode) return res.status(400).json({ message: "Invalid claim code" });
        if (item.status === "returned") return res.status(400).json({ message: "Item already returned" });
        if (item.user.toString() === req.user.id) return res.status(400).json({ message: "You cannot claim your own item" });

        item.status = "returned";
        item.reclaimer = req.user.id;
        item.claimCode = null;
        await item.save();

        // Create record for admin
        const record = new HandoverRecord({
            item: item._id,
            uploader: item.user,
            reclaimer: req.user.id,
            itemName: item.itemName,
        });
        await record.save();

        res.status(200).json({ message: "Claim verified successfully", item });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getLFStats = async (req, res) => {
    try {
        const total = await LostFoundItem.countDocuments();
        const active = await LostFoundItem.countDocuments({ status: "active" });
        const pending = await LostFoundItem.countDocuments({ status: "pending" });
        const returned = await LostFoundItem.countDocuments({ status: "returned" });

        res.status(200).json({ total, active, pending, returned });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    reportItem,
    getLostFoundItems,
    getMyItems,
    getAdminItems,
    getLFStats,
    generateClaimCode,
    verifyClaim
};

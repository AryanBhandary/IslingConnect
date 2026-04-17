const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
    reportItem,
    getLostFoundItems,
    getMyItems,
    getAdminItems,
    getLFStats,
    generateClaimCode,
    verifyClaim
} = require("../controllers/uploadItemController");

// POST /api/lost-found/report - Protected route
router.post("/report", verifyToken(), reportItem);

// GET /api/lost-found/items - Public (Active items)
router.get("/items", getLostFoundItems);

// GET /api/lost-found/my-items - Protected
router.get("/my-items", verifyToken(), getMyItems);

// GET /api/lost-found/admin/stats - Protected (Admin only)
router.get("/admin/stats", verifyToken(["admin", "lf_admin"]), getLFStats);

// GET /api/lost-found/admin/items - Protected (Only for lf_admin)
router.get("/admin/items", verifyToken(["admin", "lf_admin"]), getAdminItems);

// POST /api/lost-found/generate-code/:itemId - Protected (Uploader only)
router.post("/generate-code/:itemId", verifyToken(), generateClaimCode);

// POST /api/lost-found/verify-claim - Protected (Reclaimer)
router.post("/verify-claim", verifyToken(), verifyClaim);

module.exports = router;

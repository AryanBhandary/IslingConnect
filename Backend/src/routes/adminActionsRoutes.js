const express = require("express");
const router = express.Router();

const {
  updateUserRole,
} = require("../controllers/adminActionsController");

router.put("/:id/role", updateUserRole);

module.exports = router;
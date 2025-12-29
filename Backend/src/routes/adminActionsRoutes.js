const express = require("express");
const router = express.Router();

const {
  updateUserRole,
  deleteUser,
} = require("../controllers/adminActionscontroller");

router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
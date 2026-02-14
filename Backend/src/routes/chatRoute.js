const express = require("express");
const router = express.Router();
const { getOrCreateChat, getMessages, getUserChats } = require("../controllers/chatController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/init", verifyToken(), getOrCreateChat);
router.get("/user", verifyToken(), getUserChats);
router.get("/messages/:chatId", verifyToken(), getMessages);

module.exports = router;

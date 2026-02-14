const Chat = require("../models/Chat");
const Message = require("../models/Message");

// Initialize or get a chat room
const getOrCreateChat = async (req, res) => {
    try {
        const { participantId, itemId } = req.body;
        const userId = req.user.id;

        // Check if chat already exists
        let chat = await Chat.findOne({
            item: itemId,
            participants: { $all: [userId, participantId] }
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, participantId],
                item: itemId
            });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get messages for a chat room
const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chat: chatId })
            .sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get all chats for the current user
const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({ participants: userId })
            .populate("participants", "username email phone")
            .populate("item", "itemName imageUrl")
            .sort({ lastMessageTime: -1 });

        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Save a new message (used internally by socket logic or via API)
const saveMessage = async (chatId, senderId, content) => {
    try {
        const message = new Message({
            chat: chatId,
            sender: senderId,
            content
        });
        await message.save();

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: content,
            lastMessageTime: Date.now()
        });

        return message;
    } catch (err) {
        console.error("Error saving message:", err);
    }
};

module.exports = {
    getOrCreateChat,
    getMessages,
    getUserChats,
    saveMessage
};

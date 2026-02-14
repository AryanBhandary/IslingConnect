const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");


const authRoutes = require("./src/routes/authRoute");
const getUserRoutes = require("./src/routes/getUserRoutes");
const userRoutes = require("./src/routes/userRoutes")
const adminActionsRoutes = require("./src/routes/adminActionsRoutes")
const lostFoundRoutes = require("./src/routes/lostFoundRoute");
const chatRoutes = require("./src/routes/chatRoute");


const dbConnect = require("./src/config/dbConnect");
dbConnect();

const app = express();

//Middleware
app.use(express.json());

app.use(cors({
  origin: "*"
}));


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/admin", getUserRoutes);
app.use("/api/admin/users", adminActionsRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/chat", chatRoutes);



//Starting the server
const PORT = process.env.PORT || 5001;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log(`[Config] Attempting to start server on port: ${PORT}`);
console.log(`[Config] Ngrok status: Expected on ${PORT}`);

const { saveMessage } = require("./src/controllers/chatController");

// Socket.io Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    // data: { room, sender, content }
    const { room, sender, content } = data;

    // Save to DB
    const savedMsg = await saveMessage(room, sender, content);

    // Broadcast back to room with timestamp
    io.to(room).emit("receive_message", {
      ...data,
      _id: savedMsg._id,
      createdAt: savedMsg.createdAt
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});


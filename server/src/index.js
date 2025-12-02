import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import jwt from "jsonwebtoken";
import { Message } from "./models/Message.js";
import { User } from "./models/User.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// presence map: userId -> count of sockets
const onlineUsers = new Map();

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("socket auth error", err.message);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  if (!userId) return;

  const prev = onlineUsers.get(userId) || 0;
  onlineUsers.set(userId, prev + 1);

  io.emit("presence-update", Array.from(onlineUsers.keys()));

  console.log("Socket connected", userId, "total sockets:", onlineUsers.get(userId));

  socket.on("join-channel", (channelId) => {
    socket.join(channelId);
  });

  socket.on("leave-channel", (channelId) => {
    socket.leave(channelId);
  });

  socket.on("send-message", async ({ channelId, text }) => {
    try {
      if (!text || !channelId) return;

      const msg = await Message.create({
        channelId,
        senderId: userId,
        text
      });

      const populated = await msg.populate("senderId", "name");

      io.to(channelId).emit("new-message", {
        _id: populated._id,
        text: populated.text,
        channelId,
        createdAt: populated.createdAt,
        sender: {
          _id: populated.senderId._id,
          name: populated.senderId.name
        }
      });
    } catch (err) {
      console.error("send-message error", err.message);
    }
  });

  socket.on("disconnect", () => {
    const prevCount = onlineUsers.get(userId) || 0;
    if (prevCount <= 1) {
      onlineUsers.delete(userId);
    } else {
      onlineUsers.set(userId, prevCount - 1);
    }

    io.emit("presence-update", Array.from(onlineUsers.keys()));
    console.log("Socket disconnected", userId);
  });
});

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

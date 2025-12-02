import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import channelRoutes from "./routes/channels.js";
import messageRoutes from "./routes/messages.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api", messageRoutes); // /api/channels/:channelId/messages

export default app;

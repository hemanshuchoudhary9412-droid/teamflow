import express from "express";
import { Message } from "../models/Message.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

// Paginated messages for a channel
router.get("/channels/:channelId/messages", async (req, res) => {
  try {
    const { channelId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 20;
    const before = req.query.before;

    const query = { channelId };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "name");

    const hasMore = messages.length === limit;
    const reversed = messages.reverse();

    res.json({
      messages: reversed.map((m) => ({
        _id: m._id,
        text: m.text,
        channelId: m.channelId,
        createdAt: m.createdAt,
        sender: {
          _id: m.senderId._id,
          name: m.senderId.name
        }
      })),
      hasMore,
      nextCursor: reversed[0]?.createdAt || null
    });
  } catch (err) {
    console.error("get messages error", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

import express from "express";
import { Channel } from "../models/Channel.js";
import { ChannelMember } from "../models/ChannelMember.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

// Get all channels with member count
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: 1 });

    const channelIds = channels.map((c) => c._id);
    const counts = await ChannelMember.aggregate([
      { $match: { channelId: { $in: channelIds } } },
      { $group: { _id: "$channelId", count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach((c) => (countMap[c._id.toString()] = c.count));

    const data = channels.map((c) => ({
      _id: c._id,
      name: c.name,
      createdBy: c.createdBy,
      memberCount: countMap[c._id.toString()] || 0
    }));

    res.json({ channels: data });
  } catch (err) {
    console.error("get channels error", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create channel
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const existing = await Channel.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Channel name already exists" });

    const channel = await Channel.create({
      name,
      createdBy: req.user._id
    });

    // auto-join creator
    await ChannelMember.create({
      channelId: channel._id,
      userId: req.user._id
    });

    res.status(201).json({ channel });
  } catch (err) {
    console.error("create channel error", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Join channel
router.post("/:id/join", async (req, res) => {
  try {
    const { id } = req.params;

    await ChannelMember.updateOne(
      { channelId: id, userId: req.user._id },
      { $setOnInsert: { channelId: id, userId: req.user._id } },
      { upsert: true }
    );

    res.json({ message: "Joined channel" });
  } catch (err) {
    console.error("join channel error", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Leave channel
router.post("/:id/leave", async (req, res) => {
  try {
    const { id } = req.params;
    await ChannelMember.deleteOne({ channelId: id, userId: req.user._id });
    res.json({ message: "Left channel" });
  } catch (err) {
    console.error("leave channel error", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

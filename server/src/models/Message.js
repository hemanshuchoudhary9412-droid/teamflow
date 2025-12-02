import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

messageSchema.index({ channelId: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);

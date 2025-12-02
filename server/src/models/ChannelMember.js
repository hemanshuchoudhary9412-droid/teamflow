import mongoose from "mongoose";

const channelMemberSchema = new mongoose.Schema(
  {
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

channelMemberSchema.index({ channelId: 1, userId: 1 }, { unique: true });

export const ChannelMember = mongoose.model("ChannelMember", channelMemberSchema);

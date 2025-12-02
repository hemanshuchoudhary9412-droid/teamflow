import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Channel = mongoose.model("Channel", channelSchema);

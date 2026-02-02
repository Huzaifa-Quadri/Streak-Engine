const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Room name is required"],
    trim: true,
    maxlength: [30, "Room name cannot exceed 30 characters"],
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Auto-delete room after 24 hours
  },
});

module.exports = mongoose.model("Room", RoomSchema);

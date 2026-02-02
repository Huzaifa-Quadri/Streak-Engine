const express = require("express");
const crypto = require("crypto");
const Room = require("../models/Room");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

// All routes require authentication
router.use(protect);

// Helper to generate 6-char random code
const generateRoomCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// @route   POST /api/competition/create
// @desc    Create a new competition room
// @access  Private
router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Room name is required" });
    }

    // Check if user is already in a room
    const user = await User.findById(userId);
    if (user.activeRoom) {
      return res.status(400).json({
        success: false,
        message:
          "You are already in a room. Leave it first to create a new one.",
      });
    }

    // Generate unique code
    let code = generateRoomCode();
    let existingRoom = await Room.findOne({ code });
    while (existingRoom) {
      code = generateRoomCode();
      existingRoom = await Room.findOne({ code });
    }

    // Create Room
    const room = await Room.create({
      name,
      code,
      host: userId,
      members: [userId],
    });

    // Update User
    user.activeRoom = room._id;
    await user.save();

    res.status(201).json({ success: true, room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/competition/join
// @desc    Join an existing room
// @access  Private
router.post("/join", async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Room code is required" });
    }

    // Check if user is already in a room
    const user = await User.findById(userId);
    if (user.activeRoom) {
      return res.status(400).json({
        success: false,
        message: "You are already in a room. Leave it first to join another.",
      });
    }

    // Find Room
    const room = await Room.findOne({ code: code.toUpperCase() });
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Add user to members
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    // Update User
    user.activeRoom = room._id;
    await user.save();

    res.json({ success: true, room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   GET /api/competition/current
// @desc    Get current room details with leaderboard
// @access  Private
router.get("/current", async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.activeRoom) {
      return res.json({ success: true, inRoom: false });
    }

    const room = await Room.findById(user.activeRoom).populate(
      "members",
      "username currentStreakStart avatar",
    );

    if (!room) {
      // Room might have been deleted (e.g. host left), clean up user state
      user.activeRoom = null;
      await user.save();
      return res.json({ success: true, inRoom: false });
    }

    // Calculate streaks for leaderboard
    const now = new Date();
    const leaderboard = room.members.map((member) => {
      let durationHours = 0;
      if (member.currentStreakStart) {
        const diff = now - new Date(member.currentStreakStart);
        durationHours = Math.floor(diff / (1000 * 60 * 60));
      }
      return {
        _id: member._id,
        username: member.username,
        avatar: member.avatar, // In case we add avatars later
        durationHours,
        isHost: room.host.equals(member._id),
        isMe: member._id.equals(userId),
      };
    });

    // Sort by duration descending
    leaderboard.sort((a, b) => b.durationHours - a.durationHours);

    res.json({
      success: true,
      inRoom: true,
      room: {
        _id: room._id,
        name: room.name,
        code: room.code,
        host: room.host,
        createdAt: room.createdAt,
      },
      leaderboard,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/competition/leave
// @desc    Leave current room (or delete if host)
// @access  Private
router.post("/leave", async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.activeRoom) {
      return res.status(400).json({ success: false, message: "Not in a room" });
    }

    const room = await Room.findById(user.activeRoom);

    // Cleanup user reference first
    user.activeRoom = null;
    await user.save();

    if (!room) {
      return res.json({
        success: true,
        message: "Room left (was already gone)",
      });
    }

    // Logic: If Host -> Delete Room. If Member -> Just leave.
    if (room.host.equals(userId)) {
      // Host handles: Delete room and cleanup all members
      await Room.findByIdAndDelete(room._id);

      // Remove activeRoom ref from all members
      await User.updateMany(
        { activeRoom: room._id },
        { $set: { activeRoom: null } },
      );

      return res.json({ success: true, message: "Room deleted by host" });
    } else {
      // Member handles: Remove from members array
      room.members = room.members.filter((id) => !id.equals(userId));
      await room.save();

      return res.json({ success: true, message: "Left room successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;

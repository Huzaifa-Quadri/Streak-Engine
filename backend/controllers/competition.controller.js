const crypto = require("crypto");
const Room = require("../models/Room");
const User = require("../models/User");

const generateRoomCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ success: false, message: "Room name is required" });
    }

    const user = await User.findById(userId);
    if (user.activeRoom) {
      return res.status(400).json({
        success: false,
        message: "You are already in a room. Leave it first to create a new one.",
      });
    }

    let code = generateRoomCode();
    let existingRoom = await Room.findOne({ code });
    while (existingRoom) {
      code = generateRoomCode();
      existingRoom = await Room.findOne({ code });
    }

    const room = await Room.create({
      name,
      code,
      host: userId,
      members: [userId],
    });

    user.activeRoom = room._id;
    user.arenasHosted += 1;
    await user.save();

    res.status(201).json({ success: true, room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({ success: false, message: "Room code is required" });
    }

    const user = await User.findById(userId);
    if (user.activeRoom) {
      return res.status(400).json({
        success: false,
        message: "You are already in a room. Leave it first to join another.",
      });
    }

    const room = await Room.findOne({ code: code.toUpperCase() });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    user.activeRoom = room._id;
    user.arenasJoined += 1;
    await user.save();

    res.json({ success: true, room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getCurrentRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.activeRoom) {
      return res.json({ success: true, inRoom: false });
    }

    const room = await Room.findById(user.activeRoom).populate(
      "members",
      "username currentStreakStart headstartHours avatar"
    );

    if (!room) {
      user.activeRoom = null;
      await user.save();
      return res.json({ success: true, inRoom: false });
    }

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
        avatar: member.avatar,
        durationHours,
        headstartHours: member.headstartHours || 0,
        isHost: room.host.equals(member._id),
        isMe: member._id.equals(userId),
      };
    });

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
};

const leaveRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.activeRoom) {
      return res.status(400).json({ success: false, message: "Not in a room" });
    }

    const room = await Room.findById(user.activeRoom);

    user.activeRoom = null;
    await user.save();

    if (!room) {
      return res.json({ success: true, message: "Room left (was already gone)" });
    }

    if (room.host.equals(userId)) {
      await Room.findByIdAndDelete(room._id);
      await User.updateMany(
        { activeRoom: room._id },
        { $set: { activeRoom: null } }
      );
      return res.json({ success: true, message: "Room deleted by host" });
    } else {
      room.members = room.members.filter((id) => !id.equals(userId));
      await room.save();
      return res.json({ success: true, message: "Left room successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createRoom, joinRoom, getCurrentRoom, leaveRoom };

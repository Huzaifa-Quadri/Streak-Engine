const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Cookie options (production-ready)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    // Generate token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        username: user.username,
        currentStreakStart: user.currentStreakStart,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        username: user.username,
        currentStreakStart: user.currentStreakStart,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
// @access  Public
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
});

// @route   GET /api/user/me
// @desc    Get current user data
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        currentStreakStart: user.currentStreakStart,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile (username, password)
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { username, password, currentPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (username) {
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      // Require password verification for username change
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Password is required to change username",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      // Check if username is already taken by someone else
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = username.toLowerCase();
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        currentStreakStart: user.currentStreakStart,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete("/account", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // If user is hosting a room, clean that up too (optional enhancement based on logic, but currently let's just delete the user)
    if (user.activeRoom) {
      const Room = require("../models/Room");
      const room = await Room.findById(user.activeRoom);
      // Simple cleanup: just remove from members list. If it was the host, room stays without host or gets deleted via leave logic.
      if (room) {
        room.members = room.members.filter((id) => !id.equals(user._id));
        await room.save();
      }
    }

    await User.findByIdAndDelete(req.user._id);
    // Clear the auth cookie with proper cross-origin settings
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/streak/start
// @desc    Start a new streak
// @access  Private
router.post("/start", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // If already has an active streak, don't start a new one
    if (user.currentStreakStart) {
      return res.status(400).json({
        success: false,
        message: "You already have an active streak",
      });
    }

    // Set the streak start time
    user.currentStreakStart = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Streak started! Stay strong 💪",
      currentStreakStart: user.currentStreakStart,
    });
  } catch (error) {
    console.error("Start streak error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/streak/reset
// @desc    Reset current streak (relapse) and save to history
// @access  Private
router.post("/reset", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if there's an active streak to reset
    if (!user.currentStreakStart) {
      return res.status(400).json({
        success: false,
        message: "No active streak to reset",
      });
    }

    const now = new Date();
    const startDate = new Date(user.currentStreakStart);

    // Calculate duration in hours
    const durationMs = now - startDate;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));

    // Add to streak history
    user.streakHistory.push({
      startDate: startDate,
      endDate: now,
      durationHours: durationHours,
    });

    // Reset current streak
    user.currentStreakStart = null;
    await user.save();

    res.json({
      success: true,
      message: "Streak reset. Don't give up, start again! 🔄",
      lastStreak: {
        startDate: startDate,
        endDate: now,
        durationHours: durationHours,
      },
      streakHistory: user.streakHistory,
    });
  } catch (error) {
    console.error("Reset streak error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/streak/history
// @desc    Clear all streak history
// @access  Private
router.delete("/history", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Clear the streak history array
    user.streakHistory = [];
    await user.save();

    res.json({
      success: true,
      message: "History cleared successfully",
    });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

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
    user.headstartHours = 0;
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

// @route   POST /api/streak/start-from
// @desc    Start a streak from a specific past date/time (headstart)
// @access  Private
router.post("/start-from", protect, async (req, res) => {
  try {
    const { startDate } = req.body;
    const user = await User.findById(req.user._id);

    if (user.currentStreakStart) {
      return res.status(400).json({
        success: false,
        message: "You already have an active streak",
      });
    }

    const customStart = new Date(startDate);
    const now = new Date();

    // Validation: date must be in the past
    if (customStart >= now) {
      return res.status(400).json({
        success: false,
        message: "Start date must be in the past",
      });
    }

    // Validation: not more than 365 days in the past
    const maxPast = new Date();
    maxPast.setFullYear(maxPast.getFullYear() - 1);
    if (customStart < maxPast) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be more than 1 year in the past",
      });
    }

    // Calculate headstart hours
    const diffMs = now - customStart;
    const headstartHrs = Math.floor(diffMs / (1000 * 60 * 60));

    user.currentStreakStart = customStart;
    user.headstartHours = headstartHrs;
    await user.save();

    res.json({
      success: true,
      message: `Streak started with ${headstartHrs}h headstart! 🚀`,
      currentStreakStart: user.currentStreakStart,
      headstartHours: headstartHrs,
    });
  } catch (error) {
    console.error("Start-from streak error:", error);
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

    // Add to streak history (with headstart info if applicable)
    user.streakHistory.push({
      startDate: startDate,
      endDate: now,
      durationHours: durationHours,
      headstartHours: user.headstartHours || 0,
    });

    // Reset current streak
    user.currentStreakStart = null;
    user.headstartHours = 0;
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

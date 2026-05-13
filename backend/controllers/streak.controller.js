const User = require("../models/User");

const startStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.currentStreakStart) {
      return res.status(400).json({
        success: false,
        message: "You already have an active streak",
      });
    }

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
};

const startStreakFrom = async (req, res) => {
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

    if (customStart >= now) {
      return res.status(400).json({
        success: false,
        message: "Start date must be in the past",
      });
    }

    const maxPast = new Date();
    maxPast.setFullYear(maxPast.getFullYear() - 1);
    if (customStart < maxPast) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be more than 1 year in the past",
      });
    }

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
};

const resetStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.currentStreakStart) {
      return res.status(400).json({
        success: false,
        message: "No active streak to reset",
      });
    }

    const now = new Date();
    const startDate = new Date(user.currentStreakStart);
    const durationMs = now - startDate;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));

    user.streakHistory.push({
      startDate: startDate,
      endDate: now,
      durationHours: durationHours,
      headstartHours: user.headstartHours || 0,
    });

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
};

const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
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
};

module.exports = { startStreak, startStreakFrom, resetStreak, clearHistory };

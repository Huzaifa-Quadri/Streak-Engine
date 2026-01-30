const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/journal
// @desc    Add a new journal entry
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { mood, quote } = req.body;

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "Mood is required",
      });
    }

    const user = await User.findById(req.user._id);

    // Add journal entry
    user.journals.push({
      date: new Date(),
      mood: mood,
      quote: quote || "",
    });

    // Update last check-in time
    user.lastCheckIn = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Journal entry saved! Keep going! 📝",
      journal: user.journals[user.journals.length - 1],
    });
  } catch (error) {
    console.error("Journal error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET /api/journal
// @desc    Get all journal entries
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("journals");
    res.json({
      success: true,
      journals: user.journals,
    });
  } catch (error) {
    console.error("Get journals error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

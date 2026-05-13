const User = require("../models/User");

const addJournal = async (req, res) => {
  try {
    const { mood, quote } = req.body;

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "Mood is required",
      });
    }

    const user = await User.findById(req.user._id);

    user.journals.push({
      date: new Date(),
      mood: mood,
      quote: quote || "",
    });

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
};

const getJournals = async (req, res) => {
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
};

module.exports = { addJournal, getJournals };

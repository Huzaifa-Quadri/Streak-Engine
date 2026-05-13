const express = require("express");
const { protect } = require("../middleware/auth");
const { startStreak, startStreakFrom, resetStreak, clearHistory } = require("../controllers/streak.controller");

const router = express.Router();

router.post("/start", protect, startStreak);
router.post("/start-from", protect, startStreakFrom);
router.post("/reset", protect, resetStreak);
router.delete("/history", protect, clearHistory);

module.exports = router;

const express = require("express");
const { protect } = require("../middleware/auth");
const { createRoom, joinRoom, getCurrentRoom, leaveRoom } = require("../controllers/competition.controller");

const router = express.Router();

router.use(protect);

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/current", getCurrentRoom);
router.post("/leave", leaveRoom);

module.exports = router;

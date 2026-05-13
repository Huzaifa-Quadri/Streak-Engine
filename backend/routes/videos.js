const express = require("express");
const { getPlaylist } = require("../controllers/videos.controller");

const router = express.Router();

router.get("/playlist", getPlaylist);

module.exports = router;

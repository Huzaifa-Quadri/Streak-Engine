const express = require("express");
const { protect } = require("../middleware/auth");
const { addJournal, getJournals } = require("../controllers/journal.controller");

const router = express.Router();

router.post("/", protect, addJournal);
router.get("/", protect, getJournals);

module.exports = router;

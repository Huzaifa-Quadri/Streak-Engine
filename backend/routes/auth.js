const express = require("express");
const { protect } = require("../middleware/auth");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  deleteAccount,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.delete("/account", protect, deleteAccount);

module.exports = router;

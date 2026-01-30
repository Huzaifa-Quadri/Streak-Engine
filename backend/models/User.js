const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    // Active Streak Data
    currentStreakStart: {
      type: Date,
      default: null, // Null means no active streak
    },
    lastCheckIn: {
      type: Date,
      default: null,
    },
    // History of past streaks
    streakHistory: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }, // The moment they pressed reset
        durationHours: { type: Number, required: true }, // Calculated on backend
      },
    ],
    // Daily Journal entries
    journals: [
      {
        date: { type: Date, default: Date.now },
        mood: {
          type: String,
          enum: ["strong", "okay", "struggling"],
        },
        quote: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Cookie options (production-ready)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currentStreakStart: user.currentStreakStart,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currentStreakStart: user.currentStreakStart,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
// @access  Public
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
});

// @route   POST /api/auth/forgot-password
// @desc    Send reset password email
// @access  Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide an email" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "No user found with that email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set expire (10 mins)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify/change-password/${resetToken}`;

    const message = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #111827; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Streak Engine</h1>
          <p style="color: #0d9488; font-size: 14px; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Security Alert</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello from Streak Engine! We received a request to reset the password for the account associated with this email address. If you made this request, please click the button below to securely set a new password.
          </p>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetUrl}" clicktracking=off style="display: inline-block; background-color: #0d9488; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(13, 148, 136, 0.25); text-align: center;">
              Reset My Password
            </a>
          </div>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
            <p style="color: #b91c1c; font-size: 14px; margin: 0; line-height: 1.5;">
              <strong>Didn't request this?</strong> If you didn't ask to reset your password, you can safely ignore this email. Your password won't change until you create a new one using the link above.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">For security, this link will expire in 10 minutes.</p>
          <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
            If you're having trouble clicking the button, copy and paste the following URL into your web browser:<br>
            <a href="${resetUrl}" style="color: #0d9488; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">Stay Unbroken. &copy; ${new Date().getFullYear()} Streak Engine</p>
        </div>
      </div>
    `;

    try {
      await sendEmail(
        user.email,
        "Password Reset Request",
        "You have requested a password reset. Please copy this link: " + resetUrl,
        message
      );

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put("/reset-password/:token", async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    if (req.body.password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   GET /api/user/me
// @desc    Get current user data
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currentStreakStart: user.currentStreakStart,
        headstartHours: user.headstartHours || 0,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile (username, password)
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { username, email, password, currentPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (email) {
      const existingEmailUser = await User.findOne({
        email: email.toLowerCase(),
      });
      if (existingEmailUser && existingEmailUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Email already taken",
        });
      }
      user.email = email.toLowerCase();
    }

    if (username) {
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      // Require password verification for username change
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Password is required to change username",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      // Check if username is already taken by someone else
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
      user.username = username.toLowerCase();
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to change password",
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
         return res.status(401).json({
           success: false,
           message: "Incorrect current password",
         });
      }
      
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        currentStreakStart: user.currentStreakStart,
        lastCheckIn: user.lastCheckIn,
        streakHistory: user.streakHistory,
        journals: user.journals,
        arenasJoined: user.arenasJoined,
        arenasHosted: user.arenasHosted,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete("/account", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // If user is hosting a room, clean that up too (optional enhancement based on logic, but currently let's just delete the user)
    if (user.activeRoom) {
      const Room = require("../models/Room");
      const room = await Room.findById(user.activeRoom);
      // Simple cleanup: just remove from members list. If it was the host, room stays without host or gets deleted via leave logic.
      if (room) {
        room.members = room.members.filter((id) => !id.equals(user._id));
        await room.save();
      }
    }

    await User.findByIdAndDelete(req.user._id);
    // Clear the auth cookie with proper cross-origin settings
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

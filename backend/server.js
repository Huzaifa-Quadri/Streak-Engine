const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allow cookies
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/streak", require("./routes/streak"));
app.use("/api/journal", require("./routes/journal"));
app.use("/api/videos", require("./routes/videos"));
app.use("/api/competition", require("./routes/competition"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "🚀 No Fap API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🔥 No Fap API Server Running!
  📍 Port: ${PORT}
  🌐 Health Check: http://localhost:${PORT}/api/health
  `);
});

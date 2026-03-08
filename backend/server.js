const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(compression()); // Gzip all responses

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
      const normalizedAllowed = allowedOrigin.replace(/\/$/, "");
      const normalizedOrigin = origin ? origin.replace(/\/$/, "") : "";

      if (!origin) return callback(null, true);

      if (normalizedOrigin === normalizedAllowed) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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

  // Keep-alive: Self-ping every 15 minutes to prevent Render free-tier cold starts
  if (process.env.RENDER_EXTERNAL_URL || process.env.KEEP_ALIVE_URL) {
    const keepAliveUrl =
      process.env.KEEP_ALIVE_URL ||
      `${process.env.RENDER_EXTERNAL_URL}/api/health`;

    setInterval(
      async () => {
        try {
          const res = await fetch(keepAliveUrl);
          console.log(`🏓 Keep-alive ping: ${res.status}`);
        } catch (err) {
          console.error("Keep-alive ping failed:", err.message);
        }
      },
      15 * 60 * 1000,
    ); // Every 15 minutes

    console.log(`  🏓 Keep-alive enabled: pinging ${keepAliveUrl} every 15min`);
  }
});

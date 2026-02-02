const express = require("express");
const router = express.Router();

// @route   GET /api/videos/playlist
// @desc    Fetch videos from YouTube playlist
// @access  Public
router.get("/playlist", async (req, res) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

    if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
      return res.status(500).json({
        success: false,
        message: "YouTube API key not configured",
      });
    }

    if (!playlistId) {
      return res.status(500).json({
        success: false,
        message: "YouTube playlist ID not configured",
      });
    }

    // Fetch playlist items from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`,
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("YouTube API Error:", error);
      return res.status(response.status).json({
        success: false,
        message: error.error?.message || "Failed to fetch playlist",
      });
    }

    const data = await response.json();

    // Extract video details
    const videos = data.items
      .filter((item) => item.snippet.resourceId.kind === "youtube#video")
      .map((item) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url,
        channelTitle: item.snippet.videoOwnerChannelTitle,
      }));

    res.json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    console.error("Playlist fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch playlist videos",
    });
  }
});

module.exports = router;

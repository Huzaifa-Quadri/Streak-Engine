import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoClose,
  IoVolumeHigh,
  IoVolumeMute,
  IoPlay,
  IoRefresh,
} from "react-icons/io5";
import api from "../api/axios";

const Emergency = () => {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Fetch videos from backend (which fetches from YouTube API)
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/videos/playlist");

      if (response.data.success) {
        // Shuffle the videos for random order
        const shuffled = [...response.data.videos].sort(
          () => Math.random() - 0.5,
        );
        setVideos(shuffled);
      } else {
        setError(response.data.message || "Failed to load videos");
      }
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load videos. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Set up Intersection Observer to detect which video is visible
  useEffect(() => {
    if (videos.length === 0) return;

    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          setActiveIndex(index);
        }
      });
    }, options);

    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  const handleClose = () => {
    navigate("/");
  };

  const setVideoRef = useCallback((el, index) => {
    videoRefs.current[index] = el;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="emergency">
        <div className="emergency__header">
          <h2>🆘 Emergency Mode</h2>
          <button className="emergency__close" onClick={handleClose}>
            <IoClose />
          </button>
        </div>
        <div className="emergency__loading">
          <div className="loading__spinner"></div>
          <p>Loading motivational videos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="emergency">
        <div className="emergency__header">
          <h2>🆘 Emergency Mode</h2>
          <button className="emergency__close" onClick={handleClose}>
            <IoClose />
          </button>
        </div>
        <div className="emergency__error">
          <p>{error}</p>
          <button className="btn btn--primary" onClick={fetchVideos}>
            <IoRefresh /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="emergency">
      <div className="emergency__header">
        <h2>🆘 Emergency Mode</h2>
        <button className="emergency__close" onClick={handleClose}>
          <IoClose />
        </button>
      </div>

      <div className="emergency__videos" ref={containerRef}>
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="emergency__video-container"
            data-index={index}
            ref={(el) => setVideoRef(el, index)}
          >
            {Math.abs(activeIndex - index) <= 1 ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=${activeIndex === index ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${video.id}&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="emergency__video-placeholder">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="emergency__thumbnail"
                  />
                ) : (
                  <IoPlay className="emergency__play-icon" />
                )}
                <span>{video.title}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="emergency__controls">
        <button
          className={`emergency__control-btn ${!muted ? "active" : ""}`}
          onClick={() => setMuted(!muted)}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <IoVolumeMute /> : <IoVolumeHigh />}
        </button>
      </div>
    </div>
  );
};

export default Emergency;

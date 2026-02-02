import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { IoClose, IoVolumeHigh, IoVolumeMute, IoPlay } from "react-icons/io5";
import { getShuffledVideos } from "../data/videos";

const Emergency = () => {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Shuffle videos on component mount
  const videos = useMemo(() => getShuffledVideos(), []);

  // Set up Intersection Observer to detect which video is visible
  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.6, // 60% visibility triggers the callback
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          setActiveIndex(index);
        }
      });
    }, options);

    // Observe all video containers
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

  // Store ref for each video container
  const setVideoRef = useCallback((el, index) => {
    videoRefs.current[index] = el;
  }, []);

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
            {/* Only render iframe for active video (±1 for preloading) */}
            {Math.abs(activeIndex - index) <= 1 ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=${activeIndex === index ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${video.id}&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // Placeholder for non-active videos
              <div className="emergency__video-placeholder">
                <IoPlay className="emergency__play-icon" />
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

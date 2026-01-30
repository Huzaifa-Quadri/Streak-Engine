import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { getShuffledVideos } from "../data/videos";

const Emergency = () => {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);

  // Shuffle videos on component mount
  const videos = useMemo(() => getShuffledVideos(), []);

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="emergency">
      <div className="emergency__header">
        <h2>🆘 Emergency Mode</h2>
        <button className="emergency__close" onClick={handleClose}>
          <IoClose />
        </button>
      </div>

      <div className="emergency__videos">
        {videos.map((video, index) => (
          <div key={video.id} className="emergency__video-container">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=${index === 0 ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${video.id}&controls=1&modestbranding=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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

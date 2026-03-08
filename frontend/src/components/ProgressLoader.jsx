import React, { useState, useEffect } from "react";
import "css-3d-progress";

const MESSAGES = [
  "Initializing modules",
  "Compiling awesomeness",
  "Booting systems",
  "Loading core engine",
  "Syncing components",
  "Feeding the hamsters",
  "Polishing the pixels",
  "Brewing fresh bytes",
  "Crunching some numbers",
  "Igniting the engine",
  "Powering the core",
  "Assembling components",
  "Finalizing setup",
];

const ProgressLoader = () => {
  const [percent, setPercent] = useState(0);
  const [msgIndex, setMsgIndex] = useState(() =>
    Math.floor(Math.random() * MESSAGES.length),
  );
  const [fading, setFading] = useState(false);

  // Progress simulation
  useEffect(() => {
    const timers = [
      setTimeout(() => setPercent(15), 300),
      setTimeout(() => setPercent(30), 700),
      setTimeout(() => setPercent(40), 1200),
      setTimeout(() => setPercent(50), 2000),
      setTimeout(() => setPercent(60), 3000),
      setTimeout(() => setPercent(70), 4000),
      setTimeout(() => setPercent(75), 5500),
      setTimeout(() => setPercent(80), 7000),
      setTimeout(() => setPercent(85), 9000),
      setTimeout(() => setPercent(88), 11000),
      setTimeout(() => setPercent(90), 13000),
      setTimeout(() => setPercent(92), 16000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Rotating micro-messages every 2.5s with fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setMsgIndex((prev) => {
          let next;
          do {
            next = Math.floor(Math.random() * MESSAGES.length);
          } while (next === prev);
          return next;
        });
        setFading(false);
      }, 300); // fade-out duration before switching
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="progress-loader">
      <div className="progress-loader__content">
        <h2 className="progress-loader__title">Streak&nbsp;Engine</h2>
        <p
          className={`progress-loader__subtitle ${fading ? "progress-loader__subtitle--fading" : ""}`}
        >
          {MESSAGES[msgIndex]}...
        </p>
        <div className="progress-loader__bar">
          <css-3d-progress percent={percent}></css-3d-progress>
        </div>
        <span className="progress-loader__percent">{percent}%</span>
      </div>
    </div>
  );
};

export default ProgressLoader;

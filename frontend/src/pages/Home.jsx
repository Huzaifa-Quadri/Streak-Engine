import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import StreakBadge from "../components/StreakBadge";
import { IoPlayCircle, IoRefreshCircle } from "react-icons/io5";

const Home = () => {
  const { user, startStreak, resetStreak } = useAuth();
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Calculate elapsed time from streak start
  useEffect(() => {
    if (!user?.currentStreakStart) {
      setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTotalHours(0);
      return;
    }

    const calculateElapsed = () => {
      const start = new Date(user.currentStreakStart);
      const now = new Date();
      const diff = now - start;

      if (diff < 0) {
        setElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTotalHours(0);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const totalMins = Math.floor(totalSeconds / 60);
      const totalHrs = Math.floor(totalMins / 60);
      const days = Math.floor(totalHrs / 24);

      setTotalHours(totalHrs);
      setElapsed({
        days: days,
        hours: totalHrs % 24,
        minutes: totalMins % 60,
        seconds: totalSeconds % 60,
      });
    };

    // Calculate immediately
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [user?.currentStreakStart]);

  const hasActiveStreak = useMemo(() => {
    return (
      user?.currentStreakStart !== null &&
      user?.currentStreakStart !== undefined
    );
  }, [user?.currentStreakStart]);

  const formatNumber = (num) => String(num).padStart(2, "0");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartStreak = async () => {
    setLoading(true);
    const result = await startStreak();
    setLoading(false);

    if (result.success) {
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
  };

  const handleResetStreak = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset your streak? This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await resetStreak();
    setLoading(false);

    if (result.success) {
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
  };

  return (
    <div className="page home">
      <StreakBadge hours={totalHours} />

      <div className="home__counter">
        <span className="home__counter-label">Current Streak</span>
        <div className="home__counter-time">
          {formatNumber(elapsed.days)}:{formatNumber(elapsed.hours)}:
          {formatNumber(elapsed.minutes)}:{formatNumber(elapsed.seconds)}
        </div>
        <span
          className="home__counter-label"
          style={{ fontSize: "0.75rem", opacity: 0.7 }}
        >
          DD : HH : MM : SS
        </span>
      </div>

      <div className="home__actions">
        {!hasActiveStreak ? (
          <button
            className="btn btn--success btn--large animate-pulse"
            onClick={handleStartStreak}
            disabled={loading}
          >
            <IoPlayCircle size={24} />
            {loading ? "Starting..." : "Start Journey"}
          </button>
        ) : (
          <button
            className="btn btn--danger btn--large"
            onClick={handleResetStreak}
            disabled={loading}
          >
            <IoRefreshCircle size={24} />
            {loading ? "Resetting..." : "I Relapsed"}
          </button>
        )}
      </div>

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default Home;

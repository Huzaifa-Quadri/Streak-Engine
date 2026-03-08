import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import StreakBadge from "../components/StreakBadge";
import RelapseModal from "../components/RelapseModal";
import { IoPlayCircle, IoRefreshCircle } from "react-icons/io5";

const Home = () => {
  const { user, startStreak, startStreakFrom, resetStreak } = useAuth();
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showRelapseModal, setShowRelapseModal] = useState(false);

  // Headstart picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerStep, setPickerStep] = useState("date"); // 'date' | 'hour'
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState(12);

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

    calculateElapsed();
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
    setLoading(true);
    const result = await resetStreak();
    setLoading(false);
    setShowRelapseModal(false);

    if (result.success) {
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
  };

  // Headstart picker functions
  const openDatePicker = () => {
    // Default to today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
    setSelectedHour(12);
    setPickerStep("date");
    setShowDatePicker(true);
  };

  const handleDateNext = () => {
    if (!selectedDate) return;
    setPickerStep("hour");
  };

  const handleHeadstartConfirm = async () => {
    setShowDatePicker(false);
    setLoading(true);

    // Build the ISO date from selected date + hour
    const startDate = new Date(
      `${selectedDate}T${String(selectedHour).padStart(2, "0")}:00:00`,
    );

    // Immediately calculate elapsed so badge/timer updates instantly
    const diff = Date.now() - startDate.getTime();
    if (diff > 0) {
      const totalSeconds = Math.floor(diff / 1000);
      const totalMins = Math.floor(totalSeconds / 60);
      const totalHrs = Math.floor(totalMins / 60);
      const days = Math.floor(totalHrs / 24);
      setTotalHours(totalHrs);
      setElapsed({
        days,
        hours: totalHrs % 24,
        minutes: totalMins % 60,
        seconds: totalSeconds % 60,
      });
    }

    const result = await startStreakFrom(startDate.toISOString());
    setLoading(false);

    if (result?.success) {
      showToast(result.message, "success");
    } else {
      showToast(result?.message || "Failed to start streak", "error");
    }
  };

  // Calculate max date (today) and min date (1 year ago)
  const getMaxDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getMinDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatUsername = (name) => {
    if (!name) return "Warrior";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="page home">
      <div className="home__welcome">
        <span className="home__welcome-label">Welcome</span>
        <h1 className="home__welcome-username">
          {formatUsername(user?.username || user?.name)}
        </h1>
      </div>

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
          <div className="home__actions-row">
            <button
              className="btn btn--success btn--large animate-pulse home__btn-start"
              onClick={handleStartStreak}
              disabled={loading}
            >
              <IoPlayCircle size={24} />
              {loading ? "Starting..." : "Start Journey"}
            </button>
            <button
              className="home__btn-calendar"
              onClick={(e) => {
                openDatePicker();
              }}
              disabled={loading}
              title="Start from a specific date"
            >
              <img
                src="/assets/schedule.png"
                alt="Pick date"
                className="home__btn-calendar-img"
              />
            </button>
          </div>
        ) : (
          <button
            className="btn btn--danger btn--large"
            onClick={() => setShowRelapseModal(true)}
            disabled={loading}
          >
            <IoRefreshCircle size={24} />
            {loading ? "Resetting..." : "I Relapsed"}
          </button>
        )}
      </div>

      <RelapseModal
        isOpen={showRelapseModal}
        onConfirm={handleResetStreak}
        onCancel={() => setShowRelapseModal(false)}
        loading={loading}
      />

      {/* Headstart Date/Time Picker Modal */}
      {showDatePicker && (
        <div
          className="headstart-modal-overlay"
          onClick={() => setShowDatePicker(false)}
        >
          <div className="headstart-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="headstart-modal__title">
              {pickerStep === "date"
                ? "📅 Choose Start Date"
                : "🕐 Choose Start Hour"}
            </h3>

            {pickerStep === "date" && (
              <div className="headstart-modal__body">
                <p className="headstart-modal__desc">
                  Pick the date your streak actually began.
                </p>
                <input
                  type="date"
                  className="headstart-modal__date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={getMaxDate()}
                  min={getMinDate()}
                />
                <div className="headstart-modal__actions">
                  <button
                    className="btn btn--ghost"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={handleDateNext}
                    disabled={!selectedDate}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {pickerStep === "hour" && (
              <div className="headstart-modal__body">
                <p className="headstart-modal__desc">
                  Select the approximate hour you started.
                </p>
                <div className="headstart-modal__hour-grid">
                  {Array.from({ length: 24 }, (_, i) => (
                    <button
                      key={i}
                      className={`headstart-modal__hour-btn ${selectedHour === i ? "headstart-modal__hour-btn--active" : ""}`}
                      onClick={() => setSelectedHour(i)}
                    >
                      {String(i).padStart(2, "0")}:00
                    </button>
                  ))}
                </div>
                <div className="headstart-modal__actions">
                  <button
                    className="btn btn--ghost"
                    onClick={() => setPickerStep("date")}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={handleHeadstartConfirm}
                  >
                    Start Streak 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default Home;

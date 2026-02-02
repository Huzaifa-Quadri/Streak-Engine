import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getBadgeInfo } from "../components/StreakBadge";
import {
  IoTimeOutline,
  IoTrophyOutline,
  IoTrashOutline,
  IoClose,
} from "react-icons/io5";

// Supported image extensions to try
const EXTENSIONS = ["png", "jpg", "jpeg", "svg", "webp"];

// History Badge component - shows badge image with fallback
const HistoryBadge = ({ hours }) => {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const badge = getBadgeInfo(hours);

  const handleError = () => {
    if (extensionIndex < EXTENSIONS.length - 1) {
      setExtensionIndex(extensionIndex + 1);
    } else {
      setShowFallback(true);
    }
  };

  if (showFallback) {
    return <div className="history__card-badge-fallback">🏆</div>;
  }

  return (
    <img
      src={`/badges/${badge.image}.${EXTENSIONS[extensionIndex]}`}
      alt={badge.label}
      onError={handleError}
      className="history__card-badge-image"
    />
  );
};

const History = () => {
  const { user, clearHistory } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const streakHistory = user?.streakHistory || [];

  // Format duration from hours to readable string
  const formatDuration = (hours) => {
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
    return `${days}d ${remainingHours}h`;
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearHistory = async () => {
    setLoading(true);
    const result = await clearHistory();
    setLoading(false);
    setShowModal(false);

    if (result?.success) {
      showToast("History cleared successfully", "success");
    } else {
      showToast(result?.message || "Failed to clear history", "error");
    }
  };

  // Sort history by date (most recent first)
  const sortedHistory = [...streakHistory].sort(
    (a, b) => new Date(b.endDate) - new Date(a.endDate),
  );

  return (
    <div className="page history">
      <div className="page__header">
        <div className="page__header-row">
          <div>
            <h1>
              Streak <span>History</span>
            </h1>
            <p>Your journey of self-improvement</p>
          </div>
          {sortedHistory.length > 0 && (
            <button
              className="history__clear-btn"
              onClick={() => setShowModal(true)}
              title="Clear All History"
            >
              <IoTrashOutline />
            </button>
          )}
        </div>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="history__empty">
          <IoTrophyOutline className="history__empty-icon" />
          <p>No history yet.</p>
          <p>Start your first streak and begin your journey!</p>
        </div>
      ) : (
        <div className="history__list">
          {sortedHistory.map((streak, index) => (
            <div
              key={index}
              className="history__card"
              style={{ "--index": index }}
            >
              <div className="history__card-info">
                <div className="history__card-label">
                  {getBadgeInfo(streak.durationHours).label}
                </div>
                <div className="history__card-duration">
                  {formatDuration(streak.durationHours)}
                </div>
                <div className="history__card-date">
                  <IoTimeOutline style={{ marginRight: "4px" }} />
                  {formatDate(streak.startDate)} - {formatDate(streak.endDate)}
                </div>
              </div>
              <div className="history__card-badge">
                <HistoryBadge hours={streak.durationHours} />
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedHistory.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          Total attempts: {sortedHistory.length}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal__close"
              onClick={() => setShowModal(false)}
            >
              <IoClose />
            </button>
            <div className="modal__icon">⚠️</div>
            <h3 className="modal__title">Clear All History?</h3>
            <p className="modal__message">
              This will permanently delete all your streak history. This action
              cannot be undone.
            </p>
            <div className="modal__actions">
              <button
                className="btn btn--ghost"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={handleClearHistory}
                disabled={loading}
              >
                {loading ? "Clearing..." : "Yes, Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default History;

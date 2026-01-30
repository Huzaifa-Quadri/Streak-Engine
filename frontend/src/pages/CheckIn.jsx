import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRandomQuote } from "../data/quotes";
import {
  IoRefresh,
  IoCheckmarkCircle,
  IoFlame,
  IoRemove,
  IoWarning,
} from "react-icons/io5";

const CheckIn = () => {
  const { addJournal } = useAuth();
  const [quote, setQuote] = useState(getRandomQuote());
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const moods = [
    { id: "strong", label: "Strong", icon: IoFlame, color: "#00ff88" },
    { id: "okay", label: "Okay", icon: IoRemove, color: "#00f0ff" },
    {
      id: "struggling",
      label: "Struggling",
      icon: IoWarning,
      color: "#ff3355",
    },
  ];

  const refreshQuote = () => {
    setQuote(getRandomQuote());
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      showToast("Please select how you feel", "error");
      return;
    }

    setLoading(true);
    const result = await addJournal(selectedMood, quote.text);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      showToast(result.message, "error");
    }
  };

  if (submitted) {
    return (
      <div className="page checkin">
        <div className="checkin__success">
          <IoCheckmarkCircle className="checkin__success-icon" />
          <h3>Check-in Complete!</h3>
          <p>Great job taking a moment to reflect. Keep going strong!</p>
          <button
            className="btn btn--primary"
            onClick={() => {
              setSubmitted(false);
              setSelectedMood(null);
              setQuote(getRandomQuote());
            }}
          >
            New Check-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkin">
      <div className="page__header">
        <h1>
          Daily <span>Check-In</span>
        </h1>
        <p>Take a moment to reflect on your journey</p>
      </div>

      <div className="checkin__quote">
        <p className="checkin__quote-text">"{quote.text}"</p>
        <p className="checkin__quote-author">— {quote.author}</p>
        <button className="checkin__quote-refresh" onClick={refreshQuote}>
          <IoRefresh style={{ marginRight: "4px" }} />
          New Quote
        </button>
      </div>

      <div className="checkin__mood">
        <p className="checkin__mood-label">How do you feel today?</p>
        <div className="checkin__mood-options">
          {moods.map((mood) => (
            <div
              key={mood.id}
              className={`checkin__mood-option ${selectedMood === mood.id ? "selected" : ""}`}
              onClick={() => setSelectedMood(mood.id)}
              style={{ "--mood-color": mood.color }}
            >
              <mood.icon
                className="checkin__mood-icon"
                style={{ color: mood.color }}
              />
              <span className="checkin__mood-text">{mood.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn--primary btn--large checkin__submit"
        onClick={handleSubmit}
        disabled={loading || !selectedMood}
      >
        {loading ? "Saving..." : "Submit Check-In"}
      </button>

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default CheckIn;

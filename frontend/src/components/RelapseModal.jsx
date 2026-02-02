import React, { useEffect } from "react";
import { IoWarning, IoClose } from "react-icons/io5";

const RelapseModal = ({ isOpen, onConfirm, onCancel, loading }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="relapse-modal-overlay" onClick={onCancel}>
      <div
        className="relapse-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="relapse-modal__close"
          onClick={onCancel}
          aria-label="Close modal"
        >
          <IoClose />
        </button>

        <div className="relapse-modal__icon">
          <IoWarning />
        </div>

        <h2 id="modal-title" className="relapse-modal__title">
          Reset Your Streak?
        </h2>

        <p className="relapse-modal__message">
          This will reset your current progress to zero. Your streak will be
          saved to history, and you can start fresh.
        </p>

        <div className="relapse-modal__actions">
          <button
            className="relapse-modal__btn relapse-modal__btn--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Keep Going 💪
          </button>
          <button
            className="relapse-modal__btn relapse-modal__btn--confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Back to Zero"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelapseModal;

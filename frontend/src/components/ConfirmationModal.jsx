import React, { useEffect, useState } from "react";
import { IoWarning, IoClose } from "react-icons/io5";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // 'danger' or 'warning'
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActive(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setActive(false), 300); // Wait for animation
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!active && !isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className={`modal-content ${isOpen ? "open" : ""}`}>
        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>

        <div className={`modal-icon ${variant}`}>
          <IoWarning />
        </div>

        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="btn btn--ghost" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`btn btn--${variant}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

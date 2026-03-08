import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  IoArrowBack,
  IoPersonOutline,
  IoLockClosedOutline,
  IoMailOutline,
  IoChevronDown,
  IoTrashOutline,
} from "react-icons/io5";
import ConfirmationModal from "../components/ConfirmationModal";
import api from "../api/axios";

const FEEDBACK_EMAIL = "huzaifaquadri1853@gmail.com";

const EditProfile = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  // Accordion state — which tile is open (null = none)
  const [openTile, setOpenTile] = useState(null);

  // Username state
  const [username, setUsername] = useState(user?.username || "");
  const [usernamePassword, setUsernamePassword] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // General
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Delete account state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toggleTile = (tile) => {
    setOpenTile(openTile === tile ? null : tile);
    setError(null);
    setSuccess(null);
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!usernamePassword) {
      setError("Please enter your password to confirm.");
      return;
    }

    try {
      setUsernameLoading(true);
      const res = await api.put("/auth/profile", {
        username,
        currentPassword: usernamePassword,
      });
      if (res.data.success) {
        setSuccess("Username updated successfully!");
        setUsernamePassword("");
        await refreshUser();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update username.");
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await api.put("/auth/profile", { password });
      if (res.data.success) {
        setSuccess("Password changed successfully!");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleFeedback = () => {
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=Streak Engine Feedback&body=Hi, I'd like to share some feedback...`;
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete") {
      setError("Please type 'delete' to confirm account deletion.");
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      setDeleteLoading(true);
      await api.delete("/auth/account");
      logout();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account.");
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="page edit-profile">
      <div className="page__header-row">
        <button
          className="btn--icon"
          onClick={() => navigate("/profile")}
          title="Back to Profile"
        >
          <IoArrowBack />
        </button>
        <div className="page__header" style={{ flex: 1 }}>
          <h1>
            Edit <span>Profile</span>
          </h1>
        </div>
      </div>

      <div className="edit-profile__container">
        {error && (
          <div
            className="toast toast--error"
            style={{
              position: "relative",
              bottom: "auto",
              left: "auto",
              transform: "none",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="toast toast--success"
            style={{
              position: "relative",
              bottom: "auto",
              left: "auto",
              transform: "none",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {success}
          </div>
        )}

        {/* Tile 1: Change Username */}
        <div
          className={`edit-profile__tile ${openTile === "username" ? "edit-profile__tile--open" : ""}`}
        >
          <div
            className="edit-profile__tile-header"
            onClick={() => toggleTile("username")}
          >
            <div className="edit-profile__tile-icon">
              <IoPersonOutline />
            </div>
            <span className="edit-profile__tile-title">Change Username</span>
            <IoChevronDown className="edit-profile__tile-arrow" />
          </div>

          {openTile === "username" && (
            <form
              className="edit-profile__tile-body"
              onSubmit={handleUpdateUsername}
            >
              <div className="input-group">
                <label htmlFor="ep-username">New Username</label>
                <input
                  type="text"
                  id="ep-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="ep-username-pwd">Confirm Password</label>
                <input
                  type="password"
                  id="ep-username-pwd"
                  value={usernamePassword}
                  onChange={(e) => setUsernamePassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={usernameLoading}
              >
                {usernameLoading ? "Saving..." : "Save"}
              </button>
            </form>
          )}
        </div>

        {/* Tile 2: Change Password */}
        <div
          className={`edit-profile__tile ${openTile === "password" ? "edit-profile__tile--open" : ""}`}
        >
          <div
            className="edit-profile__tile-header"
            onClick={() => toggleTile("password")}
          >
            <div className="edit-profile__tile-icon">
              <IoLockClosedOutline />
            </div>
            <span className="edit-profile__tile-title">Change Password</span>
            <IoChevronDown className="edit-profile__tile-arrow" />
          </div>

          {openTile === "password" && (
            <form
              className="edit-profile__tile-body"
              onSubmit={handleUpdatePassword}
            >
              <div className="input-group">
                <label htmlFor="ep-password">New Password</label>
                <input
                  type="password"
                  id="ep-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="ep-confirm">Confirm Password</label>
                <input
                  type="password"
                  id="ep-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type password again"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>

        {/* Tile 3: Give Us Feedback */}
        <div
          className={`edit-profile__tile ${openTile === "feedback" ? "edit-profile__tile--open" : ""}`}
        >
          <div
            className="edit-profile__tile-header"
            onClick={() => toggleTile("feedback")}
          >
            <div className="edit-profile__tile-icon edit-profile__tile-icon--feedback">
              <IoMailOutline />
            </div>
            <span className="edit-profile__tile-title">Give Us Feedback</span>
            <IoChevronDown className="edit-profile__tile-arrow" />
          </div>

          {openTile === "feedback" && (
            <div className="edit-profile__tile-body">
              <p className="edit-profile__feedback-text">
                We'd love to hear your thoughts! Share feedback, suggest
                features, or report bugs — we're always looking to improve.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleFeedback}
              >
                Take Me There
              </button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="edit-profile__danger-zone">
          <button
            className="btn btn--danger"
            onClick={() => setIsDeleteModalOpen(true)}
            style={{ width: "100%" }}
          >
            <IoTrashOutline /> Delete Account
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmText("");
        }}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message={
          <>
            <p>
              This action is irreversible. All your data, history, and streaks
              will be permanently deleted.
            </p>
            <div className="input-group" style={{ marginTop: "1rem" }}>
              <label htmlFor="deleteConfirm">
                Type <strong>delete</strong> to confirm
              </label>
              <input
                type="text"
                id="deleteConfirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="delete"
                autoComplete="off"
              />
            </div>
          </>
        }
        confirmText={deleteLoading ? "Deleting..." : "Permanently Delete"}
        variant="danger"
      />
    </div>
  );
};

export default EditProfile;

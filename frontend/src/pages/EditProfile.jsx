import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import ConfirmationModal from "../components/ConfirmationModal";
import api from "../api/axios";

const EditProfile = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    try {
      setLoading(true);
      const updateData = { username };
      if (password) {
        updateData.password = password;
      }

      const res = await api.put("/auth/profile", updateData);

      if (res.data.success) {
        setSuccess("Profile updated successfully!");
        setPassword("");
        setConfirmPassword("");
        await refreshUser();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
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
      logout(); // This will clear token and redirect to login
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
        <div className="page__header" style={{ marginLeft: "1rem" }}>
          <h1>
            Edit <span>Profile</span>
          </h1>
        </div>
      </div>

      <div className="edit-profile__container">
        {error && <div className="toast toast--error">{error}</div>}
        {success && <div className="toast toast--success">{success}</div>}

        <form onSubmit={handleUpdateProfile} className="edit-profile__form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep same"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type password again"
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--large"
            disabled={loading}
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <IoSaveOutline /> Save Changes
              </>
            )}
          </button>
        </form>

        <div className="edit-profile__danger-zone">
          <button
            className="btn btn--danger"
            onClick={() => setIsDeleteModalOpen(true)}
            style={{ width: "100%", marginTop: "2rem" }}
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

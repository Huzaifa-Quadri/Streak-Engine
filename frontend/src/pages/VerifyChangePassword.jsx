import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { IoLockClosedOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import "../styles/VerifyChangePassword.scss";

const VerifyChangePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, error: authError, setError } = useAuth();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="auth">
        <div className="auth__container" style={{ textAlign: "center" }}>
          <IoCheckmarkCircleOutline size={80} color="var(--success-color, #2ed573)" style={{ marginBottom: "20px" }} />
          <h1>Password Reset <span>Successful</span></h1>
          <p style={{ marginTop: "10px", color: "var(--text-secondary)" }}>
            Your password has been changed successfully. Redirecting you to login...
          </p>
          <div style={{ marginTop: "30px" }}>
            <Link to="/login" className="btn btn--primary">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__header">
          <h1>
            Setup New <span>Password</span>
          </h1>
          <p className="reset-pw__message">
            Please enter your new password below.
          </p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__input-group">
            <label htmlFor="password">
              <IoLockClosedOutline style={{ marginRight: "6px" }} />
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="auth__input-group">
            <label htmlFor="confirmPassword">
              <IoLockClosedOutline style={{ marginRight: "6px" }} />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {authError && <div className="auth__error">{authError}</div>}

          <button
            type="submit"
            className="btn btn--primary auth__submit"
            disabled={loading}
          >
            <IoLockClosedOutline size={20} />
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyChangePassword;

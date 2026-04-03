import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { IoMailOutline, IoPaperPlaneOutline, IoArrowBack } from "react-icons/io5";
import "../styles/ForgotPassword.scss";

const ForgotPassword = () => {
  const { forgotPassword, error: authError, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("We have sent a password reset link to your email.");
      setEmail("");
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__header">
          <h1>
            Forgot <span>Password</span>
          </h1>
          <p className="forgot-pw__message">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          {successMsg && <div className="forgot-pw__success">{successMsg}</div>}
          
          <div className="auth__input-group">
            <label htmlFor="email">
              <IoMailOutline style={{ marginRight: "6px" }} />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              autoComplete="email"
            />
          </div>

          {authError && <div className="auth__error">{authError}</div>}

          <button
            type="submit"
            className="btn btn--primary auth__submit"
            disabled={loading}
          >
            <IoPaperPlaneOutline size={20} />
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth__footer">
          Remember your password? <Link to="/login"><IoArrowBack style={{verticalAlign: "middle"}}/> Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

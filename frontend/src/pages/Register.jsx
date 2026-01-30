import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoPersonAdd,
} from "react-icons/io5";

const Register = () => {
  const navigate = useNavigate();
  const { register, error, setError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
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
    const result = await register(username, password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__header">
          <h1>
            Start Your <span>Journey</span>
          </h1>
          <p>Create an account to track your progress</p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__input-group">
            <label htmlFor="username">
              <IoPersonOutline style={{ marginRight: "6px" }} />
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>

          <div className="auth__input-group">
            <label htmlFor="password">
              <IoLockClosedOutline style={{ marginRight: "6px" }} />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
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
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="auth__error">{error}</div>}

          <button
            type="submit"
            className="btn btn--primary auth__submit"
            disabled={loading}
          >
            <IoPersonAdd size={20} />
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth__footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

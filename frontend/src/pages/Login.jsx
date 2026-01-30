import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { IoPersonOutline, IoLockClosedOutline, IoLogIn } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const { login, error, setError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await login(username, password);
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
            Welcome <span>Back</span>
          </h1>
          <p>Continue your journey to self-improvement</p>
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="auth__error">{error}</div>}

          <button
            type="submit"
            className="btn btn--primary auth__submit"
            disabled={loading}
          >
            <IoLogIn size={20} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth__footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      // Not logged in - that's okay
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/register", { username, password });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", { username, password });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  const startStreak = async () => {
    try {
      const response = await api.post("/streak/start");
      if (response.data.success) {
        await refreshUser();
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to start streak";
      return { success: false, message };
    }
  };

  const resetStreak = async () => {
    try {
      const response = await api.post("/streak/reset");
      if (response.data.success) {
        await refreshUser();
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset streak";
      return { success: false, message };
    }
  };

  const addJournal = async (mood, quote) => {
    try {
      const response = await api.post("/journal", { mood, quote });
      if (response.data.success) {
        await refreshUser();
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to save journal";
      return { success: false, message };
    }
  };

  const clearHistory = async () => {
    try {
      const response = await api.delete("/streak/history");
      if (response.data.success) {
        await refreshUser();
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to clear history";
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    refreshUser,
    startStreak,
    resetStreak,
    addJournal,
    clearHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

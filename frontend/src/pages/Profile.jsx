import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { FaCrown } from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Basic stats calculations
  const totalStreaks = user?.streakHistory?.length || 0;

  // Calculate longest streak in hours
  let longestStreakHours = 0;
  if (user?.streakHistory && user.streakHistory.length > 0) {
    longestStreakHours = Math.max(
      ...user.streakHistory.map((s) => s.durationHours || 0),
    );
  }

  // Convert hours to days/hours format
  const longestDays = Math.floor(longestStreakHours / 24);
  const longestHours = longestStreakHours % 24;

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="page profile">
      <div className="page__header-row">
        <div className="page__header">
          <h1>
            Your <span>Profile</span>
          </h1>
          <p>@{user?.username}</p>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <IoLogOutOutline />
          <span>Logout</span>
        </button>
      </div>

      <div className="profile__stats-container">
        {/* Total Streaks Box — medal.png icon */}
        <div className="profile__stat-box">
          <div className="profile__stat-icon-wrapper">
            <img
              src="/assets/medal.png"
              alt="medal"
              className="profile__medal-icon"
            />
          </div>
          <div className="profile__stat-content">
            <h3>{totalStreaks}</h3>
            <p>Total Streaks</p>
          </div>
        </div>

        {/* Longest Streak Box — crown icon */}
        <div className="profile__stat-box">
          <div className="profile__stat-icon-wrapper">
            <FaCrown
              className="profile__crown-icon"
              style={{ color: "gold" }}
            />
          </div>
          <div className="profile__stat-content">
            <h3>
              {longestDays}d {longestHours}h
            </h3>
            <p>Longest Streak</p>
          </div>
        </div>
      </div>

      <div className="profile__arena-stats">
        {/* Centered — no icon, just text */}
        <div className="profile__arena-stat">
          <div className="profile__arena-text">
            <h4>Arenas Joined</h4>
            <p>{user?.arenasJoined || 0}</p>
          </div>
        </div>
        <div className="profile__arena-stat">
          <div className="profile__arena-text">
            <h4>Arenas Hosted</h4>
            <p>{user?.arenasHosted || 0}</p>
          </div>
        </div>
      </div>

      <button
        className="btn btn--primary profile__edit-btn"
        onClick={handleEditProfile}
        style={{ width: "100%", marginTop: "2rem" }}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;

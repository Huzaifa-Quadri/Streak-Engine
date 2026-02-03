import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  IoTrophyOutline,
  IoAddCircleOutline,
  IoEnterOutline,
  IoCopyOutline,
  IoExitOutline,
  IoRefreshOutline,
  IoWarning,
} from "react-icons/io5";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { getBadgeInfo } from "../components/StreakBadge";
import CompetitionLoader from "../components/CompetitionLoader";
import ConfirmationModal from "../components/ConfirmationModal";

const Competition = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomData, setRoomData] = useState(null);

  const [lobbyView, setLobbyView] = useState("selection"); // 'selection', 'create', 'join'

  // Lobby State
  const [joinCode, setJoinCode] = useState("");
  const [createName, setCreateName] = useState("");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    variant: "danger",
  });

  // Fetch current room status
  const fetchRoomStatus = useCallback(async () => {
    try {
      const response = await api.get("/competition/current");
      if (response.data.success) {
        setIsInRoom(response.data.inRoom);
        if (response.data.inRoom) {
          setRoomData(response.data);
        } else {
          setRoomData(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch room status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for updates if in a room
  useEffect(() => {
    fetchRoomStatus();

    let interval;
    if (isInRoom) {
      interval = setInterval(fetchRoomStatus, 10000); // Poll every 10 seconds
    }
    return () => clearInterval(interval);
  }, [isInRoom, fetchRoomStatus]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!createName.trim()) return;

    setActionLoading(true);
    setError(null);
    try {
      const response = await api.post("/competition/create", {
        name: createName,
      });
      if (response.data.success) {
        fetchRoomStatus();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setActionLoading(true);
    setError(null);
    try {
      const response = await api.post("/competition/join", { code: joinCode });
      if (response.data.success) {
        fetchRoomStatus();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join room");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveRoom = () => {
    // Fix: Auth context provides user.id, not user._id
    const isHost = roomData?.room.host === user.id;

    if (isHost) {
      setModalConfig({
        title: "End Room?",
        message:
          "This will kick all members and delete the room immediately. This action cannot be undone.",
        confirmText: "End Room",
        variant: "danger",
      });
    } else {
      setModalConfig({
        title: "Surrender Battle?",
        message:
          "Are you sure you want to surrender and leave the battle? Your progress in this room will be lost.",
        confirmText: "Surrender",
        variant: "warning",
      });
    }
    setShowModal(true);
  };

  const confirmLeaveRoom = async () => {
    setActionLoading(true);
    try {
      const response = await api.post("/competition/leave");
      if (response.data.success) {
        setIsInRoom(false);
        setRoomData(null);
        setJoinCode("");
        setCreateName("");
        setLobbyView("selection");
      }
    } catch (err) {
      console.error("Failed to leave room:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomData?.room.code);
    alert("Room code copied!");
  };

  const formatDuration = (hours) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours}h`;
  };

  if (loading) {
    return <CompetitionLoader />;
  }

  // LOBBY VIEW
  if (!isInRoom) {
    return (
      <div className="page competition">
        <div className="page__header">
          <h1>
            ⚔️ Battle <span>Arena</span>
          </h1>
          <p>Compete with friends for the longest streak!</p>
        </div>

        <div className="competition__lobby">
          {error && (
            <div className="competition__error">
              <IoWarning /> {error}
            </div>
          )}

          {lobbyView === "selection" && (
            <div className="competition__selection">
              <div
                className="competition__selection-card create"
                onClick={() => setLobbyView("create")}
              >
                <div className="icon-wrapper">
                  <IoAddCircleOutline />
                </div>
                <h3>Host Battle</h3>
                <p>Create a room and invite friends</p>
              </div>

              <div
                className="competition__selection-card join"
                onClick={() => setLobbyView("join")}
              >
                <div className="icon-wrapper">
                  <IoEnterOutline />
                </div>
                <h3>Join Battle</h3>
                <p>Enter a code to join an existing room</p>
              </div>
            </div>
          )}

          {lobbyView === "create" && (
            <div className="competition__card fade-in">
              <div className="competition__card-header">
                <button
                  className="btn-back"
                  onClick={() => setLobbyView("selection")}
                >
                  ← Back
                </button>
                <h3>Create Room</h3>
              </div>
              <form onSubmit={handleCreateRoom}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter Room Name"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    maxLength={30}
                    className="input"
                    required
                    autoFocus
                  />
                </div>
                <button
                  className="btn btn--primary btn--full"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Creating..." : "Create & Host"}
                </button>
              </form>
            </div>
          )}

          {lobbyView === "join" && (
            <div className="competition__card fade-in">
              <div className="competition__card-header">
                <button
                  className="btn-back"
                  onClick={() => setLobbyView("selection")}
                >
                  ← Back
                </button>
                <h3>Join Room</h3>
              </div>
              <form onSubmit={handleJoinRoom}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter 6-Character Code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="input"
                    required
                    autoFocus
                  />
                </div>
                <button
                  className="btn btn--secondary btn--full"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Joining..." : "Join Battle"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LEADERBOARD VIEW
  const { room, leaderboard } = roomData;
  const isHost = room.host === user.id; // Fix: Check user.id

  return (
    <div className="page competition">
      <div className="competition__header">
        <div className="competition__room-info">
          <h2>{room.name}</h2>
          <div
            className="competition__code"
            onClick={copyCode}
            title="Click to copy"
          >
            Code: <span>{room.code}</span> <IoCopyOutline />
          </div>
        </div>
        <button
          className={`btn ${isHost ? "btn--danger" : "btn--ghost"}`}
          onClick={handleLeaveRoom}
          disabled={actionLoading}
        >
          <IoExitOutline /> {isHost ? "End Room" : "Surrender"}
        </button>
      </div>

      <div className="competition__leaderboard">
        <div className="leaderboard__list">
          {leaderboard.map((member, index) => {
            const badge = getBadgeInfo(member.durationHours);
            return (
              <div
                key={member._id}
                className={`leaderboard__card ${member.isMe ? "active" : ""}`}
                style={{ "--index": index }}
              >
                <div className="leaderboard__rank">
                  {index === 0 ? "👑" : `#${index + 1}`}
                </div>

                <div className="leaderboard__user">
                  <div className="leaderboard__avatar">
                    <div className="avatar-placeholder">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="leaderboard__details">
                    <span className="leaderboard__name">
                      {member.username} {member.isMe && "(You)"}{" "}
                      {member.isHost && <span className="host-tag">HOST</span>}
                    </span>
                    <span className="leaderboard__badge-label">
                      {badge.label}
                    </span>
                  </div>
                </div>

                <div className="leaderboard__score">
                  <span className="score-value">
                    {formatDuration(member.durationHours)}
                  </span>
                  <span className="score-label">Streak</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmLeaveRoom}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        variant={modalConfig.variant}
      />
    </div>
  );
};

export default Competition;

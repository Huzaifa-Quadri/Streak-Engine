import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { sileo } from "sileo";

const EmailAlert = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasShownRef = useRef(false);

  useEffect(() => {
    // Only show once per mount cycle, and only when user is loaded and has no email
    if (!user || hasShownRef.current) return;

    // Check if user has no email (field missing, null, undefined, or empty string)
    const hasEmail = user.email && user.email.trim() !== "";
    if (hasEmail) return;

    hasShownRef.current = true;

    sileo.warning({
      title: "⚠️ Missing Email",
      description: "Add an email to your account to enable password resets.",
      button: {
        title: "Register Email",
        onClick: () => navigate("/profile"),
      },
      duration: 10000,
    });
  }, [user, navigate]);

  return null; // This component renders nothing, it only triggers the toast
};

export default EmailAlert;

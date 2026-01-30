import React, { useState } from "react";

// Badge configuration - maps days to badge info
// Extension can be 'png', 'jpg', 'jpeg', or 'svg'
const BADGES = [
  // 🟢 FOUNDATION (Early Struggle)
  {
    days: 0,
    image: "badge-0",
    label: "Clown",
    description: "Just starting... prove yourself!",
  },
  {
    days: 1,
    image: "badge-1",
    label: "Beginner",
    description: "First step taken!",
  },
  {
    days: 2,
    image: "badge-2",
    label: "Novice",
    description: "Building momentum...",
  },
  {
    days: 3,
    image: "badge-3",
    label: "Struggler",
    description: "Keep pushing through!",
  },
  {
    days: 5,
    image: "badge-5",
    label: "Rookie",
    description: "Getting stronger!",
  },
  {
    days: 7,
    image: "badge-7",
    label: "Warrior",
    description: "One week strong! 💪",
  },
  {
    days: 10,
    image: "badge-10",
    label: "Streak Enjoyer",
    description: "Enjoying the journey!",
  },
  {
    days: 14,
    image: "badge-14",
    label: "Mind Over Meat",
    description: "Two weeks of discipline!",
  },
  {
    days: 17,
    image: "badge-17",
    label: "Weak Men Quit Here",
    description: "You're not weak!",
  },
  {
    days: 21,
    image: "badge-21",
    label: "Discipline Learner",
    description: "Habits are forming!",
  },

  // 🔵 CONTROL PHASE (Stability)
  {
    days: 30,
    image: "badge-30",
    label: "Self-Control Adept",
    description: "One month! 🎉",
  },
  {
    days: 45,
    image: "badge-45",
    label: "Aura Farmer",
    description: "Your energy is rising!",
  },
  {
    days: 60,
    image: "badge-60",
    label: "Built Different",
    description: "Two months strong!",
  },
  {
    days: 75,
    image: "badge-75",
    label: "Sigma Initiate",
    description: "On the sigma path!",
  },
  {
    days: 90,
    image: "badge-90",
    label: "Monk Mode",
    description: "90 days! True discipline! 🧘",
  },

  // 🟣 POWER PHASE (Identity Shift)
  {
    days: 120,
    image: "badge-120",
    label: "Sigma Male",
    description: "Identity transformed!",
  },
  {
    days: 150,
    image: "badge-150",
    label: "Chad",
    description: "Five months! 💎",
  },
  {
    days: 180,
    image: "badge-180",
    label: "Ascended Chad",
    description: "Half a year! Incredible!",
  },
  {
    days: 210,
    image: "badge-210",
    label: "Temptation Exorcist",
    description: "Temptation has no power!",
  },
  {
    days: 240,
    image: "badge-240",
    label: "Gigachad",
    description: "Eight months of iron will!",
  },

  // 🔴 ELITE PHASE (Rare Air)
  {
    days: 270,
    image: "badge-270",
    label: "Chad Ascender",
    description: "Nine months! Elite status!",
  },
  {
    days: 300,
    image: "badge-300",
    label: "Monk Mode MAX",
    description: "300 days! Legendary!",
  },
  {
    days: 330,
    image: "badge-330",
    label: "Reality Breaker",
    description: "Breaking all limits!",
  },
  {
    days: 360,
    image: "badge-360",
    label: "NoFap Final Boss 👑",
    description: "ONE YEAR! You are the BOSS!",
  },
];

// Supported image extensions to try
const EXTENSIONS = ["png", "jpg", "jpeg", "svg", "webp"];

// Get badge info based on hours elapsed
export const getBadgeInfo = (hours) => {
  const days = Math.floor(hours / 24);

  // Find the highest badge the user qualifies for
  let currentBadge = BADGES[0];

  for (let i = BADGES.length - 1; i >= 0; i--) {
    if (days >= BADGES[i].days) {
      currentBadge = BADGES[i];
      break;
    }
  }

  return currentBadge;
};

// Get next badge info for progress display
export const getNextBadgeInfo = (hours) => {
  const days = Math.floor(hours / 24);

  for (const badge of BADGES) {
    if (badge.days > days) {
      return {
        ...badge,
        daysRemaining: badge.days - days,
      };
    }
  }

  return null; // Already at max badge
};

// Badge Image component with fallback support
const BadgeImage = ({ imageName, label }) => {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  const handleError = () => {
    // Try next extension
    if (extensionIndex < EXTENSIONS.length - 1) {
      setExtensionIndex(extensionIndex + 1);
    } else {
      // All extensions failed, show fallback
      setShowFallback(true);
    }
  };

  if (showFallback) {
    return (
      <div
        className="badge-fallback"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          fontSize: "4rem",
          background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
          borderRadius: "50%",
        }}
      >
        🏆
      </div>
    );
  }

  return (
    <img
      src={`/badges/${imageName}.${EXTENSIONS[extensionIndex]}`}
      alt={label}
      onError={handleError}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        borderRadius: "12px",
      }}
    />
  );
};

const StreakBadge = ({ hours = 0 }) => {
  const badge = getBadgeInfo(hours);
  const nextBadge = getNextBadgeInfo(hours);

  return (
    <div className="streak-badge">
      <div className="home__badge animate-float">
        <BadgeImage imageName={badge.image} label={badge.label} />
      </div>
      <div className="home__badge-label">{badge.label}</div>
      <p className="home__status">{badge.description}</p>

      {nextBadge && (
        <div className="home__next-badge">
          <span>
            Next: <strong>{nextBadge.label}</strong> in{" "}
            {nextBadge.daysRemaining} day
            {nextBadge.daysRemaining !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakBadge;

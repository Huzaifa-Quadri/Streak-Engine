import React from "react";
import { NavLink } from "react-router-dom";
import {
  IoHomeOutline,
  IoHome,
  IoTimeOutline,
  IoTime,
  IoAlertCircleOutline,
  IoAlertCircle,
  IoJournalOutline,
  IoJournal,
  IoTrophyOutline,
  IoTrophy,
} from "react-icons/io5";

const BottomNav = () => {
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: IoHomeOutline,
      activeIcon: IoHome,
    },
    {
      path: "/history",
      label: "History",
      icon: IoTimeOutline,
      activeIcon: IoTime,
    },
    {
      path: "/emergency",
      label: "SOS",
      icon: IoAlertCircleOutline,
      activeIcon: IoAlertCircle,
    },
    {
      path: "/checkin",
      label: "Check-In",
      icon: IoJournalOutline,
      activeIcon: IoJournal,
    },
    {
      path: "/competition",
      label: "Arena",
      icon: IoTrophyOutline,
      activeIcon: IoTrophy,
    },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__container">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `bottom-nav__item ${isActive ? "active" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="bottom-nav__icon">
                  {isActive ? <item.activeIcon /> : <item.icon />}
                </span>
                <span className="bottom-nav__label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

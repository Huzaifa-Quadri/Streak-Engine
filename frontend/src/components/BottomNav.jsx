import React from "react";
import { NavLink } from "react-router-dom";
import {
  IoHomeOutline,
  IoHome,
  IoTimeOutline,
  IoTime,
  IoJournalOutline,
  IoJournal,
  IoTrophyOutline,
  IoTrophy,
} from "react-icons/io5";
import { RiAlarmWarningLine, RiAlarmWarningFill } from "react-icons/ri";

const BottomNav = () => {
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: IoHomeOutline,
      activeIcon: IoHome,
      className: "nav-item-home",
    },
    {
      path: "/history",
      label: "History",
      icon: IoTimeOutline,
      activeIcon: IoTime,
      className: "nav-item-history",
    },
    {
      path: "/emergency",
      label: "Panic",
      icon: RiAlarmWarningLine,
      activeIcon: RiAlarmWarningFill,
      className: "nav-item-panic",
    },
    {
      path: "/competition",
      label: "Arena",
      icon: IoTrophyOutline,
      activeIcon: IoTrophy,
      className: "nav-item-arena",
    },
    {
      path: "/checkin",
      label: "Check-In",
      icon: IoJournalOutline,
      activeIcon: IoJournal,
      className: "nav-item-checkin",
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
              `bottom-nav__item ${isActive ? "active" : ""} ${item.className}`
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

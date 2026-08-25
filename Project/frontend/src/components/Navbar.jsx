import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLogo from "./AppLogo";
import { FiMenu, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import "../styles/navbar.css";

export default function Navbar({ toggleSidebar, isSidebarOpen, showSidebarToggle }) {
  const { user, logout, xp, themeMode, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      {/* ── Left: Logo + optional sidebar toggle ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {(showSidebarToggle || (user && user.role === "STUDENT")) && (
          <button
            className={`sidebar-toggle-btn-nav ${isSidebarOpen ? "open" : ""}`}
            onClick={toggleSidebar || (() => {})}
            title="Toggle Sidebar"
          >
            <FiMenu />
          </button>
        )}
        <Link
          to={user ? (user.role === "STUDENT" ? "/student-home" : "/workforce-home") : "/"}
          className="logo"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
        >
          <AppLogo height="54px" />
        </Link>
      </div>

      {/* ── Center: Nav links matching user request ── */}
      <nav className="navLinks">
        <Link
          to={user ? (user.role === "STUDENT" ? "/student-home" : "/workforce-home") : "/"}
          className={location.pathname === "/" || location.pathname === "/student-home" || location.pathname === "/workforce-home" ? "activeNav" : ""}
        >
          Home
        </Link>

        {user && user.role === "STUDENT" && (
          <>
            <Link to="/student-features" className={location.pathname === "/student-features" ? "activeNav" : ""}>Features</Link>
            <Link to="/courses"          className={location.pathname === "/courses" ? "activeNav" : ""}>Work Hub</Link>
            <Link to="/learning"         className={location.pathname === "/learning" ? "activeNav" : ""}>Students Hub</Link>
            <Link to="/progress"         className={location.pathname === "/progress" ? "activeNav" : ""}>Progress</Link>
            <Link to="/sandbox"          className={location.pathname === "/sandbox" ? "activeNav" : ""}>Sandbox</Link>
          </>
        )}

        {user && user.role === "EMPLOYEE" && (
          <>
            <Link to="/workforce-features" className={location.pathname === "/workforce-features" ? "activeNav" : ""}>Features</Link>
            <Link to="/team-space"         className={location.pathname === "/team-space" ? "activeNav" : ""}>Team Space</Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/features"          className={location.pathname === "/features" ? "activeNav" : ""}>Features</Link>
            <Link to="/student-features" className={location.pathname === "/student-features" || location.pathname === "/student-hub" ? "activeNav" : ""}>Students Hub</Link>
            <Link to="/workforce"         className={location.pathname === "/workforce" || location.pathname === "/work-hub" ? "activeNav" : ""}>Work Hub</Link>
            <Link to="/admin-login"       className="adminLink">Admin Portal</Link>
          </>
        )}
      </nav>

      {/* ── Right: Action Buttons ── */}
      <div className="navButtons">
        <button
          className="themeToggleNavBtn"
          onClick={toggleTheme}
          title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {themeMode === 'dark' ? <FiSun className="themeNavIcon sun" /> : <FiMoon className="themeNavIcon moon" />}
          <span className="themeNavText">{themeMode === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {user && user.role === "STUDENT" && (
          <button className="xpBtn" onClick={() => navigate("/student-home")}>⚡ {xp} XP</button>
        )}

        {user ? (
          <div
            className="userProfileContainer"
            onClick={() => {
              if (user.role === "STUDENT") navigate("/student-home");
              else if (user.role === "EMPLOYEE") navigate("/workforce-home");
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="userProfileBadge">
              <div className="avatarCircle" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {(user.avatar_url || user.profile_picture) ? (
                  <img src={user.avatar_url || user.profile_picture} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()
                )}
              </div>
              <div className="userInfoText">
                <span className="userName">{user.full_name || user.username}</span>
                <span className="userRoleBadge">{user.role}</span>
              </div>
            </div>
            <button
              className="logoutBtn"
              onClick={async (e) => { e.stopPropagation(); await logout(); navigate("/"); }}
              title="Sign out of SkillSphere"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="loginBtn" onClick={() => navigate("/login")}>Login</button>
            <button className="registerBtn" onClick={() => navigate("/register")}>Register</button>
          </div>
        )}
      </div>
    </header>
  );
}

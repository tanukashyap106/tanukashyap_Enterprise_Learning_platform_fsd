import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import FloatingChatbot from "../components/FloatingChatbot";
import UserAvatar from "../components/UserAvatar";
import NotificationDropdown from "../components/NotificationDropdown";

import {
  FaHome,
  FaBook,
  FaCodeBranch,
  FaFileAlt,
  FaComments,
  FaAward,
  FaCertificate,
  FaChartLine,
  FaFileInvoice,
  FaBolt,
  FaTrophy,
  FaCog,
  FaSearch,
  FaBell,
  FaRobot,
  FaRocket,
  FaStar,
  FaMapSigns,
  FaMapMarkedAlt,
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaCalendarAlt,
  FaInfoCircle,
  FaLock,
  FaCrown,
  FaChevronRight,
  FaCode,
  FaShieldAlt,
  FaPuzzlePiece,
  FaBriefcase,
  FaCompass,
  FaFlag,
  FaCheck,
  FaMedal,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/questMapPage.css";

import AppLogo from "../components/AppLogo";

export default function QuestMapPage() {
  const { user, xp, themeMode, toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/");
    }
  };

  const userName = user?.full_name || user?.username || "Learner";
  const currentXp = xp ?? 0;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "student-profile", label: "Student Profile", icon: <FaAward /> },
    { id: "services-catalog", label: "Services & Catalog", icon: <FaBook /> },
    { id: "assessments", label: "Assessments", icon: <FaBolt /> },
    { id: "certification-tracking", label: "Cert Tracking", icon: <FaCertificate /> },
    
    { id: "complaint-tracking", label: "Complaint & Renewal", icon: <FaFileInvoice /> },
    { id: "career-roadmap", label: "Career Roadmap", icon: <FaCodeBranch /> },
    { id: "courses", label: "Courses", icon: <FaBook /> },
    { id: "learning-paths", label: "Learning Paths", icon: <FaCodeBranch /> },
    { id: "ai-buddy", label: "AI Study Buddy", icon: <FaRobot /> },
    { id: "opportunity-feed", label: "Opportunity Feed", icon: <FaRocket /> },
    { id: "daily-quests", label: "Daily Quests", icon: <FaBolt /> },
    { id: "badges", label: "Badges", icon: <FaAward /> },
    { id: "certificates", label: "Certificates", icon: <FaCertificate /> },
    { id: "progress", label: "Progress", icon: <FaChartLine /> },
    { id: "resume", label: "Resume Builder", icon: <FaFileInvoice /> },
    { id: "code-arena", label: "CodeArena", icon: <FaCode /> }
  ];

  return (
    <div className={`qmpWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      {/* Main Grid Container */}
      <div className="qmpMainContainer">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="qmpLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>

            <div className="qmpSidebarHomeArchHeader">
              <div className="qmpArchLine" />
              <button
                className="qmpHomeCircularBtn active"
                onClick={() => navigate("/quest-map")}
                title="Quest Map"
              >
                <FaMapMarkedAlt />
              </button>
            </div>

            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "quest-map" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "discussions") navigate("/discussions");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "opportunity-feed") navigate("/opportunity-feed");
                      else if (item.id === "quest-map") navigate("/quest-map");
                      else if (item.id === "daily-quests") navigate("/daily-quests");
                      else if (item.id === "badges") navigate("/badges");
                      else if (item.id === "certificates") navigate("/certificate");
                      else if (item.id === "progress") navigate("/progress");
                      else if (item.id === "resume") navigate("/resume");
                      else if (item.id === "code-arena") navigate("/code-arena");
                      else if (item.id === "settings") navigate("/settings");
                      else navigate(`/${item.id}`);
                    }}
                  >
                    <span className="navIcon">{item.icon}</span>
                    <span className="navLabel">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrade to Pro Box at Sidebar Bottom */}
          <div className="qmpSidebarProWidget">
            <div className="levelHeaderRow">
              <div className="lvlTrophy">🏆</div>
              <div>
                <strong>Level 12</strong>
                <span>Code Explorer</span>
              </div>
            </div>
            <div className="lvlBarTrack">
              <div className="lvlBarFill" style={{ width: "72%" }}></div>
            </div>
            <span className="lvlXpSub">1800 / 2500 XP</span>

            <button className="btnUpgradePro">
              <FaCrown color="#F59E0B" /> Upgrade to Pro
            </button>
            <p className="proSubText">Unlock unlimited quests & exclusive rewards!</p>
          </div>

          <div className="sdSidebarFooterControls">
            <button className="sdThemeToggleBtn" onClick={toggleTheme} title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <span className="sdControlDivider">|</span>
            <button className="sdCollapseBtn">
              <FaArrowLeft />
            </button>
          </div>
        </aside>

        {/* ── RIGHT MAIN BODY AREA ── */}
        <div className="qmpRightBodyArea">
          
          {/* Top Header Bar */}
          <header className="sdTopHeaderBar">
            <div className="sdSearchWrapper">
              <FaSearch className="sdSearchIcon" />
              <input
                type="text"
                className="sdSearchInput"
                placeholder="Search for courses, skills, discussions..."
              />
            </div>

            <div className="sdHeaderActionsRow">
              <div className="sdXpBadgePill">
                <FaBolt color="#F9572A" /> <span>{currentXp} XP</span>
              </div>

              <NotificationDropdown type="student" />

              <button
                className="sdLogoutHeaderBtn"
                onClick={handleLogout}
                title="Logout to Landing Page"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>

              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <UserAvatar user={user} />
                  <div className="sdUserInfoText">
                    <strong>{userName}</strong>
                    <span>Student</span>
                  </div>
                  <span className="dropdownArrow">▾</span>
                </div>

                {isUserMenuOpen && (
                  <div className="sdUserMenuDropdown">
                    <div className="dropdownHeader">
                      <strong>{userName}</strong>
                      <span>Student Account</span>
                    </div>
                    <div className="dropdownItem" onClick={() => { setIsUserMenuOpen(false); navigate("/student-profile"); }}>
                      👤 Profile Settings
                    </div>
                    <div className="dropdownItem" onClick={() => { setIsUserMenuOpen(false); navigate("/certificate"); }}>
                      📜 My Certificates
                    </div>
                    <div className="dropdownItem logout" onClick={handleLogout}>
                      🚪 Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Heading */}
          <div className="qmpPageHeaderRow">
            <div className="qmpPageHeader">
              <h1>Quest Map 🗺️</h1>
              <p>Complete quests, earn XP and unlock amazing rewards!</p>
            </div>
            <button className="btnHowItWorks">
              How it works? <FaInfoCircle />
            </button>
          </div>

          {/* 2-Column Main Workspace */}
          <div className="qmpGridContainer">
            
            {/* Center Main Column */}
            <div className="qmpCenterColumn">
              
              {/* Illustrated Quest Map Parchment Canvas */}
              <div className="questMapCanvas">
                <div className="compassRose"><FaCompass /></div>
                <div className="castleGraphic">🏰</div>

                {/* Node 1: Getting Started */}
                <div className="qNode node1 completed">
                  <div className="nodeCircle orange">
                    <FaFlag />
                  </div>
                  <div className="nodeCard">
                    <strong>Getting Started</strong>
                    <span>100 XP</span>
                    <span className="tagCompleted">✓ Completed</span>
                  </div>
                </div>

                {/* Node 2: Code Initiate */}
                <div className="qNode node2 completed">
                  <div className="nodeCircle orange">
                    <FaCode />
                  </div>
                  <div className="nodeCard">
                    <strong>Code Initiate</strong>
                    <span>500 XP</span>
                    <span className="tagCompleted">✓ Completed</span>
                  </div>
                </div>

                {/* Node 3: Frontend Pioneer */}
                <div className="qNode node3 current">
                  <div className="nodeCircle blue">
                    <FaCode />
                  </div>
                  <div className="nodeCard">
                    <strong>Frontend Pioneer</strong>
                    <span>1500 XP</span>
                  </div>
                </div>

                {/* Node 4: Problem Solver */}
                <div className="qNode node4 completed">
                  <div className="nodeCircle green">
                    <FaPuzzlePiece />
                  </div>
                  <div className="nodeCard">
                    <strong>Problem Solver</strong>
                    <span>1000 XP</span>
                    <span className="tagCompleted">✓ Completed</span>
                  </div>
                </div>

                {/* Node 5: DSA Warrior */}
                <div className="qNode node5 locked">
                  <div className="nodeCircle purple">
                    ⚔️
                  </div>
                  <div className="nodeCard">
                    <strong>DSA Warrior</strong>
                    <span>2000 XP <FaLock /></span>
                  </div>
                </div>

                {/* Node 6: Project Master */}
                <div className="qNode node6 locked">
                  <div className="nodeCircle rose">
                    <FaBriefcase />
                  </div>
                  <div className="nodeCard">
                    <strong>Project Master</strong>
                    <span>2500 XP <FaLock /></span>
                  </div>
                </div>

                {/* Node 7: Legend */}
                <div className="qNode node7 locked">
                  <div className="nodeCircle gold">
                    👑
                  </div>
                  <div className="nodeCard">
                    <strong>Legend</strong>
                    <span>3000 XP <FaLock /></span>
                  </div>
                </div>

                {/* Floating Your Journey Card */}
                <div className="journeyFloatingCard">
                  <div>
                    <h5>Your Journey</h5>
                    <strong>5 / 8</strong>
                    <span>Quests Completed</span>
                  </div>
                  <div className="journeyRing">
                    <svg viewBox="0 0 36 36">
                      <path className="rBg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="rFill" strokeDasharray="62, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                  </div>
                  <button className="btnViewAllRewards">
                    🎁 View All Rewards
                  </button>
                </div>
              </div>

              {/* Path Rewards Track (Bottom) */}
              <div className="pathRewardsCard">
                <div className="rewardsHeader">
                  <h4>Path Rewards</h4>
                  <span>Complete quests to earn XP and unlock rewards</span>
                </div>

                <div className="rewardsTrackBar">
                  <div className="rewardMilestone reached">
                    <div className="milestoneIcon shield">🛡️</div>
                    <span className="xpSub">250 XP</span>
                    <span className="chkMark"><FaCheck /></span>
                  </div>

                  <div className="rewardMilestone reached">
                    <div className="milestoneIcon purpleBox">🎁</div>
                    <span className="xpSub">750 XP</span>
                    <span className="chkMark"><FaCheck /></span>
                  </div>

                  <div className="rewardMilestone reached">
                    <div className="milestoneIcon chest">📦</div>
                    <span className="xpSub">1250 XP</span>
                    <span className="chkMark"><FaCheck /></span>
                  </div>

                  <div className="rewardMilestone reached">
                    <div className="milestoneIcon star">🎖️</div>
                    <span className="xpSub">1750 XP</span>
                    <span className="chkMark"><FaCheck /></span>
                  </div>

                  <div className="rewardMilestone locked">
                    <div className="milestoneIcon box">📦</div>
                    <span className="xpSub">2250 XP</span>
                    <span className="lockMark"><FaLock /></span>
                  </div>

                  <div className="rewardMilestone locked">
                    <div className="milestoneIcon trophy">🏆</div>
                    <span className="xpSub">3000 XP</span>
                    <span className="lockMark"><FaLock /></span>
                  </div>

                  <div className="trackLineFill" style={{ width: "68%" }}></div>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN SIDEBAR WIDGETS ── */}
            <div className="qmpRightSidebar">
              
              {/* Today's Quests Widget */}
              <div className="qmpWidgetCard">
                <div className="widgetTitleRow">
                  <h4>📅 Today's Quests</h4>
                  <span className="badge3">3</span>
                </div>

                <div className="dailyQuestsList">
                  <div className="dQuestItem">
                    <div className="qIcon"><FaCode /></div>
                    <div className="qInfo">
                      <h5>Complete 2 Coding Problems</h5>
                      <span className="xpVal">+50 XP</span>
                      <div className="qTrack"><div className="qFill" style={{ width: "50%" }}></div></div>
                      <span className="qFraction">1 / 2</span>
                    </div>
                    <FaChevronRight className="qArrow" />
                  </div>

                  <div className="dQuestItem">
                    <div className="qIcon"><FaBook /></div>
                    <div className="qInfo">
                      <h5>Read 1 Lesson</h5>
                      <span className="xpVal">+30 XP</span>
                      <span className="qFraction">0 / 1</span>
                    </div>
                    <FaChevronRight className="qArrow" />
                  </div>

                  <div className="dQuestItem">
                    <div className="qIcon"><FaComments /></div>
                    <div className="qInfo">
                      <h5>Join a Discussion</h5>
                      <span className="xpVal">+20 XP</span>
                      <span className="qFraction">0 / 1</span>
                    </div>
                    <FaChevronRight className="qArrow" />
                  </div>
                </div>

                <span className="viewAllQuestsLink">View All Daily Quests →</span>
              </div>

              {/* Learning Streak Widget */}
              <div className="qmpWidgetCard">
                <div className="streakHeader">
                  <h4>Learning Streak 🔥</h4>
                  <FaTrophy color="#F59E0B" />
                </div>
                <div className="streakDaysBig">7 Days</div>
                <span className="streakSubtext">Keep it up! You're on fire!</span>

                <div className="streakDaysCheckedRow">
                  <div className="chkDayCol"><span>M</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                  <div className="chkDayCol"><span>T</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                  <div className="chkDayCol"><span>W</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                  <div className="chkDayCol"><span>T</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                  <div className="chkDayCol"><span>F</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                  <div className="chkDayCol"><span>S</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                  <div className="chkDayCol"><span>S</span><div className="chkCircle"></div></div>
                </div>
              </div>

              {/* Leaderboard Widget */}
              <div className="qmpWidgetCard">
                <div className="widgetTitleRow">
                  <h4>🏆 Leaderboard</h4>
                  <span className="viewAllLink">View All</span>
                </div>

                <div className="leaderboardList">
                  <div className="lbItem">
                    <span className="rankNum crown">👑 1</span>
                    <div className="userAvatar">🧑‍💻</div>
                    <strong>Aarav Mehta</strong>
                    <span className="xpScore">2480 XP</span>
                  </div>

                  <div className="lbItem activeUser">
                    <span className="rankNum silver">🥈 2</span>
                    <UserAvatar user={user} className="userAvatar" size="28px" />
                    <strong>{userName} (You)</strong>
                    <span className="xpScore">1800 XP</span>
                  </div>

                  <div className="lbItem">
                    <span className="rankNum bronze">🥉 3</span>
                    <div className="userAvatar">👩‍💻</div>
                    <strong>Neha Kumari</strong>
                    <span className="xpScore">1640 XP</span>
                  </div>

                  <div className="lbItem">
                    <span className="rankNum">4</span>
                    <div className="userAvatar">👨‍💻</div>
                    <strong>Rohit Sharma</strong>
                    <span className="xpScore">1320 XP</span>
                  </div>
                </div>
              </div>

              {/* Recent Rewards Widget */}
              <div className="qmpWidgetCard">
                <div className="widgetTitleRow">
                  <h4>Recent Rewards</h4>
                  <span className="viewAllLink">View All</span>
                </div>

                <div className="recentRewardsList">
                  <div className="rewardItem">
                    <div className="rIcon greenHex">🎖️</div>
                    <div>
                      <h5>Code Streak Badge</h5>
                      <span>Earned on 24 May 2025</span>
                    </div>
                    <FaCheckCircle className="chkGreen" />
                  </div>

                  <div className="rewardItem">
                    <div className="rIcon goldBolt">⚡</div>
                    <div>
                      <h5>100 XP Bonus</h5>
                      <span>Earned on 23 May 2025</span>
                    </div>
                    <FaCheckCircle className="chkGreen" />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      <FloatingChatbot />
      <StudentFooter />
    </div>
  );
}

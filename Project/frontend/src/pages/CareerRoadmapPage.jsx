import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";
import {
  FaHome, FaBook, FaCodeBranch, FaAward, FaCertificate, FaChartLine,
  FaFileInvoice, FaCog, FaSearch, FaSun, FaMoon, FaArrowLeft,
  FaSignOutAlt, FaSlidersH, FaRobot, FaRocket, FaBolt, FaCode, FaArrowRight
} from "react-icons/fa";
import "../styles/studentDashboard.css";

import AppLogo from "../components/AppLogo";

export default function CareerRoadmapPage() {
  const { user, xp, logout, themeMode, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";

  const [currentRole, setCurrentRole] = useState("Frontend Engineer");
  const [targetRole, setTargetRole] = useState("AI Integration Specialist");

  // Shifting guidance models
  const pathways = {
    "AI Integration Specialist": {
      skillsGap: [
        { skill: "Python Basics", status: "Acquired" },
        { skill: "Prompt Engineering", status: "Acquired" },
        { skill: "Large Language Models API", status: "Gap (Needs Training)" },
        { skill: "Vector Databases", status: "Gap (Needs Training)" }
      ],
      milestones: [
        { step: 1, title: "Learn Python Essentials & Pandas", desc: "Gain fundamental data processing skills.", duration: "2 weeks" },
        { step: 2, title: "API Integrations & Prompt Engineering", desc: "Understand OpenAI/Anthropic model integration parameters.", duration: "3 weeks" },
        { step: 3, title: "Vector DB & RAG Setup", desc: "Learn Pinecone/Chroma search indices and document chunkings.", duration: "3 weeks" }
      ],
      recommendations: ["Python for Beginners", "Advanced Machine Learning"]
    },
    "Cloud DevOps Architect": {
      skillsGap: [
        { skill: "Linux Shell Scripting", status: "Acquired" },
        { skill: "Git Versioning", status: "Acquired" },
        { skill: "Docker Containerization", status: "Gap (Needs Training)" },
        { skill: "Kubernetes & Orchestration", status: "Gap (Needs Training)" },
        { skill: "AWS Cloud Deployments", status: "Gap (Needs Training)" }
      ],
      milestones: [
        { step: 1, title: "Docker & Container Architecture", desc: "Learn image creation, multi-stage builds, and docker-compose.", duration: "2 weeks" },
        { step: 2, title: "Kubernetes Pods & Services Orchestration", desc: "Scale nodes, configure deployments, ingress, and PV storage.", duration: "4 weeks" },
        { step: 3, title: "AWS Elastic Container Services & IAM", desc: "Secure and deploy containers inside real AWS cloud pipelines.", duration: "3 weeks" }
      ],
      recommendations: ["Node.js & Microservices", "System Design Architecture"]
    }
  };

  const selectedPath = pathways[targetRole] || pathways["AI Integration Specialist"];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

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
    <div className={`sdDashboardWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      <div className="sdMainContainer">
        {/* Left Sidebar */}
        <aside className="sdLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>
            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button className="sdHomeCircularBtn" onClick={() => navigate("/student-home")}>
                <FaHome />
              </button>
            </div>
            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "career-roadmap" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "settings") navigate("/settings");
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
                      else if (item.id === "opportunity-feed") navigate("/opportunity-feed");
                      else if (item.id === "badges") navigate("/badges");
                      else if (item.id === "discussions") navigate("/discussions");
                      else if (item.id === "certificates") navigate("/certificate");
                      else if (item.id === "progress") navigate("/progress");
                      else if (item.id === "daily-quests") navigate("/daily-quests");
                      else if (item.id === "resume") navigate("/resume");
                      else if (item.id === "code-arena") navigate("/code-arena");
                      else if (item.id === "student-profile") navigate("/student-profile");
                      else if (item.id === "services-catalog") navigate("/services-catalog");
                      else if (item.id === "assessments") navigate("/assessments");
                      else if (item.id === "certification-tracking") navigate("/certification-tracking");
                      
                      else if (item.id === "complaint-tracking") navigate("/complaint-tracking");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "job-search") navigate("/job-search");
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
          <div className="sdSidebarBottomSection">
            <div className="sdSidebarFooterControls">
              <button className="sdThemeToggleBtn" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <span className="sdControlDivider">|</span>
              <button className="sdCollapseBtn" onClick={() => navigate(-1)}>
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="sdRightBodyArea">
          <header className="sdTopHeaderBar">
            <div className="sdSearchWrapper">
              <FaSearch className="sdSearchIcon" />
              <input type="text" className="sdSearchInput" placeholder="Search roadmap features..." />
            </div>
            <div className="sdHeaderActionsRow">
              <div className="sdXpBadgePill">
                <FaBolt color="#F9572A" /> <span>{xp ?? 0} XP</span>
              </div>
              <NotificationDropdown type="student" />
              <button className="sdLogoutHeaderBtn" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </button>
              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill">
                  <UserAvatar user={user} />
                  <div className="sdUserInfoText">
                    <strong>{user?.full_name || "Learner"}</strong>
                    <span>Student</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="sdGreetingHeader">
            <h1>Employee Shifting Guidance</h1>
            <p>Formulate interactive transition pathways to move from your current role to modern technology markets.</p>
          </div>

          {/* Shifting Guidance Setup */}
          <div className="sdWhitePanelCard" style={{ marginBottom: "24px", padding: "20px" }}>
            <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Current Role</label>
                <select value={currentRole} onChange={e => setCurrentRole(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="QA Engineer">QA Automation Engineer</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>

              <div style={{ fontSize: "24px", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaArrowRight />
              </div>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Target Role (Shift Direction)</label>
                <select value={targetRole} onChange={e => setTargetRole(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <option value="AI Integration Specialist">AI Integration Specialist</option>
                  <option value="Cloud DevOps Architect">Cloud DevOps Architect</option>
                </select>
              </div>
            </div>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center column: Skills gap analysis and Milestones */}
            <div className="sdCenterMainCol">
              {/* Skills Gap Analysis */}
              <div className="sdWhitePanelCard" style={{ marginBottom: "24px" }}>
                <h3>Skills Gap Analysis</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
                  Comparing your current skill catalog profile with target requirements.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  {selectedPath.skillsGap.map((gap, idx) => (
                    <div key={idx} style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "bold" }}>{gap.skill}</span>
                      <span style={{ fontSize: "11px", fontWeight: "bold", color: gap.status === "Acquired" ? "#10b981" : "#ef4444" }}>
                        {gap.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Transition Roadmap */}
              <div className="sdWhitePanelCard">
                <h3>Transition Milestones Roadmap</h3>
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
                  <div style={{ position: "absolute", left: "20px", top: "10px", bottom: "10px", width: "2px", background: "var(--border-color)", zIndex: 0 }}></div>
                  
                  {selectedPath.milestones.map((milestone) => (
                    <div key={milestone.step} style={{ display: "flex", gap: "20px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", background: "var(--accent)", color: "black", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                        {milestone.step}
                      </div>
                      <div style={{ flex: 1, padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <h4 style={{ margin: 0, color: "var(--text-primary)" }}>{milestone.title}</h4>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>⏱️ {milestone.duration}</span>
                        </div>
                        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>{milestone.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Training recommendations */}
            <div className="sdRightColumnSidebar">
              <div className="sdRightWidgetCard">
                <h4>Recommended Training</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                  {selectedPath.recommendations.map((rec, idx) => (
                    <div key={idx} style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{rec}</span>
                      <button className="btnContinueCourse" style={{ padding: "6px 12px" }} onClick={() => navigate("/courses")}>Enroll</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";
import {
  FaHome, FaBook, FaCodeBranch, FaAward, FaCertificate, FaChartLine,
  FaFileInvoice, FaCog, FaSearch, FaSun, FaMoon, FaArrowLeft,
  FaSignOutAlt, FaBriefcase, FaMapMarkerAlt, FaCheck, FaRobot, FaRocket, FaBolt, FaCode
} from "react-icons/fa";
import "../styles/studentDashboard.css";

import AppLogo from "../components/AppLogo";

export default function JobSearchPage() {
  const { user, xp, logout, themeMode, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [appliedJobs, setAppliedJobs] = useState([]);

  const jobsList = [
    { id: 1, title: "Junior React Developer", company: "DevSolutions Ltd", location: "San Francisco, CA", type: "Full-Time", matchScore: 92, salary: "$85,000 - $105,000", applyUrl: "https://www.linkedin.com/jobs/search/?keywords=React%20Developer" },
    { id: 2, title: "Fullstack Python Engineer", company: "DataSync Labs", location: "Remote", type: "Full-Time", matchScore: 84, salary: "$95,000 - $120,000", applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Python%20Engineer" },
    { id: 3, title: "UI/UX Designer", company: "CreativeStudio Inc", location: "New York, NY", type: "Contract", matchScore: 78, salary: "$60/hr - $75/hr", applyUrl: "https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=UI%20UX%20Designer" },
    { id: 4, title: "DevOps Integration Specialist", company: "CloudCore", location: "San Francisco, CA", type: "Full-Time", matchScore: 65, salary: "$110,000 - $135,000", applyUrl: "https://www.naukri.com/devops-jobs" },
    { id: 5, title: "Software Engineer Intern", company: "Microsoft", location: "Bangalore, India", type: "Internship", matchScore: 95, salary: "₹80K / month", applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Microsoft%20Software%20Engineer%20Intern" },
    { id: 6, title: "Specialist Programmer", company: "Infosys", location: "Hyderabad, India", type: "Full-Time", matchScore: 88, salary: "₹6 - 9 LPA", applyUrl: "https://www.naukri.com/infosys-jobs" }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  const handleApply = (job) => {
    if (appliedJobs.includes(job.id)) return;
    setAppliedJobs([...appliedJobs, job.id]);
    if (job.applyUrl) {
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Filters
  const filteredJobs = jobsList.filter(job => {
    const q = searchQuery.toLowerCase().trim();
    const queryMatch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.location.toLowerCase().includes(q);
    const locMatch = filterLocation === "All" || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    const typeMatch = filterType === "All" || job.type.toLowerCase().includes(filterType.toLowerCase());
    return queryMatch && locMatch && typeMatch;
  });

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
                    className={`sdNavItem ${item.id === "job-search" ? "active" : ""}`}
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
              <input type="text" className="sdSearchInput" placeholder="Quick search jobs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
            <h1>Job Search Portal</h1>
            <p>Connect with companies hiring active learners, with match scores calibrated to your profile skills.</p>
          </div>

          {/* Search Filters Row */}
          <div className="sdWhitePanelCard" style={{ marginBottom: "24px", padding: "16px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <input type="text" placeholder="Search by title, keywords or company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }} />
              </div>
              <div style={{ minWidth: "150px" }}>
                <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <option value="All">All Locations</option>
                  <option value="Remote">Remote</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="New York">New York, NY</option>
                  <option value="Bangalore">Bangalore, India</option>
                  <option value="Hyderabad">Hyderabad, India</option>
                </select>
              </div>
              <div style={{ minWidth: "150px" }}>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <option value="All">All Work Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              {(searchQuery || filterLocation !== "All" || filterType !== "All") && (
                <button
                  onClick={() => { setSearchQuery(""); setFilterLocation("All"); setFilterType("All"); }}
                  style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px" }}
                >
                  Clear Filters 🧹
                </button>
              )}
            </div>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center column: Job results */}
            <div className="sdCenterMainCol">
              <div className="sdWhitePanelCard">
                <h3>Open Opportunities ({filteredJobs.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                  {filteredJobs.length > 0 ? filteredJobs.map(job => (
                    <div key={job.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)", flexWrap: "wrap", gap: "16px" }}>
                      <div>
                        <strong style={{ fontSize: "16px", color: "var(--text-primary)", display: "block" }}>{job.title}</strong>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block", marginTop: "4px" }}>
                          {job.company} • <FaMapMarkerAlt style={{ fontSize: "11px" }} /> {job.location}
                        </span>
                        <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "12px" }}>
                          <span style={{ background: "var(--border-color)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)" }}>{job.type}</span>
                          <span style={{ color: "var(--accent)" }}>{job.salary}</span>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Match Score</span>
                          <span style={{ fontSize: "13px", fontWeight: "bold", padding: "4px 8px", background: "rgba(0,229,255,0.1)", color: "var(--accent)", borderRadius: "4px" }}>
                            {job.matchScore}%
                          </span>
                        </div>
                        
                        <button
                          className={appliedJobs.includes(job.id) ? "btnOutlineOrange" : "btnContinueCourse"}
                          disabled={appliedJobs.includes(job.id)}
                          onClick={() => handleApply(job)}
                          style={{ minWidth: "120px" }}
                        >
                          {appliedJobs.includes(job.id) ? "Applied ✓" : "Easy Apply →"}
                        </button>
                      </div>
                    </div>
                  )) : <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No matching jobs found.</p>}
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

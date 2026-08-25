import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";
import FloatingChatbot from "../components/FloatingChatbot";

import {
  FaHome,
  FaBook,
  FaCodeBranch,
  FaAward,
  FaCertificate,
  FaChartLine,
  FaFileInvoice,
  FaCode,
  FaBolt,
  FaCog,
  FaSearch,
  FaRobot,
  FaRocket,
  FaMapSigns,
  FaCheckCircle,
  FaChevronRight,
  FaArrowRight,
  FaBuilding,
  FaGlobe,
  FaMapMarkerAlt,
  FaUserCheck,
  FaFolderOpen,
  FaTimes,
  FaLinkedin,
  FaBriefcase,
  FaStar,
  FaBookmark,
  FaRegBookmark,
  FaQuestionCircle,
  FaFilter,
  FaUserFriends,
  FaGraduationCap,
  FaComments,
  FaNetworkWired,
  FaClock,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/studentDashboard.css";
import "../styles/opportunityFeedPage.css";

import AppLogo from "../components/AppLogo";

export default function OpportunityFeedPage() {
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

  // Search & Multi-Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("Any");
  const [salaryFilter, setSalaryFilter] = useState("Any");
  const [workTypeFilter, setWorkTypeFilter] = useState("All (Remote/Hybrid/On-site)");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [postedFilter, setPostedFilter] = useState("Any Time");
  const [activeTab, setActiveTab] = useState("job-search");

  // Modals & Interactivity State
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showJoinCommunity, setShowJoinCommunity] = useState(false);
  const [myApplicationsModal, setMyApplicationsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Saved Jobs Array
  const [savedJobIds, setSavedJobIds] = useState([
    "lk1", // Microsoft
    "gl2", // Razorpay
    "lk3", // Amazon
    "i3",  // PhonePe
    "gl3"  // Swiggy
  ]);

  // Applied Jobs Tracker State
  const [appliedList, setAppliedList] = useState([
    { title: "Microsoft - Software Engineer Intern", date: "02 Aug 2026", status: "In Review", platform: "LinkedIn" },
    { title: "TCS Ninja - Graduate Trainee", date: "30 Jul 2026", status: "Shortlisted", platform: "Naukri" },
    { title: "Capgemini - Software Engineer", date: "28 Jul 2026", status: "Assessment", platform: "Glassdoor" },
    { title: "Google - STEP Intern", date: "24 Jul 2026", status: "Interview", platform: "LinkedIn" },
    { title: "Amazon - SDE I", date: "15 Jul 2026", status: "HR Round", platform: "LinkedIn" },
    { title: "Infosys - Specialist Programmer", date: "01 Jul 2026", status: "Offer", platform: "Naukri" }
  ]);

  const userName = user?.full_name || user?.username || "S Roy";
  const currentXp = xp ?? 650;

  // Sidebar Nav Items
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

  // SECTION 1: Featured Jobs from LinkedIn
  const linkedInJobs = [
    {
      id: "lk1",
      company: "Microsoft",
      logoText: "❖",
      logoBg: "#0078D4",
      easyApply: true,
      role: "Software Engineer Intern",
      location: "Bangalore, India",
      stipend: "₹80K - 1.2 LPA",
      tags: ["C++", "Python", "DSA", "OOPs"],
      posted: "2 days ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Microsoft%20Software%20Engineer%20Intern"
    },
    {
      id: "lk2",
      company: "Google",
      logoText: "G",
      logoBg: "#EA4335",
      easyApply: true,
      role: "STEP Intern & AI Engineer",
      location: "Hyderabad, India",
      stipend: "₹70K - 90K / month",
      tags: ["DSA", "Machine Learning", "Python", "AI"],
      posted: "1 day ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Google%20AI%20Engineer"
    },
    {
      id: "lk3",
      company: "Amazon",
      logoText: "a",
      logoBg: "#FF9900",
      easyApply: true,
      role: "Data Scientist & Big Data Engineer",
      location: "Bangalore, India",
      stipend: "₹14 - 22 LPA",
      tags: ["Python", "Spark", "Hadoop", "Data Science"],
      posted: "2 days ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Amazon%20Data%20Scientist"
    },
    {
      id: "lk4",
      company: "Adobe",
      logoText: "A",
      logoBg: "#FF0000",
      easyApply: true,
      role: "Frontend Developer (React 18)",
      location: "Noida, India",
      stipend: "₹9 - 14 LPA",
      tags: ["React", "JavaScript", "CSS3"],
      posted: "2 days ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Adobe%20Frontend%20Developer"
    },
    {
      id: "lk5",
      company: "Atlassian",
      logoText: "A",
      logoBg: "#0052CC",
      easyApply: true,
      role: "Graduate Cloud & DevOps Engineer",
      location: "Remote",
      stipend: "₹9 - 15 LPA",
      tags: ["AWS", "Docker", "Kubernetes", "DevOps"],
      posted: "4 days ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Atlassian%20DevOps"
    },
    {
      id: "lk6",
      company: "Meta",
      logoText: "∞",
      logoBg: "#0668E1",
      easyApply: true,
      role: "NLP Research Scientist (LLMs & Speech)",
      location: "Remote",
      stipend: "₹18 - 30 LPA",
      tags: ["NLP", "PyTorch", "Transformers", "LLM"],
      posted: "1 day ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Meta%20NLP%20Research"
    },
    {
      id: "lk7",
      company: "Cisco",
      logoText: "C",
      logoBg: "#1BA0D7",
      easyApply: true,
      role: "Cybersecurity & Ethical Hacking Specialist",
      location: "Bangalore, India",
      stipend: "₹10 - 16 LPA",
      tags: ["Cybersecurity", "Penetration Testing", "Networks"],
      posted: "3 days ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Cisco%20Cybersecurity"
    },
    {
      id: "lk8",
      company: "Snowflake",
      logoText: "❄",
      logoBg: "#29B5E8",
      easyApply: true,
      role: "Big Data & Analytics Infrastructure Lead",
      location: "Bangalore, India",
      stipend: "₹16 - 25 LPA",
      tags: ["Big Data", "Snowflake", "SQL", "ETL"],
      posted: "2 days ago",
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=Snowflake%20Big%20Data"
    }
  ];

  // SECTION 2: Latest Jobs from Naukri
  const naukriJobs = [
    {
      id: "nk1",
      company: "tcs",
      companyName: "TCS Ninja",
      role: "Graduate Trainee & Systems Engineer",
      stipend: "₹3.36 - 3.6 LPA",
      eligibility: "B.E / B.Tech",
      lastDate: "31 May 2025",
      posted: "2 days ago",
      logoBg: "#004B87",
      applyUrl: "https://www.naukri.com/tcs-jobs"
    },
    {
      id: "nk2",
      company: "Infosys",
      companyName: "Infosys Data Unit",
      role: "Data Analyst & Business Intelligence Specialist",
      stipend: "₹5 - 8 LPA",
      eligibility: "B.E / B.Tech / BCA / MCA",
      lastDate: "25 May 2025",
      posted: "1 day ago",
      logoBg: "#007CC3",
      applyUrl: "https://www.naukri.com/infosys-data-analytics-jobs"
    },
    {
      id: "nk3",
      company: "wipro",
      companyName: "Wipro Cyber",
      role: "Cybersecurity SOC Analyst",
      stipend: "₹4.5 - 7 LPA",
      eligibility: "B.E / B.Tech",
      lastDate: "20 May 2025",
      posted: "2 days ago",
      logoBg: "#006699",
      applyUrl: "https://www.naukri.com/wipro-cybersecurity-jobs"
    },
    {
      id: "nk4",
      company: "cognizant",
      companyName: "Cognizant AI Labs",
      role: "AI & NLP Developer",
      stipend: "₹6 - 9 LPA",
      eligibility: "B.E / B.Tech",
      lastDate: "28 May 2025",
      posted: "2 days ago",
      logoBg: "#1A4788",
      applyUrl: "https://www.naukri.com/cognizant-ai-jobs"
    },
    {
      id: "nk5",
      company: "accenture",
      companyName: "Accenture",
      role: "Accenture Cloud Practitioner & DevOps",
      stipend: "₹4.5 - 6.5 LPA",
      eligibility: "B.E / B.Tech",
      lastDate: "27 May 2025",
      posted: "1 day ago",
      logoBg: "#A100FF",
      applyUrl: "https://www.naukri.com/accenture-jobs"
    },
    {
      id: "nk6",
      company: "swiggy",
      companyName: "Swiggy Mobile",
      role: "Mobile Engineer (Flutter / Android / iOS)",
      stipend: "₹8 - 14 LPA",
      eligibility: "B.E / B.Tech / MCA",
      lastDate: "15 Jun 2025",
      posted: "Just now",
      logoBg: "#FC8019",
      applyUrl: "https://www.naukri.com/swiggy-jobs"
    }
  ];

  // SECTION 3: Glassdoor Recommended Jobs
  const glassdoorJobs = [
    {
      id: "gl1",
      company: "Capgemini",
      role: "Software Engineer & Cloud Architect",
      location: "Bangalore, India",
      rating: "4.4",
      reviews: "12.3K",
      stipend: "₹5.2 - 8 LPA (Glassdoor est.)",
      difficulty: "Medium",
      posted: "2 days ago",
      logoBg: "#0070AD",
      applyUrl: "https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=Capgemini"
    },
    {
      id: "gl2",
      company: "IBM",
      role: "Associate Developer & Quantum AI Researcher",
      location: "Kolkata, India",
      rating: "4.3",
      reviews: "9.8K",
      stipend: "₹5 - 8.5 LPA (Glassdoor est.)",
      difficulty: "Easy",
      posted: "1 day ago",
      logoBg: "#052FAD",
      applyUrl: "https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=IBM%20AI"
    },
    {
      id: "gl3",
      company: "Oracle",
      role: "Java Developer & Microservices Lead",
      location: "Hyderabad, India",
      rating: "4.2",
      reviews: "7.6K",
      stipend: "₹6 - 9 LPA (Glassdoor est.)",
      difficulty: "Medium",
      posted: "3 days ago",
      logoBg: "#F80000",
      applyUrl: "https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=Oracle"
    },
    {
      id: "gl4",
      company: "NVIDIA",
      role: "Deep Learning & Autonomous AI Engineer",
      location: "Pune, India",
      rating: "4.8",
      reviews: "14.1K",
      stipend: "₹18 - 28 LPA",
      difficulty: "Hard",
      posted: "1 day ago",
      logoBg: "#76B900",
      applyUrl: "https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=NVIDIA%20Deep%20Learning"
    },
    {
      id: "gl5",
      company: "Databricks",
      role: "Data Analytics & Machine Learning Engineer",
      location: "Remote",
      rating: "4.7",
      reviews: "3.2K",
      stipend: "₹15 - 24 LPA",
      difficulty: "Hard",
      posted: "Just now",
      logoBg: "#FF3621",
      applyUrl: "https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=Databricks"
    }
  ];

  // Live Multi-Filter Calculation
  const filterJobItem = (job) => {
    const titleOrRole = (job.role || job.companyName || job.title || "").toLowerCase();
    const company = (job.company || job.companyName || "").toLowerCase();
    const tagsStr = (job.tags || []).join(" ").toLowerCase();
    const location = (job.location || "").toLowerCase();
    const stipend = (job.stipend || "").toLowerCase();
    const posted = (job.posted || "").toLowerCase();

    // 1. Search Query (role, company, skills, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = titleOrRole.includes(q) || company.includes(q) || tagsStr.includes(q) || location.includes(q);
      if (!matchQuery) return false;
    }

    // 2. Location Filter
    if (locationFilter !== "All") {
      const targetLoc = locationFilter.toLowerCase();
      if (targetLoc === "remote" && !location.includes("remote")) return false;
      if (targetLoc !== "remote" && !location.includes(targetLoc.split(",")[0].trim())) return false;
    }

    // 3. Company Filter
    if (companyFilter !== "All") {
      const targetComp = companyFilter.toLowerCase();
      if (!company.includes(targetComp)) return false;
    }

    // 4. Work Type Filter
    if (workTypeFilter !== "All (Remote/Hybrid/On-site)") {
      if (workTypeFilter === "Remote" && !location.includes("remote")) return false;
      if (workTypeFilter === "Hybrid" && !location.includes("hybrid")) return false;
      if (workTypeFilter === "On-site" && (location.includes("remote") || location.includes("hybrid"))) return false;
    }

    // 5. Experience Filter
    if (expFilter !== "Any") {
      const isIntern = titleOrRole.includes("intern") || titleOrRole.includes("fresher") || titleOrRole.includes("trainee") || titleOrRole.includes("step") || titleOrRole.includes("genc") || titleOrRole.includes("ase");
      if (expFilter === "Intern / Fresher" && !isIntern) return false;
      if (expFilter === "0-1 Yr" && !(isIntern || titleOrRole.includes("sde i") || titleOrRole.includes("engineer"))) return false;
      if (expFilter === "1-3 Yrs" && isIntern && !titleOrRole.includes("sde")) return false;
    }

    // 6. Salary Filter
    if (salaryFilter !== "Any") {
      if (salaryFilter === "₹3 - 6 LPA" && (stipend.includes("12 - 18") || stipend.includes("9 - 14") || stipend.includes("80k"))) return false;
      if (salaryFilter === "₹6 - 12 LPA" && !(stipend.includes("6") || stipend.includes("8") || stipend.includes("9") || stipend.includes("70k") || stipend.includes("80k"))) return false;
      if (salaryFilter === "₹12 - 18 LPA" && !(stipend.includes("12") || stipend.includes("14") || stipend.includes("15") || stipend.includes("18"))) return false;
    }

    // 7. Posted Within Filter
    if (postedFilter !== "Any Time") {
      if (postedFilter === "Past 24 Hours" && !(posted.includes("1 day") || posted.includes("24 hour"))) return false;
      if (postedFilter === "Past Week" && (posted.includes("month") || posted.includes("30 days"))) return false;
    }

    return true;
  };

  const filteredLinkedInJobs = linkedInJobs.filter(filterJobItem);
  const filteredNaukriJobs = naukriJobs.filter(filterJobItem);
  const filteredGlassdoorJobs = glassdoorJobs.filter(filterJobItem);

  // Saved Jobs List Items for Sidebar Widget
  const savedJobsMaster = [
    { id: "lk1", title: "Software Engineer Intern", company: "Microsoft", logoBg: "#0078D4", logoText: "❖" },
    { id: "gl2", title: "Backend Developer", company: "Razorpay", logoBg: "#0C2340", logoText: "R" },
    { id: "lk3", title: "SDE I", company: "Amazon", logoBg: "#FF9900", logoText: "a" },
    { id: "i3",  title: "Frontend Developer", company: "PhonePe", logoBg: "#5F259F", logoText: "Pe" },
    { id: "gl3", title: "Data Analyst", company: "Swiggy", logoBg: "#FC8019", logoText: "S" }
  ];

  // Upcoming Deadlines List for Sidebar Widget
  const upcomingDeadlines = [
    { title: "TCS Ninja", daysLeft: "Closes in 5 days", logoBg: "#004B87" },
    { title: "Infosys Specialist Programmer", daysLeft: "Closes in 7 days", logoBg: "#007CC3" },
    { title: "Wipro Project Engineer", daysLeft: "Closes in 10 days", logoBg: "#006699" }
  ];

  // Handle Apply Click
  const handleApplyJob = (jobTitle, platform, applyUrl) => {
    // Add to applied list if not already present
    if (!appliedList.some(item => item.title.includes(jobTitle))) {
      setAppliedList(prev => [
        { title: `${jobTitle}`, date: "Today", status: "Applied", platform },
        ...prev
      ]);
    }
    setToastMessage(`🎉 Applied to ${jobTitle} via ${platform}! Redirecting...`);
    setTimeout(() => setToastMessage(""), 3500);
    window.open(applyUrl, "_blank", "noopener,noreferrer");
  };

  // Toggle Bookmark / Save Job
  const toggleSaveJob = (jobId, jobTitle) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
      setToastMessage(`Removed ${jobTitle} from Saved Jobs.`);
    } else {
      setSavedJobIds(prev => [...prev, jobId]);
      setToastMessage(`🔖 Saved ${jobTitle} to your bookmarked jobs!`);
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setLocationFilter("All");
    setExpFilter("Any");
    setSalaryFilter("Any");
    setWorkTypeFilter("All (Remote/Hybrid/On-site)");
    setCompanyFilter("All");
    setPostedFilter("Any Time");
    setToastMessage("Filters cleared.");
    setTimeout(() => setToastMessage(""), 2000);
  };

  return (
    <div className={`sdDashboardWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <PaperPlaneCursor />
      <Background />

      <div className="sdMainContainer">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="sdLeftSidebar">
          <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <AppLogo height="58px" />
          </Link>

          <nav className="sdNavList">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === "opportunity-feed" && activeTab === "job-search");
              return (
                <button
                  key={item.id}
                  className={`sdNavItem ${isActive ? "active" : ""}`}
                  onClick={() => {
                    if (item.id === "dashboard") navigate("/student-home");
                    else if (item.id === "courses") navigate("/courses");
                    else if (item.id === "learning-paths") navigate("/learning-paths");
                    else if (item.id === "ai-buddy") navigate("/ai-study-buddy");
                    else if (item.id === "career-roadmap") navigate("/career-roadmap");
                    else if (item.id === "opportunity-feed") { setActiveTab("job-search"); navigate("/opportunity-feed"); }
                    else if (item.id === "daily-quests") navigate("/daily-quests");
                    else if (item.id === "badges") navigate("/badges");
                    else if (item.id === "certificates") navigate("/certificate");
                    else if (item.id === "progress") navigate("/progress");
                    else if (item.id === "resume") navigate("/resume-builder");
                    else if (item.id === "code-arena") navigate("/code-arena");
                    else if (item.id === "settings") navigate("/settings");
                    else navigate(`/${item.id}`);
                  }}
                >
                  <span className="navIcon">{item.icon}</span>
                  <span className="navLabel">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sdSidebarBottomSection">
            <div className="sdRocketIllustrationBox">
              <span className="sdRocketEmoji">🚀</span>
            </div>
            <div className="sdSidebarFooterControls">
              <button className="sdThemeToggleBtn" onClick={toggleTheme}>
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              <span className="sdControlDivider">|</span>
              <button className="sdCollapseBtn">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN BODY AREA ── */}
        <div className="ofpRightBodyArea">
          
          {/* Top Header Bar */}
          <header className="sdTopHeaderBar">
            <div className="sdSearchWrapper">
              <FaSearch className="sdSearchIcon" />
              <input
                type="text"
                className="sdSearchInput"
                placeholder="Search for courses, skills, discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Toast Message Notification */}
          {toastMessage && (
            <div className="ofpToastNotification">
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ── JOB SEARCH PORTAL HERO HEADER (1-TO-1 MATCH TO MOCKUP) ── */}
          <div className="jspHeaderRow">
            <div className="jspTitleBadgeArea">
              <div className="jspIconNodeBadge">
                <FaNetworkWired />
              </div>
              <div>
                <h1 className="jspMainTitle">Job Search Portal</h1>
                <p className="jspSubTitle">
                  Find internships, fresher jobs and placement opportunities from top platforms.
                </p>
              </div>
            </div>

            <button className="jspHowItWorksBtn" onClick={() => setShowHowItWorks(true)}>
              <span>How Job Search Works?</span>
              <FaQuestionCircle />
            </button>
          </div>

          {/* ── MULTI-FILTER BAR (1-TO-1 MATCH TO MOCKUP) ── */}
          <section className="jspFilterSection">
            <div className="jspSearchInputRow">
              <FaSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Search by role, company, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="jspFiltersGrid">
              <div className="jspFilterItem">
                <label>Location</label>
                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Bangalore, India">Bangalore, India</option>
                  <option value="Hyderabad, India">Hyderabad, India</option>
                  <option value="Noida, India">Noida, India</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="jspFilterItem">
                <label>Experience</label>
                <select value={expFilter} onChange={(e) => setExpFilter(e.target.value)}>
                  <option value="Intern / Fresher">Intern / Fresher</option>
                  <option value="0-1 Yr">0 - 1 Yr</option>
                  <option value="1-3 Yrs">1 - 3 Yrs</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div className="jspFilterItem">
                <label>Salary</label>
                <select value={salaryFilter} onChange={(e) => setSalaryFilter(e.target.value)}>
                  <option value="Any">Any</option>
                  <option value="₹3 - 6 LPA">₹3 - 6 LPA</option>
                  <option value="₹6 - 12 LPA">₹6 - 12 LPA</option>
                  <option value="₹12 - 18 LPA">₹12 - 18 LPA</option>
                </select>
              </div>

              <div className="jspFilterItem">
                <label>Work Type</label>
                <select value={workTypeFilter} onChange={(e) => setWorkTypeFilter(e.target.value)}>
                  <option value="All (Remote/Hybrid/On-site)">All (Remote/Hybrid/On-site)</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="jspFilterItem">
                <label>Company</label>
                <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Adobe">Adobe</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                </select>
              </div>

              <div className="jspFilterItem">
                <label>Posted Within</label>
                <select value={postedFilter} onChange={(e) => setPostedFilter(e.target.value)}>
                  <option value="Any Time">Any Time</option>
                  <option value="Past 24 Hours">Past 24 Hours</option>
                  <option value="Past Week">Past Week</option>
                  <option value="Past Month">Past Month</option>
                </select>
              </div>

              <button className="jspClearFiltersLink" onClick={handleClearFilters}>
                Clear Filters 🧹
              </button>
            </div>
          </section>

          {/* ── MAIN WORKSPACE ── */}
          <div className="jspMainGridContainer" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
            
            {/* LEFT MAIN CONTENT COLUMN */}
            <div className="jspLeftContentCol">
              
              {/* SECTION 1: Featured Jobs from LinkedIn */}
              <div className="jspPlatformSection">
                <div className="jspSectionHeader">
                  <div className="jspPlatformTitleBadge">
                    <span className="jspLinkedinLogoBadge">in</span>
                    <h2>Featured Jobs from LinkedIn</h2>
                  </div>
                  <button className="jspViewAllLink" onClick={() => window.open("https://www.linkedin.com/jobs", "_blank")}>
                    View All LinkedIn Jobs &rarr;
                  </button>
                </div>

                <div className="jspHorizontalCardsRow">
                  {filteredLinkedInJobs.length > 0 ? filteredLinkedInJobs.map((job) => (
                    <div key={job.id} className="jspJobCard linkedinCard">
                      <div className="jspCardTopRow">
                        <div className="jspCompanyLogoBox" style={{ background: job.logoBg }}>
                          {job.logoText}
                        </div>
                        {job.easyApply && <span className="jspEasyApplyBadge">Easy Apply</span>}
                      </div>

                      <h3 className="jspJobRoleTitle">{job.role}</h3>
                      <span className="jspJobCompanySub">{job.company}</span>
                      <span className="jspJobLocText">{job.location}</span>
                      <div className="jspJobSalaryText">{job.stipend}</div>

                      <div className="jspSkillTagsPills">
                        {job.tags.map((tag, i) => (
                          <span key={i} className="jspSkillPill">{tag}</span>
                        ))}
                      </div>

                      <div className="jspCardBottomRow">
                        <span className="jspPostedDate">{job.posted}</span>
                        <button
                          className="jspApplyBtn linkedinBtn"
                          onClick={() => handleApplyJob(job.role, "LinkedIn", job.applyUrl)}
                        >
                          <span className="inIcon">in</span> Apply on LinkedIn &rarr;
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div style={{ color: "var(--text-secondary)", fontSize: "14px", padding: "16px 0" }}>
                      No matching LinkedIn opportunities found for selected filters.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: Latest Jobs from Naukri */}
              <div className="jspPlatformSection" style={{ marginTop: "32px" }}>
                <div className="jspSectionHeader">
                  <div className="jspPlatformTitleBadge">
                    <span className="jspNaukriLogoBadge">K</span>
                    <h2>Latest Jobs from Naukri</h2>
                  </div>
                  <button className="jspViewAllLink" onClick={() => window.open("https://www.naukri.com/", "_blank")}>
                    View All Naukri Jobs &rarr;
                  </button>
                </div>

                <div className="jspHorizontalCardsRow">
                  {filteredNaukriJobs.length > 0 ? filteredNaukriJobs.map((job) => (
                    <div key={job.id} className="jspJobCard naukriCard">
                      <div className="jspCardTopRow">
                        <div className="jspCompanyLogoBox" style={{ background: job.logoBg, fontSize: "12px", color: "#fff" }}>
                          {job.companyName.substring(0, 3)}
                        </div>
                        <span className="jspPostedDate">{job.posted}</span>
                      </div>

                      <h3 className="jspJobRoleTitle">{job.companyName}</h3>
                      <span className="jspJobRoleSub">{job.role}</span>
                      <div className="jspJobSalaryText">{job.stipend}</div>
                      
                      <div className="jspNaukriDetailsBox">
                        <span>Eligibility: {job.eligibility}</span>
                        <span>Last Date: {job.lastDate}</span>
                      </div>

                      <button
                        className="jspApplyBtn naukriOutlineBtn"
                        onClick={() => handleApplyJob(job.role, "Naukri", job.applyUrl)}
                      >
                        Apply on Naukri &rarr;
                      </button>
                    </div>
                  )) : (
                    <div style={{ color: "var(--text-secondary)", fontSize: "14px", padding: "16px 0" }}>
                      No matching Naukri opportunities found for selected filters.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Glassdoor Recommended Jobs */}
              <div className="jspPlatformSection" style={{ marginTop: "32px" }}>
                <div className="jspSectionHeader">
                  <div className="jspPlatformTitleBadge">
                    <span className="jspGlassdoorLogoBadge">G</span>
                    <h2>Glassdoor Recommended Jobs</h2>
                  </div>
                  <button className="jspViewAllLink" onClick={() => window.open("https://www.glassdoor.co.in/", "_blank")}>
                    View All Glassdoor Jobs &rarr;
                  </button>
                </div>

                <div className="jspHorizontalCardsRow">
                  {filteredGlassdoorJobs.length > 0 ? filteredGlassdoorJobs.map((job) => (
                    <div key={job.id} className="jspJobCard glassdoorCard">
                      <div className="jspCardTopRow">
                        <div className="jspCompanyLogoBox" style={{ background: job.logoBg, color: "#fff", fontSize: "14px" }}>
                          {job.company.substring(0, 2)}
                        </div>
                        <span className="jspPostedDate">{job.posted}</span>
                      </div>

                      <h3 className="jspJobRoleTitle">{job.company}</h3>
                      <span className="jspJobRoleSub">{job.role}</span>
                      <span className="jspJobLocText">{job.location}</span>
                      
                      <div className="jspGlassdoorRatingRow">
                        <span className="ratingBadge">{job.rating} ★</span>
                        <span className="reviewsText">{job.reviews} Reviews</span>
                      </div>

                      <div className="jspJobSalaryText">{job.stipend}</div>

                      <div className="jspDiffBadgeRow">
                        <span className={`diffBadge ${job.difficulty.toLowerCase()}`}>
                          {job.difficulty} Difficulty
                        </span>
                      </div>

                      <button
                        className="jspApplyBtn glassdoorOutlineBtn"
                        onClick={() => handleApplyJob(job.role, "Glassdoor", job.applyUrl)}
                      >
                        Apply on Glassdoor &rarr;
                      </button>
                    </div>
                  )) : (
                    <div style={{ color: "var(--text-secondary)", fontSize: "14px", padding: "16px 0" }}>
                      No matching Glassdoor opportunities found for selected filters.
                    </div>
                  )}
                </div>
              </div>


            </div>


          </div>

        </div>
      </div>

      {/* ── MODAL 1: HOW JOB SEARCH WORKS ── */}
      {showHowItWorks && (
        <div className="modalOverlay" onClick={() => setShowHowItWorks(false)}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>💡 How Job Search Works?</h3>
              <button className="modalCloseBtn" onClick={() => setShowHowItWorks(false)}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <div className="howItWorksSteps">
                <div className="stepCard">
                  <span className="stepNum">1</span>
                  <div>
                    <h4>Browse Multi-Platform Listings</h4>
                    <p>Access curated internships and full-time roles aggregated from LinkedIn, Naukri, Glassdoor, and campus hiring drives.</p>
                  </div>
                </div>
                <div className="stepCard">
                  <span className="stepNum">2</span>
                  <div>
                    <h4>Instant Easy Apply & Track</h4>
                    <p>Apply directly with one click or link outward, while automatically logging your application in your SkillSphere Tracker pipeline.</p>
                  </div>
                </div>
                <div className="stepCard">
                  <span className="stepNum">3</span>
                  <div>
                    <h4>AI Match & Resume Preparation</h4>
                    <p>Check your 92% AI Job Match score and optimize your resume to pass Applicant Tracking Systems (ATS).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: JOIN CAREER COMMUNITY ── */}
      {showJoinCommunity && (
        <div className="modalOverlay" onClick={() => setShowJoinCommunity(false)}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>🚀 SkillSphere Career Community & Referrals</h3>
              <button className="modalCloseBtn" onClick={() => setShowJoinCommunity(false)}><FaTimes /></button>
            </div>
            <div className="modalBody" style={{ textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                Connect with 12,000+ SkillSphere alumni working at Microsoft, Google, Amazon, TCS and get employee referrals directly!
              </p>
              <button
                className="jspApplyBtn linkedinBtn"
                style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                onClick={() => {
                  setShowJoinCommunity(false);
                  setToastMessage("🎉 Welcome to the SkillSphere Referral & Alumni Network!");
                  setTimeout(() => setToastMessage(""), 3000);
                }}
              >
                Confirm & Join Discord / Telegram Network
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: MY APPLICATIONS TRACKER LIST ── */}
      {myApplicationsModal && (
        <div className="modalOverlay" onClick={() => setMyApplicationsModal(false)}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>📋 Tracked Applications ({appliedList.length})</h3>
              <button className="modalCloseBtn" onClick={() => setMyApplicationsModal(false)}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <ul className="appliedList">
                {appliedList.map((item, idx) => (
                  <li key={idx} className="appliedItem">
                    <div>
                      <strong>{item.title}</strong>
                      <span className="appDate">{item.date} • {item.platform}</span>
                    </div>
                    <span className="appStatus">{item.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <FloatingChatbot />
      <StudentFooter />
    </div>
  );
}

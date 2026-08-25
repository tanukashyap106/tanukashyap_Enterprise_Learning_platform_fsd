import React, { useState, useEffect } from "react";
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
  FaSignOutAlt, FaRocket, FaBolt, FaCode, FaRobot, FaCalendarCheck, FaComments, FaGraduationCap, FaTimes
} from "react-icons/fa";
import "../styles/studentDashboard.css";

import AppLogo from "../components/AppLogo";

export default function ServicesCatalogPage() {
  const { user, xp, logout, themeMode, toggleTheme, authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  const [selectedService, setSelectedService] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      if (!authenticatedFetch) return;
      try {
        const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`);
        const data = await response.json();
        if (response.ok && data.success) {
          setBookings(data.bookings || []);
        } else {
          // fallback local storage
          const local = JSON.parse(localStorage.getItem(`skillsphere_bookings_${user?.email || "guest"}`) || "[]");
          setBookings(local);
        }
      } catch (e) {
        const local = JSON.parse(localStorage.getItem(`skillsphere_bookings_${user?.email || "guest"}`) || "[]");
        setBookings(local);
      }
    };
    fetchBookings();
  }, [user, authenticatedFetch]);

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

  const premiumServices = [
    { id: "mentor", title: "1-on-1 Live Mentorship", desc: "Book an intensive 45-minute live review with leading FAANG engineers and designers.", price: "₹1,499 / session", rawPrice: 1499, icon: "🧑‍🏫", tag: "Hot" },
    { id: "resume", title: "Priority Resume Critique", desc: "Industry-grade reviews of your resume & GitHub portfolio highlighting gaps to close.", price: "₹799 / review", rawPrice: 799, icon: "📄", tag: "Popular" },
    { id: "interview", title: "Interactive Mock Interviews", desc: "Rigorous technical or behavioral mock interview with actionable feedback reports.", price: "₹2,499 / session", rawPrice: 2499, icon: "💬", tag: "Recommended" },
    { id: "eval", title: "Direct Code/Design Audits", desc: "Have a Senior Architect deep-dive review your projects, APIs, and folder structure.", price: "₹1,299 / audit", rawPrice: 1299, icon: "🔍", tag: "New" },
    { id: "doubts", title: "Urgent Doubt Clearance", desc: "Connect within minutes with a teaching assistant to unblock coding issues.", price: "₹399 / ticket", rawPrice: 399, icon: "⚡", tag: "On-demand" }
  ];

  const isAlreadyBooked = (serviceTitle) => {
    return bookings.some(b => 
      (b.serviceTitle || b.service_title || "").toLowerCase() === serviceTitle.toLowerCase()
    );
  };

  const uniqueBookings = (() => {
    const seen = new Set();
    return bookings.filter(b => {
      const title = (b.serviceTitle || b.service_title || "").toLowerCase();
      if (seen.has(title)) {
        return false;
      }
      seen.add(title);
      return true;
    });
  })();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return;
    
    const userKey = user?.email || user?.username || "student@skillsphere.com";
    const userName = user?.full_name || user?.username || user?.name || "Student User";

    const newBooking = {
      id: `SB-${Date.now()}`,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      price: selectedService.price,
      rawPrice: selectedService.rawPrice || 999,
      studentName: userName,
      studentEmail: userKey,
      date: bookingDate,
      time: bookingTime,
      status: "scheduled",
      bookedAt: new Date().toLocaleString()
    };

    // 1. Try sending to Spring Boot Backend API
    try {
      if (authenticatedFetch) {
        await authenticatedFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: selectedService.id,
            serviceTitle: selectedService.title,
            date: bookingDate,
            time: bookingTime
          }),
        });
      }
    } catch (err) {
      console.warn("Backend booking API notice:", err);
    }

    // 2. Always sync with shared Admin & Local Storage
    try {
      const allAdminBookings = JSON.parse(localStorage.getItem("skillsphere_admin_service_bookings") || "[]");
      allAdminBookings.unshift(newBooking);
      localStorage.setItem("skillsphere_admin_service_bookings", JSON.stringify(allAdminBookings));

      const localUserBookings = JSON.parse(localStorage.getItem(`skillsphere_bookings_${userKey}`) || "[]");
      localUserBookings.unshift(newBooking);
      localStorage.setItem(`skillsphere_bookings_${userKey}`, JSON.stringify(localUserBookings));

      // Trigger custom sync event for all tabs (Admin & Student)
      window.dispatchEvent(new CustomEvent("skillsphere_sync_event"));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }

    setBookings(prev => [newBooking, ...prev]);
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedService(null);
      setBookingSuccess(false);
      setBookingDate("");
      setBookingTime("");
    }, 2000);
  };

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
                    className={`sdNavItem ${item.id === "services-catalog" ? "active" : ""}`}
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
              <input type="text" className="sdSearchInput" placeholder="Search catalog services..." />
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
            <h1>Services & Catalog</h1>
            <p>Combine core learning programs with personal career acceleration services.</p>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center Column: Catalog & Bookable Services */}
            <div className="sdCenterMainCol">
              <div className="sdWhitePanelCard" style={{ marginBottom: "24px" }}>
                <h3>Premium Student & Career Services</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
                  Unlock exclusive coaching, critiques, and fast-track guidance directly from vetted experts.
                </p>

                <div style={{ display: "grid", gridTemplateRows: "repeat(auto-fit, 1fr)", gap: "16px" }}>
                  {premiumServices.map((service) => (
                    <div key={service.id} style={{ display: "flex", gap: "20px", padding: "20px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontSize: "36px", background: "var(--border-color)", padding: "10px", borderRadius: "10px" }}>{service.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <h4 style={{ margin: 0, color: "var(--text-primary)" }}>{service.title}</h4>
                          <span style={{ fontSize: "10px", padding: "2px 8px", background: "var(--accent)", color: "black", borderRadius: "20px", fontWeight: "bold" }}>{service.tag}</span>
                        </div>
                        <p style={{ margin: "6px 0 0 0", color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5" }}>{service.desc}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "bold", color: "var(--text-primary)", fontSize: "16px", marginBottom: "8px" }}>{service.price}</div>
                        {isAlreadyBooked(service.title) ? (
                          <button className="btnContinueCourse" disabled style={{ opacity: 0.6, cursor: "not-allowed", background: "var(--border-color)", color: "var(--text-secondary)" }}>Booked</button>
                        ) : (
                          <button className="btnContinueCourse" onClick={() => setSelectedService(service)}>Book Now</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standard Catalog Info card */}
              <div className="sdWhitePanelCard">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>Core Course Catalog</h3>
                  <button className="btnOutlineOrange" onClick={() => navigate("/courses")}>Go to Courses Page →</button>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px" }}>
                  Access our full curriculum spanning React, Python, Data Structures, System Design, Node.js, and Figma UI/UX.
                </p>
              </div>
            </div>

            {/* Right Column: Scheduled Services list */}
            <div className="sdRightColumnSidebar">
              <div className="sdRightWidgetCard">
                <h4>Your Scheduled Bookings</h4>
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {uniqueBookings.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>No sessions booked yet.</p>
                  ) : (
                    uniqueBookings.map((b, idx) => (
                      <div key={idx} style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                        <strong style={{ display: "block", color: "var(--text-primary)", fontSize: "13px" }}>{b.serviceTitle || b.service_title}</strong>
                        <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", marginTop: "4px" }}>📅 {b.date} at {b.time}</span>
                        <span style={{ fontSize: "10px", color: "#10b981", display: "inline-block", marginTop: "8px", fontWeight: "bold" }}>● Confirmed</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {selectedService && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: "30px", borderRadius: "16px", maxWidth: "450px", width: "100%", margin: "auto", position: "relative" }}>
            <button style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--text-primary)", fontSize: "18px", cursor: "pointer" }} onClick={() => setSelectedService(null)}><FaTimes /></button>
            
            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <span style={{ fontSize: "48px" }}>🎉</span>
                <h3 style={{ color: "var(--text-primary)", margin: "16px 0 8px 0" }}>Booking Confirmed!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Your session has been registered successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <h3 style={{ color: "var(--text-primary)", margin: "0 0 8px 0" }}>Schedule {selectedService.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "0 0 20px 0" }}>Rate: {selectedService.price}</p>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Full Name</label>
                  <input type="text" value={user?.full_name || ""} disabled style={{ width: "100%", padding: "10px", background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", borderRadius: "8px" }} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Preferred Date</label>
                  <input type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }} />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Preferred Time</label>
                  <input type="time" required value={bookingTime} onChange={e => setBookingTime(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }} />
                </div>

                <button type="submit" className="btnSolidOrangeClaim" style={{ width: "100%" }}>Confirm Appointment</button>
              </form>
            )}
          </div>
        </div>
      )}

      <StudentFooter />
    </div>
  );
}

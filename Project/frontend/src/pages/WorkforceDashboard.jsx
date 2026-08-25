import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { askGeminiAI, formatAiResponseText } from "../services/geminiService";
import AppLogo from "../components/AppLogo";
import NotificationDropdown from "../components/NotificationDropdown";
import Background from "../components/Background";
import {
  FaHome,
  FaUsers,
  FaUserFriends,
  FaShieldAlt,
  FaLaptopCode,
  FaChartLine,
  FaClock,
  FaHeart,
  FaChartBar,
  FaCog,
  FaSearch,
  FaBell,
  FaCommentAlt,
  FaCalendarAlt,
  FaBars,
  FaHeadset,
  FaArrowRight,
  FaStar,
  FaBookOpen,
  FaBullseye,
  FaUserPlus,
  FaClipboardCheck,
  FaCloud,
  FaRobot,
  FaCode,
  FaComments,
  FaSignOutAlt,
  FaUserCheck,
  FaUserTimes,
  FaPlaneDeparture,
  FaFileExport,
  FaBuilding,
  FaUserCog,
  FaSlidersH,
  FaTimes,
  FaFilePdf,
  FaFileExcel,
  FaCheck,
  FaPlus,
  FaBolt,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGlobe,
  FaEllipsisV,
  FaBullhorn,
  FaHeadphones,
  FaSlidersH as FaFilterIcon,
  FaBriefcase,
  FaAward,
  FaTrophy,
  FaSmile,
  FaLightbulb,
  FaRocket,
  FaBalanceScale,
  FaSun,
  FaMoon,
  FaPaperPlane
} from "react-icons/fa";

import workforcePortalImg from "../assets/workforce_portal_illustration.png";
import workHubHeroImg from "../assets/work_hub_hero_illustration.png";
import workforceLoginImg from "../assets/workforce_login_illustration.png";
import featureHeroImg from "../assets/feature_hero_illustration.png";
import sandboxHeroImg from "../assets/sandbox_hero_illustration.png";
import studentDashboardHeroImg from "../assets/student_dashboard_hero_illustration.png";
import studentHubGirlImg from "../assets/student_hub_girl_illustration.png";
import engagementHeroImg from "../assets/engagement_hero_illustration.png";
import womanWorkingImg from "../assets/woman_working_computer_illustration.png";
import darkWorkforcePortalImg from "../assets/dark_workforce_portal_illustration.png";
import darkWorkHubHeroImg from "../assets/dark_work_hub_hero_illustration.png";
import darkHeroImg from "../assets/dark_hero_illustration.png";
import darkSandboxHeroImg from "../assets/dark_sandbox_hero_illustration.png";
import darkFeatureHeroImg from "../assets/dark_feature_hero_illustration.png";
import darkStudentDashboardHeroImg from "../assets/dark_student_dashboard_hero_illustration.png";
import darkReactLearningHero from "../assets/dark_react_learning_hero.png";

import "../styles/workforceDashboard.css";
import "../styles/workforceHome.css";

// ─── 2026 Indian Public Holidays ─────────────────────────────────────────────
const HOLIDAYS_2026 = [
  { date: "2026-01-01", name: "New Year's Day",                  type: "national" },
  { date: "2026-01-14", name: "Makar Sankranti / Pongal",         type: "national" },
  { date: "2026-01-26", name: "Republic Day",                     type: "national" },
  { date: "2026-02-26", name: "Maha Shivaratri",                  type: "regional" },
  { date: "2026-03-25", name: "Holi",                             type: "national" },
  { date: "2026-04-02", name: "Ram Navami",                       type: "national" },
  { date: "2026-04-03", name: "Good Friday",                      type: "national" },
  { date: "2026-04-14", name: "Dr. Ambedkar Jayanti / Baisakhi",  type: "national" },
  { date: "2026-05-01", name: "Labour Day / Maharashtra Day",     type: "national" },
  { date: "2026-05-27", name: "Buddha Purnima",                   type: "national" },
  { date: "2026-06-27", name: "Eid al-Adha",                      type: "national" },
  { date: "2026-08-15", name: "Independence Day",                 type: "national" },
  { date: "2026-08-26", name: "Janmashtami",                      type: "national" },
  { date: "2026-09-10", name: "Ganesh Chaturthi",                 type: "regional" },
  { date: "2026-10-02", name: "Gandhi Jayanti",                   type: "national" },
  { date: "2026-10-20", name: "Dussehra",                         type: "national" },
  { date: "2026-10-19", name: "Diwali (Lakshmi Puja)",            type: "national" },
  { date: "2026-10-21", name: "Bhai Dooj",                        type: "regional" },
  { date: "2026-11-10", name: "Guru Nanak Jayanti",               type: "national" },
  { date: "2026-11-14", name: "Children's Day",                   type: "national" },
  { date: "2026-12-25", name: "Christmas Day",                    type: "national" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function WorkforceDashboard() {
  const { user, logout, authenticatedFetch, themeMode, toggleTheme } = useAuth();
  const { submitLeaveRequest, workforce } = useAdmin();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const isDarkMode = themeMode === "dark";

  // Sidebar & Navigation State
  const [activeTab, setActiveTab] = useState("Overview");
  const [careerSubTab, setCareerSubTab] = useState("Career Path");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [overviewFilter, setOverviewFilter] = useState("This Month");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Leave Request Form State
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [newLeaveForm, setNewLeaveForm] = useState({
    leaveType: "Sick Leave",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ""
  });

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    if (!newLeaveForm.reason.trim()) return;

    const start = new Date(newLeaveForm.startDate);
    const end = new Date(newLeaveForm.endDate);
    const diffTime = Math.max(0, end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    submitLeaveRequest({
      employeeName: user?.fullName || user?.name || "Alex Vance",
      employeeEmail: user?.email || "alex@skillsphere.com",
      role: user?.role || "EMPLOYEE",
      dept: "Engineering",
      leaveType: newLeaveForm.leaveType,
      startDate: newLeaveForm.startDate,
      endDate: newLeaveForm.endDate,
      days: days || 1,
      reason: newLeaveForm.reason
    });

    setShowApplyLeaveModal(false);
    setNewLeaveForm({
      leaveType: "Sick Leave",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ""
    });
    alert("✓ Leave request submitted successfully! Admin will review your request under Leave Approvals.");
  };

  // Employee tab filter & search
  const [empSearch, setEmpSearch] = useState("");

  // Teams tab state
  const [teamSearch, setTeamSearch] = useState("");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", desc: "", lead: "", dept: "Engineering", members: 10 });
  const [teamsList, setTeamsList] = useState([]);

  // Engagement Tab State matching reference mockup
  const [engagementDeptFilter, setEngagementDeptFilter] = useState("All Departments");
  const [engagementInitiatives, setEngagementInitiatives] = useState([]);

   // Attendance Page State
  const [attendanceDeptFilter, setAttendanceDeptFilter] = useState("All Departments");
  const [attendanceDateFilter, setAttendanceDateFilter] = useState("May 1 – May 31, 2025");
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [assessmentsList, setAssessmentsList] = useState([]);

  // Performance Tab Filters
  const [perfTimeframe, setPerfTimeframe] = useState("Monthly");
  const [hoveredPerfPoint, setHoveredPerfPoint] = useState(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState(null);

  // Reports & Analytics Page State
  const [reportCatFilter, setReportCatFilter] = useState("All Reports");
  const [reportSearch, setReportSearch] = useState("");
  const [reportsList, setReportsList] = useState([]);

  // Workforce Settings State
  const [settingsActiveSubTab, setSettingsActiveSubTab] = useState("General");
  const [settingsForm, setSettingsForm] = useState({
    companyName: "",
    companySlug: "",
    timezone: "",
    currency: "",
    adminEmail: "",
    fiscalStart: "",
    enforce2FA: false,
    enforceSSO: false,
    passwordRotation: "",
    ipWhitelist: "",
    sessionTimeout: "",
    emailNotifications: false,
    slackAlerts: false,
    reviewReminders: false,
    assessmentReminders: false,
    webhookUrl: ""
  });

  const getTeamIcon = (dept) => {
    const d = dept?.toLowerCase() || "";
    if (d.includes("engineering")) return <FaCode />;
    if (d.includes("marketing")) return <FaBullhorn />;
    if (d.includes("operation")) return <FaHeadphones />;
    if (d.includes("data")) return <FaChartBar />;
    return <FaUsers />;
  };

  const getTeamIconBg = (dept) => {
    const d = dept?.toLowerCase() || "";
    if (d.includes("engineering")) return "#e6f0fa";
    if (d.includes("marketing")) return "#e6f4ea";
    if (d.includes("operation")) return "#fef7e0";
    if (d.includes("data")) return "#e0f2fe";
    return "#ffebe9";
  };

  const getTeamIconColor = (dept) => {
    const d = dept?.toLowerCase() || "";
    if (d.includes("engineering")) return "#1e40af";
    if (d.includes("marketing")) return "#16a34a";
    if (d.includes("operation")) return "#b06000";
    if (d.includes("data")) return "#0284c7";
    return "#d9381e";
  };

  const fetchTeams = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/teams`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTeamsList(data.teams || []);
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  const fetchSurveys = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/surveys`);
      const data = await res.json();
      if (res.ok && data.success) {
        setEngagementInitiatives(data.surveys || []);
      }
    } catch (err) {
      console.error("Failed to fetch surveys:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/reports`);
      const data = await res.json();
      if (res.ok && data.success) {
        setReportsList(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/settings`);
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        setSettingsForm(data.settings);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsForm(data.settings);
        alert("✓ Organization settings updated in database! Changes took effect in real-time.");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save organization settings");
    }
  };

  // Hover Tooltip State for SVG Line Chart
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Modal & Form States
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", role: "", dept: "Engineering", status: "Active", score: 85 });

  // Additional Feature Modals
  const [showCreateSurveyModal, setShowCreateSurveyModal] = useState(false);
  const [newSurveyForm, setNewSurveyForm] = useState({
    title: "",
    type: "Survey",
    dept: "All Departments",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    desc: ""
  });

  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [customReportForm, setCustomReportForm] = useState({
    title: "",
    category: "Skills",
    frequency: "Monthly",
    format: "PDF / Excel"
  });

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(null); // { title: string, items: Array }

  // Messages & Chat Drawer State
  const [showMessagesDrawer, setShowMessagesDrawer] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState({
    id: 1,
    name: "Aman Verma",
    role: "Engineering Lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    status: "Online"
  });

  const [teamMessages, setTeamMessages] = useState([]);
  const [inputMessageText, setInputMessageText] = useState("");

  const fetchTeamMessages = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/messages`);
      const data = await res.json();
      if (res.ok && data.success && data.messages) {
        const mapped = data.messages.map(m => ({
          id: m.id,
          sender: m.sender,
          text: m.text,
          time: m.time,
          isMe: m.sender === (user?.full_name || user?.username)
        }));
        setTeamMessages(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch workforce messages:", err);
    }
  };

  const handleSendMessageSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessageText.trim()) return;

    const currentText = inputMessageText.trim();
    setInputMessageText("");

    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText })
      });
      if (res.ok) {
        fetchTeamMessages();
      }
    } catch (err) {
      console.error("Failed to send workforce message:", err);
    }
  };

  // Data states connected to backend database
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProj, setNewProj] = useState({ title: "", assignee: "", progress: 10, priority: "Medium" });

  // Holiday Calendar
  const todayDate = new Date();
  const [calYear,  setCalYear]  = useState(2026);
  const [calMonth, setCalMonth] = useState(todayDate.getMonth());

  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); } else setCalMonth(m => m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0);  } else setCalMonth(m => m+1); };

  const calCells = () => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay    = new Date(calYear, calMonth, 1).getDay();
    const cells       = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const getHoliday = (day) => {
    if (!day) return null;
    const ds = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return HOLIDAYS_2026.find(h => h.date === ds) || null;
  };

  const isToday = (day) =>
    day && calYear === todayDate.getFullYear() && calMonth === todayDate.getMonth() && day === todayDate.getDate();

  // AI Assistant Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { sender: "assistant", text: "Welcome to Workforce AI Hub! I am SphereHR. Ask me about workforce metrics, employee performance ratings, or team resource planning." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Employer Talent Acquisition state
  const [topStudents, setTopStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [offerForm, setOfferForm] = useState({ title: "Software Engineer - FSD", package: "$90,000 / year", type: "Remote", message: "" });
  const [hiredStudents, setHiredStudents] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);

  const fetchTopStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await authenticatedFetch(`${API_URL}/api/leaderboard`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTopStudents(data.leaderboard || []);
      }
    } catch (e) {
      console.error("Failed to fetch top performing students:", e);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/employees`);
      const data = await res.json();
      if (res.ok && data.success) {
        const fallbackAvatars = [
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
        ];
        const mapped = (data.employees || []).map((emp, i) => ({
          empId: `EMP00${emp.id || (i + 1)}`,
          id: emp.id,
          name: emp.name,
          dept: emp.dept,
          designation: emp.role,
          status: emp.status,
          score: emp.score,
          joinDate: "12 Jan, 2024",
          avatar: fallbackAvatars[i % fallbackAvatars.length]
        }));
        setEmployees(mapped);
      }
    } catch (e) {
      console.error("Error fetching employees:", e);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/projects`);
      const data = await res.json();
      if (res.ok && data.success) setProjects(data.projects || []);
    } catch (e) {
      console.error("Error fetching projects:", e);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/leaves`);
      const data = await res.json();
      if (res.ok && data.success) setLeaveRequests(data.leaveRequests || []);
    } catch (e) {
      console.error("Error fetching leaves:", e);
    }
  };

  const fetchAssessmentsList = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/assessments`);
      const data = await res.json();
      if (res.ok && data.success) setAssessmentsList(data.assessments || []);
    } catch (e) {
      console.error("Error fetching assessments:", e);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchLeaves();
    fetchTeamMessages();
    fetchTeams();
    fetchSurveys();
    fetchReports();
    fetchSettings();
    fetchAssessmentsList();
    fetchTopStudents();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const logs = employees.map((emp, i) => ({
        empId: emp.empId,
        name: emp.name,
        dept: emp.dept,
        status: emp.status === "On Leave" ? "On Leave" : (emp.status === "Active" ? "Present" : "Absent"),
        checkIn: emp.status === "Active" ? (i % 2 === 0 ? "08:52 AM" : "09:05 AM") : "—",
        checkOut: emp.status === "Active" ? "06:15 PM" : "—",
        workHours: emp.status === "Active" ? "09h 15m" : "—",
        avatar: emp.avatar
      }));
      setAttendanceLogs(logs);
    }
  }, [employees]);

  // Form Submit Handlers
  const handleCreateSurveySubmit = async (e) => {
    e.preventDefault();
    if (!newSurveyForm.title.trim()) return;

    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/surveys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSurveyForm.title,
          date: newSurveyForm.startDate ? new Date(newSurveyForm.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "May 2025",
          type: newSurveyForm.type,
          participants: "0",
          responseRate: "0%",
          score: "80%",
          scoreLbl: "Good",
          status: "Active"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSurveys();
        setShowCreateSurveyModal(false);
        setNewSurveyForm({
          title: "", type: "Survey", dept: "All Departments",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          desc: ""
        });
        alert("✓ New Survey created and saved to database!");
      }
    } catch (err) {
      console.error("Failed to create survey:", err);
    }
  };

  const handleCustomReportSubmit = async (e) => {
    e.preventDefault();
    if (!customReportForm.title.trim()) return;

    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: customReportForm.title,
          category: customReportForm.category,
          frequency: customReportForm.frequency,
          lastGen: "Just Now",
          format: customReportForm.format,
          formatType: customReportForm.format.toLowerCase().includes("pdf") ? "pdf" : "excel",
          status: "Ready"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchReports();
        setShowCustomReportModal(false);
        setCustomReportForm({ title: "", category: "Skills", frequency: "Monthly", format: "PDF / Excel" });
        alert("✓ Custom Report generated and saved to database!");
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
    }
  };

  const handleExportReportSubmit = (e) => {
    e.preventDefault();
    const csvRows = [
      ["SkillSphere Workforce Export Report"],
      ["Generated At", new Date().toLocaleString()],
      ["Format", exportFormat],
      ["Department Filter", attendanceDeptFilter],
      ["Total Employees", employees.length],
      [],
      ["Employee ID", "Name", "Department", "Designation", "Status"],
      ...employees.map(emp => [emp.empId, emp.name, emp.dept, emp.designation, emp.status])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SkillSphere_Workforce_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
    alert(`✓ ${exportFormat} Report exported and downloaded successfully!`);
  };

  const handleCreateTeamSubmit = async (e) => {
    e.preventDefault();
    if (!newTeam.name.trim()) return;

    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeam.name,
          description: newTeam.desc || "New workforce team unit",
          leadName: newTeam.lead || "Workforce Lead",
          leadDept: newTeam.dept || "Engineering",
          members: parseInt(newTeam.members) || 10,
          dept: newTeam.dept || "Engineering",
          status: "Active"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchTeams();
        setShowCreateTeamModal(false);
        setNewTeam({ name: "", desc: "", lead: "", dept: "Engineering", members: 10 });
        alert("✓ New team created and saved to database!");
      }
    } catch (err) {
      console.error("Failed to create team:", err);
    }
  };

  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!newEmp.name.trim()) return;
    const empId = `EMP00${employees.length + 1}`;
    const empItem = {
      empId,
      name: newEmp.name,
      dept: newEmp.dept || "Engineering",
      designation: newEmp.role || "Software Engineer",
      status: newEmp.status || "Active",
      joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };
    setEmployees(prev => [empItem, ...prev]);
    setShowEmployeeModal(false);
    setNewEmp({ name: "", role: "", dept: "Engineering", status: "Active", score: 85 });
    alert("✓ Employee added successfully!");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      navigate("/login");
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role || !newEmp.dept) return;

    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEmp.name,
          role: newEmp.role,
          dept: newEmp.dept,
          status: newEmp.status || "Active",
          score: parseInt(newEmp.score) || 85
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchEmployees();
        setNewEmp({ name: "", role: "", dept: "Engineering", status: "Active", score: 85 });
        setShowEmployeeModal(false);
      }
    } catch (err) {
      console.error("Failed to add employee:", err);
    }
  };

  const handleLeaveDecision = async (id, decision) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/leaves/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchLeaves();
        fetchEmployees();
      }
    } catch (err) {
      console.error("Failed to update leave request:", err);
    }
  };

  const handleAssignProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProj.title || !newProj.assignee) return;

    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProj.title,
          assignee: newProj.assignee,
          progress: parseInt(newProj.progress) || 10,
          priority: newProj.priority
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProjects();
        setNewProj({ title: "", assignee: "", progress: 10, priority: "Medium" });
        setShowProjectModal(false);
      }
    } catch (err) {
      console.error("Failed to assign project:", err);
    }
  };

  // Action: AI Assistant Chat Submit using Gemini AI Universal Engine
  const handleSendChat = async (text) => {
    if (!text.trim() || isChatLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: "user", text, time: timeStr };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput("");
    setIsChatLoading(true);

    try {
      let promptToPass = text;
      const lower = text.toLowerCase();
      if (lower.includes("leave") || lower.includes("pending")) {
        const pendingCount = leaveRequests.filter(r => r.status === "PENDING").length;
        promptToPass += `\n[Context: Total Headcount: ${employees.length}, Active Projects: ${projects.length}, Pending Leaves requiring review: ${pendingCount}]`;
      } else if (lower.includes("top performer") || lower.includes("best employee")) {
        const top = [...employees].sort((a,b) => b.score - a.score)[0];
        promptToPass += `\n[Context: Top performer in active roster is ${top ? top.name : "Arjun Mehta"} with performance score ${top ? top.score : 95}%]`;
      }

      const aiResult = await askGeminiAI(promptToPass, { role: "SphereHR AI Operations Advisor" });
      const replyText = aiResult.text || "I am SphereHR AI. How can I assist you with team communication, management strategies, performance tracking, or general technical questions?";

      setChatMessages(prev => [...prev, {
        sender: "assistant",
        text: replyText,
        source: aiResult.source || "Gemini 1.5 Flash",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error("SphereHR Gemini AI Error:", err);
      setChatMessages(prev => [...prev, {
        sender: "assistant",
        text: "I am SphereHR AI. I can assist you with workforce analytics, team communication strategies, coding, management best practices, and universal Q&A.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickPrompts = [
    "How will I communicate with teammates?",
    "Who is the top performer?",
    "Check pending leaves.",
    "Recommend training programs.",
    "Strategies to improve team productivity"
  ];

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.lead) return;
    const created = {
      id: Date.now(),
      name: newTeam.name,
      desc: newTeam.desc || "Team operations & growth",
      icon: <FaUserFriends />,
      iconBg: "#faf0e6",
      iconColor: "#8c5338",
      leadName: newTeam.lead,
      leadDept: newTeam.dept,
      leadAvatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=100&auto=format&fit=crop&q=80`,
      members: parseInt(newTeam.members) || 10,
      dept: newTeam.dept,
      status: "Active"
    };
    setTeamsList(prev => [...prev, created]);
    setNewTeam({ name: "", desc: "", lead: "", dept: "Engineering", members: 10 });
    setShowCreateTeamModal(false);
  };

  const navItems = [
    { id: "Overview", label: "Overview", icon: <FaHome /> },
    ...(user && user.role === "EMPLOYER" ? [
      { id: "Hiring", label: "Talent Acquisition", icon: <FaBriefcase /> },
      { id: "HiredList", label: "Hired Candidates", icon: <FaUserCheck /> }
    ] : []),
    { id: "Employees", label: "Employees", icon: <FaUsers /> },
    { id: "Teams", label: "Teams", icon: <FaUserFriends /> },
    { id: "Skills", label: "Skills & Assessments", icon: <FaShieldAlt /> },
    { id: "CareerPromotion", label: "Career Promotion", icon: <FaTrophy /> },
    { id: "Learning", label: "Learning & Training", icon: <FaLaptopCode /> },
    { id: "Performance", label: "Performance", icon: <FaChartLine /> },
    { id: "Attendance", label: "Attendance", icon: <FaClock /> },
    { id: "Engagement", label: "Engagement", icon: <FaHeart /> },
    { id: "Reports", label: "Reports & Analytics", icon: <FaChartBar /> },
    { id: "AI Assistant", label: "SphereHR AI", icon: <FaRobot /> },
    { id: "Settings", label: "Workforce Settings", icon: <FaCog /> },
  ];


  const lineChartData = {
    active: [
      { date: "May 1", val: 340, x: 40, y: 140 },
      { date: "May 8", val: 390, x: 130, y: 110 },
      { date: "May 15", val: 410, x: 220, y: 95 },
      { date: "May 22", val: 480, x: 310, y: 55 },
      { date: "May 29", val: 520, x: 400, y: 30 }
    ],
    newHires: [
      { date: "May 1", val: 80, x: 40, y: 175 },
      { date: "May 8", val: 110, x: 130, y: 165 },
      { date: "May 15", val: 130, x: 220, y: 155 },
      { date: "May 22", val: 120, x: 310, y: 160 },
      { date: "May 29", val: 130, x: 400, y: 155 }
    ]
  };

  const activePathD = "M 40 140 Q 85 125, 130 110 T 220 95 T 310 55 T 400 30";
  const newHiresPathD = "M 40 175 Q 85 170, 130 165 T 220 155 T 310 160 T 400 155";

  const userName = user?.full_name || user?.username || "Arjun Mehta";

  const filteredEmployees = employees.filter(emp => {
    const name = emp.name || "";
    const dept = emp.dept || "";
    const designation = emp.designation || "";
    const empId = emp.empId || "";
    return name.toLowerCase().includes(empSearch.toLowerCase()) ||
           dept.toLowerCase().includes(empSearch.toLowerCase()) ||
           designation.toLowerCase().includes(empSearch.toLowerCase()) ||
           empId.toLowerCase().includes(empSearch.toLowerCase());
  });

  const filteredTeams = teamsList.filter(t => {
    const name = t.name || "";
    const dept = t.dept || "";
    const leadName = t.leadName || "";
    return name.toLowerCase().includes(teamSearch.toLowerCase()) ||
           dept.toLowerCase().includes(teamSearch.toLowerCase()) ||
           leadName.toLowerCase().includes(teamSearch.toLowerCase());
  });

  const filteredAttendance = attendanceLogs.filter(log => {
    const dept = log.dept || "";
    return attendanceDeptFilter === "All Departments" || dept === attendanceDeptFilter;
  });

  const filteredReports = reportsList.filter(rep => {
    const matchesCat = reportCatFilter === "All Reports" || rep.category === reportCatFilter;
    const title = rep.title || "";
    const category = rep.category || "";
    const matchesSearch = title.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          category.toLowerCase().includes(reportSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`wf-dashboard-container ${themeMode === 'dark' ? 'dark-theme' : ''}`} data-theme={themeMode || 'dark'}>
      
      {/* BACKGROUND & MOVING GRAPHICS */}
      <Background />

      <div className="wf-moving-bg-layer">
        <div className="wf-bg-blob wf-bg-blob-1" />
        <div className="wf-bg-blob wf-bg-blob-2" />
        <div className="wf-bg-blob wf-bg-blob-3" />

        <div className="wf-floating-graphic-item wf-fitem-1">💼</div>
        <div className="wf-floating-graphic-item wf-fitem-2">🚀</div>
        <div className="wf-floating-graphic-item wf-fitem-3">⚡</div>
        <div className="wf-floating-graphic-item wf-fitem-4">📈</div>
        <div className="wf-floating-graphic-item wf-fitem-5">🎓</div>
      </div>

      {/* LEFT SIDEBAR */}
      <aside className={`wf-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="wf-sidebar-header">
          <AppLogo height="54px" />
        </div>

        <nav className="wf-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`wf-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
              }}
            >
              <span className="wf-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>


        {/* Sidebar Promo Card (Uses distinct graphic image based on activeTab) */}
        <div className="wf-sidebar-promo">
          <div className="wf-promo-img-box">
            <img
              src={womanWorkingImg}
              alt="Woman Working on Computer"
            />
          </div>
          <div className="wf-promo-title">
            {activeTab === "Engagement" ? "Build a culture of engagement" : "Build a future-ready workforce"}
          </div>
          <div className="wf-promo-sub">
            {activeTab === "Engagement" ? "Empower your teams with feedback, recognition and meaningful connections." : "Empower your teams with skills, growth and opportunities."}
          </div>
          <button className="wf-promo-btn" onClick={() => alert("Exploring workforce solutions...")}>
            Explore Solutions →
          </button>
        </div>

        <div className="wf-sidebar-help">
          <FaHeadset className="wf-help-icon" />
          <div className="wf-help-text">
            <span className="wf-help-title">Need Help?</span>
            <span className="wf-help-link" onClick={() => navigate("/contact")}>Visit Help Center →</span>
          </div>
        </div>

        <button className="wf-sidebar-logout-btn" onClick={handleLogout} title="Sign out of SkillSphere">
          <FaSignOutAlt /> Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="wf-main-wrapper">
        
        {/* TOP HEADER */}
        <header className="wf-top-header">
          <div className="wf-header-left">
            <button className="wf-hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Navigation">
              <FaBars />
            </button>
            <div className="wf-search-box">
              <FaSearch className="wf-search-icon" />
              <input
                type="text"
                placeholder="Search for employees, skills, reports..."
                className="wf-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="wf-header-right">
            <button
              className="wf-icon-btn"
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              onClick={toggleTheme}
            >
              {themeMode === 'dark' ? <FaSun color="#F59E0B" /> : <FaMoon color="#6366F1" />}
            </button>
            <button className="wf-icon-btn" title="Messages & Team Chat" onClick={() => setShowMessagesDrawer(!showMessagesDrawer)}>
              <FaCommentAlt />
              <span className="wf-badge-count">3</span>
            </button>
            <NotificationDropdown type="workforce" />

            <div className="wf-user-profile-wrapper">
              <button
                className="wf-user-profile-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title="Account Menu"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Arjun Mehta"
                  className="wf-user-avatar"
                />
                <div className="wf-user-details">
                  <span className="wf-user-name">Arjun Mehta</span>
                  <span className="wf-user-role">Workforce Admin</span>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="wf-user-menu-dropdown">
                  <button className="wf-menu-dropdown-item" onClick={() => { setIsUserMenuOpen(false); navigate("/settings"); }}>
                    <FaUserCog /> Settings
                  </button>
                  <button className="wf-menu-dropdown-item" onClick={() => { setIsUserMenuOpen(false); setActiveTab("Settings"); }}>
                    <FaSlidersH /> Theme Options
                  </button>
                  <button className="wf-menu-dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="wf-content-body">

          {/* TAB: TALENT ACQUISITION (Hiring) */}
          {activeTab === "Hiring" && (
            <div className="wf-card" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 className="wf-card-title">Talent Acquisition Leaderboard</h2>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Hire top-performing students based on their actual learning classroom achievements and XP ratings.</p>
                </div>
                <div style={{ position: "relative", width: "250px" }}>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 36px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontSize: "13px"
                    }}
                  />
                  <FaSearch style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-secondary)", fontSize: "12px" }} />
                </div>
              </div>

              {loadingStudents ? (
                <div style={{ textAlign: "center", padding: "40px" }}>Loading students list...</div>
              ) : topStudents.filter(s => {
                const term = studentSearchTerm.toLowerCase();
                return (
                  (s.full_name && s.full_name.toLowerCase().includes(term)) ||
                  (s.username && s.username.toLowerCase().includes(term)) ||
                  (s.college && s.college.toLowerCase().includes(term)) ||
                  (s.branch && s.branch.toLowerCase().includes(term)) ||
                  (s.badge && s.badge.toLowerCase().includes(term))
                );
              }).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>No students found matching your search.</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                  {topStudents.filter(s => {
                    const term = studentSearchTerm.toLowerCase();
                    return (
                      (s.full_name && s.full_name.toLowerCase().includes(term)) ||
                      (s.username && s.username.toLowerCase().includes(term)) ||
                      (s.college && s.college.toLowerCase().includes(term)) ||
                      (s.branch && s.branch.toLowerCase().includes(term)) ||
                      (s.badge && s.badge.toLowerCase().includes(term))
                    );
                  }).map(s => {
                    const hired = hiredStudents.some(h => h.studentName.toLowerCase() === (s.full_name || s.username).toLowerCase());
                    return (
                      <div key={s.username} style={{
                        padding: "24px",
                        background: "var(--bg-primary)",
                        borderRadius: "14px",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div>
                              <span style={{ fontSize: "11px", background: "rgba(140,83,56,0.1)", color: "#8c5338", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold" }}>
                                Rank #{s.rank}
                              </span>
                            </div>
                            <span style={{ fontSize: "12px", color: "#F59E0B", fontWeight: "bold" }}>🏆 {s.xp} XP</span>
                          </div>

                          <strong style={{ fontSize: "18px", display: "block" }}>{s.full_name}</strong>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginTop: "2px" }}>@{s.username}</span>

                          <div style={{ margin: "16px 0", fontSize: "13px" }}>
                            <div style={{ marginBottom: "4px" }}>🎓 College: <strong>{s.college || "N/A"}</strong></div>
                            <div>💻 Stream: <strong>{s.branch || "N/A"}</strong></div>
                          </div>

                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                            <span style={{ fontSize: "11px", background: "#FEF3C7", color: "#D97706", padding: "3px 8px", borderRadius: "99px", fontWeight: "bold" }}>
                              {s.badge}
                            </span>
                          </div>
                        </div>

                        <div>
                          {hired ? (
                            <div style={{
                              width: "100%",
                              padding: "10px",
                              textAlign: "center",
                              background: "#E6F4EA",
                              color: "#16A34A",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px"
                            }}>
                              <FaUserCheck /> Offer Extended
                            </div>
                          ) : (
                            <button
                              className="wf-btn-primary"
                              style={{ width: "100%", padding: "10px", background: "#8c5338", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                              onClick={() => {
                                setSelectedStudent(s);
                                setShowOfferModal(true);
                              }}
                            >
                              Hire Student
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: HIRED CANDIDATES (HiredList) */}
          {activeTab === "HiredList" && (
            <div className="wf-card" style={{ padding: "28px" }}>
              <h2 className="wf-card-title">Hired Candidates Tracker</h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>Offers extended to students from the learning portal.</p>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                      <th style={{ padding: "12px 8px" }}>Candidate Name</th>
                      <th style={{ padding: "12px 8px" }}>Contact Email</th>
                      <th style={{ padding: "12px 8px" }}>Job Offer Title</th>
                      <th style={{ padding: "12px 8px" }}>Package Details</th>
                      <th style={{ padding: "12px 8px" }}>Work Mode</th>
                      <th style={{ padding: "12px 8px" }}>Date Hired</th>
                      <th style={{ padding: "12px 8px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hiredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: "30px 8px", textAlign: "center", color: "var(--text-secondary)" }}>No candidates hired yet.</td>
                      </tr>
                    ) : (
                      hiredStudents.map(h => (
                        <tr key={h.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{h.studentName}</td>
                          <td style={{ padding: "12px 8px" }}>{h.studentEmail}</td>
                          <td style={{ padding: "12px 8px" }}>{h.jobTitle}</td>
                          <td style={{ padding: "12px 8px" }}>{h.package}</td>
                          <td style={{ padding: "12px 8px" }}>{h.type}</td>
                          <td style={{ padding: "12px 8px" }}>{h.hiredDate}</td>
                          <td style={{ padding: "12px 8px" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontSize: "11px",
                              fontWeight: "bold",
                              background: "#FEF7E0",
                              color: "#B06000"
                            }}>
                              Pending Accept
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* TAB: CAREER PROMOTION (EXACT 1-TO-1 MATCH TO REFERENCE MOCKUP IMAGE 1) */}
          {activeTab === "CareerPromotion" && (
            <div className="wf-cp-container">
              {/* HERO BANNER SECTION */}
              <section className="wf-cp-hero">
                <div className="wf-cp-hero-left">
                  <h1 className="wf-cp-hero-title">Career Promotion</h1>
                  <p className="wf-cp-hero-subtitle">
                    Plan your growth. Build skills. Achieve your next role.<br />
                    Track your progress, bridge skill gaps and unlock new career opportunities.
                  </p>
                  <button
                    className="wf-cp-explore-btn"
                    onClick={() => alert("Exploring all available workforce career tracks!")}
                  >
                    <span>Explore Career Paths</span>
                    <FaArrowRight />
                  </button>
                </div>

                <div className="wf-cp-hero-illustration">
                  <img
                    src={themeMode === 'dark' ? (darkWorkforcePortalImg || darkHeroImg) : workforcePortalImg}
                    alt="Career Promotion Illustration"
                    className="wf-cp-hero-img"
                  />
                </div>

                <div className="wf-cp-role-card">
                  <div className="wf-cp-role-item">
                    <span className="wf-cp-role-label">Current Role</span>
                    <div className="wf-cp-role-row">
                      <span className="wf-cp-role-title">Senior Software Engineer</span>
                      <span className="wf-cp-level-pill">Level 4</span>
                    </div>
                  </div>

                  <div className="wf-cp-role-item" style={{ marginTop: "12px" }}>
                    <span className="wf-cp-role-label">Next Target Role</span>
                    <div className="wf-cp-role-row">
                      <span className="wf-cp-role-title">Lead Software Engineer</span>
                      <span className="wf-cp-level-pill target">Level 5</span>
                    </div>
                  </div>

                  <button
                    className="wf-cp-role-details-btn"
                    onClick={() => alert("Lead Software Engineer (Level 5) Role Details:\n- 5+ years experience required\n- System Design & Cloud Architecture\n- Lead team of 4-6 engineers")}
                  >
                    <span>View Role Details</span>
                    <FaArrowRight />
                  </button>
                </div>
              </section>

              {/* 5 METRICS CARDS ROW */}
              <section className="wf-cp-metrics-grid">
                <div className="wf-cp-metric-card">
                  <div className="wf-cp-donut-wrapper">
                    <svg className="wf-cp-donut-svg" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="22" className="wf-cp-donut-bg" />
                      <circle cx="30" cy="30" r="22" className="wf-cp-donut-fill" strokeDasharray="138" strokeDashoffset={138 - (138 * 68) / 100} />
                    </svg>
                    <span className="wf-cp-donut-val">68%</span>
                  </div>
                  <div className="wf-cp-metric-info">
                    <span className="wf-cp-metric-name">Career Progress</span>
                    <span className="wf-cp-metric-status">You are on track!</span>
                    <span className="wf-cp-metric-trend">↑ 12% progress this month</span>
                  </div>
                </div>

                <div className="wf-cp-metric-card">
                  <div className="wf-cp-icon-circle blue">
                    <FaUsers />
                  </div>
                  <div className="wf-cp-metric-info">
                    <span className="wf-cp-metric-name">Skills Matched</span>
                    <span className="wf-cp-metric-bigval">18 / 24</span>
                    <span className="wf-cp-metric-sub">Skills required for next level</span>
                    <div className="wf-cp-progress-mini"><div className="fill" style={{ width: '75%', background: '#3b82f6' }} /></div>
                  </div>
                </div>

                <div className="wf-cp-metric-card">
                  <div className="wf-cp-icon-circle orange">
                    <FaBullseye />
                  </div>
                  <div className="wf-cp-metric-info">
                    <span className="wf-cp-metric-name">Skill Gaps</span>
                    <span className="wf-cp-metric-bigval">6</span>
                    <span className="wf-cp-metric-sub">Skills to improve or learn</span>
                    <div className="wf-cp-progress-mini"><div className="fill" style={{ width: '35%', background: '#f97316' }} /></div>
                  </div>
                </div>

                <div className="wf-cp-metric-card">
                  <div className="wf-cp-icon-circle green">
                    <FaBookOpen />
                  </div>
                  <div className="wf-cp-metric-info">
                    <span className="wf-cp-metric-name">Completed Learning</span>
                    <span className="wf-cp-metric-bigval">24</span>
                    <span className="wf-cp-metric-sub">Courses & learning completed</span>
                    <div className="wf-cp-progress-mini"><div className="fill" style={{ width: '100%', background: '#10b981' }} /></div>
                  </div>
                </div>

                <div className="wf-cp-metric-card">
                  <div className="wf-cp-icon-circle green-light">
                    <FaStar />
                  </div>
                  <div className="wf-cp-metric-info">
                    <span className="wf-cp-metric-name">Promotion Readiness</span>
                    <span className="wf-cp-metric-bigval green-text">High</span>
                    <span className="wf-cp-metric-sub">You're ready for the next step!</span>
                  </div>
                </div>
              </section>

              {/* SUB-NAVIGATION TABS BAR */}
              <nav className="wf-cp-tabs-bar">
                {["Career Path", "Skill Gaps", "Recommendations", "Opportunities", "Promotion History"].map((tab) => (
                  <button
                    key={tab}
                    className={`wf-cp-tab-btn ${careerSubTab === tab ? "active" : ""}`}
                    onClick={() => setCareerSubTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              {/* MAIN CONTENT 2-COLUMN GRID */}
              <div className="wf-cp-main-grid">
                
                {/* LEFT COLUMN */}
                <div className="wf-cp-left-col">
                  
                  {/* YOUR CAREER PATH STEP TIMELINE */}
                  <div className="wf-cp-card">
                    <div className="wf-cp-card-header">
                      <div>
                        <h3 className="wf-cp-card-title">Your Career Path</h3>
                        <span className="wf-cp-track-sub">Software Engineering Track</span>
                      </div>
                      <button className="wf-cp-link-btn" onClick={() => alert("Viewing all 7 engineering career levels...")}>
                        View All Levels &rarr;
                      </button>
                    </div>

                    <div className="wf-cp-timeline">
                      <div className="wf-cp-timeline-line" />
                      
                      <div className="wf-cp-timeline-steps">
                        <div className="wf-cp-step completed">
                          <div className="wf-cp-step-icon"><FaCheck /></div>
                          <span className="wf-cp-step-title">Software Engineer</span>
                          <span className="wf-cp-step-level">Level 3</span>
                          <span className="wf-cp-step-badge completed">Completed</span>
                        </div>

                        <div className="wf-cp-step completed">
                          <div className="wf-cp-step-icon"><FaCheck /></div>
                          <span className="wf-cp-step-title">Senior Software Engineer</span>
                          <span className="wf-cp-step-level">Level 4</span>
                          <span className="wf-cp-step-badge completed">Completed</span>
                        </div>

                        <div className="wf-cp-step in-progress">
                          <div className="wf-cp-step-icon active">3</div>
                          <span className="wf-cp-step-title">Lead Software Engineer</span>
                          <span className="wf-cp-step-level">Level 5</span>
                          <span className="wf-cp-step-badge in-progress">+ In Progress</span>
                        </div>

                        <div className="wf-cp-step locked">
                          <div className="wf-cp-step-icon locked"><FaUserFriends /></div>
                          <span className="wf-cp-step-title">Engineering Manager</span>
                          <span className="wf-cp-step-level">Level 6</span>
                          <span className="wf-cp-step-badge locked">Locked</span>
                        </div>

                        <div className="wf-cp-step locked">
                          <div className="wf-cp-step-icon locked"><FaUserFriends /></div>
                          <span className="wf-cp-step-title">Director of Engineering</span>
                          <span className="wf-cp-step-level">Level 7</span>
                          <span className="wf-cp-step-badge locked">Locked</span>
                        </div>
                      </div>
                    </div>

                    <div className="wf-cp-progress-target-box">
                      <div className="wf-cp-progress-top">
                        <span className="wf-cp-target-label">Progress to Lead Software Engineer</span>
                        <span className="wf-cp-target-pct">68%</span>
                      </div>
                      <div className="wf-cp-target-track">
                        <div className="wf-cp-target-fill" style={{ width: "68%" }} />
                      </div>
                      <div className="wf-cp-progress-bottom">
                        <span className="wf-cp-expected">Expected completion: Aug 2025</span>
                        <button
                          className="wf-cp-outline-btn"
                          onClick={() => alert("Role Details Modal: Lead Software Engineer criteria (68% complete)")}
                        >
                          View Role Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* TOP SKILL GAPS */}
                  <div className="wf-cp-card" style={{ marginTop: "20px" }}>
                    <div className="wf-cp-card-header">
                      <div>
                        <h3 className="wf-cp-card-title">Top Skill Gaps</h3>
                        <span className="wf-cp-track-sub">Improve these skills to reach your next role faster.</span>
                      </div>
                      <button className="wf-cp-link-btn" onClick={() => setCareerSubTab("Skill Gaps")}>
                        View All Skill Gaps &rarr;
                      </button>
                    </div>

                    <div className="wf-cp-skills-grid">
                      <div className="wf-cp-skill-item">
                        <div className="wf-cp-skill-icon"><FaLaptopCode /></div>
                        <div className="wf-cp-skill-info">
                          <div className="wf-cp-skill-top">
                            <span className="wf-cp-skill-name">System Design</span>
                            <span className="wf-cp-skill-badge adv">Advanced</span>
                          </div>
                          <div className="wf-cp-skill-track">
                            <div className="wf-cp-skill-fill" style={{ width: "40%", background: "#f97316" }} />
                          </div>
                          <span className="wf-cp-skill-pct">40%</span>
                        </div>
                      </div>

                      <div className="wf-cp-skill-item">
                        <div className="wf-cp-skill-icon"><FaCloud /></div>
                        <div className="wf-cp-skill-info">
                          <div className="wf-cp-skill-top">
                            <span className="wf-cp-skill-name">Cloud Architecture</span>
                            <span className="wf-cp-skill-badge adv">Advanced</span>
                          </div>
                          <div className="wf-cp-skill-track">
                            <div className="wf-cp-skill-fill" style={{ width: "30%", background: "#f97316" }} />
                          </div>
                          <span className="wf-cp-skill-pct">30%</span>
                        </div>
                      </div>

                      <div className="wf-cp-skill-item">
                        <div className="wf-cp-skill-icon"><FaUserFriends /></div>
                        <div className="wf-cp-skill-info">
                          <div className="wf-cp-skill-top">
                            <span className="wf-cp-skill-name">Leadership & People Management</span>
                            <span className="wf-cp-skill-badge mid">Intermediate</span>
                          </div>
                          <div className="wf-cp-skill-track">
                            <div className="wf-cp-skill-fill" style={{ width: "60%", background: "#8b5cf6" }} />
                          </div>
                          <span className="wf-cp-skill-pct">60%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="wf-cp-right-col">
                  
                  {/* RECOMMENDED NEXT STEPS */}
                  <div className="wf-cp-card">
                    <h3 className="wf-cp-card-title" style={{ marginBottom: "16px" }}>Recommended Next Steps</h3>

                    <div className="wf-cp-steps-list">
                      <div className="wf-cp-step-card" onClick={() => alert("Redirecting to Recommended Courses...")}>
                        <div className="wf-cp-step-card-icon"><FaBookOpen /></div>
                        <div className="wf-cp-step-card-info">
                          <span className="title">Complete 2 recommended courses</span>
                          <span className="sub">3 courses pending</span>
                        </div>
                        <FaArrowRight className="arrow" />
                      </div>

                      <div className="wf-cp-step-card" onClick={() => setCareerSubTab("Skill Gaps")}>
                        <div className="wf-cp-step-card-icon"><FaBullseye /></div>
                        <div className="wf-cp-step-card-info">
                          <span className="title">Improve 2 skill gaps</span>
                          <span className="sub">Focus on high priority skills</span>
                        </div>
                        <FaArrowRight className="arrow" />
                      </div>

                      <div className="wf-cp-step-card" onClick={() => alert("Promotion project proposal form opened.")}>
                        <div className="wf-cp-step-card-icon"><FaBriefcase /></div>
                        <div className="wf-cp-step-card-info">
                          <span className="title">Work on a promotion project</span>
                          <span className="sub">1 project recommended</span>
                        </div>
                        <FaArrowRight className="arrow" />
                      </div>

                      <div className="wf-cp-step-card" onClick={() => alert("Mentorship booking system opened.")}>
                        <div className="wf-cp-step-card-icon"><FaHeadset /></div>
                        <div className="wf-cp-step-card-info">
                          <span className="title">Get mentor feedback</span>
                          <span className="sub">Schedule a 1:1 session</span>
                        </div>
                        <FaArrowRight className="arrow" />
                      </div>
                    </div>
                  </div>

                  {/* UPCOMING OPPORTUNITIES */}
                  <div className="wf-cp-card" style={{ marginTop: "20px" }}>
                    <div className="wf-cp-card-header">
                      <h3 className="wf-cp-card-title">Upcoming Opportunities</h3>
                      <button className="wf-cp-link-btn" onClick={() => setCareerSubTab("Opportunities")}>
                        View All &rarr;
                      </button>
                    </div>

                    <div className="wf-cp-opps-list">
                      <div className="wf-cp-opp-item">
                        <div className="wf-cp-opp-icon"><FaBriefcase /></div>
                        <div className="wf-cp-opp-info">
                          <div className="wf-cp-opp-row">
                            <span className="title">Lead Engineer Opening</span>
                            <span className="type internal">Internal</span>
                          </div>
                          <span className="dept">Engineering Team</span>
                        </div>
                        <span className="date">Apply by 10 Jun 2025</span>
                      </div>

                      <div className="wf-cp-opp-item">
                        <div className="wf-cp-opp-icon"><FaUserPlus /></div>
                        <div className="wf-cp-opp-info">
                          <div className="wf-cp-opp-row">
                            <span className="title">Tech Lead Program</span>
                            <span className="type program">Program</span>
                          </div>
                          <span className="dept">Leadership Development</span>
                        </div>
                        <span className="date">Apply by 25 Jun 2025</span>
                      </div>

                      <div className="wf-cp-opp-item">
                        <div className="wf-cp-opp-icon"><FaRocket /></div>
                        <div className="wf-cp-opp-info">
                          <div className="wf-cp-opp-row">
                            <span className="title">Innovation Hackathon</span>
                            <span className="type event">Event</span>
                          </div>
                          <span className="dept">Company Wide</span>
                        </div>
                        <span className="date">Starts on 15 Jun 2025</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* WORKFORCE FOOTER */}
              <footer className="wf-footer-container" style={{ marginTop: "40px" }}>
                <div className="wf-footer-main">
                  <div className="wf-footer-brand-col">
                    <div className="wf-footer-logo" style={{ display: "inline-flex", alignItems: "center" }}>
                      <AppLogo height="56px" />
                    </div>
                    <p className="wf-footer-tagline">
                      Empowering organizations by building a skilled and engaged workforce.
                    </p>
                    <div className="wf-footer-socials">
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                      <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
                      <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
                      <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
                    </div>
                  </div>

                  <div className="wf-footer-links-grid">
                    <div className="wf-footer-col">
                      <h4>Overview</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Overview")}>Overview</button></li>
                        <li><button onClick={() => setActiveTab("Employees")}>Employees</button></li>
                        <li><button onClick={() => setActiveTab("Teams")}>Teams</button></li>
                      </ul>
                    </div>

                    <div className="wf-footer-col">
                      <h4>Skills & Assessments</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Skills")}>Skills & Assessments</button></li>
                        <li><button onClick={() => setActiveTab("CareerPromotion")}>Skill Library</button></li>
                      </ul>
                    </div>

                    <div className="wf-footer-col">
                      <h4>Learning & Training</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Learning")}>Learning & Training</button></li>
                        <li><button onClick={() => setActiveTab("Learning")}>My Learning</button></li>
                        <li><button onClick={() => setActiveTab("Learning")}>Certifications</button></li>
                      </ul>
                    </div>

                    <div className="wf-footer-col">
                      <h4>Performance</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Performance")}>Performance</button></li>
                        <li><button onClick={() => setActiveTab("Performance")}>Reviews</button></li>
                        <li><button onClick={() => setActiveTab("Performance")}>Goals</button></li>
                      </ul>
                    </div>

                    <div className="wf-footer-col">
                      <h4>Attendance</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Attendance")}>Attendance</button></li>
                        <li><button onClick={() => setActiveTab("Attendance")}>Leaves</button></li>
                        <li><button onClick={() => setActiveTab("Attendance")}>Calendar</button></li>
                      </ul>
                    </div>

                    <div className="wf-footer-col">
                      <h4>Engagement</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Engagement")}>Engagement</button></li>
                        <li><button onClick={() => setActiveTab("Engagement")}>Surveys</button></li>
                        <li><button onClick={() => setActiveTab("Engagement")}>Feedback</button></li>
                      </ul>
                    </div>

                    <div className="wf-footer-col">
                      <h4>Reports & Analytics</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Reports")}>Reports & Analytics</button></li>
                        <li><button onClick={() => setActiveTab("Reports")}>Dashboards</button></li>
                        <li><button onClick={() => setActiveTab("Reports")}>Insights</button></li>
                      </ul>
                    </div>

                    <div className="wf-footer-col">
                      <h4>Workforce Settings</h4>
                      <ul>
                        <li><button onClick={() => setActiveTab("Settings")}>Workforce Settings</button></li>
                        <li><button onClick={() => setActiveTab("Settings")}>Roles & Permissions</button></li>
                        <li><button onClick={() => setActiveTab("Settings")}>Integrations</button></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="wf-footer-bottom">
                  <span>© 2026 SkillSphere Workforce. All rights reserved.</span>
                  <div className="wf-footer-legal-links">
                    <button onClick={() => alert("Privacy Policy")}>Privacy Policy</button>
                    <span>|</span>
                    <button onClick={() => alert("Terms of Service")}>Terms of Service</button>
                    <span>|</span>
                    <button onClick={() => alert("Help Center")}>Help Center</button>
                    <span>|</span>
                    <button onClick={() => alert("English (US)")}><FaGlobe /> English</button>
                  </div>
                </div>
              </footer>
            </div>
          )}

          {/* TAB 8: ENGAGEMENT MANAGEMENT (EXACT MATCH TO REFERENCE IMAGE WITH DISTINCT HUMAN GRAPHIC) */}
          {activeTab === "Engagement" && (
            <>
              {/* WELCOME BANNER WITH DISTINCT HUMAN GRAPHIC (sandboxHeroImg) */}
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Engagement Management Control Panel</h1>
                  <p>Real-time workforce management center for engagement. Access team allocation tools and analytics.</p>
                  <button className="wf-btn-primary" style={{ marginTop: "14px" }} onClick={() => setActiveTab("Overview")}>
                    Return to Overview Dashboard
                  </button>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.18)" stroke="rgba(212, 140, 102, 0.35)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.15)" stroke="rgba(224, 122, 95, 0.3)" strokeWidth="1.5" />
                  </svg>
                  <img
                    src={themeMode === 'dark' ? (darkSandboxHeroImg || darkHeroImg) : sandboxHeroImg}
                    alt="Engagement Team Graphic"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              {/* TOP 5 METRICS CARDS */}
              <section className="wf-metrics-grid">
                <div className="wf-metric-card" onClick={() => alert("78% overall workforce engagement score.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUsers /></div><span className="wf-metric-title">Engagement Score</span></div>
                  <div className="wf-metric-value">78%</div>
                  <div className="wf-metric-trend">↑ 6% <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("412 active survey participants this month.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#e6f4ea", color: "#16a34a" }}><FaUserCheck /></div><span className="wf-metric-title">Active Participants</span></div>
                  <div className="wf-metric-value">412</div>
                  <div className="wf-metric-trend">↑ 18% <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("24 surveys conducted across teams.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}><FaClipboardCheck /></div><span className="wf-metric-title">Surveys Conducted</span></div>
                  <div className="wf-metric-value">24</div>
                  <div className="wf-metric-trend">↑ 9% <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("156 peer recognitions and awards sent.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#ffebe9", color: "#d9381e" }}><FaAward /></div><span className="wf-metric-title">Recognitions Sent</span></div>
                  <div className="wf-metric-value">156</div>
                  <div className="wf-metric-trend">↑ 22% <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("72% survey response rate.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fef3c7", color: "#b45309" }}><FaClock /></div><span className="wf-metric-title">Response Rate</span></div>
                  <div className="wf-metric-value">72%</div>
                  <div className="wf-metric-trend">↑ 7% <span className="wf-metric-trend-label">from last month</span></div>
                </div>
              </section>

              {/* ENGAGEMENT MAIN GRID (2 COLUMNS) */}
              <section className="wf-teams-grid">
                
                {/* LEFT CARD: ENGAGEMENT OVERVIEW TABLE */}
                <div className="wf-card">
                  <div className="wf-card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <h2 className="wf-card-title">Engagement Overview</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <select className="wf-select-filter">
                        <option>📅 May 1 – May 31, 2025</option>
                        <option>📅 April 1 – April 30, 2025</option>
                      </select>

                      <select className="wf-select-filter" value={engagementDeptFilter} onChange={(e) => setEngagementDeptFilter(e.target.value)}>
                        <option value="All Departments">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Human Resources">Human Resources</option>
                      </select>

                      <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "8px 14px" }} onClick={() => setShowCreateSurveyModal(true)}>
                        <FaPlus /> Create Survey
                      </button>
                    </div>
                  </div>

                  <div className="wf-table-responsive">
                    <table className="wf-table">
                      <thead>
                        <tr>
                          <th>Survey / Initiative</th>
                          <th>Type</th>
                          <th>Participants</th>
                          <th>Response Rate</th>
                          <th>Engagement Score</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {engagementInitiatives.map(item => (
                          <tr key={item.id}>
                            <td>
                              <div className="wf-team-cell">
                                <div className="wf-dept-icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                                  <FaClipboardCheck />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: "700", color: "var(--wf-text-primary)" }}>{item.title}</span>
                                  <span className="wf-emp-id-sub">{item.date}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className={`wf-type-tag ${item.type === "Survey" ? "survey" : "initiative"}`}>
                                {item.type}
                              </span>
                            </td>

                            <td><strong>{item.participants}</strong></td>
                            <td>{item.responseRate}</td>

                            <td>
                              <div className="wf-score-badge">
                                <span>{item.score}</span>
                                <span className={`wf-score-lbl ${
                                  item.scoreLbl === "Excellent" ? "excellent" :
                                  item.scoreLbl === "Good" ? "good" : "average"
                                }`}>
                                  {item.scoreLbl}
                                </span>
                              </div>
                            </td>

                            <td>
                              <span className={`wf-status-pill ${
                                item.status === "Completed" ? "completed" :
                                item.status === "Active" ? "active-status" : "ongoing"
                              }`}>
                                {item.status}
                              </span>
                            </td>

                            <td>
                              <button className="wf-action-dots-btn" onClick={() => alert(`Actions for initiative: ${item.title}`)}>
                                <FaEllipsisV />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="wf-pagination">
                    <span>Showing 1 to 5 of 24 items</span>
                    <div className="wf-page-numbers">
                      <button className="wf-page-btn">&lt;</button>
                      <button className="wf-page-btn active">1</button>
                      <button className="wf-page-btn">2</button>
                      <button className="wf-page-btn">3</button>
                      <span>...</span>
                      <button className="wf-page-btn">5</button>
                      <button className="wf-page-btn">&gt;</button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN STACK (2 CARDS MATCHING REFERENCE IMAGE) */}
                <div className="wf-teams-right-stack">
                  
                  {/* 1. Engagement Score Trend Area Line Chart */}
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Engagement Score Trend</h2>
                      <select className="wf-select-filter">
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>

                    <div className="wf-overview-chart-container">
                      <svg className="wf-svg-line-chart" viewBox="0 0 340 150">
                        <defs>
                          <linearGradient id="engTrendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8c5338" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#8c5338" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        <line x1="30" y1="20" x2="330" y2="20" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="45" x2="330" y2="45" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="70" x2="330" y2="70" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="95" x2="330" y2="95" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="120" x2="330" y2="120" stroke="#ebdcd0" strokeWidth="1.5" />

                        <text x="10" y="24" fill="#a39285" fontSize="9">100%</text>
                        <text x="10" y="49" fill="#a39285" fontSize="9">75%</text>
                        <text x="10" y="74" fill="#a39285" fontSize="9">50%</text>
                        <text x="10" y="99" fill="#a39285" fontSize="9">25%</text>
                        <text x="15" y="124" fill="#a39285" fontSize="9">0%</text>

                        <path d="M 40 70 Q 95 55, 150 50 T 260 55 T 310 35 L 310 120 L 40 120 Z" fill="url(#engTrendGrad)" />
                        <path d="M 40 70 Q 95 55, 150 50 T 260 55 T 310 35" fill="none" stroke="#8c5338" strokeWidth="2.5" strokeLinecap="round" />

                        <circle cx="40" cy="70" r="3.5" fill="#8c5338" />
                        <circle cx="95" cy="55" r="3.5" fill="#8c5338" />
                        <circle cx="150" cy="50" r="3.5" fill="#8c5338" />
                        <circle cx="205" cy="42" r="3.5" fill="#8c5338" />
                        <circle cx="260" cy="55" r="3.5" fill="#8c5338" />
                        <circle cx="310" cy="35" r="3.5" fill="#8c5338" />

                        <text x="40" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 1</text>
                        <text x="95" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 7</text>
                        <text x="150" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 14</text>
                        <text x="205" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 21</text>
                        <text x="260" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 28</text>
                        <text x="310" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 31</text>
                      </svg>
                    </div>
                  </div>

                  {/* 2. Top Engagement Drivers */}
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Top Engagement Drivers</h2>
                      <span className="wf-card-action" onClick={() => alert("Viewing all engagement driver analytics...")}>View All</span>
                    </div>

                    <div className="wf-driver-list">
                      <div className="wf-driver-row">
                        <div className="wf-driver-info">
                          <FaTrophy style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Recognition & Appreciation</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "86%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "36px", fontWeight: "800" }}>86%</span>
                        </div>
                      </div>

                      <div className="wf-driver-row">
                        <div className="wf-driver-info">
                          <FaRocket style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Growth & Opportunities</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "80%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "36px", fontWeight: "800" }}>80%</span>
                        </div>
                      </div>

                      <div className="wf-driver-row">
                        <div className="wf-driver-info">
                          <FaBalanceScale style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Work-Life Balance</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "74%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "36px", fontWeight: "800" }}>74%</span>
                        </div>
                      </div>

                      <div className="wf-driver-row">
                        <div className="wf-driver-info">
                          <FaComments style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Communication</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "70%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "36px", fontWeight: "800" }}>70%</span>
                        </div>
                      </div>

                      <div className="wf-driver-row">
                        <div className="wf-driver-info">
                          <FaUserFriends style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Team Collaboration</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "68%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "36px", fontWeight: "800" }}>68%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </>
          )}

          {/* TAB 7: ATTENDANCE MANAGEMENT */}
          {activeTab === "Attendance" && (
            <>
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Attendance Management</h1>
                  <p>Track, manage and analyze attendance in real-time. Monitor presence, leaves and punctuality across your organization.</p>
                  <button className="wf-btn-primary" style={{ marginTop: "14px" }} onClick={() => setActiveTab("Overview")}>
                    Return to Overview Dashboard
                  </button>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.18)" stroke="rgba(212, 140, 102, 0.35)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.15)" stroke="rgba(224, 122, 95, 0.3)" strokeWidth="1.5" />
                  </svg>
                  <img
                    src={themeMode === 'dark' ? (darkWorkHubHeroImg || darkWorkforcePortalImg) : workHubHeroImg}
                    alt="Attendance Illustration"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              <section className="wf-metrics-grid">
                <div className="wf-metric-card" onClick={() => setAttendanceDeptFilter("All Departments")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUsers /></div><span className="wf-metric-title">Total Employees</span></div>
                  <div className="wf-metric-value">512</div>
                  <div className="wf-metric-trend">↑ 18 <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("428 employees present today (83.6% of total workforce).")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#e6f4ea", color: "#16a34a" }}><FaUserCheck /></div><span className="wf-metric-title">Present Today</span></div>
                  <div className="wf-metric-value">428</div>
                  <div className="wf-metric-trend">↑ 83.6% <span className="wf-metric-trend-label">of total</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("54 employees absent today (10.5% of total workforce).")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#ffebe9", color: "#d9381e" }}><FaUserTimes /></div><span className="wf-metric-title">Absent Today</span></div>
                  <div className="wf-metric-value">54</div>
                  <div className="wf-metric-trend down">↑ 10.5% <span className="wf-metric-trend-label">of total</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("30 employees on approved leave today (5.9% of total).")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fff7ed", color: "#c2410c" }}><FaBriefcase /></div><span className="wf-metric-title">On Leave</span></div>
                  <div className="wf-metric-value">30</div>
                  <div className="wf-metric-trend" style={{ color: "#c2410c" }}>→ 5.9% <span className="wf-metric-trend-label">of total</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("16 late arrivals recorded today (3.1% of present).")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#f3e8ff", color: "#7e22ce" }}><FaClock /></div><span className="wf-metric-title">Late Arrivals</span></div>
                  <div className="wf-metric-value">16</div>
                  <div className="wf-metric-trend" style={{ color: "#7e22ce" }}>↑ 3.1% <span className="wf-metric-trend-label">of present</span></div>
                </div>
              </section>

              <section className="wf-teams-grid">
                <div className="wf-card">
                  <div className="wf-card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <h2 className="wf-card-title">Attendance Overview</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <select className="wf-select-filter" value={attendanceDateFilter} onChange={(e) => setAttendanceDateFilter(e.target.value)}>
                        <option value="May 1 – May 31, 2025">📅 May 1 – May 31, 2025</option>
                        <option value="April 1 – April 30, 2025">📅 April 1 – April 30, 2025</option>
                      </select>

                      <select className="wf-select-filter" value={attendanceDeptFilter} onChange={(e) => setAttendanceDeptFilter(e.target.value)}>
                        <option value="All Departments">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Human Resources">Human Resources</option>
                      </select>

                      <button className="wf-hamburger-btn" style={{ width: "34px", height: "34px" }} title="Filter Logs">
                        <FaFilterIcon style={{ fontSize: "13px" }} />
                      </button>

                      <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "8px 14px", background: "var(--wf-accent-dark-brown, #5c2c19)" }} onClick={() => setShowCalendarModal(true)}>
                        <FaCalendarAlt /> View Calendar
                      </button>

                      <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "8px 14px", background: "#f9572a" }} onClick={() => setShowApplyLeaveModal(true)}>
                        <FaPlus /> Apply for Leave
                      </button>

                      <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "8px 14px" }} onClick={() => setShowExportModal(true)}>
                        <FaFileExport /> Export Report
                      </button>
                    </div>
                  </div>

                  {/* Leave Requests Queue */}
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", background: themeMode === 'dark' ? "rgba(255,255,255,0.02)" : "#FAF8F5" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>📋 Leave Requests & Approval Status</span>
                        {(leaveRequests || []).length > 0 && (
                          <span style={{ fontSize: "11px", background: "#FFF0ED", color: "#F9572A", padding: "2px 8px", borderRadius: "10px" }}>
                            {(leaveRequests || []).length} Total
                          </span>
                        )}
                      </h4>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>Synced with Admin Portal</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                      {(leaveRequests || []).map(lr => (
                        <div key={lr.id} style={{
                          background: themeMode === 'dark' ? '#1E293B' : '#FFFFFF',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: '12px',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '750', fontSize: '13px' }}>{lr.employeeName}</span>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: '800',
                              textTransform: 'capitalize',
                              background: themeMode === 'dark'
                                ? (lr.status === 'approved' ? 'rgba(16, 185, 129, 0.25)' : lr.status === 'rejected' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)')
                                : (lr.status === 'approved' ? '#ECFDF5' : lr.status === 'rejected' ? '#FEF2F2' : '#FFFBEB'),
                              color: themeMode === 'dark'
                                ? (lr.status === 'approved' ? '#34D399' : lr.status === 'rejected' ? '#F87171' : '#FBBF24')
                                : (lr.status === 'approved' ? '#047857' : lr.status === 'rejected' ? '#B91C1C' : '#B45309'),
                              border: themeMode === 'dark'
                                ? (lr.status === 'approved' ? '1px solid rgba(52, 211, 153, 0.35)' : lr.status === 'rejected' ? '1px solid rgba(248, 113, 113, 0.35)' : '1px solid rgba(251, 191, 36, 0.35)')
                                : 'none'
                            }}>
                              {lr.status === 'approved' ? '✓ Approved' : lr.status === 'rejected' ? '✕ Rejected' : '⏳ Pending'}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            {lr.leaveType} • {lr.startDate} to {lr.endDate} ({lr.days}d)
                          </div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>
                            "{lr.reason}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="wf-table-responsive">
                    <table className="wf-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>Work Hours</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttendance.map(log => (
                          <tr key={log.empId}>
                            <td>
                              <div className="wf-team-cell">
                                <img src={log.avatar} alt={log.name} className="wf-activity-avatar" />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: "700", color: "var(--wf-text-primary)" }}>{log.name}</span>
                                  <span className="wf-emp-id-sub">{log.empId}</span>
                                </div>
                              </div>
                            </td>

                            <td>{log.dept}</td>

                            <td>
                              <span className={`wf-status-pill ${
                                log.status === "Present" ? "present" :
                                log.status === "Absent" ? "absent" :
                                log.status === "On Leave" ? "onleave" : "late"
                              }`}>
                                {log.status}
                              </span>
                            </td>

                            <td>{log.checkIn}</td>
                            <td>{log.checkOut}</td>
                            <td><strong>{log.workHours}</strong></td>

                            <td>
                              <button className="wf-action-dots-btn" onClick={() => alert(`Attendance details for ${log.name} (${log.empId})`)}>
                                <FaEllipsisV />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="wf-pagination">
                    <span>Showing 1 to {filteredAttendance.length} of 512 employees</span>
                    <div className="wf-page-numbers">
                      <button className="wf-page-btn">&lt;</button>
                      <button className="wf-page-btn active">1</button>
                      <button className="wf-page-btn">2</button>
                      <button className="wf-page-btn">3</button>
                      <span>...</span>
                      <button className="wf-page-btn">103</button>
                      <button className="wf-page-btn">&gt;</button>
                    </div>
                  </div>
                </div>

                <div className="wf-teams-right-stack">
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Attendance Summary</h2>
                      <select className="wf-select-filter">
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>

                    <div className="wf-skill-donut-wrapper">
                      <div className="wf-donut-chart-box" style={{ width: "150px", height: "150px" }}>
                        <svg width="150" height="150" viewBox="0 0 150 150">
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#22c55e" strokeWidth="20" strokeDasharray="273 53.7" strokeDashoffset="0" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="34.3 292.4" strokeDashoffset="-273" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="19.3 307.4" strokeDashoffset="-307.3" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#a855f7" strokeWidth="20" strokeDasharray="10.1 316.6" strokeDashoffset="-326.6" />
                        </svg>
                        <div className="wf-donut-center-text">
                          <span className="wf-donut-number" style={{ fontSize: "20px" }}>83.6%</span>
                          <span className="wf-donut-label" style={{ fontSize: "10px" }}>Average<br />Attendance</span>
                        </div>
                      </div>

                      <div className="wf-donut-legend-list">
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#22c55e" }} /><span>Present</span></div><span className="wf-donut-percent">83.6% (428)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#ef4444" }} /><span>Absent</span></div><span className="wf-donut-percent">10.5% (54)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#f97316" }} /><span>On Leave</span></div><span className="wf-donut-percent">5.9% (30)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#a855f7" }} /><span>Late Arrivals</span></div><span className="wf-donut-percent">3.1% (16)</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Attendance Trend</h2>
                      <select className="wf-select-filter">
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>

                    <div className="wf-overview-chart-container">
                      <svg className="wf-svg-line-chart" viewBox="0 0 340 150">
                        <defs>
                          <linearGradient id="attTrendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8c5338" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8c5338" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        <line x1="30" y1="20" x2="330" y2="20" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="45" x2="330" y2="45" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="70" x2="330" y2="70" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="95" x2="330" y2="95" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="120" x2="330" y2="120" stroke="#ebdcd0" strokeWidth="1.5" />

                        <text x="10" y="24" fill="#a39285" fontSize="9">100%</text>
                        <text x="10" y="49" fill="#a39285" fontSize="9">75%</text>
                        <text x="10" y="74" fill="#a39285" fontSize="9">50%</text>
                        <text x="10" y="99" fill="#a39285" fontSize="9">25%</text>
                        <text x="15" y="124" fill="#a39285" fontSize="9">0%</text>

                        <path d="M 40 90 Q 90 65, 140 45 T 240 50 T 310 40 L 310 120 L 40 120 Z" fill="url(#attTrendGrad)" />
                        <path d="M 40 90 Q 90 65, 140 45 T 240 50 T 310 40" fill="none" stroke="#8c5338" strokeWidth="2.5" strokeLinecap="round" />

                        <circle cx="40" cy="90" r="3.5" fill="#8c5338" />
                        <circle cx="95" cy="65" r="3.5" fill="#8c5338" />
                        <circle cx="150" cy="45" r="3.5" fill="#8c5338" />
                        <circle cx="205" cy="50" r="3.5" fill="#8c5338" />
                        <circle cx="260" cy="55" r="3.5" fill="#8c5338" />
                        <circle cx="310" cy="40" r="3.5" fill="#8c5338" />

                        <text x="40" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 1</text>
                        <text x="95" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 7</text>
                        <text x="150" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 14</text>
                        <text x="205" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 21</text>
                        <text x="260" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 28</text>
                        <text x="310" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May 31</text>
                      </svg>
                    </div>
                  </div>

                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Top Departments by Attendance</h2>
                      <span className="wf-card-action" onClick={() => alert("Viewing department attendance details...")}>View All</span>
                    </div>

                    <div className="wf-dept-att-list">
                      <div className="wf-dept-att-row">
                        <div className="wf-dept-att-info">
                          <FaUsers style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Engineering</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "88.2%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "42px", fontWeight: "800" }}>88.2%</span>
                        </div>
                      </div>

                      <div className="wf-dept-att-row">
                        <div className="wf-dept-att-info">
                          <FaUsers style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Marketing</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "85.4%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "42px", fontWeight: "800" }}>85.4%</span>
                        </div>
                      </div>

                      <div className="wf-dept-att-row">
                        <div className="wf-dept-att-info">
                          <FaUsers style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Data Science</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "82.7%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "42px", fontWeight: "800" }}>82.7%</span>
                        </div>
                      </div>

                      <div className="wf-dept-att-row">
                        <div className="wf-dept-att-info">
                          <FaUsers style={{ color: "#8c5338", fontSize: "14px" }} />
                          <span>Human Resources</span>
                        </div>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "80.1%", background: "#22c55e" }} /></div>
                          <span className="wf-progress-val" style={{ width: "42px", fontWeight: "800" }}>80.1%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: EMPLOYEES MANAGEMENT */}
          {activeTab === "Employees" && (
            <>
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Employees Management Control Panel</h1>
                  <p>Real-time workforce management center for employees. Access team allocation tools and analytics.</p>
                  <button className="wf-btn-primary" style={{ marginTop: "14px" }} onClick={() => setActiveTab("Overview")}>
                    Return to Overview Dashboard
                  </button>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.18)" stroke="rgba(212, 140, 102, 0.35)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.15)" stroke="rgba(224, 122, 95, 0.3)" strokeWidth="1.5" />
                  </svg>
                  <img
                    src={themeMode === 'dark' ? (darkWorkforcePortalImg || darkWorkHubHeroImg) : workforcePortalImg}
                    alt="Employees Team Graphic"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              <section className="wf-metrics-grid">
                <div className="wf-metric-card" onClick={() => setEmpSearch("")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUsers /></div><span className="wf-metric-title">Total Employees</span></div>
                  <div className="wf-metric-value">{employees.length || 512}</div>
                  <div className="wf-metric-trend">↑ {employees.length ? employees.length - 4 : 18} <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => setEmpSearch("Active")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#faf0e6" }}><FaUserCheck /></div><span className="wf-metric-title">Active Employees</span></div>
                  <div className="wf-metric-value">{employees.filter(e => e.status === "Active").length || 482}</div>
                  <div className="wf-metric-trend">↑ {employees.length ? employees.filter(e => e.status === "Active").length - 3 : 16} <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("16 new employees joined this month.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUserPlus /></div><span className="wf-metric-title">New Hires</span></div>
                  <div className="wf-metric-value">16</div>
                  <div className="wf-metric-trend">↑ 4 <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => setEmpSearch("Inactive")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#ffebe9" }}><FaUserTimes /></div><span className="wf-metric-title">Deactivated</span></div>
                  <div className="wf-metric-value">{employees.filter(e => e.status === "Inactive" || e.status === "Deactivated").length || 14}</div>
                  <div className="wf-metric-trend down">↓ 2 <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("8 active organizational departments.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaBuilding /></div><span className="wf-metric-title">Departments</span></div>
                  <div className="wf-metric-value">{new Set(employees.map(e => e.dept)).size || 8}</div>
                  <div className="wf-metric-trend" style={{ color: "var(--wf-text-muted)" }}>— <span className="wf-metric-trend-label">No change</span></div>
                </div>
              </section>

              <section className="wf-teams-grid">
                <div className="wf-card">
                  <div className="wf-card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <h2 className="wf-card-title">Employee Overview</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="wf-search-box" style={{ width: "200px", padding: "4px 12px" }}>
                        <FaSearch className="wf-search-icon" />
                        <input
                          type="text"
                          placeholder="Search employee..."
                          className="wf-search-input"
                          value={empSearch}
                          onChange={(e) => setEmpSearch(e.target.value)}
                        />
                      </div>
                      <button className="wf-hamburger-btn" style={{ width: "34px", height: "34px" }} title="Filter Employees">
                        <FaFilterIcon style={{ fontSize: "13px" }} />
                      </button>
                      <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "8px 14px" }} onClick={() => setShowEmployeeModal(true)}>
                        <FaPlus /> Add Employee
                      </button>
                    </div>
                  </div>

                  <div className="wf-table-responsive">
                    <table className="wf-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Department</th>
                          <th>Designation</th>
                          <th>Status</th>
                          <th>Join Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map(emp => (
                          <tr key={emp.empId}>
                            <td>
                              <div className="wf-team-cell">
                                <img src={emp.avatar} alt={emp.name} className="wf-activity-avatar" />
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <span style={{ fontWeight: "700", color: "var(--wf-text-primary)" }}>{emp.name}</span>
                                  <span className="wf-emp-id-sub">{emp.empId}</span>
                                </div>
                              </div>
                            </td>

                            <td>{emp.dept}</td>
                            <td>{emp.designation}</td>

                            <td>
                              <span className={`wf-status-pill ${emp.status === "Active" ? "completed" : "not-started"}`}>
                                {emp.status}
                              </span>
                            </td>

                            <td>{emp.joinDate}</td>

                            <td>
                              <button className="wf-action-dots-btn" onClick={() => alert(`Actions for employee: ${emp.name} (${emp.empId})`)}>
                                <FaEllipsisV />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="wf-pagination">
                    <span>Showing 1 to {filteredEmployees.length} of 512 employees</span>
                    <div className="wf-page-numbers">
                      <button className="wf-page-btn">&lt;</button>
                      <button className="wf-page-btn active">1</button>
                      <button className="wf-page-btn">2</button>
                      <button className="wf-page-btn">3</button>
                      <span>...</span>
                      <button className="wf-page-btn">103</button>
                      <button className="wf-page-btn">&gt;</button>
                    </div>
                  </div>
                </div>

                <div className="wf-teams-right-stack">
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Employees by Department</h2>
                      <select className="wf-select-filter">
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>

                    <div className="wf-skill-donut-wrapper">
                      <div className="wf-donut-chart-box" style={{ width: "150px", height: "150px" }}>
                        <svg width="150" height="150" viewBox="0 0 150 150">
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#5c2c19" strokeWidth="20" strokeDasharray="130.6 196.3" strokeDashoffset="0" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#9e5837" strokeWidth="20" strokeDasharray="65.3 261.6" strokeDashoffset="-130.6" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#d48c66" strokeWidth="20" strokeDasharray="49 277.9" strokeDashoffset="-195.9" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#eacab5" strokeWidth="20" strokeDasharray="49 277.9" strokeDashoffset="-244.9" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#f5e4d7" strokeWidth="20" strokeDasharray="32.7 294.2" strokeDashoffset="-293.9" />
                        </svg>
                        <div className="wf-donut-center-text">
                          <span className="wf-donut-number" style={{ fontSize: "20px" }}>512</span>
                          <span className="wf-donut-label" style={{ fontSize: "10px" }}>Total</span>
                        </div>
                      </div>

                      <div className="wf-donut-legend-list">
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#5c2c19" }} /><span>Engineering</span></div><span className="wf-donut-percent">40% (205)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#9e5837" }} /><span>Operations</span></div><span className="wf-donut-percent">20% (102)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#d48c66" }} /><span>Marketing</span></div><span className="wf-donut-percent">15% (77)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#eacab5" }} /><span>Data Science</span></div><span className="wf-donut-percent">15% (77)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#f5e4d7" }} /><span>Human Resources</span></div><span className="wf-donut-percent">10% (51)</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Recent New Hires</h2>
                      <span className="wf-card-action" onClick={() => alert("Viewing all recent new hires...")}>View All</span>
                    </div>

                    <div className="wf-recent-hires-list">
                      <div className="wf-recent-hire-item">
                        <div className="wf-recent-hire-left">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Karan" className="wf-recent-hire-avatar" />
                          <div className="wf-recent-hire-details">
                            <span className="wf-recent-hire-name">Karan Malhotra</span>
                            <span className="wf-recent-hire-role">Product Designer</span>
                          </div>
                        </div>
                        <span className="wf-recent-hire-date">20 May, 2025</span>
                      </div>

                      <div className="wf-recent-hire-item">
                        <div className="wf-recent-hire-left">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Pooja" className="wf-recent-hire-avatar" />
                          <div className="wf-recent-hire-details">
                            <span className="wf-recent-hire-name">Pooja Nair</span>
                            <span className="wf-recent-hire-role">HR Generalist</span>
                          </div>
                        </div>
                        <span className="wf-recent-hire-date">18 May, 2025</span>
                      </div>

                      <div className="wf-recent-hire-item">
                        <div className="wf-recent-hire-left">
                          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Rohit" className="wf-recent-hire-avatar" />
                          <div className="wf-recent-hire-details">
                            <span className="wf-recent-hire-name">Rohit Das</span>
                            <span className="wf-recent-hire-role">Data Analyst</span>
                          </div>
                        </div>
                        <span className="wf-recent-hire-date">15 May, 2025</span>
                      </div>
                    </div>

                    <span className="wf-card-action" style={{ marginTop: "14px", alignSelf: "flex-start" }} onClick={() => alert("Redirecting to New Hires Onboarding Hub...")}>
                      View all new hires →
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 3: TEAMS MANAGEMENT */}
          {activeTab === "Teams" && (
            <>
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Teams Management Control Panel</h1>
                  <p>Real-time workforce management center for teams. Access team allocation tools and analytics.</p>
                  <button className="wf-btn-primary" style={{ marginTop: "14px" }} onClick={() => setActiveTab("Overview")}>
                    Return to Overview Dashboard
                  </button>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.18)" stroke="rgba(212, 140, 102, 0.35)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.15)" stroke="rgba(224, 122, 95, 0.3)" strokeWidth="1.5" />
                  </svg>
                  <img
                    src={themeMode === 'dark' ? (darkWorkHubHeroImg || darkHeroImg) : workHubHeroImg}
                    alt="Teams Graphic"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              <section className="wf-metrics-grid">
                <div className="wf-metric-card" onClick={() => alert("Active Teams across organizational departments.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUserFriends /></div><span className="wf-metric-title">Total Teams</span></div>
                  <div className="wf-metric-value">{teamsList.length || 24}</div>
                  <div className="wf-metric-trend">↑ {teamsList.length ? teamsList.length - 4 : 3} <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("Total team members allocated.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#faf0e6" }}><FaUsers /></div><span className="wf-metric-title">Total Members</span></div>
                  <div className="wf-metric-value">{teamsList.reduce((acc, t) => acc + (t.members || 0), 0) || 512}</div>
                  <div className="wf-metric-trend">↑ 18 <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("Organizational business departments.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaBuilding /></div><span className="wf-metric-title">Departments</span></div>
                  <div className="wf-metric-value">{new Set(teamsList.map(t => t.dept)).size || 8}</div>
                  <div className="wf-metric-trend">↗ 1 <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("Active teams currently executing projects.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#e6f4ea" }}><FaUserCheck /></div><span className="wf-metric-title">Active Teams</span></div>
                  <div className="wf-metric-value">{teamsList.filter(t => t.status === "Active").length || 21}</div>
                  <div className="wf-metric-trend">↑ 2 <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("New teams formed this month.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#ffebe9" }}><FaUserPlus /></div><span className="wf-metric-title">New Teams</span></div>
                  <div className="wf-metric-value">{teamsList.filter(t => t.status === "New").length || 2}</div>
                  <div className="wf-metric-trend down">↓ 1 <span className="wf-metric-trend-label">from last month</span></div>
                </div>
              </section>

              <section className="wf-teams-grid">
                <div className="wf-card">
                  <div className="wf-card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <h2 className="wf-card-title">Teams Overview</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="wf-search-box" style={{ width: "200px", padding: "4px 12px" }}>
                        <FaSearch className="wf-search-icon" />
                        <input
                          type="text"
                          placeholder="Search team..."
                          className="wf-search-input"
                          value={teamSearch}
                          onChange={(e) => setTeamSearch(e.target.value)}
                        />
                      </div>
                      <button className="wf-hamburger-btn" style={{ width: "34px", height: "34px" }} title="Filter Teams">
                        <FaFilterIcon style={{ fontSize: "13px" }} />
                      </button>
                      <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "8px 14px" }} onClick={() => setShowCreateTeamModal(true)}>
                        <FaPlus /> Create Team
                      </button>
                    </div>
                  </div>

                  <div className="wf-table-responsive">
                    <table className="wf-table">
                      <thead>
                        <tr>
                          <th>Team Name</th>
                          <th>Team Lead</th>
                          <th>Members</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeams.map(t => (
                          <tr key={t.id}>
                            <td>
                              <div className="wf-team-name-box">
                                <div className="wf-team-icon-avatar" style={{ background: getTeamIconBg(t.dept), color: getTeamIconColor(t.dept) }}>
                                  {getTeamIcon(t.dept)}
                                </div>
                                <div className="wf-team-title-text">
                                  <span className="wf-team-title-main">{t.name}</span>
                                  <span className="wf-team-desc-sub">{t.desc || t.description}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="wf-team-lead-cell">
                                <img src={t.leadAvatar} alt={t.leadName} className="wf-team-lead-avatar" />
                                <div className="wf-team-lead-info">
                                  <span className="wf-team-lead-name">{t.leadName}</span>
                                  <span className="wf-team-lead-dept">{t.leadDept}</span>
                                </div>
                              </div>
                            </td>

                            <td><strong>{t.members}</strong></td>
                            <td>{t.dept}</td>

                            <td>
                              <span className={`wf-status-pill ${t.status === "Active" ? "completed" : "not-started"}`}>
                                {t.status}
                              </span>
                            </td>

                            <td>
                              <button className="wf-action-dots-btn" onClick={() => alert(`Actions for team: ${t.name}`)}>
                                <FaEllipsisV />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="wf-pagination">
                    <span>Showing 1 to {filteredTeams.length} of 24 teams</span>
                    <div className="wf-page-numbers">
                      <button className="wf-page-btn">&lt;</button>
                      <button className="wf-page-btn active">1</button>
                      <button className="wf-page-btn">2</button>
                      <button className="wf-page-btn">3</button>
                      <span>...</span>
                      <button className="wf-page-btn">5</button>
                      <button className="wf-page-btn">&gt;</button>
                    </div>
                  </div>
                </div>

                <div className="wf-teams-right-stack">
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Team Allocation Summary</h2>
                      <select className="wf-select-filter">
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>

                    <div className="wf-skill-donut-wrapper">
                      <div className="wf-donut-chart-box" style={{ width: "150px", height: "150px" }}>
                        <svg width="150" height="150" viewBox="0 0 150 150">
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#5c2c19" strokeWidth="20" strokeDasharray="130.6 196.3" strokeDashoffset="0" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#9e5837" strokeWidth="20" strokeDasharray="65.3 261.6" strokeDashoffset="-130.6" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#d48c66" strokeWidth="20" strokeDasharray="49 277.9" strokeDashoffset="-195.9" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#eacab5" strokeWidth="20" strokeDasharray="49 277.9" strokeDashoffset="-244.9" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#f5e4d7" strokeWidth="20" strokeDasharray="32.7 294.2" strokeDashoffset="-293.9" />
                        </svg>
                        <div className="wf-donut-center-text">
                          <span className="wf-donut-number" style={{ fontSize: "20px" }}>512</span>
                          <span className="wf-donut-label" style={{ fontSize: "10px" }}>Total Members</span>
                        </div>
                      </div>

                      <div className="wf-donut-legend-list">
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#5c2c19" }} /><span>Engineering</span></div><span className="wf-donut-percent">40% (205)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#9e5837" }} /><span>Operations</span></div><span className="wf-donut-percent">20% (102)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#d48c66" }} /><span>Marketing</span></div><span className="wf-donut-percent">15% (77)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#eacab5" }} /><span>Data Science</span></div><span className="wf-donut-percent">15% (77)</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#f5e4d7" }} /><span>Human Resources</span></div><span className="wf-donut-percent">10% (51)</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Top Performing Teams</h2>
                      <span className="wf-card-action" onClick={() => alert("Viewing all top team performance metrics...")}>View All</span>
                    </div>

                    <div className="wf-top-teams-list">
                      <div className="wf-top-team-row">
                        <span className="wf-top-team-rank">1</span>
                        <span className="wf-top-team-name">Product Development</span>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "85%" }} /></div>
                          <span className="wf-progress-val">85%</span>
                        </div>
                      </div>

                      <div className="wf-top-team-row">
                        <span className="wf-top-team-rank rank-2">2</span>
                        <span className="wf-top-team-name">Customer Success</span>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "78%" }} /></div>
                          <span className="wf-progress-val">78%</span>
                        </div>
                      </div>

                      <div className="wf-top-team-row">
                        <span className="wf-top-team-rank rank-3">3</span>
                        <span className="wf-top-team-name">Data Analytics</span>
                        <div className="wf-progress-container" style={{ flex: 1 }}>
                          <div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "75%" }} /></div>
                          <span className="wf-progress-val">75%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "Overview" && (
            <>
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Welcome back, {user?.full_name || user?.username || "Manager"}! 👋</h1>
                  <p>Here's what's happening with your workforce today.</p>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.15)" stroke="rgba(212, 140, 102, 0.3)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.12)" stroke="rgba(224, 122, 95, 0.25)" strokeWidth="1.5" />
                  </svg>
                  <select className="wf-select-filter" style={{ padding: "8px 14px", fontSize: "13px", fontWeight: "700" }}>
                    <option>📅 May 1 – May 31, 2025</option>
                    <option>📅 April 1 – April 30, 2025</option>
                  </select>
                  <img
                    src={themeMode === 'dark' ? (darkWorkforcePortalImg || darkWorkHubHeroImg) : (workforcePortalImg || workHubHeroImg)}
                    alt="Workforce Team Hero Graphic"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              {/* TOP 5 METRICS CARDS */}
              <section className="wf-metrics-grid">
                <div className="wf-metric-card" onClick={() => setActiveTab("Employees")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUsers /></div><span className="wf-metric-title">Total Employees</span></div>
                  <div className="wf-metric-value">{employees.length || 512}</div>
                  <div className="wf-metric-trend">↑ 18 <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => setActiveTab("Skills")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#faf0e6" }}><FaStar /></div><span className="wf-metric-title">Average Skill Score</span></div>
                  <div className="wf-metric-value">
                    {employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + (e.score || 80), 0) / employees.length) + "%" : "78%"}
                  </div>
                  <div className="wf-metric-trend">↑ 6% <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => setActiveTab("Overview")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaBookOpen /></div><span className="wf-metric-title">Active Projects</span></div>
                  <div className="wf-metric-value">{projects.length}</div>
                  <div className="wf-metric-trend">↑ {projects.length} <span className="wf-metric-trend-label">from last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => setActiveTab("Attendance")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fff7ed", color: "#c2410c" }}><FaBriefcase /></div><span className="wf-metric-title">Pending Leaves</span></div>
                  <div className="wf-metric-value">{leaveRequests.filter(r => r.status === "PENDING").length}</div>
                  <div className="wf-metric-trend">Action Req <span className="wf-metric-trend-label">leaves pending</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => setActiveTab("Employees")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUserPlus /></div><span className="wf-metric-title">New Hires</span></div>
                  <div className="wf-metric-value">16</div>
                  <div className="wf-metric-trend">↑ 4 <span className="wf-metric-trend-label">from last month</span></div>
                </div>
              </section>

              {/* MIDDLE SECTION */}
              <section className="wf-middle-grid">
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Workforce Overview</h2>
                    <select className="wf-select-filter" value={overviewFilter} onChange={(e) => setOverviewFilter(e.target.value)}>
                      <option value="This Month">This Month</option>
                      <option value="Last Month">Last Month</option>
                      <option value="This Quarter">This Quarter</option>
                    </select>
                  </div>

                  <div className="wf-overview-chart-container">
                    <div className="wf-chart-legend">
                      <div className="wf-legend-item"><span className="wf-legend-line solid" /><span>Active Employees</span></div>
                      <div className="wf-legend-item"><span className="wf-legend-line dashed" /><span>New Hires</span></div>
                    </div>

                    <svg className="wf-svg-line-chart" viewBox="0 0 440 200">
                      <line x1="40" y1="30" x2="420" y2="30" stroke="#f2e8df" strokeWidth="1" />
                      <line x1="40" y1="60" x2="420" y2="60" stroke="#f2e8df" strokeWidth="1" />
                      <line x1="40" y1="90" x2="420" y2="90" stroke="#f2e8df" strokeWidth="1" />
                      <line x1="40" y1="120" x2="420" y2="120" stroke="#f2e8df" strokeWidth="1" />
                      <line x1="40" y1="150" x2="420" y2="150" stroke="#f2e8df" strokeWidth="1" />
                      <line x1="40" y1="180" x2="420" y2="180" stroke="#ebdcd0" strokeWidth="1.5" />

                      <text x="10" y="35" fill="#a39285" fontSize="10">600</text>
                      <text x="10" y="65" fill="#a39285" fontSize="10">500</text>
                      <text x="10" y="95" fill="#a39285" fontSize="10">400</text>
                      <text x="10" y="125" fill="#a39285" fontSize="10">300</text>
                      <text x="10" y="155" fill="#a39285" fontSize="10">200</text>
                      <text x="25" y="184" fill="#a39285" fontSize="10">0</text>

                      <path d={activePathD} fill="none" stroke="#5c2c19" strokeWidth="3.5" strokeLinecap="round" />
                      <path d={newHiresPathD} fill="none" stroke="#d48c66" strokeWidth="2.5" strokeDasharray="5,5" strokeLinecap="round" />

                      {lineChartData.active.map((pt, i) => (
                        <circle key={`act-${i}`} cx={pt.x} cy={pt.y} r="5" fill="#5c2c19" stroke="#ffffff" strokeWidth="2" style={{ cursor: "pointer" }}
                          onMouseEnter={() => setHoveredPoint({ label: `Active: ${pt.val}`, x: pt.x, y: pt.y - 12 })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}

                      {lineChartData.newHires.map((pt, i) => (
                        <circle key={`nh-${i}`} cx={pt.x} cy={pt.y} r="4" fill="#d48c66" stroke="#ffffff" strokeWidth="2" style={{ cursor: "pointer" }}
                          onMouseEnter={() => setHoveredPoint({ label: `New: ${pt.val}`, x: pt.x, y: pt.y - 12 })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}

                      {hoveredPoint && (
                        <g>
                          <rect x={hoveredPoint.x - 30} y={hoveredPoint.y - 18} width="60" height="20" rx="4" fill="#332219" />
                          <text x={hoveredPoint.x} y={hoveredPoint.y - 5} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                            {hoveredPoint.label}
                          </text>
                        </g>
                      )}

                      <text x="40" y="196" textAnchor="middle" fill="#a39285" fontSize="10" fontWeight="600">May 1</text>
                      <text x="130" y="196" textAnchor="middle" fill="#a39285" fontSize="10" fontWeight="600">May 8</text>
                      <text x="220" y="196" textAnchor="middle" fill="#a39285" fontSize="10" fontWeight="600">May 15</text>
                      <text x="310" y="196" textAnchor="middle" fill="#a39285" fontSize="10" fontWeight="600">May 22</text>
                      <text x="400" y="196" textAnchor="middle" fill="#a39285" fontSize="10" fontWeight="600">May 29</text>
                    </svg>
                  </div>
                </div>

                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Skill Distribution</h2>
                    <span className="wf-card-action" onClick={() => setActiveTab("Skills")}>View Details →</span>
                  </div>

                  <div className="wf-skill-donut-wrapper">
                    <div className="wf-donut-chart-box">
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r="50" fill="none" stroke="#5c2c19" strokeWidth="20" strokeDasharray="75.4 238.7" strokeDashoffset="0" />
                        <circle cx="70" cy="70" r="50" fill="none" stroke="#9e5837" strokeWidth="20" strokeDasharray="125.6 188.5" strokeDashoffset="-75.4" />
                        <circle cx="70" cy="70" r="50" fill="none" stroke="#d48c66" strokeWidth="20" strokeDasharray="72.2 241.9" strokeDashoffset="-201" />
                        <circle cx="70" cy="70" r="50" fill="none" stroke="#eacab5" strokeWidth="20" strokeDasharray="40.8 273.3" strokeDashoffset="-273.2" />
                      </svg>
                      <div className="wf-donut-center-text">
                        <span className="wf-donut-number">512</span>
                        <span className="wf-donut-label">Employees</span>
                      </div>
                    </div>

                    <div className="wf-donut-legend-list">
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#5c2c19" }} /><span>Expert (80-100%)</span></div><span className="wf-donut-percent">24%</span></div>
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#9e5837" }} /><span>Proficient (60-79%)</span></div><span className="wf-donut-percent">40%</span></div>
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#d48c66" }} /><span>Competent (40-59%)</span></div><span className="wf-donut-percent">23%</span></div>
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#eacab5" }} /><span>Beginner (0-39%)</span></div><span className="wf-donut-percent">13%</span></div>
                    </div>
                  </div>
                </div>

                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Recent Activities</h2>
                    <span className="wf-card-action" onClick={() => setActiveTab("Employees")}>View All →</span>
                  </div>

                  <div className="wf-activity-list">
                    <div className="wf-activity-item">
                      <div className="wf-activity-left">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Riya" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-text"><span className="wf-activity-name">Riya Sharma</span> completed Leadership Training</span>
                        </div>
                      </div>
                      <span className="wf-activity-time">10:30 AM</span>
                    </div>

                    <div className="wf-activity-item">
                      <div className="wf-activity-left">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Aman" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-text"><span className="wf-activity-name">Aman Verma</span> joined Product Development team</span>
                        </div>
                      </div>
                      <span className="wf-activity-time">Yesterday</span>
                    </div>

                    <div className="wf-activity-item">
                      <div className="wf-activity-left">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Neha" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-text"><span className="wf-activity-name">Neha Patel</span> completed Communication Skills</span>
                        </div>
                      </div>
                      <span className="wf-activity-time">2 May, 2025</span>
                    </div>

                    <div className="wf-activity-item">
                      <div className="wf-activity-left">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Vikram" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-text"><span className="wf-activity-name">Vikram Singh</span> completed Cybersecurity Basics</span>
                        </div>
                      </div>
                      <span className="wf-activity-time">1 May, 2025</span>
                    </div>

                    <div className="wf-activity-item">
                      <div className="wf-activity-left">
                        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Sneha" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-text"><span className="wf-activity-name">Sneha Iyer</span> joined Marketing team</span>
                        </div>
                      </div>
                      <span className="wf-activity-time">30 Apr, 2025</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* BOTTOM SECTION */}
              <section className="wf-bottom-grid">
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Team Performance Overview</h2>
                    <span className="wf-card-action" onClick={() => setActiveTab("Teams")}>View Report →</span>
                  </div>

                  <div className="wf-table-responsive">
                    <table className="wf-table">
                      <thead>
                        <tr>
                          <th>Team</th><th>Total Members</th><th>Avg. Skill Score</th><th>Training Progress</th><th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="wf-team-cell">
                              <div className="wf-avatar-stack">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="m1" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="m2" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="m3" className="wf-avatar-stack-img" />
                              </div>
                              <span>Product Development</span>
                            </div>
                          </td>
                          <td><strong>96</strong></td><td>82%</td>
                          <td><div className="wf-progress-container"><div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "76%" }} /></div><span className="wf-progress-val">76%</span></div></td>
                          <td><span className="wf-perf-pill excellent">Excellent</span></td>
                        </tr>

                        <tr>
                          <td>
                            <div className="wf-team-cell">
                              <div className="wf-avatar-stack">
                                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="m1" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="m2" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="m3" className="wf-avatar-stack-img" />
                              </div>
                              <span>Marketing</span>
                            </div>
                          </td>
                          <td><strong>64</strong></td><td>74%</td>
                          <td><div className="wf-progress-container"><div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "63%" }} /></div><span className="wf-progress-val">63%</span></div></td>
                          <td><span className="wf-perf-pill good">Good</span></td>
                        </tr>

                        <tr>
                          <td>
                            <div className="wf-team-cell">
                              <div className="wf-avatar-stack">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="m1" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="m2" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="m3" className="wf-avatar-stack-img" />
                              </div>
                              <span>Sales</span>
                            </div>
                          </td>
                          <td><strong>78</strong></td><td>71%</td>
                          <td><div className="wf-progress-container"><div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "58%" }} /></div><span className="wf-progress-val">58%</span></div></td>
                          <td><span className="wf-perf-pill good">Good</span></td>
                        </tr>

                        <tr>
                          <td>
                            <div className="wf-team-cell">
                              <div className="wf-avatar-stack">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="m1" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="m2" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="m3" className="wf-avatar-stack-img" />
                              </div>
                              <span>Customer Success</span>
                            </div>
                          </td>
                          <td><strong>52</strong></td><td>79%</td>
                          <td><div className="wf-progress-container"><div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "70%" }} /></div><span className="wf-progress-val">70%</span></div></td>
                          <td><span className="wf-perf-pill excellent">Excellent</span></td>
                        </tr>

                        <tr>
                          <td>
                            <div className="wf-team-cell">
                              <div className="wf-avatar-stack">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="m1" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="m2" className="wf-avatar-stack-img" />
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="m3" className="wf-avatar-stack-img" />
                              </div>
                              <span>Operations</span>
                            </div>
                          </td>
                          <td><strong>44</strong></td><td>68%</td>
                          <td><div className="wf-progress-container"><div className="wf-progress-bar-track"><div className="wf-progress-bar-fill" style={{ width: "50%" }} /></div><span className="wf-progress-val">50%</span></div></td>
                          <td><span className="wf-perf-pill average">Average</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Upcoming Trainings</h2>
                    <span className="wf-card-action" onClick={() => setActiveTab("Learning")}>View Calendar →</span>
                  </div>

                  <div className="wf-training-list">
                    <div className="wf-training-item-exact" onClick={() => setActiveTab("Learning")}>
                      <div className="wf-training-left-exact">
                        <div className="wf-date-badge-exact">
                          <span className="wf-date-day-exact">07</span>
                          <span className="wf-date-month-exact">MAY</span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Trainer" className="wf-training-img-exact" />
                        <div className="wf-training-info-exact">
                          <span className="wf-training-title-exact">Advanced Excel for Managers</span>
                          <span className="wf-training-time-exact">11:00 AM – 01:00 PM</span>
                        </div>
                      </div>
                      <div className="wf-training-enrolled-exact">
                        <span className="wf-enrolled-num">24</span>
                        <span className="wf-enrolled-lbl">Enrolled</span>
                      </div>
                    </div>

                    <div className="wf-training-item-exact" onClick={() => setActiveTab("Learning")}>
                      <div className="wf-training-left-exact">
                        <div className="wf-date-badge-exact">
                          <span className="wf-date-day-exact">09</span>
                          <span className="wf-date-month-exact">MAY</span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Trainer" className="wf-training-img-exact" />
                        <div className="wf-training-info-exact">
                          <span className="wf-training-title-exact">Effective Communication</span>
                          <span className="wf-training-time-exact">02:00 PM – 04:00 PM</span>
                        </div>
                      </div>
                      <div className="wf-training-enrolled-exact">
                        <span className="wf-enrolled-num">18</span>
                        <span className="wf-enrolled-lbl">Enrolled</span>
                      </div>
                    </div>

                    <div className="wf-training-item-exact" onClick={() => setActiveTab("Learning")}>
                      <div className="wf-training-left-exact">
                        <div className="wf-date-badge-exact">
                          <span className="wf-date-day-exact">12</span>
                          <span className="wf-date-month-exact">MAY</span>
                        </div>
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Trainer" className="wf-training-img-exact" />
                        <div className="wf-training-info-exact">
                          <span className="wf-training-title-exact">Agile Project Management</span>
                          <span className="wf-training-time-exact">10:00 AM – 12:00 PM</span>
                        </div>
                      </div>
                      <div className="wf-training-enrolled-exact">
                        <span className="wf-enrolled-num">31</span>
                        <span className="wf-enrolled-lbl">Enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* BOTTOM HERO & ENGAGEMENT SCORE ROW */}
              <section className="wf-bottom-banner-grid">
                <div className="wf-invest-banner">
                  <div className="wf-invest-text">
                    <h3>Invest in people. Drive performance.</h3>
                    <p>Help your workforce learn, grow and achieve more together.</p>
                    <button className="wf-invest-btn" onClick={() => setActiveTab("Learning")}>
                      🏆 Explore Learning Paths →
                    </button>
                  </div>
                  <div className="wf-invest-graphic">
                    <img src={themeMode === 'dark' ? (darkHeroImg || engagementHeroImg) : engagementHeroImg} alt="Workforce Collaboration" className="wf-invest-img" />
                  </div>
                </div>

                <div className="wf-card wf-engagement-score-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Engagement Score</h2>
                    <span className="wf-card-action" onClick={() => setActiveTab("Engagement")}>View Insights →</span>
                  </div>
                  <div className="wf-engagement-score-body">
                    <div className="wf-score-donut">
                      <svg viewBox="0 0 100 65" className="wf-half-donut-svg">
                        <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--wf-card-border)" strokeWidth="12" strokeLinecap="round" />
                        <path d="M 10 55 A 40 40 0 0 1 76 22" fill="none" stroke="url(#engGrad)" strokeWidth="12" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d48c66" />
                            <stop offset="100%" stopColor="#e07a5f" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="wf-score-center">
                        <span className="wf-score-value">76%</span>
                        <span className="wf-score-label">Good</span>
                      </div>
                    </div>
                    <div className="wf-score-stats">
                      <span className="wf-score-trend">↑ 7% <span className="wf-score-sub">from last month</span></span>
                      <p className="wf-score-msg">Keep up the great work!</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* PROJECTS, LEAVES & CALENDAR SECTION */}
              <section className="wf-middle-grid" style={{ marginTop: "24px" }}>
                {/* Project Allocations Panel */}
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Project Allocations</h2>
                    <button className="wf-btn-primary" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => setShowProjectModal(true)}>+ Assign Project</button>
                  </div>
                  <div className="wf-home-projects-list" style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {projects.length === 0 ? (
                      <p style={{ color: "var(--wf-text-faint)", fontSize: "14px" }}>No projects assigned.</p>
                    ) : (
                      projects.map(proj => (
                        <div key={proj.id} className="wf-home-project-card" style={{ padding: "14px", border: "1px solid var(--wf-card-border)", borderRadius: "8px" }}>
                          <div className="wf-home-project-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <div>
                              <h4 style={{ margin: 0, fontWeight: "bold" }}>{proj.title}</h4>
                              <span className="wf-home-project-assignee" style={{ fontSize: "12px", color: "var(--wf-text-muted)" }}>Assigned to: <strong>{proj.assignee}</strong></span>
                            </div>
                            <span className={`wf-status-pill ${proj.priority.toLowerCase()}`} style={{ fontSize: "11px" }}>{proj.priority}</span>
                          </div>
                          <div className="wf-home-progress-container" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="wf-home-progress-bg" style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                              <div className="wf-home-progress-fill" style={{ width: `${proj.progress}%`, height: "100%", background: "linear-gradient(90deg, #ff00c8, #8a2eff)" }}></div>
                            </div>
                            <span className="wf-home-progress-pct" style={{ fontSize: "12px" }}>{proj.progress}%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Leave Approvals Panel */}
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Leave Approvals</h2>
                  </div>
                  <div className="wf-home-leave-list" style={{ marginTop: "14px" }}>
                    {leaveRequests.length === 0 ? (
                      <p style={{ color: "var(--wf-text-faint)", fontSize: "14px" }}>No pending leave requests.</p>
                    ) : (
                      leaveRequests.map(req => (
                        <div key={req.id} className="wf-home-leave-item" style={{ marginBottom: "12px", padding: "14px", border: "1px solid var(--wf-card-border)", borderRadius: "8px" }}>
                          <div className="wf-home-leave-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span className="wf-home-leave-requester" style={{ fontWeight: "bold" }}>{req.name}</span>
                            <span className="wf-home-leave-type" style={{ fontSize: "12px", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>{req.type || "Leave"}</span>
                          </div>
                          <p className="wf-home-leave-details" style={{ fontSize: "13px", color: "var(--wf-text-muted)", margin: "6px 0" }}>"{req.details || req.desc}"</p>
                          {req.status === "PENDING" ? (
                            <div className="wf-home-leave-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                              <button className="wf-btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={() => handleLeaveDecision(req.id, "REJECTED")}>Reject</button>
                              <button className="wf-btn-primary" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={() => handleLeaveDecision(req.id, "APPROVED")}>Approve</button>
                            </div>
                          ) : (
                            <span className={`wf-status-pill ${req.status.toLowerCase()}`} style={{ float: "right" }}>{req.status}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Holiday Calendar Panel */}
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Holiday Calendar</h2>
                    <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "12px", color: "#ff00c8", fontWeight: "700" }}>{calYear}</span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <div className="wf-cal-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <button className="wf-hamburger-btn" style={{ width: "28px", height: "28px" }} onClick={prevMonth}>‹</button>
                      <span className="wf-cal-month-label" style={{ fontWeight: "bold" }}>{MONTH_NAMES[calMonth]}</span>
                      <button className="wf-hamburger-btn" style={{ width: "28px", height: "28px" }} onClick={nextMonth}>›</button>
                    </div>

                    <div className="wf-cal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
                      {DAY_NAMES.map(d => (
                        <div key={d} style={{ fontWeight: "700", color: "var(--wf-text-faint)", paddingBottom: "4px" }}>{d}</div>
                      ))}
                      {calCells().map((day, i) => {
                        const holiday = getHoliday(day);
                        const todayCell = isToday(day);
                        let bg = "transparent";
                        let border = "1px solid transparent";
                        let color = "inherit";
                        if (todayCell) {
                          bg = "rgba(0, 229, 255, 0.15)";
                          border = "1px solid #00e5ff";
                          color = "#00e5ff";
                        } else if (holiday) {
                          if (holiday.type === "national") {
                            bg = "rgba(255, 0, 200, 0.12)";
                            border = "1px solid rgba(255, 0, 200, 0.35)";
                            color = "#ff00c8";
                          } else {
                            bg = "rgba(138, 46, 255, 0.12)";
                            border = "1px solid rgba(138, 46, 255, 0.35)";
                            color = "#8a2eff";
                          }
                        }
                        return (
                          <div
                            key={i}
                            style={{
                              aspectRatio: "1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "6px",
                              background: bg,
                              border: border,
                              color: color,
                              fontSize: "11px",
                              fontWeight: (todayCell || holiday) ? "bold" : "normal",
                              opacity: day ? 1 : 0
                            }}
                            title={holiday ? holiday.name : (todayCell ? "Today" : "")}
                          >
                            {day || ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 4: SKILLS & ASSESSMENTS */}
          {activeTab === "Skills" && (
            <>
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Skills & Assessments</h1>
                  <p>Manage skills, track proficiency, and evaluate your teams with data-driven insights.</p>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.18)" stroke="rgba(212, 140, 102, 0.35)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.15)" stroke="rgba(224, 122, 95, 0.3)" strokeWidth="1.5" />
                  </svg>
                  <img
                    src={themeMode === 'dark' ? (darkFeatureHeroImg || darkWorkforcePortalImg) : featureHeroImg}
                    alt="Skills Illustration"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              <section className="wf-metrics-grid wf-metrics-grid-4">
                <div className="wf-metric-card" onClick={() => alert("Total Skills Matrix: active competency tags across departments.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaUsers /></div><span className="wf-metric-title">Total Skills</span></div>
                  <div className="wf-metric-value">142</div>
                  <div className="wf-metric-trend">↑ 12% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>
                <div className="wf-metric-card" onClick={() => alert("Skill evaluations completed.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#faf0e6" }}><FaClipboardCheck /></div><span className="wf-metric-title">Assessments Conducted</span></div>
                  <div className="wf-metric-value">{assessmentsList.length || 56}</div>
                  <div className="wf-metric-trend">↑ 8% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>
                <div className="wf-metric-card" onClick={() => alert("Team members assessed.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#f3e8f8" }}><FaUsers /></div><span className="wf-metric-title">Employees Assessed</span></div>
                  <div className="wf-metric-value">{employees.length || 248}</div>
                  <div className="wf-metric-trend">↑ 15% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>
                <div className="wf-metric-card" onClick={() => alert("Average workforce skill index.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#e6f4ea" }}><FaShieldAlt /></div><span className="wf-metric-title">Avg. Proficiency Score</span></div>
                  <div className="wf-metric-value">{employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + (e.score || 80), 0) / employees.length) + "%" : "78%"}</div>
                  <div className="wf-metric-trend">↑ 6% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>
              </section>

              <section className="wf-middle-grid">
                <div className="wf-card">
                  <div className="wf-card-header"><h2 className="wf-card-title">Skills Proficiency Overview</h2></div>
                  <div className="wf-skill-donut-wrapper" style={{ flexDirection: "column", gap: "20px" }}>
                    <div className="wf-donut-chart-box" style={{ width: "170px", height: "170px" }}>
                      <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="58" fill="none" stroke="#5c2c19" strokeWidth="22" strokeDasharray="102 262" strokeDashoffset="0" />
                        <circle cx="80" cy="80" r="58" fill="none" stroke="#9e5837" strokeWidth="22" strokeDasharray="182 182" strokeDashoffset="-102" />
                        <circle cx="80" cy="80" r="58" fill="none" stroke="#d48c66" strokeWidth="22" strokeDasharray="58 306" strokeDashoffset="-284" />
                        <circle cx="80" cy="80" r="58" fill="none" stroke="#eacab5" strokeWidth="22" strokeDasharray="22 342" strokeDashoffset="-342" />
                      </svg>
                      <div className="wf-donut-center-text"><span className="wf-donut-number" style={{ fontSize: "22px" }}>78%</span><span className="wf-donut-label">Average<br />Proficiency</span></div>
                    </div>
                    <div className="wf-donut-legend-list" style={{ width: "100%" }}>
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#5c2c19" }} /><span>Expert</span></div><span className="wf-donut-percent">28% (70)</span></div>
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#9e5837" }} /><span>Proficient</span></div><span className="wf-donut-percent">50% (126)</span></div>
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#d48c66" }} /><span>Intermediate</span></div><span className="wf-donut-percent">16% (40)</span></div>
                      <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#eacab5" }} /><span>Beginner</span></div><span className="wf-donut-percent">6% (12)</span></div>
                    </div>
                  </div>
                </div>

                <div className="wf-card">
                  <div className="wf-card-header"><h2 className="wf-card-title">Top Skills</h2><span className="wf-card-action" onClick={() => alert("Showing all top 15 organization skills...")}>View all</span></div>
                  <div className="wf-top-skills-list">
                    <div className="wf-skill-bar-row"><div className="wf-skill-bar-info"><span>Communication</span><span>92%</span></div><div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "92%" }} /></div></div>
                    <div className="wf-skill-bar-row"><div className="wf-skill-bar-info"><span>Leadership</span><span>85%</span></div><div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "85%" }} /></div></div>
                    <div className="wf-skill-bar-row"><div className="wf-skill-bar-info"><span>Data Analysis</span><span>78%</span></div><div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "78%" }} /></div></div>
                    <div className="wf-skill-bar-row"><div className="wf-skill-bar-info"><span>Project Management</span><span>75%</span></div><div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "75%" }} /></div></div>
                    <div className="wf-skill-bar-row"><div className="wf-skill-bar-info"><span>Problem Solving</span><span>72%</span></div><div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "72%" }} /></div></div>
                  </div>
                </div>

                <div className="wf-card">
                  <div className="wf-card-header"><h2 className="wf-card-title">Skills Gaps</h2><span className="wf-card-action" onClick={() => alert("Opening Skill Gap Action Plan...")}>View all</span></div>
                  <div className="wf-skills-gaps-list">
                    <div className="wf-gap-item" onClick={() => alert("Cloud Computing: 32 team members require AWS/GCP certification.")}>
                      <div className="wf-gap-left"><div className="wf-gap-icon-box"><FaCloud /></div><div className="wf-gap-details"><span className="wf-gap-title">Cloud Computing</span><span className="wf-gap-demand-tag high">High Demand</span></div></div>
                      <div className="wf-gap-count"><span className="wf-gap-count-num">32</span><span className="wf-gap-count-lbl">Employees</span></div>
                    </div>
                    <div className="wf-gap-item" onClick={() => alert("Cyber Security: 28 employees require OWASP & Network Security training.")}>
                      <div className="wf-gap-left"><div className="wf-gap-icon-box"><FaShieldAlt /></div><div className="wf-gap-details"><span className="wf-gap-title">Cyber Security</span><span className="wf-gap-demand-tag high">High Demand</span></div></div>
                      <div className="wf-gap-count"><span className="wf-gap-count-num">28</span><span className="wf-gap-count-lbl">Employees</span></div>
                    </div>
                    <div className="wf-gap-item" onClick={() => alert("AI / Machine Learning: 24 employees recommended for Python & PyTorch module.")}>
                      <div className="wf-gap-left"><div className="wf-gap-icon-box"><FaRobot /></div><div className="wf-gap-details"><span className="wf-gap-title">AI / Machine Learning</span><span className="wf-gap-demand-tag medium">Medium Demand</span></div></div>
                      <div className="wf-gap-count"><span className="wf-gap-count-num">24</span><span className="wf-gap-count-lbl">Employees</span></div>
                    </div>
                    <div className="wf-gap-item" onClick={() => alert("Data Visualization: 20 employees assigned to Tableau & PowerBI workshop.")}>
                      <div className="wf-gap-left"><div className="wf-gap-icon-box"><FaChartBar /></div><div className="wf-gap-details"><span className="wf-gap-title">Data Visualization</span><span className="wf-gap-demand-tag medium">Medium Demand</span></div></div>
                      <div className="wf-gap-count"><span className="wf-gap-count-num">20</span><span className="wf-gap-count-lbl">Employees</span></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="wf-bottom-grid wf-bottom-grid-5050">
                <div className="wf-card">
                  <div className="wf-card-header"><h2 className="wf-card-title">Recent Assessments</h2><span className="wf-card-action" onClick={() => alert("Viewing all 56 assessment logs...")}>View all</span></div>
                  <div className="wf-assessments-list">
                    {assessmentsList.map(asm => {
                      const IconComponent = asm.iconName === "FaUsers" ? FaUsers : (asm.iconName === "FaChartBar" ? FaChartBar : (asm.iconName === "FaComments" ? FaComments : FaCode));
                      return (
                        <div key={asm.id} className="wf-assessment-item" onClick={() => setSelectedAssessment(asm)}>
                          <div className="wf-assessment-left">
                            <div className="wf-assessment-icon-box" style={{ background: asm.iconBg || "#fae8de" }}>
                              <IconComponent />
                            </div>
                            <div className="wf-assessment-info">
                              <span className="wf-assessment-title">{asm.title}</span>
                              <span className="wf-assessment-cat">{asm.category}</span>
                            </div>
                          </div>
                          <div className="wf-assessment-middle">
                            <span className={`wf-status-pill ${asm.status === "Completed" ? "completed" : (asm.status === "In Progress" ? "in-progress" : "not-started")}`}>{asm.status}</span>
                            <div className="wf-assessment-participants">
                              <span className="wf-part-num">{asm.participants}</span>
                              <span className="wf-part-lbl">Participants</span>
                            </div>
                            <div className="wf-ring-score-box">{asm.score}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="wf-card">
                  <div className="wf-card-header"><h2 className="wf-card-title">Team Skills Distribution</h2><span className="wf-card-action" onClick={() => setActiveTab("Teams")}>View all</span></div>
                  <div className="wf-team-skills-list">
                    <div className="wf-team-skill-row"><div className="wf-team-skill-meta"><div className="wf-avatar-stack"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="m1" className="wf-avatar-stack-img" /><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="m2" className="wf-avatar-stack-img" /></div><div className="wf-team-skill-details"><span className="wf-team-name-lbl">Engineering Team</span><span className="wf-team-mem-count">24 Members</span></div></div><div className="wf-segmented-track"><div className="wf-seg-expert" style={{ width: "35%" }} /><div className="wf-seg-proficient" style={{ width: "35%" }} /><div className="wf-seg-intermediate" style={{ width: "20%" }} /><div className="wf-seg-beginner" style={{ width: "10%" }} /></div><span className="wf-team-overall-val">82%</span></div>
                    <div className="wf-team-skill-row"><div className="wf-team-skill-meta"><div className="wf-avatar-stack"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="m1" className="wf-avatar-stack-img" /><img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="m2" className="wf-avatar-stack-img" /></div><div className="wf-team-skill-details"><span className="wf-team-name-lbl">Product Team</span><span className="wf-team-mem-count">18 Members</span></div></div><div className="wf-segmented-track"><div className="wf-seg-expert" style={{ width: "25%" }} /><div className="wf-seg-proficient" style={{ width: "45%" }} /><div className="wf-seg-intermediate" style={{ width: "20%" }} /><div className="wf-seg-beginner" style={{ width: "10%" }} /></div><span className="wf-team-overall-val">76%</span></div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 5: PERFORMANCE OVERVIEW */}
          {activeTab === "Performance" && (
            <>
              <section className="wf-welcome-banner perf-banner">
                <div className="wf-welcome-text">
                  <h1>Performance Overview</h1>
                  <p>Track overall workforce performance, goal completion rates, and key team metrics.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <select
                    className="wf-select-filter"
                    style={{ padding: "8px 14px", fontSize: "13px", fontWeight: "700" }}
                    value={perfTimeframe}
                    onChange={(e) => setPerfTimeframe(e.target.value)}
                  >
                    <option value="Monthly">📅 May 1 – May 31, 2025</option>
                    <option value="Quarterly">📅 Q1 2025 (Jan – Mar)</option>
                    <option value="Yearly">📅 Year to Date 2025</option>
                  </select>
                  <button className="wf-btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={() => setShowReviewsModal(true)}>
                    <FaPlus /> New Review Cycle
                  </button>
                  <button className="wf-promo-btn" style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--wf-accent-dark-brown)" }} onClick={() => alert("Generating AI Workforce Performance Summary...")}>
                    <FaBolt style={{ color: "#fef08a" }} /> AI Insights
                  </button>
                </div>
              </section>

              <section className="wf-metrics-grid wf-metrics-grid-4">
                <div className="wf-metric-card perf-card" onClick={() => setShowReviewsModal(true)}>
                  <div className="wf-metric-header">
                    <div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaClipboardCheck /></div>
                    <span className="wf-metric-title">Average Performance Score</span>
                  </div>
                  <div className="wf-metric-value">4.2 <span style={{ fontSize: "15px", color: "var(--wf-text-muted)" }}>/ 5</span></div>
                  <div className="wf-metric-trend">↑ 8% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>

                <div className="wf-metric-card perf-card" onClick={() => setShowReviewsModal(true)}>
                  <div className="wf-metric-header">
                    <div className="wf-metric-icon-box" style={{ background: "#fef3c7" }}><FaStar /></div>
                    <span className="wf-metric-title">High Performers</span>
                  </div>
                  <div className="wf-metric-value">32% <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--wf-text-muted)" }}>(79 staff)</span></div>
                  <div className="wf-metric-trend">↑ 5% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>

                <div className="wf-metric-card perf-card" onClick={() => setShowReviewsModal(true)}>
                  <div className="wf-metric-header">
                    <div className="wf-metric-icon-box" style={{ background: "#f3e8f8" }}><FaBullseye /></div>
                    <span className="wf-metric-title">Goals Achieved</span>
                  </div>
                  <div className="wf-metric-value">68%</div>
                  <div className="wf-metric-trend">↑ 12% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>

                <div className="wf-metric-card perf-card" onClick={() => setShowReviewsModal(true)}>
                  <div className="wf-metric-header">
                    <div className="wf-metric-icon-box" style={{ background: "#e0f2fe" }}><FaChartLine /></div>
                    <span className="wf-metric-title">Reviews Completed</span>
                  </div>
                  <div className="wf-metric-value">87% <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--wf-text-muted)" }}>(216/248)</span></div>
                  <div className="wf-metric-trend">↑ 10% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>
              </section>

              <section className="wf-middle-grid">
                <div className="wf-card perf-card" style={{ position: "relative", overflow: "visible" }}>
                  <div className="wf-card-header">
                    <div>
                      <h2 className="wf-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        Performance Trend <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", background: "#f3e8de", color: "#8c5338", borderRadius: "12px" }}>Live Interactive</span>
                      </h2>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {["Monthly", "Quarterly", "Yearly"].map(t => (
                        <button
                          key={t}
                          className={`wf-filter-pill ${perfTimeframe === t ? "active" : ""}`}
                          style={{ padding: "4px 12px", fontSize: "11px", borderRadius: "16px" }}
                          onClick={() => { setPerfTimeframe(t); setHoveredPerfPoint(null); }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Performance Chart */}
                  {(() => {
                    const perfDatasets = {
                      Monthly: [
                        { label: "Dec", score: 3.6, evaluated: 210, growth: "+2.1%", target: 3.5, x: 45, y: 110 },
                        { label: "Jan", score: 3.8, evaluated: 224, growth: "+5.5%", target: 3.5, x: 118, y: 90 },
                        { label: "Feb", score: 3.9, evaluated: 230, growth: "+2.6%", target: 3.8, x: 191, y: 80 },
                        { label: "Mar", score: 4.0, evaluated: 238, growth: "+2.5%", target: 3.8, x: 264, y: 70 },
                        { label: "Apr", score: 4.1, evaluated: 242, growth: "+2.5%", target: 4.0, x: 337, y: 60 },
                        { label: "May", score: 4.2, evaluated: 248, growth: "+2.4%", target: 4.0, x: 410, y: 48 },
                      ],
                      Quarterly: [
                        { label: "Q2 '24", score: 3.5, evaluated: 190, growth: "+3.0%", target: 3.5, x: 45, y: 120 },
                        { label: "Q3 '24", score: 3.7, evaluated: 205, growth: "+5.7%", target: 3.5, x: 136, y: 100 },
                        { label: "Q4 '24", score: 3.9, evaluated: 220, growth: "+5.4%", target: 3.8, x: 227, y: 80 },
                        { label: "Q1 '25", score: 4.1, evaluated: 238, growth: "+5.1%", target: 4.0, x: 318, y: 60 },
                        { label: "Q2 '25", score: 4.3, evaluated: 248, growth: "+4.8%", target: 4.0, x: 410, y: 38 },
                      ],
                      Yearly: [
                        { label: "2021", score: 3.2, evaluated: 120, growth: "+4.0%", target: 3.0, x: 45, y: 145 },
                        { label: "2022", score: 3.5, evaluated: 160, growth: "+9.3%", target: 3.2, x: 136, y: 120 },
                        { label: "2023", score: 3.8, evaluated: 195, growth: "+8.5%", target: 3.5, x: 227, y: 90 },
                        { label: "2024", score: 4.1, evaluated: 230, growth: "+7.8%", target: 3.8, x: 318, y: 60 },
                        { label: "2025", score: 4.4, evaluated: 248, growth: "+7.3%", target: 4.0, x: 410, y: 28 },
                      ]
                    };

                    const currentData = perfDatasets[perfTimeframe] || perfDatasets.Monthly;
                    const pathD = currentData.reduce((acc, pt, idx) => {
                      if (idx === 0) return `M ${pt.x} ${pt.y}`;
                      const prev = currentData[idx - 1];
                      const cpX1 = prev.x + (pt.x - prev.x) / 2;
                      const cpX2 = prev.x + (pt.x - prev.x) / 2;
                      return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${pt.y}, ${pt.x} ${pt.y}`;
                    }, "");

                    const areaD = `${pathD} L ${currentData[currentData.length - 1].x} 165 L ${currentData[0].x} 165 Z`;

                    return (
                      <div className="wf-overview-chart-container" style={{ position: "relative" }}>
                        <svg className="wf-svg-line-chart" viewBox="0 0 450 195" style={{ width: "100%", height: "auto" }}>
                          <defs>
                            <linearGradient id="perfGradEnhancedDynamic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f9572a" stopOpacity="0.45" />
                              <stop offset="50%" stopColor="#8c5338" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#8c5338" stopOpacity="0.0" />
                            </linearGradient>
                            <filter id="glowPoint" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Grid background lines */}
                          <line x1="30" y1="20" x2="430" y2="20" stroke="#f2e8df" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="30" y1="60" x2="430" y2="60" stroke="#f2e8df" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="30" y1="100" x2="430" y2="100" stroke="#f2e8df" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="30" y1="140" x2="430" y2="140" stroke="#f2e8df" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="30" y1="165" x2="430" y2="165" stroke="#ebdcd0" strokeWidth="1.5" />

                          {/* Y-axis Labels */}
                          <text x="12" y="24" fill="#a39285" fontSize="10" fontWeight="600">5.0</text>
                          <text x="12" y="64" fill="#a39285" fontSize="10" fontWeight="600">4.0</text>
                          <text x="12" y="104" fill="#a39285" fontSize="10" fontWeight="600">3.0</text>
                          <text x="12" y="144" fill="#a39285" fontSize="10" fontWeight="600">2.0</text>

                          {/* Filled area below curve */}
                          <path d={areaD} fill="url(#perfGradEnhancedDynamic)" style={{ transition: "all 0.4s ease" }} />

                          {/* Main smooth curve stroke */}
                          <path d={pathD} fill="none" stroke="#f9572a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.4s ease" }} />

                          {/* Target benchmark line */}
                          <line x1="30" y1="60" x2="430" y2="60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5 5" opacity="0.6" />

                          {/* Data Nodes */}
                          {currentData.map((pt, idx) => {
                            const isHovered = hoveredPerfPoint === idx;
                            return (
                              <g key={pt.label} style={{ cursor: "pointer" }} onMouseEnter={() => setHoveredPerfPoint(idx)} onMouseLeave={() => setHoveredPerfPoint(null)}>
                                {isHovered && (
                                  <>
                                    <line x1={pt.x} y1={pt.y} x2={pt.x} y2="165" stroke="#f9572a" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <circle cx={pt.x} cy={pt.y} r="10" fill="#f9572a" opacity="0.25" filter="url(#glowPoint)" />
                                  </>
                                )}
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={isHovered ? 7 : 5}
                                  fill={isHovered ? "#f9572a" : "#8c5338"}
                                  stroke="#ffffff"
                                  strokeWidth={isHovered ? 2.5 : 2}
                                  style={{ transition: "all 0.2s ease" }}
                                />
                                <text
                                  x={pt.x}
                                  y={pt.y - 12}
                                  textAnchor="middle"
                                  fill={isHovered ? "#f9572a" : "#332219"}
                                  fontSize={isHovered ? "12" : "10"}
                                  fontWeight={isHovered ? "800" : "700"}
                                >
                                  {pt.score}
                                </text>

                                {/* X-axis Label */}
                                <text x={pt.x} y="184" textAnchor="middle" fill={isHovered ? "#f9572a" : "#a39285"} fontSize="11" fontWeight={isHovered ? "800" : "600"}>
                                  {pt.label}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                        {/* Interactive Floating Tooltip */}
                        {hoveredPerfPoint !== null && currentData[hoveredPerfPoint] && (
                          <div
                            style={{
                              position: "absolute",
                              top: `${(currentData[hoveredPerfPoint].y / 195) * 100 - 32}%`,
                              left: `${(currentData[hoveredPerfPoint].x / 450) * 100}%`,
                              transform: "translate(-50%, -100%)",
                              background: "#1E1B18",
                              color: "#FFFFFF",
                              padding: "8px 14px",
                              borderRadius: "10px",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                              fontSize: "12px",
                              pointerEvents: "none",
                              zIndex: 20,
                              whiteSpace: "nowrap",
                              border: "1px solid rgba(249, 87, 42, 0.4)",
                              animation: "fadeIn 0.2s ease",
                            }}
                          >
                            <div style={{ fontWeight: "800", color: "#F9572A", fontSize: "13px", marginBottom: "2px" }}>
                              {currentData[hoveredPerfPoint].label} Rating: ★ {currentData[hoveredPerfPoint].score} / 5.0
                            </div>
                            <div style={{ color: "#cbd5e1", fontSize: "11px" }}>
                              👥 Staff Evaluated: <strong>{currentData[hoveredPerfPoint].evaluated}</strong>
                            </div>
                            <div style={{ color: "#4ade80", fontSize: "11px", fontWeight: "700", marginTop: "2px" }}>
                              📈 Growth Rate: {currentData[hoveredPerfPoint].growth}
                            </div>
                          </div>
                        )}

                        {/* Chart Summary Footer Bar */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", padding: "10px 14px", background: "#faf4ee", borderRadius: "10px", fontSize: "12px" }}>
                          <div>
                            <span style={{ color: "#8c5338", fontWeight: "600" }}>Current Average Rating: </span>
                            <strong style={{ color: "#332219", fontSize: "14px" }}>4.2 / 5.0</strong>
                          </div>
                          <div>
                            <span style={{ color: "#8c5338", fontWeight: "600" }}>Target Benchmark: </span>
                            <span style={{ color: "#f59e0b", fontWeight: "700" }}>4.0 ⭐</span>
                          </div>
                          <div>
                            <span style={{ color: "#16a34a", fontWeight: "700" }}>+14.2% YoY Improvement ↗</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Performance Distribution Donut Card */}
                <div className="wf-card perf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Performance Distribution</h2>
                    <span style={{ fontSize: "11px", color: "var(--wf-text-muted)" }}>248 Total Employees</span>
                  </div>
                  <div className="wf-skill-donut-wrapper" style={{ marginTop: "8px" }}>
                    <div className="wf-donut-chart-box" style={{ position: "relative" }}>
                      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.06))" }}>
                        {/* Excellent 28% -> strokeDasharray 91 235 */}
                        <circle
                          cx="75" cy="75" r="52" fill="none" stroke="#84cc16"
                          strokeWidth={hoveredDonutSegment === "excellent" ? "24" : "20"}
                          strokeDasharray="91 235" strokeDashoffset="0"
                          style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                          onMouseEnter={() => setHoveredDonutSegment("excellent")}
                          onMouseLeave={() => setHoveredDonutSegment(null)}
                        />
                        {/* Good 46% -> strokeDasharray 150 176 */}
                        <circle
                          cx="75" cy="75" r="52" fill="none" stroke="#3b82f6"
                          strokeWidth={hoveredDonutSegment === "good" ? "24" : "20"}
                          strokeDasharray="150 176" strokeDashoffset="-91"
                          style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                          onMouseEnter={() => setHoveredDonutSegment("good")}
                          onMouseLeave={() => setHoveredDonutSegment(null)}
                        />
                        {/* Average 18% -> strokeDasharray 58 268 */}
                        <circle
                          cx="75" cy="75" r="52" fill="none" stroke="#f59e0b"
                          strokeWidth={hoveredDonutSegment === "average" ? "24" : "20"}
                          strokeDasharray="58 268" strokeDashoffset="-241"
                          style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                          onMouseEnter={() => setHoveredDonutSegment("average")}
                          onMouseLeave={() => setHoveredDonutSegment(null)}
                        />
                        {/* Needs Improvement 8% -> strokeDasharray 26 300 */}
                        <circle
                          cx="75" cy="75" r="52" fill="none" stroke="#ef4444"
                          strokeWidth={hoveredDonutSegment === "improvement" ? "24" : "20"}
                          strokeDasharray="26 300" strokeDashoffset="-299"
                          style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                          onMouseEnter={() => setHoveredDonutSegment("improvement")}
                          onMouseLeave={() => setHoveredDonutSegment(null)}
                        />
                      </svg>
                      <div className="wf-donut-center-text">
                        <span className="wf-donut-label">
                          {hoveredDonutSegment === "excellent" && "Excellent"}
                          {hoveredDonutSegment === "good" && "Good"}
                          {hoveredDonutSegment === "average" && "Average"}
                          {hoveredDonutSegment === "improvement" && "Needs Imp."}
                          {!hoveredDonutSegment && "Total"}
                        </span>
                        <span className="wf-donut-number">
                          {hoveredDonutSegment === "excellent" && "69"}
                          {hoveredDonutSegment === "good" && "114"}
                          {hoveredDonutSegment === "average" && "45"}
                          {hoveredDonutSegment === "improvement" && "20"}
                          {!hoveredDonutSegment && "248"}
                        </span>
                        <span className="wf-donut-label">
                          {hoveredDonutSegment ? "Staff" : "Employees"}
                        </span>
                      </div>
                    </div>

                    <div className="wf-donut-legend-list">
                      <div
                        className={`wf-donut-legend-row ${hoveredDonutSegment === "excellent" ? "active" : ""}`}
                        style={{ padding: "6px 8px", borderRadius: "8px", background: hoveredDonutSegment === "excellent" ? "#f0fdf4" : "transparent", cursor: "pointer" }}
                        onMouseEnter={() => setHoveredDonutSegment("excellent")}
                        onMouseLeave={() => setHoveredDonutSegment(null)}
                      >
                        <div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#84cc16" }} /><span>Excellent (4.5 - 5.0)</span></div>
                        <span className="wf-donut-percent" style={{ fontWeight: "700", color: "#15803d" }}>28% (69)</span>
                      </div>

                      <div
                        className={`wf-donut-legend-row ${hoveredDonutSegment === "good" ? "active" : ""}`}
                        style={{ padding: "6px 8px", borderRadius: "8px", background: hoveredDonutSegment === "good" ? "#eff6ff" : "transparent", cursor: "pointer" }}
                        onMouseEnter={() => setHoveredDonutSegment("good")}
                        onMouseLeave={() => setHoveredDonutSegment(null)}
                      >
                        <div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#3b82f6" }} /><span>Good (3.5 - 4.4)</span></div>
                        <span className="wf-donut-percent" style={{ fontWeight: "700", color: "#1d4ed8" }}>46% (114)</span>
                      </div>

                      <div
                        className={`wf-donut-legend-row ${hoveredDonutSegment === "average" ? "active" : ""}`}
                        style={{ padding: "6px 8px", borderRadius: "8px", background: hoveredDonutSegment === "average" ? "#fffbeb" : "transparent", cursor: "pointer" }}
                        onMouseEnter={() => setHoveredDonutSegment("average")}
                        onMouseLeave={() => setHoveredDonutSegment(null)}
                      >
                        <div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#f59e0b" }} /><span>Average (2.5 - 3.4)</span></div>
                        <span className="wf-donut-percent" style={{ fontWeight: "700", color: "#b45309" }}>18% (45)</span>
                      </div>

                      <div
                        className={`wf-donut-legend-row ${hoveredDonutSegment === "improvement" ? "active" : ""}`}
                        style={{ padding: "6px 8px", borderRadius: "8px", background: hoveredDonutSegment === "improvement" ? "#fef2f2" : "transparent", cursor: "pointer" }}
                        onMouseEnter={() => setHoveredDonutSegment("improvement")}
                        onMouseLeave={() => setHoveredDonutSegment(null)}
                      >
                        <div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#ef4444" }} /><span>Needs Imp. (&lt;2.5)</span></div>
                        <span className="wf-donut-percent" style={{ fontWeight: "700", color: "#b91c1c" }}>8% (20)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="wf-card perf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Goals Progress</h2>
                    <span className="wf-card-action" onClick={() => alert("Opening Organization Goals Breakdown...")}>View all</span>
                  </div>

                  <div className="wf-engagement-gauge-container">
                    <div className="wf-gauge-svg-box">
                      <svg width="140" height="85" viewBox="0 0 140 85">
                        <path d="M 15 75 A 55 55 0 0 1 125 75" fill="none" stroke="#f2e4da" strokeWidth="14" strokeLinecap="round" />
                        <path d="M 15 75 A 55 55 0 0 1 110 35" fill="none" stroke="#84cc16" strokeWidth="14" strokeLinecap="round" />
                      </svg>
                      <div className="wf-gauge-text-box">
                        <div className="wf-gauge-value" style={{ fontSize: "20px" }}>68%</div>
                        <div className="wf-gauge-status" style={{ fontSize: "10px" }}>Overall Goals Achieved</div>
                      </div>
                    </div>
                  </div>

                  <div className="wf-top-skills-list" style={{ marginTop: "10px", gap: "10px" }}>
                    <div className="wf-skill-bar-row">
                      <div className="wf-skill-bar-info" style={{ fontSize: "11px" }}><span>👤 Individual Goals</span><span>72%</span></div>
                      <div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "72%", background: "#84cc16" }} /></div>
                    </div>
                    <div className="wf-skill-bar-row">
                      <div className="wf-skill-bar-info" style={{ fontSize: "11px" }}><span>👥 Team Goals</span><span>65%</span></div>
                      <div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "65%", background: "#3b82f6" }} /></div>
                    </div>
                    <div className="wf-skill-bar-row">
                      <div className="wf-skill-bar-info" style={{ fontSize: "11px" }}><span>🏢 Department Goals</span><span>68%</span></div>
                      <div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "68%", background: "#f59e0b" }} /></div>
                    </div>
                    <div className="wf-skill-bar-row">
                      <div className="wf-skill-bar-info" style={{ fontSize: "11px" }}><span>🌐 Organization Goals</span><span>67%</span></div>
                      <div className="wf-skill-bar-track"><div className="wf-skill-bar-fill" style={{ width: "67%", background: "#a855f7" }} /></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="wf-middle-grid-3equal">
                <div className="wf-card perf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Department Performance</h2>
                    <span className="wf-card-action" onClick={() => setShowReviewsModal(true)}>View all</span>
                  </div>

                  <div className="wf-dept-perf-list">
                    <div className="wf-dept-perf-row" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-dept-name-cell"><div className="wf-dept-icon-box"><FaCode /></div><span>Engineering</span></div>
                      <strong style={{ fontSize: "13px" }}>4.5 <span style={{ fontSize: "11px", color: "#a39285" }}>/ 5</span></strong>
                      <span className="wf-metric-trend">↑ 10%</span>
                      <svg className="wf-sparkline-svg" viewBox="0 0 60 20"><path d="M 0 15 L 15 12 L 30 8 L 45 10 L 60 3" fill="none" stroke="#22c55e" strokeWidth="2" /></svg>
                    </div>

                    <div className="wf-dept-perf-row" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-dept-name-cell"><div className="wf-dept-icon-box"><FaBuilding /></div><span>Product</span></div>
                      <strong style={{ fontSize: "13px" }}>4.3 <span style={{ fontSize: "11px", color: "#a39285" }}>/ 5</span></strong>
                      <span className="wf-metric-trend">↑ 7%</span>
                      <svg className="wf-sparkline-svg" viewBox="0 0 60 20"><path d="M 0 16 L 15 14 L 30 10 L 45 7 L 60 4" fill="none" stroke="#22c55e" strokeWidth="2" /></svg>
                    </div>

                    <div className="wf-dept-perf-row" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-dept-name-cell"><div className="wf-dept-icon-box"><FaChartBar /></div><span>Marketing</span></div>
                      <strong style={{ fontSize: "13px" }}>4.0 <span style={{ fontSize: "11px", color: "#a39285" }}>/ 5</span></strong>
                      <span className="wf-metric-trend">↑ 5%</span>
                      <svg className="wf-sparkline-svg" viewBox="0 0 60 20"><path d="M 0 14 L 15 12 L 30 11 L 45 9 L 60 6" fill="none" stroke="#22c55e" strokeWidth="2" /></svg>
                    </div>

                    <div className="wf-dept-perf-row" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-dept-name-cell"><div className="wf-dept-icon-box"><FaUsers /></div><span>Sales</span></div>
                      <strong style={{ fontSize: "13px" }}>3.8 <span style={{ fontSize: "11px", color: "#a39285" }}>/ 5</span></strong>
                      <span className="wf-metric-trend">↑ 3%</span>
                      <svg className="wf-sparkline-svg" viewBox="0 0 60 20"><path d="M 0 17 L 15 15 L 30 12 L 45 11 L 60 8" fill="none" stroke="#22c55e" strokeWidth="2" /></svg>
                    </div>

                    <div className="wf-dept-perf-row" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-dept-name-cell"><div className="wf-dept-icon-box"><FaHeart /></div><span>HR</span></div>
                      <strong style={{ fontSize: "13px" }}>3.9 <span style={{ fontSize: "11px", color: "#a39285" }}>/ 5</span></strong>
                      <span className="wf-metric-trend">↑ 2%</span>
                      <svg className="wf-sparkline-svg" viewBox="0 0 60 20"><path d="M 0 15 L 15 13 L 30 10 L 45 9 L 60 7" fill="none" stroke="#22c55e" strokeWidth="2" /></svg>
                    </div>
                  </div>
                </div>

                <div className="wf-card perf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Recent Performance Reviews</h2>
                    <span className="wf-card-action" onClick={() => setShowReviewsModal(true)}>View all</span>
                  </div>

                  <div className="wf-activity-list">
                    <div className="wf-activity-item" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-activity-left">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Arjun" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-name">Arjun Sharma</span>
                          <span className="wf-activity-time">Product Designer • May 30, 2025</span>
                        </div>
                      </div>
                      <span className="wf-perf-pill excellent">4.6 Excellent</span>
                    </div>

                    <div className="wf-activity-item" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-activity-left">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Priya" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-name">Priya Singh</span>
                          <span className="wf-activity-time">Software Engineer • May 29, 2025</span>
                        </div>
                      </div>
                      <span className="wf-perf-pill good">4.2 Good</span>
                    </div>
                  </div>
                </div>

                <div className="wf-card perf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Top Performers</h2>
                    <span className="wf-card-action" onClick={() => setShowReviewsModal(true)}>View all</span>
                  </div>

                  <div className="wf-activity-list">
                    <div className="wf-activity-item" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-activity-left">
                        <span className="wf-top-performer-rank rank-1">1</span>
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Sneha" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-name">Sneha Kapoor</span>
                          <span className="wf-activity-time">Data Scientist</span>
                        </div>
                      </div>
                      <strong style={{ fontSize: "13px", color: "var(--wf-accent-brown)" }}>4.9 ⭐</strong>
                    </div>

                    <div className="wf-activity-item" onClick={() => setShowReviewsModal(true)}>
                      <div className="wf-activity-left">
                        <span className="wf-top-performer-rank rank-2">2</span>
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Vikram" className="wf-activity-avatar" />
                        <div className="wf-activity-details">
                          <span className="wf-activity-name">Vikram Patil</span>
                          <span className="wf-activity-time">Engineering Lead</span>
                        </div>
                      </div>
                      <strong style={{ fontSize: "13px" }}>4.8 ⭐</strong>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 9: REPORTS & ANALYTICS CONTROL PANEL */}
          {activeTab === "Reports" && (
            <>
              {/* WELCOME BANNER WITH GRAPHIC */}
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Reports & Analytics Control Panel</h1>
                  <p>Comprehensive organizational intelligence center. Generate, analyze, and export multi-dimensional workforce performance, skills, and engagement analytics.</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                    <button className="wf-btn-primary" onClick={() => setActiveTab("Overview")}>
                      Return to Overview Dashboard
                    </button>
                    <button className="wf-promo-btn" style={{ background: "var(--wf-accent-dark-brown)" }} onClick={() => setShowExportModal(true)}>
                      📥 Export All Reports
                    </button>
                  </div>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.18)" stroke="rgba(212, 140, 102, 0.35)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.15)" stroke="rgba(224, 122, 95, 0.3)" strokeWidth="1.5" />
                  </svg>
                  <img
                    src={themeMode === 'dark' ? (darkFeatureHeroImg || darkWorkHubHeroImg) : featureHeroImg}
                    alt="Reports Graphic"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              {/* TOP 5 METRICS CARDS */}
              <section className="wf-metrics-grid">
                <div className="wf-metric-card" onClick={() => setReportCatFilter("All Reports")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaChartBar /></div><span className="wf-metric-title">Reports Generated</span></div>
                  <div className="wf-metric-value">128</div>
                  <div className="wf-metric-trend">↑ 14% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("99.4% Organizational data accuracy index across all 512 employee records.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#e6f4ea", color: "#16a34a" }}><FaBullseye /></div><span className="wf-metric-title">Data Accuracy</span></div>
                  <div className="wf-metric-value">99.4%</div>
                  <div className="wf-metric-trend">↑ 0.6% <span className="wf-metric-trend-label">vs last month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("18 Active scheduled recurring automated report exports.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#e0f2fe", color: "#0284c7" }}><FaCalendarAlt /></div><span className="wf-metric-title">Scheduled Exports</span></div>
                  <div className="wf-metric-value">18 Active</div>
                  <div className="wf-metric-trend" style={{ color: "#0284c7" }}>→ 3 pending <span className="wf-metric-trend-label">this week</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("42 AI-driven automated organizational highlights generated.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#fef3c7", color: "#b45309" }}><FaLightbulb /></div><span className="wf-metric-title">AI Insights</span></div>
                  <div className="wf-metric-value">42 Highlights</div>
                  <div className="wf-metric-trend">↑ 8 new <span className="wf-metric-trend-label">this month</span></div>
                </div>

                <div className="wf-metric-card" onClick={() => alert("Average report generation speed is 1.2 seconds.")}>
                  <div className="wf-metric-header"><div className="wf-metric-icon-box" style={{ background: "#ffebe9", color: "#d9381e" }}><FaBolt /></div><span className="wf-metric-title">Avg. Export Speed</span></div>
                  <div className="wf-metric-value">1.2s</div>
                  <div className="wf-metric-trend">⚡ Instant <span className="wf-metric-trend-label">processing</span></div>
                </div>
              </section>

              {/* MAIN REPORTS & ANALYTICS GRID (2 COLUMNS) */}
              <section className="wf-teams-grid">
                
                {/* LEFT COLUMN: AVAILABLE REPORTS MATRIX TABLE */}
                <div className="wf-card">
                  <div className="wf-card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <h2 className="wf-card-title">Available Reports & Analytics Modules</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="wf-search-box" style={{ width: "190px", padding: "4px 12px" }}>
                        <FaSearch className="wf-search-icon" />
                        <input
                          type="text"
                          placeholder="Search report..."
                          className="wf-search-input"
                          value={reportSearch}
                          onChange={(e) => setReportSearch(e.target.value)}
                        />
                      </div>
                      <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "8px 14px" }} onClick={() => setShowCustomReportModal(true)}>
                        <FaPlus /> Generate Custom
                      </button>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="wf-report-cat-filter-bar" style={{ marginBottom: "16px" }}>
                    {["All Reports", "Skills", "Performance", "Attendance", "Engagement", "Learning", "Analytics"].map(cat => (
                      <button
                        key={cat}
                        className={`wf-cat-pill ${reportCatFilter === cat ? "active" : ""}`}
                        onClick={() => setReportCatFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="wf-table-responsive">
                    <table className="wf-table">
                      <thead>
                        <tr>
                          <th>Report Name</th>
                          <th>Category</th>
                          <th>Frequency</th>
                          <th>Last Generated</th>
                          <th>Format</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map(rep => (
                          <tr key={rep.id}>
                            <td>
                              <div className="wf-team-cell">
                                <div className="wf-dept-icon-box" style={{ background: "#fae8de", color: "var(--wf-accent-brown)" }}>
                                  <FaChartBar />
                                </div>
                                <span style={{ fontWeight: "700", color: "var(--wf-text-primary)" }}>{rep.title}</span>
                              </div>
                            </td>

                            <td>
                              <span className="wf-type-tag initiative">
                                {rep.category}
                              </span>
                            </td>

                            <td>{rep.frequency}</td>
                            <td>{rep.lastGen}</td>

                            <td>
                              <span className={`wf-report-format-pill ${rep.formatType}`}>
                                {rep.format}
                              </span>
                            </td>

                            <td>
                              <span className="wf-status-pill completed">
                                {rep.status}
                              </span>
                            </td>

                            <td>
                              <button
                                className="wf-btn-primary"
                                style={{ padding: "5px 12px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                onClick={() => alert(`Downloading "${rep.title}" (${rep.format})...`)}
                              >
                                <FaFileExport /> Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="wf-pagination">
                    <span>Showing 1 to {filteredReports.length} of 18 reports</span>
                    <div className="wf-page-numbers">
                      <button className="wf-page-btn">&lt;</button>
                      <button className="wf-page-btn active">1</button>
                      <button className="wf-page-btn">2</button>
                      <button className="wf-page-btn">3</button>
                      <button className="wf-page-btn">&gt;</button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN STACK (CHARTS & AI INSIGHTS) */}
                <div className="wf-teams-right-stack">
                  
                  {/* 1. Skill Velocity & Productivity Trend Chart */}
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Productivity & Skill Velocity Trend</h2>
                      <select className="wf-select-filter">
                        <option>This Quarter</option>
                        <option>Last Quarter</option>
                      </select>
                    </div>

                    <div className="wf-overview-chart-container">
                      <div className="wf-chart-legend" style={{ marginBottom: "8px" }}>
                        <div className="wf-legend-item"><span className="wf-legend-line solid" /><span>Productivity Index</span></div>
                        <div className="wf-legend-item"><span className="wf-legend-line dashed" /><span>Skill Index</span></div>
                      </div>

                      <svg className="wf-svg-line-chart" viewBox="0 0 340 150">
                        <defs>
                          <linearGradient id="prodTrendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        <line x1="30" y1="20" x2="330" y2="20" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="45" x2="330" y2="45" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="70" x2="330" y2="70" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="95" x2="330" y2="95" stroke="#f2e8df" strokeWidth="1" />
                        <line x1="30" y1="120" x2="330" y2="120" stroke="#ebdcd0" strokeWidth="1.5" />

                        <text x="10" y="24" fill="#a39285" fontSize="9">100%</text>
                        <text x="10" y="49" fill="#a39285" fontSize="9">75%</text>
                        <text x="10" y="74" fill="#a39285" fontSize="9">50%</text>
                        <text x="10" y="99" fill="#a39285" fontSize="9">25%</text>
                        <text x="15" y="124" fill="#a39285" fontSize="9">0%</text>

                        <path d="M 40 80 Q 95 60, 150 45 T 260 40 T 310 30 L 310 120 L 40 120 Z" fill="url(#prodTrendGrad)" />
                        <path d="M 40 80 Q 95 60, 150 45 T 260 40 T 310 30" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 40 95 Q 95 80, 150 65 T 260 55 T 310 42" fill="none" stroke="#8c5338" strokeWidth="2" strokeDasharray="4,4" strokeLinecap="round" />

                        <circle cx="40" cy="80" r="3.5" fill="#16a34a" />
                        <circle cx="95" cy="60" r="3.5" fill="#16a34a" />
                        <circle cx="150" cy="45" r="3.5" fill="#16a34a" />
                        <circle cx="205" cy="40" r="3.5" fill="#16a34a" />
                        <circle cx="260" cy="40" r="3.5" fill="#16a34a" />
                        <circle cx="310" cy="30" r="3.5" fill="#16a34a" />

                        <text x="40" y="135" textAnchor="middle" fill="#a39285" fontSize="9">Jan</text>
                        <text x="95" y="135" textAnchor="middle" fill="#a39285" fontSize="9">Feb</text>
                        <text x="150" y="135" textAnchor="middle" fill="#a39285" fontSize="9">Mar</text>
                        <text x="205" y="135" textAnchor="middle" fill="#a39285" fontSize="9">Apr</text>
                        <text x="260" y="135" textAnchor="middle" fill="#a39285" fontSize="9">May</text>
                        <text x="310" y="135" textAnchor="middle" fill="#a39285" fontSize="9">Jun</text>
                      </svg>
                    </div>
                  </div>

                  {/* 2. Department Analytics Distribution */}
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">Department Analytics Share</h2>
                      <select className="wf-select-filter">
                        <option>This Month</option>
                        <option>Last Month</option>
                      </select>
                    </div>

                    <div className="wf-skill-donut-wrapper">
                      <div className="wf-donut-chart-box" style={{ width: "150px", height: "150px" }}>
                        <svg width="150" height="150" viewBox="0 0 150 150">
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#5c2c19" strokeWidth="20" strokeDasharray="114.3 212.6" strokeDashoffset="0" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#9e5837" strokeWidth="20" strokeDasharray="81.6 245.3" strokeDashoffset="-114.3" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#d48c66" strokeWidth="20" strokeDasharray="65.3 261.6" strokeDashoffset="-195.9" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#eacab5" strokeWidth="20" strokeDasharray="39.2 287.7" strokeDashoffset="-261.2" />
                          <circle cx="75" cy="75" r="52" fill="none" stroke="#f5e4d7" strokeWidth="20" strokeDasharray="26.1 300.8" strokeDashoffset="-300.4" />
                        </svg>
                        <div className="wf-donut-center-text">
                          <span className="wf-donut-number" style={{ fontSize: "20px" }}>100%</span>
                          <span className="wf-donut-label" style={{ fontSize: "10px" }}>Share</span>
                        </div>
                      </div>

                      <div className="wf-donut-legend-list">
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#5c2c19" }} /><span>Engineering</span></div><span className="wf-donut-percent">35%</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#9e5837" }} /><span>Operations</span></div><span className="wf-donut-percent">25%</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#d48c66" }} /><span>Marketing</span></div><span className="wf-donut-percent">20%</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#eacab5" }} /><span>Data Science</span></div><span className="wf-donut-percent">12%</span></div>
                        <div className="wf-donut-legend-row"><div className="wf-donut-category"><span className="wf-donut-dot" style={{ background: "#f5e4d7" }} /><span>HR</span></div><span className="wf-donut-percent">8%</span></div>
                      </div>
                    </div>
                  </div>

                  {/* 3. AI Automated Insights */}
                  <div className="wf-card">
                    <div className="wf-card-header">
                      <h2 className="wf-card-title">AI Analytics Insights</h2>
                      <span className="wf-card-action" onClick={() => alert("Viewing all 42 automated AI analytics insights...")}>View All</span>
                    </div>

                    <div className="wf-insight-list">
                      <div className="wf-insight-card" onClick={() => alert("Insight details: Cloud Computing training completed by 32 engineers.")}>
                        <FaLightbulb className="wf-insight-icon" />
                        <div className="wf-insight-text">
                          <strong>Skill Gap Reduction:</strong> Cloud Computing skill gap reduced by <strong>18%</strong> following April training cohort.
                        </div>
                      </div>

                      <div className="wf-insight-card" onClick={() => alert("Insight details: Engineering department attendance peaked at 88.2%.")}>
                        <FaChartLine className="wf-insight-icon" />
                        <div className="wf-insight-text">
                          <strong>Attendance Peak:</strong> Engineering attendance reached an all-time high of <strong>88.2%</strong> in May 2025.
                        </div>
                      </div>

                      <div className="wf-insight-card" onClick={() => alert("Insight details: Performance review completion speed increased 12%.")}>
                        <FaTrophy className="wf-insight-icon" />
                        <div className="wf-insight-text">
                          <strong>Review Completion:</strong> Overall review completion rate increased <strong>12%</strong> quarter-over-quarter.
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            </>
          )}

          {activeTab === "AI Assistant" && (
            <div className="wf-card" style={{
              maxWidth: "900px",
              margin: "20px auto 40px auto",
              borderRadius: "16px",
              overflow: "hidden",
              background: isDarkMode ? "rgba(25,22,18,0.95)" : "#FFFFFF",
              border: isDarkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E2E8F0",
              boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.06)"
            }}>
              
              {/* Header Bar */}
              <div className="wf-card-header" style={{
                display: "flex",
                justify: "space-between",
                alignItems: "center",
                padding: "18px 24px",
                background: isDarkMode
                  ? "linear-gradient(135deg, rgba(35,28,24,0.95), rgba(55,42,32,0.95))"
                  : "linear-gradient(135deg, #F8FAFC, #F1F5F9)",
                borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E2E8F0"
              }}>
                <div>
                  <h2 className="wf-card-title" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: 800,
                    color: isDarkMode ? "#FFFFFF" : "#0F172A"
                  }}>
                    🤖 SphereHR AI Operations & Strategic Advisor
                  </h2>
                  <div style={{ display: "flex", gap: "10px", marginTop: "6px", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isDarkMode ? "#34D399" : "#059669",
                      background: isDarkMode ? "rgba(16,185,129,0.15)" : "#D1FAE5",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      border: isDarkMode ? "1px solid rgba(16,185,129,0.3)" : "1px solid #6EE7B7"
                    }}>
                      🟢 Gemini 1.5 Flash Connected
                    </span>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isDarkMode ? "#60A5FA" : "#2563EB",
                      background: isDarkMode ? "rgba(59,130,246,0.15)" : "#DBEAFE",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      border: isDarkMode ? "1px solid rgba(59,130,246,0.3)" : "1px solid #93C5FD"
                    }}>
                      ✨ Universal Knowledge Q&A Engine
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setChatMessages([{ sender: "assistant", text: "Welcome to Workforce AI Hub! I am SphereHR. Ask me about workforce metrics, employee performance ratings, team communication, technical topics, or management best practices.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])}
                  style={{
                    background: isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF",
                    border: isDarkMode ? "1px solid rgba(255,255,255,0.15)" : "1px solid #CBD5E1",
                    color: isDarkMode ? "#FFFFFF" : "#334155",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(0,0,0,0.05)"
                  }}
                >
                  🗑️ Clear Chat
                </button>
              </div>

              {/* Chat Panel */}
              <div className="wf-home-chat-panel" style={{ padding: "20px" }}>
                
                {/* Chat Messages List */}
                <div className="wf-home-chat-messages" style={{
                  minHeight: "360px",
                  maxHeight: "480px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  padding: "18px",
                  background: isDarkMode ? "rgba(15,12,10,0.5)" : "#F8FAFC",
                  borderRadius: "12px",
                  marginBottom: "18px",
                  border: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #E2E8F0"
                }}>
                  {chatMessages.map((msg, i) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div key={i} style={{
                        alignSelf: isUser ? "flex-end" : "flex-start",
                        maxWidth: "82%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isUser ? "flex-end" : "flex-start"
                      }}>
                        <div style={{
                          background: isUser
                            ? (isDarkMode ? "linear-gradient(135deg, #00e5ff, #8a2eff)" : "linear-gradient(135deg, #2563EB, #7C3AED)")
                            : (isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF"),
                          color: isUser
                            ? "#FFFFFF"
                            : (isDarkMode ? "#FFFFFF" : "#1E293B"),
                          padding: "12px 18px",
                          borderRadius: isUser ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          border: isUser ? "none" : (isDarkMode ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #E2E8F0"),
                          boxShadow: isUser ? "0 4px 12px rgba(37,99,235,0.2)" : (isDarkMode ? "0 2px 10px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.04)"),
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word"
                        }}>
                          {formatAiResponseText(msg.text)}
                        </div>

                        <div style={{ fontSize: "10px", fontWeight: 600, color: isDarkMode ? "#94A3B8" : "#64748B", marginTop: "4px", padding: "0 4px" }}>
                          {isUser ? "You" : (msg.source || "SphereHR AI")} • {msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}

                  {isChatLoading && (
                    <div style={{
                      alignSelf: "flex-start",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: isDarkMode ? "rgba(255,255,255,0.06)" : "#FFFFFF",
                      padding: "10px 16px",
                      borderRadius: "14px",
                      border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E2E8F0",
                      boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.04)"
                    }}>
                      <span className="wf-typing-dot" style={{ fontSize: "13px", color: isDarkMode ? "#38BDF8" : "#2563EB", fontWeight: 700 }}>
                        ✨ SphereHR AI is generating universal response...
                      </span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Prompts Row */}
                <div className="wf-home-chat-hints" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                  {quickPrompts.map((hint, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendChat(hint)}
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        background: isDarkMode ? "rgba(255,255,255,0.05)" : "#FFFFFF",
                        border: isDarkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid #CBD5E1",
                        padding: "7px 14px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        color: isDarkMode ? "#E2E8F0" : "#334155",
                        boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(0,0,0,0.03)",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = isDarkMode ? "rgba(0,229,255,0.15)" : "#EFF6FF";
                        e.target.style.borderColor = "#3B82F6";
                        e.target.style.color = isDarkMode ? "#FFFFFF" : "#2563EB";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "#FFFFFF";
                        e.target.style.borderColor = isDarkMode ? "rgba(255,255,255,0.12)" : "#CBD5E1";
                        e.target.style.color = isDarkMode ? "#E2E8F0" : "#334155";
                      }}
                    >
                      {hint}
                    </button>
                  ))}
                </div>

                {/* Input Row */}
                <div className="wf-home-chat-input-row" style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    style={{
                      flex: 1,
                      padding: "12px 18px",
                      borderRadius: "10px",
                      background: isDarkMode ? "rgba(0,0,0,0.25)" : "#FFFFFF",
                      border: isDarkMode ? "1px solid rgba(255,255,255,0.15)" : "1px solid #CBD5E1",
                      color: isDarkMode ? "#FFFFFF" : "#0F172A",
                      fontSize: "14px",
                      outline: "none",
                      boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(0,0,0,0.02)"
                    }}
                    placeholder="Ask SphereHR anything (communication, management, code, leaves...)"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSendChat(chatInput); }}
                    disabled={isChatLoading}
                  />
                  <button
                    className="wf-btn-primary"
                    style={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: 700,
                      borderRadius: "10px",
                      background: isDarkMode
                        ? "linear-gradient(135deg, #00e5ff, #8a2eff)"
                        : "linear-gradient(135deg, #2563EB, #7C3AED)",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(37,99,235,0.25)"
                    }}
                    onClick={() => handleSendChat(chatInput)}
                    disabled={isChatLoading || !chatInput.trim()}
                  >
                    Send 🚀
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 10: WORKFORCE SETTINGS CONTROL PANEL */}
          {activeTab === "Settings" && (
            <>
              {/* WELCOME BANNER WITH GRAPHIC */}
              <section className="wf-welcome-banner wf-hero-banner-enhanced">
                <div className="wf-welcome-text">
                  <h1>Workforce Settings & Administration</h1>
                  <p>Configure organizational structure, security policies, roles & permissions, notification preferences, and third-party integrations.</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                    <button className="wf-btn-primary" onClick={() => setActiveTab("Overview")}>
                      Return to Overview Dashboard
                    </button>
                    <button className="wf-promo-btn" style={{ background: "var(--wf-accent-dark-brown)" }} onClick={handleSaveSettings}>
                      💾 Save All Settings
                    </button>
                  </div>
                </div>
                <div className="wf-welcome-graphic wf-welcome-graphic-enhanced">
                  <div className="wf-hero-glow-backdrop" />
                  <div className="wf-hero-dot-matrix" />
                  <svg className="wf-hero-leaf-graphic" viewBox="0 0 100 100" fill="none">
                    <path d="M20 80 Q 40 20 80 10 Q 60 70 20 80 Z" fill="rgba(212, 140, 102, 0.18)" stroke="rgba(212, 140, 102, 0.35)" strokeWidth="1.5" />
                    <path d="M40 85 Q 70 40 90 30 Q 75 80 40 85 Z" fill="rgba(224, 122, 95, 0.15)" stroke="rgba(224, 122, 95, 0.3)" strokeWidth="1.5" />
                  </svg>
                  <img
                    src={themeMode === 'dark' ? (darkWorkforcePortalImg || darkHeroImg) : workforcePortalImg}
                    alt="Workforce Settings Illustration"
                    className="wf-team-illustration wf-team-illustration-large"
                  />
                </div>
              </section>

              {/* SUB-TAB NAVIGATION BAR */}
              <div className="wf-settings-tabs-bar">
                {[
                  { id: "General", label: "🏢 General & Organization" },
                  { id: "Roles", label: "🛡️ Roles & Permissions" },
                  { id: "Security", label: "🔒 Security & Access" },
                  { id: "Notifications", label: "🔔 Notifications & Alerts" },
                  { id: "Integrations", label: "🔗 Integrations & APIs" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`wf-settings-tab-btn ${settingsActiveSubTab === tab.id ? "active" : ""}`}
                    onClick={() => setSettingsActiveSubTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* SUB-TAB 1: GENERAL & ORGANIZATION */}
              {settingsActiveSubTab === "General" && (
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">General Organization Profile</h2>
                    <button className="wf-btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={handleSaveSettings}>
                      Save Changes
                    </button>
                  </div>

                  <div className="wf-settings-section">
                    <div className="wf-form-group">
                      <label>Organization Name</label>
                      <input
                        type="text"
                        value={settingsForm.companyName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                      />
                    </div>

                    <div className="wf-form-group">
                      <label>Company Portal Slug / Workspace URL</label>
                      <input
                        type="text"
                        value={settingsForm.companySlug}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companySlug: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="wf-form-group">
                        <label>Primary Timezone</label>
                        <select
                          value={settingsForm.timezone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                        >
                          <option>(UTC+05:30) India Standard Time (IST)</option>
                          <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                          <option>(UTC+00:00) Greenwich Mean Time (GMT)</option>
                          <option>(UTC+08:00) Singapore Standard Time (SST)</option>
                        </select>
                      </div>

                      <div className="wf-form-group">
                        <label>Default Currency</label>
                        <select
                          value={settingsForm.currency}
                          onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                        >
                          <option>USD ($)</option>
                          <option>INR (₹)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="wf-form-group">
                        <label>Primary Admin Contact Email</label>
                        <input
                          type="email"
                          value={settingsForm.adminEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                        />
                      </div>

                      <div className="wf-form-group">
                        <label>Fiscal Year Start Month</label>
                        <select
                          value={settingsForm.fiscalStart}
                          onChange={(e) => setSettingsForm({ ...settingsForm, fiscalStart: e.target.value })}
                        >
                          <option>January</option>
                          <option>April</option>
                          <option>July</option>
                          <option>October</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: ROLES & PERMISSIONS */}
              {settingsActiveSubTab === "Roles" && (
                <div className="wf-card">
                  <div className="wf-card-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <h2 className="wf-card-title">Roles & Access Control Matrix</h2>
                    <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }} onClick={() => alert("Opening Custom Role Creator...")}>
                      <FaPlus /> Create Custom Role
                    </button>
                  </div>

                  <div className="wf-table-responsive">
                    <table className="wf-table">
                      <thead>
                        <tr>
                          <th>Role Name</th>
                          <th>Access Level</th>
                          <th>Active Users</th>
                          <th>Permissions Scope</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Super Administrator</strong></td>
                          <td><span className="wf-status-pill completed">Full Admin</span></td>
                          <td><strong>5 Users</strong></td>
                          <td>System Settings, Billing, All Employee & Performance Data</td>
                          <td><button className="wf-action-dots-btn" onClick={() => alert("Editing Super Administrator permissions...")}>Edit</button></td>
                        </tr>
                        <tr>
                          <td><strong>Department Manager</strong></td>
                          <td><span className="wf-type-tag survey">Dept Manager</span></td>
                          <td><strong>14 Users</strong></td>
                          <td>Dept Employees, Reviews, Attendance Logs, Skill Matrix</td>
                          <td><button className="wf-action-dots-btn" onClick={() => alert("Editing Department Manager permissions...")}>Edit</button></td>
                        </tr>
                        <tr>
                          <td><strong>Team Lead</strong></td>
                          <td><span className="wf-type-tag initiative">Team Lead</span></td>
                          <td><strong>28 Users</strong></td>
                          <td>Team Skills, Learning Assignments, Peer Feedback</td>
                          <td><button className="wf-action-dots-btn" onClick={() => alert("Editing Team Lead permissions...")}>Edit</button></td>
                        </tr>
                        <tr>
                          <td><strong>Individual Contributor</strong></td>
                          <td><span className="wf-status-pill in-progress">Employee</span></td>
                          <td><strong>465 Users</strong></td>
                          <td>Self-service Portal, My Learning, Personal Reviews</td>
                          <td><button className="wf-action-dots-btn" onClick={() => alert("Editing Individual Contributor permissions...")}>Edit</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: SECURITY & ACCESS */}
              {settingsActiveSubTab === "Security" && (
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Security Policies & Access Enforcement</h2>
                    <button className="wf-btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={handleSaveSettings}>
                      Save Security Policies
                    </button>
                  </div>

                  <div className="wf-settings-section">
                    <div className="wf-settings-row">
                      <div className="wf-settings-label-box">
                        <span className="wf-settings-label-title">Enforce Two-Factor Authentication (2FA)</span>
                        <span className="wf-settings-label-desc">Require all workforce admins and employees to authenticate via OTP / Authenticator App.</span>
                      </div>
                      <label className="wf-toggle-switch">
                        <input
                          type="checkbox"
                          checked={settingsForm.enforce2FA}
                          onChange={(e) => setSettingsForm({ ...settingsForm, enforce2FA: e.target.checked })}
                        />
                        <span className="wf-toggle-slider" />
                      </label>
                    </div>

                    <div className="wf-settings-row">
                      <div className="wf-settings-label-box">
                        <span className="wf-settings-label-title">Single Sign-On (SSO) Enforcement</span>
                        <span className="wf-settings-label-desc">Enforce SAML 2.0 / Google Workspace SSO login for organizational domain.</span>
                      </div>
                      <label className="wf-toggle-switch">
                        <input
                          type="checkbox"
                          checked={settingsForm.enforceSSO}
                          onChange={(e) => setSettingsForm({ ...settingsForm, enforceSSO: e.target.checked })}
                        />
                        <span className="wf-toggle-slider" />
                      </label>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="wf-form-group">
                        <label>Password Rotation Policy</label>
                        <select
                          value={settingsForm.passwordRotation}
                          onChange={(e) => setSettingsForm({ ...settingsForm, passwordRotation: e.target.value })}
                        >
                          <option>30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                          <option>Never</option>
                        </select>
                      </div>

                      <div className="wf-form-group">
                        <label>Idle Session Timeout</label>
                        <select
                          value={settingsForm.sessionTimeout}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: e.target.value })}
                        >
                          <option>15 Minutes</option>
                          <option>30 Minutes</option>
                          <option>60 Minutes</option>
                          <option>4 Hours</option>
                        </select>
                      </div>
                    </div>

                    <div className="wf-form-group">
                      <label>IP Whitelist Ranges (CIDR blocks)</label>
                      <input
                        type="text"
                        value={settingsForm.ipWhitelist}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ipWhitelist: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: NOTIFICATIONS & ALERTS */}
              {settingsActiveSubTab === "Notifications" && (
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Automated Notification Preferences</h2>
                    <button className="wf-btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={handleSaveSettings}>
                      Save Preferences
                    </button>
                  </div>

                  <div className="wf-settings-section">
                    <div className="wf-settings-row">
                      <div className="wf-settings-label-box">
                        <span className="wf-settings-label-title">System Email Notifications</span>
                        <span className="wf-settings-label-desc">Send automated email updates for performance reviews, new hires, and reports.</span>
                      </div>
                      <label className="wf-toggle-switch">
                        <input
                          type="checkbox"
                          checked={settingsForm.emailNotifications}
                          onChange={(e) => setSettingsForm({ ...settingsForm, emailNotifications: e.target.checked })}
                        />
                        <span className="wf-toggle-slider" />
                      </label>
                    </div>

                    <div className="wf-settings-row">
                      <div className="wf-settings-label-box">
                        <span className="wf-settings-label-title">Slack / MS Teams Absence Alerts</span>
                        <span className="wf-settings-label-desc">Broadcast instant notifications when employees mark unplanned absences.</span>
                      </div>
                      <label className="wf-toggle-switch">
                        <input
                          type="checkbox"
                          checked={settingsForm.slackAlerts}
                          onChange={(e) => setSettingsForm({ ...settingsForm, slackAlerts: e.target.checked })}
                        />
                        <span className="wf-toggle-slider" />
                      </label>
                    </div>

                    <div className="wf-settings-row">
                      <div className="wf-settings-label-box">
                        <span className="wf-settings-label-title">Performance Review Reminders</span>
                        <span className="wf-settings-label-desc">Trigger automated weekly reminders for managers with pending review tasks.</span>
                      </div>
                      <label className="wf-toggle-switch">
                        <input
                          type="checkbox"
                          checked={settingsForm.reviewReminders}
                          onChange={(e) => setSettingsForm({ ...settingsForm, reviewReminders: e.target.checked })}
                        />
                        <span className="wf-toggle-slider" />
                      </label>
                    </div>

                    <div className="wf-settings-row">
                      <div className="wf-settings-label-box">
                        <span className="wf-settings-label-title">Skill Assessment Expiry Alerts</span>
                        <span className="wf-settings-label-desc">Notify team leads 14 days before certifications or assessments expire.</span>
                      </div>
                      <label className="wf-toggle-switch">
                        <input
                          type="checkbox"
                          checked={settingsForm.assessmentReminders}
                          onChange={(e) => setSettingsForm({ ...settingsForm, assessmentReminders: e.target.checked })}
                        />
                        <span className="wf-toggle-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: INTEGRATIONS & APIS */}
              {settingsActiveSubTab === "Integrations" && (
                <div className="wf-card">
                  <div className="wf-card-header">
                    <h2 className="wf-card-title">Connected Enterprise Apps & Webhooks</h2>
                    <button className="wf-btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }} onClick={handleSaveSettings}>
                      Save Connections
                    </button>
                  </div>

                  <div className="wf-integration-grid" style={{ marginBottom: "20px" }}>
                    <div className="wf-integration-card">
                      <div className="wf-integration-left">
                        <div className="wf-integration-icon">🌐</div>
                        <div className="wf-integration-info">
                          <span className="wf-integration-name">Google Workspace</span>
                          <span className="wf-integration-status">● Connected (SSO & Sync Active)</span>
                        </div>
                      </div>
                      <button className="wf-btn-primary" style={{ padding: "5px 12px", fontSize: "11px" }} onClick={() => alert("Re-syncing Google Workspace users...")}>Re-sync</button>
                    </div>

                    <div className="wf-integration-card">
                      <div className="wf-integration-left">
                        <div className="wf-integration-icon">💬</div>
                        <div className="wf-integration-info">
                          <span className="wf-integration-name">Slack Enterprise</span>
                          <span className="wf-integration-status">● Connected (Bot & Channel Sync)</span>
                        </div>
                      </div>
                      <button className="wf-btn-primary" style={{ padding: "5px 12px", fontSize: "11px" }} onClick={() => alert("Testing Slack bot connection...")}>Test Bot</button>
                    </div>

                    <div className="wf-integration-card">
                      <div className="wf-integration-left">
                        <div className="wf-integration-icon">🚀</div>
                        <div className="wf-integration-info">
                          <span className="wf-integration-name">Jira / Confluence</span>
                          <span className="wf-integration-status">● Connected (Project Skills Sync)</span>
                        </div>
                      </div>
                      <button className="wf-btn-primary" style={{ padding: "5px 12px", fontSize: "11px" }} onClick={() => alert("Configuring Jira field mappings...")}>Configure</button>
                    </div>

                    <div className="wf-integration-card">
                      <div className="wf-integration-left">
                        <div className="wf-integration-icon">📹</div>
                        <div className="wf-integration-info">
                          <span className="wf-integration-name">MS Teams & Zoom</span>
                          <span className="wf-integration-status">● Connected (Training Webinars)</span>
                        </div>
                      </div>
                      <button className="wf-btn-primary" style={{ padding: "5px 12px", fontSize: "11px" }} onClick={() => alert("Testing Zoom / Teams video API...")}>Test API</button>
                    </div>
                  </div>

                  <div className="wf-form-group">
                    <label>Custom Webhook Dispatch URL</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        style={{ flex: 1 }}
                        value={settingsForm.webhookUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, webhookUrl: e.target.value })}
                      />
                      <button className="wf-btn-primary" style={{ padding: "8px 16px", fontSize: "12px" }} onClick={() => alert("⚡ Webhook test payload dispatched successfully! Response: 200 OK")}>
                        ⚡ Test Webhook
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {/* REUSABLE FOOTER PRESENT ON ALL PAGE TABS */}
          <footer className="wf-dashboard-footer">
            <div className="wf-footer-top">
              <div className="wf-footer-brand">
                <div className="wf-footer-brand-logo" style={{ display: "inline-flex", alignItems: "center" }}>
                  <AppLogo height="56px" />
                </div>
                <p className="wf-footer-brand-desc">
                  Empowering organizations by building a skilled and engaged workforce.
                </p>
                <div className="wf-footer-socials">
                  <FaLinkedin className="wf-footer-social-icon" />
                  <FaFacebook className="wf-footer-social-icon" />
                  <FaTwitter className="wf-footer-social-icon" />
                  <FaInstagram className="wf-footer-social-icon" />
                </div>
              </div>

              <div className="wf-footer-col">
                <span className="wf-footer-col-title">Overview</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Overview")}>Overview</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Employees")}>Employees</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Teams")}>Teams</span>
              </div>

              <div className="wf-footer-col">
                <span className="wf-footer-col-title">Skills & Assessments</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Skills")}>Skills & Assessments</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Skills")}>Assessments</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Skills")}>Skill Library</span>
              </div>

              <div className="wf-footer-col">
                <span className="wf-footer-col-title">Performance</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Performance")}>Performance</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Performance")}>Reviews</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Performance")}>Goals</span>
              </div>

              <div className="wf-footer-col">
                <span className="wf-footer-col-title">Attendance</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Attendance")}>Attendance</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Attendance")}>Leaves</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Attendance")}>Calendar</span>
              </div>

              <div className="wf-footer-col">
                <span className="wf-footer-col-title">Engagement</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Engagement")}>Engagement</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Engagement")}>Surveys</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Engagement")}>Feedback</span>
              </div>

              <div className="wf-footer-col">
                <span className="wf-footer-col-title">Reports & Analytics</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Reports")}>Reports & Analytics</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Reports")}>Dashboards</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Reports")}>Insights</span>
              </div>

              <div className="wf-footer-col">
                <span className="wf-footer-col-title">Workforce Settings</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Settings")}>Workforce Settings</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Settings")}>Roles & Permissions</span>
                <span className="wf-footer-link" onClick={() => setActiveTab("Settings")}>Integrations</span>
              </div>
            </div>

            <div className="wf-footer-bottom">
              <span>© 2025 SkillSphere Workforce. All rights reserved.</span>
              <div className="wf-footer-bottom-links">
                <span className="wf-footer-link" onClick={() => navigate("/contact")}>Privacy Policy</span>
                <span className="wf-footer-link" onClick={() => navigate("/contact")}>Terms of Service</span>
                <span className="wf-footer-link" onClick={() => navigate("/contact")}>Help Center</span>
                <span className="wf-footer-link" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><FaGlobe /> English</span>
              </div>
            </div>
          </footer>

        </main>
      </div>

      {/* CREATE TEAM MODAL */}
      {showCreateTeamModal && (
        <div className="wf-modal-overlay" onClick={() => setShowCreateTeamModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>Create New Team</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowCreateTeamModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateTeam}>
              <div className="wf-form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Research Group"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>

              <div className="wf-form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Developing next-gen machine learning features"
                  value={newTeam.desc}
                  onChange={(e) => setNewTeam({ ...newTeam, desc: e.target.value })}
                />
              </div>

              <div className="wf-form-group">
                <label>Team Lead Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Mehta"
                  value={newTeam.lead}
                  onChange={(e) => setNewTeam({ ...newTeam, lead: e.target.value })}
                />
              </div>

              <div className="wf-form-group">
                <label>Department</label>
                <select
                  value={newTeam.dept}
                  onChange={(e) => setNewTeam({ ...newTeam, dept: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product Development">Product Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div className="wf-form-group">
                <label>Member Count</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newTeam.members}
                  onChange={(e) => setNewTeam({ ...newTeam, members: e.target.value })}
                />
              </div>

              <div className="wf-modal-actions">
                <button type="button" className="wf-select-filter" onClick={() => setShowCreateTeamModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary">
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      {showEmployeeModal && (
        <div className="wf-modal-overlay" onClick={() => setShowEmployeeModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>Add New Employee</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowEmployeeModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddEmployee}>
              <div className="wf-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                />
              </div>

              <div className="wf-form-group">
                <label>Role / Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newEmp.role}
                  onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                />
              </div>

              <div className="wf-form-group">
                <label>Department</label>
                <select
                  value={newEmp.dept}
                  onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product Development">Product Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Operations">Operations</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div className="wf-form-group">
                <label>Initial Skill Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newEmp.score}
                  onChange={(e) => setNewEmp({ ...newEmp, score: e.target.value })}
                />
              </div>

              <div className="wf-modal-actions">
                <button type="button" className="wf-select-filter" onClick={() => setShowEmployeeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary">
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN PROJECT MODAL */}
      {showProjectModal && (
        <div className="wf-modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>Assign New Project</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowProjectModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAssignProjectSubmit}>
              <div className="wf-form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REST API Optimizations"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                />
              </div>

              <div className="wf-form-group">
                <label>Assignee</label>
                <select
                  required
                  value={newProj.assignee}
                  onChange={(e) => setNewProj({ ...newProj, assignee: e.target.value })}
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.dept})</option>
                  ))}
                </select>
              </div>

              <div className="wf-form-group">
                <label>Priority</label>
                <select
                  value={newProj.priority}
                  onChange={(e) => setNewProj({ ...newProj, priority: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="wf-form-group">
                <label>Initial Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProj.progress}
                  onChange={(e) => setNewProj({ ...newProj, progress: e.target.value })}
                />
              </div>

              <div className="wf-modal-actions">
                <button type="button" className="wf-select-filter" onClick={() => setShowProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary">
                  Assign Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE DRILLDOWN MODALS */}
      {showExportModal && (
        <div className="wf-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>Export Attendance Report</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowExportModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="wf-form-group">
              <label>Select Export Format</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className={`wf-filter-pill ${exportFormat === "PDF" ? "active" : ""}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  onClick={() => setExportFormat("PDF")}
                >
                  <FaFilePdf /> PDF Report
                </button>
                <button
                  className={`wf-filter-pill ${exportFormat === "XLSX" ? "active" : ""}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  onClick={() => setExportFormat("XLSX")}
                >
                  <FaFileExcel /> Excel (.xlsx)
                </button>
              </div>
            </div>

            <div className="wf-form-group">
              <label>Date Range Filter</label>
              <select defaultValue="May 2025">
                <option>Current Month (May 2025)</option>
                <option>Last Month (April 2025)</option>
                <option>Year to Date (2025)</option>
              </select>
            </div>

            <div className="wf-modal-actions">
              <button className="wf-select-filter" onClick={() => setShowExportModal(false)}>Cancel</button>
              <button className="wf-btn-primary" onClick={() => {
                alert(`Downloading ${exportFormat} report for Attendance Overview...`);
                setShowExportModal(false);
              }}>
                <FaCheck /> Generate & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAssessment && (
        <div className="wf-modal-overlay" onClick={() => setSelectedAssessment(null)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>{selectedAssessment.title}</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setSelectedAssessment(null)}>
                <FaTimes />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", background: "#f8f4f0", borderRadius: "8px" }}>
                <span style={{ color: "var(--wf-text-muted)", fontSize: "11px", display: "block" }}>Category</span>
                <strong>{selectedAssessment.category}</strong>
              </div>
              <div style={{ padding: "10px", background: "#f8f4f0", borderRadius: "8px" }}>
                <span style={{ color: "var(--wf-text-muted)", fontSize: "11px", display: "block" }}>Status</span>
                <strong>{selectedAssessment.status}</strong>
              </div>
              <div style={{ padding: "10px", background: "#f8f4f0", borderRadius: "8px" }}>
                <span style={{ color: "var(--wf-text-muted)", fontSize: "11px", display: "block" }}>Participants</span>
                <strong>{selectedAssessment.participants} Members</strong>
              </div>
              <div style={{ padding: "10px", background: "#f8f4f0", borderRadius: "8px" }}>
                <span style={{ color: "var(--wf-text-muted)", fontSize: "11px", display: "block" }}>Average Score</span>
                <strong>{selectedAssessment.score}</strong>
              </div>
            </div>

            <div className="wf-modal-actions">
              <button className="wf-btn-primary" onClick={() => setSelectedAssessment(null)}>Close Details</button>
            </div>
          </div>
        </div>
      )}

      {showReviewsModal && (
        <div className="wf-modal-overlay" onClick={() => setShowReviewsModal(false)}>
          <div className="wf-modal-box" style={{ maxWidth: "600px" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>Organization Performance Breakdown</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowReviewsModal(false)}>
                <FaTimes />
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "var(--wf-text-secondary)", marginBottom: "16px" }}>
              Comprehensive performance scores across 248 evaluated workforce employees.
            </p>

            <div className="wf-activity-list" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <div className="wf-activity-item">
                <div className="wf-activity-left">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Sneha" className="wf-activity-avatar" />
                  <div className="wf-activity-details">
                    <span className="wf-activity-name">Sneha Kapoor • Data Scientist</span>
                    <span className="wf-activity-time">Rating: 4.9/5 • Exceeded all ML velocity targets</span>
                  </div>
                </div>
                <span className="wf-perf-pill excellent">4.9 Excellent</span>
              </div>

              <div className="wf-activity-item">
                <div className="wf-activity-left">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Vikram" className="wf-activity-avatar" />
                  <div className="wf-activity-details">
                    <span className="wf-activity-name">Vikram Patil • Engineering Lead</span>
                    <span className="wf-activity-time">Rating: 4.8/5 • Delivered microservices refactoring</span>
                  </div>
                </div>
                <span className="wf-perf-pill excellent">4.8 Excellent</span>
              </div>
            </div>

            <div className="wf-modal-actions">
              <button className="wf-btn-primary" onClick={() => setShowReviewsModal(false)}>Close Breakdown</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply for Leave Modal */}
      {showApplyLeaveModal && (
        <div className="wf-modal-overlay" onClick={() => setShowApplyLeaveModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>🌴 Apply for Leave</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowApplyLeaveModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Leave Type</label>
                <select
                  className="wf-select-filter"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                  value={newLeaveForm.leaveType}
                  onChange={e => setNewLeaveForm({ ...newLeaveForm, leaveType: e.target.value })}
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Paid Time Off">Paid Time Off</option>
                  <option value="Vacation Leave">Vacation Leave</option>
                  <option value="Maternity / Paternity Leave">Maternity / Paternity Leave</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Start Date</label>
                  <input
                    type="date"
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                    value={newLeaveForm.startDate}
                    onChange={e => setNewLeaveForm({ ...newLeaveForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>End Date</label>
                  <input
                    type="date"
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                    value={newLeaveForm.endDate}
                    onChange={e => setNewLeaveForm({ ...newLeaveForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Reason for Leave</label>
                <textarea
                  required
                  placeholder="Explain why leave is requested..."
                  rows={3}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", resize: "none" }}
                  value={newLeaveForm.reason}
                  onChange={e => setNewLeaveForm({ ...newLeaveForm, reason: e.target.value })}
                />
              </div>

              <div className="wf-modal-actions" style={{ marginTop: "10px" }}>
                <button type="button" className="wf-btn-secondary" onClick={() => setShowApplyLeaveModal(false)} style={{ padding: "10px 18px", borderRadius: "8px" }}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary" style={{ padding: "10px 20px", borderRadius: "8px", background: "#f9572a" }}>
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Survey Modal */}
      {showCreateSurveyModal && (
        <div className="wf-modal-overlay" onClick={() => setShowCreateSurveyModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>📊 Create New Engagement Survey</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowCreateSurveyModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateSurveySubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Survey / Initiative Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Workplace Culture & Wellness Survey"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  value={newSurveyForm.title}
                  onChange={e => setNewSurveyForm({ ...newSurveyForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Initiative Type</label>
                  <select
                    className="wf-select-filter"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                    value={newSurveyForm.type}
                    onChange={e => setNewSurveyForm({ ...newSurveyForm, type: e.target.value })}
                  >
                    <option value="Survey">Survey</option>
                    <option value="Initiative">Initiative</option>
                    <option value="Pulse Poll">Pulse Poll</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Target Department</label>
                  <select
                    className="wf-select-filter"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                    value={newSurveyForm.dept}
                    onChange={e => setNewSurveyForm({ ...newSurveyForm, dept: e.target.value })}
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Launch Date</label>
                  <input
                    type="date"
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                    value={newSurveyForm.startDate}
                    onChange={e => setNewSurveyForm({ ...newSurveyForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Closing Date</label>
                  <input
                    type="date"
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                    value={newSurveyForm.endDate}
                    onChange={e => setNewSurveyForm({ ...newSurveyForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Description & Goals</label>
                <textarea
                  placeholder="Outline the survey objective..."
                  rows={3}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", resize: "none" }}
                  value={newSurveyForm.desc}
                  onChange={e => setNewSurveyForm({ ...newSurveyForm, desc: e.target.value })}
                />
              </div>

              <div className="wf-modal-actions" style={{ marginTop: "10px" }}>
                <button type="button" className="wf-btn-secondary" onClick={() => setShowCreateSurveyModal(false)} style={{ padding: "10px 18px", borderRadius: "8px" }}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary" style={{ padding: "10px 20px", borderRadius: "8px" }}>
                  Launch Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Custom Report Modal */}
      {showCustomReportModal && (
        <div className="wf-modal-overlay" onClick={() => setShowCustomReportModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>📝 Generate Custom Report</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowCustomReportModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCustomReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q2 Workforce Velocity & Skill Gap Benchmark"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  value={customReportForm.title}
                  onChange={e => setCustomReportForm({ ...customReportForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Category</label>
                  <select
                    className="wf-select-filter"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                    value={customReportForm.category}
                    onChange={e => setCustomReportForm({ ...customReportForm, category: e.target.value })}
                  >
                    <option value="Skills">Skills</option>
                    <option value="Performance">Performance</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Learning">Learning</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Frequency</label>
                  <select
                    className="wf-select-filter"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                    value={customReportForm.frequency}
                    onChange={e => setCustomReportForm({ ...customReportForm, frequency: e.target.value })}
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Export Format</label>
                <select
                  className="wf-select-filter"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                  value={customReportForm.format}
                  onChange={e => setCustomReportForm({ ...customReportForm, format: e.target.value })}
                >
                  <option value="PDF / Excel">PDF / Excel</option>
                  <option value="PDF">PDF Only</option>
                  <option value="CSV / Excel">CSV / Excel</option>
                </select>
              </div>

              <div className="wf-modal-actions" style={{ marginTop: "10px" }}>
                <button type="button" className="wf-btn-secondary" onClick={() => setShowCustomReportModal(false)} style={{ padding: "10px 18px", borderRadius: "8px" }}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary" style={{ padding: "10px 20px", borderRadius: "8px" }}>
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="wf-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>📥 Export Workforce Report</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowExportModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleExportReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Select Export Format</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {["CSV", "PDF", "Excel"].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      style={{
                        padding: "10px", borderRadius: "8px", fontWeight: "800", fontSize: "13px",
                        border: exportFormat === fmt ? "2px solid #e07a5f" : "1px solid #CBD5E1",
                        background: exportFormat === fmt ? "rgba(224, 122, 95, 0.15)" : "transparent",
                        color: exportFormat === fmt ? "#e07a5f" : "inherit",
                        cursor: "pointer"
                      }}
                      onClick={() => setExportFormat(fmt)}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Department Scope</label>
                <select
                  className="wf-select-filter"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                  value={attendanceDeptFilter}
                  onChange={e => setAttendanceDeptFilter(e.target.value)}
                >
                  <option value="All Departments">All Departments (512 Employees)</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div className="wf-modal-actions" style={{ marginTop: "10px" }}>
                <button type="button" className="wf-btn-secondary" onClick={() => setShowExportModal(false)} style={{ padding: "10px 18px", borderRadius: "8px" }}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary" style={{ padding: "10px 20px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <FaFileExport /> Export & Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="wf-modal-overlay" onClick={() => setShowCreateTeamModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>👥 Create New Workforce Team</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowCreateTeamModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Cloud Architecture Unit"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  value={newTeam.name}
                  onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Department</label>
                  <select
                    className="wf-select-filter"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                    value={newTeam.dept}
                    onChange={e => setNewTeam({ ...newTeam, dept: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Team Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. Aman Verma"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                    value={newTeam.lead}
                    onChange={e => setNewTeam({ ...newTeam, lead: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Initial Team Members</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  value={newTeam.members}
                  onChange={e => setNewTeam({ ...newTeam, members: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Team Mission / Description</label>
                <textarea
                  rows={2}
                  placeholder="Outline the team's responsibility..."
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", resize: "none" }}
                  value={newTeam.desc}
                  onChange={e => setNewTeam({ ...newTeam, desc: e.target.value })}
                />
              </div>

              <div className="wf-modal-actions" style={{ marginTop: "10px" }}>
                <button type="button" className="wf-btn-secondary" onClick={() => setShowCreateTeamModal(false)} style={{ padding: "10px 18px", borderRadius: "8px" }}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary" style={{ padding: "10px 20px", borderRadius: "8px" }}>
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showEmployeeModal && (
        <div className="wf-modal-overlay" onClick={() => setShowEmployeeModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>👤 Add New Employee</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowEmployeeModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  value={newEmp.name}
                  onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Department</label>
                  <select
                    className="wf-select-filter"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                    value={newEmp.dept}
                    onChange={e => setNewEmp({ ...newEmp, dept: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Designation / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                    value={newEmp.role}
                    onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Employment Status</label>
                  <select
                    className="wf-select-filter"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                    value={newEmp.status}
                    onChange={e => setNewEmp({ ...newEmp, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "750", marginBottom: "6px" }}>Initial Skill Score</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                    value={newEmp.score}
                    onChange={e => setNewEmp({ ...newEmp, score: parseInt(e.target.value) || 85 })}
                  />
                </div>
              </div>

              <div className="wf-modal-actions" style={{ marginTop: "10px" }}>
                <button type="button" className="wf-btn-secondary" onClick={() => setShowEmployeeModal(false)} style={{ padding: "10px 18px", borderRadius: "8px" }}>
                  Cancel
                </button>
                <button type="submit" className="wf-btn-primary" style={{ padding: "10px 20px", borderRadius: "8px" }}>
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Calendar Modal */}
      {showCalendarModal && (
        <div className="wf-modal-overlay" onClick={() => setShowCalendarModal(false)}>
          <div className="wf-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="wf-modal-title" style={{ margin: 0 }}>📅 Workforce Attendance & Event Calendar (May 2025)</h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }} onClick={() => setShowCalendarModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", marginBottom: "16px" }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <div key={day} style={{ fontWeight: "800", fontSize: "12px", color: "var(--wf-text-muted)" }}>{day}</div>
              ))}
              {Array.from({ length: 31 }).map((_, idx) => {
                const dayNum = idx + 1;
                const isHoliday = dayNum === 1 || dayNum === 25;
                const hasLeave = dayNum === 5 || dayNum === 6 || dayNum === 7;
                return (
                  <div
                    key={dayNum}
                    style={{
                      padding: "10px 4px", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
                      background: isHoliday ? "rgba(239, 68, 68, 0.15)" : hasLeave ? "rgba(245, 158, 11, 0.15)" : "rgba(0,0,0,0.03)",
                      color: isHoliday ? "#EF4444" : hasLeave ? "#D97706" : "inherit",
                      border: dayNum === 15 ? "2px solid #e07a5f" : "none"
                    }}
                  >
                    <div>{dayNum}</div>
                    <div style={{ fontSize: "9px", fontWeight: "600", marginTop: "2px" }}>
                      {isHoliday ? "Holiday" : hasLeave ? "Leave" : "83% Pres"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="wf-modal-actions">
              <button className="wf-btn-primary" onClick={() => setShowCalendarModal(false)}>Close Calendar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MESSAGES / TEAM CHAT DRAWER ── */}
      {showMessagesDrawer && (
        <div className="wf-modal-overlay" onClick={() => setShowMessagesDrawer(false)}>
          <div
            className="wf-modal-box"
            onClick={e => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "70px",
              right: "20px",
              width: "380px",
              maxWidth: "92vw",
              height: "540px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              padding: "0",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              background: themeMode === 'dark' ? "#0f172a" : "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            {/* Chat Header */}
            <div style={{
              padding: "14px 16px",
              background: "var(--wf-accent-brown, #8c5338)",
              color: "#ffffff",
              display: "flex",
              justify: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={activeChatUser.avatar} alt={activeChatUser.name} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800" }}>{activeChatUser.name}</h4>
                  <span style={{ fontSize: "11px", opacity: 0.85 }}>● {activeChatUser.status} • {activeChatUser.role}</span>
                </div>
              </div>
              <button
                style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "18px" }}
                onClick={() => setShowMessagesDrawer(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Teammates Quick Switcher */}
            <div style={{
              padding: "8px 12px",
              background: themeMode === 'dark' ? "rgba(255,255,255,0.05)" : "#FAF8F5",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              gap: "8px",
              overflowX: "auto"
            }}>
              {[
                { id: 1, name: "Aman Verma", role: "Engineering Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", status: "Online" },
                { id: 2, name: "Sneha Iyer", role: "Marketing Specialist", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", status: "Online" },
                { id: 3, name: "Riya Sharma", role: "Operations Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", status: "Away" },
                { id: 4, name: "Vikram Singh", role: "Data Analyst", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", status: "Online" }
              ].map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setActiveChatUser(u)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px", borderRadius: "20px",
                    border: activeChatUser.id === u.id ? "2px solid #e07a5f" : "1px solid transparent",
                    background: activeChatUser.id === u.id ? "rgba(224,122,95,0.18)" : "transparent",
                    color: activeChatUser.id === u.id ? "#e07a5f" : "inherit",
                    cursor: "pointer", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap"
                  }}
                >
                  <img src={u.avatar} alt={u.name} style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
                  <span>{u.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages */}
             <div style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: themeMode === 'dark' ? "#0f172a" : "#ffffff"
            }}>
              {teamMessages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.isMe ? "flex-end" : "flex-start",
                    maxWidth: "82%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.isMe ? "flex-end" : "flex-start"
                  }}
                >
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: msg.isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: msg.isMe ? "#e07a5f" : (themeMode === 'dark' ? "#1e293b" : "#f1f5f9"),
                    color: msg.isMe ? "#ffffff" : (themeMode === 'dark' ? "#f8fafc" : "#334155"),
                    fontSize: "12px",
                    lineHeight: "1.4",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--wf-text-muted)", marginTop: "4px", padding: "0 4px" }}>
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessageSubmit} style={{
              padding: "12px",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              gap: "8px",
              background: themeMode === 'dark' ? "#1e293b" : "#FAF8F5"
            }}>
              <input
                type="text"
                placeholder={`Message ${activeChatUser.name.split(' ')[0]}...`}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  outline: "none",
                  fontSize: "12px",
                  background: themeMode === 'dark' ? "#0f172a" : "#ffffff",
                  color: themeMode === 'dark' ? "#ffffff" : "#000000"
                }}
                value={inputMessageText}
                onChange={e => setInputMessageText(e.target.value)}
              />
              <button
                type="submit"
                className="wf-btn-primary"
                style={{
                  width: "36px", height: "36px", borderRadius: "50%", padding: "0",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <FaPaperPlane style={{ fontSize: "12px" }} />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* EXTEND OFFER MODAL FOR EMPLOYER ROLE */}
      {showOfferModal && selectedStudent && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
          <div style={{ background: "var(--bg-secondary)", padding: "30px", borderRadius: "16px", width: "450px", border: "1px solid var(--border-color)" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>Extend Official Offer</h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Recruiting: <strong>{selectedStudent.full_name || selectedStudent.username}</strong>
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const hiredRecord = {
                id: Date.now(),
                studentName: selectedStudent.full_name || selectedStudent.username,
                studentEmail: `${selectedStudent.username.toLowerCase()}@skillsphere.edu`,
                jobTitle: offerForm.title,
                package: offerForm.package,
                type: offerForm.type,
                hiredDate: new Date().toISOString().split("T")[0]
              };
              setHiredStudents(prev => [hiredRecord, ...prev]);
              setShowOfferModal(false);
              alert(`🎉 Offer successfully extended to ${hiredRecord.studentName} for the role of ${hiredRecord.jobTitle}!`);
            }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>Proposed Job Title</label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>Salary Package Details</label>
                <input
                  type="text"
                  value={offerForm.package}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, package: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>Workplace Setup</label>
                <select
                  value={offerForm.type}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, type: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>Personal Offer Message</label>
                <textarea
                  value={offerForm.message}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Hi candidate, we loved your learning nexus scores and would love to hire you!"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", height: "80px", resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="loginBtn" onClick={() => setShowOfferModal(false)}>Cancel</button>
                <button type="submit" className="wf-btn-primary" style={{ background: "#8c5338", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <FaPaperPlane style={{ fontSize: "12px" }} /> Send Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

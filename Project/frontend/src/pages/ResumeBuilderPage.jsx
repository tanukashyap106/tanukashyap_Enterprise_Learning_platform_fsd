import React, { useRef, useState } from "react";
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
  FaMapSigns,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaCalendarAlt,
  FaDownload,
  FaShareAlt,
  FaChevronDown,
  FaEye,
  FaStar,
  FaRedo,
  FaCheck,
  FaExclamationTriangle,
  FaMagic,
  FaCamera,
  FaBriefcase,
  FaCode,
  FaGlobe,
  FaTimes,
  FaFileWord,
  FaPlus,
  FaTrash,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaPlusCircle,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/studentDashboard.css";
import "../styles/resumeBuilderPage.css";

import AppLogo from "../components/AppLogo";

export default function ResumeBuilderPage() {
  const { user, xp, logout, themeMode, toggleTheme, authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [toastMessage, setToastMessage] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const [isResumeAnalyzed, setIsResumeAnalyzed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showAllTemplatesModal, setShowAllTemplatesModal] = useState(false);
  const photoInputRef = useRef(null);
  const [lastSaved, setLastSaved] = useState("Just now");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  const currentXp = xp ?? 0;

  const userSkills = user?.skills ? user.skills.split(",").map(s => s.trim()) : ["React", "Java", "Spring Boot"];

  // Real-time Resume Form State (Fully Editable Across All 9 Tabs)
  const [resumeData, setResumeData] = useState({
    fullName: user?.full_name || user?.username || "Learner",
    jobTitle: user?.role === "STUDENT" ? "Student & Software Developer" : "Software Engineer",
    email: user?.contact_email || user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    portfolio: user?.portfolio || "",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    summary: user?.bio || "I am a software engineer with experience in a variety of programming languages and a track record of delivering high-quality code.",
    skills: userSkills,
    languages: [
      { id: 1, name: "English", level: "•••••" },
      { id: 2, name: "Hindi", level: "•••••" },
      { id: 3, name: "Odia", level: "•••••" }
    ],
    experiences: [
      {
        id: 1,
        title: "Senior Software Developer Intern",
        company: "CodeSoft Pvt. Ltd.",
        period: "May 2024 – Jul 2024",
        bullets: [
          "Developed responsive web applications using React.js and Node.js.",
          "Collaborated with cross-functional teams to deliver features.",
          "Optimized application performance and fixed bugs."
        ]
      },
      {
        id: 2,
        title: "Web Developer Intern",
        company: "BrainyBeam Technologies",
        period: "Jan 2024 – Apr 2024",
        bullets: [
          "Built and maintained web pages using HTML, CSS, JavaScript.",
          "Integrated REST APIs and managed data using MySQL.",
          "Assisted in improving UI/UX and website responsiveness."
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Technology in Computer Science",
        institution: "Global Institute of Technology",
        period: "2022 – 2026",
        score: "CGPA: 8.9 / 10"
      },
      {
        id: 2,
        degree: "Higher Secondary Education",
        institution: "High School Academy",
        period: "2020 – 2022",
        score: "Percentage: 92.4%"
      }
    ],
    projects: [
      {
        id: 1,
        name: "SkillSphere Learning Nexus",
        tech: "React, Node.js, MongoDB",
        desc: "Gamified learning platform with AI Study Buddy, Quest System and dashboards."
      },
      {
        id: 2,
        name: "BharatYatra - Tourism Booking Portal",
        tech: "React, Tailwind CSS",
        desc: "Full-stack tourism portal with authentication, booking and recommendation system."
      }
    ],
    certifications: [
      "Python for Everybody - Coursera",
      "Java Programming - HackerRank"
    ],
    achievements: [
      "Winner of National Hackathon 2024",
      "Published technical article on React performance optimization"
    ],
    interests: [
      "Open Source Contributing",
      "Competitive Coding",
      "UI/UX Design",
      "Artificial Intelligence"
    ]
  });

  const [newSkillInput, setNewSkillInput] = useState("");
  const [newCertInput, setNewCertInput] = useState("");
  const [newAchieveInput, setNewAchieveInput] = useState("");
  const [newInterestInput, setNewInterestInput] = useState("");

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

  const templates = [
    { id: "modern", name: "Modern", rating: 5, bg: "modern" },
    { id: "ats-friendly", name: "ATS Friendly", rating: 5, bg: "ats" },
    { id: "minimal", name: "Minimal", rating: 5, bg: "minimal" },
    { id: "creative", name: "Creative", rating: 5, bg: "creative" },
    { id: "executive", name: "Executive", rating: 5, bg: "executive" }
  ];

  // Helper Input Handler for Top-Level Fields
  const handleInputChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToastMessage("Please choose a JPG, PNG, or other image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setToastMessage("Please choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResumeData((prev) => ({ ...prev, photoUrl: reader.result }));
      setToastMessage("Profile photo updated in your resume preview.");
      setTimeout(() => setToastMessage(""), 4000);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  // ── EDUCATION HANDLERS ──
  const handleEduChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    }));
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: "Degree / Qualification Title",
      institution: "University / Institution Name",
      period: "2024 – Present",
      score: "Grade / Percentage"
    };
    setResumeData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const handleDeleteEducation = (id) => {
    setResumeData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  };

  // ── EXPERIENCE HANDLERS ──
  const handleExpChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    }));
  };

  const handleExpBulletChange = (expId, bulletIdx, value) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id === expId) {
          const newBullets = [...exp.bullets];
          newBullets[bulletIdx] = value;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    }));
  };

  const handleAddExpBullet = (expId) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id === expId) {
          return { ...exp, bullets: [...exp.bullets, "New key responsibility or achievement..."] };
        }
        return exp;
      })
    }));
  };

  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      title: "Job Position / Title",
      company: "Company Name",
      period: "2024 – Present",
      bullets: ["Developed software features and collaborated with team."]
    };
    setResumeData((prev) => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const handleDeleteExperience = (id) => {
    setResumeData((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  };

  // ── PROJECTS HANDLERS ──
  const handleProjChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    }));
  };

  const handleAddProject = () => {
    const newProj = {
      id: Date.now(),
      name: "New Project Name",
      tech: "React, Node.js, SQL",
      desc: "Brief project description explaining the technologies and features built."
    };
    setResumeData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const handleDeleteProject = (id) => {
    setResumeData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  // ── SKILLS HANDLERS ──
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, newSkillInput.trim()] }));
    setNewSkillInput("");
  };

  const handleDeleteSkill = (idxToRemove) => {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== idxToRemove) }));
  };

  // ── CERTIFICATIONS HANDLERS ──
  const handleAddCert = () => {
    if (!newCertInput.trim()) return;
    setResumeData((prev) => ({ ...prev, certifications: [...prev.certifications, newCertInput.trim()] }));
    setNewCertInput("");
  };

  const handleDeleteCert = (idxToRemove) => {
    setResumeData((prev) => ({ ...prev, certifications: prev.certifications.filter((_, idx) => idx !== idxToRemove) }));
  };

  // ── ACHIEVEMENTS HANDLERS ──
  const handleAddAchievement = () => {
    if (!newAchieveInput.trim()) return;
    setResumeData((prev) => ({ ...prev, achievements: [...prev.achievements, newAchieveInput.trim()] }));
    setNewAchieveInput("");
  };

  const handleDeleteAchievement = (idxToRemove) => {
    setResumeData((prev) => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== idxToRemove) }));
  };

  // ── LANGUAGES HANDLERS ──
  const handleLangChange = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    }));
  };

  const handleAddLanguage = () => {
    const newLang = { id: Date.now(), name: "Language Name", level: "•••••" };
    setResumeData((prev) => ({ ...prev, languages: [...prev.languages, newLang] }));
  };

  const handleDeleteLanguage = (id) => {
    setResumeData((prev) => ({ ...prev, languages: prev.languages.filter((l) => l.id !== id) }));
  };

  // ── INTERESTS HANDLERS ──
  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    setResumeData((prev) => ({ ...prev, interests: [...prev.interests, newInterestInput.trim()] }));
    setNewInterestInput("");
  };

  const handleDeleteInterest = (idxToRemove) => {
    setResumeData((prev) => ({ ...prev, interests: prev.interests.filter((_, idx) => idx !== idxToRemove) }));
  };

  const isLoadedRef = React.useRef(false);

  // Fetch resume from backend
  const fetchResume = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/resume`);
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.selectedTemplate) {
          setSelectedTemplate(data.selectedTemplate);
        }
        if (data.content) {
          const parsed = JSON.parse(data.content);
          setResumeData(parsed);
        }
        if (data.updatedAt) {
          const savedDate = new Date(data.updatedAt);
          setLastSaved(savedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        setTimeout(() => {
          isLoadedRef.current = true;
        }, 200);
      } else {
        isLoadedRef.current = true;
      }
    } catch (err) {
      console.error("Failed to fetch resume:", err);
      isLoadedRef.current = true;
    }
  };

  React.useEffect(() => {
    fetchResume();
  }, []);

  const autoSaveResume = async () => {
    try {
      setLastSaved("Saving...");
      const res = await authenticatedFetch(`${API_URL}/api/resume/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedTemplate: selectedTemplate,
          content: JSON.stringify(resumeData)
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setLastSaved("Failed");
      }
    } catch (err) {
      console.error("Autosave error:", err);
      setLastSaved("Error");
    }
  };

  React.useEffect(() => {
    if (!isLoadedRef.current) return;

    const delayDebounce = setTimeout(() => {
      autoSaveResume();
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [resumeData, selectedTemplate]);

  // Save changes to database (Manual fallback button)
  const handleSaveChanges = async () => {
    await autoSaveResume();
    setToastMessage("💾 Resume changes saved to database successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // AI Assistant Action Handlers
  const handleAiAction = (actionName) => {
    if (actionName === "Improve Summary") {
      setResumeData((prev) => ({
        ...prev,
        summary:
          "Passionate Full-Stack Software Engineer with expertise in React, Node.js, and Java. Proven track record in building scalable web platforms, REST APIs, and responsive UI components. Strong problem-solver dedicated to code excellence and collaborative innovation."
      }));
      setToastMessage("✨ Professional summary enhanced by AI!");
    } else if (actionName === "Suggest Skills") {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, "TypeScript", "Docker", "RESTful APIs", "GraphQL"]
      }));
      setToastMessage("💡 Added trending skills (TypeScript, Docker, REST APIs)!");
    } else if (actionName === "ATS Optimization") {
      setIsResumeAnalyzed(true);
      setToastMessage("📈 Resume optimized for ATS scanners! ATS Score increased to 96%!");
    } else {
      setToastMessage(`🪄 Executed AI action: "${actionName}"!`);
    }
    setTimeout(() => setToastMessage(""), 4000);
  };

  // PDF Download & Printable Document Trigger
  const handleDownloadPDF = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${resumeData.fullName} - Resume</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 24px; background: #ffffff; }
    h1 { font-size: 24px; color: #0f172a; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
    .job-title { font-size: 14px; font-weight: 700; color: #f9572a; margin-bottom: 12px; }
    .contact-line { font-size: 11px; color: #475569; margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    .sec-header { font-size: 13px; font-weight: 800; color: #0f172a; border-bottom: 1.5px solid #0f172a; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    p, li { font-size: 12px; color: #334155; }
    ul { padding-left: 18px; margin: 4px 0; }
    .entry-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 12px; margin-top: 10px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .skill-tag { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; color: #0f172a; }
  </style>
</head>
<body>
  <h1>${resumeData.fullName}</h1>
  <div class="job-title">${resumeData.jobTitle}</div>
  <div class="contact-line">
    📍 ${resumeData.location} | ✉️ ${resumeData.email} | 📞 ${resumeData.phone} | 🔗 ${resumeData.linkedin} | 💻 ${resumeData.github}
  </div>

  <div class="sec-header">Professional Summary</div>
  <p>${resumeData.summary}</p>

  <div class="sec-header">Work Experience</div>
  ${resumeData.experiences.map(exp => `
    <div class="entry-header">
      <span>${exp.title} • <em>${exp.company}</em></span>
      <span>${exp.period}</span>
    </div>
    <ul>
      ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
  `).join('')}

  <div class="sec-header">Education</div>
  ${resumeData.education.map(edu => `
    <div class="entry-header">
      <span>${edu.degree} • <em>${edu.institution}</em></span>
      <span>${edu.period} ${edu.score ? `(${edu.score})` : ''}</span>
    </div>
  `).join('')}

  <div class="sec-header">Skills & Competencies</div>
  <div class="skills-grid">
    ${resumeData.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
  </div>

  ${resumeData.projects.length > 0 ? `
    <div class="sec-header">Key Projects</div>
    ${resumeData.projects.map(p => `
      <div class="entry-header">
        <span>${p.name} <small style="color: #64748b;">(${p.tech})</small></span>
      </div>
      <p style="margin: 2px 0 8px 0;">${p.desc}</p>
    `).join('')}
  ` : ''}
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${resumeData.fullName.replace(/\s+/g, "_")}_Resume.html`;
    link.click();

    // Trigger Print Window for PDF export
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 500);
    }

    setToastMessage(`📥 Printable PDF Resume for "${resumeData.fullName}" generated successfully!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // DOCX Download Trigger (Rich Editable Word Document)
  const handleDownloadDOCX = () => {
    const docxContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>${resumeData.fullName} Resume</title></head>
<body style="font-family: Arial, sans-serif; font-size: 11pt; color: #333333; padding: 20pt;">
  <h1 style="color: #0f172a; font-size: 22pt; margin-bottom: 2pt;">${resumeData.fullName.toUpperCase()}</h1>
  <h3 style="color: #f9572a; font-size: 13pt; margin-top: 0; margin-bottom: 8pt;">${resumeData.jobTitle}</h3>
  <p style="color: #666666; font-size: 9pt; border-bottom: 1.5pt solid #cccccc; padding-bottom: 6pt; margin-bottom: 14pt;">
    Phone: ${resumeData.phone} | Email: ${resumeData.email} | Location: ${resumeData.location}<br/>
    LinkedIn: ${resumeData.linkedin} | GitHub: ${resumeData.github} | Portfolio: ${resumeData.portfolio}
  </p>

  <h3 style="color: #0f172a; border-bottom: 1pt solid #333333; padding-bottom: 2pt; margin-top: 14pt;">PROFESSIONAL SUMMARY</h3>
  <p>${resumeData.summary}</p>

  <h3 style="color: #0f172a; border-bottom: 1pt solid #333333; padding-bottom: 2pt; margin-top: 14pt;">WORK EXPERIENCE</h3>
  ${resumeData.experiences.map(e => `
    <p style="margin-bottom: 2pt;"><strong>${e.title}</strong> — <em>${e.company}</em> (${e.period})</p>
    <ul style="margin-top: 2pt;">${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
  `).join('')}

  <h3 style="color: #0f172a; border-bottom: 1pt solid #333333; padding-bottom: 2pt; margin-top: 14pt;">EDUCATION</h3>
  ${resumeData.education.map(e => `
    <p><strong>${e.degree}</strong> — <em>${e.institution}</em> (${e.period}) ${e.score ? `[${e.score}]` : ''}</p>
  `).join('')}

  <h3 style="color: #0f172a; border-bottom: 1pt solid #333333; padding-bottom: 2pt; margin-top: 14pt;">SKILLS</h3>
  <p>${resumeData.skills.join(' • ')}</p>

  <h3 style="color: #0f172a; border-bottom: 1pt solid #333333; padding-bottom: 2pt; margin-top: 14pt;">PROJECTS</h3>
  ${resumeData.projects.map(p => `
    <p><strong>${p.name}</strong> (${p.tech})<br/>${p.desc}</p>
  `).join('')}
</body>
</html>
    `;

    const blob = new Blob(['\ufeff' + docxContent], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${resumeData.fullName.replace(/\s+/g, "_")}_Resume.docx`;
    link.click();

    setToastMessage(`📘 Editable DOCX Resume for "${resumeData.fullName}" downloaded!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Share Verification & Social Share Modal Trigger
  const handleShareResume = () => {
    const url = `https://skillsphere.edu/resume/share/${resumeData.fullName.toLowerCase().replace(/\s+/g, "-")}`;
    try {
      navigator.clipboard.writeText(url);
    } catch (e) {}
    setShowShareModal(true);
    setToastMessage("🔗 Resume share link copied to clipboard!");
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Publish to Portfolio
  const handlePublishPortfolio = () => {
    setToastMessage("🚀 Resume published to your SkillSphere Portfolio!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  // ── 1:1 TEMPLATE DOCUMENT RENDERER FUNCTION ──
  const renderResumeDocument = (tplType) => {
    // 1. ATS FRIENDLY TEMPLATE (Image 1: Centered Header, 1-Col Layout, Underlined Titles, 3-Col Skills)
    if (tplType === "ats-friendly") {
      return (
        <div className="a4DocumentPaper ats-friendly">
          <div className="atsHeaderCenter">
            <h1 className="atsName">{resumeData.fullName.toUpperCase()}</h1>
            <span className="atsSubTitle">{resumeData.jobTitle}</span>

            <div className="atsContactIconsRow">
              <span>📞 {resumeData.phone}</span>
              <span>✉️ {resumeData.email}</span>
              <span>📍 {resumeData.location}</span>
            </div>
            <div className="atsDividerLine"></div>
          </div>

          <div className="atsContentBody">
            <div className="atsSection">
              <h5 className="atsSecHeading">ABOUT ME</h5>
              <div className="atsSecUnderline"></div>
              <p className="atsTextP">{resumeData.summary}</p>
            </div>

            <div className="atsSection">
              <h5 className="atsSecHeading">EDUCATION</h5>
              <div className="atsSecUnderline"></div>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="atsBlockItem">
                  <div className="atsMetaRow">
                    <strong className="atsInstName">{edu.institution}</strong>
                    <span className="atsDateStr">{edu.period}</span>
                  </div>
                  <strong className="atsDegreeTitle">{edu.degree}</strong>
                  {edu.score && <p className="atsScoreP">{edu.score}</p>}
                </div>
              ))}
            </div>

            <div className="atsSection">
              <h5 className="atsSecHeading">WORK EXPERIENCE</h5>
              <div className="atsSecUnderline"></div>
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="atsBlockItem">
                  <div className="atsMetaRow">
                    <strong className="atsInstName">{exp.company}</strong>
                    <span className="atsDateStr">{exp.period}</span>
                  </div>
                  <strong className="atsDegreeTitle">{exp.title}</strong>
                  <ul className="atsBulletsList">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="atsSection">
              <h5 className="atsSecHeading">SKILLS</h5>
              <div className="atsSecUnderline"></div>
              <div className="ats3ColSkills">
                {resumeData.skills.map((s, idx) => (
                  <span key={idx}>• {s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. MINIMAL TEMPLATE (Image 2: Top Photo Right, 2-Col Contact, Gray Header Bars, Left Date Column)
    if (tplType === "minimal") {
      return (
        <div className="a4DocumentPaper minimal">
          <div className="minimalHeaderRow">
            <div className="minHeaderLeft">
              <h1 className="minName">{resumeData.fullName} <span className="minJobTitle">/ {resumeData.jobTitle}</span></h1>
              <div className="minContact2Col">
                <div>✉️ {resumeData.email}</div>
                <div>📞 {resumeData.phone}</div>
                <div>🔗 {resumeData.linkedin}</div>
                <div>📍 {resumeData.location}</div>
              </div>
            </div>
            <img src={resumeData.photoUrl} alt="Avatar" className="minPhotoRight" />
          </div>

          <div className="minimalBody">
            <div className="minSection">
              <div className="minGrayHeaderBar">Summary</div>
              <p className="minSummaryText">{resumeData.summary}</p>
            </div>

            <div className="minSection">
              <div className="minGrayHeaderBar">Professional Experience</div>
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="min2ColRow">
                  <div className="minLeftDateCol">
                    <span>{exp.period}</span>
                    <small>{exp.company}</small>
                  </div>
                  <div className="minRightMainCol">
                    <strong>{exp.title}</strong>
                    <ul>
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="minSection">
              <div className="minGrayHeaderBar">Education</div>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="min2ColRow">
                  <div className="minLeftDateCol">
                    <span>{edu.period}</span>
                  </div>
                  <div className="minRightMainCol">
                    <strong>{edu.degree}</strong>, <em>{edu.institution}</em>
                  </div>
                </div>
              ))}
            </div>

            <div className="minSection">
              <div className="minGrayHeaderBar">Skills</div>
              <div className="min3ColGrid">
                {resumeData.skills.map((s, idx) => (
                  <span key={idx}>• {s}</span>
                ))}
              </div>
            </div>

            {resumeData.certifications.length > 0 && (
              <div className="minSection">
                <div className="minGrayHeaderBar">Certificates</div>
                <div className="min3ColGrid">
                  {resumeData.certifications.map((c, idx) => (
                    <span key={idx}>• {c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 3. CREATIVE TEMPLATE (Image 3: Beige Top Banner, Overlapping Avatar Circle, Light Gray Left Column)
    if (tplType === "creative") {
      return (
        <div className="a4DocumentPaper creative">
          <div className="creativeTopBeigeHeader">
            <h1 className="crName">{resumeData.fullName.toUpperCase()}</h1>
            <span className="crTitle">{resumeData.jobTitle.toUpperCase()}</span>
          </div>

          <div className="creativeBody2Col">
            <div className="crLeftGrayCol">
              <img src={resumeData.photoUrl} alt="Avatar" className="crAvatarCircle" />

              <div className="crSecBlock">
                <h5 className="crSecTitle">CONTACT</h5>
                <span>📞 {resumeData.phone}</span>
                <span>✉️ {resumeData.email}</span>
                <span>📍 {resumeData.location}</span>
                <span>🔗 {resumeData.linkedin}</span>
              </div>

              <div className="crSecBlock">
                <h5 className="crSecTitle">EDUCATION</h5>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="crEduItem">
                    <strong>{edu.degree}</strong>
                    <span>{edu.institution}</span>
                    <small>{edu.period}</small>
                  </div>
                ))}
              </div>

              <div className="crSecBlock">
                <h5 className="crSecTitle">SKILLS</h5>
                <ul>
                  {resumeData.skills.map((s, idx) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="crRightWhiteCol">
              <div className="crMainSec">
                <h5 className="crMainHeading">PROFILE</h5>
                <p>{resumeData.summary}</p>
              </div>

              <div className="crMainSec">
                <h5 className="crMainHeading">PROFESSIONAL EXPERIENCE</h5>
                {resumeData.experiences.map((exp) => (
                  <div key={exp.id} className="crExpItem">
                    <strong>{exp.title.toUpperCase()}</strong>
                    <div className="crSubMeta">{exp.company} | {exp.period}</div>
                    <ul>
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {resumeData.projects.length > 0 && (
                <div className="crMainSec">
                  <h5 className="crMainHeading">PROJECTS</h5>
                  {resumeData.projects.map((p) => (
                    <div key={p.id} className="crProjItem">
                      <strong>{p.name}</strong> <small>({p.tech})</small>
                      <p>{p.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 4. EXECUTIVE TEMPLATE (Image 4: Soft Rose Pink Top Banner, Centered Photo, Red Bold Title, Pink Section Bars)
    if (tplType === "executive") {
      return (
        <div className="a4DocumentPaper executive">
          <div className="execTopPinkBanner"></div>
          
          <div className="execHeaderCenter">
            <img src={resumeData.photoUrl} alt="Avatar" className="execAvatarSquare" />
            <h1 className="execNameRed">{resumeData.fullName.toUpperCase()}</h1>
            <div className="execRedLine"></div>
          </div>

          <div className="execPinkSectionBar">CONTACT</div>
          <div className="execContactRow">
            <span><strong>Address:</strong> {resumeData.location}</span>
            <span><strong>Phone:</strong> {resumeData.phone}</span>
            <span><strong>Email:</strong> {resumeData.email}</span>
          </div>

          <div className="execBodyContent">
            <div className="execSection">
              <div className="execPinkSectionBar">RESUME OBJECTIVE</div>
              <p className="execObjectiveText">{resumeData.summary}</p>
              <div className="execRedLineThin"></div>
            </div>

            <div className="execSection">
              <div className="execPinkSectionBar">WORK HISTORY</div>
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="execExpBlock">
                  <strong className="execExpTitle">{exp.title}, <span className="execPeriod">{exp.period}</span></strong>
                  <span className="execCompName">{exp.company}</span>
                  <ul>
                    {exp.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="execRedLineThin"></div>
            </div>

            <div className="execSection">
              <div className="execPinkSectionBar">EDUCATION</div>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="execEduBlock">
                  <strong>{edu.degree}, <span className="execPeriod">{edu.period}</span></strong>
                  <span>{edu.institution}</span>
                </div>
              ))}
              <div className="execRedLineThin"></div>
            </div>

            <div className="execSection">
              <div className="execPinkSectionBar">SKILLS</div>
              <div className="execSkillsRatingGrid">
                {resumeData.skills.map((s, idx) => (
                  <div key={idx} className="execSkillRatingItem">
                    <span>{s}</span>
                    <span className="redDots">🔴🔴🔴🔴🔴</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. MODERN TEMPLATE (DEFAULT: 2-Column Dark Left Sidebar Layout)
    return (
      <div className="a4DocumentPaper modern">
        <div className="docLeftSidebar">
          <img src={resumeData.photoUrl} alt="Avatar" className="docAvatarPhoto" />

          <div className="docContactInfo">
            <span>📍 {resumeData.location}</span>
            <span>📞 {resumeData.phone}</span>
            <span>✉️ {resumeData.email}</span>
            <span>🔗 {resumeData.linkedin}</span>
            <span>🐙 {resumeData.github}</span>
          </div>

          <div className="docSkillsSec">
            <h5>SKILLS</h5>
            <ul>
              {resumeData.skills.map((s, idx) => (
                <li key={idx}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="docLangSec">
            <h5>LANGUAGES</h5>
            {resumeData.languages.map((l) => (
              <div key={l.id} className="langRow">
                <span>{l.name}</span>
                <span className="dots">{l.level}</span>
              </div>
            ))}
          </div>

          {resumeData.interests.length > 0 && (
            <div className="docSkillsSec">
              <h5>INTERESTS</h5>
              <ul>
                {resumeData.interests.map((it, idx) => (
                  <li key={idx}>• {it}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="docRightContent">
          <h2 className="docName">{resumeData.fullName}</h2>
          <span className="docTitle">{resumeData.jobTitle}</span>

          <div className="docSection">
            <h5>PROFILE</h5>
            <p>{resumeData.summary}</p>
          </div>

          {resumeData.experiences.length > 0 && (
            <div className="docSection">
              <h5>EXPERIENCE</h5>
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="docExpItem">
                  <div className="expHeader">
                    <strong>{exp.title}</strong>
                    <span className="period">{exp.period}</span>
                  </div>
                  <span className="compName">{exp.company}</span>
                  <ul>
                    {exp.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {resumeData.education.length > 0 && (
            <div className="docSection">
              <h5>EDUCATION</h5>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="docEduItem">
                  <div className="expHeader">
                    <strong>{edu.degree}</strong>
                    <span className="period">{edu.period}</span>
                  </div>
                  <span>{edu.institution}</span>
                  {edu.score && <span className="score">{edu.score}</span>}
                </div>
              ))}
            </div>
          )}

          {resumeData.projects.length > 0 && (
            <div className="docSection">
              <h5>PROJECTS</h5>
              {resumeData.projects.map((p) => (
                <div key={p.id} className="docProjItem">
                  <strong>{p.name}</strong> <small>({p.tech})</small>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          )}

          {resumeData.certifications.length > 0 && (
            <div className="docSection">
              <h5>CERTIFICATIONS</h5>
              <ul>
                {resumeData.certifications.map((c, idx) => (
                  <li key={idx}>• {c}</li>
                ))}
              </ul>
            </div>
          )}

          {resumeData.achievements.length > 0 && (
            <div className="docSection">
              <h5>ACHIEVEMENTS</h5>
              <ul>
                {resumeData.achievements.map((a, idx) => (
                  <li key={idx}>⭐ {a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`rbpWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      {/* Main Grid Container */}
      <div className="rbpMainContainer">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="rbpLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>

            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button
                className="sdHomeCircularBtn active"
                onClick={() => navigate("/student-home")}
                title="Dashboard Overview"
              >
                <FaHome />
              </button>
            </div>

            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "resume" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "discussions") navigate("/discussions");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "opportunity-feed") navigate("/opportunity-feed");
                      else if (item.id === "daily-quests") navigate("/daily-quests");
                      else if (item.id === "badges") navigate("/badges");
                      else if (item.id === "certificates") navigate("/certificate");
                      else if (item.id === "progress") navigate("/progress");
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

          {/* Bottom Sidebar Container: Rocket Graphic + Theme Controls */}
          <div className="sdSidebarBottomSection">
            <div className="sdRocketIllustrationBox">
              <span className="sdRocketEmoji">🚀</span>
              <div className="sdCloudDeco"></div>
            </div>

            <div className="sdSidebarFooterControls">
              <button className="sdThemeToggleBtn" onClick={toggleTheme} title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <span className="sdControlDivider">|</span>
              <button className="sdCollapseBtn" title="Collapse Menu">
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN BODY AREA ── */}
        <div className="rbpRightBodyArea">
          
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

              {/* Header Bar Logout Button beside Notification Bell */}
              <button
                className="sdLogoutHeaderBtn"
                onClick={handleLogout}
                title="Logout to Landing Page"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>

              {/* User Profile Pill with Dropdown */}
              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <UserAvatar user={user} />
                  <div className="sdUserInfoText">
                    <strong>{resumeData.fullName}</strong>
                    <span>Student</span>
                  </div>
                  <span className="dropdownArrow">▾</span>
                </div>

                {isUserMenuOpen && (
                  <div className="sdUserMenuDropdown">
                    <div className="dropdownHeader">
                      <strong>{resumeData.fullName}</strong>
                      <span>Student Account</span>
                    </div>
                    <div className="dropdownItem" onClick={() => { setIsUserMenuOpen(false); navigate("/settings"); }}>
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

          {/* Page Heading Row */}
          <div className="rbpPageHeaderRow">
            <div className="rbpPageHeader">
              <h1>Resume Builder 📄</h1>
              <p>Create a professional ATS-friendly resume in minutes.</p>
            </div>

            <div className="rbpHeaderActionsRight">
              <span className="lastSavedTag" onClick={handleSaveChanges} style={{ cursor: "pointer" }} title="Click to Save Draft">
                <FaCheckCircle color="#10B981" /> Last Saved: {lastSaved} ▾
              </span>
              <button className="btnNewResume" onClick={handleSaveChanges}>+ Save Resume ▾</button>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="rbpToastAlert">
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ── SECTION 1: CHOOSE A TEMPLATE CAROUSEL ── */}
          <div className="rbpSectionBlock">
            <div className="sectionHeaderRow">
              <h3>Choose a Template</h3>
              <span className="viewAllLink" style={{ cursor: "pointer" }} onClick={() => setShowAllTemplatesModal(true)}>View All Templates →</span>
            </div>

            <div className="templatesGrid">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className={`templateCard ${selectedTemplate === tpl.id ? "activeSelected" : ""}`}
                  onClick={() => setSelectedTemplate(tpl.id)}
                >
                  {selectedTemplate === tpl.id && <FaCheckCircle className="tplActiveCheck" />}
                  
                  <div className={`tplMiniPreview ${tpl.bg}`} style={{ background: tpl.id === "modern" ? "#0F172A" : tpl.id === "ats-friendly" ? "#FFFFFF" : tpl.id === "minimal" ? "#FAFAF9" : tpl.id === "creative" ? "#FFFFFF" : "#FFFDF9", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", height: "130px", overflow: "hidden", position: "relative", padding: tpl.id === "modern" ? "0" : "8px", display: "flex", flexDirection: tpl.id === "modern" ? "row" : "column", gap: "4px" }}>
                    {tpl.id === "modern" && (
                      <>
                        <div style={{ width: "35%", background: "#1E293B", padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#38BDF8" }} />
                          <div style={{ width: "80%", height: "3px", background: "#F8FAFC", borderRadius: "2px" }} />
                          <div style={{ width: "60%", height: "2px", background: "#38BDF8", borderRadius: "2px" }} />
                          <div style={{ width: "90%", height: "1px", background: "rgba(255,255,255,0.1)", margin: "2px 0" }} />
                          <div style={{ width: "80%", height: "2px", background: "#94A3B8", borderRadius: "2px" }} />
                          <div style={{ width: "70%", height: "2px", background: "#94A3B8", borderRadius: "2px" }} />
                        </div>
                        <div style={{ flex: 1, padding: "8px 6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ width: "70%", height: "5px", background: "#F8FAFC", borderRadius: "2px" }} />
                          <div style={{ width: "45%", height: "3px", background: "#F9572A", borderRadius: "2px" }} />
                          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.1)", margin: "2px 0" }} />
                          <div style={{ width: "90%", height: "2px", background: "#94A3B8", borderRadius: "2px" }} />
                          <div style={{ width: "100%", height: "2px", background: "#64748B", borderRadius: "2px" }} />
                        </div>
                      </>
                    )}

                    {tpl.id === "ats-friendly" && (
                      <>
                        <div style={{ width: "65%", height: "6px", background: "#1E1B18", borderRadius: "2px", margin: "2px auto 0 auto" }} />
                        <div style={{ width: "40%", height: "3px", background: "#F9572A", borderRadius: "2px", margin: "0 auto" }} />
                        <div style={{ width: "80%", height: "2px", background: "#64748B", borderRadius: "2px", margin: "0 auto" }} />
                        <div style={{ width: "100%", height: "1px", background: "#1E1B18", margin: "2px 0" }} />
                        <div style={{ width: "40%", height: "4px", background: "#1E1B18", borderRadius: "2px" }} />
                        <div style={{ width: "100%", height: "2px", background: "#94A3B8", borderRadius: "2px" }} />
                        <div style={{ width: "95%", height: "2px", background: "#94A3B8", borderRadius: "2px" }} />
                      </>
                    )}

                    {tpl.id === "minimal" && (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ width: "60px", height: "5px", background: "#1C1917", borderRadius: "2px" }} />
                            <div style={{ width: "40px", height: "3px", background: "#78716C", borderRadius: "2px", marginTop: "2px" }} />
                          </div>
                          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#D6D3D1" }} />
                        </div>
                        <div style={{ width: "100%", height: "10px", background: "#E7E5E4", borderRadius: "2px", marginTop: "3px" }} />
                        <div style={{ width: "90%", height: "2px", background: "#A8A29E", borderRadius: "2px" }} />
                        <div style={{ width: "100%", height: "2px", background: "#A8A29E", borderRadius: "2px" }} />
                      </>
                    )}

                    {tpl.id === "creative" && (
                      <>
                        <div style={{ background: "linear-gradient(135deg, #F9572A, #E07A5F)", padding: "6px", borderRadius: "4px", marginBottom: "4px" }}>
                          <div style={{ width: "65%", height: "5px", background: "#FFFFFF", borderRadius: "2px" }} />
                          <div style={{ width: "40%", height: "2px", background: "#FFE6DF", borderRadius: "2px", marginTop: "2px" }} />
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <div style={{ width: "3px", background: "#F9572A", borderRadius: "2px" }} />
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                            <div style={{ width: "50%", height: "4px", background: "#1E1B18", borderRadius: "2px" }} />
                            <div style={{ width: "100%", height: "2px", background: "#94A3B8", borderRadius: "2px" }} />
                          </div>
                        </div>
                      </>
                    )}

                    {tpl.id === "executive" && (
                      <>
                        <div style={{ width: "65%", height: "6px", background: "#1E293B", borderRadius: "2px", margin: "0 auto" }} />
                        <div style={{ width: "45%", height: "3px", background: "#D97706", borderRadius: "2px", margin: "1px auto" }} />
                        <div style={{ width: "100%", height: "1.5px", background: "#D97706", margin: "2px 0" }} />
                        <div style={{ display: "flex", gap: "6px", flex: 1 }}>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                            <div style={{ width: "70%", height: "3px", background: "#1E293B", borderRadius: "2px" }} />
                            <div style={{ width: "100%", height: "2px", background: "#64748B", borderRadius: "2px" }} />
                          </div>
                          <div style={{ width: "30%", background: "#F1F5F9", borderRadius: "3px" }} />
                        </div>
                      </>
                    )}
                  </div>

                  <h4>{tpl.name}</h4>
                  <div className="starsRow">
                    {Array.from({ length: tpl.rating }).map((_, i) => (
                      <FaStar key={i} color="#F59E0B" fontSize="10px" />
                    ))}
                  </div>

                  <div className="tplBtnGroup">
                    <button
                      className="btnUseTpl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(tpl.id);
                        setToastMessage(`Selected "${tpl.name}" Template!`);
                        setTimeout(() => setToastMessage(""), 3000);
                      }}
                    >
                      Use Template
                    </button>
                    <button
                      className="btnPreviewTpl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(tpl.id);
                        setIsPreviewModalOpen(true);
                      }}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 2 & 3: MAIN WORKSPACE + LIVE PREVIEW COLUMN ── */}
          <div className="rbpWorkspaceGrid">
            
            {/* LEFT EDIT FORM WORKSPACE */}
            <div className="rbpLeftFormCol">
              
              {/* EDIT YOUR RESUME ACCORDION FORM */}
              <div className="rbpFormBlock">
                <h3>Edit Your Resume</h3>

                <div className="accordionContainer">
                  
                  {/* Left Accordion Navigation Tabs */}
                  <div className="accordionTabsCol">
                    <button
                      className={`accTab ${activeTab === "personal" ? "active" : ""}`}
                      onClick={() => setActiveTab("personal")}
                    >
                      👤 Personal Information <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "education" ? "active" : ""}`}
                      onClick={() => setActiveTab("education")}
                    >
                      🎓 Education <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "experience" ? "active" : ""}`}
                      onClick={() => setActiveTab("experience")}
                    >
                      💼 Experience <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "projects" ? "active" : ""}`}
                      onClick={() => setActiveTab("projects")}
                    >
                      🚀 Projects <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "skills" ? "active" : ""}`}
                      onClick={() => setActiveTab("skills")}
                    >
                      ⚡ Skills <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "certifications" ? "active" : ""}`}
                      onClick={() => setActiveTab("certifications")}
                    >
                      🛡️ Certifications <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "achievements" ? "active" : ""}`}
                      onClick={() => setActiveTab("achievements")}
                    >
                      ⭐ Achievements <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "languages" ? "active" : ""}`}
                      onClick={() => setActiveTab("languages")}
                    >
                      🌐 Languages <FaChevronDown className="arr" />
                    </button>
                    <button
                      className={`accTab ${activeTab === "interests" ? "active" : ""}`}
                      onClick={() => setActiveTab("interests")}
                    >
                      🎯 Interests <FaChevronDown className="arr" />
                    </button>
                  </div>

                  {/* Right Form Editor Panel */}
                  <div className="formEditorPanel">
                    
                    {/* TAB 1: PERSONAL INFORMATION */}
                    {activeTab === "personal" && (
                      <div className="formFieldsGroup">
                        <div className="photoUploadRow">
                          <span>Photo</span>
                          <div className="photoBox">
                            <img src={resumeData.photoUrl} alt="Avatar" className="userPhotoAvatar" />
                            <input
                              ref={photoInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handlePhotoUpload}
                              hidden
                            />
                            <button
                              type="button"
                              className="uploadBtnBox"
                              onClick={() => photoInputRef.current?.click()}
                            >
                              <FaCamera color="#F9572A" />
                              <span>Upload Photo</span>
                              <small>JPG, PNG (max 2MB)</small>
                            </button>
                          </div>
                        </div>

                        <div className="form2Col">
                          <div className="inputGroup">
                            <label>Full Name</label>
                            <input
                              type="text"
                              value={resumeData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                            />
                          </div>

                          <div className="inputGroup">
                            <label>Job Title</label>
                            <input
                              type="text"
                              value={resumeData.jobTitle}
                              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form2Col">
                          <div className="inputGroup">
                            <label>Email</label>
                            <input
                              type="email"
                              value={resumeData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                          </div>

                          <div className="inputGroup">
                            <label>Phone</label>
                            <input
                              type="text"
                              value={resumeData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form2Col">
                          <div className="inputGroup">
                            <label>Location</label>
                            <input
                              type="text"
                              value={resumeData.location}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                            />
                          </div>

                          <div className="inputGroup">
                            <label>LinkedIn</label>
                            <input
                              type="text"
                              value={resumeData.linkedin}
                              onChange={(e) => handleInputChange("linkedin", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form2Col">
                          <div className="inputGroup">
                            <label>GitHub</label>
                            <input
                              type="text"
                              value={resumeData.github}
                              onChange={(e) => handleInputChange("github", e.target.value)}
                            />
                          </div>

                          <div className="inputGroup">
                            <label>Portfolio <small>(Optional)</small></label>
                            <input
                              type="text"
                              value={resumeData.portfolio}
                              onChange={(e) => handleInputChange("portfolio", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="inputGroup">
                          <label>Professional Summary</label>
                          <textarea
                            rows="4"
                            value={resumeData.summary}
                            onChange={(e) => handleInputChange("summary", e.target.value)}
                          />
                        </div>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 2: EDUCATION */}
                    {activeTab === "education" && (
                      <div className="formFieldsGroup">
                        <h4>🎓 Education Entries ({resumeData.education.length})</h4>

                        {resumeData.education.map((edu, idx) => (
                          <div key={edu.id} className="dynamicEntryCard">
                            <div className="entryCardHeader">
                              <span>Entry #{idx + 1}</span>
                              <button
                                className="btnDeleteEntry"
                                onClick={() => handleDeleteEducation(edu.id)}
                                title="Delete Entry"
                              >
                                <FaTrash />
                              </button>
                            </div>

                            <div className="form2Col">
                              <div className="inputGroup">
                                <label>Degree / Qualification</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => handleEduChange(edu.id, "degree", e.target.value)}
                                />
                              </div>

                              <div className="inputGroup">
                                <label>Institution / College</label>
                                <input
                                  type="text"
                                  value={edu.institution}
                                  onChange={(e) => handleEduChange(edu.id, "institution", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="form2Col">
                              <div className="inputGroup">
                                <label>Period / Duration</label>
                                <input
                                  type="text"
                                  value={edu.period}
                                  onChange={(e) => handleEduChange(edu.id, "period", e.target.value)}
                                />
                              </div>

                              <div className="inputGroup">
                                <label>Score / Percentage / CGPA</label>
                                <input
                                  type="text"
                                  value={edu.score || ""}
                                  onChange={(e) => handleEduChange(edu.id, "score", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button className="btnAddEntry" onClick={handleAddEducation}>
                          <FaPlus /> Add New Education
                        </button>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 3: EXPERIENCE */}
                    {activeTab === "experience" && (
                      <div className="formFieldsGroup">
                        <h4>💼 Work Experience ({resumeData.experiences.length})</h4>

                        {resumeData.experiences.map((exp, idx) => (
                          <div key={exp.id} className="dynamicEntryCard">
                            <div className="entryCardHeader">
                              <span>Experience #{idx + 1}</span>
                              <button
                                className="btnDeleteEntry"
                                onClick={() => handleDeleteExperience(exp.id)}
                                title="Delete Entry"
                              >
                                <FaTrash />
                              </button>
                            </div>

                            <div className="form2Col">
                              <div className="inputGroup">
                                <label>Job Title</label>
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={(e) => handleExpChange(exp.id, "title", e.target.value)}
                                />
                              </div>

                              <div className="inputGroup">
                                <label>Company Name</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => handleExpChange(exp.id, "company", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="inputGroup">
                              <label>Period / Duration</label>
                              <input
                                type="text"
                                value={exp.period}
                                onChange={(e) => handleExpChange(exp.id, "period", e.target.value)}
                              />
                            </div>

                            <div className="inputGroup">
                              <label>Key Responsibilities & Accomplishments</label>
                              {exp.bullets.map((bullet, bIdx) => (
                                <div key={bIdx} className="bulletInputRow">
                                  <input
                                    type="text"
                                    value={bullet}
                                    onChange={(e) => handleExpBulletChange(exp.id, bIdx, e.target.value)}
                                  />
                                </div>
                              ))}
                              <button
                                className="btnAddBullet"
                                onClick={() => handleAddExpBullet(exp.id)}
                              >
                                + Add Bullet Point
                              </button>
                            </div>
                          </div>
                        ))}

                        <button className="btnAddEntry" onClick={handleAddExperience}>
                          <FaPlus /> Add New Experience
                        </button>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 4: PROJECTS */}
                    {activeTab === "projects" && (
                      <div className="formFieldsGroup">
                        <h4>🚀 Projects ({resumeData.projects.length})</h4>

                        {resumeData.projects.map((proj, idx) => (
                          <div key={proj.id} className="dynamicEntryCard">
                            <div className="entryCardHeader">
                              <span>Project #{idx + 1}</span>
                              <button
                                className="btnDeleteEntry"
                                onClick={() => handleDeleteProject(proj.id)}
                                title="Delete Entry"
                              >
                                <FaTrash />
                              </button>
                            </div>

                            <div className="form2Col">
                              <div className="inputGroup">
                                <label>Project Name</label>
                                <input
                                  type="text"
                                  value={proj.name}
                                  onChange={(e) => handleProjChange(proj.id, "name", e.target.value)}
                                />
                              </div>

                              <div className="inputGroup">
                                <label>Technologies Used</label>
                                <input
                                  type="text"
                                  value={proj.tech}
                                  onChange={(e) => handleProjChange(proj.id, "tech", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="inputGroup">
                              <label>Description</label>
                              <textarea
                                rows="3"
                                value={proj.desc}
                                onChange={(e) => handleProjChange(proj.id, "desc", e.target.value)}
                              />
                            </div>
                          </div>
                        ))}

                        <button className="btnAddEntry" onClick={handleAddProject}>
                          <FaPlus /> Add New Project
                        </button>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 5: SKILLS */}
                    {activeTab === "skills" && (
                      <div className="formFieldsGroup">
                        <h4>⚡ Skills Manager ({resumeData.skills.length})</h4>
                        <p className="subText">Type a skill and click "Add Skill" to update your live resume chips!</p>

                        <div className="addChipInputRow">
                          <input
                            type="text"
                            placeholder="Add a new skill (e.g., TypeScript, Docker, Node.js)"
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                          />
                          <button className="btnAddTag" onClick={handleAddSkill}>
                            Add Skill
                          </button>
                        </div>

                        <div className="skillChipsContainer">
                          {resumeData.skills.map((skill, idx) => (
                            <span key={idx} className="skillTagChip">
                              {skill}
                              <button onClick={() => handleDeleteSkill(idx)}>&times;</button>
                            </span>
                          ))}
                        </div>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 6: CERTIFICATIONS */}
                    {activeTab === "certifications" && (
                      <div className="formFieldsGroup">
                        <h4>🛡️ Certifications ({resumeData.certifications.length})</h4>

                        <div className="addChipInputRow">
                          <input
                            type="text"
                            placeholder="Add new certification (e.g., AWS Solutions Architect)"
                            value={newCertInput}
                            onChange={(e) => setNewCertInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCert()}
                          />
                          <button className="btnAddTag" onClick={handleAddCert}>
                            Add Certification
                          </button>
                        </div>

                        <div className="simpleListContainer">
                          {resumeData.certifications.map((cert, idx) => (
                            <div key={idx} className="listItemRow">
                              <span>• {cert}</span>
                              <button onClick={() => handleDeleteCert(idx)} title="Delete Certification">
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 7: ACHIEVEMENTS */}
                    {activeTab === "achievements" && (
                      <div className="formFieldsGroup">
                        <h4>⭐ Achievements & Awards ({resumeData.achievements.length})</h4>

                        <div className="addChipInputRow">
                          <input
                            type="text"
                            placeholder="Add achievement (e.g., Winner of Smart India Hackathon)"
                            value={newAchieveInput}
                            onChange={(e) => setNewAchieveInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddAchievement()}
                          />
                          <button className="btnAddTag" onClick={handleAddAchievement}>
                            Add Achievement
                          </button>
                        </div>

                        <div className="simpleListContainer">
                          {resumeData.achievements.map((ach, idx) => (
                            <div key={idx} className="listItemRow">
                              <span>⭐ {ach}</span>
                              <button onClick={() => handleDeleteAchievement(idx)} title="Delete Achievement">
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 8: LANGUAGES */}
                    {activeTab === "languages" && (
                      <div className="formFieldsGroup">
                        <h4>🌐 Languages ({resumeData.languages.length})</h4>

                        {resumeData.languages.map((lang) => (
                          <div key={lang.id} className="dynamicEntryCard">
                            <div className="entryCardHeader">
                              <span>Language Entry</span>
                              <button
                                className="btnDeleteEntry"
                                onClick={() => handleDeleteLanguage(lang.id)}
                                title="Delete Language"
                              >
                                <FaTrash />
                              </button>
                            </div>

                            <div className="form2Col">
                              <div className="inputGroup">
                                <label>Language Name</label>
                                <input
                                  type="text"
                                  value={lang.name}
                                  onChange={(e) => handleLangChange(lang.id, "name", e.target.value)}
                                />
                              </div>

                              <div className="inputGroup">
                                <label>Proficiency Dots / Level</label>
                                <input
                                  type="text"
                                  value={lang.level}
                                  onChange={(e) => handleLangChange(lang.id, "level", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button className="btnAddEntry" onClick={handleAddLanguage}>
                          <FaPlus /> Add New Language
                        </button>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                    {/* TAB 9: INTERESTS */}
                    {activeTab === "interests" && (
                      <div className="formFieldsGroup">
                        <h4>🎯 Interests & Hobbies ({resumeData.interests.length})</h4>

                        <div className="addChipInputRow">
                          <input
                            type="text"
                            placeholder="Add interest (e.g., Open Source Contributing, Chess)"
                            value={newInterestInput}
                            onChange={(e) => setNewInterestInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                          />
                          <button className="btnAddTag" onClick={handleAddInterest}>
                            Add Interest
                          </button>
                        </div>

                        <div className="skillChipsContainer">
                          {resumeData.interests.map((interest, idx) => (
                            <span key={idx} className="skillTagChip interest">
                              🎯 {interest}
                              <button onClick={() => handleDeleteInterest(idx)}>&times;</button>
                            </span>
                          ))}
                        </div>

                        <button className="btnSaveForm" onClick={handleSaveChanges}>
                          Save Changes
                        </button>
                      </div>
                    )}

                  </div>

                </div>

                {/* Resume actions stay directly below the editor's Save Changes button. */}
                <div className="rbpFloatingActionBar">
                  <button className="btnFloatOutline" onClick={handleSaveChanges}>
                    Save Draft
                  </button>
                  <button className="btnFloatOutline" onClick={() => setIsPreviewModalOpen(true)}>
                    <FaEye /> Preview
                  </button>
                  <button className="btnFloatOutline orange" onClick={handleDownloadPDF}>
                    <FaDownload /> Download PDF
                  </button>
                  <button className="btnFloatOutline blue" onClick={handleDownloadDOCX}>
                    <FaFileWord /> Download DOCX
                  </button>
                  <button className="btnFloatOutline" onClick={handleShareResume}>
                    <FaShareAlt /> Share Resume
                  </button>
                  <button className="btnFloatPrimary" onClick={handlePublishPortfolio}>
                    🚀 Publish to Portfolio
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT STICKY LIVE PREVIEW COLUMN */}
            <div className="rbpRightPreviewCol">
              <div className="livePreviewCard">
                <div className="previewTitleRow">
                  <h4>Live Preview ({selectedTemplate.toUpperCase()})</h4>
                  <FaRedo className="refreshBtnIcon" title="Refresh Preview" />
                </div>

                {/* DYNAMIC REAL-TIME A4 DOCUMENT RENDER */}
                {renderResumeDocument(selectedTemplate)}

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="resumePreviewModalOverlay" onClick={() => setIsPreviewModalOpen(false)}>
          <div className="resumePreviewModalContent" onClick={e => e.stopPropagation()} style={{ maxWidth: "880px", width: "94%" }}>
            <div className="modalHeaderRow" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h3 style={{ margin: 0 }}>Resume Full Preview</h3>
                <select
                  value={selectedTemplate}
                  onChange={e => setSelectedTemplate(e.target.value)}
                  style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: "700" }}
                >
                  <option value="modern">Modern Template</option>
                  <option value="ats-friendly">ATS Friendly Template</option>
                  <option value="minimal">Minimal Template</option>
                  <option value="creative">Creative Template</option>
                  <option value="executive">Executive Template</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#F1F5F9", borderRadius: "6px", padding: "2px 6px", fontSize: "12px", fontWeight: "700" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "800" }} onClick={() => setPreviewZoom(z => Math.max(60, z - 10))}>-</button>
                  <span>{previewZoom}%</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "800" }} onClick={() => setPreviewZoom(z => Math.min(150, z + 10))}>+</button>
                </div>
                <button className="btnCloseModal" onClick={() => setIsPreviewModalOpen(false)}>
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="modalDocBody" style={{ overflowY: "auto", maxHeight: "72vh", padding: "20px", display: "flex", justifyContent: "center", background: "#0F172A" }}>
              <div style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
                {renderResumeDocument(selectedTemplate)}
              </div>
            </div>

            <div className="modalFooterActions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button className="btnDownloadCert" onClick={handleDownloadPDF} style={{ background: "#F9572A" }}>
                <FaDownload /> Download PDF
              </button>
              <button className="btnDownloadCert" onClick={handleDownloadDOCX} style={{ background: "#2563EB" }}>
                <FaFileWord /> Download DOCX
              </button>
              <button className="btnShareLinkedIn" onClick={handleShareResume} style={{ background: "#059669" }}>
                <FaShareAlt /> Share Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SHARE RESUME DIALOG MODAL ── */}
      {showShareModal && (
        <div className="resumePreviewModalOverlay" onClick={() => setShowShareModal(false)}>
          <div className="resumePreviewModalContent" onClick={e => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className="modalHeaderRow">
              <h3 style={{ margin: 0 }}>🔗 Share Resume</h3>
              <button className="btnCloseModal" onClick={() => setShowShareModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--sd-text-sub, #64748b)" }}>
                Anyone with this link can view your public live resume.
              </p>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  readOnly
                  value={`https://skillsphere.edu/resume/share/${resumeData.fullName.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    fontSize: "12px",
                    background: "#F8FAFC",
                    color: "#334155",
                    outline: "none"
                  }}
                />
                <button
                  className="btnDownloadCert"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://skillsphere.edu/resume/share/${resumeData.fullName.toLowerCase().replace(/\s+/g, "-")}`);
                    setToastMessage("✓ Link copied to clipboard!");
                    setTimeout(() => setToastMessage(""), 3000);
                  }}
                  style={{ padding: "8px 14px", fontSize: "12px", background: "#F9572A" }}
                >
                  Copy
                </button>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>Or Share Directly:</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#0A66C2", color: "#FFF", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    onClick={() => {
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://skillsphere.edu/resume/share/${resumeData.fullName.toLowerCase().replace(/\s+/g, "-")}`)}`, '_blank');
                    }}
                  >
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#25D366", color: "#FFF", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    onClick={() => {
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my resume on SkillSphere: https://skillsphere.edu/resume/share/${resumeData.fullName.toLowerCase().replace(/\s+/g, "-")}`)}`, '_blank');
                    }}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="modalFooterActions" style={{ justifyContent: "flex-end" }}>
              <button className="btnFloatOutline" onClick={() => setShowShareModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW ALL TEMPLATES MODAL ── */}
      {showAllTemplatesModal && (
        <div
          className="resumePreviewModalOverlay"
          onClick={() => setShowAllTemplatesModal(false)}
        >
          <div
            className="resumePreviewModalContent"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "780px", width: "95%" }}
          >
            {/* Modal Header */}
            <div className="modalHeaderRow" style={{ marginBottom: "4px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>📄 All Resume Templates</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--sd-text-sub, #64748b)" }}>
                  Choose a professional template. Click "Select" to apply it instantly.
                </p>
              </div>
              <button className="btnCloseModal" onClick={() => setShowAllTemplatesModal(false)}>
                <FaTimes />
              </button>
            </div>

            {/* Templates Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginTop: "20px", maxHeight: "65vh", overflowY: "auto", padding: "4px 2px" }}>
              {[
                { id: "modern",       name: "Modern",       emoji: "🌑", desc: "Dark sidebar, two-column professional layout.",      accent: "#0F172A", badge: "Most Popular" },
                { id: "ats-friendly", name: "ATS Friendly",  emoji: "📋", desc: "Single-column, recruiter-optimised ATS layout.",   accent: "#F9572A", badge: "Best for Jobs" },
                { id: "minimal",      name: "Minimal",       emoji: "🪶", desc: "Clean timeline style with a top photo strip.",     accent: "#334155", badge: "Clean" },
                { id: "creative",     name: "Creative",      emoji: "🎨", desc: "Beige header, overlapping avatar, left sidebar.",  accent: "#B45309", badge: "Unique" },
                { id: "executive",    name: "Executive",     emoji: "👔", desc: "Pink accent bars, centred photo, formal style.",   accent: "#BE123C", badge: "Premium" }
              ].map((tpl) => {
                const isActive = selectedTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    style={{
                      background: isActive ? "rgba(249,87,42,0.06)" : "var(--sd-card-bg, #ffffff)",
                      border: isActive ? "2px solid #F9572A" : "1.5px solid var(--sd-border, #E2E8F0)",
                      borderRadius: "16px",
                      padding: "18px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      position: "relative",
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      boxShadow: isActive ? "0 4px 16px rgba(249,87,42,0.15)" : "0 2px 8px rgba(0,0,0,0.04)"
                    }}
                  >
                    {/* Badge */}
                    <span style={{ position: "absolute", top: "12px", right: "12px", background: isActive ? "#F9572A" : tpl.accent, color: "#fff", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "99px", letterSpacing: "0.3px" }}>
                      {isActive ? "✓ Selected" : tpl.badge}
                    </span>

                    {/* Icon Preview Box */}
                    <div style={{ width: "100%", height: "90px", borderRadius: "10px", background: tpl.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", opacity: 0.9 }}>
                      {tpl.emoji}
                    </div>

                    {/* Info */}
                    <div>
                      <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>{tpl.name}</strong>
                      <p style={{ fontSize: "12px", color: "var(--sd-text-sub, #64748b)", margin: 0, lineHeight: "1.4" }}>{tpl.desc}</p>
                    </div>

                    {/* Star Rating */}
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1,2,3,4,5].map(s => <FaStar key={s} size={12} color="#F59E0B" />)}
                    </div>

                    {/* Select Button */}
                    <button
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        setShowAllTemplatesModal(false);
                        setToastMessage(`✅ "${tpl.name}" template applied to your resume!`);
                        setTimeout(() => setToastMessage(""), 3000);
                      }}
                      style={{
                        marginTop: "4px",
                        padding: "9px 0",
                        borderRadius: "10px",
                        border: "none",
                        background: isActive ? "#10B981" : "#F9572A",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "opacity 0.2s ease",
                        width: "100%"
                      }}
                    >
                      {isActive ? "✓ Currently Active" : "Select Template"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="modalFooterActions" style={{ justifyContent: "flex-end", marginTop: "16px" }}>
              <button className="btnFloatOutline" onClick={() => setShowAllTemplatesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <FloatingChatbot />
      <StudentFooter />
    </div>
  );
}


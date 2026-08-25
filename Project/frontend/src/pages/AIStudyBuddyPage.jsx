import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";
import FloatingChatbot from "../components/FloatingChatbot";

import {
  FaHome, FaBook, FaCodeBranch, FaFileAlt, FaComments, FaAward,
  FaCertificate, FaChartLine, FaFileInvoice, FaBolt, FaCog, FaSearch,
  FaBell, FaRobot, FaRocket, FaMapMarkedAlt, FaMapSigns, FaSun, FaMoon, FaArrowLeft,
  FaCalendarAlt, FaLightbulb, FaQuestionCircle, FaCode, FaClone,
  FaBriefcase, FaGlobe, FaPaperPlane, FaPlus, FaPaperclip, FaMicrophone,
  FaHistory, FaThumbsUp, FaThumbsDown, FaCopy, FaCheck, FaShareAlt,
  FaStickyNote, FaLayerGroup, FaTerminal, FaCrown, FaTimes, FaPlay,
  FaRedo, FaYoutube, FaLink, FaUpload, FaMagic, FaInfoCircle, FaLock,
  FaChevronDown, FaBuilding, FaUser, FaCheckCircle, FaSpinner, FaMinus, FaSignOutAlt
} from "react-icons/fa";

import { askGeminiAI, getGeminiApiKey, setGeminiApiKey } from "../services/geminiService";
import FormattedMessage from "../components/FormattedMessage";
import "../styles/aiStudyBuddyPage.css";

import { react20QuizQuestions, python20QuizQuestions } from "../data/quizData";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import AppLogo from "../components/AppLogo";

export default function AIStudyBuddyPage() {
  const { user, xp, earnXp, themeMode, toggleTheme, authenticatedFetch, logout } = useAuth();
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

  // Interactive States
  const [inputMsg, setInputMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [quizUserAnswers, setQuizUserAnswers] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [isWebSearch, setIsWebSearch] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [activeCourseContext, setActiveCourseContext] = useState({
    title: "React Developer Path",
    module: "Module 2: React Components",
    icon: "⚛️"
  });

  // Modal States
  const [activeModal, setActiveModal] = useState(null);
  const [toolModalContent, setToolModalContent] = useState(null);
  const [dailyGoalXP, setDailyGoalXP] = useState(50);

  // ── TOPIC SELECTION STATES FOR AI TOOLS ──
  const [selectedSummaryTopic, setSelectedSummaryTopic] = useState("React & Frontend Development");
  const [customSummaryTopic, setCustomSummaryTopic] = useState("");

  const [selectedFlashcardTopic, setSelectedFlashcardTopic] = useState("React 18 & Hooks");
  const [customFlashcardTopic, setCustomFlashcardTopic] = useState("");

  const [genNotesTopicSelect, setGenNotesTopicSelect] = useState("React Virtual DOM & Reconciliation");
  const [mindMapTopicSelect, setMindMapTopicSelect] = useState("React 18 & Component Architecture");
  const [conceptDiagramTopicSelect, setConceptDiagramTopicSelect] = useState("Microservices & REST API Architecture");

  // ── SUMMARIZE NOTES MODAL STATE ──
  const [notesText, setNotesText] = useState(
    "Virtual DOM in React is a lightweight JavaScript object that is a representation of the actual DOM. React uses it as an intermediate step to efficiently update the real DOM.\n\nWhen a component's state or props change, React first updates the Virtual DOM. Then it diffs the previous Virtual DOM with the new one to find the minimum number of changes required. Finally, it updates only those parts in the real DOM that have actually changed."
  );
  const [summaryLength, setSummaryLength] = useState("Medium");
  const [keyPoints, setKeyPoints] = useState(4);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState([
    "Virtual DOM is a lightweight JS object that represents the real DOM.",
    "React uses it as an intermediate layer to optimize updates.",
    "When state or props change:",
    "React updates the Virtual DOM.",
    "It compares (diffs) it with the previous Virtual DOM.",
    "It calculates the minimum number of changes.",
    "Only the changed parts are updated in the real DOM."
  ]);
  const [summaryGenerated, setSummaryGenerated] = useState(true);
  const notesFileRef = useRef(null);

  // ── CREATE FLASHCARDS MODAL STATE ──
  const [flashcardSource, setFlashcardSource] = useState("text");
  const [flashcardNotes, setFlashcardNotes] = useState(
    "Virtual DOM in React is a lightweight JavaScript object that is a representation of the actual DOM. React uses it as an intermediate step to efficiently update the real DOM.\n\nWhen a component's state or props change, React first updates the Virtual DOM. Then it diffs the previous Virtual DOM with the new one to find the minimum number of changes required. Finally, it updates only those parts in the real DOM that have actually changed."
  );
  const [numCards, setNumCards] = useState(10);
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [questionType, setQuestionType] = useState("Conceptual");
  const [aiExplanations, setAiExplanations] = useState(true);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [webLinkInput, setWebLinkInput] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [aiTopicInput, setAiTopicInput] = useState("");
  const flashcardFileRef = useRef(null);

  // ── INTERVIEW PREP MODAL STATE ──
  const [interviewPracticeType, setInterviewPracticeType] = useState("mock");
  const [jobRole, setJobRole] = useState("Frontend Developer");
  const [experienceLevel, setExperienceLevel] = useState("2-4 Years");
  const [interviewDifficulty, setInterviewDifficulty] = useState("Medium");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // ── STUDY PLAN MODAL STATE ──
  const [studyPlanTopic, setStudyPlanTopic] = useState("React 18 & Next.js Fullstack Masterclass");
  const [studyPlanDuration, setStudyPlanDuration] = useState("30 Days");
  const [studyPlanHours, setStudyPlanHours] = useState("2 Hours / Day");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedStudyPlan, setGeneratedStudyPlan] = useState([
    { day: "Week 1 (Days 1-7)", title: "Foundations & Component Lifecycle", tasks: ["Master React JSX, Props & State", "Build 3 Functional Components", "Solve 5 React Quiz Challenges"] },
    { day: "Week 2 (Days 8-14)", title: "Hooks & State Management", tasks: ["Deep Dive into useEffect & useRef", "Implement Context API & Custom Hooks", "Build a Shopping Cart dApp"] },
    { day: "Week 3 (Days 15-21)", title: "API Integration & Next.js Router", tasks: ["Fetch Axios/REST Data with Async/Await", "Next.js App Router & Server Components", "Deploy Fullstack Project to Vercel"] },
    { day: "Week 4 (Days 22-30)", title: "Performance & FAANG Interview Prep", tasks: ["Virtual DOM Optimization & Memoization", "Complete 20-Question Track Exam", "Claim Verified Course Certificate"] }
  ]);

  // ── GENERATE NOTES MODAL STATE ──
  const [genNotesTopic, setGenNotesTopic] = useState("React Virtual DOM & Reconciliation");
  const [genNotesStyle, setGenNotesStyle] = useState("Key Bullet Points");
  const [isGeneratingGenNotes, setIsGeneratingGenNotes] = useState(false);
  const [generatedGenNotesText, setGeneratedGenNotesText] = useState(
    "📌 Key Concepts:\n- Virtual DOM is an in-memory JS representation of the real DOM.\n- React uses a diffing algorithm (O(N) heuristics) to compare new & old virtual trees.\n- Only changed DOM nodes are re-rendered in the browser.\n\n💡 Example Pattern:\nconst [count, setCount] = useState(0);\n// Only the <h1> tag is updated on click."
  );

  // ── PRACTICE QUIZ & CODE EXPLAINER MODAL STATE ──
  const [quizTrackSelect, setQuizTrackSelect] = useState("React & Web Development");
  const [quizLengthSelect, setQuizLengthSelect] = useState("20 Questions");
  const [quizDiffSelect, setQuizDiffSelect] = useState("Medium");
  const [quizModalTab, setQuizModalTab] = useState("quiz");
  const [codeExplainInput, setCodeExplainInput] = useState(
    "function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}"
  );

  // ── CODE PLAYGROUND MODAL STATE ──
  const [playgroundLang, setPlaygroundLang] = useState("javascript");
  const [playgroundCode, setPlaygroundCode] = useState({
    javascript: `// JavaScript / Node.js Playground
const skills = ["React 18", "Node.js", "Python Data Science", "DSA"];
console.log("Welcome to SkillSphere Live Sandbox! 🚀");
skills.forEach((skill, index) => {
  console.log(\`\${index + 1}. \${skill} Mastered ✓\`);
});`,
    python: `# Python 3 Sandbox
def greet_learner(name):
    return f"Welcome to SkillSphere Python, {name}!"

skills = ["Pandas DataFrames", "NumPy", "PyTorch Deep Learning"]
print(greet_learner("Learner"))
for s in skills:
    print(f"Mastering: {s}")`,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0F172A; color: #FFFFFF; padding: 24px; }
    h1 { color: #F9572A; }
    .card { background: #1E293B; padding: 16px; border-radius: 12px; border: 1px solid #334155; }
  </style>
</head>
<body>
  <h1>SkillSphere Live Web Sandbox 🚀</h1>
  <div class="card">
    <p>Edit HTML & CSS live with instant iframe execution!</p>
  </div>
</body>
</html>`,
    java: `// Java Sandbox
public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to SkillSphere Java Engine!");
        int xpPoints = 1500;
        System.out.println("Current Learner XP: " + xpPoints);
    }
}`,
    cpp: `// C++ Sandbox
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Welcome to SkillSphere C++ DSA Playground!" << endl;
    vector<string> topics = {"Arrays", "Binary Search Trees", "Graphs"};
    for (const auto& topic : topics) {
        cout << "Topic: " << topic << endl;
    }
    return 0;
}`,
    sql: `-- SQL Sandbox
CREATE TABLE Students (id INT, name VARCHAR(50), xp INT);
INSERT INTO Students VALUES (1, 'Learner', 1500);
SELECT * FROM Students WHERE xp >= 1000;`
  });
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [isRunningCode, setIsRunningCode] = useState(false);

  // ── DYNAMIC TOPIC MATCHERS FOR MIND MAP & DIAGRAM ──
  const getMindMapNodesForTopic = (topicName) => {
    const tLower = (topicName || "").toLowerCase();

    if (tLower.includes("dsa") || tLower.includes("algorithm") || tLower.includes("data structure")) {
      return [
        { id: 1, label: "⚡ Data Structures & Algorithms", parent: null, color: "#F59E0B" },
        { id: 2, label: "🔢 Linear Data Structures (Arrays, Stacks, Queues)", parent: 1, color: "#38BDF8" },
        { id: 3, label: "🌲 Non-Linear Structures (Trees, Binary Trees, Heaps)", parent: 1, color: "#10B981" },
        { id: 4, label: "🔍 Searching & Sorting (Binary Search, QuickSort)", parent: 2, color: "#F9572A" },
        { id: 5, label: "🌐 Graph Algorithms (DFS, BFS, Dijkstra)", parent: 3, color: "#A855F7" },
        { id: 6, label: "🧩 Dynamic Programming & Greedy Algorithms", parent: 3, color: "#EC4899" }
      ];
    }

    if (tLower.includes("java")) {
      return [
        { id: 1, label: "☕ Java Enterprise Ecosystem", parent: null, color: "#F9572A" },
        { id: 2, label: "⚙️ Core OOP (Classes, Inheritance, Polymorphism)", parent: 1, color: "#38BDF8" },
        { id: 3, label: "🌱 Spring Boot Framework & Microservices", parent: 1, color: "#10B981" },
        { id: 4, label: "🗄️ Hibernate ORM & JPA Database Mapping", parent: 2, color: "#F59E0B" },
        { id: 5, label: "🛡️ Spring Security & JWT Token Auth", parent: 3, color: "#A855F7" },
        { id: 6, label: "⚡ JVM Internals & Garbage Collection", parent: 3, color: "#EC4899" }
      ];
    }

    if (tLower.includes("python")) {
      return [
        { id: 1, label: "🐍 Python Data Science & AI", parent: null, color: "#38BDF8" },
        { id: 2, label: "📊 NumPy Arrays & Pandas DataFrames", parent: 1, color: "#F9572A" },
        { id: 3, label: "🤖 Scikit-Learn Machine Learning Models", parent: 1, color: "#10B981" },
        { id: 4, label: "🧠 PyTorch & TensorFlow Deep Learning", parent: 2, color: "#F59E0B" },
        { id: 5, label: "🌐 FastAPI / Django Backend Web Services", parent: 3, color: "#A855F7" },
        { id: 6, label: "📈 Matplotlib & Seaborn Data Visualization", parent: 3, color: "#EC4899" }
      ];
    }

    if (tLower.includes("aws") || tLower.includes("cloud")) {
      return [
        { id: 1, label: "☁️ AWS Cloud Infrastructure", parent: null, color: "#F59E0B" },
        { id: 2, label: "🖥️ Compute Services (EC2, ECS, AWS Lambda)", parent: 1, color: "#38BDF8" },
        { id: 3, label: "🗄️ Database & Storage (S3, RDS, DynamoDB)", parent: 1, color: "#10B981" },
        { id: 4, label: "🌐 Networking & Content Delivery (VPC, CloudFront)", parent: 2, color: "#F9572A" },
        { id: 5, label: "🛡️ Security & Identity (IAM, KMS, Shield)", parent: 3, color: "#A855F7" },
        { id: 6, label: "🚀 DevOps & Automation (CloudFormation, CodePipeline)", parent: 3, color: "#EC4899" }
      ];
    }

    if (tLower.includes("security") || tLower.includes("cyber")) {
      return [
        { id: 1, label: "🛡️ Cybersecurity & Defense", parent: null, color: "#EC4899" },
        { id: 2, label: "🔐 Cryptography & Encryption (AES, RSA, SSL/TLS)", parent: 1, color: "#F9572A" },
        { id: 3, label: "🌐 Network Security (Firewalls, VPN, Wireshark)", parent: 1, color: "#38BDF8" },
        { id: 4, label: "⚔️ Ethical Hacking & Penetration Testing", parent: 2, color: "#10B981" },
        { id: 5, label: "🛡️ Identity & Access Management (OAuth 2.0, MFA)", parent: 3, color: "#F59E0B" },
        { id: 6, label: "🚨 Incident Response & Threat Intelligence", parent: 3, color: "#A855F7" }
      ];
    }

    if (tLower.includes("ui") || tLower.includes("ux") || tLower.includes("design")) {
      return [
        { id: 1, label: "🎨 UI/UX Design Masterclass", parent: null, color: "#EC4899" },
        { id: 2, label: "📐 Wireframing & Prototyping (Figma, Adobe XD)", parent: 1, color: "#38BDF8" },
        { id: 3, label: "🎯 User Research & Persona Mapping", parent: 1, color: "#10B981" },
        { id: 4, label: "🅰️ Typography & Color Systems", parent: 2, color: "#F9572A" },
        { id: 5, label: "📱 Responsive Layouts & Design Tokens", parent: 3, color: "#F59E0B" },
        { id: 6, label: "⚡ Usability Testing & Micro-Interactions", parent: 3, color: "#A855F7" }
      ];
    }

    if (tLower.includes("web3") || tLower.includes("blockchain")) {
      return [
        { id: 1, label: "⛓️ Web3 & Blockchain Engineering", parent: null, color: "#A855F7" },
        { id: 2, label: "📝 Smart Contracts (Solidity, EVM)", parent: 1, color: "#F9572A" },
        { id: 3, label: "🌐 Decentralized Apps (Ethers.js, Web3.js)", parent: 1, color: "#38BDF8" },
        { id: 4, label: "🔐 Cryptography & Public/Private Keys", parent: 2, color: "#10B981" },
        { id: 5, label: "🪙 Tokens & NFTs (ERC-20, ERC-721)", parent: 3, color: "#F59E0B" },
        { id: 6, label: "⚡ Layer 2 Scaling (Polygon, Arbitrum)", parent: 3, color: "#EC4899" }
      ];
    }

    return [
      { id: 1, label: `📌 ${topicName || "React 18 & Component Architecture"}`, parent: null, color: "#F9572A" },
      { id: 2, label: "🧩 Core Modules & Architecture", parent: 1, color: "#38BDF8" },
      { id: 3, label: "⚙️ Processing Logic & Data Flow", parent: 1, color: "#10B981" },
      { id: 4, label: "🌐 Integration & API Endpoints", parent: 2, color: "#F59E0B" },
      { id: 5, label: "🛡️ Security & Performance Tuning", parent: 2, color: "#A855F7" },
      { id: 6, label: "🚀 Production Deployment & Monitoring", parent: 3, color: "#EC4899" }
    ];
  };

  const getDiagramStepsForTopic = (topicName) => {
    const tLower = (topicName || "").toLowerCase();

    if (tLower.includes("oauth") || tLower.includes("auth")) {
      return [
        { step: 1, title: "👤 User Login Action", desc: "User enters credentials in React single page application", badge: "Client App" },
        { step: 2, title: "🛡️ OAuth 2.0 Auth Server", desc: "Verifies identity and issues signed JWT bearer token", badge: "Auth Gateway" },
        { step: 3, title: "⚙️ API Gateway Middleware", desc: "Validates JWT signature, expiration & scope permissions", badge: "Security Filter" },
        { step: 4, title: "🍃 Protected Resource DB", desc: "Fetches authorized user profile & data payload", badge: "Resource Server" }
      ];
    }

    if (tLower.includes("database") || tLower.includes("transaction")) {
      return [
        { step: 1, title: "📝 Begin ACID Transaction", desc: "Application initiates atomic database operation", badge: "Tx Start" },
        { step: 2, title: "🔒 Write-Ahead Logging (WAL)", desc: "Logs state changes to disk before table mutation", badge: "WAL Journal" },
        { step: 3, title: "⚡ Execute SQL / B-Tree Mutations", desc: "Updates memory buffer pool & index pages", badge: "DB Engine" },
        { step: 4, title: "✅ Commit & Flush", desc: "Commits transaction & returns success ack to client", badge: "Commit OK" }
      ];
    }

    if (tLower.includes("react") || tLower.includes("lifecycle")) {
      return [
        { step: 1, title: "⚛️ Component Mount & Render", desc: "Initial state evaluation & JSX virtual DOM creation", badge: "Mount" },
        { step: 2, title: "🔄 State / Props Update Trigger", desc: "setState call triggers re-evaluation of virtual subtree", badge: "State Change" },
        { step: 3, title: "⚡ Diffing Algorithm (Reconciliation)", desc: "React compares new Virtual DOM tree against previous tree", badge: "O(N) Diff" },
        { step: 4, title: "🌐 Real DOM Mutation & useEffect", desc: "Applies minimal DOM updates & runs side-effect cleanup", badge: "DOM Patch" }
      ];
    }

    if (tLower.includes("ci/cd") || tLower.includes("pipeline")) {
      return [
        { step: 1, title: "🐙 Git Push Event", desc: "Developer pushes commit to GitHub main branch", badge: "Code Push" },
        { step: 2, title: "⚙️ Automated Build & Test", desc: "GitHub Actions runner executes unit & integration tests", badge: "Test Pass" },
        { step: 3, title: "📦 Docker Image Build", desc: "Compiles production artifacts & pushes to Docker Hub", badge: "Containerized" },
        { step: 4, title: "🚀 Kubernetes Production Deploy", desc: "Performs zero-downtime rolling update on cloud cluster", badge: "Live Production" }
      ];
    }

    return [
      { step: 1, title: "🌐 Client Web Application", desc: `Sends payload request for ${topicName}`, badge: "Client Layer" },
      { step: 2, title: "🛡️ Load Balancer & API Gateway", desc: "Handles TLS termination & distributes request load", badge: "Gateway" },
      { step: 3, title: `⚙️ ${topicName} Microservice Engine`, desc: "Executes business logic, algorithms & data transformation", badge: "Core Engine" },
      { step: 4, title: "🍃 Persistent Storage & Cache", desc: "Queries Redis cache & updates database records", badge: "Persistence" }
    ];
  };

  // ── MIND MAP MODAL STATE ──
  const [mindMapTopic, setMindMapTopic] = useState("React 18 & Component Architecture");
  const [mindMapDepth, setMindMapDepth] = useState("Detailed (5 Levels)");
  const [isGeneratingMindMap, setIsGeneratingMindMap] = useState(false);
  const [mindMapNodes, setMindMapNodes] = useState(getMindMapNodesForTopic("React 18 & Component Architecture"));

  // ── CONCEPT DIAGRAM MODAL STATE ──
  const [conceptDiagramTopic, setConceptDiagramTopic] = useState("Microservices & REST API Architecture");
  const [conceptDiagramType, setConceptDiagramType] = useState("System Architecture Flow");
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [diagramSteps, setDiagramSteps] = useState(getDiagramStepsForTopic("Microservices & REST API Architecture"));

  const handleStartPracticeQuizFromModal = () => {
    const isPython = quizTrackSelect.toLowerCase().includes("python");
    const baseQuestions = isPython ? python20QuizQuestions : react20QuizQuestions;
    const count = parseInt(quizLengthSelect) || 20;
    const selectedQuestions = baseQuestions.slice(0, count);

    const quizMessage = {
      id: Date.now(),
      sender: "bot",
      type: "quiz",
      title: `🎯 ${quizLengthSelect} ${quizTrackSelect} Quiz Challenge (${quizDiffSelect})`,
      subtitle: "Reference Documentation: GeeksforGeeks & W3Schools",
      questions: selectedQuestions,
      followUps: ["Explain Question 1", isPython ? "Try React Quiz" : "Try Python Quiz", "Give Study Plan"]
    };

    setMessages(prev => [...prev, quizMessage]);
    closeModal();
  };

  const handleRunPlaygroundCode = () => {
    setIsRunningCode(true);
    setPlaygroundOutput("⏳ Executing code on SkillSphere Sandbox Engine...");
    setTimeout(() => {
      setIsRunningCode(false);
      const codeStr = playgroundCode[playgroundLang];
      if (playgroundLang === "javascript") {
        try {
          let logs = [];
          const customConsole = { log: (...args) => logs.push(args.join(" ")) };
          const runFn = new Function("console", codeStr);
          runFn(customConsole);
          setPlaygroundOutput(logs.join("\n") || "Code executed successfully with 0 console logs.");
        } catch (err) {
          setPlaygroundOutput(`❌ Runtime Error: ${err.message}`);
        }
      } else if (playgroundLang === "python") {
        setPlaygroundOutput(`Welcome to SkillSphere Python, Learner!\nMastering: Pandas DataFrames\nMastering: NumPy\nMastering: PyTorch Deep Learning\n\n[Process exited with status 0]`);
      } else if (playgroundLang === "html") {
        setPlaygroundOutput(`[HTML/CSS Live Web Sandbox Rendered Successfully]`);
      } else if (playgroundLang === "java") {
        setPlaygroundOutput(`Welcome to SkillSphere Java Engine!\nCurrent Learner XP: 1500\n\n[Build Success - 0 Errors]`);
      } else if (playgroundLang === "cpp") {
        setPlaygroundOutput(`Welcome to SkillSphere C++ DSA Playground!\nTopic: Arrays\nTopic: Binary Search Trees\nTopic: Graphs\n\n[Process exited with status 0]`);
      } else {
        setPlaygroundOutput(`1 | Learner | 1500\n(1 row affected)`);
      }
    }, 700);
  };

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "student-profile", label: "Student Profile", icon: <FaAward /> },
    { id: "services-catalog", label: "Services & Catalog", icon: <FaBook /> },
    { id: "assessments", label: "Assessments", icon: <FaBolt /> },
    { id: "certification-tracking", label: "Cert Tracking", icon: <FaCertificate /> },
    { id: "tracking-dashboard", label: "Tracking Dashboard", icon: <FaChartLine /> },
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

  const [messages, setMessages] = useState([]);

  const fetchChatHistory = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/ai/messages`);
      const data = await res.json();
      if (res.ok && data.success && data.messages && data.messages.length > 0) {
        const mapped = data.messages.map(m => {
          let howItWorks = [];
          if (m.howItWorks) {
            howItWorks = m.howItWorks.split("\n");
          }
          return {
            id: m.id,
            sender: m.sender,
            text: m.text,
            time: m.time,
            type: m.type,
            title: m.title,
            intro: m.intro,
            howItWorks: howItWorks.length > 0 ? howItWorks : undefined,
            codeSnippet: m.codeSnippet || undefined
          };
        });
        setMessages(mapped);
      } else {
        setMessages([
          {
            id: 1,
            sender: "bot",
            text: `Hi ${userName || "Learner"}! 👋 🔥\nI'm your AI Study Buddy. What would you like to learn today?`,
            quickPrompts: [
              "Explain React useState hook",
              "What is Big O Notation?",
              "Summarize TCP/IP Model"
            ]
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: `Hi ${userName || "Learner"}! 👋 🔥\nI'm your AI Study Buddy. What would you like to learn today?`,
          quickPrompts: [
            "Explain React useState hook",
            "What is Big O Notation?",
            "Summarize TCP/IP Model"
          ]
        }
      ]);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your study chat history?")) {
      const initialWelcomeMsg = [
        {
          id: Date.now(),
          sender: "bot",
          text: `Hi ${userName || "Learner"}! 👋 🔥\nI'm your AI Study Buddy. What would you like to learn today?`,
          quickPrompts: [
            "Explain React useState hook",
            "What is Big O Notation?",
            "Summarize TCP/IP Model"
          ]
        }
      ];

      // 1. Immediately reset messages state in UI
      setMessages(initialWelcomeMsg);

      // 2. Clear all local storage chat histories
      try {
        const userKey = user?.email || user?.username || 'default';
        localStorage.removeItem(`ai_chat_history_${userKey}`);
        localStorage.removeItem(`skillsphere_ai_messages_${userKey}`);
        localStorage.removeItem("ai_chat_messages");
      } catch (e) {
        console.warn("Error clearing local storage:", e);
      }

      // 3. Delete from backend database if endpoint is active
      try {
        await authenticatedFetch(`${API_URL}/api/ai/messages`, {
          method: "DELETE"
        });
      } catch (e) {
        console.warn("Backend chat delete notice:", e);
      }

      // 4. Toast notification
      setToastMessage("🗑️ Study Chat History Cleared!");
      setTimeout(() => setToastMessage(""), 3500);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");

    // Save user message to database
    try {
      await authenticatedFetch(`${API_URL}/api/ai/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMsg)
      });
    } catch (e) {
      console.error("Failed to save user message:", e);
    }

    // Add typing placeholder
    const typingId = Date.now() + 1;
    setMessages((prev) => [...prev, {
      id: typingId,
      sender: "bot",
      text: "Thinking...",
      isTyping: true
    }]);

    try {
      const aiResult = await askGeminiAI(text, { user, activeContext: activeCourseContext });
      const botMsgText = aiResult.text || `Here is a clear breakdown for "${text}":\n\n1. Focus on core principles.\n2. Apply modular design and test with edge cases.`;
      
      const botMsg = {
        sender: "bot",
        text: botMsgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) =>
        prev.map(m => m.isTyping ? {
          id: m.id,
          ...botMsg,
          followUps: ["Explain in simple terms", "Give a code example", "Suggest next steps"]
        } : m)
      );

      // Save bot response to database
      try {
        await authenticatedFetch(`${API_URL}/api/ai/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(botMsg)
        });
      } catch (e) {}

    } catch (err) {
      console.warn("AI Chat API error, falling back to local responder:", err);
      
      const botMsgFallback = {
        sender: "bot",
        text: `Here is a clear breakdown for "${text}":\n\n1. Key Principle: Focus on modular design and core concepts.\n2. Implementation: Apply clean code practices with optimal data structures.\n3. Try testing with edge cases to verify performance!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) =>
        prev.map(m => m.isTyping ? {
          id: m.id,
          ...botMsgFallback,
          followUps: ["Explain in simple terms", "Give a code example"]
        } : m)
      );

      // Save bot response to database
      try {
        await authenticatedFetch(`${API_URL}/api/ai/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(botMsgFallback)
        });
      } catch (e) {}
    }
  };

  const triggerVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputMsg("Explain React Component Lifecycle");
    }, 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSend(`Attached file: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Please analyze this document.`);
    }
  };

  const openToolModal = (toolName, toolDesc) => {
    setToolModalContent({ name: toolName, desc: toolDesc });
    setActiveModal("tool");
  };

  // ── SUMMARIZE NOTES HANDLERS ──
  const handleGenerateSummary = async () => {
    if (!notesText.trim()) return;
    setIsGeneratingSummary(true);
    setSummaryGenerated(false);
    
    const topicToUse = selectedSummaryTopic === "Custom Topic Input" ? (customSummaryTopic || "General Topic") : selectedSummaryTopic;
    try {
      const prompt = `Summarize the following content into ${keyPoints} concise key bullet points focusing on topic "${topicToUse}":\n\n${notesText}`;
      const aiRes = await askGeminiAI(prompt);
      const lines = aiRes.text.split("\n").map(l => l.replace(/^[-*•\d.\s]+/, "").trim()).filter(l => l.length > 5).slice(0, keyPoints);
      if (lines.length > 0) {
        setGeneratedSummary(lines);
      } else {
        setGeneratedSummary([
          `Summary point 1 for ${topicToUse}: Focus on core architecture and principles.`,
          `Summary point 2 for ${topicToUse}: Modular design improves long-term maintainability.`,
          `Summary point 3 for ${topicToUse}: Apply clean coding practices and performance testing.`
        ]);
      }
    } catch (e) {
      setGeneratedSummary([
        `Summary point 1 for ${topicToUse}: Core principles and architecture.`,
        `Summary point 2 for ${topicToUse}: Best practices and implementation logic.`
      ]);
    } finally {
      setIsGeneratingSummary(false);
      setSummaryGenerated(true);
    }
  };

  const handleNotesFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNotesText(`[File uploaded: ${file.name}]\n\nContent extracted from ${file.name} will appear here. The AI will analyze and summarize this document.`);
    }
  };

  // ── FLASHCARDS HANDLERS ──
  const handleGenerateFlashcards = () => {
    setIsGeneratingCards(true);
    const topicToUse = selectedFlashcardTopic === "Custom Topic Input" ? (customFlashcardTopic || "Selected Topic") : selectedFlashcardTopic;
    setTimeout(() => {
      setIsGeneratingCards(false);
      setActiveModal(null);
      handleSend(`Create ${numCards} ${difficultyLevel.toLowerCase()} difficulty ${questionType.toLowerCase()} flashcards for topic: "${topicToUse}"`);
    }, 1200);
  };

  // ── INTERVIEW PREP HANDLERS ──
  const handleStartInterview = () => {
    setIsStartingInterview(true);
    setTimeout(() => {
      setIsStartingInterview(false);
      setActiveModal(null);
      handleSend(`Start Mock Interview for ${jobRole} position with ${experienceLevel} experience. Interview type: ${interviewType}. Difficulty: ${interviewDifficulty}.`);
    }, 1500);
  };

  const interviewPracticeTypes = [
    { id: "mock", label: "Mock Interview", icon: <FaUser />, desc: "Simulate real interview experience" },
    { id: "question", label: "Question Practice", icon: <FaQuestionCircle />, desc: "Practice from a vast question bank" },
    { id: "behavioral", label: "Behavioral Prep", icon: <FaCheckCircle />, desc: "Master behavioral questions" },
    { id: "resume", label: "Resume Review", icon: <FaFileAlt />, desc: "Get AI feedback on your resume" },
    { id: "company", label: "Company Interview", icon: <FaBuilding />, desc: "Practice specific company interviews" },
    { id: "coding", label: "Coding Interview", icon: <FaCode />, desc: "Practice coding rounds" }
  ];

  const flashcardSources = [
    { id: "text", label: "Text / Notes", icon: <FaFileAlt />, desc: "Paste your notes or text" },
    { id: "file", label: "File Upload", icon: <FaUpload />, desc: "Upload PDF, DOCX, TXT" },
    { id: "web", label: "Web Link", icon: <FaLink />, desc: "Summarize any webpage" },
    { id: "youtube", label: "YouTube Video", icon: <FaYoutube />, desc: "Create cards from videos" },
    { id: "ai", label: "AI Generate", icon: <FaMagic />, desc: "Generate from a topic" }
  ];

  const closeModal = () => setActiveModal(null);

  return (
    <div className={`aisbpWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      {/* Main Grid Layout Container */}
      <div className="aisbpMainContainer">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="aisbpLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>

            <div className="aisbpSidebarHomeArchHeader">
              <div className="aisbpArchLine" />
              <button
                className="aisbpHomeCircularBtn active"
                onClick={() => navigate("/ai-buddy")}
                title="AI Study Buddy"
              >
                <FaRobot />
              </button>
            </div>

            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "ai-buddy" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "opportunity-feed") navigate("/opportunity-feed");
                      else if (item.id === "badges") navigate("/badges");
                      else if (item.id === "progress") navigate("/progress");
                      else if (item.id === "discussions") navigate("/discussions");
                      else if (item.id === "certificates") navigate("/certificate");
                      else if (item.id === "daily-quests") navigate("/daily-quests");
                      else if (item.id === "resume") navigate("/resume");
                      else if (item.id === "settings") navigate("/settings");
                      else navigate("/student-home");
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
            <div className="sdRocketIllustrationBox">
              <span className="sdRocketEmoji">🚀</span>
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
          </div>
        </aside>

        {/* ── RIGHT MAIN BODY AREA ── */}
        <div className="aisbpRightBodyArea">

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

          {/* AI Study Buddy Header Row */}
          <div className="aisbpHeaderBar">
            <div className="aisbpHeaderTitle">
              <h2>🤖 AI Study Buddy ✨</h2>
              <p>Your intelligent learning companion. Ask anything, learn everything!</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btnStudyHistory" onClick={handleClearHistory} style={{ background: "#EF4444", color: "#FFF" }}>
                🗑️ Clear History
              </button>
              <button className="btnStudyHistory" onClick={() => setActiveModal("history")}>
                <FaHistory /> Study Buddy History
              </button>
            </div>
          </div>

          {/* 3-COLUMN WORKSPACE GRID */}
          <div className="aisbpWorkspaceGrid">

            {/* 1. LEFT PROMPT ACTION CARDS COLUMN */}
            <div className="aisbpLeftCol">
              <h4>How can I help you today?</h4>

              <div className="aisbpPromptCardsList">
                <div className="aisbpPromptCard" onClick={() => handleSend("Explain a Concept in React")}>
                  <div className="pCardIcon yellow"><FaLightbulb /></div>
                  <div>
                    <strong>Explain a Concept</strong>
                    <span>Get simple explanations</span>
                  </div>
                </div>

                <div className="aisbpPromptCard" onClick={() => setActiveModal("summarize-notes")}>
                  <div className="pCardIcon blue"><FaFileAlt /></div>
                  <div>
                    <strong>Summarize Notes</strong>
                    <span>Summarize any topic</span>
                  </div>
                </div>

                <div className="aisbpPromptCard" onClick={() => setActiveModal("practice-quiz")}>
                  <div className="pCardIcon green"><FaQuestionCircle /></div>
                  <div>
                    <strong>Generate Quiz</strong>
                    <span>Practice with AI quizzes</span>
                  </div>
                </div>

                <div className="aisbpPromptCard" onClick={() => handleSend("Code Explanation: useState hook")}>
                  <div className="pCardIcon orange"><FaCode /></div>
                  <div>
                    <strong>Code Explanation</strong>
                    <span>Explain &amp; debug code</span>
                  </div>
                </div>

                <div className="aisbpPromptCard" onClick={() => setActiveModal("create-flashcards")}>
                  <div className="pCardIcon purple"><FaClone /></div>
                  <div>
                    <strong>Create Flashcards</strong>
                    <span>Make flashcards instantly</span>
                  </div>
                </div>

                <div className="aisbpPromptCard" onClick={() => setActiveModal("interview-prep")}>
                  <div className="pCardIcon rose"><FaBriefcase /></div>
                  <div>
                    <strong>Interview Prep</strong>
                    <span>Get interview questions</span>
                  </div>
                </div>

                <div className="aisbpPromptCard" onClick={() => setActiveModal("study-plan")}>
                  <div className="pCardIcon cyan"><FaCalendarAlt /></div>
                  <div>
                    <strong>Study Plan</strong>
                    <span>Personalized study plan</span>
                  </div>
                </div>
              </div>

              {/* Upgrade to Pro Banner Card */}
              <div className="aisbpUpgradeCard">
                <div className="upgradeCardContent">
                  <h5>Upgrade to Pro</h5>
                  <p>Unlock GPT-4, advanced PDFs, image analysis &amp; more!</p>
                  <button className="btnUpgradeNow" onClick={() => setActiveModal("upgrade")}>
                    <FaCrown /> Upgrade Now
                  </button>
                </div>
                <div className="bot3dAvatar">🤖</div>
              </div>
            </div>

            {/* 2. CENTER CHAT THREAD AREA */}
            <div className="aisbpCenterCol">
              <div className="chatThreadWindow">
                {messages.map((m) => (
                  <div key={m.id} className={`chatRow ${m.sender}`}>
                    {m.sender === "bot" && <div className="botRowAvatar">🤖</div>}

                    <div className={`chatBubble ${m.sender}`}>
                      {m.text && <FormattedMessage text={m.text} />}

                      {m.quickPrompts && (
                        <div className="quickPromptChipsRow">
                          {m.quickPrompts.map((qp, qIdx) => (
                            <button key={qIdx} onClick={() => handleSend(qp)}>
                              {qp}
                            </button>
                          ))}
                        </div>
                      )}

                      {m.type === "explanation" && (
                        <div className="explanationCardContent">
                          <p className="introText">Sure! Here's a simple explanation of {m.title}.</p>

                          <h4>{m.title}</h4>
                          {m.referenceTag && (
                            <div style={{ margin: "6px 0 10px 0", fontSize: "11px", fontWeight: 700, background: "#FFF0EB", color: "#F9572A", padding: "4px 10px", borderRadius: "8px", border: "1px solid #FAD6C8", display: "inline-block" }}>
                              📚 Documentation Reference: {m.referenceTag}
                            </div>
                          )}
                          <p className="descP">{m.intro}</p>

                          <h5 className="subHeading">How it works?</h5>
                          <ol className="stepsOrderedList">
                            {m.howItWorks.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ol>

                          <h5 className="subHeading">Example</h5>
                          <div className="codeTerminalBlock">
                            <div className="terminalHeader">
                              <button className="btnCopyCode" onClick={() => handleCopyCode(m.codeSnippet)}>
                                {copiedCode ? <FaCheck color="#10B981" /> : <FaCopy />} {copiedCode ? "Copied" : "Copy"}
                              </button>
                            </div>
                            <pre><code>{m.codeSnippet}</code></pre>
                          </div>

                          {m.followUps && (
                            <div className="followUpChipsRow">
                              {m.followUps.map((fu, fIdx) => (
                                <button key={fIdx} onClick={() => handleSend(fu)}>
                                  {fu}
                                </button>
                              ))}

                              <div className="feedbackIcons">
                                <FaThumbsUp className="fIcon" title="Helpful" />
                                <FaThumbsDown className="fIcon" title="Not Helpful" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {m.type === "quiz" && (
                        <div className="quizWidgetThreadContent" style={{ background: isDarkMode ? "#1E293B" : "#FAF8F5", padding: "16px", borderRadius: "18px", border: "1px solid #E2E8F0", marginTop: "10px" }}>
                          <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 800, color: "#F9572A" }}>{m.title}</h4>
                          <p style={{ margin: "0 0 14px 0", fontSize: "11px", color: "#64748B" }}>{m.subtitle}</p>

                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "420px", overflowY: "auto", paddingRight: "6px" }}>
                            {m.questions.map((qItem) => (
                              <div key={qItem.id} style={{ background: isDarkMode ? "#0F172A" : "#FFFFFF", padding: "12px", borderRadius: "12px", border: "1px solid #CBD5E1" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                  <strong style={{ fontSize: "12px", color: isDarkMode ? "#F8FAFC" : "#1E1B18" }}>Q{qItem.id}. {qItem.q}</strong>
                                  <span style={{ fontSize: "9px", background: "#FFF0EB", color: "#F9572A", padding: "2px 6px", borderRadius: "99px", fontWeight: 700, border: "1px solid #FAD6C8" }}>{qItem.ref}</span>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                                  {qItem.options.map((opt, oIdx) => (
                                    <button
                                      key={oIdx}
                                      className={`quizOptionBtn ${quizUserAnswers[`${m.id}_${qItem.id}`] === oIdx ? "selected" : ""}`}
                                      onClick={() => setQuizUserAnswers(prev => ({ ...prev, [`${m.id}_${qItem.id}`]: oIdx }))}
                                      style={{
                                        textAlign: "left",
                                        padding: "8px 10px",
                                        fontSize: "11px",
                                        borderRadius: "8px",
                                        border: quizUserAnswers[`${m.id}_${qItem.id}`] === oIdx ? "2px solid #F9572A" : "1px solid #CBD5E1",
                                        background: quizUserAnswers[`${m.id}_${qItem.id}`] === oIdx ? (isDarkMode ? "#334155" : "#FFF0EB") : (isDarkMode ? "#1E293B" : "#FFFFFF"),
                                        color: quizUserAnswers[`${m.id}_${qItem.id}`] === oIdx ? "#F9572A" : (isDarkMode ? "#F8FAFC" : "#1E1B18"),
                                        cursor: "pointer",
                                        fontWeight: quizUserAnswers[`${m.id}_${qItem.id}`] === oIdx ? 700 : 400
                                      }}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>

                                {quizUserAnswers[`${m.id}_${qItem.id}`] !== undefined && (
                                  <div style={{ marginTop: "8px", padding: "6px 10px", borderRadius: "6px", background: quizUserAnswers[`${m.id}_${qItem.id}`] === qItem.correct ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", border: quizUserAnswers[`${m.id}_${qItem.id}`] === qItem.correct ? "1px solid #86EFAC" : "1px solid #FCA5A5", fontSize: "10px", color: quizUserAnswers[`${m.id}_${qItem.id}`] === qItem.correct ? "#15803D" : "#B91C1C" }}>
                                    <strong>{quizUserAnswers[`${m.id}_${qItem.id}`] === qItem.correct ? "✓ Correct!" : "✗ Incorrect."}</strong> {qItem.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "12px", fontWeight: 800, color: "#10B981" }}>
                              Score: {m.questions.filter(q => quizUserAnswers[`${m.id}_${q.id}`] === q.correct).length} / 20 Correct
                            </span>
                            <button
                              className="btnConfirmPro"
                              onClick={() => {
                                const correctCount = m.questions.filter(q => quizUserAnswers[`${m.id}_${q.id}`] === q.correct).length;
                                if (earnXp) earnXp(correctCount * 5);
                                setToastMessage(`🎉 Quiz Complete! You scored ${correctCount}/20 (+${correctCount * 5} XP Earned)`);
                                setTimeout(() => setToastMessage(""), 4000);
                              }}
                              style={{ padding: "8px 16px", fontSize: "11px", borderRadius: "99px", background: "#F9572A", color: "#FFF", border: "none", cursor: "pointer", fontWeight: 800 }}
                            >
                              Submit Quiz & Calculate XP →
                            </button>
                          </div>
                        </div>
                      )}

                      {m.time && <span className="msgTimestamp">{m.time} ✓✓</span>}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Floating Bottom Input Bar */}
              <div className="aisbpInputContainer">
                <div className="aisbpInputRow">
                  <input
                    type="text"
                    placeholder={isListening ? "Listening... Speak your question now" : "Ask anything..."}
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />

                  <div className="inputControlsRow">
                    <button className="iconBtn" title="More Options"><FaPlus /></button>

                    <div
                      className={`dropdownPill ${isWebSearch ? "active" : ""}`}
                      onClick={() => setIsWebSearch(!isWebSearch)}
                      title="Toggle Web Search"
                    >
                      <FaGlobe /> <span>Web Search</span> ▾
                    </div>

                    <button
                      className="fileAttachBtn"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <FaPaperclip /> Attach File
                    </button>

                    <button
                      className={`iconBtn mic ${isListening ? "listening" : ""}`}
                      onClick={triggerVoiceInput}
                      title="Voice Search"
                    >
                      <FaMicrophone />
                    </button>

                    <button className="btnSendOrange" onClick={() => handleSend()}>
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>

                <span className="disclaimerText">AI can make mistakes. Please verify important information.</span>
              </div>

            </div>

            {/* 3. RIGHT COLUMN SIDEBAR WIDGETS */}
            <div className="aisbpRightCol">

              {/* Current Course Context Card */}
              {/* Study Buddy Tools (2x3 Grid) */}
              <div className="aisbpWidgetCard">
                <h4>Study Buddy Tools</h4>

                <div className="toolsGrid2x3">
                  <div className="toolGridBox" onClick={() => setActiveModal("mind-map")}>
                    <div className="tIcon rose"><FaShareAlt /></div>
                    <strong>Mind Map</strong>
                    <span>Visualize concepts</span>
                  </div>

                  <div className="toolGridBox" onClick={() => setActiveModal("generate-notes")}>
                    <div className="tIcon blue"><FaStickyNote /></div>
                    <strong>Generate Notes</strong>
                    <span>Create notes instantly</span>
                  </div>

                  <div className="toolGridBox" onClick={() => setActiveModal("practice-quiz")}>
                    <div className="tIcon green"><FaQuestionCircle /></div>
                    <strong>Practice Quiz</strong>
                    <span>Test your knowledge</span>
                  </div>

                  <div className="toolGridBox" onClick={() => setActiveModal("create-flashcards")}>
                    <div className="tIcon orange"><FaClone /></div>
                    <strong>Flashcards</strong>
                    <span>Smart flashcards</span>
                  </div>

                  <div className="toolGridBox" onClick={() => setActiveModal("concept-diagram")}>
                    <div className="tIcon purple"><FaLayerGroup /></div>
                    <strong>Concept Diagram</strong>
                    <span>Generate diagrams</span>
                  </div>

                  <div className="toolGridBox" onClick={() => setActiveModal("code-playground")}>
                    <div className="tIcon cyan"><FaTerminal /></div>
                    <strong>Code Playground</strong>
                    <span>Run &amp; test code</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════
          INTERACTIVE MODALS
      ══════════════════════════════════════════════════════ */}

      {/* 1. History Modal */}
      {activeModal === "history" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3><FaHistory /> Study Buddy History</h3>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <ul className="historyList">
                <li onClick={() => { handleSend("Virtual DOM"); closeModal(); }}>
                  <strong>Virtual DOM in React</strong> <span>Today, 10:30 AM</span>
                </li>
                <li onClick={() => { handleSend("Props vs State"); closeModal(); }}>
                  <strong>Props vs State in React</strong> <span>Yesterday, 6:20 PM</span>
                </li>
                <li onClick={() => { handleSend("useEffect"); closeModal(); }}>
                  <strong>Explain useEffect Hook</strong> <span>27 May 2025</span>
                </li>
                <li onClick={() => { handleSend("SQL vs NoSQL"); closeModal(); }}>
                  <strong>Difference between SQL &amp; NoSQL</strong> <span>25 May 2025</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. Upgrade to Pro Modal */}
      {activeModal === "upgrade" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer proModal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3><FaCrown color="#F59E0B" /> SkillSphere AI Pro</h3>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <p>Supercharge your learning with advanced AI capabilities!</p>
              <ul className="proFeaturesList">
                <li>✨ Unlimited GPT-4o &amp; Claude 3.5 Sonnet queries</li>
                <li>📄 PDF &amp; Slide document analysis</li>
                <li>🖼️ Visual code diagram &amp; image recognition</li>
                <li>⚡ 2x Faster response speed</li>
              </ul>
              <button className="btnConfirmPro">Upgrade Now — ₹499 / month</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Course Context Switcher Modal */}
      {activeModal === "context" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Switch Active Course Context</h3>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <div className="contextOptionsList">
                {[
                  { title: "React Developer Path", module: "Module 2: React Components", icon: "⚛️" },
                  { title: "Python for Data Science", module: "Module 3: Pandas & Dataframes", icon: "🐍" },
                  { title: "Fullstack with Node.js", module: "Module 4: RESTful APIs", icon: "🟩" },
                  { title: "UI/UX Design Masterclass", module: "Module 2: Figma Wireframing", icon: "🎨" }
                ].map((ctx) => (
                  <div key={ctx.title} className={`ctxOption ${activeCourseContext.title === ctx.title ? "active" : ""}`}
                    onClick={() => { setActiveCourseContext(ctx); closeModal(); }}>
                    <span className="icon">{ctx.icon}</span>
                    <div><strong>{ctx.title}</strong><span>{ctx.module}</span></div>
                    {activeCourseContext.title === ctx.title && <FaCheckCircle className="ctxActiveCheck" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tool Feature Modal */}
      {activeModal === "tool" && toolModalContent && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>🛠️ {toolModalContent.name}</h3>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <p>{toolModalContent.desc}</p>
              <button className="btnConfirmPro" onClick={() => {
                handleSend(`Launch ${toolModalContent.name} tool for ${activeCourseContext.title}`);
                closeModal();
              }}>
                Launch {toolModalContent.name} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Edit Goal Modal */}
      {activeModal === "edit-goal" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Edit Daily Study Goal</h3>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>
            <div className="modalBody">
              <label className="modalLabel">Target Daily XP Goal:</label>
              <select className="modalSelect"
                value={dailyGoalXP}
                onChange={(e) => setDailyGoalXP(Number(e.target.value))}>
                <option value={50}>50 XP / day (Beginner)</option>
                <option value={100}>100 XP / day (Intermediate)</option>
                <option value={200}>200 XP / day (Pro)</option>
              </select>
              <button className="btnConfirmPro" onClick={closeModal}>Save Goal</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          6. SUMMARIZE NOTES MODAL (Matching Image 1 Reference)
      ══════════════════════════════════════════════════════ */}
      {activeModal === "summarize-notes" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer snModal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="snModalHeader">
              <div className="snModalTitleRow">
                <div className="snModalIcon">📋</div>
                <div>
                  <h3>Summarize Notes</h3>
                  <p>Get concise summaries of any topic, notes or content.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            {/* Two-Column Layout */}
            <div className="snModalBody">

              {/* LEFT: Notes Input */}
              <div className="snLeftPanel">
                <div className="snPanelHeader">
                  <span className="snPanelTitle">Select Topic &amp; Notes</span>
                  <span className="snCharCount">{notesText.length}/5000</span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label className="modalLabel" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>🎯 Target Topic:</label>
                  <select
                    className="modalSelect"
                    style={{ width: "100%", padding: "8px 12px", fontSize: "12px", marginBottom: selectedSummaryTopic === "Custom Topic Input" ? "8px" : "0" }}
                    value={selectedSummaryTopic}
                    onChange={(e) => setSelectedSummaryTopic(e.target.value)}
                  >
                    <option>React &amp; Frontend Development</option>
                    <option>Python &amp; Data Science Fundamentals</option>
                    <option>Java Core &amp; Spring Boot Microservices</option>
                    <option>Data Structures &amp; Algorithms (DSA)</option>
                    <option>Node.js &amp; RESTful API Engineering</option>
                    <option>Machine Learning &amp; Generative AI</option>
                    <option>UI/UX &amp; Figma Design Essentials</option>
                    <option>Cybersecurity &amp; Network Security</option>
                    <option>AWS &amp; Cloud Infrastructure</option>
                    <option>Custom Topic Input</option>
                  </select>

                  {selectedSummaryTopic === "Custom Topic Input" && (
                    <input
                      type="text"
                      className="modalSelect"
                      placeholder="Type custom topic (e.g. Docker, GraphQL, System Design)..."
                      style={{ width: "100%", padding: "8px 12px", fontSize: "12px" }}
                      value={customSummaryTopic}
                      onChange={(e) => setCustomSummaryTopic(e.target.value)}
                    />
                  )}
                </div>
                <textarea
                  className="snNotesTextarea"
                  placeholder="Paste your notes here..."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value.slice(0, 5000))}
                  maxLength={5000}
                />

                {/* File Upload Area */}
                <div className="snUploadSection">
                  <p className="snUploadLabel">Upload Notes (Optional)</p>
                  <div
                    className="snDropZone"
                    onClick={() => notesFileRef.current && notesFileRef.current.click()}
                  >
                    <div className="snDropZoneIcon">📎</div>
                    <p>Drag &amp; drop your file here</p>
                    <span>or <span className="snBrowseLink">browse</span></span>
                    <small>Supports: PDF, DOCX, TXT, MD (Max 10MB)</small>
                  </div>
                  <input
                    type="file"
                    ref={notesFileRef}
                    style={{ display: "none" }}
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleNotesFileUpload}
                  />
                </div>

                {/* Controls */}
                <div className="snControlsRow">
                  <div className="snControlGroup">
                    <label>Summary Length</label>
                    <select className="snSelect" value={summaryLength} onChange={(e) => setSummaryLength(e.target.value)}>
                      <option>Short</option>
                      <option>Medium</option>
                      <option>Long</option>
                    </select>
                  </div>
                  <div className="snControlGroup">
                    <label>Key Points</label>
                    <select className="snSelect" value={keyPoints} onChange={(e) => setKeyPoints(Number(e.target.value))}>
                      {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  className="snGenerateBtn"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary || !notesText.trim()}
                >
                  {isGeneratingSummary ? (
                    <><FaSpinner className="spinIcon" /> Generating...</>
                  ) : (
                    <>✨ Generate Summary</>
                  )}
                </button>
              </div>

              {/* RIGHT: Summary Output */}
              <div className="snRightPanel">
                <div className="snPanelHeader">
                  <span className="snPanelTitle">Summary</span>
                  {summaryGenerated && (
                    <span className="snAIBadge">✨ AI Generated</span>
                  )}
                </div>

                {summaryGenerated && generatedSummary.length > 0 ? (
                  <div className="snSummaryOutput">
                    <ul className="snSummaryList">
                      {generatedSummary.map((point, idx) => (
                        <li key={idx}>
                          {idx >= 3 && idx < 3 + 4 ? (
                            <span className="snBulletItem">
                              <span className="snBulletDot" style={{ background: "#F9572A" }}></span>
                              {point}
                            </span>
                          ) : (
                            <span className="snBulletItem">
                              <span className="snBulletDot"></span>
                              {point}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="snEmptyState">
                    <div className="snEmptyIcon">📝</div>
                    <p>Your AI-generated summary will appear here.</p>
                    <small>Paste your notes and click Generate Summary</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          7. CREATE FLASHCARDS MODAL (Matching Images 2 & 3)
      ══════════════════════════════════════════════════════ */}
      {activeModal === "create-flashcards" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer fcModal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="fcModalHeader">
              <div className="fcModalTitleRow">
                <div className="fcModalIcon">✦</div>
                <div>
                  <h3>Create Flashcards</h3>
                  <p>Generate or create flashcards to boost your learning.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            {/* Body */}
            <div className="fcModalBody">

              {/* LEFT: Source Selection */}
              <div className="fcLeftPanel">
                <p className="fcPanelTitle">✦ Source</p>
                <div className="fcSourceList">
                  {flashcardSources.map((src) => (
                    <div
                      key={src.id}
                      className={`fcSourceItem ${flashcardSource === src.id ? "active" : ""}`}
                      onClick={() => setFlashcardSource(src.id)}
                    >
                      <div className={`fcSourceIcon ${src.id === "youtube" ? "youtube" : ""}`}>
                        {src.icon}
                      </div>
                      <div>
                        <strong>{src.label}</strong>
                        <span>{src.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upgrade Banner */}
                <div className="fcUpgradeBanner">
                  <div className="fcUpgradeContent">
                    <FaCrown color="#F59E0B" />
                    <div>
                      <strong>Upgrade to Pro</strong>
                      <p>Unlock unlimited mocks, AI evaluation, resume score &amp; more!</p>
                    </div>
                  </div>
                  <button className="fcUpgradeBtn" onClick={() => setActiveModal("upgrade")}>
                    🔥 Upgrade Now
                  </button>
                </div>
              </div>

              {/* RIGHT: Content Area */}
              <div className="fcRightPanel">

                {/* Dynamic Source Content */}
                {flashcardSource === "text" && (
                  <div className="fcContentArea">
                    <div className="fcTextAreaHeader">
                      <span>Paste your notes or content</span>
                      <span className="fcCharCount">{flashcardNotes.length}/5000</span>
                    </div>
                    <textarea
                      className="fcNotesTextarea"
                      placeholder="Paste your study notes, textbook content, or any material here..."
                      value={flashcardNotes}
                      onChange={(e) => setFlashcardNotes(e.target.value.slice(0, 5000))}
                    />
                    <button className="fcEnhanceBtn">
                      <FaMagic /> Enhance with AI
                    </button>
                  </div>
                )}

                {flashcardSource === "file" && (
                  <div className="fcContentArea">
                    <div
                      className="fcDropZone"
                      onClick={() => flashcardFileRef.current && flashcardFileRef.current.click()}
                    >
                      <div className="fcDropIcon">📎</div>
                      <p>Drop your file here or <span className="fcBrowseLink">browse</span></p>
                      <small>Supports PDF, DOCX, TXT (Max 10MB)</small>
                    </div>
                    <input type="file" ref={flashcardFileRef} style={{ display: "none" }} accept=".pdf,.docx,.txt" />
                  </div>
                )}

                {flashcardSource === "web" && (
                  <div className="fcContentArea">
                    <label className="fcInputLabel">Enter Webpage URL</label>
                    <div className="fcInputWithIcon">
                      <FaLink className="fcInputIcon" />
                      <input
                        type="url"
                        className="fcUrlInput"
                        placeholder="https://example.com/article"
                        value={webLinkInput}
                        onChange={(e) => setWebLinkInput(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {flashcardSource === "youtube" && (
                  <div className="fcContentArea">
                    <label className="fcInputLabel">Enter YouTube Video URL</label>
                    <div className="fcInputWithIcon">
                      <FaYoutube className="fcInputIcon youtube" />
                      <input
                        type="url"
                        className="fcUrlInput"
                        placeholder="https://youtube.com/watch?v=..."
                        value={youtubeInput}
                        onChange={(e) => setYoutubeInput(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {flashcardSource === "ai" && (
                  <div className="fcContentArea">
                    <label className="fcInputLabel">Enter Topic to Generate From</label>
                    <input
                      type="text"
                      className="fcTopicInput"
                      placeholder="e.g. React Hooks, Machine Learning Basics, World War II..."
                      value={aiTopicInput}
                      onChange={(e) => setAiTopicInput(e.target.value)}
                    />
                  </div>
                )}

                {/* Topic Selector Row */}
                <div style={{ marginBottom: "14px" }}>
                  <label className="fcInputLabel" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>🎯 Target Flashcard Topic:</label>
                  <select
                    className="fcSelect"
                    style={{ width: "100%", padding: "8px 12px", fontSize: "12px", marginBottom: selectedFlashcardTopic === "Custom Topic Input" ? "8px" : "0" }}
                    value={selectedFlashcardTopic}
                    onChange={(e) => setSelectedFlashcardTopic(e.target.value)}
                  >
                    <option>React 18 &amp; Hooks</option>
                    <option>Python Data Science &amp; Pandas</option>
                    <option>Java OOP &amp; JVM Internals</option>
                    <option>Data Structures &amp; Algorithms</option>
                    <option>Node.js &amp; Backend Architecture</option>
                    <option>Machine Learning &amp; Neural Networks</option>
                    <option>UI/UX Design Patterns</option>
                    <option>AWS Cloud Services</option>
                    <option>System Design &amp; Databases</option>
                    <option>Custom Topic Input</option>
                  </select>

                  {selectedFlashcardTopic === "Custom Topic Input" && (
                    <input
                      type="text"
                      className="fcTopicInput"
                      placeholder="Enter topic name (e.g. Docker, Redux, PostgreSQL)..."
                      style={{ width: "100%", padding: "8px 12px", fontSize: "12px" }}
                      value={customFlashcardTopic}
                      onChange={(e) => setCustomFlashcardTopic(e.target.value)}
                    />
                  )}
                </div>

                {/* Controls Row */}
                <div className="fcControlsGrid">
                  <div className="fcControlGroup">
                    <label>Number of Cards <FaInfoCircle className="fcInfoIcon" /></label>
                    <div className="fcCounterRow">
                      <button className="fcCounterBtn" onClick={() => setNumCards(Math.max(1, numCards - 1))}><FaMinus /></button>
                      <span className="fcCounterVal">{numCards}</span>
                      <button className="fcCounterBtn" onClick={() => setNumCards(Math.min(50, numCards + 1))}><FaPlus /></button>
                    </div>
                    <small className="fcRecommended">Recommended: 8-15</small>
                  </div>

                  <div className="fcControlGroup">
                    <label>Difficulty Level</label>
                    <select className="fcSelect" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>

                  <div className="fcControlGroup">
                    <label>Question Type</label>
                    <select className="fcSelect" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                      <option>Conceptual</option>
                      <option>Factual</option>
                      <option>Application</option>
                      <option>Mixed</option>
                    </select>
                  </div>
                </div>

                {/* AI Explanations Toggle */}
                <div className="fcToggleRow">
                  <div className="fcToggleInfo">
                    <span>AI Explanations <FaInfoCircle className="fcInfoIcon" /></span>
                    <small>Add explanations for better understanding</small>
                  </div>
                  <div
                    className={`fcToggleSwitch ${aiExplanations ? "on" : "off"}`}
                    onClick={() => setAiExplanations(!aiExplanations)}
                  >
                    <div className="fcToggleKnob"></div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  className="fcGenerateBtn"
                  onClick={handleGenerateFlashcards}
                  disabled={isGeneratingCards}
                >
                  {isGeneratingCards ? (
                    <><FaSpinner className="spinIcon" /> Generating...</>
                  ) : (
                    <>✦ Generate Flashcards</>
                  )}
                </button>

                {/* Security Notice */}
                <p className="fcSecurityNote"><FaLock /> Your data is secure and never shared.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          8. INTERVIEW PREP MODAL (Matching Image 4)
      ══════════════════════════════════════════════════════ */}
      {activeModal === "interview-prep" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer ipModal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ipModalHeader">
              <div className="ipModalTitleRow">
                <div className="ipModalIcon">✦</div>
                <div>
                  <h3>Interview Prep</h3>
                  <p>Prepare, practice and ace your interviews with AI-powered tools.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            {/* Body */}
            <div className="ipModalBody">

              {/* LEFT: Practice Type Selection */}
              <div className="ipLeftPanel">
                <p className="ipPanelTitle">Choose a Practice Type</p>
                <div className="ipPracticeList">
                  {interviewPracticeTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`ipPracticeItem ${interviewPracticeType === type.id ? "active" : ""}`}
                      onClick={() => setInterviewPracticeType(type.id)}
                    >
                      <div className={`ipPracticeIcon ${interviewPracticeType === type.id ? "active" : ""}`}>
                        {type.icon}
                      </div>
                      <div>
                        <strong>{type.label}</strong>
                        <span>{type.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upgrade Banner */}
                <div className="ipUpgradeBanner">
                  <div className="ipUpgradeContent">
                    <FaCrown color="#F59E0B" />
                    <div>
                      <strong>Upgrade to Pro</strong>
                      <p>Unlock unlimited mocks, AI evaluation, resume score &amp; more!</p>
                    </div>
                  </div>
                  <button className="ipUpgradeBtn" onClick={() => setActiveModal("upgrade")}>
                    🔥 Upgrade Now
                  </button>
                </div>
              </div>

              {/* RIGHT: Configuration Panel */}
              <div className="ipRightPanel">

                {interviewPracticeType === "mock" && (
                  <div className="ipConfigArea">
                    <div className="ipConfigHeader">
                      <h4>Mock Interview <FaInfoCircle className="ipInfoIcon" /></h4>
                      <p>Select role, difficulty and get matched with AI interviewer.</p>
                    </div>

                    {/* Job Role & Experience Level */}
                    <div className="ipSelectRow">
                      <div className="ipSelectGroup">
                        <label>Job Role</label>
                        <select className="ipSelect" value={jobRole} onChange={(e) => setJobRole(e.target.value)}>
                          <option>Frontend Developer</option>
                          <option>Backend Developer</option>
                          <option>Full Stack Developer</option>
                          <option>Data Scientist</option>
                          <option>DevOps Engineer</option>
                          <option>UI/UX Designer</option>
                          <option>Product Manager</option>
                        </select>
                      </div>
                      <div className="ipSelectGroup">
                        <label>Experience Level</label>
                        <select className="ipSelect" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                          <option>0-1 Years</option>
                          <option>1-2 Years</option>
                          <option>2-4 Years</option>
                          <option>4-6 Years</option>
                          <option>6+ Years</option>
                        </select>
                      </div>
                    </div>

                    {/* Difficulty Level */}
                    <div className="ipFieldGroup">
                      <label>Difficulty Level</label>
                      <div className="ipButtonGroup">
                        {["Easy", "Medium", "Hard"].map((d) => (
                          <button
                            key={d}
                            className={`ipOptionBtn ${interviewDifficulty === d ? "active" : ""}`}
                            onClick={() => setInterviewDifficulty(d)}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interview Type */}
                    <div className="ipFieldGroup">
                      <label>Interview Type</label>
                      <div className="ipButtonGroup">
                        {["Technical", "HR / Behavioral", "Mixed"].map((t) => (
                          <button
                            key={t}
                            className={`ipOptionBtn ${interviewType === t ? "active" : ""}`}
                            onClick={() => setInterviewType(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* What you'll get */}
                    <div className="ipBenefitsList">
                      <p className="ipBenefitsTitle">What you'll get</p>
                      {[
                        "Real-time conversation with AI interviewer",
                        "Personalized questions based on your profile",
                        "Detailed feedback and improvement tips",
                        "Performance report & readiness score"
                      ].map((benefit, i) => (
                        <div key={i} className="ipBenefitItem">
                          <FaCheckCircle className="ipCheckIcon" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI Interviewer Row + Start Button */}
                    <div className="ipStartRow">
                      <div className="ipAIInterviewerBadge">
                        <div className="ipAIAvatar">🤖</div>
                        <div>
                          <strong>AI Interviewer</strong>
                          <span>Powered by advanced AI models</span>
                        </div>
                      </div>
                      <button
                        className="ipStartBtn"
                        onClick={handleStartInterview}
                        disabled={isStartingInterview}
                      >
                        {isStartingInterview ? (
                          <><FaSpinner className="spinIcon" /> Starting...</>
                        ) : (
                          <>Start Mock Interview →</>
                        )}
                      </button>
                    </div>

                    <div className="ipDurationNote">Duration: 45-60 minutes</div>
                  </div>
                )}

                {interviewPracticeType === "question" && (
                  <div className="ipConfigArea ipGenericConfig">
                    <div className="ipGenericIcon">❓</div>
                    <h4>Question Practice</h4>
                    <p>Access our vast question bank with thousands of real interview questions across topics and difficulty levels.</p>
                    <button className="ipStartBtn" onClick={() => { handleSend("Start question practice for " + jobRole); closeModal(); }}>
                      Start Practice →
                    </button>
                  </div>
                )}

                {interviewPracticeType === "behavioral" && (
                  <div className="ipConfigArea ipGenericConfig">
                    <div className="ipGenericIcon">🧠</div>
                    <h4>Behavioral Prep</h4>
                    <p>Master the STAR method and ace behavioral questions with our AI-guided coaching sessions.</p>
                    <button className="ipStartBtn" onClick={() => { handleSend("Start behavioral interview prep"); closeModal(); }}>
                      Start Behavioral Prep →
                    </button>
                  </div>
                )}

                {interviewPracticeType === "resume" && (
                  <div className="ipConfigArea ipGenericConfig">
                    <div className="ipGenericIcon">📄</div>
                    <h4>Resume Review</h4>
                    <p>Get detailed AI feedback on your resume with actionable improvement suggestions and ATS optimization tips.</p>
                    <button className="ipStartBtn" onClick={() => navigate("/resume")}>
                      Go to Resume Builder →
                    </button>
                  </div>
                )}

                {interviewPracticeType === "company" && (
                  <div className="ipConfigArea ipGenericConfig">
                    <div className="ipGenericIcon">🏢</div>
                    <h4>Company Interview</h4>
                    <p>Practice company-specific interview questions tailored to Google, Amazon, Microsoft, and 500+ more companies.</p>
                    <button className="ipStartBtn" onClick={() => { handleSend("Start company-specific interview practice"); closeModal(); }}>
                      Choose Company →
                    </button>
                  </div>
                )}

                {interviewPracticeType === "coding" && (
                  <div className="ipConfigArea ipGenericConfig">
                    <div className="ipGenericIcon">💻</div>
                    <h4>Coding Interview</h4>
                    <p>Sharpen your DSA skills with timed coding challenges, live code execution, and AI-powered hints.</p>
                    <button className="ipStartBtn" onClick={() => navigate("/code-arena")}>
                      Go to Code Arena →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="ipSecurityNote"><FaLock /> Your data is secure and never shared.</div>
          </div>
        </div>
      )}

      {/* 9. STUDY PLAN MODAL */}
      {activeModal === "study-plan" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer snModal" onClick={(e) => e.stopPropagation()}>
            <div className="snModalHeader">
              <div className="snModalTitleRow">
                <div className="snModalIcon">📅</div>
                <div>
                  <h3>Personalized AI Study Plan</h3>
                  <p>Generate a structured learning roadmap for any course or subject.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            <div className="snModalBody">
              <div className="snLeftPanel">
                <div className="snPanelHeader">
                  <span className="snPanelTitle">Target Subject / Goal</span>
                </div>
                <input
                  type="text"
                  className="modalSelect"
                  style={{ width: "100%", marginBottom: "16px" }}
                  value={studyPlanTopic}
                  onChange={(e) => setStudyPlanTopic(e.target.value)}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label className="modalLabel">Duration</label>
                    <select className="modalSelect" value={studyPlanDuration} onChange={(e) => setStudyPlanDuration(e.target.value)}>
                      <option>7 Days Sprint</option>
                      <option>14 Days Intensive</option>
                      <option>30 Days</option>
                      <option>60 Days FAANG Mastery</option>
                    </select>
                  </div>
                  <div>
                    <label className="modalLabel">Daily Hours</label>
                    <select className="modalSelect" value={studyPlanHours} onChange={(e) => setStudyPlanHours(e.target.value)}>
                      <option>1 Hour / Day</option>
                      <option>2 Hours / Day</option>
                      <option>4 Hours / Day</option>
                    </select>
                  </div>
                </div>

                <button
                  className="snGenerateBtn"
                  onClick={() => {
                    setIsGeneratingPlan(true);
                    setTimeout(() => {
                      setIsGeneratingPlan(false);
                      setToastMessage("✨ Study Plan Generated & Added to Schedule!");
                      setTimeout(() => setToastMessage(""), 4000);
                    }, 1200);
                  }}
                  disabled={isGeneratingPlan}
                >
                  {isGeneratingPlan ? <><FaSpinner className="spinIcon" /> Generating Plan...</> : "✨ Generate AI Study Plan"}
                </button>
              </div>

              <div className="snRightPanel">
                <div className="snRightTitleRow">
                  <span className="snPanelTitle">AI Generated Roadmap ({studyPlanDuration})</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px", overflowY: "auto" }}>
                  {generatedStudyPlan.map((step, idx) => (
                    <div key={idx} style={{ background: isDarkMode ? "#1E293B" : "#FFFBF7", border: "1px solid #CBD5E1", borderRadius: "12px", padding: "14px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 800, color: "#F9572A", marginBottom: "4px" }}>{step.day}</div>
                      <strong style={{ fontSize: "13px", color: isDarkMode ? "#F8FAFC" : "#1E1B18", display: "block", marginBottom: "8px" }}>{step.title}</strong>
                      <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: isDarkMode ? "#94A3B8" : "#64748B" }}>
                        {step.tasks.map((task, tIdx) => (
                          <li key={tIdx} style={{ marginBottom: "4px" }}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. GENERATE NOTES MODAL */}
      {activeModal === "generate-notes" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer snModal" onClick={(e) => e.stopPropagation()}>
            <div className="snModalHeader">
              <div className="snModalTitleRow">
                <div className="snModalIcon">📝</div>
                <div>
                  <h3>Generate Study Notes</h3>
                  <p>Create instant, high-yield summary notes for any lecture or topic.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            <div className="snModalBody">
              <div className="snLeftPanel">
                <div className="snPanelHeader">
                  <span className="snPanelTitle">Select Subject &amp; Topic</span>
                </div>

                <label className="modalLabel" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>🎯 Target Topic:</label>
                <select
                  className="modalSelect"
                  style={{ width: "100%", marginBottom: genNotesTopicSelect === "Custom Topic Input" ? "8px" : "16px" }}
                  value={genNotesTopicSelect}
                  onChange={(e) => {
                    setGenNotesTopicSelect(e.target.value);
                    if (e.target.value !== "Custom Topic Input") {
                      setGenNotesTopic(e.target.value);
                    }
                  }}
                >
                  <option>React Virtual DOM &amp; Reconciliation</option>
                  <option>Python Data Science &amp; Pandas DataFrames</option>
                  <option>Java Spring Boot Microservices Architecture</option>
                  <option>DSA Binary Search Trees &amp; Dynamic Programming</option>
                  <option>System Design REST APIs &amp; Microservices</option>
                  <option>Node.js Asynchronous Event Loop</option>
                  <option>AWS Cloud Serverless Architecture</option>
                  <option>Custom Topic Input</option>
                </select>

                {genNotesTopicSelect === "Custom Topic Input" && (
                  <input
                    type="text"
                    className="modalSelect"
                    placeholder="Enter custom topic (e.g. Docker, GraphQL, Kubernetes)..."
                    style={{ width: "100%", marginBottom: "16px" }}
                    value={genNotesTopic}
                    onChange={(e) => setGenNotesTopic(e.target.value)}
                  />
                )}

                <label className="modalLabel">Note Format Style</label>
                <select className="modalSelect" value={genNotesStyle} onChange={(e) => setGenNotesStyle(e.target.value)} style={{ width: "100%", marginBottom: "16px" }}>
                  <option>Key Bullet Points</option>
                  <option>Deep Dive Article</option>
                  <option>Exam Cheat Sheet</option>
                  <option>QA Review Format</option>
                </select>

                <button
                  className="snGenerateBtn"
                  onClick={async () => {
                    setIsGeneratingGenNotes(true);
                    const topicToUse = genNotesTopicSelect === "Custom Topic Input" ? (genNotesTopic || "Selected Topic") : genNotesTopicSelect;
                    try {
                      const prompt = `Generate high-yield study notes for topic "${topicToUse}" in style "${genNotesStyle}". Format clearly with headers, bullet points, and code examples if applicable.`;
                      const aiRes = await askGeminiAI(prompt);
                      setGeneratedGenNotesText(aiRes.text);
                      setToastMessage(`📝 Notes Generated for ${topicToUse}!`);
                      setTimeout(() => setToastMessage(""), 4000);
                    } catch (e) {
                      setGeneratedGenNotesText(`📌 Study Notes: ${topicToUse}\n\n1. Core Concepts: Understanding ${topicToUse}.\n2. Implementation: Apply clean architecture principles.`);
                    } finally {
                      setIsGeneratingGenNotes(false);
                    }
                  }}
                  disabled={isGeneratingGenNotes}
                >
                  {isGeneratingGenNotes ? <><FaSpinner className="spinIcon" /> Generating Notes...</> : "✨ Generate Notes"}
                </button>
              </div>

              <div className="snRightPanel">
                <div className="snRightTitleRow">
                  <span className="snPanelTitle">AI Generated Study Notes</span>
                  <button className="btnCopyCode" onClick={() => handleCopyCode(generatedGenNotesText)}>
                    <FaCopy /> Copy Notes
                  </button>
                </div>

                <div style={{ background: isDarkMode ? "#1E293B" : "#FAF8F5", border: "1px solid #CBD5E1", borderRadius: "12px", padding: "16px", whiteSpace: "pre-wrap", fontSize: "12px", color: isDarkMode ? "#F8FAFC" : "#1E1B18", minHeight: "260px" }}>
                  {generatedGenNotesText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. PRACTICE QUIZ & GEMINI CODE EXPLAINER MODAL */}
      {activeModal === "practice-quiz" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer snModal" style={{ maxWidth: "720px" }} onClick={(e) => e.stopPropagation()}>
            <div className="snModalHeader">
              <div className="snModalTitleRow">
                <div className="snModalIcon">🎯</div>
                <div>
                  <h3>Practice Quiz &amp; Gemini Code Explainer</h3>
                  <p>Generate topic quizzes or paste any code snippet to receive line-by-line Gemini AI explanations.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #CBD5E1", padding: "12px 24px 0" }}>
              <button
                onClick={() => setQuizModalTab("quiz")}
                style={{
                  padding: "8px 18px",
                  borderRadius: "12px 12px 0 0",
                  fontSize: "13px",
                  fontWeight: 800,
                  border: "none",
                  background: quizModalTab === "quiz" ? "#F9572A" : "transparent",
                  color: quizModalTab === "quiz" ? "#FFFFFF" : (isDarkMode ? "#94A3B8" : "#64748B"),
                  cursor: "pointer"
                }}
              >
                🎯 Quiz Challenge Generator
              </button>
              <button
                onClick={() => setQuizModalTab("explain")}
                style={{
                  padding: "8px 18px",
                  borderRadius: "12px 12px 0 0",
                  fontSize: "13px",
                  fontWeight: 800,
                  border: "none",
                  background: quizModalTab === "explain" ? "#F9572A" : "transparent",
                  color: quizModalTab === "explain" ? "#FFFFFF" : (isDarkMode ? "#94A3B8" : "#64748B"),
                  cursor: "pointer"
                }}
              >
                💡 Gemini Code Explainer
              </button>
            </div>

            <div className="modalBody" style={{ padding: "20px 24px" }}>
              {quizModalTab === "quiz" ? (
                <>
                  <label className="modalLabel">Select Track / Topic:</label>
                  <select className="modalSelect" value={quizTrackSelect} onChange={(e) => setQuizTrackSelect(e.target.value)}>
                    <option>React &amp; Web Development</option>
                    <option>Python Data Science</option>
                    <option>JavaScript Fundamentals</option>
                    <option>Data Structures &amp; Algorithms</option>
                    <option>Node.js &amp; Microservices</option>
                  </select>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                    <div>
                      <label className="modalLabel">Question Count:</label>
                      <select className="modalSelect" value={quizLengthSelect} onChange={(e) => setQuizLengthSelect(e.target.value)}>
                        <option>5 Questions</option>
                        <option>10 Questions</option>
                        <option>20 Questions</option>
                      </select>
                    </div>
                    <div>
                      <label className="modalLabel">Difficulty:</label>
                      <select className="modalSelect" value={quizDiffSelect} onChange={(e) => setQuizDiffSelect(e.target.value)}>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="btnConfirmPro"
                    style={{ marginTop: "20px" }}
                    onClick={handleStartPracticeQuizFromModal}
                  >
                    🚀 Start Interactive AI Quiz Challenge →
                  </button>
                </>
              ) : (
                <>
                  <label className="modalLabel">Paste Any Code Snippet Below:</label>
                  <textarea
                    style={{
                      width: "100%",
                      height: "170px",
                      fontFamily: "Fira Code, monospace",
                      fontSize: "12px",
                      background: "#0F172A",
                      color: "#38BDF8",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "14px",
                      outline: "none",
                      resize: "none",
                      marginBottom: "16px"
                    }}
                    placeholder="Paste code (e.g., JavaScript, Python, Java, C++, SQL, React)..."
                    value={codeExplainInput}
                    onChange={(e) => setCodeExplainInput(e.target.value)}
                  />

                  <button
                    className="btnConfirmPro"
                    onClick={() => {
                      if (!codeExplainInput.trim()) return;
                      closeModal();
                      handleSend(`Explain the following code step-by-step like Gemini AI, including line-by-line breakdown, time/space complexity, and clean code tips:\n\n\`\`\`\n${codeExplainInput}\n\`\`\``);
                    }}
                  >
                    ✨ Explain Code with Gemini AI →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 12. CODE PLAYGROUND MULTI-LANGUAGE SANDBOX MODAL */}
      {activeModal === "code-playground" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer snModal" style={{ maxWidth: "880px" }} onClick={(e) => e.stopPropagation()}>
            <div className="snModalHeader">
              <div className="snModalTitleRow">
                <div className="snModalIcon">💻</div>
                <div>
                  <h3>Code Playground &amp; Sandbox</h3>
                  <p>Write, compile and test code in multiple programming languages instantly.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px 24px" }}>
              {/* Language Selector Tabs */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderBottom: "1px solid #CBD5E1", paddingBottom: "12px" }}>
                {[
                  { id: "javascript", name: "JavaScript / Node" },
                  { id: "python", name: "Python 3" },
                  { id: "html", name: "HTML / CSS Web" },
                  { id: "java", name: "Java" },
                  { id: "cpp", name: "C++" },
                  { id: "sql", name: "SQL Database" }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setPlaygroundLang(lang.id)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 800,
                      border: playgroundLang === lang.id ? "1px solid #F9572A" : "1px solid #CBD5E1",
                      background: playgroundLang === lang.id ? "#F9572A" : (isDarkMode ? "#1E293B" : "#FFFFFF"),
                      color: playgroundLang === lang.id ? "#FFFFFF" : (isDarkMode ? "#F8FAFC" : "#1E1B18"),
                      cursor: "pointer"
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              {/* Code Editor */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: isDarkMode ? "#F8FAFC" : "#1E1B18" }}>
                    Editor ({playgroundLang.toUpperCase()})
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btnCopyCode" onClick={() => setPlaygroundOutput("")}>
                      🗑️ Clear Terminal
                    </button>
                    <button className="btnCopyCode" onClick={() => handleCopyCode(playgroundCode[playgroundLang])}>
                      <FaCopy /> Copy Code
                    </button>
                  </div>
                </div>
                <textarea
                  style={{
                    width: "100%",
                    height: "170px",
                    fontFamily: "Fira Code, monospace",
                    fontSize: "13px",
                    background: "#0F172A",
                    color: "#38BDF8",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "14px",
                    outline: "none",
                    resize: "none"
                  }}
                  value={playgroundCode[playgroundLang]}
                  onChange={(e) => setPlaygroundCode({ ...playgroundCode, [playgroundLang]: e.target.value })}
                />
              </div>

              {/* Action Bar */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleRunPlaygroundCode}
                  disabled={isRunningCode}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "99px",
                    background: "#10B981",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {isRunningCode ? <FaSpinner className="spinIcon" /> : <FaPlay />} Run Code ▶
                </button>

                <button
                  onClick={async () => {
                    setIsRunningCode(true);
                    setPlaygroundOutput("🧠 Analyzing code with Gemini AI...");
                    try {
                      const codeStr = playgroundCode[playgroundLang];
                      const res = await askGeminiAI(`Explain the following ${playgroundLang} code clearly like Gemini. Provide overview, line-by-line breakdown, and time/space complexity:\n\n\`\`\`${playgroundLang}\n${codeStr}\n\`\`\``);
                      setPlaygroundOutput(res.text);
                    } catch (e) {
                      setPlaygroundOutput(`📌 Code Explanation for ${playgroundLang}:\n- Purpose: Modular code execution.\n- Time Complexity: O(N)\n- Space Complexity: O(1)`);
                    } finally {
                      setIsRunningCode(false);
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "99px",
                    background: "linear-gradient(135deg, #F9572A, #FF8C69)",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  ✨ Explain Code with AI
                </button>

                <button
                  onClick={() => handleCopyCode(playgroundCode[playgroundLang])}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "99px",
                    background: "transparent",
                    color: isDarkMode ? "#F8FAFC" : "#1E1B18",
                    border: "1px solid #CBD5E1",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Copy Code
                </button>
              </div>

              {/* Terminal Execution Output & Live HTML Web Preview */}
              {playgroundLang === "html" ? (
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: isDarkMode ? "#F8FAFC" : "#1E1B18", display: "block", marginBottom: "6px" }}>🌐 Live HTML/CSS Interactive Preview</span>
                  <iframe
                    title="Live Web Preview"
                    srcDoc={playgroundCode.html}
                    style={{
                      width: "100%",
                      height: "170px",
                      background: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      borderRadius: "12px"
                    }}
                  />
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: isDarkMode ? "#F8FAFC" : "#1E1B18", display: "block", marginBottom: "6px" }}>Terminal Console / AI Output</span>
                  <div style={{ background: "#05060B", border: "1px solid #1E293B", borderRadius: "12px", padding: "14px", fontFamily: "monospace", fontSize: "12px", color: "#10B981", minHeight: "100px", maxHeight: "200px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
                    {playgroundOutput || "Click '▶ Run Code' or '✨ Explain Code with AI' to execute code and view output."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 13. RICH INTERACTIVE MIND MAP MODAL */}
      {activeModal === "mind-map" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer snModal" style={{ maxWidth: "940px" }} onClick={(e) => e.stopPropagation()}>
            <div className="snModalHeader">
              <div className="snModalTitleRow">
                <div className="snModalIcon">🗺️</div>
                <div>
                  <h3>Interactive AI Mind Map</h3>
                  <p>Visualize concepts, relationships and dependencies in interactive node trees.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            <div className="snModalBody">
              {/* Left Settings Panel */}
              <div className="snLeftPanel" style={{ width: "36%", minWidth: "280px" }}>
                <div className="snPanelHeader">
                  <span className="snPanelTitle">Select Mind Map Topic</span>
                </div>

                <label className="modalLabel" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>🎯 Target Topic:</label>
                <select
                  className="modalSelect"
                  style={{ width: "100%", marginBottom: mindMapTopicSelect === "Custom Topic Input" ? "8px" : "16px" }}
                  value={mindMapTopicSelect}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setMindMapTopicSelect(selected);
                    if (selected !== "Custom Topic Input") {
                      setMindMapTopic(selected);
                      setMindMapNodes(getMindMapNodesForTopic(selected));
                    }
                  }}
                >
                  <option>React 18 &amp; Component Architecture</option>
                  <option>Python Data Science Ecosystem</option>
                  <option>Fullstack Web Development Roadmap</option>
                  <option>Data Structures &amp; Algorithms Hierarchy</option>
                  <option>Microservices &amp; System Design</option>
                  <option>Cloud Computing AWS Infrastructure</option>
                  <option>Cybersecurity &amp; Ethical Hacking</option>
                  <option>Custom Topic Input</option>
                </select>

                {mindMapTopicSelect === "Custom Topic Input" && (
                  <input
                    type="text"
                    className="modalSelect"
                    placeholder="Type custom topic (e.g. Kotlin, Machine Learning)..."
                    style={{ width: "100%", marginBottom: "16px" }}
                    value={mindMapTopic}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMindMapTopic(val);
                      setMindMapNodes(getMindMapNodesForTopic(val));
                    }}
                  />
                )}

                <label className="modalLabel">Topic Depth Level</label>
                <select className="modalSelect" value={mindMapDepth} onChange={(e) => setMindMapDepth(e.target.value)} style={{ width: "100%", marginBottom: "16px" }}>
                  <option>Overview (3 Levels)</option>
                  <option>Detailed (5 Levels)</option>
                  <option>Deep Dive (Full Tree)</option>
                </select>

                <button
                  className="snGenerateBtn"
                  onClick={() => {
                    setIsGeneratingMindMap(true);
                    const topicToUse = mindMapTopicSelect === "Custom Topic Input" ? (mindMapTopic || "Selected Topic") : mindMapTopicSelect;
                    setMindMapTopic(topicToUse);
                    setTimeout(() => {
                      setIsGeneratingMindMap(false);
                      setMindMapNodes(getMindMapNodesForTopic(topicToUse));
                      setToastMessage(`🗺️ Mind Map Generated for ${topicToUse}!`);
                      setTimeout(() => setToastMessage(""), 4000);
                    }, 800);
                  }}
                  disabled={isGeneratingMindMap}
                >
                  {isGeneratingMindMap ? <><FaSpinner className="spinIcon" /> Building Nodes...</> : "✨ Generate Mind Map"}
                </button>
              </div>

              {/* Right Interactive Visual Tree Panel */}
              <div className="snRightPanel" style={{ flex: 1, minWidth: 0 }}>
                <div className="snRightTitleRow">
                  <span className="snPanelTitle">Node Graph ({mindMapTopic})</span>
                  <button className="btnCopyCode" onClick={() => handleCopyCode(JSON.stringify(mindMapNodes, null, 2))}>
                    <FaCopy /> Export Tree
                  </button>
                </div>

                <div style={{ background: isDarkMode ? "#0F172A" : "#F8FAFC", border: isDarkMode ? "1px solid #334155" : "1px solid #E2E8F0", borderRadius: "16px", padding: "16px", minHeight: "320px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {mindMapNodes.map((node) => (
                    <div
                      key={node.id}
                      style={{
                        marginLeft: node.parent ? "24px" : "0px",
                        padding: "12px 18px",
                        borderRadius: "14px",
                        background: isDarkMode ? "#1E293B" : "#FFFFFF",
                        borderLeft: `5px solid ${node.color}`,
                        boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 14px rgba(0,0,0,0.05)",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: isDarkMode ? "#F8FAFC" : "#1E1B18",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>{node.label}</span>
                      <span style={{ fontSize: "10px", fontWeight: 800, background: "rgba(255,255,255,0.08)", padding: "3px 10px", borderRadius: "99px", color: node.color, border: `1px solid ${node.color}` }}>
                        {node.parent ? `Child of Node #${node.parent}` : "Root Node"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. RICH INTERACTIVE CONCEPT DIAGRAM MODAL */}
      {activeModal === "concept-diagram" && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContainer snModal" style={{ maxWidth: "940px" }} onClick={(e) => e.stopPropagation()}>
            <div className="snModalHeader">
              <div className="snModalTitleRow">
                <div className="snModalIcon">📐</div>
                <div>
                  <h3>Architectural Concept Diagram</h3>
                  <p>Generate system architecture flowcharts, microservices pipelines and API diagrams.</p>
                </div>
              </div>
              <button className="modalCloseBtn" onClick={closeModal}><FaTimes /></button>
            </div>

            <div className="snModalBody">
              {/* Left Settings Panel */}
              <div className="snLeftPanel" style={{ width: "36%", minWidth: "280px" }}>
                <div className="snPanelHeader">
                  <span className="snPanelTitle">Select Diagram Topic</span>
                </div>

                <label className="modalLabel" style={{ fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "4px" }}>🎯 Target Topic:</label>
                <select
                  className="modalSelect"
                  style={{ width: "100%", marginBottom: conceptDiagramTopicSelect === "Custom Topic Input" ? "8px" : "16px" }}
                  value={conceptDiagramTopicSelect}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setConceptDiagramTopicSelect(selected);
                    if (selected !== "Custom Topic Input") {
                      setConceptDiagramTopic(selected);
                      setDiagramSteps(getDiagramStepsForTopic(selected));
                    }
                  }}
                >
                  <option>Microservices &amp; REST API Architecture</option>
                  <option>React Component Lifecycle &amp; Hooks</option>
                  <option>OAuth 2.0 Auth Flow &amp; JWT Security</option>
                  <option>Database Transaction &amp; WAL Persistence</option>
                  <option>CI/CD Automated Deployment Pipeline</option>
                  <option>AI Model Training &amp; Evaluation Flow</option>
                  <option>Custom Topic Input</option>
                </select>

                {conceptDiagramTopicSelect === "Custom Topic Input" && (
                  <input
                    type="text"
                    className="modalSelect"
                    placeholder="Type custom topic (e.g. WebSockets, Kafka)..."
                    style={{ width: "100%", marginBottom: "16px" }}
                    value={conceptDiagramTopic}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConceptDiagramTopic(val);
                      setDiagramSteps(getDiagramStepsForTopic(val));
                    }}
                  />
                )}

                <label className="modalLabel">Diagram Pattern Type</label>
                <select className="modalSelect" value={conceptDiagramType} onChange={(e) => setConceptDiagramType(e.target.value)} style={{ width: "100%", marginBottom: "16px" }}>
                  <option>System Architecture Flow</option>
                  <option>Component Hierarchy Tree</option>
                  <option>Data Pipeline Sequence</option>
                  <option>Microservices Mesh</option>
                </select>

                <button
                  className="snGenerateBtn"
                  onClick={() => {
                    setIsGeneratingDiagram(true);
                    const topicToUse = conceptDiagramTopicSelect === "Custom Topic Input" ? (conceptDiagramTopic || "Selected Topic") : conceptDiagramTopicSelect;
                    setConceptDiagramTopic(topicToUse);
                    setTimeout(() => {
                      setIsGeneratingDiagram(false);
                      setDiagramSteps(getDiagramStepsForTopic(topicToUse));
                      setToastMessage(`📐 Diagram Generated for ${topicToUse}!`);
                      setTimeout(() => setToastMessage(""), 4000);
                    }, 800);
                  }}
                  disabled={isGeneratingDiagram}
                >
                  {isGeneratingDiagram ? <><FaSpinner className="spinIcon" /> Rendering Diagram...</> : "📐 Generate Concept Diagram"}
                </button>
              </div>

              {/* Right Flowchart Flow Panel */}
              <div className="snRightPanel" style={{ flex: 1, minWidth: 0 }}>
                <div className="snRightTitleRow">
                  <span className="snPanelTitle">Pipeline Flow ({conceptDiagramType})</span>
                  <button className="btnCopyCode" onClick={() => handleCopyCode(JSON.stringify(diagramSteps, null, 2))}>
                    <FaCopy /> Download Schema
                  </button>
                </div>

                <div style={{ background: isDarkMode ? "#0F172A" : "#F8FAFC", border: isDarkMode ? "1px solid #334155" : "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", minHeight: "320px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {diagramSteps.map((step, idx) => (
                    <React.Fragment key={step.step}>
                      <div
                        style={{
                          background: isDarkMode ? "#1E293B" : "#FFFFFF",
                          border: isDarkMode ? "1px solid #334155" : "1px solid #E2E8F0",
                          borderRadius: "14px",
                          padding: "14px 18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.25)" : "0 4px 14px rgba(0,0,0,0.04)"
                        }}
                      >
                        <div style={{ paddingRight: "12px" }}>
                          <strong style={{ fontSize: "14px", color: isDarkMode ? "#F8FAFC" : "#1E1B18", display: "block", marginBottom: "4px" }}>{step.title}</strong>
                          <span style={{ fontSize: "11px", color: isDarkMode ? "#94A3B8" : "#64748B", lineHeight: "1.4" }}>{step.desc}</span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 800, background: isDarkMode ? "rgba(249,87,42,0.18)" : "#FFF0EB", color: "#F9572A", padding: "5px 12px", borderRadius: "99px", flexShrink: 0, border: "1px solid rgba(249,87,42,0.3)" }}>
                          {step.badge}
                        </span>
                      </div>

                      {idx < diagramSteps.length - 1 && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", margin: "2px 0" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "#F9572A", background: isDarkMode ? "rgba(249,87,42,0.15)" : "#FFF0EB", padding: "4px 14px", borderRadius: "99px", border: "1px solid rgba(249,87,42,0.3)" }}>
                            ⚡ HTTP / gRPC Data Stream ↓
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingChatbot />
      <StudentFooter />
    </div>
  );
}

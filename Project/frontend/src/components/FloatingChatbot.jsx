import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppLogo from "./AppLogo";
import { FaBookOpen, FaStar, FaUsers, FaPaperPlane, FaMinus, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { askGeminiAI } from "../services/geminiService";
import FormattedMessage from "./FormattedMessage";
import "../styles/floatingChatbot.css";

export default function FloatingChatbot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hello! Welcome to SkillSphere. I am SphereAI, your AI virtual assistant. Ask me anything about SkillSphere, programming, science, math, or general knowledge! 👋"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const getDynamicSkillSphereReply = (queryText) => {
    const q = queryText.toLowerCase().trim();

    // 1. Greetings ("hi", "hello", "hey", "greetings", etc.)
    const isGreeting = /^(hi|hello|hey|greetings|hola|namaste|hi there|hello there|good morning|good evening|good afternoon)(\s|!|\.|$)/i.test(q) || q === "hi" || q === "hello" || q === "hey";

    if (isGreeting) {
      return {
        text: "Hello! Welcome to SkillSphere. I'm SphereAI, your AI virtual assistant! 👋\n\nHow can I help you today? You can ask me about our 16+ tech courses, certificates, CodeArena battles, AI Study Buddy, resume builder, or any technical/programming question!"
      };
    }

    // 2. SkillSphere Platform Overview
    if (q.includes("skillsphere") || q.includes("what is this platform") || q.includes("about platform") || q.includes("what is skillsphere")) {
      return {
        text: "Hello! Welcome to SkillSphere.\n\nSkillSphere is a complete gamified learning ecosystem designed to accelerate your tech career! 🚀\n\n✨ Key Features:\n• 16+ Industry-Ready Tech Tracks (React, Python, Spring Boot, DSA, AI/ML, DevOps, Web3)\n• Gamified Engine: Earn XP, Maintain Streaks, Complete Daily Quests & Badges\n• CodeArena: Compete in real-time algorithmic battles & climb leaderboards\n• AI-Powered Resume Builder & Opportunity Feed for job discovery\n• Official Verifiable Certificates with Credential ID & LinkedIn integration"
      };
    }

    // 3. Courses / Learning Tracks / Unlock & Approval
    if (q.includes("course") || q.includes("enroll") || q.includes("pay") || q.includes("unlock") || q.includes("price") || q.includes("approval") || q.includes("admin approve") || q.includes("track")) {
      return {
        text: "SkillSphere features 16+ industry-aligned courses including React, Python, Node.js, Spring Boot, DSA, Web3, AWS, and GenAI!\n\n📌 How Course Unlocking & Access Works:\n1. Browse Courses & click 'Unlock Course'.\n2. Complete the checkout request.\n3. Admin verifies and unlocks the course in your dashboard instantly!",
        actionLabel: "📚 Browse All Courses",
        actionPath: "/courses"
      };
    }

    // 4. Certificates & Verification
    if (q.includes("certificat") || q.includes("credential") || q.includes("verify") || q.includes("download") || q.includes("earned")) {
      return {
        text: "Certificates on SkillSphere are issued upon completing course paths or scoring 85%+ on Track Quizzes!\n\n📜 Features:\n• Official Certificate of Completion with unique Credential ID\n• Canvas PNG High-Res Download\n• One-click LinkedIn Sharing\n• QR & Public Link Verification",
        actionLabel: "📜 View My Certificates",
        actionPath: "/certificates"
      };
    }

    // 5. XP, Points, Streaks, Levels, Quests
    if (q.includes("xp") || q.includes("point") || q.includes("streak") || q.includes("level") || q.includes("score") || q.includes("quest")) {
      return {
        text: "XP (Experience Points) power your SkillSphere rank and leaderboard level!\n\n⚡ How to Earn XP:\n• Complete Chapter Lessons: +100 to +250 XP\n• Quiz Questions: +15 XP per correct answer\n• Daily Login Streak: Multiplier XP bonuses\n• Daily Quests: +50 XP per task completed",
        actionLabel: "⚡ Check Daily Quests & XP",
        actionPath: "/daily-quests"
      };
    }

    // 6. Badges & Achievements
    if (q.includes("badge") || q.includes("trophy") || q.includes("achievement") || q.includes("reward")) {
      return {
        text: "SkillSphere features 11+ unlockable skill badges! Earn badges like React Master, Python Ninja, FAANG DSA Specialist, and Perfect Quizzer by scoring 85%+ on Track Assessments.",
        actionLabel: "🏆 View My Badges",
        actionPath: "/badges"
      };
    }

    // 7. CodeArena & Coding Battles
    if (q.includes("code arena") || q.includes("arena") || q.includes("battle") || q.includes("coding test") || q.includes("contest")) {
      return {
        text: "CodeArena is SkillSphere's competitive coding environment! Test your speed against algorithmic challenges, fix buggy code snippets, and climb global leaderboards.",
        actionLabel: "⚔️ Enter CodeArena",
        actionPath: "/code-arena"
      };
    }

    // 8. Live Sandbox / IDE
    if (q.includes("sandbox") || q.includes("compiler") || q.includes("ide") || q.includes("editor")) {
      return {
        text: "SkillSphere Live Sandbox is an in-browser code editor supporting HTML, CSS, JavaScript, and live iframe execution. Experiment with code without local setup!",
        actionLabel: "💻 Open Live Sandbox",
        actionPath: "/sandbox"
      };
    }

    // 9. Resume Builder & Jobs / Opportunities
    if (q.includes("resume") || q.includes("cv") || q.includes("job") || q.includes("opportunity") || q.includes("internship")) {
      return {
        text: "SkillSphere provides an AI-powered ATS Resume Builder for crafting tech resumes and an Opportunity Feed for discovering jobs, internships, hackathons, and freelance gigs!",
        actionLabel: "📄 Open Resume Builder",
        actionPath: "/resume"
      };
    }

    // 10. AI Study Buddy
    if (q.includes("study buddy") || q.includes("ai buddy") || q.includes("ai tutor") || q.includes("tutor")) {
      return {
        text: "AI Study Buddy is your 24/7 AI tutor on SkillSphere! Ask coding questions, get code reviews, generate flashcards, and get instant explanations.",
        actionLabel: "🤖 Open AI Study Buddy",
        actionPath: "/ai-buddy"
      };
    }

    // 11. Workforce / Team Space
    if (q.includes("workforce") || q.includes("team space") || q.includes("collaboration") || q.includes("teammate") || q.includes("team")) {
      return {
        text: "SkillSphere Workforce & Team Space enables teams to collaborate, track project progress, manage sprint tickets, and view team analytics.",
        actionLabel: "👥 Open Team Space",
        actionPath: "/team-space"
      };
    }

    // 12. Default SkillSphere Overview (Clean reply without "Go to Student Dashboard" button)
    return {
      text: "Hello! Welcome to SkillSphere.\n\nSkillSphere is a complete gamified learning ecosystem! You can learn 16+ tech tracks, earn certificates, practice with AI Study Buddy, compete in CodeArena, and build ATS resumes.\n\nHow can I guide your learning journey today?"
    };
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const qLower = text.toLowerCase().trim();
    const isGreeting = /^(hi|hello|hey|greetings|hola|namaste|hi there|hello there|good morning|good evening|good afternoon)(\s|!|\.|$)/i.test(qLower) || qLower === "hi" || qLower === "hello" || qLower === "hey";

    const platformReply = getDynamicSkillSphereReply(text);

    const isPlatformSpecific = isGreeting ||
      qLower.includes("skillsphere") || 
      qLower.includes("enroll") || 
      qLower.includes("course") ||
      qLower.includes("certificat") || 
      qLower.includes("badge") || 
      qLower.includes("xp") ||
      qLower.includes("resume") || 
      qLower.includes("code arena") ||
      qLower.includes("arena") ||
      qLower.includes("sandbox") ||
      qLower.includes("study buddy") ||
      qLower.includes("workforce") ||
      qLower.includes("team");

    if (isPlatformSpecific) {
      setTimeout(() => {
        const replyObj = typeof platformReply === "string" ? { text: platformReply } : platformReply;
        setMessages(prev => [...prev, { sender: "assistant", ...replyObj }]);
        setIsLoading(false);
      }, 350);
    } else {
      try {
        const aiRes = await askGeminiAI(text, { user });
        let responseText = aiRes.text;

        if (/^(hi|hello|hey|greetings|hola)(\s|!|\.|$)/i.test(qLower)) {
          responseText = `Hello! Welcome to SkillSphere.\n\n${responseText}`;
        }

        setMessages(prev => [
          ...prev,
          {
            sender: "assistant",
            text: responseText
          }
        ]);
      } catch (e) {
        setMessages(prev => [...prev, { sender: "assistant", text: platformReply.text }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const quickPrompts = [
    { text: "What is SkillSphere?", icon: <FaBookOpen /> },
    { text: "How to earn XP?", icon: <FaStar /> },
    { text: "How to manage teams?", icon: <FaUsers /> }
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={`floating-chat-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with SphereAI"
      >
        {isOpen ? <FaTimes /> : "🤖"}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="floating-chat-window">
          {/* Header */}
          <div className="chat-window-header">
            <div className="chat-header-title">
              <div className="chat-status-dot"></div>
              <AppLogo iconOnly height="26px" />
              <h4>
                SphereAI <span className="subtitleText">Virtual Assistant</span>
              </h4>
            </div>

            <div className="chat-header-actions">
              <button className="chat-action-btn" onClick={() => setIsOpen(false)} title="Minimize">
                <FaMinus />
              </button>
              <button className="chat-action-btn" onClick={() => setIsOpen(false)} title="Close">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages Log */}
          <div className="chat-window-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message-row ${msg.sender}`}>
                {msg.sender === "assistant" && (
                  <div className="assistantAvatarCircle">
                    🤖
                  </div>
                )}

                <div className={`chat-bubble-card ${msg.sender}`}>
                  <FormattedMessage text={msg.text} />
                  {msg.actionPath && (
                    <button
                      className="chatActionBtn"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(msg.actionPath);
                      }}
                      style={{
                        marginTop: "10px",
                        padding: "6px 14px",
                        borderRadius: "99px",
                        background: "#F9572A",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "inline-block"
                      }}
                    >
                      {msg.actionLabel || "Go to Page →"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message-row assistant">
                <div className="assistantAvatarCircle">🤖</div>
                <div className="chat-typing-indicator">
                  <div className="chat-typing-dot"></div>
                  <div className="chat-typing-dot"></div>
                  <div className="chat-typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="chat-window-hints">
            {quickPrompts.map((promptObj, i) => (
              <button
                key={i}
                className="chat-hint-chip-btn"
                onClick={() => handleSendMessage(promptObj.text)}
              >
                <span className="chipIcon">{promptObj.icon}</span>
                <span className="chipText">{promptObj.text}</span>
                <span className="chipArrow">&gt;</span>
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="chat-window-input-area">
            <input
              type="text"
              className="chat-window-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(input);
              }}
              disabled={isLoading}
            />

            <button
              className="chat-window-send"
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

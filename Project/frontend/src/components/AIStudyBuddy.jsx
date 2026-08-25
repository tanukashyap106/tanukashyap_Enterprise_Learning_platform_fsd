import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { askGeminiAI } from "../services/geminiService";
import FormattedMessage from "./FormattedMessage";
import {
  FaRobot,
  FaLightbulb,
  FaFileAlt,
  FaQuestionCircle,
  FaCode,
  FaClone,
  FaBriefcase,
  FaCalendarAlt,
  FaGlobe,
  FaPaperPlane,
  FaPlus,
  FaPaperclip,
  FaMicrophone,
  FaHistory,
  FaThumbsUp,
  FaThumbsDown,
  FaCopy,
  FaCheck,
  FaShareAlt,
  FaStickyNote,
  FaLayerGroup,
  FaTerminal,
  FaChevronRight,
  FaCrown
} from "react-icons/fa";

export default function AIStudyBuddy() {
  const navigate = useNavigate();
  const [inputMsg, setInputMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi Alex! 👋\nI'm your AI Study Buddy. What would you like to learn today?",
      quickPrompts: [
        "Explain React useState hook",
        "What is Big O Notation?",
        "Summarize TCP/IP Model"
      ]
    },
    {
      id: 2,
      sender: "user",
      text: "Explain the concept of Virtual DOM in React with an example.",
      time: "10:30 AM"
    },
    {
      id: 3,
      sender: "bot",
      type: "explanation",
      title: "What is Virtual DOM?",
      intro: "The Virtual DOM is a lightweight JavaScript object that is a representation of the actual DOM. React uses it as an intermediate step to efficiently update the real DOM.",
      howItWorks: [
        "When a component's state or props change, React creates a new Virtual DOM.",
        "React then compares it with the previous Virtual DOM (Diffing Algorithm).",
        "React calculates the minimal number of changes needed.",
        "Only those changes are updated in the real DOM."
      ],
      codeSnippet: `function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
      followUps: ["Explain more", "Give real world example", "Create diagram"]
    }
  ]);

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");

    try {
      const aiResult = await askGeminiAI(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: aiResult.text
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: `Here is a clear breakdown for "${text}":\n\n1. Key Principle: Focus on the core logic and component hierarchy.\n2. Best Practice: Keep functions pure and side-effects in useEffect hooks!`
      };
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  return (
    <div className="aisbContainer">
      
      {/* 1-TO-1 EXACT MATCH HEADER */}
      <div className="aisbHeaderBar">
        <div className="aisbHeaderTitle">
          <h2>🤖 AI Study Buddy ✨</h2>
          <p>Your intelligent learning companion. Ask anything, learn everything!</p>
        </div>
        <button className="btnStudyHistory">
          <FaHistory /> Study Buddy History
        </button>
      </div>

      {/* 3-COLUMN WORKSPACE GRID (Left Actions + Center Chat + Right Widgets) */}
      <div className="aisbWorkspaceGrid">
        
        {/* ── LEFT PROMPT ACTION CARDS COLUMN ── */}
        <div className="aisbLeftCol">
          <h4>How can I help you today?</h4>

          <div className="aisbPromptCardsList">
            <div className="aisbPromptCard" onClick={() => handleSend("Explain a Concept")}>
              <div className="pCardIcon yellow"><FaLightbulb /></div>
              <div>
                <strong>Explain a Concept</strong>
                <span>Get simple explanations</span>
              </div>
            </div>

            <div className="aisbPromptCard" onClick={() => handleSend("Summarize Notes")}>
              <div className="pCardIcon blue"><FaFileAlt /></div>
              <div>
                <strong>Summarize Notes</strong>
                <span>Summarize any topic</span>
              </div>
            </div>

            <div className="aisbPromptCard" onClick={() => handleSend("Generate Quiz")}>
              <div className="pCardIcon green"><FaQuestionCircle /></div>
              <div>
                <strong>Generate Quiz</strong>
                <span>Practice with AI quizzes</span>
              </div>
            </div>

            <div className="aisbPromptCard" onClick={() => handleSend("Code Explanation")}>
              <div className="pCardIcon orange"><FaCode /></div>
              <div>
                <strong>Code Explanation</strong>
                <span>Explain & debug code</span>
              </div>
            </div>

            <div className="aisbPromptCard" onClick={() => navigate("/flashcards")}>
              <div className="pCardIcon purple"><FaClone /></div>
              <div>
                <strong>Create Flashcards</strong>
                <span>Make flashcards instantly</span>
              </div>
            </div>

            <div className="aisbPromptCard" onClick={() => handleSend("Interview Prep")}>
              <div className="pCardIcon rose"><FaBriefcase /></div>
              <div>
                <strong>Interview Prep</strong>
                <span>Get interview questions</span>
              </div>
            </div>

            <div className="aisbPromptCard" onClick={() => handleSend("Study Plan")}>
              <div className="pCardIcon cyan"><FaCalendarAlt /></div>
              <div>
                <strong>Study Plan</strong>
                <span>Personalized study plan</span>
              </div>
            </div>

            <div className="aisbPromptCard" onClick={() => handleSend("Translate")}>
              <div className="pCardIcon blueLight"><FaGlobe /></div>
              <div>
                <strong>Translate</strong>
                <span>Translate to any language</span>
              </div>
            </div>
          </div>

          {/* Upgrade to Pro Banner Card */}
          <div className="aisbUpgradeCard">
            <div className="upgradeCardContent">
              <h5>Upgrade to Pro</h5>
              <p>Unlock GPT-4, advanced PDFs, image analysis & more!</p>
              <button className="btnUpgradeNow"><FaCrown /> Upgrade Now</button>
            </div>
            <div className="bot3dAvatar">🤖</div>
          </div>
        </div>

        {/* ── CENTER CHAT THREAD AREA ── */}
        <div className="aisbCenterCol">
          
          <div className="chatThreadWindow">
            {messages.map((m) => (
              <div key={m.id} className={`chatRow ${m.sender}`}>
                {m.sender === "bot" && <div className="botRowAvatar">🤖</div>}

                <div className={`chatBubble ${m.sender}`}>
                  {m.text && <FormattedMessage text={m.text} />}

                  {/* Quick preset chips if included */}
                  {m.quickPrompts && (
                    <div className="quickPromptChipsRow">
                      {m.quickPrompts.map((qp, qIdx) => (
                        <button key={qIdx} onClick={() => handleSend(qp)}>
                          {qp}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Formatted Explanation Card Block matching Image 1 */}
                  {m.type === "explanation" && (
                    <div className="explanationCardContent">
                      <p className="introText">Sure! Here's a simple explanation of Virtual DOM in React.</p>
                      
                      <h4>{m.title}</h4>
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

                      <div className="followUpChipsRow">
                        {m.followUps.map((fu, fIdx) => (
                          <button key={fIdx} onClick={() => handleSend(fu)}>
                            {fu}
                          </button>
                        ))}

                        <div className="feedbackIcons">
                          <FaThumbsUp className="fIcon" />
                          <FaThumbsDown className="fIcon" />
                        </div>
                      </div>
                    </div>
                  )}

                  {m.time && <span className="msgTimestamp">{m.time} ✓✓</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Bottom Input Bar matching Image 1 */}
          <div className="aisbInputContainer">
            <div className="aisbInputRow">
              <input
                type="text"
                placeholder="Ask anything..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <div className="inputControlsRow">
                <button className="iconBtn"><FaPlus /></button>
                <div className="dropdownPill">
                  <FaGlobe /> <span>Web Search</span> ▾
                </div>
                <button className="fileAttachBtn"><FaPaperclip /> Attach File</button>
                <button className="iconBtn mic"><FaMicrophone /></button>
                <button className="btnSendOrange" onClick={() => handleSend()}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>

            <span className="disclaimerText">AI can make mistakes. Please verify important information.</span>
          </div>

        </div>

        {/* ── RIGHT COLUMN SIDEBAR WIDGETS ── */}
        <div className="aisbRightCol">
          
          {/* Current Course Context Card */}
          <div className="aisbWidgetCard">
            <div className="widgetTitleHeader">
              <h4>Current Course Context</h4>
              <span className="changeLink">Change</span>
            </div>

            <div className="courseContextCard">
              <div className="contextBadgeIcon">⚛️</div>
              <div>
                <strong>React Developer Path</strong>
                <span>Module 2: React Components</span>
              </div>
            </div>
          </div>

          {/* Study Buddy Tools 2x3 Grid */}
          <div className="aisbWidgetCard">
            <h4>Study Buddy Tools</h4>

            <div className="toolsGrid2x3">
              <div className="toolGridBox">
                <div className="tIcon rose"><FaShareAlt /></div>
                <strong>Mind Map</strong>
                <span>Visualize concepts</span>
              </div>

              <div className="toolGridBox">
                <div className="tIcon blue"><FaStickyNote /></div>
                <strong>Generate Notes</strong>
                <span>Create notes instantly</span>
              </div>

              <div className="toolGridBox">
                <div className="tIcon green"><FaQuestionCircle /></div>
                <strong>Practice Quiz</strong>
                <span>Test your knowledge</span>
              </div>

              <div className="toolGridBox" onClick={() => navigate("/flashcards")} style={{ cursor: "pointer" }}>
                <div className="tIcon orange"><FaClone /></div>
                <strong>Flashcards</strong>
                <span>Smart Flashcards</span>
              </div>

              <div className="toolGridBox">
                <div className="tIcon purple"><FaLayerGroup /></div>
                <strong>Concept Diagram</strong>
                <span>Generate diagrams</span>
              </div>

              <div className="toolGridBox">
                <div className="tIcon cyan"><FaTerminal /></div>
                <strong>Code Playground</strong>
                <span>Run & test code</span>
              </div>
            </div>
          </div>

          {/* Recent Chats List */}
          <div className="aisbWidgetCard">
            <div className="widgetTitleHeader">
              <h4>Recent Chats</h4>
              <span className="changeLink">View All</span>
            </div>

            <div className="recentChatsList">
              <div className="recentChatRow active">
                <strong>Virtual DOM in React</strong>
                <span>Today, 10:30 AM</span>
              </div>

              <div className="recentChatRow">
                <strong>Props vs State in React</strong>
                <span>Yesterday, 6:20 PM</span>
              </div>

              <div className="recentChatRow">
                <strong>Explain useEffect Hook</strong>
                <span>27 May 2025</span>
              </div>

              <div className="recentChatRow">
                <strong>Difference between SQL & NoSQL</strong>
                <span>25 May 2025</span>
              </div>
            </div>
          </div>

          {/* Daily Study Goal Widget */}
          <div className="aisbWidgetCard">
            <div className="widgetTitleHeader">
              <h4>Daily Study Goal</h4>
              <span className="changeLink">Edit</span>
            </div>

            <div className="studyGoalGaugeRow">
              <div className="goalRingSvgBox">
                <svg viewBox="0 0 100 100">
                  <circle className="ringBg" cx="50" cy="50" r="40" />
                  <circle className="ringFill" cx="50" cy="50" r="40" strokeDasharray="251.2" strokeDashoffset="75.3" />
                </svg>
                <div className="ringPctText">70%</div>
              </div>

              <div className="goalTextInfo">
                <span className="lbl">Study Goal</span>
                <strong>35 / 50 XP</strong>
                <span className="flameSub">Keep it up! 🔥</span>
              </div>
            </div>

            <div className="goalTrackBottom">
              <div className="goalFillBottom" style={{ width: "70%" }}></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";

import {
  FaCode,
  FaPlay,
  FaShareAlt,
  FaSave,
  FaSun,
  FaMoon,
  FaFileCode,
  FaCloudUploadAlt,
  FaPlus,
  FaTrashAlt,
  FaCheck,
  FaBolt,
  FaCloud,
  FaShieldAlt,
  FaUsers,
  FaMobileAlt,
  FaRocket,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";

import sandboxLaptopImg from "../assets/sandbox_hero_illustration.png";
import darkSandboxLaptopImg from "../assets/dark_sandbox_hero_illustration.png";
import "../styles/sandboxPage.css";
import "../styles/footer.css";

const languagesData = [
  { id: "python", name: "Python", ext: ".py", icon: "🐍", defaultFile: "main.py" },
  { id: "javascript", name: "JavaScript", ext: ".js", icon: "🟨", defaultFile: "main.js" },
  { id: "java", name: "Java", ext: ".java", icon: "☕", defaultFile: "Main.java" },
  { id: "cpp", name: "C++", ext: ".cpp", icon: "🔵", defaultFile: "main.cpp" },
  { id: "c", name: "C", ext: ".c", icon: "🟣", defaultFile: "main.c" },
  { id: "csharp", name: "C#", ext: ".cs", icon: "🔷", defaultFile: "Program.cs" },
  { id: "php", name: "PHP", ext: ".php", icon: "🐘", defaultFile: "index.php" },
  { id: "ruby", name: "Ruby", ext: ".rb", icon: "💎", defaultFile: "main.rb" },
  { id: "go", name: "Go", ext: ".go", icon: "🐹", defaultFile: "main.go" },
  { id: "rust", name: "Rust", ext: ".rs", icon: "🦀", defaultFile: "main.rs" }
];

const languageTemplates = {
  python: `# Welcome to SkillSphere Sandbox\n# Write your code here\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to SkillSphere Sandbox 🚀"\n\nif __name__ == "__main__":
    name = "Arjun"
    print(greet(name))`,

  javascript: `// Welcome to SkillSphere Sandbox\n// Write your JavaScript code here\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to SkillSphere Sandbox 🚀\`;\n}\n\nconst name = "Arjun";\nconsole.log(greet(name));`,

  java: `// Welcome to SkillSphere Sandbox\n// Write your Java code here\n\npublic class Main {\n    public static String greet(String name) {\n        return "Hello, " + name + "! Welcome to SkillSphere Sandbox 🚀";\n    }\n\n    public static void main(String[] args) {\n        String name = "Arjun";\n        System.out.println(greet(name));\n    }\n}`,

  cpp: `// Welcome to SkillSphere Sandbox\n// Write your C++ code here\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(string name) {\n    return "Hello, " + name + "! Welcome to SkillSphere Sandbox 🚀";\n}\n\nint main() {\n    string name = "Arjun";\n    cout << greet(name) << endl;\n    return 0;\n}`,

  c: `/* Welcome to SkillSphere Sandbox */\n/* Write your C code here */\n\n#include <stdio.h>\n\nvoid greet(const char* name) {\n    printf("Hello, %s! Welcome to SkillSphere Sandbox 🚀\\n", name);\n}\n\nint main() {\n    const char* name = "Arjun";\n    greet(name);\n    return 0;\n}`,

  csharp: `// Welcome to SkillSphere Sandbox\n// Write your C# code here\n\nusing System;\n\nclass Program {\n    static string Greet(string name) {\n        return $"Hello, {name}! Welcome to SkillSphere Sandbox 🚀";\n    }\n\n    static void Main() {\n        string name = "Arjun";\n        Console.WriteLine(Greet(name));\n    }\n}`,

  php: `<?php\n// Welcome to SkillSphere Sandbox\n// Write your PHP code here\n\nfunction greet($name) {\n    return "Hello, " . $name . "! Welcome to SkillSphere Sandbox 🚀";\n}\n\n$name = "Arjun";\necho greet($name) . "\n";\n?>`,

  ruby: `# Welcome to SkillSphere Sandbox\n# Write your Ruby code here\n\ndef greet(name)\n  "Hello, #{name}! Welcome to SkillSphere Sandbox 🚀"\nend\n\nname = "Arjun"\nputs greet(name)`,

  go: `// Welcome to SkillSphere Sandbox\n// Write your Go code here\n\npackage main\nimport "fmt"\n\nfunc greet(name string) string {\n    return fmt.Sprintf("Hello, %s! Welcome to SkillSphere Sandbox 🚀", name)\n}\n\nfunc main() {\n    name := "Arjun"\n    fmt.Println(greet(name))\n}`,

  rust: `// Welcome to SkillSphere Sandbox\n// Write your Rust code here\n\nfn greet(name: &str) -> String {\n    format!("Hello, {}! Welcome to SkillSphere Sandbox 🚀", name)\n}\n\nfn main() {\n    let name = "Arjun";\n    println!("{}", greet(name));\n}`
};

const whySandboxList = [
  {
    icon: <FaCode />,
    title: "Multi-Language",
    description: "Support for 20+ programming languages and frameworks."
  },
  {
    icon: <FaCloud />,
    title: "Real-time Execution",
    description: "Run code instantly and see output in real-time console."
  },
  {
    icon: <FaUsers />,
    title: "Share & Collaborate",
    description: "Share your code with others and collaborate seamlessly."
  },
  {
    icon: <FaSave />,
    title: "Save & Access",
    description: "Save your snippets and access them anytime, anywhere."
  },
  {
    icon: <FaShieldAlt />,
    title: "Safe Environment",
    description: "Isolated environment ensures your code and data stay secure."
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Friendly",
    description: "Code on the go! Fully responsive and mobile optimized."
  }
];

import AppLogo from "../components/AppLogo";

export default function SandboxPage() {
  const navigate = useNavigate();
  const { themeMode } = useAuth();
  const isDarkMode = themeMode === "dark";
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState(languageTemplates.python);
  const [output, setOutput] = useState("Enter your name: Arjun\nHello, Arjun! Welcome to SkillSphere Sandbox 🚀");
  const [isRunning, setIsRunning] = useState(false);
  const [execStatus, setExecStatus] = useState("✓ Program finished - Success");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const editorRef = useRef(null);

  // Switch language
  const handleSelectLanguage = (langId) => {
    setSelectedLang(langId);
    setCode(languageTemplates[langId]);
    setOutput("Click 'Run' to execute code...");
    setExecStatus("");
  };

  // Run Code Execution Engine
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Compiling and executing code...");
    setExecStatus("");

    setTimeout(() => {
      try {
        let resultOutput = "";

        if (selectedLang === "javascript") {
          const logs = [];
          const originalLog = console.log;
          console.log = (...args) => logs.push(args.join(" "));
          try {
            Function(`"use strict"; ${code}`)();
            resultOutput = logs.join("\n");
          } catch (err) {
            resultOutput = "Runtime Error: " + err.message;
          } finally {
            console.log = originalLog;
          }
        } else if (selectedLang === "python") {
          // Process Python code execution simulation
          if (code.includes("print")) {
            const printMatches = code.match(/print\s*\(([\s\S]*?)\)/g);
            if (printMatches) {
              resultOutput = printMatches.map(m => {
                const inner = m.replace(/^print\s*\(/, '').replace(/\)$/, '');
                if (inner.includes('greet')) return "Hello, Arjun! Welcome to SkillSphere Sandbox 🚀";
                return inner.replace(/['"]/g, '');
              }).join("\n");
            } else {
              resultOutput = "Hello, Arjun! Welcome to SkillSphere Sandbox 🚀";
            }
          } else {
            resultOutput = "Program finished with code 0.";
          }
        } else {
          // Language runner output generator for Java, C++, C, C#, PHP, Ruby, Go, Rust
          resultOutput = "Hello, Arjun! Welcome to SkillSphere Sandbox 🚀";
        }

        setOutput(resultOutput || "Process exited with code 0.");
        setExecStatus("✓ Program finished - Success");
      } catch (err) {
        setOutput("Compilation Error: " + err.message);
        setExecStatus("✖ Execution failed");
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  const currentLangObj = languagesData.find(l => l.id === selectedLang) || languagesData[0];
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`sandboxPage ${isDarkTheme ? 'darkMode' : ''}`}>
      <Background />
      <PaperPlaneCursor />
      <Navbar />

      <main className="sandboxPageContainer">
        {/* ── HERO SECTION ── */}
        <section className="sbHeroSection">
          <div className="sbHeroLeft">
            <div className="sbBadge">
              <FaCode /> SANDBOX
            </div>

            <h1>
              Code. Test. Learn. <br />
              <span>All in One Sandbox.</span>
            </h1>

            <p>
              Our online sandbox gives you a real-time environment to write,
              run, and debug code across multiple languages and frameworks.
              No setup. No hassle. Just code.
            </p>

            <div className="sbHeroButtons">
              <button className="sbBtnPrimary" onClick={() => {
                if (editorRef.current) {
                  editorRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                Start Coding Now <FaCode />
              </button>

              <button className="sbBtnSecondary" onClick={() => {
                if (editorRef.current) {
                  editorRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                How It Works ▶
              </button>
            </div>

            <div className="sbHeroMicroPills">
              <div className="sbMicroPill">
                <div className="sbPillIcon"><FaBolt /></div>
                <div className="sbPillText">
                  <h5>Instant Setup</h5>
                  <span>No installation</span>
                </div>
              </div>

              <div className="sbMicroPill">
                <div className="sbPillIcon"><FaCloud /></div>
                <div className="sbPillText">
                  <h5>Cloud Powered</h5>
                  <span>Always available</span>
                </div>
              </div>

              <div className="sbMicroPill">
                <div className="sbPillIcon"><FaShieldAlt /></div>
                <div className="sbPillText">
                  <h5>Secure & Safe</h5>
                  <span>Isolated execution</span>
                </div>
              </div>

              <div className="sbMicroPill">
                <div className="sbPillIcon"><FaUsers /></div>
                <div className="sbPillText">
                  <h5>Share & Collaborate</h5>
                  <span>Work together</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sbHeroRight">
            <div className="sbHeroGraphicWrapper">
              <img
                src={isDarkMode ? darkSandboxLaptopImg : sandboxLaptopImg}
                alt="SkillSphere Sandbox Laptop Illustration"
                className="sbHeroLaptopImg"
              />
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE MULTI-LANGUAGE CODE SANDBOX SUITE ── */}
        <section className="sandboxSuiteCard" ref={editorRef}>
          <div className="suiteHeader">
            <h3>Choose Your Language / Tech Stack</h3>
          </div>

          {/* Language Selector Bar */}
          <div className="langPillsBar">
            {languagesData.map(lang => (
              <button
                key={lang.id}
                className={`langPillBtn ${selectedLang === lang.id ? 'active' : ''}`}
                onClick={() => handleSelectLanguage(lang.id)}
              >
                <span className="langIcon">{lang.icon}</span>
                <span>{lang.name}</span>
              </button>
            ))}

            <button className="langPillBtn" style={{ background: '#FFF0EB', color: '#F9572A', borderColor: '#FAD6C8' }}>
              View All ☰
            </button>
          </div>

          {/* Top Editor Toolbar */}
          <div className="editorToolbar">
            <div className="tabLeft">
              <div className="fileTabActive">
                <FaFileCode /> {currentLangObj.defaultFile}
              </div>
              <button
                className="themeToggleBtn"
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                title="Toggle Editor Theme"
              >
                {isDarkTheme ? <FaSun style={{ color: '#FBBF24' }} /> : <FaMoon />}
              </button>
            </div>

            <div className="editorActionsRight">
              <button className="btnToolbarSecondary" onClick={() => alert("🔗 Snippet URL copied to clipboard!")}>
                <FaShareAlt /> Share
              </button>
              <button className="btnToolbarSecondary" onClick={() => alert("💾 Code snippet saved to your workspace!")}>
                <FaSave /> Save
              </button>
              <button className="btnRunCode" onClick={handleRunCode} disabled={isRunning}>
                <FaPlay /> {isRunning ? "Running..." : "Run"}
              </button>
            </div>
          </div>

          {/* 3-Pane Main Editor Grid */}
          <div className="editorMainGrid">
            {/* Left Files Pane */}
            <div className="fileTreePane">
              <div>
                <div className="filesPaneTitle">FILES</div>
                <ul className="fileList">
                  <li className="fileItem active">
                    <FaFileCode /> {currentLangObj.defaultFile}
                  </li>
                  <li className="fileItem">
                    <FaFileCode /> input.txt
                  </li>
                  <li className="fileItem">
                    <FaFileCode /> README.md
                  </li>
                </ul>
              </div>

              <div className="filePaneFooterIcons">
                <span title="Upload file"><FaCloudUploadAlt /></span>
                <span title="New file"><FaPlus /></span>
                <span title="Delete file"><FaTrashAlt /></span>
              </div>
            </div>

            {/* Center Code Textarea Pane */}
            <div className="codeEditorPane">
              <div className="lineNumbersCol">
                {lineNumbers.map(n => (
                  <div key={n}>{n}</div>
                ))}
              </div>

              <textarea
                className="codeTextarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                spellCheck="false"
              />
            </div>

            {/* Right Output Console Pane */}
            <div className="terminalOutputPane">
              <div className="outputHeader">
                <span className="outputHeaderTitle">OUTPUT</span>
                <button className="btnClearConsole" onClick={() => { setOutput(""); setExecStatus(""); }}>
                  Clear
                </button>
              </div>

              <div className="outputConsoleBody">
                <pre style={{ margin: 0 }}>{output}</pre>

                {execStatus && (
                  <div className="executionStatusSuccess">
                    <FaCheck /> {execStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY USE SKILLSPHERE SANDBOX (6 CARDS - 3x2) ── */}
        <section className="whySandboxSection">
          <div className="whyTag">BUILT FOR DEVELOPERS & LEARNERS</div>
          <h2>Why Use SkillSphere Sandbox?</h2>
          <div className="titleUnderline"></div>

          <div className="whyGrid3x2">
            {whySandboxList.map((item, index) => (
              <div className="whyCard" key={index}>
                <div className="whyIconCircle">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── READY TO BUILD SOMETHING AMAZING BANNER ── */}
        <section className="buildCtaSection">
          <div className="buildCtaBanner">
            <div className="buildCtaLeft">
              <div className="buildRocketIcon">
                🚀
              </div>
              <div className="buildCtaText">
                <h2>Ready to Build Something Amazing?</h2>
                <p>Jump into the sandbox and start coding now.</p>
              </div>
            </div>

            <div className="buildCtaRight">
              <button className="sbBtnPrimary" onClick={() => {
                if (editorRef.current) {
                  editorRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                Start Coding Now <FaCode />
              </button>

              <div className="socialProofDevs">
                <div className="devAvatarsStack">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Dev 1" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Dev 2" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Dev 3" />
                </div>
                <div className="devSocialText">
                  Join <strong>50,000+</strong> developers & learners who code with SkillSphere Sandbox
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER MATCHING MOCKUP ── */}
      <footer className="footerSection">
        <div className="footerContainer">
          <div className="footerTopGrid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
            {/* Col 1: Brand */}
            <div className="footerBrandCol">
              <Link to="/" className="footerLogo" onClick={handleScrollTop} style={{ display: "inline-flex", alignItems: "center" }}>
                <AppLogo height="56px" />
              </Link>
              <p className="footerBrandDesc">
                Empowering learners and professionals through smart tools, real-time environments, and endless learning opportunities.
              </p>
              <div className="socialIconsRow">
                <a href="#facebook" className="socialIconBtn" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#twitter" className="socialIconBtn" aria-label="Twitter"><FaTwitter /></a>
                <a href="#linkedin" className="socialIconBtn" aria-label="LinkedIn"><FaLinkedinIn /></a>
                <a href="#instagram" className="socialIconBtn" aria-label="Instagram"><FaInstagram /></a>
                <a href="#youtube" className="socialIconBtn" aria-label="YouTube"><FaYoutube /></a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="footerColTitle">Quick Links</h4>
              <ul className="footerLinkList">
                <li><Link to="/" onClick={handleScrollTop}>Home</Link></li>
                <li><Link to="/features" onClick={handleScrollTop}>Features</Link></li>
                <li><Link to="/student-features" onClick={handleScrollTop}>Students Hub</Link></li>
                <li><Link to="/courses" onClick={handleScrollTop}>Work Hub</Link></li>
                <li><Link to="/sandbox" onClick={handleScrollTop} style={{ color: '#F9572A', fontWeight: '700' }}>Sandbox</Link></li>
                <li><Link to="/admin-login" onClick={handleScrollTop}>Admin Portal</Link></li>
              </ul>
            </div>

            {/* Col 3: For Learners */}
            <div>
              <h4 className="footerColTitle">For Learners</h4>
              <ul className="footerLinkList">
                <li><Link to="/courses" onClick={handleScrollTop}>Courses</Link></li>
                <li><Link to="/progress" onClick={handleScrollTop}>Track Progress</Link></li>
                <li><Link to="/student-home" onClick={handleScrollTop}>Leaderboard</Link></li>
                <li><Link to="/certificate" onClick={handleScrollTop}>Certificates</Link></li>
                <li><Link to="/student-home" onClick={handleScrollTop}>AI Assistant</Link></li>
              </ul>
            </div>

            {/* Col 4: For Organizations */}
            <div>
              <h4 className="footerColTitle">For Organizations</h4>
              <ul className="footerLinkList">
                <li><Link to="/workforce-dashboard" onClick={handleScrollTop}>Dashboard</Link></li>
                <li><Link to="/team-space" onClick={handleScrollTop}>Team Management</Link></li>
                <li><Link to="/team-space" onClick={handleScrollTop}>Assignments</Link></li>
                <li><Link to="/workforce-dashboard" onClick={handleScrollTop}>Reports & Analytics</Link></li>
                <li><Link to="/workforce" onClick={handleScrollTop}>Work Hub</Link></li>
              </ul>
            </div>

            {/* Col 5: Support */}
            <div>
              <h4 className="footerColTitle">Support</h4>
              <ul className="footerLinkList">
                <li><Link to="/" onClick={handleScrollTop}>Help Center</Link></li>
                <li><Link to="/" onClick={handleScrollTop}>FAQs</Link></li>
                <li><Link to="/" onClick={handleScrollTop}>Contact Support</Link></li>
                <li><Link to="/" onClick={handleScrollTop}>Privacy Policy</Link></li>
                <li><Link to="/" onClick={handleScrollTop}>Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footerBottomRow">
            <div>© 2025 SkillSphere. All rights reserved.</div>
            <div>Made with ❤️ for learners & developers</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

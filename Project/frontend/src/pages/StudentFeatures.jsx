import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";

import {
  FaGraduationCap,
  FaChartLine,
  FaAward,
  FaBookOpen,
  FaTrophy,
  FaRobot,
  FaFolder,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaGem,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";

import studentGirlImg from "../assets/student_hub_girl_illustration.png";
import darkStudentGirlImg from "../assets/dark_student_hub_girl_illustration.png";
import "../styles/studentHubPage.css";
import "../styles/footer.css";

const toolsList = [
  {
    icon: <FaBookOpen />,
    title: "Interactive Courses",
    description: "Engaging lessons with quizzes, hands-on exercises & real-world projects.",
    actionText: "Browse Courses →",
    link: "/courses"
  },
  {
    icon: <FaChartLine />,
    title: "Track Progress",
    description: "Monitor your progress, strengths, and areas to improve.",
    actionText: "View Progress →",
    link: "/progress"
  },
  {
    icon: <FaTrophy />,
    title: "Achievements",
    description: "Earn XP, badges, and certificates as you learn and grow.",
    actionText: "See Achievements →",
    link: "/student-home"
  },
  {
    icon: <FaRobot />,
    title: "AI Study Assistant",
    description: "Get instant help, explanations, and recommendations from our AI assistant.",
    actionText: "Ask AI Assistant →",
    link: "/student-home"
  },
  {
    icon: <FaFolder />,
    title: "Study Resources",
    description: "Access notes, cheat sheets, eBooks, and curated study materials.",
    actionText: "Explore Resources →",
    link: "/learning"
  },
  {
    icon: <FaUsers />,
    title: "Community",
    description: "Connect with peers, join discussions, and share knowledge.",
    actionText: "Join Community →",
    link: "/discussions"
  }
];

import AppLogo from "../components/AppLogo";

export default function StudentFeatures() {
  const navigate = useNavigate();
  const { user, themeMode } = useAuth();
  const isDarkMode = themeMode === "dark";

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const studentName = user ? (user.full_name || user.username) : "Priya Sharma";

  return (
    <div className="studentHubPage">
      <Background />
      <PaperPlaneCursor />
      <Navbar />

      <main className="studentHubContainer">
        {/* ── HERO SECTION (3-COLUMN LAYOUT) ── */}
        <section className="shHeroSection">
          {/* Left Column */}
          <div className="shHeroLeft">
            <div className="shBadge">
              ★ STUDENT HUB
            </div>

            <h1>
              Your Learning Journey <br />
              <span>Starts Here 🚀</span>
            </h1>

            <p>
              Access interactive courses, track your progress, earn rewards,
              and become industry-ready with SkillSphere.
            </p>

            <div className="shHeroButtons">
              <button className="shBtnPrimary" onClick={() => navigate(user ? '/student-home' : '/register')}>
                Start Learning <FaArrowRight />
              </button>

              <button className="shBtnSecondary" onClick={() => navigate('/courses')}>
                Explore Courses
              </button>
            </div>

            <div className="shHeroMicroPills">
              <div className="shMicroPill">
                <div className="shPillIcon"><FaGraduationCap /></div>
                <div className="shPillText">
                  <h5>Learn</h5>
                  <span>With interactive modules</span>
                </div>
              </div>

              <div className="shMicroPill">
                <div className="shPillIcon"><FaChartLine /></div>
                <div className="shPillText">
                  <h5>Track</h5>
                  <span>Your progress in real-time</span>
                </div>
              </div>

              <div className="shMicroPill">
                <div className="shPillIcon"><FaAward /></div>
                <div className="shPillText">
                  <h5>Earn</h5>
                  <span>Badges & rewards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Female Student Graphic */}
          <div className="shHeroCenter">
            <div className="shHeroGraphicWrapper">
              <img
                src={isDarkMode ? darkStudentGirlImg : studentGirlImg}
                alt="Female Student Hub Illustration"
                className="shHeroGirlImg"
              />
            </div>
          </div>

          {/* Right Column: Student Progress Widget */}
          <div className="shHeroRight">
            <div className="studentWelcomeWidget">
              <div className="welcomeHeader">
                <h4>Welcome back,</h4>
                <h3>{studentName} 👋</h3>
                <p>Keep up the great work!</p>
              </div>

              <div className="levelProgressBox">
                <div className="levelLabelRow">
                  <span className="levelVal">Current Level: Level 21</span>
                  <span className="pctVal">82%</span>
                </div>

                <div className="shProgressBarTrack">
                  <div className="shProgressBarFill"></div>
                </div>

                <span className="xpMetaText">XP: 4,120 / 5,000</span>
              </div>
            </div>

            <div className="miniStatsCardsRow">
              <div className="shMiniStatCard">
                <span>Current Streak</span>
                <strong>27 Days 🔥</strong>
              </div>

              <div className="shMiniStatCard">
                <span>Badges Earned</span>
                <strong>18 🎖️</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR (5 METRICS) ── */}
        <section className="shStatsBarContainer">
          <div className="shStatItem">
            <div className="shStatIconCircle"><FaBookOpen /></div>
            <div className="shStatText">
              <strong>14</strong>
              <span>Courses Enrolled</span>
            </div>
          </div>

          <div className="shStatItem">
            <div className="shStatIconCircle"><FaCheckCircle /></div>
            <div className="shStatText">
              <strong>6</strong>
              <span>Courses Completed</span>
            </div>
          </div>

          <div className="shStatItem">
            <div className="shStatIconCircle"><FaAward /></div>
            <div className="shStatText">
              <strong>9</strong>
              <span>Certifications Earned</span>
            </div>
          </div>

          <div className="shStatItem">
            <div className="shStatIconCircle"><FaTrophy /></div>
            <div className="shStatText">
              <strong>12,450</strong>
              <span>Total XP</span>
            </div>
          </div>

          <div className="shStatItem">
            <div className="shStatIconCircle"><FaGem /></div>
            <div className="shStatText">
              <strong>Diamond</strong>
              <span>Your Rank</span>
            </div>
          </div>
        </section>

        {/* ── POWERFUL TOOLS FOR SMART LEARNERS (6 CARDS - 3x2) ── */}
        <section className="toolsSection">
          <div className="toolsTag">EVERYTHING YOU NEED TO SUCCEED</div>
          <h2>Powerful Tools for Smart Learners</h2>
          <div className="titleUnderline"></div>

          <div className="toolsGrid3x2">
            {toolsList.map((item, index) => (
              <div className="toolCard" key={index}>
                <div>
                  <div className="toolIconCircle">
                    {item.icon}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <span
                  className="toolActionLink"
                  onClick={() => navigate(item.link)}
                >
                  {item.actionText}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── YOUR PATH TO SUCCESS (4 STEP BANNER IN SOFT PURPLE) ── */}
        <section className="pathSection">
          <div className="pathContainerCard">
            <div className="pathTag">YOUR PATH TO SUCCESS</div>
            <h2>Learn. Practice. Achieve. Repeat.</h2>

            <div className="pathStepsGrid">
              <div className="pathStepItem">
                <div className="pathIconCircle">
                  <FaBookOpen />
                </div>
                <h4>1. Learn</h4>
                <p>Explore courses and build your knowledge.</p>
              </div>

              <div className="pathStepItem">
                <div className="pathIconCircle">
                  <FaCheckCircle />
                </div>
                <h4>2. Practice</h4>
                <p>Solve exercises, quizzes & real-world problems.</p>
              </div>

              <div className="pathStepItem">
                <div className="pathIconCircle">
                  <FaChartLine />
                </div>
                <h4>3. Track</h4>
                <p>Monitor your progress and improve consistently.</p>
              </div>

              <div className="pathStepItem">
                <div className="pathIconCircle">
                  <FaAward />
                </div>
                <h4>4. Achieve</h4>
                <p>Earn certificates, badges and become industry-ready.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── DARK NAVY CTA BANNER ── */}
        <section className="shCtaSection">
          <div className="shCtaBanner">
            <div className="shCtaLeft">
              <div className="gradCapIllustrationBox">
                🎓
              </div>
              <div className="shCtaText">
                <h2>Ready to take your learning to the next level?</h2>
                <p>
                  Join thousands of learners and start your journey with SkillSphere today!
                </p>
              </div>
            </div>

            <div className="shCtaButtons">
              <button
                className="shBtnStartNow"
                onClick={() => navigate(user ? '/student-home' : '/register')}
              >
                Start Learning Now <FaArrowRight />
              </button>

              <button
                className="shBtnGoogleCta"
                onClick={() => navigate('/login')}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google logo"
                />
                Continue with Google
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER MATCHING MOCKUP ── */}
      <footer className="footerSection">
        <div className="footerContainer">
          <div className="footerTopGrid" style={{ gridTemplateColumns: '2fr 1fr 1.2fr 1.2fr' }}>
            {/* Col 1: Brand */}
            <div className="footerBrandCol">
              <Link to="/" className="footerLogo" onClick={handleScrollTop} style={{ display: "inline-flex", alignItems: "center" }}>
                <AppLogo height="56px" />
              </Link>
              <p className="footerBrandDesc">
                Empowering students through smart learning, real-time analytics, and future-ready skills.
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
                <li><Link to="/student-features" onClick={handleScrollTop} style={{ color: '#F9572A', fontWeight: '700' }}>Students Hub</Link></li>
                <li><Link to="/courses" onClick={handleScrollTop}>Work Hub</Link></li>
                <li><Link to="/sandbox" onClick={handleScrollTop}>Sandbox</Link></li>
                <li><Link to="/admin-login" onClick={handleScrollTop}>Admin Portal</Link></li>
              </ul>
            </div>

            {/* Col 3: For Students */}
            <div>
              <h4 className="footerColTitle">For Students</h4>
              <ul className="footerLinkList">
                <li><Link to="/courses" onClick={handleScrollTop}>Courses</Link></li>
                <li><Link to="/progress" onClick={handleScrollTop}>Track Progress</Link></li>
                <li><Link to="/student-home" onClick={handleScrollTop}>Leaderboard</Link></li>
                <li><Link to="/certificate" onClick={handleScrollTop}>Certificates</Link></li>
                <li><Link to="/student-home" onClick={handleScrollTop}>AI Assistant</Link></li>
              </ul>
            </div>

            {/* Col 4: Support */}
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
            <div>Made with ❤️ for learners</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

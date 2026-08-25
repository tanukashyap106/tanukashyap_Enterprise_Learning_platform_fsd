import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import Stats from "../components/Stats";

import {
  FaBookOpen,
  FaRobot,
  FaChartLine,
  FaAward,
  FaCode,
  FaUsers,
  FaChartPie,
  FaShieldAlt,
  FaArrowRight,
  FaPlayCircle,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";

import featureHeroImg from "../assets/feature_hero_illustration.png";
import darkFeatureHeroImg from "../assets/dark_feature_hero_illustration.png";
import "../styles/featurePage.css";
import "../styles/footer.css";

const platformCapabilities8 = [
  {
    icon: <FaBookOpen />,
    title: "Interactive Learning",
    description: "Engaging courses, quizzes, and hands-on challenges for deeper understanding."
  },
  {
    icon: <FaRobot />,
    title: "AI Assistant",
    description: "Your intelligent companion for doubt solving, explanations, and recommendations."
  },
  {
    icon: <FaChartLine />,
    title: "Progress Tracking",
    description: "Real-time insights and analytics to track your learning journey and performance."
  },
  {
    icon: <FaAward />,
    title: "Certifications",
    description: "Industry-recognized certificates to showcase your skills and achievements."
  },
  {
    icon: <FaCode />,
    title: "Sandbox Environment",
    description: "Practice, build, and experiment in a safe and powerful coding sandbox."
  },
  {
    icon: <FaUsers />,
    title: "Team & Collaboration",
    description: "Work together on projects, share ideas, and solve problems in real time."
  },
  {
    icon: <FaChartPie />,
    title: "Workforce Analytics",
    description: "Monitor team performance, learning impact, and workforce readiness."
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure & Reliable",
    description: "Enterprise-grade security, data privacy, and 99.9% platform uptime."
  }
];

import AppLogo from "../components/AppLogo";

export default function FeaturePage() {
  const navigate = useNavigate();
  const { themeMode } = useAuth();
  const isDarkMode = themeMode === "dark";

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="featurePage">
      <Background />
      <PaperPlaneCursor />
      <Navbar />

      <main className="featurePageContainer">
        {/* ── HERO SECTION ── */}
        <section className="featHeroSection">
          <div className="featHeroLeft">
            <div className="featBadge">
              ★ POWERFUL FEATURES
            </div>

            <h1>
              Everything You Need <br />
              to <span>Learn, Grow & Succeed</span>
            </h1>

            <p>
              SkillSphere brings together smart learning, real-time analytics,
              gamified progress, and workforce tools in one unified platform
              built for the future.
            </p>

            <div className="featHeroButtons">
              <button className="primaryHeroBtn" onClick={() => navigate('/register')}>
                Explore Features <FaArrowRight />
              </button>
            </div>
          </div>

          <div className="featHeroRight">
            <div className="featHeroGraphicWrapper">
              <img
                src={isDarkMode ? darkFeatureHeroImg : featureHeroImg}
                alt="SkillSphere Features Platform"
                className="featHeroGraphicImg"
              />
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="featStatsSection">
          <Stats />
        </section>

        {/* ── OUR PLATFORM CAPABILITIES (8 FEATURE CARDS - 4x2) ── */}
        <section className="capabilitiesSection">
          <div className="capabilitiesTag">OUR PLATFORM CAPABILITIES</div>
          <h2>Smarter Learning. Stronger Teams. Better Outcomes.</h2>
          <div className="titleUnderline"></div>

          <div className="capabilitiesGrid4x2">
            {platformCapabilities8.map((item, index) => (
              <div className="capabilityCard" key={index}>
                <div className="capIconCircle">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ONE PLATFORM. UNLIMITED POSSIBILITIES BANNER ── */}
        <section className="possibilitiesSection">
          <div className="possibilitiesBanner">
            <div className="possibilitiesLeft">
              <div className="rocketIllustrationBox">
                🚀
              </div>
              <div className="possibilitiesText">
                <h2>
                  One Platform.
                  <span>Unlimited Possibilities.</span>
                </h2>
                <p>
                  Empower students, professionals, and organizations with the tools
                  they need to learn, collaborate, and achieve more.
                </p>
              </div>
            </div>

            <div className="possibilitiesButtons">
              <button
                className="btnJoinStudent"
                onClick={() => navigate('/register', { state: { role: 'STUDENT', step: 2 } })}
              >
                Join as Student
              </button>

              <button
                className="btnExploreTeams"
                onClick={() => navigate('/register', { state: { role: 'EMPLOYEE', step: 2 } })}
              >
                Explore for Teams
              </button>
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
                Empowering students and organizations through gamified learning and workforce development.
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
                <li><Link to="/features" onClick={handleScrollTop} style={{ color: '#F9572A', fontWeight: '700' }}>Features</Link></li>
                <li><Link to="/student-features" onClick={handleScrollTop}>Students Hub</Link></li>
                <li><Link to="/workforce" onClick={handleScrollTop}>Work Hub</Link></li>
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

            {/* Col 4: For Workforce */}
            <div>
              <h4 className="footerColTitle">For Workforce</h4>
              <ul className="footerLinkList">
                <li><Link to="/workforce-dashboard" onClick={handleScrollTop}>Dashboard</Link></li>
                <li><Link to="/team-space" onClick={handleScrollTop}>Team Management</Link></li>
                <li><Link to="/team-space" onClick={handleScrollTop}>Assignments</Link></li>
                <li><Link to="/workforce-dashboard" onClick={handleScrollTop}>Reports & Analytics</Link></li>
                <li><Link to="/workforce-home" onClick={handleScrollTop}>Work Hub</Link></li>
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
            <div>Made with ❤️ for learners & teams</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

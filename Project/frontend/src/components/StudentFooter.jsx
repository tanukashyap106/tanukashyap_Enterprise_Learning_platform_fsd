import React from "react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaHome,
  FaBook,
  FaCodeBranch,
  FaFileAlt,
  FaComments,
  FaRobot,
  FaRocket,
  FaMapSigns,
  FaBolt,
  FaAward,
  FaCertificate,
  FaChartLine,
  FaFileInvoice,
  FaCog
} from "react-icons/fa";
import "../styles/footer.css";

export default function StudentFooter() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footerSection sdFooterSection">
      <div className="footerContainer">
        <div className="studentFooterGrid">
          {/* Col 1: Brand Info */}
          <div className="footerBrandCol">
            <Link to="/student-home" className="footerLogo" onClick={handleScrollTop} style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="56px" />
            </Link>
            <p className="footerBrandDesc">
              Empowering student learning with interactive courses, AI study assistance, daily quests, and career readiness.
            </p>
            <div className="socialIconsRow">
              <a href="#facebook" className="socialIconBtn" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#twitter" className="socialIconBtn" aria-label="Twitter"><FaTwitter /></a>
              <a href="#linkedin" className="socialIconBtn" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#instagram" className="socialIconBtn" aria-label="Instagram"><FaInstagram /></a>
              <a href="#youtube" className="socialIconBtn" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* Col 2: Core Learning (Student Menu Bar) */}
          <div>
            <h4 className="footerColTitle">Core Learning</h4>
            <ul className="footerLinkList">
              <li>
                <Link to="/student-home" onClick={handleScrollTop}>
                  <FaHome className="footerLinkIcon" /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/courses" onClick={handleScrollTop}>
                  <FaBook className="footerLinkIcon" /> Courses
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" onClick={handleScrollTop}>
                  <FaCodeBranch className="footerLinkIcon" /> Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/assignments" onClick={handleScrollTop}>
                  <FaFileAlt className="footerLinkIcon" /> Assignments
                </Link>
              </li>
              <li>
                <Link to="/discussions" onClick={handleScrollTop}>
                  <FaComments className="footerLinkIcon" /> Discussions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Smart Tools & Quests (Student Menu Bar) */}
          <div>
            <h4 className="footerColTitle">Smart Tools & Quests</h4>
            <ul className="footerLinkList">
              <li>
                <Link to="/ai-buddy" onClick={handleScrollTop}>
                  <FaRobot className="footerLinkIcon" /> AI Study Buddy <span className="footerBadge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/career-roadmap" onClick={handleScrollTop}>
                  <FaMapSigns className="footerLinkIcon" /> Career Roadmap <span className="footerBadge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/opportunity-feed" onClick={handleScrollTop}>
                  <FaRocket className="footerLinkIcon" /> Opportunity Feed <span className="footerBadge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/daily-quests" onClick={handleScrollTop}>
                  <FaBolt className="footerLinkIcon" /> Daily Quests
                </Link>
              </li>
              <li>
                <Link to="/badges" onClick={handleScrollTop}>
                  <FaAward className="footerLinkIcon" /> Badges & Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Career & Progress (Student Menu Bar) */}
          <div>
            <h4 className="footerColTitle">Career & Progress</h4>
            <ul className="footerLinkList">
              <li>
                <Link to="/certificate" onClick={handleScrollTop}>
                  <FaCertificate className="footerLinkIcon" /> Certificates Center
                </Link>
              </li>
              <li>
                <Link to="/progress" onClick={handleScrollTop}>
                  <FaChartLine className="footerLinkIcon" /> Learning Progress
                </Link>
              </li>
              <li>
                <Link to="/resume" onClick={handleScrollTop}>
                  <FaFileInvoice className="footerLinkIcon" /> Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/settings" onClick={handleScrollTop}>
                  <FaCog className="footerLinkIcon" /> Profile Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footerBottomRow">
          <div>© 2025 SkillSphere Student Portal. All rights reserved.</div>
          <div className="legalLinks">
            <Link to="/student-home" onClick={handleScrollTop}>Privacy Policy</Link>
            <span>|</span>
            <Link to="/student-home" onClick={handleScrollTop}>Terms of Service</Link>
            <span>|</span>
            <Link to="/student-home" onClick={handleScrollTop}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

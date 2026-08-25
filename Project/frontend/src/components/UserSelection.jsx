import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGraduationCap, FaBriefcase, FaCheck, FaArrowRight } from "react-icons/fa";
import studentIllustration from "../assets/student_portal_illustration.png";
import workforceIllustration from "../assets/workforce_portal_illustration.png";
import darkStudentIllustration from "../assets/dark_student_portal_illustration.png";
import darkWorkforceIllustration from "../assets/dark_workforce_portal_illustration.png";
import "../styles/userSelection.css";

export default function UserSelection() {
  const navigate = useNavigate();
  const { themeMode } = useAuth();
  const isDarkMode = themeMode === "dark";

  return (
    <section className="portalSection" id="workspace-selection">
      <div className="portalTag">CHOOSE YOUR PORTAL</div>
      <h2>Your Gateway to <span>Growth</span></h2>

      <div className="portalGrid">
        {/* Student Portal Card */}
        <div className="portalCard">
          <div className="portalIllustrationBox">
            <img src={isDarkMode ? darkStudentIllustration : studentIllustration} alt="Student Portal Illustration" className="portalIllustrationImg studentImg" />
          </div>

          <div className="portalContent">
            <span className="portalCardBadge">For Students</span>
            <div className="portalTitleRow">
              <div className="portalIconBox">
                <FaGraduationCap />
              </div>
              <h3>Student Portal</h3>
            </div>
            <p className="portalDesc">
              Access interactive courses, track progress, earn badges and certifications, and compete on leaderboards.
            </p>

            <ul className="portalChecklist">
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                50+ Interactive Course Tracks
              </li>
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                Real-time XP & Level Progression
              </li>
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                Live Leaderboards & Daily Quests
              </li>
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                Blockchain Certificate Verification
              </li>
            </ul>

            <button
              className="portalActionBtn"
              onClick={() => navigate('/register', { state: { role: 'STUDENT', step: 2 } })}
            >
              Enter Student Portal <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Workforce Portal Card */}
        <div className="portalCard">
          <div className="portalContent">
            <span className="portalCardBadge">For Workforce</span>
            <div className="portalTitleRow">
              <div className="portalIconBox">
                <FaBriefcase />
              </div>
              <h3>Workforce Portal</h3>
            </div>
            <p className="portalDesc">
              Manage teams, assign projects, monitor progress, and analyze performance in real-time.
            </p>

            <ul className="portalChecklist">
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                Unified Employee Directories
              </li>
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                Project Assignments & Progress
              </li>
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                Real-time Leave Request Workflows
              </li>
              <li>
                <span className="checkIconCircle"><FaCheck /></span>
                Detailed Team Performance Analytics
              </li>
            </ul>

            <button
              className="portalActionBtn"
              onClick={() => navigate('/login', { state: { role: 'EMPLOYEE' } })}
            >
              Manage Workforce <FaArrowRight />
            </button>
          </div>

          <div className="portalIllustrationBox">
            <img src={isDarkMode ? darkWorkforceIllustration : workforceIllustration} alt="Workforce Portal Illustration" className="portalIllustrationImg workforceImg" />
          </div>
        </div>
      </div>
    </section>
  );
}
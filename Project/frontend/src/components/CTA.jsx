import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaRocket, FaArrowRight } from "react-icons/fa";
import "../styles/cta.css";

export default function CTA() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    const selectionSection = document.getElementById("workspace-selection");
    if (selectionSection) {
      selectionSection.scrollIntoView({ behavior: "smooth" });
    } else if (user) {
      if (user.role === 'STUDENT') {
        navigate('/student-home');
      } else if (user.role === 'EMPLOYEE') {
        navigate('/workforce-home');
      } else {
        navigate('/register');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="ctaSection">
      <div className="ctaBanner">
        <div className="ctaLeftGroup">
          <div className="ctaRocketCircle">
            <FaRocket />
          </div>
          <div className="ctaTextContent">
            <h2>Ready to Transform Learning & Workforce Management?</h2>
            <p>
              Empower students, educators, employees, and organizations with one intelligent platform
              for learning, collaboration, and productivity.
            </p>
          </div>
        </div>

        <button className="ctaBtnWhite" onClick={handleGetStarted}>
          Get Started Now <FaArrowRight />
        </button>
      </div>
    </section>
  );
}

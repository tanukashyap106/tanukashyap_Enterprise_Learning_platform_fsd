import React from "react";
import { FaUserCircle, FaBriefcase, FaRocket, FaChartLine, FaGlobe, FaShieldAlt } from "react-icons/fa";
import "../styles/features.css";

const featureItems = [
  {
    icon: <FaUserCircle />,
    title: "Personalized Learning",
    description: "AI-powered recommendations tailored to your goals, interests, and skill level."
  },
  {
    icon: <FaBriefcase />,
    title: "Industry-Relevant Skills",
    description: "Learn in-demand skills curated by industry experts and leaders."
  },
  {
    icon: <FaRocket />,
    title: "Career Advancement",
    description: "Boost your career with certifications, projects, and real-world learning."
  },
  {
    icon: <FaChartLine />,
    title: "Track & Achieve",
    description: "Track progress, earn badges, and achieve your learning goals."
  }
];

export default function Features() {
  return (
    <section className="featuresSection">
      <div className="featuresTag">POWERFUL FEATURES</div>
      <h2>Everything You Need to <span>Learn and Grow</span></h2>

      <div className="featuresGrid">
        {featureItems.map((item, index) => (
          <div className="featureCard" key={index}>
            <div className="featureIconBox">
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
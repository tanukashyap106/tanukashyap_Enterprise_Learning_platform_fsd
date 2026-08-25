import React from "react";
import { FaGraduationCap, FaUsers, FaAward, FaBuilding, FaShieldAlt } from "react-icons/fa";
import "../styles/stats.css";

const statData = [
  {
    icon: <FaGraduationCap />,
    number: "10,000+",
    label: "Courses"
  },
  {
    icon: <FaUsers />,
    number: "500K+",
    label: "Happy Learners"
  },
  {
    icon: <FaAward />,
    number: "20K+",
    label: "Certifications Issued"
  },
  {
    icon: <FaBuilding />,
    number: "500+",
    label: "Partner Organizations"
  }
];

export default function Stats() {
  return (
    <section className="statsSection">
      <div className="statsCardContainer">
        {statData.map((item, index) => (
          <div className="statItem" key={index}>
            <div className="statIconBox">
              {item.icon}
            </div>
            <div className="statTextContent">
              <span className="statNumber">{item.number}</span>
              <span className="statLabel">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
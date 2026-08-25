import React from "react";
import { FaFileAlt, FaLaptopCode, FaTrophy, FaAward } from "react-icons/fa";
import "../styles/timeline.css";

const journeySteps = [
  {
    step: 1,
    icon: <FaFileAlt />,
    title: "Enroll",
    description: "Choose a course or join your organization."
  },
  {
    step: 2,
    icon: <FaLaptopCode />,
    title: "Learn",
    description: "Access content, attend sessions & complete tasks."
  },
  {
    step: 3,
    icon: <FaTrophy />,
    title: "Earn XP",
    description: "Gain points, unlock badges & levels."
  },
  {
    step: 4,
    icon: <FaAward />,
    title: "Get Certified",
    description: "Earn certificates & showcase your achievements."
  }
];

export default function Timeline() {
  return (
    <section className="journeySection">
      <div className="journeyContainerCard">
        <h2>Your Learning Journey in <span>4 Simple Steps</span></h2>

        <div className="journeyStepsGrid">
          {journeySteps.map((item, index) => (
            <div className="journeyStepItem" key={index}>
              <div className="stepIconWrapper">
                <div className="stepIconCircle">
                  {item.icon}
                </div>
                <div className="stepNumberBadge">
                  {item.step}
                </div>
                {index < journeySteps.length - 1 && (
                  <div className="stepConnector"></div>
                )}
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
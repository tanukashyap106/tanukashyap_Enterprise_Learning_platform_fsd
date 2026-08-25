import React, { useState } from "react";
import {
  FaMapMarkedAlt,
  FaCheckCircle,
  FaLock,
  FaPlay,
  FaTrophy,
  FaStar,
  FaBolt,
  FaCrown,
  FaChevronRight
} from "react-icons/fa";

export default function QuestMap() {
  const [selectedQuest, setSelectedQuest] = useState(null);

  const questStages = [
    {
      id: 1,
      stageNumber: 1,
      title: "Foundations & Syntax",
      status: "completed",
      xpReward: "+300 XP",
      badge: "Quick Starter 🎓",
      description: "Master essential variables, control flow, functions, and data structures.",
      objectives: [
        "Variables & Data Types",
        "Control Flow & Loops",
        "Functions & Scope",
        "Array Methods Practice"
      ]
    },
    {
      id: 2,
      stageNumber: 2,
      title: "DOM Manipulation & Async JS",
      status: "completed",
      xpReward: "+500 XP",
      badge: "Async Pioneer ⚡",
      description: "Understand event listeners, promises, fetch API, and async/await mechanisms.",
      objectives: [
        "DOM Selectors & Events",
        "Promises & Event Loop",
        "Fetch API & JSON parsing",
        "Async/Await pattern"
      ]
    },
    {
      id: 3,
      stageNumber: 3,
      title: "React Components & State",
      status: "active",
      xpReward: "+750 XP",
      badge: "React Craftsperson ⚛️",
      description: "Build reactive user interfaces using Functional Components, Props, & State Hooks.",
      objectives: [
        "JSX & Component Hierarchy",
        "useState & useEffect",
        "Custom Hooks",
        "Form Handling & Validation"
      ]
    },
    {
      id: 4,
      stageNumber: 4,
      title: "Backend APIs & Database Integration",
      status: "locked",
      xpReward: "+1000 XP",
      badge: "Fullstack Architect 🛡️",
      description: "Design REST APIs with Node.js/Spring Boot and integrate relational databases.",
      objectives: [
        "REST API Design Principles",
        "Database Schemas & Queries",
        "JWT Authentication & Security",
        "API Testing with Postman"
      ]
    },
    {
      id: 5,
      stageNumber: 5,
      title: "Final Boss Quest: Capstone Application",
      status: "boss",
      xpReward: "+2000 XP & Gold Badge 👑",
      badge: "Master Developer 👑",
      description: "Build and deploy a complete production-ready fullstack web platform.",
      objectives: [
        "End-to-End Feature Development",
        "Production Deployment (Vercel/Docker)",
        "Performance Optimization",
        "Final Peer Code Review"
      ]
    }
  ];

  const activeQuest = selectedQuest || questStages.find((q) => q.status === "active");

  return (
    <div className="questMapContainer">
      {/* Header Banner */}
      <div className="questMapHeader">
        <div className="questHeaderLeft">
          <div className="questMapIconBadge">
            <FaMapMarkedAlt />
          </div>
          <div>
            <h2>Gamified Quest Map 🗺️</h2>
            <p>Conquer stages, unlock XP rewards, collect badges, and defeat the Capstone Boss!</p>
          </div>
        </div>

        <div className="questStatsRow">
          <div className="questStatPill">
            <FaCheckCircle color="#10B981" />
            <span>2 / 5 Stages Completed</span>
          </div>
          <div className="questStatPill">
            <FaBolt color="#F9572A" />
            <span>800 XP Earned</span>
          </div>
        </div>
      </div>

      {/* Main Quest Path Grid */}
      <div className="questBodyGrid">
        
        {/* Visual Stage Roadmap Line */}
        <div className="questPathRoadmap">
          {questStages.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              {/* Connector Line */}
              {idx > 0 && (
                <div
                  className={`questConnectorLine ${
                    questStages[idx - 1].status === "completed" ? "completed" : ""
                  }`}
                />
              )}

              {/* Node Card */}
              <div
                className={`questNodeCard ${stage.status} ${
                  activeQuest?.id === stage.id ? "selected" : ""
                }`}
                onClick={() => setSelectedQuest(stage)}
              >
                <div className="nodeIconCircle">
                  {stage.status === "completed" && <FaCheckCircle />}
                  {stage.status === "active" && <FaPlay className="playPulse" />}
                  {stage.status === "locked" && <FaLock />}
                  {stage.status === "boss" && <FaCrown color="#F59E0B" />}
                </div>

                <div className="nodeInfo">
                  <span className="stageTag">Stage {stage.stageNumber}</span>
                  <h4>{stage.title}</h4>
                  <span className="nodeRewardText">{stage.xpReward}</span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Selected Stage Detail Drawer Panel */}
        {activeQuest && (
          <div className="questDetailCard">
            <div className="questDetailHeader">
              <span className={`questStatusPill ${activeQuest.status}`}>
                {activeQuest.status.toUpperCase()}
              </span>
              <h3>{activeQuest.title}</h3>
              <p className="questDescText">{activeQuest.description}</p>
            </div>

            <div className="questRewardBox">
              <div>
                <span className="rewardLabel">XP REWARD</span>
                <strong className="rewardVal">{activeQuest.xpReward}</strong>
              </div>
              <div>
                <span className="rewardLabel">UNLOCKABLE BADGE</span>
                <strong className="rewardVal">{activeQuest.badge}</strong>
              </div>
            </div>

            <div className="questObjectivesSection">
              <h5>Quest Objectives ({activeQuest.objectives.length})</h5>
              <ul className="objectivesList">
                {activeQuest.objectives.map((obj, i) => (
                  <li key={i}>
                    <FaCheckCircle
                      color={
                        activeQuest.status === "completed"
                          ? "#10B981"
                          : activeQuest.status === "active" && i < 2
                          ? "#10B981"
                          : "#CBD5E1"
                      }
                    />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="questActionArea">
              {activeQuest.status === "completed" ? (
                <button className="btnQuestAction completed" disabled>
                  <FaCheckCircle /> Quest Completed
                </button>
              ) : activeQuest.status === "active" ? (
                <button
                  className="btnQuestAction active"
                  onClick={() => alert(`Starting quest: ${activeQuest.title}`)}
                >
                  <FaPlay /> Continue Active Quest <FaChevronRight />
                </button>
              ) : (
                <button className="btnQuestAction locked" disabled>
                  <FaLock /> Complete previous stages to unlock
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

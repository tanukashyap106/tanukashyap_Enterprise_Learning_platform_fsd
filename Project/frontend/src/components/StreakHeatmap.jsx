import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaFire,
  FaCalendarAlt,
  FaTrophy,
  FaClock,
  FaChartLine,
  FaInfoCircle
} from "react-icons/fa";

export default function StreakHeatmap() {
  const [hoveredDay, setHoveredDay] = useState(null);
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    if (refreshProfile) {
      refreshProfile();
    }
  }, []);

  // Parse activity map safely from user context
  let activityMap = {};
  if (user && user.activity_map) {
    try {
      activityMap = typeof user.activity_map === "string" ? JSON.parse(user.activity_map) : user.activity_map;
    } catch (e) {
      console.error("Error parsing activity map:", e);
    }
  }
  if (!activityMap) activityMap = {};

  // Generate 52 weeks x 7 days ending today, aligned by day of week
  const generateHeatmapData = () => {
    const data = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const todayDate = new Date();
    const startDate = new Date();
    startDate.setDate(todayDate.getDate() - 363); // 52 weeks ago
    
    // Aligns to nearest Sunday
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek);
    
    let currentDate = new Date(startDate);
    
    for (let w = 0; w < 52; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const count = activityMap[dateKey] || 0;
        let level = 0;

        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count >= 3 && count < 5) level = 3;
        else if (count >= 5) level = 4;
        
        const dateFormatted = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
        
        const dateStr = `${dateFormatted}`;
        
        week.push({ count, level, dateStr, weekIndex: w, dayIndex: d });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      data.push(week);
    }
    return { data, months };
  };

  const { data: weeks, months } = generateHeatmapData();

  // Compute stat card calculations dynamically
  const currentStreak = user?.streak || 0;
  const longestStreak = user?.longest_streak || 0;
  
  const totalStudyTimeMins = user?.total_study_time || 0;
  const totalStudyTimeText = totalStudyTimeMins < 60 
    ? `${totalStudyTimeMins} Mins` 
    : `${Math.round(totalStudyTimeMins / 60)} Hours`;

  const activeDays = Object.keys(activityMap).filter(k => activityMap[k] > 0).length;

  return (
    <div className="heatmapContainer">
      {/* Header */}
      <div className="heatmapHeaderRow">
        <div>
          <h2>Learning Streak Heat Map 🔥</h2>
          <p>Track your daily learning consistency, lessons completed, and study streaks over the past year.</p>
        </div>

        <div className="streakBadgePill">
          <FaFire className="flameIcon" />
          <div>
            <strong>{currentStreak} Days Streak!</strong>
            <span>Active Today</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="heatmapStatsRow">
        <div className="heatmapStatCard">
          <div className="hStatIcon" style={{ background: "#FFF0EB", color: "#F9572A" }}>
            <FaFire />
          </div>
          <div>
            <strong>{currentStreak} Days</strong>
            <span>Current Streak</span>
          </div>
        </div>

        <div className="heatmapStatCard">
          <div className="hStatIcon" style={{ background: "#FEF3C7", color: "#D97706" }}>
            <FaTrophy />
          </div>
          <div>
            <strong>{longestStreak} Days</strong>
            <span>Longest Streak</span>
          </div>
        </div>

        <div className="heatmapStatCard">
          <div className="hStatIcon" style={{ background: "#E0F2FE", color: "#0284C7" }}>
            <FaClock />
          </div>
          <div>
            <strong>{totalStudyTimeText}</strong>
            <span>Total Study Time</span>
          </div>
        </div>

        <div className="heatmapStatCard">
          <div className="hStatIcon" style={{ background: "#F5F3FF", color: "#8B5CF6" }}>
            <FaChartLine />
          </div>
          <div>
            <strong>{activeDays} Days</strong>
            <span>Active Learning Days</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Card */}
      <div className="heatmapGridCard">
        <div className="heatmapGridHeader">
          <h3>52-Week Learning Activity Grid</h3>

          <div className="heatmapLegend">
            <span>Less</span>
            <div className="legendBox level-0"></div>
            <div className="legendBox level-1"></div>
            <div className="legendBox level-2"></div>
            <div className="legendBox level-3"></div>
            <div className="legendBox level-4"></div>
            <span>More</span>
          </div>
        </div>

        {/* Days & Grid */}
        <div className="heatmapScrollArea">
          <div className="heatmapDaysCol">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="heatmapGridMatrix">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="heatmapWeekCol">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    className={`heatmapSquare level-${day.level}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hover Tooltip Footer */}
        <div className="heatmapTooltipFooter">
          {hoveredDay ? (
            <span>
              <strong>{hoveredDay.count} learning activities</strong> completed on {hoveredDay.dateStr}
            </span>
          ) : (
            <span><FaInfoCircle /> Hover over any square to see daily study logs.</span>
          )}
        </div>
      </div>
    </div>
  );
}

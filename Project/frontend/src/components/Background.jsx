import React from "react";
import "../styles/background.css";

const floatingItems = [
  { icon: "✨", class: "f-item-1", delay: "0s" },
  { icon: "🎓", class: "f-item-2", delay: "2s" },
  { icon: "💡", class: "f-item-3", delay: "4s" },
  { icon: "🚀", class: "f-item-4", delay: "1s" },
  { icon: "⭐", class: "f-item-5", delay: "3s" },
  { icon: "⚡", class: "f-item-6", delay: "5s" },
  { icon: "🏆", class: "f-item-7", delay: "2.5s" },
  { icon: "📚", class: "f-item-8", delay: "4.5s" },
];

export default function Background() {
  return (
    <div className="landingBgWrapper">
      {/* Moving Grid Pattern */}
      <div className="grid"></div>

      {/* Animated Glowing Color Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="blob blob4"></div>

      {/* Animated Rotating Ambient Rings */}
      <div className="bgRing bgRing1"></div>
      <div className="bgRing bgRing2"></div>

      {/* Moving Decorative Floating Icons */}
      <div className="floatingElementsContainer">
        {floatingItems.map((item, index) => (
          <div
            key={index}
            className={`floatingBgIcon ${item.class}`}
            style={{ animationDelay: item.delay }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Moving Rising Sparkles/Particles */}
      <div className="particlesContainer">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
        <div className="particle p4"></div>
        <div className="particle p5"></div>
        <div className="particle p6"></div>
      </div>
    </div>
  );
}
import React, { useEffect, useRef } from "react";
import "../styles/paperPlane.css";

export default function PaperPlaneCursor() {
  const planeRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth * 0.7;
    let mouseY = window.innerHeight * 0.3;
    let currentX = mouseX;
    let currentY = mouseY;
    let angle = 0;
    let animId;

    const points = [];
    const maxPoints = 22;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      // Smooth lerp trailing position
      currentX += dx * 0.07;
      currentY += dy * 0.07;

      // Calculate angle pointing towards movement vector
      if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Smooth rotation angle interpolation
        let diff = targetAngle - angle;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        angle += diff * 0.1;
      }

      if (planeRef.current) {
        planeRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${angle}deg)`;
      }

      // Record points for yellow/orange dashed trajectory line
      points.push({ x: currentX, y: currentY });
      if (points.length > maxPoints) {
        points.shift();
      }

      if (trailRef.current && points.length > 1) {
        const pathData = points.reduce((acc, point, i) => {
          return `${acc} ${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        }, "");
        trailRef.current.setAttribute("d", pathData);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="paperPlaneWrapper">
      <svg className="planeTrailSvg">
        <path
          ref={trailRef}
          fill="none"
          stroke="#FFB800"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      <div ref={planeRef} className="paperPlaneIcon">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
            fill="url(#paperPlaneGradient)"
          />
          <defs>
            <linearGradient id="paperPlaneGradient" x1="2" y1="3" x2="23" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF7A45" />
              <stop offset="1" stopColor="#F9572A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

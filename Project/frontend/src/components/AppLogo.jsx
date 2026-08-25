import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";

export default function AppLogo({
  height = "56px",
  className = "",
  style = {},
  iconOnly = false,
  alt = "SkillSphere Logo",
}) {
  let authTheme = null;
  try {
    const auth = useAuth();
    authTheme = auth?.themeMode;
  } catch (e) {
    // AuthContext not available in some isolated subtrees
  }

  const [isLight, setIsLight] = useState(() => {
    if (authTheme) return authTheme === "light";
    return (
      document.documentElement.classList.contains("light-theme") ||
      document.documentElement.getAttribute("data-theme") === "light"
    );
  });

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = authTheme || document.documentElement.getAttribute("data-theme");
      const hasLightClass = document.documentElement.classList.contains("light-theme");
      setIsLight(currentTheme === "light" || hasLightClass);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, [authTheme]);

  const currentLogo = isLight ? logoLight : logoDark;

  if (iconOnly) {
    const numericHeight = parseInt(height, 10) || 42;
    return (
      <div
        className={`app-logo-icon-wrap ${className}`}
        style={{
          width: `${numericHeight}px`,
          height: `${numericHeight}px`,
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          borderRadius: "8px",
          flexShrink: 0,
          ...style,
        }}
      >
        <img
          src={currentLogo}
          alt={alt}
          style={{
            height: "100%",
            width: "auto",
            maxWidth: "none",
            objectFit: "cover",
            objectPosition: "left center",
          }}
        />
      </div>
    );
  }

  return (
    <img
      src={currentLogo}
      alt={alt}
      className={`app-logo-img ${className}`}
      style={{
        height: height,
        width: "auto",
        maxWidth: "100%",
        maxHeight: "none",
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
        transition: "transform 0.2s ease, filter 0.2s ease",
        filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.12))",
        ...style,
      }}
    />
  );
}

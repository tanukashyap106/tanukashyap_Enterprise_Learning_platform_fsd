import React from "react";

export default function UserAvatar({ user, size = "36px", className = "sdUserAvatarImg", style = {} }) {
  const avatarSrc = user?.avatar_url || user?.profile_picture;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style
      }}
    >
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={user?.full_name || user?.username || "Avatar"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span>🧑‍🎓</span>
      )}
    </div>
  );
}

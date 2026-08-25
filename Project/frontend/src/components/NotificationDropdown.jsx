import React, { useState, useEffect } from "react";
import { FaBell, FaCheckCircle, FaTimes, FaAward, FaHourglassHalf, FaBolt, FaRobot, FaBriefcase, FaUserCheck, FaChartLine } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function NotificationDropdown({ type = "student" }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dbRequests, setDbRequests] = useState([]);
  const [dbCerts, setDbCerts] = useState([]);

  const userKey = user?.email || user?.username || "default";

  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`skillsphere_read_notifications_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync read status when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`skillsphere_read_notifications_${userKey}`);
      setReadNotificationIds(saved ? JSON.parse(saved) : []);
    } catch (e) {}
  }, [userKey]);

  // Fetch real-time data from backend APIs
  useEffect(() => {
    if (!user || type !== "student") return;

    const fetchRealTimeData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        // 1. Fetch course requests
        const reqRes = await fetch(`${API_URL}/api/courses/my-requests`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const reqData = await reqRes.json();
        if (reqRes.ok && reqData.requests) {
          setDbRequests(reqData.requests);
        }

        // 2. Fetch earned certificates
        const certRes = await fetch(`${API_URL}/api/certificates`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const certData = await certRes.json();
        if (certRes.ok && certData.certificates) {
          setDbCerts(certData.certificates);
        }
      } catch (err) {
        console.error("Failed to fetch real-time notifications data:", err);
      }
    };

    fetchRealTimeData();
    // Refresh notifications every 20 seconds for real-time responsiveness
    const interval = setInterval(fetchRealTimeData, 20000);
    return () => clearInterval(interval);
  }, [user, type]);

  // Build dynamic notifications list
  const notifications = React.useMemo(() => {
    const list = [];

    if (type === "student" && user) {
      // 1. Add course requests from DB or localStorage
      const localReqs = (() => {
        try {
          const all = JSON.parse(localStorage.getItem("skillsphere_pending_course_requests") || "[]");
          return all.filter(r => r.studentEmail === userKey);
        } catch (e) {
          return [];
        }
      })();

      // Merge backend and frontend local requests
      const mergedReqs = [...dbRequests];
      localReqs.forEach(lr => {
        if (!mergedReqs.some(r => r.courseId === lr.courseId || r.id === lr.id)) {
          mergedReqs.push(lr);
        }
      });

      mergedReqs.forEach(req => {
        if (req.status === "pending") {
          list.push({
            id: `req-pending-${req.id || req.courseId}`,
            title: "Course Request Pending ⏳",
            desc: `Your enrollment request for "${req.courseTitle}" is waiting for Admin approval.`,
            time: req.requestDate ? req.requestDate.split(",")[0] : "Recently",
            icon: <FaHourglassHalf color="#F59E0B" />,
          });
        } else if (req.status === "approved") {
          list.push({
            id: `req-approved-${req.id || req.courseId}`,
            title: "Course Enrolled Successfully! 🏆",
            desc: `Your request for "${req.courseTitle}" has been approved. Start learning now!`,
            time: "Recently",
            icon: <FaAward color="#10B981" />,
          });
        } else if (req.status === "rejected") {
          list.push({
            id: `req-rejected-${req.id || req.courseId}`,
            title: "Course Request Denied ❌",
            desc: `Your request for "${req.courseTitle}" was not approved. Please contact support.`,
            time: "Recently",
            icon: <FaTimes color="#EF4444" />,
          });
        }
      });

      // 2. Add certificates
      dbCerts.forEach(cert => {
        list.push({
          id: `cert-${cert.id || cert.verificationCode}`,
          title: "Certificate Issued 🏆",
          desc: `Congratulations! Your certificate for "${cert.title}" has been issued. Ready for download.`,
          time: cert.issuedAt ? cert.issuedAt.split("T")[0] : "Recently",
          icon: <FaAward color="#F9572A" />,
        });
      });

      // 3. Add study streak
      if (user.streak > 1) {
        list.push({
          id: "streak-status",
          title: "Study Streak Active! 🔥",
          desc: `You are on a ${user.streak}-day learning streak! Keep pushing your limits.`,
          time: "Daily",
          icon: <FaBolt color="#F59E0B" />,
        });
      }

      // 4. Add XP status
      if (user.xp > 0) {
        list.push({
          id: "xp-status",
          title: "XP Level Up! ⚡",
          desc: `You have accumulated ${user.xp} XP. Keep up the amazing work!`,
          time: "Real-time",
          icon: <FaBolt color="#10B981" />,
        });
      }

      // Default welcome notification if empty
      if (list.length === 0) {
        list.push({
          id: "student-welcome",
          title: "Welcome to SkillSphere Nexus! 🚀",
          desc: "Browse our course catalog, enroll, and start building your career path.",
          time: "Now",
          icon: <FaRobot color="#38BDF8" />,
        });
      }
    } else if (type === "workforce") {
      // Admin/Workforce notifications
      const pendingReqs = (() => {
        try {
          const all = JSON.parse(localStorage.getItem("skillsphere_pending_course_requests") || "[]");
          return all.filter(r => r.status === "pending" || !r.status);
        } catch (e) {
          return [];
        }
      })();

      pendingReqs.forEach(req => {
        list.push({
          id: `wf-req-${req.id}`,
          title: "Pending Course Purchase ⏳",
          desc: `Student ${req.studentName || "Learner"} requested "${req.courseTitle}" (${req.fee || "₹4,999"}).`,
          time: req.requestDate ? req.requestDate.split(" ")[0] : "Recently",
          icon: <FaHourglassHalf color="#F59E0B" />,
        });
      });

      // Default workforce message
      list.push({
        id: "wf-welcome",
        title: "Platform Monitor Active 🌐",
        desc: "Monitoring all course enrollment requests, support tickets, and employee metrics.",
        time: "Active",
        icon: <FaChartLine color="#A855F7" />,
      });
    }

    return list;
  }, [type, user, dbRequests, dbCerts, userKey]);

  const unreadCount = notifications.filter(n => !readNotificationIds.includes(n.id)).length;

  // Read theme mode safely from AuthContext
  let themeMode = "light";
  try {
    const auth = useAuth();
    if (auth && auth.themeMode) {
      themeMode = auth.themeMode;
    }
  } catch (e) {
    themeMode = "light";
  }

  const isLight = themeMode === "light";

  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const updated = [...new Set([...readNotificationIds, ...allIds])];
    setReadNotificationIds(updated);
    try {
      localStorage.setItem(`skillsphere_read_notifications_${userKey}`, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleMarkSingleRead = (id, e) => {
    if (e) e.stopPropagation();
    const updated = [...new Set([...readNotificationIds, id])];
    setReadNotificationIds(updated);
    try {
      localStorage.setItem(`skillsphere_read_notifications_${userKey}`, JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Bell Button Icon - Highly visible in both light & dark theme */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isLight ? "#FFFFFF" : "rgba(255,255,255,0.08)",
          border: isLight ? "1px solid #CBD5E1" : "1px solid rgba(255,255,255,0.18)",
          color: isLight ? "#F9572A" : "#FFFFFF",
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s ease",
          boxShadow: isLight ? "0 2px 8px rgba(0, 0, 0, 0.08)" : "0 2px 8px rgba(0, 0, 0, 0.3)"
        }}
        title="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              background: "#F9572A",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: 800,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(249, 87, 42, 0.5)",
              border: isLight ? "2px solid #FFFFFF" : "2px solid #0F172A"
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notification Popover Dropdown - Fully Theme-Aware */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "52px",
            right: "0",
            width: "360px",
            background: isLight ? "#FFFFFF" : "#0F172A",
            border: isLight ? "1px solid #E2E8F0" : "1px solid #334155",
            borderRadius: "16px",
            boxShadow: isLight ? "0 12px 35px rgba(0, 0, 0, 0.12)" : "0 12px 40px rgba(0,0,0,0.6)",
            zIndex: 9999,
            overflow: "hidden",
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              background: isLight ? "#F8FAFC" : "#1E293B",
              borderBottom: isLight ? "1px solid #E2E8F0" : "1px solid #334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaBell color="#F9572A" />
              <strong style={{ fontSize: "14px", color: isLight ? "#0F172A" : "#F8FAFC" }}>
                {type === "workforce" ? "Workforce Notifications" : "Notifications"}
              </strong>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: "10px",
                    background: "#FFF0EB",
                    color: "#F9572A",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    fontWeight: 700
                  }}
                >
                  {unreadCount} New
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {unreadCount > 0 && (
                <span
                  onClick={handleMarkAllRead}
                  style={{
                    fontSize: "11px",
                    color: "#F9572A",
                    cursor: "pointer",
                    fontWeight: 700
                  }}
                >
                  Mark read
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: isLight ? "#64748B" : "#94A3B8",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: "340px", overflowY: "auto", padding: "4px 0" }}>
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={(e) => handleMarkSingleRead(item.id, e)}
                style={{
                  padding: "12px 18px",
                  borderBottom: isLight ? "1px solid #F1F5F9" : "1px solid #1E293B",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  transition: "background 0.2s ease",
                  cursor: "pointer",
                  background: readNotificationIds.includes(item.id)
                    ? (isLight ? "#FFFFFF" : "#0F172A")
                    : (isLight ? "#FFF5F2" : "#1E1A29")
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: isLight ? "#F1F5F9" : "#1E293B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0
                  }}
                >
                  {item.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: readNotificationIds.includes(item.id) ? 600 : 800, color: isLight ? "#0F172A" : "#F8FAFC", marginBottom: "2px" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "11px", color: isLight ? "#475569" : "#94A3B8", lineHeight: "1.4", marginBottom: "4px" }}>
                    {item.desc}
                  </div>
                  <span style={{ fontSize: "10px", color: isLight ? "#94A3B8" : "#64748B", fontWeight: 600 }}>
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px",
              background: isLight ? "#F8FAFC" : "#1E293B",
              borderTop: isLight ? "1px solid #E2E8F0" : "1px solid #334155",
              textAlign: "center"
            }}
          >
            <span style={{ fontSize: "11px", color: isLight ? "#64748B" : "#94A3B8", fontWeight: 600 }}>
              SkillSphere Real-Time Notification Center ✓
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

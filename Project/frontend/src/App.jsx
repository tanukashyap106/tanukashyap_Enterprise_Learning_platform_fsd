import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import FeaturesPage from "./pages/FeaturePage";
import LearningPage from "./pages/LearningPage";
import WorkforcePage from "./pages/WorkforcePage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StudentHome from "./pages/StudentHome";
import WorkforceDashboard from "./pages/WorkforceDashboard";
import WorkforceHome from "./pages/WorkforceHome";
import StudentFeatures from "./pages/StudentFeatures";
import WorkforceFeatures from "./pages/WorkforceFeatures";
import SandboxPage from "./pages/SandboxPage";
import CoursesPage from "./pages/CoursesPage";
import CertificatesPage from "./pages/CertificatesPage";
import ProgressPage from "./pages/ProgressPage";
import TeamSpace from "./pages/TeamSpace";
import FloatingChatbot from "./components/FloatingChatbot";
import HomePage from "./pages/HomePage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAdmin } from "./context/AdminContext";

import LearningPathsPage from "./pages/LearningPathsPage";
import AIStudyBuddyPage from "./pages/AIStudyBuddyPage";
import OpportunityFeedPage from "./pages/OpportunityFeedPage";
import BadgesPage from "./pages/BadgesPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import DailyQuestsPage from "./pages/DailyQuestsPage";
import CodeArenaPage from "./pages/CodeArenaPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import CareerRoadmapPage from "./pages/CareerRoadmapPage";

import StudentProfilePage from "./pages/StudentProfilePage";
import ServicesCatalogPage from "./pages/ServicesCatalogPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import CertificationTrackingPage from "./pages/CertificationTrackingPage";
import CourseManagementPage from "./pages/CourseManagementPage";
import TrackingDashboardPage from "./pages/TrackingDashboardPage";
import ComplaintRenewalTrackingPage from "./pages/ComplaintRenewalTrackingPage";
import JobSearchPage from "./pages/JobSearchPage";


function AdminProtectedRoute({ children }) {
  const { isAdminAuth } = useAdmin();
  if (!isAdminAuth) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg-primary)', color: 'var(--accent)',
        fontFamily: 'Orbitron, sans-serif', fontSize: '16px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const { themeMode, themeAccent } = useAuth();
  const isDashboardRoute = ["/workforce-dashboard", "/workforce-home", "/student-home", "/team-space"].includes(location.pathname);

  // Re-apply theme CSS vars on every route change so theme persists globally
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/student-features" element={<StudentFeatures />} />
        <Route path="/student-hub" element={<StudentFeatures />} />
        <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
        <Route path="/workforce" element={<WorkforcePage />} />
        <Route path="/work-hub" element={<WorkforcePage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard/*" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

        {/* Protected routes */}
        {/* /dashboard redirects to student-home */}
        <Route path="/dashboard" element={<Navigate to="/student-home" replace />} />
        <Route path="/workforce-dashboard" element={<ProtectedRoute><WorkforceDashboard /></ProtectedRoute>} />
        <Route path="/student-home" element={<ProtectedRoute><StudentHome /></ProtectedRoute>} />
        <Route path="/workforce-home" element={<ProtectedRoute><WorkforceHome /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/workforce-features" element={<ProtectedRoute><WorkforceFeatures /></ProtectedRoute>} />
        <Route path="/discussions" element={<Navigate to="/student-home" replace />} />
        <Route path="/team-space"   element={<ProtectedRoute><TeamSpace /></ProtectedRoute>} />
        <Route path="/resources" element={<Navigate to="/student-home" replace />} />
        <Route path="/certificate" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/learning-paths" element={<ProtectedRoute><LearningPathsPage /></ProtectedRoute>} />
        <Route path="/assignments" element={<Navigate to="/student-home" replace />} />
        <Route path="/ai-buddy" element={<ProtectedRoute><AIStudyBuddyPage /></ProtectedRoute>} />
        <Route path="/ai-study-buddy" element={<ProtectedRoute><AIStudyBuddyPage /></ProtectedRoute>} />
        <Route path="/career-roadmap" element={<ProtectedRoute><CareerRoadmapPage /></ProtectedRoute>} />
        <Route path="/career-roadmap-page" element={<ProtectedRoute><CareerRoadmapPage /></ProtectedRoute>} />
        <Route path="/opportunity-feed" element={<ProtectedRoute><OpportunityFeedPage /></ProtectedRoute>} />
        <Route path="/job-search" element={<ProtectedRoute><OpportunityFeedPage /></ProtectedRoute>} />
        <Route path="/job-search-portal" element={<ProtectedRoute><OpportunityFeedPage /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/daily-quests" element={<ProtectedRoute><DailyQuestsPage /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
        <Route path="/code-arena" element={<ProtectedRoute><CodeArenaPage /></ProtectedRoute>} />
        <Route path="/codearena" element={<ProtectedRoute><CodeArenaPage /></ProtectedRoute>} />
        <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
        <Route path="/create-flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
        
        {/* New Pages Routes */}
        <Route path="/student-profile" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
        <Route path="/services-catalog" element={<ProtectedRoute><ServicesCatalogPage /></ProtectedRoute>} />
        <Route path="/assessments" element={<ProtectedRoute><AssessmentsPage /></ProtectedRoute>} />
        <Route path="/certification-tracking" element={<ProtectedRoute><CertificationTrackingPage /></ProtectedRoute>} />
        <Route path="/course-management" element={<ProtectedRoute><CourseManagementPage /></ProtectedRoute>} />
        <Route path="/tracking-dashboard" element={<ProtectedRoute><TrackingDashboardPage /></ProtectedRoute>} />
        <Route path="/complaint-tracking" element={<ProtectedRoute><ComplaintRenewalTrackingPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/student-home" replace />} />

      </Routes>
      {!isDashboardRoute && <FloatingChatbot />}
    </>
  );
}

export default App;

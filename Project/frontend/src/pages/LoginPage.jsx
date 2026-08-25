import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import {
  FaGraduationCap,
  FaBriefcase,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt
} from "react-icons/fa";

import studentLoginImg from "../assets/student_login_illustration.png";
import workforceLoginImg from "../assets/workforce_login_illustration.png";
import darkStudentLoginImg from "../assets/dark_student_login_illustration.png";
import darkWorkforceLoginImg from "../assets/dark_workforce_login_illustration.png";

import "../styles/loginPage.css";

import AppLogo from "../components/AppLogo";

export default function LoginPage() {
  const { user, loginLocal, loginWithGoogle, logout, themeMode } = useAuth();
  const isDarkMode = themeMode === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  // Selected Role State (STUDENT or EMPLOYEE)
  const [role, setRole] = useState(location.state?.role || 'STUDENT');
  const roleRef = useRef(role);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showDevBypass, setShowDevBypass] = useState(true);
  const [devEmail, setDevEmail] = useState("");
  const googleBtnRef = useRef(null);

  // Sync ref to avoid stale closures in Google API callback
  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'google_mock_client_id_for_testing') {
      return;
    }
    const initGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                setError('');
                const loggedUser = await loginWithGoogle(response.credential, roleRef.current);
                if (loggedUser) {
                  if (roleRef.current === 'EMPLOYEE' && loggedUser.role === 'STUDENT') {
                    setError('Enter valid workplace email id');
                    await logout();
                    return;
                  }
                  if (roleRef.current === 'STUDENT' && loggedUser.role !== 'STUDENT') {
                    setError('This account is registered as a Workforce user. Please use the Workforce Portal.');
                    await logout();
                    return;
                  }
                  if (loggedUser.role === 'STUDENT') {
                    navigate('/student-home');
                  } else {
                    navigate('/workforce-home');
                  }
                }
              } catch (err) {
                setError(err.message || 'Google login failed');
              }
            }
          });
          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnRef.current,
              { theme: 'outline', size: 'large', width: '100%' }
            );
          }
        } catch (err) {
          console.warn('Google accounts initialization warning:', err);
        }
      } else {
        setTimeout(initGoogleSignIn, 100);
      }
    };
    initGoogleSignIn();
  }, [loginWithGoogle]);

  if (user) {
    return <Navigate to={user.role === 'STUDENT' ? '/student-home' : '/workforce-home'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError("");
      const loggedUser = await loginLocal(email, password);
      if (loggedUser) {
        if (role === 'EMPLOYEE' && loggedUser.role === 'STUDENT') {
          setError('Enter valid workplace email id');
          await logout();
          return;
        }
        if (role === 'STUDENT' && loggedUser.role !== 'STUDENT') {
          setError('This account is registered as a Workforce user. Please use the Workforce Portal.');
          await logout();
          return;
        }
        if (loggedUser.role === 'STUDENT') {
          navigate('/student-home');
        } else {
          navigate('/workforce-home');
        }
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleDevBypass = async (e) => {
    e.preventDefault();
    const targetEmail = devEmail || (role === 'STUDENT' ? 'student@skillsphere.com' : 'employee@skillsphere.com');
    try {
      setError("");
      const loggedUser = await loginWithGoogle(`mock_google_token_${targetEmail}`, role);
      if (loggedUser) {
        if (role === 'EMPLOYEE' && loggedUser.role === 'STUDENT') {
          setError('Enter valid workplace email id');
          await logout();
          return;
        }
        if (role === 'STUDENT' && loggedUser.role !== 'STUDENT') {
          setError('This account is registered as a Workforce user. Please use the Workforce Portal.');
          await logout();
          return;
        }
        if (loggedUser.role === 'STUDENT') {
          navigate('/student-home');
        } else {
          navigate('/workforce-home');
        }
      }
    } catch (err) {
      setError(err.message || "Developer bypass login failed");
    }
  };

  return (
    <div className="loginPageWrapper" style={{ paddingTop: '24px' }}>
      <Background />
      <PaperPlaneCursor />

      {/* Top Header Bar */}
      <header className="registerHeaderBar">
        <Link to="/" className="registerLogoBrand" style={{ display: "inline-flex", alignItems: "center" }}>
          <AppLogo height="56px" />
        </Link>

        <button className="btnBackHome" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </button>
      </header>

      {/* Main Split Card Container */}
      <div className="loginMainContainer">
        
        {/* ── LEFT PANEL (ILLUSTRATION & COPY) ── */}
        <div className="loginLeftPanel">
          <div className="leftDotsPattern">• • • • • •</div>

          <div className="leftCopyHeader">
            <h1>Welcome Back!</h1>
            <h2>
              {role === 'STUDENT' ? (
                <>Let's continue <br />your learning journey</>
              ) : (
                <>Let's build, collaborate <br />and create impact.</>
              )}
            </h2>
            <p>
              {role === 'STUDENT'
                ? "Access your personalized learning space and keep progressing towards your goals."
                : "Access your workspace and tools to manage projects, teams and drive results."}
            </p>
          </div>

          <div className="leftIllustrationBox">
            <img
              src={role === 'STUDENT' ? (isDarkMode ? darkStudentLoginImg : studentLoginImg) : (isDarkMode ? darkWorkforceLoginImg : workforceLoginImg)}
              alt={role === 'STUDENT' ? "Student Login Illustration" : "Workforce Login Illustration"}
              className="loginIllustrationImg"
            />
          </div>
        </div>

        {/* ── RIGHT PANEL (ACCESS PORTAL FORM) ── */}
        <div className="loginRightPanel">
          <div className="portalTitleHeader">
            <h2>{role === 'STUDENT' ? "Student Access Portal" : "Workforce Access Portal"}</h2>
            <div className="orangeUnderline"></div>
          </div>

          {/* Segmented Role Switcher */}
          <div className="roleSegmentedBar">
            <button
              type="button"
              className={`roleSegmentBtn ${role === 'STUDENT' ? 'active' : ''}`}
              onClick={() => { setRole('STUDENT'); setError(''); }}
            >
              <FaGraduationCap /> Student
            </button>

            <button
              type="button"
              className={`roleSegmentBtn ${role === 'EMPLOYEE' ? 'active' : ''}`}
              onClick={() => { setRole('EMPLOYEE'); setError(''); }}
            >
              <FaBriefcase /> Workforce
            </button>
          </div>

          {error && <div className="errorMessageCard">{error}</div>}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="loginFormContent" autoComplete="off" data-lpignore="true" data-1p-ignore="true">
            {/* Email Field */}
            <div className="inputFieldGroup">
              <label htmlFor="login-email">Email Address</label>
              <div className="inputWithIconWrapper">
                <FaEnvelope className="fieldPrefixIcon" />
                <input
                  id="login-email"
                  type="email"
                  name="user_email_address"
                  autoComplete="off"
                  data-lpignore="true"
                  placeholder={role === 'STUDENT' ? "student@gmail.com" : "workforce@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="inputFieldGroup">
              <label htmlFor="login-password">Password</label>
              <div className="inputWithIconWrapper">
                <FaLock className="fieldPrefixIcon" />
                <input
                  id="login-password"
                  name="user_sec_token"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="passwordEyeToggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password Options */}
            <div className="formOptionsRow">
              <label className="rememberCheckboxLabel">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="forgotPassLink">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btnSubmitLogin">
              Log In <FaArrowRight />
            </button>

            {/* Divider */}
            <div className="orDividerLine">
              <span>or continue with</span>
            </div>

            {/* Google Login Button */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
              <div ref={googleBtnRef} style={{ width: '100%' }}></div>
            </div>
          </form>

          {/* Bottom Signup Text */}
          <div className="bottomAuthText" style={{ marginTop: '16px' }}>
            Don't have an account?{" "}
            {role === 'STUDENT' ? (
              <Link to="/register" state={{ role: 'STUDENT' }}>Sign up here</Link>
            ) : (
              <Link to="/register" state={{ role: 'EMPLOYEE' }}>Contact Admin</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

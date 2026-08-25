import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';
import PaperPlaneCursor from '../components/PaperPlaneCursor';
import {
  FaGraduationCap,
  FaBriefcase,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt
} from 'react-icons/fa';

import studentPortalImg from '../assets/student_portal_illustration.png';
import workforcePortalImg from '../assets/workforce_portal_illustration.png';
import darkStudentPortalImg from '../assets/dark_student_portal_illustration.png';
import darkWorkforcePortalImg from '../assets/dark_workforce_portal_illustration.png';

import '../styles/loginPage.css';
import '../styles/registerPage.css';

import AppLogo from "../components/AppLogo";

export default function RegisterPage() {
  const { signupLocal, loginWithGoogle, logout, themeMode } = useAuth();
  const isDarkMode = themeMode === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.role || 'STUDENT';
  const initialStep = location.state?.step || 1;

  const [step, setStep] = useState(initialStep); // 1 = Choice, 2 = Form
  const [role, setRole] = useState(initialRole);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDevBypass, setShowDevBypass] = useState(true);

  const googleBtnRef = useRef(null);
  const roleRef = useRef(role);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'google_mock_client_id_for_testing') {
      return;
    }
    const initGoogleSignUp = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                setError('');
                const registeredUser = await loginWithGoogle(response.credential, roleRef.current);
                if (registeredUser) {
                  if (roleRef.current === 'EMPLOYEE' && (registeredUser.email.toLowerCase().includes('student') || registeredUser.email.toLowerCase().endsWith('.edu'))) {
                    setError('Enter valid workplace email id');
                    await logout();
                    return;
                  }
                  if (registeredUser.role === 'STUDENT') {
                    navigate('/student-home');
                  } else {
                    navigate('/workforce-home');
                  }
                }
              } catch (err) {
                setError(err.message || 'Google registration failed');
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
        setTimeout(initGoogleSignUp, 100);
      }
    };
    if (step === 2) {
      initGoogleSignUp();
    }
  }, [step, loginWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'EMPLOYEE' && (email.toLowerCase().includes('student') || email.toLowerCase().endsWith('.edu'))) {
      setError('Enter valid workplace email id');
      return;
    }
    try {
      setError('');
      const registeredUser = await signupLocal(username, fullName, email, password, role);
      if (registeredUser && registeredUser.role === 'STUDENT') {
        navigate('/student-home');
      } else {
        navigate('/workforce-home');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleDevBypass = async (e) => {
    e.preventDefault();
    const targetEmail = email || (role === 'STUDENT' ? 'newstudent@skillsphere.com' : 'newemployee@company.com');
    if (role === 'EMPLOYEE' && (targetEmail.toLowerCase().includes('student') || targetEmail.toLowerCase().endsWith('.edu'))) {
      setError('Enter valid workplace email id');
      return;
    }
    try {
      setError('');
      const registeredUser = await loginWithGoogle(`mock_google_token_${targetEmail}`, role);
      if (registeredUser && registeredUser.role === 'STUDENT') {
        navigate('/student-home');
      } else {
        navigate('/workforce-home');
      }
    } catch (err) {
      setError(err.message || 'Developer bypass registration failed');
    }
  };

  return (
    <div className="registerPageWrapper">
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

      {/* Main Container */}
      <main className="registerMainContent">
        {/* ── STEP 1: CHOICE PANEL (IMAGE 2) ── */}
        {step === 1 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="choiceHeaderSection">
              <div className="choiceHeaderIcon"><FaGraduationCap /></div>
              <h1>Join SkillSphere</h1>
              <p>Choose your account type to get started</p>
            </div>

            <div className="choiceCardsGrid">
              {/* Student Card */}
              <div className="accountTypeCard">
                <div className="typeIconBadge"><FaGraduationCap /></div>
                <h3>Student</h3>
                <p>Enroll in courses, complete quizzes, earn XP and badges.</p>

                <div className="typeIllustrationBox">
                  <img src={isDarkMode ? darkStudentPortalImg : studentPortalImg} alt="Student Portal Graphic" className="typeIllustrationImg" />
                </div>

                <button
                  className="btnSignUpType"
                  onClick={() => { setRole('STUDENT'); setStep(2); }}
                >
                  Sign Up as Student <FaArrowRight />
                </button>
              </div>

              {/* Workforce Card */}
              <div className="accountTypeCard">
                <div className="typeIconBadge"><FaBriefcase /></div>
                <h3>Workforce</h3>
                <p>Manage workspace profiles, assign projects, track attendance and scores.</p>

                <div className="typeIllustrationBox">
                  <img src={isDarkMode ? darkWorkforcePortalImg : workforcePortalImg} alt="Workforce Portal Graphic" className="typeIllustrationImg" />
                </div>

                <button
                  className="btnSignUpType"
                  onClick={() => { setRole('EMPLOYEE'); setStep(2); }}
                >
                  Sign Up as Workforce <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: REGISTRATION FORM (IMAGE 3 & IMAGE 4) ── */}
        {step === 2 && (
          <div className="registerFormCard">
            <div className="regHeaderIconBadge">
              {role === 'STUDENT' ? <FaGraduationCap /> : <FaBriefcase />}
            </div>

            <h1>
              {role === 'STUDENT' ? (
                <>Student <span>Registration</span></>
              ) : (
                <>Workforce <span>Registration</span></>
              )}
            </h1>

            <p className="regSubtext">Create your profile using the HTML form or Google</p>
            <div className="orangeUnderline" style={{ marginBottom: '24px' }}></div>

            {error && <div className="errorMessageCard">{error}</div>}

            <form onSubmit={handleSubmit} className="loginFormContent">
              {/* Username Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-username">Username</label>
                <div className="inputWithIconWrapper">
                  <FaUser className="fieldPrefixIcon" />
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Full Name Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-fullname">Full Name</label>
                <div className="inputWithIconWrapper">
                  <FaUser className="fieldPrefixIcon" />
                  <input
                    id="reg-fullname"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-email">Email Address</label>
                <div className="inputWithIconWrapper">
                  <FaEnvelope className="fieldPrefixIcon" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-password">Password</label>
                <div className="inputWithIconWrapper">
                  <FaLock className="fieldPrefixIcon" />
                  <input
                    id="reg-password"
                    name="reg_sec_code"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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

              {/* Complete Sign-Up Button */}
              <button type="submit" className="btnSubmitLogin" style={{ marginTop: '10px' }}>
                Complete {role === 'STUDENT' ? 'Student' : 'Workforce'} Sign-Up
              </button>

              {/* Divider */}
              <div className="orDividerLine">
                <span>OR</span>
              </div>

              {/* Sign up with Google */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <div ref={googleBtnRef} style={{ width: '100%' }}></div>
              </div>

              <button
                type="button"
                className="btnBackTypes"
                onClick={() => setStep(1)}
              >
                Back to account types
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', padding: '20px 0', zIndex: 5 }}>
        &copy; {new Date().getFullYear()} SkillSphere. All rights reserved.
      </footer>
    </div>
  );
}

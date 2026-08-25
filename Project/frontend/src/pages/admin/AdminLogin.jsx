import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FaShieldAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import Background from '../../components/Background';
import AppLogo from '../../components/AppLogo';
import '../../styles/loginPage.css';

export default function AdminLogin() {
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(email, password)) {
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin credentials. Access Denied.');
    }
  };

  return (
    <div className="loginPageWrapper">
      <Background />

      <div className="loginMainContainer" style={{ maxWidth: '460px', gridTemplateColumns: '1fr' }}>
        <div className="loginRightPanel" style={{ borderRadius: '28px', padding: '48px 40px' }}>
          
          <div className="portalTitleHeader">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <AppLogo height="54px" />
            </div>
            <div className="regHeaderIconBadge" style={{ width: '64px', height: '64px', fontSize: '28px' }}>
              <FaShieldAlt />
            </div>

            <h2 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Admin Portal</h2>
            <p className="regSubtext" style={{ margin: '0 0 12px 0' }}>
              Secure access for SkillSphere administrators.
            </p>
            <div className="orangeUnderline"></div>
          </div>

          {error && <div className="errorMessageCard">{error}</div>}

          <form onSubmit={handleLogin} className="loginFormContent" autoComplete="off" data-lpignore="true" data-1p-ignore="true">
            <div className="inputFieldGroup">
              <label htmlFor="admin-email">Admin Email</label>
              <div className="inputWithIconWrapper">
                <FaEnvelope className="fieldPrefixIcon" />
                <input
                  id="admin-email"
                  type="email"
                  name="admin_user_email"
                  autoComplete="off"
                  data-lpignore="true"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skillsphere.com"
                />
              </div>
            </div>

            <div className="inputFieldGroup">
              <label htmlFor="admin-password">Master Password</label>
              <div className="inputWithIconWrapper">
                <FaLock className="fieldPrefixIcon" />
                <input
                  id="admin-password"
                  name="admin_sec_code"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button type="submit" className="btnSubmitLogin" style={{ marginTop: '12px' }}>
              Authenticate
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F9572A',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaArrowLeft /> Return to Homepage
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footerSection">
      <div className="footerContainer">
        <div className="footerTopGrid">
          {/* Col 1: Brand */}
          <div className="footerBrandCol">
            <Link to="/" className="footerLogo" onClick={handleScrollTop} style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="56px" />
            </Link>
            <p className="footerBrandDesc">
              Empowering students and organizations through gamified learning and workforce development.
            </p>
            <div className="socialIconsRow">
              <a href="#facebook" className="socialIconBtn" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#twitter" className="socialIconBtn" aria-label="Twitter"><FaTwitter /></a>
              <a href="#linkedin" className="socialIconBtn" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#instagram" className="socialIconBtn" aria-label="Instagram"><FaInstagram /></a>
              <a href="#youtube" className="socialIconBtn" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="footerColTitle">Quick Links</h4>
            <ul className="footerLinkList">
              <li><Link to="/" onClick={handleScrollTop}>Home</Link></li>
              <li><Link to="/features" onClick={handleScrollTop}>Features</Link></li>
              <li><Link to="/student-features" onClick={handleScrollTop}>Students Hub</Link></li>
              <li><Link to="/workforce" onClick={handleScrollTop}>Work Hub</Link></li>
            </ul>
          </div>

          {/* Col 3: For Organizations */}
          <div>
            <h4 className="footerColTitle">For Organizations</h4>
            <ul className="footerLinkList">
              <li><Link to="/workforce" onClick={handleScrollTop}>Why SkillSphere</Link></li>
              <li><Link to="/workforce-features" onClick={handleScrollTop}>Solutions</Link></li>
              <li><Link to="/admin-login" onClick={handleScrollTop}>Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footerBottomRow">
          <div>© 2025 SkillSphere. All rights reserved.</div>
          <div className="legalLinks">
            <Link to="/" onClick={handleScrollTop}>Privacy Policy</Link>
            <span>|</span>
            <Link to="/" onClick={handleScrollTop}>Terms of Service</Link>
            <span>|</span>
            <Link to="/" onClick={handleScrollTop}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Background from "../components/Background";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import UserSelection from "../components/UserSelection";
import Timeline from "../components/Timeline";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import "../styles/landing.css";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT') {
        navigate('/student-home');
      } else {
        navigate('/workforce-home');
      }
    }
  }, [user, navigate]);

  return (
    <div className="landing">
      <Background />
      <PaperPlaneCursor />

      <Navbar />

      <Hero />

      <Stats />

      <Features />

      <Testimonials />

      <UserSelection />

      <Timeline />

      <CTA />

      <Footer />
    </div>
  );
}

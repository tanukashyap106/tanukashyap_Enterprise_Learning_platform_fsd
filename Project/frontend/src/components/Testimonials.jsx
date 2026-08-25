import React from "react";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../styles/testimonials.css";

const reviews = [
  {
    quote: "SkillSphere completely changed the way I learn. Tracking progress, earning badges and joining challenges keeps me motivated every day.",
    name: "Aarav Sharma",
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  },
  {
    quote: "Managing employee learning paths has never been easier. Training completion increased by more than 40%.",
    name: "Priya Singh",
    role: "HR Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
  },
  {
    quote: "The personalized dashboard and certification tracking helped me upskill while balancing my daily work.",
    name: "Rahul Das",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
  }
];

export default function Testimonials() {
  return (
    <section className="testimonialsSection">
      <div className="testimonialsHeader">
        <div>
          <div className="testimonialsTag">TESTIMONIALS</div>
          <h2 className="testimonialsTitle">Loved by Learners & <span>Organizations</span></h2>
        </div>

        <div className="carouselControls">
          <button className="controlBtn" title="Previous Testimonial"><FaArrowLeft /></button>
          <button className="controlBtn" title="Next Testimonial"><FaArrowRight /></button>
        </div>
      </div>

      <div className="testimonialsGrid">
        {reviews.map((review, index) => (
          <div className="testimonialCard" key={index}>
            <div>
              <div className="quoteIcon">“</div>
              <p className="reviewText">"{review.quote}"</p>
              <div className="starsRow">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>

            <div className="userProfileRow">
              <img src={review.avatar} alt={review.name} className="testimonialAvatar" />
              <div className="userInfo">
                <h4>{review.name}</h4>
                <span>{review.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
import React, { useState } from "react";
import {
  FaSearch,
  FaBriefcase,
  FaTrophy,
  FaCode,
  FaUserGraduate,
  FaBookmark,
  FaRegBookmark,
  FaExternalLinkAlt,
  FaClock,
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar
} from "react-icons/fa";

export default function OpportunityFeed() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([1, 3]);

  const opportunities = [
    {
      id: 1,
      type: "internship",
      title: "Frontend Developer Intern",
      company: "TechNova Solutions",
      location: "Remote",
      stipend: "$1,200 / mo",
      deadline: "3 days left",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      matchScore: "95%",
      description: "Join our core UI engineering team to build scalable dashboard tools using modern React and web APIs."
    },
    {
      id: 2,
      type: "hackathon",
      title: "Global AI & Web3 Hackathon 2026",
      company: "DevSphere Org",
      location: "Online / Global",
      stipend: "$25,000 Prizes",
      deadline: "7 days left",
      tags: ["AI/ML", "Smart Contracts", "Python"],
      matchScore: "88%",
      description: "48-hour global virtual hackathon. Build innovative AI or decentralized solutions for real-world impact."
    },
    {
      id: 3,
      type: "project",
      title: "Open Source Contributor - SkillSphere CLI",
      company: "SkillSphere Core Team",
      location: "Open Source",
      stipend: "+500 XP Rewards",
      deadline: "Open Always",
      tags: ["Node.js", "CLI", "JavaScript"],
      matchScore: "98%",
      description: "Contribute code to our developer toolchain. Mentorship and code reviews provided by Senior Engineers."
    },
    {
      id: 4,
      type: "mentorship",
      title: "1-on-1 Fullstack Career Mentorship",
      company: "Google Developers Group",
      location: "Virtual",
      stipend: "Free Mentorship",
      deadline: "5 seats left",
      tags: ["System Design", "Node.js", "Java"],
      matchScore: "91%",
      description: "Pair with industry engineers to polish your resume, conduct mock interviews, and review architecture."
    },
    {
      id: 5,
      type: "internship",
      title: "UI/UX Design & Research Fellow",
      company: "PixelCraft Studios",
      location: "Hybrid (Bangalore)",
      stipend: "₹35,000 / mo",
      deadline: "10 days left",
      tags: ["Figma", "User Testing", "Prototyping"],
      matchScore: "82%",
      description: "Work alongside Senior Designers conducting user testing, wireframing, and interactive design prototypes."
    }
  ];

  const toggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
    }
  };

  const filteredOpportunities = opportunities.filter((op) => {
    const matchesCategory = filterCategory === "all" || op.type === filterCategory;
    const matchesSearch =
      op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="oppFeedContainer">
      {/* Header */}
      <div className="oppHeaderRow">
        <div>
          <h2>Opportunity Feed 🚀</h2>
          <p>Hand-picked internships, hackathons, open-source projects & mentorship slots tailored for you.</p>
        </div>

        <div className="oppSearchInputWrapper">
          <FaSearch className="oppSearchIcon" />
          <input
            type="text"
            placeholder="Search roles, tech tags, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="oppFilterTabs">
        <button
          className={`oppTab ${filterCategory === "all" ? "active" : ""}`}
          onClick={() => setFilterCategory("all")}
        >
          All Opportunities ({opportunities.length})
        </button>
        <button
          className={`oppTab ${filterCategory === "internship" ? "active" : ""}`}
          onClick={() => setFilterCategory("internship")}
        >
          <FaBriefcase /> Internships
        </button>
        <button
          className={`oppTab ${filterCategory === "hackathon" ? "active" : ""}`}
          onClick={() => setFilterCategory("hackathon")}
        >
          <FaTrophy /> Hackathons
        </button>
        <button
          className={`oppTab ${filterCategory === "project" ? "active" : ""}`}
          onClick={() => setFilterCategory("project")}
        >
          <FaCode /> Open Source Projects
        </button>
        <button
          className={`oppTab ${filterCategory === "mentorship" ? "active" : ""}`}
          onClick={() => setFilterCategory("mentorship")}
        >
          <FaUserGraduate /> Mentorship
        </button>
      </div>

      {/* Opportunities List */}
      <div className="oppCardsGrid">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((op) => (
            <div key={op.id} className="oppCard">
              <div className="oppCardHeader">
                <div className="oppCardTitleInfo">
                  <span className={`oppTypeBadge ${op.type}`}>
                    {op.type.toUpperCase()}
                  </span>
                  <h4>{op.title}</h4>
                  <span className="oppCompanyText">{op.company}</span>
                </div>

                <div className="oppCardRightMeta">
                  <span className="oppMatchBadge">
                    <FaStar color="#F59E0B" /> {op.matchScore} Match
                  </span>
                  <button
                    className="oppBookmarkBtn"
                    onClick={() => toggleBookmark(op.id)}
                  >
                    {bookmarkedIds.includes(op.id) ? (
                      <FaBookmark color="#F9572A" />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div>
              </div>

              <p className="oppDescription">{op.description}</p>

              <div className="oppMetaRow">
                <span><FaMapMarkerAlt /> {op.location}</span>
                <span><FaDollarSign /> {op.stipend}</span>
                <span><FaClock /> {op.deadline}</span>
              </div>

              <div className="oppTagsRow">
                {op.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="oppTagPill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="oppCardFooter">
                <button
                  className="btnApplyOpp"
                  onClick={() => alert(`Redirecting to application portal for ${op.title}`)}
                >
                  Apply Now <FaExternalLinkAlt />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="oppEmptyState">
            <p>No opportunities match your filter search. Try broadening your keywords!</p>
          </div>
        )}
      </div>
    </div>
  );
}

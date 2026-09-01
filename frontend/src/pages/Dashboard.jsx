import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
    FiFileText,
    FiTarget,
    FiTrendingUp,
    FiMap,
    FiUser,
    FiMessageSquare,
    FiSettings,
    FiLogOut,
    FiArrowLeft,
    FiMenu,
    FiX,
} from "react-icons/fi";

import AnimatedBackground from "../components/AnimatedBackground";
import API from "../services/api";

import "../styles/Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [resumeScore, setResumeScore] = useState(null);
    const [careerProgress, setCareerProgress] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [hasResume, setHasResume] = useState(false);
        const handleLogout = () => {
        localStorage.setItem(
            "roadmapLogoutTime",
            Date.now().toString()
        );

        localStorage.removeItem("token");

        navigate("/login");
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");

                console.log("Dashboard loading...");

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [response, roadmapResponse] = await Promise.all([
                    API.get("/resume/dashboard", {
                        headers,
                    }),

                    API.get("/roadmap/", {
                        headers,
                    }),
                ]);

                console.log("Dashboard Data:", response.data);
                console.log(
                    "Roadmap JSON:",
                    JSON.stringify(roadmapResponse.data, null, 2)
                );

                setDashboardData(response.data);
                setResumeScore(response.data.resume_score);
                setCareerProgress(response.data.career_progress);
                setHasResume(
                    response.data.resume_score != null &&
                    response.data.resume_score !== undefined
                );
                const roadmapData =
                    typeof roadmapResponse.data.roadmap === "string"
                        ? JSON.parse(roadmapResponse.data.roadmap)
                        : roadmapResponse.data.roadmap;

                setRoadmap(roadmapData);

                console.log("STAGES:", roadmapData?.stages);

                console.log("Dashboard loaded successfully!");

            } catch (error) {
                console.log(
                    "Failed to fetch dashboard data:",
                    error
                );
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <>
            <AnimatedBackground />

            <div className="dashboard">

                <div 
                    className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                ></div>
                
                <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
                    <button
                        className="sidebar-close-btn"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FiX />
                    </button>

                    <div className="brand">
                        <div className="brand-logo">
                            <img 
                                src="/careerpilot-mark.png"
                                alt="CareerPilot"
                                className="brand-logo-image"
                            />
                        </div>

                        <span>
                            CareerPilot
                        </span> 
                    </div>

                    <nav className="sidebar-nav">
                        <a className="active">
                            <FiTarget />
                            Dashboard
                        </a>

                        <a onClick={() => navigate("/resume")}>
                            <FiFileText />
                            Resume Analyzer
                        </a>

                        <a onClick={() => navigate("/resume-history")}>
                            <FiFileText />
                            Resume History
                        </a>

                        <a onClick={() => navigate("/roadmap")}>
                            <FiMap />
                            Career Roadmap
                        </a>

                        <a onClick={() => navigate("/interview")}>
                            <FiMessageSquare />
                            Mock Interview
                        </a>

                        <a onClick={() => navigate("/profile")}>
                            <FiUser />
                            Profile
                        </a>

                        <a onClick={() => navigate("/settings")}>
                            <FiSettings />
                            Settings
                        </a>

                    </nav>

                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut />
                        Logout
                    </button>

                </aside>

                <main className="dashboard-content">

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                        title="Open Menu"
                    >
                        <FiMenu />
                    </button>

                    <button 
                        className="back-btn" 
                        onClick={() => window.history.back()}
                        title="Go Back"
                    >                    
                        <FiArrowLeft />
                    </button>

                    {!hasResume && (
                        <motion.div
                            className="dashboard-resume-required"
                            initial={{ opacity:0, y:25 }}
                            animate={{ opacity:1, y:0 }}
                            transition={{ duration:0.5 }}
                        >
                            <div className="resume-required-icon">
                                <FiFileText />
                            </div>

                            <div className="resume-required-content">
                                <span className="resume-required-badge">
                                    GET STARTED
                                </span>
                                <h1>
                                    Analyze your resume top get started 🚀
                                </h1>
                                <p>
                                    Upload your resume so CareerPilot can analyze your 
                                    Skills, identify your Strengths and Weaknesses, and
                                    build your personlized career journey.
                                </p>

                                <button className="resume-required-btn" onClick={() => navigate("/resume")}>
                                    <FiFileText />
                                    Analyze Resume
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {hasResume && (
                        <>
                            {/* KEEP YOUR CURRENT dashboard-header,
                            progress card, stats, roadmap, etc. HERE*/}
                        </>
                    )}

                    <div className="dashboard-header">

                        <div>
                            <p className="welcome-small">
                                Good evening, {dashboardData?.name || "there"}👋
                            </p>

                            <h1>
                                Your AI Career Journey
                            </h1>

                            <p className="dashboard-subtitle">
                                You're on your way to becoming an {dashboardData?.career_goal || "your target career"}.
                            </p>

                        </div>

                        <div className="profile-mini">
                            
                            <div className="profile-avatar">
                                {dashboardData?.name
                                    ? dashboardData.name.charAt(0).toUpperCase()
                                    : "A"}
                            </div>

                            <div>
                                <strong>
                                    {dashboardData?.name || "--"}
                                </strong>

                                <span>
                                    {dashboardData?.career_goal || "--"}
                                </span>

                            </div>

                        </div>
                        
                    </div>

                    <motion.div
                        className="career-progress-card"
                        initial={{ opacity:0, y:20 }}
                        animate={{ opacity:1, y:0 }}
                    >
                        <div className="progress-info">
                            <div className="progress-title">
                                Your Career Progress
                            </div>
                            <div className="progress-percentage">
                                {careerProgress != null ? `${careerProgress}%` : "--"}
                            </div>
                            <div className="progress-subtitle">
                                {dashboardData?.career_goal || "Career"} journey
                            </div>
                        </div>

                        <div className="progress-section">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${careerProgress || 0}%`
                                    }}
                                ></div>
                            </div>

                            <div className="progress-labels">
                                <span>
                                    Beginner
                                </span>
                                <span>
                                    {dashboardData?.career_goal || "your target career"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                    
                    <div className="stats-grid">

                        <motion.div className="stat-card" whileHover={{ y:-6 }}>

                            <div className="stat-icon blue">
                                <FiFileText />
                            </div>

                            <div>
                                <span>
                                    Resume Score
                                </span>
                                <h2>
                                    {dashboardData
                                        ? `${dashboardData.resume_score}%`
                                        : "--"}
                                </h2>
                                <small>
                                    Good Profile
                                </small>

                            </div>

                        </motion.div>

                        <motion.div className="stat-card" whileHover={{ y:-6 }}>
                            <div className="stat-icon purple">
                                <FiTarget />
                            </div>

                            <div>

                                <span>
                                    Career Goal
                                </span>
                                <h2>
                                    {dashboardData
                                        ? dashboardData.career_goal
                                        : "--"}
                                </h2>
                                <small>
                                    Your target role
                                </small>

                            </div>

                        </motion.div>

                        <motion.div className="stat-card" whileHover={{ y:-6 }}>
                            <div className="stat-icon cyan">
                                <FiTrendingUp />
                            </div>

                            <div>
                                <span>
                                    Skill Mastered
                                </span>
                                <h2>
                                    {dashboardData
                                        ? dashboardData.skills_count
                                        : "--"}
                                </h2>
                                <small>
                                    Skills completed
                                </small>

                            </div>

                        </motion.div>
                    </div>

                    <div className="dashboard-grid single">

                        <motion.div
                            className="dashboard-card ai-focus-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="ai-focus-badge">
                                ✨ AI FOCUS
                            </div>
                            <h2>
                                {dashboardData
                                    ? dashboardData.current_focus
                                    : "Analyzing your profile..."}
                            </h2>
                            <p>
                                Continue working on this area to move
                                closer to your {dashboardData?.career_goal || "career"} goal.
                            </p>

                            <div className="focus-meta">
                                <span>
                                    ⏱ 45 min
                                </span>
                                <span>
                                    🎯 High Priority
                                </span>
                            </div>

                            <button className="focus-btn">
                                Continue Learning →
                            </button>
                        </motion.div>

                        <motion.div 
                            className="dashboard-card roadmap-card"
                            initial={{ opacity:0, y:20 }}
                            animate={{ opacity:1, y:0 }}
                        >
                            <div className="card-header">
                                <div>
                                    <h2>
                                        AI Career Roadmap
                                    </h2>
                                    <p>
                                        Your journey toward becoming an{" "}
                                        {dashboardData?.career_goal || "your career goal"}
                                    </p>
                                </div>

                                <FiMap />

                            </div>

                            <div className="roadmap">
                                {roadmap?.stages?.slice(0, 4).map((stage, index) => (
                                    <div
                                        key={index}
                                        className={`roadmap-item ${stage.status}`}
                                    >
                                        <span className="roadmap-dot">
                                            {stage.status === "completed"
                                                ? "✓"
                                                : index + 1
                                            }
                                        </span>

                                        <div>
                                            <strong>
                                                {stage.title}
                                            </strong>

                                            <p>
                                                {stage.status === "completed"
                                                    ? "Completed"
                                                    : stage.status === "current"
                                                        ? "Currently learning"
                                                        : "Upcoming"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </main>

                <nav className="mobile-navbar">

                    <a
                        className="active"
                        onClick={() => navigate("/dashboard")}
                    >
                        <FiTarget />
                        <span>Home</span>
                    </a>

                    <a onClick={() => navigate("/resume")}>
                        <FiFileText />
                        <span>Resume</span>
                    </a>

                    <a onClick={() => navigate("/roadmap")}>
                        <FiMap />
                        <span>Roadmap</span>
                    </a>

                    <a onClick={() => navigate("/interview")}>
                        <FiMessageSquare />
                        <span>Interview</span>
                    </a>

                    <a onClick={() => navigate("/profile")}>
                        <FiUser />
                        <span>Profile</span>
                    </a>

                    <a onClick={() => navigate("/settings")}>
                        <FiSettings />
                        <span>Settings</span>
                    </a>

                </nav>
           </div>
        </>
    );
}

export default Dashboard;
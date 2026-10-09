import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext"; 

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
} from "react-icons/fi";

import AnimatedBackground from "../components/AnimatedBackground";
import API from "../services/api";

import "../styles/Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();
    const { t } = useLanguage();
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
                            {t.dashboard.dashboard}
                        </a>

                        <a onClick={() => navigate("/resume")}>
                            <FiFileText />
                            {t.dashboard.resumeAnalyzer}
                        </a>

                        <a onClick={() => navigate("/roadmap")}>
                            <FiMap />
                            {t.dashboard.careerRoadmap}
                        </a>

                        <a onClick={() => navigate("/interview")}>
                            <FiMessageSquare />
                            {t.dashboard.mockInterview}
                        </a>

                        <a onClick={() => navigate("/profile")}>
                            <FiUser />
                            {t.dashboard.profile}
                        </a>

                        <a onClick={() => navigate("/settings")}>
                            <FiSettings />
                            {t.dashboard.settings}
                        </a>

                    </nav>

                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut />
                        {t.dashboard.logout}
                    </button>

                </aside>

                <main className="dashboard-content">

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
                                {t.dashboard.goodEvening}, {dashboardData?.name || "there"}👋
                            </p>

                            <h1>
                                {t.dashboard.yourAICareerJourney}
                            </h1>

                            <p className="dashboard-subtitle">
                                {t.dashboard.youAreOnYourWay}
                                {dashboardData?.career_goal || t.dashboard.yourTargetCareer}.
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
                                    {dashboardData?.career_goal || t.dashboard.Career} {t.dashboard.journey}
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
                                    {t.dashboard.resumeScore}
                                </span>
                                <h2>
                                    {dashboardData
                                        ? `${dashboardData.resume_score}%`
                                        : "--"}
                                </h2>
                                <small>
                                    {t.dashboard.goodProfile}
                                </small>

                            </div>

                        </motion.div>

                        <motion.div className="stat-card" whileHover={{ y:-6 }}>
                            <div className="stat-icon purple">
                                <FiTarget />
                            </div>

                            <div>

                                <span>
                                    {t.dashboard.careerGoal}
                                </span>
                                <h2>
                                    {dashboardData
                                        ? dashboardData.career_goal
                                        : "--"}
                                </h2>
                                <small>
                                    {t.dashboard.yourTargetRole}
                                </small>

                            </div>

                        </motion.div>

                        <motion.div className="stat-card" whileHover={{ y:-6 }}>
                            <div className="stat-icon cyan">
                                <FiTrendingUp />
                            </div>

                            <div>
                                <span>
                                    {t.dashboard.skillMastered}
                                </span>
                                <h2>
                                    {dashboardData
                                        ? dashboardData.skills_count
                                        : "--"}
                                </h2>
                                <small>
                                    {t.dashboard.skillsCompleted}
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
                                ✨ {t.dashboard.aiFocus}
                            </div>
                            <h2>
                                {dashboardData
                                    ? dashboardData.current_focus
                                    : t.dashboard.analyzingProfile}
                            </h2>
                            <p>
                                Continue working on this area to move
                                closer to your {dashboardData?.career_goal || t.dashboard.career} goal.
                            </p>

                            <div className="focus-meta">
                                <span>
                                    ⏱ 45 min
                                </span>
                                <span>
                                    🎯 {t.dashboard.highPriority}
                                </span>
                            </div>

                            <button className="focus-btn">
                                {t.dashboard.continueLearning}
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
                                        {t.dashboard.aiCareerRoadmap}
                                    </h2>
                                    <p>
                                        Your journey toward becoming an{" "}
                                        {dashboardData?.career_goal || t.dashboard.yourCareerGoal}
                                    </p>
                                </div>

                                <FiMap />

                            </div>

                            <div className="roadmap">
                                {(() => {
                                    const stages = roadmap?.stages || [];

                                    const currentIndex = stages.findIndex(
                                        (stage) => stage.status === "current"
                                    );

                                    const startIndex =
                                        currentIndex === -1
                                            ? 0
                                            : Math.max(currentIndex - 1, 0);

                                    return stages
                                        .slice(startIndex, startIndex + 4)
                                        .map((stage, index) => (
                                            <div
                                                key={startIndex + index}
                                                className={`roadmap-item ${stage.status}`}
                                            >
                                                <span className="roadmap-dot">
                                                    {stage.status === "completed"
                                                        ? "✓"
                                                        : startIndex + index + 1}
                                                </span>

                                                <div>
                                                    <strong>
                                                        {stage.title}
                                                    </strong>

                                                    <p>
                                                        {stage.status === "completed"
                                                            ? t.dashboard.completed
                                                            : stage.status === "current"
                                                                ? t.dashboard.currentlyLearning
                                                                : t.dashboard.upcoming}
                                                    </p>
                                                </div>
                                            </div>
                                        ));
                                })()}
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
                        <span>{t.dashboard.home}</span>
                    </a>

                    <a onClick={() => navigate("/resume")}>
                        <FiFileText />
                        <span>{t.dashboard.resume}</span>
                    </a>

                    <a onClick={() => navigate("/roadmap")}>
                        <FiMap />
                        <span>{t.dashboard.roadmap}</span>
                    </a>

                    <a onClick={() => navigate("/interview")}>
                        <FiMessageSquare />
                        <span>{t.dashboard.interview}</span>
                    </a>

                    <a onClick={() => navigate("/profile")}>
                        <FiUser />
                        <span>{t.dashboard.profile}</span>
                    </a>

                    <a onClick={() => navigate("/settings")}>
                        <FiSettings />
                        <span>{t.dashboard.settings}</span>
                    </a>

                </nav>
           </div>
        </>
    );
}

export default Dashboard;
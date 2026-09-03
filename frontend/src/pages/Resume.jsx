import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiUploadCloud,
    FiFileText,
    FiArrowRight,
    FiArrowLeft,
    FiCheckCircle,
    FiAlertCircle,
    FiBriefcase,
    FiBookOpen,
    FiTarget,
    FiLoader,
    FiClock,
} from "react-icons/fi";
import API from "../services/api";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/resumeAnalyzer.css";

function ResumeAnalyzer() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
    };

    const uploadResume = async () => {
        if (!file) {
            alert("Please select a resume.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("file", file);

            const response = await API.post(
                "/resume/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "multipart/form-data",
                    },
                }
            );

            let parsed = response.data.analysis;
            if (typeof parsed === "string") {
                try {
                    parsed = JSON.parse(parsed);
                } catch (e) {
                    console.log("Not JSON:", e);
                }
            }

            setAnalysis(parsed);
            console.log("Analysis:",parsed);

        } catch (error) {
            console.log("Resume upload failed:", error);

            alert(error.response?.data?.detail ||
                "Failed to analyze resume. Please try again."
            );

        } finally {
            setLoading(false);
        }
            
    };

    const score = analysis?.overall_score ?? 0;

    return (
        <>
            <AnimatedBackground />

            <div className="resume-page">

                <button 
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    title="Go Back"
                >
                    <FiArrowLeft />
                </button>

                <motion.div
                    className="resume-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="resume-header-content">

                        <div className="resume-header-icon">
                            <FiFileText />
                        </div>

                        <div className="resume-header-text">
                            <p className="resume-eyebrow">
                                AI POWERED ANALYSIS
                            </p>

                            <h1>
                                Resume Analyzer
                            </h1>

                            <p>
                                Let AI analyze your resume and discover
                                how ready you are for your target career.
                            </p>
                        </div>

                    </div>

                    <button
                        className="resume-history-header-btn"
                        onClick={() => navigate("/resume-history")}
                    >
                        <FiClock />
                        <span>History</span>
                    </button>

                </motion.div>

                <div className="resume-upload-box">
                    
                    <input
                        id="resume-input"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        hidden
                    />

                    <div 
                        className="upload-icon-small"
                        onClick={() => document.getElementById("resume-input").click()}
                    >
                        <FiUploadCloud />
                        <span className="upload-tooltip">Upload Resume</span>
                    </div>

                    <div className="upload-text">
                        <strong>
                            {file ? file.name : "Choose your resume"}
                        </strong>

                        <span>
                            {file
                                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                : "PDF or DOCX • Maximum recommended size 10MB"}
                        </span>
                    </div>

                    <button className="resume-analyze-btn" 
                        onClick={(e) => {
                            e.stopPropagation();
                            uploadResume();
                        }}
                        disabled={!file || loading}
                    >
                        {loading ? "Analyzing..." : "Analyze Resume"}
                        {!loading && <FiArrowRight />}
                    </button>
                </div>

                {loading && (
                    <motion.div
                        className="analysis-loading"
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                    >
                        <FiLoader className="spin" />
                        <div>
                            <strong>
                                AI is analyzing your resume...
                            </strong>
                            <p>
                                Checking skills, projects,
                                experience and ATS compatibility.
                            </p>
                        </div>
                    </motion.div>
                )}

                {analysis && !loading && (
                    <motion.div 
                        className="analysis-results"
                        initial={{ opacity:0 }}
                        animate={{ opacity:1 }}
                    >
                        <div className="score-card">
                            <div>
                                <p className="result-label">
                                    YOUR ATS SCORE
                                </p>

                                <h2>
                                    Resume Performance
                                </h2>

                                <p className="score-description">
                                    Your resume has been analyzed
                                    using AI-powered ATS evaluation.
                                </p>
                            </div>

                            <div className="score-circle">
                                <strong>
                                    {analysis.overall_score ?? 0}
                                </strong>
                                <span>
                                    /100
                                </span>
                            </div>
                        </div>

                        <div className="result-section">
                            <div className="section-heading">
                                <FiTarget />
                                <div>
                                    <h2>
                                        ATS Score Breakdown
                                    </h2>
                                    <p>
                                        Here's how your resume performed
                                        across different areas.
                                    </p>
                                </div>
                            </div>

                            <div className="breakdown-grid">
                                {Object.entries(
                                    analysis.breakdown || {}
                                ).map(([key, value]) => (
                                    <div className="breakdown-card" key={key}>
                                        <span>
                                            {key.replaceAll(
                                                "_",
                                                " "
                                            )}
                                        </span>

                                        <strong>
                                            {value}
                                        </strong>

                                        <div className="mini-progress">
                                            <div style={{width: `${Math.min(value*5,100)}%`}} />

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="two-column-results">
                            <div className="result-card strengths-card">
                                <div className="result-card-title">
                                    <FiCheckCircle />
                                    <h2>
                                        Strengths
                                    </h2>
                                </div>

                                <div className="result-list">
                                    {(analysis.strengths || []).map(
                                        (item, index) => (
                                            <div className="result-list-item" key={index}>
                                                <FiCheckCircle />

                                                <span>
                                                    {item}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="result-card weaknesses-card">
                                <div className="result-card-title">
                                    <FiAlertCircle />
                                    <h2>
                                        Areas to Improve
                                    </h2>
                                </div>

                                <div className="result-list">
                                    {(analysis.weaknesses || []).map(
                                        (item, index) => (
                                            <div className="result-list-item" key={index}>
                                                <FiAlertCircle />
                                                <span>
                                                    {item}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="result-card">

                            <div className="result-card-title">

                                <FiBookOpen />

                                <h2>
                                    Skills You Should Learn
                                </h2>

                            </div>


                            <div className="skill-tags">

                                {(analysis.missing_skills || []).map(
                                    (skill, index) => (

                                        <span key={index}>
                                            {skill}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                        <div className="result-card">

                            <div className="result-card-title">

                                <FiBriefcase />

                                <h2>
                                    Recommended Career Paths
                                </h2>

                            </div>


                            <div className="jobs-grid">

                                {(analysis.recommended_jobs || []).map(
                                    (job, index) => (

                                        <div
                                            className="job-card"
                                            key={index}
                                        >

                                            <FiBriefcase />

                                            <span>
                                                {job}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        <div className="result-card roadmap-result">

                            <div className="result-card-title">

                                <FiTarget />

                                <h2>
                                    AI Learning Roadmap
                                </h2>

                            </div>


                            <div className="learning-list">

                                {(analysis.learning_roadmap || []).map(
                                    (item, index) => (

                                        <div
                                            className="learning-item"
                                            key={index}
                                        >

                                            <span>
                                                {index + 1}
                                            </span>

                                            <p>
                                                {item}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </motion.div>
                )}
            </div>
         </>
    );
}

export default ResumeAnalyzer;

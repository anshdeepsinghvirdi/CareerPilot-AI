import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";
import {
    FiArrowLeft,
    FiFileText,
    FiDownload,
    FiTrash2,
    FiCheckCircle,
    FiAlertTriangle,
    FiTarget,
    FiBriefcase,
    FiBookOpen,
} from "react-icons/fi";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/Dashboard.css";

function ResumeHistory() {

    const navigate = useNavigate();
    const { t } = useLanguage();
    const th = t.resumeHistory;

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/resume/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResumes(response.data);

        } catch (error) {

            console.log(error);
            alert("Failed to load resume history.");

        } finally {

            setLoading(false);

        }
    };

    const parseAnalysis = (analysis) => {

        if (!analysis) {
            return {};
        }

        if (typeof analysis === "object") {
            return analysis;
        }

        try {

            return JSON.parse(analysis);

        } catch (error) {

            console.log("Analysis parsing error:", error);

            return {};

        }
    };

    const deleteResume = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteResume = async () => {

        try {

            const token = localStorage.getItem("token");

            await API.delete(`/resume/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowDeleteModal(false);
            setDeleteId(null);

            fetchHistory();

        } catch (error) {

            console.log(error);

            alert("Failed to delete resume.");

        }
    };

    const downloadAnalysis = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get(
                `/resume/analysis/${id}/download`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            // Android / Capacitor
            if (Capacitor.isNativePlatform()) {

                const blob = response.data;

                const base64Data = await new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        const result = reader.result;
                        resolve(result.split(",")[1]);
                    };

                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                const fileName = `CareerPilot_AI_Report_${id}.pdf`;

                const savedFile = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Cache,
                });

                await Share.share({
                    title: "CareerPilot AI Resume Analysis",
                    text: "CareerPilot AI Resume Analysis Report",
                    url: savedFile.uri,
                    dialogTitle: "Save or Share Report",
                });

                return;
            }

            // PC / Browser
            const url = window.URL.createObjectURL(
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                )
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = "CareerPilot_AI_Report.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log("DOWNLOAD ANALYSIS ERROR:", error);
            alert("Failed to download analysis.");
        }
    };

    const downloadResume = async (id, filename) => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                `/resume/download/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                filename
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.log(error);

            alert("Failed to download resume.");

        }
    };

    if (loading) {

        return (
            <div className="dashboard-content">

                <h1>
                    {th.loading}
                </h1>

            </div>
        );

    }

    return (
        <>
            <AnimatedBackground />

            <div className="dashboard-content">

                {/* Back Button */}

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    title={th.goBack}
                >
                    <FiArrowLeft />
                </button>


                {/* Header */}

                <div className="dashboard-header">

                    <div className="resume-history-title-content">

                        <p className="welcome-small">
                            {th.eyebrow}
                        </p>

                        <h1>
                            {th.title}
                        </h1>

                        <p className="dashboard-subtitle">
                            {th.subtitle}
                        </p>

                    </div>

                </div>


                {/* No Resume */}

                {resumes.length === 0 ? (

                    <div className="dashboard-card">

                        <FiFileText
                            style={{
                                fontSize: "45px",
                                color: "#60a5fa",
                                marginBottom: "15px"
                            }}
                        />

                        <h2>
                            {th.noResumes}
                        </h2>

                        <p>
                            {th.emptyDescription}
                        </p>

                        <button
                            className="resume-required-btn"
                            onClick={() => navigate("/resume")}
                        >
                            {th.analyzeResume}
                        </button>

                    </div>

                ) : (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "25px"
                        }}
                    >

                        {resumes.map((resume) => {

                            const analysis =
                                parseAnalysis(resume.analysis);

                            
                            const score =
                                analysis.overall_score ??
                                analysis.resume_score ??
                                0;

                            const strengths = Array.isArray(analysis.strengths)
                                ? analysis.strengths
                                : [];

                            const weaknesses = Array.isArray(analysis.weaknesses)
                                ? analysis.weaknesses
                                : [];

                            const missingSkills = Array.isArray(analysis.missing_skills)
                                ? analysis.missing_skills
                                : [];

                            const recommendedJobs = Array.isArray(analysis.recommended_jobs)
                                ? analysis.recommended_jobs
                                : [];

                            const learningRoadmap = Array.isArray(analysis.learning_roadmap)
                                ? analysis.learning_roadmap
                                : [];

                            return (

                                <div
                                    className="dashboard-card resume-history-card"
                                    key={resume.id}
                                >

                                    {/* Resume Header */}

                                    <div className="resume-history-header">
                                        

                                        <div className="resume-history-title">

                                            <div
                                                className="stat-icon blue"
                                            >
                                                <FiFileText />
                                            </div>

                                            <div className="resume-history-title-content">

                                                <h2
                                                    style={{
                                                        margin: 0
                                                    }}
                                                >
                                                    {resume.filename}
                                                </h2>

                                                <p
                                                    style={{
                                                        color: "#64748b",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {th.resumeId}: {resume.id}
                                                </p>

                                            </div>

                                        </div>


                                        {/* Score */}

                                        <div className="resume-history-score">

                                            <span
                                                style={{
                                                    color: "#94a3b8",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                {th.resumeScore}
                                            </span>

                                            <h2
                                                style={{
                                                    margin: "4px 0",
                                                    fontSize: "32px",
                                                    color:
                                                        score >= 80
                                                            ? "#4ade80"
                                                            : score >= 60
                                                                ? "#60a5fa"
                                                                : "#fbbf24"
                                                }}
                                            >
                                                {score}%
                                            </h2>

                                        </div>

                                    </div>


                                    {/* Divider */}

                                    <div
                                        style={{
                                            height: "1px",
                                            background:
                                                "rgba(255,255,255,0.08)",
                                            margin: "25px 0"
                                        }}
                                    />


                                    {/* Strengths */}

                                    {strengths.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom: "25px"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    color: "#4ade80"
                                                }}
                                            >
                                                <FiCheckCircle />
                                                {th.strengths}
                                            </h3>

                                            <ul
                                                style={{
                                                    color: "#cbd5e1",
                                                    lineHeight: "1.8"
                                                }}
                                            >

                                                {strengths.map(
                                                    (item, index) => (

                                                        <li key={index}>
                                                            {item}
                                                        </li>

                                                    )
                                                )}

                                            </ul>

                                        </div>

                                    )}


                                    {/* Weaknesses */}

                                    {weaknesses.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom: "25px"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    color: "#f87171"
                                                }}
                                            >
                                                <FiAlertTriangle />
                                                {th.weaknesses}
                                            </h3>

                                            <ul
                                                style={{
                                                    color: "#cbd5e1",
                                                    lineHeight: "1.8"
                                                }}
                                            >

                                                {weaknesses.map(
                                                    (item, index) => (

                                                        <li key={index}>
                                                            {item}
                                                        </li>

                                                    )
                                                )}

                                            </ul>

                                        </div>

                                    )}


                                    {/* Missing Skills */}

                                    {missingSkills.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom: "25px"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    color: "#60a5fa"
                                                }}
                                            >
                                                <FiTarget />
                                                {th.missingSkills}
                                            </h3>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "10px"
                                                }}
                                            >

                                                {missingSkills.map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                            style={{
                                                                padding: "8px 12px",
                                                                borderRadius: "20px",
                                                                background:
                                                                    "rgba(37,99,235,0.15)",
                                                                border:
                                                                    "1px solid rgba(96,165,250,0.25)",
                                                                color: "#93c5fd",
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}


                                    {/* Recommended Jobs */}

                                    {recommendedJobs.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom: "25px"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    color: "#a78bfa"
                                                }}
                                            >
                                                <FiBriefcase />
                                                {th.recommendedJobs}
                                            </h3>

                                            <ul
                                                style={{
                                                    color: "#cbd5e1",
                                                    lineHeight: "1.8"
                                                }}
                                            >

                                                {recommendedJobs.map(
                                                    (job, index) => (

                                                        <li key={index}>
                                                            {job}
                                                        </li>

                                                    )
                                                )}

                                            </ul>

                                        </div>

                                    )}


                                    {/* Learning Roadmap */}

                                    {learningRoadmap.length > 0 && (

                                        <div
                                            style={{
                                                marginBottom: "25px"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    color: "#22d3ee"
                                                }}
                                            >
                                                <FiBookOpen />
                                                {th.learningRoadmap}
                                            </h3>

                                            <ol
                                                style={{
                                                    color: "#cbd5e1",
                                                    lineHeight: "1.8"
                                                }}
                                            >

                                                {learningRoadmap.map(
                                                    (item, index) => (

                                                        <li key={index}>
                                                            {item}
                                                        </li>

                                                    )
                                                )}

                                            </ol>

                                        </div>

                                    )}


                                    {/* Buttons */}
                                    <div className="resume-history-actions">

                                        <button
                                            className="resume-history-btn download-resume-btn"
                                            onClick={() =>
                                                downloadResume(
                                                    resume.id,
                                                    resume.filename
                                                )
                                            }
                                        >
                                            <FiDownload />
                                            {th.downloadResume}
                                        </button>

                                        <button
                                            className="resume-history-btn download-analysis-btn"
                                            onClick={() =>
                                                downloadAnalysis(resume.id)
                                            }
                                        >
                                            <FiDownload />
                                            {th.downloadAnalysis}
                                        </button>

                                        <button
                                            className="resume-history-btn delete-resume-btn"
                                            onClick={() =>
                                                deleteResume(resume.id)
                                            }
                                        >
                                            <FiTrash2 />
                                            {th.delete}
                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

            {showDeleteModal && (

                <div className="delete-modal-overlay">

                    <div className="delete-modal">

                        <div className="delete-modal-icon">
                            🗑️
                        </div>

                        <h2>{th.deleteTitle}</h2>

                        <p>
                            {th.deleteDescription}
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                className="delete-cancel-btn"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteId(null);
                                }}
                            >
                                {th.cancel}
                            </button>

                            <button
                                className="delete-confirm-btn"
                                onClick={confirmDeleteResume}
                            >
                                {th.deleteResume}
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </>
    );
}

export default ResumeHistory;
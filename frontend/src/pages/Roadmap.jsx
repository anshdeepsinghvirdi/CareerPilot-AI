import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiMap,
    FiCheckCircle,
    FiClock,
    FiCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

import AnimatedBackground from "../components/AnimatedBackground";
import { startCareerPilotReminders } from "../services/notification";
import API from "../services/api";
import "../styles/roadmap.css";

function Roadmap() {
    const navigate = useNavigate();

    const [roadmap, setRoadmap] = useState("");
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get(
                "/roadmap/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const roadmapData =
                typeof res.data.roadmap === "string"
                    ? JSON.parse(res.data.roadmap)
                    : res.data.roadmap;

            setRoadmap({
                user: res.data.user,
                career_goal: res.data.career_goal,
                ...roadmapData,
            });
        } catch (err) {
            console.error(
                "Failed to load roadmap.",
                err
            );
        } finally {
            setLoading(false);
        }
    };

    const completeStage = async (stageIndex) => {
        try {
            setCompleting(true);

            const token =
                localStorage.getItem("token");

            await API.post(
                `/roadmap/complete-stage?stage_index=${stageIndex}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchRoadmap();
        } catch (err) {
            console.error(
                "Failed to complete stage.",
                err
            );

            alert("Failed to complete stage.");
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <>
                <AnimatedBackground />

                <div className="roadmap-loading">
                    <FiMap className="roadmap-loading-icon" />

                    <h2>
                        Loading your career roadmap...
                    </h2>

                    <p>
                        AI is preparing your career journey.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <AnimatedBackground />

            <div className="roadmap-page">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    title="Go Back"
                >
                    <FiArrowLeft />
                </button>

                <motion.div
                    className="roadmap-header"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >
                    <div className="roadmap-header-icon">
                        <FiMap />
                    </div>

                    <div>
                        <p className="roadmap-eyebrow">
                            AI CAREER PLANNING
                        </p>

                        <h1>
                            Your Career Roadmap
                        </h1>

                        <p>
                            A personalized path designed to
                            take you from your current level
                            to your target career.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="roadmap-overview"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >
                    <div>
                        <span className="overview-label">
                            CURRENT LEVEL
                        </span>

                        <h2>
                            {roadmap?.current_level ||
                                "Beginner"}
                        </h2>
                    </div>

                    <div>
                        <span className="overview-label">
                            TARGET CAREER
                        </span>

                        <h2>
                            {roadmap?.career_goal ||
                                "AI Engineer"}
                        </h2>
                    </div>

                    <div>
                        <span className="overview-label">
                            TOTAL STAGES
                        </span>

                        <h2>
                            {roadmap?.stages?.length || 0}
                        </h2>
                    </div>
                </motion.div>

                <div className="roadmap-container">

                    <div className="roadmap-title">
                        <div>
                            <h2>
                                Your Learning Journey
                            </h2>

                            <p>
                                Complete each stage to move
                                closer to your career goal.
                            </p>
                        </div>
                    </div>

                    <div className="roadmap-timeline">

                        {roadmap?.stages?.map(
                            (stage, index) => {

                                const status =
                                    stage.status?.toLowerCase();

                                const isCompleted =
                                    status === "completed";

                                const isCurrent =
                                    status === "current";

                                return (
                                    <motion.div
                                        className={`roadmap-stage ${status}`}
                                        key={index}
                                        initial={{
                                            opacity: 0,
                                            x: -20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            delay:
                                                index * 0.12,
                                        }}
                                    >

                                        <div className="timeline-line"></div>

                                        <div className="stage-icon">

                                            {isCompleted ? (
                                                <FiCheckCircle />
                                            ) : isCurrent ? (
                                                <FiClock />
                                            ) : (
                                                <FiCircle />
                                            )}

                                        </div>

                                        <div className="stage-card">

                                            <div className="stage-number">
                                                STAGE {index + 1}
                                            </div>

                                            <h3>
                                                {stage.title}
                                            </h3>

                                            <div className="stage-status">

                                                {isCompleted && (
                                                    <>
                                                        <FiCheckCircle />
                                                        Completed
                                                    </>
                                                )}

                                                {isCurrent && (
                                                    <>
                                                        <FiClock />
                                                        Currently Learning
                                                    </>
                                                )}

                                                {status ===
                                                    "upcoming" && (
                                                    <>
                                                        <FiCircle />
                                                        Upcoming
                                                    </>
                                                )}

                                            </div>

                                            {isCurrent && (
                                                <button
                                                    className="complete-stage-btn"
                                                    disabled={
                                                        completing
                                                    }
                                                    onClick={() =>
                                                        completeStage(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <FiCheckCircle />

                                                    {completing
                                                        ? "Completing..."
                                                        : "Complete Stage"}
                                                </button>
                                            )}

                                        </div>

                                    </motion.div>
                                );
                            }
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default Roadmap;
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
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";
import "../styles/roadmap.css";

function Roadmap() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const th = t.roadmap;

    const [roadmap, setRoadmap] = useState("");
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [requiresCareerGoal, setRequiresCareerGoal] = useState(false);

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

            if (res.data.requires_career_goal) {
                setRequiresCareerGoal(true);
                return;
            }


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

            alert(th.completeError);
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
                        {th.loading}
                    </h2>

                    <p>
                        {th.preparing}
                    </p>
                </div>
            </>
        );
    }


    if (requiresCareerGoal) {
        return (
            <>
                <AnimatedBackground />

                <div className="roadmap-page">

                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                        title={th.goBack}
                    >
                        <FiArrowLeft />
                    </button>

                    <motion.div
                        className="roadmap-container"
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >
                        <div className="roadmap-title">

                            <div>

                                <div className="roadmap-header-icon">
                                    <FiMap />
                                </div>

                                <h2>
                                    {th.setGoalTitle}
                                </h2>

                                <p>
                                    {th.setGoalDescription}
                                </p>

                                <button
                                    className="complete-stage-btn"
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                >
                                    {th.setCareerGoal}
                                </button>

                                <p >
                                    personalized AI career roadmap.
                                </p>

                                <button
                                    className="complete-stage-btn"
                                    onClick={() =>
                                        navigate("/profile")
                                    }
                                >
                                    {th.setCareerGoal}
                                </button>

                            </div>

                        </div>
                    </motion.div>

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
                            {th.eyebrow}
                        </p>

                        <h1>
                            {th.title}
                        </h1>

                        <p>
                            {th.subtitle}
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
                            {th.currentLevel}
                        </span>

                        <h2>
                            {roadmap?.current_level ||
                                th.beginner}
                        </h2>
                    </div>

                    <div>
                        <span className="overview-label">
                            {th.targetCareer}
                        </span>

                        <h2>
                            {roadmap?.career_goal}
                        </h2>
                    </div>

                    <div>
                        <span className="overview-label">
                            {th.totalStages}
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
                                {th.learningJourney}
                            </h2>

                            <p>
                                {th.journeyDescription}
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
                                                {th.stage} {index + 1}
                                            </div>

                                            <h3>
                                                {stage.title}
                                            </h3>

                                            <div className="stage-status">

                                                {isCompleted && (
                                                    <>
                                                        <FiCheckCircle />
                                                        {th.completed}
                                                    </>
                                                )}

                                                {isCurrent && (
                                                    <>
                                                        <FiClock />
                                                        {th.currentlyLearning}
                                                    </>
                                                )}

                                                {status ===
                                                    "upcoming" && (
                                                    <>
                                                        <FiCircle />
                                                        {th.upcoming}
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
                                                        ? th.completing
                                                        : th.completeStage}
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
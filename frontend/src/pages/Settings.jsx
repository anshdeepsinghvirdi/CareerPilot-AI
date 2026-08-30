import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FiArrowLeft,
    FiSettings,
    FiBell,
    FiShield,
    FiUser,
} from "react-icons/fi";
import { motion } from "framer-motion";

import AnimatedBackground from "../components/AnimatedBackground";
import { requestNotificationPermission, sendCareerPilotReminder } from "../services/notification";
import "../styles/settings.css";

function Settings() {
    const navigate = useNavigate();

    const [careerUpdates, setCareerUpdates] = useState(
        localStorage.getItem("careerUpdates") !== "false"
    );

    const [roadmapReminders, setRoadmapReminders] = useState(
        localStorage.getItem("roadmapReminders") !== "false"
    );

    const handleCareerUpdates = async () => {
        const newValue = !careerUpdates;

        setCareerUpdates(newValue);
        localStorage.setItem("careerUpdates", newValue);

        if (newValue) {
            const allowed = await requestNotificationPermission();

            if (allowed) {
                sendCareerPilotReminder();
            }
        }
    };


    const handleRoadmapReminders = async () => {
        const newValue = !roadmapReminders;

        setRoadmapReminders(newValue);
        localStorage.setItem("roadmapReminders", newValue);

        if (newValue) {
            const allowed = await requestNotificationPermission();

            if (allowed) {
                console.log("Roadmap reminders are now enabled.");
            }
        }
    };

    return (
        <>
            <AnimatedBackground />

            <div className="settings-page">

                <button
                    className="settings-back-btn"
                    onClick={() => navigate(-1)}
                    title="Go Back"
                >
                    <FiArrowLeft />
                </button>

                <motion.div
                    className="settings-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="settings-header-icon">
                        <FiSettings />
                    </div>

                    <div>
                        <p className="settings-eyebrow">
                            CAREERPILOT PREFERENCES
                        </p>

                        <h1>Settings</h1>

                        <p>
                            Customize your CareerPilot experience
                            according to your preferences.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="settings-container"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >

                    {/* ACCOUNT */}

                    <div className="settings-section">

                        <div className="settings-section-title">
                            <FiUser />

                            <div>
                                <h2>Account Preferences</h2>
                                <p>
                                    Manage your personal CareerPilot preferences.
                                </p>
                            </div>
                        </div>

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiUser />
                            </div>

                            <div className="settings-item-content">
                                <h3>Profile</h3>
                                <p>
                                    Update your personal and career information.
                                </p>
                            </div>

                            <button
                                className="settings-action-btn"
                                onClick={() => navigate("/profile")}
                            >
                                Open
                            </button>

                        </div>

                    </div>


                    {/* NOTIFICATIONS */}

                    <div className="settings-section">

                        <div className="settings-section-title">
                            <FiBell />

                            <div>
                                <h2>Notifications</h2>
                                <p>
                                    Control the notifications you receive.
                                </p>
                            </div>
                        </div>

                        {/* CAREER UPDATES */}

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiBell />
                            </div>

                            <div className="settings-item-content">
                                <h3>Career Updates</h3>

                                <p>
                                    Receive updates about your career progress.
                                </p>
                            </div>

                            <label className="settings-switch">

                                <input
                                    type="checkbox"
                                    checked={careerUpdates}
                                    onChange={handleCareerUpdates}
                                />

                                <span></span>

                            </label>

                        </div>


                        {/* ROADMAP REMINDERS */}

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiBell />
                            </div>

                            <div className="settings-item-content">
                                <h3>Roadmap Reminders</h3>

                                <p>
                                    Get reminders about your learning roadmap.
                                </p>
                            </div>

                            <label className="settings-switch">

                                <input
                                    type="checkbox"
                                    checked={roadmapReminders}
                                    onChange={handleRoadmapReminders}
                                />

                                <span></span>

                            </label>

                        </div>

                    </div>


                    {/* SECURITY */}

                    <div className="settings-section">

                        <div className="settings-section-title">
                            <FiShield />

                            <div>
                                <h2>Privacy & Security</h2>

                                <p>
                                    Manage your account security preferences.
                                </p>
                            </div>
                        </div>

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiShield />
                            </div>

                            <div className="settings-item-content">
                                <h3>Account Security</h3>

                                <p>
                                    Your account is protected with secure authentication.
                                </p>
                            </div>

                            <span className="settings-status">
                                Protected
                            </span>

                        </div>

                    </div>

                </motion.div>

            </div>
        </>
    );
}

export default Settings;

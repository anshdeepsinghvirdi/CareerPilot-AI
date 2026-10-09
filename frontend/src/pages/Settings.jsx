import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    FiArrowLeft,
    FiSettings,
    FiBell,
    FiShield,
    FiUser,
    FiFileText,
    FiGlobe,
    FiCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";

import AnimatedBackground from "../components/AnimatedBackground";
import { requestNotificationPermission, sendCareerPilotReminder } from "../services/notification";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Settings.css";

function Settings() {
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const th = t.settings;

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
                    title={th.goBack}
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
                            {th.eyebrow}
                        </p>

                        <h1>{th.title}</h1>

                        <p>
                            {th.subtitle}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="settings-container"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >

                    
                    {/* LANGUAGE PREFERENCES */}

                    <div className="settings-section">
                        <div className="settings-section-title">
                            <FiGlobe />

                            <div>
                                <h2>{th.languageTitle}</h2>
                                <p>{th.languageDescription}</p>
                            </div>
                        </div>

                        <div className="settings-item">
                            <div className="settings-item-icon">
                                <FiGlobe />
                            </div>

                            <div className="settings-item-content">
                                <h3>{th.appLanguage}</h3>
                                <p>{th.languageHint}</p>
                            </div>

                            <select
                                className="settings-language-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                aria-label={th.appLanguage}
                            >
                                <option value="en">English</option>
                                <option value="hi">हिन्दी</option>
                                <option value="mr">मराठी</option>
                            </select>
                        </div>
                    </div>


                    {/* ACCOUNT */}

                    <div className="settings-section">

                        <div className="settings-section-title">
                            <FiUser />

                            <div>
                                <h2>{th.accountPreferences}</h2>
                                <p>
                                    {th.accountDescription}
                                </p>
                            </div>
                        </div>

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiUser />
                            </div>

                            <div className="settings-item-content">
                                <h3>{th.profile}</h3>
                                <p>
                                    {th.profileDescription}
                                </p>
                            </div>

                            <button
                                className="settings-action-btn"
                                onClick={() => navigate("/profile")}
                            >
                                {th.open}
                            </button>

                        </div>

                    </div>


                    {/* NOTIFICATIONS */}

                    <div className="settings-section">

                        <div className="settings-section-title">
                            <FiBell />

                            <div>
                                <h2>{th.notifications}</h2>
                                <p>
                                    {th.notificationsDescription}
                                </p>
                            </div>
                        </div>

                        {/* CAREER UPDATES */}

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiBell />
                            </div>

                            <div className="settings-item-content">
                                <h3>{th.careerUpdates}</h3>

                                <p>
                                    {th.careerUpdatesDescription}
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
                                <h3>{th.roadmapReminders}</h3>

                                <p>
                                    {th.roadmapRemindersDescription}
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
                                <h2>{th.privacySecurity}</h2>

                                <p>
                                    {th.securityDescription}
                                </p>
                            </div>
                        </div>

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiShield />
                            </div>

                            <div className="settings-item-content">
                                <h3>{th.accountSecurity}</h3>

                                <p>
                                    {th.securityDetails}
                                </p>
                            </div>

                            <span className="settings-status">
                                {th.protected}
                            </span>

                        </div>

                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiFileText />
                            </div>

                            <div className="settings-item-content">
                                <h3>{th.privacyPolicy}</h3>

                                <p>
                                    {th.privacyDescription}
                                </p>
                            </div>

                            <button
                                className="settings-action-btn"
                                onClick={() => navigate("/privacy-policy")}
                            >
                                {th.view}
                            </button>

                        </div>

                    </div>

                </motion.div>

            </div>
        </>
    );
}

export default Settings;

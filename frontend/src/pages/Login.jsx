
import { useState , useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";
import {
    FiMail,
    FiLock,
    FiArrowRight,
    FiGlobe,
    FiChevronDown,
    FiCheck,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";

import "../styles/login.css";


function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: "en", label: "English" },
        { code: "hi", label: "हिन्दी" },
        { code: "mr", label: "मराठी" },
    ];

    const selected =
        languages.find((item) => item.code === language) ||
        languages[0];

    return (
        <div className="login-language-wrapper">
            <button
                type="button"
                className={`login-language-trigger ${
                    isOpen ? "active" : ""
                }`}
                onClick={() => setIsOpen((previous) => !previous)}
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <FiGlobe className="login-language-globe" />

                <span>{selected.label}</span>

                <FiChevronDown
                    className={`login-language-chevron ${
                        isOpen ? "rotated" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        className="login-language-dismiss"
                        aria-label="Close language menu"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="login-language-menu">
                        <p className="login-language-heading">
                            SELECT LANGUAGE
                        </p>

                        {languages.map((item) => (
                            <button
                                type="button"
                                key={item.code}
                                className={`login-language-option ${
                                    language === item.code
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {
                                    setLanguage(item.code);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{item.label}</span>

                                {language === item.code && (
                                    <FiCheck className="login-language-check" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { t } = useLanguage();

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginProgress, setLoginProgress] = useState(0);

    useEffect(() => {
        if (!isLoggingIn) return;

        const timer = setInterval(() => {
            setLoginProgress((previous) => {
                if (previous >= 95) return 95;

                return Math.min(
                    previous + (previous < 60 ? 5 : previous < 85 ? 2 : 1),
                    95
                );
            });
        }, 700);

        return () => clearInterval(timer);
    }, [isLoggingIn]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setIsLoggingIn(true);
        setLoginProgress(5);

        try {
            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);

            const response = await API.post(
                "/login",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                }
            );

            setLoginProgress(100);

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            const logoutTime =
                localStorage.getItem("roadmapLogoutTime");

            if (logoutTime) {
                const currentTime = Date.now();

                const timePassed =
                    currentTime - Number(logoutTime);

                const twoDays = 48 * 60 * 60 * 1000;

                if (timePassed >= twoDays) {
                    localStorage.setItem(
                        "roadmapReminderDue",
                        "true"
                    );
                }

                localStorage.removeItem("roadmapLogoutTime");
            }

            toast.success(t.login.welcome);

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            setIsLoggingIn(false);
            setLoginProgress(0);
            toast.error(t.login.invalid);
        }
    };

    return (
        <>
            <AnimatedBackground />

            <Toaster position="top-right" />

            {isLoggingIn && (
                <div className="auth-progress-toast" role="status" aria-live="polite">
                    <div className="auth-progress-heading">
                        <span>Logging in…</span>
                        <strong>{loginProgress}%</strong>
                    </div>

                    <div className="auth-progress-track">
                        <div
                            className="auth-progress-fill"
                            style={{ width: `${loginProgress}%` }}
                        />
                    </div>

                    <p>
                        This may take longer depending on your internet connection.
                    </p>
                </div>
            )}

            <div className="login-page">

                <LanguageSelector />

                <motion.div
                    className="login-card"
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                >
                    <div className="login-brand">
                        <div className="login-logo">
                            <img
                                src="/careerpilot-mark.png"
                                alt="CareerPilot AI"
                            />
                        </div>

                        <div className="login-brand-text">
                            <h1>CareerPilot AI</h1>

                            <p className="subtitle">
                                {t.login.subtitle}
                            </p>
                        </div>
                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleLogin}
                    >
                        <div className="input-box">
                            <FiMail />

                            <input
                                type="email"
                                placeholder={t.login.email}
                                value={email}
                                autoComplete="email"
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-box">
                            <FiLock />

                            <input
                                type="password"
                                placeholder={t.login.password}
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                        >
                            {t.login.button}
                            <FiArrowRight />
                        </button>
                    </form>

                    
                    <div className="bottom-links">
                        <Link to="/forgot-password">
                            {t.login.forgotPassword}
                        </Link>

                        <Link to="/signup">
                            {t.login.createAccount}
                        </Link>
                    </div>

                    <div className="nihalnova-branding">
                        <span>Powered by NihalNova</span>
                    </div>

                </motion.div>
            </div>
        </>
    );
}

export default Login;

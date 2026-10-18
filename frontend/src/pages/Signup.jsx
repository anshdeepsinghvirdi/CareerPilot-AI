import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/login.css";

function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signupProgress, setSignupProgress] = useState(0);
    useEffect(() => {
        if (!loading) return;

        const timer = setInterval(() => {
            setSignupProgress((previous) => {
                if (previous >= 95) return 95;

                return Math.min(
                    previous + (previous < 60 ? 5 : previous < 85 ? 2 : 1),
                    95
                );
            });
        }, 700);

        return () => clearInterval(timer);
    }, [loading]);

    const { t } = useLanguage();

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            toast.error(t("signup.fillAllFields"));
            return;
        }

        if (password !== confirmPassword) {
            toast.error(t("signup.passwordsMismatch"));
            return;
        }

        if (password.length < 6) {
            toast.error(t("signup.passwordLength"));
            return;
        }

        try {
            setLoading(true);
            setSignupProgress(5);

            console.log("Sending signup request...");

            const response = await API.post("/signup", {
                name: name,
                email: email,
                password: password,
            });

            setSignupProgress(100);

            console.log("Signup Success:", response.data);

            toast.success(t.signup.accountCreated);

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            console.log("Signup Error:", error);

            if (error.response) {

                console.log("Backend Error:", error.response.data);
                console.log("Status:", error.response.status);

                const message =
                    error.response.data?.detail ||
                    error.response.data?.message ||
                    t("signup.signupFailed");

                toast.error(message);

            } else {
                toast.error(t("signup.unableToConnect"));
            }

        } finally {
            setLoading(false);
            setSignupProgress(0);
        }
    };

    return (
        <>

            <AnimatedBackground />

            <Toaster position="top-right" />

            {loading && (
                <div
                    className="auth-progress-toast"
                    role="status"
                    aria-live="polite"
                >
                    <div className="auth-progress-heading">
                        <span>Creating account…</span>
                        <strong>{signupProgress}%</strong>
                    </div>

                    <div className="auth-progress-track">
                        <div
                            className="auth-progress-fill"
                            style={{ width: `${signupProgress}%` }}
                        />
                    </div>

                    <p>
                        This may take longer depending on your internet connection.
                    </p>
                </div>
            )}

            <div className="login-page">

                <motion.div
                    className="login-card"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >

                    <div className="signup-brand">
                        <img
                            src="/careerpilot-mark.png"
                            alt="CareerPilot AI"
                            className="signup-brand-logo"
                        />

                        <div className="signup-brand-text">
                            {t.signup.tagline}
                            <h2>CareerPilot AI</h2>
                            <p>Your Intelligent Career Companion</p>
                        </div>
                    </div>

                    <form onSubmit={handleSignup}>

                        <div className="input-box">

                            <FiUser />

                            <input
                                type="text"
                                placeholder={t.signup.fullName}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                        </div>

                        <div className="input-box">

                            <FiMail />

                            <input
                                type="email"
                                placeholder={t.signup.email}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>

                        <div className="input-box">

                            <FiLock />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t.signup.password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword
                                    ? <FiEyeOff />
                                    : <FiEye />
                                }
                            </div>

                        </div>

                        <div className="input-box">

                            <FiLock />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder={t.signup.confirmPassword}
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <div
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? <FiEyeOff />
                                    : <FiEye />
                                }
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading
                                ? t.signup.creatingAccount
                                : t.signup.createAccount
                            }

                            {!loading && <FiArrowRight />}
                        </button>

                    </form>

                    
                    <div className="bottom-links">

                        <span>
                            {t.signup.alreadyHaveAccount}
                        </span>

                        <Link to="/login">
                            {t.signup.login}
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

export default Signup;
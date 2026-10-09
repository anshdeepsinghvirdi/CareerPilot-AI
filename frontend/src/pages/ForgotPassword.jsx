import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";

import "../styles/login.css";

function ForgotPassword() {
    const { t } = useLanguage();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {

        e.preventDefault();

        if (!email) {
            toast.error(t.forgotPassword.invalidEmail);
            return;
        }

        try {

            setLoading(true);

            await API.post("/forgot-password", {
                email: email
            });

            toast.success(t.forgotPassword.success);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            console.error(
                t.forgotPassword.error,
                error.response?.data
            );

            toast.error(
                error.response?.data?.detail ||
                t.forgotPassword.error
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <AnimatedBackground />

            <Toaster position="top-right" />

            <div className="login-page">

                <motion.div
                    className="login-card"

                    initial={{ opacity: 0, y: 40 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 0.6 }}
                >

                    <div className="login-brand">

                        <div className="login-logo">

                            <img
                                src="/careerpilot-mark.png"
                                alt="CareerPilot AI"
                            />

                        </div>

                        <div className="login-brand-text">

                            <h1>
                                {t.forgotPassword.title}
                            </h1>

                            <p className="subtitle">
                                {t.forgotPassword.subtitle}
                            </p>

                        </div>

                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleForgotPassword}
                    >

                        <div className="input-box">

                            <FiMail />

                            <input
                                type="email"
                                placeholder={t.forgotPassword.email}
                                value={email}
                                autoComplete="email"
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading
                                ? t.forgotPassword.sending
                                : t.forgotPassword.send
                            }

                            {!loading && <FiArrowRight />}
                        </button>

                    </form>

                    <div className="bottom-links">

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            style={{
                                background: "none",
                                border: "none",
                                color: "inherit",
                                cursor: "pointer"
                            }}
                        >
                            {t.forgotPassword.backToLogin}
                        </button>

                    </div>

                </motion.div>

            </div>
        </>
    );
}

export default ForgotPassword;
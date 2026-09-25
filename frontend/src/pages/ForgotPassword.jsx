import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import "../styles/login.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {

        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {

            setLoading(true);

            await API.post("/forgot-password", {
                email: email
            });

            toast.success("Password reset link sent to your email!");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            console.error(
                "FORGOT PASSWORD ERROR:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.detail ||
                "Failed to send reset email"
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
                                CareerPilot AI
                            </h1>

                            <p className="subtitle">
                                Reset Your Password
                            </p>

                        </div>

                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleForgotPassword}
                    >

                        <p className="subtitle">
                            Enter your registered email and
                            we'll send you a password reset link.
                        </p>

                        <div className="input-box">

                            <FiMail />

                            <input
                                type="email"
                                placeholder="Email Address"
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
                                ? "Sending..."
                                : "Send Reset Link"
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
                            Back to Login
                        </button>

                    </div>

                </motion.div>

            </div>
        </>
    );
}

export default ForgotPassword;
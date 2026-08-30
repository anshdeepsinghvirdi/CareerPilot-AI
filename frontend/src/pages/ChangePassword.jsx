import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import AnimatedBackground from "../components/AnimatedBackground";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import "../styles/login.css";

function ChangePassword() {
    const [email, setEmail] = useState("");

    const handleSendLink = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            const response = await API.post("/forgot-password", {
                email: email.trim(),
            });

            toast.success(
                response.data.message || "Password reset link sent to your email."
            );

        } catch (error) {
            console.log("FORGOT PASSWORD ERROR:", error);

            const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to send reset link.";

            toast.error(message);
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
                >
                    <div className="brand-logo-header">
                        <img
                            src="/careerpilot-mark.png"
                            alt="CareerPilot AI"
                            className="brand-logo-img"
                        />

                        <div className="brand-logo-text">
                            <span>CareerPilot AI</span>
                        </div>
                    </div>

                    <h1>Forgot Password</h1>

                    <p className="subtitle">
                        Enter your registered email address.
                        <br />
                        We'll send you a password reset link.
                    </p>

                    <div className="input-box">
                        <FiMail />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        className="login-btn"
                        onClick={handleSendLink}
                    >
                        Send Reset Link
                        <FiArrowRight />
                    </button>

                    <div className="bottom-links">
                        <Link to="/login">
                            Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default ChangePassword;
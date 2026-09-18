import { useState } from "react";
import { FiTrash2, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

import AnimatedBackground from "../components/AnimatedBackground";
import API from "../services/api";
import "../styles/Dashboard.css";

function DeleteAccount() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleDeleteRequest = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (!email.trim()) {
            setError("Please enter your account email.");
            return;
        }

        setLoading(true);

        try {
            /*
             * IMPORTANT:
             * We will connect this form to a dedicated backend
             * account-deletion request endpoint.
             */

            await API.post("/profile/delete-account-request", {
                email: email.trim(),
            });

            setSuccess(true);
            setEmail("");
        } catch (err) {
            console.error("Delete account request error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to submit your deletion request. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="privacy-page">

            <AnimatedBackground />

            <div className="privacy-container">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >

                    <div className="settings-section">

                        <div className="settings-section-title">
                            <FiTrash2 />

                            <div>
                                <h2>Delete CareerPilot Account</h2>

                                <p>
                                    Request deletion of your CareerPilot account
                                    and associated personal data.
                                </p>
                            </div>
                        </div>


                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiAlertTriangle />
                            </div>

                            <div className="settings-item-content">

                                <h3>This action is permanent</h3>

                                <p>
                                    Account information, resumes, resume analysis,
                                    roadmap data and other associated account data
                                    may be permanently deleted after verification.
                                </p>

                            </div>

                        </div>


                        {success && (
                            <div className="settings-item">

                                <div className="settings-item-icon">
                                    <FiCheckCircle />
                                </div>

                                <div className="settings-item-content">

                                    <h3>Request submitted</h3>

                                    <p>
                                        Your account deletion request has been
                                        submitted. We will verify the request
                                        before deleting the account.
                                    </p>

                                </div>

                            </div>
                        )}


                        {error && (
                            <p style={{ color: "#ff6b6b", marginTop: "15px" }}>
                                {error}
                            </p>
                        )}


                        {!success && (
                            <form onSubmit={handleDeleteRequest}>

                                <div style={{ marginTop: "25px" }}>

                                    <label>
                                        Account Email
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your CareerPilot email"
                                        required
                                        style={{
                                            width: "100%",
                                            marginTop: "8px",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            background: "rgba(255,255,255,0.05)",
                                            color: "white",
                                            outline: "none",
                                        }}
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="settings-action-btn"
                                    disabled={loading}
                                    style={{ marginTop: "20px" }}
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Request Account Deletion"}
                                </button>

                            </form>
                        )}

                    </div>

                </motion.div>

            </div>

        </div>
    );
}

export default DeleteAccount;
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiTrash2, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

import AnimatedBackground from "../components/AnimatedBackground";
import API from "../services/api";
import "../styles/Dashboard.css";

function DeleteAccount() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");

    // --------------------------------
    // REQUEST DELETION EMAIL
    // --------------------------------

    const handleDeleteRequest = async (e) => {

        e.preventDefault();

        setError("");
        setEmailSent(false);

        if (!email.trim()) {
            setError("Please enter your CareerPilot account email.");
            return;
        }

        setLoading(true);

        try {

            await API.post(
                "/profile/delete-account-request",
                null,
                {
                    params: {
                        email: email.trim(),
                    },
                }
            );

            setEmailSent(true);
            setEmail("");

        } catch (err) {

            console.error(
                "Delete account request error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to submit your request. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    // --------------------------------
    // CONFIRM ACCOUNT DELETION
    // --------------------------------

    const handleConfirmDeletion = async () => {

        setLoading(true);
        setError("");

        try {

            await API.delete(
                "/profile/delete-account-confirm",
                {
                    params: {
                        token: token,
                    },
                }
            );

            setDeleted(true);

        } catch (err) {

            console.error(
                "Account deletion error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "This deletion link is invalid or expired."
            );

        } finally {

            setLoading(false);

        }
    };


    // --------------------------------
    // DELETED SUCCESSFULLY
    // --------------------------------

    if (deleted) {

        return (
            <div className="privacy-page">

                <AnimatedBackground />

                <div className="privacy-container">

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        transition={{
                            duration: 0.5
                        }}
                    >

                        <div className="settings-section">

                            <div className="settings-section-title">

                                <FiCheckCircle />

                                <div>

                                    <h2>
                                        Account Deleted
                                    </h2>

                                    <p>
                                        Your CareerPilot account and
                                        associated data have been
                                        permanently deleted.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="settings-action-btn"
                                onClick={() =>
                                    navigate("/login")
                                }
                                style={{
                                    marginTop: "20px"
                                }}
                            >
                                Return to Login
                            </button>

                        </div>

                    </motion.div>

                </div>

            </div>
        );
    }


    // --------------------------------
    // CONFIRMATION PAGE
    // --------------------------------

    if (token) {

        return (
            <div className="privacy-page">

                <AnimatedBackground />

                <div className="privacy-container">

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                    >

                        <div className="settings-section">

                            <div className="settings-section-title">

                                <FiTrash2 />

                                <div>

                                    <h2>
                                        Confirm Account Deletion
                                    </h2>

                                    <p>
                                        You are about to permanently
                                        delete your CareerPilot account.
                                    </p>

                                </div>

                            </div>


                            <div className="settings-item">

                                <div className="settings-item-icon">
                                    <FiAlertTriangle />
                                </div>

                                <div className="settings-item-content">

                                    <h3>
                                        This action cannot be undone
                                    </h3>

                                    <p>
                                        Your account, resumes, resume
                                        analysis, roadmap data and
                                        associated account information
                                        will be permanently deleted.
                                    </p>

                                </div>

                            </div>


                            {error && (
                                <p
                                    style={{
                                        color: "#ff6b6b",
                                        marginTop: "15px"
                                    }}
                                >
                                    {error}
                                </p>
                            )}


                            <button
                                className="settings-action-btn"
                                onClick={handleConfirmDeletion}
                                disabled={loading}
                                style={{
                                    marginTop: "20px",
                                    background: "#dc3545"
                                }}
                            >

                                {loading
                                    ? "Deleting..."
                                    : "Permanently Delete Account"}

                            </button>

                        </div>

                    </motion.div>

                </div>

            </div>
        );
    }


    // --------------------------------
    // EMAIL REQUEST PAGE
    // --------------------------------

    return (
        <div className="privacy-page">

            <AnimatedBackground />

            <div className="privacy-container">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.5
                    }}
                >

                    <div className="settings-section">

                        <div className="settings-section-title">

                            <FiTrash2 />

                            <div>

                                <h2>
                                    Delete CareerPilot Account
                                </h2>

                                <p>
                                    Request deletion of your CareerPilot
                                    account and associated data.
                                </p>

                            </div>

                        </div>


                        <div className="settings-item">

                            <div className="settings-item-icon">
                                <FiAlertTriangle />
                            </div>

                            <div className="settings-item-content">

                                <h3>
                                    This action is permanent
                                </h3>

                                <p>
                                    Account information, resumes,
                                    resume analysis, roadmap data
                                    and other associated account data
                                    will be permanently deleted after
                                    verification.
                                </p>

                            </div>

                        </div>


                        {emailSent && (

                            <div className="settings-item">

                                <div className="settings-item-icon">
                                    <FiCheckCircle />
                                </div>

                                <div className="settings-item-content">

                                    <h3>
                                        Verification email sent
                                    </h3>

                                    <p>
                                        If an account exists with that
                                        email address, a confirmation
                                        link has been sent. Please
                                        check your inbox.
                                    </p>

                                </div>

                            </div>

                        )}


                        {error && (

                            <p
                                style={{
                                    color: "#ff6b6b",
                                    marginTop: "15px"
                                }}
                            >
                                {error}
                            </p>

                        )}


                        <form
                            onSubmit={handleDeleteRequest}
                        >

                            <div
                                style={{
                                    marginTop: "25px"
                                }}
                            >

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
                                        border:
                                            "1px solid rgba(255,255,255,0.15)",
                                        background:
                                            "rgba(255,255,255,0.05)",
                                        color: "white",
                                        outline: "none",
                                    }}
                                />

                            </div>


                            <button
                                type="submit"
                                className="settings-action-btn"
                                disabled={loading}
                                style={{
                                    marginTop: "20px"
                                }}
                            >

                                {loading
                                    ? "Sending..."
                                    : "Request Account Deletion"}

                            </button>

                        </form>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}

export default DeleteAccount;
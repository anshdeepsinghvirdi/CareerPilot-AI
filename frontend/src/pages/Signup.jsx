import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
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

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            console.log("Sending signup request...");

            const response = await API.post("/signup", {
                name: name,
                email: email,
                password: password,
            });

            console.log("Signup Success:", response.data);

            toast.success("Account created successfully!");

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
                    "Signup failed.";

                toast.error(message);

            } else {
                toast.error("Unable to connect to server.");
            }

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

                    <div className="signup-brand">
                        <img
                            src="/careerpilot-mark.png"
                            alt="CareerPilot AI"
                            className="signup-brand-logo"
                        />

                        <div className="signup-brand-text">
                            <h2>CareerPilot AI</h2>
                            <p>Your Intelligent Career Companion</p>
                        </div>
                    </div>

                    <form onSubmit={handleSignup}>

                        <div className="input-box">

                            <FiUser />

                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                        </div>

                        <div className="input-box">

                            <FiMail />

                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>

                        <div className="input-box">

                            <FiLock />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
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
                                placeholder="Confirm Password"
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
                                ? "Creating Account..."
                                : "Create Account"
                            }

                            {!loading && <FiArrowRight />}
                        </button>

                    </form>

                    <div className="bottom-links">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Login
                        </Link>

                    </div>

                </motion.div>

            </div>
        </>
    );
}

export default Signup;
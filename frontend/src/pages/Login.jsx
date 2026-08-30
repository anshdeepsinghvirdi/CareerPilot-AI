import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import "../styles/login.css"

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);

            const response = await API.post(
                "/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            const logoutTime = localStorage.getItem("roadmapLogoutTime");

            if (logoutTime) {

                const currentTime = Date.now();

                const timePassed =
                    currentTime - Number(logoutTime);

                const twoDays =
                    48 * 60 * 60 * 1000;

                if (timePassed >= twoDays) {

                    localStorage.setItem(
                        "roadmapReminderDue",
                        "true"
                    );

                }

                localStorage.removeItem("roadmapLogoutTime");
            }

            toast.success("Welcome Back 🚀");

            setTimeout(() => {

                navigate("/dashboard");

            }, 1000);

        } catch {

            toast.error("Invalid Email or Password");
        }
    };

    return (
        <>
            <AnimatedBackground />

            <Toaster position="top-right"/>

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

                                Your Intelligent Career Companion

                            </p>
                        </div>
                        
                    </div>

                    

                    

                    <form 
                        className="login-form"
                        onSubmit={handleLogin}>

                        <div className="input-box">

                            <FiMail/>

                            <input 
                                
                                type="email"

                                placeholder="Email Address"

                                value={email}

                                autoComplete="email"

                                onChange={(e)=>setEmail(e.target.value)}

                            />

                        </div>

                        <div className="input-box">

                            <FiLock/>

                            <input
                               
                               type="password"
                               placeholder="Password"
                               value={password}
                               autoComplete="current-password"
                               onChange={(e)=>setPassword(e.target.value)}
                            />
                        
                        </div>

                        <button 
                            type="submit"
                            className="login-btn">
                                Login
                            <FiArrowRight/>
                        </button>

                    </form>

                    <div className="bottom-links">

                        <Link to="/change-password">

                            Forgot Password?
                                
                        </Link>

                        <Link to="/signup">

                            Create Account
                        
                        </Link>
                    </div>

                </motion.div>

            </div>
        </>
    );
};

export default Login;
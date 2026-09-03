import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/login.css";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import toast, { Toaster } from "react-hot-toast";


function ChangePassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleResetPassword = async () => {

    if (!password || !confirmPassword) {
      toast.error("Please enter your new password");
      return;
    }


    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }


    try {

      await API.post("/reset-password", {
        token: token,
        new_password: password
      });


      toast.success("Password updated successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);


    } catch (error) {

      console.error("RESET PASSWORD ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.detail ||
        "Invalid or expired reset link"
      );
    }
  };


  return (

    <>
      <AnimatedBackground />

      <Toaster position="top-right" />

      <div className="login-page">

        <div className="login-card">

          <h1>Reset Password</h1>

          <p className="subtitle">
            Create your new password
          </p>


          <div className="input-box">

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>


          <div className="input-box">

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

          </div>


          <button
            className="login-btn"
            onClick={handleResetPassword}
          >
            Update Password
          </button>

        </div>

      </div>

    </>
  );
}


export default ChangePassword;
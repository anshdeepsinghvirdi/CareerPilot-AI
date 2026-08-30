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

    if (password != confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await API.post("/reset-password", {
        token: token,
        new_password: password
      });

      toast.success("Password update successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error("Invalid or expired reset link");
    }
  };

  return (
    <>
      <AnimatedBackground />
      <toaster position="top-right" />

      <div className="login-page">
        <div className="login-card">

          <h1>Reset Password</h1>

          <p className="subtitle">
            Create your own Password
          </p>

          <div className="input-box">
            <input
              type="password"
              placeholder="New Password"
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="ConfirmPassword"
            />
          </div>

          <button className="login-btn"  onClick={handleResetPassword}>
            Update Password
          </button>

        </div>
      </div>
    </>
  );
}

export default ChangePassword;
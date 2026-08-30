import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { startCareerPilotReminders } from "./services/notification.js";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import ResumeHistory from "./pages/ResumeHistory";
import Roadmap from "./pages/Roadmap";
import Interview from "./pages/Interview";
import ChangePassword from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;
    startCareerPilotReminders();

  }, []);

  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/login" element={<Login />} />

      <Route path="/change-password" element={<ChangePassword />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path ="/profile" element={<Profile />} />

      <Route path="/resume" element={<Resume />} />

      <Route path="/resume-history" element={<ResumeHistory />} />

      <Route path="/roadmap" element={<Roadmap />} />

      <Route path="/interview" element={<Interview />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/settings" element={<Settings />} />

    </Routes>
  );
}

export default App;
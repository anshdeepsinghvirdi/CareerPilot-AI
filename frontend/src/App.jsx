import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";


import {
  startCareerPilotReminders,
  cancelAndroidReminders,
} from "./services/notification.js";

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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeleteAccount from "./pages/DeleteAccount";
import ForgotPassword from "./pages/ForgotPassword";


function App() {

  const navigate = useNavigate();
  const location = useLocation();


  // -----------------------------------------
  // NOTIFICATION TAP HANDLING
  // -----------------------------------------
  useEffect(() => {

    let listener;

    const setupNotificationTapListener = async () => {

      listener = await LocalNotifications.addListener(
        "localNotificationActionPerformed",
        (action) => {

          console.log(
            "CareerPilot notification tapped:",
            action
          );

          const token = localStorage.getItem("token");

          if (!token) {
            navigate("/login");
            return;
          }

          const route =
            action?.notification?.extra?.route || "/dashboard";

          navigate(route);
        }
      );

    };

    setupNotificationTapListener();

    return () => {

      if (listener) {
        listener.remove();
      }

    };

  }, [navigate]);


  // -----------------------------------------
  // ANDROID BACK BUTTON / GESTURE
  // -----------------------------------------
  useEffect(() => {

    let listener;

    const setupBackButton = async () => {

      listener = await CapacitorApp.addListener(
        "backButton",
        ({ canGoBack }) => {

          console.log(
            "Android Back pressed:",
            location.pathname,
            "canGoBack:",
            canGoBack
          );

          // Dashboard is the main/root screen of the app
          if (location.pathname === "/dashboard") {

            CapacitorApp.exitApp();

            return;
          }

          // If there is a previous React page, go back
          if (canGoBack) {

            navigate(-1);

            return;
          }

          // If there is no previous page,
          // return to dashboard for logged-in users
          const token = localStorage.getItem("token");

          if (token) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }

        }
      );

    };

    setupBackButton();


    return () => {

      if (listener) {
        listener.remove();
      }

    };

  }, [navigate, location.pathname]);


  // -----------------------------------------
  // APP BACKGROUND / FOREGROUND
  // NOTIFICATION LOGIC
  // -----------------------------------------
  useEffect(() => {

    let listener;

    const setupAppStateListener = async () => {

      listener = await CapacitorApp.addListener(
        "appStateChange",
        async ({ isActive }) => {

          const token = localStorage.getItem("token");

          // User is not logged in
          if (!token) {
            console.log("No logged-in user - notification timer ignored");
            return;
          }

          if (isActive) {

            // User returned to CareerPilot
            console.log(
              "CareerPilot active - cancelling inactivity reminders"
            );

            await cancelAndroidReminders();

          } else {

            // User left CareerPilot
            console.log(
              "CareerPilot moved to background - starting inactivity timer"
            );

            await startCareerPilotReminders();

          }

        }
      );

    };

    setupAppStateListener();

    return () => {

      if (listener) {
        listener.remove();
      }

    };

  }, []);


  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/change-password"
        element={<ChangePassword />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/resume"
        element={<Resume />}
      />

      <Route
        path="/resume-history"
        element={<ResumeHistory />}
      />

      <Route
        path="/roadmap"
        element={<Roadmap />}
      />

      <Route
        path="/interview"
        element={<Interview />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
        path="/privacy-policy"
        element={<PrivacyPolicy />}
      />

      <Route
        path="/delete-account"
        element={<DeleteAccount />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

    </Routes>
  );
}

export default App;
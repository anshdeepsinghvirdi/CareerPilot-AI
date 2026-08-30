/* =========================================
   CAREERPILOT NOTIFICATIONS
========================================= */

const ROADMAP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const APP_INTERVAL = 48 * 60 * 60 * 1000;     // 48 hours


/* =========================================
   REQUEST PERMISSION
========================================= */

export const requestNotificationPermission = async () => {

    if (!("Notification" in window)) {
        console.log("Browser notifications are not supported.");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission === "denied") {
        console.log("Notification permission was denied.");
        return false;
    }

    const permission = await Notification.requestPermission();

    return permission === "granted";
};


/* =========================================
   SEND BROWSER NOTIFICATION
========================================= */

export const sendBrowserNotification = (
    title,
    options = {}
) => {

    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission !== "granted") {
        return;
    }

    new Notification(title, {
        icon: "/careerpilot-logo.png",
        ...options,
    });
};


/* =========================================
   ROADMAP NOTIFICATION
   EVERY 24 HOURS
========================================= */

export const sendRoadmapReminder = (
    stageTitle = "your current roadmap topic"
) => {

    sendBrowserNotification(
        "CareerPilot Roadmap",
        {
            body:
                `Don't forget to continue "${stageTitle}". Keep moving toward your career goal.`,
        }
    );
};


/* =========================================
   APP NOTIFICATION
   EVERY 48 HOURS
========================================= */

export const sendCareerPilotReminder = () => {

    sendBrowserNotification(
        "CareerPilot AI",
        {
            body:
                "Your career journey is waiting. Come back to CareerPilot and continue learning.",
        }
    );
};


/* =========================================
   START AUTOMATIC REMINDERS
========================================= */

export const startCareerPilotReminders = async (
    currentStageTitle = "your current roadmap topic"
) => {

    const allowed = await requestNotificationPermission();

    if (!allowed) {
        return;
    }


    /* ================================
       24 HOUR ROADMAP REMINDER
    ================================ */

    const lastRoadmapReminder =
        localStorage.getItem("lastRoadmapReminder");

    const now = Date.now();

    if (
        !lastRoadmapReminder ||
        now - Number(lastRoadmapReminder) >= ROADMAP_INTERVAL
    ) {

        sendRoadmapReminder(currentStageTitle);

        localStorage.setItem(
            "lastRoadmapReminder",
            now.toString()
        );
    }


    /* ================================
       48 HOUR APP REMINDER
    ================================ */

    const lastAppReminder =
        localStorage.getItem("lastAppReminder");

    if (
        !lastAppReminder ||
        now - Number(lastAppReminder) >= APP_INTERVAL
    ) {

        sendCareerPilotReminder();

        localStorage.setItem(
            "lastAppReminder",
            now.toString()
        );
    }
};
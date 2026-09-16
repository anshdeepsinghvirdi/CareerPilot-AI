import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";


/* =========================================
   CAREERPILOT NOTIFICATIONS
========================================= */

const ROADMAP_NOTIFICATION_ID = 1001;
const APP_NOTIFICATION_ID = 1002;


/* =========================================
   CHECK IF ANDROID APP
========================================= */

const isAndroidApp = () => {
    return Capacitor.getPlatform() === "android";
};


/* =========================================
   REQUEST NOTIFICATION PERMISSION
========================================= */

export const requestNotificationPermission = async () => {

    /* ================================
       ANDROID APP
    ================================ */

    if (isAndroidApp()) {

        try {

            let permission =
                await LocalNotifications.checkPermissions();

            if (permission.display === "granted") {
                return true;
            }

            permission =
                await LocalNotifications.requestPermissions();

            return permission.display === "granted";

        } catch (error) {

            console.error(
                "Android notification permission error:",
                error
            );

            return false;
        }
    }


    /* ================================
       BROWSER
    ================================ */

    if (!("Notification" in window)) {

        console.log(
            "Browser notifications are not supported."
        );

        return false;
    }


    if (Notification.permission === "granted") {
        return true;
    }


    if (Notification.permission === "denied") {

        console.log(
            "Notification permission was denied."
        );

        return false;
    }


    const permission =
        await Notification.requestPermission();

    return permission === "granted";
};


/* =========================================
   SEND BROWSER NOTIFICATION
========================================= */

export const sendBrowserNotification = (
    title,
    options = {}
) => {

    /* Don't use browser Notification API
       inside Android APK */

    if (isAndroidApp()) {
        return;
    }


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
   SEND ANDROID NOTIFICATION NOW
========================================= */

export const sendAndroidNotification = async (
    title,
    body,
    id = 2000
) => {

    if (!isAndroidApp()) {
        return;
    }


    try {

        const allowed =
            await requestNotificationPermission();

        if (!allowed) {
            return;
        }


        await LocalNotifications.schedule({

            notifications: [

                {
                    id,
                    title,
                    body,

                    schedule: {
                        at: new Date(
                            Date.now() + 1000
                        ),
                    },

                    sound: undefined,

                    extra: {
                        type: "careerpilot"
                    },
                },

            ],

        });

    } catch (error) {

        console.error(
            "Android notification error:",
            error
        );
    }
};


/* =========================================
   ROADMAP NOTIFICATION
========================================= */

export const sendRoadmapReminder = async (
    stageTitle = "your current roadmap topic"
) => {

    const title =
        "CareerPilot Roadmap";

    const body =
        `Don't forget to continue "${stageTitle}". Keep moving toward your career goal.`;


    if (isAndroidApp()) {

        await sendAndroidNotification(
            title,
            body,
            3001
        );

        return;
    }


    sendBrowserNotification(
        title,
        {
            body,
        }
    );
};


/* =========================================
   APP NOTIFICATION
========================================= */

export const sendCareerPilotReminder = async () => {

    const title =
        "CareerPilot AI";

    const body =
        "Your career journey is waiting. Come back to CareerPilot and continue learning.";


    if (isAndroidApp()) {

        await sendAndroidNotification(
            title,
            body,
            3002
        );

        return;
    }


    sendBrowserNotification(
        title,
        {
            body,
        }
    );
};


/* =========================================
   SCHEDULE ANDROID REMINDERS
========================================= */

const scheduleAndroidReminders = async (
    currentStageTitle
) => {

    try {

        const allowed =
            await requestNotificationPermission();

        if (!allowed) {
            return;
        }


        /* ================================
           CANCEL OLD REMINDERS
        ================================ */

        await LocalNotifications.cancel({

            notifications: [

                {
                    id: ROADMAP_NOTIFICATION_ID
                },

                {
                    id: APP_NOTIFICATION_ID
                }

            ]

        });


        /* ================================
           ROADMAP — 24 HOURS
        ================================ */

        const roadmapTime =
            new Date(
                Date.now() +
                24 * 60 * 60 * 1000
            );


        /* ================================
           APP — 48 HOURS
        ================================ */

        const appTime =
            new Date(
                Date.now() +
                48 * 60 * 60 * 1000
            );


        await LocalNotifications.schedule({

            notifications: [

                {
                    id: ROADMAP_NOTIFICATION_ID,

                    title:
                        "CareerPilot Roadmap",

                    body:
                        `Don't forget to continue "${currentStageTitle}". Keep moving toward your career goal.`,

                    schedule: {
                        at: roadmapTime,

                        isExactNotification: false,
                    },

                    extra: {
                        type: "roadmap-reminder"
                    }
                },


                {
                    id: APP_NOTIFICATION_ID,

                    title:
                        "CareerPilot AI",

                    body:
                        "Your career journey is waiting. Come back to CareerPilot and continue learning.",

                    schedule: {
                        at: appTime,

                        isExactNotification: false,
                    },

                    extra: {
                        type: "app-reminder"
                    }
                }

            ]

        });


        console.log(
            "CareerPilot Android reminders scheduled."
        );


    } catch (error) {

        console.error(
            "Failed to schedule Android reminders:",
            error
        );
    }
};


/* =========================================
   START AUTOMATIC REMINDERS
========================================= */

export const startCareerPilotReminders = async (
    currentStageTitle =
        "your current roadmap topic"
) => {


    /* =================================
       ANDROID
    ================================= */

    if (isAndroidApp()) {

        await scheduleAndroidReminders(
            currentStageTitle
        );

        return;
    }


    /* =================================
       BROWSER
    ================================= */

    const allowed =
        await requestNotificationPermission();

    if (!allowed) {
        return;
    }


    const now = Date.now();


    /* ================================
       ROADMAP — 24 HOURS
    ================================ */

    const lastRoadmapReminder =
        localStorage.getItem(
            "lastRoadmapReminder"
        );


    if (
        !lastRoadmapReminder ||
        now -
        Number(lastRoadmapReminder) >=
        24 * 60 * 60 * 1000
    ) {

        await sendRoadmapReminder(
            currentStageTitle
        );


        localStorage.setItem(
            "lastRoadmapReminder",
            now.toString()
        );
    }


    /* ================================
       APP — 48 HOURS
    ================================ */

    const lastAppReminder =
        localStorage.getItem(
            "lastAppReminder"
        );


    if (
        !lastAppReminder ||
        now -
        Number(lastAppReminder) >=
        48 * 60 * 60 * 1000
    ) {

        await sendCareerPilotReminder();


        localStorage.setItem(
            "lastAppReminder",
            now.toString()
        );
    }

};
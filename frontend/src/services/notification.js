import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";


/* =========================================
   CAREERPILOT NOTIFICATIONS
========================================= */

const ROADMAP_NOTIFICATION_ID = 1001;
const APP_NOTIFICATION_ID = 1002;

const NOTIFICATION_CHANNEL_ID = "careerpilot_reminders";


/* =========================================
   TEST MODE
========================================= */

/*
   true  = 30 sec / 60 sec testing
   false = 24 hours / 48 hours production
*/

const TEST_MODE = false;

const ROADMAP_DELAY = TEST_MODE
    ? 30 * 1000
    : 24 * 60 * 60 * 1000;

const APP_DELAY = TEST_MODE
    ? 60 * 1000
    : 48 * 60 * 60 * 1000;


/* =========================================
   CHECK ANDROID
========================================= */

const isAndroidApp = () => {
    return Capacitor.getPlatform() === "android";
};


/* =========================================
   CREATE ANDROID NOTIFICATION CHANNEL
========================================= */

const createAndroidNotificationChannel = async () => {

    if (!isAndroidApp()) {
        return;
    }

    try {

        await LocalNotifications.createChannel({

            id: NOTIFICATION_CHANNEL_ID,

            name: "CareerPilot Reminders",

            description:
                "Reminders to continue your CareerPilot career journey.",

            importance: 5,

            visibility: 1,

            sound: "default",

            vibration: true,

        });

        console.log(
            "CareerPilot notification channel created."
        );

    } catch (error) {

        console.error(
            "Failed to create notification channel:",
            error
        );
    }
};


/* =========================================
   REQUEST NOTIFICATION PERMISSION
========================================= */

export const requestNotificationPermission = async () => {

    /* ================================
       ANDROID
    ================================ */

    if (isAndroidApp()) {

        try {

            let permission =
                await LocalNotifications.checkPermissions();

            console.log(
                "CareerPilot notification permission:",
                permission
            );

            if (permission.display === "granted") {

                await createAndroidNotificationChannel();

                return true;
            }

            permission =
                await LocalNotifications.requestPermissions();

            console.log(
                "CareerPilot notification permission after request:",
                permission
            );

            if (permission.display === "granted") {

                await createAndroidNotificationChannel();

                return true;
            }

            return false;

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

                    channelId:
                        NOTIFICATION_CHANNEL_ID,

                    schedule: {

                        at:
                            new Date(
                                Date.now() + 1000
                            ),

                        allowWhileIdle:
                            true,

                    },

                    extra: {

                        type:
                            "careerpilot",

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
   CANCEL EXISTING ANDROID REMINDERS
========================================= */

export const cancelAndroidReminders = async () => {

    try {

        await LocalNotifications.cancel({

            notifications: [

                {
                    id:
                        ROADMAP_NOTIFICATION_ID
                },

                {
                    id:
                        APP_NOTIFICATION_ID
                }

            ]

        });

        console.log(
            "CareerPilot old inactivity reminders cancelled."
        );

    } catch (error) {

        console.error(
            "Failed to cancel old reminders:",
            error
        );
    }
};


/* =========================================
   SCHEDULE ANDROID INACTIVITY REMINDERS
========================================= */

const scheduleAndroidReminders = async (
    currentStageTitle
) => {

    try {

        /* ================================
           PERMISSION
        ================================ */

        const allowed =
            await requestNotificationPermission();

        if (!allowed) {

            console.log(
                "CareerPilot notifications not allowed."
            );

            return;
        }


        /* ================================
           CANCEL OLD TIMERS
        ================================ */

        await cancelAndroidReminders();


        /* ================================
           CALCULATE NEW INACTIVITY TIMES
        ================================ */

        const now =
            Date.now();

        const roadmapTime =
            new Date(
                now + ROADMAP_DELAY
            );

        const appTime =
            new Date(
                now + APP_DELAY
            );


        console.log(
            "CareerPilot inactivity starting now."
        );

        console.log(
            "Roadmap reminder:",
            roadmapTime
        );

        console.log(
            "CareerPilot reminder:",
            appTime
        );


        /* ================================
           SCHEDULE NATIVE ANDROID REMINDERS
        ================================ */

        const result =
            await LocalNotifications.schedule({

                notifications: [

                    {
                        id:
                            ROADMAP_NOTIFICATION_ID,

                        title:
                            "CareerPilot Roadmap",

                        body:
                            `Don't forget to continue "${currentStageTitle}". Keep moving toward your career goal.`,

                        channelId:
                            NOTIFICATION_CHANNEL_ID,

                        schedule: {

                            at:
                                roadmapTime,

                            allowWhileIdle:
                                true,

                        },

                        extra: {

                            type:"roadmap-inactivity-reminder",
                            route: "/dashboard"
                        },

                    },


                    {
                        id:
                            APP_NOTIFICATION_ID,

                        title:
                            "CareerPilot AI",

                        body:
                            "Your career journey is waiting. Come back to CareerPilot and continue learning.",

                        channelId:
                            NOTIFICATION_CHANNEL_ID,

                        schedule: {

                            at:
                                appTime,

                            allowWhileIdle:
                                true,

                        },

                        extra: {

                            type:"app-inactivity-reminder",
                            route: "/dashboard"

                        },

                    },

                ],

            });


        console.log(
            "CareerPilot inactivity reminders scheduled:",
            result
        );


        /* ================================
           VERIFY NATIVE PENDING NOTIFICATIONS
        ================================ */

        const pending =
            await LocalNotifications.getPending();

        console.log(
            "CareerPilot pending notifications:",
            pending
        );


    } catch (error) {

        console.error(
            "Failed to schedule Android inactivity reminders:",
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

        /*
           Every genuine app opening starts
           a NEW inactivity period.

           Android owns the timers after this.

           30 sec / 60 sec in TEST_MODE.
           24h / 48h in production.
        */

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


    const now =
        Date.now();


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
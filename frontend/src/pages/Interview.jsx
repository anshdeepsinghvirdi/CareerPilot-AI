import { useState, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import {
    FiArrowLeft,
    FiMic,
    FiBriefcase,
    FiPlay,
    FiSend,
    FiMessageSquare,
    FiCheckCircle,
} from "react-icons/fi";
import AnimatedBackground from "../components/AnimatedBackground";
import API from "../services/api";
import "../styles/interview.css";

function Interview() {

    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [evaluation, setEvaluation] = useState("");
    const [loading, setLoading] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [evaluating, setEvaluating] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported] = useState(true);

    const roles = [
        "AI Engineer",
        "Machine Learning Engineer",
        "Software Developer",
        "Mechanical Engineer",
        "Electrical Engineer",
        "Civil Engineer",
        "Data Scientist",
        "Web Developer",
        "Business Analyst",
        "Marketing Professional",
        "Finance Professional",
    ];

    const startInterview = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await API.post(
                "/interview/start",
                {
                    role: role
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setQuestion(response.data.question);
            setEvaluation("");
            setAnswer("");
            setQuestionNumber(1);

        } catch (error) {
            console.error(error);
            alert("Failed to start interview");
        }
    };

    const recognitionRef = useRef(null);
    const isNativeRef = useRef(false);

    const startVoiceInput = async () => {
        try {
            const platform = Capacitor.getPlatform();

            console.log("CareerPilot platform:", platform);

            // =====================================================
            // 📱 ANDROID APP
            // =====================================================
            if (platform !== "web") {

                isNativeRef.current = true;

                let permission =
                    await SpeechRecognition.checkPermissions();

                if (
                    permission.speechRecognition !== "granted"
                ) {
                    permission =
                        await SpeechRecognition.requestPermissions();
                }

                if (
                    permission.speechRecognition !== "granted"
                ) {
                    alert("Microphone permission is required.");
                    return;
                }

                const available =
                    await SpeechRecognition.available();

                if (!available.available) {
                    alert(
                        "Speech recognition is not available on this device."
                    );
                    return;
                }

                setIsListening(true);

                await SpeechRecognition.removeAllListeners();

                await SpeechRecognition.addListener(
                    "partialResults",
                    (data) => {

                        if (
                            data.matches &&
                            data.matches.length > 0
                        ) {
                            setAnswer(data.matches[0]);
                        }
                    }
                );

                await SpeechRecognition.addListener(
                    "listeningState",
                    (data) => {
                        setIsListening(
                            data.status === "started"
                        );
                    }
                );

                await SpeechRecognition.start({
                    language: "en-US",
                    maxResults: 1,
                    partialResults: true,
                    popup: false,
                });

                return;
            }


            // =====================================================
            // 💻 LAPTOP / WEB
            // =====================================================

            isNativeRef.current = false;

            const BrowserSpeechRecognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;

            if (!BrowserSpeechRecognition) {

                alert(
                    "Speech recognition is not supported in this browser. Please use Google Chrome."
                );

                return;
            }


            // Stop previous recognition
            if (recognitionRef.current) {

                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    console.log("Previous recognition stopped.");
                }

                recognitionRef.current = null;
            }


            const recognition =
                new BrowserSpeechRecognition();

            recognitionRef.current = recognition;

            recognition.lang = "en-US";

            // One speech session = one answer
            recognition.continuous = false;

            // Only final result
            recognition.interimResults = false;

            // Best result only
            recognition.maxAlternatives = 1;


            recognition.onstart = () => {

                console.log(
                    "🎤 CareerPilot web microphone started"
                );

                setIsListening(true);
            };


            recognition.onresult = (event) => {

                console.log(
                    "🎤 CareerPilot speech result:",
                    event.results
                );

                if (
                    event.results &&
                    event.results.length > 0
                ) {

                    const transcript =
                        event.results[0][0].transcript;

                    console.log(
                        "Recognized:",
                        transcript
                    );

                    setAnswer(
                        transcript.trim()
                    );
                }
            };


            recognition.onerror = (event) => {

                console.error(
                    "❌ CareerPilot web speech error:",
                    event.error
                );

                setIsListening(false);

                if (event.error === "not-allowed") {

                    alert(
                        "Chrome microphone permission was denied."
                    );

                } else if (event.error === "no-speech") {

                    console.log("No speech detected.");

                } else if (event.error === "audio-capture") {

                    alert(
                        "Chrome could not access your microphone."
                    );

                } else if (event.error === "network") {

                    alert(
                        "Speech recognition network error. Please check your internet connection."
                    );

                } else {

                    alert(
                        "Voice recognition error: " +
                        event.error
                    );
                }
            };


            recognition.onend = () => {

                console.log(
                    "🎤 CareerPilot web microphone stopped"
                );

                setIsListening(false);

                recognitionRef.current = null;
            };


            console.log(
                "Starting Chrome speech recognition..."
            );

            recognition.start();

        } catch (error) {

            console.error(
                "❌ CareerPilot voice error:",
                error
            );

            setIsListening(false);

            alert(
                "Unable to start voice recognition.\n\n" +
                (error?.message || error)
            );
        }
    };


    const stopVoiceInput = async () => {

        try {

            if (isNativeRef.current) {

                // 📱 Android
                await SpeechRecognition.stop();

            } else {

                // 💻 Laptop / Browser
                if (recognitionRef.current) {

                    recognitionRef.current.stop();

                    recognitionRef.current = null;
                }
            }

        } catch (error) {

            console.error(
                "Error stopping voice recognition:",
                error
            );

        } finally {

            setIsListening(false);
        }
    };

    const submitAnswer = async () => {

        if (!answer.trim()) {
            alert("Please write your answer first.");
            return;
        }

        try {
            setEvaluating(true);
            const token = localStorage.getItem("token");

            const response = await API.post(
                "/interview/answer",
                {
                    role: role,
                    question: question,
                    answer: answer
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEvaluation(response.data.evaluation);

            setQuestion(response.data.next_question);

            setAnswer("");

            setQuestionNumber(prev => prev + 1);

        } catch (error) {
            console.error(error);
            alert("Failed to evaluate answer");
        } finally {
            setEvaluating(false);
        }
    };

    return (
        <>
            <AnimatedBackground />

            <div className="interview-page">
                <button 
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    title="Go Back"
                >
                    <FiArrowLeft />
                </button>

                <motion.div
                    className="interview-header"
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                >
                    <div className="interview-header-icon">
                        <FiMic />
                    </div>

                    <div>
                        <p className="interview-eyebrow">
                            AI INTERVIEW PRACTICE
                        </p>
                        <h1>
                            Mock Interview
                        </h1>
                        <p>
                            Practice real interview questions and 
                            get instant AI-powered feedback.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="interview-section"
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.1 }}
                >
                    <div className="section-heading">
                        <FiBriefcase />
                        <div>
                            <h2>
                                Choose Your Role
                            </h2>
                            <p>
                                Select the role you want to practice for.
                            </p>
                        </div>
                    </div>

                    <div className="role-grid">
                        {roles.map((item) => (
                            <button key={item} className={`role-card ${role === item ? "selected" : ""}`}
                                onClick={() => {
                                    setRole(item);
                                    setQuestion("");
                                    setAnswer("");
                                    setEvaluation("");
                                }}
                            >
                                <FiBriefcase />
                                <span>
                                    {item}
                                </span>
                            </button>
                        ))}
                    </div>

                    <button  
                        className="start-interview-btn"
                        onClick={startInterview}
                        disabled={!role || loading}
                    >
                        {loading ? (
                            "Starting Interview..."
                        ) : (
                            <>
                                <FiPlay />
                                Start Interview
                            </>
                        )}
                    </button>
                </motion.div>

                {question && (
                    <motion.div
                        className="interview-question-card"
                        initial={{ opacity:0, y:25 }}
                        animate={{ opacity:1, y:0 }}
                    >
                        <div className="question-heading">
                            <div className="question-icon">
                                <FiMessageSquare />
                            </div>
                            <div>
                                <span>
                                    INTERVIEW QUESTION
                                </span>
                                <h2>
                                    {role}
                                </h2>
                            </div>
                        </div>

                        <div className="question-box">
                            <p>
                                {question}
                            </p>
                        </div>

                        <div className="answer-section">
                            <label>
                                Your Answer
                            </label>

                            <div className="answer-input-wrapper">

                                <textarea
                                    placeholder={
                                        isListening
                                            ? "Listening... Speak your answer."
                                            : "Write your answer or use the microphone..."
                                    }
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />

                                {speechSupported && (
                                    <button
                                        type="button"
                                        className={`voice-input-btn ${
                                            isListening ? "listening" : ""
                                        }`}
                                        onClick={() => {

                                            if (isListening) {

                                                stopVoiceInput();

                                            } else {

                                                startVoiceInput();

                                            }

                                        }}
                                        title={
                                            isListening
                                                ? "Listening..."
                                                : "Speak your answer"
                                        }
                                    >
                                        <FiMic />

                                        {isListening ? (
                                            <span>Listening...</span>
                                        ) : (
                                            <span>Speak</span>
                                        )}
                                    </button>
                                )}

                            </div>

                            <button
                                className="submit-answer-btn"
                                onClick={submitAnswer}
                                disabled={evaluating}
                            >
                                {evaluating ? (
                                    "Evaluating..."
                                ) : (
                                    <>
                                        <FiSend />
                                        Submit Answer
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {evaluation && (

                    <motion.div
                        className="feedback-card"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                    >

                        <div className="feedback-heading">

                            <FiCheckCircle />

                            <div>

                                <span>
                                    AI POWERED FEEDBACK
                                </span>

                                <h2>
                                    Interview Evaluation
                                </h2>

                            </div>

                        </div>


                        <div className="feedback-content">

                            {evaluation}

                        </div>

                    </motion.div>

                )}

            </div>
        </>
    );
}

export default Interview;
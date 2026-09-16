import { FiArrowLeft, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/Dashboard.css";

function PrivacyPolicy() {

    const navigate = useNavigate();

    return (
        <div className="privacy-page">

            <AnimatedBackground />

            <div className="privacy-container">

                <button
                    className="privacy-back-btn"
                    onClick={() => navigate(-1)}
                >
                    <FiArrowLeft />
                    Back
                </button>

                <div className="privacy-header">

                    <div className="privacy-icon">
                        <FiShield />
                    </div>

                    <div>
                        <h1>Privacy Policy</h1>
                        <p>CareerPilot AI</p>
                    </div>

                </div>

                <p className="privacy-updated">
                    Last Updated: September 2026
                </p>

                <section>
                    <h2>1. Introduction</h2>

                    <p>
                        CareerPilot AI ("CareerPilot", "we", "our", or "us")
                        is an AI-powered career guidance platform designed to
                        help users analyze resumes, create personalized career
                        roadmaps, practice interviews, and receive career
                        recommendations.
                    </p>

                    <p>
                        This Privacy Policy explains what information we
                        collect, how we use it, how it may be processed by
                        third-party services, and the choices available to
                        you.
                    </p>
                </section>

                <section>
                    <h2>2. Information We Collect</h2>

                    <p>
                        When you create and use a CareerPilot account, we may
                        collect the following information:
                    </p>

                    <ul>
                        <li>Name</li>
                        <li>Email address</li>
                        <li>College or institution</li>
                        <li>Academic branch or field</li>
                        <li>Graduation year</li>
                        <li>Skills</li>
                        <li>Career goals</li>
                        <li>Uploaded resumes</li>
                        <li>Resume content extracted for analysis</li>
                        <li>Career roadmap information</li>
                        <li>Interview questions and answers</li>
                        <li>Information provided through speech recognition features</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Information</h2>

                    <p>
                        We use collected information to provide and improve
                        CareerPilot's services, including:
                    </p>

                    <ul>
                        <li>Creating and managing your account</li>
                        <li>Authenticating users</li>
                        <li>Analyzing uploaded resumes</li>
                        <li>Generating resume scores and career progress</li>
                        <li>Identifying relevant skills and skill gaps</li>
                        <li>Generating personalized career roadmaps</li>
                        <li>Providing job-role recommendations</li>
                        <li>Generating mock interview questions</li>
                        <li>Evaluating interview answers</li>
                        <li>Sending application notifications and reminders</li>
                        <li>Providing password-reset functionality</li>
                        <li>Maintaining and improving the application</li>
                    </ul>
                </section>

                <section>
                    <h2>4. AI Processing</h2>

                    <p>
                        CareerPilot uses artificial intelligence to provide
                        several of its features.
                    </p>

                    <p>
                        Resume content may be processed by our AI service
                        provider, Groq, to generate resume analysis,
                        career-progress assessments, skill-gap information,
                        job recommendations, and learning roadmaps.
                    </p>

                    <p>
                        Information related to your selected career goal,
                        skills, interview questions, and interview answers
                        may also be processed by the AI service to provide
                        personalized career guidance and interview evaluation.
                    </p>

                    <p>
                        AI-generated information is intended to provide
                        guidance and should not be considered a guarantee of
                        employment, salary, admission, certification, or
                        career outcomes.
                    </p>
                </section>

                <section>
                    <h2>5. Third-Party Services</h2>

                    <p>
                        CareerPilot uses third-party services to operate
                        certain parts of the application. These services may
                        process information necessary to provide their
                        respective functionality.
                    </p>

                    <ul>
                        <li>
                            <strong>Groq</strong> — AI processing for career
                            and resume-related features.
                        </li>

                        <li>
                            <strong>Render</strong> — backend application
                            hosting.
                        </li>

                        <li>
                            <strong>Vercel</strong> — frontend application
                            hosting.
                        </li>

                        <li>
                            <strong>Google Play services</strong> — distribution
                            of the Android application.
                        </li>
                    </ul>

                    <p>
                        Third-party services may have their own privacy
                        policies and terms governing their processing of
                        information.
                    </p>
                </section>

                <section>
                    <h2>6. Account Security</h2>

                    <p>
                        CareerPilot uses authentication mechanisms and
                        password hashing to help protect user accounts.
                        Authentication tokens are used to provide access to
                        protected features.
                    </p>

                    <p>
                        While we take reasonable measures to protect your
                        information, no method of electronic transmission or
                        storage can be guaranteed to be completely secure.
                    </p>
                </section>

                <section>
                    <h2>7. Resume Privacy</h2>

                    <p>
                        Resumes uploaded to CareerPilot may contain personal,
                        academic, professional, and contact information.
                    </p>

                    <p>
                        Users should only upload resumes and documents that
                        they have the right to provide for processing.
                    </p>

                    <p>
                        Resume information is used to provide CareerPilot's
                        resume analysis and career-related features.
                    </p>
                </section>

                <section>
                    <h2>8. Notifications</h2>

                    <p>
                        CareerPilot may request permission to send browser or
                        Android notifications. These notifications may be used
                        for career reminders, roadmap reminders, or other
                        application-related notifications.
                    </p>

                    <p>
                        You can control notification permissions through your
                        browser or Android device settings.
                    </p>
                </section>

                <section>
                    <h2>9. Account Deletion</h2>

                    <p>
                        You can request deletion of your CareerPilot account
                        and associated application data through the account
                        deletion functionality provided within the
                        application.
                    </p>

                    <p>
                        When an account deletion request is completed,
                        associated account records, resumes, roadmap data,
                        roadmap progress data, and other associated application
                        data are deleted where applicable.
                    </p>
                </section>

                <section>
                    <h2>10. Data Retention</h2>

                    <p>
                        We retain information for as long as necessary to
                        provide CareerPilot's services and maintain your
                        account, unless a longer retention period is required
                        or permitted by applicable law.
                    </p>

                    <p>
                        When you delete your account, we delete associated
                        application data according to our account-deletion
                        process, subject to any information that may need to
                        be retained for legitimate legal or security purposes.
                    </p>
                </section>

                <section>
                    <h2>11. Your Choices</h2>

                    <p>
                        Depending on the functionality available to you, you
                        may:
                    </p>

                    <ul>
                        <li>Update your profile information</li>
                        <li>Delete uploaded resumes</li>
                        <li>Change your password</li>
                        <li>Control notification permissions</li>
                        <li>Delete your CareerPilot account</li>
                    </ul>
                </section>

                <section>
                    <h2>12. Children's Privacy</h2>

                    <p>
                        CareerPilot is intended for users who are legally
                        permitted to use the service under applicable laws.
                        We do not knowingly collect personal information from
                        children where such collection is prohibited by law.
                    </p>
                </section>

                <section>
                    <h2>13. Changes to This Privacy Policy</h2>

                    <p>
                        We may update this Privacy Policy from time to time to
                        reflect changes to CareerPilot's features, services,
                        legal requirements, or data practices.
                    </p>

                    <p>
                        When changes are made, the "Last Updated" date at the
                        beginning of this policy will be updated.
                    </p>
                </section>

                <section>
                    <h2>14. Contact Us</h2>

                    <p>
                        If you have questions, concerns, or requests regarding
                        this Privacy Policy or your personal information,
                        contact us at:
                    </p>

                    <p className="privacy-email">
                        carreerpilot.ai@gmail.com
                    </p>
                </section>

                <footer>
                    © 2026 CareerPilot AI. All rights reserved.
                </footer>

            </div>

        </div>
    );
}

export default PrivacyPolicy;
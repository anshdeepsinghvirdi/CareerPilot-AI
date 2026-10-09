import { useEffect, useState } from "react";
import API from "../services/api";
import { FiUser, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";
import toast, { Toaster } from "react-hot-toast";

function Profile() {

    const navigate = useNavigate();
    const { t } = useLanguage();
    const th = t.profile;

    const [profile, setProfile] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);


    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get("/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProfile(response.data);

        } catch (error) {

            console.log(error);

            alert(th.loadError);
        }
    };


    const saveProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            await API.put(
                "/profile/update",
                {
                    college: profile.college,
                    branch: profile.branch,
                    graduation_year: profile.graduation_year,
                    skills: profile.skills,
                    career_goal: profile.career_goal,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(
                th.saved
            );

        } catch (error) {

            console.log(error);

            toast.error(
                th.updateError
            );
        }
    };


    // =====================================================
    // DELETE ACCOUNT
    // =====================================================

    const deleteAccount = async () => {

        try {

            setDeletingAccount(true);

            const token =
                localStorage.getItem("token");

            await API.delete(
                "/profile/delete-account",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            // Remove authentication
            localStorage.removeItem("token");

            // Optional cleanup if your app stores user data
            localStorage.removeItem("user");

            toast.success(
                th.deleted
            );

            // Give toast a moment to display
            setTimeout(() => {

                navigate("/login");

            }, 1000);

        } catch (error) {

            console.error(
                th.deletionError,
                error
            );

            toast.error(
                error?.response?.data?.detail ||
                th.deleteError
            );

            setDeletingAccount(false);
            setShowDeleteConfirm(false);
        }
    };


    return (
        <>
            <AnimatedBackground />

            <Toaster position="top-right" />

            <div className="profile-page">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    title={th.goBack}
                >
                    <FiArrowLeft />
                </button>


                <div className="profile-header">

                    <div className="profile-header-icon">
                        <FiUser />
                    </div>

                    <div>

                        <p className="profile-eyebrow">
                            {th.eyebrow}
                        </p>

                        <h1>
                            {th.title}
                        </h1>

                        <p>
                            {th.subtitle}
                        </p>

                    </div>

                </div>


                <div className="profile-card">

                    <h2>
                        {th.information}
                    </h2>


                    <div className="profile-field">

                        <label>
                            {th.name}
                        </label>

                        <p>
                            {profile.name}
                        </p>

                    </div>


                    <div className="profile-field">

                        <label>
                            {th.email}
                        </label>

                        <p>
                            {profile.email}
                        </p>

                    </div>


                    <div className="profile-field">

                        <label>
                            {th.college}
                        </label>

                        <input
                            type="text"
                            value={profile.college || ""}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    college: e.target.value,
                                })
                            }
                        />

                    </div>


                    <div className="profile-field">

                        <label>
                            {th.branch}
                        </label>

                        <input
                            type="text"
                            value={profile.branch || ""}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    branch: e.target.value,
                                })
                            }
                        />

                    </div>


                    <div className="profile-field">

                        <label>
                            {th.graduationYear}
                        </label>

                        <input
                            type="number"
                            value={
                                profile.graduation_year || ""
                            }
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    graduation_year:
                                        e.target.value,
                                })
                            }
                        />

                    </div>


                    <div className="profile-field">

                        <label>
                            {th.skills}
                        </label>

                        <input
                            type="text"
                            value={profile.skills || ""}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    skills: e.target.value,
                                })
                            }
                        />

                    </div>


                    <div className="profile-field">

                        <label>
                            {th.careerGoal}
                        </label>

                        <input
                            type="text"
                            value={
                                profile.career_goal || ""
                            }
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    career_goal:
                                        e.target.value,
                                })
                            }
                        />

                    </div>


                    <button
                        className="profile-save-btn"
                        onClick={saveProfile}
                    >
                        {th.save}
                    </button>

                </div>


                {/* =====================================================
                    DANGER ZONE
                ===================================================== */}

                <div className="delete-account-card">

                    <div className="delete-account-header">

                        <div className="delete-account-icon">
                            <FiAlertTriangle />
                        </div>

                        <div>

                            <h2>
                                {th.dangerZone}
                            </h2>

                            <p>
                                {th.deleteDescription}
                            </p>

                        </div>

                    </div>


                    <div className="delete-account-content">

                        <p>
                            {th.deletedetails}   
                        </p>

                        <p className="delete-warning">
                            {th.cannotUndo}
                        </p>


                        <button
                            className="delete-account-btn"
                            onClick={() =>
                                setShowDeleteConfirm(true)
                            }
                            disabled={deletingAccount}
                        >
                            <FiTrash2 />

                            {th.deleteAccount}
                        </button>

                    </div>

                </div>


                {/* =====================================================
                    DELETE CONFIRMATION MODAL
                ===================================================== */}

                {showDeleteConfirm && (

                    <div className="delete-modal-overlay">

                        <div className="delete-modal">

                            <div className="delete-modal-icon">
                                <FiAlertTriangle />
                            </div>

                            <h2>
                                {th.confirmtitle}
                            </h2>

                            <p>
                                {th.confirmDescription}
                            </p>

                            <p>
                                {th.confirmDetails}
                            </p>

                            <strong>
                                {th.cannotUndo}
                            </strong>


                            <div className="delete-modal-actions">

                                <button
                                    className="delete-cancel-btn"
                                    onClick={() =>
                                        setShowDeleteConfirm(false)
                                    }
                                    disabled={deletingAccount}
                                >
                                    {th.cancel}
                                </button>


                                <button
                                    className="delete-confirm-btn"
                                    onClick={deleteAccount}
                                    disabled={deletingAccount}
                                >
                                    <FiTrash2 />

                                    {deletingAccount
                                        ? th.deleting
                                        : th.deletePermanently}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>
        </>
    );
}

export default Profile;
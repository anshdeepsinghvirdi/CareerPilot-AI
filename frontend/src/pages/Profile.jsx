import { useEffect, useState } from "react";
import API from "../services/api";
import { FiUser } from "react-icons/fi";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});

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
            alert("Failed to load profile");
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

            toast.success("Profile Updated Successfully!");

        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");
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
                    title="Go Back"
                >
                    <FiArrowLeft />
                </button>

                <div className="profile-header">
                    <div className="profile-header-icon">
                        <FiUser />
                    </div>

                    <div>
                        <p className="profile-eyebrow">
                            PERSONAL INFORMATION
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your personal information and career preferences.
                        </p>
                    </div>
                </div>

                <div className="profile-card">

                    <h2>Profile Information</h2>

                    <div className="profile-field">
                        <label>Name</label>
                        <p>{profile.name}</p>
                    </div>

                    <div className="profile-field">
                        <label>Email</label>
                        <p>{profile.email}</p>
                    </div>

                    <div className="profile-field">
                        <label>College</label>
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
                        <label>Branch</label>
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
                        <label>Graduation Year</label>
                        <input
                            type="number"
                            value={profile.graduation_year || ""}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    graduation_year: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="profile-field">
                        <label>Skills</label>
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
                        <label>Career Goal</label>
                        <input
                            type="text"
                            value={profile.career_goal || ""}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    career_goal: e.target.value,
                                })
                            }
                        />
                    </div>

                    <button
                        className="profile-save-btn"
                        onClick={saveProfile}
                    >
                        Save Profile
                    </button>

                </div>

            </div>
        </>
    );
}

export default Profile;
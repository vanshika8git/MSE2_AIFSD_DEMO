import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [course, setCourse] = useState("");
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/profile");

                console.log("FULL RESPONSE:", res);

                console.log("PROFILE DATA:", res.data); // 🔍 DEBUG

                setUser(res.data);
            } catch (err) {
                console.log("Profile error:", err);
            }
        };

        fetchUser();
    }, []);
    const updatePassword = async () => {
        try {
            await API.put("/update-password", passwordData);

            alert("Password updated");

            // ✅ CLEAR INPUTS
            setPasswordData({
                oldPassword: "",
                newPassword: "",
            });

        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    const updateCourse = async () => {
        try {
            // 1️⃣ Update course
            const res = await API.put("/update-course", { course });

            alert(res.data?.message || "Course updated");

            // 2️⃣ Clear input FIRST (important)
            setCourse("");

            // 3️⃣ Try to refresh user (optional, safe)
            try {
                const profile = await API.get("/profile");
                setUser(profile.data);
            } catch (err) {
                console.log("Profile fetch failed, but update worked");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="dashboard">
            <Navbar />

            <div className="dashboard-content">
                <div className="card">
                    <h3>Student Info</h3>

                    {user && user.name ? (
                        <>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Course: {user.course}</p>
                        </>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>

                <div className="card">
                    <h3>Update Password</h3>
                    <input
                        value={passwordData.oldPassword}
                        placeholder="Old Password"
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                    />

                    <input
                        value={passwordData.newPassword}
                        placeholder="New Password"
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                    />
                    <button onClick={updatePassword}>Update</button>
                </div>

                <div className="card">
                    <h3>Change Course</h3>
                    <input
                        value={course}
                        placeholder="New Course"
                        onChange={(e) => setCourse(e.target.value)}
                    />
                    <button onClick={updateCourse}>Update</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
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

                setUser(res.data);

            } catch (err) {
                alert(err.response?.data?.message || "Unauthorized access");
                localStorage.removeItem("token");
            }
        };

        fetchUser();
    }, []);

    // ================= PASSWORD UPDATE =================
    const updatePassword = async () => {
        try {
            const res = await API.put("/update-password", passwordData);

            alert(res.data.message);

            setPasswordData({
                oldPassword: "",
                newPassword: "",
            });

        } catch (err) {
            alert(err.response?.data?.message || "Password update failed");
        }
    };

    // ================= COURSE UPDATE =================
    const updateCourse = async () => {
        try {
            const res = await API.put("/update-course", { course });

            alert(res.data.message);

            setCourse("");

            const profile = await API.get("/profile");
            setUser(profile.data);

        } catch (err) {
            alert(err.response?.data?.message || "Course update failed");
        }
    };

    return (
        <div className="dashboard">
            <Navbar />

            <div className="dashboard-content">

                <div className="card">
                    <h3>Student Info</h3>

                    {user ? (
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
                            setPasswordData({
                                ...passwordData,
                                oldPassword: e.target.value,
                            })
                        }
                    />

                    <input
                        value={passwordData.newPassword}
                        placeholder="New Password"
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                            })
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
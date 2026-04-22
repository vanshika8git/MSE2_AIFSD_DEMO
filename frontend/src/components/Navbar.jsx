import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [dark, setDark] = useState(false);

    // Load saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            setDark(true);
        }
    }, []);

    // Toggle theme
    const toggleDark = () => {
        if (dark) {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setDark(!dark);
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="navbar">
            <h1 className="logo">Student Portal</h1>

            <div className="nav-actions">
                <button className="theme-btn" onClick={toggleDark}>
                    {dark ? "☀ Light" : "🌙 Dark"}
                </button>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
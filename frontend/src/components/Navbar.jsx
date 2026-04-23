import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="navbar new-navbar">
            <div></div>

            <h2 className="nav-title">Grievance System</h2>

            <button className="logout-btn" onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default Navbar;
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/register", form);
        navigate("/login");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <input placeholder="Course" onChange={(e) => setForm({ ...form, course: e.target.value })} />

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
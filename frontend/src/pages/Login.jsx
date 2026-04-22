import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await API.post("/login", form);
        localStorage.setItem("token", res.data.token);

        navigate("/dashboard");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
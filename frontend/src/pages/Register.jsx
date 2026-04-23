import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/register", form);
            alert("Registered Successfully");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button>Register</button>
            </form>
            <p onClick={() => navigate("/login")}>Already have account? Login</p>
        </div>
    );
}

export default Register;
import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
    });

    const [grievances, setGrievances] = useState([]);
    const [search, setSearch] = useState("");

    // ✅ Fetch all grievances
    const fetchGrievances = async () => {
        const res = await API.get("/grievances");
        setGrievances(res.data);
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    // ✅ Add grievance
    const handleSubmit = async () => {
        await API.post("/grievances", {
            ...form,
            status: "Pending",
            date: new Date(),
        });

        setForm({ title: "", description: "", category: "" });
        fetchGrievances();
    };

    // ✅ Delete
    const handleDelete = async (id) => {
        await API.delete(`/grievances/${id}`);
        fetchGrievances();
    };

    // ✅ Resolve grievance (Update status to Resolved)
    const handleResolve = async (id) => {
        await API.put(`/grievances/${id}`, { status: "Resolved" });
        fetchGrievances();
    };

    // ✅ Search
    const handleSearch = async () => {
        const res = await API.get(`/grievances/search?title=${search}`);
        setGrievances(res.data);
    };

    return (
        <div className="dashboard-bg">
            <Navbar />

            <div className="dashboard-container">

                {/* ===== FORM ===== */}
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    <option value="">Select Category</option>
                    <option>Academic</option>
                    <option>Hostel</option>
                    <option>Transport</option>
                    <option>Other</option>
                </select>

                <button className="black-btn" onClick={handleSubmit}>
                    Add Grievance
                </button>

                {/* ===== SEARCH ===== */}
                <input
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="black-btn" onClick={handleSearch}>
                    Search
                </button>

                <button className="black-btn" onClick={fetchGrievances}>
                    Show All
                </button>

                {/* ===== CARDS ===== */}
                {grievances.map((g) => (
                    <div key={g._id} className="card white-card">
                        <h3>{g.title}</h3>
                        <p>{g.description}</p>
                        <p><b>{g.category}</b></p>
                        <p>Status: {g.status}</p>
                        <p>Date: {new Date(g.date).toLocaleString()}</p>

                        <button
                            className="green-btn"
                            onClick={() => handleResolve(g._id)}
                        >
                            Resolve
                        </button>

                        <button
                            className="red-btn"
                            style={{ marginLeft: "5px" }}
                            onClick={() => handleDelete(g._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
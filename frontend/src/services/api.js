import axios from "axios";

const API = axios.create({
    baseURL: "https://mse2-aifsd-demo.onrender.com/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;

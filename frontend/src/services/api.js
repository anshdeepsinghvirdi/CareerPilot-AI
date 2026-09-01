import axios from "axios";

const API = axios.create({
    baseURL: "https://careerpilot-ai-4ohg.onrender.com",
});

export default API;
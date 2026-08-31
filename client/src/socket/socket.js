import { io } from "socket.io-client";

const socket = io(
    import.meta.env.VITE_API_URL || "https://localconnect-api-21lm.onrender.com",
    {
        withCredentials: true,
        autoConnect: false,
    }
);

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
});

export default socket;
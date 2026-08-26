import { io } from "socket.io-client";

const socket = io(
    import.meta.env.VITE_API_URL || "http://localhost:5000",
    {
        withCredentials: true,
    }
);

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
});

export default socket;
require("dotenv").config();

//WebSocket.io things 
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// models 
const Application = require("./models/Application");
const Project = require("./models/Project");
const Message = require("./models/Message");

//routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");

//middlewares
const authMiddleware = require("./middlewares/authMiddleware");
const roleMiddleware = require("./middlewares/roleMiddleware");

const express = require("express");
const connectDB = require("./config/db");
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//creating a http server so the webSocket.io can use it
const server = http.createServer(app);

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.use((socket, next) => {
  try {

    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Authentication required"));
    }

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map(cookie => {
        const [name, ...value] = cookie.split("=");
        return [name, value.join("=")];
      })
    );

    const token = cookies.accessToken;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = decoded;

    next();

  } catch (error) {

    console.error("Socket authentication error:", error);

    next(new Error("Invalid authentication"));

  }

});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinChat", async (applicationId) => {
    try {

      const application = await Application.findById(applicationId);

      if (!application) {
        return socket.emit("chatError", {
          message: "Application not found",
        });
      }

      if (application.status !== "Accepted") {
        return socket.emit("chatError", {
          message: "Chat is only available for accepted applications",
        });
      }

      const project = await Project.findById(application.projectId);

      if (!project) {
        return socket.emit("chatError", {
          message: "Project not found",
        });
      }

      const userId = socket.user.id;

      const isStudent =
        application.studentId.toString() === userId.toString();

      const isBusinessOwner =
        project.businessOwnerId.toString() === userId.toString();

      if (!isStudent && !isBusinessOwner) {
        return socket.emit("chatError", {
          message: "You are not authorized to join this chat",
        });
      }

      const roomId = `application_${applicationId}`;

      socket.join(roomId);

      console.log(
        `User ${userId} joined room ${roomId}`
      );

      socket.emit("chatJoined", {
        roomId,
        applicationId,
      });
    } catch (error) {

      console.error("Join chat error:", error);

      socket.emit("chatError", {
        message: "Unable to join chat",
      });

    }
  });


  socket.on("sendMessage", async (data) => {
    try {
      const { applicationId, message } = data;

      if (!message || !message.trim()) {
        return;
      }

      // Find application
      const application = await Application.findById(applicationId);

      if (!application) {
        return socket.emit("chatError", {
          message: "Application not found",
        });
      }

      // Application must be accepted
      if (application.status !== "Accepted") {
        return socket.emit("chatError", {
          message: "Chat is not available for this application",
        });
      }

      const project = await Project.findById(application.projectId);

      if (!project) {
        return socket.emit("chatError", {
          message: "Project not found",
        });
      }

      // Check whether user belongs to this application
      const isStudent =
        application.studentId.toString() === socket.user.id.toString();

      const isBusinessOwner =
        project.businessOwnerId.toString() === socket.user.id.toString();

      if (!isStudent && !isBusinessOwner) {
        return socket.emit("chatError", {
          message: "You are not part of this chat",
        });
      }

      // Save message
      const newMessage = await Message.create({
        applicationId,
        senderId: socket.user.id,
        message: message.trim(),
      });

      // Socket.IO room
      const roomId = `application_${applicationId}`;

      // Send saved message to room
      io.to(roomId).emit("newMessage", {
        _id: newMessage._id,
        applicationId: newMessage.applicationId,
        senderId: newMessage.senderId,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      });

    } catch (error) {
      console.error("Send message error:", error);

      socket.emit("chatError", {
        message: "Failed to send message",
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


//test-route
app.get("/", (req, res) => {
  console.log("PORT", process.env.PORT);
  res.send("Hello World");
});


app.use("/api/admin", adminRoutes);

//protected-routes
app.get(
  "/api/protected",
  authMiddleware,
  roleMiddleware("student"),
  (req, res) => {
    res.json({ message: "This is a protected route" });
  },
);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/reports", reportRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

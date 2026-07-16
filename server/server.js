require("dotenv").config();

//routes
const authRoutes = require("./routes/authRoutes");

//middlewares
const authMiddleware = require("./middlewares/authMiddleware");
const roleMiddleware = require("./middlewares/roleMiddleware")


const express = require("express");
const connectDB = require("./config/db");
connectDB();

const app = express();
const PORT = process.env.PORT;

const cors = require("cors");

app.use(cors());
app.use(express.json());

//test-route
app.get("/", (req, res) => {
  console.log("PORT", process.env.PORT);
  res.send("Hello World");
});

//protected-routes
app.get("/api/protected",authMiddleware,roleMiddleware("student"), (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.use("/api/auth",authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

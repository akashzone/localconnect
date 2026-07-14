require("dotenv").config();

// import
const authRoutes = require("./routes/authRoutes");

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

app.use("/api/auth",authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

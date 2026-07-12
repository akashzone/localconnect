require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

//test-route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

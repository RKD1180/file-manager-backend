const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv/config");
const { db } = require("./config/dbConfig.js");
const { verifyToken } = require("./middleware/authMiddleWare.js");
const authRoutes = require("./routes/auth.js");
const fileRoutes = require("./routes/file.js");
const dbConnection = mongoose.connection;

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000","https://file-manager-frontend.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
// Increase the limit for JSON payload
app.use(express.json({ limit: '10mb' })); // You can adjust the limit as needed

// Increase the limit for URL-encoded payload
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to the MongoDB database
db();

app.use("/auth", authRoutes);
app.use("/file", verifyToken, fileRoutes);

app.use("/", (req, res) => {
  res.json({ message: "Backend Working" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
// Listen for the success event
dbConnection.once("open", () => {
  console.log("Connected to MongoDB");
});

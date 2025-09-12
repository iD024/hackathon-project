const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const connectDB = require("./config/db"); // Assuming you have this file

// routes
const issueRoutes = require("../server/routes/IssueRoutes");
// --- ADD THIS LINE ---
const userRoutes = require("../server/routes/userRoutes"); // Import user routes

// loads env
dotenv.config();

// connect to database
// connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routers
app.use("/api/v1/issues", issueRoutes);
// --- AND ADD THIS LINE ---
app.use("/api/v1/users", userRoutes); // Mount user routes

// cors
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Civic Sprint API is running!" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

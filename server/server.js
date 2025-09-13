const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // Add path module
const connectDB = require("../server/config/db");

// routes
const issueRoutes = require("../server/routes/IssueRoutes");
const userRoutes = require("../server/routes/userRoutes");
const teamRoutes = require("../server/routes/teamRoutes");
const notificationRoutes = require("../server/routes/notificationRoutes");
const businessRoutes = require("../server/routes/businessRoutes");

// loads env
dotenv.config();

// connect to database
connectDB();

const app = express();

// middlewares
app.use(cors()); // It's good practice to have CORS at the top
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORRECTED: Serve static files from the 'uploads' directory
// This allows image URLs like http://localhost:5000/uploads/filename.png to work
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// router
app.use("/api/v1/issues", issueRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/businesses", businessRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Civic Sprint API is running!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

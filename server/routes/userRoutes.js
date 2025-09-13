const express = require("express");
const router = express.Router();
// Import both registerUser and the new loginUser function
const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");

// Defines the endpoint for user registration
router.post("/register", registerUser);

// Defines the endpoint for user login
router.post("/login", loginUser);

router.get("/", getUsers);

module.exports = router;

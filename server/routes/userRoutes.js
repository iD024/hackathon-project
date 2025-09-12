const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");

// Defines the endpoint for user registration
router.post("/register", registerUser);

module.exports = router;

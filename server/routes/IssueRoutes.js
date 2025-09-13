const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
} = require("../controllers/IssueController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middleware/upload"); // Import multer middleware

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);
router.route("/resolved").get(getResolvedIssues);

// Apply multer middleware for file uploads on the POST route
router.route("/").get(getIssues).post(upload.array("images", 3), reportIssue); // Allow up to 3 images

module.exports = router;

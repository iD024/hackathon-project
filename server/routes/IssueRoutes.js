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

// The POST route now uses upload.array() to accept up to 5 images
router.route("/").get(getIssues).post(upload.array("images", 5), reportIssue); // Allow up to 5 images

module.exports = router;

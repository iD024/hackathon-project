const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
} = require("../controllers/IssueController");
const { protect, optionalProtect } = require("../middlewares/authMiddleware");
const upload = require("../middleware/upload"); // Import multer middleware

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);
router.route("/resolved").get(getResolvedIssues);

// CORRECTED: Re-add the multer middleware to handle file uploads.
// Use optionalProtect to allow submissions from both guests and logged-in users.
router
  .route("/")
  .get(getIssues)
  .post(optionalProtect, upload.array("images", 5), reportIssue);

module.exports = router;

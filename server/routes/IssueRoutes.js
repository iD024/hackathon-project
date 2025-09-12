const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
} = require("../controllers/IssueController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);

// --- THIS IS THE CRITICAL FIX ---
// Add the 'protect' middleware back to the POST route.
router.route("/").get(getIssues).post(protect, reportIssue);

module.exports = router;

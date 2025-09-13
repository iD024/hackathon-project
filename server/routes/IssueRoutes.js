const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
} = require("../controllers/IssueController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);
router.route("/resolved").get(getResolvedIssues);

// --- THIS IS THE CRITICAL FIX ---
// Add the 'protect' middleware back to the POST route.
router.route("/").get(getIssues).post(protect, reportIssue);

module.exports = router;

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

// Issue creation (no file upload middleware needed - files uploaded to Firebase by frontend)
router.route("/").get(getIssues).post(reportIssue);

module.exports = router;

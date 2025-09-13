const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
} = require("../controllers/IssueController");
// Import both protect and optionalProtect middlewares
const { protect, optionalProtect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);
router.route("/resolved").get(getResolvedIssues);

// CORRECTED: The POST route now uses optionalProtect to handle both authenticated
// and anonymous users. It no longer uses any file upload middleware.
router.route("/").get(getIssues).post(optionalProtect, reportIssue);

module.exports = router;

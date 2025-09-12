const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
} = require("../controllers/IssueController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);

// Chain the .get() and .post() methods for the same route '/'
// The 'protect' middleware is now applied to the POST route.
router.route("/").get(getIssues).post(protect, reportIssue);

module.exports = router;

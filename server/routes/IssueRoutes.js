const express = require("express");
const { reportIssue, getIssues } = require("../controllers/IssueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Chain the .get() and .post() methods for the same route '/'
// The 'protect' middleware is now applied to the POST route.
router.route("/").get(getIssues).post(protect, reportIssue);

module.exports = router;

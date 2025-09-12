const express = require("express");
const { reportIssue, getIssues } = require("../controllers/IssueController");

const router = express.Router();

// Chain the .get() and .post() methods for the same route '/'
router.route("/").get(getIssues).post(reportIssue);

module.exports = router;

const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
} = require("../controllers/IssueController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);
router.route("/resolved").get(getResolvedIssues);

// Handle file uploads for issue creation
router.route("/")
  .get(getIssues)
  .post(
    protect,
    upload.array('photos', 3), // Max 3 files
    reportIssue
  );

module.exports = router;

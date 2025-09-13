const express = require("express");
const {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
} = require("../controllers/IssueController");
const { protect, optionalProtect } = require("../middlewares/authMiddleware");
const upload = require("../middleware/upload"); // Make sure multer is imported

const router = express.Router();

router.route("/my-issues").get(protect, getMyIssues);
router.route("/resolved").get(getResolvedIssues);

// This is the critical part:
// 1. `optionalProtect` checks for a user token without blocking the request.
// 2. `upload.array('images', 5)` processes the files AND the text fields.
// 3. `reportIssue` is the final controller that handles the logic.
router
  .route("/")
  .get(getIssues)
  .post(optionalProtect, upload.array("images", 5), reportIssue);

module.exports = router;

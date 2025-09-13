const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeams,
  addMember,
  removeMember,
  leaveTeam,
  disbandTeam,
  assignIssueToTeam,
  removeIssueFromTeam,
  resolveIssue,
} = require("../controllers/teamController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/create", protect, createTeam);
router.get("/", getTeams);
router.post("/members", protect, addMember);
router.post("/remove-member", protect, removeMember);
router.post("/leave", protect, leaveTeam);
router.post("/disband", protect, disbandTeam);
router.post("/assign-issue", protect, assignIssueToTeam);
router.post("/remove-issue", protect, removeIssueFromTeam);
router.post("/resolve-issue", protect, resolveIssue);

module.exports = router;

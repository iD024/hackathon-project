const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeams,
  addMember,
  removeMember,
  leaveTeam,
  disbandTeam,
} = require("../controllers/teamController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createTeam);
router.get("/", getTeams);
router.post("/members", protect, addMember);
router.post("/members/remove", protect, removeMember);
router.post("/leave", protect, leaveTeam);
router.post("/disband", protect, disbandTeam);

module.exports = router;

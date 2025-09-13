const express = require("express");
const router = express.Router();
const {
  sendInvitation,
  getNotifications,
  respondToInvitation,
} = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/invite", protect, sendInvitation);
router.get("/", protect, getNotifications);
router.post("/respond", protect, respondToInvitation);

module.exports = router;

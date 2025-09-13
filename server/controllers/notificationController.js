const Notification = require("../models/Notification");
const Team = require("../models/Team");

exports.sendInvitation = async (req, res) => {
  const { recipientId, teamId } = req.body;
  const senderId = req.user.id;

  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      team: teamId,
      type: "invitation",
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error sending invitation", error });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender", "name")
      .populate({
        path: "team",
        populate: {
          path: "leader",
          select: "name",
        },
      });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

exports.respondToInvitation = async (req, res) => {
  const { notificationId, response } = req.body;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification || notification.recipient.toString() !== req.user.id) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (response === "accepted") {
      const team = await Team.findById(notification.team);
      team.members.push(req.user.id);
      await team.save();
    }

    await Notification.findByIdAndDelete(notificationId);
    res.json({ message: "Responded to invitation and removed notification" });
  } catch (error) {
    res.status(500).json({ message: "Error responding to invitation", error });
  }
};

const Team = require("../models/Team");
const User = require("../models/User");
const Issue = require("../models/issue");

exports.createTeam = async (req, res) => {
  const { name } = req.body;
  try {
    const team = new Team({
      name,
      leader: req.user.id,
      members: [req.user.id],
    });

    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("members", "name email")
      .populate("issue", "title description");
    res.json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addMember = async (req, res) => {
  const { teamId, userId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team leader can add members" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isLeader = await Team.findOne({ leader: userId });
    if (isLeader) {
      return res
        .status(400)
        .json({ message: "Cannot add another team leader to a team" });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.removeMember = async (req, res) => {
  const { teamId, userId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team leader can remove members" });
    }

    team.members.pull(userId);
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.leaveTeam = async (req, res) => {
  const { teamId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader.toString() === req.user.id) {
      return res
        .status(400)
        .json({
          message: "Team leader cannot leave the team, must disband it",
        });
    }

    team.members.pull(req.user.id);
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.disbandTeam = async (req, res) => {
  const { teamId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team leader can disband the team" });
    }

    await Team.findByIdAndDelete(teamId);
    res.json({ message: "Team disbanded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

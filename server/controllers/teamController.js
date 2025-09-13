const Team = require("../models/Team");
const User = require("../models/User");
const Issue = require("../models/issue");

exports.createTeam = async (req, res) => {
  const { name } = req.body;
  try {
    // Check if user is a business account
    const user = await User.findById(req.user.id);
    if (user.userType === "business") {
      return res.status(403).json({
        message: "Business accounts cannot create or join teams",
      });
    }

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
      .populate("leader", "name email")
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

    // Check if user is a business account
    if (user.userType === "business") {
      return res.status(403).json({
        message: "Business accounts cannot join teams",
      });
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
      return res.status(400).json({
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

    // Find issues assigned to the team and update them
    await Issue.updateMany(
      { _id: { $in: team.issue } },
      { $set: { status: "Reported", aiCategory: "Pending Analysis" } }
    );

    await Team.findByIdAndDelete(teamId);
    res.json({ message: "Team disbanded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.assignIssueToTeam = async (req, res) => {
  const { teamId, issueId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team leader can assign issues" });
    }

    if (team.issue) {
      return res
        .status(400)
        .json({ message: "This team already has an assigned issue." });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Update issue status to assigned
    issue.status = "Assigned";
    await issue.save();

    team.issue = issueId;
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.removeIssueFromTeam = async (req, res) => {
  const { teamId } = req.body;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the team leader can remove issues" });
    }

    // Update issue status back to reported when unassigned
    if (team.issue) {
      const issue = await Issue.findById(team.issue);
      if (issue) {
        issue.status = "Reported";
        await issue.save();
      }
    }

    team.issue = null;
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.resolveIssue = async (req, res) => {
  const { teamId } = req.body;
  try {
    console.log("Resolving issue for team:", teamId);
    console.log("User ID:", req.user.id);

    const team = await Team.findById(teamId).populate("issue");
    if (!team) {
      console.log("Team not found");
      return res.status(404).json({ message: "Team not found" });
    }

    console.log("Team found:", team.name);
    console.log("Team leader:", team.leader.toString());

    if (team.leader.toString() !== req.user.id) {
      console.log("Permission denied - not team leader");
      return res
        .status(403)
        .json({ message: "Only the team leader can resolve issues" });
    }

    if (!team.issue) {
      console.log("No issue assigned to team");
      return res
        .status(400)
        .json({ message: "No issue assigned to this team" });
    }

    console.log("Resolving issue:", team.issue._id);
    // Update the issue status to "Resolved" instead of deleting
    await Issue.findByIdAndUpdate(team.issue._id, { status: "Resolved" });

    // Remove the issue from the team so they can take on new issues
    team.issue = null;
    await team.save();

    console.log("Issue resolved successfully");
    res.json(team);
  } catch (error) {
    console.error("Error resolving issue:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

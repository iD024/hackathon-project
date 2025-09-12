const Issue = require("../models/issue");

/**
 * @desc    Report a new civic issue
 * @route   POST /api/v1/issues
 * @access  Public (for now)
 */
const reportIssue = async (req, res) => {
  try {
    const { description, location } = req.body;

    
    if (!description || !location) {
      return res
        .status(400)
        .json({ message: "Description and location are required." });
    }

    // Mocking user and photo for now as requested
    const newIssue = await Issue.create({
      description,
      location,
      reportedBy: "mock_user_id", // TODO: Replace with actual user ID from auth
      photoUrl: "https://placehold.co/600x400/EEE/31343C?text=Civic+Issue", // Mock photo
    });

    res.status(201).json(newIssue);
  } catch (error) {
    console.error("ERROR REPORTING ISSUE:", error);
    res
      .status(400)
      .json({ message: "Error reporting issue", error: error.message });
  }
};

/**
 * @desc    Get all civic issues
 * @route   GET /api/v1/issues
 * @access  Public
 */
const getIssues = async (req, res) => {
  try {
    // Find all issues and sort by the most recent (`createdAt: -1`)
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error("ERROR FETCHING ISSUES:", error);
    res
      .status(400)
      .json({ message: "Error fetching issues", error: error.message });
  }
};

module.exports = {
  reportIssue,
  getIssues,
};

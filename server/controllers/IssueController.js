const Issue = require("../models/issue");

/**
 * @desc    Report a new civic issue
 * @route   POST /api/v1/issues
 * @access  Private (now protected)
 */
const reportIssue = async (req, res) => {
  try {
    const { description, location } = req.body;

    if (!description || !location) {
      return res
        .status(400)
        .json({ message: "Description and location are required." });
    }

    // The 'protect' middleware gives us the logged-in user via req.user
    const newIssue = await Issue.create({
      description,
      location,
      // Replace the mock user ID with the actual authenticated user's ID
      reportedBy: req.user._id,
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

/**
 * @desc    Get logged in user's issues
 * @route   GET /api/v1/issues/my-issues
 * @access  Private
 */
const getMyIssues = async (req, res) => {
  try {
    // The protect middleware gives us the user via req.user
    // Find issues where 'reportedBy' matches the logged-in user's ID
    const issues = await Issue.find({ reportedBy: req.user._id });
    res.status(200).json(issues);
  } catch (error) {
    console.error("ERROR FETCHING USER ISSUES:", error);
    res
      .status(400)
      .json({ message: "Error fetching user issues", error: error.message });
  }
};

module.exports = {
  reportIssue,
  getIssues,
  getMyIssues,
};

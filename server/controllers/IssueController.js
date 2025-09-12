const Issue = require("../models/issue");
const axios = require("axios"); // Import the axios library

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

    let issueCategory = "General Inquiry"; //

    try {
      const triageResponse = await axios.post("http://1227.0.0.1:5001/triage", {
        description: description,
      });

      // Map the response from the AI service to our schema fields
      issueCategory = triageResponse.data.category; // from Python service
      issueSeverity = triageResponse.data.priority; // from Python service
    } catch (aiError) {
      console.error("AI Triage Service Error:", aiError.message);
    }

    const newIssue = await Issue.create({
      description,
      location,
      reportedBy: req.user._id,
      photoUrl: "https://placehold.co/600x400/EEE/31343C?text=Civic+Issue",
      aiCategory: issueCategory,
      aiSeverity: issueSeverity,
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

const Issue = require("../models/issue");
const axios = require("axios"); // Import the axios library
const { uploadMultipleToFirebase } = require("../services/firebaseUpload");

/**
 * @desc    Report a new civic issue
 * @route   POST /api/v1/issues
 * @access  Private (now protected)
 */
const reportIssue = async (req, res) => {
  try {
    const { title, description, location, images } = req.body;

    if (!description || !location) {
      return res
        .status(400)
        .json({ message: "Description and location are required." });
    }

    const reportedBy = req.user ? req.user._id : null;

    let issueCategory = "General Inquiry";
    let issueSeverity = "Pending";

    try {
      const triageResponse = await axios.post("http://127.0.0.1:5002/triage", {
        description: description,
      });

      issueCategory = triageResponse.data.category;
      issueSeverity = triageResponse.data.priority;
    } catch (aiError) {
      console.error("AI Triage Service Error:", aiError.message);
    }

    if (
      !location.type ||
      location.type !== "Point" ||
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        message:
          "Invalid location format. Expected GeoJSON Point with coordinates array.",
      });
    }

    const imageUrls = images || [];

    const newIssue = await Issue.create({
      title,
      description,
      location,
      images: imageUrls,
      reportedBy,
      aiCategory: issueCategory,
      aiSeverity: issueSeverity,
    });

    res.status(201).json(newIssue);
  } catch (error) {
    console.error("ERROR REPORTING ISSUE:", error);
    res
      .status(500)
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
    const issues = await Issue.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });
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
    const issues = await Issue.find({ reportedBy: req.user._id }).populate(
      "reportedBy",
      "name email"
    );
    res.status(200).json(issues);
  } catch (error) {
    console.error("ERROR FETCHING USER ISSUES:", error);
    res
      .status(400)
      .json({ message: "Error fetching user issues", error: error.message });
  }
};

/**
 * @desc    Get all resolved issues
 * @route   GET /api/v1/issues/resolved
 * @access  Public
 */
const getResolvedIssues = async (req, res) => {
  try {
    const resolvedIssues = await Issue.find({ status: "Resolved" })
      .populate("reportedBy", "name email")
      .sort({ updatedAt: -1 });
    res.status(200).json(resolvedIssues);
  } catch (error) {
    console.error("ERROR FETCHING RESOLVED ISSUES:", error);
    res.status(400).json({
      message: "Error fetching resolved issues",
      error: error.message,
    });
  }
};

module.exports = {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
};

const Issue = require("../models/issue");
const axios = require("axios");
// The server-side uploader is no longer needed here as the client handles it.

const reportIssue = async (req, res) => {
  try {
    // Destructure title, description, location, and images from the JSON body
    const { title, description, location, images } = req.body;

    if (!description || !location) {
      return res
        .status(400)
        .json({ message: "Description and location are required." });
    }

    // The client sends a fully-formed JSON object.
    // `location` is an object, and `images` is an array of URLs.
    // No JSON parsing or server-side upload is needed.

    const newIssue = await Issue.create({
      title,
      description,
      location, // Use the location object directly
      images: images || [], // Use the image URLs from the body, default to empty array
      reportedBy: req.user ? req.user._id : null,
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

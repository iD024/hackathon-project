const Issue = require("../models/issue");
const axios = require("axios");
const { uploadMultipleToFirebase } = require("../services/firebaseUpload"); // Server-side uploader

const reportIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!description || !location) {
      return res
        .status(400)
        .json({ message: "Description and location are required." });
    }

    // Parse the location JSON string from FormData
    const parsedLocation = JSON.parse(location);

    // Upload images from the server to Firebase
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        // Use the server-side uploader, which takes multer file objects
        imageUrls = await uploadMultipleToFirebase(req.files, "issues");
      } catch (uploadError) {
        console.error("Firebase upload error on server:", uploadError);
        return res.status(500).json({ message: "Failed to upload images." });
      }
    }

    const newIssue = await Issue.create({
      title,
      description,
      location: parsedLocation,
      images: imageUrls, // Use the new URLs from Firebase
      reportedBy: req.user ? req.user._id : null,
      // AI fields can be added back here later
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

const Issue = require("../models/issue");
const axios = require("axios"); // Import the axios library

/**
 * @desc    Report a new civic issue
 * @route   POST /api/v1/issues
 * @access  Private (now protected)
 */
const reportIssue = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Request user:", req.user);
    
    // Parse the location from the form data
    let location;
    try {
      location = JSON.parse(req.body.location);
    } catch (e) {
      console.error("Error parsing location:", e);
      return res.status(400).json({ message: "Invalid location format." });
    }
    
    const { title, description } = req.body;

    if (!description || !location) {
      console.log("Missing required fields - description:", !!description, "location:", !!location);
      return res
        .status(400)
        .json({ message: "Description and location are required." });
    }

    if (!req.user || !req.user._id) {
      console.log("User not authenticated or missing user ID");
      return res
        .status(401)
        .json({ message: "User authentication required." });
    }

    let issueCategory = "General Inquiry";
    let issueSeverity = "Pending"; // Default value

    try {
      const triageResponse = await axios.post("http://127.0.0.1:5002/triage", {
        description: description,
      });

      // Map the response from the AI service to our schema fields
      issueCategory = triageResponse.data.category; // from Python service
      issueSeverity = triageResponse.data.priority; // from Python service
    } catch (aiError) {
      console.error("AI Triage Service Error:", aiError.message);
    }

    console.log("Creating issue with data:", {
      title,
      description,
      location,
      reportedBy: req.user._id,
      aiCategory: issueCategory,
      aiSeverity: issueSeverity,
    });

    // Validate location structure
    if (!location.type || location.type !== 'Point' || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      console.log("Invalid location format:", location);
      return res.status(400).json({ 
        message: "Invalid location format. Expected GeoJSON Point with coordinates array." 
      });
    }

    // Handle single image upload
    let imagePath = '';
    let photoUrl = '';
    
    if (req.file) {
      imagePath = req.file.path;
      // Create a URL that can be accessed from the client
      photoUrl = `/${imagePath.replace(/\\/g, '/')}`; // Convert Windows paths to URL format
    }

    const newIssue = await Issue.create({
      title,
      description,
      location,
      images: imagePath ? [imagePath] : [],
      photoUrl: photoUrl,
      reportedBy: req.user._id,
      aiCategory: issueCategory,
      aiSeverity: issueSeverity,
    });

    console.log("Issue created successfully:", newIssue);
    res.status(201).json(newIssue);
  } catch (error) {
    console.error("ERROR REPORTING ISSUE:", error);
    console.error("Error stack:", error.stack);
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
      .populate('reportedBy', 'name email')
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
    const issues = await Issue.find({ reportedBy: req.user._id })
      .populate('reportedBy', 'name email');
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
    const resolvedIssues = await Issue.find({ status: 'Resolved' })
      .populate('reportedBy', 'name email')
      .sort({ updatedAt: -1 });
    res.status(200).json(resolvedIssues);
  } catch (error) {
    console.error("ERROR FETCHING RESOLVED ISSUES:", error);
    res
      .status(400)
      .json({ message: "Error fetching resolved issues", error: error.message });
  }
};

module.exports = {
  reportIssue,
  getIssues,
  getMyIssues,
  getResolvedIssues,
};

const Issue = require("../models/issue");

const reportIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!description || !location) {
      return res
        .status(400)
        .json({ message: "Description and location are required." });
    }

    // Since location comes from FormData, it will be a string. We need to parse it.
    const parsedLocation = JSON.parse(location);

    // Get the filenames of uploaded images from req.files, which is handled by multer.
    let imageFilenames = [];
    if (req.files && req.files.length > 0) {
      imageFilenames = req.files.map((file) => file.filename);
    }

    const newIssue = await Issue.create({
      title,
      description,
      location: parsedLocation,
      images: imageFilenames, // Save the array of filenames
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

// ... (The rest of the file remains the same)

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

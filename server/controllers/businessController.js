const Business = require("../models/Business");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Create a new business listing
const createBusiness = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      address,
      phone,
      email,
      website,
      hours,
      coordinates,
    } = req.body;

    // Get the owner from the authenticated user
    const owner = req.user.id;

    // Check if user is a business type
    const user = await User.findById(owner);
    if (user.userType !== "business") {
      return res.status(403).json({
        success: false,
        message: "Only business users can create business listings",
      });
    }

    // Check if user already has a business listing
    const existingBusiness = await Business.findOne({ owner });
    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: "You already have a business listing",
      });
    }

    const businessData = {
      name,
      description,
      owner,
      category,
      address,
      phone,
      email,
      website,
      hours: hours ? JSON.parse(hours) : {},
      location: {
        type: "Point",
        coordinates: coordinates ? JSON.parse(coordinates) : [0, 0],
      },
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      businessData.images = req.files.map((file) => file.filename);
    }

    const business = await Business.create(businessData);

    res.status(201).json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all businesses
const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get business by ID
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get business by owner
const getBusinessByOwner = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id }).populate(
      "owner",
      "name email"
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "No business listing found",
      });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update business
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const {
      name,
      description,
      category,
      address,
      phone,
      email,
      website,
      hours,
      coordinates,
    } = req.body;

    const updateData = {
      name: name || business.name,
      description: description || business.description,
      category: category || business.category,
      address: address || business.address,
      phone: phone || business.phone,
      email: email || business.email,
      website: website || business.website,
      hours: hours ? JSON.parse(hours) : business.hours,
      location: coordinates
        ? {
            type: "Point",
            coordinates: JSON.parse(coordinates),
          }
        : business.location,
      updatedAt: new Date(),
    };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      updateData.images = [...business.images, ...newImages];
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      business._id,
      updateData,
      { new: true }
    ).populate("owner", "name email");

    res.status(200).json({
      success: true,
      data: updatedBusiness,
    });
  } catch (error) {
    console.error("Error updating business:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete business
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    // Delete associated images
    if (business.images && business.images.length > 0) {
      business.images.forEach((image) => {
        const imagePath = path.join(__dirname, "../uploads", image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Business.findByIdAndDelete(business._id);

    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createBusiness,
  getBusinesses,
  getBusinessById,
  getBusinessByOwner,
  updateBusiness,
  deleteBusiness,
};

const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a business name"],
  },
  description: {
    type: String,
    required: [true, "Please add a business description"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please add a business category"],
  },
  address: {
    type: String,
    required: [true, "Please add a business address"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
  },
  email: {
    type: String,
    required: [true, "Please add a business email"],
  },
  website: {
    type: String,
  },
  images: [{
    type: String, // Store image URLs
  }],
  hours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for location-based queries
businessSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Business", businessSchema);

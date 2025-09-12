const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please add a description of the issue'],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude] -- scary stuff lmao
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['Reported', 'Assigned', 'Resolved'],
    default: 'Reported',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // these things gonna be edited by AI 
  aiCategory: {
    type: String,
    default: 'Pending Analysis', // -- this gonna change
  },
  aiSeverity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical', 'Pending'],
    default: 'Pending',
  },
  aiIsDuplicateFlag: {
    type: Boolean,
    default: false,
  },
});

// scary stuff
issueSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Issue', issueSchema);
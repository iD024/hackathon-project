const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
  },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;

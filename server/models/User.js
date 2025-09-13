const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ], // this thing too a while to understand ngl
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
  },
  userType: {
    type: String,
    enum: ['citizen', 'business'],
    default: 'citizen',
  },
  reputation: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) {
    return next();
  }

  // SALTS HAHAHHA
  const salt = await bcrypt.genSalt(10);
  // hashing
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// method to compare shit
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    linkedinId: {
      type: String,
      required: true,
      unique: true, // each LinkedIn account is unique
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    profilePicture: {
      type: String, // store LinkedIn profile image URL if you fetch it
    },
    accessToken: {
      type: String, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    linkedinAccessToken: {
      type:String,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // auto manages createdAt & updatedAt
);

const User = mongoose.model("User", userSchema);

module.exports = User;

import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudnery
      required: true,
    },
    coverImage: {
      type: String, //cloudnery
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// Middleware executed before saving a user document
userSchema.pre("save", async function (next) {
  // Check if the password field has been modified
  if (!this.isModified("password")) return next();
  // Hash the password using bcrypt with a salt factor of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Proceed to save the document
  next();
});
// Method to compare a provided password with the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  // Compare the provided password with the hashed password
  return await bcrypt.compare(password, this.password);
};
// Method to generate an access token for the user
userSchema.methods.generateAccessToken = function () {
  // Sign a JSON payload containing user information with a secret key
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Token expiration time
    }
  );
};
// Method to generate a refresh token for the user
userSchema.methods.generateRefreshToken = function () {
  // Sign a JSON payload containing user ID with a secret key
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET, // Secret key for signing the token
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Token expiration time
    }
  );
};

export const User = mongoose.model("User", userSchema);

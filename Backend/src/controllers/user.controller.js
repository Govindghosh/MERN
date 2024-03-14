import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Function to generate access and refresh tokens for a given user ID
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // Generate a refresh token for the user
    const refreshToken = user.generateRefreshToken();

    // Generate an access and refresh token for the user
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;

    // Save the user object to the database, disabling validation before saving
    await user.save({ validateBeforeSave: false });

    // Return the refresh token and access token
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Token"
    );
  }
};
// Function to handle user registration
const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "ok",
  // });
  //------------------//
  // get user Details from frontend
  const { fullName, email, username, password } = req.body;
  // Validation - Check if any required field is empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // ckeck user already exists ?
  const existsUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existsUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // check for avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  console.log(
    "user.controller req.files",
    req.files,
    "avatarLocalPath",
    avatarLocalPath
  );
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file required ");
  }
  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file required");
  }
  // create user object - create entry in db
  const newUser = await User.create({
    fullName,
    email: email.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    username: username.toLowerCase(),
  });
  //remove password and refresh token fields from response
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});
// Get logged-in user details without sensitive information
const loginUser = asyncHandler(async (req, res) => {
  // get user Credentials from body
  const { email, username, password } = req.body;
  if (!(email || username)) {
    throw new ApiError(400, "username and email is required");
  }
  // find user Credentials from DB
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  // check password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user Credentials");
  }
  // Call the generateAccessAndRefreshTokens function to generate tokens for the user with the specified ID,
  // and destructure the returned object to extract the refreshToken and accessToken
  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // Find the user by their ID, excluding the password and refresh token fields from the retrieved document,
  // and assign the result to the loggedInUser variable
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set HTTP-only secure cookies for access and refresh tokens
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Return success response with logged-in user information
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In successfully"
      )
    );
});
// Controller function to handle user logout
const logoutUser = asyncHandler(async (req, res) => {
  // Update the user document in the database to remove the refresh token
  await User.findByIdAndUpdate(
    req.user._id, // Find the user by their ID
    {
      $set: {
        refreshToken: undefined, // Set the refresh token to undefined
      },
    },
    {
      new: true, // Return the updated document
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  // Send response indicating successful logout
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Export registerUser, loginUser, logoutUser functions
export { registerUser, loginUser, logoutUser };

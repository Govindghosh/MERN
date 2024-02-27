import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "ok",
  // });
  //------------------//
  // get user Details from frontend
  const { fullName, email, username, password } = req.body;
  // validation - not empty
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

export { registerUser };

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware function to verify JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extract JWT token from cookies or Authorization header
    const token =
      req.cookies?.accessToken || // Check for token in cookies
      req.header("Authorization")?.replace("Bearer ", ""); // Check for token in Authorization header

    // If token is not found, throw 401 Unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user corresponding to the token's user ID
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // If user not found, throw 401 Unauthorized error
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Attach user object to the request for further processing
    req.user = user;

    // Call next middleware or route handler
    next();
  } catch (error) {
    // If any error occurs during verification, throw 401 Unauthorized error
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

import Developer from "../models/developer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Ensure jwt is imported for refreshAccessToken
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

/* ---------------------- REGISTER ---------------------- */
const registerDeveloper = async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existedDeveloper = await Developer.findOne({
    $or: [{ username }, { email }],
  });
  
  if (existedDeveloper) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const developer = await Developer.create({
    email,
    username,
    password: hashedPassword,
    provider: "local" // Explicitly mark as local registration
  });

  const createdDeveloper = await Developer.findById(developer._id).select("-password");

  return res.status(201).json({
    message: "Developer registered successfully",
    data: createdDeveloper,
  });
};

/* ---------------------- LOGIN ---------------------- */
const loginDeveloper = async (req, res) => {
  const { email, password } = req.body;

  const developer = await Developer.findOne({ email });
  
  if (!developer) {
    return res.status(404).json({ message: "Developer does not exist" });
  }

  // CRITICAL: Prevent social users from logging in via local password form
  if (developer.provider !== "local" && !developer.password) {
    return res.status(400).json({ 
      message: `This account was created using ${developer.provider}. Please login with ${developer.provider}.` 
    });
  }

  const isPasswordValid = await bcrypt.compare(password, developer.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(developer._id);
  const refreshToken = generateRefreshToken(developer._id);

  developer.refreshToken = refreshToken;
  await developer.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // secure only in production
    sameSite: "lax"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Logged in successfully",
      developer: { 
        id: developer._id, 
        username: developer.username,
        email: developer.email,
        picture: developer.picture 
      },
    });
};

/* ---------------------- GET PROFILE ---------------------- */
// New: This function is required to let the frontend know who is logged in
const getCurrentDeveloper = async (req, res) => {
  // req.developer is populated by your auth middleware (VerifyJWT)
  const developer = await Developer.findById(req.developer?._id).select("-password -refreshToken");
  
  if (!developer) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ data: developer });
};

/* ---------------------- LOGOUT ---------------------- */
const logoutDeveloper = async (req, res) => {
  // Clear refresh token in DB
  await Developer.findByIdAndUpdate(
    req.developer._id,
    { $set: { refreshToken: null } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "Logged out successfully" });
};

/* ---------------------- REFRESH TOKEN ---------------------- */
const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const developer = await Developer.findById(decodedToken?._id);

    if (!developer || incomingRefreshToken !== developer.refreshToken) {
      return res.status(401).json({ message: "Refresh token is expired or used" });
    }

    const accessToken = generateAccessToken(developer._id);
    const newRefreshToken = generateRefreshToken(developer._id);

    developer.refreshToken = newRefreshToken;
    await developer.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        message: "Access token refreshed",
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    return res.status(401).json({ message: error?.message || "Invalid refresh token" });
  }
};

export {
  registerDeveloper,
  loginDeveloper,
  logoutDeveloper,
  refreshAccessToken,
  getCurrentDeveloper // Export the new profile function
};
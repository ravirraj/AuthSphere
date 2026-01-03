import jwt from "jsonwebtoken";
import Developer from "../models/developer.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // 1. Get token from cookies OR Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request: No token provided" });
    }

    // 2. Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find user in DB
    const developer = await Developer.findById(decodedToken?._id).select("-password -refreshToken");

    if (!developer) {
      return res.status(401).json({ message: "Invalid Access Token: User not found" });
    }

    // 4. Attach user object to the request
    req.developer = developer;
    next();
  } catch (error) {
    // Handle expired vs invalid tokens specifically if needed
    const message = error.name === "TokenExpiredError" ? "Token Expired" : "Invalid Token";
    return res.status(401).json({ message });
  }
};
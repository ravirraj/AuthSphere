import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js";
import Developer from "../models/developer.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const verifyJWT = async (req, res, next) => {
    try {

        let token = req.cookies?.accessToken
            || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, conf.accessTokenSecret);

        const developer = await Developer.findById(decoded?._id)
            .select("-password -refreshToken");

        if (!developer) {
            return res.status(401).json({ message: "User not found or token invalid" });
        }

        req.developer = developer;
        next();
    } catch (error) {
        console.log("JWT Error:", error);

        if (error.name === "TokenExpiredError") {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: "Token expired, please login again" });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, conf.refreshTokenSecret);
                const developer = await Developer.findById(decodedRefresh._id);

                if (!developer || developer.refreshToken !== refreshToken) {
                    return res.status(401).json({ message: "Invalid refresh token" });
                }

                // Generate new tokens
                const newAccessToken = generateAccessToken(developer._id);
                const newRefreshToken = generateRefreshToken(developer._id);

                developer.refreshToken = newRefreshToken;
                await developer.save({ validateBeforeSave: false });

                const cookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                };

                res.cookie("accessToken", newAccessToken, cookieOptions);
                res.cookie("refreshToken", newRefreshToken, cookieOptions);

                req.developer = developer;
                return next();
            } catch (refreshError) {
                console.log("Refresh Token Error:", refreshError);
                return res.status(401).json({ message: "Session expired, please login again" });
            }
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({ message: "Authentication failed" });
    }
};

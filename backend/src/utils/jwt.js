import jwt from "jsonwebtoken";
import { conf } from "../configs/env.js";

// Function to generate Access Token
export const generateAccessToken = (developerId) => {
    return jwt.sign(
        { _id: developerId },
        conf.accessTokenExpiry,
        { expiresIn:conf.accessTokenExpiry || '1d' }
    );
};

// Function to generate Refresh Token
export const generateRefreshToken = (developerId) => {
    return jwt.sign(
        { _id: developerId },
        conf.refreshTokenSecret,
        { expiresIn: conf.refreshTokenExpiry || '10d' }
    );
};
import DeveloperSession from "../models/developerSession.model.js";

/**
 * Middleware to update lastActive timestamp for the current session
 */
export const trackSessionActivity = async (req, res, next) => {
  try {
    if (req.developer && req.cookies.refreshToken) {
      await DeveloperSession.findOneAndUpdate(
        { refreshToken: req.cookies.refreshToken, developer: req.developer._id },
        { lastActive: new Date() }
      );
    }
    next();
  } catch (error) {
    // We don't want to block the request if session tracking fails
    console.error("Session tracking error:", error);
    next();
  }
};

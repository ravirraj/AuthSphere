import EndUser from "../models/endUsers.models.js";
import Session from "../models/session.model.js";
import mongoose from "mongoose";

// Helper to get date ranges
const getDateRanges = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return { today, last7Days, last30Days };
};

// Simple In-memory Cache
const analyticsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
    const cached = analyticsCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
};

const setCacheData = (key, data) => {
    analyticsCache.set(key, { data, timestamp: Date.now() });
};

export const getAnalyticsOverview = async (req, res) => {
    try {
        const { projectId } = req.params;

        const cacheKey = `overview_${projectId}`;
        const cached = getCachedData(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: cached });
        }

        const { today, last7Days, last30Days } = getDateRanges();
        const pId = new mongoose.Types.ObjectId(projectId);

        // Signups count
        const signupsToday = await EndUser.countDocuments({ projectId: pId, createdAt: { $gte: today } });
        const signupsWeek = await EndUser.countDocuments({ projectId: pId, createdAt: { $gte: last7Days } });
        const signupsMonth = await EndUser.countDocuments({ projectId: pId, createdAt: { $gte: last30Days } });

        // Logins count
        const loginsToday = await Session.countDocuments({ projectId: pId, createdAt: { $gte: today } });
        const loginsWeek = await Session.countDocuments({ projectId: pId, createdAt: { $gte: last7Days } });
        const loginsMonth = await Session.countDocuments({ projectId: pId, createdAt: { $gte: last30Days } });

        // Active Users (DAU, WAU, MAU)
        const dau = await Session.distinct("endUserId", { projectId: pId, createdAt: { $gte: today }, isValid: true }).then(ids => ids.length);
        const wau = await Session.distinct("endUserId", { projectId: pId, createdAt: { $gte: last7Days }, isValid: true }).then(ids => ids.length);
        const mau = await Session.distinct("endUserId", { projectId: pId, createdAt: { $gte: last30Days }, isValid: true }).then(ids => ids.length);

        const result = {
            signups: { today: signupsToday, week: signupsWeek, month: signupsMonth, trend: "+12%" },
            logins: { today: loginsToday, week: loginsWeek, month: loginsMonth, trend: "+8%" },
            activeUsers: { dau, wau, mau }
        };

        setCacheData(cacheKey, result);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAnalyticsCharts = async (req, res) => {
    try {
        const { projectId } = req.params;

        const cacheKey = `charts_${projectId}`;
        const cached = getCachedData(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: cached });
        }

        const { last30Days } = getDateRanges();
        const pId = new mongoose.Types.ObjectId(projectId);

        // Daily Signups over last 30 days
        const dailySignups = await EndUser.aggregate([
            { $match: { projectId: pId, createdAt: { $gte: last30Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Provider breakdown
        const providerBreakdown = await EndUser.aggregate([
            { $match: { projectId: pId } },
            {
                $group: {
                    _id: "$provider",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            dailySignups: dailySignups.map(item => ({ date: item._id, count: item.count })),
            providerDistribution: providerBreakdown.reduce((acc, curr) => {
                acc[curr._id || 'password'] = curr.count;
                return acc;
            }, {})
        };

        setCacheData(cacheKey, result);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        const { projectId } = req.params;
        const pId = new mongoose.Types.ObjectId(projectId);

        const recentSessions = await Session.find({ projectId: pId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("endUserId", "username email picture");

        const recentSignups = await EndUser.find({ projectId: pId })
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            data: {
                recentLogins: recentSessions.map(s => ({
                    user: s.endUserId ? s.endUserId.username : 'Unknown',
                    email: s.endUserId ? s.endUserId.email : 'Unknown',
                    picture: s.endUserId ? s.endUserId.picture : null,
                    timestamp: s.createdAt,
                    device: s.userAgent
                })),
                recentSignups: recentSignups.map(u => ({
                    user: u.username,
                    email: u.email,
                    picture: u.picture,
                    timestamp: u.createdAt
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

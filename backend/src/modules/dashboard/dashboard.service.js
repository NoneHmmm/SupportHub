import { Ticket, User, ActivityLog } from "../../models/index.js";
import { ROLES } from "../../constants/index.js";

// ────────────── helpers ──────────────

const buildFilter = (query) => {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.priority) filter.priority = query.priority;
    return filter;
};

const dateDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
};

// ────────────── GET /api/dashboard ──────────────
/** General dashboard — lightweight overview for any authenticated user */
export const getGeneralDashboard = async (userId) => {
    const totalTickets = await Ticket.countDocuments();
    const totalUsers = await User.countDocuments();

    const recentTickets = await Ticket.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("senderId", "fullName email")
        .populate("assignedTo", "fullName email")
        .lean();

    const statusCounts = await Ticket.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const priorityCounts = await Ticket.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    return {
        totalTickets,
        totalUsers,
        recentTickets,
        byStatus: Object.fromEntries(statusCounts.map((s) => [s._id, s.count])),
        byPriority: Object.fromEntries(priorityCounts.map((p) => [p._id, p.count])),
    };
};

// ────────────── GET /api/dashboard/admin ──────────────
export const getAdminDashboard = async () => {
    // ── User stats ──
    const [
        totalUsers,
        totalAgents,
        totalAdmins,
        totalCustomers,
        totalLeaders,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: ROLES.AGENT }),
        User.countDocuments({ role: ROLES.ADMIN }),
        User.countDocuments({ role: ROLES.CUSTOMER }),
        User.countDocuments({ role: ROLES.LEAD }),
    ]);

    // ── Ticket stats ──
    const totalTickets = await Ticket.countDocuments();

    const statusCounts = await Ticket.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const priorityCounts = await Ticket.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // ── Ticket trend (last 30 days) ──
    const thirtyDaysAgo = dateDaysAgo(30);
    const ticketTrend = await Ticket.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // ── Tickets created today / this week / this month ──
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = dateDaysAgo(7);
    const monthStart = dateDaysAgo(30);

    const [ticketsToday, ticketsThisWeek, ticketsThisMonth] = await Promise.all([
        Ticket.countDocuments({ createdAt: { $gte: todayStart } }),
        Ticket.countDocuments({ createdAt: { $gte: weekStart } }),
        Ticket.countDocuments({ createdAt: { $gte: monthStart } }),
    ]);

    // ── Average resolution time (for resolved tickets) ──
    const avgResolution = await Ticket.aggregate([
        {
            $match: {
                resolvedAt: { $ne: null },
                createdAt: { $ne: null },
            },
        },
        {
            $project: {
                diffMs: { $subtract: ["$resolvedAt", "$createdAt"] },
            },
        },
        {
            $group: {
                _id: null,
                avgMs: { $avg: "$diffMs" },
            },
        },
    ]);

    const avgResolutionHours =
        avgResolution.length > 0
            ? Math.round((avgResolution[0].avgMs / (1000 * 60 * 60)) * 100) / 100
            : 0;

    // ── Ticket assigned per agent ──
    const ticketsPerAgent = await Ticket.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "agent",
            },
        },
        { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 0,
                agentId: "$agent._id",
                agentName: "$agent.fullName",
                agentEmail: "$agent.email",
                count: 1,
            },
        },
        { $sort: { count: -1 } },
    ]);

    // ── Unassigned tickets count ──
    const unassignedTickets = await Ticket.countDocuments({
        assignedTo: { $exists: false },
    });

    // ── Average rating ──
    const avgRatingAgg = await Ticket.aggregate([
        { $match: { rating: { $ne: null } } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);
    const averageRating =
        avgRatingAgg.length > 0
            ? Math.round(avgRatingAgg[0].avg * 10) / 10
            : 0;

    return {
        users: {
            total: totalUsers,
            admin: totalAdmins,
            agent: totalAgents,
            customer: totalCustomers,
            leader: totalLeaders,
        },
        tickets: {
            total: totalTickets,
            byStatus: Object.fromEntries(statusCounts.map((s) => [s._id, s.count])),
            byPriority: Object.fromEntries(priorityCounts.map((p) => [p._id, p.count])),
            today: ticketsToday,
            thisWeek: ticketsThisWeek,
            thisMonth: ticketsThisMonth,
            unassigned: unassignedTickets,
        },
        performance: {
            averageResolutionHours: avgResolutionHours,
            averageRating,
        },
        ticketTrend,
        ticketsPerAgent,
    };
};

// ────────────── GET /api/dashboard/agent ──────────────
export const getAgentDashboard = async (userId) => {
    const [
        totalAssigned,
        byStatus,
        resolvedCount,
        avgRatingAgg,
        recentTickets,
    ] = await Promise.all([
        Ticket.countDocuments({ assignedTo: userId }),
        Ticket.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Ticket.countDocuments({
            assignedTo: userId,
            status: "resolved",
        }),
        Ticket.aggregate([
            { $match: { assignedTo: userId, rating: { $ne: null } } },
            { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]),
        Ticket.find({ assignedTo: userId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate("senderId", "fullName email")
            .lean(),
    ]);

    const averageRating =
        avgRatingAgg.length > 0
            ? Math.round(avgRatingAgg[0].avg * 10) / 10
            : 0;

    // ── Tickets resolved this week / month ──
    const weekStart = dateDaysAgo(7);
    const monthStart = dateDaysAgo(30);
    const [resolvedThisWeek, resolvedThisMonth] = await Promise.all([
        Ticket.countDocuments({
            assignedTo: userId,
            resolvedAt: { $gte: weekStart },
        }),
        Ticket.countDocuments({
            assignedTo: userId,
            resolvedAt: { $gte: monthStart },
        }),
    ]);

    return {
        assignedTickets: {
            total: totalAssigned,
            byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
        },
        performance: {
            resolved: resolvedCount,
            resolvedThisWeek,
            resolvedThisMonth,
            averageRating,
        },
        recentTickets,
    };
};

// ────────────── GET /api/dashboard/customer ──────────────
export const getCustomerDashboard = async (userId) => {
    const [totalTickets, byStatus, byPriority, recentTickets] =
        await Promise.all([
            Ticket.countDocuments({ senderId: userId }),
            Ticket.aggregate([
                { $match: { senderId: userId } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            Ticket.aggregate([
                { $match: { senderId: userId } },
                { $group: { _id: "$priority", count: { $sum: 1 } } },
            ]),
            Ticket.find({ senderId: userId })
                .sort({ updatedAt: -1 })
                .limit(5)
                .populate("assignedTo", "fullName email")
                .lean(),
        ]);

    // ── My rating stats ──
    const ratingAgg = await Ticket.aggregate([
        { $match: { senderId: userId, rating: { $ne: null } } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    // ── Tickets resolved/closed (my satisfaction) ──
    const resolvedCount = await Ticket.countDocuments({
        senderId: userId,
        status: "resolved",
    });
    const closedCount = await Ticket.countDocuments({
        senderId: userId,
        status: "closed",
    });

    return {
        tickets: {
            total: totalTickets,
            byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
            byPriority: Object.fromEntries(byPriority.map((p) => [p._id, p.count])),
            resolved: resolvedCount,
            closed: closedCount,
        },
        rating: {
            average:
                ratingAgg.length > 0
                    ? Math.round(ratingAgg[0].avg * 10) / 10
                    : 0,
            count: ratingAgg.length > 0 ? ratingAgg[0].count : 0,
        },
        recentTickets,
    };
};

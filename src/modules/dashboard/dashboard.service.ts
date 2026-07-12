import { prisma } from "../../../lib/prisma";

export const getStudentDashboardOverview = async (userId: string) => {
  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // ==========================
  // User Info
  // ==========================
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // ==========================
  // Statistics
  // ==========================
  const totalBookings = await prisma.booking.count({
    where: {
      studentId: userId,
    },
  });

  const upcomingBookings = await prisma.booking.count({
    where: {
      studentId: userId,
      date: {
        gte: today,
      },
    },
  });

  const completedBookings = await prisma.booking.count({
    where: {
      studentId: userId,
      status: "CONFIRMED",
      date: {
        lt: today,
      },
    },
  });

  const cancelledBookings = await prisma.booking.count({
    where: {
      studentId: userId,
      status: "CANCELLED",
    },
  });

  // ==========================
  // Payment Summary
  // ==========================
  const totalPaid = await prisma.payment.aggregate({
    where: {
      userId,
      status: "COMPLETED",
    },
    _sum: {
      amount: true,
    },
  });

  // ==========================
  // Recent Bookings
  // ==========================
  const recentBookings = await prisma.booking.findMany({
    where: {
      studentId: userId,
    },
    include: {
      tutor: {
        include: {
          user: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // ==========================
  // Recent Payments
  // ==========================
  const recentPayments = await prisma.payment.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // ==========================
  // Next Session
  // ==========================
  const nextSession = await prisma.booking.findFirst({
    where: {
      studentId: userId,
      date: {
        gte: today,
      },
    },
    include: {
      tutor: {
        include: {
          user: true,
          category: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // ==========================
  // Weekly Progress
  // ==========================
  const currentWeek = new Date();
  currentWeek.setDate(currentWeek.getDate() - 6);

  const weeklyBookings = await prisma.booking.findMany({
    where: {
      studentId: userId,
      createdAt: {
        gte: currentWeek,
      },
    },
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weeklyProgress = days.map((day, index) => ({
    day,
    progress:
      weeklyBookings.length === 0
        ? 0
        : Math.min(100, weeklyBookings.length * 15 + index * 5),
  }));

  // ==========================
  // Profile Completion
  // ==========================
  let profileCompletion = 40;

  if (user.name) profileCompletion += 20;
  if (user.email) profileCompletion += 20;
  if (user.image) profileCompletion += 20;

  // ==========================
  // Response
  // ==========================
  return {
    profile: user,

    stats: {
      totalBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      totalPaid: totalPaid._sum.amount ?? 0,
      profileCompletion,
    },

    nextSession,

    recentBookings,

    recentPayments,

    weeklyProgress,
  };
};
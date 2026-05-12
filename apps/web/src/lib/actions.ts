"use server";

import { prisma } from "@tonbet/database";
import { revalidatePath } from "next/cache";

export async function getMarkets(category?: string) {
  try {
    const markets = await prisma.market.findMany({
      where: { 
        resolved: false,
        ...(category && category !== "all" ? { category } : {})
      },
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { bets: true, comments: true }
        }
      }
    });
    return { success: true, data: markets };
  } catch (error: any) {
    console.error("Error fetching markets:", error.message);
    return { success: false, error: "Failed to load markets" };
  }
}

export async function getMarket(id: string) {
  try {
    const market = await prisma.market.findUnique({
      where: { id },
      include: {
        creator: true,
        _count: {
          select: { bets: true, comments: true }
        },
        bets: {
          take: 10,
          orderBy: { created_at: "desc" },
          include: {
            user: true
          }
        }
      }
    });
    return { success: true, data: market };
  } catch (error: any) {
    return { success: false, error: "Failed to load market" };
  }
}

export async function getUserProfile(telegramId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { telegram_id: telegramId },
      include: {
        positions: {
          include: { market: true }
        },
        _count: {
          select: { bets: true, referrals: true }
        }
      }
    });
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: "Failed to load profile" };
  }
}

export async function getLeaderboard() {
  try {
    const users = await prisma.user.findMany({
      take: 20,
      orderBy: { points: "desc" },
      select: {
        id: true,
        username: true,
        telegram_id: true,
        points: true,
        _count: { select: { bets: true } }
      }
    });
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: "Failed to load leaderboard" };
  }
}

export async function createMarket(data: any) {
  // We call the internal API route logic here or use Prisma directly
  // Using direct Prisma for speed and type safety in Server Actions
  try {
    const liquidity = parseFloat(data.initialLiquidity || "10");
    const poolSize = liquidity / 2;

    const market = await prisma.market.create({
      data: {
        ...data,
        liquidity,
        yesPool: poolSize,
        noPool: poolSize,
        endDate: new Date(data.endDate)
      }
    });
    revalidatePath("/");
    revalidatePath("/markets");
    return { success: true, data: market };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getGlobalStats() {
  try {
    const totalVolume = await prisma.market.aggregate({
      _sum: { totalVolume: true }
    });
    const activeMarkets = await prisma.market.count({
      where: { resolved: false }
    });
    const totalUsers = await prisma.user.count();

    return {
      success: true,
      data: {
        totalVolume: totalVolume._sum.totalVolume || 0,
        activeMarkets,
        totalUsers
      }
    };
  } catch (error: any) {
    return { success: false, error: "Failed to load stats" };
  }
}
